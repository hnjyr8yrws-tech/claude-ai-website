/**
 * DiscoveryBar — the shared guided-discovery header for the three listing pages
 * (Tools, Equipment, Training). One pattern, one system:
 *
 *   1. A prominent full-width search box — a SIMPLE client-side text filter over
 *      the page's existing items (the page owns the filtering; this is just the
 *      controlled input). Fast, no backend, no AI.
 *   2. An "Ask Luna" panel beside it for natural-language / fuzzy queries, which
 *      opens the existing Luna chat widget. Smart search is Luna's job — there is
 *      no separate semantic engine here.
 *
 * Category browse and the filtered list render BELOW this, on each page.
 *
 * Brand (§09): oat search surface, ink text, lime focus ring, Satoshi (font-sans);
 * the Ask-Luna panel is lime-on-dark — lime's permitted home is a dark surface.
 */

import { track } from '../utils/analytics';

const TEAL = 'var(--color-promptly-lime)';

interface DiscoveryBarProps {
  /** Controlled search value (the page owns the state + filtering). */
  value: string;
  onChange: (next: string) => void;
  /** Page-appropriate placeholder, e.g. "Search tools by name or category…". */
  placeholder: string;
  /** One line inviting a natural-language query, e.g. "Describe what you need…". */
  lunaPrompt: string;
  /** Analytics section tag ("tools" | "equipment" | "training"). */
  section: string;
  /** Optional live result count line shown under the bar. */
  resultCount?: number;
  total?: number;
  noun?: string;
}

export default function DiscoveryBar({
  value,
  onChange,
  placeholder,
  lunaPrompt,
  section,
  resultCount,
  total,
  noun = 'results',
}: DiscoveryBarProps) {
  const openLuna = () => {
    window.dispatchEvent(new CustomEvent('open-agent-chat'));
    track({ name: 'agent_opened', section: `${section}-discovery` });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
      {/* Search — simple client-side text filter */}
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-base"
          style={{ color: 'var(--color-ink-accent)' }}
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (e.target.value.length > 2)
              track({ name: 'search_performed', section, query: e.target.value });
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full pl-11 pr-4 py-4 rounded-xl border text-base font-sans outline-none transition-shadow focus-visible:ring-2"
          style={{
            borderColor: 'var(--color-rule)',
            background: 'var(--color-oat)',
            color: 'var(--color-ink)',
            // lime focus ring (§09)
            ['--tw-ring-color' as string]: TEAL,
          } as React.CSSProperties}
        />
      </div>

      {/* Ask Luna — natural-language / fuzzy queries handed to the chat widget */}
      <button
        type="button"
        onClick={openLuna}
        className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
        style={{ background: 'var(--color-ground-black)', color: TEAL }}
      >
        <span className="flex items-center gap-2.5">
          <span
            className="relative flex w-2 h-2 flex-shrink-0"
            aria-hidden="true"
          >
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: TEAL }}
            />
            <span
              className="relative inline-flex rounded-full w-2 h-2"
              style={{ background: TEAL }}
            />
          </span>
          <span className="text-sm font-semibold font-sans whitespace-nowrap">
            {lunaPrompt}
          </span>
        </span>
        <span className="text-base flex-shrink-0" aria-hidden="true">
          &rarr;
        </span>
      </button>

      {/* Live count */}
      {typeof resultCount === 'number' && typeof total === 'number' && (
        <p className="lg:col-span-2 text-xs font-sans" style={{ color: '#6b6760' }}>
          Showing <strong style={{ color: 'var(--color-ink)' }}>{resultCount}</strong> of {total} {noun}
        </p>
      )}
    </div>
  );
}
