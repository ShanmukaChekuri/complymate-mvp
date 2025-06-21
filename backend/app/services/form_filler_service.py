from typing import Dict, Any, Optional
import logging
import os
from pathlib import Path
from pdfrw import PdfReader, PdfWriter, IndirectPdfDict, PdfObject, PdfName, PdfString
from datetime import datetime
from .llm_service import FORM_FIELDS # Import the single source of truth

logger = logging.getLogger(__name__)

# Constants from pdfrw for cleaner code
ANNOT_KEY = '/T'
ANNOT_FIELD_KEY = '/TU'
SUBTYPE_KEY = '/Subtype'
WIDGET_SUBTYPE = '/Widget'
PARENT_KEY = '/Parent'

class FormFillerService:
    def __init__(self):
        """Initialize the form filler service"""
        self.templates_dir = Path(__file__).parent.parent / "static" / "templates"
        self.output_dir = Path(__file__).parent.parent.parent / "generated_forms"
        self._ensure_directories()
        
    def _ensure_directories(self):
        """Ensure necessary directories exist"""
        self.templates_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def generate_form(self, form_type: str, form_data: Dict[str, Any]) -> Optional[str]:
        """Generate a filled OSHA form using pdfrw with correct practices"""
        try:
            template_path = self.templates_dir / f"osha_{form_type.lower()}_template.pdf"
            if not template_path.exists():
                logger.error(f"Template not found for form type: {form_type}")
                return None
                
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"osha_{form_type.lower()}_{timestamp}.pdf"
            output_path = self.output_dir / output_filename
            
            template_pdf = PdfReader(str(template_path))
            mapped_data = self._map_form_data(form_type, form_data)
            
            for page in template_pdf.pages:
                annotations = page.get('/Annots')
                if annotations is None:
                    continue

                for annotation in annotations:
                    if annotation.get(SUBTYPE_KEY) == WIDGET_SUBTYPE and annotation.get(ANNOT_KEY):
                        key = annotation[ANNOT_KEY][1:-1]  # Remove parentheses

                        if key in mapped_data:
                            value = mapped_data[key]
                            
                            # For radio buttons, the value is the name of the option to select
                            if annotation['/FT'] == '/Btn' and annotation.get('/Ff') and int(annotation['/Ff']) & (1 << 15):
                                # It's a radio button group. The value we have is the one to set.
                                for kid in annotation['/Kids']:
                                    # Find the export value of the radio button option
                                    export_value = None
                                    if kid['/AP'] and kid['/AP']['/N']:
                                        for k in kid['/AP']['/N'].keys():
                                            if k != '/Off':
                                                export_value = k[1:] # remove leading /
                                                break
                                    
                                    if export_value == value:
                                        kid.update(IndirectPdfDict(AS=PdfName(export_value)))
                                    else:
                                        kid.update(IndirectPdfDict(AS=PdfName("Off")))
                                annotation.update(IndirectPdfDict(V=PdfName(value)))

                            # For text fields - CORRECTED to remove parentheses
                            elif annotation['/FT'] == '/Tx':
                                annotation.update(
                                    IndirectPdfDict(V=PdfString(str(value)))
                                )

            if template_pdf.Root.AcroForm:
                template_pdf.Root.AcroForm.update(
                    IndirectPdfDict(NeedAppearances=PdfObject('true'))
                )

            PdfWriter().write(str(output_path), template_pdf)
            
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error generating form with pdfrw: {str(e)}", exc_info=True)
            return None
            
    def _map_form_data(self, form_type: str, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Map the collected form data to PDF field names using the single source of truth."""
        if form_type == "300":
            return self._map_form_300_data(form_data)
        elif form_type == "300A":
            return self._map_form_300A_data(form_data)
        elif form_type == "301":
            return self._map_form_301_data(form_data)
        else:
            raise ValueError(f"Unsupported form type: {form_type}")
            
    def _map_form_300_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Map data for OSHA Form 300 using a direct mapping."""
        # This mapping now translates from our internal, consistent keys
        # to the specific, sometimes quirky, field names in the PDF.
        pdf_field_map = {
            "year_of_log": "Log of Injury/Illness Year",
            "establishment_name": "Log of Injury/Illness Establishment name",
            "city": "Log of Injury/Illness City",
            "state": "Log of Injury/Illness State",
            "case_number": "1",
            "employee_name": "Employee's Name 1",
            "job_title": "Job Title 1",
            "location_of_event": "Where the Event Occurred 1",
            "description_of_injury": "Injury or Illness Description 1",
            "days_away_from_work": "Number of days injured or ill away from work 1",
            "days_on_transfer_or_restriction": "On job transfer or restriction 1",
        }
        
        mapped = {pdf_field_map.get(key): str(value) for key, value in data.items() if key in pdf_field_map}

        # Handle complex fields like dates and classifications
        if 'date_of_injury' in data and '/' in data['date_of_injury']:
            month, day = data['date_of_injury'].split('/')
            mapped["Date of injury or Illness month 1"] = month
            mapped["Date of injury or illness day 1"] = day

        classification = data.get("classification")
        class_map = {
            "death": "Death", "days_away": "Days away from work",
            "job_transfer": "Job transfer or restriction", "other_recordable": "Other recordable cases"
        }
        if classification in class_map:
            mapped["Group1"] = class_map[classification]
            # Totals
            for key, val in class_map.items():
                total_key = val + " Total"
                mapped[total_key] = "1" if classification == key else "0"

        injury_type = data.get("type_of_injury_or_illness")
        injury_map = {
            "injury": "Injury", "skin_disorder": "Skin Disorder",
            "respiratory_condition": "Respiratory Cond", "poisoning": "Poisoning",
            "hearing_loss": "Hearing Loss", "all_other_illnesses": "All other"
        }
        if injury_type in injury_map:
            mapped["Group1a"] = injury_map[injury_type]
            # Totals
            for key, val in injury_map.items():
                total_key = val.replace(" ", "") + " Total"
                if key == "hearing_loss": total_key = "Hearling Loss Total" # PDF typo
                mapped[total_key] = "1" if injury_type == key else "0"
        
        mapped["Number of days injured or ill away from work Total"] = str(data.get("days_away_from_work", "0"))
        mapped["On job transfer or restriction Total"] = str(data.get("days_on_transfer_or_restriction", "0"))

        return mapped
        
    def _map_form_300A_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Map data for OSHA Form 300A"""
        year = str(data.get("year", ""))
        year_2_digit = year[-2:] if len(year) == 4 else ""

        return {
            "Summary of Injury/Illness Year": year_2_digit,
            "Summary of Injury/Illness Establishment Name": data.get("establishment_name", ""),
            "Summary of Injury/Illness Street": data.get("street_address", ""),
            "Summary of Injury/Illness City": data.get("city", ""),
            "Summary of Injury/Illness State": data.get("state", ""),
            "Summary of Injury/Illness Zip": data.get("zip", ""),
            "Summary of Injury/Illness Industry description": data.get("industry_description", ""),
            "Summary of Injury/Illness NAICS": data.get("naics_code", ""),
            "Summary of Injury/Illness Annual avg num of employees": str(data.get("annual_average_employees", "")),
            "Summary of Injury/Illness Total hours worked by all employees last year": str(data.get("total_hours_worked", "")),
            "Total Deaths Summary": str(data.get("total_deaths", "0")),
            "Days away from work Summary": str(data.get("total_cases_with_days_away", "0")),
            "Job transfer or restriction Summary": str(data.get("total_cases_with_transfer", "0")),
            "Other recordable cases Summary": str(data.get("total_other_cases", "0")),
            "Number of days injured or ill away from work Summary": str(data.get("total_days_away", "0")),
            "On job transfer or restriction Summary": str(data.get("total_days_transfer", "0")),
            "Injury Summary": str(data.get("total_injuries", "0")),
            "Skin Disorder Summary": str(data.get("total_skin_disorders", "0")),
            "Respiratory Cond Summary": str(data.get("total_respiratory_conditions", "0")),
            "Poisoning Summary": str(data.get("total_poisonings", "0")),
            "Hearing Loss Summary": str(data.get("total_hearing_loss", "0")),
            "All other Summary": str(data.get("total_other_illnesses", "0")),
            "Name": data.get("certifier_name", ""),
            "Title": data.get("certifier_title", ""),
            "Summary of Injury/Illness Phone": data.get("phone", ""),
            "Summary of Injury/Illness Date": data.get("certification_date", ""),
        }
        
    def _map_form_301_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Map data for OSHA Form 301"""
        return {} 