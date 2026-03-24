/**
 * GuidesSection.tsx — Free downloadable guides
 * 3 cards: clean light design, Download Guide CTA
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const GUIDES = [
  {
    icon: '📋',
    title: 'AI Policy Template for Schools',
    desc: 'A ready-to-adapt school AI policy mapped to Ofsted requirements — download, personalise, and use today.',
    audience: 'School Leadership',
    pages: '12 pages · PDF',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    icon: '👨‍👩‍👧',
    title: "Parent's Guide to AI in Schools",
    desc: "Plain-English answers to every question parents ask about AI, data safety, and how it's used in lessons.",
    audience: 'Parents & Families',
    pages: '6 pages · PDF',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    icon: '🎓',
    title: 'AI Literacy for All Staff',
    desc: 'A whole-school CPD framework — AI basics, role-specific use cases, and a 5-session INSET plan.',
    audience: 'All Educators',
    pages: '16 pages · PDF',
    color: '#14b8a6',
    bg: '#f0fdfa',
    border: '#99f6e4',
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

const GuidesSection: FC = () => (
  <section id="guides" aria-labelledby="guides-heading" className="bg-gray-50 py-20 sm:py-24">
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
          Free Downloads
        </span>
        <h2 id="guides-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 leading-tight">
          Free Guides &amp; Resources
        </h2>
        <p className="mt-3 text-gray-500 text-base max-w-lg mx-auto">
          Professionally written for every role — download as PDF, no sign-up required.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {GUIDES.map((g) => (
          <motion.div key={g.title} variants={cardVariants}>
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.09)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="h-full rounded-2xl border p-6 flex flex-col gap-5"
              style={{
                backgroundColor: g.bg,
                borderColor: g.border,
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              {/* Icon */}
              <span className="text-4xl" aria-hidden="true">{g.icon}</span>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-[10.5px] font-black uppercase tracking-[0.14em]" style={{ color: g.color }}>
                  {g.audience}
                </p>
                <h3 className="text-lg font-black text-gray-900 leading-snug">{g.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{g.desc}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <span className="text-xs text-gray-400">{g.pages}</span>
                <motion.a
                  href="#"
                  download
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="text-sm font-bold flex items-center gap-1 transition-colors"
                  style={{ color: g.color }}
                  aria-label={`Download ${g.title}`}
                >
                  Download Guide →
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
);

export default GuidesSection;
