/**
 * ShineBorder — animated gradient border shimmer (shadcn pattern)
 * Wraps any element with a rotating conic-gradient shine ring.
 */
import React, { CSSProperties, FC, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  /** Border thickness in px */
  borderWidth?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Gradient colour stops */
  colors?: string[];
}

const ShineBorder: FC<ShineBorderProps> = ({
  children,
  className,
  borderWidth = 1,
  duration = 6,
  colors = ['#8b5cf6', '#38bdf8', '#bf5fff', '#8b5cf6'],
}) => (
  <div
    className={cn('relative rounded-2xl', className)}
    style={
      {
        '--shine-border-width': `${borderWidth}px`,
        '--shine-border-duration': `${duration}s`,
        '--shine-border-size': '300%',
        background: `linear-gradient(#0f0f1a, #0f0f1a) padding-box,
                     conic-gradient(from var(--shine-angle, 0deg), ${colors.join(', ')}) border-box`,
        border: `${borderWidth}px solid transparent`,
        animation: 'shine-rotate var(--shine-border-duration) linear infinite',
      } as CSSProperties
    }
  >
    {children}
  </div>
);

export default ShineBorder;
