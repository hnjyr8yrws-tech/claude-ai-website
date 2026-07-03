// ⚠️ SAMPLE DATA — DEVELOPMENT ONLY. NOT reviewed or published evidence.
//
// Illustrative per-pillar evidence for a single demo tool so the Interactive
// Pillar Card's expand panel can be seen and tested before real PillarEvidence
// data exists. Do NOT treat this as published evidence. Remove or replace with
// real reviewed data (ideally sourced from the trust dataset) before relying on it.

import type { PillarEvidenceDetail } from '@/components/trust/EvidenceConfidence';
import type { PillarScores } from '@/components/trust/PillarCard';

type ToolEvidence = Partial<Record<keyof PillarScores, PillarEvidenceDetail>>;

export const SAMPLE_TOOL_EVIDENCE: Record<string, ToolEvidence> = {
  // MagicSchool.ai — SAMPLE ONLY (illustrative, not published evidence).
  'magicschool-ai': {
    dataPrivacy: {
      evidence:
        'US-hosted with a DPA available on request; verify sub-processors and data residency before a school-wide rollout.',
      confidence: 3,
      reviewDepth: 'standard',
      citation: { label: 'Provider privacy policy', href: 'https://www.magicschool.ai/privacy' },
    },
    safeguarding: {
      evidence: 'Teacher-first design with safeguarding controls; no pupil accounts by default.',
      confidence: 4,
      reviewDepth: 'standard',
    },
    ageSuitability: {
      evidence: 'Intended for teacher use; generated outputs should be reviewed before any pupil-facing use.',
      confidence: 3,
      reviewDepth: 'surface',
    },
    transparency: {
      evidence: 'Clear feature documentation and a public changelog.',
      confidence: 4,
      reviewDepth: 'standard',
    },
    accessibility: {
      evidence: 'Reading-level adjustment and translation support aid differentiation for EAL and SEND.',
      confidence: 4,
      reviewDepth: 'standard',
    },
  },
};
