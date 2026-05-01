import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLabel from '../components/SectionLabel';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import AgentCTACard from '../components/AgentCTACard';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { useCrossSell } from '../hooks/useCrossSell';
import type { CrossSellContext } from '../utils/crossSell';
import { linkLabel, inferLinkType } from '../utils/linkType';
import {
  type Tier, type ToolRaw, type Tool,
  TOOLS_RAW, TOOLS, toSlug,
  PILLARS, derivePillars, tierAction,
  CAT_COLOURS, TIER_STYLE,
} from '../data/tools';

const TEAL = '#00808a';

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleTab      = 'All' | 'Teachers' | 'Students' | 'SENCO' | 'Parents' | 'Schools' | 'SLT' | 'Admin';
type SafetyFilter = 'All' | 'Trusted' | 'Guided' | 'Emerging';
type SortOption   = 'A-Z' | 'Safety Score';



// ─── Filter constants ─────────────────────────────────────────────────────────

const ROLE_TABS: RoleTab[] = ['All', 'Teachers', 'Students', 'SENCO', 'Parents', 'Schools', 'SLT', 'Admin'];
const CAT_FILTERS = [
  'All', 'Teacher AI', 'Student AI', 'SEND', 'Writing', 'General AI',
  'Creative', 'Systems', 'Parents', 'Assessment', 'Coding',
  'Research', 'Productivity', 'Wellbeing',
  'Literacy', 'MIS & Analytics', 'Safeguarding', 'AI Policy',
] as const;
const SAFETY_FILTERS: SafetyFilter[] = ['All', 'Trusted', 'Guided', 'Emerging'];


// ─── Score result panel ───────────────────────────────────────────────────────

