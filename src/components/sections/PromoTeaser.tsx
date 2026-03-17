/**
 * PromoTeaser.tsx — AI Prompts for Schools teaser
 * Teal background, subtle link to the prompts section
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const PromoTeaser: FC = () => (
  <section id="prompts" aria-labelledby="prompts-teaser-heading" className="py-16 bg-teal-50">
    <div className="max-w-2xl mx-auto px-6 text-center">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-teal-100 text-teal-800 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full border border-teal-200">
          Free Bonus
        </span>
        <h2 id="prompts-teaser-heading" className="text-3xl font-bold text-gray-900">
          Free Bonus: AI Prompts for Schools
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Quick, ready-to-use prompts to save time on lesson plans, reports, parent emails &amp; more.
        </p>
        <motion.a
          href="/prompts"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block px-8 py-3.5 rounded-xl border-2 border-teal-600 text-teal-700 font-semibold
                     hover:bg-teal-600 hover:text-white transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          Browse Prompts Free →
        </motion.a>
      </motion.div>
    </div>
  </section>
);

export default PromoTeaser;
