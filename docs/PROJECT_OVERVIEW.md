---
doc_id: D-PRE
title: Campusly Project Overview
file: PROJECT_OVERVIEW.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Auditor
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: []
---

# Campusly — Project Overview

Oct 11, 2026 · @Amr Suleiman

## Vision

Campusly is a mobile-first web app where ABU Zaria students find every club, event, opportunity and student business on campus in one place. It is built by Google Developer Group on Campus (GDGOC) ABU Zaria.

The tagline is "Discover More Beyond the Classroom." A student opens the site and immediately answers one question: what can I get involved in on campus?

Version 1 covers ABU Zaria only, but nothing is hardcoded to it, so other universities can be added later. It ships as an installable web app (PWA) and needs no student login.

## The problem

Students often spend four to five years on campus without learning which clubs, communities, competitions and volunteering options exist. The opportunities are there; discovering them is the gap.

The result is graduates with good grades but little practical experience, network or leadership history. Campus news mostly spreads through WhatsApp, so every listing has to be easy to share there.

## Who it serves

Four groups use Campusly, and only admins need a login in version 1.

| Audience | What they do on Campusly |
| --- | --- |
| Students | Browse, search, join, share and report listings, and star Spotlight businesses. No account needed. |
| Club and community leaders | Submit their community, events and opportunities for review. |
| Business owners | Pay to list a business or product on Spotlight. Anyone can list. |
| Admins (GDGOC team) | Review submissions and payments, verify communities, post announcements. |

## What students can do

Students find and join what is happening on campus quickly, without creating an account.

- **Homepage:** a hero ("Discover More Beyond the Classroom") with a search bar and two buttons, Explore Communities and List Your Community. Below it: "I want to..." chips (Learn, Network, Lead, Volunteer, Build, Compete, Create), category cards, featured communities, upcoming events, latest opportunities, a banner for student organizations, and a footer with About, Contact, Submit and Report a Listing.
- **Search:** one prominent bar that matches names, descriptions, tags and categories, and returns clubs, events and opportunities.
- **Ten categories:** Technology & Digital Skills, Entrepreneurship & Business, Sustainability & Environment, Academic & Professional Development, Leadership & Volunteering, Creative Arts & Media, Sports & Recreation, Science & Research, Health & Wellbeing, Culture & Community. Each opens a page of its communities.
- **Community directory:** simple cards (logo, name, tags, short description, who can join) with filters for category, type (club, community, organization, association, initiative), open to (all students, faculty, department, level) and activity (active, currently recruiting, event coming soon).
- **Community profile:** cover image, logo, short and full description, tags, who can join, requirements, faculty, meeting place and frequency, social links, website and contact. Sections: What We Do, Why Join, Upcoming Activities, Past Activities. A clear Join This Community button sends the student to the club's own link (WhatsApp, form, Telegram, Discord, website or email).
- **Events:** one list of upcoming activities, filtered by category, date, location, organization and type, with Add to Calendar.
- **Opportunities:** workshops, hackathons, competitions, fellowships, scholarships, volunteering, internships, conferences, training, leadership, career and networking events. Each shows title, organization, description, category, date, deadline, location, eligibility and an apply link.
- **Sharing:** every community, event, opportunity, Spotlight listing and announcement has its own URL (for example /communities/gdg-abu) and share buttons for WhatsApp, X and Telegram.
- **Reporting:** every listing has Report this listing, with reasons: does not exist, outdated, wrong link, inappropriate, inactive, other.
- **Feel:** modern, youthful, clean and fast, usable on slow internet, and never like a government portal.

## Submissions and admin review

Anyone can submit a community, event or opportunity, and nothing shows publicly until an admin approves it.

&#91;embedded content: submission review flow · 3 outcomes\]

A new submission waits in Pending, hidden from the public, until an admin approves it, approves and verifies it, or rejects it.

One submission page has three tabs: Community, Event and Opportunity. A community submission asks for the name, logo, description, category, what they do, who can join, meeting place and frequency, social links, contact person and email, join link, faculty or department, and verification information. The student then sees a short "thanks, under review" message.

