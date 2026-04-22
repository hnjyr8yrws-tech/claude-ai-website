import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import {
  TRAINING,
  PATHWAY_TEACHERS,
  PATHWAY_PARENTS,
  PATHWAY_SEND,
  PATHWAY_LEADERS,
  type TrainingItem,
} from '../data/training';

const TEAL = '#00808a';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

// ─── Derived stats ────────────────────────────────────────────────────────────

const STAT_TOTAL       = TRAINING.length;
const STAT_FREE        = TRAINING.filter(t => t.type === 'Free').length;
const STAT_UK_BACKED   = TRAINING.filter(t => t.ukRelevant && t.provider.toLowerCase().includes('government') || t.provider === 'GOV.UK').length;
const STAT_CERTS       = TRAINING.filter(t => t.affiliate && t.type === 'Paid').length;

// ─── Filter types ─────────────────────────────────────────────────────────────

type TypeFilter     = 'All' | 'Free' | 'Paid';
type AudienceFilter = 'All' | 'Teachers' | 'Parents' | 'Students' | 'SEND' | 'Leaders';

const TYPE_TABS: { label: string; value: TypeFilter }[] = [
  { label: 'All',  value: 'All' },
  { label: 'Free', value: 'Free' },
  { label: 'Paid', value: 'Paid' },
];

const AUDIENCE_PILLS: { label: string; value: AudienceFilter }[] = [
  { label: 'All',         value: 'All' },
  { label: 'Teachers',    value: 'Teachers' },
  { label: 'Parents',     value: 'Parents' },
  { label: 'Students',    value: 'Students' },
  { label: 'SEND',        value: 'SEND' },
  { label: 'Leaders',     value: 'Leaders' },
];

// ─── Card component ───────────────────────────────────────────────────────────

function TrainingCard({ item }: { item: TrainingItem }) {
  const linkRel = item.affiliate
    ? 'noopener noreferrer sponsored'
    : 'noopener noreferrer';

  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: '#c5c2bb' }}
          >
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.type === 'Free' ? (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#f0fdf4', color: '#15803d' }}
              >
                Free
              </span>
            ) : (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#fffbeb', color: '#92400e' }}
              >
                Paid
              </span>
            )}
            {item.ukRelevant && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#e0f2fe', color: '#0369a1' }}
              >
                UK
              </span>
            )}
            {item.affiliate && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#f5f3ff', color: '#7c3aed' }}
              >
                Partner
              </span>
            )}
          </div>
        </div>

        <h3
          className="font-display text-lg leading-snug mb-0.5"
          style={{ color: 'var(--text)' }}
        >
          {item.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
          {item.provider}
        </p>

        <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>
          {item.notes}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
            style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
          >
            {item.level}
          </span>
        </div>
      </div>

      <div
        className="px-5 pb-5 pt-3 border-t flex items-center justify-between gap-3"
        style={{ borderColor: '#f3f4f6' }}
      >
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
          {item.cost}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel={linkRel}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: TEAL, color: 'white' }}
        >
          Visit →
        </a>
      </div>
    </div>
  );
}

// ─── Pathway card component ───────────────────────────────────────────────────

interface PathwayCardProps {
  title: string;
  description: string;
  slugs: string[];
  to: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

function PathwayCard({
  title,
  description,
  slugs,
  to,
  accentBg,
  accentText,
  accentBorder,
}: PathwayCardProps) {
  const items = slugs
    .map(s => TRAINING.find(t => t.slug === s))
    .filter(Boolean) as TrainingItem[];

  return (
    <div
      className="rounded-2xl border flex flex-col p-6"
      style={{ borderColor: accentBorder, background: accentBg }}
    >
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentText }}>
        Pathway · {items.length} resources
      </p>
      <h3 className="font-display text-xl leading-snug mb-2" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b6760' }}>
        {description}
      </p>
      <ul className="space-y-1.5 mb-5 flex-1">
        {items.map(item => (
          <li key={item.slug} className="flex items-center gap-2 text-sm" style={{ color: '#1c1a15' }}>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: accentText }}
              aria-hidden="true"
            />
            <span className="font-medium">{item.provider}</span>
            <span style={{ color: '#9ca3af' }}>— {item.name}</span>
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-sm font-semibold rounded-lg transition-colors self-start"
        style={{ color: accentText }}
      >
        View pathway →
      </Link>
    </div>
  );
}

// ─── Horizontal scroll section ────────────────────────────────────────────────

