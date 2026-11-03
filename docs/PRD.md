---
doc_id: D01
title: Product Requirements Document (PRD)
file: PRD.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Auditor
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, PROJECT_OVERVIEW@1.0.0]
---

# Campusly Product Requirements Document

Nov 2, 2026 · @Amr Suleiman & Core Engineering Team

## Document control

This PRD is baselined at version 1.0.0 at Gate G1. It fixes what Campusly version 1 contains and what it leaves out, and under D00 it owns features, user stories, exclusions and success metrics.

| Field | Value |
| --- | --- |
| Document ID | D01 |
| File | PRD.md |
| Project | Campusly, by Google Developer Group on Campus (GDGOC) ABU Zaria |
| Version | 1.0.0 (Baselined at Gate G1) |
| Status | Baselined |
| Last updated | 2026-11-02 |
| Author, reviewer, approvers | Amr Suleiman (Lead) & Lead Software Engineer |
| Depends on | D00 Document Map @ 1.0.0, PROJECT_OVERVIEW.md @ 1.0.0 |
| Inputs | The Campus Clubs & Opportunities Platform product concept and development brief (30 sections, cited here as B1 to B30); decisions DEC-001 to DEC-010 in D00; the Campusly project overview |
| Owns | What Campusly is, who it serves, features, user stories, version 1 scope, exclusions, success metrics and metric definitions |
| Does not own | Spotlight plans, prices, durations, slot cap, statuses, ranking tie-breaks, expiry and refund rules (D07); layouts (D02); colours, type and components (D03, D04); tables and fields (D05); endpoints (D06); security controls (D08); legal text (D09) |
| Unlocks | D02, D03, D04, D05 and D09, once this document and D07 are baselined at Gate G1 |

How to read it: every requirement has an ID, a priority and a source, defined in "How requirements are written". A source of ADD marks an addition the brief does not contain. Additions are proposals until the open question that lists them is answered. Where a requirement needs a rule or value that D07 owns, it points to D07 instead of stating the value, so the two documents cannot disagree.

## Executive summary

Campusly version 1 is an installable web app, with no student logins, where ABU Zaria students find every club, event, opportunity and student business on campus, and where the GDGOC admin team approves everything before it goes public.

It turns the brief's core idea, "a discovery platform for everything students can do outside the classroom" (B2), into a product a student can use in under a minute: open it, pick an interest or search, read what a community does, and tap **Join This Community** to reach the organization's own WhatsApp group, form or page. Campusly does not run memberships itself in version 1 (B6).

Version 1 has eight capabilities.

1. **Discover.** A homepage, one search bar, ten categories, filters and a community directory (B3 to B5, B10).
2. **Decide.** A profile for every community: what it does, why join, who can join, upcoming and past activities, and a Verified or Community Listing badge (B6, B14).
3. **Act.** Join, Apply, Add to Calendar, and Share to WhatsApp, X and Telegram, each reaching the real organization (B6, B8, B24).
4. **Contribute.** Anyone can submit a community, event or opportunity. Nothing is public until an admin approves it (B12, DEC-003).
5. **Govern.** An admin dashboard for review, verification, featuring, reports and an audit trail (B13, B14, B25).
6. **Spotlight.** A paid page where anyone can list a business or product, visitors give stars, and a Featured strip sits outside the ranking (DEC-004, DEC-005).
7. **Announce.** An admin-only, blog-style page for write-ups with images (DEC-007).
8. **Install.** A progressive web app that works on slow connections (B17, DEC-002).

Version 1 deliberately leaves out student accounts, login-based voting, downvotes, automated payments, recommendation features and a multi-university interface. They are parked for later versions (see "Parked ideas").

The measure of success is not traffic. It is whether more students discover and take part in meaningful opportunities before they graduate (B30). The headline measure is the number of distinct devices that click Join or Apply each month, defined in "Success metrics and analytics events".

**Requirement index**

| Module | Requirement IDs |
| --- | --- |
| Global shell and navigation | FR-001 to FR-019 |
| Homepage | FR-020 to FR-039 |
| Search | FR-040 to FR-059 |
| Categories and community directory | FR-060 to FR-079 |
| Community profile | FR-080 to FR-109 |
| Events | FR-110 to FR-134 |
| Opportunities | FR-135 to FR-159 |
| Sharing, calendar and link previews | FR-160 to FR-179 |
| Reporting | FR-180 to FR-194 |
| Submissions | FR-195 to FR-229 |
| Admin dashboard | FR-230 to FR-279 |
| Spotlight public page, listing and checkout | FR-280 to FR-329 |
| Spotlight admin, payments and expiry | FR-330 to FR-369 |
| Announcements | FR-370 to FR-389 |
| PWA and offline | FR-390 to FR-409 |
| Static and trust pages | FR-410 to FR-429 |
| Analytics events | FR-430 to FR-449 |
| Non-functional requirements | NFR-001 onward |

ID ranges are reserved per module so new requirements can be added without renumbering. Gaps inside a range are normal.

## Problem and opportunity

ABU Zaria students can spend four to five years on campus without learning which communities, competitions, volunteering options and activities exist. The problem Campusly solves is discoverability, not a shortage of opportunities (B1).

A student may care about technology, entrepreneurship, volunteering, sustainability, sports, leadership or research and still not know which organizations exist, what they do, how to join, or when they meet. The result can be graduates with good grades but limited practical experience, networks, leadership history, projects and exposure outside the classroom (B1). Campus information travels mostly through WhatsApp (B24), which is fast but hard to search and easy to miss.

**Positioning.** For ABU Zaria students who want to get involved beyond the classroom, Campusly is a campus discovery platform that shows every community, event and opportunity in one searchable place and sends students straight to the organization. Unlike scattered WhatsApp groups and posters, its listings are reviewed, current and shareable (see assumption A-01).

The table lists the pains each group is assumed to have. They come from the brief and the team's knowledge of campus life, and they are hypotheses to validate (OQ-P24).

| Who | Pain today (assumed) | What Campusly changes |
| --- | --- | --- |
| Student with no particular interest yet | Does not know what exists or where to start | Browse by category and "What are you looking for?" chips, then see what each community does |
| Student with a specific interest | Cannot search across campus for "debate" or "photography" | One search over communities, events and opportunities |
| Community leader | Members are hard to reach beyond their own group; no public profile | A profile, a Join button and a share link, reviewed and badged |
| Event or opportunity organizer | Notices reach only people already in the group | One campus-wide list with filters and Add to Calendar |
| Business owner or student entrepreneur | No campus-wide shop window | A paid Spotlight listing with stars and an optional Featured slot |
| GDGOC admin team | No single view of what exists, what is active and what is stale | A review queue, verification, reports and metrics |

**Opportunity.** GDGOC is a trusted convener, so a platform it runs and verifies can become the default place to look. The same data (searches, Join clicks, missing communities) shows what students want and where the gaps are. Spotlight can help fund the platform (DEC-004). If the model works at ABU, the same structure can extend to other Nigerian universities and potentially Africa (B27).

## Goals, non-goals and principles

Version 1 has eight goals, each tied to metrics defined later in this document. Targets are set after a baseline period (OQ-P22), so no numbers are promised here.

| ID | Goal | What success looks like | Metrics |
| --- | --- | --- | --- |
| G-01 | Make campus opportunities discoverable | A student finds a relevant community or opportunity quickly | M-06, M-10, M-11 |
| G-02 | Turn discovery into participation | Students reach the organization and apply | M-01, M-07, M-12 |
| G-03 | Keep a complete, current catalogue | Many communities, events and opportunities, and few stale ones | M-02, M-04, M-05, M-09, M-16 |
| G-04 | Make listings trustworthy | Verified badges mean something; problems are fixed fast | M-03, M-14, M-17 |
| G-05 | Make contributing easy | Leaders submit in minutes and hear back quickly | M-08, M-14, M-15 |
| G-06 | Fund the platform through Spotlight | Paid listings that are reviewed, honest and renewed | M-18, M-19, M-21 |
| G-07 | Work well on phones and slow internet | Fast pages, installable app | M-22, M-23 |
| G-08 | Be ready to expand | A second university can be added without rebuilding | NFR-030 |

**Non-goals.** Version 1 is explicitly not the following.

| ID | Not a... | Meaning |
| --- | --- | --- |
| NG-01 | Membership system | Campusly does not collect member lists, fees or applications. It sends students to the organization's own joining method (B6). |
| NG-02 | Social network | No student profiles, posts, comments or chat. |
| NG-03 | Marketplace | Spotlight is a paid shop window. Campusly takes no orders, holds no buyer money and does not settle disputes. |
| NG-04 | Ticketing tool | Events link to external registration. |
| NG-05 | Website builder | Communities keep their own sites and pages. |
| NG-06 | University portal | It must not look or feel like a government or university portal (B29). |
| NG-07 | Personalized feed | No recommendations in version 1 (B9, B16). |

**Product principles.** When two options conflict, the lower number wins.

1. **Simplicity first (B29).** A student should not need to read a long page to understand a community. Cards summarize and profiles lead with Join.
2. **Answer "What can I get involved in?" in seconds (B2).** The first screen must make the purpose obvious.
3. **Hand students to the real organization (B6, B28).** Campusly sends people on; it never traps them.
4. **Nothing public without review (B12, DEC-003).** Trust matters more than speed.
5. **Honest ranking (DEC-005).** Stars decide rank. Payment buys visibility time, not a better position inside the ranking.
6. **Share-ready by default (B24).** Every public item has its own URL and a good link preview.
7. **Light and fast on phones (B17).** Weight, data use and tap targets are design constraints, not polish.
8. **No login in version 1 (DEC-002).** No feature may require a student account. Anything that needs identity waits for version 2.
9. **Nothing hard-coded (B23, B27).** Content, categories, plans, prices and bank details are data an admin can change.
10. **Humans stay in the loop.** Automation may expire, flag and remind. It never publishes.

## Users and personas

Campusly has four kinds of users and one kind of abuser to design against. The personas are representative roles, not real individuals.

| Persona | Context | Goals | Frustrations | Main requirements |
| --- | --- | --- | --- | --- |
| Fresher explorer | New to campus, unsure what to join, uses a phone, may have limited mobile data (B17) | See what exists and pick a few things to try | Does not know where to start; information is scattered | Homepage chips, categories, simple cards, Join (FR-020 to FR-028, FR-060 to FR-065) |
| Focused seeker | Knows an interest such as debate, photography or AI | Find matching communities and events fast | Has to ask around or scroll WhatsApp groups | Search, filters, profiles (FR-040 to FR-053, FR-066 to FR-070) |
| Community leader or organizer | Runs a club, society or event; mostly on a phone; may be non-technical | List the community, gain members and attendance, keep details current | Hard to reach students outside the group; no way to show credibility | Submission, badge, Suggest an edit, Share (FR-195 to FR-212, FR-091, FR-203) |
| Business owner (anyone) | Sells a product or service to students; pays by bank transfer | Cheap, quick campus visibility; renew easily | Unsure who will see the listing; wary of paying | Spotlight listing, checkout, status, stars, Featured (FR-280 to FR-304) |
| GDGOC admin reviewer | A volunteer on phone or laptop with limited time | One queue, clear evidence, safe payment checks | Spam, unclear evidence, fear of approving something fake | Admin dashboard, verification, payments (FR-230 to FR-258, FR-330 to FR-345) |

**Abusers to design against**

| Abuser | Motive | Main countermeasures |
| --- | --- | --- |
| Fake organization submitter | Borrow credibility or drive traffic to a scam | Admin review, verification checklist, badges (FR-236, FR-247) |
| Vote manipulator | Push a Spotlight listing up the ranking | One star per device, rate limits, spike flags (FR-285, FR-306, FR-341) |
| Scam or counterfeit lister | Sell something fraudulent to students | Payment plus review, rules page, reports, bans (FR-303, FR-180, FR-341) |
| Receipt forger | Get a free or cheaper listing | Admin confirms the credit in the bank, duplicate receipt checks (FR-331, FR-336) |
| Bot or spammer | Flood forms and reports | Honeypot, rate limits, limits on uploads (FR-199, FR-183) |
| False reporter | Take down a rival listing | Reports flag but never auto-hide (FR-187) |
| Account or bank-details attacker | Redirect Spotlight payments | Protected admin login and extra checks on bank changes (FR-231, FR-257) |

**Roles and permissions in version 1**

| Capability | Visitor | Submitter or lister (no login) | Admin |
| --- | --- | --- | --- |
| Browse, search and read any public page | Yes | Yes | Yes |
| Join, apply, add to calendar, share, report | Yes | Yes | Yes |
| Give a star on a Spotlight listing | Yes, once per device per listing | Yes | Yes |
| Submit a community, event or opportunity | No | Yes, goes to Pending | Yes, can publish directly |
| List a business or product (paid) | No | Yes | Yes, can create on behalf of a lister |
| See the status of their own submission | No | Yes, with reference | Yes |
| Approve, reject, verify, feature | No | No | Yes |
| Edit or delete any listing | No | No | Yes |
| View receipts and submitter contact details | No | No | Yes |
| Publish announcements | No | No | Yes |
| Change plans, prices and bank details | No | No | Yes |

## Version 1 scope

Version 1 is the brief's Phase 1 MVP (B26) plus three decisions made since: Spotlight (DEC-004, DEC-005), Announcements (DEC-007) and the installable web app (DEC-002).

**In scope**

