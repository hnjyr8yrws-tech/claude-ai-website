# Prompts Taxonomy — Proposal (for review)

**Vite site prompts** (`src/data/prompts.ts`). Already the best-structured of the four: a defined `CATEGORIES` list (12) that the prompt pages read directly.

## Audit / drift found

- **One real drift:** raw prompt data used `cat: 'Math & Science Support'` while the canonical category is `'Maths & Science Support'` (the old `displayCategory()` hack papered over it). **Fixed** — raw values normalised; the route slug stays `maths-science`.
- No other drift: every pack maps to a `CATEGORIES` entry.

## Controlled taxonomy (12 categories)

| Category | Slug | Packs |
|---|---|---:|
| Essay & Writing Support | essay-writing | 8 |
| Maths & Science Support | maths-science | 7 |
| Exam & Test Preparation | exam-preparation | 9 |
| Study Skills & Executive Function | study-skills | 7 |
| Reading Comprehension & Literacy | reading-literacy | 6 |
| Parent & Caregiver Tools | parent-caregiver | 6 |
| Language Learning & Vocabulary | language-vocabulary | 3 |
| Creative & Critical Thinking | creative-thinking | 3 |
| Project & Assignment Helpers | project-helpers | 4 |
| Teacher Professional Practice | teacher-practice | 3 |
| SENCO & SEN Management | senco-management | 1 |
| School Leadership | school-leadership | 2 |

## Enforcement

- Typed: `PromptCategory` union in `src/data/taxonomy.ts`; `PromptPack.category` typed to it.
- Build gate: `scripts/audit-prompts.mjs` (runs on prebuild) fails if any pack/CATEGORIES entry leaves the controlled list.

> Note: the separate Next.js app (`getpromptly/prompts_master.csv`) is a different prompt system with its own free-text `Category` column — not covered here. Flag if you want the same treatment applied there.
