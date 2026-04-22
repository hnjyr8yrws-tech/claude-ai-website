import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, PATHWAY_TEACHERS, type TrainingItem } from '../data/training';

const TEAL = '#00808a';

const pathwayItems: TrainingItem[] = PATHWAY_TEACHERS
  .map(s => TRAINING.find(t => t.slug === s))
  .filter(Boolean) as TrainingItem[];

const allTeacherItems = TRAINING.filter(t => t.tags.includes('Teachers'));

const USE_CASES = [
  {
    title: 'Safe classroom use',
    description: 'Understand what AI can and cannot do in the classroom. Learn how to set expectations with pupils and apply the DfE\'s guidance on safe AI use.',
    slugs: ['ai-in-education-support', 'google-ai-essentials'],
  },
  {
    title: 'Lesson planning with AI',
    description: 'Use AI to generate lesson plan frameworks, differentiate materials and create resources in minutes — with a human review before use.',
    slugs: ['microsoft-learn-ai', 'elements-of-ai'],
  },
  {
    title: 'Feedback and assessment',
    description: 'AI can help draft feedback templates, mark schemes and formative assessment strategies — freeing up teacher time for meaningful interaction.',
    slugs: ['ai-skills-hub', 'google-ai-essentials'],
  },
  {
    title: 'Admin efficiency',
    description: 'From report writing to data analysis, AI tools can reduce administrative burden significantly. Start with the basics before going advanced.',
    slugs: ['microsoft-learn-ai', 'ai-skills-hub'],
  },
];

function TrainingCard({ item }: { item: TrainingItem }) {
  return (
    <div
      className="rounded-xl border flex flex-col"
      style={{ borderColor: '#e8e6e0', background: 'white' }}
    >
      <div className="px-4 pt-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>
            {item.provider}
          </span>
          {item.type === 'Free' ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d' }}>Free</span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fffbeb', color: '#92400e' }}>Paid</span>
          )}
        </div>
        <h4 className="font-display text-base leading-snug mb-1" style={{ color: 'var(--text)' }}>{item.name}</h4>
        <p className="text-xs" style={{ color: '#6b6760' }}>{item.notes}</p>
      </div>
      <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
        <a
          href={item.url}
          target="_blank"
          rel={item.affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
          className="text-xs font-semibold"
          style={{ color: TEAL }}
        >
          Visit →
        </a>
      </div>
    </div>
  );
}

export default function AITrainingTeachers() {
  return (
    <>
      <SEO
        title="AI Training for Teachers — UK Classroom Resources | GetPromptly"
        description="Free and paid AI training curated for UK teachers. Government guidance, Google Essentials, Microsoft Learn and more. Safe AI in the classroom from beginner to confident."
        keywords="AI training teachers UK, AI in classroom, DfE AI guidance, teacher CPD AI, safe AI schools"
        path="/ai-training/teachers"
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
          <SectionLabel>For Teachers</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            AI Training for{' '}
            <span style={{ color: TEAL }}>Teachers.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#6b6760' }}>
            From understanding what AI is to using it confidently in the classroom. All resources are
            safe, practical and aligned to UK Department for Education guidance.
          </p>
        </div>
      </section>

      {/* Pathway */}
      <section className="px-5 sm:px-8 pb-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Recommended Pathway</SectionLabel>
          <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--text)' }}>
            AI for Teachers Starter Path
          </h2>
          <p className="text-base mb-8 max-w-2xl" style={{ color: '#6b6760' }}>
            Our curated sequence for teachers who are new to AI. Start with government guidance, then
            build practical skills through free provider courses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathwayItems.map((item, index) => (
              <div
                key={item.slug}
                className="rounded-2xl border flex flex-col p-5"
                style={{ borderColor: '#e8e6e0', background: 'white' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: TEAL, color: 'white' }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>{item.provider}</span>
                </div>
                <h3 className="font-display text-lg leading-snug mb-2" style={{ color: 'var(--text)' }}>
                  {item.name}
                </h3>
                <p className="text-sm flex-1 mb-4" style={{ color: '#6b6760' }}>{item.notes}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={item.type === 'Free' ? { background: '#f0fdf4', color: '#15803d' } : { background: '#fffbeb', color: '#92400e' }}
                  >
                    {item.cost}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold"
                    style={{ color: TEAL }}
                  >
                    Start →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use case blocks */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Use Cases</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            How teachers are using AI
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {USE_CASES.map(uc => {
              const ucItems = uc.slugs
                .map(s => TRAINING.find(t => t.slug === s))
                .filter(Boolean) as TrainingItem[];
              return (
                <div key={uc.title}>
                  <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {uc.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b6760' }}>
                    {uc.description}
                  </p>
                  <div className="space-y-3">
                    {ucItems.map(item => (
                      <TrainingCard key={item.slug} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All tagged items */}
      {allTeacherItems.length > pathwayItems.length && (
        <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>All Teacher Resources</SectionLabel>
            <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>
              Every resource tagged for teachers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allTeacherItems.map(item => (
                <div
                  key={item.slug}
                  className="rounded-2xl border flex flex-col"
                  style={{ borderColor: '#e8e6e0', background: 'white' }}
                >
                  <div className="px-5 pt-5 pb-4 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>{item.category}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={item.type === 'Free' ? { background: '#f0fdf4', color: '#15803d' } : { background: '#fffbeb', color: '#92400e' }}
                      >
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>{item.name}</h3>
                    <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.provider}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{item.notes}</p>
                  </div>
                  <div className="px-5 pb-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
                    <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{item.cost}</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: TEAL, color: 'white' }}>Visit →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="px-5 sm:px-8 py-16" style={{ background: '#111210' }}>
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>Next step</SectionLabel>
          <h2 className="font-display text-3xl mb-4" style={{ color: 'white' }}>
            Explore AI tools for teachers
          </h2>
          <p className="text-base mb-8" style={{ color: '#6b6760' }}>
            Once you've built your knowledge, explore the AI tools we've reviewed for safe use in
            UK classrooms.
          </p>
          <Link
            to="/tools"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: TEAL }}
          >
            Explore AI tools →
          </Link>
        </div>
      </section>
    </>
  );
}
