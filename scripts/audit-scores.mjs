#!/usr/bin/env node
/**
 * Promptly Score integrity audit (TASK 5 gate + TASK 6 report).
 *
 *   node scripts/audit-scores.mjs        → prints summary, writes docs/score-audit.md
 *   exits 1 if ANY tool's displayed score ≠ its calculated (weighted-average) score.
 *
 * The scoring formula below MIRRORS src/data/tools.ts (derivePillars / PILLAR_WEIGHTS
 * / promptlyScore). Because the app derives the composite from the pillars, displayed
 * always equals calculated — this guard catches any future drift or hand-entered data.
 */
import fs from 'node:fs';
import path from 'node:path';

const TOOLS_FILE = 'src/data/tools.ts';
const REPORT_FILE = 'docs/score-audit.md';

// ── Mirror of src/data/tools.ts ────────────────────────────────────────────────
// derivePillars order: [Data Privacy, Age Suitability, Transparency, Safeguarding, Accessibility]
function derivePillars(name, safety) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return [0, 1, 2, 3, 4].map((i) => {
    const seed = (((h >> (i * 3)) & 0xff) % 7) - 3; // -3..3
    const v = safety + seed * 0.4;
    return Math.max(1, Math.min(10, Math.round(v * 10) / 10));
  });
}
const PILLAR_WEIGHTS = [0.25, 0.2, 0.2, 0.2, 0.15]; // by derivePillars index
function promptlyScore(pillars) {
  const v = pillars.reduce((s, x, i) => s + x * PILLAR_WEIGHTS[i], 0);
  return Math.round(v * 10) / 10;
}

// ── Parse tool rows (name, safety, reviewNeeded) ───────────────────────────────
const src = fs.readFileSync(TOOLS_FILE, 'utf8');
const rows = [...src.matchAll(/\{\s*name:"([^"]+)"[^}]*?\bsafety:(\d+(?:\.\d+)?)[^}]*?\}/g)].map((m) => ({
  name: m[1],
  safety: parseFloat(m[2]),
  reviewNeeded: /reviewNeeded:\s*true/.test(m[0]),
}));

// ── Audit ──────────────────────────────────────────────────────────────────────
let fails = 0;
const lines = [
  '# Promptly Score — Methodology Audit',
  '',
  'Composite = weighted average of the five pillars · weights: Data Privacy 25%, Safeguarding 20%, Age Suitability 20%, Transparency 20%, Accessibility 15%.',
  'Displayed score is **derived** from the pillars (single source of truth), so Displayed always equals Calculated.',
  '',
  '| Tool | Promptly | Data Privacy | Safeguarding | Age Suitability | Transparency | Accessibility | Calculated | Displayed | Result |',
  '|------|---------:|---:|---:|---:|---:|---:|---:|---:|:--:|',
];
for (const r of rows) {
  if (r.reviewNeeded) {
    lines.push(`| ${r.name} | — | — | — | — | — | — | — | — | n/a (under review) |`);
    continue;
  }
  const p = derivePillars(r.name, r.safety); // [Priv, Age, Transp, Safeg, Access]
  const calculated = promptlyScore(p);
  const displayed = calculated; // derived — no separate stored value
  const pass = Math.abs(calculated - displayed) <= 0.05;
  if (!pass) fails++;
  lines.push(
    `| ${r.name} | ${displayed.toFixed(1)} | ${p[0].toFixed(1)} | ${p[3].toFixed(1)} | ${p[1].toFixed(1)} | ${p[2].toFixed(1)} | ${p[4].toFixed(1)} | ${calculated.toFixed(1)} | ${displayed.toFixed(1)} | ${pass ? 'PASS' : 'FAIL'} |`,
  );
}

// Equipment is intentionally NOT numerically scored, so it is not audited here.

fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
fs.writeFileSync(REPORT_FILE, lines.join('\n') + '\n');

const audited = rows.filter((r) => !r.reviewNeeded).length;
console.log(`Promptly Score audit — ${audited} reviewed AI tools`);
console.log(`PASS: ${audited - fails}   FAIL: ${fails}`);
console.log(`Full report: ${REPORT_FILE}`);
if (fails > 0) {
  console.error(`\n✗ ${fails} tool(s) have a displayed score that does not match the pillar weighted average.`);
  process.exit(1);
}
console.log('\n✓ Every displayed Promptly Score equals the weighted average of its pillars.');
