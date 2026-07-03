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

export const REVIEW_DEPTH_LABEL: Record<ReviewDepth, string> = {
  surface: 'Surface review',
  standard: 'Standard review',
  deep: 'Deep review',
};
