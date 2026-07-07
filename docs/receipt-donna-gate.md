# Donna Full Gate — Demo Audit Receipt (Concept 3)

**Status: ✅ SIGNED OFF (2026-07-07) — READY TO FLIP THE GATE.** All 8 §22
checkpoints pass; both blockers (Cp 2 lime-on-white, Cp 5 disclosure) are
resolved; CR and CD have signed. The receipt renders public scores and pillar
data, so it is Full-gated (§12) behind a release flag — which has **not yet been
flipped**. Until `VITE_RECEIPT_DONNA_APPROVED=true` is set, the ToolDetail entry
link stays hidden in production and generation refuses (`src/lib/receipt/gate.ts`).

**To release (now approved):** set `VITE_RECEIPT_DONNA_APPROVED=true` in the
Vercel project environment and redeploy. Development builds (and `/dev/trust`)
are always enabled so this review could be performed.

**Review surfaces:** the modal preview (ToolDetail → "Save this as a receipt…"
in a dev/preview build, or `/dev/trust` → "Open modal") and the downloaded PDF.

---

## The 8-point checklist (Brand Bible §22) applied to the receipt

| # | Check | Status | Notes |
|---|---|---|---|
| 1 | Logo + trust-trio stamp placed | ✅ Pass | **CD-approved 2026-07-07:** Fraunces **text wordmark** accepted for the PDF (diamond-stamp lockup not required for this artefact). Trust-trio `UK EDUCATION · KCSIE 2025 · INDEPENDENT` present in header + modal. |
| 2 | Lime only on dark/oat | ✅ Pass | FIXED 2026-07-07: the §12 headline dash is now **ink-accent (#46540E)**, not lime (`accentDash`). Lime now appears ONLY on the centre-disc ring on ground-black (dark ✓). No lime on white remains. |
| 3 | Pillar Card present where a score shows | ✅ Pass | §04 ring embedded in PDF + real card in modal; wedge opacity precomputed. Fail-closed refuses receipts for unscored/suppressed tools, so a number never shows without the card. |
| 4 | Methodology mark (`v[X.Y] · date · reviewer`) | ✅ Pass | **CR-approved 2026-07-07:** `VERIFIED NOT RECORDED` wording accepted for empty dates (option B). Mark present on card face + document body; cites the tool's own published version. |
| 5 | Disclosure block where a commercial relationship exists | ✅ N/A (conditional) | **CR-approved 2026-07-07.** Audit (2026-07-07): **0 of 242** scored tools carry an affiliate/commercial URL (`affiliate`/`ref=`); `LinkType` has no commercial variant; the affiliate registry xlsx is not wired into app data. The block is built and fail-safe (renders only on `disclosure.present`, never invents). **GUARD:** this N/A holds *only while no scored tool has a commercial relationship* — disclosure MUST be wired before any affiliate/`ref=` URL is added to a scored tool (or the affiliate registry is wired into the model's `disclosure` field). |
| 6 | JetBrains Mono only for methodology/timestamps/disclosure | ✅ Pass | **CD-approved 2026-07-07:** mono kickers (`AUDIT RECEIPT`, `PILLAR BREAKDOWN`) accepted — consistent with the live methodology-page kicker precedent. Core marks/timestamps/`DISCLOSURE` are mono; bands are sans. Body is **Helvetica** (Satoshi interim, see below — CD-accepted). |
| 7 | Words-to-Avoid clean | ✅ Pass | Full copy scan clean; "KCSIE 2025-**aligned**" (never "compliant"), "independent guidance, not approval". |
| 8 | Fraunces italic reserved for hero phrase + Plain Verdict | ✅ Pass | No Fraunces italic used anywhere; verdict line correctly omitted (no data source) rather than invented. |

## Sign-off

| Role | Scope | Date | Signature/initials |
|---|---|---|---|
| CR (commercial/product) | Cp 4 (`NOT RECORDED` wording) · Cp 5 (Disclosure = N/A, conditional) | 2026-07-07 | **CR ✓** |
| CD (creative/brand) | Cp 1 (text wordmark) · Cp 6 (mono kickers) · Satoshi interim (Helvetica) | 2026-07-07 | **CD ✓** |

## Where the gate now stands

- **All 8 checkpoints: Pass** (Cp 5 = N/A conditional).
- **Both blockers resolved:** Cp 2 (lime-on-white) fixed in code; Cp 5 (disclosure) resolved by audit → N/A (conditional).
- **All sign-offs complete:** CR + CD signed 2026-07-07.
- **➡️ The receipt is READY for the gate to be flipped.** Set
  `VITE_RECEIPT_DONNA_APPROVED=true` in Vercel and redeploy; the
  "Save this as a receipt…" link then appears on verified tool pages.
  *(The flag is intentionally still `false` — flipping it is a separate,
  explicit deployment step, not part of this change.)*

## Open items feeding this gate

1. **Satoshi PDF-embedding licence — CD-accepted interim (still open upstream).**
   CD approved shipping with **Helvetica** body text for now (2026-07-07), so this
   does not block go-live. The licence question itself remains open: Fontshare's
   site is a JS application and the ITF Free Font License text could not be
   retrieved programmatically (attempted 2026-07-06); it needs a human read of
   fontshare.com/terms (or an email to ITF) on **embedding font data in
   distributed PDFs**. When cleared, swap body text to Satoshi. Fraunces +
   JetBrains Mono are OFL (embedding permitted — see `public/fonts/README.md`).
2. **Verification dates** — most published tools carry an empty `verifiedDate`,
   so most receipts read `VERIFIED NOT RECORDED`. Acceptable interim per the
   option-B decision, but the dataset fix raises receipt quality materially.
3. **Verdict line** — §14 Plain Verdicts have no data source; the receipt omits
   the line entirely rather than inventing copy.
