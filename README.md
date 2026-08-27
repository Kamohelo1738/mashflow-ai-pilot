# Operations Dashboard

A client and operations management platform built for running an AI automation / compliance consulting practice — track clients, generate audits, produce documents, and manage automation solution offerings from a single dashboard.

> Built with [Lovable](https://lovable.dev), React, and Supabase.

## Overview

This app gives a single view of the business: how many clients are onboarded, how many audits have been generated, how many documents produced, and quick access to the core workflows (client intake, audit generation, automation solution setup, document creation).

## Tech Stack

- **Frontend:** React + TypeScript
- **Routing:** React Router (`react-router-dom`)
- **Styling:** Tailwind CSS with a custom design token theme (`background`, `card`, `foreground`, `primary`, `secondary`, etc.)
- **UI Components:** shadcn/ui-style component set (`AppLayout`, `PageHeader`, `MetricCard`)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Backend / Data:** Supabase (Postgres + client SDK via `@/integrations/supabase/client`)

## Features

- **Dashboard (`/`)** — Live metrics pulled from Supabase:
  - Total clients
  - Audits generated
  - Documents created
  - Platform status
  - Quick actions panel linking to the core workflows
  - Recent clients feed (last 5, by creation date)
- **Client Intake (`/intake`)** — Add new clients
- **Audit Generation (`/audit`)** — Generate compliance/business audits
- **Automation Solutions (`/automation`)** — Configure or present automation offerings
- **Document Creation (`/documents`)** — Generate client-facing documents

## Data Model (Supabase)

The dashboard reads from at least three tables:

| Table | Used for |
|---|---|
| `clients` | Client records — `id`, `client_name`, `company_name`, `created_at` |
| `audits` | Audit records — count only on this screen |
| `documents` | Document records — count only on this screen |

> Note: full schema (columns, relations, RLS policies) isn't visible from this file alone — pull that from the Supabase project or migration files if you need to document it fully.

## Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev
```

### Environment

This project depends on Supabase for data. Ensure the Supabase client at `src/integrations/supabase/client.ts` (or wherever `@/integrations/supabase/client` resolves) is configured with your project URL and anon key, typically via environment variables:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

Built and exported via Lovable. For a fully independent deploy (no Lovable branding, no ongoing subscription dependency), sync to GitHub and deploy via Netlify/Vercel.

## Project Structure (partial — inferred from this file)

```
src/
├── components/
│   ├── AppLayout.tsx
│   ├── PageHeader.tsx
│   └── MetricCard.tsx
├── integrations/
│   └── supabase/
│       └── client.ts
└── pages/
    └── Index.tsx        # Dashboard (this file)
```

---

*This README was generated from a single component file (`Index.tsx`). Sections marked "inferred" or "partial" should be verified/expanded against the full codebase before sharing externally.*
