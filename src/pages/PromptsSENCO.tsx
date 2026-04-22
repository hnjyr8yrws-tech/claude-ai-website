import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import PackCard from '../components/prompts/PackCard';
import AgentCTA from '../components/prompts/AgentCTA';
import MonetisationBanner from '../components/prompts/MonetisationBanner';
import { PROMPT_PACKS } from '../data/prompts';

const SENCO_PROMPTS = [
  'Draft an EHCP review summary for a Year 9 student with autism and ADHD, focusing on progress toward outcomes.',
  'Write a parent-friendly explanation of what provision mapping means and how it supports their child.',
  'Create a staff guidance note on making lessons accessible for students with dyslexia in mainstream secondary.',
  'Draft a letter to parents explaining the access arrangements process for upcoming GCSE exams.',
  'Summarise this SEND Code of Practice section [paste text] into 5 practical actions for a school SENCO.',
  'Write a pupil voice prompt I can use in a one-to-one review with a 14-year-old student with anxiety.',
];

const SECTIONS = [
  {
    label: 'EHCP & Reviews',
    title: 'EHCP reviews and documentation',
    prompts: [SENCO_PROMPTS[0]],
  },
  {
    label: 'Parent Communication',
    title: 'Parent-friendly communication',
    prompts: [SENCO_PROMPTS[1], SENCO_PROMPTS[3]],
  },
  {
    label: 'Staff Guidance',
    title: 'Staff guidance and CPD support',
    prompts: [SENCO_PROMPTS[2]],
  },
  {
    label: 'Code of Practice',
    title: 'SEND Code of Practice prompts',
    prompts: [SENCO_PROMPTS[4]],
  },
  {
    label: 'Pupil Voice',
    title: 'Pupil voice and review conversations',
    prompts: [SENCO_PROMPTS[5]],
  },
  {
    label: 'Access Arrangements',
    title: 'Access arrangements and exam support',
    prompts: [SENCO_PROMPTS[3]],
  },
  {
    label: 'All SENCO Prompts',
    title: 'Full SENCO prompt set',
    prompts: SENCO_PROMPTS,
  },
];

const FEATURED_PACK_IDS = [1, 9, 20, 25];

const PromptsSENCO = () => {
  const featuredPacks = FEATURED_PACK_IDS
    .map((id) => PROMPT_PACKS.find((p) => p.id === id))
    .filter(Boolean) as typeof PROMPT_PACKS;

  return (
    <>
      <SEO
        title="AI Prompts for SENCOs | GetPromptly"
        description="Streamline EHCP documentation, parent communication, provision mapping and staff guidance with AI. Free SENCO prompts."
        keywords="SENCO AI prompts, EHCP prompts, SEND review prompts, access arrangements prompts, provision mapping prompts"
        path="/prompts/senco"
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/prompts" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a]" style={{ color: '#9ca3af' }}>
            ← AI Prompts
          </Link>
          <SectionLabel>For SENCOs</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
            AI Prompts for SENCOs and SEND Support Teams
          </h1>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
            Streamline EHCP documentation, parent communication, provision mapping and staff guidance with AI.
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
              to="/ai-training/send"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
              style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
            >
              AI Training for SEND
            </Link>
          </div>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.slice(0, 6).map((section, idx) => (
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
                <PromptCard key={i} prompt={prompt} packTitle="SENCO Prompts" index={i} />
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
            Prompt packs for SENCOs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <section className="px-5 sm:px-8 py-8" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto">
          <AgentCTA context="Tell the Promptly AI about your school's SEND context for personalised SENCO prompts." />
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
              <strong style={{ color: '#1c1a15' }}>Important:</strong> These prompts support SENCO practice and documentation. They do not replace EHCPs, legal obligations under the SEND Code of Practice, or professional SENCO judgment. Always verify AI outputs before sharing with families or including in statutory documents.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
          <Link to="/equipment/send" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>SEND Equipment →</Link>
          <Link to="/ai-training/send" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Training for SEND →</Link>
          <Link to="/safety-methodology" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>Safety Methodology →</Link>
        </div>
      </section>
    </>
  );
};

export default PromptsSENCO;
