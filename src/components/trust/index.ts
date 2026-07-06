// Shared Trust Components — the single source of truth for Rule 4b compliance
// and fail-closed rendering across Luna, review pages and receipts.
//
// NOTE: PillarCard's `pillarScores` builder is NOT re-exported (it collides with
// the `pillarScores` helper in ./utils) — import it directly from
// '@/components/trust/PillarCard' if needed. Everything else is exported here.

export * from '@/components/trust/types';
export * from '@/components/trust/constants';
export {
  formatDateGB,
  evaluateTrustVisibility,
  orderedPillars,
  pillarScores,
} from '@/components/trust/utils';
export type { TrustVisibility } from '@/components/trust/utils';
export { Rule4bGuard, type Rule4bGuardProps } from '@/components/trust/Rule4bGuard';
export { ReviewerBadge, type ReviewerBadgeProps } from '@/components/trust/ReviewerBadge';
export { ScoreChangeStamp, type ScoreChangeStampProps } from '@/components/trust/ScoreChangeStamp';
export { MethodologyStamp, type MethodologyStampProps } from '@/components/trust/MethodologyStamp';
export { LiveScoreLink, type LiveScoreLinkProps } from '@/components/trust/LiveScoreLink';
export {
  EvidenceConfidence,
  type EvidenceConfidenceProps,
  type PillarEvidenceDetail,
} from '@/components/trust/EvidenceConfidence';
export {
  PillarCard,
  ScorePill,
  pillarScoresFromModel,
  cardStateFor,
  type PillarCardProps,
  type PillarCardState,
  type PillarScores,
  type ScorePillProps,
} from '@/components/trust/PillarCard';
