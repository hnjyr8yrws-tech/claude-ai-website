# Freeze record — the D3 adjudication applied in full

A tree hash cannot be stored inside the tree it describes, so it is recorded here, on the handoff
branch, outside the containment worktree.

**Frozen:** 4 October 2026 (all 19 D3 decisions adjudicated; the eight requiring work applied)
**Branch:** `feat/kcsie-2026-containment` (uncommitted; **0 commits ahead** of `origin/main`)
**Base / merge-base:** `51d56c818fda9a6cde59c05e3b368896ecc7c2ab`

| | |
|---|---|
| **Frozen tree** | `51759cad1094d2e01464f41d1e49ae8a1208178c` |
| Previous freezes | `d83ac6d7dd9671a7c38aaa018570da2125623ea3` (D3 batches 1–2) · `4a6dc3337a3d54ff6bc71bbf818321c852dffc0f` (D3 batch 1) · `1289c00a15378f511a2f069358fef024c5ed961f` (round-25 closeout) |
| **Patch** | `containment-d3-final.patch`, SHA-256 `a340a4456ca0b635bdfaaeb770cf47d8f96aa7dc06b1f9e7b55a8eda8d9c7d4f` (7,311,461 bytes), held at `~/Sites/kcsie-freeze-patches/` — outside any repository, per UOS §21 |
| Reproduction | **verified** — a clean `git clone` of `origin/main` at the merge base, plus the patch, yields the frozen tree **exactly**. Done in a throwaway clone at `/tmp/repro-d3`, not by excluding `.git` from a copy |
| `refs/replace` | none |
| Commits ahead | **0** |
| `phase2c` seal | **34/34 OK**, 0 unsealed, rebuilt from the directory listing and re-verified after the last edit |
| `phase2b` seal | **16/16 OK** |

## Assurance measured on these exact bytes

| Layer | Result |
|---|---|
| Typecheck | clean |
| Build | **green — and it had not been.** `prebuild` gated on `scripts/audit-prompts.mjs`, which reads `src/data/prompts.ts`, deleted with the prompt packs on 30 September. `npm run build` had been exiting 1 before compiling anything ever since. See "What this freeze fixes that was not asked for" |
| Tests | **96 / 96**, 17 rules, **200 reasoned allow entries** (was 215) |
| Mutants | **115 of 125 killed, 10 retired, 0 survived, 0 invalid, 0 not applied** — against a proved-green baseline, in a single run on these bytes. Every figure in this row came from the pack; none from demonstration |
| DOM / browser | **42 routes**, **0 problems, 0 missing required** |
| Capture freshness | **proved before the check was trusted**: 26 captures carry the adjudicated holding sentence, 10 carry the decision-4 card caption, and **0 of 42** still carry the withdrawn mechanics. This step exists because headless Chrome once died overnight and the check read the previous day's corpus while reporting "0 problems" |
| DOM blind spot | **0 claim-class hits across 0 routes** — empty because the surface is gone, and the transcript says so in words |
| Independent rescan | **857 rows**; of the **742** carrying a claim class, **539 gone / 203 remain**. All classes including the benign C10/C16: **558 gone / 299 remain**. Re-derived from the register on this run, not carried forward (it was 858 / 743 / 536 / 207) |
| **Measured reach** | **3 of 15** — unchanged, and still published rather than withdrawn |

**The pack ran once, on these bytes, with nothing outstanding.** The previous cycle recorded one
mutant (M61) as *not applied*, with its kill demonstrated by hand. That gap is closed: seven mutants
whose anchors the D3 wording moved were **re-anchored before the run**, so all 125 either killed or
are deliberately retired with the surface they tested. Nothing in this row is a demonstration
standing in for a measurement.

## What changed in the tree

All 19 grouped D3 decisions were adjudicated by the Founder on 3 October — **10 KEEP, 6 CHANGE,
2 REMOVE, 1 NEEDS EVIDENCE**. The full account is `containment-record.md` §29. In summary:

- **Decision 1** — the holding wording is standardised to *"Score held pending re-review. No
  current score or pillar value is shown."* at **22 sites**, including both central constants, the
  Luna grounding and the transactional emails.
- **Decisions 11 and 18** — the composite mechanics, the weighting, the safeguarding-and-privacy
  floor, the band thresholds and the band names are gone from public copy. `BANDS` is retained
  unused so the historical definitions survive for whoever settles the new model.
- **Decisions 4, 8, 9, 14, 17** — applied as adjudicated. The Pillar Card carries the hold in words
  in the held state and is otherwise untouched: the instruction was not to redesign it beyond the
  holding presentation, and the authoritative basis for a redesign is still unresolved.
- **Decision 10** (NEEDS EVIDENCE) stays open. It needs the live n8n/Luna grounding, which is
  outside this repository — the §8 item 6 deployment gate, the same dependency as D5.

Every decision was written back to all 70 pack items it covered (`WRITE-BACK-MAP.json`), so
item-level traceability survives the grouping.

## Two defects this freeze fixes that were not asked for

**1. The build had been broken for four days.** The `prebuild` gate ran an audit script against a
data file the 30 September scope reset deleted, so the build failed before compiling. The gate and
the orphaned script are removed, and the dead `PROMPT_CATEGORIES` taxonomy that mirrored the same
file went with them — nothing imported it. This is the round-25 lesson repeating: **removing a
feature falsifies the things that describe it.**

**2. Decision 11 was half-applied on the first pass.** The prose paragraph came out; the same claims
stayed live in the `STEPS` list and the five-pillars paragraph on the same page. A sweep for the
mechanics language found them. A claim removal applied to one instance of the claim is not applied,
and the sweep is now the standing step before any removal is called done.

## Scope recorded rather than assumed

Decision 1 said "standardise the holding wording". Three classes were deliberately **not** rewritten
to it — the withdrawn state, the governed state vocabulary, and the historical changelog. Each is
set out with its reason in **`D3-CARVE-OUTS.md`**, and each wants a Founder yes or no. Disclosure was
not reduced anywhere: where a surface said more than the standard sentence, the standard sentence
leads and the disclosure is kept.

## The allowlists, in both harnesses

The two harnesses share their class patterns but keep separate allowlists, so both were reconciled.

| | Source scan | DOM scan |
|---|---|---|
| Deleted | 13 | 12 |
| Re-keyed | 6 | 5 |
| Added | 3 | 2 |
| Required strings re-pointed | — | 1 |
| Net | **215 → 200** | — |

Nothing was widened. Where the Founder's sentence left a pillar-structure sentence unqualified in
its own right, that is recorded as a **named allow** — visible and reviewed — rather than fixed by
loosening the rule for every line at once. **The adjudicated wording was not reworded to suit a
detector.** Two copy lines *were* adjusted, for a different reason: the qualifier sat behind a
relative pronoun or a subordinator, which the round-17 clause bound correctly refuses to count.

One mechanism, stated plainly because it is not obvious from the field name: **an `onLine` allow
excuses only the matches inside its own matched span.** Three new entries stopped short of the token
the rule flags and silently excused nothing. The dead-allow control caught all three.
