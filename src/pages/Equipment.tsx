import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import LeadMagnet from '../components/LeadMagnet';
import ExpandableBundleCard from '../components/ExpandableBundleCard';
import { track } from '../utils/analytics';
import { resolveProductAffiliateUrl, AFFILIATE_LINK_ATTRS } from '../utils/affiliateLinks';
import {
  EQUIPMENT,
  BUNDLES,
  type EquipmentProduct,
  type EquipmentCategory,
  type EqAudience,
  type PriceBand,
  type SupplierType,
  type ReviewStatus,
} from '../data/equipment';

// ─── Promptly rebrand tokens ──────────────────────────────────────────────────
const LIME   = '#BEFF00';
const CYAN   = '#00D1FF';
const PURPLE = '#A78BFA';
const YELLOW = '#FFEA00';
const INK      = '#0F1C1A';
const INK_SOFT = '#4A4A4A';
const BORDER   = '#ECE7DD';
const CREAM    = '#F8F5F0';

// Backwards-compat alias for legacy references throughout this file (was teal,
// now lime under the new system — kept so unrelated code paths still work).
const TEAL = LIME;

// Reusable lime CTA button style — dark text on lime gradient with glow.
const LIME_BTN: React.CSSProperties = {
  background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
  color: INK,
  border: '1px solid rgba(15,28,26,0.16)',
  boxShadow:
    '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
};

// ─── Stats ────────────────────────────────────────────────────────────────────

const STAT_TOTAL   = EQUIPMENT.length;
const STAT_SEND    = EQUIPMENT.filter(p => p.audience.includes('SEND')).length;
const STAT_SCHOOLS = EQUIPMENT.filter(p => p.audience.includes('Schools')).length;
const STAT_SPEC    = EQUIPMENT.filter(p => p.supplierType === 'UK Specialist').length;

// ─── Filter options ───────────────────────────────────────────────────────────

const AUDIENCE_TABS: { label: string; value: EqAudience | 'All' }[] = [
  { label: 'All',      value: 'All' },
  { label: 'Schools',  value: 'Schools' },
  { label: 'SEND',     value: 'SEND' },
  { label: 'Teachers', value: 'Teachers' },
  { label: 'Parents',  value: 'Parents' },
  { label: 'Students', value: 'Students' },
];

const CATEGORIES: EquipmentCategory[] = [
  'Devices',
  'Stationery & Literacy',
  'Robots & Coding',
  'Games & Cognitive',
  'AAC & Communication',
  'Sensory & Regulation',
  'Screens & Classroom Hardware',
  'Audio & Hearing',
  'Furniture & Environment',
  'Wearables & Safety',
];

const PRICE_BANDS: PriceBand[] = ['Under £50', '£50–150', '£150–500', '£500+'];

const SUPPLIER_TYPES: SupplierType[] = ['Amazon', 'UK Specialist', 'School Reseller', 'Direct'];

const SORT_OPTIONS = [
  { label: 'Featured first', value: 'featured' },
  { label: 'Price: low–high', value: 'price-asc' },
  { label: 'Price: high–low', value: 'price-desc' },
  { label: 'A–Z', value: 'alpha' },
];

// ─── Featured collection tabs ─────────────────────────────────────────────────
//
// The Featured Collection switcher is the primary discovery surface above the
// main filterable grid. Tabs filter the *featured collection cards* shown
// directly below — they do not touch the main product grid (which has its own
// dedicated filter UI).

type FeaturedTabId =
  | 'all'
  | 'classroom'
  | 'send'
  | 'coding'
  | 'study'
  | 'sets';

