---
doc_id: D07
title: Business Rules and Settings Register
file: BUSINESS_RULES.md
version: 1.0.0
status: Baselined
author: Amr Suleiman (Product & Technical Lead)
reviewer: Lead Software Engineer / System Architect
approved_by: Amr Suleiman & GDGOC ABU Zaria Core Team
approved_on: 2026-11-02
depends_on: [D00@1.0.0, D01@1.0.0]
---

# Campusly Business Rules

Oct 30, 2026 · @Amr Suleiman

D07 is the single source of truth for every rule and number that changes how Campusly behaves: listing statuses, review and verification, Spotlight plans and prices, payment and refunds, expiry, ranking and stars, the Featured strip, announcements and admin permissions. Other documents point here and never repeat these values.

## Document control

| Field | Value |
| --- | --- |
| Document | D07 Business Rules |
| Version | 0.1.0, first draft for owner review |
| Owner | Campusly team, GDGOC ABU Zaria |
| Depends on | D01 PRD (hand-off list), D00 Document Map |
| Feeds | D02, D03, D05, D06, D08, D09, D10, D11 |
| Supersedes | The working status names and example thresholds in D01 and D02 |

### How to read a rule

- Every rule has an ID, BR-###, a plain statement, and where it applies. Rules use must for requirements and may for options.
- A value in **bold** is a setting. Each setting has a default here and is listed in the settings register at the end, so an admin can change it without a code release (FR-251, FR-338).
- A rule marked **Proposed** is the author's recommendation where D01 left a question open. It is binding for the build unless the owner answers the linked open question differently.
- Money is in naira (₦). Times are West Africa Time (WAT, UTC+1) and stored in UTC.

### Rule ID ranges

| Range | Topic |
| --- | --- |
| BR-001 to BR-049 | Listing statuses, submission, review, verification, reports |
| BR-050 to BR-099 | Events, opportunities and time-based rules |
| BR-100 to BR-199 | Spotlight plans, payment, lifecycle, expiry |
| BR-200 to BR-249 | Stars, ranking and the Featured strip |
| BR-250 to BR-299 | Announcements, roles and permissions, settings |

## Listing status model

Communities, events and opportunities share one status model. It replaces the working names in D01. Spotlight listings have their own model, drawn later in this document.

&#91;embedded content: listing status model · 7 states, only 2 public\]

### Rules

| ID | Rule |
| --- | --- |
| BR-001 | A listing is visible to the public only when its status is Approved or Verified. In every other status its address returns the not found page (WF-331). |
| BR-002 | Every new submission starts as Pending. Nothing a submitter can do makes a listing public. |
| BR-003 | Verified applies only to communities. Events and opportunities are Approved, and show the community's badge when their host is Verified. |
| BR-004 | Rejected is final for that submission. A submitter may send a new submission, which is linked to the old one so the admin sees the earlier reason. |
| BR-005 | Needs info is set when an admin cannot decide without more details. The submitter has **7 days** (info reply window) to reply on the tracking page. After that the submission becomes Rejected with the reason "No reply received". Proposed. |
| BR-006 | Hidden is a temporary admin action used while a report is checked, at the owner's request, or for a safety concern. A hidden listing keeps its previous status and returns to it when restored. |
| BR-007 | Removed is permanent. The listing stays in the audit log with its reason and who removed it, and cannot be restored by an admin. A developer restore needs a recorded decision. |
| BR-008 | Every status change is written to the audit log with the actor, time, old status, new status and reason. |

### Allowed moves

| From | To | Who | Needs |
| --- | --- | --- | --- |
| Pending | Approved | Admin | Content standards met (D01) |
| Pending | Needs info | Admin | A written question |
| Pending | Rejected | Admin | A reason from the list in BR-021 or a written one |
| Needs info | Pending | System | Submitter replied |
| Needs info | Rejected | System | Reply window passed (BR-005) |
| Approved | Verified | Admin | Every required check in BR-030 passed (communities only) |
| Approved or Verified | Hidden | Admin | A reason |
| Hidden | Previous status | Admin | A reason |
| Verified | Approved | Admin | Badge removed under BR-034 |
| Any status except Removed | Removed | Admin | A reason and a second confirmation |

## Submission, review and decisions

These rules decide how a submission enters the queue, how fast it must be handled and how a decision is recorded.

