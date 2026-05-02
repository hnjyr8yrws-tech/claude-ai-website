import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { BubbleLayer } from '../components/Bubbles';
import { track } from '../utils/analytics';
import AgentCTACard from '../components/AgentCTACard';
import LeadMagnet from '../components/LeadMagnet';
import ExpandableBundleCard from '../components/ExpandableBundleCard';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { useCrossSell } from '../hooks/useCrossSell';
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
  type EqBadge,
} from '../data/equipment';

const TEAL = '#BEFF00';
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
    case 'SEND Friendly':    return { bg: '#e0f2fe', color: '#0369a1' };
    case 'UK Specialist':    return { bg: '#f0fdf4', color: '#15803d' };
    case 'Amazon Available': return { bg: '#fff7ed', color: '#c2410c' };
    case 'School Quote':     return { bg: '#f5f3ff', color: '#7c3aed' };
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

const PRICE_BANDS: PriceBand[] = ['Under £50', '£50–150', '£150–500', '£500+'];
const SUPPLIER_TYPES: SupplierType[] = ['Amazon', 'UK Specialist', 'School Reseller', 'Direct'];
const REVIEW_STATUSES: ReviewStatus[] = ['Reviewed', 'Needs Review', 'In Progress'];

const SORT_OPTIONS = [
  { label: 'Featured',       value: 'featured' },
  { label: 'A–Z',            value: 'alpha' },
  { label: 'Price low–high', value: 'price-asc' },
  { label: 'Price high–low', value: 'price-desc' },
];

type CollectionFilter = {
  audience?: EqAudience;
  price?: PriceBand;
  supplier?: SupplierType;
  category?: EquipmentCategory;
};

const COLLECTIONS: { label: string; filter: CollectionFilter }[] = [
  { label: 'Best Classroom Technology', filter: { audience: 'Teachers' } },
  { label: 'Best Home Learning',        filter: { audience: 'Parents' } },
  { label: 'Best for Primary Schools',  filter: { audience: 'Schools' } },
  { label: 'Best for SEND',            filter: { audience: 'SEND' } },
  { label: 'Budget Picks Under £100',   filter: { price: 'Under £50' } },
  { label: 'Coding & Robotics',         filter: { category: 'Robots & Coding' } },
  { label: 'School Procurement',        filter: { audience: 'Schools' } },
  { label: 'Audio & Hearing',           filter: { category: 'Audio & Hearing' } },
];

