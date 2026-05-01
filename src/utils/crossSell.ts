/**
 * Cross-sell recommendation engine for GetPromptly.
 *
 * Takes a user context (what they're looking at) and returns
 * contextually relevant next-step recommendations from other sections.
 */

import { PROMPT_PACKS, type PromptPack } from '../data/prompts';
import { TRAINING, type TrainingItem } from '../data/training';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CrossSellSection = 'tools' | 'prompts' | 'training' | 'equipment';

export interface CrossSellItem {
  id: string;
  section: CrossSellSection;
  title: string;
  description: string;
  badge?: string;
  href: string;
  cta: string;
}

export interface CrossSellContext {
  /** Current section the user is in */
  currentSection: CrossSellSection;
  /** Tool name, prompt pack title, training name, or equipment name */
  itemName?: string;
  /** Category/type of the current item */
  category?: string;
  /** Roles associated (Teacher, SENCO, Parent, Student, etc.) */
  roles?: string[];
  /** SEN focus areas */
  senFocus?: string[];
  /** Tool names (for prompt compatibility) */
  tools?: string[];
}

// ─── Matching helpers ─────────────────────────────────────────────────────────

function matchesAny(haystack: string[], needles: string[]): boolean {
  const lower = needles.map(n => n.toLowerCase());
  return haystack.some(h => lower.includes(h.toLowerCase()));
}

function isSEND(ctx: CrossSellContext): boolean {
  if (ctx.category?.toLowerCase().includes('send')) return true;
  if (ctx.senFocus && ctx.senFocus.length > 0 && ctx.senFocus[0] !== 'None') return true;
  if (ctx.roles && matchesAny(ctx.roles, ['SENCO', 'SEND Lead'])) return true;
  return false;
}

function isParent(ctx: CrossSellContext): boolean {
  return ctx.roles?.some(r => r.toLowerCase() === 'parent' || r.toLowerCase() === 'parents') ?? false;
}

function isSchoolLeader(ctx: CrossSellContext): boolean {
  return ctx.roles?.some(r => ['SLT', 'Schools', 'Admin'].includes(r)) ?? false;
}

// ─── Prompt pack recommender ──────────────────────────────────────────────────

function findPromptPacks(ctx: CrossSellContext, limit = 2): CrossSellItem[] {
  let matches: PromptPack[] = [];

  // 1. Match by tool name (e.g. user is looking at Claude → show Claude-ready packs)
  if (ctx.tools && ctx.tools.length > 0) {
    matches = PROMPT_PACKS.filter(p =>
      p.prompts.some(pr => pr.tools.some(t => ctx.tools!.some(ct => t.toLowerCase().includes(ct.toLowerCase()))))
    );
  }

  // 2. Match by role
  if (matches.length < limit && ctx.roles) {
    const roleMatches = PROMPT_PACKS.filter(p =>
      matchesAny(p.roles, ctx.roles!) && !matches.some(m => m.id === p.id)
    );
    matches = [...matches, ...roleMatches];
  }

  // 3. Match by SEN focus
  if (matches.length < limit && isSEND(ctx)) {
    const senMatches = PROMPT_PACKS.filter(p =>
      p.senFocus.some(s => s !== 'None') && !matches.some(m => m.id === p.id)
    );
    matches = [...matches, ...senMatches];
  }

  // Prefer featured packs
  matches.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return matches.slice(0, limit).map(p => ({
    id: `prompt-${p.slug}`,
    section: 'prompts',
    title: p.title,
    description: p.description.slice(0, 100) + (p.description.length > 100 ? '…' : ''),
    badge: p.free ? 'Free' : `${p.promptCount} prompts`,
    href: `/prompts/pack/${p.slug}`,
    cta: 'View prompts →',
  }));
}

// ─── Training recommender ─────────────────────────────────────────────────────

function findTraining(ctx: CrossSellContext, limit = 2): CrossSellItem[] {
  let matches: TrainingItem[] = [];

  // Match by audience
  if (isParent(ctx)) {
    matches = TRAINING.filter(t => t.audience.toLowerCase().includes('parent'));
  } else if (isSEND(ctx)) {
    matches = TRAINING.filter(t =>
      t.category.toLowerCase().includes('send') ||
      t.tags.some(tag => tag.toLowerCase().includes('send') || tag.toLowerCase().includes('senco'))
    );
  } else if (isSchoolLeader(ctx)) {
    matches = TRAINING.filter(t =>
      t.audience.toLowerCase().includes('leader') || t.category.toLowerCase().includes('leader')
    );
  } else {
    matches = TRAINING.filter(t =>
      t.audience.toLowerCase().includes('teacher') || t.audience === 'Adults'
    );
  }

  // Prefer free, UK-relevant, certified
  matches.sort((a, b) => {
    let sa = 0, sb = 0;
    if (a.type === 'Free') sa += 3;
    if (b.type === 'Free') sb += 3;
    if (a.ukRelevant) sa += 2;
    if (b.ukRelevant) sb += 2;
    if (a.certificate) sa += 1;
    if (b.certificate) sb += 1;
    return sb - sa;
  });

  return matches.slice(0, limit).map(t => ({
    id: `training-${t.slug}`,
    section: 'training',
    title: t.name,
    description: t.notes.slice(0, 100) + (t.notes.length > 100 ? '…' : ''),
    badge: t.type === 'Free' ? 'Free' : t.cost,
    href: '/ai-training',
    cta: 'Start learning →',
  }));
}

