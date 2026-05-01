import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import AgentCTACard from '../components/AgentCTACard';

const TEAL = '#00808a';

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

const ROLE_PACKS = [
  {
    id: 'teachers',
    role: 'For teachers',
    headline: 'Plan, adapt and feedback faster',
    desc: 'Lesson planning, differentiation, retrieval practice, whole-class feedback, parent updates and CPD reflection.',
    offer: 'teacher-prompt-pack',
    ctaLabel: 'Email me the teacher pack',
    examples: [
      'Create a lesson plan from a learning objective, class profile and likely misconceptions.',
      'Adapt this task for stretch, scaffold, EAL and dyslexia-friendly access.',
      'Turn common marking errors into a whole-class feedback slide and next-step task.',
    ],
  },
  {
    id: 'leaders',
    role: 'For school leaders',
    headline: 'Lead AI safely across your school',
    desc: 'Policy drafting, staff briefings, governor updates, risk registers, Ofsted preparation and implementation planning.',
    offer: 'leader-prompt-pack',
    ctaLabel: 'Email me the leadership pack',
    examples: [
      'Draft a one-page AI acceptable-use policy for staff consultation.',
      'Create a governor briefing that explains benefits, risks and safeguards.',
      'Build a phased AI rollout plan with owners, milestones and review points.',
    ],
  },
  {
    id: 'senco',
    role: 'For SENCOs',
    headline: 'Reduce SEND paperwork without losing professional judgement',
    desc: 'Provision mapping, EHCP review preparation, access arrangements, parent letters and classroom strategy sheets.',
    offer: 'senco-prompt-pack',
    ctaLabel: 'Email me the SENCO pack',
    examples: [
      'Summarise staff observations into neutral annual-review preparation notes.',
      'Generate classroom strategies from a learner profile and known barriers.',
      'Create an access-arrangements evidence checklist from assessment notes.',
    ],
  },
  {
    id: 'admin',
    role: 'For school admin',
    headline: 'Handle routine communication and templates faster',
    desc: 'Parent letters, meeting summaries, policy drafts, timetable notices and internal updates.',
    offer: 'admin-prompt-pack',
    ctaLabel: 'Email me the admin pack',
    examples: [
      'Rewrite a parent email so it is clear, calm and school-appropriate.',
      'Turn meeting notes into actions, owners and deadlines.',
      'Draft a concise reminder for attendance, trips or deadline communication.',
    ],
  },
  {
    id: 'parents',
    role: 'For parents',
    headline: 'Support learning at home without doing the work for them',
    desc: 'Homework help, revision plans, SEN advocacy, school communication and confidence-building routines.',
    offer: 'parent-prompt-pack',
    ctaLabel: 'Email me the parents pack',
    examples: [
      'Create a 20-minute revision routine for a reluctant GCSE learner.',
      'Rewrite a school email so it is firm, polite and evidence-based.',
      'Explain this homework task in simpler steps without giving the answer.',
    ],
  },
  {
    id: 'students',
    role: 'For students',
    headline: 'Use AI to study better, not shortcut learning',
    desc: 'Revision, essay planning, exam practice, feedback reflection, focus routines and study confidence.',
    offer: 'student-prompt-pack',
    ctaLabel: 'Email me the student pack',
    examples: [
      'Create a revision plan from my exam date, topics and confidence scores.',
      'Ask me Socratic questions to improve my essay argument.',
      'Turn this mark scheme into a checklist I can use before submitting.',
    ],
  },
];

const STEPS = [
  { n: '01', title: 'Choose your role', desc: 'Pick the section that matches you — teacher, parent, student, SENCO or school leader.' },
  { n: '02', title: 'Browse or search', desc: 'Filter by category, SEN focus area or key stage to find the right pack instantly.' },
  { n: '03', title: 'Copy the prompt', desc: 'Hit the copy button and paste straight into Claude, ChatGPT, Gemini or Perplexity.' },
  { n: '04', title: 'Adapt for your context', desc: 'Replace the bracketed placeholders — [topic], [child\'s name], [year group] — with your own details.' },
  { n: '05', title: 'Get better results', desc: 'Use the Promptly AI agent for a personalised prompt tailored to your exact situation.' },
];

