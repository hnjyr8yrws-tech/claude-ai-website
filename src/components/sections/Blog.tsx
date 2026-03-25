/**
 * Blog.tsx — Latest 4 articles
 * Bento layout: featured article gets full-width dark card on top,
 * remaining 3 sit in a row below.
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ARTICLES = [
  {
    tag: 'Inclusion', tagColor: '#A78BFA',
    title: "AI for Inclusive Learning: A SENCO's Guide",
    excerpt: "How SENCOs and inclusion leads are using AI to create more accessible resources — and the tools that are actually making a difference in UK classrooms.",
    date: 'March 2026', readTime: '7 min', featured: true,
    bg: '#1E1B4B',   // deep indigo for featured
  },
  {
    tag: 'Leadership', tagColor: '#60A5FA',
    title: 'Best AI Tools for School Leaders in 2026',
    excerpt: "Our updated guide to the top AI tools for headteachers and SLT — safety-rated, independently reviewed.",
    date: 'March 2026', readTime: '10 min', featured: false,
    bg: '',
  },
  {
    tag: 'Privacy', tagColor: '#34D399',
    title: 'AI Privacy Guide for UK Parents',
    excerpt: "What data does your child's school AI tool collect? Plain-English answers to every question parents are asking.",
    date: 'February 2026', readTime: '6 min', featured: false,
    bg: '',
  },
  {
    tag: 'Ofsted', tagColor: '#FBBF24',
    title: "How to Write an AI Policy That Satisfies Ofsted",
    excerpt: "Inspectors are asking about AI. Here's exactly what to include — with a free template you can download today.",
    date: 'February 2026', readTime: '8 min', featured: false,
    bg: '',
  },
] as const;

const Blog: FC = () => {
  const [featured, ...rest] = ARTICLES;

  return (
    <section id="blog" aria-labelledby="blog-heading" className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="blog-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            From the Blog
          </h2>
          <Button
            variant="outline"
            className="flex-shrink-0 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold
                       hover:border-brand-blue hover:text-brand-blue transition-all"
          >
            View All Articles →
          </Button>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.07 }}
        >
          {/* Featured card — full width, bold dark bg */}
          <motion.article
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}
            whileHover={{ y: -3 }}
          >
            <div
              className="rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row gap-6 cursor-pointer"
              style={{ backgroundColor: featured.bg }}
            >
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ color: featured.tagColor, backgroundColor: `${featured.tagColor}20` }}
                  >
                    {featured.tag}
                  </span>
                  <span className="text-[10px] font-bold text-white/40 bg-white/10 px-2.5 py-1 rounded-full">
                    ★ Featured
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">{featured.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-xl">{featured.excerpt}</p>
                <div className="flex items-center gap-4 mt-auto pt-2">
                  <span className="text-xs text-white/40">{featured.date}</span>
                  <span className="text-xs text-white/40">{featured.readTime} read</span>
                  <span className="text-xs font-bold text-white/70 ml-auto hover:text-white transition-colors cursor-pointer">
                    Read article →
                  </span>
                </div>
              </div>
            </div>
          </motion.article>

          {/* 3 regular cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rest.map((a) => (
              <motion.article
                key={a.title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } } }}
                whileHover={{ y: -4 }}
              >
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-4 cursor-pointer hover:shadow-card-hover transition-shadow">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full w-fit"
                    style={{ color: a.tagColor, backgroundColor: `${a.tagColor}18` }}
                  >
                    {a.tag}
                  </span>
                  <h3 className="text-sm font-black text-ink leading-snug flex-1">{a.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{a.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-[11px] text-ink-pale">{a.date}</span>
                    <span className="text-[11px] text-ink-pale">{a.readTime} read</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
