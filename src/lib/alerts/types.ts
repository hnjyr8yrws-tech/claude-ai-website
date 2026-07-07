/**
 * Concept 5 — Score Change Alert: types.
 * See docs/concept-5-score-change-alert.md for the spec.
 */
import type { ScoreChange, DisplayState } from '@/components/trust/types';

export type AlertSignificance = 'none' | 'minor' | 'major' | 'critical';

export type AlertKind = 'score_change' | 'withdrawal';

/** Pure result of scoring a single change against ALERT_POLICY. */
export interface AlertEvaluation {
  significance: AlertSignificance;
  /** Whether policy says this should notify (dry-run still never delivers). */
  wouldSend: boolean;
  /** Signed `to − from`, rounded to 1 dp. 0 for withdrawals. */
  delta: number;
  /** Human-readable trace of which rule(s) fired — for the harness + review. */
  reasons: string[];
}

/** The minimal per-tool context an alert needs, independent of the change. */
export interface AlertContext {
  toolId: string;
  toolSlug: string;
  toolName: string;
  livePageUrl: string;
  methodologyVersion: string;
  /** Reviewer initials. */
  reviewer: string;
  /** Current display state — drives withdrawal detection + fail-closed. */
  displayState: DisplayState;
  /** Current integrity state — 'verified' gates score_change alerts. */
  integrityState: string;
}

/** A composed, delivery-agnostic alert. `change` is null for withdrawals. */
export interface ScoreChangeAlert {
  kind: AlertKind;
  toolId: string;
  toolSlug: string;
  toolName: string;
  livePageUrl: string;
  change: ScoreChange | null;
  evaluation: AlertEvaluation;
  methodologyVersion: string;
  reviewer: string;
}
