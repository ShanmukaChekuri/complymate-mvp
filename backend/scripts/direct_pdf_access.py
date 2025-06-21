#!/usr/bin/env python3
"""
Direct PDF access to understand the structure
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pdfrw import PdfReader, PdfName
import logging

logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s')

def inspect_pdf_directly(pdf_path):
    """Direct inspection of PDF structure"""
    print(f"\n🔍 DIRECT INSPECTION: {pdf_path}")
    print("=" * 60)
    
    reader = PdfReader(str(pdf_path))
    
    # Check Root
    print(f"Root type: {type(reader.Root)}")
    print(f"Root keys: {list(reader.Root.keys())}")
    
    # Check AcroForm
    if PdfName('/AcroForm') in reader.Root:
        acroform = reader.Root.AcroForm
        print(f"\nAcroForm type: {type(acroform)}")
        print(f"AcroForm keys: {list(acroform.keys())}")
        
        # Try to access Fields directly
        fields_key = PdfName('/Fields')
        print(f"\nTrying to access {fields_key}...")
        
        # Method 1: Direct access
        try:
            fields1 = acroform[fields_key]
            print(f"Method 1 (acroform[fields_key]): {type(fields1)} - {fields1}")
        except Exception as e:
            print(f"Method 1 failed: {e}")
        
        # Method 2: Get method
        try:
            fields2 = acroform.get(fields_key)
            print(f"Method 2 (acroform.get(fields_key)): {type(fields2)} - {fields2}")
        except Exception as e:
            print(f"Method 2 failed: {e}")
        
        # Method 3: Raw dictionary access
        try:
            fields3 = acroform.indirect_objects
            print(f"Method 3 (acroform.indirect_objects): {type(fields3)}")
            if hasattr(fields3, 'keys'):
                print(f"Method 3 keys: {list(fields3.keys())}")
        except Exception as e:
            print(f"Method 3 failed: {e}")
        
        # Method 4: Check if it's a list
        try:
            if hasattr(acroform, '__iter__'):
                print(f"Method 4: AcroForm is iterable")
                for i, item in enumerate(acroform):
                    print(f"  Item {i}: {type(item)} - {item}")
        except Exception as e:
            print(f"Method 4 failed: {e}")
        
        # Method 5: Check all attributes
        print(f"\nAcroForm attributes: {dir(acroform)}")
        
        # Method 6: Try to access the raw PDF object
        try:
            raw_acroform = reader.Root.indirect_objects.get(reader.Root.AcroForm.indirect)
            print(f"Method 6 (raw_acroform): {type(raw_acroform)}")
            if raw_acroform:
                print(f"Raw AcroForm keys: {list(raw_acroform.keys())}")
        except Exception as e:
            print(f"Method 6 failed: {e}")
    
    else:
        print("No AcroForm found in Root")

def main():
    print("🚀 DIRECT PDF STRUCTURE INSPECTION")
    print("=" * 60)
    
    template_dir = Path(__file__).parent.parent / "app" / "static" / "templates"
    
    for form_type in ["300", "300A", "301"]:
        template_path = template_dir / f"osha_{form_type.lower()}_template.pdf"
        if template_path.exists():
            inspect_pdf_directly(template_path)
        else:
            print(f"Template not found: {template_path}")

if __name__ == "__main__":
    main() 