/**
 * Benefits.tsx — Numbered benefit blocks
 * shadcn Card · All Week style big numbers · staggerChildren
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

interface Benefit {
  num: string;
  badgeVariant: 'blue' | 'green' | 'purple' | 'orange';
  color: string;
  headline: string;
  sub: string;
  icon: string;
}

const BENEFITS: Benefit[] = [
  {
    num: '01',
    badgeVariant: 'blue',
    color: 'text-brand-blue',
    headline: 'No Overwhelm',
    sub: 'Life is busy — AI research shouldn\'t add to the pile. We cut through the noise so you get straight to the tools that work for your classroom.',
    icon: '🧘',
  },
  {
    num: '02',
    badgeVariant: 'green',
    color: 'text-brand-green',
    headline: 'Real-Life Fit',
    sub: 'Every tool we review gets tested in real UK schools by real teachers. If it doesn\'t fit into a Monday morning, we say so plainly.',
    icon: '✅',
  },
  {
    num: '03',
    badgeVariant: 'purple',
    color: 'text-brand-purple',
    headline: 'Truly Safe',
    sub: 'GDPR compliance, age-appropriateness, and data privacy aren\'t checkboxes to us. They\'re the first thing we look for, before a single word of praise.',
    icon: '🛡️',
  },
  {
    num: '04',
    badgeVariant: 'orange',
    color: 'text-brand-orange',
    headline: 'Premium Quality',
    sub: 'We only feature tools we\'d genuinely recommend to a colleague. No sponsored placements. No pay-to-rank. Independent editorial — always.',
    icon: '🏆',
  },
];

const Benefits: FC = () => (
  <section className="bg-cream-warm py-20 sm:py-24" aria-labelledby="benefits-heading">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="orange" className="text-[10px] tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full">
          Why Promptly
        </Badge>
        <h2 id="benefits-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight mt-3">
          Planning shouldn't be<br />
          <span className="text-brand-blue">this hard.</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-base leading-relaxed">
          Life is busy. AI shouldn't add to the chaos — it should quietly fix it.
        </p>
      </motion.div>

      {/* Benefit cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {BENEFITS.map((b) => (
          <motion.div
            key={b.num}
            variants={cardVariants}
            whileHover={{ y: -6 }}
          >
            <Card className="h-full rounded-3xl border-0 shadow-card hover:shadow-card-hover p-0">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                {/* Big number */}
                <div className={`text-7xl font-black tracking-tighter leading-none ${b.color} opacity-15 select-none`}
                     aria-hidden="true">
                  {b.num}
                </div>
                {/* Icon badge */}
                <Badge variant={b.badgeVariant} className="text-sm px-3 py-1.5 rounded-full w-fit">
                  <span aria-hidden="true">{b.icon}</span>
                </Badge>
                {/* Headline */}
                <h3 className="text-xl font-black tracking-tight text-ink leading-tight">{b.headline}</h3>
                {/* Body */}
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{b.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="text-center mt-12 text-2xl sm:text-3xl font-black tracking-tight text-ink"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        Safe AI. Real schools. <span className="text-brand-green">Zero fluff.</span>
      </motion.p>
    </div>
  </section>
);

export default Benefits;
