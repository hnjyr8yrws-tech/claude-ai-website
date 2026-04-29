/**
 * RolePage.tsx — Shared role-first landing page template.
 * Routes: /teachers, /school-leaders, /senco, /parents, /students, /admin
 */

import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';

const TEAL   = '#00808a';
const DARK   = '#111210';
const BG     = '#f7f6f2';
const BORDER = '#e8e6e0';

function openWidgetWithRole(role: string) {
  window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: `I am a ${role}. What do you recommend for me?` }));
  const btn = document.getElementById('promptly-widget-trigger');
  if (btn) (btn as HTMLButtonElement).click();
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

// ─── Role data ────────────────────────────────────────────────────────────────

export interface RoleToolPick { name: string; score: number; tier: 'Trusted' | 'Guided'; desc: string }
export interface RoleTraining { title: string; provider: string; free: boolean; to: string }
export interface RoleEquipment { name: string; category: string; to: string }

export interface RoleData {
  slug: string;
  title: string;
  emoji: string;
  color: string;
  heroTitle: string;
  heroSub: string;
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
  promptsTo: string;
  promptsLabel: string;
  promptHighlights: string[];
  tools: RoleToolPick[];
  training: RoleTraining[];
  equipment: RoleEquipment[];
  agentRole: string;
}

// ─── Page component ───────────────────────────────────────────────────────────

