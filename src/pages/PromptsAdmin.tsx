import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import AgentCTA from '../components/prompts/AgentCTA';
import MonetisationBanner from '../components/prompts/MonetisationBanner';

const ADMIN_PROMPTS = [
  'Draft a formal letter to parents about a change to the school day timetable from [date].',
  'Create a professional absence notification template for staff to complete when reporting sick leave.',
  'Write a data protection-friendly script I can use when parents phone asking for information about another pupil.',
  'Summarise this meeting [paste notes] into a formal set of minutes with action points and owners.',
  'Create a structured email template for following up with parents about persistent absence.',
  'Draft a new staff welcome message from the headteacher for our September induction week.',
];

const SECTIONS = [
  {
    label: 'Parent Letters',
    title: 'Formal parent letters and notices',
    prompts: [ADMIN_PROMPTS[0], ADMIN_PROMPTS[4]],
  },
  {
    label: 'Staff Templates',
    title: 'Staff communication templates',
    prompts: [ADMIN_PROMPTS[1], ADMIN_PROMPTS[5]],
  },
  {
    label: 'Data Protection',
    title: 'GDPR and data protection scripts',
    prompts: [ADMIN_PROMPTS[2]],
  },
  {
    label: 'Meeting Minutes',
    title: 'Meeting minutes and action logs',
    prompts: [ADMIN_PROMPTS[3]],
  },
  {
    label: 'Attendance',
    title: 'Attendance and absence follow-up',
    prompts: [ADMIN_PROMPTS[4]],
  },
  {
    label: 'Staff Welcome',
    title: 'New staff onboarding communications',
    prompts: [ADMIN_PROMPTS[5]],
  },
];

const PromptsAdmin = () => (
  <>
    <SEO
      title="AI Prompts for School Admin | GetPromptly"
      description="From letters to data entry — use AI to handle routine school admin faster and more accurately. Free prompts for school admin staff."
      keywords="AI prompts school admin, school letter templates, meeting minutes AI, absence letter template, school communication prompts"
      path="/prompts/admin"
    />

    {/* Hero */}
    <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/prompts" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a]" style={{ color: '#9ca3af' }}>
          ← AI Prompts
        </Link>
        <SectionLabel>For School Admin</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
          AI Prompts for School Admin and Support Staff
        </h1>
        <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
          From letters to data entry — use AI to handle routine school admin faster and more accurately.
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
            to="/ai-training"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
            style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
          >
            AI Training
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
              <PromptCard key={i} prompt={prompt} packTitle="Admin Prompts" index={i} />
            ))}
          </div>
        </div>
      </section>
    ))}

    {/* Agent CTA */}
    <section className="px-5 sm:px-8 py-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <AgentCTA context="Tell the Promptly AI what letter, template or document you need and it will help you create it." />
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
            <strong style={{ color: '#1c1a15' }}>Important:</strong> Always review AI-generated letters and documents before sending. Ensure compliance with your school's data protection policy, GDPR obligations, and any applicable statutory requirements. AI outputs are a starting point — not a finished document.
          </p>
        </div>
      </div>
    </section>

    {/* Cross-links */}
    <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
      <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
        <Link to="/tools" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Tools Directory →</Link>
        <Link to="/ai-training" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Training →</Link>
      </div>
    </section>
  </>
);

export default PromptsAdmin;
