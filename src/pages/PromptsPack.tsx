import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import SENBadge from '../components/prompts/SENBadge';
import RoleBadge from '../components/prompts/RoleBadge';
import AgentCTA from '../components/prompts/AgentCTA';
import { PackEmailGate } from '../components/prompts/MonetisationBanner';
import CopyButton from '../components/prompts/CopyButton';
import PackCard from '../components/prompts/PackCard';
import { PROMPT_PACKS, type StructuredPrompt } from '../data/prompts';
import { track } from '../utils/analytics';
import CrossSellCard from '../components/CrossSellCard';
import CrossSellPopup from '../components/CrossSellPopup';
import { useCrossSell } from '../hooks/useCrossSell';
import type { CrossSellContext } from '../utils/crossSell';

const PREVIEW_COUNT = 3;
const WORKS_WITH = ['Claude', 'ChatGPT', 'Gemini', 'Perplexity'];

const HOW_TO_USE = [
  { n: '01', title: 'Copy the prompt', desc: 'Hit the copy button next to any prompt to copy it to your clipboard.' },
  { n: '02', title: 'Open your AI tool', desc: 'Paste into Claude, ChatGPT, Gemini or Perplexity \u2014 they all work.' },
  { n: '03', title: 'Fill in the brackets', desc: 'Replace [topic], [year group], [student name] etc. with your own details.' },
  { n: '04', title: 'Adapt as needed', desc: 'Add extra context about the child, class or situation for better results.' },
  { n: '05', title: 'Use the agent', desc: 'Use the Promptly AI agent for a fully personalised version of any prompt.' },
];

function isPackUnlocked(slug: string): boolean {
  try {
    const unlocked = JSON.parse(localStorage.getItem('promptly_unlocked_packs') || '[]');
    return unlocked.includes(slug);
  } catch {
    return false;
  }
}

