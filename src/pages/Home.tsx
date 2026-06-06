/**
 * Home.tsx — GetPromptly.co.uk
 * Redesigned homepage: role-first, warm, guided.
 */

import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { PillarCard } from '../components/trust/PillarCard';
import { getPublicScore } from '../data/publicPillars';
import { getRole, setRole, ROLE_CHANGED } from '../utils/role';
import { RoleIcon, CategoryIcon } from '../components/icons';

const TEAL   = 'var(--color-promptly-lime)';
const DARK   = '#111210';
const BG     = '#f7f6f2';
const BORDER = '#e8e6e0';

function openWidget() {
  const btn = document.getElementById('promptly-widget-trigger');
  if (btn) (btn as HTMLButtonElement).click();
}

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >{children}</motion.div>
  );
}

// ─── Role data ─────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: 'teacher',
    label: 'Teacher',
    emoji: '\u{1F4DA}',
    color: 'var(--color-oat)',
    tagline: 'Save hours every week',
    desc: 'Lesson plans, differentiation, marking feedback, CPD and classroom-safe AI tools.',
    to: '/prompts/teachers',
    pills: ['Lesson plans', 'Marking', 'Differentiation', 'CPD'],
    tools: ['MagicSchool', 'Curipod', 'Canva AI'],
  },
  {
    id: 'leader',
    label: 'School Leader',
    emoji: '\u{1F3EB}',
    color: 'var(--color-oat)',
    tagline: 'Lead with confidence',
    desc: 'AI strategy, Ofsted prep, staff comms, policy drafting and school improvement prompts.',
    to: '/prompts/school-leaders',
    pills: ['AI policy', 'Ofsted prep', 'Staff comms', 'Strategy'],
    tools: ['Microsoft Copilot', 'Gemini', 'ChatGPT'],
  },
  {
    id: 'senco',
    label: 'SENCO',
    emoji: '\u{1F91D}',
    color: 'var(--color-oat)',
    tagline: 'SEND-specific guidance',
    desc: 'EHCP support, SEND reviews, assistive technology and provision mapping prompts.',
    to: '/prompts/senco',
    pills: ['EHCP', 'SEND reviews', 'Assistive tech', 'Provision maps'],
    tools: ['Claro', 'Speechify', 'Immersive Reader'],
  },
  {
    id: 'parent',
    label: 'Parent',
    emoji: '\u{1F3E0}',
    color: 'var(--color-oat)',
    tagline: 'Support at home',
    desc: 'Homework help, revision support, school communication and SEN advocacy prompts.',
    to: '/prompts/parents',
    pills: ['Homework help', 'Revision', 'SEN support', 'Comms'],
    tools: ['Khan Academy', 'Duolingo', 'Quizlet'],
  },
  {
    id: 'student',
    label: 'Student',
    emoji: '\u{1F393}',
    color: 'var(--color-oat)',
    tagline: 'Study smarter',
    desc: 'Essay writing, exam prep, revision prompts and study skill techniques.',
    to: '/prompts/students',
    pills: ['Essay writing', 'Revision', 'Exam prep', 'Study skills'],
    tools: ['Quizlet', 'Notion AI', 'Khan Academy'],
  },
  {
    id: 'admin',
    label: 'School Admin',
    emoji: '\u{1F4CB}',
    color: 'var(--color-oat)',
    tagline: 'Cut admin time',
    desc: 'Letters, templates, timetabling, data and communication prompts for office staff.',
    to: '/prompts/admin',
    pills: ['Letters', 'Templates', 'Timetabling', 'Reports'],
    tools: ['ChatGPT', 'Gemini', 'Microsoft Copilot'],
  },
];

// ─── 1. Hero (dark, Luna-led — §17 dark hero, §09 lime on ground-black) ─────────

const HERO_ROLES = [
  { label: 'Teacher',       slug: 'teacher',       luna: 'teacher' },
  { label: 'SENCO',         slug: 'senco',         luna: 'SENCO' },
  { label: 'School Leader', slug: 'school-leader', luna: 'school leader' },
  { label: 'Parent',        slug: 'parent',        luna: 'parent' },
  { label: 'Student',       slug: 'student',       luna: 'student' },
  { label: 'Admin',         slug: 'admin',         luna: 'school administrator' },
] as const;

