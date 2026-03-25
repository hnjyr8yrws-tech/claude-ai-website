/**
 * App.tsx — GetPromptly.co.uk
 * 12-section single-page scroll · smooth anchor nav · floating CTA · WCAG AA
 */

import { useState, useRef, useEffect, FC } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from './lib/utils';
import lightbulb from './assets/lightbulb.png';

// ── Section components ─────────────────────────────────────────────────────────
import Hero              from './components/sections/Hero';
import WhyPromptly       from './components/sections/WhyPromptly';
import ToolsGrid         from './components/sections/ToolsGrid';
import TimeSavings       from './components/sections/TimeSavings';
import SafetyScore       from './components/sections/SafetyScore';
import GuidesSection     from './components/sections/GuidesSection';
import TrainingSection   from './components/sections/TrainingSection';
import EquipmentReviews  from '@/components/EquipmentReviews';
import Blog              from './components/sections/Blog';
import About             from './components/sections/About';
import Vision            from './components/sections/Vision';
import NewsletterSection from './components/sections/NewsletterSection';
import Footer            from './components/sections/Footer';

// ── Quiz form ──────────────────────────────────────────────────────────────────
import QuizForm from './components/QuizForm';

// ── Types ──────────────────────────────────────────────────────────────────────

type SectionId =
  | 'hero' | 'why' | 'tools' | 'how' | 'safety'
  | 'guides' | 'training' | 'equipment' | 'blog'
  | 'team' | 'vision' | 'newsletter';

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'hero',       label: 'Home' },
  { id: 'why',        label: 'Why Promptly' },
  { id: 'tools',      label: 'AI Tools' },
  { id: 'how',        label: 'How It Helps' },
  { id: 'safety',     label: 'Safety Scores' },
  { id: 'guides',     label: 'Guides' },
  { id: 'training',   label: 'Training' },
  { id: 'equipment',  label: 'Equipment' },
  { id: 'blog',       label: 'Blog' },
  { id: 'team',       label: 'Team' },
  { id: 'vision',     label: 'Vision' },
  { id: 'newsletter', label: 'Newsletter' },
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
    transition: { type: 'spring', stiffness: 300, damping: 26, delay: i * 0.04 },
  }),
};

// ── Logo ───────────────────────────────────────────────────────────────────────

const Logo: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
    aria-label="GetPromptly home"
  >
    <img src={lightbulb} alt="" aria-hidden="true"
         className="w-8 h-8 flex-shrink-0"
         style={{ filter: 'url(#remove-white-bg)' }} />
    <div className="hidden sm:block">
      <span className="font-black text-white tracking-tight text-base leading-none block">GetPromptly</span>
      <span className="text-[9px] text-slate-400 tracking-wide">getpromptly.co.uk</span>
    </div>
  </button>
);

// ── Mobile Drawer ──────────────────────────────────────────────────────────────

const MobileDrawer: FC<{
  active: SectionId;
  onNav: (id: SectionId) => void;
  onClose: () => void;
  onQuiz: () => void;
}> = ({ active, onNav, onClose, onQuiz }) => (
  <motion.div
    variants={drawerVariants}
    initial="hidden" animate="visible" exit="exit"
    className="flex flex-col w-72 h-full bg-ink shadow-2xl"
    aria-label="Mobile navigation"
    role="dialog"
  >
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
      <Logo onClick={() => { onNav('hero'); onClose(); }} />
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
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
          whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.06)' }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
            active === item.id
              ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/25'
              : 'text-slate-300 hover:text-white border border-transparent'
          )}
        >
          {active === item.id && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-brand-blue"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          {item.label}
        </motion.button>
      ))}
    </nav>

    <div className="border-t border-white/10 px-5 py-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => { onQuiz(); onClose(); }}
        className="w-full py-2.5 rounded-xl bg-brand-blue text-white font-black text-xs
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
      >
        Take the 60-Second Toolkit Quiz →
      </motion.button>
    </div>
  </motion.div>
);

// ── Top Nav ────────────────────────────────────────────────────────────────────

const TopNav: FC<{
  active: SectionId;
  onNav: (id: SectionId) => void;
  onHamburger: () => void;
  onQuiz: () => void;
  drawerOpen: boolean;
}> = ({ active, onNav, onHamburger, onQuiz, drawerOpen }) => (
  <motion.header
    className="sticky top-0 z-40 w-full bg-ink/95 backdrop-blur-md shadow-nav"
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

      <Logo onClick={() => onNav('hero')} />

      {/* Desktop nav — scrollable if needed */}
      <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-0.5 ml-3 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNav(item.id)}
            aria-current={active === item.id ? 'page' : undefined}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
              active === item.id
                ? 'bg-brand-blue/15 text-brand-blue'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Search */}
      <div className="hidden lg:flex flex-1 max-w-xs ml-auto">
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5"/><path d="M11.5 11.5l3 3"/>
          </svg>
          <input
            type="search"
            placeholder="Search tools, guides…"
            aria-label="Search"
            className="w-full pl-8 pr-4 py-2 text-xs border border-navy-border rounded-xl
                       bg-navy-mid text-slate-200 placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/40
                       transition-all"
          />
        </div>
      </div>

      {/* Right CTAs */}
      <div className="hidden lg:flex items-center gap-2 ml-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onQuiz}
          className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold text-xs
                     hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          60-Second Quiz →
        </motion.button>
      </div>

      {/* Hamburger */}
      <motion.button
        onClick={onHamburger}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="xl:hidden ml-auto p-2 rounded-lg text-slate-300 hover:text-white transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
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

