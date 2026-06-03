/**
 * PromptLibrary.tsx — /prompts (the canonical Prompt Library)
 *
 * The 600-prompt library, ported from the standalone Next.js app into the main
 * site so it lives inside the shared nav + footer layout. Dark hero ("We did the
 * prompting."), sticky light filter bar, paginated card grid, and an email-gate:
 * a captured email (lead) unlocks all FREE prompts; Premium stays paid.
 *
 * Tier is fixed at 0 (anonymous) — there is no auth yet, so the production model
 * is: email unlocks Free, Premium awaits checkout (PREMIUM_CHECKOUT_URL).
 */

import { useMemo, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { Lock } from 'lucide-react';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import { getAllPrompts, expandKeyStage, KEY_STAGE_OPTIONS, type PromptEntry } from '../data/promptsLibrary';
import { audienceColor } from '../lib/audienceColors';
import { useLead } from '../hooks/useLead';
import PromptModal from '../components/prompts/PromptModal';

const LIME = 'var(--color-promptly-lime)';
const OAT = 'var(--color-oat)';
const INK = 'var(--color-ink)';
const FOG = 'var(--color-fog)';
const GROUND = 'var(--color-ground-black)';
const WHITE = '#FFFFFF';
const RULE = 'var(--color-rule)';
const INK_ACCENT = 'var(--color-ink-accent)';

const AUDIENCES = ['All', 'Teacher', 'Leader', 'SENCO', 'Parent', 'Student', 'Admin'];
const PER_PAGE = 24;

function openLuna() {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  track({ name: 'agent_opened', section: 'prompt-library-hero' });
}

export default function PromptLibrary() {
  const prompts = useMemo(() => getAllPrompts(), []);
  const tier = 0; // anonymous — no auth yet
  const { hasLead } = useLead();

  const initial = useMemo(() => new URLSearchParams(window.location.search), []);

  // Filter state is local React state (the source of truth), seeded once from the
  // URL and mirrored back via history.replaceState so filtering is instant.
  const [audience, setAudience] = useState(() => initial.get('audience') ?? 'All');
  const [category, setCategory] = useState(() => initial.get('category') ?? 'All');
  const [keyStage, setKeyStage] = useState(() => initial.get('ks') ?? 'All');
  const [sendTag, setSendTag] = useState(() => initial.get('send') ?? 'All');
  const [page, setPage] = useState(() => Math.max(1, Number(initial.get('page') ?? 1) || 1));
  const [searchInput, setSearchInput] = useState(() => initial.get('q') ?? '');

  // Debounced search term (300ms).
  const [search, setSearch] = useState(searchInput);
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => { if (debRef.current) clearTimeout(debRef.current); };
  }, [searchInput]);

  const [selected, setSelected] = useState<PromptEntry | null>(null);

  // Mirror filter state to the URL (shareable links + back button).
  useEffect(() => {
    const next = new URLSearchParams();
    if (audience !== 'All') next.set('audience', audience);
    if (category !== 'All') next.set('category', category);
    if (keyStage !== 'All') next.set('ks', keyStage);
    if (sendTag !== 'All') next.set('send', sendTag);
    if (search.trim()) next.set('q', search.trim());
    if (page > 1) next.set('page', String(page));
    const qs = next.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [audience, category, keyStage, sendTag, search, page]);

  // Restore state on back/forward.
  useEffect(() => {
    const onPop = () => {
      const p = new URLSearchParams(window.location.search);
      setAudience(p.get('audience') ?? 'All');
      setCategory(p.get('category') ?? 'All');
      setKeyStage(p.get('ks') ?? 'All');
      setSendTag(p.get('send') ?? 'All');
      setSearchInput(p.get('q') ?? '');
      setSearch(p.get('q') ?? '');
      setPage(Math.max(1, Number(p.get('page') ?? 1) || 1));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const resetPage = useCallback(() => setPage(1), []);

  const keyStages = useMemo(() => {
    const present = new Set(prompts.flatMap((p) => expandKeyStage(p.keyStage)));
    return ['All', ...KEY_STAGE_OPTIONS.filter((s) => present.has(s))];
  }, [prompts]);

  const categories = useMemo(() => {
    const pool = audience === 'All' ? prompts : prompts.filter((p) => p.audience === audience);
    return ['All', ...[...new Set(pool.map((p) => p.category).filter(Boolean))].sort()];
  }, [prompts, audience]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prompts.filter((p) => {
      if (audience !== 'All' && p.audience !== audience) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (keyStage !== 'All' && !expandKeyStage(p.keyStage).includes(keyStage)) return false;
      if (sendTag !== 'All' && p.sendTag !== sendTag) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.prompt.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prompts, audience, category, keyStage, sendTag, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const activeCount =
    (audience !== 'All' ? 1 : 0) +
    (category !== 'All' ? 1 : 0) +
    (keyStage !== 'All' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const clearAll = () => {
    setAudience('All'); setCategory('All'); setKeyStage('All');
    setSendTag('All'); setSearchInput(''); setSearch(''); setPage(1);
  };

  // A captured email (lead) unlocks all FREE prompts; Premium stays paid (Tier 2+).
  const cardLock = (p: PromptEntry): { locked: boolean; cta: string } => {
    if (p.access === 'Premium' && tier < 2) return { locked: true, cta: 'Premium — £5.99/mo' };
    if (p.access !== 'Premium' && tier < 1 && !hasLead) return { locked: true, cta: 'Enter email to unlock' };
    return { locked: false, cta: '' };
  };

  return (
    <div style={{ backgroundColor: OAT, minHeight: '100vh' }}>
      <SEO
        title="Prompt Library — 600 reviewed AI prompts for UK education | GetPromptly"
        description="600 ready-to-use AI prompts for teachers, leaders, SENCOs, parents, students and school staff — reviewed through a UK education lens. Copy, adapt, use instantly."
        keywords="AI prompts for teachers, school AI prompts, ChatGPT prompts education, KCSIE, SEND prompts, lesson planning prompts"
        path="/prompts"
      />

      {/* ── Hero — full-width dark band ── */}
      <div style={{ background: GROUND }}>
        <section className="max-w-6xl mx-auto px-5 sm:px-8" style={{ paddingTop: 80, paddingBottom: 88 }}>
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.25em', color: FOG }}>
            UK Education <span style={{ color: LIME }}>•</span> KCSIE 2025 <span style={{ color: LIME }}>•</span> Independent
          </p>

          <div className="mt-16 md:mt-24">
            <p className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.2em', color: FOG }}>
              The GetPromptly Prompt Library
            </p>
            <h1
              className="font-serif mt-5"
              style={{ fontSize: 'clamp(3.25rem, 8vw, 6.5rem)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em', color: OAT }}
            >
              We did the prompting.
            </h1>
          </div>

          <p className="font-sans mt-7 max-w-2xl" style={{ fontSize: 19, lineHeight: 1.55, color: FOG }}>
            Prompts for teachers, leaders, SENCOs, parents, students and school staff — reviewed through a UK education lens.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-8 font-sans" style={{ fontSize: 14, color: FOG }}>
            {['Teacher', 'Leader', 'SENCO', 'Parent', 'Student', 'Admin'].map((r, i) => (
              <span key={r} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden style={{ color: LIME }}>•</span>}
                {r}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-10">
            <a
              href="#prompt-grid"
              className="font-sans inline-flex items-center rounded-full px-6 py-3"
              style={{ fontSize: 15, fontWeight: 600, background: LIME, color: INK }}
            >
              Browse the Library →
            </a>
            <button
              onClick={openLuna}
              className="font-sans inline-flex items-center rounded-full px-6 py-3"
              style={{ fontSize: 15, background: 'transparent', color: LIME, border: `1.5px solid ${LIME}` }}
            >
              Ask Luna →
            </button>
          </div>
        </section>
      </div>

      {/* ── Filter bar (sticky, light) — top-16 clears the 64px navbar ── */}
      <div className="sticky top-16 z-20" style={{ background: OAT, borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {AUDIENCES.map((a) => {
              const on = audience === a;
              return (
                <button
                  key={a}
                  onClick={() => { setAudience(a); setCategory('All'); resetPage(); }}
                  className="font-sans flex-shrink-0 rounded-full px-4 py-2 transition-colors"
                  style={on
                    ? { fontSize: 14, fontWeight: 600, background: INK, color: LIME, border: '1px solid transparent' }
                    : { fontSize: 14, background: 'transparent', color: INK, border: `1px solid ${RULE}` }}
                >
                  {a}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
            <Select label="Category" value={category} options={categories} onChange={(v) => { setCategory(v); resetPage(); }} />
            <Select label="Key Stage" value={keyStage} options={keyStages} onChange={(v) => { setKeyStage(v); resetPage(); }} />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search prompts…"
              aria-label="Search prompts"
              className="font-sans flex-1 rounded-lg px-3 py-2 outline-none focus-visible:ring-1"
              style={{ fontSize: 14, background: WHITE, color: INK, border: `1px solid ${RULE}` }}
            />
          </div>

          <div className="flex items-center gap-4 mt-2">
            <p className="font-mono" style={{ fontSize: 12, color: FOG }}>
              Showing {filtered.length} prompt{filtered.length === 1 ? '' : 's'}
            </p>
            {activeCount > 0 && (
              <button onClick={clearAll} className="font-sans" style={{ fontSize: 12, fontWeight: 600, color: INK_ACCENT }}>
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div id="prompt-grid" className="max-w-6xl mx-auto px-5 sm:px-8" style={{ paddingTop: 40, paddingBottom: 40 }}>
        {pageItems.length === 0 ? (
          <div className="p-10 text-center" style={{ background: WHITE, border: `1px solid ${RULE}`, borderRadius: 16 }}>
            <p className="font-serif" style={{ fontSize: 20, color: INK }}>No prompts match those filters.</p>
            <p className="font-sans mt-2" style={{ fontSize: 14, color: FOG }}>Try clearing a filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((p) => {
              const { locked, cta } = cardLock(p);
              return (
                <div key={p.id} className="relative rounded-2xl p-5 flex flex-col gap-3" style={{ background: WHITE, border: `1px solid ${RULE}` }}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono" style={{ fontSize: 12, color: FOG }}>{p.id}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="rounded-full" style={{ width: 6, height: 6, background: audienceColor(p.audience) }} />
                      <span className="font-mono" style={{ fontSize: 12, color: FOG }}>{p.audience}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif" style={{ fontSize: 18, lineHeight: 1.2, color: INK }}>{p.title}</h3>
                    <p className="font-mono mt-1" style={{ fontSize: 12, color: FOG }}>
                      {p.category}{p.subcategory ? ` · ${p.subcategory}` : ''}
                    </p>
                  </div>

                  {(p.keyStage || p.subject) && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.keyStage && <Pill>{p.keyStage}</Pill>}
                      {p.subject && <Pill>{p.subject}</Pill>}
                    </div>
                  )}

                  {p.sendTag && p.sendTag !== 'None' && (
                    <span className="font-mono rounded-full px-2 py-0.5 self-start" style={{ fontSize: 12, background: 'rgba(245,158,11,0.15)', color: 'rgb(251,191,36)' }}>
                      {p.sendTag}
                    </span>
                  )}

                  {p.complianceTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.complianceTags.map((t) => (
                        <span key={t} className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: 10, border: `1px solid ${RULE}`, color: FOG }}>{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2">
                    {p.access === 'Premium' ? (
                      <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: 12, background: INK, color: LIME }}>Premium</span>
                    ) : (
                      <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: 12, border: `1px solid ${RULE}`, color: FOG }}>Free</span>
                    )}
                    <button
                      onClick={() => setSelected(p)}
                      className="font-sans rounded-full px-4 py-2 ml-auto"
                      style={{ fontSize: 14, fontWeight: 600, background: LIME, color: INK }}
                    >
                      View Prompt
                    </button>
                  </div>

                  {locked && (
                    <button
                      onClick={() => setSelected(p)}
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 group"
                      style={{ background: 'rgba(30,30,30,0.82)' }}
                      aria-label={cta}
                    >
                      <Lock size={22} style={{ color: LIME }} />
                      <span
                        className="font-sans opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-4 py-1.5"
                        style={{ fontSize: 13, fontWeight: 600, background: LIME, color: INK }}
                      >
                        {cta}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              disabled={safePage <= 1}
              onClick={() => { setPage(safePage - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="font-sans rounded-full px-4 py-2 disabled:opacity-40"
              style={{ fontSize: 13, color: INK, border: `1px solid ${RULE}` }}
            >
              ← Prev
            </button>
            <span className="font-mono" style={{ fontSize: 12, color: FOG }}>Page {safePage} of {totalPages}</span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => { setPage(safePage + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="font-sans rounded-full px-4 py-2 disabled:opacity-40"
              style={{ fontSize: 13, color: INK, border: `1px solid ${RULE}` }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <PromptModal prompt={selected} tier={tier} onClose={() => setSelected(null)} />
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono rounded-full px-2 py-0.5" style={{ fontSize: 12, color: FOG, border: `1px solid ${RULE}` }}>
      {children}
    </span>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-sans rounded-lg px-3 py-2 outline-none flex-shrink-0"
      style={{ fontSize: 14, background: WHITE, color: INK, border: `1px solid ${RULE}` }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o === 'All' ? `${label}: All` : o}</option>
      ))}
    </select>
  );
}
