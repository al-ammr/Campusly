---
doc_id: D04
title: Brand Assets and Identity Guidelines
file: BRAND_ASSETS.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Brand Designer
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0]
---

# Campusly Brand Assets

Nov 1, 2026 · @Amr Suleiman

D04 is the single source for how Campusly looks and sounds as a brand: the logo, the colour values, the typefaces, the icon and image style and the voice. D03 applies these to screens; this document defines them.

## Document control

| Field | Value |
| --- | --- |
| Document | D04 Brand Assets |
| Version | 0.1.0, first draft for owner review |
| Owner | Campusly team, GDGOC ABU Zaria |
| Depends on | D01 (audience, principles), D07 (labels such as Verified and Paid listing) |
| Feeds | D03 UI/UX Spec, D10 Prompt Sequence |
| Owns | Logo, palette values, typefaces, icon and illustration style, voice, asset specifications |
| Does not own | Component behaviour and layouts (D02, D03) |

### How the brand rules are written

- Values such as hex colours are exact and final once the owner approves this document. D03 refers to them by token name only.
- The logo in this document is a first design, drawn as vector shapes so it can be exported straight to SVG. If the owner commissions a designer, the specifications here (clear space, sizes, colours) still apply to the replacement.
- Every colour pairing that carries text has its contrast ratio stated, measured against the WCAG 2.2 formula.

## Brand essence

Campusly is the place on campus where students gather, connect, and discover their next meaningful pursuit. Campusly is warm, welcoming, energetic, and brings campus life into focus. That is the whole idea: a platform that feels like an active campus commons, not a bureaucratic directory.

| Element | Statement |
| --- | --- |
| Promise | Discover more beyond the classroom — find your people, events, and opportunities on campus. |
| Role | A friendly guide that points students to real communities, events and opportunities, then steps aside. |
| Audience | ABU Zaria students first, mostly on mobile phones, often new to campus, often data-conscious. |
| Personality | Warm, welcoming, energetic, honest, resourceful. Never corporate, never preachy. |
| It is not | A government or university portal (D01 principle), a social network, or a marketplace. |
| Visual idea | Warm light guiding discovery: Ember Orange and Sunburst Gold on Cream and Charcoal. A beacon/spark mark that reads as an open fire, a person stepping forward, and a spark of ambition. |
| Parent | A product of Google Developer Group on Campus (GDGOC) ABU Zaria, credited quietly (see the co-branding section). |

### Brand principles

1. **Warm, not loud.** Colour and motion invite; they never shout over content.
2. **Plain words.** Short, specific, friendly language a first-year understands.
3. **Honest labels.** Paid, Verified and Community Listing are always what they say.
4. **Light on data.** Every asset is small and works without images loading.
5. **Campus first.** Imagery and examples come from ABU Zaria life, not stock photos of other countries.

## Logo

The mark is a single flame and beacon with a gold heart and a spark. It reads as a campus beacon, as a person standing up to be seen, and as a spark of an idea. The wordmark is the name set in Plus Jakarta Sans Bold with tight letter-spacing and no distorting effects.

&#91;embedded content: Campusly logo · mark, lockups, app icon, one-colour\]

### Parts of the logo

| Part | Description | Use |
| --- | --- | --- |
| Beacon/Spark mark | Outer flame in Ember, inner flame in Gold, a Gold spark at upper right | Favicon, app icon, avatars, small spaces |
| Wordmark | The word **Campusly** in Plus Jakarta Sans Bold | App headers, hero blocks, documents |
| Horizontal lockup | Mark left, wordmark right, the wordmark's x-height centred on the mark's lower half | App header, desktop navigation, official documents |
| Stacked lockup | Mark above wordmark, centred | Posters, social profile pages, splash screen |
| App icon | Cream mark on an Ember rounded square | Home screen, PWA icon |
| One-colour mark | Charcoal flame, inner mark knocked out | Print, stamps, photocopies, embroidery |

### Construction

