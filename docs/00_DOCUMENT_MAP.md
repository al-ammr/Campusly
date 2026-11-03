---
doc_id: D00
title: Document Map and Governance Rules
file: 00_DOCUMENT_MAP.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Lead Architect)
reviewer: Lead Software Engineer / Auditor
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [PROJECT_OVERVIEW@1.0.0]
---

# Campusly Document Map

Nov 2, 2026 · @Amr Suleiman & Core Engineering Team

## Purpose and authority

This map is the rulebook for the Campusly documentation set: it lists every document, says which one owns which fact, and fixes how documents are written, approved and changed.

It governs process, not content. Questions about how documents work (names, versions, IDs, sign-off, change requests) are answered here. Questions about what Campusly does or how it works are answered by the document that owns that fact (see Source of truth).

Three principles drive every rule below.

- **One fact, one home.** Every fact lives in exactly one document. Other documents cite its ID instead of copying it, so two documents can never disagree about a rule, a status or a price.
- **Nothing is built from memory.** The AI builder works only from approved documents. When a fact is missing, it stops and logs an open question instead of guessing.
- **Nothing moves forward on a failed check.** Each gate has written exit criteria, and a failed audit sends work back instead of forward.

## Document control

This map is baselined at version 1.0.0 at Gate G0 and governs all subsequent documentation, prompts, audits, and builds.

| Field | Value |
| --- | --- |
| Document ID | D00 |
| File | 00_DOCUMENT_MAP.md |
| Project | Campusly, by Google Developer Group on Campus (GDGOC) ABU Zaria |
| Version | 1.0.0 (Baselined at Gate G0) |
| Status | Baselined |
| Last updated | 2026-11-02 |
| Governs | Documents D01 to D14 |
| Depends on | PROJECT_OVERVIEW.md, Campus clubs and opportunities product brief, and DEC-001 to DEC-010. |

## Document register

Fifteen canonical documents, numbered D00 to D14 (preceded by PROJECT_OVERVIEW.md), cover scope, design, engineering, build, verification and post-production refinement.

| ID | File | What it settles | Needs | Written | Status |
| --- | --- | --- | --- | --- | --- |
| — | PROJECT_OVERVIEW.md | Strategic vision, audience, core capabilities, build model, open decisions | none | 0th | Baselined |
| D00 | 00_DOCUMENT_MAP.md | How every document is written, owned, approved and changed | PROJECT_OVERVIEW | 1st | Baselined |
| D01 | PRD.md | Features, user stories, version 1 scope and exclusions, success metrics | D00 | 2nd | Baselined |
| D02 | WIREFRAMES.md | Layout and flow of every page | D01 | 4th | Baselined |
| D03 | UI_UX_SPEC.md | How colour, type, spacing, components, states, motion and accessibility are applied | D02, D04 | 6th | Baselined |
| D04 | BRAND_ASSETS.md | Campusly logo, brand palette, typefaces, icons | D01 | 5th | Baselined |
| D05 | ARCHITECTURE_SOURCE_OF_TRUTH.md | Tech stack, data model, folder structure, build phases | D01, D07 | 7th | Baselined |
| D06 | API_CONTRACT.md | Every endpoint with its requests, responses and errors | D02, D05, D07 | 8th | Baselined |
| D07 | BUSINESS_RULES.md | Spotlight plans, listing statuses, ranking, expiry, verification, payment procedure | D01 | 3rd | Baselined |
| D08 | SECURITY_SPEC.md | Threat model and mandatory security controls | D05, D06, D07 | 9th | Baselined |
| D09 | LEGAL_COMPLIANCE.md | Privacy policy, terms, listing rules, disclaimers, data protection | D01, D07 | 10th | Baselined |
| D10 | PROMPT_SEQUENCE.md | Paste-ready build prompts, phase by phase | D01 to D09 | 11th | Baselined |
| D11 | AUDIT_PROMPTS.md | Per-phase and final cross-check prompts, plus the coverage matrix | D01, D05, D06, D07, D10 | 12th | Baselined |
| D12 | SECURITY_AUDIT.md | Security audit test prompts, checklists, test cases, and results log | D06, D08, D10 | 13th | Baselined |
| D13 | DEPLOYMENT_PIPELINE.md | Hosting, environments, CI/CD, backups, release and rollback | D05, D08 | 14th | Baselined |
| D14 | AGILE_UX_REFINEMENT_BACKLOG.md | Post-production refinement, feedback intake, and parked version 2 backlog | D00 to D13 | 15th | Baselined |

