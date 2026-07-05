/**
 * RoleStrip — Layer 2 of the site nav.
 *
 * Sticky strip directly below the primary nav. Lets the visitor declare their
 * role once; the choice persists (session cookie) and broadcasts `role:changed`
 * so every filterable page can react. Brand: oat surface, rule border, Satoshi
 * chips; lime is reserved for the selected chip's text on the ground-black fill.
 *
 * Desktop (≥768px): "I'm a:" label + a row of role chips.
 * Mobile (<768px): collapses to a single "I'm a [Role] ▾" pill that opens a
 * bottom sheet of role options.
 */

import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLES, getRole, setRole, ROLE_CHANGED } from '../utils/role';

const LIME = 'var(--color-promptly-lime)';
const INK  = 'var(--color-ground-black)';

const RoleStrip: FC = () => {
  const [active, setActive] = useState<string>('');
  const [sheetOpen, setSheetOpen] = useState(false);

  // Hydrate from the cookie and keep in sync if the role changes elsewhere
  // (e.g. the homepage hero chips also call setRole()).
  useEffect(() => {
    setActive(getRole());
    const sync = (e: Event) => setActive((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, sync);
    return () => window.removeEventListener(ROLE_CHANGED, sync);
  }, []);

  // Escape closes the mobile sheet
  useEffect(() => {
    if (!sheetOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheetOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [sheetOpen]);

  const choose = (slug: string) => {
    const next = active === slug ? '' : slug; // tapping the active chip clears it
    setActive(next);
    setRole(next);
    setSheetOpen(false);
  };

  const activeRole = ROLES.find(r => r.slug === active);

  const chipStyle = (selected: boolean): React.CSSProperties =>
    selected
      ? { background: INK, color: LIME, borderColor: INK }
      : { background: 'white', color: INK, borderColor: 'var(--color-rule)' };

  return (
    <div
      className="sticky top-16 z-30"
      style={{ background: 'var(--color-oat)', borderBottom: '1px solid var(--color-rule)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-12 flex items-center gap-3">

        {/* ── Desktop: label + chip row ── */}
        <div className="hidden md:flex items-center gap-3 w-full">
          <span className="font-mono flex-shrink-0" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-fog)' }}>
            I&apos;M A:
          </span>
          <div className="flex items-center gap-2">
            {ROLES.map(r => {
              const selected = active === r.slug;
              return (
                <button
                  key={r.slug}
                  onClick={() => choose(r.slug)}
                  aria-pressed={selected}
                  className="font-sans rounded-full px-3.5 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={{ fontSize: 12, fontWeight: 500, ...chipStyle(selected) }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: collapsed pill ── */}
        <div className="flex md:hidden items-center gap-2 w-full">
          <span className="font-mono flex-shrink-0" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-fog)' }}>
            I&apos;M A:
          </span>
          <button
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className="font-sans inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
            style={{ fontSize: 12, fontWeight: 500, ...chipStyle(!!activeRole) }}
          >
            {activeRole ? activeRole.label : 'Choose role'}
            <span aria-hidden="true">▾</span>
          </button>
        </div>
      </div>

      {/* ── Mobile bottom sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-[60] md:hidden"
              style={{ background: 'rgba(30,30,30,0.45)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Choose your role"
              className="fixed bottom-0 inset-x-0 z-[61] md:hidden rounded-t-2xl p-5 pb-8"
              style={{ background: 'var(--color-oat)', borderTop: '1px solid var(--color-rule)' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            >
              <div className="mx-auto w-10 h-1 rounded-full mb-4" style={{ background: 'var(--color-rule)' }} aria-hidden="true" />
              <p className="font-mono mb-4" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-fog)' }}>
                I&apos;M A:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {ROLES.map(r => {
                  const selected = active === r.slug;
                  return (
                    <button
                      key={r.slug}
                      onClick={() => choose(r.slug)}
                      aria-pressed={selected}
                      className="font-sans rounded-xl px-4 py-3 border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                      style={{ fontSize: 14, fontWeight: 500, ...chipStyle(selected) }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleStrip;
