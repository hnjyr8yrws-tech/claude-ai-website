/**
 * TrustGallery — DEV-ONLY harness for the Shared Trust Components layer.
 *
 * Mounted at /dev/trust in development builds only (see App.tsx — the route is
 * gated on import.meta.env.DEV and tree-shaken from production). Two halves:
 *
 *  1. FIXTURES — hand-built TrustDisplayModels exercising every key state
 *     (Verified Active · Fail-closed · Withdrawn · AwaitingReReview · Updated),
 *     including states real data can't currently produce (Updated, stale).
 *  2. LIVE ADAPTER — real slugs run through getTrustDisplayModel() so the
 *     registry → model → components pipe can be verified end to end.
 */

import { useEffect, useState, type ReactNode } from 'react';
import {
  Rule4bGuard,
  PillarCard,
  MethodologyStamp,
  LiveScoreLink,
  ReviewerBadge,
  ScoreChangeStamp,
  EvidenceConfidence,
  pillarScoresFromModel,
  evidenceFromModel,
  cardStateFor,
  PILLAR_META,
  PILLAR_COLOUR_TOKENS,
  PILLAR_ORDER,
  type TrustDisplayModel,
  type TrustPillar,
  type PillarKey,
} from '@/components/trust';
import { getTrustDisplayModel } from '@/lib/trust/trustAdapter';
import { canGenerateReceipt, validateReceiptModel } from '@/lib/receipt/validate';
import ReceiptModal from '@/components/ReceiptModal';
import {
  buildAlertsForModel,
  alertFromChange,
  buildAlertsFromFeed,
  buildInternalAlerts,
  logInternalAlerts,
  runAlertDryRun,
  ALERT_POLICY,
  FEED_WINDOW_DAYS,
  type AlertContext,
  type ScoreChangeAlert,
  type DryRunReport,
  type InternalAlert,
} from '@/lib/alerts';
import { scoreChangeFeed } from '@/data/methodology';
import type { ScoreChange } from '@/components/trust/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FIXTURE_EVIDENCE: Record<PillarKey, string> = {
  data_privacy: 'UK GDPR posture verified against the provider DPA; data residency confirmed EU/UK.',
  safeguarding: 'KCSIE 2025 alignment reviewed; DSL controls and audit logging present.',
  age_suitability: 'Age gating enforced at sign-up; content suitable for the stated key stages.',
  transparency: 'Model documentation and change log public; pricing clear.',
  accessibility: 'Keyboard navigable; reading-level adjustment aids SEND differentiation.',
};

const FIXTURE_SCORES: Record<PillarKey, number> = {
  data_privacy: 8.6,
  safeguarding: 9.1,
  age_suitability: 8.2,
  transparency: 7.9,
  accessibility: 8.4,
};

const fixturePillars: TrustPillar[] = PILLAR_ORDER.map((key) => ({
  key,
  label: PILLAR_META[key].label,
  colourToken: PILLAR_COLOUR_TOKENS[key],
  score: FIXTURE_SCORES[key],
  evidence: FIXTURE_EVIDENCE[key],
  citation: { label: 'Provider documentation', href: 'https://example.com' },
  confidence: 4,
  reviewDepth: 'standard',
}));

const baseModel: TrustDisplayModel = {
  toolId: 'sample-tool',
  toolSlug: 'sample-tool',
  toolName: 'Sample Tool',
  verdict: null,
  promptlyScore: 8.7,
  displayState: 'Active',
  pillars: fixturePillars,
  methodology: { version: '2.2', verifiedDate: '2026-05-14', reviewerInitials: 'MS' },
  reviewer: { initials: 'MS', verifiedDate: '2026-05-14' },
  scoreHistory: [],
  livePageUrl: '/tools/magicschool-ai',
  integrity: { state: 'verified', fetchedAt: '2026-05-14T09:00:00Z' },
};

