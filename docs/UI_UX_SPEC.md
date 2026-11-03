---
doc_id: D03
title: UI/UX Specification and Design Tokens
file: UI_UX_SPEC.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / UI Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0, D02@1.0.0, D04@1.0.0]
---

# D03 UI/UX Specification

Nov 1, 2026 · @Amr Suleiman

## 1. Document control and how to read this spec

D03 turns the wireframes (D02) and requirements (D01) into a buildable interface specification: every component, screen, state and interaction the AI builder and the two developers need, using D04 tokens and D07 rules. If this document disagrees with D07 on a rule, D07 wins; if it disagrees with D04 on a visual value, D04 wins; if it disagrees with D02 on layout, this document wins because it is later and more detailed.

| Field | Value |
| --- | --- |
| Document | D03 UI/UX Specification |
| Version | 0.1.0 (first full draft) |
| Status | Draft for owner review |
| Phase and gate | P2 Design, gate G2 |
| Inputs | D00 Document Map, D01 PRD, D02 Wireframes, D04 Brand Assets, D07 Business Rules |
| Feeds | D05 Architecture, D06 API Contract, D08 Security, D10 Prompt Sequence, D11 Audit, D14 UX Backlog |
| Owners | Amr (product), two remote developers (build) |

**ID conventions.** Requirements here use the prefix UI-, grouped by area: UI-1xx principles, UI-2xx tokens and layout, UI-3xx components, UI-4xx screens, UI-5xx interactions, UI-6xx content, UI-7xx accessibility, UI-8xx performance. Each ID is stable once published. Screens are cited by WF id from D02 and requirements by FR range from D01.

**Words used.** "Must" is a requirement the audit (D11) will test. "Should" is a strong default that may be changed with a logged decision. "May" is optional. Values marked *Proposed* are defaults the owner can change; each links to an open question in section 12.

**What this document does not do.** It does not set prices, durations, limits or status names (D07), table or field limits (D05), endpoints (D06), security values (D08) or legal wording (D09). It points to them by name, so a change there never needs a change here.

## 2. Design principles and UX goals

Campusly's interface must work on a low-cost Android phone, on a weak mobile connection, with no account, for a student who has about ten seconds of attention. Eight principles follow; every later decision is tested against them.

| ID | Principle | What it means in practice |
| --- | --- | --- |
| UI-101 | Content first | The listing is the visual. Chrome stays quiet; decoration is limited to the tint and icon of a category. |
| UI-102 | Find in three taps | From the home screen, a person reaches any event, community or opportunity in three taps or fewer, or by one search. |
| UI-103 | No login, no friction | Nothing the public does asks for sign-in, email or phone. Stars and submissions use a device token (D01, D07). |
| UI-104 | Honest about money | Paid content is always labelled, never ranked as organic, and never styled to look like Verified or Announcement content. |
| UI-105 | Thumb-reachable | Primary actions sit in the lower half of the screen; the tab bar and the sticky action bar are within thumb reach. |
| UI-106 | Light on data | First screen under the budgets in section 12. Images lazy-load, and text is useful before any image arrives. |
| UI-107 | Works offline | Previously viewed pages and the shell open offline; actions that need the network say so and queue only where D07 allows. |
| UI-108 | Accessible by default | WCAG 2.2 AA is the floor, not a polish pass: contrast, focus, targets, text size, reduced motion, screen readers. |

### UX goals and how they are measured

| Goal | Target (Proposed) | Measured by (D01 analytics FR-430 to FR-437) |
| --- | --- | --- |
| A new visitor finds something relevant | 70 percent of first sessions open at least one listing | listing\_open per session |
| Search works | 80 percent of searches end with a tap on a result | search\_result\_tap rate |
| Submitting is easy | 85 percent of started submissions are completed | submit\_start vs submit\_complete |
| Install is welcomed, not nagged | Install prompt shown at most twice per device; dismissal respected | pwa\_prompt events |
| Spotlight is clear | Fewer than 5 percent of Spotlight submissions are returned for missing receipt or wrong reference | admin review reasons |
| Fast on weak networks | Meets the budgets in section 12 on a mid-range Android on 3G | Lighthouse and field timing |

Targets are starting points for the first term after launch and are reviewed in D14; they are not release gates except where section 12 says so.

### Audiences the design must serve

- **Student explorer.** First-year or returning student on a phone; wants to know what is on this week and which clubs fit.
- **Organiser.** Club executive or lecturer submitting a community, event or opportunity; may be on a shared device and needs to come back to check status.
- **Business owner.** Local vendor or service wanting a Spotlight listing; needs price, proof of payment and status without learning a system.
- **Admin reviewer.** Works in short bursts on a phone or a laptop; needs a fast queue, clear reasons and no accidental destructive actions.
- **Visitor with assistive needs.** Uses a screen reader, large text, switch control, or a keyboard on a laptop.

## 3. Design tokens and theming

Colours, type and category pairs come from D04 and are referred to here only by token name (for example `color.brand`, `type.h2`). The tokens below cover what D04 does not: space, shape, depth, motion, breakpoints and layering. All are *Proposed* defaults and ship in the same `tokens.json` as D04 (UI-201).

### Spacing, shape and depth

