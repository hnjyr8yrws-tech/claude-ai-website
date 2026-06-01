/**
 * AIEquipment.tsx — /ai-equipment (Equipment directory)
 *
 * Rebuilt to the brand directory spec: dark hero with a Luna equipment-guide
 * panel, a stat strip anchored by pillar colours, the shared sticky role filter
 * (+ category chips), and flat product tiles each flagged with a primary pillar.
 *
 * Pillar colours here do structural work (§03): each equipment category maps to
 * one of the five pillars, so the colour tells you what the category is *about*.
 * Brand (CLAUDE.md): no gradients; Fraunces / Satoshi / JetBrains Mono only.
 */

import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { EQUIPMENT, type EquipmentProduct, type EquipmentCategory } from '../data/equipment';
import { getRole, setRole, ROLE_CHANGED } from '../utils/role';

const LIME = 'var(--color-promptly-lime)';
const INK  = '#1E1E1E';
const FOG  = 'var(--color-fog)';
const RULE = 'var(--color-rule)';

// ── Pillar colours (the five reserved §09 tokens) ───────────────────────────────
const PILLAR = {
  privacy:       { name: 'Data Privacy',    colour: 'var(--color-pillar-privacy)' },
  safeguarding:  { name: 'Safeguarding',    colour: 'var(--color-pillar-safeguarding)' },
  age:           { name: 'Age Suitability', colour: 'var(--color-pillar-age)' },
  transparency:  { name: 'Transparency',    colour: 'var(--color-pillar-transparency)' },
  accessibility: { name: 'Accessibility',   colour: 'var(--color-pillar-accessibility)' },
} as const;

// Each equipment category carries a pillar — its structural meaning.
const CATEGORY_PILLAR: Record<EquipmentCategory, keyof typeof PILLAR> = {
  'AAC & Communication':          'accessibility',
  'Sensory & Regulation':         'accessibility',
  'Audio & Hearing':              'accessibility',
  'Screens & Classroom Hardware': 'safeguarding',
  'Robots & Coding':              'safeguarding',
  'Games & Cognitive':            'age',
  'Stationery & Literacy':        'age',
  'Devices':                      'privacy',
  'Furniture & Environment':      'transparency',
  'Wearables & Safety':           'privacy',
};

/** The product's primary pillar — SEND audience always reads as Accessibility. */
function primaryPillar(p: EquipmentProduct): { name: string; colour: string } {
  if (p.audience.includes('SEND')) return PILLAR.accessibility;
  return PILLAR[CATEGORY_PILLAR[p.category]];
}

// ── Category chip groups → the data's 10 categories ─────────────────────────────
interface CategoryGroup { label: string; pillar: keyof typeof PILLAR; cats: EquipmentCategory[] }
const CATEGORY_GROUPS: CategoryGroup[] = [
  { label: 'SEND & AAC',            pillar: 'accessibility', cats: ['AAC & Communication', 'Sensory & Regulation', 'Audio & Hearing'] },
  { label: 'Classroom Tech',        pillar: 'safeguarding',  cats: ['Screens & Classroom Hardware', 'Robots & Coding', 'Devices'] },
  { label: 'Home Learning',         pillar: 'age',           cats: ['Games & Cognitive', 'Stationery & Literacy'] },
  { label: 'School Infrastructure', pillar: 'transparency',  cats: ['Furniture & Environment', 'Wearables & Safety'] },
];

// ── Role filter (slugs match utils/role) ────────────────────────────────────────
const ROLE_FILTERS: { slug: string; label: string; audience?: string }[] = [
  { slug: '',              label: 'All' },
  { slug: 'teacher',       label: 'Teacher',       audience: 'Teachers' },
  { slug: 'senco',         label: 'SENCO',         audience: 'SEND' },
  { slug: 'school-leader', label: 'School Leader', audience: 'Schools' },
  { slug: 'parent',        label: 'Parent',        audience: 'Parents' },
  { slug: 'student',       label: 'Student',       audience: 'Students' },
];

function openLuna(prompt?: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  if (prompt) setTimeout(() => window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt })), 120);
}

