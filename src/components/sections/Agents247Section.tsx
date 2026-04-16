/**
 * Agents247Section.tsx
 * Dark-navy hero section — "Introducing your trusted agents in education — on call 24/7."
 *
 * Layout  : Two-column on lg+  (headline left · laptop right)
 * BG      : Deep navy #0F172A · lime-green wave contour lines · space-dust particles
 * Laptop  : SVG shell · animated Notion-style chat inside the screen
 * CTA     : Coral "Speak with an Agent" — fixed-position floating button (appears on scroll)
 */

import { FC, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────

const CORAL   = '#F05A4A';
const NAVY    = '#0F172A';
const LIME    = '#84CC16';

// ── Space-dust particles ───────────────────────────────────────────────────

interface Particle { id: number; x: number; y: number; r: number; dur: number; delay: number; op: number; tint: string; }

function makeParticles(n: number): Particle[] {
  const tints = ['#fff', '#fff', '#fff', '#fff', CORAL, LIME, '#93C5FD', '#C4B5FD'];
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 2.4 + 0.4,
    dur: Math.random() * 10 + 7,
    delay: Math.random() * 10,
    op: Math.random() * 0.5 + 0.12,
    tint: tints[Math.floor(Math.random() * tints.length)],
  }));
}

// ── Wave SVG ───────────────────────────────────────────────────────────────

const WaveLines: FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1200 700"
    fill="none"
    style={{ opacity: 0.07 }}
  >
    {Array.from({ length: 18 }, (_, i) => (
      <path
        key={i}
        d={`M-100 ${55 + i * 38} Q300 ${20 + i * 38} 600 ${55 + i * 38} T1300 ${55 + i * 38}`}
        stroke={LIME}
        strokeWidth="1.3"
      />
    ))}
  </svg>
);

// ── Chat messages ──────────────────────────────────────────────────────────

interface ChatMsg {
  id: number;
  from: 'user' | 'agent';
  avatar: string;
  name: string;
  text: string;
  delay: number; // ms before this message appears in the loop
}

const CHAT_SEQUENCE: ChatMsg[] = [
  {
    id: 1,
    from: 'user',
    avatar: '👩‍🏫',
    name: 'Mrs Patel',
    text: 'Which AI tools are safe for my Year 5 class?',
    delay: 0,
  },
  {
    id: 2,
    from: 'agent',
    avatar: '🤖',
    name: 'Promptly Agent',
    text: "For Year 5, I recommend Khanmigo (9.5/10), Canva Magic (9.3), and Read&Write (9.1) — all GDPR-compliant with full teacher controls. Want a comparison?",
    delay: 1400,
  },
  {
    id: 3,
    from: 'user',
    avatar: '👨‍👧',
    name: 'Parent',
    text: 'Is ChatGPT safe for my 11-year-old at home?',
    delay: 4200,
  },
  {
    id: 4,
    from: 'agent',
    avatar: '🤖',
    name: 'Promptly Agent',
    text: "ChatGPT scores 8.5/10. Enable parental controls and consider the Edu plan. I'd supervise under-13 use. Would you like safer alternatives?",
    delay: 5800,
  },
  {
    id: 5,
    from: 'user',
    avatar: '👩‍💼',
    name: 'SENCO',
    text: 'What tools best support our SEND learners?',
    delay: 9200,
  },
  {
    id: 6,
    from: 'agent',
    avatar: '🤖',
    name: 'Promptly Agent',
    text: "Top picks: Immersive Reader (9.3), Read&Write (9.1), Speechify (8.8). All support dyslexia, autism & visual needs. Free school licences available.",
    delay: 10800,
  },
];

const LOOP_DURATION = 15000; // ms before chat resets

// ── Laptop screen chat ─────────────────────────────────────────────────────

