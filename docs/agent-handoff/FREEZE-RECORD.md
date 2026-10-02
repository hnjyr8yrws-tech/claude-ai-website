# Freeze record — round 25 closeout, then D3 batch 1 applied

A tree hash cannot be stored inside the tree it describes, so it is recorded here, on the handoff
branch, outside the containment worktree.

**Frozen:** 2 October 2026 (D3 batch 1 applied on top of the round-25 closeout)
**Branch:** `feat/kcsie-2026-containment` (uncommitted; **0 commits ahead** of `origin/main`)
**Base / merge-base:** `51d56c818fda9a6cde59c05e3b368896ecc7c2ab`

| | |
|---|---|
| **Frozen tree** | `4a6dc3337a3d54ff6bc71bbf818321c852dffc0f` |
| Previous freeze | `1289c00a15378f511a2f069358fef024c5ed961f` — the round-25 closeout, superseded by the D3 changes below |
| **Patch** | `containment-d3b1.patch`, SHA-256 `ac989dc8c66669ee8eb78fd573fb10e2f08172964598d1a214f85e9db060aab1` |
| Reproduction | **verified** — a clean worktree at `origin/main` plus the patch yields the frozen tree exactly |
| `refs/replace` | none |
| Commits ahead | **0** |
| `phase2c` seal | **34/34 OK**, 0 unsealed, rebuilt from the directory listing |
| `phase2b` seal | **16/16 OK** |

## Assurance measured on these exact bytes

| Layer | Result |
|---|---|
| Typecheck / build | clean |
| Tests | **96 / 96**, 17 rules |
| Mutants | **114 of 125 killed, 10 retired, 0 survived, 0 invalid, 1 not applied**, against a proved-green baseline. The one not applied is **M61**, whose anchor was the Home-page line that D3 **03.7** rewrote. It was re-anchored to the adjudicated wording afterwards and **its kill was verified by direct demonstration** — the mutation was applied by hand and the suite went red naming the claim rule. A full re-run for a definition-only change would have cost another cycle for no new information; the record says which figure came from the pack and which from demonstration |
| DOM / browser | **42 routes**, **0 problems, 0 missing required**, 244 reasoned allowed hits |
| DOM blind spot | **0 claim-class hits across 0 routes** — empty because the surface is gone, and the transcript says so in words |
| Independent rescan | **857 rows**; of the 743 carrying a claim class, **535 gone / 208 remain**. All classes including the benign C10/C16: 553 gone / 304 remain |
| **Measured reach** | **3 of 15** — published, not withdrawn |

**On running the pack once.** During the round-25 closeout an earlier run was stopped and discarded
because a late repair (three hard-coded training counts) had made it one edit stale: a mutant pack
is only valid for the bytes it ran against. The same discipline is applied here with one stated
exception — M61's re-anchor is a change to a mutant *definition*, not to the product, so its kill
was demonstrated directly rather than by a further 25-minute cycle. Which figure came from the pack
and which from demonstration is stated in the table above.

## What this tree contains

The KCSIE 2026 containment, the round-24 product scope reduction (Equipment, the Prompts library and
all affiliate links removed; Training untouched and on HOLD apart from its affiliate links), the
round-25 repairs from two fresh reviewers (~60 findings), and the three BLOCKER fixes below.

### The three blockers, each proved by replaying the reviewer's own exploit

1. **`/*` in ordinary copy blinded every rule and the score-store choke point.** Two characters of
   JSX prose opened a block comment and deleted every following line from all 17 rules until the
   next `*/`. Behind it a reviewer shipped a sentence that was at once "KCSIE compliant", a
   certification claim, a named-reviewer cadence claim and adoption wording; imported the score
   store into a non-adapter page; and published **all 241 held composites** as `data-` attributes —
   at 96/96 green, build clean. *Fixed:* an opener must look like a comment (`/*` at line start, or
   `{/*`); a mid-line `/*` now fails **open**, so lines are scanned rather than skipped. Plus a
   coverage floor on **lines** (20,000; measured 20,841), because a nine-line blackout left the file
   count untouched. *Proved:* the planted claim trips two rules; the choke point fires on the import.
2. **The bridge control enumerated three spellings of its own target.** `[\w\W]*` walked past it and
   widened two live anchors. *Fixed:* it now measures behaviour — splice a planted sentence at
   **every position** inside each anchor's matched span and fail if the match still swallows it.
   *Proved:* caught, with the offending offset named.
3. **`git` was resolved from `PATH`, with `node_modules/.bin` ahead of `/usr/bin`.** A nine-line
   shim let a stored safeguarding score be rewritten 9.5 → 2.0 at 96/96, breaking no seal because
   `node_modules` is gitignored. *Fixed:* the load-bearing comparison runs **no subprocess** — the
   baseline hashes and all 241 safety/tier tuples live in `phase2c/baseline-manifest.json`, sealed
   by `SHA256SUMS.txt`. *Proved:* with the shim first on `PATH` and the score tampered, it fails.

