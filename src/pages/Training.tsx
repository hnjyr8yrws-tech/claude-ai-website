import { FC, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/SectionLabel';
import SEO from '../components/SEO';

const TEAL = '#00808a';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab    = 'free' | 'paid';
type Role   = 'Teacher' | 'SLT' | 'SEND' | 'Safeguarding' | 'Admin' | 'IT' | 'Parent' | 'Student';
type Goal   = '' | 'Use AI tools confidently' | 'Lead AI strategy for my school' | 'Support SEND pupils with AI' | 'Keep up with KCSIE' | 'Build AI literacy for students';

interface FreeCourse {
  id: number;
  title: string;
  provider: string;
  logo: string;
  duration: string;
  roles: Role[];
  desc: string;
  url: string;
}

interface PaidCourse {
  id: number;
  title: string;
  provider: string;
  logo: string;
  price: string;
  stars: number | null;
  students?: string;
  roles: Role[];
  badge: 'Promptly Recommended' | 'Own Product' | 'Coming Soon';
  comingSoon?: boolean;
  desc: string;
  url: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FREE_COURSES: FreeCourse[] = [
  {
    id: 1,
    title: 'Oak National Academy AI CPD',
    provider: 'Oak National Academy',
    logo: '🌳',
    duration: 'Self-paced · 4 hrs',
    roles: ['Teacher', 'SLT'],
    desc: 'DfE-funded CPD designed specifically for UK classroom teachers. Practical AI integration, no fluff.',
    url: '#',
  },
  {
    id: 2,
    title: 'Google AI Fundamentals for Educators',
    provider: 'Google',
    logo: '♊',
    duration: 'Self-paced · 8 hrs · Certificate',
    roles: ['Teacher', 'Admin'],
    desc: 'Free certification covering Gemini, prompt engineering, and responsible AI. Shareable on LinkedIn.',
    url: '#',
  },
  {
    id: 3,
    title: 'NSPCC Online Safety CPD',
    provider: 'NSPCC',
    logo: '🛡️',
    duration: 'Short modules · 2 hrs',
    roles: ['Safeguarding', 'Teacher', 'SLT'],
    desc: 'Safeguarding-first AI literacy. Covers deepfakes, AI-generated CSAM risks, and KCSIE duties.',
    url: '#',
  },
  {
    id: 4,
    title: 'Microsoft Educator Centre',
    provider: 'Microsoft',
    logo: '🪁',
    duration: 'Self-paced · Varies',
    roles: ['Teacher', 'IT', 'Admin'],
    desc: 'Free Copilot, Teams, and accessibility AI courses with Microsoft badges and certifications throughout.',
    url: '#',
  },
  {
    id: 5,
    title: 'Jisc AI in FE & HE',
    provider: 'Jisc',
    logo: '🎓',
    duration: 'Self-paced · 6 hrs',
    roles: ['SLT', 'Teacher', 'Admin'],
    desc: 'UK further and higher education AI guidance — policy, ethics, assessment integrity, and staff CPD.',
    url: '#',
  },
  {
    id: 6,
    title: 'DfE Generative AI Guidance',
    provider: 'Department for Education',
    logo: '🏛️',
    duration: 'Reading path · 3 hrs',
    roles: ['SLT', 'Safeguarding', 'IT'],
    desc: "Official DfE curated reading path on AI in schools — covering KCSIE, data protection, and approved tools.",
    url: '#',
  },
];

const PAID_COURSES: PaidCourse[] = [
  {
    id: 1,
    title: 'AI for Educators',
    provider: 'Udemy',
    logo: '🎬',
    price: '£12.99',
    stars: 4.8,
    students: '3,200+',
    roles: ['Teacher', 'SLT'],
    badge: 'Promptly Recommended',
    desc: 'Practical AI skills for classroom teachers — prompts, tools, lesson planning, and marking automation.',
    url: '#',
  },
  {
    id: 2,
    title: 'Teaching with AI Tools',
    provider: 'Skillshare',
    logo: '🎨',
    price: '£8.99/month',
    stars: 4.6,
    roles: ['Teacher', 'Admin'],
    badge: 'Promptly Recommended',
    desc: 'Creative AI for educators — Canva AI, ChatGPT workflows, and building AI-enhanced classroom resources.',
    url: '#',
  },
  {
    id: 3,
    title: 'Promptly Prompt Pack by Donna',
    provider: 'GetPromptly',
    logo: '✨',
    price: '£9.99',
    stars: 4.9,
    students: '420+',
    roles: ['Teacher', 'SLT', 'SEND', 'Admin'],
    badge: 'Own Product',
    desc: '200+ ready-to-use AI prompts for every school role. Instantly reduces planning time and admin burden.',
    url: '#',
  },
  {
    id: 4,
    title: 'AI Strategy for SLT',
    provider: 'GetPromptly',
    logo: '🏫',
    price: 'Coming Soon',
    stars: null,
    roles: ['SLT'],
    badge: 'Coming Soon',
    comingSoon: true,
    desc: 'Promptly\'s flagship leadership course — from AI policy to staff buy-in. Join the waitlist for early access.',
    url: '#',
  },
];

const SAMPLE_PROMPTS = [
  {
    role: 'Teacher',
    emoji: '📚',
    prompt: 'Create a differentiated lesson plan for Year 8 on [topic] with three ability levels, including stretch tasks and SEND adaptations.',
  },
  {
    role: 'SENCO',
    emoji: '🌿',
    prompt: 'Write a pupil passport for a student with ADHD and dyslexia. Include classroom strategies, reasonable adjustments, and parent communication tips.',
  },
  {
    role: 'SLT',
    emoji: '🏛️',
    prompt: 'Draft a staff briefing introducing AI tools in our school. Cover acceptable use, data safety (GDPR/KCSIE), and three tools we\'re piloting this term.',
  },
];

const TOOLS_CROSS_SELL = [
  { name: 'Khanmigo', category: 'AI Tutor', badge: 'Student Safe', desc: 'Patient Socratic AI tutor aligned to UK curriculum. Never gives answers — guides thinking.' },
  { name: 'Microsoft Copilot for Education', category: 'Productivity', badge: 'Staff Safe', desc: 'AI across Microsoft 365 — lesson planning, staff comms, and meeting summaries.' },
  { name: 'Goblin Tools', category: 'SEND Support', badge: 'SEND Friendly', desc: 'Task breakdown and executive function tools designed for neurodiverse learners.' },
];

const ROLES: Role[] = ['Teacher', 'SLT', 'SEND', 'Safeguarding', 'Admin', 'IT', 'Parent', 'Student'];
const GOALS: Goal[] = [
  'Use AI tools confidently',
  'Lead AI strategy for my school',
  'Support SEND pupils with AI',
  'Keep up with KCSIE',
  'Build AI literacy for students',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(n) ? '#f59e0b' : '#e8e6e0', fontSize: '11px' }}>★</span>
      ))}
      <span className="text-xs font-semibold ml-1 tabular-nums" style={{ color: '#6b6760' }}>{n.toFixed(1)}</span>
    </span>
  );
}

