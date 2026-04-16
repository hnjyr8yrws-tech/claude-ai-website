/**
 * AIToolsAndSafety.tsx
 * Merged split-screen section:
 *   Left  — AI Tools Directory (pastel bg · lime green wave lines · audience tabs)
 *   Right — Promptly Safety Score (dark navy · space dust · coral CTA)
 *
 * Style: Playfair Display headings · coral #F05A4A accents · generous whitespace
 */

import { FC, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Palette constants ──────────────────────────────────────────────────────

const CORAL    = '#F05A4A';
const NAVY_BG  = '#0F172A';
const LIME_STR = '#84CC16';
const CARD_PASTELS = ['#CFE6F3', '#DDEFD2', '#F3E7A2', '#EBC3C8', '#D9D2F4'];

// ── Tool data ──────────────────────────────────────────────────────────────

type Audience = 'Schools & Admin' | 'Parents & Carers' | 'Students' | 'SEND';

interface Tool {
  name: string;
  logo: string;
  desc: string;
  score: number;
  url: string;
}

const TOOLS: Record<Audience, Tool[]> = {
  'Schools & Admin': [
    { name: 'Claude',         logo: '🤖', desc: 'Thoughtful AI for lesson planning, policy drafting, and staff communication.', score: 9.2, url: '#' },
    { name: 'ChatGPT',        logo: '💬', desc: 'Versatile assistant for writing, research, and admin with configurable safety settings.', score: 8.5, url: '#' },
    { name: 'Microsoft Copilot', logo: '🪁', desc: 'AI across Office 365 — emails, docs, spreadsheets, and Teams meetings.', score: 8.8, url: '#' },
    { name: 'Grammarly',      logo: '✍️', desc: 'AI writing assistant for polished, consistent school communications.', score: 9.4, url: '#' },
    { name: 'Otter.ai',       logo: '🦦', desc: 'Auto-transcription for governor meetings, CPD sessions, and parent evenings.', score: 8.9, url: '#' },
    { name: 'Canva Magic',    logo: '🎨', desc: 'AI-powered design for newsletters, displays, and branded presentations.', score: 9.3, url: '#' },
  ],
  'Parents & Carers': [
    { name: 'ChatGPT',        logo: '💬', desc: 'Ask anything in plain English — homework help, meal plans, parenting questions.', score: 8.5, url: '#' },
    { name: 'Gemini',         logo: '♊', desc: "Google's AI integrated with Search and Gmail for everyday household use.", score: 8.6, url: '#' },
    { name: 'Perplexity',     logo: '🔍', desc: 'AI search with cited sources — ideal for researching SEND support or school options.', score: 8.7, url: '#' },
    { name: 'Canva',          logo: '🎨', desc: 'Design birthday invitations, revision resources, and home learning materials.', score: 9.3, url: '#' },
    { name: 'Read&Write',     logo: '📖', desc: 'Literacy support for dyslexic learners — text-to-speech and word prediction.', score: 9.1, url: '#' },
    { name: 'Khan Academy',   logo: '🏫', desc: 'Free AI tutor (Khanmigo) aligned to UK curriculum — safe and ad-free.', score: 9.5, url: '#' },
  ],
  'Students': [
    { name: 'Notion AI',      logo: '📝', desc: 'AI inside your notes — summarise, brainstorm, and organise revision effortlessly.', score: 9.4, url: '#' },
    { name: 'Grammarly',      logo: '✍️', desc: 'Improve every essay with real-time clarity, grammar, and style suggestions.', score: 9.4, url: '#' },
    { name: 'Khan Academy',   logo: '🏫', desc: 'Patient step-by-step AI tutor that adapts to your level and pace.', score: 9.5, url: '#' },
    { name: 'Quizlet',        logo: '🃏', desc: 'AI-generated flashcards and practice tests from your own notes.', score: 9.0, url: '#' },
    { name: 'Perplexity',     logo: '🔍', desc: 'Cited research answers — no hallucinated sources for essays or coursework.', score: 8.7, url: '#' },
    { name: 'Claude',         logo: '🤖', desc: 'Thoughtful AI for essay feedback, revision planning, and idea exploration.', score: 9.2, url: '#' },
  ],
  'SEND': [
    { name: 'Otter.ai',       logo: '🦦', desc: 'Real-time captions and auto-transcription for d/Deaf and hard-of-hearing learners.', score: 8.9, url: '#' },
    { name: 'Read&Write',     logo: '📖', desc: 'Award-winning literacy tool — text-to-speech, highlighting, word prediction.', score: 9.1, url: '#' },
    { name: 'Speechify',      logo: '🔊', desc: 'Listen to any text at custom speeds — books, PDFs, websites, and emails.', score: 8.8, url: '#' },
    { name: 'Immersive Reader', logo: '👁️', desc: "Microsoft's free reading aid — syllables, line focus, and picture dictionary.", score: 9.3, url: '#' },
    { name: 'Co:Writer',      logo: '⌨️', desc: 'Context-aware predictive writing — designed for learners with writing difficulties.', score: 9.0, url: '#' },
    { name: 'Khan Academy',   logo: '🏫', desc: 'Patient, adaptive AI tutor that never judges — perfect for learners who need more time.', score: 9.5, url: '#' },
  ],
};

const AUDIENCES: Audience[] = ['Schools & Admin', 'Parents & Carers', 'Students', 'SEND'];

function scoreColor(score: number): string {
  if (score >= 9) return '#16A34A';
  if (score >= 7) return '#D97706';
  return '#DC2626';
}

// ── Space-dust particle data ────────────────────────────────────────────────

interface Particle { id: number; x: number; y: number; r: number; dur: number; delay: number; opacity: number; tint: string; }

function makeParticles(n: number): Particle[] {
  const tints = ['#ffffff', '#ffffff', '#ffffff', CORAL, LIME_STR, '#93C5FD'];
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 2.2 + 0.4,
    dur: Math.random() * 9 + 6,
    delay: Math.random() * 9,
    opacity: Math.random() * 0.55 + 0.15,
    tint: tints[Math.floor(Math.random() * tints.length)],
  }));
}

