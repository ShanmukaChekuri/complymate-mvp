#!/usr/bin/env python3
"""
Test OSHA templates with PyPDF2 to see if they're actually fillable forms
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from PyPDF2 import PdfReader
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False
    print("PyPDF2 not available. Install with: pip install PyPDF2")

def test_with_pypdf2(pdf_path):
    """Test PDF with PyPDF2"""
    print(f"\n🔍 PyPDF2 TEST: {pdf_path}")
    print("=" * 50)
    
    if not PYPDF2_AVAILABLE:
        print("❌ PyPDF2 not available")
        return
    
    try:
        with open(pdf_path, 'rb') as file:
            reader = PdfReader(file)
            
            print(f"📄 Pages: {len(reader.pages)}")
            
            # Check for form fields
            if reader.get_fields():
                fields = reader.get_fields()
                print(f"✅ FOUND {len(fields)} FORM FIELDS!")
                print("📝 Field names:")
                for i, (field_name, field_obj) in enumerate(fields.items(), 1):
                    field_type = field_obj.get('/FT', 'Unknown')
                    print(f"   {i:2d}. '{field_name}' (Type: {field_type})")
                    if i >= 10:
                        print(f"   ... and {len(fields) - 10} more")
                        break
                return True
            else:
                print("❌ NO FORM FIELDS FOUND")
                print("   This PDF is NOT a fillable form")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_with_pdfrw_alternative(pdf_path):
    """Alternative pdfrw approach"""
    print(f"\n🔍 Alternative pdfrw TEST: {pdf_path}")
    print("=" * 50)
    
    try:
        from pdfrw import PdfReader as PdfRwReader
        
        reader = PdfRwReader(str(pdf_path))
        
        # Try to access the raw PDF structure
        print(f"Root type: {type(reader.Root)}")
        
        # Check if AcroForm exists as a key
        acroform_key = '/AcroForm'
        if acroform_key in reader.Root:
            print(f"✅ AcroForm key exists in Root")
            
            # Try to access it directly from the dictionary
            acroform = reader.Root[acroform_key]
            print(f"AcroForm type: {type(acroform)}")
            
            # Check if it's an indirect reference
            if hasattr(acroform, 'indirect'):
                print(f"AcroForm is indirect: {acroform.indirect}")
                
                # Try to resolve it
                if hasattr(reader, 'indirect_objects'):
                    resolved = reader.indirect_objects.get(acroform.indirect)
                    if resolved:
                        print(f"✅ Resolved AcroForm: {type(resolved)}")
                        print(f"Resolved keys: {list(resolved.keys())}")
                        
                        # Check for Fields
                        if '/Fields' in resolved:
                            fields_array = resolved['/Fields']
                            print(f"✅ FOUND FIELDS ARRAY: {type(fields_array)}")
                            print(f"Fields array length: {len(fields_array)}")
                            
                            # Try to access first few fields
                            for i, field_ref in enumerate(fields_array[:5]):
                                print(f"Field {i+1}: {type(field_ref)} - {field_ref}")
                        else:
                            print("❌ No /Fields in resolved AcroForm")
                    else:
                        print("❌ Could not resolve AcroForm")
            else:
                print(f"AcroForm is not indirect: {acroform}")
        else:
            print("❌ AcroForm key not found in Root")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def main():
    print("🚀 ALTERNATIVE PDF LIBRARY TEST")
    print("=" * 60)
    
    template_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    for form_type in ["300", "300A", "301"]:
        template_path = template_dir / f"osha_{form_type.lower()}_template.pdf"
        
        if template_path.exists():
            print(f"\n📄 Testing Form {form_type}")
            
            # Test with PyPDF2
            pypdf2_result = test_with_pypdf2(template_path)
            
            # Test with alternative pdfrw approach
            test_with_pdfrw_alternative(template_path)
            
            if pypdf2_result:
                print(f"✅ Form {form_type}: CONFIRMED FILLABLE")
            else:
                print(f"❌ Form {form_type}: NOT FILLABLE")
        else:
            print(f"❌ Template not found: {template_path}")

if __name__ == "__main__":
    main() 