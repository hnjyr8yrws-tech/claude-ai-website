/**
 * Concept 5 — real ScoreChangeFeed → alerts (Iter 2 · Phase 2).
 *
 * Reads the PUBLISHED score-change records (the ScoreChangeFeed + the
 * integrity-record `score_change` entries — the same sources the Trust Adapter
 * merges into a tool's scoreHistory) and composes alerts, filtered to recent
 * changes. This is the discovery + recency layer; per-change composition and the
 * significance policy still live in buildAlerts.ts / significance.ts.
 *
 * Fail-closed: for a change on a REAL registry tool, the alert is produced only
 * when that tool's current model shows a score (integrity `verified`, not a
 * suppressed display state) — a withdrawn / awaiting-re-review / stale tool
 * yields no score_change alert. Records for illustrative (non-registry) slugs
 * are treated as authored demo data so the dry-run harness has something to show.
 *
 * Delivery-agnostic: composition only. Nothing is sent (see dryRun.ts).
 */
import type { ScoreChange } from '@/components/trust/types';
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';
import { TOOLS } from '@/data/tools';
import { buildTrustDisplayModel } from '@/lib/trust/trustAdapter';
import {
  integrityRecord,
  scoreChangeFeed,
  methodologyMeta,
  toolReviewPath,
  type ToolRef,
  type ScoreChangeRecord,
} from '@/data/methodology';
import { alertFromChange, contextFromModel } from './buildAlerts';
import type { AlertContext, ScoreChangeAlert } from './types';

/** Recency window for a "recent" score change — matches the adapter's UPDATED_WINDOW_DAYS. */
export const FEED_WINDOW_DAYS = 30;

const MS_PER_DAY = 86_400_000;

/** Whole/partial days between a change date and `now`; Infinity when unparseable. */
export function daysSinceChange(dateStr: string, now: Date): number {
  const then = new Date(dateStr);
  if (Number.isNaN(then.getTime())) return Infinity; // unparseable → never "recent"
  return (now.getTime() - then.getTime()) / MS_PER_DAY;
}

export interface FeedChange {
  tool: ToolRef;
  change: ScoreChange;
}

/**
 * Every published score-change record (feed + integrity-record score_changes),
 * de-duped by slug|date|from|to (the two sources may carry the same event).
 */
export function collectFeedChanges(): FeedChange[] {
  const all: FeedChange[] = [
    ...scoreChangeFeed.map((e) => ({ tool: e.tool, change: e.change })),
    ...integrityRecord
      .filter((e): e is ScoreChangeRecord => e.type === 'score_change')
      .map((e) => ({ tool: e.tool, change: e.change })),
  ];
  const seen = new Set<string>();
  return all.filter(({ tool, change }) => {
    const key = `${tool.slug}|${change.date}|${change.from}|${change.to}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Compose one alert from a feed change. Returns null when fail-closed
 * suppression applies (a real tool whose score is not currently shown).
 */
function feedChangeToAlert(fc: FeedChange, now: Date): ScoreChangeAlert | null {
  const isRegistryTool = TOOLS.some((t) => t.slug === fc.tool.slug);

  if (isRegistryTool) {
    // Fail-closed via the adapter: only alert when the score is currently shown.
    const model = buildTrustDisplayModel(fc.tool.slug, now);
    if (model.integrity.state !== 'verified') return null;
    if (TRUST_SUPPRESSED_DISPLAY_STATES.includes(model.displayState)) return null;
    return alertFromChange(fc.change, contextFromModel(model));
  }

  // Illustrative record (no registry tool) — authored demo data, kept for the harness.
  const ctx: AlertContext = {
    toolId: fc.tool.slug,
    toolSlug: fc.tool.slug,
    toolName: fc.tool.name,
    livePageUrl: toolReviewPath(fc.tool.slug),
    methodologyVersion: methodologyMeta.version,
    reviewer: methodologyMeta.reviewerInitials,
    displayState: 'Updated',
    integrityState: 'verified',
  };
  return alertFromChange(fc.change, ctx);
}

export interface FeedAlertOptions {
  /** Only include changes within `windowDays` of `now`. Default true. */
  recentOnly?: boolean;
  windowDays?: number;
}

/**
 * Alerts from the real ScoreChangeFeed (+ integrity-record score_changes).
 * Defaults to the production behaviour: only changes within the last 30 days.
 * Pass `{ recentOnly: false }` to evaluate every record (dry-run harness).
 *
 * A tool with no score-change record simply contributes nothing (unchanged
 * behaviour for the rest of the catalogue).
 */
export function buildAlertsFromFeed(now: Date = new Date(), opts: FeedAlertOptions = {}): ScoreChangeAlert[] {
  const { recentOnly = true, windowDays = FEED_WINDOW_DAYS } = opts;
  return collectFeedChanges()
    .filter((fc) => (recentOnly ? daysSinceChange(fc.change.date, now) <= windowDays : true))
    .map((fc) => feedChangeToAlert(fc, now))
    .filter((a): a is ScoreChangeAlert => a !== null);
}
