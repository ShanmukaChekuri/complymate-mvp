from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth, 
    health, 
    forms,
    chat,
    analytics,
    files,
    templates
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(forms.router, prefix="/forms", tags=["Forms"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(files.router, prefix="/files", tags=["Files"])
api_router.include_router(templates.router, prefix="/templates", tags=["Templates"]) 