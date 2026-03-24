/**
 * App.tsx — GetPromptly.co.uk
 * AI for Education — Made Simple
 * Nav: Home · AI Tools · AI Assistant · Guides · About
 */

import { useState, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from './lib/utils';
import lightbulb from './assets/lightbulb.png';

// ── Section components ─────────────────────────────────────────────────────────
import Hero                   from './components/sections/Hero';
import AudienceSection        from './components/sections/AudienceSection';
import AIAssistantSection     from './components/sections/AIAssistantSection';
import TrustedToolsSection    from './components/sections/TrustedToolsSection';
import ToolsGrid              from './components/sections/ToolsGrid';
import ExploreCategoriesSection from './components/sections/ExploreCategoriesSection';
import GuidesSection          from './components/sections/GuidesSection';
import Blog                   from './components/sections/Blog';
import EquipmentReviews       from '@/components/sections/EquipmentReviews';
import FinalCTASection        from './components/sections/FinalCTASection';
import About                  from './components/sections/About';
import Footer                 from './components/sections/Footer';

// ── Types ──────────────────────────────────────────────────────────────────────

type SectionId =
  | 'hero' | 'audience' | 'assistant' | 'trusted'
  | 'tools' | 'categories' | 'guides' | 'blog' | 'cta' | 'about';

// ── Navigation items ───────────────────────────────────────────────────────────

const NAV_ITEMS: { id: SectionId; label: string; primary?: boolean }[] = [
  { id: 'hero',      label: 'Home' },
  { id: 'tools',     label: 'AI Tools' },
  { id: 'assistant', label: 'AI Assistant', primary: true },
  { id: 'guides',    label: 'Guides' },
  { id: 'about',     label: 'About' },
];

// ── Drawer variants ────────────────────────────────────────────────────────────

const drawerVariants: Variants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
};

const navItemVariants: Variants = {
  hidden:  { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26, delay: i * 0.04 },
  }),
};

// ── Logo ───────────────────────────────────────────────────────────────────────

const Logo: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-lg"
    aria-label="GetPromptly home"
  >
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
         style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
      <img src={lightbulb} alt="" aria-hidden="true"
           className="w-5 h-5"
           style={{ filter: 'brightness(0) invert(1)' }} />
    </div>
    <div>
      <span className="font-black text-gray-900 tracking-tight text-base leading-none block">GetPromptly</span>
      <span className="text-[9px] text-gray-400 tracking-wide">getpromptly.co.uk</span>
    </div>
  </button>
);

// ── Mobile Drawer ──────────────────────────────────────────────────────────────

const MobileDrawer: FC<{
  active: SectionId;
  onNav: (id: SectionId) => void;
  onClose: () => void;
}> = ({ active, onNav, onClose }) => (
  <motion.div
    variants={drawerVariants}
    initial="hidden" animate="visible" exit="exit"
    className="flex flex-col w-72 h-full bg-white border-r border-gray-100 shadow-2xl"
    aria-label="Mobile navigation"
    role="dialog"
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <Logo onClick={() => { onNav('hero'); onClose(); }} />
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        className="ml-auto p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
        aria-label="Close menu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13"/>
        </svg>
      </motion.button>
    </div>

    <nav aria-label="Mobile navigation" className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item, i) => (
        <motion.button
          key={item.id}
          custom={i}
          variants={navItemVariants}
          initial="hidden" animate="visible"
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => { onNav(item.id); onClose(); }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]',
            active === item.id
              ? 'bg-blue-50 text-[#2563eb] border border-blue-100'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
          )}
        >
          {active === item.id && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[#2563eb]"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          {item.label}
          {item.primary && (
            <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-[#2563eb]">
              NEW
            </span>
          )}
        </motion.button>
      ))}
    </nav>

    <div className="border-t border-gray-100 px-5 py-4">
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => { onNav('tools'); onClose(); }}
        className="w-full py-3 rounded-xl text-white font-bold text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
      >
        Explore Trusted AI Tools →
      </motion.button>
    </div>
  </motion.div>
);

// ── Top Navigation ─────────────────────────────────────────────────────────────

