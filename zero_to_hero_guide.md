# Zero-to-Hero Developer Guide

This guide explains the current event platform from scratch.

## 1. What this project is

This is an event discovery and community engagement application. Users can browse events, view them on a map, sign up, RSVP, save favorites, and submit their own events.

## 2. How to run it

1. Install dependencies with npm install
2. Configure DATABASE_URL for PostgreSQL
3. Run Prisma migrations with npx prisma migrate dev
4. Seed sample data with npx prisma db seed
5. Start the app with npm run dev
6. Open http://localhost:3000

## 3. Important folders

| Feature | Folder | Why it matters |
| :--- | :--- | :--- |
| Pages and routes | src/app/ | Contains the home page, event pages, dashboards, admin pages, and API routes (navbar links are restricted to active public routes) |
| Reusable UI | src/components/ | Contains the navbar, cards, buttons, map components, and shared UI |
| Authentication and helpers | src/lib/ | Contains auth configuration, database access (Prisma), Strapi fetch utility, and helper utilities |
| Database schema | prisma/ | Contains the Prisma schema, migrations, and seed script |
| CMS backend | strapi-backend/ | Contains the integrated Strapi CMS companion (with Next.js API fallbacks) |

## 4. Main features to know

- Home and events pages
- Event detail page with map and RSVP actions
- Authenticated dashboard for favorites and RSVPs
- Admin moderation screens
- Prisma-backed database persistence for events, users, categories, and reviews
- Hybrid Strapi CMS integration with local Prisma database fallbacks

## 5. Big-picture concepts for viva

1. Next.js powers the main app experience and API routes.
2. Prisma provides local database persistence and is used as the automatic fallback layer.
3. NextAuth handles authentication and session management.
4. Tailwind CSS and shadcn/ui provide the polished UI.
5. Strapi acts as the primary event CMS, integrated directly into the Next.js API layer.

## 6. Common troubleshooting

- If the app fails to start, run npm install again.
- If database tables are missing, run npx prisma migrate dev.
- If sample content is missing, run npx prisma db seed.
- If the map is blank, check that the browser can load OpenStreetMap tiles.
- If the Strapi backend is offline, the Next.js APIs gracefully fallback to querying PostgreSQL via Prisma, so event data will still load.
- To run the Strapi CMS backend, navigate to the `strapi-backend` folder and run `npm run develop`.
