from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from uuid import uuid4

from ..db.session import Base

class ChatSession(Base):
    """Database model for chat sessions"""
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    form_path = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ChatMessageDB(Base):
    """Database model for chat messages"""
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    content = Column(String, nullable=False)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, server_default=func.now()) 