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
  PATHWAY_SENCO,
  PATHWAY_STUDENTS,
  PATHWAY_ADMIN,
  PATHWAY_SAFEGUARDING,
  PATHWAY_POLICY,
  type TrainingItem,
} from '../data/training';
import AgentCTACard from '../components/AgentCTACard';
import LeadMagnet from '../components/LeadMagnet';
import { useLeadCapture } from '../hooks/useLeadCapture';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { useCrossSell } from '../hooks/useCrossSell';
import { linkLabel, inferLinkType } from '../utils/linkType';
import { BubbleLayer } from '../components/Bubbles';

const TEAL = '#BEFF00';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

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

const AUDIENCE_PILLS: { label: string; value: AudienceFilter }[] = [
  { label: 'All',         value: 'All' },
  { label: 'Teachers',    value: 'Teachers' },
  { label: 'Parents',     value: 'Parents' },
  { label: 'Students',    value: 'Students' },
  { label: 'SEND',        value: 'SEND' },
  { label: 'Leaders',     value: 'Leaders' },
  { label: 'Admin',       value: 'Admin' },
];

// ─── Card component ───────────────────────────────────────────────────────────

function TrainingCard({ item }: { item: TrainingItem }) {
  const linkRel = item.affiliate
    ? 'noopener noreferrer sponsored'
    : 'noopener noreferrer';

  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ borderColor: '#ECE7DD', background: 'white' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: '#9C9690' }}
          >
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.type === 'Free' && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#f0fdf4', color: '#15803d' }}
              >
                Free
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

        <p className="text-sm leading-relaxed mb-3" style={{ color: '#4A4A4A' }}>
          {item.notes}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
            style={{ borderColor: '#ECE7DD', color: '#4A4A4A' }}
          >
            {item.level}
          </span>
          {item.duration && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
              style={{ borderColor: '#ECE7DD', color: '#4A4A4A' }}
            >
              {item.duration}
            </span>
          )}
          {item.certificate && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: '#fef3c7', color: '#92400e' }}
            >
              🎓 Certificate
            </span>
          )}
        </div>
      </div>

      <div
        className="px-5 pb-5 pt-3 border-t flex items-center justify-between gap-3"
        style={{ borderColor: '#f3f4f6' }}
      >
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
          {item.cost}
        </span>
        <div className="flex flex-col items-end gap-0.5">
          <a
            href={item.url}
            target="_blank"
            rel={linkRel}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: TEAL, color: '#0F1C1A' }}
          >
            {linkLabel(item.linkType ?? inferLinkType(item.url))} →
          </a>
          {item.affiliate && (
            <span className="text-[9px]" style={{ color: '#9C9690' }}>Affiliate link</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pathway card component ───────────────────────────────────────────────────
//
// Each pathway card is the same shape across desktop / tablet / mobile:
//   1. Resource-count chip + accent bar
//   2. Title (display font)
//   3. One-line description
//   4. Ordered resource list (numbered, scannable)
//   5. "Get the full learning pathway" inline email-capture
//
// All cards share the same background and border so the grid reads
// as a clean directory, not a rainbow of accent panels. The accent
// colour appears only on the chip, the bullet number and the link
// arrow — keeping density low and parity high across breakpoints.

interface PathwayCardProps {
  title: string;
  description: string;
  slugs: string[];
  to: string;
  /** Offer key — must exist in api/lead-capture.ts → offerContent. */
  offer: string;
  /** Role tag forwarded to the admin notification. */
  role: string;
  /** Single accent colour used for chip, number badges, link arrow. */
  accent: string;
}

function PathwayCard({
  title,
  description,
  slugs,
  to,
  offer,
  role,
  accent,
}: PathwayCardProps) {
  const items = slugs
    .map(s => TRAINING.find(t => t.slug === s))
    .filter(Boolean) as TrainingItem[];

  // Inline email capture wired through the shared hook.
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('promptly_email') || ''; } catch { return ''; }
  });
  const { submit, status, error } = useLeadCapture();
  const sending = status === 'sending';
  const success = status === 'success';
  const errored = status === 'error';

  const inputId = `pathway-email-${offer}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      email,
      offer,
      role,
      source: `ai-training-pathway:${offer}`,
    });
  };

  return (
    <article
      className="relative rounded-2xl border flex flex-col h-full overflow-hidden"
      style={{
        borderColor: '#ECE7DD',
        background: '#FFFFFF',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 24px rgba(15,28,26,0.06)',
      }}
    >
      {/* Accent bar */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
      />

      <div className="px-6 pt-6 pb-5 flex flex-col flex-1">
        {/* Eyebrow chip */}
        <span
          className="inline-flex self-start items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
          style={{ background: `${accent}1F`, color: '#0F1C1A' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: accent }}
            aria-hidden="true"
          />
          Pathway · {items.length} resources
        </span>

        <h3
          className="font-display text-xl leading-snug mb-2"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: '#4A4A4A' }}
        >
          {description}
        </p>

        {/* Ordered resource list */}
        <ol className="space-y-2 mb-5 flex-1" aria-label={`Resources in ${title}`}>
          {items.map((item, idx) => (
            <li key={item.slug} className="flex items-start gap-2.5 text-sm">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-px"
                style={{ background: `${accent}1F`, color: '#0F1C1A' }}
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <span className="leading-snug" style={{ color: '#1A1A1A' }}>
                <span className="font-semibold">{item.provider}</span>
                <span style={{ color: '#9C9690' }}> — {item.name}</span>
              </span>
            </li>
          ))}
        </ol>

        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70 mb-4"
          style={{ color: '#0F1C1A' }}
        >
          View full pathway
          <span aria-hidden="true" style={{ color: accent }}>→</span>
        </Link>

        {/* Email capture */}
        {success ? (
          <div
            className="rounded-xl border px-4 py-3 flex items-center gap-2.5"
            style={{
              borderColor: 'rgba(190,255,0,0.45)',
              background: 'rgba(190,255,0,0.12)',
              boxShadow: '0 0 0 1px rgba(190,255,0,0.18)',
            }}
            role="status"
            aria-live="polite"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ background: '#BEFF00', color: '#0F1C1A' }}
              aria-hidden="true"
            >
              ✓
            </span>
            <p className="text-xs font-semibold leading-snug" style={{ color: '#0F1C1A' }}>
              We&apos;ll send the <strong>{title}</strong> pathway to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-2 mt-auto">
            <label htmlFor={inputId} className="sr-only">Email address</label>
            <input
              id={inputId}
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={sending}
              aria-invalid={errored || undefined}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#BEFF00] focus:ring-2 focus:ring-[#BEFF00]"
              style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: '#0F1C1A' }}
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] disabled:opacity-60 disabled:translate-y-0 disabled:cursor-wait"
              style={{
                background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                color: '#0F1C1A',
                border: '1px solid rgba(15,28,26,0.16)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
              }}
            >
              {sending ? 'Sending…' : 'Get the full learning pathway →'}
            </button>
            {errored && (
              <p className="text-[11px] leading-snug" style={{ color: '#dc2626' }} role="alert">
                {error ?? 'Could not send. Email '}
                <a href="mailto:info@getpromptly.co.uk" className="underline font-semibold">
                  info@getpromptly.co.uk
                </a>{' '}
                and we&apos;ll send it by hand.
              </p>
            )}
            <p className="text-[10px]" style={{ color: '#9C9690' }}>
              Free. No spam. UK GDPR compliant.
            </p>
          </form>
        )}
      </div>
    </article>
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
        title={`AI Training Hub — ${STAT_TOTAL} Free & Paid Courses for UK Educators | GetPromptly`}
        description={`${STAT_TOTAL} free and paid AI training resources curated for UK teachers, parents, students and school leaders. Government-backed, certificate courses and specialist pathways.`}
        keywords="AI training UK, free AI courses teachers, AI courses education, AI skills hub, AI learning parents, SEND AI resources"
        path="/ai-training"
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-24 pb-16 px-5 sm:px-8"
        style={{ background: '#0F1C1A' }}
      >
        <BubbleLayer
          bubbles={[
            { variant: 'lime', size: 380, top: '-15%', left: '-8%', anim: 'gp-float-a' },
            { variant: 'cyan', size: 320, top: '20%', right: '-10%', anim: 'gp-float-b' },
            { variant: 'soft-purple', size: 240, bottom: '-15%', left: '50%', anim: 'gp-float-c' },
          ]}
        />
        <div className="relative max-w-4xl mx-auto z-10">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-6 px-3 py-1.5 rounded-full"
            style={{
              color: '#BEFF00',
              background: 'rgba(190,255,0,0.10)',
              border: '1px solid rgba(190,255,0,0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#BEFF00', boxShadow: '0 0 6px #BEFF00' }} aria-hidden="true" />
            AI Training Hub
          </span>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight mb-6" style={{ color: 'white' }}>
            Learn{' '}
            <em
              className="not-italic"
              style={{
                backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >AI.</em>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {STAT_TOTAL} free and paid resources curated for UK educators, parents, students
            and professionals. Government-backed, independently reviewed, trust-first.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total resources', value: STAT_TOTAL, accent: '#BEFF00' },
              { label: 'Completely free', value: STAT_FREE, accent: '#00D1FF' },
              { label: 'UK government-backed', value: STAT_UK_BACKED, accent: '#A78BFA' },
              { label: 'Certificate courses', value: STAT_CERTS, accent: '#FFEA00' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl p-5 text-center"
                style={{
                  background: 'linear-gradient(180deg, #142522 0%, #0F1C1A 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 18px rgba(0,0,0,0.30)',
                }}
              >
                <p className="font-display text-3xl mb-1" style={{ color: stat.accent }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent CTA ─────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <AgentCTACard
            section="Promptly AI · Learning Pathfinder"
            headline="Build my AI learning path."
            description="Tell us your role and experience level — our AI advisor will recommend the right courses, certifications and free resources for you."
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
      {/*
        Cards are reordered by usefulness so the most-requested pathways
        appear above the fold and casual visitors don't need to scroll
        through a 9-card wall to find theirs.

        Order rationale: Teachers (largest audience) → Leaders (decision
        makers) → SENCO → SEND → Safeguarding (statutory) → Policy →
        Subject Leads' adjacent (admin) → Parents → Students.

        Every card uses the same neutral white panel with a single accent
        line — no rainbow grid — so layout parity holds across desktop,
        tablet and mobile breakpoints.
      */}
      <section className="px-5 sm:px-8 py-16" style={{ background: '#F8F5F0' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Curated Pathways</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text)' }}>
            Guided learning paths
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: '#4A4A4A' }}>
            We&apos;ve sequenced the best resources into focused pathways for each audience.
            Pick yours, drop your email, and we&apos;ll send the full ordered learning path to your inbox.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <PathwayCard
              title="AI for Teachers Starter Path"
              description="From understanding what AI is to using it safely in the classroom. Government-backed resources plus Google and Microsoft essentials."
              slugs={PATHWAY_TEACHERS}
              to="/ai-training/teachers"
              offer="teacher-learning-pathway"
              role="Teacher"
              accent="#BEFF00"
            />
            <PathwayCard
              title="School Leadership AI Readiness"
              description="For headteachers and governors: policy, implementation, safeguarding and whole-school CPD planning."
              slugs={PATHWAY_LEADERS}
              to="/ai-training/leaders"
              offer="leader-learning-pathway"
              role="School Leader"
              accent="#A78BFA"
            />
            <PathwayCard
              title="SENCO AI Toolkit"
              description="SEND-specialist resources for SENCOs covering assistive tech, AAC, autism support and EHCP documentation."
              slugs={PATHWAY_SENCO}
              to="/ai-training/send"
              offer="senco-learning-pathway"
              role="SENCO"
              accent="#00D1FF"
            />
            <PathwayCard
              title="Accessible AI for SEND"
              description="Resources that work for learners with disabilities, focusing on accessibility features, screen readers and neurodiversity."
              slugs={PATHWAY_SEND}
              to="/ai-training/send"
              offer="send-learning-pathway"
              role="SEND Lead"
              accent="#FFEA00"
            />
            <PathwayCard
              title="AI Safeguarding Path"
              description="Essential reading for DSLs and SLT: KCSIE 2024, JCQ policy, online harms and AI risk management."
              slugs={PATHWAY_SAFEGUARDING}
              to="/ai-training/leaders"
              offer="safeguarding-learning-pathway"
              role="DSL"
              accent="#BEFF00"
            />
            <PathwayCard
              title="AI Policy & Governance"
              description="For policy leads: ICO guidance, Ofqual AI integrity, ASCL briefings and building a whole-school AI policy."
              slugs={PATHWAY_POLICY}
              to="/ai-training/leaders"
              offer="policy-learning-pathway"
              role="Policy Lead"
              accent="#A78BFA"
            />
            <PathwayCard
              title="AI Productivity for Admin Teams"
              description="Practical training for school business managers and admin staff on AI in Microsoft 365, Google Workspace and GDPR."
              slugs={PATHWAY_ADMIN}
              to="/ai-training"
              offer="admin-learning-pathway"
              role="Admin"
              accent="#00D1FF"
            />
            <PathwayCard
              title="AI Safety for Parents"
              description="Practical guidance on AI at home, keeping children safe online, and understanding AI tools your children may use."
              slugs={PATHWAY_PARENTS}
              to="/ai-training/parents"
              offer="parent-learning-pathway"
              role="Parent"
              accent="#FFEA00"
            />
            <PathwayCard
              title="AI Literacy for Students"
              description="Age-appropriate resources helping students understand how AI works, stay safe online and use AI tools responsibly."
              slugs={PATHWAY_STUDENTS}
              to="/ai-training/students"
              offer="student-learning-pathway"
              role="Student"
              accent="#BEFF00"
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
                borderColor: '#ECE7DD',
                background: 'white',
                color: 'var(--text)',
              }}
              aria-label="Search training resources"
            />

            {/* Type tabs */}
            <div
              className="flex rounded-xl border overflow-hidden"
              style={{ borderColor: '#ECE7DD' }}
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
                    color: typeFilter === tab.value ? 'white' : '#4A4A4A',
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
                  borderColor: audienceFilter === pill.value ? TEAL : '#ECE7DD',
                  background: audienceFilter === pill.value ? TEAL : 'white',
                  color: audienceFilter === pill.value ? 'white' : '#4A4A4A',
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
              <p className="text-lg mb-2" style={{ color: '#4A4A4A' }}>
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
              <ul className="space-y-2.5 text-sm" style={{ color: '#1A1A1A' }}>
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
              <ul className="space-y-2.5 text-sm" style={{ color: '#1A1A1A' }}>
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
              <ul className="space-y-2 text-sm" style={{ color: '#1A1A1A' }}>
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
              <ul className="space-y-2 text-sm" style={{ color: '#1A1A1A' }}>
                <li>You already use AI tools in your daily workflow</li>
                <li>You want to build prompts, workflows or automations</li>
                <li>You are ready to lead AI implementation in your school</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pathway lead magnet ───────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <LeadMagnet
            eyebrow="Free CPD pack"
            headline="Get the full learning pathway"
            description={
              <>
                Pick up where you left off. We&apos;ll email you a structured 6-step pathway — free DfE-backed courses, premium certificates, prompt packs and equipment links — built around your role. Print it, share it with SLT, use it for performance reviews.
              </>
            }
            buttonLabel="Get the full learning pathway →"
            analyticsSection="ai-training-pathway-bottom"
            offer="teacher-learning-pathway"
            successMessage={<>Sending your full learning pathway now — check your inbox.</>}
          />
        </div>
      </section>

      {/* ── Bottom CTAs ───────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pt-4 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Keep exploring</SectionLabel>
          <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>
            More resources from GetPromptly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <Link
              to="/tools"
              className="rounded-2xl border p-6 flex flex-col gap-2 transition-colors group"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: TEAL }}>
                AI Tools
              </span>
              <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
                Explore AI tools →
              </h3>
              <p className="text-sm" style={{ color: '#4A4A4A' }}>
                Safe AI tools reviewed and rated for UK education settings.
              </p>
            </Link>
            <Link
              to="/equipment"
              className="rounded-2xl border p-6 flex flex-col gap-2 transition-colors"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: TEAL }}>
                Equipment
              </span>
              <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
                Explore equipment →
              </h3>
              <p className="text-sm" style={{ color: '#4A4A4A' }}>
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
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#9C9690' }}>
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

      {/* ── Dark promotional CTA ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 sm:px-8 py-20"
        style={{ background: 'linear-gradient(180deg, #0F1C1A 0%, #142522 60%, #1B302C 100%)' }}
      >
        <div className="relative max-w-3xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-5"
            style={{ background: 'rgba(190,255,0,0.18)', color: '#BEFF00' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#BEFF00', boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
              aria-hidden="true"
            />
            Personalised CPD
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight" style={{ color: '#FFFFFF' }}>
            Tell us your role —{' '}
            <span
              className="italic"
              style={{
                backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              we'll plot your path.
            </span>
          </h2>
          <p className="text-base sm:text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Promptly AI knows every course in this directory. Tell it your role, experience level and time budget — it will sequence a free + paid pathway you can actually finish.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="px-6 py-3.5 rounded-xl text-sm font-bold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              style={{
                background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                color: '#0F1C1A',
                border: '1px solid rgba(15,28,26,0.16)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
              }}
            >
              Ask Promptly AI for my pathway →
            </button>
            <Link
              to="/schools#consultation"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Request a school consultation →
            </Link>
          </div>
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
