import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  type EquipmentProduct,
  type EqBadge,
} from '../data/equipment';
import { badgeStyle, reviewBadge } from './AIEquipment';

const TEAL = '#00808a';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

function ProductCard({ product }: { product: EquipmentProduct }) {
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
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-opacity hover:opacity-80"
          style={{ background: TEAL, color: 'white' }}
        >
          View →
        </a>
      </div>
    </div>
  );
}

export default function AIEquipmentStudents() {
  const topPicks = useMemo(() => {
    const featured = EQUIPMENT.filter(p => p.featured && p.audience.includes('Students'));
    const rest = EQUIPMENT.filter(p => !p.featured && p.audience.includes('Students'));
    return [...featured, ...rest];
  }, []);

  const devices = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Devices' && p.audience.includes('Students')),
    []
  );

  const stationery = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Stationery & Literacy' && p.audience.includes('Students')),
    []
  );

  const audio = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Audio & Hearing' && p.audience.includes('Students')),
    []
  );

  const budgetPicks = useMemo(() =>
    EQUIPMENT.filter(p => p.priceBand === 'Under £50' && p.audience.includes('Students')).slice(0, 6),
    []
  );

  const gcseALevel = useMemo(() =>
    EQUIPMENT.filter(p =>
      p.audience.includes('Students') &&
      (p.educationLevel.some(l => ['GCSE', 'A-Level', 'Secondary', 'Post-16'].includes(l)))
    ).slice(0, 6),
    []
  );

  const furniture = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Furniture & Environment' && p.audience.includes('Students')),
    []
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Student Equipment — Laptops, Tablets & Study Tools | GetPromptly"
        description="Laptops, tablets, reading pens, noise-cancelling headphones and study accessories for UK students."
        keywords="student equipment UK, laptops for students, tablets GCSE, reading pens students, study accessories"
        path="/ai-equipment/students"
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>For Students</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Study Better with<br />
          <span style={{ color: TEAL }}>the Right Equipment</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-6" style={{ color: '#6b6760' }}>
          Laptops, tablets, reading pens, noise-cancelling headphones and study accessories for UK students.
        </p>
      </div>

      {/* TOP PICKS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <SectionLabel>Top picks</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          Best Equipment for Students
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topPicks.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {topPicks.length === 0 && (
          <p className="text-sm" style={{ color: '#9ca3af' }}>No products found.</p>
        )}
      </div>

      {/* BY CATEGORY */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#e8e6e0', background: 'white' }}>
        <div className="max-w-6xl mx-auto space-y-12">
          {devices.length > 0 && (
            <div>
              <SectionLabel>Devices</SectionLabel>
              <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
                Laptops &amp; Tablets
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {devices.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {stationery.length > 0 && (
            <div>
              <SectionLabel>Stationery &amp; Literacy</SectionLabel>
              <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
                Reading Pens &amp; Literacy Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stationery.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {audio.length > 0 && (
            <div>
              <SectionLabel>Audio &amp; Hearing</SectionLabel>
              <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
                Headphones &amp; Audio Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {audio.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BUDGET PICKS */}
      {budgetPicks.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <SectionLabel>Budget picks</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Under £50
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgetPicks.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* GCSE / A-LEVEL */}
      {gcseALevel.length > 0 && (
        <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#e8e6e0', background: 'white' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>GCSE &amp; A-Level</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Study Gear for Older Students
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gcseALevel.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* STUDY ENVIRONMENT */}
      {furniture.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <SectionLabel>Study environment</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Furniture &amp; Study Spaces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {furniture.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* BOTTOM CTA */}
      <div
        className="border-t px-5 sm:px-8 py-4"
        style={{ background: AMBER_BG, borderColor: AMBER_BORDER }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <p className="text-sm font-semibold" style={{ color: AMBER_TEXT }}>
            Want AI study tips or prompts for students? Explore our student resources.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ai-training/students"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-amber-50"
              style={{ borderColor: AMBER_BORDER, color: AMBER_TEXT }}
            >
              AI Training for Students
            </Link>
            <Link
              to="/prompts/students"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-amber-50"
              style={{ borderColor: AMBER_BORDER, color: AMBER_TEXT }}
            >
              Student Prompts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
