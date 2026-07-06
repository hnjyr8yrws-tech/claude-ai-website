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
import { registerReceiptFonts } from './fonts';
import { ReceiptDocument } from './ReceiptDocument';
import { validateReceiptModel, ReceiptRefusedError } from './validate';

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
