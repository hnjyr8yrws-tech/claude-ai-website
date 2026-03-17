/**
 * TimeSavings.tsx — How AI Helps (all roles)
 * 6 role cards with time-saving stats
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const ROLES = [
  {
    icon: '🧑‍🏫',
    role: 'Teachers',
    stat: '5 hrs/week',
    statLabel: 'saved on average',
    examples: ['Lesson plans in 2 minutes', 'Differentiated worksheets instantly', 'Report comments at scale'],
    color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-100',
  },
  {
    icon: '🏆',
    role: 'Leadership & SLT',
    stat: '4 hrs/week',
    statLabel: 'saved on average',
    examples: ['SIP and SEF first drafts', 'Ofsted evidence packs', 'Strategy and governor reports'],
    color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-100',
  },
  {
    icon: '🤝',
    role: 'SEND Coordinators',
    stat: '6 hrs/week',
    statLabel: 'saved on average',
    examples: ['IEP and EHCP drafting', 'Resource adaptation for all needs', 'Parent communication templates'],
    color: '#22C55E', bg: 'bg-green-50', border: 'border-green-100',
  },
  {
    icon: '🗂️',
    role: 'Admin & Finance Teams',
    stat: '7 hrs/week',
    statLabel: 'saved on average',
    examples: ['Letters & policy templates', 'Budget narrative drafts', 'Meeting notes and action logs'],
    color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-100',
  },
  {
    icon: '👨‍👩‍👧',
    role: 'Parents',
    stat: '2 hrs/week',
    statLabel: 'saved on average',
    examples: ['Homework support & explanations', 'Understanding school reports', 'Finding tuition & resources'],
    color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100',
  },
  {
    icon: '🎒',
    role: 'Students',
    stat: '3 hrs/week',
    statLabel: 'saved on average',
    examples: ['Essay planning & structure', 'Revision summaries and quizzes', 'UCAS and application writing'],
    color: '#14B8A6', bg: 'bg-teal-50', border: 'border-teal-100',
  },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const TimeSavings: FC = () => (
  <section id="how" aria-labelledby="how-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-purple-50 text-brand-purple text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-purple-100">
          Time Savings
        </span>
        <h2 id="how-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          How AI Saves Time<br />
          <span className="text-brand-purple">Across Your Whole School</span>
        </h2>
        <p className="mt-4 text-gray-600 text-sm max-w-lg mx-auto">
          Real examples from UK schools. Not theory — actual time back in people's days.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {ROLES.map((r) => (
          <motion.div key={r.role} variants={cardVariants} whileHover={{ y: -4 }}>
            <Card className={`h-full ${r.bg} ${r.border} shadow-none`}>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <span className="text-3xl" aria-hidden="true">{r.icon}</span>
                  <div className="text-right">
                    <div className="text-xl font-black" style={{ color: r.color }}>{r.stat}</div>
                    <div className="text-[10px] text-ink-light">{r.statLabel}</div>
                  </div>
                </div>

                <h3 className="font-black text-base text-ink">{r.role}</h3>

                <ul className="space-y-2 flex-1">
                  {r.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: r.color }} />
                      {ex}
                    </li>
                  ))}
                </ul>

                <div className="h-0.5 w-10 rounded-full" style={{ backgroundColor: r.color }} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TimeSavings;
