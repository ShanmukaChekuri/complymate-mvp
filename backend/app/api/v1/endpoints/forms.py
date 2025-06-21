from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body, Response
from sqlalchemy.orm import Session
import requests
import os
from fastapi.responses import JSONResponse
import re

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.form import Form, FormVersion, FormAnalysis
from app.schemas.form import (
    FormCreate,
    FormUpdate,
    FormResponse,
    FormVersionCreate,
    FormVersionResponse,
    FormAnalysisCreate,
    FormAnalysisResponse,
)
from app.core.config import settings
from app.services.form_filler_service import FormFillerService

router = APIRouter()

OPENROUTER_API_KEY = settings.OPENROUTER_API_KEY
if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is not set in environment variables.")

OPENROUTER_MODEL = settings.OPENROUTER_MODEL

@router.post("/", response_model=FormResponse)
def create_form(
    *,
    db: Session = Depends(get_db),
    form_in: FormCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new form.
    """
    form = Form(
        user_id=current_user.id,
        **form_in.dict()
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form

@router.get("/", response_model=List[FormResponse])
def list_forms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve forms.
    """
    forms = db.query(Form).filter(Form.user_id == current_user.id).offset(skip).limit(limit).all()
    return forms

@router.get("/{form_id}", response_model=FormResponse)
def get_form(
    *,
    db: Session = Depends(get_db),
    form_id: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get form by ID.
    """
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )
    return form

@router.put("/{form_id}", response_model=FormResponse)
def update_form(
    *,
    db: Session = Depends(get_db),
    form_id: str,
    form_in: FormUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update form.
    """
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )
    
    for field, value in form_in.dict(exclude_unset=True).items():
        setattr(form, field, value)
    
    db.add(form)
    db.commit()
    db.refresh(form)
    return form

@router.delete("/{form_id}", response_model=FormResponse)
def delete_form(
    *,
    db: Session = Depends(get_db),
    form_id: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete form.
    """
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )
    
    db.delete(form)
    db.commit()
    return form

@router.post("/{form_id}/versions", response_model=FormVersionResponse)
def create_form_version(
    *,
    db: Session = Depends(get_db),
    form_id: str,
    version_in: FormVersionCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new form version.
    """
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )
    
    version = FormVersion(
        form_id=form.id,
        created_by=current_user.id,
        **version_in.dict()
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version

@router.post("/{form_id}/analyze")
async def analyze_form(
    form_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Analyze uploaded PDF for the given form.
    """
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )

    # Save the uploaded file (for MVP, you can use a temp path)
    contents = await file.read()
    file_path = f"uploads/{form_id}_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text from PDF
    try:
        with pdfplumber.open(file_path) as pdf:
            all_text = ""
            for page in pdf.pages:
                all_text += page.extract_text() or ""
    except Exception as e:
        return {"error": f"Failed to extract PDF text: {str(e)}"}

    # Save extracted text in form.content
    form.content = {"text": all_text}
    db.add(form)
    db.commit()
    db.refresh(form)

    return {
        "message": "File uploaded and analyzed.",
        "filename": file.filename,
        "size": len(contents),
        "form_id": form_id,
        "extracted": {"text": all_text}
    }

def extract_fields(user_message: str, filled_fields: dict) -> dict:
    """
    Extracts all possible OSHA 300, 300A, and 301 fields from user input and updates filled_fields dict.
    The filled_fields dict is structured as follows:
    {
        'osha_300': {
            'cases': [
                {
                    'case_number': str,
                    'employee_name': str,
                    'job_title': str,
                    'injury_date': str,
                    'injury_location': str,
                    'description_of_injury': str,
                    'body_part_affected': str,
                    'object_substance': str,
                    'death': bool,
                    'days_away_from_work': bool,
                    'job_transfer_restriction': bool,
                    'other_recordable_cases': bool,
                    'days_away': str,
                    'days_restricted': str,
                    'injury_type': str,  # injury, skin_disorder, respiratory_condition, poisoning, hearing_loss, all_other_illnesses
                },
                ...
            ],
            'establishment_name': str,
            'city': str,
            'state': str,
            'year': str,
        },
        'osha_300a': {
            'total_deaths': str,
            'total_days_away': str,
            'total_days_restricted': str,
            'total_cases_days_away': str,
            'total_cases_job_transfer': str,
            'total_other_recordable_cases': str,
            'total_injuries': str,
            'total_skin_disorders': str,
            'total_respiratory_conditions': str,
            'total_poisonings': str,
            'total_hearing_loss': str,
            'total_other_illnesses': str,
            'establishment_name': str,
            'street': str,
            'city': str,
            'state': str,
            'zip': str,
            'industry_description': str,
            'sic': str,
            'naics': str,
            'annual_avg_employees': str,
            'total_hours_worked': str,
            'executive_name': str,
            'executive_title': str,
            'executive_phone': str,
            'certification_date': str,
        },
        'osha_301': {
            'employee_full_name': str,
            'employee_street': str,
            'employee_city': str,
            'employee_state': str,
            'employee_zip': str,
            'employee_dob': str,
            'employee_date_hired': str,
            'employee_gender': str,
            'case_number': str,
            'injury_date': str,
            'time_began_work': str,
            'time_of_event': str,
            'activity_before_incident': str,
            'how_injury_occurred': str,
            'injury_or_illness': str,
            'object_that_harmed': str,
            'date_of_death': str,
            'physician_name': str,
            'treatment_facility': str,
            'treatment_street': str,
            'treatment_city': str,
            'treatment_state': str,
            'treatment_zip': str,
            'treated_in_er': str,
            'hospitalized_overnight': str,
            'completed_by': str,
            'completed_by_title': str,
            'completed_by_phone': str,
            'completed_by_date': str,
        }
    }
    """
    msg = user_message.lower()
    # OSHA 300 fields (single-case extraction for chat, can be extended for multiple cases)
    osha_300 = filled_fields.get('osha_300', {})
    case = osha_300.get('cases', [{}])[0] if osha_300.get('cases') else {}
    # Case number
    match = re.search(r"case number is ([\w\-]+)", msg)
    if match:
        case['case_number'] = match.group(1).strip()
    # Employee name
    match = re.search(r"employee name is ([a-zA-Z ,.'-]+)", msg)
    if match:
        case['employee_name'] = match.group(1).strip()
    # Job title
    match = re.search(r"job title is ([a-zA-Z ,.'-]+)", msg)
    if match:
        case['job_title'] = match.group(1).strip()
    # Injury date
    match = re.search(r"injury date is ([0-9/\-]+)", msg)
    if match:
        case['injury_date'] = match.group(1).strip()
    # Injury location
    match = re.search(r"(location|place) (is|was|occurred at) ([a-zA-Z0-9 ,.'-]+)", msg)
    if match:
        case['injury_location'] = match.group(3).strip()
    # Description of injury
    match = re.search(r"description of injury is ([^\.]+)", msg)
    if match:
        case['description_of_injury'] = match.group(1).strip()
    # Body part affected
    match = re.search(r"body part (affected|injured) is ([a-zA-Z ,.'-]+)", msg)
    if match:
        case['body_part_affected'] = match.group(2).strip()
    # Object/substance
    match = re.search(r"object (that )?injured is ([a-zA-Z ,.'-]+)", msg)
    if match:
        case['object_substance'] = match.group(2).strip()
    # Death
    if re.search(r"(death|died|fatality)", msg):
        case['death'] = True
    # Days away from work
    if re.search(r"days away from work", msg):
        case['days_away_from_work'] = True
    # Job transfer or restriction
    if re.search(r"job transfer or restriction", msg):
        case['job_transfer_restriction'] = True
    # Other recordable cases
    if re.search(r"other recordable case", msg):
        case['other_recordable_cases'] = True
    # Days away
    match = re.search(r"days away is ([0-9]+)", msg)
    if match:
        case['days_away'] = match.group(1).strip()
    # Days restricted
    match = re.search(r"days restricted is ([0-9]+)", msg)
    if match:
        case['days_restricted'] = match.group(1).strip()
    # Injury type
    match = re.search(r"injury type is ([a-zA-Z_ ]+)", msg)
    if match:
        case['injury_type'] = match.group(1).strip()
    # Attach case to cases list
    osha_300['cases'] = [case]
    # Establishment info
    match = re.search(r"establishment name is ([a-zA-Z0-9 &.'-]+)", msg)
    if match:
        osha_300['establishment_name'] = match.group(1).strip()
    match = re.search(r"city is ([a-zA-Z ]+)", msg)
    if match:
        osha_300['city'] = match.group(1).strip()
    match = re.search(r"state is ([a-zA-Z ]+)", msg)
    if match:
        osha_300['state'] = match.group(1).strip()
    match = re.search(r"year is ([0-9]{4})", msg)
    if match:
        osha_300['year'] = match.group(1).strip()
    filled_fields['osha_300'] = osha_300

    # OSHA 300A fields
    osha_300a = filled_fields.get('osha_300a', {})
    for field, regex in [
        ('total_deaths', r"total deaths is ([0-9]+)"),
        ('total_days_away', r"total days away is ([0-9]+)"),
        ('total_days_restricted', r"total days restricted is ([0-9]+)"),
        ('total_cases_days_away', r"total cases with days away is ([0-9]+)"),
        ('total_cases_job_transfer', r"total cases with job transfer is ([0-9]+)"),
        ('total_other_recordable_cases', r"total other recordable cases is ([0-9]+)"),
        ('total_injuries', r"total injuries is ([0-9]+)"),
        ('total_skin_disorders', r"total skin disorders is ([0-9]+)"),
        ('total_respiratory_conditions', r"total respiratory conditions is ([0-9]+)"),
        ('total_poisonings', r"total poisonings is ([0-9]+)"),
        ('total_hearing_loss', r"total hearing loss is ([0-9]+)"),
        ('total_other_illnesses', r"total other illnesses is ([0-9]+)"),
        ('establishment_name', r"establishment name is ([a-zA-Z0-9 &.'-]+)"),
        ('street', r"street is ([a-zA-Z0-9 ,.'-]+)"),
        ('city', r"city is ([a-zA-Z ]+)",),
        ('state', r"state is ([a-zA-Z ]+)",),
        ('zip', r"zip is ([0-9]{5})"),
        ('industry_description', r"industry description is ([a-zA-Z0-9 ,.'-]+)"),
        ('sic', r"sic is ([0-9]+)"),
        ('naics', r"naics is ([0-9]+)"),
        ('annual_avg_employees', r"annual average employees is ([0-9]+)"),
        ('total_hours_worked', r"total hours worked is ([0-9]+)"),
        ('executive_name', r"executive name is ([a-zA-Z ,.'-]+)"),
        ('executive_title', r"executive title is ([a-zA-Z ,.'-]+)"),
        ('executive_phone', r"executive phone is ([0-9\-() ]+)"),
        ('certification_date', r"certification date is ([0-9/\-]+)"),
    ]:
        match = re.search(regex, msg)
        if match:
            osha_300a[field] = match.group(1).strip()
    filled_fields['osha_300a'] = osha_300a

    # OSHA 301 fields
    osha_301 = filled_fields.get('osha_301', {})
    for field, regex in [
        ('employee_full_name', r"employee full name is ([a-zA-Z ,.'-]+)"),
        ('employee_street', r"employee street is ([a-zA-Z0-9 ,.'-]+)"),
        ('employee_city', r"employee city is ([a-zA-Z ]+)"),
        ('employee_state', r"employee state is ([a-zA-Z ]+)"),
        ('employee_zip', r"employee zip is ([0-9]{5})"),
        ('employee_dob', r"employee date of birth is ([0-9/\-]+)"),
        ('employee_date_hired', r"employee date hired is ([0-9/\-]+)"),
        ('employee_gender', r"employee gender is (male|female)"),
        ('case_number', r"case number is ([\w\-]+)"),
        ('injury_date', r"injury date is ([0-9/\-]+)"),
        ('time_began_work', r"time employee began work is ([0-9:apm ]+)"),
        ('time_of_event', r"time of event is ([0-9:apm ]+)"),
        ('activity_before_incident', r"activity before incident is ([^\.]+)"),
        ('how_injury_occurred', r"how injury occurred is ([^\.]+)"),
        ('injury_or_illness', r"injury or illness is ([^\.]+)"),
        ('object_that_harmed', r"object that harmed is ([a-zA-Z ,.'-]+)"),
        ('date_of_death', r"date of death is ([0-9/\-]+)"),
        ('physician_name', r"physician name is ([a-zA-Z ,.'-]+)"),
        ('treatment_facility', r"treatment facility is ([a-zA-Z0-9 ,.'-]+)"),
        ('treatment_street', r"treatment street is ([a-zA-Z0-9 ,.'-]+)"),
        ('treatment_city', r"treatment city is ([a-zA-Z ]+)"),
        ('treatment_state', r"treatment state is ([a-zA-Z ]+)"),
        ('treatment_zip', r"treatment zip is ([0-9]{5})"),
        ('treated_in_er', r"treated in emergency room is (yes|no)"),
        ('hospitalized_overnight', r"hospitalized overnight is (yes|no)"),
        ('completed_by', r"completed by is ([a-zA-Z ,.'-]+)"),
        ('completed_by_title', r"completed by title is ([a-zA-Z ,.'-]+)"),
        ('completed_by_phone', r"completed by phone is ([0-9\-() ]+)"),
        ('completed_by_date', r"completed by date is ([0-9/\-]+)"),
    ]:
        match = re.search(regex, msg)
        if match:
            osha_301[field] = match.group(1).strip()
    filled_fields['osha_301'] = osha_301

    return filled_fields

@router.post("/{form_id}/chat")
def chat_with_form(
    form_id: str,
    message: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Chat about a specific form.
    """
    # First check if the form exists and belongs to the user
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )

    try:
        # Initialize chat service if not already initialized
        from app.services.chat_service import ChatService
        chat_service = ChatService()
        
        # Process the message
        response = chat_service.process_message(
            content=message.get("message", ""),
            user_id=current_user.id
        )
        
        return {
            "message": response,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{form_id}/export")
def export_form(
    form_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form or not form.content:
        raise HTTPException(status_code=404, detail="Form not found or not completed")
    return JSONResponse(content=form.content, headers={
        "Content-Disposition": f"attachment; filename=osha_form_{form_id}.json"
    }) 

@router.post("/generate/{form_type}")
async def generate_form(
    form_type: str,
    form_data: Dict[str, Any],
    form_filler: FormFillerService = Depends(lambda: FormFillerService())
) -> Dict[str, str]:
    """Generate a filled OSHA form"""
    if form_type not in ["300", "300A", "301"]:
        raise HTTPException(status_code=400, detail="Invalid form type")
        
    filled_form_path = form_filler.generate_form(form_type, form_data)
    if not filled_form_path:
        raise HTTPException(status_code=500, detail="Failed to generate form")
        
    return {"file_path": filled_form_path}

@router.get("/download/{form_type}/{filename}")
async def download_form(form_type: str, filename: str):
    """Download a generated OSHA form"""
    file_path = os.path.join("generated_forms", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Form not found")
        
    with open(file_path, "rb") as f:
        file_content = f.read()
        
    return Response(
        content=file_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="osha_{form_type}_{filename}"'
        }
    ) 