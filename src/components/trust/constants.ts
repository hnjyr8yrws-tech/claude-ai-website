import type { DisplayState, PillarKey, ReviewDepth } from '@/components/trust/types';

export const TRUST_SUPPRESSED_DISPLAY_STATES: readonly DisplayState[] = [
  'Withdrawn',
  'AwaitingReReview',
];

export const PILLAR_META: Record<PillarKey, { label: string; colour: string }> = {
  data_privacy:    { label: 'Data privacy',    colour: '#6A8CAF' }, // Sky
  safeguarding:    { label: 'Safeguarding',    colour: '#C8E44A' }, // Lime
  age_suitability: { label: 'Age suitability', colour: '#8C7A52' }, // Oat Deep
  transparency:    { label: 'Transparency',    colour: '#4A4F5C' }, // Slate
  accessibility:   { label: 'Accessibility',    colour: '#D97757' }, // Clay
};

/** Reserved pillar colour tokens (§03) — the CSS variables defined in index.css.
 *  These are what TrustPillar.colourToken carries; never override them. */
export const PILLAR_COLOUR_TOKENS: Record<PillarKey, string> = {
  data_privacy:    'var(--color-pillar-privacy)',
  safeguarding:    'var(--color-pillar-safeguarding)',
  age_suitability: 'var(--color-pillar-age)',
  transparency:    'var(--color-pillar-transparency)',
  accessibility:   'var(--color-pillar-accessibility)',
};

export const REVIEW_DEPTH_LABEL: Record<ReviewDepth, string> = {
  surface: 'Surface review',
  standard: 'Standard review',
  deep: 'Deep review',
};
