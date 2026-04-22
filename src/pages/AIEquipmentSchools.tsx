import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  type EquipmentProduct,
  type EquipmentCategory,
  type PurchaseModel,
} from '../data/equipment';
import { badgeStyle, reviewBadge } from './AIEquipment';

const TEAL = '#00808a';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

const ROLE_CARDS = [
  {
    title: 'Senior Leadership Team',
    desc: 'Strategy, budget, compliance and digital vision for the whole school.',
    icon: '👔',
  },
  {
    title: 'IT / Digital Lead',
    desc: 'Devices, infrastructure, fleet management and procurement frameworks.',
    icon: '💻',
  },
  {
    title: 'SENCO',
    desc: 'SEND equipment, AAC devices, sensory tools and assistive technology.',
    icon: '♿',
  },
  {
    title: 'Business Manager',
    desc: 'Quotes, invoicing, procurement frameworks and VAT exemption.',
    icon: '📊',
  },
  {
    title: 'Classroom Teacher',
    desc: 'Classroom tools, quick wins, coding robots and display technology.',
    icon: '📚',
  },
];

const BUYING_CATEGORIES: { label: string; category: EquipmentCategory | EquipmentCategory[]; desc: string }[] = [
  { label: 'Interactive Displays & Screens', category: 'Screens & Classroom Hardware',   desc: 'Smart boards, visualisers and AV' },
  { label: 'Devices & Class Packs',          category: 'Devices',                        desc: 'Tablets, laptops and Chromebooks' },
  { label: 'Coding & Robotics',              category: 'Robots & Coding',                desc: 'Programming tools for all ages' },
  { label: 'Audio & Hearing Support',        category: 'Audio & Hearing',                desc: 'Hearing loops, FM systems, speakers' },
  { label: 'Sensory Rooms',                  category: ['Sensory & Regulation', 'Furniture & Environment'], desc: 'Sensory equipment and environments' },
  { label: 'SEND & Assistive Tech',          category: 'AAC & Communication',            desc: 'AAC devices and assistive technology' },
];

const PROCUREMENT_STEPS = [
  { num: '01', label: 'Define the need',             desc: 'Document the specific need or gap, involve relevant staff.' },
  { num: '02', label: 'Check supplier frameworks',   desc: 'Use Crown Commercial Service or local authority frameworks.' },
  { num: '03', label: 'Request school quote',         desc: 'Request formal quotes — get 3 quotes for larger spends.' },
  { num: '04', label: 'Check VAT exemption',         desc: 'Some SEND equipment qualifies for zero-rated VAT.' },
  { num: '05', label: 'Trial before rollout',        desc: 'Run a pilot with a small group before full purchase.' },
  { num: '06', label: 'Data protection check',       desc: 'Review GDPR implications for any connected device.' },
];

const PURCHASE_MODEL_OPTIONS: { value: PurchaseModel | 'All'; label: string }[] = [
  { value: 'All',          label: 'All' },
  { value: 'Buy',          label: 'Direct Buy' },
  { value: 'Quote',        label: 'Quote Required' },
  { value: 'Subscription', label: 'Subscription' },
  { value: 'Lease',        label: 'Lease' },
];

function SchoolProductRow({ product }: { product: EquipmentProduct }) {
  const rb = reviewBadge(product.reviewStatus);
  return (
    <tr style={{ borderTop: '1px solid #f3f4f6' }}>
      <td className="px-4 py-3">
        <Link
          to={`/ai-equipment/product/${product.slug}`}
          className="font-medium hover:underline text-sm"
          style={{ color: 'var(--text)' }}
        >
          {product.name}
        </Link>
        <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{product.brand}</div>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: '#6b6760' }}>{product.category}</td>
      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{product.priceBand}</td>
      <td className="px-4 py-3 text-xs" style={{ color: '#6b6760' }}>{product.purchaseModel}</td>
      <td className="px-4 py-3 text-xs" style={{ color: '#6b6760' }}>{product.supplierName}</td>
      <td className="px-4 py-3">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rb.bg, color: rb.color }}>
          {rb.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-opacity hover:opacity-80"
          style={{ background: TEAL, color: 'white' }}
        >
          View →
        </a>
      </td>
    </tr>
  );
}

