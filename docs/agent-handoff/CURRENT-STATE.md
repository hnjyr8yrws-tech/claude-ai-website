# CURRENT STATE

**Purpose.** Durable handoff between Claude Code and ChatGPT. This file records *verified* state
only. Every hash, count and status below was measured on the machine at the timestamp given, not
carried forward from an earlier note.

**Last verified:** 24 September 2026
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
| `~/Sites/claude-ai-website-kcsie-containment` | `feat/kcsie-2026-containment` | `51d56c8` = `origin/main`, **0 commits ahead** | `b9a8bdc42c38f221a1337a6958b59fbcf80efe41` | **FROZEN** — KCSIE 2026 containment under review |

Reproduce a tree hash:

```sh
GIT_INDEX_FILE=/tmp/idx git read-tree 51d56c818fda9a6cde59c05e3b368896ecc7c2ab
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

**Round 16 adversarial review: NOT CLEAR.** Two independent fresh reviewers, both landed
23 September 2026. Fifteen prior rounds have also returned NOT CLEAR.

Both reviewers independently rendered the live surfaces and agree on the central point:

> **There is no live false claim in the frozen bytes.** The remaining defects are in the *controls*
> and in the *records*, not in what a user is told.

That has now been true for two consecutive rounds. It is not the same as CLEAR: a control that
cannot fire is not evidence, and a sealed record that misstates its own figures is a UOS §19
problem regardless of whether the site is correct today.

---

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

## 5. What remains — round 16 repair queue

Engineering work, ordered. None of it is blocked by a founder decision.

1. **Re-anchor the freeze controls to the merge base, not `HEAD`.** The two anti-destruction tests
   compare disk against `git show HEAD:<file>`. Committed, they certify "worktree matches last
   commit" instead of "no stored score was rewritten" — demonstrated by rewriting a composite to
   `9.9` and a tuple to `safety:3, tier:"Avoid"`: **2 failed uncommitted, 92/92 green committed.**
   No mutant models this; add one that commits its mutation. *Do this first — it makes everything
   else measurable.*
2. **Give every rule an explicit scope.** Nine of the rules have neither `sentence:` nor
   `lineOnly:` and still fall through to the three-line proximity window — including present-tense
   KCSIE 2025, certification/authority transfer, D-05 adoption wording and C17 review-practice.
   Demonstrated: a KCSIE 2025 claim in Luna's shipped grounding passes because a negative
   instruction two lines below lands in the window.
3. **Replace the co-occurrence qualifier with one that governs the claim.** The `*` qualifier allow
   is satisfied by any sentence *containing* "is held" / "legacy score". Demonstrated: *"Every
   listing is re-checked each term by our safeguarding lead, even while its legacy score is held"*
   ships green on `/tools` — a cadence and a named reviewer role, both unsupported. **Both
   harnesses pass it.**
4. **Remove the `onLine` line-start shortcut** (an anchor matching at the line's first non-space
   character excuses the *whole* line, unconditionally — 25 allows take that branch), and **split
   the `src/data/prompts.ts` field wildcard**, which removes every `prompt` / `safeguarding` /
   `tip` / `teacherNote` line from the claim rule. That surface renders to users under a
   "Safeguarding:" label.
5. **Widen the sentence terminator in both harnesses.** `SENTENCE_END` admits only
   `\s $ " ' \` < ) ]`. It misses `{` (the JSX `.{' '}` idiom — 41 live occurrences), `&` (every
   HTML entity), and the curly quotes British copy actually ends with. Round 15 narrowed it to stop
   decimals splitting scopes and opened the reverse hole.
6. **Delete the tracked `node_modules` symlink** (`120000 blob … node_modules` → an absolute path
   in another checkout) or fix `.gitignore` (`node_modules/` with a trailing slash matches
   directories only). If this branch ever shipped it would leak a local filesystem path into a
   public repository.
7. **Generate every figure from the harnesses instead of typing it.** Confirmed stale right now:
   `phase2c/README.md` says **85/85 mutants** and **25 routes**; `SEAL-NOTE.md` says **25 captured
   DOM files**. All three verify against `SHA256SUMS.txt`, so the seal currently certifies text
   that is false. `containment-record.md` §4's "16 rules and 176 allow entries" is a grep artefact
   (measured: 17 rules, 178 allow objects), and its "+704/−417" does not reproduce.
8. **Fix the review brief** before dispatching round 17 — see §9.

---

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

Measured on the frozen tree `b9a8bdc42c38f221a1337a6958b59fbcf80efe41`, 23 September 2026.

| Layer | Result |
|---|---|
| Typecheck | `tsc --noEmit` clean |
| Build | `npm run build` clean, including the three prebuild audits |
| Tests | **92 passing** (5 files: 20 pre-existing + 72 in `src/test/kcsieContainment.test.tsx`) |
| Mutants | **92 of 92 killed, 0 invalid, 0 survived** — first clean sweep of the full pack |
| DOM / browser | **56 routes** (up from 25; Luna panel, lead-capture modal and prompt modal now opened, not first-paint only); **0 problems, 0 missing required**; 244 allowed hits with written reasons |
| DOM blind spot | **173 claim-class hits across 11 equipment routes, declared and printed** — §2 equipment provenance |
| Structural | 231 held + 10 withdrawn accessible names on `/tools` |
| Independent rescan | 883 rows total, 211 removed, 672 remaining — reproduced exactly by a reviewer |
| Seals | `phase2c/SHA256SUMS.txt` **27/27 OK**; `phase2b/SHA256SUMS.txt` **16/16 OK** (re-verified today) |
| Freeze reproducibility | `origin/main` + `containment.patch` → `b9a8bdc…`, verified in a throwaway worktree |

**Caveat that must travel with these numbers:** round 16 produced **six working regressions** against
this apparatus, each with a matched control. The figures are honest about what the harness measured;
the harness does not yet measure everything it claims to. See §5.

---

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
4. **Review-procedure defects, to fix before round 17:**
   - The brief told reviewers to "copy the WHOLE tree". A whole-tree copy includes a `.git`
     *gitfile* pointing into the real repository, which handed a reviewer write access to it. On
     23 Sep a reviewer's `git init/add/commit` landed on `feat/kcsie-2026-containment`
     (`0ea0b24`, author `r <r@r.local>`). **No byte changed** — the commit's tree *was* the frozen
     tree. HEAD and the Phase 2A git identity were both restored at 20:57 on 23 Sep; `0ea0b24`
     remains in the reflog as the honest record. **The brief must say to exclude `.git`.**
   - Both reviewers were given the same scratch root and collided; one discarded a run after
     mistaking the other's planted probe for a live finding. **Give each reviewer its own root.**
   - The tree-verification recipe cannot detect a commit (see §1). **Pin the merge base and assert
     `0` commits ahead.**

---

## 10. Exact next action

**Repair queue item 1: re-anchor the two freeze controls to the merge base rather than `HEAD`, and
add a mutant that commits its mutation.** Everything else in §5 is measured against those controls,
so this comes first.

Then §5 items 2–8 in order, then: full deterministic proof (tests → typecheck → build → 92 mutants
→ rebuild → re-capture DOM → rescan) → regenerate all figures from the harnesses → reseal both
`SHA256SUMS.txt` → re-freeze with patch reproduction → verify Phase 2A `98b3e284…` and Phase 2B
16/16 → dispatch round 17 to two fresh reviewers with the corrected brief.

**Standing constraint: do not edit the tree while a review is running.** Rounds have been
invalidated exactly that way.
