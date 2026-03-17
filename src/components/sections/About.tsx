/**
 * About.tsx — Meet the Team
 * Donna · Chloe · Charles
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TEAM = [
  {
    initials: 'D',
    name: 'Donna',
    role: 'Head of Content & Safety Reviews',
    bio: "Ex-secondary school teacher with 14+ years in UK classrooms. Donna tests every AI tool in a real school before it appears on Promptly and personally signs off every safety score. She knows what actually works on a Monday morning.",
    color: '#3B82F6', bg: '#EFF6FF',
    badge: 'Curriculum Lead',
  },
  {
    initials: 'C',
    name: 'Chloe',
    role: 'Content & Community',
    bio: "Former EdTech consultant and passionate educator. Chloe builds Promptly's content strategy, manages the community, and makes sure every guide is practical enough to use the same day you read it.",
    color: '#8B5CF6', bg: '#F5F3FF',
    badge: 'Content Lead',
  },
  {
    initials: 'C',
    name: 'Charles',
    role: 'Safety, Tech & Compliance',
    bio: 'Leads all GDPR, data governance, and technical assessments on Promptly. Every safety score, every compliance note, and every technical recommendation carries Charles\'s sign-off before it goes live.',
    color: '#14B8A6', bg: '#F0FDFA',
    badge: 'Safety Lead',
  },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const About: FC = () => (
  <section id="team" aria-labelledby="team-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-blue-50 text-brand-blue text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
          The Team
        </span>
        <h2 id="team-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Meet the Team
        </h2>
        <p className="mt-4 text-gray-600 text-sm max-w-md mx-auto">
          Built by educators, not tech companies.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.1 }}
      >
        {TEAM.map((m) => (
          <motion.div key={m.name + m.role} variants={cardVariants} whileHover={{ y: -5 }}>
            <Card className="h-full shadow-none border-gray-100 hover:shadow-card-hover">
              <CardContent className="p-6 flex flex-col gap-4 text-center">
                {/* Avatar — replace with cartoon image when ready */}
                {/* <img src={`/images/${m.name.toLowerCase()}-cartoon.jpg`} alt={m.name} className="w-24 h-24 rounded-full mx-auto object-cover" /> */}
                <div
                  className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
                  style={{ backgroundColor: m.bg, color: m.color }}
                  aria-label={`${m.name} initials avatar`}
                >
                  {m.initials}
                </div>
                <Badge
                  variant="outline"
                  className="mx-auto text-[10px] font-bold"
                  style={{ color: m.color, borderColor: `${m.color}30`, backgroundColor: m.bg }}
                >
                  {m.badge}
                </Badge>
                <div>
                  <h3 className="text-lg font-black text-ink">{m.name}</h3>
                  <p className="text-xs text-ink-light font-medium mt-0.5">{m.role}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{m.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default About;
