/**
 * FinalCTASection.tsx — "Start using AI with confidence"
 * Clean, high-converting final CTA above the footer
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const FinalCTASection: FC<{ onExplore: () => void; onAssistant: () => void }> = ({ onExplore, onAssistant }) => (
  <section
    id="cta"
    aria-labelledby="cta-heading"
    className="py-20 sm:py-28 relative overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #f8faff 0%, #f3f0ff 50%, #f0fdfa 100%)' }}
  >
    {/* Subtle decorative circles */}
    <div
      aria-hidden="true"
      className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
    />
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
    />

    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {/* Label */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-semibold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" aria-hidden="true" />
          Ready to get started?
        </span>

        {/* Headline */}
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight"
        >
          Start using AI with{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            confidence
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          Trusted tools, free guides, and guided AI support — everything you need to use AI safely and effectively in education.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <motion.button
            onClick={onExplore}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl font-bold text-base text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]
                       shadow-lg shadow-blue-200 transition-all"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
          >
            Explore Trusted AI Tools →
          </motion.button>

          <motion.button
            onClick={onAssistant}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl font-bold text-base text-gray-700 bg-white
                       border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300
                       shadow-sm transition-all"
          >
            Get AI Support
          </motion.button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-5 pt-2">
          {[
            '✅ Carefully selected for education',
            '🛡️ Designed for safe and responsible use',
            '🆓 Free guides — no sign-up',
          ].map((item) => (
            <span key={item} className="text-xs text-gray-400 font-medium">{item}</span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTASection;
