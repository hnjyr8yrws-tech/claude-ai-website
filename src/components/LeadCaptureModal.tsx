/**
 * LeadCaptureModal.tsx
 *
 * Global email-capture modal. Listens for the custom event:
 *   window.dispatchEvent(new CustomEvent('open-lead-modal', { detail: { offer: 'free-prompt-pack' } }))
 *
 * Offer slugs must match the keys in api/lead-capture.ts.
 * Pressing Escape or clicking the backdrop closes the modal.
 */

import { FC, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TEAL = '#00808a';

const OFFER_LABELS: Record<string, { heading: string; body: string; cta: string }> = {
  'free-prompt-pack':       { heading: 'Get your free prompt pack',          body: "We'll email a role-specific starter pack you can copy into Claude, ChatGPT or Gemini today.",            cta: 'Send my free pack' },
  'school-toolkit':         { heading: 'Receive the school toolkit',          body: "We'll email a practical AI readiness toolkit for school leaders — tools, training, policy and prompts.",    cta: 'Send the toolkit' },
  'equipment-shortlist':    { heading: 'Email me an equipment shortlist',     body: "Tell us your role and we'll send a shortlist of suitable classroom or SEND equipment to your inbox.",       cta: 'Send the shortlist' },
  'teacher-prompt-pack':    { heading: 'Email me the teacher pack',           body: "Prompts for lesson planning, differentiation, feedback and parent communication — ready to copy.",           cta: 'Send my teacher pack' },
  'leader-prompt-pack':     { heading: 'Email me the leadership pack',        body: "Prompts for policy, Ofsted prep, governor briefings and AI rollout planning.",                              cta: 'Send my leadership pack' },
  'senco-prompt-pack':      { heading: 'Email me the SENCO pack',             body: "Prompts for provision mapping, EHCP review, access arrangements and parent letters.",                        cta: 'Send my SENCO pack' },
  'admin-prompt-pack':      { heading: 'Email me the admin pack',             body: "Prompts for parent letters, meeting summaries, timetable notices and communication templates.",              cta: 'Send my admin pack' },
  'parent-prompt-pack':     { heading: 'Email me the parents pack',           body: "Prompts for revision routines, homework help, school communication and SEN advocacy.",                       cta: 'Send my parents pack' },
  'student-prompt-pack':    { heading: 'Email me the student pack',           body: "Prompts for revision planning, essay improvement, exam practice and study confidence.",                      cta: 'Send my student pack' },
  'learning-pathway':       { heading: 'Get the full learning pathway',       body: "We'll email your personalised AI learning pathway — the most relevant training in the right order.",         cta: 'Send my learning pathway' },
  'teacher-learning-pathway':{ heading: 'Get the AI for Teachers pathway',   body: "Government-backed guidance, practical prompting courses and classroom-safe tool recommendations.",           cta: 'Send my teacher pathway' },
  'leader-learning-pathway': { heading: 'Get the Leadership AI pathway',     body: "Policy, safeguarding, data protection and whole-school CPD planning.",                                       cta: 'Send my leadership pathway' },
  'senco-learning-pathway':  { heading: 'Get the SENCO AI Toolkit pathway',  body: "Accessible AI, assistive technology, inclusive practice and EHCP documentation guidance.",                   cta: 'Send my SENCO pathway' },
};

const DEFAULT_OFFER = 'free-prompt-pack';

interface ModalState {
  open: boolean;
  offer: string;
}

const LeadCaptureModal: FC = () => {
  const [modal, setModal]   = useState<ModalState>({ open: false, offer: DEFAULT_OFFER });
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const inputRef            = useRef<HTMLInputElement>(null);

  // Listen for open-lead-modal events from anywhere in the app
  useEffect(() => {
    const handler = (e: Event) => {
      const offer = (e as CustomEvent<{ offer?: string }>).detail?.offer ?? DEFAULT_OFFER;
      setModal({ open: true, offer });
      setEmail('');
      setStatus('idle');
    };
    window.addEventListener('open-lead-modal', handler);
    return () => window.removeEventListener('open-lead-modal', handler);
  }, []);

  // Escape key
  useEffect(() => {
    if (!modal.open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modal.open]);

  // Focus input when modal opens
  useEffect(() => {
    if (modal.open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [modal.open]);

  function close() {
    setModal(m => ({ ...m, open: false }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/lead-capture', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:  trimmed,
          offer:  modal.offer,
          page:   window.location.pathname,
          source: 'getpromptly-site',
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const labels = OFFER_LABELS[modal.offer] ?? OFFER_LABELS[DEFAULT_OFFER];

  return (
    <AnimatePresence>
      {modal.open && (
        <>
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-heading"
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl shadow-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
            style={{ background: 'white' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
              style={{ color: '#6b6760' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="px-6 pt-6 pb-7">
              {/* Kicker */}
              <p className="gp-kicker mb-4" style={{ display: 'inline-flex' }}>GetPromptly</p>

              {status === 'success' ? (
                <div className="text-center py-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: '#e0f5f6' }}
                    aria-hidden="true"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M4 11l5 5 9-9" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 id="lead-modal-heading" className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
                    On its way!
                  </h2>
                  <p className="text-sm" style={{ color: '#6b6760' }}>
                    Check your inbox — we've sent the resource to <strong>{email}</strong>.
                    If it doesn't arrive, email{' '}
                    <a href="mailto:info@getpromptly.co.uk" className="underline" style={{ color: TEAL }}>info@getpromptly.co.uk</a>.
                  </p>
                  <button
                    onClick={close}
                    className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: TEAL }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h2 id="lead-modal-heading" className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {labels.heading}
                  </h2>
                  <p className="text-sm mb-5" style={{ color: '#6b6760' }}>{labels.body}</p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label htmlFor="lead-modal-email" className="sr-only">Email address</label>
                    <input
                      ref={inputRef}
                      id="lead-modal-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[#00808a]"
                      style={{ borderColor: '#e8e6e0', background: '#f7f6f2', color: 'var(--text)' }}
                    />
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ background: TEAL }}
                    >
                      {status === 'sending' ? 'Sending…' : labels.cta}
                    </button>
                    {status === 'error' && (
                      <p className="text-xs text-center" style={{ color: '#dc2626' }}>
                        Sorry, the email could not be sent. Please email{' '}
                        <a href="mailto:info@getpromptly.co.uk" className="underline">info@getpromptly.co.uk</a> directly.
                      </p>
                    )}
                  </form>

                  <p className="text-[11px] mt-3 text-center" style={{ color: '#c5c2bb' }}>
                    No spam. Unsubscribe any time. GDPR compliant.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
