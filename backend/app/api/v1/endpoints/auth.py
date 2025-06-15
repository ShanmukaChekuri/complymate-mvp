from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_current_user, decode_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=201)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    user = AuthService.register_user(db, user_in)
    return user

@router.post("/login", response_model=Token)
def login(
    *,
    db: Session = Depends(get_db),
    user_in: UserLogin
) -> Any:
    user = AuthService.authenticate_user(db, user_in)
    access_token, refresh_token = AuthService.create_tokens(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "refresh_token": refresh_token
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    *,
    request: Request,
    db: Session = Depends(get_db)
) -> Any:
    data = await request.json()
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token required.")
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token.")
    user_id = payload.get("sub")
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    access_token, new_refresh_token = AuthService.create_tokens(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "refresh_token": new_refresh_token
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    # For stateless JWT, logout is handled client-side (token deletion)
    return {"message": "Logged out successfully."} 