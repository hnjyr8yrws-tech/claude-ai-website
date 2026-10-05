# Freeze record — the October 2026 tool-drop delta

A tree hash cannot be stored inside the tree it describes, so it is recorded here, on the handoff
branch, outside the containment worktree.

**Frozen:** 5 October 2026 (one bounded six-item delta)
**Branch:** `feat/kcsie-2026-containment` (uncommitted; **0 commits ahead** of `origin/main`)
**Base / merge-base:** `51d56c818fda9a6cde59c05e3b368896ecc7c2ab`

| | |
|---|---|
| **Frozen tree** | `b05c35d0efab1aa0299d9652532026a6fe46f2ab` |
| **PUBLIC TOOL COUNT** | **270** (269 + Chalk) |
| Previous freezes | `a5249b29…` (surface repair) · `89c4cba9…` (directory reconciled) · `51759cad…` (D3 complete) · `1289c00a…` (round-25 closeout) |
| **Patch** | `containment-oct-delta.patch`, SHA-256 `cfab52fcf22a0d8cd0bb30d3346c476e49dab7454fbdb0ffe6f25d67c10aab09` (7,472,581 bytes), at `~/Sites/kcsie-freeze-patches/` |
| Reproduction | **verified** — clean clone of `origin/main` at the merge base + patch yields the frozen tree **exactly** (`/tmp/repro-delta`) |
| `refs/replace` | none · Commits ahead **0** |
| Seals | `phase2c` **34/34 OK** · `phase2b` **16/16 OK** |

## Assurance on these exact bytes

