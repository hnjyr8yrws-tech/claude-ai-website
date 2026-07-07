/**
 * ReceiptModal — Concept 3 P2. Preview-then-download for the Audit Receipt.
 *
 * Receives a FROZEN TrustDisplayModel snapshot (taken by the opener at click
 * time, §9.3) and previews it with the real DOM trust components — the PDF is
 * rendered from the same frozen model on Download, so the data cannot drift
 * between preview and document. The heavy PDF module is loaded only on
 * Download (dynamic import); this component itself stays light.
 *
 * Analytics (§11): `receipt_generated` fires once on open;
 * `receipt_downloaded` (with genToDownloadMs) on successful save.
 *
 * Fail-closed: openers must gate on canGenerateReceipt() (light import), and
 * downloadReceipt() independently re-validates. If an invalid model somehow
 * reaches the modal, Download surfaces the refusal rather than a PDF.
 */

import { useEffect, useRef, useState } from 'react';
import { PillarCard } from '@/components/trust/PillarCard';
import { pillarScoresFromModel } from '@/components/trust/PillarCard';
import type { TrustDisplayModel } from '@/components/trust/types';
import { track } from '@/utils/analytics';

const TEAL = 'var(--color-promptly-lime)';

function formatSnapshot(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const date = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(d);
  return `${date}, ${time}`;
}

export interface ReceiptModalProps {
  /** Frozen snapshot — taken by the opener when the user clicked. */
  model: TrustDisplayModel;
  /** ISO timestamp of the snapshot (defaults set by the opener). */
  snapshotAt: string;
  onClose: () => void;
}

export default function ReceiptModal({ model, snapshotAt, onClose }: ReceiptModalProps) {
  const [phase, setPhase] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const openedAtRef = useRef<number>(Date.now());
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // §11: the modal opening IS the "generate" step (snapshot taken).
  useEffect(() => {
    track({
      name: 'receipt_generated',
      toolId: model.toolId,
      surface: 'receipt',
      methodologyVersion: model.methodology.version,
      integrityState: model.integrity.state,
      displayState: model.displayState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus management + Escape + scroll lock.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [onClose]);

  async function handleDownload() {
    if (phase === 'working') return;
    setPhase('working');
    setMessage('');
    try {
      // Heavy chunk loads here, and only here. (Concrete path, not the barrel,
      // so the emitted chunk is named generateReceipt-*, not index-*.)
      const { downloadReceipt } = await import('@/lib/receipt/generateReceipt');
      const filename = await downloadReceipt(model, snapshotAt);
      track({
        name: 'receipt_downloaded',
        toolId: model.toolId,
        surface: 'receipt',
        methodologyVersion: model.methodology.version,
        integrityState: model.integrity.state,
        displayState: model.displayState,
        genToDownloadMs: Date.now() - openedAtRef.current,
      });
      setPhase('done');
      setMessage(filename);
    } catch (e) {
      setPhase('error');
      setMessage((e as Error).message);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close receipt preview"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(30, 30, 30, 0.6)' }}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Audit receipt preview for ${model.toolName}`}
        tabIndex={-1}
        className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl outline-none max-h-[90vh] overflow-y-auto"
      >
        {/* Header: trio + close */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--color-ink-muted)' }}>
            UK Education · KCSIE 2025 · Independent
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-base leading-none transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-fog)' }}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--color-ink-accent)' }}>
          Audit receipt · score snapshot
        </p>
        <h2 className="font-display text-2xl leading-tight" style={{ color: 'var(--text)' }}>
          {model.toolName}
        </h2>

        {/* Preview — the real Pillar Card from the same frozen model. A missing
            verification date reads NOT RECORDED, unified with the PDF (option B). */}
        <div className="mt-4 flex justify-center">
          <PillarCard
            score={model.promptlyScore ?? undefined}
            pillars={pillarScoresFromModel(model)}
            showName={false}
            showVerdict={false}
            showLegend
            size={192}
            methodologyVersion={model.methodology.version}
            verifiedDate={model.methodology.verifiedDate || 'NOT RECORDED'}
            reviewer={model.reviewer.initials}
          />
        </div>

        <p className="mt-3 font-mono text-[9px] uppercase tracking-wide" style={{ color: 'var(--color-fog)' }}>
          Snapshot generated {formatSnapshot(snapshotAt)}
        </p>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
          This receipt is a dated snapshot. The live score is the canonical record and may have
          changed since generation.
        </p>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={phase === 'working'}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-1"
            style={{ background: TEAL, color: 'var(--color-ink)' }}
          >
            {phase === 'working' ? 'Generating…' : 'Download PDF'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-fog)]"
            style={{ borderColor: 'var(--color-rule)', color: 'var(--color-ink-muted)' }}
          >
            Close
          </button>
        </div>

        {/* Status */}
        {message ? (
          <p role="status" className="mt-3 font-mono text-[10px]" style={{ color: phase === 'error' ? '#991b1b' : 'var(--color-ink-accent)' }}>
            {phase === 'done' ? `✓ Saved ${message}` : `✗ ${message}`}
          </p>
        ) : null}
      </div>
    </div>
  );
}
