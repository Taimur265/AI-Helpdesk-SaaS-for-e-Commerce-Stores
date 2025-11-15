# AI Helpdesk SaaS for E-commerce Stores

An AI-powered customer support platform built specifically for Shopify and WooCommerce stores. Automate repetitive customer queries, provide instant support 24/7, and scale your customer service effortlessly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20+-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)

## Features

### AI-Powered Support
- **Intelligent Chatbot**: Claude AI-powered chatbot that understands context and provides accurate responses
- **RAG System**: Retrieval Augmented Generation for accurate answers based on your knowledge base
- **Auto-escalation**: Automatically escalates complex queries to human agents
- **Sentiment Analysis**: Detects customer sentiment and prioritizes urgent issues

### Multi-Channel Support
- Website chat widget (embeddable)
- WhatsApp Business integration
- Email support
- SMS support (coming soon)

### E-commerce Integrations
- **Shopify**: Full OAuth integration with order and product sync
- **WooCommerce**: REST API integration for order management
- Order status lookups
- Automated return/refund responses

### Analytics & Insights
- Real-time conversation metrics
- Response time tracking
- Common questions analysis
- Customer satisfaction scores
- AI vs human response ratio

### Subscription Management
- **Basic Plan**: $19/mo - Perfect for small stores (up to 1K orders/month)
- **Pro Plan**: $49/mo - Multi-channel support (up to 5K orders/month)
- **Enterprise Plan**: $99/mo - For high-volume stores (10K+ orders/month)

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Prisma
- **AI**: Anthropic Claude API
- **Real-time**: Socket.io
- **Payments**: Stripe

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **API Client**: Axios with React Query
- **Build Tool**: Vite
- **UI Components**: Headless UI, Heroicons

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: AWS / Vercel / Railway
- **CI/CD**: GitHub Actions (coming soon)

## Project Structure

```
ai-helpdesk-saas/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, error handling, etc.
│   │   ├── routes/         # API routes
│   │   ├── config/         # Database, config files
│   │   ├── utils/          # Helper functions
│   │   └── types/          # TypeScript types
│   └── prisma/             # Database schema & migrations
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
├── shared/                 # Shared types & utilities
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)
- Redis 7 (or use Docker)

### Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_helpdesk"
REDIS_URL="redis://localhost:6379"

# API Keys
ANTHROPIC_API_KEY="your_claude_api_key"
SHOPIFY_API_KEY="your_shopify_api_key"
SHOPIFY_API_SECRET="your_shopify_api_secret"
STRIPE_SECRET_KEY="your_stripe_secret_key"

# JWT
JWT_SECRET="your_super_secret_jwt_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"

# Application
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Installation

#### Option 1: Docker (Recommended)

1. Start all services:

```bash
docker-compose up -d
```

2. Run database migrations:

```bash
npm run prisma:migrate
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

#### Option 2: Local Development

1. Install dependencies:

```bash
npm install
```

2. Install workspace dependencies:

```bash
npm install --workspaces
```

3. Start PostgreSQL and Redis (or use Docker):

```bash
docker-compose up -d postgres redis
```

4. Run database migrations:

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

5. Start development servers:

```bash
# From root directory
npm run dev
```

This will start both frontend (port 3000) and backend (port 3001).

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register      - Register new user
POST /api/auth/login         - Login user
POST /api/auth/refresh       - Refresh access token
POST /api/auth/logout        - Logout user
GET  /api/auth/me            - Get current user
```

### Store Management

```
GET    /api/stores           - Get all stores
POST   /api/stores           - Create new store
GET    /api/stores/:id       - Get store by ID
PUT    /api/stores/:id       - Update store
DELETE /api/stores/:id       - Delete store
```

### Chat & Conversations

```
POST /api/chat/message                  - Send message
GET  /api/chat/conversations            - Get all conversations
GET  /api/chat/conversations/:id        - Get conversation by ID
POST /api/chat/conversations/:id/close  - Close conversation
POST /api/chat/conversations/:id/assign - Assign to agent
```

### Knowledge Base

```
GET    /api/knowledge-base     - Get all KB entries
POST   /api/knowledge-base     - Create KB entry
GET    /api/knowledge-base/:id - Get KB entry
PUT    /api/knowledge-base/:id - Update KB entry
DELETE /api/knowledge-base/:id - Delete KB entry
```

### Analytics

```
GET /api/analytics/overview         - Get overview stats
GET /api/analytics/common-questions - Get common questions
GET /api/analytics/response-times   - Get response times
GET /api/analytics/satisfaction     - Get satisfaction scores
```

### Integrations

```
GET    /api/integrations/:storeId           - Get all integrations
POST   /api/integrations/shopify/connect    - Connect Shopify
POST   /api/integrations/woocommerce/connect - Connect WooCommerce
POST   /api/integrations/whatsapp/connect   - Connect WhatsApp
DELETE /api/integrations/:id                - Delete integration
```

### Subscription

```
GET  /api/subscription            - Get subscription
POST /api/subscription/checkout   - Create checkout session
POST /api/subscription/upgrade    - Upgrade plan
POST /api/subscription/cancel     - Cancel subscription
POST /api/subscription/webhook    - Stripe webhook
```

## Database Schema

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed database schema and system architecture.

## Key Features Implementation

### AI Chatbot with RAG

The AI service (`backend/src/services/ai.service.ts`) implements:
- Context building from knowledge base
- Conversation history management
- Claude API integration
- Sentiment analysis
- Auto-escalation logic

### Real-time Chat

WebSocket implementation using Socket.io:
- Real-time message delivery
- Typing indicators support
- Presence detection
- Room-based messaging

### Multi-channel Support

Integration services for:
- Shopify OAuth flow
- WooCommerce REST API
- WhatsApp Business API
- Email parsing (SendGrid)

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Deployment

### Production Build

```bash
# Build all packages
npm run build

# Build backend only
npm run build:backend

# Build frontend only
npm run build:frontend
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Roadmap

- [ ] Voice call integration
- [ ] Mobile apps (iOS & Android)
- [ ] Advanced AI training per store
- [ ] Multi-language support (i18n)
- [ ] Custom branding
- [ ] API for third-party developers
- [ ] Zapier integration
- [ ] More e-commerce platforms (BigCommerce, Magento)

## Contributing

We welcome contributions! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Support

- Documentation: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Issues: GitHub Issues

## Acknowledgments

- [Anthropic Claude](https://www.anthropic.com/) - AI language model
- [Shopify API](https://shopify.dev/) - E-commerce platform integration
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - UI styling

---

Built with ❤️ for e-commerce businesses