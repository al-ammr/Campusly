---
doc_id: D06
title: API Contract and Endpoint Specifications
file: API_CONTRACT.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / API Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D02@1.0.0, D05@1.0.0, D07@1.0.0]
---

# D06 API Contract

Nov 1, 2026 · @Amr Suleiman

## 1. Document control

D06 is the contract between the app's screens and its server: every endpoint, request, response and error. The AI builder implements it as written, the audit (D11) tests against it, and a mismatch is a defect in the code or in this document, never silently tolerated.

| Field | Value |
| --- | --- |
| Document | D06 API Contract |
| Version | 0.1.0 (first full draft) |
| Phase and gate | P3 Architecture, gate G3 |
| Inputs | D01 PRD, D03 UI/UX, D05 Architecture and Data Model, D07 Business Rules |
| Feeds | D08 Security, D10 Prompt Sequence, D11 Audit, D12 Security Audit |

**Authority.** Table and field names and limits come from D05; rules, limits and status names come from D07 and are never restated as numbers here (the API returns them from settings where the client needs them). Security controls (headers, cookies, lockout) are owned by D08 and referenced here by name.

**ID convention.** Endpoints are numbered API-1xx (public read), API-2xx (public write), API-3xx (Spotlight), API-4xx (admin), API-5xx (system). Examples use `curl`-neutral JSON and are illustrative, not data.

**Style of requirement.** "Must" is tested by contract tests; "should" is a default that a logged decision may change.

## 2. API principles

| ID | Principle | Rule |
| --- | --- | --- |
| API-001 | Base path and version | All endpoints live under `/api/v1`. A breaking change adds `/api/v2`; v1 keeps working for one full term after v2 ships |
| API-002 | Format | JSON in and out, UTF-8, `Content-Type: application/json`; file uploads use `multipart/form-data` |
| API-003 | Naming | Plural nouns, lower-case, hyphens in paths; fields in `snake_case` matching D05 columns |
| API-004 | Methods | GET reads, POST creates or acts, PATCH changes part of a record, DELETE only where D05 allows (rarely; most removals are status changes) |
| API-005 | Time | ISO 8601 in UTC with `Z` (for example `2026-11-14T15:00:00Z`); the client shows WAT. Server rules use WAT boundaries (D07) |
| API-006 | Money | Integer kobo plus a `currency` of `NGN`; the client formats as ₦ |
| API-007 | IDs | UUIDs for records, `slug` for public pages, `tracking_code` (CY-XXXX-XXXX) and `reference` (SP-XXXX-XXXX) for lookups |
| API-008 | Pagination | Cursor based: `?limit=12&cursor=...`; response has `next_cursor` (null at the end) and `total` where cheap |
| API-009 | Sorting and filtering | Whitelisted query parameters only; unknown ones are ignored and listed in a `warnings` array in development only |
| API-010 | Idempotency | POSTs that create (submit, receipt upload, Spotlight order) require an `Idempotency-Key` header; a repeat within 24 hours returns the first result |
| API-011 | No data leakage | Public responses never include contact emails, device ids, internal notes, evidence, or admin fields |
| API-012 | Validation | Request bodies are validated with the same schemas as the client; failures return code `validation_failed` with a per-field list |
| API-013 | Unknown fields | Rejected on writes (to stop mass assignment), ignored on reads by clients |
| API-014 | Content language | English; error `message` is plain text meant for the interface, `code` is the stable key |

### Authentication modes

| Mode | Used by | How |
| --- | --- | --- |
| Anonymous device | Public endpoints | First-party cookie `campusly_device` issued on first request (D05 ARC-901); never sent to third parties |
| Admin session | `/api/v1/admin/*` | Session cookie after sign-in with a second factor; role checked per endpoint (D08, D07 BR-260 to BR-265) |
| Job secret | `/api/v1/jobs/*` | Secret bearer token from the scheduler, compared in constant time; not callable from browsers |

Every write that changes state from a browser also requires an anti-forgery check (a same-site header and an origin check; details in D08).

### Standard response envelope

