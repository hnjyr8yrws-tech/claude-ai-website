import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import AgentCTACard from '../components/AgentCTACard';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import PackCard from '../components/prompts/PackCard';
import { useCrossSell } from '../hooks/useCrossSell';
import { linkLabel, inferLinkType } from '../utils/linkType';
import {
  TOOLS, CAT_COLOURS, TIER_STYLE,
  PILLARS, derivePillars, promptlyScore, scoreToTier, tierAction,
  deriveBestFor, deriveNotIdealFor, deriveAgeNotes,
} from '../data/tools';
import { TRAINING } from '../data/training';
import { PROMPT_PACKS } from '../data/prompts';
import { track } from '../utils/analytics';
import { PillarCard, ScorePill, pillarScoresFromData } from '../components/trust/PillarCard';

const TEAL = 'var(--color-promptly-lime)';

// Pillar bar colours, in the same order as PILLARS (data/tools.ts):
// [Data Privacy, Age Appropriateness, Transparency, Safeguarding, Accessibility].
// The five reserved §09 pillar colours — the one sanctioned use in a breakdown.
const PILLAR_BAR_COLOURS = [
  'var(--color-pillar-privacy)',
  'var(--color-pillar-age)',
  'var(--color-pillar-transparency)',
  'var(--color-pillar-safeguarding)',
  'var(--color-pillar-accessibility)',
];

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, colour, delay }: { label: string; value: number; colour: string; delay: number }) {
  const pct = (value / 10) * 100;
  // Bar fill = the pillar's reserved §09 colour; the numeral stays neutral ink
  // for legibility (never recoloured by value).
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span style={{ color: '#6b6760' }}>{label}</span>
        <span className="font-bold tabular-nums" style={{ color: '#1c1a15' }}>{value}/10</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: colour }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay }}
        />
      </div>
    </div>
  );
}

// ─── Training mini-card ───────────────────────────────────────────────────────

