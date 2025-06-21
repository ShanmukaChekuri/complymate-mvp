import logging
import json
import os
import re
from typing import Dict, Any, Optional

from app.services.llm_service import LLMService
from app.services.form_filler_service import FormFillerService
from app.services.context_manager import ContextManager

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self, session_id: str, context_manager: ContextManager):
        self.session_id = session_id
        self.llm_service = LLMService()
        self.form_filler = FormFillerService()
        self.context_manager = context_manager
        logger.info(f"ChatService initialized for session: {self.session_id}")

    def handle_chat(self, user_message: str) -> Dict[str, Any]:
        context = self.context_manager.get_context(self.session_id)
        
        # If no context exists, create a new session with the existing session_id
        if not context:
            self.context_manager.create_session_with_id(self.session_id)
            context = self.context_manager.get_context(self.session_id)
        
        # This is a temporary addition to allow the user to select a form type.
        # This logic should be refined.
        if "300" in user_message.lower() and not context.get("current_form_type"):
            self.context_manager.set_form_type(self.session_id, "300")
            context = self.context_manager.get_context(self.session_id)

        # 1. Always try to extract data from the user's message first.
        extracted_data = self.llm_service.extract_form_data(user_message, context)
        if extracted_data:
            logger.info(f"Extracted data for session {self.session_id}: {extracted_data}")
            self.context_manager.update_context(self.session_id, form_data=extracted_data)
            context = self.context_manager.get_context(self.session_id)

        # 2. Update conversation history before generating the next response.
        self.context_manager.update_context(self.session_id, message={"role": "user", "content": user_message})
        context = self.context_manager.get_context(self.session_id)

        # 3. Generate the AI's response using the updated context.
        ai_response_text = self.llm_service.generate_response(user_message, context)
        logger.info(f"AI response for session {self.session_id}: {ai_response_text}")

        # 4. Check for form generation action using a robust regex search.
        # This will find the JSON command even if it's surrounded by other text.
        json_match = re.search(r'{\s*"action"\s*:\s*"generate_form"\s*}', ai_response_text)
        
        if json_match:
            return self._generate_and_respond_with_form(context)
        
        # 5. If it's a regular message, add it to history and return.
        self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": ai_response_text})
        return {"message": ai_response_text, "session_id": self.session_id}

    def _generate_and_respond_with_form(self, context: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Generating form for session {self.session_id}")
        form_data = context.get("form_data", {})
        form_type = context.get("current_form_type", "300")

        try:
            pdf_path = self.form_filler.generate_form(form_type, form_data)
            if pdf_path:
                # The PDF path is now an absolute path. We need just the filename for the URL.
                file_name = os.path.basename(pdf_path)
                download_url = f"/api/v1/files/download/{file_name}"
                
                response_message = f"I've generated the OSHA {form_type} form for you. You can download it here: [{file_name}]({download_url})"
                self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": response_message})
                return {"message": response_message, "session_id": self.session_id, "file_url": download_url}
            else:
                error_message = "I'm sorry, I encountered an error while generating the PDF. Please try again."
                self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": error_message})
                return {"message": error_message, "session_id": self.session_id}
        except Exception as e:
            logger.error(f"Failed to generate PDF for session {self.session_id}: {e}")
            error_message = "I'm sorry, I encountered an error while generating the PDF. Please try again."
            self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": error_message})
            return {"message": error_message, "session_id": self.session_id}

    def _determine_form_type(self, message: str) -> Optional[str]:
        """
        A simple keyword-based check to see if a form type is mentioned.
        This can be replaced with a more sophisticated LLM-based check if needed.
        """
        if "300a" in message.lower(): return "300a"
        if "301" in message.lower(): return "301"
        if "300" in message.lower(): return "300"
        return None 