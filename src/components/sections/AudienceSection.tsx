/**
 * AudienceSection.tsx — "Who is this for?"
 * 4 audience cards: Teachers, Parents, Schools, Professionals
 * Hover: lift + shadow
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

interface AudienceCard {
  icon: string;
  role: string;
  description: string;
  color: string;         // accent colour for icon bg + border
  bgColor: string;       // light tinted card bg
  iconBg: string;        // icon circle bg
}

const AUDIENCE_CARDS: AudienceCard[] = [
  {
    icon: '🎓',
    role: 'Teachers',
    description: 'Save time on planning, marking, and admin with AI tools built for the classroom.',
    color: '#2563eb',
    bgColor: '#eff6ff',
    iconBg: '#dbeafe',
  },
  {
    icon: '👨‍👩‍👧',
    role: 'Parents',
    description: 'Support your child safely with AI — understand what tools are used and why.',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    iconBg: '#ede9fe',
  },
  {
    icon: '🏫',
    role: 'Schools',
    description: 'Introduce AI confidently across your organisation with curated, trusted tools.',
    color: '#14b8a6',
    bgColor: '#f0fdfa',
    iconBg: '#ccfbf1',
  },
  {
    icon: '💼',
    role: 'Professionals',
    description: 'Upskill and stay ahead with AI — practical tools for every working professional.',
    color: '#2563eb',
    bgColor: '#eff6ff',
    iconBg: '#dbeafe',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

const AudienceSection: FC<{ onViewTools: () => void }> = ({ onViewTools }) => (
  <section id="audience" aria-labelledby="audience-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-gray-100 text-gray-500 text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full mb-4">
          Who is this for?
        </span>
        <h2 id="audience-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 leading-tight">
          AI support for every role in education
        </h2>
        <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto">
          Whether you're in the classroom, at home, or leading a school — we have the right tools and guidance for you.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {AUDIENCE_CARDS.map((card) => (
          <motion.div key={card.role} variants={cardVariants}>
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="h-full rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-4 cursor-pointer"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: card.iconBg }}
              >
                {card.icon}
              </div>

              {/* Text */}
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-lg font-black text-gray-900">{card.role}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
              </div>

              {/* CTA */}
              <button
                onClick={onViewTools}
                className="mt-1 inline-flex items-center gap-1 text-sm font-bold transition-colors"
                style={{ color: card.color }}
                aria-label={`View tools for ${card.role}`}
              >
                View Tools →
              </button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
);

export default AudienceSection;
