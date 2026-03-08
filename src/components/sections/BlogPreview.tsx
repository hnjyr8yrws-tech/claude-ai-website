/**
 * BlogPreview.tsx — Latest Articles / Blog
 * eLearning Industry articles grid · reading time · category chips · newsletter prompt
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Article {
  slug: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
}

const ARTICLES: Article[] = [
  {
    slug: 'chatgpt-classroom-guide',
    category: 'Teacher Guide',
    categoryColor: '#3B82F6',
    categoryBg: '#EFF6FF',
    title: 'The Complete Teacher\'s Guide to ChatGPT in 2026',
    excerpt: 'From lesson planning to differentiation, here\'s how to use ChatGPT responsibly and effectively without losing the human element that makes great teaching.',
    author: 'Sarah Mitchell',
    role: 'Deputy Head, Manchester',
    date: '12 Feb 2026',
    readTime: '8 min read',
  },
  {
    slug: 'ai-send-pupils',
    category: 'SEND & Inclusion',
    categoryColor: '#8B5CF6',
    categoryBg: '#F5F3FF',
    title: 'How AI Is Transforming Support for SEND Pupils',
    excerpt: 'Real examples from UK classrooms showing how text-to-speech, adaptive quizzing, and AI writing assistants are levelling the playing field.',
    author: 'Dr. James Okafor',
    role: 'SENCO, Birmingham',
    date: '28 Jan 2026',
    readTime: '6 min read',
  },
  {
    slug: 'gdpr-ai-tools-schools',
    category: 'Compliance',
    categoryColor: '#F97316',
    categoryBg: '#FFF7ED',
    title: '5 GDPR Questions Every School Must Ask Before Using AI',
    excerpt: 'Data residency, parental consent, third-party processors — our DPO consultant breaks down what your school\'s due diligence should cover.',
    author: 'Helen Brooks',
    role: 'DPO Consultant',
    date: '15 Jan 2026',
    readTime: '5 min read',
  },
  {
    slug: 'best-ai-tools-primary',
    category: 'Primary Education',
    categoryColor: '#22C55E',
    categoryBg: '#F0FDF4',
    title: 'The 10 Best AI Tools for Primary Schools in 2026',
    excerpt: 'Age-appropriate, GDPR-safe, and curriculum-aligned: our editorial team\'s definitive round-up for KS1 and KS2 classrooms.',
    author: 'Promptly Editorial',
    role: 'Reviewed & Verified',
    date: '5 Jan 2026',
    readTime: '10 min read',
  },
  {
    slug: 'marking-with-ai',
    category: 'Productivity',
    categoryColor: '#3B82F6',
    categoryBg: '#EFF6FF',
    title: 'I Used AI to Mark for a Week — Here\'s What Happened',
    excerpt: 'An honest account from a secondary English teacher who trialled AI marking assistants across Years 9 and 11. The results were surprising.',
    author: 'Tom Clarke',
    role: 'English Teacher, Leeds',
    date: '20 Dec 2025',
    readTime: '7 min read',
  },
];

// ─── Article card ──────────────────────────────────────────────────────────────

const ArticleCard: FC<{ article: Article; featured?: boolean }> = ({ article, featured }) => (
  <motion.article
    variants={cardVariants}
    whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
    className={`card-light rounded-2xl flex flex-col overflow-hidden ${featured ? 'sm:col-span-2' : ''}`}
  >
    <div className="h-1 w-full" style={{ backgroundColor: article.categoryColor }} />
    <div className={`p-5 flex flex-col gap-3 flex-1 ${featured ? 'sm:p-7' : ''}`}>
      <span
        className="text-[9px] font-black px-2.5 py-1 rounded-full border self-start"
        style={{ color: article.categoryColor, backgroundColor: article.categoryBg, borderColor: `${article.categoryColor}30` }}
      >
        {article.category}
      </span>
      <h3 className={`font-black text-ink leading-snug ${featured ? 'text-xl sm:text-2xl' : 'text-sm'}`}>
        {article.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed flex-1">{article.excerpt}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <div className="text-xs font-bold text-ink">{article.author}</div>
          <div className="text-[10px] text-gray-400">{article.role}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400">{article.date}</div>
          <div className="text-[10px] font-bold text-brand-blue">{article.readTime}</div>
        </div>
      </div>
    </div>
  </motion.article>
);

// ─── Main component ────────────────────────────────────────────────────────────

const BlogPreview: FC = () => (
  <section id="blog" aria-labelledby="blog-heading"
           className="bg-white py-20 sm:py-24 border-y border-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div
        className="flex flex-wrap items-end justify-between gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-brand-blue uppercase mb-3 block">
            Latest Articles
          </span>
          <h2 id="blog-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            Guides, Reviews<br />
            <span className="text-brand-blue">&amp; Real Opinions</span>
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl border-2 border-brand-blue text-brand-blue font-black text-sm
                     hover:bg-brand-blue hover:text-white transition-all
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          All Articles →
        </motion.button>
      </motion.div>

      {/* Articles grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {ARTICLES.map((article, i) => (
          <ArticleCard key={article.slug} article={article} featured={i === 0} />
        ))}
      </motion.div>

      {/* Newsletter CTA */}
      <motion.div
        className="mt-12 bg-gradient-to-r from-brand-blue to-brand-purple rounded-3xl p-8 sm:p-10 text-white text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-2xl sm:text-3xl font-black mb-2">Get the weekly EdTech AI digest</div>
        <p className="text-white/70 text-sm mb-6 max-w-sm mx-auto">
          Every Monday: new tool reviews, safety alerts, and lesson ideas. No spam. Unsubscribe anytime.
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@school.ac.uk"
            aria-label="Email address"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm font-semibold
                       focus:outline-none focus:ring-2 focus:ring-white/50
                       bg-white/10 placeholder-white/50 text-white border border-white/20"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-3 rounded-xl text-sm font-black bg-white text-brand-blue
                       shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Subscribe Free
          </motion.button>
        </div>
        <p className="text-white/40 text-[10px] mt-3">
          Joining 12,000+ UK educators. No ads, no affiliate content in the newsletter.
        </p>
      </motion.div>
    </div>
  </section>
);

export default BlogPreview;
