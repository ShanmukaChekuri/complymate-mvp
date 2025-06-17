from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from backend.app.services import pdf_service
from backend.app.core.security import get_current_user
from backend.app.models.user import User

router = APIRouter()

@router.post("/analyze", response_model=pdf_service.FormAnalysis)
async def analyze_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"error": "Only PDF files are supported."})
    if file.size and file.size > 10 * 1024 * 1024:
        return JSONResponse(status_code=400, content={"error": "File too large (max 10MB)."})
    analysis = await pdf_service.upload_pdf(file, str(current_user.id))
    return analysis 