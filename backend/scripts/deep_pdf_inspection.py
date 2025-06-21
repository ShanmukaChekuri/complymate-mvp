#!/usr/bin/env python3
"""
Deep PDF inspection to understand the exact structure of the OSHA templates.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdfrw import PdfReader, PdfName

def deep_inspect_pdf(pdf_path):
    """Perform deep inspection of PDF structure"""
    print(f"\n🔍 Deep Inspection of: {pdf_path}")
    print("=" * 60)
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return
    
    try:
        reader = PdfReader(str(pdf_path))
        print(f"📄 PDF has {len(reader.pages)} page(s)")
        
        # Inspect Root
        root = reader.Root
        print(f"\n📋 Root object type: {type(root)}")
        print(f"📋 Root keys: {list(root.keys())}")
        
        # Inspect AcroForm
        if PdfName('/AcroForm') in root:
            acroform = root.AcroForm
            print(f"\n📋 AcroForm type: {type(acroform)}")
            print(f"📋 AcroForm keys: {list(acroform.keys())}")
            
            # Try different ways to access Fields
            print(f"\n🔍 Trying to access Fields array:")
            
            # Method 1: Direct access
            try:
                fields1 = acroform.Fields
                print(f"   Method 1 (acroform.Fields): {type(fields1)} - {fields1}")
            except Exception as e:
                print(f"   Method 1 failed: {e}")
            
            # Method 2: Using PdfName
            try:
                fields2 = acroform.get(PdfName('/Fields'))
                print(f"   Method 2 (acroform.get(PdfName('/Fields'))): {type(fields2)} - {fields2}")
            except Exception as e:
                print(f"   Method 2 failed: {e}")
            
            # Method 3: Dictionary access
            try:
                fields3 = acroform['/Fields']
                print(f"   Method 3 (acroform['/Fields']): {type(fields3)} - {fields3}")
            except Exception as e:
                print(f"   Method 3 failed: {e}")
            
            # Method 4: Raw dictionary
            try:
                fields4 = acroform.indirect_objects
                print(f"   Method 4 (acroform.indirect_objects): {type(fields4)}")
                if hasattr(fields4, 'keys'):
                    print(f"   Method 4 keys: {list(fields4.keys())}")
            except Exception as e:
                print(f"   Method 4 failed: {e}")
            
            # Inspect each key in AcroForm
            print(f"\n🔍 Detailed AcroForm inspection:")
            for key in acroform.keys():
                try:
                    value = acroform[key]
                    print(f"   Key: {key}")
                    print(f"   Type: {type(value)}")
                    print(f"   Value: {value}")
                    if hasattr(value, '__len__'):
                        print(f"   Length: {len(value)}")
                    print()
                except Exception as e:
                    print(f"   Key: {key} - Error accessing: {e}")
            
        else:
            print("❌ No AcroForm found in Root")
        
        # Try to access fields through pages
        print(f"\n🔍 Page-level field inspection:")
        for page_num, page in enumerate(reader.pages):
            print(f"\n📄 Page {page_num + 1}:")
            print(f"   Page type: {type(page)}")
            print(f"   Page keys: {list(page.keys())}")
            
            # Check for Annots
            if PdfName('/Annots') in page:
                annots = page.Annots
                print(f"   Annots type: {type(annots)}")
                print(f"   Annots: {annots}")
                if hasattr(annots, '__len__'):
                    print(f"   Annots length: {len(annots)}")
            else:
                print("   No Annots found")
        
    except Exception as e:
        print(f"❌ Error during inspection: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Inspect all OSHA templates"""
    print("🚀 Deep PDF Structure Inspection")
    print("=" * 60)
    
    template_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    templates = [
        "osha_300_template.pdf",
        "osha_300a_template.pdf", 
        "osha_301_template.pdf"
    ]
    
    for template in templates:
        template_path = template_dir / template
        if template_path.exists():
            deep_inspect_pdf(template_path)
        else:
            print(f"❌ Template not found: {template_path}")
    
    return 0

if __name__ == "__main__":
    exit(main()) 