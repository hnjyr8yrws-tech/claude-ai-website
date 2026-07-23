import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HistoricToolView } from '@/components/HistoricToolView';
import type { HistoricRecord } from '@/data/historic';

// Synthetic Flipgrid fixture (RL-017).
const FLIPGRID: HistoricRecord = {
  name: 'Flipgrid (Flip)',
  description:
    'Flip, formerly Flipgrid, was Microsoft’s video-discussion platform for education. ' +
    'The standalone Flip website and apps were retired on 30 September 2024. A limited Flip ' +
    'video-recording capability remains available within Microsoft Teams for Education, but ' +
    'the original discussion and response service is no longer available.',
  referenceUrl: null,
  retiredDate: '2024-09-30',
};

const wrap = (ui: ReactNode) =>
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

describe('HistoricToolView (RL-017 contract)', () => {
  it('Test 1 — shows a visible "Retired" badge', () => {
    const { getByText } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(getByText('Retired')).toBeTruthy(); // exact-text badge
  });

  it('Test 2 — never shows "Score not yet published" / "Pending review" / "Awaiting re-review"', () => {
    const { container } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(container.textContent).not.toMatch(/Score not yet published|Pending review|Awaiting re-review/i);
  });

  it('Test 3 — never renders a Promptly Score number', () => {
    const { container } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(container.textContent).not.toMatch(/\d(\.\d)?\s*\/\s*10/); // no "X/10"
    expect(container.querySelector('svg')).toBeNull(); // no Pillar Card ring
  });

  it('Test 4 — never renders pillar scores or a tier', () => {
    const { container } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(container.textContent).not.toMatch(/\bTrusted\b|\bGuided\b/); // no tier
    // no per-pillar score labels rendered as a breakdown
    expect(container.querySelector('[data-pillar-score]')).toBeNull();
  });

  it('Test 5 — has no "Visit tool" action and no external tool URL', () => {
    const { container } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(container.textContent).not.toMatch(/Visit/i);
    // referenceUrl is null → no external (_blank) link at all
    expect(container.querySelector('a[target="_blank"]')).toBeNull();
  });

  it('Test 6 — shows a clearly labelled reference link when a reference URL exists (never "Visit")', () => {
    const withRef: HistoricRecord = {
      ...FLIPGRID,
      referenceUrl: 'https://support.microsoft.com/flip-retirement',
      referenceLabel: 'Retirement information',
    };
    const { getByText } = wrap(<HistoricToolView slug="flip" record={withRef} />);
    const link = getByText(/Retirement information/);
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('https://support.microsoft.com/flip-retirement');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.textContent).not.toMatch(/Visit/i);
  });

  it('Test 9 — the retirement description is visible', () => {
    const { container } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(container.textContent).toContain('retired on 30 September 2024');
    expect(container.textContent).toContain('Microsoft Teams for Education');
  });

  it('Test 10 — does not imply Microsoft Teams is the same product as Flipgrid', () => {
    const { container } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    // the verbatim description keeps them distinct, and there is no Teams "Visit" link
    expect(container.textContent).toContain('the original discussion and response service is no longer available');
    expect(container.querySelector('a[target="_blank"]')).toBeNull();
  });

  it('accessibility — heading + status region present', () => {
    const { getByRole } = wrap(<HistoricToolView slug="flip" record={FLIPGRID} />);
    expect(getByRole('heading', { name: /Flipgrid/ })).toBeTruthy();
    expect(getByRole('status')).toBeTruthy();
  });
});
