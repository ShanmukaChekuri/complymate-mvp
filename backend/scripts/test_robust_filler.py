#!/usr/bin/env python3
"""
Test the robust form filler service with OSHA templates
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.form_filler_service import RobustFormFillerService

def test_field_discovery():
    """Test field discovery in all OSHA templates"""
    print("🔍 TESTING FIELD DISCOVERY")
    print("=" * 50)
    
    service = RobustFormFillerService()
    
    for form_type in ["300", "300A", "301"]:
        print(f"\n📋 Form {form_type}:")
        try:
            field_names = service.discover_fields(form_type)
            if field_names:
                print(f"✅ Found {len(field_names)} fields")
                print("📝 First 10 fields:")
                for i, name in enumerate(field_names[:10]):
                    print(f"   {i+1:2d}. '{name}'")
                if len(field_names) > 10:
                    print(f"   ... and {len(field_names) - 10} more")
            else:
                print("❌ No fields found")
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

def test_form_generation():
    """Test form generation with sample data"""
    print("\n🧪 TESTING FORM GENERATION")
    print("=" * 50)
    
    service = RobustFormFillerService()
    
    # Comprehensive sample data
    sample_data = {
        "establishment_name": "ABC Manufacturing Inc.",
        "city": "Los Angeles",
        "state": "CA",
        "year_of_log": "2024",
        "employee_name": "John Smith",
        "job_title": "Machine Operator",
        "date_of_injury": "01/15/2024",
        "location_of_event": "Factory Floor - Station 3",
        "description_of_injury": "Cut on right hand from machine blade",
        "classification": "other_recordable",
        "type_of_injury_or_illness": "injury",
        "phone": "555-123-4567",
        "zip": "90210",
        "annual_average_employees": "150",
        "total_hours_worked": "300000"
    }
    
    print(f"📊 Testing with {len(sample_data)} data fields")
    
    results = {}
    for form_type in ["300", "300A", "301"]:
        print(f"\n🔄 Testing Form {form_type}...")
        
        try:
            result_path = service.generate_form(form_type, sample_data)
            
            if result_path and os.path.exists(result_path):
                file_size = os.path.getsize(result_path)
                print(f"✅ SUCCESS!")
                print(f"   📄 File: {os.path.basename(result_path)}")
                print(f"   📏 Size: {file_size:,} bytes")
                print(f"   📍 Path: {result_path}")
                results[form_type] = result_path
            else:
                print(f"❌ FAILED - No output file generated")
                results[form_type] = None
                
        except Exception as e:
            print(f"❌ ERROR: {e}")
            import traceback
            traceback.print_exc()
            results[form_type] = None
    
    return results

def main():
    """Run comprehensive test"""
    print("🚀 ROBUST FORM FILLER TEST")
    print("=" * 60)
    
    try:
        # Step 1: Discover fields
        test_field_discovery()
        
        # Step 2: Test form generation
        results = test_form_generation()
        
        # Step 3: Summary
        print(f"\n📋 SUMMARY")
        print("=" * 30)
        
        success_count = 0
        for form_type, result_path in results.items():
            if result_path:
                file_size = os.path.getsize(result_path)
                print(f"✅ Form {form_type}: Generated ({file_size:,} bytes)")
                success_count += 1
            else:
                print(f"❌ Form {form_type}: Failed")
        
        print(f"\n🎯 RESULT: {success_count}/3 forms generated successfully")
        
        if success_count == 3:
            print("🎉 ALL FORMS WORKING! The robust form filler is successful.")
        elif success_count > 0:
            print("⚠️  PARTIAL SUCCESS - Some forms are working.")
        else:
            print("❌ NO FORMS WORKING - Check the field discovery results above.")
        
        return success_count > 0
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 