const TopNav: FC<{
  active: SectionId;
  onNav: (id: SectionId) => void;
  onHamburger: () => void;
  drawerOpen: boolean;
  scrolled: boolean;
}> = ({ active, onNav, onHamburger, drawerOpen, scrolled }) => (
  <motion.header
    className={cn(
      'sticky top-0 z-40 w-full transition-all duration-200',
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
        : 'bg-white border-b border-gray-100'
    )}
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

      <Logo onClick={() => onNav('hero')} />

      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 ml-2">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNav(item.id)}
            aria-current={active === item.id ? 'page' : undefined}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]',
              item.primary
                ? active === item.id
                  ? 'bg-[#2563eb] text-white'
                  : 'text-[#2563eb] hover:bg-blue-50'
                : active === item.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Right CTA */}
      <div className="hidden lg:flex items-center gap-2 ml-auto">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNav('tools')}
          className="px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]
                     shadow-sm shadow-blue-100"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
        >
          Explore Trusted AI Tools
        </motion.button>
      </div>

      {/* Hamburger */}
      <motion.button
        onClick={onHamburger}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
        className="lg:hidden ml-auto p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
        aria-label="Open menu"
        aria-expanded={drawerOpen}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14"/>
        </svg>
      </motion.button>

    </div>
  </motion.header>
);

// ── GDPR Cookie banner ─────────────────────────────────────────────────────────

const GDPRBanner: FC = () => {
  const [accepted, setAccepted] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('gdpr_accepted') === 'true'
  );
  const accept = () => { localStorage.setItem('gdpr_accepted', 'true'); setAccepted(true); };

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          key="gdpr"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-sm z-50
                     bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 space-y-3"
        >
          <p className="text-xs text-gray-600 leading-relaxed">
            🍪 We use cookies for analytics only. We never sell your data.{' '}
            <button className="text-[#2563eb] hover:underline font-medium">Privacy Policy</button>.
          </p>
          <div className="flex gap-2">
            <button onClick={accept}
              className="flex-1 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold
                         hover:bg-[#1d4ed8] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]">
              Accept
            </button>
            <button onClick={accept}
              className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold
                         hover:bg-gray-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Floating CTA ───────────────────────────────────────────────────────────────

const FloatingCTA: FC<{ onClick: () => void }> = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="float"
          onClick={onClick}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed right-5 bottom-20 z-30 px-4 py-3 rounded-2xl text-white font-bold text-sm shadow-xl
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
          aria-label="Explore trusted AI tools"
        >
          Explore Tools →
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ── App ────────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    hero: null, audience: null, assistant: null, trusted: null,
    tools: null, categories: null, guides: null, blog: null, cta: null, about: null,
  });

  // Scroll state for nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [drawerOpen]);

  // Active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    (Object.keys(sectionRefs.current) as SectionId[]).forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.15, rootMargin: '-64px 0px -45% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* SVG filter (lightbulb PNG transparency) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="remove-white-bg" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 3 0" />
          </filter>
        </defs>
      </svg>

      {/* Mobile overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div ref={drawerRef} className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <MobileDrawer
              active={activeSection}
              onNav={scrollTo}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Top nav */}
      <TopNav
        active={activeSection}
        onNav={scrollTo}
        onHamburger={() => setDrawerOpen(true)}
        drawerOpen={drawerOpen}
        scrolled={scrolled}
      />

      {/* Main content */}
      <main aria-label="Main content">

        {/* 1 · Hero */}
        <div ref={setRef('hero')}>
          <Hero
            onExplore={() => scrollTo('tools')}
            onAssistant={() => scrollTo('assistant')}
          />
        </div>

        {/* 2 · Audience — who is this for */}
        <div ref={setRef('audience')}>
          <AudienceSection onViewTools={() => scrollTo('tools')} />
        </div>

        {/* 3 · AI Assistant — KEY FEATURE */}
        <div ref={setRef('assistant')}>
          <AIAssistantSection />
        </div>

        {/* 4 · Trusted Tools */}
        <div ref={setRef('trusted')}>
          <TrustedToolsSection />
        </div>

        {/* 5 · Full AI Tools Grid */}
        <div ref={setRef('tools')}>
          <ToolsGrid />
        </div>

        {/* 6 · Explore by Category */}
        <div ref={setRef('categories')}>
          <ExploreCategoriesSection onExplore={(cat) => cat === 'AI Tools' && scrollTo('tools')} />
        </div>

        {/* 7 · Free Guides */}
        <div ref={setRef('guides')}>
          <GuidesSection />
        </div>

        {/* 8 · Blog */}
        <div ref={setRef('blog')}>
          <Blog />
        </div>

        {/* 9 · Equipment Reviews */}
        <EquipmentReviews />

        {/* 10 · Final CTA */}
        <div ref={setRef('cta')}>
          <FinalCTASection
            onExplore={() => scrollTo('tools')}
            onAssistant={() => scrollTo('assistant')}
          />
        </div>

        {/* 10 · About */}
        <div ref={setRef('about')}>
          <About />
        </div>

        {/* Footer */}
        <Footer onNav={(id) => scrollTo(id as SectionId)} />

      </main>

      {/* Floating CTA */}
      <FloatingCTA onClick={() => scrollTo('tools')} />

      {/* GDPR banner */}
      <GDPRBanner />
    </div>
  );
};

export default App;
