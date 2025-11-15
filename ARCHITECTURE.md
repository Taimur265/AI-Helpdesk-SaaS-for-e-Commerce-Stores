# AI Helpdesk SaaS - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Website    │  │   WhatsApp   │  │    Email     │      │
│  │   Widget     │  │   Business   │  │   Gateway    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway / Load Balancer                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Services                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js API Server (Node.js + TypeScript)        │  │
│  │  - Authentication & Authorization (JWT)              │  │
│  │  - REST API Endpoints                                │  │
│  │  - WebSocket for real-time chat                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI Service (Claude API Integration)                 │  │
│  │  - RAG (Retrieval Augmented Generation)              │  │
│  │  - Vector embeddings for FAQs                        │  │
│  │  - Context management                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Integration Services                                │  │
│  │  - Shopify API Client                                │  │
│  │  - WooCommerce API Client                            │  │
│  │  - WhatsApp Business API                             │  │
│  │  - Email Service (SendGrid/Mailgun)                  │  │
│  │  - Stripe Payment Integration                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │   Vector DB  │      │
│  │  (Primary)   │  │   (Cache)    │  │  (Pinecone)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand / Redux Toolkit
- **API Client**: Axios with React Query
- **Real-time**: Socket.io Client
- **Charts**: Recharts
- **UI Components**: Headless UI, Radix UI

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Job Queue**: Bull (Redis-based)
- **Logging**: Winston

### Database
- **Primary DB**: PostgreSQL 15
- **Cache**: Redis 7
- **Vector Store**: Pinecone (for RAG embeddings)

### AI & ML
- **LLM**: Anthropic Claude API
- **Embeddings**: Voyage AI / OpenAI Embeddings
- **RAG**: Custom implementation with vector search

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Deployment**: AWS / Vercel / Railway
- **CDN**: CloudFront / Vercel Edge
- **Monitoring**: Sentry, DataDog

## Core Modules

### 1. Authentication & Authorization
- User registration and login
- Store owner accounts
- Role-based access control (RBAC)
- API key management for integrations

### 2. Store Integration Module
- Shopify OAuth flow
- WooCommerce REST API integration
- Sync products, orders, customers
- Webhook handlers for real-time updates

### 3. AI Chatbot Engine
- Claude API integration
- RAG system for FAQ retrieval
- Context window management
- Response generation
- Auto-escalation to human agents

### 4. Knowledge Base Management
- FAQ creation and management
- Product information indexing
- Order policies and shipping info
- Vector embedding generation

### 5. Conversation Management
- Multi-channel message routing
- Conversation history storage
- Real-time chat interface
- Sentiment analysis

### 6. Analytics Dashboard
- Common questions report
- Response time metrics
- Customer satisfaction scores
- Volume trends
- AI vs human response ratio

### 7. Multi-Channel Integration
- Website chat widget (embed script)
- WhatsApp Business API
- Email parsing and response
- SMS (future)

### 8. Subscription & Billing
- Stripe integration
- Plan management ($19/$49/$99 tiers)
- Usage tracking
- Invoice generation

## Database Schema Overview

### Core Tables
- **users**: Store owners and team members
- **stores**: E-commerce store information
- **integrations**: API credentials and configs
- **conversations**: Chat sessions
- **messages**: Individual messages
- **knowledge_base**: FAQs and documents
- **embeddings**: Vector embeddings for RAG
- **analytics_events**: Raw analytics data
- **subscriptions**: Billing and plan info

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Stores
- `GET /api/stores`
- `POST /api/stores`
- `GET /api/stores/:id`
- `PUT /api/stores/:id`
- `DELETE /api/stores/:id`

### Integrations
- `POST /api/integrations/shopify/connect`
- `POST /api/integrations/woocommerce/connect`
- `POST /api/integrations/whatsapp/connect`
- `GET /api/integrations/:storeId`

### Chatbot
- `POST /api/chat/message`
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/:id`
- `WS /api/chat/live`

### Knowledge Base
- `GET /api/knowledge-base`
- `POST /api/knowledge-base`
- `PUT /api/knowledge-base/:id`
- `DELETE /api/knowledge-base/:id`

### Analytics
- `GET /api/analytics/overview`
- `GET /api/analytics/common-questions`
- `GET /api/analytics/response-times`
- `GET /api/analytics/satisfaction`

### Subscription
- `GET /api/subscription`
- `POST /api/subscription/checkout`
- `POST /api/subscription/upgrade`
- `POST /api/subscription/cancel`

## Security Considerations

1. **Authentication**: JWT tokens with refresh token rotation
2. **API Security**: Rate limiting, CORS, helmet middleware
3. **Data Encryption**: At-rest and in-transit
4. **PCI Compliance**: For payment data (via Stripe)
5. **API Keys**: Encrypted storage of third-party credentials
6. **Input Validation**: Zod schemas for all inputs
7. **SQL Injection**: Parameterized queries via Prisma

## Deployment Strategy

### Development
- Docker Compose for local development
- Hot reload for frontend and backend
- Separate DB containers

### Staging
- Automated deployment on push to `develop` branch
- Feature flags for testing

### Production
- Blue-green deployment
- Auto-scaling based on load
- CDN for static assets
- Database backups (daily)
- Monitoring and alerting

## Future Enhancements

1. **Multi-language Support**: i18n for global stores
2. **Voice Integration**: Phone call support
3. **Advanced Analytics**: ML-powered insights
4. **Custom AI Training**: Fine-tune models per store
5. **Mobile Apps**: iOS and Android native apps
6. **API for Third-party Devs**: Public API for extensions