"Needs" lists direct dependencies only; indirect ones follow the chain. IDs are labels, not an order of work: the Written column gives the order in which the documents are authored. Metrics definitions live inside D01 and accessibility rules inside D03. D14 opens only after the production gate (G6).

## How the documents feed each other

&#91;embedded content: document tiers · 15 documents, 1 gate\]

Each tier draws on the tiers above it, and the exact dependencies are listed in the register. Only D14 waits behind a gate: it opens after the production gate, G6.

## Source of truth

Every fact has one owning document, and when two documents disagree about a fact, the owner wins.

| Fact | Owner |
| --- | --- |
| What Campusly is, who it serves, features, user stories, version 1 scope, exclusions, success metrics | D01 PRD |
| Spotlight plans, prices, durations, slot cap, listing statuses, ranking, expiry, verification criteria, payment and refund procedure | D07 Business Rules |
| Page layout, navigation and user flow | D02 Wireframes |
| How colour, type, spacing, components, states, motion and accessibility are applied | D03 UI/UX Spec |
| Logo files, brand palette values, typefaces, icon and illustration style | D04 Brand Assets |
| Tech stack, folders, tables and fields, build phases and their order | D05 Architecture |
| Endpoints, payloads and error codes | D06 API Contract |
| Threat model and security controls | D08 Security Spec |
| Privacy policy, terms, listing rules, legal disclaimers | D09 Legal Compliance |
| The build prompts themselves | D10 Prompt Sequence |
| Audit checks and the coverage matrix | D11 Audit Prompts |
| Security test cases and results | D12 Security Audit |
| Hosting, environments, backups, release and rollback | D13 Deployment Pipeline |
| Deferred ideas and post-production refinement | D14 Agile UX Backlog |
| Document rules, IDs, versions, gates, severity levels, glossary, decision log, change log | D00 Document Map |

Some requirements straddle two owners, for example a convenience in the interface that would weaken a security control. In that case the higher-ranked document wins:

1. D08 Security Spec
2. D09 Legal Compliance
3. D07 Business Rules
4. D01 PRD
5. D05 Architecture
6. D06 API Contract
7. D02, D03 and D04 design documents
8. D10 to D13 derived documents

The losing document is corrected through a change request. Until then the higher-ranked document stands.

## Gates

Eight gates control progress, and a gate opens only when every exit criterion is met and both developers have signed.

| Gate | Opens when | Exit criteria | Unlocks |
| --- | --- | --- | --- |
| G0 Map | D00 is baselined at 1.0.0 | Open questions in this map are answered or assigned to a named person | Writing D01 |
| G1 Requirements | D01 and D07 are baselined | Every feature has an FR with acceptance criteria; every Spotlight rule has a BR; the exclusions list exists; no placeholder text | D02, D03, D04 and D09 |
| G2 Design | D02, D03 and D04 are baselined | Every page in D01 has a wireframe; every screen has empty, loading, error and success states; contrast and touch-target rules are stated. Engineering documents start only after this gate, so the data model reflects the real screens | D05, D06 and D08 |
| G3 Engineering | D05, D06, D08 and D09 are baselined | Every table and endpoint traces to an FR or BR; every SEC control maps to a threat; every endpoint states who may call it; legal pages are drafted | D10 to D13 |
| G4 Build start | D00 to D12 are baselined | The prompt sequence covers every FR; every phase has an audit prompt and a security level; the coverage matrix has no orphans; repository, branch rules and task board are ready. D13 must be baselined before phase P10 starts. | Phase P0 |
| G5 Phase | A phase build is complete | The audit passes; the security check runs at the level D10 sets; zero Critical or High findings are open; Medium findings have an owner and a date; the phase is merged and tagged | The next phase |
| G6 Production | All phases are merged | Final full-system audit and final security audit pass; the coverage matrix is complete; release and rollback are rehearsed on staging; backups are verified; zero Critical or High findings are open | Release |
| G7 Refinement | G6 has passed and Campusly is live | D14 is opened; version 1 documents stay baselined; refinements run in short cycles and any change to a baselined document goes through a change request | Agile UX work |

Severity levels used by every gate and audit:

- **Critical:** data exposure, a bypass of admin approval or payment checks, or a site that cannot be used.
- **High:** a feature in D01 does not work, or a rule in D07 is broken.
- **Medium:** the feature works but is degraded or confusing.
- **Low:** cosmetic or wording issues, logged to D14.

