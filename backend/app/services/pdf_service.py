from fastapi import UploadFile
from typing import Dict, Any, List
from enum import Enum
from pydantic import BaseModel
import pdfplumber
import re
import os

class OSHAFormType(str, Enum):
    OSHA_300 = "OSHA 300"
    OSHA_300A = "OSHA 300A"
    OSHA_301 = "OSHA 301"
    UNKNOWN = "Unknown"

class FieldConfidence(BaseModel):
    value: str
    confidence: float

class ExtractedData(BaseModel):
    fields: Dict[str, FieldConfidence]
    raw_text: str
    form_type: OSHAFormType

class MissingFields(BaseModel):
    missing: List[str]

class FormAnalysis(BaseModel):
    extracted: ExtractedData
    missing_fields: MissingFields
    completion_percentage: float

# 1. Upload and save PDF
async def upload_pdf(file: UploadFile, user_id: str) -> FormAnalysis:
    # Save file to disk
    pdf_path = f"/tmp/{user_id}_{file.filename}"
    with open(pdf_path, "wb") as f:
        f.write(await file.read())
    # Extract and analyze
    extracted = await extract_form_data(pdf_path)
    missing = await identify_missing_fields(extracted.fields, extracted.form_type)
    completion = await calculate_completion_percentage(extracted.fields, extracted.form_type)
    # Clean up file
    try:
        os.remove(pdf_path)
    except Exception:
        pass
    return FormAnalysis(
        extracted=extracted,
        missing_fields=MissingFields(missing=missing),
        completion_percentage=completion
    )

# 2. Extract text and fields
async def extract_form_data(pdf_path: str) -> ExtractedData:
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    form_type = await detect_form_type(text)
    fields = await map_fields(text, form_type)
    return ExtractedData(fields=fields, raw_text=text, form_type=form_type)

# 3. Detect form type
async def detect_form_type(text_content: str) -> OSHAFormType:
    if "Form 300A" in text_content:
        return OSHAFormType.OSHA_300A
    elif "Form 300" in text_content:
        return OSHAFormType.OSHA_300
    elif "Form 301" in text_content:
        return OSHAFormType.OSHA_301
    else:
        return OSHAFormType.UNKNOWN

# 4. Map fields (basic regex for MVP)
async def map_fields(text: str, form_type: OSHAFormType) -> Dict[str, FieldConfidence]:
    # Example: look for known field labels and extract values
    fields = {}
    # Simple regex patterns for demo (expand for real forms)
    patterns = {
        "Employer name": r"Employer name[:\s]*([\w\s,&.-]+)",
        "Year": r"Year[:\s]*([0-9]{4})",
        "Total cases": r"Total cases[:\s]*([0-9]+)",
    }
    for field, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            fields[field] = FieldConfidence(value=match.group(1).strip(), confidence=1.0)
        else:
            fields[field] = FieldConfidence(value="", confidence=0.0)
    return fields

# 5. Identify missing fields
async def identify_missing_fields(fields: Dict[str, FieldConfidence], form_type: OSHAFormType) -> List[str]:
    required = ["Employer name", "Year", "Total cases"]  # Expand for real forms
    return [f for f in required if not fields.get(f) or not fields[f].value]

# 6. Calculate completion percentage
async def calculate_completion_percentage(fields: Dict[str, FieldConfidence], form_type: OSHAFormType) -> float:
    required = ["Employer name", "Year", "Total cases"]
    filled = sum(1 for f in required if fields.get(f) and fields[f].value)
    return round(100 * filled / len(required), 2) if required else 0.0 