#!/usr/bin/env python3
"""
Debug script to see exactly what's happening during form generation.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.form_filler_service import FormFillerService

def debug_form_generation():
    """Debug the form generation process"""
    print("🔍 Debug Form Generation Process")
    print("=" * 50)
    
    try:
        # Initialize the form filler service
        ff = FormFillerService()
        print("✅ FormFillerService initialized")
        
        # Sample data
        sample_data = {
            "establishment_name": "Test Company",
            "city": "Test City",
            "state": "CA",
            "year_of_log": "2024",
            "case_number": "001",
            "employee_name": "John Doe",
            "job_title": "Worker",
            "date_of_injury": "01/15",
            "location_of_event": "Factory Floor",
            "description_of_injury": "Cut on hand",
            "classification": "other_recordable",
            "days_away_from_work": "0",
            "days_on_transfer_or_restriction": "0",
            "type_of_injury_or_illness": "injury"
        }
        
        print(f"\n📝 Sample data ({len(sample_data)} fields):")
        for key, value in sample_data.items():
            print(f"   {key}: {value}")
        
        # Test mapping for each form type
        for form_type in ["300", "300A", "301"]:
            print(f"\n🔄 Testing mapping for Form {form_type}:")
            print("-" * 40)
            
            try:
                # Get the mapped data
                mapped_data = ff._map_form_data(form_type, sample_data)
                
                print(f"📊 Mapped {len(mapped_data)} fields:")
                for key, value in mapped_data.items():
                    print(f"   '{key}': '{value}'")
                
                # Try to generate the form
                print(f"\n🔄 Generating Form {form_type}...")
                result = ff.generate_form(form_type, sample_data)
                
                if result and os.path.exists(result):
                    file_size = os.path.getsize(result)
                    print(f"✅ Form {form_type} generated successfully!")
                    print(f"   📁 File: {os.path.basename(result)}")
                    print(f"   📏 Size: {file_size:,} bytes")
                    
                    # Check if file is actually filled
                    if file_size > 1000:  # Basic check for non-empty file
                        print(f"   ✅ File appears to have content")
                    else:
                        print(f"   ⚠️  File seems small, may be empty")
                        
                else:
                    print(f"❌ Form {form_type} generation failed")
                    
            except Exception as e:
                print(f"❌ Error with Form {form_type}: {e}")
                import traceback
                traceback.print_exc()
        
        return 0
        
    except Exception as e:
        print(f"❌ General error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(debug_form_generation()) 