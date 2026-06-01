/**
 * useRoleSync — wire a filterable page to the global role selection.
 *
 * On mount (and on every `role:changed` broadcast from the nav role strip), it
 * maps the current role slug to this page's filter value and calls `apply`.
 * Pass a `map` from role slug → the page's own filter value; slugs absent from
 * the map are ignored (the page keeps its current filter).
 */

import { useEffect } from 'react';
import { getRole, ROLE_CHANGED } from '../utils/role';

export function useRoleSync<T>(map: Record<string, T>, apply: (value: T) => void): void {
  useEffect(() => {
    const applyFromSlug = (slug: string) => {
      if (slug && slug in map) apply(map[slug]);
    };
    // Initial hydrate from the cookie.
    applyFromSlug(getRole());
    // React to later changes from the role strip / hero chips.
    const handler = (e: Event) => applyFromSlug((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, handler);
    return () => window.removeEventListener(ROLE_CHANGED, handler);
    // map/apply are stable per render in practice; intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
