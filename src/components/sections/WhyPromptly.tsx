/**
 * WhyPromptly.tsx — 6 benefit cards
 * "Why Promptly"
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const BENEFITS = [
  {
    icon: '🎯',
    title: 'Ofsted-Ready',
    desc: 'Every recommendation maps to Ofsted inspection frameworks. Walk into any inspection with confidence.',
    color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-100',
  },
  {
    icon: '🛡️',
    title: 'Safety-First',
    desc: "Tools checked for GDPR compliance, age-appropriateness, data storage, and safeguarding. Every time.",
    color: '#22C55E', bg: 'bg-green-50', border: 'border-green-100',
  },
  {
    icon: '🧑‍🏫',
    title: 'Made by Educators',
    desc: "Donna has 14+ years in UK classrooms. Every review is grounded in real teaching experience, not marketing copy.",
    color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-100',
  },
  {
    icon: '🆓',
    title: 'Free to Start',
    desc: '50 role-specific prompts + AI Safety Checklist — no credit card, no paywall. Download and use today.',
    color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-100',
  },
  {
    icon: '📊',
    title: 'Role-Specific',
    desc: 'Separate guides for every department — Teaching, SEND, Finance, HR, IT, Leadership, Parents and Students.',
    color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100',
  },
  {
    icon: '🏆',
    title: '100% Independent',
    desc: 'No sponsored listings. No paid rankings. No affiliate bias in our safety scores. What you read is what we actually think.',
    color: '#14B8A6', bg: 'bg-teal-50', border: 'border-teal-100',
  },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const WhyPromptly: FC = () => (
  <section id="why" aria-labelledby="why-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-blue-50 text-brand-blue text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
          Why Promptly
        </span>
        <h2 id="why-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Why UK Schools Trust<br />
          <span className="text-brand-blue">Promptly</span>
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {BENEFITS.map((b) => (
          <motion.div key={b.title} variants={cardVariants} whileHover={{ y: -4 }}>
            <Card className={`h-full p-6 flex flex-col gap-4 ${b.bg} ${b.border} shadow-none`}>
              <CardContent className="p-0 flex flex-col gap-4">
                <span className="text-3xl" aria-hidden="true">{b.icon}</span>
                <h3 className="text-base font-black text-ink">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{b.desc}</p>
                <div className="h-0.5 w-10 rounded-full" style={{ backgroundColor: b.color }} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyPromptly;