| Module | Included | Source |
| --- | --- | --- |
| Homepage | Hero, search, chips, categories, featured communities, upcoming events, latest opportunities, organizer banner, footer | B3, B19 |
| Search | One search over communities, events and opportunities | B4 |
| Categories | Ten launch categories, each with its own page | B5 |
| Community directory | Cards, filters, tags, activity states | B10, B20 |
| Community profiles | Full profile, Join button, badge, share and report | B6, B14 |
| Events | List, filters, detail page, Add to Calendar | B8, B21 |
| Opportunities | Types, list, filters, detail page, expiry | B7, B22 |
| Sharing | Unique URLs, share buttons, link previews | B24 |
| Reporting | Report this listing, admin queue | B25 |
| Submissions | Community, event and opportunity forms, no login | B12 |
| Admin dashboard | Review queue, approve, reject, verify, feature, manage content, reports, audit log | B13 to B15 |
| Spotlight | Paid listings, checkout by bank transfer, stars, Featured strip, expiry, payment approval | DEC-004, DEC-005 |
| Announcements | Admin-only blog-style posts with images | DEC-007 |
| Installable app | PWA, mobile-first, offline-friendly | B17, DEC-002 |
| Metrics | Success metrics and an admin overview | B30 |
| Trust and info pages | About, Contact, how verification works, submission guidelines, Spotlight rules, privacy, terms | B19, ADD |
| Expansion readiness | Data model that supports more universities, with no multi-university interface | B23, B27 |

**Added beyond the brief's MVP**

| Addition | Why |
| --- | --- |
| Spotlight, Announcements, installable app | Decisions DEC-002, DEC-004, DEC-005 and DEC-007 |
| Link previews for WhatsApp, Telegram and X | Campus information spreads through WhatsApp (B24) |
| Admin audit log and extra checks on bank-detail changes | Protect payments and accountability |
| Suggest an edit, submission tracking, listing freshness checks | Keep listings current without student accounts |
| Bottom navigation, dark mode, empty and error states | Phone usability and polish |

The additions marked ADD in the requirement tables are proposals until OQ-P03 is answered.

**Explicit exclusions**

| ID | Excluded from version 1 | Reason | Where it goes |
| --- | --- | --- | --- |
| X-01 | Student accounts and logins | DEC-002 | Version 2 |
| X-02 | Login-based or verified voting | DEC-006 | Version 2 |
| X-03 | Downvotes | DEC-005 | Scrapped |
| X-04 | Online payment gateway and automatic payment confirmation | Spotlight uses manual bank transfer | Version 2 candidate |
| X-05 | Recommendations, interest quiz, "What should I join?" | B9, B16: after the MVP | Later; version 1 chips are only shortcut filters (OQ-P02) |
| X-06 | Saved or bookmarked items | B11 allows it only if accounts exist | Pending OQ-P01; if approved, device-only (FR-079) |
| X-07 | Notifications and email digests to students | B26 Phase 2 | Version 2 |
| X-08 | Month calendar view and calendar subscriptions | B26 Phase 2 | Version 2 |
| X-09 | Organizer dashboards and community analytics | B26 | Version 2 and 3 |
| X-10 | Student profiles and admin management of student users | B13, B26 | Version 2 |
| X-11 | Multi-university interface and inter-campus discovery | B26, B27 | Version 3 (data ready now) |
| X-12 | AI recommendations, matching, natural-language search | B26 Phase 3 | Version 3 |
| X-13 | Comments, reviews, chat and messaging | NG-02 | Not planned |
| X-14 | In-app memberships, applications, ticketing | NG-01, NG-04 | Not planned |
| X-15 | Native iOS and Android apps | The installable web app covers it | Not planned |
| X-16 | Organizer self-service accounts | No logins in version 1 | Version 2; Suggest an edit covers it meanwhile |
| X-17 | Order processing, escrow or delivery for Spotlight sales | NG-03 | Not planned |
| X-18 | Languages other than English | Pending OQ-P11 | Open |
| X-19 | Any automatic publishing of content | Principle 4 and 10 | Never |

## Site map

&#91;embedded content: site map · 5 groups, 1 protected\]

All pages are public except the admin area. The wireframes (D02) give each page its own WF ID; the URLs below are indicative, and only the three patterns in B24 are fixed.

| Page | Indicative URL | Access | Module |
| --- | --- | --- | --- |
| Home | / | Public | Homepage |
| Search results | /search?q= | Public | Search |
| Categories | /categories | Public | Categories |
| Category page | /categories/{slug} | Public | Categories |
| Communities | /communities | Public | Directory |
| Community profile | /communities/{slug} | Public | Profile |
| Events | /events | Public | Events |
| Event page | /events/{slug} | Public | Events |
| Opportunities | /opportunities | Public | Opportunities |
| Opportunity page | /opportunities/{slug} | Public | Opportunities |
| Submit (Community, Event, Opportunity tabs) | /submit | Public | Submissions |
| Submission confirmation and tracking | /track | Public with reference | Submissions |
| Report a listing | /report | Public | Reporting |
| Spotlight | /spotlight | Public | Spotlight |
| Spotlight listing | /spotlight/{slug} | Public | Spotlight |
| List your business | /spotlight/list | Public | Spotlight |
| Checkout and receipt upload | /spotlight/checkout/{reference} | Public with reference | Spotlight |
| Announcements | /announcements | Public | Announcements |
| Announcement post | /announcements/{slug} | Public | Announcements |
| About, Contact, FAQ | /about, /contact, /faq | Public | Static pages |
| How verification works, Submission guidelines | /verification, /guidelines | Public | Static pages |
| Spotlight rules | /spotlight/rules | Public | Static pages |
| Privacy and Terms | /privacy, /terms | Public | Static pages |
| Offline, not found, error | Served by the app | Public | Shell |
| Admin sign-in and all admin pages | /admin/... | Admin only | Admin dashboard |

D06 must reserve paths such as list, rules and checkout so they can never collide with a listing slug.

## Key journeys

Four journeys carry the product. The first is the brief's core experience (B28) and every design decision is judged against it.

**J1. A student discovers a community and joins it**

1. Hears about Campusly, usually through a WhatsApp message or a shared link.
2. Opens the site on a phone and sees "Discover More Beyond the Classroom".
3. Types a search, or taps a "What are you looking for?" chip or a category.
4. Sees relevant community cards and narrows them with filters if needed.
5. Opens a profile and reads what the community does and why to join.
6. Sees its upcoming activities.
7. Taps **Join This Community** and lands on the organization's own WhatsApp group, form or page.
8. Optionally adds an event to a calendar or shares the community with friends.

Success: the student reaches the organization's own channel. Edge cases: a search with no results suggests browsing categories and offers List Your Community; a broken join link shows the contact details and flags the listing; a repeat visit with no connection still shows pages already seen.

**J2. A community leader gets listed**

1. Taps List Your Community from the hero, header, banner or footer.
2. Fills in the Community form, uploads a logo and adds verification information.
3. Submits and sees a confirmation with a reference and what happens next.
4. An admin reviews the submission, may edit it or ask for more information, then approves it, approves and verifies it, or rejects it with a reason.
5. The leader hears the outcome through the contact they gave and can check status with the reference.
6. The listing goes public. The leader shares its link and later sends corrections with Suggest an edit.

Success: a leader finishes the form in minutes and gets a decision. Edge cases: a likely duplicate is flagged before submission; a rejected submission can be corrected and sent again.

**J3. A business owner lists on Spotlight**

1. Opens Spotlight and taps List your business or product.
2. Fills in the listing form and picks Standard or Featured. Price and duration come from the plans an admin has set.
3. Reaches checkout, which shows the bank name, account name, account number, exact amount and a reference code. Pays by bank transfer.
4. Returns to upload the receipt with the payer details and submits for approval.
5. Sees the status move to Receipt submitted.
6. An admin confirms the money reached the bank account, reviews the listing and approves it.
7. The listing goes live in the ranking, and in the Featured strip if Featured. Visitors give stars.
8. Before the period ends the owner is reminded. The listing then expires by itself and can be renewed through the same checkout.

Success: a paid, approved listing is live and later renewed or cleanly retired. Edge cases: the wrong amount, an unreadable receipt, a rejected listing with a refund, or Featured slots that are full.

**J4. An admin reviews and publishes**

1. Opens the dashboard on the Pending Review inbox.
2. Opens an item and sees the submission, images, links, possible duplicates and verification information.
3. Edits if needed, ticks the verification checklist, and chooses Approve, Approve and Verify, Request more information or Reject with a reason.
4. For a Spotlight listing, confirms the credit in the bank account before approving, which starts the listing period.
5. Works through reports, checks the metrics and posts announcements.

Success: the backlog stays small and nothing stale stays public.

**Supporting journeys**

| ID | Journey | Trigger | Steps in short | Success |
| --- | --- | --- | --- | --- |
| J5 | Student gives a star | Sees a Spotlight listing they like | Taps the star; the count rises and the star stays marked on that device | One star per device per listing, no login |
| J6 | Student reports a problem | A link is dead or a listing looks fake | Taps Report this listing, picks a reason, submits | The report reaches the admin queue |
| J7 | Admin posts an announcement | News to share | Writes the post, adds a cover image, previews and publishes | The post is readable and shareable with a preview |
| J8 | Student installs the app | Returns a second time | Accepts the install prompt or adds to home screen | Campusly opens full screen and loads fast |

## How requirements are written

Every requirement has an ID, a priority and a source so it can be traced forward to a build prompt and an audit check (D00).

| Column | Meaning |
| --- | --- |
| ID | FR-### for functional requirements. IDs are permanent, never reused. A removed requirement stays in the table marked Retired. |
| Requirement | One testable statement of behavior. If it cannot be passed or failed, it is rewritten. |
| Pri | Priority: M, S or C, defined below. |
| Source | Where the requirement comes from. |

**Priority**

| Code | Name | Meaning |
| --- | --- | --- |
| M | Must | Version 1 cannot launch without it. |
| S | Should | In version 1 unless a change request defers it. |
| C | Could | Built only if time allows; otherwise it moves to the backlog. |

**Source codes**

| Code | Meaning |
| --- | --- |
| B# | A section of the product brief, for example B6 |
| DEC-### | A decision in the D00 decision log |
| ADD | An addition proposed by the author that the brief does not contain. It is a proposal until OQ-P03 is answered. |
| NFR | A non-functional requirement in this document |

**Terms used in requirements**

- **Public item:** an item with status Approved or Verified that is not disabled, not expired and not removed. Only public items appear in lists, search and the homepage.
- **Admin:** a signed-in member of the GDGOC admin team.
- **Device:** one browser on one phone or computer. Because there are no student accounts in version 1, a device is the closest thing to an identity.
- **Listing:** any community, event, opportunity or Spotlight entry. "Spotlight listing" means the paid business or product entry only.
- **Time:** times are stored in UTC and shown in West Africa Time (Africa/Lagos, UTC+01:00).
- **Priority conflicts:** when D07 and this document disagree about a rule, D07 wins; when they disagree about scope, this document wins (D00).

**Acceptance criteria.** Each requirement is written to be passed or failed as stated. The critical flows also carry Given, When, Then criteria in this document, and D11 turns every requirement into numbered audit checks.

## Global shell and navigation

The shell is everything that wraps every page: header, footer, navigation, states and the rule that no feature needs a login.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-001 | The site is usable at phone widths from 360 px up and scales to desktop widths without sideways scrolling. | M | B17 |
| FR-002 | The header on every public page shows the logo (linking to Home), Home, Communities, Events, Opportunities, Categories, a search control and a List Your Community button. | M | B18 |
| FR-003 | On phone widths, primary navigation is a bottom tab bar with Home, Communities, Events, Opportunities and More. More holds Categories, Spotlight, Announcements, Submit, About and Contact. | S | ADD |
| FR-004 | The footer on every public page links to About, Contact, Submit a Community, Report a Listing and the Campusly social media accounts. | M | B19 |
| FR-005 | Spotlight and Announcements are reachable from the header or the More menu on every public page. | M | DEC-004, DEC-007 |
| FR-006 | Every public page has its own URL, a descriptive page title and a meta description. | M | B24 |
| FR-007 | The current section is highlighted in the navigation, and detail pages show a breadcrumb back to their list. | S | ADD |
| FR-008 | Every list and search page has a loading state, an empty state that suggests a next action, and an error state with a retry control. | M | ADD |
| FR-009 | A branded not-found page and a generic error page both link back to Home and Search. | M | ADD |
| FR-010 | The look is modern, youthful, clean and student-friendly, and never resembles a government or traditional university portal. | M | B29 |
| FR-011 | Dark mode follows the device setting. | C | ADD |
| FR-012 | Links that leave Campusly (join links, social media, websites, application links) open in a new tab and carry an external-link cue. | M | B6 |
| FR-013 | Dates and times are shown in West Africa Time, and card dates use a short form such as OCT 20. | S | B21 |
| FR-014 | The name Campusly and the line "by GDGOC ABU Zaria" appear in the header or footer and on the About page. | M | DEC-001 |
| FR-015 | One Submit entry point offers Community, Event, Opportunity and List your business, so contributors never have to guess where to go. | S | ADD |
| FR-016 | No public feature requires a student to sign in or create an account. | M | DEC-002 |

## Homepage

The homepage must communicate the platform's purpose immediately (B3) and follow the section order in B19. How many cards each section shows is set in D02, and every section shows public items only.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-020 | The hero shows the headline "Discover More Beyond the Classroom" and a supporting line saying students can find communities, clubs, events and opportunities that help them learn, connect, lead and build experience. Final copy is set in D02. | M | B3 |
| FR-021 | The hero has a primary button, Explore Communities (opens the community directory), and a secondary button, List Your Community (opens the Community tab of the Submit page). | M | B3 |
| FR-022 | The hero holds a prominent search bar with the placeholder "Search clubs, communities, interests or opportunities...". | M | B4 |
| FR-023 | A "What are you looking for?" row shows the chips Learn, Network, Lead, Volunteer, Build, Compete and Create. Each chip opens a pre-filtered list. The mapping from chip to categories, tags and opportunity types is data an admin can edit, with its rules in D07. | M | B19 |
| FR-024 | An "Explore by Category" section shows one card per active category, each linking to its category page. | M | B5, B19 |
| FR-025 | A "Featured Communities" section shows the communities an admin has chosen, as community cards, in the admin's order. | M | B15, B19 |
| FR-026 | An "Upcoming Events" section shows the next upcoming events, soonest first, with a link to all events. | M | B19, B21 |
| FR-027 | A "Latest Opportunities" section shows open opportunities with their deadlines and a link to all opportunities. | M | B19, B22 |
| FR-028 | A "For Student Organizations" banner ("Have a club, community or initiative?") has a List Your Community button. | M | B19 |
| FR-029 | A Spotlight teaser previews the Featured strip and links to Spotlight. | S | DEC-004 |
| FR-030 | A strip of the latest published announcements links to all announcements. | S | DEC-007 |
| FR-031 | A homepage section with no content is hidden or shows a short friendly message. It never shows an empty frame or a broken layout. | M | ADD |
| FR-032 | Every homepage section is built from live data. No community, event, opportunity, category or announcement is hard-coded in the page. | M | B23 |
| FR-033 | A "Submit something" banner leads to the Submit page with its Community, Event, Opportunity and List your business choices. | S | ADD |
| FR-034 | Sections appear in the order of B19: hero, chips, categories, featured communities, upcoming events, latest opportunities, organizer banner and footer. Sections added later (Spotlight teaser, announcements) follow the opportunities section. | M | B19 |
| FR-035 | The headline, search bar and primary button are visible and usable before images finish loading, within the budget in NFR-001. | M | NFR |

