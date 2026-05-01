# GetPromptly Analytics — Event Reference & Dashboard Guide

All events fire to GA4 via `gtag('event', name, params)` and as a `promptly_analytics`
DOM custom event. No PII is collected: no names, email addresses, or identifiers are
sent in event params. Consent is handled at the cookie-banner level.

---

## Event Catalogue

### Navigation & roles

| Event | Key params | Where fired | Notes |
|---|---|---|---|
| `page_view` | `path` | All pages | GA4 native; also fired manually |
| `role_selected` | `role`, `pageType` | RolePage (on mount), Tools role tab | Only fires when a non-All role is chosen |

---

### Tools directory

| Event | Key params | Where fired |
|---|---|---|
| `tool_filter_used` | `filterType` (`role`/`category`/`safety`/`search`/`sort`), `value`, `pageType` | Tools.tsx — role tabs, category pills, safety buttons, search input |
| `tool_score_viewed` | `toolSlug`, `toolName`, `category`, `safety`, `tier` | Tools.tsx — when ScoreResultPanel opens with a found result |
| `tool_submitted_for_review` | `toolName` | Tools.tsx — ToolNotFoundPanel form submit |

---

### Outbound clicks

| Event | Key params | Where fired | Notes |
|---|---|---|---|
| `outbound_tool_click` | `toolSlug`, `toolName`, `category`, `linkType`, `source` (`affiliate`/`direct`), `pageType` | ToolCard (Tools dir), ToolDetail CTA | Canonical event for all tool link clicks |
| `affiliate_click` | `itemId`, `itemName`, `category`, `pageType` | ToolDetail CTA (affiliate only) | Fires alongside `outbound_tool_click` |
| `direct_source_click` | `itemId`, `itemName`, `category`, `pageType` | ToolDetail CTA (direct only) | Fires alongside `outbound_tool_click` |

---

### Prompt packs

| Event | Key params | Where fired |
|---|---|---|
| `prompt_pack_view` | `packSlug` | PromptsPack.tsx on mount |
| `prompt_preview_copied` | `packSlug`, `promptIndex` | PromptsPack.tsx copy button |
| `prompt_pack_email_submit` | `packSlug`, `role` | MonetisationBanner email gate |
| `prompt_pack_marketing_opt_in` | `packSlug` | MonetisationBanner opt-in checkbox |

---

### Training

| Event | Key params | Where fired |
|---|---|---|
| `training_path_email_submit` | `pathwaySlug` | PathwayEmailCTA component |

---

### Agent

| Event | Key params | Where fired | Notes |
|---|---|---|---|
| `agent_opened` | `section`, `pageType?` | AgentCTACard main CTA, agent widget, score panel | `section` identifies context |
| `agent_contextual_prompt_clicked` | `prompt`, `section`, `pageType?` | AgentCTACard suggested prompt pills | Distinct from `agent_opened` — shows which prompt drove the click |

---

### Cross-sell

| Event | Key params | Where fired |
|---|---|---|
| `cross_sell_impression` | `sourceSection`, `targetSection`, `itemId` | CrossSellCard on render |
| `cross_sell_click` | `sourceSection`, `targetSection`, `itemId` | CrossSellCard click |
| `cross_sell_popup_impression` | `sourceSection`, `trigger`, `count` | CrossSellPopup on open |
| `cross_sell_popup_click` | `sourceSection`, `targetSection`, `itemId` | CrossSellPopup item click |
| `cross_sell_dismiss` | `sourceSection`, `trigger` | CrossSellPopup close button |

---

## Dashboard Queries (GA4 / Looker Studio)

### 1 — Prompt pack email conversion rate
**Definition:** `prompt_pack_email_submit` ÷ `prompt_pack_view` per pack

```
Metric A: countIf(event_name = 'prompt_pack_view')       GROUP BY packSlug
Metric B: countIf(event_name = 'prompt_pack_email_submit') GROUP BY packSlug
Conversion = B / A
```
Dimension: `packSlug` · Time: weekly · Alert if conversion < 5%

---

### 2 — Tool outbound click rate
**Definition:** `outbound_tool_click` ÷ `tool_score_viewed` (intent-to-click)

