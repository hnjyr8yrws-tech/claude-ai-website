/**
 * AIEquipment.tsx — /ai-equipment (Equipment directory)
 *
 * A professional school buying guide, NOT a scored leaderboard. Equipment is not
 * numerically scored — suitability depends on learner need, setting, budget and
 * use. Users search by the problem they need to solve, filter by buying intent
 * (audience / product type / budget / setting), then ask Luna whether a product
 * fits their context.
 *
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

// ── Product types (buying intent) → the data's categories ───────────────────────
interface ProductType { label: string; colour: string; cats: EquipmentCategory[] }
const PRODUCT_TYPES: ProductType[] = [
  { label: 'SEND & AAC',           colour: 'var(--color-pillar-accessibility)', cats: ['AAC & Communication', 'Audio & Hearing'] },
  { label: 'Sensory Equipment',    colour: 'var(--color-pillar-safeguarding)',  cats: ['Sensory & Regulation'] },
  { label: 'Classroom Tech',       colour: 'var(--color-pillar-privacy)',       cats: ['Screens & Classroom Hardware', 'Robots & Coding', 'Devices'] },
  { label: 'Home Learning',        colour: 'var(--color-pillar-age)',           cats: ['Games & Cognitive', 'Stationery & Literacy'] },
  { label: 'Furniture',            colour: 'var(--color-pillar-transparency)',  cats: ['Furniture & Environment'] },
  { label: 'School Infrastructure', colour: '#6b6760',                          cats: ['Wearables & Safety'] },
];
function typeOf(cat: EquipmentCategory): ProductType {
  return PRODUCT_TYPES.find(t => t.cats.includes(cat)) ?? PRODUCT_TYPES[0];
}

// ── Audience filter (slugs match utils/role) ────────────────────────────────────
const ROLE_FILTERS: { slug: string; label: string; audience?: string }[] = [
  { slug: '',              label: 'All' },
  { slug: 'teacher',       label: 'Teacher',       audience: 'Teachers' },
  { slug: 'senco',         label: 'SENCO',         audience: 'SEND' },
  { slug: 'school-leader', label: 'School Leader', audience: 'Schools' },
  { slug: 'parent',        label: 'Parent',        audience: 'Parents' },
  { slug: 'student',       label: 'Student',       audience: 'Students' },
];

// ── Budget filter (mapped to the data's real price bands + quote) ───────────────
const BUDGETS: { label: string; match: (p: EquipmentProduct) => boolean }[] = [
  { label: 'Under £50',   match: p => p.priceBand === 'Under £50' },
  { label: '£50–£150',    match: p => p.priceBand === '£50–150' },
  { label: '£150–£500',   match: p => p.priceBand === '£150–500' },
  { label: '£500+',       match: p => p.priceBand === '£500+' },
  { label: 'Quote required', match: p => p.purchaseModel === 'Quote' || p.badges.includes('School Quote') },
];

// ── Setting filter ──────────────────────────────────────────────────────────────
const SETTINGS: { label: string; match: (p: EquipmentProduct) => boolean }[] = [
  { label: 'Primary',        match: p => p.educationLevel.some(l => l === 'Primary' || l === 'EYFS' || l === 'All') },
  { label: 'Secondary',      match: p => p.educationLevel.some(l => l === 'Secondary' || l === 'FE' || l === 'All') },
  { label: 'SEND Provision', match: p => p.audience.includes('SEND') || (p.senCategory?.length ?? 0) > 0 },
  { label: 'Home',           match: p => p.audience.includes('Parents') },
  { label: 'Whole School',   match: p => p.audience.includes('Schools') || p.educationLevel.includes('All') },
];

// ── Intent search: synonyms + budget extraction (match on meaning, not just words)
const SYNONYMS: Record<string, string[]> = {
  visualiser: ['visualiser', 'visualizer', 'document camera', 'screens & classroom'],
  visualizer: ['visualiser', 'document camera'],
  headphones: ['headphone', 'audio', 'hearing', 'noise', 'ear defender'],
  noise: ['noise', 'ear defender', 'headphone', 'audio', 'hearing'],
  reducing: ['noise', 'ear defender'],
  aac: ['aac', 'communication'],
  communication: ['communication', 'aac'],
  dyslexia: ['dyslexia', 'literacy', 'reading', 'stationery'],
  literacy: ['literacy', 'reading', 'stationery', 'dyslexia'],
  sensory: ['sensory', 'regulation'],
  standing: ['standing', 'desk', 'furniture', 'posture'],
  desk: ['desk', 'furniture', 'table'],
  seating: ['seating', 'stool', 'chair', 'furniture', 'wobble'],
  active: ['active', 'wobble', 'movement', 'seating', 'stool'],
  wobble: ['wobble', 'stool', 'seating', 'active'],
  display: ['display', 'screen', 'classroom hardware'],
  screen: ['screen', 'display', 'classroom hardware', 'devices'],
  wellbeing: ['wellbeing', 'regulation', 'furniture'],
  autism: ['autism', 'asd', 'sensory'],
  adhd: ['adhd', 'movement', 'sensory', 'focus'],
  robot: ['robot', 'coding'],
  coding: ['coding', 'robot'],
  tablet: ['tablet', 'ipad', 'device'],
  device: ['device', 'tablet', 'laptop', 'chromebook'],
};
const STOP = new Set(['for', 'the', 'a', 'an', 'and', 'with', 'in', 'of', 'to', 'my', 'me', 'is', 'it', 'this', 'that', 'need', 'needs', 'pupil', 'pupils', 'kid', 'kids', 'child', 'equipment', 'support', 'help', 'best', 'good', 'buy', 'under', 'over']);
const BAND_LOWER: Record<string, number> = { 'Under £50': 0, '£50–150': 50, '£150–500': 150, '£500+': 500 };

function matchesSearch(p: EquipmentProduct, raw: string): boolean {
  const q = raw.toLowerCase().trim();
  if (!q) return true;
  // Budget intent: "under £300" / "under 300"
  const under = q.match(/under\s*£?\s*(\d+)/);
  if (under) {
    const max = Number(under[1]);
    if (BAND_LOWER[p.priceBand] >= max) return false; // band starts at/above the cap
  }
  const haystack = [
    p.name, p.brand, p.category, p.subcategory, p.bestFor, p.desc,
    typeOf(p.category).label, p.priceBand, ...(p.audience ?? []), ...(p.senCategory ?? []), ...(p.educationLevel ?? []),
  ].join(' ').toLowerCase();
  // Strip budget phrases, tokenise the rest
  const tokens = q.replace(/under\s*£?\s*\d+/g, '').replace(/£\s*\d+/g, '')
    .split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t));
  if (tokens.length === 0) return true; // budget-only query already handled
  // Every token must match directly or via a synonym (intent match)
  return tokens.every(tok => {
    if (haystack.includes(tok)) return true;
    const syns = SYNONYMS[tok];
    return !!syns && syns.some(s => haystack.includes(s));
  });
}

function openLuna(prompt?: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  if (prompt) setTimeout(() => window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt })), 120);
}

// ── Equipment tile (buying-guide card — no score) ───────────────────────────────
function EquipmentTile({ product }: { product: EquipmentProduct }) {
  const type = typeOf(product.category);
  const quote = product.purchaseModel === 'Quote' || product.badges.includes('School Quote');

  const askLuna = () => {
    openLuna(
      `Is "${product.name}" (${type.label} · ${product.category}) right for me? Before recommending, ask me about: learner age / key stage, the setting, any SEND need, my budget, and the intended use. Then advise on suitability and alternatives.`,
    );
    track({ name: 'cta_clicked', section: 'equipment-directory', label: `Ask Luna suitability: ${product.name}` });
  };

  return (
    <div className="flex items-start gap-5 p-5" style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}>
      {/* Monogram (data has no images) — product-type colour, decorative */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: 72, height: 72, borderRadius: 4, background: 'var(--color-oat)', border: `1px solid ${RULE}` }}
        aria-hidden="true"
      >
        <span className="w-4 h-4 rounded-full" style={{ background: type.colour }} />
      </div>

      <div className="flex-1 min-w-0">
        <Link
          to={`/ai-equipment/product/${product.slug}`}
          onClick={() => track({ name: 'cta_clicked', section: 'equipment-directory', label: `See product: ${product.name}` })}
          className="font-display block transition-opacity hover:opacity-70"
          style={{ fontSize: 20, fontWeight: 400, color: INK }}
        >
          {product.name}
        </Link>

        {/* Product type • category */}
        <p className="font-mono uppercase mt-1.5" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#6b6760' }}>
          {type.label} <span style={{ color: type.colour }}>•</span> {product.category}
        </p>

        {/* Short practical description */}
        <p className="font-sans mt-2" style={{ fontSize: 14, lineHeight: 1.5, color: FOG }}>
          {product.desc}
        </p>

        {/* Price / quote */}
        <p className="font-sans mt-2" style={{ fontSize: 13, color: '#6b6760' }}>
          {product.priceBand}
          {quote && <span style={{ color: FOG }}> · School quote available</span>}
        </p>

        {/* CTA — suitability is a conversation, not a score */}
        <button
          onClick={askLuna}
          className="font-sans inline-block mt-3 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] rounded"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink-accent)' }}
        >
          Ask Luna if this is right for me &rarr;
        </button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
