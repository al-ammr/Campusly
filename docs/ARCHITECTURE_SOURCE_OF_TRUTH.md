---
doc_id: D05
title: Architecture and Data Model Source of Truth
file: ARCHITECTURE_SOURCE_OF_TRUTH.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / System Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0, D07@1.0.0]
---

# D05 Architecture and Data Model

Nov 1, 2026 · @Amr Suleiman

## 1. Document control

D05 defines how Campusly is built: the components, the data model, the flows and the operating design. It owns table names, field limits and settings storage. D06 builds endpoints on it, D08 secures it, and D10 uses it to instruct the AI builder.

| Field | Value |
| --- | --- |
| Document | D05 Architecture and Data Model |
| Version | 0.1.0 (first full draft) |
| Phase and gate | P3 Architecture, gate G3 |
| Inputs | D01 PRD, D02, D03, D04, D07 |
| Feeds | D06, D08, D09, D10, D11, D12, D13 |

**Authority.** Business rules come from D07 and are only implemented here. Where this document gives a number (field length, cache time), D05 owns it. Prices, durations and limits stay in the settings register (section 11) so D07 can change them without a deployment.

**ID conventions.** ARC- architecture requirements, DB- data requirements, DEC- decisions, OQ-A open questions. Decisions are logged with the options considered so a later reader can see why a choice was made and reverse it with a new decision, not an edit.

## 2. Goals, constraints and quality attributes

The architecture must be cheap to run, simple enough for two part-time developers, and safe enough to take payment evidence and admin logins. These constraints shape every decision below.

### Constraints

| ID | Constraint | Consequence |
| --- | --- | --- |
| ARC-C1 | Two developers, working remotely, mostly on student schedules | One codebase, one deployment unit, managed services, no servers to patch |
| ARC-C2 | Near-zero running cost at launch (student project, no revenue until Spotlight) | Free or low tiers; design so cost grows only with use |
| ARC-C3 | Users on mid-range Android phones and weak, costly data in Nigeria | Small payloads, server rendering, aggressive caching, offline shell |
| ARC-C4 | No public login (D01) | Anonymous device tokens; admin accounts only |
| ARC-C5 | Payment is manual bank transfer with receipt review (D07) | No card processor in v1; payment data is evidence files only |
| ARC-C6 | Built by an AI builder from a prompt sequence (D10) | Conventional stack, explicit folder layout, strong types, tests the builder can run |
| ARC-C7 | Later expansion to other universities (D01) | Campus is a first-class field on every record from day one |
| ARC-C8 | Nigerian data law and Google programme rules (D09) | Minimal personal data, clear retention, region choice noted as open question |

### Quality attributes, ranked

1. **Security and abuse resistance.** Open submissions, stars and payments invite abuse (D07 BR-200 to BR-217).
2. **Performance on weak networks.** Budgets in D03 section 12.
3. **Correctness of money and ranking rules.** Settings-driven, auditable.
4. **Operability by two people.** Logs, alerts, backups, one-click rollback.
5. **Changeability.** Rules live in settings and one rules module, not scattered through screens.
6. **Cost.** Meets ARC-C2 at launch scale; reviewed each term.

### Sizing assumptions

Proposed for design only, to be replaced by real data after launch: ABU has tens of thousands of students; first-term traffic is a few thousand weekly visitors with peaks around Freshers week and event days; listings number in the hundreds; Spotlight listings are tens. Peak write rate is low (submissions, stars, reports); reads dominate and are cacheable. If real traffic is far above this, the design scales by caching and a larger database tier (section 12) rather than a redesign.

## 3. System context and components

&#91;embedded content: system context and components\]

Visitors reach the app through the CDN cache; admins and the scheduler go straight to it. Only the app talks to the four managed services (ARC-301), so no secret or database key ever reaches a browser. Public pages are cached for about a minute and purged on every status change (section 10).

## 4. Technology stack and decision log

