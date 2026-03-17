/**
 * EquipmentReviews.tsx — IT Equipment for Schools
 * 9 categories with safety notes + affiliate CTAs
 */

import { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ITEMS = [
  {
    icon: '💻',
    category: 'Student Laptops & Chromebooks',
    recs: 'Acer Chromebook Spin 512, Lenovo 300e Chromebook',
    safetyNote: 'Look for ManagedChrome OS support and KCSIE-compliant content filtering built in.',
    badge: 'Most Popular', badgeColor: '#3B82F6', badgeBg: '#EFF6FF',
    affiliateHref: '#',
  },
  {
    icon: '📱',
    category: 'iPads & Tablets',
    recs: 'iPad 10th Gen, Samsung Galaxy Tab A9',
    safetyNote: 'Enable Guided Access and Screen Time restrictions before deploying to students.',
    badge: 'SEND Friendly', badgeColor: '#22C55E', badgeBg: '#F0FDF4',
    affiliateHref: '#',
  },
  {
    icon: '🖥️',
    category: 'Teacher Laptops',
    recs: 'Dell Latitude 7440, Microsoft Surface Pro 9',
    safetyNote: 'Ensure full-disk encryption (BitLocker) and MAM enrollment before issuing.',
    badge: 'Staff Pick', badgeColor: '#8B5CF6', badgeBg: '#F5F3FF',
    affiliateHref: '#',
  },
  {
    icon: '🖱️',
    category: 'Desktop PCs',
    recs: 'HP EliteDesk 800 G6, Dell OptiPlex 7010',
    safetyNote: 'Managed desktops reduce shadow IT risk — use MDM tools like Intune or Jamf.',
    badge: '', badgeColor: '', badgeBg: '',
    affiliateHref: '#',
  },
  {
    icon: '📺',
    category: 'Interactive Whiteboards',
    recs: 'SMART Board MX, Promethean ActivPanel 9',
    safetyNote: 'Ensure boards are behind the school firewall — some models have open browser access by default.',
    badge: 'Ofsted Ready', badgeColor: '#D97706', badgeBg: '#FEF3C7',
    affiliateHref: '#',
  },
  {
    icon: '🔦',
    category: 'Projectors & Classroom Setups',
    recs: 'Epson EB-W52, BenQ MW612',
    safetyNote: 'No data stored on projectors — low risk. Ensure HDMI cables are locked to prevent tampering.',
    badge: '', badgeColor: '', badgeBg: '',
    affiliateHref: '#',
  },
  {
    icon: '📷',
    category: 'Document Cameras',
    recs: 'Elmo MO-2L, Ipevo V4K Ultra HD',
    safetyNote: 'Do not stream student work live to external platforms without parental consent.',
    badge: 'SEND Approved', badgeColor: '#22C55E', badgeBg: '#F0FDF4',
    affiliateHref: '#',
  },
  {
    icon: '📸',
    category: 'Webcams',
    recs: 'Logitech C920s, Microsoft LifeCam HD-3000',
    safetyNote: 'Disable webcams on student devices by default in your MDM policy.',
    badge: '', badgeColor: '', badgeBg: '',
    affiliateHref: '#',
  },
  {
    icon: '🎧',
    category: 'AI Headsets with Microphones',
    recs: 'Jabra Evolve2 30, Poly Voyager Focus 2',
    safetyNote: 'AI-enhanced noise cancellation is ideal for dictation tools — confirm mic data is not stored.',
    badge: 'AI Ready', badgeColor: '#14B8A6', badgeBg: '#F0FDFA',
    affiliateHref: '#',
  },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const EquipmentReviews: FC = () => (
  <section id="equipment" aria-labelledby="equipment-heading" className="bg-gray-50/60 py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-orange-50 text-brand-orange text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-orange-100">
          Equipment Reviews
        </span>
        <h2 id="equipment-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          IT Equipment for<br />
          <span className="text-brand-orange">AI-Ready Schools</span>
        </h2>
        <p className="mt-4 text-gray-600 text-sm max-w-lg mx-auto">
          Curated gear recommendations with safety notes for each category. Affiliate links help fund our independent reviews.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ staggerChildren: 0.06 }}
      >
        {ITEMS.map((item) => (
          <motion.div key={item.category} variants={cardVariants} whileHover={{ y: -4 }}>
            <Card className="h-full shadow-none border-gray-100">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold flex-shrink-0"
                      style={{ color: item.badgeColor, borderColor: `${item.badgeColor}30`, backgroundColor: item.badgeBg }}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                <h3 className="font-black text-sm text-ink">{item.category}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-ink">Recommended: </span>{item.recs}
                </p>

                {/* Safety note */}
                <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex gap-2">
                  <span className="text-amber-600 flex-shrink-0 text-xs mt-0.5">⚠️</span>
                  <p className="text-xs text-amber-800 leading-relaxed">{item.safetyNote}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="mt-auto text-xs font-bold border-brand-orange/30 text-brand-orange hover:bg-brand-orange hover:text-white transition-all"
                >
                  <a href={item.affiliateHref} target="_blank" rel="noopener noreferrer sponsored">
                    Shop Recommended Gear →
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default EquipmentReviews;
