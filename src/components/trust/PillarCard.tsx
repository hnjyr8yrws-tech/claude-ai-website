// GetPromptly — The Pillar Card (Brand Bible §04, "The Signature")
//
// A self-contained dark artefact: the 5-pillar trust ring + composite Promptly
// Score + legend + methodology mark. The brand rule is "never show a score
// naked" — wherever a Promptly Score appears, the Pillar Card (or a Score Pill
// that links to one) must carry it.
//
// THE RING: a full circle of 5 segments, one per pillar. Each segment's ARC
// LENGTH reflects its score — arc = (score / 10) × 68° (72° per fifth, minus a
// 4° gap). A faint track shows the unfilled remainder, so an 8/10 reads clearly
// as ~80% filled and a 5/10 as half. Geometry is computed with trig — never
// hardcoded — so endpoints always sit on the radius.

import { Link } from 'react-router-dom';
import { pillarBand, PILLAR_BAND_LABEL } from '../../data/publicPillars';

// ----- Pillar model (Brand Bible spine order) -----

export interface PillarScores {
  dataPrivacy: number; // 0–10
  safeguarding: number; // 0–10
  ageSuitability: number; // 0–10
  transparency: number; // 0–10
  accessibility: number; // 0–10
}

export type PillarCardState =
  | 'active'
  | 'provisional'
  | 'updated'
  | 'withdrawn'
  | 'historic';

interface Pillar {
  key: keyof PillarScores;
  name: string; // canonical full pillar name (Brand Bible) — never abbreviated
  hex: string; // segment colour (tuned for legibility on the dark ring)
}

// Brand Bible spine — fixed clockwise order from 12 o'clock, never reordered:
// Data Privacy → Safeguarding → Age Suitability → Transparency → Accessibility.
// Age & Transparency use brighter tones than the §09 print hexes so they read on
// the dark ring (§09 permits this on dark); the §09 hexes themselves are used on
// light surfaces (see ToolDetail PILLAR_BAR_COLOURS).
const PILLARS: Pillar[] = [
  { key: 'dataPrivacy', name: 'Data Privacy', hex: '#6A8CAF' },
  { key: 'safeguarding', name: 'Safeguarding', hex: '#C8E44A' },
  { key: 'ageSuitability', name: 'Age Suitability', hex: '#C8B45A' },
  { key: 'transparency', name: 'Transparency', hex: '#6B7280' },
  { key: 'accessibility', name: 'Accessibility', hex: '#D97757' },
];

const SEGMENTS = PILLARS.length; // 5

// ----- Geometry (viewBox 240; scales to the rendered `size`) -----
// §04 Active reference: five EQUAL 72° wedges forming a 24px band (outer R=110,
// inner r=86) centred at (120,120). Score is encoded by OPACITY, never by arc
// length — a dim track (0.18) sits under a scored layer (fillOpacity = score/10).
// Wedge paths are FIXED (do not derive); order = Brand Bible spine.
const VB = 240;
const CX = 120;
const CY = 120;

interface Wedge { key: keyof PillarScores; colour: string; d: string }

// Palette = the §09 print hexes (Age Oat Deep, Transparency Slate).
const WEDGES: Wedge[] = [
  { key: 'dataPrivacy',    colour: '#6A8CAF', d: 'M120 10 A110 110 0 0 1 224.62 86.01 L201.79 93.43 A86 86 0 0 0 120 34 Z' },
  { key: 'safeguarding',   colour: '#C8E44A', d: 'M224.62 86.01 A110 110 0 0 1 184.66 208.99 L170.55 189.58 A86 86 0 0 0 201.79 93.43 Z' },
  { key: 'ageSuitability', colour: '#8C7A52', d: 'M184.66 208.99 A110 110 0 0 1 55.34 208.99 L69.45 189.58 A86 86 0 0 0 170.55 189.58 Z' },
  { key: 'transparency',   colour: '#4A4F5C', d: 'M55.34 208.99 A110 110 0 0 1 15.38 86.01 L38.21 93.43 A86 86 0 0 0 69.45 189.58 Z' },
  { key: 'accessibility',  colour: '#D97757', d: 'M15.38 86.01 A110 110 0 0 1 120 10 L120 34 A86 86 0 0 0 38.21 93.43 Z' },
];

