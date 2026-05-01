import { FC, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';
import AgentCTACard from '../components/AgentCTACard';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const TEAL   = '#00808a';
const BG     = '#f7f6f2';
const DARK   = '#111210';
const TEXT   = '#1c1a15';
const MUTED  = '#6b6760';
const BORDER = '#e8e6e0';

// ─── Fade-in animation wrapper ─────────────────────────────────────────────────
const FadeIn: FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ─── Audience tabs ─────────────────────────────────────────────────────────────
const AUDIENCES = [
  {
    id: 'slt',
    label: 'Headteachers / SLT',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2a4 4 0 100 8 4 4 0 000-8zm-7 14c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    heading: 'Lead your school into AI with confidence',
    points: [
      'Build a whole-school AI strategy aligned to DfE and Ofsted expectations',
      'Develop or review your acceptable use policy using our templates and prompts',
      'Get briefed on KCSIE 2025 obligations for AI-enabled tools',
      'Access staff CPD pathways for teachers, admin and support staff',
      'Compare tools with independent safety scores — no vendor bias',
    ],
    cta: { label: 'Explore Leadership Prompts', to: '/prompts/school-leaders' },
  },
  {
    id: 'senco',
    label: 'SENCOs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
    heading: 'Find the right technology for every learner',
    points: [
      'Browse 96 products including AAC devices, eye-gaze tech, sensory tools and hearing support',
      'Filter assistive technology by need, budget and procurement route',
      'Access EHCP review, provision mapping and SEN admin prompts',
      'Understand which AI tools are suitable for SEND learners',
      'Get guidance on when specialist assessment is needed before purchasing',
    ],
    cta: { label: 'Browse SEND Equipment', to: '/ai-equipment/send' },
  },
  {
    id: 'it',
    label: 'IT / Digital Leads',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 8l-3 4m6-4l3 4m-3-4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    heading: 'Evaluate tools against real compliance requirements',
    points: [
      'Check 120+ tools against KCSIE 2025, UK GDPR and ICO guidance',
      'Compare UK data residency, DPA availability and MDM compatibility',
      'Identify tools with school-level admin controls and safeguarding filters',
      'Review our transparent safety scoring methodology',
      'Advise on Crown Commercial Service (CCS RM6098) and ESFA frameworks',
    ],
    cta: { label: 'View Safety Methodology', to: '/safety-methodology' },
  },
  {
    id: 'sbm',
    label: 'Business Managers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 7h14M3 7V5a1 1 0 011-1h12a1 1 0 011 1v2M3 7v9a1 1 0 001 1h12a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    heading: 'Navigate procurement clearly and confidently',
    points: [
      'Understand the difference between Amazon, reseller and specialist procurement routes',
      'Find and compare relevant suppliers for your school',
      'Compare total cost of ownership across hardware bundles',
      'Access VAT exemption guidance for qualifying SEND items',
      'Identify Crown Commercial Service and ESFA framework options',
    ],
    cta: { label: 'Browse Equipment for Schools', to: '/ai-equipment/schools' },
  },
  {
    id: 'cpd',
    label: 'CPD Leads',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8l5.5-.8L10 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    heading: 'Build a staff training plan that actually works',
    points: [
      'Access 26 curated training resources — free and paid',
      'Identify the right pathway for teachers, leaders, SENCOs and support staff',
      'Use government-backed courses including the DfE AI in Education programme',
      'Find certificated CPD for performance management and appraisal evidence',
      'Download AI classroom implementation guides for department leads',
    ],
    cta: { label: 'Explore Training Hub', to: '/ai-training' },
  },
  {
    id: 'governors',
    label: 'Governors / Trustees',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M2 16l8-12 8 12H2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M10 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    heading: 'Ask the right questions about AI in your school',
    points: [
      'Understand your strategic oversight role in whole-school AI adoption',
      'Review model acceptable use and AI governance policy frameworks',
      'Identify the risks and safeguards boards should require of leadership',
      'Ensure Ofsted-readiness by understanding current AI inspection themes',
      'Get a plain-English briefing on KCSIE 2025 and what it means for governance',
    ],
    cta: { label: 'Read AI Tools Safety Guide', to: '/safety-methodology' },
  },
];

// ─── What we help with sections ────────────────────────────────────────────────
const HELP_SECTIONS = [
  {
    letter: 'A',
    title: 'AI Tools Advisory',
    to: '/tools',
    items: [
      'Shortlist tools that are KCSIE 2025 compliant and UK-safe',
      'Compare independent safety scores across 120+ reviewed tools',
      'Get role-based recommendations for teachers, students and admin staff',
      'Identify AI tools suitable for SEND learners and complex needs',
    ],
  },
  {
    letter: 'B',
    title: 'Equipment & Procurement',
    to: '/ai-equipment/schools',
    items: [
      'Interactive displays: SMART, Promethean, Clevertouch, iiyama, ViewSonic',
      'Classroom visualisers: HUE HD Pro, AVer range',
      'Coding robots: Bee-Bot, Blue-Bot, Ohbot class packs',
      'Classroom audio, hearing loops and AV infrastructure',
      'SEND & assistive tech: AAC, sensory, eye-gaze, switch access',
      'Charging infrastructure and device management',
    ],
  },
  {
    letter: 'C',
    title: 'Staff Training',
    to: '/ai-training',
    items: [
      'Free UK Government-backed AI training (DfE, GOV.UK, Google)',
      'Paid premium CPD with certificates for performance evidence',
      'Role-based pathways for teachers, leaders and SENCOs',
      'Safeguarding and KCSIE-focused AI awareness training',
    ],
  },
  {
    letter: 'D',
    title: 'AI Prompts for Schools',
    to: '/prompts',
    items: [
      'Differentiated lesson planning and classroom prompts',
      'SEN-aware classroom, EHCP and provision mapping prompts',
      'School communication and admin templates',
      'Leadership, strategy and Ofsted-preparation prompts',
      'Whole-school prompt bundle (coming soon)',
    ],
  },
];

// ─── Procurement routes ─────────────────────────────────────────────────────────
const PROCUREMENT_ROUTES = [
  {
    route: 'Amazon / Retail',
    speed: 'Fast',
    speedColor: '#16a34a',
    description: 'Standard classroom technology, tablets, cables, accessories and lower-cost items available for immediate purchase.',
    examples: 'Tablets, visualisers, coding robots, headphones',
    note: null,
  },
  {
    route: 'Education Resellers',
    speed: 'Managed',
    speedColor: TEAL,
    description: 'School-focused suppliers offering invoiced orders, delivery, installation and after-school support.',
    examples: 'Classroom365, Elementary Technology, YPO, Tes Resources',
    note: 'Often preferred for larger orders — VAT handling included.',
  },
  {
    route: 'Specialist SEND Suppliers',
    speed: 'Consultative',
    speedColor: '#7c3aed',
    description: 'Specialist suppliers for AAC devices, eye-gaze technology, sensory rooms and complex assistive tech. These require direct contact and often an assessment.',
    examples: 'Tobii Dynavox, Smartbox, SpaceKraft, Inclusive Technology',
    note: 'EHCP funding and specialist assessment may be required.',
  },
  {
    route: 'Crown Commercial Service / ESFA Frameworks',
    speed: 'Compliant',
    speedColor: '#b45309',
    description: 'Procurement frameworks that meet UK public sector requirements. Best for larger investments where governance and audit trails are required.',
    examples: 'CCS RM6098 (Technology Products), ESFA Technology Products 2',
    note: 'May require quotation process depending on spend value.',
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Does GetPromptly sell directly to schools?',
    a: "No — we are an advisory and comparison platform. We help schools identify the right products and connect with the right suppliers. We do not hold stock or process orders.",
  },
  {
    q: 'How are tools and equipment reviewed?',
    a: "Our team applies a transparent UK safety and suitability framework to each tool and product. Criteria include KCSIE 2025 alignment, UK GDPR compliance, ICO registration, data residency and Ofsted-readiness. Scores are updated regularly and no vendor pays for inclusion or ranking.",
  },
  {
    q: 'Is GetPromptly just for SEND schools?',
    a: "No. We cover mainstream classroom technology, teacher tools, training and prompts for all schools across England, Wales, Scotland and Northern Ireland. SEND and assistive tech is one important section within a much broader platform.",
  },
  {
    q: 'How does the 24/7 agent work?',
    a: "Our embedded Promptly AI agent is powered by Anthropic Claude and trained on our full database. It can answer questions, compare options and recommend tools, training or equipment in real time — completely free to use on the site. It is an AI assistant, not a human advisor.",
  },
  {
    q: 'Can we get a tailored recommendation for our school?',
    a: "Yes — use the consultation request form below or ask our agent directly. We can help identify the right tools, training and equipment for your school's specific context, year groups, learner needs and budget.",
  },
];

// ─── FAQ accordion item ────────────────────────────────────────────────────────
const FaqItem: FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: BORDER }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] rounded"
        aria-expanded={open}
      >
        <span className="font-medium text-[15px]" style={{ color: TEXT }}>{q}</span>
        <svg
          width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
          style={{ flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M9 3v12M3 9h12" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-5 text-sm leading-relaxed" style={{ color: MUTED }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Consultation form ─────────────────────────────────────────────────────────
const ROLES_FORM = [
  'Headteacher / Principal',
  'Deputy / Assistant Head',
  'SENCO',
  'IT Manager / Digital Lead',
  'School Business Manager',
  'CPD / Training Lead',
  'Governor / Trustee',
  'Classroom Teacher',
  'Other',
];

const NEEDS = [
  'AI tools for my school',
  'Equipment / hardware',
  'Staff training',
  'AI prompts / templates',
  'SEND technology',
  'AI policy / strategy',
  'Something else',
];

const ConsultationForm: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', school: '', role: '', need: '', message: '' });
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — wire to backend / Formspree / EmailJS
    setSubmitted(true);
    track({ name: 'email_capture_submitted', section: 'schools-consultation' });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: '#e6f7f8', border: `1px solid #b3e8eb` }}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: TEAL }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11l5 5 9-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-display text-xl mb-2" style={{ color: TEXT }}>Request received</h3>
        <p className="text-sm" style={{ color: MUTED }}>
          Thank you — we will be in touch shortly. In the meantime, feel free to explore the site or ask our AI agent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="School consultation request form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cons-name" className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Your name <span aria-hidden="true" style={{ color: TEAL }}>*</span>
          </label>
          <input
            ref={nameRef}
            id="cons-name"
            type="text"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#00808a]"
            style={{ background: 'white', borderColor: BORDER, color: TEXT }}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="cons-school" className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            School / Organisation <span aria-hidden="true" style={{ color: TEAL }}>*</span>
          </label>
          <input
            id="cons-school"
            type="text"
            required
            value={form.school}
            onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#00808a]"
            style={{ background: 'white', borderColor: BORDER, color: TEXT }}
            placeholder="Oakfield Primary School"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cons-role" className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            Your role <span aria-hidden="true" style={{ color: TEAL }}>*</span>
          </label>
          <select
            id="cons-role"
            required
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#00808a] appearance-none"
            style={{ background: 'white', borderColor: BORDER, color: form.role ? TEXT : MUTED }}
          >
            <option value="" disabled>Select your role…</option>
            {ROLES_FORM.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cons-need" className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
            What do you need help with? <span aria-hidden="true" style={{ color: TEAL }}>*</span>
          </label>
          <select
            id="cons-need"
            required
            value={form.need}
            onChange={e => setForm(f => ({ ...f, need: e.target.value }))}
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#00808a] appearance-none"
            style={{ background: 'white', borderColor: BORDER, color: form.need ? TEXT : MUTED }}
          >
            <option value="" disabled>Select a topic…</option>
            {NEEDS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cons-message" className="block text-xs font-semibold mb-1.5" style={{ color: MUTED }}>
          Tell us a bit more (optional)
        </label>
        <textarea
          id="cons-message"
          rows={4}
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#00808a] resize-none"
          style={{ background: 'white', borderColor: BORDER, color: TEXT }}
          placeholder="E.g. We are a two-form entry primary looking to improve AI literacy across Key Stage 2..."
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2"
        style={{ background: TEAL }}
      >
        Send consultation request
      </button>

      <p className="text-xs" style={{ color: MUTED }}>
        We typically respond within 1–2 working days. Your data is handled in accordance with our privacy policy and UK GDPR.
      </p>
    </form>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────
const Schools: FC = () => {
  const [activeTab, setActiveTab] = useState('slt');
  const active = AUDIENCES.find(a => a.id === activeTab)!;

  return (
    <div style={{ background: BG, color: TEXT }}>
      <SEO
        title="AI Advisory for UK Schools | GetPromptly"
        description="From classroom AI tools to SEND technology, staff training to AI policy — GetPromptly helps UK schools make confident decisions about AI."
        keywords="ai advisory for uk schools, school ai procurement uk, kcsie compliant ai tools schools"
        path="/schools"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: DARK }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <FadeIn>
            <p
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full border"
              style={{ color: TEAL, borderColor: '#1a3f42' }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} aria-hidden="true" />
              For Schools &amp; Trusts
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
              style={{ color: 'white' }}
            >
              AI Advisory<br />for UK Schools
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10" style={{ color: '#a09d98' }}>
              From classroom tools to SEND technology, staff training to AI policy —
              GetPromptly helps schools make confident, well-informed decisions about AI.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111210]"
                style={{ background: TEAL }}
              >
                Request a Consultation
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { offer: 'school-toolkit' } }))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111210]"
                style={{ background: '#1f1d1b', color: '#d0cdc8', border: '1px solid #2a2825' }}
              >
                Receive the school toolkit
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111210]"
                style={{ background: 'transparent', color: '#d0cdc8', border: '1px solid #2a2825' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 7a6 6 0 1012 0A6 6 0 001 7z" stroke={TEAL} strokeWidth="1.5"/>
                  <path d="M7 4v3l2 1" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Talk to Our Agent
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-t" style={{ borderColor: BORDER, background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            'KCSIE 2025 Aligned',
            'UK GDPR Compliant',
            '120+ Reviewed Tools',
            '96 Equipment Products',
            '26 Training Resources',
            'No Sponsored Rankings',
          ].map(item => (
            <span key={item} className="flex items-center gap-2 text-xs font-semibold" style={{ color: MUTED }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TEAL }} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Audience tabs ─────────────────────────────────────────────────────── */}
      <section style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Who this is for</p>
            <h2 className="font-display text-3xl mb-10" style={{ color: TEXT }}>
              Built for every role in your school
            </h2>
          </FadeIn>

          {/* Tab strip */}
          <div
            role="tablist"
            aria-label="School audience roles"
            className="flex flex-wrap gap-2 mb-8"
          >
            {AUDIENCES.map(a => (
              <button
                key={a.id}
                role="tab"
                aria-selected={activeTab === a.id}
                aria-controls={`tab-panel-${a.id}`}
                onClick={() => setActiveTab(a.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
                style={{
                  background: activeTab === a.id ? TEAL : BG,
                  color: activeTab === a.id ? 'white' : MUTED,
                  border: `1px solid ${activeTab === a.id ? TEAL : BORDER}`,
                }}
              >
                <span style={{ color: activeTab === a.id ? 'white' : TEAL }}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={`tab-panel-${activeTab}`}
              role="tabpanel"
              aria-label={active.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: BG, border: `1px solid ${BORDER}` }}
            >
              <h3 className="font-display text-xl mb-5" style={{ color: TEXT }}>{active.heading}</h3>
              <ul className="space-y-3 mb-6" role="list">
                {active.points.map(pt => (
                  <li key={pt} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#e0f5f6' }}
                      aria-hidden="true"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: TEXT }}>{pt}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={active.cta.to}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
                style={{ background: TEAL }}
              >
                {active.cta.label}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── What we help with ─────────────────────────────────────────────────── */}
      <section style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>What we cover</p>
            <h2 className="font-display text-3xl mb-12" style={{ color: TEXT }}>
              Everything your school needs in one place
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HELP_SECTIONS.map((s, i) => (
              <FadeIn key={s.letter} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 h-full flex flex-col"
                  style={{ background: 'white', border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-display text-sm font-bold flex-shrink-0"
                      style={{ background: '#e0f5f6', color: TEAL }}
                      aria-hidden="true"
                    >
                      {s.letter}
                    </div>
                    <h3 className="font-display text-lg" style={{ color: TEXT }}>{s.title}</h3>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-5" role="list">
                    {s.items.map(item => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-[#00808a] flex-shrink-0 mt-0.5" aria-hidden="true">·</span>
                        <span className="text-sm leading-relaxed" style={{ color: MUTED }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={s.to}
                    className="text-sm font-semibold flex items-center gap-1.5 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] rounded"
                    style={{ color: TEAL }}
                  >
                    Explore
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                      <path d="M2.5 6.5h8M6.5 2.5l4 4-4 4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Procurement support ───────────────────────────────────────────────── */}
      <section style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Procurement</p>
            <h2 className="font-display text-3xl mb-4" style={{ color: TEXT }}>
              Buying for schools is not straightforward
            </h2>
            <p className="text-base max-w-2xl mb-12 leading-relaxed" style={{ color: MUTED }}>
              Different equipment requires different routes. We help you understand which path is right
              for each purchase — so you save time, stay compliant and get the right outcome.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {PROCUREMENT_ROUTES.map((r, i) => (
              <FadeIn key={r.route} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 h-full"
                  style={{ background: BG, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-[15px]" style={{ color: TEXT }}>{r.route}</h3>
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: r.speedColor + '18', color: r.speedColor }}
                    >
                      {r.speed}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: MUTED }}>{r.description}</p>
                  <p className="text-xs mb-2" style={{ color: MUTED }}>
                    <strong style={{ color: TEXT }}>Examples:</strong> {r.examples}
                  </p>
                  {r.note && (
                    <p className="text-xs leading-relaxed p-2.5 rounded-lg" style={{ background: '#fff', color: MUTED }}>
                      {r.note}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* ── Trust section ─────────────────────────────────────────────────────── */}
      <section style={{ background: DARK }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Why schools trust us</p>
            <h2 className="font-display text-3xl mb-12" style={{ color: 'white' }}>
              Independent. Transparent. Education-first.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'UK education focus',
                body: 'Built entirely around DfE guidance, Ofsted inspection themes, KCSIE 2025 and ICO registration — not a US platform adapted for the UK.',
              },
              {
                title: 'Transparent scoring',
                body: 'Every tool and product is scored using a published methodology. No vendor pays for a better score or a featured position.',
              },
              {
                title: 'SEND-aware, not SEND-only',
                body: 'Assistive technology and SEND provision is a major section — but mainstream classroom tools, teacher CPD and leadership resources are equally central.',
              },
              {
                title: '24/7 AI agent',
                body: 'Our Claude-powered agent can answer questions, compare options and recommend resources at any time — for free, with no sign-up required.',
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 h-full"
                  style={{ background: '#1a1916', border: '1px solid #2a2825' }}
                >
                  <div
                    className="w-2 h-2 rounded-full mb-4"
                    style={{ background: TEAL }}
                    aria-hidden="true"
                  />
                  <h3 className="font-semibold text-[15px] mb-3" style={{ color: 'white' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#a09d98' }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Consultation form ─────────────────────────────────────────────────── */}
      <section id="consultation" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <FadeIn className="lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Get in touch</p>
              <h2 className="font-display text-3xl mb-5" style={{ color: TEXT }}>
                Request a school consultation
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: MUTED }}>
                Tell us about your school and what you are trying to achieve. We will follow up with
                tailored recommendations for tools, training or equipment.
              </p>

              <div className="space-y-5">
                {[
                  { label: 'Tools &amp; AI strategy', desc: 'KCSIE-aligned tool shortlists, policy templates, Ofsted preparation' },
                  { label: 'Equipment &amp; hardware', desc: 'Displays, devices, SEND tech, sensory rooms, procurement routes' },
                  { label: 'Staff training', desc: 'Free and paid CPD pathways for all roles' },
                  { label: 'Prompts &amp; templates', desc: 'Ready-to-use prompt packs for your school context' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#e0f5f6' }}
                      aria-hidden="true"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: TEXT }} dangerouslySetInnerHTML={{ __html: item.label }} />
                      <p className="text-xs mt-0.5" style={{ color: MUTED }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn className="lg:col-span-3" delay={0.1}>
              <div
                className="rounded-2xl p-6 sm:p-8"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
              >
                <ConsultationForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>FAQ</p>
            <h2 className="font-display text-3xl mb-10" style={{ color: TEXT }}>Common questions from schools</h2>
          </FadeIn>
          <div>
            {FAQS.map(faq => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links / explore more ────────────────────────────────────── */}
      <section style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-6 text-center" style={{ color: MUTED }}>
              Explore the platform
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'AI Tools Hub', to: '/tools', desc: '120+ reviewed tools' },
              { label: 'Equipment Hub', to: '/ai-equipment', desc: '96 products' },
              { label: 'Training Hub', to: '/ai-training', desc: '26 resources' },
              { label: 'Prompts Library', to: '/prompts', desc: '440+ prompts' },
              { label: 'Who We Are', to: '/who-we-are', desc: 'Our mission' },
            ].map((link, i) => (
              <FadeIn key={link.to} delay={i * 0.05}>
                <Link
                  to={link.to}
                  className="rounded-2xl p-4 text-center block transition-colors hover:border-[#00808a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
                  style={{ background: 'white', border: `1px solid ${BORDER}` }}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>{link.label}</p>
                  <p className="text-xs" style={{ color: MUTED }}>{link.desc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent CTA ─────────────────────────────────────────────────────── */}
      <section style={{ background: DARK }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
          <AgentCTACard
            section="Promptly AI · School Advisor"
            headline="Build a school AI readiness plan."
            description="Our AI advisor helps school leaders, IT leads and SENCOs navigate AI strategy, procurement and policy — no sign-up needed."
            prompts={[
              "Help me write a brief for our school's AI policy",
              "What equipment is available via school purchasing frameworks?",
              "Help me shortlist interactive displays for 12 classrooms",
              "What's the procurement route for specialist AAC devices?",
            ]}
            analyticsSection="schools"
          />
          <div className="flex justify-center mt-6">
            <a
              href="#consultation"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={{ background: '#1f1d1b', color: '#d0cdc8', border: '1px solid #2a2825' }}
            >
              Or request a consultation →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Schools;
