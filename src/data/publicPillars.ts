/**
 * publicPillars.ts — the PUBLIC trust model.
 *
 * SINGLE SOURCE OF TRUTH for any Promptly Score shown to users. The public score
 * is the five real pillars only:
 *   Data Privacy · Safeguarding · Age Suitability · Transparency · Accessibility
 *
 * HARD RULES (founder decision, 2026-06):
 * - Public pillar values are NEVER derived from the internal v3 method_* fields
 *   (audience / uk / monetisation / trust / ease). See data/toolRegistry.ts.
 * - No composite public score is shown unless backed by real published pillar data.
 * - No legacy/synthetic scoring (derivePillars/promptlyScore/safety/tier) feeds this.
 *
 * Wired from the reviewed pillar dataset (data/tools_public_pillars_reviewed.csv)
 * via scripts/build-public-pillars.mjs → src/data/publicPillarsData.ts. Tools with
 * no reviewed row still return null ("pending review" → render the placeholder,
 * never a number). pillar_f_governance (internal 6th pillar) is NOT part of this
 * model; the composite is the reviewer's promptly_safety_score_v2.
 */
import { PUBLISHED_PUBLIC_SCORES } from './publicPillarsData';

export const PUBLIC_PILLARS = [
  'Data Privacy',
  'Safeguarding',
  'Age Suitability',
  'Transparency',
  'Accessibility',
] as const;
export type PublicPillar = (typeof PUBLIC_PILLARS)[number];

/** Per-pillar public scores, 0–10. Field names match the Pillar Card component. */
export interface PublicPillarScores {
  dataPrivacy: number;
  safeguarding: number;
  ageSuitability: number;
  transparency: number;
  accessibility: number;
}

export interface PublicToolScore {
  itemId: string;
  pillars: PublicPillarScores;
  composite: number; // 0–10 — only meaningful when status === 'published'
  methodologyVersion: string; // e.g. '2.2' (no leading 'v' — marks render "v{version}")
  reviewer: string; // reviewer initials (e.g. 'CR')
  verifiedDate: string; // e.g. 'JUN 2026'
  reviewBasis?: 'Desk Review' | 'Hands-On Tested' | 'Classroom Trialled';
  status: 'published';
}

/**
 * Published public scores, keyed by slug (the app calls getPublicScore(tool.slug)).
 * Generated from the reviewed CSV — see publicPillarsData.ts. Switch the key to
 * item_id later if/when the internal v3 registry lands and slugs are retired.
 */
const PUBLISHED: Record<string, PublicToolScore> = PUBLISHED_PUBLIC_SCORES;

/**
 * CHILD-SAFETY WITHDRAWAL (sanctioned scoped exception, 2026-06).
 * These 10 pupil-facing tools are withdrawn from public display pending re-review:
 * Surfaces render the dedicated "Awaiting Re-review" Pillar Card (state="withdrawn":
 * empty ring, centre "—" with redaction bar, mark "METHODOLOGY v… · AWAITING RE-REVIEW")
 * via isAwaitingReReview(). getPublicScore() ALSO returns null for them as a failsafe,
 * so NO score and NO tier can render on any surface (tile, detail, breakdown, pill) —
 * even one not yet wired to the predicate falls back to the no-number placeholder.
 * The published data is preserved (suppressed, not deleted), so re-review is a one-line
 * revert (remove the slug from this set).
 * NOTE: Luna reads from an external n8n pipeline, NOT this data — handle separately.
 * NOTE (Woebot): withdrawn here to get it off its tier today; a SEPARATE decision
 * on whether to fully remove the discontinued product is still pending — do not delete.
 */
const WITHDRAWN_AWAITING_REREVIEW = new Set<string>([
  'woebot',
  'meta-ai',
  'perplexity-ai',
  'poe',
  'fotor-ai',
  'photomath',
  'seneca-learning',
  'memrise',
  'cursor-ai',
  'be-my-eyes',
]);

/** The public score for an item, or null when it is pending review or withdrawn. */
export function getPublicScore(itemId: string): PublicToolScore | null {
  if (WITHDRAWN_AWAITING_REREVIEW.has(itemId)) return null; // child-safety withdrawal
  return PUBLISHED[itemId] ?? null;
}

/**
 * True for the 10 child-safety-withdrawn tools. Surfaces use this to render the
 * dedicated "Awaiting Re-review" Pillar Card (state="withdrawn") instead of a score.
 * Distinct from a genuinely never-reviewed tool (getPublicScore null with no entry).
 */
export function isAwaitingReReview(itemId: string): boolean {
  return WITHDRAWN_AWAITING_REREVIEW.has(itemId);
}

export function hasPublicScore(itemId: string): boolean {
  return itemId in PUBLISHED;
}

// ─── Per-pillar band ────────────────────────────────────────────────────────────
// A qualitative label for a SINGLE pillar score. This is a different axis from the
// composite verdict bands (Promptly Recommended → Avoid) and does NOT affect the
// Promptly Score. Operates on the real 0–10 decimal score — no 0–1 conversion and
// no integer rounding (8.0 → strong, 8.1 → exemplary, by design).

export type PillarBand = 'critical' | 'weak' | 'basic' | 'strong' | 'exemplary';

export function pillarBand(score: number | null | undefined): PillarBand | null {
  if (score == null || Number.isNaN(score)) return null;
  if (score <= 2) return 'critical';
  if (score <= 4) return 'weak';
  if (score <= 6) return 'basic';
  if (score <= 8) return 'strong';
  return 'exemplary';
}

export const PILLAR_BAND_LABEL: Record<PillarBand, string> = {
  critical: 'Critical',
  weak: 'Weak',
  basic: 'Basic',
  strong: 'Strong',
  exemplary: 'Exemplary',
};
