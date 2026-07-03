import * as React from 'react';
import type { ScoreChange } from '@/components/trust/types';
import { formatDateGB } from '@/components/trust/utils';

export interface ScoreChangeStampProps {
  change: ScoreChange;
  className?: string;
}

const ARROW = { up: '↑', down: '↓', none: '→' } as const;
const TONE = {
  up: 'text-green-700 bg-green-50 border-green-200',
  down: 'text-red-700 bg-red-50 border-red-200',
  none: 'text-neutral-600 bg-neutral-50 border-neutral-200',
} as const;

const fmt = (n: number) => n.toFixed(1);

export function ScoreChangeStamp({ change, className }: ScoreChangeStampProps) {
  const { direction, from, to, date, reason } = change;
  const verb =
    direction === 'up' ? 'increased' : direction === 'down' ? 'decreased' : 'changed';

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        TONE[direction],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Score ${verb} from ${fmt(from)} to ${fmt(to)} on ${formatDateGB(date)}${
        reason ? `. ${reason}` : ''
      }`}
    >
      <span aria-hidden="true">
        {ARROW[direction]} {fmt(from)} → {fmt(to)} · {formatDateGB(date)}
      </span>
      {reason ? (
        <span aria-hidden="true" className="font-normal opacity-80">
          ({reason})
        </span>
      ) : null}
    </span>
  );
}
