import { Link } from 'react-router-dom';
import { Rule4bGuard, MethodologyStamp, type DisplayState, type Integrity } from '@/components/trust';
import { ScorePill } from '@/components/trust/PillarCard';
import { getPublicScore, isAwaitingReReview } from '@/data/publicPillars';
import { TOOLS } from '@/data/tools';

// Lazy-loaded on purpose (see AgentWidget): keeps the TOOLS/publicPillars data
// out of the main bundle so it only loads once the chat is actually used.

// Ambiguous / common-word tool names skipped by the heuristic to avoid false
// positives in ordinary prose. The structured `tools` payload bypasses this.
const AMBIGUOUS_NAMES = new Set([
  'poe', 'twee', 'gamma', 'claude', 'meta ai', 'conker', 'inkling', 'fetchy', 'canva',
]);

/**
 * Conservative detector: slugs of tools whose FULL name appears as a whole
 * word/phrase in `text`. Deliberately misses more than it over-matches.
 * Interim trigger only — prefer the structured `tools` payload from n8n.
 */
export function detectToolSlugs(text: string): string[] {
  if (!text) return [];
  const hay = text.toLowerCase();
  const out: string[] = [];
  for (const t of TOOLS) {
    const name = t.name.toLowerCase();
    if (AMBIGUOUS_NAMES.has(name)) continue;
    const compact = name.replace(/[^a-z0-9]/g, '');
    if (compact.length < 6 && !name.includes(' ')) continue; // skip short single-word names
    const idx = hay.indexOf(name);
    if (idx === -1) continue;
    const before = idx === 0 ? ' ' : hay[idx - 1] ?? ' ';
    const after = idx + name.length >= hay.length ? ' ' : hay[idx + name.length] ?? ' ';
    if (/[a-z0-9]/.test(before) || /[a-z0-9]/.test(after)) continue; // require whole-word match
    if (!out.includes(t.slug)) out.push(t.slug);
  }
  return out;
}

/**
 * Compact, fail-closed trust stamp for one tool referenced in a Luna reply.
 * Drives the shared Rule4bGuard from the site's published trust model:
 *   verified  → name + Promptly Score pill + methodology mark
 *   withdrawn → "score withheld · awaiting re-review" + link to /methodology
 *   pending   → "review in progress" (no number)
 *   unknown   → nothing (fail-closed)
 */
export function LunaTrustStamp({ slug }: { slug: string }) {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return null;

  const pub = getPublicScore(slug);
  const awaiting = isAwaitingReReview(slug);
  const displayState: DisplayState = awaiting ? 'AwaitingReReview' : pub ? 'Active' : 'Provisional';
  const integrity: Integrity = pub ? { state: 'verified', checkedAt: pub.verifiedDate } : { state: 'unavailable' };
  const toPath = `/tools/${slug}`;

  return (
    <div className="rounded-lg border px-2.5 py-1.5 text-xs" style={{ borderColor: 'var(--color-rule)', background: '#faf9f6' }}>
      <Rule4bGuard
        integrity={integrity}
        displayState={displayState}
        renderUnavailable={() =>
          awaiting ? (
            <span className="inline-flex flex-wrap items-center gap-1.5" style={{ color: 'var(--color-ink-muted)' }}>
              <Link to={toPath} className="font-semibold" style={{ color: 'var(--text)' }}>{tool.name}</Link>
              <span>· score withheld ·</span>
              <Link
                to="/methodology"
                className="font-semibold underline underline-offset-2"
                style={{ color: 'var(--color-ink-accent)' }}
              >
                awaiting re-review
              </Link>
            </span>
          ) : (
            <span className="inline-flex flex-wrap items-center gap-1.5" style={{ color: 'var(--color-ink-muted)' }}>
              <Link to={toPath} className="font-semibold" style={{ color: 'var(--text)' }}>{tool.name}</Link>
              <span>· review in progress</span>
            </span>
          )
        }
      >
        {pub ? (
          <div className="inline-flex flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5">
              <Link to={toPath} className="font-semibold" style={{ color: 'var(--text)' }}>{tool.name}</Link>
              <ScorePill score={pub.composite} to={toPath} />
            </span>
            <MethodologyStamp
              methodology={{
                version: pub.methodologyVersion,
                verifiedDate: pub.verifiedDate,
                reviewerInitials: pub.reviewer,
              }}
            />
          </div>
        ) : null}
      </Rule4bGuard>
    </div>
  );
}

export interface LunaMessageTrustProps {
  text: string;
  tools?: { slug: string }[];
}

/**
 * Renders compact guarded trust stamps for tools referenced in a Luna reply.
 * Prefers the structured `tools` payload; falls back to conservative text
 * detection. Capped at 3 stamps to keep the chat tidy.
 */
export default function LunaMessageTrust({ text, tools }: LunaMessageTrustProps) {
  const slugs = Array.from(
    new Set((tools?.map((t) => t.slug) ?? detectToolSlugs(text)).filter(Boolean)),
  ).slice(0, 3);

  if (slugs.length === 0) return null;

  return (
    <div className="mt-1.5 flex flex-col gap-1 max-w-[86%]">
      {slugs.map((s) => (
        <LunaTrustStamp key={s} slug={s} />
      ))}
    </div>
  );
}
