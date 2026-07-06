/**
 * Receipt validation — LIGHT module, deliberately free of @react-pdf imports so
 * entry points (ToolDetail link, ReceiptModal) can gate receipt availability
 * without loading the heavy PDF chunk.
 *
 * Phase 1 refusal rule (CR decision, option B — pragmatic): score + methodology
 * version + reviewer are REQUIRED; a missing verifiedDate is permitted and
 * rendered as "NOT RECORDED". Tighten to strict §13.3 once the dataset carries
 * verification dates.
 */

import type { TrustDisplayModel } from '@/components/trust/types';
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';

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

/** Convenience for entry points: can this model produce a receipt? */
export function canGenerateReceipt(model: TrustDisplayModel): boolean {
  return validateReceiptModel(model) === null;
}