| Token | Value | Use |
| --- | --- | --- |
| space.1 | 4 px | Icon to label gap |
| space.2 | 8 px | Chip padding, tight stacks |
| space.3 | 12 px | Card inner gaps |
| space.4 | 16 px | Page gutter on phones, default padding |
| space.5 | 24 px | Section spacing inside a page |
| space.6 | 32 px | Between major blocks |
| space.7 | 48 px | Page top and bottom on desktop |
| radius.sm | 8 px | Chips, inputs |
| radius.md | 12 px | Cards, buttons |
| radius.lg | 20 px | Sheets, dialogs |
| radius.full | 999 px | Pills, avatars |
| border.default | 1 px solid color-mix of text at 12 percent | Card and input outlines |
| elevation.0 | none | Flat cards on surface |
| elevation.1 | 0 1 3 px at 10 percent Charcoal | Sticky bars |
| elevation.2 | 0 8 24 px at 16 percent Charcoal | Sheets, menus, dialogs |

In the dark theme, depth comes from lighter surfaces (`color.surface`, `color.raised`) rather than shadows. Shadows are kept only on sheets for separation.

### Motion

| Token | Value | Use |
| --- | --- | --- |
| motion.fast | 120 ms ease-out | Hover, press, chip toggle |
| motion.base | 200 ms ease-in-out | Sheets, toasts, tab change |
| motion.slow | 320 ms ease-in-out | Page transitions, skeleton fade |
| motion.star | 280 ms spring, scale 1 to 1.25 to 1 | Star confirmation |

- UI-202: When the device asks for reduced motion, all durations drop to 0 ms except opacity fades of 100 ms, and the star shows a colour change only.
- UI-203: Nothing moves for more than 400 ms, and nothing loops except the skeleton shimmer, which stops after 8 seconds.

### Breakpoints and layout columns

| Name | Width | Columns | Gutter | Behaviour |
| --- | --- | --- | --- | --- |
| xs | 0 to 479 px | 4 | 16 px | Primary target; single column, bottom tab bar |
| sm | 480 to 767 px | 4 | 16 px | Larger phones; two-up cards where a card is compact |
| md | 768 to 1023 px | 8 | 24 px | Tablet; two columns, side filters become a sheet |
| lg | 1024 px and up | 12 | 24 px | Desktop; top navigation, content max width 1120 px, side filter panel |

### Layers

| Token | Value | Layer |
| --- | --- | --- |
| z.base | 0 | Content |
| z.sticky | 10 | Sticky action bar, filter bar |
| z.nav | 20 | Top bar, bottom tab bar |
| z.sheet | 30 | Bottom sheets, side panels |
| z.dialog | 40 | Modal dialogs |
| z.toast | 50 | Toasts and banners |

### Theming rules

- UI-204: The app follows `prefers-color-scheme` on first visit and offers Light, Dark and System in the footer and in the install settings sheet. The choice is remembered on the device.
- UI-205: The theme is applied before first paint (inline script on the document element) so there is no flash of the wrong theme.
- UI-206: Components never use a raw hex value; they use tokens. The audit (D11) fails any raw hex outside the token file and brand drawings.
- UI-207: Both themes are tested for every screen in section 7 and 8 at 200 percent text size.

## 4. Layout system and navigation

### App shell

- UI-210: The shell is a top bar (page title, search icon, theme and install menu), a content area, and on xs to md a bottom tab bar. On lg the tab bar becomes a top navigation row.
- UI-211: The shell and its CSS are precached by the service worker so the frame opens instantly offline (D01 FR-390 to FR-399).
- UI-212: Respect device safe areas (`env(safe-area-inset-*)`) at the bottom tab bar and the top bar for notched phones.
- UI-213: Content is never hidden under the tab bar; the page adds bottom padding equal to the bar height plus the safe area.

### Primary navigation (bottom tab bar)

| Tab | Label | Route | Icon idea |
| --- | --- | --- | --- |
| 1 | Home | / | house |
| 2 | Explore | /explore | compass |
| 3 | Events | /events | calendar |
| 4 | Opportunities | /opportunities | spark or briefcase |
| 5 | Spotlight | /spotlight | megaphone, with the Paid listing marker never shown on the tab itself |

Search is a persistent icon in the top bar (opens /search) and the home search field. Announcements are reached from a pinned banner on Home and from /announcements in the footer and More menu. "Submit" and "Track" sit in a More sheet opened from the top bar menu on every page and in the footer on lg. Five tabs is the maximum; a sixth item always goes to More (UI-214).

### Route map

Routes follow D02; this table is the contract that D05 and D06 build on.

| Route | Screen | WF (D02) |
| --- | --- | --- |
| / | Home | WF-001 and related |
| /search | Search and results | Search group |
| /explore | Category explorer | Categories group |
| /communities/\[slug\] | Community profile | Profile group |
| /events and /events/\[id\] | Events list and detail | Events group |
| /opportunities and /opportunities/\[id\] | Opportunities list and detail | Opportunities group |
| /spotlight and /spotlight/\[id\] | Spotlight listings and detail | Spotlight public group |
| /spotlight/list | Start a Spotlight listing | Spotlight flow |
| /spotlight/status | Check Spotlight status | Spotlight flow |
| /announcements | Announcements | Announcements group |
| /submit | Submit a community, event or opportunity | Submission group |
| /track | Track a submission | Tracking group |
| /about, /contact, /terms, /privacy, /licences | Static pages | Static group |
| /admin/... | Admin console | Admin group |

