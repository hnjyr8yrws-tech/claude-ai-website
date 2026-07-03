export type IntegrityState = 'verified' | 'stale' | 'unavailable';

export interface Integrity {
  state: IntegrityState;
  reason?: string;
  checkedAt?: string;
}

export type DisplayState =
  | 'Active'
  | 'Provisional'
  | 'Updated'
  | 'AwaitingReReview'
  | 'Withdrawn'
  | 'Historic';

export const PILLAR_ORDER = [
  'data_privacy',
  'safeguarding',
  'age_suitability',
  'transparency',
  'accessibility',
] as const;

export type PillarKey = (typeof PILLAR_ORDER)[number];

export type ConfidenceLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type ReviewDepth = 'surface' | 'standard' | 'deep';

export interface Citation {
  label: string;
  href?: string;
}

export interface PillarEvidence {
  pillar: PillarKey;
  score: number;
  evidence: string;
  citation?: Citation;
  confidence: ConfidenceLevel;
  reviewDepth: ReviewDepth;
}

export interface Methodology {
  version: string;
  verifiedDate: string;
  reviewerInitials: string;
}

export interface Reviewer {
  initials: string;
  verifiedDate: string;
}

export type ScoreDirection = 'up' | 'down' | 'none';

export interface ScoreChange {
  direction: ScoreDirection;
  from: number;
  to: number;
  date: string;
  reason?: string;
}

export interface TrustDisplayModel {
  toolName: string;
  toolSlug: string;
  displayState: DisplayState;
  integrity: Integrity;
  methodology: Methodology;
  reviewer: Reviewer;
  overallScore: number;
  pillars: Record<PillarKey, PillarEvidence>;
  scoreHistory?: ScoreChange[];
  livePageUrl?: string;
}
