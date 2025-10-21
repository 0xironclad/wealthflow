# Project Structure

## Root Configuration
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration with Turbopack aliases
- `tailwind.config.ts` - Tailwind CSS with custom theme and shadcn/ui integration
- `tsconfig.json` - TypeScript configuration with `@/*` path mapping
- `components.json` - shadcn/ui component configuration

## Source Organization (`src/`)

### App Router (`src/app/`)
- **Route Groups**: `(auth)` for login/signup, `(authenticated)` for dashboard pages
- **API Routes**: RESTful endpoints in `api/` with standard HTTP methods
- **Page Structure**: Each route has `page.tsx` and optional `layout.tsx`
- **Actions**: Server actions in `actions/` directory

### Components (`src/components/`)
- **UI Components**: Base components in `ui/` following shadcn/ui patterns
- **Feature Components**: Organized by domain (budget, savings, income)
- **Layout Components**: Navigation, sidebars, headers
- **Empty States**: Dedicated components for no-data scenarios

### Database (`src/database/`)
- `supabase-connect.ts` - Database client configuration
- `db.ts` - Connection pool setup
- `queries.sql` - Raw SQL queries for reference

### Library (`src/lib/`)
- **Schemas**: Zod validation schemas by feature (`schemas/`)
- **Types**: TypeScript type definitions
- **Utils**: Utility functions (cn for className merging)
- **Prompts**: AI prompt templates

### Server Logic (`src/server/`)
- Feature-specific server functions (budget.ts, expense.ts, etc.)
- Database query abstractions
- Business logic separated from API routes

### Utilities (`src/utils/`)
- **Supabase**: Client, server, and middleware utilities
- Framework-specific helper functions

## Naming Conventions
- **Files**: kebab-case for components, camelCase for utilities
- **Components**: PascalCase with descriptive names
- **API Routes**: RESTful naming with `route.ts` files
- **Types**: Descriptive interfaces with `Type` suffix where appropriate

## Architecture Patterns
- **Separation of Concerns**: API routes handle HTTP, server functions handle business logic
- **Schema Validation**: Zod schemas for all data validation
- **Type Safety**: Comprehensive TypeScript coverage
- **Component Composition**: Radix UI primitives with custom styling
- **Server/Client Separation**: Clear boundaries between server and client code
