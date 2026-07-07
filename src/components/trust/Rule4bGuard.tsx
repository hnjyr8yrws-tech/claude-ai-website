import * as React from 'react';
import type { DisplayState, Integrity, TrustDisplayModel } from '@/components/trust/types';
import { evaluateTrustVisibility, type TrustVisibility } from '@/components/trust/utils';
import { track, type TrustSurface } from '@/utils/analytics';

export interface Rule4bGuardProps {
  /** Granular inputs — the original API, used across ToolDetail, Methodology and Luna. */
  integrity?: Integrity | null;
  displayState?: DisplayState;
  /** Convenience: derive integrity + displayState from the shared model. Also
   *  fail-closes when the model carries no score (promptlyScore == null). */
  trustData?: TrustDisplayModel;
  children: React.ReactNode;
  silent?: boolean;
  renderUnavailable?: (reason: 'display-state' | 'integrity') => React.ReactNode;
  /** §11: surface attribution for the `score_unavailable_shown` event. */
  surface?: TrustSurface;
  className?: string;
}

/**
 * Rule 4b enforcement (Trust Policy 1, fail-closed): children — the score
 * render — appear ONLY when integrity is verified, the display state is not
 * suppressed (Withdrawn / AwaitingReReview), and (when rendering from
 * trustData) a score actually exists. Anything else falls through to the
 * suppressed state. If neither granular props nor trustData are supplied the
 * guard fails closed rather than open.
 *
 * Emits `score_unavailable_shown` (site analytics) once per suppression state.
 */
export function Rule4bGuard({
  integrity,
  displayState,
  trustData,
  children,
  silent = false,
  renderUnavailable,
  surface,
  className,
}: Rule4bGuardProps) {
  const integrityEff = trustData ? trustData.integrity : integrity;
  const displayStateEff = trustData ? trustData.displayState : displayState;
  const scoreMissing = trustData ? trustData.promptlyScore == null : false;

  let v: TrustVisibility;
  if (!displayStateEff) {
    // No inputs at all — fail closed, never open.
    v = { visible: false, reason: 'integrity' };
  } else {
    v = evaluateTrustVisibility(integrityEff, displayStateEff);
    if (v.visible && scoreMissing) v = { visible: false, reason: 'integrity' };
  }

  const suppressedReason = v.visible ? null : v.reason;
  React.useEffect(() => {
    if (!suppressedReason) return;
    track({
      name: 'score_unavailable_shown',
      reason: suppressedReason,
      displayState: displayStateEff ?? 'unknown',
      // Standard §11 properties, present when the guard runs from trustData.
      ...(surface ? { surface } : {}),
      ...(trustData
        ? {
            toolId: trustData.toolId,
            methodologyVersion: trustData.methodology.version,
            integrityState: trustData.integrity.state,
          }
        : {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressedReason, displayStateEff, surface, trustData?.toolId]);

  if (v.visible) {
    return <>{children}</>;
  }

  if (silent) return null;

  if (renderUnavailable) {
    return <>{renderUnavailable(v.reason)}</>;
  }

  const message =
    v.reason === 'display-state'
      ? displayStateEff === 'Withdrawn'
        ? 'This assessment has been withdrawn.'
        : 'Awaiting re-review.'
      : 'Trust details are currently unavailable.';

  return (
    <div
      role="status"
      className={[
        'rounded-md border border-[var(--color-rule)] bg-[var(--color-oat)] px-3 py-2 text-sm text-site-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {message}
    </div>
  );
}
