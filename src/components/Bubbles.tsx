/**
 * Bubbles.tsx — decorative animated AI bubble layer.
 * Soft, blurred gradient circles that float behind hero / section content.
 * Pure CSS animations (.gp-bubble + keyframes in index.css).
 * Honoured by `prefers-reduced-motion: reduce` (animation paused in CSS).
 */

import { FC } from 'react';

export type BubbleVariant =
  | 'lime'
  | 'cyan'
  | 'purple'
  | 'yellow'
  | 'soft-lime'
  | 'soft-cyan'
  | 'soft-purple';

export type BubbleAnim = 'gp-float-a' | 'gp-float-b' | 'gp-float-c';

export type Bubble = {
  variant: BubbleVariant;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  anim: BubbleAnim;
};

export const BubbleLayer: FC<{ bubbles: Bubble[] }> = ({ bubbles }) => (
  <div className="gp-bubble-layer" aria-hidden="true">
    {bubbles.map((b, i) => (
      <span
        key={i}
        className={`gp-bubble gp-bubble--${b.variant} ${b.anim}`}
        style={{
          width: b.size,
          height: b.size,
          top: b.top,
          left: b.left,
          right: b.right,
          bottom: b.bottom,
        }}
      />
    ))}
  </div>
);

export default BubbleLayer;
