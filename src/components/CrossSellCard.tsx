/**
 * CrossSellCard — Inline contextual recommendation card.
 *
 * Shows a relevant next-step suggestion based on what the user is currently viewing.
 * Appears inline within the page content — never as a popup.
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { track } from '../utils/analytics';
import type { CrossSellItem } from '../utils/crossSell';

const TEAL = '#BEFF00';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  prompts: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="14" height="16" rx="2" stroke={TEAL} strokeWidth="1.5"/>
      <path d="M7 6h6M7 9h6M7 12h4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  training: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L2 6l8 4 8-4-8-4z" stroke={TEAL} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 10l8 4 8-4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 14l8 4 8-4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  equipment: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="14" height="10" rx="2" stroke={TEAL} strokeWidth="1.5"/>
      <path d="M7 17h6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 14v3" stroke={TEAL} strokeWidth="1.5"/>
    </svg>
  ),
  tools: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke={TEAL} strokeWidth="1.5"/>
      <path d="M10 7v3l2 1" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

interface CrossSellCardProps {
  item: CrossSellItem;
  /** Where the cross-sell appeared (for analytics) */
  sourceSection: string;
  /** Compact mode for sidebar placement */
  compact?: boolean;
}

export default function CrossSellCard({ item, sourceSection, compact }: CrossSellCardProps) {
  const tracked = useRef(false);

  // Track impression on mount
  useEffect(() => {
    if (!tracked.current) {
      track({ name: 'crosssell_impression', sourceSection, targetSection: item.section, itemId: item.id } );
      tracked.current = true;
    }
  }, [sourceSection, item.section, item.id]);

  const handleClick = () => {
    track({ name: 'crosssell_click', sourceSection, targetSection: item.section, itemId: item.id } );
  };

  if (compact) {
    return (
      <Link
        to={item.href}
        onClick={handleClick}
        className="block rounded-xl border p-3 transition-all hover:border-[#BEFF00] hover:shadow-sm group"
        style={{ borderColor: '#ECE7DD', background: 'white' }}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#e0f5f6' }}>
            {SECTION_ICONS[item.section]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight mb-0.5 group-hover:text-[#BEFF00] transition-colors" style={{ color: 'var(--text)' }}>
              {item.title}
            </p>
            {item.badge && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
                {item.badge}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={item.href}
        onClick={handleClick}
        className="block rounded-2xl border p-5 transition-all hover:border-[#BEFF00] hover:shadow-md group"
        style={{ borderColor: '#ECE7DD', background: 'white' }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#e0f5f6' }}>
            {SECTION_ICONS[item.section]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold group-hover:text-[#BEFF00] transition-colors" style={{ color: 'var(--text)' }}>
                {item.title}
              </h3>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: '#e0f5f6', color: TEAL }}>
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: '#4A4A4A' }}>
              {item.description}
            </p>
            <span className="text-xs font-semibold" style={{ color: TEAL }}>
              {item.cta}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
