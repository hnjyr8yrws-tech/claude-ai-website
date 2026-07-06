/**
 * ReceiptDocument — the Audit Receipt PDF (Concept 3, Phase 1).
 *
 * Renders ONE tool's trust snapshot from a frozen TrustDisplayModel. The §04
 * Pillar Card ring is re-rendered from the SAME fixed wedge geometry the live
 * card uses (PILLAR_CARD_GEOMETRY) — score encoded by opacity, never arc
 * length. Wedge fills are precomputed rgba (not fillOpacity attrs) for
 * renderer-safe output.
 *
 * Copy in this document is Donna-gated before any live release (P4).
 */

import { Document, Page, Text, View, Svg, Path, Line, Circle, StyleSheet } from '@react-pdf/renderer';
import type { TrustDisplayModel } from '@/components/trust/types';
import { PILLAR_CARD_GEOMETRY } from '@/components/trust/PillarCard';
import { pillarBand, PILLAR_BAND_LABEL } from '@/data/publicPillars';
import { PDF_COLOURS as C } from './fonts';

// Keep in sync with SEO.tsx BASE_URL.
const BASE_URL = 'https://www.getpromptly.co.uk';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Blend fg over bg at alpha, returning SOLID hex. react-pdf's SVG parser
 *  mishandles rgba() strings (renders wrong hues — verified on device), so the
 *  §04 opacity encoding is precomputed against the card ground instead.
 *  Visually identical to the live card's fillOpacity layering. */
function blendHex(fg: string, alpha: number, bg: string): string {
  const ch = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  const mix = (a: number, b: number) => Math.round(alpha * a + (1 - alpha) * b);
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to2(mix(ch(fg, 1), ch(bg, 1)))}${to2(mix(ch(fg, 3), ch(bg, 3)))}${to2(mix(ch(fg, 5), ch(bg, 5)))}`;
}

function formatSnapshot(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)}, ${new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(d)}`;
}

const verifiedLabel = (v: string): string => (v ? v.toUpperCase() : 'NOT RECORDED');

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: { padding: 44, fontFamily: 'Helvetica', fontSize: 10, color: C.ink, backgroundColor: '#FFFFFF' },
  trioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  wordmark: { fontFamily: 'Fraunces', fontWeight: 600, fontSize: 16 },
  trio: { fontFamily: 'JetBrains Mono', fontSize: 7, letterSpacing: 0.8, color: C.inkMuted },
  hr: { borderBottomWidth: 1, borderBottomColor: C.rule, marginBottom: 18 },
  docLabel: { fontFamily: 'JetBrains Mono', fontSize: 7, letterSpacing: 1.2, color: C.inkAccent, marginBottom: 6 },
  toolName: { fontFamily: 'Fraunces', fontWeight: 400, fontSize: 28, marginBottom: 14 },
  columns: { flexDirection: 'row', gap: 24 },
  left: { flex: 1 },
  tableHead: { fontFamily: 'JetBrains Mono', fontSize: 7, letterSpacing: 1, color: C.fog, marginBottom: 4 },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.rule, paddingVertical: 5 },
  cellLabel: { flex: 1.6, fontSize: 10 },
  cellScore: { flex: 0.5, fontSize: 10, textAlign: 'right' },
  cellBand: { flex: 1, fontSize: 7, textAlign: 'right', color: C.inkMuted, textTransform: 'uppercase', letterSpacing: 0.4, paddingTop: 2 },
  swatch: { width: 7, height: 7, borderRadius: 1, marginRight: 6, marginTop: 2 },
  mono: { fontFamily: 'JetBrains Mono', fontSize: 7.5, letterSpacing: 0.6, color: C.fog },
  section: { marginTop: 16 },
  body: { fontSize: 9, color: C.inkMuted, lineHeight: 1.5 },
  linkLine: { fontSize: 9, color: C.inkAccent, marginTop: 3 },
  footer: { position: 'absolute', bottom: 36, left: 44, right: 44, borderTopWidth: 1, borderTopColor: C.rule, paddingTop: 8 },
  card: { backgroundColor: C.groundBlack, borderRadius: 8, padding: 16, alignItems: 'center', width: 196 },
  cardMark: { fontFamily: 'JetBrains Mono', fontSize: 5.5, letterSpacing: 0.6, color: C.fog, marginTop: 8, textAlign: 'center' },
});

// ─── The §04 ring, from the shared fixed geometry ────────────────────────────

