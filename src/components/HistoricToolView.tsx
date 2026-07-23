/**
 * HistoricToolView — RL-017 retired-record page.
 *
 * Renders a retired tool's `/tools/:slug` page per the approved Historic contract:
 *   • a visible "Retired" badge (never "Pending review" / "Score not yet published");
 *   • NO Promptly Score, pillar score or tier, and no number of any kind;
 *   • NO "Visit tool" action and no dead external tool URL;
 *   • the retirement description shown prominently;
 *   • an optional, explicitly-labelled reference link ("Retirement information" / "Related information");
 *   • historical review + provenance remain visible (methodology link retained);
 *   • not presented as a current recommendation.
 *
 * Pure, prop-driven and self-contained (no scoring imports) so it can never leak a score.
 */

import { Link } from 'react-router-dom';
import SEO from './SEO';
import SectionLabel from './SectionLabel';
import { formatDateGB } from '@/components/trust/utils';
import type { HistoricRecord } from '@/data/historic';

const TEAL = 'var(--color-promptly-lime)';

export interface HistoricToolViewProps {
  slug: string;
  record: HistoricRecord;
}

export function HistoricToolView({ slug, record }: HistoricToolViewProps) {
  const referenceLabel = record.referenceLabel ?? 'Related information';

  return (
    <>
      <SEO
        title={`${record.name} — Retired | GetPromptly`}
        description={`${record.name} has been retired. ${record.description}`}
        keywords={`${record.name}, retired AI tool, GetPromptly historic record`}
        path={`/tools/${slug}`}
      />

      {/* Breadcrumb — direct historic-record access is preserved. */}
      <nav aria-label="Breadcrumb" className="px-5 sm:px-8 pt-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <ol className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: '#9ca3af' }}>
            <li><Link to="/tools" className="hover:text-[var(--color-promptly-lime)] transition-colors">Tools</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium truncate max-w-[220px]" style={{ color: 'var(--text)' }}>{record.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero — Retired badge + name + prominent retirement description. */}
      <section className="px-5 sm:px-8 pt-6 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: 'var(--color-ink)', color: 'var(--color-oat)' }}
            >
              Retired
            </span>
            {record.retiredDate && (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-oat)', color: 'var(--color-ink-muted)' }}>
                Retired {formatDateGB(record.retiredDate)}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
            {record.name}
          </h1>

          {/* Retirement description — prominent. */}
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text)' }}>
            {record.description}
          </p>

          {/* Optional, explicitly-labelled reference link. Never "Visit tool". */}
          {record.referenceUrl ? (
            <a
              href={record.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2"
              style={{ color: 'var(--color-ink-accent)' }}
            >
              {referenceLabel} →
            </a>
          ) : null}
        </div>
      </section>

      {/* Record status — no score, no pillars, no tier; provenance stays visible. */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: 'var(--color-rule)' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Historic record</SectionLabel>
          <div
            role="status"
            className="rounded-xl border p-5 mt-2"
            style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>
              This tool has been retired. Its Promptly Score and pillar breakdown are no longer
              published. This page is retained for reference and is not a current recommendation.
            </p>
          </div>

          {/* Historical review + provenance remain visible. */}
          <p className="mt-4 text-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Reviewed against KCSIE 2025 under our{' '}
            <Link
              to="/methodology"
              className="font-semibold underline underline-offset-2"
              style={{ color: 'var(--color-ink-accent)' }}
            >
              published methodology
            </Link>
            .
          </p>

          <Link
            to="/tools"
            className="inline-block mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-2"
            style={{ background: TEAL, color: 'var(--color-ink)' }}
          >
            Browse current tools
          </Link>
        </div>
      </section>
    </>
  );
}

export default HistoricToolView;