function ExpandablePackCard({ pack }: { pack: typeof ROLE_PACKS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e6e0', background: 'white' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] rounded-2xl"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>{pack.role}</p>
        <h3 className="font-display text-lg leading-snug" style={{ color: 'var(--text)' }}>{pack.headline}</h3>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#6b6760' }}>{pack.desc}</p>
        <span className="inline-block mt-3 text-xs font-bold" style={{ color: TEAL }}>
          {open ? '▲ Less' : '▼ See example prompts'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: '#e8e6e0' }}>
              <ul className="space-y-2 mb-5">
                {pack.examples.map((ex, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: '#e0f5f6', color: TEAL }}>{i + 1}</span>
                    {ex}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { offer: pack.offer } }))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
                style={{ background: TEAL }}
              >
                {pack.ctaLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PromptsHub = () => {
  const [freePackEmail, setFreePackEmail] = useState('');
  const [freePackSent, setFreePackSent] = useState(false);
  const [freePackSending, setFreePackSending] = useState(false);

  const handleWidgetClick = () => {
    const trigger = document.getElementById('promptly-widget-trigger');
    if (trigger) trigger.click();
  };

  const handleFreePackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = freePackEmail.trim();
    if (!email) return;
    setFreePackSending(true);
    try {
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, offer: 'free-prompt-pack', page: '/prompts', source: 'getpromptly-site' }),
      });
    } catch { /* fail silently — still show success */ }
    setFreePackSent(true);
    setFreePackSending(false);
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

      {/* ── Agent CTA ── */}
      <section className="px-5 sm:px-8 py-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <AgentCTACard
            section="Promptly AI · Prompt Personaliser"
            headline="Create a prompt pack for my situation."
            description="Tell us your role, subject and what you need — our AI will craft the right prompts for you to copy and use instantly."
            prompts={[
              "Give me a differentiated lesson plan prompt for Year 9 English",
              "I'm a SENCO — show me EHCP review prompts",
              "Help me write a parent email about a behaviour concern",
              "Give my GCSE student a revision prompt for tomorrow's exam",
            ]}
            analyticsSection="prompts"
          />
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

      {/* Ready-to-Use Prompt Packs */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start mb-10">
            <div>
              <SectionLabel>Ready-to-Use Prompt Packs</SectionLabel>
              <h2 className="font-display text-3xl mt-2 mb-3" style={{ color: 'var(--text)' }}>
                Practical prompts for the work educators actually do.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#6b6760' }}>
                Choose a role, open a pack and get prompts for planning, feedback, SEND support, leadership, parent communication and admin workflows.
              </p>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>Start with the free pack</h3>
              <p className="text-sm mb-3" style={{ color: '#6b6760' }}>We'll email a role-specific starter pack you can copy into Claude, ChatGPT or Gemini today.</p>
              {freePackSent ? (
                <p className="text-sm font-semibold py-2" style={{ color: TEAL }}>✓ Check your inbox — pack sent!</p>
              ) : (
                <form onSubmit={handleFreePackSubmit} className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="free-pack-email" className="sr-only">Email address</label>
                  <input
                    id="free-pack-email"
                    type="email"
                    value={freePackEmail}
                    onChange={e => setFreePackEmail(e.target.value)}
                    placeholder="Your school email"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[#00808a]"
                    style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: 'var(--text)' }}
                  />
                  <button
                    type="submit"
                    disabled={freePackSending}
                    className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: TEAL }}
                  >
                    {freePackSending ? 'Sending…' : 'Get your free prompt pack'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLE_PACKS.map(pack => (
              <ExpandablePackCard key={pack.id} pack={pack} />
            ))}
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
