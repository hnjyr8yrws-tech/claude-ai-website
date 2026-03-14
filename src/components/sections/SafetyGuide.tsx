/**
 * SafetyGuide.tsx — Safety Guide with shadcn Accordion
 * Pastel accent blocks · animated score Progress bar
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const itemVariants: Variants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ── Typing dots ────────────────────────────────────────────────────────────────
const TypingDots: FC = () => (
  <span className="inline-flex items-center gap-1" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.span key={i}
        className="block w-1.5 h-1.5 rounded-full bg-brand-green"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
    ))}
  </span>
);

// ── Data ───────────────────────────────────────────────────────────────────────
interface Module {
  value: string;
  icon: string;
  title: string;
  accentColor: string;
  pastelBg: string;
  pastelBorder: string;
  progressClass: string;
  score: number;
  items: string[];
}

const MODULES: Module[] = [
  {
    value: 'gdpr',
    icon: '🛡️', title: 'Data Protection & GDPR',
    accentColor: '#3B82F6', pastelBg: 'bg-pastel-blue/30', pastelBorder: 'border-blue-200',
    progressClass: 'bg-blue-400', score: 95,
    items: [
      'Only use tools with a school Data Processing Agreement',
      'Never enter pupil personal data into public AI tools',
      'Ensure student accounts use school-managed credentials',
      'Run annual DPIA for high-risk tools',
      'Delete student data within 30 days of leaving',
    ],
  },
  {
    value: 'bias',
    icon: '⚖️', title: 'Bias Mitigation',
    accentColor: '#F97316', pastelBg: 'bg-pastel-yellow/40', pastelBorder: 'border-orange-200',
    progressClass: 'bg-orange-400', score: 88,
    items: [
      'Test AI tools across diverse student groups before rollout',
      'Scrutinise AI-generated content for cultural stereotypes',
      'Avoid tools that use demographic data in scoring algorithms',
      'Review AI outputs regularly with a DEI lens',
      'Report bias incidents to the tool provider in writing',
    ],
  },
  {
    value: 'age',
    icon: '👶', title: 'Age-Appropriate Technology',
    accentColor: '#8B5CF6', pastelBg: 'bg-pastel-purple/30', pastelBorder: 'border-purple-200',
    progressClass: 'bg-purple-400', score: 92,
    items: [
      'Under-13s must not use tools requiring adult consent (UK GDPR Art. 8)',
      'Use tools with built-in content filtering for KS1/2',
      'Avoid generative AI image tools with primary-age students',
      'Enable SafeSearch on all school devices',
      'Review age ratings annually as tools update their policies',
    ],
  },
  {
    value: 'cyber',
    icon: '🔐', title: 'Cyber Hygiene',
    accentColor: '#22C55E', pastelBg: 'bg-pastel-green/30', pastelBorder: 'border-green-200',
    progressClass: 'bg-green-400', score: 90,
    items: [
      'Enable MFA on all staff accounts',
      'Unique password per educational platform',
      'Never share class login credentials via email',
      'Log out of shared devices after every session',
      'Annual cyber safety training for all staff',
    ],
  },
];

const DOWNLOADS = [
  { label: 'Download for Educators', color: '#3B82F6', bg: 'bg-pastel-blue/40 hover:bg-pastel-blue/70' },
  { label: 'Download for Parents',   color: '#22C55E', bg: 'bg-pastel-green/40 hover:bg-pastel-green/70' },
  { label: 'Download for Governors', color: '#8B5CF6', bg: 'bg-pastel-purple/40 hover:bg-pastel-purple/70' },
];

// ── Main component ─────────────────────────────────────────────────────────────
const SafetyGuide: FC = () => (
  <section id="safety" aria-labelledby="safety-heading" className="bg-[#FAFAFA] py-20 sm:py-24">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <div className="inline-block bg-pastel-green/50 text-green-700 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
          Safety Guide
        </div>
        <h2 id="safety-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Using AI Safely<br />
          <span className="text-brand-green">in Education</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm">
          Four modules covering data protection, bias, age-appropriateness, and cyber hygiene.
          Downloadable PDF for schools, parents, and governors.
        </p>
      </motion.div>

      {/* shadcn Accordion for modules */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden mb-10"
      >
        <Accordion type="multiple" className="divide-y divide-gray-100">
          {MODULES.map((mod) => (
            <AccordionItem key={mod.value} value={mod.value} className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50">
                <div className="flex items-center gap-3 text-left">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${mod.pastelBg} border ${mod.pastelBorder}`}>
                    {mod.icon}
                  </span>
                  <div>
                    <div className="text-sm font-black text-ink">{mod.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={mod.score} indicatorClassName={mod.progressClass}
                        className="w-24 h-1.5" />
                      <span className="text-[10px] font-bold" style={{ color: mod.accentColor }}>{mod.score}%</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <motion.ul className="space-y-2 pl-12" variants={containerVariants} initial="hidden" animate="visible">
                  {mod.items.map((item) => (
                    <motion.li key={item} variants={itemVariants}
                      className="flex gap-2 text-xs text-gray-500 items-start">
                      <span className="font-black flex-shrink-0 mt-0.5" style={{ color: mod.accentColor }}>✓</span>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Download CTA */}
      <motion.div
        className="bg-white rounded-3xl border-l-4 border-brand-green p-7 sm:p-10 shadow-card"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.2 }}
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
              Includes printable checklists, scenario-based examples, and a parent-friendly version.
              Free for all UK schools and families.
            </p>
            <div className="flex flex-wrap gap-3">
              {DOWNLOADS.map((d) => (
                <motion.div key={d.label} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Button variant="outline" size="sm"
                    className={`rounded-xl border text-xs font-black transition-all ${d.bg}`}
                    style={{ borderColor: `${d.color}40`, color: d.color } as React.CSSProperties}>
                    {d.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Overall score */}
          <div className="flex flex-col items-center gap-2 text-center flex-shrink-0">
            <div className="text-4xl font-black text-brand-green">9.2</div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">/10 Safety</div>
            <Progress value={92} indicatorClassName="bg-green-400" className="w-24" />
            <div className="text-[10px] text-gray-400">Editor-verified</div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default SafetyGuide;