## Search

Students search by interest as well as by name, so search covers descriptions and tags, not only titles (B4). Natural-language search is parked for version 3.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-040 | A search bar is in the homepage hero and a search control is in the header of every page. | M | B4, B18 |
| FR-041 | Search matches names, short and full descriptions, tags, category names and organizer names of public communities, events and opportunities. | M | B4 |
| FR-042 | Results are grouped into Communities, Events and Opportunities, each with a count, and the student can narrow to one group. | M | B4, ADD |
| FR-043 | Each of the brief's example searches returns the matching public items when they exist: GDG, Bitcoin, Entrepreneurship, Debate, Football, Sustainability, Photography, AI, Volunteering, Investment and Research. | M | B4 |
| FR-044 | Search ignores capital letters and extra spaces. | M | B4 |
| FR-045 | Search tolerates common misspellings and plural forms. | S | ADD |
| FR-046 | Only public items appear in results. | M | B12, DEC-003 |
| FR-047 | An item whose name exactly matches the query appears before other matches. Further ordering rules are in D07. | M | ADD |
| FR-048 | A search with no results says so, suggests browsing categories, and offers "Don't see your community? List Your Community". | M | B12 |
| FR-049 | The search query is part of the page address, so a results page can be shared and bookmarked. | M | B24 |
| FR-050 | Results appear within the response time in NFR-003. | M | NFR |
| FR-051 | When the search box is focused and empty, it suggests the categories and chips. | S | ADD |
| FR-052 | Search terms are recorded in aggregate (the term, the number of results, and whether a result was opened) with no personal data, so admins can see what students look for and cannot find. | S | B30, ADD |
| FR-053 | A query shorter than two characters shows a hint instead of running a search. | M | ADD |

Spotlight listings are not part of site search in version 1 (OQ-P09).

## Categories and community directory

The directory is the main way students browse. It starts with ten categories taken from the brief (B5) and lets students narrow by type, who can join and activity (B10).

| # | Category | Example topics (B5) |
| --- | --- | --- |
| 1 | Technology & Digital Skills | Programming, AI, cybersecurity, Web3, blockchain, UI/UX, cloud, software development, robotics |
| 2 | Entrepreneurship & Business | Startups, entrepreneurship, marketing, sales, business development, investment, fintech |
| 3 | Sustainability & Environment | SDGs, climate action, conservation, tree planting, recycling, waste management, plogging, environmental advocacy |
| 4 | Academic & Professional Development | Academic societies, professional associations, career communities, study groups, research communities, certifications |
| 5 | Leadership & Volunteering | Volunteer organizations, leadership communities, humanitarian initiatives, community service, advocacy, mentorship |
| 6 | Creative Arts & Media | Photography, videography, music, dance, theatre, writing, graphic design, content creation, journalism, fashion |
| 7 | Sports & Recreation | Football, basketball, athletics, chess, table tennis, badminton, fitness, gaming |
| 8 | Science & Research | Scientific societies, research groups, STEM communities, innovation groups |
| 9 | Health & Wellbeing | Health advocacy, public health, nutrition, fitness, first aid, health outreach |
| 10 | Culture & Community | Cultural associations, language communities, social groups, heritage organizations |

The brief's goal (B1) also names state associations, professional societies and student-led initiatives, but none of the ten categories is a clear home for state or regional associations or faculty and department associations. Whether to add categories is OQ-P04.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-060 | The ten launch categories above exist with the names and example topics from the brief. | M | B5 |
| FR-061 | Admins can add, edit, reorder, disable and delete categories without a code change. Deleting a category that still has communities requires moving them first. | M | B13, B23 |
| FR-062 | A Categories page lists every active category with the number of public communities in it. | M | B5 |
| FR-063 | Each category has a page listing its public communities with the same cards, filters and sort options as the directory. | M | B5 |
| FR-064 | The Communities page lists all public communities as cards. | M | B20 |
| FR-065 | A community card shows the logo, name, up to three tags, a one-line short description, "Open to:", a View Community button and the Verified or Community Listing badge. Cards look the same everywhere. | M | B20, B14 |
| FR-066 | The directory filters are Category; Type (Club, Community, Organization, Association, Initiative); Open to (All students, Specific faculty, Specific department, Specific level); and Activity (Active, Currently recruiting, Event coming soon). | M | B10 |
| FR-067 | Filters combine: a community must match every filter group, and any value chosen inside one group. Active filters show as removable chips with a Clear all control. | M | B10 |
| FR-068 | The chosen filters and sort are part of the page address, so a filtered view can be shared. | M | B24 |
| FR-069 | On phones, filters open in a bottom sheet with an Apply button that shows the number of results. | M | B17 |
| FR-070 | Sort options are Name A to Z, Recently added and Recently updated. The default order is set in D07. | M | ADD |
| FR-071 | Long lists load progressively (pages or a Load more control). A list never loads every item at once. | M | B17 |
| FR-072 | Tags show on cards and profiles and can be tapped to filter by that tag. A community can have several tags. | M | B6, B23 |
| FR-073 | A community can be marked Currently recruiting, with an optional end date. It shows a Recruiting mark on its card and appears under the Recruiting filter, and the mark clears itself after the end date. | M | B10, ADD |
| FR-074 | The Active filter and mark follow the rule in D07 for what counts as active. | M | B10 |
| FR-075 | The Event coming soon filter matches communities with an upcoming public event inside the window set in D07. | M | B10 |
| FR-076 | A directory or category view with no results shows an empty state with "Don't see your community? List Your Community". | M | B12 |
| FR-077 | A disabled community disappears from the directory, categories, search and homepage. Its profile address shows a "no longer listed" page instead of an error. | M | B13 |
| FR-078 | A "Recruiting now" shortcut sits at the top of the directory. | C | ADD |
| FR-079 | A student can save a community or opportunity on this device only and see saved items on one page. Pending OQ-P01. | C | B11 |

## Community profile

The profile is "one of the most important parts of the website" (B6). A student should understand what the community does and how to join without reading a long page (B29). The order on the page is: header, Join button, short description, What We Do, Why Join, who can join and requirements, meeting details, upcoming and past activities, links, then share and report.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-080 | Every public community has its own profile page at a readable address such as /communities/gdg-abu. | M | B6, B24 |
| FR-081 | The profile header shows the cover image, logo, organization name, badge, category and tags. | M | B6, B14 |
| FR-082 | The profile shows the short description, full description, who can join, membership requirements, faculty or department where applicable, meeting location, meeting frequency, social media links, website and contact information. | M | B6 |
| FR-083 | A "What We Do" section lists the organization's activities, such as workshops, hackathons, talks, networking, career sessions and community projects. | M | B6 |
| FR-084 | A "Why Join?" section lists the benefits of joining. | M | B6 |
| FR-085 | An "Upcoming Activities" section lists the community's upcoming public events. | M | B6 |
| FR-086 | A "Past Activities" section shows previous events and photos where available. | M | B6 |
| FR-087 | A "Join This Community" button is clear, stays visible on phones while the student scrolls, and opens the community's join link in a new tab. | M | B6 |
| FR-088 | The join button names where it leads (for example Join on WhatsApp, Open the form, Join on Telegram, Join on Discord, Visit the website, Send an email). Supported destinations are a WhatsApp group, Google Form, Telegram, Discord, website, email and other external registration links. An email destination opens a pre-addressed message. | M | B6 |
| FR-089 | Every tap on the join button is counted. | M | B30 |
| FR-090 | A community with no working join link shows its contact details in place of the button, and an admin is alerted. | M | B6, ADD |
| FR-091 | Tapping the badge explains it. Verified means the admin team has confirmed the organization exists and is active. Community Listing means it is listed but not yet confirmed. | M | B14 |
| FR-092 | The profile shows when it was last updated. | S | ADD |
| FR-093 | The profile has Share and Report this listing controls. | M | B24, B25 |
| FR-094 | A "More in this category" strip shows related communities. | C | ADD |
| FR-095 | For each contact detail, the submitter chooses whether it is shown publicly or kept for admins only. A submitter's personal email is never shown unless they choose to. | M | ADD |
| FR-096 | Profile content can be read by search engines and link-preview services without running scripts. | M | B24, NFR |
| FR-097 | A section with no content, such as no past activities, is hidden or shows a short note, never an empty frame. | M | ADD |
| FR-098 | "Open to" is shown in plain language, for example All ABU students, Faculty of Science, Department of Computer Science, or 300 level. | M | B6, B20 |
| FR-099 | A "Suggest an edit" link sends a correction to the admin queue (see FR-203). | S | ADD |

## Events

Events answer "what is happening on campus, and when?" in one place (B8). An event has a specific time and a place to attend. Something students apply or register for by a deadline is an opportunity. The exact dividing rule is D07's (OQ-P10).

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-110 | The Events page lists upcoming public events, soonest first, so students see campus activities in one place. | M | B8 |
| FR-111 | An event card shows a date block (for example OCT 20), the title, "Organized by", category and event type, a location pin with the place, and a View Event button. | M | B21 |
| FR-112 | Event filters are Category, Date (Today, This week, This month, or a chosen range), Location, Organization and Event type. | M | B8 |
| FR-113 | Event types come from a list an admin can edit. The starting list is set in D07 and covers workshops, talks, hackathons, competitions, bootcamps, clean-ups and networking sessions. | M | B8, B23 |
| FR-114 | Each event has its own page at a readable address such as /events/build-with-ai. | M | B24 |
| FR-115 | The event page shows the title, an optional image, the description, start date and time, end date and time where given, venue and any online link, the organizer with a link to its profile, category, event type, who can attend, and a contact. | M | B8, B21 |
| FR-116 | The event page offers an external registration or details link when the organizer supplied one. | M | ADD |
| FR-117 | Add to Calendar offers a downloadable calendar file and a Google Calendar link, both with the correct time in West Africa Time. | M | B8 |
| FR-118 | An event counts as upcoming until it ends, or until the end of its start day if it has no end time. After that it leaves Upcoming lists and appears under its organizer's Past Activities. | M | B6, B8 |
| FR-119 | An event can last several days. | M | ADD |
| FR-120 | An event can be run by a listed community or by another named organizer. | M | B8, ADD |
| FR-121 | An event can be marked In person, Online or Hybrid, with a link for online or hybrid attendance. | S | ADD |
| FR-122 | Share and Report this listing are on every event page. | M | B24, B25 |
| FR-123 | An admin can mark an event Cancelled or change its date. A cancelled event stays visible with a Cancelled banner and is left out of Upcoming lists. | S | ADD |
| FR-124 | Quick Today and This week chips sit above the event list. | S | ADD |
| FR-125 | A past event keeps its address and shows a Past event notice. | M | ADD |
| FR-126 | The event page shows whether attendance is free or costs money, as the organizer entered it. | S | ADD |
| FR-127 | The submission form helps organizers choose between Event and Opportunity using the rule in D07, and an admin can convert an item from one to the other. | S | ADD |

A month calendar view is excluded from version 1 (X-08).

## Opportunities

Students "shouldn't only discover organizations. They should discover things they can actually participate in" (B7). Opportunities are the things to apply for, enter or attend by a deadline.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-135 | The Opportunities page lists open public opportunities, soonest deadline first. | M | B7, ADD |
| FR-136 | Opportunity types are Workshop, Hackathon, Competition, Fellowship, Scholarship, Volunteering, Internship, Conference, Training program, Leadership opportunity, Career event and Networking event. Admins can edit the list. | M | B7, B23 |
| FR-137 | An opportunity card shows the title, type, organization, deadline, eligibility and a View Opportunity button. | M | B22 |
| FR-138 | Each opportunity has its own page at a readable address under /opportunities. | M | B24 |
| FR-139 | The opportunity page shows the title, organization, description, category, date, deadline, location, eligibility, application link and opportunity type. | M | B7 |
| FR-140 | Opportunity filters are Type and Category, plus a deadline window and location. | M | B10, ADD |
| FR-141 | An opportunity disappears from lists, search and the homepage once its deadline passes. Its page then shows a Closed notice. | M | B13, ADD |
| FR-142 | Admins can remove an opportunity or extend its deadline at any time. | M | B13 |
| FR-143 | The Apply button opens the external link in a new tab, and every tap is counted. | M | B7, B30 |
| FR-144 | Cards show a deadline countdown such as "5 days left" and a Closing soon mark inside the window set in D07. | S | ADD |
| FR-145 | An opportunity with no deadline can be marked Rolling. It stays listed until an admin removes it or an end date is set. | M | ADD |
| FR-146 | Eligibility shows as plain tags such as All university students, 200 level and above, or Faculty of Engineering. | S | B7, B22 |
| FR-147 | Opportunities can be posted by campus organizations or by outside organizations, as long as they are relevant to students and meet the content standards. | M | B7 |
| FR-148 | Share and Report this listing are on every opportunity page. | M | B24, B25 |
| FR-149 | Sort options are Deadline soonest and Newest. | S | ADD |

## Sharing, calendar and link previews

