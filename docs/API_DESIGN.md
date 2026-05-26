# MenuQR — API Design

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.yourdomain.com` or `https://yourdomain.com/api`

## Authentication
- **Access token**: JWT in `Authorization: Bearer <token>`
- **Refresh token**: Sent in body or cookie; returns new access + refresh

---

## Public APIs (no auth)

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/restaurants/:slug` | Restaurant public profile (for landing page) |
| GET | `/restaurants/:slug/menu` | Full menu (categories + products) |
| GET | `/restaurants/:slug/categories` | Categories only |
| GET | `/restaurants/:slug/products` | Products (optional query: categoryId) |

### Analytics (lightweight, for counts)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/restaurants/:slug/menu/view` | Record menu view (for stats) |
| POST | `/restaurants/:slug/qr/scan` | Record QR scan (optional) |

---

## Auth APIs

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | `{ name, email, password, restaurantId? }` | Register user (Restaurant Admin or invite flow) |
| POST | `/auth/login` | `{ email, password }` | Login, returns access + refresh |
| POST | `/auth/refresh` | `{ refreshToken }` | New access token |
| POST | `/auth/logout` | `{ refreshToken }` | Invalidate refresh token |
| GET | `/auth/me` | - | Current user (requires auth) |

---

## Restaurant Admin APIs (JWT required, scope: restaurantId)

All under `/admin` or `/dashboard` prefix. Tenant = `req.user.restaurantId`.

### Restaurant (own profile)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/restaurant` | Get own restaurant |
| PUT | `/admin/restaurant` | Update landing page (name, description, logo, cover, contact, hours, social) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/categories` | List categories |
| POST | `/admin/categories` | Create category |
| PUT | `/admin/categories/:id` | Update category |
| DELETE | `/admin/categories/:id` | Delete category |
| PATCH | `/admin/categories/reorder` | Update sort_order |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/products` | List products (query: categoryId) |
| POST | `/admin/products` | Create product |
| GET | `/admin/products/:id` | Get one product |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| PATCH | `/admin/products/reorder` | Reorder within category |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/upload` | Upload image (logo, cover, product); returns URL |

### QR
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/qr` | Get QR code URL and optional image blob/URL |

### Dashboard stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Overview: menu items count, categories count, menu views, QR scans |

---

## Platform Owner APIs (Super Admin only)

Prefix: `/platform` or `/admin/platform`. Guard: role === PLATFORM_OWNER.

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/platform/restaurants` | List all (paginated) |
| POST | `/platform/restaurants` | Create restaurant |
| GET | `/platform/restaurants/:id` | Get one |
| PUT | `/platform/restaurants/:id` | Update (including suspend) |
| DELETE | `/platform/restaurants/:id` | Delete (soft/hard) |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/platform/subscriptions` | List all |
| GET | `/platform/restaurants/:id/subscription` | Get subscription for restaurant |
| PUT | `/platform/subscriptions/:id` | Upgrade/downgrade, change status |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/platform/analytics/overview` | Totals: restaurants, users, menu views, QR scans |
| GET | `/platform/analytics/restaurants` | Per-restaurant stats (optional) |

### Content (landing CMS)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/platform/content/landing` | Get main site content |
| PUT | `/platform/content/landing` | Update main site content |

---

## Response Format

- Success: `{ data: T }` or direct array/object as agreed.
- Error: `{ statusCode, message, error? }` (NestJS default).
- Pagination: `{ data: T[], total, page, limit }`

---

## Rate Limiting (examples)

- Auth: 10 req/min per IP
- Public menu: 100 req/min per IP
- Admin: 60 req/min per user
- Upload: 20 req/min per user
