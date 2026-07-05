import * as React from 'react';
import type { Methodology } from '@/components/trust/types';
import { formatDateGB } from '@/components/trust/utils';

export interface MethodologyStampProps {
  methodology: Methodology;
  className?: string;
}

export function MethodologyStamp({ methodology, className }: MethodologyStampProps) {
  const version = methodology.version.startsWith('v')
    ? methodology.version
    : `v${methodology.version}`;

  const date = formatDateGB(methodology.verifiedDate);
  const initials = methodology.reviewerInitials.toUpperCase();

  return (
    <p
      className={[
        'font-mono text-[11px] uppercase tracking-wide text-[var(--color-fog)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Methodology ${version}, verified ${date}, reviewer ${initials}`}
    >
      <span aria-hidden="true">
        METHODOLOGY {version} · VERIFIED {date} · REVIEWER {initials}
      </span>
    </p>
  );
}
