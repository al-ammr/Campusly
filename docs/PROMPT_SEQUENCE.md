---
doc_id: D10
title: Prompt Sequence and Implementation Instructions
file: PROMPT_SEQUENCE.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / System Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0, D02@1.0.0, D03@1.0.0, D04@1.0.0, D05@1.0.0, D06@1.0.0, D07@1.0.0, D08@1.0.0, D09@1.0.0]
---

# D10 Prompt Sequence

Nov 2, 2026 · @Amr Suleiman

## 1. Document control and how to use this sequence

D10 is the set of prompts you paste, in order, into the AI builder to build Campusly from the document suite. Nothing is built from memory or guesswork: each prompt names the documents it must read, the exact outcome, and how to tell it is done. The builder writes code only from these prompts, and only because you ask for it (the planning phase never builds).

| Field | Value |
| --- | --- |
| Document | D10 Prompt Sequence |
| Version | 0.1.0 (first full draft) |
| Phase and gate | P4 Pre-build, gate G4; used in P5 to P8 |
| Inputs | D00 to D09 (D07 rules, D05 data, D06 API, D03 UI, D04 brand, D08 security, D09 legal) |
| Feeds | D11 Audit Prompts (one audit per build prompt), D12 Security Audit, D13 Deployment |

### The loop for every prompt

1. **Start a fresh builder session** for each prompt (or each pair of small prompts) and paste the Master Context (section 2) first. Long sessions drift; fresh sessions with the same context do not.
2. **Paste the prompt** (sections 4 to 6) and attach the documents it lists.
3. **Let it build**, then run the checks the prompt names (type check, lint, tests, build).
4. **Run the audit prompt** from D11 with the same number (for example BP-07 pairs with AU-07). Fix every Blocker and Major finding before moving on.
5. **Run the security check** from D12 listed in the prompt (SA-xx).
6. **Commit** on a branch named `bp-NN-short-name`, with the prompt number in the message, and merge only when checks pass. Record the result in the build log (section 3).
7. **Update documents if reality changed**: a decision made during building becomes a change request (CR) against the owning document, not a silent change in code.

### Roles

| Role | Does |
| --- | --- |
| Amr (product and technical lead) | Chooses the prompt order, answers open questions, approves merges, owns the build log |
| Developer 1 and Developer 2 | Run prompts on separate branches, review each other's work, run the audits, fix findings |
| The AI builder | Writes code and tests from the prompt and the attached documents; never decides business rules |

### Gates in the build (from D00)

G4 before BP-01 (documents signed off, open questions that block the build resolved). G5 after BP-08 (public core works end to end). G6 after BP-13 (all features complete). G7 after BP-16 (release candidate passes D11 and D12). Agile refinement (D14) starts only after G7.

## 2. Master context prompt

Paste this at the start of every builder session, before the numbered prompt. It never changes except by a change request.

```text
You are building Campusly, an installable no-login web app (PWA) that helps students at ABU Zaria discover communities, events and opportunities, with a paid Spotlight section and admin-only Announcements. It is run by GDGOC ABU Zaria. Two developers review your work.

SOURCE OF TRUTH (highest first):
1. D07 Business Rules: statuses, prices, durations, limits, ranking, expiry, verification, payment rules.
2. D08 Security Specification: every SEC- requirement is mandatory.
3. D05 Architecture and Data Model: stack, tables, field limits, jobs.
4. D06 API Contract: endpoints, shapes, errors.
5. D03 UI/UX Specification and D04 Brand Assets: screens, components, tokens, copy rules.
6. D09 Legal and Compliance: notices, consent, public documents.
7. D01 PRD and D02 Wireframes: intent and layout.
If two documents disagree, follow the higher one and report the conflict. Never invent a rule, number, status name, price, limit or copy that a document defines.

STANDING RULES:
- Build only what the current prompt asks. Do not add features, pages or dependencies not listed.
- TypeScript strict. No any. Validate every input on the server with the shared schemas.
- Read prices, durations and limits from the settings register at runtime. Never hardcode them.
- Use design tokens by name. No raw hex values outside the token file.
- No inline HTML from user content. Plain text only, encoded on output. Parameterised queries only.
- Every admin action checks the role on the server, writes an audit row, and uses the status function that enforces allowed transitions.
- Secrets only from environment variables. Never log secrets, tokens, cookies, receipts or personal data.
- Accessibility is a requirement: keyboard, focus ring, 44 px targets, labels, contrast, reduced motion.
- Write tests for new behaviour, including every listed error and role denial.
- Keep changes small and in the folders defined in the scaffold. Do not rewrite files unrelated to the prompt.

HOW TO WORK:
1. Read the attached documents and the current repository before writing code.
2. State a short plan listing files you will create or change.
3. Implement, then run type check, lint, tests and build. Fix failures.
4. Finish with: what was built, files changed, tests added, any document conflict or open question you hit, and anything you did not do.
5. If something is unclear and a document does not answer it, stop and ask rather than guess.
```

