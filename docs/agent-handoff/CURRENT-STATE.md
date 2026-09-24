# CURRENT STATE

**Purpose.** Durable handoff between Claude Code and ChatGPT. This file records *verified* state
only. Every hash, count and status below was measured on the machine at the timestamp given, not
carried forward from an earlier note.

**Last verified:** 24 September 2026 (round 17 complete; round 18 in review)
**Verified by:** Claude Code (session `28345e36`)
**Rule for this file:** if you cannot reproduce a figure with the command beside it, treat the
figure as wrong and re-derive it. Figures in this pack have gone stale ten times; do not trust a
number here that you have not re-run.

---

## 1. Repositories and branches

There are **three checkouts of the same repository** (`github.com/hnjyr8yrws-tech/claude-ai-website`).
Naming only one "the repo" has caused confusion before, so all three are listed.

| Checkout | Branch | HEAD | Working-tree tree hash | Role |
|---|---|---|---|---|
| `~/Sites/claude-ai-website` | `chore/email-audit-info-v2` | `ee19a4e` (3 ahead / 1 behind `origin/main`) | not pinned | Main working checkout |

**This handoff pack lives on its own remote branch, `agent-handoff`, taken from `origin/main`.**
That branch carries these three files and nothing else — no containment, Phase 2A, Phase 2B,
product, scoring or methodology changes. It is a communication channel between Claude Code and
ChatGPT, **not** a development branch, and it is **never merged**. To read it:
`git fetch origin && git show origin/agent-handoff:docs/agent-handoff/CURRENT-STATE.md`.
| `~/Sites/claude-ai-website-phase2a` | `feat/directory-sep-2026-research` | `4a7e660` | `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf` | **PRESERVED** — tool-refresh candidate |
| `~/Sites/claude-ai-website-kcsie-containment` | `feat/kcsie-2026-containment` | `51d56c8` = `origin/main`, **0 commits ahead** | `709a0ec959e0fa2437c54ee88cf168bb40eb9257` | **FROZEN** — KCSIE 2026 containment, round 19 under review |

Reproduce a tree hash:

```sh
GIT_INDEX_FILE=/tmp/idx git read-tree 51d56c818fda9a6cde59c05e3b368896ecc7c2ab   # the MERGE BASE, never HEAD
GIT_INDEX_FILE=/tmp/idx git add -A . 2>/dev/null
GIT_INDEX_FILE=/tmp/idx git write-tree
```

> **Known defect in this recipe.** `.claude/worktrees/cranky-kalam` is a tracked gitlink over an
> empty directory, so `write-tree` emits whatever the *seeded* index holds. Seeding from `HEAD`
> makes the hash a function of HEAD as well as of the files — which is why an accidental commit on
> 23 Sep went undetected by two reviewers using this recipe. **Always seed from
> `51d56c8` (the merge base), not from `HEAD`,** and separately assert
> `git rev-list --count origin/main..HEAD` is `0`.

**Nothing is committed, pushed, merged or deployed** on either workstream branch.

---

## 2. Current workstream

**Primary:** Phase 2C — **KCSIE 2026 containment**, Impact Record v0.4 §13 step 1.

KCSIE 2026 came into force on 1 September 2026. Phase 2B found the site's score provenance does not
exist: reviewer initials and methodology version are **build constants**, 0 of 252 rows record a
Review Basis, and 91 scores predate the version they claim. Containment withdraws unsupported
present-tense claims **without touching stored data**. Tools stay listed; scores are held, not
published.

The governing principle, and the one most often lost: **coverage is not assurance.**

**Secondary, paused:** Phase 2A — the September 2026 tool-refresh intake (see §6).

---

## 3. Exact status

**Round 18: NOT CLEAR** (two independent reviewers). **Round 19: all findings repaired**, full proof
re-run, resealed, re-frozen, and **dispatched to two fresh reviewers — currently in review.**

Four consecutive rounds of reviewers have now rendered the live surfaces independently and found
**no live false claim in the bytes**. Every defect since round 16 has been in the *controls* or the
*records*. That is not CLEAR — a control that cannot fire is not evidence, and round 18 found a
proof that could not fail — but it is the shape of the remaining work.

## 4. What has been completed

**Containment applied** (branch `feat/kcsie-2026-containment`, not deployed):

- Single choke point: `src/lib/trust/trustAdapter.ts`. Every path — published, withdrawn,
  provisional, Historic, unknown-slug — gated on `PUBLISHED_SCORES_LACK_PROVENANCE`. Composite,
  pillars, methodology version and reviewer are all suppressed; dates are kept.
- 241 tools = **231 `LegacyHolding` + 10 `AwaitingReReview`**. Stored records untouched.
- Audit Receipt fails closed and now refuses **every** tool, because `validate.ts` requires a
  methodology version and a reviewer, and neither exists. This is a *consequence*, recorded at §3
  of the containment record, not a bug.
- Live scores present as `LEGACY SCORE · AWAITING RE-REVIEW`.
- Luna grounding, script sources, transactional emails, lead-capture and receipt modals, SEO/meta,
  `index.html`, structured data and the Brand Bible (19 errata rows) all contained.

**Assurance apparatus built and repaired across 15 rounds** — source scan, DOM harness, mutant
pack, rescan, seals, freeze-and-reproduce.

---

## 5. What remains

**Round 19 repaired every round-18 finding, and the three MATERIAL items carried over from round
16** (the `\S` blanket, the file-shaped equipment exclusion, the stale scale block). Each repair is
held by a mutant: M100–M108.

**Open:** the round 19 verdict. On NOT CLEAR, repair, re-prove, re-freeze and dispatch round 20
without waiting. On CLEAR, move to the governed tool-refresh programme (§6) in batches.

