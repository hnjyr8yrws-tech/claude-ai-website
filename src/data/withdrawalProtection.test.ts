import { describe, it, expect } from 'vitest';
import {
  WITHDRAWN_SLUGS,
  getPublicScore,
  isAwaitingReReview,
  hasPublicScore,
} from './publicPillars';
import { TOOLS, toSlug } from './tools';

/**
 * The child-safety withdrawal is a HARD PUBLICATION FILTER.
 *
 * Ten pupil-facing tools were withdrawn from public display pending re-review
 * (commit 5d7f403). The data is suppressed, not deleted, so re-review is a
 * one-line revert — which also means a careless edit could un-suppress them.
 *
 * This suite exists because the September 2026 research intake made that a live
 * risk rather than a theoretical one: the V5 workbook lists Be My Eyes,
 * Perplexity and Poe as `School Safe: Likely yes`, and its Additions sheet
 * actively recommends adding Be My Eyes. An importer following the spreadsheet
 * would have reversed a child-safety decision.
 *
 * The expectation below is hard-coded ON PURPOSE. If a future import drops a
 * slug from the set, this fails — which is the point. Changing the list must be
 * a deliberate, reviewed act.
 */
const EXPECTED_WITHDRAWN = [
  'be-my-eyes',
  'cursor-ai',
  'fotor-ai',
  'memrise',
  'meta-ai',
  'perplexity-ai',
  'photomath',
  'poe',
  'seneca-learning',
  'woebot',
].sort();

describe('child-safety withdrawal filter', () => {
  it('still withholds exactly the ten withdrawn tools', () => {
    expect([...WITHDRAWN_SLUGS].sort()).toEqual(EXPECTED_WITHDRAWN);
  });

  it('never returns a public score for a withdrawn tool', () => {
    for (const slug of EXPECTED_WITHDRAWN) {
      expect(getPublicScore(slug), `${slug} must have no public score`).toBeNull();
    }
  });

  it('marks every withdrawn tool as awaiting re-review', () => {
    for (const slug of EXPECTED_WITHDRAWN) {
      expect(isAwaitingReReview(slug), `${slug} must render the withdrawn card`).toBe(true);
    }
  });

  /**
   * The three the V5 workbook would have re-published, called out by name so the
   * reason this suite exists stays visible to whoever reads it next.
   */
  it('keeps Be My Eyes, Perplexity and Poe withheld despite the V5 workbook', () => {
    for (const slug of ['be-my-eyes', 'perplexity-ai', 'poe']) {
      expect(isAwaitingReReview(slug)).toBe(true);
      expect(getPublicScore(slug)).toBeNull();
    }
  });

  /** Suppressed, not deleted — the underlying row must survive for re-review. */
  it('preserves the underlying published data for re-review', () => {
    expect(hasPublicScore('be-my-eyes')).toBe(true);
    expect(getPublicScore('be-my-eyes')).toBeNull();
  });
});

describe('the September 2026 intake did not breach the filter', () => {
  /**
   * Withdrawn tools REMAIN in TOOLS — suppression happens at the score layer so
   * re-review is a one-line revert. What must never happen is a withdrawn tool
   * carrying a score again, or a NEW record being created for one under a
   * different name.
   */
  it('leaves withdrawn tools listed but scoreless', () => {
    const withdrawn = TOOLS.filter(t => WITHDRAWN_SLUGS.includes(t.slug));

    expect(withdrawn.length).toBe(WITHDRAWN_SLUGS.length);
    for (const tool of withdrawn) {
      expect(getPublicScore(tool.slug), `${tool.name} must stay scoreless`).toBeNull();
      expect(isAwaitingReReview(tool.slug)).toBe(true);
    }
  });

  it('creates no duplicate record for a withdrawn tool', () => {
    const counts = new Map<string, number>();
    for (const tool of TOOLS) counts.set(tool.slug, (counts.get(tool.slug) ?? 0) + 1);

    const duplicated = WITHDRAWN_SLUGS.filter(slug => (counts.get(slug) ?? 0) > 1);

    expect(duplicated, 'a withdrawn tool has a duplicate listing').toEqual([]);
  });

  /**
   * Envision AI is held OUTSIDE the normal add flow, but note what the September
   * research actually found: it was ALREADY a live listing on origin/main, with a
   * published pillar score — while Be My Eyes, a directly comparable
   * vision-accessibility tool, is withdrawn and scoreless.
   *
   * That inconsistency is pre-existing and live. This intake deliberately does
   * not resolve it in either direction: adding Envision would compound it,
   * withdrawing it would be a child-safety decision made as a side effect of a
   * data import. This test pins the CURRENT state so the decision stays visible
   * and cannot drift unnoticed while it is pending.
   */
  it('pins the pre-existing Envision AI inconsistency without resolving it', () => {
    const envision = TOOLS.find(t => t.name === 'Envision AI');

    expect(envision, 'Envision AI is a pre-existing listing, not added here').toBeDefined();
    // Pre-existing state: published. Awaiting the explicit child-safety review.
    expect(hasPublicScore('envision-ai')).toBe(true);
    // Its comparator remains withdrawn.
    expect(getPublicScore('be-my-eyes')).toBeNull();
  });

  /** The Watch set must not reach ordinary public listings. */
  it('keeps watchlist products unpublished', () => {
    const watchlist = [
      'ChildDomino',
      'Fambot',
      'Gauth',
      'TeddiVerse',
      'Sendsteps',
      'TeachShare',
      'Ideogram',
    ];
    const published = TOOLS.map(t => t.name.toLowerCase());

    for (const name of watchlist) {
      expect(
        published.some(p => p.includes(name.toLowerCase())),
        `${name} is on the watchlist and must not be a public listing`,
      ).toBe(false);
    }
  });

  /**
   * No new record may carry a synthetic score. Every September addition is
   * deliberately absent from the reviewed pillar dataset, so it renders
   * 'Provisional' with no number rather than an invented one.
   */
  it('publishes no score for any September 2026 addition', () => {
    const added = [
      'Sendix',
      'Third Space Learning',
      'Agilisys EHCP Tool',
      'Imosphere',
      'SENSA',
      'Senso.cloud',
      'Eidolon Nursery',
      'SENkit',
      'SenSight',
      'Trisende',
      'TeachScribe',
      'Kaleida',
      'Medly AI',
    ];

    for (const name of added) {
      const tool = TOOLS.find(t => t.name === name);
      expect(tool, `${name} should be listed`).toBeDefined();
      expect(getPublicScore(toSlug(name)), `${name} must not carry a score`).toBeNull();
    }
  });
});