## Build phases and the documents each needs

Every build prompt attaches D00 plus the documents listed for its phase, and risky phases get a full security audit instead of a light check.

| Phase | Delivers | Also attach | Security check |
| --- | --- | --- | --- |
| P0 Setup and database | Project, database, seed data | D05, D07, D08 | Light |
| P1 Design shell and PWA | Layout, navigation, design tokens, installable app | D02, D03, D04, D05 | Light |
| P2 Communities and discovery | Categories, directory, profiles, search, filters | D01, D02, D03, D05, D06 | Light |
| P3 Events and opportunities | Lists, detail pages, expiry, calendar links | D01, D02, D03, D06, D07 | Light |
| P4 Submission forms | Community, event and opportunity forms with spam protection | D01, D02, D06, D07, D08 | Full |
| P5 Admin | Login, pending queue, approve, verify, reject | D05, D06, D07, D08 | Full |
| P6 Reports and sharing | Report flow, share buttons, link previews | D01, D06, D08, D09 | Light |
| P7 Spotlight | Listings, checkout, receipts, stars, ranking, Featured strip, expiry | D02, D03, D06, D07, D08, D09 | Full |
| P8 Announcements | Admin posts with images and public reading pages | D02, D03, D06, D08 | Full |
| P9 Metrics | Join clicks, counts, admin overview | D01, D05, D06 | Light |
| P10 Hardening and deploy prep | Abuse and rate-limit review, error pages, backups, staging, release steps | D08, D09, D12, D13 | Full |

A light check runs the D12 checklist for the areas the phase touches (configuration, secrets, input handling). A full check runs a complete D12 pass: threat walk-through, abuse tests and verification of fixes.

This table is provisional. Once D05 is baselined it owns the phase definitions, and this table changes only through a change request.

## Standards

Every document follows the same rules for names, headers, versions and location, so any developer or AI builder can read any document the same way.

**File names.** Upper-case words joined by underscores, with the `.md` extension, exactly as spelled in the register. Only D00 carries a number prefix. All documents live in the `docs` folder of the repository.

**Front matter.** Every document opens with this block:

```markdown
---
doc_id: D07
title: Business Rules
file: BUSINESS_RULES.md
version: 1.0.0
status: Baselined        # Draft | In review | Baselined | Superseded
author: <name>
reviewer: <name>
approved_by: <both developers>
approved_on: YYYY-MM-DD
depends_on: [D01@1.0.0]
---
```

**Versions.** Documents use MAJOR.MINOR.PATCH.

- 0.x.y is a draft or in review and is never built from.
- 1.0.0 is the first baseline, approved at its gate.
- A major change alters scope or behaviour, or invalidates built or audited work.
- A minor change adds or clarifies a requirement without breaking an existing one.
- A patch fixes wording or a typo with no change in meaning.

**Dependency pinning.** Each document lists the exact versions of the documents it was written from. When a source document gains a new major or minor version, every document that pins the old one is marked stale until it is re-checked and re-pinned. D10 to D13 pin every source they use.

**Repository layout.**

```text
docs/
  00_DOCUMENT_MAP.md
  PRD.md
  WIREFRAMES.md
  UI_UX_SPEC.md
  BRAND_ASSETS.md
  ARCHITECTURE_SOURCE_OF_TRUTH.md
  API_CONTRACT.md
  BUSINESS_RULES.md
  SECURITY_SPEC.md
  LEGAL_COMPLIANCE.md
  PROMPT_SEQUENCE.md
  AUDIT_PROMPTS.md
  SECURITY_AUDIT.md
  DEPLOYMENT_PIPELINE.md
  AGILE_UX_REFINEMENT_BACKLOG.md
  brand/                  logo and icon files
  change-requests/        CR-001.md, CR-002.md, ...
```

## Document lifecycle

&#91;embedded content: document lifecycle · 4 states\]

A document is trusted for building only once it is Baselined, and any later edit reopens it as a new Draft through a change request.

## IDs and traceability

Every requirement, rule, control and check carries a permanent ID, so any piece of code traces back to a requirement and any requirement forward to a test. IDs take the form PREFIX-### (for example FR-014).

