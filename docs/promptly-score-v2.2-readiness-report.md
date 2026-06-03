# Promptly Score v2.2 — Readiness Report (Top 25)

Assessment of whether each Top-25 tool can be **scored under the v2.2 standard** on the
evidence collected so far (desk research, 2026-06-03, see `top-25-tool-evidence-audit.md`).

**No live scores updated. No UI changed. No tool scored.** This report only states *readiness*.

A reminder of two v2.2 rules that drive readiness:
- **Safeguarding and Data Privacy can never be N/A** and have no floor exception — a tool with no verifiable Safeguarding *or* Privacy evidence cannot be scored.
- **Desk Review caps Safeguarding & Privacy at 8.5** — every tool here is desk-basis, so none can reach the top band on those pillars until hands-on/classroom evidence is added.

## Status per tool

### ✅ Ready for scoring (desk basis — 5)
Verifiable evidence on all required pillars (Safeguarding + Privacy present; Age/Transparency/Accessibility present or legitimately N/A). Can be desk-scored now, **capped at 8.5 on Safeguarding/Privacy**, with a second-reader check.
- **MagicSchool.ai** — full desk evidence; the only tool with real sub-scores (calibration anchor).
- **Google Classroom** — education privacy notice, age policy, WCAG 2.2 VPAT, transparency all verified.
- **ClassDojo** — COPPA/FERPA certified, independent WCAG 2.2 ACR, transparency page (highest confidence).
- **CPOMS** — Safeguarding/Privacy/Accessibility verified; Age & Transparency legitimately N/A (staff-facing, non-AI) with justification → rescale weights.
- **Quizizz (Wayground)** — ISO 27001, COPPA/GDPR, accessibility statement, GPT-5 disclosure all verified.

