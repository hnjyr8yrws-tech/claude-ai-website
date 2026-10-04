# CURRENT STATE

**Purpose.** Durable handoff between Claude Code and ChatGPT. This file records *verified* state
only. Every hash, count and status below was measured on the machine at the timestamp given, not
carried forward from an earlier note.

**Last verified:** 4 October 2026 (D3 complete; September 2026 directory reconciled and published; candidate re-frozen)
**Verified by:** Claude Code (session `28345e36`)
**Rule for this file:** if you cannot reproduce a figure with the command beside it, treat the
figure as wrong and re-derive it. Figures in this pack have gone stale twelve times; do not trust a
number here that you have not re-run.

---

## 1. Where things stand, in one paragraph

Round 25 ran two independent fresh reviewers. Both returned **NOT CLEAR**, with roughly sixty
legitimate findings and almost no overlap — one attacked the apparatus, one read the site. All were
repaired. The Founder then **stopped the autonomous review loop** (direction of 1 October): close
the three blockers, prove and freeze once, return to D3, then do the actual product work.

**D3 is now complete.** All 19 grouped decisions were adjudicated by the Founder on 3 October
(10 KEEP, 6 CHANGE, 2 REMOVE, 1 NEEDS EVIDENCE); the eight requiring work are applied, proved on
the exact bytes and frozen once as tree `51759cad1094d2e01464f41d1e49ae8a1208178c`. The single
NEEDS EVIDENCE decision (10) stays open on the live n8n/Luna grounding, which is outside this
repository. **No round 26 has been dispatched and none will be without an explicit instruction.**

The next work is the **product** work, in the Founder's order: reconcile the AI tool directory from
the preserved Phase 2A research; make the retained site current for KCSIE 2026; confirm Equipment,
Prompts and affiliate surfaces are fully removed and repair every navigation, route, link, email,
Luna, SEO and layout location those removals touched; then update the design under the
currently adopted Brand World authority only. **Safe Mode is Charles's — not to be built,
redesigned or inferred here.**

**Two things to read before anything else:** `D3-CARVE-OUTS.md` (three decision-1 carve-outs
awaiting a Founder yes or no) and the two unasked-for defect fixes in `FREEZE-RECORD.md` — the build
had been failing since 30 September, and decision 11 was half-applied on the first pass.

---

## 2. Repositories and branches

| Checkout | Branch | HEAD | Role |
|---|---|---|---|
| `~/Sites/claude-ai-website` | `chore/email-audit-info-v2` | `ee19a4e` | Main working checkout |
| `~/Sites/claude-ai-website-phase2a` | `feat/directory-sep-2026-research` | `4a7e660`, tree `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf` | **PRESERVED** — the tool-refresh research, next after D3 |
| `~/Sites/claude-ai-website-kcsie-containment` | `feat/kcsie-2026-containment` | `51d56c8` = `origin/main`, **0 commits ahead**; working tree frozen as `89c4cba9` | The candidate: D3 complete, directory reconciled to **269 tools** |

Safe Mode is in **none** of these: the ARC determination records it at
`/Users/chloeandcharlie/promptly-labs`, `40-safe-mode/`. **Charles owns it. Claude Code does not
build, redesign or infer it.**

**Nothing is committed, pushed, merged or deployed** on either workstream branch. This handoff
branch is the sole exception and carries communication files only.

---

## 3. The frozen candidate

The tree hash and the proof figures are in **`FREEZE-RECORD.md`**, recorded there because a tree
hash cannot be stored inside the tree it describes.

| Layer | Result |
|---|---|
| Typecheck / build | clean |
| Tests | **96 / 96**, 17 rules |
| DOM / browser | **42 routes**, **0 problems, 0 missing required** |
| DOM blind spot | **0 claim-class hits across 0 routes** — empty because the surface is gone, and the transcript says so in words |
| **Measured reach** | **3 of 15** — published, not withdrawn. Worse than the 6 of 15 taken on the larger pre-reduction corpus. The twelve misses are all the Phase 2B C17 class, which has zero stored support. The three figures are **not comparable**: the corpus changed underneath each measurement |
| Seals | `phase2c` re-sealed from the directory listing; `phase2b` **16/16 OK** |
| Preservation | Phase 2A `98b3e284c7c57e10c90bdabb48451e1ff0e1b3cf` unchanged |

