# GetPromptly — Phase 1 Widget & Artefact Layer
## Implementation Plan · Unified OS v1.2 · Weeks 4–8

**Status: FROZEN BASELINE for CR/CD review.** Planning document, not an implementation commitment.
**Revision:** r2 · 2026-06-28 — §3 `TrustDisplayModel` revised; §2/§4/§5/§9/§11 reconciled. See changelog at foot.

### Assumptions (challenge at review)
- **§4.1 sequencing rules applied:** (1) no score artefact ships before its live-score link target — the **Living Methodology Page** — is live; (2) **Shared Trust Components** ship before any consumer; (3) email infrastructure is template/spec-gated before any live-send build; (4) **Trust Policy 1** (fail-closed) is implemented in `<Rule4bGuard>` before any public score renders.
- **Single Phase 2 deferral driver:** the frozen **registry-versioning contract** (canonical prev→new score diffs). Anything consuming automated diffs is Phase 2 by sequencing, not preference.
- **Approvers:** CR = commercial/product owner; CD = creative/brand. **Donna** = the 8-point pre-publish gate (Brand Bible §22).
- **Live inputs assumed:** registry sync, pillar enrichment (score + evidence), Brevo credential chain. The six concepts are **additive** to the membership MVP (auth + Stripe + invoice/PO + gated library + receipt history); MVP scope is unchanged. No new data source beyond registry + Brevo + Luna. British English throughout.

### The six concepts
1. **Luna Provenance Inline Stamp** — Pillar Card + provenance stamp in chat
2. **Interactive Pillar Card** — clickable segments with evidence expansion
3. **Demo Audit Receipt Generator** — modal + downloadable PDF
4. **Intent-Aware Luna Entry** — two-question flow
5. **Score Change Alert** — email template + trigger-logic spec
6. **Living Methodology Page** — Changelog + Integrity Record + Score Change Feed

---

## 0. Architecture at a glance

```
        Registry + Methodology
                  │
                  ▼
            Trust Adapter
                  │
                  ▼
          TrustDisplayModel
                  │
                  ▼
       Shared Trust Components
                  │
         ┌────────┼─────────┐
         ▼        ▼         ▼
        Luna   Receipt   Review Page
                  │
                  ▼
       Membership (consumes artefacts)
                  │
                  ▼
         Alerts (Phase 2)
```

The **Registry** and **Methodology store** hold canonical values. The **Trust Adapter** maps them into one **`TrustDisplayModel`** carrying an `integrity.state`. **Shared Trust Components** render *only* from that model. **Luna, Receipt and Review Page** compose those components. **Membership** consumes the resulting artefacts — it never owns or mutates them. **Alerts** read the same model in Phase 2. There is exactly one read path from data to screen.

---

## 1. Architecture Principles (foundation)

1. **Single source of truth** — every score reaches the screen only through the `TrustDisplayModel`; no surface reads the registry directly.
2. **Shared trust components** — Rule 4b primitives are composed, never re-implemented per widget.
3. **Fail-closed by default** — unverifiable data renders no score, generates no receipt, sends no alert (**Trust Policy 1**).
4. **Every score links to its evidence** — no score ships without expandable evidence, a `<MethodologyStamp>`, and a `<LiveScoreLink>`.
5. **Membership consumes trust artefacts, it does not own them** — the MVP persists and gates *around* the trust layer; it never mutates or owns it.
6. **The public trust layer is independent of paid features** — all trust rendering works logged-out; gating is strictly additive.

---

## 2. Shared Trust Components Layer

No widget recreates a trust primitive. Each is a single component composed by consumers, with rendering-only responsibility (no data fetch, no scoring logic). This package ships **before** any UI consumer.

| Component | Purpose | Composed by |
|-----------|---------|-------------|
| `<Rule4bGuard>` | Fail-closed wrapper around any score render; enforces **Trust Policy 1** (§4) | All score artefacts |
| `<MethodologyStamp>` | Renders the methodology mark `vX.Y · date · reviewerInitials` (JetBrains Mono); no removal prop | 1, 2, 3, 6 |
| `<ReviewerBadge>` | Reviewer initials + verified date (ISO) | 2, 3, 6 |
| `<ScoreChangeStamp>` | `direction ↑/↓ · oldScore→newScore · date · version` (from latest `scoreHistory`; auto-expires after the 30-day Updated window) | 5, 6 |
| `<EvidenceConfidence>` | Per-pillar evidence + citation + confidence + review depth | 2 (and via 2: 1, 3) |
| `<LiveScoreLink>` | Canonical link to the tool's live review page (`livePageUrl`, adapter-derived) | 1, 2, 3, 5 |
| `<PillarCard>` | Signature artefact — fixed-order 5 segments + one-line `verdict` + the above | 1, 3, Review Pages |