// ── Floating "Free Prompts" button ─────────────────────────────────────────────

const FloatingPromptBtn: FC<{ onScroll: () => void }> = ({ onScroll }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScrollEvt = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScrollEvt, { passive: true });
    return () => window.removeEventListener('scroll', onScrollEvt);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="float"
          onClick={onScroll}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed right-5 bottom-20 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl
                     bg-[#14B8A6] text-white font-bold text-sm shadow-2xl
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
          aria-label="Get free prompts"
        >
          <span aria-hidden="true">📦</span> Free Prompts
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ── GDPR Cookie banner ─────────────────────────────────────────────────────────

const GDPRBanner: FC = () => {
  const [accepted, setAccepted] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('gdpr_accepted') === 'true'
  );

  const accept = () => {
    localStorage.setItem('gdpr_accepted', 'true');
    setAccepted(true);
  };

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
            🍪 We use cookies for analytics only. We never sell your data. Read our{' '}
            <button className="text-brand-blue hover:underline font-medium">Privacy Policy</button>.
          </p>
          <div className="flex gap-2">
            <button
              onClick={accept}
              className="flex-1 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold
                         hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Accept
            </button>
            <button
              onClick={accept}
              className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold
                         hover:bg-gray-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── App ────────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [quizOpen, setQuizOpen]           = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    hero: null, why: null, tools: null, how: null, safety: null,
    guides: null, training: null, equipment: null, blog: null,
    team: null, vision: null, newsletter: null,
  });

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [drawerOpen]);

  // Active section tracking via IntersectionObserver
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
    <div className="min-h-screen font-sans bg-cream">
      {/* SVG filter to remove white background from lightbulb PNG */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="remove-white-bg" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                     -1 -1 -1 3 0" />
          </filter>
        </defs>
      </svg>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-40 xl:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <div ref={drawerRef} className="fixed inset-y-0 left-0 z-50 xl:hidden">
            <MobileDrawer
              active={activeSection}
              onNav={scrollTo}
              onClose={() => setDrawerOpen(false)}
              onQuiz={() => setQuizOpen(true)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Sticky nav ── */}
      <TopNav
        active={activeSection}
        onNav={scrollTo}
        onHamburger={() => setDrawerOpen(true)}
        onQuiz={() => setQuizOpen(true)}
        drawerOpen={drawerOpen}
      />

      {/* ── Main content ── */}
      <main aria-label="Main content">

        {/* 1. Hero */}
        <div ref={setRef('hero')}>
          <Hero
            onExplore={() => scrollTo('tools')}
            onGuides={() => scrollTo('guides')}
          />
        </div>

        {/* 2. Why Promptly */}
        <div ref={setRef('why')}><WhyPromptly /></div>

        {/* 3. Explore AI Tools */}
        <div ref={setRef('tools')}><ToolsGrid /></div>

        {/* 4. How AI Helps */}
        <div ref={setRef('how')}><TimeSavings /></div>

        {/* 5. Safety Score */}
        <div ref={setRef('safety')}><SafetyScore /></div>

        {/* 6. Guides */}
        <div ref={setRef('guides')}><GuidesSection /></div>

        {/* 7. Free Training & Prompts (shadcn Tabs) */}
        <div ref={setRef('training')}><TrainingSection /></div>

        {/* 8. Equipment Reviews */}
        <div ref={setRef('equipment')}><EquipmentReviews /></div>

        {/* 9. Blog */}
        <div ref={setRef('blog')}><Blog /></div>

        {/* 10. Meet the Team */}
        <div ref={setRef('team')}><About /></div>

        {/* 11. Vision */}
        <div ref={setRef('vision')}><Vision /></div>

        {/* 12. Newsletter */}
        <div ref={setRef('newsletter')}><NewsletterSection /></div>

        <Footer onNav={scrollTo} />
      </main>

      {/* ── Floating "Free Prompts" button ── */}
      <FloatingPromptBtn onScroll={() => scrollTo('training')} />

      {/* ── GDPR Cookie banner ── */}
      <GDPRBanner />

      {/* ── Quiz form modal ── */}
      <QuizForm open={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
};

export default App;