Success: `{ "data": ..., "meta": { ... } }`. Lists add `next_cursor` and `total`. Errors: `{ "error": { "code", "message", "fields"?, "retry_after"?, "request_id" } }`. The `request_id` is also a response header and appears in logs (D05 ARC-1210).

### Caching and headers

Public GETs return `Cache-Control` per D05 section 10 and an `ETag`; conditional requests return 304. Writes and admin responses send `Cache-Control: no-store`. Rate-limit state is returned as `RateLimit-Remaining` and `Retry-After` headers where relevant.

## 3. Common objects

Fields below are the public shapes. A field marked "owner" is returned only to the person who holds the tracking code, and "admin" only to admin sessions. Types: `uuid`, `string`, `int`, `bool`, `datetime` (ISO UTC), `url`, `enum`.

### ListingSummary (used in lists, cards and search)

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid |  |
| kind | enum | `community`, `event`, `opportunity` |
| slug | string | Used in the public URL |
| title | string | up to 100 characters (D05) |
| summary | string | up to 160 characters |
| category | object | `{ id, slug, name }` |
| image | object or null | `{ url, alt, width, height }` |
| status | enum | Public responses only ever show `approved` or `verified`; owner and admin see all D07 statuses |
| verified | bool | True only for Verified communities |
| star\_count | int | Communities only |
| starts\_at, ends\_at | datetime | Events only |
| deadline\_at, is\_rolling | datetime, bool | Opportunities only |
| closing\_soon | bool | Computed by the server from the D07 setting |
| community | object or null | `{ id, slug, name }` for events and opportunities that belong to one |

### ListingDetail (adds to ListingSummary)

| Field | Type | Notes |
| --- | --- | --- |
| description | string | Plain text with line breaks |
| links | array | `{ label, url, is_official }`, https only |
| contact | object | `{ name, channels[] }`; email is never public unless the organiser marked it public |
| details | object | Kind-specific: community (how\_to\_join, who\_can\_join, meeting\_times, founded\_year, size\_band), event (venue, map\_link, register\_link, is\_free), opportunity (type, organiser, eligibility, apply\_link) |
| related | array | Up to 6 ListingSummary |
| starred\_by\_me | bool | Fetched with the device cookie, never cached |
| updated\_at | datetime |  |

### SpotlightItem

| Field | Type | Notes |
| --- | --- | --- |
| id, slug | uuid, string |  |
| business\_name, offer, description | string | Limits in D05 |
| category | object | One of the 8 Spotlight categories |
| plan | enum | `standard` or `featured` (names and prices come from settings) |
| paid\_label | string | Always `Paid listing`; the client must render it |
| image, contact, links, location | objects | As for listings |
| starts\_at, ends\_at | datetime |  |
| rank\_group | enum | `featured_strip`, `ranked`, used by clients for layout only |

Spotlight items have no `star_count` and no `verified` field.

### Announcement

Fields: `id`, `title`, `body` (plain text with line breaks and optional image), `image`, `pinned`, `published_at`.

### Status objects (owner and admin only)

| Field | Type | Notes |
| --- | --- | --- |
| status | enum | D07 listing or Spotlight status name in snake case |
| label | string | Text from the copy file (D03 section 10) |
| next\_step | string | Text with settings values filled in |
| reason | object or null | `{ code, text }` from the D07 reason list for Rejected and Needs info |
| changed\_at | datetime |  |
| reply\_until | datetime or null | End of the Needs info window |

### Page and Error

`Page`: `{ data: [..], next_cursor, total? }`. `Error`: `{ code, message, fields?, retry_after?, request_id }`. Field errors look like `{ "field": "title", "code": "too_long", "message": "Use 100 characters or fewer." }`.

## 4. Public read endpoints

All are GET, anonymous, cacheable (except where noted), and return only Approved or Verified content (D07 BR-001 to BR-008).