function ScoreResultPanel({ tool, onClose, onCompare, onAsk }: {
  tool: Tool; onClose: () => void; onCompare: () => void; onAsk: () => void;
}) {
  const pillars = derivePillars(tool);
  const ts = TIER_STYLE[tool.tier];
  const catStyle = CAT_COLOURS[tool.category] ?? { bg: '#f3f4f6', text: '#374151' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ background: '#111210' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: tool.safety >= 9 ? '#16a34a' : tool.safety >= 7 ? '#d97706' : tool.safety >= 5 ? '#ea580c' : '#dc2626' }}
          >
            {tool.reviewNeeded ? '?' : tool.safety}
          </div>
          <div>
            <h3 className="font-display text-lg" style={{ color: 'white' }}>{tool.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.text }}>
                {tool.category}
              </span>
              {!tool.reviewNeeded && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.text }}>
                  {tool.tier}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-lg leading-none transition-opacity hover:opacity-60" style={{ color: '#6b6760' }} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall + tier */}
        {tool.reviewNeeded ? (
          <div className="rounded-xl p-4" style={{ background: '#f3f4f6' }}>
            <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
              This tool is under review. Pillar scores are not yet available.
            </p>
          </div>
        ) : (
          <>
            {/* Five pillar breakdown */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#c5c2bb' }}>Safety Pillar Breakdown</p>
              <div className="space-y-2.5">
                {PILLARS.map((pillar, i) => {
                  const val = pillars[i];
                  const pct = (val / 10) * 100;
                  const barColour = val >= 8 ? '#16a34a' : val >= 6 ? '#d97706' : val >= 4 ? '#ea580c' : '#dc2626';
                  return (
                    <div key={pillar}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#6b6760' }}>{pillar}</span>
                        <span className="font-semibold" style={{ color: barColour }}>{val}/10</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: barColour }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Role suitability */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#c5c2bb' }}>Suitable For</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.audience.map(a => (
                  <span key={a} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended action */}
            <div className="rounded-xl p-4" style={{ background: ts.bg }}>
              <p className="text-xs font-semibold mb-1" style={{ color: ts.text }}>Recommended Action</p>
              <p className="text-sm" style={{ color: ts.text }}>{tierAction(tool.tier)}</p>
            </div>
          </>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{tool.desc}</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            {linkLabel(tool.linkType ?? inferLinkType(tool.url))} →
          </a>
          <button
            onClick={onCompare}
            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border transition-all hover:opacity-80"
            style={{ background: 'white', color: TEAL, borderColor: TEAL }}
          >
            Compare with alternatives
          </button>
          <button
            onClick={onAsk}
            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border transition-all hover:opacity-80"
            style={{ background: '#111210', color: 'white', borderColor: '#111210' }}
          >
            Ask Promptly AI
          </button>
        </div>

        {tool.lastReviewed && (
          <p className="text-[10px] text-center" style={{ color: '#c5c2bb' }}>Last reviewed: {tool.lastReviewed}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Not-found / submit for review ───────────────────────────────────────────

function ToolNotFoundPanel({ query, onClose }: { query: string; onClose: () => void }) {
  const [toolName, setToolName] = useState(query);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) return;
    track({ name: 'tool_review_submitted', toolName: toolName.trim(), email: email.trim() || undefined });
    track({ name: 'tool_submitted_for_review', toolName: toolName.trim() });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border px-6 py-8 text-center"
        style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
      >
        <p className="text-xl mb-2">✅</p>
        <p className="text-sm font-semibold" style={{ color: '#15803d' }}>
          Thanks! We've added <strong>{toolName}</strong> to our review queue.
        </p>
        {email && (
          <p className="text-xs mt-1" style={{ color: '#16a34a' }}>
            We'll notify you at {email} when the review is complete.
          </p>
        )}
        <button onClick={onClose} className="mt-4 text-xs font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          Search another tool →
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="px-6 py-4" style={{ background: '#111210' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: '#9ca3af' }}>
              ?
            </div>
            <div>
              <h3 className="font-display text-lg" style={{ color: 'white' }}>We haven't reviewed this yet.</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                "{query}" isn't in our directory — but you can submit it for review.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-lg leading-none transition-opacity hover:opacity-60" style={{ color: '#6b6760' }} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="review-tool-name" className="text-xs font-semibold mb-1 block" style={{ color: '#6b6760' }}>Tool name or URL</label>
          <input
            id="review-tool-name"
            type="text"
            required
            value={toolName}
            onChange={e => setToolName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#00808a]"
            style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: '#1c1a15' }}
          />
        </div>
        <div>
          <label htmlFor="review-email" className="text-xs font-semibold mb-1 block" style={{ color: '#6b6760' }}>Email (optional — we'll notify you when reviewed)</label>
          <input
            id="review-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@school.ac.uk"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#00808a]"
            style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: '#1c1a15' }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            Submit for Review
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border transition-all hover:opacity-80"
            style={{ background: '#111210', color: 'white', borderColor: '#111210' }}
          >
            Ask Promptly AI about this tool
          </button>
        </div>
        <p className="text-[10px] text-center" style={{ color: '#c5c2bb' }}>
          We review tools against KCSIE 2025. No fake scores — ever.
        </p>
      </form>
    </motion.div>
  );
}

// ─── Safety badge (simple for grid performance) ───────────────────────────────

function SafetyBadge({ score, tier, reviewNeeded }: { score: number; tier: string; reviewNeeded?: true }) {
  if (reviewNeeded) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ background: '#9ca3af' }}
          aria-label="Review needed"
        >
          ?
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
          Review needed
        </span>
      </div>
    );
  }
  const colour = score >= 9 ? '#16a34a' : score >= 7 ? '#d97706' : score >= 5 ? '#ea580c' : '#dc2626';
  const ts = TIER_STYLE[tier as Tier] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ background: colour }}
        aria-label={`Safety score ${score} out of 10`}
      >
        {score}
      </div>
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.text }}>
        {tier}
      </span>
    </div>
  );
}

// ─── Tool card ────────────────────────────────────────────────────────────────

