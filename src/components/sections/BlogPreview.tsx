/**
 * BlogPreview.tsx — Guides & Resources
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const GUIDES = [
  {
    icon: '🧑‍🏫',
    title: 'Teacher Guide to AI',
    desc: 'A practical introduction to using AI tools safely in the classroom, with step-by-step guidance for getting started.',
    tag: 'For Teachers', tagColor: '#3B82F6', tagBg: '#EFF6FF',
    readTime: '8 min read',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Parent Guide to AI in Schools',
    desc: 'What parents need to know about AI — data privacy, screen time, and how to support learning at home responsibly.',
    tag: 'For Parents', tagColor: '#22C55E', tagBg: '#F0FDF4',
    readTime: '6 min read',
  },
  {
    icon: '🎒',
    title: 'Student Guide to Using AI Safely',
    desc: 'How students can use AI tools responsibly, avoid plagiarism, protect their privacy, and think critically about AI output.',
    tag: 'For Students', tagColor: '#8B5CF6', tagBg: '#F5F3FF',
    readTime: '5 min read',
  },
  {
    icon: '🏫',
    title: 'School AI Policy Template',
    desc: 'A free, downloadable template to help your school create a clear AI use policy for staff, students, and parents.',
    tag: 'For Schools', tagColor: '#F97316', tagBg: '#FFF7ED',
    readTime: 'Free download',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const BlogPreview: FC = () => (
  <section id="blog" aria-labelledby="guides-heading" className="bg-[#FAFAFA] py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-purple-50 text-purple-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-purple-100">
          Free Resources
        </span>
        <h2 id="guides-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Guides &amp;<br />
          <span className="text-brand-purple">Resources</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          Practical, free guides for everyone in the school community.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {GUIDES.map((guide) => (
          <motion.div
            key={guide.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-4 cursor-pointer transition-shadow"
          >
            <span className="text-3xl" aria-hidden="true">{guide.icon}</span>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full w-fit"
              style={{ color: guide.tagColor, backgroundColor: guide.tagBg }}
            >
              {guide.tag}
            </span>
            <h3 className="text-base font-black text-ink leading-snug">{guide.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{guide.desc}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{guide.readTime}</span>
              <span className="text-xs font-bold" style={{ color: guide.tagColor }}>Read →</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BlogPreview;
