from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import aiofiles
import os
from datetime import datetime

from app.core.config import settings
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.file import File as FileModel
from app.schemas.file import FileResponse, FileUpdate

router = APIRouter()

@router.post("/upload", response_model=FileResponse)
async def upload_file(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    form_id: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Upload new file.
    """
    # Create upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Create file record
    db_file = FileModel(
        form_id=form_id,
        filename=file.filename,
        file_path=file_path,
        mime_type=file.content_type,
        size=len(content),
        uploaded_by=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

@router.get("/", response_model=List[FileResponse])
def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve files.
    """
    files = db.query(FileModel).filter(
        FileModel.uploaded_by == current_user.id
    ).offset(skip).limit(limit).all()
    return files

@router.get("/{file_id}", response_model=FileResponse)
def get_file(
    *,
    db: Session = Depends(get_db),
    file_id: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get file by ID.
    """
    file = db.query(FileModel).filter(
        FileModel.id == file_id,
        FileModel.uploaded_by == current_user.id
    ).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    return file

@router.put("/{file_id}", response_model=FileResponse)
def update_file(
    *,
    db: Session = Depends(get_db),
    file_id: str,
    file_in: FileUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update file.
    """
    file = db.query(FileModel).filter(
        FileModel.id == file_id,
        FileModel.uploaded_by == current_user.id
    ).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    
    for field, value in file_in.dict(exclude_unset=True).items():
        setattr(file, field, value)
    
    db.add(file)
    db.commit()
    db.refresh(file)
    return file

@router.delete("/{file_id}", response_model=FileResponse)
def delete_file(
    *,
    db: Session = Depends(get_db),
    file_id: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete file.
    """
    file = db.query(FileModel).filter(
        FileModel.id == file_id,
        FileModel.uploaded_by == current_user.id
    ).first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )
    
    # Delete physical file
    if os.path.exists(file.file_path):
        os.remove(file.file_path)
    
    db.delete(file)
    db.commit()
    return file 