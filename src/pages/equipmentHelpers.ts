/**
 * equipmentHelpers — shared helpers for the equipment sub-pages
 * (category, product, compare, and the per-audience pages).
 *
 * Extracted from the original AIEquipment page so the rebuilt directory stays
 * focused. Colours here are preserved as-is for the sub-pages, which are out of
 * scope for the directory rebuild.
 */

import type { EquipmentCategory, PriceBand } from '../data/equipment';

export const PRICE_ORDER: Record<PriceBand, number> = {
  'Under £50': 0,
  '£50–150':   1,
  '£150–500':  2,
  '£500+':     3,
};

export function badgeStyle(badge: string): { bg: string; color: string } {
  switch (badge) {
    case 'SEND Friendly':    return { bg: 'var(--color-oat)', color: 'var(--color-ink)' };
    case 'UK Specialist':    return { bg: '#f0fdf4', color: '#15803d' };
    case 'Amazon Available': return { bg: '#fff7ed', color: '#c2410c' };
    case 'School Quote':     return { bg: 'var(--color-oat)', color: 'var(--color-ink)' };
    case 'Research Based':   return { bg: '#fef9c3', color: '#854d0e' };
    case 'Needs Review':     return { bg: '#fef3c7', color: '#92400e' };
    default:                 return { bg: '#f3f4f6', color: '#6b7280' };
  }
}

export function reviewBadge(status: string) {
  if (status === 'Reviewed')   return { bg: '#f0fdf4', color: '#15803d', label: 'Reviewed' };
  if (status === 'In Progress') return { bg: '#fef9c3', color: '#854d0e', label: 'In Progress' };
  return { bg: '#fef3c7', color: '#92400e', label: 'Needs Review' };
}

export const CAT_SLUG: Record<string, EquipmentCategory> = {
  'devices':               'Devices',
  'stationery-literacy':   'Stationery & Literacy',
  'robots-coding':         'Robots & Coding',
  'games-cognitive':       'Games & Cognitive',
  'aac-communication':     'AAC & Communication',
  'sensory-regulation':    'Sensory & Regulation',
  'screens-hardware':      'Screens & Classroom Hardware',
  'audio-hearing':         'Audio & Hearing',
  'furniture-environment': 'Furniture & Environment',
  'wearables-safety':      'Wearables & Safety',
};

export function catToSlug(cat: EquipmentCategory): string {
  return Object.entries(CAT_SLUG).find(([, v]) => v === cat)?.[0] ?? cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
