import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, PATHWAY_SEND, type TrainingItem } from '../data/training';

const TEAL = '#BEFF00';

const pathwayItems: TrainingItem[] = PATHWAY_SEND
  .map(s => TRAINING.find(t => t.slug === s))
  .filter(Boolean) as TrainingItem[];

const GUIDANCE_BLOCKS = [
  {
    title: 'Screen reader compatible',
    description: 'AbilityNet reviews AI tools for accessibility and has factsheets on using AI with visual impairments. Microsoft\'s platform is fully WCAG 2.1 compliant.',
    slugs: ['abilitynet-ai-resources', 'microsoft-accessibility-ai'],
    note: 'AbilityNet is a UK charity. Their free advice line supports disabled people using technology.',
  },
  {
    title: 'Neurodiversity and AI',
    description: 'AI can support learners with dyslexia, ADHD and autism when used thoughtfully. OpenLearn and Elements of AI offer flexible pacing and accessible formats.',
    slugs: ['elements-of-ai', 'openlearn-ai'],
    note: 'Both platforms have accessibility modes and no time pressure.',
  },
  {
    title: 'Using AI as an accessibility tool',
    description: 'AI can act as a reading assistant, writing support and communication aid. Khan Academy and Microsoft both cover how AI makes learning more accessible.',
    slugs: ['khan-academy-ai', 'microsoft-accessibility-ai'],
    note: 'Microsoft AI tools include captions, Immersive Reader and dictation.',
  },
];

function TrainingCard({ item }: { item: TrainingItem }) {
  return (
    <div className="rounded-2xl border flex flex-col" style={{ borderColor: '#ECE7DD', background: 'white' }}>
      <div className="px-5 pt-5 pb-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>{item.provider}</span>
          <div className="flex gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#15803d' }}>Free</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#eff6ff', color: '#1d4ed8' }}>SEND</span>
          </div>
        </div>
        <h3 className="font-display text-lg leading-snug mb-0.5" style={{ color: 'var(--text)' }}>{item.name}</h3>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{item.level}</p>
        <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>{item.notes}</p>
      </div>
      <div className="px-5 pb-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Free</span>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: TEAL, color: '#0F1C1A' }}>Visit →</a>
      </div>
    </div>
  );
}

export default function AITrainingSEND() {
  return (
    <>
      <SEO
        title="Accessible AI Training for SEND Learners & Supporters | GetPromptly"
        description="AI training for learners with disabilities. AbilityNet, Microsoft Accessibility, Elements of AI — all free, UK-relevant and accessibility-first."
        keywords="AI training SEND, accessible AI learning, AI disability UK, AbilityNet AI, Microsoft accessibility AI, neurodiversity AI"
        path="/ai-training/send"
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
          <SectionLabel>SEND &amp; Accessibility</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            Accessible <span style={{ color: TEAL }}>AI Training.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#4A4A4A' }}>
            AI training for learners with disabilities, their teachers, parents and support staff.
            All resources are free and selected with accessibility in mind.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Key Resources</SectionLabel>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>AbilityNet and Microsoft — start here</h2>
          <p className="text-base mb-8 max-w-2xl" style={{ color: '#4A4A4A' }}>
            These two are the most important resources for anyone using AI with or as a disabled learner.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {['abilitynet-ai-resources', 'microsoft-accessibility-ai'].map(slug => {
              const item = TRAINING.find(t => t.slug === slug)!;
              return (
                <div key={slug} className="rounded-2xl border p-6" style={{ borderColor: '#bfdbfe', background: '#eff6ff' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#1d4ed8' }}>{item.provider}</p>
                  <h3 className="font-display text-xl leading-snug mb-2" style={{ color: 'var(--text)' }}>{item.name}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A4A4A' }}>{item.notes}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold px-4 py-2 rounded-xl inline-block" style={{ background: '#1d4ed8', color: 'white' }}>Visit →</a>
                </div>
              );
            })}
          </div>

          <SectionLabel>Recommended Pathway</SectionLabel>
          <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>Accessible AI for SEND — full path</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathwayItems.map((item, index) => (
              <div key={item.slug} className="rounded-2xl border p-5" style={{ borderColor: '#bfdbfe', background: '#eff6ff' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#1d4ed8', color: 'white' }}>{index + 1}</span>
                  <span className="text-xs font-medium" style={{ color: '#1d4ed8' }}>{item.provider}</span>
                </div>
                <h3 className="font-display text-base leading-snug mb-2" style={{ color: 'var(--text)' }}>{item.name}</h3>
                <p className="text-xs mb-4" style={{ color: '#4A4A4A' }}>{item.notes}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: '#1d4ed8' }}>Visit →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Guidance</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>Three areas of SEND and AI</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {GUIDANCE_BLOCKS.map(block => {
              const items = block.slugs.map(s => TRAINING.find(t => t.slug === s)).filter(Boolean) as TrainingItem[];
              return (
                <div key={block.title}>
                  <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>{block.title}</h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#4A4A4A' }}>{block.description}</p>
                  <p className="text-xs mb-4 italic" style={{ color: '#9ca3af' }}>{block.note}</p>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.slug} className="rounded-xl border p-4" style={{ borderColor: '#ECE7DD', background: 'white' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#9ca3af' }}>{item.provider}</p>
                        <h4 className="font-display text-base leading-snug mb-1" style={{ color: 'var(--text)' }}>{item.name}</h4>
                        <p className="text-xs mb-2" style={{ color: '#4A4A4A' }}>{item.notes}</p>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: TEAL }}>Visit →</a>
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
          <SectionLabel>All SEND Resources</SectionLabel>
          <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text)' }}>Every accessible resource</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pathwayItems.map(item => <TrainingCard key={item.slug} item={item} />)}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-5">
          <Link to="/equipment/send" className="flex-1 rounded-2xl border p-6" style={{ borderColor: '#bfdbfe', background: '#eff6ff' }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: '#1d4ed8' }}>Related</p>
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>SEND Equipment →</p>
            <p className="text-sm" style={{ color: '#4A4A4A' }}>Hardware, AAC devices and accessibility equipment for SEND learners</p>
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
