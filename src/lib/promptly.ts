/**
 * Promptly palette tokens — mirrors CSS variables in src/index.css.
 * Import these in any TSX page that needs colour values inline.
 */

export const PROMPTLY = {
  DARK: '#0F1C1A',
  DARK_2: '#142522',
  DARK_3: '#1B302C',
  LIME: '#BEFF00',
  LIME_SOFT: 'rgba(190,255,0,0.14)',
  CYAN: '#00D1FF',
  CYAN_SOFT: 'rgba(0,209,255,0.14)',
  CREAM: '#F8F5F0',
  WHITE: '#FFFFFF',
  INK: '#1A1A1A',
  INK_SOFT: '#4A4A4A',
  PURPLE: '#7C3AED',
  PURPLE_LIGHT: '#A78BFA',
  PURPLE_SOFT: 'rgba(124,58,237,0.14)',
  YELLOW: '#FFEA00',
  BORDER_LIGHT: '#ECE7DD',
  BORDER_DARK: 'rgba(255,255,255,0.10)',
  TEXT_DIM: 'rgba(255,255,255,0.55)',
  TEXT_FAINT: 'rgba(255,255,255,0.32)',
} as const;

// Spread-friendly named exports
export const {
  DARK, DARK_2, DARK_3, LIME, LIME_SOFT, CYAN, CYAN_SOFT, CREAM, WHITE,
  INK, INK_SOFT, PURPLE, PURPLE_LIGHT, PURPLE_SOFT, YELLOW,
  BORDER_LIGHT, BORDER_DARK, TEXT_DIM, TEXT_FAINT,
} = PROMPTLY;
