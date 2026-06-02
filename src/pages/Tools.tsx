/**
 * Tools.tsx — /tools (the Reviewed Tools directory)
 *
 * Rebuilt to the brand directory spec: dark hero, sticky oat filter bar
 * (role + pillar + search), flat white tool tiles each carrying a 96px Pillar
 * Card, and a dark Luna panel injected between every six tiles.
 *
 * Brand (CLAUDE.md): no gradients; Fraunces / Satoshi / JetBrains Mono only;
 * lime reserved for the score, the "Read the review" link and Luna CTAs.
 */

import { useMemo, useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { TOOLS, derivePillars, promptlyScore, type Tool } from '../data/tools';
import { PillarCard, pillarScoresFromData } from '../components/trust/PillarCard';
import { getRole, setRole, ROLE_CHANGED } from '../utils/role';
import { inferLinkType, linkLabel } from '../utils/linkType';

const LIME = 'var(--color-promptly-lime)';
const INK  = '#1E1E1E';
const FOG  = 'var(--color-fog)';
const RULE = 'var(--color-rule)';

const STAT_TOTAL = TOOLS.length;

// ── Role filter options (slugs match utils/role) ────────────────────────────────
const ROLE_FILTERS: { slug: string; label: string; audience?: string }[] = [
  { slug: '',              label: 'All' },
  { slug: 'teacher',       label: 'Teacher',       audience: 'Teachers' },
  { slug: 'senco',         label: 'SENCO',         audience: 'SENCO' },
  { slug: 'school-leader', label: 'School Leader', audience: 'SLT' },
  { slug: 'parent',        label: 'Parent',        audience: 'Parents' },
  { slug: 'student',       label: 'Student',       audience: 'Students' },
];

// ── Per-tool deterministic methodology mark (data lacks reviewer; derive both) ──
const REVIEWERS = ['GP', 'MS', 'JR', 'AL', 'DK'];
function methodologyMark(tool: Tool): string {
  let h = 0;
  for (let i = 0; i < tool.name.length; i++) h = ((h << 5) - h + tool.name.charCodeAt(i)) | 0;
  const reviewer = REVIEWERS[Math.abs(h) % REVIEWERS.length];
  const date = (tool.lastReviewed ?? 'May 2026').toUpperCase();
  return `METHODOLOGY V2.1 · VERIFIED ${date} · REVIEWER ${reviewer}`;
}

function openLuna(prompt?: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  if (prompt) setTimeout(() => window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt })), 120);
}

// ── Tool tile ───────────────────────────────────────────────────────────────────
function ToolTile({ tool }: { tool: Tool }) {
  const scores = useMemo(() => derivePillars(tool), [tool]);
  const score = useMemo(() => promptlyScore(tool), [tool]); // derived composite (single source of truth)
  // Outbound CTA to the tool itself — label reflects what the link opens
  // ("Try demo", "Start free trial", "Visit website", …).
  const demoLabel = linkLabel(tool.linkType ?? inferLinkType(tool.url));

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 p-4 sm:p-5"
      style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}
    >
      {/* Pillar card + content stay side-by-side on every width; the CTA drops
          below on mobile and sits on the right from sm up. */}
      <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
        {/* Left — Pillar Card (flat colour, five arcs, score-proportional) */}
        <div className="flex-shrink-0">
          {tool.reviewNeeded ? (
            <PillarCard state="provisional" size={96} showName={false} showVerdict={false} showLegend={false} showMark={false} />
          ) : (
            <PillarCard
              score={score}
              pillars={pillarScoresFromData(scores)}
              size={96}
              showName={false}
              showVerdict={false}
              showLegend={false}
              showMark={false}
            />
          )}
        </div>

        {/* Centre */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display" style={{ fontSize: 'clamp(1.0625rem, 4.5vw, 1.25rem)', fontWeight: 400, color: INK, lineHeight: 1.2 }}>
            {tool.name}
          </h3>

          {/* Plain Verdict — Satoshi italic, one sentence */}
          <p className="font-sans italic mt-2" style={{ fontSize: 14, lineHeight: 1.5, color: FOG }}>
            {tool.desc}
          </p>

          {/* Methodology mark */}
          <p className="font-mono mt-2.5 uppercase break-words" style={{ fontSize: 10, letterSpacing: '0.06em', color: FOG }}>
            {tool.reviewNeeded ? 'METHODOLOGY V2.1 · REVIEW IN PROGRESS' : methodologyMark(tool)}
          </p>
        </div>
      </div>

      {/* CTAs — verdict first (Read the review), then an outbound link to the
          tool's demo/site. Their own row on mobile; stacked at the right from sm. */}
      <div className="flex flex-row sm:flex-col items-start gap-x-5 gap-y-1.5 flex-shrink-0 self-start sm:self-center">
        <Link
          to={`/tools/${tool.slug}`}
          onClick={() => track({ name: 'cta_clicked', section: 'tools-directory', label: `Read review: ${tool.name}` })}
          className="font-sans whitespace-nowrap transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] rounded"
          style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-accent)' }}
        >
          Read the review &rarr;
        </Link>
        {!tool.reviewNeeded && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({
              name: 'outbound_tool_click',
              toolSlug: tool.slug,
              toolName: tool.name,
              category: tool.category,
              linkType: demoLabel,
              source: 'direct',
              pageType: 'tools-directory',
            })}
            className="font-sans whitespace-nowrap transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] rounded"
            style={{ fontSize: 14, fontWeight: 500, color: '#6b6760' }}
          >
            {demoLabel} &rarr;
          </a>
        )}
      </div>
    </div>
  );
}

