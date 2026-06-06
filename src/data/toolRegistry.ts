/**
 * toolRegistry.ts — the INTERNAL v3 priority registry (from the master CSV).
 *
 * Used ONLY for: directory ORDERING, PROMINENCE (P0–P3 placement), FILTERING, and
 * editorial workflow. NONE of these fields are ever shown to users.
 *
 * HARD RULES (founder decision, 2026-06):
 * - `new_priority_score` / `new_priority_band` are internal — never displayed.
 * - `methodMonetisationScore` (and the other method_* inputs) MUST NOT influence
 *   any public-facing trust/safety score. Public scoring lives ONLY in
 *   data/publicPillars.ts (the five real pillars).
 *
 * The master CSV is not yet wired. REGISTRY is empty until the v3 file is supplied;
 * the directory falls back to source order and shows pending public scores.
 */

export type ItemType = 'Tool' | 'Equipment' | 'Training' | 'Guidance' | (string & {});
export type PriorityBand = 'P0' | 'P1' | 'P2' | 'P3';

export interface RegistryRow {
  itemId: string;
  itemName: string;
  itemType: ItemType;

  // Internal v3 method inputs — NOT public scores, never displayed.
  methodAudienceScore?: number;
  methodUkScore?: number;
  methodMonetisationScore?: number; // internal-only; must not reach the public layer
  methodTrustScore?: number;
  methodEaseScore?: number;

  // Internal priority layer — ordering + placement only.
  newPriorityScore: number; // sort key / emphasis — never displayed
  newPriorityBand: PriorityBand; // P0–P3 placement — never displayed as a score
  newRecommendedAction?: string; // editorial workflow
}

/**
 * Loaded from the v3 master registry CSV.
 * TODO(next): parse the supplied CSV (rows ≈252) → RegistryRow[]. Map only the
 * trusted v3 columns; ignore all legacy/experimental/previous-band columns.
 */
export const REGISTRY: RegistryRow[] = [];

/** Directory item set: Tool rows only (excludes Equipment/Training/Guidance/etc). */
export function toolRows(): RegistryRow[] {
  return REGISTRY.filter((r) => r.itemType === 'Tool');
}

/** Internal ordering: highest priority first. */
export function byPriority(rows: RegistryRow[]): RegistryRow[] {
  return [...rows].sort((a, b) => b.newPriorityScore - a.newPriorityScore);
}

export function priorityFor(itemId: string): RegistryRow | undefined {
  return REGISTRY.find((r) => r.itemId === itemId);
}
