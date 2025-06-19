from fastapi import APIRouter
from backend.app.api.api_v1.endpoints import pdf
# ... import other endpoints ...

api_router = APIRouter()

# ... include other routers ...
api_router.include_router(pdf.router, prefix="/pdf", tags=["pdf"]) 