const FEATURED_TABS: {
  id: FeaturedTabId;
  label: string;
  short: string;        // shorter mobile label
  description: string;  // shown when active
  accent: string;       // active dot accent colour
}[] = [
  { id: 'all',       label: 'All featured',              short: 'All',        accent: LIME,   description: 'Our top picks across every category — featured products and ready-to-use sets.' },
  { id: 'classroom', label: 'Classroom essentials',      short: 'Classroom',  accent: CYAN,   description: 'Day-to-day kit for the classroom: displays, audio, furniture and literacy resources.' },
  { id: 'send',      label: 'SEND & assistive tech',     short: 'SEND',       accent: PURPLE, description: 'AAC, sensory, and assistive tools chosen for inclusion and access needs.' },
  { id: 'coding',    label: 'Coding & robotics',         short: 'Coding',     accent: YELLOW, description: 'Robots and physical computing kits to bring KS2–KS4 computing to life.' },
  { id: 'study',     label: 'Study devices',             short: 'Devices',    accent: LIME,   description: 'Tablets, laptops and Chromebooks suitable for school deployment and home study.' },
  { id: 'sets',      label: 'Ready-to-Use Equipment Sets', short: 'Sets',     accent: CYAN,   description: 'Curated bundles for common SEND and classroom needs — expand any set for the full kit list and a tailored shortlist.' },
];

// Map a FeaturedTabId → a filtered EquipmentProduct subset (used for product
// cards inside each tab; the 'sets' tab renders BUNDLES instead).
function productsForFeaturedTab(tab: FeaturedTabId): EquipmentProduct[] {
  switch (tab) {
    case 'all':
      return EQUIPMENT.filter(p => p.featured);
    case 'classroom':
      return EQUIPMENT.filter(
        p =>
          p.category === 'Screens & Classroom Hardware' ||
          p.category === 'Audio & Hearing' ||
          p.category === 'Furniture & Environment' ||
          p.category === 'Stationery & Literacy',
      );
    case 'send':
      return EQUIPMENT.filter(
        p =>
          p.audience.includes('SEND') ||
          p.category === 'AAC & Communication' ||
          p.category === 'Sensory & Regulation',
      );
    case 'coding':
      return EQUIPMENT.filter(p => p.category === 'Robots & Coding');
    case 'study':
      return EQUIPMENT.filter(p => p.category === 'Devices');
    case 'sets':
      return [];
  }
}

// ─── Price band sort key ──────────────────────────────────────────────────────

const PRICE_ORDER: Record<PriceBand, number> = {
  'Under £50': 0,
  '£50–150':   1,
  '£150–500':  2,
  '£500+':     3,
};

// ─── Badge colours ────────────────────────────────────────────────────────────

function badgeStyle(badge: string): { bg: string; color: string } {
  switch (badge) {
    case 'SEND Friendly':     return { bg: '#e0f2fe', color: '#0369a1' };
    case 'UK Specialist':     return { bg: '#f0fdf4', color: '#15803d' };
    case 'Amazon Available':  return { bg: '#fff7ed', color: '#c2410c' };
    case 'School Quote':      return { bg: '#f5f3ff', color: '#7c3aed' };
    case 'Research Based':    return { bg: '#fef9c3', color: '#854d0e' };
    case 'Needs Review':      return { bg: '#f3f4f6', color: '#6b7280' };
    default:                  return { bg: '#f3f4f6', color: '#6b7280' };
  }
}

// ─── Equipment card ───────────────────────────────────────────────────────────

interface CardProps {
  product: EquipmentProduct;
  inCompare: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}

