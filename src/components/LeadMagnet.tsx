import { useState, FC, ReactNode } from 'react';
import { useLeadCapture } from '../hooks/useLeadCapture';

/**
 * LeadMagnet — reusable email-capture card for content lead magnets.
 *
 * Used to replace sales-style CTAs ("Get a Quote", "Contact Sales") with
 * promise-of-value email captures:
 *   • Get your free prompt pack
 *   • Get the full learning pathway
 *   • Receive the school toolkit
 *   • Email me this equipment set
 *
 * Submission flow:
 *   1. Validate the email (must contain "@" and ".")
 *   2. Persist to localStorage (key: promptly_email) for cross-form auto-fill
 *   3. POST to /api/lead-capture with { email, offer, role, page, source }
 *   4. Backend sends: (a) the resource email to the user, (b) admin
 *      notification to info@getpromptly.co.uk
 *   5. Show success state, or error state with the info@getpromptly.co.uk
 *      fallback so the lead is never lost.
 *
 * Variants:
 *   light  — white card on cream backgrounds (default)
 *   dark   — translucent glass card for dark hero sections
 *   inline — slim two-column row, used inside other promo blocks
 */

const DARK = '#0F1C1A';
const LIME = '#BEFF00';

export type LeadMagnetVariant = 'light' | 'dark' | 'inline';

export interface LeadMagnetProps {
  /** Big, scannable headline — the promise. e.g. "Get your free prompt pack" */
  headline: string;
  /** One-line description of what they'll receive. */
  description?: ReactNode;
  /** Submit button label. e.g. "Send me the pack →" */
  buttonLabel?: string;
  /** Confirmation copy after submission. */
  successMessage?: ReactNode;
  /** Analytics `section` value passed to the email_capture_submitted event. */
  analyticsSection: string;
  /**
   * Offer key — must match a key in api/lead-capture.ts → offerContent.
   * Defaults to 'free-prompt-pack' so the form still works while content is wired.
   */
  offer?: string;
  /** Optional role (e.g. 'Teacher', 'SENCO') sent through to the admin notification. */
  role?: string;
  /**
   * Optional free-form metadata persisted to analytics alongside the email_capture_submitted
   * event. Useful for distinguishing which bundle/pack/role triggered the capture.
   * Values are stringified into the `source` field that reaches the admin email.
   */
  analyticsMeta?: Record<string, string | number | boolean>;
  /** Optional small trust line shown under the form. */
  trustNote?: ReactNode;
  /** Visual variant. Default: light. */
  variant?: LeadMagnetVariant;
  /** Optional eyebrow chip (e.g. "Free download"). */
  eyebrow?: string;
  /** Unique id segment used for the input — defaults to analyticsSection. */
  inputIdSuffix?: string;
}