/** Open the Luna chat widget, optionally pre-filling a starter prompt. */
function openLunaWith(prompt?: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  if (prompt && prompt.trim()) {
    // Small delay so the widget mounts before the starter event fires.
    setTimeout(() => window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt })), 120);
  }
}

const Hero: FC = () => {
  // Role state is shared site-wide via the role cookie + `role:changed` event
  // (see utils/role). The hero chips and the nav role strip stay in lockstep.
  const [roleSlug, setRoleSlug] = useState<string>(() => getRole());
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const sync = (e: Event) => setRoleSlug((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, sync);
    return () => window.removeEventListener(ROLE_CHANGED, sync);
  }, []);

  const selected = HERO_ROLES.find(r => r.slug === roleSlug);

  const askLuna = () => {
    track({ name: 'cta_clicked', section: 'home-hero', label: 'Tell Luna your role' });
    openLunaWith(selected ? `I am a ${selected.luna}, help me find ` : undefined);
  };

  const sendDraft = () => {
    track({ name: 'agent_opened', section: 'home-hero-panel' });
    openLunaWith(draft.trim() || (selected ? `I am a ${selected.luna}, help me find ` : undefined));
  };

  return (
    <section className="relative" style={{ background: 'var(--color-ground-black)' }}>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">

        {/* Trust-trio stamp — JetBrains Mono 11px, fog */}
        <p className="font-mono mb-10" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--color-fog)' }}>
          KCSIE-AWARE · UK GDPR-AWARE · INDEPENDENT
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-stretch">

          {/* ── Left column (≈60%) ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display leading-[1.05]" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 400, color: '#FFFFFF' }}>
              Stop Guessing with AI.<br />
              <em className="italic" style={{ color: TEAL, fontStyle: 'italic' }}>Start Getting Promptly.</em>
            </h1>

            {/* Plain Verdict — Satoshi 16px, fog */}
            <p className="font-sans mt-6 max-w-md" style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-fog)' }}>
              The UK's independent guide to AI in education — every tool scored against KCSIE 2025.
            </p>

            {/* Role chips — Satoshi Medium 13px, white border on dark */}
            <div className="flex flex-wrap gap-2 mt-8">
              {HERO_ROLES.map(r => {
                const active = roleSlug === r.slug;
                return (
                  <Link
                    key={r.slug}
                    to={`/role/${r.slug}`}
                    onClick={() => {
                      setRole(r.slug);            // cookie + role:changed broadcast
                      setRoleSlug(r.slug);
                      track({ name: 'role_selected', role: r.label, pageType: 'home' });
                    }}
                    className="font-sans rounded-full px-4 py-2 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                    style={{
                      fontSize: 13, fontWeight: 500,
                      color: active ? '#1A1A0E' : '#FFFFFF',
                      background: active ? TEAL : 'transparent',
                      borderColor: active ? TEAL : 'rgba(255,255,255,0.35)',
                    }}
                    aria-current={active ? 'true' : undefined}
                  >
                    {r.label}
                  </Link>
                );
              })}
            </div>

            {/* Primary CTA — lime fill, ink text, Satoshi Medium pill */}
            <button
              onClick={askLuna}
              className="font-sans mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]"
              style={{ fontSize: 15, fontWeight: 500, background: TEAL, color: '#1A1A0E' }}
            >
              Tell Luna your role &rarr;
            </button>
          </motion.div>

          {/* ── Right column (≈40%) — Luna panel: full height, lime left rule ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
            className="flex flex-col p-7"
            style={{ background: '#2A2A2A', borderLeft: '1px solid #C8E44A', borderRadius: 0 }}
          >
            {/* Header — animated green pulse dot + "Luna" (Fraunces 28px) + lime online tag */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex-shrink-0" style={{ width: 10, height: 10 }} aria-hidden="true">
                <span className="absolute inset-0 rounded-full" style={{ background: '#22C55E' }} />
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: '#22C55E' }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </span>
              <span className="font-display" style={{ fontSize: 28, fontWeight: 400, color: '#FFFFFF', lineHeight: 1 }}>Luna</span>
              <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.08em', color: TEAL }}>· Online 24/7</span>
            </div>

            {/* Subtitle — Plain Verdict variant: Fraunces italic 20px, lime on dark */}
            <p className="font-display italic mt-4" style={{ fontStyle: 'italic', fontSize: 20, lineHeight: 1.4, color: TEAL }}>
              Tell me your role — I'll find what you need.
            </p>

            {/* Role quick-select — 2×3 grid */}
            <p className="font-sans mt-7" style={{ fontSize: 13, fontWeight: 500, color: '#9C9C8A' }}>I am a...</p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {HERO_ROLES.map(r => {
                const active = roleSlug === r.slug;
                return (
                  <button
                    key={r.slug}
                    onClick={() => {
                      setRole(r.slug);          // cookie + role:changed broadcast
                      setRoleSlug(r.slug);
                      track({ name: 'role_selected', role: r.label, pageType: 'home' });
                    }}
                    aria-pressed={active}
                    className="font-sans border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                    style={{
                      fontSize: 12, fontWeight: 500, padding: '8px 10px', borderRadius: 20,
                      color: active ? '#1A1A0E' : '#FFFFFF',
                      background: active ? TEAL : 'transparent',
                      borderColor: active ? TEAL : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* Input — dark, lime focus border */}
            <input
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendDraft(); }}
              onFocus={e => { e.currentTarget.style.borderColor = '#C8E44A'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#3A3A3A'; }}
              placeholder="Or describe what you need..."
              aria-label="Describe what you need"
              className="font-sans w-full mt-5 outline-none"
              style={{ fontSize: 14, padding: '12px 14px', background: '#1E1E1E', color: '#FFFFFF', border: '1px solid #3A3A3A', borderRadius: 6 }}
            />

            {/* Send button — full width, height 44, radius 6 */}
            <button
              onClick={sendDraft}
              className="font-sans w-full mt-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2A2A]"
              style={{ height: 44, fontSize: 14, fontWeight: 500, background: TEAL, color: '#1A1A0E', borderRadius: 6 }}
            >
              Ask Luna &rarr;
            </button>

            {/* Footer — agent ID, methodology register */}
            <p className="font-mono mt-auto pt-7" style={{ fontSize: 10, letterSpacing: '0.1em', color: '#9C9C8A' }}>
              LUNA · GETPROMPTLY AGENT · V2.1
            </p>
          </motion.div>
        </div>

        {/* Honest mark — no fabricated reviewer/date/version while scores are re-reviewed */}
        <p className="font-mono mt-12" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--color-fog)' }}>
          INDEPENDENT · KCSIE-AWARE · NO PAID PLACEMENTS
        </p>
      </div>
    </section>
  );
};

