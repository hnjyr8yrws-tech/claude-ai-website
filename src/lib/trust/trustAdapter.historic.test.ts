import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildTrustDisplayModel } from '@/lib/trust/trustAdapter';
import { TOOLS } from '@/data/tools';
import { getPublicScore, isAwaitingReReview } from '@/data/publicPillars';
import { HISTORIC_TOOLS, type HistoricRecord } from '@/data/historic';

const slugs = TOOLS.map((t) => t.slug);
const activeScored = slugs.find((s) => getPublicScore(s) != null && !isAwaitingReReview(s));
const awaitingSlug = slugs.find((s) => isAwaitingReReview(s));

// Injected fixture — the adapter's Historic branch is proven without shipping content.
const FIXTURE_SLUG = 'test-retired-fixture';
const FIXTURE: HistoricRecord = {
  name: 'Test Retired Tool',
  description: 'A retired test fixture.',
  referenceUrl: null,
  retiredDate: '2024-01-01',
};
beforeEach(() => {
  HISTORIC_TOOLS[FIXTURE_SLUG] = FIXTURE;
});
afterEach(() => {
  delete HISTORIC_TOOLS[FIXTURE_SLUG];
});

describe('Trust Adapter — Historic (RL-017)', () => {
  it('Tests 2/7 — a retired slug resolves to a Historic model with NO score/pillars (direct access preserved)', () => {
    const m = buildTrustDisplayModel(FIXTURE_SLUG); // not in TOOLS — must still resolve, not 404/unavailable
    expect(m.displayState).toBe('Historic');
    expect(m.promptlyScore).toBeNull(); // never a number
    expect(m.pillars.every((p) => p.score === null)).toBe(true); // never a pillar score
    expect(m.toolName).toBe('Test Retired Tool');
    expect(m.integrity.state).toBe('verified'); // verified archive, never 'unavailable'/'pending'
  });

  it('Test 8 — active scored tools are unchanged', () => {
    expect(activeScored).toBeTruthy();
    const m = buildTrustDisplayModel(activeScored!);
    expect(m.promptlyScore).not.toBeNull();
    expect(['Active', 'Updated']).toContain(m.displayState);
  });

  it('Test 9 — Withdrawn / AwaitingReReview are unchanged', () => {
    expect(awaitingSlug).toBeTruthy();
    const m = buildTrustDisplayModel(awaitingSlug!);
    expect(m.displayState).toBe('AwaitingReReview');
    expect(m.promptlyScore).toBeNull();
  });

  it('Test 10 — unknown states fail closed', () => {
    const m = buildTrustDisplayModel('definitely-not-a-real-tool-xyz');
    expect(m.integrity.state).toBe('unavailable');
    expect(m.promptlyScore).toBeNull();
  });
});
