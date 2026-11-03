---
doc_id: D08
title: Security Specification and Mandatory Controls
file: SECURITY_SPEC.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Security Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D05@1.0.0, D06@1.0.0, D07@1.0.0]
---

# D08 Security Specification

Nov 1, 2026 · @Amr Suleiman

## 1. Document control and security objectives

D08 sets every security value Campusly must meet: how admins sign in, what each role may do, how input and files are handled, which headers and cookies are used, how data is protected and kept, and how incidents are handled. It is the source of truth for security values; D05, D06 and D13 refer to it by ID. D12 audits the finished build against it.

| Field | Value |
| --- | --- |
| Document | D08 Security Specification |
| Version | 0.1.0 (first full draft) |
| Phase and gate | P3 Architecture, gate G3 |
| Inputs | D01, D05, D06, D07 |
| Feeds | D09 Legal, D10 Prompt Sequence, D11 Audit, D12 Security Audit, D13 Deployment |

**Security objectives, ranked**

1. No unauthorised person can read admin data, evidence files, or change a listing, price or bank account.
2. No payment is activated without a human confirming it in the bank.
3. Public content cannot carry active code, deceptive links or another site's identity.
4. Rankings (stars) and reports cannot be cheaply manipulated.
5. Personal data collected is minimal, protected and deleted on schedule.
6. The service stays available and recoverable.

**ID convention.** Requirements are SEC-xxx, grouped: SEC-1xx admin access, SEC-2xx input and files, SEC-3xx transport and headers, SEC-4xx data, SEC-5xx abuse and payment, SEC-6xx operations. Values marked *Proposed* are defaults the owner may tighten but not loosen without a logged decision. These requirements are standards for the design and are not a substitute for a professional penetration test (D12 recommends one before launch).

**Method.** The threat model uses the STRIDE categories (spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege) applied to each asset and trust boundary, and the OWASP Top 10 and ASVS level 2 as the checklist for D12.

## 2. Assets, actors and threat model

### Assets

| Asset | Sensitivity | Where |
| --- | --- | --- |
| Admin accounts, passwords, second-factor secrets | Critical | `admins`, `admin_sessions` |
| Bank account details shown to payers | High (integrity matters most) | `bank_accounts` |
| Payment receipts and verification proofs | High | `evidence` storage, `spotlight_payments`, `attachments` |
| Organiser contact details and optional emails | Medium | `listings`, `spotlight_listings` |
| Settings register (prices, limits) | High (integrity) | `settings` |
| Public listings and rankings | Medium (integrity) | `listings`, `stars` |
| Audit log | High (integrity) | `audit_log` |
| Device records and hashed network keys | Low to medium | `devices` |
| Secrets and keys (job secret, storage keys, session keys) | Critical | Environment, not code |

### Actors

Anonymous visitor, organiser (anonymous, holds a tracking code), business owner (anonymous, holds a reference), malicious competitor or spammer, admin (Reviewer, Finance, Lead), compromised admin account, insider with repository or hosting access, automated scraper or bot.

### Threats and controls

