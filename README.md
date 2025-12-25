<div align="center">

# WealthFlow

### AI-Powered Financial Intelligence at Your Fingertips

_Smart financial management with AI insights and automated tracking_

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Documentation](#api-documentation)

---

![Wealthflow Dashboard](image.png)

</div>

## Overview

WealthFlow is a modern, AI-powered personal finance management platform that helps you track expenses, manage budgets, set savings goals, and gain intelligent insights into your financial health. Built with Next.js 15, TypeScript, and Google Gemini AI, it provides real-time financial analytics and personalized recommendations to help you make smarter money decisions.

## Features

### AI-Powered Capabilities

- **Personalized Financial Insights** - Get intelligent recommendations powered by Google Gemini AI
- **24/7 AI Chatbot Assistant** - Real-time financial guidance and answers to your queries
- **Smart Spending Analysis** - Automated categorization and pattern recognition

### Core Financial Tools

- **Transaction Tracking** - Comprehensive income and expense management with automatic categorization
- **Budget Planning** - Create, monitor, and manage budgets with intelligent spending insights
- **Savings Goals** - Set financial goals with progress tracking and target dates
- **Financial Analytics** - Interactive charts and visualizations using Recharts
- **Cash Flow Management** - Track monthly income, expenses, and net flow

### User Experience

- **Modern UI/UX** - Beautiful interface built with shadcn/ui and Tailwind CSS
- **Dark/Light Mode** - Full theme support with next-themes
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Command Menu** - Quick access to all features with keyboard shortcuts (Cmd+K)
- **Real-time Updates** - Live data synchronization with React Query

### Security & Authentication

- **Secure Authentication** - Powered by Supabase Auth with email verification
- **Password Encryption** - bcrypt hashing for secure credential storage
- **Protected Routes** - Middleware-based route protection
- **Session Management** - Secure session handling with Supabase SSR

## Tech Stack

### Core Framework

- **Framework**: Next.js 15.4.8 with App Router (Full-stack)
- **Language**: TypeScript 5
- **Runtime**: Next.js Server Components & API Routes

### Frontend

- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion
- **State Management**: React Context + TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React + Tabler Icons

### Backend & Database

- **Database**: PostgreSQL (Supabase)
- **Database Client**: pg (node-postgres)
- **Authentication**: Supabase Auth
- **AI Integration**: Google Generative AI (Gemini)
- **API**: Next.js API Routes & Server Actions

### DevOps & Tools

- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + TypeScript
- **Package Manager**: npm
- **Containerization**: Docker + Docker Compose
- **Analytics**: Vercel Analytics

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and profile information
- **expenses** - Transaction records (income/expense/saving)
- **incomes** - Detailed income tracking with categories
- **budgets** - Budget planning and monitoring
- **savings** - Savings goals with progress tracking
- **savings_history** - Deposit and withdrawal records

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14+ or Supabase account
- Google AI API key (for Gemini)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/0xironclad/wealthflow.git
   cd wealthflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your credentials:

   ```env
   # Database Configuration
   SUPABASE_DB_URL=postgresql://user:password@host:port/database

   # Supabase Authentication
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # AI Configuration
   GOOGLE_API_KEY=your_google_api_key

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Initialize the database**

   ```bash
   npm run db:create-tables
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup (Alternative)

Run the application using Docker Compose:

```bash
docker-compose up
```

The application will be available at `http://localhost:3000`

## Available Scripts

| Command                    | Description                             |
| -------------------------- | --------------------------------------- |
| `npm run dev`              | Start development server with Turbopack |
| `npm run build`            | Build for production                    |
| `npm start`                | Build and start production server       |
| `npm run lint`             | Run ESLint                              |
| `npm run type-check`       | Run TypeScript compiler check           |
| `npm run check`            | Run linting and type checking           |
| `npm run db:create-tables` | Initialize database tables              |
| `npm test`                 | Run tests in watch mode                 |
| `npm run test:ui`          | Run tests with UI                       |
| `npm run test:run`         | Run tests once                          |
| `npm run test:coverage`    | Generate test coverage report           |

## API Documentation

WealthFlow includes a comprehensive API with Swagger documentation. After starting the development server, visit:

```
http://localhost:3000/docs
```

### Main API Endpoints

- `/api/user` - User management and authentication
- `/api/expense` - Transaction operations
- `/api/income` - Income tracking
- `/api/savings` - Savings goal management
- `/api/budget` - Budget planning
- `/api/chat` - AI chatbot interactions
- `/api/ai` - AI insights generation
- `/api/balance` - Financial balance calculations

## Testing

The project uses Vitest for testing with comprehensive coverage:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

View coverage reports in the `coverage/` directory.

## Project Structure

```
wealthflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (authenticated)/   # Protected routes
│   │   ├── api/               # API routes
│   │   └── actions/           # Server actions
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   └── ...                # Feature components
│   ├── database/              # Database configuration
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── server/                # Server-side logic
│   └── context/               # React contexts
├── public/                    # Static assets
├── scripts/                   # Database scripts
└── tests/                     # Test files
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code:

- Passes all tests (`npm test`)
- Follows the existing code style
- Includes appropriate documentation
- Has no TypeScript errors (`npm run type-check`)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend as a Service
- [Google Gemini AI](https://ai.google.dev/) - AI capabilities
- [Vercel](https://vercel.com/) - Deployment platform

## Contact & Support

For questions, feedback, or support:

- Create an [Issue](https://github.com/0xironclad/wealthflow/issues)
- Submit a [Pull Request](https://github.com/0xironclad/wealthflow/pulls)

---

<div align="center">

**Built with Next.js and TypeScript**

Star this repository if you find it helpful!

</div>