Exact WF numbers per screen appear in section 7 and 8. Unknown routes show the not-found screen with search and the home link. Admin routes are not linked from the public shell and are disallowed in `robots.txt` (D08 owns the rule).

### Navigation behaviour

- UI-215: The browser back button and the device back gesture always work. Sheets and dialogs close on back before the page does.
- UI-216: Filters, search text and sort live in the URL query so a result list can be shared and restored. Scroll position is restored when returning to a list.
- UI-217: Every listing has a stable deep link (/events/\[id\], /communities/\[slug\]) that works when opened from WhatsApp, with a clear fallback if the item has been removed or expired (the Expired and Removed states in section 9).
- UI-218: An installed PWA opens to the last tab used for up to 30 minutes of inactivity, otherwise to Home.
- UI-219: The active tab has a filled icon, `color.brand` text, and `aria-current="page"`; it never relies on colour alone.
- UI-220: Long lists use "Load more" with a visible count rather than infinite scroll, so the footer and More menu stay reachable (accessibility and data thrift).

### Grid and content widths

- Single column on xs; cards fill the width with `space.4` gutters.
- sm allows two-up compact cards (events and opportunities only; community cards stay single).
- md and lg use a content column of up to 720 px for detail pages and a 12-column grid with a 280 px filter panel for list pages.
- Images keep their aspect ratio (16:9 card, 1:1 avatar) and reserve their space to prevent layout shift.

## 5. Component library, part 1: controls, labels and cards

Every component lists its anatomy, variants, states and rules. States all components share: default, hover (pointer only), focus-visible, pressed, disabled, loading. Focus is a 3 px `color.info` ring with a 2 px offset, never removed (UI-301).

### Buttons

| Variant | Look | Use |
| --- | --- | --- |
| Primary | `color.brand` fill, white text in light (Charcoal text in dark), `type.button` | One per screen: Submit, Copy link, Pay |
| Secondary | Outline `color.brand`, brand text | Alternative action |
| Tertiary | Text only, underlined on focus | Low-emphasis, Cancel |
| Destructive | `color.danger` fill or outline | Remove, Cancel listing; always confirmed (section 9) |
| Icon button | 44 × 44 px, transparent, icon only with accessible name | Share, star, close |

- UI-302: Minimum height 48 px; full-width on xs for primary form actions.
- UI-303: Loading shows a spinner and the label changes to progress text ("Submitting…"); the button is disabled but remains in place, and `aria-busy` is set.
- UI-304: Never disable a button with no explanation; if blocked, state why under it.

### Inputs

| Input | Rules |
| --- | --- |
| Text field | Visible label above (never placeholder-only), 48 px high, helper text below, error replaces helper in `color.danger` with an icon |
| Text area | Character counter shows remaining characters near the limit (limits owned by D05) |
| Select | Native select on phones for reliability; custom listbox only on lg |
| Date and time | Native pickers; display format "14 Nov 2026" and WAT (D07 BR-060 to BR-064) |
| File upload | Shows allowed types and size up front, preview, remove button; progress bar; uses the camera or gallery on phones |
| Search field | Magnifier icon, clear button, 16 px text minimum, debounced 250 ms, suggestions list below |
| Checkbox, radio, switch | 24 px control inside a 44 px target; label is part of the target |

- UI-305: Validate on blur and on submit, never while the person is mid-typing the first time. Focus moves to the first invalid field on submit, and an error summary at the top lists each problem as a link to its field.
- UI-306: Required fields are marked in words ("required" or "optional") not with an asterisk alone.
- UI-307: Inputs use the right `inputmode` and `autocomplete` values (numeric for amounts, tel for phone).

### Chips, badges and status labels

- **Category chip:** category tint background, ink text, category icon, 32 px high, 44 px target when tappable.
- **Filter chip:** toggle with check icon when on; the selected state is also exposed with `aria-pressed`.
- **Badges:** Verified (shield-check, `color.success`), Closing soon (clock, `color.accent` with Charcoal text), Paid listing (tag, neutral outline with text "Paid listing"), New (dot plus text).
- UI-308: The Verified badge and the Paid listing label never share a style, and a Spotlight listing can never show Verified (D07 BR-034).
- UI-309: Status labels mirror D07 exactly and are shown only to the owner or an admin, never to the public.

| Status | Colour role | Icon |
| --- | --- | --- |
| Pending, Receipt submitted | `color.info` | clock |
| Needs info | `color.accent` (Charcoal text) | message |
| Approved, Active | `color.success` | check |
| Verified | `color.success` solid | shield-check |
| Rejected, Removed, Cancelled | `color.danger` | x |
| Hidden, Paused, Expired | `color.text-muted` | pause or archive |
| Awaiting payment | `color.accent` | wallet |

### Cards

All cards are one tappable block (the whole card is the link) with a visible title, and no nested interactive element smaller than 44 px. Images are optional and fall back to the category tint and icon (D04 IMG-02).

