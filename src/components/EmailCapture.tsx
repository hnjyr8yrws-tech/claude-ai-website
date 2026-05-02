/**
 * EmailCapture.tsx
 *
 * Standalone email capture section.
 * Drop anywhere with: <EmailCapture />
 * Used on the homepage and can be reused on any page.
 */

import { FC, FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrevo } from '../hooks/useBrevo';
import { BubbleLayer } from './Bubbles';

const DARK = '#0F1C1A';
const LIME = '#BEFF00';
const TEXT_DIM = 'rgba(255,255,255,0.55)';
const TEXT_FAINT = 'rgba(255,255,255,0.32)';

const ROLES = [
  'Teacher', 'SLT', 'SEND Lead', 'DSL',
  'IT Manager', 'Parent', 'Finance', 'Student',
] as const;

type Role = typeof ROLES[number];

// Simple email format check — full validation happens server-side.
function isValidEmail(v: string) {
  return /.+@.+\..+/.test(v.trim());
}

const EmailCapture: FC = () => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [email, setEmail]                 = useState('');
  const [touched, setTouched]             = useState(false);   // show validation after first attempt

  const { subscribe, status, error } = useBrevo();

  const emailError = touched && email && !isValidEmail(email)
    ? 'Please enter a valid email address.'
    : null;

  function toggleRole(role: Role) {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!isValidEmail(email)) return;

    await subscribe({
      email:  email.trim(),
      roles:  selectedRoles,
      source: 'website',
    });
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: DARK }}
      aria-label="Email newsletter sign-up"
    >
      <BubbleLayer
        bubbles={[
          { variant: 'lime', size: 360, top: '-20%', left: '-10%', anim: 'gp-float-a' },
          { variant: 'cyan', size: 320, bottom: '-25%', right: '-8%', anim: 'gp-float-b' },
        ]}
      />

      <div className="relative max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center z-10">

        {/* Label */}
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase mb-5"
          style={{
            background: 'rgba(190,255,0,0.12)',
            color: LIME,
            border: '1px solid rgba(190,255,0,0.25)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: LIME, boxShadow: `0 0 6px ${LIME}` }}
            aria-hidden="true"
          />
          Free weekly CPD picks
        </span>

        {/* Heading */}
        <h2 className="font-display text-3xl sm:text-5xl mb-4 leading-[1.05]" style={{ color: 'white' }}>
          AI tips that <em
            className="not-italic"
            style={{
              backgroundImage: `linear-gradient(90deg, ${LIME} 0%, #D6FF4A 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >actually work</em><br className="hidden sm:block" /> in UK schools.
        </h2>

        <p className="text-sm sm:text-base mb-10" style={{ color: TEXT_DIM }}>
          Personalised to your role. One email a week. Free forever.
        </p>

        <AnimatePresence mode="wait">

          {/* ── SUCCESS STATE ── */}
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <div
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl mb-4"
                style={{
                  background: 'rgba(190,255,0,0.10)',
                  border: `1px solid ${LIME}`,
                  boxShadow: `0 0 24px rgba(190,255,0,0.25)`,
                }}
              >
                <span style={{ color: LIME, fontWeight: 700 }}>✓</span>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>
                  Welcome to GetPromptly! Check your inbox.
                </p>
              </div>
              <p className="text-xs" style={{ color: TEXT_FAINT }}>
                Can't see it? Check your spam folder and mark us as safe.
              </p>
            </motion.div>
          ) : (

          /* ── FORM STATE ── */
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            className="w-full"
          >
            {/* Role chip selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {ROLES.map(role => {
                const active = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    aria-pressed={active}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                    style={
                      active
                        ? {
                            background: LIME,
                            color: DARK,
                            borderColor: LIME,
                            boxShadow: '0 0 0 1px rgba(190,255,0,0.30), 0 6px 14px rgba(190,255,0,0.30)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            color: TEXT_DIM,
                            borderColor: 'rgba(255,255,255,0.14)',
                          }
                    }
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            {/* Email + submit */}
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="your@school.ac.uk"
                  required
                  aria-label="Email address"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[#BEFF00]"
                  style={{
                    background: '#F8F5F0',
                    color: '#1A1A1A',
                    border: `1px solid ${emailError ? '#ef4444' : 'rgba(255,255,255,0.18)'}`,
                    boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 10px rgba(0,0,0,0.25)',
                  }}
                />
                {emailError && (
                  <p id="email-error" className="text-xs mt-1 text-left" style={{ color: '#fca5a5' }}>
                    {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
                style={{
                  background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
                  color: DARK,
                  border: '1px solid rgba(15,28,26,0.16)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
                }}
              >
                {status === 'loading' ? 'Subscribing…' : 'Get free prompts →'}
              </button>
            </div>

            {/* API error */}
            {status === 'error' && error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs mb-3"
                style={{ color: '#fca5a5' }}
              >
                {error}
              </motion.p>
            )}

            {/* GDPR notice */}
            <p className="text-[11px]" style={{ color: TEXT_FAINT }}>
              No spam. Unsubscribe anytime. GDPR compliant. Double opt-in.
            </p>
          </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EmailCapture;
