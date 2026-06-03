# GetPromptly — Visual Platform Review

_Read-only review of the current build (`brand-alignment`). Captured from the production
preview (`vite build` → `vite preview`, port 4173) with Playwright — desktop at 1280px,
mobile at iPhone emulation (390×844, dpr 3). No code or content was changed to produce this._

**Captured:** 2026-06-02 · 10 pages (7 desktop, 3 mobile) · screenshots in `docs/screenshots/`.

> Cross-page note: the **cookie banner** is a fixed overlay and appears at the bottom of
> several shots (expected, not a layout bug). On a few full-page captures a section below
> the fold reads blank where a `whileInView` fade-in hadn't triggered at capture time —
> these animate in normally for a real user; called out per page where relevant.

---

## 1. Homepage — `/`
![Homepage](screenshots/01-homepage.png)

**What changed this session.** Dark hero retained with the Fraunces display H1 "Stop Guessing
with AI. *Start Getting Promptly.*" (italic reserved correctly for the hero phrase). The "Ask
Luna" role widget sits in the hero; the "Which role are you?" selector (Teacher / School Leader /
SENCO / Parent / Student / School Admin) drives a role-targeted prompt/tool preview.

**What remains unfinished.** Below the role selector the page has large empty bands — several
homepage sections (the value/pillar strips, featured content) only fade in on scroll and the
full-page capture shows them blank. Worth confirming the live homepage has enough *populated*
above-and-mid-fold content; as captured it looks thin between the role block and the footer.

**Known issues.** (a) The big lime block mid-page reads as an empty panel in the capture —
verify it carries content/copy for a real visitor. (b) Cookie banner overlays the hero CTA on
first load.

**Recommended next actions.** Confirm each homepage section renders content (not just an
animated container); consider a static fallback (no opacity-0 initial state) so the page is
never blank for no-JS/!IntersectionObserver or slow loads.

---

## 2. Reviewed Tools directory — `/tools`
![Tools directory](screenshots/02-tools-directory.png)

**What changed this session.** Pillar filter chips removed; reduced to **role filters + search**
(per brief). Tool tiles show the Promptly Score in the ring, no duplicate pillar labels, and a
demo CTA. 242 tools on the controlled 16-category taxonomy (`primaryCategory`).

**What remains unfinished.** Tiles are directory-style; the editorial layer (written verdict,
screenshot thumb) isn't surfaced because those fields don't exist yet (see content-quality audit).

**Known issues.** None blocking in the captured viewport — header, filters and first card rows
render cleanly. Long list performance/pagination not assessed here.

**Recommended next actions.** Add a sort/relevance control and consider lazy-loading or
pagination for the full 242-tile grid; add verdict/screenshot once the schema lands.

---

## 3. Tool Review — `/tools/brisk-teaching`
![Tool review](screenshots/03-tool-review.png)

**What changed this session.** The **Promptly Score ring renders correctly** — five pillar
colours form a continuous ring with no black gaps, composite **8.4** in the centre, methodology
mark beneath. Below: "Promptly Score breakdown — Trusted" with per-pillar bars (Data Privacy,
Age Suitability, Safeguarding…), best-for/not-ideal-for, safeguarding & age guidance, a "Start
free trial" demo CTA, related prompt packs, training and alternatives. The critical blank-page
crash (TrainingItem `primaryCategory`) is fixed — the page renders end-to-end.

**What remains unfinished.** No written **Plain Verdict**, no per-tool **score rationale prose**,
no **screenshot** of the product — all three fields are absent from the data model (242/242).
Pillar scores are still **synthetic placeholders** (`derivePillars`), so the breakdown is
structurally real but not yet editorially sourced.

**Known issues.** A vertical white gap appears mid-page between the demo CTA and "Get more from
Brisk Teaching" (a `whileInView` section not triggered at capture); cookie banner overlays the
score breakdown.

**Recommended next actions.** Add `verdict` + score-rationale + `screenshot` to `ToolRaw` and
author them for top tools; replace synthetic pillar scores with real reviewer scores so the
breakdown is defensible.

---

## 4. Equipment Directory (Adviser) — `/ai-equipment`
![Equipment directory](screenshots/04-equipment-directory.png)

**What changed this session.** Fully repositioned from a product database to a **UK School
Equipment Adviser**: Fraunces H1 "Independent equipment advice for UK schools", a problem-first
"Ask the adviser" search ("Tell us the problem…") with example intents, and a "How we advise"
principles row (Independent / Context-first / KCSIE-aware / Honest about fit). **All numeric
equipment scores removed.** Below the fold: problem/needs cards and product type/budget/setting
filters.

**What remains unfinished.** "Ask Luna" is a CTA, not a live adviser — the intent search filters
the catalogue but doesn't yet *converse*. Amazon affiliate tag still a placeholder
(`getpromptly-21`) pending the real Associates ID — links currently point to product searches,
untagged.

**Known issues.** Cookie banner + Luna pill overlap the lower content; otherwise clean.

**Recommended next actions.** Wire the real Amazon Associates tag when provided; decide whether
"Ask Luna" should open a guided flow vs. a filtered result set.