---

## 3. Canonical `TrustDisplayModel`

One typed model, one adapter (`registry + methodology → TrustDisplayModel`). **No artefact reads the registry directly** — Luna, Receipt, Review Page, Methodology and Alerts all render from this model, so scores render identically everywhere. `integrity.state` is the single switch every component checks; there is no per-widget "is the data ok?" logic.

```ts
// ── Supporting types ──────────────────────────────────────────────
type PillarKey =
  | 'data_privacy' | 'safeguarding' | 'age_suitability'
  | 'transparency' | 'accessibility';

type Confidence  = 'High' | 'Medium' | 'Low';
type ReviewDepth = 'Desk Review' | 'Hands-On Tested' | 'Classroom Trialled';
type ChangeDirection = 'up' | 'down';

// How a *rendered* card is styled. Distinct from integrity.state, which
// decides whether anything renders at all (§4 Trust Policy 1).
type DisplayState =
  | 'Active'       // verified & current (default)
  | 'Provisional'  // shown but low-confidence / desk-only — set by adapter
  | 'Updated'      // latest scoreHistory[].date within 30 days of render (N=30; keep in sync with Prompt 1)
  | 'Withdrawn'    // tool pulled — explicit flag, NOT derivable
  | 'Historic';    // archived snapshot — explicit flag, NOT derivable

// ── The single typed model every surface renders from ─────────────
// One adapter: (registry + methodology) → TrustDisplayModel.
// No artefact reads the registry directly. integrity.state is the render gate.
interface TrustDisplayModel {
  toolId: string;
  toolName: string;
  verdict: string;                       // one-line British-Voice verdict (P1, P3); suppressed under fail-closed (§4)

  promptlyScore: number | null;          // composite Promptly Score; null ⇒ fail-closed
  displayState: DisplayState;            // NEW — styling axis (not the render gate)

  pillars: Array<{                       // ALWAYS the fixed 5, in fixed order
    key: PillarKey;
    label: string;
    colourToken: string;                 // reserved pillar token, never overridden
    score: number | null;
    evidence: string | null;            // null ⇒ not yet published / fail-closed
    citation: string | null;
    confidence: Confidence;
    reviewDepth: ReviewDepth;           // per-pillar review-depth context (evidence only); no card-level depth badge in P1
  }>;

  methodology: {
    version: string;
    reviewerInitials: string;            // RENAMED from reviewerName (stamp renders initials)
    verifiedDate: string;                // ISO
  };

  scoreHistory: Array<{                   // per-tool score changes; latest = the "current change"
    version: string;
    date: string;                        // ISO
    oldScore: number;                    // RENAMED from prevScore
    newScore: number;
    direction: ChangeDirection;          // NEW — ↑/↓ for ScoreChangeStamp + alert email
    pillarChanged?: PillarKey;           // NEW — driving pillar; omitted ⇒ composite/multiple
    reasonOneSentence: string;           // RENAMED from rationale — short, for stamp/email/feed
    changelogId: string;                 // → full methodology changelog entry (long rationale)
  }>;

  disclosure?: { present: boolean; text: string };
  livePageUrl: string;                   // adapter-derived; consumed via <LiveScoreLink>
  integrity: {                           // the single render gate (§4 Trust Policy 1)
    state: 'verified' | 'stale' | 'unavailable';
    fetchedAt: string;                   // ISO
  };
}
```

---

## 4. Fail-Closed Trust Policy

**Trust Policy 1 (single, canonical — implemented in `<Rule4bGuard>` + `integrity.state`):**

> If registry/methodology data cannot be **verified** (`integrity.state ∈ {stale, unavailable}` — i.e. null value, beyond TTL, or fetch error), then: **no score is rendered, no receipt is generated, no alert is sent**; the dated stamp is never shown without a verified value; and the user is **directed to the live review page**. A `score_unavailable_shown` event is emitted.

Every concept inherits this. There is no per-widget fail-closed variant.

**Render gate vs styling (precedence).** `integrity.state` is the *sole* render gate. `displayState` (`Active｜Provisional｜Updated｜Withdrawn｜Historic`) only styles what has already passed the gate — it can never cause a score to render when `integrity.state ≠ verified`. The adapter sets `Active｜Provisional｜Updated`; `Withdrawn｜Historic` are explicit input flags, never derived.