**Why the order matters.** Putting rules before the task stops the builder from "improving" the design, and the final report format makes each session easy to audit and to log.

## 3. Prompt format, definition of done and order

Every prompt below has the same parts, so the builder and the reviewers always know what to expect.

| Part | Meaning |
| --- | --- |
| Goal | One sentence of the outcome |
| Read | Documents and sections to attach |
| Prompt | The text to paste after the Master Context |
| Done when | Checks a person can run without reading the code |
| Audit and security | The D11 audit (AU-NN) and D12 checks (SA-NN) to run next |

### Definition of done (every prompt)

- Type check, lint, tests and build all pass on a clean clone.
- New behaviour has tests, including each documented error, rate limit and role denial that applies.
- No new dependency without a reason in the final report and a licence check (D09 LEG-601).
- No secret, token or personal data in code, logs or fixtures.
- Accessibility checks from D03 section 11 pass for any screen touched.
- The final report lists conflicts and open questions, and none are silently resolved.
- D11 audit has no open Blocker or Major finding; the build log is updated.

### Order and dependencies

| Prompt | Builds | Needs first | Gate |
| --- | --- | --- | --- |
| BP-01 | Scaffold, tooling, environment, CI basics | none | G4 |
| BP-02 | Tokens, theme, base components, shell | BP-01 |  |
| BP-03 | Database schema, migrations, seed | BP-01 |  |
| BP-04 | Settings register and rules module, status function | BP-03 |  |
| BP-05 | API framework: envelope, errors, validation, device token, rate limits | BP-03, BP-04 |  |
| BP-06 | Public read API and caching | BP-05 |  |
| BP-07 | Public screens: Home, Search, Explore, lists, details | BP-02, BP-06 |  |
| BP-08 | Submissions, uploads, tracking | BP-05, BP-07 | G5 |
| BP-09 | Stars, reports, sharing, calendar, share images | BP-06, BP-07 |  |
| BP-10 | Admin authentication, sessions, roles, audit log | BP-04, BP-05 |  |
| BP-11 | Admin review console, verification, reports | BP-08, BP-10 |  |
| BP-12 | Spotlight: public flow, payments, admin | BP-05, BP-10 |  |
| BP-13 | Announcements, featured strip, scheduled jobs | BP-11, BP-12 | G6 |
| BP-14 | PWA, offline, install, analytics, settings sheet | BP-07 |  |
| BP-15 | Static and legal pages, accessibility and performance pass | BP-14, D09 texts |  |
| BP-16 | Hardening, headers, backups, release candidate | all | G7 |

BP-02 and BP-03 can run in parallel on two branches, and so can BP-09 with BP-08 and BP-12 with BP-11 once their dependencies are merged.

### Build log (one row per run)

Keep a table in the repository (`docs/build-log.md`) with: date, prompt, branch, developer, builder session, audit result, security result, merged (yes or no), notes and any CR raised.

## 4. Prompts BP-01 to BP-05: foundations

### BP-01 Scaffold and tooling

**Goal:** an empty but correct project that every later prompt builds on. **Read:** D05 sections 2, 4 and 12; D08 section 8 (SEC-420 to SEC-426, SEC-620 to SEC-626); D13 when available.

```text
Create the Campusly project as described in D05: one TypeScript (strict) Next.js App Router app, PostgreSQL access with migrations, shared schema validation, and a test runner.
Do the following and nothing else:
1. Folder layout: app/ (routes), app/api/v1/ (endpoints), lib/ (rules, settings, db, auth, validation, storage, jobs), components/, styles/, tests/, docs/, scripts/.
2. Environment: a validated env module that refuses to start with a missing or malformed variable; .env.example with names only, no values; mark which variables are server-only and fail the build if one appears in client code.
3. Tooling: type check, lint, format, unit and integration test commands, a pre-commit hook, and a CI workflow that runs them plus a dependency audit and secret scan on every pull request.
4. A health endpoint GET /api/v1/health returning status, build id and time, with a test.
5. docs/build-log.md with the table header from D10.
Do not create any feature pages, tables or styling.
```