function ToolCard({
  tool, inCompare, onToggleCompare, compareDisabled, onTryDemo,
}: {
  tool: Tool; inCompare: boolean; onToggleCompare: () => void; compareDisabled: boolean; onTryDemo?: (tool: Tool) => void;
}) {
  const catStyle = CAT_COLOURS[tool.category] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{
        borderColor: inCompare ? TEAL : '#e8e6e0',
        background: 'white',
        outline: inCompare ? `2px solid ${TEAL}` : undefined,
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Row 1: category + badges */}
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.text }}>
            {tool.category}
          </span>
          {tool.ukReady === 'Yes' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#166534' }}>
              🇬🇧 UK Ready
            </span>
          )}
          {tool.free && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
              Free tier
            </span>
          )}
        </div>

        {/* Name + subcategory */}
        <h2 className="font-display text-base leading-tight mb-0.5" style={{ color: 'var(--text)' }}>
          {tool.name}
        </h2>
        <p className="text-[10px] mb-3" style={{ color: '#c5c2bb' }}>{tool.subcategory}</p>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#6b6760' }}>{tool.desc}</p>

        {/* Audience tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tool.audience.map(a => (
            <span key={a} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>
              {a}
            </span>
          ))}
        </div>

        {/* Safety score */}
        <div className="mb-4">
          <SafetyBadge score={tool.safety} tier={tool.tier} reviewNeeded={tool.reviewNeeded} />
          {tool.lastReviewed && (
            <p className="text-[9px] mt-1" style={{ color: '#c5c2bb' }}>Reviewed {tool.lastReviewed}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTryDemo?.(tool)}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            {linkLabel(tool.linkType ?? inferLinkType(tool.url))} →
          </a>
          <button
            onClick={onToggleCompare}
            disabled={compareDisabled && !inCompare}
            className="text-[10px] font-semibold px-2 py-2 rounded-lg border transition-all disabled:opacity-30 flex-shrink-0"
            style={inCompare
              ? { background: TEAL, color: 'white', borderColor: TEAL }
              : { background: 'white', color: '#9ca3af', borderColor: '#e8e6e0' }
            }
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            {inCompare ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compare bar (sticky bottom) ─────────────────────────────────────────────

function CompareBar({ count, onCompare, onClear }: { count: number; onCompare: () => void; onClear: () => void }) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
      style={{ background: '#111210', border: '1px solid #2a2825' }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: i < count ? TEAL : '#3a3835' }}
          />
        ))}
      </div>
      <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>
        {count}/3 selected
      </span>
      <button
        onClick={onCompare}
        disabled={count < 2}
        className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-40 hover:opacity-80"
        style={{ background: TEAL, color: 'white' }}
      >
        Compare Now ▶
      </button>
      <button
        onClick={onClear}
        className="text-xs transition-opacity hover:opacity-60"
        style={{ color: '#6b6760' }}
      >
        Clear
      </button>
    </motion.div>
  );
}

// ─── Compare modal ────────────────────────────────────────────────────────────

