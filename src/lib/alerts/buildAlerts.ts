/**
 * Concept 5 — compose ScoreChangeAlerts from trust data. Consumes the
 * TrustDisplayModel (the r4 read path) — never the registry directly.
 * Spec: docs/concept-5-score-change-alert.md §7.
 */
import type { ScoreChange, TrustDisplayModel } from '@/components/trust/types';
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';
import { evaluateAlert, withdrawalEvaluation } from './significance';
import type { AlertContext, ScoreChangeAlert } from './types';

/** Derive the per-tool alert context from a model. */
export function contextFromModel(model: TrustDisplayModel): AlertContext {
  return {
    toolId: model.toolId,
    toolSlug: model.toolSlug,
    toolName: model.toolName,
    livePageUrl: model.livePageUrl,
    methodologyVersion: model.methodology.version,
    reviewer: model.reviewer.initials,
    displayState: model.displayState,
    integrityState: model.integrity.state,
  };
}

/** Compose one `score_change` alert from a change + context. */
export function alertFromChange(change: ScoreChange, ctx: AlertContext): ScoreChangeAlert {
  return {
    kind: 'score_change',
    toolId: ctx.toolId,
    toolSlug: ctx.toolSlug,
    toolName: ctx.toolName,
    livePageUrl: ctx.livePageUrl,
    change,
    evaluation: evaluateAlert(change),
    methodologyVersion: ctx.methodologyVersion,
    reviewer: ctx.reviewer,
  };
}

/** Compose the withdrawal alert (score suppressed — the sanctioned exception). */
export function withdrawalAlert(ctx: AlertContext): ScoreChangeAlert {
  return {
    kind: 'withdrawal',
    toolId: ctx.toolId,
    toolSlug: ctx.toolSlug,
    toolName: ctx.toolName,
    livePageUrl: ctx.livePageUrl,
    change: null,
    evaluation: withdrawalEvaluation(),
    methodologyVersion: ctx.methodologyVersion,
    reviewer: ctx.reviewer,
  };
}

/**
 * Build all alerts for one tool from its model.
 *
 * Fail-closed (Trust Policy 1):
 * - A suppressed display state (Withdrawn / AwaitingReReview) yields ONLY the
 *   withdrawal alert — never a numeric score_change alert.
 * - score_change alerts are produced only when integrity is verified; we do not
 *   assert a number we cannot currently stand behind.
 */
export function buildAlertsForModel(model: TrustDisplayModel): ScoreChangeAlert[] {
  const ctx = contextFromModel(model);

  if (TRUST_SUPPRESSED_DISPLAY_STATES.includes(model.displayState)) {
    return [withdrawalAlert(ctx)];
  }

  if (model.integrity.state !== 'verified') return [];

  return model.scoreHistory.map((c) => alertFromChange(c, ctx));
}