**Verdict visibility (proposed, pending CR/CD).** `verdict` renders **only** when `integrity.state === 'verified'` **and** `promptlyScore !== null`. Under fail-closed, no verdict line shows — a verdict beside "score unavailable" sends mixed signals (Trust Policy 1).

---

## 5. Ownership Boundaries

| Domain | Owning system | Owns | Must NOT |
|--------|---------------|------|----------|
| Score values, pillars, evidence | **Registry** | Canonical numbers + evidence; Desk Review score ceilings (e.g. 8.5 cap on Safeguarding/Privacy) — enforced upstream, never surfaced in the display | Render; format stamps |
| Methodology version, Changelog, Integrity Record | **Methodology store** | Versions + change rationale | Hold score values independently |
| `TrustDisplayModel` mapping + `integrity.state` | **Trust Adapter** | Registry+methodology → model; staleness/TTL; sets `displayState` (`Active｜Provisional｜Updated`); passes through explicit `Withdrawn｜Historic` flags | Mutate registry; render; derive `Withdrawn｜Historic` |
| Score rendering | **Shared Trust Components** | All visual trust output | Fetch data; evaluate triggers |
| PDF snapshot | **Receipt service** | Receipt generation from model | Own/cache scores beyond stamped snapshot |
| Trigger eval + send (P2) | **Alert service** | Delta detection + Brevo send | Compute scores; render UI |
| Conversation + intent | **Luna** | Dialogue, routing | Compute scores; bypass components |
| Auth, Stripe, library, receipt **history** | **Membership MVP** | Persistence + gating | Own, mutate, or gate the public trust layer |

---

## 6. Workstream Separation

**Infrastructure → Shared Components → UI → Content → Donna → Release.** Concepts cut across workstreams; ownership is per-workstream, not per-concept.

| Workstream | Scope | Concept tasks it carries |
|------------|-------|--------------------------|
| **Infrastructure** | Trust Adapter, `TrustDisplayModel`, registry/methodology read paths, analytics pipe, Brevo credential chain | 5 (trigger spec/dry-run), 6 (feed data), adapter for all |
| **Shared Components** | §2 component package incl. `<Rule4bGuard>` | 1, 2, 3 (all consume) |
| **UI** | Surfaces: Luna inline, Pillar Card interactions, Receipt modal, Luna entry flow, Methodology page | 1, 2, 3, 4, 6 |
| **Content** | Copy, evidence text, Integrity Record format, email/feed copy, Luna system prompts | 1, 4, 5, 6 |
| **Donna** | §12 gates against the §13 exit criteria | all |
| **Release** | Quiet-live sequencing, fail-closed verification in prod, membership consumption at W8 | all |

---

## 7. Dependency Map

| # | Concept | Depends on | Depended on by |
|---|---------|-----------|----------------|
| — | **Trust Adapter + `TrustDisplayModel`** | Registry sync, pillar enrichment, methodology store | Everything below |
| — | **Shared Trust Components** | Trust Adapter, `TrustDisplayModel` | 1, 2, 3, 5, 6 |
| 6 | **Living Methodology Page** | Methodology store, `scoreHistory`; manual curation | Rule 4b link target for 1, 2, 3, 5; feed source for 5 |
| 2 | **Interactive Pillar Card** | `<PillarCard>` + `<EvidenceConfidence>`; pillar enrichment | 1, 3, Review Pages |
| 3 | **Demo Audit Receipt** | Concept 2 (card), `TrustDisplayModel`, PDF lib | Membership receipt history (W8); owns time-to-first-receipt |
| 1 | **Luna Inline Stamp** | Concept 2 (card), Luna pipeline, concept 6 (link target) | Luna trust funnel → 3 |
| 4 | **Intent-Aware Luna Entry** | Luna pipeline only | Routes into 1 → 2 → 3 |
| 5 | **Score Change Alert** | Concept 6 (feed), Brevo chain, registry-versioning contract | Membership alert/retention (Phase 2) |

**Critical path:** Trust Adapter + `TrustDisplayModel` → Shared Trust Components → 6 (link target) → {2 → 3, 1} → 4 ‖ 5 (spec only, parallel).

---

## 8. Week-by-Week Build Sequence (Weeks 4–8)

