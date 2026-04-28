/**
 * Home.tsx — GetPromptly.co.uk
 * Redesigned homepage: role-first, warm, guided.
 */

import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';

const TEAL   = '#00808a';
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
    color: '#e0f5f6',
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
    color: '#fef9c3',
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
    color: '#ede9fe',
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
    color: '#fce7f3',
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
    color: '#dcfce7',
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
    color: '#fff7ed',
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
    <div
      className="rounded-2xl shadow-2xl overflow-hidden"
      style={{ background: DARK, border: '1px solid #2a2825', maxWidth: 380 }}
    >
      <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: '1px solid #1f1d1b' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-xs font-semibold" style={{ color: 'white' }}>Promptly AI</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px]" style={{ color: '#22c55e' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} aria-hidden="true" />
          Online now
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex gap-2.5">
          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(0,128,138,0.25)', color: TEAL }}>P</div>
          <div className="rounded-xl rounded-tl-sm px-3 py-2.5 text-xs leading-relaxed max-w-[240px]" style={{ background: '#1a1815', color: '#d1cec8' }}>
            Hi! What is your role in education? I will find the right tools, training and prompts for you.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-xl rounded-tr-sm px-3 py-2.5 text-xs" style={{ background: TEAL, color: 'white' }}>
            I am a primary school teacher
          </div>
        </div>
        <div className="flex gap-2.5">
          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(0,128,138,0.25)', color: TEAL }}>P</div>
          <div className="rounded-xl rounded-tl-sm px-3 py-2.5 text-xs leading-relaxed max-w-[240px]" style={{ background: '#1a1815', color: '#d1cec8' }}>
            Great! Here are my top picks for primary teachers right now...
          </div>
        </div>
        <div className="ml-8 rounded-xl border p-3 space-y-2.5" style={{ background: '#111210', borderColor: '#2a2825' }}>
          {[{ name: 'MagicSchool', score: 9.1 }, { name: 'Curipod', score: 8.4 }].map(t => (
            <div key={t.name} className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold" style={{ color: 'white' }}>{t.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,128,138,0.2)', color: TEAL }}>{t.score}</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Trusted</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#1a1815', border: '1px solid #2a2825' }}>
          <span className="text-xs flex-1" style={{ color: '#4b5563' }}>Ask anything about AI in education...</span>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: TEAL }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* Floating scorecard */}
    <div
      className="absolute -bottom-4 -left-6 rounded-2xl shadow-xl p-3.5"
      style={{ background: 'white', border: `1px solid ${BORDER}`, minWidth: 160 }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>Safety Score</p>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="font-display text-2xl leading-none" style={{ color: TEAL }}>9.1</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#15803d' }}>Trusted</span>
      </div>
      {[{ label: 'Data Privacy', w: 90 }, { label: 'Safeguarding', w: 95 }, { label: 'Accessibility', w: 85 }].map(r => (
        <div key={r.label} className="mb-1">
          <span className="text-[9px]" style={{ color: '#9ca3af' }}>{r.label}</span>
          <div className="h-1 rounded-full mt-0.5" style={{ background: BORDER }}>
            <div className="h-1 rounded-full" style={{ width: `${r.w}%`, background: TEAL }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Hero: FC = () => (
  <section className="relative overflow-hidden" style={{ background: BG }}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,128,138,0.06) 0%, transparent 70%)' }} />
      <svg className="absolute right-0 top-0 opacity-[0.025]" width="400" height="400" aria-hidden="true">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#00808a"/>
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#dots)"/>
      </svg>
    </div>

    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(0,128,138,0.08)', color: TEAL, border: '1px solid rgba(0,128,138,0.18)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} aria-hidden="true" />
            UK Education &middot; KCSIE 2025 &middot; Independent
          </span>

          <h1 className="font-display leading-[1.08] mb-5" style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)', color: '#1c1a15' }}>
            Stop Guessing with AI.<br />
            <em style={{ color: TEAL, fontStyle: 'italic' }}>Start Getting Promptly.</em>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-md" style={{ color: '#6b6760' }}>
            The UK's trusted platform for AI in education. Tools, training, equipment and prompts &mdash; curated for teachers, leaders, SENCOs, parents and students.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                track({ name: 'cta_clicked', section: 'home-hero', label: 'Start with your role' });
                document.getElementById('role-selector')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2"
              style={{ background: TEAL, color: 'white' }}
            >
              Start with your role &rarr;
            </button>
            <button
              onClick={() => { track({ name: 'cta_clicked', section: 'home-hero', label: 'Ask Promptly AI' }); openWidget(); }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2"
              style={{ borderColor: BORDER, color: '#1c1a15' }}
            >
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: TEAL }} />
                <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: TEAL }} />
              </span>
              Ask Promptly AI
            </button>
          </div>

          <p className="mt-5 text-xs" style={{ color: '#9ca3af' }}>Free to use &middot; No account required &middot; UK-focused</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.15 }} className="hidden lg:flex justify-end" aria-hidden="true">
          <AgentMockup />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-14 pt-8 flex flex-wrap gap-8 sm:gap-12"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        {[
          { n: '155',  label: 'AI tools reviewed' },
          { n: '96',   label: 'equipment products' },
          { n: '440+', label: 'prompts ready to use' },
          { n: '24/7', label: 'AI agent support' },
        ].map(s => (
          <div key={s.label}>
            <div className="font-display text-2xl sm:text-3xl leading-none mb-0.5" style={{ color: TEAL }}>{s.n}</div>
            <div className="text-[11px]" style={{ color: '#9ca3af' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

// ─── 2. Trust strip ────────────────────────────────────────────────────────────

const TrustStrip: FC = () => (
  <div style={{ background: 'white', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-5 sm:gap-10">
      {['KCSIE 2025 Aligned', 'UK GDPR Compliant', '100% Independent', 'No Sponsored Rankings', 'Free to use'].map(label => (
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
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Start here</p>
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={active === r.id
                ? { background: TEAL, color: 'white', borderColor: TEAL }
                : { background: 'white', color: '#6b6760', borderColor: BORDER }
              }
              aria-pressed={active === r.id}
            >
              <span aria-hidden="true">{r.emoji}</span>
              {r.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl p-7 flex flex-col justify-between" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 rounded-2xl text-2xl flex items-center justify-center flex-shrink-0" style={{ background: role.color }} aria-hidden="true">
                    {role.emoji}
                  </span>
                  <div>
                    <p className="font-semibold text-base" style={{ color: '#1c1a15' }}>{role.label}</p>
                    <p className="text-xs font-medium" style={{ color: TEAL }}>{role.tagline}</p>
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
                  style={{ background: TEAL, color: 'white' }}>
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
                    <span className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,128,138,0.2)', color: TEAL }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium flex-1" style={{ color: '#d1cec8' }}>{t}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>Safe</span>
                  </div>
                ))}
              </div>
              <Link to="/tools" onClick={() => track({ name: 'cta_clicked', section: 'home-roles-tools', label: 'View all tools' })}
                className="mt-5 text-center text-xs font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-80"
                style={{ background: 'rgba(0,128,138,0.15)', color: TEAL }}>
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
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>How it works</p>
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
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(0,128,138,0.1)', color: TEAL }}>
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

// ─── 5. Safety scoring preview ────────────────────────────────────────────────

const SAMPLE_TOOLS = [
  { name: 'MagicSchool', category: 'Teacher AI',  overall: 9.1, tier: 'Trusted', tierColor: '#22c55e', tierBg: 'rgba(34,197,94,0.1)',  scores: [9, 9, 9, 8, 9] },
  { name: 'Curipod',     category: 'Lesson Design', overall: 8.4, tier: 'Trusted', tierColor: '#22c55e', tierBg: 'rgba(34,197,94,0.1)',  scores: [8, 9, 8, 8, 8] },
  { name: 'ChatGPT',     category: 'General AI',  overall: 6.8, tier: 'Guided',  tierColor: '#f59e0b', tierBg: 'rgba(245,158,11,0.1)', scores: [7, 6, 5, 8, 8] },
];
const PILLARS = ['Data Privacy', 'Safeguarding', 'Age Suitability', 'Transparency', 'Accessibility'];

const ScoringPreview: FC = () => (
  <section style={{ background: BG }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Our trust framework</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: '#1c1a15' }}>
            Every tool scored across<br />five UK safety pillars.
          </h2>
          <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: '#6b6760' }}>
            We assess every AI tool against KCSIE 2025, UK GDPR and DfE guidance. No paid placements, no sponsored rankings.
          </p>
          <div className="space-y-2.5 mb-8">
            {PILLARS.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(0,128,138,0.1)', color: TEAL }}>{i + 1}</div>
                <span className="text-sm font-medium" style={{ color: '#1c1a15' }}>{label}</span>
              </div>
            ))}
          </div>
          <Link to="/safety-methodology" onClick={() => track({ name: 'cta_clicked', section: 'home-scoring', label: 'See methodology' })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: TEAL }}>
            See our full methodology &rarr;
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-3">
            {SAMPLE_TOOLS.map((tool, i) => (
              <motion.div key={tool.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-2xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1c1a15' }}>{tool.name}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl leading-none" style={{ color: TEAL }}>{tool.overall}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: tool.tierBg, color: tool.tierColor }}>{tool.tier}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {PILLARS.map((label, j) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-[10px] w-24 flex-shrink-0" style={{ color: '#9ca3af' }}>{label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                        <motion.div className="h-full rounded-full"
                          style={{ background: tool.scores[j] >= 8 ? TEAL : tool.scores[j] >= 6 ? '#f59e0b' : '#ef4444' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tool.scores[j] * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold w-4 text-right" style={{ color: '#6b6760' }}>{tool.scores[j]}</span>
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
    role: 'Teacher', emoji: '\u{1F4DA}', color: '#e0f5f6',
    headline: 'Save hours every week',
    items: [
      { label: 'Lesson Planning Prompts', to: '/prompts/teachers', tag: 'Prompts' },
      { label: 'Safest Classroom AI Tools', to: '/tools', tag: 'Tools' },
      { label: 'Free AI CPD (GOV.UK backed)', to: '/ai-training/free', tag: 'Training' },
    ],
    cta: { label: 'Teacher pathway', to: '/prompts/teachers' },
  },
  {
    role: 'SENCO', emoji: '\u{1F91D}', color: '#ede9fe',
    headline: 'SEND-specific guidance in one place',
    items: [
      { label: 'EHCP and SEND Prompts', to: '/prompts/senco', tag: 'Prompts' },
      { label: 'Assistive Technology Guide', to: '/ai-equipment/send', tag: 'Equipment' },
      { label: 'SEND-focused AI Training', to: '/ai-training/send', tag: 'Training' },
    ],
    cta: { label: 'SENCO pathway', to: '/prompts/senco' },
  },
  {
    role: 'School Leader', emoji: '\u{1F3EB}', color: '#fef9c3',
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
  Prompts:   { bg: '#dcfce7', text: '#15803d' },
  Tools:     { bg: '#e0f5f6', text: TEAL },
  Training:  { bg: '#fef9c3', text: '#854d0e' },
  Equipment: { bg: '#ede9fe', text: '#7c3aed' },
};

const CuratedPathways: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Curated pathways</p>
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
                <div className="text-3xl mb-3" aria-hidden="true">{p.emoji}</div>
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
                  style={{ borderColor: BORDER, color: TEAL }}>
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
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3 opacity-70" style={{ color: 'white' }}>Free prompt pack</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'white' }}>Get 20 free prompts for your role.</h2>
          <p className="text-sm mb-8 opacity-80 max-w-md mx-auto" style={{ color: 'white' }}>
            Enter your email and we will send you 20 ready-to-use AI prompts tailored for UK education, free, no account needed.
          </p>
          {done ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Sent! Check your inbox.
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
          <p className="mt-4 text-[11px] opacity-60" style={{ color: 'white' }}>No spam. Unsubscribe anytime. We respect UK GDPR.</p>
        </FadeIn>
      </div>
    </section>
  );
};

// ─── 8. Platform nav ──────────────────────────────────────────────────────────

const NAV_CARDS = [
  { title: 'AI Tools Hub',     stat: '155 tools reviewed',  desc: 'Every tool scored against KCSIE 2025 and UK GDPR. Filter by role, safety tier and price.', to: '/tools',        color: '#e0f5f6' },
  { title: 'AI Training',      stat: '26 courses',          desc: 'Free government-backed CPD and paid certification for teachers, leaders and SENCOs.',       to: '/ai-training',  color: '#fef9c3' },
  { title: 'Equipment',        stat: '96 products',         desc: 'Classroom tech, SEND assistive devices, coding robots and home learning hardware.',           to: '/ai-equipment', color: '#ede9fe' },
  { title: 'Prompts Library',  stat: '440+ prompts',        desc: 'Ready-to-copy prompts for teachers, SENCOs, leaders, parents and students.',                  to: '/prompts',      color: '#dcfce7' },
];

const PlatformNav: FC = () => (
  <section style={{ background: BG }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>The platform</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: '#1c1a15' }}>Four sections. One trusted source.</h2>
        <p className="text-sm mb-10 max-w-lg" style={{ color: '#6b6760' }}>
          Tools, training, equipment and prompts, all independently reviewed for UK education.
        </p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NAV_CARDS.map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.07}>
            <Link to={c.to} onClick={() => track({ name: 'cta_clicked', section: 'home-platform-nav', label: c.title })}
              className="group flex flex-col h-full rounded-2xl border transition-all hover:border-[#00808a] hover:shadow-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={{ borderColor: BORDER, background: 'white' }}>
              <div className="px-5 pt-5 pb-4" style={{ background: c.color }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-lg" style={{ background: 'rgba(255,255,255,0.7)', color: TEAL }} aria-hidden="true">
                  {c.title[3]}
                </div>
              </div>
              <div className="flex-1 flex flex-col p-5">
                <p className="font-semibold text-sm mb-0.5 group-hover:text-[#00808a] transition-colors" style={{ color: '#1c1a15' }}>{c.title}</p>
                <p className="text-[10px] font-semibold mb-3" style={{ color: TEAL }}>{c.stat}</p>
                <p className="text-xs leading-relaxed flex-1" style={{ color: '#6b6760' }}>{c.desc}</p>
                <span className="mt-4 text-xs font-semibold" style={{ color: TEAL }}>Browse &rarr;</span>
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
  <section style={{ background: DARK }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>For schools &amp; trusts</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'white' }}>Whole-school AI advisory, without the jargon.</h2>
        <p className="text-sm leading-relaxed max-w-md mb-8" style={{ color: '#9ca3af' }}>
          GetPromptly helps headteachers, SENCOs, IT leads and business managers make informed decisions about AI tools, staff training, SEND technology and procurement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/schools" onClick={() => track({ name: 'cta_clicked', section: 'home-schools-cta', label: 'For Schools page' })}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 text-center"
            style={{ background: TEAL, color: 'white' }}>
            GetPromptly for Schools &rarr;
          </Link>
          <button onClick={() => { track({ name: 'cta_clicked', section: 'home-schools-cta', label: 'Request consultation' }); openWidget(); }}
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
            style={{ borderColor: '#374151', color: '#9ca3af' }}>
            Request a consultation
          </button>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="space-y-3">
          {[
            { emoji: '\u{1F512}', label: 'AI Tools',     desc: '155 tools reviewed against KCSIE 2025', to: '/tools' },
            { emoji: '\u{1F393}', label: 'Staff CPD',    desc: 'Free and paid training for all school roles', to: '/ai-training' },
            { emoji: '\u{1F5A5}', label: 'Equipment',    desc: 'Procurement guidance and SEND assistive tech', to: '/ai-equipment/schools' },
            { emoji: '\u{1F4DD}', label: 'Prompt Packs', desc: '440+ prompts for teachers, SENCOs and leaders', to: '/prompts' },
          ].map(item => (
            <Link key={item.label} to={item.to} onClick={() => track({ name: 'cta_clicked', section: 'home-schools-links', label: item.label })}
              className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[#00808a] group"
              style={{ borderColor: '#2a2825', background: '#1a1815' }}>
              <span className="text-lg flex-shrink-0" aria-hidden="true">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold group-hover:text-[#00808a] transition-colors" style={{ color: 'white' }}>{item.label}</p>
                <p className="text-xs" style={{ color: '#6b6760' }}>{item.desc}</p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: '#374151' }} aria-hidden="true">&rarr;</span>
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
