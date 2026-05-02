import { FC, useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { to: '/schools',      label: 'For Schools' },
  { to: '/tools',        label: 'AI Tools' },
  { to: '/ai-training',  label: 'Training' },
  { to: '/ai-equipment', label: 'Equipment' },
  { to: '/prompts',      label: 'Prompts' },
  { to: '/parents',      label: 'Parents' },
  { to: '/students',     label: 'Students' },
];

const DARK = '#0F1C1A';
const LIME = '#BEFF00';
const CREAM = '#F8F5F0';

const Navbar: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Escape key closes mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-40 w-full transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(248,245,240,0.86)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(15,28,26,0.08)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
            aria-label="GetPromptly – go to homepage"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: DARK,
                boxShadow: `0 0 0 1px rgba(190,255,0,0.35), 0 8px 16px rgba(15,28,26,0.18)`,
              }}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke={LIME} strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display text-lg leading-none" style={{ color: DARK }}>
              GetPromptly
            </span>
          </Link>

          {/* Desktop nav (lg+ only — 7 links + CTA need the room) */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-[#1A1A1A] hover:bg-black/[0.04]'
                  }`
                }
                style={({ isActive }) => isActive
                  ? {
                      background: DARK,
                      boxShadow: `0 0 0 1px rgba(190,255,0,0.25), 0 8px 20px rgba(15,28,26,0.18)`,
                    }
                  : {}
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              aria-label="Open Promptly AI chat"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
              style={{
                background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
                color: DARK,
                border: '1px solid rgba(15,28,26,0.16)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0">
                <path
                  d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                  fill={DARK}
                />
              </svg>
              Ask Promptly AI
            </button>

            {/* Hamburger — min 44×44px touch target */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl transition-colors hover:bg-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              style={{ color: DARK }}
            >
              <svg
                width="20" height="20" viewBox="0 0 18 18"
                fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen
                  ? <><path d="M2 2l14 14M16 2L2 16"/></>
                  : <><path d="M2 4.5h14M2 9h14M2 13.5h14"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: 'rgba(15,28,26,0.45)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              className="fixed top-16 inset-x-0 z-40 lg:hidden border-b"
              style={{
                background: CREAM,
                borderColor: 'rgba(15,28,26,0.08)',
                boxShadow: '0 24px 48px rgba(15,28,26,0.12)',
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1.5">
                {LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] flex items-center ${
                        isActive
                          ? 'text-white'
                          : 'text-[#1A1A1A] hover:bg-black/[0.04]'
                      }`
                    }
                    style={({ isActive }) => isActive
                      ? { background: DARK, boxShadow: `0 0 0 1px rgba(190,255,0,0.25)` }
                      : {}
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('open-agent-chat'));
                  }}
                  className="mt-3 px-4 py-3 min-h-[48px] rounded-xl text-sm font-bold flex items-center gap-2"
                  style={{
                    background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
                    color: DARK,
                    border: '1px solid rgba(15,28,26,0.16)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0">
                    <path
                      d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                      fill={DARK}
                    />
                  </svg>
                  Ask Promptly AI
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
