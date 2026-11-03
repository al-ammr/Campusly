---
doc_id: D11
title: Audit Prompts and Quality Verification Suite
file: AUDIT_PROMPTS.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Quality Auditor
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0, D05@1.0.0, D06@1.0.0, D07@1.0.0, D10@1.0.0]
---

# D11 Audit Prompts

Nov 2, 2026 · @Amr Suleiman

## 1. Document control and how audits work

D11 holds the audit prompts that check the builder's work, plus the pre-build checks that keep the documents consistent. Every build prompt in D10 has a matching audit (BP-NN pairs with AU-NN). An audit is read-only: it finds and reports problems and never edits code.

| Field | Value |
| --- | --- |
| Document | D11 Audit Prompts |
| Version | 0.1.0 (first full draft) |
| Phase and gate | P4 Pre-build (document audits) and P5 to P8 (build audits) |
| Inputs | D00 to D10 |
| Feeds | D12 (security overlap), D13 (release checks), D14 (backlog from findings) |

### Independence rules

- AUD-01: Run each audit in a **separate session** from the one that built the code, ideally with a different model or tool, because a builder reviewing its own work tends to approve it.
- AUD-02: Give the auditor the documents and the repository diff, not the builder's explanation of what it did.
- AUD-03: The auditor is told to look for what is wrong, with evidence (file, line, document ID), and never to fix.
- AUD-04: A second person (the other developer) reads each audit report before fixes begin and removes false positives.

### Severity scale

| Level | Meaning | Rule |
| --- | --- | --- |
| Blocker | Breaks a rule that protects money, security, privacy or a core flow; or the build cannot run | Must be fixed before the next prompt |
| Major | A documented requirement is missing or wrong | Must be fixed before the gate |
| Minor | Small deviation, polish or maintainability | Fix or log in D14 with an owner |
| Note | Observation or suggestion | No action required |

### Finding format (the auditor must use it)

`ID | Severity | Document and requirement ID | Evidence (file:line or screen) | What is wrong | Why it matters | Suggested fix direction`

### Audit master prompt

Paste this before any audit prompt.

```text
You are an independent auditor for the Campusly project. You have the documents D01 to D10 and the repository. Your job is to find defects, not to build or fix.
Rules:
- Do not edit, create or delete any file. Read and run read-only checks (type check, lint, tests, build, searches) only.
- Judge only against the documents. Source of truth order: D07, D08, D05, D06, D03 and D04, D09, D01 and D02.
- Every finding needs evidence: file path and line, or screen and step, plus the document and requirement ID it violates.
- Do not praise. Do not summarise what works. Report problems, then a short list of requirements you could not verify and why.
- Prefer fewer, well-evidenced findings over many vague ones. Mark uncertainty explicitly.
- Use the finding format and severity scale from D11 section 1.
- Finish with a count by severity and a pass or fail against the exit criteria of the audit you were given.
```

## 2. Pre-build document audits (gate G4)

These run once the documents are drafted and again after any change request. They check the suite itself, before any code exists. Give the auditor all documents D00 to D10 as text.

### AU-D1 FR number and ID integrity

The FR numbers cited in D02, D03, D06 and D10 were partly inferred while drafting, so this audit is mandatory.

```text
Audit D01 against D02, D03, D06 and D10 for requirement ID integrity.
1. Extract the complete FR, NFR, US and AC ledgers from D01 with their exact IDs and titles.
2. For every FR, NFR, US or AC ID cited in D02, D03, D06 and D10, check that the ID exists in D01 and that its title matches the way it is used. List each mismatch with the document, section and the correct ID.
3. List every D01 FR that no later document (D02, D03, D06, D10) refers to, either by exact ID or by a range that includes it.
4. List every range cited (for example FR-110 to FR-127) whose first or last number does not exist or does not belong to the named area.
5. Output: a table of mismatches, a table of uncovered FRs, a table of bad ranges.
```

**Pass:** no mismatch, no uncovered FR (or each has an owner decision), no bad range.

### AU-D2 Cross-document consistency

