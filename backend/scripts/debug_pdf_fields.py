#!/usr/bin/env python3
"""
Debug script to extract field names from PDFs with centralized field storage.
This handles PDFs where fields are stored in AcroForm /Fields array.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdfrw import PdfReader, PdfName

def extract_fields_from_acroform(pdf_path):
    """Extract field names from PDFs that store fields in AcroForm /Fields array"""
    print(f"\n🔍 Analyzing PDF: {pdf_path}")
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return {}
    
    try:
        reader = PdfReader(str(pdf_path))
        print(f"📄 PDF has {len(reader.pages)} page(s)")
        
        # Check if AcroForm exists
        if not reader.Root.AcroForm:
            print("❌ No AcroForm found in PDF")
            return {}
        
        acroform = reader.Root.AcroForm
        print(f"✅ AcroForm found with keys: {list(acroform.keys())}")
        
        # Get the Fields array
        fields_array = acroform.get(PdfName('/Fields'))
        if not fields_array:
            print("❌ No /Fields array found in AcroForm")
            return {}
        
        print(f"📋 Found {len(fields_array)} field references in /Fields array")
        
        all_fields = {}
        
        # Iterate through each field reference
        for i, field_ref in enumerate(fields_array):
            try:
                # Resolve the field object
                field_obj = reader.getobject(field_ref)
                
                if field_obj:
                    # Get the field name
                    field_name_obj = field_obj.get(PdfName('/T'))
                    if field_name_obj:
                        field_name = str(field_name_obj)[1:-1]  # Remove quotes
                        
                        # Get current value
                        current_value = field_obj.get(PdfName('/V'))
                        field_value = str(current_value) if current_value else ""
                        
                        # Get field type
                        field_type = field_obj.get(PdfName('/FT'))
                        field_type_str = str(field_type) if field_type else "Unknown"
                        
                        all_fields[field_name] = {
                            'value': field_value,
                            'type': field_type_str,
                            'index': i
                        }
                        
                        print(f"   {i+1:3d}. '{field_name}' (Type: {field_type_str})")
                
            except Exception as e:
                print(f"   ⚠️  Error processing field {i}: {e}")
                continue
        
        print(f"\n📊 Total fields extracted: {len(all_fields)}")
        return all_fields
        
    except Exception as e:
        print(f"❌ Error analyzing PDF: {e}")
        import traceback
        traceback.print_exc()
        return {}

def main():
    """Analyze all OSHA templates"""
    print("🚀 PDF Field Extraction from AcroForm /Fields Array")
    print("=" * 60)
    
    template_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    templates = [
        "osha_300_template.pdf",
        "osha_300a_template.pdf", 
        "osha_301_template.pdf"
    ]
    
    all_results = {}
    
    for template in templates:
        template_path = template_dir / template
        if template_path.exists():
            fields = extract_fields_from_acroform(template_path)
            all_results[template] = fields
        else:
            print(f"❌ Template not found: {template_path}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 SUMMARY")
    print("=" * 60)
    
    for template, fields in all_results.items():
        print(f"\n📄 {template}:")
        print(f"   Fields found: {len(fields)}")
        if fields:
            print("   Sample fields:")
            for i, (field_name, info) in enumerate(list(fields.items())[:5], 1):
                print(f"     {i}. '{field_name}'")
            if len(fields) > 5:
                print(f"     ... and {len(fields) - 5} more")
    
    return 0

if __name__ == "__main__":
    exit(main()) 