The stack is one TypeScript codebase on managed services. Every choice is *Proposed* until the owner confirms it at gate G3. Pricing and free-tier terms change, so each must be re-checked before launch (OQ-A01); none were verified for this draft.

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript, strict mode | One language front and back; types give the AI builder guard rails |
| Framework | Next.js (App Router) with server rendering | Fast first paint on weak phones, routes match D03, one deployable unit |
| Styling | CSS variables from D04 tokens plus a small utility layer | Tokens map directly; small CSS budget |
| Database | PostgreSQL (managed) | Relational rules, constraints and full-text search in one place |
| Data access | Typed query builder or ORM with migrations | Schema in code, reviewable migrations |
| Validation | Schema validation shared by client and server (Zod) | One definition of every field limit |
| File storage | S3-compatible object storage | Receipts, proofs and images, private by default |
| Cache and rate limits | Managed Redis-compatible store | Atomic counters for D07 caps |
| Admin auth | Email and password with a second factor, session cookies | Few users, strong controls (D08) |
| Email | Transactional email service | Needs-info and receipt notices to organisers who give an email |
| Service worker | Workbox-based, generated at build | Precache shell, runtime caching (section 10) |
| Monitoring | Error tracking plus uptime check plus log drain | Two-person operability |
| Hosting | Managed platform with CDN, preview deployments and rollbacks | No servers to patch; D13 pipeline |

### Decision log

| ID | Decision | Options considered | Reason | Status |
| --- | --- | --- | --- | --- |
| DEC-A01 | Single Next.js app serves pages, API routes and admin | Separate front end and API; static site plus functions | One codebase and deploy for two developers; avoids cross-service auth | Proposed |
| DEC-A02 | PostgreSQL as the only system of record | Document database; spreadsheet back end | Strong constraints and transactions for status and payment rules | Proposed |
| DEC-A03 | Anonymous device token in a first-party cookie plus server-side counters | Browser fingerprinting; phone verification | Matches no-login rule and D07; avoids heavy tracking | Proposed |
| DEC-A04 | Manual bank-transfer payment with receipt review | Card or transfer gateway | D07 BR-140 to BR-152; no processor fees or compliance in v1 | Proposed |
| DEC-A05 | Rules as settings plus one rules module | Constants in code | Owner changes prices and limits without a release | Proposed |
| DEC-A06 | Soft delete and status fields, never hard delete of listings | Hard delete | Audit trail and restore after mistaken removal | Proposed |
| DEC-A07 | Campus id on every record | Single-campus schema | Expansion without migration pain (ARC-C7) | Proposed |
| DEC-A08 | Search with database full-text plus trigram matching | Hosted search service | Enough for hundreds of listings; no extra service to run | Proposed |
| DEC-A09 | Scheduled jobs through the platform scheduler calling protected job endpoints | Always-on worker | No server to run; expiry check cadence from D07 BR-160 to BR-170 | Proposed |
| DEC-A10 | Private storage with short-lived signed links for evidence | Public bucket | Receipts and proofs are sensitive (D08) | Proposed |

**Hosting terms caution.** Some free hosting tiers forbid commercial use. Because Spotlight is paid, the hosting plan must permit commercial use; check the terms before launch and budget for a paid tier if needed (OQ-A01).

## 5. Domain model

&#91;embedded content: domain model, main entities\]

Three records anchor the model: the listing (with its kind-specific details), the Spotlight order (with its payment and receipt), and the anonymous device (which owns stars and reports). Campus and category scope listings. Admins act on listings and Spotlight orders, and every action leaves an audit row. Columns and limits are in section 6; kind details are the community, event and opportunity extras tables.

## 6. Database tables and field limits

All tables use a UUID primary key, `created_at` and `updated_at` in UTC, and a `campus_id` where the record belongs to a campus. Times are stored in UTC and shown in WAT (D07). Limits are *Proposed* and enforced twice: by schema validation and by database constraints (DB-01).

### Core listing tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| campuses | One row per university | id, slug, name, timezone (default Africa/Lagos), active |
| categories | The ten categories and Spotlight's eight | id, slug, name, kind (community or spotlight), icon\_key, sort |
| listings | Shared record for communities, events and opportunities | id, campus\_id, kind, slug, status, category\_id, title, summary, description, image\_id, tracking\_code, device\_id (submitter), contact\_name, contact\_channel, contact\_email (optional), star\_count, report\_count, approved\_at, expires\_at, hidden\_reason, search\_vector |
| community\_meta | Community extras | listing\_id, how\_to\_join, who\_can\_join, meeting\_times, founded\_year, size\_band, verified\_at, verified\_until, last\_activity\_at |
| event\_meta | Event extras | listing\_id, starts\_at, ends\_at, venue, map\_link, register\_link, is\_free |
| opportunity\_meta | Opportunity extras | listing\_id, type, organiser, deadline\_at, is\_rolling, eligibility, apply\_link |
| listing\_links | Outbound links with labels | id, listing\_id, label, url, is\_official |
| attachments | Images, proofs, receipts | id, owner\_type, owner\_id, purpose, storage\_key, mime, bytes, alt\_text, scanned\_at, delete\_after |
| status\_history | Every status change | id, listing\_id, from\_status, to\_status, reason\_code, note, actor\_type, actor\_id, at |

