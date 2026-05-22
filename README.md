# Lolo Boyong's Kantina — Frontend

Next.js 15 (App Router) + TypeScript + Zustand frontend for the Lolo Boyong's Kantina restaurant POS / ordering system.

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 15, React 19 |
| Language | TypeScript |
| State | Zustand + Immer |
| Forms | react-hook-form + Zod |
| UI Components | Radix UI + shadcn/ui |
| HTTP | Native `fetch` via `lib/api.ts` |
| Auth | JWT via Bearer token stored in cookies |
| AI Chatbot | OpenAI SDK (server route only) |

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- The `resto-api` backend running on `http://localhost:8000`

## Local Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set NEXT_PUBLIC_API_URL to your backend URL

# 3. Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_ENV` | `dev` or `prod` — controls cookie security flags |
| `NEXT_PUBLIC_APP_URL` | Base URL of the backend (e.g. `http://localhost:8000`) |
| `NEXT_PUBLIC_API_URL` | Full API base URL (e.g. `http://localhost:8000/api/v1`) |
| `OPENAI_API_KEY` | OpenAI key for the server-side chatbot route |

## User Roles & Routes

| Role | Accessible Routes |
|---|---|
| `admin` | All routes including `/admin/*` |
| `rider` | `/rider` only |
| `user` | `/`, `/menu`, `/checkout`, `/orders`, `/reservations` |
| Unauthenticated | `/`, `/menu`, `/login`, `/register`, `/verify-email` |

## Production Deployment

1. Set `NEXT_PUBLIC_APP_ENV=prod` so auth cookies use `Secure; SameSite=None`.
2. Set `NEXT_PUBLIC_API_URL` to your production API URL.
3. Ensure your backend `FRONTEND_URL` matches the deployed frontend origin.
4. Run `pnpm build && pnpm start` or deploy to Vercel.

## Project Structure

```
app/            # Next.js App Router pages
  (client)/     # Client-facing pages (menu, checkout, orders, reservations)
  admin/        # Admin dashboard pages
  rider/        # Rider delivery pages
  api/chatbot/  # Server-side AI chatbot route
components/     # Shared UI components
config/         # App configuration (API URL, etc.)
hooks/          # Data-fetching and business logic hooks
  admin/        # Admin-specific hooks
  auth/         # Login, logout, register
  client/       # Client-facing hooks
  rider/        # Rider hooks
  global/       # Shared hooks (file upload, etc.)
lib/            # Utilities: API client, Zustand store, helpers
```