const FIXTURES: { title: string; note: string; model: TrustDisplayModel }[] = [
  {
    title: '1 · Verified Active',
    note: 'Guard passes — full scored card renders, stamp + live link beneath.',
    model: baseModel,
  },
  {
    title: '2 · Fail-closed (integrity: stale)',
    note: 'Guard suppresses and emits score_unavailable_shown (reason: integrity).',
    model: { ...baseModel, integrity: { state: 'stale', reason: 'verification_beyond_ttl', fetchedAt: baseModel.integrity.fetchedAt } },
  },
  {
    title: '3 · Withdrawn',
    note: 'Score suppressed entirely — state card + live link only.',
    model: { ...baseModel, displayState: 'Withdrawn', promptlyScore: null },
  },
  {
    title: '4 · AwaitingReReview',
    note: 'Same suppression path as Withdrawn; card renders the redaction state.',
    model: { ...baseModel, displayState: 'AwaitingReReview', promptlyScore: null },
  },
  {
    title: '5 · Updated (score change)',
    note: 'Scored card + ScoreChangeStamp. Parent is responsible for the 30-day expiry.',
    model: {
      ...baseModel,
      displayState: 'Updated',
      scoreHistory: [{ direction: 'up', from: 8.1, to: 8.7, date: '2026-05-14', reason: 'Accessibility improvements verified' }],
    },
  },
];

/** Real slugs through the adapter. NOTE: every tool in the registry currently
 *  has a published score (252 published ≥ 242 tools), so there is no real
 *  'Provisional' example — the unknown slug covers the fail-closed path and
 *  fixtures cover the rest. */
const LIVE_SLUGS = ['magicschool-ai', 'photomath', 'education-copilot', 'not-a-real-tool'];

// ─── Harness ──────────────────────────────────────────────────────────────────

function Section({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>{title}</h2>
      <p className="mt-1 text-sm text-site-muted">{note}</p>
      <div className="mt-4 flex flex-wrap items-start gap-8">{children}</div>
    </section>
  );
}

/** One model rendered the standard way: guarded md card + stamp + live link. */
function ModelBlock({ model }: { model: TrustDisplayModel }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <Rule4bGuard
        trustData={model}
        renderUnavailable={() => (
          <div className="flex flex-col items-start gap-2">
            <PillarCard
              state={cardStateFor(model.displayState)}
              methodologyVersion={model.methodology.version}
              showName={false}
              showVerdict={false}
              showLegend={false}
              size={240}
            />
            <LiveScoreLink url={model.livePageUrl} analytics={{ surface: 'review_page', toolId: model.toolId, methodologyVersion: model.methodology.version, integrityState: model.integrity.state, displayState: model.displayState }} />
          </div>
        )}
      >
        <PillarCard
          score={model.promptlyScore ?? undefined}
          pillars={pillarScoresFromModel(model)}
          state={cardStateFor(model.displayState)}
          showName={false}
          showVerdict={false}
          showLegend
          interactive
          evidence={evidenceFromModel(model)}
          size={240}
          methodologyVersion={model.methodology.version}
          verifiedDate={model.reviewer.verifiedDate}
          reviewer={model.reviewer.initials}
          change={model.scoreHistory[0] ? { from: model.scoreHistory[0].from, to: model.scoreHistory[0].to, date: model.scoreHistory[0].date } : undefined}
        />
        <LiveScoreLink url={model.livePageUrl} />
      </Rule4bGuard>
    </div>
  );
}

