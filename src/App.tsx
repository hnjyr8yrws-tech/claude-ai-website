/**
 * App.tsx — getpromptly.co.uk
 * Dark nav/hero · Light sections · Spring drawer
 */

import React, { useState, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring } from 'framer-motion';
import { cn } from './lib/utils';
import Hero        from './components/sections/Hero';
import Benefits    from './components/sections/Benefits';
import ToolsGrid   from './components/sections/ToolsGrid';
import TimeSavings from './components/sections/TimeSavings';
import SafetyGuide from './components/sections/SafetyGuide';
import BlogPreview from './components/sections/BlogPreview';
import Events      from './components/sections/Events';
import Reviews     from './components/sections/Reviews';
import Blog        from './components/sections/Blog';
import About       from './components/sections/About';
import Footer      from './components/sections/Footer';

type SectionId = 'home' | 'tools' | 'reviews' | 'blog' | 'safety' | 'about';

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'home',    label: 'Home' },
  { id: 'tools',   label: 'AI Tools' },
  { id: 'reviews', label: 'Equipment Reviews' },
  { id: 'blog',    label: 'Blog' },
  { id: 'safety',  label: 'Safety Guide' },
  { id: 'about',   label: 'About Us' },
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
    transition: { type: 'spring', stiffness: 300, damping: 26, delay: i * 0.06 },
  }),
};

// ── Logo Orb ───────────────────────────────────────────────────────────────────

const LogoOrb: FC<{ size?: number }> = ({ size = 32 }) => (
  <motion.div
    aria-hidden="true"
    className="relative rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#67E8F9]
               flex items-center justify-center overflow-hidden flex-shrink-0"
    style={{ width: size, height: size }}
    animate={{ boxShadow: [
      '0 0 0 0 rgba(96,165,250,0.3)',
      '0 0 0 7px rgba(96,165,250,0)',
      '0 0 0 0 rgba(96,165,250,0)',
    ]}}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    whileHover={{ scale: 1.08, rotate: 4 }}
  >
    <motion.div
      className="absolute inset-0"
      style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.25) 80%, transparent 90%)' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" fill="none" className="relative z-10" aria-hidden="true">
      <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5" strokeOpacity=".95"/>
      <circle cx="8" cy="8" r="2" fill="white"/>
    </svg>
  </motion.div>
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
    className="flex flex-col w-72 h-full drawer-dark shadow-2xl"
    aria-label="Mobile navigation"
    role="dialog"
  >
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2D3F55]">
      <LogoOrb size={36} />
      <div className="min-w-0">
        <span className="font-black text-sm text-white tracking-tight block">Promptly</span>
        <span className="text-[10px] text-slate-400">getpromptly.co.uk</span>
      </div>
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.92 }}
        className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        aria-label="Close menu"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13"/>
        </svg>
      </motion.button>
    </div>

    {/* Nav links */}
    <nav aria-label="Navigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map((item, i) => (
        <motion.button
          key={item.id}
          custom={i}
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => { onNav(item.id); onClose(); }}
          whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]',
            active === item.id
              ? 'bg-[#60A5FA]/15 text-[#60A5FA] border border-[#60A5FA]/25'
              : 'text-slate-300 hover:text-white border border-transparent'
          )}
        >
          <AnimatePresence>
            {active === item.id && (
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#60A5FA]"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
          {item.label}
        </motion.button>
      ))}
    </nav>

    {/* Footer */}
    <div className="border-t border-[#2D3F55] px-5 py-4 space-y-3">
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Safe AI for every classroom.<br />
        <span className="text-[#60A5FA] font-medium">Trusted by UK educators.</span>
      </p>
      <motion.button
        whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(96,165,250,0.35)' }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-2.5 rounded-xl bg-[#60A5FA] text-[#0F172A] font-black text-xs
                   transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
      >
        Join Our Community →
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
}> = ({ active, onNav, onHamburger, drawerOpen }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 200, damping: 20 });
  const my = useSpring(y, { stiffness: 200, damping: 20 });

  return (
    <motion.header
      className="sticky top-0 z-40 w-full nav-dark backdrop-blur-md"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <button
          onClick={() => onNav('home')}
          className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] rounded-lg"
          aria-label="Promptly home"
        >
          <LogoOrb size={34} />
          <div className="hidden sm:block">
            <span className="font-black text-white tracking-tight text-base leading-none block">Promptly</span>
            <span className="text-[9px] text-slate-400 tracking-wide">getpromptly.co.uk</span>
          </div>
        </button>

        {/* Desktop nav links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5 ml-4">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onNav(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]',
                active === item.id
                  ? 'bg-[#60A5FA]/15 text-[#60A5FA]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              )}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xs ml-auto">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5"/><path d="M11.5 11.5l3 3"/>
            </svg>
            <input
              type="search"
              placeholder="Search tools, reviews…"
              aria-label="Search"
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#2D3F55] rounded-xl
                         bg-[#1E293B] text-slate-200 placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 focus:border-[#60A5FA]/40
                         transition-all"
            />
          </div>
        </div>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-2 ml-3">
          <motion.button
            whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(103,232,249,0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{ x: mx, y: my }}
            onMouseMove={(e) => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
              x.set((e.clientX - r.left - r.width / 2) * 0.1);
              y.set((e.clientY - r.top - r.height / 2) * 0.1);
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="px-4 py-2 rounded-xl border border-[#67E8F9]/40 text-[#67E8F9] text-sm font-bold
                       bg-[#67E8F9]/10 hover:bg-[#67E8F9]/20 transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
          >
            Submit Tool
          </motion.button>
          <motion.button
            whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(96,165,250,0.35)' }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl bg-[#60A5FA] text-[#0F172A] font-bold text-sm
                       hover:opacity-90 transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
          >
            Newsletter
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          onClick={onHamburger}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.92 }}
          className="lg:hidden ml-auto p-2 rounded-lg text-slate-300 hover:text-white transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
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
};

// ── App ────────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    home: null, tools: null, reviews: null, blog: null, safety: null, about: null,
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
    <div className="min-h-screen font-sans">

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
          <Hero onExplore={() => scrollTo('tools')} onGuides={() => scrollTo('blog')} />
        </div>

        {/* 2. Why Schools Trust Promptly */}
        <Benefits />

        {/* 3. Explore AI Tools */}
        <div ref={setRef('tools')}><ToolsGrid /></div>

        {/* 4. How AI Helps Teachers */}
        <TimeSavings />

        {/* 5. Safety First */}
        <div ref={setRef('safety')}><SafetyGuide /></div>

        {/* 6. Guides & Resources */}
        <div ref={setRef('blog')}><BlogPreview /></div>

        {/* 7. Free AI Training */}
        <Events />

        {/* 8. Equipment Reviews */}
        <div ref={setRef('reviews')}><Reviews /></div>

        {/* 9. From the Blog */}
        <Blog />

        {/* 10. Team · Vision · Newsletter */}
        <div ref={setRef('about')}><About /></div>

        <Footer onNav={scrollTo} />
      </main>
    </div>
  );
};

export default App;