| ID | Threat (STRIDE) | Example | Controls | Requirements |
| --- | --- | --- | --- | --- |
| T-01 | Spoofing: admin takeover | Password guessing or phishing | Strong passwords, second factor, lockout, session binding, no admin links in public pages | SEC-101 to SEC-112 |
| T-02 | Tampering: bank details changed to attacker's account | Insider or hijacked Lead account | Two-person confirmation, notice to all admins, audit trail, change delay | SEC-120 to SEC-124 |
| T-03 | Tampering: payment activated without money | Finance staff error or fraud | Confirmed in bank required, separate roles for receipt and activation review, weekly reconciliation | SEC-510 to SEC-516 |
| T-04 | Information disclosure: receipts or proofs leak | Public bucket, guessable URL | Private storage, signed short-lived links, random keys, no inline PDF for public | SEC-410 to SEC-414 |
| T-05 | Tampering: stored XSS in listings | Script in a description or link | Plain text only, output encoding, strict CSP, link scheme check | SEC-201 to SEC-206, SEC-310 |
| T-06 | Tampering: malicious file upload | Disguised script, huge image, polyglot | Content-type check by bytes, re-encode, size caps, private evidence, no execution | SEC-220 to SEC-228 |
| T-07 | Spoofing: look-alike or phishing listing | Fake bank or official-looking Spotlight | Not-allowed list, review, Paid listing label, link domain shown, no Verified for Spotlight | SEC-530 to SEC-534 |
| T-08 | Tampering: star manipulation | Cookie clearing, scripts, botnets | One star per device and listing, new-device delay, network cap, burst detection, discard and audit | SEC-501 to SEC-507 |
| T-09 | Tampering: report abuse to hide rivals | Many reports from fresh devices | Distinct-device threshold, review before removal, repeat-reporter throttling | SEC-508, SEC-509 |
| T-10 | Denial of service | Request floods, large uploads, expensive search | Edge caching, rate limits, size caps, query limits, timeouts | SEC-540 to SEC-546 |
| T-11 | Information disclosure: enumeration | Guessing tracking codes or references | Long random codes, neutral errors, lookup caps, no existence signal | SEC-130, SEC-515 |
| T-12 | Elevation of privilege: role bypass or mass assignment | Reviewer calls Finance endpoint; extra fields in body | Server-side role checks, deny by default, unknown fields rejected, tests per role | SEC-140 to SEC-146 |
| T-13 | Repudiation: admin denies an action | Disputed rejection or payment | Append-only audit with before and after, request id, session id | SEC-610 to SEC-614 |
| T-14 | Supply-chain compromise | Malicious package or build | Locked dependencies, review, scanning, minimal packages, secret scanning | SEC-620 to SEC-626 |
| T-15 | Information disclosure: leaked secrets | Key committed to repository | Env variables only, scanning, rotation, least-privilege keys | SEC-420 to SEC-426 |
| T-16 | Data loss | Mistaken deletion, provider failure | Backups, soft delete, restore drills | D05 ARC-1220 to ARC-1222, SEC-630 |
| T-17 | Privacy harm | Excess personal data kept | Minimisation, retention schedule, hashing, no profiling | SEC-400 to SEC-406 |
| T-18 | Open redirect or phishing via outbound links | Apply link pointing to credential-harvesting page | https only, domain shown, interstitial warning for unknown domains optional, report path | SEC-205, SEC-206 |

## 3. Admin authentication, sessions and roles

### Sign-in and sessions

| ID | Requirement (Proposed values) |
| --- | --- |
| SEC-101 | Admin accounts are created only by a Lead, by invitation to a named email; there is no public sign-up or password-reset page that reveals whether an account exists |
| SEC-102 | Passwords are at least 12 characters, checked against a list of common and breached passwords, with no composition rules and paste allowed (D03 UI-715) |
| SEC-103 | Passwords are stored with a memory-hard hash (Argon2id or scrypt) with a unique salt and tuned parameters; never reversible, never logged |
| SEC-104 | A second factor is mandatory for every admin: an authenticator app (time-based codes) as standard; ten single-use recovery codes issued at setup and shown once |
| SEC-105 | Five failed attempts in 15 minutes lock the account for 15 minutes and the network key for the same period; the response is identical for unknown email, wrong password and locked account |
| SEC-106 | Sessions are server-side records; the cookie holds only a random 256-bit identifier, stored hashed |
| SEC-107 | Session idle timeout 30 minutes, absolute lifetime 8 hours; a warning appears 2 minutes before expiry (D03 UI-441) |
| SEC-108 | A new session identifier is issued at sign-in and at every privilege change; sign-out and password change end all other sessions |
| SEC-109 | Re-authentication (password plus code) is required for: bank-detail changes, settings changes, role changes, deleting content, and exporting payment data |
| SEC-110 | Admin cookies are `HttpOnly`, `Secure`, `SameSite=Strict`, scoped to the admin path, with the `__Host-` prefix where the host allows |
| SEC-111 | Sign-in, code verification, lockouts and role changes notify the account owner by email and are logged |
| SEC-112 | Admin pages send `Cache-Control: no-store` and `X-Robots-Tag: noindex`, and are excluded from the service worker (D05 ARC-1030) |

### Bank-detail protections