| ID | Rule |
| --- | --- |
| BR-010 | Anyone may submit a community, event or opportunity without an account. A submitter must give one working contact method (email, phone or WhatsApp). It is private by default and visible only to admins, unless the submitter marks it public (FR-095). |
| BR-011 | Each device may send at most **3 submissions per day** (submission daily cap). A fourth attempt shows the rate-limited state and keeps the entered data. Admins may raise the cap in settings. Proposed. |
| BR-012 | Every submission passes the abuse checks in D08 (hidden field, rate limit, content checks) before it is stored. A failed check never shows the person the reason. |
| BR-013 | A tracking code is issued on receipt. Its format is the prefix CF, a dash, then two groups of four characters from a set that leaves out look-alike characters (for example CY-7K3M-9QXP). Codes are random, not sequential, and unique. |
| BR-014 | Tracking lookups are limited to **10 attempts per device per hour** (tracking lookup cap) so codes cannot be guessed. |
| BR-015 | The review target is **2 working days** (review target) from receipt. An item is flagged Overdue in the inbox after **3 working days** (overdue threshold). Both are targets, not promises to the public. Closes OQ-P16. Proposed. |
| BR-016 | The inbox is ordered oldest first, with Overdue items marked. Reports and payments are in the same queue and use the same ordering. |
| BR-017 | Before approving, an admin may correct spelling, formatting, category and tags, and may crop or replace an image. An admin must not change the meaning of what the submitter wrote. Every edit is recorded in the audit log. |
| BR-018 | An admin must open the join, apply or registration link and confirm that it loads and matches the listing before approving. |
| BR-019 | An admin cannot approve a submission they authored. The submission must be reviewed by a different admin. This applies once there are two or more admin accounts (OQ-P05). |
| BR-020 | Approval makes the item public at once. Rejection and Needs info are shown on the tracking page with the reason. |
| BR-021 | Rejection reasons come from a fixed list so reports stay comparable: Not relevant to students; Incomplete information; Duplicate of an existing listing; Cannot be verified; Unsafe, illegal or hateful; Misleading or false; Asks applicants to pay; Other, with a written note. An admin may add a note to any reason. |
| BR-022 | The submitter is never told which abuse check, if any, applied. They see only the listed reason. |
| BR-023 | A submission that stays Pending for **30 days** (stale submission limit) is closed as Rejected with the reason "Not reviewed in time" and the team is alerted so it can be reopened by hand. |
| BR-024 | An admin who approves wrongly can move an item to Hidden at once and then correct or remove it; no approval is silent. Every decision is in the audit log (FR-246). |

## Verification

Verified is a promise by the Campusly team that a community is real and reachable. It is earned by evidence, not by asking, and it can be lost.

| ID | Rule |
| --- | --- |
| BR-030 | A community may be set to Verified only when an admin has ticked every required check: (1) a named contact person; (2) proof of existence or affiliation; (3) a working join or contact channel; (4) content that meets the standards. The result of each check is stored. |
| BR-031 | Accepted proof of existence or affiliation, any one of: a letter or message from a staff adviser, a recognised student body or the GDGOC lead; a registration or recognition document; a public page or channel with a clear history of activity that the admin has viewed; or confirmation from an existing Verified community. |
| BR-032 | Verification may be requested at submission (FR-212) or later through Suggest an edit. Proof files are visible to admins only and are deleted **90 days** after the decision (proof retention) unless the admin extends them for a recorded reason. |
| BR-033 | A community with a different name from its proof, or a contact person who cannot be reached, is not verified until the mismatch is resolved. |
| BR-034 | The Verified badge is removed, and the status returns to Approved, when: the community is reported and found to be false; its join channel stays dead for **14 days** (dead link grace) after a warning; its contact person asks to step down; or the community is inactive for **12 months** (inactivity limit) with no update. The reason is stored and shown to the owner on the tracking page. |
| BR-035 | A Verified community is re-checked every **12 months** (verification review period). The admin sees it in the Health screen (WF-276) 30 days before its anniversary. |
| BR-036 | Verified is never sold, never part of Spotlight, and never changed by paying. A community that also runs a Spotlight listing is verified or not on its own merits. |
| BR-037 | The public label for an Approved community is Community Listing. Its tooltip says it has been checked for safety but not verified by the team. The label for Verified is Verified. Wording is set in D03. |
| BR-038 | Events and opportunities are not individually verified. Where the host is Verified the event shows Hosted by a Verified community. Opportunities show Source checked when an admin confirmed the organiser's link, a lighter check than a community verification. |

## Duplicates, edits, reports and repeat offenders

