import { useState } from 'react';
import { track } from '../utils/analytics';

interface Props {
  pathwayName: string;
  pathwaySlug: string;
}

const TEAL = 'var(--color-promptly-lime)';

export default function PathwayEmailCTA({ pathwayName, pathwaySlug }: Props) {
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('promptly_email') || ''; } catch { return ''; }
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    track({ name: 'pathway_email_submit', pathwaySlug });
    track({ name: 'training_path_email_submit', pathwaySlug });
    try { localStorage.setItem('promptly_email', trimmed); } catch { /* ignore */ }
    setSent(true);
  };

  if (sent) {
    return (
      <div
        className="rounded-xl border px-5 py-4 flex items-center gap-3"
        style={{ borderColor: 'var(--color-rule)', background: 'var(--color-oat)' }}
      >
        <span className="text-xl" aria-hidden="true">✅</span>
        <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
          We'll send the <strong>{pathwayName}</strong> pathway to your inbox.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border px-5 py-4"
      style={{ borderColor: 'var(--color-rule)', background: 'var(--bg)' }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
        Send me this pathway
      </p>
      <p className="text-xs mb-3" style={{ color: 'var(--color-ink-muted)' }}>
        Get the <strong>{pathwayName}</strong> learning path sent straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor={`pathway-email-${pathwaySlug}`} className="sr-only">Email address</label>
          <input
            id={`pathway-email-${pathwaySlug}`}
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[var(--color-promptly-lime)]"
            style={{ borderColor: 'var(--color-rule)', background: 'white', color: 'var(--text)' }}
          />
        </div>
        <button
          type="submit"
          className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: TEAL, color: 'var(--color-ink)' }}
        >
          Send pathway →
        </button>
      </form>
      {error && <p className="text-xs mt-2" style={{ color: '#dc2626' }}>{error}</p>}
      <p className="text-[10px] mt-2" style={{ color: 'var(--color-ink-muted)' }}>
        No spam. Unsubscribe any time.
      </p>
    </div>
  );
}