| Concept | Earliest Ship | Phase 1 MVP ("done") | Phase 2 Deferred (+ 1-sentence rationale) | Complexity | Donna Gate |
|---------|---------------|----------------------|-------------------------------------------|------------|------------|
| **Infra + Shared Components** | **W3 adapter → W4 components** | `TrustDisplayModel` + Trust Adapter (W3); §2 component package incl. `<Rule4bGuard>` green (W4) | — | M | Yes (component templates) |
| **6 Living Methodology** | W3 base → **W5** feed | Changelog + Score Integrity Record live (W3); manually-curated Score Change Feed (W5); every entry links to tool live page | Auto-diff feed + RSS — *automated diffing depends on the registry-versioning contract not frozen until Phase 2, and a wrong auto-entry corrupts the canonical Integrity Record* | M | Yes |
| **2 Interactive Pillar Card** | **W4** | Consumes `<PillarCard>`; click any segment → `<EvidenceConfidence>` (evidence + citation); fail-closed skeleton on missing data | History sparkline + annotation — *sparkline needs `scoreHistory` time-series rendering and annotation needs write-back, neither exists in the read-only registry* | M | Yes |
| **3 Demo Audit Receipt** | **W4** | Modal generates a single-tool PDF snapshot with embedded `<PillarCard>` + `<MethodologyStamp>` + `<LiveScoreLink>` + "snapshot as of date" | Auto re-issue on score change — *re-issue consumes concept 5's live trigger, which is Phase 2* | L | Yes |
| **1 Luna Inline Stamp** | **W5** | Single-tool score query renders inline `<PillarCard>` + `<MethodologyStamp>` + `<LiveScoreLink>`; fail-closed to live page on `integrity≠verified` | Multi-tool comparison cards in one reply — *comparison needs a multi-select registry query shape absent from the P1 Luna pipeline* | M | Yes |
| **4 Intent-Aware Luna Entry** | **W6** | Two-question flow (intent → context) routing to card / receipt / methodology; no score shown in the flow | Profile/role-personalised routing — *requires authenticated membership profile data only available after MVP auth at W8; coupling a public flow to gated state breaks the additive constraint* | S | Yes (copy + system prompt) |
| **5 Score Change Alert** | **W7** (spec/template) | Brevo-ready email template (`<ScoreChangeStamp>`) + trigger-logic spec + dry-run harness proving triggers; **zero live sends** | Live trigger + Brevo send + subscription management — *sequenced to Phase 2 so it fires against a frozen versioning contract; sending before that risks false alerts to members* | M | Template-only |

Membership MVP **quiet-live (W8)** consumes concept 3's receipt output into receipt history — no change to MVP scope.

---

## 9. Data Requirements

All artefacts consume slices of the **`TrustDisplayModel`** (§3); none read the registry directly. Below: the slice consumed, what triggers a re-render/re-fetch, and (concept 5) the alert trigger.

**1 Luna Inline Stamp** — `promptlyScore`, `verdict`, `displayState`, `pillars`, `methodology` (`reviewerInitials`), `livePageUrl`, `integrity`. **Re-render:** new Luna message resolving to a `toolId`; `integrity`/version change mid-session.

**2 Interactive Pillar Card** — `pillars` (+ `evidence`, `citation`, `confidence`, `reviewDepth`), `displayState`, `methodology`, `livePageUrl`, `integrity`. **Re-render/re-fetch:** card mount; segment click (lazy-hydrate evidence if absent); version change.

**3 Demo Audit Receipt** — full model incl. `verdict` + `disclosure`. **Re-fetch:** "Generate receipt" pulls a fresh model snapshot (no score cached into the PDF beyond the stamped date).

**4 Intent-Aware Luna Entry** — none from the model for the flow itself (Luna session intent/context only); routing target resolves a `toolId` post-flow. **Re-render:** flow start; answer to Q1 (reveals Q2 branch).

