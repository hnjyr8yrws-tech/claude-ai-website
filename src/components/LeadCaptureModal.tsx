/**
 * LeadCaptureModal.tsx
 *
 * Global email-capture modal. Listens for the custom event:
 *   window.dispatchEvent(new CustomEvent('open-lead-modal', {
 *     detail: { offer: 'free-prompt-pack', role: 'Teacher' }
 *   }))
 *
 * Offer slugs must match the keys in api/lead-capture.ts → offerContent.
 * Pressing Escape or clicking the backdrop closes the modal.
 *
 * Submission goes through the shared useLeadCapture hook so the same
 * validation, network and fallback flow runs everywhere on the site.
 */

import { FC, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeadCapture } from '../hooks/useLeadCapture';

const LIME = '#BEFF00';
const DARK = '#0F1C1A';

const OFFER_LABELS: Record<string, { heading: string; body: string; cta: string }> = {
  'free-prompt-pack':           { heading: 'Get your free prompt pack',         body: "We'll email a role-specific starter pack you can copy into Claude, ChatGPT or Gemini today.",          cta: 'Send my free pack' },
  'school-toolkit':             { heading: 'Receive the school toolkit',         body: "We'll email a practical AI readiness toolkit for school leaders — tools, training, policy and prompts.",  cta: 'Send the toolkit' },
  'equipment-shortlist':        { heading: 'Email me an equipment shortlist',    body: "Tell us your role and we'll send a shortlist of suitable classroom or SEND equipment to your inbox.",     cta: 'Send the shortlist' },
  'teacher-prompt-pack':        { heading: 'Email me the teacher pack',          body: "Prompts for lesson planning, differentiation, feedback and parent communication — ready to copy.",         cta: 'Send my teacher pack' },
  'leader-prompt-pack':         { heading: 'Email me the leadership pack',       body: 'Prompts for policy, Ofsted prep, governor briefings and AI rollout planning.',                              cta: 'Send my leadership pack' },
  'senco-prompt-pack':          { heading: 'Email me the SENCO pack',            body: 'Prompts for provision mapping, EHCP review, access arrangements and parent letters.',                       cta: 'Send my SENCO pack' },
  'admin-prompt-pack':          { heading: 'Email me the admin pack',            body: 'Prompts for parent letters, meeting summaries, timetable notices and communication templates.',             cta: 'Send my admin pack' },
  'parent-prompt-pack':         { heading: 'Email me the parents pack',          body: 'Prompts for revision routines, homework help, school communication and SEN advocacy.',                      cta: 'Send my parents pack' },
  'student-prompt-pack':        { heading: 'Email me the student pack',          body: 'Prompts for revision planning, essay improvement, exam practice and study confidence.',                     cta: 'Send my student pack' },
  'subject-leads-prompt-pack':  { heading: 'Email me the subject leads pack',    body: 'Prompts for curriculum mapping, schemes of work, departmental CPD and exam-board policy.',                  cta: 'Send my subject leads pack' },
  'learning-pathway':           { heading: 'Get the full learning pathway',      body: "We'll email your personalised AI learning pathway — the most relevant training in the right order.",       cta: 'Send my learning pathway' },
  'teacher-learning-pathway':   { heading: 'Get the AI for Teachers pathway',    body: 'Government-backed guidance, practical prompting courses and classroom-safe tool recommendations.',          cta: 'Send my teacher pathway' },
  'leader-learning-pathway':    { heading: 'Get the Leadership AI pathway',      body: 'Policy, safeguarding, data protection and whole-school CPD planning.',                                      cta: 'Send my leadership pathway' },
  'senco-learning-pathway':     { heading: 'Get the SENCO AI Toolkit pathway',   body: 'Accessible AI, assistive technology, inclusive practice and EHCP documentation guidance.',                  cta: 'Send my SENCO pathway' },
  'send-learning-pathway':      { heading: 'Get the Accessible AI for SEND pathway', body: 'Assistive tech, accessibility-first AI and neurodiversity guidance for inclusive classrooms.',         cta: 'Send my SEND pathway' },
  'subject-leads-learning-pathway': { heading: 'Get the Subject Leads AI pathway', body: 'Curriculum design, exam-board AI policy and department-level CPD planning.',                              cta: 'Send my subject leads pathway' },
  'admin-learning-pathway':     { heading: 'Get the Admin AI Productivity pathway', body: 'Microsoft 365 and Google Workspace AI training plus GDPR essentials for school admin teams.',           cta: 'Send my admin pathway' },
  'parent-learning-pathway':    { heading: 'Get the AI for Parents pathway',     body: 'Family-friendly AI safety guidance — what kids use, how to talk about it, what to watch for.',              cta: 'Send my parents pathway' },
  'student-learning-pathway':   { heading: 'Get the AI Literacy for Students pathway', body: 'Age-appropriate AI literacy — how it works, how to stay safe, how to use it responsibly.',           cta: 'Send my students pathway' },
  'safeguarding-learning-pathway': { heading: 'Get the AI Safeguarding pathway', body: 'KCSIE 2024, JCQ, online harms and AI risk management — essential for DSLs and SLT.',                       cta: 'Send my safeguarding pathway' },
  'policy-learning-pathway':    { heading: 'Get the AI Policy & Governance pathway', body: 'ICO, Ofqual and ASCL briefings plus a whole-school AI policy starter.',                                  cta: 'Send my policy pathway' },
};

