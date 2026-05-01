import { FC, useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { to: '/schools',      label: 'For Schools' },
  { to: '/tools',        label: 'AI Tools' },
  { to: '/ai-training',  label: 'Training' },
  { to: '/ai-equipment', label: 'Equipment' },
  { to: '/prompts',      label: 'Prompts' },
];

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
          background: scrolled ? 'rgba(247,246,242,0.97)' : 'var(--bg)',
          borderBottom: scrolled ? '1px solid #e8e6e0' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
            aria-label="GetPromptly – go to homepage"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#00808a' }}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display text-lg leading-none" style={{ color: 'var(--text)' }}>
              GetPromptly
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#00808a] bg-[#e0f5f6]'
                      : 'text-[#6b6760] hover:text-[#1c1a15] hover:bg-[#eeece7]'
                  }`
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2"
              style={{ background: '#00808a' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0">
                <path
                  d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                  fill="white"
                />
              </svg>
              Ask Promptly AI
            </button>

            {/* Hamburger — min 44×44px touch target */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[#eeece7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
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
                      `px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                        isActive ? 'text-[#00808a] bg-[#e0f5f6]' : 'text-[#6b6760] hover:bg-[#eeece7]'
                      }`
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
                  className="mt-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold text-white text-left flex items-center gap-2"
                  style={{ background: '#00808a' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0">
                    <path
                      d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                      fill="white"
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
