import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  EQUIPMENT,
  BUNDLES,
  type EquipmentProduct,
  type EquipmentBundle,
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

export default function AIEquipmentTeachers() {
  const quickWins = useMemo(() =>
    EQUIPMENT.filter(p => p.featured && p.audience.includes('Teachers')).slice(0, 4),
    []
  );

  const interactiveDisplays = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Screens & Classroom Hardware').slice(0, 6),
    []
  );

  const codingRobotics = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Robots & Coding'),
    []
  );

  const studyDevices = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Devices' && p.audience.includes('Teachers')),
    []
  );

  const stationeryLiteracy = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Stationery & Literacy'),
    []
  );

  const bundles = useMemo(() =>
    BUNDLES.filter(b => b.audience.includes('Schools') || b.audience.includes('Teachers')),
    []
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Classroom Technology for Teachers — Equipment Hub | GetPromptly"
        description="From interactive displays and visualisers to coding robots and study tablets — find the right tools for your classroom."
        keywords="classroom technology teachers UK, interactive displays schools, coding robots primary, teacher equipment"
        path="/ai-equipment/teachers"
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>For Teachers</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Classroom Technology<br />
          <span style={{ color: TEAL }}>for Teachers</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-6" style={{ color: '#4A4A4A' }}>
          From interactive displays and visualisers to coding robots and study tablets — find the right tools for your classroom.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/ai-equipment/compare"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#ECE7DD', color: 'var(--text)' }}
          >
            Compare Products
          </Link>
        </div>
      </div>

      {/* QUICK WINS */}
      {quickWins.length > 0 && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
          <SectionLabel>Quick wins</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Featured for Teachers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickWins.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* INTERACTIVE DISPLAYS */}
      <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Interactive displays</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Screens &amp; Classroom Hardware
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {interactiveDisplays.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {interactiveDisplays.length === 0 && (
            <p className="text-sm" style={{ color: '#9ca3af' }}>No products found in this category.</p>
          )}
        </div>
      </div>

      {/* CODING & ROBOTICS */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>Coding &amp; robotics</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          Coding Robots &amp; Programming Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {codingRobotics.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {codingRobotics.length === 0 && (
          <p className="text-sm" style={{ color: '#9ca3af' }}>No products found in this category.</p>
        )}
      </div>

      {/* STUDY DEVICES */}
      {studyDevices.length > 0 && (
        <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Study devices</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Tablets &amp; Laptops for Classrooms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {studyDevices.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* STATIONERY & LITERACY */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <SectionLabel>Stationery &amp; literacy</SectionLabel>
        <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
          Literacy Tools &amp; Stationery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stationeryLiteracy.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        {stationeryLiteracy.length === 0 && (
          <p className="text-sm" style={{ color: '#9ca3af' }}>No products found in this category.</p>
        )}
      </div>

      {/* BUNDLES */}
      {bundles.length > 0 && (
        <div className="border-t py-14 px-5 sm:px-8" style={{ borderColor: '#ECE7DD', background: 'white' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Recommended bundles</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Ready-made Sets for Schools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
            </div>
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
            Need help choosing the right classroom tech? Ask the AI →
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
              to="/prompts/teachers"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-amber-50"
              style={{ borderColor: AMBER_BORDER, color: AMBER_TEXT }}
            >
              Teacher Prompts
            </Link>
            <Link
              to="/ai-training/teachers"
              className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border transition-colors hover:bg-amber-50"
              style={{ borderColor: AMBER_BORDER, color: AMBER_TEXT }}
            >
              AI Training
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
