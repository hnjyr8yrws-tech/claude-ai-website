/**
 * Hero.tsx — Promptly hero
 * Two-column layout: headline/CTAs left · laptop mockup right
 *
 * Animation sequence (Framer Motion):
 *  1. Screen starts dim  → brightness(1) over 1.2s at t=200ms
 *  2. Frame glow pulse   → blue box-shadow at t=500ms
 *  3. Sidebar items      → staggered fadeInUp from t=900ms
 *  4. Chat messages      → staggered fadeInUp from t=1100ms
 *
 * "Demo again" button increments `animKey` → remounts <LaptopMockup>
 * → all Framer Motion initial→animate cycles restart cleanly.
 */

import { FC, useState } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/hero-bg.jpg';
import lightbulb from '@/assets/lightbulb.png';

// ── Static data ────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '🏫 Trusted by UK Schools', '🛡️ Safety-Rated Tools', '✅ GDPR Compliant',
  '🎯 Curriculum-Aligned',    '👩‍🏫 Built by Educators', '📚 180+ Tools Reviewed',
  '🆓 Free Safety Guides',    '🏆 Independent Reviews',
];

// Sidebar chat history items
const CHATS = [
  { icon: '✏️', label: 'AI Policy for Schools',    active: true },
  { icon: '📋', label: 'Ofsted Prep Guide',         active: false },
  { icon: '🛡️', label: 'GDPR Checklist',            active: false },
  { icon: '📚', label: 'Lesson Plan Generator',     active: false },
  { icon: '📊', label: 'CPD Framework',             active: false },
];

// Claude chat messages
const MESSAGES = [
  {
    role: 'user' as const,
    text: 'Help me write an AI usage policy for our primary school.',
  },
  {
    role: 'claude' as const,
    text: "Here's a solid framework for your school AI policy:",
    bullets: [
      '📋  Purpose & Scope — which tools staff/students may use',
      '🔒  GDPR Compliance — data handling, storage, deletion rights',
      '🧒  Age-Appropriateness — content filtering per year group',
      '🎯  Ofsted Alignment — maps to current EIF inspection criteria',
    ],
  },
  {
    role: 'user' as const,
    text: 'Can you add teacher-specific guidelines too?',
  },
  {
    role: 'claude' as const,
    text: 'Of course! Here are teacher-specific additions — including lesson planning rules, marking with AI, and pupil data handling…',
    bullets: [],
  },
];

// ── Marquee ────────────────────────────────────────────────────────────────────

const Marquee: FC = () => {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="w-full overflow-hidden py-3 relative" aria-hidden="true">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#1E293B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1E293B] to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-slate-400 text-xs font-medium px-6">
            {item}<span className="ml-6 text-slate-600">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Magnetic CTA Button ────────────────────────────────────────────────────────

const CTAButton: FC<{
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}> = ({ children, onClick, primary = true }) => {
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
        x.set((e.clientX - r.left - r.width / 2) * 0.12);
        y.set((e.clientY - r.top - r.height / 2) * 0.12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'px-6 py-3.5 rounded-2xl font-bold text-sm tracking-tight transition-all',
        'focus-visible:outline-none focus-visible:ring-2',
        primary
          ? 'bg-[#60A5FA] text-[#0F172A] hover:opacity-90 focus-visible:ring-[#60A5FA]'
          : 'border-2 border-[#67E8F9]/50 text-[#67E8F9] bg-[#67E8F9]/10 hover:bg-[#67E8F9]/20 focus-visible:ring-[#67E8F9]'
      )}
    >
      {children}
    </motion.button>
  );
};

// ── Laptop Mockup ──────────────────────────────────────────────────────────────
// Accepts no props — remounting via `key` restarts all animations.

const sidebarVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.9 } },
};

const msgVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 1.1 } },
};

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

