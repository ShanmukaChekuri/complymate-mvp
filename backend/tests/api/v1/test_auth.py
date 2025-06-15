from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_access_token

def test_login(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401

def test_register(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new@example.com",
            "password": "newpassword",
            "company_name": "New Company",
            "first_name": "New",
            "last_name": "User",
            "industry": "Technology",
            "employee_count": 50
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "password" not in data

def test_register_existing_email(client: TestClient, test_user):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "newpassword",
            "company_name": "New Company",
            "first_name": "New",
            "last_name": "User",
            "industry": "Technology",
            "employee_count": 50
        }
    )
    assert response.status_code == 400 