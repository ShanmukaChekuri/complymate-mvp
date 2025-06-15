# ComplyMate Backend

This is the backend service for ComplyMate, an AI-powered OSHA compliance automation platform.

## Quick Start

The easiest way to get started is to use the development script:

```bash
# Create and activate virtual environment
python scripts/dev.py setup
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
source venv/bin/activate

# Install dependencies
python scripts/dev.py install

# Initialize database
python scripts/dev.py init-db

# Run migrations
python scripts/dev.py migrate

# Run tests
python scripts/dev.py test

# Start development server
python scripts/dev.py run
```

## Manual Setup

If you prefer to run commands manually:

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PROJECT_NAME=ComplyMate
VERSION=0.1.0
API_V1_STR=/api/v1

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000"]

# Database Configuration
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=complymate

# JWT Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Service Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-3-opus-20240229

# File Storage Configuration
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760
```

4. Initialize the database:
```bash
python scripts/init_db.py
```

5. Run migrations:
```bash
alembic upgrade head
```

6. Start the development server:
```bash
python scripts/run_dev.py
```

The server will be available at `http://localhost:8000`

## Testing

1. Run all tests:
```bash
python scripts/run_tests.py
```

2. Run specific test types:
```bash
# Run pytest only
pytest tests/ -v

# Run API tests only
python scripts/test_api.py
```

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/api/v1/docs`
- ReDoc: `http://localhost:8000/api/v1/redoc`

## Project Structure

```
backend/
├── alembic/              # Database migrations
├── app/
│   ├── api/             # API endpoints
│   ├── core/            # Core functionality
│   ├── db/              # Database
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   └── utils/           # Utility functions
├── scripts/             # Utility scripts
├── tests/               # Test files
└── requirements.txt     # Dependencies
```

## Development

1. Create new migrations:
```bash
alembic revision --autogenerate -m "description"
```

2. Apply migrations:
```bash
alembic upgrade head
```

3. Rollback migrations:
```bash
alembic downgrade -1
```

## Logging

Logs are stored in the `logs` directory:
- `app.log`: Application logs
- `access.log`: Access logs
- `error.log`: Error logs

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License. 