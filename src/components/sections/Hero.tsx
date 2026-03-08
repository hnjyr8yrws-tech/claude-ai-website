/**
 * Hero.tsx — getpromptly.co.uk
 * Light cream bg · shadcn Button + Badge · Framer Motion · marquee tagline
 */

import React, { FC } from 'react';
import { motion, Variants, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Variants ─────────────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingDots: FC = () => (
  <span className="inline-flex items-center gap-1 align-middle ml-1" role="img" aria-label="AI active">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="block w-1.5 h-1.5 rounded-full bg-brand-blue"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
    ))}
  </span>
);

// ─── Magnetic button wrapper (keeps cursor-tracking on shadcn Button) ─────────

const MagneticBtn: FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ink';
  className?: string;
}> = ({ children, onClick, variant = 'default', className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 240, damping: 20 });
  const my = useSpring(y, { stiffness: 240, damping: 20 });

  return (
    <motion.div
      style={{ x: mx, y: my }}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.15);
        y.set((e.clientY - r.top - r.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button variant={variant} size="lg" onClick={onClick} className={className}>
        {children}
      </Button>
    </motion.div>
  );
};

// ─── Marquee ──────────────────────────────────────────────────────────────────

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
    <div className="w-full overflow-hidden bg-brand-blue py-3" aria-hidden="true">
      <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-white text-sm font-semibold px-8">
            {item}
            <span className="ml-8 text-white/30">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Audience pills ───────────────────────────────────────────────────────────

const AUDIENCE = [
  { icon: '🧑‍🏫', label: 'Teachers',    variant: 'blue'   as const },
  { icon: '🎒',   label: 'Students',    variant: 'green'  as const },
  { icon: '👨‍👩‍👧', label: 'Parents',     variant: 'purple' as const },
  { icon: '🏫',   label: 'School Staff',variant: 'orange' as const },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2,400+',  label: 'UK Schools',       color: 'text-brand-blue' },
  { value: '180+',    label: 'Tools Reviewed',   color: 'text-brand-green' },
  { value: '9.2/10',  label: 'Avg Safety Score', color: 'text-brand-purple' },
  { value: '12,000+', label: 'Educators',         color: 'text-brand-orange' },
];

// ─── Hero visual ──────────────────────────────────────────────────────────────

const HeroVisual: FC = () => (
  <motion.div
    className="relative hidden lg:flex flex-col gap-3"
    initial={{ opacity: 0, x: 24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
    aria-hidden="true"
  >
    <motion.div
      className="card-light p-5 rounded-2xl"
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(59,130,246,0.15)' }}
    >
      <div className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-1">Active UK Schools</div>
      <div className="text-3xl font-black text-ink tracking-tight">
        2,400 <span className="inline-block w-2 h-2 rounded-full bg-brand-green align-middle animate-pulse" />
      </div>
      <div className="text-xs text-gray-400 mt-0.5">Schools served this academic year</div>
    </motion.div>

    <div className="grid grid-cols-2 gap-3">
      <motion.div className="card-light p-4 rounded-2xl" whileHover={{ y: -3 }}>
        <div className="text-[10px] font-bold text-brand-green uppercase tracking-widest mb-1">Tools Reviewed</div>
        <div className="text-2xl font-black text-ink">180+</div>
        <div className="text-[11px] text-gray-400">Safety-rated & vetted</div>
      </motion.div>
      <motion.div className="card-light p-4 rounded-2xl" whileHover={{ y: -3 }}>
        <div className="text-[10px] font-bold text-brand-purple uppercase tracking-widest mb-1">Safety Score</div>
        <div className="text-2xl font-black text-ink">9.2<span className="text-sm text-gray-400">/10</span></div>
        <div className="text-[11px] text-gray-400">Editor-verified</div>
      </motion.div>
    </div>

    <motion.div className="card-light p-4 rounded-2xl flex items-center gap-3" whileHover={{ y: -3 }}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white" aria-hidden="true">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
        </svg>
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold text-ink">AI Analysis Running</div>
        <div className="text-[11px] text-gray-400 flex items-center gap-1">Checking latest tools<TypingDots /></div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const Hero: FC<{ onExplore: () => void; onGuides: () => void }> = ({ onExplore, onGuides }) => (
  <section id="home" aria-labelledby="hero-heading" className="bg-cream">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
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
            <Badge variant="blue" className="text-[11px] px-3.5 py-1.5 rounded-full gap-2">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              The UK's Trusted EdTech AI Resource
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h1 id="hero-heading" className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-ink">
              Empower<br />
              Education<br />
              <span className="text-brand-blue">with Safe</span><br />
              <span className="text-brand-green">AI Tools.</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-lg text-gray-500 leading-relaxed max-w-lg">
            The trusted UK resource for teachers, students, parents, and school staff navigating
            the AI revolution — with confidence, clarity, and care.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <MagneticBtn variant="default" onClick={onExplore}>
              Explore AI Tools →
            </MagneticBtn>
            <MagneticBtn variant="ink" onClick={onGuides}>
              Read Our Guides
            </MagneticBtn>
          </motion.div>

          {/* Audience pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            {AUDIENCE.map((a) => (
              <motion.div key={a.label} whileHover={{ scale: 1.05, y: -1 }}>
                <Badge variant={a.variant} className="px-3 py-1.5 text-xs rounded-full gap-1.5 cursor-default">
                  <span>{a.icon}</span>{a.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4 pt-2 border-t border-gray-100">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className={cn('text-xl sm:text-2xl font-black tracking-tight', s.color)}>{s.value}</div>
                <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: visual cards */}
        <HeroVisual />
      </div>
    </div>

    <Marquee />
  </section>
);

export default Hero;