| ID | Requirement |
| --- | --- |
| SEC-120 | Bank details are stored in their own table and never appear in settings, code, logs or email |
| SEC-121 | A change is proposed by one Lead and must be confirmed by a different Lead with re-authentication; the change takes effect only after confirmation |
| SEC-122 | Every admin receives an email and an in-app notice for each proposed and confirmed change, with the old and new account names (not full numbers) |
| SEC-123 | After a confirmed change, new orders show the new account; orders already shown the old one keep it, and Finance sees a warning on receipts matched to the old account for 7 days |
| SEC-124 | If only one Lead exists, bank changes are blocked until a second Lead is added, and the owner decision is logged (OQ-S02) |

### Roles and permission matrix

Deny by default (SEC-140). R = Reviewer, F = Finance, L = Lead (D07 BR-260 to BR-265).

| Capability | R | F | L |
| --- | --- | --- | --- |
| View queues and submissions | Yes | Spotlight only | Yes |
| Approve, Needs info, Reject listings | Yes | No | Yes |
| Verify a community | Yes | No | Yes |
| Hide, restore, remove listings | Yes | No | Yes |
| View receipts and payment data | No | Yes | Yes |
| Activate, reject, refund, cancel Spotlight | No | Yes | Yes |
| Propose or confirm bank changes | No | View only | Yes |
| Publish and edit announcements | Draft only | No | Yes |
| Change settings | Read | Read | Yes |
| Manage admins and roles | No | No | Yes |
| Read audit log | Yes | Yes | Yes |

- SEC-141: The role is checked on the server for every request and action, at the endpoint and again at the data layer for payment and settings tables.
- SEC-142: No one can change their own role or deactivate the last active Lead.
- SEC-143: A Reviewer cannot be the only person to approve their own submission (the submitter is anonymous, so this applies to any listing an admin created on behalf of someone: another admin must approve it).
- SEC-144: Finance cannot activate an order they created or edited on behalf of a business.
- SEC-145: Admin actions never accept a client-supplied role, user id or status outside the permitted transitions.
- SEC-146: Each role has contract tests for allowed and denied calls (D06 API-902).
- SEC-130: Tracking codes and Spotlight references contain at least 40 bits of randomness drawn from a cryptographic source, are not sequential, and never reveal creation order.

## 4. Input, output and file security

### Input validation and output encoding

| ID | Requirement |
| --- | --- |
| SEC-201 | Every request is validated on the server against a schema (type, length, format, allowed values) before use; the client check is only a convenience |
| SEC-202 | User text is stored as plain text and rendered with automatic output encoding; the app never inserts user content as HTML, and never uses an unsafe HTML injection API |
| SEC-203 | Database access uses parameterised queries or a typed query builder only; string-built SQL is forbidden and flagged in D11 |
| SEC-204 | Search input is length limited, normalised and passed as a parameter to the search functions; wildcards and operators from users are escaped |
| SEC-205 | Links must be `https`; `javascript:`, `data:`, `file:` and other schemes are refused. Hostnames are lower-cased, internationalised names shown in their safe form, and IP-address and URL-shortener links are flagged for review |
| SEC-206 | Outbound links carry `rel="noopener noreferrer nofollow ugc"`, open in a new tab, and show the domain (D03 UI-415, UI-606) |
| SEC-207 | Names and titles are trimmed, control characters and bidirectional override characters removed; repeated characters and all-caps spam are limited by D05 rules |
| SEC-208 | Free-text fields are checked against the D07 not-allowed list and a spam pattern list (phone-number floods, repeated links); a hit routes to review rather than silently rejecting where possible |
| SEC-209 | Request bodies are limited in size (JSON 100 KB, uploads per D05) and requests time out at 10 seconds for API and 30 seconds for uploads |
| SEC-210 | Unknown JSON fields on writes are rejected to prevent mass assignment (D06 API-013) |
| SEC-211 | The honeypot field and minimum fill time (D06 API-220) are silent: failures look like ordinary validation errors |

### File upload security