### Public interaction tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| devices | Anonymous device records | id, token\_hash, first\_seen\_at, last\_seen\_at, trust\_score, blocked\_until |
| stars | One row per device per listing | device\_id, listing\_id, created\_at; unique (device\_id, listing\_id) |
| reports | Reports from devices | id, listing\_id, device\_id, reason, note, status, created\_at, resolved\_by |
| info\_replies | Organiser replies to Needs info | id, listing\_id, message, attachment\_id, created\_at |
| announcements | Admin-only notices | id, campus\_id, title, body, pinned, starts\_at, ends\_at, status, created\_by |
| analytics\_events | Privacy-light event log | id, name, device\_hash, route, props, at |

### Spotlight and money tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| spotlight\_listings | A paid business listing | id, campus\_id, reference (SP-XXXX-XXXX), status (7 states), plan, category\_id, business\_name, offer, description, contact, image\_id, starts\_at, ends\_at, paused\_at, renewal\_of, slot\_number |
| spotlight_payments | Payment evidence and confirmation | id, spotlight_id, status (pending, confirmed, underpaid, overpaid, refunded), amount_kobo, amount_received_kobo, receipt_attachment_id, bank_reference, bank_sender_name, bank_narration, admin_note, confirmed_in_bank (bool), confirmed_by, confirmed_at, refunded_at, refund_note |
| spotlight\_waitlist | Featured slot waitlist | id, spotlight\_id, offered\_at, offer\_expires\_at, status |
| bank\_accounts | Where payers send money | id, bank\_name, account\_name, account\_number, active, changed\_by, changed\_at |

Money is stored in kobo as integers. The plan price is read from settings at order time and copied to the payment row so later price changes never alter old orders.

### Admin, settings and audit tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| admins | Admin accounts | id, email, password\_hash, role (reviewer, finance, lead), mfa\_secret\_enc, active, last\_login\_at |
| admin\_sessions | Server-side sessions | id, admin\_id, token\_hash, expires\_at, ip\_hash, user\_agent\_hash |
| settings | D07 settings register | key, value (json), type, description, updated\_by, updated\_at |
| settings\_history | Every settings change | key, old\_value, new\_value, note, changed\_by, at |
| audit\_log | Append-only admin actions | id, admin\_id, action, object\_type, object\_id, before, after, ip\_hash, at |
| job\_runs | Scheduled job record | id, job, started\_at, finished\_at, result, error |

### Field limits (Proposed)

| Field | Limit | Notes |
| --- | --- | --- |
| Title and name | 3 to 100 characters | Trimmed; no all-caps titles over 30 characters |
| Summary | up to 160 characters | Shown on cards |
| Description | up to 3,000 characters | Plain text with line breaks |
| Offer line (Spotlight) | up to 80 characters |  |
| URL | up to 2,048 characters, https only | Checked against the not-allowed list (D08) |
| Contact name | up to 80 characters |  |
| Email | up to 254 characters | Optional for listings; required for Spotlight status notices |
| Alt text | up to 140 characters | Required for informative images |
| Image upload | up to 5 MB; JPG, PNG, WebP; stored as WebP at max 1600 px |  |
| Receipt or proof upload | up to 8 MB; JPG, PNG, PDF | Private storage |
| Report note | up to 300 characters |  |
| Admin note | up to 1,000 characters |  |
| Search query | up to 80 characters |  |

### Constraints, extensions and indexes

- DB-00: PostgreSQL Extensions. Database initialization must explicitly execute:
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
  `CREATE EXTENSION IF NOT EXISTS "pg_trgm";`
  `CREATE EXTENSION IF NOT EXISTS "unaccent";`
