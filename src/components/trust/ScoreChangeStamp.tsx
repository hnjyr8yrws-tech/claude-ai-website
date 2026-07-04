import * as React from 'react';
import type { ScoreChange } from '@/components/trust/types';
import { formatDateGB } from '@/components/trust/utils';

export interface ScoreChangeStampProps {
  change: ScoreChange;
  className?: string;
}

const ARROW = { up: '↑', down: '↓', none: '→' } as const;

const fmt = (n: number) => n.toFixed(1);

export function ScoreChangeStamp({ change, className }: ScoreChangeStampProps) {
  const { direction, from, to, date, reason } = change;
  const verb =
    direction === 'up' ? 'increased' : direction === 'down' ? 'decreased' : 'changed';

  // No traffic-light colours (§09: quality is never a recoloured digit) — the
  // direction is carried by the arrow glyph and the aria-label; the arrow takes
  // ink-accent, the light-surface substitute for lime.
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        'border-[var(--color-rule)] bg-[var(--color-oat)] text-[var(--text)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Score ${verb} from ${fmt(from)} to ${fmt(to)} on ${formatDateGB(date)}${
        reason ? `. ${reason}` : ''
      }`}
    >
      <span aria-hidden="true">
        <span style={{ color: 'var(--color-ink-accent)' }}>{ARROW[direction]}</span>{' '}
        {fmt(from)} → {fmt(to)} · {formatDateGB(date)}
      </span>
      {reason ? (
        <span aria-hidden="true" className="font-normal" style={{ color: 'var(--color-fog)' }}>
          ({reason})
        </span>
      ) : null}
    </span>
  );
}
