# Shared Trust Components — reference

The single source of truth for Rule 4b compliance and fail-closed rendering across
Luna, review pages and receipts. All components live in `src/components/trust/`
and are exported from the barrel (`@/components/trust`), except `PillarCard`'s
`pillarScores` builder (name collision — import from `@/components/trust/PillarCard`).

**Dev harness:** `npm run dev` → http://localhost:5173/dev/trust (route exists in
development builds only). It renders every component in the five key states:
Verified Active · Fail-closed · Withdrawn · AwaitingReReview · Updated.

## Core rules (enforced in code, not convention)
- `integrity.state !== 'verified'` → **fail-closed** (no score renders)
- `displayState ∈ {Withdrawn, AwaitingReReview}` → **score suppressed entirely**
- When rendering from `trustData`, a missing/null `overallScore` also fail-closes
- No inputs at all → the guard fails **closed**, never open
- All components are prop-driven; none fetch data
- Dates render en-GB (`formatDateGB`)

---

## `<Rule4bGuard>` — foundational wrapper
Wrap it around **every** score render.

```tsx
// Preferred: drive it from the shared model
<Rule4bGuard trustData={model} renderUnavailable={(reason) => <WithheldCard reason={reason} />}>
  <PillarCard score={model.overallScore} pillars={pillarScoresFromModel(model)} … />
</Rule4bGuard>

// Granular API (existing call sites: ToolDetail, Methodology, Luna stamp)
<Rule4bGuard integrity={integrity} displayState="Active">…</Rule4bGuard>
```

- **Fail-closed:** children render only when integrity is verified AND the display
  state isn't suppressed AND (via `trustData`) a score exists. `silent` returns
  null on suppression; `renderUnavailable(reason)` renders a custom suppressed
  state; otherwise a default British-voice status box renders.
- **Analytics:** emits `score_unavailable_shown { reason, displayState }` once per
  suppression state (site analytics union in `src/utils/analytics.ts`).
- **A11y:** default fallback is `role="status"`; suppressed reason is conveyed in
  text, never colour.

## `<PillarCard>` — the §04 signature artefact
```tsx
<PillarCard
  score={8.7} pillars={pillarScoresFromModel(model)}
  state={cardStateFor(model.displayState)}   // Active/Provisional/Updated/Withdrawn/AwaitingReReview/Historic
  size={240} interactive evidence={evidenceMap}   // md — review pages/receipts
/>
<PillarCard score={8.7} pillars={…} size={96} showLegend={false} showMark={false} /> // sm — Luna inline
```
- Immutable §03 wedge order/colours (fixed 72° geometry, inline SVG); score is
  encoded by **opacity**, never arc length; withdrawn = redaction bar + AWAITING
  RE-REVIEW mark. `AwaitingReReview` maps to the withdrawn card via `cardStateFor`.
- `interactive` (240px only by convention) makes wedges keyboard-operable
  (`role="button"`, Enter/Space, `aria-pressed`) and opens `EvidenceConfidence`.
  Non-verified states are never interactive (`canInteract` guard).
- **A11y:** the whole ring carries a full `aria-label` (score + five pillar values);
  bands are words, not colours.
- **Never decorative** — always inside `Rule4bGuard`, always with the mark.

## `<MethodologyStamp>` — locked §16 format
```tsx
<MethodologyStamp methodology={{ version: '2.2', verifiedDate: '2026-05-14', reviewerInitials: 'MS' }} />
// → METHODOLOGY v2.2 · VERIFIED 14 May 2026 · REVIEWER MS
```
JetBrains Mono, fog. No removal prop — non-removable by construction. `aria-label`
carries the sentence form.

## `<LiveScoreLink>` — Rule 4b live-score link
```tsx
<LiveScoreLink url={model.livePageUrl} />            // light surfaces → ink-accent
<LiveScoreLink url={model.livePageUrl} onDark />     // dark surfaces → lime
```
Plain text link (router `Link` for internal paths, new-tab `<a>` for absolute
URLs), underline on hover. **Deliberate deviation from the spec's "lime text":**
lime on light surfaces is 1.4:1 and fails §20 AA — `--color-ink-accent` is the
documented light-surface substitute; lime is used on dark.

## `<ReviewerBadge>`
```tsx
<ReviewerBadge reviewer={{ initials: 'MS', verifiedDate: '2026-05-14' }} />  // MS · 14 May 2026
```
Initials monogram disc (ground-black) + en-GB date; `aria-label` reads
"Reviewed by MS, verified 14 May 2026".

## `<ScoreChangeStamp>`
```tsx
<ScoreChangeStamp change={{ direction: 'up', from: 8.1, to: 8.7, date: '2026-05-14', reason: '…' }} />
```
- **Deliberate deviation from the spec's colour-coding (Lime ↑ / Clay ↓):** shipped
  design (PR #10, CR-approved) uses neutral oat/rule/ink chrome with the arrow in
  `--color-ink-accent` — §09 has no traffic lights, and Clay is a **reserved
  pillar colour** (§03). Direction is carried by the arrow glyph and the
  `aria-label` ("Score increased from 8.1 to 8.7 on 14 May 2026"), never colour.
- The 30-day auto-expiry is the **parent's** responsibility (per spec §5.6):
  render it only while `scoreHistory[latest].date` is within 30 days.

## `<EvidenceConfidence>`
```tsx
<EvidenceConfidence label="Safeguarding" score={9.1} bandLabel="Exemplary"
  evidence={{ evidence, confidence, reviewDepth, citation }} />
```
Dark-surface detail block (inside the interactive card): evidence note,
**confidence dots** (lime on dark, `aria-hidden` — the "n/5" text carries the
value), review-depth label, citation link. Missing evidence degrades to a
"see methodology" link — never invents content.

---

## Decisions (r4, CR-confirmed)
1. **ScoreChangeStamp colouring — RESOLVED: neutral design retained.** The spec's
   Lime↑/Clay↓ was rejected: Clay is a reserved pillar colour (§03) and
   traffic-light colouring was removed by explicit approval in PR #10. Direction
   is carried by the arrow glyph + `aria-label`.
2. **`--redaction` token — RESOLVED: added** (`--redaction: #1E1E1E` in
   `index.css`). The withdrawn Pillar Card's redaction bar and the `/methodology`
   Withdrawal marker now use it, so redaction can be tuned independently of
   ground-black.

## Open questions for CR/CD review
3. **96px card legibility** — at `size={96}` the centre score renders ≈23px.
   Fine on retina; confirm CD is happy before Luna adopts it inline (Luna
   currently uses `ScorePill` + stamp instead).
4. **Rule4bGuard API direction** — both APIs are supported; migrate existing
   call sites to `trustData` once the Trust Adapter (registry → TrustDisplayModel)
   lands, then deprecate the granular props?
