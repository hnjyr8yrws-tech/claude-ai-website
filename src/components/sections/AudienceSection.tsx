/**
 * AudienceSection.tsx — "Meet your new 24/7 AI education teammates"
 * Notion-inspired two-column layout · interactive demo panel · testimonials · CTA
 * Framer Motion scroll-triggered animations · typing effect · sparkle badge
 */

import { FC, useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ── Agent data ────────────────────────────────────────────────────────────────

const AGENTS = [
  {
    id: 'teachers',
    iconType: 'teacher',
    accent: '#f59e0b',
    gradFrom: '#f59e0b',
    gradTo: '#ef4444',
    iconBg: '#fff7ed',
    title: 'Classroom Q&A & Lesson Assistant',
    subtitle: 'For Teachers',
    desc: 'Instantly generate lesson plans, differentiated resources, marking feedback, and curriculum-aligned materials.',
    tag: 'Lesson Planning',
  },
  {
    id: 'parents',
    iconType: 'parent',
    accent: '#7c3aed',
    gradFrom: '#7c3aed',
    gradTo: '#a855f7',
    iconBg: '#f5f3ff',
    title: 'Safe Home Learning Companion',
    subtitle: 'For Parents',
    desc: 'Support your child\'s learning safely at home — vetted tools, parental guidance, and UK curriculum alignment.',
    tag: 'Home Learning',
  },
  {
    id: 'schools',
    iconType: 'school',
    accent: '#14b8a6',
    gradFrom: '#14b8a6',
    gradTo: '#10b981',
    iconBg: '#f0fdfa',
    title: 'School-wide AI Hub',
    subtitle: 'For School Leaders',
    desc: 'Roll out AI confidently with policy templates, staff training pathways, and Ofsted-ready compliance tools.',
    tag: 'Leadership',
  },
  {
    id: 'professionals',
    iconType: 'professional',
    accent: '#2563eb',
    gradFrom: '#2563eb',
    gradTo: '#4f46e5',
    iconBg: '#eff6ff',
    title: 'Professional Development Coach',
    subtitle: 'For Education Professionals',
    desc: 'Upskill with AI-curated CPD, stay ahead of EdTech trends, and find tools matched to your specialist role.',
    tag: 'CPD & Growth',
  },
  {
    id: 'custom',
    iconType: 'custom',
    accent: '#6b7280',
    gradFrom: '#374151',
    gradTo: '#111827',
    iconBg: '#f9fafb',
    title: 'Create your own Education Agent',
    subtitle: 'Coming Soon',
    desc: 'Build a custom AI workflow for your school, team, or classroom — no coding required.',
    tag: 'Custom',
  },
];

// ── Demo Q&A per agent ────────────────────────────────────────────────────────

type DemoItem = {
  name: string; initials: string; roleTag: string;
  tagColor: string; avatarColor: string;
  question: string; answer: string;
};

const DEMOS: Record<string, DemoItem[]> = {
  teachers: [
    {
      name: 'Ms. Patel', initials: 'MP', roleTag: 'Year 5 · Maths', tagColor: '#f59e0b', avatarColor: '#f59e0b',
      question: 'Generate a lesson plan on fractions for Year 5.',
      answer: '60-min KS2 lesson: Starter hook (10 min), manipulatives activity (35 min), exit ticket (15 min). SEN adaptations included.',
    },
    {
      name: 'Mr. Okafor', initials: 'TO', roleTag: 'Year 9 · Science', tagColor: '#ef4444', avatarColor: '#ef4444',
      question: 'Create a differentiated worksheet on photosynthesis.',
      answer: 'Three-tier worksheet: Foundation, Core, Extension. Visual diagrams + vocab support for EAL learners.',
    },
    {
      name: 'Mrs. Chen', initials: 'LC', roleTag: 'Year 3 · English', tagColor: '#f97316', avatarColor: '#f97316',
      question: 'Write 5 marking comments for a creative writing piece.',
      answer: 'Growth-focused EEF-aligned feedback generated — positive + next-step structure for each pupil.',
    },
  ],
  parents: [
    {
      name: 'James W.', initials: 'JW', roleTag: 'Home · UK', tagColor: '#7c3aed', avatarColor: '#7c3aed',
      question: 'Is this AI tool safe for my 9-year-old?',
      answer: 'Yes — all GetPromptly tools are GDPR-compliant, content-filtered, and reviewed by UK primary educators.',
    },
    {
      name: 'Priya M.', initials: 'PM', roleTag: 'Home · KS2 Parent', tagColor: '#a855f7', avatarColor: '#a855f7',
      question: 'How can AI help my child revise for SATs?',
      answer: 'Khanmigo and Diffit adapt to your child\'s level and align perfectly to the KS2 SATs syllabus.',
    },
  ],
  schools: [
    {
      name: 'Dr. Clarke', initials: 'DC', roleTag: 'Secondary Admin', tagColor: '#14b8a6', avatarColor: '#14b8a6',
      question: 'What AI policy template fits Ofsted guidance?',
      answer: 'Our Policy Builder is pre-aligned with Ofsted\'s 2024 framework and KCSIE safeguarding requirements.',
    },
    {
      name: 'Ms. Wright', initials: 'AW', roleTag: 'Primary Headteacher', tagColor: '#10b981', avatarColor: '#10b981',
      question: 'How do I introduce AI to my staff safely?',
      answer: '5-module CPD pathway: AI literacy → classroom application → safeguarding & policy. Staff-ready in 3 weeks.',
    },
    {
      name: 'Mr. Singh', initials: 'RS', roleTag: 'MAT Director', tagColor: '#059669', avatarColor: '#059669',
      question: 'Can we track AI tool usage across our trust?',
      answer: 'Yes — School AI Hub includes trust-wide dashboards, usage reports, and safeguarding compliance tracking.',
    },
  ],
  professionals: [
    {
      name: 'Rachel T.', initials: 'RT', roleTag: 'EdTech Lead', tagColor: '#2563eb', avatarColor: '#2563eb',
      question: 'Best AI tools for CPD in 2025?',
      answer: 'Top picks: Brisk Teaching (marking), Eduaide.ai (resource creation), Khanmigo (personalised PD).',
    },
    {
      name: 'Liam K.', initials: 'LK', roleTag: 'SENCO', tagColor: '#4f46e5', avatarColor: '#4f46e5',
      question: 'Which AI tools best support SEND learners?',
      answer: 'Diffit (text differentiation), SchoolAI (adaptive learning), Read&Write (accessibility). All GDPR-safe.',
    },
  ],
  custom: [
    {
      name: 'You', initials: '✦', roleTag: 'Your School', tagColor: '#6b7280', avatarColor: '#6b7280',
      question: 'Build a custom AI agent for our school\'s homework help desk.',
      answer: 'Custom agent builder coming soon — join the waitlist to create your school\'s very own AI assistant.',
    },
  ],
};

// ── Testimonials ──────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "GetPromptly saved me 6 hours a week on lesson planning. It's completely transformed how I work.",
    name: 'Sarah Mitchell',
    role: 'Year 4 Teacher, Manchester',
    initials: 'SM',
    accent: '#f59e0b',
  },
  {
    quote: "As a headteacher, I finally feel confident introducing AI school-wide knowing it meets safeguarding standards.",
    name: 'David Osei',
    role: 'Headteacher, Birmingham Primary',
    initials: 'DO',
    accent: '#14b8a6',
  },
  {
    quote: "My daughter's reading confidence improved dramatically once we found the right tools through GetPromptly.",
    name: 'Emma Lawson',
    role: 'Parent, London',
    initials: 'EL',
    accent: '#7c3aed',
  },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const AgentIcon: FC<{ type: string; accent: string; size?: number }> = ({ type, accent, size = 22 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };

  if (type === 'teacher') return (
    <svg {...props}>
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill={accent} opacity="0.9"/>
      <path d="M5 13.18V17l7 4 7-4v-3.82L12 17l-7-3.82z" fill={accent} opacity="0.55"/>
    </svg>
  );
  if (type === 'parent') return (
    <svg {...props}>
      <path d="M12 2L3.5 8.5V14c0 5 3.64 9.63 8.5 10.79C16.86 23.63 20.5 19 20.5 14V8.5L12 2z"
        fill={accent} opacity="0.18" stroke={accent} strokeWidth="1.5"/>
      <path d="M9 12.5l2.5 2.5 4-5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (type === 'school') return (
    <svg {...props}>
      <path d="M3 10.5L12 4l9 6.5V21H3V10.5z" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="9" y="14" width="6" height="7" rx="1" fill={accent} opacity="0.7"/>
      <rect x="4" y="11" width="3.5" height="3.5" rx="0.5" fill={accent} opacity="0.8"/>
      <rect x="16.5" y="11" width="3.5" height="3.5" rx="0.5" fill={accent} opacity="0.8"/>
    </svg>
  );
  if (type === 'professional') return (
    <svg {...props}>
      <rect x="2" y="8" width="20" height="13" rx="2" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1.5"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={accent} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2" y1="14" x2="22" y2="14" stroke={accent} strokeWidth="1.2" opacity="0.4"/>
      <circle cx="12" cy="14" r="2" fill={accent} opacity="0.9"/>
    </svg>
  );
  // custom / sparkle
  return (
    <svg {...props}>
      <path d="M12 2l1.8 5.4L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.6L12 2z" fill={accent} opacity="0.85"/>
      <path d="M19 14l.9 2.7L22 18l-2.1.9L19 21.6l-.9-2.7L16 18l2.1-.9L19 14z" fill={accent} opacity="0.55"/>
      <path d="M5.5 14l.6 1.8L8 17l-1.9.8L5.5 20l-.6-2.2L3 17l1.9-.8L5.5 14z" fill={accent} opacity="0.45"/>
    </svg>
  );
};

