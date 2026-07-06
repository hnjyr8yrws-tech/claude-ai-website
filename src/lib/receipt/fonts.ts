import { Font } from '@react-pdf/renderer';

let registered = false;

/**
 * Register the self-hosted brand fonts (public/fonts — see its README for
 * licences). Idempotent. Satoshi is pending its PDF-embedding licence check
 * (CR) — receipt body text uses the built-in Helvetica until cleared.
 */
export function registerReceiptFonts(): void {
  if (registered) return;
  registered = true;

  Font.register({
    family: 'Fraunces',
    fonts: [
      { src: '/fonts/Fraunces-Regular.ttf', fontWeight: 400 },
      { src: '/fonts/Fraunces-SemiBold.ttf', fontWeight: 600 },
    ],
  });
  Font.register({ family: 'JetBrains Mono', src: '/fonts/JetBrainsMono-Regular.ttf' });

  // No hyphenation — avoids ugly breaks in tool names and the methodology mark.
  Font.registerHyphenationCallback((word) => [word]);
}

/** Raw hex values for PDF output (CSS variables don't exist in PDF land).
 *  KEEP IN SYNC with src/index.css. */
export const PDF_COLOURS = {
  ink: '#1A1A0E',
  inkMuted: '#6b6760',
  oat: '#F5F2EC',
  groundBlack: '#1E1E1E',
  redaction: '#1E1E1E',
  fog: '#9C9C8A',
  rule: '#E8E4DC',
  lime: '#C8E44A',
  inkAccent: '#46540E',
} as const;
