#!/usr/bin/env node
/** CSV category drift gate for the getpromptly prompt library.
 *  Every `Category` value in prompts_master.csv must be in PROMPT_CATEGORIES
 *  (src/lib/taxonomy.ts). Exits 1 (fails the build) on drift. Run on prebuild. */
import fs from 'node:fs';

const tax = fs.readFileSync('src/lib/taxonomy.ts', 'utf8');
const block = tax.slice(tax.indexOf('PROMPT_CATEGORIES = ['), tax.indexOf('] as const;'));
const CATS = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);

function parseLine(line) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && !q) { q = true; continue; }
    if (c === '"' && q && line[i + 1] === '"') { cur += '"'; i++; continue; }
    if (c === '"' && q) { q = false; continue; }
    if (c === ',' && !q) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

const lines = fs.readFileSync('prompts_master.csv', 'utf8').split('\n').filter(l => l.trim());
const ci = parseLine(lines[0]).indexOf('Category');
const counts = {};
const bad = {};
for (const l of lines.slice(1)) {
  const cat = (parseLine(l)[ci] || '').trim();
  if (!cat) continue;
  counts[cat] = (counts[cat] || 0) + 1;
  if (!CATS.includes(cat)) bad[cat] = (bad[cat] || 0) + 1;
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`Prompt CSV taxonomy — ${total} prompts · ${Object.keys(counts).length} categories used · ${CATS.length} allowed`);
const badKeys = Object.keys(bad);
if (badKeys.length) {
  console.error(`\n✗ ${badKeys.length} category value(s) not in the controlled taxonomy:`);
  for (const k of badKeys) console.error(`  - "${k}" (${bad[k]} prompt(s))`);
  process.exit(1);
}
console.log('✓ Every CSV Category is in the controlled taxonomy. No drift.');
