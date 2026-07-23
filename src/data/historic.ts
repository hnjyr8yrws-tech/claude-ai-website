/**
 * RL-017 — Historic / Retired tool registry (frontend), generic mechanism.
 *
 * A retired tool lives HERE, deliberately OUTSIDE the active `TOOLS` array, so:
 *   • the directory/search (which iterates `TOOLS`) excludes it automatically;
 *   • its `/tools/:slug` page still resolves — direct historic-record access is preserved;
 *   • it never carries a Promptly Score, pillar score or tier (the Trust Adapter maps
 *     Historic → displayState 'Historic' with promptlyScore null, and the review page
 *     renders a dedicated retired view — never "Pending review" / "Score not yet published").
 *
 * This module ships the MECHANISM only. `HISTORIC_TOOLS` is intentionally EMPTY here:
 * no production tool is marked Historic by this commit. Actual retired records are added
 * by separate, coordinated content commits. A defensive directory filter also excludes
 * any Historic slug that is still present in TOOLS (retirement in place). Tests exercise
 * the mechanism with injected fixtures, so nothing is published to production content.
 */

export interface HistoricRecord {
  /** Display name of the retired tool. */
  name: string;
  /** Retirement description — shown prominently on the record page (British Voice). */
  description: string;
  /**
   * Optional reference / related-information URL. This is NEVER a "Visit tool" link
   * and never a dead external tool URL — it is rendered only when set, and always
   * with an explicit label (see `referenceLabel`).
   */
  referenceUrl?: string | null;
  /** Label for the reference link — e.g. "Retirement information" or "Related information". */
  referenceLabel?: string;
  /** ISO date the tool was retired, if known. */
  retiredDate?: string;
}

/**
 * The retired-tool registry, keyed by CANONICAL slug (aligned with the Registry).
 *
 * `flipgrid-flip` is the canonical Flipgrid record (Registry slug). The previously
 * active Flipgrid tool is removed from `TOOLS` in the same commit, so there is exactly
 * one canonical record. Its short form `/tools/flip` redirects to `/tools/flipgrid-flip`.
 * `referenceUrl` is null: Flip has no live successor and Microsoft Teams is NOT the same
 * product, so no "Visit" / successor link is offered (and the dead flip.com URL is gone).
 */
export const HISTORIC_TOOLS: Record<string, HistoricRecord> = {
  'flipgrid-flip': {
    name: 'Flipgrid (Flip)',
    description:
      'Flip, formerly Flipgrid, was Microsoft’s video-discussion platform for education. ' +
      'The standalone Flip website and apps were retired on 30 September 2024. A limited Flip ' +
      'video-recording capability remains available within Microsoft Teams for Education, but ' +
      'the original discussion and response service is no longer available.',
    referenceUrl: null,
    retiredDate: '2024-09-30',
  },
};

/** True when a slug refers to a retired (Historic) tool. */
export function isHistoric(slug: string | null | undefined): boolean {
  return !!slug && Object.prototype.hasOwnProperty.call(HISTORIC_TOOLS, slug);
}

/** The retirement record for a slug, or null when the slug is not retired. */
export function getHistoricRecord(slug: string | null | undefined): HistoricRecord | null {
  return slug && isHistoric(slug) ? HISTORIC_TOOLS[slug] : null;
}