### The three blockers, and how each was proved

Each was closed and then **verified by replaying the reviewer's own exploit**, not by assertion.

1. **`/*` in ordinary copy blinded every rule and the score-store choke point.** Two characters of
   JSX prose opened a block comment and deleted every following line from all 17 rules until the
   next `*/`. Behind it a reviewer shipped a sentence that was at once "KCSIE compliant", a
   certification claim, a named-reviewer cadence claim and adoption wording; imported the score
   store into a non-adapter page; and **published all 241 held composites as `data-` attributes** —
   at 96/96 green. *Fixed:* an opener must look like a comment (`/*` at line start, or `{/*`), and a
   mid-line `/*` now fails **open**, so lines are scanned rather than skipped. Plus a coverage floor
   on **lines** (20,000; measured 20,841), because a nine-line blackout left the file count
   untouched. *Proved:* the planted claim now trips two rules, and the choke point fires on the
   store import.
2. **The bridge control enumerated three spellings of its own target.** `[\w\W]*` walked past it and
   widened two live anchors. *Fixed:* it now measures behaviour — splice a planted sentence at
   **every position** inside each anchor's matched span and fail if the match still swallows it.
   *Proved:* the exploit is caught, with the offending offset named.
3. **`git` was resolved from `PATH`, with `node_modules/.bin` ahead of `/usr/bin`.** A nine-line
   shim let a stored safeguarding score be rewritten 9.5 → 2.0 at 96/96, breaking no seal because
   `node_modules` is gitignored. *Fixed:* the load-bearing comparison runs **no subprocess** — the
   baseline hashes and all 241 safety/tier tuples live in `phase2c/baseline-manifest.json`, sealed
   by `SHA256SUMS.txt`. *Proved:* with the shim first on `PATH` and the score tampered, the control
   fails.

**M125 survived twice before it died, and both failures were mine.** First the guard was a
source-text check that matched its own assertion; then an identity check on the *accessor*, which
stays true when the mutation edits the call site instead. The assertion now sits on the variable the
test actually compares. A guard adjacent to the thing it protects is not a guard.

---

## 4. The Brand World pack — read in full, nothing changed on the strength of it

Read on the Founder's direction of 1 October. Detail in **`BRAND-WORLD-PACK-READING.md`** and
**`GOV-GAP-003-uos-v1.3.1.md`**.

**What is authoritative** — Charter v1.1 Schedule A, which states that harmonised drafts take effect
only on ratification and that until then the superseded version remains in force:

- **Brand World v2.1** — ratified 26 July 2026, **in force**. Its text is **not in the pack**.
- Brand World v2.2, Charter v1.1, Founding Charter v1.1, UOS v2.1 — **harmonised drafts**.
- **Brand Bible v1.1 — retired 26 July 2026; preserved, not authoritative.**
- Methodology v2.2 — in force; its consolidated Standard text is still missing (`GOV-GAP-001`).

**Three things this prevented:**

1. **The "Promptly" rename is not adopted** (Brand World §1.4 "asserts no earlier adoption"). The
   site correctly remains GetPromptly. **Nothing was renamed.**
2. **Nothing about the identifying mark is decided** — the Logo Jury is explicitly a desk jury with
   no artwork, and LJ1–LJ5 and D1–D14 are unapplied. The incumbent mark stays in service.
3. **"Not Yet" cannot simply replace the containment's states** — UOS §24.5 records FD-01's
   evidential threshold, reassessment interval and **published wording** as outstanding.

**`CLAUDE.md` is citing a retired document.** It calls `docs/brand-bible.html` "the full brand source
of truth (v1.1)" and cites its §22 checklist; Brand World Schedule C dispositions that checklist to
**UOS §9.2**, the pre-publication gate. The substance largely survived — Colour, Typography,
Devices, Voice and Accessibility are all "Retained" — so the authority moved and most of the content
did not.

