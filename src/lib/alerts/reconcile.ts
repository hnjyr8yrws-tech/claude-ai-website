/**
 * Concept 5 — reconciliation / audit layer (Iter 3 · Phase 2).
 *
 * A GUARDRAIL, not a trigger. Compares the AUTHORED records (source of truth —
 * score_change feed + integrity records + the withdrawal set) against what each
 * surface currently shows, and reports desyncs as internal reconciliation
 * events. Raw diffing here NEVER fires a public or internal *alert* — alerts
 * stay on the authored-record path (Phase 1). This exists to catch the class of
 * bug behind the past withdrawal desync (site withdrew a tool but Luna kept
 * quoting its score).
 *
 * Surfaces:
 *   - "site" — computed live from the Trust Adapter (the client's only real
 *     score source).
 *   - "luna" — an INJECTED snapshot. Luna's real store is server-side
 *     (n8n / Qdrant); the client cannot read it, so callers pass a snapshot
 *     (in production sourced from the Qdrant payload; in the dev harness a demo
 *     snapshot with deliberate desyncs). No snapshot → that surface is simply
 *     not reconciled (fail-closed — we never invent a surface's data).
 *
 * Internal-only, read-only. Never mutates any source or surface.
 */
import { TRUST_SUPPRESSED_DISPLAY_STATES } from '@/components/trust/constants';
import { buildTrustDisplayModel } from '@/lib/trust/trustAdapter';
import { integrityRecord } from '@/data/methodology';
import { collectFeedChanges } from './feed';

export type Surface = 'site' | 'luna';

export type ReconIssueType =
  | 'SCORE_MISMATCH'      // surface shows a score that differs from the authored value
  | 'MISSING_UPDATE'      // authored score exists but the surface doesn't show it
  | 'STALE_LUNA'          // Luna still shows a score for a tool authored as withdrawn
  | 'STALE_SUPPRESSION';  // site still shows a score for a tool authored as withdrawn

/** What a surface currently believes about one tool's score. */
export interface SurfaceScore {
  slug: string;
  /** Composite the surface shows; null when no score is shown. */
  score: number | null;
  /** Whether the surface withholds the score (withdrawn / awaiting). */
  suppressed: boolean;
}

export interface SurfaceSnapshot {
  surface: Surface;
  scores: SurfaceScore[];
}

export interface ReconciliationEvent {
  type: ReconIssueType;
  surface: Surface;
  slug: string;
  toolName: string;
  /** Source-of-truth score (null when the authored truth is "withdrawn"). */
  authoredScore: number | null;
  /** What the surface actually shows. */
  observedScore: number | null;
  detail: string;
  audience: 'internal';
}

/** The authored source of truth for one tool. */
interface AuthoredTruth {
  slug: string;
  toolName: string;
  /** Should the score be withheld everywhere (withdrawal)? */
  suppressed: boolean;
  /** Latest authored composite (null when suppressed). */
  score: number | null;
}

const parseDate = (s: string) => {
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
};

/**
 * The authored truth per tool: latest score_change `to` wins, then a withdrawal
 * overrides to "suppressed" (a withdrawn tool must be withheld everywhere,
 * whatever a prior score change said).
 */
export function authoredTruths(): AuthoredTruth[] {
  const map = new Map<string, AuthoredTruth>();

  // Score changes — oldest first so the latest `to` overwrites.
  const changes = [...collectFeedChanges()].sort((a, b) => parseDate(a.change.date) - parseDate(b.change.date));
  for (const fc of changes) {
    map.set(fc.tool.slug, { slug: fc.tool.slug, toolName: fc.tool.name, suppressed: false, score: fc.change.to });
  }

  // Withdrawals override — the score is withheld regardless of any prior change.
  for (const rec of integrityRecord) {
    if (rec.type !== 'withdrawal') continue;
    for (const tool of rec.tools) {
      map.set(tool.slug, { slug: tool.slug, toolName: tool.name, suppressed: true, score: null });
    }
  }

  return [...map.values()];
}

/** The "site" surface, computed live from the Trust Adapter for every authored tool. */
export function siteSurfaceSnapshot(now: Date = new Date()): SurfaceSnapshot {
  return {
    surface: 'site',
    scores: authoredTruths().map((t) => {
      const m = buildTrustDisplayModel(t.slug, now);
      return {
        slug: t.slug,
        score: m.promptlyScore,
        suppressed: TRUST_SUPPRESSED_DISPLAY_STATES.includes(m.displayState) || m.integrity.state !== 'verified',
      };
    }),
  };
}

function compare(t: AuthoredTruth, obs: SurfaceScore, surface: Surface): ReconciliationEvent | null {
  const base = {
    surface,
    slug: t.slug,
    toolName: t.toolName,
    authoredScore: t.score,
    observedScore: obs.score,
    audience: 'internal' as const,
  };

  if (t.suppressed) {
    // Authored truth: withdrawn → must be withheld everywhere.
    if (!obs.suppressed && obs.score != null) {
      return {
        ...base,
        type: surface === 'luna' ? 'STALE_LUNA' : 'STALE_SUPPRESSION',
        detail: `${surface} still shows ${obs.score.toFixed(1)} for a tool authored as withdrawn (score should be withheld)`,
      };
    }
    return null; // both withhold — in sync
  }

  // Authored truth: a published score.
  if (obs.suppressed || obs.score == null) {
    return {
      ...base,
      type: 'MISSING_UPDATE',
      detail: `authored score ${t.score?.toFixed(1)} not reflected on ${surface} (no score shown)`,
    };
  }
  if (obs.score !== t.score) {
    return {
      ...base,
      type: 'SCORE_MISMATCH',
      detail: `${surface} shows ${obs.score.toFixed(1)}, authored record says ${t.score?.toFixed(1)}`,
    };
  }
  return null; // in sync
}

/**
 * Reconcile the authored truth against each supplied surface snapshot.
 * Read-only; produces internal reconciliation events. A tool with no authored
 * record is never checked (nothing authored to reconcile against), so the rest
 * of the catalogue is unaffected.
 */
export function reconcile(surfaces: SurfaceSnapshot[]): ReconciliationEvent[] {
  const truths = authoredTruths();
  const events: ReconciliationEvent[] = [];
  for (const surface of surfaces) {
    const bySlug = new Map(surface.scores.map((s) => [s.slug, s]));
    for (const t of truths) {
      // A surface that doesn't list a tool is treated as withholding it.
      const obs = bySlug.get(t.slug) ?? { slug: t.slug, score: null, suppressed: true };
      const ev = compare(t, obs, surface.surface);
      if (ev) events.push(ev);
    }
  }
  return events;
}
