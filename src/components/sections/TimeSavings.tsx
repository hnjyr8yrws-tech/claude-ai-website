/**
 * TimeSavings.tsx — How AI Saves Time
 * DARK navy section background — strong visual break from white sections
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const ROLES = [
  {
    icon: '🧑‍🏫', role: 'Teachers',
    stat: '5 hrs', statLabel: 'saved/week',
    examples: ['Lesson plans in 2 minutes', 'Differentiated worksheets instantly', 'Report comments at scale'],
    accent: '#60A5FA',   // sky blue
  },
  {
    icon: '🏆', role: 'Leadership & SLT',
    stat: '4 hrs', statLabel: 'saved/week',
    examples: ['SIP and SEF first drafts', 'Ofsted evidence packs', 'Strategy and governor reports'],
    accent: '#A78BFA',   // violet
  },
  {
    icon: '🤝', role: 'SEND Coordinators',
    stat: '6 hrs', statLabel: 'saved/week',
    examples: ['IEP and EHCP drafting', 'Resource adaptation for all needs', 'Parent communication templates'],
    accent: '#34D399',   // emerald
  },
  {
    icon: '🗂️', role: 'Admin & Finance',
    stat: '7 hrs', statLabel: 'saved/week',
    examples: ['Letters & policy templates', 'Budget narrative drafts', 'Meeting notes and action logs'],
    accent: '#FBBF24',   // amber
  },
  {
    icon: '👨‍👩‍👧', role: 'Parents',
    stat: '2 hrs', statLabel: 'saved/week',
    examples: ['Homework support & explanations', 'Understanding school reports', 'Finding resources'],
    accent: '#F87171',   // coral
  },
  {
    icon: '🎒', role: 'Students',
    stat: '3 hrs', statLabel: 'saved/week',
    examples: ['Essay planning & structure', 'Revision summaries and quizzes', 'UCAS writing'],
    accent: '#2DD4BF',   // teal
  },
] as const;

const TimeSavings: FC = () => (
  <section id="how" aria-labelledby="how-heading" className="bg-[#0F172A] py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-white/10 text-white text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-white/20">
          Time Savings
        </span>
        <h2 id="how-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Hours Back Every Week,<br />
          <span className="text-[#60A5FA]">Across Your Whole School</span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm max-w-lg mx-auto">
          Real examples from UK schools — not theory, actual time back in people's days.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {ROLES.map((r) => (
          <motion.div
            key={r.role}
            variants={{
              hidden:  { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
            }}
            whileHover={{ y: -4 }}
          >
            <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors">

              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden="true">{r.icon}</span>
                <div className="text-right">
                  <div className="text-2xl font-black leading-none" style={{ color: r.accent }}>{r.stat}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.statLabel}</div>
                </div>
              </div>

              <h3 className="font-black text-base text-white">{r.role}</h3>

              <ul className="space-y-2 flex-1">
                {r.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: r.accent }} />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TimeSavings;
