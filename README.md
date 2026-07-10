# Event Discovery & Community Engagement Platform

This repository now contains the main Next.js application for discovering, browsing, and managing community events, along with an optional Strapi backend companion in the strapi-backend folder.

## What is included

- Public home, events, about, and contact pages (navbar links reflect only existing public routes)
- Event discovery with search, filters, and an interactive Leaflet map
- Event detail pages with RSVP, favorite, and review support
- Authenticated dashboards for RSVPs, favorites, profile, and event submission
- Admin moderation and user role management
- Hybrid backend: Queries Strapi CMS first, with automatic, seamless fallback to PostgreSQL/Prisma if Strapi is offline
- Prisma-backed persistence for the main app data layer

## Current stack

- Next.js 16 with the App Router
- TypeScript
- Tailwind CSS and shadcn/ui
- NextAuth.js for credentials-based authentication
- Prisma ORM with PostgreSQL via DATABASE_URL
- Leaflet and react-leaflet for interactive maps
- Strapi CMS backend in strapi-backend/ (integrated with automatic API fallback)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Setup Prisma database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 3. Start Next.js dev server
npm run dev
```

Open http://localhost:3000 to view the app.

## Key folders

- src/app/ — pages, layouts, and API route handlers
- src/components/ — reusable UI, layouts (navbar, footer), and event components
- src/lib/ — auth, database (Prisma), Strapi fetch helper, and utilities
- prisma/ — schema, migrations, and seed data
- strapi-backend/ — integrated Strapi CMS backend companion

## Useful commands

```bash
npm run build
npx prisma studio
npx prisma migrate dev --name <change-name>
```

## Strapi Backend CMS

The application integrates with Strapi CMS as a primary data source for events and categories:

```bash
# Run Strapi backend (Optional, fallback to Prisma database is automatic)
cd strapi-backend
npm install
npm run develop
```

- When Strapi is running, API routes like `/api/events` fetch from Strapi.
- If Strapi is offline, the Next.js server logs a warning and gracefully falls back to local Prisma queries.

## Verification status

The current project structure is aligned with the Next.js app in the repository root (including navbar navigation reflecting active pages) and the integrated Strapi backend under strapi-backend/.