| ID | Requirement |
| --- | --- |
| SEC-220 | Allowed types: JPG, PNG, WebP for images; JPG, PNG, PDF for receipts and proofs. The type is determined from the file's bytes, not its name or the declared type |
| SEC-221 | Size caps from D05 (5 MB images, 8 MB receipts and proofs) are enforced while streaming, so an oversized file is cut off early |
| SEC-221b | Pre-signed Upload Security: Pre-signed PUT URLs (ARC-1111) enforce exact Content-Type, maximum byte length constraints, and scoped path keys. Storage buckets forbid public read or directory listing; CORS is locked strictly to the application origin |
| SEC-222 | Images are decoded and re-encoded to WebP at a bounded size, which removes metadata (including location) and any payload hidden in the original; failure to decode rejects the file |
| SEC-223 | Receipts and proofs are stored unchanged in private storage under random keys, never served from a public path, and shown to admins only through signed links valid for 5 minutes |
| SEC-224 | PDFs are never opened by the server's own renderer; admins view them in the browser's sandboxed viewer from a separate download domain with `Content-Disposition` and a sandboxing CSP |
| SEC-225 | Uploaded files are scanned for malware with a scanning service or library where available before admins can open them; until `scanned_at` is set the file shows as not yet scanned (OQ-S03) |
| SEC-226 | Filenames are never used in storage paths; the original name is not kept |
| SEC-227 | Uploads are bound to the device and expire after 24 hours if not attached to a submission |
| SEC-228 | Upload endpoints are rate limited, and a device exceeding the failure rate is paused for an hour |

## 5. Transport, headers, cookies and anti-forgery

| ID | Requirement |
| --- | --- |
| SEC-301 | HTTPS everywhere; HTTP redirects to HTTPS; TLS 1.2 or higher with modern ciphers (managed by the host) |
| SEC-302 | `Strict-Transport-Security: max-age=31536000; includeSubDomains`; preload is added only after launch is stable (OQ-S04) |
| SEC-303 | `X-Content-Type-Options: nosniff` on every response |
| SEC-304 | `Referrer-Policy: strict-origin-when-cross-origin`; admin pages send `no-referrer` |
| SEC-305 | `Permissions-Policy` disables camera, microphone, geolocation, payment and USB; the file picker for uploads does not need them |
| SEC-306 | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` so Campusly cannot be framed |
| SEC-307 | `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-site` for the app and admin |
| SEC-308 | Errors never leak stack traces, query text or file paths; the response carries only `request_id` (D06 section 9) |
| SEC-309 | No wildcard CORS. Public GET endpoints allow only the app's own origins; write endpoints allow only the app's own origin, and credentials are never allowed cross-origin |
| SEC-310 | Content Security Policy on all pages: `default-src 'self'`; `script-src 'self'` with per-request nonces and no `unsafe-inline` or `unsafe-eval`; `style-src 'self'` with nonces; `img-src 'self' data:` plus the media domain; `connect-src 'self'`; `font-src 'self'`; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`; with report-only mode tested before enforcement |
| SEC-311 | Subresource integrity for any third-party script (none are planned; D01 analytics is first party) |

### Cookies

| Cookie | Purpose | Attributes |
| --- | --- | --- |
| `campusly_device` | Anonymous device token | `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age` one year; random 128 bits; only a hash stored (D05 ARC-901) |
| `__Host-cf_admin` | Admin session | `HttpOnly; Secure; SameSite=Strict; Path=/`; session length per SEC-107 |
| Theme and preference values | Light, dark, install prompt state | Stored in local storage on the device, not cookies; no personal data |

### Anti-forgery for browser writes

- SEC-320: Every state-changing request (POST, PATCH, DELETE) must carry a custom header the server expects and come from an allowed `Origin`; cross-site forms cannot set either.
- SEC-321: Admin writes additionally carry a per-session token in a header, checked in constant time.
- SEC-322: `SameSite` cookie settings are a second layer, not the only one.
- SEC-323: GET requests never change state, including job and share endpoints.

### Service worker and offline

- SEC-330: The service worker only caches same-origin GET responses without `Set-Cookie`, and never admin or API write responses (D05 ARC-1032).
- SEC-331: On admin sign-out the caches and any local drafts of admin notes are cleared.
- SEC-332: The worker is served from the app origin with the correct scope and updates on each deployment, so a faulty release can be replaced quickly.

## 6. Data protection, secrets and retention

Campusly collects as little as it can. D09 turns this into notices and legal positions; this section sets the technical rules.

### Data classification

