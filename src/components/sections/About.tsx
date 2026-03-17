/**
 * About.tsx — Meet GetPromptly HQ
 * Donna · Chloe · Charles
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const TEAM = [
  {
    initials: 'D',
    name: 'Donna',
    role: 'Head of Content & Reviews',
    bio: 'Ex-teacher with 14+ years in UK classrooms. Crafts every prompt and tool review from real classroom experience.',
    color: '#3B82F6', bg: '#EFF6FF',
    badge: 'Ex-Teacher',
  },
  {
    initials: 'C',
    name: 'Chloe',
    role: 'Content & Community',
    bio: 'Former EdTech consultant. Builds GetPromptly\'s content strategy and makes sure everything stays practical for real educators.',
    color: '#8B5CF6', bg: '#F5F3FF',
    badge: 'EdTech Lead',
  },
  {
    initials: 'C',
    name: 'Charles',
    role: 'Tech & Compliance',
    bio: 'Leads all technical reviews and GDPR assessments. Every recommendation on GetPromptly carries his sign-off.',
    color: '#14B8A6', bg: '#F0FDFA',
    badge: 'Tech Expert',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const About: FC = () => (
  <section id="about" aria-labelledby="team-heading" className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-6 text-center">

      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="team-heading" className="text-4xl font-bold text-gray-900 mb-4">
          Meet GetPromptly HQ
        </h2>
        <p className="text-xl text-gray-600">
          Three education &amp; tech experts helping schools harness AI every day.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.1 }}
      >
        {TEAM.map((member) => (
          <motion.div
            key={member.name + member.role}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            {/* Avatar placeholder — replace src with cartoon image when ready */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black shadow-sm"
              style={{ backgroundColor: member.bg, color: member.color }}
              aria-label={`${member.name} avatar`}
            >
              {member.initials}
            </div>

            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ color: member.color, backgroundColor: member.bg }}
            >
              {member.badge}
            </span>

            <div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{member.role}</p>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default About;
