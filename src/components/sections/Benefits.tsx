/**
 * Benefits.tsx — Why Schools Trust Promptly
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const TRUST_POINTS = [
  {
    icon: '🇬🇧',
    title: 'Built for UK Professionals',
    desc: 'Every prompt is written with UK context in mind — from curriculum standards for teachers to Companies House compliance for finance teams.',
    color: '#3B82F6',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: '✅',
    title: 'Tested by Real Practitioners',
    desc: "Our prompts are refined by the people who use them daily — teachers, finance managers, school leaders, and admin staff.",
    color: '#22C55E',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: '🏆',
    title: 'Independent — Never Sponsored',
    desc: 'No paid placements. No sponsored prompts. Our library is 100% editorially independent. What you see is what actually works.',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: '🚀',
    title: 'Save Hours Every Week',
    desc: 'Stop writing from scratch. Our prompts are structured to get Claude producing professional-quality output on the first try.',
    color: '#F97316',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Benefits: FC = () => (
  <section className="bg-[#FAFAFA] py-20 sm:py-24" aria-labelledby="trust-heading">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
          Why Promptly
        </span>
        <h2 id="trust-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Why UK Professionals<br />
          <span className="text-brand-blue">Choose Promptly</span>
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {TRUST_POINTS.map((point) => (
          <motion.div
            key={point.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className={`rounded-2xl border p-6 flex flex-col gap-4 transition-shadow hover:shadow-card-hover ${point.bg} ${point.border}`}
          >
            <span className="text-3xl" aria-hidden="true">{point.icon}</span>
            <h3 className="text-base font-black tracking-tight text-ink leading-snug">{point.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{point.desc}</p>
            <div className="h-0.5 rounded-full w-10" style={{ backgroundColor: point.color }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Benefits;
