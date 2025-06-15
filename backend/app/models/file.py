from sqlalchemy import Column, String, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.db.session import Base

class File(Base):
    __tablename__ = "files"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    form_id = Column(String(36), ForeignKey("forms.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    processing_status = Column(String, default="pending")
    extracted_data = Column(JSON)
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=False), default=datetime.utcnow)

    # Relationships
    form = relationship("Form", back_populates="files")
    uploader = relationship("User") 