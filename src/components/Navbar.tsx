import { FC, useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { to: '/schools',      label: 'For Schools' },
  { to: '/tools',        label: 'Reviewed Tools' },
  { to: '/ai-training',  label: 'Learn AI' },
  { to: '/ai-equipment', label: 'AI Equipment' },
  { to: '/prompts',      label: 'Prompt Library' },
];

const Navbar: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Transparent over the dark hero (home, top of page); oat/blur once scrolled.
  // On every non-home route the bar is solid from the start.
  const onDarkHero = pathname === '/' && !scrolled;

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
          background: onDarkHero ? 'transparent' : 'rgba(245,242,236,0.97)',
          borderBottom: onDarkHero ? '1px solid transparent' : '1px solid var(--color-rule)',
          backdropFilter: onDarkHero ? 'none' : 'blur(12px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
            aria-label="GetPromptly – go to homepage"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-promptly-lime)' }}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display text-lg leading-none" style={{ color: onDarkHero ? '#FFFFFF' : 'var(--text)' }}>
              GetPromptly
            </span>
          </Link>

          {/* Desktop nav — Satoshi Medium 13px */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="font-sans px-4 py-2 rounded-lg transition-colors"
                style={({ isActive }) => ({
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive
                    ? 'var(--color-ink-accent)'
                    : onDarkHero ? 'rgba(255,255,255,0.85)' : '#6b6760',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              aria-label="Open Luna chat"
              className="font-sans hidden sm:flex items-center gap-2 px-5 py-2 min-h-[44px] rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2"
              style={{ background: 'var(--color-promptly-lime)', color: '#1A1A0E', fontSize: 13, fontWeight: 500 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0">
                <path
                  d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                  fill="#1A1A0E"
                />
              </svg>
              Ask Luna
            </button>

            {/* Hamburger — min 44×44px touch target */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[#eeece7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={{ color: onDarkHero && !menuOpen ? '#FFFFFF' : 'var(--text)' }}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <svg
                width="18" height="18" viewBox="0 0 18 18"
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
              className="fixed inset-0 z-30 bg-black/20 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              className="fixed top-16 inset-x-0 z-40 md:hidden border-b"
              style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1">
                {LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `font-sans px-4 py-3 rounded-xl transition-colors min-h-[44px] flex items-center ${
                        isActive ? 'bg-[var(--color-oat)]' : 'hover:bg-[#eeece7]'
                      }`
                    }
                    style={({ isActive }) => ({ fontSize: 13, fontWeight: 500, color: isActive ? 'var(--color-ink-accent)' : '#6b6760' })}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('open-agent-chat'));
                  }}
                  className="font-sans mt-2 px-4 py-3 min-h-[44px] rounded-full text-left flex items-center gap-2"
                  style={{ background: 'var(--color-promptly-lime)', color: '#1A1A0E', fontSize: 13, fontWeight: 500 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0">
                    <path
                      d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                      fill="#1A1A0E"
                    />
                  </svg>
                  Ask Luna
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
