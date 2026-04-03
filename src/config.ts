// src/config.ts
export const config = {
  // Add whatever your app expects (API keys, URLs, etc.)
  // Example for a Claude AI site:
  claudeApiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
  // or whatever variables your code uses
};

export default config;
