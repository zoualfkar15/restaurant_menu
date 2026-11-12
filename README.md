# MenuQR — SaaS Platform for QR Digital Menus

Multi-tenant SaaS for restaurants, cafés, and cafeterias: QR-based digital menus, restaurant landing pages, and admin dashboards.

## Repository structure

- **`/backend`** — NestJS (TypeScript), PostgreSQL, Prisma, JWT, multi-tenant REST API
- **`/frontend`** — Next.js 14 (App Router), TailwindCSS, mobile-first
- **`/docs`** — Architecture and API design

## Quick start

### Backend

The API reads **one** env var for data: `DATABASE_URL`. Point it at an [Aiven](https://aiven.io/) PostgreSQL service.

1. In the Aiven console, open the Postgres service → **Overview** → copy **Service URI**.
2. Put it in `backend/.env`. If the URI has no SSL flag, append `?sslmode=require` (Aiven requires TLS).

```bash
cd backend
cp .env.example .env
# Paste DATABASE_URL, then set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed   # optional: demo user + restaurant
npm run start:dev     # http://localhost:3001/api
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
```

- **Demo menu**: http://localhost:3000/restaurant/demo-cafe/menu (after seed)
- **Restaurant login**: owner@democafe.com / admin123
- **Platform admin**: admin@menuqr.com / admin123

## Tech stack

| Layer    | Stack |
|----------|--------|
| Backend  | NestJS, Prisma, PostgreSQL, JWT (access + refresh), class-validator, Throttler |
| Frontend | Next.js 14 App Router, TailwindCSS, SSR, dynamic QR (qrcode) |
| Auth     | JWT + refresh tokens, role-based (PLATFORM_OWNER, RESTAURANT_ADMIN) |
| Multi-tenant | Row-level by `restaurant_id`; tenant from JWT or URL slug |

## Main URLs

| Purpose           | URL |
|-------------------|-----|
| SaaS landing      | `/` |
| Features / Pricing / Contact | `/features`, `/pricing`, `/contact` |
| Login / Register   | `/login`, `/register` |
| Restaurant landing| `/restaurant/[slug]` |
| Menu (QR target)  | `/restaurant/[slug]/menu` |
| Category          | `/restaurant/[slug]/menu/[categorySlug]` |
| Product           | `/restaurant/[slug]/product/[productSlug]` |
| Restaurant dashboard | `/dashboard` |
| Platform admin    | `/admin` |

## Environment

**Backend (`.env`)**

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — min 32 chars
- `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY` — e.g. `15m`, `7d`
- `PORT` — default 3001
- `UPLOAD_DRIVER` — `local` or S3 (optional)
- `FRONTEND_URL` — used for QR menu URL (e.g. https://yourdomain.com)

**Frontend**

- `VITE_API_URL` — API origin with no trailing slash (e.g. `http://localhost:3001`). Required at **build time** on Vercel.

## Deploy on Render (frontend + API)

Hobby ($0): one **Static Site** for the Vite app and one **Free Web Service** for NestJS. Postgres stays on Aiven.

1. Push this repo to GitHub (includes `render.yaml`).
2. Open [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Select `zoualfkar15/restaurant_menu`.
4. When prompted, set **`DATABASE_URL`** on `menuqr-api` to your Aiven Service URI. Add `?sslmode=require` if it is missing.
5. Apply. You get:
   - API: `https://menuqr-api.onrender.com`
   - Site: `https://menuqr-web.onrender.com`

The free API **sleeps after 15 minutes** idle; the first hit after that can take about a minute.

Local uploads do not persist on the free instance. Seed once after migrate if you want demo data (`npm run prisma:seed` from a machine that has `DATABASE_URL`).

## Deploy on Vercel (frontend only)

The Vite app is what Vercel hosts. NestJS and PostgreSQL cannot run on Vercel — put the API on a Node host (Railway, Render, Fly.io) with a public URL, then point the frontend at it.

1. Import this Git repository in [Vercel](https://vercel.com/new).
2. Leave **Root Directory** as the repo root (or set it to `frontend`). Framework: Vite.
3. Add environment variable **`VITE_API_URL`** = your live API origin, e.g. `https://your-api.up.railway.app` (no trailing slash). This is baked in at build time.
4. Deploy.

On the API host, set:

- `CORS_ORIGIN` = `https://your-app.vercel.app` (comma-separated if you also have a custom domain)
- `CORS_ALLOW_VERCEL_PREVIEWS=true` if preview deployments should call the API
- `FRONTEND_URL` = `https://your-app.vercel.app` (used in QR menu links)
- `DATABASE_URL` (Aiven Service URI with `sslmode=require`), JWT secrets as usual

Local file uploads (`UPLOAD_DRIVER=local`) will not persist on ephemeral hosts; use S3 (or similar) in production.

## API overview

- **Public**: `GET /api/restaurants/:slug`, `GET /api/restaurants/:slug/menu`, `POST /api/restaurants/:slug/menu/view`, `POST /api/restaurants/:slug/qr/scan`, `GET /api/restaurants/:slug/products/:productSlug`
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me`
- **Restaurant admin**: `GET|PUT /api/admin/restaurant`, `GET /api/admin/stats`, `GET /api/admin/qr`, `GET|POST|PUT|DELETE /api/admin/categories`, `GET|POST|PUT|DELETE /api/admin/products`, `POST /api/admin/upload`
- **Platform**: `GET|POST|PUT|DELETE /api/platform/restaurants`, `GET /api/platform/analytics/overview`, `GET|PUT /api/platform/subscriptions` (Super Admin only)

See `docs/API_DESIGN.md` for full details.

## Future-ready

Schema and modules are prepared for: online ordering, table ordering, payment (Stripe), multi-language menus, and richer analytics.
