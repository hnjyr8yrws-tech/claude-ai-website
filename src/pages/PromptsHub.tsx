/**
 * PromptsHub.tsx — /prompts (Prompt Library)
 *
 * Rebuilt to the brand directory spec: left-aligned oat hero, a dark Luna
 * personaliser panel ABOVE the stat strip (it's the primary action), a stat
 * strip, a pillar-coloured subject filter, and flat prompt-pack tiles.
 *
 * Pillar colours do structural work here (§03): each subject focus maps to one
 * of the five pillars, so the dot tells you what the pack is about.
 * Brand (CLAUDE.md): no gradients; Fraunces / Satoshi / JetBrains Mono only;
 * left-aligned (no centred layout); lime reserved for CTAs + pack links.
 */

import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { PROMPT_PACKS, type PromptPack } from '../data/prompts';
import { getRole, setRole, ROLE_CHANGED } from '../utils/role';

const LIME = 'var(--color-promptly-lime)';
const INK  = '#1E1E1E';
const FOG  = 'var(--color-fog)';
const RULE = 'var(--color-rule)';

// ── Pillars (reserved §09 tokens) ───────────────────────────────────────────────
const PILLAR = {
  safeguarding:  { name: 'Safeguarding',    colour: 'var(--color-pillar-safeguarding)' },
  accessibility: { name: 'Accessibility',   colour: 'var(--color-pillar-accessibility)' },
  privacy:       { name: 'Data Privacy',    colour: 'var(--color-pillar-privacy)' },
  age:           { name: 'Age Suitability', colour: 'var(--color-pillar-age)' },
  transparency:  { name: 'Transparency',    colour: 'var(--color-pillar-transparency)' },
} as const;
type PillarKey = keyof typeof PILLAR;

// ── Filter config — maps REAL pack data values → display label + pillar colour ──
// (Audited from src/data/prompts.ts: packs carry `categorySlug`, `senFocus`,
// `stages`, `roles` — there is no `tags` field. A pack matches a filter if any
// of those real values appears in the filter's `values` array, all lowercased.)
interface SubjectFilter {
  key: PillarKey;
  label: string;
  values: string[];
}
const SUBJECT_FILTERS: SubjectFilter[] = [
  {
    key: 'safeguarding',
    label: 'Safeguarding & Safety',
    values: ['safeguarding', 'safety', 'kcsie', 'online-safety', 'wellbeing', 'school-leadership', 'senco-management'],
  },
  {
    key: 'accessibility',
    label: 'SEND & Accessibility',
    values: ['send', 'sen', 'all sen', 'accessibility', 'aac', 'inclusion', 'dyslexia', 'adhd',
             'autism', 'anxiety', 'executive dysfunction', 'study-skills', 'senco-management', 'sencos'],
  },
  {
    key: 'privacy',
    label: 'Data Privacy & GDPR',
    values: ['data-privacy', 'gdpr', 'data', 'privacy'],
  },
  {
    key: 'age',
    label: 'Age & Key Stage',
    values: ['ks1', 'ks2', 'ks3', 'ks4', 'eyfs', 'gcse', 'a-level', 'all ages', 'primary', 'secondary',
             'exam-preparation', 'essay-writing', 'maths-science', 'language-vocabulary', 'project-helpers', 'parent-caregiver'],
  },
  {
    key: 'transparency',
    label: 'Transparency & Critical Thinking',
    values: ['transparency', 'critical-thinking', 'ai-literacy', 'media-literacy',
             'creative-thinking', 'teacher-practice', 'reading-literacy'],
  },
];

/** All real, lowercased data values for a pack — the haystack a filter matches against. */
function packValues(pack: PromptPack): string[] {
  return [
    pack.categorySlug,
    ...(pack.senFocus ?? []),
    ...(pack.stages ?? []),
    ...(pack.roles ?? []),
  ].filter(Boolean).map(v => v.toLowerCase());
}

/** A pack's display pillar (for the tile badge) — first filter whose values it matches. */
function pillarFor(pack: PromptPack): PillarKey {
  const vals = packValues(pack);
  const hit = SUBJECT_FILTERS.find(f => f.values.some(v => vals.includes(v)));
  return hit ? hit.key : 'age';
}

// ── Role chips (slugs match utils/role) ─────────────────────────────────────────
const ROLE_CHIPS: { slug: string; label: string; role: string }[] = [
  { slug: 'teacher',       label: 'Teacher',       role: 'Teachers' },
  { slug: 'senco',         label: 'SENCO',         role: 'SENCO' },
  { slug: 'school-leader', label: 'School Leader', role: 'School Leaders' },
  { slug: 'parent',        label: 'Parent',        role: 'Parents' },
  { slug: 'student',       label: 'Student',       role: 'Students' },
];

function openLuna(prompt?: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  if (prompt) setTimeout(() => window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt })), 120);
}

