/**
 * AgentWidget.tsx
 *
 * Floating chat bubble + sliding panel that connects to the real Claude API.
 * Can be opened from anywhere in the app via:
 *   window.dispatchEvent(new CustomEvent('open-agent-chat'))
 */

import {
  FC, FormEvent, KeyboardEvent,
  useEffect, useRef, useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from '../hooks/useAgent';
import { ALL_ROLES, AgentRole } from '../api/agent';
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

// ─── Role selector (shown on first open) ─────────────────────────────────────

function RoleSelector({ onSelect }: { onSelect: (r: AgentRole) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl"
        style={{ background: TEAL }}
      >
        ✦
      </div>
      <h2 className="font-display text-xl mb-1" style={{ color: 'var(--text)' }}>
        Welcome to Promptly AI
      </h2>
      <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
        Select your role so I can give you the most relevant advice.
      </p>
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {ALL_ROLES.map(r => (
          <button
            key={r}
            onClick={() => onSelect(r)}
            className="px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all hover:border-[#00808a] hover:text-[#00808a]"
            style={{ borderColor: '#e8e6e0', color: '#6b6760', background: 'white' }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Lead capture prompt (appears after 3 AI replies) ────────────────────────

function LeadCapture({ agentRole }: { agentRole: AgentRole }) {
  const [email, setEmail] = useState('');
  const { subscribe, status, error } = useBrevo();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    await subscribe({ email, roles: [agentRole], source: 'agent_widget' });
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

// ─── Main chat panel ──────────────────────────────────────────────────────────

interface PanelProps {
  onClose: () => void;
}

function ChatPanel({ onClose }: PanelProps) {
  const [role, setRole]   = useState<AgentRole | null>(null);
  const [input, setInput] = useState('');
  const bottomRef         = useRef<HTMLDivElement>(null);

  const { messages, loading, error, sendMessage, clearMessages } = useAgent(role ?? 'Teacher');

  // Count how many assistant replies have been sent so we can trigger lead capture.
  const assistantCount = messages.filter(m => m.role === 'assistant').length;
  const showLeadCapture = assistantCount >= 3;

  // Scroll to the latest message whenever messages or loading state changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

  // Close on Escape key
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

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
            {/* Live dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: '#22c55e', borderColor: '#111210' }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold leading-none" style={{ color: 'white' }}>Promptly AI</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#6b6760' }}>
              {role ? `${role} · 24/7` : 'Powered by Claude'}
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
              onClick={() => { setRole(null); clearMessages(); }}
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
      {!role ? (
        <RoleSelector onSelect={setRole} />
      ) : (
        <>
          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3" style={{ background: '#f7f6f2' }}>

            {/* Welcome message */}
            {messages.length === 0 && (
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed max-w-[85%]"
                style={{ background: 'white', color: '#6b6760' }}
              >
                Hi! I'm Promptly AI — your guide to AI tools, equipment, and CPD for UK education.
                What can I help you with today?
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%]"
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

            {/* Error state */}
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

          {/* Lead capture — appears after 3 AI replies */}
          {showLeadCapture && <LeadCapture agentRole={role} />}

          {/* Disclaimer */}
          <p className="text-[10px] text-center px-3 pt-1 flex-shrink-0" style={{ color: '#c5c2bb' }}>
            Powered by Claude · AI responses may be inaccurate. Verify important information.
          </p>

          {/* Input bar */}
          <div
            className="flex items-end gap-2 px-3 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid #e8e6e0', background: 'white' }}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about AI tools, equipment, or CPD…"
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

// ─── Floating bubble ──────────────────────────────────────────────────────────

const AgentWidget: FC = () => {
  const [open, setOpen] = useState(false);

  // Listen for the custom event dispatched by other parts of the site
  // (Navbar "Ask Promptly AI" button, Tools page agent panel, etc.)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-agent-chat', handler);
    return () => window.removeEventListener('open-agent-chat', handler);
  }, []);

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-4 right-4 z-[9998] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
        style={{ background: TEAL, color: 'white' }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Live green dot */}
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
        {/* Chat icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
          <path
            d="M7 1C3.69 1 1 3.24 1 6c0 1.44.67 2.73 1.75 3.65L2 13l3.47-1.5C5.93 11.82 6.45 12 7 12c3.31 0 6-2.24 6-5S10.31 1 7 1Z"
            fill="white"
          />
        </svg>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && <ChatPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default AgentWidget;
