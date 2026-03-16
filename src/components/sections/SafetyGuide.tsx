/**
 * SafetyGuide.tsx — Safety First
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const SAFETY_CHECKS = [
  {
    icon: '🔒',
    title: 'GDPR Compliance',
    desc: 'We verify data handling, storage location, and third-party sharing for every tool before listing it.',
    score: 95, color: '#22C55E', track: 'bg-green-100', fill: 'bg-green-500',
  },
  {
    icon: '🎓',
    title: 'Age-Appropriate Use',
    desc: 'Each tool is assessed for suitable age ranges and content appropriateness for UK school settings.',
    score: 92, color: '#3B82F6', track: 'bg-blue-100', fill: 'bg-blue-500',
  },
  {
    icon: '🏫',
    title: 'Classroom Safety',
    desc: 'We check safeguarding features, content filters, and reporting mechanisms built into the tool.',
    score: 90, color: '#8B5CF6', track: 'bg-purple-100', fill: 'bg-purple-500',
  },
  {
    icon: '🧑‍🏫',
    title: 'Teacher Control',
    desc: 'Tools must give teachers meaningful oversight — admin controls, monitoring, and the ability to restrict features.',
    score: 88, color: '#F97316', track: 'bg-orange-100', fill: 'bg-orange-500',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const SafetyGuide: FC = () => (
  <section id="safety" aria-labelledby="safety-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-green-50 text-green-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-green-100">
          Our Safety Framework
        </span>
        <h2 id="safety-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Safety First
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Every tool on Promptly passes our four-point safety framework — independently assessed before we publish any review.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {SAFETY_CHECKS.map((check) => (
          <motion.div
            key={check.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-4 transition-shadow"
          >
            <span className="text-3xl" aria-hidden="true">{check.icon}</span>
            <h3 className="text-base font-black text-ink leading-snug">{check.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{check.desc}</p>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-400 font-medium">Score</span>
                <span className="text-sm font-black" style={{ color: check.color }}>{check.score}%</span>
              </div>
              <div className={`w-full h-1.5 rounded-full ${check.track}`}>
                <motion.div
                  className={`h-1.5 rounded-full ${check.fill}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${check.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3.5 rounded-2xl border-2 border-brand-green text-brand-green font-bold text-sm
                     hover:bg-brand-green hover:text-white transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        >
          How We Calculate Safety Scores →
        </motion.button>
      </motion.div>
    </div>
  </section>
);

export default SafetyGuide;
