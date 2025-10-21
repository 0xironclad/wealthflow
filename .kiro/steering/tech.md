# Technology Stack

## Framework & Runtime
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.1** - UI library
- **TypeScript 5** - Type safety and development experience
- **Node.js** - Runtime environment

## Database & Backend
- **Supabase** - PostgreSQL database with authentication
- **PostgreSQL** - Primary database via `pg` and `postgres` packages
- **Zod** - Schema validation and type inference

## UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
-  **Shadcn UI** - Component library
- **Radix UI** - Headless component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Recharts** - Chart and data visualization
- **next-themes** - Theme management (dark mode default)

## State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form handling with validation
- **React Context** - User state management

## AI & External Services
- **Google Generative AI** - AI insights and recommendations
- **OpenAI** - Additional AI capabilities
- **Vercel Analytics** - Usage analytics

## Development Tools
- **ESLint** - Code linting with Next.js config
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler (development)

## Common Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Build and start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run check        # Run both lint and type-check
```

## Path Aliases
- `@/*` maps to `src/*` for clean imports

## Environment Requirements
- Node.js with npm/yarn/pnpm/bun support
- Supabase project with PostgreSQL database
- Environment variables for Supabase connection
