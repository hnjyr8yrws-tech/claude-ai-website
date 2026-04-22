import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  BUNDLES,
  type EquipmentProduct,
  type EquipmentBundle,
  type EquipmentCategory,
  type EqAudience,
  type PriceBand,
  type SupplierType,
  type ReviewStatus,
} from '../data/equipment';

const TEAL = '#00808a';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

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

// ─── Featured collections ─────────────────────────────────────────────────────

type CollectionFilter = {
  audience?: EqAudience;
  price?: PriceBand;
  supplier?: SupplierType;
  category?: EquipmentCategory;
};

const COLLECTIONS: { label: string; icon: string; filter: CollectionFilter }[] = [
  { label: 'SEND Essentials',    icon: '♿', filter: { audience: 'SEND' } },
  { label: 'School Procurement', icon: '🏫', filter: { audience: 'Schools' } },
  { label: 'Under £50',          icon: '💷', filter: { price: 'Under £50' } },
  { label: 'UK Specialists',     icon: '🇬🇧', filter: { supplier: 'UK Specialist' } },
  { label: 'AAC & Comms',        icon: '🗣️', filter: { category: 'AAC & Communication' } },
];

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
        borderColor: inCompare ? TEAL : '#e8e6e0',
        background: 'white',
        outline: inCompare ? `2px solid ${TEAL}` : 'none',
      }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        {/* Category + review status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>
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
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b6760' }}>{product.desc}</p>
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
          style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: '#9ca3af' }}
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
            className="text-xs px-2.5 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: inCompare ? TEAL : '#e8e6e0',
              color: inCompare ? TEAL : '#9ca3af',
              background: inCompare ? '#e0f5f6' : 'white',
              opacity: (compareDisabled && !inCompare) ? 0.4 : 1,
              cursor: (compareDisabled && !inCompare) ? 'not-allowed' : 'pointer',
            }}
            aria-label={inCompare ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
          >
            {inCompare ? '✓ Added' : '+ Compare'}
          </button>

          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Bundle card ──────────────────────────────────────────────────────────────

function BundleCard({ bundle }: { bundle: EquipmentBundle }) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
          Bundle · {bundle.totalPriceBand}
        </p>
        <h3 className="font-display text-lg leading-snug" style={{ color: 'var(--text)' }}>
          {bundle.name}
        </h3>
        <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{bundle.tagline}</p>
      </div>
      <p className="text-sm leading-relaxed flex-1" style={{ color: '#6b6760' }}>{bundle.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {bundle.senCategory.map(s => (
          <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
            {s}
          </span>
        ))}
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
          {bundle.productSlugs.length} products
        </span>
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
              style={{ borderColor: TEAL, color: TEAL, background: '#e0f5f6' }}
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
              style={{ borderColor: '#e8e6e0', color: '#c5c2bb', borderStyle: 'dashed' }}
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
              color: items.length >= 2 ? 'white' : '#9ca3af',
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
                <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: '#c5c2bb', width: 140 }}>
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
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>{row.label}</td>
                  {items.map(p => (
                    <td key={p.id} className="px-5 py-3 text-xs" style={{ color: '#1c1a15' }}>
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #f3f4f6' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>Badges</td>
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
              <tr style={{ borderTop: '1px solid #e8e6e0' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>View</td>
                {items.map(p => (
                  <td key={p.id} className="px-5 py-3">
                    <a
                      href={p.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-block text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
                      style={{ background: TEAL, color: 'white' }}
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

  const compareItems = useMemo(() => EQUIPMENT.filter(p => compareIds.includes(p.id)), [compareIds]);

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

  function applyCollection(col: typeof COLLECTIONS[number]) {
    setAudienceFilter('All');
    setCategoryFilter('All');
    setPriceFilter('All');
    setSupplierFilter('All');
    if (col.filter.audience) setAudienceFilter(col.filter.audience);
    if (col.filter.price)    setPriceFilter(col.filter.price);
    if (col.filter.supplier) setSupplierFilter(col.filter.supplier);
    if (col.filter.category) setCategoryFilter(col.filter.category);
    window.scrollTo({ top: 620, behavior: 'smooth' });
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
        <p className="text-base sm:text-lg max-w-xl mb-10" style={{ color: '#6b6760' }}>
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
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <div className="font-display text-3xl" style={{ color: TEAL }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: '#6b6760' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AGENT CTA STRIP ──────────────────────────────────────────────────── */}
      <div
        className="border-y px-5 sm:px-8 py-4"
        style={{ background: AMBER_BG, borderColor: AMBER_BORDER }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: AMBER_TEXT }}>
              Not sure what equipment your school needs?
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#78350f' }}>
              Ask the Promptly AI assistant — it can recommend products based on your specific SEND needs, budget, and year group.
            </p>
          </div>
          <button
            onClick={() => {
              const widget = document.getElementById('promptly-widget-trigger');
              if (widget) (widget as HTMLButtonElement).click();
            }}
            className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: AMBER_TEXT, color: 'white' }}
          >
            Ask the AI →
          </button>
        </div>
      </div>

      {/* ── FEATURED COLLECTIONS ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--text)' }}>
          Browse collections
        </h2>
        <div className="flex flex-wrap gap-3">
          {COLLECTIONS.map(col => (
            <button
              key={col.label}
              onClick={() => applyCollection(col)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:border-[#00808a] hover:text-[#00808a]"
              style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760' }}
            >
              <span aria-hidden="true">{col.icon}</span>
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BUNDLES ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-b" style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>Curated bundles</h2>
              <p className="text-sm mt-1" style={{ color: '#6b6760' }}>
                Pre-selected product sets for common SEND and classroom needs.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
              {BUNDLES.length} bundles
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BUNDLES.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
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
              style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)', minWidth: 160 }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Audience tabs */}
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setAudienceFilter(tab.value)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: audienceFilter === tab.value ? TEAL : 'white',
                  color: audienceFilter === tab.value ? 'white' : '#6b6760',
                  border: `1px solid ${audienceFilter === tab.value ? TEAL : '#e8e6e0'}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('All')}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: categoryFilter === 'All' ? '#1c1a15' : 'white',
                color: categoryFilter === 'All' ? 'white' : '#6b6760',
                border: `1px solid ${categoryFilter === 'All' ? '#1c1a15' : '#e8e6e0'}`,
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
                  background: categoryFilter === cat ? '#1c1a15' : 'white',
                  color: categoryFilter === cat ? 'white' : '#6b6760',
                  border: `1px solid ${categoryFilter === cat ? '#1c1a15' : '#e8e6e0'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price + supplier + review */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#c5c2bb' }}>Price:</span>
              {(['All', ...PRICE_BANDS] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p as PriceBand | 'All')}
                  className="px-3 py-1 rounded-lg text-xs transition-colors border"
                  style={{
                    background: priceFilter === p ? '#f0fdf4' : 'white',
                    color: priceFilter === p ? '#15803d' : '#6b6760',
                    borderColor: priceFilter === p ? '#bbf7d0' : '#e8e6e0',
                  }}
                >
                  {p === 'All' ? 'Any' : p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#c5c2bb' }}>Supplier:</span>
              {(['All', ...SUPPLIER_TYPES] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSupplierFilter(s as SupplierType | 'All')}
                  className="px-3 py-1 rounded-lg text-xs transition-colors border"
                  style={{
                    background: supplierFilter === s ? '#e0f5f6' : 'white',
                    color: supplierFilter === s ? TEAL : '#6b6760',
                    borderColor: supplierFilter === s ? TEAL : '#e8e6e0',
                  }}
                >
                  {s === 'All' ? 'All' : s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold" style={{ color: '#c5c2bb' }}>Status:</span>
              {(['All', 'Reviewed', 'In Progress', 'Needs Review'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setReviewFilter(r as ReviewStatus | 'All')}
                  className="px-3 py-1 rounded-lg text-xs transition-colors border"
                  style={{
                    background: reviewFilter === r ? '#f5f3ff' : 'white',
                    color: reviewFilter === r ? '#7c3aed' : '#6b6760',
                    borderColor: reviewFilter === r ? '#c4b5fd' : '#e8e6e0',
                  }}
                >
                  {r === 'All' ? 'Any' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Count + clear */}
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {STAT_TOTAL} products
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: TEAL }}>
                Clear filters ×
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-display mb-2" style={{ color: 'var(--text)' }}>No products found</p>
            <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="text-sm font-semibold" style={{ color: TEAL }}>
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
      <div className="border-t" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
          <div>
            <SectionLabel>For Schools</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text)' }}>
              Procurement<br />
              <span style={{ color: TEAL }}>made easier.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#6b6760' }}>
              All products include supplier details, purchase model (buy/quote/lease) and compatibility notes for mainstream and SEND provision. Use the compare feature to shortlist up to four products side by side.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                to="/equipment/schools"
                className="inline-block px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: TEAL, color: 'white' }}
              >
                School procurement guide →
              </Link>
              <Link
                to="/equipment/send"
                className="inline-block px-5 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
                style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
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
                <p className="text-sm" style={{ color: '#6b6760' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL STRIP ─────────────────────────────────────────────────── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>
              Also on GetPromptly
            </p>
            <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'white' }}>
              Looking for AI tools instead?
            </h2>
            <p className="text-sm mt-2 max-w-sm" style={{ color: '#9ca3af' }}>
              Browse 155 AI tools independently assessed for UK school safety — with KCSIE 2025 and UK GDPR ratings.
            </p>
          </div>
          <Link
            to="/tools"
            className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
            style={{ borderColor: '#374151', color: '#9ca3af' }}
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
