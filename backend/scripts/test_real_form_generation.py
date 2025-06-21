#!/usr/bin/env python3
"""
Enhanced test script to debug PDF form field mapping issues.
This will help identify the exact field names and troubleshoot filling problems.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.form_filler_service import FormFillerService
from pdfrw import PdfReader, PdfName

def analyze_pdf_structure(pdf_path):
    """Analyze the structure of a PDF form to understand its fields"""
    print(f"\n🔍 Analyzing PDF: {pdf_path}")
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return {}
    
    try:
        reader = PdfReader(str(pdf_path))
        print(f"📄 PDF has {len(reader.pages)} page(s)")
        
        all_fields = {}
        
        for page_num, page in enumerate(reader.pages):
            print(f"\n📝 Analyzing page {page_num + 1}...")
            
            annotations = page.get(PdfName('/Annots'))
            if annotations is None:
                print("   No annotations found on this page")
                continue
            
            page_fields = 0
            for annotation in annotations:
                subtype = annotation.get(PdfName('/Subtype'))
                field_name_obj = annotation.get(PdfName('/T'))
                
                if subtype == PdfName('/Widget') and field_name_obj:
                    field_name = str(field_name_obj)[1:-1]  # Remove quotes
                    current_value = annotation.get(PdfName('/V'))
                    field_type = annotation.get(PdfName('/FT'))
                    
                    all_fields[field_name] = {
                        'value': str(current_value) if current_value else "",
                        'type': str(field_type) if field_type else "Unknown",
                        'page': page_num + 1
                    }
                    page_fields += 1
            
            print(f"   Found {page_fields} form fields on page {page_num + 1}")
        
        print(f"\n📊 Total fields found: {len(all_fields)}")
        
        if all_fields:
            print("\n🏷️  Field Names Found:")
            for i, (field_name, info) in enumerate(sorted(all_fields.items()), 1):
                print(f"   {i:2d}. '{field_name}' (Type: {info['type']}, Page: {info['page']})")
        
        return all_fields
        
    except Exception as e:
        print(f"❌ Error analyzing PDF: {e}")
        return {}

def test_form_filling_with_debug():
    """Test form filling with enhanced debugging"""
    print("🧪 Testing PDF Form Filling with Enhanced Debugging\n")
    
    try:
        # Initialize the form filler service
        ff = FormFillerService()
        print("✅ FormFillerService initialized")
        
        # Check if template files exist
        template_files = {
            "300": ff.templates_dir / "osha_300_template.pdf",
            "300A": ff.templates_dir / "osha_300a_template.pdf", 
            "301": ff.templates_dir / "osha_301_template.pdf"
        }
        
        print(f"\n📁 Looking for templates in: {ff.templates_dir}")
        
        available_templates = {}
        for form_type, template_path in template_files.items():
            if template_path.exists():
                print(f"✅ Found template for Form {form_type}: {template_path.name}")
                available_templates[form_type] = template_path
            else:
                print(f"❌ Missing template for Form {form_type}: {template_path}")
        
        if not available_templates:
            print("❌ No template files found! Please ensure PDF templates are in the templates directory.")
            return False
        
        # Analyze each available template
        all_field_mappings = {}
        for form_type, template_path in available_templates.items():
            fields = analyze_pdf_structure(template_path)
            all_field_mappings[form_type] = fields
        
        # Sample data for testing
        sample_data = {
            "establishment_name": "ABC Manufacturing Inc.",
            "city": "Los Angeles", 
            "state": "CA",
            "year_of_log": "2024",
            "employee_name": "John Smith",
            "job_title": "Machine Operator",
            "date_of_injury": "01/15",
            "location_of_event": "Factory Floor",
            "description_of_injury": "Cut on hand",
            "classification": "other_recordable",
            "type_of_injury_or_illness": "injury"
        }
        
        print(f"\n🎯 Testing with sample data: {len(sample_data)} fields")
        
        # Test form generation for each available template
        for form_type in available_templates.keys():
            print(f"\n🔄 Testing Form {form_type}...")
            
            try:
                # First, let's see what our mapping function produces
                mapped_data = ff._map_form_data(form_type, sample_data)
                print(f"📋 Mapped data contains {len(mapped_data)} fields:")
                for key, value in mapped_data.items():
                    print(f"   '{key}' = '{value}'")
                
                # Check which mapped fields exist in the actual PDF
                pdf_fields = all_field_mappings[form_type]
                matched_fields = []
                unmatched_fields = []
                
                for mapped_field in mapped_data.keys():
                    if mapped_field in pdf_fields:
                        matched_fields.append(mapped_field)
                    else:
                        unmatched_fields.append(mapped_field)
                
                print(f"\n✅ Matched fields ({len(matched_fields)}):")
                for field in matched_fields:
                    print(f"   ✓ '{field}'")
                
                if unmatched_fields:
                    print(f"\n❌ Unmatched fields ({len(unmatched_fields)}):")
                    for field in unmatched_fields:
                        print(f"   ✗ '{field}'")
                    
                    print(f"\n💡 Suggestions for unmatched fields:")
                    for unmatched in unmatched_fields[:5]:  # Show first 5
                        similar_fields = [pdf_field for pdf_field in pdf_fields.keys() 
                                        if any(word in pdf_field.lower() for word in unmatched.lower().split())]
                        if similar_fields:
                            print(f"   '{unmatched}' might match: {similar_fields[:3]}")
                
                # Generate the form
                result = ff.generate_form(form_type, sample_data)
                
                if result and os.path.exists(result):
                    file_size = os.path.getsize(result)
                    print(f"\n✅ Form {form_type} generated!")
                    print(f"   📄 File: {os.path.basename(result)}")
                    print(f"   📏 Size: {file_size:,} bytes")
                    print(f"   📍 Location: {result}")
                    
                    if len(matched_fields) == 0:
                        print(f"   ⚠️  WARNING: No fields were matched - the PDF will be empty!")
                    else:
                        print(f"   ✅ Successfully matched {len(matched_fields)} fields")
                else:
                    print(f"❌ Form {form_type} generation failed")
                    
            except Exception as e:
                print(f"❌ Error testing Form {form_type}: {e}")
                import traceback
                traceback.print_exc()
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

def generate_field_mapping_code(form_type, pdf_fields):
    """Generate Python code for correct field mapping based on actual PDF fields"""
    print(f"\n🔧 Generating mapping code for Form {form_type}:")
    print("```python")
    print(f"def _map_form_{form_type.lower()}_data(self, data: Dict[str, Any]) -> Dict[str, Any]:")
    print("    mapped = {}")
    print("    # TODO: Map your data fields to these PDF field names:")
    
    for field_name in sorted(pdf_fields.keys())[:10]:  # Show first 10 fields
        safe_key = field_name.lower().replace(' ', '_').replace('(', '').replace(')', '').replace(',', '')
        print(f"    # if '{safe_key}' in data:")
        print(f"    #     mapped['{field_name}'] = str(data['{safe_key}'])")
    
    print("    return mapped")
    print("```")

def main():
    """Run the enhanced debug test"""
    print("🚀 Enhanced PDF Form Filling Debug Test")
    print("=" * 50)
    
    success = test_form_filling_with_debug()
    
    if success:
        print("\n✅ DEBUG TEST COMPLETED!")
        print("📝 Check the output above to see field matching results.")
    else:
        print("\n❌ DEBUG TEST FAILED!")
        print("📝 Please check the errors above.")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())