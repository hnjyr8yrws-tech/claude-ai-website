/**
 * useBrevo.ts
 *
 * Thin hook around our own /api/brevo-subscribe serverless function.
 * The actual Brevo API key never leaves the server — this hook only
 * calls our own endpoint.
 *
 * Usage:
 *   const { subscribe, status, error } = useBrevo();
 *   await subscribe({ email, roles: ['Teacher', 'SLT'], source: 'website' });
 */

import { useState, useCallback } from 'react';

export type BrevoSource = 'website' | 'agent_widget';
export type BrevoStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SubscribeParams {
  email:  string;
  roles?: string[];          // human-readable role labels
  source: BrevoSource;
}

interface UseBrevoReturn {
  subscribe: (params: SubscribeParams) => Promise<void>;
  status:    BrevoStatus;
  error:     string | null;
  reset:     () => void;
}

export function useBrevo(): UseBrevoReturn {
  const [status, setStatus] = useState<BrevoStatus>('idle');
  const [error, setError]   = useState<string | null>(null);

  const subscribe = useCallback(async ({ email, roles = [], source }: SubscribeParams) => {
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch('/api/brevo-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          roles: roles.join(','),
          source,
        }),
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Subscription failed. Please try again.');
      }

      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { subscribe, status, error, reset };
}