| Prefix | Meaning | Lives in |
| --- | --- | --- |
| US | User story | D01 |
| FR | Functional requirement | D01 |
| NFR | Non-functional requirement (speed, access, devices) | D01 |
| BR | Business rule | D07 |
| WF | Wireframe screen | D02 |
| UI | Interface component or design token | D03 |
| DB | Table or field | D05 |
| API | Endpoint | D06 |
| SEC | Security control | D08 |
| LEG | Legal item | D09 |
| PR | Build prompt | D10 |
| AU | Audit check | D11 |
| SA | Security test | D12 |
| DEP | Deployment step | D13 |
| BL | Backlog item | D14 |
| CR | Change request | D00 |
| DEC | Decision | D00 |
| OQ | Open question | The document where it is raised |

- **IDs are permanent.** They are never reused or renumbered. A removed item stays in its document, marked Retired.
- **Coverage rule.** Every FR traces forward to a wireframe screen (if visible), a build prompt and an audit check. Every table, endpoint and control traces back to an FR, a BR or a named threat. An item with a missing link is an orphan and fails the final audit.
- **Coverage matrix.** It lives in D11 and is rebuilt at every gate.
- **Testable criteria.** Each FR and BR carries acceptance criteria written as Given, When, Then, so an audit can check it directly.

Illustrative chain (the numbers are placeholders): FR-031 → WF-14 → API-27 → PR-17 → AU-052 → SA-009.

## Change control

A Baselined document changes only through a change request (CR), so nothing slips into scope unapproved and no code change alters documented behaviour on its own.

1. **Open the CR** as `docs/change-requests/CR-###.md`, stating what changes, why, which documents and IDs it touches, and which built work it affects.
2. **Assess impact.** List every document, prompt, audit check and phase affected, and size the effort as small, medium or large.
3. **Decide.** Both approvers choose Approve, Reject, or Defer to D14. A deferred idea gets a BL ID.
4. **Update the owning document first,** bump its version and add a change log line.
5. **Update derived documents** (D10 to D13) and re-pin the versions they cite.
6. **Re-run the audit and security checks** for every affected phase.
7. **Close the CR** with the new version numbers.

There are three tracks.

| Track | When | Approval |
| --- | --- | --- |
| Patch | Typo or wording, no change in meaning | Author and reviewer; logged in the change log |
| Standard | Any change to a requirement, rule, price, control or contract | Both developers, all seven steps |
| Emergency | A live security or payment defect | Fix first; open the CR within 24 hours |

CR template:

```markdown
# CR-001: <title>
Requested by / date:
Change:
Reason:
Documents and IDs affected:
Built work affected (phases, prompts):
Size: small | medium | large
Decision: approve | reject | defer (BL-###)
Decided by / date:
New versions:
```

## Rules for AI-assisted building

The AI builder is treated as a fast but literal contractor: it builds exactly what the attached documents say and nothing else.

- **Attach by phase.** Every prompt attaches D00 and the documents listed for its phase, at the versions pinned in D10.
- **No guessing.** For any fact the builder needs but cannot find, it stops and writes an OQ question instead of choosing a value.
- **Report back in three lists.** Every build reply ends with the documents and versions used, the IDs implemented, and the assumptions made. A non-empty assumptions list blocks the audit until each item is resolved or logged.
- **One prompt at a time.** One phase branch, and commit messages cite the IDs they implement.
- **Documents change by CR only.** Never ask the builder to edit a document, and never accept a behaviour change that no document describes.
- **Independent audits.** Audit and security prompts run in a fresh session that has no memory of the build, and not by the developer who drove that phase.
- **No secrets in prompts.** Keys, passwords and bank details stay out of every prompt and every document.

## Definition of done

A document is done, and may be baselined, only when every item below is true.

- [ ] Front matter is complete, with version, status and pinned dependencies
- [ ] Every requirement, rule, control or check has an ID
- [ ] No fact is copied from a document that owns it; IDs are cited instead
- [ ] No TBD, placeholder or sample text; unresolved items are OQ entries with an owner
- [ ] Terms match the glossary
- [ ] Every requirement has testable acceptance criteria
- [ ] The other developer reviewed it, and every review note is resolved or logged
- [ ] The change log is updated
- [ ] Both developers approved it, and its status is set to Baselined

## Roles and sign-off

The two developers share every role, but nobody reviews, approves or audits their own work.

| Role | Responsibility |
| --- | --- |
| Author | Writes or updates a document and answers review notes |
| Reviewer | The other developer; checks the document against its definition of done |
| Approver | Both developers; a baseline needs both approvals |
| Driver | Runs the build prompts for a phase and commits the result |
| Auditor | The other developer; runs the audit and security prompts for that phase |

