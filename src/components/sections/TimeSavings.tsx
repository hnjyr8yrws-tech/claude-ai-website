/**
 * TimeSavings.tsx — How AI Helps Teachers
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const USE_CASES = [
  {
    icon: '📝',
    title: 'Lesson Planning',
    desc: 'Generate fully structured lesson plans with objectives, activities, and differentiation in seconds.',
    color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-100',
  },
  {
    icon: '🎯',
    title: 'Differentiated Resources',
    desc: 'Adapt any text or task to multiple reading levels or learning needs without extra prep time.',
    color: '#22C55E', bg: 'bg-green-50', border: 'border-green-100',
  },
  {
    icon: '📊',
    title: 'Faster Marking',
    desc: 'AI-assisted feedback and marking rubrics reduce time on routine marking so you focus on teaching.',
    color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-100',
  },
  {
    icon: '❓',
    title: 'Quiz Generation',
    desc: 'Instantly create quizzes, exit tickets, and retrieval starters aligned to your topic.',
    color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-100',
  },
  {
    icon: '📋',
    title: 'Report Summaries',
    desc: 'Draft pupil progress reports faster using AI that captures key learning points in your own voice.',
    color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const TimeSavings: FC = () => (
  <section className="bg-[#FAFAFA] py-20 sm:py-24" aria-labelledby="ai-helps-heading">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-purple-50 text-purple-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-purple-100">
          Real Benefits
        </span>
        <h2 id="ai-helps-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          How AI Helps<br />
          <span className="text-brand-purple">Teachers</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Practical, time-saving applications that fit into real classroom life — not tech experiments.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {USE_CASES.map((uc) => (
          <motion.div
            key={uc.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className={`rounded-2xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-card-hover ${uc.bg} ${uc.border}`}
          >
            <span className="text-3xl" aria-hidden="true">{uc.icon}</span>
            <h3 className="text-sm font-black text-ink leading-snug">{uc.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed flex-1">{uc.desc}</p>
            <div className="h-0.5 rounded-full w-8" style={{ backgroundColor: uc.color }} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TimeSavings;
