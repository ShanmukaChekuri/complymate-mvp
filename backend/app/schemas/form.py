from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class FormBase(BaseModel):
    title: str
    type: str
    year: int
    content: Dict[str, Any]
    form_metadata: Optional[Dict[str, Any]] = None

class FormCreate(FormBase):
    pass

class FormUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    year: Optional[int] = None
    content: Optional[Dict[str, Any]] = None
    form_metadata: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class FormVersionBase(BaseModel):
    version_number: int
    content: Dict[str, Any]
    changes_description: Optional[str] = None

class FormVersionCreate(FormVersionBase):
    pass

class FormVersionResponse(FormVersionBase):
    id: str
    form_id: str
    created_at: datetime
    created_by: str

    class Config:
        from_attributes = True

class FormAnalysisBase(BaseModel):
    analysis_type: str
    model_used: str
    suggestions: Dict[str, Any]
    compliance_score: Optional[float] = None
    processing_time: Optional[float] = None

class FormAnalysisCreate(FormAnalysisBase):
    pass

class FormAnalysisResponse(FormAnalysisBase):
    id: str
    form_id: str
    created_at: datetime
    created_by: str

    class Config:
        from_attributes = True

class FormResponse(FormBase):
    id: str
    user_id: str
    status: str
    completion_percentage: float
    processing_status: Optional[str] = None
    last_processed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    versions: List[FormVersionResponse] = []
    analyses: List[FormAnalysisResponse] = []

    class Config:
        from_attributes = True 