#!/usr/bin/env python3
"""
Simple test to see exactly what's happening with form generation.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.form_filler_service import FormFillerService

def test_simple_form():
    """Test with minimal data to see what's happening"""
    print("🔍 Simple Form Test")
    print("=" * 40)
    
    try:
        ff = FormFillerService()
        print("✅ FormFillerService initialized")
        
        # Very simple test data
        test_data = {
            "establishment_name": "TEST COMPANY",
            "city": "TEST CITY",
            "state": "CA",
            "year_of_log": "2024",
            "case_number": "001",
            "employee_name": "JOHN DOE",
            "job_title": "WORKER",
            "date_of_injury": "01/15",
            "location_of_event": "FACTORY",
            "description_of_injury": "CUT ON HAND",
            "classification": "other_recordable",
            "days_away_from_work": "0",
            "days_on_transfer_or_restriction": "0",
            "type_of_injury_or_illness": "injury"
        }
        
        print(f"\n📝 Test data ({len(test_data)} fields):")
        for key, value in test_data.items():
            print(f"   {key}: {value}")
        
        # Test Form 300 only
        print(f"\n🔄 Testing Form 300...")
        
        # Get mapped data
        mapped_data = ff._map_form_data("300", test_data)
        print(f"\n📊 Mapped data ({len(mapped_data)} fields):")
        for key, value in mapped_data.items():
            print(f"   '{key}': '{value}'")
        
        # Generate the form
        result = ff.generate_form("300", test_data)
        
        if result and os.path.exists(result):
            file_size = os.path.getsize(result)
            print(f"\n✅ Form generated successfully!")
            print(f"   📁 File: {os.path.basename(result)}")
            print(f"   📏 Size: {file_size:,} bytes")
            print(f"   📍 Location: {result}")
            
            if file_size > 1000:
                print(f"   ✅ File has content")
            else:
                print(f"   ⚠️  File seems small")
        else:
            print(f"\n❌ Form generation failed")
        
        return 0
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(test_simple_form()) 