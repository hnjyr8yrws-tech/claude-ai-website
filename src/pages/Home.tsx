

/**
 * Home.tsx — GetPromptly.co.uk
 * Complete homepage: 11 sections, fully interactive
 */

import { FC, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { homePageJsonLd } from '../api/structuredData';

const TEAL  = '#00808a';
const DARK  = '#111210';
const CREAM = '#f7f6f2';

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO
// ─────────────────────────────────────────────────────────────────────────────

const Hero: FC = () => (
  <section
    className="relative overflow-hidden"
    style={{ background: CREAM }}
  >
    {/* Subtle teal radial glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,128,138,0.06) 0%, transparent 70%)`,
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
          Built for UK Education · KCSIE Aware · GDPR Conscious
        </span>

        {/* H1 */}
        <h1
          className="font-display leading-[1.06] mb-6"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', color: 'var(--text)' }}
        >
          Stop guessing with AI.
          <br />
          <em style={{ color: TEAL, fontStyle: 'italic' }}>Start getting Promptly.</em>
        </h1>

        {/* Sub */}
        <p
          className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
          style={{ color: '#6b6760' }}
        >
          The trusted platform for UK teachers, school staff, parents and students to find
          the right AI tools, equipment and training — safely and confidently.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: TEAL }}
          >
            Ask our AI guide ✦
          </button>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-white"
            style={{ color: 'var(--text)', borderColor: '#d5d2cb', background: 'transparent' }}
          >
            Explore tools
          </Link>
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap gap-5">
          {['Ofsted-aware', 'KCSIE 2025 aligned', 'UK-focused reviews', 'Live 24/7 AI guidance'].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: '#6b6760' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6.5" stroke={TEAL} strokeWidth="1.2" />
                <path d="M4 7l2 2 4-4" stroke={TEAL} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. TRUST BAR
// ─────────────────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: '🏫', label: 'KCSIE 2025 Aligned' },
  { icon: '🛡️', label: 'GDPR Conscious' },
  { icon: '📋', label: 'ICO Registered' },
  { icon: '🤖', label: '24/7 AI Guidance' },
  { icon: '🎓', label: 'Trusted by UK Educators' },
];

