import { describe, it, expect } from 'vitest';
import { expandQuery, matchesWithAliases } from './searchAliases';
import { TOOLS } from '../data/tools';

describe('controlled search aliases', () => {
  it('expands UK education abbreviations both ways', () => {
    expect(expandQuery('senco')).toContain('sendco');
    expect(expandQuery('sendco')).toContain('senco');
    expect(expandQuery('ehcp')).toContain('education health and care plan');
    expect(expandQuery('eyfs')).toContain('early years');
    expect(expandQuery('nursery')).toContain('eyfs');
    expect(expandQuery('council')).toContain('local authority');
    expect(expandQuery('mat')).toContain('multi-academy trust');
  });

  it('leaves an unknown query alone', () => {
    expect(expandQuery('quadratic')).toEqual(['quadratic']);
  });

  it('returns nothing for an empty query', () => {
    expect(expandQuery('   ')).toEqual([]);
  });

  /**
   * The failure mode that matters: short aliases must not match inside longer
   * words. "sen" hitting "presentation" or "la" hitting "planning" would make
   * the directory feel broken.
   */
  it('matches whole words only, never fragments', () => {
    expect(matchesWithAliases('Presentation builder for slides', 'sen')).toBe(false);
    expect(matchesWithAliases('Lesson planning assistant', 'la')).toBe(false);
    expect(matchesWithAliases('Robotics and coding', 'ot')).toBe(false);
    // …but a real word still matches.
    expect(matchesWithAliases('SEN support for mainstream schools', 'sen')).toBe(true);
  });
});

describe('the directory finds newly verified coverage', () => {
  const haystack = (name: string) => {
    const t = TOOLS.find(x => x.name === name)!;
    return [t.name, t.desc, t.primaryCategory, t.subcategory, ...t.audience, ...(t.capabilities ?? [])].join(' ');
  };

  it('finds EHCP tools by the abbreviation', () => {
    for (const name of ['Sendix', 'Agilisys EHCP Tool', 'Imosphere', 'Trisende']) {
      expect(matchesWithAliases(haystack(name), 'EHCP'), `${name} via EHCP`).toBe(true);
    }
  });

  it('finds EHCP tools by the full phrase', () => {
    expect(matchesWithAliases(haystack('Sendix'), 'education health and care plan')).toBe(true);
  });

  it('finds Early Years tools by nursery and EYFS', () => {
    for (const query of ['nursery', 'EYFS', 'early years']) {
      expect(matchesWithAliases(haystack('Eidolon Nursery'), query), `via ${query}`).toBe(true);
      expect(matchesWithAliases(haystack('SENkit'), query), `SENkit via ${query}`).toBe(true);
    }
  });

  it('finds Local Authority tools by council and LA', () => {
    for (const query of ['council', 'local authority']) {
      expect(matchesWithAliases(haystack('Agilisys EHCP Tool'), query), `via ${query}`).toBe(true);
    }
  });

  it('finds MAT tools by the abbreviation and the full phrase', () => {
    expect(matchesWithAliases(haystack('Sendix'), 'MAT')).toBe(true);
    expect(matchesWithAliases(haystack('Sendix'), 'multi-academy trust')).toBe(true);
  });

  /**
   * Phase 1B found hearing and executive-function support were a DISCOVERABILITY
   * problem, not a missing-tool problem. These tools were always listed; now the
   * words a person actually types reach them.
   */
  it('finds existing accessibility tools that were previously hard to surface', () => {
    const otter = haystack('Otter.ai');
    expect(matchesWithAliases(otter, 'transcription')).toBe(true);

    const grid = haystack('Grid 3');
    expect(matchesWithAliases(grid, 'AAC')).toBe(true);
    expect(matchesWithAliases(grid, 'augmentative and alternative communication')).toBe(true);
  });
});
