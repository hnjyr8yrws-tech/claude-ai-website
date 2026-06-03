import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useBrevo, type BrevoSource } from '../../hooks/useBrevo';

const LIME = 'var(--color-promptly-lime)';
const OAT = 'var(--color-oat)';
const GROUND = 'var(--color-ground-black)';

interface Props {
  /** Button label, e.g. "Unlock this prompt" or "Email me about Premium". */
  ctaLabel: string;
  /** Role labels stored as a Brevo contact attribute. */
  roles?: string[];
  /** Which Brevo list/source to file the contact under. */
  source?: BrevoSource;
  /** Confirmation copy shown after a successful subscribe. */
  successText?: string;
  /** Called with the email after a successful subscribe (e.g. to unlock). */
  onSuccess?: (email: string) => void;
}

/** Email capture form (dark-styled for the prompt modal) → Brevo via /api. */
export default function EmailCapture({
  ctaLabel,
  roles = [],
  source = 'website',
  successText = "You're on the list — we'll be in touch.",
  onSuccess,
}: Props) {
  const { subscribe, status, error, reset } = useBrevo();
  const [email, setEmail] = useState('');

  // The Vite useBrevo hook reports outcome via `status` (not a return value),
  // so fire onSuccess once the subscribe resolves successfully.
  useEffect(() => {
    if (status === 'success' && email) onSuccess?.(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe({ email, roles, source });
  };

  if (status === 'success') {
    return (
      <p className="font-sans mt-4 inline-flex items-center justify-center gap-2" style={{ color: LIME, fontSize: 14 }}>
        <Check size={16} />
        {successText}
      </p>
    );
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') reset(); }}
          placeholder="you@school.uk"
          aria-label="Email address"
          className="font-sans rounded-full px-4 py-2.5 outline-none focus-visible:ring-1"
          style={{ fontSize: 14, background: GROUND, color: OAT, border: '1px solid rgba(255,255,255,0.2)' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-sans rounded-full px-5 py-2.5 disabled:opacity-60"
          style={{ fontSize: 14, fontWeight: 600, background: LIME, color: 'var(--color-ink)' }}
        >
          {status === 'loading' ? 'Sending…' : ctaLabel}
        </button>
      </form>
      {status === 'error' && (
        <p className="font-sans mt-2 text-center" style={{ color: '#f87171', fontSize: 13 }}>{error}</p>
      )}
    </div>
  );
}