| Card | Content, in order | Distinct rules |
| --- | --- | --- |
| Community | Avatar or tint, name, category chip, one-line summary, member or star count, Verified badge | Star control top right |
| Event | Date block (day and month), title, venue, time with WAT, community name, Closing soon if applicable | Past events dim and move below upcoming |
| Opportunity | Type (internship, scholarship, volunteering, other), title, organiser, deadline, rolling label if rolling | "Closing soon" at the D07 threshold |
| Spotlight | Business image, name, category, offer line, Paid listing label, Standard or Featured styling | Featured gets a thicker outline and the strip slot, never a larger "recommended" label |
| Announcement | Pin icon if pinned, title, date, short body | Admin only; neutral surface, not a card that looks like an ad |

### Star control

- UI-310: Outline star with count; tap fills it, increments the count at once (optimistic) and sends the request. If the server refuses (rate limit or cap, D07 BR-200 to BR-217), the star reverts and a toast explains in plain words.
- UI-311: One star per device per listing and no unstar, so after starring the control is filled, shows "Starred" to screen readers, and is not tappable.
- UI-312: The count uses tabular figures, shortens above 999 ("1.2k"), and its accessible name reads the full number.
- UI-313: The star never appears on Spotlight or Announcements (D07 ranks only community listings).

## 6. Component library, part 2: overlays, feedback and structure

### Overlays

| Component | Spec |
| --- | --- |
| Bottom sheet | Slides up on xs to md; max height 90 percent; drag handle; close button; traps focus; closes on back, scrim tap or Escape; becomes a centred dialog on lg |
| Dialog | For confirmations only (destructive or irreversible); title, one-sentence consequence, two buttons with the safe one first and focused by default |
| Filter sheet | Category, date range, type, sort; "Show N results" button updates live; "Clear all" in the header |
| Share sheet | Uses the native share action where available; otherwise Copy link, WhatsApp, X, Telegram; shows the generated preview (D04 SHR-01 to SHR-05) |
| Install sheet | Explains the benefit in one line; Install and Not now buttons; Not now hides it for 14 days, and two dismissals stop it (UI-605 in section 10) |
| Menu | More menu: Submit, Track, Announcements, About, Contact, Theme, Licences |

### Feedback

| Component | Spec |
| --- | --- |
| Toast | Bottom, above the tab bar; 4 seconds, 8 for errors; one at a time; has an action only if useful (Undo, Retry); `role="status"` or `"alert"` for errors |
| Banner | Top of the content, persistent until dismissed or resolved: offline, announcement pin, install, maintenance. Banners stack at most two |
| Inline message | Used in forms; icon plus text; never colour alone |
| Progress | Linear bar for uploads, spinner under 2 seconds, skeleton above |
| Skeleton | Shape of the card or detail page; same dimensions so nothing jumps; fades into content (`motion.slow`) |
| Empty state | Illustration (D04 ILL-04), one sentence, one next action (D04 COP-12) |
| Error state | Plain sentence of what happened, retry button, and a Home link; never a stack trace or raw code |

### Lists, filters and pagination

- UI-320: Lists show a result count ("24 events") and the active filters as removable chips above the first card.
- UI-321: Default sorts (D07 ranking rules): communities by stars then recency, events by start date ascending (upcoming first), opportunities by closing date ascending with rolling last, Spotlight by Featured then rotation then start.
- UI-322: Page size is 12 on xs and sm, 24 on md and lg, with "Load more" (UI-220) and an accessible live count update.
- UI-323: Sort and filter changes never reset the scroll to a different place without announcing it; the result list gets focus on change for keyboard users.
- UI-324: An empty result offers to clear filters and, for search, suggests categories.

### Tables, forms and tools for admins

| Component | Spec |
| --- | --- |
| Review queue | Cards on xs, table on lg; columns: type, title, submitted, age (overdue marker from D07 targets), status, assigned; filters by status and type; sticky header on lg |
| Detail review panel | Submission fields, attachments, duplicate hints, history, and a decision bar: Approve, Verify (communities), Needs info, Reject with a required reason from the D07 list |
| Decision bar | Sticky at the bottom; destructive decisions open the confirm dialog; shows the role permission message if the action is not allowed (D07 BR-260 to BR-265) |
| Payment panel | Reference, plan, amount from settings, receipt image, "Confirmed in bank" checkbox that must be ticked before Activate (D07 BR-140 to BR-152) |
| Settings editor | Grouped by D07 settings register; each key shows its current value, description, last changed by and when; edits need a note |
| Audit trail | Read-only list of who did what and when, filterable; cannot be edited |
| Role gate | Pages and buttons the signed-in admin may not use are hidden, not just disabled, and the server enforces the same rule (D08) |

- UI-325: Admin screens are usable on a phone but optimised for lg; no admin task is blocked on small screens.
- UI-326: Admin actions that change public content show a preview of what the public will see before confirming.
- UI-327: The admin area has its own header showing the signed-in role and a Sign out button, and uses a distinct top-bar colour (`color.brand-strong`) so it is never mistaken for the public app.

## 7. Screen specifications: public app

Each screen lists purpose, content in order, actions, states and rules. The wireframe group in D02 and the FR range in D01 are named so the builder can trace each element. Exact WF numbers are confirmed in the D11 traceability audit (section 12).

### 7.1 Home (D02 Home group; FR-020 to FR-035)

