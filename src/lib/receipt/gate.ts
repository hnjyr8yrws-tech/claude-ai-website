/**
 * Donna Full gate (§12) — release flag for the Audit Receipt.
 *
 * The receipt publicly renders scores and pillar data, so it must pass the
 * 8-point Donna pre-publish review (Brand Bible §22) before being reachable in
 * production. Until CR + CD sign off (see docs/receipt-donna-gate.md), the
 * entry point stays hidden and generation refuses.
 *
 * To release after sign-off: set VITE_RECEIPT_DONNA_APPROVED=true in the
 * deployment environment (build-time env — Vercel project settings) and
 * redeploy. Development builds (and therefore the /dev/trust harness) are
 * always enabled so the review itself can happen.
 */
export const receiptDonnaApproved: boolean =
  import.meta.env.DEV || import.meta.env.VITE_RECEIPT_DONNA_APPROVED === 'true';
