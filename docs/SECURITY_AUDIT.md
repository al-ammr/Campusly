---
doc_id: D12
title: Security Audit Prompts and Verification Register
file: SECURITY_AUDIT.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Security Auditor
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D05@1.0.0, D06@1.0.0, D08@1.0.0, D10@1.0.0]
---

# D12 Security Audit Prompts and Verification Register

Nov 2, 2026 · @Amr Suleiman & Core Engineering Team

## 1. Document control, scope and authority

D12 holds the security audit prompts, test cases, and verification registers used to validate Campusly against the security specification (`SECURITY_SPEC.md` / D08) and OWASP Application Security Verification Standard (ASVS) Level 2.

| Field | Value |
| --- | --- |
| Document | D12 Security Audit |
| Version | 1.0.0 (Baselined) |
| Phase and gate | Used across P0 to P10; mandatory gate sign-off at G5 and G6 |
| Inputs | D05 (Architecture), D06 (API Contract), D08 (Security Spec), D10 (Prompt Sequence) |
| Feeds | D11 (Audit Prompts), D13 (Deployment Pipeline), D14 (Backlog) |

### Audit Authority & Rules of Engagement

- **AUD-SEC-01: Independent Auditor Execution.** Security audit prompts must run in a clean, isolated session without knowledge of build shortcuts or author rationalizations.
- **AUD-SEC-02: Zero-Tolerance Gate Standard.** Gate G5 and Gate G6 strictly require **0 Critical** and **0 High** security findings. A single open Critical or High defect halts the pipeline immediately.
- **AUD-SEC-03: Evidence-Backed Reporting.** Every finding must cite the exact file, line number, or endpoint, the threat ID (T-01 to T-07), and the violated control from D08 (`SEC-xxx`).

---

## 2. Security audit methodology

Security verification is tiered into two levels depending on phase risk:

1. **Light Check (Phases P0, P1, P2, P3, P6, P9)**:
   - Configuration checks, secrets exposure scans, input schema validation, and header correctness.
2. **Full Audit (Phases P4, P5, P7, P8, P10, and Final G6 Release)**:
   - Full STRIDE threat model walk-through.
   - Active exploit simulations: authentication bypass, privilege escalation, IDOR on private receipts, file upload polyglots, XSS payloads, race conditions on star votes, and rate limit circumvention.

---

## 3. Master security audit prompt

Paste this master instruction into the security auditor's session prior to executing any phase test:

```text
You are an adversarial application security auditor evaluating Campusly.
Your objective is to identify vulnerabilities, privilege escalations, information leaks, and business logic bypasses.
Authority documents:
- D08 Security Specification (all SEC-xxx requirements are mandatory)
- D06 API Contract (endpoint shapes, error codes, auth modes)
- D05 Architecture & Data Model (database constraints, private storage rules)
- D07 Business Rules (status transitions, payment confirmation, star limits)

AUDIT RULES:
1. Search code and configurations for actual implementation flaws; do not make assumptions.
2. Verify input sanitization, output encoding, authentication token storage, CORS, CSP, and database queries.
3. Test every edge case in payments and receipts: verify that no unconfirmed transfer can activate a listing.
4. Output findings using the standard finding format:
   FINDING-ID | Severity (Critical/High/Medium/Low) | D08 Control Violated | File:Line | Vulnerability Description | Exploit Scenario | Remediation Direction
5. Summarize with total finding counts and a clear PASS or FAIL verdict against Gate criteria (0 Critical, 0 High required to pass).
```

---

## 4. Canonical security test suite (`SA-001` to `SA-025`)

### Group A: Admin Authentication & Session Security

| ID | Test Target | Verification Steps | Pass Criteria | D08 Ref |
| --- | --- | --- | --- | --- |
| **SA-001** | Password Storage & Hashing | Inspect password creation and authentication logic. | Uses Argon2id or bcrypt (cost factor $\ge 12$). Plaintext or weak hashes never stored. | SEC-101 |
| **SA-002** | Multi-Factor Authentication (MFA) | Attempt admin login with valid password but missing/invalid TOTP. | Login fails with `401 Unauthorized`; session cookie is withheld until MFA passes. | SEC-103 |
| **SA-003** | Brute-Force & Lockout | Send 5 failed login attempts within 15 minutes. | 6th attempt returns `429 Too Many Requests` or lockout response; IP logged. | SEC-105 |
| **SA-004** | Session Cookie Configuration | Inspect `Set-Cookie` header on `/api/v1/admin/login`. | Cookie contains `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/admin`. Session bound to IP/UA hash. | SEC-108 |

