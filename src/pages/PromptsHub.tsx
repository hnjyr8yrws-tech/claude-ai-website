import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';

const STATS = [
  { value: '50', label: 'Prompt Packs' },
  { value: '440+', label: 'Ready-to-Copy Prompts' },
  { value: '9', label: 'Subject Categories' },
  { value: '8', label: 'SEN Focus Areas' },
  { value: 'Claude, ChatGPT & Gemini', label: 'Works With' },
];

const ROLES = [
  {
    title: 'For Teachers',
    desc: 'Lesson planning, feedback, differentiation, marking and CPD prompts.',
    to: '/prompts/teachers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8h8M7 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'For School Leaders',
    desc: 'Strategy, staff communication, Ofsted prep, policy drafting and school improvement.',
    to: '/prompts/school-leaders',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'For SENCOs',
    desc: 'EHCP support, SEND reviews, parent letters, access arrangements and provision mapping.',
    to: '/prompts/senco',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2L4 6v5c0 4.418 3.134 7.9 7 9 3.866-1.1 7-4.582 7-9V6l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'For Parents',
    desc: 'Homework help, revision support, communication with school and SEN advocacy.',
    to: '/prompts/parents',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 18c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 13c1.657 0 3 1.343 3 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'For Students',
    desc: 'Essay writing, revision, exam prep, study skills and focus techniques.',
    to: '/prompts/students',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 3L2 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 14l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'For School Admin',
    desc: 'Letters, templates, timetabling, data and communication prompts.',
    to: '/prompts/admin',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8h6M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const COLLECTIONS = [
  { label: 'Most Popular', to: '/prompts/library' },
  { label: 'Best for GCSE Students', to: '/prompts/students' },
  { label: 'Best for Primary Teachers', to: '/prompts/teachers' },
  { label: 'Best for SEND Support', to: '/prompts/senco' },
  { label: 'Best for Busy Parents', to: '/prompts/parents' },
  { label: 'Free Resources', to: '/prompts/library' },
];

const STEPS = [
  { n: '01', title: 'Choose your role', desc: 'Pick the section that matches you — teacher, parent, student, SENCO or school leader.' },
  { n: '02', title: 'Browse or search', desc: 'Filter by category, SEN focus area or key stage to find the right pack instantly.' },
  { n: '03', title: 'Copy the prompt', desc: 'Hit the copy button and paste straight into Claude, ChatGPT, Gemini or Perplexity.' },
  { n: '04', title: 'Adapt for your context', desc: 'Replace the bracketed placeholders — [topic], [child\'s name], [year group] — with your own details.' },
  { n: '05', title: 'Get better results', desc: 'Use the Promptly AI agent for a personalised prompt tailored to your exact situation.' },
];

const PromptsHub = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWidgetClick = () => {
    const trigger = document.getElementById('promptly-widget-trigger');
    if (trigger) trigger.click();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <SEO
        title="440+ AI Prompts for UK Education | GetPromptly"
        description="Free AI prompts for teachers, parents, students, SENCOs and school leaders. Copy-ready prompts for Claude, ChatGPT and Gemini."
        keywords="AI prompts UK education, teacher prompts, SENCO prompts, GCSE revision prompts, SEN prompts, ChatGPT prompts school"
        path="/prompts"
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>AI Prompts Library</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
            440+ Ready-to-Use AI Prompts for UK Education
          </h1>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: '#6b6760' }}>
            For teachers, parents, students, SENCOs and school leaders. Copy, adapt and use instantly with Claude, ChatGPT or Gemini.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/prompts/library"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={{ background: '#00808a', color: 'white' }}
            >
              Browse All 50 Packs
            </Link>
            <button
              onClick={handleWidgetClick}
              className="px-6 py-3 rounded-xl font-semibold text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={{ borderColor: '#00808a', color: '#00808a', background: 'white' }}
            >
              Get Instant Prompt Help
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-5 sm:px-8 py-6 border-y" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl border" style={{ borderColor: '#e8e6e0' }}>
              <div className="font-display text-2xl font-bold mb-1" style={{ color: '#00808a' }}>{s.value}</div>
              <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#9ca3af' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent CTA amber strip */}
      <section className="px-5 sm:px-8 py-4" style={{ background: '#fef3c7', borderBottom: '1px solid #fcd34d' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="text-sm font-medium" style={{ color: '#92400e' }}>
            Not sure where to start? Ask the Promptly AI for a personalised prompt recommendation →
          </p>
          <button
            onClick={handleWidgetClick}
            className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92400e]"
            style={{ background: '#92400e', color: 'white' }}
          >
            Ask the AI
          </button>
        </div>
      </section>

      {/* Role entry grid */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Find Your Prompts</SectionLabel>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>Choose your role</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group flex flex-col gap-3 p-5 rounded-2xl border bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
                style={{ borderColor: '#e8e6e0' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#00808a]"
                  style={{ background: '#e0f5f6', color: '#00808a' }}
                >
                  <span className="group-hover:text-white transition-colors">{r.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1 group-hover:text-[#00808a] transition-colors" style={{ color: 'var(--text)' }}>
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{r.desc}</p>
                </div>
                <span className="text-sm font-medium mt-auto" style={{ color: '#00808a' }}>
                  View prompts →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="px-5 sm:px-8 py-10 border-y" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#9ca3af' }}>Collections</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:border-[#00808a] hover:text-[#00808a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a]"
                style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>From prompt to result in seconds</h2>
          </div>
          <ol className="space-y-4" role="list">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-4 p-4 rounded-xl bg-white border" style={{ borderColor: '#e8e6e0' }}>
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: '#e0f5f6', color: '#00808a' }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: '#6b6760' }}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust note */}
      <section className="px-5 sm:px-8 py-8" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
              <strong style={{ color: '#1c1a15' }}>Important:</strong> These prompts support educators, families and learners. They do not replace professional teacher judgment, SEN support plans, EHCPs or clinical advice. Always adapt for the individual child's needs and school context.
            </p>
          </div>
        </div>
      </section>

      {/* Monetisation section */}
      <section className="px-5 sm:px-8 py-16" style={{ background: '#111210' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel className="text-[#00808a]">Access</SectionLabel>
            <h2 className="font-display text-3xl text-white mb-3">Free to use. More coming soon.</h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: '#6b6760' }}>
              Browse and copy all sample prompts — free forever. Premium packs and school bundles arriving soon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { label: 'Free tier', value: 'Browse and copy all sample prompts — free forever' },
              { label: 'Premium Pack Downloads', value: '£4.99–£9.99 per pack — coming soon' },
              { label: 'School Bundle', value: 'All 50 packs + agent access — £49/year — coming soon' },
            ].map((item) => (
              <div key={item.label} className="p-5 rounded-xl border" style={{ borderColor: '#2a2825' }}>
                <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: '#00808a' }}>{item.label}</p>
                <p className="text-sm" style={{ color: '#a09d98' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Email capture */}
          <div className="max-w-md mx-auto text-center">
            <p className="text-sm font-medium mb-3 text-white">Get notified when premium packs launch</p>
            {submitted ? (
              <p className="text-sm" style={{ color: '#00808a' }}>Thanks — we'll be in touch!</p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-[#00808a]"
                  style={{ background: '#1f1d1b', borderColor: '#2a2825', color: 'white' }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{ background: '#00808a', color: 'white' }}
                >
                  Notify me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Cross-sell strip */}
      <section className="px-5 sm:px-8 py-12" style={{ background: '#0d0d0b' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: '#3a3835' }}>Also from GetPromptly</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'AI Tools Directory', desc: 'Reviewed, safe AI tools for UK education.', to: '/tools' },
              { label: 'Equipment & Gear', desc: 'Assistive tech and classroom hardware.', to: '/equipment' },
              { label: 'AI Training', desc: 'Courses and CPD for educators using AI.', to: '/ai-training' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="p-4 rounded-xl border transition-colors hover:border-[#00808a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a]"
                style={{ borderColor: '#1f1d1b' }}
              >
                <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                <p className="text-xs" style={{ color: '#6b6760' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PromptsHub;
