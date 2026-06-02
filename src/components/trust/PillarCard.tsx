// GetPromptly — The Pillar Card (Brand Bible §04, "The Signature")
//
// A self-contained dark artefact: the 5-pillar trust ring + composite Promptly
// Score + legend + methodology mark. The brand rule is "never show a score
// naked" — wherever a Promptly Score appears, the Pillar Card (or a Score Pill
// that links to one) must carry it.
//
// Colour comes from the CSS variables in src/index.css (--color-* ); fonts come
// from the Tailwind families (font-serif/sans/mono). No hardcoded hex, no
// hardcoded font names.
//
// CRITICAL: the ring geometry is COMPUTED with a polar(r, deg) trig helper so
// every endpoint sits exactly on its radius. Arc coordinates are never
// hardcoded — hardcoding makes the ring render oval.

import { Link } from 'react-router-dom';

// ----- Pillar model (fixed order, top-clockwise, never reordered) -----

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
  cssVar: string; // CSS custom property in src/index.css
  hex: string; // brand hex — used to compute a SOLID muted tint for the ring track
}

// Top (12 o'clock) → clockwise: Data Privacy → Safeguarding → Age Suitability → Transparency → Accessibility.
// hex values are the Brand Bible §09 pillar colours (kept in sync with src/index.css).
const PILLARS: Pillar[] = [
  { key: 'dataPrivacy', name: 'Data Privacy', cssVar: '--color-pillar-privacy', hex: '#6A8CAF' },
  { key: 'safeguarding', name: 'Safeguarding', cssVar: '--color-pillar-safeguarding', hex: '#C8E44A' },
  { key: 'ageSuitability', name: 'Age Suitability', cssVar: '--color-pillar-age', hex: '#8C7A52' },
  { key: 'transparency', name: 'Transparency', cssVar: '--color-pillar-transparency', hex: '#4A4F5C' },
  { key: 'accessibility', name: 'Accessibility', cssVar: '--color-pillar-accessibility', hex: '#D97757' },
];

