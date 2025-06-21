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
    },
    "301": {
        "employee_full_name": "Employee's full name",
        "employee_street_address": "Employee's full street address",
        "employee_city": "Employee's city",
        "employee_state": "Employee's state",
        "employee_zip_code": "Employee's ZIP Code",
        "employee_date_of_birth": "Employee's date of birth (MM/DD/YYYY)",
        "employee_date_of_hire": "Employee's date of hire (MM/DD/YYYY)",
        "employee_sex": "Employee's sex (Male, Female, or Other)",
        "physician_name": "Name of physician or other health care professional",
        "facility_name_and_address": "Facility name and address where treatment was received",
        "was_employee_treated_in_emergency_room": "If the employee was treated in an emergency room (yes/no)",
        "was_employee_hospitalized": "If the employee was hospitalized overnight as an in-patient (yes/no)",
        "case_number_301": "Case number from the Log of Work-Related Injuries and Illnesses (Form 300)",
        "date_of_injury_or_illness": "Date of injury or illness (MM/DD/YYYY)",
        "time_of_event": "Time of event (e.g., 10:00 AM/PM)",
        "what_was_employee_doing": "What the employee was doing just before the incident occurred",
        "what_happened": "What happened (how the injury occurred)",
        "what_was_the_injury_or_illness": "What was the injury or illness (e.g., cut, sprain, fracture, etc.)",
        "object_or_substance": "What object or substance directly harmed the employee",
        "completed_by_full_name": "Full name of person who completed the form",
        "completed_by_title": "Official title of the person who completed the form",
        "completed_by_phone": "Phone number of the person who completed the form",
        "date_form_completed": "Date the form was completed (MM/DD/YYYY)"
    },
    "300A": {
        "establishment_name": "Company's Name",
        "street_address": "Company's street address",
        "city": "City",
        "state": "State",
        "zip": "ZIP code",
        "industry_description": "Industry description (e.g., manufacturing, construction)",
        "naics_code": "NAICS code",
        "annual_average_employees": "Annual average number of employees",
        "total_hours_worked": "Total hours worked by all employees last year",
        "total_deaths": "Total number of deaths",
        "total_cases_with_days_away": "Total number of cases with days away from work",
        "total_cases_with_transfer": "Total number of cases with job transfer or restriction",
        "total_other_cases": "Total number of other recordable cases",
        "total_days_away": "Total number of days away from work",
        "total_days_transfer": "Total number of days of job transfer or restriction",
        "total_injuries": "Total number of injuries",
        "total_skin_disorders": "Total number of skin disorders",
        "total_respiratory_conditions": "Total number of respiratory conditions",
        "total_poisonings": "Total number of poisonings",
        "total_hearing_loss": "Total number of hearing loss cases",
        "total_other_illnesses": "Total number of all other illnesses",
        "certifier_name": "Full name of the company executive who is certifying the summary",
        "certifier_title": "Official title of the certifier",
        "phone": "Certifier's phone number",
        "certification_date": "Date of certification (MM/DD/YYYY)"
    }
}

# --- Master Field List for Unified Incident Reporting ---
# This combines all fields from 300, 301, and 300A for a single, streamlined data collection process.
# We use dict.fromkeys() to get unique fields and then merge them, prioritizing the more detailed question from 301/300A if there's an overlap.
_master_fields = {
    **dict.fromkeys(FORM_FIELDS["300"]),
    **dict.fromkeys(FORM_FIELDS["301"]),
    **dict.fromkeys(FORM_FIELDS["300A"]),
}
INCIDENT_REPORT_BUNDLE = {
    key: FORM_FIELDS["301"].get(key) or FORM_FIELDS["300A"].get(key) or FORM_FIELDS["300"].get(key)
    for key in _master_fields
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
        """
        Returns the appropriate dictionary of fields for the given form type.
        For "incident_report", it returns the master list of all fields.
        """
        if form_type == "incident_report":
            return INCIDENT_REPORT_BUNDLE
        return FORM_FIELDS.get(form_type, {})

    def _build_system_prompt(self, context: Dict[str, Any]) -> str:
        form_type = context.get("current_form_type")
        form_data = context.get("form_data", {})
        
        # If no form type is set, this is the initial conversation
        if not form_type:
            return """You are ComplyMate AI, a helpful OSHA compliance assistant. 

Your first question should always be: "Is this a new incident you'd like to log?" 

If the user says yes or confirms it's a new incident, you should explain that you'll help them collect all the information needed for the complete OSHA incident reporting package (Forms 300, 300A, and 301). Then start collecting the information systematically.

Be friendly, professional, and efficient. Ask for one piece of information at a time to make it easy for the user."""

        # For incident reporting workflow
        if form_type == "incident_report":
            form_fields = self._get_form_fields(form_type)
            missing_fields = {k: v for k, v in form_fields.items() if k not in form_data}
            
            # Check if user message contains completion signals
            completion_phrases = [
                "okay, you are good", "i don't have any other instances", "that's all", 
                "complete", "finished", "done", "ready", "generate", "create forms",
                "that's everything", "no more information", "all done"
            ]
            
            user_message_lower = context.get("last_user_message", "").lower()
            is_completion_signal = any(phrase in user_message_lower for phrase in completion_phrases)
            
            # If all fields are collected OR user gives completion signal, offer to generate forms
            if not missing_fields or is_completion_signal:
                if not missing_fields:
                    return """CRITICAL: You have collected all the necessary information for the OSHA incident report. 

The user has provided complete information for Forms 300, 300A, and 301. 

Your response should be: "Perfect! I have all the information needed for your OSHA incident report. Let me generate the complete set of forms (300, 300A, and 301) for you."

Then immediately respond with ONLY this JSON:
{"action": "generate_form"}"""
                else:
                    # User gave completion signal but some fields are missing
                    missing_count = len(missing_fields)
                    return f"""The user has indicated they want to complete the incident report, but you still need {missing_count} more pieces of information.

Missing fields: {list(missing_fields.values())[:3]}{'...' if missing_count > 3 else ''}

Respond: "I understand you'd like to complete the report. However, I still need a few more details to generate accurate forms. Let me quickly collect the remaining information: {list(missing_fields.values())[0]}"

Then ask for the next missing field."""
            
            # Continue collecting information
            next_field_name = list(missing_fields.values())[0]
            collected_count = len(form_data)
            total_count = len(form_fields)
            
            return f"""You are collecting information for a complete OSHA incident report (Forms 300, 300A, and 301).

Progress: {collected_count}/{total_count} fields collected.

Next information needed: {next_field_name}

Ask for this specific piece of information in a friendly, conversational way. Be efficient and professional."""
        
        # Fallback for other form types (shouldn't be used in new workflow)
        form_fields = self._get_form_fields(form_type)
        missing_fields = {k: v for k, v in form_fields.items() if k not in form_data}

        if not missing_fields:
            return f"""CRITICAL INSTRUCTION: The user has provided all necessary information for the OSHA {form_type} form.
Your ONLY valid response is the raw JSON object below and NOTHING ELSE.
RESPOND ONLY WITH THE JSON:
{{"action": "generate_form"}}"""

        next_field_name = list(missing_fields.values())[0]
        return f"You are collecting information for the OSHA {form_type} form. Ask for: {next_field_name}."

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