// Wedge dividers — outer boundary → inner boundary, stroked in ground-black.
const DIVIDERS: [number, number, number, number][] = [
  [120, 10, 120, 34],
  [224.62, 86.01, 201.79, 93.43],
  [184.66, 208.99, 170.55, 189.58],
  [55.34, 208.99, 69.45, 189.58],
  [15.38, 86.01, 38.21, 93.43],
];

const cssVar = (name: string) => `var(${name})`;

// ----- Helpers to build PillarScores from the app's data shapes -----

/** Build PillarScores from named values. */
export function pillarScores(
  dataPrivacy: number,
  safeguarding: number,
  ageSuitability: number,
  transparency: number,
  accessibility: number,
): PillarScores {
  return { dataPrivacy, safeguarding, ageSuitability, transparency, accessibility };
}

// ----- Component -----

export interface PillarCardProps {
  /** Tool name shown above the ring (omit on pages that already show it). */
  toolName?: string;
  /** Composite Promptly Score, 0–10. Optional for provisional cards. */
  score?: number;
  /** Per-pillar scores, 0–10. Optional for provisional cards. */
  pillars?: PillarScores;
  /** One-line Plain Verdict (§14). */
  verdict?: string;
  state?: PillarCardState;
  /** Rendered ring size in px (default 240, the §04 reference). */
  size?: number;
  showName?: boolean;
  showVerdict?: boolean;
  showLegend?: boolean;
  /** Suppress the built-in methodology mark (e.g. when the host renders its own). */
  showMark?: boolean;
  /** Methodology mark fields (§16). Version is always shown. */
  methodologyVersion?: string;
  verifiedDate?: string;
  reviewer?: string;
  /** For the "updated" state — the score change to stamp. */
  change?: { from: number; to: number; date?: string };
  className?: string;
}

