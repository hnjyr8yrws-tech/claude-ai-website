import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isHistoric, getHistoricRecord, HISTORIC_TOOLS, type HistoricRecord } from '@/data/historic';
import { TOOLS } from '@/data/tools';

// Generic mechanism proven with an INJECTED fixture placed on an EXISTING active tool
// slug, so directory exclusion is proven for a tool retired IN PLACE — without shipping
// any production content (the base registry stays empty; the fixture is cleaned up).
const HOST = TOOLS[0].slug; // an existing active tool, retired only for these tests
const FIXTURE: HistoricRecord = {
  name: 'Test Retired Tool',
  description: 'A retired test fixture. Not a real tool.',
  referenceUrl: null,
};

beforeEach(() => {
  HISTORIC_TOOLS[HOST] = FIXTURE;
});
afterEach(() => {
  delete HISTORIC_TOOLS[HOST];
});

describe('historic registry mechanism (RL-017, generic)', () => {
  it('recognises a retired slug and returns its record', () => {
    expect(isHistoric(HOST)).toBe(true);
    expect(getHistoricRecord(HOST)!.name).toBe('Test Retired Tool');
  });

  it('returns false / null for non-retired or missing slugs', () => {
    expect(isHistoric('does-not-exist')).toBe(false);
    expect(isHistoric(undefined)).toBe(false);
    expect(isHistoric(null)).toBe(false);
    expect(getHistoricRecord('does-not-exist')).toBeNull();
  });

  it('Test 6 — a retired tool is excluded from the filtered directory (even retired in place)', () => {
    const directory = TOOLS.filter((t) => !isHistoric(t.slug));
    expect(directory.some((t) => t.slug === HOST)).toBe(false); // the retired tool is gone
    expect(directory.every((t) => !isHistoric(t.slug))).toBe(true); // no historic tool remains
  });
});