| ID | Rule |
| --- | --- |
| BR-040 | A submission is flagged as a possible duplicate when its name matches an existing public or pending listing after ignoring case, spacing and punctuation, or when its join link matches one already stored. The admin decides; the system never rejects automatically. |
| BR-041 | A duplicate is resolved by merging the new details into the existing listing, rejecting the new one with the Duplicate reason, or approving both when they are genuinely different groups. The decision is recorded. |
| BR-042 | A Suggest an edit request (FR-203) never changes a public page by itself. It joins the inbox with the current and proposed values side by side. Approval applies the change; rejection keeps the page as it is. |
| BR-043 | A change to the name, join link or contact person of a Verified community sends it to Pending-edit review: the page stays public with its old values until the admin approves the change, and the badge is held until the proof still matches. |
| BR-044 | A report (FR-180) needs a reason from the list and may carry a note. The reporter is not asked for identity. Reports are counted per device, **5 per device per day** (report daily cap), to stop mass flagging. |
| BR-045 | A listing that receives **3 reports from different devices within 7 days** (auto-hide threshold) is hidden automatically and flagged at the top of the inbox. This protects students quickly; an admin then restores or removes it with a reason. Proposed. |
| BR-046 | A report about a safety problem, scam or threat is handled before any other queue item. The admin may hide first and review after. |
| BR-047 | A submitter whose submissions are rejected for Unsafe, Misleading or Asks applicants to pay **3 times** (repeat offence limit) is blocked from submitting. The block applies to the device and to the contact detail they gave, lasts **90 days**, and is lifted early only by an admin with a reason. |
| BR-048 | A blocked submitter sees the normal rate-limited message, never a statement that they are blocked. The tracking page for older items still works. |
| BR-049 | A listing owner may ask for removal through Suggest an edit with the contact on file. After the admin checks the contact matches, the listing is removed within **2 working days**. |

## Events, opportunities and time-based rules

### Event or opportunity (closes OQ-P10)

| ID | Rule |
| --- | --- |
| BR-050 | An item is an **Event** when it happens at a set date and time and a person attends it: a talk, workshop, meeting, competition day or social. It needs a start time and a place or online link. |
| BR-051 | An item is an **Opportunity** when a person applies, enters or registers before a deadline for something that continues after: an internship, scholarship, volunteering role, grant, fellowship, call for entries or competition application. It needs a deadline and an apply link. Proposed. |
| BR-052 | An Event is shown as Ended once its end time has passed. When no end time is given it ends **3 hours** (default event length) after the start. Ended events leave upcoming lists and stay on the host's Activities tab and at their own address. |
| BR-053 | A competition with its own event day is an Event; the call to enter it is an Opportunity. A submitter may need to send both, and the admin may link them. |
| BR-054 | An Opportunity is shown as Closed from the first moment after its deadline, end of day WAT. Closed opportunities leave the default list, show a Closed label and keep their address. |
| BR-055 | An Opportunity shows Closes soon during the last **7 days** (closing soon window) before its deadline. The list chip Closing soon uses the same window. |
| BR-056 | A deadline or start time in the past cannot be submitted. An admin may correct a past date only to fix an error, with a note. |
| BR-057 | Rolling opportunities with no deadline are allowed only when the submitter states so. They show Open until further notice and are re-checked every **60 days** (rolling review). |

### Freshness and staleness

| ID | Rule |
| --- | --- |
| BR-060 | A community profile is Stale when it has had no update and no new activity for **6 months** (stale limit). Stale profiles stay public but are listed in the Health screen (WF-276) for the admin to check. |
| BR-061 | A join or registration link that fails its automated check on **3 days in a row** (dead link check) is flagged in the Health screen and the owner is contacted. The public page keeps working but hides the Join button and shows the listed contact route (FR-089). |
| BR-062 | Recruiting now is shown only while the community's own recruiting window is open. A window with an end date closes by itself; one without an end date lapses after **30 days** (recruiting lapse) unless the owner refreshes it. |
| BR-063 | Every public page shows a last updated date. The date changes only when approved content changes, not when stars, views or reports change. |
| BR-064 | Times are shown in WAT with the day name. Dates use the day, month name and year (for example 14 Nov 2026). Closes OQ-P12. |

## Spotlight plans, prices and eligibility

Every Spotlight listing is paid. There are two plans. This section is the only place in the documentation set where prices and durations are written; every other document reads them from settings.

### Plans

| Plan | Price | Duration | Where it appears | Setting names |
| --- | --- | --- | --- | --- |
| Standard | ₦1,000 | 3 days | The ranked list, ordered by stars | plan.standard.price, plan.standard.days |
| Featured | ₦5,000 | 4 days | The Featured strip, pinned outside the ranking, and also the ranked list | plan.featured.price, plan.featured.days |

### Rules

