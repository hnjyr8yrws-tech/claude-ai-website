/**
 * Concept 5 — safeguarding withdrawal propagation (Iter 3 · Phase 3).
 *
 * The highest-priority path. When a safeguarding withdrawal record is authored,
 * every affected tool must be withheld on EVERY surface (site + Luna). This
 * module turns each withdrawal record into a per-surface propagation status +
 * concrete downstream tasks, so a desync (site withdrew, Luna didn't — the past
 * bug) is caught and made actionable, not left to manual steps.
 *
 * Detection + P1 classification already exist (buildInternalAlerts, Phase 1);
 * reconciliation detects STALE_LUNA (Phase 2). This adds the propagation ledger.
 *
 * Fail-safe: a surface we cannot confirm (no snapshot — e.g. Qdrant unreachable)
 * is `unknown`, NOT assumed done; it is surfaced and logged as a gap. Withdrawn
 * tools stay fail-closed everywhere — this module only READS surface state.
 * Internal-only; never triggers a public/subscribed alert.
 */
import { integrityRecord, type ToolRef } from '@/data/methodology';
import type { Surface, SurfaceSnapshot } from './reconcile';

export type PropagationStatus = 'propagated' | 'pending' | 'unknown';

/** The surfaces a withdrawal must reach. */
export const PROPAGATION_SURFACES: Surface[] = ['site', 'luna'];

export interface PendingTool {
  slug: string;
  toolName: string;
  /** The score the surface is still showing (the gap). */
  observedScore: number | null;
}

export interface SurfacePropagation {
  surface: Surface;
  status: PropagationStatus;
  totalTools: number;
  propagatedCount: number;
  /** Tools still scored on this surface — the outstanding work. */
  pendingTools: PendingTool[];
}

export interface WithdrawalPropagation {
  recordId: string;
  date: string;
  reasonCategory: string;
  isSafeguarding: boolean;
  summary: string;
  toolCount: number;
  /** P1 for safeguarding withdrawals (matches buildInternalAlerts). */
  alertPriority: 1 | 2 | 3;
  /** `propagated` only when every surface is fully propagated. */
  overallStatus: PropagationStatus;
  surfaces: SurfacePropagation[];
}

/** A concrete downstream action for a surface that hasn't caught up. */
export interface PropagationTask {
  recordId: string;
  surface: Surface;
  slug: string;
  toolName: string;
  action: 'withhold-score';
  reason: string;
}

function surfacePropagation(surface: Surface, snap: SurfaceSnapshot | undefined, tools: ToolRef[]): SurfacePropagation {
  // Fail-safe: no snapshot → cannot confirm → unknown (never assumed done).
  if (!snap) {
    return { surface, status: 'unknown', totalTools: tools.length, propagatedCount: 0, pendingTools: [] };
  }
  const bySlug = new Map(snap.scores.map((s) => [s.slug, s]));
  const pendingTools: PendingTool[] = [];
  for (const t of tools) {
    const obs = bySlug.get(t.slug);
    // Withheld = absent, explicitly suppressed, or no score shown.
    const withheld = !obs || obs.suppressed || obs.score == null;
    if (!withheld && obs) {
      pendingTools.push({ slug: t.slug, toolName: t.name, observedScore: obs.score });
    }
  }
  return {
    surface,
    status: pendingTools.length ? 'pending' : 'propagated',
    totalTools: tools.length,
    propagatedCount: tools.length - pendingTools.length,
    pendingTools,
  };
}

/**
 * Per-withdrawal propagation status across the expected surfaces. Pass the
 * surface snapshots you could gather (site via siteSurfaceSnapshot; luna from
 * the Qdrant payload / a demo). A surface with no snapshot is reported `unknown`.
 */
export function buildWithdrawalPropagation(surfaces: SurfaceSnapshot[]): WithdrawalPropagation[] {
  const provided = new Map(surfaces.map((s) => [s.surface, s]));
  const out: WithdrawalPropagation[] = [];

  for (const rec of integrityRecord) {
    if (rec.type !== 'withdrawal') continue;
    const isSafeguarding = /safeguard/i.test(rec.reasonCategory);
    const surfaceResults = PROPAGATION_SURFACES.map((sf) => surfacePropagation(sf, provided.get(sf), rec.tools));
    const overallStatus: PropagationStatus = surfaceResults.every((s) => s.status === 'propagated')
      ? 'propagated'
      : surfaceResults.some((s) => s.status === 'pending')
        ? 'pending'
        : 'unknown';

    out.push({
      recordId: rec.id,
      date: rec.date,
      reasonCategory: rec.reasonCategory,
      isSafeguarding,
      summary: rec.summary,
      toolCount: rec.tools.length,
      alertPriority: isSafeguarding ? 1 : 2,
      overallStatus,
      surfaces: surfaceResults,
    });
  }
  return out;
}

/** Flatten pending propagation into concrete downstream tasks. */
export function propagationTasks(props: WithdrawalPropagation[]): PropagationTask[] {
  const tasks: PropagationTask[] = [];
  for (const p of props) {
    for (const sp of p.surfaces) {
      for (const pt of sp.pendingTools) {
        tasks.push({
          recordId: p.recordId,
          surface: sp.surface,
          slug: pt.slug,
          toolName: pt.toolName,
          action: 'withhold-score',
          reason: `${p.reasonCategory} withdrawal ${p.date}`,
        });
      }
    }
  }
  return tasks;
}

/** Fail-safe logging — loudly reports every propagation gap (pending / unknown). */
export function logWithdrawalPropagation(props: WithdrawalPropagation[]): void {
  for (const p of props) {
    if (p.overallStatus === 'propagated') continue;
    for (const sp of p.surfaces) {
      if (sp.status === 'pending') {
        // eslint-disable-next-line no-console
        console.warn(
          `[withdrawal-propagation] P${p.alertPriority} GAP · ${sp.surface} · ${sp.pendingTools.length}/${sp.totalTools} still scored · ${sp.pendingTools.map((t) => t.toolName).join(', ')}`,
        );
      } else if (sp.status === 'unknown') {
        // eslint-disable-next-line no-console
        console.warn(
          `[withdrawal-propagation] P${p.alertPriority} UNKNOWN · ${sp.surface} · snapshot unavailable — cannot confirm propagation (fail-safe: treated as not done)`,
        );
      }
    }
  }
}
