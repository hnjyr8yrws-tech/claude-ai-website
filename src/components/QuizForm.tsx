/**
 * QuizForm.tsx — 60-Second Toolkit Quiz
 * Role-segmented email capture · 3-step flow
 * Accessible modal overlay — WCAG AA
 */

import { FC, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ROLES = [
  'Leadership / SLT',
  'Teaching & Curriculum',
  'SEND / Inclusion',
  'Safeguarding & Pastoral',
  'Administration',
  'Finance',
  'HR',
  'IT',
  'Communications',
  'Parent',
  'Student (college / uni / apprenticeship)',
] as const;

type Role = (typeof ROLES)[number];

interface QuizFormProps {
  open: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: 'Your Role',
  2: 'Your Email',
  3: 'Done!',
};

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

const panelVariants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { type: 'spring', stiffness: 280, damping: 28 } },
  exit:    { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } },
};

const QuizForm: FC<QuizFormProps> = ({ open, onClose }) => {
  const [step, setStep]   = useState<Step>(1);
  const [role, setRole]   = useState<Role | ''>('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);

  // Reset state each time modal opens
  useEffect(() => {
    if (open) {
      setStep(1); setRole(''); setEmail(''); setError('');
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [open]);

  // Trap Escape key
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, onClose]);

  const handleStep1 = () => {
    if (!role) { setError('Please select your role.'); return; }
    setError(''); setStep(2);
  };

  const handleStep2 = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.'); return;
    }
    setError(''); setStep(3);
    // TODO: POST { role, email } to your email platform (e.g. ConvertKit, Mailchimp)
  };

  const progressPct: Record<Step, number> = { 1: 33, 2: 66, 3: 100 };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            aria-hidden="true"
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="60-Second Toolkit Quiz"
            variants={panelVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div className="h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-brand-blue rounded-full"
                  animate={{ width: `${progressPct[step]}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand-blue mb-0.5">
                    Step {step} of 3 — {STEP_LABELS[step]}
                  </p>
                  <h2 className="text-lg font-black text-ink leading-tight">
                    {step < 3 ? '60-Second Toolkit Quiz' : 'You\'re all set! 🎉'}
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close quiz"
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M1 1l12 12M13 1L1 13"/>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">

                {/* Step 1 — Role */}
                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Which role best describes you? We'll send you a personalised toolkit — no spam, unsubscribe any time.
                    </p>
                    <div>
                      <label htmlFor="quiz-role" className="block text-sm font-semibold text-ink mb-2">
                        I work in…
                      </label>
                      <select
                        id="quiz-role"
                        ref={firstInputRef}
                        value={role}
                        onChange={(e) => { setRole(e.target.value as Role); setError(''); }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-ink bg-white
                                   focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/40
                                   transition-all appearance-none"
                      >
                        <option value="">Select your role…</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
                    <Button className="w-full" onClick={handleStep1}>
                      Continue →
                    </Button>
                  </div>
                )}

                {/* Step 2 — Email */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Great — you're in <span className="font-semibold text-ink">{role}</span>. Where should we send your free toolkit?
                    </p>
                    <div>
                      <label htmlFor="quiz-email" className="block text-sm font-semibold text-ink mb-2">
                        Work or school email
                      </label>
                      <input
                        id="quiz-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleStep2(); }}
                        placeholder="you@school.co.uk"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-ink
                                   focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/40
                                   transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">
                      GDPR compliant · Double opt-in · Unsubscribe any time
                    </p>
                    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
                      <Button className="flex-1" onClick={handleStep2}>Send My Toolkit →</Button>
                    </div>
                  </div>
                )}

                {/* Step 3 — Confirmation */}
                {step === 3 && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto">
                      ✅
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Check <strong>{email}</strong> for your personalised{' '}
                      <span className="text-brand-blue font-semibold">{role}</span> toolkit — 50 prompts + safety checklist, arriving within 5 minutes.
                    </p>
                    <p className="text-xs text-gray-400">
                      Can't find it? Check your spam/junk folder.
                    </p>
                    <Button className="w-full" onClick={onClose}>Close</Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuizForm;
