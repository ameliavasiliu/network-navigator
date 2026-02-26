# Overview

OpenDoorAI is a career preparation platform designed for international MBA students. It provides three core tools:

1. **Dashboard** — A home screen with KPI cards (mock interviews, active streak), document upload surfaces (resume/cover letter), and quick access to recent roadmaps.
2. **Network Navigator** — A 4-tab interconnected coaching system:
   - **Tasks Tab** — Active task cards (daily/weekly), full task list with subtask tracking, completion gates, AI templates, and coach check-in system
   - **Roadmap Tab** — Strategic read-only view with visual journey timeline, estimated time to hire, task previews, and "Change in Circumstances" input
   - **Contacts Tab** — Full relationship tracker with search, filters (status/affiliation), follow-up suggestions, and extended fields (affiliation, school, email, phone)
   - **Companies Tab** — Recommended companies with star/save, saved companies with status tracking (considering/applied/interviewing/rejected/offer), manual add, and refresh countdown
3. **Mock Interview Tool** — A placeholder/MVP screen for future interview practice functionality.

The app targets international students navigating US business culture and job searches, with embedded cultural etiquette tips and actionable networking tasks.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6 using `HashRouter` with a persistent `AppShell` layout (sidebar + main content area)
- **State Management**: 
  - `RoadmapContext` (React Context) manages roadmap creation wizard state and roadmap data client-side
  - `@tanstack/react-query` for server state and API calls
- **Styling**: Tailwind CSS with a custom theme (teal/green palette, `#65D6A8` primary). Uses `shadcn/ui` component library (new-york style) with Radix UI primitives
- **Build Tool**: Vite with React plugin, Tailwind CSS v4 plugin (`@tailwindcss/vite`)
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

## Backend

- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Key Endpoints**:
  - `POST/GET /api/roadmaps` — Create and list roadmaps
  - `GET /api/roadmaps/:id` — Get single roadmap
  - `POST /api/tasks`, `GET /api/tasks?roadmapId=`, `PATCH /api/tasks/:id` — Task CRUD
  - `POST /api/progress-updates` — Log progress updates
- **Dev/Prod Split**: In development, Vite dev server middleware is used. In production, static files are served from `dist/public`

## Database

- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema** (in `shared/schema.ts`):
  - `users` — Basic auth table (id, username, password)
  - `roadmaps` — Career roadmaps with goal, school info, international status, degree, experience
  - `tasks` — Individual roadmap tasks with order, title, description, status tracking
  - `progressUpdates` — Activity log entries per roadmap
- **Migrations**: Drizzle Kit with `db:push` command for schema sync
- **Connection**: `pg` Pool via `connect-pg-simple`

## Build & Deploy

- **Dev**: `tsx server/index.ts` runs the Express server which sets up Vite middleware for HMR
- **Build**: Custom `script/build.ts` uses Vite for client bundle and esbuild for server bundle into `dist/`
- **Production**: `node dist/index.cjs` serves the built app

## Project Structure

```
client/              # Frontend React app
  src/
    components/      # Reusable components (app-shell, feature-card, kpi-card, etc.)
    components/ui/   # shadcn/ui component library
    context/         # React Context providers (roadmap-context)
    hooks/           # Custom hooks (use-mobile, use-toast)
    lib/             # Utilities (queryClient, utils)
    pages/           # Page components (dashboard, mock-interview, network-navigator)
server/              # Backend Express server
  index.ts           # Server entry point
  routes.ts          # API route definitions
  storage.ts         # Database access layer (Drizzle)
  static.ts          # Static file serving (production)
  vite.ts            # Vite dev middleware setup
shared/              # Shared between client and server
  schema.ts          # Drizzle schema + Zod validators
migrations/          # Drizzle migration files
```

# External Dependencies

- **Database**: PostgreSQL — required, connection via `DATABASE_URL` environment variable
- **UI Components**: shadcn/ui with Radix UI primitives (extensive set: dialog, select, tabs, accordion, toast, etc.)
- **Fonts**: Google Fonts (Inter) loaded via CDN
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev only)
- **Key Libraries**: 
  - `drizzle-orm` + `drizzle-zod` for database ORM and validation
  - `@tanstack/react-query` for async state management
  - `react-router-dom` for client-side routing
  - `zod` + `zod-validation-error` for schema validation
  - `date-fns` for date formatting
  - `recharts` for charts (via chart.tsx component)
  - `embla-carousel-react` for carousel functionality
  - `react-day-picker` for calendar component