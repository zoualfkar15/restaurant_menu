# MenuQR SaaS — System Architecture

## 1. Overview

MenuQR is a multi-tenant SaaS platform for restaurants, cafés, and cafeterias providing QR-based digital menus. Each tenant (restaurant) has isolated data within the same system, with a unique SEO-friendly sub-path and public menu experience.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │ Web Browser  │  │ Mobile (QR)  │  │ Admin Panel  │                       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                       │
└─────────┼─────────────────┼─────────────────┼───────────────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS (Frontend)                                        │
│  • App Router • SSR/SSG • Edge • TailwindCSS • Image optimization           │
│  • / (landing) • /restaurant/:slug • /dashboard • /admin                     │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ REST API
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NESTJS (Backend API)                                      │
│  • JWT + Refresh • RBAC • Multi-tenant (restaurant_id) • Rate limit          │
│  • Auth • Restaurants • Categories • Products • Subscriptions • Upload       │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   PostgreSQL    │         │   Redis (cache)  │         │   S3 / Storage   │
│   (Prisma ORM)  │         │   optional       │         │   Images/Files   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 3. Multi-Tenant Design

- **Strategy**: Row-level tenancy. Every tenant-scoped table has `restaurant_id` (or equivalent). No separate DB per tenant.
- **Identification**: Tenant is determined by:
  - **Public routes**: `restaurantSlug` in URL → resolve to `restaurant_id`.
  - **Admin/API**: JWT payload contains `restaurantId` (and `role`); guards enforce tenant isolation.
- **Data isolation**: All admin queries filter by `req.user.restaurantId`. Super Admin has no `restaurantId` and can access all.

---

## 4. System Roles & Capabilities

| Role              | Scope        | Capabilities |
|-------------------|-------------|--------------|
| Platform Owner    | Global      | Full platform: restaurants CRUD, subscriptions, analytics, landing CMS |
| Restaurant Admin  | One restaurant | Dashboard, menu, landing editor, QR, own subscription view |
| Customer          | Public      | View restaurant landing + menu (no auth) |

---

## 5. URL Structure

| Purpose              | URL Pattern |
|----------------------|-------------|
| SaaS landing         | `/` |
| Features             | `/features` |
| Pricing              | `/pricing` |
| Contact              | `/contact` |
| Auth                 | `/login`, `/register` |
| Restaurant landing   | `/restaurant/[restaurantSlug]` |
| Menu                 | `/restaurant/[restaurantSlug]/menu` |
| Category             | `/restaurant/[restaurantSlug]/menu/[categorySlug]` |
| Product              | `/restaurant/[restaurantSlug]/product/[productSlug]` |
| Restaurant dashboard | `/dashboard` |
| Platform admin       | `/admin` |

QR code target: `https://domain.com/restaurant/{restaurantSlug}/menu`

---

## 6. API Design Summary

- **Base**: `https://api.domain.com` or `/api` proxy.
- **Auth**: `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/logout`.
- **Public**: `GET /restaurants/:slug`, `GET /restaurants/:slug/menu`, `GET /restaurants/:slug/categories`, etc.
- **Admin (restaurant)**: `POST|GET|PUT|DELETE /admin/categories`, `/admin/products`, `/admin/restaurant`, `/admin/qr`, etc. (all scoped by JWT `restaurantId`).
- **Platform admin**: `GET|POST|PUT|DELETE /platform/restaurants`, `/platform/subscriptions`, `/platform/analytics`, etc. (Super Admin only).
- **Upload**: `POST /upload` (signed URL or direct upload to S3); used for logo, cover, product images.

---

## 7. Security

- **Authentication**: JWT access (short-lived) + refresh token (stored server-side or in DB).
- **Authorization**: Guards per route (role + tenant). Restaurant Admin can only access own `restaurant_id`.
- **Rate limiting**: Global and per-route (e.g. auth, public menu).
- **Validation**: DTOs with class-validator. Sanitize file uploads (type, size).
- **CORS**: Whitelist frontend origin.

---

## 8. Performance & Caching

- **Menu pages**: Cache restaurant + menu by slug (e.g. Redis or in-memory TTL). Invalidate on menu/restaurant update.
- **Images**: CDN (e.g. CloudFront) in front of S3; Next.js image optimization for frontend.
- **SSR/Edge**: Next.js SSR for restaurant and menu pages for SEO and fast first paint; static generation where possible.

---

## 9. Future-Ready Hooks

- **Online ordering**: Add `Order`, `OrderItem`, `Cart`; checkout flow and webhooks.
- **Table ordering**: Add `Table` and link order to table.
- **Payments**: Stripe/payment provider; link to `Subscription` and orders.
- **i18n**: `Locale` on Restaurant, translated fields for categories/products.
- **Analytics**: Events table or integration (menu_views, qr_scans) already considered in schema.

Schema and module boundaries are designed so these can be added without breaking multi-tenancy or existing APIs.