| ID | Path | Purpose | Query parameters | Returns |
| --- | --- | --- | --- | --- |
| API-101 | /home | Everything the home screen needs in one call | none | `{ pinned_announcement, this_week[], categories[], spotlight_strip[], closing_soon[], top_communities[] }` |
| API-102 | /search | Search all kinds | `q` (required, up to 80), `type` (all, community, event, opportunity), `category`, `cursor`, `limit` | Page of ListingSummary plus `spotlight[]` (separate group) and `did_you_mean` |
| API-103 | /search/suggest | Suggestions while typing | `q` | up to 6 strings and category matches |
| API-104 | /categories | The ten categories with counts | none | Array with `live_communities`, `upcoming_events` |
| API-105 | /categories/{slug} | One category | none | Category plus first page of communities |
| API-106 | /communities | Community directory | `category`, `sort` (stars, newest), `verified`, `cursor`, `limit` | Page of ListingSummary |
| API-107 | /communities/{slug} | Community profile | none | ListingDetail plus `upcoming[]` |
| API-108 | /events | Event list | `when` (week, upcoming, past), `category`, `from`, `to`, `free`, `cursor` | Page of ListingSummary |
| API-109 | /events/{id} | Event detail | none | ListingDetail |
| API-110 | /events/{id}/calendar.ics | Add to calendar | none | `text/calendar` file |
| API-111 | /opportunities | Opportunity list | `type`, `category`, `closing_soon`, `cursor` | Page of ListingSummary |
| API-112 | /opportunities/{id} | Opportunity detail | none | ListingDetail |
| API-113 | /spotlight | Spotlight list | `category`, `cursor` | `{ featured_strip[], items[] }` of SpotlightItem |
| API-114 | /spotlight/{id} | Spotlight detail | none | SpotlightItem |
| API-115 | /announcements | Announcements list | `cursor` | Page of Announcement, pinned first |
| API-116 | /announcements/{id} | One announcement | none | Announcement |
| API-117 | /config | Client configuration | none | Public settings the client needs: plan names, prices and days, closing-soon days, install-prompt timings, limits for form hints; never secrets |
| API-118 | /me/state | Device-specific state (not cached) | `ids` (up to 50 listing ids) | `{ starred: [ids] }`; sets the device cookie if absent |

Rules:

- API-120: A removed, hidden, expired or unknown item returns `404 not_available` with the same body in every case (D03 UI-506).
- API-121: `/home` and list endpoints are served from cache and purged on any status change (D05 ARC-1020).
- API-122: `q` is normalised and rate-limited; an empty or over-length `q` returns `validation_failed`.
- API-123: Lists never exceed `limit` of 24; the default is 12.

## 5. Public write endpoints

All require the device cookie, the anti-forgery check and, where marked, an `Idempotency-Key`. All are rate-limited from settings (D07 BR-010 to BR-024, BR-040 to BR-049, BR-200 to BR-217). Never cached.

| ID | Method and path | Purpose | Body | Success | Typical errors |
| --- | --- | --- | --- | --- | --- |
| API-201 | POST /submissions | Submit a community, event or opportunity (idempotent) | `kind`, `title`, `summary`, `description`, `category_id`, kind details, `links[]`, `contact`, `image_id?`, `verification_request?`, `honeypot` (must be empty), `form_started_at` | 201 `{ tracking_code, status: pending }` | `validation_failed`, `rate_limited`, `blocked_repeat`, `file_rejected` |
| API-202 | POST /uploads | Upload an image or proof before submitting | multipart: `purpose` (image, proof), `file`, `alt_text?` | 201 `{ id, url?, bytes }` | `file_too_large`, `file_type_not_allowed`, `file_rejected` |
| API-202b | POST /uploads/presign | Request S3/R2 direct pre-signed PUT URL (bypasses serverless body limits) | `mime_type`, `bytes`, `purpose` (image, proof, receipt) | 200 `{ upload_url, storage_key, max_bytes, expires_in }` | `file_too_large`, `invalid_mime`, `rate_limited` |
| API-203 | POST /submissions/duplicates | Hint on possible duplicates | `kind`, `title`, `links[]` | 200 `{ matches: [ListingSummary] }` (max 3) | `validation_failed` |
| API-204 | GET /track/{code} | Track a submission | none | 200 Status object | `not_found` (neutral), `rate_limited` |
| API-205 | POST /track/{code}/reply | Answer Needs info | `message`, `attachment_id?` | 200 Status object | `window_closed`, `validation_failed` |
| API-206 | POST /listings/{id}/star | Star a community | none | 200 `{ star_count, starred: true }` | `already_starred` (200 with the same body), `rate_limited`, `device_too_new` |
| API-207 | POST /listings/{id}/report | Report a listing | `reason` (spam, wrong\_info, inappropriate, scam, other), `note?` | 202 `{ received: true }` | `rate_limited`, `not_available` |
| API-208 | POST /spotlight/{id}/report | Report a Spotlight listing | same as API-207 | 202 | same |
| API-209 | POST /events | Analytics events, batched | `events[]` of `{ name, route, props?, at }` (max 20) | 202 | `validation_failed`; unknown names dropped |

