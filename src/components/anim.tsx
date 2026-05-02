/**
 * anim.tsx — shared scroll-reveal + stagger primitives for the Promptly visual system.
 * Uses framer-motion `whileInView` so animations fire once on entry and never replay.
 * Respects `prefers-reduced-motion` automatically (framer-motion shortens transitions).
 */

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

export const FadeIn: FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}> = ({ children, delay = 0, className = '', y = 18 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

export const Stagger: FC<{
  children: ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-60px' }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
    }}
  >
    {children}
  </motion.div>
);

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] as const },
  },
};
