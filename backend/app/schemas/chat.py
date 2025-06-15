from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel

class ChatMessageBase(BaseModel):
    role: str
    content: str
    selected_option: Optional[str] = None
    form_updates: Optional[Dict[str, Any]] = None

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: str
    session_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionBase(BaseModel):
    form_id: str
    context: Dict[str, Any]
    model_used: str

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionUpdate(BaseModel):
    status: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    completed_at: Optional[datetime] = None

class ChatSessionResponse(ChatSessionBase):
    id: str
    user_id: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True 