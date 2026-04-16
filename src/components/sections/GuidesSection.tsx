/**
 * GuidesSection.tsx — 5 downloadable PDF guides
 * Notion-style product cards: bold solid bg, large icon, plain category label, minimal CTA arrow
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const GUIDES = [
  {
    icon: '📋',
    title: 'SLT Ofsted AI Policy Template',
    desc: 'Ready-to-adapt school AI policy mapped to the current Ofsted EIF — download, personalise, use.',
    pages: '12 pages', audience: 'Leadership & SLT',
    bg: '#D1FAE5', text: '#064E3B', sub: '#065F46',   // mint green
  },
  {
    icon: '🛡️',
    title: 'Safeguarding with AI',
    desc: 'How to use AI safely in pastoral contexts — data sharing rules, permitted use cases, red flags.',
    pages: '8 pages', audience: 'Safeguarding',
    bg: '#A7F3D0', text: '#064E3B', sub: '#047857',   // emerald green
  },
  {
    icon: '👨‍👩‍👧',
    title: "Parent's Guide to AI in Schools",
    desc: "Plain-English answers: what data is shared, how AI is used in lessons, how to talk to your child.",
    pages: '6 pages', audience: 'Parents',
    bg: '#CCFBF1', text: '#134E4A', sub: '#0F766E',   // teal-green
  },
  {
    icon: '🤝',
    title: 'SEND & AI: Making Tech Inclusive',
    desc: 'Assistive AI tools, accessibility settings, and adapting outputs for students with additional needs.',
    pages: '10 pages', audience: 'SEND / Inclusion',
    bg: '#BBF7D0', text: '#14532D', sub: '#166534',   // soft green
  },
  {
    icon: '🎓',
    title: 'Staff CPD: AI Literacy for All',
    desc: 'Whole-school CPD framework — AI basics, role-specific use cases, 5-session INSET plan.',
    pages: '16 pages', audience: 'All Staff',
    bg: '#ECFDF5', text: '#064E3B', sub: '#059669',   // pale green
  },
] as const;

const GuidesSection: FC = () => (
  <section id="guides" aria-labelledby="guides-heading" className="bg-[#2D6A4F] py-20 sm:py-24" style={{ scrollMarginTop: '64px' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-white/15 text-white text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-white/20">
          Free Downloads
        </span>
        <h2 id="guides-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Guides &amp; Resources
        </h2>
        <p className="mt-4 text-white/60 text-sm max-w-lg mx-auto">
          Professionally written for every role — download as PDF, no sign-up required.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {GUIDES.map((g) => (
          <motion.div
            key={g.title}
            variants={{
              hidden:  { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
            }}
            whileHover={{ y: -4 }}
          >
            <div
              className="h-full rounded-2xl p-8 flex flex-col gap-6 min-h-[260px] cursor-pointer"
              style={{ backgroundColor: g.bg }}
            >
              {/* Icon */}
              <span className="text-5xl leading-none" aria-hidden="true">{g.icon}</span>

              {/* Text body */}
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: g.sub }}>
                  {g.audience}
                </p>
                <h3 className="text-lg font-black leading-snug" style={{ color: g.text }}>{g.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: g.sub }}>{g.desc}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: g.sub }}>{g.pages}</span>
                <motion.a
                  href="#"
                  download
                  whileHover={{ x: 3 }}
                  className="text-sm font-bold transition-colors flex items-center gap-1"
                  style={{ color: g.text }}
                  aria-label={`Download ${g.title}`}
                >
                  Download PDF →
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default GuidesSection;
