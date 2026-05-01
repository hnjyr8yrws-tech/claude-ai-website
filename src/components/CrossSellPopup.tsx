/**
 * CrossSellPopup — Contextual popup (desktop) / bottom sheet (mobile).
 *
 * Shown only for high-intent actions (Try Demo click, 2+ pack views, etc.).
 * Limited to once per session. Easily dismissible.
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '../utils/analytics';
import { markPopupShown, type CrossSellItem } from '../utils/crossSell';

const TEAL = '#00808a';

interface CrossSellPopupProps {
  items: CrossSellItem[];
  /** What triggered the popup (for analytics) */
  trigger: string;
  /** Source section */
  sourceSection: string;
  /** Close handler */
  onClose: () => void;
}

export default function CrossSellPopup({ items, trigger, sourceSection, onClose }: CrossSellPopupProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      markPopupShown();
      track({ name: 'crosssell_popup_impression', sourceSection, trigger, count: items.length } );
      tracked.current = true;
    }
  }, [sourceSection, trigger, items.length]);

  // Escape key dismisses
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismiss() {
    track({ name: 'crosssell_popup_dismissed', sourceSection, trigger } );
    onClose();
  }

  function handleItemClick(item: CrossSellItem) {
    track({ name: 'crosssell_popup_click', sourceSection, targetSection: item.section, itemId: item.id } );
    onClose();
  }

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9995]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(17,18,16,0.4)' }}
          onClick={handleDismiss}
        />

        {/* Desktop: centered card / Mobile: bottom sheet */}
        <motion.div
          className="
            absolute
            bottom-0 left-0 right-0
            sm:bottom-auto sm:top-1/2 sm:left-1/2
            sm:-translate-x-1/2 sm:-translate-y-1/2
            w-full sm:max-w-md
            rounded-t-2xl sm:rounded-2xl
            shadow-2xl overflow-hidden
          "
          style={{ background: 'white', border: '1px solid #e8e6e0' }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: '#e8e6e0' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
                Recommended for you
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>
                Based on what you're exploring
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[#f3f4f6]"
              aria-label="Dismiss"
            >
              <span className="text-lg leading-none" style={{ color: '#9ca3af' }}>✕</span>
            </button>
          </div>

          {/* Items */}
          <div className="px-5 pb-5 space-y-2">
            {items.map(item => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => handleItemClick(item)}
                className="flex items-start gap-3 p-3 rounded-xl border transition-all hover:border-[#00808a] hover:shadow-sm group"
                style={{ borderColor: '#e8e6e0' }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e0f5f6' }}>
                  <SectionIcon section={item.section} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold group-hover:text-[#00808a] transition-colors" style={{ color: 'var(--text)' }}>
                      {item.title}
                    </p>
                    {item.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: '#e0f5f6', color: TEAL }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#6b6760' }}>
                    {item.description}
                  </p>
                  <span className="text-[11px] font-semibold mt-1 inline-block" style={{ color: TEAL }}>
                    {item.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t" style={{ borderColor: '#f3f4f6' }}>
            <button
              onClick={handleDismiss}
              className="w-full text-center text-xs transition-opacity hover:opacity-60"
              style={{ color: '#c5c2bb' }}
            >
              No thanks, keep browsing
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SectionIcon({ section }: { section: string }) {
  switch (section) {
    case 'prompts':
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="2" width="14" height="16" rx="2" stroke={TEAL} strokeWidth="1.5"/>
          <path d="M7 6h6M7 9h6M7 12h4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'training':
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2L2 6l8 4 8-4-8-4z" stroke={TEAL} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M2 10l8 4 8-4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'equipment':
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="14" height="10" rx="2" stroke={TEAL} strokeWidth="1.5"/>
          <path d="M7 17h6" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7" stroke={TEAL} strokeWidth="1.5"/>
          <path d="M10 7v3l2 1" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
  }
}