// ── Wave SVG overlay (left panel) ──────────────────────────────────────────

const WaveBackground: FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 800 960"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.16 }}
  >
    {Array.from({ length: 16 }, (_, i) => (
      <path
        key={i}
        d={`M-60 ${62 + i * 56} Q180 ${32 + i * 56} 400 ${62 + i * 56} T860 ${62 + i * 56}`}
        stroke={LIME_STR}
        strokeWidth="1.4"
        fill="none"
      />
    ))}
  </svg>
);

// ── Left panel — AI Tools Directory ────────────────────────────────────────

const ToolsPanel: FC = () => {
  const [activeAudience, setActiveAudience] = useState<Audience>('Schools & Admin');
  const tools = TOOLS[activeAudience];

  return (
    <div
      className="relative flex flex-col"
      style={{ background: '#F4FAF0' }}
    >
      <WaveBackground />

      <div className="relative z-10 flex flex-col px-7 lg:px-10 pt-12 pb-12">

        {/* ── Header ── */}
        <div className="mb-8">
          <span
            className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5"
            style={{ background: '#DDEFD2', color: '#166534' }}
          >
            AI Tools Directory
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
              color: '#111827',
              lineHeight: 1.13,
            }}
            className="text-4xl sm:text-5xl font-bold"
          >
            180+ safety-rated
            <br />
            <span style={{ color: '#4D7C0F' }}>AI tools</span>
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-xs leading-relaxed">
            Every tool independently reviewed by our team.
            No paid placements — ever.
          </p>
        </div>

        {/* ── Audience tabs ── */}
        <div className="flex flex-wrap gap-2 mb-7">
          {AUDIENCES.map((a) => (
            <button
              key={a}
              onClick={() => setActiveAudience(a)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={
                activeAudience === a
                  ? {
                      background: '#111827',
                      color: '#fff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.75)',
                      color: '#374151',
                      border: '1px solid #BBDFAA',
                    }
              }
            >
              {a}
            </button>
          ))}
        </div>

        {/* ── Tool cards ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAudience}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            {tools.map((tool, idx) => {
              const bg = CARD_PASTELS[idx % CARD_PASTELS.length];
              return (
                <motion.div
                  key={tool.name + activeAudience}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.055, duration: 0.22 }}
                  className="rounded-2xl p-5 flex flex-col gap-3 relative"
                  style={{
                    background: bg,
                    border: `1.5px solid rgba(0,0,0,0.06)`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Logo + name row */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.68)' }}
                    >
                      {tool.logo}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {tool.name}
                      </h3>
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: scoreColor(tool.score) }}
                      >
                        {tool.score}/10 safety
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                    {tool.desc}
                  </p>

                  <a
                    href={tool.url}
                    className="text-xs font-bold underline underline-offset-2 self-start mt-auto transition-opacity hover:opacity-70"
                    style={{ color: '#111827' }}
                  >
                    View →
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer ── */}
        <div className="mt-8 pt-6 border-t border-lime-200/70 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-500">
            Showing 6 of <strong>180+</strong> tools · Updated April 2026
          </p>
          <button
            className="text-xs font-bold px-5 py-2 rounded-full transition-all hover:opacity-90"
            style={{ background: '#111827', color: '#fff' }}
          >
            Browse all tools →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Safety check multi-step ─────────────────────────────────────────────────

