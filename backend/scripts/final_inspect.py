#!/usr/bin/env python3
"""
A robust PDF field inspection script using pdfrw, as requested.
This script is carefully written to avoid previous errors.
"""

import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdfrw import PdfReader

def inspect_single_pdf(pdf_path_obj: Path):
    """Inspects fields for a single PDF file."""
    print(f"\n🔍 Inspecting: {pdf_path_obj.name}")
    print("-" * 50)
    
    try:
        # pdfrw expects a string path, so we convert the Path object
        template_pdf = PdfReader(str(pdf_path_obj))
        field_count = 0

        for i, page in enumerate(template_pdf.pages):
            annotations = page.get('/Annots')
            if annotations:
                print(f"  📄 Page {i + 1}:")
                for annotation in annotations:
                    if annotation and annotation.get('/Subtype') == '/Widget':
                        field_key = annotation.get('/T')
                        if field_key:
                            # The key is in format '(<key_name>)', so we strip the parentheses
                            key_name = field_key[1:-1]
                            field_type = annotation.get('/FT')
                            print(f"    - Field: '{key_name}' (Type: {field_type})")
                            field_count += 1
        
        if field_count == 0:
            print("    No fillable fields found on any page.")
        else:
            print(f"  📊 Found {field_count} fields.")
            
    except Exception as e:
        print(f"\n❌ An error occurred while inspecting {pdf_path_obj.name}: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Main function to run the inspection."""
    print("🚀 Running Final PDF Field Inspection (with pdfrw)")
    
    templates_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    if not templates_dir.exists():
        print(f"❌ Directory not found: {templates_dir}")
        return 1
        
    pdf_files = list(templates_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ No PDF templates found in {templates_dir}")
        return 1
        
    for pdf_path in pdf_files:
        inspect_single_pdf(pdf_path)
        
    print("\n✅ Inspection complete. I will use this output to fix the mappings.")
    return 0

if __name__ == "__main__":
    sys.exit(main()) 