| Class | Examples | Handling |
| --- | --- | --- |
| Restricted | Admin passwords (hashed), second-factor secrets, receipts, proofs, bank details | Encrypted at rest, access by role only, short-lived links, every access logged |
| Confidential | Organiser contact names and emails, admin notes, audit log | Role-based access, never in public responses or logs |
| Internal | Settings, job runs, analytics events | Admin access only |
| Public | Approved listings and announcements | Cacheable |

### Requirements

| ID | Requirement |
| --- | --- |
| SEC-400 | Collect only what a feature needs: no student names, matric numbers, phone numbers or accounts from visitors; an organiser's contact email is optional |
| SEC-401 | No advertising trackers, no third-party analytics scripts, no fingerprinting; analytics events are first party and carry no free text (D06 API-225) |
| SEC-402 | Device tokens and network keys are stored only as salted hashes; the network salt rotates on a schedule so old hashes cannot be linked |
| SEC-403 | IP addresses are not stored in the database or logs in raw form; request logs keep a hashed network key for the retention period |
| SEC-404 | Contact emails and optional payer names are encrypted at column level where the database supports it, with the key held outside the database |
| SEC-405 | A person can ask for correction or removal of their listing or contact data through the Contact page; admins complete removal within the period in D09 and record it |
| SEC-406 | No sale or sharing of personal data with third parties; service providers are listed in D09 with their purpose and region |
| SEC-410 | Databases and storage are encrypted at rest by the provider; backups likewise |
| SEC-411 | Evidence storage is private, has no public listing, and access keys are limited to the app role |
| SEC-412 | Signed links last 5 minutes and are generated per request for the signed-in admin |
| SEC-413 | Evidence is deleted by the retention job; deletion removes the storage object and the metadata row, and is logged |
| SEC-414 | Receipts and proofs are never attached to emails or placed in chats |

### Secrets management

| ID | Requirement |
| --- | --- |
| SEC-420 | Secrets live only in the host's secret store and local untracked env files; none in the repository, client bundle, logs or error reports |
| SEC-421 | Only variables explicitly marked public may reach the browser; everything else is server-only, and the build fails if a server secret name appears in client code |
| SEC-422 | Separate secrets per environment; production secrets are readable by the Lead developer role only |
| SEC-423 | Secret scanning runs on every commit and pull request, with a blocking check (D13) |
| SEC-424 | Keys follow least privilege: the app's database role cannot alter schema; the migration role is used only in the pipeline |
| SEC-425 | Rotation: job secret and session signing keys every 90 days and on any suspected exposure; a documented rotation runbook exists (D13) |
| SEC-426 | If a secret is committed by mistake it is treated as leaked: rotate first, then clean history |

### Retention schedule (values in D07; enforced by the retention job)

| Data | Kept | Then |
| --- | --- | --- |
| Verification proofs | 90 days after the decision | Deleted |
| Spotlight receipts | As D07 and D09 require for records, then deleted | Deleted |
| Star records | 90 days | Deleted; counts kept |
| Unattached uploads | 24 hours | Deleted |
| Device records unseen | 12 months | Deleted |
| Archived Spotlight | 90 days after expiry | Archived data deleted, totals kept |
| Analytics events | 13 months | Aggregated then deleted |
| Audit log | Minimum 24 months (Proposed; D09 confirms) | Archived, never edited |

## 7. Abuse resistance and payment security

### Stars, reports and scraping

| ID | Requirement |
| --- | --- |
| SEC-501 | One star per device per listing is enforced by a unique database key, not only by the interface |
| SEC-502 | A device must be at least 60 seconds old before its first star; the delay is a setting (D07 BR-200 to BR-217) |
| SEC-503 | Per-device and per-network-per-listing hourly caps and the burst rule apply, using atomic counters |
| SEC-504 | Stars from flagged bursts are marked discarded, removed from counts, logged, and never shown to the sender as discarded |
| SEC-505 | Star and report responses are identical in shape whether or not a limit was close, to give attackers no tuning signal |
| SEC-506 | A nightly check compares star growth to traffic and flags anomalies to Reviewers |
| SEC-507 | Interface hints about caps never state exact thresholds |
| SEC-508 | Auto-hide needs reports from different devices and different networks inside the window (D07 BR-040 to BR-049); a hidden item goes to review, never straight to Removed |
| SEC-509 | A device whose reports are repeatedly dismissed is throttled to fewer reports per day |
| SEC-540 | Edge rate limits per network on all public routes, stricter on search, submit and track |
| SEC-541 | Search queries are limited to 80 characters, three per second per device, and run with a statement timeout |
| SEC-542 | List endpoints cap `limit` at 24 and cursors are signed so they cannot be forged to read unbounded data |
| SEC-543 | The `robots.txt` and sitemap list only public pages; bot traffic that ignores them is rate limited |
| SEC-544 | Request bodies, uploads and concurrent uploads per device are capped |
| SEC-545 | Expensive work (image processing, share images) runs with timeouts and a concurrency cap; a queue absorbs bursts |
| SEC-546 | A maintenance switch (setting) can put the public app into read-only or maintenance mode quickly |