| ID | Rule |
| --- | --- |
| BR-100 | Prices and durations in the table are the agreed launch values. An admin changes them in settings (WF-273). A change applies only to listings created after the change; a listing already paid for keeps the price and days it was bought at. |
| BR-101 | A duration counts from the moment the listing becomes Active, not from payment, and ends at that same time of day after the plan's days. |
| BR-102 | Both plans are bought for one period at a time. Paying for several periods in one go is not offered in version 1 (closes OQ-P07). Proposed. |
| BR-103 | A seller may hold at most **3 Active listings** at once (active listing cap), identified by contact detail and business name. Proposed. |
| BR-104 | Anyone may sell on Spotlight: students, student businesses, local shops and service providers near campus. Spotlight does not imply endorsement by GDGOC or the university. |
| BR-105 | A listing needs a business or product name, a category, a one-line offer, a description, at least one image, one contact method and a way to find the seller (a place or an online page). |
| BR-106 | Allowed categories at launch (closes OQ-P08): Food and drinks; Fashion and accessories; Tech and gadgets; Services (printing, laundry, repairs, tutoring); Beauty and wellness; Books and stationery; Events and entertainment; Other. An admin edits the list in settings. Proposed. |
| BR-107 | Not allowed on Spotlight: anything illegal; weapons; drugs, alcohol, tobacco or vaping; adult content; gambling or betting; loans or investment schemes; multi-level marketing; counterfeit goods; sale or writing of academic work or exam material; political campaigning; and listings that promise results they cannot show. |
| BR-108 | A listing may not claim an official link to GDGOC, the university or any other body unless that body has agreed in writing and the admin has seen it (see OQ-P13, OQ-P15). |
| BR-109 | Standard and Featured listings follow the same content and image standards as every other item in D01. A listing is checked before it goes live, even after payment. |
| BR-110 | The public listing carries a Paid listing label (WF-141). The label text is set in D03 and the disclosure in D09. |
| BR-111 | Campusly never takes payment for what a seller sells. Buyers and sellers deal directly, and the Terms in D09 say so. |
| BR-112 | A seller can run a Standard and a Featured listing for different products at the same time, but may not buy both for the same product in the same period. |

## Spotlight lifecycle

This model replaces the working status names in D01. A listing has exactly one status at a time and is public only while Active.

&#91;embedded content: Spotlight lifecycle · 7 states, 1 public\]

### Rules

| ID | Rule |
| --- | --- |
| BR-120 | A listing is created as Awaiting payment the moment the seller finishes the listing details and a payment reference is issued. |
| BR-121 | Awaiting payment becomes Cancelled when no receipt is sent within **7 days** (unpaid hold) of creation. The reference stops working; a seller starts again with a new one. |
| BR-122 | Sending a receipt moves the listing to Receipt submitted and into the payments queue. |
| BR-123 | From Receipt submitted an admin may ask for a fix (the receipt is unreadable or the amount or reference is wrong). The listing returns to Awaiting payment with the reason shown, and the 7-day hold restarts. |
| BR-124 | Receipt submitted becomes Active only after the admin has ticked Confirmed in bank (BR-141) and approved the listing content. Both are recorded. |
| BR-125 | Receipt submitted becomes Rejected when the content breaks the standards or the payment cannot be matched after a fix request. A reason is required. If money was paid, the refund rule in BR-146 applies. |
| BR-126 | Active becomes Expired when its period ends. It leaves the page and stops accepting stars. Its star count is kept. |
| BR-127 | An admin may Pause an Active listing for a report, a content problem or at the seller's request. A Paused listing is hidden and cannot be starred. The remaining time is frozen only when the pause is not the seller's fault, as decided and noted by the admin. |
| BR-128 | A Paused listing returns to Active when the admin resumes it, or becomes Expired when its period ends unfrozen, or Rejected when the admin finds a breach of standards. |
| BR-129 | Expired, Cancelled and Rejected listings cannot be reactivated. A seller renews by paying again, which starts a new period (Section Expiry and renewal). |
| BR-130 | Every transition is written to the audit log with the actor and reason, and is shown to the seller on their status page (WF-234). |

### Allowed moves

| From | To | Who | Needs |
| --- | --- | --- | --- |
| (none) | Awaiting payment | Seller | Listing details complete |
| Awaiting payment | Receipt submitted | Seller | A receipt file |
| Awaiting payment | Cancelled | System | Unpaid hold passed |
| Receipt submitted | Awaiting payment | Admin | A fix reason |
| Receipt submitted | Active | Admin | Confirmed in bank and content approved |
| Receipt submitted | Rejected | Admin | A reason |
| Active | Paused | Admin | A reason |
| Paused | Active | Admin | A reason |
| Paused | Rejected | Admin | A reason |
| Active or Paused | Expired | System | Period ended |

## Payment, receipts and refunds

Version 1 takes no online payments. The seller pays by bank transfer and an admin checks the bank before any listing goes live. These rules protect both sides from fake receipts and lost money.