function TrainingCard({ item }: { item: (typeof TRAINING)[number] }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track({ name: 'tool_detail_training_click', trainingId: item.id })}
      className="block rounded-xl border p-4 hover:shadow-sm transition-shadow"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold leading-snug" style={{ color: 'var(--text)' }}>{item.name}</span>
        <span
          className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={item.type === 'Free' ? { background: 'var(--color-oat)', color: 'var(--color-ink)' } : { background: 'var(--color-oat)', color: 'var(--color-ink)' }}
        >
          {item.cost}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{item.provider} · {item.level}</p>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ToolDetail = () => {
  const { slug = '' } = useParams<{ slug: string }>();

  const tool = useMemo(() => TOOLS.find(t => t.slug === slug) ?? null, [slug]);

  // Related data
  const alternatives = useMemo(() => {
    if (!tool) return [];
    return TOOLS
      .filter(t => t.slug !== tool.slug && t.category === tool.category && t.safety >= tool.safety - 1)
      .sort((a, b) => b.safety - a.safety)
      .slice(0, 3);
  }, [tool]);

  const relatedPacks = useMemo(() => {
    if (!tool) return [];
    return PROMPT_PACKS
      .filter(p =>
        p.roles.some(r => tool.audience.includes(r)) ||
        p.title.toLowerCase().includes(tool.name.toLowerCase().split(' ')[0])
      )
      .slice(0, 3);
  }, [tool]);

  const relatedTraining = useMemo(() => {
    if (!tool) return [];
    return TRAINING
      .filter(t =>
        tool.audience.some(a => t.audience.toLowerCase().includes(a.toLowerCase())) ||
        t.category.toLowerCase().includes(tool.category.toLowerCase())
      )
      .slice(0, 3);
  }, [tool]);

  const pillars = useMemo(() => tool ? derivePillars(tool) : [], [tool]);

  // Cross-sell
  const { inlineItems, popupItems, popupOpen, popupTrigger, closePopup } = useCrossSell(
    tool
      ? { currentSection: 'tools', itemName: tool.name, category: tool.category, roles: tool.audience }
      : { currentSection: 'tools' }
  );

  // ── 404 ──────────────────────────────────────────────────────────────────────
  if (!tool) {
    return (
      <div className="px-5 sm:px-8 py-20 text-center" style={{ background: 'var(--bg)' }}>
        <SEO
          title="Tool not found | GetPromptly"
          description="This tool page doesn't exist. Browse our full AI tools directory."
          keywords="ai tools directory, uk education ai tools"
          path={`/tools/${slug}`}
        />
        <p className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>Tool not found</p>
        <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
          We couldn't find a tool matching "{slug}". It may have been renamed or removed.
        </p>
        <Link
          to="/tools"
          className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: TEAL, color: '#1A1A0E' }}
        >
          Browse all tools
        </Link>
      </div>
    );
  }

  // Derived Promptly Score + tier — single source of truth (never the stored fields).
  const score = promptlyScore(tool);
  const tier = scoreToTier(score);
  const ts = TIER_STYLE[tier];
  const catStyle = CAT_COLOURS[tool.category] ?? { bg: '#f3f4f6', text: '#374151' };
  const ctaLabel = linkLabel(tool.linkType ?? inferLinkType(tool.url));
  const isAffiliate = tool.url.includes('affiliate') || tool.url.includes('ref=');

  return (
    <>
      <SEO
        title={`${tool.name} — AI Tool Review | GetPromptly`}
        description={`${tool.name}: Promptly Score ${tool.reviewNeeded ? 'pending review' : `${score}/10`}, ${tier} tier. ${tool.desc}`}
        keywords={`${tool.name}, ${tool.category}, AI tools for education, UK schools, safety score`}
        path={`/tools/${tool.slug}`}
      />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="px-5 sm:px-8 pt-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <ol className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: '#9ca3af' }}>
            <li><Link to="/tools" className="hover:text-[var(--color-promptly-lime)] transition-colors">Tools</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium truncate max-w-[200px]" style={{ color: 'var(--text)' }}>{tool.name}</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero header ────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pt-6 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          {/* Category + tier badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.text }}>
              {tool.category}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.text }}>
              {tier}
            </span>
            {tool.ukReady === 'Yes' && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-oat)', color: 'var(--color-ink-accent)' }}>
                UK Ready
              </span>
            )}
            {tool.free && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-oat)', color: 'var(--color-ink)' }}>
                Free tier
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-1 order-2 sm:order-1">
              <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-2" style={{ color: 'var(--text)' }}>
                {tool.name}
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#6b6760' }}>{tool.desc}</p>
            </div>
            {/* Pillar Card — the signature artefact (§04/§07). Never a naked score. */}
            <div className="order-1 sm:order-2 mx-auto sm:mx-0 flex-shrink-0">
              {tool.reviewNeeded ? (
                <PillarCard state="provisional" showName={false} showVerdict={false} size={208} />
              ) : (
                <PillarCard
                  score={score}
                  pillars={pillarScoresFromData(pillars)}
                  showName={false}
                  showVerdict={false}
                  showLegend={false}
                  size={208}
                  verifiedDate={tool.lastReviewed ? tool.lastReviewed.toUpperCase() : undefined}
                />
              )}
            </div>
          </div>

          {/* Quick facts row */}
          <div className="mt-5 flex flex-wrap gap-4 text-sm" style={{ color: '#6b6760' }}>
            <span><strong style={{ color: 'var(--text)' }}>Category:</strong> {tool.subcategory}</span>
            <span><strong style={{ color: 'var(--text)' }}>Audience:</strong> {tool.audience.join(', ')}</span>
            <span><strong style={{ color: 'var(--text)' }}>Price:</strong> {tool.free ? 'Free tier available' : 'Paid only'}</span>
            {tool.lastReviewed && (
              <span><strong style={{ color: 'var(--text)' }}>Reviewed:</strong> {tool.lastReviewed}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Safety breakdown ───────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Safety score</SectionLabel>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            {tool.reviewNeeded ? 'Under review' : `Promptly Score breakdown — ${tier}`}
          </h2>

          {tool.reviewNeeded ? (
            <div className="rounded-xl p-4 mb-6" style={{ background: '#f3f4f6' }}>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                This tool is currently under review. Pillar scores will be published once our assessment is complete.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {PILLARS.map((pillar, i) => (
                  <ScoreBar key={pillar} label={pillar} value={pillars[i]} colour={PILLAR_BAR_COLOURS[i]} delay={i * 0.1} />
                ))}
              </div>

              {/* Tier action card */}
              <div className="rounded-xl p-4 mb-0" style={{ background: ts.bg }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: ts.text }}>
                  Recommended action for {tier} tools
                </p>
                <p className="text-sm" style={{ color: ts.text }}>{tierAction(tier)}</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Best for / Not ideal for ───────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Who is this for?</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Is this the right tool for you?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-5" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink)' }}>Best for</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>{deriveBestFor(tool)}</p>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-ink)' }}>Not ideal for</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>{deriveNotIdealFor(tool)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Age & safeguarding notes ───────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Safeguarding & age</SectionLabel>
          <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>
            Safeguarding & age guidance
          </h2>
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: '#e8e6e0', background: 'var(--bg)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{deriveAgeNotes(tool)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-ink-accent)' }} />
              <span style={{ color: '#6b6760' }}>
                UK GDPR relevance: <strong style={{ color: 'var(--text)' }}>{tool.ukReady === 'Yes' ? 'Confirmed' : 'Partial — verify with your DPO'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-ink-accent)' }} />
              <span style={{ color: '#6b6760' }}>
                KCSIE alignment: <strong style={{ color: 'var(--text)' }}>{score >= 9 ? 'Strong' : score >= 7 ? 'Moderate — review policy' : 'Requires policy decision'}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Official CTA ───────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Access this tool</SectionLabel>
          <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text)' }}>
            {ctaLabel} {tool.name}
          </h2>
          <div className="rounded-2xl border p-6" style={{ borderColor: TEAL, background: 'var(--color-oat)' }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#374151' }}>
              {tool.desc}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href={tool.url}
                target="_blank"
                rel={`noopener noreferrer${isAffiliate ? ' sponsored' : ''}`}
                onClick={() => {
                  track({ name: 'tool_detail_cta_click', toolSlug: tool.slug });
                  track({ name: 'outbound_tool_click', toolSlug: tool.slug, toolName: tool.name, category: tool.category, linkType: ctaLabel, source: isAffiliate ? 'affiliate' : 'direct', pageType: 'tool-detail' });
                  if (isAffiliate) {
                    track({ name: 'affiliate_click', itemId: tool.slug, itemName: tool.name, category: tool.category, pageType: 'tool-detail' });
                  } else {
                    track({ name: 'direct_source_click', itemId: tool.slug, itemName: tool.name, category: tool.category, pageType: 'tool-detail' });
                  }
                }}
                className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: TEAL, color: '#1A1A0E' }}
              >
                {ctaLabel} →
              </a>
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                {isAffiliate
                  ? 'This is an affiliate link — GetPromptly may earn a small commission at no cost to you.'
                  : 'Direct link — GetPromptly has no commercial relationship with this tool.'}
                {' '}Always review the tool's own privacy policy before use in school.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ask Luna ────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <AgentCTACard
            section="Luna · Tool Advisor"
            headline={`Ask anything about ${tool.name}`}
            description={`Our AI advisor knows the full safety profile, use cases and school context for ${tool.name}. Ask about alternatives, policy implications, or how to get started.`}
            prompts={[
              `Is ${tool.name} safe for my Year 7 class?`,
              `How does ${tool.name} compare to alternatives?`,
              `What's the KCSIE position on ${tool.name}?`,
              `Help me write a parent letter about using ${tool.name}`,
            ]}
            analyticsSection="tool-detail"
          />
        </div>
      </section>

      {/* ── Related prompt packs ───────────────────────────────────────────── */}
      {relatedPacks.length > 0 && (
        <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
          <div className="max-w-3xl mx-auto">
            <SectionLabel>Prompt packs</SectionLabel>
            <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
              Get more from {tool.name}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
              Ready-made prompts that work with {tool.name} and similar tools.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPacks.map(p => (
                <PackCard key={p.id} pack={p} />
              ))}
            </div>
            <div className="mt-4">
              <Link to="/prompts/library" className="text-sm font-semibold" style={{ color: 'var(--color-ink-accent)' }}>
                Browse all prompt packs →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Related training ───────────────────────────────────────────────── */}
      {relatedTraining.length > 0 && (
        <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
          <div className="max-w-3xl mx-auto">
            <SectionLabel>AI training</SectionLabel>
            <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
              Build your skills
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
              Training resources to help you use {tool.category.toLowerCase()} tools confidently and safely.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedTraining.map(t => (
                <TrainingCard key={t.id} item={t} />
              ))}
            </div>
            <div className="mt-4">
              <Link to="/ai-training" className="text-sm font-semibold" style={{ color: 'var(--color-ink-accent)' }}>
                Browse all training →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Safer alternatives ─────────────────────────────────────────────── */}
      {alternatives.length > 0 && (
        <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
          <div className="max-w-3xl mx-auto">
            <SectionLabel>Alternatives</SectionLabel>
            <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
              Similar tools in {tool.category}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
              Other {tool.category.toLowerCase()} tools you might also consider.
            </p>
            <div className="space-y-3">
              {alternatives.map(alt => {
                const altCatStyle = CAT_COLOURS[alt.category] ?? { bg: '#f3f4f6', text: '#374151' };
                return (
                  <Link
                    key={alt.slug}
                    to={`/tools/${alt.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl border transition-shadow hover:shadow-sm"
                    style={{ borderColor: '#e8e6e0', background: 'white' }}
                  >
                    {/* Dense list → Score Pill; the row links to the tool's Pillar Card. */}
                    <div className="flex-shrink-0">
                      {alt.reviewNeeded ? (
                        <span
                          className="inline-flex items-center justify-center font-sans font-bold rounded-full"
                          style={{ background: 'var(--color-ground-black)', color: 'var(--color-fog)', fontSize: 12.5, padding: '5px 11px' }}
                        >
                          —
                        </span>
                      ) : (
                        <ScorePill score={promptlyScore(alt)} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{alt.name}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#9ca3af' }}>{alt.desc}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      {/* No one-word tier verdict (§14); the Score Pill carries the verdict. */}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: altCatStyle.bg, color: altCatStyle.text }}>{alt.subcategory}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <Link to="/tools" className="text-sm font-semibold" style={{ color: 'var(--color-ink-accent)' }}>
                View all {tool.category} tools →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Cross-sell inline ──────────────────────────────────────────────── */}
      {inlineItems.length > 0 && (
        <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b6760' }}>
              Recommended for you
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inlineItems.slice(0, 2).map(item => (
                <CrossSellCard key={item.id} item={item} sourceSection="tool-detail" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust disclaimer ───────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
              <strong style={{ color: '#1c1a15' }}>About our verdicts:</strong> Every Promptly Score is reviewed against KCSIE 2025 across five pillars — Data Privacy, Safeguarding, Age Suitability, Transparency and Accessibility — per our methodology v2.1, using publicly available information.
              {tool.lastReviewed && ` Last verified ${tool.lastReviewed}.`}
              {' '}We have never changed a score for payment; our methodology and our record of score changes are public. A score is independent guidance, not approval — do your own due diligence and check with your DPO and DSL before using any tool in school.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cross-sell popup ───────────────────────────────────────────────── */}
      {popupOpen && popupItems.length > 0 && (
        <CrossSellPopup
          items={popupItems}
          trigger={popupTrigger}
          sourceSection="tool-detail"
          onClose={closePopup}
        />
      )}
    </>
  );
};

export default ToolDetail;
