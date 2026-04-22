import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import PackCard from '../components/prompts/PackCard';
import AgentCTA from '../components/prompts/AgentCTA';
import MonetisationBanner from '../components/prompts/MonetisationBanner';
import { PROMPT_PACKS } from '../data/prompts';

const PARENT_PROMPTS = [
  'Help me write a calm, professional email to my child\'s teacher about a concern I have with their [subject] progress.',
  'Explain what an EHCP annual review involves and what I should prepare as a parent.',
  'Create a gentle evening homework routine for my 13-year-old with ADHD that avoids conflict.',
  'Help me understand this school report comment: [paste comment] — what does it actually mean and what should I do?',
  'Write 5 questions I should ask at my child\'s next parents\' evening.',
  'Create a calm script I can use when my anxious child refuses to do their homework.',
];

const SECTIONS = [
  {
    label: 'School Communication',
    title: 'Communicating with school',
    prompts: [PARENT_PROMPTS[0], PARENT_PROMPTS[4]],
  },
  {
    label: 'EHCP & SEND',
    title: 'Understanding EHCP and SEND support',
    prompts: [PARENT_PROMPTS[1]],
  },
  {
    label: 'Homework Support',
    title: 'Homework and revision support at home',
    prompts: [PARENT_PROMPTS[2], PARENT_PROMPTS[5]],
  },
  {
    label: 'Understanding School Reports',
    title: 'Decoding school reports and feedback',
    prompts: [PARENT_PROMPTS[3]],
  },
  {
    label: 'Parents\' Evening',
    title: 'Preparing for parents\' evening',
    prompts: [PARENT_PROMPTS[4]],
  },
  {
    label: 'Supporting Anxiety',
    title: 'Supporting an anxious child at home',
    prompts: [PARENT_PROMPTS[5]],
  },
];

const FEATURED_PACK_IDS = [15, 22, 27, 33, 34, 35, 39];

const PromptsParents = () => {
  const featuredPacks = FEATURED_PACK_IDS
    .map((id) => PROMPT_PACKS.find((p) => p.id === id))
    .filter(Boolean) as typeof PROMPT_PACKS;

  return (
    <>
      <SEO
        title="AI Prompts for Parents | GetPromptly"
        description="Support your child's learning at home, navigate school systems and advocate confidently — with a little help from AI. Free parent prompts."
        keywords="AI prompts parents, homework help prompts, EHCP parent prompts, SEN advocacy prompts, school communication prompts"
        path="/prompts/parents"
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/prompts" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a]" style={{ color: '#9ca3af' }}>
            ← AI Prompts
          </Link>
          <SectionLabel>For Parents</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
            AI Prompts for Parents and Carers
          </h1>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
            Support your child's learning at home, navigate school systems and advocate confidently — with a little help from AI.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/prompts/library"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: '#00808a', color: 'white' }}
            >
              Browse All Packs →
            </Link>
            <Link
              to="/ai-training/parents"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
              style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
            >
              AI Training for Parents
            </Link>
          </div>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.map((section, idx) => (
        <section
          key={section.label}
          className="px-5 sm:px-8 py-10 border-t"
          style={{ borderColor: '#e8e6e0', background: idx % 2 === 0 ? 'white' : 'var(--bg)' }}
        >
          <div className="max-w-3xl mx-auto">
            <SectionLabel>{section.label}</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.prompts.map((prompt, i) => (
                <PromptCard key={i} prompt={prompt} packTitle="Parent Prompts" index={i} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Featured packs */}
      <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Recommended Packs</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Prompt packs for parents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPacks.slice(0, 6).map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <section className="px-5 sm:px-8 py-8" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto">
          <AgentCTA context="Tell the Promptly AI about your child's age, SEN needs and the situation you need help with." />
        </div>
      </section>

      {/* Monetisation */}
      <section className="px-5 sm:px-8 py-8" style={{ background: '#111210' }}>
        <div className="max-w-3xl mx-auto">
          <MonetisationBanner variant="bundle" />
        </div>
      </section>

      {/* Trust note */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
              <strong style={{ color: '#1c1a15' }}>Important:</strong> These prompts support parents in communicating and advocating. They do not replace legal or medical advice, EHCP legal processes, or professional SEND support. Always verify important information with your child's school and relevant professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
          <Link to="/ai-training/parents" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Training for Parents →</Link>
          <Link to="/equipment/send" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>Assistive Technology →</Link>
        </div>
      </section>
    </>
  );
};

export default PromptsParents;