The mark is drawn on a 120 by 120 unit grid. The outer flame's path is: move to 60,6, curve to 96,76 on the right and to 60,114 at the base, rise on the left to a notch at 42,36, then return to the tip. The inner flame is a drop whose tip is at 60,62 and base at 60,110. The spark is a circle of radius 6 centred at 90,22. The exact path data is in the SVG source files listed in the asset inventory.

## Logo use

&#91;embedded content: logo use · clear space, minimum size, four misuses\]

### Rules

| ID | Rule |
| --- | --- |
| BRD-01 | Keep clear space of x on every side, where x is half the width of the flame. Nothing, including text, edges and other logos, enters this space. |
| BRD-02 | Minimum size: the flame mark 16 px wide on screen or 6 mm in print; the horizontal lockup 96 px wide or 25 mm in print. Below that, use the mark alone. |
| BRD-03 | Use the Ember and Gold flame on Cream, White or Smoke. Use the bright version (Ember Light and Gold) on Charcoal and on photographs darkened to at least 50 percent. Use the one-colour mark where only one ink is available. |
| BRD-04 | On a photograph or busy background, place the logo on a solid panel or a darkened area; never directly on detail. |
| BRD-05 | Do not stretch, recolour, rotate, outline, add shadows or glows, or redraw the flame. Do not change the letter-spacing or typeface of the wordmark. |
| BRD-06 | Do not use the flame as a bullet or pattern, and do not put it inside another shape other than the rounded square of the app icon. |
| BRD-07 | The name is written Campusly, with a capital C and no space, in running text. It is never written Campusly, Camp-usly, or all lowercase in prose, except in all-capital headings where case is set by the style. |

## Colour palette (Tuscan Academic Heritage)

The palette blends warm Tuscan agrarian warmth with classical collegiate prestige: sunbaked terracotta, botanical cypress, warm limestone, and antique ink. Terracotta serves as the interactive beacon, cypress represents verified authority and governance, warm ochre provides subtle highlights, and stone parchment eliminates eye fatigue during late-night study sessions.

&#91;embedded content: light palette · Tuscan Academic tokens with values and roles\]

### Token names

D03, the design assets (`stitch_mejuma_tuscany_design_replica`), and the build refer to colours by token. Values are these hex values in the light theme.

| Token | Value | Colour Name | Role |
| --- | --- | --- | --- |
| color.brand / primary | #9F3C16 | Terracotta | Primary action beacon, key interactive highlights |
| color.brand-strong / terracotta-deep | #A8431F | Terracotta Deep | Pressed states, active tabs, high-priority discovery tags |
| color.secondary / cypress | #2C402E | Cypress Green | Student governance, campus spaces, official academic seals |
| color.secondary-light / cypress-light | #4A634E | Cypress Light | Sub-headers, secondary badges, location glyphs |
| color.accent / tertiary | #E8B53D | Warm Ochre | Award accents, spotlight stars, community recognition |
| color.text / ink-charcoal | #1F1C18 | Ink Charcoal | Typographic authority, high-contrast primary text |
| color.text-muted / ink-muted | #4A453E | Ink Muted | Secondary body text, metadata, subtle borders |
| color.surface / background | #FCF9F4 | Warm Parchment | Base page canvas, editorial background |
| color.surface-container / stone-surface | #F3EFEA | Stone Surface | Cards, elevated containers, input fields |
| color.border / stone-border | #E3DCD2 | Stone Border | 1px hairline card borders, structural separators |
| color.raised | #FFFFFF | Crisp White | Elevated overlays, bottom sheet cards |
| color.success / verified-green | #2B6E3F | Verified Green | Official verified community badge, confirmed checks |
| color.danger / error | #BA1A1A | Berry Red | Error states, report flags, destructive actions |
| color.info | #1D5FD1 | Academic Blue | Technical info notices, keyboard focus rings |

### Contrast of approved pairs

Ratios follow the WCAG 2.2 formula. Normal text needs 4.5 or more, large text and interface parts need 3 or more. Every pair below passes.