Rules:

- API-220: API-201 verifies `form_started_at` is at least a few seconds old (an anti-bot minimum from settings) and the honeypot is empty; failures return the generic `validation_failed`, never naming the check.
- API-221: API-206 is idempotent per device and listing; the response is the same on repeats. Spotlight and Announcements return `404` (no stars exist for them).
- API-222: API-207 responses never reveal the report count or the auto-hide threshold.
- API-223: API-204 returns the same neutral `not_found` for a malformed and an unknown code, and counts every attempt toward the lookup cap.
- API-224: API-201 and API-202 reject the request before storing anything if any check fails; uploads are tied to the device and expire in 24 hours if not attached.
- API-225: The analytics batch (API-209) uses only the event names in D01 FR-430 to FR-437 and never carries free text, names or contact details.

## 6. Spotlight endpoints

The public side of the paid flow (D03 section 8.3 and 8.4, D07 BR-100 to BR-170). Prices, durations and bank details always come from settings and the bank-accounts table, never from the request.

| ID | Method and path | Purpose | Body | Success | Typical errors |
| --- | --- | --- | --- | --- | --- |
| API-301 | GET /spotlight/plans | Plans with price, days and what each gives | none | 200 array `{ plan, name, price_kobo, currency, days, features[] }` | none |
| API-302 | POST /spotlight/orders | Start an order (idempotent) | `plan`, `business_name`, `category_id`, `offer`, `description`, `contact`, `links[]`, `image_id?`, `agree_terms: true` | 201 `{ reference, status: awaiting_payment, amount_kobo, bank: { bank_name, account_name, account_number }, pay_by }` | `validation_failed`, `not_allowed_category`, `active_cap_reached`, `rate_limited` |
| API-303 | POST /spotlight/orders/{reference}/receipt | Upload the receipt (idempotent) | multipart: `file`, `note?`, `payer_name?` | 200 Status object (`receipt_submitted`) | `file_rejected`, `wrong_state`, `not_found` |
| API-304 | GET /spotlight/orders/{reference} | Status | none | 200 Spotlight status object plus `starts_at`, `ends_at`, `can_renew`, `can_cancel`, `refund_note?` | `not_found` (neutral), `rate_limited` |
| API-305 | POST /spotlight/orders/{reference}/renew | Renew in the window | `plan?` | 201 new order that references the old one | `renewal_closed`, `slot_unavailable` |
| API-306 | POST /spotlight/orders/{reference}/cancel | Cancel where D07 allows | `reason?` | 200 status `cancelled` | `wrong_state`, `not_allowed` |
| API-307 | POST /spotlight/waitlist | Join the Featured waitlist | `reference` | 202 | `already_waiting`, `wrong_state` |

Rules:

- API-320: The bank details in API-302 and API-304 are returned only while the order is Awaiting payment or Receipt submitted; never in public lists.
- API-321: The `reference` is generated by the server (SP-XXXX-XXXX), unique, and is the only credential for status lookup, so it is long enough to resist guessing and rate-limited (D08).
- API-322: A receipt upload never changes a status to Active; only the admin endpoint API-421 does (D07, ARC-703).
- API-323: Amounts are copied from settings to the order at creation and returned from the order afterward, so a later price change does not alter an open order.
- API-324: The not-allowed list (D07 BR-107) is checked on category, offer and description text on creation; a failure returns a reason code but not the matched term.

## 7. Admin endpoints