- DB-01: Check constraints for status values (the D07 lists), `ends_at` after `starts_at`, positive amounts, and https-only links.
- DB-02: Unique indexes on `tracking_code`, `spotlight_listings.reference`, and `stars(device_id, listing_id)`.
- DB-02b: Slug Collision & Soft-Delete Preservation. To prevent URL hijacking while allowing re-use of legitimate slugs after removal, `listings` uses a partial unique index:
  `CREATE UNIQUE INDEX listings_active_slug_idx ON listings (campus_id, kind, slug) WHERE status != 'Removed';`
  When a listing is transitioned to `Removed`, the application appends `-removed-<timestamp>` to its slug, freeing the original slug for future valid submissions.
- DB-03: Partial index on public listings (`status` in Approved or Verified) by category and date, which serves every list in D03 section 7.
- DB-04: Full-Text and Fuzzy Search. GIN index on `search_vector` generated with `unaccent()` and a trigram index on title (`CREATE INDEX listings_title_trgm_idx ON listings USING gin (title gin_trgm_ops);`) for fault-tolerant search.
- DB-05: Index on `spotlight_listings(status, ends_at)` for the expiry job, and on `listings(status, created_at)` for the review queue.
- DB-06: Foreign keys with restrict on delete for listings; evidence rows removed only by the retention job (section 11).
- DB-07: `star_count` is a maintained counter updated in the same transaction as the star insert; a nightly job recounts and fixes drift.
- DB-08: Row-level security (RLS) policies deny all direct access except the server role, so a leaked key cannot read the tables (D08).

## 7. State machines

D07 owns which transitions are allowed and why; these drawings show how the database enforces them. If a drawing and D07 differ, D07 wins and this section is corrected.

**Listing status** (communities, events and opportunities share it; Verified applies only to communities):

&#91;embedded content: listing status flow\]

**Spotlight lifecycle** (seven states):

&#91;embedded content: Spotlight lifecycle\]

- ARC-701: Every status change goes through one function that checks the allowed transitions, writes a `status_history` row and an audit entry, purges caches and queues any notice, all in one transaction.
- ARC-702: A database check constraint limits `status` to the D07 lists, and a trigger rejects a transition the function would refuse, so a bug elsewhere cannot skip a step.
- ARC-703: Moving to Active needs `confirmed_in_bank` true on the payment row and a Finance or Lead role (D07 BR-140 to BR-152).
- ARC-704: Expiry is by `ends_at` and the scheduled job; a request for an expired listing returns not-available even before the job runs (a query condition), so the public never sees a late expiry.

## 8. Key flows

&#91;embedded content: Spotlight payment flow, 6 steps\]

The payment flow is the only one where a person must act before content goes public, so it is drawn in full (ARC-801: step 5 is the single gate, and the server refuses Activate without `confirmed_in_bank`). The other flows follow the same pattern: validate, write in one transaction, purge caches, then notify.

| Flow | Steps (server side) | Failure behaviour |
| --- | --- | --- |
| Submit a listing | 1 Check device token and submit cap; 2 validate fields and links; 3 check duplicates (hint only); 4 store files after checks; 5 create listing as Pending with a tracking code; 6 write status history; 7 return the code | Any failure leaves nothing half-saved; the form data stays on the device |
| Review | 1 Reviewer opens the item; 2 chooses Approve, Verify, Needs info or Reject with a reason; 3 status function runs (ARC-701); 4 caches purged; 5 notice queued if an email was given | Role check first; a double action returns the current state |
| Star | 1 Check device age and caps; 2 insert the star row (unique); 3 increment the counter and `star_count_reached_at` in the same transaction; 4 return the new count | A duplicate returns the existing state; a refused star reverts in the interface |
| Report | 1 Check cap; 2 insert report; 3 count distinct devices in 7 days; 4 auto-hide at the D07 threshold and add to the review queue | Never reveals the threshold |
| Track | 1 Check lookup cap; 2 find by code; 3 return status, reason and next step only | Neutral message for unknown codes |
| Needs info reply | 1 Check window; 2 store message and file; 3 move to Pending; 4 history row | Expired window returns resubmit guidance |
| Expiry and rotation | Scheduled jobs (section 11) | Idempotent; failure alerts |

Every write path takes an idempotency key from the client for submit and receipt upload, so a retry on a weak connection never creates a duplicate (ARC-802).

## 9. Device identity, rate limiting and abuse prevention