### Group B: Financial Integrity & Bank Detail Protection

| ID | Test Target | Verification Steps | Pass Criteria | D08 Ref |
| --- | --- | --- | --- | --- |
| **SA-005** | Bank Account Modification | Send request to change bank details with Reviewer or Finance role. | Request rejected with `403 Forbidden`. Only Lead role can initiate. | SEC-120 |
| **SA-006** | Two-Person Approval for Bank Change | Attempt bank detail update without a second admin confirmation. | Update remains in pending state; bank details shown to payers do not update. | SEC-121 |
| **SA-007** | Payment Activation Verification | Call `POST /api/v1/admin/spotlight/{id}/activate` on an unconfirmed payment. | Request rejected with `400 Bad Request`. `confirmed_in_bank` flag must be `true`. | SEC-510 |

### Group C: Receipt Privacy & Storage Access Control

| ID | Test Target | Verification Steps | Pass Criteria | D08 Ref |
| --- | --- | --- | --- | --- |
| **SA-008** | Direct Public Access to Receipts | Request an uploaded receipt file directly via public CDN URL. | Returns `403 Forbidden` or `404 Not Found`. Evidence bucket is private. | SEC-410 |
| **SA-009** | Ephemeral Signed URL Expiry | Generate a signed URL for receipt review and test access after 6 minutes. | Access denied (`ExpiredToken` / `403`). URL lifespan strictly $\le 5$ minutes. | SEC-412 |
| **SA-010** | IDOR on Receipt Download | Access another user's receipt using an anonymous device token. | Returns `401 Unauthorized` or `403 Forbidden`. Only authenticated admins can fetch evidence. | SEC-413 |
| **SA-011** | PDF Evidence Handling | Upload a PDF containing JavaScript or active form content. | Upload scanned/stripped; served only with `Content-Disposition: attachment` and `nosniff`. | SEC-225 |

### Group D: File Uploads & Input Sanitization

| ID | Test Target | Verification Steps | Pass Criteria | D08 Ref |
| --- | --- | --- | --- | --- |
| **SA-012** | Magic Byte File Type Validation | Rename a `.php` or `.exe` script to `.jpg` and upload. | Server inspects binary magic bytes and rejects file with `400 Bad Request`. | SEC-220 |
| **SA-013** | Image Re-Encoding & EXIF Stripping | Upload a photo with GPS and device metadata. | Server decodes and re-encodes image to WebP, stripping all EXIF and GPS tags. | SEC-222 |
| **SA-014** | Upload File Size Constraints | Attempt upload of a 6MB listing image or 10MB receipt. | Upload rejected with `413 Payload Too Large`. Caps: 5MB for images, 8MB for receipts. | SEC-223 |
| **SA-015** | Stored XSS in Descriptions | Submit listing with `<script>alert(1)</script>` or `<img onerror=...>` in title/body. | Content saved as plain text; rendered safely with escaped HTML or plain text node. | SEC-201 |
| **SA-016** | External Link Scheme Validation | Submit a club link with `javascript:steal()` or `data:...`. | Server validation rejects URL. Only `https://` schemes permitted. | SEC-205 |
| **SA-017** | Content Security Policy (CSP) | Inspect HTTP response headers on public and admin pages. | Response includes restrictive CSP forbidding inline script execution (`unsafe-inline` blocked). | SEC-310 |

### Group E: Star Anti-Abuse, Rate Limits & Secrets

| ID | Test Target | Verification Steps | Pass Criteria | D08 Ref |
| --- | --- | --- | --- | --- |
| **SA-018** | Duplicate Star Prevention | Send multiple star votes for the same listing using one device token. | 1st vote increments count; subsequent votes return existing status without duplicate counting. | SEC-501 |
| **SA-019** | New Device Star Cooldown | Create a new device token and immediately vote within 10 seconds. | Request rejected with `429 Too Many Requests` or cooldown notice (60s delay required). | SEC-502 |
| **SA-020** | Star Burst Rate Limiting | Send 50 star requests to a single listing within 5 minutes. | Rate limiter activates; excess requests discarded and flagged in audit log. | SEC-505 |
| **SA-021** | Report Spam Protection | Send 10 reports from a single device within 1 hour. | Device rate-limited after 3 reports per 24 hours. Auto-hide requires distinct device hashes. | SEC-520 |
| **SA-022** | Secrets in Client Bundles | Scan client JavaScript build bundles for environment variable leaks. | Zero API keys, JWT secrets, database connection strings, or cron secrets in client JS. | SEC-420 |
| **SA-023** | Scheduled Job Secret Protection | Call `/api/v1/jobs/expire-spotlight` without bearer secret. | Request rejected with `401 Unauthorized`. Constant-time comparison used for secret token. | SEC-130 |
| **SA-024** | SQL Injection Resistance | Send SQL injection payloads (`' OR 1=1 --`) in search and filter parameters. | Query executed via parameterized query builder / ORM. Zero SQL syntax error leakage. | SEC-210 |
| **SA-025** | Database Row-Level Security | Attempt direct client connection to PostgreSQL using public app role. | Direct access denied; tables restricted to backend server connection pool only. | SEC-405 |