function RoleTags({ roles }: { roles: Role[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map(r => (
        <span key={r} className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>{r}</span>
      ))}
    </div>
  );
}

function Badge({ label }: { label: PaidCourse['badge'] }) {
  const styles: Record<PaidCourse['badge'], { bg: string; text: string }> = {
    'Promptly Recommended': { bg: '#e0f5f6', text: TEAL },
    'Own Product':          { bg: '#e0f5f6', text: TEAL },
    'Coming Soon':          { bg: '#f3f4f6', text: '#6b7280' },
  };
  const s = styles[label];
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.text }}>
      {label}
    </span>
  );
}

// ─── LEARNING PATH GENERATOR ──────────────────────────────────────────────────

const LEARNING_PATHS: Partial<Record<Goal, string[]>> = {
  'Use AI tools confidently': [
    'Start with Google AI Fundamentals for Educators (free, 8 hrs) — builds solid foundations with a shareable certificate.',
    'Explore the Promptly Prompt Pack (£9.99) — 200+ ready-to-use prompts to immediately cut planning time.',
    'Join our weekly CPD newsletter for one new AI tool tip every Friday.',
  ],
  'Lead AI strategy for my school': [
    'Read the DfE Generative AI Guidance reading path (free, 3 hrs) — the policy foundation every SLT needs.',
    'Enrol in Udemy AI for Educators (£12.99) — strong on school-wide implementation and staff buy-in.',
    'Join the waitlist for Promptly AI Strategy for SLT — our flagship leadership course, launching soon.',
  ],
  'Support SEND pupils with AI': [
    'Complete the Microsoft Educator Centre accessibility AI path (free) — covers Immersive Reader, Seeing AI, and dictation.',
    'Try Goblin Tools with a small SEND cohort — free, neurodiverse-friendly, and loved by SENCOs.',
    'Download our free SEND AI prompt guide from the Prompt Library.',
  ],
  'Keep up with KCSIE': [
    'Take the NSPCC Online Safety CPD (free, 2 hrs) — specifically covers AI risks including deepfakes and KCSIE duties.',
    'Read the DfE Generative AI Guidance path for the official policy position.',
    'Add our weekly CPD newsletter for KCSIE updates as new AI tools emerge.',
  ],
  'Build AI literacy for students': [
    'Start with Khanmigo (free) — the only AI tutor that never gives answers, safe for all ages.',
    'Use the Promptly Prompt Pack student section (£9.99) — age-appropriate prompts for KS3, KS4, and sixth form.',
    'Oak National Academy AI CPD (free) gives teachers the confidence to introduce AI in lessons.',
  ],
};

