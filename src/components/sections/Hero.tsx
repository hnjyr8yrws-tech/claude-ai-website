/**
 * Hero.tsx — Dark navy Notion-style hero (#0F172A)
 * Soft blue/teal CTAs · white text · breathing orb · magnetic buttons
 */

import React, { FC } from 'react';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/hero-bg.jpg';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ── Typing indicator ───────────────────────────────────────────────────────────

const TypingDots: FC = () => (
  <span className="inline-flex items-center gap-1 align-middle ml-1" role="img" aria-label="AI active">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="block w-1.5 h-1.5 rounded-full bg-[#60A5FA]"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
    ))}
  </span>
);

// ── Magnetic button (dark variant) ────────────────────────────────────────────

const MagneticBtn: FC<{
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
}> = ({ children, onClick, primary = true, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 240, damping: 20 });
  const my = useSpring(y, { stiffness: 240, damping: 20 });

  return (
    <motion.button
      onClick={onClick}
      style={{ x: mx, y: my }}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.15);
        y.set((e.clientY - r.top - r.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'px-7 py-3.5 rounded-2xl font-black text-base tracking-tight transition-all',
        'focus-visible:outline-none focus-visible:ring-2',
        primary
          ? 'bg-[#60A5FA] text-[#0F172A] hover:opacity-90 shadow-[0_4px_24px_rgba(96,165,250,0.35)] focus-visible:ring-[#60A5FA]'
          : 'border-2 border-[#67E8F9]/50 text-[#67E8F9] bg-[#67E8F9]/10 hover:bg-[#67E8F9]/20 focus-visible:ring-[#67E8F9]',
        className
      )}
    >
      {children}
    </motion.button>
  );
};

// ── Marquee ───────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '🏫 Trusted by 2,400+ UK Schools',
  '🛡️ Every Tool Safety-Rated',
  '✅ GDPR Compliant',
  '🎯 Curriculum-Aligned Reviews',
  '👩‍🏫 Built by Educators',
  '📚 180+ Tools Reviewed',
  '🆓 Free Safety Guides',
  '🏆 Editor-Verified Picks',
];

const Marquee: FC = () => {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="hero-marquee w-full overflow-hidden py-3" aria-hidden="true">
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-slate-400 text-sm font-semibold px-8">
            {item}
            <span className="ml-8 text-slate-600">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Audience pills ────────────────────────────────────────────────────────────

const AUDIENCE = [
  { icon: '🧑‍🏫', label: 'Teachers' },
  { icon: '🎒',   label: 'Students' },
  { icon: '👨‍👩‍👧', label: 'Parents' },
  { icon: '🏫',   label: 'School Staff' },
];

// ── Stats ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2,400+',  label: 'UK Schools',       color: 'text-[#60A5FA]' },
  { value: '180+',    label: 'Tools Reviewed',    color: 'text-[#67E8F9]' },
  { value: '9.2/10',  label: 'Avg Safety Score',  color: 'text-[#60A5FA]' },
  { value: '12,000+', label: 'Educators',          color: 'text-[#67E8F9]' },
];

// ── Hero visual (dark cards) ──────────────────────────────────────────────────

const HeroVisual: FC = () => (
  <motion.div
    className="relative hidden lg:flex flex-col gap-3"
    initial={{ opacity: 0, x: 24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
    aria-hidden="true"
  >
    {/* Top card */}
    <motion.div
      className="bg-[#1E293B] border border-[#2D3F55] rounded-2xl p-5"
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(96,165,250,0.12)' }}
    >
      <div className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-widest mb-1">Active UK Schools</div>
      <div className="text-3xl font-black text-white tracking-tight">
        2,400 <span className="inline-block w-2 h-2 rounded-full bg-[#67E8F9] align-middle animate-pulse" />
      </div>
      <div className="text-xs text-slate-500 mt-0.5">Schools served this academic year</div>
    </motion.div>

    {/* Two small cards */}
    <div className="grid grid-cols-2 gap-3">
      <motion.div className="bg-[#1E293B] border border-[#2D3F55] rounded-2xl p-4" whileHover={{ y: -3 }}>
        <div className="text-[10px] font-bold text-[#67E8F9] uppercase tracking-widest mb-1">Tools Reviewed</div>
        <div className="text-2xl font-black text-white">180+</div>
        <div className="text-[11px] text-slate-500">Safety-rated & vetted</div>
      </motion.div>
      <motion.div className="bg-[#1E293B] border border-[#2D3F55] rounded-2xl p-4" whileHover={{ y: -3 }}>
        <div className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-widest mb-1">Safety Score</div>
        <div className="text-2xl font-black text-white">9.2<span className="text-sm text-slate-500">/10</span></div>
        <div className="text-[11px] text-slate-500">Editor-verified</div>
      </motion.div>
    </div>

    {/* AI indicator */}
    <motion.div className="bg-[#1E293B] border border-[#2D3F55] rounded-2xl p-4 flex items-center gap-3" whileHover={{ y: -3 }}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#67E8F9] flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#0F172A]" aria-hidden="true">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
        </svg>
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold text-white">AI Analysis Running</div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1">Checking latest tools<TypingDots /></div>
      </div>
    </motion.div>
  </motion.div>
);

// ── Main component ────────────────────────────────────────────────────────────

const Hero: FC<{ onExplore: () => void; onGuides: () => void }> = ({ onExplore, onGuides }) => (
  <section
    id="home"
    aria-labelledby="hero-heading"
    className="hero-dark relative overflow-hidden"
    style={{
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Dark overlay so text stays readable over the image */}
    <div className="absolute inset-0 bg-[#0F172A]/60 z-0" aria-hidden="true" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left: copy */}
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                             bg-[#60A5FA]/10 border border-[#60A5FA]/20 text-[#60A5FA] text-xs font-bold">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] flex-shrink-0"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              The UK's Trusted EdTech AI Resource
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white">
              Empower<br />
              Education<br />
              <span className="text-[#60A5FA]">with Safe</span><br />
              <span className="text-[#67E8F9]">AI Tools.</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-lg text-slate-400 leading-relaxed max-w-lg">
            The trusted UK resource for teachers, students, parents, and school staff navigating
            the AI revolution — with confidence, clarity, and care.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <MagneticBtn primary onClick={onExplore}>
              Explore AI Tools →
            </MagneticBtn>
            <MagneticBtn primary={false} onClick={onGuides}>
              Read Our Guides
            </MagneticBtn>
          </motion.div>

          {/* Audience pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            {AUDIENCE.map((a) => (
              <motion.span
                key={a.label}
                whileHover={{ scale: 1.05, y: -1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                           bg-[#1E293B] border border-[#2D3F55] text-slate-300 hover:text-white
                           hover:border-[#60A5FA]/30 transition-colors cursor-default"
              >
                <span>{a.icon}</span>{a.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4 pt-2 border-t border-[#2D3F55]">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className={cn('text-xl sm:text-2xl font-black tracking-tight', s.color)}>{s.value}</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: visual cards */}
        <HeroVisual />
      </div>
    </div>

    {/* Dark marquee strip — sits outside the z-10 wrapper so overlay doesn't affect it */}
    <div className="relative z-10">
      <Marquee />
    </div>
  </section>
);

export default Hero;
