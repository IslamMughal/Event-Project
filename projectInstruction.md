# Current Project Instructions

## Project Title

Event Discovery & Community Engagement Platform

## Current Architecture

The repository contains the main Next.js application at the workspace root and an integrated Strapi backend in the `strapi-backend` folder. Next.js API route handlers act as a query middleware that fetches from Strapi (caching responses with Upstash Redis) and falls back dynamically to local PostgreSQL via Prisma if the CMS is offline.

## What the platform does

- Lets visitors browse public events, search by keyword, and filter by category (navbar links reflect only active public routes)
- Displays event listings together with an interactive Leaflet map
- Shows detailed event pages with venue information, pricing, and RSVP actions
- Supports authenticated users with favorites, RSVPs, profile management, and event submission
- Provides admin pages for moderation and user management

## Core roles

### Guest user
- Browse events and view details
- Search and filter events
- Access the about and contact pages

### Registered user
- RSVP to events
- Save favorites
- View their dashboard and manage personal activity
- Submit new events for review

### Administrator
- Review or manage submitted events
- Manage user roles and administrative access

## Current implementation stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui
- Maps: Leaflet and react-leaflet
- Authentication: NextAuth.js with credentials login
- Database: Prisma ORM with PostgreSQL via DATABASE_URL
- API: Next.js route handlers in src/app/api with dynamic fallback logic
- CMS backend: Strapi under strapi-backend/

## Project structure

- src/app/ — pages, layouts, and API route handlers (navbar matches active public routes)
- src/components/ — UI, layout wrapper, and event-specific components
- src/lib/ — auth, database, Strapi fetching, and utilities
- prisma/ — schema, migrations, and seed data
- strapi-backend/ — integrated Strapi CMS backend companion

## Development workflow

1. Install dependencies with npm install
2. Configure the DATABASE_URL environment variable
3. Run Prisma migrations with npx prisma migrate dev
4. Seed sample data with npx prisma db seed
5. Start the app with npm run dev
6. Verify the build with npm run build

## Notes for contributors

- Keep new features aligned with the existing App Router structure
- Prefer Prisma for core event and user transaction data changes (RSVPs, favorites, reviews)
- Leverage the Strapi CMS backend for public event content management
- Add or update documentation whenever the app behavior changes
