/**
 * App.tsx — GetPromptly.co.uk
 * Nav · Hero · Trust Bar · Featured Categories · Team · Prompts Teaser · Blog · Footer
 */

import { useState, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from './lib/utils';
import Hero         from './components/sections/Hero';
import Benefits     from './components/sections/Benefits';
import ToolsGrid    from './components/sections/ToolsGrid';
import About        from './components/sections/About';
import PromoTeaser  from './components/sections/PromoTeaser';
import Blog         from './components/sections/Blog';
import Footer       from './components/sections/Footer';

type SectionId = 'home' | 'tools' | 'about' | 'prompts' | 'blog';

interface NavItem {
  id: SectionId | null;  // null = external href
  label: string;
  href?: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',    label: 'Home' },
  { id: 'tools',   label: 'AI Tools' },
  { id: null,      label: 'Training',    href: '/training' },
  { id: null,      label: 'IT Equipment', href: '/it-equipment' },
  { id: 'prompts', label: 'AI Prompts for Schools', highlight: true },
  { id: 'blog',    label: 'Blog' },
  { id: 'about',   label: 'About Us' },
];

// ── Drawer variants ─────────────────────────────────────────────────────────────

const drawerVariants: Variants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
};

const navItemVariants: Variants = {
  hidden:  { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26, delay: i * 0.05 },
  }),
};

// ── Logo ───────────────────────────────────────────────────────────────────────

const Logo: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg"
    aria-label="GetPromptly home"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5" strokeOpacity=".95"/>
        <circle cx="8" cy="8" r="2" fill="white"/>
      </svg>
    </div>
    <span className="font-bold text-white text-base tracking-tight">GetPromptly</span>
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
    initial="hidden"
    animate="visible"
    exit="exit"
    className="flex flex-col w-72 h-full bg-[#0F172A] shadow-2xl"
    aria-label="Mobile navigation"
    role="dialog"
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
      <Logo onClick={() => { onNav('home'); onClose(); }} />
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        aria-label="Close menu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13"/>
        </svg>
      </motion.button>
    </div>

    <nav aria-label="Navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map((item, i) => (
        <motion.button
          key={item.label}
          custom={i}
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
          onClick={() => {
            if (item.id) { onNav(item.id); onClose(); }
          }}
          aria-current={item.id && active === item.id ? 'page' : undefined}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
            item.highlight
              ? 'text-teal-400 bg-teal-400/10 border border-teal-400/20'
              : item.id && active === item.id
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
          )}
        >
          {item.label}
        </motion.button>
      ))}
    </nav>
  </motion.div>
);

// ── Top Navigation ─────────────────────────────────────────────────────────────

const TopNav: FC<{
  active: SectionId;
  onNav: (id: SectionId) => void;
  onHamburger: () => void;
  drawerOpen: boolean;
}> = ({ active, onNav, onHamburger, drawerOpen }) => (
  <motion.header
    className="sticky top-0 z-40 w-full bg-[#0F172A] shadow-md"
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">

      <Logo onClick={() => onNav('home')} />

      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 ml-2">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.label}
            onClick={() => item.id && onNav(item.id)}
            aria-current={item.id && active === item.id ? 'page' : undefined}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
              item.highlight
                ? 'text-teal-400 hover:text-teal-300 font-semibold'
                : item.id && active === item.id
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Right CTA */}
      <div className="hidden lg:flex ml-auto">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNav('tools')}
          className="px-5 py-2.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold text-sm
                     transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          Browse AI Tools
        </motion.button>
      </div>

      {/* Mobile hamburger */}
      <motion.button
        onClick={onHamburger}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="lg:hidden ml-auto p-2 rounded-lg text-slate-300 hover:text-white transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
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

// ── App ────────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    home: null, tools: null, about: null, prompts: null, blog: null,
  });

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        setDrawerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    (Object.keys(sectionRefs.current) as SectionId[]).forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.2, rootMargin: '-64px 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  const setRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen font-sans bg-white">

      {/* Mobile overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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

      {/* Sticky nav */}
      <TopNav
        active={activeSection}
        onNav={scrollTo}
        onHamburger={() => setDrawerOpen(true)}
        drawerOpen={drawerOpen}
      />

      <main aria-label="Main content">
        {/* 1. Hero */}
        <div ref={setRef('home')}>
          <Hero onExplore={() => scrollTo('tools')} onGuides={() => scrollTo('about')} />
        </div>

        {/* 2. Trust Bar */}
        <Benefits />

        {/* 3. Featured Categories */}
        <div ref={setRef('tools')}><ToolsGrid /></div>

        {/* 4. Team */}
        <div ref={setRef('about')}><About /></div>

        {/* 5. AI Prompts Teaser */}
        <div ref={setRef('prompts')}><PromoTeaser /></div>

        {/* 6. Blog */}
        <div ref={setRef('blog')}><Blog /></div>

        <Footer onNav={scrollTo} />
      </main>
    </div>
  );
};

export default App;
