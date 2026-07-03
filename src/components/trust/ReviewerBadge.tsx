import * as React from 'react';
import type { Reviewer } from '@/components/trust/types';
import { formatDateGB } from '@/components/trust/utils';

export interface ReviewerBadgeProps {
  reviewer: Reviewer;
  className?: string;
}

export function ReviewerBadge({ reviewer, className }: ReviewerBadgeProps) {
  const initials = reviewer.initials.toUpperCase();
  const date = formatDateGB(reviewer.verifiedDate);

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 text-sm text-neutral-700',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Reviewed by ${initials}, verified ${date}`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[11px] font-semibold text-white"
      >
        {initials}
      </span>
      <span aria-hidden="true" className="text-neutral-500">
        · {date}
      </span>
    </span>
  );
}
