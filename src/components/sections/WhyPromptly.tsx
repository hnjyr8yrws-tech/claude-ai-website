/**
 * WhyPromptly.tsx — 6 benefit cards
 * Notion-style bento grid: bold solid colour backgrounds, white text
 * First card spans 2 columns on desktop (wide card)
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const BENEFITS = [
  {
    icon: '🎯',
    title: 'Ofsted-Ready',
    desc: 'Every recommendation maps to Ofsted inspection frameworks. Walk into any inspection with confidence.',
    bg: '#DBEAFE', text: '#1E3A8A', sub: '#3B5FAD',   // pastel blue
    wide: true,
  },
  {
    icon: '🛡️',
    title: 'Safety-First',
    desc: 'Tools checked for GDPR, age-appropriateness, data storage, and safeguarding — every time.',
    bg: '#DCFCE7', text: '#14532D', sub: '#166534',   // pastel green
    wide: false,
  },
  {
    icon: '🧑‍🏫',
    title: 'Made by Educators',
    desc: "Donna has 14+ years in UK classrooms. Every review is grounded in real teaching experience.",
    bg: '#EDE9FE', text: '#3B0764', sub: '#6D28D9',   // pastel purple
    wide: false,
  },
  {
    icon: '🆓',
    title: 'Free to Start',
    desc: '50 role-specific prompts + AI Safety Checklist — no credit card, no paywall.',
    bg: '#FFEDD5', text: '#7C2D12', sub: '#C2410C',   // pastel orange
    wide: false,
  },
  {
    icon: '📊',
    title: 'Role-Specific',
    desc: 'Guides for Teaching, SEND, Finance, HR, IT, Leadership, Parents and Students.',
    bg: '#FEF9C3', text: '#713F12', sub: '#A16207',   // pastel amber
    wide: false,
  },
  {
    icon: '🏆',
    title: '100% Independent',
    desc: 'No sponsored listings. No paid rankings. Our safety scores are never for sale.',
    bg: '#CCFBF1', text: '#134E4A', sub: '#0F766E',   // pastel teal
    wide: true,
  },
] as const;

const WhyPromptly: FC = () => (
  <section id="why" aria-labelledby="why-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="why-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Why UK Schools Trust{' '}
          <span className="text-brand-blue">Promptly</span>
        </h2>
      </motion.div>

      {/* Bento grid — wide cards span 2 cols on md+ */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {BENEFITS.map((b) => (
          <motion.div
            key={b.title}
            variants={{
              hidden:  { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={b.wide ? 'lg:col-span-2' : ''}
          >
            <div
              className="h-full rounded-2xl p-7 flex flex-col gap-4 min-h-[180px]"
              style={{ backgroundColor: b.bg }}
            >
              <span className="text-4xl" aria-hidden="true">{b.icon}</span>
              <h3 className="text-xl font-black leading-tight" style={{ color: b.text }}>{b.title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: b.sub }}>{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyPromptly;
