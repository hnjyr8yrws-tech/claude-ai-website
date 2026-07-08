/**
 * Concept 5 — internal alerts from authored records (Iter 3 · Phase 1).
 *
 * Turns AUTHORED trust records — the ScoreChangeFeed + integrity-record entries
 * (score_change AND withdrawal) — into internal alerts for reviewers/ops. This
 * is the core trigger path: adding a record to the methodology data surfaces a
 * new internal alert here. No raw diffing (Phase 2), no delivery (later) —
 * detection + classification + harness visibility only.
 *
 * Change-type classification (triage priority):
 *   safeguarding (P1) — a safeguarding withdrawal, or a score dropping below the
 *                       safeguarding floor (critical significance)
 *   material     (P2) — a major score change
 *   minor        (P3) — a minor score change
 *   (a change below the noise floor generates NO internal alert — ALERT_POLICY)
 *
 * Fail-closed: a score_change on a REAL registry tool is surfaced only when the
 * tool's score is currently shown (integrity verified, not a suppressed display
 * state). A withdrawn tool's withdrawal record is itself the (safeguarding) alert.
 */
import type { ScoreChange } from '@/components/trust/types';
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';
import { TOOLS } from '@/data/tools';
import { buildTrustDisplayModel } from '@/lib/trust/trustAdapter';
import { integrityRecord, METHODOLOGY_PATH } from '@/data/methodology';
import { collectFeedChanges, daysSinceChange, FEED_WINDOW_DAYS } from './feed';
import { evaluateAlert } from './significance';
import type { AlertSignificance } from './types';

export type ChangeClassification = 'safeguarding' | 'material' | 'minor';

export interface InternalAlert {
  /** Source record id (traceability + methodology anchor). */
  recordId: string;
  kind: 'score_change' | 'withdrawal';
  classification: ChangeClassification;
  /** 1 = safeguarding (highest) … 3 = minor. */
  priority: 1 | 2 | 3;
  /** Internal-only in this phase (reviewers + ops). */
  audience: 'internal';
  /** Tool name (score_change) or a batch label like "10 tools" (withdrawal). */
  tool: string;
  /** Single-tool slug (score_change); null for a multi-tool withdrawal. */
  slug: string | null;
  change: ScoreChange | null;
  /** Reason (score_change) or summary (withdrawal). */
  summary: string;
  /** Numeric significance from ALERT_POLICY (score_change only). */
  significance: AlertSignificance | null;
  recordDate: string;
  methodologyAnchor: string;
}

const CLASS_PRIORITY: Record<ChangeClassification, 1 | 2 | 3> = {
  safeguarding: 1,
  material: 2,
  minor: 3,
};

/** Map a numeric significance to a change-type class. `none` is filtered before here. */
function classifyScoreChange(sig: AlertSignificance): ChangeClassification {
  if (sig === 'critical') return 'safeguarding'; // dropped below the safeguarding floor
  if (sig === 'major') return 'material';
  return 'minor';
}

export interface InternalAlertOptions {
  /** Only records within `windowDays` of `now`. Default false (all authored records). */
  recentOnly?: boolean;
  windowDays?: number;
}

/**
 * Build internal alerts from the current authored records. A tool with no
 * authored record simply contributes nothing (unchanged behaviour elsewhere).
 */
export function buildInternalAlerts(now: Date = new Date(), opts: InternalAlertOptions = {}): InternalAlert[] {
  const { recentOnly = false, windowDays = FEED_WINDOW_DAYS } = opts;
  const alerts: InternalAlert[] = [];

  // 1. Withdrawal records → safeguarding (highest priority).
  for (const rec of integrityRecord) {
    if (rec.type !== 'withdrawal') continue;
    if (recentOnly && daysSinceChange(rec.date, now) > windowDays) continue;
    const classification: ChangeClassification = /safeguard/i.test(rec.reasonCategory) ? 'safeguarding' : 'material';
    alerts.push({
      recordId: rec.id,
      kind: 'withdrawal',
      classification,
      priority: CLASS_PRIORITY[classification],
      audience: 'internal',
      tool: `${rec.tools.length} tool${rec.tools.length === 1 ? '' : 's'}`,
      slug: null,
      change: null,
      summary: rec.summary,
      significance: null,
      recordDate: rec.date,
      methodologyAnchor: `${METHODOLOGY_PATH}#${rec.id}`,
    });
  }

  // 2. score_change records → material / minor (fail-closed + ALERT_POLICY).
  for (const fc of collectFeedChanges()) {
    if (recentOnly && daysSinceChange(fc.change.date, now) > windowDays) continue;

    // Fail-closed for real tools: skip if the score is not currently shown.
    if (TOOLS.some((t) => t.slug === fc.tool.slug)) {
      const model = buildTrustDisplayModel(fc.tool.slug, now);
      if (model.integrity.state !== 'verified') continue;
      if (TRUST_SUPPRESSED_DISPLAY_STATES.includes(model.displayState)) continue;
    }

    const evaluation = evaluateAlert(fc.change);
    if (evaluation.significance === 'none') continue; // below noise floor — no alert

    const classification = classifyScoreChange(evaluation.significance);
    alerts.push({
      recordId: fc.id,
      kind: 'score_change',
      classification,
      priority: CLASS_PRIORITY[classification],
      audience: 'internal',
      tool: fc.tool.name,
      slug: fc.tool.slug,
      change: fc.change,
      summary: fc.change.reason ?? '(no reason recorded)',
      significance: evaluation.significance,
      recordDate: fc.change.date,
      methodologyAnchor: fc.source === 'record' ? `${METHODOLOGY_PATH}#${fc.id}` : `${METHODOLOGY_PATH}#feed-heading`,
    });
  }

  // Highest priority first; within a priority, most recent first.
  return alerts.sort((a, b) => a.priority - b.priority || (a.recordDate < b.recordDate ? 1 : -1));
}

/** Phase 1 "log the alert" — console only (dev/ops visibility). */
export function logInternalAlerts(alerts: InternalAlert[]): void {
  for (const a of alerts) {
    const delta = a.change ? ` ${a.change.from.toFixed(1)}→${a.change.to.toFixed(1)}` : '';
    // eslint-disable-next-line no-console
    console.info(`[internal-alert] P${a.priority} ${a.classification.toUpperCase()} · ${a.tool} · ${a.kind}${delta} · ${a.summary}`);
  }
}
