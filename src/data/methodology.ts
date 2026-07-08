// Living Methodology page data.
//
// The withdrawal record is wired to the REAL child-safety withdrawal — the tools
// currently Awaiting Re-review (see src/data/publicPillars.ts) — so it names only
// tools that are genuinely withheld, consistent with their /tools/:slug pages.
// The score-change entries use generic illustrative names (no real tool) until a
// real score-change feed exists.

import type { Reviewer, ScoreChange, DisplayState } from '@/components/trust';
import { TOOLS } from '@/data/tools';
import { isAwaitingReReview } from '@/data/publicPillars';

export const METHODOLOGY_PATH = '/methodology';

/**
 * The current PUBLISHED scoring-methodology version — the single source of truth
 * for version display copy site-wide. Every live tool score also carries its own
 * `methodologyVersion` in the registry (all currently "2.2"); this constant is
 * the site-wide "current" value used in headings, marks, and fallbacks.
 *
 * NB: platform/website releases (the Living Methodology page, shared trust
 * components, etc.) are NOT scoring-methodology versions and are never recorded
 * here — they live in the repo history. This prevents the v2.2/v3.0 conflict.
 */
export const CURRENT_METHODOLOGY_VERSION = '2.2';

export interface ToolRef {
  name: string;
  slug: string;
}

/** Internal links land on this repo's existing tool detail route: /tools/:slug */
export const toolReviewPath = (slug: string) => `/tools/${slug}`;

/** Resolve a real tool from this repo's registry (falls back to the raw slug). */
export function toolRef(slug: string): ToolRef {
  const t = TOOLS.find((x) => x.slug === slug);
  return { name: t?.name ?? slug, slug };
}

export interface MethodologyMeta {
  version: string;
  lastUpdated: string;
  reviewerInitials: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
  details?: string[];
}

export type HoldingState = Extract<DisplayState, 'Withdrawn' | 'AwaitingReReview'>;

interface IntegrityRecordBase {
  id: string;
  date: string;
  reviewer: Reviewer;
}

export interface ScoreChangeRecord extends IntegrityRecordBase {
  type: 'score_change';
  tool: ToolRef;
  change: ScoreChange;
  note?: string;
}

export interface WithdrawalRecord extends IntegrityRecordBase {
  type: 'withdrawal';
  tools: ToolRef[];
  reasonCategory: string;
  kcsieBasis: string;
  holdingState: HoldingState;
  summary: string;
}

export type IntegrityRecordEntry = ScoreChangeRecord | WithdrawalRecord;

export interface ScoreFeedEntry {
  id: string;
  tool: ToolRef;
  change: ScoreChange;
  note?: string;
}

// ---- Static content ----

export const methodologyMeta: MethodologyMeta = {
  version: CURRENT_METHODOLOGY_VERSION,
  lastUpdated: '2026-05-12',
  reviewerInitials: 'CR',
};

// Scoring-methodology changelog ONLY — the version each score is produced under.
// Platform/website releases (the Living Methodology page, shared trust
// components, etc.) are NOT scoring versions; they live in the repo history, not
// here, so this record never again conflates the two axes (the old "3.0" entry
// described platform work, not a scoring change — removed).
export const changelog: ChangelogEntry[] = [
  {
    version: '2.2',
    date: '2026-05-12',
    summary:
      'Current published scoring methodology — every live tool score cites v2.2. Adds per-pillar evidence and confidence, and standardises reviewer attribution on every score.',
  },
  {
    version: '2.0',
    date: '2026-02-03',
    summary:
      'Moved to the five-pillar model: data privacy, safeguarding, age suitability, transparency, and accessibility.',
  },
];

// ---- Integrity record ----

// REAL: the June 2026 child-safety withdrawal — every tool currently Awaiting
// Re-review, resolved from the trust dataset so the record names only genuinely
// withheld tools (consistent with their /tools/:slug pages).
const withdrawnTools: ToolRef[] = TOOLS
  .filter((t) => isAwaitingReReview(t.slug))
  .map((t) => ({ name: t.name, slug: t.slug }));

export const integrityRecord: IntegrityRecordEntry[] = [
  {
    id: 'withdrawal-2026-06-safeguarding',
    type: 'withdrawal',
    date: '2026-06-18',
    reviewer: { initials: 'CR', verifiedDate: '2026-06-18' },
    tools: withdrawnTools,
    reasonCategory: 'Safeguarding',
    kcsieBasis: 'KCSIE 2025 — Part 5 (online safety) and Annex C',
    holdingState: 'AwaitingReReview',
    summary:
      'Following a June 2026 safeguarding review, these pupil-facing tools were withdrawn from published scoring. Their scores are withheld while each is re-reviewed against the current safeguarding criteria.',
  },
  {
    // Illustrative only — a generic example (not a real tool) showing how a score
    // change is recorded. Replace once a real score-change history is available.
    id: 'score-change-illustrative',
    type: 'score_change',
    date: '2026-05-22',
    reviewer: { initials: 'CR', verifiedDate: '2026-05-22' },
    tool: { name: 'Example tool', slug: 'example-tool' },
    change: {
      direction: 'down',
      from: 7.4,
      to: 6.1,
      date: '2026-05-22',
      reason: 'Illustrative: weaker data-privacy evidence on re-review',
    },
    note: 'Illustrative example (not a real tool) — shows how a score change is recorded.',
  },
];

// Illustrative only (generic names, not real tools) until an automated feed exists.
export const scoreChangeFeed: ScoreFeedEntry[] = [
  {
    id: 'feed-illustrative-1',
    tool: { name: 'Example tool A', slug: 'example-tool-a' },
    change: { direction: 'up', from: 6.8, to: 7.5, date: '2026-05-09' },
    note: 'Illustrative example (not a real tool).',
  },
  {
    id: 'feed-illustrative-2',
    tool: { name: 'Example tool B', slug: 'example-tool-b' },
    change: { direction: 'down', from: 7.4, to: 6.1, date: '2026-05-22' },
    note: 'Illustrative example (not a real tool).',
  },
];

/**
 * Living-methodology link for a tool's most recent score-change record.
 * Integrity-record `score_change` entries render an `id` anchor on the page, so
 * they deep-link precisely; otherwise we fall back to the score-change feed
 * section heading (feed rows carry no per-entry anchor).
 */
export function scoreChangeAnchor(slug: string): string {
  const record = integrityRecord.find(
    (e): e is ScoreChangeRecord => e.type === 'score_change' && e.tool.slug === slug,
  );
  return record ? `${METHODOLOGY_PATH}#${record.id}` : `${METHODOLOGY_PATH}#feed-heading`;
}
