import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import AgentCTACard from '../components/AgentCTACard';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import PackCard from '../components/prompts/PackCard';
import { useCrossSell } from '../hooks/useCrossSell';
import { linkLabel, inferLinkType } from '../utils/linkType';
import {
  TOOLS, CAT_COLOURS,
  deriveBestFor, deriveNotIdealFor, deriveAgeNotes,
} from '../data/tools';
import { getPublicScore, isAwaitingReReview, PUBLIC_PILLARS, pillarBand, PILLAR_BAND_LABEL } from '../data/publicPillars';
import { TRAINING } from '../data/training';
import { PROMPT_PACKS } from '../data/prompts';
import { track } from '../utils/analytics';
import { PillarCard, ScorePill } from '../components/trust/PillarCard';
import { SAMPLE_TOOL_EVIDENCE } from '../data/sampleEvidence';
import { Rule4bGuard, type DisplayState, type Integrity } from '@/components/trust';

const TEAL = 'var(--color-promptly-lime)';

// Pillar bar colours, in PUBLIC_PILLARS order
// [Data Privacy, Safeguarding, Age Suitability, Transparency, Accessibility].
// These bars sit on a WHITE surface, so they use the true §09 print hexes — and
// lime is NOT used on white. Safeguarding's §09 colour is lime, which may sit only
// on dark/oat; on a light surface its sanctioned substitute is ground-black ink.
const PILLAR_BAR_COLOURS = [
  '#6A8CAF', // Data Privacy — Sky §09
  '#1E1E1E', // Safeguarding — lime can't sit on white; ground-black is the §09 light-surface substitute
  '#8C7A52', // Age Suitability — Oat Deep §09
  '#4A4F5C', // Transparency — Slate §09
  '#D97757', // Accessibility — Clay §09
];

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, colour, delay }: { label: string; value: number; colour: string; delay: number }) {
  const pct = (value / 10) * 100;
  const band = pillarBand(value);
  // Bar fill = the pillar's reserved §09 colour; the numeral stays neutral ink
  // for legibility (never recoloured by value). The band is a neutral mono word
  // (per-pillar axis), never a traffic-light colour.
  return (
    <div>
      <div className="flex justify-between items-baseline text-sm mb-1.5">
        <span style={{ color: '#6b6760' }}>{label}</span>
        <span className="flex items-baseline gap-2">
          {band && band !== 'exemplary' && (
            <span className="font-sans uppercase" style={{ fontSize: 10, letterSpacing: '0.06em', color: '#6b6760' }}>
              {PILLAR_BAND_LABEL[band]}
            </span>
          )}
          <span className="font-bold tabular-nums" style={{ color: '#1c1a15' }}>{value}/10</span>
        </span>
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
      .filter(t => t.slug !== tool.slug && t.primaryCategory === tool.primaryCategory)
      .sort((a, b) => a.name.localeCompare(b.name))
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
        t.category.toLowerCase().includes(tool.primaryCategory.toLowerCase())
      )
      .slice(0, 3);
  }, [tool]);

  // Cross-sell
  const { inlineItems, popupItems, popupOpen, popupTrigger, closePopup } = useCrossSell(
    tool
      ? { currentSection: 'tools', itemName: tool.name, category: tool.primaryCategory, roles: tool.audience }
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

  // PUBLIC trust model only — null = pending review (no number shown). No legacy/synthetic score.
  const pub = getPublicScore(tool.slug);
  const awaiting = isAwaitingReReview(tool.slug); // child-safety withdrawal → Awaiting Re-review card
  // Drive the shared fail-closed Rule4bGuard from the existing public-trust model.
  const trustDisplayState: DisplayState = awaiting ? 'AwaitingReReview' : pub ? 'Active' : 'Provisional';
  const trustIntegrity: Integrity = pub
    ? { state: 'verified', checkedAt: pub.verifiedDate }
    : { state: 'unavailable' };
  const catStyle = CAT_COLOURS[tool.primaryCategory] ?? { bg: '#f3f4f6', text: '#374151' };
  const ctaLabel = linkLabel(tool.linkType ?? inferLinkType(tool.url));
  const isAffiliate = tool.url.includes('affiliate') || tool.url.includes('ref=');

  return (
    <>
      <SEO
        title={`${tool.name} — AI Tool Review | GetPromptly`}
        description={`${tool.name}: Promptly Score ${awaiting ? 'awaiting re-review' : pub ? `${pub.composite}/10` : 'pending review'}. ${tool.desc}`}
        keywords={`${tool.name}, ${tool.primaryCategory}, AI tools for education, UK schools, safety score`}
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
              {tool.primaryCategory}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--color-oat)', color: '#6b6760' }}>
              {awaiting ? 'Awaiting re-review' : pub ? 'Reviewed' : 'Pending review'}
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

              {/* Direct link — visible to everyone, no tier gating. */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ name: 'cta_clicked', section: 'tool-hero', label: `Visit tool: ${tool.name}` })}
                className="inline-flex items-center gap-2 mt-4 rounded-full px-5 py-2.5 font-sans transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)] focus-visible:ring-offset-2"
                style={{ fontSize: 14, fontWeight: 600, background: 'var(--color-promptly-lime)', color: 'var(--color-ink)' }}
              >
                Visit {tool.name} →
              </a>
            </div>
            {/* Pillar Card — the signature artefact (§04/§07). Never a naked score. */}
            <div className="order-1 sm:order-2 mx-auto sm:mx-0 flex-shrink-0">
              {/* Fail-closed via the shared Rule4bGuard: the scored (interactive)
                  Pillar Card only renders when the public trust model is verified.
                  Withdrawn/awaiting and pending tools fall through to renderUnavailable. */}
              <Rule4bGuard
                integrity={trustIntegrity}
                displayState={trustDisplayState}
                renderUnavailable={() =>
                  awaiting ? (
                    <div className="flex flex-col items-center gap-3">
                      {/* Child-safety withdrawal → Awaiting Re-review card: no number, no tier */}
                      <PillarCard state="withdrawn" methodologyVersion="2.2" showName={false} showVerdict={false} showLegend={false} size={208} />
                      <p role="status" className="max-w-[208px] text-center text-xs" style={{ color: '#6b6760' }}>
                        Score withheld while this tool is re-reviewed. See the{' '}
                        <Link to="/methodology" className="font-semibold underline underline-offset-2" style={{ color: 'var(--color-ink-accent)' }}>
                          methodology &amp; integrity record
                        </Link>.
                      </p>
                    </div>
                  ) : (
                    /* Pending: no verified public pillar data → provisional card, no number */
                    <PillarCard state="provisional" showName={false} showVerdict={false} size={208} />
                  )
                }
              >
                {pub ? (
                  <PillarCard
                    score={pub.composite}
                    pillars={pub.pillars}
                    showName={false}
                    showVerdict={false}
                    showLegend
                    interactive
                    evidence={SAMPLE_TOOL_EVIDENCE[tool.slug]}
                    size={208}
                    methodologyVersion={pub.methodologyVersion}
                    verifiedDate={pub.verifiedDate}
                    reviewer={pub.reviewer}
                  />
                ) : null}
              </Rule4bGuard>
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

      {/* ── Promptly Score breakdown (public pillars only) ───────────────────── */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Promptly Score</SectionLabel>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            {awaiting ? 'Awaiting re-review' : pub ? 'Promptly Score breakdown' : 'Pending review'}
          </h2>

          {!pub ? (
            <div className="rounded-xl p-4 mb-6" style={{ background: '#f3f4f6' }}>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                {awaiting
                  ? "This tool has been withdrawn from public scoring pending re-review under the current methodology. Its previous Promptly Score and pillar breakdown have been removed while it is re-assessed."
                  : "This tool's Promptly Score is pending review under the current methodology. The five published pillar scores will appear here once a verified review is published."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {PUBLIC_PILLARS.map((pillar, i) => (
                <ScoreBar
                  key={pillar}
                  label={pillar}
                  value={[pub.pillars.dataPrivacy, pub.pillars.safeguarding, pub.pillars.ageSuitability, pub.pillars.transparency, pub.pillars.accessibility][i]}
                  colour={PILLAR_BAR_COLOURS[i]}
                  delay={i * 0.1}
                />
              ))}
            </div>
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
          {(tool.pros?.length || tool.cons?.length) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PROS */}
              <div className="rounded-2xl p-5 border" style={{ background: '#F0F7E6', borderColor: 'rgba(200,228,74,0.3)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#C8E44A' }}>
                    <Check className="w-3 h-3" style={{ color: 'var(--color-ink)' }} />
                  </span>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#6b6760' }}>Works well for</span>
                </div>
                <ul className="space-y-2">
                  {(tool.pros ?? []).map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-sm" style={{ color: 'var(--color-ink)' }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-ink-accent)' }}>✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              {/* CONS */}
              <div className="rounded-2xl p-5 border" style={{ background: '#FDF3EE', borderColor: 'rgba(217,119,87,0.3)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#D97757' }}>
                    <X className="w-3 h-3" style={{ color: '#FFFFFF' }} />
                  </span>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#6b6760' }}>Worth knowing</span>
                </div>
                <ul className="space-y-2">
                  {(tool.cons ?? []).map((con, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-sm" style={{ color: 'var(--color-ink)' }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: '#D97757' }}>→</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
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
          )}
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
                KCSIE alignment: <strong style={{ color: 'var(--text)' }}>{pub ? (pub.composite >= 9 ? 'Strong' : pub.composite >= 7 ? 'Moderate — review policy' : 'Requires policy decision') : 'Pending review'}</strong>
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
                  track({ name: 'outbound_tool_click', toolSlug: tool.slug, toolName: tool.name, category: tool.primaryCategory, linkType: ctaLabel, source: isAffiliate ? 'affiliate' : 'direct', pageType: 'tool-detail' });
                  if (isAffiliate) {
                    track({ name: 'affiliate_click', itemId: tool.slug, itemName: tool.name, category: tool.primaryCategory, pageType: 'tool-detail' });
                  } else {
                    track({ name: 'direct_source_click', itemId: tool.slug, itemName: tool.name, category: tool.primaryCategory, pageType: 'tool-detail' });
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
              Training resources to help you use {tool.primaryCategory.toLowerCase()} tools confidently and safely.
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
              Similar tools in {tool.primaryCategory}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
              Other {tool.primaryCategory.toLowerCase()} tools you might also consider.
            </p>
            <div className="space-y-3">
              {alternatives.map(alt => {
                const altCatStyle = CAT_COLOURS[alt.primaryCategory] ?? { bg: '#f3f4f6', text: '#374151' };
                return (
                  <Link
                    key={alt.slug}
                    to={`/tools/${alt.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl border transition-shadow hover:shadow-sm"
                    style={{ borderColor: '#e8e6e0', background: 'white' }}
                  >
                    {/* Dense list → Score Pill; the row links to the tool's Pillar Card. */}
                    <div className="flex-shrink-0">
                      {getPublicScore(alt.slug) ? (
                        <ScorePill score={getPublicScore(alt.slug)!.composite} />
                      ) : (
                        <span
                          className="inline-flex items-center justify-center font-sans font-bold rounded-full"
                          style={{ background: 'var(--color-ground-black)', color: 'var(--color-fog)', fontSize: 12.5, padding: '5px 11px' }}
                          title="Pending review"
                        >
                          —
                        </span>
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
                View all {tool.primaryCategory} tools →
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
              <strong style={{ color: '#1c1a15' }}>About our verdicts:</strong> Every Promptly Score is reviewed against KCSIE 2025 across five pillars — Data Privacy, Safeguarding, Age Suitability, Transparency and Accessibility — per our methodology v2.2, using publicly available information.
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
