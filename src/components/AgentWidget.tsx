/**
 * AgentWidget.tsx — Section-aware 24/7 AI guide for GetPromptly.co.uk
 *
 * - Detects the current page section and adjusts persona + conversation starters
 * - Serves all education audiences (teachers, SLT, SENCO, parents, students, admin, IT)
 * - Fires analytics events for key interactions
 * - Quiz flows: "Find my tool/equipment/training/prompt"
 *
 * Open from anywhere via:
 *   window.dispatchEvent(new CustomEvent('open-agent-chat'))
 */

import {
  FC, FormEvent, KeyboardEvent,
  useEffect, useRef, useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAgent } from '../hooks/useAgent';
import {
  ALL_ROLES, AgentRole, AgentMode,
  getModeFromPath, MODE_PERSONA, CONVERSATION_STARTERS,
  trackEvent,
} from '../api/agent';
import { useBrevo } from '../hooks/useBrevo';

const TEAL = '#00808a';

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#c5c2bb' }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ─── Role selector ────────────────────────────────────────────────────────────

function RoleSelector({
  mode,
  onSelect,
}: {
  mode: AgentMode;
  onSelect: (r: AgentRole) => void;
}) {
  const starters = CONVERSATION_STARTERS[mode];

  return (
    <div className="flex-1 flex flex-col p-5 overflow-y-auto" style={{ background: '#f7f6f2' }}>
      {/* Welcome */}
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed mb-4"
        style={{ background: 'white', color: '#6b6760' }}
      >
        Hi! I'm Promptly AI — your {MODE_PERSONA[mode].toLowerCase()} for UK education.
        {' '}Select your role so I can give you the most relevant advice.
      </div>

      {/* Role grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-5">
        {ALL_ROLES.map(r => (
          <button
            key={r}
            onClick={() => onSelect(r)}
            className="px-2 py-2 rounded-xl border text-xs font-semibold transition-all hover:border-[#00808a] hover:text-[#00808a]"
            style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Conversation starters */}
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#c5c2bb' }}>
        Or jump straight in
      </p>
      <div className="space-y-1.5">
        {starters.map(s => (
          <button
            key={s}
            onClick={() => {
              trackEvent({ name: 'starter_clicked', starter: s });
              // Pre-fill — user still needs to select a role to actually send,
              // so we surface a compact role picker after clicking a starter.
              onSelect('Teacher'); // default to Teacher for starters; user can switch role
              // We dispatch a custom event to send the starter after role is set.
              window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: s }));
            }}
            className="w-full text-left px-3 py-2 rounded-xl border text-xs leading-relaxed transition-colors hover:border-[#00808a] hover:bg-white"
            style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760' }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Lead capture ──────────────────────────────────────────────────────────────

function LeadCapture({ agentRole }: { agentRole: AgentRole }) {
  const [email, setEmail] = useState('');
  const { subscribe, status, error } = useBrevo();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    await subscribe({ email, roles: [agentRole], source: 'agent_widget' });
    trackEvent({ name: 'email_capture_submitted' });
  }

  if (status === 'success') {
    return (
      <div className="mx-3 mb-3 px-4 py-3 rounded-xl text-xs text-center" style={{ background: '#e0f5f6', color: TEAL }}>
        ✓ You're subscribed! Personalised picks coming your way.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-3 mb-3 px-4 py-3 rounded-xl border"
      style={{ borderColor: '#e8e6e0', background: '#f7f6f2' }}
    >
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>
        Want personalised recommendations emailed to you?
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@school.ac.uk"
          required
          className="flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none focus:border-[#00808a]"
          style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: TEAL, color: 'white' }}
        >
          {status === 'loading' ? '…' : 'Yes →'}
        </button>
      </form>
      {status === 'error' && error && (
        <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>{error}</p>
      )}
    </motion.div>
  );
}

// ─── Quick-find quiz ───────────────────────────────────────────────────────────

type QuizStep = { question: string; options: string[] };