// ── Pack tile ───────────────────────────────────────────────────────────────────
function PackTile({ pack }: { pack: PromptPack }) {
  const pillar = PILLAR[pillarFor(pack)];
  return (
    <div className="flex flex-col p-5" style={{ background: 'white', border: `1px solid ${RULE}`, borderRadius: 4 }}>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: INK }}>
            {pack.title}
          </h3>
          {/* Subject badge top-right */}
          <span className="font-mono inline-flex items-center gap-1.5 uppercase flex-shrink-0 mt-1.5" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#6b6760' }}>
            <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: pillar.colour }} aria-hidden="true" />
            {pillar.name}
          </span>
        </div>

        {/* Count */}
        <p className="font-sans mt-1" style={{ fontSize: 13, fontWeight: 500, color: '#6b6760' }}>
          {pack.promptCount} prompts{pack.free ? ' · Free' : ''}
        </p>

        {/* One-line description */}
        <p className="font-sans italic mt-2.5" style={{ fontSize: 14, lineHeight: 1.5, color: FOG }}>
          {pack.description}
        </p>
      </div>

      <Link
        to={`/prompts/pack/${pack.slug}`}
        onClick={() => track({ name: 'cta_clicked', section: 'prompts-grid', label: `View pack: ${pack.title}` })}
        className="font-sans inline-block mt-4 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] rounded"
        style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-accent)' }}
      >
        View pack &rarr;
      </Link>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