// ── Equipment tile ──────────────────────────────────────────────────────────────
function EquipmentTile({ product }: { product: EquipmentProduct }) {
  const pillar = primaryPillar(product);
  const quote = product.purchaseModel === 'Quote' || product.badges.includes('School Quote');

  return (
    <div className="flex items-start gap-5 p-5" style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}>
      {/* Left — image placeholder (data has no images): pillar-coloured monogram */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: 72, height: 72, borderRadius: 4, background: 'var(--color-oat)', border: `1px solid ${RULE}` }}
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full" style={{ background: pillar.colour }} />
      </div>

      {/* Centre */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: INK }}>
            {product.name}
          </h3>
          {/* Primary pillar badge top-right */}
          <span className="font-mono inline-flex items-center gap-1.5 uppercase flex-shrink-0 mt-1" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#6b6760' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pillar.colour }} aria-hidden="true" />
            {pillar.name}
          </span>
        </div>

        {/* One-line verdict */}
        <p className="font-sans italic mt-1.5" style={{ fontSize: 14, lineHeight: 1.5, color: FOG }}>
          {product.bestFor || product.desc}
        </p>

        {/* Price + school-quote note */}
        <p className="font-sans mt-2" style={{ fontSize: 12, color: '#6b6760' }}>
          {product.priceBand}
          {quote && <span style={{ color: FOG }}> · School quote available</span>}
        </p>

        {/* See product link */}
        <Link
          to={`/ai-equipment/product/${product.slug}`}
          onClick={() => track({ name: 'cta_clicked', section: 'equipment-directory', label: `See product: ${product.name}` })}
          className="font-sans inline-block mt-3 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] rounded"
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-accent)' }}
        >
          See product &rarr;
        </Link>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function AIEquipment() {
  const [roleSlug, setRoleSlug] = useState<string>(() => getRole());
  const [group, setGroup] = useState<string>('All'); // category-group label
  const [search, setSearch] = useState('');

  useEffect(() => {
    const sync = (e: Event) => setRoleSlug((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, sync);
    return () => window.removeEventListener(ROLE_CHANGED, sync);
  }, []);

  const activeRole = ROLE_FILTERS.find(r => r.slug === roleSlug) ?? ROLE_FILTERS[0];

  // Live stats (kept accurate from the data, anchored by pillar colours).
  const stats = useMemo(() => [
    { value: EQUIPMENT.length,                                          label: 'Products Reviewed', dot: undefined },
    { value: EQUIPMENT.filter(p => p.audience.includes('SEND')).length, label: 'SEND Friendly',      dot: PILLAR.accessibility.colour },
    { value: EQUIPMENT.filter(p => p.audience.includes('Schools')).length, label: 'School Ready',     dot: PILLAR.safeguarding.colour },
    { value: EQUIPMENT.filter(p => p.ukFocus).length,                   label: 'UK Education Focused', dot: PILLAR.privacy.colour },
    { value: EQUIPMENT.filter(p => p.supplierType === 'UK Specialist').length, label: 'UK Specialists', dot: PILLAR.transparency.colour },
  ], []);

  const filtered = useMemo(() => {
    let r = EQUIPMENT;
    if (activeRole.audience) r = r.filter(p => p.audience.includes(activeRole.audience as EquipmentProduct['audience'][number]));
    if (group !== 'All') {
      const g = CATEGORY_GROUPS.find(x => x.label === group);
      if (g) r = r.filter(p => g.cats.includes(p.category));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p =>
        [p.name, p.brand, p.bestFor, p.desc, p.category, p.subcategory, ...(p.senCategory ?? [])].join(' ').toLowerCase().includes(q),
      );
    }
    return r;
  }, [activeRole, group, search]);

  const chooseRole = (slug: string) => {
    setRoleSlug(slug);
    setRole(slug);
    track({ name: 'tool_filter_used', filterType: 'role', value: slug || 'All', pageType: 'equipment' });
  };

  const TRY_ASKING = [
    "What's the best visualiser for a primary classroom?",
    'What SEND equipment helps with AAC communication?',
    'Help me build a home learning setup for £300',
  ];

  return (
    <div style={{ background: 'var(--color-oat)', minHeight: '100vh' }}>
      <SEO
        title="AI Equipment for UK Education — 96 Products Reviewed | GetPromptly"
        description="96 products reviewed for UK classrooms, SEND settings and home learning — classroom tech, assistive technology and school infrastructure."
        keywords="AI equipment UK education, classroom technology, SEND assistive tech, AAC communication, school equipment, educational devices UK"
        path="/ai-equipment"
      />

      {/* ── 1. HERO (dark) ─────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-ground-black)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-12">
          <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: FOG }}>AI EQUIPMENT</p>
          <h1 className="font-display mt-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', fontWeight: 400, color: '#FFFFFF' }}>
            The right kit. Reviewed honestly.
          </h1>
          <p className="font-sans mt-4 max-w-xl" style={{ fontSize: 16, lineHeight: 1.6, color: FOG }}>
            {EQUIPMENT.length} products reviewed for UK classrooms, SEND settings and home learning.
          </p>

          {/* Luna panel — same dark card pattern as the Training page */}
          <div className="mt-8 rounded-2xl p-6 sm:p-7" style={{ background: '#2A2A2A' }}>
            <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: LIME }}>LUNA · EQUIPMENT GUIDE</p>
            <p className="font-display mt-2" style={{ fontSize: 22, color: '#FFFFFF' }}>
              Tell Luna the need — get the right kit and how to buy it.
            </p>

            <LunaInput />

            <p className="font-mono mt-5 mb-2.5" style={{ fontSize: 10, letterSpacing: '0.1em', color: FOG }}>TRY ASKING</p>
            <div className="flex flex-wrap gap-2">
              {TRY_ASKING.map(q => (
                <button
                  key={q}
                  onClick={() => { openLuna(q); track({ name: 'agent_contextual_prompt_clicked', prompt: q, section: 'equipment' }); }}
                  className="font-sans text-left rounded-xl px-3 py-2 border transition-colors hover:border-[var(--color-promptly-lime)]"
                  style={{ fontSize: 12, color: '#d1cec8', background: 'transparent', borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <p className="font-mono mt-8" style={{ fontSize: 10, letterSpacing: '0.1em', color: FOG }}>
            METHODOLOGY V2.1 · VERIFIED MAY 2026 · REVIEWER GP
          </p>
        </div>
      </section>

      {/* ── 2. STAT STRIP (oat, pillar-anchored) ───────────────────────────────── */}
      <div style={{ background: 'var(--color-oat)', borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map(s => (
            <div key={s.label}>
              <p className="font-display" style={{ fontSize: 32, fontWeight: 700, color: INK }}>{s.value}</p>
              <p className="font-sans flex items-center gap-1.5 mt-0.5" style={{ fontSize: 12, color: FOG }}>
                {s.dot && <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: s.dot }} aria-hidden="true" />}
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. ROLE + CATEGORY FILTER (sticky oat) ─────────────────────────────── */}
      <div className="sticky top-16 z-20" style={{ background: 'var(--color-oat)', borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-col gap-3">

          {/* Role filter */}
          <div className="flex flex-wrap items-center gap-2">
            {ROLE_FILTERS.map(r => {
              const active = roleSlug === r.slug;
              return (
                <button
                  key={r.label}
                  onClick={() => chooseRole(r.slug)}
                  aria-pressed={active}
                  className="font-sans rounded-full px-3.5 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={active
                    ? { fontSize: 12, fontWeight: 500, background: INK, color: LIME, borderColor: INK }
                    : { fontSize: 12, fontWeight: 500, background: 'white', color: INK, borderColor: RULE }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Category chips (pillar-coloured dots) + search */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {[{ label: 'All', colour: FOG }, ...CATEGORY_GROUPS.map(g => ({ label: g.label, colour: PILLAR[g.pillar].colour }))].map(c => {
                const active = group === c.label;
                return (
                  <button
                    key={c.label}
                    onClick={() => { setGroup(c.label); track({ name: 'tool_filter_used', filterType: 'category', value: c.label, pageType: 'equipment' }); }}
                    aria-pressed={active}
                    className="font-sans inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                    style={active
                      ? { fontSize: 12, fontWeight: 500, background: INK, color: '#FFFFFF', borderColor: INK }
                      : { fontSize: 12, fontWeight: 500, background: 'white', color: INK, borderColor: RULE }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.colour }} aria-hidden="true" />
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="relative lg:w-64 flex-shrink-0">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: 'var(--color-ink-accent)' }} aria-hidden="true">🔍</span>
              <input
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); if (e.target.value.length > 2) track({ name: 'search_performed', section: 'equipment', query: e.target.value }); }}
                placeholder={`Search ${EQUIPMENT.length} products...`}
                aria-label="Search equipment"
                className="font-sans w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                style={{ fontSize: 14, background: 'white', color: INK, borderColor: RULE }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. TILES ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <p className="font-sans mb-5" style={{ fontSize: 13, color: '#6b6760' }}>
          Showing <strong style={{ color: INK }}>{filtered.length}</strong> of {EQUIPMENT.length} products
        </p>

        {filtered.length === 0 ? (
          <div className="p-10 text-center" style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}>
            <p className="font-display" style={{ fontSize: 20, color: INK }}>No products match those filters.</p>
            <p className="font-sans mt-2" style={{ fontSize: 14, color: FOG }}>Clear a filter, or ask Luna in the hero above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(p => <EquipmentTile key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hero Luna input (kept local so the page stays self-contained) ───────────────
function LunaInput() {
  const [draft, setDraft] = useState('');
  const send = () => { openLuna(draft.trim() || undefined); track({ name: 'agent_opened', section: 'equipment-hero' }); };
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
      <input
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') send(); }}
        placeholder="Describe the learner need and your budget…"
        aria-label="Ask Luna about equipment"
        className="font-sans flex-1 rounded-xl px-4 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
        style={{ fontSize: 14, background: 'var(--color-ground-black)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.18)' }}
      />
      <button
        onClick={send}
        className="font-sans flex-shrink-0 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2A2A]"
        style={{ fontSize: 14, fontWeight: 500, background: LIME, color: '#1A1A0E' }}
      >
        Ask Luna &rarr;
      </button>
    </div>
  );
}