const QUIZZES: Record<string, QuizStep[]> = {
  tool: [
    { question: "What's your role?", options: ['Teacher', 'School Leader', 'SENCO', 'Parent', 'Student', 'Admin'] },
    { question: 'What do you need the tool for?', options: ['Lesson planning', 'Marking & feedback', 'SEND support', 'Parent comms', 'Revision help', 'Admin tasks'] },
    { question: 'What matters most?', options: ['KCSIE 2025 aligned', 'Free to use', 'GDPR compliant', 'Works offline', 'Has a certificate'] },
  ],
  equipment: [
    { question: "Who is it for?", options: ['Teachers / classroom', 'Schools (bulk)', 'Parents / home', 'Students', 'SEND provision'] },
    { question: "What's your budget?", options: ['Under £50', '£50–£150', '£150–£500', '£500+', 'Need a school quote'] },
    { question: 'What category?', options: ['Devices / tablets', 'Interactive displays', 'Coding robots', 'AAC / communication', 'Sensory tools', 'Hearing support'] },
  ],
  training: [
    { question: "What's your role?", options: ['Teacher', 'School Leader', 'SENCO', 'Parent', 'Student', 'Professional'] },
    { question: "What level are you at?", options: ['Complete beginner', 'Some AI experience', 'Intermediate', 'Advanced'] },
    { question: 'Free or paid?', options: ['Free only', 'Open to paid', 'Need a certificate'] },
  ],
  prompt: [
    { question: "What's your role?", options: ['Teacher', 'School Leader', 'SENCO', 'Parent', 'Student', 'Admin'] },
    { question: 'What subject or area?', options: ['English / writing', 'Maths / science', 'Exam prep', 'Study skills', 'Parent comms', 'SEND support'] },
    { question: 'Any specific need?', options: ['Dyslexia friendly', 'ADHD friendly', 'Autism friendly', 'Anxiety support', 'General / all abilities'] },
  ],
};

const QUIZ_LABELS: Record<string, string> = {
  tool: 'Find my tool',
  equipment: 'Find equipment',
  training: 'Find training',
  prompt: 'Get a prompt',
};

const QUIZ_PATHS: Record<AgentMode, string | null> = {
  tools: 'tool',
  equipment: 'equipment',
  training: 'training',
  prompts: 'prompt',
  schools: 'equipment',
  parents: null,
  general: 'tool',
};

interface QuizProps {
  quizKey: string;
  onComplete: (summary: string) => void;
  onCancel: () => void;
}

