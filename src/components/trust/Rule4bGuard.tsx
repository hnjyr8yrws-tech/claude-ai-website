import * as React from 'react';
import type { DisplayState, Integrity } from '@/components/trust/types';
import { evaluateTrustVisibility } from '@/components/trust/utils';

export interface Rule4bGuardProps {
  integrity: Integrity | null | undefined;
  displayState: DisplayState;
  children: React.ReactNode;
  silent?: boolean;
  renderUnavailable?: (reason: 'display-state' | 'integrity') => React.ReactNode;
  className?: string;
}

export function Rule4bGuard({
  integrity,
  displayState,
  children,
  silent = false,
  renderUnavailable,
  className,
}: Rule4bGuardProps) {
  const v = evaluateTrustVisibility(integrity, displayState);

  if (v.visible) {
    return <>{children}</>;
  }

  if (silent) return null;

  if (renderUnavailable) {
    return <>{renderUnavailable(v.reason)}</>;
  }

  const message =
    v.reason === 'display-state'
      ? displayState === 'Withdrawn'
        ? 'This assessment has been withdrawn.'
        : 'Awaiting re-review.'
      : 'Trust details are currently unavailable.';

  return (
    <div
      role="status"
      className={[
        'rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {message}
    </div>
  );
}
