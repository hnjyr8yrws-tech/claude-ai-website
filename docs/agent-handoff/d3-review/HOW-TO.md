# D3 — how to do this review

**What you are being asked to do.** Read the claims GetPromptly makes on its own rendered pages and
say, for each one, whether it can stand. Nothing else. You will not need to open any code, look up a
file, or reconstruct any evidence — every claim is quoted as a visitor sees it, with a note on why it
is flagged and what it should be checked against.

**Why it is you and not the harness.** The automated scan's measured reach is **6 of 15**: of fifteen
ordinary British phrasings of a review-practice claim planted on `/tools`, it catches six. In round
21 a reviewer who simply read the site found **nine live false claims in the shipped bundle** that
twenty-one rounds of pattern work had missed — including `/methodology` telling schools that ten
tools were *"re-reviewed against the current safeguarding criteria"* two sections below its own
notice that those criteria are unsettled. This control exists because pattern matching cannot do it.

---

## The four answers

For each claim, write one:

| | Means | Use it when |
|---|---|---|
| **KEEP** | True and supportable as written | You would be content for a DSL to read it and act on it |
| **CHANGE** | True in substance, wrong as written | Overstated, ambiguous, or implies more than is known — write what it should say |
| **REMOVE** | Not supportable | Withdraw it; there is no version of this that stands today |
| **NEEDS EVIDENCE** | Might be true | Name the evidence that would settle it and who holds it |

**Being listed is not an accusation.** Recall was deliberately favoured over precision: a claim
wrongly surfaced costs you one KEEP; a claim missed is the failure this control exists to catch. Most
of Tier 2 will be KEEP.

---

## Where to start, and how far to go

**Tier 1 — batches 01 to 08, 96 claims.** Safety and approval assertions, review practices, named
reviewers, cadences, universal coverage claims, independence claims. These are the ones where a
wrong claim changes what a school decides. **If you do nothing else, do these.**

**Tier 2 — the rest.** Descriptive copy about the score system, KCSIE references, and the
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

Your decisions are recorded in the containment record as the D3 adjudication, with the frozen tree
hash they were made against, so it is always clear which bytes were reviewed.

---

## One thing this pack does not cover

The **prompt modal** (the panel that opens when you click a prompt, containing the paywall copy) is
not in the captured corpus: the capture probe cannot open it headlessly, and rather than pretend
otherwise the probe now fails loudly. Its copy — *"£5.99/month unlocks the full prompt library"* —
has already been corrected from *"500+ reviewed prompts"*, but the surface as a whole has not been
read. It is listed in the pack index as an uncovered surface for that reason.