function EquipmentCard({ product, inCompare, onToggleCompare, compareDisabled }: CardProps) {
  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{
        borderColor: inCompare ? TEAL : '#ECE7DD',
        background: 'white',
        outline: inCompare ? `2px solid ${TEAL}` : 'none',
      }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        {/* Category + review status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>
            {product.category}
          </span>
          {product.reviewStatus === 'Reviewed' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d' }}>
              Reviewed
            </span>
          )}
          {product.reviewStatus === 'In Progress' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fef9c3', color: '#854d0e' }}>
              In Progress
            </span>
          )}
          {product.reviewStatus === 'Needs Review' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
              Needs Review
            </span>
          )}
        </div>

        <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>
          {product.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{product.brand}</p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#4A4A4A' }}>{product.desc}</p>
        <p className="text-xs italic mb-4" style={{ color: '#9ca3af' }}>Best for: {product.bestFor}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.badges.slice(0, 3).map(b => {
            const s = badgeStyle(b);
            return (
              <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                {b}
              </span>
            );
          })}
        </div>

        {/* Score — always pending */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
          style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: '#9ca3af' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="#d1d5db" strokeWidth="1.5"/>
            <path d="M7 4v3.5l2 1.5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Equipment scoring in progress
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: '#f3f4f6' }}>
        <div>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{product.priceBand}</span>
          <span className="text-xs ml-2" style={{ color: '#9ca3af' }}>{product.supplierName}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            disabled={compareDisabled && !inCompare}
            className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            style={{
              borderColor: inCompare ? LIME : BORDER,
              color: INK,
              background: inCompare ? 'rgba(190,255,0,0.18)' : 'white',
              opacity: (compareDisabled && !inCompare) ? 0.4 : 1,
              cursor: (compareDisabled && !inCompare) ? 'not-allowed' : 'pointer',
            }}
            aria-label={inCompare ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
            aria-pressed={inCompare}
          >
            {inCompare ? '✓ Added' : '+ Compare'}
          </button>

          <a
            href={resolveProductAffiliateUrl(product)}
            {...AFFILIATE_LINK_ATTRS}
            className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            style={LIME_BTN}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Compare bar ──────────────────────────────────────────────────────────────

function CompareBar({
  items,
  onRemove,
  onClear,
  onOpen,
}: {
  items: EquipmentProduct[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t shadow-2xl"
      style={{ background: 'white', borderColor: '#ECE7DD' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
          Compare ({items.length}/4):
        </span>

        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {items.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs"
              style={{ borderColor: LIME, color: INK, background: 'rgba(190,255,0,0.18)' }}
            >
              <span className="font-medium truncate max-w-[120px]">{p.name}</span>
              <button
                onClick={() => onRemove(p.id)}
                className="ml-1 hover:opacity-60 transition-opacity leading-none"
                aria-label={`Remove ${p.name}`}
              >
                ×
              </button>
            </div>
          ))}
          {Array.from({ length: 4 - items.length }).map((_, i) => (
            <div
              key={i}
              className="px-3 py-1 rounded-lg border text-xs"
              style={{ borderColor: '#ECE7DD', color: '#9C9690', borderStyle: 'dashed' }}
            >
              + slot
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#ECE7DD', color: '#9ca3af' }}
          >
            Clear
          </button>
          <button
            onClick={onOpen}
            disabled={items.length < 2}
            className="text-xs px-4 py-1.5 rounded-lg font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            style={
              items.length >= 2
                ? LIME_BTN
                : { background: '#ECE7DD', color: '#9ca3af', cursor: 'not-allowed', border: '1px solid #ECE7DD' }
            }
          >
            Compare →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Compare modal ────────────────────────────────────────────────────────────

function CompareModal({ items, onClose }: { items: EquipmentProduct[]; onClose: () => void }) {
  const rows: { label: string; render: (p: EquipmentProduct) => string }[] = [
    { label: 'Category',       render: p => p.category },
    { label: 'Best for',       render: p => p.bestFor },
    { label: 'Price band',     render: p => p.priceBand },
    { label: 'Supplier',       render: p => p.supplierName },
    { label: 'Supplier type',  render: p => p.supplierType },
    { label: 'Purchase model', render: p => p.purchaseModel },
    { label: 'UK focus',       render: p => p.ukFocus ? '✓ Yes' : '—' },
    { label: 'SEND',           render: p => p.audience.includes('SEND') ? '✓ Yes' : '—' },
    { label: 'SEN categories', render: p => p.senCategory.join(', ') || '—' },
    { label: 'Review status',  render: p => p.reviewStatus },
    { label: 'Score',          render: () => 'Scoring in progress' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl border overflow-hidden flex flex-col"
        style={{ background: 'white', borderColor: '#ECE7DD' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#ECE7DD' }}>
          <h2 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Comparing {items.length} products
          </h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#ECE7DD', color: '#4A4A4A' }}
          >
            Close
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F5F0' }}>
                <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: '#9C9690', width: 140 }}>
                  Feature
                </th>
                {items.map(p => (
                  <th key={p.id} className="px-5 py-3 text-left">
                    <div className="font-display text-base leading-snug" style={{ color: 'var(--text)' }}>{p.name}</div>
                    <div className="text-xs font-normal" style={{ color: '#9ca3af' }}>{p.brand}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafaf9' }}>
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#4A4A4A' }}>{row.label}</td>
                  {items.map(p => (
                    <td key={p.id} className="px-5 py-3 text-xs" style={{ color: '#1A1A1A' }}>
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #f3f4f6' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#4A4A4A' }}>Badges</td>
                {items.map(p => (
                  <td key={p.id} className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.badges.map(b => {
                        const s = badgeStyle(b);
                        return (
                          <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                            {b}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>
              <tr style={{ borderTop: '1px solid #ECE7DD' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#4A4A4A' }}>View</td>
                {items.map(p => (
                  <td key={p.id} className="px-5 py-3">
                    <a
                      href={resolveProductAffiliateUrl(p)}
                      {...AFFILIATE_LINK_ATTRS}
                      className="inline-block text-xs px-3 py-1.5 rounded-lg font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                      style={LIME_BTN}
                    >
                      View product →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Equipment() {
  const [audienceFilter, setAudienceFilter] = useState<EqAudience | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'All'>('All');
  const [priceFilter,    setPriceFilter]    = useState<PriceBand | 'All'>('All');
  const [supplierFilter, setSupplierFilter] = useState<SupplierType | 'All'>('All');
  const [reviewFilter,   setReviewFilter]   = useState<ReviewStatus | 'All'>('All');
  const [sort,           setSort]           = useState('featured');
  const [search,         setSearch]         = useState('');
  const [compareIds,     setCompareIds]     = useState<string[]>([]);
  const [compareOpen,    setCompareOpen]    = useState(false);
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<FeaturedTabId>('all');

  const compareItems = useMemo(() => EQUIPMENT.filter(p => compareIds.includes(p.id)), [compareIds]);

  const featuredProducts = useMemo(
    () => productsForFeaturedTab(activeFeaturedTab).slice(0, 6),
    [activeFeaturedTab],
  );

  const featuredTabMeta = FEATURED_TABS.find(t => t.id === activeFeaturedTab) ?? FEATURED_TABS[0];

  function toggleCompare(id: string) {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const filtered = useMemo(() => {
    let results = EQUIPMENT;
    if (audienceFilter !== 'All') results = results.filter(p => p.audience.includes(audienceFilter));
    if (categoryFilter !== 'All') results = results.filter(p => p.category === categoryFilter);
    if (priceFilter    !== 'All') results = results.filter(p => p.priceBand === priceFilter);
    if (supplierFilter !== 'All') results = results.filter(p => p.supplierType === supplierFilter);
    if (reviewFilter   !== 'All') results = results.filter(p => p.reviewStatus === reviewFilter);
    if (search.trim())
      results = results.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.bestFor.toLowerCase().includes(search.toLowerCase())
      );
    return [...results].sort((a, b) => {
      if (sort === 'featured')   return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sort === 'price-asc')  return PRICE_ORDER[a.priceBand] - PRICE_ORDER[b.priceBand];
      if (sort === 'price-desc') return PRICE_ORDER[b.priceBand] - PRICE_ORDER[a.priceBand];
      if (sort === 'alpha')      return a.name.localeCompare(b.name);
      return 0;
    });
  }, [audienceFilter, categoryFilter, priceFilter, supplierFilter, reviewFilter, sort, search]);

  function clearFilters() {
    setAudienceFilter('All');
    setCategoryFilter('All');
    setPriceFilter('All');
    setSupplierFilter('All');
    setReviewFilter('All');
    setSort('featured');
    setSearch('');
  }

  const hasActiveFilters =
    audienceFilter !== 'All' || categoryFilter !== 'All' || priceFilter !== 'All' ||
    supplierFilter !== 'All' || reviewFilter !== 'All' || search.trim() !== '';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Education Equipment Hub – SEND, School & Classroom Resources | GetPromptly"
        description="Independent reviews of 96 education products for UK schools — SEND assistive tech, coding robots, AAC devices, sensory tools and classroom hardware."
        keywords="education equipment UK, SEND assistive technology, school equipment, coding robots, AAC devices, sensory tools, classroom hardware"
        path="/equipment"
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <SectionLabel>Equipment Hub</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Education<br />
          <span style={{ color: TEAL }}>Equipment.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-10" style={{ color: '#4A4A4A' }}>
          96 independently assessed products for UK schools and families — from SEND assistive tech to classroom coding robots and AAC devices.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: STAT_TOTAL,   label: 'Products reviewed' },
            { value: STAT_SEND,    label: 'SEND friendly' },
            { value: STAT_SCHOOLS, label: 'School ready' },
            { value: STAT_SPEC,    label: 'UK specialists' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-2xl border px-5 py-4"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <div className="font-display text-3xl" style={{ color: TEAL }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: '#4A4A4A' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI ASSISTANT STRIP (Promptly dark band) ──────────────────────────── */}
      <div
        className="border-y"
        style={{
          background:
            'radial-gradient(1200px 360px at 90% -10%, rgba(190,255,0,0.10), transparent 60%), linear-gradient(180deg, #0F1C1A 0%, #0B1513 100%)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: LIME, boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
                aria-hidden="true"
              />
              Promptly AI
            </p>
            <h2 className="font-display text-xl sm:text-2xl leading-tight" style={{ color: 'white' }}>
              Not sure what your school needs?{' '}
              <span
                className="italic"
                style={{
                  background: `linear-gradient(90deg, ${LIME} 0%, ${CYAN} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ask Promptly.
              </span>
            </h2>
            <p className="text-sm mt-2 max-w-xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Tell us the year group, budget and SEND needs — Promptly AI returns a tailored
              equipment shortlist with UK suppliers, purchase models and SEN suitability.
            </p>
          </div>
          <button
            onClick={() => {
              const widget = document.getElementById('promptly-widget-trigger');
              if (widget) (widget as HTMLButtonElement).click();
              track({ name: 'cta_clicked', section: 'equipment-ai-strip', label: 'Ask the AI' });
            }}
            className="flex-shrink-0 text-sm font-bold px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            style={LIME_BTN}
          >
            Ask the AI →
          </button>
        </div>
      </div>

      {/* ── FEATURED COLLECTION (tabbed) ─────────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: BORDER, background: CREAM }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <SectionLabel>Featured Collection</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: INK }}>
                Top picks,{' '}
                <span
                  className="italic"
                  style={{
                    background: `linear-gradient(90deg, ${LIME} 0%, ${CYAN} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  curated for you.
                </span>
              </h2>
              <p className="text-sm mt-2 max-w-xl" style={{ color: INK_SOFT }}>
                {featuredTabMeta.description}
              </p>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto flex-shrink-0"
              style={{ background: 'rgba(190,255,0,0.18)', color: INK, border: '1px solid rgba(190,255,0,0.45)' }}
            >
              {activeFeaturedTab === 'sets' ? `${BUNDLES.length} sets` : `${featuredProducts.length} highlighted`}
            </span>
          </div>

          {/* Tab pills — horizontal scroll on mobile, wrap on tablet+ */}
          <div
            role="tablist"
            aria-label="Featured collection categories"
            className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto sm:overflow-visible -mx-5 sm:mx-0 px-5 sm:px-0 pb-2 sm:pb-0"
            style={{ scrollbarWidth: 'thin' }}
          >
            {FEATURED_TABS.map(tab => {
              const active = activeFeaturedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`featured-panel-${tab.id}`}
                  onClick={() => {
                    setActiveFeaturedTab(tab.id);
                    track({ name: 'cta_clicked', section: 'equipment-featured-tabs', label: tab.label });
                  }}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                  style={
                    active
                      ? {
                          background: INK,
                          color: 'white',
                          border: `1px solid ${INK}`,
                          boxShadow: `0 0 0 1px ${tab.accent}66, 0 8px 22px rgba(15,28,26,0.18)`,
                        }
                      : {
                          background: 'white',
                          color: INK,
                          border: `1px solid ${BORDER}`,
                        }
                  }
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: tab.accent,
                      boxShadow: active ? `0 0 0 3px ${tab.accent}33` : 'none',
                    }}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.short}</span>
                </button>
              );
            })}
          </div>

          {/* Tab panel */}
          <div
            role="tabpanel"
            id={`featured-panel-${activeFeaturedTab}`}
            aria-labelledby={`featured-tab-${activeFeaturedTab}`}
            className="mt-6"
          >
            {activeFeaturedTab === 'sets' ? (
              // Ready-to-Use Equipment Sets — expandable bundle cards
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUNDLES.map(bundle => (
                  <ExpandableBundleCard key={bundle.id} bundle={bundle} />
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center" style={{ background: 'white', borderColor: BORDER }}>
                <p className="text-sm" style={{ color: INK_SOFT }}>
                  No featured items in this collection yet — check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProducts.map(product => (
                  <EquipmentCard
                    key={product.id}
                    product={product}
                    inCompare={compareIds.includes(product.id)}
                    onToggleCompare={() => toggleCompare(product.id)}
                    compareDisabled={compareIds.length >= 4}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Equipment shortlist lead magnet — bottom of featured section */}
          <div className="mt-8 max-w-3xl mx-auto">
            <LeadMagnet
              variant="light"
              eyebrow="Free shortlist"
              headline="Email me an equipment shortlist →"
              description={
                <>
                  Tell us once and we’ll send a tailored kit list — products, suppliers, price bands and
                  a buy-or-quote note for your context (year group, SEND needs, budget).
                </>
              }
              buttonLabel="Send my shortlist →"
              successMessage={<>Done — your shortlist is on its way. We’ll follow up within one working day.</>}
              analyticsSection="equipment-shortlist"
              analyticsMeta={{ source: 'featured-collection' }}
              inputIdSuffix="equipment-shortlist"
            />
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, brands, needs…"
              className="flex-1 pl-4 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#ECE7DD', background: 'white', color: 'var(--text)' }}
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{ borderColor: '#ECE7DD', background: 'white', color: 'var(--text)', minWidth: 160 }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Audience tabs */}
          <div role="tablist" aria-label="Filter by audience" className="flex flex-wrap gap-2">
            {AUDIENCE_TABS.map(tab => {
              const active = audienceFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setAudienceFilter(tab.value)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                  style={
                    active
                      ? {
                          background: INK,
                          color: 'white',
                          border: `1px solid ${INK}`,
                          boxShadow: `0 0 0 1px rgba(190,255,0,0.45), 0 6px 16px rgba(15,28,26,0.18)`,
                        }
                      : { background: 'white', color: INK, border: `1px solid ${BORDER}` }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('All')}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: categoryFilter === 'All' ? '#1A1A1A' : 'white',
                color: categoryFilter === 'All' ? 'white' : '#4A4A4A',
                border: `1px solid ${categoryFilter === 'All' ? '#1A1A1A' : '#ECE7DD'}`,
              }}
            >
              All categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: categoryFilter === cat ? '#1A1A1A' : 'white',
                  color: categoryFilter === cat ? 'white' : '#4A4A4A',
                  border: `1px solid ${categoryFilter === cat ? '#1A1A1A' : '#ECE7DD'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price + supplier + review */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#9C9690' }}>Price:</span>
              {(['All', ...PRICE_BANDS] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p as PriceBand | 'All')}
                  className="px-3 py-1 rounded-lg text-xs transition-colors border"
                  style={{
                    background: priceFilter === p ? '#f0fdf4' : 'white',
                    color: priceFilter === p ? '#15803d' : '#4A4A4A',
                    borderColor: priceFilter === p ? '#bbf7d0' : '#ECE7DD',
                  }}
                >
                  {p === 'All' ? 'Any' : p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#9C9690' }}>Supplier:</span>
              {(['All', ...SUPPLIER_TYPES] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSupplierFilter(s as SupplierType | 'All')}
                  className="px-3 py-1 rounded-lg text-xs transition-colors border"
                  style={{
                    background: supplierFilter === s ? 'rgba(190,255,0,0.18)' : 'white',
                    color: INK,
                    borderColor: supplierFilter === s ? LIME : BORDER,
                  }}
                >
                  {s === 'All' ? 'All' : s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#9C9690' }}>Status:</span>
              {(['All', 'Reviewed', 'In Progress', 'Needs Review'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setReviewFilter(r as ReviewStatus | 'All')}
                  className="px-3 py-1 rounded-lg text-xs transition-colors border"
                  style={{
                    background: reviewFilter === r ? '#f5f3ff' : 'white',
                    color: reviewFilter === r ? '#7c3aed' : '#4A4A4A',
                    borderColor: reviewFilter === r ? '#c4b5fd' : '#ECE7DD',
                  }}
                >
                  {r === 'All' ? 'Any' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Count + clear */}
          <div role="status" aria-live="polite" aria-atomic="true" className="flex items-center justify-between">
            <p className="text-sm" style={{ color: INK_SOFT }}>
              Showing <strong style={{ color: INK }}>{filtered.length}</strong> of {STAT_TOTAL} products
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                style={{ color: INK, border: `1px solid ${LIME}`, background: 'rgba(190,255,0,0.18)' }}
              >
                ✕ Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-display mb-2" style={{ color: INK }}>No products found</p>
            <p className="text-sm mb-4" style={{ color: INK_SOFT }}>Try adjusting your filters or search term.</p>
            <button
              onClick={clearFilters}
              className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={LIME_BTN}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(product => (
              <EquipmentCard
                key={product.id}
                product={product}
                inCompare={compareIds.includes(product.id)}
                onToggleCompare={() => toggleCompare(product.id)}
                compareDisabled={compareIds.length >= 4}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── SCHOOL PROCUREMENT CTA ───────────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
          <div>
            <SectionLabel>For Schools</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text)' }}>
              Procurement<br />
              <span style={{ color: TEAL }}>made easier.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#4A4A4A' }}>
              All products include supplier details, purchase model (buy/quote/lease) and compatibility notes for mainstream and SEND provision. Use the compare feature to shortlist up to four products side by side.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                to="/equipment/schools"
                className="inline-block px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                style={LIME_BTN}
              >
                School procurement guide →
              </Link>
              <Link
                to="/equipment/send"
                className="inline-block px-5 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                style={{ borderColor: BORDER, color: INK }}
              >
                SEND assistive tech →
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {[
              '96 products assessed across 10 categories',
              'SEND suitability and SEN category tags on every product',
              'UK supplier details and purchase models included',
              'Compare up to 4 products side by side',
              'Equipment scoring underway — scores published as reviews complete',
            ].map(text => (
              <div key={text} className="flex items-start gap-3">
                <span className="mt-0.5 text-sm font-bold flex-shrink-0" style={{ color: TEAL }}>✓</span>
                <p className="text-sm" style={{ color: '#4A4A4A' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL STRIP (Promptly dark band) ────────────────────────────── */}
      <div
        style={{
          background:
            'radial-gradient(1200px 360px at 10% -10%, rgba(0,209,255,0.10), transparent 60%), linear-gradient(180deg, #0F1C1A 0%, #0B1513 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: LIME }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: LIME, boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
                aria-hidden="true"
              />
              Also on GetPromptly
            </p>
            <h2 className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: 'white' }}>
              Looking for{' '}
              <span
                className="italic"
                style={{
                  background: `linear-gradient(90deg, ${LIME} 0%, ${CYAN} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI tools instead?
              </span>
            </h2>
            <p className="text-sm mt-2 max-w-md" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Browse 155 AI tools independently assessed for UK school safety — with KCSIE 2025 and UK GDPR ratings.
            </p>
          </div>
          <Link
            to="/tools"
            className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            style={LIME_BTN}
          >
            Browse AI tools →
          </Link>
        </div>
      </div>

      {/* ── COMPARE BAR ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {compareIds.length > 0 && !compareOpen && (
          <CompareBar
            items={compareItems}
            onRemove={id => setCompareIds(prev => prev.filter(x => x !== id))}
            onClear={() => setCompareIds([])}
            onOpen={() => setCompareOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* ── COMPARE MODAL ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {compareOpen && compareItems.length >= 2 && (
          <CompareModal
            items={compareItems}
            onClose={() => setCompareOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
