#!/usr/bin/env node
/**
 * Taxonomy drift gate. Validates every tool in src/data/tools.ts against the
 * controlled taxonomy in src/data/taxonomy.ts:
 *   - primaryCategory ∈ TOOL_CATEGORIES
 *   - subcategory ∈ TOOL_SUBCATEGORIES[primaryCategory]
 * Exits 1 (fails the build) if any tool drifts. Run on prebuild.
 */
import fs from 'node:fs';

const tax = fs.readFileSync('src/data/taxonomy.ts', 'utf8');
// TOOL_CATEGORIES
const catBlock = tax.slice(tax.indexOf('TOOL_CATEGORIES = ['), tax.indexOf('] as const;'));
const CATEGORIES = [...catBlock.matchAll(/'([^']+)'/g)].map(m => m[1]);
// TOOL_SUBCATEGORIES: lines like  'Cat': ['a', 'b'],
const subBlock = tax.slice(tax.indexOf('TOOL_SUBCATEGORIES'), tax.indexOf('export function isToolCategory'));
const SUBS = {};
for (const m of subBlock.matchAll(/^\s*'([^']+)':\s*\[([^\]]*)\]/gm)) {
  SUBS[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map(x => x[1]);
}

const src = fs.readFileSync('src/data/tools.ts', 'utf8');
const tools = [...src.matchAll(/name:"([^"]+)",\s*primaryCategory:"([^"]*)",\s*subcategory:"([^"]*)"/g)]
  .map(m => ({ name: m[1], primaryCategory: m[2], subcategory: m[3] }));

const fails = [];
for (const t of tools) {
  if (!CATEGORIES.includes(t.primaryCategory)) fails.push(`${t.name}: invalid category "${t.primaryCategory}"`);
  else if (!(SUBS[t.primaryCategory] || []).includes(t.subcategory))
    fails.push(`${t.name}: subcategory "${t.subcategory}" not allowed under "${t.primaryCategory}"`);
}

console.log(`Taxonomy audit — ${tools.length} tools · ${CATEGORIES.length} categories`);
if (fails.length) {
  console.error(`\n✗ ${fails.length} taxonomy violation(s):`);
  for (const f of fails.slice(0, 30)) console.error('  - ' + f);
  process.exit(1);
}
console.log('✓ Every tool has a valid primaryCategory + controlled subcategory. No drift.');