// Blend a hex toward a warm mid-grey to get a SOLID muted tint of the same hue.
// Solid (never transparent) so the ring can never show black through it — even the
// dark pillars (Transparency, Age) stay clearly visible, never collapsing to black.
function mutedHex(hex: string, t = 0.55): string {
  const G = [0x6f, 0x6f, 0x68]; // warm grey to mute toward
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number, d: number) => Math.round(c * t + d * (1 - t));
  const h2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h2(mix(r, G[0]))}${h2(mix(g, G[1]))}${h2(mix(b, G[2]))}`;
}

const SEGMENTS = PILLARS.length; // 5
const SEGMENT_DEG = 360 / SEGMENTS; // 72°

// Geometry constants, in viewBox units. A fixed 240×240 viewBox keeps these
// stable while the rendered px size scales via width/height.
const VB = 240;
const CX = VB / 2;
const CY = VB / 2;
const R_OUTER = 110;
const R_INNER = 82; // widened band → more radial range so score differences read clearly
const R_BG = 118; // background disc
const R_CENTRE = 78; // centre disc (carries the composite score)

// ----- Trig helpers: every endpoint computed, never hardcoded -----

interface Point {
  x: number;
  y: number;
}

/** Polar → cartesian, with 0° at 12 o'clock and degrees increasing clockwise. */
function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** A donut wedge path between two radii and two angles (drawn clockwise). */
function wedgePath(
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
): string {
  const oStart = polar(CX, CY, rOuter, startDeg);
  const oEnd = polar(CX, CY, rOuter, endDeg);
  const iEnd = polar(CX, CY, rInner, endDeg);
  const iStart = polar(CX, CY, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`, // outer arc, clockwise
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`, // inner arc, back
    'Z',
  ].join(' ');
}

const cssVar = (name: string) => `var(${name})`;

// ----- Helpers to build PillarScores from the app's data shapes -----

/**
 * Map the array returned by derivePillars() in src/data/tools.ts — whose order
 * is [Data Privacy, Age Appropriateness, Transparency, Safeguarding, Accessibility]
 * — into the §04 PillarScores shape. Keeps the data model and the brand model
 * decoupled.
 */
export function pillarScoresFromData(arr: number[]): PillarScores {
  return {
    dataPrivacy: arr[0],
    ageSuitability: arr[1],
    transparency: arr[2],
    safeguarding: arr[3],
    accessibility: arr[4],
  };
}

/** Build PillarScores from values already in §04 order (Privacy, Safeguarding, Age, Transparency, Accessibility). */
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
  methodologyVersion = '2.1',
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
    mark = 'WITHDRAWN — SEE NOTES';
  } else if (isProvisional) {
    mark = `METHODOLOGY v${methodologyVersion} · PROVISIONAL`;
  } else {
    const parts = [`METHODOLOGY v${methodologyVersion}`];
    if (verifiedDate) parts.push(`VERIFIED ${verifiedDate}`);
    if (reviewer) parts.push(`REVIEWER ${reviewer}`);
    if (isHistoric) parts.push('ARCHIVED');
    mark = parts.join(' · ');
  }

  // SINGLE SOURCE OF TRUTH for the centre number: when pillars are present the
  // composite is ALWAYS their weighted average (same methodology weights as
  // data/tools.ts promptlyScore), so the centre can never disagree with the arcs.
  // The `score` prop is only a fallback when no pillars are supplied.
  const composite =
    pillars
      ? Math.round(
          (pillars.dataPrivacy * 0.25 +
            pillars.safeguarding * 0.2 +
            pillars.ageSuitability * 0.2 +
            pillars.transparency * 0.2 +
            pillars.accessibility * 0.15) *
            10,
        ) / 10
      : score ?? null;

  const centreLabel = isProvisional || composite == null ? '—' : composite.toFixed(1);

  // Full-strength score colour and its SOLID muted track tint (greyscale when
  // withdrawn). Both are solid colours — the ring never uses transparency, so no
  // part of the circle can ever read as a black gap.
  const scoreColour = (p: Pillar) => (isWithdrawn ? '#9C9C8A' : p.hex);
  const trackColour = (p: Pillar) => mutedHex(isWithdrawn ? '#9C9C8A' : p.hex);

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
        {/* Background disc */}
        <circle cx={CX} cy={CY} r={R_BG} fill={cssVar('--color-ground-black')} />

        {/* Base ring — five SOLID 72° zones, each a muted tint of its own pillar
            colour, tiling the whole 360°. Each zone is extended a hair past its
            boundary (overlap) so adjacent zones can never leave a sub-pixel seam.
            This base is ALWAYS a complete circle of the five pillar colours — there
            is no transparency and no neutral track, so nothing black can show. */}
        <g>
          {PILLARS.map((p, i) => (
            <path
              key={`track-${p.key}`}
              d={wedgePath(R_OUTER, R_INNER, i * SEGMENT_DEG, (i + 1) * SEGMENT_DEG + 0.75)}
              fill={trackColour(p)}
            />
          ))}
        </g>

        {/* Score overlay — each pillar's OWN score painted in FULL-strength pillar
            colour over the start of its zone: filledArc = (score / 10) × 72°
            (e.g. 8.5 → 61.2°, 9.6 → 69.12°). The remainder stays as the muted base
            of the SAME colour — the score reads as full-strength vs muted, never as
            empty space. Composite score does not drive these. */}
        {hasData && !isProvisional && (
          <g>
            {PILLARS.map((p, i) => {
              const sc = Math.max(0, Math.min(10, pillars![p.key]));
              if (sc <= 0) return null;
              const start = i * SEGMENT_DEG;
              const filledDeg = (sc / 10) * SEGMENT_DEG;
              return (
                <path
                  key={`fill-${p.key}`}
                  d={wedgePath(R_OUTER, R_INNER, start, start + filledDeg)}
                  fill={scoreColour(p)}
                />
              );
            })}
          </g>
        )}

        {/* Provisional: stippled outer ring instead of solid fills */}
        {isProvisional && (
          <g fill="none" strokeDasharray="2 3" strokeWidth={1.5}>
            {PILLARS.map((p, i) => (
              <path
                key={`prov-${p.key}`}
                d={wedgePath(R_OUTER, R_INNER, i * SEGMENT_DEG, (i + 1) * SEGMENT_DEG)}
                stroke={cssVar(p.cssVar)}
                opacity={0.6}
              />
            ))}
          </g>
        )}


        {/* 12 o'clock orientation tick (§04) */}
        <text
          className="font-mono"
          x={CX}
          y={9}
          textAnchor="middle"
          fontSize={7}
          letterSpacing={1.5}
          fill={cssVar('--color-fog')}
        >
          DATA PRIVACY ▾
        </text>

        {/* Centre disc with a thin lime ring */}
        <circle
          cx={CX}
          cy={CY}
          r={R_CENTRE}
          fill={cssVar('--color-ground-black')}
          stroke={cssVar('--color-promptly-lime')}
          strokeWidth={1.5}
        />

        {/* Composite Promptly Score (Satoshi / font-sans) */}
        <text
          className="font-sans"
          x={CX}
          y={CY + 8}
          textAnchor="middle"
          fontWeight={700}
          fontSize={58}
          fontStyle={isProvisional ? 'italic' : 'normal'}
          letterSpacing={-2}
          fill={cssVar('--color-oat')}
        >
          {centreLabel}
        </text>
        <text
          className="font-mono"
          x={CX}
          y={CY + 36}
          textAnchor="middle"
          fontSize={9}
          letterSpacing={2}
          fill={cssVar('--color-fog')}
        >
          PROMPTLY SCORE
        </text>

        {/* Withdrawn: redaction bar across the centre score */}
        {isWithdrawn && (
          <rect
            x={CX - 50}
            y={CY - 22}
            width={100}
            height={34}
            fill={cssVar('--color-ground-black')}
            stroke={cssVar('--color-promptly-lime')}
            strokeWidth={1}
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
            // minmax(0, 1fr) lets every column shrink to its true share, so no
            // column can push the legend past the card edge. px padding keeps the
            // outer columns (Privacy, Access) clear of the card border.
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
                  borderTop: `2px solid ${
                    isWithdrawn ? cssVar('--color-fog') : cssVar(p.cssVar)
                  }`,
                  paddingTop: 4,
                  color: cssVar('--color-oat'),
                }}
              >
                <span
                  className="block"
                  style={{
                    // Full canonical pillar name; wraps within its column so even
                    // the longest names stay legible and never abbreviated.
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
