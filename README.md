# MenuQR — SaaS Platform for QR Digital Menus

Multi-tenant SaaS for restaurants, cafés, and cafeterias: QR-based digital menus, restaurant landing pages, and admin dashboards.

## Repository structure

- **`/backend`** — NestJS (TypeScript), PostgreSQL, Prisma, JWT, multi-tenant REST API
- **`/frontend`** — Next.js 14 (App Router), TailwindCSS, mobile-first
- **`/docs`** — Architecture and API design

## Quick start

### Backend

The project is configured for a **local Docker PostgreSQL** instance with user `winova` and password `winova123` (see `.env`). Use database name `menuqr`.

**Create the database** (once, with Postgres running in Docker):

```bash
# From host, if Docker Postgres is on localhost:5432
createdb -h localhost -p 5432 -U winova menuqr
# Or inside the container: psql -U winova -c "CREATE DATABASE menuqr;"
```

Then:

```bash
cd backend
cp .env.example .env
# Adjust DATABASE_URL if needed; set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
npm install
npx prisma generate
npx prisma migrate dev
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

- `NEXT_PUBLIC_API_URL` — leave empty when using Next.js rewrites to same host; set to API base (e.g. `http://localhost:3001`) for server-side fetch if API is on another origin.

## API overview

- **Public**: `GET /api/restaurants/:slug`, `GET /api/restaurants/:slug/menu`, `POST /api/restaurants/:slug/menu/view`, `POST /api/restaurants/:slug/qr/scan`, `GET /api/restaurants/:slug/products/:productSlug`
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me`
- **Restaurant admin**: `GET|PUT /api/admin/restaurant`, `GET /api/admin/stats`, `GET /api/admin/qr`, `GET|POST|PUT|DELETE /api/admin/categories`, `GET|POST|PUT|DELETE /api/admin/products`, `POST /api/admin/upload`
- **Platform**: `GET|POST|PUT|DELETE /api/platform/restaurants`, `GET /api/platform/analytics/overview`, `GET|PUT /api/platform/subscriptions` (Super Admin only)

See `docs/API_DESIGN.md` for full details.

## Future-ready

Schema and modules are prepared for: online ordering, table ordering, payment (Stripe), multi-language menus, and richer analytics.
