#!/usr/bin/env python3
"""
Quick test for the robust PDF filler
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.form_filler_service import RobustFormFillerService
import logging

# Set up logging to see what's happening
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s')

def main():
    print("🧪 QUICK TEST: Robust PDF Form Filler")
    print("=" * 50)
    
    service = RobustFormFillerService()
    
    # Test data
    test_data = {
        'establishment_name': 'Test Company ABC',
        'city': 'Los Angeles',
        'state': 'California', 
        'year_of_log': '2024',
        'employee_name': 'John Smith',
        'job_title': 'Machine Operator'
    }
    
    print(f"📊 Test data: {test_data}")
    
    # Test each form
    for form_type in ["300", "300A", "301"]:
        print(f"\n🔄 Testing Form {form_type}...")
        
        # First, discover fields
        field_names = service.discover_fields(form_type)
        
        if field_names:
            print(f"✅ Found {len(field_names)} fields")
            
            # Try to fill the form
            result = service.generate_form(form_type, test_data)
            
            if result:
                print(f"✅ SUCCESS: Generated {result}")
            else:
                print(f"❌ FAILED: Could not generate form")
        else:
            print(f"❌ No fields discovered")

if __name__ == "__main__":
    main() 