const DEFAULT_OFFER = 'free-prompt-pack';

interface ModalState {
  open: boolean;
  offer: string;
  role: string;
}

const LeadCaptureModal: FC = () => {
  const [modal, setModal] = useState<ModalState>({ open: false, offer: DEFAULT_OFFER, role: '' });
  const [email, setEmail] = useState('');
  const inputRef          = useRef<HTMLInputElement>(null);
  const { submit, status, error, reset } = useLeadCapture();

  // Listen for open-lead-modal events from anywhere in the app
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ offer?: string; role?: string }>).detail ?? {};
      setModal({ open: true, offer: detail.offer ?? DEFAULT_OFFER, role: detail.role ?? '' });
      // Pre-fill email if we already captured one elsewhere on the site.
      try { setEmail(localStorage.getItem('promptly_email') || ''); } catch { setEmail(''); }
      reset();
    };
    window.addEventListener('open-lead-modal', handler);
    return () => window.removeEventListener('open-lead-modal', handler);
  }, [reset]);

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
    await submit({
      email,
      offer:  modal.offer,
      role:   modal.role,
      source: `lead-modal:${modal.offer}`,
    });
  }

  const labels  = OFFER_LABELS[modal.offer] ?? OFFER_LABELS[DEFAULT_OFFER];
  const sending = status === 'sending';
  const success = status === 'success';
  const errored = status === 'error';

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
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
            style={{
              background: 'white',
              border: '1px solid #ECE7DD',
              boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 24px 60px rgba(15,28,26,0.22)',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
              style={{ color: '#4A4A4A' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="px-6 pt-6 pb-7">
              {/* Kicker */}
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
                style={{ background: 'rgba(190,255,0,0.18)', color: DARK }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: LIME, boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
                  aria-hidden="true"
                />
                GetPromptly
              </span>

              {success ? (
                <div className="text-center py-2" role="status" aria-live="polite">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: 'rgba(190,255,0,0.18)',
                      boxShadow: '0 0 0 1px rgba(190,255,0,0.35), 0 8px 22px rgba(190,255,0,0.25)',
                    }}
                    aria-hidden="true"
                  >
                    <span className="text-xl font-bold" style={{ color: DARK }}>✓</span>
                  </div>
                  <h2 id="lead-modal-heading" className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>
                    On its way!
                  </h2>
                  <p className="text-sm" style={{ color: '#4A4A4A' }}>
                    Check your inbox — we&apos;ve sent it to <strong>{email}</strong>.
                    If it doesn&apos;t arrive, email{' '}
                    <a href="mailto:info@getpromptly.co.uk" className="underline font-semibold" style={{ color: DARK }}>
                      info@getpromptly.co.uk
                    </a>.
                  </p>
                  <button
                    onClick={close}
                    className="mt-5 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                    style={{
                      background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
                      color: DARK,
                      border: '1px solid rgba(15,28,26,0.16)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <h2 id="lead-modal-heading" className="font-display text-2xl mb-2 leading-tight" style={{ color: 'var(--text)' }}>
                    {labels.heading}
                  </h2>
                  <p className="text-sm mb-5" style={{ color: '#4A4A4A' }}>{labels.body}</p>

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
                      disabled={sending}
                      aria-invalid={errored || undefined}
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors focus:border-[#BEFF00] focus:ring-2 focus:ring-[#BEFF00]"
                      style={{ borderColor: '#ECE7DD', background: '#F8F5F0', color: 'var(--text)' }}
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] disabled:opacity-60 disabled:translate-y-0 disabled:cursor-wait"
                      style={{
                        background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
                        color: DARK,
                        border: '1px solid rgba(15,28,26,0.16)',
                        boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
                      }}
                    >
                      {sending ? 'Sending…' : labels.cta}
                    </button>
                    {errored && (
                      <p className="text-xs text-center" style={{ color: '#dc2626' }} role="alert">
                        {error ?? 'Sorry, the email could not be sent.'}{' '}
                        <a href="mailto:info@getpromptly.co.uk" className="underline font-semibold">
                          info@getpromptly.co.uk
                        </a>{' '}
                        will reply by hand.
                      </p>
                    )}
                  </form>

                  <p className="text-[11px] mt-3 text-center" style={{ color: '#9C9690' }}>
                    No spam. Unsubscribe any time. UK GDPR compliant.
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
