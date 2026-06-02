# GetPromptly — Platform Inventory Report

Generated from the controlled taxonomies in `src/data/*` and `getpromptly/prompts_master.csv`.

**Headline:** 242 reviewed tools · 96 equipment products · 76 training providers · 660+ prompts (600 in the Next app + 60 packs / ~484 individual prompts on the Vite site).

---

## TOOLS
**Total tools: 242** · 16 controlled categories (`src/data/taxonomy.ts`)

| Category | Tools |
|---|---:|
| Student Study Tools | 41 |
| SEND & Inclusion | 37 |
| Curriculum & Content Creation | 30 |
| Assessment & Feedback | 21 |
| Administration & Operations | 18 |
| Teacher Productivity | 17 |
| Computing & Coding | 12 |
| Teaching & Learning | 11 |
| Parent Communication | 11 |
| Research & Data Analysis | 10 |
| Pastoral, Behaviour & Wellbeing | 9 |
| Safeguarding & Compliance | 8 |
| Lesson Planning | 5 |
| School Leadership | 5 |
| Classroom Management | 4 |
| AI Detection & Academic Integrity | 3 |

---

## TRAINING
**Total training providers: 76** · 11 controlled categories

| Category | Providers |
|---|---:|
| AI Foundations & Literacy | 20 |
| Leadership & Strategy | 9 |
| AI for Students | 7 |
| SEND & Inclusion | 7 |
| Teaching with AI | 7 |
| AI for Parents & Families | 6 |
| Assessment with AI | 5 |
| Prompt Engineering | 4 |
| Safeguarding & Online Safety | 4 |
| Data Protection & Compliance | 4 |
| Productivity & Administration | 3 |

---

## PROMPTS (NEXT APP)
**Total prompts: 600** · 28 controlled categories (`getpromptly/prompts_master.csv`)

| Category | Prompts | | Category | Prompts |
|---|---:|---|---|---:|
| Behaviour | 36 | | A-Level | 20 |
| Lesson Planning | 30 | | GDPR & Safeguarding | 20 |
| Assessment | 30 | | Communications | 20 |
| Feedback | 30 | | Homework | 16 |
| Operations & Governance | 30 | | SEND Support | 15 |
| Revision | 27 | | School Meetings | 15 |
| Ofsted | 25 | | Policies | 15 |
| School Improvement | 25 | | Risk Assessments | 15 |
| Staff Development | 25 | | Study Skills | 10 |
| Strategy | 25 | | Coursework | 5 |
| Wellbeing | 25 | | ADHD / Autism / Dyslexia / SEMH / SALT-EAL | 20 each |
| Careers | 21 | | GCSE | 20 |

---

## PROMPTS (VITE SITE)
**Total: 60 prompt packs (~484 individual prompts)** · 12 controlled categories (`src/data/prompts.ts`)

| Category | Packs |
|---|---:|
| Exam & Test Preparation | 9 |
| Essay & Writing Support | 8 |
| Maths & Science Support | 7 |
| Study Skills & Executive Function | 7 |
| Reading Comprehension & Literacy | 6 |
| Parent & Caregiver Tools | 6 |
| Language Learning & Vocabulary | 4 |
| Project & Assignment Helpers | 4 |
| Creative & Critical Thinking | 3 |
| Teacher Professional Practice | 3 |
| School Leadership | 2 |
| SENCO & SEN Management | 1 |

---

## EQUIPMENT
**Total equipment: 96** · 10 controlled categories (`src/data/equipment.ts`)
_(Surfaced on the directory via 6 buying-intent product types: SEND & AAC, Sensory, Classroom Tech, Home Learning, Furniture, School Infrastructure.)_

| Category | Products |
|---|---:|
| Devices | 12 |
| Sensory & Regulation | 12 |
| Stationery & Literacy | 10 |
| Robots & Coding | 10 |
| AAC & Communication | 10 |
| Screens & Classroom Hardware | 10 |
| Games & Cognitive | 8 |
| Audio & Hearing | 8 |
| Furniture & Environment | 8 |
| Wearables & Safety | 8 |

---

## Content Gaps

**Tools — thin categories (≤5):**
- **AI Detection & Academic Integrity (3)** — only 3 tools for a high-stakes, fast-moving area (a top concern for secondary/exams).
- **Classroom Management (4)** — sparse for a universal daily teacher need.
- **Lesson Planning (5)** & **School Leadership (5)** — both core to the platform's "for teachers / for schools" positioning yet under-stocked.
- Mid-tier worth deepening: Safeguarding & Compliance (8), Pastoral/Behaviour/Wellbeing (9).