**Done when:** a fresh clone installs, builds and passes CI; starting without a variable fails with a clear message. **Audit and security:** AU-01, SA-01.

### BP-02 Tokens, theme, base components and shell

**Goal:** the visual foundation. **Read:** D04 sections 5 to 7; D03 sections 3 to 6 and 11.

```text
Implement the Campusly design system.
1. Create tokens.json and generate tokens.css with the light values on :root and the dark values under [data-theme=dark] and prefers-color-scheme, exactly as D04 and D03 section 3 define them. Include spacing, radius, elevation, motion, breakpoints and z-index.
2. Apply the theme before first paint, with Light, Dark and System choices remembered on the device.
3. Self-host Plus Jakarta Sans and Inter as WOFF2 Latin subsets with font-display swap, under the font budget in D04 TYP-01.
4. Build the base components from D03 sections 5 and 6: Button variants, Text field, Textarea, Select, Checkbox, Radio, Switch, File upload field, Search field, Chip, Badge set, Card shell, Bottom sheet, Dialog, Toast, Banner, Skeleton, Empty and Error states. Each with the states and accessibility rules in D03, and each documented on a /dev/components page that is excluded from production.
5. Build the app shell: top bar, bottom tab bar (5 tabs, D03 section 4), footer, skip link, safe areas, More menu. Routes may render placeholder content.
No business logic, no data fetching. Add tests for focus management in Sheet and Dialog and for keyboard operation of every control.
```

**Done when:** the components page renders in both themes at 320 px and at 200 percent text with no horizontal scrolling; keyboard-only operation works; contrast matches D04. **Audit and security:** AU-02.

### BP-03 Database

**Goal:** the schema exactly as designed. **Read:** D05 sections 5, 6, 7 and 11; D07 status lists.

```text
Implement the database from D05 section 6.
1. PostgreSQL Extensions: initialize `uuid-ossp`, `pg_trgm`, and `unaccent` extensions.
2. Migrations for every table, column, type, constraint and index listed, including campus_id, check constraints for the D07 status values, unique indexes (tracking_code, spotlight reference, star per device per listing), partial active-slug index (`WHERE status != 'Removed'`), the partial public-listing index, the full-text GIN index with unaccent and trigram indexes on title, and soft-delete behaviour.
3. Spotlight payment schema enhancement: include `status` (`pending`, `confirmed`, `underpaid`, `overpaid`, `refunded`), `amount_received_kobo`, `bank_sender_name`, `bank_narration`, and `admin_note`.
4. Database rules from D05 and D08: audit_log append-only for the application role; a trigger that rejects status transitions the status function would refuse; a check that a Spotlight listing cannot be Active without a confirmed payment row; restricted roles (app role cannot alter schema).
5. Prisma / PostgreSQL client singleton (lib/db.ts) with connection pooling, transaction wrapper helper, query logging in development, and graceful shutdown.
6. A seed script with fake data only: one campus (ABU Zaria), the ten categories and the eight Spotlight categories from D07, and sample listings in every status. Seed data must be obviously fake and contain no real people or accounts.
7. Migration tests that apply from empty, roll back where possible, and verify each constraint rejects bad data.
Do not write endpoints or screens.
```

**Done when:** migrations apply cleanly twice from empty; every constraint has a failing test; seed loads. **Audit and security:** AU-03, SA-02.

### BP-04 Settings and rules module

**Goal:** one place for every business rule. **Read:** D07 (all, especially the settings register and statuses), D05 sections 7 and 11.

```text
Implement the settings register and rules module.
1. A typed settings store for every key in the D07 register with default values from D07, descriptions, types and ranges; a cached accessor refreshing within 60 seconds; a settings_history row and audit entry on every change (writes need a note).
2. A rules module (lib/rules) with pure, tested functions for: public visibility by status, closing soon, event versus opportunity classification, rolling-opportunity review dates, tracking-code and reference generation (random, not sequential, per D08 SEC-130), star ranking order and tie-break, featured-strip rotation seed, Spotlight expiry, renewal window, refund window, active-listing cap, and report auto-hide.
3. The status function: the only code allowed to change a listing or Spotlight status. It enforces the allowed transitions in D05 section 7 and D07, writes status_history and audit_log in one transaction, and returns the new status object. Include every transition and every refusal in tests.
No prices, durations or limits may be hardcoded anywhere. Write tests that fail if a number from D07 appears as a literal outside the defaults file.
```

