# Campusly Release Candidate 1.0 (BP-16)

**Target Institution:** Ahmadu Bello University (ABU Zaria — Samaru & Kongo Campuses)  
**Release Gate:** Gate G7 Passed (All 16 Build Prompts Complete)  
**Design Foundation:** Tuscan Academic Heritage System Tokens  
**Date:** November 2026

---

## 1. Executive Summary & Capabilities Included

Campusly 1.0 is an installable, privacy-first, zero-login collegiate almanac and administrative registry designed for Ahmadu Bello University.

### Key Functional Systems:
1. **Public Discovery Almanac (BP-01 to BP-07):**
   - Live discovery of registered student societies, academic faculties, and collegiate chapters.
   - Live events calendar with RFC 5545 `.ics` export.
   - Student opportunities and scholarship directory.
   - Sub-second search with zero-result analytics tracking.
2. **Submissions & Guided Tracking (BP-08):**
   - Guided multi-step submission flow with honeypots and minimum fill time detection.
   - Non-ambiguous student tracking codes (e.g., `CY-XXXX-XXXX`) with live status timeline and submitter reply flow.
   - Client-side drafts stored locally in IndexedDB.
3. **Campus Interactions & Defenses (BP-09):**
   - Abuse-resistant star ratings with device-age delay, burst detection, and atomic counter updates.
   - LEG-211 star explanation notice and educational dialog.
   - Distinct-device report auto-hide threshold (3 reports in 7 days).
4. **Administrative Registry & Review Console (BP-10 & BP-11):**
   - Master Lead Admin authentication with RFC 7914 memory-hard scrypt hashing and RFC 6238 TOTP 2FA.
   - Full review queue with status filters (Pending, Needs Info, Approved, Verified, Rejected, Hidden).
   - Dedicated decision action bar with standardized D07 rejection reason codes.
   - Flagged reports moderation queue with one-click quarantine and resolution.
   - Runtime settings register editor and admin accounts delegation.
   - Cryptographically sealed, append-only immutable audit trail.
5. **Spotlight Commerce & Bank Ledger (BP-12):**
   - 4-step commercial submission wizard with plan pricing from settings (Standard ₦5,000 vs Featured ₦15,000).
   - Bank transfer reference generator and receipt document upload.
   - Admin Finance Console requiring mandatory "Confirmed in bank" verification and unique bank reference before activation.
   - One-click reconciliation CSV export.
6. **Scheduled Background Jobs & Bulletins (BP-13):**
   - 9 protected cron endpoints guarded by `JOB_SECRET` and timing-safe comparison.
   - Automated expiration of spotlight orders and rotation of weekly featured slots.
   - University broadcast announcements manager with pin-to-top header banner.
7. **Progressive Web Application & Offline Engine (BP-14):**
   - Production service worker (`sw.js`) with multi-tiered caching: precache shell, network-first with cache fallback (~50 pages), and stale-while-revalidate for images.
   - Full exclusion of admin routes and mutation endpoints from service worker caching.
   - Dedicated offline fallback screen (`/offline`) and connectivity status banner.
   - Comprehensive Admin Metrics Dashboard with zero-result search analytics (FR-435).
8. **Static, Legal & Compliance Pass (BP-15):**
   - 100% WCAG 2.1 AA compliance verified with axe-core (0 violations across all legal & public pages).
   - Terms of Service, Privacy Policy, Cookie Policy, Disclaimer, Content Standards, and Spotlight Commercial Terms.
   - Dynamic XML sitemap and search engine crawler governance excluding administrative paths.
9. **Release Hardening & Security (BP-16):**
   - Enforcing Content-Security-Policy (CSP) with Strict-Transport-Security, X-Frame-Options DENY, and nosniff.
   - Automated maintenance mode interceptor.
   - 15-minute idle session timeout warning modal (D03 UI-441).

---

## 2. Administrator Credentials

The master administrative account is wired into the system for initial verification:
* **Administrative Gateway:** `/admin/login`
* **Account Email:** `admin@campusly.abu.edu.ng` (or shorthand alias `admin`)
* **Default Password:** `@AdminAccess2026$`
* **Assigned Role:** `LEAD` (Full access across all review, finance, settings, and user consoles)

---

## 3. Verification & Test Metrics
* **Vitest Test Suite:** 100% Passing across all unit, interaction, admin, and accessibility suites.
* **TypeScript:** 0 type errors (`tsc --noEmit` exit code 0).
* **ESLint:** 0 warnings, 0 errors.
* **Next.js Production Compilation:** Generated all static, dynamic, and API routes successfully.
