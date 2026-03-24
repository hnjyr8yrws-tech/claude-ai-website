/**
 * Blog.tsx — Latest articles
 * Featured + 2 regular cards · clean light design · Read More CTAs
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

const ARTICLES = [
  {
    tag: 'For Teachers',
    tagColor: '#2563eb',
    tagBg: '#eff6ff',
    title: 'The Best AI Tools for Lesson Planning in 2026',
    excerpt: "Our updated guide to the top AI tools for lesson planning — tested by teachers, safety-rated, and ready to use in your classroom today.",
    date: 'March 2026',
    readTime: '8 min',
    featured: true,
  },
  {
    tag: 'For Parents',
    tagColor: '#7c3aed',
    tagBg: '#f5f3ff',
    title: 'AI Privacy Guide for UK Parents',
    excerpt: "What data does your child's school AI tool collect? Plain-English answers to every question parents are asking.",
    date: 'March 2026',
    readTime: '6 min',
    featured: false,
  },
  {
    tag: 'Leadership',
    tagColor: '#14b8a6',
    tagBg: '#f0fdfa',
    title: "How to Write an AI Policy That Satisfies Ofsted",
    excerpt: "Inspectors are now asking about AI. Here's exactly what to include in your policy — with a free template you can download today.",
    date: 'February 2026',
    readTime: '9 min',
    featured: false,
  },
] as const;

const Blog: FC = () => {
  const [featured, ...rest] = ARTICLES;

  return (
    <section id="blog" aria-labelledby="blog-heading" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="inline-block bg-gray-100 text-gray-500 text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full mb-3">
              Latest Articles
            </span>
            <h2 id="blog-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              From the Blog
            </h2>
          </div>
          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-bold
                       hover:border-[#2563eb] hover:text-[#2563eb] transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
          >
            View All Articles →
          </motion.button>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.07 }}
        >
          {/* Featured article */}
          <motion.article
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}
          >
            <motion.div
              whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(37,99,235,0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="rounded-2xl p-7 sm:p-9 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                boxShadow: '0 4px 20px rgba(37,99,235,0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ color: featured.tagColor, backgroundColor: featured.tagBg }}
                >
                  {featured.tag}
                </span>
                <span className="text-[10px] font-bold text-white/50 bg-white/10 px-2.5 py-1 rounded-full">
                  ★ Featured
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3">
                {featured.title}
              </h3>
              <p className="text-sm text-white/65 leading-relaxed max-w-2xl mb-5">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/40">{featured.date}</span>
                <span className="text-xs text-white/40">{featured.readTime} read</span>
                <span className="text-xs font-bold text-white ml-auto hover:text-white/80 transition-colors cursor-pointer">
                  Read More →
                </span>
              </div>
            </motion.div>
          </motion.article>

          {/* Regular articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((a) => (
              <motion.article
                key={a.title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}
              >
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.09)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="h-full rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-4 cursor-pointer"
                  style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
                >
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full w-fit"
                    style={{ color: a.tagColor, backgroundColor: a.tagBg }}
                  >
                    {a.tag}
                  </span>
                  <h3 className="text-base font-black text-gray-900 leading-snug flex-1">{a.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span>{a.date}</span>
                      <span>·</span>
                      <span>{a.readTime} read</span>
                    </div>
                    <span className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer">
                      Read More →
                    </span>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Blog;