| Text or part | On | Ratio | Use |
| --- | --- | --- | --- |
| Ink Charcoal | Warm Parchment | 14.8 | Body text on canvas |
| Ink Charcoal | Stone Surface | 13.9 | Body text on cards |
| Ink Muted | Warm Parchment | 7.1 | Secondary metadata text |
| Terracotta Deep | Warm Parchment | 5.2 | Links and interactive text |
| White | Terracotta Deep | 5.8 | Primary button label |
| White | Terracotta | 5.2 | Primary action fill label |
| Cypress Green | Warm Parchment | 9.4 | Secondary academic buttons and badges |
| White | Verified Green | 5.2 | Verified community seal pill |
| White | Berry Red | 5.9 | Error badge, danger button |
| Ember Deep | Ember Tint | 6.1 | Text on chips |
| White | Ember Deep | 7.3 | Pressed primary button |
| Charcoal | Gold | 8.6 | Label on a Gold badge |
| White | Pine | 5.3 | Success badge |
| White | Berry | 6.6 | Error badge, danger button |
| White | Sky | 5.8 | Info badge |
| Pine | Cream | 5.0 | Success text |
| Berry | Cream | 6.2 | Error text |
| Sky | Cream | 5.5 | Info text, focus ring |

Gold is never used for text on a light background; its ratio on Cream is below 3 and it is for shapes and highlights only. Colour is never the only carrier of meaning: every status also has an icon or a label (D03).

## Dark theme and category colours

Campusly follows the device's light or dark setting and lets the person override it (D03). The dark theme keeps the warmth: a charcoal-brown background, never pure black, with a lighter Ember.

### Dark theme tokens

| Token | Value | On background | Notes |
| --- | --- | --- | --- |
| color.background | #16120F | n/a | Page |
| color.surface | #231D19 | n/a | Cards and inputs |
| color.raised | #2E2621 | n/a | Sheets, menus |
| color.text | #F6EDE3 | 16.1 | Body text |
| color.text-muted | #B8AA9E | 8.2 | Secondary text |
| color.brand | #FF8A4C | 8.0 | Links and actions; button label is Charcoal (7.4) |
| color.brand-strong | #FFB085 | 10.5 | Pressed and small brand text |
| color.accent | #F2A900 | 9.3 | Highlights |
| color.success | #5FBF85 | 8.2 |  |
| color.danger | #FF8A80 | 8.2 |  |
| color.info | #7AA7FF | 7.8 | Focus ring |

Ratios are against color.background; against color.surface each is at least 7.0 and against color.raised at least 6.2.

### Category colours

The ten categories from the brief each have a tint and an ink. Tiles use the tint as background and the ink for the icon and label, and never use colour alone to tell categories apart: each also has an icon and a name. In the dark theme the tile background is the ink blended 35 percent into the surface and the label is the tint.

| Category | Tint | Ink | Ratio (light) | Dark background |
| --- | --- | --- | --- | --- |
| Technology & Digital Skills | #E6EEFC | #1D4FA8 | 6.6 | #212E4B |
| Entrepreneurship & Business | #FFE9A8 | #6B4E00 | 6.4 | #3C2E10 |
| Sustainability & Environment | #E4F3EA | #1F5C38 | 6.9 | #223324 |
| Academic & Professional Development | #E7E3FA | #4B3B9A | 7.0 | #312846 |
| Leadership & Volunteering | #FCE7DB | #9A3412 | 6.1 | #4D2517 |
| Creative Arts & Media | #FBE3F0 | #9C2A66 | 5.9 | #4D2234 |
| Sports & Recreation | #DDF3F3 | #0F5F63 | 6.4 | #1C3433 |
| Science & Research | #E8ECD9 | #4A5A12 | 6.3 | #313217 |
| Health & Wellbeing | #FDE4E4 | #A12A2A | 6.0 | #4F221F |
| Culture & Community | #F3E6D4 | #6B4220 | 7.0 | #3C2A1B |

All dark-theme labels (the tint on the dark background) have a ratio of 10.9 or higher. If the owner adds a category (OQ-P04), a new tint and ink pair must pass 4.5 in both themes before release.

## Typography (Tuscan Academic Heritage Editorial Pairing)

Campusly couples classical academic prestige with modern progressive web app performance through a high-contrast editorial pairing:

| Role | Face | Weights | Purpose & Characteristics | Fallback stack |
| --- | --- | --- | --- | --- |
| Display, Section Headings, Spotlight Titles | **Playfair Display** | 600 (SemiBold), 700 (Bold) | Refined academic authority and literary warmth; delivers tactile luxury and historical weight for collegiate organizations | Georgia, Garamond, serif |
| Body, UI Chrome, Navigation, Forms, Tags | **Plus Jakarta Sans** | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | Operational clarity, open apertures, rapid scan-speeds under high outdoor campus sunlight on mobile screens | system-ui, -apple-system, sans-serif |

**Loading rules (TYP-01 to TYP-06)**

- TYP-01: Ship Latin subsets only as WOFF2, with `font-display: swap`. Preloaded: Playfair Display 600 and Plus Jakarta Sans 400/600.
- TYP-02: Self-hosted within the application bundle (`/fonts`) so the app renders immediately offline and makes zero external font requests (D08, D09).
- TYP-03: The service worker caches the font files at install.
- TYP-04: Body text is never smaller than 14 px on desktop and 16 px in inputs to prevent unwanted iOS Safari viewport zooming.
- TYP-05: Use fluid rem units for all type and spacing to respect user OS font-scaling settings.
- TYP-06: Tabular numerals (`font-variant-numeric: tabular-nums`) for dates, prices, and star counters.

### Type scale & tokens

| Token | Size / Line Height | Face and Weight | Use in Interface |
| --- | --- | --- | --- |
| `display-lg` | 48px / 56px (Mobile: 34px / 40px) | Playfair Display 600 | Homepage hero statement, major landing headers |
| `headline-lg` | 32px / 40px (Mobile: 26px / 32px) | Playfair Display 600 | Page titles (Directory, Spotlight, Almanac) |
| `headline-md` | 24px / 32px | Playfair Display 600 | Major section titles, featured guild cards |
| `headline-sm` | 20px / 28px | Playfair Display 600 | Community profile subheadings, modal headers |
| `title-lg` | 18px / 24px | Plus Jakarta Sans 700 | Primary card titles, drawer headers |
| `title-md` | 16px / 22px | Plus Jakarta Sans 600 | Component titles, listing headers, active tabs |
| `title-sm` | 14px / 20px | Plus Jakarta Sans 600 | Sub-item titles, filter group labels |
| `body-lg` | 16px / 26px | Plus Jakarta Sans 400 | Editorial introductions, lead paragraphs |
| `body-md` | 14px / 22px | Plus Jakarta Sans 400 | Default body text, descriptions, activity summaries |
| `body-sm` | 12px / 18px | Plus Jakarta Sans 400 | Supporting metadata, timestamps, meeting venues |
| `label-md` | 13px / 16px | Plus Jakarta Sans 600 | Action buttons, chip selectors, form labels |
| `label-sm` | 11px / 14px | Plus Jakarta Sans 700 | Status badges, Verified seals, uppercase pills |

On screens 768 px and wider, display and h1 grow to 40 / 48 and 32 / 40; everything else stays the same. Line length for long text (About, Terms) is capped at 70 characters. Text is left-aligned; never justified. Sentence case everywhere except proper nouns; no all-caps labels, because they read poorly and are hard for screen readers on some devices.

## Icons, illustration and imagery

### Icons

- ICO-01: One icon set across the app: outlined, 24 px grid, 2 px stroke, rounded caps and joins. Use a single open-licence set (Lucide) so the build does not mix styles; the licence is recorded in D09.
- ICO-02: Icons inherit text colour (`currentColor`) and are inlined or sprited as SVG; no icon fonts.
- ICO-03: Icons that carry meaning always have a visible text label or an accessible name. Decorative icons are hidden from assistive technology.
- ICO-04: Touch targets are at least 44 × 44 px even when the glyph is 24 px.
- ICO-05: Each of the ten categories has one icon (Technology: chip, Entrepreneurship: briefcase, Sustainability: leaf, Academic: graduation cap, Leadership: hand-heart, Creative: palette, Sports: trophy, Science: flask, Health: heart-pulse, Culture: users). Final glyphs are confirmed in D03.
- ICO-06: The star control uses a filled star when starred and an outline star when not, with the count beside it. It is the only place the Gold accent appears in an icon.
- ICO-07: The "Paid listing" marker on Spotlight uses text plus a tag icon. It must never be icon-only or colour-only (D07 BR-110).