function LearningPathGenerator() {
  const [role, setRole]         = useState<Role | ''>('');
  const [goal, setGoal]         = useState<Goal>('');
  const [path, setPath]         = useState<string[] | null>(null);
  const [loading, setLoading]   = useState(false);
  const resultRef               = useRef<HTMLDivElement>(null);

  function generate() {
    if (!role || !goal) return;
    setLoading(true);
    setPath(null);
    setTimeout(() => {
      setPath(LEARNING_PATHS[goal] ?? [
        'Start with Oak National Academy AI CPD (free) — built for UK educators.',
        'Explore our Prompt Pack (£9.99) to immediately see AI in action in your role.',
        'Subscribe to the weekly CPD newsletter for personalised picks.',
      ]);
      setLoading(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }, 900);
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e6e0', background: 'white' }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: '#e8e6e0', background: '#111210' }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#6b6760' }}>
          Powered by Claude
        </p>
        <h3 className="font-display text-xl" style={{ color: 'white' }}>
          Your personalised learning path
        </h3>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
          Tell us your role and goal — we'll build your path in seconds.
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Role */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b6760' }}>Your role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors appearance-none"
              style={{ borderColor: '#e8e6e0', color: role ? 'var(--text)' : '#c5c2bb', background: 'white' }}
            >
              <option value="">Select your role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#6b6760' }}>Your goal</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value as Goal)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors appearance-none"
              style={{ borderColor: '#e8e6e0', color: goal ? 'var(--text)' : '#c5c2bb', background: 'white' }}
            >
              <option value="">Select your goal…</option>
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!role || !goal || loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: TEAL, color: 'white' }}
        >
          {loading ? 'Building your path…' : 'Build my learning path →'}
        </button>

        <AnimatePresence>
          {path && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 space-y-3"
            >
              {path.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                    style={{ background: TEAL, color: 'white' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{step}</p>
                </div>
              ))}
              <div className="pt-2 border-t" style={{ borderColor: '#e8e6e0' }}>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: TEAL }}
                >
                  Ask Promptly AI to refine this path →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── EMAIL CAPTURE ────────────────────────────────────────────────────────────

