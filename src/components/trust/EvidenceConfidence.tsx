import { Link } from 'react-router-dom';
import type { PillarEvidence } from './types';
import { REVIEW_DEPTH_LABEL } from './constants';

// The detail shown in a pillar's expand panel — reuses the PillarEvidence fields
// (the pillar key itself is already known to the caller, so it's omitted here).
export type PillarEvidenceDetail = Pick<
  PillarEvidence,
  'evidence' | 'citation' | 'confidence' | 'reviewDepth'
>;

export interface EvidenceConfidenceProps {
  /** Pillar display name. */
  label: string;
  /** Pillar score, 0–10. */
  score: number;
  /** Qualitative band word (supplied by the host to stay consistent). */
  bandLabel?: string;
  /** Full per-pillar detail when available; absent → graceful fallback. */
  evidence?: PillarEvidenceDetail;
  /** Where the fallback links for detailed evidence. */
  methodologyPath?: string;
}

/**
 * One pillar's evidence + confidence + review depth. Rendered inside the (dark)
 * Pillar Card, so it uses the oat/fog/lime palette. Degrades gracefully to a
 * "see methodology" link when no evidence data exists yet.
 */
export function EvidenceConfidence({
  label,
  score,
  bandLabel,
  evidence,
  methodologyPath = '/methodology',
}: EvidenceConfidenceProps) {
  const pct = (Math.max(0, Math.min(10, score)) / 10) * 100;

  return (
    <div className="w-full text-left">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-sans text-sm font-semibold" style={{ color: 'var(--color-oat)' }}>{label}</span>
        <span className="font-sans text-sm font-bold" style={{ color: 'var(--color-oat)' }}>
          {score.toFixed(1)}
          <span style={{ color: 'var(--color-fog)' }}>/10</span>
        </span>
      </div>

      {/* Visual band */}
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'rgba(245,242,236,0.15)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--color-promptly-lime)' }} />
      </div>
      {bandLabel && (
        <div className="mt-1 font-sans uppercase" style={{ fontSize: 10, letterSpacing: 0.4, color: 'var(--color-fog)' }}>
          {bandLabel}
        </div>
      )}

      {evidence ? (
        <div className="mt-2 space-y-1.5">
          <p className="font-sans text-xs leading-relaxed" style={{ color: 'var(--color-oat)', opacity: 0.9 }}>
            {evidence.evidence}
          </p>
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono uppercase"
            style={{ fontSize: 9, letterSpacing: 0.4, color: 'var(--color-fog)' }}
          >
            <span className="inline-flex items-center gap-1.5">
              {/* Confidence dots — decorative; the n/5 text carries the value (§20). */}
              <span aria-hidden="true" className="inline-flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        i <= evidence.confidence
                          ? 'var(--color-promptly-lime)'
                          : 'rgba(245, 242, 236, 0.25)',
                    }}
                  />
                ))}
              </span>
              <span>Confidence {evidence.confidence}/5</span>
            </span>
            <span>{REVIEW_DEPTH_LABEL[evidence.reviewDepth]}</span>
          </div>
          {evidence.citation && (
            <p className="font-sans text-xs" style={{ color: 'var(--color-fog)' }}>
              Source:{' '}
              {evidence.citation.href ? (
                <a
                  href={evidence.citation.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: 'var(--color-promptly-lime)' }}
                >
                  {evidence.citation.label}
                </a>
              ) : (
                <span style={{ color: 'var(--color-oat)' }}>{evidence.citation.label}</span>
              )}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-2 font-sans text-xs leading-relaxed" style={{ color: 'var(--color-fog)' }}>
          We publish the detailed per-pillar evidence, confidence and review depth in our{' '}
          <Link to={methodologyPath} className="underline underline-offset-2" style={{ color: 'var(--color-promptly-lime)' }}>
            methodology &amp; integrity record
          </Link>
          .
        </p>
      )}
    </div>
  );
}
