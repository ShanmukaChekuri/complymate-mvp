from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.db.session import Base

class Form(Base):
    __tablename__ = "forms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    content = Column(JSON, nullable=False)
    status = Column(String, default="draft")
    form_metadata = Column(JSON)
    completion_percentage = Column(Float, default=0)
    processing_status = Column(String)
    last_processed_at = Column(DateTime(timezone=False))
    created_at = Column(DateTime(timezone=False), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=False), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="forms")
    versions = relationship("FormVersion", back_populates="form")
    analyses = relationship("FormAnalysis", back_populates="form")
    chat_sessions = relationship("ChatSession", back_populates="form")
    files = relationship("File", back_populates="form")

class FormVersion(Base):
    __tablename__ = "form_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    form_id = Column(String(36), ForeignKey("forms.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content = Column(JSON, nullable=False)
    changes_description = Column(String)
    created_at = Column(DateTime(timezone=False), default=datetime.utcnow)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)

    # Relationships
    form = relationship("Form", back_populates="versions")
    creator = relationship("User")

class FormAnalysis(Base):
    __tablename__ = "form_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    form_id = Column(String(36), ForeignKey("forms.id"), nullable=False)
    analysis_type = Column(String, nullable=False)
    model_used = Column(String, nullable=False)
    suggestions = Column(JSON, nullable=False)
    compliance_score = Column(Float)
    processing_time = Column(Float)
    created_at = Column(DateTime(timezone=False), default=datetime.utcnow)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)

    # Relationships
    form = relationship("Form", back_populates="analyses")
    creator = relationship("User") 