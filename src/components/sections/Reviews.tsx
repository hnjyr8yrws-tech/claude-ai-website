/**
 * Reviews.tsx — Equipment Reviews
 * Light card style · specs table · affiliate disclaimers · safety checklist · hover lifts
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ─── Affiliate tag ────────────────────────────────────────────────────────────

const AffiliateTag: FC = () => (
  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
    🔗 Affiliate link — no extra cost to you
  </span>
);

// ─── Score ring ───────────────────────────────────────────────────────────────

const ScoreRing: FC<{ score: number; color: string }> = ({ score, color }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80" aria-label={`Score: ${score}`}>
        <circle cx="40" cy="40" r="34" fill="none" stroke="#F3F4F6" strokeWidth="8" />
        <motion.circle
          cx="40" cy="40" r="34"
          fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 34}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
          whileInView={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - score / 10) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-black text-ink">{score}</span>
      </div>
    </div>
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill="#F59E0B" aria-hidden="true">
          <path d="M6 1l1.4 2.9L11 4.4l-2.5 2.4.6 3.4L6 8.7l-3.1 1.5.6-3.4L1 4.4l3.6-.5z"/>
        </svg>
      ))}
    </div>
    <span className="text-[10px] text-gray-400">Overall</span>
  </div>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const SPECS = [
  { spec: 'Display',        detail: '10.9" Liquid Retina, 2360×1640',   note: 'Excellent for extended reading' },
  { spec: 'Chip',           detail: 'Apple A14 Bionic',                  note: 'Runs all major AI education apps' },
  { spec: 'Storage',        detail: '64 GB / 256 GB',                    note: '64 GB fine for most workflows' },
  { spec: 'Connectivity',   detail: 'Wi-Fi 6, optional 5G',              note: 'Handles dense classroom networks' },
  { spec: 'Battery',        detail: 'Up to 10 hours',                    note: 'Full school day on one charge' },
  { spec: 'Education Price',detail: 'From £339 (EDU)',                   note: 'Apple School Manager supported' },
];

const AI_CHECKLIST = [
  'Siri Shortcuts automate classroom routines',
  'Supports Khanmigo, Century Tech, Duolingo Max natively',
  'Apple Intelligence (iPadOS 18) adds writing tools',
  'Core ML enables on-device AI — data stays on device',
  'ARKit enables immersive science experiences',
];

const SAFETY_CHECKLIST = [
  'Screen Time controls: app limits, comms restrictions',
  'Apple School Manager: zero-touch MDM deployment',
  'Managed Apple IDs prevent personal account mixing',
  'Safari SafeSearch auto-enabled in managed mode',
  'No biometric data stored on servers',
];

const SUITABILITY = [
  { role: 'Teachers', score: '✓✓✓', color: '#3B82F6', note: 'Lesson planning, annotation, marking with Apple Pencil' },
  { role: 'Students', score: '✓✓✓', color: '#22C55E', note: 'Note-taking, creative projects, adaptive learning apps' },
  { role: 'SEND',     score: '✓✓✓', color: '#8B5CF6', note: 'Best-in-class accessibility suite built in' },
  { role: 'Admin',    score: '✓✓',  color: '#F97316', note: 'Good for forms & comms; less for heavy office work' },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const Reviews: FC = () => (
  <section id="reviews" aria-labelledby="reviews-heading"
           className="bg-white border-y border-gray-100 py-20 sm:py-24">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">

      {/* Section header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[10px] font-black tracking-[0.2em] text-brand-orange uppercase mb-3 block">
          Equipment Reviews
        </span>
        <h2 id="reviews-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Hardware Reviewed<br />
          <span className="text-brand-orange">for the Classroom</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm">
          Every device tested for AI integration, safety controls, value, and real-world classroom suitability.
        </p>
      </motion.div>

      {/* Featured review */}
      <motion.div
        className="card-light rounded-3xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className="p-6 sm:p-8 space-y-8">

          {/* Review header */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Hardware Review', color: '#F97316', bg: '#FFF7ED' },
                  { label: 'Recommended',     color: '#22C55E', bg: '#F0FDF4' },
                  { label: 'Ages 7–18',        color: '#3B82F6', bg: '#EFF6FF' },
                  { label: 'AI-Ready',         color: '#8B5CF6', bg: '#F5F3FF' },
                ].map((b) => (
                  <span key={b.label} className="text-[9px] font-black px-2.5 py-1 rounded-full border"
                        style={{ color: b.color, backgroundColor: b.bg, borderColor: `${b.color}30` }}>
                    {b.label}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-ink leading-tight">
                Apple iPad (10th Generation)<br />
                <span className="text-gray-400 text-xl font-bold">Education Edition</span>
              </h3>
              <p className="text-xs text-gray-400">Reviewed by our editorial team · Last updated: January 2025</p>
              <AffiliateTag />
            </div>
            <ScoreRing score={9.3} color="#22C55E" />
          </motion.div>

          {/* Specs table */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-black text-ink uppercase tracking-widest mb-3">Quick Specs</h4>
            <div className="rounded-2xl overflow-hidden border border-gray-100">
              <table className="w-full text-xs" aria-label="iPad specifications">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-gray-500 font-bold">Spec</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-bold">Detail</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-bold hidden sm:table-cell">Education Note</th>
                  </tr>
                </thead>
                <tbody>
                  {SPECS.map((row, i) => (
                    <motion.tr
                      key={row.spec}
                      className="border-t border-gray-50 hover:bg-blue-50/40 transition-colors"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="px-4 py-3 font-bold text-ink">{row.spec}</td>
                      <td className="px-4 py-3 text-gray-600">{row.detail}</td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{row.note}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Detail panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <motion.div variants={itemVariants} className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <h4 className="text-xs font-black text-green-700 mb-3">🎯 AI Integration</h4>
              <ul className="space-y-2">
                {AI_CHECKLIST.map((item) => (
                  <li key={item} className="text-xs text-green-800 flex gap-2 items-start">
                    <span className="text-brand-green font-black flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
              <h4 className="text-xs font-black text-purple-700 mb-3">🛡️ Safety Considerations</h4>
              <ul className="space-y-2">
                {SAFETY_CHECKLIST.map((item) => (
                  <li key={item} className="text-xs text-purple-800 flex gap-2 items-start">
                    <span className="text-brand-purple font-black flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h4 className="text-xs font-black text-blue-700 mb-3">👥 User Suitability</h4>
              <div className="space-y-2.5">
                {SUITABILITY.map((s) => (
                  <div key={s.role} className="flex items-start gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0"
                          style={{ color: s.color, backgroundColor: `${s.color}18` }}>
                      {s.role} {s.score}
                    </span>
                    <span className="text-[10px] text-blue-700 leading-snug">{s.note}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h4 className="text-xs font-black text-amber-700 mb-3">💰 Pricing & Value</h4>
              <ul className="space-y-2">
                {[
                  'Standard Education: from £339 per unit',
                  'School bundles (10+): 5–8% additional discount',
                  'AppleCare+ for Education: ~£29/yr',
                  '9th Gen from £269 — still excellent value',
                  'Refurb via Apple EDU: from £259 with 1yr warranty',
                ].map((item) => (
                  <li key={item} className="text-xs text-amber-800 flex gap-2 items-start">
                    <span className="text-amber-600 font-black flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Verdict */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-black text-ink uppercase tracking-widest mb-3">📝 Editor's Verdict</h4>
            <blockquote className="border-l-4 border-brand-green pl-4 py-1 bg-green-50/50 rounded-r-xl">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "The iPad remains the gold standard for K-12 education technology. Its combination of robust
                parental controls, best-in-class accessibility features, and an enormous library of
                curriculum-aligned apps makes it the safest and most versatile choice for UK schools in 2025."
              </p>
            </blockquote>
          </motion.div>

          {/* Affiliate buy buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(217,119,6,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 rounded-xl text-sm font-black text-white bg-[#D97706]
                         transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
            >
              Buy via Apple Education [Affiliate] →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 rounded-xl text-sm font-black text-white bg-[#F59E0B]
                         transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
            >
              View on Amazon [Affiliate] →
            </motion.button>
          </motion.div>
          <p className="text-[10px] text-gray-400">
            🔗 Affiliate links — clicking costs you nothing extra. Commissions help fund independent reviews.
          </p>
        </div>
      </motion.div>

      {/* Browse more */}
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
          className="px-8 py-3.5 rounded-2xl border-2 border-[#D97706] text-[#D97706] font-black text-sm
                     hover:bg-[#D97706] hover:text-white transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
        >
          Browse All Equipment Reviews →
        </motion.button>
      </motion.div>
    </div>
  </section>
);

export default Reviews;
