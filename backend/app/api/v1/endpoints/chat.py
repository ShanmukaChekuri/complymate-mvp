import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.dependencies import get_current_user, get_context_manager
from app.models.user import User
from app.services.chat_service import ChatService
from app.services.context_manager import ContextManager

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Pydantic Models for Request and Response ---

class ChatRequest(BaseModel):
    content: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    session_id: str
    file_url: Optional[str] = Field(None, alias="formUrl")

    class Config:
        populate_by_name = True
        
# --- Chat Endpoint ---

@router.post("/chat", response_model=ChatResponse)
async def handle_chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    context_manager: ContextManager = Depends(get_context_manager)
):
    """
    Handles a chat message, maintains conversation state, and returns the AI's response.
    """
    try:
        # If no session_id is provided by the client, start a new one.
        session_id = request.session_id or str(uuid.uuid4())
        
        # Instantiate a new ChatService for each request, passing the singleton ContextManager.
        chat_service = ChatService(session_id=session_id, context_manager=context_manager)
        
        # Process the user's message through the chat service.
        response_data = chat_service.handle_chat(user_message=request.content)
        
        # Ensure the response data is a dictionary before creating the response model
        if isinstance(response_data, dict):
            return ChatResponse(**response_data)
        else:
            # Handle cases where response_data might not be a dict (e.g., error string)
            logger.error(f"Unexpected response type from ChatService: {type(response_data)}")
            # Fallback response
            return ChatResponse(
                message="An unexpected error occurred in the chat service.",
                session_id=session_id
            )

    except Exception as e:
        logger.error(f"Error in chat endpoint for user {current_user.id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.") 