```text
Check D00 to D10 for contradictions. Compare these items across every document that mentions them and report any difference in value, name or meaning:
- Listing statuses and Spotlight statuses (D07 owns them): names, count, who sees them, which are public.
- Prices, durations, caps, windows and limits: any literal number that also appears in the settings register or that D07 owns. Flag every document that repeats a D07 number as a literal instead of pointing to D07.
- Field limits and table names (D05 owns them): D03 form hints, D06 schemas, D10 prompts.
- Endpoint paths and error codes (D06 owns them): D03 flows and D10 prompts.
- Security values (D08 owns them): session lengths, lockout, headers, retention periods versus D05, D06, D09.
- Retention periods: D05, D07, D08, D09 must agree or each difference must cite a reason.
- Document IDs and prefixes against the D00 map.
Output a table: item, documents and values found, which document owns it, the fix direction.
```

**Pass:** no unexplained difference; every duplicated number is a pointer or marked as an example.

### AU-D3 Open-question gate

```text
List every open question (OQ-) in D00 to D10 with its ID, owner, default used and the build prompt (BP-NN) it affects. Mark each as: blocks the build, blocks launch, or can wait. Flag any default that would be hard to reverse after the build (for example the operator entity, hosting region, payment method) and any question with no owner. Output three tables: blocks build, blocks launch, can wait.
```

**Pass:** no "blocks build" question remains open at G4; each "blocks launch" has an owner and a date.

### AU-D4 Traceability and gaps

```text
For each D01 user story (US-) and acceptance criterion (AC-), find where it appears as a screen (D02 or D03), an endpoint (D06), a data element (D05), a rule (D07) and a build prompt (D10). Report any story with a missing link in the chain. Also report any screen, endpoint, table or rule that traces back to no story or requirement (scope creep).
```

**Pass:** every story has a complete chain; each orphan is justified or removed.

## 3. Build audits AU-00 to AU-08

Each audit is pasted after the audit master prompt, with the repository diff for the matching prompt (or the whole repository for AU-00 and the gate audits).

### AU-00 Requirement coverage (run at G5, G6, G7)

```text
Compare the D01 FR ledger with the repository. For each FR, say: built (with file and test references), partly built (what is missing), not built, or out of scope for this gate (with the D10 prompt that owns it). Also list code that implements behaviour no FR, rule or document asks for. Output counts per FR range and every FR that is partly or not built.
```

**Pass at a gate:** every FR owned by prompts up to that gate is built; unowned code is justified.

### AU-01 Scaffold (BP-01)

```text
Audit the scaffold against D05 sections 2, 4 and 12 and D08 SEC-420 to SEC-426, SEC-620 to SEC-626. Check: strict TypeScript with no any; the folder layout; the env module fails on missing or malformed variables; server-only variables cannot reach client code and the build fails if they do; .env.example contains names only; CI runs type check, lint, tests, dependency audit and secret scan; lockfile committed; no unexplained dependencies; health endpoint returns no internals; no secret or personal data anywhere in the tree or git history.
```

**Pass:** no Blocker or Major.

### AU-02 Tokens, components and shell (BP-02)

```text
Audit against D04 sections 5 to 7 and D03 sections 3, 5, 6, 11. Check: token values equal D04 exactly (light and dark) and no raw hex outside the token file and brand drawings; the theme is applied before first paint; fonts are self-hosted subsets within budget; every base component has all listed states and variants; focus ring is 3 px and never removed; targets are at least 44 px; Sheet and Dialog trap and return focus; Escape and back close overlays; reduced motion is honoured; the shell has a skip link, landmarks, one h1 per page and safe-area padding. Run an automated accessibility scan on the components page in both themes and at 320 px and 200 percent text.
```

**Pass:** no serious accessibility issue; token values match.

### AU-03 Database (BP-03)

```text
Audit the migrations against D05 section 6 and D07. Check: `uuid-ossp`, `pg_trgm`, and `unaccent` extensions are initialized; every table, column, type and limit exists; check constraints use exactly the D07 status names; unique indexes exist (tracking code, reference, star per device per listing, partial active slug index `WHERE status != 'Removed'`); partial and search indexes exist; foreign keys restrict deletes; spotlight_payments has `status` (pending, confirmed, underpaid, overpaid, refunded) and `amount_received_kobo`; audit_log is append-only for the app role and a test proves it; the Spotlight Active rule and the status transition trigger exist and are tested; campus_id is on every campus-scoped table; money columns are integers in kobo; seed data is fake and contains no real person, email or bank account. Apply the migrations twice from empty and report any failure.
```

