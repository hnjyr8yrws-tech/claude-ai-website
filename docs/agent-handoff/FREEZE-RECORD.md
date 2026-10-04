# Freeze record — the September 2026 directory reconciliation

A tree hash cannot be stored inside the tree it describes, so it is recorded here, on the handoff
branch, outside the containment worktree.

**Frozen:** 4 October 2026 (Founder deliverable 2 — "update the AI tools")
**Branch:** `feat/kcsie-2026-containment` (uncommitted; **0 commits ahead** of `origin/main`)
**Base / merge-base:** `51d56c818fda9a6cde59c05e3b368896ecc7c2ab`

| | |
|---|---|
| **Frozen tree** | `89c4cba9dc7e82db7f58836b81ae86a19ae3865e` |
| Previous freezes | `51759cad1094d2e01464f41d1e49ae8a1208178c` (D3 complete) · `d83ac6d7dd9671a7c38aaa018570da2125623ea3` (D3 batches 1–2) · `1289c00a15378f511a2f069358fef024c5ed961f` (round-25 closeout) |
| **Patch** | `containment-directory-sep2026.patch`, SHA-256 `20e5538a09aea98fd38ca5db376ad8dc1fbc3340c2a15810f5b05c5fc31b57ae` (7,430,530 bytes), held at `~/Sites/kcsie-freeze-patches/` — outside any repository, per UOS §21 |
| Reproduction | **verified** — a clean `git clone` of `origin/main` at the merge base, plus the patch, yields the frozen tree **exactly** (throwaway clone at `/tmp/repro-dir`) |
| `refs/replace` | none |
| Commits ahead | **0** |
| `phase2c` seal | **34/34 OK**, 0 unsealed, rebuilt from the directory listing after the last edit |
| `phase2b` seal | **16/16 OK** |

## Assurance measured on these exact bytes

| Layer | Result |
|---|---|
| Typecheck / build | clean · build green, taxonomy audit **269 tools · 16 categories** |
| Tests | **99 / 99**, 17 rules, 203 reasoned allow entries |
| Mutants | **115 of 125 killed, 10 retired, 0 survived, 0 invalid, 0 not applied** — against a **proved-green baseline**, in a single run on these bytes |
| DOM / browser | **44 routes** (two never-scored tool pages added to the corpus deliberately), **0 problems, 0 missing required** |
| Capture freshness | proved before the check was trusted: the adjudicated never-scored sentence present on both new pages, `METHODOLOGY v` **0** on both, "Pending review" **0** across all 44 |
| Independent rescan | **865 rows**; of the **744** carrying a claim class, **540 gone / 204 remain**. All classes incl. benign C10/C16: **559 gone / 306 remain**. Re-derived, not carried forward |
| Sealed tuple baseline | **re-baselined 241 → 269**, prior 241 retained, with a new control **proving** the growth additive |

## What this freeze contains

**Founder deliverable 2.** The preserved Phase 2A worktree (tree `98b3e284…`) reconciled
**three-way against the base both branches share**, not by comparing working trees. That mattered:
containment had edited `desc` on 16 records (claim removals from round 25 / D3) and Phase 2A had
edited **nothing** on an existing record. Taking the researched array wholesale — the obvious move —
would have silently reverted sixteen adjudicated claim removals. Two branches differing is not two
branches disagreeing, and only the three-way comparison shows which.

Landed: **28 new records published** (directory 241 → 269), the controlled **capability axis**, the
**trust-safety facts module**, and 21 capability annotations plus 1 caveat on existing listings.
Eligibility was checked, not assumed: none of the 28 is in `researchHold.ts`, none is one of the ten
child-safety withdrawals, none is on the Phase 2A watchlist.

**The never-scored presentation**, per the Founder's direction of 4 October: no score or status
badge, and `NEVER_SCORED_STATEMENT` where explanatory text is needed. No state name was added,
renamed or retired; held and withdrawn wordings are untouched. The Pillar Card does not render for a
never-scored tool — it is the score artefact, and an empty one implies a review in progress.

## Two defects found by the harnesses, both of a kind this programme keeps meeting

**1. A dormant branch is not a contained one.** The Pillar Card's `provisional` arm carried a
comment reading *"no version is published while provenance is held — unreachable today (no tool is
Provisional)"* and then published `METHODOLOGY v2.2 · PROVISIONAL`. The comment asserted a
containment the code did not implement, and nothing challenged it for 25 rounds because the branch
was unreachable. The 28 additions made it live and it began stating a methodology version for tools
that have never been reviewed — fabricated provenance. **Found by the DOM harness**, which the
source scan could not have caught, because the mark is composed inside a component.

**2. A fall-through state hides the fault it causes.** The alternatives list derived two booleans
from the authoritative state and treated "neither set" as a case. Mutant **M72 survived** the first
pack: with `altWithdrawn: false`, the old three-arm ternary *mislabelled* a child-safety withdrawal
as "Pending review" (caught), while the two-arm guard written for the never-scored treatment made it
render **nothing at all** — the disclosure vanished. A visible fault had been replaced with an
invisible one, on a safeguarding disclosure. Every control asked whether a label was *wrong*; none
asked whether a label was *there*.

Both are fixed structurally: the state now travels as itself and is handled exhaustively through a
lookup table, and a new control asserts **presence**. M72 was re-anchored to the new shape and its
kill demonstrated directly before the pack confirmed it.

## Two process notes, recorded because both cost time

The pack **refused to run twice**: the figures control was red because the record claimed a tally
the artefact did not yet support. Its abort is exact — *"pre-existing failure and SURVIVED could not
occur."* A pack run against a red baseline cannot distinguish a mutant it killed from a test that
was already failing, so every figure it produces is unreadable. The baseline was greened by setting
the record to what the artefact **actually said**, and the final figures come from a run against a
proved-green baseline. Same class as round 25's stale DOM captures: **never trust an artefact
without first proving it describes the bytes in front of you.**

`M30` lost its anchor to a refactor and was caught by the pre-flight **before** the pack ran. The
run was stopped rather than allowed to report a "not applied", and the tree was checked for a
left-behind mutation before restarting — killing a pack mid-run can leave one mutation on disk.

## Still open

D3 decision 10 (NEEDS EVIDENCE) needs the live n8n/Luna grounding, which is outside this repository
— the §8 item 6 deployment gate, the same dependency as D5. Deliverables 1, 3, 4 and 5 remain:
KCSIE 2026 currentness; confirming Equipment, Prompts and affiliate surfaces are fully removed;
repairing every surface those removals touched; and the design update under adopted Brand World
authority only. **Safe Mode is Charles's.**
