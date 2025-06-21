#!/usr/bin/env python3
"""
Test script for OSHA Form 300 generation with verification.
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.services.form_filler_service import FormFillerService
from fillpdf import fillpdfs

def verify_form_test():
    """Tests form generation and verifies the output."""
    
    test_data = {
        "year": "24",
        "establishment_name": "Verified Test Corp",
        "city": "Testville",
        "state": "TS",
        "case_number": "98765",
        "employee_name": "Jane Doe",
        "job_title": "Auditor",
        "incident_date": "12/25",
        "incident_location": "Server Room",
        "incident_description": "Static shock from holiday decorations",
        "days_away": True,
        "days_away_count": "3",
        "transfer_count": "0",
        "classification": "days_away",
        "injury_type": "Injury",
    }
    
    print("Testing OSHA Form 300 generation with verification...")
    
    form_service = FormFillerService()
    output_path = form_service.generate_form("300", test_data)
    
    if not output_path:
        print("✗ Form generation failed.")
        return False

    print(f"✓ Form generated successfully: {output_path}")

    # --- Verification Step ---
    print("\nVerifying filled fields...")
    filled_fields = fillpdfs.get_form_fields(output_path)
    failures = 0

    # Fields to verify
    verification_map = {
        "Log of Injury/Illness Establishment name": test_data["establishment_name"],
        " 1": test_data["case_number"],
        "Employee's Name 1": test_data["employee_name"],
        "Number of days injured or ill away from work 1": test_data["days_away_count"],
    }

    for field, expected_value in verification_map.items():
        actual_value = filled_fields.get(field)
        if actual_value == expected_value:
            print(f"  ✓ SUCCESS: Field '{field}' is correct.")
        else:
            print(f"  ✗ FAILURE: Field '{field}' has value '{actual_value}', expected '{expected_value}'.")
            failures += 1
    
    if failures == 0:
        print("\n✓✓✓ All checks passed!")
        return True
    else:
        print(f"\n✗✗✗ {failures} verification(s) failed.")
        return False

if __name__ == "__main__":
    success = verify_form_test()
    sys.exit(0 if success else 1) 