### 🟠 Missing evidence (16)
Has gaps on one or more pillars that must be closed before a defensible score. (Where the gap is **Safeguarding** it is blocking, because Safeguarding cannot be N/A.)
- **ChatGPT** — Privacy Policy & Terms only 403/search-verified, not directly fetched; WCAG levels unread.
- **Gemini** — no clear consumer minimum age; VPAT covers Workspace, maybe not the consumer app.
- **Microsoft Copilot** — minimum age `EVIDENCE NOT AVAILABLE`; no Copilot-specific accessibility ACR.
- **Claude** — accessibility VPAT NDA-gated (`EVIDENCE NOT AVAILABLE`); 18+ floor limits pupil use.
- **Canva** — AI (Magic Studio) transparency `EVIDENCE NOT AVAILABLE`; trust/DPA pages 403.
- **Kooth** — accessibility WCAG conformance unverifiable; no formal DPA / clinical-accreditation page.
- **Sparx Maths** — no dedicated **Safeguarding** policy (blocking); no WCAG level; T&Cs/DPA not fetchable.
- **Texthelp Read&Write** — **Safeguarding** stance `EVIDENCE NOT AVAILABLE` (can't N/A); Texthelp→Everway rebrand; min age unverified.
- **Immersive Reader** — **Safeguarding** stance `EVIDENCE NOT AVAILABLE` (can't N/A); product-specific ACR + applicable DPA unclear.
- **Goblin Tools** — Safeguarding & Accessibility `EVIDENCE NOT AVAILABLE`; **18+ scope** → not for pupil use.
- **Diffit** — model/Transparency `EVIDENCE NOT AVAILABLE`; WCAG statement blocked (403); US residency.
- **Curipod** — Age & Accessibility `EVIDENCE NOT AVAILABLE` (JS-rendered pages); also student-facing → hands-on later.
- **Century Tech** — Accessibility `EVIDENCE NOT AVAILABLE`; no DPA/sub-processor list or certs.
- **Satchel One** — minimum age + accessibility `EVIDENCE NOT AVAILABLE`; **AWS hosting-region contradiction** (UK vs Ireland).
- **Brisk Teaching** — Accessibility `EVIDENCE NOT AVAILABLE`; AI models not named.
- **Kahoot!** — AI model/Transparency `EVIDENCE NOT AVAILABLE`; VPAT/ACR not directly inspected.

### 🔬 Requires hands-on testing (2)
Student-facing generative AI whose safeguarding/age claims are vendor self-assertions that must be **behaviourally tested** before any score publishes (also have documentary gaps).
- **SchoolAI** — student chat ("Dot"); accessibility `EVIDENCE NOT AVAILABLE`; DPA/SOC2 gated. Test moderation/crisis-alert behaviour.
- **Khanmigo** — student AI tutor; core policies only search-verified (JS/403); no first-party model disclosure. Test moderation + teacher visibility.

### 🎓 Requires classroom trial (0 as the blocking gate)
No tool is gated *solely* on a classroom trial right now — every current gate is documentary or hands-on first. Classroom trial is the **recommended later basis-lift** for the Age/Accessibility-critical, pupil-facing tools (notably **ClassDojo**, **Duolingo**, **SchoolAI**, and the SEND tools **Texthelp**, **Immersive Reader**) once desk + hands-on evidence is in place.

### ⛔ Not currently scoreable (2)
Too many pillars unverified — including the legal-barrier pillars — to produce a defensible score.
- **Seneca Learning** — 4 of 5 pillars `EVIDENCE NOT AVAILABLE` (incl. Safeguarding); only Privacy verified.
- **Duolingo** — Safeguarding, Accessibility, Transparency `EVIDENCE NOT AVAILABLE`; privacy/age JS-rendered (search-only).

---

## Major evidence gaps (cross-cutting)
1. **Accessibility conformance** is the single most common gap — VPATs are frequently request-only, NDA-gated, blocked (403), or absent (SchoolAI, Seneca, Duolingo, Goblin, Century, Satchel, Brisk; app-level CPOMS).
2. **AI model / version transparency** is widely undisclosed (Canva, Diffit, Kahoot, Brisk; first-party for Khanmigo; Seneca, Duolingo).
3. **Blocked / JS-rendered core policy pages** prevented direct verification (ChatGPT, Khanmigo, Duolingo, Curipod, Canva) — these need a human in a real browser.
4. **DPAs are commonly gated** (request-only), so UK GDPR terms, data residency and sub-processors can't be confirmed from public pages (SchoolAI, Curipod, Century, Wayground, MagicSchool).
5. **Minimum-age clauses unclear** for consumer products (Gemini, Microsoft Copilot, Satchel One, Seneca).
6. **US data residency / DPF reliance** needs UK-GDPR assessment (ClassDojo, Diffit, MagicSchool US-framing).
7. **Safeguarding stance for non-generative assistive tools** (Texthelp, Immersive Reader, Sparx) — Safeguarding can't be N/A, so each needs an explicit reviewer stance even where the harm surface is low.

## Tools requiring human review
**All 25** carry *Human review required: Yes* — every record is desk-basis and rests on vendor self-assertion, not tested behaviour. Highest priority for human verification:
- **Blocked-page tools** (must be opened in a browser): ChatGPT, Khanmigo, Duolingo, Curipod, Canva.
- **Contradiction to resolve:** Satchel One (AWS UK vs Ireland hosting).
- **Student-facing AI to test before publishing:** SchoolAI, Khanmigo (and Curipod, Brisk Boost).
- **18+ scope vs pupil use:** Goblin Tools, Claude, Diffit, Brisk (verify who actually uses them).

## Recommended next actions
1. **Confirm the migration calibration tolerances first** (±0.5 pillar / ±0.3 composite are provisional) — the migration workbook says *do not publish v2.2 scores until confirmed*.
2. **Score the 5 "Ready" tools as the first calibration batch** (desk basis, capped 8.5 on Safeguarding/Privacy, blind pillar scoring, second-reader), using **MagicSchool.ai as the anchor**.
3. **Close documentary gaps for the 16 "Missing evidence" tools** — request DPAs/VPATs, and have a human open the blocked/JS-rendered policy pages.
4. **Hands-on test the 2 student-facing AI tools** (SchoolAI, Khanmigo) before any score is assigned.
5. **Park Seneca Learning and Duolingo** until their core Safeguarding/Privacy documents are verified.
6. **Do not update any live score or the UI** until the above is reviewed and signed off.

---

*Methodology v2.2 · evidence dated 2026-06-03 · source of truth `~/Documents/methodology`. No scores assigned; no live scores or UI changed.*
