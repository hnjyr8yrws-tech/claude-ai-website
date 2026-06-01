/**
 * icons.tsx — the editorial icon system (Brand Bible §12).
 *
 * Single-stroke outline icons from lucide-react — a publication weight, not the
 * "AI platform" look. Replaces the retired emoji / dot-scatter / ambient-orb
 * motifs. Outline only, 1.5px stroke, round caps/joins, no fill/shadow/gradient.
 *
 * Usage: icons always accompany a text label (never standalone at this scale);
 * pass `size` 20 in tiles/chips, 24 in section headers; colour via `color`.
 */

import {
  GraduationCap, HeartHandshake, Building2, Monitor, Briefcase, Scale,
  Home, Pencil, Award, ClipboardList,
  Cpu, BookOpen, MessageSquare, Shield, Accessibility, Lock, Users, Eye, Layers,
  type LucideIcon,
} from 'lucide-react';

// ── Role → icon (Brand Bible role list) ─────────────────────────────────────────
const ROLE_ICONS: Record<string, LucideIcon> = {
  teacher:         GraduationCap,
  senco:           HeartHandshake,
  'school-leader': Building2,
  leaders:         Building2,
  leader:          Building2,
  it:              Monitor,
  sbm:             Briefcase,
  'business-manager': Briefcase,
  governors:       Scale,
  parent:          Home,
  student:         Pencil,
  cpd:             Award,
  admin:           ClipboardList,
};

// ── Category / pillar → icon ────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  tools:         Cpu,
  equipment:     Monitor,
  training:      BookOpen,
  prompts:       MessageSquare,
  safeguarding:  Shield,
  accessibility: Accessibility,
  send:          Accessibility,
  privacy:       Lock,
  age:           Users,
  transparency:  Eye,
  collections:   Layers,
};

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  /** Optional strokeWidth override (default 1.5 per §12). */
  strokeWidth?: number;
}

/** Render a role icon by key. Returns null if the key is unknown. */
export function RoleIcon({ name, size = 20, color = '#1E1E1E', strokeWidth = 1.5, className }: IconProps & { name: string }) {
  const Icon = ROLE_ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

/** Render a category/pillar icon by key. Returns null if the key is unknown. */
export function CategoryIcon({ name, size = 20, color = '#1E1E1E', strokeWidth = 1.5, className }: IconProps & { name: string }) {
  const Icon = CATEGORY_ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