function EmailCapture() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [email, setEmail]           = useState('');
  const [done, setDone]             = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111210' }}
    >
      <div className="px-6 sm:px-8 py-10 max-w-xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TEAL }}>Weekly CPD picks</p>
        <h2 className="font-display text-2xl sm:text-3xl mb-2" style={{ color: 'white' }}>
          New CPD picks, every Friday. Free.
        </h2>
        <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
          Personalised to your role. No spam — one useful email per week.
        </p>

        {/* Role chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => setActiveRole(prev => prev === r ? null : r)}
              className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
              style={
                activeRole === r
                  ? { background: TEAL, color: 'white', borderColor: TEAL }
                  : { background: 'transparent', color: '#6b7280', borderColor: '#374151' }
              }
            >
              {r}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <p className="font-display text-xl mb-1" style={{ color: 'white' }}>You're in. 🎉</p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                First email arrives this Friday. Check your inbox.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="flex gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@school.ac.uk"
                required
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: '#1f1f1c', color: 'white', border: '1px solid #374151' }}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ background: TEAL, color: 'white' }}
              >
                Subscribe →
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-[10px] mt-4" style={{ color: '#4b5563' }}>
          No spam. Unsubscribe anytime. GDPR compliant.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const Training: FC = () => {
  const [activeTab, setActiveTab]         = useState<Tab>('free');
  const [summaryId, setSummaryId]         = useState<number | null>(null);
  const [promptEmailDone, setPromptEmailDone] = useState(false);
  const [promptEmail, setPromptEmail]     = useState('');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="AI Training & CPD for UK Educators 2026 – Free & Paid | GetPromptly"
        description="Free and paid AI CPD courses for UK teachers, SLT, SENCOs and school staff. DfE-aligned resources, Oak National Academy, Google certification and Promptly's own courses."
        keywords="AI CPD teachers UK, AI training education, school AI CPD, DfE AI guidance, Oak National Academy AI, AI for educators UK, KCSIE CPD 2026"
        path="/training"
      />

      {/* ── PAGE HERO ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <SectionLabel>Training & CPD Hub</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Training & CPD for<br />
          <span style={{ color: TEAL }}>AI in Education.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-8" style={{ color: '#6b6760' }}>
          Free UK trusted CPD and premium courses to build AI confidence — for every education role.
        </p>

        {/* Tab toggles */}
        <div
          className="inline-flex rounded-xl p-1 gap-1"
          style={{ background: '#e8e6e0' }}
        >
          {([
            { id: 'free', label: '🆓 Free UK Trusted' },
            { id: 'paid', label: '⭐ Paid Premium'   },
          ] as { id: Tab; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={
                activeTab === tab.id
                  ? { background: 'white', color: 'var(--text)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                  : { background: 'transparent', color: '#6b6760' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── COURSE GRIDS ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <AnimatePresence mode="wait">

          {/* FREE TAB */}
          {activeTab === 'free' && (
            <motion.div
              key="free"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs mb-5" style={{ color: '#c5c2bb' }}>
                {FREE_COURSES.length} free resources · DfE-aligned · Updated April 2026
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                style={{ background: '#e8e6e0' }}
              >
                {FREE_COURSES.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 group"
                    style={{ background: 'white' }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{course.logo}</span>
                      <div>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded"
                          style={{ background: '#dcfce7', color: '#15803d' }}
                        >
                          Free
                        </span>
                        <p className="text-[10px] mt-0.5" style={{ color: '#c5c2bb' }}>{course.provider}</p>
                      </div>
                    </div>

                    <h2 className="font-display text-lg leading-snug mb-1" style={{ color: 'var(--text)' }}>
                      {course.title}
                    </h2>
                    <p className="text-xs mb-3" style={{ color: '#c5c2bb' }}>{course.duration}</p>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>{course.desc}</p>

                    <RoleTags roles={course.roles} />

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      <a
                        href={course.url}
                        className="text-xs font-semibold transition-opacity hover:opacity-70"
                        style={{ color: TEAL }}
                      >
                        Start free →
                      </a>
                      <button
                        onClick={() => setSummaryId(prev => prev === course.id ? null : course.id)}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border transition-all"
                        style={
                          summaryId === course.id
                            ? { background: '#e0f5f6', color: TEAL, borderColor: TEAL }
                            : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
                        }
                      >
                        ✦ Promptly AI Summary
                      </button>
                    </div>

                    {/* Inline AI summary */}
                    <AnimatePresence>
                      {summaryId === course.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-3 p-3 rounded-xl text-xs leading-relaxed"
                            style={{ background: '#f7f6f2', color: '#6b6760', borderLeft: `3px solid ${TEAL}` }}
                          >
                            <strong style={{ color: TEAL }}>Promptly AI says:</strong> This is one of the best free resources for your role. It covers the core concepts in under half a day and leaves you with practical actions you can use in your next lesson or team meeting.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PAID TAB */}
          {activeTab === 'paid' && (
            <motion.div
              key="paid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs mb-5" style={{ color: '#c5c2bb' }}>
                {PAID_COURSES.length} premium courses · Affiliate links may apply · Promptly-verified only
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-px"
                style={{ background: '#e8e6e0' }}
              >
                {PAID_COURSES.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-6 group relative"
                    style={{ background: course.comingSoon ? '#fafaf9' : 'white' }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{course.logo}</span>
                        <div>
                          <Badge label={course.badge} />
                          <p className="text-[10px] mt-0.5" style={{ color: '#c5c2bb' }}>{course.provider}</p>
                        </div>
                      </div>
                      <span
                        className="text-sm font-bold flex-shrink-0 tabular-nums"
                        style={{ color: course.comingSoon ? '#c5c2bb' : '#92400e' }}
                      >
                        {course.price}
                      </span>
                    </div>

                    <h2 className="font-display text-xl leading-snug mb-2" style={{ color: course.comingSoon ? '#9ca3af' : 'var(--text)' }}>
                      {course.title}
                    </h2>

                    {course.stars !== null && (
                      <div className="flex items-center gap-3 mb-2">
                        <Stars n={course.stars} />
                        {course.students && (
                          <span className="text-xs" style={{ color: '#c5c2bb' }}>{course.students} enrolled</span>
                        )}
                      </div>
                    )}

                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>{course.desc}</p>
                    <RoleTags roles={course.roles} />

                    {/* CTA */}
                    <div className="mt-4">
                      {course.comingSoon ? (
                        <button
                          onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all hover:opacity-80"
                          style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
                        >
                          Join waitlist →
                        </button>
                      ) : (
                        <a
                          href={course.url}
                          className="inline-block text-xs font-semibold px-3 py-1.5 rounded-xl transition-opacity hover:opacity-80"
                          style={{ background: TEAL, color: 'white' }}
                        >
                          Enrol now →
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── PROMPT LIBRARY TEASER ── */}
      <div style={{ background: 'white', borderTop: '1px solid #e8e6e0', borderBottom: '1px solid #e8e6e0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
                Prompt Library
              </p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
                200+ prompts, every role,<br className="hidden sm:block" /> ready to use.
              </h2>
            </div>
          </div>

          {/* Sample prompt cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-8" style={{ background: '#e8e6e0' }}>
            {SAMPLE_PROMPTS.map((p, i) => (
              <motion.div
                key={p.role}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6"
                style={{ background: 'white' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{p.emoji}</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded"
                    style={{ background: '#e0f5f6', color: TEAL }}
                  >
                    {p.role}
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-mono" style={{ color: '#6b6760', fontFamily: 'monospace', fontSize: '12px' }}>
                  "{p.prompt}"
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(p.prompt)}
                  className="mt-3 text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: TEAL }}
                >
                  Copy prompt →
                </button>
              </motion.div>
            ))}
          </div>

          {/* Email gate CTA */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{ background: '#f7f6f2', border: '1px solid #e8e6e0' }}
          >
            <div className="flex-1">
              <p className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
                Get the full prompt library — free
              </p>
              <p className="text-sm" style={{ color: '#6b6760' }}>
                200+ prompts for every role. Enter your email to unlock instantly.
              </p>
            </div>
            {promptEmailDone ? (
              <p className="text-sm font-semibold flex-shrink-0" style={{ color: TEAL }}>
                ✓ Check your inbox!
              </p>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); if (promptEmail) setPromptEmailDone(true); }}
                className="flex gap-2 w-full sm:w-auto"
              >
                <input
                  type="email"
                  value={promptEmail}
                  onChange={e => setPromptEmail(e.target.value)}
                  placeholder="your@school.ac.uk"
                  required
                  className="flex-1 sm:w-52 px-3 py-2 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors"
                  style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Get library →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── LEARNING PATH GENERATOR ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
            Learning Path Generator
          </p>
          <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
            Tell us your role and goal.<br className="hidden sm:block" /> We'll build your path.
          </h2>
        </div>
        <LearningPathGenerator />
      </div>

      {/* ── EMAIL CAPTURE ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <EmailCapture />
      </div>

      {/* ── CROSS-SELL: AI TOOLS ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
                Related AI Tools
              </p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'white' }}>
                Tools to go with your training.
              </h2>
            </div>
            <Link
              to="/tools"
              className="hidden sm:block text-sm font-semibold hover:opacity-70 transition-opacity pb-1"
              style={{ color: TEAL }}
            >
              All tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#1f1f1c' }}>
            {TOOLS_CROSS_SELL.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to="/tools"
                  className="block p-6 transition-colors hover:bg-[#181815]"
                  style={{ background: '#111210' }}
                >
                  <span
                    className="inline-block text-[10px] font-semibold px-2 py-1 rounded mb-3"
                    style={{ background: '#0d1f1f', color: TEAL }}
                  >
                    {tool.badge}
                  </span>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'white' }}>{tool.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#4b5563' }}>{tool.category}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{tool.desc}</p>
                  <span className="inline-block mt-4 text-xs font-semibold" style={{ color: TEAL }}>
                    View tool →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link
            to="/tools"
            className="sm:hidden block text-center mt-6 text-sm font-semibold"
            style={{ color: TEAL }}
          >
            Browse all AI tools →
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Training;