const LeadMagnet: FC<LeadMagnetProps> = ({
  headline,
  description,
  buttonLabel = 'Send it to me →',
  successMessage,
  analyticsSection,
  offer = 'free-prompt-pack',
  role,
  analyticsMeta,
  trustNote = 'No spam. Unsubscribe any time. UK GDPR compliant.',
  variant = 'light',
  eyebrow,
  inputIdSuffix,
}) => {
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('promptly_email') || ''; } catch { return ''; }
  });
  const { submit, status, error } = useLeadCapture();
  const sent = status === 'success';

  const inputId = `lead-magnet-${inputIdSuffix || analyticsSection}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Compose a source string that includes analyticsMeta so the admin
    // notification email can tell apart equipment bundles, role packs etc.
    const metaSuffix = analyticsMeta
      ? ` [${Object.entries(analyticsMeta).map(([k, v]) => `${k}=${v}`).join(',')}]`
      : '';
    await submit({
      email,
      offer,
      role,
      source: `${analyticsSection}${metaSuffix}`,
    });
  };

  // ── Style tokens per variant ───────────────────────────────────────────────
  const isDark = variant === 'dark';

  const cardStyle: React.CSSProperties = isDark
    ? {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset, 0 12px 32px rgba(0,0,0,0.25)',
      }
    : {
        background: '#FFFFFF',
        borderColor: '#ECE7DD',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 24px rgba(15,28,26,0.06)',
      };

  const inputStyle: React.CSSProperties = isDark
    ? {
        background: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.18)',
        color: '#FFFFFF',
      }
    : {
        background: '#F8F5F0',
        borderColor: '#ECE7DD',
        color: DARK,
      };

  const headingColor = isDark ? '#FFFFFF' : DARK;
  const descColor = isDark ? 'rgba(255,255,255,0.65)' : '#4A4A4A';
  const trustColor = isDark ? 'rgba(255,255,255,0.45)' : '#9C9690';

  // ── Success state ──────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div
        className={`rounded-2xl border ${variant === 'inline' ? 'px-5 py-4' : 'px-6 py-5'} flex items-center gap-3`}
        style={{
          borderColor: 'rgba(190,255,0,0.45)',
          background: isDark ? 'rgba(190,255,0,0.10)' : 'rgba(190,255,0,0.12)',
          boxShadow: '0 0 0 1px rgba(190,255,0,0.18), 0 8px 22px rgba(15,28,26,0.08)',
        }}
        role="status"
        aria-live="polite"
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ background: LIME, color: DARK }}
          aria-hidden="true"
        >
          ✓
        </span>
        <p className="text-sm font-semibold" style={{ color: isDark ? '#FFFFFF' : DARK }}>
          {successMessage ?? <>Check your inbox — we&apos;ve sent it to <strong>{email}</strong>.</>}
        </p>
      </div>
    );
  }

  const sending = status === 'sending';
  const errored = status === 'error';

  // ── Inline variant: slim two-column row ────────────────────────────────────
  if (variant === 'inline') {
    return (
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3"
        style={cardStyle}
        aria-label={headline}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight" style={{ color: headingColor }}>
            {headline}
          </p>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: descColor }}>{description}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 sm:w-auto w-full">
          <label htmlFor={inputId} className="sr-only">Email address</label>
          <input
            id={inputId}
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={sending}
            aria-invalid={errored || undefined}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#BEFF00] focus:ring-2 focus:ring-[#BEFF00]"
            style={{ ...inputStyle, minWidth: 200 }}
          />
          <button
            type="submit"
            disabled={sending}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] disabled:opacity-60 disabled:translate-y-0 disabled:cursor-wait"
            style={{
              background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
              color: DARK,
              border: '1px solid rgba(15,28,26,0.16)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
            }}
          >
            {sending ? 'Sending…' : buttonLabel}
          </button>
        </div>
        {errored && error && (
          <p className="text-xs basis-full" style={{ color: '#dc2626' }} role="alert">{error}</p>
        )}
      </form>
    );
  }

  // ── Default card variant (light or dark) ───────────────────────────────────
  return (
    <div className="rounded-2xl border p-6" style={cardStyle}>
      {eyebrow && (
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
          style={{
            background: isDark ? 'rgba(190,255,0,0.18)' : 'rgba(190,255,0,0.18)',
            color: isDark ? '#BEFF00' : DARK,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: LIME, boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      )}
      <h3
        className="font-display text-xl sm:text-2xl leading-tight mb-2"
        style={{ color: headingColor }}
      >
        {headline}
      </h3>
      {description && (
        <p className="text-sm leading-relaxed mb-4" style={{ color: descColor }}>
          {description}
        </p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor={inputId} className="sr-only">Email address</label>
        <input
          id={inputId}
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={sending}
          aria-invalid={errored || undefined}
          className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#BEFF00] focus:ring-2 focus:ring-[#BEFF00]"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={sending}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] disabled:opacity-60 disabled:translate-y-0 disabled:cursor-wait"
          style={{
            background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
            color: DARK,
            border: '1px solid rgba(15,28,26,0.16)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
          }}
        >
          {sending ? 'Sending…' : buttonLabel}
        </button>
      </form>
      {errored && error && (
        <p className="text-xs mt-2" style={{ color: '#dc2626' }} role="alert">{error}</p>
      )}
      <p className="text-[11px] mt-3" style={{ color: trustColor }}>
        {trustNote}
      </p>
    </div>
  );
};

export default LeadMagnet;