| ID | Rule |
| --- | --- |
| BR-140 | The payment reference is unique to one listing and one payment. It has the prefix SP, a dash and eight characters from the same look-alike-free set as tracking codes (for example SP-4H8N-2WRT). It is generated by the server, never chosen by the seller. |
| BR-141 | A listing may become Active only after an admin has checked the receiving bank account itself (not the receipt image) and found a credit for the exact plan amount that carries the listing's reference or matches the sender, time and amount. The admin ticks Confirmed in bank (FR-331, FR-332). A receipt image alone is never enough. |
| BR-142 | A receipt is an image or PDF of at most the size set in D05. It is stored privately and visible only to admins and to the seller through their code. |
| BR-143 | A payment of the wrong amount is handled as follows: less than the plan price, the listing returns to Awaiting payment with the shortfall stated; more than the plan price, the listing proceeds and the extra is refunded or credited to the next renewal at the seller's choice, as recorded in the audit log. |
| BR-143b | Every confirmed Spotlight transaction generates an official digital payment receipt with a standard sequential identifier formatted as `INV-CY-YYYYMM-XXXX`, viewable and downloadable by the seller. |
| BR-144 | A payment with no reference or a wrong one is matched by sender name, amount and time. If it cannot be matched, the admin asks the seller for the bank's transaction detail through the contact on file. |
| BR-145 | One credit pays for one listing once. A second receipt for a payment already used is rejected and flagged in the audit log. |
| BR-146 | A refund is due when: the seller paid and the listing is Rejected for a reason that is not the seller's breach of the standards; the listing could not go live because of a platform fault; or a duplicate payment was made. Refunds are not due after a listing has been Active, except where a platform fault stopped it from being shown. |
| BR-147 | A refund is made to the account the money came from, within **7 days** (refund window) of the decision, and the admin records the amount, date and bank reference. The seller sees a refund note on their status page (FR-343). |
| BR-148 | A listing rejected for fraud, a fake receipt or breaking BR-107 gets no refund and may be blocked under BR-047. |
| BR-149 | Bank details come only from admin settings. Changing them needs the admin's password again, shows old and new values side by side, is logged, and alerts every other admin (FR-257). |
| BR-150 | The receiving account must be a business or the GDGOC's authorised account, not a personal account of a developer, as confirmed by the owner (closes OQ-P14 once answered). |
| BR-151 | Admin reconciliation: once a week an admin checks that every Active listing has a matching bank credit and records the check. Differences are reported to the owner. |
| BR-152 | Campusly does not issue tax invoices in version 1. The status page can show a payment confirmation note. Whether a receipt or tax document is required is open (OQ-P14). |

## Expiry, renewal and changes

| ID | Rule |
| --- | --- |
| BR-160 | The expiry time is set when the listing becomes Active: the start time plus the plan's days. It is stored as an exact time. A scheduled check runs at least every **15 minutes** (expiry check interval) and moves due listings to Expired. A listing never shows after its expiry time, even if the check is late: the public query itself filters by time. |
| BR-161 | Sellers can renew from **24 hours** before expiry (renewal window) and at any time after. Renewing creates a new payment reference and follows the same payment and approval steps. |
| BR-162 | Renewing while still Active adds a new period that starts when the current one ends, if the admin approves it before then. The seller is not charged twice for time already running. If approval comes after the current period ends, the new period starts at approval. |
| BR-163 | There is no grace period after expiry. An expired Featured listing frees its slot at once. |
| BR-164 | The seller is told of the coming expiry on their status page. Where the seller gave a messaging channel and an admin chooses to message them, a reminder may be sent, but sending is never required for the listing to expire (OQ-P20). |
| BR-165 | A renewed listing keeps its page address and star count. An expired listing that is not renewed for **90 days** (archive period) is archived: hidden from the seller's status page after the code is used, and its images are deleted according to retention rules in D09. |
| BR-166 | A seller may ask to change a live listing (FR-310). Text corrections within the same meaning (spelling, opening hours, phone number) are approved quickly. A change to the offer, name, category or images goes through full review. The live version stays unchanged until the change is approved. |
| BR-167 | A change request does not extend the period and does not need a new payment. |
| BR-168 | A seller may ask to end a listing early. No refund is due unless BR-146 applies. |
| BR-169 | A seller may upgrade a Standard listing to Featured while it is Active by paying the full Featured price. The Featured period starts at approval, and the unused Standard time is not credited. Proposed. |
| BR-170 | Changing a plan price or duration never changes the expiry of a listing already Active (BR-100). |

## Stars, ranking and suspicious stars

Students have no accounts in version 1, so a star belongs to a device. This is a weak identity, so the rules combine a simple limit with checks that catch obvious abuse. Accounts and login-based voting replace this in version 2.

### Stars and ranking

