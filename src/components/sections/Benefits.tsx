/**
 * Benefits.tsx — Trust bar
 * "Trusted by UK Teachers" · "50,000+ Education Pros" · "Curated by Real Ex-Teachers"
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const TRUST_ITEMS = [
  { icon: '🇬🇧', text: 'Trusted by UK Teachers & Schools' },
  { icon: '👥', text: '50,000+ Education Pros on Our List' },
  { icon: '🧑‍🏫', text: 'Curated by Real Ex-Teachers & Tech Experts' },
];

const Benefits: FC = () => (
  <section aria-label="Trust indicators" className="py-8 bg-white border-b border-gray-100">
    <div className="max-w-5xl mx-auto px-6">
      <motion.div
        className="flex flex-wrap justify-center gap-x-12 gap-y-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, staggerChildren: 0.08 }}
      >
        {TRUST_ITEMS.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <span aria-hidden="true">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Benefits;
