import logging
import json
import os
import re
from typing import Dict, Any, Optional, List

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
        
        if not context:
            self.context_manager.create_session_with_id(self.session_id)
            # Default to the unified incident report workflow
            self.context_manager.update_context(self.session_id, context_updates={"current_form_type": "incident_report"})
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

        # Add the last user message to context for completion signal detection
        context["last_user_message"] = user_message

        # 3. Generate the AI's response using the updated context.
        ai_response_text = self.llm_service.generate_response(user_message, context)
        logger.info(f"AI response for session {self.session_id}: {ai_response_text}")

        # 4. Check for form generation action using a robust regex search.
        # This will find the JSON command even if it's surrounded by other text.
        json_match = re.search(r'{\s*"action"\s*:\s*"generate_form"\s*}', ai_response_text)
        
        if json_match:
            # The context now holds all data for all forms.
            return self._generate_all_forms(context)
        
        # 5. If it's a regular message, add it to history and return.
        self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": ai_response_text})
        return {"message": ai_response_text, "session_id": self.session_id}

    def _generate_all_forms(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates all three OSHA forms (300, 300A, 301) using the collected data.
        """
        logger.info(f"Generating all forms for session {self.session_id}")
        form_data = context.get("form_data", {})
        generated_files = []
        error_messages = []

        for form_type in ["300", "300A", "301"]:
            try:
                pdf_path = self.form_filler.generate_form(form_type, form_data)
                if pdf_path:
                    file_name = os.path.basename(pdf_path)
                    download_url = f"/api/v1/files/download/{file_name}"
                    generated_files.append({"form_name": f"OSHA Form {form_type}", "url": download_url})
                else:
                    error_messages.append(f"Failed to generate OSHA Form {form_type}.")
            except Exception as e:
                logger.error(f"Failed to generate PDF for form {form_type} in session {self.session_id}: {e}")
                error_messages.append(f"An unexpected error occurred while generating OSHA Form {form_type}.")
        
        if not generated_files:
            response_message = "I'm sorry, I encountered errors and could not generate any of the forms. Please try again."
            self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": response_message})
            return {"message": response_message, "session_id": self.session_id}

        # Build a nice response message with all the links
        links_markdown = "\n".join([f"- [{file['form_name']}]({file['url']})" for file in generated_files])
        response_message = f"I've generated the complete set of OSHA forms for this incident. You can download them here:\n{links_markdown}"
        
        if error_messages:
            response_message += "\n\nI encountered some issues:\n" + "\n".join(f"- {error}" for error in error_messages)

        self.context_manager.update_context(self.session_id, message={"role": "assistant", "content": response_message})
        return {"message": response_message, "session_id": self.session_id, "file_urls": generated_files}

    def _determine_form_type(self, message: str) -> Optional[str]:
        """
        A simple keyword-based check to see if a form type is mentioned.
        This can be replaced with a more sophisticated LLM-based check if needed.
        """
        if "300a" in message.lower(): return "300a"
        if "301" in message.lower(): return "301"
        if "300" in message.lower(): return "300"
        return None 