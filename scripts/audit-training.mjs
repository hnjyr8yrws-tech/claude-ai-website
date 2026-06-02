#!/usr/bin/env node
/** Training taxonomy drift gate. Every training item's category must be in
 *  TRAINING_CATEGORIES (src/data/taxonomy.ts). Exits 1 on drift. Run on prebuild. */
import fs from 'node:fs';
const tax = fs.readFileSync('src/data/taxonomy.ts', 'utf8');
const block = tax.slice(tax.indexOf('TRAINING_CATEGORIES = ['), tax.indexOf('] as const;\nexport type TrainingCategory'));
const CATS = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
const src = fs.readFileSync('src/data/training.ts', 'utf8');
const used = [...src.matchAll(/\bcategory:\s*'([^']+)'/g)].map(m => m[1]);
const bad = [...new Set(used.filter(c => !CATS.includes(c)))];
console.log(`Training taxonomy — ${used.length} items · ${CATS.length} categories`);
if (bad.length) {
  console.error(`\n✗ ${bad.length} category value(s) not in the controlled taxonomy:`);
  for (const b of bad) console.error('  - ' + b);
  process.exit(1);
}
console.log('✓ Every training item uses a controlled category. No drift.');
