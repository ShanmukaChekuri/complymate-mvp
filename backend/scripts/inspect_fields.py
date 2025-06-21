import pdfrw
from pathlib import Path

# Define the path to the PDF template
TEMPLATE_PATH = Path(__file__).parent.parent / "app" / "static" / "templates" / "osha_300_template.pdf"

def inspect_pdf_fields():
    """
    Reads a PDF and prints out all its fillable field names (keys).
    """
    print(f"Inspecting fields for: {TEMPLATE_PATH}")
    
    try:
        template_pdf = pdfrw.PdfReader(str(TEMPLATE_PATH))
        print("PDF loaded successfully. Annotations per page:")

        for i, page in enumerate(template_pdf.pages):
            annotations = page.get('/Annots')
            if annotations:
                print(f"\n--- Page {i+1} ---")
                for annotation in annotations:
                    # Check if it's a form field
                    if annotation and annotation.get('/Subtype') == '/Widget':
                        field_key = annotation.get('/T')
                        if field_key:
                            # The key is in format '(<key_name>)', so we strip the parentheses
                            key_name = field_key[1:-1]
                            print(f"  Field Key: '{key_name}'")

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("Please ensure 'pdfrw' is installed ('pip install pdfrw') and the template path is correct.")

if __name__ == "__main__":
    inspect_pdf_fields() 