**Done when:** the rule tests cover every D07 BR in scope with its ID in the test name. **Audit and security:** AU-04, SA-03.

### BP-05 API framework, device identity and rate limits

**Goal:** the shared machinery all endpoints use. **Read:** D06 sections 2, 3, 9; D05 section 9; D08 sections 4 and 5.

```text
Build the API framework.
1. Response envelope, error catalogue and request id exactly as D06 sections 2 and 9; a single handler wrapper that validates input with shared schemas, rejects unknown fields on writes, enforces body size limits and timeouts, and never leaks stack traces.
2. Device identity: issue the campusly_device cookie (HttpOnly, Secure, SameSite=Lax, one year, 128-bit random), store only a hash, create the devices record, and expose a device context to handlers.
3. Rate limiting with atomic counters in the fast store and fallback behaviour if it is down (fail closed for writes, open for reads). Limits are read from settings. Return rate_limited with retry_after and the headers in D06.
4. Anti-forgery checks for browser writes (custom header plus Origin check), Idempotency-Key handling with 24-hour memory, and the security headers and CSP from D08 section 5, with CSP in report-only mode first.
5. Structured logging with request id and no personal data; a hashed network key helper.
6. Transactional email service foundation (lib/email.ts) per D05 section 11: pluggable provider interface (mock/console logger in dev/test, SMTP/Resend in prod), plain-text and minimal HTML templates (tracking code and reference included, zero actionable links per SEC-414), queued asynchronous dispatch that never blocks a status change or HTTP response.
Write tests for each error code, each header, cookie attributes, email mock dispatch, and a concurrency test proving a cap cannot be exceeded by parallel requests.
```

**Done when:** a throwaway test endpoint demonstrates every behaviour; no raw IP is stored or logged. **Audit and security:** AU-05, SA-04.

## 5. Prompts BP-06 to BP-10: public core and admin access

### BP-06 Public read API and caching

**Goal:** every public GET endpoint. **Read:** D06 section 4; D05 section 10; D07 BR-001 to BR-008, BR-225 to BR-234.

```text
Implement API-101 to API-118 from D06 section 4.
1. Query code for each endpoint returning only Approved and Verified listings and Active Spotlight items. A hidden, removed, expired or unknown item returns the same not_available response.
2. Search per D05 section 10: weighted full-text plus trigram typo tolerance, normalised input, 80-character limit, stable signed cursors, Spotlight results returned as a separate group.
3. Sorting and ranking exactly as D07 and D05 define, including the star tie-break and the featured-strip rotation seed.
4. Cache headers, ETag and conditional requests as D06; cache purge hooks called by the status function.
5. /me/state returns starred ids for the device and is never cached.
Test: visibility by status, every query parameter, pagination without repeats, cache headers, absence of private fields (emails, device ids, notes, evidence) in every response.
```

**Done when:** a contract test per endpoint passes against the seed data and no response contains a private field. **Audit and security:** AU-06, SA-05.

### BP-07 Public screens

**Goal:** the visible app. **Read:** D03 sections 4, 7, 9, 10 and 11; D02 public screens; D04 sections 7 and 8.

```text
Build the public screens from D03 section 7 using the components from BP-02 and the read API from BP-06: Home (7.1), Search (7.2), Explore and category pages (7.3), Community profile (7.4), Events list and detail (7.5), Opportunities list and detail (7.6), Spotlight list and detail (7.7), Announcements (7.8).
- Use server rendering for first paint and the data states in D03 section 9 (loading skeleton, empty, error, offline, not available).
- Keep filters, sort and search in the URL; restore scroll; use Load more, not infinite scroll.
- Every Spotlight card and page shows the Paid listing label rendered by the app; Spotlight never shows Verified or a star control.
- All copy comes from a single strings file keyed by ID; figures from settings via /config.
- Meet the budgets in D03 section 12 on the home page and a listing detail.
Do not build forms, starring, reporting or admin yet. Add component and accessibility tests for each screen.
```

