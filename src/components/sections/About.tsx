/**
 * About.tsx — Meet the Team · Vision · Newsletter
 */

import { FC, useState } from 'react';
import { motion, Variants } from 'framer-motion';

const TEAM = [
  {
    initials: 'D',
    name: 'Donna',
    role: 'Head of Content & Reviews',
    bio: 'Secondary school teacher with 14+ years of classroom experience. Tests every AI tool in a real UK school before it appears on Promptly.',
    color: '#3B82F6', bg: '#EFF6FF',
    badge: 'Curriculum Lead',
  },
  {
    initials: 'C',
    name: 'Chloe',
    role: 'Content & Community',
    bio: "Builds Promptly's content strategy and community. Former EdTech consultant passionate about making AI accessible for every educator.",
    color: '#8B5CF6', bg: '#F5F3FF',
    badge: 'Content Lead',
  },
  {
    initials: 'C',
    name: 'Charles',
    role: 'Safety & Compliance',
    bio: 'Leads all GDPR and safeguarding assessments. Every safety score on Promptly carries his sign-off.',
    color: '#22C55E', bg: '#F0FDF4',
    badge: 'Safety Lead',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const About: FC = () => {
  const [email, setEmail] = useState('');

  return (
    <section id="about" aria-labelledby="about-heading" className="bg-[#FAFAFA] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24">

        {/* ── Meet the Team ── */}
        <div>
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
              The Promptly Team
            </span>
            <h2 id="about-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
              Meet the Team
            </h2>
            <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              Built by educators, not tech companies.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
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
                className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-4 text-center transition-shadow"
              >
                <div
                  className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ backgroundColor: member.bg, color: member.color }}
                >
                  {member.initials}
                </div>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full mx-auto"
                  style={{ color: member.color, backgroundColor: member.bg }}
                >
                  {member.badge}
                </span>
                <div>
                  <h3 className="text-lg font-black text-ink">{member.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{member.role}</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Vision ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto py-16 px-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-white text-blue-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-6 border border-blue-100 shadow-sm">
            Our Vision
          </span>
          <blockquote className="text-2xl sm:text-3xl font-black text-ink leading-snug tracking-tight">
            "A UK education system where teachers and students can use AI with{' '}
            <span className="text-brand-blue">confidence</span>."
          </blockquote>
        </motion.div>

        {/* ── Newsletter ── */}
        <motion.div
          className="text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-6 border border-amber-100">
            Stay Updated
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-3">
            Stay up to date with safe AI tools for schools.
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            New reviews, safety guides, and training resources — no spam, unsubscribe anytime.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your school email address"
              aria-label="Email address"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-ink placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/40 transition-all"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl bg-brand-blue text-white font-bold text-sm
                         hover:opacity-90 transition-all shadow-card-blue
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              Subscribe →
            </motion.button>
          </form>
          <p className="text-xs text-gray-400 mt-3">Free forever. No paid content. GDPR compliant.</p>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
