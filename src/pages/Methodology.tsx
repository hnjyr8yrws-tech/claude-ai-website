import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import {
  Rule4bGuard,
  ReviewerBadge,
  ScoreChangeStamp,
  MethodologyStamp,
  formatDateGB,
  type Integrity,
} from '@/components/trust';
import {
  methodologyMeta,
  changelog,
  integrityRecord,
  scoreChangeFeed,
  toolReviewPath,
  type ChangelogEntry,
  type IntegrityRecordEntry,
  type ScoreChangeRecord,
  type WithdrawalRecord,
  type ScoreFeedEntry,
  type ToolRef,
} from '@/data/methodology';

// ─── Deep-linking helpers (adapted from getpromptly-web MethodologyAnchors) ───
// Vite SPA is all client-side, so no 'use client' directive is needed.

function smoothScrollTo(id: string): boolean {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return !!el;
}

function RecordAnchor({ id, label = 'this record' }: { id: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(id);
    window.history.replaceState(null, '', `#${id}`);
    try {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      void navigator.clipboard?.writeText(url);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be blocked */
    }
  };

  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      title="Copy link to this record"
      aria-label={`Copy link to ${label}`}
      className="inline-flex items-center gap-1 rounded text-neutral-400 hover:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span aria-hidden="true" className="font-mono text-sm leading-none">#</span>
      {copied ? <span aria-hidden="true" className="text-xs text-green-700">Copied</span> : null}
      <span role="status" aria-live="polite" className="sr-only">{copied ? 'Link copied to clipboard' : ''}</span>
    </a>
  );
}

function SmoothAnchor({ targetId, children, className }: { targetId: string; children: ReactNode; className?: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (smoothScrollTo(targetId)) {
      e.preventDefault();
      window.history.replaceState(null, '', `#${targetId}`);
    }
  };
  return <a href={`#${targetId}`} onClick={onClick} className={className}>{children}</a>;
}

// Scrolls to the URL hash on mount (deferred via rAF so it wins over ScrollToTop).
function SmoothHashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}

// ─── Tool link (react-router-dom, → /tools/:slug) ─────────────────────────────

