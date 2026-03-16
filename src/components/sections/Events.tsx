/**
 * Events.tsx — Free AI Training for Schools
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const TRAINING = [
  {
    icon: '🏛️',
    title: 'Government AI Guidance',
    provider: 'DfE / DSIT',
    desc: 'Official UK government guidance on responsible AI use in education, covering data protection and implementation frameworks.',
    tag: 'Official', tagColor: '#1D4ED8', tagBg: '#EFF6FF',
    free: true,
  },
  {
    icon: '👩‍💻',
    title: 'Free Teacher Training',
    provider: 'FutureLearn & Oak National',
    desc: 'Free online CPD modules covering AI fundamentals, classroom applications, and ethical considerations for educators.',
    tag: 'Free CPD', tagColor: '#22C55E', tagBg: '#F0FDF4',
    free: true,
  },
  {
    icon: '🎓',
    title: 'Vendor AI Courses',
    provider: 'Google, Microsoft & more',
    desc: 'Free certification courses from major EdTech providers including Google for Education and Microsoft Educator Centre.',
    tag: 'Certificates', tagColor: '#8B5CF6', tagBg: '#F5F3FF',
    free: true,
  },
  {
    icon: '📍',
    title: 'Local Authority CPD',
    provider: 'Your LA & MAT',
    desc: 'Find AI training events and workshops run by your local authority, multi-academy trust, or regional school improvement team.',
    tag: 'In-Person', tagColor: '#F97316', tagBg: '#FFF7ED',
    free: false,
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Events: FC = () => (
  <section aria-labelledby="training-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-green-50 text-green-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-green-100">
          Professional Development
        </span>
        <h2 id="training-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Free AI Training<br />
          <span className="text-brand-green">for Schools</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          The best free training resources to help your school navigate AI with confidence.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {TRAINING.map((item) => (
          <motion.div
            key={item.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-3 transition-shadow"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              {item.free && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                  Free
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-ink leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{item.provider}</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{item.desc}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ color: item.tagColor, backgroundColor: item.tagBg }}
              >
                {item.tag}
              </span>
              <span className="text-xs font-bold text-gray-400">View →</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Events;
