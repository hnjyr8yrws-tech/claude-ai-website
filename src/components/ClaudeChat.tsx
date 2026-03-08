/**
 * ClaudeChat.tsx — Premium Claude AI Chat Interface v2
 *
 * Stack:
 *   React 18 · TypeScript · Tailwind CSS v3 · Framer Motion v11
 *
 * Features:
 *   ✦ Framer Motion animated hero with neon glow + particles
 *   ✦ Spring-physics chat bubbles (stagger, slide, scale)
 *   ✦ Framer Motion typing indicator (wave sequence)
 *   ✦ Sidebar: AnimatePresence slide-in + whileHover lift cards
 *   ✦ Shine border input (CSS conic-gradient)
 *   ✦ Full WCAG 2.1 AA (ARIA, keyboard nav, reduced-motion)
 *   ✦ Mobile-first (sm/md/lg breakpoints, no layout shift)
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  FC,
} from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from 'framer-motion';
import { cn } from '../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant';

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: '1', title: 'Refactor auth middleware', preview: 'Can you help me clean up the JWT…', timestamp: new Date(Date.now() - 60 * 5e3) },
  { id: '2', title: 'React performance tips', preview: 'What are the best ways to avoid…', timestamp: new Date(Date.now() - 60 * 60e3) },
  { id: '3', title: 'SQL query optimisation', preview: 'This JOIN is really slow on large…', timestamp: new Date(Date.now() - 3 * 60 * 60e3) },
  { id: '4', title: 'Tailwind dark mode strategy', preview: 'Should I use class or media for…', timestamp: new Date(Date.now() - 24 * 60 * 60e3) },
  { id: '5', title: 'Python async patterns', preview: 'asyncio vs threading for IO-bound…', timestamp: new Date(Date.now() - 48 * 60 * 60e3) },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', role: 'user', content: 'Can you help me refactor this auth middleware to use JWT refresh tokens properly?', timestamp: new Date(Date.now() - 3 * 60e3) },
  { id: 'm2', role: 'assistant', content: "Absolutely! Proper JWT refresh token handling is critical for security. Here's what we'll tackle:\n\n**1. Token rotation** — invalidate old refresh tokens on use\n**2. Sliding expiry** — extend the window on activity\n**3. Secure storage** — httpOnly cookies vs. memory\n\nPaste your current middleware and I'll refactor it step-by-step.", timestamp: new Date(Date.now() - 2 * 60e3) },
];

const SUGGESTIONS = [
  { icon: '⚡', label: 'Debug my code', sub: 'Paste an error or snippet' },
  { icon: '✍️', label: 'Write something', sub: 'Docs, emails, content' },
  { icon: '🔍', label: 'Explain a concept', sub: 'Any topic, any depth' },
  { icon: '🛠️', label: 'Build a feature', sub: 'Step-by-step guidance' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10);

function relativeTime(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// Inline tiny markdown: **bold** → <strong>
function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-semibold text-violet-300">{p.slice(2, -2)}</strong>
          : p
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Motion variants
// ─────────────────────────────────────────────────────────────────────────────

const bubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 14 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 24, delay: i * 0.05 },
  }),
  exit: { opacity: 0, scale: 0.88, y: -8, transition: { duration: 0.2 } },
};

const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26, delay: i * 0.06 },
  }),
};

const sidebarPanelVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
  exit:   { x: '-100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

const heroContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 10 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 22, delay: 0.4 + i * 0.08 },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Floating Particle (decorative, aria-hidden)
// ─────────────────────────────────────────────────────────────────────────────

const Particle: FC<{ delay: number; x: number; size: number; color: string }> = ({ delay, x, size, color }) => (
  <motion.div
    aria-hidden="true"
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, bottom: '-10px', width: size, height: size, background: color, filter: 'blur(1px)' }}
    animate={{ y: [0, -320, -340], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.3] }}
    transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: 'easeOut' }}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────────────────────────

const TypingIndicator: FC = () => (
  <div className="flex items-center gap-1 px-4 py-3.5" role="status" aria-label="Claude is typing">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="block w-2 h-2 rounded-full bg-violet-400"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Chat Bubble
// ─────────────────────────────────────────────────────────────────────────────

const ChatBubble: FC<{ message: Message; index: number }> = ({ message, index }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
      role="listitem"
      custom={index}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      {/* Avatar */}
      {!isUser && (
        <motion.div
          aria-hidden="true"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700
                     flex items-center justify-center text-xs font-bold text-white mt-0.5 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
          whileHover={{ scale: 1.1 }}
        >
          C
        </motion.div>
      )}

      <div className={cn('flex flex-col max-w-[75%] sm:max-w-[65%]', isUser ? 'items-end' : 'items-start')}>
        {/* Bubble body */}
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 text-sm leading-relaxed overflow-hidden',
            isUser
              ? 'bg-gradient-to-br from-violet-600 to-violet-800 text-white rounded-tr-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]'
              : 'bg-[#1a1a2e] border border-white/5 text-gray-100 rounded-tl-sm shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          )}
        >
          {/* Inner top highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/6 to-transparent pointer-events-none rounded-2xl" />
          <p className="relative whitespace-pre-wrap">
            <InlineMarkdown text={message.content} />
          </p>
        </div>

        {/* Timestamp */}
        <time
          className="text-[10px] text-gray-600 mt-1 px-1"
          dateTime={message.timestamp.toISOString()}
        >
          {relativeTime(message.timestamp)}
        </time>
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700
                     border border-white/10 flex items-center justify-center text-xs font-bold text-gray-200 mt-0.5"
        >
          U
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Conversation Item
// ─────────────────────────────────────────────────────────────────────────────

