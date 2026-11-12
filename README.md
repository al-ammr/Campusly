# Campusly

**An installable, privacy-first, zero-login campus discovery and administrative registry for Ahmadu Bello University (ABU Zaria — Samaru & Kongo Campuses).**

Campusly empowers ABU students to discover registered student communities, campus events, academic/career opportunities, and student-run businesses across the institution without requiring student account sign-up—while giving campus administrators a role-based moderation, finance reconciliation, and audit console.

---

## Core Capabilities

### 1. Public Discovery Almanac

- **Communities & Societies** (`/communities`, `/categories`): Browse student clubs, chapters, and faculty associations organized across 10 category palettes with verification badges.
- **Events & Calendar Export** (`/events`): Discover upcoming campus events with venue details, map/registration links, and one-click RFC 5545 `.ics` calendar downloads (`/api/v1/events/[id]/calendar.ics`).
- **Opportunities Directory** (`/opportunities`): Filter fellowships, internships, scholarships, and competitions with automatic expiry handling for closed deadlines.
- **Search & Intent Discovery** (`/search`, `/explore`): PostgreSQL trigram (`pg_trgm`) and unaccented search with autocomplete suggestions (`/api/v1/search/suggest`) and zero-result search analytics.
- **University Bulletins** (`/announcements`): Campus-wide announcements with pinned header banner support.

### 2. Zero-Login Submissions & Guided Tracking

- **Multi-Step Submission Flow** (`/submit`): Submit communities, events, or opportunities with duplicate detection (`/api/v1/submissions/duplicates`), honeypot/fill-time spam checks, and magic-byte attachment validation (`JPEG`, `PNG`, `WebP`, `PDF`).
- **Tracking Codes & Reviewer Replies** (`/track`, `/track/[code]`): Receive non-ambiguous tracking codes (`CY-XXXX-XXXX`) to inspect live moderation timelines and reply directly to `Needs info` requests.

### 3. Abuse-Resistant Campus Interactions

- **Device-Scoped Starring** (`/api/v1/listings/[id]/star`): Privacy-preserving device fingerprinting with sliding-window rate limiting and atomic star counter updates.
- **Community Moderation & Auto-Hide** (`/api/v1/listings/[id]/report`, `/api/v1/spotlight/[id]/report`): Distinct-device reporting rules that flag or automatically hide abusive content pending admin review.

### 4. Spotlight Commerce & Bank Ledger

- **Student Business Promotion** (`/businesses`, `/spotlight`, `/spotlight/new`): Dedicated directory and 4-step promotion order flow with Standard and Featured plans priced dynamically from the runtime settings register (`plan.standard.price`, `plan.featured.price`).
- **Bank Receipt Verification**: Transfer reference generation, proof-of-payment uploads, waitlist handling, and mandatory bank confirmation workflows in `/admin/spotlight`.

### 5. Administrative Registry Console (`/admin`)

- **Authentication & RBAC** (`/admin/login`, `lib/auth/`): Scrypt password hashing, optional RFC 6238 TOTP 2FA, login attempt lockouts, and role-based access control (`lead`, `finance`, `reviewer`).
- **Moderation & Operations**: Review queue (`/admin/review`), flagged reports (`/admin/reports`), Spotlight finance & reconciliation (`/admin/spotlight`), showcase curation (`/admin/showcase`), announcements (`/admin/announcements`), runtime settings register (`/admin/settings`), user management (`/admin/users`), metrics & CSV exports (`/admin/metrics`), and append-only audit logs (`/admin/audit`).

### 6. Progressive Web App & Security Hardening

- **PWA & Offline Support**: Installable manifest (`public/manifest.json`), service worker (`public/sw.js`) with shell precaching, network-first page caching, stale-while-revalidate image caching, and `/offline` fallback—while bypassing `/admin` and mutation routes.
- **Security Headers & Middleware** (`middleware.ts`, `lib/api/security.ts`): Strict Content-Security-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS in production, anti-CSRF checks, and a `MAINTENANCE_MODE` toggle.
- **Accessibility & Compliance**: Legal pages (`/privacy`, `/terms`, `/legal/*`, `/accessibility`) audited with `axe-core`.

---

## Tech Stack

