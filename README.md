# Rora’s Delights — Cookie Shop (Next.js 14 App Router)

Full cookie shop with:
- FR default + optional Arabic (RTL) toggle
- Dark/light mode (`next-themes`)
- Products: `/`, `/products`, `/products/[slug]`
- Cart + checkout + success: `/cart`, `/checkout`, `/success`
- Zustand cart + wishlist persisted to `localStorage`
- WhatsApp floating button + WhatsApp order summary link at checkout
- Admin panel with login + JWT cookie (`jose`): `/admin`
- Admin CRUD products (seed JSON) + optional Vercel Blob persistence
- Orders API + optional Resend / Telegram notifications
- PWA (via `@ducanh2912/next-pwa`) + `manifest.webmanifest` + dynamic icon routes
- Basic SEO metadata + sitemap/robots

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Data

- Seed products live in: `src/data/products.seed.json`
- If `BLOB_READ_WRITE_TOKEN` is set, products are persisted to Blob at: `products/products.json`
- Orders (when Blob is enabled) are stored as: `orders/{id}.json`

## Admin

Visit:
- `/admin/login` (login)
- `/admin/products` (CRUD)
- `/admin/orders` (list + status update)

Admin auth is controlled via environment variables (see below) and a JWT cookie named `admin_token`.

## Environment variables

Create `.env.local` (you can start from `.env.example`):

### Required (recommended for production)
- `NEXT_PUBLIC_SITE_URL` — e.g. `https://your-domain.com` (used for metadata/sitemap)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — e.g. `212600000000` (international format, no `+`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `JWT_SECRET` (or `ADMIN_JWT_SECRET`) — used to sign/verify the admin JWT cookie

### Optional (persistence)
- `BLOB_READ_WRITE_TOKEN` — enables Vercel Blob persistence for products & orders

### Optional (order notifications)
- `RESEND_API_KEY`
- `RESEND_TO` — notification email recipient
- `RESEND_FROM` — default `orders@roras-delights.local`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Vercel deploy

1. Push the repo to GitHub.
2. Import into Vercel.
3. Set the environment variables above (at minimum admin + WhatsApp).
4. (Recommended) Add Vercel Blob and set `BLOB_READ_WRITE_TOKEN` so admin product CRUD and order storage persist in production.
