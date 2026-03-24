/**
 * Hero.tsx — GetPromptly
 * Notion-style "screen switching on" laptop hero
 * Framer Motion · dark bg image · fully responsive
 */

import { FC, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/hero-bg.jpg';
import lightbulb from '@/assets/lightbulb.png';

// ── Data ──────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '🏫 Trusted by UK Schools',
  '✅ Carefully Selected Tools',
  '🛡️ Designed for Safe Use',
  '🎯 Curriculum-Aligned',
  '👩‍🏫 Built by Educators',
  '📚 Reviewed for Educational Use',
  '🆓 Free Safety Guides',
  '🏆 Independent Reviews',
];

const SIDEBAR_ITEMS = [
  { icon: '📋', label: 'AI Policy for Schools', active: true },
  { icon: '📚', label: 'Lesson Plan Generator', active: false },
  { icon: '🛡️', label: 'GDPR Checklist',        active: false },
  { icon: '✏️', label: 'Marking Feedback Tool', active: false },
  { icon: '📊', label: 'Assessment Generator',  active: false },
];

const MESSAGES = [
  {
    role: 'user' as const,
    text: 'Create a Year 6 lesson plan on climate change.',
  },
  {
    role: 'assistant' as const,
    text: "Here's a structured lesson plan for your Year 6 class:",
    bullets: [
      '🌍  Learning Objectives — linked to KS2 science',
      '⏱️  60-minute session with starter activity',
      '🤝  Group debate, research & creative tasks',
      '📊  Exit ticket + peer-review assessment',
    ],
  },
  {
    role: 'user' as const,
    text: 'Can you add differentiation for SEN students?',
  },
];

// ── Marquee ───────────────────────────────────────────────────────────────────

const Marquee: FC = () => {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="w-full overflow-hidden py-3 relative border-t border-white/10"
      style={{ background: 'rgba(10,12,20,0.6)', backdropFilter: 'blur(8px)' }}
      aria-hidden="true"
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[rgba(10,12,20,0.6)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[rgba(10,12,20,0.6)] to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-white/45 text-xs font-medium px-6">
            {item}<span className="ml-6 text-white/20">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── CTA Button ────────────────────────────────────────────────────────────────

const CTAButton: FC<{
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  size?: 'default' | 'lg';
}> = ({ children, onClick, primary = true, size = 'default' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 240, damping: 20 });
  const my = useSpring(y, { stiffness: 240, damping: 20 });

  return (
    <motion.button
      onClick={onClick}
      style={{ x: mx, y: my }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.1);
        y.set((e.clientY - r.top - r.height / 2) * 0.1);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'rounded-xl font-bold tracking-tight transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        size === 'lg' ? 'px-7 py-4 text-base' : 'px-6 py-3.5 text-sm',
        primary
          ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:ring-[#2563eb] shadow-md shadow-blue-900/60'
          : 'border-2 border-white/30 text-white bg-white/10 hover:border-white/50 hover:bg-white/20 focus-visible:ring-white/30 backdrop-blur-sm'
      )}
    >
      {children}
    </motion.button>
  );
};

// ── Screen inner content ──────────────────────────────────────────────────────

const itemFade: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

