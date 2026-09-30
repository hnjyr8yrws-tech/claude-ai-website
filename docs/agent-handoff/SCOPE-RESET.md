# Round 24 — product scope reduction, as executed

**Direction being executed** (Founder, 30 September 2026): *"AI Equipment and prompts will be
removed. Any affiliate links will also be removed. We are focusing more on tool reviews and Safe
Mode. Training is undecided for now."* — followed by the nine numbered execution steps.

**Nothing is committed, pushed, merged or deployed.** This file reports what the working tree now
contains.

---

## 1. Steps, and where each one stands

| # | Step | Status |
|---|---|---|
| 1 | Treat Equipment / Prompts / affiliate as removal scope | done |
| 2 | Precise removal map before deleting anything | done — `phase2d/SCOPE-REDUCTION-MAP.md`, written first |
| 3 | One controlled scope-reduction pass, preserving evidence | done for the main app; **one step BLOCKED** in the `getpromptly/` mirror — see §10.5 |
| 4 | Remove affiliate links and selection logic from retained surfaces | done, including the Training HOLD surfaces (links only) |
| 5 | Leave Training unchanged as HOLD | done — no content, order, pricing or copy change; only its affiliate links removed |
| 6 | Re-run the full proof, reseal, freeze the retained candidate | **done** — 96/96 tests, 115/125 mutants killed (10 retired, 0 survived), 42 DOM routes 0 problems, `phase2c` re-sealed 31/31, frozen tree `0212b7e426658cad8b209d72f596dd1c7118f69a` reproduces from `origin/main` + patch |
| 7 | Regenerate the D3 pack from retained surfaces only | done — see `d3-review/` and `d3-review/CARRIED-FORWARD.md` |
| 8 | Continue D3 on the regenerated pack | ready for you; 92 open decisions, 27 pre-filled from your earlier answers |
| 9 | Then the governed tool-refresh programme and Safe Mode | not started; gated on D3 and on containment being CLEAR |

## 2. What was removed

26 routes · 24 page components · the prompt components · equipment and prompt data ·
`src/utils/affiliateLinks.ts` · three unused section components that existed only for those
features. Then everything that existed only because those features did: the sitemap (34 `<loc>` →
19), Luna's grounding (two modes, two personas, five role contexts rewritten), the quick-find
quizzes, analytics events, cross-sell icons and types, search aliases, eight lead-capture offers,
and the newsletter and welcome-email copy that promised prompt packs.

**Net: 109 tracked files changed, +938 / -15,870** against `origin/main`
(`git diff --shortstat origin/main -- . ':!node_modules'`, 30 September 2026).

**Evidence preserved, not deleted:** `phase2d/removed-product-data/` holds `equipment.ts`,
`prompts.ts`, `promptsLibrary.ts` and both `prompts_master.csv` copies with a `MANIFEST.sha256`.
UOS §19 forbids inventing provenance; it equally forbids destroying it.

## 3. Two things worth your attention

**No tool link ever carried a commission parameter.** 0 of 241 URLs in `tools.ts` had one, so
`ToolDetail`'s *"This is an affiliate link — GetPromptly may earn a small commission"* disclosure
was unreachable code. The only live instance of that claim class was the equipment shortlist
disclosure, already corrected in round 22.

**Removing product falsified copy that described the product.** Two live false claims were created
by the removal itself and caught by the proof layers:

- `/who-we-are` said **"Four sections. One platform."** over a grid that now holds two.
- `/` said **"Four sections. One trusted source."** over two cards, and still advertised prompt
  packs, a "Get 20 free prompts" email offer, and "Copy prompts instantly" as step 4 of how the
  site works.

Both corrected. The harness also caught **six of my own new phrasings** while I rewrote Luna's
starters, the Schools FAQ and the welcome emails; all six were repaired in the copy rather than
excused with an allowlist entry.

## 4. What the reduction did to the assurance pack

Four controls were true of the old shape and false of the new one. Each was caught by a control,
not by me:

- **18 allowlist entries excused nothing** once their surfaces were gone — the whole declared
  equipment blind spot among them. Removed.
- **The corpus floor** (`>150` files) failed at 149. Re-baselined to `>140` against the retained
  product, with the reason recorded in the code.
- **Nine mutants lost their subject file.** They are now `RETIRED (surface removed)`, named
  individually with the surface each died with, each still getting a row. A live mutant whose file
  has vanished now **aborts** the pack rather than being skipped. A tenth, M108, lost its *anchor*
  with the prompt CSV and is recorded `RETIRED (anchor removed)`: the harness now carries no
  column-scoped CSV allow, so that mechanism is unexercised.
- **The equipment blind spot is empty, and the transcript says why** — `0 claim-class hits across 0
  routes`, with the words *"empty because the surface no longer exists, not because it was
  cleared"*. The counter stays live in case an equipment route ever returns.

A new defect class was also found: **the DOM allowlist is keyed by capture filename**, so adding a
Luna probe on `/methodology` stripped that page of its fourteen reasoned allows and reported them
as 16 live problems on copy that had not changed. Interaction captures now inherit their page's
allows, derived from the route lists rather than enumerated.

## 5. The reach figure is withdrawn, not carried forward

The **6 of 15** measured reach was taken on the old, larger corpus. It is **not** quoted as current
anywhere in the regenerated pack: the product changed and reach has not been re-measured on these
bytes. Re-measuring it is on the list, after D3.

## 6. What this does not change

Nothing here makes a claim about a tool more supportable. `GOV-GAP-001` and `GOV-GAP-002` are
unchanged, calibration is still blocked, and **RL-017 trigger 7 still blocks shipping**. Removing a
page is not evidence about a score.
