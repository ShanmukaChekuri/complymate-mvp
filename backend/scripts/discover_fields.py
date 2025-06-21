#!/usr/bin/env python3
"""
Discover actual field names in OSHA templates using the production form filler.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.form_filler_service import ProductionFormFillerService

def main():
    """Discover field names in all OSHA templates"""
    print("🔍 Discovering Field Names in OSHA Templates")
    print("=" * 60)
    
    ff = ProductionFormFillerService()
    
    templates = ["300", "300A", "301"]
    
    for form_type in templates:
        print(f"\n📄 Analyzing Form {form_type}...")
        
        try:
            # Discover field names
            field_names = ff.discover_field_names(form_type)
            
            if field_names:
                print(f"✅ Found {len(field_names)} fields in Form {form_type}")
                
                # Test with sample data
                sample_data = {
                    "establishment_name": "Test Company",
                    "city": "Test City",
                    "state": "CA",
                    "employee_name": "John Doe",
                    "job_title": "Worker",
                    "date_of_injury": "01/15/2024"
                }
                
                print(f"\n🧪 Testing form generation with sample data...")
                result = ff.generate_form(form_type, sample_data)
                
                if result:
                    print(f"✅ Form generated successfully: {os.path.basename(result)}")
                else:
                    print(f"❌ Form generation failed")
                    
            else:
                print(f"❌ No fields found in Form {form_type}")
                
        except Exception as e:
            print(f"❌ Error analyzing Form {form_type}: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n🎯 Field Discovery Complete!")
    return 0

if __name__ == "__main__":
    exit(main()) 