import { useEffect, useRef } from 'react';
import { track, type TrustSurface } from './analytics';

export interface ProvenancePayload {
  toolId: string;
  surface: TrustSurface;
  methodologyVersion: string;
  integrityState: string;
  displayState: string;
}

/**
 * §11 `provenance_viewed`: fires ONCE when the referenced element (a trust
 * stamp/card) is at least half visible in the viewport. Pass `null` to disable
 * (keeps hook order stable on pages with conditional models, e.g. 404 paths).
 * Re-arms when the toolId changes (slug navigation re-uses the mounted page).
 */
export function useProvenanceViewed<T extends HTMLElement>(payload: ProvenancePayload | null) {
  const ref = useRef<T | null>(null);
  const firedFor = useRef<string | null>(null);

  const toolId = payload?.toolId ?? null;
  useEffect(() => {
    const el = ref.current;
    if (!payload || !toolId || !el) return;
    if (firedFor.current === toolId) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && firedFor.current !== toolId) {
          firedFor.current = toolId;
          track({ name: 'provenance_viewed', ...payload });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // Payload is rebuilt per render; keying the effect on its fields keeps the
    // observer stable without requiring callers to memoise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId, payload?.surface, payload?.methodologyVersion, payload?.integrityState, payload?.displayState]);

  return ref;
}
