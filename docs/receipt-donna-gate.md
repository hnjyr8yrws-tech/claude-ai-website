# Donna Full Gate — Demo Audit Receipt (Concept 3)

**Status: ⏳ AWAITING SIGN-OFF.** The receipt renders public scores and pillar
data, so it is Full-gated (§12) behind a release flag. Until this document is
signed, the ToolDetail entry link is hidden in production and generation
refuses (`src/lib/receipt/gate.ts`).

**To release after sign-off:** set `VITE_RECEIPT_DONNA_APPROVED=true` in the
Vercel project environment and redeploy. Development builds (and `/dev/trust`)
are always enabled so this review can be performed.

**Review surfaces:** the modal preview (ToolDetail → "Save this as a receipt…"
in a dev/preview build, or `/dev/trust` → "Open modal") and the downloaded PDF.

---

## The 8-point checklist (Brand Bible §22) applied to the receipt

| # | Check | Status | Notes |
|---|---|---|---|
| 1 | Logo + trust-trio stamp placed | ☐ | Wordmark (Fraunces) + `UK EDUCATION · KCSIE 2025 · INDEPENDENT` in the PDF header and modal. Diamond-stamp lockup NOT used (text wordmark only) — CD to confirm acceptable for the PDF |
| 2 | Lime only on dark/oat | ☐ | Lime appears: centre-disc ring on ground-black (✓ dark), §12 dash on white — **CD ruling needed** (the methodology page precedent puts the dash on oat, not white) |
| 3 | Pillar Card present where a score shows | ☐ | §04 ring embedded in PDF + real card in modal; wedge opacity precomputed (see P1 notes) |
| 4 | Methodology mark (`v[X.Y] · date · reviewer`) | ☐ | Present on card face + document body. Missing dates render `VERIFIED NOT RECORDED` (option-B decision) — CR to confirm the wording |
| 5 | Disclosure block where a commercial relationship exists | ☐ | Rendered when `disclosure.present` — no data source populates it yet; confirm acceptable for launch |
| 6 | JetBrains Mono only for methodology/timestamps/disclosure | ☐ | Mono: trio, doc label, marks, timestamps. Body: **Helvetica** (Satoshi pending licence — see below) — CD to confirm acceptable interim |
| 7 | Words-to-Avoid clean | ☐ | Copy to review: "This receipt is a dated snapshot…", footer "independent, KCSIE 2025-aligned reviews… independent guidance, not approval" ("aligned", never "compliant" ✓) |
| 8 | Fraunces italic reserved for hero phrase + Plain Verdict | ☐ | No italic used; verdict line absent (no data source) ✓ |

## Sign-off

| Role | Name | Date | Signature/initials |
|---|---|---|---|
| CR (commercial/product) | | | |
| CD (creative/brand) | | | |

## Open items feeding this gate

1. **Satoshi PDF-embedding licence — UNRESOLVED.** Fontshare's site is a JS
   application; the ITF Free Font License text could not be retrieved
   programmatically for verification (attempted 2026-07-06). Requires a human
   read of fontshare.com/terms (or an email to ITF) specifically on **embedding
   font data in distributed PDFs** (distinct from web use). Until cleared, PDF
   body text is Helvetica; Fraunces + JetBrains Mono are OFL (embedding
   permitted — see `public/fonts/README.md`).
2. **Verification dates** — most published tools carry an empty `verifiedDate`,
   so most receipts read `VERIFIED NOT RECORDED`. Acceptable interim per the
   option-B decision, but the dataset fix raises receipt quality materially.
3. **Verdict line** — §14 Plain Verdicts have no data source; the receipt omits
   the line entirely rather than inventing copy.
