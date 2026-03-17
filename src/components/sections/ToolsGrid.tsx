/**
 * ToolsGrid.tsx — Featured Categories
 * AI Tools · Training · IT Equipment
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';

const CATEGORIES = [
  {
    icon: '✨',
    title: 'AI Tools for Schools',
    desc: 'Instant logos, marketing posts, parent emails, SEO listings & more — built for education. Start free today.',
    cta: 'Explore Tools & Start Free →',
    color: '#3B82F6',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    href: '/tools',
  },
  {
    icon: '🎓',
    title: 'Training Courses',
    desc: 'Ofsted-ready AI training for teachers, leaders & finance teams. CPD accredited options available.',
    cta: 'Browse Top Courses →',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    href: '/training',
  },
  {
    icon: '💻',
    title: 'IT Equipment for AI',
    desc: 'Laptops, monitors, headsets & setups optimised for heavy AI use in classrooms & offices.',
    cta: 'Shop Recommended Gear →',
    color: '#14B8A6',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    href: '/it-equipment',
  },
];

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const ToolsGrid: FC = () => (
  <section id="tools" aria-labelledby="categories-heading" className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-6">

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 id="categories-heading" className="text-4xl font-bold text-gray-900 tracking-tight">
          Everything Your School Needs for AI Success
        </h2>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.1 }}
      >
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.title}
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.10)' }}
            className={`rounded-2xl border p-8 flex flex-col items-center text-center gap-5 bg-white
                        transition-shadow ${cat.border} shadow-sm`}
          >
            <span className="text-5xl" aria-hidden="true">{cat.icon}</span>
            <h3 className="text-2xl font-semibold text-gray-900">{cat.title}</h3>
            <p className="text-gray-600 leading-relaxed flex-1">{cat.desc}</p>
            <motion.a
              href={cat.href}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all text-center
                         focus-visible:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: cat.color,
                color: '#fff',
              }}
            >
              {cat.cta}
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ToolsGrid;
