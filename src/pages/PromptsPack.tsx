import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import SENBadge from '../components/prompts/SENBadge';
import RoleBadge from '../components/prompts/RoleBadge';
import AgentCTA from '../components/prompts/AgentCTA';
import MonetisationBanner from '../components/prompts/MonetisationBanner';
import CopyButton from '../components/prompts/CopyButton';
import PackCard from '../components/prompts/PackCard';
import { PROMPT_PACKS } from '../data/prompts';

const WORKS_WITH = ['Claude', 'ChatGPT', 'Gemini', 'Perplexity'];

const HOW_TO_USE = [
  { n: '01', title: 'Copy the prompt', desc: 'Hit the copy button next to any prompt to copy it to your clipboard.' },
  { n: '02', title: 'Open your AI tool', desc: 'Paste into Claude, ChatGPT, Gemini or Perplexity — they all work.' },
  { n: '03', title: 'Fill in the brackets', desc: 'Replace [topic], [year group], [student name] etc. with your own details.' },
  { n: '04', title: 'Adapt as needed', desc: 'Add extra context about the child, class or situation for better results.' },
  { n: '05', title: 'Use the agent', desc: 'Use the Promptly AI agent for a fully personalised version of any prompt.' },
];

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

  if (!pack) {
    return (
      <div className="px-5 sm:px-8 py-16 text-center" style={{ background: 'var(--bg)' }}>
        <p className="font-display text-xl mb-4" style={{ color: 'var(--text)' }}>Pack not found.</p>
        <Link to="/prompts/library" style={{ color: '#00808a' }}>← Browse all packs</Link>
      </div>
    );
  }

  const samplePrompts = pack.prompts.slice(0, 5);
  const hiddenCount = pack.prompts.length > 5 ? pack.prompts.length - 5 : 0;
  const allVisibleText = samplePrompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n');

  return (
    <>
      <SEO
        title={`${pack.title} — AI Prompt Pack | GetPromptly`}
        description={pack.description}
        keywords={`${pack.title}, AI prompts, ${pack.senFocus.join(', ')}, UK education prompts`}
        path={`/prompts/pack/${pack.slug}`}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-5 sm:px-8 pt-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <ol className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: '#9ca3af' }}>
            <li>
              <Link to="/prompts" className="hover:text-[#00808a] transition-colors">Prompts</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to={`/prompts/category/${pack.categorySlug}`}
                className="hover:text-[#00808a] transition-colors"
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
          {/* Pack number + category */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span
              className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
              style={{ background: '#e0f5f6', color: '#00808a' }}
            >
              Pack {String(pack.id).padStart(2, '0')}
            </span>
            <SectionLabel className="mb-0">{pack.category}</SectionLabel>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl mb-3 leading-tight" style={{ color: 'var(--text)' }}>
            {pack.title}
          </h1>
          <p className="text-base leading-relaxed mb-5 max-w-2xl" style={{ color: '#6b6760' }}>
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
                style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
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
                style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
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

      {/* Sample prompts */}
      <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Prompts</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Sample prompts from this pack
          </h2>

          <div className="space-y-3 mb-6">
            {samplePrompts.map((prompt, i) => (
              <PromptCard
                key={i}
                prompt={prompt}
                packTitle={pack.title}
                index={i}
              />
            ))}
          </div>

          {/* Agent CTA */}
          <div className="mb-6">
            <AgentCTA context="Paste any prompt into the chat and ask the Promptly AI to adapt it for your specific student or class." />
          </div>

          {/* Hidden prompts + monetisation */}
          {hiddenCount > 0 && (
            <div className="space-y-4">
              <div
                className="rounded-xl border p-5 text-center"
                style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}
              >
                <p className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
                  + {hiddenCount} more prompts in this pack
                </p>
                <p className="text-sm" style={{ color: '#6b6760' }}>
                  Download the full pack to access all {pack.promptCount} prompts.
                </p>
              </div>
              <MonetisationBanner variant="pack" />
            </div>
          )}

          {/* Copy all visible */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm" style={{ color: '#6b6760' }}>Copy all {samplePrompts.length} visible prompts:</span>
            <CopyButton text={allVisibleText} size="md" />
          </div>
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
              <li key={step.n} className="flex gap-4 p-4 rounded-xl bg-white border" style={{ borderColor: '#e8e6e0' }}>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: '#e0f5f6', color: '#00808a' }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: '#6b6760' }}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related packs */}
      {relatedPacks.length > 0 && (
        <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
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
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: '#e8e6e0', background: 'white' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
              <strong style={{ color: '#1c1a15' }}>Important:</strong> These prompts support educators, families and learners. They do not replace professional teacher judgment, SEN support plans, EHCPs or clinical advice. Always adapt for the individual child's needs and school context.
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
    </>
  );
};

export default PromptsPack;
