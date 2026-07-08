// Concept 5 — Score Change Alert (Iteration 1: evaluation engine + dry-run).
// Spec: docs/concept-5-score-change-alert.md
export * from './types';
export { ALERT_POLICY, evaluateAlert, withdrawalEvaluation } from './significance';
export {
  contextFromModel,
  alertFromChange,
  withdrawalAlert,
  buildAlertsForModel,
} from './buildAlerts';
export { runAlertDryRun, type DryRunReport, type DryRunOptions } from './dryRun';
export {
  buildAlertsFromFeed,
  collectFeedChanges,
  daysSinceChange,
  FEED_WINDOW_DAYS,
  type FeedChange,
  type FeedAlertOptions,
} from './feed';
export {
  buildInternalAlerts,
  logInternalAlerts,
  type InternalAlert,
  type InternalAlertOptions,
  type ChangeClassification,
} from './internal';
export {
  reconcile,
  authoredTruths,
  siteSurfaceSnapshot,
  type ReconciliationEvent,
  type ReconIssueType,
  type Surface,
  type SurfaceScore,
  type SurfaceSnapshot,
} from './reconcile';
export {
  buildWithdrawalPropagation,
  propagationTasks,
  logWithdrawalPropagation,
  PROPAGATION_SURFACES,
  type WithdrawalPropagation,
  type SurfacePropagation,
  type PropagationStatus,
  type PropagationTask,
  type PendingTool,
} from './withdrawal';
