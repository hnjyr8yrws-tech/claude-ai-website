# D3 — how to do this review

**What you are being asked to do.** Read the claims GetPromptly makes on its own rendered pages and
say, for each one, whether it can stand. Nothing else. You will not need to open any code, look up a
file, or reconstruct any evidence — every claim is quoted as a visitor sees it, with a note on why it
is flagged and what it should be checked against.

**Why it is you and not the harness.** In round 21 a reviewer who simply read the site found **nine
live false claims in the shipped bundle** that twenty rounds of pattern work had missed — including
`/methodology` telling schools that ten tools were *"re-reviewed against the current safeguarding
criteria"* two sections below its own notice that those criteria are unsettled. This control exists
because pattern matching cannot do it.

The automated scan's reach was last measured at 6 of 15 ordinary phrasings — but that was on the
**pre-reduction** corpus, and it is **not** quoted as current here. Reach is a property of the whole
scanned tree, and the tree lost a quarter of its files on 30 September. It will be re-measured after
this review.

---

## This pack was rebuilt after the round-25 repairs

The earlier pack was generated before two fresh reviewers' findings were fixed, so it quoted about sixty claims that no longer exist. It has been regenerated from the frozen bytes (`1289c00a15378f511a2f069358fef024c5ed961f`), so nothing here asks you to adjudicate wording that has already been corrected or removed. Your earlier answers are carried: 25 items arrive pre-filled, and 23 of your earlier decisions are recorded as resolved by removal.

## The four answers

For each claim, write one:

| | Means | Use it when |
|---|---|---|
| **KEEP** | True and supportable as written | You would be content for a DSL to read it and act on it |
| **CHANGE** | True in substance, wrong as written | Overstated, ambiguous, or implies more than is known — write what it should say |
| **REMOVE** | Not supportable | Withdraw it; there is no version of this that stands today |
| **NEEDS EVIDENCE** | Might be true | Name the evidence that would settle it and who holds it |

**Being listed is not an accusation.** Recall was deliberately favoured over precision: a claim
wrongly surfaced costs you one KEEP; a claim missed is the failure this control exists to catch.

---

## What you have already decided

**25 items arrive pre-filled** with your answers from the first pack, each marked with the date and
the batch it came from. You need not touch them. Two of them merge a pair of your earlier
decisions; where those agreed the answer is carried, and **where they differed nothing has been
chosen for you** — the item asks you to confirm which applies.

A further **23** of your earlier decisions are recorded as **resolved by removal**: their surfaces
left product scope on 30 September, so the claim no longer exists and is not put back to you.
`CARRIED-FORWARD.md` lists all 48 and says which of the three things happened to each.

**That leaves 95 open.**

---

## Where to start, and how far to go

**Tier 1 — batches 01 to 06.** Safety and approval assertions, review practices, named reviewers,
cadences, universal coverage claims, independence claims. These are the ones where a wrong claim
changes what a school decides. **If you do nothing else, do these.**

**Tier 2 — batches 07 to 11.** Descriptive copy about the score system, KCSIE references, and the
containment's own holding statements. Worth reading — the holding statements are GetPromptly
speaking about its own limits, and their wording matters — but a wrong one here misleads far less.

A batch is about 12 claims. You can stop at any batch boundary and resume; nothing depends on
finishing in one sitting.

---

## The three facts behind most of the flags

You will see these cited repeatedly. In plain terms:

1. **No score on the site has a recorded basis.** Phase 2B examined all 252 stored rows: **0** record
   a Review Basis. The reviewer initials and methodology version that used to appear were build
   constants — the same two values compiled in for every tool, not a record of who reviewed what.
2. **No re-review is happening.** Calibration is blocked because the consolidated Methodology v2.2
   Standard text cannot be found in any governed store (`GOV-GAP-001`). So any claim of a current,
   recurring or in-progress review is unsupported today.
3. **KCSIE 2026 has been in force since 1 September 2026.** KCSIE 2025 may appear only as dated
   history. No tool may be presented as reviewed against either edition, and "KCSIE compliant" is
   never said of a third-party tool — "KCSIE-aware" is the approved form.

---

## What happens to your answers

- **REMOVE** and **CHANGE** become containment edits, applied and proved like the rest of this work.
- **NEEDS EVIDENCE** becomes a named evidence request against the surface, recorded as open.
- **KEEP** is recorded as adjudicated, which is what closes D3 — the point is a human decision on
  each surface, not the absence of findings.

Your decisions are recorded in the containment record as the D3 adjudication, against frozen tree
`1289c00a15378f511a2f069358fef024c5ed961f`, so it is always clear which bytes were reviewed.

---

## What this pack covers, and what it does not

**Covers** all 41 rendered surfaces of the retained product: every public route, plus the Luna panel
opened on seven of them and the lead-capture modal on two. The prompt modal — the one surface no DOM
figure ever covered, because the probe could not open it headlessly — **no longer exists**: the
component was deleted on 30 September. That gap closed by removal, not by proof.

**Does not cover** the one developer route (`/dev/trust`), which is not public, and **Luna's live
answers**. Luna's grounding lives in n8n, outside this repository. Round 24 rewrote the grounding
sources here, but nothing reaches a visitor until someone deploys them. The starter questions and
panel copy in this pack are what the page renders; the answers Luna actually gives are not in scope
for this review and have their own open decision (D5).