**5 Score Change Alert** — `toolId`, `toolName`, `scoreHistory` (`oldScore`→`newScore`, `direction`, `pillarChanged?`, `reasonOneSentence`, `changelogId`), `methodology.version`, `livePageUrl`; Brevo: `list_id`, `template_id`, subscriber attributes, credential chain. **Alert send trigger (spec'd; fires in P2):** a confirmed `scoreHistory` delta where `oldScore ≠ newScore` **and** a published Changelog entry exists **and** `integrity.state = verified` → enqueue to subscribers watching that `toolId`. **Suppress on:** null/stale value, missing Changelog entry, methodology-only (non-score) edit.

**6 Living Methodology Page** — `methodology`, `scoreHistory`, `livePageUrl`, Integrity Record fields. **Re-render:** page load; new curated entry published. Emits the feed concept 5 reads (no send itself).

---

## 10. Rule 4b Compliance Checklist

Fail-closed behaviour is **Trust Policy 1** (§4) via `<Rule4bGuard>` for every row — no bespoke variants. The dated stamp is `<MethodologyStamp>`, which has **no removal prop** (non-removable by construction).

| Concept | Displays a score? | Dated stamp (`<MethodologyStamp>`) | Live-score link (`<LiveScoreLink>`) | Stamp removable? |
|---------|-------------------|------------------------------------|-------------------------------------|------------------|
| **1 Luna Inline Stamp** | Y | Inline card footer | Card footer | No |
| **2 Interactive Pillar Card** | Y | Card footer | Card header/footer | No |
| **3 Demo Audit Receipt** | Y | Receipt face + PDF metadata | Receipt body + "snapshot as of date" | No |
| **4 Intent-Aware Luna Entry** | N | n/a (flow shows no score; must not surface a cached value) | n/a (routes to artefacts carrying their own) | n/a |
| **5 Score Change Alert** | Y | Email body (effective date + version, via `<ScoreChangeStamp>`) | CTA → live page + Changelog entry | No |
| **6 Living Methodology Page** | Y | Each entry (canonical stamp source) | This page **is** the link target; each entry links to tool live page | No |

---

## 11. Standard Analytics Event Model

Defined once; emitted by every surface with the same shape. **Standard properties on all events:** `tool_id`, `surface` (`luna｜receipt｜methodology｜review_page`), `methodology_version`, `integrity_state` (mirrors `integrity.state`), `display_state` (mirrors `displayState`), `session_id`.

| Event | Trigger | Extra properties | Emitting concepts |
|-------|---------|------------------|-------------------|
| `provenance_viewed` | Stamp/card enters viewport | — | 1, 2, 3, 6 |
| `pillar_opened` | Segment expanded | `pillar_key` | 2 (via 1, 3) |
| `methodology_clicked` | `<MethodologyStamp>`/link click | — | 1, 2, 3, 6 |
| `live_score_clicked` | `<LiveScoreLink>` click | — | 1, 2, 3, 5 |
| `receipt_generated` / `receipt_downloaded` | Modal generate / PDF download | `gen_to_download_ms` | 3 |
| `luna_intent_started` / `luna_intent_completed` | Q1 shown / routed | `intent`, `route_target` | 4 |
| `alert_trigger_evaluated` | Dry-run harness eval (P1) | `would_send`, `delta` | 5 |
| `score_unavailable_shown` | Trust Policy 1 fires | `reason` | all (fail-closed) |

---

## 12. Donna Gate Schedule

| Item being gated | Gate Type | Approver | Phase 1 Week |
|------------------|-----------|----------|--------------|
| Shared Trust Components — templates (stamp, badge, card, evidence, link) | Full | CR + CD | W4 |
| Living Methodology — Integrity Record format + Changelog copy | Full | CR + CD | W3 (base) |
| Interactive Pillar Card — evidence-expansion layout | Full | CR + CD | W4 |
| Demo Audit Receipt — PDF/modal template + copy + disclosure block | Full | CR + CD | W4 |
| Luna Inline Stamp — inline render + Luna system prompt change | Full | CD (brand) + CR | W5 |
| Living Methodology — Score Change Feed copy | Copy | CR + CD | W5 |
| Intent-Aware Luna Entry — two-question copy + system prompt | Copy | CD (lead) + CR | W6 |
| Score Change Alert — email template + copy (no send) | Template-only | CR + CD | W7 |

*Rule: any artefact carrying a score or a methodology mark is Full-gated; copy-only and template-only gates apply where no live score is rendered (4) or nothing ships live (5).*

---

## 13. Per-Concept Exit Criteria (QA)

**1 Luna Inline Stamp** — ☐ single-tool query renders `<PillarCard>` from `TrustDisplayModel`; ☐ `<MethodologyStamp>` + `<LiveScoreLink>` present; ☐ `integrity≠verified` → live-page redirect, no number; ☐ no removal prop on the stamp; ☐ `provenance_viewed`, `methodology_clicked` fire.

**2 Interactive Pillar Card** — ☐ fixed 5-pillar order + reserved `colourToken`s; ☐ each segment expands `<EvidenceConfidence>` (evidence + citation); ☐ missing pillar → skeleton, no implied score; ☐ `pillar_opened{pillar_key}` fires; ☐ renders identically across all surfaces from the same model.

**3 Demo Audit Receipt** — ☐ modal generates single-tool PDF with embedded card + `<MethodologyStamp>` + `<LiveScoreLink>` + "snapshot as of date"; ☐ generation **refused** if any of score/version/reviewer/date missing; ☐ disclosure block present when `disclosure.present`; ☐ `receipt_generated`/`receipt_downloaded` fire; ☐ output consumable by MVP receipt history (W8) without schema change.

**4 Intent-Aware Luna Entry** — ☐ two-question flow routes to card/receipt/methodology; ☐ no score shown in flow; ☐ registry failure routes to live page; ☐ `luna_intent_started`/`_completed` fire with `route_target`; ☐ copy + system prompt Donna-passed.

**5 Score Change Alert** — ☐ Brevo-ready template renders `<ScoreChangeStamp>` + CTA from model; ☐ trigger spec documents send/suppress conditions; ☐ dry-run harness classifies all `scoreHistory` deltas with **zero false sends**; ☐ no live send path enabled in P1; ☐ `alert_trigger_evaluated` fires.

**6 Living Methodology Page** — ☐ Changelog + Integrity Record + Score Change Feed live; ☐ every entry carries version+date+reviewer and links to tool live page; ☐ feed renders last-known + staleness banner on failure, never fabricates; ☐ 100% of live artefacts' `<LiveScoreLink>` resolve here; ☐ Donna-passed.

---

## 14. Success Metrics (one per concept)

| Concept | Measure | Healthy | Concerning | Link to time-to-first-receipt |
|---------|---------|---------|------------|-------------------------------|
| **1 Luna Inline Stamp** | Provenance completeness: % of Luna score answers rendering full stamp + live link | >99% complete | <95% (data gaps / fail-closed firing often) | Upstream funnel — stamped answers proceeding to receipt |
| **2 Interactive Pillar Card** | Evidence-expansion engagement: % of card views expanding ≥1 segment | ≥15% expand | ~0% (ignored) or runaway confusion-clicks | Expansions preceding a receipt download |
| **3 Demo Audit Receipt** | **Time-to-first-receipt** (activation metric): landing → first PDF | Short median; low modal drop-off | Long median / high modal abandonment | **Owns the metric** |
| **4 Intent-Aware Luna Entry** | Two-question completion rate (entry → routed) | >70% complete & routed | High abandonment at Q1/Q2 | Top-of-funnel feeder into the receipt path |
| **5 Score Change Alert** | Dry-run trigger accuracy: simulated deltas correctly classified, zero false sends | 100% correct, 0 false-positive triggers | Any false-positive trigger in simulation | Post-receipt retention (Phase 2; no P1 link) |
| **6 Living Methodology Page** | Rule 4b link integrity: % of live artefacts whose `<LiveScoreLink>` resolves to a valid methodology + Changelog entry | 100% resolve | Any broken/stale link | Trust assurance underpinning every receipt (indirect) |

---

### Changelog
- **r2 · 2026-06-28** — §3 `TrustDisplayModel` revised: added `verdict`, `displayState` (+ `DisplayState` enum), per-pillar `reviewDepth`, `scoreHistory.direction` / `pillarChanged`, typed `confidence`; renamed `reviewerName→reviewerInitials`, `prevScore→oldScore`, `rationale→reasonOneSentence`. Reconciled §2 (components), §4 (render-gate vs styling precedence), §5 (adapter owns `displayState`), §9 (data slices), §11 (`display_state` property).
- **Resolved (proposed, pending CR/CD):**
  1. `displayState='Updated'` window **N = 30 days** — set when the latest `scoreHistory[].date` is within 30 days of render; `<ScoreChangeStamp>` derives ↑/↓ from `scoreHistory.direction` and auto-expires after the window. Keep in sync with Prompt 1's "changed in the last 30 days" (P1 lives outside this doc — change both together).
  2. Desk Review 8.5 ceiling (Safeguarding/Privacy) — **enforced upstream in scoring only, not surfaced** in the trust display; `reviewDepth` stays per-pillar (evidence context), no card-level depth badge in P1.
  3. `verdict` renders **only** when `integrity.state === 'verified'` **and** `promptlyScore !== null` — suppressed under fail-closed (§4).

*Changes after this point are version-bumped revisions, not edits.*