const ScreenContent: FC<{ lit: boolean }> = ({ lit }) => {
  const sidebarContainer: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const msgContainer: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.45 } },
  };

  const animState = lit ? 'visible' : 'hidden';

  return (
    <div className="flex h-full text-[10px] font-sans overflow-hidden select-none">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <motion.aside
        className="w-[130px] flex-shrink-0 flex flex-col gap-[2px] overflow-hidden py-2"
        style={{ background: '#171717', borderRight: '1px solid #2a2a2a' }}
        variants={sidebarContainer}
        initial="hidden"
        animate={animState}
      >
        {/* Logo */}
        <motion.div variants={itemFade} className="flex items-center gap-[5px] px-[10px] pb-[6px]">
          <img
            src={lightbulb}
            alt=""
            aria-hidden="true"
            className="w-[13px] h-[13px] flex-shrink-0"
            style={{ filter: 'url(#remove-white-bg)' }}
          />
          <span className="font-bold text-[10px] text-white/90">getpromptly</span>
        </motion.div>

        {/* New chat */}
        <motion.div
          variants={itemFade}
          className="mx-[6px] mb-[3px] px-[7px] py-[3px] rounded-[5px] text-[9px] font-semibold text-white/50 flex items-center gap-[4px]"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span>+</span> New chat
        </motion.div>

        {/* Section label */}
        <motion.p
          variants={itemFade}
          className="px-[10px] py-[1px] text-[7.5px] font-semibold uppercase tracking-[0.08em] text-white/20"
        >
          Recents
        </motion.p>

        {/* Sidebar items */}
        {SIDEBAR_ITEMS.map((c) => (
          <motion.div
            key={c.label}
            variants={itemFade}
            className={cn(
              'flex items-center gap-[4px] mx-[4px] px-[6px] py-[2.5px] rounded-[4px] text-[9px] truncate cursor-default',
              c.active ? 'text-white/85 font-medium' : 'text-white/35'
            )}
            style={c.active ? { background: 'rgba(37,99,235,0.22)' } : {}}
          >
            <span className="flex-shrink-0 text-[8.5px]">{c.icon}</span>
            <span className="truncate">{c.label}</span>
          </motion.div>
        ))}
      </motion.aside>

      {/* ── Main chat ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ background: '#212121' }}>

        {/* Top bar */}
        <div
          className="flex items-center px-[11px] py-[4px] text-[8.5px]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-white/55 font-medium">AI Policy for Schools</span>
        </div>

        {/* Messages */}
        <motion.div
          className="flex-1 overflow-hidden flex flex-col justify-end gap-[7px] px-[11px] py-[8px]"
          variants={msgContainer}
          initial="hidden"
          animate={animState}
        >
          {MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              variants={itemFade}
              className={cn(
                'flex gap-[5px]',
                msg.role === 'user' ? 'justify-end' : 'justify-start items-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-[13px] h-[13px] rounded-full flex-shrink-0 flex items-center justify-center text-[5.5px] font-black text-white mt-[1px]"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
                >
                  P
                </div>
              )}
              <div
                className={cn(
                  'rounded-[7px] px-[7px] py-[4px] max-w-[78%] text-[9px] leading-[1.42]',
                  msg.role === 'user' ? 'text-white/80' : 'text-white/72'
                )}
                style={{
                  background: msg.role === 'user'
                    ? 'rgba(37,99,235,0.22)'
                    : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <p>{msg.text}</p>
                {msg.role === 'assistant' && msg.bullets && (
                  <ul className="mt-[3px] space-y-[2px]">
                    {msg.bullets.map((b, j) => (
                      <li key={j} className="text-white/55 text-[8px]">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Input bar */}
        <div className="px-[9px] pb-[7px]">
          <div
            className="flex items-center gap-[5px] px-[7px] py-[4px] rounded-[7px]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(37,99,235,0.25)',
              boxShadow: '0 0 10px rgba(37,99,235,0.08)',
            }}
          >
            <span className="flex-1 text-[8.5px] text-white/22">Ask Promptly anything…</span>
            <div
              className="w-[13px] h-[13px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
            >
              <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                <path d="M1 7L7 4 1 1v2.5l4 .5-4 .5V7z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ── Laptop frame ──────────────────────────────────────────────────────────────

const LaptopMockup: FC<{ lit: boolean }> = ({ lit }) => (
  <div className="w-full max-w-[620px] mx-auto">
    {/* Lid */}
    <motion.div
      className="relative rounded-[18px_18px_6px_6px] p-[10px_10px_5px]"
      style={{ background: 'linear-gradient(155deg,#323236,#1d1d20)' }}
      animate={{
        boxShadow: lit
          ? [
              '0 0 0 1px rgba(255,255,255,0.08)',
              '0 32px 80px rgba(0,0,0,0.65)',
              '0 0 55px rgba(37,99,235,0.6)',
              '0 0 110px rgba(37,99,235,0.28)',
              '0 0 200px rgba(124,58,237,0.18)',
            ].join(', ')
          : '0 20px 60px rgba(0,0,0,0.35)',
      }}
      transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Camera dot */}
      <div className="w-[7px] h-[7px] rounded-full bg-[#2a2a2e] border border-[#3a3a3e] mx-auto mb-[6px] relative">
        <div className="w-[3px] h-[3px] rounded-full bg-white/15 absolute top-[1px] left-[1px]" />
      </div>

      {/* Screen bezel */}
      <div className="bg-[#0a0a0c] rounded-[7px] p-[2px]">
        <div className="relative rounded-[5px] overflow-hidden" style={{ aspectRatio: '16/8' }}>

          {/* Screen content — filtered while off */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#111' }}
            animate={{
              filter: lit ? 'brightness(1) blur(0px)' : 'brightness(0.1) blur(6px)',
            }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <ScreenContent lit={lit} />
          </motion.div>

          {/* Dark overlay that burns away */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            animate={{ opacity: lit ? 0 : 1 }}
            transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>
    </motion.div>

    {/* Keyboard base */}
    <div>
      <div
        className="h-[5px] mx-[3%]"
        style={{ background: 'linear-gradient(to bottom,#3e3e44,#28282c)', borderRadius: '0 0 2px 2px' }}
      />
      <div
        className="relative h-[22px] mx-[-2%] rounded-b-[14px]"
        style={{ background: 'linear-gradient(170deg,#2e2e33,#202023)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
      >
        <div
          className="absolute top-[5px] left-[14%] right-[14%] h-[8px] rounded-[3px]"
          style={{
            background:
              'repeating-linear-gradient(90deg,transparent 0,transparent 6px,rgba(255,255,255,0.03) 6px,rgba(255,255,255,0.03) 8px)',
          }}
        />
        <div
          className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[16%] h-[6px] rounded-[3px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        />
      </div>
      <div
        className="h-[3px] mx-[5%] opacity-20"
        style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '0 0 50% 50%', filter: 'blur(4px)' }}
      />
    </div>
  </div>
);

// ── Hero text variants ────────────────────────────────────────────────────────

const textContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const textItem: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ── Hero ──────────────────────────────────────────────────────────────────────

const Hero: FC<{ onExplore: () => void; onAssistant: () => void }> = ({ onExplore, onAssistant }) => {
  const [animKey, setAnimKey] = useState(0);
  const [lit,     setLit]     = useState(false);

  // Fire "screen on" after 600 ms; reset & replay whenever animKey changes
  useEffect(() => {
    setLit(false);
    const t = setTimeout(() => setLit(true), 600);
    return () => clearTimeout(t);
  }, [animKey]);

  return (
    <>
      {/* SVG filter to strip white from PNG logo */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="remove-white-bg" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 3 0" />
          </filter>
        </defs>
      </svg>

      <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden">

        {/* ── Background image ─────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'rgba(10,12,20,0.74)' }}
        />

        {/* ── Hero copy ────────────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-4 text-center">
          <motion.div
            className="space-y-6"
            variants={textContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={textItem}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                               bg-white/10 border border-white/20 text-white/90 text-xs font-semibold backdrop-blur-sm">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                The UK's Trusted AI Resource for Education
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={textItem}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white"
            >
              AI for Education —{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Made Simple
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={textItem}
              className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto"
            >
              Helping teachers, parents, schools and professionals use AI to support learning,
              save time, and work more effectively.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={textItem} className="flex flex-wrap justify-center gap-3 pt-1">
              <CTAButton primary size="lg" onClick={onExplore}>
                Explore Trusted AI Tools →
              </CTAButton>
              <CTAButton primary={false} size="lg" onClick={onAssistant}>
                Get AI Support
              </CTAButton>
            </motion.div>

            {/* Microtext */}
            <motion.p variants={textItem} className="text-xs text-white/40">
              Carefully selected tools for safe and effective use
            </motion.p>

            {/* Replay */}
            <motion.div variants={textItem} className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setAnimKey((k) => k + 1)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium
                           text-white/40 border border-white/20 hover:border-blue-400 hover:text-blue-400
                           transition-colors backdrop-blur-sm"
              >
                <span>▶</span> Replay demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Laptop mockup ─────────────────────────────────────────────────── */}
        <div className="relative z-10 px-4 sm:px-6 pb-0 -mt-2">
          <motion.div
            key={animKey}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <LaptopMockup lit={lit} />
          </motion.div>
        </div>

        {/* ── Marquee trust strip ────────────────────────────────────────────── */}
        <Marquee />
      </section>
    </>
  );
};

export default Hero;
