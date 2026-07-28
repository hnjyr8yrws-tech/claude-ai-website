/**
 * useSignup.ts
 *
 * Thin hook around our own /api/signup serverless route (which forwards to n8n).
 * The n8n webhook URL + secret never leave the server — this hook only calls
 * our own endpoint. Mirrors useBrevo's shape.
 *
 * Usage:
 *   const { submit, status, error, reset } = useSignup();
 *   await submit({ email, name, role, school, consent: true });
 */

import { useState, useCallback } from 'react';

export type SignupStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SignupParams {
  email: string;
  name?: string;
  role?: string;
  school?: string;
  consent: boolean;
  /** Honeypot — leave empty; bots fill it and the server drops the request. */
  website?: string;
}

interface UseSignupReturn {
  submit: (params: SignupParams) => Promise<void>;
  status: SignupStatus;
  error: string | null;
  reset: () => void;
}

export function useSignup(): UseSignupReturn {
  const [status, setStatus] = useState<SignupStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (params: SignupParams) => {
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, source: 'website-signup' }),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Sign-up failed. Please try again.');
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { submit, status, error, reset };
}