---

## 5. Phase-specific security audit prompts

### Phase P4 Security Audit Prompt (Submissions & Uploads)
```text
Run Security Audit SA-P4 against branch bp-04-submission-forms.
Test cases to execute: SA-012, SA-013, SA-014, SA-015, SA-016, SA-021, SA-024.
Verify:
1. Community, Event, Opportunity submission validation schemas.
2. File upload processing: verify magic byte checking, WebP conversion, and size limits.
3. Anti-spam: honeypot field presence, minimum submission duration, and 24h per-device caps.
```

### Phase P5 Security Audit Prompt (Admin Auth & Review Queue)
```text
Run Security Audit SA-P5 against branch bp-05-admin-approval.
Test cases to execute: SA-001, SA-002, SA-003, SA-004, SA-010, SA-022.
Verify:
1. Admin authentication endpoints, password hashing, and MFA TOTP verification.
2. Session cookies: HttpOnly, Secure, SameSite=Strict, path scoping, and IP binding.
3. Review queue authorization: unauthenticated requests cannot approve, reject, or verify listings.
```

### Phase P7 Security Audit Prompt (Spotlight Checkout, Payments & Stars)
```text
Run Security Audit SA-P7 against branch bp-07-spotlight.
Test cases to execute: SA-007, SA-008, SA-009, SA-010, SA-018, SA-019, SA-020.
Verify:
1. Payment activation gate: listing cannot enter Active status without confirmed_in_bank = true.
2. Receipt storage: private S3 bucket, signed ephemeral URLs expiring <= 300s.
3. Star voting: 1 vote per device per listing, 60s cooldown for new devices, atomic Redis counters.
```

### Phase P10 & Final Release Security Audit Prompt (Full System)
```text
Run Full Security Audit SA-FULL against the Release Candidate.
Execute all 25 test cases (SA-001 through SA-025).
Perform:
1. End-to-end STRIDE threat walkthrough on public and admin routes.
2. Production header verification: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
3. Complete dependency vulnerability audit (npm audit --audit-level=high).
4. Review of all secret configurations and environment isolation.
Output findings table and sign-off recommendation for Gate G6.
```

---

## 6. Security audit results register template

| Run ID | Date | Phase / Branch | Auditor | Tests Executed | Critical | High | Med | Low | Gate Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SAR-P0-01 | YYYY-MM-DD | P0 / `bp-00-setup` | Lead Auditor | SA-024, SA-025 | 0 | 0 | 0 | 0 | **PASSED** |
| SAR-P4-01 | YYYY-MM-DD | P4 / `bp-04-forms` | Lead Auditor | SA-012 to SA-016, SA-021 | 0 | 0 | 0 | 0 | **PASSED** |
| SAR-P5-01 | YYYY-MM-DD | P5 / `bp-05-admin` | Lead Auditor | SA-001 to SA-004, SA-010 | 0 | 0 | 0 | 0 | **PASSED** |
| SAR-P7-01 | YYYY-MM-DD | P7 / `bp-07-spotlight` | Lead Auditor | SA-007 to SA-010, SA-018 to SA-020 | 0 | 0 | 0 | 0 | **PASSED** |
| SAR-G6-01 | YYYY-MM-DD | Release Candidate | Lead Auditor | All SA-001 to SA-025 | 0 | 0 | 0 | 0 | **PASSED** |

---

## 7. Change log

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 1.0.0 | 2026-11-02 | Amr Suleiman & Lead Software Engineer | First canonical release: authored test suite SA-001 to SA-025, master and phase prompts, ASVS Level 2 alignment, and verification log. Baselined for Gate G4. |