Campusly has no public accounts, so the server recognises a browser by an anonymous device token. D07 sets the limits; this section sets how they are enforced.

### Device token

- ARC-901: On first visit the server issues a random 128-bit token in a first-party, `HttpOnly`, `Secure`, `SameSite=Lax` cookie with a one-year life. Only a hash of the token is stored (`devices.token_hash`).
- ARC-902: The token is not an identity; it is a rate-limit and one-star-per-listing key. It never links to a name, phone or email.
- ARC-903: Clearing cookies creates a new device. D07 therefore adds a 60-second new-device delay before starring (BR-200 to BR-217), a network-level cap per listing, and burst detection, so a cleared cookie does not become a free vote.
- ARC-904: Carrier-Grade NAT (CGNAT) Mitigation. In Nigerian campus environments (MTN, Airtel, Glo, 9mobile, campus Wi-Fi), thousands of devices share the same public IP. Network-level rate limiting must NEVER block entire subnets blindly. Caps for public IP pools are set higher (500 requests/hr/IP) and paired with per-listing burst detection (>30 stars/listing in 2 minutes) and device-token uniqueness checks. A high-traffic IP does not lock out legitimate concurrent users.

### Rate limits

| Limit (values in D07 and settings) | Key | Window |
| --- | --- | --- |
| Submissions per device per day | device | 24 hours |
| Tracking lookups per device per hour | device and network | 1 hour |
| Reports per device per day | device | 24 hours |
| Stars per device per hour | device | 1 hour |
| Stars per listing per network per hour | network and listing | 1 hour |
| Burst: stars on one listing in ten minutes | listing | 10 minutes |
| Admin sign-in attempts | account and network | 15 minutes (D08) |

- ARC-905: Counters live in the fast store with expiry, using atomic increment so concurrent requests cannot slip past a cap. The database remains the source of truth for permanent facts (one star per device per listing).
- ARC-906: Every limit reads its number from settings at request time, so D07 changes take effect without a release.
- ARC-907: A refused request returns a structured result (D06) with a retry time; the interface shows it in plain words (D03 UI-507).

### Abuse controls

| Threat | Control |
| --- | --- |
| Spam submissions | Cap, duplicate detection, honeypot field, minimum fill time, repeat-offence block after rejections (D07 BR-040 to BR-049) |
| Star farming | One star per device per listing, delays, burst detection, discarded stars flagged in the audit log and removed from counts |
| Fake reports (to hide a rival) | Auto-hide needs reports from distinct devices; hidden items go to review, never straight to Removed |
| Malicious links or files | https only, not-allowed list, file type and size checks, image re-encode, receipts and proofs never served publicly |
| Scraping | Moderate rate limit on lists and search; no private data in public responses |
| Payment fraud | Reference matching, Confirmed in bank step, bank-detail change protections (D07 BR-140 to BR-152) |

Detailed attacker scenarios, header and cookie settings and incident response belong to D08.

## 10. Search, ranking, caching and offline strategy

### Search

- ARC-1001: Full-text search over title, summary, description, organiser and category using a stored `search_vector`, weighted title first, then summary, then description. Trigram similarity catches typos and partial words.
- ARC-1002: Only Approved and Verified listings are indexed for public search. Spotlight is searched in its own query and shown in its own group (D03 7.2).
- ARC-1003: Query text is normalised (lower case, accents removed, stop words kept for short queries) and limited to 80 characters.
- ARC-1004: Results paginate by 12 or 24 (D03 UI-322) using a stable cursor so Load more never repeats an item.

### Ranking

Ranking rules come from D07; the implementation sorts in the database.

| List | Sort (D07) |
| --- | --- |
| Communities | star\_count descending; ties broken by the earlier time the count was reached (`star_count_reached_at`); then newest approval |
| Events | starts\_at ascending for upcoming; past events by ends\_at descending |
| Opportunities | closing soon first by deadline ascending; rolling last, with closed ones hidden after the grace period |
| Spotlight | Featured strip slots by rotation (every 6 hours per D07 BR-225 to BR-234); the rest by plan then start date |

- ARC-1010: `listings` keeps `star_count_reached_at`, updated when a star changes the count, to make tie-breaks deterministic.
- ARC-1011: Rotation is a seeded shuffle with a seed that changes at the rotation boundary, so every visitor sees the same order within a window and it can be cached.

### Caching

