/**
 * About.tsx — shadcn Avatar for team + testimonials · pastel accent blocks
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ── Data ───────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    emoji: '👩‍🏫', initials: 'EL',
    name: 'Editorial Lead', role: 'Founder',
    bio: 'Former secondary school HOD with 14 years in the classroom. Leads our editorial and safety review process.',
    accentColor: '#3B82F6', pastelBg: 'bg-pastel-blue/40',
    avatarBg: 'bg-pastel-blue',
  },
  {
    emoji: '🔬', initials: 'RL',
    name: 'Research Lead', role: 'PhD, Educational Technology',
    bio: 'Responsible for our safety scoring methodology and GDPR compliance assessments across all reviewed tools.',
    accentColor: '#8B5CF6', pastelBg: 'bg-pastel-purple/40',
    avatarBg: 'bg-pastel-purple',
  },
  {
    emoji: '👨‍👩‍👧', initials: 'CL',
    name: 'Community Lead', role: 'Parent & Former Governor',
    bio: 'Parent of three school-age children and former secondary school governor. Writes all parent-facing content.',
    accentColor: '#22C55E', pastelBg: 'bg-pastel-green/40',
    avatarBg: 'bg-pastel-green',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Promptly is the only EdTech resource I send to new staff during induction. The safety ratings save us hours of due diligence.',
    name: 'Sarah T.', role: 'Deputy Headteacher, Birmingham', initials: 'ST',
    accentColor: '#3B82F6', avatarBg: 'bg-pastel-blue', pastelLeft: 'border-l-4 border-pastel-blue',
  },
  {
    quote: "As a parent, I finally understand what my child's school is using and why. The privacy guides are written in plain English.",
    name: 'Marcus L.', role: 'Parent, Edinburgh', initials: 'ML',
    accentColor: '#22C55E', avatarBg: 'bg-pastel-green', pastelLeft: 'border-l-4 border-pastel-green',
  },
  {
    quote: "We used Promptly's AI Policy Template as the foundation for our whole-school AI strategy. Saved us weeks of work.",
    name: 'Dr. A. Patel', role: 'Digital Strategy Lead, Bristol MAT', initials: 'AP',
    accentColor: '#8B5CF6', avatarBg: 'bg-pastel-purple', pastelLeft: 'border-l-4 border-pastel-purple',
  },
  {
    quote: 'Our SENCO recommended the Promptly guide in a staff meeting. Within a month, three new tools were embedded across KS3.',
    name: 'James F.', role: 'Head of Learning Support, Leeds', initials: 'JF',
    accentColor: '#F97316', avatarBg: 'bg-pastel-yellow', pastelLeft: 'border-l-4 border-pastel-yellow',
  },
];

const VALUES = [
  { icon: '🛡️', label: 'Safety First',  bg: 'bg-pastel-blue/50' },
  { icon: '💡', label: 'Innovation',    bg: 'bg-pastel-yellow/60' },
  { icon: '🌱', label: 'Growth',        bg: 'bg-pastel-green/50' },
  { icon: '🤝', label: 'Community',     bg: 'bg-pastel-purple/50' },
];

const STATS = [
  { value: '180+',    label: 'AI tools independently reviewed', color: 'text-brand-purple', bg: 'bg-pastel-purple/30' },
  { value: '12,000+', label: 'educators & parents in community', color: 'text-brand-green',  bg: 'bg-pastel-green/30' },
  { value: '2,400+',  label: 'UK schools served this year',      color: 'text-brand-blue',   bg: 'bg-pastel-blue/30' },
  { value: '100%',    label: 'independent editorial',            color: 'text-brand-orange',  bg: 'bg-pastel-yellow/40' },
];

// ── Star rating ────────────────────────────────────────────────────────────────
const StarRating: FC = () => (
  <div className="flex gap-0.5" aria-label="5 stars">
    {[1,2,3,4,5].map((s) => (
      <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B" aria-hidden="true">
        <path d="M6 1l1.4 2.9L11 4.4l-2.5 2.4.6 3.4L6 8.7l-3.1 1.5.6-3.4L1 4.4l3.6-.5z"/>
      </svg>
    ))}
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const About: FC = () => (
  <section id="about" aria-labelledby="about-heading" className="bg-white py-20 sm:py-24 border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <div className="inline-block bg-pastel-yellow/60 text-amber-700 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
          About Us
        </div>
        <h2 id="about-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Built by Educators,<br />
          <span className="text-brand-orange">for Education</span>
        </h2>
      </motion.div>

      {/* Mission */}
      <motion.div className="max-w-3xl mx-auto mb-14 text-center space-y-4"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          <span className="text-brand-blue font-black">We started Promptly because educators deserved better.</span>{' '}
          Better information. Better tools. Better protection from the AI hype cycle.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          We are proudly independent. We earn through affiliate partnerships, but{' '}
          <strong className="text-ink">our safety ratings are never for sale.</strong>{' '}
          Every tool we recommend has been tested by educators in real UK classrooms.
        </p>
      </motion.div>

      {/* Stats — pastel accent cards */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
        variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={cardVariants} whileHover={{ y: -3 }}
            className={`${s.bg} rounded-2xl p-5 text-center border border-white/60`}
          >
            <div className={`text-2xl sm:text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-gray-500 leading-snug">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Team — shadcn Avatar */}
      <div className="mb-14">
        <motion.h3 className="text-xl font-black text-ink mb-6 text-center"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          The Team
        </motion.h3>
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {TEAM.map((member) => (
            <motion.div key={member.name} variants={cardVariants} whileHover={{ y: -5 }}>
              <Card className={`h-full rounded-2xl border-0 shadow-card p-0 overflow-hidden`}>
                <div className={`h-1.5 w-full`} style={{ backgroundColor: `${member.accentColor}30` }} />
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <Avatar className={`w-14 h-14 ${member.avatarBg} border-2`}
                    style={{ borderColor: `${member.accentColor}30` }}>
                    <AvatarFallback className={`${member.avatarBg} text-lg font-black`}
                      style={{ color: member.accentColor }}>
                      {member.emoji}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-black" style={{ color: member.accentColor }}>{member.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{member.role}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Testimonials — Avatar + pastel left border */}
      <div className="mb-14">
        <motion.h3 className="text-xl font-black text-ink mb-6 text-center"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          What Our Community Says
        </motion.h3>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote key={i} variants={cardVariants} whileHover={{ y: -4 }}>
              <Card className={`h-full rounded-2xl border-0 shadow-card p-0 ${t.pastelLeft}`}>
                <CardContent className="p-6 flex flex-col gap-3">
                  <StarRating />
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{t.quote}"</p>
                  <footer className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <Avatar className={`w-8 h-8 ${t.avatarBg}`}>
                      <AvatarFallback className={`${t.avatarBg} text-xs font-black`}
                        style={{ color: t.accentColor }}>
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <cite className="not-italic">
                      <div className="text-xs font-bold text-ink">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.role}</div>
                    </cite>
                  </footer>
                </CardContent>
              </Card>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>

      {/* Vision + CTA */}
      <motion.div
        className="bg-gradient-to-br from-brand-blue via-brand-purple to-brand-green rounded-3xl p-8 sm:p-12 text-white text-center space-y-6"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h3 variants={itemVariants} className="text-2xl sm:text-3xl font-black mb-4">Our Vision</motion.h3>
          <motion.p variants={itemVariants} className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto italic">
            "A UK education system where every teacher, student, parent, and school leader can harness
            the power of AI with complete confidence — knowing that the tools they use are safe, fair,
            and genuinely effective."
          </motion.p>

          {/* Values */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 mt-8">
            {VALUES.map((v) => (
              <motion.div key={v.label} className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.1, y: -4 }} transition={{ type: 'spring', stiffness: 400 }}>
                <span className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center text-2xl`} aria-hidden="true">{v.icon}</span>
                <span className="text-[11px] text-white/70 font-semibold">{v.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button className="px-6 py-3 rounded-xl font-black text-sm bg-white text-brand-blue
                                 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-white/95">
                Join Our Newsletter
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
              <Button variant="outline" className="px-6 py-3 rounded-xl font-black text-sm border-2 border-white
                                                    text-white hover:bg-white hover:text-brand-blue">
                Partner With Us
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default About;
