import { describe, it, expect } from 'vitest';
import {
  UNVERIFIED_TRUST,
  NEEDS_VERIFICATION,
  governanceNotesFor,
  MARKING_GOVERNANCE_NOTE,
  FILTERING_REVIEW_NOTE,
} from './trustSafety';
import { TOOLS } from './tools';

describe('Trust & Safety defaults', () => {
  it('defaults every field to Needs verification', () => {
    for (const [field, value] of Object.entries(UNVERIFIED_TRUST)) {
      expect(value, `${field} must default to Needs verification`).toBe(NEEDS_VERIFICATION);
    }
  });

  /**
   * The rule that matters most: a tool with no evidence must never read as
   * affirmatively safe. Unknown is a better answer than an invented one — a
   * school may act on this.
   */
  it('never lets an unset field read as a positive claim', () => {
    const merged = { ...UNVERIFIED_TRUST, ukDataHosting: 'Yes' as const };

    expect(merged.ukDataHosting).toBe('Yes');
    expect(merged.noTrainingOnUserData).toBe(NEEDS_VERIFICATION);
    expect(merged.frameworkStatus).toBe(NEEDS_VERIFICATION);
  });

  it('claims no framework status for any tool', () => {
    // G-Cloud / CCS / DOS must never be asserted without direct evidence, and
    // none was found for any record in this intake.
    const claimed = TOOLS.filter(t => t.trust?.frameworkStatus && t.trust.frameworkStatus !== NEEDS_VERIFICATION);

    expect(claimed.map(t => t.name)).toEqual([]);
  });
});

describe('governance notes are defined once and attached by capability', () => {
  it('attaches the marking note to assessment tools', () => {
    expect(governanceNotesFor(['Assessment / Marking'])).toEqual([MARKING_GOVERNANCE_NOTE]);
  });

  it('attaches the filtering note to monitoring tools', () => {
    expect(governanceNotesFor(['Filtering & Monitoring'])).toEqual([FILTERING_REVIEW_NOTE]);
  });

  it('attaches nothing to a tool that needs no note', () => {
    expect(governanceNotesFor(['AI Literacy'])).toEqual([]);
    expect(governanceNotesFor()).toEqual([]);
  });

  it('never repeats a note', () => {
    expect(governanceNotesFor(['Assessment / Marking', 'Assessment / Marking'])).toHaveLength(1);
  });

  it('states the Ofqual/JCQ human-marker requirement', () => {
    expect(MARKING_GOVERNANCE_NOTE).toMatch(/cannot replace the human assessor/i);
    expect(MARKING_GOVERNANCE_NOTE).toMatch(/Ofqual and JCQ/);
  });

  /** Every marking tool gets the note — no record can quietly opt out. */
  it('covers every tool with the marking capability', () => {
    const marking = TOOLS.filter(t => t.capabilities?.includes('Assessment / Marking'));

    expect(marking.length).toBeGreaterThan(0);
    for (const tool of marking) {
      expect(governanceNotesFor(tool.capabilities), `${tool.name}`).toContain(MARKING_GOVERNANCE_NOTE);
    }
  });
});

describe('no product is described as certified', () => {
  /**
   * KCSIE places duties on schools, not certifications on products. The Phase 1B
   * draft briefly carried a vendor comparison claiming otherwise; it did not
   * survive checking against DfE/KCSIE sources.
   */
  it('never claims KCSIE or DfE approval in any listing text', () => {
    const banned = /kcsie\s*(approved|compliant|certified)|dfe\s*(approved|certified)|ofsted\s*approved/i;

    const offenders = TOOLS.filter(t =>
      banned.test([t.desc, t.caveat ?? '', ...(t.pros ?? []), ...(t.cons ?? []), t.ageNotes ?? ''].join(' ')),
    );

    expect(offenders.map(t => t.name)).toEqual([]);
  });
});
