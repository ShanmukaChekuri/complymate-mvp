from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ComplyMate"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Database Configuration
    DATABASE_URL: Optional[str] = None
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_DB: Optional[str] = None
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True, always=True)
    def assemble_db_connection(cls, v, values):
        if values.get("DATABASE_URL"):
            return values["DATABASE_URL"]
        if (
            values.get("POSTGRES_SERVER") and values.get("POSTGRES_USER") and values.get("POSTGRES_PASSWORD") and values.get("POSTGRES_DB")
        ):
            return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"
        return "sqlite:///./complymate.db"

    # JWT Configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # AI Service Configuration
    OPENROUTER_API_KEY: str
    OPENROUTER_MODEL: str

    # File Storage Configuration
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 