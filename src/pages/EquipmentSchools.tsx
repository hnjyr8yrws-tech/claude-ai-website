import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { EQUIPMENT, BUNDLES, type EquipmentProduct, type PurchaseModel } from '../data/equipment';

const TEAL = '#00808a';

// ─── School-relevant products ─────────────────────────────────────────────────

const SCHOOL_PRODUCTS = EQUIPMENT.filter(p => p.audience.includes('Schools'));

const PURCHASE_MODELS: PurchaseModel[] = ['Buy', 'Quote', 'Subscription', 'Lease'];

const SCHOOL_BUNDLES = BUNDLES.filter(b => b.audience.includes('Schools'));

// ─── Procurement checklist ────────────────────────────────────────────────────

const CHECKLIST = [
  {
    step: '01',
    title: 'Define the need',
    body: 'Involve the SENCO, class teacher and (where appropriate) OT before selecting equipment. Document the specific learning or access barrier the product should address.',
  },
  {
    step: '02',
    title: 'Check supplier frameworks',
    body: 'UK schools must ensure procurement complies with the Public Contracts Regulations 2015. Many items are available via Crown Commercial Service or regional buying groups — check before going direct.',
  },
  {
    step: '03',
    title: 'Request a school quote',
    body: 'UK specialist suppliers (TTS, Inclusive Technology, Rompa) offer school accounts with invoice billing, bulk pricing and VAT exemption for qualifying SEND items. Always request a school quote for orders over £150.',
  },
  {
    step: '04',
    title: 'Check VAT exemption',
    body: 'Equipment designed for disabled people — including most AAC devices, sensory tools and specialist peripherals — qualifies for zero-rated VAT when purchased by a school for a named pupil with a disability.',
  },
  {
    step: '05',
    title: 'Trial before full rollout',
    body: 'For classroom hardware, coding kits and multi-unit purchases, request a demonstration unit or short-term loan before committing. Most UK education suppliers offer this as standard.',
  },
  {
    step: '06',
    title: 'Data protection check',
    body: 'For any connected device or software subscription, complete a Data Protection Impact Assessment (DPIA) and confirm a Data Processing Agreement with the supplier before deployment.',
  },
];

const SUPPLIER_NOTES = [
  {
    type: 'Amazon',
    title: 'Amazon (Business / Consumer)',
    desc: 'Fast delivery, competitive pricing. Suitable for low-cost consumables and widely available products. Set up an Amazon Business account for VAT invoices. Not recommended for specialist SEND items where supplier expertise matters.',
    pros: ['Next-day delivery', 'Competitive pricing', 'Easy returns'],
    cons: ['No educational account support', 'No loan or demo scheme', 'Limited specialist advice'],
  },
  {
    type: 'UK Specialist',
    title: 'UK Specialist Suppliers (TTS, Rompa, Inclusive Technology etc.)',
    desc: 'UK education specialists with dedicated school accounts, SEND expertise, and curriculum-aligned product ranges. Offer VAT exemption processing, loan schemes, and CPD support.',
    pros: ['School account with invoice billing', 'SEND expertise and advice', 'VAT exemption processing', 'Loan/demo schemes'],
    cons: ['Higher prices than Amazon', 'Longer delivery times'],
  },
  {
    type: 'School Reseller',
    title: 'School Resellers (LGfL, Computacenter etc.)',
    desc: 'Volume resellers operating on education framework contracts. Best for devices, AV equipment, and large-scale procurement. Offer leasing and asset management.',
    pros: ['Framework compliance', 'Leasing options', 'Account management', 'Volume pricing'],
    cons: ['Minimum order thresholds', 'Less suitable for small one-off items'],
  },
  {
    type: 'Direct',
    title: 'Direct from Manufacturer',
    desc: 'Some specialist manufacturers (e.g. Tobii Dynavox for AAC) sell direct with full assessment and support services. Best for high-value specialist equipment.',
    pros: ['Full assessment support', 'Manufacturer warranty', 'Specialist training included'],
    cons: ['Highest prices', 'Longer procurement lead times'],
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

function ProductRow({ product }: { product: EquipmentProduct }) {
  const purchaseColour: Record<PurchaseModel, { bg: string; color: string }> = {
    Buy:          { bg: '#f0fdf4', color: '#15803d' },
    Quote:        { bg: '#e0f5f6', color: TEAL },
    Subscription: { bg: '#f5f3ff', color: '#7c3aed' },
    Lease:        { bg: '#fef9c3', color: '#854d0e' },
  };
  const ps = purchaseColour[product.purchaseModel];

  return (
    <tr className="border-b" style={{ borderColor: '#f3f4f6' }}>
      <td className="px-4 py-3">
        <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{product.name}</div>
        <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{product.brand}</div>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: '#6b6760' }}>{product.category}</td>
      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{product.priceBand}</td>
      <td className="px-4 py-3">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: ps.bg, color: ps.color }}>
          {product.purchaseModel}
        </span>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: '#6b6760' }}>{product.supplierName}</td>
      <td className="px-4 py-3">
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: TEAL }}
        >
          View →
        </a>
      </td>
    </tr>
  );
}

