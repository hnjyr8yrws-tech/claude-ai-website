/**
 * ExploreCategoriesSection.tsx — "Explore by Category"
 * 3 cards: AI Tools, Software, Training
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

interface CategoryCard {
  icon: string;
  title: string;
  description: string;
  count: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    icon: '🤖',
    title: 'AI Tools',
    description: 'Discover the best AI tools for education — safety-rated, reviewed, and ready to use.',
    count: '80+ tools',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  {
    icon: '💻',
    title: 'Software',
    description: 'Essential software and apps for schools, teachers, and learning environments.',
    count: '40+ tools',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
  },
  {
    icon: '🎓',
    title: 'Training',
    description: 'Free and paid courses to help educators and professionals build AI skills confidently.',
    count: '20+ courses',
    color: '#14b8a6',
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

const ExploreCategoriesSection: FC<{ onExplore?: (category: string) => void }> = ({ onExplore }) => (
  <section id="categories" aria-labelledby="categories-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-gray-100 text-gray-500 text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full mb-4">
          Browse Everything
        </span>
        <h2 id="categories-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
          Explore by Category
        </h2>
        <p className="mt-3 text-gray-500 text-base max-w-md mx-auto">
          Find exactly what you need — tools, software, or training for every role.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.title} variants={cardVariants}>
            <motion.div
              whileHover={{ y: -5, boxShadow: `0 20px 48px rgba(0,0,0,0.10)` }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="h-full rounded-2xl border p-7 flex flex-col gap-5 cursor-pointer"
              style={{
                backgroundColor: cat.bgColor,
                borderColor: cat.borderColor,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              {/* Icon */}
              <div className="text-4xl" aria-hidden="true">{cat.icon}</div>

              {/* Text */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-gray-900">{cat.title}</h3>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ color: cat.color, backgroundColor: 'rgba(255,255,255,0.7)' }}
                  >
                    {cat.count}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{cat.description}</p>
              </div>

              {/* CTA */}
              <motion.button
                onClick={() => onExplore?.(cat.title)}
                whileHover={{ x: 3 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors
                           focus-visible:outline-none focus-visible:ring-2 rounded"
                style={{ color: cat.color }}
                aria-label={`Explore ${cat.title}`}
              >
                Explore {cat.title} →
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
);

export default ExploreCategoriesSection;
