from pathlib import Path
from fillpdf import fillpdfs
import os
import shutil

def run_test(classification_value: str, test_data_base: dict):
    """Runs a single test for a given classification."""
    output_filename = f"debug_output_{classification_value.replace(' ', '_').replace('/', '_')}.pdf"
    output_path = Path(__file__).parent.parent / "generated_forms" / output_filename
    template_path = Path(__file__).parent.parent / "app" / "static" / "templates" / "osha_300_template.pdf"
    
    print(f"--- Running test for classification: '{classification_value}' ---")
    
    test_data = test_data_base.copy()
    test_data["Group1"] = classification_value
    
    # Set the corresponding total field
    if classification_value == "Death":
        test_data["Death Total"] = "1"
    elif classification_value == "Days away from work":
        test_data["Days away from work Total"] = "1"
    elif classification_value == "Job transfer or restriction":
        test_data["Job transfer or restriction Total"] = "1"
    elif classification_value == "Other recordable cases":
        test_data["Other recordable cases Total"] = "1"

    try:
        fillpdfs.write_fillable_pdf(
            str(template_path),
            str(output_path),
            test_data,
            flatten=False
        )
        print(f"SUCCESS: Generated test PDF at: {output_path}")
        
        # Verify the radio button value
        filled_fields = fillpdfs.get_form_fields(str(output_path))
        written_value = filled_fields.get("Group1", "NOT FOUND")
        if written_value == classification_value:
            print(f"SUCCESS: Radio button 'Group1' correctly set to '{written_value}'")
        else:
            print(f"FAILURE: Radio button 'Group1' has value '{written_value}' but expected '{classification_value}'")
        print("-" * 50)

    except Exception as e:
        print(f"ERROR filling PDF for classification '{classification_value}': {str(e)}")
        import traceback
        print(traceback.format_exc())
        print("-" * 50)


def debug_pdf_form():
    """Tests filling the OSHA 300 form with different classifications."""
    
    # Clean up previous debug files
    generated_forms_dir = Path(__file__).parent.parent / "generated_forms"
    for item in generated_forms_dir.glob("debug_output_*.pdf"):
        item.unlink()

    # Base data, common for all tests
    test_data_base = {
        "Log of Injury/Illness Year": "25",
        "Log of Injury/Illness Establishment name": "TEST COMPANY",
        "Log of Injury/Illness City": "TESTVILLE",
        "Log of Injury/Illness State": "CA",
        " 1": "C-1",
        "Employee's Name 1": "John Doe",
        "Job Title 1": "Operator",
        "Date of injury or Illness month 1": "07",
        "Date of injury or illness day 1": "01",
        "Where the Event Occurred 1": "Main Workshop",
        "Injury or Illness Description 1": "Caught in machine.",
        "Number of days injured or ill away from work 1": "15",
        "On job transfer or restriction 1": "0",
        "Death Total": "0",
        "Days away from work Total": "0",
        "Job transfer or restriction Total": "0",
        "Other recordable cases Total": "0",
    }
    
    # These are the exact 'export values' for the radio button options
    classifications_to_test = [
        "Death",
        "Days away from work",
        "Job transfer or restriction",
        "Other recordable cases"
    ]
    
    print("Starting OSHA 300 form debug tests...")
    
    for classification in classifications_to_test:
        run_test(classification, test_data_base)

if __name__ == "__main__":
    debug_pdf_form()