/**
 * Receipt generation — validation + PDF blob + download trigger.
 *
 * Fail-closed twice (§13.3): the UI entry point only renders inside
 * <Rule4bGuard>, AND this module independently refuses generation when the
 * snapshot cannot stand as an audit artefact. Phase 1 refusal rule
 * (CR decision, option B — pragmatic): score + methodology version + reviewer
 * are REQUIRED; a missing verifiedDate is permitted and rendered as
 * "NOT RECORDED". Tighten to strict §13.3 once the dataset carries dates.
 *
 * This module is heavy (@react-pdf/renderer ≈ 400KB gz) — consumers MUST load
 * it via dynamic import: `const { downloadReceipt } = await import('@/lib/receipt')`.
 */

import { pdf } from '@react-pdf/renderer';
import type { TrustDisplayModel } from '@/components/trust/types';
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';
import { registerReceiptFonts } from './fonts';
import { ReceiptDocument } from './ReceiptDocument';

export class ReceiptRefusedError extends Error {
  constructor(public readonly reason: string) {
    super(`Receipt refused: ${reason}`);
    this.name = 'ReceiptRefusedError';
  }
}

/** Returns a refusal reason, or null when a receipt may be generated. */
export function validateReceiptModel(model: TrustDisplayModel): string | null {
  if (model.integrity.state !== 'verified') return `integrity is '${model.integrity.state}'`;
  if (TRUST_SUPPRESSED_DISPLAY_STATES.includes(model.displayState)) {
    return `tool is ${model.displayState === 'Withdrawn' ? 'withdrawn' : 'awaiting re-review'}`;
  }
  if (model.promptlyScore == null) return 'no published score';
  if (!model.methodology.version) return 'no methodology version';
  if (!model.reviewer.initials) return 'no reviewer';
  return null; // verifiedDate deliberately NOT required (Phase 1, option B)
}

/** Build the PDF blob from a frozen model snapshot. Throws ReceiptRefusedError. */
export async function generateReceiptBlob(
  model: TrustDisplayModel,
  snapshotAt: string = new Date().toISOString(),
): Promise<Blob> {
  const refusal = validateReceiptModel(model);
  if (refusal) throw new ReceiptRefusedError(refusal);
  registerReceiptFonts();
  return pdf(<ReceiptDocument model={model} snapshotAt={snapshotAt} />).toBlob();
}

/** Generate and save the receipt. Returns the filename used. */
export async function downloadReceipt(
  model: TrustDisplayModel,
  snapshotAt: string = new Date().toISOString(),
): Promise<string> {
  const blob = await generateReceiptBlob(model, snapshotAt);
  const date = snapshotAt.slice(0, 10);
  const filename = `getpromptly-receipt-${model.toolSlug}-${date}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return filename;
}
