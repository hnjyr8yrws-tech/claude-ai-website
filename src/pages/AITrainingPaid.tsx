import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, type TrainingItem } from '../data/training';

const TEAL = '#00808a';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

type LevelFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const LEVEL_PILLS: { label: string; value: LevelFilter }[] = [
  { label: 'All',          value: 'All' },
  { label: 'Beginner',     value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced',     value: 'Advanced' },
];

const PAID_ITEMS = TRAINING.filter(t => t.type === 'Paid');

function TrainingCard({ item }: { item: TrainingItem }) {
  const linkRel = item.affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer';
  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>
            {item.category}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#fffbeb', color: '#92400e' }}
            >
              Paid
            </span>
            {item.affiliate && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#f5f3ff', color: '#7c3aed' }}
              >
                Affiliate
              </span>
            )}
          </div>
        </div>
        <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>
          {item.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.provider}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>{item.notes}</p>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
          style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
        >
          {item.level}
        </span>
      </div>
      <div
        className="px-5 pb-5 pt-3 border-t flex items-center justify-between gap-3"
        style={{ borderColor: '#f3f4f6' }}
      >
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{item.cost}</span>
        <a
          href={item.url}
          target="_blank"
          rel={linkRel}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: TEAL, color: 'white' }}
        >
          Visit →
        </a>
      </div>
    </div>
  );
}

export default function AITrainingPaid() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('All');

  const filtered = useMemo(() => {
    if (levelFilter === 'All') return PAID_ITEMS;
    return PAID_ITEMS.filter(item => item.tags.includes(levelFilter));
  }, [levelFilter]);

  return (
    <>
      <SEO
        title="Premium AI Courses for Professionals & Career Switchers | GetPromptly"
        description="Paid AI courses with certificates, structured learning and career pathways. From Coursera and Udemy to DeepLearning.AI and General Assembly."
        keywords="paid AI courses UK, AI certificate courses, Coursera AI, Udemy AI, DeepLearning AI, AI bootcamp UK"
        path="/ai-training/paid"
      />

      {/* Back link */}
      <div className="px-5 sm:px-8 pt-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <Link to="/ai-training" className="inline-flex items-center gap-1.5 text-sm" style={{ color: TEAL }}>
            ← Back to Training Hub
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-8 pb-12 px-5 sm:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Premium Courses</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            Premium{' '}
            <span style={{ color: TEAL }}>AI Courses.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#6b6760' }}>
            {PAID_ITEMS.length} paid courses with certificates, expert mentors and structured
            progression. Worth it when you need proof of skills or a deeper learning experience.
          </p>
        </div>
      </section>

      {/* Affiliate disclaimer */}
      <section className="px-5 sm:px-8 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border px-6 py-4 flex items-start gap-3"
            style={{ background: AMBER_BG, borderColor: AMBER_BORDER }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="7" stroke="#92400e" strokeWidth="1.5"/>
              <path d="M8 5v4M8 11v.5" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-sm" style={{ color: AMBER_TEXT }}>
              <strong>Affiliate disclosure:</strong> Some links below are affiliate links, marked with a purple "Affiliate" badge.
              We may earn a small commission at no extra cost to you. All reviews are independent — we never accept payment for positive coverage.
            </p>
          </div>
        </div>
      </section>

      {/* When is paid worth it */}
      <section className="px-5 sm:px-8 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: AMBER_BORDER, background: AMBER_BG }}
          >
            <h2 className="font-display text-2xl mb-5" style={{ color: AMBER_TEXT }}>
              When is paid training worth it?
            </h2>
            <ul className="space-y-3">
              {[
                'You need a recognised certificate for career progression, job applications or promotion.',
                'You are switching careers and need structured, mentor-supported learning with clear outcomes.',
                'Your school or employer is funding CPD and requires accredited evidence.',
                'You\'ve exhausted free resources and need deeper technical skills — data, machine learning, or deployment.',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#1c1a15' }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                    style={{ background: AMBER_TEXT, color: 'white' }}
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

      {/* Level filter + grid */}
      <section className="px-5 sm:px-8 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by level">
            {LEVEL_PILLS.map(pill => (
              <button
                key={pill.value}
                onClick={() => setLevelFilter(pill.value)}
                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={{
                  borderColor: levelFilter === pill.value ? TEAL : '#e8e6e0',
                  background: levelFilter === pill.value ? TEAL : 'white',
                  color: levelFilter === pill.value ? 'white' : '#6b6760',
                }}
                aria-pressed={levelFilter === pill.value}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Showing {filtered.length} paid course{filtered.length !== 1 ? 's' : ''}
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
            to="/ai-training/free"
            className="flex-1 rounded-2xl border p-5 text-center"
            style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
          >
            <p className="font-display text-lg mb-1" style={{ color: '#15803d' }}>
              View free resources →
            </p>
            <p className="text-sm" style={{ color: '#15803d', opacity: 0.7 }}>
              No cost, government-backed options
            </p>
          </Link>
          <Link
            to="/ai-training"
            className="flex-1 rounded-2xl border p-5 text-center"
            style={{ borderColor: '#e8e6e0' }}
          >
            <p className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
              Back to Training Hub →
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>All 26 resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
