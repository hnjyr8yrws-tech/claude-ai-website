/**
 * Reviews.tsx — Equipment Reviews for Schools
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const DEVICES = [
  {
    icon: '💻',
    name: 'Best Laptops for AI in Schools',
    desc: 'Our top-rated laptops for classroom use — chosen for performance, battery life, and compatibility with AI tools.',
    score: 9.4, scoreColor: '#22C55E',
    tags: [{ label: 'Value for Money', color: '#22C55E' }, { label: 'AI-Ready', color: '#3B82F6' }],
  },
  {
    icon: '📱',
    name: 'Best Tablets for Students',
    desc: 'From iPads to Android tablets — reviewed for safety controls, educational apps, and durability in school settings.',
    score: 9.1, scoreColor: '#3B82F6',
    tags: [{ label: 'Ages 7–18', color: '#3B82F6' }, { label: 'Recommended', color: '#22C55E' }],
    featured: true,
  },
  {
    icon: '♿',
    name: 'Accessibility Technology',
    desc: 'Screen readers, dictation tools, and assistive devices reviewed for SEND students and inclusive classrooms.',
    score: 9.6, scoreColor: '#8B5CF6',
    tags: [{ label: 'SEND', color: '#8B5CF6' }, { label: 'Inclusive', color: '#22C55E' }],
  },
  {
    icon: '🖥️',
    name: 'AI-Ready Classroom Devices',
    desc: 'Interactive whiteboards and shared devices built for the AI-enhanced classroom.',
    score: 8.9, scoreColor: '#F97316',
    tags: [{ label: 'School-Wide', color: '#F97316' }, { label: 'Interactive', color: '#8B5CF6' }],
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Reviews: FC = () => (
  <section id="reviews" aria-labelledby="reviews-heading" className="bg-[#FAFAFA] py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-amber-100">
          Equipment Reviews
        </span>
        <h2 id="reviews-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Equipment Reviews<br />
          <span className="text-brand-amber">for Schools</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Hardware reviewed for AI compatibility, safety controls, and real-world suitability in UK schools.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {DEVICES.map((device) => (
          <motion.div
            key={device.name}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-4 transition-shadow"
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl" aria-hidden="true">{device.icon}</span>
              <div className="text-right">
                <div className="text-xl font-black" style={{ color: device.scoreColor }}>{device.score}</div>
                <div className="text-[10px] text-gray-400">/ 10</div>
              </div>
            </div>
            <h3 className="text-base font-black text-ink leading-snug">{device.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{device.desc}</p>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
              {device.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: tag.color, backgroundColor: `${tag.color}15` }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3.5 rounded-2xl border-2 border-brand-amber text-brand-amber font-bold text-sm
                     hover:bg-brand-amber hover:text-white transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-amber"
        >
          Browse All Equipment Reviews →
        </motion.button>
      </motion.div>
    </div>
  </section>
);

export default Reviews;