export function PillarCard({
  toolName,
  score,
  pillars,
  verdict,
  state = 'active',
  size = 240,
  showName = true,
  showVerdict = true,
  showLegend = true,
  showMark = true,
  methodologyVersion = '2.2',
  verifiedDate,
  reviewer,
  change,
  className,
}: PillarCardProps) {
  const isProvisional = state === 'provisional';
  const isWithdrawn = state === 'withdrawn';
  const isHistoric = state === 'historic';
  const hasData = !!pillars;

  // Methodology mark text (§16 long form when fully attributed).
  let mark: string;
  if (isWithdrawn) {
    mark = `METHODOLOGY v${methodologyVersion} · AWAITING RE-REVIEW`;
  } else if (isProvisional) {
    mark = `METHODOLOGY v${methodologyVersion} · PROVISIONAL`;
  } else {
    const parts = [`METHODOLOGY v${methodologyVersion}`];
    if (verifiedDate) parts.push(`VERIFIED ${verifiedDate}`);
    if (reviewer) parts.push(`REVIEWER ${reviewer}`);
    if (isHistoric) parts.push('ARCHIVED');
    mark = parts.join(' · ');
  }

  // Centre number: the published Promptly Score. We prefer the reviewer's
  // authoritative composite (`score`, the v2.2 figure from the reviewed dataset)
  // so the headline shows the reviewer's verdict — not a re-derivation. When no
  // explicit score is given we fall back to the weighted average of the pillars
  // (legacy callers / previews). The arcs always reflect the per-pillar marks.
  const composite =
    score ??
    (pillars
      ? Math.round(
          (pillars.dataPrivacy * 0.25 +
            pillars.safeguarding * 0.2 +
            pillars.ageSuitability * 0.2 +
            pillars.transparency * 0.2 +
            pillars.accessibility * 0.15) *
            10,
        ) / 10
      : null);

  const centreLabel = isProvisional || composite == null ? '—' : composite.toFixed(1);

  const wrapStyle: React.CSSProperties = {
    background: cssVar('--color-ground-black'),
    color: cssVar('--color-oat'),
    opacity: isHistoric ? 0.6 : 1,
    maxWidth: size + 48,
  };

  return (
    <div
      className={`inline-flex flex-col items-center gap-3.5 rounded-[10px] p-6 font-sans${
        className ? ` ${className}` : ''
      }`}
      style={wrapStyle}
    >
      {showName && toolName && (
        <div className="font-serif text-2xl leading-tight text-center">
          {toolName}
        </div>
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VB} ${VB}`}
        role="img"
        aria-label={
          isWithdrawn
            ? `${toolName ?? 'Tool'} — Promptly Score withdrawn. ${verdict ?? ''}`.trim()
            : isProvisional || composite == null
            ? `${toolName ?? 'Tool'} — Promptly Score provisional, review in progress. ${verdict ?? ''}`.trim()
            : `${toolName ?? 'Tool'} — Promptly Score ${composite.toFixed(1)} out of 10.${
                verdict ? ` Verdict: ${verdict}` : ''
              }${
                pillars
                  ? ` Pillars — Data Privacy ${pillars.dataPrivacy}, Safeguarding ${pillars.safeguarding}, Age Suitability ${pillars.ageSuitability}, Transparency ${pillars.transparency}, Accessibility ${pillars.accessibility}, each out of 10.`
                  : ''
              }`
        }
      >
        {/* Equal-thickness wedge band. Score is shown by OPACITY: a dim track
            (0.18) under a scored layer (fillOpacity = pillar score / 10). */}
        {hasData && !isProvisional ? (
          <>
            {/* (a) dim track — all five full-colour wedges */}
            <g>
              {WEDGES.map((w) => (
                <path key={`track-${w.key}`} d={w.d} fill={isWithdrawn ? '#9C9C8A' : w.colour} fillOpacity={0.18} />
              ))}
            </g>
            {/* (b) scored layer — each wedge's opacity = its score / 10 */}
            <g>
              {WEDGES.map((w) => (
                <path
                  key={`score-${w.key}`}
                  d={w.d}
                  fill={isWithdrawn ? '#9C9C8A' : w.colour}
                  fillOpacity={Math.max(0, Math.min(10, pillars![w.key])) / 10}
                />
              ))}
            </g>
            {/* wedge dividers */}
            <g stroke={cssVar('--color-ground-black')} strokeWidth={1.5}>
              {DIVIDERS.map((l, i) => (
                <line key={`div-${i}`} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />
              ))}
            </g>
          </>
        ) : (
          /* Provisional / no data — dim track only, no score encoded. */
          <g>
            {WEDGES.map((w) => (
              <path key={`track-${w.key}`} d={w.d} fill={w.colour} fillOpacity={0.18} />
            ))}
          </g>
        )}

        {/* Centre disc — ground-black with the thin lime ring (§04 signature) */}
        <circle
          cx={CX}
          cy={CY}
          r={78}
          fill={cssVar('--color-ground-black')}
          stroke={isWithdrawn ? '#9C9C8A' : cssVar('--color-promptly-lime')}
          strokeWidth={1.5}
        />

        {/* Composite score — Satoshi Bold */}
        <text
          className="font-sans"
          x={CX}
          y={128}
          textAnchor="middle"
          fontWeight={700}
          fontSize={58}
          fontStyle={isProvisional ? 'italic' : 'normal'}
          letterSpacing={-2}
          fill="#F5F2EC"
        >
          {centreLabel}
        </text>

        {/* Caption — JetBrains Mono */}
        <text
          className="font-mono"
          x={CX}
          y={156}
          textAnchor="middle"
          fontSize={9}
          letterSpacing={2}
          fill="#9C9C8A"
        >
          PROMPTLY SCORE
        </text>

        {/* Withdrawn: redaction bar across the centre score */}
        {isWithdrawn && (
          <rect
            x={CX - 52}
            y={100}
            width={104}
            height={34}
            fill={cssVar('--color-ground-black')}
            stroke={cssVar('--color-promptly-lime')}
            strokeWidth={1.5}
          />
        )}
      </svg>

      {showVerdict && verdict && (
        <div
          className="font-serif italic text-center leading-snug opacity-90"
          style={{ fontSize: 16, maxWidth: size }}
        >
          {verdict}
        </div>
      )}

      {showLegend && (
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${SEGMENTS}, minmax(0, 1fr))`,
            gap: 4,
            maxWidth: size,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {PILLARS.map((p) => {
            const sc = pillars?.[p.key];
            const display = isProvisional || sc == null ? '—' : sc.toFixed(1);
            return (
              <div
                key={`legend-${p.key}`}
                className="font-sans"
                style={{
                  minWidth: 0,
                  textAlign: 'center',
                  borderTop: `2px solid ${isWithdrawn ? cssVar('--color-fog') : p.hex}`,
                  paddingTop: 4,
                  color: cssVar('--color-oat'),
                }}
              >
                <span
                  className="block"
                  style={{
                    fontSize: 9,
                    lineHeight: 1.15,
                    letterSpacing: 0,
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  {p.name}
                </span>
                <span
                  className="font-sans block"
                  style={{
                    marginTop: 2,
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: 0,
                    textTransform: 'none',
                  }}
                >
                  {display}
                </span>
                {!isProvisional && !isWithdrawn && sc != null && (() => {
                  const band = pillarBand(sc);
                  // Exemplary is the norm here — suppress the word so lower bands stand out.
                  return band && band !== 'exemplary' ? (
                    // Per-pillar band — neutral Satoshi word, NOT a traffic-light
                    // colour (§09: quality is the arc/score, never recoloured digits).
                    // Satoshi, not mono — mono is reserved for methodology marks.
                    <span
                      className="font-sans block uppercase"
                      style={{
                        marginTop: 1,
                        fontSize: 7,
                        letterSpacing: 0.2,
                        lineHeight: 1.1,
                        overflowWrap: 'break-word',
                        color: cssVar('--color-fog'),
                      }}
                    >
                      {PILLAR_BAND_LABEL[band]}
                    </span>
                  ) : null;
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* Methodology mark (§16) */}
      {showMark && (
        <div
          className="font-mono uppercase text-center"
          style={{ fontSize: 10, letterSpacing: 1, color: cssVar('--color-fog') }}
        >
          {mark}
        </div>
      )}

      {/* Change-stamp for the "updated" state (§05/§12) */}
      {state === 'updated' && change && (
        <div
          className="inline-flex items-center gap-2 font-mono rounded"
          style={{
            fontSize: 11,
            padding: '5px 10px',
            background: cssVar('--color-ground-black'),
            border: `1px solid ${cssVar('--color-fog')}`,
            color: cssVar('--color-oat'),
          }}
        >
          {change.from.toFixed(1)}
          <span style={{ color: cssVar('--color-promptly-lime') }}>→</span>
          {change.to.toFixed(1)}
          <span style={{ color: cssVar('--color-promptly-lime') }}>
            {change.to >= change.from ? '↑' : '↓'}
          </span>
          {change.date && <span style={{ color: cssVar('--color-fog') }}>{change.date}</span>}
        </div>
      )}
    </div>
  );
}

// ----- The legacy Score Pill (§04) -----
// 28px lime-on-black. Allowed ONLY in dense lists, and must lead to the
// underlying Pillar Card. Pass `to` to make it a router link; otherwise the
// caller must ensure the surrounding row/card reveals the Pillar Card.

export interface ScorePillProps {
  score: number;
  to?: string;
  className?: string;
}

export function ScorePill({ score, to, className }: ScorePillProps) {
  const pill = (
    <span
      className={`inline-flex items-center justify-center font-sans font-bold rounded-full${
        className ? ` ${className}` : ''
      }`}
      style={{
        background: cssVar('--color-ground-black'),
        color: cssVar('--color-promptly-lime'),
        fontSize: 12.5,
        lineHeight: 1,
        padding: '5px 11px',
        letterSpacing: 0.2,
      }}
      aria-label={`Promptly Score ${score.toFixed(1)} of 10 — view Pillar Card`}
    >
      {score.toFixed(1)}
    </span>
  );

  return to ? (
    <Link to={to} className="no-underline">
      {pill}
    </Link>
  ) : (
    pill
  );
}