**The containment is confirmed as aligned, not merely tolerated.** UOS §9.4: automatic transitions
"may only make a public state more conservative or **suppress** it". And `Rule4bGuard` was verified
against source for the first time — **UOS v1.2 §6.1 Rule 4b** is in the pack and is quoted
correctly.

**`GOV-GAP-003` is new and real.** The containment cites UOS v1.3.1 §19/§21/§24 — "legacy provenance
is never invented", "missing means missing" — as its basis for suppressing rather than
reconstructing. **That text is nowhere on this machine**: Spotlight by content returns only this
programme's own documents and the site copy derived from them. UOS v2.1 Schedule A says unlisted
provisions are "unreconciled rather than repealed", so the citations stand — but nobody can check
that the record quotes them correctly. The rule cited unreadably is the rule against inventing what
is missing.

---

## 5. Exact next action

1. **~~Freeze~~ — done.** Figures in `FREEZE-RECORD.md`.
2. **D3 is under way.** The pack was regenerated from the frozen bytes (the previous one predated
   the round-25 repairs and quoted ~60 claims that no longer exist). **Batch 1 is done:** the
   Founder adjudicated twelve of the thirteen open items in batches 01–03 on 1 October — 4 CHANGE,
   7 KEEP, 1 NEEDS EVIDENCE — and all four changes are applied and verified in the rendered DOM.
   `03.4` was left open deliberately. **83 decisions remain open.** Each batch's changes are applied,
   proved and re-frozen before the next batch goes out; assurance stays attached to the change and
   does not become a separate project.
3. **Then the product work, in this order** (Founder direction, 1 October):
   - reconcile and update the AI tool directory from the preserved Phase 2A research;
   - make the retained site current for KCSIE 2026;
   - confirm Equipment, Prompts and affiliate surfaces are fully removed;
   - repair every navigation, route, link, email, Luna, SEO and layout location those removals touched;
   - then update the design using **the adopted Brand World authority only**, preserving historic
     material for context without treating it as current.
4. **Not to be done:** Safe Mode (Charles's workstream). Any score or Pillar Card redesign, until
   the authoritative basis is actually resolved. Another fresh-review round. Any further assurance
   expansion — assurance stays attached to each product change and does not become a separate
   project.

---

## 6. Open, and human-only

| | Matter | Blocks |
|---|---|---|
| **D1** | RL-017 trigger 7. **Its shape has changed:** it asks whether a *Brand Bible* erratum supersedes an adopted Class A rule, and the Bible is now retired and non-authoritative with its checklist moved to UOS §9.2. RL-017 itself is live — Class A, seven triggers, joint CR+CD | Shipping |
| **D2** | Methodology v2.2 lineage | — |
| **D3/D4** | `GOV-GAP-001` (the v2.2 Standard text), `GOV-GAP-002` (MVB v0.1) | Calibration |
| **NEW** | **`GOV-GAP-003`** — the UOS v1.3.1 text this containment quotes | Checkability of the record |
| **D5** | Luna's live grounding runs in n8n, outside this repository. UOS **§9.7** makes a publication incomplete until the enquiry surface is updated, and its own institutional-memory note records a child-safety withdrawal that reached the website but not Luna. **§14.1 requires a surface-parity failure to be escalated** | Shipping |
| **D6** | Standards registration | — |
| **D7** | The §2 equipment blind spot now has no subject; whether §2 is restated is a governance call | — |
| **NEW** | The conflicts at `BRAND-WORLD-PACK-READING.md` §4 — WCAG 2.2 vs 2.1 on `/safety-methodology`; the seven constitutional card states vs `LegacyHolding`/`AwaitingReReview`; §16.7's required Score Integrity Record vs its currently empty record; §15.11's "Re-scored quarterly"; and a longer proscribed-word list than `CLAUDE.md` carries | Brand-facing work |
