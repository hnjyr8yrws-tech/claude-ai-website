// Per-tool PillarEvidence for the Interactive Pillar Card's expand panel, keyed by
// tool slug. Currently empty — no invented evidence ships. Tools without an entry
// fall back to a "see methodology" panel (see EvidenceConfidence). Populate with
// real reviewed evidence when it exists.

import type { PillarEvidenceDetail } from '@/components/trust/EvidenceConfidence';
import type { PillarScores } from '@/components/trust/PillarCard';

type ToolEvidence = Partial<Record<keyof PillarScores, PillarEvidenceDetail>>;

export const SAMPLE_TOOL_EVIDENCE: Record<string, ToolEvidence> = {};
