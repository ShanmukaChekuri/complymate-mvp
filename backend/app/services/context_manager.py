from typing import Dict, Any, Optional, List
from datetime import datetime
import time

class ConversationContext:
    def __init__(
        self,
        session_id: str,
        form_structure: Dict[str, Any],
        created_at: datetime
    ):
        self.session_id = session_id
        self.form_structure = form_structure
        self.created_at = created_at
        self.current_section: Optional[str] = None
        self.current_field: Optional[str] = None
        self.collected_data: Dict[str, Any] = {}
        self.confidence_scores: Dict[str, float] = {}
        self.interaction_history: List[Dict[str, Any]] = []
        self.validation_state: Dict[str, bool] = {}
        self.clarification_needed: Dict[str, str] = {}
        
    def update_with_response(self, user_input: str, field_id: str, confidence: float):
        """Update context with new user input"""
        self.collected_data[field_id] = user_input
        self.confidence_scores[field_id] = confidence
        self.interaction_history.append({
            "timestamp": datetime.now(),
            "field_id": field_id,
            "user_input": user_input,
            "confidence": confidence
        })
        
    def needs_clarification(self, field_id: str) -> bool:
        """Check if field needs clarification based on confidence score"""
        return self.confidence_scores.get(field_id, 0) < 0.8

    def get_field_history(self, field_id: str) -> List[Dict[str, Any]]:
        """Get interaction history for a specific field"""
        return [
            interaction for interaction in self.interaction_history 
            if interaction["field_id"] == field_id
        ]

    def get_completion_status(self) -> Dict[str, Any]:
        """Get form completion status"""
        total_fields = len(self.form_structure["fields"])
        completed_fields = len(self.collected_data)
        return {
            "completed": completed_fields,
            "total": total_fields,
            "percentage": (completed_fields / total_fields * 100) if total_fields > 0 else 0
        }

class ContextManager:
    """
    Manages the context for all ongoing conversations.
    This class is intended to be a singleton, created once for the application.
    """
    def __init__(self):
        """Initializes the in-memory session store."""
        self.sessions: Dict[str, Dict[str, Any]] = {}

    def create_session_with_id(self, session_id: str, user_id: str = "unknown") -> Dict[str, Any]:
        """Creates a new, empty session context with a given ID."""
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "user_id": user_id,
                "conversation_history": [],
                "form_data": {},
                "current_form_type": None,
                "last_interaction": time.time(),
            }
        return self.sessions[session_id]

    def get_context(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves the context for a given session."""
        if session_id in self.sessions:
            self.sessions[session_id]["last_interaction"] = time.time()
            return self.sessions[session_id]
        return None

    def update_context(self, session_id: str, message: Optional[Dict[str, str]] = None, form_data: Optional[Dict[str, Any]] = None, context_updates: Optional[Dict[str, Any]] = None):
        """
        Updates the conversation history, form data, or other context fields for a session.
        """
        if session_id in self.sessions:
            if message:
                self.sessions[session_id]["conversation_history"].append(message)
            if form_data:
                self.sessions[session_id]["form_data"].update(form_data)
            if context_updates:
                self.sessions[session_id].update(context_updates)
            
            # Trim history to keep it manageable
            history = self.sessions[session_id]["conversation_history"]
            if len(history) > 20:
                self.sessions[session_id]["conversation_history"] = history[-20:]
        else:
            # Optionally, you could log a warning or error here.
            # For now, we fail silently if the session doesn't exist.
            pass

    def set_form_type(self, session_id: str, form_type: str):
        """Sets the type of form being filled out and resets form data."""
        if session_id in self.sessions:
            if self.sessions[session_id].get("current_form_type") != form_type:
                self.sessions[session_id]["current_form_type"] = form_type
                self.sessions[session_id]["form_data"] = {} # Reset form data
        else:
            # Fail silently if session doesn't exist
            pass

    def clear_context(self, session_id: str):
        """Clears the context for a specific session."""
        if session_id in self.sessions:
            del self.sessions[session_id] 