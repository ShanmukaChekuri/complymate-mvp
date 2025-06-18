from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from sqlalchemy.orm import Session
import pdfplumber
import requests
import os
from fastapi.responses import JSONResponse

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

@router.post("/{form_id}/chat")
def chat_with_form(
    form_id: str,
    message: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form or not form.content:
        raise HTTPException(status_code=404, detail="Form or extracted content not found")
    extracted_text = form.content.get("text", "")
    prompt = f"OSHA Form Content:\n{extracted_text}\n\nUser question: {message}"
    system_prompt = (
        "You are ComplyMate AI, a trusted OSHA compliance assistant for businesses in the United States. "
        "Your role is to accurately complete OSHA Forms 300, 300A, and 301 based on structured and unstructured input from users.\n\n"
        "These forms record workplace injuries and illnesses. You must follow OSHA guidelines (29 CFR Part 1904) for what constitutes a recordable case.\n\n"
        "Your goals:\n"
        "- Ask for one missing field at a time, in a conversational way.\n"
        "- After each user answer, update your internal form and ask for the next missing field.\n"
        "- Only show the full JSON output when the user says 'done' or requests the completed form.\n"
        "- When the user says 'done', reply with a friendly greeting (e.g., 'Thank you! Your OSHA form is ready. Have a great day!') and indicate that the form is available for download. Do not show the JSON in the chat.\n"
        "- If the user says 'show progress', summarize which fields are filled and which are missing.\n"
        "- Extract correct information from the user's message.\n"
        "- Maintain confidentiality and never invent any injury/illness detail.\n"
        "- Be concise, precise, and legally compliant.\n\n"
        "You are responsible for filling in:\n"
        "1. OSHA Form 300 (Log of Work-Related Injuries and Illnesses): Employee name, job title, date of injury/onset, location, injury details, days away, classification.\n"
        "2. OSHA Form 300A (Summary): Total cases, days away, job transfer/restriction, deaths, average employees, total hours worked.\n"
        "3. OSHA Form 301 (Incident Report): Employee and physician details, injury date, time of event, activity before incident, description of injury, substance involved.\n\n"
        "Sample output format:\n"
        "{\n  \"form\": \"OSHA 301\",\n  \"employee_name\": \"John Doe\",\n  \"job_title\": \"Welder\",\n  \"date_of_injury\": \"2024-05-12\",\n  \"location\": \"Loading dock, north end\",\n  \"description\": \"Second-degree burns on right forearm from acetylene torch\",\n  \"days_away\": 5,\n  \"emergency_room\": \"Yes\",\n  \"hospitalized\": \"No\"\n}\n"
    )
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
        json={
            "model": OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        }
    )
    resp_json = response.json()
    if "choices" in resp_json:
        ai_response = resp_json["choices"][0]["message"]["content"]
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