function FeaturedSection({ title, items }: { title: string; items: TrainingItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl mb-4" style={{ color: 'var(--text)' }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map(item => (
          <TrainingCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AITraining() {
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>('All');
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('All');
  const [search, setSearch]             = useState('');

  // Featured collections — not filtered by state
  const bestFreeUK = useMemo(
    () => TRAINING.filter(t => t.ukRelevant && t.type === 'Free').slice(0, 4),
    [],
  );
  const bestTeachers = useMemo(
    () => TRAINING.filter(t => t.tags.includes('Teachers')),
    [],
  );
  const bestParents = useMemo(
    () => TRAINING.filter(t => t.tags.includes('Parents')),
    [],
  );
  const paidAffiliate = useMemo(
    () => TRAINING.filter(t => t.type === 'Paid' && t.affiliate),
    [],
  );

  // Main filterable grid
  const filtered = useMemo(() => {
    return TRAINING.filter(item => {
      if (typeFilter !== 'All' && item.type !== typeFilter) return false;
      if (audienceFilter !== 'All' && !item.tags.includes(audienceFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.provider.toLowerCase().includes(q) &&
          !item.notes.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [typeFilter, audienceFilter, search]);

  return (
    <>
      <SEO
        title="AI Training Hub — Free & Paid Courses for UK Educators | GetPromptly"
        description="26 free and paid AI training resources curated for UK teachers, parents, students and school leaders. Government-backed, certificate courses and specialist pathways."
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
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            Learn{' '}
            <span style={{ color: TEAL }}>AI.</span>
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
              { label: 'UK government-backed', value: 4 },
              { label: 'Certificate courses', value: STAT_CERTS },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border p-5 text-center"
                style={{ borderColor: '#e8e6e0', background: 'white' }}
              >
                <p className="font-display text-3xl mb-1" style={{ color: TEAL }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Amber CTA strip ─────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            style={{ background: AMBER_BG, borderColor: AMBER_BORDER }}
          >
            <p className="text-sm font-semibold" style={{ color: AMBER_TEXT }}>
              Not sure where to start?
            </p>
            <button
              className="text-sm font-bold px-4 py-2 rounded-lg border transition-colors self-start sm:self-auto"
              style={{ background: 'white', borderColor: AMBER_BORDER, color: AMBER_TEXT }}
              onClick={() => {
                const w = document.querySelector<HTMLButtonElement>('[data-agent-trigger]');
                if (w) w.click();
              }}
            >
              Ask the AI for a personalised training recommendation →
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured sections ────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <FeaturedSection title="Best free UK-backed training" items={bestFreeUK} />
          <FeaturedSection title="Best for teachers" items={bestTeachers} />
          <FeaturedSection title="Best for parents &amp; families" items={bestParents} />
          <FeaturedSection title="Paid &amp; premium courses" items={paidAffiliate} />
        </div>
      </section>

      {/* ── Pathways ─────────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-16" style={{ background: '#f0f4f5' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Curated Pathways</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text)' }}>
            Guided learning paths
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: '#6b6760' }}>
            We've sequenced the best resources into focused pathways for each audience. Start
            anywhere — each path is independently completable.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PathwayCard
              title="AI for Teachers Starter Path"
              description="From understanding what AI is to using it safely in the classroom. Government-backed resources plus Google and Microsoft essentials."
              slugs={PATHWAY_TEACHERS}
              to="/ai-training/teachers"
              accentBg="#f0fdf4"
              accentText="#15803d"
              accentBorder="#bbf7d0"
            />
            <PathwayCard
              title="AI Safety for Parents"
              description="Practical guidance on AI at home, keeping children safe online, and understanding AI tools your children may use."
              slugs={PATHWAY_PARENTS}
              to="/ai-training/parents"
              accentBg={AMBER_BG}
              accentText={AMBER_TEXT}
              accentBorder={AMBER_BORDER}
            />
            <PathwayCard
              title="Accessible AI for SEND"
              description="Resources that work for learners with disabilities, focusing on accessibility features, screen readers and neurodiversity."
              slugs={PATHWAY_SEND}
              to="/ai-training/send"
              accentBg="#eff6ff"
              accentText="#1d4ed8"
              accentBorder="#bfdbfe"
            />
            <PathwayCard
              title="School Leadership AI Readiness"
              description="For headteachers and governors: policy, implementation, safeguarding and whole-school CPD planning."
              slugs={PATHWAY_LEADERS}
              to="/ai-training/leaders"
              accentBg="#111210"
              accentText="#00808a"
              accentBorder="#1f2937"
            />
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
            {/* Search */}
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
              style={{
                borderColor: '#e8e6e0',
                background: 'white',
                color: 'var(--text)',
              }}
              aria-label="Search training resources"
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
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: typeFilter === tab.value ? TEAL : 'white',
                    color: typeFilter === tab.value ? 'white' : '#6b6760',
                  }}
                  aria-pressed={typeFilter === tab.value}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience pills */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by audience">
            {AUDIENCE_PILLS.map(pill => (
              <button
                key={pill.value}
                onClick={() => setAudienceFilter(pill.value)}
                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={{
                  borderColor: audienceFilter === pill.value ? TEAL : '#e8e6e0',
                  background: audienceFilter === pill.value ? TEAL : 'white',
                  color: audienceFilter === pill.value ? 'white' : '#6b6760',
                }}
                aria-pressed={audienceFilter === pill.value}
              >
                {pill.label}
              </button>
            ))}
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
                style={{ color: TEAL }}
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
              style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
            >
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#15803d' }}>
                Free courses
              </p>
              <ul className="space-y-2.5 text-sm" style={{ color: '#1c1a15' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#15803d' }}>✓</span>
                  UK Government-backed with no cost barrier
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#15803d' }}>✓</span>
                  Ideal for beginners exploring AI
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#15803d' }}>✓</span>
                  No time pressure — learn at your pace
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#15803d' }}>✓</span>
                  Good for CPD evidence in schools
                </li>
              </ul>
              <div className="mt-5">
                <Link
                  to="/ai-training/free"
                  className="text-sm font-semibold"
                  style={{ color: '#15803d' }}
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
              style={{ borderColor: '#e0f2fe', background: '#f0f9ff' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: '#0369a1' }}>
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
              style={{ borderColor: '#e0e7ff', background: '#eef2ff' }}
            >
              <p className="text-sm font-bold mb-3" style={{ color: '#4338ca' }}>
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
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: TEAL }}>
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
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: TEAL }}>
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
            Tell the Promptly AI what you're trying to achieve and it will suggest the best
            training path for your role and experience level.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: TEAL }}
            onClick={() => {
              const w = document.querySelector<HTMLButtonElement>('[data-agent-trigger]');
              if (w) w.click();
            }}
          >
            Ask the Promptly AI →
          </button>
        </div>
      </section>
    </>
  );
}
