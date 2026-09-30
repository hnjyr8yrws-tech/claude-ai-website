# CURRENT STATE

**Purpose.** Durable handoff between Claude Code and ChatGPT. This file records *verified* state
only. Every hash, count and status below was measured on the machine at the timestamp given, not
carried forward from an earlier note.

**Last verified:** 30 September 2026 (round 24 — product scope reduction applied and proved)
**Verified by:** Claude Code (session `28345e36`)
**Rule for this file:** if you cannot reproduce a figure with the command beside it, treat the
figure as wrong and re-derive it. Figures in this pack have gone stale eleven times; do not trust a
number here that you have not re-run.

---

## 1. Repositories and branches

Three checkouts of the same repository (`github.com/hnjyr8yrws-tech/claude-ai-website`).

| Checkout | Branch | HEAD | Role |
|---|---|---|---|
| `~/Sites/claude-ai-website` | `chore/email-audit-info-v2` | `ee19a4e` | Main working checkout |
| `~/Sites/claude-ai-website-phase2a` | `feat/directory-sep-2026-research` | `4a7e660`, tree `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf` | **PRESERVED** — tool-refresh candidate |
| `~/Sites/claude-ai-website-kcsie-containment` | `feat/kcsie-2026-containment` | `51d56c8` = `origin/main`, **0 commits ahead** | KCSIE 2026 containment **+ the round-24 scope reduction** |

**This handoff pack lives on its own remote branch, `agent-handoff`, taken from `origin/main`.**
It carries communication files only — no containment, Phase 2A, product, scoring or methodology
changes — and is **never merged**. To read it:
`git fetch origin && git show origin/agent-handoff:docs/agent-handoff/CURRENT-STATE.md`.

Reproduce the containment tree hash:

```sh
GIT_INDEX_FILE=/tmp/idx git read-tree 51d56c818fda9a6cde59c05e3b368896ecc7c2ab   # the MERGE BASE, never HEAD
GIT_INDEX_FILE=/tmp/idx git add -A . 2>/dev/null
GIT_INDEX_FILE=/tmp/idx git write-tree
```

> **Known defect in this recipe.** `.claude/worktrees/cranky-kalam` is a tracked gitlink over an
> empty directory, so `write-tree` emits whatever the *seeded* index holds. Seeding from `HEAD`
> makes the hash a function of HEAD as well as of the files. **Always seed from `51d56c8`**, and
> separately assert `git rev-list --count origin/main..HEAD` is `0`.

**Nothing is committed, pushed, merged or deployed** on either workstream branch.

---

## 2. Current workstream

**Primary:** Phase 2C — KCSIE 2026 containment (Impact Record v0.4 §13 step 1) — **plus the
round-24 product scope reduction** directed on 30 September 2026.

Containment withdraws unsupported present-tense claims without touching stored data: Phase 2B
found the site's score provenance does not exist (reviewer initials and methodology version are
build constants, 0 of 252 rows record a Review Basis, 91 scores predate the version they claim).
Tools stay listed; scores are held, not published.

**The scope reduction is reported in full in `SCOPE-RESET.md` in this directory.** In short:
Equipment, the Prompts library and all affiliate links are removed from product scope; Training is
untouched and on HOLD apart from its affiliate links; **109 tracked files changed, +938 / -15,870**
against `origin/main`; the removed data is preserved as hashed evidence, not deleted.
**One step is blocked** and needs your decision — see `SCOPE-RESET.md` §10.5 on the `getpromptly/`
mirror app.

---

## 3. Latest assurance results

Measured on the round-24 tree, 30 September 2026. **Every figure below was re-run today** — none
is carried over from the pre-reduction pack.

| Layer | Result |
|---|---|
| Typecheck / build | `tsc --noEmit` clean; `vite build` passes |
| Tests | **96 passing** across 17 rules and 220 reasoned allow entries |
| Mutants | **115 of 125 killed, 10 retired, 0 survived, 0 invalid** — see the note below |
| DOM / browser | **42 routes** (33 first-paint derived from the router + 9 interaction probes), **0 problems, 0 missing required**, 255 allowed hits with written reasons |
| DOM blind spot | **0 claim-class hits across 0 routes** — empty *because the surface is gone*, not because it was cleared. The counter stays live |
| Not captured | nothing outstanding. The prompt modal was the standing gap; the component was deleted, so the gap closed by removal rather than by proof |
| Independent rescan | **858 rows, 530 removed in candidate, 328 remaining** by class. Three prompt-CSV metrics now report `RETIRED`, never `0` — absent is not zero |
| Measured reach | **WITHDRAWN.** The 6-of-15 figure was taken on the old, larger corpus and is not carried forward. Re-measure after D3 |
| Seals | `phase2c` **31/31 OK**, 0 files unsealed, re-sealed from the directory listing; `phase2b` **16/16 OK** |
| Freeze | tree **`0212b7e426658cad8b209d72f596dd1c7118f69a`**; reproduces from `origin/main` + `containment-r24.patch` (SHA-256 `76fd3c6c…b0d6fa04`) in a clean worktree; 0 commits ahead; no `refs/replace` |
| Preservation | Phase 2A `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf` unchanged |