| ID | Rule |
| --- | --- |
| BR-200 | There are stars only. There are no downvotes and no ratings. |
| BR-201 | Only Active listings can be starred. A star on a listing that expires or is paused is kept, and counts again if the listing becomes Active again. |
| BR-202 | A device may give **one star per listing**. A second tap shows the starred state and changes nothing. A star cannot be taken back in version 1. |
| BR-203 | A device is identified by a random token created in the browser the first time the person gives a star. The token holds no personal data. Clearing site data creates a new device, which the checks in BR-210 to BR-214 are designed to absorb. |
| BR-204 | The ranked list orders listings by star count, highest first. Plan, price paid and seller identity have no effect on the order. |
| BR-205 | Tie-break: the listing that reached its current count earlier ranks higher. A listing with no stars is ordered by activation time, newest first, so a new listing is not buried below old ones. |
| BR-206 | Star counts are shown as exact numbers. They update immediately for the person who starred and within **60 seconds** (count refresh) for everyone else. |
| BR-207 | The ranking applies to Standard and Featured listings together. Featured listings appear in the ranked list at their star position as well as in the Featured strip (BR-225). |
| BR-208 | The ranking page explains these rules in plain language (WF-142). The page reads its text from this document so the two cannot disagree. |
| BR-209 | A seller may not star their own listing, may not ask staff to add stars, and may not offer prizes for stars. A listing found doing so is handled under BR-216. |

### Detecting and handling suspicious stars

| ID | Rule |
| --- | --- |
| BR-210 | A device may give at most **10 stars per hour** (device star cap) across all listings. |
| BR-211 | A single network may give at most **30 stars per hour** (network star cap) to any one listing, elevated to **100 stars per hour** for verified campus CGNAT IP pools, supplemented by unique device token checks and burst detection (BR-212) to protect concurrent students in hostels and lecture halls from false lockouts. The network is represented by a hashed address with rotating salt, never the raw address itself. |
| BR-212 | A listing that gains more than **10 stars in 10 minutes** (burst threshold) and at least **5 times** its average hourly rate (burst multiple) is flagged. |
| BR-213 | A star from a device token created less than **60 seconds** (new-device delay) earlier, with no page views before it, is marked Held. |
| BR-214 | Held stars are stored but not counted until an admin reviews them. The admin can release them or delete them, and either choice is logged. |
| BR-215 | The admin can see, per listing, stars by hour, the number held and the flags raised, and can delete individual stars or all stars from one network in a time range (FR-341, FR-346). |
| BR-216 | If a seller is found to have manipulated stars, the listing is Rejected without refund and the seller is handled under BR-047. A first minor case may instead be warned, with the stars removed. |
| BR-217 | Star data kept per star is the listing, a time, the device token and the hashed network value. It is deleted **90 days** after the listing expires (star retention). |

## The Featured strip

The Featured strip is a pinned area above the ranked list. It is outside the ranking, and a Featured listing is also ranked.

| ID | Rule |
| --- | --- |
| BR-225 | A Featured listing appears in the Featured strip for its whole Active period, in addition to its place in the ranked list. |
| BR-226 | The strip holds at most **6 listings** (Featured slot cap). The cap is a setting. Closes OQ-P06. Proposed. |
| BR-227 | Order in the strip: the order rotates every **6 hours** (strip rotation interval) in a fixed cycle so each Featured seller spends equal time in the first position. Stars do not affect strip order. The order is the same for every visitor in the same interval so pages can be cached. |
| BR-228 | When all slots are taken, the Featured plan shows Full with the date the next slot opens. Payment for a Featured listing is not accepted while the strip is full. A seller may join the waitlist or buy Standard. |
| BR-229 | The waitlist is first come, first served. When a slot opens, the first seller on the list has **48 hours** (waitlist offer time) to pay; then the next seller is offered it. A seller can leave the list at any time. |
| BR-230 | A slot is counted from the moment a Featured listing is Receipt submitted and its payment is confirmed, so two sellers cannot pay for the last slot. If two receipts arrive for one slot, the earlier confirmed credit wins and the other seller is offered a refund or the waitlist. |
| BR-231 | A Paused Featured listing leaves the strip and keeps its slot when the pause is not the seller's fault (BR-127). Otherwise the slot is released. |
| BR-232 | An expired Featured listing releases its slot at the moment it expires. |
| BR-233 | The strip is hidden when no Featured listing is Active. |
| BR-234 | Featured is a paid placement and is labelled as such. It does not make a listing Verified and must not be described as an endorsement. |

## Announcements, roles and permissions

### Announcements

