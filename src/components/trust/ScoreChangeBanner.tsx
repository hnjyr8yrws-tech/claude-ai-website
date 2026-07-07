import { Link } from 'react-router-dom';
import type { TrustDisplayModel } from '@/components/trust/types';
import { formatDateGB } from '@/components/trust/utils';
import { scoreChangeAnchor } from '@/data/methodology';

/**
 * ScoreChangeBanner (Concept 5, Iter 2 · Phase 1).
 *
 * A quiet, factual "score updated recently" notice for a tool detail page,
 * linking to the relevant entry on the Living Methodology page.
 *
 * Renders ONLY when the Trust Adapter marks the tool `Updated` — i.e. a
 * published score change within the 30-day window (UPDATED_WINDOW_DAYS) — AND
 * the score is currently shown (integrity verified). Fail-closed: withdrawn /
 * awaiting-re-review / provisional / stale tools render nothing, because
 * `displayState` is only ever `Updated` for a currently-scored tool.
 *
 * No hype, British voice, no traffic-light colours; the link uses the
 * light-surface accent (ink-accent) per §16.
 */

const MS_PER_DAY = 86_400_000;

/** Whole-day "how long ago" label from an ISO/loose date string. */
function daysAgoLabel(dateStr: string, now: Date): string {
  const then = new Date(dateStr);
  if (Number.isNaN(then.getTime())) return 'recently';
  const days = Math.max(0, Math.floor((now.getTime() - then.getTime()) / MS_PER_DAY));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

export interface ScoreChangeBannerProps {
  trustData: TrustDisplayModel;
  /** Injectable for tests/harnesses. */
  now?: Date;
  className?: string;
}

export function ScoreChangeBanner({ trustData, now = new Date(), className }: ScoreChangeBannerProps) {
  // `Updated` already implies a published score + a change within the window
  // (adapter §3). Also require the score to actually be shown (fail-closed).
  if (trustData.displayState !== 'Updated') return null;
  if (trustData.integrity.state !== 'verified') return null;

  const change = trustData.scoreHistory[0];
  if (!change) return null;

  const ago = daysAgoLabel(change.date, now);
  const href = scoreChangeAnchor(trustData.toolSlug);

  return (
    <div
      role="status"
      className={[
        'flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3.5 py-2.5 text-sm',
        'border-[var(--color-rule)] bg-[var(--color-oat)] text-[var(--text)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>
        Score updated <strong className="font-semibold">{ago}</strong>
        <span className="text-site-muted"> · {formatDateGB(change.date)}</span>
      </span>
      <Link
        to={href}
        className="font-semibold underline underline-offset-2"
        style={{ color: 'var(--color-ink-accent)' }}
      >
        View changes →
      </Link>
    </div>
  );
}
