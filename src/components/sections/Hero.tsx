/**
 * Hero.tsx — Promptly hero
 * "Trusted AI Tools for UK Schools"
 */

import React, { FC } from 'react';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/hero-bg.jpg';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ── CTA Button ─────────────────────────────────────────────────────────────────

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
          ? 'bg-[#60A5FA] text-[#0F172A] shadow-sky-glow hover:opacity-90 focus-visible:ring-[#60A5FA]'
          : 'border-2 border-[#67E8F9]/50 text-[#67E8F9] bg-[#67E8F9]/10 hover:bg-[#67E8F9]/20 focus-visible:ring-[#67E8F9]'
      )}
    >
      {children}
    </motion.button>
  );
};

// ── Audience pills ─────────────────────────────────────────────────────────────

const AUDIENCE = [
  { icon: '🧑‍🏫', label: 'Teachers' },
  { icon: '🎒',   label: 'Students' },
  { icon: '👨‍👩‍👧', label: 'Parents' },
  { icon: '🏫',   label: 'School Staff' },
];

// ── Stats ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2,400+',  label: 'UK Schools',     color: 'text-[#60A5FA]' },
  { value: '180+',    label: 'Tools Reviewed',  color: 'text-[#67E8F9]' },
  { value: '9.2/10',  label: 'Safety Score',    color: 'text-[#60A5FA]' },
  { value: '100%',    label: 'Independent',     color: 'text-[#67E8F9]' },
];

// ── Marquee ────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '🏫 Trusted by UK Schools',
  '🛡️ Safety-Rated Tools',
  '✅ GDPR Compliant',
  '🎯 Curriculum-Aligned',
  '👩‍🏫 Built by Educators',
  '📚 180+ Tools Reviewed',
  '🆓 Free Safety Guides',
  '🏆 Independent Reviews',
];

const Marquee: FC = () => {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="hero-marquee w-full overflow-hidden py-3 relative" aria-hidden="true">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#1E293B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#1E293B] to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-slate-300 text-sm font-medium px-8">
            {item}
            <span className="ml-8 text-slate-500">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────────

const Hero: FC<{ onExplore: () => void; onGuides: () => void }> = ({ onExplore, onGuides }) => (
  <section
    id="home"
    aria-labelledby="hero-heading"
    className="hero-dark relative overflow-hidden"
    style={{
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-[#0F172A]/65 z-0" aria-hidden="true" />

    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
      <motion.div
        className="space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants}>
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
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92] text-white"
        >
          Trusted AI Tools<br />
          <span className="text-[#60A5FA]">for UK Schools</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
          Independent reviews, safety guides, and practical AI tools for teachers, students, and parents.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
          <CTAButton primary onClick={onExplore}>Explore AI Tools →</CTAButton>
          <CTAButton primary={false} onClick={onGuides}>Read Our Guides</CTAButton>
        </motion.div>

        {/* Audience pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
          {AUDIENCE.map((a) => (
            <motion.span
              key={a.label}
              whileHover={{ scale: 1.05, y: -1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                         bg-[#1E293B] border border-[#2D3F55] text-slate-300 hover:text-white
                         hover:border-[#60A5FA]/30 transition-colors cursor-default"
            >
              <span>{a.icon}</span>{a.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-4 gap-4 pt-6 border-t border-[#2D3F55] max-w-xl mx-auto"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className={cn('text-xl sm:text-2xl font-black tracking-tight', s.color)}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>

    <div className="relative z-10">
      <Marquee />
    </div>
    {/* Gradient bridge: dark navy → cream */}
    <div className="relative z-10 h-10 bg-gradient-to-b from-[#1E293B] to-[#FAFAFA]" aria-hidden="true" />
  </section>
);

export default Hero;
