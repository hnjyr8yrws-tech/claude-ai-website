import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  TRAINING,
  type TrainingItem,
} from '../data/training';
import AgentCTACard from '../components/AgentCTACard';
import { useRoleSync } from '../hooks/useRoleSync';
import { setRole } from '../utils/role';
import { RoleIcon } from '../components/icons';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { useCrossSell } from '../hooks/useCrossSell';
import { track } from '../utils/analytics';

const TEAL = 'var(--color-promptly-lime)';
const AMBER_BG = 'var(--color-oat)';
const AMBER_TEXT = 'var(--color-ink)';
const AMBER_BORDER = 'var(--color-rule)';

// ─── Derived stats ────────────────────────────────────────────────────────────

const STAT_TOTAL       = TRAINING.length;
const STAT_FREE        = TRAINING.filter(t => t.type === 'Free').length;
const STAT_UK_BACKED   = TRAINING.filter(t => t.ukRelevant && !t.affiliate).length;
const STAT_CERTS       = TRAINING.filter(t => t.certificate === true).length;

// ─── Filter types ─────────────────────────────────────────────────────────────

type TypeFilter     = 'All' | 'Free' | 'Paid';
type AudienceFilter = 'All' | 'Teachers' | 'Parents' | 'Students' | 'SEND' | 'Leaders' | 'Admin';

const TYPE_TABS: { label: string; value: TypeFilter }[] = [
  { label: 'All',  value: 'All' },
  { label: 'Free', value: 'Free' },
  { label: 'Paid', value: 'Paid' },
];
// (AUDIENCE_PILLS removed — replaced by the spec ROLE_FILTERS below.)

// Role filter — maps the site-wide role slug to this page's audience filter.
const ROLE_FILTERS: { label: string; slug: string; value: AudienceFilter }[] = [
  { label: 'All',           slug: '',              value: 'All' },
  { label: 'Teacher',       slug: 'teacher',       value: 'Teachers' },
  { label: 'SENCO',         slug: 'senco',         value: 'SEND' },
  { label: 'School Leader', slug: 'school-leader', value: 'Leaders' },
  { label: 'Parent',        slug: 'parent',        value: 'Parents' },
  { label: 'Student',       slug: 'student',       value: 'Students' },
];

// Visual category tiles — editorial outline icons (§12), keyed to the role map.
const AUDIENCE_TILES: { label: string; value: AudienceFilter; icon: string }[] = [
  { label: 'Teachers', value: 'Teachers', icon: 'teacher' },
  { label: 'Parents',  value: 'Parents',  icon: 'parent' },
  { label: 'Students', value: 'Students', icon: 'student' },
  { label: 'SEND',     value: 'SEND',     icon: 'senco' },
  { label: 'Leaders',  value: 'Leaders',  icon: 'leaders' },
  { label: 'Admin',    value: 'Admin',    icon: 'admin' },
];

// ─── Pillar classification ──────────────────────────────────────────────────────
// A training item's primary pillar — derived from its category/tags. Pillar
// colours do structural work here (§03), telling you what the course is about.

interface PillarBadge { name: string; colour: string }

function pillarFor(item: TrainingItem): PillarBadge | null {
  const hay = `${item.category} ${item.name} ${item.notes} ${item.tags.join(' ')}`.toLowerCase();
  if (/kcsie|safeguard|safety|online harm|deepfake/.test(hay))
    return { name: 'Safeguarding', colour: 'var(--color-pillar-safeguarding)' };
  if (/send|senco|accessib|aac|neurodiver|assistive|dyslex|autism/.test(hay))
    return { name: 'Accessibility', colour: 'var(--color-pillar-accessibility)' };
  if (/gdpr|data protection|privacy|data /.test(hay))
    return { name: 'Data Privacy', colour: 'var(--color-pillar-privacy)' };
  if (/student|pupil|ks[1-5]|key stage|age|child|primary|secondary/.test(hay))
    return { name: 'Age Suitability', colour: 'var(--color-pillar-age)' };
  return null;
}

// ─── Card component ───────────────────────────────────────────────────────────