const ConvItem: FC<{ conv: Conversation; active: boolean; onClick: () => void; index: number }> = ({
  conv, active, onClick, index,
}) => (
  <motion.button
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    custom={index}
    variants={sidebarItemVariants}
    initial="hidden"
    animate="visible"
    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.04)' }}
    whileTap={{ scale: 0.97 }}
    className={cn(
      'relative w-full text-left px-3 py-2.5 rounded-xl transition-colors duration-200 outline-none',
      'focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f1a]',
      active
        ? 'bg-[#1e1e35] border border-violet-600/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
        : 'border border-transparent'
    )}
  >
    {/* Active glow bar */}
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-violet-500"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 24, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
        />
      )}
    </AnimatePresence>

    <div className="flex items-start justify-between gap-2">
      <p className={cn('text-xs font-medium truncate leading-snug', active ? 'text-white' : 'text-gray-300')}>
        {conv.title}
      </p>
      <time className="text-[10px] text-gray-600 shrink-0 mt-0.5">{relativeTime(conv.timestamp)}</time>
    </div>
    <p className="text-[11px] text-gray-600 truncate mt-0.5">{conv.preview}</p>
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Hero — Glowing animated empty state
// ─────────────────────────────────────────────────────────────────────────────

const HeroEmptyState: FC<{ onSuggest: (text: string) => void }> = ({ onSuggest }) => {
  const PARTICLES = [
    { delay: 0,   x: 20,  size: 4,  color: '#8b5cf6' },
    { delay: 1.2, x: 40,  size: 3,  color: '#38bdf8' },
    { delay: 0.6, x: 60,  size: 5,  color: '#bf5fff' },
    { delay: 2.0, x: 75,  size: 3,  color: '#8b5cf6' },
    { delay: 1.5, x: 85,  size: 4,  color: '#2dd4bf' },
    { delay: 0.3, x: 10,  size: 3,  color: '#f472b6' },
    { delay: 2.5, x: 50,  size: 6,  color: '#7c3aed' },
    { delay: 1.8, x: 30,  size: 3,  color: '#38bdf8' },
  ];

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center h-full gap-10 overflow-hidden px-4"
      variants={heroContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Background ambient glow blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[500px] h-[300px] rounded-full
                        bg-violet-600/10 blur-[80px]" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-cyan-500/6 blur-[60px]" />
      </div>

      {/* Orb */}
      <motion.div className="relative" variants={heroItemVariants}>
        {/* Outer pulse ring */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-6 rounded-3xl border border-violet-500/20"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -inset-12 rounded-[2rem] border border-violet-500/8"
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Core orb */}
        <motion.div
          className="relative w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden"
          animate={{ boxShadow: [
            '0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.15)',
            '0 0 50px rgba(139,92,246,0.7), 0 0 100px rgba(139,92,246,0.25)',
            '0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.15)',
          ]}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.06, rotate: 3 }}
        >
          {/* Gradient fill */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-violet-900" />
          {/* Rotating shine sweep */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.15) 80%, transparent 90%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          {/* Icon */}
          <svg className="relative z-10 w-10 h-10" viewBox="0 0 40 40" fill="none" aria-label="Claude logo">
            <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" strokeOpacity=".9"/>
            <circle cx="20" cy="20" r="5" fill="white"/>
            <path d="M20 6v4M20 30v4M6 20h4M30 20h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity=".5"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Headline */}
      <motion.div className="text-center space-y-3" variants={heroItemVariants}>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            How can I help
          </span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            you today?
          </span>
        </h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Ask me anything — code, writing, analysis, or just a conversation.
        </p>
      </motion.div>

      {/* Suggestion chips */}
      <div
        className="grid grid-cols-2 gap-3 w-full max-w-md"
        role="list"
        aria-label="Suggested prompts"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.label}
            role="listitem"
            custom={i}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: '0 0 20px rgba(139,92,246,0.25)',
              borderColor: 'rgba(139,92,246,0.5)',
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSuggest(s.label + ' — ')}
            className="flex flex-col gap-1.5 p-4 rounded-2xl text-left
                       bg-[#14141f]/80 border border-white/6
                       backdrop-blur-sm transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <span className="text-xl" aria-hidden="true">{s.icon}</span>
            <span className="text-xs font-semibold text-gray-200">{s.label}</span>
            <span className="text-[11px] text-gray-600">{s.sub}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic send button — cursor-tracking subtle tilt
// ─────────────────────────────────────────────────────────────────────────────

const SendButton: FC<{ onClick: () => void; disabled: boolean; loading: boolean }> = ({
  onClick, disabled, loading,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-20, 20], [8, -8]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-20, 20], [-8, 8]), { stiffness: 300, damping: 20 });

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
      style={{ rotateX, rotateY, perspective: 400 }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={disabled ? {} : { scale: 0.88 }}
      className={cn(
        'p-2 rounded-xl transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
        !disabled
          ? 'bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-[0_0_14px_rgba(139,92,246,0.4)] hover:shadow-[0_0_24px_rgba(139,92,246,0.65)]'
          : 'bg-[#252540] text-gray-700 cursor-not-allowed'
      )}
    >
      {loading ? (
        <motion.svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity=".25"/>
          <path d="M14 8A6 6 0 012 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </motion.svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

const Sidebar: FC<{
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onClose: () => void;
  mobile?: boolean;
}> = ({ conversations, activeId, onSelect, onNew, onClose, mobile }) => (
  <motion.aside
    aria-label="Conversation history"
    variants={mobile ? sidebarPanelVariants : undefined}
    initial={mobile ? 'hidden' : false}
    animate={mobile ? 'visible' : false}
    exit={mobile ? 'exit' : undefined}
    className="flex flex-col w-72 h-full bg-[#0f0f1a]/90 backdrop-blur-xl border-r border-white/5"
  >
    {/* Logo */}
    <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
      <motion.div
        aria-hidden="true"
        className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700
                   flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.5)]"
        animate={{ boxShadow: [
          '0 0 14px rgba(139,92,246,0.4)',
          '0 0 26px rgba(139,92,246,0.7)',
          '0 0 14px rgba(139,92,246,0.4)',
        ]}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5" strokeOpacity=".9"/>
          <circle cx="8" cy="8" r="2" fill="white"/>
        </svg>
      </motion.div>
      <span className="font-semibold text-sm tracking-wide text-white">Claude AI</span>

      {mobile && (
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.92 }}
          className="ml-auto p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="Close sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1l12 12M13 1L1 13"/>
          </svg>
        </motion.button>
      )}
    </div>

    {/* New chat */}
    <div className="px-4 pt-4 pb-2">
      <motion.button
        onClick={onNew}
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
        whileTap={{ scale: 0.96 }}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl
                   bg-gradient-to-r from-violet-600 to-violet-700
                   text-sm font-medium text-white
                   shadow-[0_0_14px_rgba(139,92,246,0.25)]
                   transition-shadow duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f1a]"
        aria-label="Start a new conversation"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New conversation
      </motion.button>
    </div>

    {/* Conversation list */}
    <nav
      aria-label="Past conversations"
      className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#252540]"
    >
      <p className="px-2 py-2 text-[10px] font-semibold tracking-widest text-gray-600 uppercase select-none">
        Recent
      </p>
      <AnimatePresence initial={false}>
        {conversations.map((conv, i) => (
          <ConvItem
            key={conv.id}
            conv={conv}
            active={conv.id === activeId}
            index={i}
            onClick={() => onSelect(conv.id)}
          />
        ))}
      </AnimatePresence>
    </nav>

    {/* User footer */}
    <div className="border-t border-white/5 px-4 py-4">
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-3 w-full px-2 py-2 rounded-xl transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        aria-label="User settings"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700
                        border border-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
          C
        </div>
        <div className="text-left min-w-0">
          <p className="text-xs font-medium text-gray-200 truncate">Chloe</p>
          <p className="text-[10px] text-gray-600">Claude Pro</p>
        </div>
        <svg className="ml-auto text-gray-600" width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
          <circle cx="7" cy="2" r="1.5"/><circle cx="7" cy="7" r="1.5"/><circle cx="7" cy="12" r="1.5"/>
        </svg>
      </motion.button>
    </div>
  </motion.aside>
);

