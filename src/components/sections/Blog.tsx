/**
 * Blog.tsx — Latest Blog Articles
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const ARTICLES = [
  {
    tag: 'Inclusion', tagColor: '#8B5CF6', tagBg: '#F5F3FF',
    title: 'AI for Inclusive Learning',
    excerpt: 'How AI tools are helping teachers create more accessible resources for students with SEND — and what to look for when choosing them.',
    date: 'March 2025',
    readTime: '7 min read',
  },
  {
    tag: 'Teaching', tagColor: '#3B82F6', tagBg: '#EFF6FF',
    title: 'Best AI Tools for Teachers in 2025',
    excerpt: "Our updated round-up of the top AI tools for UK teachers — independently tested and safety-rated for classroom use.",
    date: 'March 2025',
    readTime: '10 min read',
    featured: true,
  },
  {
    tag: 'Privacy', tagColor: '#22C55E', tagBg: '#F0FDF4',
    title: 'AI Privacy Guide for Parents',
    excerpt: "What data does your child's school AI tool collect? A plain-English guide to AI privacy in education.",
    date: 'February 2025',
    readTime: '6 min read',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Blog: FC = () => (
  <section aria-labelledby="blog-latest-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            Latest
          </span>
          <h2 id="blog-latest-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            From the Blog
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm
                     hover:border-brand-blue hover:text-brand-blue transition-all flex-shrink-0
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          View All Articles →
        </motion.button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.08 }}
      >
        {ARTICLES.map((article) => (
          <motion.article
            key={article.title}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover p-6 flex flex-col gap-4 cursor-pointer transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ color: article.tagColor, backgroundColor: article.tagBg }}
              >
                {article.tag}
              </span>
              {article.featured && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                  ★ Featured
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-ink leading-snug">{article.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{article.excerpt}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{article.date}</span>
              <span className="text-xs text-gray-400">{article.readTime}</span>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Blog;
