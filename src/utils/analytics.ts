/**
 * Site-wide analytics event helper.
 * Fires to GA4 (gtag) and a custom DOM event for Vercel Analytics or other listeners.
 *
 * Naming convention:  snake_case, noun_verb pattern where possible.
 * All events are non-PII. No email addresses or names are sent.
 *
 * See ANALYTICS.md for event documentation, dashboard queries, and success metrics.
 */

export type PageType =
  | 'home'
  | 'tools-directory'
  | 'tool-detail'
  | 'prompts-hub'
  | 'prompts-library'
  | 'prompts-pack'
  | 'training'
  | 'equipment'
  | 'role-page'
  | 'schools'
  | 'safety-methodology'
  | 'other';

/** §11: the four trust surfaces every trust event is attributed to. */
export type TrustSurface = 'luna' | 'receipt' | 'methodology' | 'review_page';

export type SiteEvent =
  // ── Navigation & roles ──────────────────────────────────────────────────────
  | { name: 'page_view';           path: string }
  | { name: 'role_selected';       role: string; pageType: PageType }

  // ── Tools directory ─────────────────────────────────────────────────────────
  | { name: 'tool_filter_used';    filterType: 'role' | 'category' | 'safety' | 'search' | 'sort';
                                   value: string; pageType: PageType }
  | { name: 'tool_score_viewed';   toolSlug: string; toolName: string;
                                   category: string; safety: number; tier: string }
  | { name: 'tool_submitted_for_review'; toolName: string }

  // ── Outbound clicks ─────────────────────────────────────────────────────────
  /** Fires for every external tool/resource link click */
  | { name: 'outbound_tool_click'; toolSlug: string; toolName: string;
                                   category: string; linkType: string;
                                   source: 'affiliate' | 'direct'; pageType: PageType }
  /** Convenience alias for affiliate links — allows segmented funnel analysis */
  | { name: 'affiliate_click';     itemId: string; itemName: string;
                                   category: string; pageType: PageType }
  /** Convenience alias for direct (non-affiliate) links */
  | { name: 'direct_source_click'; itemId: string; itemName: string;
                                   category: string; pageType: PageType }

  // ── Prompt packs ────────────────────────────────────────────────────────────
  | { name: 'prompt_pack_view';           packSlug: string }
  | { name: 'prompt_preview_copied';      packSlug: string; promptIndex: number }
  | { name: 'prompt_pack_email_submit';   packSlug: string; role: string }
  | { name: 'prompt_pack_marketing_opt_in'; packSlug: string }

  // ── Training ────────────────────────────────────────────────────────────────
  | { name: 'training_path_email_submit'; pathwaySlug: string }

  // ── Agent ───────────────────────────────────────────────────────────────────
  | { name: 'agent_opened';                  section: string; pageType?: PageType }
  | { name: 'agent_contextual_prompt_clicked'; prompt: string; section: string; pageType?: PageType }

  // ── Trust layer (§11 standard event model) ──────────────────────────────────
  // Standard properties: toolId, surface, methodologyVersion, integrityState,
  // displayState. (§11 also lists session_id — deliberately not implemented:
  // the site has no session concept; GA4 supplies its own.)
  /** Fired by <Rule4bGuard> whenever a score is suppressed (fail-closed integrity
   *  or a Withdrawn/AwaitingReReview display state). Standard props present when
   *  the guard renders from trustData + a surface is supplied. */
  | { name: 'score_unavailable_shown'; reason: 'display-state' | 'integrity'; displayState: string;
      toolId?: string; surface?: TrustSurface; methodologyVersion?: string; integrityState?: string }
  /** §11: a trust stamp/card entered the viewport (fires once per tool per mount). */
  | { name: 'provenance_viewed'; toolId: string; surface: TrustSurface;
      methodologyVersion: string; integrityState: string; displayState: string }
  /** §11: an interactive Pillar Card segment was expanded. */
  | { name: 'pillar_opened'; pillarKey: string; toolId: string; surface: TrustSurface;
      methodologyVersion: string; integrityState: string; displayState: string }
  /** §11: a methodology link/stamp on a trust surface was clicked. */
  | { name: 'methodology_clicked'; toolId: string; surface: TrustSurface; displayState?: string }
  /** §11: a <LiveScoreLink> was clicked. */
  | { name: 'live_score_clicked'; url: string; surface: TrustSurface; toolId?: string;
      methodologyVersion?: string; integrityState?: string; displayState?: string }
  /** Concept 3: modal opened with a frozen model snapshot (§11). */
  | { name: 'receipt_generated'; toolId: string; surface: 'receipt';
      methodologyVersion: string; integrityState: string; displayState: string }
  /** Concept 3: PDF saved. genToDownloadMs = modal open → download complete (§11). */
  | { name: 'receipt_downloaded'; toolId: string; surface: 'receipt';
      methodologyVersion: string; integrityState: string; displayState: string; genToDownloadMs: number }
  /** §11 Concept 4: intent step shown / resolved (legacy `intent_completed` in
   *  api/agent.ts still fires for backwards compatibility). */
  | { name: 'luna_intent_started'; surface: 'luna' }
  | { name: 'luna_intent_completed'; surface: 'luna'; skipped: boolean; yearGroup?: string; concern?: string }
  /** §11 Concept 5: typed ahead for the dry-run harness — NO firing point exists
   *  yet (Concept 5 is unbuilt). */
  | { name: 'alert_trigger_evaluated'; toolId: string; wouldSend: boolean; delta: number }

  // ── Cross-sell ──────────────────────────────────────────────────────────────
  | { name: 'cross_sell_impression'; sourceSection: string; targetSection: string; itemId: string }
  | { name: 'cross_sell_click';      sourceSection: string; targetSection: string; itemId: string }
  | { name: 'cross_sell_dismiss';    sourceSection: string; trigger: string }
  | { name: 'cross_sell_popup_impression'; sourceSection: string; trigger: string; count: number }
  | { name: 'cross_sell_popup_click';      sourceSection: string; targetSection: string; itemId: string }

  // ── Legacy / backwards-compat — kept so existing call sites don't break ─────
  | { name: 'cta_clicked';              section: string; label: string }
  | { name: 'search_performed';         section: string; query: string }
  | { name: 'filter_applied';           section: string; filter: string; value: string }
  | { name: 'tool_viewed';              tool: string }
  | { name: 'equipment_viewed';         product: string }
  | { name: 'training_viewed';          course: string }
  | { name: 'prompt_viewed';            prompt: string }
  | { name: 'prompt_copied';            packId: string }
  | { name: 'comparison_started';       items: string }
  | { name: 'comparison_completed';     items: string }
  | { name: 'recommendation_clicked';   type: string }
  | { name: 'quote_cta_clicked';        section: string }
  | { name: 'email_capture_submitted';  section: string }
  | { name: 'pathway_email_submit';     pathwaySlug: string }   // superseded by training_path_email_submit
  | { name: 'prompt_pack_preview_copy'; packSlug: string; promptIndex: number } // superseded by prompt_preview_copied
  | { name: 'tool_score_searched';      query: string; found: boolean }
  | { name: 'tool_review_submitted';    toolName: string; email?: string }
  | { name: 'tool_detail_cta_click';    toolSlug: string }      // superseded by outbound_tool_click
  | { name: 'tool_detail_training_click'; trainingId: string }
  | { name: 'crosssell_impression';     sourceSection: string; targetSection: string; itemId: string }
  | { name: 'crosssell_click';          sourceSection: string; targetSection: string; itemId: string }
  | { name: 'crosssell_popup_impression'; sourceSection: string; trigger: string; count: number }
  | { name: 'crosssell_popup_click';    sourceSection: string; targetSection: string; itemId: string }
  | { name: 'crosssell_popup_dismissed'; sourceSection: string; trigger: string };

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

export function track(event: SiteEvent): void {
  const { name, ...params } = event;

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }

  // Custom DOM event for Vercel Analytics / other listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('promptly_analytics', { detail: event }));
  }
}