## 6. Tool-refresh objective (Phase 2A) — PRESERVED, PAUSED

Branch `feat/directory-sep-2026-research`, tree `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf`,
uncommitted, in its own worktree. **Untouched by any containment work and re-verified today.**

Contents: the September 2026 research intake — 31 records, 22 proposed additions, 6 Emerging
records, the capability axis, UK-availability corrections, withdrawal protections and release
research.

**It is not merged and must not be.** Reconciliation with containment happens only after
containment is proved and the Founder sets the order. Adding scored tools while the score system
is held would reintroduce exactly the claim containment withdraws.

---

## 7. Methodology and KCSIE status

| Item | Status |
|---|---|
| KCSIE 2026 | **In force since 1 September 2026** |
| Site wording | "KCSIE-aware" / "reviewed against KCSIE 2025" (dated, historical). **No KCSIE 2026 rebadge.** Never "KCSIE compliant" for a third-party tool |
| Methodology v2.2 | The consolidated Standard / Scoring & Verdict Template text **does not exist in any governed store** — `GOV-GAP-001` |
| Methodology v2.3 | Candidate v0.1 only. **NOT adopted.** Ratifying it hits RL-017 triggers 1–2, so it needs joint CR+CD |
| Calibration (IR step 4 / G2) | **BLOCKED** — needs the v2.2 Standard text |
| Probe Governance Charter (G3) | **BLOCKED** — its own source, Validity System MVB v0.1 §5, is missing (`GOV-GAP-002`). Probe runs are barred |
| Standards registration (IR step 2) | **PROPOSED, NOT ADOPTED** |
| Fable | Not to be invoked until the candidate satisfies the Fable eligibility gate (G5) |

Smallest valid calibration staffing: **two humans** — CR as Reviewer A and B via test–retest, CD as
Custodian and Second Reader. **No AI may hold those roles** (IR §13 step 4, "Human reviewers").

---

## 8. Latest assurance results

Measured on frozen tree `709a0ec959e0fa2437c54ee88cf168bb40eb9257`, 24 September 2026.

| Layer | Result |
|---|---|
| Typecheck / build | clean |
| Tests | **95 passing** (20 pre-existing + 75), across **17 rules** and **213** reasoned allow entries |
| Mutants | **108 of 108 killed, 0 invalid, 0 survived** — and, for the first time, against a **proved-green baseline**. The runner now refuses to start unless the unmutated suite passes, so a kill is attributable to the mutation. The round-17 "99/99" attestation was void and has been withdrawn |
| DOM / browser | **56 routes**, **0 problems, 0 missing required**, 244 allowed hits |
| DOM blind spot | **173 claim-class hits across 11 equipment routes**, declared, counted and printed |
| Independent rescan | **883 rows total, 212 removed, 671 remaining** |
| Seals | `phase2c` **27/27 OK**; `phase2b` **16/16 OK** |
| Freeze reproducibility | `origin/main` + `containment.patch` → `709a0ec9…`, verified in a throwaway worktree |

**The figures are derived, not typed** — a control reads the mutant pack, its result and the DOM
transcript, and now also **fails when one of its own checks matches nothing**, which is how five of
ten checks had been silently dead.

## 9. Current blockers

1. **Governance blockers** — `GOV-GAP-001` (v2.2 Standard text) blocks G2/calibration;
   `GOV-GAP-002` (MVB v0.1) blocks the Probe Charter and G3. Neither can be reconstructed by an
   agent: UOS v1.3.1 §19, "legacy provenance is never invented", and §24, "missing means missing".
2. **Open CR/CD determinations** — see `DECISIONS-NEEDED.md`. Containment cannot be declared
   complete while RL-017 trigger 7 is undetermined.
3. **Deployment gate outside this repository** — Luna's live grounding is deployed **in n8n**, not
   here. This branch contains `src/api/agent.ts` and both authoring sources, but the prompt that
   actually generates Luna's answers is outside the frozen tree and unchanged by this branch.
   **Shipping this branch contains the whole site except the conversational surface.** Recorded at
   containment-record §8 item 6; it has no owner inside this record.
4. **Review-procedure defects — all three fixed for round 18:**
   - The brief told reviewers to "copy the WHOLE tree". A whole-tree copy includes a `.git`
     *gitfile* pointing into the real repository, which handed a reviewer write access to it. On
     23 Sep a reviewer's `git init/add/commit` landed on `feat/kcsie-2026-containment`
     (`0ea0b24`, author `r <r@r.local>`). **No byte changed** — the commit's tree *was* the frozen
     tree. HEAD and the Phase 2A git identity were both restored at 20:57 on 23 Sep; `0ea0b24`
     remains in the reflog as the honest record. **Fixed:** the round-18 brief requires `--exclude .git`.
   - Both reviewers were given the same scratch root and collided; one discarded a run after
     mistaking the other's planted probe for a live finding. **Fixed:** each round-18 reviewer has its own scratch root.
   - The tree-verification recipe cannot detect a commit (see §1). **Fixed:** the round-18 recipe pins the merge base and asserts `0` commits ahead.

---

## 10. Exact next action

**Await the round 18 verdict from two fresh reviewers** (dispatched 24 September 2026 on frozen tree
`8087475ede67db4a5e23639bcf98b8b7f4a599d0`; one on the harness internals, one on the live surfaces
and the records).

- **NOT CLEAR** → repair every legitimate finding, re-run the complete proof, reseal, re-freeze,
  dispatch round 19. No pause for approval; that is the standing direction.
- **CLEAR** → move directly into the governed tool-refresh programme (§6), in batches, with Phase 2A
  reconciled only in the order the Founder sets.

**Standing constraint: do not edit the tree while a review is running.** Rounds have been
invalidated exactly that way.