// ── Typing animation component ────────────────────────────────────────────────

const TypingText: FC<{ text: string; active: boolean; speed?: number }> = ({ text, active, speed = 18 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return (
    <span>
      {displayed}
      {active && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

// ── Demo panel (right column) ─────────────────────────────────────────────────

const DemoPanel: FC<{ activeId: string; accent: string }> = ({ activeId, accent }) => {
  const items = DEMOS[activeId] ?? DEMOS['teachers'];

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl"
      style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)' }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-gray-100"
        style={{ background: 'linear-gradient(to right, #fafafa, #f5f5f5)' }}
      >
        {/* Traffic light dots */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-2 text-xs font-semibold text-gray-500 tracking-wide">Education Support Hub</span>
        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accent }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-medium text-gray-400">Live</span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto] gap-2 px-4 py-2 border-b border-gray-50 bg-gray-50/50">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Question</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Role</span>
      </div>

      {/* Q&A rows */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.name + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.35, ease: 'easeOut' }}
              className="border-b border-gray-50 last:border-0"
            >
              {/* Question row */}
              <div className="flex items-start gap-3 px-4 pt-3 pb-1">
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white mt-0.5"
                  style={{ background: `linear-gradient(135deg, ${item.avatarColor}, ${item.avatarColor}cc)` }}
                >
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-gray-800">{item.name}</span>
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                      style={{ background: `${item.tagColor}18`, color: item.tagColor }}
                    >
                      {item.roleTag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{item.question}</p>
                </div>
              </div>

              {/* Answer row */}
              <div className="flex items-start gap-3 px-4 pb-3 pt-1">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-black text-white mt-0.5"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
                >
                  AI
                </div>
                <div
                  className="flex-1 rounded-xl px-3 py-2 text-[11px] leading-relaxed text-gray-700"
                  style={{ background: `${accent}0d`, border: `1px solid ${accent}22` }}
                >
                  <TypingText text={item.answer} active={i === 0} speed={15} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs text-gray-400"
          style={{ borderColor: `${accent}33`, background: '#fff', boxShadow: `0 0 12px ${accent}0d` }}
        >
          <span className="flex-1">Ask your education AI anything…</span>
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L9 5 1 1v3l6 1-6 1v3z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Sparkle badge ─────────────────────────────────────────────────────────────

const SparkleBadge: FC = () => {
  const sparks = [
    { x: -14, y: -10, delay: 0,    size: 6 },
    { x:  14, y: -12, delay: 0.3,  size: 5 },
    { x:  18, y:   4, delay: 0.6,  size: 4 },
    { x: -16, y:   6, delay: 0.9,  size: 5 },
    { x:   2, y: -16, delay: 1.2,  size: 4 },
  ];
  return (
    <div className="inline-flex items-center justify-center relative mb-5">
      {/* Floating sparkles */}
      {sparks.map((s, i) => (
        <motion.svg
          key={i}
          width={s.size} height={s.size}
          viewBox="0 0 8 8"
          className="absolute pointer-events-none"
          style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: 2.4, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M4 0l.6 2.4L7 3.2 4.6 4l.4 3.6L3.4 5.2 1 5.8l1.4-2L0 2.4l2.8.4z" fill="#f59e0b"/>
        </motion.svg>
      ))}
      {/* Badge */}
      <span
        className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide"
        style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #dbeafe', color: '#1d4ed8' }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', boxShadow: '0 0 6px rgba(37,99,235,0.5)' }}
        />
        Custom AI Tools for Education
        <span
          className="px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-widest"
          style={{ background: '#2563eb', color: 'white' }}
        >
          NEW
        </span>
      </span>
    </div>
  );
};

// ── Main section ──────────────────────────────────────────────────────────────

const AudienceSection: FC<{ onViewTools: () => void }> = ({ onViewTools }) => {
  const [activeId, setActiveId] = useState('teachers');
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const activeAgent = AGENTS.find(a => a.id === activeId) ?? AGENTS[0];

  // Stagger variants
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 250, damping: 26 } },
  };
  const fadeLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 250, damping: 26 } },
  };
  const fadeRight = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 250, damping: 26, delay: 0.2 } },
  };

  return (
    <section
      ref={sectionRef}
      id="audience"
      aria-labelledby="audience-heading"
      className="relative overflow-hidden bg-white py-20 sm:py-28"
    >
      {/* ── Background decoration ─────────────────────────────────────────── */}
      {/* Diagonal line pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #2563eb 0, #2563eb 1px, transparent 0, transparent 50%)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Soft gradient orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)' }} aria-hidden="true"/>
      <div className="absolute top-1/2 -right-60 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} aria-hidden="true"/>
      <div className="absolute -bottom-32 left-1/3 w-[350px] h-[350px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} aria-hidden="true"/>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Hero heading ──────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SparkleBadge />

          <h2
            id="audience-heading"
            className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.06] text-gray-900 mb-5"
          >
            Meet your new{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#2563eb 0%,#7c3aed 55%,#14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              24/7 AI education
            </span>
            <br />teammates.
          </h2>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Whether you're in the classroom, at home, or leading a school — your AI education teammates
            are ready to help right now.
          </p>
        </motion.div>

        {/* ── Two-column layout ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 items-start">

          {/* Left column — agent list */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {/* Sub-header like Notion */}
            <motion.div variants={fadeLeft} className="mb-5">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  AI Teammates for Education
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white tracking-wider">
                  NEW
                </span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 leading-snug">
                Automate the work that slows education down.
              </h3>
              <button
                onClick={onViewTools}
                aria-label="View all education AI tools"
                className="mt-3 w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>

            {/* Agent items */}
            <motion.div variants={container} className="flex flex-col gap-1.5">
              {AGENTS.map((agent) => {
                const isActive = activeId === agent.id;
                return (
                  <motion.button
                    key={agent.id}
                    variants={fadeLeft}
                    onClick={() => setActiveId(agent.id)}
                    aria-pressed={isActive}
                    aria-label={`Select ${agent.title}`}
                    className="w-full text-left rounded-xl px-4 py-3.5 flex items-start gap-4 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{
                      background: isActive ? `linear-gradient(135deg, ${agent.iconBg}, white)` : 'transparent',
                      border: isActive ? `1.5px solid ${agent.accent}30` : '1.5px solid transparent',
                      boxShadow: isActive ? `0 4px 24px ${agent.accent}18` : 'none',
                    }}
                    whileHover={{ x: isActive ? 0 : 4, scale: 1.005 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${agent.gradFrom}22, ${agent.gradTo}18)`
                          : '#f9fafb',
                        border: isActive ? `1px solid ${agent.accent}30` : '1px solid #f3f4f6',
                      }}
                    >
                      <AgentIcon type={agent.iconType} accent={agent.accent} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-sm font-black transition-colors duration-200"
                          style={{ color: isActive ? agent.accent : '#111827' }}
                        >
                          {agent.title}
                        </span>
                        {agent.id === 'custom' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500">
                            SOON
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs leading-relaxed transition-colors duration-200"
                        style={{ color: isActive ? '#4b5563' : '#9ca3af' }}
                      >
                        {agent.desc}
                      </p>
                    </div>

                    {/* Active indicator */}
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                      style={{ background: agent.accent }}
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* "See what it can do" strip */}
            <motion.div variants={fadeLeft} className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-widest">See what it can do →</p>
              <div className="flex flex-wrap gap-2">
                {['Generate lesson plans', 'Mark student work', 'Write AI policies', 'Find safe tools', 'Create your own'].map((chip) => (
                  <button
                    key={chip}
                    onClick={onViewTools}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {chip} →
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right column — interactive demo */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="sticky top-24"
          >
            <DemoPanel activeId={activeId} accent={activeAgent.accent} />
          </motion.div>
        </div>

        {/* ── Testimonial strip ─────────────────────────────────────────────── */}
        <motion.div
          className="mt-20 pt-14 border-t border-gray-100"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-8">
            Trusted by teachers, parents, and schools across the UK
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                className="rounded-2xl p-5 border border-gray-100 bg-white transition-shadow duration-200"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}aa)` }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.role}</p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mt-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="10" height="10" viewBox="0 0 10 10" fill="#f59e0b">
                      <path d="M5 1l.9 2.8H8.8L6.5 5.5l.9 2.8L5 6.6 2.7 8.3l.9-2.8L1.2 3.8H4z"/>
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA bar ────────────────────────────────────────────────────────── */}
        <motion.div
          className="mt-16 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div
            className="relative px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #7c3aed 100%)',
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} aria-hidden="true"/>
            <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full opacity-10 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translateY(40%)' }} aria-hidden="true"/>

            <div className="relative z-10 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">
                Ready to get started?
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Explore All Education AI Tools
              </h3>
              <p className="mt-1 text-sm text-blue-200">
                Curated, safe, and curriculum-aligned for UK schools.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <motion.button
                onClick={onViewTools}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl font-black text-sm text-blue-900 bg-white hover:bg-blue-50 transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Explore all education AI tools"
              >
                Explore All Tools →
              </motion.button>
              <motion.button
                onClick={onViewTools}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl font-black text-sm text-white border-2 border-white/40 hover:border-white/70 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Get started for free"
              >
                Get Started Free
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AudienceSection;