export default function TrustGallery() {
  const [live, setLive] = useState<TrustDisplayModel[] | null>(null);
  const [receiptStatus, setReceiptStatus] = useState<string>('');
  const [receiptModal, setReceiptModal] = useState<{ model: TrustDisplayModel; snapshotAt: string } | null>(null);
  const [alertReport, setAlertReport] = useState<DryRunReport | null>(null);
  // Iter 2 Phase 2 — real ScoreChangeFeed mode.
  const [feedNow, setFeedNow] = useState<'today' | 'feedEra'>('feedEra');
  const [feedRun, setFeedRun] = useState<
    { all: ScoreChangeAlert[]; recentCount: number; report: DryRunReport; refNow: Date; refLabel: string } | null
  >(null);
  // Iter 3 Phase 1 — internal alerts from authored records.
  const [internalAlerts, setInternalAlerts] = useState<InternalAlert[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(LIVE_SLUGS.map((s) => getTrustDisplayModel(s))).then((models) => {
      if (!cancelled) setLive(models);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Concept 3 P1 harness: generate a receipt (or watch it refuse, fail-closed)
  // through the real adapter → validate → PDF pipeline. Module is lazy-loaded
  // on first click, exactly as production consumers will load it.
  async function tryReceipt(slug: string) {
    setReceiptStatus(`Generating for ${slug}…`);
    try {
      const [{ downloadReceipt }, model] = await Promise.all([
        import('@/lib/receipt/generateReceipt'),
        getTrustDisplayModel(slug),
      ]);
      const filename = await downloadReceipt(model);
      setReceiptStatus(`✓ Downloaded ${filename}`);
    } catch (e) {
      setReceiptStatus(`✗ ${slug}: ${(e as Error).message}`);
    }
  }

  // P2: the modal path — gated by the LIGHT validate module (no PDF chunk),
  // exactly as the real ToolDetail entry point will gate in P3.
  async function tryReceiptModal(slug: string) {
    const model = await getTrustDisplayModel(slug);
    if (!canGenerateReceipt(model)) {
      setReceiptStatus(`✗ modal gated for ${slug}: ${validateReceiptModel(model)}`);
      return;
    }
    setReceiptStatus('');
    setReceiptModal({ model, snapshotAt: new Date().toISOString() });
  }

  // Concept 5 dry-run: compose alerts from a real withdrawal (adapter), the
  // illustrative feed, and synthetic tier fixtures — then evaluate (fires
  // alert_trigger_evaluated per alert). Delivers nothing.
  function runAlerts() {
    const synthCtx = (name: string, slug: string): AlertContext => ({
      toolId: slug, toolSlug: slug, toolName: name, livePageUrl: `/tools/${slug}`,
      methodologyVersion: '2.2', reviewer: 'CR', displayState: 'Active', integrityState: 'verified',
    });
    const synthetic: { label: string; change: ScoreChange }[] = [
      { label: 'Major upgrade',              change: { direction: 'up',   from: 7.0, to: 8.5, date: '2026-06-01' } },
      { label: 'Major (band cross, small Δ)', change: { direction: 'up',  from: 5.9, to: 6.1, date: '2026-06-02' } },
      { label: 'Minor downgrade (sends)',    change: { direction: 'down', from: 7.8, to: 7.4, date: '2026-06-03' } },
      { label: 'Minor upgrade (suppressed)', change: { direction: 'up',   from: 7.4, to: 7.8, date: '2026-06-04' } },
      { label: 'Critical (below floor)',     change: { direction: 'down', from: 6.5, to: 5.5, date: '2026-06-05' } },
      { label: 'None (noise)',               change: { direction: 'up',   from: 7.0, to: 7.1, date: '2026-06-06' } },
    ];
    const alerts: ScoreChangeAlert[] = [
      ...(live?.filter((m) => m.displayState === 'AwaitingReReview').flatMap(buildAlertsForModel) ?? []),
      ...scoreChangeFeed.map((e) => alertFromChange(e.change, synthCtx(e.tool.name, e.tool.slug))),
      ...synthetic.map((s) => alertFromChange(s.change, synthCtx(s.label, `synthetic-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`))),
    ];
    setAlertReport(runAlertDryRun(alerts));
  }

  // Iter 2 Phase 2 — alerts from the REAL ScoreChangeFeed (+ integrity-record
  // score changes), fail-closed via the adapter. Shows every record with a
  // recency flag; fires alert_trigger_evaluated for the recent (≤30d) ones only,
  // which is what a production consumer would act on.
  function runFeedAlerts() {
    const refNow = feedNow === 'today' ? new Date() : new Date('2026-06-05T12:00:00Z');
    const all = buildAlertsFromFeed(refNow, { recentOnly: false });
    const recent = buildAlertsFromFeed(refNow, { recentOnly: true });
    const report = runAlertDryRun(recent);
    setFeedRun({ all, recentCount: recent.length, report, refNow, refLabel: feedNow === 'today' ? 'today' : '05 Jun 2026' });
  }

  // Iter 3 Phase 1 — internal alerts from authored records (feed + integrity
  // records, incl. safeguarding withdrawals). Classified by triage priority,
  // fail-closed, ALERT_POLICY-respecting. Also logs each alert to the console.
  function runInternalAlerts() {
    const alerts = buildInternalAlerts(new Date());
    logInternalAlerts(alerts);
    setInternalAlerts(alerts);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-14 pb-16">
      <header className="pb-10">
        <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--color-ink-accent)' }}>
          DEV-ONLY HARNESS · NOT ROUTED IN PRODUCTION
        </p>
        <h1 className="font-display text-4xl mt-2" style={{ color: 'var(--text)' }}>Shared Trust Components</h1>
        <p className="mt-3 max-w-xl text-base text-site-muted">
          Fixtures for every key state, plus real registry data through the Trust Adapter. Watch the console&rsquo;s{' '}
          <code className="font-mono text-sm">promptly_analytics</code> events for{' '}
          <code className="font-mono text-sm">score_unavailable_shown</code> on the suppressed states.
        </p>
      </header>

      {/* ── Live adapter output ── */}
      <section className="mb-14 rounded-xl border border-[var(--color-rule)] bg-white p-5">
        <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>Live · Trust Adapter</h2>
        <p className="mt-1 text-sm text-site-muted">
          <code className="font-mono text-xs">getTrustDisplayModel(slug)</code> over real data — verified, withdrawn,
          unreviewed, and an unknown slug (fail-closed).
        </p>
        <div className="mt-5 flex flex-wrap items-start gap-8">
          {live === null ? (
            <p className="text-sm text-site-muted">Loading adapter output…</p>
          ) : (
            live.map((model) => (
              <div key={model.toolSlug} className="flex max-w-[260px] flex-col items-start gap-2">
                <p className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-fog)' }}>
                  {model.toolSlug} · {model.displayState} · integrity: {model.integrity.state}
                  {model.integrity.reason ? ` (${model.integrity.reason})` : ''}
                </p>
                <ModelBlock model={model} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Concept 3: Audit Receipt (P1) ── */}
      <section className="mb-14 rounded-xl border border-[var(--color-rule)] bg-white p-5">
        <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>Concept 3 · Audit Receipt (P1)</h2>
        <p className="mt-1 text-sm text-site-muted">
          Adapter → validation → PDF, lazy-loaded on click. The first two generate (every registry
          tool is currently scored); the last two <em>refuse</em> (fail-closed): a withdrawn tool
          and an unknown slug never produce a receipt.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(['magicschool-ai', 'education-copilot', 'photomath', 'not-a-real-tool'] as const).map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => tryReceipt(slug)}
              className="rounded-xl border border-[var(--color-rule)] bg-white px-3 py-2 text-xs font-semibold transition-colors hover:border-[var(--color-fog)]"
              style={{ color: 'var(--text)' }}
            >
              Generate: {slug}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-site-muted">
          <strong style={{ color: 'var(--text)' }}>P2 — modal flow:</strong> preview-then-download; the
          photomath button demonstrates the gated entry (no modal for suppressed tools).
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(['magicschool-ai', 'photomath'] as const).map((slug) => (
            <button
              key={`modal-${slug}`}
              type="button"
              onClick={() => tryReceiptModal(slug)}
              className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-oat)] px-3 py-2 text-xs font-semibold transition-colors hover:border-[var(--color-fog)]"
              style={{ color: 'var(--text)' }}
            >
              Open modal: {slug}
            </button>
          ))}
        </div>
        {receiptStatus ? (
          <p role="status" className="mt-3 font-mono text-[11px]" style={{ color: 'var(--color-ink-accent)' }}>
            {receiptStatus}
          </p>
        ) : null}
      </section>

      {receiptModal ? (
        <ReceiptModal
          model={receiptModal.model}
          snapshotAt={receiptModal.snapshotAt}
          onClose={() => setReceiptModal(null)}
        />
      ) : null}

      {/* ── Concept 5: Score Change Alert (dry-run) ── */}
      <section className="mb-14 rounded-xl border border-[var(--color-rule)] bg-white p-5">
        <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>Concept 5 · Score Change Alert (dry-run)</h2>
        <p className="mt-1 text-sm text-site-muted">
          Pure significance policy over a real withdrawal (adapter), the illustrative feed, and synthetic
          tier fixtures. Running fires <code className="font-mono text-xs">alert_trigger_evaluated</code>{' '}
          per alert and delivers nothing.
        </p>
        <p className="mt-2 font-mono text-[11px]" style={{ color: 'var(--color-fog)' }}>
          POLICY · floor {ALERT_POLICY.safeguardingFloor} · major |Δ|≥{ALERT_POLICY.majorDelta} · noise &lt;{ALERT_POLICY.noiseFloor} · minor downgrade sends, upgrade suppressed
        </p>
        <button
          type="button"
          onClick={runAlerts}
          className="mt-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-oat)] px-3 py-2 text-xs font-semibold transition-colors hover:border-[var(--color-fog)]"
          style={{ color: 'var(--text)' }}
        >
          Run dry-run
        </button>

        {alertReport ? (
          <div className="mt-4 overflow-x-auto">
            <p className="mb-2 font-mono text-[11px]" style={{ color: 'var(--color-ink-accent)' }}>
              {alertReport.evaluated} evaluated · {alertReport.wouldSend} would send · 0 delivered (dry-run)
            </p>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="font-mono uppercase" style={{ color: 'var(--color-fog)', fontSize: 9 }}>
                  <th className="py-1 pr-3">Tool</th>
                  <th className="py-1 pr-3">Change</th>
                  <th className="py-1 pr-3">Δ</th>
                  <th className="py-1 pr-3">Tier</th>
                  <th className="py-1 pr-3">Send</th>
                  <th className="py-1">Reasons</th>
                </tr>
              </thead>
              <tbody>
                {alertReport.alerts.map((a, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--color-rule)' }}>
                    <td className="py-1.5 pr-3 font-semibold" style={{ color: 'var(--text)' }}>{a.toolName}</td>
                    <td className="py-1.5 pr-3">{a.change ? `${a.change.from.toFixed(1)} → ${a.change.to.toFixed(1)}` : 'withdrawn'}</td>
                    <td className="py-1.5 pr-3 font-mono">{a.change ? (a.evaluation.delta > 0 ? `+${a.evaluation.delta.toFixed(1)}` : a.evaluation.delta.toFixed(1)) : '—'}</td>
                    <td className="py-1.5 pr-3 font-mono uppercase" style={{ color: a.evaluation.significance === 'none' ? 'var(--color-fog)' : 'var(--text)', fontWeight: a.evaluation.significance === 'critical' ? 700 : 400 }}>{a.evaluation.significance}</td>
                    <td className="py-1.5 pr-3">{a.evaluation.wouldSend ? '✓' : '·'}</td>
                    <td className="py-1.5" style={{ color: 'var(--color-ink-muted)' }}>{a.evaluation.reasons.join('; ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* ── Iter 2 · Phase 2: REAL ScoreChangeFeed mode ── */}
        <div className="mt-8 border-t border-[var(--color-rule)] pt-5">
          <h3 className="font-display text-lg" style={{ color: 'var(--text)' }}>Real ScoreChangeFeed (Iter 2 · Phase 2)</h3>
          <p className="mt-1 text-sm text-site-muted">
            Alerts composed from the actual <code className="font-mono text-xs">scoreChangeFeed</code> + integrity-record
            score changes (not fixtures), fail-closed via the adapter. &ldquo;Recent&rdquo; = change within {FEED_WINDOW_DAYS} days
            of the reference date. Today the shipped records are all older/illustrative, so pick <em>Feed era</em> to see
            the recency detection fire.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-fog)' }}>Evaluate as of</span>
            {(['feedEra', 'today'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFeedNow(opt)}
                aria-pressed={feedNow === opt}
                className="rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                style={
                  feedNow === opt
                    ? { background: 'var(--color-ground-black)', borderColor: 'var(--color-ground-black)', color: '#fff' }
                    : { background: 'white', borderColor: 'var(--color-rule)', color: 'var(--color-ink-muted)' }
                }
              >
                {opt === 'today' ? 'Today' : 'Feed era (05 Jun 2026)'}
              </button>
            ))}
            <button
              type="button"
              onClick={runFeedAlerts}
              className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-oat)] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--color-fog)]"
              style={{ color: 'var(--text)' }}
            >
              Run real feed
            </button>
          </div>

          {feedRun ? (
            <div className="mt-4 overflow-x-auto">
              <p className="mb-2 font-mono text-[11px]" style={{ color: 'var(--color-ink-accent)' }}>
                {feedRun.all.length} feed records · {feedRun.recentCount} recent (within {FEED_WINDOW_DAYS}d of {feedRun.refLabel}) ·
                of those {feedRun.report.wouldSend} would send · 0 delivered
              </p>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="font-mono uppercase" style={{ color: 'var(--color-fog)', fontSize: 9 }}>
                    <th className="py-1 pr-3">Tool</th>
                    <th className="py-1 pr-3">Change</th>
                    <th className="py-1 pr-3">Δ</th>
                    <th className="py-1 pr-3">Days ago</th>
                    <th className="py-1 pr-3">Recent</th>
                    <th className="py-1 pr-3">Tier</th>
                    <th className="py-1 pr-3">Send</th>
                    <th className="py-1">Reasons</th>
                  </tr>
                </thead>
                <tbody>
                  {feedRun.all.map((a, i) => {
                    const days = a.change
                      ? Math.floor((feedRun.refNow.getTime() - new Date(a.change.date).getTime()) / 86_400_000)
                      : null;
                    const recent = days != null && days <= FEED_WINDOW_DAYS;
                    return (
                      <tr key={i} className="border-t" style={{ borderColor: 'var(--color-rule)' }}>
                        <td className="py-1.5 pr-3 font-semibold" style={{ color: 'var(--text)' }}>{a.toolName}</td>
                        <td className="py-1.5 pr-3">{a.change ? `${a.change.from.toFixed(1)} → ${a.change.to.toFixed(1)}` : 'withdrawn'}</td>
                        <td className="py-1.5 pr-3 font-mono">{a.change ? (a.evaluation.delta > 0 ? `+${a.evaluation.delta.toFixed(1)}` : a.evaluation.delta.toFixed(1)) : '—'}</td>
                        <td className="py-1.5 pr-3 font-mono">{days != null ? `${days}d` : '—'}</td>
                        <td className="py-1.5 pr-3">{recent ? '✓' : '·'}</td>
                        <td className="py-1.5 pr-3 font-mono uppercase" style={{ color: a.evaluation.significance === 'none' ? 'var(--color-fog)' : 'var(--text)', fontWeight: a.evaluation.significance === 'critical' ? 700 : 400 }}>{a.evaluation.significance}</td>
                        <td className="py-1.5 pr-3">{a.evaluation.wouldSend ? '✓' : '·'}</td>
                        <td className="py-1.5" style={{ color: 'var(--color-ink-muted)' }}>{a.evaluation.reasons.join('; ')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Concept 5: Internal Alerts (Iter 3 · Phase 1) ── */}
      <section className="mb-14 rounded-xl border border-[var(--color-rule)] bg-white p-5">
        <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>Concept 5 · Internal Alerts (Iter 3 · Phase 1)</h2>
        <p className="mt-1 text-sm text-site-muted">
          Reviewer/ops alerts from <strong>authored records</strong> — the score-change feed + integrity records
          (score changes and safeguarding withdrawals). Classified by triage priority, fail-closed, respects{' '}
          <code className="font-mono text-xs">ALERT_POLICY</code>. Generating also logs each alert to the console.
        </p>
        <p className="mt-2 font-mono text-[11px]" style={{ color: 'var(--color-fog)' }}>
          P1 safeguarding (withdrawal / below-floor) · P2 material (major) · P3 minor · noise → no alert
        </p>
        <button
          type="button"
          onClick={runInternalAlerts}
          className="mt-4 rounded-xl border border-[var(--color-rule)] bg-[var(--color-oat)] px-3 py-2 text-xs font-semibold transition-colors hover:border-[var(--color-fog)]"
          style={{ color: 'var(--text)' }}
        >
          Generate internal alerts
        </button>

        {internalAlerts ? (
          <div className="mt-4 overflow-x-auto">
            <p className="mb-2 font-mono text-[11px]" style={{ color: 'var(--color-ink-accent)' }}>
              {internalAlerts.length} internal alert{internalAlerts.length === 1 ? '' : 's'} ·{' '}
              {internalAlerts.filter((a) => a.classification === 'safeguarding').length} safeguarding ·{' '}
              {internalAlerts.filter((a) => a.classification === 'material').length} material ·{' '}
              {internalAlerts.filter((a) => a.classification === 'minor').length} minor · logged to console
            </p>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="font-mono uppercase" style={{ color: 'var(--color-fog)', fontSize: 9 }}>
                  <th className="py-1 pr-3">Pri</th>
                  <th className="py-1 pr-3">Class</th>
                  <th className="py-1 pr-3">Tool</th>
                  <th className="py-1 pr-3">Kind</th>
                  <th className="py-1 pr-3">Change</th>
                  <th className="py-1 pr-3">Sig.</th>
                  <th className="py-1">Reason / summary</th>
                </tr>
              </thead>
              <tbody>
                {internalAlerts.map((a, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--color-rule)' }}>
                    <td className="py-1.5 pr-3 font-mono" style={{ fontWeight: a.priority === 1 ? 700 : 400 }}>P{a.priority}</td>
                    <td className="py-1.5 pr-3 font-mono uppercase" style={{ color: a.classification === 'safeguarding' ? 'var(--text)' : 'var(--color-ink-muted)', fontWeight: a.classification === 'safeguarding' ? 700 : 400 }}>{a.classification}</td>
                    <td className="py-1.5 pr-3 font-semibold" style={{ color: 'var(--text)' }}>{a.tool}</td>
                    <td className="py-1.5 pr-3">{a.kind}</td>
                    <td className="py-1.5 pr-3 font-mono">{a.change ? `${a.change.from.toFixed(1)} → ${a.change.to.toFixed(1)}` : '—'}</td>
                    <td className="py-1.5 pr-3 font-mono">{a.significance ?? '—'}</td>
                    <td className="py-1.5" style={{ color: 'var(--color-ink-muted)' }}>{a.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {/* ── Fixture states ── */}
      {FIXTURES.map(({ title, note, model }) => (
        <Section key={title} title={title} note={note}>
          <ModelBlock model={model} />

          {/* sm (96px) compact card — the candidate Luna inline size (chrome off) */}
          <div className="flex flex-col items-start gap-2">
            <p className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-fog)' }}>sm · 96px (Luna inline)</p>
            <Rule4bGuard trustData={model} silent>
              <PillarCard
                score={model.promptlyScore ?? undefined}
                pillars={pillarScoresFromModel(model)}
                showName={false}
                showVerdict={false}
                showLegend={false}
                showMark={false}
                size={96}
              />
            </Rule4bGuard>
            <MethodologyStamp methodology={model.methodology} />
            <ReviewerBadge reviewer={model.reviewer} />
            {model.scoreHistory[0] ? <ScoreChangeStamp change={model.scoreHistory[0]} /> : null}
          </div>

          {/* Guard default fallback (no renderUnavailable) */}
          <div className="flex flex-col items-start gap-2">
            <p className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-fog)' }}>guard default fallback</p>
            <Rule4bGuard trustData={model}>
              <span className="text-sm" style={{ color: 'var(--text)' }}>
                (visible only when the guard passes)
              </span>
            </Rule4bGuard>
          </div>
        </Section>
      ))}

      {/* EvidenceConfidence standalone — dark surface, as inside the interactive card */}
      <Section title="EvidenceConfidence (standalone)" note="Dark-surface detail block with confidence dots; also try clicking the ring segments on the Verified card above.">
        <div className="max-w-sm rounded-[10px] p-5" style={{ background: 'var(--color-ground-black)' }}>
          <EvidenceConfidence
            label="Safeguarding"
            score={9.1}
            bandLabel="Exemplary"
            evidence={{
              evidence: FIXTURE_EVIDENCE.safeguarding,
              confidence: 4,
              reviewDepth: 'standard',
              citation: { label: 'Provider documentation', href: 'https://example.com' },
            }}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-fog)' }}>LiveScoreLink tones</p>
          <LiveScoreLink url="/tools/magicschool-ai" />
          <div className="rounded p-3" style={{ background: 'var(--color-ground-black)' }}>
            <LiveScoreLink url="/tools/magicschool-ai" onDark />
          </div>
        </div>
      </Section>
    </div>
  );
}
