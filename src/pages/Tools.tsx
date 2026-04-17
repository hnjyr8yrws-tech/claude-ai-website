import { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/SectionLabel';
import SEO from '../components/SEO';

const TEAL = '#00808a';

type Role = 'All' | 'Teacher' | 'SLT' | 'SEND' | 'Safeguarding' | 'Admin' | 'Finance' | 'HR' | 'IT' | 'Parent' | 'Student';
type Pricing = 'Free' | 'Freemium' | 'Paid' | 'Free for schools';

interface Tool {
  name: string;
  category: string;
  logo: string;
  desc: string;
  score: number;
  roles: Role[];
  pricing: Pricing;
  badge?: string;
}

const TOOLS: Tool[] = [
  {
    name: 'ChatGPT Edu',
    category: 'General AI',
    logo: '💬',
    desc: 'Powerful general AI assistant with educator-specific features and school management console.',
    score: 7.8,
    roles: ['Teacher', 'SLT'],
    pricing: 'Freemium',
    badge: 'Popular',
  },
  {
    name: 'Microsoft Copilot for Education',
    category: 'Productivity',
    logo: '🪁',
    desc: 'AI across Microsoft 365 — lesson planning, staff comms, HR docs, and meeting summaries.',
    score: 8.2,
    roles: ['SLT', 'HR', 'Admin'],
    pricing: 'Paid',
    badge: 'Staff Safe',
  },
  {
    name: 'Khanmigo',
    category: 'AI Tutor',
    logo: '🏫',
    desc: 'Patient Socratic AI tutor aligned to UK curriculum. Never gives answers — guides thinking.',
    score: 9.1,
    roles: ['Teacher', 'Student'],
    pricing: 'Free',
    badge: 'Student Safe',
  },
  {
    name: 'Goblin Tools',
    category: 'SEND Support',
    logo: '🌿',
    desc: 'Task breakdown and executive function tools designed for neurodiverse learners.',
    score: 8.5,
    roles: ['SEND', 'Teacher'],
    pricing: 'Free',
    badge: 'SEND Friendly',
  },
  {
    name: 'Otter.ai',
    category: 'Transcription',
    logo: '🦦',
    desc: 'Auto-transcription for governor meetings, CPD sessions, and safeguarding referrals.',
    score: 7.5,
    roles: ['Safeguarding', 'Admin'],
    pricing: 'Freemium',
    badge: 'KCSIE Checked',
  },
  {
    name: 'Canva AI for Education',
    category: 'Design',
    logo: '🎨',
    desc: 'AI-powered design for newsletters, displays, and HR comms. Free for verified schools.',
    score: 7.4,
    roles: ['Teacher', 'HR', 'Admin'],
    pricing: 'Free for schools',
  },
  {
    name: 'Grammarly Edu',
    category: 'Writing',
    logo: '✍️',
    desc: 'Real-time grammar, clarity, and tone feedback. Integrates with Google Docs and Word.',
    score: 7.9,
    roles: ['Teacher', 'Student'],
    pricing: 'Paid',
    badge: 'Popular',
  },
  {
    name: 'Google Gemini for Education',
    category: 'General AI',
    logo: '♊',
    desc: "Google's AI assistant integrated with Workspace for Education. Lesson planning and research.",
    score: 8.5,
    roles: ['Teacher', 'SLT'],
    pricing: 'Free',
    badge: 'Google Workspace',
  },
  {
    name: 'Notion AI',
    category: 'Productivity',
    logo: '📝',
    desc: 'AI inside your notes and docs — summarise, write, and organise school admin effortlessly.',
    score: 7.2,
    roles: ['Admin', 'Finance', 'HR'],
    pricing: 'Paid',
  },
  {
    name: 'Fireflies.ai',
    category: 'Transcription',
    logo: '🔥',
    desc: 'AI meeting recorder and transcriber. Useful for admin logs and safeguarding meeting notes.',
    score: 7.0,
    roles: ['Admin', 'Safeguarding'],
    pricing: 'Freemium',
  },
];

const ROLES: Role[] = ['All', 'Teacher', 'SLT', 'SEND', 'Safeguarding', 'Admin', 'Finance', 'HR', 'IT', 'Parent', 'Student'];

const TRAINING_CROSS_SELL = [
  {
    name: 'AI Skills Hub',
    provider: 'DfE / Ufi VocTech',
    desc: 'Official DfE-backed CPD-aligned AI modules for every school role.',
    tag: 'Free · Accredited',
  },
  {
    name: 'Elements of AI',
    provider: 'Reaktor / U Helsinki',
    desc: 'World-renowned introductory AI course. No maths required. Certificate on completion.',
    tag: 'Free · Certificate',
  },
  {
    name: 'Google AI Essentials',
    provider: 'Google',
    desc: "Google's practical AI course — prompt writing, Gemini, AI safety. Shareable certificate.",
    tag: 'Free · 8 hrs',
  },
];

function scoreColor(s: number): { text: string; bg: string } {
  if (s >= 8) return { text: '#15803d', bg: '#dcfce7' };
  if (s >= 6) return { text: '#92400e', bg: '#fef9c3' };
  return { text: '#991b1b', bg: '#fee2e2' };
}

function pricingStyle(p: Pricing): { text: string; bg: string } {
  if (p === 'Free' || p === 'Free for schools') return { text: '#15803d', bg: '#dcfce7' };
  if (p === 'Freemium') return { text: '#1d4ed8', bg: '#dbeafe' };
  return { text: '#6b7280', bg: '#f3f4f6' };
}

const Tools: FC = () => {
  const [activeRole, setActiveRole] = useState<Role>('All');
  const [search, setSearch]         = useState('');
  const [safetyOpen, setSafetyOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = activeRole === 'All' ? TOOLS : TOOLS.filter(t => t.roles.includes(activeRole));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeRole, search]);

  const agentPrompt =
    activeRole === 'All'
      ? 'Find me a KCSIE-safe AI tool for UK education'
      : `Find me a KCSIE-safe AI tool for ${activeRole}`;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Best AI Tools for UK Schools 2026 – KCSIE Checked | GetPromptly"
        description="180+ AI tools independently reviewed for UK schools. Filtered by role, safety-scored against KCSIE 2025, and GDPR-checked. Free tools for teachers, SLT, SEND and parents."
        keywords="AI tools UK schools, KCSIE AI tools, safe AI education, AI for teachers UK, SEND AI tools, AI classroom tools, school AI software 2026"
        path="/tools"
      />

      {/* ── PAGE HERO ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <SectionLabel>AI Tools Directory</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          AI Tools for<br />
          <span style={{ color: TEAL }}>UK Education.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-8" style={{ color: '#6b6760' }}>
          Every tool assessed against KCSIE 2025. Filtered by your role. No overwhelm.
        </p>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
            style={{ color: '#c5c2bb' }}
          >
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or description…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors"
            style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
          />
        </div>

        {/* Role filter pills */}
        <div className="flex flex-wrap gap-2">
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => { setActiveRole(r); }}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={
                activeRole === r
                  ? { background: TEAL, color: 'white', borderColor: TEAL }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── SAFETY SCORE EXPLAINER (collapsible) ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-8">
        <button
          onClick={() => setSafetyOpen(o => !o)}
          className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: TEAL }}
        >
          <span style={{ fontSize: '10px' }}>{safetyOpen ? '▼' : '▶'}</span>
          How are Safety Scores calculated?
        </button>

        <AnimatePresence>
          {safetyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 p-5 rounded-xl border text-sm leading-relaxed"
                style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760', maxWidth: '640px' }}
              >
                <p className="mb-2 font-medium" style={{ color: 'var(--text)' }}>
                  Each tool is rated 1–10 across five dimensions:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Data privacy</strong> — GDPR compliance, data residency, retention policy</li>
                  <li><strong>Age appropriateness</strong> — minimum age enforcement, content moderation</li>
                  <li><strong>KCSIE alignment</strong> — supports filtering, monitoring, and reporting duties</li>
                  <li><strong>Safeguarding features</strong> — content filtering, flagging, admin controls</li>
                  <li><strong>Transparency</strong> — clear AI disclosure, no dark patterns</li>
                </ul>
                <p className="mt-3">
                  <a
                    href="#"
                    className="font-semibold hover:opacity-70 transition-opacity"
                    style={{ color: TEAL }}
                  >
                    Read the full methodology →
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MAIN CONTENT: grid + sticky sidebar ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* Tool grid */}
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-4" style={{ color: '#c5c2bb' }}>
              {filtered.length} tool{filtered.length !== 1 ? 's' : ''} · KCSIE 2025 assessed · Updated April 2026 · No paid placements
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole + '|' + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-px"
                style={{ background: '#e8e6e0' }}
              >
                {filtered.length === 0 ? (
                  <div className="col-span-full p-12 text-center" style={{ background: 'white' }}>
                    <p className="text-sm" style={{ color: '#6b6760' }}>
                      No tools match your search. Try a different term or role.
                    </p>
                  </div>
                ) : (
                  filtered.map((tool, i) => {
                    const sc = scoreColor(tool.score);
                    const pc = pricingStyle(tool.pricing);
                    return (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="p-6 group cursor-pointer"
                        style={{ background: 'white' }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl flex-shrink-0">{tool.logo}</span>
                            <div className="min-w-0">
                              <h2
                                className="font-display text-lg leading-tight truncate"
                                style={{ color: 'var(--text)' }}
                              >
                                {tool.name}
                              </h2>
                              <span
                                className="text-[10px] uppercase tracking-wide font-medium"
                                style={{ color: '#c5c2bb' }}
                              >
                                {tool.category}
                              </span>
                            </div>
                          </div>
                          {/* Safety score badge */}
                          <span
                            className="text-xs font-bold px-2 py-1 rounded flex-shrink-0 tabular-nums"
                            style={{ background: sc.bg, color: sc.text }}
                          >
                            {tool.score}/10
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>
                          {tool.desc}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded"
                            style={{ background: pc.bg, color: pc.text }}
                          >
                            {tool.pricing}
                          </span>
                          {tool.badge && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded"
                              style={{ background: '#e0f5f6', color: TEAL }}
                            >
                              {tool.badge}
                            </span>
                          )}
                          {tool.roles.map(r => (
                            <span
                              key={r}
                              className="text-[10px] font-medium px-2 py-0.5 rounded"
                              style={{ background: '#f3f4f6', color: '#6b7280' }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-semibold group-hover:opacity-60 transition-opacity"
                            style={{ color: TEAL }}
                          >
                            View review →
                          </span>
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
                            style={{ background: TEAL, color: 'white' }}
                          >
                            Try it free
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── STICKY SIDEBAR (desktop) ── */}
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 space-y-4">

            {/* Agent panel */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: '#e8e6e0' }}
            >
              <div className="px-4 py-3 border-b" style={{ background: '#111210', borderColor: '#1f1f1c' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b6760' }}>
                  Promptly AI
                </p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>Ask about any tool</p>
              </div>
              <div className="p-4" style={{ background: 'white' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={agentPrompt}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl p-3 mb-3 text-sm leading-relaxed italic"
                    style={{ background: '#f7f6f2', color: '#6b6760' }}
                  >
                    "{agentPrompt}"
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Ask Promptly AI →
                </button>
                <p className="text-[10px] text-center mt-2" style={{ color: '#c5c2bb' }}>
                  Powered by Claude · Free to use
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wide mb-3"
                style={{ color: '#c5c2bb' }}
              >
                Directory Stats
              </p>
              <div className="space-y-2.5">
                {[
                  ['Tools reviewed',    '180+'],
                  ['KCSIE compliant',   '68%'],
                  ['Free or freemium',  '70%'],
                  ['Last updated',      'Apr 2026'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span style={{ color: '#6b6760' }}>{label}</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety score legend */}
            <div
              className="rounded-2xl border p-4"
              style={{ borderColor: '#e8e6e0', background: 'white' }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wide mb-3"
                style={{ color: '#c5c2bb' }}
              >
                Safety Score Key
              </p>
              <div className="space-y-2">
                {[
                  { label: '8.0 – 10',  desc: 'Recommended',  ...scoreColor(8.5) },
                  { label: '6.0 – 7.9', desc: 'Use with care', ...scoreColor(7.0) },
                  { label: 'Below 6.0', desc: 'Not advised',   ...scoreColor(5.0) },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-12 text-center font-bold px-1 py-0.5 rounded"
                      style={{ background: item.bg, color: item.text }}
                    >
                      {item.label}
                    </span>
                    <span style={{ color: '#6b6760' }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE: agent CTA ── */}
        <div
          className="lg:hidden mt-8 rounded-2xl overflow-hidden border"
          style={{ borderColor: '#e8e6e0' }}
        >
          <div className="p-5" style={{ background: '#111210' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'white' }}>
              Not sure which tool to use?
            </p>
            <p className="text-xs italic mb-4" style={{ color: '#9ca3af' }}>
              "{agentPrompt}"
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: 'white' }}
            >
              Ask Promptly AI →
            </button>
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL STRIP ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: TEAL }}
              >
                Recommended Training
              </p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'white' }}>
                Go further with these tools.
              </h2>
            </div>
            <Link
              to="/training"
              className="hidden sm:block text-sm font-semibold hover:opacity-70 transition-opacity pb-1"
              style={{ color: TEAL }}
            >
              All training →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-px"
            style={{ background: '#1f1f1c' }}
          >
            {TRAINING_CROSS_SELL.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to="/training"
                  className="block p-6 transition-colors hover:bg-[#181815]"
                  style={{ background: '#111210' }}
                >
                  <span
                    className="inline-block text-[10px] font-semibold px-2 py-1 rounded mb-3"
                    style={{ background: '#0d1f0d', color: TEAL }}
                  >
                    {item.tag}
                  </span>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'white' }}>
                    {item.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: '#4b5563' }}>
                    {item.provider}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                    {item.desc}
                  </p>
                  <span
                    className="inline-block mt-4 text-xs font-semibold"
                    style={{ color: TEAL }}
                  >
                    Start learning →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link
            to="/training"
            className="sm:hidden block text-center mt-6 text-sm font-semibold"
            style={{ color: TEAL }}
          >
            Browse all training →
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Tools;
