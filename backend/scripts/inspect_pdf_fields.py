#!/usr/bin/env python3
"""
Script to inspect the actual field names in PDF templates.
This will help us understand what the real field names are in the PDFs.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdfrw import PdfReader

def inspect_pdf_fields(pdf_path: str):
    """Inspect all form fields in a PDF"""
    print(f"\n🔍 Inspecting PDF: {os.path.basename(pdf_path)}")
    print("=" * 60)
    
    try:
        pdf = PdfReader(pdf_path)
        field_count = 0
        
        for page_num, page in enumerate(pdf.pages):
            annotations = page.get('/Annots')
            if annotations is None:
                continue
                
            print(f"\n📄 Page {page_num + 1}:")
            
            for annotation in annotations:
                if annotation.get('/Subtype') == '/Widget':
                    field_name = annotation.get('/T')
                    if field_name:
                        field_name = field_name[1:-1]  # Remove parentheses
                        field_type = annotation.get('/FT', 'Unknown')
                        field_flags = annotation.get('/Ff', 0)
                        
                        print(f"   📝 Field: '{field_name}' (Type: {field_type}, Flags: {field_flags})")
                        field_count += 1
                        
                        # For radio buttons, show the options
                        if field_type == '/Btn' and field_flags & (1 << 15):
                            if '/Kids' in annotation:
                                print(f"      🔘 Radio button options:")
                                for kid in annotation['/Kids']:
                                    if '/AP' in kid and '/N' in kid['/AP']:
                                        for key in kid['/AP']['/N'].keys():
                                            if key != '/Off':
                                                print(f"         - {key[1:]}")
        
        print(f"\n📊 Total fields found: {field_count}")
        return field_count
        
    except Exception as e:
        print(f"❌ Error inspecting PDF: {e}")
        import traceback
        traceback.print_exc()
        return 0

def main():
    """Inspect all OSHA form templates"""
    print("🔍 PDF Field Inspector")
    print("=" * 60)
    
    # Get the templates directory
    templates_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    if not templates_dir.exists():
        print(f"❌ Templates directory not found: {templates_dir}")
        return 1
    
    # List all PDF templates
    pdf_files = list(templates_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF templates found in {templates_dir}")
        return 1
    
    print(f"📁 Found {len(pdf_files)} PDF templates:")
    for pdf_file in pdf_files:
        print(f"   - {pdf_file.name}")
    
    total_fields = 0
    
    # Inspect each PDF
    for pdf_file in pdf_files:
        fields = inspect_pdf_fields(str(pdf_file))
        total_fields += fields
    
    print(f"\n🎯 SUMMARY:")
    print(f"   Total PDFs inspected: {len(pdf_files)}")
    print(f"   Total fields found: {total_fields}")
    
    print(f"\n💡 Next steps:")
    print(f"   1. Compare these field names with the mapping in form_filler_service.py")
    print(f"   2. Update the mapping to match the actual field names")
    print(f"   3. Test form generation again")
    
    return 0

if __name__ == "__main__":
    exit(main()) 