All under `/api/v1/admin`, session cookie required except sign-in, never cached, every write audited (D05 ARC-1130). Roles: R = Reviewer, F = Finance, L = Lead (D07 BR-260 to BR-265). The server enforces the role; hiding a button in the interface is not enough (D03 UI-327).

### Session and access

| ID | Method and path | Purpose | Roles |
| --- | --- | --- | --- |
| API-401 | POST /auth/sign-in | Email and password; returns that a second factor is needed | all |
| API-402 | POST /auth/verify-code | Complete the second factor and start a session | all |
| API-403 | POST /auth/sign-out | End the session | all |
| API-404 | GET /me | Current admin, role, session expiry | all |
| API-405 | POST /auth/change-password | Change password (needs current) | all |

### Review

| ID | Method and path | Purpose | Roles |
| --- | --- | --- | --- |
| API-410 | GET /queue | Review queue; filters `status`, `kind`, `overdue`, `assigned` | R, L |
| API-411 | GET /listings/{id} | Full submission with admin fields, duplicates, history, attachments (signed links) | R, L |
| API-412 | POST /listings/{id}/decision | `decision` (approve, verify, needs\_info, reject), `reason_code`, `note` | R, L; verify needs L or R per D07 |
| API-413 | POST /listings/{id}/hide, /restore, /remove | Change visibility with a required reason | R, L |
| API-414 | PATCH /listings/{id} | Edit fields on behalf of an organiser, with a note | R, L |
| API-415 | GET /reports | Reported and auto-hidden items | R, L |
| API-416 | POST /reports/{id}/resolve | Dismiss or action a report | R, L |
| API-417 | GET /verification/due | Verified communities due for review | R, L |

### Spotlight and payments

| ID | Method and path | Purpose | Roles |
| --- | --- | --- | --- |
| API-420 | GET /spotlight/queue | Orders by status with receipts | F, L |
| API-421 | POST /spotlight/orders/{id}/activate | Requires `confirmed_in_bank: true`, `bank_reference`; sets start and end | F, L |
| API-421b | POST /spotlight/orders/{id}/flag-payment | Record payment anomaly (`underpaid`, `overpaid`, `wrong_narration`) with `amount_received_kobo` and note | F, L |
| API-422 | POST /spotlight/orders/{id}/reject | Reject with reason code and refund note if needed | F, L |
| API-423 | POST /spotlight/orders/{id}/pause, /resume, /cancel, /extend | Lifecycle actions with a required reason | F, L |
| API-424 | POST /spotlight/orders/{id}/refund | Record a refund within the D07 window | F, L |
| API-425 | GET /spotlight/strip | Featured strip slots and waitlist | F, L |
| API-426 | POST /spotlight/strip/offer | Offer a freed slot to the waitlist | F, L |
| API-427 | GET /payments/reconciliation | Weekly reconciliation export | F, L |
| API-428 | GET and POST /bank-accounts | View and propose a change (second person must confirm) | L (change), F (view) |
| API-429 | POST /bank-accounts/{id}/confirm | Second-person confirmation | L |

### Announcements, settings, people and audit

| ID | Method and path | Purpose | Roles |
| --- | --- | --- | --- |
| API-430 | GET, POST /announcements | List and create | L (R for draft only, per D07 BR-250 to BR-255) |
| API-431 | PATCH, DELETE /announcements/{id} | Edit, pin, unpin, expire, delete | L |
| API-440 | GET /settings | All keys with description and history | L (R, F read) |
| API-441 | PATCH /settings/{key} | Change a value with a required note | L |
| API-450 | GET, POST /admins | List and invite admins | L |
| API-451 | PATCH /admins/{id} | Change role, deactivate, reset second factor | L |
| API-460 | GET /audit | Audit log with filters | all (read only) |
| API-461 | GET /dashboard | Counts for the admin home | all |

Rules:

- API-470: A decision endpoint returns the updated Status object and writes `status_history` and `audit_log` in one transaction (D05 ARC-701).
- API-471: Needs info and Reject require a reason from the D07 list; the server rejects free-text-only reasons.
- API-472: API-421 fails with `payment_not_confirmed` unless the payment row has `confirmed_in_bank`; a second activation returns the current state (idempotent).
- API-473: Bank-account changes create a pending change visible to all admins and notify them; only a different Lead can confirm (D07 bank-detail protections).
- API-474: Evidence links are short-lived signed URLs (5 minutes) generated per request, never stored (D05 ARC-1110).
- API-475: Five failed sign-in attempts lock the account for a period from D08; the sign-in response is identical for a wrong email and a wrong password.

## 8. System and job endpoints

| ID | Method and path | Purpose | Auth | Notes |
| --- | --- | --- | --- | --- |
| API-501 | GET /health | Liveness and a database check | none | Returns `{ status, version, time }`; no internals; used by the uptime monitor |
| API-502 | GET /share/{kind}/{id}.png | Generated share image (D04 SHR-01 to SHR-05) | none | Cached by id and version; 404 for non-public items |
| API-503 | GET /sitemap.xml | Public listing URLs | none | Approved and Verified only; no admin routes |
| API-504 | GET /robots.txt | Crawl rules | none | Disallows admin and API paths (D08 owns content) |
| API-505 | GET /manifest.webmanifest | PWA manifest | none | Values from D04 PWA-03 |
| API-510 | POST /jobs/expire-spotlight | Expire due listings | job secret | Every 15 minutes (D07 BR-160) |
| API-511 | POST /jobs/rotate-featured | Rotate strip, offer freed slots | job secret | Every 6 hours |
| API-512 | POST /jobs/close-opportunities | Hide past-deadline opportunities | job secret | Hourly |
| API-513 | POST /jobs/stale-submissions | Flag stale and close unanswered Needs info | job secret | Daily |
| API-514 | POST /jobs/unpaid-holds | Cancel unpaid orders past the hold | job secret | Daily |
| API-515 | POST /jobs/verification-review | Dead-link and inactivity checks | job secret | Daily |
| API-516 | POST /jobs/retention | Delete data past retention | job secret | Daily |
| API-517 | POST /jobs/recount | Repair counters | job secret | Nightly |
| API-518 | POST /jobs/reconciliation-report | Prepare weekly payment report | job secret | Weekly |
| API-519 | POST /jobs/backup-check | Confirm backups | job secret | Daily |

Rules:

- API-520: Job endpoints return `{ job, started_at, finished_at, changed }` and write a `job_runs` row. Calling a job twice in a row must change nothing the second time (D05 ARC-1101).
- API-521: Job endpoints reject any request without the secret with 401 and are not linked from any page; the secret is rotated through the pipeline (D13).
- API-522: The health endpoint never exposes version details to unauthenticated callers beyond a short build id.

## 9. Error catalogue and header rules

Every error uses the envelope in section 2. `code` is stable and tested; `message` is for the interface and comes from the copy file (D03 section 10).

| HTTP | code | When | Interface behaviour |
| --- | --- | --- | --- |
| 400 | validation\_failed | Body or query fails the schema; `fields[]` lists each problem | Inline errors and summary (D03 UI-305) |
| 400 | file\_rejected | File fails content, size or safety checks | Retry prompt, rest of form kept |
| 401 | unauthenticated | Admin session missing or expired | Redirect to sign-in with kept draft |
| 401 | job\_unauthorised | Bad job secret | None (not user facing) |
| 403 | forbidden\_role | Admin role may not do this | Permission message (D03 section 6) |
| 403 | csrf\_failed | Anti-forgery check failed | Reload prompt |
| 404 | not\_available | Hidden, removed, expired, unknown public item | Not-available screen (D03 UI-506) |
| 404 | not\_found | Unknown tracking code or reference (neutral) | Neutral message |
| 409 | wrong\_state | Action not allowed in the current status | Shows the current status |
| 409 | payment\_not\_confirmed | Activate without Confirmed in bank | Admin message |
| 409 | active\_cap\_reached | Business already has the maximum active Spotlight listings | Explains and stops |
| 409 | slot\_unavailable | No Featured slot free | Offers the waitlist |
| 410 | window\_closed | Needs info window or renewal window ended | Resubmit guidance |
| 413 | file\_too\_large | Over the D05 limit | Shows limit |
| 415 | file\_type\_not\_allowed | Not JPG, PNG, WebP or (for receipts) PDF | Shows allowed types |
| 422 | not\_allowed\_category | Matches D07 not-allowed list | Explains the rule without naming the term |
| 422 | blocked\_repeat | Repeat-offence block (D07 BR-040 to BR-049) | States when the person can try again |
| 429 | rate\_limited | Any cap hit; `retry_after` in seconds | Plain-words wait message (D03 UI-507) |
| 429 | device\_too\_new | New device delay before starring | Short wait message |
| 500 | internal\_error | Unexpected failure; `request_id` returned | Error state with Retry |
| 503 | maintenance | Planned maintenance mode (setting) | Maintenance screen |

