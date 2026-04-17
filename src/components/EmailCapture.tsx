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

const TEAL = '#00808a';

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
    <section style={{ background: '#111210' }} aria-label="Email newsletter sign-up">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 text-center">

        {/* Label */}
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: TEAL }}
        >
          Free weekly CPD picks
        </p>

        {/* Heading */}
        <h2 className="font-display text-3xl sm:text-4xl mb-3" style={{ color: 'white' }}>
          AI tips that actually work<br className="hidden sm:block" /> in UK schools.
        </h2>

        <p className="text-sm mb-8" style={{ color: '#9ca3af' }}>
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
                style={{ background: '#0d2e0d', border: `1px solid ${TEAL}` }}
              >
                <span style={{ color: TEAL }}>✓</span>
                <p className="text-sm font-semibold" style={{ color: 'white' }}>
                  Welcome to GetPromptly! Check your inbox.
                </p>
              </div>
              <p className="text-xs" style={{ color: '#6b7280' }}>
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
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  aria-pressed={selectedRoles.includes(role)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                  style={
                    selectedRoles.includes(role)
                      ? { background: TEAL, color: 'white', borderColor: TEAL }
                      : { background: 'transparent', color: '#9ca3af', borderColor: '#374151' }
                  }
                >
                  {role}
                </button>
              ))}
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
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: '#1f1f1c',
                    color: 'white',
                    border: `1px solid ${emailError ? '#ef4444' : '#374151'}`,
                  }}
                />
                {emailError && (
                  <p id="email-error" className="text-xs mt-1 text-left" style={{ color: '#ef4444' }}>
                    {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50 hover:opacity-80"
                style={{ background: TEAL, color: 'white' }}
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
                style={{ color: '#f87171' }}
              >
                {error}
              </motion.p>
            )}

            {/* GDPR notice */}
            <p className="text-[11px]" style={{ color: '#4b5563' }}>
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
