import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { track } from '../utils/analytics';
import AgentCTACard from '../components/AgentCTACard';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { useCrossSell } from '../hooks/useCrossSell';
import {
  EQUIPMENT,
  type EquipmentProduct,
  type EquipmentCategory,
  type EqAudience,
  type PriceBand,
  type SupplierType,
  type ReviewStatus,
  type EqBadge,
} from '../data/equipment';

const TEAL = 'var(--color-promptly-lime)';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

// ─── Shared utilities ─────────────────────────────────────────────────────────

export const PRICE_ORDER: Record<PriceBand, number> = {
  'Under £50': 0,
  '£50–150':   1,
  '£150–500':  2,
  '£500+':     3,
};

export function badgeStyle(badge: string): { bg: string; color: string } {
  switch (badge) {
    case 'SEND Friendly':    return { bg: 'var(--color-oat)', color: 'var(--color-ink)' };
    case 'UK Specialist':    return { bg: '#f0fdf4', color: '#15803d' };
    case 'Amazon Available': return { bg: '#fff7ed', color: '#c2410c' };
    case 'School Quote':     return { bg: 'var(--color-oat)', color: 'var(--color-ink)' };
    case 'Research Based':   return { bg: '#fef9c3', color: '#854d0e' };
    case 'Needs Review':     return { bg: '#fef3c7', color: '#92400e' };
    default:                 return { bg: '#f3f4f6', color: '#6b7280' };
  }
}

export function reviewBadge(status: string) {
  if (status === 'Reviewed')   return { bg: '#f0fdf4', color: '#15803d', label: 'Reviewed' };
  if (status === 'In Progress') return { bg: '#fef9c3', color: '#854d0e', label: 'In Progress' };
  return { bg: '#fef3c7', color: '#92400e', label: 'Needs Review' };
}

export const CAT_SLUG: Record<string, EquipmentCategory> = {
  'devices':               'Devices',
  'stationery-literacy':   'Stationery & Literacy',
  'robots-coding':         'Robots & Coding',
  'games-cognitive':       'Games & Cognitive',
  'aac-communication':     'AAC & Communication',
  'sensory-regulation':    'Sensory & Regulation',
  'screens-hardware':      'Screens & Classroom Hardware',
  'audio-hearing':         'Audio & Hearing',
  'furniture-environment': 'Furniture & Environment',
  'wearables-safety':      'Wearables & Safety',
};