**Pass:** every constraint has a failing test; no real data in seeds.

### AU-04 Settings and rules (BP-04)

```text
Audit against D07 and D05 sections 7 and 11. For every D07 rule ID in scope, find the code and the test that names it. Check: every setting key in the D07 register exists with the right default, type and range; no price, duration, cap, window or limit appears as a literal outside the defaults file (search for each number); all rule functions are pure and tested at boundaries; tracking codes and references are cryptographically random, not sequential and have at least 40 bits; the status function is the only writer of status (search for direct status updates); each allowed transition and each refusal has a test; the function writes history and audit in one transaction and calls cache purge.
```

**Pass:** no literal D07 number in code; no status write outside the status function.

### AU-05 API framework (BP-05)

```text
Audit against D06 sections 2, 3, 9 and D08 sections 4, 5 and SEC-501 to SEC-509. Check: response envelope and every error code in D06 exist with correct HTTP status; unknown fields rejected on writes; body size and timeout limits; request id on every response; no stack traces or file paths in errors; campusly_device cookie attributes exactly as D08; only a hash of the device token and no raw IP is stored or logged; rate limits read from settings, atomic under concurrency (find the concurrency test), and fail closed for writes; Retry-After and RateLimit headers; anti-forgery checks on all POST, PATCH and DELETE; Idempotency-Key behaviour for 24 hours; CSP in report-only mode with the D08 policy; all security headers present.
```

**Pass:** every header and cookie attribute verified by a test.

### AU-06 Public read API (BP-06)

```text
Audit API-101 to API-118 against D06 section 4, D05 section 10 and D07 BR-001 to BR-008, BR-225 to BR-234. For each endpoint: only Approved and Verified listings and Active Spotlight items are returned; hidden, removed, expired and unknown items return identical not_available responses; no private field (emails, device ids, internal notes, evidence links) appears in any response, including nested objects and error bodies; query parameters are whitelisted; limit is capped at 24; cursors are signed and cannot be forged; search input is normalised and parameterised; sort and tie-break follow D07; Spotlight is a separate group in search and has no star count or Verified; cache headers and ETag are correct and /me/state is never cached; cache purge runs on status change. Probe with a status-changed seed listing and confirm it disappears from every list.
```

**Pass:** zero private-field leaks; every endpoint has a contract test.

### AU-07 Public screens (BP-07)

```text
Audit the public screens against D03 sections 4, 7, 9, 10, 11, 12 and D02. For each screen check: content order and rules in the matching D03 subsection; all five data states (loading, empty, error, offline, not available) are implemented; filters and sort live in the URL and scroll is restored; Load more is used, not infinite scroll; every Spotlight card shows the Paid listing label and never Verified or a star control; strings come from the strings file, figures from settings; dates and money use the D07 formats; links show their domain and use rel noopener noreferrer nofollow ugc; headings, landmarks, labels and focus order; text contrast in both themes; layout at 320 px and 200 percent text; the performance budgets in D03 section 12 (measure and report numbers).
```

**Pass:** no Blocker or Major; budgets measured and recorded.

### AU-08 Submissions, uploads and tracking (BP-08)

```text
Audit against D06 API-201 to API-205, API-202b, API-220 to API-225, D03 8.1 and 8.2, D07 BR-010 to BR-049 and D08 SEC-201 to SEC-228. Attempt the following and report the result of each: oversized file; wrong type renamed to .jpg; image with embedded script or EXIF location; corrupt image; PDF as image; script and SQL strings in every text field; javascript: and data: links; control and bidirectional characters in titles; submission above the daily cap; honeypot filled; submitted instantly after load; duplicate title and links; tracking lookup above the cap; malformed and unknown codes (responses must be identical); reply after the window; two identical requests with the same Idempotency-Key; request that fails halfway (nothing half-saved, files not orphaned). Confirm pre-signed direct upload (API-202b) enforces Content-Type and size constraints to prevent serverless function body-size overflows. Confirm uploaded files are never reachable by an unauthenticated URL and that receipts and proofs are in private storage with random keys. Confirm drafts stay on the device and that the success screen shows the tracking code.
```

