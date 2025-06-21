import os
import requests
from pathlib import Path

# OSHA form template URLs
TEMPLATE_URLS = {
    "300": "https://www.osha.gov/sites/default/files/OSHA-300-form.pdf",
    "300A": "https://www.osha.gov/sites/default/files/OSHA-300A-form.pdf",
    "301": "https://www.osha.gov/sites/default/files/OSHA-301-form.pdf"
}

def download_templates():
    """Download OSHA form templates"""
    templates_dir = Path(__file__).parent.parent / "app" / "templates"
    templates_dir.mkdir(exist_ok=True)
    
    for form_type, url in TEMPLATE_URLS.items():
        try:
            response = requests.get(url)
            response.raise_for_status()
            
            template_path = templates_dir / f"osha_{form_type.lower()}_template.pdf"
            with open(template_path, "wb") as f:
                f.write(response.content)
                
            print(f"Downloaded template for Form {form_type}")
            
        except Exception as e:
            print(f"Error downloading template for Form {form_type}: {str(e)}")
            
if __name__ == "__main__":
    download_templates() 