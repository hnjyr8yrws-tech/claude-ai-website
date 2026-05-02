import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  type EquipmentProduct,
  type EquipmentCategory,
  type EqAudience,
  type PriceBand,
  type ReviewStatus,
  type EqBadge,
} from '../data/equipment';
import { badgeStyle, reviewBadge, CAT_SLUG, catToSlug } from './AIEquipment';

const TEAL = '#BEFF00';

const AUDIENCE_TABS: { label: string; value: EqAudience | 'All' }[] = [
  { label: 'All',      value: 'All' },
  { label: 'Teachers', value: 'Teachers' },
  { label: 'Schools',  value: 'Schools' },
  { label: 'SEND',     value: 'SEND' },
  { label: 'Parents',  value: 'Parents' },
  { label: 'Students', value: 'Students' },
];

const PRICE_BANDS: PriceBand[] = ['Under £50', '£50–150', '£150–500', '£500+'];
const REVIEW_STATUSES: ReviewStatus[] = ['Reviewed', 'In Progress', 'Needs Review'];

const ALL_CATEGORIES = Object.values(CAT_SLUG) as EquipmentCategory[];

function ProductCard({ product }: { product: EquipmentProduct }) {
  const rb = reviewBadge(product.reviewStatus);
  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ borderColor: '#ECE7DD', background: 'white' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>
            {product.subcategory || product.category}
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

        {product.senCategory.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.senCategory.map((s: string) => (
              <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
                {s}
              </span>
            ))}
          </div>
        )}

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
          <Link
            to={`/ai-equipment/product/${product.slug}`}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: '#0F1C1A' }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AIEquipmentCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [audienceFilter, setAudienceFilter] = useState<EqAudience | 'All'>('All');
  const [priceFilter,    setPriceFilter]    = useState<PriceBand | 'All'>('All');
  const [reviewFilter,   setReviewFilter]   = useState<ReviewStatus | 'All'>('All');

  const category = categorySlug ? CAT_SLUG[categorySlug] ?? null : null;

  const products = useMemo(() => {
    if (!category) return [];
    let results = EQUIPMENT.filter(p => p.category === category);
    if (audienceFilter !== 'All') results = results.filter(p => p.audience.includes(audienceFilter));
    if (priceFilter    !== 'All') results = results.filter(p => p.priceBand === priceFilter);
    if (reviewFilter   !== 'All') results = results.filter(p => p.reviewStatus === reviewFilter);
    return results;
  }, [category, audienceFilter, priceFilter, reviewFilter]);

  const totalInCategory = useMemo(() =>
    category ? EQUIPMENT.filter(p => p.category === category).length : 0,
    [category]
  );

  const adjacentCategories = ALL_CATEGORIES.filter(c => c !== category);

  function clearFilters() {
    setAudienceFilter('All');
    setPriceFilter('All');
    setReviewFilter('All');
  }

  const hasActive = audienceFilter !== 'All' || priceFilter !== 'All' || reviewFilter !== 'All';

  if (!category) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <SEO
          title="Category Not Found — Equipment Hub | GetPromptly"
          description="This equipment category could not be found."
          keywords="equipment UK education"
          path="/ai-equipment/category"
        />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 text-center">
          <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text)' }}>Category not found</h1>
          <p className="text-base mb-8" style={{ color: '#4A4A4A' }}>
            This category doesn't exist. Browse all equipment instead.
          </p>
          <Link
            to="/ai-equipment"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: '#0F1C1A' }}
          >
            ← Back to Equipment Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title={`${category} — Equipment Hub | GetPromptly`}
        description={`Browse ${totalInCategory} products in ${category}. UK education equipment independently reviewed for schools, SEND provision and home learning.`}
        keywords={`${category.toLowerCase()} UK education, school equipment, SEND ${category.toLowerCase()}`}
        path={`/ai-equipment/category/${categorySlug}`}
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>Category</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          {category}
        </h1>
        <p className="text-base max-w-xl" style={{ color: '#4A4A4A' }}>
          {totalInCategory} products in this category, independently reviewed for UK education.
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-6">
        {/* Audience */}
        <div className="flex gap-2 flex-wrap mb-4">
          {AUDIENCE_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setAudienceFilter(t.value)}
              className="text-sm px-4 py-1.5 rounded-xl border transition-colors font-medium"
              style={{
                borderColor: audienceFilter === t.value ? TEAL : '#ECE7DD',
                background:  audienceFilter === t.value ? '#e0f5f6' : 'white',
                color:       audienceFilter === t.value ? TEAL : '#4A4A4A',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex gap-2 flex-wrap items-center mb-4">
          <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Price:</span>
          <button
            onClick={() => setPriceFilter('All')}
            className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
            style={{
              borderColor: priceFilter === 'All' ? TEAL : '#ECE7DD',
              background:  priceFilter === 'All' ? '#e0f5f6' : 'white',
              color:       priceFilter === 'All' ? TEAL : '#4A4A4A',
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
                background:  priceFilter === pb ? '#e0f5f6' : 'white',
                color:       priceFilter === pb ? TEAL : '#4A4A4A',
              }}
            >
              {pb}
            </button>
          ))}
        </div>

        {/* Review status */}
        <div className="flex gap-2 flex-wrap items-center mb-6">
          <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Status:</span>
          <button
            onClick={() => setReviewFilter('All')}
            className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
            style={{
              borderColor: reviewFilter === 'All' ? TEAL : '#ECE7DD',
              background:  reviewFilter === 'All' ? '#e0f5f6' : 'white',
              color:       reviewFilter === 'All' ? TEAL : '#4A4A4A',
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
                background:  reviewFilter === rs ? '#e0f5f6' : 'white',
                color:       reviewFilter === rs ? TEAL : '#4A4A4A',
              }}
            >
              {rs}
            </button>
          ))}
          {hasActive && (
            <button
              onClick={clearFilters}
              className="text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: '#ECE7DD', color: '#9ca3af' }}
            >
              Clear filters
            </button>
          )}
        </div>

        <p className="text-sm mb-6" style={{ color: '#4A4A4A' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{products.length}</strong> of {totalInCategory} products
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-base mb-4" style={{ color: '#4A4A4A' }}>No products match your filters.</p>
            <button onClick={clearFilters} className="text-sm font-semibold" style={{ color: TEAL }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ADJACENT CATEGORIES */}
      <div className="border-t py-10 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9C9690' }}>
            Other categories
          </p>
          <div className="flex flex-wrap gap-2">
            {adjacentCategories.map(cat => {
              const count = EQUIPMENT.filter(p => p.category === cat).length;
              return (
                <Link
                  key={cat}
                  to={`/ai-equipment/category/${catToSlug(cat)}`}
                  className="text-sm px-4 py-2 rounded-xl border transition-colors hover:border-[#BEFF00] hover:text-[#BEFF00]"
                  style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'var(--bg)' }}
                >
                  {cat} <span className="ml-1" style={{ color: '#9C9690' }}>({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