function QuickFindQuiz({ quizKey, onComplete, onCancel }: QuizProps) {
  const steps = QUIZZES[quizKey] ?? [];
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  function pick(option: string) {
    const next = [...answers, option];
    if (step + 1 >= steps.length) {
      const summary = `I'm looking for ${QUIZ_LABELS[quizKey].toLowerCase()}. ${
        steps.map((s, i) => `${s.question} → ${next[i]}`).join('. ')
      }.`;
      trackEvent({ name: 'quiz_completed', outcome: quizKey });
      onComplete(summary);
    } else {
      setAnswers(next);
      setStep(s => s + 1);
    }
  }

  const current = steps[step];
  if (!current) return null;

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto" style={{ background: '#f7f6f2' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold" style={{ color: TEAL }}>
          {QUIZ_LABELS[quizKey]} · Step {step + 1}/{steps.length}
        </p>
        <button onClick={onCancel} className="text-xs" style={{ color: '#9ca3af' }}>Cancel</button>
      </div>

      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm mb-4"
        style={{ background: 'white', color: 'var(--text)' }}
      >
        {current.question}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {current.options.map(opt => (
          <button
            key={opt}
            onClick={() => pick(opt)}
            className="px-3 py-2.5 rounded-xl border text-xs font-medium transition-all hover:border-[#00808a] hover:text-[#00808a] text-left"
            style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760' }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-1 rounded-full overflow-hidden" style={{ background: '#e8e6e0' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%`, background: TEAL }}
        />
      </div>
    </div>
  );
}

// ─── Chat panel ────────────────────────────────────────────────────────────────

interface PanelProps {
  mode: AgentMode;
  onClose: () => void;
}

function ChatPanel({ mode, onClose }: PanelProps) {
  const [role,     setRole]     = useState<AgentRole | null>(null);
  const [input,    setInput]    = useState('');
  const [quiz,     setQuiz]     = useState<string | null>(null);
  const bottomRef               = useRef<HTMLDivElement>(null);

  const { messages, loading, error, sendMessage, clearMessages } = useAgent(
    role ?? 'Teacher',
    mode,
  );

  const assistantCount  = messages.filter(m => m.role === 'assistant').length;
  const showLeadCapture = assistantCount >= 3;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Listen for starter clicks (fired before role selection)
  useEffect(() => {
    function handler(e: Event) {
      const text = (e as CustomEvent<string>).detail;
      if (text) {
        setInput(text);
        // Auto-send after a tick (role is already set by the time this fires)
        setTimeout(() => {
          sendMessage(text);
          setInput('');
        }, 80);
      }
    }
    window.addEventListener('agent-send-starter', handler);
    return () => window.removeEventListener('agent-send-starter', handler);
  }, [sendMessage]);

  function handleSend() {
    const text = input.trim();
    if (!text || loading || !role) return;
    setInput('');
    sendMessage(text);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleQuizComplete(summary: string) {
    setQuiz(null);
    if (!role) setRole('Teacher');
    sendMessage(summary);
    setInput('');
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const quizKey = QUIZ_PATHS[mode];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Promptly AI chat"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="agent-panel z-[9999] flex flex-col shadow-2xl overflow-hidden"
      style={{ background: 'white', border: '1px solid #e8e6e0' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: '#111210', borderBottom: '1px solid #1f1f1c' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: TEAL, color: 'white' }}
            >
              P
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: '#22c55e', borderColor: '#111210' }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold leading-none" style={{ color: 'white' }}>Promptly AI</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#6b6760' }}>
              {role ? `${role} · ${MODE_PERSONA[mode]}` : MODE_PERSONA[mode] + ' · 24/7'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {role && messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-[10px] transition-opacity hover:opacity-60"
              style={{ color: '#6b6760' }}
            >
              Clear
            </button>
          )}
          {role && (
            <button
              onClick={() => { setRole(null); setQuiz(null); clearMessages(); }}
              className="text-[10px] transition-opacity hover:opacity-60"
              style={{ color: '#6b6760' }}
            >
              Switch role
            </button>
          )}
          <button
            onClick={onClose}
            className="text-lg leading-none transition-opacity hover:opacity-60"
            style={{ color: '#6b6760' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      {quiz ? (
        <QuickFindQuiz
          quizKey={quiz}
          onComplete={handleQuizComplete}
          onCancel={() => setQuiz(null)}
        />
      ) : !role ? (
        <RoleSelector mode={mode} onSelect={setRole} />
      ) : (
        <>
          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3" style={{ background: '#f7f6f2' }}>

            {/* Welcome */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
                  style={{ background: 'white', color: '#6b6760' }}
                >
                  Hi! I'm your {MODE_PERSONA[mode].toLowerCase()} — ask me anything about AI tools,
                  equipment, training or prompts for UK education.
                </div>

                {/* Quick-find quiz button */}
                {quizKey && (
                  <button
                    onClick={() => setQuiz(quizKey)}
                    className="w-full text-left px-4 py-3 rounded-2xl border text-sm font-medium transition-colors hover:border-[#00808a]"
                    style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
                  >
                    ✦ <span style={{ color: TEAL }}>Quick quiz:</span> {QUIZ_LABELS[quizKey]} for me →
                  </button>
                )}

                {/* Conversation starters */}
                <div className="space-y-1.5">
                  {CONVERSATION_STARTERS[mode].map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        trackEvent({ name: 'starter_clicked', starter: s });
                        sendMessage(s);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl border text-xs leading-relaxed transition-colors hover:border-[#00808a] hover:bg-white"
                      style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[86%] whitespace-pre-wrap"
                  style={
                    msg.role === 'user'
                      ? { background: TEAL, color: 'white', borderRadius: '16px 16px 4px 16px' }
                      : { background: 'white', color: '#1c1a15', borderRadius: '4px 16px 16px 16px' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl" style={{ background: 'white', borderRadius: '4px 16px 16px 16px' }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-xs"
                style={{ background: '#fee2e2', color: '#991b1b' }}
              >
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Lead capture */}
          {showLeadCapture && <LeadCapture agentRole={role} />}

          {/* Disclaimer */}
          <p className="text-[10px] text-center px-3 pt-1 flex-shrink-0" style={{ color: '#c5c2bb' }}>
            Powered by Claude · Responses may be inaccurate. Verify important information.
          </p>

          {/* Input */}
          <div
            className="flex items-end gap-2 px-3 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid #e8e6e0', background: 'white' }}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask your ${MODE_PERSONA[mode].toLowerCase()}…`}
              rows={1}
              className="flex-1 resize-none px-3 py-2 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors"
              style={{
                borderColor: '#e8e6e0',
                color: 'var(--text)',
                background: '#f7f6f2',
                maxHeight: '96px',
                lineHeight: '1.4',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-opacity disabled:opacity-30"
              style={{ background: TEAL }}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="white" />
              </svg>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ─── Floating launcher ─────────────────────────────────────────────────────────

const AgentWidget: FC = () => {
  const [open, setOpen] = useState(false);
  const location        = useLocation();
  const mode            = getModeFromPath(location.pathname);

  function openWidget() {
    if (!open) {
      setOpen(true);
      trackEvent({ name: 'agent_opened' });
      trackEvent({ name: 'agent_mode_detected', section: mode });
    }
  }

  // Listen for the custom event dispatched by other parts of the site
  useEffect(() => {
    const handler = () => openWidget();
    window.addEventListener('open-agent-chat', handler);
    // Also support direct id-based trigger (buttons with id="promptly-widget-trigger")
    const btn = document.getElementById('promptly-widget-trigger');
    if (btn) btn.addEventListener('click', handler);
    return () => {
      window.removeEventListener('open-agent-chat', handler);
      if (btn) btn.removeEventListener('click', handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mode changes when user navigates — close panel so context refreshes cleanly
  const prevMode = useRef(mode);
  useEffect(() => {
    if (prevMode.current !== mode && open) {
      // Don't force-close; just track the mode change
      trackEvent({ name: 'agent_mode_detected', section: mode });
    }
    prevMode.current = mode;
  }, [mode, open]);

  return (
    <>
      {/* Hidden trigger button (used by inline CTAs across the site) */}
      <button
        id="promptly-widget-trigger"
        onClick={openWidget}
        className="sr-only"
        aria-label="Open Promptly AI chat"
        tabIndex={-1}
      />

      {/* Floating bubble */}
      <motion.button
        onClick={openWidget}
        className="fixed bottom-4 right-4 z-[9998] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
        style={{ background: TEAL, color: 'white' }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Open Promptly AI"
      >
        <span className="relative flex-shrink-0">
          <span className="w-2 h-2 rounded-full block" style={{ background: '#22c55e' }} />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: '#22c55e' }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </span>
        <span className="text-xs font-semibold whitespace-nowrap">Promptly AI · 24/7</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0" aria-hidden="true">
          <path
            d="M7 1C3.69 1 1 3.24 1 6c0 1.44.67 2.73 1.75 3.65L2 13l3.47-1.5C5.93 11.82 6.45 12 7 12c3.31 0 6-2.24 6-5S10.31 1 7 1Z"
            fill="white"
          />
        </svg>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && <ChatPanel mode={mode} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default AgentWidget;
