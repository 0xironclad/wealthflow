# WealthFlow - AI-Powered Financial Management Platform

![WealthFlow Banner](next-client/src/assets/wealthflow.png)

<p align="center">
  <strong>A sophisticated financial management platform leveraging AI to provide personalized financial insights and automated wealth optimization strategies.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 🌟 Features

### 🤖 AI-Powered Financial Assistant

- **Gemini 2.0 Flash Integration**: Advanced conversational AI with context-aware financial guidance
- **Intelligent Expense Analysis**: Real-time spending pattern recognition and optimization suggestions
- **Personalized Investment Recommendations**: AI-driven portfolio optimization based on user financial profile
- **Predictive Financial Modeling**: Future cash flow predictions and scenario planning

### 📊 Comprehensive Financial Dashboard

- **Real-time Analytics**: Interactive visualizations using Recharts abd ShadCN charts
- **Multi-category Expense Tracking**: 9 expense categories with intelligent categorization
- **Advanced Budget Management**: Dynamic budget allocation with rollover capabilities
- **Savings Goal Automation**: Smart savings tracking with progress monitoring

### 🔐 Enterprise-Grade Security

- **Supabase Authentication**: OAuth 2.0 with JWT token management
- **BCrypt Password Hashing**: Industry-standard password security
- **Row-level Security**: Database-level access control
- **API Rate Limiting**: Protection against abuse and DDoS attacks

### 💰 Smart Financial Features

- **Recurring Income Tracking**: Automated salary and freelance income management
- **Goal-based Savings**: Target-driven savings with deadline tracking
- **Transaction History**: Comprehensive audit trail with search capabilities
- **Expense Categorization**: AI-assisted transaction categorization

---

## ��️ Architecture

### System Overview

WealthFlow follows a modern microservices-inspired architecture with a clear separation of concerns between the frontend and backend services. The system is designed for scalability, maintainability, and real-time performance.

### Frontend Architecture (Next.js 15.1.6)

- **App Router Architecture**

  - Route groups for authenticated and public routes
  - Server components for improved performance
  - Client components for interactive features
  - Layout system for consistent UI patterns

- **State Management**

  - React Context for global state
  - TanStack Query for server state
  - Local state with React hooks
  - Optimistic updates for better UX

- **Component Architecture**

  - Atomic design pattern
  - Reusable UI components with Shadcn/ui
  - Custom hooks for business logic
  - Higher-order components for cross-cutting concerns

- **Performance Optimizations**
  - Server-side rendering for critical pages
  - Static site generation for marketing pages
  - Image optimization with Next.js
  - Code splitting and lazy loading

### Backend Architecture

- **API Layer**

  - RESTful API design
  - Next.js API routes for frontend integration
  - Express.js server for standalone services
  - Rate limiting and request validation

- **Service Layer**

  - Business logic separation
  - Dependency injection pattern
  - Service-oriented architecture
  - Event-driven communication

- **Data Layer**
  - PostgreSQL for primary data storage
  - Supabase for real-time features
  - Database migrations and versioning
  - Connection pooling and query optimization

### AI Integration Architecture

- **Gemini AI Service**

  - Asynchronous processing
  - Context management
  - Response caching
  - Error handling and fallbacks

- **Financial Analysis Pipeline**
  - Data preprocessing
  - Feature extraction
  - Model inference
  - Result aggregation

### Security Architecture

- **Authentication Flow**

  - JWT-based authentication
  - Refresh token rotation
  - Session management
  - OAuth 2.0 integration

- **Authorization System**
  - Role-based access control
  - Resource-level permissions
  - API key management
  - Rate limiting strategies

### Real-time Features

- **WebSocket Integration**

  - Real-time updates
  - Bi-directional communication
  - Connection management
  - Event broadcasting

- **State Synchronization**
  - Optimistic updates
  - Conflict resolution
  - Event sourcing
  - CQRS pattern

### Deployment Architecture

- **Infrastructure**

  - Vercel for frontend hosting
  - Docker containerization
  - CI/CD pipeline
  - Environment management

- **Monitoring & Logging**
  - Error tracking
  - Performance monitoring
  - User analytics
  - System health checks

### Data Flow Architecture

1. **Client Request Flow**

   - Request validation
   - Authentication check
   - Rate limiting
   - Response caching

2. **AI Processing Flow**

   - Input sanitization
   - Context building
   - Model inference
   - Response formatting

3. **Financial Data Flow**
   - Data validation
   - Transaction processing
   - Real-time updates
   - Analytics computation

