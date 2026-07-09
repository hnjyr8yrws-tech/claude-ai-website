/**
 * SignupForm — public double-opt-in sign-up for safety alerts + product updates.
 *
 * Drop-in, self-contained: manages its own state via useSignup (POST /api/signup
 * → n8n). Accessible (labelled fields, aria wiring, keyboard-navigable, honeypot
 * hidden from AT + tab order). Brand tokens throughout; lime reserved for the
 * single primary action.
 */
import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '@/hooks/useSignup';

const ROLES = ['Teacher', 'SLT', 'DSL', 'SENCO', 'Other'];

const EMAIL_RE = /.+@.+\..+/;

export interface SignupFormProps {
  /** Heading rendered above the fields; omit to render the fields only. */
  heading?: string;
  className?: string;
}

export default function SignupForm({ heading = 'Get safety alerts', className }: SignupFormProps) {
  const { submit, status, error, reset } = useSignup();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [school, setSchool] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [emailError, setEmailError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const loading = status === 'loading';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      emailRef.current?.focus();
      return;
    }
    setEmailError(null);
    void submit({ email: trimmed, name, role, school, consent: true, website });
  }

  // ── Success (double opt-in) ──────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div
        className={['rounded-xl border p-6 text-center', className].filter(Boolean).join(' ')}
        style={{ borderColor: 'var(--color-rule)', background: 'white' }}
        role="status"
      >
        <p className="font-display text-2xl" style={{ color: 'var(--text)' }}>Almost there — check your inbox</p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          We&rsquo;ve sent a confirmation link to <strong style={{ color: 'var(--text)' }}>{email.trim()}</strong>.
          Click it to confirm your subscription (double opt-in). If it doesn&rsquo;t arrive within a few minutes,
          check your spam folder.
        </p>
        <button
          type="button"
          onClick={() => { reset(); setEmail(''); setName(''); setRole(''); setSchool(''); }}
          className="mt-4 text-xs font-semibold underline underline-offset-2"
          style={{ color: 'var(--color-ink-accent)' }}
        >
          Sign up another address
        </button>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  const labelCls = 'block text-sm font-semibold mb-1';
  const inputCls =
    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-promptly-lime)]';
  const inputStyle = { borderColor: 'var(--color-rule)', background: 'var(--bg)', color: 'var(--text)' } as const;
  const optional = <span className="font-normal" style={{ color: 'var(--color-fog)' }}> (optional)</span>;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={heading ? 'signup-heading' : undefined}
      className={['rounded-xl border p-6', className].filter(Boolean).join(' ')}
      style={{ borderColor: 'var(--color-rule)', background: 'white' }}
    >
      {heading ? (
        <h2 id="signup-heading" className="font-display text-2xl" style={{ color: 'var(--text)' }}>{heading}</h2>
      ) : null}

      {status === 'error' && error ? (
        <p role="alert" className="mt-3 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#e6c9c0', background: '#fbf1ee', color: '#7a2e1d' }}>
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-4">
        {/* Email (required) */}
        <div>
          <label htmlFor="su-email" className={labelCls} style={{ color: 'var(--text)' }}>
            Email <span aria-hidden="true" style={{ color: 'var(--color-ink-accent)' }}>*</span>
          </label>
          <input
            ref={emailRef}
            id="su-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'su-email-err' : undefined}
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
            className={inputCls}
            style={inputStyle}
            placeholder="you@school.uk"
          />
          {emailError ? (
            <p id="su-email-err" role="alert" className="mt-1 text-xs" style={{ color: '#991b1b' }}>{emailError}</p>
          ) : null}
        </div>

        {/* Name (optional) */}
        <div>
          <label htmlFor="su-name" className={labelCls} style={{ color: 'var(--text)' }}>Name{optional}</label>
          <input id="su-name" name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} style={inputStyle} />
        </div>

        {/* Role (optional) */}
        <div>
          <label htmlFor="su-role" className={labelCls} style={{ color: 'var(--text)' }}>Your role{optional}</label>
          <select id="su-role" name="role" value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} style={inputStyle}>
            <option value="">Select your role…</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* School (optional) */}
        <div>
          <label htmlFor="su-school" className={labelCls} style={{ color: 'var(--text)' }}>School{optional}</label>
          <input id="su-school" name="school" type="text" autoComplete="organization" value={school} onChange={(e) => setSchool(e.target.value)} className={inputCls} style={inputStyle} />
        </div>

        {/* Honeypot — off-screen, hidden from AT + tab order. Bots fill it. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor="su-website">Website</label>
          <input id="su-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      {/* Consent copy — plain English, unbundled, unsubscribe named */}
      <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
        By signing up you&rsquo;ll receive <strong style={{ color: 'var(--text)' }}>safety alerts</strong> (for example,
        when a tool is withdrawn from review) and occasional <strong style={{ color: 'var(--text)' }}>product updates</strong>.
        We&rsquo;ll email you to confirm first (double opt-in), and you can <strong style={{ color: 'var(--text)' }}>unsubscribe</strong> from
        any email in one click. See our{' '}
        <Link to="/legal#privacy" className="underline underline-offset-2" style={{ color: 'var(--color-ink-accent)' }}>privacy policy</Link>.
      </p>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-1"
        style={{ background: 'var(--color-promptly-lime)', color: 'var(--color-ink)' }}
      >
        {loading ? 'Signing you up…' : 'Sign up for alerts'}
      </button>
    </form>
  );
}
