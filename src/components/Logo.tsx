/**
 * Logo.tsx — the GetPromptly mark (Brand Bible §11).
 *
 * An 8-point starburst icon (a compass / radiating-prompt reference — eight
 * points, not a snowflake) + the "GetPromptly" wordmark in Satoshi Bold.
 *
 * Geometry is COMPUTED on an 8×8 unit grid (never hardcoded arcs), matching the
 * Pillar Card convention:
 *   - central core: circle, diameter 2 units (radius 1)
 *   - point length 3 units; cardinal points 100%, diagonal points 90%
 *   - each point is a kite/triangle with its base shoulders on the core ring
 *
 * Two versions (§11): 'light' for oat/light surfaces, 'dark' for #1E1E1E.
 * Misuse rules enforced by construction: no gradients/shadows/outlines, fixed
 * aspect ratio, never the wordmark without the icon.
 */

import { Link } from 'react-router-dom';

const C = 4;            // centre of the 8×8 grid
const CORE_R = 1;       // core radius (diameter 2)
const LEN_CARD = 3;     // cardinal point length (100%)
const LEN_DIAG = 3 * 0.9; // diagonal point length (90%)
const HALF_W = 0.62;    // base half-width (keeps a ~0.5u gap between adjacent points)

const DIRS = [0, 45, 90, 135, 180, 225, 270, 315];

/** Build the eight triangular points as SVG <polygon> point strings. */
function starburstPoints(): string[] {
  return DIRS.map(d => {
    const cardinal = d % 90 === 0;
    const len = CORE_R + (cardinal ? LEN_CARD : LEN_DIAG);
    const a = ((d - 90) * Math.PI) / 180;       // axis angle
    const ap = ((d + 90 - 90) * Math.PI) / 180; // perpendicular angle
    const tip = [C + len * Math.cos(a), C + len * Math.sin(a)];
    const bx = C + CORE_R * Math.cos(a);
    const by = C + CORE_R * Math.sin(a);
    const s1 = [bx + HALF_W * Math.cos(ap), by + HALF_W * Math.sin(ap)];
    const s2 = [bx - HALF_W * Math.cos(ap), by - HALF_W * Math.sin(ap)];
    return [tip, s1, s2].map(p => `${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ');
  });
}

const POINTS = starburstPoints();

/** The bare 8-point starburst glyph. `colour` paints the points + core. */
export function Starburst({ size = 18, colour = '#1E1E1E' }: { size?: number; colour?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <g fill={colour}>
        {POINTS.map((pts, i) => <polygon key={i} points={pts} />)}
        <circle cx={C} cy={C} r={CORE_R} />
      </g>
    </svg>
  );
}

export interface LogoProps {
  /** 'light' = lime tile on light bg; 'dark' = ink tile + lime starburst on dark. */
  variant?: 'light' | 'dark';
  /** Render the icon only (no wordmark) — for tight spaces ≥24px. */
  iconOnly?: boolean;
  /** Icon container size in px (default 32 per §11). */
  size?: number;
  className?: string;
}

/**
 * Full logo lockup (icon + wordmark, 8px gap), wrapped as a homepage link.
 * Use `variant="dark"` on #1E1E1E surfaces, `variant="light"` on oat/light.
 */
export default function Logo({ variant = 'light', iconOnly = false, size = 32, className }: LogoProps) {
  const isDark = variant === 'dark';

  const tileStyle: React.CSSProperties = isDark
    ? { background: '#1E1E1E', border: '1px solid #C8E44A' }
    : { background: '#C8E44A' };
  const starColour = isDark ? '#C8E44A' : '#1E1E1E';
  const wordColour = isDark ? '#FFFFFF' : '#1A1A14';

  return (
    <Link
      to="/"
      aria-label="GetPromptly — go to homepage"
      className={`inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]${className ? ` ${className}` : ''}`}
      style={{ gap: 8 }}
    >
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, borderRadius: 6, ...tileStyle }}
        aria-hidden="true"
      >
        <Starburst size={Math.round(size * 0.56)} colour={starColour} />
      </span>
      {!iconOnly && (
        <span
          className="font-sans leading-none"
          style={{ fontWeight: 700, fontSize: Math.round(size * 0.56), color: wordColour, letterSpacing: '-0.01em' }}
        >
          GetPromptly
        </span>
      )}
    </Link>
  );
}