### Scalability Considerations

- **Horizontal Scaling**

  - Stateless services
  - Load balancing
  - Database sharding
  - Cache distribution

- **Performance Optimization**
  - Database indexing
  - Query optimization
  - Response compression
  - Asset optimization

This architecture ensures:

- High availability and reliability
- Scalable and maintainable codebase
- Secure and performant operations
- Real-time capabilities
- Easy integration of new features

---

## 🛠️ Technology Stack

### Frontend Technologies

- **Next.js 15.1.6** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **Recharts** - Data visualization
- **React Hook Form** - Form management with Zod validation
- **TanStack Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend & Database

- **Node.js & Express** - Server runtime and framework
- **PostgreSQL** - Primary database with advanced indexing
- **Supabase** - Backend-as-a-Service with real-time features
- **TypeScript** - Full-stack type safety

### AI & External Services

- **Google Gemini 2.0 Flash** - Advanced AI conversational model
- **Custom Financial Prompts** - Domain-specific AI training
- **OpenAI Integration** - Backup AI service

### Development & Deployment

- **ESLint & TypeScript** - Code quality and type checking
- **Bun** - Fast package manager and runtime
- **Git & GitHub** - Version control and collaboration

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
PostgreSQL 14+
Google Cloud Account (Gemini API)
Supabase Account
```

### 1. Clone & Setup

```bash
git clone https://github.com/CollinsKipkemoi/WealthFlow.git
cd WealthFlow
```

### 2. Database Setup

```bash
# Navigate to database directory
cd next-client/src/database

# Execute schema creation
psql -U your_username -d your_database -f queries.sql
```

### 3. Environment Configuration

**Frontend (.env.local):**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wealthflow
```

**Backend (.env):**

```bash
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/wealthflow
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Installation & Launch

**Frontend:**

```bash
cd next-client
npm install
npm run dev  # Development server on :3000
```

**Backend:**

```bash
cd server
npm install
npm run dev  # API server on :5000
```

---

## 📚 API Documentation

### Core Endpoints

#### Authentication

```typescript
POST /api/auth/login     # User authentication
POST /api/auth/register  # User registration
POST /api/auth/logout    # Session termination
```

#### Financial Data

```typescript
GET    /api/expense      # Retrieve user expenses
POST   /api/expense      # Create new expense
PUT    /api/expense/:id  # Update expense
DELETE /api/expense/:id  # Delete expense

GET    /api/income       # Income management
POST   /api/income       # Add income source
GET    /api/budget       # Budget operations
POST   /api/savings      # Savings tracking
```

#### AI Services

```typescript
POST /api/chat           # Gemini AI conversation
POST /api/ai/analyze     # Financial analysis
GET  /api/ai/insights    # Personalized insights
```

## 🎯 Key Features Implementation

### AI Chat Integration

```typescript
// Advanced Gemini 2.0 Flash implementation
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const chat = model.startChat({
  history: formattedMessages,
  systemInstruction: ChaBotPrompt(userData),
  generationConfig: { maxOutputTokens: 1000 },
});
```

### Real-time Financial Analytics

- Dynamic expense categorization with AI assistance
- Intelligent budget recommendations based on spending patterns
- Predictive savings goal achievement timeline
- Automated financial health scoring

### Advanced Security Implementation

- JWT-based authentication with refresh tokens
- Row-level security policies in PostgreSQL
- API route protection with middleware
- Secure environment variable management

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
cd next-client
npm run build
vercel --prod
```

### Docker Deployment

```dockerfile
# Multi-stage build for optimized production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Performance & Scalability

- **Database Indexing**: Optimized queries with strategic indexes
- **Caching Strategy**: React Query for client-side caching
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Optimization**: Tree shaking and code splitting
- **API Rate Limiting**: Protection against abuse

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Collins Kipkemoi** - _IronClad Dev_

- 🌐 Portfolio: [ironclad.dev](https://ironclad-dev.netlify.app/)
- 💼 LinkedIn: [Collins Kipkemoi](https://www.linkedin.com/in/kipkemoi-c1/)
- 📧 Email: chemerilcollins@gmail.com
- 🐱 GitHub: [@CollinsKipkemoi](https://github.com/CollinsKipkemoi)

---

<div align="center">
  <p><strong>Built with precision and passion by IronClad Dev</strong></p>
  <p>🚀 Transforming financial management through intelligent automation</p>

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-orange?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

</div>
