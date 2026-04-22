import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { EQUIPMENT, type EquipmentProduct, type EquipmentCategory } from '../data/equipment';

const TEAL = '#00808a';

// ─── SEND-specific data ───────────────────────────────────────────────────────

const SEND_PRODUCTS = EQUIPMENT.filter(p => p.audience.includes('SEND'));

const SEN_CATEGORIES = [
  'All',
  'Dyslexia',
  'ADHD',
  'Autism',
  'Dyscalculia',
  'Complex Communication Needs',
  'Hearing Impairment',
  'Visual Impairment',
  'Physical Disability',
  'Sensory Processing',
  'Anxiety',
  'EAL',
];

const SEND_COLLECTIONS = [
  {
    title: 'AAC & Communication',
    desc: 'Augmentative and alternative communication devices and tools for non-verbal and emerging communicators.',
    category: 'AAC & Communication' as EquipmentCategory,
    icon: '🗣️',
    count: EQUIPMENT.filter(p => p.category === 'AAC & Communication').length,
  },
  {
    title: 'Sensory & Regulation',
    desc: 'Tools to support sensory processing, emotional regulation and self-calming.',
    category: 'Sensory & Regulation' as EquipmentCategory,
    icon: '🌀',
    count: EQUIPMENT.filter(p => p.category === 'Sensory & Regulation').length,
  },
  {
    title: 'Stationery & Literacy',
    desc: 'Adapted writing and reading tools for dyslexia, dyspraxia, and motor difficulties.',
    category: 'Stationery & Literacy' as EquipmentCategory,
    icon: '✏️',
    count: EQUIPMENT.filter(p => p.category === 'Stationery & Literacy').length,
  },
  {
    title: 'Audio & Hearing',
    desc: 'Hearing loops, listening systems and audio supports for hearing impairment.',
    category: 'Audio & Hearing' as EquipmentCategory,
    icon: '🎧',
    count: EQUIPMENT.filter(p => p.category === 'Audio & Hearing').length,
  },
  {
    title: 'Wearables & Safety',
    desc: 'GPS trackers, activity monitors and safety wearables for SEND pupils.',
    category: 'Wearables & Safety' as EquipmentCategory,
    icon: '⌚',
    count: EQUIPMENT.filter(p => p.category === 'Wearables & Safety').length,
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

function badgeStyle(badge: string): { bg: string; color: string } {
  switch (badge) {
    case 'SEND Friendly':    return { bg: '#e0f2fe', color: '#0369a1' };
    case 'UK Specialist':    return { bg: '#f0fdf4', color: '#15803d' };
    case 'Amazon Available': return { bg: '#fff7ed', color: '#c2410c' };
    case 'School Quote':     return { bg: '#f5f3ff', color: '#7c3aed' };
    case 'Research Based':   return { bg: '#fef9c3', color: '#854d0e' };
    default:                 return { bg: '#f3f4f6', color: '#6b7280' };
  }
}

function ProductCard({ product }: { product: EquipmentProduct }) {
  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>
            {product.category}
          </span>
          {product.badges.includes('SEND Friendly') && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              SEND Friendly
            </span>
          )}
        </div>
        <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>
          {product.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{product.brand}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>{product.desc}</p>
        <p className="text-xs italic mb-3" style={{ color: '#9ca3af' }}>Best for: {product.bestFor}</p>

        {product.senCategory.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.senCategory.map(s => (
              <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {product.badges.filter(b => b !== 'SEND Friendly').slice(0, 2).map(b => {
            const s = badgeStyle(b);
            return (
              <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                {b}
              </span>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
        <div>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{product.priceBand}</span>
          <span className="text-xs ml-2" style={{ color: '#9ca3af' }}>{product.supplierName}</span>
        </div>
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
  );
}

export default function EquipmentSEND() {
  const [senFilter, setSenFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let results = SEND_PRODUCTS;
    if (senFilter !== 'All')
      results = results.filter(p => p.senCategory.includes(senFilter));
    if (categoryFilter !== 'All')
      results = results.filter(p => p.category === categoryFilter);
    if (search.trim())
      results = results.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.bestFor.toLowerCase().includes(search.toLowerCase()) ||
        p.senCategory.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
    return results;
  }, [senFilter, categoryFilter, search]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="SEND Assistive Technology – Equipment for Special Educational Needs | GetPromptly"
        description="Independent reviews of SEND assistive technology for UK schools and families — AAC devices, sensory tools, hearing supports, literacy aids and more."
        keywords="SEND assistive technology UK, AAC devices schools, sensory tools SEND, dyslexia equipment, autism classroom tools, SEND equipment UK"
        path="/equipment/send"
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <div className="mb-4">
          <Link
            to="/equipment"
            className="text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: TEAL }}
          >
            ← Equipment Hub
          </Link>
        </div>
        <SectionLabel>SEND Assistive Tech</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          SEND<br />
          <span style={{ color: TEAL }}>Equipment.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl" style={{ color: '#6b6760' }}>
          {SEND_PRODUCTS.length} products independently assessed for special educational needs — from low-tech AAC to sensory regulation tools and hearing supports.
        </p>
      </div>

      {/* ── COLLECTIONS ──────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <FadeIn>
          <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--text)' }}>Browse by type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEND_COLLECTIONS.map((col, i) => (
              <FadeIn key={col.title} delay={i * 0.06}>
                <button
                  onClick={() => setCategoryFilter(col.category)}
                  className="w-full text-left rounded-2xl border p-5 transition-colors hover:border-[#00808a] group"
                  style={{
                    borderColor: categoryFilter === col.category ? TEAL : '#e8e6e0',
                    background: categoryFilter === col.category ? '#e0f5f6' : 'white',
                  }}
                >
                  <div className="text-2xl mb-2" aria-hidden="true">{col.icon}</div>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>{col.title}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b6760' }}>{col.desc}</p>
                  <span className="text-xs font-semibold" style={{ color: TEAL }}>{col.count} products →</span>
                </button>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── FILTER + GRID ─────────────────────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: '#e8e6e0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            All SEND products
          </h2>

          {/* Filters */}
          <div className="space-y-4 mb-8">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, need, or SEN category…"
              className="w-full pl-4 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)', maxWidth: 480 }}
            />

            <div className="flex flex-wrap gap-2">
              {SEN_CATEGORIES.map(s => (
                <button
                  key={s}
                  onClick={() => setSenFilter(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
                  style={{
                    background: senFilter === s ? TEAL : 'white',
                    color: senFilter === s ? 'white' : '#6b6760',
                    borderColor: senFilter === s ? TEAL : '#e8e6e0',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-sm" style={{ color: '#9ca3af' }}>
              Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> SEND products
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>No products found</p>
              <button
                onClick={() => { setSenFilter('All'); setCategoryFilter('All'); setSearch(''); }}
                className="text-sm font-semibold"
                style={{ color: TEAL }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── GUIDANCE BLOCK ────────────────────────────────────────────────────── */}
      <div style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Choosing SEND equipment
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Involve the SENCO and OT early',
                  body: 'For AAC, sensory tools and specialist equipment, always consult your SENCO and occupational therapist before purchasing. Equipment must match the individual\'s specific needs — what works for one pupil may not suit another.',
                },
                {
                  title: 'Trial before committing to high-cost items',
                  body: 'Many UK SEND suppliers (TTS, Inclusive Technology, Rompa) offer trial or loan schemes. For items over £150, always request a trial or demonstration period before full procurement.',
                },
                {
                  title: 'Check EHCP funding eligibility',
                  body: 'Some equipment — particularly AAC devices and specialist computing tools — may be fundable through an Education, Health and Care Plan. Speak to your local SEND team or IPSEA for guidance on what costs can be covered.',
                },
                {
                  title: 'UK GDPR applies to connected devices',
                  body: 'GPS trackers, smart watches and any connected device collecting data about children falls under UK GDPR. Confirm data processing agreements with suppliers before deploying in school.',
                },
              ].map(item => (
                <div key={item.title} className="p-5 rounded-xl border" style={{ borderColor: '#e8e6e0' }}>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
            Need a recommendation?
          </p>
          <h2 className="font-display text-2xl sm:text-3xl mb-3" style={{ color: 'white' }}>
            Ask the Promptly AI
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
            Describe the pupil's needs, budget and setting — the AI will suggest specific products from our database.
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
              Get a personalised recommendation →
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
