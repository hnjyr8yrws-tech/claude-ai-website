export type IntegrityState = 'verified' | 'stale' | 'unavailable';

export interface Integrity {
  state: IntegrityState;
  reason?: string;
  /** Legacy field kept for existing granular call sites (ToolDetail, Luna). */
  checkedAt?: string;
  /** ISO timestamp of when the Trust Adapter built the model (§4 Trust Policy 1). */
  fetchedAt?: string;
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

/** One pillar as rendered — always produced in fixed §03 order by the adapter. */
export interface TrustPillar {
  key: PillarKey;
  /** Canonical Brand Bible pillar name (never abbreviated). */
  label: string;
  /** Reserved pillar colour token (CSS variable) — never overridden (§03/§09). */
  colourToken: string;
  score: number | null;
  evidence: string | null;
  citation: Citation | null;
  /** 0–5; null when no evidence has been published for the pillar. */
  confidence: ConfidenceLevel | null;
  reviewDepth: ReviewDepth | null;
}

/**
 * The single typed model every trust surface renders from. Built ONLY by the
 * Trust Adapter (src/lib/trust/trustAdapter.ts) — no surface reads the registry
 * directly. `integrity.state` is the render gate (§4 Trust Policy 1);
 * `displayState` styles what has already passed the gate.
 */
export interface TrustDisplayModel {
  /** Registry identifier — currently the tool slug. */
  toolId: string;
  toolSlug: string;
  toolName: string;
  /** §14 Plain Verdict. No data source yet — the adapter returns null. Renders
   *  only when integrity is verified AND promptlyScore is non-null (§4). */
  verdict: string | null;
  /** Composite Promptly Score. null ⇒ fail-closed: no score renders anywhere. */
  promptlyScore: number | null;
  displayState: DisplayState;
  /** ALWAYS the fixed five, in §03 order. */
  pillars: TrustPillar[];
  methodology: Methodology;
  reviewer: Reviewer;
  /** Most-recent first. Empty when no score change has ever been recorded. */
  scoreHistory: ScoreChange[];
  disclosure?: { present: boolean; text: string };
  livePageUrl: string;
  integrity: Integrity;
}
