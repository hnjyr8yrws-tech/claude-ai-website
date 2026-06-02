// taxonomy.ts — controlled category taxonomy for the getpromptly prompt library.
//
// SOURCE OF TRUTH for the `Category` column in prompts_master.csv. The /prompts
// page builds its category filter dynamically from the data, and the value is used
// directly as the `?category=` URL param — so these strings are also the slugs and
// must not be renamed without a redirect plan.
//
// NOTE: this is a SEPARATE, broader school-wide taxonomy from the Vite site's
// student-study PromptCategory (src/data/taxonomy.ts in the parent app). They are
// different products and intentionally do not share a list.
//
// The build gate (scripts/audit-prompt-categories.mjs, run on prebuild) fails if
// the CSV ever contains a Category outside this list.

export const PROMPT_CATEGORIES = [
  // Teaching & learning
  'Lesson Planning',
  'Assessment',
  'Feedback',
  'Homework',
  'Study Skills',
  'Revision',
  'Communications',
  // Exams & qualifications
  'GCSE',
  'A-Level',
  'Coursework',
  'Careers',
  // Pastoral & behaviour
  'Behaviour',
  'Wellbeing',
  // SEND
  'SEND Support',
  'ADHD',
  'Autism',
  'Dyslexia',
  'SEMH',
  'SALT/EAL',
  // Leadership & operations
  'Strategy',
  'School Improvement',
  'Staff Development',
  'Operations & Governance',
  'School Meetings',
  'Ofsted',
  // Compliance
  'Policies',
  'Risk Assessments',
  'GDPR & Safeguarding',
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export function isPromptCategory(v: string): v is PromptCategory {
  return (PROMPT_CATEGORIES as readonly string[]).includes(v);
}
