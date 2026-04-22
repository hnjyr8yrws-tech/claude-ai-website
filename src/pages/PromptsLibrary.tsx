import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PackCard from '../components/prompts/PackCard';
import { PROMPT_PACKS, CATEGORIES } from '../data/prompts';

const ROLES = ['All', 'Teachers', 'SENCOs', 'Parents', 'Students', 'School Leaders', 'Admin'];
const SEN_FILTERS = ['All', 'Dyslexia', 'ADHD', 'Autism', 'Anxiety', 'Dyscalculia', 'Executive Dysfunction', 'All SEN'];
const STAGES = ['All', 'KS3', 'GCSE', 'A-Level', 'All ages'];
type SortOption = 'default' | 'most-prompts' | 'alpha';

const PromptsLibrary = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [senFilter, setSenFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [sort, setSort] = useState<SortOption>('default');

  const isFiltered = search || categoryFilter !== 'All' || roleFilter !== 'All' || senFilter !== 'All' || stageFilter !== 'All' || sort !== 'default';

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setRoleFilter('All');
    setSenFilter('All');
    setStageFilter('All');
    setSort('default');
  };

  const filtered = useMemo(() => {
    let packs = [...PROMPT_PACKS];

    if (search.trim()) {
      const q = search.toLowerCase();
      packs = packs.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      packs = packs.filter((p) => p.category === categoryFilter);
    }

    if (roleFilter !== 'All') {
      packs = packs.filter((p) => p.roles.includes(roleFilter));
    }

    if (senFilter !== 'All') {
      packs = packs.filter((p) => p.senFocus.includes(senFilter));
    }

    if (stageFilter !== 'All') {
      packs = packs.filter((p) => p.stages.includes(stageFilter));
    }

    if (sort === 'most-prompts') {
      packs = packs.sort((a, b) => b.promptCount - a.promptCount);
    } else if (sort === 'alpha') {
      packs = packs.sort((a, b) => a.title.localeCompare(b.title));
    }

    return packs;
  }, [search, categoryFilter, roleFilter, senFilter, stageFilter, sort]);

  return (
    <>
      <SEO
        title="AI Prompts Library — 50 Packs | GetPromptly"
        description="Browse all 50 AI prompt packs for UK education. Filter by role, SEN focus, category and key stage. Free to copy and use."
        keywords="AI prompts library, teacher prompts, SEN prompts, GCSE prompts, SENCO prompts, education AI"
        path="/prompts/library"
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-12 pb-8 border-b" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto">
          <Link
            to="/prompts"
            className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a] focus-visible:outline-none"
            style={{ color: '#9ca3af' }}
          >
            ← AI Prompts
          </Link>
          <SectionLabel>All Packs</SectionLabel>
          <h1 className="font-display text-3xl sm:text-4xl mb-2" style={{ color: 'var(--text)' }}>
            AI Prompts Library
          </h1>
          <p className="text-base" style={{ color: '#6b6760' }}>
            50 prompt packs · 440+ ready-to-copy prompts · free to use
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-5 sm:px-8 py-6 border-b sticky top-0 z-10" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto space-y-3">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4.5" stroke="#9ca3af" strokeWidth="1.3" />
                <path d="M10 10l2.5 2.5" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packs..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#00808a]"
                style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}
                aria-label="Search prompt packs"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#00808a] cursor-pointer"
              style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: '#6b6760' }}
              aria-label="Sort packs"
            >
              <option value="default">Sort: Default</option>
              <option value="most-prompts">Most Prompts</option>
              <option value="alpha">A–Z</option>
            </select>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap" role="group" aria-label="Filter by category">
            {['All', ...CATEGORIES.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] ${
                  categoryFilter === cat ? 'border-[#00808a] bg-[#e0f5f6] text-[#00808a]' : ''
                }`}
                style={
                  categoryFilter !== cat
                    ? { borderColor: '#e8e6e0', color: '#6b6760', background: '#f7f6f2' }
                    : {}
                }
                aria-pressed={categoryFilter === cat}
              >
                {cat === 'All' ? 'All categories' : cat}
              </button>
            ))}
          </div>

          {/* Role + SEN + Stage pills */}
          <div className="flex flex-wrap gap-2">
            {/* Role */}
            <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by role">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] ${
                    roleFilter === r ? 'border-[#00808a] bg-[#e0f5f6] text-[#00808a]' : ''
                  }`}
                  style={
                    roleFilter !== r
                      ? { borderColor: '#e8e6e0', color: '#9ca3af', background: 'white' }
                      : {}
                  }
                  aria-pressed={roleFilter === r}
                >
                  {r === 'All' ? 'All roles' : r}
                </button>
              ))}
            </div>

            {/* SEN */}
            <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by SEN focus">
              {SEN_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSenFilter(s)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] ${
                    senFilter === s ? 'border-[#00808a] bg-[#e0f5f6] text-[#00808a]' : ''
                  }`}
                  style={
                    senFilter !== s
                      ? { borderColor: '#e8e6e0', color: '#9ca3af', background: 'white' }
                      : {}
                  }
                  aria-pressed={senFilter === s}
                >
                  {s === 'All' ? 'All SEN' : s}
                </button>
              ))}
            </div>

            {/* Stage */}
            <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by stage">
              {STAGES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStageFilter(st)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] ${
                    stageFilter === st ? 'border-[#00808a] bg-[#e0f5f6] text-[#00808a]' : ''
                  }`}
                  style={
                    stageFilter !== st
                      ? { borderColor: '#e8e6e0', color: '#9ca3af', background: 'white' }
                      : {}
                  }
                  aria-pressed={stageFilter === st}
                >
                  {st === 'All' ? 'All stages' : st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-5 sm:px-8 py-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <p className="text-sm" style={{ color: '#6b6760' }}>
              Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of 50 packs
            </p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a]"
                style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>No packs found</p>
              <p className="text-sm mb-4" style={{ color: '#6b6760' }}>Try adjusting your filters or search term.</p>
              <button
                onClick={clearFilters}
                className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                style={{ background: '#00808a', color: 'white' }}
              >
                Clear all filters
              </button>
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
    </>
  );
};

export default PromptsLibrary;