export default function AIEquipmentSchools() {
  const [purchaseFilter, setPurchaseFilter] = useState<PurchaseModel | 'All'>('All');

  const schoolProducts = useMemo(() =>
    EQUIPMENT.filter(p => p.audience.includes('Schools')),
    []
  );

  const filteredProducts = useMemo(() => {
    if (purchaseFilter === 'All') return schoolProducts;
    return schoolProducts.filter(p => p.purchaseModel === purchaseFilter);
  }, [schoolProducts, purchaseFilter]);

  function getCatCount(cat: EquipmentCategory | EquipmentCategory[]) {
    if (Array.isArray(cat)) {
      return EQUIPMENT.filter(p => cat.includes(p.category) && p.audience.includes('Schools')).length;
    }
    return EQUIPMENT.filter(p => p.category === cat && p.audience.includes('Schools')).length;
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="School Equipment Procurement — UK Education | GetPromptly"
        description="Procurement support, class packs, interactive displays, AV, hearing loops and SEND provision for UK schools — all in one place."
        keywords="school equipment procurement UK, interactive displays schools, school buying guide, education procurement"
        path="/ai-equipment/schools"
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>For Schools</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Equipment Solutions<br />
          <span style={{ color: TEAL }}>for UK Schools</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-6" style={{ color: '#6b6760' }}>
          Procurement support, class packs, interactive displays, AV, hearing loops and SEND provision — all in one place.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const widget = document.getElementById('promptly-widget-trigger');
              if (widget) (widget as HTMLButtonElement).click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            Request a School Quote
          </button>
          <Link
            to="/ai-equipment/compare"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e8e6e0', color: 'var(--text)' }}
          >
            Compare Products
          </Link>
        </div>
      </div>

      {/* ROLE CARDS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <SectionLabel>Browse by role</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          Who's buying?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROLE_CARDS.map(role => (
            <div
              key={role.title}
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <div className="text-2xl">{role.icon}</div>
              <h3 className="font-display text-lg" style={{ color: 'var(--text)' }}>{role.title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: '#6b6760' }}>{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BUYING CATEGORIES */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>School buying categories</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            What are you buying?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUYING_CATEGORIES.map(cat => {
              const count = getCatCount(cat.category);
              const catSlug = Array.isArray(cat.category)
                ? 'sensory-regulation'
                : cat.category === 'Screens & Classroom Hardware'
                  ? 'screens-hardware'
                  : cat.category === 'Devices'
                    ? 'devices'
                    : cat.category === 'Robots & Coding'
                      ? 'robots-coding'
                      : cat.category === 'Audio & Hearing'
                        ? 'audio-hearing'
                        : 'aac-communication';
              return (
                <Link
                  key={cat.label}
                  to={`/ai-equipment/category/${catSlug}`}
                  className="rounded-xl border p-5 flex flex-col gap-2 transition-shadow hover:shadow-md"
                  style={{ borderColor: '#e8e6e0', background: 'var(--bg)' }}
                >
                  <h3 className="font-display text-base" style={{ color: 'var(--text)' }}>{cat.label}</h3>
                  <p className="text-xs flex-1" style={{ color: '#6b6760' }}>{cat.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{count} products</span>
                    <span className="text-xs font-semibold" style={{ color: TEAL }}>Browse →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUOTE / PROCUREMENT PATHS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>How to buy</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          Procurement Paths
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              badge: 'Amazon Available',
              title: 'Amazon / Retail',
              desc: 'Immediate purchase — ideal for low-cost items and urgency buys.',
              bg: '#fff7ed', color: '#c2410c',
            },
            {
              badge: 'School Quote',
              title: 'School Resellers',
              desc: 'Education framework pricing, school invoicing and VAT handling.',
              bg: '#f5f3ff', color: '#7c3aed',
            },
            {
              badge: 'UK Specialist',
              title: 'UK Specialists',
              desc: 'Direct from UK specialists — demos, trial units and support included.',
              bg: '#f0fdf4', color: '#15803d',
            },
            {
              badge: null,
              title: 'Request a Quote',
              desc: 'Tell us what you need — the Promptly AI will help you find the right supplier.',
              bg: AMBER_BG, color: AMBER_TEXT,
            },
          ].map(item => (
            <div
              key={item.title}
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              {item.badge && (
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full self-start"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.badge}
                </span>
              )}
              <h3 className="font-display text-base" style={{ color: 'var(--text)' }}>{item.title}</h3>
              <p className="text-sm flex-1 leading-relaxed" style={{ color: '#6b6760' }}>{item.desc}</p>
              {!item.badge && (
                <button
                  onClick={() => {
                    const widget = document.getElementById('promptly-widget-trigger');
                    if (widget) (widget as HTMLButtonElement).click();
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Get a Quote →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PROCUREMENT CHECKLIST */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Procurement checklist</SectionLabel>
          <h2 className="font-display text-2xl mb-8" style={{ color: 'var(--text)' }}>
            6 Steps to Smarter School Procurement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCUREMENT_STEPS.map(step => (
              <div
                key={step.num}
                className="rounded-xl border p-5 flex flex-col gap-3"
                style={{ borderColor: '#e8e6e0', background: 'var(--bg)' }}
              >
                <div className="font-display text-3xl" style={{ color: '#e8e6e0' }}>{step.num}</div>
                <h3 className="font-display text-base" style={{ color: 'var(--text)' }}>{step.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS FOR SCHOOLS TABLE */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>All school products</SectionLabel>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>
            Products for Schools ({filteredProducts.length})
          </h2>
        </div>

        {/* Purchase model filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {PURCHASE_MODEL_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPurchaseFilter(opt.value)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                borderColor: purchaseFilter === opt.value ? TEAL : '#e8e6e0',
                background: purchaseFilter === opt.value ? '#e0f5f6' : 'white',
                color: purchaseFilter === opt.value ? TEAL : '#6b6760',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: '#e8e6e0' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f6f2' }}>
                {['Product', 'Category', 'Price', 'Purchase Model', 'Supplier', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#c5c2bb' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <SchoolProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: '#9ca3af' }}>No products match this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <p className="font-display text-xl text-white mb-1">Need procurement support?</p>
            <p className="text-sm" style={{ color: '#6b6760' }}>Ask the AI or explore SEND-specific equipment.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/ai-equipment/send" className="text-sm transition-colors hover:text-white" style={{ color: '#6b6760' }}>
              SEND Equipment →
            </Link>
            <Link to="/prompts/school-leaders" className="text-sm transition-colors hover:text-white" style={{ color: '#6b6760' }}>
              School Leader Prompts →
            </Link>
            <Link to="/ai-training/leaders" className="text-sm transition-colors hover:text-white" style={{ color: '#6b6760' }}>
              AI Training for Leaders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
