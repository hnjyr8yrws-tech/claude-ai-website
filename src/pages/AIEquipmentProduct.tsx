import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  type EquipmentProduct,
  type EqBadge,
} from '../data/equipment';
import { badgeStyle, reviewBadge, catToSlug } from './AIEquipment';

const TEAL = '#00808a';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

const SCORE_DIMENSIONS = [
  { key: 'accessibility',            label: 'Accessibility' },
  { key: 'durability',               label: 'Durability' },
  { key: 'sendSuitability',          label: 'UK Education Suitability' },
  { key: 'procurementSuitability',   label: 'Procurement Clarity' },
  { key: 'setupComplexity',          label: 'Setup Complexity' },
] as const;

function RelatedCard({ product }: { product: EquipmentProduct }) {
  const rb = reviewBadge(product.reviewStatus);
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-2"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>
          {product.category}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rb.bg, color: rb.color }}>
          {rb.label}
        </span>
      </div>
      <Link to={`/ai-equipment/product/${product.slug}`}>
        <h3 className="font-display text-base leading-snug hover:underline" style={{ color: 'var(--text)' }}>
          {product.name}
        </h3>
      </Link>
      <p className="text-xs" style={{ color: '#9ca3af' }}>{product.brand}</p>
      <p className="text-xs leading-relaxed flex-1 line-clamp-2" style={{ color: '#6b6760' }}>{product.desc}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{product.priceBand}</span>
        <Link
          to={`/ai-equipment/product/${product.slug}`}
          className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-opacity hover:opacity-80"
          style={{ background: TEAL, color: 'white' }}
        >
          View →
        </Link>
      </div>
    </div>
  );
}