1. Top bar with logo, search icon, menu.
2. Search field (opens /search on focus).
3. Pinned announcement banner, only if one is pinned (admin-only content, D07 BR-250 to BR-255).
4. "This week" strip: up to 6 upcoming events, horizontal scroll with a "See all" link.
5. Category tiles: the ten categories, two columns, tint and icon.
6. Featured Spotlight strip: up to the slot cap (D07 BR-225 to BR-234), each with Paid listing label, and a "See all Spotlight" link. The strip is labelled "Spotlight" with the words "Paid listings" beside it.
7. Closing soon opportunities: up to 4.
8. Top communities by stars: up to 6, with "Explore all".
9. Footer links and install prompt (when eligible).

- UI-401: Sections with no content are removed, not shown empty, except the first-ever visit where the empty state explains Campusly is new and invites a submission.
- UI-402: The Spotlight strip appears below the organic sections on first scroll so paid content never sits above the fold of organic content (UI-104).
- UI-403: All strips are keyboard accessible, and horizontal scroll has visible next and previous controls on lg.

### 7.2 Search (Search group; FR-040 to FR-053)

- Field with recent searches (stored on the device only, clearable) and category suggestions.
- Results grouped by type with tabs All, Communities, Events, Opportunities; Spotlight results are never mixed into organic results and appear in a separate, labelled group at the end (FR rules in D01).
- Typo tolerance and plural matching on the server (D05); the UI shows "Showing results for X" with an "Search instead for Y" link when a correction is used.
- No-results state: tips, popular categories, and a "Submit it" link.

### 7.3 Explore and category pages (Categories group; FR-060 to FR-079)

- Explore lists the ten categories as tiles with a count of live communities and upcoming events.
- A category page has a header (tint, icon, name), tabs Communities, Events, Opportunities, and the shared filter and sort bar.
- UI-410: Category counts only include Approved and Verified items.

### 7.4 Community profile (Profile group; FR-080 to FR-099)

| Block | Content |
| --- | --- |
| Header | Avatar, name, category chip, Verified badge if applicable, star control, Share |
| About | Description, how to join, who can join, meeting times |
| Contact | Official channels only (links open in a new tab; the full address is not shown for email, use a copy button) |
| Upcoming | Events and opportunities from this community |
| Details | Founded, size band, campus location |
| Report | "Report this page" link at the bottom opens the report sheet (FR-180 to FR-189) |

- UI-411: A sticky action bar shows Join or Contact, and Share. Join opens the organiser's channel; Campusly never collects the person's details.
- UI-412: If the community is Hidden or Removed, the page shows the not-available state with search and does not reveal why.

### 7.5 Events (Events group; FR-110 to FR-127)

