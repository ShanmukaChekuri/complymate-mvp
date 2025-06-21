from typing import Dict, Any, Optional
import logging
import os
import json
import requests
from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Single Source of Truth for Form Fields ---
# This dictionary defines the complete set of fields for each form.
# The keys are the internal identifiers used throughout the system.
# The values are the user-friendly names used for asking questions.
FORM_FIELDS = {
    "300": {
        "establishment_name": "Company's Name",
        "city": "City",
        "state": "State",
        "year_of_log": "Year of the log",
        "case_number": "Case number",
        "employee_name": "Employee's name",
        "job_title": "Employee's job title",
        "date_of_injury": "Date of the injury or illness (e.g., MM/DD)",
        "location_of_event": "Location where the event occurred",
        "description_of_injury": "Description of the injury/illness, parts of body affected, and object/substance that directly injured or made person ill",
        "classification": "Classification of the case (death, days away, job transfer, or other recordable)",
        "days_away_from_work": "Number of days away from work",
        "days_on_transfer_or_restriction": "Number of days on job transfer or restriction",
        "type_of_injury_or_illness": "Type of injury or illness (e.g., injury, skin disorder, respiratory condition, poisoning, hearing loss, or all other illnesses)"
    }
    # Future forms like 300A and 301 can be added here.
}

class LLMService:
    def __init__(self):
        if not settings.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY is not set")
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.OPENROUTER_MODEL
        self.api_base = "https://openrouter.ai/api/v1"
        logger.info(f"OpenRouter LLM service initialized with model: {self.model}")

    def _get_form_fields(self, form_type: str) -> Dict[str, str]:
        return FORM_FIELDS.get(form_type, {})

    def _build_system_prompt(self, context: Dict[str, Any]) -> str:
        form_type = context.get("current_form_type")
        if not form_type:
            return "You are a helpful OSHA compliance assistant. Start by asking which form is needed (300, 300A, or 301)."

        form_data = context.get("form_data", {})
        form_fields = self._get_form_fields(form_type)
        missing_fields = {k: v for k, v in form_fields.items() if k not in form_data}

        if not missing_fields:
            return f"""
            SYSTEM TASK: Your ONLY job is to determine if the user wants to generate the OSHA {form_type} form.
            - If the user's intent is to generate the form, your response MUST be a single, raw JSON object and NOTHING ELSE.
            - The JSON object MUST be: {{"action": "generate_form"}}
            - Do NOT add any conversational text, markdown, or anything other than the raw JSON object.

            If the user is not asking to generate the form, you may have a normal conversation.
            """

        next_field_name = list(missing_fields.values())[0]
        return f"You are a friendly and efficient OSHA compliance assistant. Your current goal is to collect information for the OSHA {form_type} form. You have already collected: {list(form_data.keys())}. Ask a concise question to get the next piece of information: {next_field_name}."

    def extract_form_data(self, user_message: str, context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        form_type = context.get("current_form_type")
        if not form_type: return None

        form_fields = self._get_form_fields(form_type)
        
        extraction_prompt = f"""
        You are an expert data extraction AI. Your job is to extract any and all relevant information from a user's message to fill out an OSHA form.
        Here are the possible fields: {json.dumps(form_fields, indent=2)}.
        
        The user's message is: "{user_message}"
        
        Extract any fields you can from the user's message.
        Return ONLY a valid JSON object with the extracted data. If no relevant data is found, return an empty JSON object {{}}.
        """

        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        data = {
            "model": self.model,
            "messages": [{"role": "system", "content": extraction_prompt}],
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(f"{self.api_base}/chat/completions", headers=headers, json=data, timeout=20)
            response.raise_for_status()
            result = response.json()
            if result.get("choices") and result["choices"][0].get("message"):
                content = result["choices"][0]["message"]["content"].strip()
                return json.loads(content) if content else {}
            return None
        except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
            logger.error(f"Failed to extract form data: {e}")
            return None

    def generate_response(self, user_message: str, context: Optional[Dict[str, Any]] = None) -> str:
        if not context: context = {}
        system_prompt = self._build_system_prompt(context)
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        
        # Restore full conversation history for natural conversation
        messages = [
            {"role": "system", "content": system_prompt},
            *context.get("conversation_history", []),
            {"role": "user", "content": user_message}
        ]
        
        data = {"model": self.model, "messages": messages}

        try:
            response = requests.post(f"{self.api_base}/chat/completions", headers=headers, json=data, timeout=30)
            response.raise_for_status()
            result = response.json()
            if result.get("choices") and result["choices"][0].get("message"):
                return result["choices"][0]["message"]["content"].strip()
            return "I received an unexpected response from the AI service. Please try again."
        except Exception as e:
            logger.error(f"An unexpected error occurred in generate_response: {e}")
            return "An unexpected internal error occurred."