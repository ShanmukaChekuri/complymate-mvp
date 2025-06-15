from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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

router = APIRouter()

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

@router.post("/{form_id}/analyze", response_model=FormAnalysisResponse)
def analyze_form(
    *,
    db: Session = Depends(get_db),
    form_id: str,
    analysis_in: FormAnalysisCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new form analysis.
    """
    form = db.query(Form).filter(Form.id == form_id, Form.user_id == current_user.id).first()
    if not form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Form not found",
        )
    
    analysis = FormAnalysis(
        form_id=form.id,
        created_by=current_user.id,
        **analysis_in.dict()
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis 