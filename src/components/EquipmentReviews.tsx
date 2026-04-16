/**
 * EquipmentReviews.tsx — AI Equipment Hub
 * "Devices, tools & assistive tech for UK schools."
 *
 * Layout  : Cream bg · lime wave lines · audience browse cards · product grid
 * Style   : Playfair Display headings · coral CTAs · white/pastel cards
 * Data    : Devices, SEND tech, AI software — from getpromptly master base
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────

const CORAL = '#F05A4A';
const LIME  = '#84CC16';

// ── Wave SVG ───────────────────────────────────────────────────────────────

const WaveLines: FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1200 800"
    fill="none"
    style={{ opacity: 0.13 }}
  >
    {Array.from({ length: 20 }, (_, i) => (
      <path
        key={i}
        d={`M-100 ${48 + i * 42} Q300 ${14 + i * 42} 600 ${48 + i * 42} T1300 ${48 + i * 42}`}
        stroke={LIME}
        strokeWidth="1.3"
      />
    ))}
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────

type Audience = 'All' | 'Students' | 'Parents & Carers' | 'Schools & Trusts' | 'SEND';
type Category = 'Devices & Tablets' | 'Assistive Technology' | 'AI Software' | 'Audio & Peripherals' | 'Accessories';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: Category;
  audiences: Audience[];
  description: string;
  price: string;
  priceBand: 'Budget' | 'Mid-range' | 'Premium' | 'Free' | 'Subscription';
  safetyScore: number | null;
  gdpr: boolean;
  link: string | null;
  badge?: string;
  emoji: string;
}

// ── Product data (from getpromptly master base) ────────────────────────────

const PRODUCTS: Product[] = [
  // ── Devices & Tablets ──
  {
    id: 1,
    name: 'iPad (10th Generation)',
    brand: 'Apple',
    category: 'Devices & Tablets',
    audiences: ['Students', 'Schools & Trusts'],
    description: 'The best all-round classroom tablet. Durable, fast, and compatible with Apple Pencil. Excellent accessibility features for SEND.',
    price: '£329',
    priceBand: 'Premium',
    safetyScore: 9.4,
    gdpr: true,
    link: null,
    badge: 'Editor\'s Pick',
    emoji: '📱',
  },
  {
    id: 2,
    name: 'Fire HD 10 Kids Edition',
    brand: 'Amazon',
    category: 'Devices & Tablets',
    audiences: ['Students', 'Parents & Carers'],
    description: "Rugged kids' tablet with a 2-year worry-free guarantee, parental controls, and Amazon Kids+ content. Great value for home learning.",
    price: '£179.99',
    priceBand: 'Budget',
    safetyScore: 8.8,
    gdpr: true,
    link: null,
    badge: 'Best Value',
    emoji: '🔥',
  },
  {
    id: 3,
    name: 'Tab M10 Plus (3rd Gen)',
    brand: 'Lenovo',
    category: 'Devices & Tablets',
    audiences: ['Schools & Trusts', 'Students'],
    description: 'Affordable Android tablet with 10.6" display and long battery life — popular for school bulk deployment and MDM management.',
    price: '£229',
    priceBand: 'Mid-range',
    safetyScore: 8.5,
    gdpr: true,
    link: null,
    emoji: '💻',
  },
  {
    id: 4,
    name: 'Chromebook Spin 512',
    brand: 'Acer',
    category: 'Devices & Tablets',
    audiences: ['Schools & Trusts', 'Students'],
    description: 'Rugged, convertible Chromebook for Google Workspace EDU. Touch screen, stylus-ready, and built for classroom use.',
    price: '£299',
    priceBand: 'Mid-range',
    safetyScore: 9.0,
    gdpr: true,
    link: null,
    badge: 'School Favourite',
    emoji: '🖥️',
  },
  {
    id: 5,
    name: 'Surface Go 3',
    brand: 'Microsoft',
    category: 'Devices & Tablets',
    audiences: ['Schools & Trusts', 'Students'],
    description: 'Compact Windows tablet with full Microsoft 365 access. Perfect for older students who need a proper OS in a light form factor.',
    price: '£399',
    priceBand: 'Premium',
    safetyScore: 9.1,
    gdpr: true,
    link: null,
    emoji: '🪟',
  },
  {
    id: 6,
    name: 'Fire HD 8 Kids Pro',
    brand: 'Amazon',
    category: 'Devices & Tablets',
    audiences: ['Parents & Carers', 'Students'],
    description: 'Compact 8" kids tablet with adjustable parental controls. Includes one year of Amazon Kids+ and a child-safe case.',
    price: '£149.99',
    priceBand: 'Budget',
    safetyScore: 8.6,
    gdpr: true,
    link: null,
    emoji: '📲',
  },

  // ── Assistive Technology ──
  {
    id: 7,
    name: 'Read&Write',
    brand: 'Texthelp',
    category: 'Assistive Technology',
    audiences: ['SEND', 'Schools & Trusts', 'Students'],
    description: 'Award-winning literacy support tool. Text-to-speech, word prediction, PDF reader, and vocabulary tools — loved by SENCOs across the UK.',
    price: 'From £83/yr per pupil',
    priceBand: 'Subscription',
    safetyScore: 9.3,
    gdpr: true,
    link: null,
    badge: 'SENCO Approved',
    emoji: '📖',
  },
  {
    id: 8,
    name: 'C-Pen Reader 2',
    brand: 'C-Pen',
    category: 'Assistive Technology',
    audiences: ['SEND', 'Students'],
    description: 'Handheld pen scanner that reads text aloud instantly. Ideal for dyslexic learners — no WiFi needed, allowed in GCSE exams.',
    price: '£179',
    priceBand: 'Mid-range',
    safetyScore: 9.5,
    gdpr: true,
    link: null,
    badge: 'Exam Approved',
    emoji: '✏️',
  },
  {
    id: 9,
    name: 'Immersive Reader',
    brand: 'Microsoft',
    category: 'Assistive Technology',
    audiences: ['SEND', 'Students', 'Parents & Carers'],
    description: 'Free reading support tool built into Microsoft 365. Syllable display, line focus, picture dictionary, and read-aloud with natural voice.',
    price: 'Free',
    priceBand: 'Free',
    safetyScore: 9.3,
    gdpr: true,
    link: null,
    badge: 'Free Tool',
    emoji: '👁️',
  },
  {
    id: 10,
    name: 'Clicker 8',
    brand: 'Crick Software',
    category: 'Assistive Technology',
    audiences: ['SEND', 'Schools & Trusts'],
    description: "UK's leading writing support software for pupils with literacy difficulties. Predictive word grids, text-to-speech, and audio feedback.",
    price: 'From £150/yr (school)',
    priceBand: 'Subscription',
    safetyScore: 9.4,
    gdpr: true,
    link: null,
    emoji: '⌨️',
  },
  {
    id: 11,
    name: 'OrCam MyEye 2',
    brand: 'OrCam',
    category: 'Assistive Technology',
    audiences: ['SEND'],
    description: 'Wearable AI device that reads text, recognises faces, and identifies products — transformative for visually impaired learners.',
    price: 'TBD',
    priceBand: 'Premium',
    safetyScore: 9.1,
    gdpr: true,
    link: null,
    emoji: '🕶️',
  },
  {
    id: 12,
    name: 'Speechify',
    brand: 'Speechify',
    category: 'Assistive Technology',
    audiences: ['SEND', 'Students', 'Parents & Carers'],
    description: 'AI text-to-speech at up to 4.5× speed. Works on PDFs, web pages, books, and emails. Popular with dyslexic and ADHD learners.',
    price: 'Free / £139/yr Premium',
    priceBand: 'Subscription',
    safetyScore: 8.8,
    gdpr: true,
    link: null,
    emoji: '🔊',
  },

  // ── AI Software ──
  {
    id: 13,
    name: 'Khanmigo',
    brand: 'Khan Academy',
    category: 'AI Software',
    audiences: ['Students', 'Parents & Carers', 'Schools & Trusts'],
    description: 'Safe AI tutor aligned to curriculum. Never gives answers — guides pupils through problems step-by-step. Full teacher oversight.',
    price: 'Free for teachers / £44/yr pupils',
    priceBand: 'Free',
    safetyScore: 9.5,
    gdpr: true,
    link: null,
    badge: 'Highest Safety Score',
    emoji: '🏫',
  },
  {
    id: 14,
    name: 'Grammarly for Education',
    brand: 'Grammarly',
    category: 'AI Software',
    audiences: ['Students', 'Schools & Trusts'],
    description: 'AI writing assistant with plagiarism detection and tone suggestions. EDU version includes admin controls and usage analytics.',
    price: 'From £12/user/yr (EDU)',
    priceBand: 'Subscription',
    safetyScore: 9.4,
    gdpr: true,
    link: null,
    emoji: '✍️',
  },
  {
    id: 15,
    name: 'Otter.ai for Education',
    brand: 'Otter.ai',
    category: 'AI Software',
    audiences: ['Schools & Trusts', 'SEND'],
    description: 'Real-time AI transcription for meetings, CPD sessions, and parent evenings. Automatic summaries and searchable notes.',
    price: 'Free / £8.33/mo Pro',
    priceBand: 'Free',
    safetyScore: 8.9,
    gdpr: true,
    link: null,
    emoji: '🦦',
  },
  {
    id: 16,
    name: 'Century Tech',
    brand: 'Century',
    category: 'AI Software',
    audiences: ['Schools & Trusts', 'Students'],
    description: "AI-powered personalised learning platform with UK curriculum mapping. Adapts to every pupil's gaps in real time.",
    price: 'School licence (TBD)',
    priceBand: 'Subscription',
    safetyScore: 9.2,
    gdpr: true,
    link: null,
    emoji: '🧠',
  },
  {
    id: 17,
    name: 'Canva for Education',
    brand: 'Canva',
    category: 'AI Software',
    audiences: ['Schools & Trusts', 'Students', 'Parents & Carers'],
    description: 'Free for teachers and students. AI design, presentation builder, and Magic Write — brilliant for projects and displays.',
    price: 'Free for EDU',
    priceBand: 'Free',
    safetyScore: 9.3,
    gdpr: true,
    link: null,
    badge: 'Free for Schools',
    emoji: '🎨',
  },
  {
    id: 18,
    name: 'MagicSchool.ai',
    brand: 'MagicSchool',
    category: 'AI Software',
    audiences: ['Schools & Trusts'],
    description: 'AI toolkit for teachers — lesson plans, rubrics, report comments, and IEP generators trusted by 3M+ educators worldwide.',
    price: 'Free / £99/yr Pro',
    priceBand: 'Free',
    safetyScore: 9.1,
    gdpr: true,
    link: null,
    emoji: '🪄',
  },

  // ── Audio & Peripherals ──
  {
    id: 19,
    name: 'Jabra Evolve2 30',
    brand: 'Jabra',
    category: 'Audio & Peripherals',
    audiences: ['Schools & Trusts', 'SEND'],
    description: 'Professional USB headset with noise cancellation — ideal for remote learning sessions, transcription tools, and SEND use.',
    price: '£89',
    priceBand: 'Mid-range',
    safetyScore: null,
    gdpr: true,
    link: null,
    emoji: '🎧',
  },
  {
    id: 20,
    name: 'Logitech MX Keys Mini',
    brand: 'Logitech',
    category: 'Audio & Peripherals',
    audiences: ['Schools & Trusts', 'Students'],
    description: 'Compact wireless keyboard with whisper-quiet keys. Perfect for tablet pairing in classroom or home learning setups.',
    price: '£79.99',
    priceBand: 'Mid-range',
    safetyScore: null,
    gdpr: true,
    link: null,
    emoji: '⌨️',
  },

  // ── Accessories ──
  {
    id: 21,
    name: 'Apple Pencil (2nd Gen)',
    brand: 'Apple',
    category: 'Accessories',
    audiences: ['Students', 'SEND'],
    description: 'Precision stylus for iPad — transforms handwriting, note-taking, and art. Widely used in SEND provision for fine motor support.',
    price: '£119',
    priceBand: 'Premium',
    safetyScore: null,
    gdpr: true,
    link: null,
    emoji: '✒️',
  },
  {
    id: 22,
    name: 'Kensington BlackBelt Case',
    brand: 'Kensington',
    category: 'Accessories',
    audiences: ['Schools & Trusts', 'Students'],
    description: 'Military-grade rugged case for iPad. Built for school environments with a comfortable hand strap and screen protection.',
    price: '£49.99',
    priceBand: 'Budget',
    safetyScore: null,
    gdpr: true,
    link: null,
    emoji: '🛡️',
  },
];

// ── Audience browse cards ──────────────────────────────────────────────────

const AUDIENCE_CARDS: {
  id: Audience;
  emoji: string;
  label: string;
  desc: string;
  color: string;
  bg: string;
}[] = [
  { id: 'Students',         emoji: '🧑‍🎓', label: 'Students',         desc: 'Devices and AI tools for home and classroom learning.',      color: '#2563EB', bg: '#CFE6F3' },
  { id: 'Parents & Carers', emoji: '👨‍👧', label: 'Parents & Carers', desc: 'Safe, affordable tech for supporting learning at home.',      color: '#16A34A', bg: '#DDEFD2' },
  { id: 'Schools & Trusts', emoji: '🏫', label: 'Schools & Trusts',  desc: 'Bulk-ready, GDPR-compliant devices and software licences.',   color: '#7C3AED', bg: '#D9D2F4' },
  { id: 'SEND',             emoji: '♿', label: 'SEND',               desc: 'Assistive tech and accessibility tools for every learner.',   color: '#B45309', bg: '#F3E7A2' },
];

const CATEGORIES: ('All' | Category)[] = [
  'All', 'Devices & Tablets', 'Assistive Technology', 'AI Software', 'Audio & Peripherals', 'Accessories',
];

const PRICE_BAND_COLORS: Record<Product['priceBand'], { bg: string; text: string }> = {
  'Free':         { bg: '#DCFCE7', text: '#15803D' },
  'Budget':       { bg: '#FEF9C3', text: '#92400E' },
  'Mid-range':    { bg: '#DBEAFE', text: '#1D4ED8' },
  'Premium':      { bg: '#EDE9FE', text: '#6D28D9' },
  'Subscription': { bg: '#FFE4E6', text: '#BE123C' },
};

function scoreColor(s: number): string {
  if (s >= 9) return '#15803D';
  if (s >= 7) return '#B45309';
  return '#DC2626';
}

// ── Product card ───────────────────────────────────────────────────────────

const ProductCard: FC<{ product: Product; idx: number }> = ({ product, idx }) => {
  const pb = PRICE_BAND_COLORS[product.priceBand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.28 }}
      className="group bg-white rounded-2xl p-6 flex flex-col gap-4 relative"
      style={{
        border: '1.5px solid #E5E7EB',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(0,0,0,0.10)' }}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(240,90,74,0.1)', color: CORAL, border: `1px solid rgba(240,90,74,0.2)` }}
        >
          {product.badge}
        </span>
      )}

      {/* Icon + name */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: '#F8FAFC' }}
        >
          {product.emoji}
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="text-sm font-bold text-gray-900 leading-snug">{product.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{product.description}</p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {/* Price band */}
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: pb.bg, color: pb.text }}
        >
          {product.priceBand}
        </span>

        {/* GDPR */}
        {product.gdpr && (
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: '#DCFCE7', color: '#15803D' }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5l2 2 4-4" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            GDPR
          </span>
        )}

        {/* Safety score */}
        {product.safetyScore !== null && (
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full ml-auto"
            style={{
              background: 'rgba(0,0,0,0.04)',
              color: scoreColor(product.safetyScore),
            }}
          >
            {product.safetyScore}/10
          </span>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Price</p>
          <p className="text-sm font-bold text-gray-900">{product.price}</p>
        </div>
        <a
          href={product.link ?? '#'}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{
            background: product.link ? CORAL : '#D1D5DB',
            boxShadow: product.link ? `0 2px 12px rgba(240,90,74,0.3)` : undefined,
            pointerEvents: product.link ? 'auto' : 'none',
          }}
          aria-label={product.link ? `View ${product.name}` : `Link coming soon for ${product.name}`}
        >
          {product.link ? 'View →' : 'TBD'}
        </a>
      </div>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────

export default function EquipmentReviews() {
  const [audience,  setAudience]  = useState<Audience>('All');
  const [category,  setCategory]  = useState<'All' | Category>('All');

  const filtered = PRODUCTS.filter((p) => {
    const matchAud = audience === 'All' || p.audiences.includes(audience);
    const matchCat = category === 'All'  || p.category === category;
    return matchAud && matchCat;
  });

  return (
    <section
      id="equipment"
      aria-labelledby="equipment-heading"
      className="relative w-full"
      style={{ background: '#F7FAF4', scrollMarginTop: '64px' }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <WaveLines />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

        {/* ── Header ── */}
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ background: '#DDEFD2', color: '#166534' }}
          >
            AI Equipment Hub
          </span>
          <h2
            id="equipment-heading"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              color: '#111827',
              lineHeight: 1.15,
            }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold"
          >
            Devices, tools &
            <br />
            <span style={{ color: '#4D7C0F' }}>assistive tech</span>
            {' '}for UK schools.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            Every device, accessibility tool, and piece of AI equipment independently
            reviewed for safety, GDPR compliance, and real classroom value.{' '}
            <strong className="text-gray-800">No sponsored placements.</strong>
          </p>
        </motion.div>

        {/* ── Audience browse cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {AUDIENCE_CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => setAudience(audience === card.id ? 'All' : card.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col gap-2 p-5 rounded-2xl text-left transition-all"
              style={{
                background: audience === card.id ? card.bg : 'white',
                border: `1.5px solid ${audience === card.id ? card.color + '33' : '#E5E7EB'}`,
                boxShadow: audience === card.id
                  ? `0 4px 18px ${card.color}22`
                  : '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <span className="text-2xl">{card.emoji}</span>
              <div>
                <p
                  className="text-sm font-bold leading-tight"
                  style={{ color: audience === card.id ? card.color : '#111827' }}
                >
                  {card.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{card.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Category filter pills ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
              style={
                category === cat
                  ? { background: '#111827', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                  : { background: 'white', color: '#374151', border: '1.5px solid #D1D5DB' }
              }
            >
              {cat}
            </button>
          ))}
          {/* Active audience pill */}
          {audience !== 'All' && (
            <button
              onClick={() => setAudience('All')}
              className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5"
              style={{ background: '#FEE2E2', color: '#991B1B', border: '1.5px solid #FECACA' }}
            >
              {audience}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 2l6 6M8 2L2 8" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── Results count ── */}
        <p className="text-xs text-gray-400 mb-6 font-medium">
          Showing <strong className="text-gray-700">{filtered.length}</strong> of {PRODUCTS.length} products
          {audience !== 'All' && <> · Filtered by <strong className="text-gray-700">{audience}</strong></>}
          {category !== 'All' && <> · <strong className="text-gray-700">{category}</strong></>}
        </p>

        {/* ── Product grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${audience}-${category}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length > 0 ? (
              filtered.map((p, idx) => (
                <ProductCard key={p.id} product={p} idx={idx} />
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 font-medium">No products found for this filter combination.</p>
                <button
                  onClick={() => { setAudience('All'); setCategory('All'); }}
                  className="mt-4 text-sm font-bold underline"
                  style={{ color: CORAL }}
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer CTA ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-12 border-t border-lime-200/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-sm font-bold text-gray-900">
              Can't find what you need?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              We add new products every week. Request a review or suggest an item.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{
                background: CORAL,
                boxShadow: `0 4px 20px rgba(240,90,74,0.35)`,
              }}
            >
              Browse All Equipment →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3.5 rounded-2xl font-semibold text-sm"
              style={{
                background: 'white',
                border: '1.5px solid #D1D5DB',
                color: '#374151',
              }}
            >
              Request a Review
            </motion.button>
          </div>
        </motion.div>

        {/* ── Trust strip ── */}
        <div className="flex flex-wrap gap-6 mt-10">
          {[
            { icon: '🛡️', label: 'No sponsored placements' },
            { icon: '✅', label: 'GDPR verified' },
            { icon: '🇬🇧', label: 'UK curriculum aligned' },
            { icon: '♿', label: 'Accessibility checked' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