// ─── Tool-specific cross-sell text ────────────────────────────────────────────

const TOOL_CROSSSELL_OVERRIDES: Record<string, { title: string; desc: string }> = {
  'claude':    { title: 'Get Claude-ready teacher prompts', desc: 'Copy-and-paste prompts designed to work perfectly with Claude for lesson planning, feedback and differentiation.' },
  'chatgpt':   { title: 'Get ChatGPT-ready teacher prompts', desc: 'Prompts engineered for ChatGPT — covering planning, marking, SEND support and parent communication.' },
  'gemini':    { title: 'Get Gemini-ready prompts for Google schools', desc: 'Prompts that work natively with Google Gemini for schools using Google Workspace.' },
  'canva':     { title: 'Design with AI — creative prompts', desc: 'Prompts for AI-powered design tasks: classroom posters, presentations and visual resources.' },
};

// ─── Main recommendation function ─────────────────────────────────────────────

export function getRecommendations(ctx: CrossSellContext, limit = 3): CrossSellItem[] {
  const items: CrossSellItem[] = [];
  const toolLower = ctx.itemName?.toLowerCase() ?? '';

  // Tool-specific overrides
  const override = Object.entries(TOOL_CROSSSELL_OVERRIDES).find(([key]) => toolLower.includes(key));
  if (override && ctx.currentSection === 'tools') {
    items.push({
      id: `override-${override[0]}`,
      section: 'prompts',
      title: override[1].title,
      description: override[1].desc,
      badge: 'Recommended',
      href: '/prompts',
      cta: 'Browse prompts →',
    });
  }

  // SEND-specific cross-sells
  if (isSEND(ctx) && ctx.currentSection !== 'equipment') {
    items.push({
      id: 'send-equipment',
      section: 'equipment',
      title: 'See SEND equipment & assistive tech',
      description: 'Browse AAC devices, literacy tools, sensory equipment and more — curated for UK SEND provision.',
      badge: 'SEND',
      href: '/ai-equipment/send',
      cta: 'Browse SEND equipment →',
    });
  }

  if (isSEND(ctx) && ctx.currentSection !== 'prompts') {
    items.push({
      id: 'send-prompts',
      section: 'prompts',
      title: 'SENCO prompt packs',
      description: 'EHCP reviews, provision mapping, parent meetings and differentiation prompts designed for SENCOs.',
      badge: 'SENCO',
      href: '/prompts/senco',
      cta: 'View SENCO prompts →',
    });
  }

  // Parent cross-sells
  if (isParent(ctx) && ctx.currentSection === 'training') {
    items.push({
      id: 'parent-safety-pathway',
      section: 'training',
      title: 'Send me the AI safety for parents pathway',
      description: 'A curated learning path covering AI safety, parental controls and supporting your child with AI tools at home.',
      badge: 'Pathway',
      href: '/ai-training',
      cta: 'View pathway →',
    });
  }

  // School leader cross-sells
  if (isSchoolLeader(ctx) && ctx.currentSection === 'tools') {
    items.push({
      id: 'school-compare',
      section: 'tools',
      title: 'Compare safer school-ready alternatives',
      description: 'See side-by-side safety scores and find Trusted-tier tools for whole-school deployment.',
      href: '/tools',
      cta: 'Compare tools →',
    });
  }

  // Cross-section recommendations (don't recommend current section)
  if (ctx.currentSection !== 'prompts' && items.length < limit) {
    items.push(...findPromptPacks(ctx, Math.min(2, limit - items.length)));
  }
  if (ctx.currentSection !== 'training' && items.length < limit) {
    items.push(...findTraining(ctx, Math.min(1, limit - items.length)));
  }

  // Deduplicate by id
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).slice(0, limit);
}

// ─── High-intent triggers ─────────────────────────────────────────────────────

export type HighIntentAction =
  | 'try_demo_clicked'
  | 'tool_shortlisted'
  | 'prompt_pack_viewed_2plus'
  | 'prompt_copied'
  | 'dwell_45s';

export function shouldShowPopup(action: HighIntentAction): boolean {
  // Check session flag
  const key = 'promptly_crosssell_shown';
  try {
    if (sessionStorage.getItem(key)) return false;
  } catch { /* SSR safety */ }
  return true;
}

export function markPopupShown(): void {
  try {
    sessionStorage.setItem('promptly_crosssell_shown', '1');
  } catch { /* SSR safety */ }
}

export function resetPopupFlag(): void {
  try {
    sessionStorage.removeItem('promptly_crosssell_shown');
  } catch { /* SSR safety */ }
}
