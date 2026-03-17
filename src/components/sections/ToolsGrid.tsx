/**
 * ToolsGrid.tsx — Prompt Library
 * Curated Claude prompts by professional category
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All', 'Educators', 'Finance', 'Leadership', 'Admin', 'HR', 'Creativity', 'Sales',
];

interface Prompt {
  name: string;
  tagline: string;
  desc: string;
  hub: string;
  hubColor: string;
  hubBg: string;
  icon: string;
  iconBg: string;
  categories: string[];
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  promptPreview: string;
}

const PROMPTS: Prompt[] = [
  {
    name: 'Lesson Planner',
    tagline: 'Full lesson plans in seconds',
    desc: 'Generate differentiated lesson plans for any year group, subject, and ability level — including SEND adaptations.',
    hub: 'Educators Hub', hubColor: '#3B82F6', hubBg: '#EFF6FF',
    icon: '🧑‍🏫', iconBg: '#EFF6FF',
    categories: ['Educators'],
    badge: "Most Used", badgeColor: '#1D4ED8', badgeBg: '#DBEAFE',
    promptPreview: '"Create a 60-minute Year 7 Science lesson on photosynthesis..."',
  },
  {
    name: 'Budget Narrative',
    tagline: 'Turn spreadsheets into clear stories',
    desc: 'Summarise financial data for board reports, senior leadership, or governor meetings — plain English, professional tone.',
    hub: 'Finance Hub', hubColor: '#22C55E', hubBg: '#F0FDF4',
    icon: '💷', iconBg: '#F0FDF4',
    categories: ['Finance'],
    badge: 'New', badgeColor: '#15803D', badgeBg: '#DCFCE7',
    promptPreview: '"Write a board-ready summary of our Q3 budget vs actuals..."',
  },
  {
    name: '1-on-1 Framework',
    tagline: 'Structured check-ins for managers',
    desc: 'Build meaningful 1-on-1 agendas, surface blockers early, and document action points — every time.',
    hub: 'Leadership Hub', hubColor: '#8B5CF6', hubBg: '#F5F3FF',
    icon: '🏆', iconBg: '#F5F3FF',
    categories: ['Leadership', 'HR'],
    badge: '', badgeColor: '', badgeBg: '',
    promptPreview: '"Create a 30-minute 1-on-1 agenda for a team member who..."',
  },
  {
    name: 'Meeting Agenda',
    tagline: 'Crisp agendas that respect time',
    desc: 'Draft focused meeting agendas with time allocations, pre-reads, and clear objectives — in under a minute.',
    hub: 'Admin Hub', hubColor: '#F97316', hubBg: '#FFF7ED',
    icon: '🗂️', iconBg: '#FFF7ED',
    categories: ['Admin'],
    badge: '', badgeColor: '', badgeBg: '',
    promptPreview: '"Draft an agenda for a 45-minute project kick-off meeting..."',
  },
  {
    name: 'Student Report Writer',
    tagline: 'Personalised reports at scale',
    desc: 'Generate individual, warm, and accurate student reports from your notes — varying sentence structure automatically.',
    hub: 'Educators Hub', hubColor: '#3B82F6', hubBg: '#EFF6FF',
    icon: '📝', iconBg: '#EFF6FF',
    categories: ['Educators'],
    badge: '', badgeColor: '', badgeBg: '',
    promptPreview: '"Write a Year 10 end-of-term report for a student who..."',
  },
  {
    name: 'Job Description Builder',
    tagline: 'Inclusive JDs that attract talent',
    desc: 'Write inclusive, role-specific job descriptions with clear responsibilities, person spec, and benefits — bias-checked.',
    hub: 'HR Hub', hubColor: '#EC4899', hubBg: '#FDF2F8',
    icon: '👥', iconBg: '#FDF2F8',
    categories: ['HR'],
    badge: '', badgeColor: '', badgeBg: '',
    promptPreview: '"Write an inclusive job description for a Senior Finance Manager..."',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const PromptCard: FC<{ prompt: Prompt }> = ({ prompt }) => (
  <motion.div
    layout
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-4 transition-shadow"
  >
    {/* Header */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: prompt.iconBg }}
        >
          {prompt.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-base text-ink">{prompt.name}</h3>
            {prompt.badge && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: prompt.badgeColor, backgroundColor: prompt.badgeBg }}
              >
                ★ {prompt.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{prompt.tagline}</p>
        </div>
      </div>
      <span
        className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
        style={{ color: prompt.hubColor, backgroundColor: prompt.hubBg }}
      >
        {prompt.hub}
      </span>
    </div>

    <p className="text-sm text-gray-500 leading-relaxed">{prompt.desc}</p>

    {/* Prompt preview */}
    <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
      <p className="text-[11px] text-gray-400 font-medium mb-1">Example prompt</p>
      <p className="text-xs text-gray-600 italic leading-relaxed">{prompt.promptPreview}</p>
    </div>

    {/* CTA */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="w-full py-2.5 rounded-xl border-2 text-sm font-bold transition-all
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        borderColor: prompt.hubColor,
        color: prompt.hubColor,
        backgroundColor: `${prompt.hubColor}0D`,
      }}
    >
      Use This Prompt →
    </motion.button>
  </motion.div>
);

const ToolsGrid: FC = () => {
  const [active, setActive] = useState('All');
  const filtered = PROMPTS.filter(
    (p) => active === 'All' || p.categories.includes(active)
  );

  return (
    <section id="library" aria-labelledby="library-heading" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            Prompt Library
          </span>
          <h2 id="library-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            Free Prompts for<br />
            <span className="text-brand-blue">UK Professionals</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Every prompt is tested and refined by practitioners in that field — not generic AI templates.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={active === cat}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
                active === cat
                  ? 'bg-brand-blue text-white border-brand-blue shadow-card-blue'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue/30 hover:text-brand-blue'
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Prompt cards */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filtered.map((prompt) => <PromptCard key={prompt.name} prompt={prompt} />)}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-16 text-sm"
            >
              No prompts in this category yet — check back soon.
            </motion.p>
          )}
        </AnimatePresence>

        {/* View all CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-2xl bg-brand-blue text-white font-bold text-sm
                       hover:opacity-90 shadow-card-blue transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            View All 500+ Prompts →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsGrid;
