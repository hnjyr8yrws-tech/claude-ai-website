/**
 * Hero.tsx — GetPromptly.co.uk
 * "Empower Your School with AI"
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Hero: FC<{ onExplore: () => void; onGuides: () => void }> = ({ onExplore, onGuides }) => (
  <section
    id="home"
    aria-labelledby="hero-heading"
    className="relative overflow-hidden"
    style={{
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 to-[#1E3A5F]/85 z-0" aria-hidden="true" />

    <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold leading-tight text-white tracking-tight"
        >
          Empower Your School with AI<br />
          <span className="text-[#2DD4BF]">— Fast, Professional, No Expertise Needed</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Best AI tools, training courses &amp; IT equipment for UK teachers, admins, finance teams &amp; trust leaders.
          Save hours every week and look professional instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onExplore}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold text-lg
                       transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
          >
            Browse AI Tools Now
          </motion.button>
          <motion.button
            onClick={onGuides}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl border-2 border-white/50 text-white font-semibold text-lg
                       hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Shop IT Equipment
          </motion.button>
        </motion.div>

        {/* Affiliate disclosure */}
        <motion.p variants={itemVariants} className="text-xs text-white/60">
          Affiliate disclosure: We earn a commission on qualifying purchases at no extra cost to you.
        </motion.p>
      </motion.div>
    </div>

    {/* Gradient bridge */}
    <div className="relative z-10 h-8 bg-gradient-to-b from-[#0F172A]/0 to-white" aria-hidden="true" />
  </section>
);

export default Hero;
