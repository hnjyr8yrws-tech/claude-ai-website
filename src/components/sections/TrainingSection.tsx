/**
 * TrainingSection.tsx — AI Training Hub
 * "From curious to confident — AI training for every role in education."
 *
 * Data    : 26 resources from getpromptly training master base
 * Layout  : Cream bg · lime wave lines · role cards · programmes grid
 * Style   : Playfair Display headings · coral CTAs · clean white cards
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────

const CORAL = '#F05A4A';
const LIME  = '#84CC16';

// ── Wave background ────────────────────────────────────────────────────────

const WaveLines: FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1200 900"
    fill="none"
    style={{ opacity: 0.12 }}
  >
    {Array.from({ length: 22 }, (_, i) => (
      <path
        key={i}
        d={`M-100 ${46 + i * 40} Q300 ${12 + i * 40} 600 ${46 + i * 40} T1300 ${46 + i * 40}`}
        stroke={LIME}
        strokeWidth="1.3"
      />
    ))}
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────

type Role = 'All' | 'Schools & Admin' | 'Teachers' | 'Parents & Carers' | 'Students' | 'SEND';
type Level = 'Beginner' | 'Intermediate' | 'Advanced';

interface Programme {
  id: number;
  title: string;
  provider: string;
  logo: string;
  roles: Role[];           // empty means show under all
  description: string;
  level: Level;
  levelLabel: string;      // raw label from spreadsheet
  cost: string;
  isFree: boolean;
  affiliate: boolean;
  cta: string;
  url: string;
  badge?: string;
}

// ── Role cards ─────────────────────────────────────────────────────────────

const ROLE_CARDS: {
  id: Role;
  emoji: string;
  label: string;
  desc: string;
  bg: string;
  accent: string;
}[] = [
  { id: 'Schools & Admin',   emoji: '🏫', label: 'Schools & Admin',   desc: 'Lead AI adoption, write policy, and manage staff CPD.',          bg: '#CFE6F3', accent: '#1D4ED8' },
  { id: 'Teachers',          emoji: '👩‍🏫', label: 'Teachers',          desc: 'Save hours on planning, feedback, and resources with AI.',       bg: '#DDEFD2', accent: '#15803D' },
  { id: 'Parents & Carers',  emoji: '👨‍👧', label: 'Parents & Carers',  desc: 'Understand the AI your child uses and keep them safe online.',   bg: '#F3E7A2', accent: '#92400E' },
  { id: 'Students',          emoji: '🧑‍🎓', label: 'Students',          desc: 'Use AI ethically, responsibly, and to boost your studies.',      bg: '#EBC3C8', accent: '#9F1239' },
  { id: 'SEND',              emoji: '♿', label: 'SEND',              desc: 'Discover assistive AI tools for inclusive learning.',             bg: '#D9D2F4', accent: '#6D28D9' },
];

// ── Training data (exact from master spreadsheet) ──────────────────────────
// roles: [] = show under every filter tab

const PROGRAMMES: Programme[] = [
  // ── UK Government & Official ──
  {
    id: 1,
    title: 'AI Skills Hub',
    provider: 'UK Government',
    logo: '🇬🇧',
    roles: [],
    description: "The UK Government's central AI learning hub — curated courses, tools, and pathways for adults at every skill level. The best starting point for any UK learner.",
    level: 'Beginner',
    levelLabel: 'Beginner–Intermediate',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.gov.uk/ai-skills-hub',
    badge: 'UK Government',
  },
  {
    id: 2,
    title: 'Skills Toolkit',
    provider: 'UK Government',
    logo: '🛠️',
    roles: [],
    description: 'Government-backed free digital skills platform helping anyone build AI and technology competencies at their own pace — no experience needed.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://nationalcareers.service.gov.uk/find-a-course/skills-toolkit',
  },
  {
    id: 3,
    title: 'National Careers Service',
    provider: 'UK Government',
    logo: '🎯',
    roles: [],
    description: 'Free careers support including access to government-funded AI bootcamps — ideal for adults looking to upskill, retrain, or move into an AI-adjacent role.',
    level: 'Beginner',
    levelLabel: 'All levels',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://nationalcareers.service.gov.uk/',
  },
  {
    id: 4,
    title: 'AI in Education Support',
    provider: 'GOV.UK / DfE',
    logo: '🏫',
    roles: ['Teachers', 'Schools & Admin'],
    description: 'Official DfE guidance and self-paced modules on the safe, responsible use of generative AI in UK schools — including policy templates and real classroom case studies.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.gov.uk/government/publications/generative-ai-in-education',
    badge: 'DfE Official',
  },
  // ── Students & Educators ──
  {
    id: 5,
    title: 'OpenLearn AI',
    provider: 'Open University',
    logo: '📚',
    roles: ['Students', 'Teachers'],
    description: 'Free university-quality AI learning from The Open University — accessible, rigorous, and designed around UK educational standards. Earn a statement of participation.',
    level: 'Beginner',
    levelLabel: 'Beginner–Intermediate',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.open.edu/openlearn/',
    badge: 'OU Backed',
  },
  {
    id: 6,
    title: 'FutureLearn AI',
    provider: 'FutureLearn',
    logo: '🌐',
    roles: ['Students', 'Teachers'],
    description: 'Explore AI and machine learning short courses from top UK and global universities. Free access to course content with the option to upgrade for a certificate.',
    level: 'Beginner',
    levelLabel: 'All levels',
    cost: 'Free to audit',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.futurelearn.com/subjects/it-and-computing-courses/ai-and-machine-learning',
  },
  {
    id: 7,
    title: 'Elements of AI',
    provider: 'University of Helsinki',
    logo: '⚡',
    roles: ['Students', 'Teachers', 'Parents & Carers'],
    description: "The world's most-taken free AI introduction. No maths required — just curiosity. Covers how AI works, its limitations, and its societal impact in a UK-relevant context.",
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.elementsofai.com/',
    badge: 'Most Popular',
  },
  {
    id: 8,
    title: 'Google AI Essentials',
    provider: 'Google',
    logo: '🎓',
    roles: ['Teachers', 'Schools & Admin'],
    description: "Google's free workplace AI skills course. Learn to write effective prompts, use AI tools confidently in daily tasks, and understand responsible AI use.",
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://grow.google/intl/uk_ie/courses-and-tools/',
    badge: 'Google Certified',
  },
  {
    id: 9,
    title: 'Microsoft Learn AI',
    provider: 'Microsoft',
    logo: '🪟',
    roles: ['Teachers', 'Schools & Admin'],
    description: 'Self-paced AI learning paths from Microsoft covering Copilot in Microsoft 365, Azure AI fundamentals, and responsible AI principles. Earns official Microsoft badges.',
    level: 'Beginner',
    levelLabel: 'Beginner–Intermediate',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://learn.microsoft.com/en-gb/training/',
    badge: 'Microsoft Badge',
  },
  {
    id: 10,
    title: 'IBM SkillsBuild',
    provider: 'IBM',
    logo: '💼',
    roles: ['Students'],
    description: "IBM's free platform offering AI foundations, data skills, and career starter certifications — designed for school leavers and career changers entering the tech industry.",
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://skillsbuild.org/',
  },
  {
    id: 11,
    title: 'Khan Academy AI',
    provider: 'Khan Academy',
    logo: '🏫',
    roles: ['Students'],
    description: 'Safe, curriculum-aligned AI learning for students via Khanmigo. Patient, step-by-step guidance with teacher oversight and no advertising.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.khanacademy.org/',
    badge: 'Education Focused',
  },
  {
    id: 12,
    title: 'Code.org AI',
    provider: 'Code.org',
    logo: '💡',
    roles: ['Students', 'Teachers'],
    description: 'School-friendly AI literacy resources and ready-made lesson activities designed for students aged 9–18. Fully free and curriculum-aligned.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://code.org/ai',
    badge: 'School Friendly',
  },
  // ── Parents ──
  {
    id: 13,
    title: 'Common Sense AI Guides',
    provider: 'Common Sense Media',
    logo: '👨‍👩‍👧',
    roles: ['Parents & Carers', 'Teachers'],
    description: 'Practical parent guides on understanding AI tools your child uses, content filters, age ratings, and having age-appropriate conversations about AI and safety.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.commonsense.org/education/topics/artificial-intelligence',
  },
  {
    id: 14,
    title: 'Internet Matters AI Guides',
    provider: 'Internet Matters',
    logo: '🛡️',
    roles: ['Parents & Carers'],
    description: "UK's leading online safety charity with parent-friendly AI guides — what AI tools children are using, the risks to know about, and practical steps to keep them safe.",
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.internetmatters.org/',
    badge: 'UK Safety',
  },
  // ── SEND / Accessibility ──
  {
    id: 15,
    title: 'AbilityNet AI Resources',
    provider: 'AbilityNet',
    logo: '♿',
    roles: ['SEND', 'Teachers', 'Schools & Admin'],
    description: 'Free guidance on using AI tools for accessibility — covering screen readers, voice AI, predictive text, and how to adapt AI tools for learners with disabilities.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://abilitynet.org.uk/',
    badge: 'Accessibility',
  },
  {
    id: 16,
    title: 'Microsoft Accessibility AI',
    provider: 'Microsoft',
    logo: '🪟',
    roles: ['SEND', 'Teachers'],
    description: "Microsoft's inclusive technology learning resources — AI tools designed for learners with disabilities, including Immersive Reader, Seeing AI, and Dictate.",
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Free',
    isFree: true,
    affiliate: false,
    cta: 'Start the course',
    url: 'https://www.microsoft.com/en-gb/ai/ai-for-accessibility',
    badge: 'Inclusive Tech',
  },
  // ── In-depth programmes (affiliate / paid) ──
  {
    id: 17,
    title: 'Udemy AI Courses',
    provider: 'Udemy',
    logo: '🎓',
    roles: [],
    description: 'Huge library of AI courses covering every skill level. Frequent sales bring prices to £10–£15. Lifetime access, self-paced, with certificate of completion.',
    level: 'Beginner',
    levelLabel: 'All levels',
    cost: '£10–£100',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.udemy.com/courses/search/?q=artificial+intelligence',
  },
  {
    id: 18,
    title: 'Coursera AI Courses',
    provider: 'Coursera',
    logo: '📖',
    roles: [],
    description: 'University-quality AI certificates from Stanford, Google, and DeepLearning.AI. Audit free or pay for a verified credential recognised by UK employers.',
    level: 'Beginner',
    levelLabel: 'Beginner–Advanced',
    cost: '£30–£400',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.coursera.org/browse/data-science/machine-learning',
    badge: 'Certificates Available',
  },
  {
    id: 19,
    title: 'Skillshare AI',
    provider: 'Skillshare',
    logo: '✏️',
    roles: ['Teachers', 'Parents & Carers'],
    description: 'Creative and beginner-friendly AI courses via subscription. Great for educators wanting quick, practical skills in design, writing, and productivity tools.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Subscription',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.skillshare.com/',
  },
  {
    id: 20,
    title: 'DataCamp AI',
    provider: 'DataCamp',
    logo: '📊',
    roles: ['Students', 'Schools & Admin'],
    description: 'Subscription-based platform for data science and AI — interactive coding exercises, guided projects, and career tracks from beginner to job-ready.',
    level: 'Beginner',
    levelLabel: 'All levels',
    cost: 'Subscription',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.datacamp.com/',
  },
  {
    id: 21,
    title: 'LinkedIn Learning AI',
    provider: 'LinkedIn',
    logo: '💼',
    roles: ['Teachers', 'Schools & Admin'],
    description: 'Business-focused AI courses included with LinkedIn Premium. Completion badges display directly on your LinkedIn profile — valued by UK employers.',
    level: 'Beginner',
    levelLabel: 'Beginner',
    cost: 'Subscription',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.linkedin.com/learning/',
  },
  {
    id: 22,
    title: 'DeepLearning.AI',
    provider: 'DeepLearning.AI / Coursera',
    logo: '🧠',
    roles: ['Teachers', 'Schools & Admin'],
    description: "Andrew Ng's world-class AI specialisations. Widely considered the gold standard for educators and professionals wanting a deep, rigorous understanding of AI.",
    level: 'Intermediate',
    levelLabel: 'Intermediate',
    cost: 'From £30/mo',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.deeplearning.ai/',
    badge: 'Industry Gold Standard',
  },
  {
    id: 23,
    title: 'Codecademy AI',
    provider: 'Codecademy',
    logo: '💻',
    roles: ['Students'],
    description: 'Interactive, browser-based AI and machine learning courses. Write real code in your browser from day one — ideal for students who learn best by doing.',
    level: 'Beginner',
    levelLabel: 'Beginner–Intermediate',
    cost: 'Subscription',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.codecademy.com/',
  },
  {
    id: 24,
    title: 'FutureLearn Paid AI',
    provider: 'FutureLearn',
    logo: '🌐',
    roles: ['Students', 'Teachers'],
    description: 'Upgrade from free course access to earn verified certificates from UK and global universities — increasingly recognised by schools and employers across the UK.',
    level: 'Beginner',
    levelLabel: 'All levels',
    cost: '£30–£200',
    isFree: false,
    affiliate: true,
    cta: 'Enrol now',
    url: 'https://www.futurelearn.com/',
    badge: 'University Certified',
  },
  {
    id: 25,
    title: 'General Assembly AI',
    provider: 'General Assembly',
    logo: '🏛️',
    roles: ['Schools & Admin'],
    description: 'Intensive AI bootcamp for career switchers and senior professionals. Designed for those moving into tech and data leadership roles — includes career services.',
    level: 'Advanced',
    levelLabel: 'Advanced',
    cost: '£1,000+',
    isFree: false,
    affiliate: false,
    cta: 'Enrol now',
    url: 'https://generalassemb.ly/',
    badge: 'Bootcamp',
  },
  {
    id: 26,
    title: 'BrainStation AI',
    provider: 'BrainStation',
    logo: '🔬',
    roles: ['Schools & Admin'],
    description: 'Premium AI and data science bootcamps with dedicated career services and employer connections. For serious career changers who want structured, intensive training.',
    level: 'Advanced',
    levelLabel: 'Advanced',
    cost: '£2,000+',
    isFree: false,
    affiliate: false,
    cta: 'Enrol now',
    url: 'https://brainstation.io/',
    badge: 'Premium Bootcamp',
  },
];

// ── Level colours ──────────────────────────────────────────────────────────

const LEVEL_STYLE: Record<Level, { bg: string; text: string }> = {
  Beginner:     { bg: '#DCFCE7', text: '#15803D' },
  Intermediate: { bg: '#DBEAFE', text: '#1D4ED8' },
  Advanced:     { bg: '#EDE9FE', text: '#6D28D9' },
};

// ── Programme card ─────────────────────────────────────────────────────────

const ProgrammeCard: FC<{ p: Programme; idx: number }> = ({ p, idx }) => {
  const lv = LEVEL_STYLE[p.level];
  const costStyle = p.isFree
    ? { bg: '#DCFCE7', text: '#15803D' }
    : { bg: '#FEF3C7', text: '#92400E' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.26 }}
      className="group bg-white rounded-2xl p-6 flex flex-col gap-4 relative"
      style={{ border: '1.5px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
      whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.09)' }}
    >
      {p.badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(240,90,74,0.09)', color: CORAL, border: '1px solid rgba(240,90,74,0.2)' }}
        >
          {p.badge}
        </span>
      )}

      {/* Logo + name */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#F8FAFC' }}>
          {p.logo}
        </div>
        <div className="min-w-0 pr-14">
          <h3 className="text-sm font-bold text-gray-900 leading-snug">{p.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{p.provider}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{p.description}</p>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: lv.bg, color: lv.text }}>
          {p.levelLabel}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: costStyle.bg, color: costStyle.text }}>
          {p.cost}
        </span>
        {p.isFree && (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: '#F0FDF4', color: '#15803D' }}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            UK Relevant
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background: CORAL, boxShadow: '0 2px 12px rgba(240,90,74,0.28)' }}
        >
          {p.cta} →
        </a>
      </div>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────