export default function EquipmentSchools() {
  const [purchaseFilter, setPurchaseFilter] = useState<PurchaseModel | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let results = SCHOOL_PRODUCTS;
    if (purchaseFilter !== 'All') results = results.filter(p => p.purchaseModel === purchaseFilter);
    if (search.trim())
      results = results.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    return results;
  }, [purchaseFilter, search]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="School Equipment Procurement Guide – UK Education | GetPromptly"
        description="Independent procurement guidance for UK schools — how to buy education equipment compliantly, VAT exemptions, supplier frameworks, and SEND equipment funding."
        keywords="school equipment procurement UK, education equipment buying guide, SEND equipment funding, VAT exemption education, school reseller UK"
        path="/equipment/schools"
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="mb-4">
          <Link to="/equipment" className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: TEAL }}>
            ← Equipment Hub
          </Link>
        </div>
        <SectionLabel>For Schools</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          School<br />
          <span style={{ color: TEAL }}>Procurement.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl" style={{ color: '#6b6760' }}>
          {SCHOOL_PRODUCTS.length} products available for school procurement — with supplier types, purchase models, VAT notes, and framework compliance guidance.
        </p>
      </div>

      {/* ── PROCUREMENT CHECKLIST ─────────────────────────────────────────────── */}
      <div className="border-t border-b" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
          <FadeIn>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Procurement checklist
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {CHECKLIST.map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.06}>
                <div className="flex gap-5 p-5 rounded-xl border" style={{ borderColor: '#e8e6e0' }}>
                  <span
                    className="font-display text-2xl flex-shrink-0 w-10 text-center leading-none mt-0.5"
                    style={{ color: TEAL }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── SUPPLIER GUIDE ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <FadeIn>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>Supplier types explained</h2>
          <p className="text-sm mb-8" style={{ color: '#6b6760' }}>
            Choose the right supplier channel for your procurement type.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SUPPLIER_NOTES.map((s, i) => (
            <FadeIn key={s.type} delay={i * 0.06}>
              <div className="rounded-2xl border p-6" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                <h3 className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b6760' }}>{s.desc}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#15803d' }}>Pros</p>
                    <ul className="space-y-1">
                      {s.pros.map(p => (
                        <li key={p} className="text-xs flex gap-1.5" style={{ color: '#6b6760' }}>
                          <span style={{ color: '#15803d' }}>✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#9a3412' }}>Cons</p>
                    <ul className="space-y-1">
                      {s.cons.map(c => (
                        <li key={c} className="text-xs flex gap-1.5" style={{ color: '#6b6760' }}>
                          <span style={{ color: '#9a3412' }}>×</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── BUNDLES FOR SCHOOLS ───────────────────────────────────────────────── */}
      {SCHOOL_BUNDLES.length > 0 && (
        <div className="border-t" style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
            <FadeIn>
              <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--text)' }}>
                Bundles for schools
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCHOOL_BUNDLES.map((bundle, i) => (
                <FadeIn key={bundle.id} delay={i * 0.06}>
                  <div className="rounded-2xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
                      Bundle · {bundle.totalPriceBand}
                    </p>
                    <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>{bundle.name}</h3>
                    <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{bundle.tagline}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{bundle.desc}</p>
                    <p className="text-xs mt-3 font-semibold" style={{ color: TEAL }}>
                      {bundle.productSlugs.length} products included
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT TABLE ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          Products for schools
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="flex-1 pl-4 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
            style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)', maxWidth: 360 }}
          />
          <div className="flex gap-2 flex-wrap">
            {(['All', ...PURCHASE_MODELS] as const).map(m => (
              <button
                key={m}
                onClick={() => setPurchaseFilter(m as PurchaseModel | 'All')}
                className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
                style={{
                  background: purchaseFilter === m ? TEAL : 'white',
                  color: purchaseFilter === m ? 'white' : '#6b6760',
                  borderColor: purchaseFilter === m ? TEAL : '#e8e6e0',
                }}
              >
                {m === 'All' ? 'All models' : m}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>
          Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> products
        </p>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden overflow-x-auto" style={{ borderColor: '#e8e6e0' }}>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr style={{ background: '#f7f6f2', borderBottom: '1px solid #e8e6e0' }}>
                {['Product', 'Category', 'Price', 'Purchase', 'Supplier', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#c5c2bb' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: '#9ca3af' }}>
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(p => <ProductRow key={p.id} product={p} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
            Need tailored advice?
          </p>
          <h2 className="font-display text-2xl sm:text-3xl mb-3" style={{ color: 'white' }}>
            Ask the Promptly AI
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
            Describe your school's budget, year group, and what you're trying to support — the AI will suggest specific products and procurement routes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                const widget = document.getElementById('promptly-widget-trigger');
                if (widget) (widget as HTMLButtonElement).click();
              }}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: 'white' }}
            >
              Get procurement advice →
            </button>
            <Link
              to="/equipment"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: '#374151', color: '#9ca3af' }}
            >
              All equipment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