export default function AIEquipmentProduct() {
  const { productSlug } = useParams<{ productSlug: string }>();

  const product = useMemo(() =>
    EQUIPMENT.find(p => p.slug === productSlug) ?? null,
    [productSlug]
  );

  const related = useMemo(() => {
    if (!product) return [];
    return EQUIPMENT
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product]);

  // Not found
  if (!product) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <SEO
          title="Product Not Found — Equipment Hub | GetPromptly"
          description="This product could not be found."
          keywords="education equipment UK"
          path="/ai-equipment/product"
        />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 text-center">
          <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text)' }}>Product not found</h1>
          <p className="text-base mb-8" style={{ color: '#6b6760' }}>
            This product doesn't exist or may have been removed. Browse all equipment instead.
          </p>
          <Link
            to="/ai-equipment"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            ← Back to Equipment Hub
          </Link>
        </div>
      </div>
    );
  }

  const rb = reviewBadge(product.reviewStatus);
  const categorySlug = catToSlug(product.category);

  const detailRows: { label: string; value: string | boolean }[] = [
    { label: 'Price Band',     value: product.priceBand },
    { label: 'Supplier',       value: product.supplierName },
    { label: 'Supplier Type',  value: product.supplierType },
    { label: 'Purchase Model', value: product.purchaseModel },
    { label: 'UK Focus',       value: product.ukFocus ? '✓ Yes' : '—' },
    { label: 'Review Status',  value: product.reviewStatus },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title={`${product.name} — ${product.category} | GetPromptly`}
        description={`${product.desc} Best for: ${product.bestFor}. Price: ${product.priceBand}. Supplier: ${product.supplierName}.`}
        keywords={`${product.name}, ${product.brand}, ${product.category.toLowerCase()} UK, ${product.senCategory.join(', ')}`}
        path={`/ai-equipment/product/${product.slug}`}
      />

      {/* BREADCRUMB */}
      <div className="border-b" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-2 text-xs flex-wrap" style={{ color: '#9ca3af' }}>
          <Link to="/ai-equipment" className="hover:underline" style={{ color: TEAL }}>Equipment</Link>
          <span>/</span>
          <Link to={`/ai-equipment/category/${categorySlug}`} className="hover:underline" style={{ color: TEAL }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: '#6b6760' }}>{product.name}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: main details */}
          <div className="lg:col-span-2">
            {/* Category + status badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Link
                to={`/ai-equipment/category/${categorySlug}`}
                className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border transition-colors hover:border-[#00808a]"
                style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
              >
                {product.category}
              </Link>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: rb.bg, color: rb.color }}
              >
                {rb.label}
              </span>
            </div>

            {/* Name + Brand */}
            <h1 className="font-display text-4xl sm:text-5xl mb-2 leading-tight" style={{ color: 'var(--text)' }}>
              {product.name}
            </h1>
            <p className="text-base mb-6" style={{ color: '#9ca3af' }}>{product.brand}</p>

            {/* Description */}
            <p className="text-base leading-relaxed mb-4" style={{ color: '#6b6760' }}>
              {product.desc}
            </p>

            {/* Best for */}
            <p className="text-sm italic mb-6" style={{ color: '#9ca3af' }}>
              Best for: {product.bestFor}
            </p>

            {/* All badges */}
            {product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.badges.map((b: EqBadge) => {
                  const s = badgeStyle(b);
                  return (
                    <span key={b} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {b}
                    </span>
                  );
                })}
              </div>
            )}

            {/* SEN categories */}
            {product.senCategory.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>
                  SEN Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.senCategory.map((s: string) => (
                    <span key={s} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Audience */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>
                Who it's for
              </p>
              <div className="flex flex-wrap gap-2">
                {product.audience.map((a: string) => (
                  <span key={a} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Education levels */}
            {product.educationLevel.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>
                  Education Level
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.educationLevel.map((l: string) => (
                    <span key={l} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment Score */}
            <div className="rounded-2xl border p-6 mb-8" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <SectionLabel>Equipment Score</SectionLabel>
              <h2 className="font-display text-xl mb-4" style={{ color: 'var(--text)' }}>
                Safety &amp; Suitability Score
              </h2>
              <div className="space-y-3">
                {SCORE_DIMENSIONS.map(dim => (
                  <div
                    key={dim.key}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border"
                    style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}
                  >
                    <span className="text-sm" style={{ color: '#6b6760' }}>{dim.label}</span>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <circle cx="7" cy="7" r="6" stroke="#d1d5db" strokeWidth="1.5"/>
                        <path d="M7 4v3.5l2 1.5" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      In progress
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: '#c5c2bb' }}>
                Scoring for this product is in progress. Check back soon.
              </p>
            </div>

            {/* Trust disclaimer */}
            <p className="text-xs leading-relaxed mb-8" style={{ color: '#9ca3af' }}>
              Product details are based on publicly available information. Always verify specs and pricing directly with the supplier. SEND equipment should be assessed in the context of the individual's needs.
            </p>

            {/* Agent CTA */}
            <div
              className="rounded-2xl border px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
              style={{ borderColor: AMBER_BORDER, background: AMBER_BG }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: AMBER_TEXT }}>
                  Ask the GetPromptly AI about this product →
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#78350f' }}>
                  Get a recommendation based on your specific need, budget or SEND requirement.
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

          {/* RIGHT: sidebar */}
          <div className="lg:col-span-1">
            {/* Details card */}
            <div className="rounded-2xl border p-6 mb-6 sticky top-6" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <h2 className="font-display text-lg mb-4" style={{ color: 'var(--text)' }}>Product Details</h2>

              <table className="w-full text-sm mb-6">
                <tbody>
                  {detailRows.map((row, i) => (
                    <tr key={row.label} style={{ borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
                      <td className="py-2.5 text-xs font-semibold" style={{ color: '#9ca3af' }}>{row.label}</td>
                      <td className="py-2.5 text-xs text-right" style={{ color: '#1c1a15' }}>{String(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Where to buy */}
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>
                Where to buy
              </h3>
              <div className="space-y-3">
                <a
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  View on {product.supplierName} →
                </a>

                {product.purchaseModel === 'Quote' && (
                  <button
                    onClick={() => {
                      const widget = document.getElementById('promptly-widget-trigger');
                      if (widget) (widget as HTMLButtonElement).click();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-gray-50"
                    style={{ borderColor: TEAL, color: TEAL }}
                  >
                    Request a Quote
                  </button>
                )}
              </div>

              <p className="text-[10px] leading-relaxed mt-4" style={{ color: '#c5c2bb' }}>
                Affiliate link — we may earn a small commission at no extra cost to you. All reviews are independent.
              </p>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-14">
            <SectionLabel>Related products</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              More in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
            <div className="mt-6">
              <Link
                to={`/ai-equipment/category/${categorySlug}`}
                className="text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: TEAL }}
              >
                View all {product.category} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