Campus information "spreads heavily through WhatsApp" (B24), so sharing is a core feature. A link pasted into a chat must look trustworthy and open straight to the right page.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-160 | Every community, event, opportunity, category, Spotlight listing and announcement has its own stable address. | M | B24 |
| FR-161 | A Share control offers WhatsApp, X, Telegram and Copy link. On phones it uses the device's own share sheet where available. | M | B24 |
| FR-162 | The WhatsApp share message is pre-filled with the item's title, a one-line description and its link. | M | B24 |
| FR-163 | A Campusly link pasted into WhatsApp, Telegram or X shows a preview with a title, a short description and an image. | M | B24, ADD |
| FR-164 | An item without a cover image gets an automatically generated preview image showing the Campusly name, the item title and its category. | S | ADD |
| FR-165 | If an item's address changes, the old address redirects to the new one permanently. | M | ADD |
| FR-166 | Copy link confirms with a short "Link copied" message. | M | ADD |
| FR-167 | The calendar file works in Google Calendar, Apple Calendar and Outlook, and carries the event title, time, place and a link back to the event page. | M | B8 |
| FR-168 | Every share tap is counted by channel and item type. | M | B30 |
| FR-169 | Shared links open the page without a login, and sharing records nothing that identifies the sharer. | S | DEC-002, ADD |

## Reporting

Because anyone can submit a listing, students are the second line of defence after admin review (B14, B25). Reports flag a problem; only admins decide what happens.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-180 | Every community, event, opportunity and Spotlight listing has a Report this listing control. | M | B25 |
| FR-181 | Report reasons are: it does not exist, the information is outdated, the link is wrong, the content is inappropriate, the organization is inactive, and other. Spotlight listings add "scam or misleading". Other needs a short note. | M | B25, ADD |
| FR-182 | No sign-in is needed. The reporter may add an email or WhatsApp number for follow-up, shown only to admins. | M | B25, DEC-002 |
| FR-183 | Reports are protected against spam by limits per device and per connection, plus the checks defined in D08. | M | ADD |
| FR-184 | After sending, the reporter sees a short thank-you and what happens next. | M | ADD |
| FR-185 | Each report lands in the admin Reports queue showing the listing, reason, note, time and how many earlier reports that listing has. | M | B25 |
| FR-186 | Admins can dismiss a report, edit the listing, disable it, remove its Verified badge, contact the owner, or delete it. Each outcome and the admin who chose it are recorded. | M | B25 |
| FR-187 | A listing that reaches the report threshold set in D07 is flagged Under review for admins. Reports never hide a listing automatically. | S | ADD |
| FR-188 | The same device reporting the same listing for the same reason within the window set in D07 is counted once. | M | ADD |
| FR-189 | A Report a Listing page, linked from the footer, lets a student report a listing by choosing it or pasting its address. | M | B19 |

## Submissions