---

## 5. Equipment Product — `/ai-equipment/product/apple-ipad-10th-gen`
![Equipment product](screenshots/05-equipment-product.png)

**What changed this session.** Product page rebuilt around **suitability, not a score** — an
"Ask Luna if this is right for me" block replaces the old score ring. Shows product type,
category, practical use and price. Missing `track` import (was crashing) fixed.

**What remains unfinished.** Affiliate link untagged (placeholder); no editorial "why a school
might choose this / watch-outs" prose beyond the suitability framing.

**Known issues.** None blocking; page renders fully.

**Recommended next actions.** Add a short authored suitability note per product for the
highest-traffic items; wire affiliate tag.

---

## 6. Training Directory — `/ai-training`
![Training directory](screenshots/06-training-directory.png)

**What changed this session.** 76 resources remapped to the controlled **11-category** training
taxonomy; broken external links (Pearson, BCS, Chartered College) fixed. Filters + cards render.

**What remains unfinished.** Same editorial gap as tools — entries are catalogue-style; no
"what you'll get / who it's for" authored layer.

**Known issues.** None blocking in the captured viewport.

**Recommended next actions.** Add level/format filters (CPD vs. guidance vs. course) if not
already present; light editorial pass on the highest-value resources.

---

## 7. Prompt Library — `/prompts`
![Prompt library](screenshots/07-prompt-library.png)

**What changed this session.** (Main-site Vite library — distinct from the separate Next.js
prompts app.) Prompt packs on the controlled 12-category taxonomy. Hero and pack grid render.

**What remains unfinished.** The richer prompt experience (600-prompt search, email-gate unlock,
Brevo capture) lives in the **separate Next.js app** (`getpromptly/`, not part of this preview
build) — the two prompt surfaces are not yet unified under one nav destination.

**Known issues.** Potential confusion between the two "prompt" surfaces (Vite `/prompts` vs. the
Next app). No layout faults observed.

**Recommended next actions.** Decide the canonical prompt library (likely the Next.js app) and
point the main nav there, or merge the experiences so there's a single Prompt Library.

---

## 8. Mobile — Homepage (`/`, 390×844)
![Mobile homepage](screenshots/08-mobile-homepage.png)

**What changed this session.** Hero, role widget and CTAs stack for mobile; no horizontal
overflow (verified earlier: `scrollWidth === 390`).

**What remains unfinished.** Same below-fold blank-band concern as desktop home.

**Known issues.** Cookie banner consumes a large share of the small viewport on first load.

**Recommended next actions.** Make the cookie banner more compact on mobile; confirm populated
content below the hero.

---

## 9. Mobile — Tools Directory (`/tools`, 390×844)
![Mobile tools](screenshots/09-mobile-tools.png)

**What changed this session.** Filters became a horizontal scroll-row of chips; tiles stack
single-column with the score ring; the earlier "cut text" report was a headless false positive —
real iPhone emulation shows **no overflow**, tap targets and cards are intact.

**What remains unfinished.** No mobile-specific sort; long grid still renders all tiles.

**Known issues.** None blocking.

**Recommended next actions.** Add pagination/lazy-load for the long mobile grid.

---

## 10. Mobile — Tool Review (`/tools/brisk-teaching`, 390×844)
![Mobile tool review](screenshots/10-mobile-tool-review.png)

**What changed this session.** Review page stacks cleanly on mobile; the score ring and pillar
breakdown render; the blank-page crash fix applies here too.

**What remains unfinished.** Same content-model gaps (verdict / rationale / screenshot).

**Known issues.** Cookie banner overlay; mid-page fade-in gap as on desktop.

**Recommended next actions.** As per desktop review (#3) — editorial fields + real pillar scores.

---

## Cross-cutting summary

| Theme | State |
|---|---|
| **Score ring** | ✅ Fixed — 5 colours, no black gaps, correct composite, methodology mark. |
| **Equipment** | ✅ Repositioned as a UK school adviser; scores removed; advisory tone. |
| **Mobile** | ✅ No horizontal overflow on any page; chips/cards stack correctly. |
| **Taxonomy** | ✅ Controlled, typed, build-gated across tools/training/prompts. |
| **Editorial depth** | 🔴 No verdict / score-rationale / screenshot fields (242/242). |
| **Pillar scores** | 🔴 Synthetic placeholders — need real reviewer scores. |
| **Affiliate** | 🟠 Placeholder tag; awaiting real Amazon Associates ID. |
| **Prompt surfaces** | 🟠 Vite `/prompts` and the Next.js app not yet unified. |
| **Homepage/below-fold** | 🟠 Confirm sections are populated, not just animated containers. |
| **Cookie banner** | 🟠 Overlays content, esp. on mobile — make compact. |

**Top 3 next actions:** (1) add `verdict` + score-rationale + `screenshot` to the tool model and
replace synthetic pillar scores with real ones; (2) unify the two prompt libraries under one nav
destination; (3) wire the real Amazon Associates tag and decide the "Ask Luna" interaction model.
