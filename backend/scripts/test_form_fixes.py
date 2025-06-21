#!/usr/bin/env python3
"""
Test script to verify fixes for OSHA Form 300 issues:
1. Case number field with leading space
2. Radio button values with multi-word options
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.services.form_filler_service import FormFillerService
from fillpdf import fillpdfs

def test_form_fixes():
    """Test the form filler service with the identified issues"""
    
    # Test data that includes the problematic fields
    test_data = {
        "year": "25",
        "establishment_name": "TEST COMPANY NAME",
        "city": "TEST CITY", 
        "state": "NJ",
        "case_number": "12345",  # This should populate the " 1" field
        "employee_name": "John Smith",
        "job_title": "Engineer",
        "incident_date": "06/17",
        "incident_location": "Office",
        "incident_description": "Slipped and fell",
        "days_away": True,  # This should set Group1 to "Days away from work"
        "days_away_count": "10",
        "transfer_count": "0",
        "classification": "days_away"
    }
    
    print("Testing OSHA Form 300 generation with fixes...")
    
    # Initialize the form filler service
    form_service = FormFillerService()
    
    try:
        # Generate the form
        output_path = form_service.generate_form("300", test_data)
        
        if output_path:
            print(f"Form generated successfully at: {output_path}")
            
            # Verify the generated form
            print("\nVerifying generated form...")
            filled_fields = fillpdfs.get_form_fields(output_path)
            
            # Check case number field
            case_field_with_space = " 1"
            case_field_without_space = "1"
            
            print(f"\nCase number field check:")
            print(f"Field '{case_field_with_space}': '{filled_fields.get(case_field_with_space, 'NOT FOUND')}'")
            print(f"Field '{case_field_without_space}': '{filled_fields.get(case_field_without_space, 'NOT FOUND')}'")
            
            # Check radio button field
            radio_field = "Group1"
            print(f"\nRadio button field check:")
            print(f"Field '{radio_field}': '{filled_fields.get(radio_field, 'NOT FOUND')}'")
            
            # Check other important fields
            important_fields = [
                "Log of Injury/Illness Year",
                "Log of Injury/Illness Establishment name", 
                "Employee's Name 1",
                "Job Title 1",
                "Date of injury or Illness month 1",
                "Date of injury or illness day 1",
                "Where the Event Occurred 1",
                "Injury or Illness Description 1",
                "Number of days injured or ill away from work 1",
                "Days away from work Total"
            ]
            
            print(f"\nOther important fields:")
            for field in important_fields:
                value = filled_fields.get(field, "NOT FOUND")
                print(f"  {field}: '{value}'")
                
        else:
            print("Failed to generate form")
            
    except Exception as e:
        print(f"Error during form generation: {str(e)}")
        import traceback
        print("Full traceback:")
        print(traceback.format_exc())

if __name__ == "__main__":
    test_form_fixes() 