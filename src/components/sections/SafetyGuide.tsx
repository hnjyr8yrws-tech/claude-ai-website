/**
 * SafetyGuide.tsx — Safety Guide Teaser
 * Light theme · 4 modules · animated checklists · download CTA
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ─── Typing dots ───────────────────────────────────────────────────────────────

const TypingDots: FC = () => (
  <span className="inline-flex items-center gap-1" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="block w-1.5 h-1.5 rounded-full bg-brand-green"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
    ))}
  </span>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Module {
  icon: string;
  title: string;
  color: string;
  bg: string;
  border: string;
  items: string[];
}

const MODULES: Module[] = [
  {
    icon: '🛡️',
    title: 'Data Protection & GDPR',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    items: [
      'Only use tools with a school Data Processing Agreement',
      'Never enter pupil personal data into public AI tools',
      'Ensure student accounts use school-managed credentials',
      'Run annual DPIA for high-risk tools',
    ],
  },
  {
    icon: '⚖️',
    title: 'Bias Mitigation',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FED7AA',
    items: [
      'Test AI tools across diverse student groups before rollout',
      'Scrutinise AI-generated content for cultural stereotypes',
      'Avoid tools that use demographic data in scoring algorithms',
      'Review AI outputs regularly with a DEI lens',
    ],
  },
  {
    icon: '👶',
    title: 'Age-Appropriate Technology',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    items: [
      'Under-13s must not use tools requiring adult consent',
      'Use tools with built-in content filtering for KS1/2',
      'Enable SafeSearch on all school devices',
      'Review age ratings annually as tools update their policies',
    ],
  },
  {
    icon: '🔐',
    title: 'Cyber Hygiene',
    color: '#22C55E',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    items: [
      'Enable MFA on all staff accounts',
      'Unique password per educational platform',
      'Log out of shared devices after every session',
      'Annual cyber safety training for all staff',
    ],
  },
];

const DOWNLOADS = [
  { label: 'Download for Educators', color: '#3B82F6' },
  { label: 'Download for Parents',   color: '#22C55E' },
  { label: 'Download for Governors', color: '#8B5CF6' },
];

// ─── Module card ───────────────────────────────────────────────────────────────

const ModuleCard: FC<{ module: Module }> = ({ module }) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
    className="card-light rounded-2xl p-5 flex flex-col gap-4"
    style={{ borderTop: `3px solid ${module.color}` }}
    role="region"
    aria-label={module.title}
  >
    <div className="flex items-center gap-2">
      <span className="text-xl" aria-hidden="true">{module.icon}</span>
      <h3 className="text-sm font-black text-ink">{module.title}</h3>
    </div>
    <motion.ul
      className="space-y-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {module.items.map((item) => (
        <motion.li key={item} variants={itemVariants} className="flex gap-2 text-xs text-gray-500 items-start">
          <span className="font-black flex-shrink-0" style={{ color: module.color }}>✓</span>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
);

// ─── Main component ────────────────────────────────────────────────────────────

const SafetyGuide: FC = () => (
  <section id="safety" aria-labelledby="safety-heading"
           className="bg-cream-warm py-20 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[10px] font-black tracking-[0.2em] text-brand-green uppercase mb-3 block">
          Safety Guide
        </span>
        <h2 id="safety-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Using AI Safely<br />
          <span className="text-brand-green">in Education</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm">
          A structured, downloadable resource for parents and educators. Covers data protection,
          bias, age-appropriateness, and cyber hygiene.
        </p>
      </motion.div>

      {/* Module grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {MODULES.map((mod) => (
          <ModuleCard key={mod.title} module={mod} />
        ))}
      </motion.div>

      {/* Download CTA */}
      <motion.div
        className="card-light rounded-3xl p-7 sm:p-10 border-t-4 border-brand-green"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">📥</span>
              <div>
                <h3 className="text-xl font-black text-ink">Download This Guide as a PDF</h3>
                <div className="flex items-center gap-2 mt-1">
                  <TypingDots />
                  <span className="text-[11px] text-brand-green font-semibold">AI-verified safety checklist</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
              The full Safety &amp; Ethics Guide includes printable checklists, scenario-based examples,
              and a parent-friendly version. Available free to schools and families.
            </p>
            <div className="flex flex-wrap gap-3">
              {DOWNLOADS.map((d) => (
                <motion.button
                  key={d.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black border transition-all
                             focus-visible:outline-none focus-visible:ring-2"
                  style={{ color: d.color, borderColor: `${d.color}50`, backgroundColor: `${d.color}10` }}
                >
                  {d.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Safety score */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-4xl font-black text-brand-green">9.2</div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">/10 Safety</div>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-green rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '92%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <div className="text-[10px] text-gray-400">Editor-verified</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default SafetyGuide;
