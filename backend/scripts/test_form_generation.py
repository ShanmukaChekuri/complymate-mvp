from pathlib import Path
import sys
import os
from fillpdf import fillpdfs

# Add the parent directory to Python path to import the service
sys.path.append(str(Path(__file__).parent.parent))

from app.services.form_filler_service import FormFillerService

def test_form_300():
    """Test generating OSHA Form 300"""
    form_data = {
        "year": "2025",
        "establishment_name": "ELITE Inc",
        "city": "Glassboro",
        "state": "New Jersey",
        "case_number": "234684",
        "employee_name": "John",
        "job_title": "Welding engineer",
        "incident_date": "06/17/2025",
        "incident_location": "Office",
        "incident_description": "Slipped on wet floor; suffered head and hand injuries; hospitalized",
        "classification": "days_away",
        "days_away_count": 10,
        "transfer_count": 0,
        "injury_type": "Injury"
    }
    
    service = FormFillerService()
    result = service.generate_form("300", form_data)
    if result:
        print(f"Successfully generated Form 300 at: {result}")
    else:
        print("Failed to generate Form 300")

def test_form_300A():
    """Test generating OSHA Form 300A"""
    form_data = {
        "year": "2025",
        "establishment_name": "ELITE Inc",
        "street_address": "930 N Main St.",
        "city": "Glassboro",
        "state": "New Jersey",
        "zip": "08028",
        "industry_description": "Medical software development",
        "naics_code": "541511",
        "annual_average_employees": 350,
        "total_hours_worked": 10952,
        "total_deaths": 0,
        "total_cases_with_days_away": 1,
        "total_cases_with_transfer": 0,
        "total_other_cases": 0,
        "total_days_away": 10,
        "total_days_transfer": 0,
        "total_injuries": 1,
        "total_skin_disorders": 0,
        "total_respiratory_conditions": 0,
        "total_poisonings": 0,
        "total_hearing_loss": 0,
        "total_other_illnesses": 0,
        "certifier_name": "Siva",
        "certifier_title": "CEO",
        "phone": "123-456-7890",
        "certification_date": "06/19/2025"
    }
    
    service = FormFillerService()
    result = service.generate_form("300A", form_data)
    if result:
        print(f"Successfully generated Form 300A at: {result}")
    else:
        print("Failed to generate Form 300A")

if __name__ == "__main__":
    print("Testing OSHA form generation...")
    test_form_300()
    test_form_300A()
    print("Test complete.") 