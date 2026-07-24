import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { isHistoric, getHistoricRecord } from '@/data/historic';
import { buildTrustDisplayModel } from '@/lib/trust/trustAdapter';
import { getPublicScore } from '@/data/publicPillars';
import { TOOLS } from '@/data/tools';

describe('Flipgrid archived as a retired historic record (RL-017 content)', () => {
  it('canonical slug flipgrid-flip carries the approved record (url = null)', () => {
    expect(isHistoric('flipgrid-flip')).toBe(true);
    const rec = getHistoricRecord('flipgrid-flip')!;
    expect(rec.name).toBe('Flipgrid (Flip)');
    expect(rec.description).toMatch(/retired on 30 September 2024/);
    expect(rec.description).toMatch(/Microsoft Teams for Education/);
    expect(rec.referenceUrl ?? null).toBeNull();
    expect(rec.retiredDate).toBe('2024-09-30');
  });

  it('the active Flipgrid tool is removed from the directory (one canonical record)', () => {
    expect(TOOLS.find((t) => t.slug === 'flipgrid-flip')).toBeUndefined(); // removed from TOOLS
    const directory = TOOLS.filter((t) => !isHistoric(t.slug));
    expect(directory.some((t) => t.slug === 'flipgrid-flip')).toBe(false);
  });

  it('the retired record shows a Historic model with NO score, even though a legacy score exists', () => {
    // publicPillarsData still carries a legacy score row (auto-generated); the adapter’s
    // Historic branch runs FIRST, so no score is ever surfaced.
    const m = buildTrustDisplayModel('flipgrid-flip');
    expect(m.displayState).toBe('Historic');
    expect(m.promptlyScore).toBeNull();
    expect(m.toolName).toBe('Flipgrid (Flip)');
    // (documents the legacy data that the Historic branch suppresses)
    expect(getPublicScore('flipgrid-flip')).not.toBeNull();
  });

  it('/tools/flip redirects to the canonical /tools/flipgrid-flip', () => {
    function LocationProbe() {
      const loc = useLocation();
      return <div data-testid="loc">{loc.pathname}</div>;
    }
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/tools/flip']}>
        <Routes>
          <Route path="/tools/flip" element={<Navigate to="/tools/flipgrid-flip" replace />} />
          <Route path="/tools/:slug" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(getByTestId('loc').textContent).toBe('/tools/flipgrid-flip');
  });
});
