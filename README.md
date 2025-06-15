# ComplyMate

AI-powered OSHA compliance automation platform that helps businesses streamline their safety compliance processes.

## 🚀 Features

- AI-powered OSHA form automation
- Real-time compliance monitoring
- Automated safety documentation
- Customizable compliance workflows
- Integration with existing safety systems

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for state management
- Headless UI for components

### Backend
- FastAPI (Python 3.11)
- SQLAlchemy ORM
- PostgreSQL database
- Redis for caching
- JWT authentication

### AI Integration
- OpenRouter API
- GPT-4 for form analysis
- Redis for response caching

### Infrastructure
- Docker for containerization
- GitHub Actions for CI/CD
- DigitalOcean for hosting
- PostgreSQL for production
- Redis for caching

## 🏗 Project Structure

```
complymate-mvp/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── tests/         # Frontend tests
├── backend/           # FastAPI backend application
│   ├── app/          # Application code
│   ├── tests/        # Backend tests
│   └── alembic/      # Database migrations
├── docs/             # Project documentation
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACTS.md
│   ├── DATABASE_SCHEMA.md
│   └── DEVELOPMENT_LOG.md
└── docker/           # Docker configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x
- Python 3.11
- Docker and Docker Compose
- PostgreSQL 14+ (for production)
- Redis (for production)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/complymate-mvp.git
   cd complymate-mvp
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development environment:
   ```bash
   docker-compose up --build
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

## 📦 Deployment

The application is automatically deployed to DigitalOcean when changes are pushed to the main branch.

### Production Environment
- DigitalOcean App Platform
- PostgreSQL managed database
- Redis managed database
- Custom domain with SSL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔐 Security

Please report any security issues to security@complymate.com

## 📞 Support

For support, email support@complymate.com or join our Slack channel.

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Contracts](docs/API_CONTRACTS.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Development Log](docs/DEVELOPMENT_LOG.md) 