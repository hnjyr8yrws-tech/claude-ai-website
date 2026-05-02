/**
 * Home.tsx — GetPromptly.co.uk
 * Premium SaaS rebrand — dark hero, lime/cyan accents, animated AI bubbles.
 * All copy, sections, role-selector behaviour, links, forms and tracking preserved.
 */

import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { BubbleLayer } from '../components/Bubbles';
import { FadeIn, Stagger, staggerItem } from '../components/anim';

// ─── Promptly palette tokens (mirror CSS variables) ──────────────────────────
const DARK    = '#0F1C1A';
const DARK_2  = '#142522';
const DARK_3  = '#1B302C';
const LIME    = '#BEFF00';
const CYAN    = '#00D1FF';
const CREAM   = '#F8F5F0';
const INK     = '#1A1A1A';
const INK_SOFT = '#4A4A4A';
const PURPLE  = '#7C3AED';
const PURPLE_LIGHT = '#A78BFA';
const YELLOW  = '#FFEA00';
const BORDER_LIGHT = '#ECE7DD';
const BORDER_DARK  = 'rgba(255,255,255,0.10)';

function openWidget() {
  const btn = document.getElementById('promptly-widget-trigger');
  if (btn) (btn as HTMLButtonElement).click();
}

// ─── Role data ───────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: 'teacher',
    label: 'Teacher',
    emoji: '\u{1F4DA}',
    accent: CYAN,
    chipBg: 'rgba(0,209,255,0.14)',
    chipText: '#0AA8CC',
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
    accent: YELLOW,
    chipBg: 'rgba(255,234,0,0.22)',
    chipText: '#7C6A00',
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
    accent: PURPLE_LIGHT,
    chipBg: 'rgba(167,139,250,0.18)',
    chipText: '#5B3DC2',
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
    accent: '#FF8FB8',
    chipBg: 'rgba(255,143,184,0.18)',
    chipText: '#B8226A',
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
    accent: LIME,
    chipBg: 'rgba(190,255,0,0.22)',
    chipText: '#3F5500',
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
    accent: '#FFB877',
    chipBg: 'rgba(255,184,119,0.22)',
    chipText: '#A04E00',
    tagline: 'Cut admin time',
    desc: 'Letters, templates, timetabling, data and communication prompts for office staff.',
    to: '/prompts/admin',
    pills: ['Letters', 'Templates', 'Timetabling', 'Reports'],
    tools: ['ChatGPT', 'Gemini', 'Microsoft Copilot'],
  },
];

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

