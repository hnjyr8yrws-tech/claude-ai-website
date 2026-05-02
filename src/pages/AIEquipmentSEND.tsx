import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  BUNDLES,
  type EquipmentProduct,
  type EquipmentBundle,
  type EquipmentCategory,
  type EqBadge,
} from '../data/equipment';
import { resolveProductAffiliateUrl, AFFILIATE_LINK_ATTRS } from '../utils/affiliateLinks';
import { badgeStyle, reviewBadge, catToSlug } from './AIEquipment';

const TEAL = '#BEFF00';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

const SEND_CATEGORY_CARDS: { label: string; category: EquipmentCategory; desc: string }[] = [
  { label: 'AAC & Communication', category: 'AAC & Communication',     desc: 'Voice output devices, symbol boards and communication apps' },
  { label: 'Sensory & Regulation', category: 'Sensory & Regulation',  desc: 'Calming tools, sensory rooms and regulation aids' },
  { label: 'Stationery & Literacy', category: 'Stationery & Literacy', desc: 'Reading pens and dyslexia/literacy support tools' },
  { label: 'Audio & Hearing',       category: 'Audio & Hearing',       desc: 'Hearing loops, FM systems and audio support' },
  { label: 'Wearables & Safety',    category: 'Wearables & Safety',    desc: 'GPS trackers, sensory clothing and safety wearables' },
];

const GUIDANCE_CARDS = [
  {
    title: 'Involve the SENCO and OT early',
    desc: 'Specialist equipment should be recommended or approved by the SENCO and, where appropriate, an occupational therapist or speech and language therapist.',
    icon: '👩‍🏫',
  },
  {
    title: 'Trial before committing',
    desc: 'Many UK specialists offer trial periods for high-cost items. Always request a trial before committing to expensive assistive technology.',
    icon: '🔍',
  },
  {
    title: 'Check EHCP funding eligibility',
    desc: 'Equipment specified in a child\'s Education, Health and Care Plan (EHCP) may be funded by the local authority. Check before purchasing privately.',
    icon: '📋',
  },
  {
    title: 'UK GDPR applies to connected devices',
    desc: 'AAC devices and connected assistive technology collect personal data. Ensure any device complies with UK GDPR before use in school.',
    icon: '🔒',
  },
];

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
      {product.senCategory.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {product.senCategory.map((s: string) => (
            <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
              {s}
            </span>
          ))}
        </div>
      )}
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

