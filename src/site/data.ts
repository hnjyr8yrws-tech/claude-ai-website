/**
 * The public site's view of the tools (design v0.5).
 *
 * Founder decisions, 10 November 2026: no scores, outcomes or findings on the public site; every tool is shown as
 * under review until it has been reviewed under the updated methodology. Nothing here reads a score, a tier or the
 * internal registry: only a tool's name, what it is for, its category and who uses it.
 */
import { TOOLS, type Tool } from '../data/tools';
import { HISTORIC_TOOLS } from '../data/historic';

export const MAIL = 'mailto:info@getpromptly.co.uk';
export const REQUEST = 'mailto:info@getpromptly.co.uk?subject=Please%20review%20a%20tool';
export const JOIN = '/sign-in?mode=join';

export const AREAS: [string, string, string][] = [
  ['Data Privacy', '#6A8CAF', 'Where does information about pupils and staff go?'],
  ['Safeguarding', '#C8E44A', 'Are children protected, and can a problem be reported?'],
  ['Age Suitability', '#8C7A52', 'Does it fit the ages it’s used with?'],
  ['Transparency', '#4A4F5C', 'Is the vendor clear about what it is and what it can’t do?'],
  ['Accessibility', '#D97757', 'Can people with different needs use it?'],
];

export interface PublicTool { slug: string; name: string; letter: string; category: string; subcategory: string; audience: string[]; what: string; }

const collator = new Intl.Collator('en-GB', { sensitivity: 'base', numeric: true });

/** The shelf for every name that starts with a number (or anything that is not a letter). It stands after Z. */
export const NUMBERS = '0–9';

/**
 * Every active tool, A to Z, then the 0–9 shelf. Retired tools live in the historic registry and are not listed.
 * `letter` is the shelf a tool stands on: its first letter, or 0–9 when its name starts with a number.
 */
export const PUBLIC_TOOLS: PublicTool[] = TOOLS
  .filter((t: Tool) => !Object.prototype.hasOwnProperty.call(HISTORIC_TOOLS, t.slug))
  .map((t: Tool) => {
    const first = t.name.trim().charAt(0).toUpperCase();
    return { slug: t.slug, name: t.name, category: t.primaryCategory, subcategory: t.subcategory, audience: t.audience, what: t.desc,
      letter: /[A-Z]/.test(first) ? first : NUMBERS };
  })
  .sort((a, b) => (a.letter === NUMBERS ? 1 : 0) - (b.letter === NUMBERS ? 1 : 0) || collator.compare(a.name, b.name));

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
/** The address of a shelf on the Reviews page. */
export const shelfId = (letter: string) => 'letter-' + (letter === NUMBERS ? '0-9' : letter.toLowerCase());
export const HELD_LETTERS = new Set(PUBLIC_TOOLS.map((t) => t.letter));
export const CATEGORIES = Array.from(new Set(PUBLIC_TOOLS.map((t) => t.category))).sort(collator.compare);

/** Who uses a tool, in the filter's three plain groups. */
export const WHO: [string, string, string[]][] = [
  ['learners', 'children and students', ['Students']],
  ['staff', 'teachers and staff', ['Teachers', 'SLT', 'Admin', 'SENCO', 'Schools']],
  ['families', 'parents and carers', ['Parents']],
];

/**
 * A neutral sample of n tools for illustration (the homepage card, the Sign in bookcase): evenly spaced through the
 * A to Z list, so it is never a featured selection (HB-8). The same list every time.
 */
export function sample(n: number): PublicTool[] {
  if (PUBLIC_TOOLS.length <= n) return PUBLIC_TOOLS;
  const step = PUBLIC_TOOLS.length / n;
  return Array.from({ length: n }, (_, i) => PUBLIC_TOOLS[Math.floor(i * step)]);
}

export function findTool(slug: string | undefined): PublicTool | undefined {
  return PUBLIC_TOOLS.find((t) => t.slug === slug);
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Textual relevance only: the name first, then what it is used for. No ranking by anything else. */
export function search(q: string): { tool: PublicTool; why: string }[] | null {
  const n = norm(q);
  if (n.length < 2) return null;
  const out: { s: number; tool: PublicTool; why: string }[] = [];
  for (const t of PUBLIC_TOOLS) {
    const nm = norm(t.name);
    let s = 0, why = '';
    if (nm === n) s = 100;
    else if (nm.startsWith(n)) s = 90;
    else if (nm.split(' ').some((w) => w.startsWith(n))) s = 80;
    else if (n.includes(' ') && n.split(' ').every((w) => nm.includes(w))) s = 70;
    else if (norm(t.subcategory).includes(n) || norm(t.category).includes(n)) { s = 50; why = `Matched on the use: ${t.subcategory}.`; }
    else if (n.length > 3 && norm(t.what).includes(n)) { s = 40; why = 'Matched on what it is for.'; }
    if (s) out.push({ s, tool: t, why });
  }
  out.sort((a, b) => b.s - a.s || collator.compare(a.tool.name, b.tool.name));
  return out.map(({ tool, why }) => ({ tool, why }));
}