```
Metric A: countIf(event_name = 'tool_score_viewed')   GROUP BY toolSlug
Metric B: countIf(event_name = 'outbound_tool_click') GROUP BY toolSlug
Click rate = B / A
```
Breakdown: `source = affiliate` vs `direct` · Category dimension available

---

### 3 — Cross-sell click-through rate
**Definition:** `cross_sell_click` ÷ `cross_sell_impression` per item and section pair

```
Metric A: countIf(event_name = 'cross_sell_impression') GROUP BY sourceSection, targetSection, itemId
Metric B: countIf(event_name = 'cross_sell_click')      GROUP BY sourceSection, targetSection, itemId
CTR = B / A
```
Breakdown by `sourceSection` → `targetSection` flow (tools→prompts, prompts→training, etc.)

---

### 4 — Agent engagement rate
**Definition:** `agent_opened` ÷ sessions containing a tool/pack view

```
Metric A: countDistinct(session_id) WHERE event_name IN ('tool_score_viewed','prompt_pack_view')
Metric B: countDistinct(session_id) WHERE event_name = 'agent_opened'
Engagement rate = B / A
```
Sub-metric: `agent_contextual_prompt_clicked` ÷ `agent_opened` = prompt adoption rate

---

### 5 — Tool scoring usage
**Definition:** Weekly unique users who fire `tool_score_viewed`

```
Metric: countDistinct(user_pseudo_id) WHERE event_name = 'tool_score_viewed'
Dimension: week, category, tier
```
Funnel: `tool_score_viewed` → `outbound_tool_click` → (affiliate or direct)

---

### 6 — Most popular user roles
**Definition:** `role_selected` event count by role value

```
Metric: count(*) WHERE event_name = 'role_selected'
Dimension: role, pageType
Order by: count DESC
```
Use to prioritise which role pages get new content first.

---

### 7 — Highest-converting content categories
**Definition:** Outbound clicks per tool category normalised by tool count

```
Metric A: count(*) WHERE event_name = 'outbound_tool_click' GROUP BY category
Metric B: count(DISTINCT toolSlug) per category
Clicks per tool = A / B
```
Cross-reference with `tool_filter_used (filterType=category)` to see discovery vs conversion gap.

---

## Weekly Review Checklist

Run every Monday morning against the previous 7 days:

- [ ] Prompt pack email conversion rate by pack — flag any pack below 4%
- [ ] Tool outbound click rate — flag tools with >100 score views and <10% click rate
- [ ] Cross-sell CTR by section pair — identify weakest cross-sell flows
- [ ] Agent engagement rate — target >15% of sessions with tool/pack views
- [ ] Top 5 roles by `role_selected` — check role pages are up to date
- [ ] Top 5 categories by outbound clicks — update featured content accordingly
- [ ] `tool_submitted_for_review` count — add any frequently-submitted tools to the directory

---

## Privacy & Consent Notes

- No email addresses, names, or user-identifiable strings are sent in event params.
- The `email?` field on the legacy `tool_review_submitted` event is present in the type
  but **must not be populated** — it is kept only for backwards-compat with the type system.
  The current call site does not pass it.
- All tracking requires the user to have accepted analytics cookies (handled by CookieBanner).
- `gtag` is only called when `window.gtag` exists (set by the consent-gated GA4 snippet).
- The `promptly_analytics` DOM event fires unconditionally for internal use only and does
  not send data to any third party.

---

## Backwards-Compat Events

These legacy events remain in the `SiteEvent` type and still fire. New code should
prefer the canonical names above.

| Legacy name | Canonical replacement |
|---|---|
| `prompt_pack_preview_copy` | `prompt_preview_copied` |
| `pathway_email_submit` | `training_path_email_submit` |
| `tool_review_submitted` | `tool_submitted_for_review` |
| `tool_detail_cta_click` | `outbound_tool_click` |
| `crosssell_impression` | `cross_sell_impression` |
| `crosssell_click` | `cross_sell_click` |
| `crosssell_popup_dismissed` | `cross_sell_dismiss` |
| `filter_applied` | `tool_filter_used` (tools), `role_selected` (role) |
