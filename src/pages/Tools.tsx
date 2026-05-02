import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLabel from '../components/SectionLabel';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import AgentCTACard from '../components/AgentCTACard';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { BubbleLayer } from '../components/Bubbles';
import LeadMagnet from '../components/LeadMagnet';
import { useCrossSell } from '../hooks/useCrossSell';
import type { CrossSellContext } from '../utils/crossSell';
import { linkLabel, inferLinkType } from '../utils/linkType';
import {
  type Tier, type ToolRaw, type Tool,
  TOOLS_RAW, TOOLS, toSlug,
  PILLARS, derivePillars, tierAction,
  CAT_COLOURS, TIER_STYLE,
} from '../data/tools';

// Promptly palette tokens (mirror :root CSS variables)
const TEAL   = '#BEFF00';   // legacy alias kept for zero-churn changes; same hex as LIME
const LIME   = '#BEFF00';
const CYAN   = '#00D1FF';
const PURPLE = '#A78BFA';
const YELLOW = '#FFEA00';
const DARK   = '#0F1C1A';
const INK    = '#0F1C1A';
const INK_SOFT = '#4A4A4A';
const BORDER  = '#ECE7DD';

// Reusable lime-gradient button style — lime + dark ink text + glow + inset highlight
const LIME_BTN: React.CSSProperties = {
  background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
  color: INK,
  border: '1px solid rgba(15,28,26,0.16)',
  boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
};

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
      style={{ borderColor: '#ECE7DD', background: 'white' }}
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
        <button onClick={onClose} className="text-lg leading-none transition-opacity hover:opacity-60" style={{ color: '#4A4A4A' }} aria-label="Close">
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
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9C9690' }}>Safety Pillar Breakdown</p>
              <div className="space-y-2.5">
                {PILLARS.map((pillar, i) => {
                  const val = pillars[i];
                  const pct = (val / 10) * 100;
                  const barColour = val >= 8 ? '#16a34a' : val >= 6 ? '#d97706' : val >= 4 ? '#ea580c' : '#dc2626';
                  return (
                    <div key={pillar}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#4A4A4A' }}>{pillar}</span>
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
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9C9690' }}>Suitable For</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.audience.map(a => (
                  <span key={a} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(190,255,0,0.18)', color: INK, border: '1px solid rgba(190,255,0,0.35)' }}>
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
        <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>{tool.desc}</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
            style={LIME_BTN}
          >
            {linkLabel(tool.linkType ?? inferLinkType(tool.url))} →
          </a>
          <button
            onClick={onCompare}
            className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border transition-colors hover:bg-[#F8F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
            style={{ background: 'white', color: INK, borderColor: BORDER }}
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
          <p className="text-[10px] text-center" style={{ color: '#9C9690' }}>Last reviewed: {tool.lastReviewed}</p>
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
        <button onClick={onClose} className="mt-4 text-xs font-bold transition-opacity hover:opacity-70 underline decoration-dotted underline-offset-4" style={{ color: INK }}>
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
      style={{ borderColor: '#ECE7DD', background: 'white' }}
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
          <button onClick={onClose} className="text-lg leading-none transition-opacity hover:opacity-60" style={{ color: '#4A4A4A' }} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="review-tool-name" className="text-xs font-semibold mb-1 block" style={{ color: '#4A4A4A' }}>Tool name or URL</label>
          <input
            id="review-tool-name"
            type="text"
            required
            value={toolName}
            onChange={e => setToolName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#BEFF00]"
            style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: '#1A1A1A' }}
          />
        </div>
        <div>
          <label htmlFor="review-email" className="text-xs font-semibold mb-1 block" style={{ color: '#4A4A4A' }}>Email (optional — we'll notify you when reviewed)</label>
          <input
            id="review-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@school.ac.uk"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#BEFF00]"
            style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: '#1A1A1A' }}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
            style={LIME_BTN}
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
        <p className="text-[10px] text-center" style={{ color: '#9C9690' }}>
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
  // Searchable / queryable data attributes — exposed for QA, snapshot tests and
  // any future client-side instant-search overlays. The visible count is
  // derived from the same `filtered` array that produces these cards, so the
  // empty state can never disagree with what's actually rendered.
  const dataAttrs = {
    'data-tool-card': 'true',
    'data-tool-slug': tool.slug,
    'data-tool-name': tool.name,
    'data-tool-category': tool.category,
    'data-tool-subcategory': tool.subcategory,
    'data-tool-roles': tool.audience.join('|'),
    'data-tool-safety': tool.reviewNeeded ? 'review' : String(tool.safety),
    'data-tool-tier': tool.tier,
    'data-tool-price': tool.free ? 'free' : 'paid',
    'data-tool-uk-readiness': tool.ukReady ?? 'Unknown',
  } as Record<string, string>;
  return (
    <div
      {...dataAttrs}
      className="gp-tool-card flex flex-col rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderColor: inCompare ? LIME : BORDER,
        background: 'white',
        outline: inCompare ? `2px solid ${LIME}` : undefined,
        boxShadow: inCompare
          ? '0 0 0 4px rgba(190,255,0,0.18), 0 8px 22px rgba(15,28,26,0.06)'
          : '0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 0 rgba(15,28,26,0.04)',
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
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(190,255,0,0.20)', color: INK, border: '1px solid rgba(190,255,0,0.40)' }}>
              Free tier
            </span>
          )}
        </div>

        {/* Name + subcategory */}
        <h2 className="font-display text-base leading-tight mb-0.5" style={{ color: 'var(--text)' }}>
          {tool.name}
        </h2>
        <p className="text-[10px] mb-3" style={{ color: '#9C9690' }}>{tool.subcategory}</p>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#4A4A4A' }}>{tool.desc}</p>

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
            <p className="text-[9px] mt-1" style={{ color: '#9C9690' }}>Reviewed {tool.lastReviewed}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTryDemo?.(tool)}
            className="flex-1 text-center text-xs font-bold py-2 rounded-lg transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
            style={LIME_BTN}
          >
            {linkLabel(tool.linkType ?? inferLinkType(tool.url))} →
          </a>
          <button
            onClick={onToggleCompare}
            disabled={compareDisabled && !inCompare}
            className="text-sm font-bold px-2.5 py-2 rounded-lg border transition-all disabled:opacity-30 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
            style={inCompare
              ? { background: LIME, color: INK, borderColor: LIME }
              : { background: 'white', color: INK_SOFT, borderColor: BORDER }
            }
            aria-label={inCompare ? `Remove ${tool.name} from compare` : `Add ${tool.name} to compare`}
            aria-pressed={inCompare}
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
        className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
        style={LIME_BTN}
      >
        Compare Now ▶
      </button>
      <button
        onClick={onClear}
        className="text-xs transition-opacity hover:opacity-60"
        style={{ color: 'rgba(255,255,255,0.65)' }}
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
    { label: 'Description', render: t => <span className="text-xs leading-relaxed" style={{ color: '#4A4A4A' }}>{t.desc}</span> },
    { label: 'Try',         render: t => (
      <a href={t.url} target="_blank" rel="noopener noreferrer"
        className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
        style={LIME_BTN}>
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
        style={{ background: 'white', border: '1px solid #ECE7DD' }}
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
            style={{ color: '#4A4A4A' }} aria-label="Close">✕</button>
        </div>

        {/* Tool name headers */}
        <div className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, borderColor: '#ECE7DD' }}>
          <div className="px-4 py-3" style={{ background: '#F8F5F0' }} />
          {tools.map(t => (
            <div key={t.slug} className="px-4 py-3 border-l" style={{ background: '#F8F5F0', borderColor: '#ECE7DD' }}>
              <p className="font-display text-sm font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#9C9690' }}>{t.category}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map(row => (
          <div key={row.label} className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, borderColor: '#f3f4f6' }}>
            <div className="px-4 py-3 flex items-start" style={{ background: '#F8F5F0' }}>
              <span className="text-xs font-semibold" style={{ color: '#4A4A4A' }}>{row.label}</span>
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

  // ── Single source of truth for what is rendered ──────────────────────────
  // `visibleTools` drives BOTH the grid map and the empty state, so the
  // count, the cards and the "no results" message can never disagree. Result
  // count is announced via aria-live so AT users hear filter outcomes.
  const visibleTools = filtered;
  const visibleCount = visibleTools.length;
  const filtersActive =
    roleTab !== 'All' ||
    catFilter !== 'All' ||
    safetyFilter !== 'All' ||
    search.trim() !== '';

  function clearAllFilters() {
    setRoleTab('All');
    setCatFilter('All');
    setSafetyFilter('All');
    setSearch('');
    track({ name: 'filter_applied', section: 'tools', filter: 'clear-all', value: 'reset' });
  }

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
      <section className="relative overflow-hidden" style={{ background: '#0F1C1A' }}>
        <BubbleLayer
          bubbles={[
            { variant: 'lime', size: 380, top: '-20%', left: '-8%', anim: 'gp-float-a' },
            { variant: 'cyan', size: 340, top: '15%', right: '-10%', anim: 'gp-float-b' },
            { variant: 'soft-purple', size: 220, bottom: '-15%', left: '45%', anim: 'gp-float-c' },
          ]}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 z-10">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-6 px-3 py-1.5 rounded-full"
            style={{
              color: '#BEFF00',
              background: 'rgba(190,255,0,0.10)',
              border: '1px solid rgba(190,255,0,0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#BEFF00', boxShadow: '0 0 6px #BEFF00' }} aria-hidden="true" />
            AI Tools Directory
          </span>
          <h1 className="font-display text-5xl sm:text-6xl mb-5 leading-[1.05]" style={{ color: 'white' }}>
            AI Tools for<br />
            <em
              className="not-italic"
              style={{
                backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >UK Education.</em>
          </h1>
          <p className="text-base sm:text-lg max-w-xl mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {STAT_TOTAL} tools independently safety-scored against KCSIE 2025. Filtered by your role. No paid placements. Last updated Apr 2026.
          </p>

          {/* Stat boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { label: 'Total Tools',  value: STAT_TOTAL,    accent: '#BEFF00' },
              { label: 'Trusted Tier', value: STAT_TRUSTED,  accent: '#00D1FF' },
              { label: 'SEND Tools',   value: STAT_SEND,     accent: '#A78BFA' },
              { label: 'Free Tier',    value: STAT_FREE,     accent: '#FFEA00' },
            ].map(s => (
              <div
                key={s.label}
                className="px-5 py-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(180deg, #142522 0%, #0F1C1A 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 18px rgba(0,0,0,0.30)',
                }}
              >
                <p className="font-display text-3xl font-bold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-10">
        {/* ── SCORE A TOOL ── */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            border: '1px solid rgba(190,255,0,0.30)',
            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(190,255,0,0.04) 100%)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 22px rgba(15,28,26,0.06)',
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: '#0F1C1A' }}>Score a Tool</p>
          <h2 className="font-display text-xl sm:text-2xl mb-2" style={{ color: 'var(--text)' }}>
            Check any AI tool's safety score
          </h2>
          <p className="text-sm mb-4" style={{ color: '#4A4A4A' }}>
            Type a tool name or paste a URL — we'll show you its safety rating, pillar breakdown and recommended action.
          </p>
          <form onSubmit={handleScoreTool} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: '#0F1C1A' }}>🔍</span>
              <input
                type="text"
                value={scoreQuery}
                onChange={e => setScoreQuery(e.target.value)}
                placeholder="e.g. ChatGPT, Canva, briskteaching.com…"
                className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#BEFF00] transition-colors"
                style={{ borderColor: '#ECE7DD', background: 'white', color: 'var(--text)' }}
                aria-label="Tool name or URL"
              />
            </div>
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
              style={{
                background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                color: '#0F1C1A',
                border: '1px solid rgba(15,28,26,0.16)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
              }}
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
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: '#9C9690' }}>🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) track({ name: 'search_performed', section: 'tools', query: e.target.value });
              }}
              placeholder={`Search ${STAT_TOTAL} tools by name, category or description…`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#BEFF00] transition-colors"
              style={{ borderColor: '#ECE7DD', background: 'white', color: 'var(--text)' }}
            />
          </div>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as SortOption)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#BEFF00]"
            style={{ borderColor: '#ECE7DD', background: 'white', color: '#4A4A4A', minWidth: '180px' }}
          >
            <option value="A-Z">Sort: A–Z</option>
            <option value="Safety Score">Sort: Safety Score ↓</option>
          </select>
        </div>

        {/* Role tabs */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="tablist"
          aria-label="Filter tools by role"
        >
          {ROLE_TABS.map(r => {
            const active = roleTab === r;
            return (
              <button
                key={r}
                role="tab"
                aria-selected={active}
                aria-pressed={active}
                onClick={() => {
                  setRoleTab(r);
                  track({ name: 'filter_applied', section: 'tools', filter: 'role', value: r });
                  if (r !== 'All') track({ name: 'role_selected', role: r, pageType: 'tools-directory' });
                  track({ name: 'tool_filter_used', filterType: 'role', value: r, pageType: 'tools-directory' });
                }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
                style={active
                  ? {
                      background: DARK,
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.05)',
                      boxShadow: '0 0 0 1px rgba(190,255,0,0.18), 0 0 18px rgba(190,255,0,0.18), 0 8px 18px rgba(15,28,26,0.18)',
                    }
                  : { background: 'white', color: INK_SOFT, borderColor: BORDER }
                }
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Category pills — horizontally scrollable on mobile so all 18 are reachable */}
        <div
          className="flex flex-nowrap sm:flex-wrap gap-2 mb-3 overflow-x-auto sm:overflow-visible -mx-5 sm:mx-0 px-5 sm:px-0 pb-1 sm:pb-0"
          role="group"
          aria-label="Filter tools by category"
          style={{ scrollbarWidth: 'thin' }}
        >
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
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
                style={active
                  ? { background: cs?.text ?? DARK, color: 'white', borderColor: cs?.text ?? DARK }
                  : { background: 'white', color: INK_SOFT, borderColor: BORDER }
                }
                aria-pressed={active}
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
            const active = safetyFilter === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setSafetyFilter(s);
                  track({ name: 'filter_applied', section: 'tools', filter: 'safety', value: s });
                  track({ name: 'tool_filter_used', filterType: 'safety', value: s, pageType: 'tools-directory' });
                }}
                className="px-3 py-1 rounded-full text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
                style={active
                  ? { background: style.bg, color: style.text, borderColor: style.text }
                  : { background: 'white', color: INK_SOFT, borderColor: BORDER }
                }
                aria-pressed={active}
              >
                {s === 'All' ? 'All tiers' : s}
              </button>
            );
          })}

          {/* Clear-all-filters — appears only when something is filtering */}
          {filtersActive && (
            <button
              onClick={clearAllFilters}
              className="ml-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
              style={{
                background: 'white',
                color: INK,
                borderColor: LIME,
                boxShadow: '0 0 0 3px rgba(190,255,0,0.18)',
              }}
              aria-label="Clear all filters"
              data-testid="clear-all-filters"
            >
              <span aria-hidden="true">✕</span> Clear all
            </button>
          )}

          {/* Result count — aria-live announces changes after each search/filter */}
          <div
            className="ml-auto text-xs"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-testid="tools-result-count"
            data-visible-count={visibleCount}
            data-total-count={STAT_TOTAL}
            style={{ color: '#9C9690' }}
          >
            Showing <strong style={{ color: INK }}>{visibleCount}</strong> of {STAT_TOTAL} tools
            {filtersActive && visibleCount > 0 && <span className="sr-only"> matching your filters</span>}
            {visibleCount === 0 && <span className="sr-only"> — no matches; try clearing filters</span>}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* Main grid — `visibleTools` is the single source for both grid + empty state */}
          <div className="flex-1 min-w-0" data-testid="tools-grid-container" data-visible-count={visibleCount}>
            {visibleCount === 0 ? (
              <div
                className="p-8 sm:p-10 rounded-2xl border"
                style={{
                  borderColor: BORDER,
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(190,255,0,0.04) 100%)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 22px rgba(15,28,26,0.06)',
                }}
                data-testid="tools-empty-state"
              >
                <span
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-4"
                  style={{ background: 'rgba(190,255,0,0.18)', color: INK, border: '1px solid rgba(190,255,0,0.35)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: LIME, boxShadow: '0 0 6px rgba(190,255,0,0.65)' }} aria-hidden="true" />
                  No matches
                </span>
                <p className="font-display text-2xl sm:text-3xl mb-2" style={{ color: INK }}>
                  Nothing here for{' '}
                  <em
                    className="not-italic"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontStyle: 'italic',
                    }}
                  >
                    that combination.
                  </em>
                </p>
                <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-xl" style={{ color: INK_SOFT }}>
                  Try removing one filter, searching a broader task like &ldquo;feedback&rdquo; or &ldquo;SEND&rdquo;, or tell us about a tool we should review next — we update the directory monthly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {filtersActive && (
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
                      style={LIME_BTN}
                    >
                      Clear all filters
                    </button>
                  )}
                  <a
                    href="mailto:info@getpromptly.co.uk?subject=Suggest%20an%20AI%20tool%20for%20GetPromptly"
                    onClick={() => track({ name: 'cta_clicked', section: 'tools-empty-state', label: 'Suggest a tool email' })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-colors hover:border-[#0F1C1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
                    style={{ borderColor: BORDER, color: INK, background: 'white' }}
                  >
                    Suggest a tool — info@getpromptly.co.uk
                  </a>
                </div>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-testid="tools-grid"
                data-visible-count={visibleCount}
              >
                {visibleTools.map(tool => (
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
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#ECE7DD' }}>
              <div className="px-4 py-3 border-b" style={{ background: '#111210', borderColor: '#1f1f1c' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#4A4A4A' }}>Promptly AI</p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>Ask about any tool</p>
              </div>
              <div className="p-4" style={{ background: 'white' }}>
                <p className="rounded-xl p-3 mb-3 text-sm leading-relaxed italic" style={{ background: '#F8F5F0', color: INK_SOFT }}>
                  "Which SEND tools work with Google Classroom?"
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
                  style={LIME_BTN}
                >
                  Ask Promptly AI →
                </button>
                <p className="text-[10px] text-center mt-2" style={{ color: '#9C9690' }}>Powered by Claude · Free</p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#ECE7DD', background: 'white' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#9C9690' }}>Directory</p>
              <div className="space-y-2.5">
                {[
                  ['Tools reviewed', STAT_TOTAL.toString()],
                  ['Trusted tier',   STAT_TRUSTED.toString()],
                  ['SEND tools',     STAT_SEND.toString()],
                  ['Free tier',      STAT_FREE.toString()],
                  ['Last updated',   'Apr 2026'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span style={{ color: '#4A4A4A' }}>{l}</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety key */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#ECE7DD', background: 'white' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>Safety Tiers</p>
                <Link to="/safety-methodology" className="text-[10px] font-bold hover:opacity-70 transition-opacity underline decoration-dotted underline-offset-2" style={{ color: INK }}>
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
                    <span style={{ color: '#4A4A4A' }}>{item.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Cross-sell recommendations */}
            {inlineItems.length > 0 && (
              <div className="rounded-2xl border p-4" style={{ borderColor: '#ECE7DD', background: 'white' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#9C9690' }}>Recommended</p>
                <div className="space-y-2">
                  {inlineItems.slice(0, 2).map(item => (
                    <CrossSellCard key={item.id} item={item} sourceSection="tools" compact />
                  ))}
                </div>
              </div>
            )}

            {/* Compare shortcut */}
            {compareList.length > 0 && (
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: LIME,
                  background: 'rgba(190,255,0,0.08)',
                  boxShadow: '0 0 0 4px rgba(190,255,0,0.10)',
                }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: INK }}>
                  {compareList.length}/3 tools selected
                </p>
                <button
                  onClick={() => compareList.length >= 2 && setCompareOpen(true)}
                  disabled={compareList.length < 2}
                  className="w-full py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                  style={LIME_BTN}
                >
                  Compare Now →
                </button>
                <button onClick={() => setCompareList([])} className="w-full text-center text-xs mt-2 hover:opacity-60" style={{ color: INK_SOFT }}>
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile agent CTA — handled by the hero AgentCTACard above */}
      </div>

      {/* ── SUGGEST A TOOL — prominent premium block ── */}
      <section
        id="suggest-a-tool"
        aria-labelledby="suggest-a-tool-heading"
        className="relative overflow-hidden"
        style={{ background: DARK }}
      >
        <BubbleLayer
          bubbles={[
            { variant: 'soft-lime', size: 320, top: '-15%', left: '-6%', anim: 'gp-float-a' },
            { variant: 'soft-cyan', size: 280, bottom: '-20%', right: '-8%', anim: 'gp-float-b' },
          ]}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-3">
              <span
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-5 px-3 py-1.5 rounded-full"
                style={{
                  color: LIME,
                  background: 'rgba(190,255,0,0.10)',
                  border: '1px solid rgba(190,255,0,0.25)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: LIME, boxShadow: '0 0 6px rgba(190,255,0,0.65)' }} aria-hidden="true" />
                We&apos;re listening
              </span>
              <h2
                id="suggest-a-tool-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] mb-5"
                style={{ color: 'white' }}
              >
                Spotted a tool we should{' '}
                <em
                  className="not-italic"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontStyle: 'italic',
                  }}
                >
                  review next?
                </em>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-7 max-w-xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Tell us the name, the website and the role it&apos;s for. We&apos;ll review it against KCSIE 2025, score it on our 5 safety pillars and publish the verdict — usually within 14 days.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <a
                  href="mailto:info@getpromptly.co.uk?subject=Suggest%20an%20AI%20tool%20for%20GetPromptly&body=Tool%20name%3A%20%0AWebsite%3A%20%0ASchool%20role%20it%20supports%3A%20%0AAnything%20else%20we%20should%20know%3A%20"
                  onClick={() => track({ name: 'cta_clicked', section: 'tools-suggest', label: 'Email info@getpromptly.co.uk' })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
                  style={LIME_BTN}
                  data-testid="suggest-a-tool-email"
                >
                  <span aria-hidden="true">✉</span> Email info@getpromptly.co.uk
                </a>
                <button
                  onClick={() => {
                    track({ name: 'cta_clicked', section: 'tools-suggest', label: 'Ask Promptly AI' });
                    window.dispatchEvent(new CustomEvent('open-agent-chat'));
                  }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  Or ask Promptly AI →
                </button>
              </div>

              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Direct line:{' '}
                <a
                  href="mailto:info@getpromptly.co.uk"
                  className="font-bold underline decoration-dotted underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                  style={{ color: LIME }}
                >
                  info@getpromptly.co.uk
                </a>
                {' '}— a real human reads every email.
              </p>
            </div>

            <div className="lg:col-span-2">
              <div
                className="rounded-3xl p-6 sm:p-7"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: LIME }}>
                  What happens next
                </p>
                <ol className="space-y-4">
                  {[
                    { n: '01', accent: LIME,   title: 'We review the tool',  desc: 'Against KCSIE 2025, UK GDPR and DfE guidance.' },
                    { n: '02', accent: CYAN,   title: 'We score 5 pillars',  desc: 'Privacy, safeguarding, age, transparency, accessibility.' },
                    { n: '03', accent: PURPLE, title: 'We publish the verdict', desc: 'Trusted, Guided or Emerging — usually within 14 days.' },
                    { n: '04', accent: YELLOW, title: 'We email you back',   desc: 'Direct reply with the score, no boilerplate.' },
                  ].map(s => (
                    <li key={s.n} className="flex items-start gap-3.5 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      <span
                        className="w-9 h-9 rounded-xl text-[11px] font-bold flex items-center justify-center flex-shrink-0"
                        style={{ background: `${s.accent}29`, color: s.accent, border: `1px solid ${s.accent}59` }}
                        aria-hidden="true"
                      >
                        {s.n}
                      </span>
                      <span>
                        <span className="block font-semibold" style={{ color: 'white' }}>{s.title}</span>
                        <span className="block text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.desc}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS SHORTLIST LEAD MAGNET ── */}
      <div style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
          <LeadMagnet
            eyebrow="Free download"
            headline="Email me the AI tools shortlist"
            description={
              <>
                A printable PDF of the top-scoring AI tools for UK education — by safety tier, by role and by classroom use case. Includes KCSIE 2025 notes and a side-by-side comparison sheet for your SLT.
              </>
            }
            buttonLabel="Email me the shortlist →"
            analyticsSection="tools-shortlist"
          />
        </div>
      </div>

      {/* ── CROSS-SELL STRIP — promotional dark band ── */}
      <section
        className="relative overflow-hidden px-5 sm:px-8 py-14"
        style={{ background: 'linear-gradient(180deg, #0F1C1A 0%, #1B302C 100%)' }}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
                style={{ background: 'rgba(190,255,0,0.18)', color: '#BEFF00' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#BEFF00', boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
                  aria-hidden="true"
                />
                Recommended training
              </span>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#FFFFFF' }}>
                A great tool is only half the answer.
              </h2>
              <p className="text-sm mt-2 max-w-xl" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Pair the right AI tool with structured CPD — DfE-backed courses, OpenAI Academy and premium certificates that fit alongside teaching.
              </p>
            </div>
            <Link to="/ai-training" className="hidden sm:block text-sm font-semibold hover:text-white transition-colors pb-1" style={{ color: '#BEFF00' }}>
              All training →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRAINING_CROSS_SELL.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link
                  to="/ai-training"
                  className="block p-5 rounded-2xl border transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    borderColor: 'rgba(255,255,255,0.10)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                  }}
                >
                  <span
                    className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3"
                    style={{ background: 'rgba(190,255,0,0.18)', color: '#BEFF00' }}
                  >
                    {item.tag}
                  </span>
                  <h3 className="font-display text-lg mb-1" style={{ color: '#FFFFFF' }}>{item.name}</h3>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.provider}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.desc}</p>
                  <span className="inline-block mt-4 text-xs font-bold" style={{ color: '#BEFF00' }}>Start learning →</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <Link to="/ai-training" className="sm:hidden block text-center mt-6 text-sm font-bold" style={{ color: '#BEFF00' }}>
            Browse all training →
          </Link>
        </div>
      </section>

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
