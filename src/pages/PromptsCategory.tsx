import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PackCard from '../components/prompts/PackCard';
import { PROMPT_PACKS, CATEGORIES } from '../data/prompts';

const SLUG_TO_DISPLAY: Record<string, string> = {
  'essay-writing': 'Essay & Writing Support',
  'maths-science': 'Maths & Science Support',
  'exam-preparation': 'Exam & Test Preparation',
  'study-skills': 'Study Skills & Executive Function',
  'reading-literacy': 'Reading Comprehension & Literacy',
  'parent-caregiver': 'Parent & Caregiver Tools',
  'language-vocabulary': 'Language Learning & Vocabulary',
  'creative-thinking': 'Creative & Critical Thinking',
  'project-helpers': 'Project & Assignment Helpers',
};

const ADJACENT: Record<string, string[]> = {
  'essay-writing': ['reading-literacy', 'study-skills', 'exam-preparation'],
  'maths-science': ['exam-preparation', 'study-skills', 'creative-thinking'],
  'exam-preparation': ['study-skills', 'essay-writing', 'maths-science'],
  'study-skills': ['exam-preparation', 'essay-writing', 'parent-caregiver'],
  'reading-literacy': ['essay-writing', 'study-skills', 'language-vocabulary'],
  'parent-caregiver': ['study-skills', 'exam-preparation', 'reading-literacy'],
  'language-vocabulary': ['reading-literacy', 'creative-thinking', 'essay-writing'],
  'creative-thinking': ['essay-writing', 'project-helpers', 'study-skills'],
  'project-helpers': ['creative-thinking', 'study-skills', 'exam-preparation'],
};

const SEN_FILTERS = ['All', 'Dyslexia', 'ADHD', 'Autism', 'Anxiety', 'Dyscalculia', 'Executive Dysfunction', 'All SEN'];

const PromptsCategory = () => {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>();
  const [senFilter, setSenFilter] = useState('All');

  const displayName = SLUG_TO_DISPLAY[categorySlug] ?? categorySlug;
  const catData = CATEGORIES.find((c) => c.slug === categorySlug);

  const packsInCategory = useMemo(
    () => PROMPT_PACKS.filter((p) => p.categorySlug === categorySlug),
    [categorySlug]
  );

  const filtered = useMemo(() => {
    if (senFilter === 'All') return packsInCategory;
    return packsInCategory.filter((p) => p.senFocus.includes(senFilter));
  }, [packsInCategory, senFilter]);

  const totalPrompts = packsInCategory.reduce((sum, p) => sum + p.promptCount, 0);

  const adjacentSlugs = ADJACENT[categorySlug] ?? [];

  if (packsInCategory.length === 0) {
    return (
      <div className="px-5 sm:px-8 py-16 text-center" style={{ background: 'var(--bg)' }}>
        <p className="text-lg font-display mb-4" style={{ color: 'var(--text)' }}>Category not found.</p>
        <Link to="/prompts/library" style={{ color: '#00808a' }}>← Back to library</Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${displayName} AI Prompts | GetPromptly`}
        description={catData?.description ?? `AI prompts for ${displayName} — copy-ready, SEN-aware and free to use.`}
        keywords={`${displayName} prompts, AI education, SEN prompts UK`}
        path={`/prompts/category/${categorySlug}`}
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-12 pb-8 border-b" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto">
          <Link
            to="/prompts/library"
            className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a] focus-visible:outline-none"
            style={{ color: '#9ca3af' }}
          >
            ← Back to Library
          </Link>
          <SectionLabel>Category</SectionLabel>
          <h1 className="font-display text-3xl sm:text-4xl mb-2" style={{ color: 'var(--text)' }}>
            {displayName}
          </h1>
          {catData && (
            <p className="text-base mb-4 max-w-2xl" style={{ color: '#6b6760' }}>
              {catData.description}
            </p>
          )}
          <div className="flex gap-4 flex-wrap">
            <span className="text-sm" style={{ color: '#9ca3af' }}>
              <strong style={{ color: 'var(--text)' }}>{packsInCategory.length}</strong> packs
            </span>
            <span className="text-sm" style={{ color: '#9ca3af' }}>
              <strong style={{ color: 'var(--text)' }}>{totalPrompts}</strong> prompts
            </span>
          </div>
        </div>
      </section>

      {/* SEN filter */}
      <section className="px-5 sm:px-8 py-4 border-b" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap" role="group" aria-label="Filter by SEN focus">
            {SEN_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSenFilter(s)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] ${
                  senFilter === s ? 'border-[#00808a] bg-[#e0f5f6] text-[#00808a]' : ''
                }`}
                style={
                  senFilter !== s
                    ? { borderColor: '#e8e6e0', color: '#6b6760', background: '#f7f6f2' }
                    : {}
                }
                aria-pressed={senFilter === s}
              >
                {s === 'All' ? 'All SEN' : s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-5 sm:px-8 py-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm mb-5" style={{ color: '#6b6760' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {packsInCategory.length} packs
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>No packs match this filter.</p>
              <button onClick={() => setSenFilter('All')} className="text-sm" style={{ color: '#00808a' }}>Clear filter</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Adjacent categories */}
      {adjacentSlugs.length > 0 && (
        <section className="px-5 sm:px-8 py-10 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#9ca3af' }}>Related categories</p>
            <div className="flex flex-wrap gap-3">
              {adjacentSlugs.map((slug) => {
                const name = SLUG_TO_DISPLAY[slug] ?? slug;
                return (
                  <Link
                    key={slug}
                    to={`/prompts/category/${slug}`}
                    className="px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:border-[#00808a] hover:text-[#00808a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a]"
                    style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PromptsCategory;
