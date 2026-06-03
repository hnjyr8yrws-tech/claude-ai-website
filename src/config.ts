// src/config.ts
export const config = {
  // Add whatever your app expects (API keys, URLs, etc.)
  // Example for a Claude AI site:
  claudeApiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
  // or whatever variables your code uses
};

/**
 * Premium prompt checkout URL. Empty = the "Buy Premium" button is shown
 * disabled (no checkout wired yet). Set this when the checkout exists.
 */
export const PREMIUM_CHECKOUT_URL = '';

export default config;
