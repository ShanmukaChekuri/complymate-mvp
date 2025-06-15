from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import (
    get_password_hash, verify_password, create_access_token, create_refresh_token, validate_password_strength
)
from app.core.config import settings

class AuthService:
    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> User:
        # Check if user already exists
        user = db.query(User).filter(User.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The user with this email already exists in the system."
            )
        validate_password_strength(user_in.password)
        user = User(
            email=user_in.email,
            password_hash=get_password_hash(user_in.password),
            company_name=user_in.company_name,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            industry=user_in.industry,
            employee_count=user_in.employee_count,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, user_in: UserLogin) -> User:
        user = db.query(User).filter(User.email == user_in.email).first()
        if not user or not verify_password(user_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password."
            )
        return user

    @staticmethod
    def create_tokens(user: User):
        access_token = create_access_token(
            subject=user.id,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        refresh_token = create_refresh_token(
            subject=user.id
        )
        return access_token, refresh_token

    @staticmethod
    def get_user_profile(db: Session, user_id: str) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return user

    @staticmethod
    def update_user_profile(db: Session, user_id: str, update_data: dict) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user 