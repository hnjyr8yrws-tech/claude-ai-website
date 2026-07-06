/**
 * TrustGallery — DEV-ONLY harness for the Shared Trust Components layer.
 *
 * Mounted at /dev/trust in development builds only (see App.tsx — the route is
 * gated on import.meta.env.DEV). It exercises every component in every key
 * state so fail-closed behaviour and brand rules can be eyeballed in one place:
 * Verified Active · Fail-closed · Withdrawn · AwaitingReReview · Updated.
 *
 * All data below is FIXTURE data — nothing here reads the live registry.
 */

import type { ReactNode } from 'react';
import {
  Rule4bGuard,
  PillarCard,
  MethodologyStamp,
  LiveScoreLink,
  ReviewerBadge,
  ScoreChangeStamp,
  EvidenceConfidence,
  pillarScoresFromModel,
  cardStateFor,
  type TrustDisplayModel,
  type PillarKey,
  type PillarEvidence,
} from '@/components/trust';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const pillarFixture = (pillar: PillarKey, score: number, evidence: string): PillarEvidence => ({
  pillar,
  score,
  evidence,
  confidence: 4,
  reviewDepth: 'standard',
  citation: { label: 'Provider documentation', href: 'https://example.com' },
});

const basePillars: Record<PillarKey, PillarEvidence> = {
  data_privacy: pillarFixture('data_privacy', 8.6, 'UK GDPR posture verified against the provider DPA; data residency confirmed EU/UK.'),
  safeguarding: pillarFixture('safeguarding', 9.1, 'KCSIE 2025 alignment reviewed; DSL controls and audit logging present.'),
  age_suitability: pillarFixture('age_suitability', 8.2, 'Age gating enforced at sign-up; content suitable for the stated key stages.'),
  transparency: pillarFixture('transparency', 7.9, 'Model documentation and change log public; pricing clear.'),
  accessibility: pillarFixture('accessibility', 8.4, 'Keyboard navigable; reading-level adjustment aids SEND differentiation.'),
};

const baseModel: TrustDisplayModel = {
  toolName: 'Sample Tool',
  toolSlug: 'sample-tool',
  displayState: 'Active',
  integrity: { state: 'verified', checkedAt: '2026-05-14' },
  methodology: { version: '2.2', verifiedDate: '2026-05-14', reviewerInitials: 'MS' },
  reviewer: { initials: 'MS', verifiedDate: '2026-05-14' },
  overallScore: 8.7,
  pillars: basePillars,
  livePageUrl: '/tools/magicschool-ai',
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
    model: { ...baseModel, integrity: { state: 'stale', reason: 'registry sync overdue' } },
  },
  {
    title: '3 · Withdrawn',
    note: 'Score suppressed entirely — state card + live link only.',
    model: { ...baseModel, displayState: 'Withdrawn' },
  },
  {
    title: '4 · AwaitingReReview',
    note: 'Same suppression path as Withdrawn; card renders the redaction state.',
    model: { ...baseModel, displayState: 'AwaitingReReview' },
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

export default function TrustGallery() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-14 pb-16">
      <header className="pb-10">
        <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--color-ink-accent)' }}>
          DEV-ONLY HARNESS · NOT ROUTED IN PRODUCTION
        </p>
        <h1 className="font-display text-4xl mt-2" style={{ color: 'var(--text)' }}>Shared Trust Components</h1>
        <p className="mt-3 max-w-xl text-base text-site-muted">
          Every component in every key state, rendered through <code className="font-mono text-sm">Rule4bGuard</code>.
          Open the console&rsquo;s <code className="font-mono text-sm">promptly_analytics</code> events to watch{' '}
          <code className="font-mono text-sm">score_unavailable_shown</code> fire on the suppressed states.
        </p>
      </header>

      {FIXTURES.map(({ title, note, model }) => (
        <Section key={title} title={title} note={note}>
          {/* md (240px) card behind the guard, driven entirely from the model */}
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
                  {model.livePageUrl ? <LiveScoreLink url={model.livePageUrl} /> : null}
                </div>
              )}
            >
              <PillarCard
                score={model.overallScore}
                pillars={pillarScoresFromModel(model)}
                state={cardStateFor(model.displayState)}
                showName={false}
                showVerdict={false}
                showLegend
                interactive
                size={240}
                methodologyVersion={model.methodology.version}
                verifiedDate="14 MAY 2026"
                reviewer={model.reviewer.initials}
                change={model.scoreHistory?.[0] ? { from: model.scoreHistory[0].from, to: model.scoreHistory[0].to, date: '14 MAY 2026' } : undefined}
              />
              {model.livePageUrl ? <LiveScoreLink url={model.livePageUrl} /> : null}
            </Rule4bGuard>
          </div>

          {/* sm (96px) compact card — the Luna inline size (chrome off) */}
          <div className="flex flex-col items-start gap-2">
            <p className="font-mono text-[10px] uppercase" style={{ color: 'var(--color-fog)' }}>sm · 96px (Luna inline)</p>
            <Rule4bGuard trustData={model} silent>
              <PillarCard
                score={model.overallScore}
                pillars={pillarScoresFromModel(model)}
                showName={false}
                showVerdict={false}
                showLegend={false}
                showMark={false}
                size={96}
              />
            </Rule4bGuard>
            {/* Stamps row for this state */}
            <MethodologyStamp methodology={model.methodology} />
            <ReviewerBadge reviewer={model.reviewer} />
            {model.scoreHistory?.[0] ? <ScoreChangeStamp change={model.scoreHistory[0]} /> : null}
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
              evidence: basePillars.safeguarding.evidence,
              confidence: basePillars.safeguarding.confidence,
              reviewDepth: basePillars.safeguarding.reviewDepth,
              citation: basePillars.safeguarding.citation,
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
