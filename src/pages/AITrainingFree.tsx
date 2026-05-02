import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, type TrainingItem } from '../data/training';

const TEAL = '#BEFF00';

type AudienceFilter = 'All' | 'Teachers' | 'Parents' | 'Students' | 'SEND' | 'Leaders';

const AUDIENCE_PILLS: { label: string; value: AudienceFilter }[] = [
  { label: 'All',      value: 'All' },
  { label: 'Teachers', value: 'Teachers' },
  { label: 'Parents',  value: 'Parents' },
  { label: 'Students', value: 'Students' },
  { label: 'SEND',     value: 'SEND' },
  { label: 'Leaders',  value: 'Leaders' },
];

const FREE_ITEMS = TRAINING.filter(t => t.type === 'Free');

function TrainingCard({ item }: { item: TrainingItem }) {
  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ borderColor: '#ECE7DD', background: 'white' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#f0fdf4', color: '#15803d' }}
            >
              Free
            </span>
            {item.ukRelevant && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#e0f2fe', color: '#0369a1' }}
              >
                UK
              </span>
            )}
          </div>
        </div>
        <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.provider}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#4A4A4A' }}>{item.notes}</p>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
          style={{ borderColor: '#ECE7DD', color: '#4A4A4A' }}
        >
          {item.level}
        </span>
      </div>
      <div
        className="px-5 pb-5 pt-3 border-t flex items-center justify-between gap-3"
        style={{ borderColor: '#f3f4f6' }}
      >
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Free</span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: TEAL, color: '#0F1C1A' }}
        >
          Visit →
        </a>
      </div>
    </div>
  );
}

export default function AITrainingFree() {
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('All');

  const filtered = useMemo(() => {
    if (audienceFilter === 'All') return FREE_ITEMS;
    return FREE_ITEMS.filter(item => item.tags.includes(audienceFilter));
  }, [audienceFilter]);

  return (
    <>
      <SEO
        title="Free AI Training Courses for UK Educators | GetPromptly"
        description="Browse all free AI training resources for UK teachers, parents, students and school leaders. Government-backed, university-supported and accessible for all."
        keywords="free AI courses UK, free AI training teachers, free AI learning, AI skills hub, elements of AI, khan academy AI"
        path="/ai-training/free"
      />

      {/* Back link */}
      <div className="px-5 sm:px-8 pt-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <Link
            to="/ai-training"
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: TEAL }}
          >
            ← Back to Training Hub
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-16 px-5 sm:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Free Resources</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            Free{' '}
            <span style={{ color: TEAL }}>AI Training.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#4A4A4A' }}>
            {FREE_ITEMS.length} completely free resources — no subscription, no credit card. Many are
            backed by the UK Government, universities and established charities.
          </p>
        </div>
      </section>

      {/* Why free section */}
      <section className="px-5 sm:px-8 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
          >
            <h2 className="font-display text-2xl mb-5" style={{ color: '#15803d' }}>
              Why free AI training matters in the UK
            </h2>
            <ul className="space-y-3">
              {[
                'The UK Government\'s AI Skills Hub is free for all adults — no signup required for most resources.',
                'Open University\'s OpenLearn platform is fully publicly funded, with university-quality AI content at no cost.',
                'Google and Microsoft both offer free UK-accessible learning paths aligned to workplace AI skills.',
                'Free resources are often better for CPD evidence: they are from trusted, citable providers with clear outcomes.',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#1A1A1A' }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                    style={{ background: '#15803d', color: 'white' }}
                  >
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="px-5 sm:px-8 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by audience">
            {AUDIENCE_PILLS.map(pill => (
              <button
                key={pill.value}
                onClick={() => setAudienceFilter(pill.value)}
                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={{
                  borderColor: audienceFilter === pill.value ? TEAL : '#ECE7DD',
                  background: audienceFilter === pill.value ? TEAL : 'white',
                  color: audienceFilter === pill.value ? 'white' : '#4A4A4A',
                }}
                aria-pressed={audienceFilter === pill.value}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Showing {filtered.length} free resource{filtered.length !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <TrainingCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTAs */}
      <section className="px-5 sm:px-8 py-12" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
          <Link
            to="/ai-training"
            className="flex-1 rounded-2xl border p-5 text-center"
            style={{ borderColor: '#ECE7DD' }}
          >
            <p className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
              Back to Training Hub →
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>See all 26 resources</p>
          </Link>
          <Link
            to="/ai-training/paid"
            className="flex-1 rounded-2xl border p-5 text-center"
            style={{ borderColor: '#fcd34d', background: '#fef3c7' }}
          >
            <p className="font-display text-lg mb-1" style={{ color: '#92400e' }}>
              View paid courses →
            </p>
            <p className="text-sm" style={{ color: '#92400e', opacity: 0.7 }}>
              Certificates and structured learning
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
