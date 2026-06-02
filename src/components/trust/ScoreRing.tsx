// Generic Promptly Score ring — the same visual as the AI Pillar Card, driven by
// an arbitrary set of five scored segments. Used for equipment (its own five
// dimensions) so the whole platform shares one score-ring treatment.
//
// The centre composite is ALWAYS the weighted average of the segments (single
// source of truth) — it can never disagree with the arcs. Solid colours only
// (full where scored, muted same-colour where not): no transparency, no black gaps.

export interface RingSegment {
  name: string; // full label (never abbreviated)
  hex: string; // brand colour for this segment
  score: number; // 0–10
}

interface Props {
  segments: RingSegment[]; // exactly five, clockwise from 12 o'clock
  weights?: number[]; // per-segment weights (default equal); must sum to 1
  size?: number;
  caption?: string; // centre caption under the number
  provisional?: boolean; // show "—" and a stippled ring
}

const VB = 240;
const CX = VB / 2;
const CY = VB / 2;
const R_OUTER = 110;
const R_INNER = 82;
const R_BG = 118;
const R_CENTRE = 78;

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function wedgePath(rOuter: number, rInner: number, startDeg: number, endDeg: number): string {
  const oS = polar(rOuter, startDeg);
  const oE = polar(rOuter, endDeg);
  const iE = polar(rInner, endDeg);
  const iS = polar(rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${oS.x} ${oS.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${oE.x} ${oE.y}`,
    `L ${iE.x} ${iE.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${iS.x} ${iS.y}`,
    'Z',
  ].join(' ');
}

/** Solid muted tint of a hex (blend toward warm grey) — never transparent. */
function mutedHex(hex: string, t = 0.55): string {
  const G = [0x6f, 0x6f, 0x68];
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number, d: number) => Math.round(c * t + d * (1 - t));
  const h2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h2(mix(r, G[0]))}${h2(mix(g, G[1]))}${h2(mix(b, G[2]))}`;
}

const cssVar = (n: string) => `var(${n})`;

export default function ScoreRing({ segments, weights, size = 240, caption = 'PROMPTLY SCORE', provisional = false }: Props) {
  const n = segments.length;
  const SEG = 360 / n;
  const w = weights ?? segments.map(() => 1 / n);
  const composite = provisional
    ? null
    : Math.round(segments.reduce((s, seg, i) => s + Math.max(0, Math.min(10, seg.score)) * w[i], 0) * 10) / 10;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      role="img"
      aria-label={
        provisional
          ? 'Promptly Score provisional, review in progress.'
          : `Promptly Score ${composite!.toFixed(1)} out of 10. ${segments.map((s) => `${s.name} ${s.score}`).join(', ')}, each out of 10.`
      }
    >
      <circle cx={CX} cy={CY} r={R_BG} fill={cssVar('--color-ground-black')} />

      {/* Solid muted base ring — five zones tiling 360°, slight overlap, no gaps */}
      <g>
        {segments.map((s, i) => (
          <path
            key={`track-${i}`}
            d={wedgePath(R_OUTER, R_INNER, i * SEG, (i + 1) * SEG + 0.75)}
            fill={mutedHex(s.hex)}
          />
        ))}
      </g>

      {/* Full-strength score overlay — (score/10) × segment, from each zone start */}
      {!provisional &&
        segments.map((s, i) => {
          const sc = Math.max(0, Math.min(10, s.score));
          if (sc <= 0) return null;
          const start = i * SEG;
          return <path key={`fill-${i}`} d={wedgePath(R_OUTER, R_INNER, start, start + (sc / 10) * SEG)} fill={s.hex} />;
        })}

      {provisional && (
        <g fill="none" strokeDasharray="2 3" strokeWidth={1.5}>
          {segments.map((s, i) => (
            <path key={`prov-${i}`} d={wedgePath(R_OUTER, R_INNER, i * SEG, (i + 1) * SEG)} stroke={s.hex} opacity={0.6} />
          ))}
        </g>
      )}

      {/* 12 o'clock orientation tick — first segment's full name */}
      <text className="font-mono" x={CX} y={9} textAnchor="middle" fontSize={7} letterSpacing={1.2} fill={cssVar('--color-fog')}>
        {segments[0].name.toUpperCase()} ▾
      </text>

      <circle cx={CX} cy={CY} r={R_CENTRE} fill={cssVar('--color-ground-black')} stroke={cssVar('--color-promptly-lime')} strokeWidth={1.5} />
      <text className="font-sans" x={CX} y={CY + 8} textAnchor="middle" fontWeight={700} fontSize={58} letterSpacing={-2} fill={cssVar('--color-oat')}>
        {composite == null ? '—' : composite.toFixed(1)}
      </text>
      <text className="font-mono" x={CX} y={CY + 36} textAnchor="middle" fontSize={9} letterSpacing={2} fill={cssVar('--color-fog')}>
        {caption}
      </text>
    </svg>
  );
}
