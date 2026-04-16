/**
 * AgentChatModal.tsx
 *
 * Exports:
 *   AgentChatModal   — full-screen modal with laptop-shell chat demo (mount once in App root)
 *   FloatingAgentBtn — coral floating button; click opens the modal via custom event
 *
 * Any component can open the modal:
 *   window.dispatchEvent(new CustomEvent('open-agent-chat'))
 */

import { FC, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────

const CORAL = '#F05A4A';
const NAVY  = '#0F172A';
const LIME  = '#84CC16';

// ── Chat sequence (same as Agents 24/7 section) ────────────────────────────

interface ChatMsg {
  id: number;
  from: 'user' | 'agent';
  avatar: string;
  name: string;
  text: string;
  delay: number;
}

const CHAT_SEQUENCE: ChatMsg[] = [
  {
    id: 1, from: 'user', avatar: '👩‍🏫', name: 'Mrs Patel',
    text: 'Which AI tools are safe for my Year 5 class?', delay: 0,
  },
  {
    id: 2, from: 'agent', avatar: '🤖', name: 'Promptly Agent',
    text: "For Year 5, I recommend Khanmigo (9.5/10), Canva Magic (9.3), and Read&Write (9.1) — all GDPR-compliant with full teacher controls. Want a comparison?",
    delay: 1400,
  },
  {
    id: 3, from: 'user', avatar: '👨‍👧', name: 'Parent',
    text: 'Is ChatGPT safe for my 11-year-old at home?', delay: 4200,
  },
  {
    id: 4, from: 'agent', avatar: '🤖', name: 'Promptly Agent',
    text: "ChatGPT scores 8.5/10. Enable parental controls and consider the Edu plan. I'd supervise under-13 use. Would you like safer alternatives?",
    delay: 5800,
  },
  {
    id: 5, from: 'user', avatar: '👩‍💼', name: 'SENCO',
    text: 'What tools best support our SEND learners?', delay: 9200,
  },
  {
    id: 6, from: 'agent', avatar: '🤖', name: 'Promptly Agent',
    text: "Top picks: Immersive Reader (9.3), Read&Write (9.1), Speechify (8.8). All support dyslexia, autism & visual needs. Free school licences available.",
    delay: 10800,
  },
];

const LOOP_MS = 15000;

// ── LaptopChat — the animated message area inside the screen ───────────────

const LaptopChat: FC<{ running: boolean }> = ({ running }) => {
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [typing, setTyping]         = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!running) return;
    let ts: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setVisibleIds([]);
      setTyping(false);
      CHAT_SEQUENCE.forEach((msg) => {
        if (msg.from === 'agent') {
          ts.push(setTimeout(() => setTyping(true), msg.delay - 700));
          ts.push(setTimeout(() => {
            setTyping(false);
            setVisibleIds((p) => [...p, msg.id]);
          }, msg.delay));
        } else {
          ts.push(setTimeout(() => setVisibleIds((p) => [...p, msg.id]), msg.delay));
        }
      });
      ts.push(setTimeout(run, LOOP_MS));
    };

    run();
    return () => ts.forEach(clearTimeout);
  }, [running]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [visibleIds, typing]);

  const visible = CHAT_SEQUENCE.filter((m) => visibleIds.includes(m.id));

  return (
    <div className="flex flex-col h-full" style={{ background: '#0D1117', borderRadius: '0 0 3px 3px' }}>
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
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ overscrollBehavior: 'contain' }}
      >
        <AnimatePresence initial={false}>
          {visible.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26 }}
              className={`flex items-start gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
            >
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
              <div className={`max-w-[78%] flex flex-col gap-0.5 ${msg.from === 'user' ? 'items-end' : ''}`}>
                <span className="text-[8px] font-semibold" style={{ color: '#4B5563' }}>{msg.name}</span>
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
        <div ref={endRef} />
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
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1.5 7.5L7.5 1.5M7.5 1.5H3M7.5 1.5V6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// ── Laptop shell (same proportions as Agents 24/7 section) ─────────────────

const LaptopShell: FC<{ running: boolean }> = ({ running }) => (
  <div className="relative w-full max-w-[600px] mx-auto select-none">
    {/* Glow */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-3xl pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 70% 55% at 50% 48%, rgba(240,90,74,0.2) 0%, rgba(132,204,22,0.08) 55%, transparent 75%)`,
        filter: 'blur(36px)',
        transform: 'scale(1.18)',
      }}
    />
    {/* Screen */}
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: '#1C1C1E',
        border: '3px solid #2A2A2E',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.7)',
        aspectRatio: '16/10',
      }}
    >
      <LaptopChat running={running} />
    </div>
    {/* Base */}
    <div className="h-3 rounded-b-xl mx-3 -mt-px" style={{ background: 'linear-gradient(to bottom, #2A2A2E, #1A1A1C)' }} />
    <div className="h-2 rounded-b-2xl" style={{ background: 'linear-gradient(to bottom, #222224, #111113)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-t-full" style={{ background: '#0A0A0C' }} />
  </div>
);

// ── Full-screen modal ───────────────────────────────────────────────────────

export const AgentChatModal: FC = () => {
  const [open, setOpen] = useState(false);

  // Listen for the open event from any button anywhere on the page
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-agent-chat', handler);
    return () => window.removeEventListener('open-agent-chat', handler);
  }, []);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="agent-modal"
          role="dialog"
          aria-label="Speak with a Promptly Agent"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ background: NAVY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Wave lines decoration */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1200 700"
            fill="none"
            style={{ opacity: 0.06 }}
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

          {/* Header bar */}
          <div
            className="relative z-10 flex items-center gap-4 px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Logo / title */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'rgba(240,90,74,0.18)', border: '1px solid rgba(240,90,74,0.28)' }}
            >
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white leading-tight">Promptly Agent</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#22C55E' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <p className="text-xs" style={{ color: '#64748B' }}>
                  On call 24/7 · GDPR compliant · No account needed
                </p>
              </div>
            </div>

            {/* Close — large white X */}
            <motion.button
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{ background: 'rgba(255,255,255,0.07)' }}
              aria-label="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 1l14 14M15 1L1 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.button>
          </div>

          {/* Main content — laptop shell centred */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-12 overflow-hidden">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.08 }}
            >
              <LaptopShell running={open} />
            </motion.div>

            {/* Avatars row */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
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
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Floating "Speak with an Agent" button ──────────────────────────────────

export const FloatingAgentBtn: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="agent-float"
          onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="fixed right-5 bottom-36 z-[100] flex items-center gap-2.5 pl-3 pr-4 py-3
                     rounded-2xl font-bold text-sm text-white shadow-2xl
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ background: CORAL, boxShadow: `0 6px 28px rgba(240,90,74,0.45)` }}
          aria-label="Speak with an agent"
        >
          <span
            className="w-7 h-7 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)' }}
            aria-hidden="true"
          >
            🤖
          </span>
          Speak with an Agent
        </motion.button>
      )}
    </AnimatePresence>
  );
};
