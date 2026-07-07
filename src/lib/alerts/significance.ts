/**
 * Concept 5 — the significance policy. PURE: no React, no I/O, no analytics —
 * unit-testable in isolation. All thresholds live in ALERT_POLICY.
 * Spec: docs/concept-5-score-change-alert.md §3.
 */
import type { ScoreChange } from '@/components/trust/types';
import { pillarBand } from '@/data/publicPillars';
import type { AlertEvaluation, AlertSignificance } from './types';

export const ALERT_POLICY = {
  /** `to` below this is always critical, regardless of direction. */
  safeguardingFloor: 6.0,
  /** |Δ| at or above this is major. */
  majorDelta: 1.0,
  /** |Δ| below this is noise (`none`). */
  noiseFloor: 0.3,
  /** Asymmetry: a minor downgrade notifies; a minor upgrade does not. */
  minorDowngradeSends: true,
  minorUpgradeSends: false,
} as const;

/** Round to 1 dp so 7.4 − 6.8 is 0.6, not 0.6000000000000005. */
const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Score a single numeric change. `critical → major → minor → none`, floor first.
 * Withdrawals are NOT handled here (they bypass the numeric logic) — see
 * buildAlerts' withdrawal path.
 */
export function evaluateAlert(change: Pick<ScoreChange, 'from' | 'to'>): AlertEvaluation {
  const delta = round1(change.to - change.from);
  const abs = Math.abs(delta);
  const reasons: string[] = [];

  let significance: AlertSignificance;

  if (change.to < ALERT_POLICY.safeguardingFloor) {
    significance = 'critical';
    reasons.push(`score ${change.to} below safeguarding floor (${ALERT_POLICY.safeguardingFloor})`);
  } else {
    const bandFrom = pillarBand(change.from);
    const bandTo = pillarBand(change.to);
    const crossedBand = bandFrom !== bandTo;

    if (abs >= ALERT_POLICY.majorDelta) {
      significance = 'major';
      reasons.push(`|Δ| ${abs} ≥ ${ALERT_POLICY.majorDelta}`);
    } else if (crossedBand) {
      significance = 'major';
      reasons.push(`band boundary crossed (${bandFrom ?? '—'} → ${bandTo ?? '—'})`);
    } else if (abs >= ALERT_POLICY.noiseFloor) {
      significance = 'minor';
      reasons.push(`|Δ| ${abs} in [${ALERT_POLICY.noiseFloor}, ${ALERT_POLICY.majorDelta})`);
    } else {
      significance = 'none';
      reasons.push(`|Δ| ${abs} below noise floor (${ALERT_POLICY.noiseFloor})`);
    }
  }

  const wouldSend = decideSend(significance, delta);
  return { significance, wouldSend, delta, reasons };
}

function decideSend(significance: AlertSignificance, delta: number): boolean {
  switch (significance) {
    case 'critical':
    case 'major':
      return true;
    case 'minor':
      return delta < 0 ? ALERT_POLICY.minorDowngradeSends : ALERT_POLICY.minorUpgradeSends;
    case 'none':
    default:
      return false;
  }
}

/** Fixed evaluation for a withdrawal / awaiting-re-review — always critical. */
export function withdrawalEvaluation(): AlertEvaluation {
  return {
    significance: 'critical',
    wouldSend: true,
    delta: 0,
    reasons: ['tool withdrawn / awaiting re-review (score suppressed)'],
  };
}