function PdfPillarRing({ model, size }: { model: TrustDisplayModel; size: number }) {
  const { viewBox, cx, cy, wedges, dividers } = PILLAR_CARD_GEOMETRY;
  const scoreFor = (key: string): number =>
    model.pillars.find((p) => (p.key as string) === snakeFor(key))?.score ?? 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewBox} ${viewBox}`}>
      {/* §04 opacity encoding, precomputed: score layer (alpha = score/10)
          composited over the 0.18 dim track over the card ground — one solid
          hex per wedge (never arc length). */}
      {wedges.map((w) => {
        const a = Math.max(0, Math.min(10, scoreFor(w.key))) / 10;
        const track = blendHex(w.colour, 0.18, C.groundBlack);
        return <Path key={w.key} d={w.d} fill={blendHex(w.colour, a, track)} />;
      })}
      {dividers.map((l, i) => (
        <Line key={`d-${i}`} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={C.groundBlack} strokeWidth={1.5} />
      ))}
      <Circle cx={cx} cy={cy} r={78} fill={C.groundBlack} stroke={C.lime} strokeWidth={1.5} />
      <Text x={cx} y={132} textAnchor="middle" style={{ fontFamily: 'Fraunces', fontWeight: 600, fontSize: 44, fill: C.oat }}>
        {model.promptlyScore != null ? model.promptlyScore.toFixed(1) : '—'}
      </Text>
      <Text x={cx} y={154} textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: 8, letterSpacing: 2, fill: C.fog }}>
        PROMPTLY SCORE
      </Text>
    </Svg>
  );
}

/** camelCase wedge keys (PillarScores) → the model's snake_case PillarKey. */
function snakeFor(wedgeKey: string): string {
  switch (wedgeKey) {
    case 'dataPrivacy': return 'data_privacy';
    case 'ageSuitability': return 'age_suitability';
    default: return wedgeKey; // safeguarding, transparency, accessibility
  }
}

// ─── The document ─────────────────────────────────────────────────────────────

export interface ReceiptDocumentProps {
  model: TrustDisplayModel;
  /** ISO timestamp of when the snapshot was taken (frozen at modal open). */
  snapshotAt: string;
}

export function ReceiptDocument({ model, snapshotAt }: ReceiptDocumentProps) {
  const liveUrl = `${BASE_URL}${model.livePageUrl}`;
  const mark = `METHODOLOGY v${model.methodology.version} · VERIFIED ${verifiedLabel(model.methodology.verifiedDate)} · REVIEWER ${model.reviewer.initials.toUpperCase()}`;

  return (
    <Document
      title={`GetPromptly Audit Receipt — ${model.toolName}`}
      subject={`Promptly Score snapshot · methodology v${model.methodology.version}`}
      author="GetPromptly"
      creator="GetPromptly Audit Receipt"
      producer="GetPromptly"
      keywords={`${model.toolSlug}, promptly score, methodology v${model.methodology.version}`}
    >
      <Page size="A4" style={s.page}>
        {/* Trust trio strip + wordmark (§07) */}
        <View style={s.trioRow}>
          <Text style={s.wordmark}>GetPromptly</Text>
          <Text style={s.trio}>UK EDUCATION · KCSIE 2025 · INDEPENDENT</Text>
        </View>
        <View style={s.hr} />

        <Text style={s.docLabel}>AUDIT RECEIPT · SCORE SNAPSHOT</Text>
        <Text style={s.toolName}>{model.toolName}</Text>

        <View style={s.columns}>
          {/* Left: pillar table + marks */}
          <View style={s.left}>
            <Text style={s.tableHead}>PILLAR BREAKDOWN (0–10)</Text>
            {model.pillars.map((p) => {
              const band = p.score != null ? pillarBand(p.score) : null;
              return (
                <View key={p.key} style={s.row}>
                  <View style={{ flexDirection: 'row', flex: 1.6 }}>
                    <View style={[s.swatch, { backgroundColor: wedgeHex(p.key) }]} />
                    <Text style={s.cellLabel}>{p.label}</Text>
                  </View>
                  <Text style={s.cellScore}>{p.score != null ? p.score.toFixed(1) : '—'}</Text>
                  <Text style={s.cellBand}>{band ? PILLAR_BAND_LABEL[band] : ''}</Text>
                </View>
              );
            })}

            <View style={s.section}>
              <Text style={s.mono}>{mark}</Text>
              <Text style={[s.mono, { marginTop: 3 }]}>SNAPSHOT GENERATED {formatSnapshot(snapshotAt).toUpperCase()}</Text>
              {model.integrity.fetchedAt ? (
                <Text style={[s.mono, { marginTop: 3 }]}>DATA FETCHED {formatSnapshot(model.integrity.fetchedAt).toUpperCase()}</Text>
              ) : null}
            </View>

            <View style={s.section}>
              <Text style={s.body}>
                This receipt is a dated snapshot. The live score is the canonical record and may have
                changed since this document was generated. Check the current score at:
              </Text>
              <Text style={s.linkLine}>{liveUrl}</Text>
            </View>

            {model.disclosure?.present ? (
              <View style={s.section}>
                <Text style={s.tableHead}>DISCLOSURE</Text>
                <Text style={s.body}>{model.disclosure.text}</Text>
              </View>
            ) : null}
          </View>

          {/* Right: the Pillar Card */}
          <View style={s.card}>
            <PdfPillarRing model={model} size={164} />
            <Text style={s.cardMark}>{mark}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.body}>
            GetPromptly — independent, KCSIE 2025-aligned reviews of AI tools for UK education. Every
            Promptly Score is reviewed against five pillars per our published methodology; a score is
            independent guidance, not approval.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/** Wedge hex for the table swatches — the same reserved colours the ring uses. */
function wedgeHex(pillarKey: string): string {
  const camel =
    pillarKey === 'data_privacy' ? 'dataPrivacy' : pillarKey === 'age_suitability' ? 'ageSuitability' : pillarKey;
  return PILLAR_CARD_GEOMETRY.wedges.find((w) => w.key === camel)?.colour ?? C.fog;
}
