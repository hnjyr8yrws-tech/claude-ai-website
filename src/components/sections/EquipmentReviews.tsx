/**
 * EquipmentReviews.tsx — IT Equipment for Schools
 * Dark slate section background — strong alternation from white sections
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ITEMS = [
  {
    icon: '💻', category: 'Student Laptops & Chromebooks',
    recs: 'Acer Chromebook Spin 512, Lenovo 300e',
    safetyNote: 'Use Managed ChromeOS + KCSIE-compliant content filtering.',
    badge: 'Most Popular', accent: '#60A5FA',
  },
  {
    icon: '📱', category: 'iPads & Tablets',
    recs: 'iPad 10th Gen, Samsung Galaxy Tab A9',
    safetyNote: 'Enable Guided Access and Screen Time before deployment.',
    badge: 'SEND Friendly', accent: '#34D399',
  },
  {
    icon: '🖥️', category: 'Teacher Laptops',
    recs: 'Dell Latitude 7440, Microsoft Surface Pro 9',
    safetyNote: 'Full-disk encryption (BitLocker) and MAM enrollment required.',
    badge: 'Staff Pick', accent: '#A78BFA',
  },
  {
    icon: '🖱️', category: 'Desktop PCs',
    recs: 'HP EliteDesk 800 G6, Dell OptiPlex 7010',
    safetyNote: 'Manage via Intune or Jamf to reduce shadow IT risk.',
    badge: '', accent: '#FBBF24',
  },
  {
    icon: '📺', category: 'Interactive Whiteboards',
    recs: 'SMART Board MX, Promethean ActivPanel 9',
    safetyNote: 'Ensure boards are behind the school firewall by default.',
    badge: 'Ofsted Ready', accent: '#F87171',
  },
  {
    icon: '🔦', category: 'Projectors & Classroom Setups',
    recs: 'Epson EB-W52, BenQ MW612',
    safetyNote: 'No data stored on projectors — low risk.',
    badge: '', accent: '#2DD4BF',
  },
  {
    icon: '📷', category: 'Document Cameras',
    recs: 'Elmo MO-2L, Ipevo V4K Ultra HD',
    safetyNote: 'Do not stream student work live without parental consent.',
    badge: 'SEND Approved', accent: '#34D399',
  },
  {
    icon: '📸', category: 'Webcams',
    recs: 'Logitech C920s, Microsoft LifeCam HD-3000',
    safetyNote: 'Disable webcams on student devices by default in MDM.',
    badge: '', accent: '#60A5FA',
  },
  {
    icon: '🎧', category: 'AI Headsets & Microphones',
    recs: 'Jabra Evolve2 30, Poly Voyager Focus 2',
    safetyNote: 'Confirm mic data is not stored by the AI provider.',
    badge: 'AI Ready', accent: '#A78BFA',
  },
] as const;

const EquipmentReviews: FC = () => (
  <section id="equipment" aria-labelledby="equipment-heading" className="bg-[#1E293B] py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-white/10 text-white text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-white/20">
          Equipment Reviews
        </span>
        <h2 id="equipment-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          IT Equipment for<br />
          <span className="text-[#FBBF24]">AI-Ready Schools</span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm max-w-lg mx-auto">
          Curated recommendations with safety notes. Affiliate links fund our independent reviews.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.05 }}
      >
        {ITEMS.map((item) => (
          <motion.div
            key={item.category}
            variants={{
              hidden:  { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
            }}
            whileHover={{ y: -4 }}
          >
            <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors">

              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                {item.badge && (
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ color: item.accent, backgroundColor: `${item.accent}20` }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="font-black text-sm text-white">{item.category}</h3>
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Picks: </span>{item.recs}
              </p>

              {/* Safety note */}
              <div className="flex gap-2 bg-white/5 rounded-xl px-3 py-2.5">
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: item.accent }}>⚠</span>
                <p className="text-xs text-slate-400 leading-relaxed">{item.safetyNote}</p>
              </div>

              <Button
                size="sm"
                asChild
                className="mt-auto text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl transition-colors"
              >
                <a href="#" target="_blank" rel="noopener noreferrer sponsored">
                  Shop Gear →
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default EquipmentReviews;