const SUGGESTED = ['visualiser for primary classroom', 'sensory equipment under £300', 'AAC communication support'];

export default function AIEquipment() {
  const [roleSlug, setRoleSlug] = useState<string>(() => getRole());
  const [type, setType] = useState<string>('All');
  const [budget, setBudget] = useState<string>('All');
  const [setting, setSetting] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const sync = (e: Event) => setRoleSlug((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, sync);
    return () => window.removeEventListener(ROLE_CHANGED, sync);
  }, []);

  const activeRole = ROLE_FILTERS.find(r => r.slug === roleSlug) ?? ROLE_FILTERS[0];

  const stats = useMemo(() => [
    { value: EQUIPMENT.length, label: 'Products Reviewed', dot: undefined },
    { value: EQUIPMENT.filter(p => p.audience.includes('SEND')).length, label: 'SEND Friendly', dot: 'var(--color-pillar-accessibility)' },
    { value: EQUIPMENT.filter(p => p.audience.includes('Schools')).length, label: 'School Ready', dot: 'var(--color-pillar-privacy)' },
    { value: EQUIPMENT.filter(p => p.ukFocus).length, label: 'UK Education Focused', dot: 'var(--color-pillar-safeguarding)' },
    { value: EQUIPMENT.filter(p => p.supplierType === 'UK Specialist').length, label: 'UK Specialists', dot: 'var(--color-pillar-transparency)' },
  ], []);

  const filtered = useMemo(() => {
    let r = EQUIPMENT;
    if (activeRole.audience) r = r.filter(p => p.audience.includes(activeRole.audience as EquipmentProduct['audience'][number]));
    if (type !== 'All') {
      const t = PRODUCT_TYPES.find(x => x.label === type);
      if (t) r = r.filter(p => t.cats.includes(p.category));
    }
    if (budget !== 'All') {
      const b = BUDGETS.find(x => x.label === budget);
      if (b) r = r.filter(b.match);
    }
    if (setting !== 'All') {
      const s = SETTINGS.find(x => x.label === setting);
      if (s) r = r.filter(s.match);
    }
    if (search.trim()) r = r.filter(p => matchesSearch(p, search));
    return r;
  }, [activeRole, type, budget, setting, search]);

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
        title="AI Equipment for UK Education — School Buying Guide | GetPromptly"
        description="A school buying guide for UK classrooms, SEND settings and home learning — classroom tech, assistive technology, sensory equipment, furniture and infrastructure. Search by need; ask Luna about suitability."
        keywords="AI equipment UK education, classroom technology, SEND assistive tech, AAC communication, sensory equipment, school furniture, educational devices UK"
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
            A buying guide for UK classrooms, SEND settings and home learning. Search by the problem you need to solve — then ask Luna whether a product fits your context.
          </p>

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
        </div>
      </section>

      {/* ── 2. STAT STRIP ──────────────────────────────────────────────────────── */}
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

      {/* ── 3. FILTERS (sticky) — buying intent, not scoring ───────────────────── */}
      <div className="sticky top-16 z-20" style={{ background: 'var(--color-oat)', borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-col gap-3">

          {/* Audience */}
          <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap -mx-5 px-5 sm:mx-0 sm:px-0">
            {ROLE_FILTERS.map(r => {
              const active = roleSlug === r.slug;
              return (
                <button
                  key={r.label}
                  onClick={() => chooseRole(r.slug)}
                  aria-pressed={active}
                  className="font-sans flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={active
                    ? { fontSize: 12, fontWeight: 600, background: LIME, color: INK, borderColor: 'transparent' }
                    : { fontSize: 12, background: 'transparent', color: INK, borderColor: RULE }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Product type */}
          <div className="flex items-center gap-2 overflow-x-auto lg:flex-wrap -mx-5 px-5 sm:mx-0 sm:px-0">
            {[{ label: 'All', colour: FOG }, ...PRODUCT_TYPES].map(t => {
              const active = type === t.label;
              return (
                <button
                  key={t.label}
                  onClick={() => { setType(t.label); track({ name: 'tool_filter_used', filterType: 'category', value: t.label, pageType: 'equipment' }); }}
                  aria-pressed={active}
                  className="font-sans flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={active
                    ? { fontSize: 12, fontWeight: 600, background: INK, color: '#FFFFFF', borderColor: INK }
                    : { fontSize: 12, background: 'transparent', color: INK, borderColor: RULE }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.colour }} aria-hidden="true" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Budget + Setting + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              aria-label="Budget"
              value={budget}
              onChange={e => { setBudget(e.target.value); track({ name: 'tool_filter_used', filterType: 'safety', value: e.target.value, pageType: 'equipment' }); }}
              className="font-sans rounded-lg px-3 py-2 outline-none flex-shrink-0"
              style={{ fontSize: 14, background: 'white', color: INK, border: `1px solid ${RULE}` }}
            >
              <option value="All">Budget: Any</option>
              {BUDGETS.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
            </select>
            <select
              aria-label="Setting"
              value={setting}
              onChange={e => { setSetting(e.target.value); track({ name: 'tool_filter_used', filterType: 'category', value: e.target.value, pageType: 'equipment' }); }}
              className="font-sans rounded-lg px-3 py-2 outline-none flex-shrink-0"
              style={{ fontSize: 14, background: 'white', color: INK, border: `1px solid ${RULE}` }}
            >
              <option value="All">Setting: Any</option>
              {SETTINGS.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
            </select>
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: 'var(--color-ink-accent)' }} aria-hidden="true">🔍</span>
              <input
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); if (e.target.value.length > 2) track({ name: 'search_performed', section: 'equipment', query: e.target.value }); }}
                placeholder="Search equipment by need, product or budget…"
                aria-label="Search equipment"
                className="font-sans w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                style={{ fontSize: 14, background: 'white', color: INK, borderColor: RULE }}
              />
            </div>
          </div>

          {/* Suggested searches */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.08em', color: '#9c9c8a' }}>Try</span>
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => { setSearch(s); track({ name: 'search_performed', section: 'equipment-suggested', query: s }); }}
                className="font-sans rounded-full px-3 py-1 border transition-colors hover:border-[var(--color-ink-accent)]"
                style={{ fontSize: 12, color: 'var(--color-ink-accent)', background: 'white', borderColor: RULE }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. RESULTS ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <p className="font-sans mb-5" style={{ fontSize: 13, color: '#6b6760' }}>
          Showing <strong style={{ color: INK }}>{filtered.length}</strong> of {EQUIPMENT.length} products
        </p>

        {filtered.length === 0 ? (
          <div className="p-10 text-center" style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}>
            <p className="font-display" style={{ fontSize: 20, color: INK }}>No exact match.</p>
            <button
              onClick={() => { openLuna(`Shortlist suitable equipment for: ${search || 'my need'}. Ask me about learner age/key stage, setting, any SEND need, budget and intended use first.`); track({ name: 'agent_opened', section: 'equipment-no-results' }); }}
              className="font-sans inline-block mt-3 rounded-full px-5 py-2.5 transition-opacity hover:opacity-90"
              style={{ fontSize: 14, fontWeight: 600, background: LIME, color: '#1A1A0E' }}
            >
              Ask Luna to shortlist suitable equipment &rarr;
            </button>
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

// ── Hero Luna input ─────────────────────────────────────────────────────────────
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