**Training — thin categories (≤4):**
- **Productivity & Administration (3)**, **Prompt Engineering (4)**, **Safeguarding & Online Safety (4)**, **Data Protection & Compliance (4)** — the compliance/skills areas schools most need are the thinnest.
- Over-concentration: **AI Foundations & Literacy (20)** is ~26% of all training — a catch-all that should be split (e.g. separate "Technical/General courses" from "Education foundations").

**Vite prompts — thin categories (≤3):**
- **SENCO & SEN Management (1)** and **School Leadership (2)** are near-empty — yet these are flagship audiences. (The Next app covers leadership/SEND heavily, which exposes the duplication issue below.)
- Creative & Critical Thinking (3), Teacher Professional Practice (3).

**Next prompts:** well-covered (min 5). Thinnest: **Coursework (5)**, **Study Skills (10)**.

**Equipment:** evenly stocked (8–12) — no gaps, but also no depth in any single area (everything is shallow-but-broad).

**No-content / dropped:**
- Tools: *Classroom Technology* intentionally empty (hardware lives in Equipment).
- Cross-platform: no dedicated **EAL/Multilingual** content area (EAL is folded into SEND); no **Early Years / EYFS**-specific stream.

---

## Content Opportunities

**High value, low volume (prioritise):**
1. **AI Detection & Academic Integrity** (tools 3) — high search/trust value, especially GCSE/A-Level + Ofqual/JCQ context. Expand tools + a dedicated training strand.
2. **School Leadership** (tools 5, Vite prompts 2) — central to the B2B "for schools" pitch but under-served on the Vite side; the Next app's leadership prompts (Strategy 25, Ofsted 25, School Improvement 25) are the platform's real strength and should be surfaced.
3. **Safeguarding & Data Protection** (training 4+4, tools 8) — the compliance topics schools must get right; thin everywhere.
4. **Lesson Planning** (tools 5) vs huge prompt coverage (Next 30) — mismatch; pair the two.

**Structural opportunity — two prompt systems:**
- The **Vite site (60 packs, student-study)** and the **Next app (600, school-wide)** are separate products with **zero category overlap**. This is the single biggest content-strategy decision: consolidate into one prompt library, or clearly position them (e.g. "Student prompts" vs "Staff/School prompts"). Right now it risks user confusion and duplicated effort.

**Categories missing from the platform:**
- **Early Years (EYFS)** stream across all content types.
- **EAL / Multilingual** as a first-class area (currently buried in SEND).
- **Parent/home** depth: tools (11) and training (6) are thin vs strong parent prompts.

---

## Recommended Homepage Structure

Driven by the inventory: the platform is **broad and trust-led**, deepest in **SEND**, **Student Study**, **Assessment/Feedback**, and **Leadership/Operations** (via Next prompts).

1. **Hero — independent positioning + role selector.** Lead with trust ("independent, KCSIE-aware") and a role picker (Teacher · Leader · SENCO · Parent · Student · Admin) — the platform's primary navigation axis.
2. **Four content pillars with live counts** (credibility through volume):
   - Reviewed Tools — **242**
   - Prompt Library — **600+**
   - Training — **76 providers**
   - Equipment — **96 products**
3. **By-role lanes** — each role → its strongest content (e.g. SENCO → SEND tools 37 + SEND equipment + SEN prompts; Leader → Strategy/Ofsted/School Improvement prompts + Leadership tools).
4. **Featured vertical: SEND & Inclusion** — the platform's deepest spine (tools 37, equipment across AAC/Sensory, dedicated prompts). Make it a hero category.
5. **The Promptly Score / methodology** — the trust differentiator (link to `/safety-methodology`).
6. **Latest / most-used** — surface Assessment & Feedback and Lesson Planning (high-demand teacher needs) and the leadership prompt strength.
7. **Final CTA** — "Find what's right for your school / role" → role-aware entry or Luna.

**Sequencing note:** because Leadership/Ops content is strong in prompts but thin in tools, the homepage should route leaders to **prompts** first, not tools — match each role's lane to where the depth actually is.

---

_Counts are read directly from the controlled taxonomies and are kept honest by the build-time drift gates (scores · tools · training · vite-prompts · next-prompts)._