### Illustration

- ILL-01: Illustrations are used only for empty states, errors, onboarding and the install prompt. Everywhere else the content is the visual.
- ILL-02: Style: flat shapes, warm palette, a Campusly or flame motif, no gradients and no faces. Maximum five colours from the palette.
- ILL-03: Every illustration is an SVG under 8 KB, works in both themes by using tokens, and carries no text inside the artwork.
- ILL-04: Planned set: no results, offline, error, empty saved list, submission received, spotlight confirmation, install prompt (seven in all).

### Imagery and photography

- IMG-01: Listing images are uploaded by organisers. They are cropped to 16:9 for cards and 1:1 for the community avatar, resized and converted to WebP on upload (limits in D05, D08).
- IMG-02: Every card has a graceful placeholder: the category tint with the category icon. A card never shows a broken-image box.
- IMG-03: Text is never placed over a photo without a scrim. Where it is, the scrim must keep the text at 4.5:1.
- IMG-04: Alt text is required for any image that carries information, and the submission form asks for it (D01 accessibility requirements).
- IMG-05: Campusly's own marketing photography, if any, shows real ABU students with written consent; no stock images of other campuses or countries.
- IMG-06: Spotlight images follow the same rules, and an advertiser's logo or image may not imitate Campusly's brand or the Verified badge (D07 BR-107).

## Voice, tone and copy rules

**Brand voice:** warm, clear, and encouraging, like a friendly senior student who knows what is on. We are never corporate, never hype-driven, and never talk down to the reader. Many readers are first-years, and some read English as a second or third language, so plain words win.

| Trait | Means | Does not mean |
| --- | --- | --- |
| Welcoming | Invites people in, assumes no prior knowledge | Gushing or over-familiar |
| Clear | Short sentences, everyday words, one idea at a time | Dumbed-down or vague |
| Honest | Says what is paid, pending or unverified | Hiding the commercial side |
| Lively | Light warmth, the occasional Campusly phrase | Slang that dates, jokes in errors |

### Copy rules (COP-01 to COP-12)

- COP-01: Write at about a Grade 7 reading level. Prefer words of one or two syllables.
- COP-02: Buttons start with a verb and name the result: "Submit your club", "Copy link", "Track my submission".
- COP-03: Error messages say what happened, why if known, and what to do next. Never blame the person and never show codes alone.
- COP-04: Use the status names exactly as D07 defines them (Pending, Needs info, Approved, Verified, Rejected, Hidden, Removed; Spotlight: Awaiting payment, Receipt submitted, Active, Expired, Cancelled, Rejected, Paused).
- COP-05: Dates read "14 Nov 2026" and times in 12-hour format with WAT where useful (D07 BR-060 to BR-064). Money reads "₦1,000", with the naira symbol and thousands separators.
- COP-06: Paid content is always labelled "Paid listing". Never call a paid placement "recommended", "top" or "featured by Campusly" unless it is; "Featured" is the name of the plan and is shown with the label.
- COP-07: Never promise approval, rank, or visitor numbers in Spotlight copy.
- COP-08: Use "communities" for clubs, societies and groups in the interface; use "events" and "opportunities" exactly as D07 separates them.
- COP-09: Address the person as "you". Refer to the team as "we" only in About, Contact and legal pages.
- COP-10: No exclamation marks in errors, warnings, payment or legal text. One is allowed in success moments.
- COP-11: No emoji in system text; they may appear in user-submitted content only.
- COP-12: Empty states offer a next step, for example "No events this week. Browse opportunities or submit one."

### Naming

| Thing | Name | Rule |
| --- | --- | --- |
| Product | Campusly | One word, capital C, never "Campusly" or "the Campusly app" |
| Tagline | Discover more beyond the classroom | Sentence case, no full stop; working line, confirm in OQ-D01 |
| Paid section | Spotlight | Always capitalised; "Spotlight listing" for an item |
| Official notices | Announcements | Admin-only; "Announcement" for one item |
| Trust mark | Verified | Never used for anything but a verified community |
| Organisation | Google Developer Group on Campus ABU Zaria | Short form "GDGOC ABU Zaria" after first use |