Author and reviewer swap by document, and driver and auditor swap by phase. Sign-off is recorded in the repository, as an approved pull request or an equivalent recorded approval, and referenced in the document's front matter and change log. Who at GDGOC is consulted on scope (D01), money rules (D07) and legal matters (D09) is still open.

## Glossary

These terms mean the same thing in every Campusly document.

| Term | Meaning |
| --- | --- |
| Campusly | The platform, built by GDGOC ABU Zaria |
| GDGOC | Google Developer Group on Campus |
| Community | A club, society, association, organization or initiative in the directory |
| Pending | A submission waiting for admin review; hidden from the public |
| Approved | A submission an admin accepted for public display |
| Rejected | A submission an admin declined, with a reason |
| Community Listing | An approved community that an admin has not yet confirmed |
| Verified | A community whose existence and activity an admin confirmed; shows the Verified badge |
| Spotlight | The paid showcase page where anyone can list a business or product |
| Standard listing | A paid Spotlight listing that appears in the ranking |
| Featured listing | A paid Spotlight listing pinned in the Featured strip that also appears in the ranking |
| Featured strip | The pinned area at the top of Spotlight, outside the ranking |
| Star | A visitor's upvote on a Spotlight listing; there are no downvotes |
| Community Ranking | The order of Spotlight listings, strictly by star count |
| Reference code | A unique code per Spotlight checkout, written in the bank transfer narration so an admin can match the payment |
| Receipt | The transfer proof a lister uploads; visible to admins only |
| Announcement | An admin-only, blog-style post with a write-up and an image |
| PWA | Progressive web app: a website that can be installed on a phone |
| Baselined | A document approved at its gate and trusted for building |
| Gate | A checkpoint with written exit criteria |
| CR | Change request |
| OQ | Open question |

## Decision log

Decisions made so far are recorded here so later documents can cite them by ID. Values such as prices and durations are not repeated; they live in D07 once it is written.

| ID | Date | Decision | Status |
| --- | --- | --- | --- |
| DEC-001 | 2026-10-11 | The platform is named Campusly, by GDGOC ABU Zaria | Agreed |
| DEC-002 | 2026-10-11 | Version 1 is an installable web app (PWA) with no student logins; accounts come in version 2 | Agreed |
| DEC-003 | 2026-10-11 | Anyone can submit communities, events and opportunities, and nothing is public until an admin approves it | Agreed |
| DEC-004 | 2026-10-11 | Every Spotlight listing is paid, with a Standard and a Featured plan; Featured is pinned outside the ranking and also appears in it | Agreed |
| DEC-005 | 2026-10-11 | Spotlight ranking is strictly by stars; downvotes are scrapped; anyone can list | Agreed |
| DEC-006 | 2026-10-11 | No email check before voting in version 1; login-based voting arrives in version 2 | Agreed |
| DEC-007 | 2026-10-11 | Announcements are admin-only and blog-style, with the write-up and image together | Agreed |
| DEC-008 | 2026-10-11 | Build in Waterfall order (documents, prompt sequence, audits, security checks), with agile UX refinement only after the full production build | Agreed |
| DEC-009 | 2026-10-19 | The documentation set is fixed at 15 documents, D00 to D14, written one at a time | Agreed |
| DEC-010 | 2026-10-11 | The two developers coordinate through a shared repository, swapping driver and auditor roles each phase | Agreed |

## Change log

| Version | Date | Change |
| --- | --- | --- |
| 0.1.0 | 2026-10-19 | First draft of the Document Map |
| 1.0.0 | 2026-11-02 | Baselined at Gate G0. Normalized 15-document canonical register, resolved open questions OQ-001 through OQ-005, and established Gate Rule controls. |

## Resolved decisions (formerly Open Questions)

These questions were settled at Gate G0 baselining:

- [x] **OQ-001**: Roles are split between Amr Suleiman (Product Lead & Lead Software Architect) and the Pairing Engineering Agent / Auditor.
- [x] **OQ-002**: Amr Suleiman holds the final tie-breaking vote on disputed change requests.
- [x] **OQ-003**: GitHub repository with branch protection on `main`. Sign-off is achieved via pull request approvals and passing CI status checks.
- [x] **OQ-004**: GDGOC ABU Zaria Faculty Advisor and Chapter Lead are consulted for official brand and institutional alignment; Amr Suleiman retains technical and operational authority.
- [x] **OQ-005**: AI builder accepts attached documents per prompt. The modular prompt sequence (D10) targets under 32k tokens per phase prompt, comfortably within the builder's context window.


