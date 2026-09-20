/**
 * trustSafety.ts — additive Trust & Safety facts for a directory listing.
 *
 * SEPARATE FROM THE PROMPTLY SCORE, deliberately. The five public pillars in
 * publicPillars.ts are a reviewer's assessment. What follows is a record of
 * FACTS a school asked about, each one either verified from a first-party or
 * authoritative source, or explicitly not yet verified.
 *
 * THE DEFAULT IS 'Needs verification' AND IT IS NOT OPTIONAL.
 * A field is only ever set to 'Yes'/'No'/'Partial' when Phase 1B verification
 * recorded evidence for it. Vague marketing language is NOT evidence: "enterprise
 * grade security", "GDPR ready" and "safe for schools" all map to
 * 'Needs verification'. Unknown is a far better answer than an invented one — a
 * school may act on this.
 *
 * NEVER express any of the following as a product property:
 *   - "KCSIE approved" / "KCSIE compliant". KCSIE places duties on SCHOOLS —
 *     an annual documented review, a named SLT member responsible. There is no
 *     product certification. A tool may help a school EVIDENCE its own duties;
 *     that is a school-level judgement, never a claim we publish.
 *   - "DfE approved". There is no ready-to-adopt official DfE AI policy pack.
 */
import type { ToolCapability } from './taxonomy';

/** The only values a Trust & Safety field may take. */
export const TRUST_VALUES = ['Yes', 'No', 'Partial', 'Needs verification'] as const;
export type TrustValue = (typeof TRUST_VALUES)[number];

/** The honest default. Anything unverified is this. */
export const NEEDS_VERIFICATION: TrustValue = 'Needs verification';

export interface TrustSafetyFacts {
  // ── Data & privacy ────────────────────────────────────────────────────────
  /** Vendor states UK/EU data hosting, with the region named. */
  ukDataHosting: TrustValue;
  /** Vendor states pupil/user data is NOT used to train models. */
  noTrainingOnUserData: TrustValue;
  /** A named retention position exists. */
  dataRetentionStated: TrustValue;
  // ── Child safety ──────────────────────────────────────────────────────────
  /** A minimum age is published. Free text because vendors state it differently. */
  minimumAge: string | 'Needs verification';
  /** Admin/teacher controls over pupil use. */
  adminControls: TrustValue;
  /** Parent-facing controls or visibility. */
  parentControls: TrustValue;
  // ── Education safety ──────────────────────────────────────────────────────
  /** A human reviews or approves output before it carries weight. */
  humanOversight: TrustValue;
  /** Answers are grounded in named sources rather than open generation. */
  sourceGrounding: TrustValue;
  // ── Procurement ───────────────────────────────────────────────────────────
  /** Available to UK organisations. */
  ukAvailability: TrustValue;
  /**
   * Framework availability (G-Cloud / CCS / DOS). 'Needs verification' unless a
   * framework listing was directly evidenced. NEVER inferred from a vendor
   * mentioning "public sector".
   */
  frameworkStatus: TrustValue;
}

/** Every field unverified. Spread this, then override only what was evidenced. */
export const UNVERIFIED_TRUST: TrustSafetyFacts = {
  ukDataHosting: NEEDS_VERIFICATION,
  noTrainingOnUserData: NEEDS_VERIFICATION,
  dataRetentionStated: NEEDS_VERIFICATION,
  minimumAge: NEEDS_VERIFICATION,
  adminControls: NEEDS_VERIFICATION,
  parentControls: NEEDS_VERIFICATION,
  humanOversight: NEEDS_VERIFICATION,
  sourceGrounding: NEEDS_VERIFICATION,
  ukAvailability: NEEDS_VERIFICATION,
  frameworkStatus: NEEDS_VERIFICATION,
};

/**
 * Directory-wide governance note for AI-assisted marking.
 *
 * Ofqual (January 2026) and JCQ are explicit: an AI tool CANNOT be the sole
 * marker. A human assessor must review all work in its entirety and determine
 * the mark it warrants, regardless of the AI's output — and centres must tell
 * learners when AI has assisted marking or feedback.
 *
 * Defined ONCE and attached by capability, so the wording cannot drift into
 * inconsistent prose across records. It is a governance note, not a score
 * input: it does not touch the Promptly Score methodology.
 */
export const MARKING_GOVERNANCE_NOTE =
  'AI-assisted marking cannot replace the human assessor. Ofqual and JCQ require ' +
  'a human to review the work in full and decide the mark, whatever the tool ' +
  'suggests, and learners must be told when AI has assisted marking or feedback.';

/**
 * Governance note for tools introduced into a school's filtering/monitoring
 * estate. The DfE Filtering and Monitoring Standards were updated in June 2026:
 * introducing a new AI tool is a formal trigger for an out-of-cycle review.
 */
export const FILTERING_REVIEW_NOTE =
  'Introducing a new AI tool is a formal trigger for an out-of-cycle filtering ' +
  'and monitoring review under the DfE standards updated in June 2026. ' +
  'Responsibility sits with a named member of the senior leadership team.';

/** Capabilities that carry a mandatory governance note. */
const NOTE_BY_CAPABILITY: Partial<Record<ToolCapability, string>> = {
  'Assessment / Marking': MARKING_GOVERNANCE_NOTE,
  'Filtering & Monitoring': FILTERING_REVIEW_NOTE,
};

/**
 * Governance notes a listing must display, derived from its capabilities.
 * Single source — a record never hand-writes this prose.
 */
export function governanceNotesFor(
  capabilities: readonly ToolCapability[] = [],
): string[] {
  const notes: string[] = [];
  for (const capability of capabilities) {
    const note = NOTE_BY_CAPABILITY[capability];
    if (note && !notes.includes(note)) notes.push(note);
  }
  return notes;
}
