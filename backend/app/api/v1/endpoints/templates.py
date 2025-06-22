from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
from typing import List

from app.core.config import settings

router = APIRouter()

TEMPLATES_DIR = os.path.join(settings.BASE_DIR, "static", "templates")

@router.get("/templates", response_model=List[str])
async def list_templates():
    """
    Returns a list of available PDF templates.
    """
    if not os.path.isdir(TEMPLATES_DIR):
        # This handles the case where the directory might not exist for some reason
        return []
    
    try:
        files = [f for f in os.listdir(TEMPLATES_DIR) if f.endswith('.pdf')]
        return files
    except Exception as e:
        # Log this exception in a real application
        print(f"Error reading templates directory: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve templates.")

@router.get("/templates/{template_name}")
async def get_template(template_name: str):
    """
    Returns a specific PDF template file.
    """
    try:
        file_path = os.path.join(TEMPLATES_DIR, template_name)
        
        # Security check: ensure the file is within the intended directory
        if not os.path.abspath(file_path).startswith(os.path.abspath(TEMPLATES_DIR)):
            raise HTTPException(status_code=403, detail="Forbidden")

        if os.path.isfile(file_path):
            return FileResponse(file_path, media_type='application/pdf', filename=template_name)
        else:
            raise HTTPException(status_code=404, detail="Template not found")
    except Exception as e:
        print(f"Error serving template: {e}")
        raise HTTPException(status_code=500, detail="Could not retrieve template file.") 