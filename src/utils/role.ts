/**
 * role.ts — the single source of truth for the visitor's selected role.
 *
 * Set by the nav role strip (and the homepage hero chips). Persisted in a
 * session cookie `role=[slug]` so it survives page navigation, and broadcast via
 * a `role:changed` CustomEvent that every filterable page component can listen
 * to. Slug is the canonical value everywhere.
 */

export const ROLE_CHANGED = 'role:changed';
export const ROLE_COOKIE = 'role';

export interface Role {
  slug: string;
  label: string;
  /** Natural-language persona used when pre-filling a Luna prompt. */
  luna: string;
}

export const ROLES: Role[] = [
  { slug: 'teacher',       label: 'Teacher',       luna: 'teacher' },
  { slug: 'senco',         label: 'SENCO',         luna: 'SENCO' },
  { slug: 'school-leader', label: 'School Leader', luna: 'school leader' },
  { slug: 'parent',        label: 'Parent',        luna: 'parent' },
  { slug: 'student',       label: 'Student',       luna: 'student' },
  { slug: 'admin',         label: 'Admin',         luna: 'school administrator' },
];

export function roleBySlug(slug: string | null | undefined): Role | undefined {
  return ROLES.find(r => r.slug === slug);
}

/** Read the current role slug from the session cookie ('' if none). */
export function getRole(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)role=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Persist a role slug as a session cookie and broadcast `role:changed`.
 * Pass '' to clear the selection.
 */
export function setRole(slug: string): void {
  if (typeof document === 'undefined') return;
  if (slug) {
    // Session cookie (no Expires/Max-Age) — cleared when the browser closes.
    document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(slug)}; path=/; SameSite=Lax`;
  } else {
    document.cookie = `${ROLE_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
  }
  window.dispatchEvent(new CustomEvent(ROLE_CHANGED, { detail: slug }));
}
