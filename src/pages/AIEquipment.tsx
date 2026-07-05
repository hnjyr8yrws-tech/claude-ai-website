/**
 * AIEquipment.tsx — /ai-equipment (Equipment catalogue)
 *
 * A clean, dark, premium product catalogue — not a text document. Hero →
 * category grid → featured picks → full filterable catalogue → Luna CTA.
 * Equipment is NOT numerically scored; suitability is a conversation with Luna.
 * Card descriptions are one line — full detail lives on the product page.
 *
 * Brand (CLAUDE.md): dark ground-black page, surface-dark cards; no gradients;
 * Fraunces / Satoshi / JetBrains Mono only; lime reserved for CTAs + links.
 * The individual product pages are NOT changed by this file.
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop, BookOpen, Bot, Puzzle, MessageSquare, Heart, Monitor,
  Headphones, Armchair, Watch, Search, ArrowRight, type LucideIcon,
} from 'lucide-react';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { EQUIPMENT, type EquipmentProduct, type EquipmentCategory, type PriceBand } from '../data/equipment';

// ── Tokens (shared with the prompts page) ───────────────────────────────────────
const LIME = 'var(--color-promptly-lime)';
const GROUND = 'var(--color-ground-black)';
const SURFACE = 'var(--color-surface-dark)';
const OAT = 'var(--color-oat)';
const INK = 'var(--color-ink)';
const FOG = 'var(--color-fog)';
const CARD_BORDER = 'rgba(232,228,220,0.1)';
const FEATURED_BORDER = 'rgba(200,228,74,0.2)';
// Light-surface tokens (the oat catalogue body) — lime can't sit on white, so
// links/emphasis use dark-lime (--color-ink-accent) and Luna CTAs use a lime FILL.
const WHITE = '#FFFFFF';
const RULE = 'var(--color-rule)';
const MUTED = 'var(--color-ink-muted)';        // secondary text on oat / white
const INK_ACCENT = '#46540E';   // dark-lime — links/emphasis on light surfaces

// ── Pillar palette — restrained accents so the hub reads as GetPromptly, ────────
// not as a generic marketplace. Lime (Safeguarding) is reserved for Luna.
const SAFE    = '#C8E44A'; // Safeguarding — Luna, advice, trust marks
const PRIVACY = '#6A8CAF'; // Data Privacy — technology / availability / filtering
const AGE     = '#8C7A52'; // Age Suitability (oat deep) — budget / learning
const SLATE   = '#4A4F5C'; // Transparency — neutral, structural
const CLAY    = '#D97757'; // Accessibility — SEND / communication / sensory / hearing

// Each category carries a subtle pillar relationship (icon colour + tinted border).
const CATEGORY_COLOUR: Record<EquipmentCategory, string> = {
  'Devices': PRIVACY,
  'Stationery & Literacy': AGE,
  'Robots & Coding': PRIVACY,
  'Games & Cognitive': AGE,
  'AAC & Communication': CLAY,
  'Sensory & Regulation': CLAY,
  'Screens & Classroom Hardware': SLATE,
  'Audio & Hearing': CLAY,
  'Furniture & Environment': AGE,
  'Wearables & Safety': SAFE,
};

// #RRGGBB → rgba(...,a) for subtle tinted borders/surfaces.
function tint(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
// Slate is dark-on-dark — lift it only for icon legibility.
const iconColour = (c: string) => (c === SLATE ? '#7C8290' : c);

// ── Categories (fixed order + lucide icon) ──────────────────────────────────────
const CATEGORIES: { name: EquipmentCategory; Icon: LucideIcon }[] = [
  { name: 'Devices', Icon: Laptop },
  { name: 'Stationery & Literacy', Icon: BookOpen },
  { name: 'Robots & Coding', Icon: Bot },
  { name: 'Games & Cognitive', Icon: Puzzle },
  { name: 'AAC & Communication', Icon: MessageSquare },
  { name: 'Sensory & Regulation', Icon: Heart },
  { name: 'Screens & Classroom Hardware', Icon: Monitor },
  { name: 'Audio & Hearing', Icon: Headphones },
  { name: 'Furniture & Environment', Icon: Armchair },
  { name: 'Wearables & Safety', Icon: Watch },
];

const AUDIENCES = ['All', 'Teachers', 'SEND', 'Parents', 'Students', 'Schools'] as const;
const PRICE_BANDS: PriceBand[] = ['Under £50', '£50–150', '£150–500', '£500+'];

function matchAudience(p: EquipmentProduct, a: string): boolean {
  switch (a) {
    case 'Teachers': return p.audience.includes('Teachers') || p.audience.includes('Schools');
    case 'SEND':     return p.audience.includes('SEND') || p.senCategory.some(c => c && c !== 'General');
    case 'Parents':  return p.audience.includes('Parents');
    case 'Students': return p.audience.includes('Students');
    case 'Schools':  return p.audience.includes('Schools');
    default:         return true;
  }
}

// ── Intent search (synonyms + budget extraction) ────────────────────────────────
const SYNONYMS: Record<string, string[]> = {
  visualiser: ['visualiser', 'visualizer', 'document camera'],
  headphones: ['headphone', 'audio', 'hearing', 'noise', 'ear defender'],
  noise: ['noise', 'ear defender', 'headphone', 'audio', 'hearing'],
  aac: ['aac', 'communication'],
  communication: ['communication', 'aac'],
  dyslexia: ['dyslexia', 'literacy', 'reading', 'stationery'],
  literacy: ['literacy', 'reading', 'stationery', 'dyslexia'],
  sensory: ['sensory', 'regulation'],
  desk: ['desk', 'furniture', 'table'],
  seating: ['seating', 'stool', 'chair', 'furniture', 'wobble'],
  wobble: ['wobble', 'stool', 'seating'],
  display: ['display', 'screen', 'classroom hardware'],
  screen: ['screen', 'display', 'classroom hardware', 'devices'],
  autism: ['autism', 'asd', 'sensory'],
  adhd: ['adhd', 'movement', 'sensory', 'focus'],
  robot: ['robot', 'coding'],
  coding: ['coding', 'robot'],
  tablet: ['tablet', 'ipad', 'device'],
  device: ['device', 'tablet', 'laptop', 'chromebook'],
};
const STOP = new Set(['for', 'the', 'a', 'an', 'and', 'with', 'in', 'of', 'to', 'my', 'me', 'is', 'it', 'this', 'that', 'need', 'needs', 'pupil', 'pupils', 'child', 'equipment', 'support', 'help', 'best', 'good', 'buy', 'under', 'over']);
const BAND_LOWER: Record<string, number> = { 'Under £50': 0, '£50–150': 50, '£150–500': 150, '£500+': 500 };

function matchesSearch(p: EquipmentProduct, raw: string): boolean {
  const q = raw.toLowerCase().trim();
  if (!q) return true;
  const under = q.match(/under\s*£?\s*(\d+)/);
  if (under && BAND_LOWER[p.priceBand] >= Number(under[1])) return false;
  const haystack = [p.name, p.brand, p.category, p.subcategory, p.bestFor, p.desc, p.priceBand, ...p.audience, ...p.senCategory, ...p.educationLevel].join(' ').toLowerCase();
  const tokens = q.replace(/under\s*£?\s*\d+/g, '').replace(/£\s*\d+/g, '').split(/[^a-z0-9]+/).filter(t => t.length > 2 && !STOP.has(t));
  if (tokens.length === 0) return true;
  return tokens.every(tok => haystack.includes(tok) || (SYNONYMS[tok]?.some(s => haystack.includes(s)) ?? false));
}

function openLuna(prompt?: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  if (prompt) setTimeout(() => window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt })), 120);
}

function scrollToCatalogue() {
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Luna's Top Picks (auto-rotating monthly, revenue-focused) ───────────────────
// Revenue pool = products that can actually earn commission (Amazon-available /
// affiliate Amazon link). The selection is DETERMINISTIC by month, so the section
// changes by itself on the 1st — no maintenance, no backend. The window advances
// by `n` each month and wraps, so picks cycle through the whole pool over time.
const REVENUE_POOL: EquipmentProduct[] = EQUIPMENT
  .filter(p => p.badges.includes('Amazon Available') || /amazon\.co\.uk/i.test(p.affiliateLink))
  .sort((a, b) => a.id.localeCompare(b.id)); // stable order so rotation is repeatable

function monthlyPicks(n: number, date = new Date()): EquipmentProduct[] {
  const pool = REVENUE_POOL;
  if (pool.length === 0) return [];
  const seed = date.getFullYear() * 12 + date.getMonth(); // unique, monotonic per month
  const start = (seed * n) % pool.length;
  return Array.from({ length: Math.min(n, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}

function isAmazon(p: EquipmentProduct): boolean {
  return /amazon\.co\.uk/i.test(p.affiliateLink);
}

// ── Small UI atoms ──────────────────────────────────────────────────────────────
function Pill({ children, color = FOG, border = CARD_BORDER }: { children: React.ReactNode; color?: string; border?: string }) {
  return (
    <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: 10, color, border: `1px solid ${border}` }}>
      {children}
    </span>
  );
}

// ── Catalogue card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: EquipmentProduct }) {
  const sendFriendly = product.badges.includes('SEND Friendly');
  const amazon = product.badges.includes('Amazon Available');
  const reviewed = product.reviewStatus === 'Reviewed';

  const tags: React.ReactNode[] = [<Pill key="price" color={AGE} border={tint(AGE, 0.4)}>{product.priceBand}</Pill>];
  if (sendFriendly) tags.push(<Pill key="send" color={CLAY} border={tint(CLAY, 0.4)}>SEND Friendly</Pill>);
  if (reviewed) tags.push(<Pill key="rev" color={INK_ACCENT} border={tint(INK_ACCENT, 0.4)}>Reviewed</Pill>);
  if (amazon) tags.push(<Pill key="amz" color={PRIVACY} border={tint(PRIVACY, 0.4)}>Amazon Available</Pill>);

  const askLuna = () => {
    openLuna(`Is "${product.name}" (${product.category}) right for me? Before recommending, ask me about: learner age / key stage, the setting, any SEND need, my budget, and the intended use. Then advise on suitability and alternatives.`);
    track({ name: 'cta_clicked', section: 'equipment-catalogue', label: `Ask Luna: ${product.name}` });
  };

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2.5 transition-transform hover:-translate-y-0.5" style={{ background: WHITE, border: `1px solid ${RULE}` }}>
      <div className="flex items-center gap-2">
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', color: MUTED }}>{product.category}</span>
        {product.subcategory && (
          <>
            <span style={{ color: MUTED }}>·</span>
            <span className="font-mono" style={{ fontSize: 10, color: MUTED }}>{product.subcategory}</span>
          </>
        )}
      </div>

      <Link
        to={`/ai-equipment/product/${product.slug}`}
        onClick={() => track({ name: 'cta_clicked', section: 'equipment-catalogue', label: `View product: ${product.name}` })}
        className="font-serif line-clamp-2 transition-opacity hover:opacity-70"
        style={{ fontSize: 18, lineHeight: 1.2, color: INK }}
      >
        {product.name}
      </Link>

      <p className="font-mono" style={{ fontSize: 11, color: MUTED }}>{product.brand}</p>

      <p className="font-sans truncate" style={{ fontSize: 13, color: MUTED }}>{product.desc}</p>

      <div className="flex flex-wrap gap-1.5 mt-0.5">{tags.slice(0, 3)}</div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <Link
          to={`/ai-equipment/product/${product.slug}`}
          className="font-sans inline-flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ fontSize: 13, fontWeight: 600, color: INK_ACCENT }}
        >
          View product <ArrowRight size={13} />
        </Link>
        <button
          onClick={askLuna}
          className="font-sans rounded-full px-3.5 py-1.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
          style={{ fontSize: 12, fontWeight: 600, background: LIME, color: INK }}
        >
          Ask Luna
        </button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function AIEquipment() {
  const [audience, setAudience] = useState<string>('All');
  const [category, setCategory] = useState<string>('All');
  const [price, setPrice] = useState<string>('All');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of EQUIPMENT) m[p.category] = (m[p.category] ?? 0) + 1;
    return m;
  }, []);

  // Auto-rotating monthly picks + the current month label (e.g. "June 2026").
  const picks = useMemo(() => monthlyPicks(4), []);
  const monthLabel = useMemo(() => new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' }), []);

  const filtered = useMemo(() => {
    return EQUIPMENT.filter(p => {
      if (!matchAudience(p, audience)) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (price !== 'All' && p.priceBand !== price) return false;
      if (search.trim() && !matchesSearch(p, search)) return false;
      return true;
    });
  }, [audience, category, price, search]);

  const pickCategory = (name: string) => {
    setCategory(name);
    track({ name: 'tool_filter_used', filterType: 'category', value: name, pageType: 'equipment' });
    setTimeout(scrollToCatalogue, 60);
  };

  return (
    <div style={{ background: GROUND, minHeight: '100vh' }}>
      <SEO
        title="Equipment for UK Schools — Independent Buying Guide | GetPromptly"
        description="Independent equipment recommendations for UK schools, SEND teams and school leaders — devices, assistive technology, sensory equipment, classroom hardware and furniture. Tell Luna your needs and budget."
        keywords="school equipment UK, classroom technology, SEND assistive tech, AAC communication, sensory equipment, school furniture, educational devices UK"
        path="/ai-equipment"
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: GROUND }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-14">
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', color: FOG }}>
            Equipment Advice · UK Schools
          </p>

          {/* Five-pillar accent rule — the brand device, in lieu of a gradient (Brand Bible: no gradients). */}
          <div className="flex gap-1.5 mt-6" aria-hidden="true">
            {[PRIVACY, SAFE, AGE, SLATE, CLAY].map((c, i) => (
              <span key={i} style={{ width: 38, height: 3, borderRadius: 2, background: c }} />
            ))}
          </div>

          <h1 className="font-serif mt-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', color: OAT }}>
            Stop guessing what to buy.<br />Start choosing with confidence.
          </h1>
          <p className="font-sans mt-5 max-w-xl" style={{ fontSize: 16, lineHeight: 1.6, color: FOG }}>
            Independent equipment recommendations for UK schools, SEND teams and school leaders.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => { openLuna('Help me find the right equipment. Ask me about the learner’s need, the setting and my budget, then suggest what fits.'); track({ name: 'agent_opened', section: 'equipment-hero' }); }}
              className="font-sans inline-flex items-center gap-2 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground-black)]"
              style={{ fontSize: 15, fontWeight: 600, background: LIME, color: INK }}
            >
              Ask Luna <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-7">
            {['Independent Advice', 'UK Schools Focus', 'Accessibility Aware'].map(t => (
              <span key={t} className="font-mono rounded-full px-3 py-1" style={{ fontSize: 11, color: FOG, border: `1px solid ${CARD_BORDER}` }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY GRID ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
        <p className="font-mono uppercase mb-5" style={{ fontSize: 11, letterSpacing: '0.22em', color: FOG }}>Browse by category</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map(({ name, Icon }) => {
            const c = CATEGORY_COLOUR[name];
            const on = category === name;
            return (
              <button
                key={name}
                onClick={() => pickCategory(name)}
                className="text-left rounded-2xl p-5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                style={{ background: SURFACE, border: `1px solid ${on ? tint(c, 0.85) : tint(c, 0.3)}` }}
              >
                <span className="inline-flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: tint(c, 0.14), border: `1px solid ${tint(c, 0.3)}` }}>
                  <Icon size={20} color={iconColour(c)} strokeWidth={1.6} />
                </span>
                <p className="font-serif mt-3" style={{ fontSize: 18, lineHeight: 1.15, color: OAT }}>{name}</p>
                <p className="font-mono mt-1.5" style={{ fontSize: 11, color: FOG }}>{counts[name] ?? 0} products</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. LUNA'S TOP PICKS THIS MONTH (auto-rotating, revenue) ─────────────── */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div style={{ width: 40, height: 3, borderRadius: 2, background: LIME, marginBottom: 16 }} aria-hidden="true" />
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', color: LIME }}>
            Luna's top picks · {monthLabel}
          </p>
          <h2 className="font-serif mt-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, color: OAT }}>
            Worth a look this month.
          </h2>
          <p className="font-sans mt-2 max-w-xl" style={{ fontSize: 14, lineHeight: 1.55, color: FOG }}>
            A rotating shortlist Luna thinks is worth a look right now — refreshed at the start of every month.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {picks.map(p => (
              <div key={p.id} className="rounded-2xl p-5 flex flex-col gap-2.5" style={{ background: SURFACE, border: `1px solid ${FEATURED_BORDER}` }}>
                <span className="font-mono uppercase self-start rounded-full px-2 py-0.5" style={{ fontSize: 9, letterSpacing: '0.08em', color: INK, background: LIME }}>Luna's pick</span>
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', color: FOG }}>{p.category}</span>
                <Link
                  to={`/ai-equipment/product/${p.slug}`}
                  onClick={() => track({ name: 'cta_clicked', section: 'equipment-luna-picks', label: `View product: ${p.name}` })}
                  className="font-serif line-clamp-2 transition-opacity hover:opacity-80"
                  style={{ fontSize: 17, lineHeight: 1.2, color: OAT }}
                >
                  {p.name}
                </Link>
                <p className="font-mono" style={{ fontSize: 11, color: FOG }}>{p.brand}</p>
                <p className="font-sans truncate" style={{ fontSize: 13, color: FOG }}>{p.desc}</p>
                <span className="font-mono rounded-full px-2 py-0.5 self-start" style={{ fontSize: 10, color: FOG, border: `1px solid ${CARD_BORDER}` }}>{p.priceBand}</span>

                <div className="flex flex-col gap-2 mt-auto pt-2">
                  <a
                    href={p.affiliateLink}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={() => track({ name: 'affiliate_click', itemId: p.id, itemName: p.name, category: p.category, pageType: 'equipment' })}
                    className="font-sans inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 transition-opacity hover:opacity-90"
                    style={{ fontSize: 13, fontWeight: 600, background: LIME, color: INK }}
                  >
                    {isAmazon(p) ? 'View on Amazon' : 'Check price'} <ArrowRight size={13} />
                  </a>
                  <Link
                    to={`/ai-equipment/product/${p.slug}`}
                    className="font-sans inline-flex items-center justify-center gap-1 transition-opacity hover:opacity-80"
                    style={{ fontSize: 12, fontWeight: 600, color: LIME }}
                  >
                    Read our take <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Disclosure (Brand Bible §22 — commercial relationship) */}
          <p className="font-mono mt-5 max-w-3xl" style={{ fontSize: 10, lineHeight: 1.6, color: FOG }}>
            Picks rotate automatically each month and are chosen independently — never paid placement. Some links are affiliate links, so we may earn a small commission at no extra cost to you. This helps keep GetPromptly independent.
          </p>
        </div>
      </section>

      {/* ── 4. FULL CATALOGUE ───────────────────────────────────────────────────── */}
      <section id="catalogue" style={{ background: OAT, scrollMarginTop: 64 }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
          <div style={{ width: 40, height: 3, borderRadius: 2, background: PRIVACY, marginBottom: 16 }} aria-hidden="true" />
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', color: MUTED }}>All equipment</p>

          {/* Luna advisory — advice-first, not a catalogue. On-brand: dark + lime on oat. */}
          <div
            className="mt-5 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: GROUND, borderLeft: `3px solid ${LIME}` }}
          >
            <div style={{ maxWidth: 560 }}>
              <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', color: LIME }}>Luna · Equipment adviser</p>
              <p className="font-serif mt-2" style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', color: OAT }}>Not sure what to buy?</p>
              <p className="font-sans mt-1.5" style={{ fontSize: 14, lineHeight: 1.55, color: FOG }}>
                Tell Luna about your school, budget and needs — she'll shortlist equipment worth considering.
              </p>
            </div>
            <button
              onClick={() => { openLuna('Help me choose equipment — ask me about my school, the pupil’s need, the setting and my budget, then shortlist what fits.'); track({ name: 'agent_opened', section: 'equipment-catalogue-adviser' }); }}
              className="font-sans flex-shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ground-black)]"
              style={{ fontSize: 15, fontWeight: 600, background: LIME, color: INK }}
            >
              Ask Luna <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Sticky filter bar — top-16 clears the 64px navbar */}
        <div className="sticky top-16 z-20 mt-4" style={{ background: OAT, borderBottom: `1px solid ${RULE}` }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-col gap-3">
            {/* Audience tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {AUDIENCES.map(a => {
                const on = audience === a;
                return (
                  <button
                    key={a}
                    onClick={() => { setAudience(a); track({ name: 'tool_filter_used', filterType: 'role', value: a, pageType: 'equipment' }); }}
                    aria-pressed={on}
                    className="font-sans flex-shrink-0 rounded-full px-4 py-1.5 transition-colors"
                    style={on
                      ? { fontSize: 13, fontWeight: 600, background: LIME, color: INK, border: '1px solid transparent' }
                      : { fontSize: 13, background: 'transparent', color: INK, border: `1px solid ${RULE}` }}
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            {/* Category + Price + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                aria-label="Category"
                value={category}
                onChange={e => { setCategory(e.target.value); track({ name: 'tool_filter_used', filterType: 'category', value: e.target.value, pageType: 'equipment' }); }}
                className="font-sans rounded-lg px-3 py-2 outline-none flex-shrink-0"
                style={{ fontSize: 14, background: WHITE, color: INK, border: `1px solid ${RULE}` }}
              >
                <option value="All">Category: All</option>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <select
                aria-label="Price band"
                value={price}
                onChange={e => { setPrice(e.target.value); track({ name: 'tool_filter_used', filterType: 'category', value: e.target.value, pageType: 'equipment' }); }}
                className="font-sans rounded-lg px-3 py-2 outline-none flex-shrink-0"
                style={{ fontSize: 14, background: WHITE, color: INK, border: `1px solid ${RULE}` }}
              >
                <option value="All">Price: All</option>
                {PRICE_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <div className="relative flex-1">
                <Search size={15} color={MUTED} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={e => { setSearch(e.target.value); if (e.target.value.length > 2) track({ name: 'search_performed', section: 'equipment', query: e.target.value }); }}
                  placeholder="Search equipment…"
                  aria-label="Search equipment"
                  className="font-sans w-full rounded-lg pl-9 pr-3 py-2 outline-none focus-visible:ring-1"
                  style={{ fontSize: 14, background: WHITE, color: INK, border: `1px solid ${RULE}` }}
                />
              </div>
            </div>

            <p className="font-mono" style={{ fontSize: 12, color: MUTED }}>
              Showing {filtered.length} of {EQUIPMENT.length} products
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-14">
          {filtered.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: WHITE, border: `1px solid ${RULE}` }}>
              <p className="font-serif" style={{ fontSize: 20, color: INK }}>No products match those filters.</p>
              <button
                onClick={() => { openLuna(`Shortlist suitable equipment for: ${search || 'my need'}. Ask me about learner age/key stage, setting, any SEND need, budget and intended use first.`); track({ name: 'agent_opened', section: 'equipment-no-results' }); }}
                className="font-sans inline-flex items-center gap-2 mt-4 rounded-full px-5 py-2.5 transition-opacity hover:opacity-90"
                style={{ fontSize: 14, fontWeight: 600, background: LIME, color: INK }}
              >
                Ask Luna to shortlist <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. LUNA CTA STRIP ───────────────────────────────────────────────────── */}
      <section style={{ background: SURFACE, borderLeft: `3px solid ${LIME}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div style={{ maxWidth: 580 }}>
            <p className="font-serif" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 400, lineHeight: 1.3, color: OAT }}>
              Still weighing it up?
            </p>
            <p className="font-sans mt-2" style={{ fontSize: 15, lineHeight: 1.55, color: FOG }}>
              Talk your options through with Luna — independent advice, in plain English, with no sales pitch.
            </p>
          </div>
          <button
            onClick={() => { openLuna('Help me choose equipment — ask me about the pupil’s need, the setting and my budget, then advise on what fits.'); track({ name: 'agent_opened', section: 'equipment-cta-strip' }); }}
            className="font-sans flex-shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2A2A]"
            style={{ fontSize: 15, fontWeight: 600, background: LIME, color: INK }}
          >
            Ask Luna <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
