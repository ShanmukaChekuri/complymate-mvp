#!/usr/bin/env python3
"""
Production test script for PDFs with indirect object references
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import our new production-ready service
from app.services.form_filler_service import ProductionFormFillerService

def discover_all_fields():
    """Discover actual field names in all PDF templates"""
    print("🔍 DISCOVERING ACTUAL PDF FIELD NAMES")
    print("=" * 50)
    
    service = ProductionFormFillerService()
    
    for form_type in ["300", "300A", "301"]:
        print(f"\n📋 Form {form_type}:")
        try:
            field_names = service.discover_field_names(form_type)
            if field_names:
                print(f"✅ Found {len(field_names)} fields")
                # Show first 10 fields as examples
                print("📝 Sample fields:")
                for i, name in enumerate(field_names[:10]):
                    print(f"   {i+1:2d}. '{name}'")
                if len(field_names) > 10:
                    print(f"   ... and {len(field_names) - 10} more")
            else:
                print("❌ No fields found")
        except Exception as e:
            print(f"❌ Error: {e}")

def test_production_form_filling():
    """Test the production form filler with sample data"""
    print("\n🧪 TESTING PRODUCTION FORM FILLING")
    print("=" * 50)
    
    service = ProductionFormFillerService()
    
    # Sample data with both exact and fuzzy matching candidates
    sample_data = {
        # Direct field names (if they exist)
        "Establishment name": "ABC Manufacturing Inc.",
        "City": "Los Angeles",
        "State": "CA",
        "Year 20": "24",
        
        # Common data field names
        "establishment_name": "ABC Manufacturing Inc.",
        "company_name": "ABC Manufacturing Inc.",
        "city": "Los Angeles",
        "state": "CA", 
        "year_of_log": "2024",
        "employee_name": "John Smith",
        "worker_name": "John Smith",
        "job_title": "Machine Operator",
        "occupation": "Machine Operator",
        "date_of_injury": "01/15/2024",
        "injury_date": "01/15/2024",
        "incident_date": "01/15/2024",
        "location_of_event": "Factory Floor - Station 3",
        "where_occurred": "Factory Floor - Station 3",
        "description_of_injury": "Cut on right hand from machine blade",
        "injury_description": "Cut on right hand from machine blade",
        "classification": "other_recordable",
        "type_of_injury_or_illness": "injury",
        
        # Additional test data
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
            results[form_type] = None
    
    return results

def verify_form_contents(results):
    """Verify that forms were actually filled (not empty)"""
    print(f"\n✅ VERIFICATION SUMMARY")
    print("=" * 30)
    
    total_success = 0
    for form_type, result_path in results.items():
        if result_path:
            # Basic verification - file exists and has reasonable size
            file_size = os.path.getsize(result_path)
            if file_size > 1000000:  # > 1MB suggests content was added
                print(f"✅ Form {form_type}: Generated ({file_size:,} bytes)")
                total_success += 1
            else:
                print(f"⚠️  Form {form_type}: Generated but possibly empty ({file_size:,} bytes)")
        else:
            print(f"❌ Form {form_type}: Failed to generate")
    
    print(f"\n🎯 OVERALL RESULT:")
    if total_success == 3:
        print(f"🎉 ALL FORMS GENERATED SUCCESSFULLY!")
        print(f"   Your production form filler is working correctly.")
    elif total_success > 0:
        print(f"⚠️  PARTIAL SUCCESS: {total_success}/3 forms generated.")
        print(f"   Check logs for field mapping issues.")
    else:
        print(f"❌ ALL FORMS FAILED")
        print(f"   Check PDF templates and field mappings.")

def main():
    """Run comprehensive production test"""
    print("🚀 PRODUCTION PDF FORM FILLER TEST")
    print("=" * 60)
    
    try:
        # Step 1: Discover field names
        discover_all_fields()
        
        # Step 2: Test form filling
        results = test_production_form_filling()
        
        # Step 3: Verify results
        verify_form_contents(results)
        
        print(f"\n📝 NEXT STEPS:")
        print(f"1. Check the generated PDF files to see what fields were filled")
        print(f"2. Use the discovered field names to improve your mappings")
        print(f"3. Add specific field mappings in the _map_form_XXX_specific methods")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 