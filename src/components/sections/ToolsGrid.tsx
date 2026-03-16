/**
 * ToolsGrid.tsx — Explore AI Tools for Schools
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All', 'Teaching', 'Assessment', 'SEND', 'Behaviour',
  'Admin', 'Parents', 'Creativity', 'Student Tools',
];

interface Tool {
  name: string;
  tagline: string;
  desc: string;
  score: number;
  scoreColor: string;
  progressClass: string;
  icon: string;
  iconBg: string;
  categories: string[];
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  price: string;
}

const TOOLS: Tool[] = [
  {
    name: 'MagicSchool',
    tagline: 'AI Lesson Planning & Differentiation',
    desc: 'Generate lesson plans, differentiated resources, and marking rubrics in seconds. Trusted by 30,000+ UK teachers.',
    score: 9.7, scoreColor: '#22C55E', progressClass: 'bg-green-400',
    icon: '✨', iconBg: '#F0FDF4',
    categories: ['Teaching', 'Assessment'],
    badge: "Editor's Pick", badgeColor: '#D97706', badgeBg: '#FEF3C7',
    price: 'Free Tier',
  },
  {
    name: 'Diffit',
    tagline: 'Differentiated Reading Resources',
    desc: 'Instantly adapts any text to different reading levels. Perfect for mixed-ability and SEND-inclusive classes.',
    score: 9.2, scoreColor: '#3B82F6', progressClass: 'bg-blue-400',
    icon: '📖', iconBg: '#EFF6FF',
    categories: ['Teaching', 'SEND'],
    badge: 'Free for Teachers', badgeColor: '#1D4ED8', badgeBg: '#EFF6FF',
    price: 'Free',
  },
  {
    name: 'Curipod',
    tagline: 'Interactive AI-Powered Lessons',
    desc: 'Create engaging interactive lessons with AI-generated polls, questions, and real-time student feedback.',
    score: 8.8, scoreColor: '#F59E0B', progressClass: 'bg-amber-400',
    icon: '🎯', iconBg: '#FFFBEB',
    categories: ['Teaching', 'Student Tools', 'Creativity'],
    badge: 'Highly Engaging', badgeColor: '#92400E', badgeBg: '#FEF3C7',
    price: 'Free Tier',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const ToolCard: FC<{ tool: Tool }> = ({ tool }) => (
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
          style={{ backgroundColor: tool.iconBg }}
        >
          {tool.icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-base text-ink">{tool.name}</h3>
            {tool.badge && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: tool.badgeColor, backgroundColor: tool.badgeBg }}
              >
                ★ {tool.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{tool.tagline}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xl font-black" style={{ color: tool.scoreColor }}>{tool.score}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{tool.price}</div>
      </div>
    </div>

    <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>

    {/* Safety score */}
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-gray-400 font-medium">Safety Score</span>
        <span className="text-[11px] font-bold" style={{ color: tool.scoreColor }}>{tool.score}/10</span>
      </div>
      <Progress value={tool.score * 10} indicatorClassName={tool.progressClass} />
    </div>

    {/* CTA */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="w-full py-2.5 rounded-xl border-2 text-sm font-bold transition-all
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        borderColor: tool.scoreColor,
        color: tool.scoreColor,
        backgroundColor: `${tool.scoreColor}0D`,
      }}
    >
      Read Full Review →
    </motion.button>
  </motion.div>
);

const ToolsGrid: FC = () => {
  const [active, setActive] = useState('All');
  const filtered = TOOLS.filter(
    (t) => active === 'All' || t.categories.includes(active)
  );

  return (
    <section id="tools" aria-labelledby="tools-heading" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            AI Tools Directory
          </span>
          <h2 id="tools-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            Explore AI Tools<br />
            <span className="text-brand-blue">for Schools</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Every tool assessed for safety, GDPR compliance, and real-world classroom usefulness.
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

        {/* Tool cards */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              {filtered.map((tool) => <ToolCard key={tool.name} tool={tool} />)}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-16 text-sm"
            >
              No tools listed in this category yet — check back soon.
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
            View All 180+ Tools →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsGrid;
