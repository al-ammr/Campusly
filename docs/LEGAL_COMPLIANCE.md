---
doc_id: D09
title: Legal Compliance and Terms Framework
file: LEGAL_COMPLIANCE.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / Legal Coordinator
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0, D07@1.0.0, D08@1.0.0]
---

# D09 Legal and Compliance

Nov 2, 2026 · @Amr Suleiman

## 1. Document control and status

**This is a planning document, not legal advice.** It records the legal questions Campusly must answer, the positions the product is designed around, and the public documents that must exist before launch. Every statement about a law, a tax or a regulator is a working assumption from general knowledge and was not verified for this draft; a qualified Nigerian lawyer must review the whole document before launch (OQ-L01). Where this document and counsel's advice differ, counsel's advice wins and this document is corrected.

| Field | Value |
| --- | --- |
| Document | D09 Legal and Compliance |
| Version | 0.1.0 (first full draft) |
| Phase and gate | P3 Architecture to P4 Pre-build, gate G3 and G4 |
| Inputs | D01, D05, D07, D08, D04 |
| Feeds | D10 (legal pages and consent features), D11, D13, D14 |

**Authority.** D09 owns legal wording, retention periods required by law and the list of public legal documents. D07 owns business rules, D08 owns security values and D05 owns table and field limits. If D09 requires a change to those (for example a shorter retention period), it raises a change request against the owning document instead of editing it.

**ID convention.** LEG-xxx requirements, LR- risks, OQ-L open questions for counsel.

## 2. Legal landscape, responsibilities and risks

### Who is the operator?

The operator decides who signs terms, receives Spotlight money, owns the domain and is responsible under data law. This is the biggest open legal question (OQ-L02). Options:

