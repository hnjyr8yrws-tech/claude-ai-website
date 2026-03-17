/**
 * Hubs.tsx — Professional Hub teasers
 * Educators · Finance · Leadership · Admin
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const HUBS = [
  {
    icon: '🧑‍🏫',
    title: 'Educators Hub',
    desc: 'Lesson plans, student feedback, differentiated resources, and parent comms — all with ready-to-use Claude prompts.',
    tags: ['Lesson Planning', 'Marking', 'Reports', 'SEND'],
    color: '#3B82F6',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    badge: 'Most Popular',
  },
  {
    icon: '💷',
    title: 'Finance Hub',
    desc: 'Budget summaries, cost analysis, board report drafts, and financial narratives — done in a fraction of the time.',
    tags: ['Budgeting', 'Forecasting', 'Board Reports', 'Analysis'],
    color: '#22C55E',
    bg: 'bg-green-50',
    border: 'border-green-100',
    badge: 'New',
  },
  {
    icon: '🏆',
    title: 'Leadership Hub',
    desc: "Team 1-on-1s, strategy docs, performance reviews, and culture comms — prompts that make great leaders even better.",
    tags: ['Strategy', '1-on-1s', 'Performance', 'Culture'],
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    badge: '',
  },
  {
    icon: '🗂️',
    title: 'Admin Hub',
    desc: 'Meeting agendas, action logs, policy drafts, and email templates — clear, professional, and ready in seconds.',
    tags: ['Meetings', 'Policies', 'Emails', 'Scheduling'],
    color: '#F97316',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    badge: '',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Hubs: FC = () => (
  <section id="hubs" aria-labelledby="hubs-heading" className="bg-[#FAFAFA] py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-purple-50 text-purple-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-purple-100">
          Professional Hubs
        </span>
        <h2 id="hubs-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Prompts built for<br />
          <span className="text-brand-blue">your profession</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Each hub is curated by practitioners in that field — not generic AI templates.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.09 }}
      >
        {HUBS.map((hub) => (
          <motion.div
            key={hub.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className={`rounded-2xl border p-6 flex flex-col gap-4 transition-shadow hover:shadow-lg ${hub.bg} ${hub.border}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl" aria-hidden="true">{hub.icon}</span>
              {hub.badge && (
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ color: hub.color, backgroundColor: `${hub.color}18` }}
                >
                  {hub.badge}
                </span>
              )}
            </div>
            <h3 className="text-base font-black tracking-tight text-ink leading-snug">{hub.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{hub.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {hub.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: hub.color, backgroundColor: `${hub.color}15` }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 rounded-xl text-sm font-bold border-2 transition-all
                         focus-visible:outline-none focus-visible:ring-2"
              style={{
                borderColor: hub.color,
                color: hub.color,
                backgroundColor: `${hub.color}0D`,
              }}
            >
              Explore Hub →
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Hubs;