**M125 survived twice before it died, and both failures were mine.** First the guard was a
source-text check that matched its own assertion; then an identity check on the *accessor*, which
stays true when the mutation edits the call site instead. The assertion now sits on the variable the
test actually compares. A guard adjacent to the thing it protects is not a guard.

## How to reproduce the tree hash

```sh
cd ~/Sites/claude-ai-website-kcsie-containment
GIT_INDEX_FILE=/tmp/idx git read-tree 51d56c818fda9a6cde59c05e3b368896ecc7c2ab   # the MERGE BASE, never HEAD
GIT_INDEX_FILE=/tmp/idx git add -A . 2>/dev/null
GIT_INDEX_FILE=/tmp/idx git write-tree          # → 4a6dc3337a3d54ff6bc71bbf818321c852dffc0f
git rev-list --count origin/main..HEAD          # → 0
git for-each-ref refs/replace                   # → empty
```

Seeding from `HEAD` makes the hash a function of HEAD as well as of the files, because
`.claude/worktrees/cranky-kalam` is a tracked gitlink over an empty directory. Two reviewers missed
an accidental commit that way. Seed from the merge base and assert `0` commits ahead separately.

## Handing this to a reviewer

Do **not** copy the worktree. Round 25 established a better method and it should be reused: clone
`origin/main` from GitHub and apply the patch. The clone's `.git` points at GitHub, so a reviewer
cannot reach the author's branch — which closes the hole that put commit `0ea0b24` (author
`r <r@r.local>`) on the containment branch on 23 September — and, unlike `--exclude .git`, it leaves
the baseline controls able to run. Both round-25 reviewers' trees reproduced this method and ran
96/96. Give each reviewer its own scratch root, and `cp -RL node_modules` rather than a symlink.

## Nothing in this tree is knowingly unfinished

The open items are governance decisions, not engineering work. See `CURRENT-STATE.md` §6 and
`DECISIONS-NEEDED.md`. In particular **no score or Pillar Card redesign has been attempted**: the
authoritative basis is unresolved (Brand World v2.1's text is not in the supplied pack, and UOS
§24.5 records FD-01's published wording as outstanding), and the Founder has directed that it waits.

---

## D3 batch 1 — the Founder's adjudications, as executed

Twelve of the thirteen open items in batches 01–03 were adjudicated on 1 October. `03.4` was left
open deliberately and is untouched.

**CHANGE × 4, applied and verified in the rendered DOM** (not merely in source):

| Item | Surface | Now reads |
|---|---|---|
| `02.2` | `/safety-methodology` | "The methodology, as designed · **How the Promptly Score methodology is designed to work.**" |
| `03.3` | `/ai-training/teachers` | "**Teacher resources** · Resources tagged for teachers" — "All" and "Every" removed |
| `03.7` | `/` | "AI tools and training for UK education **· No paid placements.** Scores are held pending re-review." |
| `03.12` | `/ai-training` | "**No paid placements**; some government-backed" — the derived counts kept (76 / 57 / 6 / 27) |

**KEEP × 7** — the footer independence wording stands on all 41 surfaces. The Founder's note that
stale surrounding counts are "factual repairs, not part of this KEEP decision" is why the last three
hard-coded `26` values were derived from the dataset before this freeze.

**NEEDS EVIDENCE × 1 — `01.12`, the Luna logging disclosure.** The notice is **left in place pending
evidence**, and that was the agent's judgement, not the Founder's instruction: a notice warning of
logging errs toward over-disclosure, whereas withdrawing it would leave logging undisclosed if it
does occur. It is flagged for the Founder to reverse. The evidence required — the live Luna/n8n
logging and retention behaviour — is the **same dependency as D5**, so one piece of evidence settles
both.

**Three allowlist entries were re-keyed to the adjudicated wording** — two in the source harness,
one in the DOM harness — rather than altering what the Founder specified. Each was surfaced by the
dead-allow control, not by inspection.

### A false assurance caught before it was published

The first DOM check after these changes reported "42 routes, 0 problems". It was **reading the
previous day's captures**: headless Chrome had died overnight, the capture script was failing with
`ECONNREFUSED`, and `dom-check.py` ran happily over a stale corpus. It was found only by grepping
the captures for the Founder's new wording and getting zero hits. Chrome was restarted, the corpus
recaptured, and the figures above are measured on bytes that demonstrably contain the changes.

This is the `capture-serve` class of defect that round 22 already recorded once — a harness
reporting a clean result over inputs it never refreshed. The lesson applied here: **after any copy
change, grep the captures for the new wording before trusting the check.**