Admins work from a login-protected dashboard that opens on a Pending Review inbox. For each item they can approve it, approve and mark it verified, or reject it with a reason. The rest of the dashboard covers:

- **Communities:** add, edit, delete, verify, feature on the homepage, disable inactive ones.
- **Events and opportunities:** add, edit, delete, approve submissions, remove expired ones.
- **Categories:** add, edit, delete.
- **Reports:** review what students flag.
- **Spotlight and Announcements:** approve paid listings and publish posts.

## Spotlight

Spotlight is a paid showcase where anyone can list a business or product, and student stars decide the ranking.

1. The owner fills a listing form (name, description, category, images, contact link) and picks Standard or Featured.
2. The checkout page shows the bank name, account name, account number, the exact amount and a unique reference code to use as the transfer narration.
3. The owner transfers the money, uploads the receipt through the form and submits it for approval.
4. An admin confirms the payment and reviews the listing, then approves or rejects it.
5. An approved listing goes live and its paid period starts on approval.
6. When the period ends, the listing leaves the page automatically. The owner can renew through the same checkout.

The public page has two parts. A **Featured** strip is pinned at the top, outside the ranking. Below it, the **Community Ranking** lists every standard listing, ordered strictly by star count. Featured listings also appear in the ranking.

Visitors vote with a star button. There is no downvote. With no logins in version 1, each device gets one star per listing and votes are rate limited; accounts in version 2 will make voting reliable.

## Announcements

Announcements is an admin-only page where the GDGOC team posts blog-style updates, each with a write-up and an image together.

Students can read and share posts but cannot post. Every announcement gets its own URL so it can be shared on WhatsApp, and the latest ones appear on the homepage.

## Trust, verification and safety

Nothing appears publicly until an admin approves it, and communities whose existence has been confirmed carry a Verified badge.

- **Two badges:** Verified (an admin confirmed the community exists and is active) and Community Listing (approved, not yet confirmed).
- **Verification evidence:** an official social media account, university recognition, confirmation from a leader, contact information, and proof of past activities.
- **Reports:** students can flag a listing as nonexistent, outdated, wrong link, inappropriate, inactive or other, and admins review each report.
- **Spotlight safeguards:** payment plus admin review filters out spam. Receipts are visible to admins only, and an admin checks the money in the bank app before approving. A short rules page lists what may not be listed, and a notice says Campusly does not handle sales between buyers and sellers.
- **Security:** admin login, uploads, payments and voting follow a written security spec and are audited before launch.

## Business rules at a glance

A Standard Spotlight listing costs ₦1,000 for 3 days, and a Featured listing costs ₦5,000 for 4 days.

| Plan | Price | Duration | Where it shows |
| --- | --- | --- | --- |
| Standard | ₦1,000 | 3 days | Community Ranking, ordered by stars |
| Featured | ₦5,000 | 4 days | Pinned Featured strip, and also the ranking |

- Every Spotlight listing is paid, and anyone can list.
- Ranking is strictly by star count. There are no downvotes.
- Payment is a manual bank transfer with a receipt upload, confirmed by an admin. The paid period starts on approval.
- Prices and durations are set by admins in the dashboard, not hardcoded.
- Nothing on Campusly is public before admin approval.

## Technology and architecture direction

Campusly is one installable, mobile-first web app (PWA) backed by a database, so no listing is hardcoded in the pages.

- **No student accounts in version 1.** Only admins log in. Student accounts arrive in version 2.
- **Built for more campuses.** Every record links to a university, following University → Categories → Communities → Events → Opportunities, so ABU is never hardcoded.
- **Light and fast.** Pages stay simple and usable on slow connections.
- **Exact stack.** The architecture document fixes the tech stack, folder structure and build phases.

The data is kept in separate tables:

| Entity | Holds |
| --- | --- |
| Universities | The campuses on the platform (ABU Zaria first) |
| Categories and tags | The ten categories and searchable tags; one item can have several tags |
| Communities | Profile details, status, verified and featured flags |
| Events and opportunities | Dates, deadlines, eligibility, links, status |
| Submissions | The pending queue awaiting admin review |
| Reports | Student flags on listings |
| Spotlight listings | Business or product details, plan, status, start and end |
| Plans | Price and duration of Standard and Featured |
| Payments | Reference code, amount, private receipt, status |
| Stars | One per device per listing in version 1 |
| Announcements | Admin posts with text and image |
| Admins | Dashboard logins |
| Users and bookmarks | Created now, used in version 2 |

## How we build

Campusly is built in Waterfall order: every document is signed off before a build prompt runs, and every prompt must pass an audit before the next one starts.

&#91;embedded content: build gate loop · audit and security before merge\]

A failed audit sends the work back to Build; only a full pass is merged and unlocks the next prompt.

Fifteen documents govern the work.

- **Define:** Document Map, PRD, Wireframes, UI/UX Spec, Brand Assets, Architecture Source of Truth, API Contract, Business Rules, Security Spec, Legal Compliance.
- **Build:** Prompt Sequence (numbered, paste-ready prompts for an AI builder, one phase at a time), Audit Prompts (each phase cross-checked against the PRD, API contract and database), Security Audit, Deployment Pipeline.
- **After production:** Agile UX Refinement Backlog. Agile work starts only after the full production build passes its final audits.

The draft prompt phases are P0 setup and database, P1 design shell and PWA, P2 communities, categories, search and filters, P3 events and opportunities, P4 submission forms, P5 admin login, approvals and verification, P6 reports, sharing and link previews, P7 Spotlight, P8 Announcements, P9 metrics, and P10 hardening and deploy prep.

## How the two developers coordinate

The proposed working agreement is one shared repo, the docs as the final word, and a different developer auditing each phase.

- **Docs in the repo.** They live under /docs, and a doc change is a pull request the other developer approves.
- **Driver and auditor.** One developer runs a phase's prompts and commits the result; the other audits it. You swap each phase.
- **One prompt in flight.** A status table tracks each prompt: Not started, Building, Built, Audited, Security passed, Merged.
- **Branch rules.** One branch per phase, no direct commits to main, merge only after the audit passes, and tag each passed phase.
- **Two-person review** for admin login, payments and uploads.
- **Change requests.** A scope change is agreed first, then the doc and its version are updated, then the affected prompts.
- **Secrets** stay out of chat and the repo. Commit an .env.example and keep real values in the hosting settings.
- **Rhythm.** A 10-minute daily check-in (done, next, blocked) and a weekly planning call.

## Roadmap

Version 1 is built and audited first; agile UX refinement follows once it is in production, and accounts and AI features come later.

&#91;embedded content: roadmap · 4 phases, 1 gate\]

Phases are shown in order, not to scale; no dates are set yet.

## Success metrics

Success is measured by students discovering and joining communities, not by raw website traffic.

- Communities listed, and how many are verified
- Events and opportunities listed
- Students discovering communities
- Clicks on Join
- Community submissions received
- Communities that are active
- Spotlight paid listings and revenue

The guiding question: did Campusly help more students find and take part in meaningful opportunities before they graduate?

## Open decisions

These are the points still to settle before the documents are signed off.

- [ ] "I want to..." chips: shortcut filters in version 1, with the full recommendation quiz later?
- [ ] Bookmarks: saved only on the student's own device in version 1, or skipped?
- [ ] Admin accounts: one shared login or several named admins?
- [ ] Featured slots: a cap on pinned listings at once (5 suggested), with extras waiting?
- [ ] Multi-period payments: let owners pay for 1, 2 or 4 periods in one transfer?
- [ ] Ranking details: ties go to the newest listing, and the Featured strip rotates its order?
- [ ] Announcements: draft and pin options?
- [ ] Refund rule for a paid listing that gets rejected.
- [ ] Bank account: an official GDGOC or organization account for transfers.
- [ ] Developer split: who owns backend and security, and who owns frontend and UX?


