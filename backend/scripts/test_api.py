import requests
import json
from pathlib import Path
import sys
import logging
import traceback
import uuid

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000/api/v1"

# Replace the static test email with a unique one for each run
TEST_EMAIL = f"test_{uuid.uuid4()}@example.com"
TEST_PASSWORD = "TestPass123!"

def test_health():
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    logger.info("Health check passed")

def test_auth_endpoints():
    # Register
    register_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "company_name": "Test Company",
        "first_name": "Test",
        "last_name": "User",
        "industry": "Technology",
        "employee_count": 100
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    try:
        reg_json = r.json()
    except Exception:
        reg_json = r.text
    print("Register:", r.status_code, reg_json)
    assert r.status_code == 201 or (r.status_code == 400 and "already exists" in str(reg_json))

    # Login
    login_data = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    try:
        login_json = r.json()
    except Exception:
        login_json = r.text
    print("Login:", r.status_code, login_json)
    assert r.status_code == 200
    access_token = login_json["access_token"]
    refresh_token = login_json["refresh_token"]

    # Get current user
    headers = {"Authorization": f"Bearer {access_token}"}
    r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    try:
        me_json = r.json()
    except Exception:
        me_json = r.text
    print("Me:", r.status_code, me_json)
    assert r.status_code == 200

    # Refresh token
    r = requests.post(f"{BASE_URL}/auth/refresh", json={"refresh_token": refresh_token})
    try:
        refresh_json = r.json()
    except Exception:
        refresh_json = r.text
    print("Refresh:", r.status_code, refresh_json)
    assert r.status_code == 200
    print("All auth endpoint tests passed!")
    return access_token, refresh_token

def test_forms(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test form creation
    form_data = {
        "title": "Test Form",
        "type": "OSHA 300",
        "year": 2024,
        "content": {"test": "data"}
    }
    response = requests.post(f"{BASE_URL}/forms", json=form_data, headers=headers)
    assert response.status_code == 200
    form_id = response.json()["id"]
    logger.info("Form creation passed")

    # Test form retrieval
    response = requests.get(f"{BASE_URL}/forms/{form_id}", headers=headers)
    assert response.status_code == 200
    logger.info("Form retrieval passed")

    return form_id

def test_chat(token, form_id):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test chat session creation
    session_data = {
        "form_id": form_id,
        "context": {"test": "context"},
        "model_used": "gpt-4"
    }
    response = requests.post(f"{BASE_URL}/chat/sessions", json=session_data, headers=headers)
    assert response.status_code == 200
    session_id = response.json()["id"]
    logger.info("Chat session creation passed")

    # Test message creation
    message_data = {
        "role": "user",
        "content": "Test message"
    }
    response = requests.post(
        f"{BASE_URL}/chat/sessions/{session_id}/messages",
        json=message_data,
        headers=headers
    )
    assert response.status_code == 200
    logger.info("Message creation passed")

def test_files(token, form_id):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test file upload
    files = {
        "file": ("test.pdf", open("test.pdf", "rb"), "application/pdf")
    }
    # Send form_id as a query parameter
    response = requests.post(
        f"{BASE_URL}/files/upload?form_id={form_id}",
        files=files,
        headers=headers
    )
    print("File upload status:", response.status_code, "response:", response.text)
    assert response.status_code == 200
    logger.info("File upload passed")

def test_analytics(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test dashboard stats
    response = requests.get(f"{BASE_URL}/analytics/dashboard", headers=headers)
    assert response.status_code == 200
    logger.info("Analytics dashboard passed")

def main():
    try:
        logger.info("Starting API tests...")
        test_health()
        access_token, refresh_token = test_auth_endpoints()
        form_id = test_forms(access_token)
        test_chat(access_token, form_id)
        test_files(access_token, form_id)
        test_analytics(access_token)
        logger.info("All tests passed successfully!")
    except Exception as e:
        logger.error(f"Test failed: {e}\n{traceback.format_exc()}")
        sys.exit(1)

if __name__ == "__main__":
    main() 