### Sample copy

| Moment | Copy |
| --- | --- |
| Home hero | Find your people, events and chances at ABU. |
| Empty search | We could not find that. Try fewer words, or browse by category. |
| Submission received | Thanks. Your submission is in. Keep your tracking code CY-XXXX-XXXX to check progress. |
| Needs info | We need a little more from you before we can publish this. Reply within 7 days. |
| Offline | You are offline. Saved pages still work. We will refresh when you are back. |
| Spotlight awaiting payment | Pay ₦1,000 to the account below and use your reference SP-XXXX-XXXX. We start your listing once the payment is confirmed in our bank. |

Sample copy is illustrative; figures and periods in live copy must be read from settings so they never drift from D07.

## App icon, favicon, PWA and share-image specifications

### Icon files

| File | Size | Format | Notes |
| --- | --- | --- | --- |
| favicon.ico | 16, 32, 48 | ICO | Flame only, Ember on transparent |
| favicon.svg | scalable | SVG | Uses a media query for dark mode (Ember in light, #FF8A4C in dark) |
| apple-touch-icon.png | 180 × 180 | PNG | Full-bleed Ember square, cream flame; iOS rounds it |
| icon-192.png | 192 × 192 | PNG | Manifest, purpose "any" |
| icon-512.png | 512 × 512 | PNG | Manifest, purpose "any" |
| icon-maskable-512.png | 512 × 512 | PNG | Manifest, purpose "maskable" |
| og-default.png | 1200 × 630 | PNG or JPG, under 300 KB | Default share image |
| og-square.png | 1200 × 1200 | PNG or JPG | WhatsApp and some chat apps crop square |
| splash screens | per device list | PNG | Optional for iOS; cream background, centred flame |

### Rules (PWA-01 to PWA-08)

- PWA-01: The maskable icon keeps the flame inside the central safe zone, a circle of 80 percent of the width (diameter 410 px on 512), with the Ember background filling to the edges, so any mask shape works.
- PWA-02: The "any" icons keep a 10 percent transparent margin and use the rounded-square app icon from the logo drawing.
- PWA-03: Manifest `theme_color` is #C2410C and `background_color` is #FFF8F0; name is "Campusly", short\_name "Campusly" (8 characters, fits under the icon).
- PWA-04: A dark-mode `theme-color` meta tag uses #16120F.
- PWA-05: The icon is checked at 48 px on a home screen; the flame must stay recognisable with no inner detail lost beyond the drop.
- PWA-06: Installed-app shortcuts (long-press) use the flame in each shortcut's category colour only if D03 approves them; otherwise the default icon is used.
- PWA-07: Notification badge icon, if push is ever added, is a single-colour flame silhouette 96 × 96 on transparent. Push is not in the first release (D01).
- PWA-08: All icon files are produced from the master SVG in section 2, not redrawn, and are checked for contrast against light and dark launchers.

### Share images

When a listing link is shared on WhatsApp, X or Telegram, the preview shows a generated card (D06 owns the endpoint, D05 the fields).

- SHR-01: Layout: category tint background, large category icon, listing title in Jakarta 700 up to two lines, date or deadline, community name, Campusly flame and wordmark bottom left.
- SHR-02: Titles truncate with an ellipsis at two lines; the preview must never show raw markup or a user's image uncropped.
- SHR-03: Spotlight listings carry the "Paid listing" label on the share card as well.
- SHR-04: Safe zone: keep text 64 px from the edge on 1200 × 630 so a 1:1 crop does not cut it.
- SHR-05: Cards are cached by listing id and version, and regenerate when the listing is edited.

## GDGOC attribution and co-branding

Campusly is run by Google Developer Group on Campus (GDGOC) ABU Zaria. The use of the GDG name and marks is governed by Google's programme guidelines, which GDGOC chapter leads are bound by. This section records how Campusly will respect them; the final wording needs the chapter lead's confirmation (OQ-D02) and is cross-checked in D09.

- CO-01: Campusly has its own identity. It does not use Google's logo, the GDG bracket mark, or Google colours as part of the Campusly logo, app icon or palette.
- CO-02: Attribution appears in the footer, About page and share-image footer as text: "Built by GDGOC ABU Zaria". If the chapter lead supplies an approved lockup, it is placed there and nowhere else.
- CO-03: The text must not imply that Google endorses, owns or operates Campusly. Use "by GDGOC ABU Zaria", never "by Google".
- CO-04: Co-branding lockups, if approved, use the approved logo unaltered, at the minimum size and clear space given in the guidelines, on a plain background.
- CO-05: Third-party partners (other campus groups, sponsors) may be named in About. Their logos need written permission and are held to the same clear-space rules.
- CO-06: Expansion to other universities (D01 scope note): each campus gets a neutral "Campusly at \[University\]" line. The host university's name or crest is used only with that university's written permission.
- CO-07: Spotlight advertisers may not use Campusly, GDGOC or Google marks to suggest endorsement (D07 BR-107).
- CO-08: Open-source and font attributions are listed on a Licences page reachable from the footer (D09).

## Asset inventory, file naming and delivery checklist

### Inventory

| Group | Assets | Source | Status |
| --- | --- | --- | --- |
| Logo | Horizontal, stacked, flame-only, one-colour (black, white, Ember), app icon | Master SVG in section 2 | Drawn; files to export |
| Icons | favicon set, apple-touch, 192, 512, maskable | Master SVG | To export |
| Palette | Tokens in CSS variables and JSON | Sections 5 and 6 | Specified |
| Type | Plus Jakarta Sans, Inter WOFF2 Latin subsets | Open-licence sources | To subset |
| Icons set | 10 category icons plus interface icons | Lucide | To select |
| Illustrations | 7 empty and error states | To draw | Not started |
| Share image | Default, square, template for listings | Template | To design |
| Copy | Sample strings and status labels | Section 7 | Specified; final strings in D03 |

### File naming

- Lower-case, hyphen-separated, no spaces: `Campusly-logo-horizontal.svg`, `Campusly-logo-stacked-dark.svg`, `Campusly-icon-512.png`, `Campusly-icon-maskable-512.png`.
- Variants append in this order: name, layout, colour or theme, size. Example: `Campusly-logo-stacked-white-1024.png`.
- Illustrations: `ill-empty-search.svg`; category icons: `cat-technology.svg`.
- Version the pack in the folder name (`brand-v0.1.0/`), and never overwrite a released pack.

### Design tokens delivery

Tokens ship as a single `tokens.json` and a generated `tokens.css` with light values on `:root` and dark values under `[data-theme="dark"]` and `prefers-color-scheme`. D03 and the build prompts (D10) refer to tokens by name only, never by raw hex.

### Delivery checklist

- [ ] Master logo SVG exported (all lockups, light and dark).
- [ ] Favicon and PWA icons exported and checked at 16, 48 and 192 px.
- [ ] Maskable icon verified in a maskable preview tool.
- [ ] tokens.json and tokens.css generated; contrast table re-run on the final values.
- [ ] Fonts subset, under the 90 KB budget, licences recorded.
- [ ] Illustrations drawn and under 8 KB each.
- [ ] Default share image under 300 KB.
- [ ] GDGOC attribution wording approved by the chapter lead.
- [ ] Pack versioned and stored in the repository's brand folder.

### Open questions

| ID | Question | Owner | Needed by |
| --- | --- | --- | --- |
| OQ-D01 | Is "Discover more beyond the classroom" the final tagline? | Amr | Before D03 copy is final |
| OQ-D02 | What exact GDGOC attribution wording and lockup are permitted? | Chapter lead | Before launch |
| OQ-D03 | Does the chapter want its own colour accent on the About page? | Chapter lead | Before D03 |
| OQ-D04 | Is the Campusly name cleared (trademark and name search) in Nigeria? | Amr | Before launch |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-01 | First full draft: identity, logo, palette (light and dark), type, icons, voice, PWA and share specs, co-branding, inventory |


