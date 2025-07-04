from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatResponse,
)
from app.services.pdf_service import process_pdf_from_path
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter()

TEMPLATES_DIR = os.path.join(settings.BASE_DIR, "static", "templates")

class TemplateChatRequest(BaseModel):
    message: str
    template_name: str

@router.post("/sessions", response_model=ChatSessionResponse)
def create_chat_session(
    *,
    db: Session = Depends(get_db),
    session_in: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new chat session.
    """
    session = ChatSession(
        user_id=current_user.id,
        **session_in.dict()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("/sessions", response_model=List[ChatSessionResponse])
def list_chat_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve chat sessions.
    """
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return sessions

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
def get_chat_session(
    *,
    db: Session = Depends(get_db),
    session_id: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get chat session by ID.
    """
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found",
        )
    return session

@router.put("/sessions/{session_id}", response_model=ChatSessionResponse)
def update_chat_session(
    *,
    db: Session = Depends(get_db),
    session_id: str,
    session_in: ChatSessionUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update chat session.
    """
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found",
        )
    
    for field, value in session_in.dict(exclude_unset=True).items():
        setattr(session, field, value)
    
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
def create_chat_message(
    *,
    db: Session = Depends(get_db),
    session_id: str,
    message_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new chat message.
    """
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found",
        )
    
    message = ChatMessage(
        session_id=session.id,
        **message_in.dict()
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageResponse])
def list_chat_messages(
    *,
    db: Session = Depends(get_db),
    session_id: str,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve chat messages.
    """
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found",
        )
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).offset(skip).limit(limit).all()
    return messages

@router.post("/template", response_model=ChatResponse)
async def chat_with_template(
    *,
    request: TemplateChatRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Handles a chat conversation with a static PDF template.
    """
    template_path = os.path.join(TEMPLATES_DIR, request.template_name)
    
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")

    try:
        # Here you would implement your RAG logic using the PDF content
        # For now, we'll just confirm we can access it
        document_text = await process_pdf_from_path(template_path)
        
        response_message = f"Interacting with template '{request.template_name}'. It has {len(document_text)} characters. You asked: '{request.message}'"

        return ChatResponse(response=response_message)
    except Exception as e:
        # Log the error
        print(f"Error processing template chat: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat with template.") 