export function catToSlug(cat: EquipmentCategory): string {
  return Object.entries(CAT_SLUG).find(([, v]) => v === cat)?.[0] ?? cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// ─── Filter options ───────────────────────────────────────────────────────────

const AUDIENCE_TABS: { label: string; value: EqAudience | 'All' }[] = [
  { label: 'All',      value: 'All' },
  { label: 'Teachers', value: 'Teachers' },
  { label: 'Schools',  value: 'Schools' },
  { label: 'SEND',     value: 'SEND' },
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

const CAT_SHORT: Record<EquipmentCategory, string> = {
  'Devices':                    'Devices',
  'Stationery & Literacy':      'Stationery',
  'Robots & Coding':            'Coding',
  'Games & Cognitive':          'Games',
  'AAC & Communication':        'AAC',
  'Sensory & Regulation':       'Sensory',
  'Screens & Classroom Hardware': 'Screens',
  'Audio & Hearing':            'Audio',
  'Furniture & Environment':    'Furniture',
  'Wearables & Safety':         'Wearables',
};

// Visual category tiles — the primary browse affordance (emoji-led).
const CATEGORY_TILES: { label: string; value: EquipmentCategory; emoji: string }[] = [
  { label: 'Devices',            value: 'Devices',                       emoji: '\u{1F4BB}' },
  { label: 'Stationery & Literacy', value: 'Stationery & Literacy',      emoji: '\u{270F}\u{FE0F}' },
  { label: 'Robots & Coding',    value: 'Robots & Coding',               emoji: '\u{1F916}' },
  { label: 'Games & Cognitive',  value: 'Games & Cognitive',             emoji: '\u{1F9E9}' },
  { label: 'AAC & Communication', value: 'AAC & Communication',          emoji: '\u{1F5E3}\u{FE0F}' },
  { label: 'Sensory & Regulation', value: 'Sensory & Regulation',        emoji: '\u{1F300}' },
  { label: 'Screens & Hardware', value: 'Screens & Classroom Hardware',  emoji: '\u{1F4FA}' },
  { label: 'Audio & Hearing',    value: 'Audio & Hearing',               emoji: '\u{1F3A7}' },
  { label: 'Furniture & Environment', value: 'Furniture & Environment',  emoji: '\u{1FA91}' },
  { label: 'Wearables & Safety', value: 'Wearables & Safety',            emoji: '\u{231A}' },
];

const PRICE_BANDS: PriceBand[] = ['Under £50', '£50–150', '£150–500', '£500+'];
const SUPPLIER_TYPES: SupplierType[] = ['Amazon', 'UK Specialist', 'School Reseller', 'Direct'];
const REVIEW_STATUSES: ReviewStatus[] = ['Reviewed', 'Needs Review', 'In Progress'];

const SORT_OPTIONS = [
  { label: 'Featured',       value: 'featured' },
  { label: 'A–Z',            value: 'alpha' },
  { label: 'Price low–high', value: 'price-asc' },
  { label: 'Price high–low', value: 'price-desc' },
];

// ─── Product card ─────────────────────────────────────────────────────────────

interface CardProps {
  product: EquipmentProduct;
  inCompare: boolean;
  onToggleCompare: () => void;
  compareDisabled: boolean;
}

function EquipmentCard({ product, inCompare, onToggleCompare, compareDisabled }: CardProps) {
  const rb = reviewBadge(product.reviewStatus);
  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{
        borderColor: inCompare ? TEAL : '#e8e6e0',
        background: 'white',
        outline: inCompare ? `2px solid ${TEAL}` : 'none',
      }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6b6760' }}>
            {product.category}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rb.bg, color: rb.color }}>
            {rb.label}
          </span>
        </div>

        <Link to={`/ai-equipment/product/${product.slug}`}>
          <h3 className="font-display text-lg leading-snug mb-0.5 hover:underline" style={{ color: 'var(--text)' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{product.brand}</p>
        <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: '#6b6760' }}>{product.desc}</p>
        <p className="text-xs italic mb-4" style={{ color: '#9ca3af' }}>Best for: {product.bestFor}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.badges.slice(0, 2).map((b: EqBadge) => {
            const s = badgeStyle(b);
            return (
              <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                {b}
              </span>
            );
          })}
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
          style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: '#6b6760' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="#d1d5db" strokeWidth="1.5"/>
            <path d="M7 4v3.5l2 1.5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Scoring in progress
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
            className="text-xs px-2.5 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: inCompare ? TEAL : '#e8e6e0',
              color: inCompare ? TEAL : '#9ca3af',
              background: inCompare ? 'var(--color-oat)' : 'white',
              opacity: (compareDisabled && !inCompare) ? 0.4 : 1,
              cursor: (compareDisabled && !inCompare) ? 'not-allowed' : 'pointer',
            }}
            aria-label={inCompare ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
          >
            {inCompare ? '✓ Added' : '+ Compare'}
          </button>

          <div className="flex flex-col items-end gap-0.5">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors hover:border-[var(--color-promptly-lime)]"
              style={{ background: 'var(--color-oat)', color: 'var(--color-ink)', borderColor: 'var(--color-rule)' }}
            >
              View →
            </a>
            <span className="text-[9px]" style={{ color: '#6b6760' }}>Affiliate link</span>
          </div>
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
      style={{ background: 'white', borderColor: '#e8e6e0' }}
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
              style={{ borderColor: TEAL, color: 'var(--color-ink-accent)', background: 'var(--color-oat)' }}
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
              style={{ borderColor: '#e8e6e0', color: '#6b6760', borderStyle: 'dashed' }}
            >
              + slot
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e8e6e0', color: '#9ca3af' }}
          >
            Clear
          </button>
          <button
            onClick={onOpen}
            disabled={items.length < 2}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
            style={{
              background: items.length >= 2 ? TEAL : '#e8e6e0',
              color: items.length >= 2 ? 'white' : '#6b6760',
              cursor: items.length < 2 ? 'not-allowed' : 'pointer',
            }}
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
        style={{ background: 'white', borderColor: '#e8e6e0' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e8e6e0' }}>
          <h2 className="font-display text-xl" style={{ color: 'var(--text)' }}>
            Comparing {items.length} products
          </h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
          >
            Close
          </button>
        </div>
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f6f2' }}>
                <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: '#6b6760', width: 140 }}>Feature</th>
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
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>{row.label}</td>
                  {items.map(p => (
                    <td key={p.id} className="px-5 py-3 text-xs" style={{ color: '#1c1a15' }}>{row.render(p)}</td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #f3f4f6' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>Badges</td>
                {items.map(p => (
                  <td key={p.id} className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.badges.map((b: EqBadge) => {
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
              <tr style={{ borderTop: '1px solid #e8e6e0' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>View</td>
                {items.map(p => (
                  <td key={p.id} className="px-5 py-3">
                    <a
                      href={p.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-block text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors hover:border-[var(--color-promptly-lime)]"
                      style={{ background: 'var(--color-oat)', color: 'var(--color-ink)', borderColor: 'var(--color-rule)' }}
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

export default function AIEquipment() {
  const [audienceFilter, setAudienceFilter] = useState<EqAudience | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'All'>('All');
  const [priceFilter,    setPriceFilter]    = useState<PriceBand | 'All'>('All');
  const [supplierFilter, setSupplierFilter] = useState<SupplierType | 'All'>('All');
  const [reviewFilter,   setReviewFilter]   = useState<ReviewStatus | 'All'>('All');
  const [sort,           setSort]           = useState('featured');
  const [search,         setSearch]         = useState('');
  const [compareIds,     setCompareIds]     = useState<string[]>([]);
  const [compareOpen,    setCompareOpen]    = useState(false);

  const compareItems = useMemo(() => EQUIPMENT.filter(p => compareIds.includes(p.id)), [compareIds]);

  // Cross-sell
  const { inlineItems, popupItems, popupOpen, popupTrigger, closePopup } = useCrossSell({
    currentSection: 'equipment',
    roles: audienceFilter !== 'All' ? [audienceFilter] : undefined,
    category: categoryFilter !== 'All' ? categoryFilter : undefined,
  });

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
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      // Synonym groups so a common word finds the right products even when the
      // data uses a different label (e.g. "laptop" → Chromebooks/notebooks; the
      // device family is interchangeable in everyday search).
      const SYNONYMS: Record<string, string[]> = {
        laptop:     ['laptop', 'chromebook', 'notebook', 'device', 'computer'],
        chromebook: ['chromebook', 'laptop', 'notebook'],
        tablet:     ['tablet', 'ipad', 'device'],
        ipad:       ['ipad', 'tablet'],
        device:     ['device', 'laptop', 'tablet', 'chromebook', 'ipad', 'computer'],
        computer:   ['computer', 'laptop', 'chromebook', 'device'],
        headphones: ['headphone', 'headset', 'ear defender', 'audio'],
        whiteboard: ['whiteboard', 'display', 'screen', 'panel'],
        robot:      ['robot', 'coding', 'bee-bot', 'programmable'],
      };
      const terms = SYNONYMS[q] ?? [q];
      results = results.filter(p => {
        const haystack = [
          p.name, p.brand, p.bestFor, p.desc,
          p.category, p.subcategory,
          ...(p.senCategory ?? []),
          ...(p.badges ?? []),
        ].join(' ').toLowerCase();
        return terms.some(t => haystack.includes(t));
      });
    }
    return [...results].sort((a, b) => {
      if (sort === 'featured')   return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sort === 'price-asc')  return PRICE_ORDER[a.priceBand] - PRICE_ORDER[b.priceBand];
      if (sort === 'price-desc') return PRICE_ORDER[b.priceBand] - PRICE_ORDER[a.priceBand];
      if (sort === 'alpha')      return a.name.localeCompare(b.name);
      return 0;
    });
  }, [audienceFilter, categoryFilter, priceFilter, supplierFilter, reviewFilter, sort, search]);

  function scrollToGrid() {
    document.getElementById('equipment-grid')?.scrollIntoView({ behavior: 'smooth' });
  }

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

  // Live stats
  const stats = useMemo(() => [
    { value: EQUIPMENT.length,                                                     label: 'Products Reviewed' },
    { value: EQUIPMENT.filter(p => p.ukFocus).length,                             label: 'UK Education Focused' },
    { value: EQUIPMENT.filter(p => p.audience.includes('SEND')).length,           label: 'SEND Friendly' },
    { value: EQUIPMENT.filter(p => p.audience.includes('Schools')).length,        label: 'School Ready' },
    { value: EQUIPMENT.filter(p => p.supplierType === 'UK Specialist').length,    label: 'UK Specialists' },
  ], []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="AI Equipment for UK Education — 96 Products Reviewed | GetPromptly"
        description="Find the right classroom technology, SEND assistive tech and school equipment. 96 products independently curated for UK education."
        keywords="AI equipment UK education, classroom technology, SEND assistive tech, school equipment, educational devices UK"
        path="/ai-equipment"
      />

      {/* ── COMPACT HEADER ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-6">
        <SectionLabel>Equipment Hub</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl mb-2" style={{ color: 'var(--text)' }}>
          AI Equipment for <span style={{ color: 'var(--color-ink-accent)' }}>UK Education</span>
        </h1>
        <p className="text-base max-w-2xl" style={{ color: '#6b6760' }}>
          The right classroom, SEND and home-learning technology — {EQUIPMENT.length} products reviewed for UK education.
        </p>
      </div>

      {/* ── STATS STRIP (thin single row) ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-8">
        <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border px-5 py-3" style={{ borderColor: '#e8e6e0', background: 'white' }}>
          {stats.map(s => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="font-display text-xl" style={{ color: 'var(--color-ink-accent)' }}>{s.value}</span>
              <span className="text-xs" style={{ color: '#6b6760' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── LUNA HERO — the visual centrepiece, directly below the header ──────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-8">
        <AgentCTACard
          section="Luna · Equipment Guide"
          headline="Tell Luna the need — get the right kit and how to buy it."
          description="Describe who it's for, what you need and your budget. Luna searches every product and recommends the right kit and procurement route."
          prompts={[
            "What's the best visualiser for a primary classroom?",
            "Compare interactive whiteboards for a 30-pupil class",
            "What SEND equipment helps with AAC communication?",
            "Help me build a home learning setup for £300",
          ]}
          analyticsSection="equipment"
        />
      </div>

      {/* ── Plain search (for browsers) ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-base" style={{ color: 'var(--color-ink-accent)' }} aria-hidden="true">🔍</span>
          <input
            type="search"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (e.target.value.length > 2) track({ name: 'search_performed', section: 'equipment', query: e.target.value });
              if (e.target.value.trim()) scrollToGrid();
            }}
            placeholder={`Or search ${EQUIPMENT.length} products by name, brand, category or use case…`}
            aria-label="Search equipment"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-base font-sans outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
            style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)', color: 'var(--color-ink)' }}
          />
        </div>
      </div>

      {/* ── VISUAL CATEGORY TILES — primary browse ────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <SectionLabel>Browse by category</SectionLabel>
        <h2 className="font-display text-2xl sm:text-3xl mb-6" style={{ color: 'var(--text)' }}>
          What are you looking for?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORY_TILES.map(tile => {
            const active = categoryFilter === tile.value;
            return (
              <button
                key={tile.value}
                onClick={() => {
                  setCategoryFilter(tile.value);
                  track({ name: 'tool_filter_used', filterType: 'category', value: tile.value, pageType: 'equipment' });
                  scrollToGrid();
                }}
                className="rounded-2xl border p-5 flex flex-col items-center text-center gap-2 transition-shadow hover:shadow-md"
                style={{
                  borderColor: active ? 'var(--color-ink)' : 'var(--color-rule)',
                  background: 'var(--color-oat)',
                  color: 'var(--color-ink)',
                }}
                aria-pressed={active}
              >
                <span className="text-3xl" aria-hidden="true">{tile.emoji}</span>
                <span className="text-xs font-semibold font-sans leading-snug">{tile.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FULL FILTERABLE GRID ──────────────────────────────────────────────── */}
      <div id="equipment-grid" className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <SectionLabel>All products</SectionLabel>
            <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--text)' }}>
              Browse All 96 Products
            </h2>
          </div>

          {/* Refine within results (kept in sync with the top discovery search) */}
          <div className="mb-5">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b6760' }}>
              Refine these results
            </label>
            <input
              type="search"
              placeholder="Filter by name, brand or use case…"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) track({ name: 'search_performed', section: 'equipment', query: e.target.value });
              }}
              className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
              style={{
                borderColor: '#e8e6e0',
                background: 'var(--bg)',
                color: 'var(--text)',
                '--tw-ring-color': TEAL,
              } as React.CSSProperties}
            />
          </div>

          {/* Audience tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {AUDIENCE_TABS.map(t => (
              <button
                key={t.value}
                onClick={() => setAudienceFilter(t.value)}
                className="text-sm px-4 py-1.5 rounded-xl border transition-colors font-medium"
                style={{
                  borderColor: audienceFilter === t.value ? TEAL : '#e8e6e0',
                  background: audienceFilter === t.value ? 'var(--color-oat)' : 'white',
                  color: audienceFilter === t.value ? TEAL : '#6b6760',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setCategoryFilter('All')}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                borderColor: categoryFilter === 'All' ? TEAL : '#e8e6e0',
                background: categoryFilter === 'All' ? 'var(--color-oat)' : 'white',
                color: categoryFilter === 'All' ? TEAL : '#6b6760',
              }}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                style={{
                  borderColor: categoryFilter === cat ? TEAL : '#e8e6e0',
                  background: categoryFilter === cat ? 'var(--color-oat)' : 'white',
                  color: categoryFilter === cat ? TEAL : '#6b6760',
                }}
              >
                <span className="sm:hidden">{CAT_SHORT[cat]}</span>
                <span className="hidden sm:inline">{cat}</span>
              </button>
            ))}
          </div>

          {/* Price / Supplier / Status filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Price:</span>
              <button
                onClick={() => setPriceFilter('All')}
                className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={{
                  borderColor: priceFilter === 'All' ? TEAL : '#e8e6e0',
                  background: priceFilter === 'All' ? 'var(--color-oat)' : 'white',
                  color: priceFilter === 'All' ? TEAL : '#6b6760',
                }}
              >
                Any
              </button>
              {PRICE_BANDS.map(pb => (
                <button
                  key={pb}
                  onClick={() => setPriceFilter(pb)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                  style={{
                    borderColor: priceFilter === pb ? TEAL : '#e8e6e0',
                    background: priceFilter === pb ? 'var(--color-oat)' : 'white',
                    color: priceFilter === pb ? TEAL : '#6b6760',
                  }}
                >
                  {pb}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Supplier:</span>
              <button
                onClick={() => setSupplierFilter('All')}
                className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={{
                  borderColor: supplierFilter === 'All' ? TEAL : '#e8e6e0',
                  background: supplierFilter === 'All' ? 'var(--color-oat)' : 'white',
                  color: supplierFilter === 'All' ? TEAL : '#6b6760',
                }}
              >
                Any
              </button>
              {SUPPLIER_TYPES.map(st => (
                <button
                  key={st}
                  onClick={() => setSupplierFilter(st)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                  style={{
                    borderColor: supplierFilter === st ? TEAL : '#e8e6e0',
                    background: supplierFilter === st ? 'var(--color-oat)' : 'white',
                    color: supplierFilter === st ? TEAL : '#6b6760',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Status:</span>
              <button
                onClick={() => setReviewFilter('All')}
                className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={{
                  borderColor: reviewFilter === 'All' ? TEAL : '#e8e6e0',
                  background: reviewFilter === 'All' ? 'var(--color-oat)' : 'white',
                  color: reviewFilter === 'All' ? TEAL : '#6b6760',
                }}
              >
                Any
              </button>
              {REVIEW_STATUSES.map(rs => (
                <button
                  key={rs}
                  onClick={() => setReviewFilter(rs)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                  style={{
                    borderColor: reviewFilter === rs ? TEAL : '#e8e6e0',
                    background: reviewFilter === rs ? 'var(--color-oat)' : 'white',
                    color: reviewFilter === rs ? TEAL : '#6b6760',
                  }}
                >
                  {rs}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex gap-2 items-center">
              <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Sort:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg border outline-none"
                style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result count + clear */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm" style={{ color: '#6b6760' }}>
              Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {EQUIPMENT.length} products
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                style={{ borderColor: '#e8e6e0', color: '#9ca3af' }}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <EquipmentCard
                key={p.id}
                product={p}
                inCompare={compareIds.includes(p.id)}
                onToggleCompare={() => toggleCompare(p.id)}
                compareDisabled={compareIds.length >= 4}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-base mb-2" style={{ color: '#6b6760' }}>No products match your filters.</p>
              <button onClick={clearFilters} className="text-sm font-semibold" style={{ color: 'var(--color-ink-accent)' }}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PROCUREMENT CTA ───────────────────────────────────────────────────── */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#e8e6e0' }}>
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border p-8 sm:p-10" style={{ borderColor: '#e8e6e0', background: 'white' }}>
            <SectionLabel>School procurement</SectionLabel>
            <h2 className="font-display text-3xl mb-4" style={{ color: 'var(--text)' }}>
              Procurement made easier.
            </h2>
            <p className="text-base mb-6 max-w-lg" style={{ color: '#6b6760' }}>
              Whether you're buying for a whole school, a SEND pupil or a single classroom — we can help you navigate suppliers, quotes and frameworks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/ai-equipment/schools"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
                style={{ background: TEAL, color: '#1A1A0E' }}
              >
                School buying guide
              </Link>
              <Link
                to="/ai-equipment/send"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-gray-50"
                style={{ borderColor: '#e8e6e0', color: 'var(--text)' }}
              >
                SEND equipment guide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL RECOMMENDATIONS ────────────────────────────────────────── */}
      {inlineItems.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b6760' }}>
            You might also like
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inlineItems.map(item => (
              <CrossSellCard key={item.id} item={item} sourceSection="equipment" />
            ))}
          </div>
        </div>
      )}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <p className="font-display text-xl text-white">More from GetPromptly</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tools" className="text-sm transition-colors hover:text-white" style={{ color: '#6b6760' }}>
              AI Tools →
            </Link>
            <Link to="/ai-training" className="text-sm transition-colors hover:text-white" style={{ color: '#6b6760' }}>
              AI Training →
            </Link>
            <Link to="/prompts" className="text-sm transition-colors hover:text-white" style={{ color: '#6b6760' }}>
              Prompt Library →
            </Link>
          </div>
        </div>
      </div>

      {/* ── COMPARE BAR / MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {compareItems.length > 0 && !compareOpen && (
          <CompareBar
            items={compareItems}
            onRemove={id => setCompareIds(prev => prev.filter(x => x !== id))}
            onClear={() => setCompareIds([])}
            onOpen={() => setCompareOpen(true)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {compareOpen && (
          <CompareModal items={compareItems} onClose={() => setCompareOpen(false)} />
        )}
      </AnimatePresence>

      {/* Cross-sell popup */}
      {popupOpen && popupItems.length > 0 && (
        <CrossSellPopup
          items={popupItems}
          trigger={popupTrigger}
          sourceSection="equipment"
          onClose={closePopup}
        />
      )}
    </div>
  );
}
