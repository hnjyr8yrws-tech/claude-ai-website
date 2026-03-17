/**
 * Benefits.tsx — Minimal trust bar
 * 3 stats only — icon + bold number + label. No prose.
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { icon: '🇬🇧', number: '12,000+', label: 'UK Educators' },
  { icon: '🛡️', number: '180+',    label: 'Tools Safety-Rated' },
  { icon: '🆓', number: '500+',    label: 'Free Prompts' },
];

const Benefits: FC = () => (
  <section aria-label="Trust indicators" className="py-6 bg-white border-b border-gray-100">
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <motion.div
        className="flex flex-wrap justify-center divide-x divide-gray-100"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {STATS.map((s, i) => (
          <div key={s.label} className={`flex items-center gap-3 px-8 py-2 ${i === 0 ? 'pl-0' : ''} ${i === STATS.length - 1 ? 'pr-0' : ''}`}>
            <span className="text-2xl" aria-hidden="true">{s.icon}</span>
            <div>
              <div className="text-xl font-black text-ink leading-none">{s.number}</div>
              <div className="text-xs text-ink-light mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Benefits;