| Layer | What | Time (Proposed) |
| --- | --- | --- |
| CDN edge | Public list and detail pages | 60 seconds, stale-while-revalidate 10 minutes |
| CDN edge | Static assets and fonts | 1 year, hashed filenames |
| Server | Category counts, home strips | 60 seconds |
| Browser | API reads | Follows edge headers |
| None | Admin pages, tracking lookups, payment status, star writes | Never cached |

- ARC-1020: Next.js App Router Cache Tag Invalidation. Static Server Components use explicit tags:
  - `tag: "listings"` (directory and category lists)
  - `tag: "listing-[slug]"` (individual profile pages)
  - `tag: "spotlight"` (spotlight strip and community ranking)
  - `tag: "categories"` (category listing counts)
  - `tag: "announcements"` (announcements feed)
  Publishing, verifying, hiding, removing, or expiring any listing calls `revalidateTag(tag)` and `revalidatePath(...)`, guaranteeing instant edge updates without stale cache retention.
- ARC-1021: Cached pages never contain device-specific data. Whether a star is already taken is fetched separately after load.

### Offline and the service worker

| Resource | Strategy |
| --- | --- |
| App shell, CSS, JS, fonts, icons | Precache on install, update in the background |
| Public list and detail pages | Network first with fallback to cache; recently viewed pages kept (about 50) |
| Images | Stale-while-revalidate, capped at 60 images or 30 MB |
| Writes (star, submit, report, payment receipt) | Network only, never queued; the interface explains (D03 UI-504) |
| Drafts | Stored on the device in IndexedDB |
| Admin routes | Not cached and not part of the offline experience |

- ARC-1030: A new version shows a small "Update ready" toast and applies on the next navigation, never in the middle of a form.
- ARC-1031: On logout of admin or clearing site data, caches are cleared.
- ARC-1032: The worker never caches responses that carry a device cookie set or an error status.

## 11. Background jobs, storage, email, settings and audit

### Scheduled jobs

Jobs are endpoints protected by a secret and called by the platform scheduler (DEC-A09). Each run writes a `job_runs` row and alerts on failure.

| Job | Cadence (D07) | Does |
| --- | --- | --- |
| expire-spotlight | Every 15 minutes (BR-160) | Moves Active listings past `ends_at` to Expired; purges caches |
| rotate-featured | Every 6 hours (BR-225 to BR-234) | Changes the rotation seed; offers freed slots to the waitlist for 48 hours |
| close-opportunities | Hourly | Hides opportunities past deadline after grace |
| stale-submissions | Daily | Flags Pending items older than the stale limit; closes unanswered Needs info after 7 days |
| unpaid-holds | Daily | Cancels Awaiting payment older than 7 days |
| verification-review | Daily | Lists communities due for review; dead-link check with 14-day grace; inactivity at 12 months |
| retention | Daily | Deletes proofs after 90 days, stars data after 90 days, archived Spotlight after 90 days, expired drafts, old analytics |
| recount | Nightly | Repairs `star_count` and `report_count` drift |
| reconciliation-report | Weekly | Prepares the payment reconciliation for Finance (BR-140 to BR-152) |
| backup-check | Daily | Confirms the latest backup exists and is restorable (section 12) |

Jobs are idempotent: running twice in a row changes nothing the second time (ARC-1101).

### File storage and upload architecture

- ARC-1110: Two object storage buckets: `public-media` (processed listing images, served through CDN edge) and `evidence` (verification proofs and payment receipts, strictly private, accessed only via signed ephemeral URLs expiring in 5 minutes for authenticated admins).
- ARC-1111: Pre-signed Direct Upload Pattern (Serverless Body-Limit Mitigation). To bypass the 4.5MB serverless function payload limit (e.g., Vercel / AWS Lambda), uploads follow a two-step direct presigned flow:
  1. The client requests a signed upload URL via `POST /api/v1/uploads/presign` specifying MIME type, byte size, and purpose (`public-media` or `evidence`).
  2. The server validates size caps (images $\le 5$MB, receipts $\le 8$MB), verifies authorization, and issues an S3/R2 pre-signed PUT URL with a 5-minute expiry and exact Content-Type constraint.
  3. The client uploads directly to object storage via HTTP PUT.
  4. Client-Side Image Pre-Processing: For listing images, the client compresses and resizes the image down to $\le 1600$px WebP prior to upload.
  5. Asynchronous Server Verification: Once uploaded, a background server hook validates magic bytes, strips all EXIF/GPS metadata, and links the storage key to the listing or payment row.
