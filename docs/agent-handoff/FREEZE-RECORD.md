# Freeze record — KCSIE currentness, removal residue and surface repair

A tree hash cannot be stored inside the tree it describes, so it is recorded here, on the handoff
branch, outside the containment worktree.

**Frozen:** 5 October 2026 (Founder deliverables 1, 3 and 4)
**Branch:** `feat/kcsie-2026-containment` (uncommitted; **0 commits ahead** of `origin/main`)
**Base / merge-base:** `51d56c818fda9a6cde59c05e3b368896ecc7c2ab`

| | |
|---|---|
| **Frozen tree** | `a5249b298173bb1f408c6a070f2c76daac72f75f` |
| Previous freezes | `89c4cba9…` (directory reconciled) · `51759cad…` (D3 complete) · `d83ac6d7…` (D3 batches 1–2) · `1289c00a…` (round-25 closeout) |
| **Patch** | `containment-surface-repair.patch`, SHA-256 `dc89f027b58646f682f0ea867fbf01a0a69379bc675280aebd94d6a47323a22b` (7,446,656 bytes), at `~/Sites/kcsie-freeze-patches/` — outside any repository, per UOS §21 |
| Reproduction | **verified** — a clean clone of `origin/main` at the merge base plus the patch yields the frozen tree **exactly** (throwaway clone at `/tmp/repro-d134`) |
| `refs/replace` | none · Commits ahead **0** |
| `phase2c` seal | **34/34 OK**, rebuilt from the directory listing after the last edit |
| `phase2b` seal | **16/16 OK** |

## Assurance on these exact bytes

| Layer | Result |
|---|---|
| Typecheck / build | clean · green, **269 tools · 16 categories** |
| Tests | **104 / 104** (20 pre-existing + 79 containment + **5 new site-integrity**) |
| Mutants | **115 of 125 killed, 10 retired, 0 survived, 0 invalid, 0 not applied** — against a **proved-green baseline** |
| DOM / browser | **44 routes**, **0 problems, 0 missing required** |
| Capture freshness | proved first: 0 dead `/equipment` links across 44 captures, the replacement cards present, the old "Explore equipment" gone |
| Independent rescan | **865 rows**; **540 gone / 204 remain** of 744 claim-class. Unchanged — these were repairs, not claim changes |

## Deliverable 1 — KCSIE 2026 currentness: verified, nothing to change

All seven `KCSIE 2025` references were read in context and every one is legitimate: the adopted
dated notice; the historical v2.2 Safeguarding rubric that IR §6 bullets 4–5 **deliberately keep
intact** (mutant M15 guards against rewording it); the June 2026 withdrawal's basis, rendered under
the label **"Statutory basis at the time:"**; the changelog (UOS §19); a Luna negative instruction;
and one code comment. Every other KCSIE reference on the site is edition-neutral — "KCSIE duties",
"reflects KCSIE", "KCSIE-aware" — and nothing calls a third-party tool KCSIE compliant or approved.

**No change was required and none was invented.** The deliverable is closed by evidence, not by
edits.

## Deliverables 2 and 3 — five live defects, all one failure

*Removing a feature falsifies the things that describe it.*

1. **Two dead cross-sell cards.** `AITraining.tsx` → `/equipment`, `AITrainingSEND.tsx` →
   `/equipment/send`. Neither route has existed since 30 September. Replaced with retained
   destinations (the methodology page; the directory's SEND and assistive coverage) rather than left
   as gaps, because the site should read as intentionally redesigned, not cut down.
2. **`index.html` carried the superseded holding wording.** The decision-1 sweep covered `src` and
   `api` and **not the HTML shell**. It is also the one surface where "held pending re-review" is now
   actively wrong: 28 listings have never been scored, so nothing is being re-reviewed for them.
3. **`lead-capture.ts` defaulted to a removed product** — `body.offer ?? 'free-prompt-pack'`. Round
   25 stopped an unknown offer silently sending a prompt pack but left the default pointing at the
   removed product, so after that fix a caller omitting `offer` received *"unknown offer:
   free-prompt-pack"*. There is no default now: a missing offer is reported as missing.
4. **The sitemap** carried empty "AI Equipment Hub" and "Prompts Library" headings and had never
   listed `/methodology` or `/legal` — the first being the page a school checking our claims most
   needs. It now lists exactly the 21 indexable routes, no redirects.
5. **A dead module sold a removed product.** `structuredData.ts` described "equipment reviews". It
   is imported by nothing and absent from `dist`, but that is the same latent-reachability trap as
   the Pillar Card branch in record §30.4, so the copy was fixed in place. **Not deleted** — it is
   unwired, not wrong-headed.

## My own repair introduced three new claims

The replacement card read *"How we assess tools"* and *"what we verify"*, and the structured-data
fix said *"AI tool **reviews**"*. All three assert activity that is not happening. The claim rules
caught all five matches at once. It now reads "How the methodology is designed" and "AI tool
listings". Third increment in three where a repair introduced the defect it was for — worth saying
out loud rather than filing quietly.

## Five new controls, each demonstrated against its own defect

`src/test/siteIntegrity.test.ts`: every internal link resolves to a route **read from the router**;
nothing links to `/equipment*` or `/prompts*`; the sitemap lists exactly the indexable routes, no
removed product, nothing missing, no redirect; the lead-capture offers and the modal labels agree in
both directions, no offer names a removed product, and a missing offer may not be defaulted.

Each was proved by restoring its defect and watching the control fail naming it. A repair without a
control is a repair that regresses.

## Recorded, awaiting a Founder decision — not actioned

- **`src/pages/Training.tsx`** is an unrouted orphan (`/training` redirects to `/ai-training`) and
  still holds ten `url: '#'` placeholders and a **"Prompt Pack (£9.99)"** offer. None of it renders.
  Left in place because **Training is on HOLD**: deleting the legacy Training page would pre-empt
  that decision.
- **`src/components/sections/GuidesSection.tsx`** is unreferenced, with five `href="#"`
  "Download PDF" cards. Not live; wants a decision, not a guess.

## A blind spot found in the figures control

The record stated **"96 passing"** while the suite ran 104, and the figures control did not notice:
its parser reads forms like `**N routes**` and `N of M killed`, not figures sitting in prose. The
figure is corrected and the gap recorded rather than quietly patched.

## Stopped here, as instructed

**The website design update has NOT been started.** Charlie is fine-tuning the new Brand document
with ChatGPT before the design phase begins. D3 decision 10 still needs the live n8n/Luna grounding
(§8 item 6, same dependency as D5). **Safe Mode remains Charles's workstream.**