| ID | Rule |
| --- | --- |
| BR-250 | Only an admin can create, edit, publish or remove an announcement. There is no public submission and no comments in version 1. |
| BR-251 | An announcement has a title, an image, a body and a published time. It is a Draft until published; drafts are never public. |
| BR-252 | The author name shown is Campusly team unless the admin chooses another approved name (closes OQ-P26). Proposed. |
| BR-253 | A published announcement may be edited. An edit shows an Updated date. A removed announcement returns the not found page. |
| BR-254 | Pinning and scheduling are not in version 1 (closes OQ-P23). Announcements are ordered newest first by published time. |
| BR-255 | Announcements follow the content standards in D01. Advertising a Spotlight seller in an announcement is not allowed unless it is a labelled sponsored post approved by the lead admin. |

### Admin roles

Version 1 has three roles, assigned per account. At launch there must be at least two admin accounts so BR-019 can work. Proposed, closes OQ-P05.

| ID | Rule |
| --- | --- |
| BR-260 | **Reviewer** handles content: the inbox, approving, editing, hiding, rejecting, requesting information, reports, announcements, categories and tags. |
| BR-261 | **Finance** handles Spotlight money: the payments queue, Confirmed in bank, approving and activating Spotlight listings, refunds, and the weekly reconciliation. |
| BR-262 | **Lead** can do everything, and alone manages settings, bank details, admin accounts and removing listings permanently. |
| BR-263 | A person may hold more than one role, but the person who confirms a payment may not be the same person who submitted the listing, and a Finance admin may not approve their own refund. |
| BR-264 | Every admin account has its own login. Shared accounts are not allowed. Accounts are removed the same day the person leaves the team. |
| BR-265 | The audit log records every action by every admin. Only the Lead can read the whole log; each admin can read their own entries. No role can edit or delete log entries. |

### Permission matrix

| Action | Reviewer | Finance | Lead |
| --- | --- | --- | --- |
| See inbox and reports | Yes | Yes | Yes |
| Approve, reject, edit, hide community, event, opportunity | Yes | No | Yes |
| Verify a community | Yes | No | Yes |
| Remove a listing permanently | No | No | Yes |
| Write and publish announcements | Yes | No | Yes |
| Confirm payment and activate a Spotlight listing | No | Yes | Yes |
| Pause, resume or end a Spotlight listing | Yes | Yes | Yes |
| Issue a refund | No | Yes | Yes |
| Inspect and delete stars | Yes | Yes | Yes |
| Change plan prices, slots and thresholds | No | No | Yes |
| Change bank details | No | No | Yes |
| Create or remove admin accounts | No | No | Yes |
| Read the full audit log | No | No | Yes |

## Settings register

Every value below is a setting, changed by the Lead in WF-273 without a release, logged in the audit log. The build reads these keys and never hard-codes the defaults. Bank details are held separately (WF-274).

| Key | Default | Unit | Rule |
| --- | --- | --- | --- |
| plan.standard.price | 1000 | naira | BR-100 |
| plan.standard.days | 3 | days | BR-100, BR-101 |
| plan.featured.price | 5000 | naira | BR-100 |
| plan.featured.days | 4 | days | BR-100, BR-101 |
| spotlight.activeListingCap | 3 | listings per seller | BR-103 |
| spotlight.categories | list of 8 (BR-106) | list | BR-106 |
| spotlight.unpaidHoldDays | 7 | days | BR-121 |
| spotlight.refundWindowDays | 7 | days | BR-147 |
| spotlight.expiryCheckMinutes | 15 | minutes | BR-160 |
| spotlight.renewalWindowHours | 24 | hours | BR-161 |
| spotlight.archiveDays | 90 | days | BR-165 |
| featured.slotCap | 6 | listings | BR-226 |
| featured.rotationHours | 6 | hours | BR-227 |
| featured.waitlistOfferHours | 48 | hours | BR-229 |
| star.deviceCapPerHour | 10 | stars | BR-210 |
| star.networkCapPerListingPerHour | 15 | stars | BR-211 |
| star.burstCount | 10 | stars | BR-212 |
| star.burstMinutes | 10 | minutes | BR-212 |
| star.burstMultiple | 5 | times average | BR-212 |
| star.newDeviceSeconds | 60 | seconds | BR-213 |
| star.countRefreshSeconds | 60 | seconds | BR-206 |
| star.retentionDays | 90 | days | BR-217 |
| review.targetWorkingDays | 2 | working days | BR-015 |
| review.overdueWorkingDays | 3 | working days | BR-015 |
| review.infoReplyDays | 7 | days | BR-005 |
| review.staleSubmissionDays | 30 | days | BR-023 |
| submit.dailyCapPerDevice | 3 | submissions | BR-011 |
| track.lookupCapPerHour | 10 | attempts | BR-014 |
| report.dailyCapPerDevice | 5 | reports | BR-044 |
| report.autoHideCount | 3 | devices | BR-045 |
| report.autoHideDays | 7 | days | BR-045 |
| block.offenceCount | 3 | rejections | BR-047 |
| block.days | 90 | days | BR-047 |
| verify.proofRetentionDays | 90 | days | BR-032 |
| verify.deadLinkGraceDays | 14 | days | BR-034 |
| verify.inactivityMonths | 12 | months | BR-034 |
| verify.reviewMonths | 12 | months | BR-035 |
| event.defaultLengthHours | 3 | hours | BR-052 |
| opportunity.closingSoonDays | 7 | days | BR-055 |
| opportunity.rollingReviewDays | 60 | days | BR-057 |
| stale.communityMonths | 6 | months | BR-060 |
| link.deadChecksInARow | 3 | daily checks | BR-061 |
| recruiting.lapseDays | 30 | days | BR-062 |