function TrainingCard({ item }: { item: TrainingItem }) {
  const linkRel = item.affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer';
  const pillar = pillarFor(item);
  const typeLabel = item.certificate ? `${item.type} · Certificate` : item.type;

  return (
    <div className="flex flex-col p-5" style={{ background: 'white', border: '1px solid #E8E4DC', borderRadius: 4 }}>
      <div className="flex-1">
        {/* Title + pillar badge top-right */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: '#1E1E1E' }}>
            {item.name}
          </h3>
          {pillar && (
            <span className="font-mono inline-flex items-center gap-1.5 uppercase flex-shrink-0 mt-1.5" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#6b6760' }}>
              <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: pillar.colour }} aria-hidden="true" />
              {pillar.name}
            </span>
          )}
        </div>

        {/* Provider + type (Free/Paid/Certificate) */}
        <p className="font-sans mt-1" style={{ fontSize: 13, fontWeight: 500, color: '#6b6760' }}>
          {item.provider} · {typeLabel}
        </p>

        {/* One-line description */}
        <p className="font-sans mt-2.5" style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--color-fog)' }}>
          {item.notes}
        </p>
      </div>

      {/* View resource link */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-sans" style={{ fontSize: 13, fontWeight: 500, color: '#6b6760' }}>{item.cost}</span>
        <a
          href={item.url}
          target="_blank"
          rel={linkRel}
          onClick={() => track({ name: 'cta_clicked', section: 'training-grid', label: `View resource: ${item.name}` })}
          className="font-sans transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] rounded"
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-accent)' }}
        >
          View resource &rarr;
        </a>
      </div>
      {item.affiliate && (
        <span className="font-sans mt-1.5 self-end" style={{ fontSize: 9, color: '#6b6760' }}>Affiliate link</span>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AITraining() {
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>('All');
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('All');
  useRoleSync<AudienceFilter>(
    { teacher: 'Teachers', senco: 'SEND', 'school-leader': 'Leaders', parent: 'Parents', student: 'Students', admin: 'Admin' },
    setAudienceFilter,
  );
  const [search, setSearch]             = useState('');

  // Cross-sell
  const { inlineItems, popupItems, popupOpen, popupTrigger, closePopup } = useCrossSell({
    currentSection: 'training',
    roles: audienceFilter !== 'All' ? [audienceFilter] : undefined,
  });

  // Main filterable grid
  const filtered = useMemo(() => {
    return TRAINING.filter(item => {
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      if (audienceFilter !== 'All' && !item.tags.includes(audienceFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [
          item.name,
          item.provider,
          item.notes,
          item.category,
          item.level,
          ...(item.tags ?? []),
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [typeFilter, audienceFilter, search]);

  return (
    <>
      <SEO
        title={`AI Training Hub — ${STAT_TOTAL} Free & Paid Courses for UK Educators | GetPromptly`}
        description={`${STAT_TOTAL} free and paid AI training resources curated for UK teachers, parents, students and school leaders. Government-backed, certificate courses and specialist pathways.`}
        keywords="AI training UK, free AI courses teachers, AI courses education, AI skills hub, AI learning parents, SEND AI resources"
        path="/ai-training"
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="pt-24 pb-16 px-5 sm:px-8"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-4xl mx-auto">
          <SectionLabel>AI Training Hub</SectionLabel>
          {/* Light hero (oat): full ground-black headline, no per-word accent (§09). */}
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: '#1E1E1E' }}>
            Learn AI.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-10" style={{ color: '#6b6760' }}>
            {STAT_TOTAL} free and paid resources curated for UK educators, parents, students
            and professionals. Government-backed, independently reviewed, trust-first.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total resources', value: STAT_TOTAL },
              { label: 'Completely free', value: STAT_FREE },
              { label: 'UK government-backed', value: STAT_UK_BACKED },
              { label: 'Certificate courses', value: STAT_CERTS },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border p-5 text-center"
                style={{ borderColor: '#E8E4DC', background: 'white' }}
              >
                <p className="font-display mb-1" style={{ fontSize: 32, fontWeight: 700, color: '#1E1E1E' }}>
                  {stat.value}
                </p>
                <p className="font-sans" style={{ fontSize: 12, color: '#9C9C8A' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LUNA HERO — the visual centrepiece, directly below the header ────── */}
      <section className="px-5 sm:px-8 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <AgentCTACard
            section="Luna · Learning Pathfinder"
            headline="Tell Luna your role — get a learning path in seconds."
            description="Describe who you are and what you want to learn. Luna searches every course and certification and builds the right path for you."
            prompts={[
              "What free AI training is available for UK teachers?",
              "Which course gives the best certification for school leaders?",
              "What AI training should a new SENCO start with?",
              "I'm a parent — where do I learn about AI safety?",
            ]}
            analyticsSection="training"
          />
        </div>
      </section>

      {/* ── Plain search (for browsers) ──────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pb-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-base" style={{ color: 'var(--color-ink-accent)' }} aria-hidden="true">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) track({ name: 'search_performed', section: 'training', query: e.target.value });
                if (e.target.value.trim()) document.getElementById('all-resources')?.scrollIntoView({ behavior: 'smooth' });
              }}
              placeholder={`Or search ${STAT_TOTAL} courses by name, provider, topic or audience…`}
              aria-label="Search training resources"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-base font-sans outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)', color: 'var(--color-ink)' }}
            />
          </div>
        </div>
      </section>

      {/* ── VISUAL CATEGORY TILES — primary browse ───────────────────────────── */}
      <section className="px-5 sm:px-8 pb-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Browse by audience</SectionLabel>
          <h2 className="font-display text-2xl sm:text-3xl mb-6" style={{ color: 'var(--text)' }}>
            Who is the training for?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AUDIENCE_TILES.map(tile => {
              const active = audienceFilter === tile.value;
              return (
                <button
                  key={tile.value}
                  onClick={() => {
                    setAudienceFilter(tile.value);
                    track({ name: 'tool_filter_used', filterType: 'role', value: tile.value, pageType: 'training' });
                    document.getElementById('all-resources')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border p-5 flex flex-col items-center text-center gap-2.5 transition-shadow hover:shadow-md"
                  style={{
                    borderRadius: 4,
                    borderColor: active ? 'var(--color-ink)' : 'var(--color-rule)',
                    background: 'white',
                    color: 'var(--color-ink)',
                  }}
                  aria-pressed={active}
                >
                  <RoleIcon name={tile.icon} size={24} color="#1E1E1E" />
                  <span className="text-sm font-semibold font-sans" style={{ color: '#1E1E1E' }}>{tile.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Filterable main grid ──────────────────────────────────────────────── */}
      <section
        id="all-resources"
        className="px-5 sm:px-8 py-16"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-6xl mx-auto">
          <SectionLabel>All Resources</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl mb-8" style={{ color: 'var(--text)' }}>
            Browse all {STAT_TOTAL} training resources
          </h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            {/* Refine within results (kept in sync with the top discovery search) */}
            <input
              type="search"
              placeholder="Filter these resources…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={{
                borderColor: '#e8e6e0',
                background: 'white',
                color: 'var(--text)',
              }}
              aria-label="Filter training resources"
            />

            {/* Type tabs */}
            <div
              className="flex rounded-xl border overflow-hidden"
              style={{ borderColor: '#e8e6e0' }}
              role="group"
              aria-label="Filter by type"
            >
              {TYPE_TABS.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setTypeFilter(tab.value)}
                  className="font-sans px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: typeFilter === tab.value ? '#1E1E1E' : 'white',
                    color: typeFilter === tab.value ? 'var(--color-promptly-lime)' : '#6b6760',
                  }}
                  aria-pressed={typeFilter === tab.value}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role filter — session-persistent (cookie + role:changed), selected
              chip = ground-black fill / lime text (§09, no white-on-lime). */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by role">
            {ROLE_FILTERS.map(r => {
              const active = audienceFilter === r.value;
              return (
                <button
                  key={r.label}
                  onClick={() => {
                    setAudienceFilter(r.value);
                    setRole(r.slug); // cookie + role:changed broadcast
                    track({ name: 'tool_filter_used', filterType: 'role', value: r.label, pageType: 'training' });
                  }}
                  className="font-sans rounded-full px-3.5 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={active
                    ? { fontSize: 12, fontWeight: 500, background: '#1E1E1E', color: 'var(--color-promptly-lime)', borderColor: '#1E1E1E' }
                    : { fontSize: 12, fontWeight: 500, background: 'white', color: '#1E1E1E', borderColor: '#E8E4DC' }}
                  aria-pressed={active}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Showing {filtered.length} of {STAT_TOTAL} resources
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(item => (
                <TrainingCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg mb-2" style={{ color: '#6b6760' }}>
                No results found.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('All');
                  setAudienceFilter('All');
                }}
                className="text-sm font-semibold"
                style={{ color: 'var(--color-ink-accent)' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Comparison section ────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Quick Comparisons</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            Free vs Paid — what's right for you?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)' }}
            >
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-ink)' }}>
                Free courses
              </p>
              <ul className="space-y-2.5 text-sm" style={{ color: '#1c1a15' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-ink)' }}>✓</span>
                  UK Government-backed with no cost barrier
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-ink)' }}>✓</span>
                  Ideal for beginners exploring AI
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-ink)' }}>✓</span>
                  No time pressure — learn at your pace
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-ink)' }}>✓</span>
                  Good for CPD evidence in schools
                </li>
              </ul>
              <div className="mt-5">
                <Link
                  to="/ai-training/free"
                  className="text-sm font-semibold"
                  style={{ color: 'var(--color-ink)' }}
                >
                  View free resources →
                </Link>
              </div>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: AMBER_BORDER, background: AMBER_BG }}
            >
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: AMBER_TEXT }}>
                Paid courses
              </p>
              <ul className="space-y-2.5 text-sm" style={{ color: '#1c1a15' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: AMBER_TEXT }}>✓</span>
                  Recognised certificates for career progression
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: AMBER_TEXT }}>✓</span>
                  Structured learning with expert support
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: AMBER_TEXT }}>✓</span>
                  Deeper skills for intermediate–advanced learners
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: AMBER_TEXT }}>✓</span>
                  Worth it for career switchers and CPD leads
                </li>
              </ul>
              <div className="mt-5">
                <Link
                  to="/ai-training/paid"
                  className="text-sm font-semibold"
                  style={{ color: AMBER_TEXT }}
                >
                  View paid courses →
                </Link>
              </div>
            </div>
          </div>

          <h2 className="font-display text-3xl mb-6" style={{ color: 'var(--text)' }}>
            Beginner vs Intermediate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: 'var(--color-oat)', background: 'var(--color-oat)' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>
                Start as a Beginner if...
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#1c1a15' }}>
                <li>You are new to AI or have never used a tool like ChatGPT</li>
                <li>You want a plain-English overview of what AI is</li>
                <li>You are a parent, teacher or school leader starting from scratch</li>
              </ul>
            </div>
            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: 'var(--color-oat)', background: 'var(--color-oat)' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>
                Jump to Intermediate if...
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#1c1a15' }}>
                <li>You already use AI tools in your daily workflow</li>
                <li>You want to build prompts, workflows or automations</li>
                <li>You are ready to lead AI implementation in your school</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTAs ───────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Keep exploring</SectionLabel>
          <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>
            More resources from GetPromptly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <Link
              to="/tools"
              className="rounded-2xl border p-6 flex flex-col gap-2 transition-colors group"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-ink-accent)' }}>
                AI Tools
              </span>
              <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
                Explore AI tools →
              </h3>
              <p className="text-sm" style={{ color: '#6b6760' }}>
                Safe AI tools reviewed and rated for UK education settings.
              </p>
            </Link>
            <Link
              to="/equipment"
              className="rounded-2xl border p-6 flex flex-col gap-2 transition-colors"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-ink-accent)' }}>
                Equipment
              </span>
              <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
                Explore equipment →
              </h3>
              <p className="text-sm" style={{ color: '#6b6760' }}>
                Hardware, devices and accessibility equipment for AI-ready classrooms.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cross-sell recommendations ──────────────────────────────────────── */}
      {inlineItems.length > 0 && (
        <section className="px-5 sm:px-8 py-10" style={{ background: 'var(--bg)' }}>
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b6760' }}>
              You might also like
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {inlineItems.map(item => (
                <CrossSellCard key={item.id} item={item} sourceSection="training" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Dark CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="px-5 sm:px-8 py-20"
        style={{ background: '#111210' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>Ask the AI</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'white' }}>
            Get a personalised recommendation
          </h2>
          <p className="text-base mb-8" style={{ color: '#6b6760' }}>
            Tell the Luna what you're trying to achieve and it will suggest the best
            training path for your role and experience level.
          </p>
          <button
            className="font-sans px-6 py-3 rounded-full font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111210]"
            style={{ background: TEAL, color: '#1A1A0E' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
          >
            Ask Luna →
          </button>
        </div>
      </section>

      {/* Cross-sell popup */}
      {popupOpen && popupItems.length > 0 && (
        <CrossSellPopup
          items={popupItems}
          trigger={popupTrigger}
          sourceSection="training"
          onClose={closePopup}
        />
      )}
    </>
  );
}
