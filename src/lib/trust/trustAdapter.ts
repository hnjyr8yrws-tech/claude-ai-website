/**
 * Trust Adapter — the single owner of (registry + methodology) → TrustDisplayModel.
 *
 * Phase 1 plan §0/§3/§5: no surface reads the registry directly; every score
 * reaches the screen through this mapping, and `integrity.state` set here is the
 * sole render gate (§4 Trust Policy 1 — enforced downstream by <Rule4bGuard>).
 *
 * Current data sources (all statically bundled — see notes at foot):
 *   - Tool registry .................. src/data/tools.ts            (TOOLS)
 *   - Published public scores ........ src/data/publicPillars.ts    (getPublicScore)
 *   - Child-safety withdrawal set .... src/data/publicPillars.ts    (isAwaitingReReview)
 *   - Methodology store / record ..... src/data/methodology.ts      (meta, integrity record, feed)
 *
 * Responsibilities owned HERE and nowhere else (§5 ownership boundaries):
 *   - deriving `displayState` (Active | Provisional | Updated) — Withdrawn /
 *     AwaitingReReview / Historic are explicit input flags, never derived
 *     (today the only explicit flag source is the withdrawal set);
 *   - staleness / TTL → `integrity.state = 'stale'`;
 *   - building the ordered five-pillar array with reserved colour tokens;
 *   - fail-closed shaping for every edge case (unknown tool, missing score).
 *
 * The adapter NEVER renders and NEVER mutates its sources.
 */

import { TOOLS } from '@/data/tools';
import { getPublicScore, isAwaitingReReview, type PublicToolScore } from '@/data/publicPillars';
import { isHistoric, getHistoricRecord } from '@/data/historic';
import { integrityRecord, scoreChangeFeed, methodologyMeta, toolReviewPath } from '@/data/methodology';
import {
  PILLAR_ORDER,
  type DisplayState,
  type Integrity,
  type PillarKey,
  type ScoreChange,
  type TrustDisplayModel,
  type TrustPillar,
} from '@/components/trust/types';
import { PILLAR_META, PILLAR_COLOUR_TOKENS, TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';

// ─── Tunables ─────────────────────────────────────────────────────────────────

/** displayState = 'Updated' while the latest score change is within this window
 *  (§3 changelog resolution 1 — N = 30; keep in sync with Prompt 1). */
export const UPDATED_WINDOW_DAYS = 30;

/** A verification older than this marks the model 'stale' → fail-closed (§4).
 *  Generous because the dataset is statically bundled and re-verified in batches;
 *  tighten once the registry is served live. */
export const VERIFICATION_TTL_DAYS = 400;

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Registry keys are camelCase; the canonical PillarKey is snake_case. */
const PUBLIC_KEY_MAP: Record<PillarKey, 'dataPrivacy' | 'safeguarding' | 'ageSuitability' | 'transparency' | 'accessibility'> = {
  data_privacy: 'dataPrivacy',
  safeguarding: 'safeguarding',
  age_suitability: 'ageSuitability',
  transparency: 'transparency',
  accessibility: 'accessibility',
};

/** Tolerant date parse — the dataset carries ISO dates ('2026-05-22'),
 *  loose verification stamps ('JUN 2026', 'APR 2026') and empty strings.
 *  Returns null when unparseable rather than guessing. */
function parseLooseDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t);
}

function daysSince(date: Date, now: Date): number {
  return (now.getTime() - date.getTime()) / 86_400_000;
}

/** The fixed five, in §03 order, with reserved colour tokens. Scores come from
 *  the published registry entry; evidence fields are null until a per-pillar
 *  evidence store exists (they are never invented here). */
function buildPillars(scores: Partial<Record<PillarKey, number>> | null): TrustPillar[] {
  return PILLAR_ORDER.map((key) => ({
    key,
    label: PILLAR_META[key].label,
    colourToken: PILLAR_COLOUR_TOKENS[key],
    score: scores?.[key] ?? null,
    evidence: null,
    citation: null,
    confidence: null,
    reviewDepth: null,
  }));
}

