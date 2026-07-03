import {
  PILLAR_ORDER,
  type DisplayState,
  type Integrity,
  type PillarEvidence,
  type PillarKey,
} from '@/components/trust/types';
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';

export function formatDateGB(
  iso: string | null | undefined
): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export type TrustVisibility =
  | { visible: true; reason: null }
  | { visible: false; reason: 'display-state' | 'integrity' };

export function evaluateTrustVisibility(
  integrity: Integrity | null | undefined,
  displayState: DisplayState
): TrustVisibility {
  if (TRUST_SUPPRESSED_DISPLAY_STATES.includes(displayState)) {
    return { visible: false, reason: 'display-state' };
  }
  if (!integrity || integrity.state !== 'verified') {
    return { visible: false, reason: 'integrity' };
  }
  return { visible: true, reason: null };
}

export function orderedPillars(
  pillars: Record<PillarKey, PillarEvidence>
): PillarEvidence[] {
  return PILLAR_ORDER.map((k) => pillars[k]).filter(Boolean);
}

export function pillarScores(
  pillars: Record<PillarKey, PillarEvidence>
): Record<PillarKey, number> {
  return PILLAR_ORDER.reduce((acc, k) => {
    acc[k] = pillars[k]?.score ?? 0;
    return acc;
  }, {} as Record<PillarKey, number>);
}