### Payment security (manual bank transfer)

Campusly never handles card data and never moves money. The risks are misdirected payments, false receipts and unauthorised activation.

| ID | Requirement |
| --- | --- |
| SEC-510 | A Spotlight listing becomes Active only through the admin activate action with Confirmed in bank ticked and a bank reference entered (D06 API-421) |
| SEC-511 | The payment row stores who ticked it, when, and the bank reference; a database rule rejects Active without a confirming row |
| SEC-512 | The reference SP-XXXX-XXXX must match the order, amount must match the amount copied at order time, and the payer name is compared and noted; a mismatch blocks activation until a Finance admin writes a reason |
| SEC-513 | The same bank reference cannot confirm two orders |
| SEC-514 | A receipt image is evidence only; it cannot activate anything even if it looks genuine, because forged screenshots are common |
| SEC-515 | Order lookups by reference are rate limited and give no existence signal for unknown references |
| SEC-516 | Weekly reconciliation compares confirmed payments with the bank statement and reports mismatches to a Lead (D07 BR-140 to BR-152) |
| SEC-517 | Refunds happen inside the D07 window, need a second admin's approval above a setting-defined amount, and are logged |
| SEC-518 | Bank details are shown only on the order screens, as text from the database, never from user input |

### Look-alike and deceptive content

| ID | Requirement |
| --- | --- |
| SEC-530 | Advertisers cannot use the Verified badge, Announcement styling, the Campusly or GDGOC marks, or text that implies endorsement (D07 BR-107; D04 CO-07) |
| SEC-531 | Spotlight text and images are reviewed before Active; listings asking for payment to unknown accounts, giving bank details, or promising financial returns are rejected |
| SEC-532 | Every Spotlight card and page carries the Paid listing label rendered by the app, not by content |
| SEC-533 | Links show their domain; shortened and IP links are flagged for review |
| SEC-534 | Public reports of scams are escalated: a scam report on a Spotlight listing pauses it pending review |

## 8. Logging, incident response and secure development

### Logging and audit

| ID | Requirement |
| --- | --- |
| SEC-610 | Every admin action writes an audit row with admin, role, action, object, before and after values, request id and session id (D05 ARC-1130) |
| SEC-611 | The audit table is append-only for the app role; changes to it require database owner access and trigger an alert |
| SEC-612 | Application logs are structured, carry a request id, and exclude passwords, tokens, cookies, receipts and personal data |
| SEC-613 | Security events are logged and alerted: failed sign-ins above a threshold, lockouts, role and bank changes, settings changes, activations, spikes of rejected uploads, discarded stars, and job failures |
| SEC-614 | Logs are kept 90 days (Proposed) and are readable by developers only; the audit log is kept per the retention schedule |

### Incident response

Severity: S1 (admin or payment compromise, data exposure), S2 (service down, active abuse), S3 (minor defect).

| Step | S1 actions |
| --- | --- |
| 1 Detect and declare | Whoever notices tells both developers and the Lead; one person is incident lead |
| 2 Contain | Put the app in maintenance mode if needed; revoke all admin sessions; rotate affected secrets; freeze bank-detail changes |
| 3 Assess | Use audit log and request ids to find what was touched; decide if personal data or money is affected |
| 4 Recover | Restore from backup if data was altered; redeploy a known-good release; re-verify bank details with the bank |
| 5 Notify | Tell affected people and, where D09 requires it, the Nigeria Data Protection Commission within the legal period; tell the chapter lead |
| 6 Review | Written post-incident review within 7 days: cause, timeline, fixes, owner and due date, logged as a change request |

