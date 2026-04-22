import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import AgentCTA from '../components/prompts/AgentCTA';
import MonetisationBanner from '../components/prompts/MonetisationBanner';

const SLT_PROMPTS = [
  'Draft a whole-school AI policy for a UK secondary school that covers KCSIE 2025 obligations and responsible use.',
  'Write a staff briefing introducing our new approach to AI tools in the classroom.',
  'Create a governor report summary on our SEND provision outcomes this academic year.',
  'Draft talking points for a parent information evening about AI and online safety in school.',
  'Write a school improvement plan section focused on closing the disadvantaged pupil attainment gap using AI-assisted teaching.',
  'Summarise this Ofsted framework section [paste text] into 5 practical actions for our leadership team.',
];

const SECTIONS = [
  {
    label: 'AI Policy',
    title: 'AI and digital policy prompts',
    prompts: [SLT_PROMPTS[0], SLT_PROMPTS[1]],
  },
  {
    label: 'Governance & Reporting',
    title: 'Governor reports and SEND outcomes',
    prompts: [SLT_PROMPTS[2]],
  },
  {
    label: 'Parent Communications',
    title: 'Parent and community communications',
    prompts: [SLT_PROMPTS[3]],
  },
  {
    label: 'School Improvement',
    title: 'School improvement and strategy',
    prompts: [SLT_PROMPTS[4]],
  },
  {
    label: 'Ofsted Preparation',
    title: 'Ofsted prep and self-evaluation',
    prompts: [SLT_PROMPTS[5]],
  },
  {
    label: 'Staff Communication',
    title: 'Staff briefings and CPD communications',
    prompts: [SLT_PROMPTS[1]],
  },
  {
    label: 'Quick Wins',
    title: 'All leadership prompts',
    prompts: SLT_PROMPTS,
  },
];

const PromptsSchoolLeaders = () => (
  <>
    <SEO
      title="AI Prompts for School Leaders | GetPromptly"
      description="From strategy to staff comms — use AI to lead more effectively and reclaim time for what matters. Free prompts for UK school leaders."
      keywords="AI prompts school leaders, headteacher prompts, Ofsted AI prompts, school improvement prompts, SLT prompts"
      path="/prompts/school-leaders"
    />

    {/* Hero */}
    <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/prompts" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a]" style={{ color: '#9ca3af' }}>
          ← AI Prompts
        </Link>
        <SectionLabel>For School Leaders</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
          AI Prompts for School Leaders
        </h1>
        <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
          From strategy to staff comms — use AI to lead more effectively and reclaim time for what matters.
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
            to="/ai-training/leaders"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
            style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
          >
            AI Training for Leaders
          </Link>
        </div>
      </div>
    </section>

    {/* Sections (skip the 'Quick Wins' all-in-one at the end for page clarity) */}
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
              <PromptCard key={i} prompt={prompt} packTitle="School Leader Prompts" index={i} />
            ))}
          </div>
        </div>
      </section>
    ))}

    {/* Agent CTA */}
    <section className="px-5 sm:px-8 py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <AgentCTA context="Tell the Promptly AI about your school context — size, phase, current challenges — for tailored leadership prompts." />
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
            <strong style={{ color: '#1c1a15' }}>Important:</strong> These prompts support strategic thinking and communication. They do not constitute legal, HR or Ofsted advice. Always verify outputs against current statutory guidance and school policy.
          </p>
        </div>
      </div>
    </section>

    {/* Cross-links */}
    <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
      <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
        <Link to="/safety-methodology" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>Safety Methodology →</Link>
        <Link to="/ai-training/leaders" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Training for Leaders →</Link>
        <Link to="/tools" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Tools Directory →</Link>
      </div>
    </section>
  </>
);

export default PromptsSchoolLeaders;
