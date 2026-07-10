# Project Flowcharts

This document summarizes the current workflows of the event platform and its repository layout.

## 1. User journey flow

```mermaid
graph TD
    Start((Start)) --> Home[Home page]
    Home --> Explore[Browse events]
    Explore --> Detail[Open event details]
    Detail --> AuthCheck{Logged in?}
    AuthCheck -- No --> SignIn[Sign in or sign up]
    SignIn --> Detail
    AuthCheck -- Yes --> Actions[RSVP / Favorite / Review]
    Actions --> Dashboard[View in dashboard]
```

## 2. Event submission flow

```mermaid
graph LR
    User[Registered user] --> Form[Fill create-event form]
    Form --> Submit[POST /api/events]
    Submit --> Draft[Event saved as draft]
    Draft --> Admin[Admin moderation view]
    Admin --> Publish[Publish event]
    Publish --> Public[Visible on site]
```

## 3. Current system architecture

```mermaid
graph TD
    subgraph Frontend ["Frontend (Next.js & React)"]
        UI["UI Pages & Components (Tailwind & shadcn/ui)"]
        Auth["NextAuth.js Session Management"]
        Maps["Leaflet & react-leaflet Map UI"]
    end

    subgraph API ["Next.js Route Handlers (/api/*)"]
        Routes["API Routes (src/app/api)"]
        Prisma["Prisma ORM Client"]
    end

    subgraph ExternalServices ["External Services & Databases"]
        Strapi["Strapi CMS (port:1337)"]
        DB[("PostgreSQL Database")]
    end

    UI <--> Routes
    Auth <--> Routes
    Maps <--> Routes

    %% Hybrid Fallback Fetch Sequence
    Routes -- 1. Fetch CMS --> Strapi
    Routes -- 2. Fallback (If CMS Offline) --> Prisma
    Prisma <--> DB
```

## 4. Authentication flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant NextAuth
    participant Prisma

    User->>Frontend: Submit sign-in form
    Frontend->>NextAuth: Authenticate credentials
    NextAuth->>Prisma: Validate user record
    Prisma-->>NextAuth: Return user details
    NextAuth-->>Frontend: Session created
    Frontend->>User: Redirect to dashboard
```
