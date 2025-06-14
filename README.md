# ComplyMate

AI-powered OSHA compliance automation platform that helps businesses streamline their safety compliance processes.

## 🚀 Features

- AI-powered OSHA form automation
- Real-time compliance monitoring
- Automated safety documentation
- Customizable compliance workflows
- Integration with existing safety systems

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL
- **AI**: OpenRouter AI
- **Deployment**: DigitalOcean
- **CI/CD**: GitHub Actions

## 🏗 Project Structure

```
complymate-mvp/
├── frontend/           # React frontend application
├── backend/           # FastAPI backend application
├── docs/             # Project documentation
├── tests/            # Test suites
└── docker/           # Docker configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x
- Python 3.11
- PostgreSQL 14+
- Docker (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/complymate-mvp.git
   cd complymate-mvp
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

## 📦 Deployment

The application is automatically deployed to DigitalOcean when changes are pushed to the main branch.

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