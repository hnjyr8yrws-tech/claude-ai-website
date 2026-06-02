#!/usr/bin/env node
/** Prompt taxonomy drift gate. Every prompt-pack category (raw `cat:` and explicit
 *  pack `category:`) and every CATEGORIES entry must be in PROMPT_CATEGORIES
 *  (src/data/taxonomy.ts). Exits 1 on drift. Run on prebuild. */
import fs from 'node:fs';
const tax = fs.readFileSync('src/data/taxonomy.ts', 'utf8');
const block = tax.slice(tax.indexOf('PROMPT_CATEGORIES = ['), tax.indexOf('] as const;\nexport type PromptCategory'));
const CATS = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);

const src = fs.readFileSync('src/data/prompts.ts', 'utf8');
// raw `cat: '...'`, explicit pack `category: '...'`, and the CATEGORIES list `name: '...'`
const values = [
  ...[...src.matchAll(/\bcat:\s*'([^']+)'/g)].map(m => m[1]),
  ...[...src.matchAll(/\bcategory:\s*'([^']+)'/g)].map(m => m[1]),
];
const catNames = [...src.matchAll(/name:\s*'([^']+)',\s*\n\s*slug:/g)].map(m => m[1]);
const bad = [...new Set([...values, ...catNames].filter(c => !CATS.includes(c)))];
console.log(`Prompt taxonomy — ${values.length} pack categories · ${CATS.length} categories`);
if (bad.length) {
  console.error(`\n✗ ${bad.length} category value(s) not in the controlled taxonomy:`);
  for (const b of bad) console.error('  - ' + b);
  process.exit(1);
}
console.log('✓ Every prompt pack + CATEGORIES entry uses a controlled category. No drift.');
