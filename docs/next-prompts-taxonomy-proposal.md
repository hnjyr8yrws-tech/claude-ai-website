# Next App (getpromptly) Prompt CSV — Taxonomy Proposal (for review)

Source of truth: `getpromptly/prompts_master.csv` `Category` column (600 prompts). The /prompts page builds the category filter dynamically and uses the value as the `?category=` URL param (so values double as slugs).

## 1. Audit — current categories (28)

| Category | Prompts |
|---|---:|
| Behaviour | 36 |
| Lesson Planning | 30 |
| Assessment | 30 |
| Feedback | 30 |
| Operations & Governance | 30 |
| Revision | 27 |
| Ofsted | 25 |
| School Improvement | 25 |
| Staff Development | 25 |
| Strategy | 25 |
| Wellbeing | 25 |
| Careers | 21 |
| ADHD | 20 |
| Autism | 20 |
| Dyslexia | 20 |
| SEMH | 20 |
| SALT/EAL | 20 |
| GCSE | 20 |
| A-Level | 20 |
| GDPR & Safeguarding | 20 |
| Communications | 20 |
| Homework | 16 |
| SEND Support | 15 |
| School Meetings | 15 |
| Policies | 15 |
| Risk Assessments | 15 |
| Study Skills | 10 |
| Coursework | 5 |

The column is already **consistent** — no casing, whitespace or near-duplicate drift across the 28 values.

## 2. Comparison vs the Vite `PromptCategory` (taxonomy.ts)

The Vite list is **student-study** focused (12): Essay & Writing Support, Maths & Science Support, Exam & Test Preparation, Study Skills & Executive Function, Reading Comprehension & Literacy, Parent & Caregiver Tools, Language Learning & Vocabulary, Creative & Critical Thinking, Project & Assignment Helpers, Teacher Professional Practice, SENCO & SEN Management, School Leadership.

The CSV is a **broad school-wide** set (teaching, leadership, SEND, exams, compliance). **Overlap with the Vite list: none** — they are different products and should NOT share one list. Forcing the CSV into the Vite 12 would discard categories like Ofsted, Behaviour, Operations & Governance, GDPR & Safeguarding.

## 3. Normalisation

No intra-CSV drift to fix. **Decision: lock the existing 28 values** as this app’s own controlled taxonomy (`getpromptly/src/lib/taxonomy.ts`). No values renamed → every `?category=` link / slug preserved, no data or UI change.

## 4. Enforcement

- Typed: `PromptCategory` union in `getpromptly/src/lib/taxonomy.ts`; `PromptEntry.category` typed to it.
- Build gate: `getpromptly/scripts/audit-prompt-categories.mjs` on `prebuild` — fails `next build` if the CSV ever contains a Category outside the list. Currently 600/600 valid.

## 5. Optional future consolidation (NOT applied — needs review + redirects)

Several category values duplicate dedicated columns:
- **SEND types** (ADHD, Autism, Dyslexia, SEMH, SALT/EAL) duplicate the **SEND Tag** column — could fold into `SEND Support`.
- **Exam levels** (GCSE, A-Level, Coursework) overlap the **Key Stage** column — could fold into an exams topic.

Doing so would change ~140 prompts’ `?category=` values, so it needs sign-off + redirect handling. Left as-is for now to preserve slugs.