**Pass:** every hostile input is rejected or neutralised with the documented error; no public file path for evidence.

## 4. Build audits AU-09 to AU-16

### AU-09 Stars, reports, sharing (BP-09)

```text
Audit against D06 API-206 to API-208, API-110, API-502, D07 BR-200 to BR-217, BR-040 to BR-049, D08 SEC-501 to SEC-509 and D04 SHR-01 to SHR-05. Try: starring twice from one device; two parallel star requests; clearing cookies and starring within the new-device delay; many stars from one network on one listing; a burst of stars in ten minutes; starring a Spotlight listing or an announcement; unstarring. Confirm: the unique key enforces one star per device and listing; the counter and star_count_reached_at update in the same transaction; tie-breaks follow D07; response shapes are identical whether or not a cap was near; no threshold appears in any message or header; discarded stars are logged and removed from counts. Reports: distinct-device auto-hide, repeat-reporter throttle, hidden items go to review not removal, no count revealed. Share images: 404 for non-public items, cached by id and version, text truncated, Paid listing label on Spotlight cards. The .ics file imports into a calendar with correct UTC and WAT times.
```

**Pass:** every farming scenario is blocked or discounted and tested.

### AU-10 Admin authentication and roles (BP-10)

```text
Audit against D08 SEC-101 to SEC-146 and D06 API-401 to API-405, API-460, API-461. Check: no public sign-up or reset route; password hashing algorithm and parameters; breached-password check; second factor required for every account and recovery codes single-use; lockout after five failures in 15 minutes with identical responses for unknown email, wrong password and locked account; session identifiers random, stored hashed, rotated at sign-in and privilege change; idle and absolute timeouts; cookie attributes (__Host- prefix, HttpOnly, Secure, SameSite=Strict); re-authentication for sensitive actions; admin pages no-store and noindex and excluded from the service worker. Build a table of every admin endpoint against Reviewer, Finance and Lead and call each as each role; report any call that should be denied but is allowed, or the reverse. Try: changing own role; deactivating the last Lead; client-supplied role or status in a body; direct database role permissions for the app role.
```

**Pass:** the role table has zero wrong cells; no escalation path.

### AU-11 Admin review console (BP-11)

```text
Audit against D06 API-410 to API-417, API-440 to API-451, D03 sections 6 and 8.5, D07 BR-010 to BR-049, BR-030 to BR-038, BR-260 to BR-265, D08 SEC-143. Check: every decision goes through the status function; reasons from the D07 list are required for Needs info and Reject; Verify is available for communities only; hide, restore and remove require reasons; every action writes an audit row with before and after and caches are purged; overdue markers use settings; signed evidence links last 5 minutes and are not stored; edit-on-behalf requires another admin's approval; Settings and Users screens are Lead only on the server; the preview before confirm shows what the public will see; destructive actions use the confirm dialog. Trace one listing through submit, Needs info, reply, approve and confirm it appears in public lists and that removal makes it disappear.
```

**Pass:** end-to-end trace works; no admin action without audit.

### AU-12 Spotlight (BP-12)

```text
Audit against D07 BR-100 to BR-170, D06 section 6 and API-420 to API-429, D03 7.7, 8.3, 8.4, D08 SEC-120 to SEC-124, SEC-510 to SEC-534, D09 section 5. Attempt: activating an order without Confirmed in bank; activating with a duplicate bank reference; activating an order created or edited by the same Finance admin; a price change after order creation (open orders must keep their amount); an unknown or malformed reference (identical neutral response); more active listings than the cap; a not-allowed category or text; a receipt upload that tries to move status to Active; refund outside the window; refund above the second-approver amount; a bank-detail change by one Lead only; a bank-detail change confirmed by the same Lead; viewing bank details on a public list. Confirm: money in kobo integers; terms version stored with the order; Paid listing label rendered by the app on every Spotlight surface; no Verified, star or Announcement styling on Spotlight; all lifecycle transitions and refusals tested; reconciliation export correct against test data.
```

**Pass:** every payment-control scenario fails closed.