function ToolLink({ tool, className }: { tool: ToolRef; className?: string }) {
  return (
    <Link
      to={toolReviewPath(tool.slug)}
      className={[
        'font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tool.name}
    </Link>
  );
}

// ─── Changelog ────────────────────────────────────────────────────────────────

function MethodologyChangelog({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <ol className="space-y-5">
      {entries.map((e) => (
        <li key={e.version} className="border-l-2 border-neutral-200 pl-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-neutral-900">v{e.version}</span>
            <time dateTime={e.date} className="text-xs text-neutral-500">{formatDateGB(e.date)}</time>
          </div>
          <p className="mt-1 max-w-prose text-sm text-neutral-700">{e.summary}</p>
          {e.details?.length ? (
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-neutral-600">
              {e.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

// ─── Integrity record ─────────────────────────────────────────────────────────

const HOLDING_LABEL: Record<WithdrawalRecord['holdingState'], string> = {
  Withdrawn: 'Withdrawn',
  AwaitingReReview: 'Awaiting re-review',
};

function ScoreChangeRow({ entry }: { entry: ScoreChangeRecord }) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600">
          Score change
        </span>
        <ToolLink tool={entry.tool} />
        <ScoreChangeStamp change={entry.change} />
      </div>
      {entry.note ? <p className="max-w-prose text-sm text-neutral-600">{entry.note}</p> : null}
    </div>
  );
}

function WithdrawalRow({ entry }: { entry: WithdrawalRecord }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">Withdrawal</span>
        <span className="text-sm text-neutral-700">
          {entry.reasonCategory} · {entry.tools.length} {entry.tools.length === 1 ? 'tool' : 'tools'}
        </span>
        <span className="rounded border border-neutral-300 px-1.5 py-0.5 text-xs text-neutral-600">
          Holding: {HOLDING_LABEL[entry.holdingState]}
        </span>
      </div>
      <p className="max-w-prose text-sm text-neutral-700">{entry.summary}</p>
      <dl className="text-sm">
        <dt className="inline font-medium text-neutral-600">Statutory basis: </dt>
        <dd className="inline text-neutral-700">{entry.kcsieBasis}</dd>
      </dl>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Tools affected</p>
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {entry.tools.map((t) => (
            <li key={t.slug}>
              <ToolLink tool={t} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IntegrityRecord({ entries }: { entries: IntegrityRecordEntry[] }) {
  return (
    <ol className="space-y-6">
      {entries.map((entry) => (
        <li key={entry.id} id={entry.id} className="scroll-mt-20 rounded-lg border border-neutral-200 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <time dateTime={entry.date} className="text-sm font-medium text-neutral-900">
                {formatDateGB(entry.date)}
              </time>
              <RecordAnchor id={entry.id} />
            </div>
            <ReviewerBadge reviewer={entry.reviewer} />
          </div>
          {entry.type === 'withdrawal' ? <WithdrawalRow entry={entry} /> : <ScoreChangeRow entry={entry} />}
        </li>
      ))}
    </ol>
  );
}

// ─── Score change feed ────────────────────────────────────────────────────────

function ScoreChangeFeed({ entries }: { entries: ScoreFeedEntry[] }) {
  return (
    <ul className="divide-y divide-neutral-200">
      {entries.map((e) => (
        <li key={e.id} className="flex flex-wrap items-center gap-2 py-3">
          <ToolLink tool={e.tool} />
          <ScoreChangeStamp change={e.change} />
          {e.note ? <span className="text-sm text-neutral-600">— {e.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

// ─── Suppressed-tool example (real Rule4bGuard demo) ──────────────────────────

const EXAMPLE_INTEGRITY: Integrity = { state: 'unavailable' };
const EXAMPLE_WITHDRAWAL_ANCHOR = 'withdrawal-2026-06-safeguarding';

function SuppressedToolExample() {
  return (
    <details className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <summary className="cursor-pointer text-sm font-medium text-neutral-800">
        What a viewer currently sees on a suppressed tool page
      </summary>
      <div className="mt-3 space-y-3">
        <p className="max-w-prose text-sm text-neutral-600">
          Illustrative only. On a tool&rsquo;s own page, <code className="font-mono text-xs">Rule4bGuard</code>{' '}
          withholds the score when the tool is Withdrawn or Awaiting re-review.
        </p>

        <Rule4bGuard
          integrity={EXAMPLE_INTEGRITY}
          displayState="AwaitingReReview"
          renderUnavailable={() => (
            <div role="status" className="max-w-sm rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700">
              <p className="font-medium">Score withheld</p>
              <p className="mt-0.5 text-neutral-600">
                This tool is awaiting re-review. See the reason in the{' '}
                <SmoothAnchor targetId={EXAMPLE_WITHDRAWAL_ANCHOR} className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">
                  June 2026 withdrawal record
                </SmoothAnchor>.
              </p>
            </div>
          )}
        >
          <div className="max-w-sm rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-500">
            (A normal trust card would appear here when the score is live.)
          </div>
        </Rule4bGuard>
      </div>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Methodology() {
  return (
    <>
      <SEO
        title="Methodology — GetPromptly"
        description="How GetPromptly reviews and scores tools: our methodology, integrity record, and score changes."
        keywords="AI tool methodology, safeguarding, KCSIE, integrity record, score changes, GetPromptly"
        path="/methodology"
      />
      <SmoothHashScroll />

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <header className="border-b border-neutral-200 pb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Methodology</h1>
          <p className="mt-2 max-w-prose text-sm text-neutral-600">
            This is our living methodology: how we review tools, how scores can change, and a full record of
            integrity actions. It is the reference we link to whenever a score is provisional, updated, or withheld.
          </p>
          <div className="mt-4">
            <MethodologyStamp
              methodology={{
                version: methodologyMeta.version,
                verifiedDate: methodologyMeta.lastUpdated,
                reviewerInitials: methodologyMeta.reviewerInitials,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Last updated {formatDateGB(methodologyMeta.lastUpdated)}.
          </p>
        </header>

        {/* Changelog */}
        <section aria-labelledby="changelog-heading" className="py-8">
          <h2 id="changelog-heading" className="text-lg font-semibold text-neutral-900">Changelog</h2>
          <p className="mt-1 text-sm text-neutral-600">Material changes to the methodology, most recent first.</p>
          <div className="mt-4">
            <MethodologyChangelog entries={changelog} />
          </div>
        </section>

        {/* Integrity Record */}
        <section aria-labelledby="integrity-heading" className="border-t border-neutral-200 py-8">
          <h2 id="integrity-heading" className="text-lg font-semibold text-neutral-900">Integrity record</h2>
          <p className="mt-1 max-w-prose text-sm text-neutral-600">
            Score changes and withdrawals, with the reason and reviewer for each. This record stays visible even
            when a tool&rsquo;s own score is withheld.
          </p>
          <div className="mt-4">
            <SuppressedToolExample />
          </div>
          <div className="mt-4">
            <IntegrityRecord entries={integrityRecord} />
          </div>
        </section>

        {/* Score Change Feed */}
        <section aria-labelledby="feed-heading" className="border-t border-neutral-200 py-8">
          <h2 id="feed-heading" className="text-lg font-semibold text-neutral-900">Score change feed</h2>
          <p className="mt-1 text-sm text-neutral-600">Notable score movements. Curated for now; automated later.</p>
          <div className="mt-4">
            <ScoreChangeFeed entries={scoreChangeFeed} />
          </div>
        </section>
      </div>
    </>
  );
}
