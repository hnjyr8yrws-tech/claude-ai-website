import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { BubbleLayer } from '../components/Bubbles';
import AgentCTACard from '../components/AgentCTACard';
import LeadMagnet from '../components/LeadMagnet';
import { track } from '../utils/analytics';
import { useLeadCapture } from '../hooks/useLeadCapture';

// ── Promptly rebrand tokens (mirrors homepage / equipment) ────────────────────
const LIME   = '#BEFF00';
const CYAN   = '#00D1FF';
const PURPLE = '#A78BFA';
const YELLOW = '#FFEA00';
const INK      = '#0F1C1A';
const INK_SOFT = '#4A4A4A';
const BORDER   = '#ECE7DD';
const CREAM    = '#F8F5F0';

// Backwards-compat alias for legacy references throughout this file.
const TEAL = LIME;

const STATS = [
  { value: '50', label: 'Prompt Packs' },
  { value: '440+', label: 'Ready-to-Copy Prompts' },
  { value: '9', label: 'Subject Categories' },
  { value: '8', label: 'SEN Focus Areas' },
  { value: 'Claude, ChatGPT & Gemini', label: 'Works With' },
];

const ROLES = [
  {
    title: 'For Teachers',
    desc: 'Lesson planning, feedback, differentiation, marking and CPD prompts.',
    to: '/prompts/teachers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8h8M7 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'For School Leaders',
    desc: 'Strategy, staff communication, Ofsted prep, policy drafting and school improvement.',
    to: '/prompts/school-leaders',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 4l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'For SENCOs',
    desc: 'EHCP support, SEND reviews, parent letters, access arrangements and provision mapping.',
    to: '/prompts/senco',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 2L4 6v5c0 4.418 3.134 7.9 7 9 3.866-1.1 7-4.582 7-9V6l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'For Parents',
    desc: 'Homework help, revision support, communication with school and SEN advocacy.',
    to: '/prompts/parents',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 18c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 13c1.657 0 3 1.343 3 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'For Students',
    desc: 'Essay writing, revision, exam prep, study skills and focus techniques.',
    to: '/prompts/students',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 3L2 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 14l9 5 9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'For School Admin',
    desc: 'Letters, templates, timetabling, data and communication prompts.',
    to: '/prompts/admin',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8h6M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const COLLECTIONS = [
  { label: 'Most Popular', to: '/prompts/library' },
  { label: 'Best for GCSE Students', to: '/prompts/students' },
  { label: 'Best for Primary Teachers', to: '/prompts/teachers' },
  { label: 'Best for SEND Support', to: '/prompts/senco' },
  { label: 'Best for Busy Parents', to: '/prompts/parents' },
  { label: 'Free Resources', to: '/prompts/library' },
];

// ─── Ready-to-Use Prompt Packs ────────────────────────────────────────────────
//
// Seven role-specific packs. Each card carries:
//   • practical headline
//   • short benefit-driven description
//   • 3–4 realistic prompt examples (UK-school flavoured)
//   • inline email-capture CTA (LeadMagnet)
//
// Accent colours rotate through the Promptly rebrand palette so the packs read
// as a coherent set without going monochrome.

interface PromptPack {
  id: string;
  role: string;
  headline: string;
  desc: string;
  /** Hex accent used on the eyebrow + numbered chips + glow. */
  accent: string;
  /** Soft background tint for chips/badges (rgba of the same accent). */
  accentSoft: string;
  /** ascsubtag-style identifier sent with the lead capture. */
  offer: string;
  /** Submit-button label on the email form. */
  ctaLabel: string;
  /** Inbox-confirmation copy after submission. */
  successMessage: string;
  examples: string[];
}

const ROLE_PACKS: PromptPack[] = [
  {
    id: 'teachers',
    role: 'For classroom teachers',
    headline: 'Plan, mark and give feedback in half the time',
    desc: 'Lesson sequences, retrieval starters, whole-class feedback and parent updates that match your scheme of work and exam board.',
    accent: LIME,
    accentSoft: 'rgba(190,255,0,0.18)',
    offer: 'teacher-prompt-pack',
    ctaLabel: 'Send me the teacher pack →',
    successMessage: 'The teacher pack is on its way to your inbox.',
    examples: [
      'Build a 5-lesson sequence on [topic] for Year [X], aligned to [exam board] and ending with a 30-minute formative assessment. Include retrieval starters, a misconception checkpoint and one stretch task per lesson.',
      'I marked 28 GCSE essays on [topic]. The three biggest weaknesses were [A], [B], [C]. Generate a whole-class feedback slide with model paragraphs and a 15-minute redraft task.',
      'Adapt this [tier-3 vocabulary list / reading passage / problem set] for a Year [X] class with two EAL learners (early intermediate) and one student with dyslexia. Keep the cognitive demand high.',
      'Rewrite this email to a parent about [behaviour / progress concern] so it is professional, factual, leads with a strength, and ends with a clear next step the parent can take this week.',
    ],
  },
  {
    id: 'leaders',
    role: 'For school leaders',
    headline: 'Lead AI rollout safely without burning a term of staff time',
    desc: 'Policy drafts, governor briefings, KCSIE-aware risk assessments and INSET sessions you can ship this half-term.',
    accent: CYAN,
    accentSoft: 'rgba(0,209,255,0.16)',
    offer: 'leader-prompt-pack',
    ctaLabel: 'Send me the leadership pack →',
    successMessage: 'The leadership pack is on its way to your inbox.',
    examples: [
      'Draft a one-page AI acceptable-use policy for staff, mapped to KCSIE 2025 and UK GDPR. Include three named risks and the mitigation each. Plain English, no legalese.',
      'Write a 10-minute governor briefing on AI in our school. Cover what is working, two safeguarding risks we are managing, and what we will review at the next FGB.',
      'Build a single-side INSET handout that teaches staff three Claude prompts they can use tomorrow morning, plus the one thing they must never paste into AI.',
      'Plan a phased AI rollout across this academic year — September baseline, January checkpoint, summer review — with named owners (SLT, DSL, IT lead) and the data we will track.',
    ],
  },
  {
    id: 'senco',
    role: 'For SENCOs',
    headline: 'Cut SEND paperwork — keep your professional judgement',
    desc: 'Annual-review prep, EHCP-aligned strategy sheets, access-arrangements evidence and parent letters that read like a SENCO wrote them.',
    accent: PURPLE,
    accentSoft: 'rgba(167,139,250,0.18)',
    offer: 'senco-prompt-pack',
    ctaLabel: 'Send me the SENCO pack →',
    successMessage: 'The SENCO pack is on its way to your inbox.',
    examples: [
      'Summarise these three teacher observation notes into neutral, factual annual-review prep for a Year [X] pupil with [primary need]. Flag any contradictions between observations.',
      'Generate five concrete classroom strategies for a learner with [profile — e.g. ADHD + working memory difficulty]. Map each strategy to a specific lesson moment, not a general principle.',
      'Draft an access-arrangements evidence summary from these JCQ Form 8 notes and assessor scores. Highlight which exam-board criteria each piece of evidence satisfies.',
      'Rewrite this letter to parents about an EP referral so it is empathetic, jargon-free, explains what happens next, and includes the school SENCO contact.',
    ],
  },
  {
    id: 'subject-leads',
    role: 'For subject leads & HoDs',
    headline: 'Run your department like the year is half its length',
    desc: 'Schemes of work, learning walks, KS3-to-GCSE bridging, exam-board mapping and CPD audits — built for HoDs and curriculum leads.',
    accent: YELLOW,
    accentSoft: 'rgba(255,234,0,0.20)',
    offer: 'subject-leads-prompt-pack',
    ctaLabel: 'Send me the subject-leads pack →',
    successMessage: 'The subject-leads pack is on its way to your inbox.',
    examples: [
      'Audit my Year [X] scheme of work against [exam board] [subject] specification. Show me the three weakest topic-coverage gaps and a one-lesson fix for each.',
      'Plan a 20-minute learning walk for [subject]. Give me three look-fors per lesson phase (do-now, instruction, practice, plenary) and a debrief script for the team meeting.',
      'Write a KS3-to-KS4 bridging plan for [subject] showing how Year 9 builds the four skills tested most heavily in [exam board] Paper 1.',
      'Turn last summer\u2019s [subject] question-level analysis into three CPD priorities for the department, with a 15-minute INSET activity for each.',
    ],
  },
  {
    id: 'admin',
    role: 'For admin teams',
    headline: 'Knock out the inbox before first break',
    desc: 'Parent emails, attendance follow-ups, trip letters, meeting minutes and policy updates — clear, calm and school-appropriate.',
    accent: LIME,
    accentSoft: 'rgba(190,255,0,0.18)',
    offer: 'admin-prompt-pack',
    ctaLabel: 'Send me the admin pack →',
    successMessage: 'The admin pack is on its way to your inbox.',
    examples: [
      'Rewrite this parent email so it is firm, polite and evidence-based. Keep it under 120 words. Sign off with \u201CKind regards\u201D and an offer to call.',
      'Turn these head\u2019s meeting notes into a one-page action log: action, owner, deadline, status. Anything ambiguous, flag with [QUERY].',
      'Draft a Year [X] residential trip letter covering payment, kit list, medical form, behaviour expectations and safeguarding lead. Plain English, two reading-age levels lower than usual.',
      'Write an attendance-follow-up template for parents at the 90% threshold. Supportive tone first, escalation pathway in the second paragraph, named SAO contact at the bottom.',
    ],
  },
  {
    id: 'parents',
    role: 'For parents',
    headline: 'Help your child without doing it for them',
    desc: 'Homework explanations, revision routines, school communication and SEN advocacy — built for the household, not the lesson plan.',
    accent: CYAN,
    accentSoft: 'rgba(0,209,255,0.16)',
    offer: 'parent-prompt-pack',
    ctaLabel: 'Send me the parents pack →',
    successMessage: 'The parents pack is on its way to your inbox.',
    examples: [
      'Explain this Year [X] [subject] homework task in three steps a parent can use to coach — without giving the answer. End with one question I can ask to check understanding.',
      'Build a 25-minute weekday revision routine for a reluctant Year 11 student studying [subjects]. Include a five-minute warm-up, the focus block and a non-screen wind-down.',
      'Rewrite this email to my child\u2019s school about [issue] so it is firm, polite, evidence-based and ends with the specific outcome I am asking for.',
      'Write a one-page brief I can take to my child\u2019s annual review meeting. Cover what is working at home, what is not, and the two things I want documented in the next plan.',
    ],
  },
  {
    id: 'students',
    role: 'For students',
    headline: 'Study smarter — without shortcutting the learning',
    desc: 'Revision plans, essay coaching, exam practice and feedback reflection that build skill, not dependency.',
    accent: PURPLE,
    accentSoft: 'rgba(167,139,250,0.18)',
    offer: 'student-prompt-pack',
    ctaLabel: 'Send me the student pack →',
    successMessage: 'The student pack is on its way to your inbox.',
    examples: [
      'Build me a 14-day GCSE revision plan for [subjects], 90 minutes a night. Spread retrieval, past-paper practice and one weak-topic deep-dive per session. Sundays off.',
      'Ask me Socratic questions to push my essay argument on [topic]. Don\u2019t tell me the answer — challenge each claim and ask for evidence. Stop after five rounds.',
      'Turn this [exam-board] mark scheme into a checklist I can use to self-mark before submission. Plain language, no jargon.',
      'I got [grade] on this practice paper. Find the three skills I dropped most marks on and give me one 20-minute drill per skill for tomorrow.',
    ],
  },
];

const STEPS = [
  { n: '01', title: 'Choose your role', desc: 'Pick the section that matches you — teacher, parent, student, SENCO or school leader.' },
  { n: '02', title: 'Browse or search', desc: 'Filter by category, SEN focus area or key stage to find the right pack instantly.' },
  { n: '03', title: 'Copy the prompt', desc: 'Hit the copy button and paste straight into Claude, ChatGPT, Gemini or Perplexity.' },
  { n: '04', title: 'Adapt for your context', desc: 'Replace the bracketed placeholders — [topic], [child\'s name], [year group] — with your own details.' },
  { n: '05', title: 'Get better results', desc: 'Use the Promptly AI agent for a personalised prompt tailored to your exact situation.' },
];

/**
 * ExpandablePackCard — collapsed-by-default card representing one Ready-to-Use
 * Prompt Pack. On expand it reveals:
 *   • 3–4 realistic, role-specific prompt examples
 *   • an inline email-capture LeadMagnet so visitors can have the full pack sent
 *
 * Accent colour rotates per pack (LIME / CYAN / PURPLE / YELLOW) using the
 * Promptly rebrand palette, while typography and spacing stay consistent.
 *
 * Accessibility:
 *   • Toggle is a real <button> with aria-expanded + aria-controls.
 *   • Panel uses role="region" and is labelled by the toggle button.
 *   • prefers-reduced-motion is respected via the global CSS rule in
 *     src/index.css (transitions clamped to 0.01ms) plus Framer Motion's own
 *     reduced-motion handling.
 */
function ExpandablePackCard({ pack }: { pack: PromptPack }) {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const panelId  = `pack-panel-${pack.id}-${reactId}`;
  const buttonId = `pack-toggle-${pack.id}-${reactId}`;

  const handleToggle = () => {
    setOpen(o => {
      const next = !o;
      // Fire analytics on first expand only (the click matters, not the close).
      if (next) {
        track({ name: 'prompt_pack_view', packSlug: pack.id });
        track({
          name: 'cta_clicked',
          section: `prompts-hub-pack-${pack.id}`,
          label: 'expand',
        });
      }
      return next;
    });
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col"
      data-pack-card
      data-pack-slug={pack.id}
      style={{
        borderColor: open ? pack.accent : BORDER,
        background: 'white',
        boxShadow: open
          ? `0 0 0 1px ${pack.accentSoft}, 0 12px 32px rgba(15,28,26,0.10)`
          : '0 1px 0 rgba(255,255,255,0.8) inset, 0 6px 18px rgba(15,28,26,0.05)',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
      }}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className="text-left p-5 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: INK }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: pack.accent, boxShadow: `0 0 0 3px ${pack.accentSoft}` }}
                aria-hidden="true"
              />
              {pack.role}
            </p>
            <h3 className="font-display text-lg leading-snug" style={{ color: INK }}>
              {pack.headline}
            </h3>
          </div>
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base font-bold"
            style={{
              background: open ? pack.accent : CREAM,
              color: INK,
              border: `1px solid ${open ? pack.accent : BORDER}`,
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease, background 200ms ease',
            }}
            aria-hidden="true"
          >
            +
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>
          {pack.desc}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: pack.accentSoft,
              color: INK,
              border: `1px solid ${pack.accent}`,
            }}
          >
            {pack.examples.length} example prompts
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: CREAM, color: INK_SOFT, border: `1px solid ${BORDER}` }}
          >
            Free pack
          </span>
        </div>

        <p className="text-[11px] font-semibold mt-1" style={{ color: open ? INK : '#9C9690' }}>
          {open ? '— Tap to collapse' : 'Tap to see example prompts \u2192'}
        </p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${BORDER}`, background: CREAM }}
          >
            <div className="p-5 flex flex-col gap-5">
              {/* Example prompts */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: INK_SOFT }}>
                  Example prompts
                </h4>
                <ol className="flex flex-col gap-2.5" role="list">
                  {pack.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="rounded-xl border p-3 text-sm leading-relaxed flex gap-3"
                      style={{ background: 'white', borderColor: BORDER, color: INK }}
                    >
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                        style={{ background: pack.accentSoft, color: INK, border: `1px solid ${pack.accent}` }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1">{ex}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Inline email-capture CTA */}
              <LeadMagnet
                variant="light"
                eyebrow="Free prompt pack"
                headline={pack.ctaLabel}
                description={
                  <>
                    Send the full <strong>{pack.role.replace(/^For\s+/i, '')}</strong> pack — every prompt above plus the
                    expanded versions, with editable variables ready to drop into Claude, ChatGPT or Gemini.
                  </>
                }
                buttonLabel="Email it to me →"
                successMessage={pack.successMessage}
                analyticsSection={`prompts-hub-pack-${pack.id}`}
                offer={pack.offer}
                role={pack.role.replace(/^For\s+/i, '')}
                analyticsMeta={{ pack: pack.id, examples: pack.examples.length }}
                inputIdSuffix={`pack-${pack.id}`}
                trustNote="No spam. UK GDPR compliant. One follow-up if it’s useful."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PromptsHub = () => {
  const [freePackEmail, setFreePackEmail] = useState('');
  const { submit: submitFreePack, status: freePackStatus, error: freePackError } = useLeadCapture();
  const freePackSending = freePackStatus === 'sending';
  const freePackSent    = freePackStatus === 'success';
  const freePackErrored = freePackStatus === 'error';

  const handleWidgetClick = () => {
    const trigger = document.getElementById('promptly-widget-trigger');
    if (trigger) trigger.click();
  };

  const handleFreePackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFreePack({
      email:  freePackEmail,
      offer:  'free-prompt-pack',
      source: 'prompts-hub-hero',
    });
  };

  return (
    <>
      <SEO
        title="440+ AI Prompts for UK Education | GetPromptly"
        description="Free AI prompts for teachers, parents, students, SENCOs and school leaders. Copy-ready prompts for Claude, ChatGPT and Gemini."
        keywords="AI prompts UK education, teacher prompts, SENCO prompts, GCSE revision prompts, SEN prompts, ChatGPT prompts school"
        path="/prompts"
      />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-5 sm:px-8 pt-20 pb-16"
        style={{ background: 'linear-gradient(180deg, #0F1C1A 0%, #142522 60%, #1B302C 100%)' }}
      >
        <BubbleLayer
          bubbles={[
            { variant: 'lime',        size: 220, top: '-40px',  left: '-60px',  anim: 'gp-float-a' },
            { variant: 'cyan',        size: 180, top: '20px',   right: '-40px', anim: 'gp-float-b' },
            { variant: 'soft-purple', size: 260, bottom: '-90px', left: '40%',  anim: 'gp-float-c' },
          ]}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <SectionLabel variant="dark">AI Prompts Library</SectionLabel>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-5 mt-3"
            style={{ color: '#FFFFFF' }}
          >
            440+ Ready-to-Use AI Prompts for{' '}
            <span
              className="italic"
              style={{
                backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              UK Education
            </span>
          </h1>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            For teachers, parents, students, SENCOs and school leaders. Copy, adapt and use instantly with Claude, ChatGPT or Gemini.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/prompts/library"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                color: '#0F1C1A',
                boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 8px 24px rgba(190,255,0,0.25)',
              }}
            >
              Browse All 50 Packs
            </Link>
            <button
              onClick={handleWidgetClick}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Get Instant Prompt Help
            </button>
          </div>
        </div>

        {/* Stats — sits inside hero on dark bg with multi-colour cards */}
        <div className="relative max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-12">
          {STATS.map((s, i) => {
            const accents = ['#BEFF00', '#00D1FF', '#A78BFA', '#FFEA00', '#BEFF00'] as const;
            const accent = accents[i % accents.length];
            return (
              <div
                key={s.label}
                className="text-center p-4 rounded-2xl border"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: 'rgba(255,255,255,0.10)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                <div className="font-display text-2xl font-bold mb-1" style={{ color: accent }}>
                  {s.value}
                </div>
                <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Agent CTA ── */}
      <section className="px-5 sm:px-8 py-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <AgentCTACard
            section="Promptly AI · Prompt Personaliser"
            headline="Create a prompt pack for my situation."
            description="Tell us your role, subject and what you need — our AI will craft the right prompts for you to copy and use instantly."
            prompts={[
              "Give me a differentiated lesson plan prompt for Year 9 English",
              "I'm a SENCO — show me EHCP review prompts",
              "Help me write a parent email about a behaviour concern",
              "Give my GCSE student a revision prompt for tomorrow's exam",
            ]}
            analyticsSection="prompts"
          />
        </div>
      </section>

      {/* Role entry grid */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Find Your Prompts</SectionLabel>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>Choose your role</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group flex flex-col gap-3 p-5 rounded-2xl border bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                style={{ borderColor: '#ECE7DD' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: 'rgba(190,255,0,0.14)', color: '#0F1C1A' }}
                >
                  <span>{r.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1 group-hover:text-[#BEFF00] transition-colors" style={{ color: 'var(--text)' }}>
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>{r.desc}</p>
                </div>
                <span className="text-sm font-medium mt-auto" style={{ color: '#BEFF00' }}>
                  View prompts →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="px-5 sm:px-8 py-10 border-y" style={{ background: 'white', borderColor: '#ECE7DD' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#9ca3af' }}>Collections</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors hover:border-[#BEFF00] hover:text-[#BEFF00] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BEFF00]"
                style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text)' }}>From prompt to result in seconds</h2>
          </div>
          <ol className="space-y-4" role="list">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-4 p-4 rounded-xl bg-white border" style={{ borderColor: '#ECE7DD' }}>
                <span
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'rgba(190,255,0,0.18)', color: '#0F1C1A' }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: '#4A4A4A' }}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust note */}
      <section className="px-5 sm:px-8 py-8" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: '#ECE7DD', background: '#F8F5F0' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
              <strong style={{ color: '#1A1A1A' }}>Important:</strong> These prompts support educators, families and learners. They do not replace professional teacher judgment, SEN support plans, EHCPs or clinical advice. Always adapt for the individual child's needs and school context.
            </p>
          </div>
        </div>
      </section>

      {/* Ready-to-Use Prompt Packs */}
      <section className="px-5 sm:px-8 py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start mb-10">
            <div>
              <SectionLabel>Ready-to-Use Prompt Packs</SectionLabel>
              <h2 className="font-display text-3xl mt-2 mb-3" style={{ color: 'var(--text)' }}>
                Practical prompts for the work educators actually do.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#4A4A4A' }}>
                Seven role-specific packs covering planning &amp; feedback, leadership &amp; policy, SEND, subject-leadership, admin, parents and students. Open a pack to see realistic example prompts.
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#4A4A4A' }}>
                {[
                  'Tested by UK teachers — works in Claude, ChatGPT and Gemini',
                  'Editable variables — drop in your year-group, subject and pupil context',
                  'KCSIE 2025 + UK GDPR aware — safe to use in school',
                  'New packs every month — emailed straight to you',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-[#0F1C1A] font-bold flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: '#ECE7DD', background: 'white' }}>
              <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text)' }}>Start with the free pack</h3>
              <p className="text-sm mb-3" style={{ color: '#4A4A4A' }}>We'll email a role-specific starter pack you can copy into Claude, ChatGPT or Gemini today.</p>
              {freePackSent ? (
                <p className="text-sm font-semibold py-2" style={{ color: TEAL }}>✓ Check your inbox — pack sent!</p>
              ) : (
                <form onSubmit={handleFreePackSubmit} className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="free-pack-email" className="sr-only">Email address</label>
                  <input
                    id="free-pack-email"
                    type="email"
                    value={freePackEmail}
                    onChange={e => setFreePackEmail(e.target.value)}
                    placeholder="Your school email"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[#BEFF00]"
                    style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: 'var(--text)' }}
                  />
                  <button
                    type="submit"
                    disabled={freePackSending}
                    className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                    style={{
                      background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                      color: '#0F1C1A',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 6px 16px rgba(190,255,0,0.22)',
                    }}
                  >
                    {freePackSending ? 'Sending…' : 'Get your free prompt pack'}
                  </button>
                </form>
              )}
              {freePackErrored && (
                <p className="text-xs mt-2" role="alert" style={{ color: '#dc2626' }}>
                  {freePackError ?? 'Could not send.'}{' '}
                  <a href="mailto:info@getpromptly.co.uk" className="underline font-semibold">info@getpromptly.co.uk</a>{' '}
                  will reply by hand.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLE_PACKS.map(pack => (
              <ExpandablePackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Cross-sell strip — promotional dark band ── */}
      <section
        className="relative overflow-hidden px-5 sm:px-8 py-14"
        style={{ background: 'linear-gradient(180deg, #0F1C1A 0%, #1B302C 100%)' }}
      >
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Also from GetPromptly
            </p>
            <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#FFFFFF' }}>
              Prompts get you started — these get you further.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'AI Tools Directory',  desc: '243 tools, every one safety-scored against KCSIE 2025.',  to: '/tools',       accent: '#BEFF00' },
              { label: 'Equipment & Gear',    desc: 'Assistive tech, AAC, classroom hardware, SEND-friendly.', to: '/ai-equipment', accent: '#00D1FF' },
              { label: 'AI Training',         desc: '76 free + paid pathways for every UK education role.',    to: '/ai-training',  accent: '#A78BFA' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group p-5 rounded-2xl border transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: 'rgba(255,255,255,0.10)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                <p className="font-display text-lg mb-1 transition-colors" style={{ color: item.accent }}>{item.label} →</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PromptsHub;
