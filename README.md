# BPO Gig Platform

A comprehensive Business Process Outsourcing (BPO) platform that manages the complete lifecycle: candidate onboarding, testing, training, gig management, work execution, quality assurance, and payments.

## 🚀 Features

### Candidate Funnel
- **Onboarding**: Multi-step registration with document upload
- **Testing**: Versant language proficiency integration
- **Training**: LMS with courses, quizzes, and certifications
- **Qualification**: Automated eligibility engine

### Work Funnel
- **Gig Discovery**: Skill-matched job opportunities
- **Briefing**: Knowmax integration for process documentation
- **Work Environment**: Chat workbench with decision tree support
- **Monitoring**: Warden compliance tracking

### Post-Work Systems
- **QA Management**: Scorecard-based quality reviews
- **Analytics**: Real-time metrics and reporting
- **Payments**: Wallet, earnings tracking, and automated payouts
- **Retraining**: Performance-based learning recommendations

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **Forms**: React Hook Form + Zod
- **Routing**: React Router

### Backend
- **Framework**: NestJS (modular monolith)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Bull/BullMQ
- **Auth**: Keycloak SSO + JWT

### Infrastructure
- **Containers**: Docker + Docker Compose
- **Storage**: MinIO (S3-compatible)
- **Orchestration**: Kubernetes (production)

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone repository
git clone <your-repo-url>
cd gigProject

# Copy environment file
cp .env.example backend/.env
```

### 2. Start Infrastructure with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, Keycloak, MinIO, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Keycloak** on port 8080
- **MinIO** on ports 9000 (API) and 9001 (Console)
- **Backend API** on port 3000
- **Frontend** on port 5173

### 3. Local Development Setup (without Docker)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will be available at `http://localhost:3000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
gigProject/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication & authorization
│   │   │   ├── candidates/     # Candidate management
│   │   │   ├── lms/            # Learning management
│   │   │   ├── gigs/           # Gig management
│   │   │   ├── chat/           # Work sessions & chat
│   │   │   ├── qms/            # Quality management
│   │   │   ├── wallet/         # Payments & wallet
│   │   │   └── analytics/      # Analytics & reporting
│   │   ├── common/             # Shared utilities
│   │   └── main.ts             # Entry point
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── pages/              # Route pages
│   │   ├── components/         # Reusable components
│   │   ├── store/              # Redux store
│   │   ├── api/                # API client
│   │   └── main.tsx            # Entry point
│   └── package.json
│
├── docker-compose.yml          # Local development environment
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Database
DATABASE_URL=postgresql://bpo_user:bpo_password@localhost:5432/bpo_platform

# Redis
REDIS_URL=redis://localhost:6379

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=bpo-platform
KEYCLOAK_CLIENT_ID=bpo-backend

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h

# External Integrations
VERSANT_API_URL=https://api.versant.example.com
KNOWMAX_API_URL=https://api.knowmax.example.com
```

## 🗄️ Database

### Migrations

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

### Prisma Studio

Explore your database with Prisma Studio:

```bash
npx prisma studio
```

Access at `http://localhost:5555`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test

# Test coverage
npm run test:coverage
```

## 🚢 Deployment

### Production Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Modules Overview

### 1. Authentication & Users
- Keycloak SSO integration
- JWT-based authentication
- Role-based access control (RBAC)

### 2. Candidate Onboarding
- Multi-step registration wizard
- Document upload & verification
- Profile management

### 3. Versant Integration
- Language proficiency testing
- Score tracking
- Eligibility determination

### 4. LMS (Learning Management)
- Course catalog
- Video/content delivery
- Quiz engine
- Progress tracking
- Certification

### 5. Gig Management
- Job posting and discovery
- Eligibility matching
- Application workflow
- Capacity planning

### 6. Knowmax Integration
- Process briefings
- Decision tree navigation
- Knowledge base access

### 7. Work Execution
- Chat workbench
- Session tracking
- Real-time monitoring
- Productivity metrics

### 8. Warden Compliance
- Browser extension integration
- Policy violation detection
- Auto-alerts and actions

### 9. Quality Management (QMS)
- Session review assignment
- Scorecard templates
- Feedback management
- Performance tracking

### 10. Wallet & Payments
- Earnings calculation
- Wallet management
- Payout processing
- Transaction history

### 11. Analytics & Reporting
- Real-time dashboards
- KPI tracking
- Capacity utilization
- Quality metrics

### 12. Notifications
- Email (SendGrid)
- SMS/WhatsApp (Twilio)
- In-app notifications

## 🔐 Security

- JWT authentication with refresh tokens
- Role-based access control
- Secure password hashing (bcrypt)
- Input validation with class-validator
- SQL injection prevention via Prisma
- XSS protection
- CORS configuration
- Rate limiting

## 📚 API Documentation

Once the backend is running, access API documentation at:
- Swagger UI: `http://localhost:3000/api`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📝 License

[Your License Here]

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [your-contact@example.com]

## 🗺️ Roadmap

- [ ] Phase 1: Foundation & Auth ✅
- [ ] Phase 2: Candidate Funnel
- [ ] Phase 3: Work Execution
- [ ] Phase 4: QA & Analytics
- [ ] Phase 5: Advanced Features
- [ ] Phase 6: Mobile Apps

---

Built with ❤️ for streamlined BPO operations