Organizations that are not listed can submit themselves, with no login, and the listing goes into an admin review queue instead of appearing publicly (B12). The same page takes events and opportunities.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-195 | One Submit page, with no login, has three tabs: Community, Event and Opportunity. "Don't see your community? List Your Community" opens the Community tab. | M | B12, DEC-003 |
| FR-196 | Nothing submitted appears publicly until an admin approves it. | M | B12, DEC-003 |
| FR-197 | After submitting, the submitter sees a confirmation with a reference number, a short "under review" message and what happens next. | M | ADD |
| FR-198 | Every submission needs a way for admins to reach the submitter: an email address or a WhatsApp number. It is for admins only unless the submitter makes it public (FR-095). | M | B12 |
| FR-199 | Forms are protected against spam with a hidden trap field, limits per device and per connection, and size and type limits on uploads. D08 sets the details. | M | ADD |
| FR-200 | Fields are checked while the user types and again on submission. Errors appear next to the field in plain words, and nothing the user typed is lost when there is an error. | M | ADD |
| FR-201 | Logo, cover and event images can be uploaded within allowed types and sizes. Images are checked and resized before use. D08 sets the details. | M | B12 |
| FR-202 | When a community's name or join link looks like one already listed, the form shows the possible match before submission. | S | ADD |
| FR-203 | "Suggest an edit" on any community, event or opportunity lets a visitor send a correction. It enters the Pending queue as an edit, and the live listing does not change until an admin approves it. | S | ADD |
| FR-204 | The Community tab collects the fields in the community field table below. | M | B12, B6 |
| FR-205 | The Event tab collects the fields in the event field table below. | M | B8, B21 |
| FR-206 | The Opportunity tab collects the fields in the opportunity field table below. | M | B7 |
| FR-207 | Long forms keep a draft on the device, so a student who loses connection can continue. | S | ADD |
| FR-208 | A Track my submission page shows the status of a submission when given its reference and the contact used: Pending, Approved, Verified, Needs more information, or Rejected with the reason. | S | ADD |
| FR-209 | An admin's rejection reason is saved with the submission and shown on the tracking page. The admin also gets a ready-made message to send by email or WhatsApp. | M | ADD |
| FR-210 | Submitted text is cleaned of anything unsafe, and every link is checked to be a valid web address before it is shown. D08 sets the details. | M | ADD |
| FR-211 | The submitter ticks a statement confirming they are allowed to list the organization or item, that the information is accurate, and that they accept the submission guidelines. | M | ADD |
| FR-212 | Submitters can offer verification information (official social media account, proof of university recognition, a leader's confirmation, evidence of past activities) but can never mark anything Verified or Featured. | M | B12, B14 |
| FR-213 | Tapping Submit twice by accident creates one submission. | M | ADD |
| FR-214 | When submitting an event, the organizer can pick a listed community as they type its name. | S | ADD |

Text limits for each field are set in D06 so that cards stay readable on a phone.

**Community fields**

| Field | Required | Public | Notes |
| --- | --- | --- | --- |
| Organization name | Yes | Yes |  |
| Type | Yes | Yes | Club, Community, Organization, Association or Initiative (B10) |
| Logo | Yes | Yes | Image |
| Cover image | No | Yes | Image |
| Short description | Yes | Yes | Must fit two lines on a card |
| Full description | Yes | Yes |  |
| What we do | Yes | Yes | Activities such as workshops, hackathons, talks |
| Why join | Yes | Yes | Needed for the profile (B6) |
| Category | Yes | Yes | One primary category |
| Tags | No | Yes | Several allowed |
| Who can join | Yes | Yes | All students, a faculty, a department or a level |
| Membership requirements | No | Yes |  |
| Faculty or department | If applicable | Yes |  |
| Meeting location | Yes | Yes |  |
| Meeting frequency | Yes | Yes |  |
| Currently recruiting, with end date | No | Yes | Clears itself after the end date (FR-073) |
| Social media links | No | Yes |  |
| Website | No | Yes |  |
| Group chat link | No | Yes | WhatsApp, Telegram or Discord |
| Join link | Yes | Yes | WhatsApp group, Google Form, Telegram, Discord, website, email or other (B6) |
| Contact person | Yes | Submitter chooses |  |
| Contact email | Yes | Submitter chooses |  |
| Verification information | No, recommended | Admins only | Official account, recognition, leader confirmation, past activities |

**Event fields**

| Field | Required | Public | Notes |
| --- | --- | --- | --- |
| Title | Yes | Yes |  |
| Organizer | Yes | Yes | A listed community or another named organizer |
| Description | Yes | Yes |  |
| Category and event type | Yes | Yes |  |
| Start date and time | Yes | Yes |  |
| End date and time | No | Yes |  |
| Mode | Yes | Yes | In person, online or hybrid |
| Venue | If in person or hybrid | Yes |  |
| Online link | If online or hybrid | Yes |  |
| Who can attend | Yes | Yes |  |
| Cost | No | Yes | Free or an amount |
| Registration or details link | No | Yes |  |
| Cover image | No | Yes |  |
| Contact (email or WhatsApp) | Yes | Submitter chooses |  |

**Opportunity fields**

| Field | Required | Public | Notes |
| --- | --- | --- | --- |
| Title | Yes | Yes |  |
| Organization | Yes | Yes | May be a campus or outside organization |
| Opportunity type | Yes | Yes | From the list in FR-136 |
| Description | Yes | Yes |  |
| Category | Yes | Yes |  |
| Date | If applicable | Yes | When it takes place |
| Deadline | Yes, unless Rolling | Yes |  |
| Location | Yes | Yes | Campus, city or online |
| Eligibility | Yes | Yes |  |
| Application or join link | Yes | Yes |  |
| Contact (email or WhatsApp) | Yes | Submitter chooses |  |

## Admin dashboard

The dashboard is where trust is created: nothing becomes public without an admin, and every admin action is traceable (B13, B14). Its home screen is the Pending Review inbox. Spotlight payment approvals have their own requirements in a later section.

**Access and structure**

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-230 | The admin area has its own address, is not linked from public pages, and shows nothing to anyone who is not signed in. | M | B13 |
| FR-231 | Admin sign-in resists guessing: attempts are limited, and sessions end after inactivity and on sign-out. D08 sets the exact controls. | M | B13, NFR |
| FR-232 | Each admin has a named account, so every action can be traced to a person. Whether admins have different roles is OQ-P05. | M | B13, ADD |
| FR-233 | After sign-in the admin lands on the Pending Review inbox, with counts of pending submissions by type, payments waiting, open reports and items expiring soon. | M | B13, ADD |
| FR-253 | Admin pages are usable on a phone. | S | B17, ADD |

**Review and approval**

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-234 | The Pending Review inbox lists every pending submission (communities, events, opportunities, Spotlight listings and edits), oldest first, with filters by type, a search box, and how long each has waited. | M | B12, B13 |
| FR-235 | The review screen shows the full submission, uploaded images, links that open safely, possible duplicates, verification information, and the submitter's contact details, which only admins see. | M | B12, B14 |
| FR-236 | From the review screen an admin can Approve (it shows as Community Listing), Approve and Mark Verified, or Reject with a required reason. | M | B13, B14 |
| FR-237 | An admin can also choose Request more information, which sets the status to Needs more information and records what is needed. | S | ADD |
| FR-238 | An admin can edit any submission before approving it, and every edit is recorded. | M | ADD |
| FR-247 | The review screen has a verification checklist: official social media account, university recognition, confirmation from a leader, contact information and evidence of previous activities. Approve and Mark Verified is possible only when the minimum in D07 is met. | M | B14 |
| FR-258 | An admin can preview any submission exactly as the public will see it before approving. | M | ADD |
| FR-259 | An admin can select several pending items and approve or reject them together. | C | ADD |
| FR-260 | Items waiting longer than the review target in D07 are highlighted in the inbox. | S | ADD |

**Managing content**

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-239 | The Communities manager lists communities with search and status filters, and lets an admin add, edit, delete, verify and unverify, feature and unfeature, mark recruiting, and disable or re-enable them. | M | B13 |
| FR-240 | The Events manager lets an admin add, edit, delete, approve submitted events and cancel events. | M | B13 |
| FR-241 | The Opportunities manager lets an admin add, edit, delete, approve submitted opportunities, extend deadlines and remove expired ones. | M | B13 |
| FR-242 | The Categories manager lets an admin add, edit, reorder, disable and delete categories (see FR-061). | M | B13 |
| FR-243 | The Tags manager lets an admin rename tags, merge duplicates and delete unused ones. | M | B23 |
| FR-244 | The Featured manager lets an admin choose which communities appear under Featured Communities and put them in order. | M | B15 |
| FR-245 | The Reports queue works as described in FR-185 and FR-186. | M | B25 |
| FR-250 | Admins can disable several inactive communities at once. | C | B13 |
| FR-254 | Deleting is a soft delete that an admin can undo within the period set in D07. | S | ADD |
| FR-256 | Deleting a community that has events asks what to do with the events: delete them, or keep them under another named organizer. | M | ADD |

**Governance and settings**

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-246 | An audit log records every admin action with who did it, what changed and when, and it cannot be edited. | M | ADD |
| FR-248 | Verified communities come back for re-checking after the period set in D07. | S | ADD |
| FR-249 | A freshness report lists listings not updated for the period in D07 and listings whose links no longer work. | S | ADD |
| FR-251 | A Settings area holds what must never be hard-coded: the site's contact details and social links, the Spotlight bank details, the Spotlight plans and Featured slot cap (FR-338, FR-339), and the editable lists of event types, opportunity types and "What are you looking for?" chips. | M | B23 |
| FR-252 | A Metrics page shows the success metrics defined in this document for a chosen date range, with a CSV export. | M | B30 |
| FR-255 | Admins receive a summary of pending items, payments and reports by email at times they choose. D07 sets the cadence. | S | ADD |
| FR-257 | Changing the Spotlight bank details requires the admin to re-enter their password, is recorded in the audit log, and notifies every other admin. | M | ADD, D08 |

Managing student users, which the brief mentions only "if accounts are implemented" (B13), is excluded (X-10).

## Spotlight: public page, listing and checkout

Spotlight is a paid showcase where anyone can list a business or product. Student stars decide the ranking, and a pinned Featured strip sits outside it (DEC-004, DEC-005). The plans, prices, durations, slot cap and ranking tie-break live in D07 and are never typed into this document or into a page.

**The public page and ranking**

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-280 | The Spotlight page shows a short explainer (student businesses and products on campus), the Featured strip, then the Community Ranking, and a "List your business or product" button. | M | DEC-004 |
| FR-281 | The Featured strip sits above the ranking, is clearly labelled Featured, and shows paid Featured listings outside the ranking order. | M | DEC-004 |
| FR-282 | Featured listings also appear in the Community Ranking, positioned by their stars. | M | DEC-004 |
| FR-283 | The Community Ranking lists every active Spotlight listing strictly by number of stars, highest first. Ties are broken by the rule in D07. Nothing else, including payment, changes a listing's position. | M | DEC-005 |
| FR-284 | A listing card shows the main image, name, one-line pitch, category, a star button with its count, a way to contact or visit the seller, a Featured label where it applies, and a Report control. | M | DEC-004, ADD |
| FR-285 | The star button gives one star per device per listing. Tapping again removes it. There is no downvote. The count updates at once and the device remembers its star. | M | DEC-005 |
| FR-286 | New stars show immediately on the voter's screen, and the ranking order catches up within the delay in NFR-007. | M | NFR |
| FR-287 | Only active listings can receive stars. What happens to an expired listing's stars on renewal is decided in D07. | M | DEC-005 |
| FR-288 | Each Spotlight listing has its own page with an image gallery, full description, category, contact methods, link, star count, Share and Report. | M | B24, DEC-004 |
| FR-289 | Visitors can filter Spotlight by category and search within it. Admins manage the category list (OQ-P08). | S | ADD |
| FR-290 | The "List your business or product" button opens the listing form. | M | DEC-004 |
| FR-305 | The order of the Featured strip rotates fairly, so the same listing is not always first. | S | ADD |
| FR-307 | A visible line explains how Spotlight works: ranking is by stars, and Featured means a paid pinned slot. | M | DEC-005, ADD |
| FR-311 | An expired listing leaves the Featured strip and the ranking, shows an Expired notice at its address, and offers its owner a Renew button. | M | DEC-004 |

**Listing, payment and status**

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-291 | The listing form collects the fields in the Spotlight field table below. | M | DEC-004 |
| FR-292 | The plan choice shows each plan's name, price, duration and what it includes, read from the plans an admin has set. Nothing about plans is typed into the page. | M | DEC-004 |
| FR-293 | After the form, checkout shows the bank name, account name, account number, the exact amount, a unique reference code for the transfer narration, step-by-step instructions, the time allowed to pay (D07) and a link to the refund rule. | M | DEC-004 |
| FR-294 | The account number, amount and reference code each have a one-tap copy control. | M | ADD |
| FR-295 | After paying, the lister uploads a receipt (image or PDF) and enters the payer name, amount sent, date and time of transfer, and bank used, then submits for approval. | M | DEC-004 |
| FR-296 | Receipts and payer details are visible only to admins. | M | DEC-004, D08 |
| FR-297 | A lister can leave and return later through an unguessable link and the reference, with no login. | M | ADD |
| FR-298 | A status page shows where the listing is: Awaiting payment, Receipt submitted, Active, Expired, or Rejected with a reason. | M | DEC-004 |
| FR-299 | A Spotlight listing is invisible to the public until an admin approves it after confirming payment. | M | DEC-004 |
| FR-300 | Featured is limited to the slot cap an admin sets (D07). When every slot is taken, the form says when the next slot frees up and offers Standard or a place on a waiting list (OQ-P06). | M | DEC-004, ADD |
| FR-301 | An owner can renew an active or expired listing through the same checkout, which creates a new payment. | M | DEC-004 |
| FR-302 | The owner is reminded before the listing expires, by the contact they gave, at the time set in D07. | S | ADD |
| FR-303 | Anyone can list; there is no student-only restriction. The lister must accept the Spotlight rules, which say what may not be listed. | M | DEC-005 |
| FR-304 | Spotlight and checkout state that Campusly does not handle sales between buyers and sellers and does not guarantee any listing. | M | DEC-004, LEG |
| FR-306 | Star abuse is limited by a per-device rule, rate limits and spike detection, with details in D08 and D07. | M | DEC-005 |
| FR-309 | A lister can buy more than one period in a single payment. Pending OQ-P07. | S | ADD |
| FR-310 | A lister can request changes to a live listing from the status page. The changes go to Pending, and the live listing stays as it is until an admin approves them. | M | ADD |

**Spotlight listing fields**

| Field | Required | Public | Notes |
| --- | --- | --- | --- |
| Listing name | Yes | Yes |  |
| Type | Yes | Yes | Business, product or service |
| One-line pitch | Yes | Yes | Shown on the card |
| Description | Yes | Yes |  |
| Spotlight category | Yes | Yes | List managed by admins (OQ-P08) |
| Images | At least one | Yes | Number allowed set in D06 |
| Price information | No | Yes | Free text |
| Location or delivery area | Yes | Yes | Campus, area or online |
| Public contact methods | At least one | Yes | WhatsApp, phone, email, social link or website |
| Owner name | Yes | Admins only |  |
| Owner contact (email or WhatsApp) | Yes | Admins only | For payment and decision messages |
| Plan | Yes | Featured label only | Standard or Featured |
| Acceptance of the Spotlight rules | Yes | No |  |

## Spotlight listing lifecycle

&#91;embedded content: Spotlight listing lifecycle · 7 states\]

A listing moves only forward through payment and review, can be sent back for a fix, and leaves the public page by expiry, pause or rejection. These are working status names: D07 owns the final status list, the transition rules and the time limits.

| Status | Public | Who moves it | Notes |
| --- | --- | --- | --- |
| Awaiting payment | No | Lister and the system | The checkout is shown. An unpaid listing is cancelled after the time D07 sets. |
| Receipt submitted | No | Lister | Waits in the admin payments queue. |
| Active | Yes | Admin approves | The paid period starts on approval (FR-333). |
| Paused | No | Admin | Hidden; how the remaining period is handled is set in D07. |
| Expired | No | The system at the end of the period | The owner can renew (FR-301). |
| Rejected | No | Admin | The reason is shown; a refund is recorded if the lister paid. |
| Cancelled | No | The system | Closed because payment did not arrive in time. |

## Spotlight: admin, payments and expiry

Payment is a manual bank transfer, so the admin is the control that keeps Spotlight honest: nothing goes live until the money is confirmed in the bank account, not just on a receipt image (DEC-004). Prices, durations, the slot cap and refund terms are D07's.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-330 | A Payments queue lists listings with submitted receipts, oldest first, with a receipt viewer, the reference code, the expected and stated amounts, the payer details, the plan and the number of periods. | M | DEC-004 |
| FR-331 | Before approving, the admin must confirm the credit in the bank account, outside Campusly, and record it with the bank alert's date or reference. Approval is blocked until this is recorded. | M | DEC-004, D08 |
| FR-332 | The admin can approve and activate, reject with a reason and refund note, ask for a corrected receipt or top-up, or mark an amount mismatch (underpaid or overpaid) with a note. | M | DEC-004 |
| FR-333 | Approval starts the paid period at the time of approval. Its end is the plan duration times the periods bought, as D07 defines. | M | DEC-004 |
| FR-334 | At the end of the period the listing expires automatically and leaves the Featured strip and the ranking, with no admin action. | M | DEC-004 |
| FR-335 | An admin can extend, pause, resume or deactivate a listing. Each action is recorded with a reason. | M | ADD |
| FR-336 | Each checkout gets a unique reference code, and the system flags a receipt file that has already been used on another listing. | M | ADD, D08 |
| FR-337 | A revenue summary shows confirmed payments by period and plan, active and expired listings and Featured slot use, with a CSV export for GDGOC's records. | M | ADD |
| FR-338 | A Plans manager lets an admin edit each plan's name, description, price and duration, and whether it is on sale. Changes apply to new purchases only. A listing keeps the terms it was bought on. | M | DEC-004 |
| FR-339 | A Featured slots view shows which slots are taken, when each frees up and who is on the waiting list, and lets an admin set the slot cap. | M | DEC-004, ADD |
| FR-340 | One place holds the bank details, so checkout always shows the current account (see FR-251 and FR-257). | M | DEC-004 |
| FR-341 | An admin can edit or remove a listing's content, block a lister by contact details, see star activity per listing, and remove stars that look fake in bulk. | M | ADD |
| FR-342 | An Expiring soon list shows listings ending inside the window set in D07, so admins can prompt renewals. | S | ADD |
| FR-343 | Rejecting a paid listing records the refund: amount, date, method and reference. | M | DEC-004, ADD |
| FR-344 | Payment records cannot be deleted. Corrections are new, recorded entries. | M | ADD |
| FR-345 | An admin can create a Spotlight listing on a lister's behalf, for example for a payment arranged offline. It is marked created by admin and still counts in the revenue summary. | M | ADD |
| FR-346 | A listing whose star count rises unusually fast is flagged in the dashboard (see FR-306). | S | ADD |

## Announcements

Announcements is an admin-only page that reads like a blog: a write-up and an image together (DEC-007). Students read and share; they do not post.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-370 | The Announcements page lists published announcements, newest first, as blog-style cards with a cover image, title, date and short excerpt. | M | DEC-007 |
| FR-371 | Each announcement has its own page with the title, cover image, publish date, author name, body and a Share control. | M | DEC-007, B24 |
| FR-372 | Only admins can create, edit, publish, unpublish and delete announcements. Visitors can read and share but cannot post or comment. | M | DEC-007 |
| FR-373 | The editor supports a title, cover image, and a body with headings, bold, italic, lists, links, quotes and inline images. A Preview shows the post as readers will see it. | M | DEC-007 |
| FR-374 | An announcement is Draft, Published or Unpublished. Only Published announcements are public. | M | DEC-007 |
| FR-375 | An announcement can be pinned to the top of the list. Pending OQ-P23. | S | ADD |
| FR-376 | Body content is cleaned of anything unsafe, and every image needs a text description before the post can be published. | M | DEC-007, D08 |
| FR-377 | Announcement pages have link previews (FR-163) and show when the post was last edited. | M | B24 |
| FR-378 | Publishing can be scheduled for a later time. Pending OQ-P23. | C | ADD |
| FR-379 | Announcement images are optimized for phones. | S | B17 |
| FR-380 | The homepage strip (FR-030) shows pinned announcements first, then the latest. | S | ADD |

## PWA and offline

Campusly is an installable web app, built for phones and slow connections (B17, DEC-002). It must stay useful when the connection drops, without ever showing stale or private data.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-390 | Campusly is installable: it has a name, icons and a theme colour, and opens full screen when added to the home screen. | M | DEC-002 |
| FR-391 | A dismissible install prompt appears after meaningful use, such as a second visit, and never blocks content. On iPhones it explains Share, then Add to Home Screen. | M | DEC-002, ADD |
| FR-392 | The app shell and static files are cached, so repeat visits load fast. | M | B17, DEC-002 |
| FR-393 | With no connection, pages already visited and recent lists stay readable under a clear "You're offline" banner. Pages that were not cached show a friendly offline page. | M | B17 |
| FR-394 | Forms keep what the user typed when the connection drops. A submission is sent only when it can be sent, and nothing is silently lost. | M | ADD |
| FR-395 | Cached content refreshes in the background when online. Content that has expired or been removed is not shown as current after the refresh. | M | ADD |
| FR-396 | When a new version is available, the app invites the user to refresh without losing form input. | M | ADD |
| FR-397 | Admin pages, receipts and personal details are never stored in the offline cache. | M | D08 |
| FR-398 | Images load lazily and in efficient formats, and low data use is a design rule. | S | B17 |
| FR-399 | Supported browsers and devices are listed in NFR-040 and NFR-041. | M | NFR |

## Static and trust pages

These pages explain who runs Campusly, how listings are reviewed and what the rules are. They are what makes a listing from a stranger feel trustworthy. Legal text itself is D09's.

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-410 | An About page explains what Campusly is, who runs it, how it is funded through Spotlight, and how listings are reviewed. | M | B19 |
| FR-411 | A Contact page shows how to reach the GDGOC team by email, WhatsApp and social media. | M | B19 |
| FR-412 | A How verification works page explains Verified and Community Listing and the evidence admins check. | M | B14 |
| FR-413 | A Submission guidelines page says what can be listed, what gets rejected and how long review takes. | M | B12, ADD |
| FR-414 | A Spotlight rules page covers what may be listed, how ranking and Featured work, payment, refunds, expiry and removal. | M | DEC-004, DEC-005 |
| FR-415 | A Privacy Policy and Terms of Use are published and linked in the footer. Their text is in D09. | M | LEG |
| FR-416 | An FAQ answers common questions for students, community leaders and business owners. | S | ADD |
| FR-417 | If analytics set cookies or identify devices, a clear notice says so. D09 sets the approach. | M | LEG |
| FR-418 | Google Developer Group and GDGOC names and logos appear only as the program rules allow (OQ-P13). | S | ADD |

## Success metrics and analytics events

Success is not website traffic. It is whether more students discover and take part in meaningful opportunities before they graduate (B30). The headline metric is M-01, the number of distinct devices that tap Join or Apply in a month.

**Measurement limits.** With no accounts, a "student" is a device, so one student on two phones counts twice. A Join or Apply tap shows intent, not that the student really joined. An optional survey (FR-436, OQ-P28) is the way to estimate real participation.

No targets are set yet. Targets come from a baseline measured after launch (OQ-P22), and catalogue-size targets for launch day are in the release criteria.

| ID | Metric | Definition | Source | Brief |
| --- | --- | --- | --- | --- |
| M-01 | Monthly joiners and applicants (headline) | Distinct devices with at least one Join or Apply tap in a 30-day window | join\_click, apply\_click | B30 |
| M-02 | Communities listed | Number of public communities | Live data | B30 |
| M-03 | Verified communities | Number and share of public communities that are Verified | Live data | B30 |
| M-04 | Events listed | Events added per month, and upcoming events at a point in time | Live data | B30 |
| M-05 | Opportunities listed | Open opportunities at a point in time, and added per month | Live data | B30 |
| M-06 | Discovery reach | Distinct devices that viewed at least one community profile, per week | community\_view | B30 |
| M-07 | Join taps and join rate | Total Join taps, and distinct devices with a Join tap divided by distinct devices with a profile view | join\_click, community\_view | B30 |
| M-08 | Community submissions and approval rate | Submissions received per month, and approved divided by decided | Live data | B30 |
| M-09 | Active communities | Number meeting the Active rule in D07 | Live data | B30 |
| M-10 | Search success rate | Searches where a result was opened, divided by searches that returned results | search\_performed, result\_open | ADD |
| M-11 | Search no-result rate | Searches with no results divided by all searches, plus the top missing terms | search\_no\_results | ADD |
| M-12 | Apply taps | Total Apply taps and distinct devices | apply\_click | B30 |
| M-13 | Share rate | Share taps per 100 detail-page views, by channel | share\_click, page\_view | ADD |
| M-14 | Review turnaround | Median and 90th percentile hours from submission to decision | Live data | ADD |
| M-15 | Backlog age | Number of pending items and the age of the oldest | Live data | ADD |
| M-16 | Listing freshness | Share of public listings updated within the period in D07, and the count of dead links | Live data | ADD |
| M-17 | Reports | Reports per 100 public listings, and median hours to resolve | Live data | ADD |
| M-18 | Spotlight revenue and listings | Confirmed payments per period, and paid listings started | Live data | ADD |
| M-19 | Featured sell-through and renewals | Featured slot time sold divided by slot time available, and the share of expired listings that renewed | Live data | ADD |
| M-20 | Star distribution | Stars per active listing, the share of all stars held by the top listing, and flagged spikes | star\_added | ADD |
| M-21 | Payment decision time | Median hours from receipt submitted to decision | Live data | ADD |
| M-22 | Installs and offline use | App installs, and sessions that started offline | pwa\_installed, offline\_view | ADD |
| M-23 | Web performance | 75th percentile LCP, INP and CLS on real phones | Performance reports | NFR-001, NFR-002 |
| M-24 | Announcement reads | Views per published announcement | announcement\_view | ADD |

**Event plan**

Metrics marked "Live data" come straight from the database. The rest come from these events.

| Event | Fired when | Key properties | Feeds |
| --- | --- | --- | --- |
| page\_view | A public page is shown | Page type, item ID, referrer type | M-06, M-13, M-24 |
| search\_performed | A search runs | Term, result count, group chosen | M-10, M-11 |
| search\_no\_results | A search returns nothing | Term | M-11 |
| result\_open | A student opens a search result | Result type, position | M-10 |
| category\_open | A category page opens | Category ID | M-06 |
| community\_view | A profile opens | Community ID, source (search, category, home, share) | M-06, M-07 |
| join\_click | Join is tapped | Community ID, destination type | M-01, M-07 |
| event\_view | An event page opens | Event ID | M-13 |
| add\_to\_calendar | Add to Calendar is tapped | Event ID, kind (file or Google) | Usage insight |
| opportunity\_view | An opportunity page opens | Opportunity ID | M-13 |
| apply\_click | Apply is tapped | Opportunity ID | M-01, M-12 |
| share\_click | Share is tapped | Item type, item ID, channel | M-13 |
| report\_submitted | A report is sent | Item type, reason | Usage insight |
| submission\_started, submission\_sent | A form is started or sent | Submission type | M-08 |
| spotlight\_view | Spotlight or a listing opens | Listing ID | Usage insight |
| star\_added, star\_removed | A star is toggled | Listing ID | M-20 |
| listing\_started, checkout\_viewed, receipt\_submitted | The Spotlight steps happen | Plan, listing ID | M-18, M-21 |
| announcement\_view | An announcement opens | Announcement ID | M-24 |
| pwa\_installed | The app is installed | Platform | M-22 |
| offline\_view | A page is shown offline | Page type | M-22 |

| ID | Requirement | Pri | Source |
| --- | --- | --- | --- |
| FR-430 | The events in the plan above are recorded when they happen, with the properties listed. | M | B30 |
| FR-431 | Analytics record no names, emails, phone numbers or receipt contents. A random device identifier is used, and clearing site data resets it. D09 sets the details. | M | LEG |
| FR-432 | Analytics never slow a page: they load after the main content and fail silently. | M | NFR |
| FR-433 | The admin Metrics page shows every metric in this section for a chosen date range (see FR-252). | M | B30 |
| FR-434 | Counts of communities, events, opportunities, submissions, payments and reports come from live data, not from event tracking. | M | ADD |
| FR-435 | The Metrics page lists the top searches that returned nothing, so missing communities can be recruited. | S | ADD |
| FR-436 | An optional, anonymous one-question survey asks students whether they joined something they found on Campusly. Pending OQ-P28. | S | B30 |
| FR-437 | Real-user web performance (LCP, INP and CLS) is reported for phones. | M | NFR |

## Non-functional requirements

These requirements say how well Campusly must work, not what it does. They matter most on the phones and connections students actually use (B17). Core Web Vitals thresholds are Google's published "good" levels. Values marked (proposed) are starting points to confirm at Gate G3, once D05 fixes the stack (OQ-P18).

| ID | Area | Requirement | Pri |
| --- | --- | --- | --- |
| NFR-001 | Speed | On a mid-range Android phone on a throttled mobile connection, the 75th percentile Largest Contentful Paint of the homepage, community directory and community profile is 2.5 seconds or less. | M |
| NFR-002 | Speed | At the 75th percentile, Interaction to Next Paint is 200 ms or less and Cumulative Layout Shift is 0.1 or less on every public page. | M |
| NFR-003 | Speed | Search results are returned within 1 second of submitting a query at launch traffic (proposed). | M |
| NFR-004 | Weight | The JavaScript needed for the first load of any public page is no more than 170 KB compressed (proposed). | S |
| NFR-005 | Weight | Images are served at the size shown, lazy-loaded below the first screen, and in efficient formats. | M |
| NFR-006 | Speed | One test profile (connection speed, CPU slowdown, screen size) is defined in D11 and used for every performance check. | M |
| NFR-007 | Spotlight | A star shows on the voter's screen at once, and the ranking order reflects it within 60 seconds (proposed). | M |
| NFR-010 | Reliability | Availability is 99.5% a month (about 3.6 hours of downtime) outside announced maintenance (proposed). | S |
| NFR-011 | Reliability | Data and uploaded files are backed up daily, and a restore is rehearsed before launch. No more than 24 hours of data can be lost (proposed). | M |
| NFR-012 | Reliability | After a total failure the site is restored within 4 hours (proposed). | S |
| NFR-013 | Reliability | Every page and form handles failure with a plain-language message. Users never see technical details, and a double submit never creates duplicates. | M |
| NFR-020 | Accessibility | All public pages meet WCAG 2.1 level AA. Admin pages meet it where practical. D03 holds the detailed rules. | M |
| NFR-021 | Accessibility | Tap targets are at least 44 by 44 px. | M |
| NFR-022 | Accessibility | Every feature works by keyboard with a visible focus. Controls have meaningful names for screen readers, and every image has a text description. | M |
| NFR-023 | Accessibility | Text can be enlarged to 200% without losing content. Layouts reflow down to 320 px width. Normal text has a contrast ratio of at least 4.5 to 1, and no meaning depends on colour alone. | M |
| NFR-030 | Expansion | Every community, event, opportunity, category and Spotlight listing belongs to a university. Adding a second university needs no change to the data structure, and no university name is written into code (B27). | M |
| NFR-031 | Expansion | Nothing an admin can edit is hard-coded: categories, tags, types, chips, plans, prices and bank details are all data (B23). | M |
| NFR-032 | Expansion | The speed budgets above still hold with ten times the launch content (proposed). | S |
| NFR-040 | Compatibility | Campusly works on the current and previous major versions of Chrome (including Android), Safari (including iPhone), Firefox, Edge and Samsung Internet. | M |
| NFR-041 | Compatibility | Pages work from 320 px to 1920 px wide, in portrait and landscape. | M |
| NFR-042 | Compatibility | Where feasible, public pages stay readable and their links usable without JavaScript, for browsers such as Opera Mini. | S |
| NFR-050 | Discoverability | Public pages are readable by search engines, with unique titles and descriptions, canonical addresses, a sitemap and structured data for events and organizations. | M |
| NFR-051 | Discoverability | Every public page has the tags that give link previews on WhatsApp, Telegram and X. | M |
| NFR-060 | Security | All traffic uses HTTPS. No secrets are stored in code. Admin, upload and Spotlight payment features pass the D12 security audit with no Critical or High findings before launch. | M |
| NFR-061 | Privacy | Each feature collects only what it needs. Version 1 holds no student personal data beyond the optional contacts given in forms and reports. | M |
| NFR-062 | Privacy | Campusly follows Nigeria's data protection law as D09 sets out. | M |
| NFR-063 | Privacy | D09 sets how long receipts, contacts and reports are kept, and data is deleted when that time is up. | M |
| NFR-070 | Operations | Errors are logged with enough detail to fix them, uptime is monitored with alerts to the developers, and admin actions are logged. | M |
| NFR-071 | Operations | Setup, settings and deployment are documented in D13 so either developer can run and release the app. | S |
| NFR-080 | Usability | From the homepage, a student reaches a Join button in no more than three taps, for example search, open a card, Join. This is tested with students before launch (B2, B28). | M |
| NFR-081 | Usability | In a test with five students new to the site, at least four find a community matching a named interest and reach its Join button without help (proposed). | S |
| NFR-090 | Language | The interface is in English, times are in West Africa Time and money is in naira. Date formats follow OQ-P12. | M |

## User stories

Each story names the requirements that deliver it, so a story can be traced to the build and to its audit check (D00 coverage rule). A story is done when every Must requirement it lists passes.

| ID | As a... | I want to... | So that... | Requirements | Pri |
| --- | --- | --- | --- | --- | --- |
| US-001 | Student | open the site and understand what it is for | I know in seconds what I can do here | FR-020, FR-021, FR-022 | M |
| US-002 | Student | search for an interest such as debate or AI | I find matching communities, events and opportunities | FR-041, FR-043, FR-044 | M |
| US-003 | Student | tap a "What are you looking for?" chip | I can start without knowing what to search | FR-023 | M |
| US-004 | Student | browse by category | I see communities in an area I care about | FR-024, FR-062, FR-063 | M |
| US-005 | Student | filter communities by type, who can join and activity | I only see ones I can join | FR-066, FR-067 | M |
| US-006 | Student | see which communities are recruiting now | I join while it is open | FR-073, FR-078 | M |
| US-007 | Student | read what a community does and why to join | I can decide quickly | FR-082, FR-083, FR-084 | M |
| US-008 | Student | see a community's upcoming and past activities | I can judge whether it is active | FR-085, FR-086 | M |
| US-009 | Student | tell whether a community is verified | I can trust it | FR-065, FR-091 | M |
| US-010 | Student | tap Join and land in the community's own group or form | I connect with real people | FR-087, FR-088 | M |
| US-011 | Student | see all upcoming events and filter them | I can plan my week | FR-110, FR-111, FR-112 | M |
| US-012 | Student | add an event to my calendar | I do not forget it | FR-117 | M |
| US-013 | Student | browse opportunities by type and see their deadlines | I apply in time | FR-135, FR-136, FR-137, FR-144 | M |
| US-014 | Student | apply through the opportunity's own link | I can take part | FR-143 | M |
| US-015 | Student | share a community, event or opportunity on WhatsApp | my friends can see it | FR-161, FR-162, FR-163 | M |
| US-016 | Student | report a listing that is wrong or fake | the team can fix it | FR-180, FR-181 | M |
| US-017 | Student | save a community on my phone | I can come back to it | FR-079 | C |
| US-018 | Student | install Campusly like an app | it opens fast from my home screen | FR-390, FR-391 | M |
| US-019 | Student | read pages I already visited when my data runs out | I am not blocked by the connection | FR-393 | M |
| US-020 | Student | read announcements from the GDGOC team | I hear campus news | FR-370, FR-371 | M |
| US-021 | Student | give a star to a Spotlight business I like | it moves up the ranking | FR-283, FR-285 | M |
| US-022 | Student | see how Spotlight ranking works | I trust the order | FR-307 | M |
| US-023 | Student | contact a Spotlight seller directly | I can buy what they offer | FR-284, FR-288 | M |
| US-024 | Community leader | list my community without creating an account | I can finish in minutes | FR-016, FR-195, FR-204 | M |
| US-025 | Community leader | know my submission arrived and what happens next | I am not left guessing | FR-197, FR-208 | M |
| US-026 | Community leader | send proof so my community can be verified | it earns the Verified badge | FR-212 | M |
| US-027 | Community leader | hear why a submission was rejected | I can fix it and try again | FR-209 | M |
| US-028 | Community leader | suggest an edit to my listing | the information stays current | FR-203 | S |
| US-029 | Community leader | mark my community as recruiting for a period | students join while it is open | FR-073 | M |
| US-030 | Community leader | submit events and opportunities | more students see them | FR-205, FR-206, FR-214 | M |
| US-031 | Community leader | choose which contact details are public | my privacy is protected | FR-095 | M |
| US-032 | Business owner | list my business or product on Spotlight | students on campus can find it | FR-290, FR-291 | M |
| US-033 | Business owner | choose Standard or Featured and see the price and duration | I can decide before paying | FR-292 | M |
| US-034 | Business owner | pay by bank transfer with a clear reference | the team can match my payment | FR-293, FR-294 | M |
| US-035 | Business owner | upload my receipt and track my status | I know when I go live | FR-295, FR-298 | M |
| US-036 | Business owner | come back later without a login | I can finish paying when I am ready | FR-297 | M |
| US-037 | Business owner | renew before my listing expires | I stay visible | FR-301, FR-302 | M |
| US-038 | Business owner | see the reason and refund note if my listing is rejected | the outcome is fair and clear | FR-298, FR-343 | M |
| US-039 | Business owner | request a change to my live listing | it stays accurate | FR-310 | M |
| US-040 | Admin | see everything waiting in one inbox | nothing is missed | FR-233, FR-234 | M |
| US-041 | Admin | review a submission with its evidence, then approve, verify or reject it | only trusted listings go public | FR-235, FR-236, FR-237, FR-238, FR-247 | M |
| US-042 | Admin | edit and preview a submission before approving | it looks right when it goes live | FR-238, FR-258 | M |
| US-043 | Admin | manage communities, events, opportunities, categories and tags | the catalogue stays accurate | FR-239 to FR-244 | M |
| US-044 | Admin | feature communities on the homepage | the best ones are highlighted | FR-025, FR-244 | M |
| US-045 | Admin | handle reports | problems get fixed | FR-185, FR-186 | M |
| US-046 | Admin | confirm a payment in the bank before approving | fake receipts cannot get a listing | FR-330, FR-331, FR-332 | M |
| US-047 | Admin | set plan prices, durations and the Featured cap | I need no developer to change them | FR-338, FR-339 | M |
| US-048 | Admin | have listings expire automatically | no manual clean-up is needed | FR-311, FR-334 | M |
| US-049 | Admin | spot and remove suspicious stars | the ranking stays honest | FR-341, FR-346 | M |
| US-050 | Admin | publish announcements with images | I can reach students with news | FR-373, FR-374 | M |
| US-051 | Admin | see an audit log of admin actions | we are accountable | FR-246 | M |
| US-052 | Admin | see the success metrics | we know whether Campusly works | FR-252, FR-433 | M |
| US-053 | Admin | change the bank details safely | payments cannot be redirected | FR-257 | M |
| US-054 | Admin | see stale listings and dead links | the catalogue stays fresh | FR-249 | S |

## Acceptance criteria for critical flows

Criteria are written as Given / When / Then so they can be turned directly into test cases in D10 and audit checks in D12. Values such as prices, durations and caps are owned by D07 and referenced here by name only.

| ID | Flow | Given | When | Then | Requirements |
| --- | --- | --- | --- | --- | --- |
| AC-001 | Search | a student is on any page | they type a term that matches a listing name, tag or description | results appear grouped by communities, events and opportunities, and only public items are shown | FR-041, FR-043, FR-044 |
| AC-002 | Search, no results | a student searches for a term with no match | the search runs | a friendly empty state appears with suggestions and a link to submit a community | FR-045 |
| AC-003 | Join | a community is public and has a join link | a student taps Join | the student is sent to the community's own link and the join tap is recorded as an event | FR-087, FR-088 |
| AC-004 | Join, link missing | a community has no working join link | a student opens its profile | no dead Join button is shown and the listed contact route is shown instead | FR-089 |
| AC-005 | Submit a community | a leader opens the submit form | they complete the required fields and submit | they see a confirmation with a tracking code, the item is saved as Pending, and it is not visible publicly | FR-195, FR-197, FR-204 |
| AC-006 | Submission validation | a leader leaves a required field empty or enters an invalid link | they submit | the form shows the specific error beside the field and keeps what they typed | FR-196 |
| AC-007 | Duplicate check | a submitted name matches an existing public listing | the form is submitted | the admin sees a possible-duplicate warning in the review screen | FR-237 |
| AC-008 | Spam control | a bot or a rapid repeat submitter posts the form | the abuse protection triggers | the submission is rejected without losing a genuine user's data | NFR-050, FR-199 |
| AC-009 | Approve | an admin opens a Pending item | they approve it | the item becomes public, the audit log records who did it and when, and the submitter's tracking page shows Approved | FR-236, FR-246 |
| AC-010 | Verify | an admin has completed the verification checklist | they mark the item Verified | the Verified badge shows on the profile and in cards, and the checklist result is stored | FR-247 |
| AC-011 | Reject | an admin rejects an item | they must pick or type a reason | the reason is saved and shown on the submitter's tracking page, and the item stays non-public | FR-236, FR-209 |
| AC-012 | Report | a student reports a listing | they pick a reason and submit | the report enters the admin queue and the student sees a thank-you without account creation | FR-180, FR-181, FR-185 |
| AC-013 | Event lifecycle | an approved event has passed | the end time is reached | it moves to past events and no longer shows in upcoming lists | FR-118 |
| AC-014 | Opportunity deadline | an opportunity's deadline passes | the date is reached | it shows as closed and leaves the default list, but its page stays reachable | FR-145, FR-146 |
| AC-015 | Calendar | an event page is open | a student taps Add to calendar | a calendar entry with title, time, place and link is offered | FR-117 |
| AC-016 | Share | a student taps Share on any item | the share action runs | the device share sheet opens, or the link is copied with a confirmation when it is unavailable | FR-161, FR-164 |
| AC-017 | Spotlight submission | a business owner picks a plan | they submit details and choose pay | the item is saved as awaiting payment and a unique payment reference and the bank details are shown | FR-290, FR-293, FR-294 |
| AC-018 | Receipt upload | a business owner has paid | they upload a receipt | the item moves to awaiting confirmation and the admin queue shows it with the receipt | FR-295, FR-330 |
| AC-019 | Payment confirm | an admin sees a receipt | they have not confirmed the credit in the bank | the approve action for that Spotlight item stays unavailable | FR-331, FR-332 |
| AC-020 | Spotlight live | an admin confirms payment and approves | approval is saved | the listing goes live, its start and expiry are set from the chosen plan, and the owner's status page shows the dates | FR-333, FR-334 |
| AC-021 | Star once | a student has not starred a Spotlight item | they tap the star | the count rises by one and the star shows as given on that device | FR-283, FR-285 |
| AC-022 | Star twice | the same device already starred the item | the student taps again | the count does not change and the student sees the starred state | FR-285, FR-286 |
| AC-023 | Ranking | two standard Spotlight items have different star counts | the list loads | the item with more stars ranks first, and tie-breaks follow D07 | FR-281, FR-282 |
| AC-024 | Featured placement | a Featured item is live | the Spotlight page loads | it shows in the featured strip outside the ranking and also appears in the ranked list | FR-280, FR-281 |
| AC-025 | Expiry | a Spotlight listing reaches its expiry time | the scheduled check runs | it leaves the public page, the owner sees an expired state with a renew option | FR-311, FR-301 |
| AC-026 | Renewal | a listing is within the renewal window or expired | the owner chooses renew | a new payment reference is created and the same review path applies | FR-301, FR-302 |
| AC-027 | Announcement | an admin writes an announcement | they publish it | it appears on the Announcements page in blog form, and only admins can create or edit it | FR-370, FR-373, FR-376 |
| AC-028 | Admin access | a person without an admin session | they open any admin route | they are sent to the login page and no data is returned | NFR-020, NFR-021 |
| AC-029 | Bank detail change | an admin edits the bank details | they save | the change needs re-entry of the password or a second check and is recorded in the audit log | FR-257 |
| AC-030 | Install | a student visits twice on a supported phone | the browser meets install rules | the install prompt or hint appears once and is not repeated after dismissal | FR-390, FR-391 |
| AC-031 | Offline | a student has visited a page and goes offline | they open it again | cached content shows with an offline banner, and actions that need a connection explain why they are unavailable | FR-393, FR-394 |
| AC-032 | Performance | a mid-range phone on a slow connection loads the homepage | the page loads | the main content appears within the target in NFR-001 | NFR-001, NFR-002 |
| AC-033 | Accessibility | a keyboard or screen reader user moves through the main flows | they search, open, join and share | every action can be done and announced without a mouse | NFR-030, NFR-031 |
| AC-034 | Privacy | a listing contact is marked private | a student views the profile | the private contact is not shown in the page or the data returned | FR-095, NFR-023 |
| AC-035 | Not found | a student opens a link to a removed item | the page loads | a clear not-found page with search and home links appears, not a blank page | FR-411 |

## Content standards and moderation

Campusly is only useful if what it shows is true, current and safe. These standards define what may be listed and how the admin team decides. Detailed legal wording lives in D09; the review procedure lives in D07 and D13.

### What may be listed

- A community must be real, active or about to be active, and relevant to students. It must have a way for students to join or make contact.
- An event must have a real date, a place or an online link, and an organiser.
- An opportunity must have a source that can be checked and a way to apply. It must never ask the student to pay to apply.
- A Spotlight listing must offer a real business, product or service that a student can use or buy, and must pass the same payment and review path as every other listing.

### What must never be listed

- Content that is illegal, hateful, harassing, sexual, or that encourages violence or self-harm.
- Scams, pyramid or get-rich schemes, fake jobs, fake scholarships, and anything that asks students for money to apply or collect a prize.
- Listings that copy another group's name, logo or identity without permission.
- Items that expose private personal details such as home addresses or private phone numbers without the person's consent.
- Political party campaigning, and content that targets an individual.
- Items that promote cheating, exam malpractice or the sale of academic work.

### Writing and image standards

- Names, descriptions and tags are plain, accurate and free of misleading claims. Admins may edit for clarity and spelling and must keep the meaning.
- Descriptions have a minimum useful length and a maximum length so cards stay readable.
- Images must be owned by the submitter or free to use, must be safe for all students, and must not show a recognisable person without consent. Image size and format limits are set in NFR-040 to NFR-042. The full image policy awaits OQ-P21.
- Contact details are public only when the submitter marks them public (FR-095).

### Verification levels

| Level | What it means | What the admin checks |
| --- | --- | --- |
| Community Listing | Approved and safe to show; not proven by the platform | Content meets the standards and the join route works |
| Verified | The platform has confirmed the community or organiser is genuine | The checklist in FR-247: a named contact, proof of existence or affiliation, and a working channel |

The rules for earning, keeping and losing the Verified badge belong to D07. A listing that is later found false loses the badge and may be removed.

### Moderation workflow

1. Every submission and every user report enters one admin inbox (FR-233).
2. The admin reviews the item against these standards and chooses approve, verify, reject or request more information.
3. A rejection always carries a reason the submitter can read (FR-209).
4. Serious cases, such as scams or threats, are removed first and reviewed after, and are recorded in the audit log (FR-246).
5. Repeat offenders can be blocked from submitting by device or by contact detail, as defined in D07.
6. Reports about content are acknowledged in the admin queue, and the review-time target is held for OQ-P16.

### Takedown and appeals

Anyone can ask for a listing to be changed or removed by using Report or Suggest an edit (FR-180, FR-203). The owner of a rejected or removed listing can resubmit with corrections. Formal takedown and appeal handling for legal complaints is defined in D09.

## Hand-off to the Business Rules document (D07)

The PRD says what Campusly does. D07 fixes the exact rules and numbers. The PRD names the topics below and deliberately holds none of the values, so there is one source of truth.

| # | Topic D07 must define | PRD requirements that depend on it |
| --- | --- | --- |
| 1 | Plans, prices and listing durations | FR-292, FR-338 |
| 2 | The Featured strip: number of slots, order, and what happens when full | FR-280, FR-281, OQ-P06 |
| 3 | Ranking order and tie-break rules | FR-281, FR-282 |
| 4 | Spotlight status names and the allowed moves between them | FR-298, FR-333 |
| 5 | Payment reference format and matching rules | FR-293, FR-294, FR-331 |
| 6 | Receipt rules, partial or wrong payment, and refund conditions | FR-295, FR-343 |
| 7 | Expiry timing, grace period and renewal window | FR-301, FR-302, FR-311 |
| 8 | Renewing while still live, and paying for more than one period | FR-302, OQ-P07 |
| 9 | Star rules: one per device, device identity, suspicious-star thresholds and removal | FR-285, FR-286, FR-341, FR-346 |
| 10 | Listing statuses for communities, events and opportunities | FR-236, FR-118, FR-145 |
| 11 | Verified badge: criteria, evidence, renewal and loss | FR-247 |
| 12 | Event versus Opportunity classification rule | OQ-P10 |
| 13 | Rejection reasons list and resubmission rules | FR-209 |
| 14 | Duplicate rules and merging | FR-237 |
| 15 | Report handling, escalation and repeat-offender blocking | FR-185, FR-186 |
| 16 | Review turnaround target and what counts as overdue | OQ-P16 |
| 17 | Stale listing and dead-link rules | FR-249 |
| 18 | Announcement rules: who may publish, editing and removal | FR-370 to FR-380, OQ-P23 |
| 19 | Admin roles and permissions | OQ-P05 |
| 20 | Rules for non-ABU organisers and for other universities later | OQ-P25 |

Any value that D07 decides is entered into the platform settings (FR-251, FR-338) so it can change without a code release.

## Assumptions, constraints and dependencies

### Assumptions

An assumption is something we believe but have not proven. Each has an owner to validate it and a consequence if it is wrong.

| ID | Assumption | If wrong | Validate by |
| --- | --- | --- | --- |
| A-01 | Students today find communities, events and opportunities through scattered WhatsApp groups, posters and word of mouth | The core problem is smaller than believed and the pitch must change | OQ-P24 student interviews before launch |
| A-02 | Most students use a smartphone with a mobile browser and often have limited data | Mobile-first and offline priorities shift | OQ-P18, early analytics |
| A-03 | Community leaders will submit their own listings if the form is short and needs no account | Admins must collect listings by hand and seeding takes longer | Launch seeding (OQ-P17) |
| A-04 | Communities already have a WhatsApp, Telegram or form link that works as the join route | Join cannot redirect; a contact route is needed | Submission data |
| A-05 | Local businesses will pay for Spotlight when shown a clear price and reach | Spotlight revenue is low; the section stays small | Early outreach |
| A-06 | Manual bank transfer with receipt and admin confirmation is acceptable to sellers and workable for the team | Payment gateway comes earlier than v2 | First month of Spotlight |
| A-07 | One device is a good enough proxy for one voter in v1 | Star manipulation is higher than expected; stricter checks needed | Suspicious-star reports |
| A-08 | The GDGOC ABU Zaria team can review submissions at the pace they arrive | Backlog grows and trust drops | Review queue metrics |
| A-09 | GDGOC rules allow paid listings under the Campusly name | Branding or pricing must change | OQ-P13 |
| A-10 | Two developers can build and maintain version 1 part-time while working remotely | Timeline slips; scope is cut by priority | Phase gates in D00 |

### Constraints

- **No student accounts in v1.** Everything a student does must work without sign-in; accounts and login-based voting are version 2.
- **Admin-only authentication.** Only admins log in.
- **Mobile-first PWA.** Design and performance are judged on a mid-range phone first.
- **Low and costly data.** Pages must stay light and useful on slow, expensive connections.
- **Manual payments.** No payment gateway in version 1.
- **Single university at launch.** ABU Zaria first, with a data model ready to add more.
- **Small team and budget.** Two developers, hosting costs kept low (OQ-P18, OQ-P27).
- **Waterfall order.** Design documents are approved before the build starts, per D00.
- **Legal and privacy.** Nigerian data protection expectations apply; details are in D09.

### Dependencies

| Dependency | Needed for | Owner | Status |
| --- | --- | --- | --- |
| Hosting and domain | Going live (OQ-P27) | Developers | Open |
| Email or messaging channel for admin alerts | Review alerts (OQ-P20) | Developers | Open |
| Analytics tool and consent method | Metrics (OQ-P19) | Developers | Open |
| Image storage | Logos, banners, receipts | Developers | Open |
| GDGOC approval of the rules for paid listings | Spotlight launch (OQ-P13) | GDGOC lead | Open |
| Business bank account for transfers | Spotlight (OQ-P14) | GDGOC lead | Open |
| Seed content from clubs | Launch day content (OQ-P17) | Admin team | Open |
| Review team members | Daily moderation | GDGOC lead | Open |

## Risks and mitigations

Likelihood and impact use High, Medium and Low. The detailed risk register with owners is kept in D14; this table holds the product risks that shape requirements.

| ID | Risk | Likelihood | Impact | Mitigation | Where handled |
| --- | --- | --- | --- | --- | --- |
| R-01 | Empty catalogue at launch makes the site look dead | High | High | Seed listings before launch with clubs; launch target set in OQ-P17 | Release criteria, OQ-P17 |
| R-02 | Review queue backs up and submitters lose trust | Medium | High | Tracking page, alerts, turnaround target, simple review screen | FR-208, FR-233, OQ-P16 |
| R-03 | Fake or scam listings get through | Medium | High | Mandatory approval, verification checklist, reports, audit log | FR-236, FR-247, FR-180 |
| R-04 | Star manipulation by scripts or many devices | Medium | Medium | One star per device, rate limits, suspicious-star review and removal | FR-285, FR-341, NFR-050 |
| R-05 | Fake payment receipts | Medium | High | Admin must confirm credit in the bank before approval | FR-331, FR-332 |
| R-06 | Bank details changed by an attacker | Low | High | Re-authentication and audit on change | FR-257 |
| R-07 | Admin account compromised | Low | High | Strong passwords, session limits, audit log; second factor considered in D08 | NFR-020, D08 |
| R-08 | Join links go dead or groups fill up | High | Medium | Dead-link checks, report option, stale-listing review | FR-249, FR-180 |
| R-09 | Listings go stale and lose accuracy | High | Medium | Expiry, last-updated dates, suggest an edit | FR-203, FR-249 |
| R-10 | Poor connectivity breaks the experience | High | Medium | Lightweight pages, caching, offline mode | FR-393, NFR-001 |
| R-11 | Privacy exposure of leaders' contact details | Medium | High | Public contact only when marked public; minimal data stored | FR-095, D09 |
| R-12 | Spotlight sellers feel it is unfair or unclear | Medium | Medium | Public how-ranking-works page, clear status, stated refund note | FR-307, FR-343 |
| R-13 | GDGOC or university objects to paid listings or branding | Low | High | Confirm early with the GDGOC lead | OQ-P13, OQ-P15 |
| R-14 | Scope grows beyond what two developers can build | High | High | Priority tags M/S/C, parked ideas list, phase gates | Release criteria, Parked ideas |
| R-15 | Low student adoption despite a working product | Medium | High | Validate pain early; launch with campus partners and sharing | OQ-P24, FR-160 to FR-169 |
| R-16 | Hosting or free-tier limits reached with growth | Medium | Medium | Proposed budgets confirmed; monitoring and cost review | OQ-P18, NFR-010 |
| R-17 | Abuse of images, such as inappropriate uploads | Medium | Medium | Size and type limits, admin review before public | NFR-040, OQ-P21 |

## Release criteria and phase mapping

### Version 1 release criteria

Version 1 may go live only when every item below is true. These feed the gates G0 to G7 in D00 and the audit in D12.

1. Every requirement tagged Must (M) is built and passes its acceptance criteria in D10.
2. All acceptance criteria AC-001 to AC-035 pass on a mid-range phone and a desktop browser.
3. No open defect of Critical or High severity, as defined in D00.
4. The security review in D08 and the audit in D12 are complete with no unresolved High finding.
5. Admin approval is enforced: nothing is public before approval, and this has been tested by trying to bypass it.
6. The Spotlight flow has been run end to end with a test payment, including expiry and renewal.
7. The performance, accessibility and offline targets in the NFR section are met on a throttled connection.
8. The privacy notice, terms and Spotlight terms from D09 are published, and the owner has approved the content standards.
9. The launch seed target in OQ-P17 is reached and the open questions marked as launch-blocking are answered.
10. Backups, monitoring and the rollback steps in D11 and D13 have been tried once.
11. Admins are trained on the review screen and the payment confirmation rule, with a written guide.
12. The documents D00 to D14 are on their approved versions with the change log up to date.

### Requirement to phase mapping (provisional)

Phases P0 to P10 are the provisional build phases in D00; D14 and the Prompt Sequence confirm them. Mapping is by module, so each requirement range is built in one phase.

| Phase | Focus | Requirement ranges |
| --- | --- | --- |
| P0 | Foundations: project, environments, design tokens, data model | NFR-010 to NFR-013, NFR-090 |
| P1 | Admin authentication, admin shell, audit log, settings | FR-230 to FR-232, FR-246, FR-251, NFR-020 to NFR-023 |
| P2 | Public shell, homepage and navigation | FR-001 to FR-016, FR-020 to FR-035 |
| P3 | Communities: directory, categories, profiles, join | FR-060 to FR-099 |
| P4 | Submissions and the admin review queue | FR-195 to FR-214, FR-233 to FR-245, FR-247 to FR-250, FR-253 to FR-260 |
| P5 | Events and Opportunities | FR-110 to FR-127, FR-135 to FR-149 |
| P6 | Search, sharing and reporting | FR-040 to FR-053, FR-160 to FR-169, FR-180 to FR-189 |
| P7 | Spotlight: public pages, stars, checkout and receipts | FR-280 to FR-311 |
| P8 | Spotlight admin: payment confirmation, expiry, renewal, refunds | FR-330 to FR-346 |
| P9 | Announcements, static pages, PWA and offline | FR-370 to FR-380, FR-390 to FR-399, FR-410 to FR-418 |
| P10 | Analytics, metrics dashboard, hardening and launch | FR-252, FR-430 to FR-437, NFR-001 to NFR-007, NFR-030 to NFR-090 |

Security and audit prompts run after each phase gate, as set in D00 and D12. If the schedule is under pressure, items tagged S and C are cut first; Must items are never cut without a recorded decision (DEC-###).

### After launch

Improvements go through the agile UX refinement stage only after the full production build has passed all gates.

## Parked ideas

Ideas that are good but not in version 1. Nothing here is promised. Items marked Awaiting decision came from brainstorming and need a yes or no from the owner (OQ-P03).

### Planned for version 2 or later

| Idea | Why parked |
| --- | --- |
| Student accounts and login | Version 1 is no-login by decision |
| Login-based voting replacing device-based stars | Needs accounts |
| Online payment gateway for Spotlight | Manual transfer first; gateway needs accounts and compliance |
| Other universities on the same platform | Data model ready; launch is ABU Zaria only |
| Multi-admin roles and permissions | Pending OQ-P05 |
| Native mobile apps | PWA first |
| Push notifications | Needs accounts or opt-in design and consent |
| Ratings and reviews of communities | Moderation cost and need for accounts |

### Awaiting decision (brainstormed, not in the brief)

| Idea | What it would do |
| --- | --- |
| Freshers Mode | A guided first-week view for new students with starter communities and events |
| QR codes | A printable code for each community, event or Spotlight listing that opens its page |
| Magic-link editing | Let a leader edit their own listing through an emailed link instead of Suggest an edit |
| Weekly digest | A summary of new events and opportunities sent by email or message |
| Campus Passport | A fun checklist of communities joined or events attended |
| Event check-in | Scan-in at events to count real attendance |
| Calendar feeds | A subscribable feed of events for a student's calendar |
| Co-hosted events | One event shown under more than one community |
| AI search | Natural-language search and recommendations |
| Extra categories | State or regional groups, faculty or department groups, faith groups, student government (OQ-P04) |

### Rules for parked ideas

- An idea moves into the PRD only through a change-log entry with a new FR number and a priority.
- Ideas that need accounts are not started until the account decision is made.
- No parked idea may delay the version 1 release criteria.

## Cross-reference to the original brief

The brief is cited as B1 to B30. This table lists each brief section this PRD cites, where it is delivered, and any deliberate deviation. Brief sections not listed here were not cited by a requirement and are checked in the D00 coverage review.

| Brief | Topic as used in this PRD | Delivered by | Deviation |
| --- | --- | --- | --- |
| B1 | The discoverability problem | Problem statement, goals G-01 to G-08 | None |
| B2 | Core idea: what can I get involved in | Homepage FR-020 to FR-035 | None |
| B3, B19 | Homepage structure | FR-020 to FR-035 | Spotlight and announcements entry points added (DEC-004, DEC-007) |
| B4 | Search | FR-040 to FR-053 | None |
| B5, B10 | Categories, filters and directory | FR-060 to FR-079 | Extra categories parked (OQ-P04) |
| B6 | Community profile and Join redirect | FR-080 to FR-099 | None; no memberships in v1 |
| B8 | Events and opportunities | FR-110 to FR-149 | Classification rule open (OQ-P10) |
| B9, B16 | Recommendations and personalization | Excluded in v1 (exclusions list) | Parked to later versions |
| B12 | Submissions and approval | FR-195 to FR-214, FR-233 to FR-245 | Anyone may submit without login (DEC-003) |
| B13 | Admin dashboard | FR-230 to FR-260 | Roles open (OQ-P05) |
| B14 | Verification and badges | FR-247, content standards | Rules owned by D07 |
| B17 | Mobile-first, light and fast, PWA | FR-390 to FR-399, NFR-001 to NFR-007 | Installable app added (DEC-002) |
| B23 | Admin-editable content and settings | FR-251, FR-338 | None |
| B24 | Sharing and WhatsApp | FR-160 to FR-169 | None |
| B25 | Audit and reports | FR-185, FR-246 | None |
| B26 | Phase 1 MVP scope | Scope and release criteria | Spotlight, Announcements and PWA added |
| B27 | Expansion to other universities | Data model readiness, NFR-060 to NFR-063 | Other universities parked to v2 |
| B28 | Hand students to the real organisation | Join and Apply redirects | None |
| B29 | Simple design, not a portal | Design principles, UI rules | None |
| B30 | Success measured by participation | Metrics M-01 to M-24 | None |

### Additions beyond the brief

Spotlight (DEC-004, DEC-005), Announcements (DEC-007), no-login installable PWA (DEC-002) and the Campusly name come from owner decisions after the brief. Items tagged ADD in requirement tables are author proposals that stay provisional until OQ-P03 is answered.

## Open questions

Questions the owner or team must answer. "Needed by" is the gate before which an answer is required (gates are in D00). Until answered, the stated default applies.

| ID | Question | Default until answered | Needed by |
| --- | --- | --- | --- |
| OQ-P01 | Should students be able to save communities on their own device (FR-079)? | Include as Could | G2 |
| OQ-P02 | Are the homepage "What are you looking for?" chips shortcut filters? | Yes, shortcut filters | G2 |
| OQ-P03 | Confirm or remove every item tagged ADD | Keep as provisional | G2 |
| OQ-P04 | Add categories for state or region, faculty or department, faith and student government? | Not in v1 | G2 |
| OQ-P05 | Single admin login or several admin accounts with roles? | Single role | G2 |
| OQ-P06 | Featured slot cap and waitlist behaviour | Decided in D07 | G2 |
| OQ-P07 | Can a seller pay for more than one period at once? | One period at a time | G2 |
| OQ-P08 | Spotlight category list | Proposed in D07 | G2 |
| OQ-P09 | Should Spotlight items appear in site search? | No | G2 |
| OQ-P10 | Rule separating Event from Opportunity | Event has a time and place; opportunity has a deadline and an apply route | G2 |
| OQ-P11 | Interface language | English only | G2 |
| OQ-P12 | Date and time format | Day Month Year, 12-hour, WAT | G2 |
| OQ-P13 | Does GDGOC allow paid listings and the Campusly branding? | Assume yes | G1 |
| OQ-P14 | Who owns the receiving bank account, and are there tax duties? | Owner to confirm | G3 |
| OQ-P15 | Does the university need to recognise or approve Campusly? | Not required | G1 |
| OQ-P16 | Target review turnaround for submissions | Decided in D07 | G3 |
| OQ-P17 | Number of listings needed to launch | Set with the owner | G6 |
| OQ-P18 | Expected traffic; confirm proposed hosting budgets | Low-cost tier | G3 |
| OQ-P19 | Analytics tool and consent method | Privacy-friendly tool | G3 |
| OQ-P20 | Channel for admin alerts (email or messaging) | Email | G3 |
| OQ-P21 | Image policy and moderation | Admin review before public | G3 |
| OQ-P22 | Metric targets | Set after a baseline period | After launch |
| OQ-P23 | Announcement features: pinning, scheduling | Not in v1 | G2 |
| OQ-P24 | Validate the pain hypotheses with students | Interviews before launch | G1 |
| OQ-P25 | May organisers outside ABU list items? | Not in v1 | G2 |
| OQ-P26 | Name shown as announcement author | "Campusly team" | G2 |
| OQ-P27 | Domain name and hosting provider | Owner to choose | G3 |
| OQ-P28 | Should a short participation survey run after launch? | Not in v1 | After launch |

## Change log

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-10-24 | Claude, for the Campusly team | First complete draft of the PRD: scope, requirements FR and NFR, metrics, user stories, acceptance criteria, risks, release criteria, parked ideas, brief cross-reference and open questions. Awaiting owner review. |
| 1.0.0 | 2026-11-02 | Amr Suleiman & Lead Software Engineer | Baselined at Gate G1. Formalized acceptance criteria across all modules (FR-001 to FR-449), confirmed v1 boundaries and exclusions, aligned with D00 and D07. |

Changes after approval follow the D00 change-control rule: each change gets a log row, a version bump and a check of the documents that depend on this one.


