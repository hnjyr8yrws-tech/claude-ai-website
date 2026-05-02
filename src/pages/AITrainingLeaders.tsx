import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, PATHWAY_LEADERS, type TrainingItem } from '../data/training';

const TEAL = '#BEFF00';

const pathwayItems: TrainingItem[] = PATHWAY_LEADERS
  .map(s => TRAINING.find(t => t.slug === s))
  .filter(Boolean) as TrainingItem[];

const TOPIC_BLOCKS = [
  {
    title: 'AI policy for schools',
    description: 'School leaders need a clear AI policy before staff or pupils use AI tools. The DfE\'s AI in Education guidance and the AI Skills Hub both provide frameworks you can adapt.',
    slugs: ['ai-in-education-support', 'ai-skills-hub'],
    note: 'The DfE guidance is specifically written for headteachers and senior leaders in England.',
  },
  {
    title: 'Implementation planning',
    description: 'Rolling out AI across a school requires a phased approach: pilot, review, iterate. Microsoft Learn and Coursera both offer strategic AI adoption content for non-technical leaders.',
    slugs: ['microsoft-learn-ai', 'coursera-ai-courses'],
    note: 'Microsoft Learn has a dedicated module on responsible AI implementation in organisations.',
  },
  {
    title: 'Safeguarding and AI',
    description: 'KCSIE 2025 expects leaders to understand AI risks. This includes deepfakes, AI-generated contact, data privacy and the use of AI with vulnerable children.',
    slugs: ['ai-in-education-support', 'ai-skills-hub'],
    note: 'Cross-reference with your DSL and the Internet Watch Foundation\'s AI guidance.',
  },
  {
    title: 'Staff CPD planning',
    description: 'LinkedIn Learning and Coursera both offer certificates that are appropriate for whole-staff CPD evidence. These can be mapped to your school development plan.',
    slugs: ['linkedin-learning-ai', 'coursera-ai-courses'],
    note: 'LinkedIn Learning certificates are recognised by many MATs as valid CPD evidence.',
  },
];

function TrainingCard({ item }: { item: TrainingItem }) {
  const linkRel = item.affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer';
  return (
    <div className="rounded-2xl border flex flex-col" style={{ borderColor: '#ECE7DD', background: 'white' }}>
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>{item.provider}</span>
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
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.level}</p>
        <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>{item.notes}</p>
      </div>
      <div className="px-5 pb-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{item.cost}</span>
        <a href={item.url} target="_blank" rel={linkRel} className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: TEAL, color: '#0F1C1A' }}>Visit →</a>
      </div>
    </div>
  );
}

export default function AITrainingLeaders() {
  return (
    <>
      <SEO
        title="AI for School Leaders — Policy, Implementation & CPD | GetPromptly"
        description="AI training for headteachers, governors and school leaders. DfE guidance, Microsoft Learn, Coursera and LinkedIn Learning — mapped to school development planning."
        keywords="AI school leaders UK, AI headteacher training, AI school policy, AI CPD schools, KCSIE AI, AI safeguarding schools"
        path="/ai-training/leaders"
      />

      <div className="px-5 sm:px-8 pt-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <Link to="/ai-training" className="inline-flex items-center gap-1.5 text-sm" style={{ color: TEAL }}>
            ← Back to Training Hub
          </Link>
        </div>
      </div>

      <section className="pt-8 pb-16 px-5 sm:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>For School Leaders</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            AI for School <span style={{ color: TEAL }}>Leaders.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#4A4A4A' }}>
            For headteachers, deputy heads and governors. Build your own AI literacy, create
            school policy, plan CPD and lead responsible AI adoption — all evidence-based.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Recommended Pathway</SectionLabel>
          <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--text)' }}>School Leadership AI Readiness</h2>
          <p className="text-base mb-8 max-w-2xl" style={{ color: '#4A4A4A' }}>
            Five resources sequenced for leaders — from DfE guidance to professional certificates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathwayItems.map((item, index) => (
              <div key={item.slug} className="rounded-2xl border flex flex-col p-5" style={{ borderColor: '#1f2937', background: '#111210' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: TEAL, color: '#0F1C1A' }}>{index + 1}</span>
                  <span className="text-xs font-medium" style={{ color: '#4A4A4A' }}>{item.provider}</span>
                </div>
                <h3 className="font-display text-base leading-snug mb-2" style={{ color: 'white' }}>{item.name}</h3>
                <p className="text-xs flex-1 mb-4" style={{ color: '#4A4A4A' }}>{item.notes}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: item.type === 'Free' ? '#4ade80' : '#fcd34d' }}>{item.cost}</span>
                  <a href={item.url} target="_blank" rel={item.affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'} className="text-xs font-semibold" style={{ color: TEAL }}>Start →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Topics</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>Four priorities for school leaders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {TOPIC_BLOCKS.map(block => {
              const items = block.slugs.map(s => TRAINING.find(t => t.slug === s)).filter(Boolean) as TrainingItem[];
              return (
                <div key={block.title}>
                  <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>{block.title}</h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#4A4A4A' }}>{block.description}</p>
                  <p className="text-xs mb-4 italic" style={{ color: '#9ca3af' }}>{block.note}</p>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.slug} className="rounded-xl border p-4" style={{ borderColor: '#ECE7DD', background: '#F8F5F0' }}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>{item.provider}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={item.type === 'Free' ? { background: '#f0fdf4', color: '#15803d' } : { background: '#fffbeb', color: '#92400e' }}>{item.type}</span>
                        </div>
                        <h4 className="font-display text-base leading-snug mb-1" style={{ color: 'var(--text)' }}>{item.name}</h4>
                        <p className="text-xs mb-2" style={{ color: '#4A4A4A' }}>{item.notes}</p>
                        <a href={item.url} target="_blank" rel={item.affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'} className="text-xs font-semibold" style={{ color: TEAL }}>Visit →</a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>All Leader Resources</SectionLabel>
          <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>Full leadership pathway</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pathwayItems.map(item => <TrainingCard key={item.slug} item={item} />)}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-5">
          <Link to="/safety-methodology" className="flex-1 rounded-2xl border p-6" style={{ borderColor: '#1f2937', background: '#111210' }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Related</p>
            <p className="font-display text-xl mb-2" style={{ color: 'white' }}>Safety Methodology →</p>
            <p className="text-sm" style={{ color: '#4A4A4A' }}>How GetPromptly reviews AI tools for safety and safeguarding</p>
          </Link>
          <Link to="/ai-training" className="flex-1 rounded-2xl border p-6" style={{ borderColor: '#ECE7DD', background: 'white' }}>
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>Back to Training Hub →</p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>All 26 training resources</p>
          </Link>
        </div>
      </section>
    </>
  );
}