A contact route for security reports (a security page and address) is published; reports are acknowledged within 3 working days (Proposed). Contact details are an open question (OQ-S01).

### Dependencies and supply chain

| ID | Requirement |
| --- | --- |
| SEC-620 | Dependencies are pinned by a lockfile; installs in CI use the lockfile exactly |
| SEC-621 | Automated dependency and vulnerability scanning runs on every pull request and weekly; critical issues block release |
| SEC-622 | New dependencies need a reason, a check of maintenance and size, and a licence check (D09); prefer fewer, well-known packages |
| SEC-623 | Build and deploy accounts use two-step sign-in; repository branch protection requires review and passing checks on the main branch |
| SEC-624 | The AI builder works on a branch with no production secrets; its changes go through the same review and the D11 audit prompts |
| SEC-625 | Third-party services are limited to those listed in D05; each has its own scoped key |
| SEC-626 | Generated code is checked for hardcoded secrets, unsafe HTML insertion, string-built SQL, missing role checks and disabled security headers (D11 and D12 checklists) |

### Resilience

- SEC-630: Backups, restore drills and recovery targets follow D05 ARC-1220 to ARC-1222; a restore drill result is recorded before launch and each term.
- SEC-631: Admin access has a break-glass procedure: a recovery code held offline by a Lead, tested at setup.

## 9. Verification checklist, open questions and change log

### What D11 and D12 must test

| Area | Test | Requirements |
| --- | --- | --- |
| Admin access | Sign-in lockout, second factor, session expiry, no account enumeration | SEC-101 to SEC-112 |
| Roles | Each role calls every admin endpoint; denied ones return 403; no self-promotion | SEC-140 to SEC-146 |
| Bank changes | One-person change cannot take effect; all admins notified | SEC-120 to SEC-124 |
| Payments | Activate without Confirmed in bank fails; duplicate bank reference refused; receipt alone changes nothing | SEC-510 to SEC-518 |
| Injection | SQL, script and template payloads in every text field and query | SEC-201 to SEC-204 |
| Links | Disallowed schemes refused; rel attributes present | SEC-205, SEC-206 |
| Uploads | Disguised files, oversize files, polyglots, SVG, metadata removal, private evidence access | SEC-220 to SEC-228, SEC-410 to SEC-414 |
| Headers and CSP | All headers present; CSP blocks inline script; framing blocked | SEC-301 to SEC-311 |
| Cookies and CSRF | Attributes correct; cross-site write fails | SEC-320 to SEC-323 |
| Abuse | Cookie clearing, burst stars, mass reports, scraping | SEC-501 to SEC-509, SEC-540 to SEC-546 |
| Enumeration | Tracking codes and references cannot be guessed or distinguished | SEC-130, SEC-515 |
| Secrets | None in repository, bundle, logs; build fails on leak | SEC-420 to SEC-426 |
| Data | Retention job deletes on schedule; no raw IP stored | SEC-402, SEC-403, SEC-413 |
| Supply chain | Lockfile used; scan clean; no unreviewed packages | SEC-620 to SEC-626 |
| Resilience | Restore drill passes; maintenance mode works | SEC-546, SEC-630 |

A professional penetration test of staging by someone outside the team is recommended before launch (OQ-S05), and results are logged in D12.

### Open questions

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-S01 | Security contact address and disclosure policy wording | Amr, chapter lead | Security page with a contact form until an address exists |
| OQ-S02 | Is there a second Lead for bank-detail confirmation at launch? | Amr | Add one before launch; otherwise bank changes blocked (SEC-124) |
| OQ-S03 | Which malware scanning option fits the budget? | Developers | Manual check by Finance until scanning is in place |
| OQ-S04 | When to add HSTS preload? | Developers | After one stable term |
| OQ-S05 | Budget for an external penetration test | Amr | Plan one before public launch |
| OQ-S06 | Is a hardware security key option wanted for Leads? | Amr | Authenticator app only in v1 |
| OQ-S07 | Audit log retention minimum | D09 | 24 months |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-02 | First full draft |