const TrainingSection: FC = () => {
  const [activeRole, setActiveRole] = useState<Role>('All');
  const [showAll,    setShowAll]    = useState(false);

  const filtered = PROGRAMMES.filter((p) =>
    activeRole === 'All' || p.roles.length === 0 || p.roles.includes(activeRole)
  );

  const INITIAL_SHOW = 9;
  const displayed = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const hasMore   = filtered.length > INITIAL_SHOW && !showAll;

  return (
    <section
      id="training"
      aria-labelledby="training-heading"
      className="relative w-full"
      style={{ background: '#F7FAF4', scrollMarginTop: '64px' }}
    >
      {/* Decorative layer clipped independently — keeps page scroll unblocked */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <WaveLines />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

        {/* ── Header ── */}
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-6"
            style={{ background: '#DDEFD2', color: '#166534' }}
          >
            AI Training Hub
          </span>
          <h2
            id="training-heading"
            style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", color: '#111827', lineHeight: 1.15 }}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold"
          >
            From curious to confident —
            <br />
            <span style={{ color: '#4D7C0F' }}>AI training</span> for every
            role in education.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            Select your role to explore curated UK resources — free to start,
            accredited when you&apos;re ready.
          </p>
        </motion.div>

        {/* ── Role cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {ROLE_CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => { setActiveRole(activeRole === card.id ? 'All' : card.id); setShowAll(false); }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col gap-2 p-5 rounded-2xl text-left transition-all"
              style={{
                background: activeRole === card.id ? card.bg : 'white',
                border: `1.5px solid ${activeRole === card.id ? card.accent + '33' : '#E5E7EB'}`,
                boxShadow: activeRole === card.id ? `0 4px 20px ${card.accent}18` : '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <span className="text-2xl">{card.emoji}</span>
              <div>
                <p className="text-xs font-bold leading-tight" style={{ color: activeRole === card.id ? card.accent : '#111827' }}>
                  {card.label}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">{card.desc}</p>
              </div>
              <span
                className="text-[10px] font-bold mt-1 self-start"
                style={{ color: activeRole === card.id ? card.accent : '#9CA3AF' }}
              >
                Browse →
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h3
              style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", color: '#111827' }}
              className="text-2xl sm:text-3xl font-bold"
            >
              Recommended in-depth programmes
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Showing <strong className="text-gray-700">{displayed.length}</strong> of{' '}
              <strong className="text-gray-700">{filtered.length}</strong> programmes
              {activeRole !== 'All' && (
                <> · filtered by <strong className="text-gray-700">{activeRole}</strong> ·{' '}
                  <button onClick={() => { setActiveRole('All'); setShowAll(false); }} className="font-bold underline" style={{ color: CORAL }}>
                    Clear
                  </button>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Free resources', bg: '#DCFCE7', text: '#15803D' },
              { label: 'In-depth programmes', bg: '#FEF3C7', text: '#92400E' },
            ].map((pill) => (
              <span key={pill.label} className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: pill.bg, color: pill.text }}>
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Programmes grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {displayed.length > 0 ? (
              displayed.map((p, idx) => <ProgrammeCard key={p.id} p={p} idx={idx} />)
            ) : (
              <motion.div className="col-span-full text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-4xl mb-3">📚</p>
                <p className="text-gray-500 font-medium">No programmes found for this role.</p>
                <button onClick={() => setActiveRole('All')} className="mt-3 text-sm font-bold underline" style={{ color: CORAL }}>
                  Show all programmes
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Load more ── */}
        {hasMore && (
          <div className="text-center mt-10">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAll(true)}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm"
              style={{ background: 'white', border: '1.5px solid #D1D5DB', color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              Show {filtered.length - INITIAL_SHOW} more programmes ↓
            </motion.button>
          </div>
        )}

        {/* ── Footer CTA ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-16 pt-12 border-t border-lime-200/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-sm font-bold text-gray-900">Want a programme added to the hub?</p>
            <p className="text-xs text-gray-500 mt-0.5">No paid placements. Every submission is independently reviewed before listing.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{ background: CORAL, boxShadow: '0 4px 20px rgba(240,90,74,0.35)' }}
            >
              Browse all programmes →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3.5 rounded-2xl font-semibold text-sm"
              style={{ background: 'white', border: '1.5px solid #D1D5DB', color: '#374151' }}
            >
              Suggest a resource
            </motion.button>
          </div>
        </motion.div>

        {/* ── Trust strip ── */}
        <div className="flex flex-wrap gap-6 mt-10">
          {[
            { icon: '✅', label: 'No paid placements' },
            { icon: '🇬🇧', label: 'UK relevant' },
            { icon: '🛡️', label: 'GDPR-safe providers' },
            { icon: '🎖️', label: 'Accredited where available' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingSection;