### Header rules

| Header | Where | Rule |
| --- | --- | --- |
| `Cache-Control` | All | Public GET per D05 section 10; writes and admin `no-store` |
| `ETag` and `If-None-Match` | Public GET | 304 when unchanged |
| `Retry-After` | 429 and 503 | Seconds |
| `RateLimit-Remaining` | Where a cap applies | Remaining count in the window; omitted for caps that must stay hidden (stars, reports) |
| `Idempotency-Key` | Request on creating POSTs | Required; 24-hour memory |
| `X-Request-Id` | All responses | Same as `request_id` |
| Security headers | All | Owned by D08 (CSP, HSTS, content type options, frame, referrer) |

## 10. Traceability, contract testing, open questions and change log

### Traceability to D01

| D01 FR range | Area | D06 endpoints |
| --- | --- | --- |
| FR-001 to FR-016 | Shell and settings | API-117, API-118 |
| FR-020 to FR-035 | Homepage | API-101 |
| FR-040 to FR-053 | Search | API-102, API-103 |
| FR-060 to FR-079 | Categories | API-104, API-105 |
| FR-080 to FR-099 | Community profile | API-106, API-107 |
| FR-110 to FR-127 | Events | API-108 to API-110 |
| FR-135 to FR-149 | Opportunities | API-111, API-112 |
| FR-160 to FR-169 | Sharing | API-502, API-503 |
| FR-180 to FR-189 | Reporting | API-207, API-208, API-415, API-416 |
| FR-195 to FR-214 | Submissions and tracking | API-201 to API-205 |
| FR-230 to FR-260 | Admin | API-401 to API-417, API-440 to API-461 |
| FR-280 to FR-311 | Spotlight public | API-113, API-114, API-301 to API-307 |
| FR-330 to FR-346 | Spotlight admin | API-420 to API-429 |
| FR-370 to FR-380 | Announcements | API-115, API-116, API-430, API-431 |
| FR-390 to FR-399 | PWA | API-505, API-117 |
| FR-410 to FR-418 | Static pages | Rendered by the app; no API |
| FR-430 to FR-437 | Analytics | API-209 |

As in D03, the FR numbers are checked against the exact D01 ledger in the D11 audit.

### Contract testing (feeds D10 and D11)

- API-901: The contract is written once as a machine-readable schema (OpenAPI 3.1) generated from the same validation schemas the server uses, so the document, the client types and the server cannot drift.
- API-902: Every endpoint has tests for: success, each listed error, role denial, rate limit, and unknown-field rejection on writes.
- API-903: Security tests (D12) cover: reading admin data anonymously, mass assignment, enumeration of codes and references, and activating a payment without confirmation.
- API-904: A change to an endpoint, a field or a code is a change request (CR) against this document and bumps its version.

### Open questions

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-API1 | Should contact emails ever be public (organiser opt-in)? | Amr | Never public in v1 |
| OQ-API2 | Is `/me/state` acceptable as a second request after page load, or should starred state be embedded? | Amr, developers | Separate request to keep pages cacheable |
| OQ-API3 | Do organisers need to edit a published listing themselves? | Amr | Not in v1: they submit a correction through tracking or contact |
| OQ-API4 | Should the API offer a read-only public feed for other campus groups? | Amr | Not in v1 |
| OQ-API5 | Minimum anti-bot fill time and honeypot behaviour | Developers, D08 | Setting `submit.min_fill_seconds` (Proposed) |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-01 | First full draft |


