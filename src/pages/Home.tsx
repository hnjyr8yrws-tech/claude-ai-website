/**
 * Home.tsx — GetPromptly.co.uk
 * Homepage: UK education AI advisory platform for all audiences.
 */

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const TEAL = '#00808a';
const DARK = '#111210';

function openWidget() {
  const btn = document.getElementById('promptly-widget-trigger');
  if (btn) (btn as HTMLButtonElement).click();
}

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

const Hero: FC = () => (
  <section
    className="relative overflow-hidden"
    style={{ background: '#f7f6f2' }}
  >
    {/* Teal radial glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 18% 50%, rgba(0,128,138,0.07) 0%, transparent 70%)',
      }}
    />

    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        {/* Eyebrow */}
        <span
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase px-4 py-2 rounded-full mb-8 border"
          style={{ background: 'rgba(0,128,138,0.07)', color: TEAL, borderColor: 'rgba(0,128,138,0.2)' }}
        >
          UK Education · KCSIE 2025 · Independent
        </span>

        {/* H1 */}
        <h1
          className="font-display leading-[1.06] mb-6"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', color: 'var(--text)' }}
        >
          The UK's Most Trusted<br />
          <em style={{ color: TEAL, fontStyle: 'italic' }}>AI Advisory Platform for Education.</em>
        </h1>

        <p
          className="text-base sm:text-lg mb-10 max-w-xl leading-relaxed"
          style={{ color: '#6b6760' }}
        >
          Tools, training, equipment and prompts — curated for teachers, school leaders, parents and students. With 24/7 AI agents to guide you.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/tools"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            Explore the Platform →
          </Link>
          <button
            onClick={openWidget}
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white"
            style={{ borderColor: '#d1cec8', color: '#6b6760' }}
          >
            Ask Our Agent
          </button>
          <Link
            to="/ai-equipment/schools"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white"
            style={{ borderColor: '#d1cec8', color: '#6b6760' }}
          >
            For Schools →
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-14 flex flex-wrap gap-6 sm:gap-10"
      >
        {[
          { n: '120+', label: 'AI tools reviewed' },
          { n: '96',   label: 'equipment products' },
          { n: '440+', label: 'ready-to-use prompts' },
          { n: '24/7', label: 'AI agent guidance' },
        ].map(s => (
          <div key={s.label}>
            <div className="font-display text-3xl leading-none" style={{ color: TEAL }}>{s.n}</div>
            <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

// ─── 2. Who it's for ──────────────────────────────────────────────────────────

const ROLES = [
  { role: 'Teachers',       desc: 'Lesson planning, marking, differentiation, CPD and classroom AI tools',           to: '/prompts/teachers',      color: '#e0f5f6' },
  { role: 'School Leaders', desc: 'AI strategy, staff comms, Ofsted prep, policy drafting and school improvement',   to: '/prompts/school-leaders', color: '#fef9c3' },
  { role: 'SENCOs',         desc: 'EHCP support, SEND reviews, access arrangements and provision mapping',            to: '/prompts/senco',          color: '#ede9fe' },
  { role: 'Parents',        desc: 'Homework help, revision support, school communication and SEN advocacy',           to: '/prompts/parents',        color: '#fce7f3' },
  { role: 'Students',       desc: 'Essay writing, revision, exam prep, study skills and focus techniques',            to: '/prompts/students',       color: '#dcfce7' },
  { role: 'School Admin',   desc: 'Letters, templates, timetabling, data and communication prompts',                  to: '/prompts/admin',          color: '#fff7ed' },
];

const WhoItsFor: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Built for everyone</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'var(--text)' }}>
          Which role are you?
        </h2>
        <p className="text-sm mb-10 max-w-lg" style={{ color: '#6b6760' }}>
          GetPromptly serves the whole school community — not just one audience.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((r, i) => (
          <FadeIn key={r.role} delay={i * 0.06}>
            <Link
              to={r.to}
              className="group flex flex-col gap-3 p-5 rounded-2xl border transition-all hover:border-[#00808a] hover:shadow-sm"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <span
                className="w-8 h-8 rounded-lg text-base flex items-center justify-center"
                style={{ background: r.color }}
              >
                {r.role[0]}
              </span>
              <div>
                <p className="font-semibold text-sm mb-1 group-hover:text-[#00808a] transition-colors" style={{ color: 'var(--text)' }}>
                  {r.role}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{r.desc}</p>
              </div>
              <span className="text-xs font-semibold mt-auto" style={{ color: TEAL }}>
                Explore prompts →
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 3. What we cover ─────────────────────────────────────────────────────────

const PILLARS = [
  {
    title: 'AI Tools',
    stat: '120+',
    sub: 'tools reviewed',
    desc: 'Every major AI tool assessed against UK safety standards — KCSIE 2025, UK GDPR and Ofsted. With safety scores and independent editorial.',
    link: '/tools',
    cta: 'Browse tools →',
    accent: '#e0f5f6',
  },
  {
    title: 'AI Training',
    stat: '26+',
    sub: 'training resources',
    desc: 'Free and paid CPD for teachers, leaders, parents and students. UK Government-backed resources through to premium certifications.',
    link: '/ai-training',
    cta: 'Browse training →',
    accent: '#fef9c3',
  },
  {
    title: 'AI Equipment',
    stat: '96',
    sub: 'products curated',
    desc: 'Classroom technology, SEND assistive tech, coding robots, AAC devices and home learning hardware — independently reviewed.',
    link: '/ai-equipment',
    cta: 'Browse equipment →',
    accent: '#ede9fe',
  },
  {
    title: 'AI Prompts',
    stat: '440+',
    sub: 'ready-to-copy prompts',
    desc: 'Fifty curated prompt packs for every education role — lesson planning, EHCP support, exam prep, parent comms and more.',
    link: '/prompts',
    cta: 'Browse prompts →',
    accent: '#dcfce7',
  },
];

const WhatWeCover: FC = () => (
  <section style={{ background: '#f7f6f2' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Four sections. One platform.</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-10" style={{ color: 'var(--text)' }}>
          Everything you need to navigate AI in education.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PILLARS.map((p, i) => (
          <FadeIn key={p.title} delay={i * 0.07}>
            <div
              className="rounded-2xl border p-6 flex flex-col h-full"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-display text-lg"
                style={{ background: p.accent, color: TEAL }}
              >
                {p.title[3]}
              </div>
              <div className="mb-3">
                <span className="font-display text-3xl" style={{ color: TEAL }}>{p.stat}</span>
                <span className="text-xs ml-1.5" style={{ color: '#9ca3af' }}>{p.sub}</span>
              </div>
              <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: '#6b6760' }}>{p.desc}</p>
              <Link to={p.link} className="text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
                {p.cta}
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 4. 24/7 Agents ──────────────────────────────────────────────────────────

const AGENT_FEATURES = [
  { title: 'Always available',     desc: 'No appointment needed — available 24 hours a day, 7 days a week.' },
  { title: 'Trained on our data',  desc: 'Draws on our full reviewed database of tools, equipment, training and prompts.' },
  { title: 'Role-aware',           desc: 'Gives different guidance to teachers, parents, SENCOs and school leaders.' },
  { title: 'UK-standards focused', desc: 'Built around KCSIE 2025, UK GDPR and DfE guidance — not generic AI advice.' },
];

const AgentsSection: FC = () => (
  <section style={{ background: DARK }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
          Not just a directory
        </p>
        <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'white' }}>
          A guided decision platform.
        </h2>
        <p className="text-sm sm:text-base max-w-xl mb-12 leading-relaxed" style={{ color: '#9ca3af' }}>
          Every section of GetPromptly has a live AI agent that answers questions, compares options and recommends the right tools in real time.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {AGENT_FEATURES.map((f, i) => (
          <FadeIn key={f.title} delay={i * 0.07}>
            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: '#2a2825', background: '#1a1815' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mb-3"
                style={{ background: 'rgba(0,128,138,0.2)', color: TEAL }}
              >
                ✓
              </div>
              <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'white' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6b6760' }}>{f.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <button
          onClick={openWidget}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: TEAL, color: 'white' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
          Ask the 24/7 agent now →
        </button>
      </FadeIn>
    </div>
  </section>
);

// ─── 5. Featured collections ──────────────────────────────────────────────────

const COLLECTIONS = [
  { label: 'Safest AI Tools for UK Classrooms',  to: '/tools',              tag: 'Tools' },
  { label: 'Best Free Teacher CPD',              to: '/ai-training/free',   tag: 'Training' },
  { label: 'Top Classroom Technology 2026',      to: '/ai-equipment/teachers', tag: 'Equipment' },
  { label: 'Ready-to-Use Prompts for Teachers',  to: '/prompts/teachers',   tag: 'Prompts' },
  { label: 'Home Learning Setup for Parents',    to: '/ai-equipment/parents', tag: 'Equipment' },
  { label: 'Best SEND & Assistive Tech',         to: '/ai-equipment/send',  tag: 'Equipment' },
  { label: 'AI for School Leaders',              to: '/prompts/school-leaders', tag: 'Prompts' },
  { label: 'Student Revision Prompts',           to: '/prompts/students',   tag: 'Prompts' },
];

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Tools:     { bg: '#e0f5f6', color: TEAL },
  Training:  { bg: '#fef9c3', color: '#854d0e' },
  Equipment: { bg: '#ede9fe', color: '#7c3aed' },
  Prompts:   { bg: '#dcfce7', color: '#15803d' },
};

const FeaturedCollections: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>
          Popular right now
        </p>
        <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
          Featured collections.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLLECTIONS.map((c, i) => {
          const tc = TAG_COLORS[c.tag] ?? { bg: '#f3f4f6', color: '#6b7280' };
          return (
            <FadeIn key={c.label} delay={i * 0.04}>
              <Link
                to={c.to}
                className="group flex flex-col gap-3 p-4 rounded-2xl border transition-all hover:border-[#00808a] hover:shadow-sm"
                style={{ borderColor: '#e8e6e0', background: '#f7f6f2', minHeight: 100 }}
              >
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full self-start"
                  style={{ background: tc.bg, color: tc.color }}
                >
                  {c.tag}
                </span>
                <p className="text-sm font-medium leading-snug group-hover:text-[#00808a] transition-colors" style={{ color: 'var(--text)' }}>
                  {c.label}
                </p>
                <span className="text-xs font-semibold mt-auto" style={{ color: TEAL }}>View →</span>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── 6. How it works ──────────────────────────────────────────────────────────

const HOW_STEPS = [
  { n: '01', title: 'Tell us your role',               desc: 'Select your role in the AI agent or on any role page — the platform adapts to you.' },
  { n: '02', title: 'Browse curated recommendations', desc: 'Every tool, training resource, product and prompt is independently reviewed for UK education.' },
  { n: '03', title: 'Compare with UK safety scores',   desc: 'Our 5-pillar safety scoring covers data privacy, age appropriateness, transparency, safeguarding and accessibility.' },
  { n: '04', title: 'Use prompts instantly',           desc: 'Copy any prompt and paste it directly into Claude, ChatGPT or Gemini — no account needed.' },
  { n: '05', title: 'Get real-time help',               desc: 'Our 24/7 agents answer follow-up questions, personalise recommendations and guide next steps.' },
];

const HowItWorks: FC = () => (
  <section style={{ background: '#f7f6f2' }}>
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Simple process</p>
        <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
          How GetPromptly works.
        </h2>
      </FadeIn>

      <div className="space-y-4">
        {HOW_STEPS.map((step, i) => (
          <FadeIn key={step.n} delay={i * 0.06}>
            <div
              className="flex gap-5 p-5 rounded-xl border"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <span className="font-display text-2xl flex-shrink-0 w-10 text-center leading-none mt-0.5" style={{ color: TEAL }}>
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{step.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{step.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 7. Testimonials ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: '[Testimonial from a UK secondary teacher about how GetPromptly helped them find the right AI tool for their classroom.]',
    name: 'Secondary School Teacher',
    role: 'Year 9 English',
    location: 'Yorkshire',
  },
  {
    quote: '[Testimonial from a SENCO about using the EHCP prompts and SEND equipment recommendations to support a student with complex needs.]',
    name: 'SENCO',
    role: 'Special Educational Needs Co-ordinator',
    location: 'West Midlands',
  },
  {
    quote: "[Testimonial from a parent about how the AI training resources and prompts helped them support their child's revision at home.]",
    name: 'Parent',
    role: 'Parent of Year 11 student',
    location: 'London',
  },
];

const Testimonials: FC = () => (
  <section style={{ background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>What people say</p>
        <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
          Trusted across UK education.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <FadeIn key={t.name} delay={i * 0.08}>
            <div
              className="rounded-2xl border p-6 flex flex-col gap-4"
              style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}
            >
              <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
                <path d="M0 18V10.8C0 7.6 1 4.9 3 2.7S7.4 0 10.8 0v3.6C8.8 3.6 7.2 4.3 6 5.7S4.2 8.8 4.2 10.8H8.4V18H0ZM15.6 18V10.8c0-3.2 1-5.9 3-8.1S23.4 0 26.4 0v3.6c-2 0-3.6.7-4.8 2.1s-1.8 3.1-1.8 5.1H24V18h-8.4Z" fill="#e8e6e0"/>
              </svg>
              <p className="text-sm leading-relaxed flex-1 italic" style={{ color: '#6b6760' }}>{t.quote}</p>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{t.name}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>{t.role} · {t.location}</p>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full self-start"
                style={{ background: '#e0f5f6', color: '#6b6760' }}
              >
                Placeholder — replace with real testimonials
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── 8. Schools CTA ───────────────────────────────────────────────────────────

const SchoolsCTA: FC = () => (
  <section style={{ background: DARK }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <FadeIn>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
          For schools
        </p>
        <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'white' }}>
          GetPromptly for Schools.
        </h2>
        <p className="text-sm leading-relaxed max-w-md mb-8" style={{ color: '#9ca3af' }}>
          Advisory support for AI tools, staff training, SEND technology and whole-school prompt packs. Talk to our team about what your school needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={openWidget}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            Request a Consultation
          </button>
          <Link
            to="/ai-equipment/schools"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
            style={{ borderColor: '#374151', color: '#9ca3af' }}
          >
            Explore School Solutions →
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="space-y-3">
          {[
            { label: 'AI Tools', desc: '120+ tools reviewed with KCSIE safety scores', to: '/tools' },
            { label: 'Staff Training', desc: 'Free and paid CPD for all school roles', to: '/ai-training/teachers' },
            { label: 'Equipment', desc: 'Classroom tech, SEND assistive tech and class packs', to: '/ai-equipment/schools' },
            { label: 'Prompt Packs', desc: '440+ prompts for teachers, SENCOs and leaders', to: '/prompts/teachers' },
          ].map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[#00808a] group"
              style={{ borderColor: '#2a2825', background: '#1a1815' }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'rgba(0,128,138,0.2)', color: TEAL }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold group-hover:text-[#00808a] transition-colors" style={{ color: 'white' }}>
                  {item.label}
                </p>
                <p className="text-xs truncate" style={{ color: '#6b6760' }}>{item.desc}</p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: '#374151' }}>→</span>
            </Link>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

// ─── 9. Latest articles (placeholder) ────────────────────────────────────────

const ARTICLES = [
  {
    tag: 'AI Tools',
    title: 'The Safest AI Tools for UK Classrooms in 2026',
    excerpt: 'Our independent assessment of the most KCSIE-aligned AI tools available to UK schools right now.',
    date: 'Coming soon',
  },
  {
    tag: 'Training',
    title: 'Free AI Training Every UK Teacher Should Know About',
    excerpt: "From GOV.UK's AI Skills Hub to Google AI Essentials — the best free CPD available right now.",
    date: 'Coming soon',
  },
  {
    tag: 'Equipment',
    title: 'Best Interactive Displays for UK Schools 2026',
    excerpt: 'SMART vs Promethean vs Clevertouch — our independent comparison for school procurement leads.',
    date: 'Coming soon',
  },
];

const LatestArticles: FC = () => (
  <section style={{ background: '#f7f6f2' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeIn>
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>Editorial</p>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>Latest from GetPromptly.</h2>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: '#e0f5f6', color: TEAL }}
          >
            Coming soon
          </span>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {ARTICLES.map((a, i) => (
          <FadeIn key={a.title} delay={i * 0.07}>
            <div
              className="rounded-2xl border flex flex-col"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              {/* Placeholder image */}
              <div
                className="h-36 rounded-t-2xl flex items-center justify-center"
                style={{ background: '#e8e6e0' }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>
                  Image placeholder
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full self-start"
                  style={{ background: '#e0f5f6', color: TEAL }}
                >
                  {a.tag}
                </span>
                <h3 className="font-display text-lg leading-snug" style={{ color: 'var(--text)' }}>{a.title}</h3>
                <p className="text-xs leading-relaxed flex-1" style={{ color: '#9ca3af' }}>{a.excerpt}</p>
                <p className="text-[10px] font-semibold" style={{ color: '#c5c2bb' }}>{a.date}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ─── Trust bar ────────────────────────────────────────────────────────────────

const TrustBar: FC = () => (
  <section style={{ background: 'white', borderTop: '1px solid #e8e6e0', borderBottom: '1px solid #e8e6e0' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
      {[
        'KCSIE 2025 Aligned',
        'UK GDPR Compliant',
        'ICO Registered',
        '100% Independent',
        'No Sponsored Rankings',
      ].map(label => (
        <span key={label} className="flex items-center gap-2 text-xs font-medium" style={{ color: '#9ca3af' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
          {label}
        </span>
      ))}
    </div>
  </section>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Home: FC = () => (
  <>
    <SEO
      title="GetPromptly — The UK's AI Advisory Platform for Education"
      description="Tools, training, equipment and prompts curated for UK teachers, school leaders, parents and students. With 24/7 AI agents to guide every decision."
      keywords="AI tools for UK schools, AI training for teachers, KCSIE AI tools, school AI guidance, AI prompts for education, SEND assistive technology UK"
      path="/"
    />
    <Hero />
    <TrustBar />
    <WhoItsFor />
    <WhatWeCover />
    <AgentsSection />
    <FeaturedCollections />
    <HowItWorks />
    <Testimonials />
    <SchoolsCTA />
    <LatestArticles />
  </>
);

export default Home;
