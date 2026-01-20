# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                 # Start Next.js dev server (http://localhost:3000)
pnpm build               # Build production bundle
pnpm start               # Start production server
pnpm analyze             # Analyze bundle size

# Code Quality
pnpm lint                # Run Oxlint (checks code)
pnpm fmt                 # Format code with Oxfmt

# Database
pnpm db:push             # Push schema changes to database (no migrations generated)
```

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 (App Router) with React Server Components
- **Database**: PostgreSQL with Drizzle ORM (snake_case conventions)
- **Auth**: Better Auth with email/password, Google, and GitHub OAuth
- **AI**: Vercel AI SDK
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Validation**: Zod for schemas
- **Code Quality**: Oxlint/Oxfmt for linting/formatting (120 char line width, no semicolons)

### Key Architectural Patterns

#### Data Access Layer (DAL)

All database operations go through the DAL (`src/dal/`):

- `src/dal/auth.ts`: Auth helpers (`getCurrentUser()`, `requireAuth()`)
- `src/dal/chat.ts`: Chat/message queries and mutations with ownership verification

**Important**: All DAL functions call `requireAuth()` to verify user ownership before any database operation.

#### Server Actions

Server actions (`src/actions/`) use `next-safe-action` for type-safe mutations:

- `actionClient`: Base client with error handling
- `authActionClient`: Extends base with automatic auth verification via middleware
- All actions are wrapped with custom error messages via `.metadata()`

#### Database Schema

Located in `src/db/schemas/`:

- `auth.ts`: Better Auth tables (user, session, account, verification)
- `chat.ts`: Chat and message tables with cascade deletes
- `relations.ts`: Drizzle relations for all tables

Database uses snake_case (configured in `drizzle.config.ts` and `src/db/index.ts`).

#### Chat Implementation

- **Route**: `/api/chat/route.ts` handles streaming AI responses
- **Flow**:
  1. Client sends message to API route
  2. API fetches existing messages from DB via `getMessages(chatId)`
  3. Streams response using Vercel AI SDK's `streamText()`
  4. Saves both user and assistant messages via `insertMessage()`
- **Storage**: Messages stored with role and parts (supports multimodal)

#### Authentication Flow

- Better Auth configured in `src/lib/auth/server.ts`
- Uses Drizzle adapter with PostgreSQL
- Session cache enabled (5 min max age)
- Auth pages in `src/app/(auth)/` route group
- Protected routes use `requireAuth()` or `authActionClient`

#### Route Groups

- `(auth)`: Login/signup pages (no auth layout)
- `(chat)`: Main chat interface with sidebar layout
  - `_components/`: Shared chat UI components
  - `_hooks/`: Chat-specific React hooks

### Environment Configuration

Uses `envin` for type-safe env vars (`env.config.ts`):

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`: Auth configuration
- OAuth credentials for Google and GitHub

### Path Aliases

- `@/*`: Maps to `src/*`
- `~/*`: Maps to project root

### Important Notes

- React Compiler is enabled in Next.js config - don't use useMemo/useCallback for memoization.
- Prefer regular function declarations over arrow functions (but use arrow functions for inline callbacks).
- Oxfmt excludes `src/components/ui` (shadcn components)
- pnpm workspace ignores `sharp` and `unrs-resolver` built deps
- Database uses `prepare: false` for transaction pool mode compatibility
