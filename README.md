# NPL Live

Production-style full-stack e-sports and cricket streaming platform for the Nepal Premier Cricket League, built with Next.js, Tailwind CSS, Prisma, PostgreSQL, JWT auth, and Zustand.

## Features

- User authentication with signup, login, logout, forgot password, reset password, and email verification flow
- Role-aware dashboards for `viewer`, `streamer`, and `admin`
- Animated gaming-style homepage with hero, featured streams, tournaments, streamers, and merch
- Live stream pages with embedded player, engagement actions, live chat, schedule, and VODs
- Tournament listings, bracket rendering, schedules, team cards, and registration form
- E-commerce store with filters, product details, persistent cart, coupons, checkout, and order history
- Admin dashboard for stats plus product, stream, and tournament management
- Streamer dashboard for stream creation, chat visibility, and profile assets
- API routes for users, products, streams, tournaments, orders, cart, wishlist, upload, and admin stats

## Tech Stack

- Frontend: Next.js 16 App Router + React 19
- Styling: Tailwind CSS 4
- Backend: Next.js route handlers
- Database: PostgreSQL via Prisma ORM
- Auth: Secure password hashing with `bcryptjs` and signed JWT cookie sessions
- Payments: Stripe-ready placeholder flow
- State: Zustand with local persistence for cart and wishlist
- Uploads: Local upload API endpoint to `public/uploads`

## Demo Credentials

- Admin: `admin@npllive.com` / `Password123!`
- Streamer: `streamer@npllive.com` / `Password123!`
- Viewer: `viewer@npllive.com` / `Password123!`

## Environment Variables

Copy `.env.example` to `.env` and update as needed:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/npl_live"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL and create a database named `npl_live`.

3. Generate Prisma client and push the schema:

```bash
npm run db:generate
npm run db:push
```

4. Seed demo data:

```bash
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm run start
```

Note: a valid `DATABASE_URL` must be present for data-backed pages and API routes to render correctly.

## Project Structure

```text
NPL/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order-confirmation/
│   │   ├── orders/
│   │   ├── profile/
│   │   ├── search/
│   │   ├── store/
│   │   ├── streamer/
│   │   ├── streams/
│   │   ├── tournaments/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy/
│   │   └── terms/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── store/
│   │   ├── streams/
│   │   ├── tournaments/
│   │   └── ui/
│   ├── lib/
│   └── store/
├── middleware.ts
├── next.config.ts
├── package.json
└── .env.example
```

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/verify-email`
- `GET|PATCH /api/auth/me`
- `GET|POST /api/products`
- `GET|PATCH|DELETE /api/products/:id`
- `GET|POST /api/streams`
- `GET|PATCH|DELETE /api/streams/:id`
- `POST /api/streams/:id/like`
- `POST /api/streams/:id/follow`
- `POST /api/streams/:id/chat`
- `GET|POST /api/tournaments`
- `GET|PATCH|DELETE /api/tournaments/:id`
- `POST /api/tournaments/register`
- `GET|POST /api/orders`
- `GET /api/orders/:id`
- `GET|POST /api/wishlist`
- `GET|POST /api/cart`
- `POST /api/upload`
- `GET /api/admin/stats`

## Seeded Content

- 3 users with role-based access
- 6 merch products across requested categories
- Live, scheduled, and ended streams
- Tournament bracket and schedule JSON
- Chat messages, follows, likes, wishlist entries, and sample paid order

## Notes

- Stripe keys are optional. Without them, checkout completes using the placeholder paid-order path.
- Upload API is implemented for local file storage; current dashboard forms also accept direct image URLs for fast data entry.
- Cart and wishlist persist in the browser using Zustand so guest flows work immediately.