const RolePage: FC<{ data: RoleData }> = ({ data }) => {
  const d = data;

  return (
    <div style={{ background: BG, color: '#1c1a15' }}>
      <SEO title={d.seoTitle} description={d.seoDesc} keywords={d.seoKeywords} path={`/${d.slug}`} />

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: BG }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,128,138,0.06) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-6"
              style={{ background: d.color, color: '#1c1a15', border: `1px solid ${BORDER}` }}>
              <span className="text-base" aria-hidden="true">{d.emoji}</span>
              GetPromptly for {d.title}
            </span>

            <h1 className="font-display leading-[1.08] mb-5" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}>
              {d.heroTitle}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: '#6b6760' }}>
              {d.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={d.promptsTo}
                onClick={() => track({ name: 'cta_clicked', section: `role-${d.slug}`, label: 'See prompts' })}
                className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85 text-center"
                style={{ background: TEAL, color: 'white' }}>
                {d.promptsLabel} &rarr;
              </Link>
              <button
                onClick={() => { track({ name: 'cta_clicked', section: `role-${d.slug}`, label: 'Ask Promptly AI' }); openWidgetWithRole(d.agentRole); }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white"
                style={{ borderColor: BORDER, color: '#1c1a15' }}>
                <span className="relative flex w-2 h-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: TEAL }} />
                  <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: TEAL }} />
                </span>
                Ask Promptly AI
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Best tools ─────────────────────────────────────────────── */}
      <section style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Top AI tools</p>
            <h2 className="font-display text-2xl sm:text-3xl mb-2">Best tools for {d.title}.</h2>
            <p className="text-sm mb-8 max-w-md" style={{ color: '#6b6760' }}>
              Independently scored against KCSIE 2025, UK GDPR and DfE guidance.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.tools.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.06}>
                <div className="rounded-2xl border p-5 h-full flex flex-col" style={{ borderColor: BORDER, background: BG }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-xl leading-none" style={{ color: TEAL }}>{t.score}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: t.tier === 'Trusted' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: t.tier === 'Trusted' ? '#22c55e' : '#f59e0b' }}>
                        {t.tier}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: '#6b6760' }}>{t.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.15}>
            <Link to="/tools" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
              View all 155 tools &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Prompt packs ───────────────────────────────────────────── */}
      <section style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Prompt packs</p>
            <h2 className="font-display text-2xl sm:text-3xl mb-2">Ready-to-use prompts for {d.title}.</h2>
            <p className="text-sm mb-8 max-w-md" style={{ color: '#6b6760' }}>
              Copy, paste and use immediately in Claude, ChatGPT or Gemini.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {d.promptHighlights.map((p, i) => (
              <FadeIn key={p} delay={i * 0.05}>
                <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: 'white', borderColor: BORDER }}>
                  <span className="w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,128,138,0.1)', color: TEAL }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium">{p}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.15}>
            <Link to={d.promptsTo} className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
              See all {d.title} prompts &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Training path ──────────────────────────────────────────── */}
      <section style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Training path</p>
            <h2 className="font-display text-2xl sm:text-3xl mb-2">AI training for {d.title}.</h2>
            <p className="text-sm mb-8 max-w-md" style={{ color: '#6b6760' }}>
              Free and paid courses curated for your role.
            </p>
          </FadeIn>
          <div className="space-y-3 max-w-2xl">
            {d.training.map((t, i) => (
              <FadeIn key={t.title} delay={i * 0.05}>
                <Link to={t.to}
                  onClick={() => track({ name: 'cta_clicked', section: `role-${d.slug}-training`, label: t.title })}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-colors hover:border-[#00808a] group"
                  style={{ borderColor: BORDER, background: BG }}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={t.free ? { background: '#dcfce7', color: '#15803d' } : { background: '#fef9c3', color: '#854d0e' }}>
                    {t.free ? 'Free' : 'Paid'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-[#00808a] transition-colors">{t.title}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{t.provider}</p>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: '#9ca3af' }}>&rarr;</span>
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.15}>
            <Link to="/ai-training" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
              See all training &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Equipment ──────────────────────────────────────────────── */}
      {d.equipment.length > 0 && (
        <section style={{ background: BG }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
            <FadeIn>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Equipment</p>
              <h2 className="font-display text-2xl sm:text-3xl mb-2">Recommended tech for {d.title}.</h2>
              <p className="text-sm mb-8 max-w-md" style={{ color: '#6b6760' }}>
                Independently curated classroom and home technology.
              </p>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {d.equipment.map((e, i) => (
                <FadeIn key={e.name} delay={i * 0.05}>
                  <Link to={e.to}
                    onClick={() => track({ name: 'cta_clicked', section: `role-${d.slug}-equipment`, label: e.name })}
                    className="flex items-center gap-3 p-4 rounded-xl border transition-colors hover:border-[#00808a] group"
                    style={{ borderColor: BORDER, background: 'white' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-[#00808a] transition-colors">{e.name}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>{e.category}</p>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: TEAL }}>View &rarr;</span>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.15}>
              <Link to="/ai-equipment" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: TEAL }}>
                See all equipment &rarr;
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Agent CTA ──────────────────────────────────────────────── */}
      <section style={{ background: DARK }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 text-center">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>24/7 AI guidance</p>
            <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: 'white' }}>
              Need personalised advice?
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
              Our AI agent knows the full GetPromptly database. Ask it anything about tools, training, equipment or prompts for {d.title.toLowerCase()}.
            </p>
            <button
              onClick={() => { track({ name: 'agent_opened', section: `role-${d.slug}` }); openWidgetWithRole(d.agentRole); }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ background: TEAL, color: 'white' }}>
              <span className="relative flex w-2 h-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'white' }} />
                <span className="relative inline-flex rounded-full w-2 h-2" style={{ background: 'white' }} />
              </span>
              Ask Promptly AI as a {d.agentRole} &rarr;
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── Cross-links ────────────────────────────────────────────── */}
      <section style={{ background: BG }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Explore more</p>
            <h2 className="font-display text-2xl mb-8">The full GetPromptly platform.</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'AI Tools Hub',    stat: '155 tools',   to: '/tools',        color: '#e0f5f6' },
              { label: 'AI Training',     stat: '26 courses',  to: '/ai-training',  color: '#fef9c3' },
              { label: 'Equipment',       stat: '96 products', to: '/ai-equipment', color: '#ede9fe' },
              { label: 'Prompts Library', stat: '440+ prompts',to: '/prompts',      color: '#dcfce7' },
            ].map((c, i) => (
              <FadeIn key={c.label} delay={i * 0.05}>
                <Link to={c.to} className="group rounded-2xl border overflow-hidden transition-all hover:border-[#00808a] hover:shadow-sm"
                  style={{ borderColor: BORDER, background: 'white' }}>
                  <div className="h-2" style={{ background: c.color }} />
                  <div className="p-4">
                    <p className="text-sm font-semibold mb-0.5 group-hover:text-[#00808a] transition-colors">{c.label}</p>
                    <p className="text-[10px] font-semibold" style={{ color: TEAL }}>{c.stat}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Role data definitions ────────────────────────────────────────────────────

const TEACHER_DATA: RoleData = {
  slug: 'teachers', title: 'Teachers', emoji: '\u{1F4DA}', color: '#e0f5f6',
  heroTitle: 'AI tools, prompts and training built for UK teachers.',
  heroSub: 'Save hours on lesson planning, marking and differentiation. Every recommendation independently reviewed against KCSIE 2025.',
  seoTitle: 'AI for UK Teachers — Tools, Prompts & CPD | GetPromptly',
  seoDesc: 'Find the best AI tools, prompts and training for UK teachers. KCSIE 2025 safety scores, free CPD and ready-to-copy prompts.',
  seoKeywords: 'ai tools for teachers uk, ai prompts for teachers, teacher cpd ai, kcsie ai tools',
  promptsTo: '/prompts/teachers', promptsLabel: 'Teacher prompts', agentRole: 'teacher',
  promptHighlights: ['Lesson planning prompts', 'Marking and feedback', 'Differentiation by ability', 'Parent communication', 'Report writing', 'CPD reflection'],
  tools: [
    { name: 'MagicSchool', score: 9.1, tier: 'Trusted', desc: 'Lesson plans, rubrics, IEPs and 50+ AI tools purpose-built for teachers.' },
    { name: 'Curipod', score: 8.4, tier: 'Trusted', desc: 'Interactive lesson builder with AI-generated slides, polls and formative assessment.' },
    { name: 'Canva AI', score: 8.2, tier: 'Trusted', desc: 'AI-powered design for worksheets, presentations and classroom materials.' },
    { name: 'Diffit', score: 8.0, tier: 'Trusted', desc: 'Differentiate any text by reading level. Generate questions, vocabulary and summaries.' },
    { name: 'Quizlet', score: 7.8, tier: 'Guided', desc: 'AI flashcards and study sets. Good for revision but requires guided use with students.' },
    { name: 'Brisk Teaching', score: 8.5, tier: 'Trusted', desc: 'Chrome extension that works inside Google Docs for feedback, rubrics and lesson plans.' },
  ],
  training: [
    { title: 'GOV.UK AI Skills Hub', provider: 'UK Government', free: true, to: '/ai-training/free' },
    { title: 'Google AI Essentials', provider: 'Google / Coursera', free: true, to: '/ai-training/free' },
    { title: 'AI for Teachers Masterclass', provider: 'National College', free: false, to: '/ai-training/paid' },
  ],
  equipment: [
    { name: 'Interactive Displays', category: 'SMART, Promethean, Clevertouch', to: '/ai-equipment/category/interactive-displays' },
    { name: 'Classroom Visualisers', category: 'HUE HD Pro, AVer', to: '/ai-equipment/teachers' },
    { name: 'Coding Robots', category: 'Bee-Bot, Blue-Bot, Ohbot', to: '/ai-equipment/category/coding-robots' },
  ],
};

const LEADER_DATA: RoleData = {
  slug: 'school-leaders', title: 'School Leaders', emoji: '\u{1F3EB}', color: '#fef9c3',
  heroTitle: 'Lead your school\'s AI strategy with confidence.',
  heroSub: 'From AI policy to Ofsted readiness, staff CPD to procurement. GetPromptly gives you the evidence and tools to lead.',
  seoTitle: 'AI for School Leaders — Strategy & CPD | GetPromptly',
  seoDesc: 'AI strategy, policy templates and CPD for UK headteachers and SLT. Independent tool reviews and KCSIE 2025 compliance guidance.',
  seoKeywords: 'ai for school leaders, ai policy schools uk, headteacher ai strategy, school ai cpd',
  promptsTo: '/prompts/school-leaders', promptsLabel: 'Leadership prompts', agentRole: 'school leader',
  promptHighlights: ['AI policy drafting', 'Ofsted self-evaluation', 'Staff communication', 'School improvement planning', 'Governor reports', 'Budget proposals'],
  tools: [
    { name: 'Microsoft Copilot', score: 8.0, tier: 'Trusted', desc: 'Integrated into Office 365. Strong for drafting, data analysis and communication.' },
    { name: 'ChatGPT', score: 6.8, tier: 'Guided', desc: 'Powerful general AI but needs careful governance for school use. Not KCSIE-aligned by default.' },
    { name: 'Google Gemini', score: 7.5, tier: 'Guided', desc: 'Free with Google Workspace for Education. Good for admin tasks and communication.' },
  ],
  training: [
    { title: 'Leading AI in Schools', provider: 'DfE / TeachComputing', free: true, to: '/ai-training/leaders' },
    { title: 'AI Strategy for School Leaders', provider: 'National College', free: false, to: '/ai-training/leaders' },
    { title: 'GOV.UK AI Skills Hub', provider: 'UK Government', free: true, to: '/ai-training/free' },
  ],
  equipment: [
    { name: 'School Procurement Guide', category: 'Budgeting and supplier routes', to: '/ai-equipment/schools' },
    { name: 'Interactive Displays', category: 'Whole-school rollout options', to: '/ai-equipment/category/interactive-displays' },
  ],
};

const SENCO_DATA: RoleData = {
  slug: 'senco', title: 'SENCOs', emoji: '\u{1F91D}', color: '#ede9fe',
  heroTitle: 'SEND-specific AI guidance for UK SENCOs.',
  heroSub: 'EHCP support, assistive technology reviews, provision mapping prompts and SEND-focused training. All in one place.',
  seoTitle: 'AI for SENCOs — SEND Tools & Prompts | GetPromptly',
  seoDesc: 'SEND-focused AI tools, EHCP prompts and assistive technology reviews for UK SENCOs. Independent, KCSIE-aligned guidance.',
  seoKeywords: 'ai for senco, send ai tools uk, ehcp prompts, assistive technology schools',
  promptsTo: '/prompts/senco', promptsLabel: 'SENCO prompts', agentRole: 'SENCO',
  promptHighlights: ['EHCP annual review prep', 'Provision mapping', 'Parent meeting notes', 'Access arrangements', 'SEND policy updates', 'Differentiation strategies'],
  tools: [
    { name: 'Claro Read', score: 8.8, tier: 'Trusted', desc: 'Text-to-speech, screen reading and study tools designed for learners with dyslexia and visual needs.' },
    { name: 'Immersive Reader', score: 9.0, tier: 'Trusted', desc: 'Microsoft accessibility tool. Line focus, syllable breakdown, picture dictionary. Free with Office.' },
    { name: 'Speechify', score: 7.6, tier: 'Guided', desc: 'AI text-to-speech with natural voices. Useful for reading access but check data handling.' },
    { name: 'MagicSchool', score: 9.1, tier: 'Trusted', desc: 'IEP writer, accommodation suggestions and behaviour intervention tools built for SEND.' },
  ],
  training: [
    { title: 'AI for SEND Practitioners', provider: 'Nasen / DfE', free: true, to: '/ai-training/send' },
    { title: 'Assistive Technology CPD', provider: 'AbilityNet', free: false, to: '/ai-training/send' },
    { title: 'GOV.UK AI Skills Hub', provider: 'UK Government', free: true, to: '/ai-training/free' },
  ],
  equipment: [
    { name: 'AAC Devices', category: 'Tobii Dynavox, Grid Pad', to: '/ai-equipment/send' },
    { name: 'Sensory Equipment', category: 'SpaceKraft, Rompa', to: '/ai-equipment/send' },
    { name: 'Eye-gaze Systems', category: 'Tobii, Smartbox', to: '/ai-equipment/send' },
    { name: 'Reading Pens', category: 'C-Pen, Scanning Pens', to: '/ai-equipment/category/reading-pens' },
  ],
};

const PARENT_DATA: RoleData = {
  slug: 'parents', title: 'Parents', emoji: '\u{1F3E0}', color: '#fce7f3',
  heroTitle: 'Help your child learn safely with AI.',
  heroSub: 'Homework support, revision tools, safe AI guidance and SEN advocacy prompts. Trusted recommendations from UK education experts.',
  seoTitle: 'AI for Parents — Safe Tools & Revision Help | GetPromptly',
  seoDesc: 'Safe AI tools and revision prompts for UK parents. Help your child study smarter with independently reviewed, KCSIE-aligned recommendations.',
  seoKeywords: 'ai for parents uk, safe ai for children, revision tools ai, homework help ai',
  promptsTo: '/prompts/parents', promptsLabel: 'Parent prompts', agentRole: 'parent',
  promptHighlights: ['Homework help prompts', 'Revision techniques', 'School communication', 'SEN advocacy letters', 'Reading support', 'Exam preparation'],
  tools: [
    { name: 'Khan Academy', score: 9.2, tier: 'Trusted', desc: 'Free maths, science and computing courses with AI tutoring. Safe and age-appropriate.' },
    { name: 'Duolingo', score: 8.5, tier: 'Trusted', desc: 'AI-powered language learning. Gamified, engaging and safe for all ages.' },
    { name: 'Quizlet', score: 7.8, tier: 'Guided', desc: 'Flashcard-based revision with AI study modes. Good with parental guidance.' },
  ],
  training: [
    { title: 'AI Safety for Parents', provider: 'Internet Matters', free: true, to: '/ai-training/parents' },
    { title: 'GOV.UK AI Skills Hub', provider: 'UK Government', free: true, to: '/ai-training/free' },
  ],
  equipment: [
    { name: 'Home Learning Tablets', category: 'iPad, Fire HD Kids, Samsung', to: '/ai-equipment/parents' },
    { name: 'Reading Pens', category: 'C-Pen Reader, Scanning Pen', to: '/ai-equipment/category/reading-pens' },
  ],
};

const STUDENT_DATA: RoleData = {
  slug: 'students', title: 'Students', emoji: '\u{1F393}', color: '#dcfce7',
  heroTitle: 'Study smarter with AI that is safe to use.',
  heroSub: 'Revision prompts, exam prep tools and study techniques. Every recommendation checked for safety by UK education experts.',
  seoTitle: 'AI for Students — Revision & Study Tools | GetPromptly',
  seoDesc: 'Safe AI tools and revision prompts for UK students. Exam prep, essay writing and study techniques reviewed for safety.',
  seoKeywords: 'ai for students uk, revision tools ai, gcse ai help, safe ai for students',
  promptsTo: '/prompts/students', promptsLabel: 'Student prompts', agentRole: 'student',
  promptHighlights: ['Essay structure prompts', 'GCSE revision', 'A-level exam prep', 'Study timetable builder', 'Source analysis', 'Maths problem solving'],
  tools: [
    { name: 'Khan Academy', score: 9.2, tier: 'Trusted', desc: 'Free courses in maths, science and computing with built-in AI tutor.' },
    { name: 'Quizlet', score: 7.8, tier: 'Guided', desc: 'AI flashcards and practice tests. Good for revision when used with teacher guidance.' },
    { name: 'Notion AI', score: 7.2, tier: 'Guided', desc: 'AI note-taking and organisation. Useful for older students with guided setup.' },
  ],
  training: [
    { title: 'How to Use AI Safely', provider: 'Internet Matters', free: true, to: '/ai-training/students' },
    { title: 'Google AI Essentials', provider: 'Google / Coursera', free: true, to: '/ai-training/free' },
  ],
  equipment: [
    { name: 'Study Tablets', category: 'iPad, Chromebook, Fire HD', to: '/ai-equipment/students' },
  ],
};

const ADMIN_DATA: RoleData = {
  slug: 'admin', title: 'School Admin', emoji: '\u{1F4CB}', color: '#fff7ed',
  heroTitle: 'Cut admin hours with AI that works.',
  heroSub: 'Letters, templates, timetabling and data prompts. Practical AI tools reviewed for school office use.',
  seoTitle: 'AI for School Admin — Templates & Tools | GetPromptly',
  seoDesc: 'AI prompts and tools for UK school admin staff. Letters, timetabling, data and communication templates ready to use.',
  seoKeywords: 'ai for school admin, school office ai tools, admin prompts schools',
  promptsTo: '/prompts/admin', promptsLabel: 'Admin prompts', agentRole: 'school admin',
  promptHighlights: ['Parent letters', 'Policy templates', 'Timetabling help', 'Data reporting', 'Staff communication', 'Meeting minutes'],
  tools: [
    { name: 'ChatGPT', score: 6.8, tier: 'Guided', desc: 'Strong for drafting letters, policies and communications. Needs governance for school use.' },
    { name: 'Microsoft Copilot', score: 8.0, tier: 'Trusted', desc: 'Works inside Word, Excel and Outlook. Ideal for school admin workflows.' },
    { name: 'Google Gemini', score: 7.5, tier: 'Guided', desc: 'Free with Google Workspace. Good for email drafting and spreadsheet tasks.' },
  ],
  training: [
    { title: 'GOV.UK AI Skills Hub', provider: 'UK Government', free: true, to: '/ai-training/free' },
    { title: 'Google AI Essentials', provider: 'Google / Coursera', free: true, to: '/ai-training/free' },
  ],
  equipment: [],
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const TeachersPage: FC     = () => <RolePage data={TEACHER_DATA} />;
export const LeadersPage: FC      = () => <RolePage data={LEADER_DATA} />;
export const SencoPage: FC        = () => <RolePage data={SENCO_DATA} />;
export const ParentsRolePage: FC  = () => <RolePage data={PARENT_DATA} />;
export const StudentsRolePage: FC = () => <RolePage data={STUDENT_DATA} />;
export const AdminRolePage: FC    = () => <RolePage data={ADMIN_DATA} />;

export default RolePage;