| Layer | Result |
|---|---|
| Typecheck / build | clean · green, **270 tools · 16 categories** |
| Tests | **109 / 109** (20 pre-existing + 79 containment + 5 site-integrity + **5 new research-watch**) |
| Mutants | **115 of 125 killed, 10 retired, 0 survived, 0 invalid, 0 not applied** — proved-green baseline |
| DOM / browser | **45 routes** (Chalk's page added deliberately), **0 problems, 0 missing required** |
| Capture freshness | proved first: Chalk's page carries the never-scored sentence, `METHODOLOGY v` **0** on it, "Pending review" **0** across all 45, and **Verenigma and Sanna appear in none of the 45** |
| Independent rescan | **866 rows**; **540 gone / 204 remain** of 744 claim-class |
| Tuple baseline | **241 → 270**, prior 241 retained, additive control still proving every one byte-identical |

## The six dispositions

| Item | Disposition |
|---|---|
| **Chalk** | **PUBLISHED** as a never-scored listing |
| **Trellis Education** | existing record **updated** — no duplicate |
| **Khanmigo** | existing record **updated** (description + sources only); score/held state untouched |
| **Sanna (Sanoma Learning)** | **RESEARCH HOLD** — not published |
| **Verenigma** | **SAFEGUARDING WATCH** — not published |
| **AdaptED Stories** | **EMERGING** — not published |

Each was checked against the directory, `researchHold.ts` and the historic records first. Trellis
and Khanmigo existed; the other four did not.

## A name collision that would have produced the wrong listing

"Chalk" resolves to **three** different things: a London non-profit building AI-assisted accessible
visuals for SEND; **Chalkie**, an unrelated AI lesson-planning product; and **Chalk Education**, a
UK SEND *recruitment agency* that is not a tool. Only the first matches the scan's description.
"Check whether the item already exists" has a mirror image worth stating: check that the item you
found is the item you were sent.

## What the evidence supported — and what was dropped

**Chalk, published with its limits stated.** Verified from the vendor's own pages: free, teacher
facing, no pupil accounts described, symbol-supported and visual access tooling, ~20 resource types,
UK team. **Not** established: GCSE relevance — the vendor never mentions it, so **the scan's GCSE
line was not carried** — pilot status, institutional pricing, and **any published pupil-data
position**. `ukReady` is therefore `'Needs verification'`, not `'Partial'`: the vocabulary reserves
`'Partial'` for evidenced-with-a-limitation, and this is unestablished. In the vendor's favour, and
unusual: **their own pages publish the limits of their evidence** — smaller and less certain effects
for pupils with learning difficulties and for EAL learners.

**Trellis, refreshed from the vendor's own site** — SEND/ASN minutes and support plans;
human-in-command, in their words *"no document is ever 'final' until a human reviews, edits, and
approves it"*; seven named Scottish councils and six English MATs across 100+ schools; ISO 27001 and
Cyber Essentials; Azure UK South; recording only *"with permission from everyone in the room"*.

**A third-party claim was dropped.** A write-up stated Trellis is **free to Scottish councils**. The
vendor publishes **no pricing at all** and does not say this, so it is not asserted: `free` stays
`false` and the caveat records that pricing is unpublished. A secondary source is not evidence for a
commercial claim a school would act on.

**Khanmigo — description and sources only.** Verified from Khan Academy's and Google's own blogs:
Gemini-generated interactive maths and science diagrams a pupil can manipulate, and AI-drafted
practice a teacher reviews and edits before pupils see it. **Score and held-state untouched**, as
directed — and **no `verifiedDate` was added**, because this record's score is HELD and a
verification date on it would invite the review provenance the containment withdrew.

**Sanna — the evidence points away from the UK.** Launched by Sanoma Learning on 1 October 2026 as a
30-day trial in seven **named** markets: the Netherlands, Spain, Italy, Poland, Belgium, Finland and
Sweden. **The United Kingdom is not among them**, so UK availability is not merely unverified — the
announcement excludes it. Listing it would recommend a product a UK school cannot procure.

## Verenigma — not listed, and not an agent's decision to list

The scan's claims are confirmed by the vendor's own site: AI voice analysis assessing *"realtime
levels of stress, anxiety and depression"*; a 10–20 second voice note from each pupil on arrival and
another on leaving, **twice every school day**; output that *"automatically translates into a full
picture of their progress and emotional state to meet the requirements of EHCP reporting"*.

**The decisive finding is evidential.** Verenigma cites research on **implicit affect labelling with
cognitive reappraisal**, and a 59-user ADHD study reporting improved emotional regulation. That is
evidence for the **intervention** — that naming an emotion can aid self-regulation. It is **not**
evidence that inferring depression and anxiety from a child's voice is accurate. The measurement is
the claim the EHCP reporting rests on, and it is the claim not evidenced.

Also unestablished: any medical-device or MHRA position, although the product infers named
mental-health conditions; peer review of its own inference accuracy; and every lawful-basis detail
that systematic biometric capture from identifiable children would require — Article 9 condition,
DPIA, processing location, retention, parental consent. *"Verenigma is GDPR compliant"* is a bare
vendor assertion, which the `trustSafety.ts` standard maps to **Needs verification**, not Yes.

An EHCP is a statutory document. Automated inference entering one engages Article 22 and displaces
professional judgement. It stays unlisted until an evidence review expressly decides otherwise.

**AdaptED Stories** is an arXiv paper (2609.24245) describing the *design* of a practitioner-guided
Social Stories system, evaluated with **seven** practitioners. No vendor, price, availability or
support — an emerging category, not a product.

## Where the three unlisted items live

`src/data/researchWatch.ts`. Each entry records what the evidence **does** establish, what it does
**not** — absences written down, never inferred away — the questions a later review must answer, and
its sources. Deliberately **not** the never-scored mechanism: a never-scored tool is published
without a score; these are not published at all, for a stated reason.

`researchWatch.test.ts` (5 tests) proves none reaches the directory by name or slug, that every
entry carries verified facts, recorded gaps, a dated decision and URL sources, and that a
safeguarding watch states more than two concerns — a bare "no" is unreviewable. Proved by publishing
Verenigma and watching the control name it.

## Stopped here, as instructed

**The tool drop is CLOSED. The website design update has NOT been started.** The project is at the
**Brand-document fine-tuning checkpoint**: Charlie is refining the new Brand document with ChatGPT
before any layout or design work begins.

Still open: D3 decision 10 needs the live n8n/Luna grounding (§8 item 6, same dependency as D5).
`Training.tsx` and `GuidesSection.tsx` remain unrouted orphans holding placeholder links and a
"Prompt Pack (£9.99)" offer — recorded, not actioned, because Training is on HOLD.
**Safe Mode remains Charles's workstream.**