const TrustBar: FC = () => (
  <div className="w-full border-y overflow-x-auto" style={{ borderColor: '#e0ddd6', background: '#eeecea' }}>
    <div className="flex items-center justify-center gap-8 sm:gap-12 px-6 py-3.5 min-w-max mx-auto">
      {TRUST_ITEMS.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2 flex-shrink-0">
          {i > 0 && <span className="w-1 h-1 rounded-full" style={{ background: '#c8c5bd' }} />}
          <span className="text-base" aria-hidden="true">{item.icon}</span>
          <span className="text-[11px] font-semibold tracking-wide uppercase whitespace-nowrap" style={{ color: '#6b6760' }}>
            {item.label}
          </span>
        </span>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. THREE HUBS
// ─────────────────────────────────────────────────────────────────────────────

interface HubItem { name: string; tag: string; }
interface HubDef {
  emoji: string; title: string; desc: string; to: string;
  placeholder: string; tags: string[]; items: HubItem[];
}

const HUBS: HubDef[] = [
  {
    emoji: '🔍', title: 'AI Tools', desc: 'Safety-rated tools for every role in education.', to: '/tools',
    placeholder: 'Search tools…', tags: ['All', 'SEND', 'Free', 'KCSIE'],
    items: [
      { name: 'Khanmigo',          tag: 'Students · 9.5/10' },
      { name: 'Read&Write',        tag: 'SEND · 9.1/10' },
      { name: 'Microsoft Copilot', tag: 'Leaders · 8.8/10' },
      { name: 'Grammarly',         tag: 'Teachers · 9.4/10' },
      { name: 'Immersive Reader',  tag: 'SEND · Free' },
      { name: 'Otter.ai',          tag: 'Admin · Free tier' },
      { name: 'ChatGPT',           tag: 'General · 8.5/10' },
      { name: 'Canva Magic',       tag: 'Teachers · Free' },
    ],
  },
  {
    emoji: '💻', title: 'Equipment', desc: 'Hardware for AI-ready classrooms and SEND settings.', to: '/equipment',
    placeholder: 'Search equipment…', tags: ['All', 'Tablets', 'Laptops', 'SEND'],
    items: [
      { name: 'iPad 10th gen',        tag: 'Tablets · ££' },
      { name: 'Chromebook Lenovo 300e', tag: 'Laptops · £' },
      { name: 'Surface Go 4',         tag: 'Tablets · £££' },
      { name: 'OrCam MyEye 2',        tag: 'SEND · £££' },
      { name: 'MacBook Air M2',       tag: 'Laptops · £££' },
      { name: 'Nuance Dragon',        tag: 'SEND · £££' },
      { name: 'Jabra Speak2 55',      tag: 'Audio · ££' },
      { name: 'Livescribe Pen',       tag: 'SEND · ££' },
    ],
  },
  {
    emoji: '🎓', title: 'Training', desc: 'CPD and AI literacy for every school role.', to: '/training',
    placeholder: 'Search training…', tags: ['All', 'Free', 'Accredited', 'SEND'],
    items: [
      { name: 'AI Skills Hub',      tag: 'DfE · Free' },
      { name: 'Elements of AI',     tag: 'All roles · Free' },
      { name: 'Google AI Essentials', tag: 'Teachers · Certified' },
      { name: 'Microsoft Learn AI', tag: 'Leaders · Free' },
      { name: 'DeepLearning.AI',    tag: 'Leaders · Paid' },
      { name: 'IBM SkillsBuild',    tag: 'All roles · Free' },
      { name: 'Coursera AI',        tag: 'Leaders · Accredited' },
      { name: 'OpenLearn AI',       tag: 'All roles · Free' },
    ],
  },
];

const HubCard: FC<{ hub: HubDef; delay: number }> = ({ hub, delay }) => {
  const [query, setQuery]       = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filtered = hub.items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(query.toLowerCase())
      || item.tag.toLowerCase().includes(query.toLowerCase());
    const matchTag = activeTag === 'All' || item.tag.toLowerCase().includes(activeTag.toLowerCase());
    return matchSearch && matchTag;
  }).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group flex flex-col p-8 bg-white border transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: '#e8e6e0',
        borderBottom: `3px solid transparent`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = TEAL)}
      onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
    >
      <span className="text-3xl mb-4 block" aria-hidden="true">{hub.emoji}</span>
      <h3 className="font-display text-2xl mb-1" style={{ color: 'var(--text)' }}>{hub.title}</h3>
      <p className="text-sm mb-5" style={{ color: '#6b6760' }}>{hub.desc}</p>

      {/* Search */}
      <input
        type="search"
        placeholder={hub.placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none mb-3 transition-colors"
        style={{ borderColor: '#e8e6e0', background: CREAM }}
        onFocus={(e) => (e.currentTarget.style.borderColor = TEAL)}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e8e6e0')}
        aria-label={`Search ${hub.title}`}
      />

      {/* Filter tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {hub.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className="px-2.5 py-1 rounded text-[10px] font-semibold transition-colors"
            style={
              activeTag === tag
                ? { background: TEAL, color: 'white' }
                : { background: '#f0eeea', color: '#6b6760' }
            }
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      <ul className="space-y-1.5 flex-1 mb-5">
        {filtered.length > 0 ? filtered.map((item) => (
          <li key={item.name} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: '#f0eeea' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.name}</span>
            <span className="text-[10px]" style={{ color: '#c5c2bb' }}>{item.tag}</span>
          </li>
        )) : (
          <li className="text-sm py-4 text-center" style={{ color: '#c5c2bb' }}>No results</li>
        )}
      </ul>

      <Link to={hub.to} className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
        Browse all {hub.title} →
      </Link>
    </motion.div>
  );
};

const HubsSection: FC = () => (
  <section id="tools" className="max-w-6xl mx-auto px-5 sm:px-8 py-20" style={{ scrollMarginTop: '64px' }}>
    <div className="mb-12">
      <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: TEAL }}>The Hubs</span>
      <h2 className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--text)' }}>
        Find exactly what
        <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>you need.</em>
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: '#e8e6e0' }}>
      {HUBS.map((hub, i) => (
        <HubCard key={hub.title} hub={hub} delay={i * 0.12} />
      ))}
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. WHY PROMPTLY
// ─────────────────────────────────────────────────────────────────────────────

const WHY_POINTS = [
  { num: '01', title: 'UK-first',            body: 'Every review is written through a UK lens — KCSIE, DfE guidance, Ofsted EIF, and GDPR compliance checked on every tool.' },
  { num: '02', title: 'Role-specific',        body: 'Guidance for teachers, school leaders, SEND coordinators, DSLs, IT managers, parents, and students — not a one-size-fits-all approach.' },
  { num: '03', title: 'Live AI agents',        body: 'Our AI agents are on call 24/7. Ask anything about tool safety, policy, training, or procurement — instant, reliable answers.' },
  { num: '04', title: 'Built by educators',    body: "Our team includes practising teachers, SLT, and a SENCO. We've been in your shoes. We know what you actually need." },
];

const SCORE_PREVIEW = [
  { name: 'Khanmigo',       score: 9.5, tag: 'Students' },
  { name: 'MS Copilot Edu', score: 8.8, tag: 'Staff' },
  { name: 'Grammarly',      score: 9.4, tag: 'All roles' },
  { name: 'ChatGPT Free',   score: 7.0, tag: 'Staff only' },
  { name: 'Generic AI',     score: 4.5, tag: 'Avoid' },
];

function scoreBarColor(s: number) {
  if (s >= 8.5) return '#16a34a';
  if (s >= 7.0) return '#2563eb';
  if (s >= 6.0) return '#d97706';
  return '#dc2626';
}

const WhySection: FC = () => (
  <section className="border-t" style={{ borderColor: '#e8e6e0', background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* Left */}
      <div>
        <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: TEAL }}>Why GetPromptly</span>
        <h2 className="font-display text-4xl sm:text-5xl mb-12" style={{ color: 'var(--text)' }}>
          Not another AI
          <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>directory.</em>
        </h2>
        <div className="space-y-8">
          {WHY_POINTS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5"
            >
              <span className="font-display text-2xl flex-shrink-0 w-10" style={{ color: '#d5d2cb' }}>{p.num}</span>
              <div>
                <h3 className="font-display text-xl mb-1.5" style={{ color: 'var(--text)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: Safety score preview */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#e8e6e0' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e8e6e0', background: CREAM }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Safety Score Preview</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded" style={{ background: 'rgba(0,128,138,0.08)', color: TEAL }}>Live ratings</span>
          </div>
          <div className="divide-y divide-[#f0eeea]">
            {SCORE_PREVIEW.map((tool) => (
              <div key={tool.name} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{tool.name}</span>
                    <span className="text-xs font-semibold" style={{ color: scoreBarColor(tool.score) }}>{tool.score}/10</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f0eeea' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: scoreBarColor(tool.score) }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tool.score * 10}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-medium flex-shrink-0" style={{ color: '#c5c2bb' }}>{tool.tag}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t" style={{ borderColor: '#e8e6e0', background: CREAM }}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: TEAL }}
            >
              Check any AI tool →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. SAFETY SCORE SECTION
// ─────────────────────────────────────────────────────────────────────────────

interface ScoreTool { name: string; score: number; label: string; audience: string; }

const SCORE_TOOLS: ScoreTool[] = [
  { name: 'Khanmigo',       score: 9.1, label: 'Recommended', audience: 'All roles' },
  { name: 'Copilot for Edu', score: 8.3, label: 'Staff Safe',   audience: 'Staff & admin' },
  { name: 'ChatGPT Free',   score: 7.0, label: 'Staff Only',   audience: 'Staff only' },
  { name: 'Generic AI',     score: 4.5, label: 'Avoid',        audience: 'Not advised' },
];

function ringColor(s: number) {
  if (s >= 8.5) return '#16a34a';
  if (s >= 7.0) return '#2563eb';
  if (s >= 6.0) return '#d97706';
  return '#dc2626';
}

function ringLabel(l: string) {
  const map: Record<string, { bg: string; text: string }> = {
    'Recommended': { bg: '#dcfce7', text: '#15803d' },
    'Staff Safe':  { bg: '#dbeafe', text: '#1d4ed8' },
    'Staff Only':  { bg: '#fef9c3', text: '#854d0e' },
    'Avoid':       { bg: '#fee2e2', text: '#dc2626' },
  };
  return map[l] ?? { bg: '#f0eeea', text: '#6b6760' };
}

const ScoreRing: FC<{ score: number }> = ({ score }) => {
  const R = 28;
  const C = 2 * Math.PI * R;
  const color = ringColor(score);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r={R} fill="none" stroke="#e8e6e0" strokeWidth="4" />
      <motion.circle
        cx="36" cy="36" r={R}
        fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={C}
        initial={{ strokeDashoffset: C }}
        whileInView={{ strokeDashoffset: C - (score / 10) * C }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill={color} fontFamily="Inter, sans-serif">
        {score}
      </text>
    </svg>
  );
};

const SafetySection: FC = () => (
  <section className="border-t" style={{ borderColor: '#e8e6e0', background: CREAM }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: TEAL }}>Safety Scores</span>
          <h2 className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--text)' }}>
            Know before
            <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>you deploy.</em>
          </h2>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
          className="text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: TEAL }}
        >
          Check any AI tool →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: '#e8e6e0' }}>
        {SCORE_TOOLS.map((tool, i) => {
          const badge = ringLabel(tool.label);
          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 flex flex-col items-start gap-5 bg-white"
            >
              <ScoreRing score={tool.score} />
              <div>
                <h3 className="font-display text-xl mb-1" style={{ color: 'var(--text)' }}>{tool.name}</h3>
                <p className="text-xs mb-3" style={{ color: '#6b6760' }}>{tool.audience}</p>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded"
                  style={{ background: badge.bg, color: badge.text }}
                >
                  {tool.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 6. DARK AGENTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

type AgentRole = 'Teacher' | 'SLT' | 'SEND Lead' | 'DSL' | 'IT Manager' | 'Parent' | 'Student' | 'Finance';

const ROLE_MESSAGES: Record<AgentRole, string> = {
  'Teacher':    "Hi! Ask me about AI tools for lesson planning, marking assistance, or how to introduce AI safely to your class.",
  'SLT':        "Hello! I can help with whole-school AI policies, staff CPD planning, or Ofsted EIF mapping.",
  'SEND Lead':  "Hi! Ask me about assistive AI tools, EHCP support, or inclusive technology for your learners.",
  'DSL':        "Hello! I can help with safeguarding considerations around student AI use and KCSIE 2025 compliance.",
  'IT Manager': "Hi! Ask me about GDPR-compliant tool selection, data processing agreements, or network requirements.",
  'Parent':     "Hello! I can help you understand what AI tools your child may be using and how to keep them safe.",
  'Student':    "Hi! Ask me about AI tools that can help with revision, essay planning, or learning new topics.",
  'Finance':    "Hello! I can help with ROI on AI tools, procurement guidance, and budgeting for technology.",
};

const AGENT_ROLES: AgentRole[] = ['Teacher', 'SLT', 'SEND Lead', 'DSL', 'IT Manager', 'Parent', 'Student', 'Finance'];

const STATS = [
  { value: '24/7', label: 'Always available' },
  { value: '8+',   label: 'Role-specific modes' },
  { value: '0s',   label: 'Average wait time' },
];

const AgentsSection: FC = () => {
  const [activeRole, setActiveRole] = useState<AgentRole>('Teacher');
  const message = ROLE_MESSAGES[activeRole];

  return (
    <section id="agents" style={{ background: DARK, scrollMarginTop: '64px' }}>
      {/* Subtle teal radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          width: 600, height: 600, top: '50%', left: '-10%', transform: 'translateY(-50%)',
          background: `radial-gradient(circle, rgba(0,128,138,0.1) 0%, transparent 65%)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-6" style={{ color: TEAL }}>
            AI Agents
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Always on.
            <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>Always helpful.</em>
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#6b6760' }}>
            Ask anything about AI safety, tools, policy, training, or procurement.
            Our agents know UK education inside out — 24 hours a day, 7 days a week.
          </p>

          {/* Role chips */}
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#3a3835' }}>
            Select your role
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {AGENT_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  activeRole === role
                    ? { background: TEAL, color: 'white' }
                    : { background: 'rgba(255,255,255,0.06)', color: '#a09d98', border: '1px solid rgba(255,255,255,0.1)' }
                }
              >
                {role}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl text-white mb-1">{s.value}</p>
                <p className="text-xs" style={{ color: '#4a4845' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Mock chat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#1a1917', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: 'rgba(0,128,138,0.2)', border: '1px solid rgba(0,128,138,0.3)' }}
              >
                🤖
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Promptly AI</span>
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#22c55e' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: '#4a4845' }}>Powered by Claude</span>
              </div>
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded"
                style={{ background: 'rgba(0,128,138,0.15)', color: TEAL }}
              >
                {activeRole}
              </span>
            </div>

            {/* Messages */}
            <div className="px-5 py-5 space-y-3 min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(0,128,138,0.15)' }}
                  >
                    🤖
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%]"
                    style={{
                      background: 'rgba(0,128,138,0.1)',
                      border: '1px solid rgba(0,128,138,0.2)',
                      color: '#a09d98',
                    }}
                  >
                    {message}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="flex-1 h-9 rounded-lg px-3 flex items-center text-xs"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#3a3835', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                Ask a question…
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ background: TEAL }}
                aria-label="Open full agent"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2 11L11 2M11 2H4M11 2V9" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <p className="text-xs mt-3 text-center" style={{ color: '#2d2c2a' }}>
            No account needed · GDPR compliant · 100% independent
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. FREE PROMPTS
// ─────────────────────────────────────────────────────────────────────────────

interface Prompt { role: string; title: string; preview: string; full: string; }

const PROMPTS: Prompt[] = [
  {
    role: 'Teacher',
    title: 'Differentiated Lesson Plan',
    preview: 'Create a Year 6 maths lesson on fractions with three differentiation levels…',
    full: 'Create a Year 6 maths lesson on fractions with three differentiation levels: below expected, at expected, and greater depth. Include success criteria, key vocabulary, and suggested resources. Align to the 2014 National Curriculum.',
  },
  {
    role: 'SENCO',
    title: 'EHCP AI Impact Statement',
    preview: 'Write a section for an EHCP explaining how assistive AI tools support…',
    full: "Write a section for an EHCP explaining how assistive AI tools (Read&Write, Immersive Reader) support a learner with dyslexia aged 12. Include impact evidence and next steps.",
  },
  {
    role: 'DSL',
    title: 'AI Safeguarding Policy Extract',
    preview: 'Draft a safeguarding section on student use of generative AI tools…',
    full: 'Draft a safeguarding policy section on student use of generative AI tools. Reference KCSIE 2025, include risk assessment criteria, staff responsibilities, and reporting procedures for incidents.',
  },
  {
    role: 'SLT',
    title: 'Whole-School AI Strategy',
    preview: 'Create a 1-page AI strategy outline for a secondary school…',
    full: "Create a 1-page AI strategy outline for a secondary school (800 pupils). Include: vision statement, key priorities for 2025-26, staff CPD plan, acceptable use framework, and Ofsted EIF mapping.",
  },
  {
    role: 'HR Manager',
    title: 'Staff AI Acceptable Use Policy',
    preview: 'Write a staff-facing AI acceptable use policy…',
    full: 'Write a staff-facing AI acceptable use policy for a UK state school. Cover: permitted tools, data sharing restrictions, copyright and plagiarism, student interaction rules, and reporting obligations.',
  },
  {
    role: 'Finance',
    title: 'AI Tools Procurement Justification',
    preview: 'Write a budget justification for subscribing to three AI tools…',
    full: 'Write a budget justification for subscribing to Khanmigo (£18/user/yr), Read&Write (£24/user/yr), and Microsoft Copilot for Education (£30/user/yr) for a school of 60 staff. Include ROI case and CPD savings.',
  },
];

const PromptCard: FC<{ prompt: Prompt; idx: number }> = ({ prompt, idx }) => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt.full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className="relative p-7 bg-white border group cursor-default"
      style={{ borderColor: '#e8e6e0' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="inline-block text-[10px] font-semibold tracking-wider uppercase mb-3 px-2.5 py-1 rounded"
        style={{ background: 'rgba(0,128,138,0.08)', color: TEAL }}
      >
        {prompt.role}
      </span>
      <h3 className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>{prompt.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{prompt.preview}</p>

      {/* Copy button — appears on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            onClick={copy}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity"
            style={{ background: copied ? '#16a34a' : TEAL }}
            aria-label={`Copy ${prompt.title} prompt`}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PromptsSection: FC = () => (
  <section className="border-t" style={{ borderColor: '#e8e6e0', background: CREAM }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: TEAL }}>Free Prompts</span>
          <h2 className="font-display text-4xl sm:text-5xl" style={{ color: 'var(--text)' }}>
            Ready-to-use prompts
            <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>for every role.</em>
          </h2>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
          className="text-sm font-semibold transition-opacity hover:opacity-70 flex-shrink-0"
          style={{ color: TEAL }}
        >
          Get 200+ prompts free →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#e8e6e0' }}>
        {PROMPTS.map((p, i) => (
          <PromptCard key={p.title} prompt={p} idx={i} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity"
          style={{ background: TEAL }}
        >
          Get 200+ prompts free →
        </button>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. CROSS-SELL
// ─────────────────────────────────────────────────────────────────────────────

interface Product { category: string; title: string; desc: string; price: string; cta: string; to: string; }

const PRODUCTS: Product[] = [
  { category: 'AI Tool',       title: 'ChatGPT Plus',             desc: 'Unlock GPT-4o, file analysis, and DALL·E image generation for school projects.',          price: '$20/mo',    cta: 'View tool →',     to: '/tools' },
  { category: 'AI Tool',       title: 'Canva for Education',      desc: 'Free AI-powered design for verified UK teachers. Magic Write, AI image tools included.',  price: 'Free',      cta: 'View tool →',     to: '/tools' },
  { category: 'Equipment',     title: 'iPad 10th Gen (Class Set)', desc: 'The school standard. Apple School Manager ready, 10-hour battery, robust build.',       price: 'From £369', cta: 'Read review →',   to: '/equipment' },
  { category: 'Equipment',     title: 'Lenovo Chromebook 300e',   desc: "Best-value UK school laptop. Google Workspace native, touchscreen, drop-tested.",        price: 'From £229', cta: 'Read review →',   to: '/equipment' },
  { category: 'Equipment',     title: 'Smart Interactive Board',  desc: 'AI-compatible classroom display with touch, annotation, and screen mirroring.',           price: 'From £799', cta: 'Read review →',   to: '/equipment' },
  { category: 'Training',      title: 'Udemy: AI for Teachers',   desc: 'Practical AI tools for lesson planning, marking, and admin. 12 hours of video content.',  price: 'From £12',  cta: 'View course →',   to: '/training' },
  { category: 'Training',      title: 'Promptly Pack: SLT',       desc: 'Our curated bundle of 60 SLT prompts, policy templates, and CPD session plans.',          price: 'Free',      cta: 'Download →',      to: '/training' },
  { category: 'Free Resource', title: 'AI Policy Template',       desc: 'Ready-to-adapt whole-school AI policy mapped to Ofsted EIF 2025. Download and use.',      price: 'Free',      cta: 'Download PDF →',  to: '/training' },
];

const CrossSellSection: FC = () => (
  <section className="border-t" style={{ borderColor: '#e8e6e0', background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: TEAL }}>Everything you need</span>
      <h2 className="font-display text-4xl sm:text-5xl mb-12" style={{ color: 'var(--text)' }}>
        Everything you need
        <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>to get started.</em>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: '#e8e6e0' }}>
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="p-6 flex flex-col group"
            style={{ background: CREAM }}
          >
            <span
              className="inline-block text-[10px] font-semibold tracking-wider uppercase mb-3 px-2.5 py-1 rounded w-fit"
              style={{ background: 'rgba(0,128,138,0.08)', color: TEAL }}
            >
              {p.category}
            </span>
            <h3 className="font-display text-lg mb-1.5 leading-snug" style={{ color: 'var(--text)' }}>{p.title}</h3>
            <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: '#6b6760' }}>{p.desc}</p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: '#e8e6e0' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{p.price}</span>
              <Link to={p.to} className="text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
                {p.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 9. TEAM
// ─────────────────────────────────────────────────────────────────────────────

const TEAM = [
  { initials: 'DW', name: 'Donna Whitfield', role: 'Head of Education', bio: 'Former secondary head of department with 14 years in UK schools. Donna leads all curriculum and policy content at GetPromptly, ensuring everything is grounded in real classroom experience.' },
  { initials: 'CH', name: 'Chloe Harrington', role: 'AI Demonstrator', bio: 'Primary teacher turned EdTech specialist. Chloe tests every tool in the directory and runs AI literacy workshops for schools across the West Midlands and online.' },
  { initials: 'CM', name: 'Charles Morley', role: 'Technology Lead', bio: 'Former school network manager and data protection lead. Charles oversees all technical reviews, GDPR assessments, and the infrastructure behind GetPromptly.' },
];

const TeamSection: FC = () => (
  <section id="about" className="border-t" style={{ borderColor: '#e8e6e0', background: CREAM, scrollMarginTop: '64px' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: TEAL }}>The Team</span>
      <h2 className="font-display text-4xl sm:text-5xl mb-12" style={{ color: 'var(--text)' }}>
        Educators, not
        <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>influencers.</em>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: '#e8e6e0' }}>
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="p-8 bg-white"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-xl mb-6"
              style={{ background: 'rgba(0,128,138,0.08)', color: TEAL }}
            >
              {member.initials}
            </div>
            <h3 className="font-display text-xl mb-0.5" style={{ color: 'var(--text)' }}>{member.name}</h3>
            <p className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: TEAL }}>{member.role}</p>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 10. VISION
// ─────────────────────────────────────────────────────────────────────────────

const PILLARS = [
  { title: 'UK-first',            body: "Everything we publish is written for UK schools, mapped to UK regulation, and reviewed by UK practitioners. No US-centric generic advice." },
  { title: 'Trustworthy by design', body: "No paid placements, no affiliate ratings, no sponsored 'top picks'. Our income never influences our editorial decisions. Ever." },
  { title: 'Practical over perfect', body: "We'd rather give you a useful prompt that works today than a theoretical framework for next year. Real tools, real schools, real results." },
];

const VisionSection: FC = () => (
  <section className="border-t" style={{ borderColor: '#e8e6e0', background: 'white' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-6" style={{ color: TEAL }}>Our Vision</span>
        <blockquote
          className="font-display leading-snug"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: 'var(--text)', fontStyle: 'italic' }}
        >
          "Every teacher, school leader, parent and student in the UK should be able to use AI
          confidently, safely and effectively."
        </blockquote>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: '#e8e6e0' }}>
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="p-8 sm:p-10"
            style={{ background: CREAM }}
          >
            <h3 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>{p.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{p.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 11. EMAIL CAPTURE
// ─────────────────────────────────────────────────────────────────────────────

type EmailRole = 'Teacher' | 'SLT' | 'SEND Lead' | 'DSL' | 'IT Manager' | 'Parent' | 'Finance' | 'Student';
const EMAIL_ROLES: EmailRole[] = ['Teacher', 'SLT', 'SEND Lead', 'DSL', 'IT Manager', 'Parent', 'Finance', 'Student'];

const EmailCapture: FC = () => {
  const [selectedRole, setSelectedRole] = useState<EmailRole>('Teacher');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section style={{ background: DARK }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
        <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-6" style={{ color: TEAL }}>
          Free Resources
        </span>
        <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
          AI tips that actually work
          <br /><em style={{ color: TEAL, fontStyle: 'italic' }}>in UK schools.</em>
        </h2>
        <p className="text-base mb-10" style={{ color: '#6b6760' }}>
          Get role-specific prompts, tool reviews, and policy updates — free, every fortnight.
        </p>

        {!submitted ? (
          <>
            {/* Role selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {EMAIL_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={
                    selectedRole === r
                      ? { background: TEAL, color: 'white' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#a09d98', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto mb-4">
              <input
                ref={inputRef}
                type="email"
                required
                placeholder="your@school.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#1a1917', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = TEAL)}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: TEAL }}
              >
                Get free prompts →
              </button>
            </form>

            <p className="text-xs" style={{ color: '#3a3835' }}>
              GDPR compliant · Double opt-in · Unsubscribe any time · No spam, ever
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: 'rgba(0,128,138,0.15)', border: `1px solid ${TEAL}` }}
            >
              ✓
            </div>
            <p className="text-white font-display text-2xl mb-2">
              You&apos;re in, {selectedRole}!
            </p>
            <p className="text-sm" style={{ color: '#6b6760' }}>
              Check your inbox for your welcome email and first batch of prompts.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const Home: FC = () => (
  <>
    <SEO
      title="GetPromptly – AI Tools & Training for UK Education | KCSIE Safe"
      description="GetPromptly is the UK's trusted platform for KCSIE-safe AI tools, independent equipment reviews, and free CPD training for teachers, SLT, SEND leads, and parents."
      keywords="AI tools UK schools, KCSIE AI, AI education UK, school AI safety, AI CPD teachers, AI for SLT, SEND AI tools, UK EdTech 2026"
      path=""
      jsonLd={homePageJsonLd}
    />
    <Hero />
    <TrustBar />
    <HubsSection />
    <WhySection />
    <SafetySection />
    <AgentsSection />
    <PromptsSection />
    <CrossSellSection />
    <TeamSection />
    <VisionSection />
    <EmailCapture />
  </>
);

export default Home;
