import { useState } from 'react';
import { track } from '../../utils/analytics';

const TEAL = '#BEFF00';
const BORDER = '#ECE7DD';

const ROLES = [
  'Teacher',
  'School Leader',
  'SENDCO',
  'Teaching Assistant',
  'Parent / Carer',
  'Student',
  'Admin / Business Manager',
  'Other',
];

interface Props {
  packSlug: string;
  packTitle: string;
  hiddenCount: number;
  totalCount: number;
  onUnlock: () => void;
}

const PackEmailGate = ({ packSlug, packTitle, hiddenCount, totalCount, onUnlock }: Props) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [school, setSchool] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !role) {
      setError('Please enter your email and select your role.');
      return;
    }
    setError('');

    track({ name: 'prompt_pack_email_submit', packSlug, role });
    if (marketingConsent) {
      track({ name: 'prompt_pack_marketing_opt_in', packSlug });
    }

    // Store unlock in localStorage
    try {
      const unlocked = JSON.parse(localStorage.getItem('promptly_unlocked_packs') || '[]');
      if (!unlocked.includes(packSlug)) {
        unlocked.push(packSlug);
        localStorage.setItem('promptly_unlocked_packs', JSON.stringify(unlocked));
      }
      localStorage.setItem('promptly_email', email);
      if (role) localStorage.setItem('promptly_role', role);
    } catch {
      // localStorage unavailable — continue anyway
    }

    setSubmitted(true);
    onUnlock();
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl border p-6 sm:p-8 text-center"
        style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
      >
        <div className="text-3xl mb-3" aria-hidden="true">{'\u2705'}</div>
        <h3 className="font-display text-xl mb-2" style={{ color: '#15803d' }}>
          Pack unlocked!
        </h3>
        <p className="text-sm leading-relaxed mb-1" style={{ color: '#4A4A4A' }}>
          All {totalCount} prompts from <strong style={{ color: '#1A1A1A' }}>{packTitle}</strong> are now visible below.
        </p>
        <p className="text-xs" style={{ color: '#9ca3af' }}>
          We&rsquo;ll also send a copy to your inbox.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8"
      style={{ borderColor: BORDER, background: '#F8F5F0' }}
    >
      <div className="max-w-md mx-auto">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: TEAL }}>
          Full Pack
        </p>
        <h3 className="font-display text-xl mb-1" style={{ color: '#1A1A1A' }}>
          Get all {totalCount} prompts — free
        </h3>
        <p className="text-sm mb-5" style={{ color: '#4A4A4A' }}>
          Enter your email to unlock the remaining {hiddenCount} prompts. We&rsquo;ll send the full pack to your inbox too.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="pack-email" className="sr-only">Email address</label>
            <input
              id="pack-email"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#BEFF00]"
              style={{ borderColor: BORDER, background: 'white', color: '#1A1A1A' }}
            />
          </div>

          <div>
            <label htmlFor="pack-role" className="sr-only">Your role</label>
            <select
              id="pack-role"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#BEFF00] appearance-none"
              style={{
                borderColor: BORDER,
                background: 'white',
                color: role ? '#1A1A1A' : '#9ca3af',
              }}
            >
              <option value="" disabled>Select your role</option>
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pack-school" className="sr-only">School or organisation (optional)</label>
            <input
              id="pack-school"
              type="text"
              placeholder="School or organisation (optional)"
              value={school}
              onChange={e => setSchool(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#BEFF00]"
              style={{ borderColor: BORDER, background: 'white', color: '#1A1A1A' }}
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: '#dc2626' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BEFF00]"
            style={{ background: TEAL, color: '#0F1C1A' }}
          >
            Send me the full pack
          </button>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={e => setMarketingConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#BEFF00] flex-shrink-0"
            />
            <span className="text-xs leading-relaxed" style={{ color: '#4A4A4A' }}>
              Send me future GetPromptly AI tools, training and prompt updates.
            </span>
          </label>

          <p className="text-[10px] leading-relaxed" style={{ color: '#9C9690' }}>
            We&rsquo;ll only email your pack. No spam, ever. Unsubscribe any time.
          </p>
        </form>
      </div>
    </div>
  );
};

// Legacy bundle banner — used by role prompt pages
const MonetisationBanner = ({ variant: _variant }: { variant: 'pack' | 'bundle' }) => (
  <div
    className="rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center gap-4"
    style={{ borderColor: BORDER, background: '#F8F5F0' }}
  >
    <div className="flex-1">
      <p className="text-[11px] font-semibold tracking-widest uppercase mb-1" style={{ color: TEAL }}>
        School Bundle
      </p>
      <h3 className="font-display text-xl mb-1" style={{ color: '#1A1A1A' }}>
        Get All 50 Packs for Your School
      </h3>
      <p className="text-sm" style={{ color: '#4A4A4A' }}>
        Every prompt pack plus full AI agent access for your whole staff team.
      </p>
    </div>
    <div>
      <button
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
        style={{ background: TEAL, color: '#0F1C1A' }}
        onClick={() => {
          const w = document.getElementById('promptly-widget-trigger');
          if (w) (w as HTMLButtonElement).click();
        }}
      >
        Register Interest
      </button>
    </div>
  </div>
);

export { PackEmailGate };
export default MonetisationBanner;
