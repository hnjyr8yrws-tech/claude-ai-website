/**
 * Hero.tsx — GetPromptly.co.uk
 * "Stop Guessing with AI. Start Getting Promptly."
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const ROLES_LIST =
  'Leadership/SLT · Teaching & Curriculum · SEND/Inclusion · Safeguarding & Pastoral · Administration · Finance · HR · IT · Communications · Parents · Students';

interface HeroProps {
  onQuiz: () => void;
  onChecklist: () => void;
}

const Hero: FC<HeroProps> = ({ onQuiz, onChecklist }) => (
  <section
    id="hero"
    aria-labelledby="hero-heading"
    className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-teal-50/30 pt-20 pb-24"
  >
    {/* Decorative blobs */}
    <div aria-hidden="true" className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
    <div aria-hidden="true" className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
      <motion.div className="space-y-7" variants={container} initial="hidden" animate="visible">

        {/* Eyebrow */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                           bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold tracking-wide">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0"
              animate={{ scale: [1, 1.6, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            UK's Independent EdTech Resource — Free to Use
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9] text-ink"
        >
          Stop Guessing with AI.{' '}
          <br className="hidden sm:block" />
          <span className="text-brand-blue">Start Getting Promptly.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p variants={item} className="text-xl sm:text-2xl text-ink-mid leading-relaxed max-w-3xl mx-auto">
          Pass Ofsted checks. Get real results for every department, parent &amp; student across{' '}
          <span className="font-semibold text-ink">schools, colleges, unis &amp; apprenticeships.</span>
        </motion.p>

        {/* Supporting roles line */}
        <motion.p variants={item} className="text-sm text-ink-light max-w-2xl mx-auto leading-relaxed">
          Tools, prompts, safety scores &amp; equipment for{' '}
          <span className="text-ink font-medium">{ROLES_LIST}</span>
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onQuiz}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white text-base px-8 py-4 rounded-2xl font-bold shadow-card-blue"
          >
            Take the 60-Second Toolkit Quiz →
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onChecklist}
            className="text-base px-8 py-4 rounded-2xl font-bold border-2 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5"
          >
            Get Free AI Safety Checklist + 50 Prompts
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div variants={item} className="flex flex-wrap justify-center gap-6 pt-2">
          {[
            { value: '12,000+', label: 'UK Educators' },
            { value: '180+',    label: 'Tools Reviewed' },
            { value: '500+',    label: 'Free Prompts' },
            { value: '100%',    label: 'Independent' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-brand-blue">{s.value}</div>
              <div className="text-xs text-ink-light mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Affiliate disclosure */}
        <motion.p variants={item} className="text-[11px] text-ink-pale">
          Affiliate disclosure: Some links earn us a small commission at no extra cost to you. Our safety scores are always independent.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

export default Hero;
