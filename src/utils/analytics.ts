/**
 * Site-wide analytics event helper.
 * Fires to GA4 (gtag) and a custom DOM event for Vercel Analytics or other listeners.
 */

export type SiteEvent =
  | { name: 'page_view'; path: string }
  | { name: 'cta_clicked'; section: string; label: string }
  | { name: 'search_performed'; section: string; query: string }
  | { name: 'filter_applied'; section: string; filter: string; value: string }
  | { name: 'tool_viewed'; tool: string }
  | { name: 'equipment_viewed'; product: string }
  | { name: 'training_viewed'; course: string }
  | { name: 'prompt_viewed'; prompt: string }
  | { name: 'prompt_copied'; packId: string }
  | { name: 'comparison_started'; items: string }
  | { name: 'comparison_completed'; items: string }
  | { name: 'agent_opened'; section: string }
  | { name: 'recommendation_clicked'; type: string }
  | { name: 'quote_cta_clicked'; section: string }
  | { name: 'email_capture_submitted'; section: string };

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
