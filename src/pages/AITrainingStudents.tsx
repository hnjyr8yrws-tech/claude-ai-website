import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, type TrainingItem } from '../data/training';

const TEAL = '#00808a';

const studentItems = TRAINING.filter(t => t.tags.includes('Students'));

const TOPIC_BLOCKS = [
  {
    title: 'AI basics',
    description: 'Start here if you\'ve never studied AI before. These courses explain what AI is in plain language — no coding needed. Perfect for GCSE and A-level students who want to understand the technology behind their tools.',
    slugs: ['elements-of-ai', 'khan-academy-ai', 'openlearn-ai'],
    highlight: true,
  },
  {
    title: 'Revision tools',
    description: 'Once you understand how AI works, you can use it more effectively as a study aid. Learn how to prompt AI tools for revision quizzes, essay planning and topic summaries — and when not to rely on them.',
    slugs: ['google-ai-essentials', 'ibm-skillsbuild', 'futurelearn-ai-free'],
    highlight: false,
  },
  {
    title: 'Coding and building',
    description: 'If you want to go further — build AI projects, understand machine learning or prepare for a tech career — these coding-focused courses give you practical experience.',
    slugs: ['codeorg-ai', 'codecademy-ai', 'futurelearn-paid-ai'],
    highlight: false,
  },
];

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
          <div className="flex gap-1.5">
            {item.type === 'Free' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d' }}>Free</span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fffbeb', color: '#92400e' }}>Paid</span>
            )}
            {item.affiliate && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#f5f3ff', color: '#7c3aed' }}>Affiliate</span>
            )}
          </div>
        </div>
        <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>{item.name}</h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.provider}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>{item.notes}</p>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
          style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
        >
          {item.level}
        </span>
      </div>
      <div className="px-5 pb-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{item.cost}</span>
        <a href={item.url} target="_blank" rel={linkRel} className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: TEAL, color: 'white' }}>
          Visit →
        </a>
      </div>
    </div>
  );
}

export default function AITrainingStudents() {
  return (
    <>
      <SEO
        title="AI Learning for Students — Free Courses & Revision Tools | GetPromptly"
        description="Free AI courses for UK students. Elements of AI, Khan Academy, Code.org and more. From AI basics to coding and building your first AI project."
        keywords="AI courses students UK, free AI learning students, Elements of AI, Khan Academy AI, Code.org AI, AI revision tool"
        path="/ai-training/students"
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
      <section className="pt-8 pb-16 px-5 sm:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>For Students</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            AI Learning for{' '}
            <span style={{ color: TEAL }}>Students.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#6b6760' }}>
            Whether you want to understand how ChatGPT works, get better at using AI for study,
            or start building your own projects — these are the best resources for students in the UK.
          </p>
        </div>
      </section>

      {/* Highlighted trio */}
      <section className="px-5 sm:px-8 pb-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Start Here</SectionLabel>
          <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--text)' }}>
            Three resources every student should know
          </h2>
          <p className="text-base mb-8 max-w-2xl" style={{ color: '#6b6760' }}>
            These three are completely free, require no technical knowledge, and are used by millions
            of students worldwide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {['elements-of-ai', 'khan-academy-ai', 'codeorg-ai'].map(slug => {
              const item = TRAINING.find(t => t.slug === slug)!;
              return (
                <div
                  key={slug}
                  className="rounded-2xl border p-6"
                  style={{ borderColor: '#e8e6e0', background: 'white' }}
                >
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 inline-block"
                    style={{ background: '#f0fdf4', color: '#15803d' }}
                  >
                    Free
                  </span>
                  <h3 className="font-display text-xl leading-snug mb-1" style={{ color: 'var(--text)' }}>{item.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.provider}</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6b6760' }}>{item.notes}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold px-4 py-2 rounded-xl inline-block"
                    style={{ background: TEAL, color: 'white' }}
                  >
                    Start learning →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topic blocks */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Learning Paths</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            Choose your path
          </h2>
          <div className="space-y-16">
            {TOPIC_BLOCKS.map(block => {
              const items = block.slugs
                .map(s => TRAINING.find(t => t.slug === s))
                .filter(Boolean) as TrainingItem[];
              return (
                <div key={block.title}>
                  <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
                    {block.title}
                  </h3>
                  <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
                    {block.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <TrainingCard key={item.slug} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All student resources */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>All Student Resources</SectionLabel>
          <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>
            Every resource for students ({studentItems.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {studentItems.map(item => (
              <TrainingCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 py-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-5">
          <Link
            to="/tools"
            className="flex-1 rounded-2xl border p-6 text-center"
            style={{ borderColor: '#e8e6e0', background: 'white' }}
          >
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
              Explore AI tools →
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              See the tools we've reviewed for student and school use
            </p>
          </Link>
          <Link
            to="/ai-training"
            className="flex-1 rounded-2xl border p-6 text-center"
            style={{ borderColor: '#e8e6e0', background: 'white' }}
          >
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
              Back to Training Hub →
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>All 26 training resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
