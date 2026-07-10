# Viva Guide

This guide covers the technology stack, architectural decisions, and key concepts of the event platform to prepare you for technical questions.

---

## 1. Core Technology Stack & "Why" Decisions

### Q: Can you explain the technology stack of this application and why each tool was chosen?

| Technology | Role | Why It Was Chosen |
| :--- | :--- | :--- |
| **Next.js (App Router)** | Fullstack Framework | Provides unified client/server architecture, file-based routing, server-side rendering (SSR) for SEO, and API Route Handlers. |
| **React** | UI Library | Component-based model enables highly interactive and reusable frontend components (e.g., dynamic search filters, interactive maps). |
| **TypeScript** | Language | Enforces compile-time type safety, minimizing runtime exceptions and providing excellent developer autocomplete and linting. |
| **Tailwind CSS** | Styling | Utility-first styling framework allowing fast layouts directly in code, ensuring responsive web design, and producing tiny, optimized CSS bundles. |
| **shadcn/ui** | Component Library | Premium UI primitives (built on Radix UI and Tailwind CSS) that provide accessible, customizable component templates (buttons, badges, inputs). |
| **Prisma ORM** | Database Access | Type-safe Node.js ORM that abstracts SQL database queries and simplifies migrations for local PostgreSQL. |
| **PostgreSQL** | Relational Database | Stores users, RSVPs, reviews, and event metadata, offering relational constraints and reliable transactions. |
| **Strapi CMS** | Headless Content Backend | Provides an out-of-the-box headless CMS where event organizers can edit, moderate, and publish events via a friendly UI dashboard. |
| **Leaflet & react-leaflet**| Interactive Maps | Open-source map packages that render physical event venues dynamically with custom pins using OpenStreetMap tiles. |
| **NextAuth.js** | Authentication | Handles secure user sign-in, credential token checks, session persistence, and middleware for protected pages/routes. |

---

## 2. Advanced Architectural Questions

### Q: How does the application handle data persistence and integration with Strapi CMS?
A: The application implements a **Hybrid Backend Data Fallback Strategy**:
1. When Next.js API endpoints (such as `/api/events` or `/api/categories`) are queried, they first attempt to retrieve the data from the **Strapi CMS API** (acting as the primary content source).
2. If the Strapi backend is down/offline (e.g., during local development or network outages), the request throws an exception, logs a server warning, and **seamlessly falls back to local PostgreSQL using Prisma ORM**. This ensures the application remains fully functional even when the CMS is offline.

### Q: Where are user accounts, RSVPs, and favorites stored?
A: Core transactional user actions (e.g., registering accounts, favoriting events, writing reviews, and RSVP-ing) are written **directly to local PostgreSQL via Prisma**. This keeps sensitive user sessions and transactional state localized in our main database, while public event metadata is managed by Strapi CMS.

### Q: How is routing structured?
A: We use the Next.js App Router structure inside `src/app/`:
- **Public Routes:** Home (`/`), Events (`/events`), Event details (`/events/[slug]`), About (`/about`), and Contact (`/contact`).
- **Protected User Routes:** Dashboard (`/dashboard`), Favorites (`/dashboard/favorites`), Create Event (`/dashboard/create-event`), and Profile (`/dashboard/profile`).
- **Admin-Only Routes:** Admin Moderation (`/admin`) and User Management (`/admin/users`).
- **API Routes:** `/api/events`, `/api/categories`, `/api/rsvps`, `/api/favorites`, `/api/upload`, and `/api/auth/register`.

### Q: Why is there no "Community" link in the navigation header?
A: The `/community` route is not defined in the application. To ensure a seamless user experience and prevent `404 Not Found` runtime errors, the navigation links array in `src/components/layout/navbar.tsx` was cleaned up to direct users only to active public routes (`/`, `/events`, `/about`).

---

## 3. Key Walkthrough Tips for the Viva

1. **Be clear about the hybrid data strategy:** Point out that Next.js acts as a bridge. It integrates with Strapi CMS for reads, but has local PostgreSQL/Prisma fallbacks if Strapi goes down.
2. **Mention security & Auth:** Explain that NextAuth.js uses secure credentials checks and guards pages (dashboard, admin) via Client-side session checks and API session verification.
3. **Responsive UI:** Note that Tailwind CSS classes ensure compatibility with mobile screens, and Leaflet maps recalculate marker layouts dynamically when the screen size changes.
