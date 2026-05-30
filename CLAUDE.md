# GetPromptly — Project Guide

GetPromptly is **UK education trust infrastructure**: an independent, KCSIE-aligned
review platform for AI tools in education. Closer in spirit to *Which?*, *The Economist*,
or *Wirecutter* than to any AI product. The product is the verdict; the asset is the
methodology. Tagline: **"Stop Guessing. Start Getting Promptly."**

## Working conventions

- **Never push or commit unless explicitly asked.** Main branch is `main`; do work on a
  feature branch (current: `brand-alignment`). If on `main`, branch first.
- **Verify changes with `npm run build`** (`vite build`) before considering a task done.
  Other scripts: `npm run dev` (Vite dev server), `npm run preview`.
- **British English** throughout, in code copy and content.

## Structure

- `src/` — React 18 + TypeScript + Vite app (React Router, Tailwind, Radix UI, framer-motion):
  `components/` (+ `components/ui/`, `components/sections/`, `components/prompts/`), `pages/`,
  `data/`, `lib/`, `hooks/`, `utils/`, `assets/`; entry `main.tsx`, `App.tsx`, `config.ts`,
  global styles in `index.css`.
- `api/` — serverless functions: `lead-capture.ts`, `brevo-subscribe.ts`.
- `docs/brand-bible.html` — **the full brand source of truth** (v1.1). Tailwind config in
  `tailwind.config.js`; deploy notes in `DEPLOY.md`; analytics in `ANALYTICS.md`.

## Brand rules (summary — see `docs/brand-bible.html` for the canonical detail)

**The spine — 5-Pillar Trust Model.** Every tool scored 0–10 per pillar; composite =
the **Promptly Score**. Fixed order, top-clockwise, never reordered:
1. Data Privacy — Sky `#6A8CAF`
2. Safeguarding — Lime `#C8E44A` *(the brand axis)*
3. Age Suitability — Oat Deep `#8C7A52`
4. Transparency — Slate `#4A4F5C`
5. Accessibility — Clay `#D97757`

The **Pillar Card** is the signature artefact — surface it wherever a score is shown.
Never publish a score without a methodology mark + named reviewer + verified date.

**Colour.** Tokens: `--accent #C8E44A` (lime), `--accent-hover #A8C228`,
`--ground-black #1E1E1E`, `--oat #F5F2EC`, plus the five pillar tokens.
Lime sits **only on dark (`#1E1E1E`) or oat (`#F5F2EC`)** — never on white or mid-tone.
Text on lime is always `#1A1A0E`. Pillar colours are reserved for pillars. **No gradients, ever.**

**Typography — three voices, narrowly scoped:**
- **Fraunces** (serif) — display, headlines, Plain Verdict, tool names.
- **Satoshi** (sans) — body, UI, buttons, score numerals.
- **JetBrains Mono** — methodology marks, timestamps, monograms, disclosures **only**.
- Fraunces italic reserved for "Start Getting Promptly" + the Plain Verdict. No third sans-serif.

**Voice (British).** Confident, warm, rigorous, dry. Three registers: Plain Verdict /
Dry Aside / Honest Caveat. Say **"KCSIE-aware"** / "reviewed against KCSIE 2025", never
"KCSIE compliant" for a third-party tool. **Proscribed words:** revolutionary,
game-changing, disruptive, empower, leverage, seamless, cutting-edge, solutions,
transformative, journey, AI-powered, intelligent, smart, passionate about.

**Retired (do not reintroduce):** dot scatter, ambient orbs, any "ambient AI" effect,
AI-generated photography/illustration.

**8-Point pre-publish checklist** (Brand Bible §22): logo + trust-trio stamp placed •
lime only on dark/oat • Pillar Card present where a score shows • methodology mark
(`v[X.Y] · date · reviewer`) • disclosure block where a commercial relationship exists •
JetBrains Mono only for methodology/timestamps/disclosure • Words-to-Avoid clean •
Fraunces italic reserved for hero phrase + Plain Verdict.