const SAFETY_STEPS = [
  {
    question: 'Who is this tool for?',
    options: ['Primary school pupils', 'Secondary school pupils', 'Home learners', 'Teachers & staff'],
  },
  {
    question: 'What will it mainly be used for?',
    options: ['Lessons & curriculum', 'Admin & planning', 'Personal learning', 'SEND support'],
  },
  {
    question: 'Youngest user age?',
    options: ['Under 8', '8–11', '12–15', '16 and over'],
  },
];

type CheckStage = 'idle' | 'quiz' | 'result';

// ── Right panel — Promptly Safety Score ────────────────────────────────────

const SafetyPanel: FC = () => {
  const [stage, setStage] = useState<CheckStage>('idle');
  const [step, setStep]   = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const particles = useRef<Particle[]>(makeParticles(60));

  const handleAnswer = (opt: string) => {
    const next = [...answers, opt];
    if (step + 1 < SAFETY_STEPS.length) {
      setAnswers(next);
      setStep((s) => s + 1);
    } else {
      setAnswers(next);
      setStage('result');
    }
  };

  const reset = () => { setStage('idle'); setStep(0); setAnswers([]); };

  return (
    <div
      className="relative flex flex-col"
      style={{ background: NAVY_BG }}
    >
      {/* ── Space dust ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {particles.current.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width:   p.r * 2,
              height:  p.r * 2,
              left:    `${p.x}%`,
              top:     `${p.y}%`,
              background: p.tint,
              opacity: p.opacity,
            }}
            animate={{ y: [0, -18, 4, 0], opacity: [p.opacity, p.opacity * 0.35, p.opacity * 0.8, p.opacity] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Panel content ── */}
      <div className="relative z-10 flex flex-col px-7 lg:px-10 py-16 sm:py-24 justify-center">
        <AnimatePresence mode="wait">

          {/* ─────────── IDLE / landing ─────────── */}
          {stage === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.32 }}
              className="space-y-8 max-w-md"
            >
              {/* Label */}
              <span
                className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(240,90,74,0.12)',
                  color: CORAL,
                  border: `1px solid rgba(240,90,74,0.28)`,
                }}
              >
                Promptly Safety Score
              </span>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                  color: '#fff',
                  lineHeight: 1.2,
                }}
                className="text-3xl sm:text-4xl font-bold"
              >
                Is this AI tool safe for your school, child, or setting?
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                Answer three quick questions for an instant, personalised
                safety verdict — no account needed.
              </p>

              {/* Instant results preview card */}
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: '#475569' }}
                >
                  Instant on-screen results
                </p>
                {[
                  { label: 'GDPR compliant',          pass: true  },
                  { label: 'Age-appropriate content', pass: true  },
                  { label: 'Data stays in UK / EEA',  pass: true  },
                  { label: 'Teacher admin controls',  pass: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: row.pass
                          ? 'rgba(34,197,94,0.15)'
                          : 'rgba(239,68,68,0.12)',
                      }}
                    >
                      {row.pass ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M3 3l4 4M7 3L3 7" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: row.pass ? '#CBD5E1' : '#94A3B8' }}
                    >
                      {row.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                {/* Primary coral CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStage('quiz')}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base"
                  style={{
                    background: CORAL,
                    boxShadow: `0 4px 28px rgba(240,90,74,0.42)`,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Start the Safety Check →
                </motion.button>

                {/* Secondary pair */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Get Personalised\nRecommendations', onClick: undefined },
                    { label: 'Speak with\nan Agent', onClick: () => window.dispatchEvent(new CustomEvent('open-agent-chat')) },
                  ].map(({ label, onClick }) => (
                    <motion.button
                      key={label}
                      onClick={onClick}
                      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.97 }}
                      className="py-3.5 rounded-xl text-xs font-semibold leading-snug text-center whitespace-pre-line"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#CBD5E1',
                      }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-center" style={{ color: '#334155' }}>
                100% independent · No paid placements · GDPR compliant
              </p>
            </motion.div>
          )}

          {/* ─────────── QUIZ steps ─────────── */}
          {stage === 'quiz' && (
            <motion.div
              key={`quiz-${step}`}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.26 }}
              className="space-y-7 max-w-md"
            >
              {/* Progress row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (step > 0) {
                      setStep((s) => s - 1);
                      setAnswers((a) => a.slice(0, -1));
                    } else {
                      reset();
                    }
                  }}
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: '#64748B' }}
                >
                  ← Back
                </button>
                <div
                  className="flex-1 h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: CORAL }}
                    initial={{ width: `${(step / SAFETY_STEPS.length) * 100}%` }}
                    animate={{ width: `${((step + 1) / SAFETY_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs font-mono" style={{ color: '#475569' }}>
                  {step + 1}/{SAFETY_STEPS.length}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                  color: '#fff',
                  lineHeight: 1.25,
                }}
                className="text-2xl font-bold"
              >
                {SAFETY_STEPS[step].question}
              </h3>

              <div className="space-y-3">
                {SAFETY_STEPS[step].options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.02, borderColor: CORAL }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-150"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E2E8F0',
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────── RESULT ─────────── */}
          {stage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 max-w-md"
            >
              {/* Score dial */}
              <div className="text-center">
                <motion.div
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    border: '2.5px solid #22C55E',
                    color: '#22C55E',
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                >
                  8.7
                </motion.div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    color: '#fff',
                  }}
                  className="text-2xl font-bold"
                >
                  Good for your setting
                </h3>
                <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>
                  Based on your answers, this tool is well-suited
                  for <strong className="text-slate-200">{answers[0]?.toLowerCase() ?? 'your context'}</strong>.
                </p>
              </div>

              {/* Criteria breakdown */}
              <div className="space-y-2">
                {[
                  { label: 'GDPR compliant',         ok: true  },
                  { label: 'Age filters active',      ok: true  },
                  { label: 'Data in UK / EEA',        ok: true  },
                  { label: 'Parental controls',       ok: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: row.ok
                          ? 'rgba(34,197,94,0.15)'
                          : 'rgba(245,158,11,0.15)',
                      }}
                    >
                      {row.ok ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5h6" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: '#CBD5E1' }}>
                      {row.label}
                    </span>
                    {!row.ok && (
                      <span
                        className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
                      >
                        Check settings
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
                  style={{ background: CORAL, boxShadow: `0 3px 18px rgba(240,90,74,0.35)` }}
                >
                  Get Personalised Recommendations →
                </motion.button>
                <button
                  onClick={reset}
                  className="w-full py-3 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: '#64748B',
                  }}
                >
                  Start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Main export ─────────────────────────────────────────────────────────────

const AIToolsAndSafety: FC = () => {
  // Inject Playfair Display if not already present
  useEffect(() => {
    if (document.getElementById('promptly-playfair')) return;
    const link = document.createElement('link');
    link.id   = 'promptly-playfair';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <section
      id="tools-and-safety"
      aria-label="AI Tools Directory and Safety Score"
      className="w-full"
    >
      {/* Split screen — stacks vertically on mobile, side-by-side on lg+ */}
      <div className="flex flex-col lg:flex-row">

        {/* Left — AI Tools Directory */}
        <div className="flex-1 lg:w-1/2">
          <ToolsPanel />
        </div>

        {/* Right — Safety Score */}
        <div className="flex-1 lg:w-1/2">
          <SafetyPanel />
        </div>

      </div>
    </section>
  );
};

export default AIToolsAndSafety;
