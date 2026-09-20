/**
 * taxonomy.ts — the SINGLE SOURCE OF TRUTH for the AI-tools taxonomy.
 *
 * Every tool has exactly one `primaryCategory` (from TOOL_CATEGORIES) and one
 * `subcategory` drawn ONLY from that category's controlled list (TOOL_SUBCATEGORIES).
 * No free-text categories or subcategories. The build-time audit (scripts/audit-
 * taxonomy.mjs, run on prebuild) fails if any tool drifts outside this list.
 *
 * Professional Development is intentionally NOT here — CPD/courses live in training.ts.
 */

export const TOOL_CATEGORIES = [
  'Teaching & Learning',
  'Lesson Planning',
  'Assessment & Feedback',
  'SEND & Inclusion',
  'Classroom Management',
  'Pastoral, Behaviour & Wellbeing',
  'Parent Communication',
  'School Leadership',
  'Administration & Operations',
  'Safeguarding & Compliance',
  'Curriculum & Content Creation',
  'Student Study Tools',
  'Teacher Productivity',
  'AI Detection & Academic Integrity',
  'Computing & Coding',
  'Research & Data Analysis',
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

// Controlled subcategories — one layer, fixed per category. First entry is the
// category's default (used when a tool doesn't match a more specific subcategory).
export const TOOL_SUBCATEGORIES: Record<ToolCategory, readonly string[]> = {
  'Teaching & Learning': ['General Teaching', 'Differentiation', 'Tutoring & Explanation', 'Interactive Lessons'],
  'Lesson Planning': ['Lesson Plans', 'Schemes of Work', 'UK Curriculum Planning', 'Resource Planning'],
  'Assessment & Feedback': ['Marking & Grading', 'Feedback Generation', 'Quizzes & Questioning', 'Rubrics & Criteria', 'Progress Tracking'],
  'SEND & Inclusion': ['Accessibility & Assistive Tech', 'AAC & Communication', 'Reading & Literacy Support', 'Executive Function & ADHD', 'Speech & Language'],
  'Classroom Management': ['Engagement & Polling', 'Gamification', 'Classroom Orchestration'],
  'Pastoral, Behaviour & Wellbeing': ['Wellbeing & Mental Health', 'Behaviour Support', 'Pastoral & Mentoring'],
  'Parent Communication': ['Parent Messaging', 'Reports & Updates', 'Translation', 'Home Learning Support'],
  'School Leadership': ['Strategy & Improvement', 'Policy & Governance', 'AI Adoption & Implementation', 'Governors & MAT', 'Ofsted & Inspection'],
  'Administration & Operations': ['Admin Automation', 'MIS', 'Timetabling', 'Finance & HR', 'Attendance & Reporting'],
  'Safeguarding & Compliance': ['Online Monitoring & Filtering', 'KCSIE & Child Protection', 'Data Protection & GDPR'],
  'Curriculum & Content Creation': ['Worksheets & Resources', 'Presentations & Slides', 'Image & Design', 'Video & Audio', 'Writing & Text Generation'],
  'Student Study Tools': ['Tutoring & Homework Help', 'Revision & Exam Prep', 'Writing Support', 'Maths & Science', 'Reading & Literacy', 'Notes & Flashcards'],
  'Teacher Productivity': ['General AI Assistant', 'Email & Communication', 'Notes & Transcription', 'Automation & Workflow'],
  'AI Detection & Academic Integrity': ['AI Detection', 'Plagiarism Detection', 'Integrity & Policy'],
  'Computing & Coding': ['Coding & Programming', 'Robotics', 'Computer Science'],
  'Research & Data Analysis': ['Literature & Citations', 'Data Analysis', 'School Data Insights'],
};

// ─── Capabilities (ORTHOGONAL axis) ─────────────────────────────────────────────
/**
 * Capabilities describe WHAT A TOOL CAN DO, independently of where it sits in the
 * category tree. A tool has exactly one category + subcategory (the navigation
 * spine, unchanged) and zero or more capabilities.
 *
 * This axis exists so newly verified coverage — EHCP drafting, Early Years, Local
 * Authority, procurement, assistive technology — becomes findable WITHOUT adding
 * near-duplicate categories or duplicate listings. Phase 1B found that hearing
 * support, executive function and school administration were largely
 * DISCOVERABILITY problems: the tools were already listed, nothing surfaced them.
 *
 * Controlled, like everything else here. No free text. The prebuild audit rejects
 * any capability not in this list.
 */
export const TOOL_CAPABILITIES = [
  // SEND / statutory
  'EHCP',
  'SEND Administration',
  'Annual Reviews',
  // Assistive
  'Assistive Technology',
  'Braille / Tactile',
  'Speech-to-Text',
  'Text-to-Speech',
  'AAC',
  'Executive Function',
  'Reading Support',
  // Teaching & assessment
  'AI Tutoring',
  'Spoken AI Tutor',
  'Assessment / Marking',
  'Differentiation',
  'Source Grounding',
  // Safeguarding & governance
  'Filtering & Monitoring',
  'Human Safeguarding Review',
  'Human Oversight',
  'AI Governance',
  'AI Literacy',
  // Audience / sector
  'Early Years / EYFS',
  'Local Authority / Council',
  'MAT',
  'Procurement / Bid Writing',
  'Parent Communication',
  'School Administration',
  // Data
  'Data Analytics',
  'Multilingual',
] as const;

export type ToolCapability = (typeof TOOL_CAPABILITIES)[number];

export function isToolCapability(v: string): v is ToolCapability {
  return (TOOL_CAPABILITIES as readonly string[]).includes(v);
}

export function isToolCategory(v: string): v is ToolCategory {
  return (TOOL_CATEGORIES as readonly string[]).includes(v);
}

// ─── Training taxonomy (topic axis; audience + Free/Paid are separate fields) ────
export const TRAINING_CATEGORIES = [
  'AI Foundations & Literacy',
  'Teaching with AI',
  'Prompt Engineering',
  'Assessment with AI',
  'SEND & Inclusion',
  'Leadership & Strategy',
  'Safeguarding & Online Safety',
  'Data Protection & Compliance',
  'Productivity & Administration',
  'AI for Students',
  'AI for Parents & Families',
] as const;
export type TrainingCategory = (typeof TRAINING_CATEGORIES)[number];
export function isTrainingCategory(v: string): v is TrainingCategory {
  return (TRAINING_CATEGORIES as readonly string[]).includes(v);
}

// ─── Prompt taxonomy (mirrors the CATEGORIES list in data/prompts.ts) ───────────
export const PROMPT_CATEGORIES = [
  'Essay & Writing Support',
  'Maths & Science Support',
  'Exam & Test Preparation',
  'Study Skills & Executive Function',
  'Reading Comprehension & Literacy',
  'Parent & Caregiver Tools',
  'Language Learning & Vocabulary',
  'Creative & Critical Thinking',
  'Project & Assignment Helpers',
  'Teacher Professional Practice',
  'SENCO & SEN Management',
  'School Leadership',
] as const;
export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];
export function isPromptCategory(v: string): v is PromptCategory {
  return (PROMPT_CATEGORIES as readonly string[]).includes(v);
}

/** True if (category, subcategory) is a valid, controlled pairing. */
export function isValidTaxonomy(category: string, subcategory: string): boolean {
  return isToolCategory(category) && TOOL_SUBCATEGORIES[category].includes(subcategory);
}
