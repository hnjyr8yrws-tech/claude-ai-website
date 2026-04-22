import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import PackCard from '../components/prompts/PackCard';
import AgentCTA from '../components/prompts/AgentCTA';
import { PROMPT_PACKS } from '../data/prompts';

const STUDENT_PROMPTS = [
  'I have a GCSE essay on [topic] due tomorrow. Help me write a strong introduction in under 10 minutes.',
  'I can\'t start revising. Give me the smallest possible first task for [subject] right now.',
  'Explain [concept] to me like I\'ve never heard of it before, using a real-life example.',
  'I\'ve got 3 days before my [subject] exam. Build me a realistic revision plan I can actually follow.',
  'I\'m overwhelmed by my coursework. Help me break it into tiny steps and tell me what to do first.',
  'I got [mark] on my last essay. Help me understand what went wrong and how to improve it.',
];

const SECTIONS = [
  {
    label: 'Essay Help',
    title: 'Get your essay done',
    prompts: [STUDENT_PROMPTS[0]],
  },
  {
    label: 'Start Revising',
    title: 'Can\'t start? Start here.',
    prompts: [STUDENT_PROMPTS[1], STUDENT_PROMPTS[4]],
  },
  {
    label: 'Understand Anything',
    title: 'Understand any concept instantly',
    prompts: [STUDENT_PROMPTS[2]],
  },
  {
    label: 'Exam Prep',
    title: 'Exam revision plans that actually work',
    prompts: [STUDENT_PROMPTS[3]],
  },
  {
    label: 'Improve Your Work',
    title: 'Learn from your results',
    prompts: [STUDENT_PROMPTS[5]],
  },
  {
    label: 'Coursework',
    title: 'Tackle big coursework projects',
    prompts: [STUDENT_PROMPTS[4]],
  },
];

const FEATURED_PACK_IDS = [1, 2, 3, 7, 16, 17, 19, 23];

const PromptsStudents = () => {
  const featuredPacks = FEATURED_PACK_IDS
    .map((id) => PROMPT_PACKS.find((p) => p.id === id))
    .filter(Boolean) as typeof PROMPT_PACKS;

  return (
    <>
      <SEO
        title="AI Prompts for Students | GetPromptly"
        description="Whether you're revising for GCSEs, struggling to start an essay or just trying to focus — there's a prompt for that. Free student prompts."
        keywords="AI prompts students, GCSE revision prompts, essay help AI, study prompts, exam prep prompts"
        path="/prompts/students"
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/prompts" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a]" style={{ color: '#9ca3af' }}>
            ← AI Prompts
          </Link>
          <SectionLabel>For Students</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
            AI Prompts That Actually Help You Study
          </h1>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
            Whether you're revising for GCSEs, struggling to start an essay or just trying to focus — there's a prompt for that.
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
              to="/ai-training/students"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
              style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
            >
              AI Tips for Students
            </Link>
          </div>
        </div>
      </section>

      {/* Quick access pills */}
      <section className="px-5 sm:px-8 py-4 border-b" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {SECTIONS.map((s) => (
              <a
                key={s.label}
                href={`#section-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
                style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.map((section, idx) => (
        <section
          key={section.label}
          id={`section-${section.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="px-5 sm:px-8 py-10 border-t"
          style={{ borderColor: '#e8e6e0', background: idx % 2 === 0 ? 'var(--bg)' : 'white' }}
        >
          <div className="max-w-3xl mx-auto">
            <SectionLabel>{section.label}</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.prompts.map((prompt, i) => (
                <PromptCard key={i} prompt={prompt} packTitle="Student Prompts" index={i} />
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
            Prompt packs built for students
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
          <AgentCTA context="Tell the Promptly AI your subject, year group and what you're struggling with for a personalised prompt." />
        </div>
      </section>

      {/* Trust note */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'var(--bg)', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
              <strong style={{ color: '#1c1a15' }}>A note on using AI for school work:</strong> AI can help you understand, plan and get unstuck — but always write your final work yourself. Check your school's policy on AI use before submitting. Never copy AI output directly into coursework or exams.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
          <Link to="/ai-training/students" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Tips for Students →</Link>
          <Link to="/tools" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Tools →</Link>
        </div>
      </section>
    </>
  );
};

export default PromptsStudents;
