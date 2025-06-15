from sqlalchemy import Column, String, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.db.session import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    form_id = Column(String(36), ForeignKey("forms.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String, default="active")
    context = Column(JSON, nullable=False)
    model_used = Column(String, nullable=False)
    started_at = Column(DateTime(timezone=False), default=datetime.utcnow)
    completed_at = Column(DateTime(timezone=False))
    created_at = Column(DateTime(timezone=False), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=False), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    form = relationship("Form", back_populates="chat_sessions")
    user = relationship("User")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    selected_option = Column(String)
    form_updates = Column(JSON)
    created_at = Column(DateTime(timezone=False), default=datetime.utcnow)

    # Relationships
    session = relationship("ChatSession", back_populates="messages") 