- List: tabs This week, Upcoming, Past; calendar-style date blocks; filters category, date range, free or paid.
- Detail: title, date and time in WAT, venue with map link (opens the phone's map), organiser (links to community), description, how to attend or register (external link, labelled with its destination), and "Add to calendar" which downloads an .ics file.
- UI-413: The date and time appear together and in words for screen readers ("Friday 14 November 2026, 4:00 to 7:00 pm WAT").
- UI-414: Past events keep their page for the period set in D07 and show "This event has ended" with similar upcoming events.

### 7.6 Opportunities (Opportunities group; FR-135 to FR-149)

- List: type tabs, deadline sort, "Closing soon" chip, rolling labelled "Rolling".
- Detail: organiser, eligibility, what is offered, deadline, how to apply (external link with its domain shown), requirements, and Report link.
- UI-415: The apply link always shows the destination domain and a notice that Campusly does not run the application.

### 7.7 Spotlight (Spotlight public group; FR-280 to FR-311)

- List: header explains "Paid listings from local businesses" in one line; filters by Spotlight category; Featured items first, then rotation (D07 BR-225 to BR-234); each card carries the Paid listing label.
- Detail: image, name, offer, description, contact and links, location, and the label "Paid listing" next to the title. A link to "How Spotlight works" explains payment and review.
- A visible "Advertise here" call to action opens /spotlight/list.
- UI-416: No Spotlight element uses the Verified badge, star control or Announcement styling.
- UI-417: Expired or cancelled Spotlight listings return the not-available state within the expiry check interval (D07 BR-160 to BR-170).

### 7.8 Announcements (Announcements group; FR-370 to FR-380)

- Reverse-chronological list; pinned ones first; each opens inline with full text. Admin-authored only; no comments or reactions.
- Pinned announcement may appear as a Home banner (7.1) and can be dismissed per device.

### 7.9 Static and system screens (Static group; FR-410 to FR-418)

About, Contact, Terms, Privacy, Licences, Not found, Offline, Maintenance, and Error. All use the same reading layout (max 70 characters wide, `type.body`), a table of contents for long pages, and links that are underlined.

## 8. Screen specifications: submissions, tracking, Spotlight flow and admin

### 8.1 Submit (Submission group; FR-195 to FR-214)

A single guided flow at /submit with a progress indicator ("Step 2 of 4"). The person first chooses what they are submitting: Community, Event or Opportunity.

| Step | Content |
| --- | --- |
| 1. Type | Three large choices with one-line explanations, and the D07 rule that separates events from opportunities shown as a hint |
| 2. Details | Name or title, category, description, dates (events: start and end; opportunities: deadline or rolling), links, location |
| 3. Contact and proof | Named contact, official channel, proof for Verified requests (communities only), image with alt text |
| 4. Review and send | Summary of everything, the content standards checkbox, a notice on duplicates, and Submit |

- UI-420: Progress is saved on the device as a draft for 7 days and offered on return; drafts are never sent until the person presses Submit.
- UI-421: Duplicate hints appear after step 2 ("This looks like an existing page. Is this the same?") without blocking submission (D07 BR-040 to BR-049).
- UI-422: The submit cap (D07 BR-010 to BR-024) is explained on the page before it can be hit, and the limit message states when the person can try again.
- UI-423: Success screen shows the tracking code CY-XXXX-XXXX large, with Copy and Share buttons and the line "Keep this code to check progress". The code is also offered as a downloadable text file.
- UI-424: Required field errors follow UI-305; a failed upload keeps the rest of the form and offers Retry.

### 8.2 Track (Tracking group)

- One field for the tracking code with format help; lookup limit per D07 (10 per hour).
- Result shows the current status label (section 5), the date of the last change, the reason if Needs info or Rejected, and the next step.
- For Needs info, a reply form with message and optional file, within the reply window (D07 BR-010 to BR-024); expired windows explain how to resubmit.
- Unknown or malformed codes show one neutral message that does not confirm whether a code exists beyond what is required.

### 8.3 Spotlight listing flow (Spotlight flow; FR-280 to FR-311)

| Step | Content |
| --- | --- |
| 1. Plan | Standard and Featured side by side with price and days read from settings (D07), what each gives, what is not allowed (D07 BR-107) |
| 2. Business details | Name, category (8), offer, description, contact, location, image |
| 3. Review | Everything shown as the public will see it, with the Paid listing label |
| 4. Payment instructions | Bank name, account name, account number from settings, the amount, the reference SP-XXXX-XXXX with Copy, and a warning to use the reference |
| 5. Receipt | Upload payment receipt (image or PDF), optional note; status becomes Receipt submitted |

- UI-430: Bank details are read from settings on the server and shown only on step 4 and on the status page; they are never baked into the app bundle (D07 BR-140 to BR-152, D08).
- UI-431: The page states plainly that the listing starts only after the payment is confirmed in the bank and that review can reject unsuitable listings.
- UI-432: The active listing cap per business (D07 Spotlight cap) is checked before payment instructions are shown; if reached, the flow explains and stops.

### 8.4 Spotlight status (/spotlight/status)

Field for the reference SP-XXXX-XXXX; shows one of the seven D07 states in words and icon, dates (start, end), a Renew button during the renewal window, a Cancel button where D07 allows it, and refund information for the refund window.

### 8.5 Admin console (Admin group; FR-230 to FR-260, FR-330 to FR-346, FR-370 to FR-380)

| Screen | Purpose | Notes |
| --- | --- | --- |
| Sign in | Admin email and password plus second factor (D08) | Lockout message and no hint of which field failed |
| Dashboard | Counts of pending, overdue, needs info, awaiting payment; today's activity | Overdue per D07 review target |
| Review queue | Communities, events, opportunities | Section 6 review queue |
| Review detail | Full submission, duplicates, history, decision bar | Reason required for Needs info and Reject |
| Spotlight queue | Receipts, plan, amount, reference | Payment panel from section 6 |
| Spotlight manager | Active, expiring, paused, waitlist, strip slots | Pause, resume, extend with a reason |
| Announcements | Create, edit, pin, unpin, expire | Preview before publish |
| Reports | Reported items, auto-hidden items, decisions | Restore or remove |
| Verification | Review and renewal list | Evidence kept per D07 retention |
| Settings | Settings register editor | Lead role only |
| Users and roles | Reviewer, Finance, Lead | Lead role only |
| Audit log | Who did what, when | Read-only for all |

- UI-440: Each admin action shows a confirmation toast with Undo only where D07 allows reversal; otherwise a confirm dialog comes first.
- UI-441: A session timeout warns 2 minutes before sign-out and keeps unsaved decision notes (D08 owns the timeout value).
- UI-442: Destructive actions (Remove, Cancel Spotlight, delete announcement) require the confirm dialog and a reason.

## 9. Interaction patterns and states

### Standard states for every data screen

| State | Behaviour (UI-5xx) |
| --- | --- |
| Loading | UI-501: Skeleton in the shape of the content within 100 ms; spinner only for actions under 2 seconds. After 10 seconds show "Still loading" with Retry |
| Empty | UI-502: Illustration, one sentence, one next step (D04 COP-12) |
| Error | UI-503: Plain message, Retry, Home link; the error code is shown in small text for support only |
| Offline | UI-504: Banner "You are offline. Saved pages still work." Cached pages open; uncached pages show the offline screen; write actions (star, submit, report) are disabled with an explanation and are not silently queued, except drafts, which stay on the device |
| Partial | UI-505: If one section fails (for example the Spotlight strip), the rest of the page still renders and that section shows a small inline retry |
| Not available | UI-506: Removed, Hidden, Expired or unknown items show the same neutral page, with search and Home, without revealing the reason |
| Rate limited | UI-507: States the limit in plain words and when to try again; never shows a raw 429 |

### Key interaction flows

**Starring (optimistic).** Tap: control fills and count rises immediately, request sent. Success: nothing more. Refused: control reverts, toast "We could not add your star. Try again in a few minutes." Reconnect while offline: no queued stars (UI-504). The device cap and burst rules are enforced on the server (D07 BR-200 to BR-217) and never explained in a way that reveals thresholds.

**Reporting.** "Report" opens a sheet with reasons (spam, wrong information, inappropriate, scam, other), an optional note, and Send. Confirmation toast says "Thanks. We will look at it." The person is not told whether a threshold has been met (D07 BR-040 to BR-049).

**Sharing.** Share opens the native share sheet with the link and the generated preview. If sharing is unavailable, the Copy link fallback shows "Link copied" in a toast.

**Install.** Prompt appears only after the second visit and a completed useful action (a star, a search or a share), never on first load. iOS shows a short instruction card (Share, then Add to Home Screen) because it has no install event.

**Forms and drafts.** Valid draft saved every 5 seconds to the device; leaving a form with unsaved changes asks for confirmation in a dialog; success replaces the form with the confirmation screen and clears the draft.

**Destructive actions.** Always a dialog that names the object and the consequence, two buttons (safe action first and focused), and for admins a required reason. No destructive action is on a swipe or a long-press alone.

**Time-based changes.** When an event passes, a deadline passes or a Spotlight listing expires while the page is open, the next interaction or refresh shows the new state; the page does not change by itself during reading.

### Motion and feedback rules

- UI-510: Motion explains change (a sheet rising, a card collapsing); it is never decoration.
- UI-511: Press feedback within 100 ms on every tappable element.
- UI-512: Haptic feedback is not used (not reliable across the devices in scope).
- UI-513: Success is quiet (toast), warnings are visible but not blocking (banner), errors that need action are inline and focus the field.
- UI-514: Do not use confetti or celebratory animation on payment or submission confirmation; the tone is calm and reassuring (D04 voice).

## 10. Content rules, status labels and formats

D04 section 7 owns voice and copy rules. This section lists what the interface must apply and where the strings live.

- UI-601: All interface strings live in one resource file keyed by ID (for example `submit.success.title`), never inline in components, so the copy can be reviewed in one place and translated later.
- UI-602: The first release ships in English (Nigeria). Strings avoid idioms and build sentences whole (no concatenated fragments), so Hausa or other languages can be added without code changes. Right-to-left layout is out of scope for v1.
- UI-603: Numbers in prose use plain digits; money reads "₦1,000"; counts above 999 shorten ("1.2k"). Dates read "14 Nov 2026"; relative times ("2 hours ago") are used for under 24 hours only. All times are WAT (D07).
- UI-604: Figures from D07 (prices, durations, limits, windows) are read from settings at runtime. The copy file holds placeholders, such as `{plan.standard.price}`, never literal numbers.
- UI-605: The install prompt follows D04 voice: "Add Campusly to your home screen for faster access." Buttons "Install" and "Not now". Not now hides it for 14 days; a second Not now hides it permanently on that device.
- UI-606: User-submitted text is plain text with line breaks. Links are detected, shown with their domain, and open in a new tab with `rel="noopener noreferrer"`. Markup is never rendered (D08).
- UI-607: Truncation uses an ellipsis at a word boundary; the full text is one tap away. Titles wrap to two lines on cards.

### Status wording shown to the owner or tracker

| Status | Owner sees | Next step line |
| --- | --- | --- |
| Pending | We are reviewing this. | We aim to reply within {review.target} working days. |
| Needs info | We need a little more from you. | Reply within {info.window} days to keep it open. |
| Approved | Live on Campusly. | Share your link. |
| Verified | Live and Verified. | Your Verified status is reviewed every {verification.review} months. |
| Rejected | We could not publish this. | Reason shown from the D07 list, with how to fix and resubmit. |
| Hidden | Not showing publicly right now. | We will contact you if we need anything. |
| Removed | This page has been removed. | Contact us if you think this is a mistake. |
| Awaiting payment | Pay to start your listing. | Use your reference and upload your receipt. |
| Receipt submitted | We are checking your payment. | We start your listing when it is confirmed in our bank. |
| Active | Live in Spotlight. | Ends on the date shown. |
| Expired | Your listing has ended. | Renew within {renewal.window} hours to keep your slot. |

Placeholders in braces name settings keys from the D07 register; the exact key names are confirmed in D05 so copy and data do not drift.

## 11. Accessibility specification

Target: WCAG 2.2 level AA on every screen in sections 7 and 8, in both themes, at 200 percent text size, on a phone and on a laptop with a keyboard. Contrast values were already verified for tokens in D04.

| ID | Requirement |
| --- | --- |
| UI-701 | Text contrast at least 4.5:1, large text and interface parts at least 3:1, in both themes and on category tints |
| UI-702 | Information is never conveyed by colour alone: status, category, Verified, Paid listing and errors each have text or an icon |
| UI-703 | All functions work with a keyboard in a logical order; no keyboard traps; a "Skip to content" link is the first focusable item |
| UI-704 | Focus is always visible (3 px ring), and focus moves into a sheet or dialog when it opens and returns to the trigger when it closes |
| UI-705 | Touch targets at least 44 × 44 px with 8 px between neighbours (WCAG 2.2 target size) |
| UI-706 | One `h1` per page; headings in order; landmarks (header, nav, main, footer) present; page titles unique and descriptive |
| UI-707 | Images have meaningful alt text or are marked decorative; icons-only buttons have accessible names |
| UI-708 | Forms: every field has a programmatic label; errors are associated with fields and announced; autocomplete attributes are set |
| UI-709 | Dynamic changes (toasts, counts, results, errors) are announced through polite or assertive live regions as appropriate |
| UI-710 | Layout reflows at 320 px width and 400 percent zoom without horizontal scrolling (except data tables, which scroll inside a labelled region) |
| UI-711 | Respect reduced motion, high contrast and forced-colours modes; layout holds at user font sizes up to 200 percent |
| UI-712 | No time limits except where required by the service (admin session, with warning); no flashing content |
| UI-713 | Drag gestures have a tap or button alternative (WCAG 2.2 dragging movements); the bottom sheet closes with a button as well as swipe |
| UI-714 | Language is set on the page (`lang="en-NG"`); user-submitted text in other languages is allowed |
| UI-715 | Authentication does not require a cognitive test beyond the password and the second factor (WCAG 2.2 accessible authentication); paste is allowed in password fields |

### Test plan

- Automated: axe and Lighthouse accessibility run on every route in CI (D13); zero serious or critical issues blocks release.
- Manual keyboard pass on each route and each component.
- Screen reader passes with TalkBack on Android Chrome and VoiceOver on iOS Safari for Home, Search, a listing detail, Submit, Track and the Spotlight flow; NVDA on desktop for the admin console.
- Visual passes at 200 percent text, 320 px width, both themes, forced-colours and reduced-motion.
- Results are recorded in D11 and any failure is an audit finding with the UI ID.

## 12. Performance budgets, traceability, open questions and change log

### Performance budgets (UI-8xx)

Measured on a mid-range Android phone on a throttled 3G profile, with a cold cache, unless stated. These are release gates for the home screen and the listing detail (D11 checks them).

| ID | Metric | Budget |
| --- | --- | --- |
| UI-801 | Largest Contentful Paint, Home | 2.5 s or less |
| UI-802 | Interaction to Next Paint | 200 ms or less |
| UI-803 | Cumulative Layout Shift | 0.1 or less |
| UI-804 | JavaScript for the first route (compressed) | 170 KB or less |
| UI-805 | CSS for the first route (compressed) | 40 KB or less |
| UI-806 | Fonts | 90 KB or less (D04 TYP-01) |
| UI-807 | Images above the fold | 100 KB each or less, WebP, with width and height set |
| UI-808 | Repeat visit (shell cached) | Shell visible in 1 s or less |
| UI-809 | Offline | Previously opened pages and shell load with no network |

- UI-810: Images below the fold lazy-load; carousels load the first card eagerly and the rest on approach.
- UI-811: No third-party scripts in the first release except what D01 analytics requires, loaded after the page is interactive (D08, D09 review the choice).
- UI-812: Animations use transform and opacity only.

### Traceability to D01 and D02

| D01 FR range | Area | D03 section |
| --- | --- | --- |
| FR-001 to FR-016 | Shell | 4 |
| FR-020 to FR-035 | Homepage | 7.1 |
| FR-040 to FR-053 | Search | 7.2 |
| FR-060 to FR-079 | Categories | 7.3 |
| FR-080 to FR-099 | Community profile | 7.4 |
| FR-110 to FR-127 | Events | 7.5 |
| FR-135 to FR-149 | Opportunities | 7.6 |
| FR-160 to FR-169 | Sharing | 6, 9 |
| FR-180 to FR-189 | Reporting | 7.4, 9 |
| FR-195 to FR-214 | Submissions | 8.1, 8.2 |
| FR-230 to FR-260 | Admin | 8.5 |
| FR-280 to FR-311 | Spotlight public | 7.7, 8.3, 8.4 |
| FR-330 to FR-346 | Spotlight admin | 8.5 |
| FR-370 to FR-380 | Announcements | 7.8, 8.5 |
| FR-390 to FR-399 | PWA | 4, 9 |
| FR-410 to FR-418 | Static | 7.9 |
| FR-430 to FR-437 | Analytics | 2 |

The FR numbers in D01 were partly inferred during drafting, so this table is checked against the exact D01 FR ledger in the D11 audit. Any mismatch is fixed here and in D02.

### Open questions

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-U01 | Is five bottom tabs right, or should Spotlight sit in More? | Amr | Five tabs with Spotlight last |
| OQ-U02 | Should the home Spotlight strip appear below organic content or between sections? | Amr | Below organic (UI-402) |
| OQ-U03 | Is Hausa support wanted for v1? | Amr, chapter lead | English only (UI-602) |
| OQ-U04 | Do we offer "Add to calendar" for events in v1? | Amr | Yes, .ics download |
| OQ-U05 | Should the install prompt wait for the second visit? | Amr | Yes (section 9) |
| OQ-U06 | Is a live map wanted for venues, or an open-in-maps link only? | Amr | Link only |
| OQ-U07 | Should admin screens be phone-optimised or laptop-first? | Amr | Laptop-first, phone-usable (UI-325) |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-01 | First full draft: principles, tokens, layout, components, screens, interactions, content, accessibility, budgets |


