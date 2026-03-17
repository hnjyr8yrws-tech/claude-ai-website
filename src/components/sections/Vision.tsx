/**
 * Vision.tsx — Promptly's 2027 mission statement
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const Vision: FC = () => (
  <section id="vision" aria-labelledby="vision-heading" className="bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 sm:py-24">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block bg-white text-brand-blue text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
          Our Vision
        </span>
        <h2 id="vision-heading" className="text-3xl sm:text-4xl font-black text-ink tracking-tight leading-snug">
          Empowering Every UK Education Stakeholder by 2027
        </h2>
        <blockquote className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          By 2027, we want every teacher, leader, SENCO, finance manager, HR professional, administrator,
          IT lead, parent, and student across UK schools, colleges, universities, and apprenticeships to
          have access to{' '}
          <span className="font-bold text-ink">clear, safe, practical AI guidance</span>
          {' '}that helps them work smarter, safeguard effectively, and get results — regardless of their
          technical background, budget, or experience.
        </blockquote>
        <p className="text-sm text-brand-blue font-bold">
          — Donna, Chloe &amp; Charles
        </p>
      </motion.div>
    </div>
  </section>
);

export default Vision;