| Layer                       | Technology                                                                                       |
| :-------------------------- | :----------------------------------------------------------------------------------------------- |
| **Framework**               | Next.js 14 (App Router), React 18, TypeScript 5                                                  |
| **Styling & Design System** | Tailwind CSS, CSS Custom Properties (`styles/tokens.css`), self-hosted DM Sans (`public/fonts/`) |
| **Database**                | PostgreSQL (`pg` pool, parameterized SQL, ACID transactions, 25 tables)                          |
| **Rate Limiting & Cache**   | Upstash Redis REST pipeline (`lib/api/rate-limit.ts`) with in-memory fallback                    |
| **Object Storage**          | S3-compatible / Supabase Storage via AWS SigV4 (`lib/storage/s3.ts`) with local disk fallback    |
| **Transactional Email**     | Resend REST API (`lib/email/index.ts`) with mock mode for dev/tests                              |
| **Validation**              | Zod (`lib/env.ts`, API route request schemas)                                                    |
| **Testing & Quality**       | Vitest, React Testing Library, JSDOM, `axe-core`, ESLint, Prettier                               |
| **Deployment & Crons**      | Vercel + `vercel.json` Cron Jobs                                                                 |

---

## Repository Structure

```text
.
├── .github/workflows/ci.yml   # CI: audit, gitleaks, prettier, eslint, tsc, vitest, next build
├── app/
│   ├── admin/                 # Admin console pages (login, review, reports, spotlight, settings, etc.)
│   ├── api/v1/                # REST API v1 endpoints (public, submissions, admin, auth, jobs, uploads)
│   ├── categories/            # Category directory and filtered listing pages
│   ├── communities/           # Student communities directory and detail pages
│   ├── events/                # Campus events directory, detail pages, and .ics calendar route
│   ├── opportunities/         # Opportunities directory and detail pages
│   ├── spotlight/             # Spotlight directory and business promotion wizard
│   ├── submit/ & track/       # Submission wizard and tracking code status/reply pages
│   ├── legal/, privacy/, ...  # Legal, accessibility, sitemap, offline, and maintenance pages
│   └── page.tsx               # Public home showcase (after /welcome first-visit onboarding)
├── components/                # UI primitives, cards, shell navigation, modals, PWA prompt
├── docs/                      # Build logs and release notes
├── lib/
│   ├── api/                   # Response envelopes, rate limiter, CSRF/security headers, public queries
│   ├── auth/                  # Session tokens, scrypt hashing, TOTP, admin auth & lockouts
│   ├── db/                    # PostgreSQL connection pool and transaction helper
│   ├── email/                 # Resend & mock transactional email dispatcher
│   ├── jobs/                  # Scheduled job implementations + immutable job_runs logger
│   ├── middleware/            # RBAC and timing-safe cron authentication
│   ├── rules/                 # Listing status state machine & business rules
│   ├── settings/              # Runtime settings register defaults & readers
│   ├── showcase/              # Home showcase curation defaults & service
│   └── storage/               # Magic-byte validator, S3 SigV4 uploader, attachment store
├── public/                    # Service worker (sw.js), manifest.json, self-hosted fonts, media
├── scripts/
│   ├── migrations/            # 001_initial_schema.sql & .down.sql (25 tables)
│   ├── migrate.ts             # Schema migration runner
│   ├── seed.ts                # ABU Zaria campus, categories, settings, and sample records seeder
│   └── backup-restore-verify.ts
├── styles/                    # Design tokens and global Tailwind stylesheet
├── tests/                     # Unit, API, component, PWA, and axe-core accessibility suites
├── middleware.ts              # Security headers, maintenance interceptor, /welcome redirect
└── vercel.json                # Production Vercel Cron schedule configuration
```

---

## Local Development Setup

### Prerequisites

- **Node.js 20+** and **npm**
- **PostgreSQL 15+** (local instance or hosted provider such as Supabase)
- Optional for full external integrations: **Upstash Redis**, **S3-compatible storage** (e.g., Supabase Storage / Cloudflare R2), and **Resend** API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the template file and fill in your local or staging credentials:

```bash
cp .env.example .env
```

All environment variables are validated at startup in `lib/env.ts`:

