/**
 * Concept 5 — the dry-run runner. Iterates composed alerts, fires
 * `alert_trigger_evaluated` per alert, and returns a report. Delivers NOTHING.
 * Spec: docs/concept-5-score-change-alert.md §6.
 */
import { track } from '@/utils/analytics';
import type { ScoreChangeAlert } from './types';

export interface DryRunReport {
  alerts: ScoreChangeAlert[];
  evaluated: number;
  /** How many the policy would notify on (still not delivered in dry-run). */
  wouldSend: number;
}

export interface DryRunOptions {
  /** Default true. `false` throws — no delivery channel exists yet (Iter 3). */
  dryRun?: boolean;
  /** Skip the analytics emission (e.g. pure unit tests). Default false. */
  silent?: boolean;
}

/**
 * Evaluate a batch of alerts. Emits `alert_trigger_evaluated` once per alert
 * (unless `silent`), returns the tally. Fail-closed: a non-dry-run call throws
 * so a real send can never happen by accident before a channel is wired.
 */
export function runAlertDryRun(alerts: ScoreChangeAlert[], opts: DryRunOptions = {}): DryRunReport {
  const dryRun = opts.dryRun ?? true;
  if (!dryRun) {
    throw new Error('runAlertDryRun: no delivery channel configured — real sends land in Iteration 3 (n8n).');
  }

  let wouldSend = 0;
  for (const a of alerts) {
    if (a.evaluation.wouldSend) wouldSend += 1;
    if (!opts.silent) {
      track({
        name: 'alert_trigger_evaluated',
        toolId: a.toolId,
        wouldSend: a.evaluation.wouldSend,
        delta: a.evaluation.delta,
      });
    }
  }

  return { alerts, evaluated: alerts.length, wouldSend };
}