function CompareModal({ tools, onClose }: { tools: Tool[]; onClose: () => void }) {
  const rows: { label: string; render: (t: Tool) => React.ReactNode }[] = [
    { label: 'Category',    render: t => t.category },
    { label: 'Subcategory', render: t => t.subcategory },
    { label: 'Safety',      render: t => <SafetyBadge score={t.safety} tier={t.tier} reviewNeeded={t.reviewNeeded} /> },
    { label: 'UK Ready',    render: t => (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={t.ukReady === 'Yes' ? { background: '#dcfce7', color: '#166534' } : { background: '#f3f4f6', color: '#6b7280' }}>
        {t.ukReady}
      </span>
    )},
    { label: 'Free tier',   render: t => t.free ? '✓ Yes' : '— No' },
    { label: 'Audience',    render: t => (
      <div className="flex flex-wrap gap-1">
        {t.audience.map(a => (
          <span key={a} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>{a}</span>
        ))}
      </div>
    )},
    { label: 'Description', render: t => <span className="text-xs leading-relaxed" style={{ color: '#6b6760' }}>{t.desc}</span> },
    { label: 'Try',         render: t => (
      <a href={t.url} target="_blank" rel="noopener noreferrer"
        className="inline-block text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
        style={{ background: TEAL, color: 'white' }}>
        {linkLabel(t.linkType ?? inferLinkType(t.url))} →
      </a>
    )},
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(17,18,16,0.75)' }} />
      <motion.div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl"
        style={{ background: 'white', border: '1px solid #e8e6e0' }}
        initial={{ scale: 0.97, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 16 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ background: '#111210', borderBottom: '1px solid #1f1f1c' }}>
          <p className="text-sm font-semibold" style={{ color: 'white' }}>
            Comparing {tools.length} tools
          </p>
          <button onClick={onClose} className="text-lg leading-none transition-opacity hover:opacity-60"
            style={{ color: '#6b6760' }} aria-label="Close">✕</button>
        </div>

        {/* Tool name headers */}
        <div className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, borderColor: '#e8e6e0' }}>
          <div className="px-4 py-3" style={{ background: '#f7f6f2' }} />
          {tools.map(t => (
            <div key={t.slug} className="px-4 py-3 border-l" style={{ background: '#f7f6f2', borderColor: '#e8e6e0' }}>
              <p className="font-display text-sm font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#c5c2bb' }}>{t.category}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map(row => (
          <div key={row.label} className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, borderColor: '#f3f4f6' }}>
            <div className="px-4 py-3 flex items-start" style={{ background: '#f7f6f2' }}>
              <span className="text-xs font-semibold" style={{ color: '#6b6760' }}>{row.label}</span>
            </div>
            {tools.map(t => (
              <div key={t.slug} className="px-4 py-3 border-l text-xs" style={{ borderColor: '#f3f4f6', color: 'var(--text)' }}>
                {row.render(t)}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TRAINING_CROSS_SELL = [
  { name: 'AI Skills Hub', provider: 'DfE / Ufi VocTech', desc: 'Official DfE-backed CPD-aligned AI modules for every school role.', tag: 'Free · Accredited' },
  { name: 'Elements of AI', provider: 'Reaktor / U Helsinki', desc: 'World-renowned introductory AI course. No maths required. Certificate on completion.', tag: 'Free · Certificate' },
  { name: 'Google AI Essentials', provider: 'Google', desc: "Google's practical AI course — prompt writing, Gemini, and AI safety. Shareable certificate.", tag: 'Free · 8 hrs' },
];

// Pre-compute stats once
const STAT_TOTAL   = TOOLS.length;
const STAT_TRUSTED = TOOLS.filter(t => t.tier === 'Trusted').length;
const STAT_SEND    = TOOLS.filter(t => t.category === 'SEND').length;
const STAT_FREE    = TOOLS.filter(t => t.free).length;

export default function Tools() {
  const [roleTab,      setRoleTab]      = useState<RoleTab>('All');
  const [catFilter,    setCatFilter]    = useState<string>('All');
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>('All');
  const [sortOption,   setSortOption]   = useState<SortOption>('A-Z');
  const [search,       setSearch]       = useState('');
  const [compareList,  setCompareList]  = useState<string[]>([]);
  const [compareOpen,  setCompareOpen]  = useState(false);

  // Score-a-tool state
  const [scoreQuery,   setScoreQuery]   = useState('');
  const [scoredTool,   setScoredTool]   = useState<Tool | null>(null);
  const [scoreNotFound, setScoreNotFound] = useState(false);

  // Cross-sell
  const [xsCtx, setXsCtx] = useState<CrossSellContext>({ currentSection: 'tools' });
  const { inlineItems, popupItems, popupOpen, popupTrigger, triggerPopup, closePopup } = useCrossSell(xsCtx);

  function handleTryDemo(tool: Tool) {
    const ctx: CrossSellContext = {
      currentSection: 'tools',
      itemName: tool.name,
      category: tool.category,
      roles: tool.audience,
      senFocus: tool.category === 'SEND' ? ['SEND'] : undefined,
    };
    setXsCtx(ctx);
    triggerPopup('try_demo_clicked');
    const ltype = tool.linkType ?? inferLinkType(tool.url);
    track({ name: 'outbound_tool_click', toolSlug: tool.slug, toolName: tool.name, category: tool.category, linkType: ltype, source: 'direct', pageType: 'tools-directory' });
    track({ name: 'direct_source_click', itemId: tool.slug, itemName: tool.name, category: tool.category, pageType: 'tools-directory' });
  }

  function handleScoreTool(e: React.FormEvent) {
    e.preventDefault();
    const q = scoreQuery.trim().toLowerCase();
    if (!q) return;
    // Match by name, URL, or slug
    const match = TOOLS.find(t =>
      t.name.toLowerCase() === q ||
      t.slug === q.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      t.url.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    );
    track({ name: 'tool_score_searched', query: q, found: !!match });
    if (match) {
      setScoredTool(match);
      setScoreNotFound(false);
      track({ name: 'tool_score_viewed', toolSlug: match.slug, toolName: match.name, category: match.category, safety: match.safety, tier: match.tier });
    } else {
      setScoredTool(null);
      setScoreNotFound(true);
    }
  }

  function clearScoreResult() {
    setScoredTool(null);
    setScoreNotFound(false);
    setScoreQuery('');
  }

  function handleScoreCompare() {
    if (!scoredTool) return;
    // Find alternatives in same category with higher or equal safety
    const alts = TOOLS
      .filter(t => t.slug !== scoredTool.slug && t.category === scoredTool.category && !t.reviewNeeded)
      .sort((a, b) => b.safety - a.safety)
      .slice(0, 2);
    const slugs = [scoredTool.slug, ...alts.map(t => t.slug)];
    setCompareList(slugs);
    setCompareOpen(true);
    setScoredTool(null);
    track({ name: 'comparison_started', items: slugs.join(',') });
  }

  const filtered = useMemo(() => {
    let r = TOOLS;

    if (roleTab !== 'All') {
      if (roleTab === 'Schools') r = r.filter(t => t.audience.includes('Schools'));
      else r = r.filter(t => t.audience.includes(roleTab));
    }
    if (catFilter !== 'All')
      r = r.filter(t => t.category === catFilter);
    if (safetyFilter !== 'All')
      r = r.filter(t => t.tier === safetyFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.subcategory.toLowerCase().includes(q)
      );
    }

    const copy = [...r];
    if (sortOption === 'A-Z')
      copy.sort((a, b) => a.name.localeCompare(b.name));
    else
      copy.sort((a, b) => (b.reviewNeeded ? -1 : b.safety) - (a.reviewNeeded ? -1 : a.safety));
    return copy;
  }, [roleTab, catFilter, safetyFilter, search, sortOption]);

  const compareTools = useMemo(
    () => compareList.map(slug => TOOLS.find(t => t.slug === slug)!).filter(Boolean),
    [compareList]
  );

  function toggleCompare(slug: string) {
    setCompareList(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) :
      prev.length < 3 ? [...prev, slug] : prev
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title={`${STAT_TOTAL} AI Tools for UK Schools – KCSIE Checked | GetPromptly`}
        description={`${STAT_TOTAL} AI tools independently reviewed and safety-scored for UK schools. Filter by role — teachers, SEND, students, parents, SLT. Every tool KCSIE 2025 assessed.`}
        keywords="AI tools UK schools 2026, KCSIE AI tools, safe AI education, SEND AI tools, AI for teachers UK, school software reviews"
        path="/tools"
      />

      {/* ── HERO ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <SectionLabel>AI Tools Directory</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          AI Tools for<br />
          <span style={{ color: TEAL }}>UK Education.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-8" style={{ color: '#6b6760' }}>
          {STAT_TOTAL} tools independently safety-scored against KCSIE 2025. Filtered by your role. No paid placements. Last updated Apr 2026.
        </p>

        {/* Stat boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-10" style={{ background: '#e8e6e0' }}>
          {[
            { label: 'Total Tools',  value: STAT_TOTAL   },
            { label: 'Trusted Tier', value: STAT_TRUSTED  },
            { label: 'SEND Tools',   value: STAT_SEND     },
            { label: 'Free Tier',    value: STAT_FREE     },
          ].map(s => (
            <div key={s.label} className="px-6 py-5" style={{ background: 'white' }}>
              <p className="font-display text-3xl font-bold mb-0.5" style={{ color: TEAL }}>{s.value}</p>
              <p className="text-xs" style={{ color: '#6b6760' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── SCORE A TOOL ── */}
        <div className="rounded-2xl border p-6 mb-8" style={{ borderColor: TEAL, background: '#e0f5f6' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>Score a Tool</p>
          <h2 className="font-display text-xl sm:text-2xl mb-2" style={{ color: 'var(--text)' }}>
            Check any AI tool's safety score
          </h2>
          <p className="text-sm mb-4" style={{ color: '#6b6760' }}>
            Type a tool name or paste a URL — we'll show you its safety rating, pillar breakdown and recommended action.
          </p>
          <form onSubmit={handleScoreTool} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: TEAL }}>🔍</span>
              <input
                type="text"
                value={scoreQuery}
                onChange={e => setScoreQuery(e.target.value)}
                placeholder="e.g. ChatGPT, Canva, briskteaching.com…"
                className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#00808a]"
                style={{ borderColor: TEAL, background: 'white', color: 'var(--text)' }}
                aria-label="Tool name or URL"
              />
            </div>
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: 'white' }}
            >
              Score this tool
            </button>
          </form>
        </div>

        {/* ── SCORE RESULT ── */}
        <AnimatePresence mode="wait">
          {scoredTool && (
            <div className="mb-8">
              <ScoreResultPanel
                tool={scoredTool}
                onClose={clearScoreResult}
                onCompare={handleScoreCompare}
                onAsk={() => {
                  window.dispatchEvent(new CustomEvent('open-agent-chat'));
                  track({ name: 'agent_opened', section: 'score-a-tool' });
                }}
              />
            </div>
          )}
          {scoreNotFound && (
            <div className="mb-8">
              <ToolNotFoundPanel query={scoreQuery} onClose={clearScoreResult} />
            </div>
          )}
        </AnimatePresence>

        {/* ── AGENT CTA ── */}
        <div className="mb-8">
          <AgentCTACard
            section="Promptly AI · Tool Advisor"
            headline="Tell us your role and we'll shortlist 3 safe tools."
            description="Our AI advisor knows every tool in the directory — safety scores, KCSIE compliance, free tiers — and matches them to your needs."
            prompts={[
              "What's the safest AI tool for a Year 5 classroom?",
              "Compare ChatGPT and Gemini for secondary school use",
              "Which SEND tools work with Google Classroom?",
              "What free AI tools reduce teacher workload?",
            ]}
            analyticsSection="tools"
          />
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: '#c5c2bb' }}>🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) track({ name: 'search_performed', section: 'tools', query: e.target.value });
              }}
              placeholder={`Search ${STAT_TOTAL} tools by name, category or description…`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors"
              style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
            />
          </div>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as SortOption)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a]"
            style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760', minWidth: '180px' }}
          >
            <option value="A-Z">Sort: A–Z</option>
            <option value="Safety Score">Sort: Safety Score ↓</option>
          </select>
        </div>

        {/* Role tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ROLE_TABS.map(r => (
            <button
              key={r}
              onClick={() => {
                setRoleTab(r);
                track({ name: 'filter_applied', section: 'tools', filter: 'role', value: r });
                if (r !== 'All') track({ name: 'role_selected', role: r, pageType: 'tools-directory' });
                track({ name: 'tool_filter_used', filterType: 'role', value: r, pageType: 'tools-directory' });
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={roleTab === r
                ? { background: TEAL, color: 'white', borderColor: TEAL }
                : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
              }
            >
              {r}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CAT_FILTERS.map(c => {
            const cs = CAT_COLOURS[c];
            const active = catFilter === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setCatFilter(c);
                  track({ name: 'tool_filter_used', filterType: 'category', value: c, pageType: 'tools-directory' });
                }}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={active
                  ? { background: cs?.text ?? '#111210', color: 'white', borderColor: cs?.text ?? '#111210' }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
                }
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Safety filter + result count row */}
        <div className="flex flex-wrap items-center gap-2">
          {SAFETY_FILTERS.map(s => {
            const style = s === 'Trusted' ? TIER_STYLE.Trusted
                        : s === 'Guided'  ? TIER_STYLE.Guided
                        : s === 'Emerging'? TIER_STYLE.Emerging
                        : { bg: '#f3f4f6', text: '#6b7280' };
            return (
              <button
                key={s}
                onClick={() => {
                  setSafetyFilter(s);
                  track({ name: 'filter_applied', section: 'tools', filter: 'safety', value: s });
                  track({ name: 'tool_filter_used', filterType: 'safety', value: s, pageType: 'tools-directory' });
                }}
                className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                style={safetyFilter === s
                  ? { background: style.bg, color: style.text, borderColor: style.text }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
                }
              >
                {s === 'All' ? 'All tiers' : s}
              </button>
            );
          })}
          <span className="ml-auto text-xs" style={{ color: '#c5c2bb' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {STAT_TOTAL} tools
          </span>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="p-10 text-center rounded-2xl border" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                <p className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>No exact matches yet.</p>
                <p className="text-sm mb-5" style={{ color: '#6b6760' }}>
                  Try removing one filter, searching a broader task such as "feedback" or "SEND", or suggest a tool for review.
                </p>
                <a
                  href="mailto:info@getpromptly.co.uk?subject=Suggest%20an%20AI%20tool%20for%20GetPromptly"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:border-[#00808a] hover:text-[#00808a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
                  style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
                >
                  Suggest a tool at info@getpromptly.co.uk
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(tool => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    inCompare={compareList.includes(tool.slug)}
                    onToggleCompare={() => toggleCompare(tool.slug)}
                    compareDisabled={compareList.length >= 3}
                    onTryDemo={handleTryDemo}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── STICKY SIDEBAR (desktop) ── */}
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 space-y-4 mt-1">

            {/* Agent panel */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e6e0' }}>
              <div className="px-4 py-3 border-b" style={{ background: '#111210', borderColor: '#1f1f1c' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b6760' }}>Promptly AI</p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>Ask about any tool</p>
              </div>
              <div className="p-4" style={{ background: 'white' }}>
                <p className="rounded-xl p-3 mb-3 text-sm leading-relaxed italic" style={{ background: '#f7f6f2', color: '#6b6760' }}>
                  "Which SEND tools work with Google Classroom?"
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Ask Promptly AI →
                </button>
                <p className="text-[10px] text-center mt-2" style={{ color: '#c5c2bb' }}>Powered by Claude · Free</p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#c5c2bb' }}>Directory</p>
              <div className="space-y-2.5">
                {[
                  ['Tools reviewed', STAT_TOTAL.toString()],
                  ['Trusted tier',   STAT_TRUSTED.toString()],
                  ['SEND tools',     STAT_SEND.toString()],
                  ['Free tier',      STAT_FREE.toString()],
                  ['Last updated',   'Apr 2026'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span style={{ color: '#6b6760' }}>{l}</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety key */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>Safety Tiers</p>
                <Link to="/safety-methodology" className="text-[10px] font-semibold hover:opacity-70 transition-opacity" style={{ color: TEAL }}>
                  How? →
                </Link>
              </div>
              {([
                { tier: 'Trusted', range: '8–10', desc: 'Recommended' },
                { tier: 'Guided',  range: '6–7',  desc: 'Use with guidance' },
                { tier: 'Emerging',range: '≤5',   desc: 'Policy needed' },
              ] as const).map(item => {
                const s = TIER_STYLE[item.tier];
                return (
                  <div key={item.tier} className="flex items-center gap-2 text-xs mb-2">
                    <span className="w-10 text-center font-bold px-1 py-0.5 rounded" style={{ background: s.bg, color: s.text }}>
                      {item.range}
                    </span>
                    <span style={{ color: '#6b6760' }}>{item.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Cross-sell recommendations */}
            {inlineItems.length > 0 && (
              <div className="rounded-2xl border p-4" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#c5c2bb' }}>Recommended</p>
                <div className="space-y-2">
                  {inlineItems.slice(0, 2).map(item => (
                    <CrossSellCard key={item.id} item={item} sourceSection="tools" compact />
                  ))}
                </div>
              </div>
            )}

            {/* Compare shortcut */}
            {compareList.length > 0 && (
              <div className="rounded-2xl border p-4" style={{ borderColor: TEAL, background: '#e0f5f6' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: TEAL }}>
                  {compareList.length}/3 tools selected
                </p>
                <button
                  onClick={() => compareList.length >= 2 && setCompareOpen(true)}
                  disabled={compareList.length < 2}
                  className="w-full py-2 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-40 hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Compare Now →
                </button>
                <button onClick={() => setCompareList([])} className="w-full text-center text-xs mt-2 hover:opacity-60" style={{ color: '#6b6760' }}>
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile agent CTA — handled by the hero AgentCTACard above */}
      </div>

      {/* ── SUGGEST A TOOL ── */}
      <div style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5" style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>Suggest a tool</p>
              <h2 className="font-display text-xl mb-1.5" style={{ color: 'var(--text)' }}>Know a tool we should review?</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                Email the GetPromptly team with the tool name, website and the school role it supports.
              </p>
            </div>
            <a
              href="mailto:info@getpromptly.co.uk?subject=Suggest%20an%20AI%20tool%20for%20GetPromptly"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={{ background: TEAL }}
            >
              info@getpromptly.co.uk
            </a>
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL STRIP ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>Recommended Training</p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'white' }}>Go further with these tools.</h2>
            </div>
            <Link to="/training" className="hidden sm:block text-sm font-semibold hover:opacity-70 transition-opacity pb-1" style={{ color: TEAL }}>
              All training →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#1f1f1c' }}>
            {TRAINING_CROSS_SELL.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to="/training" className="block p-6 transition-colors hover:bg-[#181815]" style={{ background: '#111210' }}>
                  <span className="inline-block text-[10px] font-semibold px-2 py-1 rounded mb-3" style={{ background: '#0d1f0d', color: TEAL }}>{item.tag}</span>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'white' }}>{item.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#4b5563' }}>{item.provider}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{item.desc}</p>
                  <span className="inline-block mt-4 text-xs font-semibold" style={{ color: TEAL }}>Start learning →</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <Link to="/training" className="sm:hidden block text-center mt-6 text-sm font-semibold" style={{ color: TEAL }}>
            Browse all training →
          </Link>
        </div>
      </div>

      {/* ── COMPARE BAR ── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <CompareBar
            count={compareList.length}
            onCompare={() => setCompareOpen(true)}
            onClear={() => setCompareList([])}
          />
        )}
      </AnimatePresence>

      {/* ── COMPARE MODAL ── */}
      <AnimatePresence>
        {compareOpen && compareTools.length >= 2 && (
          <CompareModal tools={compareTools} onClose={() => setCompareOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── CROSS-SELL POPUP ── */}
      {popupOpen && popupItems.length > 0 && (
        <CrossSellPopup
          items={popupItems}
          trigger={popupTrigger}
          sourceSection="tools"
          onClose={closePopup}
        />
      )}
    </div>
  );
}