### AU-13 Announcements, strip, jobs (BP-13)

```text
Audit against D07 BR-225 to BR-234, BR-250 to BR-255, BR-160 to BR-170, D05 section 11, D06 API-430, API-431, API-510 to API-519. Check: only admins can create announcements and Reviewers only draft; announcements look different from ads; slot cap and rotation use settings and the seeded shuffle; waitlist offers last the D07 time; every job endpoint rejects a missing or wrong secret with 401 using constant-time compare, is not linked from any page, returns the documented body and writes job_runs; every job is idempotent (run twice, second run changes nothing, show evidence); boundary tests exist for expiry, renewal window, unpaid hold, stale submissions, verification review and retention; expired items are never public even before a job runs; failures raise an alert.
```

**Pass:** all jobs idempotent with proof; boundary tests for every time rule.

### AU-14 PWA, offline, analytics and admin metrics (BP-14)

```text
Audit against D05 section 10, D03 sections 8.5, 9 and 12, D04 PWA-01 to PWA-08, D09 section 4, D01 FR-252, FR-390 to FR-399, FR-430 to FR-437. Check: manifest values and the maskable icon safe zone; service worker precache list; caching strategies per resource; no caching of admin, API writes, error responses or responses with Set-Cookie; cache caps; update toast applies on next navigation, never mid-form; offline screen and banner; write actions disabled offline with an explanation and not queued; drafts in IndexedDB; install prompt timing and limits and the iOS card; only the allowed analytics event names are sent, batched, with no free text; analytics opt-out works and clears local data; caches cleared on admin sign-out. Admin Metrics: /admin/metrics loads for Lead and Reviewer; live summary counters match database state; date-range filter adjusts metrics; top zero-result searches are listed accurately; CSV export triggers download of valid CSV rows. Test in airplane mode on a real phone for pages previously visited.
```

**Pass:** offline behaviour matches the table; no sensitive data in caches; /admin/metrics computes accurately with working CSV export.

### AU-15 Static and legal pages, SEO, accessibility, performance (BP-15)

```text
Audit against D03 7.9, 11, 12, D09 section 7, D06 API-503, API-504, D08 SEC-543. Check: every page in the list exists and is linked from the footer; legal text comes from versioned content files and placeholders are clearly marked; accepted terms version is recorded on submissions and orders; Licences page lists every dependency, font and icon set with licences; the accessibility statement exists; /sitemap.xml returns valid XML listing only Approved and Verified public entities with correct lastmod; /robots.txt disallows /admin/ and /api/ and references /sitemap.xml; admin routes return X-Robots-Tag: noindex. Run the full accessibility checklist in D03 section 11 on every route in both themes at 320 px and 200 percent text and with keyboard only and with TalkBack or VoiceOver on the flows named in D03; report each failure with its UI-7xx ID. Measure every budget in D03 section 12 on a throttled mid-range device and report numbers against budgets.
```

**Pass:** no serious accessibility failure; valid sitemap and robots crawler rules excluding admin; every missed budget logged with an owner.

### AU-16 Release candidate (BP-16)

```text
Audit the release candidate against D08 (all), D05 section 12 and D13. Check: CSP enforcing and every header on public, admin and error responses; no source maps, debug output, development routes or seed data in production; maintenance mode works; backup and restore scripts work and a restore drill is recorded; alert rules exist for each condition in D05 ARC-1211; rotation runbook exists; release notes match the checklist in D09 section 9; run AU-00 and confirm every FR is built or deferred with an owner; run the full test suite and report flakiness. List every open finding from AU-01 to AU-15 by severity.
```

**Pass:** zero open Blocker or Major; deferred items have an owner and a D14 entry.

## 5. Cross-cutting audits

These run at gates (G5, G6, G7) and after any large change, on the whole repository.

### AU-X1 Business-rule compliance

```text
For every rule ID in D07 (BR-001 to BR-265), find where the behaviour is implemented and tested. Output a table: rule ID, behaviour, file and test, status (implemented, partial, missing, not applicable at this gate). Flag any behaviour in code that contradicts a rule, and any rule restated as a literal number instead of a settings read. Also check that status names, labels and next-step lines in the interface match D07 and D03 section 10 exactly.
```

