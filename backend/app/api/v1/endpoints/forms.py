from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from sqlalchemy.orm import Session
import pdfplumber
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
    # Try to get first and last name, then full_name, then username, then 'User'
    first_name = getattr(current_user, 'first_name', None)
    last_name = getattr(current_user, 'last_name', None)
    if first_name and last_name:
        user_name = f"{first_name} {last_name}"
    else:
        user_name = (
            getattr(current_user, 'full_name', None)
            or getattr(current_user, 'username', None)
            or "User"
        )
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form or not form.content:
        raise HTTPException(status_code=404, detail="Form or extracted content not found")
    
    user_message = message.get("message", "")
    extracted_text = form.content.get("text", "")
    conversation_history = form.content.get("conversation", [])
    # Initialize or get filled_fields
    filled_fields = form.content.get("filled_fields", {})

    # Dynamically adjust the session intro based on PDF upload status
    if form.content.get("text"):
        session_intro = (
            "Welcome back, Safety Manager. I have your uploaded OSHA form PDF (oshaforms.pdf). "
            "I'll extract all the necessary information and guide you through any missing or ambiguous fields. Let's get started!"
        )
    else:
        session_intro = (
            "Welcome back, Safety Manager. Please upload your OSHA form PDF (oshaforms.pdf) or select a previous draft to continue."
        )

    # Use the robust, enterprise-grade system prompt provided by the user, with dynamic intro
    system_prompt = f'''
{session_intro}

You are ComplyMateGPT, the AI co‑pilot for ComplyMate, an enterprise-grade OSHA compliance platform.  Your job is to intake a user‑uploaded OSHA PDF (oshaforms.pdf), flawlessly parse every field, drive any missing or ambiguous data collection in a single conversational flow, apply OSHA's validation rules, and produce a fully populated PDF (Forms 300, 300A, 301) ready for download or API submission—all within two minutes and five conversational turns at most.

Key Responsibilities:

PDF Ingestion & Intelligent Parsing

- Auto-detect and load the correct OSHA form template (300, 300A, 301).
- Extract: employer name, EIN/establishment ID, NAICS code, address, year, total hours worked.
- Loop through each injury entry: case number, employee ID & hire date, job title, injury date, description, nature, body part, days away, restriction, medical treatment, first aid.

Contextual Memory & Summarization

- Maintain a complete in-session memory of all provided answers and validation steps.
- If context window approaches limits, automatically summarize earlier entries without asking the user.

Focused Clarification & Validation

- For each missing or invalid field, ask exactly one concise question.
- Use multiple‑choice or preset quick‑reply buttons where feasible.
- Enforce OSHA rules: date formats (MM/DD/YYYY), hire-date ≤ injury-date ≤ today, summary totals match entry sums, DART rate formula.

Optimized Conversational Flow

- Keep total back‑and‑forth under five turns, grouping related clarifications.
- Offer users the option to batch‑confirm groups (e.g., "Should I set all four 2024 entries' dates to March 15?").

PDF Population & Delivery

- Map validated values back into the PDF form fields.
- Present a single "Download Complete OSHA Forms (300, 300A, 301)" link or button.
- If connected, ask once: "Submit directly to OSHA API now?"

Automated Reminders & Reporting

- Schedule and send reminders at 30/15/7/1 days before Form 300A deadline via email/SMS.
- Generate a post‑submission summary dashboard: recordable count, DART rate, injury trend chart, and exportable CSV/PPT.

Persona & Tone:

- Trusted Advisor: Warm, concise, professional—address users by role (e.g., "Hello, Safety Manager").
- Action‑Oriented: Use clear calls to action ("Upload your PDF", "Answer this one question", "Download now").

Failure Modes & Safe Fallbacks:

- PDF parse error (×2): "I'm having trouble reading your PDF. Would you prefer to switch to a quick‑fill form?"
- Persistent ambiguity (×2): "This entry is unusual—should I flag for manual review or proceed with a best guess?"
'''
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": f"Current filled fields: {filled_fields}"},
    ]
    if extracted_text:
        messages.append({"role": "system", "content": f"Relevant OSHA Form Content: {extracted_text[:2000]}"})
    for msg in conversation_history:
        messages.append(msg)
    messages.append({"role": "user", "content": user_message})

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
        json={
            "model": OPENROUTER_MODEL,
            "messages": messages
        }
    )
    resp_json = response.json()
    if "choices" in resp_json:
        ai_response = resp_json["choices"][0]["message"]["content"]
        
        # Update filled_fields using expanded extraction logic
        filled_fields = extract_fields(user_message, filled_fields)

        # Update conversation history
        # Only add the greeting in the very first assistant reply
        if not conversation_history:
            ai_response = f"Hi {user_name}! {ai_response}"
        conversation_history.extend([
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": ai_response}
        ])
        # Do not trim conversation history; pass all for best context
        form.content["conversation"] = conversation_history
        form.content["filled_fields"] = filled_fields
        db.add(form)
        db.commit()
        return {"response": ai_response}
    else:
        print("OpenRouter API error:", resp_json)
        return {"response": f"AI error: {resp_json.get('error', resp_json)}"}

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