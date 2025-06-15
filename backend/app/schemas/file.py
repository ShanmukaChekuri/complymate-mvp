from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class FileBase(BaseModel):
    filename: str
    mime_type: str
    size: int

class FileCreate(FileBase):
    form_id: str

class FileUpdate(BaseModel):
    processing_status: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None

class FileResponse(FileBase):
    id: str
    form_id: str
    file_path: str
    processing_status: str
    extracted_data: Optional[Dict[str, Any]] = None
    uploaded_by: str
    created_at: datetime

    class Config:
        from_attributes = True 