### AU-X2 Privacy and data minimisation

```text
Audit data handling against D09 section 3 and 4 and D08 section 6. List every field the app stores or sends. For each, state the purpose and the D09 inventory row. Report any data collected that is not in the inventory, any raw IP, token, cookie value, receipt or personal data in logs, error reports or analytics, any third-party request from the browser, any retention period in code that differs from D08 or D09, and whether the retention job deletes what it should (run it against aged test data). Check that the analytics opt-out and the clear-local-data control work and that rights requests are possible through the Contact page.
```

### AU-X3 Accessibility sweep

```text
Run the D03 section 11 checklist (UI-701 to UI-715) on every route and every component in both themes at 320 px, at 200 percent text, with keyboard only, in forced-colours mode and with reduced motion. Test the flows named in D03 with a screen reader. Report each failure with its UI ID, route, steps and a screenshot or description.
```

### AU-X4 Performance sweep

```text
Measure the budgets in D03 section 12 (UI-801 to UI-812) on the home page, a listing detail, search results and the submit form, on a throttled mid-range mobile profile with cold and warm cache. Report each number against its budget, the largest contributors to any miss, and unused JavaScript and CSS. Check image sizes, lazy loading and layout shift.
```

### AU-X5 Regression

```text
Run every previous audit's key checks on the current repository (use the Pass criteria in D11 sections 3 and 4 as the checklist). Report any check that passed earlier and fails now, the change that likely caused it, and the test that should have caught it but did not.
```

### AU-X6 Dependency and licence

```text
List every direct and transitive dependency with version, licence, last release date and download size. Flag licences that are copyleft or unknown, packages abandoned or with known vulnerabilities, packages that are not needed by any import, duplicates, and anything not listed in D05 section 4 without a recorded reason. Compare the list with the Licences page and report missing entries.
```

### Which audit runs when

| Moment | Audits |
| --- | --- |
| G4 (before build) | AU-D1, AU-D2, AU-D3, AU-D4 |
| After each prompt BP-NN | AU-NN, then the matching SA-NN from D12 |
| G5 (after BP-08) | AU-00, AU-X1, AU-X5 |
| G6 (after BP-13) | AU-00, AU-X1, AU-X2, AU-X5 |
| G7 (after BP-16) | All of AU-00, AU-X1 to AU-X6, AU-16 |
| After any change request | AU-D2 and the audits of affected prompts |

## 6. Finding register, exit criteria, open questions and change log

### Finding register (keep in the repository as `docs/findings.md`)

| ID | Audit | Severity | Doc and requirement | Evidence | Status (open, fixed, deferred, rejected) | Owner | Fixed in (commit) | Retest result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-001 | AU-04 | Major | D07 BR-120 | lib/rules/status.ts:88 | Open | Dev 1 |  |  |

The first row is an example. Each finding gets an ID once, never reused. A fix is accepted only after the auditor re-runs the same audit prompt and the finding is gone (a retest), not when the builder says it is fixed.

### Exit criteria by gate

| Gate | Must be true |
| --- | --- |
| G4 | AU-D1 to AU-D4 pass; no build-blocking open question |
| After each BP | Matching AU and SA have no open Blocker or Major; build log updated |
| G5 | AU-00 shows all FRs owned by BP-01 to BP-08 built; AU-X1 and AU-X5 pass |
| G6 | All features built; AU-X2 passes; no open Blocker |
| G7 | All audits pass; D12 passes; zero open Blocker or Major; deferred items have owners in D14; legal checklist (D09 section 9) complete |

### Using the findings later

Minor findings and Notes that are deferred become items in D14 (the agile UX backlog) with the finding ID, so nothing found during the build is lost.

### Open questions

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-AU1 | Which tool or model runs the audits (different from the builder)? | Amr | A different model or tool than the builder where possible |
| OQ-AU2 | Is there time for a second human review of each audit report? | Developers | Yes, at least for Blocker and Major |
| OQ-AU3 | Should audit reports be stored in the repository or in a shared folder? | Developers | Repository, under `docs/audits/` |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-02 | First full draft: document audits, 17 build audits, 6 cross-cutting audits, register and exit criteria |