**Done when:** a person can find any seeded listing within three taps; Lighthouse accessibility has no serious issues; budgets measured and recorded. **Audit and security:** AU-07, SA-06.

### BP-08 Submissions, uploads and tracking

**Goal:** organisers can submit and track. **Read:** D06 section 5 (API-201 to API-205, API-220 to API-225); D03 section 8.1 and 8.2; D07 BR-010 to BR-049; D08 section 4.

```text
Build the submission, upload and tracking features.
1. Endpoints API-201 to API-205 with the honeypot, minimum fill time, submit cap, duplicate hints, blocked-repeat rule, and tracking-code generation.
2. Upload pipeline per D05 ARC-1111, D06 API-202b and D08 SEC-220 to SEC-228: implement pre-signed direct S3/R2 upload endpoint (`POST /api/v1/uploads/presign`) to bypass serverless body limits, type validation by magic bytes, client-side WebP compression, private evidence storage with random keys, and uploads bound to the device.
3. The guided /submit flow and the /track screen exactly as D03 8.1 and 8.2, with device-side drafts for 7 days and the success screen showing the tracking code with Copy and Share.
4. Needs info reply flow inside the D07 window, including tokenized reply link generator and submission status emails (received, needs info, approved, rejected) dispatched via lib/email.ts if an optional email was provided.
Test: every error in D06, caps, duplicate hints, hostile files (wrong type, disguised script, oversize, corrupt image), link scheme rules, plain-text storage, and that no half-saved record exists after a failure.
```

**Done when:** an end-to-end submit, track and reply works on a phone-sized viewport; hostile files are rejected; nothing from an upload is publicly reachable. **Audit and security:** AU-08, SA-07. **Gate G5** after this prompt: the public core works end to end.

### BP-09 Stars, reports, sharing and calendar

**Goal:** the interactions. **Read:** D06 API-206 to API-208, API-110, API-502; D03 sections 5 (star) and 9; D07 BR-200 to BR-217, BR-040 to BR-049; D04 SHR-01 to SHR-05.

```text
Build stars, reports, sharing and calendar.
1. Star endpoint: unique star per device per listing, device age delay, per-device and per-network caps, burst detection, atomic counter update with star_count_reached_at, optimistic interface with revert, no unstar, never on Spotlight or Announcements. Identical response shape whether or not a limit was near.
2. Report endpoints and sheet with distinct-device auto-hide per D07 and the review-queue hook; never reveal thresholds.
3. Native share with Copy link fallback; dynamic OpenGraph and Twitter card social preview generator (/api/v1/og/listing/[id]) using @vercel/og (Edge runtime / Satori) rendering Tuscan Academic Heritage tokens per D04 SHR-01 to SHR-05 with s-maxage=86400 caching and 404 for non-public items; .ics calendar export for events.
4. The star explanation notice from D09 LEG-211.
Test: concurrent stars, cleared-cookie farming, bursts, report thresholds, share image for non-public item returns 404, ics content for a sample event.
```

**Done when:** farming scenarios from D08 SEC-501 to SEC-509 are blocked in tests. **Audit and security:** AU-09, SA-08.

### BP-10 Admin authentication, roles and audit

**Goal:** the secure door to the admin console. **Read:** D08 section 3 (SEC-101 to SEC-146); D06 API-401 to API-405, API-460, API-461; D07 BR-260 to BR-265.

```text
Build admin access.
1. Admin accounts created only by invitation by a Lead; Argon2id or scrypt hashing; password rules and breached-password check; mandatory authenticator-app second factor with ten recovery codes; lockout and identical responses; server-side sessions with hashed identifiers, idle and absolute timeouts, rotation on login and privilege change; __Host- cookie attributes; re-authentication for sensitive actions.
2. Role model Reviewer, Finance, Lead with the permission matrix in D08 section 3, deny by default, checked at endpoint and data layer. Nobody can change their own role or remove the last Lead.
3. Audit log writing helper used by every later admin action, and the read-only audit endpoint and screen.
4. Admin layout (distinct top bar, role display, sign-out, session warning) from D03 section 6 and 8.5; admin routes excluded from the service worker and search engines.
5. Admin security alerts per D08 SEC-111 & SEC-122: email alerts on sign-in from unrecognised networks, 2FA recovery codes generated, account lockouts after 5 failed attempts, and proposed/confirmed bank account details change with two-Lead verification.
Test: lockout, enumeration resistance, session expiry, privilege escalation attempts, role matrix with allowed and denied cases for every existing admin endpoint.
```

