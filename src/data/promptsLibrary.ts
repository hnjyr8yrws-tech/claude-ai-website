/**
 * promptsLibrary.ts — the 600-prompt GetPromptly Prompt Library.
 *
 * Ported into the main Vite site from the standalone Next.js app so the library
 * lives inside the shared site layout (nav + footer). The CSV is the single
 * source of content (`prompts_master.csv`); it is imported raw and parsed once
 * on the client. The quote-aware parser mirrors the Next app's exactly — records
 * are one CSV row per line (no newlines inside quoted fields).
 */

import csvRaw from './prompts_master.csv?raw';

export interface PromptEntry {
  id: string;
  title: string;
  audience: string;
  category: string;        // controlled in the source CSV; filter list is built from data
  subcategory: string;
  keyStage: string;
  subject: string;
  sendTag: string;
  complianceTags: string[];
  access: 'Free' | 'Premium';
  seoKeyword: string;
  prompt: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && !inQuotes) { inQuotes = true; continue; }
    if (char === '"' && inQuotes && line[i + 1] === '"') { current += '"'; i++; continue; }
    if (char === '"' && inQuotes) { inQuotes = false; continue; }
    if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue; }
    current += char;
  }
  result.push(current.trim());
  return result;
}

const KEY_STAGES = ['EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5'];

/**
 * Expand a CSV Key Stage value into the single stages it covers.
 * Ranges are written as "KS1-4" (bare digit end) → normalised to KS4.
 * "KS2-4" → [KS2, KS3, KS4]; "All"/"Any"/empty → every stage.
 */
export function expandKeyStage(ks: string): string[] {
  if (!ks || ks === 'All' || ks === 'Any') return [...KEY_STAGES];
  if (ks === 'School Leader') return ['School Leader'];
  if (ks.includes('-')) {
    const parts = ks.split('-').map((s) => s.trim());
    const start = parts[0];
    const end = /^\d+$/.test(parts[1]) ? `KS${parts[1]}` : parts[1];
    const si = KEY_STAGES.indexOf(start);
    const ei = KEY_STAGES.indexOf(end);
    if (si !== -1 && ei !== -1) return KEY_STAGES.slice(si, ei + 1);
  }
  return [ks];
}

export const KEY_STAGE_OPTIONS = KEY_STAGES;

let cache: PromptEntry[] | null = null;

export function getAllPrompts(): PromptEntry[] {
  if (cache) return cache;
  const lines = csvRaw.split('\n').filter((l) => l.trim());
  cache = lines.slice(1).map((line) => {
    const cols = parseCSVLine(line);
    return {
      id: cols[0] ?? '',
      title: cols[1] ?? '',
      audience: cols[2] ?? '',
      category: cols[3] ?? '',
      subcategory: cols[4] ?? '',
      keyStage: cols[5] ?? '',
      subject: cols[6] ?? '',
      sendTag: cols[7] ?? '',
      complianceTags: (cols[8] ?? '').split(',').map((t) => t.trim()).filter(Boolean),
      access: ((cols[9] ?? 'Free').trim()) as 'Free' | 'Premium',
      seoKeyword: cols[10] ?? '',
      prompt: cols[11] ?? '',
    };
  }).filter((p) => p.id && p.title);
  return cache;
}
