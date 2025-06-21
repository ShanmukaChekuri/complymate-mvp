# ComplyMate Backend

AI-powered OSHA compliance automation backend built with FastAPI.

## Quick Start

### Option 1: Use the comprehensive startup script (Recommended)

```bash
cd backend
python scripts/start_server.py
```

This script will:

- Check all dependencies
- Set up environment variables
- Download required models
- Start the development server

### Option 2: Manual setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up models (first time only)
python scripts/setup_models.py

# Start the server
python scripts/run_dev.py
```

## Development

### Prerequisites

- Python 3.8+
- pip
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up models:

```bash
python scripts/setup_models.py
```

### Running the Server

#### Development Mode

```bash
python scripts/run_dev.py
```

#### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### API Documentation

Once the server is running, visit:

- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc
- Health Check: http://localhost:8000/health

## Troubleshooting

### Common Issues

#### 1. KeyboardInterrupt/Asyncio Errors

If you encounter KeyboardInterrupt or asyncio errors when stopping the server:

- Use `Ctrl+C` to stop the server gracefully
- The server now has proper shutdown handlers
- If issues persist, try using the comprehensive startup script

#### 2. Model Loading Issues

If models fail to load:

- Run `python scripts/setup_models.py` to download required models
- Check your internet connection (models are downloaded from Hugging Face)
- Ensure you have sufficient disk space for model caching

#### 3. spaCy Model Not Found

If you get spaCy model errors:

```bash
python -m spacy download en_core_web_lg
```

#### 4. Memory Issues

The document intelligence models require significant memory:

- Ensure you have at least 4GB RAM available
- Consider using CPU-only mode (already configured)
- Models are loaded with timeout protection

### Environment Variables

The following environment variables are automatically set:

- `PYTHONUNBUFFERED=1`: Ensures proper logging
- `HF_HUB_DISABLE_SYMLINKS_WARNING=1`: Suppresses Hugging Face warnings
- `TRANSFORMERS_OFFLINE=0`: Allows online model downloads

## Project Structure

```
backend/
├── app/
│   ├── api/           # API routes and endpoints
│   ├── core/          # Core configuration and utilities
│   ├── db/            # Database models and session
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── services/      # Business logic services
│   └── main.py        # FastAPI application
├── scripts/           # Utility scripts
├── tests/             # Test files
├── uploads/           # File upload directory
└── requirements.txt   # Python dependencies
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token

### Files

- `POST /api/v1/files/upload` - Upload PDF files
- `GET /api/v1/files/` - List uploaded files
- `GET /api/v1/files/{file_id}` - Get file details

### Chat

- `POST /api/v1/chat/` - Send chat message
- `GET /api/v1/chat/history` - Get chat history

### Forms

- `GET /api/v1/forms/` - List available forms
- `POST /api/v1/forms/analyze` - Analyze form structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
