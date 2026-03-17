/**
 * GuidesSection.tsx — 5 downloadable PDF guides
 * Deep teal section background with bold white-text cards
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const GUIDES = [
  {
    icon: '📋',
    title: 'SLT Ofsted AI Policy Template',
    desc: 'Ready-to-adapt school AI policy mapped to the current Ofsted EIF — download, personalise, use.',
    pages: '12 pages', audience: 'Leadership & SLT',
    bg: '#2B4590',   // Notion wikis blue
  },
  {
    icon: '🛡️',
    title: 'Safeguarding with AI',
    desc: 'How to use AI safely in pastoral contexts — data sharing rules, permitted use cases, red flags.',
    pages: '8 pages', audience: 'Safeguarding',
    bg: '#166534',   // deep green
  },
  {
    icon: '👨‍👩‍👧',
    title: "Parent's Guide to AI in Schools",
    desc: "Plain-English answers: what data is shared, how AI is used in lessons, how to talk to your child.",
    pages: '6 pages', audience: 'Parents',
    bg: '#7B4F2A',   // Notion projects brown
  },
  {
    icon: '🤝',
    title: 'SEND & AI: Making Tech Inclusive',
    desc: 'Assistive AI tools, accessibility settings, and adapting outputs for students with additional needs.',
    pages: '10 pages', audience: 'SEND / Inclusion',
    bg: '#9D174D',   // deep pink
  },
  {
    icon: '🎓',
    title: 'Staff CPD: AI Literacy for All',
    desc: 'Whole-school CPD framework — AI basics, role-specific use cases, 5-session INSET plan.',
    pages: '16 pages', audience: 'All Staff',
    bg: '#1E3A5F',   // deep navy teal
  },
] as const;

const GuidesSection: FC = () => (
  <section id="guides" aria-labelledby="guides-heading" className="bg-[#2D6A4F] py-20 sm:py-24">
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
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <div
              className="h-full rounded-2xl p-7 flex flex-col gap-5 min-h-[220px]"
              style={{ backgroundColor: g.bg }}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl" aria-hidden="true">{g.icon}</span>
                <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                  {g.audience}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-black text-base text-white leading-snug mb-2">{g.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{g.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-[11px] text-white/50">📄 {g.pages}</span>
                <motion.a
                  href="#"
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-xs font-bold text-white bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl transition-colors"
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