/** Per-tool score history from the methodology store: integrity-record
 *  score_change entries + curated feed entries for this slug, most recent
 *  first. Real tools currently have none (the shipped entries are illustrative
 *  "example-tool" placeholders), so this usually returns [] — but the pipe is
 *  live for the first real change. */
function buildScoreHistory(slug: string): ScoreChange[] {
  const fromRecord = integrityRecord
    .filter((e) => e.type === 'score_change' && e.tool.slug === slug)
    .map((e) => (e.type === 'score_change' ? e.change : null))
    .filter((c): c is ScoreChange => c !== null);
  const fromFeed = scoreChangeFeed.filter((e) => e.tool.slug === slug).map((e) => e.change);
  const all = [...fromRecord, ...fromFeed];
  // De-dupe (record + feed may carry the same event) and sort newest first.
  const seen = new Set<string>();
  return all
    .filter((c) => {
      const k = `${c.date}|${c.from}|${c.to}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => (parseLooseDate(b.date)?.getTime() ?? 0) - (parseLooseDate(a.date)?.getTime() ?? 0));
}

// ─── The adapter ──────────────────────────────────────────────────────────────

/**
 * Build the TrustDisplayModel for a tool, synchronously, from the bundled
 * sources. Fail-closed in every edge case:
 *
 *  - unknown slug            → integrity 'unavailable' (reason 'tool_not_found')
 *  - no published score      → displayState 'Provisional', promptlyScore null
 *  - withdrawn set           → displayState 'AwaitingReReview', score withheld
 *  - verification beyond TTL → integrity 'stale'
 *
 * `now` is injectable for tests/harnesses.
 */
export function buildTrustDisplayModel(toolSlug: string, now: Date = new Date()): TrustDisplayModel {
  const fetchedAt = now.toISOString();
  const tool = TOOLS.find((t) => t.slug === toolSlug) ?? null;
  const livePageUrl = toolReviewPath(toolSlug);

  // RL-017: retired tools are an explicit Historic flag, never derived. They carry
  // NO score, pillar score or tier (promptlyScore + all pillars null). The record may
  // live outside TOOLS, so this is resolved before the tool_not_found guard.
  if (isHistoric(toolSlug)) {
    const rec = getHistoricRecord(toolSlug)!;
    return {
      toolId: toolSlug,
      toolSlug,
      toolName: tool?.name ?? rec.name,
      verdict: null,
      promptlyScore: null,
      displayState: 'Historic',
      pillars: buildPillars(null),
      methodology: { version: methodologyMeta.version, verifiedDate: rec.retiredDate ?? '', reviewerInitials: methodologyMeta.reviewerInitials },
      reviewer: { initials: methodologyMeta.reviewerInitials, verifiedDate: rec.retiredDate ?? '' },
      scoreHistory: [],
      livePageUrl,
      // The retired record itself is a verified archive; the null score is what
      // fail-closes any score render downstream (never "unavailable"/"pending").
      integrity: { state: 'verified', fetchedAt },
    };
  }

  // Edge: tool not found — everything null, gate closed.
  if (!tool) {
    return {
      toolId: toolSlug,
      toolSlug,
      toolName: toolSlug,
      verdict: null,
      promptlyScore: null,
      displayState: 'Provisional',
      pillars: buildPillars(null),
      methodology: { version: methodologyMeta.version, verifiedDate: '', reviewerInitials: methodologyMeta.reviewerInitials },
      reviewer: { initials: methodologyMeta.reviewerInitials, verifiedDate: '' },
      scoreHistory: [],
      livePageUrl,
      integrity: { state: 'unavailable', reason: 'tool_not_found', fetchedAt },
    };
  }

  const awaiting = isAwaitingReReview(toolSlug); // explicit withdrawal flag — never derived
  const pub = getPublicScore(toolSlug);          // null for withdrawn tools (upstream failsafe) and unreviewed tools
  const scoreHistory = buildScoreHistory(toolSlug);

  // displayState: explicit flags win; then Updated (30-day window); then Active/Provisional.
  let displayState: DisplayState;
  if (awaiting) {
    displayState = 'AwaitingReReview';
  } else if (pub) {
    const latest = parseLooseDate(scoreHistory[0]?.date);
    displayState = latest && daysSince(latest, now) <= UPDATED_WINDOW_DAYS ? 'Updated' : 'Active';
  } else {
    displayState = 'Provisional';
  }

  // Staleness: verification date beyond TTL → 'stale' (fail-closed downstream).
  // Empty/unparseable verification dates skip the check (data-quality gap, noted
  // in docs) rather than failing the whole tool closed.
  let integrity: Integrity = { state: 'verified', fetchedAt };
  if (pub) {
    const verified = parseLooseDate(pub.verifiedDate);
    if (verified && daysSince(verified, now) > VERIFICATION_TTL_DAYS) {
      integrity = { state: 'stale', reason: 'verification_beyond_ttl', fetchedAt };
    }
  }

  const pillarScores = pub
    ? (Object.fromEntries(
        PILLAR_ORDER.map((key) => [key, pub.pillars[PUBLIC_KEY_MAP[key]]]),
      ) as Partial<Record<PillarKey, number>>)
    : null;

  return {
    toolId: toolSlug,
    toolSlug,
    toolName: tool.name,
    verdict: null, // §14 Plain Verdicts have no data source yet — never invented
    promptlyScore: pub ? pub.composite : null,
    displayState,
    pillars: buildPillars(pillarScores),
    methodology: pub
      ? { version: pub.methodologyVersion, verifiedDate: pub.verifiedDate, reviewerInitials: pub.reviewer }
      : { version: methodologyMeta.version, verifiedDate: '', reviewerInitials: methodologyMeta.reviewerInitials },
    reviewer: pub
      ? { initials: pub.reviewer, verifiedDate: pub.verifiedDate }
      : { initials: methodologyMeta.reviewerInitials, verifiedDate: '' },
    scoreHistory,
    livePageUrl,
    integrity,
  };
}

/**
 * Public entry point. Async so consumers are already shaped for the future
 * live-served registry (today it resolves immediately from the bundle).
 */
export async function getTrustDisplayModel(toolSlug: string): Promise<TrustDisplayModel> {
  return buildTrustDisplayModel(toolSlug);
}

// ─── Listing-weight selector ────────────────────────────────────────────────────

/**
 * The compact projection listing surfaces (Home, /tools, role pages) need: a
 * score + the camelCase pillar slice for the card + the suppression flag +
 * methodology-mark fields. A projection of the full model, so it shares the
 * exact same fail-closed resolution — but callers avoid depending on the raw
 * publicPillars shape (the adapter stays the single reader of that data).
 */
export interface TrustSummary {
  toolSlug: string;
  toolName: string;
  /** null ⇒ pending review or suppressed — never show a number. */
  promptlyScore: number | null;
  /** camelCase pillar scores for <PillarCard pillars>; null when no score. */
  pillars: PublicToolScore['pillars'] | null;
  displayState: DisplayState;
  /** Withdrawn / AwaitingReReview — render the withdrawn card, no number. */
  isSuppressed: boolean;
  methodologyVersion: string;
  /** '' when none — never invented (mark omits the VERIFIED segment). */
  verifiedDate: string;
  reviewer: string;
}

export function buildTrustSummary(toolSlug: string, now: Date = new Date()): TrustSummary {
  const m = buildTrustDisplayModel(toolSlug, now);
  let pillars: PublicToolScore['pillars'] | null = null;
  if (m.promptlyScore != null) {
    pillars = { dataPrivacy: 0, safeguarding: 0, ageSuitability: 0, transparency: 0, accessibility: 0 };
    for (const p of m.pillars) pillars[PUBLIC_KEY_MAP[p.key]] = p.score ?? 0;
  }
  return {
    toolSlug: m.toolSlug,
    toolName: m.toolName,
    promptlyScore: m.promptlyScore,
    pillars,
    displayState: m.displayState,
    isSuppressed: TRUST_SUPPRESSED_DISPLAY_STATES.includes(m.displayState),
    methodologyVersion: m.methodology.version,
    verifiedDate: m.methodology.verifiedDate,
    reviewer: m.reviewer.initials,
  };
}

/** Async facade, matching getTrustDisplayModel (resolves from the bundle today). */
export async function getTrustSummary(toolSlug: string): Promise<TrustSummary> {
  return buildTrustSummary(toolSlug);
}