const PromptsHub = () => {
  const [roleSlug, setRoleSlug] = useState<string>(() => getRole());
  const [subject, setSubject] = useState<PillarKey | 'All'>('All');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const sync = (e: Event) => setRoleSlug((e as CustomEvent<string>).detail ?? getRole());
    window.addEventListener(ROLE_CHANGED, sync);
    return () => window.removeEventListener(ROLE_CHANGED, sync);
  }, []);

  // Dev audit (Step 1): log the real data values the filters must align to.
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Available categorySlugs:', [...new Set(PROMPT_PACKS.map(p => p.categorySlug))]);
      console.log('Available senFocus:', [...new Set(PROMPT_PACKS.flatMap(p => p.senFocus))]);
      console.log('Available stages:', [...new Set(PROMPT_PACKS.flatMap(p => p.stages))]);
      console.log('Filter coverage:', SUBJECT_FILTERS.map(f => ({
        label: f.label,
        count: PROMPT_PACKS.filter(p => f.values.some(v => packValues(p).includes(v))).length,
      })));
    }
  }, []);

  const activeRole = ROLE_CHIPS.find(r => r.slug === roleSlug);

  const stats = [
    { value: '50',   label: 'Prompt Packs' },
    { value: '440+', label: 'Prompts' },
    { value: '9',    label: 'Subject Categories' },
    { value: '8',    label: 'SEN Focus Areas' },
  ];

  const filtered = useMemo(() => {
    let r = PROMPT_PACKS;
    if (activeRole) r = r.filter(p => p.roles.some(role => role.toLowerCase().includes(activeRole.role.toLowerCase().split(' ')[0])));
    if (subject !== 'All') {
      // Match the selected filter's REAL data values against each pack's values.
      const f = SUBJECT_FILTERS.find(x => x.key === subject);
      if (f) r = r.filter(p => { const vals = packValues(p); return f.values.some(v => vals.includes(v)); });
    }
    return r;
  }, [activeRole, subject]);

  const chooseRole = (slug: string) => {
    const next = roleSlug === slug ? '' : slug;
    setRoleSlug(next);
    setRole(next); // cookie + role:changed broadcast
    track({ name: 'tool_filter_used', filterType: 'role', value: slug || 'All', pageType: 'prompts-hub' });
  };

  const buildPrompts = () => {
    const base = activeRole ? `I am a ${activeRole.label.toLowerCase()}. ` : '';
    openLuna(`${base}${draft.trim() || 'Create a prompt pack for my situation.'}`);
    track({ name: 'agent_opened', section: 'prompts-personaliser' });
  };

  return (
    <div style={{ background: 'var(--color-oat)', minHeight: '100vh' }}>
      <SEO
        title="440+ AI Prompts for UK Education | GetPromptly"
        description="Free AI prompts for teachers, parents, students, SENCOs and school leaders. Copy-ready prompts for Claude, ChatGPT and Gemini."
        keywords="AI prompts UK education, teacher prompts, SENCO prompts, GCSE revision prompts, SEN prompts, ChatGPT prompts school"
        path="/prompts"
      />

      {/* ── 1. HERO (oat, LEFT-ALIGNED) ────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-oat)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-12">
          <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: FOG }}>PROMPT LIBRARY</p>
          <h1 className="font-display mt-5" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 400, color: INK }}>
            440+ prompts. Ready to use.
          </h1>
          <p className="font-sans mt-4 max-w-xl" style={{ fontSize: 16, lineHeight: 1.6, color: FOG }}>
            Copy, adapt, use instantly — with Claude, ChatGPT or Gemini.
          </p>

          {/* CTAs — keep the 2-CTA pattern */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to="/prompts/library"
              onClick={() => track({ name: 'cta_clicked', section: 'prompts-hero', label: 'Browse All 50 Packs' })}
              className="font-sans inline-flex items-center justify-center rounded-full px-7 py-3.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2"
              style={{ fontSize: 15, fontWeight: 500, background: LIME, color: '#1A1A0E' }}
            >
              Browse All 50 Packs
            </Link>
            <button
              onClick={() => { openLuna(); track({ name: 'agent_opened', section: 'prompts-hero' }); }}
              className="font-sans inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 border transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
              style={{ fontSize: 15, fontWeight: 500, borderColor: INK, color: INK, background: 'transparent' }}
            >
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: LIME }} />
              </span>
              Ask Luna
            </button>
          </div>

          {/* Role chips directly below CTAs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {ROLE_CHIPS.map(r => {
              const active = roleSlug === r.slug;
              return (
                <button
                  key={r.slug}
                  onClick={() => chooseRole(r.slug)}
                  aria-pressed={active}
                  className="font-sans rounded-full px-4 py-2 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                  style={active
                    ? { fontSize: 13, fontWeight: 500, background: INK, color: LIME, borderColor: INK }
                    : { fontSize: 13, fontWeight: 500, background: 'white', color: INK, borderColor: RULE }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. LUNA PANEL (before the stats — the primary action) ──────────────── */}
      <section style={{ background: 'var(--color-oat)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-12">
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: INK }}>
            <p className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: LIME }}>LUNA · PROMPT PERSONALISER</p>
            <p className="font-display italic mt-2" style={{ fontStyle: 'italic', fontSize: 22, color: '#FFFFFF' }}>
              Create a prompt pack for my situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') buildPrompts(); }}
                placeholder="Tell me your role, subject and what you need..."
                aria-label="Tell Luna your role, subject and what you need"
                className="font-sans flex-1 rounded-xl px-4 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                style={{ fontSize: 14, background: 'var(--color-ground-black)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.18)' }}
              />
              <button
                onClick={buildPrompts}
                className="font-sans flex-shrink-0 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]"
                style={{ fontSize: 14, fontWeight: 500, background: LIME, color: '#1A1A0E' }}
              >
                Build my prompts &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. STAT STRIP ──────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label}>
              <p className="font-display" style={{ fontSize: 32, fontWeight: 700, color: INK }}>{s.value}</p>
              <p className="font-sans mt-0.5" style={{ fontSize: 12, color: FOG }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. SUBJECT FILTER — oat, sticky; no-wrap on desktop, h-scroll on mobile ─ */}
      <div className="sticky top-16 z-20" style={{ background: 'var(--color-oat)', borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide lg:flex-wrap">
          <span className="font-mono flex-shrink-0 mr-1" style={{ fontSize: 10, letterSpacing: '0.1em', color: FOG }}>FILTER BY FOCUS:</span>
          {[{ key: 'All' as const, label: 'All', colour: FOG }, ...SUBJECT_FILTERS.map(s => ({ key: s.key, label: s.label, colour: PILLAR[s.key].colour }))].map(c => {
            const active = subject === c.key;
            // Selected: ink bg, lime text + lime dot. Default: white bg, rule border, ink text + pillar dot.
            return (
              <button
                key={c.key}
                onClick={() => { setSubject(c.key); track({ name: 'tool_filter_used', filterType: 'category', value: c.label, pageType: 'prompts-hub' }); }}
                aria-pressed={active}
                className="font-sans inline-flex items-center gap-2 rounded-full px-3 py-1.5 border transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
                style={active
                  ? { fontSize: 12, fontWeight: 500, background: INK, color: LIME, borderColor: INK }
                  : { fontSize: 12, fontWeight: 500, background: 'white', color: INK, borderColor: '#E8E4DC' }}
              >
                <span className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: active ? LIME : c.colour }} aria-hidden="true" />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5. PACK TILES ──────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <p className="font-sans mb-5" style={{ fontSize: 13, color: '#6b6760' }}>
          Showing <strong style={{ color: INK }}>{filtered.length}</strong> of {PROMPT_PACKS.length} packs
        </p>
        {filtered.length === 0 ? (
          (() => {
            const catLabel = subject === 'All' ? 'these' : (SUBJECT_FILTERS.find(f => f.key === subject)?.label ?? 'these');
            const roleLabel = activeRole ? activeRole.label.toLowerCase() : 'your school';
            return (
              <div className="p-8 sm:p-10" style={{ background: INK, borderRadius: 4 }}>
                <p className="font-display" style={{ fontSize: 22, fontWeight: 400, color: '#FFFFFF' }}>
                  No {catLabel} prompts yet.
                </p>
                <p className="font-display italic mt-2" style={{ fontStyle: 'italic', fontSize: 18, color: FOG }}>
                  Luna can build one for you right now.
                </p>
                <button
                  onClick={() => {
                    openLuna(`Create a prompt pack for ${catLabel} for a ${roleLabel}.`);
                    track({ name: 'agent_opened', section: 'prompts-empty-state' });
                  }}
                  className="font-sans inline-flex items-center mt-5 rounded-full px-6 py-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E]"
                  style={{ fontSize: 14, fontWeight: 500, background: LIME, color: '#1A1A0E' }}
                >
                  Build a prompt &rarr;
                </button>
              </div>
            );
          })()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(pack => <PackTile key={pack.id} pack={pack} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsHub;
