/**
 * searchAliases.ts — controlled search synonyms.
 *
 * UK education runs on abbreviations, and a directory that only matches the
 * long form fails the people most likely to use the short one. A SENCO
 * searching "SENDCO" or "EHCP" should not get an empty page.
 *
 * CONTROLLED, like the taxonomy: every alias maps to terms that already exist
 * in the data (a category, subcategory, capability, audience or product name).
 * This does not invent concepts, and it does not widen a search into noise —
 * it expands a query into the words the records actually use.
 */

/**
 * Each entry: the terms a person might type → the terms to also search for.
 * Matching is case-insensitive and whole-word, so "man" never matches "SEN".
 */
const ALIAS_GROUPS: ReadonlyArray<readonly string[]> = [
  // SEND
  ['sen', 'send', 'special educational needs', 'special needs'],
  ['senco', 'sendco', 'send co-ordinator', 'send coordinator'],
  ['ehcp', 'ehc plan', 'education health and care plan', 'education, health and care plan'],
  ['isp', 'individual support plan'],
  // Early Years
  ['eyfs', 'early years', 'early years foundation stage', 'nursery', 'preschool', 'pre-school'],
  ['childminder', 'childminders'],
  // Sector
  ['la', 'local authority', 'council', 'local government'],
  ['mat', 'multi-academy trust', 'multi academy trust', 'academy trust', 'trust'],
  // Roles
  ['slt', 'senior leadership', 'senior leadership team', 'leadership'],
  ['dsl', 'designated safeguarding lead', 'safeguarding lead'],
  ['ep', 'educational psychologist', 'educational psychology'],
  ['salt', 'speech and language', 'speech & language', 'speech therapy'],
  ['ot', 'occupational therapy', 'occupational therapist'],
  // Access
  ['aac', 'augmentative and alternative communication', 'communication aid'],
  ['stt', 'speech to text', 'speech-to-text', 'dictation', 'transcription'],
  ['tts', 'text to speech', 'text-to-speech', 'read aloud'],
  ['vi', 'visual impairment', 'visually impaired', 'blind', 'braille'],
  ['hi', 'hearing impairment', 'hearing impaired', 'deaf', 'captioning', 'captions'],
  // Policy
  ['kcsie', 'keeping children safe in education'],
  ['dfe', 'department for education'],
  ['dpia', 'data protection impact assessment'],
  ['gdpr', 'uk gdpr', 'data protection'],
];

/** term → every term in its group (including itself). */
const EXPANSIONS: ReadonlyMap<string, readonly string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const group of ALIAS_GROUPS) {
    for (const term of group) {
      const existing = map.get(term) ?? [];
      // A term may legitimately sit in more than one group.
      map.set(term, [...new Set([...existing, ...group])]);
    }
  }
  return map;
})();

/** Whole-word test, so short aliases ("sen", "la", "ot") never match inside a word. */
function containsWord(haystack: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(haystack);
}

/**
 * Expands a query into itself plus any controlled aliases.
 * "senco" → ["senco", "sendco", "send co-ordinator", "send coordinator"]
 * Unknown queries come back unchanged.
 */
export function expandQuery(query: string): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const terms = new Set<string>([trimmed]);
  for (const [term, group] of EXPANSIONS) {
    if (containsWord(trimmed, term)) for (const t of group) terms.add(t);
  }
  return [...terms];
}

/**
 * True when `haystack` matches the query or any of its controlled aliases.
 * Multi-word aliases match as substrings; single short tokens match whole-word.
 */
export function matchesWithAliases(haystack: string, query: string): boolean {
  const hay = haystack.toLowerCase();
  const terms = expandQuery(query);
  if (terms.length === 0) return true;

  return terms.some(term =>
    term.includes(' ') ? hay.includes(term) : hay.includes(term) && containsWord(hay, term),
  );
}
