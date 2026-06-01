/**
 * SafetyScore.tsx
 * Reusable circular safety score badge with trust tier label and hover tooltip.
 *
 * Usage:
 *   <SafetyScore score={8.5} />
 *   <SafetyScore score={7.2} size="lg" showTooltip={false} />
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIER_STYLE } from '../data/tools';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrustTier = 'Trusted' | 'Guided' | 'Emerging';

export interface SafetyScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  showTier?: boolean;
  /** Optional override label (e.g. tool name) shown inside the tooltip header */
  label?: string;
}

// ─── Score → tier ──────────────────────────────────────────────────────────────
// Threshold logic only — no value-by-colour. Quality is signalled by the Pillar
// Card / tier word, never by recolouring the digits (§04/§09). Tier chip colours
// come from the single source of truth in data/tools.ts (TIER_STYLE).

export function getTrustTier(score: number): TrustTier {
  if (score >= 8) return 'Trusted';
  if (score >= 6) return 'Guided';
  return 'Emerging';
}

// ─── Five scoring pillars ─────────────────────────────────────────────────────

// Brand Bible §spine — fixed order (Privacy → Safeguarding → Age → Transparency
// → Accessibility), with the canonical pillar names. Order is display-only here;
// no score mapping depends on it.
export const PILLARS = [
  { name: 'Data Privacy',     weight: 25, desc: 'UK GDPR posture, data residency, parental consent mechanisms' },
  { name: 'Safeguarding',     weight: 20, desc: 'KCSIE 2025 compatibility, DSL controls, reporting pathways' },
  { name: 'Age Suitability',  weight: 20, desc: 'Age gating enforcement, content moderation, minimum age policies' },
  { name: 'Transparency',     weight: 20, desc: 'Clear AI disclosure, hallucination warnings, explainability' },
  { name: 'Accessibility',    weight: 15, desc: 'WCAG 2.1 AA alignment, SEND adaptations, assistive tech support' },
];

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE = {
  sm: { r: 22, stroke: 4,   fontSize: '12px', wh: 52 },
  md: { r: 30, stroke: 5,   fontSize: '15px', wh: 70 },
  lg: { r: 40, stroke: 6.5, fontSize: '20px', wh: 94 },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SafetyScore({
  score,
  size = 'md',
  showTooltip = true,
  showTier = true,
  label,
}: SafetyScoreProps) {
  const [hovered, setHovered] = useState(false);

  const { r, stroke, fontSize, wh } = SIZE[size];
  const tier         = getTrustTier(score);
  const tierStyle    = TIER_STYLE[tier];
  const centre       = wh / 2;
  const circumference = 2 * Math.PI * r;
  const offset       = circumference * (1 - Math.min(score, 10) / 10);

  return (
    <div
      className="relative inline-flex flex-col items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={showTooltip ? 0 : undefined}
      role={showTooltip ? 'button' : undefined}
      aria-label={`Safety score ${score} out of 10 — ${tier}`}
    >
      {/* ── Circular ring ── */}
      <svg
        width={wh}
        height={wh}
        viewBox={`0 0 ${wh} ${wh}`}
        aria-hidden="true"
      >
        {/* Dark medallion — lime sits on dark, never on white (§09) */}
        <circle
          cx={centre} cy={centre} r={wh / 2}
          fill="var(--color-ground-black)"
        />
        {/* Background track (dim lime) */}
        <circle
          cx={centre} cy={centre} r={r}
          fill="none"
          stroke="rgba(200,228,74,0.18)"
          strokeWidth={stroke}
        />
        {/* Score arc — lime */}
        <motion.circle
          cx={centre} cy={centre} r={r}
          fill="none"
          stroke="var(--color-promptly-lime)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ transformOrigin: `${centre}px ${centre}px`, rotate: '-90deg' }}
        />
        {/* Score text — oat on dark (Satoshi / font-sans) */}
        <text
          className="font-sans"
          x={centre} y={centre}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="700"
          fill="var(--color-oat)"
        >
          {score.toFixed(1)}
        </text>
      </svg>

      {/* ── Trust tier badge ── */}
      {showTier && (
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: tierStyle.bg, color: tierStyle.text }}
        >
          {tier}
        </span>
      )}

      {/* ── Tooltip ── */}
      {showTooltip && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-64 rounded-xl shadow-xl overflow-hidden"
              style={{ background: '#111210', border: '1px solid #2a2825' }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b" style={{ borderColor: '#2a2825' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: 'white' }}>
                    {label ?? 'GetPromptly Safety Score'}
                  </p>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: tierStyle.bg, color: tierStyle.text }}
                  >
                    {score.toFixed(1)}/10
                  </span>
                </div>
                <p className="text-[10px] mt-0.5" style={{ color: '#6b6760' }}>
                  {tier} — assessed against KCSIE 2025
                </p>
              </div>

              {/* Pillars */}
              <div className="px-4 py-3 space-y-2.5">
                {PILLARS.map(p => (
                  <div key={p.name} className="flex items-start gap-2">
                    {/* Weight dot */}
                    <span
                      className="flex-shrink-0 text-[10px] font-bold mt-0.5 w-7 text-right tabular-nums"
                      style={{ color: 'var(--color-promptly-lime)' }}
                    >
                      {p.weight}%
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold leading-none" style={{ color: 'white' }}>
                        {p.name}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#6b6760' }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t" style={{ borderColor: '#2a2825' }}>
                <p className="text-[10px]" style={{ color: '#4b5563' }}>
                  100% independent · No vendor affiliation
                </p>
              </div>

              {/* Caret */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                style={{ background: '#111210', border: '1px solid #2a2825', borderTop: 'none', borderLeft: 'none' }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
