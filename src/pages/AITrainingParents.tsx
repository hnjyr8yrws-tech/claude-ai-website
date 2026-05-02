import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { TRAINING, PATHWAY_PARENTS, type TrainingItem } from '../data/training';

const TEAL = '#BEFF00';
const AMBER_BG = '#fef3c7';
const AMBER_TEXT = '#92400e';
const AMBER_BORDER = '#fcd34d';

const pathwayItems: TrainingItem[] = PATHWAY_PARENTS
  .map(s => TRAINING.find(t => t.slug === s))
  .filter(Boolean) as TrainingItem[];

const TOPIC_BLOCKS = [
  {
    title: 'Understanding AI',
    description: 'What actually is artificial intelligence? This block helps parents understand what AI tools do, how they work, and why children encounter them.',
    slugs: ['elements-of-ai', 'ai-skills-hub'],
    note: 'Both are completely free and require no technical background.',
  },
  {
    title: 'AI at home',
    description: 'From smart speakers to homework helpers, AI is already in your home. Learn how to talk with your children about AI, set boundaries and model healthy use.',
    slugs: ['common-sense-ai-guides', 'skills-toolkit'],
    note: 'Common Sense Media is the most trusted resource for families on AI and technology.',
  },
  {
    title: 'Keeping children safe online',
    description: 'AI creates new risks: deepfakes, AI-generated content and chatbots your child might encounter. UK charity Internet Matters has guides specifically for parents.',
    slugs: ['internet-matters-ai-guides', 'ai-skills-hub'],
    note: 'Internet Matters is a UK charity backed by BT, Sky, TalkTalk and Virgin Media.',
  },
];

function TrainingCard({ item }: { item: TrainingItem }) {
  return (
    <div
      className="rounded-xl border flex flex-col"
      style={{ borderColor: '#ECE7DD', background: 'white' }}
    >
      <div className="px-4 pt-4 pb-3 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9C9690' }}>
            {item.provider}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#f0fdf4', color: '#15803d' }}
          >
            Free
          </span>
        </div>
        <h4 className="font-display text-base leading-snug mb-1" style={{ color: 'var(--text)' }}>
          {item.name}
        </h4>
        <p className="text-xs" style={{ color: '#4A4A4A' }}>{item.notes}</p>
      </div>
      <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold"
          style={{ color: TEAL }}
        >
          Visit →
        </a>
      </div>
    </div>
  );
}

export default function AITrainingParents() {
  return (
    <>
      <SEO
        title="AI Safety for Parents — Understanding AI at Home | GetPromptly"
        description="Practical, jargon-free AI guidance for UK parents. Understand AI, keep children safe online, and know what questions to ask your child's school."
        keywords="AI safety parents UK, AI guide parents, AI children online safety, Internet Matters AI, Common Sense AI parents"
        path="/ai-training/parents"
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
          <SectionLabel>For Parents</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.08] tracking-tight mb-6" style={{ color: 'var(--text)' }}>
            AI Safety for{' '}
            <span style={{ color: TEAL }}>Parents.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: '#4A4A4A' }}>
            Practical, jargon-free guidance on AI for families. Understand what AI is, how it
            affects your children, and how to have confident conversations at home.
          </p>
        </div>
      </section>

      {/* Pathway */}
      <section className="px-5 sm:px-8 pb-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Recommended Pathway</SectionLabel>
          <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--text)' }}>
            AI Safety for Parents — starter path
          </h2>
          <p className="text-base mb-8 max-w-2xl" style={{ color: '#4A4A4A' }}>
            Four free resources in the order we recommend. No technical knowledge required.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pathwayItems.map((item, index) => (
              <div
                key={item.slug}
                className="rounded-2xl border flex flex-col p-5"
                style={{ borderColor: AMBER_BORDER, background: AMBER_BG }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: AMBER_TEXT, color: 'white' }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium" style={{ color: AMBER_TEXT }}>{item.provider}</span>
                </div>
                <h3 className="font-display text-base leading-snug mb-2" style={{ color: 'var(--text)' }}>
                  {item.name}
                </h3>
                <p className="text-xs flex-1 mb-4" style={{ color: '#4A4A4A' }}>{item.notes}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold"
                  style={{ color: AMBER_TEXT }}
                >
                  Start →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic blocks */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Topics</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            Three things every parent should know
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TOPIC_BLOCKS.map(block => {
              const items = block.slugs
                .map(s => TRAINING.find(t => t.slug === s))
                .filter(Boolean) as TrainingItem[];
              return (
                <div key={block.title}>
                  <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {block.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#4A4A4A' }}>
                    {block.description}
                  </p>
                  <p className="text-xs mb-4 italic" style={{ color: '#9ca3af' }}>
                    {block.note}
                  </p>
                  <div className="space-y-3">
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

      {/* Highlighted external resources */}
      <section className="px-5 sm:px-8 py-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Trusted UK Resources</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Two organisations every UK parent should know
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <h3 className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>
                Internet Matters
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4A4A4A' }}>
                A UK not-for-profit backed by major internet providers. Their AI guide for parents
                is practical, up to date and free. Covers social media AI, generative AI and
                advice on age-appropriate AI use.
              </p>
              <a
                href="https://www.internetmatters.org/resources/ai-tools-guide-for-parents/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold"
                style={{ color: TEAL }}
              >
                Visit Internet Matters →
              </a>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: '#ECE7DD', background: 'white' }}
            >
              <h3 className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>
                Common Sense Media
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#4A4A4A' }}>
                Internationally respected resource for parents on technology and media. Their AI
                education section includes age-by-age guides, conversation starters and
                school-specific advice.
              </p>
              <a
                href="https://www.commonsense.org/education/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold"
                style={{ color: TEAL }}
              >
                Visit Common Sense AI →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 py-16" style={{ background: '#111210' }}>
        <div className="max-w-2xl mx-auto text-center">
          <SectionLabel>Ask the AI</SectionLabel>
          <h2 className="font-display text-3xl mb-4" style={{ color: 'white' }}>
            Have a specific question about AI and your child?
          </h2>
          <p className="text-base mb-8" style={{ color: '#4A4A4A' }}>
            The Promptly AI assistant can answer questions about AI safety, school use policies
            and what to look out for — in plain English.
          </p>
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: TEAL }}
            onClick={() => {
              const w = document.querySelector<HTMLButtonElement>('[data-agent-trigger]');
              if (w) w.click();
            }}
          >
            Ask the Promptly AI →
          </button>
        </div>
      </section>
    </>
  );
}
