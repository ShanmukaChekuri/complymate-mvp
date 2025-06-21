#!/usr/bin/env python3
"""
Simple PDF field inspector to avoid str conflicts.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdfrw import PdfReader

def inspect_pdf_fields_simple(pdf_path):
    """Simple PDF field inspection"""
    print(f"\n🔍 Inspecting: {os.path.basename(pdf_path)}")
    print("-" * 50)
    
    try:
        pdf = PdfReader(pdf_path)
        field_count = 0
        
        for page_num, page in enumerate(pdf.pages):
            annotations = page.get('/Annots')
            if not annotations:
                continue
                
            print(f"\n📄 Page {page_num + 1}:")
            
            for annotation in annotations:
                if annotation.get('/Subtype') == '/Widget':
                    field_name = annotation.get('/T')
                    if field_name:
                        # Remove parentheses from field name
                        clean_name = field_name[1:-1] if field_name.startswith('(') and field_name.endswith(')') else field_name
                        field_type = annotation.get('/FT', 'Unknown')
                        
                        print(f"   📝 '{clean_name}' ({field_type})")
                        field_count += 1
        
        print(f"\n📊 Fields found: {field_count}")
        return field_count
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 0

def main():
    """Main function"""
    print("🔍 Simple PDF Field Inspector")
    print("=" * 50)
    
    templates_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    if not templates_dir.exists():
        print(f"❌ Templates directory not found")
        return 1
    
    pdf_files = list(templates_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF templates found")
        return 1
    
    print(f"📁 Found {len(pdf_files)} templates")
    
    total_fields = 0
    for pdf_file in pdf_files:
        fields = inspect_pdf_fields_simple(str(pdf_file))
        total_fields += fields
    
    print(f"\n🎯 Total fields across all PDFs: {total_fields}")
    
    return 0

if __name__ == "__main__":
    exit(main()) 