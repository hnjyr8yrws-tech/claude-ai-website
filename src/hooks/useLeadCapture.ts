/**
 * useLeadCapture.ts
 *
 * Reusable lead-capture hook. Wraps the /api/lead-capture serverless function
 * and provides validation, network-failure fallback and idle/sending/success/error
 * status states for any inline or modal email-capture surface.
 *
 * The Brevo API key never leaves the server — this hook only calls our own
 * Edge endpoint, which then dispatches the resource email + admin notification.
 *
 * Usage:
 *   const { submit, status, error, reset } = useLeadCapture();
 *   await submit({
 *     email,
 *     offer:  'teacher-learning-pathway',
 *     role:   'Teacher',                      // optional
 *     source: 'ai-training-pathway-card',     // recommended for analytics
 *   });
 *
 * Status states:
 *   idle    — not yet submitted
 *   sending — POST in flight
 *   success — backend returned 2xx
 *   error   — validation, network or server error (see `error`)
 *
 * On error, the message will instruct the user to email
 * info@getpromptly.co.uk as the documented fallback.
 */

import { useCallback, useState } from 'react';
import { track } from '../utils/analytics';

export type LeadCaptureStatus = 'idle' | 'sending' | 'success' | 'error';

export interface LeadCaptureParams {
  /** User's email address. Trimmed and lowercased before submit. */
  email: string;
  /** Offer key — must match a key in api/lead-capture.ts → offerContent. */
  offer: string;
  /** Optional role context (e.g. 'Teacher', 'SENCO'). */
  role?: string;
  /** Where on the site the capture happened — used for analytics & admin email. */
  source?: string;
}

interface UseLeadCaptureReturn {
  submit: (params: LeadCaptureParams) => Promise<boolean>;
  status: LeadCaptureStatus;
  error:  string | null;
  reset:  () => void;
}

const FALLBACK_MESSAGE =
  'Sorry — we could not send your email. Please email info@getpromptly.co.uk and we will reply with the resource by hand.';

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

export function useLeadCapture(): UseLeadCaptureReturn {
  const [status, setStatus] = useState<LeadCaptureStatus>('idle');
  const [error, setError]   = useState<string | null>(null);

  const submit = useCallback(async ({ email, offer, role, source }: LeadCaptureParams): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !EMAIL_PATTERN.test(trimmed)) {
      setStatus('error');
      setError('Please enter a valid email address.');
      return false;
    }

    setStatus('sending');
    setError(null);

    // Persist email so other forms on the site auto-fill.
    try { localStorage.setItem('promptly_email', trimmed); } catch { /* ignore quota */ }

    const page = typeof window !== 'undefined' ? window.location.pathname : '';

    try {
      const res = await fetch('/api/lead-capture', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:  trimmed,
          offer,
          role:   role ?? '',
          page,
          source: source ?? 'getpromptly-site',
        }),
      });

      let data: { ok?: boolean; error?: string } = {};
      try { data = await res.json() as typeof data; } catch { /* non-JSON body */ }

      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? `Email send failed (status ${res.status}).`);
      }

      track({
        name:    'email_capture_submitted',
        section: source ?? offer,
      });

      setStatus('success');
      return true;
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Network error';
      // eslint-disable-next-line no-console
      console.error('[useLeadCapture] submit failed:', detail);
      setStatus('error');
      setError(FALLBACK_MESSAGE);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { submit, status, error, reset };
}
