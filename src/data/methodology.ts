// Living Methodology page data (ported from getpromptly-web).
//
// ⚠️ SAMPLE DATA: `integrityRecord` and `scoreChangeFeed` below are illustrative
// placeholder records for the new /methodology scaffold — they are NOT real
// integrity actions. Tool references are wired to real tools from '@/data/tools'
// only so the links resolve to existing /tools/:slug pages. Replace the records
// (and re-word the withdrawal summary) with real data before linking this page
// publicly.

import type { Reviewer, ScoreChange, DisplayState } from '@/components/trust';
import { TOOLS } from '@/data/tools';

export const METHODOLOGY_PATH = '/methodology';

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
  version: '3.0',
  lastUpdated: '2026-07-01',
  reviewerInitials: 'CR',
};

export const changelog: ChangelogEntry[] = [
  {
    version: '3.0',
    date: '2026-07-01',
    summary:
      'Introduced the living methodology page, a two-type integrity record (score changes and withdrawals), and the shared trust components.',
    details: [
      'Every score links to this page when it is provisional, updated, or withheld.',
      'Withdrawals are recorded with their reason category, statutory basis, and current holding state.',
    ],
  },
  {
    version: '2.3',
    date: '2026-05-12',
    summary:
      'Added per-pillar evidence and confidence, and standardised reviewer attribution on every score.',
  },
  {
    version: '2.0',
    date: '2026-02-03',
    summary:
      'Moved to the five-pillar model: data privacy, safeguarding, age suitability, transparency, and accessibility.',
  },
];

// ---- SAMPLE integrity data (placeholder — see file header) ----

const SAMPLE_TOOLS: ToolRef[] = TOOLS.slice(0, 6).map((t) => ({ name: t.name, slug: t.slug }));
const pick = (i: number): ToolRef => SAMPLE_TOOLS[i] ?? { name: 'Sample tool', slug: '' };

export const integrityRecord: IntegrityRecordEntry[] = [
  {
    id: 'withdrawal-2026-06-safeguarding',
    type: 'withdrawal',
    date: '2026-06-18',
    reviewer: { initials: 'CR', verifiedDate: '2026-06-18' },
    tools: SAMPLE_TOOLS.slice(0, 3),
    reasonCategory: 'Safeguarding',
    kcsieBasis: 'KCSIE 2025 — Part 5 (online safety) and Annex C',
    holdingState: 'AwaitingReReview',
    summary:
      'Sample record (placeholder data). Illustrates how a safeguarding withdrawal is displayed: the affected tools are withheld from published scoring while each is re-reviewed against the current safeguarding criteria.',
  },
  {
    id: 'score-change-2026-05-sample',
    type: 'score_change',
    date: '2026-05-22',
    reviewer: { initials: 'CR', verifiedDate: '2026-05-22' },
    tool: pick(3),
    change: {
      direction: 'down',
      from: 7.4,
      to: 6.1,
      date: '2026-05-22',
      reason: 'Weaker data-privacy evidence on re-review',
    },
    note: 'Sample record. Data-privacy pillar downgraded after a provider changed sub-processors.',
  },
];

export const scoreChangeFeed: ScoreFeedEntry[] = [
  {
    id: 'feed-01',
    tool: pick(4),
    change: { direction: 'up', from: 6.8, to: 7.5, date: '2026-05-09' },
    note: 'Sample: accessibility improvements verified.',
  },
  {
    id: 'feed-02',
    tool: pick(5),
    change: { direction: 'down', from: 7.4, to: 6.1, date: '2026-05-22' },
    note: 'Sample: sub-processor change reduced data-privacy confidence.',
  },
];
