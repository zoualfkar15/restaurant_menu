# Dashboard UI Layout

## Restaurant Admin Dashboard (`/dashboard`)

- **Sidebar**: Logo, nav (Overview, Menu, Landing page, QR code), back to site, Log out.
- **Overview**: Cards for menu items, categories, menu views, QR scans; link to open menu; CTA to edit menu.
- **Menu**: List of categories with products; add category / add product links (placeholder routes for full CRUD).
- **Landing page**: Form to edit restaurant name, description, phone, address, WhatsApp.
- **QR code**: Display QR image and menu URL; copy/print guidance.

Layout: sidebar (fixed width) + main content area. Mobile: consider collapsible sidebar or bottom nav.

## Platform Owner Dashboard (`/admin`)

- **Sidebar**: Dark theme; nav (Overview, Restaurants, Subscriptions); link to restaurant dashboard; Log out.
- **Overview**: Cards for total restaurants, users, menu views, QR scans.
- **Restaurants**: Table of restaurants (name, slug, product count, status, link to menu).
- **Subscriptions**: Table of subscriptions (restaurant, plan, status, billing, end date).

Same layout pattern: sidebar + main. Platform admin is restricted to role `PLATFORM_OWNER`; backend enforces via `@Roles(Role.PLATFORM_OWNER)`.

## Design tokens

- **Brand**: `brand-500` (orange) for primary actions; `brand-50` for highlights.
- **Neutrals**: `slate-50` background, `slate-200` borders, `slate-900` headings.
- **Font**: DM Sans (Tailwind `font-sans`).

## Future dashboard additions

- Menu: full CRUD for categories and products (new/edit/delete pages).
- Landing: logo/cover upload, opening hours editor, social links.
- Analytics: charts for views and scans over time.
- Platform: create restaurant, suspend, subscription upgrade/downgrade forms.
