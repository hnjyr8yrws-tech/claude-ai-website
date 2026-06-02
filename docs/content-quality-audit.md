# Tool Reviews — Content Quality Audit

Scope: all **242** published tool reviews in `src/data/tools.ts` (1 flagged `reviewNeeded`). No changes made.

## Headline
The per-tool **text that exists is fine** (every tool has a description and a working link; none are missing, duplicated, or too short). The real gaps are **structural**: the data model has **no fields** for screenshots, written verdicts, or score rationale, and the per-tool nuance (best-for / not-ideal-for / age notes) is **100% machine-derived, not editorially written**. For a platform whose value proposition is the *verdict*, the reviews currently read as a high-quality *directory listing*, not editorial reviews.

## Findings by check

| Check | Result | Count |
|---|---|---|
| Missing descriptions | ✅ none | 0 / 242 |
| Weak descriptions (length) | ✅ none under 8 words | 0 (range 8–18 words, avg 12.6) |
| Generic descriptions | ⚠️ proscribed/marketing words | 4 |
| Duplicate descriptions | ✅ none | 0 |
| Missing links (outbound `url`) | ✅ none | 0 / 242 |
| Missing affiliate links | n/a — tools use a direct outbound `url`; affiliate monetisation is equipment-only | — |
| Missing screenshots | 🔴 **no image field exists in the model** | 242 / 242 |
| Missing Promptly Score explanation | 🔴 **no per-tool written rationale** (only auto-derived pillar bars + a generic tier sentence) | 242 / 242 |
| Missing verdicts | 🔴 **no `verdict` field**; the one-line `desc` is a feature blurb, not an editorial Plain Verdict | 242 / 242 |
| Authored best-for / not-ideal-for / age-notes | 🟠 all **auto-derived**, none human-written | 0 / 242 authored |

---

## CRITICAL

1. **No screenshots on any review (242/242).** The data model has no `screenshot`/`image` field. A review platform without product visuals is a major credibility and UX gap. *(Requires a schema addition + asset pipeline.)*
2. **No written Promptly Score explanation (242/242).** Scores render as pillar bars + a generic tier sentence (`tierAction`), but there is **no per-tool prose explaining why a tool scored as it did**. For a platform built on score integrity ("a user should understand how the score was produced"), this is the most important content gap. *(Compounded by the fact that the pillar scores themselves are currently synthetic placeholders.)*
3. **No editorial verdicts (242/242).** There is no `verdict` field; the Brand Bible's signature "Plain Verdict" is absent. The `desc` is a neutral feature description, not a point of view. The brand's core promise — *"the product is the verdict"* — is not yet delivered in the data.

## IMPORTANT

4. **Best-for / Not-ideal-for / Age notes are 100% machine-derived (0/242 authored).** These read as plausible boilerplate (e.g. "Teachers looking for X support") rather than reviewer judgement — the substance a school leader actually wants. They should become authored fields for at least the top/most-viewed tools.
5. **4 generic / proscribed-word descriptions** (Brand Bible words-to-avoid):
   - MagicSchool.ai — "**All-in-one** AI platform…"
   - ChatGPT — "…**powerful** but requires…"
   - Beautiful.ai — "AI **smart** presentation tool…"
   - Todoist AI — "**smart** scheduling…"

## NICE TO HAVE

6. **Descriptions are uniformly short (8–18 words, avg 12.6).** Adequate as one-liners, but thin for a "review." Could be enriched once verdicts/screenshots exist.
7. **Tone consistency pass** on the full set once the proscribed-word ones are fixed.

---

## Summary of what's needed (for later — no changes made)
- **Schema additions:** `screenshot`, `verdict`, and a score-rationale field on the tool model.
- **Editorial pass:** author verdicts + score rationale + best-for/not-ideal-for for at least the highest-traffic tools (auto-derive can remain a fallback).
- **Quick win:** reword the 4 generic descriptions to remove proscribed words.
- **Prerequisite for #2:** real per-pillar review scores (the scores are currently synthetic placeholders), so the rationale matches the data.
