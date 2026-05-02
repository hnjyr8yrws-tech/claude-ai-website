import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { BubbleLayer } from '../components/Bubbles';

const TEAL = '#BEFF00';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── What we cover ────────────────────────────────────────────────────────────

const PILLARS = [
  {
    title: 'AI Tools',
    stat: '120+',
    statLabel: 'tools reviewed',
    desc: 'Every major AI tool assessed against UK safety standards — KCSIE 2025, UK GDPR and Ofsted expectations. With real safety scores and independent editorial.',
    link: '/tools',
    linkLabel: 'Browse AI tools →',
  },
  {
    title: 'Equipment',
    stat: '96',
    statLabel: 'products curated',
    desc: 'Classroom technology, SEND assistive tech, coding robots, AAC devices and home learning hardware — all independently reviewed for UK education.',
    link: '/ai-equipment',
    linkLabel: 'Browse equipment →',
  },
  {
    title: 'Training',
    stat: '26+',
    statLabel: 'training resources',
    desc: 'Free and paid CPD for teachers, leaders, parents and students. From UK Government-backed resources to premium certificates.',
    link: '/ai-training',
    linkLabel: 'Browse training →',
  },
  {
    title: 'Prompts',
    stat: '440+',
    statLabel: 'ready-to-copy prompts',
    desc: 'Fifty curated prompt packs for every education role — lesson planning, EHCP support, exam prep, parent communication and more.',
    link: '/prompts',
    linkLabel: 'Browse prompts →',
  },
];

// ─── Who we serve ─────────────────────────────────────────────────────────────

const AUDIENCES = [
  { role: 'Teachers',        desc: 'Lesson planning, marking, differentiation, CPD' },
  { role: 'School Leaders',  desc: 'Strategy, Ofsted, staff CPD, policy' },
  { role: 'SENCOs',          desc: 'EHCP support, provision mapping, access arrangements' },
  { role: 'Parents',         desc: 'Home learning, school communication, SEN advocacy' },
  { role: 'Students',        desc: 'Revision, essay writing, study skills, exam prep' },
  { role: 'School Admin',    desc: 'Letters, templates, data, timetabling' },
  { role: 'IT Leads',        desc: 'Device procurement, safeguarding, infrastructure' },
  { role: 'Governors',       desc: 'Policy oversight, strategic AI guidance' },
];

// ─── How we work ──────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    n: '01',
    title: 'Research',
    desc: 'We review tools, training, equipment and prompts using UK education standards — DfE guidance, KCSIE 2025 and Ofsted\'s emerging AI expectations.',
  },
  {
    n: '02',
    title: 'Score',
    desc: 'We apply transparent safety and suitability scoring across five pillars: data privacy, age appropriateness, transparency, safeguarding alignment and accessibility.',
  },
  {
    n: '03',
    title: 'Curate',
    desc: 'We select what genuinely serves UK educators and families — not what pays to be featured. No sponsored rankings, no paid placements.',
  },
  {
    n: '04',
    title: 'Explain',
    desc: 'We write honest, practical content that anyone — teacher, parent or leader — can act on without needing a technology background.',
  },
  {
    n: '05',
    title: 'Guide',
    desc: 'Our 24/7 AI agents deliver personalised recommendations in real time, trained on our full database of tools, training, equipment and prompts.',
  },
];

// ─── Why trust ────────────────────────────────────────────────────────────────

const TRUST = [
  'UK education focus — built around DfE, Ofsted and KCSIE 2025',
  'SEND-aware without being SEND-exclusive — for the whole school community',
  'Human curation + AI assistance — not fully automated or algorithm-driven',
  'No sponsored rankings — we recommend what works, not what pays',
  'Live 24/7 agents trained on our full database of reviewed resources',
  'Small expert team with real UK education experience',
];

// ─── Team ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Chloe',
    title: 'Operations & AI Systems Lead',
    bio: '[PLACEHOLDER — Paste Chloe\'s bio here. Suggested length: 2–3 sentences covering background, role at GetPromptly, and relevant expertise.]',
  },
  {
    name: 'Donna',
    title: 'Education & SEND Specialist',
    bio: '[PLACEHOLDER — Paste Donna\'s bio here. Suggested length: 2–3 sentences covering background, role at GetPromptly, and relevant expertise.]',
  },
  {
    name: 'Charlie',
    title: 'Strategy & Business Lead',
    bio: '[PLACEHOLDER — Paste Charlie\'s bio here. Suggested length: 2–3 sentences covering background, role at GetPromptly, and relevant expertise.]',
  },
];

