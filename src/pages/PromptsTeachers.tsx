import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import PromptCard from '../components/prompts/PromptCard';
import PackCard from '../components/prompts/PackCard';
import MonetisationBanner from '../components/prompts/MonetisationBanner';
import AgentCTA from '../components/prompts/AgentCTA';
import { PROMPT_PACKS } from '../data/prompts';

const TEACHER_PROMPTS = [
  'Write a differentiated lesson plan for [topic] at [key stage] with adaptations for dyslexia, ADHD and autism.',
  'Give me 5 ways to present [concept] using multi-sensory techniques for a Year 8 mixed-ability class.',
  'Write a strengths-based parent communication about a student who is struggling with [specific difficulty].',
  'Create a 3-week SEN-aware revision scheme of work for [subject] at GCSE level.',
  'Write exam-style feedback for this student paragraph [paste text] that is specific, kind and actionable.',
  'Summarise my lesson observations into professional CPD reflection notes.',
];

const SECTIONS = [
  {
    label: 'Quick Wins',
    title: 'Fast, high-impact teacher prompts',
    prompts: TEACHER_PROMPTS.slice(0, 5),
  },
  {
    label: 'Lesson Planning',
    title: 'Lesson planning prompts',
    prompts: [
      TEACHER_PROMPTS[0],
      TEACHER_PROMPTS[1],
    ],
    packIds: [5, 8],
  },
  {
    label: 'Marking & Feedback',
    title: 'Marking and feedback prompts',
    prompts: [
      TEACHER_PROMPTS[4],
      'Create a pupil-friendly summary of targets after a marked essay for a student with dyslexia.',
    ],
  },
  {
    label: 'Differentiation',
    title: 'Differentiation prompts',
    prompts: [
      TEACHER_PROMPTS[1],
    ],
    packIds: [6, 7],
  },
  {
    label: 'Parent Communication',
    title: 'Communication with parents',
    prompts: [TEACHER_PROMPTS[2]],
  },
  {
    label: 'CPD & Reflection',
    title: 'CPD and professional reflection',
    prompts: [TEACHER_PROMPTS[5]],
  },
];

const PromptsTeachers = () => {
  const allTeacherPacks = PROMPT_PACKS.filter((p) => p.roles.includes('Teachers')).slice(0, 6);

  return (
    <>
      <SEO
        title="AI Prompts for Teachers | GetPromptly"
        description="Save time on planning, feedback, marking and admin — use AI more confidently in your classroom. Free prompts for UK teachers."
        keywords="AI prompts teachers, lesson planning prompts, SEN teacher prompts, feedback prompts, differentiation prompts"
        path="/prompts/teachers"
      />

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-16 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/prompts" className="inline-flex items-center gap-1 text-sm mb-4 transition-colors hover:text-[#00808a]" style={{ color: '#9ca3af' }}>
            ← AI Prompts
          </Link>
          <SectionLabel>For Teachers</SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4" style={{ color: 'var(--text)' }}>
            AI Prompts Built for UK Teachers
          </h1>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ color: '#6b6760' }}>
            Save time on planning, feedback, marking and admin — use AI more confidently in your classroom.
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
              to="/ai-training/teachers"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:border-[#00808a] hover:text-[#00808a]"
              style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
            >
              AI Training for Teachers
            </Link>
          </div>
        </div>
      </section>

      {/* Prompt sections */}
      {SECTIONS.map((section) => (
        <section key={section.label} className="px-5 sm:px-8 py-10 border-t" style={{ borderColor: '#e8e6e0', background: section.label === 'Quick Wins' ? 'white' : 'var(--bg)' }}>
          <div className="max-w-3xl mx-auto">
            <SectionLabel>{section.label}</SectionLabel>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              {section.title}
            </h2>
            <div className="space-y-3 mb-6">
              {section.prompts.map((prompt, i) => (
                <PromptCard key={i} prompt={prompt} packTitle="Teacher Prompts" index={i} />
              ))}
            </div>
            {section.packIds && section.packIds.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {section.packIds
                  .map((id) => PROMPT_PACKS.find((p) => p.id === id))
                  .filter(Boolean)
                  .map((pack) => pack && <PackCard key={pack.id} pack={pack} />)}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Pack recommendations */}
      <section className="px-5 sm:px-8 py-12 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Recommended Packs</SectionLabel>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            Prompt packs for teachers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allTeacherPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <section className="px-5 sm:px-8 py-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <AgentCTA context="Tell the Promptly AI about your class, subject and any specific SEN needs for a tailored teacher prompt." />
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
              <strong style={{ color: '#1c1a15' }}>Important:</strong> These prompts support teacher practice but do not replace professional judgment, safeguarding duties, or school policy. Always adapt for your school context and the individual needs of students.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="px-5 sm:px-8 py-8 border-t" style={{ background: 'white', borderColor: '#e8e6e0' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-3">
          <Link to="/ai-training/teachers" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Training for Teachers →</Link>
          <Link to="/tools" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>AI Tools Directory →</Link>
          <Link to="/safety-methodology" className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:border-[#00808a] hover:text-[#00808a]" style={{ borderColor: '#e8e6e0', color: '#6b6760' }}>Safety Methodology →</Link>
        </div>
      </section>
    </>
  );
};

export default PromptsTeachers;