**Mutant pack:** 125 mutants — **115 killed, 10 retired, 0 survived, 0 invalid**, against a
proved-green baseline. Nine were retired because their subject FILE left product scope (Equipment,
the prompt library, the prompt CSV) and M108 because its ANCHOR went with the prompt CSV — no
column-scoped CSV allow remains, so that mechanism is unexercised. Each retirement is named with
the surface it died with and still gets a row. A live mutant whose subject file has vanished now
**aborts** the pack instead of being skipped. Six mutants were **re-anchored** rather than retired,
because the copy they plant a regression into was rewritten this round and a NOT APPLIED mutant
measures nothing.

---

## 4. D3 — where it stands

The regenerated pack is in `d3-review/` on this branch.

| | |
|---|---|
| Distinct claims | **119**, across 41 rendered surfaces, in **10 batches** |
| Already answered by you | **27 items pre-filled** (29 of your 48 earlier decisions; two pairs merged into one claim each) |
| Resolved by removal | **19** of your earlier decisions — their surfaces no longer exist; not re-asked |
| Open for you | **92** |

`d3-review/CARRIED-FORWARD.md` lists every earlier decision and says which of the three things
happened to it. Two pairs of your earlier answers now fall on a single claim; where they agreed the
answer is carried, and **where they differed nothing has been chosen for you** — the item asks you
to confirm which applies.

The **Training** items you marked `NEEDS EVIDENCE` remain **live and open**: training is on hold,
not removed, so those claims still ship.

---

## 5. Tool-refresh objective (Phase 2A) — PRESERVED, PAUSED

Branch `feat/directory-sep-2026-research`, tree `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf`,
uncommitted, in its own worktree, untouched by any containment or scope-reduction work.

Contents: the September 2026 research intake — 31 records, 22 proposed additions, 6 Emerging
records, the capability axis, UK-availability corrections, withdrawal protections.

**Not merged and must not be.** Reconciliation happens only after containment is proved and the
Founder sets the order. Adding scored tools while the score system is held would reintroduce
exactly the claim containment withdraws.

---

## 6. Methodology and KCSIE status — unchanged by round 24

| Item | Status |
|---|---|
| KCSIE 2026 | **In force since 1 September 2026** |
| Site wording | "KCSIE-aware" / "reviewed against KCSIE 2025" (dated, historical). **No KCSIE 2026 rebadge.** Never "KCSIE compliant" for a third-party tool |
| Methodology v2.2 | The consolidated Standard text **does not exist in any governed store** — `GOV-GAP-001` |
| Methodology v2.3 | Candidate v0.1 only. **NOT adopted.** Ratifying it hits RL-017 triggers 1–2, so it needs joint CR+CD |
| Calibration (IR step 4 / G2) | **BLOCKED** — needs the v2.2 Standard text |
| Probe Governance Charter (G3) | **BLOCKED** — its source, Validity System MVB v0.1 §5, is missing (`GOV-GAP-002`). Probe runs are barred |
| Standards registration (IR step 2) | **PROPOSED, NOT ADOPTED** |
| Fable | Not to be invoked until the candidate satisfies the Fable eligibility gate (G5) |

Smallest valid calibration staffing: **two humans** — CR as Reviewer A and B via test–retest, CD as
Custodian and Second Reader. **No AI may hold those roles** (IR §13 step 4).

---

## 7. Current blockers

1. **Governance blockers** — `GOV-GAP-001` blocks G2/calibration; `GOV-GAP-002` blocks the Probe
   Charter and G3. Neither can be reconstructed by an agent (UOS v1.3.1 §19, §24).
2. **Open CR/CD determinations** — see `DECISIONS-NEEDED.md`. Containment cannot be declared
   complete while **RL-017 trigger 7** is undetermined. **D7 has changed shape**: the equipment
   blind spot it concerns no longer has a subject, so the question is now whether §2 should be
   restated to record that. An agent must not restate a governance disposition, so it stays open.
3. **Deployment gate outside this repository** — Luna's live grounding runs **in n8n**, not here.
   This branch carries `src/api/agent.ts` and both authoring sources, and round 24 rewrote them
   (two modes and two personas removed, five role contexts rewritten). **None of that reaches
   visitors until someone deploys it to n8n.** Shipping this branch ships the whole site except the
   conversational surface. It has no owner inside this record.
4. **D3 is the designated completeness control and is not finished** — 92 open decisions.

---

## 8. Exact next action

1. **~~Freeze the round-24 candidate~~ — DONE.** Frozen tree
   **`0212b7e426658cad8b209d72f596dd1c7118f69a`**, patch SHA-256
   `76fd3c6c031a20c6198f0e09041564fbd58d5b20387c1fd74deef7e2b0d6fa04`. Verified by application: a
   clean worktree at `origin/main` plus the patch reproduces that tree exactly. 0 commits ahead;
   no `refs/replace`.
2. **Dispatch a fresh-Opus review of the round-24 tree.** Every round so far has returned NOT
   CLEAR; on NOT CLEAR, repair, re-prove, re-freeze and dispatch again without pausing.
3. **Continue D3** batch by batch with the Founder, starting at `d3-review/batch-01.md`.
4. **Then, and only then:** the governed tool-refresh programme and Safe Mode work.

**Standing constraint: do not edit the tree while a review is running.** Rounds have been
invalidated exactly that way, and round 24 invalidated one mutant run of its own by editing the
tree mid-flight — the run was discarded and restarted rather than reported.
