/**
 * GuidesSection.tsx — 5 downloadable PDF guides
 * Ofsted · Safeguarding · Parents · SEND · CPD
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GUIDES = [
  {
    icon: '📋',
    title: 'SLT Ofsted AI Policy Template',
    desc: 'A ready-to-adapt school AI policy template mapped to the current Ofsted Education Inspection Framework — download, personalise, and use.',
    pages: '12 pages', audience: 'Leadership & SLT',
    audienceColor: '#8B5CF6', audienceBg: '#F5F3FF',
    color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-100',
    href: '#',
  },
  {
    icon: '🛡️',
    title: 'Safeguarding with AI: A Pastoral Guide',
    desc: 'How to use AI tools safely in pastoral and safeguarding contexts. Covers data sharing rules, permitted use cases, and red flags to avoid.',
    pages: '8 pages', audience: 'Safeguarding & Pastoral',
    audienceColor: '#22C55E', audienceBg: '#F0FDF4',
    color: '#22C55E', bg: 'bg-green-50', border: 'border-green-100',
    href: '#',
  },
  {
    icon: '👨‍👩‍👧',
    title: "Parent's Guide to AI in Schools",
    desc: "Plain-English answers to the questions every parent has: what data is shared, how AI is used in lessons, and how to talk to your child about it.",
    pages: '6 pages', audience: 'Parents',
    audienceColor: '#D97706', audienceBg: '#FEF3C7',
    color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100',
    href: '#',
  },
  {
    icon: '🤝',
    title: 'SEND & AI: Making Technology Inclusive',
    desc: 'A practical guide for SENCOs covering assistive AI tools, accessibility settings, and how to adapt AI outputs for students with additional needs.',
    pages: '10 pages', audience: 'SEND / Inclusion',
    audienceColor: '#F97316', audienceBg: '#FFF7ED',
    color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-100',
    href: '#',
  },
  {
    icon: '🎓',
    title: 'Staff CPD: AI Literacy for All Roles',
    desc: 'A whole-school CPD framework covering AI basics, role-specific use cases, ethical considerations, and a 5-session delivery plan for INSET days.',
    pages: '16 pages', audience: 'All Staff',
    audienceColor: '#14B8A6', audienceBg: '#F0FDFA',
    color: '#14B8A6', bg: 'bg-teal-50', border: 'border-teal-100',
    href: '#',
  },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const GuidesSection: FC = () => (
  <section id="guides" aria-labelledby="guides-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-amber-50 text-brand-amber text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-amber-100">
          Free Downloads
        </span>
        <h2 id="guides-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Guides &amp; Resources<br />
          <span className="text-brand-amber">Free for Every School</span>
        </h2>
        <p className="mt-4 text-gray-600 text-sm max-w-lg mx-auto">
          Professionally written guides for every role — download as PDF, no sign-up required.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {GUIDES.map((g) => (
          <motion.div key={g.title} variants={cardVariants} whileHover={{ y: -4 }}>
            <Card className={`h-full ${g.bg} ${g.border} shadow-none`}>
              <CardContent className="p-6 flex flex-col gap-4">

                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl" aria-hidden="true">{g.icon}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] flex-shrink-0"
                    style={{ color: g.audienceColor, borderColor: `${g.audienceColor}30`, backgroundColor: g.audienceBg }}
                  >
                    {g.audience}
                  </Badge>
                </div>

                <h3 className="font-black text-sm text-ink leading-snug">{g.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed flex-1">{g.desc}</p>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/60">
                  <span className="text-[11px] text-ink-light font-medium">📄 {g.pages}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="text-xs font-bold transition-all"
                    style={{ borderColor: `${g.color}50`, color: g.color }}
                  >
                    <a href={g.href} download aria-label={`Download ${g.title}`}>
                      Download PDF →
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default GuidesSection;
