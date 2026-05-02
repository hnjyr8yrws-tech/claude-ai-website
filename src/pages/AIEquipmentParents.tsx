import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  BUNDLES,
  type EquipmentProduct,
  type EquipmentBundle,
  type PriceBand,
  type EqBadge,
} from '../data/equipment';
import { resolveProductAffiliateUrl, AFFILIATE_LINK_ATTRS } from '../utils/affiliateLinks';
import { badgeStyle, reviewBadge } from './AIEquipment';

const TEAL = '#BEFF00';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

function ProductCard({ product }: { product: EquipmentProduct }) {
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
        <h3 className="font-display text-base leading-snug hover:underline" style={{ color: 'var(--text)' }}>
          {product.name}
        </h3>
      </Link>
      <p className="text-xs" style={{ color: '#9ca3af' }}>{product.brand}</p>
      <p className="text-xs leading-relaxed flex-1 line-clamp-2" style={{ color: '#4A4A4A' }}>{product.desc}</p>
      <p className="text-xs italic" style={{ color: '#9ca3af' }}>Best for: {product.bestFor}</p>
      <div className="flex flex-wrap gap-1">
        {product.badges.slice(0, 2).map((b: EqBadge) => {
          const s = badgeStyle(b);
          return (
            <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
              {b}
            </span>
          );
        })}
      </div>
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

function BundleCard({ bundle }: { bundle: EquipmentBundle }) {
  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ borderColor: '#ECE7DD', background: 'white' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: TEAL }}>
        Bundle · {bundle.totalPriceBand}
      </p>
      <h3 className="font-display text-lg leading-snug" style={{ color: 'var(--text)' }}>{bundle.name}</h3>
      <p className="text-xs" style={{ color: '#9ca3af' }}>{bundle.tagline}</p>
      <p className="text-sm leading-relaxed flex-1" style={{ color: '#4A4A4A' }}>{bundle.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {bundle.senCategory.map((s: string) => (
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

const PRICE_GUIDE: { label: string; value: PriceBand; desc: string }[] = [
  { label: 'Under £50',  value: 'Under £50',  desc: 'Budget-friendly tools for everyday learning.' },
  { label: '£50–150',    value: '£50–150',    desc: 'Mid-range devices and literacy tools.' },
  { label: '£150–500',   value: '£150–500',   desc: 'Tablets, reading pens and specialist tools.' },
];

export default function AIEquipmentParents() {
  const parentProducts = useMemo(() =>
    EQUIPMENT.filter(p => p.audience.includes('Parents')),
    []
  );

  const budgetGroups = useMemo(() =>
    PRICE_GUIDE.map(g => ({
      ...g,
      products: parentProducts.filter(p => p.priceBand === g.value).slice(0, 4),
    })),
    [parentProducts]
  );

  const sendFriendlyHome = useMemo(() =>
    EQUIPMENT.filter(p =>
      p.senCategory.length > 0 &&
      (p.audience.includes('Parents') || p.audience.includes('SEND'))
    ).slice(0, 6),
    []
  );

  const bundles = useMemo(() =>
    BUNDLES.filter(b => b.audience.includes('Parents')),
    []
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Home Learning Equipment for Parents — GetPromptly"
        description="Tablets, reading pens, sensory tools and study accessories for supporting your child at home. Curated for UK parents."
        keywords="home learning equipment parents UK, tablets for children, reading pens, sensory tools home, SEND home learning"
        path="/ai-equipment/parents"
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>For Parents</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Equipment for<br />
          <span style={{ color: TEAL }}>Home Learning</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-6" style={{ color: '#4A4A4A' }}>
          Tablets, reading pens, sensory tools and study accessories for supporting your child at home.
        </p>
      </div>

      {/* ALL PARENT PRODUCTS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <SectionLabel>All products for parents</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          {parentProducts.length} Products for Home Learning
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {parentProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {parentProducts.length === 0 && (
          <p className="text-sm" style={{ color: '#9ca3af' }}>No products found.</p>
        )}
      </div>

      {/* BUDGET GUIDE */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Budget guide</SectionLabel>
          <h2 className="font-display text-2xl mb-8" style={{ color: 'var(--text)' }}>
            Shop by Budget
          </h2>
          <div className="space-y-10">
            {budgetGroups.map(group => (
              group.products.length > 0 && (
                <div key={group.label}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>{group.label}</h3>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{group.desc}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {group.products.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* SEND-FRIENDLY FOR HOME */}
      {sendFriendlyHome.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <SectionLabel>SEND-friendly picks</SectionLabel>
          <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>
            SEND-friendly Equipment for Home
          </h2>
          <div
            className="rounded-2xl border p-4 mb-6 flex items-start gap-3"
            style={{ borderColor: AMBER_BORDER, background: AMBER_BG }}
          >
            <span className="text-sm font-semibold" style={{ color: AMBER_TEXT }}>
              Note: Specialist SEND equipment should be discussed with your child's school, SENCO or therapist before purchase.
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sendFriendlyHome.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-6">
            <Link to="/ai-equipment/send" className="text-sm font-semibold" style={{ color: TEAL }}>
              View all SEND equipment →
            </Link>
          </div>
        </div>
      )}

      {/* BUNDLES FOR PARENTS */}
      {bundles.length > 0 && (
        <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Recommended bundles</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Ready-made Home Learning Sets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
            </div>
          </div>
        </div>
      )}

      {/* GUIDANCE NOTE */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: '#ECE7DD', background: 'white' }}
        >
          <h3 className="font-display text-xl mb-3" style={{ color: 'var(--text)' }}>
            A note on specialist SEND equipment
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#4A4A4A' }}>
            Products marked as SEND-specific — such as AAC devices, eye-gaze technology and specialist hearing equipment — should always be assessed in the context of your child's specific needs. We recommend:
          </p>
          <ul className="space-y-2 text-sm" style={{ color: '#4A4A4A' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: TEAL }}>•</span>
              Talking to your child's school and SENCO before purchasing
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: TEAL }}>•</span>
              Requesting an assessment through an occupational therapist or speech and language therapist
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: TEAL }}>•</span>
              Checking whether equipment may be funded through an EHCP
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: TEAL }}>•</span>
              Trialling before committing to high-cost items where possible
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div
        className="border-t px-5 sm:px-8 py-4"
        style={{ background: AMBER_BG, borderColor: AMBER_BORDER }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <p className="text-sm font-semibold" style={{ color: AMBER_TEXT }}>
            Need help choosing? Ask the Promptly AI or explore our parent resources.
          </p>
          <div className="flex flex-wrap gap-3">
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
            <Link
              to="/ai-training/parents"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-amber-50"
              style={{ borderColor: AMBER_BORDER, color: AMBER_TEXT }}
            >
              AI Training for Parents
            </Link>
            <Link
              to="/prompts/parents"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-amber-50"
              style={{ borderColor: AMBER_BORDER, color: AMBER_TEXT }}
            >
              Parent Prompts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