**Done when:** every role-denial test passes and an account cannot be reached without the second factor. **Audit and security:** AU-10, SA-09.

## 6. Prompts BP-11 to BP-16: admin, Spotlight, jobs, PWA and release

### BP-11 Admin review console

**Goal:** reviewers can run the queue. **Read:** D06 API-410 to API-417, API-440 to API-451; D03 sections 6 and 8.5; D07 BR-010 to BR-049, BR-030 to BR-038, BR-260 to BR-265.

```text
Build the admin review console.
1. Review queue with filters and overdue markers from settings; detail panel with all fields, duplicate hints, history and attachments through 5-minute signed links.
2. Decision bar: Approve, Verify (communities only), Needs info, Reject with the D07 reason list; hide, restore, remove with required reasons; all through the status function from BP-04, writing audit rows and purging caches.
3. Reports queue and resolution; verification review and renewal list; admin edit-on-behalf with a note and the SEC-143 second-approver rule.
4. Settings editor (Lead only) with notes and history; users and roles screen (Lead only).
5. Preview of what the public will see before confirming an action (D03 UI-326).
Test: every decision and its refusal, each role on each endpoint, overdue calculation, reasons required, audit rows present, and that a Reviewer cannot touch payments or settings.
```

**Done when:** a listing submitted in BP-08 can be reviewed, requested for info, answered and approved, and appears publicly. **Audit and security:** AU-11, SA-10.

### BP-12 Spotlight: public flow, payments and admin

**Goal:** the paid product end to end. **Read:** D07 BR-100 to BR-170; D06 section 6 and API-420 to API-429; D03 7.7, 8.3, 8.4; D08 SEC-510 to SEC-534; D09 section 5.

```text
Build Spotlight.
1. Public: plans, order creation (cap check, not-allowed check, terms acceptance stored with version), bank details shown only on the order screens, receipt upload, status lookup by reference, renew, cancel, waitlist. Amounts copied from settings into the order at creation.
2. Admin: Spotlight queue with receipts, payment panel, Activate only with Confirmed in bank ticked and a bank reference (unique), mismatch blocking, reject, pause, resume, extend, refund inside the window with the second-approver rule above the setting, strip and waitlist management, reconciliation export.
3. Bank details table with the two-Lead confirmation, notifications and 7-day warning from D08 SEC-120 to SEC-124.
4. Public Spotlight pages already built in BP-07 now read real orders; the Paid listing label is rendered by the app for every item.
5. Spotlight transactional email notifications via lib/email.ts: receipt received confirmation, payment confirmed & listing live notification, underpaid/overpaid notice with instructions, and 24-hour expiry reminder with renewal link.
Test: money in kobo, price changes do not alter open orders, activation without confirmation fails, duplicate bank reference refused, unknown reference gives no existence signal, lifecycle transitions and refusals, role matrix for Finance and Lead.
```

**Done when:** a test order moves from Awaiting payment to Active only through the admin path and expires on schedule. **Audit and security:** AU-12, SA-11.

### BP-13 Announcements, featured strip and scheduled jobs

**Goal:** content that changes on its own. **Read:** D07 BR-225 to BR-234, BR-250 to BR-255, BR-160 to BR-170; D05 section 11; D06 API-430, API-431, API-510 to API-519.

```text
Build announcements, the featured strip and all scheduled jobs.
1. Announcements: admin create, edit, pin, unpin, expire, delete, with preview; public list, detail and home banner (dismissible per device); admin-only styling distinct from ads.
2. Featured strip: slot cap and rotation from settings, waitlist offers for 48 hours, freed-slot handling.
3. Jobs as protected endpoints (job secret, constant-time compare, not callable from browsers): expire-spotlight, rotate-featured, close-opportunities, stale-submissions, unpaid-holds, verification-review, retention, recount, reconciliation-report, backup-check. Each is idempotent, writes job_runs, alerts on failure, and takes its cadence from D07.
4. Query conditions so expired items are never public even before a job runs.
Test: running every job twice changes nothing the second time; time-travel tests for each boundary (expiry, windows, retention).
```

**Done when:** all jobs run on a staging scheduler and the job run table shows them. **Audit and security:** AU-13, SA-12. **Gate G6** after this prompt: all features complete.