| Option | Fit | Concern |
| --- | --- | --- |
| A. GDGOC ABU Zaria itself | Natural owner of the programme | A student chapter may not be a legal entity, and Google's programme rules may restrict commercial activity by chapters |
| B. TechOptyx (Amr's company) as operator and service provider to GDGOC | Gives a legal entity that can sign terms, invoice and hold a bank account | Must be stated clearly, with GDGOC permission and brand rules respected; payment goes to a company account |
| C. A new registered entity or society for Campusly | Cleanest long term for multiple campuses | Cost and admin before launch |

Proposed default: decide before launch, and until then no real payments are taken. Whichever option is chosen must match the name on the bank account shown to Spotlight payers and the name in the Terms.

### Laws and rules likely to apply (to confirm with counsel)

| Area | Instrument (name only; details to confirm) | Why it matters |
| --- | --- | --- |
| Data protection | Nigeria Data Protection Act 2023 and regulations of the Nigeria Data Protection Commission (NDPC) | Processing of organiser contacts, device tokens, payment evidence |
| Cybercrime | Cybercrimes (Prohibition, Prevention, etc.) Act 2015 as amended | Obligations about unlawful content, system abuse, and data retention requests |
| Consumer protection and advertising | Federal Competition and Consumer Protection Act 2018; advertising rules enforced by APCON | Paid listings, honest labelling, advertiser claims |
| Intellectual property | Copyright Act 2022 | Images and text uploaded by organisers; our own brand |
| Taxes | Federal and state tax rules on service income, including VAT and income tax, as updated by recent tax reforms | Spotlight revenue and invoices |
| Company and payments | Companies and Allied Matters Act 2020 if an entity is used; Central Bank rules for receiving payments | Account holder, record keeping |
| Electronic transactions | Rules on electronic records and receipts | Evidence of payment |
| Education institution rules | ABU's student organisation and branding policies | Use of the university name, campus use and student events |
| Programme rules | Google Developer Groups on Campus guidelines | Name, logo, commercial activity, data |

### Risk register

| ID | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| LR-01 | Operator unclear; payments received by an individual | Medium | High | Decide the operator, bank account in that name, Terms naming the operator (LEG-101) |
| LR-02 | Breach of data rules through unneeded personal data | Low | High | Minimisation (D08 SEC-400), notices, retention |
| LR-03 | Spotlight advert misleads students | Medium | Medium | Review, not-allowed list, Paid listing label, takedown (D07 BR-107) |
| LR-04 | Infringing images or text uploaded | Medium | Medium | Upload licence, takedown process, report path |
| LR-05 | Google programme rules breached by commercial use | Medium | High | Written confirmation from the chapter lead or programme contact (OQ-L03) |
| LR-06 | University objects to name or events use | Low to medium | Medium | Written permission or neutral wording (D04 CO-06) |
| LR-07 | Tax and invoice obligations missed | Medium | Medium | Accountant review before first payment (OQ-L06) |
| LR-08 | Defamatory or harmful user content | Low to medium | Medium | Standards, reporting, quick removal, moderation records |
| LR-09 | Consumer dispute over a refund | Medium | Low | Clear refund rules (D07 BR-140 to BR-152) shown before payment |
| LR-10 | Data request or legal order received without a process | Low | Medium | Legal request procedure (LEG-160) |

## 3. Data protection

Campusly is designed to collect very little. The operator is the data controller for the data below; service providers (hosting, storage, email) are processors under written terms (LEG-120).

### Data inventory

| Data | Whose | Purpose | Lawful basis (to confirm) | Kept |
| --- | --- | --- | --- | --- |
| Listing content (names, descriptions, links) | Organisers, businesses | Publish the listing | Consent given by submitting, and legitimate interest in running the service | While live, then archived per D07 |
| Organiser contact name and channel; optional email | Organisers | Review, status notices, disputes | Consent and legitimate interest | Until the listing is removed plus a short period |
| Verification proof | Community organisers | Verify a community | Consent | 90 days after decision (D07 BR-030 to BR-038) |
| Payment receipt, payer name, bank reference | Businesses | Confirm payment, accounts, disputes | Contract and legal obligation | As records law requires (OQ-L06), then deleted |
| Device token (hashed), network key (hashed) | Visitors | One star per device, abuse limits, security | Legitimate interest | Star data 90 days, device 12 months unseen |
| Reports and notes | Visitors | Moderation | Legitimate interest | With the listing record |
| Analytics events (no free text) | Visitors | Improve the product | Legitimate interest, with a notice | 13 months |
| Admin account data and audit log | Admins | Security and accountability | Contract or legitimate interest | Audit minimum 24 months (D08) |

No student names, matric numbers, phone numbers or accounts are collected from visitors, and none of the data is sold or used for advertising profiling.

### Requirements

| ID | Requirement |
| --- | --- |
| LEG-101 | Terms and Privacy Notice name the operator, its address and a contact for data matters |
| LEG-110 | A Privacy Notice in plain English explains what is collected, why, how long, who receives it and how to exercise rights; it is linked from the footer, the submit form and the Spotlight flow |
| LEG-111 | At each collection point a short just-in-time notice appears: submit form (contact use), Spotlight (payment evidence use), install and analytics settings |
| LEG-112 | Rights handled: access, correction, deletion, objection, and withdrawal of consent, through the Contact page; response within the period set by law (30 days Proposed) and recorded |
| LEG-113 | Because visitors are anonymous, a request is verified by the tracking code or reference or by showing control of the contact email; no extra identity documents are asked for |
| LEG-114 | If the operator must register with or report to the NDPC, or appoint a data protection officer, based on the volume and type of processing, it does so before launch (OQ-L04) |
| LEG-115 | A record of processing (this inventory, kept current) is maintained |
| LEG-116 | Children: Campusly is for university students and staff; the interface does not target under-18s and does not knowingly collect their data; counsel to advise on student age (OQ-L05) |
| LEG-120 | Written agreements with each service provider covering purpose, security, sub-processing and deletion; the list of providers and regions is in the Privacy Notice |
| LEG-121 | Data is hosted in a region chosen with transfer rules in mind; if stored outside Nigeria, the transfer basis is documented (D05 OQ-A02) |
| LEG-130 | Breach handling follows D08 section 8; where personal data is affected, the NDPC and affected people are notified within the legal period (72 hours is the common standard; counsel to confirm) |
| LEG-131 | A breach log records every incident, even if no notice was required |
| LEG-160 | Legal requests (court orders, police, regulator) go to the operator contact; one named Lead handles them, records them and gets counsel's advice before disclosing anything |
| LEG-161 | Receipts and evidence are disclosed only under a valid order or with the owner's consent |

## 4. Cookies, device tokens and analytics

Campusly uses one first-party cookie for the anonymous device (`campusly_device`) and a separate admin session cookie for admins. Neither is used for advertising or sold.

| Item | Purpose | Essential? | Consent position (to confirm) |
| --- | --- | --- | --- |
| `campusly_device` cookie | One star per device, rate limits, abuse prevention, saved device state | Needed for security and requested features (starring, submitting) | Explained in the Privacy and Cookie notice; no banner needed if only strictly necessary items are used and counsel agrees |
| Admin session cookie | Keeps admins signed in | Essential | Not shown to the public |
| Local storage (theme, install-prompt state, drafts, recent searches) | Remember choices on the device | Convenience, no tracking | Described in the notice; clearable by the user |
| Analytics events | Product improvement | Not essential | First-party, no free text, no cross-site tracking; opt-out in the footer Settings sheet (LEG-210) |

| ID | Requirement |
| --- | --- |
| LEG-201 | A Cookie and device notice (short, plain) lists each item above, its purpose and how long it lasts |
| LEG-202 | If any non-essential tracking beyond first-party events is added later (for example third-party analytics), consent controls are added first and counsel reviews |
| LEG-210 | The footer Settings sheet lets a person turn analytics off and clear local data on the device; the choice is respected within the next request |
| LEG-211 | The star control is explained at first use: "We use a small device cookie so each device gets one star." |
| LEG-212 | Clearing cookies is allowed and explained; it resets the device identity and local data but not content already submitted |

Counsel is asked whether strictly necessary use of a device cookie for abuse limits needs consent or only notice under Nigerian rules (OQ-L07). Until answered, the design shows the notice at first star and in the footer.

## 5. Spotlight commercial terms

Spotlight is a paid advertising and showcase product. The rules below come from D07; D09 adds the legal frame and the wording that must appear in the Spotlight Terms. Prices and durations are read from settings and are never typed into legal text.

| ID | Requirement |
| --- | --- |
| LEG-301 | Before paying, the business sees and accepts the Spotlight Terms (D06 `agree_terms`), stored with the order, version and time |
| LEG-302 | The Terms state: what is sold (a time-limited listing, not a guaranteed result), that rank depends on stars and rotation, that Campusly does not guarantee views, sales or approval, and that Campusly may reject, pause or remove listings that break the rules |
| LEG-303 | The price, duration, payee name, bank account and reference are shown before payment, and the payee name matches the operator (LR-01) |
| LEG-304 | Payment is by bank transfer; the listing starts only after the payment is confirmed in the bank (D07 BR-140 to BR-152); a receipt alone is not confirmation |
| LEG-305 | Refund terms (window, reasons, how requested, how long) appear before payment, and match D07; a refusal reason is recorded |
| LEG-306 | The Paid listing label is mandatory on every Spotlight listing and in share cards (D04 COP-06, D03 UI-104) so students are not misled about commercial content |
| LEG-307 | Prohibited businesses and claims (D07 BR-107) are listed in the Terms: unlawful goods and services, adult content, weapons, gambling and betting, get-rich schemes and unlicensed financial offers, misleading health or exam-cheating claims, impersonation, and anything that harms students |
| LEG-308 | Advertisers are responsible for the truth of their claims, their right to use the images and names they upload, and compliance with advertising and consumer rules that apply to them; they indemnify the operator within limits counsel approves |
| LEG-309 | Pricing is stated in naira; whether it includes tax, and whether the operator charges VAT, is decided with an accountant (OQ-L06) and shown consistently |
| LEG-310 | The operator issues a receipt or invoice for each confirmed payment as the tax rules require; template prepared before the first payment |
| LEG-311 | Records of orders, payments and refunds are kept for the period tax and company rules require (counsel and accountant to confirm; Proposed 6 years), even though receipts images follow D08 retention (OQ-L06) |
| LEG-312 | Complaints from advertisers or students go to a Contact route; a response target of 5 working days (Proposed) |
| LEG-313 | Limitation of liability and governing law (Nigerian law, courts to be named by counsel) are included in the Terms |
| LEG-314 | The operator does not hold advertiser money beyond the payment itself; there is no wallet, escrow or deposit |

### Statements that must not appear

- Guarantees of results ("get 1,000 customers").
- Language that suggests Campusly, GDGOC, Google or the university endorses an advertiser (D04 CO-07).
- "Verified" on any Spotlight listing (D07 BR-034).
- Hidden or ambiguous payment instructions.

## 6. User-generated content and intellectual property

Organisers and businesses supply the content on Campusly. The operator hosts it, reviews it and can remove it, but does not author it.

| ID | Requirement |
| --- | --- |
| LEG-401 | By submitting, the person confirms they have the right to share the content and images, that it is accurate to their knowledge, and that they speak for the community or business |
| LEG-402 | The submitter grants the operator a non-exclusive, free licence to display, resize, convert and share the content on Campusly and in share cards, for as long as the listing exists; they keep ownership |
| LEG-403 | The Content Standards (public) list what is not allowed: unlawful content, hate or harassment, sexual content, scams, personal data of others, copyright infringement, impersonation, spam, and misleading claims |
| LEG-404 | Reporting is available on every listing (D03 7.4, D06 API-207, API-208); reports are reviewed per D07 and the outcome is recorded |
| LEG-405 | A notice-and-takedown route exists for copyright and legal complaints: a form on Contact asking for the work, the link, the complainant's details and a statement; the operator acts promptly, hides the item while it assesses, and tells the submitter |
| LEG-406 | Hiding or removing content for rule breaches is the operator's right and is applied consistently (D07 BR-040 to BR-049); the submitter can see a reason and resubmit |
| LEG-407 | Moderation does not make the operator the author; the Terms state that content is the submitter's responsibility and that Campusly does not guarantee accuracy of listings |
| LEG-408 | Defamation and privacy complaints get priority: the item is hidden pending review |
| LEG-409 | Photos of identifiable people are uploaded only with their consent; the submit form says so, and reports can flag breaches |
| LEG-410 | Campusly's own brand, logo and design are owned by the operator or licensed to it; the fonts and icons used are open licences, listed on the Licences page (section 8) |
| LEG-411 | Events and opportunities that involve payment, fees, or recruiting must show that clearly; Campusly does not run those payments |
| LEG-412 | Safeguarding: events involving travel, minors or physical risk are the organiser's responsibility, and the platform removes listings reported as unsafe pending review |

## 7. Required public documents

Five documents must be live and linked before launch. Each is drafted by counsel from the outline below, written in plain English (D04 COP-01), versioned, and shows its last-updated date. Changes that affect users are announced and logged.

| Document | Route | Linked from | Key clauses (outline) |
| --- | --- | --- | --- |
| Terms of Use | /terms | Footer, submit form, Spotlight flow | Who runs Campusly; what it is (a discovery platform, not the organisers); acceptable use; content ownership and licence (LEG-402); moderation rights; no guarantees; limits of liability; governing law; changes; contact |
| Privacy Notice | /privacy | Footer, submit form, Spotlight flow, install sheet | Operator and contact; data inventory (section 3); purposes and bases; retention; providers and regions; rights and how to use them; security summary; children; complaints to the regulator; changes |
| Cookie and device notice | /privacy#cookies | Footer, first star | Items in section 4 with purpose and life; how to change or clear |
| Content Standards | /standards (linked from /terms) | Submit form, report sheet | Allowed and not allowed content (LEG-403); how reports and takedowns work; how to appeal |
| Spotlight Terms | /spotlight/terms | Spotlight list and order screens | Section 5 clauses: what is sold, payment and reference, confirmation in bank, refunds, prohibited content, advertiser responsibilities, removal and pause, liability, governing law |

| ID | Requirement |
| --- | --- |
| LEG-501 | Documents are stored in the repository as content files with a version and date, rendered with the static layout (D03 7.9), so legal text is not buried in code |
| LEG-502 | The version accepted is recorded for submissions and Spotlight orders |
| LEG-503 | A change to Terms that adds obligations or reduces rights gets a banner and an Announcement for 14 days; the previous version stays accessible |
| LEG-504 | A Contact page lists the operator name, a working email or form, and the route for data, legal and takedown requests |
| LEG-505 | A Licences page lists open-source libraries, fonts and icons with their licences and links (LEG-601) |
| LEG-506 | An Accessibility statement describes the WCAG 2.2 AA target, known gaps and a contact for problems |

## 8. Third parties, brand and licences

| ID | Requirement |
| --- | --- |
| LEG-601 | Every library, font and icon set is open licence (for example MIT, Apache 2.0 or SIL Open Font Licence); the licence text and attribution are included in the Licences page, and the build lists them automatically; no copyleft licence that would force publishing the source is added without a decision |
| LEG-602 | Fonts (Plus Jakarta Sans, Inter) and icons (Lucide) are self-hosted under their licences (D04); licence terms to be confirmed when files are downloaded |
| LEG-603 | Google programme rules: before launch the chapter lead confirms in writing what the GDGOC name and marks may be used for, whether a chapter-run product may charge for advertising, and how the attribution must read (D04 CO-02 to CO-04; OQ-L03) |
| LEG-604 | University permission: ABU's student affairs or relevant office is asked in writing about the platform, the use of the university name, and listing events held on campus (OQ-L08); until answered, "ABU" is used only descriptively (for example "at ABU Zaria") |
| LEG-605 | Domain name and social handles are registered in the operator's name, not an individual's, with two people holding access |
| LEG-606 | Trademark check: a name search for Campusly in Nigeria before launch; the name may need a distinguishing qualifier (D04 OQ-D04) |
| LEG-607 | Service providers (hosting, database, storage, email, error tracking) are chosen with terms that allow commercial use (D05 OQ-A01), include data protection terms and provide breach notice |
| LEG-608 | Advertisers and organisers may not use Campusly's name or logo except as the Terms allow |
| LEG-609 | If other campuses join, each needs its own permission and Terms addendum naming the campus contact; ABU's permission does not cover them (D05 OQ-A03) |

### Service providers (placeholders until chosen)

| Function | Provider | Region | Data they hold | Agreement |
| --- | --- | --- | --- | --- |
| Hosting and CDN | To choose | To choose | Requests, cached public pages | To sign |
| Database | To choose | To choose | All records | To sign |
| File storage | To choose | To choose | Images, receipts, proofs | To sign |
| Email | To choose | To choose | Recipient addresses and messages | To sign |
| Error tracking | To choose | To choose | Technical errors without personal data | To sign |

## 9. Launch checklist, open questions for counsel and change log

### Legal gate checklist (G4 and G7)

- [ ] Operator decided; bank account name matches (LEG-101, LEG-303)
- [ ] Counsel has reviewed this document and the five public documents
- [ ] Privacy Notice, Terms, Cookie notice, Content Standards and Spotlight Terms published and linked
- [ ] Data protection registration or reporting question answered and done if required (LEG-114)
- [ ] Written confirmation from the GDGOC chapter lead or programme contact (LEG-603)
- [ ] University permission or agreed neutral wording (LEG-604)
- [ ] Accountant has confirmed tax treatment, invoice template and record periods (LEG-309 to LEG-311)
- [ ] Service provider agreements signed and listed (LEG-120, LEG-607)
- [ ] Name search for Campusly done (LEG-606)
- [ ] Licences page generated and checked (LEG-601)
- [ ] Takedown and legal-request procedures tested with a dummy case (LEG-160, LEG-405)
- [ ] Accessibility statement published (LEG-506)

### Ongoing calendar

| When | Task | Owner |
| --- | --- | --- |
| Each term | Review Terms and Privacy Notice for changes in product or law | Lead |
| Each term | Restore drill and retention check (D08) | Developers |
| Quarterly | Review provider list and regions | Lead |
| On any new feature | Check data inventory and notices before release | Developers |
| Yearly | Counsel review; renew domain and trademark watch | Lead |
| On expansion to a campus | New permission and addendum (LEG-609) | Lead |

### Open questions for counsel

| ID | Question | Owner | Default used |
| --- | --- | --- | --- |
| OQ-L01 | Full legal review of this document and the public documents | Amr | Required before launch |
| OQ-L02 | Which entity operates Campusly and receives Spotlight money? | Amr | No real payments until decided |
| OQ-L03 | Does the GDG on Campus programme allow charging for adverts, and how must the name be used? | Chapter lead | Treat as not confirmed |
| OQ-L04 | Is registration with the data protection regulator or a data protection officer required at our scale? | Counsel | Plan for it |
| OQ-L05 | What minimum age applies to users and organisers? | Counsel | University students and staff; no targeting of under-18s |
| OQ-L06 | Tax treatment of Spotlight income, invoice format, and record retention period | Accountant | Records kept 6 years |
| OQ-L07 | Does an anti-abuse device cookie need consent or only notice? | Counsel | Notice shown at first star |
| OQ-L08 | University permission and wording for ABU references | Chapter lead | Descriptive use only |
| OQ-L09 | Is a liability cap enforceable as drafted, and which courts should be named? | Counsel | To be drafted by counsel |

### Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-11-02 | First full draft; not legally reviewed |