const LaptopMockup: FC = () => (
  /* ── Lid: animated frame glow ─────────────────────────────────────────── */
  <motion.div
    className="relative rounded-[18px_18px_6px_6px] p-[11px_11px_5px]"
    style={{ background: 'linear-gradient(155deg,#323236,#1d1d20)' }}
    /* STEP 2: Frame glow — box-shadow animates from flat to blue neon */
    initial={{ boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)' }}
    animate={{ boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5), 0 0 52px 12px rgba(96,165,250,0.42), 0 0 100px 32px rgba(147,197,253,0.14)' }}
    transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
  >
    {/* Camera */}
    <div className="w-[7px] h-[7px] rounded-full bg-[#2a2a2e] border border-[#3a3a3e] mx-auto mb-[7px] relative">
      <div className="w-[3px] h-[3px] rounded-full bg-white/15 absolute top-[1px] left-[1px]" />
    </div>

    {/* Screen glass border */}
    <div className="bg-[#0a0a0c] rounded-[7px] p-[2px]">

      {/* ── THE SCREEN — STEP 1: brightness transition ──────────────────── */}
      <motion.div
        className="relative rounded-[5px] overflow-hidden"
        style={{ aspectRatio: '16/8', background: '#1a1a1a' }}
        initial={{ filter: 'brightness(0.08) blur(7px) saturate(0.2)' }}
        animate={{ filter: 'brightness(1) blur(0px) saturate(1)' }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ── Claude UI ─────────────────────────────────────────────────── */}
        <div className="flex h-full text-[10px] font-sans overflow-hidden">

          {/* SIDEBAR — STEP 3: stagger in */}
          <motion.aside
            className="w-[130px] flex-shrink-0 flex flex-col gap-[2px] overflow-hidden py-2"
            style={{ background: '#171717', borderRight: '1px solid #2a2a2a' }}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Claude wordmark */}
            <motion.div
              className="flex items-center gap-[5px] px-[10px] pb-[8px]"
              variants={fadeUp}
            >
              {/* getpromptly logo mark */}
              <img src={lightbulb} alt="" aria-hidden="true"
                   className="w-[14px] h-[14px] flex-shrink-0"
                   style={{ filter: 'url(#remove-white-bg)' }} />
              <span className="font-bold text-[10.5px] text-white/90">getpromptly</span>
            </motion.div>

            {/* New chat button */}
            <motion.button
              variants={fadeUp}
              className="mx-[6px] mb-[4px] px-[7px] py-[3px] rounded-[5px] text-[9px] font-semibold text-left text-white/60 flex items-center gap-[4px]"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <span>✦</span> New chat
            </motion.button>

            {/* Section label */}
            <motion.p variants={fadeUp}
              className="px-[10px] py-[2px] text-[8px] font-semibold uppercase tracking-[0.08em] text-white/25">
              Recents
            </motion.p>

            {/* Chat history */}
            {CHATS.map((c) => (
              <motion.div
                key={c.label}
                variants={fadeUp}
                className={cn(
                  'flex items-center gap-[5px] mx-[4px] px-[7px] py-[3px] rounded-[4px] text-[9.5px] cursor-default truncate',
                  c.active
                    ? 'text-white/90 font-medium'
                    : 'text-white/40'
                )}
                style={c.active ? { background: 'rgba(255,255,255,0.08)' } : {}}
              >
                <span className="flex-shrink-0 text-[9px]">{c.icon}</span>
                <span className="truncate">{c.label}</span>
              </motion.div>
            ))}
          </motion.aside>

          {/* MAIN CHAT AREA */}
          <main className="flex-1 flex flex-col overflow-hidden" style={{ background: '#212121' }}>

            {/* Top bar */}
            <motion.div
              className="flex items-center justify-between px-[12px] py-[5px] text-[9px]"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.4 }}
            >
              <span className="text-white/60 font-medium">AI Policy for Schools</span>
              <div className="flex gap-[4px]">
                {['Share', '···'].map((t) => (
                  <span key={t} className="px-[5px] py-[1px] rounded-[3px] text-white/30 cursor-default"
                    style={{ border: '1px solid rgba(255,255,255,0.09)' }}>{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Messages — STEP 4: stagger */}
            <motion.div
              className="flex-1 overflow-hidden flex flex-col justify-end gap-[8px] px-[12px] py-[10px]"
              variants={msgVariants}
              initial="hidden"
              animate="visible"
            >
              {MESSAGES.map((msg, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={cn(
                    'flex gap-[6px]',
                    msg.role === 'user' ? 'justify-end' : 'justify-start items-start'
                  )}
                >
                  {/* getpromptly avatar */}
                  {msg.role === 'claude' && (
                    <div className="w-[14px] h-[14px] rounded-full flex-shrink-0 flex items-center justify-center text-[6px] font-black text-white mt-[1px]"
                         style={{ background: 'linear-gradient(135deg,#60a5fa,#3b82f6)' }}>P</div>
                  )}

                  <div className={cn(
                    'rounded-[8px] px-[8px] py-[5px] max-w-[78%] text-[9.5px] leading-[1.45]',
                    msg.role === 'user'
                      ? 'text-white/80'
                      : 'text-white/75',
                  )}
                  style={{
                    background: msg.role === 'user'
                      ? 'rgba(96,165,250,0.18)'
                      : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <p>{msg.text}</p>
                    {msg.bullets && msg.bullets.length > 0 && (
                      <ul className="mt-[4px] space-y-[2px]">
                        {msg.bullets.map((b, j) => (
                          <li key={j} className="text-white/60 text-[8.5px]">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Input bar */}
            <motion.div
              className="px-[10px] pb-[8px]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.35 }}
            >
              <div className="flex items-center gap-[6px] px-[8px] py-[5px] rounded-[8px]"
                   style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(96,165,250,0.25)', boxShadow: '0 0 10px rgba(96,165,250,0.08)' }}>
                <span className="flex-1 text-[9px] text-white/25">Ask Promptly anything…</span>
                {/* Send button */}
                <div className="w-[14px] h-[14px] rounded-full flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg,#60a5fa,#3b82f6)' }}>
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                    <path d="M1 7L7 4 1 1v2.5l4 .5-4 .5V7z" fill="white"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

// ── Laptop Shell Wrapper (lid + base) ─────────────────────────────────────────

const LaptopShell: FC = () => (
  <div className="w-full max-w-[580px] mx-auto">
    <LaptopMockup />
    {/* Hinge + keyboard base */}
    <div>
      <div className="h-[5px] mx-[3%]"
           style={{ background: 'linear-gradient(to bottom,#3e3e44,#28282c)', borderRadius: '0 0 2px 2px' }} />
      <div className="relative h-[22px] mx-[-2%] rounded-b-[14px]"
           style={{ background: 'linear-gradient(170deg,#2e2e33,#202023)', boxShadow: '0 14px 36px rgba(0,0,0,0.42)' }}>
        {/* Keyboard lines */}
        <div className="absolute top-[5px] left-[14%] right-[14%] h-[8px] rounded-[3px]"
             style={{ background: 'repeating-linear-gradient(90deg,transparent 0px,transparent 6px,rgba(255,255,255,0.035) 6px,rgba(255,255,255,0.035) 8px)' }} />
        {/* Trackpad */}
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[16%] h-[6px] rounded-[3px]"
             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }} />
      </div>
      {/* Foot shadow */}
      <div className="h-[3px] mx-[5%] opacity-30"
           style={{ background: 'rgba(0,0,0,0.6)', borderRadius: '0 0 50% 50%', filter: 'blur(4px)' }} />
    </div>
  </div>
);

// ── Main Hero ──────────────────────────────────────────────────────────────────

const textVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const textItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Hero: FC<{ onExplore: () => void; onGuides: () => void }> = ({ onExplore, onGuides }) => {
  // Incrementing this key remounts <LaptopShell> → restarts all animations
  const [animKey, setAnimKey] = useState(0);

  return (
    <>
    {/* SVG filter: converts white pixels to transparent so lightbulb PNG shows without its white bg */}
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
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#0F172A]"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: '100% auto', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}
    >
      {/* Base dark overlay */}
      <div className="absolute inset-0 bg-[#0F172A]/65 z-0" aria-hidden="true" />

      {/* Extra overlay: blacks out top-centre to hide background characters behind the headline */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 18%, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.55) 55%, transparent 100%)',
        }}
      />

      {/* Background glow orbs */}
      <motion.div aria-hidden="true" className="absolute pointer-events-none"
        style={{ width: 600, height: 600, borderRadius: '50%', top: '-10%', left: '-8%', zIndex: 1,
          background: 'radial-gradient(circle,#3B82F6 0%,transparent 65%)', filter: 'blur(80px)', opacity: 0.2 }}
        animate={{ y: [0, -35, 0], x: [0, 25, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div aria-hidden="true" className="absolute pointer-events-none"
        style={{ width: 500, height: 500, borderRadius: '50%', top: '15%', right: '-6%', zIndex: 1,
          background: 'radial-gradient(circle,#818CF8 0%,transparent 65%)', filter: 'blur(90px)', opacity: 0.15 }}
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div aria-hidden="true" className="absolute pointer-events-none"
        style={{ width: 400, height: 400, borderRadius: '50%', bottom: '10%', left: '40%', zIndex: 1,
          background: 'radial-gradient(circle,#06B6D4 0%,transparent 65%)', filter: 'blur(70px)', opacity: 0.13 }}
        animate={{ y: [0, -20, 0], x: [0, -15, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* ── Centred text block ────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-3 text-center">
        <motion.div className="space-y-5" variants={textVariants} initial="hidden" animate="visible">

          {/* Eyebrow */}
          <motion.div variants={textItem}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                             bg-[#60A5FA]/10 border border-[#60A5FA]/25 text-[#60A5FA] text-xs font-semibold">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] flex-shrink-0"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              The UK's Independent EdTech Resource
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            variants={textItem}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.0] text-white"
          >
            Empower Education<br />
            <span className="text-[#60A5FA]">With AI Tools</span><br />
            {/* GetPromptly + lightbulb on their own larger line */}
            <span className="inline-flex items-center gap-0 text-6xl sm:text-7xl lg:text-8xl text-[#60A5FA]">
              GetPromptly
              <motion.img
                src={lightbulb}
                alt=""
                aria-hidden="true"
                className="inline-block w-[1.8em] h-[1.8em] align-middle relative top-5 -left-1"
                style={{ filter: 'url(#remove-white-bg)' }}
                animate={{
                  scale: [1, 1.15, 1],
                  filter: [
                    'url(#remove-white-bg) drop-shadow(0 0 10px rgba(255,255,255,0.6)) drop-shadow(0 0 22px rgba(255,255,255,0.35)) drop-shadow(0 0 35px rgba(210,230,255,0.25))',
                    'url(#remove-white-bg) drop-shadow(0 0 28px rgba(255,255,255,1.0)) drop-shadow(0 0 55px rgba(255,255,255,0.85)) drop-shadow(0 0 90px rgba(210,230,255,0.65)) drop-shadow(0 0 120px rgba(190,215,255,0.45))',
                    'url(#remove-white-bg) drop-shadow(0 0 10px rgba(255,255,255,0.6)) drop-shadow(0 0 22px rgba(255,255,255,0.35)) drop-shadow(0 0 35px rgba(210,230,255,0.25))',
                  ],
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={textItem} className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
            Pass Ofsted checks. Independent reviews, safety guides, and practical AI tools
            for teachers, students, parents and every school department.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={textItem} className="flex flex-wrap justify-center gap-3">
            <CTAButton primary onClick={onExplore}>Explore AI Tools →</CTAButton>
            <CTAButton primary={false} onClick={onGuides}>Read Our Guides</CTAButton>
          </motion.div>

          {/* Demo again */}
          <motion.div variants={textItem} className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setAnimKey((k) => k + 1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
                         text-slate-400 border border-[#2D3F55] hover:border-[#60A5FA]/40
                         hover:text-[#60A5FA] transition-colors"
            >
              <span>▶</span> Demo animation again
            </motion.button>
          </motion.div>

        </motion.div>
      </div>

      {/* ── Laptop centred at bottom (Notion-style) ───────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 pb-0 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LaptopShell key={animKey} />
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div className="relative z-10 border-t border-[#1E293B]">
        <Marquee />
      </div>

      {/* Gradient bridge to next section */}
      <div className="relative z-10 h-10 bg-gradient-to-b from-[#1E293B] to-[#FAFAFA]" aria-hidden="true" />
    </section>
    </>
  );
};

export default Hero;
