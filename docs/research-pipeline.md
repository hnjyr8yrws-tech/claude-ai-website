# Research pipeline — Sunday Research → Verification → Master Database → Website

**Internal. Not published.** Nothing in this workflow — and in particular nothing
commercial — reaches a public surface.

## Why this exists

The September 2026 reconciliation found **22 tool-type discoveries that never
reached the Master Database**, including the strongest find of the whole
programme (Sendix, logged "Review immediately", High priority) and a major UK AI
education company (Third Space Learning / Skye).

One cause: the Sunday log records a **suggested action** and nothing records
whether it was **taken**. A row with `Suggested Directory Action = "Add"` and no
follow-up is indistinguishable from a row that was added. So the queue silently
grew.

A second cause: **12 of the 66 entries had no Source URL.** Roughly half of those
proved unresolvable — and two were terminology collisions, where a name meant
something entirely different from what the research assumed ("Project Auron" was
an enterprise sales platform; "executive function" was an AI-architecture term,
not the SEND concept).

## Required columns — Sunday research log

Capture at discovery, not later.

| Column | Rule |
|---|---|
| `Update Date` | Date of discovery. |
| `Tool / Development` | As the vendor writes it. |
| `Source URL` | **Mandatory.** A discovery with no URL cannot be verified later. |
| `Type` | New tool / Product update / Policy / Category. |
| `Suggested Directory Action` | The recommendation at discovery. |
| `Disposition` | ADD / UPDATE / EMERGING / WATCH / REJECT / INSUFFICIENT / UNVERIFIED. |
| `Actioned Date` | **Blank means OPEN.** Set when the disposition is carried out. |
| `Master DB Row` | Explicit close-out link. |
| `Verified By` | Who verified. |
| `Verified Date` | When. **Never inherited from the workbook's save date.** |

### `INSUFFICIENT` vs `UNVERIFIED`

Not interchangeable.

- **`UNVERIFIED`** — nobody has looked yet. The work is outstanding.
- **`INSUFFICIENT`** — it was researched and the evidence was genuinely
  inadequate. The work is done; the answer is "not enough to publish".

Recording the first as the second hides an open queue behind a finished-looking
label. There should be **no `UNVERIFIED` rows** at the end of a research cycle.

## Gates

1. No row leaves the log without a `Disposition`.
2. Nothing enters the Master Database without `Source URL` **and** `Verified Date`.
3. Nothing reaches the website without passing the **withdrawal filter**
   (`WITHDRAWN_AWAITING_REREVIEW`, enforced by
   `src/data/withdrawalProtection.test.ts`).
4. `Last Checked` travels with the record and is **never** overwritten by a
   workbook save. A workbook updated in September does not make a tool
   September-verified — in V5, 116 of 130 records were last checked on
   2026-03-31 while the workbook header read 2026-09-20.

## Weekly reconciliation

> Rows where `Disposition` is set and `Actioned Date` is blank.

At the start of this cycle that query returned **22**.

## Verification standard

Prefer, in order: first-party product documentation and privacy/security pages;
official government and public-sector sources (DfE, Ofqual, JCQ, ICO, Jisc);
recognised education bodies. Vendor comparison and review sites are **not**
authoritative — the KCSIE comparison that reached the Phase 1B draft came from
one, and did not survive checking.

Missing evidence stays `Needs verification`. Never inferred from marketing
language: "enterprise grade", "GDPR ready" and "safe for schools" are not
evidence of hosting region, retention, training-data policy or child safety.

**Never publish** "KCSIE approved" or "KCSIE compliant" as a product property.
KCSIE places duties on schools — an annual documented review, a named senior
leader responsible. No product certification exists. A tool may help a school
*evidence* its duties; that is a school-level judgement.

There is also no ready-to-adopt official DfE AI policy template pack for England.

## Commercial data stays internal

`Monetisation Route`, `Affiliate Link`, `Partner Contact`, the outreach log and
the Do Not Contact list are internal metadata. They must not appear on a public
surface, and must not cross into the Member Portal, which has no vendor-facing
surface at all.
