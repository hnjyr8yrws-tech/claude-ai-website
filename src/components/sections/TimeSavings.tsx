/**
 * TimeSavings.tsx — "A Week With AI vs Without"
 * Pastel accent summary cards · animated Progress bars
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const rowVariants: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface Task {
  task: string;
  withoutHours: number;
  withHours: number;
  saving: string;
}

const TASKS: Task[] = [
  { task: 'Lesson Planning',      withoutHours: 6,   withHours: 1.5, saving: '75% less' },
  { task: 'Marking & Feedback',   withoutHours: 8,   withHours: 2.5, saving: '69% less' },
  { task: 'Report Writing',       withoutHours: 5,   withHours: 1,   saving: '80% less' },
  { task: 'Parent Comms',         withoutHours: 3,   withHours: 0.5, saving: '83% less' },
  { task: 'Resource Creation',    withoutHours: 4,   withHours: 1,   saving: '75% less' },
  { task: 'Differentiation Prep', withoutHours: 4.5, withHours: 1,   saving: '78% less' },
];

const MAX = 10;

const Bar: FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </div>
    <span className="text-xs font-bold text-gray-600 w-12 text-right">{value}h/wk</span>
  </div>
);

const SUMMARY = [
  { value: '~19 hrs', label: 'saved per teacher per week', color: 'text-brand-green',  bg: 'bg-pastel-green/40' },
  { value: '78%',     label: 'average time reduction',     color: 'text-brand-blue',   bg: 'bg-pastel-blue/40' },
  { value: '£3,200+', label: 'value of time recovered*',   color: 'text-brand-purple', bg: 'bg-pastel-purple/40' },
];

const TimeSavings: FC = () => (
  <section className="bg-white py-20 sm:py-24 border-y border-gray-100" aria-labelledby="time-savings-heading">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <div className="inline-block bg-pastel-green/50 text-green-700 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
          Time Savings
        </div>
        <h2 id="time-savings-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight mt-2">
          A Week <span className="text-brand-green">With AI</span><br />
          vs <span className="text-gray-400">Without</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-sm mx-auto text-sm">
          Hours reclaimed per teacher, per week. Based on real educator reports.
        </p>
      </motion.div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <div className="w-3 h-3 rounded-full bg-gray-200" /> Without AI
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-green">
          <div className="w-3 h-3 rounded-full bg-brand-green" /> With AI Tools
        </div>
      </div>

      {/* Comparison rows */}
      <motion.div className="space-y-4"
        variants={containerVariants} initial="hidden"
        whileInView="visible" viewport={{ once: true, margin: '-40px' }}
      >
        {TASKS.map((t) => (
          <motion.div key={t.task} variants={rowVariants}
            className="bg-[#FAFAFA] border border-gray-100 p-5 rounded-2xl hover:shadow-card transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-ink">{t.task}</h3>
              <span className="text-xs font-black text-green-700 bg-pastel-green/60 border border-green-200 px-2.5 py-1 rounded-full">
                {t.saving}
              </span>
            </div>
            <div className="space-y-2">
              <Bar value={t.withoutHours} max={MAX} color="#D1D5DB" />
              <Bar value={t.withHours}    max={MAX} color="#22C55E" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary — pastel cards */}
      <motion.div className="mt-10 grid grid-cols-3 gap-4 text-center"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.3 }}
      >
        {SUMMARY.map((s) => (
          <Card key={s.label} className={`rounded-2xl border-0 ${s.bg} p-0`}>
            <CardContent className="p-5">
              <div className={`text-3xl font-black tracking-tight ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-gray-500 mt-1 leading-snug">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
      <p className="text-center text-[10px] text-gray-400 mt-4">
        *Estimated at UK average teacher hourly rate. Individual results vary.
      </p>
    </div>
  </section>
);

export default TimeSavings;
