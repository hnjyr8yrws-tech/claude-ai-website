/**
 * TrustedToolsSection.tsx — Curated trusted AI tools for education
 * 6 tool cards with name, benefit, tags, and View Tool CTA
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

interface Tag {
  label: string;
  color: string;
  bg: string;
}

interface TrustedTool {
  name: string;
  category: string;
  benefit: string;
  icon: string;
  tags: Tag[];
  affiliateUrl?: string;
}

const TRUSTED_TOOLS: TrustedTool[] = [
  {
    name: 'Claude',
    category: 'AI Assistant',
    benefit: 'Safe, thoughtful AI assistant — ideal for lesson planning and writing support.',
    icon: '🤖',
    tags: [
      { label: 'Trusted', color: '#2563eb', bg: '#eff6ff' },
      { label: 'Beginner-friendly', color: '#7c3aed', bg: '#f5f3ff' },
    ],
  },
  {
    name: 'Canva Magic Studio',
    category: 'Design & Creative',
    benefit: 'Create beautiful classroom resources, presentations, and worksheets with AI.',
    icon: '🎨',
    tags: [
      { label: 'Free', color: '#14b8a6', bg: '#f0fdfa' },
      { label: 'Beginner-friendly', color: '#7c3aed', bg: '#f5f3ff' },
    ],
  },
  {
    name: 'Notion AI',
    category: 'Productivity',
    benefit: 'AI-powered notes and planning — perfect for staff meeting prep and CPD tracking.',
    icon: '📝',
    tags: [
      { label: 'Trusted', color: '#2563eb', bg: '#eff6ff' },
      { label: 'Free tier', color: '#14b8a6', bg: '#f0fdfa' },
    ],
  },
  {
    name: 'GrammarlyGO',
    category: 'Writing',
    benefit: 'AI writing assistance for reports, feedback, and professional communications.',
    icon: '✍️',
    tags: [
      { label: 'Free', color: '#14b8a6', bg: '#f0fdfa' },
      { label: 'Beginner-friendly', color: '#7c3aed', bg: '#f5f3ff' },
    ],
  },
  {
    name: 'Otter.ai',
    category: 'Productivity',
    benefit: 'AI meeting notes and transcription — save time in every staff meeting.',
    icon: '🎙️',
    tags: [
      { label: 'Trusted', color: '#2563eb', bg: '#eff6ff' },
      { label: 'Free tier', color: '#14b8a6', bg: '#f0fdfa' },
    ],
  },
  {
    name: 'Gamma',
    category: 'Presentations',
    benefit: 'Create professional presentations in minutes — great for assemblies and CPD.',
    icon: '📊',
    tags: [
      { label: 'Free tier', color: '#14b8a6', bg: '#f0fdfa' },
      { label: 'Beginner-friendly', color: '#7c3aed', bg: '#f5f3ff' },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

const TrustedToolsSection: FC<{ onViewTool?: (name: string) => void }> = ({ onViewTool }) => (
  <section id="trusted" aria-labelledby="trusted-heading" className="bg-gray-50 py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-white border border-gray-200 text-gray-500 text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full mb-4">
          Curated for Education
        </span>
        <h2 id="trusted-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 leading-tight">
          Trusted AI Tools
        </h2>
        <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto">
          Carefully reviewed for educational use — safe, effective, and recommended by educators.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {TRUSTED_TOOLS.map((tool) => (
          <motion.div key={tool.name} variants={cardVariants}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="h-full bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-base leading-tight">{tool.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{tool.category}</p>
                </div>
              </div>

              {/* Benefit */}
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{tool.benefit}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{ color: tag.color, backgroundColor: tag.bg }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-1 border-t border-gray-50">
                <motion.button
                  onClick={() => onViewTool?.(tool.name)}
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded"
                  aria-label={`View ${tool.name}`}
                >
                  View Tool →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Microtext */}
      <motion.p
        className="text-center text-xs text-gray-400 mt-8"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}
      >
        Reviewed for educational use · Updated regularly · Independent recommendations
      </motion.p>

    </div>
  </section>
);

export default TrustedToolsSection;