const PromptsPack = () => {
  const { packSlug = '' } = useParams<{ packSlug: string }>();

  const pack = useMemo(
    () => PROMPT_PACKS.find((p) => p.slug === packSlug) ?? null,
    [packSlug]
  );

  const relatedPacks = useMemo(() => {
    if (!pack) return [];
    return PROMPT_PACKS.filter(
      (p) => p.categorySlug === pack.categorySlug && p.id !== pack.id
    ).slice(0, 3);
  }, [pack]);

  const [unlocked, setUnlocked] = useState(() => pack ? isPackUnlocked(pack.slug) : false);

  // Track pack view
  useEffect(() => {
    if (pack) {
      track({ name: 'prompt_pack_view', packSlug: pack.slug });
    }
  }, [pack]);

  // Cross-sell
  const xsCtx = useMemo<CrossSellContext>(() => ({
    currentSection: 'prompts',
    itemName: pack?.title,
    category: pack?.category,
    roles: pack?.roles,
    senFocus: pack?.senFocus,
    tools: pack?.prompts?.[0]?.tools,
  }), [pack]);
  const { inlineItems, popupItems, popupOpen, popupTrigger, triggerPopup, closePopup } = useCrossSell(xsCtx);

  const handlePromptCopy = (index: number) => {
    if (pack) {
      track({ name: 'prompt_pack_preview_copy', packSlug: pack.slug, promptIndex: index });
      track({ name: 'prompt_preview_copied', packSlug: pack.slug, promptIndex: index });
      triggerPopup('prompt_copied');
    }
  };

  if (!pack) {
    return (
      <div className="px-5 sm:px-8 py-16 text-center" style={{ background: 'var(--bg)' }}>
        <p className="font-display text-xl mb-4" style={{ color: 'var(--text)' }}>Pack not found.</p>
        <Link to="/prompts/library" style={{ color: '#BEFF00' }}>{'\u2190'} Browse all packs</Link>
      </div>
    );
  }

  const previewPrompts = pack.prompts.slice(0, PREVIEW_COUNT);
  const remainingPrompts = pack.prompts.slice(PREVIEW_COUNT);
  const hiddenCount = remainingPrompts.length;
  const showAll = unlocked || hiddenCount === 0;

  const allVisiblePrompts = showAll ? pack.prompts : previewPrompts;
  const promptText = (p: StructuredPrompt) =>
    `${p.title} [${p.level}]\n${p.prompt}`;
  const allVisibleText = allVisiblePrompts.map((p, i) => `${i + 1}. ${promptText(p)}`).join('\n\n');

  return (
    <>
      <SEO
        title={`${pack.title} \u2014 AI Prompt Pack | GetPromptly`}
        description={pack.description}
        keywords={`${pack.title}, AI prompts, ${pack.senFocus.join(', ')}, UK education prompts`}
        path={`/prompts/pack/${pack.slug}`}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-5 sm:px-8 pt-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <ol className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: '#9ca3af' }}>
            <li>
              <Link to="/prompts" className="hover:text-[#BEFF00] transition-colors">Prompts</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to={`/prompts/category/${pack.categorySlug}`}
                className="hover:text-[#BEFF00] transition-colors"
              >
                {pack.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium truncate max-w-[160px]" style={{ color: 'var(--text)' }}>{pack.title}</li>
          </ol>
        </div>
      </nav>

      {/* Pack header */}
      <section className="px-5 sm:px-8 pt-6 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span
              className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
              style={{ background: '#e0f5f6', color: '#BEFF00' }}
            >
              Pack {String(pack.id).padStart(2, '0')}
            </span>
            <SectionLabel className="mb-0">{pack.category}</SectionLabel>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl mb-3 leading-tight" style={{ color: 'var(--text)' }}>
            {pack.title}
          </h1>
          <p className="text-base leading-relaxed mb-5 max-w-2xl" style={{ color: '#4A4A4A' }}>
            {pack.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pack.senFocus.map((tag) => <SENBadge key={tag} tag={tag} />)}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {pack.roles.map((role) => <RoleBadge key={role} role={role} />)}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {pack.stages.map((stage) => (
              <span
                key={stage}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium border"
                style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
              >
                {stage}
              </span>
            ))}
          </div>

          {/* Works with + prompt count */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Works with:</span>
            {WORKS_WITH.map((ai) => (
              <span
                key={ai}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
              >
                {ai}
              </span>
            ))}
            <span
              className="ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background: '#f0fdf4', color: '#15803d' }}
            >
              {pack.promptCount} prompts
            </span>
          </div>
        </div>
      </section>

      {/* Preview prompts */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#ECE7DD' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Preview</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            {showAll ? `All ${pack.promptCount} prompts` : `Preview \u2014 ${PREVIEW_COUNT} of ${pack.promptCount} prompts`}
          </h2>

          <div className="space-y-3 mb-6">
            {previewPrompts.map((prompt, i) => (
              <PromptCard
                key={i}
                prompt={prompt}
                packTitle={pack.title}
                index={i}
                onCopy={() => handlePromptCopy(i)}
              />
            ))}
          </div>

          {/* Agent CTA */}
          <div className="mb-6">
            <AgentCTA context="Paste any prompt into the chat and ask the Promptly AI to adapt it for your specific student or class." />
          </div>

          {/* Email gate or unlocked remaining prompts */}
          {hiddenCount > 0 && !showAll && (
            <PackEmailGate
              packSlug={pack.slug}
              packTitle={pack.title}
              hiddenCount={hiddenCount}
              totalCount={pack.promptCount}
              onUnlock={() => setUnlocked(true)}
            />
          )}

          {/* Show remaining prompts when unlocked */}
          {showAll && remainingPrompts.length > 0 && (
            <div className="space-y-3 mt-8 pt-8 border-t" style={{ borderColor: '#ECE7DD' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#BEFF00' }}>
                Full pack
              </p>
              {remainingPrompts.map((prompt, i) => (
                <PromptCard
                  key={PREVIEW_COUNT + i}
                  prompt={prompt}
                  packTitle={pack.title}
                  index={PREVIEW_COUNT + i}
                />
              ))}
            </div>
          )}

          {/* Copy all visible */}
          {showAll && (
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm" style={{ color: '#4A4A4A' }}>Copy all {allVisiblePrompts.length} prompts:</span>
              <CopyButton text={allVisibleText} size="md" />
            </div>
          )}
        </div>
      </section>

      {/* How to use */}
      <section className="px-5 sm:px-8 py-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>How to use</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Getting the best results
          </h2>
          <ol className="space-y-3" role="list">
            {HOW_TO_USE.map((step) => (
              <li key={step.n} className="flex gap-4 p-4 rounded-xl bg-white border" style={{ borderColor: '#ECE7DD' }}>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: '#e0f5f6', color: '#BEFF00' }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: '#4A4A4A' }}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cross-sell recommendations */}
      {inlineItems.length > 0 && (
        <section className="px-5 sm:px-8 py-10" style={{ background: 'var(--bg)' }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#9C9690' }}>
              Recommended for you
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inlineItems.slice(0, 2).map(item => (
                <CrossSellCard key={item.id} item={item} sourceSection="prompts-pack" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related packs */}
      {relatedPacks.length > 0 && (
        <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'white', borderColor: '#ECE7DD' }}>
          <div className="max-w-3xl mx-auto">
            <SectionLabel>Related packs</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              More from {pack.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPacks.map((p) => (
                <PackCard key={p.id} pack={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust disclaimer */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'var(--bg)', borderColor: '#ECE7DD' }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: '#ECE7DD', background: 'white' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
              <strong style={{ color: '#1A1A1A' }}>Important:</strong> These prompts support educators, families and learners. They do not replace professional teacher judgment, SEN support plans, EHCPs or clinical advice. Always adapt for the individual child&rsquo;s needs and school context.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom agent CTA */}
      <section className="px-5 sm:px-8 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <AgentCTA context="Tell the Promptly AI about your student, subject and situation for a personalised prompt." />
        </div>
      </section>

      {/* Cross-sell popup */}
      {popupOpen && popupItems.length > 0 && (
        <CrossSellPopup
          items={popupItems}
          trigger={popupTrigger}
          sourceSection="prompts-pack"
          onClose={closePopup}
        />
      )}
    </>
  );
};

export default PromptsPack;