const LaptopChat: FC = () => {
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [typing, setTyping]         = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setVisibleIds([]);
      setTyping(false);

      CHAT_SEQUENCE.forEach((msg) => {
        // Show "typing…" just before agent replies
        if (msg.from === 'agent') {
          const t1 = setTimeout(() => setTyping(true), msg.delay - 700);
          const t2 = setTimeout(() => {
            setTyping(false);
            setVisibleIds((prev) => [...prev, msg.id]);
          }, msg.delay);
          timeouts.push(t1, t2);
        } else {
          const t = setTimeout(() => {
            setVisibleIds((prev) => [...prev, msg.id]);
          }, msg.delay);
          timeouts.push(t);
        }
      });

      const reset = setTimeout(() => run(), LOOP_DURATION);
      timeouts.push(reset);
    };

    run();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Auto-scroll inside the laptop screen
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleIds, typing]);

  const visible = CHAT_SEQUENCE.filter((m) => visibleIds.includes(m.id));

  return (
    <div className="flex flex-col h-full bg-[#0D1117] rounded-b-[3px] overflow-hidden">
      {/* Chrome bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
        style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
        <div
          className="ml-2 flex-1 h-4 rounded-sm text-[9px] text-center leading-4"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#4B5563' }}
        >
          getpromptly.co.uk/agent
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-hide" style={{ overscrollBehavior: 'contain' }}>
        <AnimatePresence initial={false}>
          {visible.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className={`flex items-start gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] flex-shrink-0"
                style={{
                  background: msg.from === 'agent'
                    ? 'rgba(240,90,74,0.18)'
                    : 'rgba(132,204,22,0.15)',
                }}
              >
                {msg.avatar}
              </div>

              {/* Bubble */}
              <div className={`max-w-[78%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                <span className="text-[8px] font-semibold" style={{ color: '#4B5563' }}>
                  {msg.name}
                </span>
                <div
                  className="px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed"
                  style={{
                    background: msg.from === 'agent'
                      ? 'rgba(240,90,74,0.12)'
                      : 'rgba(255,255,255,0.07)',
                    border: msg.from === 'agent'
                      ? '1px solid rgba(240,90,74,0.2)'
                      : '1px solid rgba(255,255,255,0.08)',
                    color: msg.from === 'agent' ? '#FCA5A5' : '#D1D5DB',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                style={{ background: 'rgba(240,90,74,0.18)' }}
              >
                🤖
              </div>
              <div
                className="flex gap-1 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(240,90,74,0.1)', border: '1px solid rgba(240,90,74,0.18)' }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: CORAL }}
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#161B22' }}
      >
        <div
          className="flex-1 h-6 rounded-lg text-[9px] px-2 flex items-center"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#374151' }}
        >
          Ask an agent…
        </div>
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: CORAL }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// ── Laptop shell ───────────────────────────────────────────────────────────

const Laptop: FC = () => (
  <div className="relative w-full max-w-[560px] mx-auto select-none">
    {/* Glow behind laptop */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-3xl"
      style={{
        background: `radial-gradient(ellipse 70% 55% at 50% 48%, rgba(240,90,74,0.22) 0%, rgba(132,204,22,0.1) 50%, transparent 75%)`,
        filter: 'blur(32px)',
        transform: 'scale(1.15)',
      }}
    />

    {/* Screen bezel */}
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#1C1C1E',
        border: '3px solid #2A2A2E',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.6)',
        aspectRatio: '16/10',
      }}
    >
      <LaptopChat />
    </div>

    {/* Base / hinge */}
    <div
      className="h-3 rounded-b-xl mx-3 -mt-px"
      style={{ background: 'linear-gradient(to bottom, #2A2A2E, #1A1A1C)' }}
    />
    <div
      className="h-2 rounded-b-2xl mx-0"
      style={{
        background: 'linear-gradient(to bottom, #222224, #111113)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    />
    {/* Notch */}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-t-full"
      style={{ background: '#0A0A0C' }}
    />
  </div>
);

// ── Main section ───────────────────────────────────────────────────────────

const Agents247Section: FC = () => {
  const particles = useRef<Particle[]>(makeParticles(70));

  return (
    <section
      id="agents"
      aria-labelledby="agents-heading"
      className="relative w-full"
      style={{ background: NAVY, scrollMarginTop: '64px' }}
    >
      {/* Decorative layer — clipped separately so it never traps page scroll */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <WaveLines />

        {/* Space dust */}
        {particles.current.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width:      p.r * 2,
              height:     p.r * 2,
              left:       `${p.x}%`,
              top:        `${p.y}%`,
              background: p.tint,
              opacity:    p.op,
            }}
            animate={{ y: [0, -20, 5, 0], opacity: [p.op, p.op * 0.3, p.op * 0.8, p.op] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Ambient glow orbs — inside the clipped decorative wrapper */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: '-15%', left: '-10%',
            background: `radial-gradient(circle, rgba(132,204,22,0.1) 0%, transparent 65%)`,
            filter: 'blur(70px)',
          }}
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '-12%', right: '-8%',
            background: `radial-gradient(circle, rgba(240,90,74,0.12) 0%, transparent 65%)`,
            filter: 'blur(70px)',
          }}
          animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* ── Content grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28
                      flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

        {/* ─── Left: copy ─── */}
        <motion.div
          className="flex-1 max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold
                       tracking-widest uppercase mb-7"
            style={{
              background: 'rgba(240,90,74,0.12)',
              border: `1px solid rgba(240,90,74,0.28)`,
              color: CORAL,
            }}
          >
            <motion.span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: CORAL }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            Live · On Call 24/7
          </motion.span>

          {/* Headline */}
          <h2
            id="agents-heading"
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              color: '#fff',
              lineHeight: 1.15,
            }}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold"
          >
            Introducing your{' '}
            <span style={{ color: CORAL }}>trusted agents</span>
            {' '}in education —
            <br className="hidden sm:block" />
            <span style={{ color: LIME }}> on call 24/7.</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg leading-relaxed" style={{ color: '#94A3B8' }}>
            Ask Promptly's AI agents — get clear, reliable guidance on AI tools,
            safety, training, equipment, and UK education policy whenever you need it.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: '🛡️', label: 'Safety Guidance' },
              { icon: '🏫', label: 'UK Education Policy' },
              { icon: '🔧', label: 'Tool Recommendations' },
              { icon: '🎓', label: 'Staff Training Advice' },
              { icon: '♿', label: 'SEND Support' },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#CBD5E1',
                }}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-10">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white text-sm"
              style={{
                background: CORAL,
                boxShadow: `0 4px 28px rgba(240,90,74,0.42)`,
              }}
            >
              <span aria-hidden="true">🤖</span>
              Speak with an Agent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.25)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#E2E8F0',
              }}
            >
              Learn more →
            </motion.button>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs" style={{ color: '#334155' }}>
            100% independent · GDPR compliant · No account needed
          </p>
        </motion.div>

        {/* ─── Right: Laptop ─── */}
        <motion.div
          className="flex-1 w-full max-w-[560px] lg:max-w-none"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Laptop />

          {/* Below laptop — agent avatars */}
          <div className="flex items-center justify-center gap-3 mt-7">
            {['👩‍🏫', '👨‍💼', '🧑‍🎓', '👩‍💻', '🤖'].map((emoji, i) => (
              <motion.div
                key={emoji}
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${i === 4 ? CORAL : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: i === 4 ? `0 0 16px rgba(240,90,74,0.35)` : undefined,
                }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                {emoji}
              </motion.div>
            ))}
            <span className="text-xs ml-1" style={{ color: '#475569' }}>
              Real agents · Real answers
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Agents247Section;
