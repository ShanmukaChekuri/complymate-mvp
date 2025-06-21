from typing import Dict, Any, Optional, List
import logging
import os
from pathlib import Path
from pdfrw import PdfReader, PdfWriter, PdfName, PdfString, PdfObject, IndirectPdfDict
from datetime import datetime

logger = logging.getLogger(__name__)

class RobustFormFillerService:
    """
    Robust PDF form filler that manually resolves indirect object references
    """
    
    def __init__(self):
        self.templates_dir = Path(__file__).parent.parent / "static" / "templates"
        self.output_dir = Path(__file__).parent.parent.parent / "generated_forms"
        self._ensure_directories()
        
    def _ensure_directories(self):
        self.templates_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def resolve_fields_manually(self, pdf_reader: PdfReader) -> Dict[str, Any]:
        """
        Manually resolve PDF form fields from indirect object references
        """
        fields_map = {}
        
        try:
            if not (pdf_reader.Root and pdf_reader.Root.AcroForm):
                logger.warning("No AcroForm found in PDF")
                return {}
            
            acroform = pdf_reader.Root.AcroForm
            fields_array = acroform.get(PdfName('/Fields'))
            
            if not fields_array:
                logger.warning("No Fields array found in AcroForm")
                return {}
            
            logger.info(f"Processing {len(fields_array)} field references...")
            
            for i, field_ref in enumerate(fields_array):
                try:
                    # Handle different types of references
                    field_obj = None
                    
                    if hasattr(field_ref, 'indirect') and field_ref.indirect:
                        # This is an indirect reference
                        field_obj = field_ref
                    elif isinstance(field_ref, tuple) and len(field_ref) == 2:
                        # This is a (obj_num, gen_num) tuple - need to resolve manually
                        obj_num, gen_num = field_ref
                        # pdfrw should have resolved this automatically, but let's try accessing it directly
                        field_obj = field_ref
                    else:
                        # Direct object
                        field_obj = field_ref
                    
                    if field_obj and hasattr(field_obj, 'get'):
                        # Extract field name
                        field_name_obj = field_obj.get(PdfName('/T'))
                        if field_name_obj:
                            # Clean up the field name
                            field_name = str(field_name_obj)
                            
                            # Remove various quote types
                            for quote_pair in [("'", "'"), ('"', '"'), ('(', ')'), ('[', ']')]:
                                if field_name.startswith(quote_pair[0]) and field_name.endswith(quote_pair[1]):
                                    field_name = field_name[1:-1]
                                    break
                            
                            # Get additional field info
                            field_type = field_obj.get(PdfName('/FT'))
                            current_value = field_obj.get(PdfName('/V'))
                            field_flags = field_obj.get(PdfName('/Ff'))
                            
                            fields_map[field_name] = {
                                'object': field_obj,
                                'type': str(field_type) if field_type else 'Unknown',
                                'current_value': str(current_value) if current_value else '',
                                'flags': str(field_flags) if field_flags else '',
                                'index': i,
                                'reference': field_ref
                            }
                            
                            # Log first few fields for debugging
                            if i < 10:
                                logger.debug(f"Field {i+1}: '{field_name}' (Type: {field_type})")
                
                except Exception as e:
                    logger.warning(f"Error processing field {i}: {e}")
                    continue
            
            logger.info(f"Successfully resolved {len(fields_map)} form fields")
            return fields_map
            
        except Exception as e:
            logger.error(f"Error resolving fields: {e}")
            return {}
    
    def generate_form(self, form_type: str, form_data: Dict[str, Any]) -> Optional[str]:
        """
        Generate filled PDF form
        """
        try:
            template_path = self.templates_dir / f"osha_{form_type.lower()}_template.pdf"
            if not template_path.exists():
                logger.error(f"Template not found: {template_path}")
                return None
            
            # Load PDF
            pdf_reader = PdfReader(str(template_path))
            
            # Resolve fields
            fields = self.resolve_fields_manually(pdf_reader)
            
            if not fields:
                logger.error("No fields found to fill")
                return None
            
            logger.info(f"Found {len(fields)} fillable fields")
            
            # Create output path
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_filename = f"osha_{form_type.lower()}_{timestamp}.pdf"
            output_path = self.output_dir / output_filename
            
            # Map and fill fields
            filled_count = self._fill_fields(fields, form_data, form_type)
            
            # Set NeedAppearances for proper rendering
            if pdf_reader.Root.AcroForm:
                pdf_reader.Root.AcroForm[PdfName('/NeedAppearances')] = PdfObject('true')
            
            # Write output
            PdfWriter().write(str(output_path), pdf_reader)
            
            if output_path.exists():
                file_size = os.path.getsize(output_path)
                logger.info(f"Generated form: {output_filename} ({file_size:,} bytes, {filled_count} fields filled)")
                return str(output_path)
            else:
                logger.error("Failed to create output file")
                return None
                
        except Exception as e:
            logger.error(f"Error generating form: {e}", exc_info=True)
            return None
    
    def _fill_fields(self, fields: Dict[str, Any], form_data: Dict[str, Any], form_type: str) -> int:
        """
        Fill PDF fields with form data
        """
        filled_count = 0
        
        # Create a comprehensive mapping strategy
        field_mappings = self._create_field_mappings(form_type)
        
        for field_name, field_info in fields.items():
            field_obj = field_info['object']
            value_to_fill = None
            
            # Strategy 1: Direct mapping from our predefined mappings
            for data_key, pdf_patterns in field_mappings.items():
                if data_key in form_data:
                    for pattern in pdf_patterns:
                        if pattern.lower() in field_name.lower():
                            value_to_fill = form_data[data_key]
                            logger.debug(f"Mapped '{data_key}' -> '{field_name}' via pattern '{pattern}'")
                            break
                    if value_to_fill:
                        break
            
            # Strategy 2: Fuzzy matching
            if not value_to_fill:
                for data_key, data_value in form_data.items():
                    if self._fuzzy_match(data_key, field_name):
                        value_to_fill = data_value
                        logger.debug(f"Fuzzy matched '{data_key}' -> '{field_name}'")
                        break
            
            # Strategy 3: For testing - fill some fields with test data
            if not value_to_fill and filled_count < 10:
                value_to_fill = f"TEST_VALUE_{filled_count + 1}"
                logger.debug(f"Test filling '{field_name}' with '{value_to_fill}'")
            
            # Fill the field
            if value_to_fill:
                try:
                    field_obj[PdfName('/V')] = PdfString(str(value_to_fill))
                    filled_count += 1
                    logger.debug(f"Filled '{field_name}' = '{value_to_fill}'")
                except Exception as e:
                    logger.warning(f"Failed to fill '{field_name}': {e}")
        
        logger.info(f"Filled {filled_count} out of {len(fields)} available fields")
        return filled_count
    
    def _create_field_mappings(self, form_type: str) -> Dict[str, List[str]]:
        """
        Create field mappings for different form types
        """
        common_mappings = {
            'establishment_name': ['establishment', 'company', 'employer', 'business'],
            'city': ['city'],
            'state': ['state'],
            'year_of_log': ['year', '20'],
            'employee_name': ['employee', 'worker', 'person', 'name'],
            'job_title': ['job', 'title', 'occupation', 'position'],
            'date_of_injury': ['date', 'injury', 'incident'],
            'location_of_event': ['location', 'where', 'occurred', 'event'],
            'description_of_injury': ['description', 'injury', 'illness', 'what happened'],
            'phone': ['phone', 'telephone'],
            'zip': ['zip', 'postal'],
            'naics_code': ['naics', 'classification'],
            'annual_average_employees': ['employee', 'annual', 'average'],
            'total_hours_worked': ['hours', 'worked', 'total']
        }
        
        # Form-specific mappings could be added here
        if form_type == "300":
            return common_mappings
        elif form_type == "300A":
            return common_mappings
        elif form_type == "301":
            return common_mappings
        
        return common_mappings
    
    def _fuzzy_match(self, data_key: str, field_name: str) -> bool:
        """
        Fuzzy matching between data keys and field names
        """
        data_words = set(data_key.lower().replace('_', ' ').split())
        field_words = set(field_name.lower().replace('_', ' ').split())
        
        # Remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'at', 'for'}
        data_words -= stop_words
        field_words -= stop_words
        
        # Check for significant overlap
        if len(data_words) > 0 and len(field_words) > 0:
            overlap = len(data_words.intersection(field_words))
            # Require at least 50% overlap of the smaller set
            min_words = min(len(data_words), len(field_words))
            return overlap >= max(1, min_words * 0.5)
        
        return False
    
    def discover_fields(self, form_type: str) -> List[str]:
        """
        Discover and display all field names in a PDF
        """
        template_path = self.templates_dir / f"osha_{form_type.lower()}_template.pdf"
        if not template_path.exists():
            return []
        
        pdf_reader = PdfReader(str(template_path))
        fields = self.resolve_fields_manually(pdf_reader)
        
        field_names = list(fields.keys())
        print(f"\n=== DISCOVERED FIELDS IN FORM {form_type.upper()} ===")
        for i, name in enumerate(sorted(field_names), 1):
            field_info = fields[name]
            print(f"{i:3d}. '{name}' (Type: {field_info['type']})")
        
        return field_names

# For compatibility
FormFillerService = RobustFormFillerService