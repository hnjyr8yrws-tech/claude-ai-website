# Freeze record — round 24

A tree hash cannot be stored inside the tree it describes, so it is recorded here, on the handoff
branch, outside the containment worktree.

**Frozen:** 30 September 2026
**Branch:** `feat/kcsie-2026-containment` (uncommitted; **0 commits ahead** of `origin/main`)
**Base / merge-base:** `51d56c818fda9a6cde59c05e3b368896ecc7c2ab`

| | |
|---|---|
| **Frozen tree** | `2a7ab83e774632e99a327d575427dd4521b27e7b` |
| **Patch** | `containment-r24b.patch`, SHA-256 `329a1ac055797d0dddb5bd7f3e758fd2037e1374cef94fb6ff3c2104dbafd06d` |
| Reproduction | verified: a clean worktree at `origin/main` + the patch yields the frozen tree **exactly** |
| `refs/replace` | none |
| `phase2c` seal | **31/31 OK**, 0 unsealed, rebuilt from the directory listing |
| `phase2b` seal | **16/16 OK** |

## What this tree contains

The KCSIE 2026 containment **plus** the round-24 product scope reduction (Equipment, the Prompts
library and all affiliate links removed from product scope; Training untouched and on HOLD apart
from its affiliate links).

## Assurance measured on these exact bytes

| Layer | Result |
|---|---|
| Typecheck / build | clean |
| Tests | **96 / 96**, 17 rules, 220 reasoned allow entries |
| Mutants | **115 of 125 killed, 10 retired, 0 survived, 0 invalid**, against a proved-green baseline |
| DOM / browser | **42 routes**, **0 problems, 0 missing required**, 255 reasoned allowed hits |
| DOM blind spot | **0 claim-class hits across 0 routes** — empty because the surface is gone, not because it was cleared |
| Independent rescan | **858 rows, 530 removed in candidate, 328 remaining** |
| Measured reach | **withdrawn for this tree** — the 6-of-15 figure belongs to the larger pre-reduction corpus |

## How to reproduce the tree hash

```sh
cd ~/Sites/claude-ai-website-kcsie-containment
GIT_INDEX_FILE=/tmp/idx git read-tree 51d56c818fda9a6cde59c05e3b368896ecc7c2ab   # the MERGE BASE, never HEAD
GIT_INDEX_FILE=/tmp/idx git add -A . 2>/dev/null
GIT_INDEX_FILE=/tmp/idx git write-tree          # → 2a7ab83e774632e99a327d575427dd4521b27e7b
git rev-list --count origin/main..HEAD          # → 0
git for-each-ref refs/replace                   # → empty
```

Seeding from `HEAD` makes the hash a function of HEAD as well as of the files, because
`.claude/worktrees/cranky-kalam` is a tracked gitlink over an empty directory. Two reviewers missed
an accidental commit that way. Seed from the merge base and assert `0` commits ahead separately.

## Handing this to a reviewer

Copy the tree **with `--exclude .git`** and give each reviewer its own scratch root. This
worktree's `.git` is a *gitfile* pointing into the real repository, so a copy carrying it has write
access to the real branch — that is how commit `0ea0b24` (author `r <r@r.local>`) landed on the
containment branch on 23 September.

## The mirror-app removal, completed after the first freeze

The first round-24 freeze (`0212b7e426658cad8b209d72f596dd1c7118f69a`) carried the `getpromptly/`
mirror app in a **partially removed** state: four prompt files gone, five remaining, one of them
importing a deleted component and still titled *"600+ AI Prompts for UK Schools"*. Deleting them
had been refused twice by the execution environment as irreversible local destruction, so the
half-state was recorded as unfinished rather than presented as intended.

The Founder then instructed **"Delete them"**. The deletion was carried out, the full proof re-run,
`phase2c` re-sealed and the candidate re-frozen — which is why this record names
`2a7ab83e774632e99a327d575427dd4521b27e7b` and not the earlier hash. The preserved copies remain in
`phase2d/removed-product-data/getpromptly-mirror-pending/`, 5/5 hashes verified.

**Nothing in this tree is now knowingly unfinished.** The open items are governance decisions, not
engineering work: see `DECISIONS-NEEDED.md`.