### BP-14 PWA, offline, install and analytics

**Goal:** the installable, offline-capable app with admin metrics. **Read:** D05 section 10; D03 sections 8.5, 9 and 12; D04 PWA-01 to PWA-08; D09 section 4; D01 FR-252, FR-390 to FR-399, FR-430 to FR-437.

```text
Build the PWA features and Admin Metrics Dashboard.
1. Web manifest and icon set per D04 including the maskable icon; theme colours for light and dark.
2. Service worker: precache the shell, network-first with cache fallback for public pages (about 50 kept), stale-while-revalidate for images with caps, no caching of admin, API writes or responses with Set-Cookie; update toast applied on next navigation; caches cleared on admin sign-out.
3. Offline banner and offline screen; writes disabled with explanation; drafts in IndexedDB.
4. Install prompt after the second visit and a useful action, at most twice per device, with the iOS instruction card.
5. First-party analytics with the allowed event names only, batched, no free text; footer Settings sheet to turn analytics off and clear local data (D09 LEG-210).
6. Admin Metrics Dashboard (/admin/metrics, API-452) fulfilling PRD FR-252, FR-430 to FR-437, US-052: live summary cards (active communities, events, opportunities, spotlight kobo revenue, pending reviews, open reports); date-range filter (7d, 30d, 90d, custom); top zero-result search queries table (FR-435) to identify unmet campus interests; participation funnel (distinct devices tapping Join or Apply); mobile Web Vitals distribution (LCP, INP, CLS); one-click CSV export of metrics data.
Test: offline navigation of visited pages, update flow, cache exclusions, analytics opt-out, install prompt rules, metrics calculations, CSV export content, zero-result search aggregation.
```

**Done when:** a visited page opens in airplane mode, an installed app passes Lighthouse PWA checks, and /admin/metrics displays live and event metrics with working CSV export. **Audit and security:** AU-14, SA-13.

### BP-15 Static and legal pages, SEO, accessibility and performance

**Goal:** finish discovery, content and meet the quality bars. **Read:** D03 sections 7.9, 11 and 12; D09 section 7; D04 section 7; D06 API-503, API-504; D08 SEC-543.

```text
Build the static pages, search engine discovery, and run the quality pass.
1. About, Contact (with data, legal and takedown request routes), Terms, Privacy, Cookie notice, Content Standards, Spotlight Terms, Licences (generated from dependencies), Accessibility statement, Not found, Offline, Maintenance and Error screens. Legal text is loaded from versioned content files supplied by counsel; use clearly marked placeholders until they exist.
2. Search engine discovery and crawler governance per API-503, API-504, and D08 SEC-543: dynamically generated sitemap (app/sitemap.ts -> /sitemap.xml) indexing all Approved and Verified public communities, events, opportunities, and categories; crawler rules (app/robots.ts -> /robots.txt) allowing public indexation while strictly disallowing /admin and /api routes; X-Robots-Tag: noindex header enforced on all admin routes.
3. Record the accepted terms version on submissions and orders.
4. Accessibility pass against D03 section 11 on every route in both themes at 320 px and 200 percent text; fix findings.
5. Performance pass against D03 section 12; fix findings; record measurements in the build log.
Do not invent legal wording. Do not weaken any security header to fix a visual issue.
```

**Done when:** axe and Lighthouse report no serious issues; sitemap.xml and robots.txt serve valid content excluding admin routes; budgets are met or each miss is a logged finding. **Audit and security:** AU-15, SA-14.

### BP-16 Hardening and release candidate

**Goal:** a releasable build. **Read:** D08 (all), D13 when available, D05 section 12.

```text
Harden and prepare release.
1. Switch CSP from report-only to enforcing after fixing violations; verify every header in D08 section 5 on public, admin and error responses.
2. Remove or protect every development-only route and seed; confirm no source maps, secrets or debug output in production.
3. Maintenance mode switch, backup and restore scripts, health and uptime checks, alert rules from D05 ARC-1211, and the rotation runbook for the job secret and session keys.
4. Run the full test suite, the full D11 audit set and the D12 security audit; fix every Blocker and Major finding; list anything deferred with an owner.
5. Produce docs/release-notes.md listing what is included, known gaps and the checklist state from D09 section 9.
Do not add features.
```

**Done when:** D11 and D12 show no open Blocker or Major finding and a restore drill is recorded. **Audit and security:** AU-16, SA-15. **Gate G7** after this prompt.

