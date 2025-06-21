#!/usr/bin/env python3
"""
Inspects PDF form fields using pdfplumber to get the exact field names.
This is a more robust alternative to the pdfrw-based scripts that were failing.
"""

import sys
import os
from pathlib import Path
import pdfplumber

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

def inspect_with_pdfplumber(pdf_path: Path):
    """Inspects all form fields in a PDF using pdfplumber."""
    print(f"\n🔍 Inspecting PDF: {pdf_path.name}")
    print("=" * 60)
    
    field_count = 0
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                # pdfplumber uses 'annots' for annotations/fields
                annotations = page.annots
                if not annotations:
                    continue
                
                print(f"\n📄 Page {i + 1}:")
                
                for annot in annotations:
                    # Check if it's a form widget
                    if annot.get("subtype") == "Widget":
                        field_name = annot.get("title") or annot.get("T") # 'title' is often the user-friendly name, 'T' is the internal key
                        field_type = annot.get("ft") # Field Type (/Tx for text, /Btn for button, etc.)
                        
                        if field_name:
                            print(f"   📝 Field: '{field_name}'  (Type: {field_type})")
                            field_count += 1
                        else:
                            print(f"   ❓ Found a widget with no name (Type: {field_type})")
                            
        print(f"\n📊 Total fields found in {pdf_path.name}: {field_count}")
        return field_count
        
    except Exception as e:
        print(f"❌ Error inspecting PDF {pdf_path.name}: {e}")
        import traceback
        traceback.print_exc()
        return 0

def main():
    """Main function to inspect all OSHA form templates."""
    print("🔍 PDF Field Inspector (using pdfplumber)")
    print("=" * 60)
    
    templates_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    if not templates_dir.exists():
        print(f"❌ Templates directory not found at: {templates_dir}")
        return 1
    
    pdf_files = list(templates_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF templates found in {templates_dir}")
        return 1
        
    print(f"📁 Found {len(pdf_files)} PDF templates to inspect.")
    
    total_fields_found = 0
    for pdf_file in pdf_files:
        total_fields_found += inspect_with_pdfplumber(pdf_file)
        
    print("\n" + "=" * 60)
    print("🎯 INSPECTION SUMMARY")
    print(f"   Total PDFs inspected: {len(pdf_files)}")
    print(f"   Total fields found across all files: {total_fields_found}")
    print("=" * 60)
    
    print("\n💡 Now, I will use this exact output to update the field mappings in `form_filler_service.py`.")
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 