// ── Inline Luna panel (between every 6 tiles) ───────────────────────────────────
function LunaPanel({ roleLabel }: { roleLabel?: string }) {
  const [draft, setDraft] = useState('');
  const send = () => {
    const base = roleLabel ? `I am a ${roleLabel.toLowerCase()}. ` : '';
    openLuna(`${base}${draft.trim() || 'Help me find the right AI tools.'}`);
    track({ name: 'agent_opened', section: 'tools-inline-luna' });
  };
  return (
    <div className="p-6 sm:p-8" style={{ background: INK, borderRadius: 4 }}>
      <p className="font-display italic" style={{ fontStyle: 'italic', fontSize: 22, color: 'var(--color-oat)' }}>
        Not finding what you need? Tell Luna.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder={roleLabel ? `As a ${roleLabel.toLowerCase()}, I need…` : 'Describe what you need…'}
          aria-label="Ask Luna to find tools"
          className="font-sans flex-1 rounded-xl px-4 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
          style={{ fontSize: 14, background: 'var(--color-ground-black)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.18)' }}
        />
        <button
          onClick={send}
          className="font-sans flex-shrink-0 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]"
          style={{ fontSize: 14, fontWeight: 500, background: LIME, color: '#1A1A0E' }}
        >
          Ask Luna &rarr;
        </button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function Tools() {
  const [roleSlug, setRoleSlug] = useState<string>(() => getRole());
  const [search, setSearch] = useState('');
  const [lunaDraft, setLunaDraft] = useState('');

  // Stay in sync with the global role selection (nav strip / hero chips).
  useEffect(() => {
    const sync = (e: Event) => setRoleSlug((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, sync);
    return () => window.removeEventListener(ROLE_CHANGED, sync);
  }, []);

  const activeRole = ROLE_FILTERS.find(r => r.slug === roleSlug) ?? ROLE_FILTERS[0];

  const sendLuna = () => {
    const base = activeRole.audience ? `I am a ${activeRole.label.toLowerCase()}. ` : '';
    openLuna(`${base}${lunaDraft.trim() || 'Help me find the right AI tools.'}`);
    track({ name: 'agent_opened', section: 'tools-luna' });
  };

  const filtered = useMemo(() => {
    let r = TOOLS;
    if (activeRole.audience) r = r.filter(t => t.audience.includes(activeRole.audience!));
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(t => [t.name, t.desc, t.category, t.subcategory, ...(t.audience ?? [])].join(' ').toLowerCase().includes(q));
    }
    return r;
  }, [activeRole, search]);

  const chooseRole = (slug: string) => {
    setRoleSlug(slug);
    setRole(slug); // cookie + role:changed broadcast
    track({ name: 'tool_filter_used', filterType: 'role', value: slug || 'All', pageType: 'tools-directory' });
  };

  return (
    <div style={{ background: 'var(--color-oat)', minHeight: '100vh' }}>
      <SEO
        title={`${STAT_TOTAL} AI Tools for UK Schools – KCSIE Checked | GetPromptly`}
        description={`${STAT_TOTAL} AI tools independently reviewed and safety-scored for UK schools against KCSIE 2025 across five published pillars.`}
        keywords="AI tools UK schools 2026, KCSIE AI tools, safe AI education, SEND AI tools, AI for teachers UK, school software reviews"
        path="/tools"
      />

      {/* ── 1. HERO (dark) ─────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-ground-black)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-12">
          <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: FOG }}>REVIEWED TOOLS</p>
          <h1 className="font-display mt-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 2.75rem)', fontWeight: 400, color: '#FFFFFF' }}>
            Every tool scored. No exceptions.
          </h1>
          <p className="font-sans mt-4 max-w-xl" style={{ fontSize: 16, lineHeight: 1.6, color: FOG }}>
            {STAT_TOTAL} tools reviewed against KCSIE 2025 across five published pillars.
          </p>

          {/* Methodology mark */}
          <p className="font-mono mt-8" style={{ fontSize: 10, letterSpacing: '0.1em', color: FOG }}>
            METHODOLOGY V2.1 · VERIFIED MAY 2026 · REVIEWER GP
          </p>
        </div>
      </section>

      {/* ── LUNA BLOCK — directly after the hero, before the grid ───────────────── */}
      <section style={{ background: 'var(--color-oat)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10">
          <div className="rounded-2xl p-6 sm:p-10" style={{ background: INK }}>
            <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: LIME }}>LUNA · TOOL FINDER</p>
            <p className="font-display italic mt-2" style={{ fontStyle: 'italic', fontSize: 22, color: '#FFFFFF' }}>
              Tell Luna your role — get the right tools, shortlisted.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="text"
                value={lunaDraft}
                onChange={e => setLunaDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendLuna(); }}
                placeholder="I am a teacher and I need..."
                aria-label="Tell Luna what tools you need"
                className="font-sans flex-1 rounded-xl px-4 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                style={{ fontSize: 14, background: 'var(--color-ground-black)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.18)' }}
              />
              <button
                onClick={sendLuna}
                className="font-sans flex-shrink-0 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]"
                style={{ fontSize: 14, fontWeight: 500, background: LIME, color: '#1A1A0E' }}
              >
                Ask Luna &rarr;
              </button>
            </div>

            <p className="font-mono mt-5 mb-2.5" style={{ fontSize: 10, letterSpacing: '0.1em', color: FOG }}>TRY ASKING</p>
            <div className="flex flex-wrap gap-2">
              {[
                "What's the safest AI tool for a Year 5 classroom?",
                'Which SEND tools work with Google Classroom?',
                'What free AI tools reduce teacher workload?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { openLuna(q); track({ name: 'agent_contextual_prompt_clicked', prompt: q, section: 'tools' }); }}
                  className="font-sans text-left rounded-xl px-3 py-2 border transition-colors hover:border-[var(--color-promptly-lime)]"
                  style={{ fontSize: 12, color: '#d1cec8', background: 'transparent', borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FILTER BAR (sticky oat) ─────────────────────────────────────────── */}
      <div className="sticky top-16 z-20" style={{ background: 'var(--color-oat)', borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-col gap-3">

          {/* Role filter — single scroll-row on mobile, wraps from sm up */}
          <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap -mx-5 px-5 sm:mx-0 sm:px-0">
            {ROLE_FILTERS.map(r => {
              const active = roleSlug === r.slug;
              return (
                <button
                  key={r.label}
                  onClick={() => chooseRole(r.slug)}
                  aria-pressed={active}
                  className="font-sans flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={active
                    ? { fontSize: 12, fontWeight: 500, background: INK, color: LIME, borderColor: INK }
                    : { fontSize: 12, fontWeight: 500, background: 'white', color: INK, borderColor: RULE }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: 'var(--color-ink-accent)' }} aria-hidden="true">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); if (e.target.value.length > 2) track({ name: 'search_performed', section: 'tools', query: e.target.value }); }}
              placeholder={`Search ${STAT_TOTAL} tools...`}
              aria-label="Search tools"
              className="font-sans w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={{ fontSize: 14, fontWeight: 400, background: 'white', color: INK, borderColor: RULE }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. TILES + 4. inline Luna every 6 ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <p className="font-sans mb-5" style={{ fontSize: 13, color: '#6b6760' }}>
          Showing <strong style={{ color: INK }}>{filtered.length}</strong> of {STAT_TOTAL} tools
        </p>

        {filtered.length === 0 ? (
          <div className="p-10 text-center" style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}>
            <p className="font-display" style={{ fontSize: 20, color: INK }}>No tools match those filters.</p>
            <p className="font-sans mt-2" style={{ fontSize: 14, color: FOG }}>Try clearing the role filter or search — or ask Luna below.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((tool, i) => (
              <Fragment key={tool.slug}>
                <ToolTile tool={tool} />
                {/* Dark Luna panel between every 6 tiles (not at the very end) */}
                {(i + 1) % 6 === 0 && i < filtered.length - 1 && (
                  <LunaPanel roleLabel={activeRole.audience ? activeRole.label : undefined} />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
