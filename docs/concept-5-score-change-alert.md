# Concept 5 — Score Change Alert

**Status:** Iteration 1 built (client-side evaluation engine + dry-run harness).
Detection and delivery are deferred (see Phasing). Ratified with CR; alert
copy/template is **not yet Donna-gated** — required before any real (non-dry-run)
delivery.

---

## 1. Purpose

Given an **authored** change to a tool's published trust position, decide whether
it is *significant* enough to warrant surfacing/notifying, attach the reasons,
and (eventually) route it to a delivery channel — fail-closed throughout.

**Key architectural truth:** the SPA holds exactly one snapshot of the dataset,
so it cannot *detect* a change (that needs a diff of snapshot N vs N‑1, a pipeline
concern). It can only *evaluate* changes already authored as data
(`integrityRecord` score-changes + `scoreChangeFeed` → `TrustDisplayModel.scoreHistory`).
Concept 5's client half is therefore an **evaluation engine**, not a detector.

## 2. What triggers evaluation

- **`score_change`** — a composite `ScoreChange` (`from → to`) in a tool's
  `scoreHistory`.
- **`withdrawal`** — a transition into a holding state (`Withdrawn` /
  `AwaitingReReview`). No numeric delta; always the highest tier.

## 3. Significance policy (ratified)

Evaluated as `delta = to − from` (rounded to 1 dp to kill float noise):

| Tier | Rule | `wouldSend` |
|---|---|---|
| `critical` | withdrawal / awaiting re-review, **or** `to` < **6.0** (safeguarding floor) | ✅ |
| `major` | \|Δ\| ≥ **1.0**, **or** the change crosses a pillar-band boundary (`≤2 / ≤4 / ≤6 / ≤8 / >8`) | ✅ |
| `minor` | **0.3** ≤ \|Δ\| < 1.0 | ⚙️ downgrades ✅, upgrades ✗ (default) |
| `none` | \|Δ\| < 0.3 (noise floor) | ✗ |

Two deliberate asymmetries: **downgrades weigh heavier than upgrades** (schools
care about regressions), and **withdrawals bypass the numeric logic entirely**.
Precedence is `critical → major → minor → none` (floor checked first). All
thresholds live in `ALERT_POLICY` (`src/lib/alerts/significance.ts`) so they are
tunable in one place.

**Edge (accepted):** `to < 6.0` yields `critical` regardless of direction — a tool
below the safeguarding floor is critical for a school whether it dropped there or
crept up to it.

**Implementation status (2026-07-07):** `src/lib/alerts/significance.ts` matches
this ratified policy exactly — `majorDelta = 1.0`, the pillar-band boundary rule
(`≤2 / ≤4 / ≤6 / ≤8 / >8` via `pillarBand`), the two asymmetries, and the
`critical → major → minor → none` precedence. `AlertEvaluation` / `AlertSignificance`
are the single definitions in `types.ts` (not re-declared in the engine).

**Deferred — boundary-band enhancement (considered for Iter 2, not adopted):** a
variant that treats any change *near a tier threshold* (within ±0.5 of the 8.0 /
6.0 boundaries) as `major` was prototyped and reverted. It is derived from a
*methodology*-review concept (Scoring Template v2.1 review, §4/P1: a composite
within ±0.5 of a tier threshold warrants a **second reviewer scoring pass** before
publication) — which is about **reviewer reproducibility**, not alert routing.
Ported to alert significance it proved too aggressive for our data (most published
tools score 8–9, i.e. inside the ±0.5 band around 8.0), flipping routine minor
moves to `major` and overriding the minor-upgrade suppression. **Deferred pending
further analysis + CR review** before any adoption.

## 4. Alert content / template

`toolName` · `from → to` (rendered via the existing neutral **`ScoreChangeStamp`**)
· band-before → band-after · tier + which rule fired (`reasons[]`) · authored
`reason` (never invented) · reviewer + date + methodology version · link to the
`/methodology` integrity record · absolute live URL.

**Fail-closed:** a `score_change` alert is never produced for a model failing
Trust Policy 1 (integrity ≠ verified, or a suppressed display state). Withdrawal
alerts are the sanctioned exception — they describe the *absence* of a score.

## 5. Delivery mechanism

- **Iteration 1: data layer + dry-run only.** No sends.
- **Deferred — hard blocker:** the site has no auth / subscription concept, so
  there is no "users who follow tool X" to notify client-side. Per-recipient
  delivery is fundamentally an **n8n + Brevo** concern.

## 6. Dry-run / testing

`evaluateAlert(change, ctx) → AlertEvaluation` is pure (no React, no I/O). The
runner `runAlertDryRun(alerts)` iterates, **fires `alert_trigger_evaluated`**
`{ toolId, wouldSend, delta }` per alert, and returns a report **without
delivering anything**. `dryRun` defaults `true`; passing `dryRun: false` throws
(no delivery channel exists yet) so a real send cannot happen by accident. The
`/dev/trust` harness renders the report as a table over illustrative + synthetic
changes. This is where `alert_trigger_evaluated` gets its first firing point.

## 7. Architecture

`src/lib/alerts/` (peer to `lib/receipt/`, `lib/trust/`):

- `types.ts` — `AlertSignificance`, `AlertEvaluation`, `AlertContext`, `ScoreChangeAlert`.
- `significance.ts` — `ALERT_POLICY` + pure `evaluateAlert()`. Unit-testable.
- `buildAlerts.ts` — consumes **`TrustDisplayModel`** via the adapter
  (`buildAlertsForModel`) — no direct registry reads (respects the r4 read path);
  plus `alertFromChange()` for authored/synthetic changes.
- `dryRun.ts` — the runner + `alert_trigger_evaluated` emission.

**Integration points (existing, reused/planned):** `ScoreChangeStamp` (display),
methodology `ScoreChangeFeed` (Iter 2 surface), `/dev/trust` (harness now).

## 8. Phasing

| Iter | Scope |
|---|---|
| **1 (this)** | Pure engine + types + `buildAlertsForModel` + dry-run runner firing `alert_trigger_evaluated` + `/dev/trust` harness over illustrative/synthetic data. No delivery, no detection. |
| **2** | ToolDetail "score changed recently" banner (adapter already computes `Updated`); methodology feed wired to `buildAlerts`; **Donna gate** on alert copy (same release-flag pattern as the receipt). |
| **3 (backend/n8n)** | Snapshot-diff *detection*, subscription model, Brevo delivery. Out of frontend scope. |

## 9. Open questions

1. **Change data source** — real `scoreHistory` is empty for all live tools; Iter 1
   runs on illustrative + synthetic data. Real alerts need CR-authored
   `ScoreChangeRecord`s or n8n snapshot-diffing.
2. **Delivery audience** — with no auth, who receives non-dry-run alerts, and via
   what channel? Blocks any real send.
3. **Pillar-level significance** — deferred: needs per-pillar history, which the
   model doesn't carry today.
4. **Methodology version** — alerts cite a version; the v3.0 (`methodology.ts`) vs
   v2.2 (`publicPillars`) conflict is pre-existing but alerts surface it.
5. **Donna gate** — alert copy asserts a public trust claim ("this tool's score
   dropped"); must pass the §22 review before real delivery.
