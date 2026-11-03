---
doc_id: D02
title: Wireframes and Screen Layouts
file: WIREFRAMES.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / UI Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0]
---

# Campusly Wireframes

Oct 28, 2026 · @Amr Suleiman

D02 fixes where everything sits on every Campusly screen, how a person moves between screens, and what each screen must do in each state. It turns the requirements in D01 into pictures an engineer can build and a designer can colour. It contains no colours, fonts or final copy; those belong to D03 and D04.

## Document control

| Field | Value |
| --- | --- |
| Document | D02 Wireframes |
| Version | 0.1.0, first draft for owner review |
| Owner | Campusly team, GDGOC ABU Zaria |
| Depends on | D01 PRD (requirements, site map, journeys), D00 Document Map (IDs, gates) |
| Feeds | D03 UI/UX Spec, D05 Architecture, D06 API Contract, D10 Prompt Sequence, D11 Audit Prompts |
| Owns | Page layout, navigation, user flow, screen inventory (WF-###), per-screen states |
| Does not own | Visual style (D03), brand assets (D04), prices, statuses and rules (D07), data fields (D05), endpoints (D06) |

### Rules this document follows

1. Every screen has one ID, WF-###, and every WF links to the FR requirements it satisfies. A screen with no FR is a question for the owner; an FR with no screen is a gap (checked in the traceability section).
2. Where a wireframe and D01 disagree, D01 wins until the change is logged in both documents.
3. Wireframes show structure and priority, not final wording. Text in a wireframe is a placeholder unless marked as fixed copy.
4. Prices, durations, slot counts and status names are never drawn here. A wireframe shows a labelled slot such as "Plan price (D07)" instead.
5. Mobile is drawn first. Larger screens are described as a change from mobile, in the responsive section.

## How to read the wireframes

Wireframes are drawn in low fidelity: grey boxes, labelled blocks and numbered notes. This keeps the discussion on layout and behaviour, not on taste.

### Notation

| Mark | Meaning |
| --- | --- |
| Solid box with a label | A real block of content or a control |
| Box with a cross | An image slot (logo, banner, photo) |
| Lines of grey bars | Body text of unknown length |
| Rounded pill | A chip, badge or tag |
| Heavy-outline box | The single primary action on that screen |
| Dashed outline | Optional or conditional block, with the condition in a note |
| Numbered circle | A note, explained in the table under the wireframe |
| Arrow | Navigation that leaves the screen |

### Screen ID scheme

Screens use WF-### with reserved ranges so new screens never renumber old ones.

| Range | Area |
| --- | --- |
| WF-001 to WF-019 | Global shell and shared components |
| WF-020 to WF-059 | Homepage, search, directory and categories |
| WF-060 to WF-099 | Community profile and its tabs |
| WF-100 to WF-139 | Events and Opportunities |
| WF-140 to WF-169 | Spotlight, public side |
| WF-170 to WF-189 | Announcements and static pages |
| WF-190 to WF-229 | Contributor flows: submit, track, edit, report |
| WF-230 to WF-259 | Spotlight seller flow |
| WF-260 to WF-329 | Admin |
| WF-330 to WF-349 | System states: loading, empty, error, offline |

### What each screen entry contains

Every screen is described in the same order so it can be audited: purpose, audience, route, entry points, layout, numbered notes, states, exits, and FR links. Routes are proposals; D06 and D05 confirm them.

## Layout system

The layout is built for one hand on a mid-range phone, then widened. Numbers here are structural rules; exact pixel tokens are set in D03.

### Breakpoints

| Name | Width | Columns | Main use |
| --- | --- | --- | --- |
| Mobile | up to 599 px | 4 | Default design; most students |
| Tablet | 600 to 1023 px | 8 | Two-column card grids |
| Desktop | 1024 px and above | 12 | Admin work and wide browsing |

### Rules

- **One column on mobile.** Cards stack. Filters open in a sheet that slides up from the bottom.
- **Thumb zone.** The primary action sits in the lower half of the screen or in a sticky bottom bar. Tap targets are at least 44 by 44 px with 8 px between them.
- **Content width.** Reading text is limited to about 70 characters a line on wide screens, centred, with the page background filling the rest.
- **Safe areas.** Sticky bars respect the phone's bottom gesture area and the notch.
- **Density.** Public pages are airy and card-led. Admin pages are denser and table-led, but still usable on a phone for quick approvals.
- **Above the fold.** On the homepage, the first screen shows the promise, the search bar and the category entry point without scrolling (D01 principle: answer "What can I get involved in?" in seconds).
- **Weight.** No wireframe may rely on a large hero image to make sense; the layout must work with images off, to save data.
- **Language.** Left to right, English. Layouts must survive text that is 30 percent longer, to allow for later languages (OQ-P11).

### Standard page frame

Every public screen has the same frame, drawn once in the shell section: top bar, page body, bottom bar on mobile, footer at the end of the body. Admin screens use a separate frame with a side menu on desktop and a top menu on mobile.

## Navigation model

A student reaches any main area in one tap from anywhere, and can always get back to search and home. Navigation never depends on a login.

### Public navigation

| Element | Mobile | Desktop | Contents |
| --- | --- | --- | --- |
| Top bar | Always visible | Always visible | Campusly mark (home), search field or search icon, Submit button |
| Bottom bar | 5 tabs, sticky | Hidden | Home, Explore, Events, Spotlight, More |
| Header menu | Hidden | Inline links | Explore, Events, Opportunities, Spotlight, Announcements |
| More sheet | Opens from the More tab | Footer links | Opportunities, Announcements, Submit, About, Help, Report a problem, Privacy, Terms |
| Footer | End of every page | End of every page | About, Submit, Contact, Privacy, Terms, GDGOC credit |

Opportunities sit under More on mobile because the bottom bar has room for only five tabs, and Home, Explore (communities), Events and Spotlight carry the most traffic. This is a proposal; OQ-W01 asks the owner to confirm it.

### Behaviour rules

- **Active state.** The current tab is marked by shape as well as colour, so it reads without colour vision.
- **Back.** The browser or phone back button always returns to the previous screen and keeps scroll position and filter choices. A visible back arrow shows on detail screens.
- **Deep links.** Every public item has its own address, so a shared link opens the item directly, then offers Home as the next step. A visitor who arrives from WhatsApp is never dropped on the homepage.
- **Search.** Tapping the search field opens a full-screen search with recent searches and category shortcuts. The field stays in the top bar on every page.
- **Submit.** One Submit entry in the top bar opens the submit hub, where the person picks Community, Event, Opportunity or Spotlight listing.
- **Install prompt.** Shown once as a small bar above the bottom bar, never over a form, and not shown again after dismissal.
- **Offline.** A slim banner under the top bar says the person is offline; links to pages that are not cached explain why they cannot open.

### Admin navigation

Admin screens use a different frame so staff never mistake them for the public site.

| Menu item | Opens |
| --- | --- |
| Dashboard | Counts and what needs attention |
| Inbox | Pending submissions, reports and payments in one queue |
| Communities, Events, Opportunities | Lists with search, filters and bulk actions |
| Spotlight | Listings, payment confirmation, expiry, renewals |
| Announcements | List and editor |
| Categories and tags | Catalogue maintenance |
| Reports | Open and closed reports |
| Metrics | Success measures from D01 |
| Settings | Platform settings, bank details, plan values from D07 |
| Audit log | Who did what and when |

On mobile the admin menu becomes a top drawer, and the Inbox shows a count badge. A session that times out returns the admin to the login screen and then back to the screen they left.

## Screen inventory

There are 61 screens and components in version 1. Routes are proposals for D06; Audience is Student (S), Contributor (C), Seller (B) or Admin (A). FR links use the ranges in D01.

| WF | Screen | Route (proposed) | Aud. | FR links |
| --- | --- | --- | --- | --- |
| WF-001 | Public shell: top bar, bottom bar, footer | all public routes | S | FR-001 to FR-016 |
| WF-002 | More sheet | sheet | S | FR-001 to FR-016 |
| WF-003 | Install prompt and offline banner | overlay | S | FR-390 to FR-399 |
| WF-010 | Card library (five card types) | components | S | FR-020 to FR-035 |
| WF-011 | Filter and sort sheet | sheet | S | FR-066, FR-067, FR-111 |
| WF-020 | Homepage | / | S | FR-020 to FR-035 |
| WF-030 | Search, full-screen entry | /search | S | FR-040 to FR-053 |
| WF-031 | Search results and empty result | /search?q= | S | FR-041 to FR-045 |
| WF-040 | Explore: category hub | /explore | S | FR-060 to FR-065 |
| WF-041 | Category page and directory | /explore/\[category\] | S | FR-062 to FR-079 |
| WF-060 | Community profile | /communities/\[slug\] | S | FR-080 to FR-099 |
| WF-061 | Community activities tab | profile tab | S | FR-085, FR-086 |
| WF-100 | Events list with calendar toggle | /events | S | FR-110 to FR-116 |
| WF-101 | Event detail | /events/\[slug\] | S | FR-117 to FR-127 |
| WF-130 | Opportunities list | /opportunities | S | FR-135 to FR-142 |
| WF-131 | Opportunity detail | /opportunities/\[slug\] | S | FR-143 to FR-149 |
| WF-140 | Spotlight home: featured strip and ranked list | /spotlight | S | FR-280 to FR-291 |
| WF-141 | Spotlight listing detail | /spotlight/\[slug\] | S | FR-283 to FR-288 |
| WF-142 | How Spotlight ranking works | /spotlight/how-it-works | S | FR-307 |
| WF-170 | Announcements list | /announcements | S | FR-370 to FR-372 |
| WF-171 | Announcement post | /announcements/\[slug\] | S | FR-371, FR-372 |
| WF-175 | About Campusly | /about | S | FR-410 to FR-418 |
| WF-176 | Help and FAQ | /help | S | FR-410 to FR-418 |
| WF-177 | Privacy notice | /privacy | S | FR-410 to FR-418 |
| WF-178 | Terms and listing rules | /terms | S | FR-410 to FR-418 |
| WF-179 | Contact | /contact | S | FR-410 to FR-418 |
| WF-190 | Submit hub | /submit | C, B | FR-195 to FR-198 |
| WF-191 | Community form | /submit/community | C | FR-195 to FR-204 |
| WF-192 | Event form | /submit/event | C | FR-205, FR-214 |
| WF-193 | Opportunity form | /submit/opportunity | C | FR-206, FR-214 |
| WF-194 | Review before sending | step | C | FR-196 to FR-198 |
| WF-195 | Submission confirmation | /submit/done | C | FR-197 |
| WF-196 | Track my submission | /track | C, B | FR-208, FR-209 |
| WF-197 | Suggest an edit | /\[item\]/suggest-edit | S, C | FR-203 |
| WF-198 | Report a listing dialog | dialog | S | FR-180 to FR-184 |
| WF-230 | Spotlight: choose plan | /spotlight/list | B | FR-290 to FR-292 |
| WF-231 | Spotlight: listing details | step | B | FR-290, FR-291 |
| WF-232 | Spotlight: payment instructions | step | B | FR-293, FR-294 |
| WF-233 | Spotlight: upload receipt | step | B | FR-295 |
| WF-234 | Spotlight: my listing status | /spotlight/status | B | FR-297, FR-298 |
| WF-235 | Spotlight: renew | step | B | FR-301, FR-302 |
| WF-236 | Spotlight: request a change | step | B | FR-310 |
| WF-260 | Admin login | /admin/login | A | FR-230 to FR-232 |
| WF-261 | Admin dashboard | /admin | A | FR-233, FR-252 |
| WF-262 | Admin inbox | /admin/inbox | A | FR-233, FR-234 |
| WF-263 | Review a submission | /admin/review/\[id\] | A | FR-235 to FR-238, FR-247 |
| WF-264 | Content lists (communities, events, opportunities) | /admin/\[type\] | A | FR-239 to FR-244 |
| WF-265 | Edit and preview an item | /admin/\[type\]/\[id\] | A | FR-238, FR-258 |
| WF-266 | Spotlight payments queue | /admin/spotlight/payments | A | FR-330 to FR-332 |
| WF-267 | Spotlight listings and stars | /admin/spotlight | A | FR-333 to FR-346 |
| WF-268 | Announcements list | /admin/announcements | A | FR-373 to FR-380 |
| WF-269 | Announcement editor | /admin/announcements/\[id\] | A | FR-373 to FR-380 |
| WF-270 | Categories and tags | /admin/categories | A | FR-243, FR-244 |
| WF-271 | Reports | /admin/reports | A | FR-185 to FR-189 |
| WF-272 | Metrics | /admin/metrics | A | FR-252, FR-433 |
| WF-273 | Settings | /admin/settings | A | FR-251, FR-338, FR-339 |
| WF-274 | Bank details (protected) | /admin/settings/bank | A | FR-257 |
| WF-275 | Audit log | /admin/audit | A | FR-246 |
| WF-276 | Stale listings and dead links | /admin/health | A | FR-249 |
| WF-330 | State catalogue: loading, empty, error | components | all | NFR-001, FR-411 |
| WF-331 | Not found and offline fallback | /404, offline | S | FR-393, FR-411 |

## Global shell and components

WF-001 and WF-002 define the frame every public screen sits in; WF-010 and WF-011 define the cards and filter sheet reused everywhere.

### WF-001 and WF-002: shell and More sheet

&#91;embedded content: WF-001, WF-002 · public shell and More sheet\]

The left phone is the standard frame; the right phone shows the More sheet over a dimmed page. Notes 1 to 5 are numbered on the drawing.

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | Tapping the search pill opens full-screen search (WF-030). Submit opens the submit hub (WF-190). | FR-001 to FR-006 |
| 2 | Body is one column on mobile. Pull to refresh is not used; content refreshes on reopening. | FR-007 |
| 3 | The current tab is filled and bold. Tabs carry no counts or dots in version 1. | FR-008 to FR-010 |
| 4 | The sheet closes by tapping outside, dragging down, or pressing back. Rows are full-width tap targets. | FR-011, FR-012 |
| 5 | Footer links are the same on every page and include the GDGOC credit. | FR-013 to FR-016 |

### WF-010 and WF-011: cards and filter sheet

&#91;embedded content: WF-010, WF-011 · card library and filter sheet\]

A dashed pill appears only when its condition holds. Each card is one tap target with a separate primary button; the primary action is the heavy-outline box.

| Card | Always shown | Only when | Primary action |
| --- | --- | --- | --- |
| Community | Logo, name, one-line purpose, up to two tags | Verified badge or Community Listing label; Recruiting now when open | Join, which goes to the community's own link |
| Event | Date block, title, time, place or Online, host | Happening when it is under way | View event |
| Opportunity | Type, title, organisation, deadline | Closes soon, as set by the rule in D07 | Apply, which goes to the organiser's link |
| Spotlight | Image, name, offer line, star | Featured label for Featured listings | Contact |
| Announcement | Image, title, date, author name | None | Read post |

The filter sheet opens from a Filters button on Explore, Events and Opportunities. It applies only on Show results, keeps its choices when the person goes back, and lists the number of active filters on the button. Filter options differ by list and are defined with the list screens below.

## Homepage and search

The homepage answers "What can I get involved in?" above the fold and puts search one tap away. Category tiles and chip labels in the drawing are placeholders; the ten categories come from D01 and the chips are shortcut filters pending OQ-P02.

### WF-020, WF-030 and WF-031

&#91;embedded content: WF-020, WF-030, WF-031 · homepage, search entry, results\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | A one-line promise and a short helper line. Fixed copy is set in D03; the promise must say what Campusly is without scrolling. | FR-020, FR-021 |
| 2 | The search field is the primary action. Tapping it opens WF-030 with the keyboard already up. | FR-022 |
| 3 | "What are you looking for?" chips apply a category or type filter in one tap and open the results list. | FR-023 |
| 4 | Ten category tiles, two rows of five on mobile, each opening WF-041. Tiles are driven by the category table so an admin can reorder them. | FR-024 |
| 5 | Featured communities scroll sideways and are chosen by an admin. If none are featured the strip is hidden, never empty. | FR-025 |
| 6 | Below the fold, in order: recruiting now, upcoming events, closing soon, Spotlight strip, latest announcement, and a Submit call to action. A section with no items is hidden. | FR-026 to FR-035 |
| 7 | Search entry shows the keyboard, a back arrow, recent searches kept on the device only, and category shortcuts. | FR-040, FR-046 |
| 8 | Recent searches can be cleared in one tap and are never sent to the server. | FR-046, FR-047 |
| 9 | Category pills run the same filter as note 3 on a blank query. | FR-048 |
| 10 | Results are grouped under Communities, Events and Opportunities. Tabs jump to a group; there is no All tab. Spotlight is not searched in version 1 (OQ-P09). | FR-041, FR-044 |
| 11 | Each group shows up to a short list and a See all link to that list with the term applied. Only public items appear. | FR-043, FR-044 |
| 12 | With no match, show tips, the closest categories and a Submit a community link. | FR-045 |

## Directory and community profile

The directory is a filtered list of community cards (WF-010). The profile is the most important screen in Campusly: it must let a student decide and join within seconds, so Join is sticky and activity evidence is one tab away.

### WF-041, WF-060 and WF-061

&#91;embedded content: WF-041, WF-060, WF-061 · directory, profile, activities\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | Filters opens WF-011 with type, who can join, activity level and Recruiting now. Sort offers recruiting first, newest and A to Z. | FR-066, FR-067 |
| 2 | Active filters show as removable chips and are kept when the student goes back from a profile. | FR-066 |
| 3 | Cards are WF-010 community cards. The list loads in pages, with Show more instead of endless scroll, to protect data use. | FR-062, FR-063, FR-073 |
| 4 | Banner and logo are optional. Without them the profile shows the name on a neutral block and an initial in place of the logo. | FR-080, FR-081 |
| 5 | Name, Verified or Community Listing label, a one-line purpose and up to three tags. | FR-065, FR-082, FR-091 |
| 6 | Two tabs, About and Activities, keep the page short. The tab is kept in the address so a shared link opens on it. | FR-085 |
| 7 | About holds What we do, Why join, Who can join, when and where they meet, and contact details marked public. Private details are never in the page or its data. | FR-082 to FR-084, FR-092 to FR-095 |
| 8 | The sticky bar holds Join, which sends the student to the community's own link, and Share. If no working join link exists the button is replaced by the listed contact route. | FR-087 to FR-089, FR-161 |
| 9 | Upcoming shows events from that community, soonest first, each opening WF-101. | FR-085 |
| 10 | Past activities are short entries that prove the community is active. | FR-086 |
| 11 | Suggest an edit opens WF-197. Report this listing opens WF-198. Neither needs an account. | FR-180, FR-203 |

## Events and opportunities

Events and opportunities follow one pattern: a filtered list of cards, then a detail page that states the facts and holds one primary action in a sticky bar. WF-130 (Opportunities list) is the same layout as WF-100 with the changes in the table below, and WF-131 is drawn here.

### WF-100, WF-101 and WF-131

&#91;embedded content: WF-100, WF-101, WF-131 · events list, event detail, opportunity detail\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | A List and Month switch. Month shows a calendar grid with a dot on days that have events; tapping a day lists that day. List is the default. | FR-110, FR-116 |
| 2 | Quick chips for This week, This month and Online. Filters adds community and category. Upcoming events only; past events are reached from a community's Activities tab. | FR-111, FR-112, FR-118 |
| 3 | Cards are WF-010 event cards grouped under day headings, soonest first, in pages with Show more. | FR-113 to FR-115 |
| 4 | Banner is optional. If missing, the page starts at the title. | FR-119 |
| 5 | Date and time are shown in WAT with the day name. The place is a plain address or an online link, shown as a tap target. | FR-120, FR-121 |
| 6 | The host links to the community profile. Co-hosting is parked. | FR-122 |
| 7 | Add to calendar offers a calendar entry with title, time, place and link. | FR-117 |
| 8 | The sticky bar's primary action opens the organiser's own registration or information link. If none exists it is replaced by Add to calendar. | FR-123 to FR-125, FR-161 |
| 9 | The deadline box is the first fact on an opportunity. Closes soon appears according to D07 and the box turns to Closed after the deadline, but the page stays reachable. | FR-137, FR-144 to FR-146 |
| 10 | Who can apply, what you get and how to apply are separate short blocks, never one long paragraph. | FR-138 to FR-142 |
| 11 | Apply opens the organiser's own link. Report this listing opens WF-198. | FR-143, FR-180 |

### How WF-130 differs from WF-100

| Part | WF-100 Events | WF-130 Opportunities |
| --- | --- | --- |
| Switch | List and Month | None; list only |
| Quick chips | This week, This month, Online | Closing soon, Open now, and a chip per type |
| Grouping | By day | By deadline, soonest first |
| Card | Event card | Opportunity card |
| Closed items | Move to past | Hidden from the default list; shown with a Show closed link |

## Spotlight and Announcements

Spotlight is a paid showcase, so its screens must show clearly what is paid and how order is decided. Announcements are written by admins only and read like a blog post. Plan names, prices and ranking tie-breaks are never drawn; they come from D07.

### WF-140, WF-141 and WF-171

&#91;embedded content: WF-140, WF-141, WF-171 · Spotlight home, listing, announcement post\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | The Featured strip sits outside the ranking and scrolls sideways. Featured listings also appear in the ranked list. The strip is hidden when no Featured listing is live. | FR-280, FR-281 |
| 2 | The ranked list is ordered strictly by stars, with no downvotes. How ranking works opens WF-142, a plain-language page whose rules text comes from D07. | FR-281, FR-282, FR-307 |
| 3 | A row shows rank, image, name and a Star button with the current count. One star per device; a second tap shows the starred state and does not change the count. | FR-283, FR-285, FR-286 |
| 4 | List your business opens the seller flow at WF-230. It is a secondary action here so students are not pushed into selling. | FR-290 |
| 5 | Every listing carries a Paid listing label (proposed in this document and confirmed in D09). Featured and category labels follow D07. | FR-287, FR-288 |
| 6 | Star is repeated on the detail page and shows the same count. | FR-283, FR-285 |
| 7 | Contact seller opens the contact method the seller chose, such as WhatsApp, a call or a link. Campusly does not take payment for purchases. | FR-284, FR-288 |
| 8 | An announcement shows image, title, date and the publishing name, which is Campusly team until OQ-P26 is settled. | FR-371, FR-372 |
| 9 | The body supports subheadings, inline images and links, in a single column. | FR-373, FR-374 |
| 10 | More announcements shows the next newest posts. WF-170 is the same list using announcement cards. | FR-370 |

## Contributor flows

No account is needed, so the flow must be short, forgiving and clear about what happens next. The three forms share one pattern: a hub, a stepped form that saves progress on the device, a review step, and a confirmation with a tracking code.

### WF-190, WF-191 and WF-195

&#91;embedded content: WF-190, WF-191, WF-195 · submit hub, community form, confirmation\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | One line states the review rule before any typing starts. | FR-195, FR-197 |
| 2 | Four paths: Community, Event, Opportunity and Spotlight listing. The Spotlight path continues in the seller flow at WF-230. | FR-195, FR-290 |
| 3 | Track my submission opens WF-196, which asks for the tracking code. | FR-208 |
| 4 | Four steps for a community: Basics, Details, Contact and proof, Review. Events and opportunities use three. | FR-196, FR-204 to FR-206 |
| 5 | Each field has a label above it, an example in the field and a character counter where a limit applies. Limits are set in D05. | FR-196, FR-199 |
| 6 | Errors appear beside the field, in words, with a mark that does not rely on colour, and the person's input is kept. | FR-196 |
| 7 | Currently recruiting reveals optional dates. The community's own recruiting window then drives the Recruiting now label. | FR-073 |
| 8 | Back keeps the data. Next validates only the current step. Progress is saved on the device so a lost connection does not lose the entry. | FR-198 |
| 9 | The confirmation says plainly that nothing is public yet. | FR-197 |
| 10 | The tracking code is the only way to find the entry later. Copy and a screenshot hint are offered. The code format is set in D07. | FR-208 |
| 11 | A three-point status line is shown here and expanded on WF-196. | FR-208, FR-209 |

### The other contributor screens

| WF | Screen | Layout and behaviour | FR |
| --- | --- | --- | --- |
| WF-192 | Event form | Steps: Basics, Date and place, Review. Date and time are chosen with a picker, shown in WAT. An online event needs a link; an in-person event needs a place. | FR-205, FR-214 |
| WF-193 | Opportunity form | Steps: Basics, Eligibility and deadline, Review. A deadline and an apply link are required. A note warns that opportunities asking applicants for money are rejected. | FR-206, FR-214 |
| WF-194 | Review before sending | A read-only summary of every answer with an Edit link per step, the listing rules acknowledgement, and the abuse-protection check. Submit is the primary action. | FR-196 to FR-199 |
| WF-196 | Track my submission | A code field, then the status line, the next step in words and, for a rejection, the reason with a Fix and resubmit button that reopens the form with the answers filled in. | FR-208, FR-209 |
| WF-197 | Suggest an edit | Shows the current values and one box per changed field plus a note; sent to the admin inbox and never changes the page directly. | FR-203 |
| WF-198 | Report a listing | A dialog with a reason list, an optional note and a Send button, then a thank-you. No account and no contact detail is required. | FR-180 to FR-184 |

## Spotlight seller flow

A seller needs no account, so the flow ends with a status page reached by tracking code. Values such as plan names, prices, durations and status names are drawn only as slots; D07 fills them. The status names on WF-234 are working names.

### WF-230, WF-232 and WF-234

&#91;embedded content: WF-230, WF-232, WF-234 · choose plan, pay, status\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | Four steps: Plan, Listing details, Pay, Receipt. The bar shows the current step. | FR-290, FR-292 |
| 2 | Two plan cards of equal weight, nothing pre-selected, with the price and duration read from settings. Next stays disabled until one is chosen. | FR-292, FR-338 |
| 3 | One plain sentence explains manual payment and that an admin confirms the credit in the bank before going live. | FR-293, FR-332 |
| 4 | The summary repeats the chosen plan and the exact amount. | FR-293 |
| 5 | Bank details come from admin settings and each line has a Copy button. They are never typed into the page source. | FR-293, FR-257 |
| 6 | The payment reference is unique to the listing and is the strongest element on the page. Copy puts it on the clipboard. | FR-294 |
| 7 | I have paid moves to WF-233, where the receipt photo or PDF is uploaded, previewed and sent. Without a receipt the listing stays in its awaiting state. | FR-295 |
| 8 | The status page is reached from the tracking code (WF-196) and shows where the listing is in its lifecycle, with the live dates once approved. | FR-297, FR-298 |
| 9 | Upload receipt appears only while a receipt is expected. Request a change opens WF-236 for edits to a live listing. | FR-295, FR-310 |
| 10 | Renew is dashed because it shows only near expiry or after it, as D07 defines. It opens WF-235, which repeats WF-232 with a new reference. | FR-301, FR-302 |

### The remaining seller screens

| WF | Screen | Layout and behaviour | FR |
| --- | --- | --- | --- |
| WF-231 | Listing details | Business name, category, one-line offer, description, images, contact method, optional location. A live preview card shows how it will look. | FR-290, FR-291 |
| WF-233 | Upload receipt | A file picker with preview, a size and type hint, an optional note and Send. The next screen is the status page. | FR-295 |
| WF-235 | Renew | Same layout as the pay step, with the plan pre-filled and a new payment reference. | FR-301, FR-302 |
| WF-236 | Request a change | The current values with editable fields and a note. The change is held for admin approval; the live listing stays as it is until approved. | FR-310 |

## Admin screens

Admin screens are desktop-first and denser than public ones, but the inbox and review screens must also work on a phone, so a reviewer can approve a clear submission from anywhere. On mobile the side menu becomes a top drawer and the review columns stack, with the decision bar fixed at the bottom.

### WF-262 and WF-263

&#91;embedded content: WF-262, WF-263 · admin inbox and review screen\]

| Note | Behaviour | FR |
| --- | --- | --- |
| 1 | The Inbox count is the number of items needing a decision, across submissions, reports and payments. | FR-233 |
| 2 | Filter tabs narrow the queue by kind. The default order is oldest first so nothing is skipped. | FR-233, FR-234 |
| 3 | Flags show why an item needs care: possible duplicate, reported, receipt uploaded, overdue. Review opens WF-263 for that item. | FR-234, FR-237 |
| 4 | Evidence sits beside the details: proof files open in a viewer, and the join link opens in a new tab so the reviewer can test it. | FR-235, FR-247 |
| 5 | The checklist matches the verification criteria in D07: named contact, proof, working channel, content standards. Verify is offered only when the required boxes are ticked. | FR-247 |
| 6 | A duplicate warning names the existing listing and links to it. | FR-237 |
| 7 | The decision bar offers Reject (a reason is required), Request info, Edit (opens WF-265 with a live preview) and Approve. Approve and verify is a menu option on Approve. Every decision is written to the audit log with the note. | FR-236, FR-238, FR-246, FR-258 |

### The remaining admin screens

| WF | Screen | Layout and behaviour | FR |
| --- | --- | --- | --- |
| WF-260 | Admin login | Email and password only, with a clear error message that does not reveal which was wrong. Locks after repeated failures. No sign-up and no public link to it. | FR-230 to FR-232 |
| WF-261 | Dashboard | A row of counts (pending, reports, payments waiting, expiring soon), a short list of overdue items, and links to Metrics and Settings. | FR-233, FR-252 |
| WF-264 | Content lists | One table pattern for communities, events and opportunities: search, status filter, sort, bulk select with a confirm step, and row actions to edit, feature, hide or remove. | FR-239 to FR-244 |
| WF-265 | Edit and preview | The edit form on the left and a live mobile preview on the right, exactly as the public card and page will look. | FR-238, FR-258 |
| WF-266 | Spotlight payments | A queue of listings with receipts. Each row shows the amount expected, the reference, the receipt, and a Confirmed in bank checkbox that must be ticked before Approve is enabled. | FR-330 to FR-332 |
| WF-267 | Spotlight listings | A table of live, expiring and expired listings with dates and star counts, a stars panel to inspect and remove suspicious stars, and actions to extend, end or refund as D07 allows. | FR-333 to FR-346 |
| WF-268, WF-269 | Announcements | A list with status, and an editor with title, image, body, preview and Publish. Only admins reach it. | FR-373 to FR-380 |
| WF-270 | Categories and tags | Add, rename, reorder and hide; deleting a category in use is blocked with the count of items affected. | FR-243, FR-244 |
| WF-271 | Reports | A list of reports grouped by listing, with the reason, notes and a resolve action that records the outcome. | FR-185 to FR-189 |
| WF-272 | Metrics | The success measures from D01 with the headline measure first, a date range and an export. | FR-252, FR-433 |
| WF-273 | Settings | Platform text and limits, plan values from D07, Featured slot count, review target and contact details. Each change is logged. | FR-251, FR-338, FR-339 |
| WF-274 | Bank details | Separate from other settings. A change asks for the password again, shows the old and new values side by side, and is logged. | FR-257 |
| WF-275 | Audit log | A read-only table of who did what, when and to which item, with filters. Nothing can be edited or deleted here. | FR-246 |
| WF-276 | Health | Stale listings and dead links, with a Check now action and a link to each item. | FR-249 |

## State catalogue

Every screen has more states than the happy one. WF-330 and WF-331 define one pattern per state so that no screen invents its own. D03 sets the look; this table sets what must exist and what the person can do next.

| State | What the person sees | Next action offered | Applies to |
| --- | --- | --- | --- |
| Loading | Grey placeholder shapes in the layout of the real content, never a blank page or a lone spinner. After a long wait a line says it is taking longer than usual. | Wait, or go back | All lists and details |
| Empty list | A short sentence saying why the list is empty and one action: clear filters, search again, or submit one. | Clear filters or Submit | Directory, Events, Opportunities, Spotlight, results |
| Empty section | The section is hidden on the homepage and on profiles instead of showing an empty box. | None | Homepage, profile |
| No results | Tips, the closest categories, and a Submit a community link. | Browse categories | Search |
| Offline | A slim banner. Pages already visited still open from the device; others show that they need a connection. Actions that need the network are disabled with a reason. | Retry when back online | All |
| Request failed | A plain message that something went wrong on our side or in the connection, with Try again. No codes or technical wording. | Try again | All |
| Not found | A page for a removed or mistyped link with search, Home and Explore links. | Search or Home | Any item address |
| Closed or ended | The item remains reachable but is marked Closed, Ended or Expired and its primary action is replaced by a link to similar items. | See similar | Events, Opportunities, Spotlight |
| Hidden by an admin | The address shows the not found state, never an explanation that exposes moderation notes. | Search or Home | Any public item |
| Validation error | An error under the field in words, a marker that is not only colour, focus moved to the first error, and the entered data kept. | Fix and resubmit | All forms |
| Submitting | The button shows progress and is disabled to prevent double submission; a duplicate send is ignored. | Wait | All forms |
| Success | A confirmation that says what happened and what comes next, with the next useful link. | Track or Home | Submit, report, edit, receipt upload |
| Rate limited | A calm message saying too many tries and when to try again. Genuine users are never shown the abuse reason. | Wait | Forms, stars, search |
| Session ended | The admin is returned to login and, after signing in, to the screen they were on. Unsaved form data is kept where possible. | Sign in | Admin |
| Forbidden | Admin routes without a session go to login. A signed-in admin without permission sees a clear message and a way back. | Back to dashboard | Admin |
| Maintenance | A single static page with what is happening and when to check back, served without the database. | None | Whole site |

### Rules for all states

- Messages use the same tone as the rest of Campusly: short, friendly and specific, with no blame.
- Every error state has a way out; none is a dead end.
- Colour is never the only carrier of meaning; each state also has an icon or label.
- States are announced to screen readers without moving the person's place on the page (NFR-030 to NFR-032).
- Copy for each state is written once in D03 and reused, not rewritten per screen.

## User flows

The four journeys from D01 (J1 to J4) are traced through the screens. The heavy-outline box in each lane is the moment that matters most: a student joining, an admin deciding. The dashed box is a step that applies to Spotlight items only.

&#91;embedded content: user flows J1 to J4 · student, contributor, seller, admin\]

| Journey | Starts at | Ends at | Success moment | Failure paths covered |
| --- | --- | --- | --- | --- |
| J1 Student finds and joins | Homepage or a shared link | The community's own group or form | Join is tapped and recorded | No results (WF-031), missing join link (WF-060), offline (WF-330) |
| J2 Leader contributes | Submit hub | Tracking page | A code is shown and the item is in the queue | Validation errors (WF-191), rejection with reason and resubmit (WF-196) |
| J3 Seller lists on Spotlight | Plan choice | Status page | Receipt sent and listing awaiting confirmation | Wrong or missing reference, rejection and refund note (WF-234), expiry and renewal (WF-235) |
| J4 Admin reviews | Inbox | Audit log entry | A decision is recorded with a reason | Duplicate, fake receipt, overdue item (WF-262, WF-263, WF-266) |

Every screen in the inventory sits on at least one of these journeys or is a supporting screen reached from the footer or More sheet.

## Responsive behaviour and interaction notes

Wireframes are drawn for mobile. This table says what changes on larger screens, so D03 and the build prompts do not guess.

### What changes by screen size

| Area | Mobile (to 599 px) | Tablet (600 to 1023 px) | Desktop (1024 px and up) |
| --- | --- | --- | --- |
| Navigation | Top bar and five-tab bottom bar | Top bar and bottom bar | Top bar with inline links; no bottom bar |
| Card lists | One column | Two columns | Three columns, centred, with a maximum content width |
| Homepage categories | Two rows of five tiles | One row of ten | One row of ten with labels |
| Community profile | One column; sticky Join bar | One column, wider; sticky bar | Two columns: details on the left, a sticky panel with Join, Share and facts on the right |
| Filters | Bottom sheet | Bottom sheet | Side panel beside the list |
| Forms | One column, one step at a time | One column, centred | One column, centred, with the step list shown at the side |
| Spotlight | Featured strip scrolls sideways | Featured strip shows three | Featured strip shows all in a row, ranked list in two columns |
| Admin | Top drawer menu; stacked columns; fixed decision bar | Side menu collapsed to icons | Full side menu; two-column review |
| Tables (admin) | Rows become stacked cards | Table with the least important columns hidden | Full table |

### Interaction rules

- **Tap targets.** At least 44 by 44 px, with 8 px between neighbours. Text links inside paragraphs have padding so they can be hit with a thumb.
- **Gestures.** No feature depends on a gesture a person might not know. Swipe is allowed on the Featured strip and bottom sheets, and each has a visible button or arrow as an alternative.
- **Feedback.** Every tap shows a response within 100 ms: a pressed state, then progress or the result. Stars update at once and are confirmed in the background.
- **Focus.** Keyboard focus is always visible. Opening a sheet or dialog moves focus into it and closing returns it to the control that opened it.
- **Scroll.** Returning to a list restores the scroll position and the filters. Opening a link in a new tab is used only for outside sites.
- **Outside links.** Join, Apply, Register and Contact leave Campusly. They open in a new tab with a clear label such as "Opens WhatsApp" or "Opens the organiser's page" where the destination is known.
- **Motion.** Transitions are short and respect the device setting for reduced motion.
- **Images.** Lazy-loaded, sized in advance so the page does not jump, and replaced by a neutral block when they fail.
- **Text size.** The layout must hold when the device text size is increased to 200 percent.
- **Forms on the device.** Mobile keyboards match the field (email, number, URL), and the page scrolls so the active field and its error stay visible above the keyboard.

## Traceability and coverage

Every requirement module in D01 maps to at least one screen, and every screen maps back to a module. Modules with no screen are named so D11 can test them another way.

### Module to screen map

| D01 module | FR range | Screens |
| --- | --- | --- |
| Global shell | FR-001 to FR-016 | WF-001, WF-002, WF-003 |
| Homepage | FR-020 to FR-035 | WF-020, WF-010 |
| Search | FR-040 to FR-053 | WF-030, WF-031 |
| Categories and directory | FR-060 to FR-079 | WF-040, WF-041, WF-011 |
| Community profile | FR-080 to FR-099 | WF-060, WF-061 |
| Events | FR-110 to FR-127 | WF-100, WF-101 |
| Opportunities | FR-135 to FR-149 | WF-130, WF-131 |
| Sharing | FR-160 to FR-169 | Share controls on WF-010 cards and on every detail screen |
| Reporting | FR-180 to FR-189 | WF-198, WF-271 |
| Submissions | FR-195 to FR-214 | WF-190 to WF-197 |
| Admin | FR-230 to FR-260 | WF-260 to WF-276 |
| Spotlight, public | FR-280 to FR-311 | WF-140 to WF-142, WF-230 to WF-236 |
| Spotlight, admin | FR-330 to FR-346 | WF-266, WF-267 |
| Announcements | FR-370 to FR-380 | WF-170, WF-171, WF-268, WF-269 |
| PWA and offline | FR-390 to FR-399 | WF-003, WF-331 |
| Static pages | FR-410 to FR-418 | WF-175 to WF-179, WF-330 |
| Analytics | FR-430 to FR-437 | No public screen; WF-272 shows the results (FR-433). Event capture is tested in D11. |

### Screens described in words only

These screens reuse the patterns above, so they are specified here without a separate drawing. Each can be drawn later in D14 if the owner wants a visual review.

| WF | Screen | Layout |
| --- | --- | --- |
| WF-040 | Explore hub | Top bar, a title, the ten category tiles as large cards in two columns, each with a name and item count, then a Recruiting now row and a Browse all communities link. |
| WF-142 | How Spotlight ranking works | A short page in plain language: the list is ordered by stars, one star per device, Featured listings sit above the list as well as in it, all listings are paid, and when listings expire. Text is read from D07. A List your business link closes the page. |
| WF-170 | Announcements list | A single column of announcement cards, newest first, with Show more. No filters. |
| WF-175 to WF-179 | About, Help, Privacy, Terms, Contact | One column of readable text with clear headings and a last-updated date. Help uses expandable questions. Contact lists the team's public channels. Privacy and Terms text comes from D09. |
| WF-331 | Not found and offline fallback | A message, a search field, Home and Explore buttons. The offline version lists pages the person visited before. |

### Checks run on this document

- Every WF ID in the inventory appears in a drawing, a table row or the descriptions above.
- Every FR range in the D01 ledger appears in the module map.
- No price, duration, slot count or status value appears on any wireframe; slots point to D07.
- Individual FR numbers cited in notes follow the ranges in D01. The next audit compares each cited number with the exact requirement table in D01 and corrects any that do not match (D11).

## Open questions

| ID | Question | Default until answered |
| --- | --- | --- |
| OQ-W01 | Should Opportunities have its own tab instead of sitting under More? | Under More on mobile; inline link on desktop |
| OQ-W02 | Should every Spotlight listing carry a visible Paid listing label? | Yes; confirm wording in D09 |
| OQ-W03 | Should the homepage show a Spotlight strip and the latest announcement, or keep them one tap away? | Show both below the main sections |
| OQ-W04 | Should the Month view of Events ship in version 1 or follow later? | Ship, as a lightweight grid |
| OQ-W05 | Should students see how many people tapped Join on a community? | No count in version 1 |
| OQ-W06 | Should each seller be able to choose WhatsApp, call or link as the Contact method? | Yes, one method per listing |
| OQ-W07 | Do the owners want WF-040, WF-142 and the static pages drawn before D03 starts? | Described in words only |

These complement OQ-P01 to OQ-P28 in D01 and are numbered separately so each document keeps its own list.

## Change log

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-10-28 | Claude, for the Campusly team | First complete draft: layout system, navigation, 61-screen inventory, wireframes for the core public, contributor, seller and admin screens, states, flows, responsive rules and traceability. Awaiting owner review. |

Changes after approval follow the D00 change-control rule: each change gets a log row, a version bump and a check of the documents that depend on this one.