// ─────────────────────────────────────────────────────────────────────────────
// Chat Input — shine border + auto-resize
// ─────────────────────────────────────────────────────────────────────────────

const ChatInput: FC<{
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isTyping: boolean;
}> = ({ value, onChange, onSend, isTyping }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div className="shrink-0 px-4 pb-5 pt-3 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent">
      <motion.div
        className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden"
        animate={focused
          ? { boxShadow: '0 0 0 1px rgba(139,92,246,0.6), 0 0 30px rgba(139,92,246,0.2)' }
          : { boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.3)' }
        }
        transition={{ duration: 0.25 }}
      >
        {/* Rotating conic shine border when focused */}
        <AnimatePresence>
          {focused && (
            <motion.div
              aria-hidden="true"
              className="absolute -inset-[1px] rounded-2xl pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'conic-gradient(from var(--shine-angle, 0deg), #8b5cf6, #38bdf8, #bf5fff, #8b5cf6)',
                animation: 'shine-rotate 3s linear infinite',
                maskImage: 'linear-gradient(#000 0 0)',
                WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 1px), black calc(100% - 1px))',
              }}
            />
          )}
        </AnimatePresence>

        {/* Inner surface */}
        <div className="relative z-10 flex items-end gap-2 bg-[#14141f]/95 backdrop-blur-xl rounded-2xl">
          {/* Inner gradient highlight */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/4 to-transparent pointer-events-none" />

          <label htmlFor="chat-input" className="sr-only">Message Claude</label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Message Claude…"
            rows={1}
            aria-label="Message Claude"
            aria-multiline="true"
            className="flex-1 min-h-[48px] max-h-[180px] resize-none bg-transparent
                       px-4 py-3.5 text-sm text-white placeholder-gray-600
                       focus:outline-none relative z-10
                       scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#252540]"
          />

          <div className="flex items-center gap-1.5 px-2.5 pb-2.5 relative z-10 shrink-0">
            {/* Attach */}
            <motion.button
              whileHover={{ scale: 1.1, color: '#9ca3af' }}
              whileTap={{ scale: 0.9 }}
              aria-label="Attach a file"
              className="p-2 rounded-lg text-gray-700 transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M13.5 8L7.5 14a4 4 0 01-5.66-5.66L8 2.17a2.5 2.5 0 013.54 3.54L5.4 11.84a1 1 0 01-1.41-1.41L9.5 5"/>
              </svg>
            </motion.button>

            <SendButton
              onClick={onSend}
              disabled={!value.trim() || isTyping}
              loading={isTyping}
            />
          </div>
        </div>
      </motion.div>

      <p className="text-center text-[11px] text-gray-700 mt-2.5 select-none" aria-hidden="true">
        Enter to send · Shift+Enter for new line · Claude can make mistakes
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

const ClaudeChat: FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState('1');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close mobile sidebar on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidebarOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { id: uid(), role: 'user', content: trimmed, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          content: "Great question! Here's a concise breakdown:\n\n**Key points:**\n- Point one with full context and nuance\n- Point two with practical advice\n- Point three for deeper understanding\n\nLet me know if you'd like me to expand on any of these.",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1800);
  }, [input, isTyping]);

  const startNewChat = () => {
    const id = uid();
    setConversations((prev) => [
      { id, title: 'New conversation', preview: 'Start typing to begin…', timestamp: new Date() },
      ...prev,
    ]);
    setActiveId(id);
    setMessages([]);
    setSidebarOpen(false);
  };

  const activeTitle = conversations.find((c) => c.id === activeId)?.title ?? 'New conversation';
  const isEmpty = messages.length === 0;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0f] text-white font-sans">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar (always visible lg+) ── */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => setActiveId(id)}
          onNew={startNewChat}
          onClose={() => {}}
        />
      </div>

      {/* ── Mobile sidebar (AnimatePresence slide) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <div ref={sidebarRef} className="fixed inset-y-0 left-0 z-30 lg:hidden">
            <Sidebar
              conversations={conversations}
              activeId={activeId}
              onSelect={(id) => { setActiveId(id); setSidebarOpen(false); }}
              onNew={startNewChat}
              onClose={() => setSidebarOpen(false)}
              mobile
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col min-w-0 relative" aria-label="Chat interface">

        {/* Top bar */}
        <motion.header
          className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-[#0f0f1a]/60 backdrop-blur-md shrink-0"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Hamburger */}
          <motion.button
            onClick={() => setSidebarOpen(true)}
            whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.92 }}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="Open sidebar"
            aria-expanded={sidebarOpen}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 4h14M2 9h14M2 14h14"/>
            </svg>
          </motion.button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-semibold text-white truncate leading-none">{activeTitle}</h1>
            <p className="text-[11px] text-gray-600 mt-0.5">Claude Sonnet 4.6</p>
          </div>

          {/* Model badge */}
          <motion.div
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full
                       bg-[#1a1a2e] border border-white/5 text-[11px] text-gray-400 select-none"
            whileHover={{ borderColor: 'rgba(139,92,246,0.4)', color: '#c4b5fd' }}
            transition={{ duration: 0.2 }}
            aria-label="Current model: Claude Sonnet"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            />
            Sonnet
          </motion.div>
        </motion.header>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-6
                     scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#252540]"
          role="list"
          aria-label="Messages"
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isEmpty ? (
              <motion.div
                key="hero"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HeroEmptyState onSuggest={setInput} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <ChatBubble key={msg.id} message={msg} index={i} />
                  ))}

                  {isTyping && (
                    <motion.div
                      key="typing"
                      className="flex gap-3"
                      role="status"
                      aria-label="Claude is composing a reply"
                      variants={bubbleVariants}
                      custom={messages.length}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700
                                      flex items-center justify-center text-xs font-bold text-white shrink-0
                                      shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                        C
                      </div>
                      <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl rounded-tl-sm
                                      shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                        <TypingIndicator />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isTyping={isTyping}
        />
      </main>
    </div>
  );
};

export default ClaudeChat;