- ARC-1112: PDFs are accepted exclusively for receipts and proofs, stored in `evidence`, and never rendered inline for the public (served with `Content-Disposition: attachment; nosniff`).
- ARC-1113: Storage keys are random UUIDs (`storage_key: <uuid>.<ext>`); original client filenames and paths are completely discarded.

### Email

Email goes only to addresses people give, for status notices (Needs info, Approved, Rejected, Spotlight receipts and expiry). Messages use plain text and a simple template, include the tracking code or reference, and never include links that perform actions. Sending is queued with retries; a failed send never blocks a status change. SPF, DKIM and DMARC are set on the sending domain (D13).

### Settings register

- ARC-1120: The D07 register (about 44 keys) is stored in `settings` with a typed schema; reads go through a cached accessor, and writes require a note and create a `settings_history` row and an audit entry.
- ARC-1121: Bank details sit in `bank_accounts`, not in settings, with extra controls: changes need Lead role plus a second person to confirm, and notify all admins (D07 bank-detail protections, D08).
- ARC-1122: A settings change takes effect within 60 seconds, the cache lifetime of the accessor.

### Audit log

- ARC-1130: Every admin action that changes data writes one `audit_log` row with before and after values, in the same transaction as the change.
- ARC-1131: The table is append-only: the application role has insert and select only, and a database rule rejects updates and deletes.
- ARC-1132: Public actions that matter for disputes (a star discarded, a report auto-hide, a submission rejected) are recorded in `status_history` or the audit log with actor type "system".

## 12. Environments, operations, scaling, open questions and change log

### Environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Developer machines and the AI builder | Seed data, fake receipts |
| Preview | One per pull request | Seed data; no real emails |
| Staging | Full rehearsal before release | Copy of structure plus synthetic data; test email sink |
| Production | Live | Real |

- ARC-1201: Configuration comes from environment variables validated at start-up; the app refuses to boot with a missing or malformed value. Secrets are never committed (D08, D13).
- ARC-1202: Migrations run in the pipeline, are reversible where possible, and are tested against a copy before production (D13).

### Observability

- ARC-1210: Structured logs with a request id, no personal data and no tokens; errors go to the error tracker with the release version.
- ARC-1211: Alerts to both developers for: failed scheduled job, error rate spike, payment or admin sign-in anomalies, queue of overdue reviews, storage nearly full.
- ARC-1212: A public status check and an uptime monitor on Home and the health endpoint.

### Backup and recovery

- ARC-1220: Daily automatic database backups with point-in-time recovery where the plan allows, kept 30 days (Proposed). Storage buckets are versioned or replicated.
- ARC-1221: Recovery targets (Proposed): lose at most 24 hours of data, restore within 8 hours. A restore drill is run before launch and each term (D13).
- ARC-1222: The audit log and payment tables are included in every backup.

### Scaling and expansion

| Pressure | Response |
| --- | --- |
| More readers | Longer edge caching; read replica if needed |
| More images | Image resizing at the edge; lifecycle rules |
| More campuses | `campus_id` scoping, per-campus settings and admins, subdomain or path per campus (OQ-A03) |
| More admins | Roles already defined; add a Campus admin role scoped by `campus_id` |
| Card payments later | A payments adapter behind the D07 payment rules; manual mode stays as fallback |

### Open questions

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-A01 | Hosting plan: does the free tier permit a commercial Spotlight product, and what is the budget? | Amr | Assume a paid hosting tier is needed |
| OQ-A02 | Which region should data live in, given Nigerian data-protection rules and latency? | Amr, D09 | Nearest supported region, reviewed in D09 |
| OQ-A03 | One site with campus paths, or one subdomain per campus? | Amr | Path per campus, `/[campus]/...`; ABU is the default |
| OQ-A04 | Is a second admin required for bank-detail changes in v1? | Amr | Yes (ARC-1121) |
| OQ-A05 | Are email notices needed, or is tracking-by-code enough for v1? | Amr | Optional email, tracking always available |
| OQ-A06 | Analytics provider and whether cookie consent is needed | Amr, D09 | Privacy-light first-party events only |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-01 | First full draft |