| Variable                          | Required                        | Description                                                                  |
| :-------------------------------- | :------------------------------ | :--------------------------------------------------------------------------- |
| `DATABASE_URL`                    | Yes                             | PostgreSQL connection string (pooled/runtime)                                |
| `DATABASE_DIRECT_URL`             | Optional                        | Direct PostgreSQL connection string for migrations                           |
| `REDIS_URL`                       | Yes                             | Redis connection URL                                                         |
| `REDIS_TOKEN`                     | Optional                        | Redis auth token (if applicable)                                             |
| `UPSTASH_REDIS_REST_URL`          | Optional                        | Upstash Redis REST URL for serverless rate limiting                          |
| `UPSTASH_REDIS_REST_TOKEN`        | Optional                        | Upstash Redis REST bearer token                                              |
| `SESSION_SECRET`                  | Yes                             | Minimum 32-character secret for signing admin sessions                       |
| `JOB_SECRET`                      | Yes                             | Minimum 16-character bearer secret for `/api/v1/jobs/*`                      |
| `DATA_ENCRYPTION_KEY`             | Yes                             | Minimum 32-character encryption key (e.g., 64 hex chars)                     |
| `STORAGE_ENDPOINT`                | Optional                        | S3/Supabase Storage endpoint URL (falls back to `public/uploads` if omitted) |
| `STORAGE_REGION`                  | Default `auto`                  | S3 storage region                                                            |
| `STORAGE_ACCESS_KEY_ID`           | Yes                             | Storage access key ID                                                        |
| `STORAGE_SECRET_ACCESS_KEY`       | Yes                             | Storage secret access key                                                    |
| `STORAGE_BUCKET_NAME`             | Yes                             | Target storage bucket name                                                   |
| `EMAIL_PROVIDER`                  | Default `mock`                  | `mock`, `resend`, or `smtp`                                                  |
| `EMAIL_API_KEY`                   | Optional                        | Resend API key (required when `EMAIL_PROVIDER=resend`)                       |
| `EMAIL_FROM`                      | Optional                        | Verified sender address                                                      |
| `ADMIN_ALERT_EMAIL`               | Optional                        | Admin notification destination email                                         |
| `NEXT_PUBLIC_APP_URL`             | Default `http://localhost:3000` | Public canonical app URL                                                     |
| `NEXT_PUBLIC_DEFAULT_CAMPUS_SLUG` | Default `abu-zaria`             | Default campus identifier                                                    |
| `NEXT_PUBLIC_BUILD_ID`            | Default `dev`                   | Build identifier reported by `/api/v1/health`                                |

### 3. Run Database Migrations & Seed

Apply `scripts/migrations/001_initial_schema.sql` (25 tables with `uuid-ossp`, `pg_trgm`, and `unaccent` extensions) and seed ABU Zaria categories, settings, and sample listings:

```bash
npx tsx scripts/migrate.ts
npx tsx scripts/seed.ts
```

_(Note: `migrate.ts` and `seed.ts` read connection settings from your environment; ensure `.env` is loaded before invoking them directly via Node/tsx, or run SQL directly with `psql "$DATABASE_URL" -f scripts/migrations/001_initial_schema.sql`.)_

### 4. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (append `?home=1` to bypass the first-visit `/welcome` onboarding redirect).

---

## Available Scripts

| Command                | Purpose                                       |
| :--------------------- | :-------------------------------------------- |
| `npm run dev`          | Start Next.js development server on port 3000 |
| `npm run build`        | Build optimized production bundle             |
| `npm run start`        | Start Next.js production server               |
| `npm run lint`         | Run ESLint via `next lint`                    |
| `npm run typecheck`    | Run strict TypeScript check (`tsc --noEmit`)  |
| `npm run format:check` | Check formatting across repo with Prettier    |
| `npm run format`       | Format codebase with Prettier                 |
| `npm run test`         | Run Vitest test suite once                    |
| `npm run test:watch`   | Run Vitest in interactive watch mode          |

---

## Scheduled Background Jobs (`vercel.json`)

Campusly includes 9 automated maintenance endpoints under `/api/v1/jobs/*` supporting both `GET` (Vercel Cron) and `POST`. Every endpoint is guarded by `withCronAuth` (`lib/middleware/cronAuth.ts`) using timing-safe comparison against `JOB_SECRET` (or Vercel's `CRON_SECRET`) and logs execution outcomes to the `job_runs` table:

- `/api/v1/jobs/expire-spotlight` — Expire finished Spotlight listings
- `/api/v1/jobs/rotate-featured` — Rotate featured Spotlight slots
- `/api/v1/jobs/close-opportunities` — Hide approved opportunities past their deadline
- `/api/v1/jobs/stale-submissions` — Archive stale `Needs info` submissions (>14 days)
- `/api/v1/jobs/unpaid-holds` — Cancel unconfirmed Spotlight holds (>48 hours)
- `/api/v1/jobs/recount` — Reconcile denormalized `star_count` totals
- `/api/v1/jobs/reconciliation-report` — Compute Spotlight revenue & pending receipt totals
- `/api/v1/jobs/retention` — Purge inactive device records (>365 days)
- `/api/v1/jobs/verification-review` — Flag verified communities due for annual renewal

---

## CI/CD & Quality Verification

Pull requests and pushes to `main` trigger `.github/workflows/ci.yml`, which enforces:

1. `npm audit --audit-level=high`
2. Secret scanning via Gitleaks
3. Prettier formatting & ESLint checks
4. Strict TypeScript compilation (`npm run typecheck`)
5. Full Vitest suite (`npm run test`, covering unit logic, API routes, RBAC, storage safety, PWA offline behavior, and `axe-core` WCAG 2.1 AA checks)
6. Production build (`npm run build`)
