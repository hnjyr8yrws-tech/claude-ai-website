/**
 * Blog.tsx — Latest 4 articles
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ARTICLES = [
  {
    tag: 'Inclusion', tagColor: '#8B5CF6', tagBg: '#F5F3FF',
    title: "AI for Inclusive Learning: A SENCO's Guide",
    excerpt: 'How SENCOs and inclusion leads are using AI to create more accessible resources — and the tools that are actually making a difference.',
    date: 'March 2026', readTime: '7 min', featured: true,
  },
  {
    tag: 'Leadership', tagColor: '#3B82F6', tagBg: '#EFF6FF',
    title: 'Best AI Tools for School Leaders in 2026',
    excerpt: "Our updated guide to the top AI tools for headteachers and SLT — safety-rated, independently reviewed, and mapped to Ofsted expectations.",
    date: 'March 2026', readTime: '10 min', featured: false,
  },
  {
    tag: 'Privacy', tagColor: '#22C55E', tagBg: '#F0FDF4',
    title: 'AI Privacy Guide for UK Parents',
    excerpt: "What data does your child's school AI tool collect? Plain-English answers to every question parents are asking right now.",
    date: 'February 2026', readTime: '6 min', featured: false,
  },
  {
    tag: 'Ofsted', tagColor: '#D97706', tagBg: '#FEF3C7',
    title: 'How to Write an AI Policy That Satisfies Ofsted',
    excerpt: "Inspectors are asking about AI. Here's exactly what to include in your school's AI policy — with a free template you can download today.",
    date: 'February 2026', readTime: '8 min', featured: false,
  },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const Blog: FC = () => (
  <section id="blog" aria-labelledby="blog-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span className="inline-block bg-blue-50 text-brand-blue text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            Latest
          </span>
          <h2 id="blog-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            From the Blog
          </h2>
        </div>
        <Button
          variant="outline"
          className="flex-shrink-0 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold
                     hover:border-brand-blue hover:text-brand-blue transition-all"
        >
          View All Articles →
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.07 }}
      >
        {ARTICLES.map((a) => (
          <motion.article
            key={a.title}
            variants={cardVariants}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full cursor-pointer shadow-none border-gray-100 hover:shadow-card-hover">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold"
                    style={{ color: a.tagColor, borderColor: `${a.tagColor}30`, backgroundColor: a.tagBg }}
                  >
                    {a.tag}
                  </Badge>
                  {a.featured && (
                    <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-700">
                      ★ Featured
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-black text-ink leading-snug">{a.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed flex-1">{a.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-ink-pale">{a.date}</span>
                  <span className="text-[11px] text-ink-pale">{a.readTime} read</span>
                </div>
              </CardContent>
            </Card>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Blog;