Security values such as password rules, session length and lockout thresholds are owned by D08. File size and field length limits are owned by D05.

## Coverage of the D01 hand-off list

D01 listed 20 topics for this document. Each is answered below, with the open question it closes or leaves open.

| # | D01 topic | Rules | Status |
| --- | --- | --- | --- |
| 1 | Plans, prices and durations | BR-100 to BR-112 | Answered |
| 2 | Featured strip slots and behaviour when full | BR-225 to BR-234 | Answered, proposed (OQ-P06) |
| 3 | Ranking order and tie-breaks | BR-204 to BR-207 | Answered |
| 4 | Spotlight status names and moves | BR-120 to BR-130 | Answered |
| 5 | Payment reference format and matching | BR-140 to BR-145 | Answered |
| 6 | Receipts, wrong payments and refunds | BR-142 to BR-148 | Answered |
| 7 | Expiry timing, grace and renewal window | BR-160 to BR-165 | Answered |
| 8 | Renewing while live; paying for several periods | BR-102, BR-161, BR-162 | Answered, proposed (OQ-P07) |
| 9 | Star rules, device identity, thresholds, removal | BR-200 to BR-217 | Answered |
| 10 | Listing statuses for communities, events, opportunities | BR-001 to BR-008 | Answered |
| 11 | Verified badge criteria, renewal and loss | BR-030 to BR-038 | Answered |
| 12 | Event versus Opportunity | BR-050 to BR-054 | Answered, proposed (OQ-P10) |
| 13 | Rejection reasons and resubmission | BR-004, BR-021 | Answered |
| 14 | Duplicates and merging | BR-040, BR-041 | Answered |
| 15 | Reports, escalation and repeat offenders | BR-044 to BR-048 | Answered |
| 16 | Review turnaround and overdue | BR-015 | Answered, proposed (OQ-P16) |
| 17 | Stale listings and dead links | BR-060 to BR-062 | Answered |
| 18 | Announcement rules | BR-250 to BR-255 | Answered |
| 19 | Admin roles and permissions | BR-260 to BR-265 | Answered, proposed (OQ-P05) |
| 20 | Rules for non-ABU organisers and other universities | None yet | Open (OQ-B01) |

### Changes this document makes to D01 and D02

- The Spotlight status names in D01 and D02 are replaced by the seven in BR-120 to BR-130.
- Community Listing, Verified, Needs info, Hidden and Removed are the status and label names for listings, per BR-001 to BR-008 and BR-037.
- D02 shows Closes soon without a window; the window is BR-055. D02 shows a Paid listing label; BR-110 confirms it.
- D01 acceptance criteria AC-019, AC-020 and AC-025 are consistent with BR-124, BR-141 and BR-160.

## Open questions

| ID | Question | Default until answered |
| --- | --- | --- |
| OQ-B01 | May organisers outside ABU list communities, events or opportunities in version 1? | Only items open to ABU students, from any organiser; other universities wait for version 2 |
| OQ-B02 | Is a Featured slot cap of 6 right for the expected number of sellers? | 6 |
| OQ-B03 | Is auto-hiding after 3 reports from different devices acceptable, given students may abuse it against a rival? | On, with the admin reviewing first |
| OQ-B04 | Should a refund be given if the seller changes their mind before the listing is approved? | Yes, in full before approval |
| OQ-B05 | Who on the team takes the Finance role at launch? | Lead holds both until a second person is named |
| OQ-B06 | Are the proposed review target and overdue threshold realistic for the team's term-time workload? | 2 and 3 working days |
| OQ-B07 | Must tax or invoice documents be issued for Spotlight payments? | Not in version 1 (see OQ-P14) |

## Change log

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 0.1.0 | 2026-11-01 | Claude, for the Campusly team | First complete draft of all business rules and the settings register. Awaiting owner review. |