// ─── Role CTAs ────────────────────────────────────────────────────────────────

const ROLE_CTAS = [
  {
    label: 'For Schools',
    desc: 'Request a consultation for your school',
    action: 'widget' as const,
    cta: 'Talk to us →',
  },
  {
    label: 'For Parents',
    desc: 'Find the right tools and prompts for your child',
    to: '/prompts/parents',
    cta: 'Browse parent resources →',
  },
  {
    label: 'For Teachers',
    desc: 'Browse AI tools and training for your classroom',
    to: '/tools',
    cta: 'Explore teacher resources →',
  },
  {
    label: 'For Everyone',
    desc: 'Ask our 24/7 AI agent anything about AI in education',
    action: 'widget' as const,
    cta: 'Ask the AI →',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhoWeAre() {
  function openWidget() {
    const btn = document.getElementById('promptly-widget-trigger');
    if (btn) (btn as HTMLButtonElement).click();
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Who We Are — GetPromptly | AI Guidance for UK Education"
        description="GetPromptly curates AI tools, training, equipment and prompts for UK educators, parents, students and school leaders. Meet the team and learn how we work."
        keywords="about GetPromptly, UK AI education platform, AI tools for schools UK, EdTech advisory UK, KCSIE AI guidance"
        path="/who-we-are"
      />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 sm:px-8 pt-20 pb-16"
        style={{ background: 'linear-gradient(180deg, #0F1C1A 0%, #142522 60%, #1B302C 100%)' }}
      >
        <BubbleLayer
          bubbles={[
            { variant: 'lime',        size: 240, top: '-50px',   left: '-50px',  anim: 'gp-float-a' },
            { variant: 'cyan',        size: 200, top: '40px',    right: '-50px', anim: 'gp-float-b' },
            { variant: 'soft-purple', size: 280, bottom: '-110px', left: '35%',  anim: 'gp-float-c' },
          ]}
        />
        <div className="relative max-w-4xl mx-auto">
          <SectionLabel variant="dark">About GetPromptly</SectionLabel>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl mb-5 mt-3 leading-[1.05] tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            Helping UK Education<br />
            <span
              className="italic"
              style={{
                backgroundImage: 'linear-gradient(90deg, #BEFF00 0%, #00D1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              make smarter decisions about AI.
            </span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            GetPromptly curates AI tools, training, equipment and prompts for every corner of UK education — teachers, leaders, parents, students, SENCOs and school teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/tools"
              className="inline-block px-6 py-3.5 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                color: '#0F1C1A',
                boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 8px 24px rgba(190,255,0,0.25)',
              }}
            >
              Explore the Platform →
            </Link>
            <button
              onClick={openWidget}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Talk to Us
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY WE EXIST ─────────────────────────────────────────────────────── */}
      <div className="border-t border-b" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <SectionLabel>Why we exist</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl mb-8" style={{ color: 'var(--text)' }}>
              AI is moving faster than guidance.
            </h2>
          </FadeIn>

          <div className="space-y-5 text-base leading-relaxed" style={{ color: '#4A4A4A' }}>
            <FadeIn delay={0.05}>
              <p>
                Schools, families and educators face a flood of AI tools, platforms and claims with very little trusted, UK-specific, education-first advice to guide them. Every week brings new products, new use cases and new risks — but very few independent voices explaining what any of it actually means for a classroom teacher, a SENCO, a school leader or a parent.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p>
                GetPromptly was built to change that. We curate and explain — covering tools, training, equipment and prompts for the full range of UK education roles. Not just SEND, not just secondary, not just tech enthusiasts. Everything we publish is grounded in real UK education standards: DfE guidance, KCSIE 2025, UK GDPR and Ofsted's emerging AI expectations.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p>
                We are the only UK EdTech advisory platform with live 24/7 AI agents embedded throughout the site — combining independent human expertise with real-time intelligent guidance. Ask the agent about any tool, training course or product and it draws on our full reviewed database to give you a relevant, honest answer.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p>
                Our commitment is practical, honest and UK-focused. We are SEND-aware but not SEND-exclusive. Built for the whole school community — because AI affects everyone in education, and everyone deserves clear guidance.
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ── WHAT WE COVER ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <FadeIn>
          <SectionLabel>What we cover</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            Four sections. One platform.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.07}>
              <div
                className="rounded-2xl border p-6 flex flex-col h-full"
                style={{ borderColor: '#ECE7DD', background: 'white' }}
              >
                <div className="mb-4">
                  <div className="font-display text-3xl" style={{ color: TEAL }}>{p.stat}</div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{p.statLabel}</div>
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#4A4A4A' }}>{p.desc}</p>
                <Link
                  to={p.link}
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: TEAL }}
                >
                  {p.linkLabel}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── WHO WE SERVE ─────────────────────────────────────────────────────── */}
      <div className="border-t border-b" style={{ borderColor: '#ECE7DD', background: '#F8F5F0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <SectionLabel>Who we serve</SectionLabel>
            <h2 className="font-display text-3xl mb-3" style={{ color: 'var(--text)' }}>
              For every role in education.
            </h2>
            <p className="text-sm mb-10 max-w-xl" style={{ color: '#4A4A4A' }}>
              GetPromptly isn't built for one audience. It's built for the whole school community — and for families navigating AI alongside their children.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {AUDIENCES.map((a, i) => (
              <FadeIn key={a.role} delay={i * 0.05}>
                <div
                  className="rounded-2xl border p-4"
                  style={{ borderColor: '#ECE7DD', background: 'white' }}
                >
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{a.role}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{a.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <FadeIn>
          <SectionLabel>The team</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            Small team. Real expertise.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map((member, i) => (
            <FadeIn key={member.name} delay={i * 0.08}>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: '#ECE7DD', background: 'white' }}
              >
                {/* Photo placeholder */}
                <div
                  className="w-full aspect-square flex items-center justify-center"
                  style={{ background: '#F8F5F0', borderBottom: '1px solid #ECE7DD' }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: '#e0f5f6' }}
                  >
                    <span className="font-display text-3xl" style={{ color: TEAL }}>
                      {member.name[0]}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-xl mb-0.5" style={{ color: 'var(--text)' }}>
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold mb-3" style={{ color: TEAL }}>
                    {member.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── HOW WE WORK ──────────────────────────────────────────────────────── */}
      <div className="border-t border-b" style={{ borderColor: '#ECE7DD', background: 'white' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <SectionLabel>How we work</SectionLabel>
            <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
              Research. Score. Curate. Explain. Guide.
            </h2>
          </FadeIn>

          <div className="space-y-5">
            {HOW_STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.06}>
                <div
                  className="flex gap-5 p-5 rounded-xl border"
                  style={{ borderColor: '#ECE7DD' }}
                >
                  <span
                    className="font-display text-2xl flex-shrink-0 w-10 text-center leading-none mt-0.5"
                    style={{ color: TEAL }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY TRUST US ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <FadeIn>
          <SectionLabel>Why trust GetPromptly</SectionLabel>
          <h2 className="font-display text-3xl mb-10" style={{ color: 'var(--text)' }}>
            Independent. Honest. UK-first.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRUST.map((item, i) => (
            <FadeIn key={item} delay={i * 0.05}>
              <div
                className="flex items-start gap-3 p-5 rounded-xl border"
                style={{ borderColor: '#ECE7DD', background: 'white' }}
              >
                <span
                  className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: '#e0f5f6', color: TEAL }}
                >
                  ✓
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>{item}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── ROLE-BASED CTAS ──────────────────────────────────────────────────── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: TEAL }}>
              Start here
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mb-10 text-center" style={{ color: 'white' }}>
              Where would you like to go?
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLE_CTAS.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.06}>
                <div
                  className="rounded-2xl border p-5 flex flex-col gap-4"
                  style={{ borderColor: '#2a2825', background: '#1a1815' }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TEAL }}>
                      {item.label}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                      {item.desc}
                    </p>
                  </div>
                  {'to' in item ? (
                    <Link
                      to={item.to!}
                      className="text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ color: 'white' }}
                    >
                      {item.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={openWidget}
                      className="text-left text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ color: 'white' }}
                    >
                      {item.cta}
                    </button>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