## 7. Recovery prompts and change control

Paste the Master Context first in every case. Replace the angle-bracket parts.

| Situation | Prompt |
| --- | --- |
| Builder added things not asked for | `Your last change included <items> that BP-<NN> did not ask for. Remove them, keep only what the prompt lists, and report what you removed. Do not rewrite other files.` |
| A test fails and the builder weakened the test | `Do not change the test to make it pass. The test encodes <doc ID>. Fix the code so the test passes, and explain the cause.` |
| Two documents disagree | `D<A> says <X> and D<B> says <Y>. Follow the higher document in the source-of-truth order, do not choose silently, and write a conflict note I can raise as a change request.` |
| Context lost or session restarted | `Read the repository and docs/build-log.md. Summarise what exists, what BP-<NN> still needs, and the files involved. Do not change code until I confirm the summary.` |
| Audit finding to fix | `Fix finding <ID> from the audit: <paste finding>. Change only what is needed, add a test that would have caught it, and list files changed.` |
| Security finding to fix | `Security finding <SA-ID>: <paste>. Fix at the root cause, add a regression test, and check for the same pattern elsewhere in the repository and list what you found.` |
| Builder invented a number or rule | `You used <value> for <thing>. D07 defines this as a setting. Replace the literal with the settings accessor and add a test that fails if the literal returns.` |
| Dependency added without a reason | `Remove <package> or justify it: purpose, size, maintenance, licence. Prefer the platform feature or an existing dependency.` |
| Performance budget missed | `The <screen> misses <budget>. Measure, identify the biggest contributors, and propose three fixes ranked by effect and risk before changing code.` |

### Change control during the build

- CC-01: Code never changes a rule, price, limit, status name, copy or field limit that a document owns. The owning document changes first through a change request (CR), then the code follows.
- CC-02: A CR records: ID, date, requester, document and section, change, reason, impact on other documents and prompts, decision and version bump.
- CC-03: When a CR affects a prompt already run, the affected prompt is rerun on a new branch, not patched by hand, so the audit stays meaningful.
- CC-04: Prompts themselves change only by CR. The version of D10 used for each run is written in the build log.
- CC-05: Never paste secrets, real receipts or real personal data into the builder. Use the seed data.

## 8. Traceability, open questions and change log

### Prompt to requirement coverage

| Prompt | D01 FR ranges | Main sources |
| --- | --- | --- |
| BP-01 | NFR build and quality items | D05, D08, D13 |
| BP-02 | FR-001 to FR-016 (shell) | D03, D04 |
| BP-03, BP-04 | Data and rules behind all FRs | D05, D07 |
| BP-05 | NFR security and performance items | D06, D08 |
| BP-06, BP-07 | FR-020 to FR-149, FR-280 to FR-311 (reading), FR-370 to FR-380 (reading), FR-410 to FR-418 | D03, D06 |
| BP-08 | FR-195 to FR-214 | D06, D07, D08 |
| BP-09 | FR-160 to FR-189 | D06, D07 |
| BP-10, BP-11 | FR-230 to FR-260 | D06, D07, D08 |
| BP-12 | FR-280 to FR-346 | D06, D07, D08, D09 |
| BP-13 | FR-330 to FR-346, FR-370 to FR-380 | D05, D07 |
| BP-14 | FR-390 to FR-399, FR-430 to FR-437 | D03, D04, D05, D09 |
| BP-15 | FR-410 to FR-418, accessibility NFRs | D03, D09 |
| BP-16 | NFR security, availability and recovery items | D05, D08, D13 |

The D11 audit (AU-00 coverage check) confirms every FR in D01 is built by at least one prompt and flags any that is not.

### Open questions

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-PS1 | Which AI builder and model will run the prompts? Prompts are written tool-neutral | Amr | Any capable coding agent; the Master Context is the only tool-specific part |
| OQ-PS2 | Should each prompt run in a separate repository branch and pull request? | Developers | Yes, one branch and one pull request per prompt |
| OQ-PS3 | Is a staging environment available before BP-13 so scheduled jobs can be tested? | Developers | Yes, required for G6 |
| OQ-PS4 | Who writes the final legal texts before BP-15? | Amr, counsel | Placeholders until supplied |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-02 | First full draft: master context, 16 prompts, recovery prompts, change control |