export default function AIEquipmentSEND() {
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'All'>('All');
  const [senFilter, setSenFilter] = useState<string>('All');

  const sendProducts = useMemo(() =>
    EQUIPMENT.filter(p => p.audience.includes('SEND')),
    []
  );

  const allSenCategories = useMemo(() => {
    const cats = new Set<string>();
    sendProducts.forEach(p => p.senCategory.forEach((c: string) => cats.add(c)));
    return Array.from(cats).sort();
  }, [sendProducts]);

  const filteredProducts = useMemo(() => {
    let results = sendProducts;
    if (categoryFilter !== 'All') results = results.filter(p => p.category === categoryFilter);
    if (senFilter !== 'All') results = results.filter(p => p.senCategory.includes(senFilter));
    return results;
  }, [sendProducts, categoryFilter, senFilter]);

  const bundles = useMemo(() =>
    BUNDLES.filter(b => b.audience.includes('SEND')),
    []
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="SEND Assistive Technology — Equipment Hub | GetPromptly"
        description="AAC devices, sensory tools, hearing supports, assistive literacy and classroom adaptations for SEND pupils. UK-focused and independently reviewed."
        keywords="SEND assistive technology UK, AAC devices, sensory tools schools, hearing loop, assistive literacy SEND"
        path="/ai-equipment/send"
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>For SEND Provision</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          SEND &amp; Assistive<br />
          <span style={{ color: TEAL }}>Technology</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-6" style={{ color: '#4A4A4A' }}>
          AAC devices, sensory tools, hearing supports, assistive literacy and classroom adaptations for SEND pupils.
        </p>

        {/* Trust disclaimer */}
        <div
          className="rounded-xl border p-4 max-w-2xl"
          style={{ borderColor: AMBER_BORDER, background: AMBER_BG }}
        >
          <p className="text-xs leading-relaxed" style={{ color: AMBER_TEXT }}>
            <strong>Important:</strong> SEND equipment should always be assessed in the context of the individual pupil's needs. Involve the SENCO, occupational therapist and/or speech and language therapist before purchase. Some items may be funded through an EHCP.
          </p>
        </div>
      </div>

      {/* BROWSE BY TYPE */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <SectionLabel>Browse by type</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          What kind of support do you need?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SEND_CATEGORY_CARDS.map(card => {
            const count = EQUIPMENT.filter(p => p.category === card.category && p.audience.includes('SEND')).length;
            return (
              <Link
                key={card.label}
                to={`/ai-equipment/category/${catToSlug(card.category)}`}
                className="rounded-xl border p-5 flex flex-col gap-2 transition-shadow hover:shadow-md"
                style={{ borderColor: '#ECE7DD', background: 'white' }}
              >
                <h3 className="font-display text-base" style={{ color: 'var(--text)' }}>{card.label}</h3>
                <p className="text-sm flex-1" style={{ color: '#4A4A4A' }}>{card.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{count} products</span>
                  <span className="text-xs font-semibold" style={{ color: TEAL }}>Browse →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ALL SEND PRODUCTS */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>All SEND products</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            {filteredProducts.length} Products for SEND Provision
          </h2>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => { setCategoryFilter('All'); setSenFilter('All'); }}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                borderColor: categoryFilter === 'All' && senFilter === 'All' ? TEAL : '#ECE7DD',
                background: categoryFilter === 'All' && senFilter === 'All' ? '#e0f5f6' : 'white',
                color: categoryFilter === 'All' && senFilter === 'All' ? TEAL : '#4A4A4A',
              }}
            >
              All SEND Products
            </button>
            {SEND_CATEGORY_CARDS.map(card => (
              <button
                key={card.category}
                onClick={() => { setCategoryFilter(card.category); setSenFilter('All'); }}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                style={{
                  borderColor: categoryFilter === card.category ? TEAL : '#ECE7DD',
                  background: categoryFilter === card.category ? '#e0f5f6' : 'white',
                  color: categoryFilter === card.category ? TEAL : '#4A4A4A',
                }}
              >
                {card.label}
              </button>
            ))}
          </div>

          {/* SEN category chips */}
          {allSenCategories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              <span className="text-xs font-semibold self-center" style={{ color: '#9ca3af' }}>SEN type:</span>
              <button
                onClick={() => setSenFilter('All')}
                className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={{
                  borderColor: senFilter === 'All' ? TEAL : '#ECE7DD',
                  background: senFilter === 'All' ? '#e0f5f6' : 'white',
                  color: senFilter === 'All' ? TEAL : '#4A4A4A',
                }}
              >
                All
              </button>
              {allSenCategories.map(s => (
                <button
                  key={s}
                  onClick={() => setSenFilter(s)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                  style={{
                    borderColor: senFilter === s ? TEAL : '#ECE7DD',
                    background: senFilter === s ? '#e0f5f6' : 'white',
                    color: senFilter === s ? TEAL : '#4A4A4A',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-sm py-8 text-center" style={{ color: '#9ca3af' }}>No products match this filter.</p>
          )}
        </div>
      </div>

      {/* GUIDANCE */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>Guidance</SectionLabel>
        <h2 className="font-display text-2xl mb-8" style={{ color: 'var(--text)' }}>
          Before You Buy SEND Equipment
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {GUIDANCE_CARDS.map(card => (
            <div
              key={card.title}
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <div className="text-2xl">{card.icon}</div>
              <h3 className="font-display text-base" style={{ color: 'var(--text)' }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BUNDLES FOR SEND */}
      {bundles.length > 0 && (
        <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>SEND bundles</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Ready-made SEND Equipment Sets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CTA */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <p className="font-display text-xl text-white mb-1">Need specialist SEND guidance?</p>
            <p className="text-sm" style={{ color: '#4A4A4A' }}>Ask the AI or explore our SEND resources.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/ai-equipment/schools" className="text-sm transition-colors hover:text-white" style={{ color: '#4A4A4A' }}>
              School Equipment →
            </Link>
            <Link to="/ai-training/send" className="text-sm transition-colors hover:text-white" style={{ color: '#4A4A4A' }}>
              SEND AI Training →
            </Link>
            <Link to="/prompts/senco" className="text-sm transition-colors hover:text-white" style={{ color: '#4A4A4A' }}>
              SENCO Prompts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
