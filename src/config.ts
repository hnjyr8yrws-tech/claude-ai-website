// src/config.ts
//
// PUBLIC, client-side config ONLY. Never put secrets or API keys here — anything
// bundled by Vite (especially VITE_-prefixed env vars) ships to the browser in
// plain text. The browser must hold NO model API key.

/**
 * Luna chat endpoint — our OWN same-origin serverless function (api/luna.ts).
 *
 * Browser → /api/luna → (server adds the X-Luna-Secret header) → n8n webhook,
 * which runs Luna AND the Donna safety gate, then returns the gated answer.
 *
 * The browser NEVER talks to n8n/Tailscale directly, holds NO model API key, and
 * holds NO shared secret. The secret lives only in the Vercel server-side env var
 * LUNA_WEBHOOK_SECRET (see api/luna.ts) — never bundled to the client.
 */
export const LUNA_WEBHOOK_URL: string = import.meta.env.VITE_LUNA_WEBHOOK_URL ?? '/api/luna';

/**
 * Premium prompt checkout URL. Empty = the "Buy Premium" button is shown
 * disabled (no checkout wired yet). Set this when the checkout exists.
 */
export const PREMIUM_CHECKOUT_URL = '';

// No secrets in this object — kept for any legacy `import config` references.
export const config = {};

export default config;
