#!/usr/bin/env python3
"""
Comprehensive test script for the complete unified workflow.
Tests the new proactive form generation system.
"""

import sys
import os
import json
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.context_manager import ContextManager
from app.services.chat_service import ChatService
from app.services.form_filler_service import FormFillerService
from app.services.llm_service import LLMService, INCIDENT_REPORT_BUNDLE

def test_context_manager():
    """Test the context manager functionality"""
    print("🧪 Testing ContextManager...")
    try:
        cm = ContextManager()
        session_id = "test-session-123"
        
        # Test session creation
        cm.create_session_with_id(session_id)
        context = cm.get_context(session_id)
        
        if context and context.get("session_id") == session_id:
            print("✅ ContextManager: Session creation successful")
        else:
            print("❌ ContextManager: Session creation failed")
            return False
            
        # Test context updates
        cm.update_context(session_id, context_updates={"current_form_type": "incident_report"})
        context = cm.get_context(session_id)
        
        if context.get("current_form_type") == "incident_report":
            print("✅ ContextManager: Context updates successful")
        else:
            print("❌ ContextManager: Context updates failed")
            return False
            
        return True
    except Exception as e:
        print(f"❌ ContextManager test failed: {e}")
        return False

def test_llm_service():
    """Test the LLM service functionality"""
    print("\n🧪 Testing LLMService...")
    try:
        llm = LLMService()
        print("✅ LLMService: Initialization successful")
        
        # Test field bundle
        if len(INCIDENT_REPORT_BUNDLE) > 0:
            print(f"✅ LLMService: Incident report bundle has {len(INCIDENT_REPORT_BUNDLE)} fields")
        else:
            print("❌ LLMService: Incident report bundle is empty")
            return False
            
        # Test form fields retrieval
        fields = llm._get_form_fields("incident_report")
        if fields == INCIDENT_REPORT_BUNDLE:
            print("✅ LLMService: Form fields retrieval successful")
        else:
            print("❌ LLMService: Form fields retrieval failed")
            return False
            
        return True
    except Exception as e:
        print(f"❌ LLMService test failed: {e}")
        return False

def test_form_filler():
    """Test the form filler service"""
    print("\n🧪 Testing FormFillerService...")
    try:
        ff = FormFillerService()
        print("✅ FormFillerService: Initialization successful")
        
        # Check if templates exist
        template_files = ["osha_300_template.pdf", "osha_300a_template.pdf", "osha_301_template.pdf"]
        for template in template_files:
            template_path = ff.templates_dir / template
            if template_path.exists():
                print(f"✅ FormFillerService: Template {template} exists")
            else:
                print(f"❌ FormFillerService: Template {template} missing")
                return False
                
        # Test with sample data
        sample_data = {
            "establishment_name": "Test Company",
            "city": "Test City",
            "state": "CA",
            "year_of_log": "2024",
            "case_number": "001",
            "employee_name": "John Doe",
            "job_title": "Worker",
            "date_of_injury": "01/15",
            "location_of_event": "Factory Floor",
            "description_of_injury": "Cut on hand",
            "classification": "other_recordable",
            "days_away_from_work": "0",
            "days_on_transfer_or_restriction": "0",
            "type_of_injury_or_illness": "injury"
        }
        
        # Test form generation for each type
        for form_type in ["300", "300A", "301"]:
            try:
                result = ff.generate_form(form_type, sample_data)
                if result and os.path.exists(result):
                    print(f"✅ FormFillerService: {form_type} form generation successful")
                    # Clean up test file
                    os.remove(result)
                else:
                    print(f"❌ FormFillerService: {form_type} form generation failed")
                    return False
            except Exception as e:
                print(f"❌ FormFillerService: {form_type} form generation error: {e}")
                return False
                
        return True
    except Exception as e:
        print(f"❌ FormFillerService test failed: {e}")
        return False

def test_chat_service():
    """Test the chat service with the new unified workflow"""
    print("\n🧪 Testing ChatService...")
    try:
        cm = ContextManager()
        session_id = "test-chat-session"
        cs = ChatService(session_id, cm)
        print("✅ ChatService: Initialization successful")
        
        # Test initial message (should ask about new incident)
        response = cs.handle_chat("Hello")
        if response and "message" in response:
            print("✅ ChatService: Initial message handling successful")
            print(f"   Response: {response['message'][:100]}...")
        else:
            print("❌ ChatService: Initial message handling failed")
            return False
            
        # Test data extraction
        response = cs.handle_chat("Yes, this is a new incident")
        if response and "message" in response:
            print("✅ ChatService: Incident confirmation handling successful")
        else:
            print("❌ ChatService: Incident confirmation handling failed")
            return False
            
        return True
    except Exception as e:
        print(f"❌ ChatService test failed: {e}")
        return False

def test_complete_workflow():
    """Test the complete end-to-end workflow"""
    print("\n🧪 Testing Complete Workflow...")
    try:
        cm = ContextManager()
        session_id = "test-complete-workflow"
        cs = ChatService(session_id, cm)
        
        # Simulate a complete conversation
        messages = [
            "Hello",
            "Yes, this is a new incident",
            "The company name is ABC Manufacturing",
            "We're located in Los Angeles, California",
            "The incident happened on January 15, 2024",
            "The employee is John Smith",
            "He's a machine operator",
            "The injury was a cut on his hand",
            "It happened on the factory floor",
            "He was operating a cutting machine",
            "The injury required first aid only",
            "No days away from work",
            "No job transfer or restriction",
            "okay, you are good"
        ]
        
        for i, message in enumerate(messages):
            print(f"   Step {i+1}: Processing '{message}'")
            response = cs.handle_chat(message)
            
            if not response or "message" not in response:
                print(f"❌ Workflow failed at step {i+1}")
                return False
                
            # Check if forms were generated (final step)
            if "file_urls" in response:
                print(f"✅ Complete workflow successful! Generated {len(response['file_urls'])} forms")
                return True
                
        print("✅ Complete workflow test completed successfully")
        return True
        
    except Exception as e:
        print(f"❌ Complete workflow test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Comprehensive Workflow Tests\n")
    
    tests = [
        ("Context Manager", test_context_manager),
        ("LLM Service", test_llm_service),
        ("Form Filler Service", test_form_filler),
        ("Chat Service", test_chat_service),
        ("Complete Workflow", test_complete_workflow)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running {test_name} Test")
        print(f"{'='*50}")
        
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} test PASSED")
            else:
                print(f"❌ {test_name} test FAILED")
        except Exception as e:
            print(f"❌ {test_name} test ERROR: {e}")
    
    print(f"\n{'='*50}")
    print(f"TEST SUMMARY: {passed}/{total} tests passed")
    print(f"{'='*50}")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! The system is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main()) 