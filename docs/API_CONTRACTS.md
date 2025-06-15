# ComplyMate API Contracts

## API Versioning
- Base URL: `/api/v1`
- Version Header: `X-API-Version: 1.0`
- Deprecation Notice: 6 months before version removal

## Authentication

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "company_name": "string",
  "first_name": "string",
  "last_name": "string",
  "industry": "string",
  "employee_count": "integer",
  "role": "string"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "string",
  "company_name": "string",
  "first_name": "string",
  "last_name": "string",
  "created_at": "datetime"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: 200 OK
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "string"
}
```

## PDF Processing

### Upload Form
```http
POST /api/v1/forms/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": "binary",
  "form_type": "string" // Optional, auto-detected if not provided
}

Response: 201 Created
{
  "id": "uuid",
  "form_type": "string",
  "status": "string",
  "extracted_fields": {
    "employee_name": "string",
    "incident_date": "date",
    "injury_description": "string",
    // ... other fields
  },
  "missing_fields": ["string"],
  "validation_issues": [
    {
      "field": "string",
      "issue": "string",
      "severity": "string"
    }
  ]
}
```

### Process Form
```http
POST /api/v1/forms/{form_id}/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "processing_type": "string", // "extract", "validate", "complete"
  "options": {
    "extract_tables": "boolean",
    "extract_text": "boolean",
    "validate_compliance": "boolean"
  }
}

Response: 200 OK
{
  "status": "string",
  "progress": "float",
  "results": {
    "extracted_data": "object",
    "validation_results": "array",
    "completion_suggestions": "array"
  }
}
```

## AI Chat Interface

### Start Chat Session
```http
POST /api/v1/chat/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "form_id": "uuid",
  "context": {
    "form_type": "string",
    "missing_fields": ["string"],
    "extracted_data": "object"
  }
}

Response: 201 Created
{
  "session_id": "uuid",
  "initial_question": "string",
  "available_options": ["string"],
  "context": "object"
}
```

### Chat Message
```http
POST /api/v1/chat/sessions/{session_id}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "string",
  "selected_option": "string", // Optional
  "context_update": "object" // Optional
}

Response: 200 OK
{
  "response": "string",
  "next_question": "string",
  "available_options": ["string"],
  "form_updates": {
    "field": "string",
    "value": "string"
  },
  "completion_status": "float"
}
```

## Form Management

### List Forms
```http
GET /api/v1/forms
Authorization: Bearer {token}
Query Parameters:
  - status: string
  - type: string
  - year: integer
  - page: integer
  - size: integer

Response: 200 OK
{
  "forms": [
    {
      "id": "uuid",
      "title": "string",
      "type": "string",
      "status": "string",
      "created_at": "datetime",
      "updated_at": "datetime",
      "completion_percentage": "float"
    }
  ],
  "total": "integer",
  "page": "integer",
  "size": "integer"
}
```

### Generate PDF
```http
POST /api/v1/forms/{form_id}/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "format": "string", // "pdf", "excel"
  "include_metadata": "boolean",
  "watermark": "boolean"
}

Response: 200 OK
{
  "download_url": "string",
  "expires_at": "datetime",
  "file_size": "integer"
}
```

## Analytics

### Get Dashboard Stats
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer {token}

Response: 200 OK
{
  "total_forms": "integer",
  "completed_forms": "integer",
  "dart_rate": "float",
  "injury_trends": {
    "monthly": ["float"],
    "by_type": "object"
  },
  "completion_times": {
    "average": "float",
    "by_form_type": "object"
  }
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

## Rate Limiting
- Standard: 100 requests per minute
- AI Chat: 20 requests per minute
- PDF Processing: 10 requests per minute
- File Upload: 5 requests per minute

## Webhooks

### Form Status Update
```http
POST {webhook_url}
Content-Type: application/json

{
  "event": "form.status_updated",
  "data": {
    "form_id": "uuid",
    "status": "string",
    "updated_at": "datetime"
  }
}
```

### AI Analysis Complete
```http
POST {webhook_url}
Content-Type: application/json

{
  "event": "ai.analysis_complete",
  "data": {
    "form_id": "uuid",
    "analysis_id": "uuid",
    "results": "object",
    "completion_time": "float"
  }
}
```

## Security Requirements

### Authentication
- JWT tokens required for all endpoints except login/register
- Token expiration: 1 hour
- Refresh token mechanism available
- Role-based access control

### Headers
- `Authorization: Bearer {token}`
- `Content-Type: application/json`
- `X-API-Key: {api_key}` (for webhooks)

### CORS
- Allowed origins: Configured per environment
- Methods: GET, POST, PUT, DELETE
- Headers: Authorization, Content-Type 