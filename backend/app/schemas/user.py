from typing import Optional
from pydantic import BaseModel, EmailStr, constr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    company_name: str
    first_name: str
    last_name: str
    industry: str
    employee_count: int

class UserCreate(UserBase):
    password: constr(min_length=8)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    industry: Optional[str] = None
    employee_count: Optional[int] = None
    password: Optional[constr(min_length=8)] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    subscription_tier: str
    subscription_status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: Optional[int] = None
    refresh_token: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None 