const AgentMockup: FC = () => (
  <div className="relative select-none">
    <div className="gp-orbit">
      <div
        className="rounded-[26px] overflow-hidden"
        style={{
          background: DARK_2,
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(190,255,0,0.10), 0 0 60px rgba(0,209,255,0.10)',
          maxWidth: 380,
        }}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: LIME, boxShadow: `0 0 20px ${LIME}66` }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke={DARK} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: 'white' }}>Promptly AI</span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px]" style={{ color: LIME }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: LIME }} aria-hidden="true" />
            Online now
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={{ background: 'rgba(190,255,0,0.18)', color: LIME }}
            >P</div>
            <div
              className="rounded-2xl rounded-tl-md px-3 py-2.5 text-xs leading-relaxed max-w-[240px]"
              style={{ background: DARK_3, color: '#E5E0D5' }}
            >
              Hi! What is your role in education? I will find the right tools, training and prompts for you.
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className="rounded-2xl rounded-tr-md px-3 py-2.5 text-xs"
              style={{ background: LIME, color: DARK }}
            >
              I am a primary school teacher
            </div>
          </div>
          <div className="flex gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={{ background: 'rgba(190,255,0,0.18)', color: LIME }}
            >P</div>
            <div
              className="rounded-2xl rounded-tl-md px-3 py-2.5 text-xs leading-relaxed max-w-[240px]"
              style={{ background: DARK_3, color: '#E5E0D5' }}
            >
              Great! Here are my top picks for primary teachers right now...
            </div>
          </div>
          <div
            className="ml-8 rounded-2xl p-3 space-y-2.5"
            style={{ background: DARK, border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { name: 'MagicSchool', score: 9.1 },
              { name: 'Curipod',     score: 8.4 },
            ].map(t => (
              <div key={t.name} className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold" style={{ color: 'white' }}>{t.name}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(190,255,0,0.18)', color: LIME }}
                  >{t.score}</span>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,209,255,0.18)', color: CYAN }}
                  >Trusted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: DARK_3, border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs flex-1" style={{ color: '#7c8682' }}>
              Ask anything about AI in education...
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: LIME }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M7 3l3 3-3 3" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Floating scorecard */}
    <motion.div
      initial={{ opacity: 0, y: 16, x: -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
      className="absolute -bottom-6 -left-8 rounded-[20px] p-4"
      style={{
        background: 'white',
        border: `1px solid ${BORDER_LIGHT}`,
        boxShadow: '0 20px 50px rgba(15,28,26,0.18), 0 0 0 1px rgba(190,255,0,0.18)',
        minWidth: 180,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#9b958b' }}>
        Safety Score
      </p>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="font-display text-3xl leading-none" style={{ color: DARK }}>9.1</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(190,255,0,0.22)', color: '#3F5500' }}
        >Trusted</span>
      </div>
      {[
        { label: 'Data Privacy',  w: 90, color: LIME },
        { label: 'Safeguarding',  w: 95, color: CYAN },
        { label: 'Accessibility', w: 85, color: PURPLE_LIGHT },
      ].map(r => (
        <div key={r.label} className="mb-1.5">
          <span className="text-[9px]" style={{ color: '#9b958b' }}>{r.label}</span>
          <div className="h-1 rounded-full mt-0.5" style={{ background: BORDER_LIGHT }}>
            <motion.div
              className="h-1 rounded-full"
              style={{ background: r.color }}
              initial={{ width: 0 }}
              animate={{ width: `${r.w}%` }}
              transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </motion.div>

    {/* Floating cyan chip */}
    <motion.div
      initial={{ opacity: 0, y: -16, x: 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.55, delay: 0.45 }}
      className="absolute -top-4 -right-4 rounded-2xl px-3 py-2 flex items-center gap-2"
      style={{
        background: 'white',
        border: `1px solid ${BORDER_LIGHT}`,
        boxShadow: '0 16px 40px rgba(0,209,255,0.22), 0 0 0 1px rgba(0,209,255,0.18)',
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} aria-hidden="true" />
      <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: DARK }}>KCSIE 2025</span>
    </motion.div>
  </div>
);

const Hero: FC = () => (
  <section className="relative overflow-hidden" style={{ background: DARK }}>
    <BubbleLayer bubbles={[
      { variant: 'lime',   size: 520, top: '-12%', right: '-8%',  anim: 'gp-float-a' },
      { variant: 'cyan',   size: 420, top: '40%',  left: '-12%',  anim: 'gp-float-b' },
      { variant: 'purple', size: 360, bottom: '-10%', right: '20%', anim: 'gp-float-c' },
    ]} />

    {/* Subtle grid overlay for premium SaaS texture */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
      }}
    />

    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}>
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase px-3.5 py-1.5 rounded-full mb-7"
            style={{
              background: 'rgba(190,255,0,0.08)',
              color: LIME,
              border: '1px solid rgba(190,255,0,0.28)',
              boxShadow: '0 0 20px rgba(190,255,0,0.08)',
            }}
          >
            <span className="gp-pulse-dot" aria-hidden="true" />
            UK Education &middot; KCSIE 2025 &middot; Independent
          </span>

          <h1
            className="font-display leading-[1.04] mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)', color: 'white' }}
          >
            Stop Guessing with AI.
            <br />
            <em
              style={{
                fontStyle: 'italic',
                background: `linear-gradient(135deg, ${LIME} 0%, ${CYAN} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Start Getting Promptly.
            </em>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-9 max-w-md" style={{ color: 'rgba(255,255,255,0.72)' }}>
            The UK&apos;s trusted platform for AI in education. Tools, training, equipment and prompts &mdash; curated for teachers, leaders, SENCOs, parents and students.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                track({ name: 'cta_clicked', section: 'home-hero', label: 'Start with your role' });
                document.getElementById('role-selector')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="gp-btn-primary"
            >
              Start with your role <span aria-hidden="true">&rarr;</span>
            </button>
            <button
              onClick={() => { track({ name: 'cta_clicked', section: 'home-hero', label: 'Ask Promptly AI' }); openWidget(); }}
              className="gp-btn-ghost-dark"
            >
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: CYAN }} />
                <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: CYAN }} />
              </span>
              Ask Promptly AI
            </button>
          </div>

          <p className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.44)' }}>
            Free to use &middot; No account required &middot; UK-focused
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="hidden lg:flex justify-end"
          aria-hidden="true"
        >
          <AgentMockup />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-16 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {[
          { n: '155',  label: 'AI tools reviewed',       color: LIME },
          { n: '96',   label: 'equipment products',      color: CYAN },
          { n: '440+', label: 'prompts ready to use',    color: LIME },
          { n: '24/7', label: 'AI agent support',        color: CYAN },
        ].map(s => (
          <div key={s.label}>
            <div className="font-display text-3xl sm:text-4xl leading-none mb-1" style={{ color: s.color }}>{s.n}</div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Soft cream fade into next section */}
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
      style={{ background: `linear-gradient(180deg, transparent 0%, ${CREAM} 100%)` }}
    />
  </section>
);

// ─── 2. Trust strip ────────────────────────────────────────────────────────────

const TrustStrip: FC = () => (
  <div
    className="relative"
    style={{
      background: 'white',
      borderTop: `1px solid ${BORDER_LIGHT}`,
      borderBottom: `1px solid ${BORDER_LIGHT}`,
    }}
  >
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3">
      {['KCSIE 2025 Aligned', 'UK GDPR Compliant', '100% Independent', 'No Sponsored Rankings', 'Free to use'].map(label => (
        <span
          key={label}
          className="flex items-center gap-2 text-[11px] font-semibold tracking-wide"
          style={{ color: INK_SOFT }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: LIME, boxShadow: `0 0 6px ${LIME}` }}
            aria-hidden="true"
          />
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
    <section id="role-selector" className="relative overflow-hidden" style={{ background: CREAM }}>
      <BubbleLayer bubbles={[
        { variant: 'soft-lime',   size: 380, top: '10%', right: '-8%', anim: 'gp-float-b' },
        { variant: 'soft-cyan',   size: 320, bottom: '5%', left: '-6%', anim: 'gp-float-a' },
      ]} />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 z-10">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: PURPLE }}>
            Start here
          </p>
          <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: INK }}>
            Which role are you?
          </h2>
          <p className="text-base mb-10 max-w-lg" style={{ color: INK_SOFT }}>
            Choose your role and we will show you exactly where to start on GetPromptly.
          </p>
        </FadeIn>

        <div className="flex flex-wrap gap-2.5 mb-8" role="tablist" aria-label="Roles">
          {ROLES.map(r => {
            const isActive = active === r.id;
            return (
              <button
                key={r.id}
                role="tab"
                onClick={() => { setActive(r.id); track({ name: 'filter_applied', section: 'home-roles', filter: 'role', value: r.label }); }}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                style={isActive
                  ? {
                      background: DARK,
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: `0 12px 28px rgba(15,28,26,0.18), 0 0 0 1px rgba(190,255,0,0.18), 0 0 24px rgba(190,255,0,0.18)`,
                      transform: 'translateY(-1px)',
                    }
                  : {
                      background: 'white',
                      color: INK,
                      border: `1px solid ${BORDER_LIGHT}`,
                    }
                }
                aria-pressed={isActive}
              >
                <span aria-hidden="true">{r.emoji}</span>
                {r.label}
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    className="ml-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: LIME }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            <div className="lg:col-span-2 gp-card-light p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="w-14 h-14 rounded-2xl text-[28px] flex items-center justify-center flex-shrink-0"
                    style={{ background: role.chipBg, border: `1px solid ${role.accent}40` }}
                    aria-hidden="true"
                  >
                    {role.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-base" style={{ color: INK }}>{role.label}</p>
                    <p className="text-xs font-bold tracking-wide uppercase" style={{ color: role.chipText }}>
                      {role.tagline}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: INK_SOFT }}>
                  {role.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {role.pills.map(p => (
                    <span
                      key={p}
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: role.chipBg, color: role.chipText }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={role.to}
                  onClick={() => track({ name: 'cta_clicked', section: 'home-roles', label: `${role.label} prompts` })}
                  className="gp-btn-primary flex-1"
                >
                  See {role.label} prompts <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link
                  to="/tools"
                  onClick={() => track({ name: 'cta_clicked', section: 'home-roles', label: `${role.label} tools` })}
                  className="gp-btn-ghost-light flex-1"
                >
                  Browse safe tools <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="gp-card-dark p-6 flex flex-col">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: LIME }}>
                Top tools for {role.label}s
              </p>
              <div className="flex-1 space-y-3">
                {role.tools.map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                    style={{ background: DARK_3, border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span
                      className="w-7 h-7 rounded-xl text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(190,255,0,0.18)', color: LIME }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium flex-1" style={{ color: '#E5E0D5' }}>{t}</span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,209,255,0.18)', color: CYAN }}
                    >Safe</span>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/tools"
                onClick={() => track({ name: 'cta_clicked', section: 'home-roles-tools', label: 'View all tools' })}
                className="mt-5 text-center text-xs font-bold py-3 rounded-xl transition-all"
                style={{
                  background: 'rgba(190,255,0,0.14)',
                  color: LIME,
                  border: '1px solid rgba(190,255,0,0.25)',
                }}
              >
                View all 155 tools <span aria-hidden="true">&rarr;</span>
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
  { n: '01', title: 'Select your role',         desc: 'Tell us whether you are a teacher, leader, SENCO, parent or student. The platform adapts to you.', accent: LIME },
  { n: '02', title: 'Browse curated content',   desc: 'Every tool, course, product and prompt is reviewed against UK safety and education standards.', accent: CYAN },
  { n: '03', title: 'Check UK safety scores',   desc: 'Our 5-pillar scoring covers data privacy, safeguarding, age suitability, transparency and accessibility.', accent: PURPLE_LIGHT },
  { n: '04', title: 'Copy prompts instantly',   desc: 'Paste any prompt into Claude, ChatGPT or Gemini. No account needed, no setup required.', accent: YELLOW },
  { n: '05', title: 'Ask the 24/7 agent',       desc: 'Our AI agent answers questions, compares options and recommends next steps in real time, free.', accent: LIME },
];

const HowItWorks: FC = () => (
  <section className="relative overflow-hidden" style={{ background: 'white' }}>
    <BubbleLayer bubbles={[
      { variant: 'soft-cyan', size: 360, top: '20%', right: '-8%', anim: 'gp-float-c' },
    ]} />
    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 z-10">
      <FadeIn>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: CYAN }}>
          How it works
        </p>
        <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: INK }}>
          GetPromptly guides you end to end.
        </h2>
        <p className="text-base mb-12 max-w-lg" style={{ color: INK_SOFT }}>
          From choosing your role to copying your first prompt, everything is designed to save time and give you confidence.
        </p>
      </FadeIn>
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {HOW_STEPS.map((step) => (
          <motion.div key={step.n} variants={staggerItem}>
            <div className="gp-card-light p-5 h-full flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-transform group-hover:scale-110"
                  style={{
                    background: `${step.accent}24`,
                    color: INK,
                    border: `1px solid ${step.accent}55`,
                  }}
                >
                  {step.n}
                </div>
                <span className="font-display text-3xl leading-none opacity-30" style={{ color: INK }} aria-hidden="true">
                  {step.n}
                </span>
              </div>
              <p className="font-semibold text-base mb-2" style={{ color: INK }}>{step.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: INK_SOFT }}>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </Stagger>
    </div>
  </section>
);

// ─── 5. Safety scoring preview ────────────────────────────────────────────────

const SAMPLE_TOOLS = [
  { name: 'MagicSchool', category: 'Teacher AI',    overall: 9.1, tier: 'Trusted', tierColor: '#3F5500', tierBg: 'rgba(190,255,0,0.22)', scores: [9, 9, 9, 8, 9] },
  { name: 'Curipod',     category: 'Lesson Design', overall: 8.4, tier: 'Trusted', tierColor: '#3F5500', tierBg: 'rgba(190,255,0,0.22)', scores: [8, 9, 8, 8, 8] },
  { name: 'ChatGPT',     category: 'General AI',    overall: 6.8, tier: 'Guided',  tierColor: '#7C6A00', tierBg: 'rgba(255,234,0,0.28)', scores: [7, 6, 5, 8, 8] },
];
const PILLARS = ['Data Privacy', 'Safeguarding', 'Age Suitability', 'Transparency', 'Accessibility'];

const ScoringPreview: FC = () => (
  <section className="relative overflow-hidden" style={{ background: CREAM }}>
    <BubbleLayer bubbles={[
      { variant: 'soft-purple', size: 420, top: '10%', left: '-10%', anim: 'gp-float-a' },
      { variant: 'soft-lime',   size: 320, bottom: '0%', right: '-6%', anim: 'gp-float-b' },
    ]} />
    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: PURPLE }}>
            Our trust framework
          </p>
          <h2 className="font-display mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: INK, lineHeight: 1.05 }}>
            Every tool scored across<br />
            <em
              style={{
                fontStyle: 'italic',
                background: `linear-gradient(135deg, ${DARK} 0%, ${PURPLE} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              five UK safety pillars.
            </em>
          </h2>
          <p className="text-base leading-relaxed mb-7 max-w-md" style={{ color: INK_SOFT }}>
            We assess every AI tool against KCSIE 2025, UK GDPR and DfE guidance. No paid placements, no sponsored rankings.
          </p>
          <Stagger className="space-y-3 mb-8">
            {PILLARS.map((label, i) => (
              <motion.div key={label} variants={staggerItem} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{
                    background: i % 2 === 0 ? 'rgba(190,255,0,0.22)' : 'rgba(0,209,255,0.18)',
                    color: i % 2 === 0 ? '#3F5500' : '#0AA8CC',
                    border: `1px solid ${i % 2 === 0 ? 'rgba(190,255,0,0.35)' : 'rgba(0,209,255,0.35)'}`,
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-semibold" style={{ color: INK }}>{label}</span>
              </motion.div>
            ))}
          </Stagger>
          <Link
            to="/safety-methodology"
            onClick={() => track({ name: 'cta_clicked', section: 'home-scoring', label: 'See methodology' })}
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-all hover:gap-2.5"
            style={{ color: DARK, borderBottom: `2px solid ${LIME}`, paddingBottom: 2 }}
          >
            See our full methodology <span aria-hidden="true">&rarr;</span>
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-3">
            {SAMPLE_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="gp-card-light p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: INK }}>{tool.name}</p>
                    <p className="text-[10px] font-medium" style={{ color: INK_SOFT }}>{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-3xl leading-none" style={{ color: DARK }}>{tool.overall}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: tool.tierBg, color: tool.tierColor }}
                    >
                      {tool.tier}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {PILLARS.map((label, j) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-[10px] w-24 flex-shrink-0 font-medium" style={{ color: INK_SOFT }}>{label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER_LIGHT }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background:
                              tool.scores[j] >= 8
                                ? `linear-gradient(90deg, ${LIME} 0%, ${CYAN} 100%)`
                                : tool.scores[j] >= 6
                                ? YELLOW
                                : '#ef4444',
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tool.scores[j] * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + 0.2, duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[10px] font-bold w-4 text-right" style={{ color: INK }}>{tool.scores[j]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ─── 6. Curated pathways ──────────────────────────────────────────────────────

const PATHWAYS = [
  {
    role: 'Teacher', emoji: '\u{1F4DA}', accent: CYAN, accentSoft: 'rgba(0,209,255,0.14)', accentText: '#0AA8CC',
    headline: 'Save hours every week',
    items: [
      { label: 'Lesson Planning Prompts',        to: '/prompts/teachers',    tag: 'Prompts' },
      { label: 'Safest Classroom AI Tools',      to: '/tools',               tag: 'Tools' },
      { label: 'Free AI CPD (GOV.UK backed)',    to: '/ai-training/free',    tag: 'Training' },
    ],
    cta: { label: 'Teacher pathway', to: '/prompts/teachers' },
  },
  {
    role: 'SENCO', emoji: '\u{1F91D}', accent: PURPLE_LIGHT, accentSoft: 'rgba(167,139,250,0.18)', accentText: '#5B3DC2',
    headline: 'SEND-specific guidance in one place',
    items: [
      { label: 'EHCP and SEND Prompts',          to: '/prompts/senco',         tag: 'Prompts' },
      { label: 'Assistive Technology Guide',     to: '/ai-equipment/send',     tag: 'Equipment' },
      { label: 'SEND-focused AI Training',       to: '/ai-training/send',      tag: 'Training' },
    ],
    cta: { label: 'SENCO pathway', to: '/prompts/senco' },
  },
  {
    role: 'School Leader', emoji: '\u{1F3EB}', accent: YELLOW, accentSoft: 'rgba(255,234,0,0.22)', accentText: '#7C6A00',
    headline: 'Lead your school AI strategy',
    items: [
      { label: 'AI Strategy and Policy Prompts', to: '/prompts/school-leaders',  tag: 'Prompts' },
      { label: 'School Procurement Guide',       to: '/ai-equipment/schools',    tag: 'Equipment' },
      { label: 'Leadership AI CPD',              to: '/ai-training/leaders',     tag: 'Training' },
    ],
    cta: { label: 'Leader pathway', to: '/prompts/school-leaders' },
  },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Prompts:   { bg: 'rgba(190,255,0,0.22)', text: '#3F5500' },
  Tools:     { bg: 'rgba(0,209,255,0.18)', text: '#0AA8CC' },
  Training:  { bg: 'rgba(255,234,0,0.28)', text: '#7C6A00' },
  Equipment: { bg: 'rgba(167,139,250,0.20)', text: '#5B3DC2' },
};

const CuratedPathways: FC = () => (
  <section className="relative overflow-hidden" style={{ background: 'white' }}>
    <BubbleLayer bubbles={[
      { variant: 'soft-lime', size: 360, top: '10%', left: '-8%', anim: 'gp-float-b' },
    ]} />
    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 z-10">
      <FadeIn>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: LIME, textShadow: '0 0 1px rgba(63,85,0,0.5)' }}>
          <span style={{ color: '#3F5500' }}>Curated pathways</span>
        </p>
        <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: INK }}>
          Ready-made starting points.
        </h2>
        <p className="text-base mb-12 max-w-lg" style={{ color: INK_SOFT }}>
          Three curated journeys for the most common roles, each combining tools, training and prompts.
        </p>
      </FadeIn>
      <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PATHWAYS.map((p) => (
          <motion.div key={p.role} variants={staggerItem}>
            <div className="gp-card-light flex flex-col h-full overflow-hidden group">
              <div
                className="relative p-6 pb-5 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${p.accentSoft} 0%, rgba(255,255,255,0.4) 100%)`,
                  borderBottom: `1px solid ${BORDER_LIGHT}`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-50"
                  style={{ background: p.accent }}
                />
                <div className="relative">
                  <div className="text-3xl mb-3" aria-hidden="true">{p.emoji}</div>
                  <p className="font-semibold text-base mb-1" style={{ color: INK }}>{p.role}</p>
                  <p className="text-xs font-medium" style={{ color: p.accentText }}>{p.headline}</p>
                </div>
              </div>
              <div className="flex-1 p-5 space-y-3">
                {p.items.map(item => {
                  const tc = TAG_COLORS[item.tag];
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => track({ name: 'cta_clicked', section: 'home-pathways', label: item.label })}
                      className="flex items-center gap-3 group/item transition-transform hover:translate-x-0.5"
                    >
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                        style={{ background: tc.bg, color: tc.text }}
                      >
                        {item.tag}
                      </span>
                      <span className="text-sm font-medium leading-snug group-hover/item:underline" style={{ color: INK, textDecorationColor: p.accent }}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="px-5 pb-5">
                <Link
                  to={p.cta.to}
                  onClick={() => track({ name: 'cta_clicked', section: 'home-pathways', label: p.cta.label })}
                  className="block w-full text-center py-3 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: DARK,
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: `0 0 0 0 ${p.accent}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${p.accent}, 0 0 24px ${p.accent}55`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${p.accent}`;
                  }}
                >
                  {p.cta.label} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </Stagger>
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
    <section className="relative overflow-hidden" style={{ background: DARK }}>
      <BubbleLayer bubbles={[
        { variant: 'lime',   size: 480, top: '-15%',  left: '-10%', anim: 'gp-float-a' },
        { variant: 'cyan',   size: 420, bottom: '-15%', right: '-8%', anim: 'gp-float-b' },
        { variant: 'purple', size: 280, top: '40%', left: '50%',   anim: 'gp-float-c' },
      ]} />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center z-10">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: LIME }}>
            Free prompt pack
          </p>
          <h2
            className="font-display mb-5"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              lineHeight: 1.05,
              color: 'white',
            }}
          >
            Get 20 free prompts for{' '}
            <em
              style={{
                fontStyle: 'italic',
                background: `linear-gradient(135deg, ${LIME} 0%, ${CYAN} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              your role.
            </em>
          </h2>
          <p className="text-base mb-9 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Enter your email and we will send you 20 ready-to-use AI prompts tailored for UK education, free, no account needed.
          </p>
          {done ? (
            <div
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold"
              style={{
                background: 'rgba(190,255,0,0.16)',
                color: LIME,
                border: '1px solid rgba(190,255,0,0.4)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8l4 4 6-6" stroke={LIME} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sent! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="email-capture" className="sr-only">Email address</label>
              <input
                id="email-capture"
                type="email"
                required
                value={val}
                onChange={e => setVal(e.target.value)}
                placeholder="your@school.ac.uk"
                className="flex-1 px-5 py-3.5 rounded-2xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#BEFF00] focus:ring-offset-2 focus:ring-offset-[#0F1C1A]"
                style={{
                  background: 'rgba(255,255,255,0.94)',
                  color: INK,
                }}
              />
              <button type="submit" className="gp-btn-primary whitespace-nowrap">
                Send my prompts <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
          )}
          <p className="mt-5 text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No spam. Unsubscribe anytime. We respect UK GDPR.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── 8. Platform nav ──────────────────────────────────────────────────────────

const NAV_CARDS = [
  {
    title: 'AI Tools Hub',
    stat: '155 tools reviewed',
    desc: 'Every tool scored against KCSIE 2025 and UK GDPR. Filter by role, safety tier and price.',
    to: '/tools',
    accent: CYAN,
    icon: 'tools',
  },
  {
    title: 'AI Training',
    stat: '26 courses',
    desc: 'Free government-backed CPD and paid certification for teachers, leaders and SENCOs.',
    to: '/ai-training',
    accent: YELLOW,
    icon: 'training',
  },
  {
    title: 'Equipment',
    stat: '96 products',
    desc: 'Classroom tech, SEND assistive devices, coding robots and home learning hardware.',
    to: '/ai-equipment',
    accent: PURPLE_LIGHT,
    icon: 'equipment',
  },
  {
    title: 'Prompts Library',
    stat: '440+ prompts',
    desc: 'Ready-to-copy prompts for teachers, SENCOs, leaders, parents and students.',
    to: '/prompts',
    accent: LIME,
    icon: 'prompts',
  },
];

const NavIcon: FC<{ name: string; color: string }> = ({ name, color }) => {
  const stroke = INK;
  if (name === 'tools') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M14 6l4 4M3 17l9-9 4 4-9 9H3v-4z" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18" cy="5" r="2" fill={color}/>
      </svg>
    );
  }
  if (name === 'training') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 8l10-5 10 5-10 5L2 8z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="22" cy="8" r="1.5" fill={color}/>
      </svg>
    );
  }
  if (name === 'equipment') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="20" height="13" rx="2" stroke={stroke} strokeWidth="1.6"/>
        <path d="M8 21h8M12 17v4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="12" cy="10.5" r="2.2" fill={color}/>
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16M4 12h10M4 19h16" stroke={stroke} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="20" cy="12" r="2" fill={color}/>
    </svg>
  );
};

const PlatformNav: FC = () => (
  <section className="relative overflow-hidden" style={{ background: CREAM }}>
    <BubbleLayer bubbles={[
      { variant: 'soft-cyan',   size: 380, top: '5%',  right: '-8%', anim: 'gp-float-a' },
      { variant: 'soft-purple', size: 320, bottom: '5%', left: '-6%', anim: 'gp-float-c' },
    ]} />
    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 z-10">
      <FadeIn>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#0AA8CC' }}>
          The platform
        </p>
        <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: INK }}>
          Four sections.{' '}
          <em
            style={{
              fontStyle: 'italic',
              background: `linear-gradient(135deg, ${DARK} 0%, ${CYAN} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            One trusted source.
          </em>
        </h2>
        <p className="text-base mb-10 max-w-lg" style={{ color: INK_SOFT }}>
          Tools, training, equipment and prompts, all independently reviewed for UK education.
        </p>
      </FadeIn>
      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NAV_CARDS.map((c) => (
          <motion.div key={c.title} variants={staggerItem}>
            <Link
              to={c.to}
              onClick={() => track({ name: 'cta_clicked', section: 'home-platform-nav', label: c.title })}
              className="group flex flex-col h-full gp-card-light overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            >
              <div
                className="relative px-5 pt-5 pb-4 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${c.accent}22 0%, transparent 100%)`,
                  borderBottom: `1px solid ${BORDER_LIGHT}`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 w-20 h-20 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"
                  style={{ background: c.accent }}
                />
                <div
                  className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    background: 'white',
                    border: `1px solid ${c.accent}55`,
                    boxShadow: `0 4px 12px ${c.accent}33`,
                  }}
                  aria-hidden="true"
                >
                  <NavIcon name={c.icon} color={c.accent} />
                </div>
              </div>
              <div className="flex-1 flex flex-col p-5">
                <p className="font-semibold text-base mb-1 transition-colors" style={{ color: INK }}>{c.title}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide mb-3" style={{ color: INK_SOFT }}>{c.stat}</p>
                <p className="text-xs leading-relaxed flex-1" style={{ color: INK_SOFT }}>{c.desc}</p>
                <span
                  className="mt-4 text-xs font-bold inline-flex items-center gap-1 transition-all group-hover:gap-2"
                  style={{ color: DARK }}
                >
                  Browse <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </Stagger>
    </div>
  </section>
);

// ─── 9. Schools dark CTA ──────────────────────────────────────────────────────

const SchoolsCTA: FC = () => (
  <section className="relative overflow-hidden" style={{ background: 'white' }}>
    <BubbleLayer bubbles={[
      { variant: 'soft-cyan', size: 360, top: '20%',  right: '-8%', anim: 'gp-float-b' },
      { variant: 'soft-lime', size: 320, bottom: '0%', left: '-6%', anim: 'gp-float-c' },
    ]} />
    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
      <FadeIn>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: PURPLE }}>
          For schools &amp; trusts
        </p>
        <h2 className="font-display mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: INK }}>
          Whole-school AI advisory,{' '}
          <em
            style={{
              fontStyle: 'italic',
              background: `linear-gradient(135deg, ${DARK} 0%, ${PURPLE} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            without the jargon.
          </em>
        </h2>
        <p className="text-base leading-relaxed max-w-md mb-9" style={{ color: INK_SOFT }}>
          GetPromptly helps headteachers, SENCOs, IT leads and business managers make informed decisions about AI tools, staff training, SEND technology and procurement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/schools"
            onClick={() => track({ name: 'cta_clicked', section: 'home-schools-cta', label: 'For Schools page' })}
            className="gp-btn-primary"
          >
            GetPromptly for Schools <span aria-hidden="true">&rarr;</span>
          </Link>
          <button
            onClick={() => { track({ name: 'cta_clicked', section: 'home-schools-cta', label: 'Request consultation' }); openWidget(); }}
            className="gp-btn-ghost-light"
          >
            Request a consultation
          </button>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <Stagger className="space-y-3">
          {[
            { emoji: '\u{1F512}', label: 'AI Tools',     desc: '155 tools reviewed against KCSIE 2025',           to: '/tools',                accent: CYAN },
            { emoji: '\u{1F393}', label: 'Staff CPD',    desc: 'Free and paid training for all school roles',     to: '/ai-training',          accent: YELLOW },
            { emoji: '\u{1F5A5}', label: 'Equipment',    desc: 'Procurement guidance and SEND assistive tech',    to: '/ai-equipment/schools', accent: PURPLE_LIGHT },
            { emoji: '\u{1F4DD}', label: 'Prompt Packs', desc: '440+ prompts for teachers, SENCOs and leaders',   to: '/prompts',              accent: LIME },
          ].map(item => (
            <motion.div key={item.label} variants={staggerItem}>
              <Link
                to={item.to}
                onClick={() => track({ name: 'cta_clicked', section: 'home-schools-links', label: item.label })}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all group hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${BORDER_LIGHT}`,
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(15,28,26,0.04)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.accent}88`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 28px rgba(15,28,26,0.08), 0 0 0 1px ${item.accent}44`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = BORDER_LIGHT;
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(15,28,26,0.04)';
                }}
              >
                <span
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: `${item.accent}22`,
                    border: `1px solid ${item.accent}55`,
                  }}
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: INK }}>{item.label}</p>
                  <p className="text-xs" style={{ color: INK_SOFT }}>{item.desc}</p>
                </div>
                <span className="text-base flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: INK_SOFT }} aria-hidden="true">&rarr;</span>
              </Link>
            </motion.div>
          ))}
        </Stagger>
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