const AUDIENCE_CARDS = [
  {
    title: 'For Teachers',
    desc: 'Classroom tech, visualisers, coding robots and study tools',
    to: '/ai-equipment/teachers',
    icon: '📚',
  },
  {
    title: 'For Schools',
    desc: 'Interactive displays, class packs, AV equipment and procurement support',
    to: '/ai-equipment/schools',
    icon: '🏫',
  },
  {
    title: 'For Parents',
    desc: 'Home learning devices, literacy tools, sensory and study kits',
    to: '/ai-equipment/parents',
    icon: '🏠',
  },
  {
    title: 'For Students',
    desc: 'Laptops, tablets, reading pens and study accessories',
    to: '/ai-equipment/students',
    icon: '🎒',
  },
  {
    title: 'For SEND Provision',
    desc: 'AAC, eye-gaze, sensory, assistive literacy and regulation tools',
    to: '/ai-equipment/send',
    icon: '♿',
  },
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
        borderColor: inCompare ? TEAL : '#ECE7DD',
        background: 'white',
        outline: inCompare ? `2px solid ${TEAL}` : 'none',
      }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>
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
        <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: '#4A4A4A' }}>{product.desc}</p>
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
          style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: '#9ca3af' }}
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
              borderColor: inCompare ? TEAL : '#ECE7DD',
              color: inCompare ? TEAL : '#9ca3af',
              background: inCompare ? '#e0f5f6' : 'white',
              opacity: (compareDisabled && !inCompare) ? 0.4 : 1,
              cursor: (compareDisabled && !inCompare) ? 'not-allowed' : 'pointer',
            }}
            aria-label={inCompare ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
          >
            {inCompare ? '✓ Added' : '+ Compare'}
          </button>

          <div className="flex flex-col items-end gap-0.5">
            <a
              href={resolveProductAffiliateUrl(product)}
              {...AFFILIATE_LINK_ATTRS}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: '#0F1C1A' }}
            >
              View →
            </a>
            <span className="text-[9px]" style={{ color: '#9C9690' }}>Affiliate link</span>
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
            className="text-xs px-4 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
            style={{
              background: items.length >= 2 ? TEAL : '#ECE7DD',
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
                <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: '#9C9690', width: 140 }}>Feature</th>
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
                    <td key={p.id} className="px-5 py-3 text-xs" style={{ color: '#1A1A1A' }}>{row.render(p)}</td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #f3f4f6' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#4A4A4A' }}>Badges</td>
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
              <tr style={{ borderTop: '1px solid #ECE7DD' }}>
                <td className="px-5 py-3 text-xs font-semibold" style={{ color: '#4A4A4A' }}>View</td>
                {items.map(p => (
                  <td key={p.id} className="px-5 py-3">
                    <a
                      href={resolveProductAffiliateUrl(p)}
                      {...AFFILIATE_LINK_ATTRS}
                      className="inline-block text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
                      style={{ background: TEAL, color: '#0F1C1A' }}
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

// ─── Mini product card (for section previews) ─────────────────────────────────

function MiniProductCard({ product }: { product: EquipmentProduct }) {
  const rb = reviewBadge(product.reviewStatus);
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-2"
      style={{ borderColor: '#ECE7DD', background: 'white' }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>
          {product.category}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rb.bg, color: rb.color }}>
          {rb.label}
        </span>
      </div>
      <Link to={`/ai-equipment/product/${product.slug}`}>
        <h4 className="font-display text-base leading-snug hover:underline" style={{ color: 'var(--text)' }}>
          {product.name}
        </h4>
      </Link>
      <p className="text-xs" style={{ color: '#9ca3af' }}>{product.brand}</p>
      <p className="text-xs leading-relaxed flex-1 line-clamp-2" style={{ color: '#4A4A4A' }}>{product.desc}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{product.priceBand}</span>
        <a
          href={resolveProductAffiliateUrl(product)}
          {...AFFILIATE_LINK_ATTRS}
          className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-opacity hover:opacity-80"
          style={{ background: TEAL, color: '#0F1C1A' }}
        >
          View →
        </a>
      </div>
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

  // Section data
  const classroomProducts = useMemo(() =>
    EQUIPMENT.filter(p =>
      ['Devices', 'Screens & Classroom Hardware', 'Robots & Coding', 'Audio & Hearing'].includes(p.category) &&
      (p.audience.includes('Schools') || p.audience.includes('Teachers'))
    ).slice(0, 6),
    []
  );

  const sendProducts = useMemo(() =>
    EQUIPMENT.filter(p => p.audience.includes('SEND')).slice(0, 6),
    []
  );

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

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0F1C1A' }}>
        <BubbleLayer
          bubbles={[
            { variant: 'lime', size: 380, top: '-15%', left: '-8%', anim: 'gp-float-a' },
            { variant: 'cyan', size: 340, top: '20%', right: '-10%', anim: 'gp-float-b' },
            { variant: 'soft-purple', size: 220, bottom: '-15%', left: '50%', anim: 'gp-float-c' },
          ]}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-10 z-10">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-6 px-3 py-1.5 rounded-full"
            style={{
              color: '#BEFF00',
              background: 'rgba(190,255,0,0.10)',
              border: '1px solid rgba(190,255,0,0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#BEFF00', boxShadow: '0 0 6px #BEFF00' }} aria-hidden="true" />
            Equipment Hub
          </span>
          <h1 className="font-display text-5xl sm:text-6xl mb-5 leading-[1.05]" style={{ color: 'white' }}>
            AI Equipment for<br />
            <em
              className="not-italic"
              style={{
                backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >UK Education</em>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Find the right technology for your classroom, school, home or SEND provision. 96 products reviewed and curated for UK education.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="#equipment-grid"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
              style={{
                background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                color: '#0F1C1A',
                border: '1px solid rgba(15,28,26,0.16)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
              }}
            >
              Browse All Equipment
            </a>
            <Link
              to="/ai-equipment/compare"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              Compare Products
            </Link>
            <button
              onClick={() => {
                const widget = document.getElementById('promptly-widget-trigger');
                if (widget) (widget as HTMLButtonElement).click();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              Ask Promptly for advice
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.map((s, i) => {
              const accents = ['#BEFF00', '#00D1FF', '#A78BFA', '#FFEA00', '#BEFF00'];
              return (
                <div
                  key={s.label}
                  className="rounded-2xl px-5 py-4"
                  style={{
                    background: 'linear-gradient(180deg, #142522 0%, #0F1C1A 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 18px rgba(0,0,0,0.30)',
                  }}
                >
                  <div className="font-display text-3xl" style={{ color: accents[i % accents.length] }}>{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AGENT CTA ───────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
        <AgentCTACard
          section="Promptly AI · Equipment Guide"
          headline="Find equipment for this learner need."
          description="Tell us who it's for, what you need and your budget — our AI advisor will recommend the right products and procurement routes."
          prompts={[
            "What's the best visualiser for a primary classroom?",
            "Compare interactive whiteboards for a 30-pupil class",
            "What SEND equipment helps with AAC communication?",
            "Help me build a home learning setup for £300",
          ]}
          analyticsSection="equipment"
        />
      </div>

      {/* ── AUDIENCE ENTRY CARDS ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>Browse by audience</SectionLabel>
        <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>
          Who are you buying for?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUDIENCE_CARDS.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="rounded-2xl border p-6 flex flex-col gap-3 transition-shadow hover:shadow-md group"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <div className="text-3xl">{card.icon}</div>
              <h3 className="font-display text-xl group-hover:underline" style={{ color: 'var(--text)' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: '#4A4A4A' }}>{card.desc}</p>
              <span className="text-sm font-semibold" style={{ color: TEAL }}>Browse →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── FEATURED COLLECTIONS ──────────────────────────────────────────────── */}
      <div className="border-y py-6 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9C9690' }}>
              Featured collections
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { offer: 'equipment-shortlist' } }))}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors hover:border-[#BEFF00] hover:text-[#BEFF00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
            >
              Email me an equipment shortlist
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide flex-nowrap">
            {COLLECTIONS.map(col => (
              <button
                key={col.label}
                onClick={() => applyCollection(col)}
                className="flex-shrink-0 text-sm px-4 py-2 rounded-xl border transition-colors hover:border-[#BEFF00] hover:text-[#BEFF00]"
                style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CLASSROOM TECH SECTION ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <SectionLabel>Classroom essentials</SectionLabel>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>
              Classroom Technology Essentials
            </h2>
          </div>
          <Link
            to="/ai-equipment/teachers"
            className="text-sm font-semibold hidden sm:inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: TEAL }}
          >
            View all classroom tech →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classroomProducts.map(p => (
            <MiniProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link
            to="/ai-equipment/teachers"
            className="text-sm font-semibold"
            style={{ color: TEAL }}
          >
            View all classroom tech →
          </Link>
        </div>
      </div>

      {/* ── SEND SECTION ──────────────────────────────────────────────────────── */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionLabel>Assistive technology</SectionLabel>
              <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>
                SEND &amp; Assistive Technology
              </h2>
            </div>
            <Link
              to="/ai-equipment/send"
              className="text-sm font-semibold hidden sm:inline-flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: TEAL }}
            >
              View all SEND equipment →
            </Link>
          </div>
          <p className="text-sm mb-8 max-w-2xl" style={{ color: '#4A4A4A' }}>
            Some products are specialist and may require school, therapist or family discussion before purchase.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sendProducts.map(p => (
              <MiniProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-6 sm:hidden">
            <Link
              to="/ai-equipment/send"
              className="text-sm font-semibold"
              style={{ color: TEAL }}
            >
              View all SEND equipment →
            </Link>
          </div>
        </div>
      </div>

      {/* ── BUNDLES ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>Ready-to-Use Equipment Sets</SectionLabel>
        <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>
          Practical starter sets for real classroom needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BUNDLES.map(b => (
            <ExpandableBundleCard key={b.id} bundle={b} surface="ai-equipment" />
          ))}
        </div>
      </div>

      {/* ── FULL FILTERABLE GRID ──────────────────────────────────────────────── */}
      <div id="equipment-grid" className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <SectionLabel>All products</SectionLabel>
            <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--text)' }}>
              Browse All 96 Products
            </h2>
          </div>

          {/* Search */}
          <div className="mb-5">
            <input
              type="search"
              placeholder="Search by name, brand or use case…"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) track({ name: 'search_performed', section: 'equipment', query: e.target.value });
              }}
              className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
              style={{
                borderColor: '#ECE7DD',
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
                  borderColor: audienceFilter === t.value ? TEAL : '#ECE7DD',
                  background: audienceFilter === t.value ? '#e0f5f6' : 'white',
                  color: audienceFilter === t.value ? TEAL : '#4A4A4A',
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
                borderColor: categoryFilter === 'All' ? TEAL : '#ECE7DD',
                background: categoryFilter === 'All' ? '#e0f5f6' : 'white',
                color: categoryFilter === 'All' ? TEAL : '#4A4A4A',
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
                  borderColor: categoryFilter === cat ? TEAL : '#ECE7DD',
                  background: categoryFilter === cat ? '#e0f5f6' : 'white',
                  color: categoryFilter === cat ? TEAL : '#4A4A4A',
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
                  borderColor: priceFilter === 'All' ? TEAL : '#ECE7DD',
                  background: priceFilter === 'All' ? '#e0f5f6' : 'white',
                  color: priceFilter === 'All' ? TEAL : '#4A4A4A',
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
                    borderColor: priceFilter === pb ? TEAL : '#ECE7DD',
                    background: priceFilter === pb ? '#e0f5f6' : 'white',
                    color: priceFilter === pb ? TEAL : '#4A4A4A',
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
                  borderColor: supplierFilter === 'All' ? TEAL : '#ECE7DD',
                  background: supplierFilter === 'All' ? '#e0f5f6' : 'white',
                  color: supplierFilter === 'All' ? TEAL : '#4A4A4A',
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
                    borderColor: supplierFilter === st ? TEAL : '#ECE7DD',
                    background: supplierFilter === st ? '#e0f5f6' : 'white',
                    color: supplierFilter === st ? TEAL : '#4A4A4A',
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
                  borderColor: reviewFilter === 'All' ? TEAL : '#ECE7DD',
                  background: reviewFilter === 'All' ? '#e0f5f6' : 'white',
                  color: reviewFilter === 'All' ? TEAL : '#4A4A4A',
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
                    borderColor: reviewFilter === rs ? TEAL : '#ECE7DD',
                    background: reviewFilter === rs ? '#e0f5f6' : 'white',
                    color: reviewFilter === rs ? TEAL : '#4A4A4A',
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
                style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result count + clear */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm" style={{ color: '#4A4A4A' }}>
              Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {EQUIPMENT.length} products
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                style={{ borderColor: '#ECE7DD', color: '#9ca3af' }}
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
              <p className="text-base mb-2" style={{ color: '#4A4A4A' }}>No products match your filters.</p>
              <button onClick={clearFilters} className="text-sm font-semibold" style={{ color: TEAL }}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── EQUIPMENT LEAD MAGNET + PROCUREMENT PROMO ─────────────────────────── */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            <LeadMagnet
              eyebrow="Free download"
              headline="Email me this equipment set"
              description={
                <>
                  Save the products from this hub as a printable shortlist — prices, suppliers, SEND notes, KCSIE compatibility — so you can share it with your business manager, SLT or governors. We'll email it to you in 60 seconds.
                </>
              }
              buttonLabel="Email me the set →"
              analyticsSection="equipment-hub-set"
            />
            <div
              className="rounded-2xl border p-6 sm:p-8 flex flex-col"
              style={{
                borderColor: '#ECE7DD',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F5F0 100%)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 24px rgba(15,28,26,0.06)',
              }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 self-start"
                style={{ background: 'rgba(190,255,0,0.18)', color: '#0F1C1A' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#BEFF00', boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
                  aria-hidden="true"
                />
                School procurement
              </span>
              <h2 className="font-display text-2xl sm:text-3xl mb-3 leading-tight" style={{ color: '#0F1C1A' }}>
                Buying for a school, MAT or SEND setting?
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A4A4A' }}>
                Whether it's a single classroom display, a year-group device refresh or a whole-school AAC roll-out — we'll help you compare suppliers, decode procurement frameworks and stress-test the spec before you commit.
              </p>
              <ul className="space-y-2 mb-5 text-sm" style={{ color: '#4A4A4A' }}>
                {[
                  'Independent reviews — no vendor commission',
                  'KCSIE 2025 + UK GDPR compliance check',
                  'CCS, NEPA, ESPO framework guidance',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#BEFF00] font-bold flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 mt-auto">
                <Link
                  to="/ai-equipment/schools"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                  style={{
                    background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                    color: '#0F1C1A',
                    border: '1px solid rgba(15,28,26,0.16)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
                  }}
                >
                  School buying guide →
                </Link>
                <Link
                  to="/ai-equipment/send"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#BEFF00]"
                  style={{ borderColor: '#ECE7DD', color: '#0F1C1A', background: 'white' }}
                >
                  SEND equipment guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL RECOMMENDATIONS ────────────────────────────────────────── */}
      {inlineItems.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#9C9690' }}>
            You might also like
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inlineItems.map(item => (
              <CrossSellCard key={item.id} item={item} sourceSection="equipment" />
            ))}
          </div>
        </div>
      )}
      {/* ── DARK CROSS-SELL BAND ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 sm:px-8 py-12"
        style={{ background: 'linear-gradient(180deg, #0F1C1A 0%, #1B302C 100%)' }}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Also from GetPromptly
            </p>
            <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#FFFFFF' }}>
              The full UK education AI stack
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { to: '/tools',       title: 'AI Tools',     desc: '243 tools — every one safety-scored against KCSIE 2025.', accent: '#BEFF00' },
              { to: '/ai-training', title: 'AI Training',  desc: '76 free + paid pathways — teachers, leaders, parents, students.', accent: '#00D1FF' },
              { to: '/prompts',     title: 'Prompt Library', desc: '440+ ready-to-copy prompts for every UK education role.', accent: '#A78BFA' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="group p-5 rounded-2xl border transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: 'rgba(255,255,255,0.10)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                <p className="font-display text-lg mb-1 transition-colors" style={{ color: item.accent }}>
                  {item.title} →
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