// ─── 2. Trust strip ────────────────────────────────────────────────────────────

const TrustStrip: FC = () => (
  <div style={{ background: 'white', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-5 sm:gap-10">
      {['KCSIE-aware', 'UK GDPR-aware', '100% Independent', 'No Sponsored Rankings', 'Free to use'].map(label => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#9ca3af' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  </div>
);

// ─── 3. Role Selector ─────────────────────────────────────────────────────────

const RoleSelector: FC = () => {
  const [active, setActive] = useState('teacher');
  const role = ROLES.find(r => r.id === active)!;

  return (
    <section id="role-selector" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-accent)' }}>Start here</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: '#1c1a15' }}>Which role are you?</h2>
          <p className="text-sm mb-10 max-w-lg" style={{ color: '#6b6760' }}>
            Choose your role and we will show you exactly where to start on GetPromptly.
          </p>
        </FadeIn>

        <div className="flex flex-wrap gap-2 mb-8">
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => { setActive(r.id); track({ name: 'filter_applied', section: 'home-roles', filter: 'role', value: r.label }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={active === r.id
                ? { background: TEAL, color: '#1A1A0E', borderColor: TEAL }
                : { background: 'white', color: '#6b6760', borderColor: BORDER }
              }
              aria-pressed={active === r.id}
            >
              <RoleIcon name={r.id} size={20} color={active === r.id ? '#1A1A0E' : '#6b6760'} />
              {r.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl p-7 flex flex-col justify-between" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {/* §12: outline icon, no coloured container (retired AI-startup pattern) */}
                  <RoleIcon name={role.id} size={24} color="#1E1E1E" />
                  <div>
                    <p className="font-semibold text-base" style={{ color: '#1c1a15' }}>{role.label}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--color-ink-accent)' }}>{role.tagline}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#6b6760' }}>{role.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {role.pills.map(p => (
                    <span key={p} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: role.color, color: '#1c1a15' }}>{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={role.to} onClick={() => track({ name: 'cta_clicked', section: 'home-roles', label: `${role.label} prompts` })}
                  className="flex-1 text-center px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{ background: TEAL, color: '#1A1A0E' }}>
                  See {role.label} prompts &rarr;
                </Link>
                <Link to="/tools" onClick={() => track({ name: 'cta_clicked', section: 'home-roles', label: `${role.label} tools` })}
                  className="flex-1 text-center px-5 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[#f7f6f2]"
                  style={{ borderColor: BORDER, color: '#6b6760' }}>
                  Browse safe tools &rarr;
                </Link>
              </div>
            </div>

            <div className="rounded-2xl p-5 flex flex-col" style={{ background: DARK, border: '1px solid #2a2825' }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#4b5563' }}>
                Top tools for {role.label}s
              </p>
              <div className="flex-1 space-y-3">
                {role.tools.map((t, i) => (
                  <div key={t} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#1a1815' }}>
                    <span className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,228,74,0.2)', color: TEAL }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium flex-1" style={{ color: '#d1cec8' }}>{t}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(200,228,74,0.14)', color: 'var(--color-promptly-lime)' }}>Safe</span>
                  </div>
                ))}
              </div>
              <Link to="/tools" onClick={() => track({ name: 'cta_clicked', section: 'home-roles-tools', label: 'View all tools' })}
                className="mt-5 text-center text-xs font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-80"
                style={{ background: 'rgba(200,228,74,0.15)', color: TEAL }}>
                View all 155 tools &rarr;
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ─── 4. How it works ──────────────────────────────────────────────────────────

const HOW_STEPS = [
  { n: '01', title: 'Select your role', desc: 'Tell us whether you are a teacher, leader, SENCO, parent or student. The platform adapts to you.' },
  { n: '02', title: 'Browse curated content', desc: 'Every tool, course, product and prompt is reviewed against UK safety and education standards.' },
  { n: '03', title: 'Check UK safety scores', desc: 'Our 5-pillar scoring covers data privacy, safeguarding, age suitability, transparency and accessibility.' },
  { n: '04', title: 'Copy prompts instantly', desc: 'Paste any prompt into Claude, ChatGPT or Gemini. No account needed, no setup required.' },
  { n: '05', title: 'Ask the 24/7 agent', desc: 'Our AI agent answers questions, compares options and recommends next steps in real time, free.' },
];

const HowItWorks: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-accent)' }}>How it works</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: '#1c1a15' }}>GetPromptly guides you end to end.</h2>
        <p className="text-sm mb-12 max-w-lg" style={{ color: '#6b6760' }}>
          From choosing your role to copying your first prompt, everything is designed to save time and give you confidence.
        </p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {HOW_STEPS.map((step, i) => (
          <FadeIn key={step.n} delay={i * 0.07}>
            <div className="rounded-2xl p-5 h-full flex flex-col" style={{ background: BG, border: `1px solid ${BORDER}` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(200,228,74,0.1)', color: 'var(--color-ink-accent)' }}>
                  {step.n}
                </div>
                <span className="font-display text-2xl leading-none" style={{ color: BORDER }} aria-hidden="true">{step.n}</span>
              </div>
              <p className="font-semibold text-sm mb-2" style={{ color: '#1c1a15' }}>{step.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6b6760' }}>{step.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 5. How we score (light §F5F2EC section — the Pillar Card artefact) ────────

// Fixed §04 order, top-clockwise: Privacy → Safeguarding → Age → Transparency →
// Accessibility. Each row's dot uses the pillar's reserved §09 colour.
const SCORE_PILLARS = [
  { name: 'Data Privacy',   colour: 'var(--color-pillar-privacy)',       desc: 'UK GDPR posture, data residency and parental-consent mechanisms.' },
  { name: 'Safeguarding',   colour: 'var(--color-pillar-safeguarding)',  desc: 'KCSIE 2025 alignment, DSL controls and reporting pathways.' },
  { name: 'Age Suitability',colour: 'var(--color-pillar-age)',           desc: 'Age-gating, content moderation and minimum-age policy.' },
  { name: 'Transparency',   colour: 'var(--color-pillar-transparency)',  desc: 'Clear AI disclosure, hallucination warnings and explainability.' },
  { name: 'Accessibility',  colour: 'var(--color-pillar-accessibility)', desc: 'WCAG 2.2 AA alignment, SEND adaptations and assistive-tech support.' },
];

const ScoringPreview: FC = () => (
  <section style={{ background: 'var(--color-oat)' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <FadeIn>
        {/* Section label — JetBrains Mono 11px */}
        <p className="font-mono mb-8" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--color-fog)' }}>
          HOW WE SCORE EVERY TOOL
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center">
        {/* Pillar Card — the signature §04 artefact, 240px, computed arcs, flat colour */}
        <FadeIn className="flex justify-center lg:justify-start">
          {(() => {
            // Public model only — show a real reviewed card if/when published; else pending.
            const demo = getPublicScore('magicschool-ai');
            return demo ? (
              <PillarCard
                toolName="MagicSchool AI"
                score={demo.composite}
                pillars={demo.pillars}
                size={240}
                showName={false}
                showVerdict={false}
                showLegend={false}
                methodologyVersion={demo.methodologyVersion}
                verifiedDate={demo.verifiedDate}
                reviewer={demo.reviewer}
              />
            ) : (
              <PillarCard state="provisional" size={240} showName={false} showVerdict={false} showLegend={false} />
            );
          })()}
        </FadeIn>

        {/* Five pillar rows — coloured dot + name + one-line description */}
        <FadeIn delay={0.1}>
          <h2 className="font-display mb-2" style={{ fontSize: 'clamp(1.9rem, 3vw, 2.4rem)', color: '#1c1a15' }}>
            Five published pillars. One <em className="italic" style={{ color: 'var(--color-ink-accent)' }}>Promptly Score.</em>
          </h2>
          <p className="font-sans text-sm mb-7 max-w-md" style={{ color: '#6b6760' }}>
            Every tool is scored 0–10 on each pillar, against KCSIE 2025. The composite is the Promptly Score — no paid placements, no sponsored rankings.
          </p>
          <ul className="space-y-4">
            {SCORE_PILLARS.map(p => (
              <li key={p.name} className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: p.colour }} aria-hidden="true" />
                <div>
                  <p className="font-sans font-semibold text-sm" style={{ color: '#1c1a15' }}>{p.name}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: '#6b6760' }}>{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/safety-methodology" onClick={() => track({ name: 'cta_clicked', section: 'home-scoring', label: 'See methodology' })}
            className="font-sans inline-flex items-center gap-1.5 text-sm font-semibold mt-7 transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-ink-accent)' }}>
            See our full methodology &rarr;
          </Link>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ─── 6. Curated pathways ──────────────────────────────────────────────────────

const PATHWAYS = [
  {
    role: 'Teacher', icon: 'teacher', color: 'var(--color-oat)',
    headline: 'Save hours every week',
    items: [
      { label: 'Lesson Planning Prompts', to: '/prompts/teachers', tag: 'Prompts' },
      { label: 'Safest Classroom AI Tools', to: '/tools', tag: 'Tools' },
      { label: 'Free AI CPD (GOV.UK backed)', to: '/ai-training/free', tag: 'Training' },
    ],
    cta: { label: 'Teacher pathway', to: '/prompts/teachers' },
  },
  {
    role: 'SENCO', icon: 'senco', color: 'var(--color-oat)',
    headline: 'SEND-specific guidance in one place',
    items: [
      { label: 'EHCP and SEND Prompts', to: '/prompts/senco', tag: 'Prompts' },
      { label: 'Assistive Technology Guide', to: '/ai-equipment/send', tag: 'Equipment' },
      { label: 'SEND-focused AI Training', to: '/ai-training/send', tag: 'Training' },
    ],
    cta: { label: 'SENCO pathway', to: '/prompts/senco' },
  },
  {
    role: 'School Leader', icon: 'leader', color: 'var(--color-oat)',
    headline: 'Lead your school AI strategy',
    items: [
      { label: 'AI Strategy and Policy Prompts', to: '/prompts/school-leaders', tag: 'Prompts' },
      { label: 'School Procurement Guide', to: '/ai-equipment/schools', tag: 'Equipment' },
      { label: 'Leadership AI CPD', to: '/ai-training/leaders', tag: 'Training' },
    ],
    cta: { label: 'Leader pathway', to: '/prompts/school-leaders' },
  },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Prompts:   { bg: 'var(--color-oat)', text: 'var(--color-ink)' },
  Tools:     { bg: 'var(--color-oat)', text: 'var(--color-ink)' },
  Training:  { bg: 'var(--color-oat)', text: 'var(--color-ink)' },
  Equipment: { bg: 'var(--color-oat)', text: 'var(--color-ink)' },
};

const CuratedPathways: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-accent)' }}>Curated pathways</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: '#1c1a15' }}>Ready-made starting points.</h2>
        <p className="text-sm mb-12 max-w-lg" style={{ color: '#6b6760' }}>
          Three curated journeys for the most common roles, each combining tools, training and prompts.
        </p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PATHWAYS.map((p, i) => (
          <FadeIn key={p.role} delay={i * 0.08}>
            <div className="rounded-2xl flex flex-col h-full overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
              <div className="p-6 pb-5" style={{ background: p.color }}>
                <div className="mb-3"><RoleIcon name={p.icon} size={24} color="#1E1E1E" /></div>
                <p className="font-semibold text-sm mb-0.5" style={{ color: '#1c1a15' }}>{p.role}</p>
                <p className="text-xs leading-snug" style={{ color: '#4b5563' }}>{p.headline}</p>
              </div>
              <div className="flex-1 p-5 space-y-2.5" style={{ background: 'white' }}>
                {p.items.map(item => {
                  const tc = TAG_COLORS[item.tag];
                  return (
                    <Link key={item.label} to={item.to} onClick={() => track({ name: 'cta_clicked', section: 'home-pathways', label: item.label })} className="flex items-center gap-3 group">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap" style={{ background: tc.bg, color: tc.text }}>{item.tag}</span>
                      <span className="text-xs font-medium group-hover:underline leading-snug" style={{ color: '#1c1a15', textDecorationColor: TEAL }}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="px-5 pb-5" style={{ background: 'white' }}>
                <Link to={p.cta.to} onClick={() => track({ name: 'cta_clicked', section: 'home-pathways', label: p.cta.label })}
                  className="block w-full text-center py-2.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-[#f7f6f2]"
                  style={{ borderColor: BORDER, color: 'var(--color-ink-accent)' }}>
                  {p.cta.label} &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 7. Email capture ─────────────────────────────────────────────────────────

const PromptCapture: FC = () => {
  const [val, setVal] = useState('');
  const [done, setDone] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    setDone(true);
    track({ name: 'email_capture_submitted', section: 'home-prompt-capture' });
  };
  return (
    <section style={{ background: TEAL }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-16 text-center">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3 opacity-70" style={{ color: 'var(--color-ink)' }}>Free prompt pack</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'var(--color-ink)' }}>Get 20 free prompts for your role.</h2>
          <p className="text-sm mb-8 opacity-80 max-w-md mx-auto" style={{ color: 'var(--color-ink)' }}>
            Enter your email and we will send you 20 ready-to-use AI prompts tailored for UK education, free, no account needed.
          </p>
          {done ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--color-ink)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l4 4 6-6" stroke="#1A1A0E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Sent. Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="email-capture" className="sr-only">Email address</label>
              <input id="email-capture" type="email" required value={val} onChange={e => setVal(e.target.value)}
                placeholder="your@school.ac.uk"
                className="flex-1 px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/60"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#1c1a15' }} />
              <button type="submit"
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap"
                style={{ background: DARK, color: 'white' }}>
                Send my prompts &rarr;
              </button>
            </form>
          )}
          <p className="mt-4 text-[11px] opacity-70" style={{ color: 'var(--color-ink)' }}>No spam. Unsubscribe anytime. We respect UK GDPR.</p>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── 8. Platform nav ──────────────────────────────────────────────────────────

const NAV_CARDS = [
  { title: 'AI Tools Hub',     stat: '155 tools reviewed',  desc: 'Every tool reviewed against KCSIE 2025, with an eye on UK GDPR. Filter by role, tier and price.', to: '/tools',        color: 'var(--color-oat)' },
  { title: 'AI Training',      stat: '26 courses',          desc: 'Free government-backed CPD and paid certification for teachers, leaders and SENCOs.',       to: '/ai-training',  color: 'var(--color-oat)' },
  { title: 'Equipment',        stat: '96 products',         desc: 'Classroom tech, SEND assistive devices, coding robots and home learning hardware.',           to: '/ai-equipment', color: 'var(--color-oat)' },
  { title: 'Prompts Library',  stat: '440+ prompts',        desc: 'Ready-to-copy prompts for teachers, SENCOs, leaders, parents and students.',                  to: '/prompts',      color: 'var(--color-oat)' },
];

const PlatformNav: FC = () => (
  <section style={{ background: BG }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink-accent)' }}>The platform</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: '#1c1a15' }}>Four sections. One trusted source.</h2>
        <p className="text-sm mb-10 max-w-lg" style={{ color: '#6b6760' }}>
          Tools, training, equipment and prompts, all independently reviewed for UK education.
        </p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NAV_CARDS.map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.07}>
            <Link to={c.to} onClick={() => track({ name: 'cta_clicked', section: 'home-platform-nav', label: c.title })}
              className="group flex flex-col h-full rounded-2xl border transition-all hover:border-[var(--color-promptly-lime)] hover:shadow-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={{ borderColor: BORDER, background: 'white' }}>
              <div className="px-5 pt-5 pb-4" style={{ background: c.color }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-lg" style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--color-ink-accent)' }} aria-hidden="true">
                  {c.title[3]}
                </div>
              </div>
              <div className="flex-1 flex flex-col p-5">
                <p className="font-semibold text-sm mb-0.5 group-hover:text-[var(--color-promptly-lime)] transition-colors" style={{ color: '#1c1a15' }}>{c.title}</p>
                <p className="text-[10px] font-semibold mb-3" style={{ color: 'var(--color-ink-accent)' }}>{c.stat}</p>
                <p className="text-xs leading-relaxed flex-1" style={{ color: '#6b6760' }}>{c.desc}</p>
                <span className="mt-4 text-xs font-semibold" style={{ color: 'var(--color-ink-accent)' }}>Browse &rarr;</span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 9. Schools dark CTA ──────────────────────────────────────────────────────

const SchoolsCTA: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-ink-accent)' }}>For schools &amp; trusts</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: '#1c1a15' }}>Whole-school AI advisory, without the jargon.</h2>
        <p className="text-sm leading-relaxed max-w-md mb-8" style={{ color: '#6b6760' }}>
          GetPromptly helps headteachers, SENCOs, IT leads and business managers make informed decisions about AI tools, staff training, SEND technology and procurement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/schools" onClick={() => track({ name: 'cta_clicked', section: 'home-schools-cta', label: 'For Schools page' })}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 text-center"
            style={{ background: TEAL, color: '#1A1A0E' }}>
            GetPromptly for Schools &rarr;
          </Link>
          <button onClick={() => { track({ name: 'cta_clicked', section: 'home-schools-cta', label: 'Request consultation' }); openWidget(); }}
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-[#f0ede8]"
            style={{ borderColor: BORDER, color: '#6b6760' }}>
            Request a consultation
          </button>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="space-y-3">
          {[
            { icon: 'tools',     label: 'AI Tools',     desc: '155 tools reviewed against KCSIE 2025', to: '/tools' },
            { icon: 'training',  label: 'Staff CPD',    desc: 'Free and paid training for all school roles', to: '/ai-training' },
            { icon: 'equipment', label: 'Equipment',    desc: 'Procurement guidance and SEND assistive tech', to: '/ai-equipment/schools' },
            { icon: 'prompts',   label: 'Prompt Packs', desc: '440+ prompts for teachers, SENCOs and leaders', to: '/prompts' },
          ].map(item => (
            <Link key={item.label} to={item.to} onClick={() => track({ name: 'cta_clicked', section: 'home-schools-links', label: item.label })}
              className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[var(--color-promptly-lime)] group"
              style={{ borderColor: BORDER, background: '#f7f6f2' }}>
              <CategoryIcon name={item.icon} size={20} color="#1E1E1E" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold group-hover:text-[var(--color-promptly-lime)] transition-colors" style={{ color: '#1c1a15' }}>{item.label}</p>
                <p className="text-xs" style={{ color: '#6b6760' }}>{item.desc}</p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: '#a09d98' }} aria-hidden="true">&rarr;</span>
            </Link>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <SEO
        title="GetPromptly — AI Guidance for Your Role in UK Education"
        description="Find the right AI tools, training and prompts for your role. 155 tools reviewed, 440+ prompts ready to copy. Trusted, independent, UK-focused."
        keywords="ai tools for uk teachers, ai prompts for education, kcsie ai tools schools, ai training for teachers uk, send assistive technology"
        path="/"
      />
      <Hero />
      <TrustStrip />
      <RoleSelector />
      <HowItWorks />
      <ScoringPreview />
      <CuratedPathways />
      <PromptCapture />
      <PlatformNav />
      <SchoolsCTA />
    </>
  );
}
