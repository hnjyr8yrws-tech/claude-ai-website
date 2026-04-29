export interface StructuredPrompt {
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  bestFor: string;
  tools: string[];
  prompt: string;
  variables: string[];
  safeguarding?: string;
  expectedOutput: string;
  followUp?: string;
}

export interface PromptPack {
  id: number;
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  useCase?: string;
  outcomes?: string[];
  promptCount: number;
  senFocus: string[];
  roles: string[];
  stages: string[];
  prompts: StructuredPrompt[];
  featured: boolean;
  free: boolean;
}

export const CATEGORIES: { name: string; slug: string; description: string }[] = [
  {
    name: 'Essay & Writing Support',
    slug: 'essay-writing',
    description: 'Structured, SEN-aware prompts for planning, drafting and improving essays across all key stages.',
  },
  {
    name: 'Maths & Science Support',
    slug: 'maths-science',
    description: 'Visual, step-by-step prompts that reduce number and science anxiety for neurodiverse learners.',
  },
  {
    name: 'Exam & Test Preparation',
    slug: 'exam-preparation',
    description: 'Revision and exam-day prompts that reduce anxiety and support memory for GCSE and A-Level students.',
  },
  {
    name: 'Study Skills & Executive Function',
    slug: 'study-skills',
    description: 'External scaffolding and habit-building prompts to help students plan, focus and complete tasks.',
  },
  {
    name: 'Reading Comprehension & Literacy',
    slug: 'reading-literacy',
    description: 'Accessible reading and comprehension prompts that reduce overload for students with literacy difficulties.',
  },
  {
    name: 'Parent & Caregiver Tools',
    slug: 'parent-caregiver',
    description: 'Scripts, routines and advocacy prompts empowering parents to support their child with SEN at home and school.',
  },
  {
    name: 'Language Learning & Vocabulary',
    slug: 'language-vocabulary',
    description: 'Multi-sensory vocabulary building prompts for GCSE and A-Level language learners with SEN.',
  },
  {
    name: 'Creative & Critical Thinking',
    slug: 'creative-thinking',
    description: 'Strength-based prompts that celebrate neurodivergent creativity and build analytical skills.',
  },
  {
    name: 'Project & Assignment Helpers',
    slug: 'project-helpers',
    description: 'Chunked, scaffolded prompts for managing GCSE and A-Level projects and coursework from start to finish.',
  },
  {
    name: 'Teacher Professional Practice',
    slug: 'teacher-practice',
    description: 'Expert-level prompts for lesson planning, differentiation, parent communication and classroom practice.',
  },
  {
    name: 'SENCO & SEN Management',
    slug: 'senco-management',
    description: 'Structured prompts for EHCP support, provision mapping, annual reviews and SEN documentation.',
  },
  {
    name: 'School Leadership',
    slug: 'school-leadership',
    description: 'Strategic prompts for Ofsted preparation, AI policy, self-evaluation and whole-school improvement.',
  },
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseSEN(sen: string): string[] {
  const s = sen.trim();
  if (s.startsWith('ADHD, Autism, Executive')) return ['ADHD', 'Autism', 'Executive Dysfunction'];
  if (s.startsWith('Dyslexia, Autism, ADHD')) return ['Dyslexia', 'Autism', 'ADHD'];
  if (s.startsWith('Dyslexia')) return ['Dyslexia'];
  if (s.startsWith('ADHD')) return ['ADHD'];
  if (s.startsWith('Autism')) return ['Autism'];
  if (s.startsWith('Anxiety')) return ['Anxiety'];
  if (s.startsWith('Dyscalculia')) return ['Dyscalculia'];
  if (s.startsWith('All SEN')) return ['All SEN'];
  // fallback: comma-separated first section before any dash
  const part = s.split(/\s*[—–-]/)[0];
  return part.split(',').map((x) => x.trim()).filter(Boolean);
}

function deriveRoles(title: string, category: string, senFocus: string[]): string[] {
  const roles = new Set<string>();

  if (
    title.includes('Parent') ||
    title.includes('Caregiver') ||
    category === 'Parent & Caregiver Tools'
  ) {
    roles.add('Parents');
  }

  if (
    category === 'Essay & Writing Support' ||
    category === 'Reading Comprehension & Literacy'
  ) {
    roles.add('Students');
    roles.add('Teachers');
  }

  if (category === 'Exam & Test Preparation') {
    roles.add('Students');
    roles.add('Teachers');
    roles.add('Parents');
  }

  if (category === 'Study Skills & Executive Function') {
    roles.add('Students');
    roles.add('Teachers');
    roles.add('SENCOs');
  }

  if (category === 'Math & Science Support') {
    roles.add('Students');
    roles.add('Teachers');
  }

  if (title.includes('GCSE') || title.includes('A-Level')) {
    roles.add('Students');
  }

  if (title.includes('SEN')) {
    roles.add('SENCOs');
    roles.add('Teachers');
  }

  if (title.includes('Feedback')) {
    roles.add('Teachers');
  }

  if (title.includes('Access Arrangements') || title.includes('Reasonable Adjustments')) {
    roles.add('SENCOs');
  }

  if (title.includes('Advocacy')) {
    roles.add('Parents');
    roles.add('SENCOs');
  }

  if (
    category === 'Language Learning & Vocabulary' ||
    category === 'Creative & Critical Thinking' ||
    category === 'Project & Assignment Helpers'
  ) {
    roles.add('Students');
    roles.add('Teachers');
  }

  // Always include SENCOs for any pack with explicit SEN focus
  if (senFocus.length > 0) {
    roles.add('SENCOs');
  }

  return Array.from(roles);
}

function deriveStages(title: string, category: string): string[] {
  if (category === 'Parent & Caregiver Tools') return ['All ages'];
  const stages: string[] = [];
  if (title.includes('GCSE')) stages.push('GCSE');
  if (title.includes('A-Level')) stages.push('A-Level');
  if (stages.length === 0) return ['KS3', 'GCSE', 'All ages'];
  return stages;
}

function parsePrompts(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^\d+\./.test(l))
    .map((l) => l.replace(/^\d+\.\s*/, ''));
}

function categorySlugFor(cat: string): string {
  const map: Record<string, string> = {
    'Essay & Writing Support': 'essay-writing',
    'Math & Science Support': 'maths-science',
    'Exam & Test Preparation': 'exam-preparation',
    'Study Skills & Executive Function': 'study-skills',
    'Reading Comprehension & Literacy': 'reading-literacy',
    'Parent & Caregiver Tools': 'parent-caregiver',
    'Language Learning & Vocabulary': 'language-vocabulary',
    'Creative & Critical Thinking': 'creative-thinking',
    'Project & Assignment Helpers': 'project-helpers',
    'Teacher Professional Practice': 'teacher-practice',
    'SENCO & SEN Management': 'senco-management',
    'School Leadership': 'school-leadership',
  };
  return map[cat] ?? slugify(cat);
}

const ALL_TOOLS = ['Claude', 'ChatGPT', 'Gemini', 'Perplexity'];

function upgradePrompt(raw: string, index: number, total: number, packSen: string): StructuredPrompt {
  const variables = (raw.match(/\[[^\]]+\]/g) || []).filter((v, i, a) => a.indexOf(v) === i);
  const third = Math.floor(total / 3);
  const level: StructuredPrompt['level'] = index < third ? 'Beginner' : index < third * 2 ? 'Intermediate' : 'Advanced';
  const words = raw.split(' ').slice(0, 8).join(' ').replace(/[.…,]$/, '');
  const hasSEN = packSen.toLowerCase().includes('sen') || packSen.toLowerCase().includes('dyslexia') || packSen.toLowerCase().includes('adhd') || packSen.toLowerCase().includes('autism');
  return {
    title: words.length > 50 ? words.slice(0, 50) + '...' : words,
    level,
    bestFor: hasSEN ? 'Teachers, SENCOs, parents supporting SEN learners' : 'Teachers and students',
    tools: ALL_TOOLS,
    prompt: raw,
    variables,
    safeguarding: hasSEN ? 'This prompt supports but does not replace professional SEN advice, EHCPs or clinical guidance.' : undefined,
    expectedOutput: 'Structured, ready-to-use text you can adapt for your context.',
    followUp: 'Ask the AI to adapt this for a specific year group, SEN need or subject.',
  };
}

function displayCategory(cat: string): string {
  if (cat === 'Math & Science Support') return 'Maths & Science Support';
  return cat;
}

const FEATURED_IDS = new Set([1, 5, 9, 16, 17, 22, 23, 25, 34, 35, 39]);

const RAW = [
  {
    id: 1, cat: 'Essay & Writing Support',
    title: 'Dyslexia-Friendly Essay Writing',
    desc: 'Simple, structured prompts that reduce reading/writing overload for students with dyslexia. Uses short sentences, voice-first options, and chunked steps.',
    count: 8,
    sen: 'Dyslexia (short sentences, chunking, voice-friendly)',
    prompts: "1. Help me write a short essay about [topic]. Use very short sentences and bullet points first, then turn it into paragraphs. Make it dyslexia-friendly.\n2. Create a 300-word essay plan for [topic] using mind-map style bullets. Keep words simple and avoid long sentences.\n3. Write the introduction for an essay on [topic] using the \"Point – Explain – Example\" method. Keep each sentence under 15 words.\n4. Turn my rough notes about [topic] into a clear 5-paragraph essay. Use simple words and add line breaks between ideas.\n5. Help me write an essay conclusion for [topic]. Make it positive and easy to read aloud.\n6. Create a dyslexia-friendly essay template for any school topic with fill-in-the-blanks.\n7. Rewrite this confusing paragraph [paste text] so it's easier for someone with dyslexia to understand and use.\n8. Generate 5 simple topic sentences for an essay about [topic].",
  },
  {
    id: 2, cat: 'Essay & Writing Support',
    title: 'ADHD-Friendly Essay Starters & Chunked Writing',
    desc: 'Short-burst prompts with timers, focus aids, and quick wins for students with ADHD or executive function challenges.',
    count: 8,
    sen: 'ADHD (Pomodoro-style, minimal text, small tasks)',
    prompts: "1. Give me a 5-minute writing task for an essay on [topic]. Start with just the hook sentence.\n2. Break down an essay about [topic] into 6 tiny 5-minute tasks. Give me the first task now.\n3. Create a \"brain dump\" prompt for [topic] — let me write everything messy first, then organize it later.\n4. Write a 150-word essay section on [topic] using the Pomodoro method (25 minutes work, 5 minutes break).\n5. Help me start an essay when I feel stuck. Give me 3 different opening sentences to choose from.\n6. Turn my messy notes [paste notes] into a simple essay outline with only 5 bullet points.\n7. Create a reward-based essay planner for [topic] — suggest small rewards after each section.\n8. Write an essay body paragraph about [topic] in exactly 8 sentences or fewer.",
  },
  {
    id: 3, cat: 'Essay & Writing Support',
    title: 'Autism-Friendly Structured Writing Templates',
    desc: 'Predictable, literal, and highly structured writing scaffolds for autistic students who prefer clear rules.',
    count: 8,
    sen: 'Autism (literal language, strict structure, visual supports)',
    prompts: "1. Create a strict 5-paragraph essay template for [topic] with exact sentence starters for each paragraph.\n2. Write an essay about [topic] using this exact structure: Introduction (3 sentences), 3 facts, 3 examples, Conclusion (2 sentences).\n3. Generate a visual essay planner for [topic] using numbered steps and clear rules.\n4. Help me write a literal explanation of [topic] without metaphors or idioms.\n5. Create a social story-style essay introduction for [topic] that explains the purpose clearly.\n6. Turn [topic] into a compare-and-contrast essay using a strict point-by-point format.\n7. Provide a checklist-style prompt to write an essay about [topic] with every step listed.\n8. Write a factual report-style essay on [topic] using only clear statements.",
  },
  {
    id: 4, cat: 'Essay & Writing Support',
    title: 'Anxiety-Reducing Essay & Writing Prompts',
    desc: 'Gentle, encouraging prompts that reduce writing anxiety and build confidence for students with anxiety or perfectionism.',
    count: 8,
    sen: 'Anxiety & Emotional Regulation',
    prompts: "1. Help me start writing about [topic] without pressure. Just write the easiest first sentence.\n2. Create a kind, step-by-step guide to writing an essay on [topic] that feels safe and manageable.\n3. Write a very short, low-pressure version of an essay on [topic] — only 150 words.\n4. Give me permission to write a \"bad first draft\" about [topic]. Then help me improve it gently.\n5. Create a calming essay planner for [topic] that includes breathing breaks.\n6. Help me rewrite this anxious thought into a positive essay sentence: [paste thought].\n7. Write 3 gentle opening sentences for an essay on [topic] that feel safe to use.\n8. Turn my worries about writing into a strengths-based essay introduction for [topic].",
  },
  {
    id: 5, cat: 'Essay & Writing Support',
    title: 'SEN Essay Feedback Prompts for Parents & Teachers',
    desc: 'Thoughtful, constructive feedback prompts that support students with SEN without causing overwhelm or demotivation.',
    count: 8,
    sen: 'All SEN (gentle language, strength-based)',
    prompts: "1. Give constructive but kind feedback on this essay paragraph [paste text] for a student with dyslexia.\n2. Suggest 3 specific improvements for this A-Level essay section [paste text] while highlighting what the student did well.\n3. Create gentle feedback for a GCSE student with ADHD who struggled to finish their essay on [topic].\n4. Help me write encouraging comments on my child's essay draft that focus on effort and next steps.\n5. Provide SEN-friendly feedback on structure, vocabulary, and analysis for this essay extract [paste text].\n6. Turn critical feedback into positive, actionable steps for a student with autism who finds vague comments stressful.\n7. Create a balanced feedback sandwich for this essay on [question]: one strength, one area to improve, one strength.\n8. Suggest ways to praise a dyslexic student's ideas even if spelling and punctuation need work.",
  },
  {
    id: 6, cat: 'Essay & Writing Support',
    title: 'Visual & Multi-Sensory Essay Planning for SEN',
    desc: 'Prompts that use visual aids, mind maps, colour-coding, and multi-sensory techniques to support diverse learners in planning and writing essays.',
    count: 8,
    sen: 'Dyslexia, Autism, ADHD (visual & sensory supports)',
    prompts: "1. Create a colour-coded mind map plan for a GCSE essay on [topic] with visual icons for each section.\n2. Turn [topic] into a visual essay planner using boxes, arrows, and simple drawings.\n3. Help me plan an A-Level essay on [theme] using a multi-sensory approach (speak it, draw it, then write it).\n4. Generate a step-by-step visual checklist for structuring a compare-and-contrast essay.\n5. Create a mind-map style outline for [question] that uses colour to show importance of points.\n6. Design a movement-based essay planning prompt — stand up and gesture each paragraph before writing.\n7. Turn my spoken ideas about [topic] into a visual story-board style essay plan.\n8. Provide a sensory-friendly essay template with space for doodles and colour notes.",
  },
  {
    id: 7, cat: 'Essay & Writing Support',
    title: 'Executive Function Essay Scaffolds for GCSE & A-Level',
    desc: 'Targeted prompts that support planning, organisation, task initiation, and completion for students with executive function difficulties.',
    count: 8,
    sen: 'ADHD, Autism, Executive Dysfunction',
    prompts: "1. Break down a full GCSE essay on [question] into 8 tiny, manageable tasks with clear start and end points.\n2. Create an external brain prompt to help me choose what to study when everything feels important.\n3. Design a decision-tree prompt for prioritising points in an essay on [theme].\n4. Provide a timed checklist for completing a 45-minute timed essay with built-in transition cues.\n5. Help me move from planning to actual writing when initiation is difficult.\n6. Create a visual task list for organising essay notes and resources.\n7. Generate a \"body double\" style prompt that guides me through writing one paragraph at a time.\n8. Design an executive function-friendly essay review checklist that catches common organisational mistakes.",
  },
  {
    id: 8, cat: 'Essay & Writing Support',
    title: 'Inclusive Essay Writing for Mixed-Ability Classrooms & Home Learning',
    desc: 'Flexible, strength-based prompts that work for neurodiverse and neurotypical students alike, with built-in adaptation options.',
    count: 8,
    sen: 'All SEN + neurotypical learners',
    prompts: "1. Create an adaptable essay plan for [topic] that offers three versions: visual, written, and voice-first.\n2. Write a GCSE essay introduction for [question] that can be easily simplified or extended depending on the student's needs.\n3. Generate a flexible PEEL paragraph template for [theme] with optional sentence starters for different ability levels.\n4. Help me turn [student's rough ideas] into a coherent essay section while preserving their unique voice.\n5. Create a parent-friendly prompt sequence to support a child with [specific SEN] when writing an essay on [topic].\n6. Provide three different ways to structure a conclusion for [question]: simple, balanced, and evaluative.\n7. Make an inclusive checklist for self-reviewing an essay that works for both dyslexic and non-dyslexic students.\n8. Generate alternative wording options for this sentence [paste sentence] at three different complexity levels.",
  },
  {
    id: 9, cat: 'Math & Science Support',
    title: 'Dyscalculia-Friendly GCSE Maths Problem Solving',
    desc: 'Gentle, visual, and step-by-step prompts that reduce number anxiety and support students with dyscalculia in GCSE Maths.',
    count: 10,
    sen: 'Dyscalculia — visual methods, concrete examples, reduced number overload',
    prompts: "1. Break down this GCSE Maths question [paste question] into very small visual steps using drawings or objects.\n2. Help me solve [maths problem] using real-life examples and colour-coding instead of abstract numbers.\n3. Create a dyscalculia-friendly checklist for checking my working in a GCSE algebra question.\n4. Turn this wordy GCSE Maths problem into a simple visual story with drawings.\n5. Give me a 5-step visual method to solve percentage questions without feeling overwhelmed.\n6. Rewrite this confusing GCSE Maths explanation [paste text] using everyday language and pictures.\n7. Create a \"concrete before abstract\" prompt sequence for learning [maths topic].\n8. Help me check my answer for [question] using estimation and common-sense checks first.\n9. Generate 3 different visual ways to understand and solve ratio problems for GCSE.\n10. Make a calming prompt for when I get stuck on a maths question during revision.",
  },
  {
    id: 10, cat: 'Math & Science Support',
    title: 'ADHD-Friendly Science Explanation & Revision',
    desc: 'Short-burst, engaging prompts with movement breaks and real-world links for students with ADHD studying GCSE/A-Level Science.',
    count: 10,
    sen: 'ADHD — micro-tasks, real-world examples, dopamine-friendly',
    prompts: "1. Explain [science topic] to me in 5-minute chunks with a fun real-world example each time.\n2. Break down the process of [science concept] into 6 tiny tasks I can do with movement breaks.\n3. Create a \"quick win\" revision prompt for GCSE Biology on [topic] that feels achievable.\n4. Help me turn boring GCSE Chemistry facts about [topic] into a short story or analogy.\n5. Give me a 10-minute active revision task for Physics [topic] that involves standing or gesturing.\n6. Create a reward-based prompt sequence for revising [science topic] when my attention wanders.\n7. Explain the difference between [two science concepts] using everyday objects I can see around me.\n8. Turn this GCSE Science diagram description [paste text] into a simple spoken explanation.\n9. Design a 25-minute Pomodoro revision session for A-Level [science topic].\n10. Help me make a \"one-page wonder\" summary sheet for [topic] that I can actually use.",
  },
  {
    id: 11, cat: 'Math & Science Support',
    title: 'Autism-Friendly Literal Science & Maths Prompts',
    desc: 'Clear, literal, rule-based prompts with no ambiguity for autistic students studying GCSE/A-Level Science and Maths.',
    count: 10,
    sen: 'Autism — literal language, strict rules, predictable structure',
    prompts: "1. Explain [science concept] using only literal facts and a numbered list of rules.\n2. Create a strict step-by-step method for solving GCSE Maths problems on [topic] with no exceptions.\n3. Give me a literal definition and exact examples for [science term] without any metaphors.\n4. Build a predictable checklist for answering GCSE Science 6-mark questions on [topic].\n5. Turn the process of [science experiment] into a numbered instruction list with exact order.\n6. Create a clear comparison table for [two science concepts] using only facts and data.\n7. Provide a rule-based prompt for balancing chemical equations in GCSE Chemistry.\n8. Explain the graph for [maths/science topic] using only literal descriptions of what each axis shows.\n9. Make a strict template for writing a GCSE Science method section with every step labelled.\n10. Generate literal exam-style answers for common misconceptions in [science topic].",
  },
  {
    id: 12, cat: 'Math & Science Support',
    title: 'Anxiety-Reducing Maths & Science Revision',
    desc: 'Gentle, confidence-building prompts that reduce panic and overwhelm during GCSE/A-Level Maths and Science revision.',
    count: 10,
    sen: 'Anxiety — low-pressure, gradual, strengths-based',
    prompts: "1. Help me start revising [topic] with one tiny, safe task that builds confidence.\n2. Create a calming 15-minute revision plan for GCSE Maths on [topic] with breathing breaks.\n3. Give me permission to get questions wrong while learning [science concept].\n4. Turn my fear of [specific maths topic] into a gentle starting prompt.\n5. Write a kind explanation of [difficult concept] that feels safe and slow-paced.\n6. Create a \"one thing at a time\" revision prompt for A-Level Physics on [topic].\n7. Help me celebrate small wins after completing a short revision task on [subject].\n8. Provide 3 gentle ways to approach a scary-looking GCSE Science calculation.\n9. Make a positive self-talk prompt I can use when I feel stuck on [maths question].\n10. Design a low-pressure end-of-session reflection for science revision that focuses on effort.",
  },
  {
    id: 13, cat: 'Math & Science Support',
    title: 'Visual & Multi-Sensory Science Learning',
    desc: 'Prompts using diagrams, models, colour, movement, and real objects to support diverse learners in GCSE/A-Level Science.',
    count: 10,
    sen: 'Dyslexia, Autism, ADHD — multi-sensory, visual, hands-on',
    prompts: "1. Explain [science topic] using a visual diagram prompt with colour-coding and labels.\n2. Create a hands-on activity prompt for understanding [concept] using household objects.\n3. Turn the carbon cycle into a visual story map with arrows and pictures.\n4. Help me learn [maths formula] using a gesture or movement-based memory trick.\n5. Generate a colour-coded revision mind map prompt for GCSE Biology topic [topic].\n6. Create a multi-sensory prompt for learning the periodic table using objects and colours.\n7. Design a visual checklist for answering 6-mark GCSE Science questions.\n8. Turn a written science method into a step-by-step drawing sequence.\n9. Provide a prompt for building a physical model to understand [physics concept].\n10. Create a sensory-friendly revision card template for [science topic].",
  },
  {
    id: 14, cat: 'Math & Science Support',
    title: 'Executive Function Scaffolds for Science & Maths',
    desc: 'Structured external support for planning, organising, and completing GCSE/A-Level Science and Maths tasks for students with executive dysfunction.',
    count: 10,
    sen: 'ADHD, Autism, Executive Dysfunction — heavy scaffolding',
    prompts: "1. Break a full GCSE Science required practical on [topic] into 10 tiny external tasks.\n2. Create an external brain prompt sequence for starting a long A-Level Maths problem.\n3. Turn a complex science question into a decision tree with clear yes/no branches.\n4. Provide a timed checklist for completing a 6-mark GCSE Science answer with transition cues.\n5. Design a task initiation prompt for when I can't start revising [maths topic].\n6. Create a visual priority list for tackling multiple science homework questions.\n7. Help me move from planning to actual writing when stuck on a science report.\n8. Generate a step-by-step \"body double\" prompt for working through a maths calculation.\n9. Make an organisation checklist for keeping science notes and revision materials tidy.\n10. Provide a clear end-of-task review prompt to help me close down a study session.",
  },
  {
    id: 15, cat: 'Math & Science Support',
    title: 'Parent Support Tools for SEN Maths & Science',
    desc: 'Practical prompts for UK parents to support their child with SEN at home during GCSE/A-Level Maths and Science revision and homework.',
    count: 10,
    sen: 'All SEN — parent-friendly, empowering, non-judgmental',
    prompts: "1. Help me explain [science concept] to my child with dyslexia in a calm, visual way.\n2. Create a supportive script for supporting my child with ADHD during a 20-minute maths revision session.\n3. Give me gentle ways to help my autistic child when they get stuck on a GCSE Science question.\n4. Design a gentle home routine prompt for revising [topic] that works for a child with anxiety.\n5. Turn this confusing GCSE Maths homework [paste question] into parent-friendly steps I can guide my child through.\n6. Create encouraging phrases I can use when my child with SEN feels overwhelmed by science revision.\n7. Help me make a visual timetable for science revision that my child can actually follow.\n8. Provide a script for discussing reasonable adjustments with school for my child's maths exams.\n9. Create a strength-based feedback prompt I can use after my child completes a science task.\n10. Design a low-pressure \"parent + child\" revision game for [maths topic].",
  },
  {
    id: 16, cat: 'Exam & Test Preparation',
    title: 'GCSE Exam Preparation for Dyslexic Students',
    desc: 'Practical, low-pressure prompts that reduce reading overload and support memory and organisation for dyslexic students sitting GCSE exams.',
    count: 10,
    sen: 'Dyslexia — short text, voice-first, visual aids, chunked revision',
    prompts: "1. Create a dyslexia-friendly 7-day revision plan for GCSE English Literature on [text], using short daily tasks and voice notes.\n2. Help me turn my GCSE Science notes on [topic] into simple spoken revision cards I can listen to.\n3. Generate a visual mind-map revision prompt for GCSE Maths [topic] with colour-coding and minimal text.\n4. Create a step-by-step prompt for reading and annotating a GCSE English extract without feeling overwhelmed by the page.\n5. Design a 20-minute daily revision session for GCSE History [topic] that uses audio and drawing instead of heavy reading.\n6. Help me practise answering GCSE 6-mark questions on [topic] using very short sentences and bullet points first.\n7. Make a calming checklist for the morning of a GCSE exam that includes dyslexia-friendly strategies.\n8. Turn this past paper question [paste question] into a simplified version with clear instructions.\n9. Create a voice-first prompt sequence for revising key quotes for GCSE English.\n10. Provide a gentle end-of-revision reflection prompt that focuses on effort rather than perfection.",
  },
  {
    id: 17, cat: 'Exam & Test Preparation',
    title: 'ADHD-Friendly Exam Revision & Focus Techniques',
    desc: 'Short-burst, movement-friendly revision prompts with built-in rewards and focus aids for students with ADHD preparing for GCSE and A-Level exams.',
    count: 10,
    sen: 'ADHD — micro-sessions, movement, rewards, dopamine support',
    prompts: "1. Break my GCSE Science revision on [topic] into 6 x 10-minute focused bursts with 2-minute movement breaks.\n2. Create a reward-based revision plan for A-Level Maths [topic] where I earn a small treat after each completed task.\n3. Give me a 5-minute \"brain dump\" prompt for GCSE History [topic] to clear my mind before focused work.\n4. Design a standing or walking revision session for learning GCSE Biology keywords on [topic].\n5. Help me start revising when I feel scattered — give me the first tiny 3-minute task for [subject].\n6. Create a Pomodoro-style prompt with built-in fun rewards for revising GCSE English Literature quotes.\n7. Turn boring GCSE Chemistry facts into a quick \"quiz myself while moving\" game.\n8. Provide a reset prompt for when my attention drops during a revision session on [topic].\n9. Make a 25-minute active revision prompt for A-Level Physics calculations.\n10. Create a celebration prompt to use after completing a full mock exam paper.",
  },
  {
    id: 18, cat: 'Exam & Test Preparation',
    title: 'Autism-Friendly Exam Preparation & Predictable Routines',
    desc: 'Predictable, rule-based, and literal exam preparation prompts that reduce uncertainty and anxiety for autistic students sitting GCSE and A-Level exams.',
    count: 10,
    sen: 'Autism — predictable routines, literal instructions, clear rules',
    prompts: "1. Create a strict daily timetable for the 4 weeks before GCSE exams, with exact times and activities for each subject.\n2. Provide a numbered checklist for answering a GCSE 6-mark Science question with every step clearly defined.\n3. Generate a literal step-by-step guide for what happens on the day of a GCSE exam, from waking up to leaving the hall.\n4. Create a predictable revision card template for [topic] with the same layout for every card.\n5. Help me prepare for [subject] using only factual lists and no open-ended questions.\n6. Design a clear \"exam day routine\" prompt with exact timings and what to do if something changes.\n7. Turn GCSE English Literature quotes into a strict memorisation list with repetition rules.\n8. Provide a rule-based prompt for planning answers to compare-and-contrast GCSE questions.\n9. Create a literal checklist for packing my exam bag the night before.\n10. Make a predictable end-of-revision reflection prompt that asks the same 5 questions every day.",
  },
  {
    id: 19, cat: 'Exam & Test Preparation',
    title: 'Anxiety-Reducing Exam Preparation for GCSE & A-Level',
    desc: 'Gentle, low-pressure prompts that reduce exam panic and build confidence for students with anxiety or perfectionism during GCSE and A-Level preparation.',
    count: 10,
    sen: 'Anxiety — low-pressure, gradual exposure, strengths-based',
    prompts: "1. Create a very gentle 10-minute revision session for [topic] that feels safe and achievable.\n2. Help me face a past paper question on [topic] without pressure — start with just reading it calmly.\n3. Write a kind self-talk script I can use when I feel anxious before a mock exam.\n4. Design a slow, step-by-step plan for revising GCSE Maths that includes calming breaks.\n5. Give me permission to get some questions wrong while learning [subject].\n6. Create a calming breathing prompt to use when I feel overwhelmed during revision.\n7. Turn my fear of failing GCSE English into a positive \"what I can control\" list.\n8. Provide 3 gentle ways to start revising when anxiety makes me want to avoid it.\n9. Make a positive end-of-day reflection prompt that focuses on effort rather than results.\n10. Design a low-pressure \"mock exam simulation\" prompt that feels safe and gradual.",
  },
  {
    id: 20, cat: 'Exam & Test Preparation',
    title: 'Reasonable Adjustments & Access Arrangements Prompts',
    desc: 'Practical prompts to help parents and students understand, request, and use reasonable adjustments and access arrangements for GCSE and A-Level exams.',
    count: 10,
    sen: 'All SEN — EHCP, reasonable adjustments, access arrangements',
    prompts: "1. Help me write a clear email to school requesting reasonable adjustments for my child with dyslexia in GCSE exams.\n2. Create a parent script for discussing extra time or a reader for GCSE Science with the SENCo.\n3. Generate a list of reasonable adjustments that might help a student with ADHD during timed exams.\n4. Provide a prompt to explain to my child what a scribe or laptop in exams means.\n5. Create a checklist of evidence needed to support an application for access arrangements.\n6. Help me prepare my child for using a reader in a GCSE English Literature exam.\n7. Write a calm explanation for my autistic child about what will happen if they have rest breaks in exams.\n8. Generate questions I can ask the school about how access arrangements will work on the day.\n9. Create a parent prompt to track and document how SEN affects my child's exam performance.\n10. Design a gentle conversation script for discussing anxiety-related adjustments with teachers.",
  },
  {
    id: 21, cat: 'Exam & Test Preparation',
    title: 'Multi-Sensory Exam Revision Techniques',
    desc: 'Prompts using visual, auditory, movement, and hands-on methods to make GCSE and A-Level revision more accessible for diverse learners.',
    count: 10,
    sen: 'Dyslexia, Autism, ADHD — multi-sensory, visual, kinaesthetic',
    prompts: "1. Create a multi-sensory revision prompt for GCSE Biology [topic] using drawing, speaking, and movement.\n2. Turn GCSE Chemistry equations into a gesture-based memory prompt.\n3. Design a colour-coded visual revision map for A-Level History [topic].\n4. Help me revise GCSE English quotes using rhythm, clapping, and repetition.\n5. Create a hands-on model-building prompt for understanding GCSE Physics concepts.\n6. Generate a walking-and-talking revision prompt for learning GCSE Maths formulas.\n7. Make a sensory-friendly flashcard template that includes texture or colour cues.\n8. Design a revision game using objects around the house for [science topic].\n9. Provide a prompt for creating a visual story to remember key GCSE History dates and events.\n10. Create a multi-sensory checklist for revising before a mock exam.",
  },
  {
    id: 22, cat: 'Exam & Test Preparation',
    title: 'Parent Support for SEN Exam Preparation',
    desc: 'Empowering prompts and scripts for UK parents supporting their child with SEN through GCSE and A-Level exam preparation at home.',
    count: 10,
    sen: 'All SEN — parent guidance, advocacy, home support',
    prompts: "1. Help me create a calm home revision routine for my child with ADHD preparing for GCSEs.\n2. Write a supportive script for when my child with dyslexia feels overwhelmed by revision.\n3. Design a gentle weekly check-in conversation for discussing study progress without pressure.\n4. Create a low-pressure reward system prompt for revision sessions at home.\n5. Help me explain reasonable adjustments to my autistic child.\n6. Provide encouraging phrases for when my child struggles with executive function during study.\n7. Design a simple visual timetable I can use with my child for GCSE revision.\n8. Create a parent prompt for turning messy notes into organised revision materials.\n9. Write a calm script for talking to my anxious child about upcoming mock exams.\n10. Make a simple home \"exam day morning\" routine prompt for parents.",
  },
  {
    id: 23, cat: 'Study Skills & Executive Function',
    title: 'ADHD Study Skills & Focus Techniques for GCSE & A-Level',
    desc: 'Practical, short-burst study prompts with movement, rewards, and external structure to help students with ADHD build sustainable revision habits.',
    count: 10,
    sen: 'ADHD — micro-tasks, dopamine support, external scaffolding',
    prompts: "1. Create a 6 x 10-minute study session plan for GCSE Science [topic] with built-in movement breaks and small rewards.\n2. Help me start revising when my brain feels scattered — give me the first 3-minute task for [subject].\n3. Design a reward-based daily study planner for A-Level Maths that makes starting easier.\n4. Turn my messy notes on [topic] into a clean, organised study sheet using only 5 bullet points.\n5. Create a \"body double\" style prompt where you guide me through a 25-minute focused study block on [topic].\n6. Provide a gentle reset prompt for when my attention drops during revision.\n7. Make a visual priority list for tackling multiple subjects when everything feels urgent.\n8. Generate a 15-minute active study task for GCSE History that involves standing or gesturing.\n9. Create a simple \"end-of-study-session\" routine that helps me close down without feeling overwhelmed.\n10. Design a weekly study rhythm that accounts for ADHD energy fluctuations.",
  },
  {
    id: 24, cat: 'Study Skills & Executive Function',
    title: 'Autism-Friendly Study Routines & Predictable Structures',
    desc: 'Clear, literal, and highly predictable study routines and structures for autistic students preparing for GCSE and A-Level exams.',
    count: 10,
    sen: 'Autism — predictable routines, literal instructions, reduced uncertainty',
    prompts: "1. Create a strict daily study timetable for the next 4 weeks with exact times and subjects.\n2. Provide a numbered checklist for a successful 45-minute study session with no ambiguity.\n3. Design a predictable \"start study\" routine with the same 5 steps every day.\n4. Generate a literal step-by-step guide for organising revision notes for [subject].\n5. Create a fixed template for making revision cards that stays the same for every topic.\n6. Help me build a clear \"what to do if I get stuck\" decision tree for study sessions.\n7. Make a predictable end-of-day reflection prompt that asks the same 4 questions every evening.\n8. Design a visual wall chart showing exactly what needs to be revised each week.\n9. Provide a rule-based prompt for transitioning between different subjects without overwhelm.\n10. Create a literal checklist for the night before a mock exam.",
  },
  {
    id: 25, cat: 'Study Skills & Executive Function',
    title: 'Executive Function Scaffolds for SEN Students',
    desc: 'Heavy external scaffolding prompts to support planning, organisation, task initiation, and completion for students with executive dysfunction.',
    count: 10,
    sen: 'ADHD, Autism, Executive Dysfunction — external brain support',
    prompts: "1. Break my GCSE revision for [subject] into 10 tiny external tasks with clear start and finish points.\n2. Create an external brain prompt to help me choose what to study when everything feels important.\n3. Design a decision-tree prompt for prioritising revision topics when I feel overwhelmed.\n4. Provide a timed checklist for completing a full past paper with built-in transition cues.\n5. Help me move from planning to actually starting revision when initiation is difficult.\n6. Create a visual task list for organising revision materials for multiple subjects.\n7. Generate a \"body double\" style prompt that guides me through a study session step by step.\n8. Make a simple system for tracking which topics I have revised and which still need work.\n9. Provide a clear \"close down\" routine for ending a study session without leaving loose ends.\n10. Design an external reminder prompt for when I lose track of time during revision.",
  },
  {
    id: 26, cat: 'Study Skills & Executive Function',
    title: 'Visual & Multi-Sensory Study Techniques',
    desc: 'Prompts using colour, diagrams, movement, and hands-on methods to make study more accessible and memorable for diverse learners.',
    count: 10,
    sen: 'Dyslexia, Autism, ADHD — multi-sensory, visual, kinaesthetic',
    prompts: "1. Create a colour-coded mind map revision prompt for GCSE Biology [topic].\n2. Turn key GCSE History dates into a visual timeline with drawings and colours.\n3. Design a gesture-based memory prompt for learning GCSE Maths formulas.\n4. Help me make a multi-sensory revision card set for [science topic] using colour and texture.\n5. Generate a walking-and-speaking revision prompt for A-Level English Literature quotes.\n6. Create a visual story map for understanding the plot of [literature text].\n7. Provide a hands-on model-building prompt for GCSE Physics concepts.\n8. Design a colour-coded priority system for revision topics.\n9. Make a sensory-friendly summary sheet template for [subject].\n10. Create a revision game using objects around the house for [maths topic].",
  },
  {
    id: 27, cat: 'Study Skills & Executive Function',
    title: 'Parent Tools for Supporting SEN Study at Home',
    desc: 'Empowering, practical prompts and scripts for UK parents helping their child with SEN develop effective study habits at home.',
    count: 10,
    sen: 'All SEN — parent guidance, calm support, home routines',
    prompts: "1. Help me create a calm, realistic home study routine for my child with ADHD.\n2. Write a supportive script for when my child with dyslexia feels overwhelmed by revision.\n3. Design a gentle weekly check-in conversation for discussing study progress without pressure.\n4. Create a low-pressure reward system prompt for home revision sessions.\n5. Help me explain reasonable adjustments to my child in a reassuring way.\n6. Provide encouraging phrases for when my child struggles with executive function during study.\n7. Design a simple visual timetable I can use with my child for GCSE revision.\n8. Create a parent prompt for turning messy notes into organised revision materials.\n9. Write a calm script for talking to my anxious child about upcoming mock exams.\n10. Make a simple home \"exam day morning\" routine prompt for parents.",
  },
  {
    id: 28, cat: 'Study Skills & Executive Function',
    title: 'Building Independent Study Skills for SEN Students',
    desc: 'Gentle prompts that help students with SEN gradually build independence in planning and completing study tasks for GCSE and A-Level.',
    count: 10,
    sen: 'All SEN — gradual independence, scaffolding that fades',
    prompts: "1. Create a prompt sequence that helps me slowly take more responsibility for my GCSE revision plan.\n2. Design a \"fading support\" prompt for moving from parent-guided to independent study on [subject].\n3. Help me build a personal study routine that I can eventually run myself.\n4. Generate a self-checklist for starting a study session without needing reminders.\n5. Create a prompt for tracking my own progress in [subject] using a simple visual chart.\n6. Design a decision-making prompt for choosing what to revise when I have limited time.\n7. Provide a gentle self-reflection prompt I can use at the end of each study week.\n8. Help me create my own \"what to do when I get stuck\" toolkit.\n9. Make a prompt for gradually reducing support while revising for A-Level exams.\n10. Design a celebration prompt for when I complete a full independent study session.",
  },
  {
    id: 29, cat: 'Reading Comprehension & Literacy',
    title: 'Dyslexia-Friendly Reading Comprehension for GCSE & A-Level',
    desc: 'Gentle, structured prompts that reduce visual overload and support understanding of GCSE and A-Level texts for students with dyslexia.',
    count: 10,
    sen: 'Dyslexia — short chunks, voice-first, visual supports',
    prompts: "1. Help me understand this GCSE English extract [paste text] by breaking it into very short paragraphs with simple questions after each.\n2. Create a dyslexia-friendly summary prompt for [text] using short sentences and line breaks.\n3. Turn this A-Level literature passage [paste text] into a spoken explanation I can listen to and then answer questions about.\n4. Provide a step-by-step prompt for annotating a GCSE English text without feeling overwhelmed by the page.\n5. Generate 5 simple comprehension questions for [text] with clear, short wording.\n6. Help me find the main idea of each paragraph in [text] using one sentence per paragraph.\n7. Create a visual mind-map prompt for understanding characters and themes in [literature text].\n8. Rewrite confusing sentences from [text] in simpler words while keeping the original meaning.\n9. Design a voice-first reading comprehension session for GCSE English Literature.\n10. Make a calming checklist for reading and understanding a long exam extract.",
  },
  {
    id: 30, cat: 'Reading Comprehension & Literacy',
    title: 'Autism-Friendly Literal Reading Comprehension',
    desc: 'Predictable, literal prompts that remove ambiguity and support autistic students in understanding GCSE and A-Level texts.',
    count: 10,
    sen: 'Autism — literal language, clear rules, no inference pressure',
    prompts: "1. Create a literal question set for [text] that asks only for facts stated directly in the passage.\n2. Provide a strict step-by-step prompt for answering comprehension questions on [text] with exact rules for each step.\n3. Help me list exactly what the character says and does in [text] without guessing feelings.\n4. Generate a clear checklist for identifying the main point of each paragraph in a GCSE English extract.\n5. Turn [text] into a numbered fact list with no opinions or inferences.\n6. Create a predictable template for answering \"how does the writer…?\" questions using only evidence from the text.\n7. Design a literal character profile for [character] with sections for actions, words, and described events only.\n8. Provide a rule-based prompt for comparing two texts using a strict point-by-point format.\n9. Make a clear glossary-style prompt for difficult words in [text].\n10. Create a step-by-step guide for writing a literal summary of [text].",
  },
  {
    id: 31, cat: 'Reading Comprehension & Literacy',
    title: 'ADHD-Friendly Short-Burst Reading & Comprehension',
    desc: 'Short, engaging, movement-friendly prompts for students with ADHD to maintain focus while improving reading comprehension for GCSE and A-Level.',
    count: 10,
    sen: 'ADHD — micro-sessions, active engagement, rewards',
    prompts: "1. Give me a 5-minute reading task for [text] followed by 3 quick comprehension questions.\n2. Break reading and understanding [text] into 6 short bursts with movement breaks between them.\n3. Create a \"read then move\" prompt for GCSE English Literature extracts.\n4. Help me turn a long passage into a quick \"key facts hunt\" game.\n5. Design a 10-minute active comprehension session for [topic] that includes standing or gesturing.\n6. Provide a reward-based prompt for completing a reading comprehension task on [text].\n7. Create a brain-dump prompt after reading [text] to clear my mind before answering questions.\n8. Generate 3 quick comprehension questions for a short section of [text].\n9. Make a standing reading prompt for revising key quotes from [literature text].\n10. Design a fun \"beat the timer\" comprehension challenge for GCSE English.",
  },
  {
    id: 32, cat: 'Reading Comprehension & Literacy',
    title: 'Anxiety-Reducing Reading Comprehension Prompts',
    desc: 'Gentle, low-pressure prompts that reduce reading anxiety and build confidence when tackling GCSE and A-Level texts.',
    count: 10,
    sen: 'Anxiety — gradual exposure, strengths-based, calming',
    prompts: "1. Help me start reading [text] with zero pressure — just the first paragraph calmly.\n2. Create a kind, slow-paced prompt for understanding a difficult GCSE English extract.\n3. Give me permission to read [text] without understanding everything on the first try.\n4. Design a calming 10-minute reading session for [literature text] with breathing breaks.\n5. Turn my worry about not understanding [text] into a gentle starting prompt.\n6. Provide 3 safe ways to approach answering questions on a long exam passage.\n7. Create a positive reflection prompt after finishing a reading comprehension task.\n8. Help me break a scary-looking A-Level text into small, manageable pieces.\n9. Make a gentle checklist for reading that focuses on what I did well.\n10. Design a low-pressure \"first reading\" prompt that celebrates effort over perfection.",
  },
  {
    id: 33, cat: 'Reading Comprehension & Literacy',
    title: 'Parent Tools for Supporting SEN Reading at Home',
    desc: 'Practical scripts and prompts for UK parents to support their child with SEN when working on reading comprehension and literacy at home.',
    count: 10,
    sen: 'All SEN — parent guidance, calm support, home strategies',
    prompts: "1. Help me explain this GCSE English text [paste text] to my child with dyslexia in a calm, visual way.\n2. Create a supportive script for when my child with autism gets stuck on a reading comprehension question.\n3. Design a gentle home reading routine for my anxious child preparing for GCSE English.\n4. Provide encouraging phrases I can use when my child struggles with understanding [text].\n5. Help me turn a difficult A-Level literature passage into parent-friendly discussion questions.\n6. Create a low-pressure reading support session plan for home that includes breaks.\n7. Write a script for talking to my child about using a reader or extra time in exams.\n8. Design a strength-based feedback prompt for after my child completes a reading task.\n9. Generate simple ways to make reading at home more enjoyable for a child with ADHD.\n10. Make a parent checklist for supporting reading comprehension without adding pressure.",
  },
  {
    id: 34, cat: 'Parent & Caregiver Tools',
    title: 'Supporting Your Dyslexic Child with Homework',
    desc: "Gentle, practical prompts and scripts for UK parents to support a child with dyslexia during homework and revision without causing frustration.",
    count: 10,
    sen: 'Dyslexia — practical home strategies, reduced overload',
    prompts: "1. Help me support my child with dyslexia when they are struggling to read their GCSE English homework.\n2. Create a calm script I can use when my child says \"I can't read this\" during homework.\n3. Design a 20-minute dyslexia-friendly homework routine for [subject].\n4. Give me simple ways to turn written homework into voice-first activities for my dyslexic child.\n5. Write encouraging phrases I can use when my child feels overwhelmed by spelling or reading.\n6. Create a parent-friendly checklist for helping with GCSE English essay planning.\n7. Help me explain reasonable adjustments to my child in a reassuring way.\n8. Design a low-pressure way to review my child's homework without criticising their spelling.\n9. Provide a script for talking to teachers about my child's dyslexia-related difficulties.\n10. Make a strength-based reflection prompt I can use with my child after completing homework.",
  },
  {
    id: 35, cat: 'Parent & Caregiver Tools',
    title: 'Helping Your ADHD Child with Revision & Focus',
    desc: 'Practical, realistic prompts for UK parents supporting a child with ADHD during GCSE and A-Level revision, focusing on motivation and sustainable routines.',
    count: 10,
    sen: 'ADHD — realistic home support, motivation, structure',
    prompts: "1. Help me create a realistic home revision routine for my child with ADHD that actually works.\n2. Write a supportive script for when my child says \"I can't focus\" during revision.\n3. Design a short-burst revision session plan with built-in movement breaks.\n4. Give me gentle ways to encourage my child when they lose motivation halfway through a session.\n5. Create a reward system prompt that feels fair and motivating for GCSE revision.\n6. Help me turn my child's messy notes into something usable without taking over.\n7. Provide a script for discussing revision strategies with my ADHD child without nagging.\n8. Design a 25-minute focused study block prompt I can guide my child through.\n9. Make a calming end-of-revision routine for when energy levels crash.\n10. Create encouraging phrases for when my child feels they are \"bad at revising\".",
  },
  {
    id: 36, cat: 'Parent & Caregiver Tools',
    title: 'Supporting Your Autistic Child with Schoolwork',
    desc: 'Clear, predictable, and respectful prompts for UK parents supporting an autistic child with homework, revision, and school projects.',
    count: 10,
    sen: 'Autism — predictability, literal support, respect for needs',
    prompts: "1. Help me create a predictable homework routine for my autistic child that reduces anxiety.\n2. Write a calm script for explaining a new school task to my autistic child.\n3. Design a visual timetable prompt for weekly revision that stays the same every week.\n4. Give me ways to support my child when they become overwhelmed by open-ended homework.\n5. Create a literal step-by-step guide I can use to help with [subject] homework.\n6. Provide a script for advocating for my child's need for clear instructions at school.\n7. Help me turn vague project instructions into a clear, numbered task list.\n8. Design a low-pressure way to review my child's work without changing their style.\n9. Make a predictable \"homework wind-down\" routine for the end of each session.\n10. Create encouraging phrases that respect my child's need for literal feedback.",
  },
  {
    id: 37, cat: 'Parent & Caregiver Tools',
    title: 'Managing Exam Anxiety at Home',
    desc: 'Gentle, practical prompts and scripts for UK parents helping their child manage exam anxiety during GCSE and A-Level preparation.',
    count: 10,
    sen: 'Anxiety — calming strategies, parent support',
    prompts: "1. Help me support my child when they have a panic attack about upcoming GCSE exams.\n2. Create a calming pre-mock exam morning routine for my anxious child.\n3. Write a reassuring script I can use when my child says \"I'm going to fail\".\n4. Design a gentle breathing and grounding prompt I can guide my child through.\n5. Provide ways to talk about revision without increasing pressure.\n6. Create a low-pressure \"what if\" planning prompt for worst-case exam scenarios.\n7. Help me build my child's confidence with strength-based reflection after revision sessions.\n8. Design a calming end-of-day wind-down routine before exams.\n9. Make a parent self-care prompt for when supporting an anxious child becomes exhausting.\n10. Create encouraging phrases that acknowledge anxiety but focus on effort.",
  },
  {
    id: 38, cat: 'Parent & Caregiver Tools',
    title: 'Creating Effective Home Learning Plans for SEN',
    desc: 'Practical prompts for UK parents to build realistic, sustainable home learning plans that work for children with SEN.',
    count: 10,
    sen: 'All SEN — realistic planning, parent empowerment',
    prompts: "1. Help me create a realistic weekly home learning plan for my child with ADHD.\n2. Design a flexible revision timetable that accounts for my child's energy fluctuations.\n3. Provide a prompt for balancing schoolwork with my child's sensory or emotional needs.\n4. Create a parent-friendly checklist for building a successful home study environment.\n5. Help me set achievable daily goals for GCSE revision without causing overwhelm.\n6. Design a system for tracking progress that celebrates small wins.\n7. Provide a script for discussing home learning expectations with my child calmly.\n8. Create a contingency plan prompt for when the usual routine breaks down.\n9. Make a balanced weekly schedule that includes rest and fun activities.\n10. Generate a gentle review prompt to evaluate how the home learning plan is working.",
  },
  {
    id: 39, cat: 'Parent & Caregiver Tools',
    title: "Advocating for Your Child's SEN Needs at School",
    desc: "Empowering scripts and prompts for UK parents to confidently advocate for their child's SEN support, reasonable adjustments, and EHCP needs.",
    count: 10,
    sen: 'All SEN — advocacy, EHCP, reasonable adjustments',
    prompts: "1. Help me write a clear, professional email to the SENCo requesting additional support.\n2. Create a script for a meeting with teachers about my child's access arrangements.\n3. Provide a checklist of evidence I should gather to support an EHCP application.\n4. Write a calm but firm script for discussing my child's need for extra time in exams.\n5. Design a prompt for preparing questions to ask at an annual EHCP review meeting.\n6. Help me explain my child's SEN needs to a new teacher in a positive way.\n7. Create a parent advocacy checklist for GCSE exam access arrangements.\n8. Provide a script for when school says \"we don't have the resources\".\n9. Make a strength-based letter template highlighting my child's needs and strengths.\n10. Design a follow-up email template after a meeting about SEN support.",
  },
  {
    id: 40, cat: 'Language Learning & Vocabulary',
    title: 'Dyslexia-Friendly Vocabulary Building for GCSE & A-Level',
    desc: 'Gentle, multi-sensory prompts that reduce spelling pressure and help dyslexic students learn and retain new vocabulary for GCSE and A-Level.',
    count: 10,
    sen: 'Dyslexia — multi-sensory, voice-first, visual anchors',
    prompts: "1. Help me learn 10 new GCSE French vocabulary words using pictures, sounds, and short sentences instead of spelling drills.\n2. Create a voice-first prompt for practising [language] vocabulary on [topic] that I can speak and listen to.\n3. Turn difficult GCSE Spanish words into a visual story or memory hook with drawings.\n4. Design a colour-coded vocabulary card template for A-Level German that uses images and short example sentences.\n5. Provide a gentle prompt for learning [language] keywords without forcing perfect spelling.\n6. Make a multi-sensory activity prompt for remembering [set of vocabulary words].\n7. Help me create simple spoken sentences using new [language] vocabulary on [theme].\n8. Generate a calming revision prompt for vocabulary tests that focuses on understanding rather than spelling.\n9. Create a \"hear it, see it, use it\" sequence for learning 5 new words in [language].\n10. Design a low-pressure weekly vocabulary builder for GCSE languages.",
  },
  {
    id: 41, cat: 'Language Learning & Vocabulary',
    title: 'ADHD-Friendly Language Learning Techniques',
    desc: 'Short-burst, engaging, and movement-based prompts for students with ADHD to learn and retain vocabulary for GCSE and A-Level languages.',
    count: 10,
    sen: 'ADHD — micro-sessions, active engagement, rewards',
    prompts: "1. Give me a 5-minute fun activity to learn 8 new GCSE Spanish vocabulary words with movement.\n2. Create a reward-based vocabulary game for A-Level French [topic].\n3. Design a quick \"say it while moving\" prompt for practising [language] words.\n4. Help me turn boring vocabulary lists into a short story or rap for [language].\n5. Provide a 10-minute active vocabulary session for GCSE German with built-in breaks.\n6. Create a \"beat the timer\" challenge for learning [set of words] in [language].\n7. Make a vocabulary memory game using gestures and actions for [theme].\n8. Design a dopamine-friendly daily vocabulary builder with small wins and rewards.\n9. Generate a standing or walking prompt for revising [language] keywords.\n10. Create a fun \"teach it to someone else\" prompt for new vocabulary.",
  },
  {
    id: 42, cat: 'Language Learning & Vocabulary',
    title: 'Autism-Friendly Literal Vocabulary Building',
    desc: 'Clear, literal, rule-based prompts for autistic students to learn vocabulary in a predictable and unambiguous way for GCSE and A-Level.',
    count: 10,
    sen: 'Autism — literal, predictable, rule-based',
    prompts: "1. Create a strict vocabulary list for [language] [topic] with exact definitions and one example sentence per word.\n2. Provide a numbered learning sequence for 10 new GCSE Spanish words with the same format for each.\n3. Generate a literal matching prompt for [language] vocabulary with clear rules.\n4. Design a predictable daily vocabulary routine with the same 5 steps every day.\n5. Help me build a personal glossary for A-Level German with exact rules for each entry.\n6. Create a checklist-style prompt for testing myself on [set of vocabulary].\n7. Turn [theme] vocabulary into a strict categorised list with no ambiguity.\n8. Provide a rule-based prompt for using new words in simple, literal sentences.\n9. Make a visual but literal vocabulary card template with fixed layout.\n10. Design a predictable revision prompt that asks the same questions for every word.",
  },
  {
    id: 43, cat: 'Language Learning & Vocabulary',
    title: 'Anxiety-Reducing Vocabulary Learning Prompts',
    desc: 'Gentle, low-pressure prompts that reduce anxiety around learning new languages and vocabulary for GCSE and A-Level students.',
    count: 10,
    sen: 'Anxiety — gradual, strengths-based, calming',
    prompts: "1. Help me learn 5 new [language] words today in a very gentle, pressure-free way.\n2. Create a calming prompt for when I feel anxious about remembering vocabulary.\n3. Design a slow, kind vocabulary session for [topic] that celebrates small progress.\n4. Give me permission to forget words while still learning [language].\n5. Turn vocabulary learning into a relaxing activity with breathing breaks.\n6. Provide 3 gentle starter activities for learning new words when anxiety is high.\n7. Create a positive reflection prompt after a vocabulary session that focuses on effort.\n8. Help me build confidence with one safe word at a time for [language].\n9. Make a low-pressure \"exposure\" prompt for using new vocabulary in sentences.\n10. Design a calming end-of-session prompt that ends on a positive note.",
  },
  {
    id: 44, cat: 'Creative & Critical Thinking',
    title: 'Creative Thinking for Neurodiverse Students',
    desc: 'Gentle prompts that celebrate neurodivergent strengths and help students with SEN develop creative ideas for GCSE and A-Level projects.',
    count: 10,
    sen: 'All SEN — strength-based, flexible, idea-generating',
    prompts: "1. Help me generate 10 unusual but useful ideas for a GCSE Creative Writing project on [theme].\n2. Create a prompt that turns my special interest in [topic] into a creative project idea.\n3. Design a mind-map style prompt for brainstorming without pressure for [project].\n4. Help me combine two unrelated ideas to create something original for an A-Level project.\n5. Generate creative alternatives to a standard essay on [topic] that play to my strengths.\n6. Create a \"what if\" prompt for developing original thinking on [subject].\n7. Provide a gentle prompt for turning a boring assignment into something more interesting.\n8. Design a visual creativity booster for students who think better in pictures.\n9. Help me develop a unique angle for my GCSE Art/Design project on [theme].\n10. Create a strength-based prompt that celebrates my way of thinking.",
  },
  {
    id: 45, cat: 'Creative & Critical Thinking',
    title: 'Critical Thinking Prompts for SEN Students',
    desc: 'Clear, structured prompts that build critical thinking skills in a supportive way for students with SEN preparing for GCSE and A-Level.',
    count: 10,
    sen: 'All SEN — literal, step-by-step, non-overwhelming',
    prompts: "1. Help me think critically about [text] using 5 simple literal questions.\n2. Create a step-by-step prompt for evaluating arguments in a GCSE English text.\n3. Design a balanced \"for and against\" thinking prompt for [issue].\n4. Provide a clear checklist for spotting bias in [article or text].\n5. Help me compare two sources on [topic] using a strict point-by-point format.\n6. Generate a prompt for questioning assumptions in a science or history topic.\n7. Create a safe way to disagree with a point in [text] using evidence.\n8. Design a critical thinking template for A-Level essays with exact sentence starters.\n9. Help me evaluate my own work using a kind but honest checklist.\n10. Provide a prompt for thinking about \"what could be improved\" without self-criticism.",
  },
  {
    id: 46, cat: 'Creative & Critical Thinking',
    title: 'Emotional Literacy & Self-Reflection Prompts',
    desc: 'Gentle prompts that help students with SEN develop emotional awareness and reflective thinking for personal statements, projects, and wellbeing.',
    count: 10,
    sen: 'Anxiety, Autism, ADHD — emotional literacy, self-awareness',
    prompts: "1. Help me reflect on what I found difficult in [project] without feeling bad about it.\n2. Create a safe prompt for describing how [experience] made me feel.\n3. Design a strength-based reflection prompt for my GCSE coursework.\n4. Provide gentle questions to explore why I got stuck on [task].\n5. Help me write about a challenge I overcame in a way that shows growth.\n6. Create a prompt for identifying what helps me learn best.\n7. Design a calming reflection prompt after a difficult school day.\n8. Help me turn a mistake into a learning point for my personal statement.\n9. Provide a safe way to express frustration with [subject] constructively.\n10. Create a positive end-of-term reflection prompt focused on effort and growth.",
  },
  {
    id: 47, cat: 'Project & Assignment Helpers',
    title: 'GCSE Project Planning for SEN Students',
    desc: 'Structured, chunked prompts that make GCSE project and coursework planning manageable for students with SEN.',
    count: 10,
    sen: 'All SEN — chunking, scaffolding, realistic planning',
    prompts: "1. Break my GCSE Geography project on [topic] into 10 tiny manageable tasks.\n2. Create a visual project timeline for [assignment] with clear deadlines.\n3. Help me plan a GCSE Art project on [theme] using a step-by-step checklist.\n4. Design a realistic 4-week plan for completing my coursework on [subject].\n5. Turn a big project brief into a simple numbered task list.\n6. Provide a prompt for choosing a project title that plays to my strengths.\n7. Create a weekly check-in prompt to track project progress without overwhelm.\n8. Help me organise my project folder and resources clearly.\n9. Design a gentle prompt for when I feel stuck on the next step.\n10. Make a final project review checklist focused on strengths.",
  },
  {
    id: 48, cat: 'Project & Assignment Helpers',
    title: 'A-Level Coursework & NEA Support for SEN',
    desc: 'Supportive prompts for students with SEN tackling A-Level Non-Exam Assessment (NEA) and coursework.',
    count: 10,
    sen: 'All SEN — extended projects, independence with support',
    prompts: "1. Help me plan my A-Level History NEA on [topic] using a clear research timeline.\n2. Create a structured prompt for writing the introduction to my A-Level coursework.\n3. Design a manageable research log template for my NEA.\n4. Provide a step-by-step prompt for analysing sources in my A-Level project.\n5. Help me create a realistic schedule for completing my A-Level English NEA.\n6. Generate a prompt for evaluating my own progress on the coursework.\n7. Create a bibliography and referencing checklist suitable for SEN students.\n8. Design a gentle prompt for editing and improving my draft without overwhelm.\n9. Help me prepare a clear presentation of my NEA findings.\n10. Make a final submission checklist with calming instructions.",
  },
  {
    id: 49, cat: 'Project & Assignment Helpers',
    title: 'Multi-Sensory Project & Assignment Ideas',
    desc: 'Creative, hands-on prompts that use visual, auditory, and kinaesthetic methods for students with SEN to complete projects and assignments.',
    count: 10,
    sen: 'Dyslexia, Autism, ADHD — multi-sensory, inclusive ideas',
    prompts: "1. Suggest 5 multi-sensory ways to present my GCSE project on [topic].\n2. Create a project idea that uses drawing, speaking, and models instead of long writing.\n3. Design a visual story-board style assignment plan for [subject].\n4. Help me turn a written assignment into a podcast or video presentation.\n5. Generate a hands-on experiment idea for GCSE Science coursework.\n6. Provide a prompt for creating a 3D model or diorama for a history project.\n7. Suggest a project using colour, texture, and movement for [theme].\n8. Create an alternative presentation format that plays to my strengths.\n9. Design a project combining different senses in one assignment.\n10. Make a prompt for creating a multi-sensory revision project for [topic].",
  },
  {
    id: 50, cat: 'Project & Assignment Helpers',
    title: 'Final Project Review & Reflection for SEN',
    desc: 'Supportive prompts for students with SEN to review, reflect on, and celebrate completed projects and assignments.',
    count: 10,
    sen: 'All SEN — positive reflection, growth mindset',
    prompts: "1. Help me reflect on what I did well in my finished GCSE project.\n2. Create a gentle self-review prompt that focuses on effort and learning.\n3. Design a strength-based reflection for my A-Level NEA.\n4. Provide a prompt for identifying what helped me most during the project.\n5. Help me celebrate finishing my assignment in a positive way.\n6. Create a kind \"what I would do differently next time\" prompt.\n7. Design a visual reflection map showing my journey through the project.\n8. Provide a parent-child reflection prompt for discussing the finished work.\n9. Make a positive takeaway prompt for what I learned about myself.\n10. Create a confidence-building reflection for the end of the school year.",
  },
];

const LEGACY_PACKS: PromptPack[] = RAW.map((r) => {
  const senFocus = parseSEN(r.sen);
  const displayCat = displayCategory(r.cat);
  const rawPrompts = parsePrompts(r.prompts);
  return {
    id: r.id,
    slug: slugify(r.title),
    category: displayCat,
    categorySlug: categorySlugFor(r.cat),
    title: r.title,
    description: r.desc,
    promptCount: r.count,
    senFocus,
    roles: deriveRoles(r.title, r.cat, senFocus),
    stages: deriveStages(r.title, r.cat),
    prompts: rawPrompts.map((p, i) => upgradePrompt(p, i, rawPrompts.length, r.sen)),
    featured: FEATURED_IDS.has(r.id),
    free: true,
  };
});

// ── Expert packs ─────────────────────────────────────────────────────────────

const EXPERT_PACKS: PromptPack[] = [
  {
    id: 51,
    slug: 'expert-lesson-planning',
    category: 'Teacher Professional Practice',
    categorySlug: 'teacher-practice',
    title: 'Expert Lesson Planning with AI',
    description: 'Structured, curriculum-aligned lesson planning prompts that produce differentiated, Ofsted-ready plans. Beginner to advanced.',
    useCase: 'Creating full lesson plans, learning objectives, starters, plenaries and differentiated activities.',
    outcomes: ['Complete lesson plans with timings', 'Differentiated activities for 3+ ability levels', 'Aligned learning objectives with success criteria'],
    promptCount: 6,
    senFocus: ['All SEN'],
    roles: ['Teachers'],
    stages: ['KS3', 'GCSE', 'A-Level'],
    featured: true,
    free: true,
    prompts: [
      {
        title: 'Quick Lesson Plan Generator',
        level: 'Beginner',
        bestFor: 'NQTs and teachers who want a fast starting point',
        tools: ALL_TOOLS,
        prompt: 'Act as an experienced UK [subject] teacher at [key stage]. Create a 1-hour lesson plan for the topic [topic] aimed at Year [year group]. Include:\\n\\n1. A clear learning objective linked to the national curriculum\\n2. Success criteria (all/most/some)\\n3. A 5-minute starter activity\\n4. Main teaching input (15 mins)\\n5. Student activity (25 mins)\\n6. Plenary (5 mins)\\n7. Key vocabulary list\\n\\nUse UK English throughout. If anything is unclear, ask me up to 3 clarifying questions before generating the plan.',
        variables: ['[subject]', '[key stage]', '[topic]', '[year group]'],
        safeguarding: 'Lesson plans should be reviewed by the class teacher. AI-generated content should be checked for accuracy before classroom use.',
        expectedOutput: 'A complete, timed lesson plan with objectives, activities and assessment opportunities.',
        followUp: 'Now differentiate this lesson for three ability levels: emerging, developing, and secure.',
      },
      {
        title: 'Learning Objectives & Success Criteria Builder',
        level: 'Beginner',
        bestFor: 'Teachers writing schemes of work or individual lesson objectives',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK curriculum specialist. I am teaching [subject] to Year [year group] ([key stage]). The topic is [topic] and this is lesson [number] of [total] in the unit.\\n\\nGenerate:\\n1. One clear learning objective using a measurable verb (e.g. explain, analyse, evaluate \u2014 not \"understand\" or \"know\")\\n2. Three tiered success criteria:\\n   - All students will\u2026\\n   - Most students will\u2026\\n   - Some students will\u2026\\n3. Two key questions I can ask to check understanding during the lesson\\n4. One way to assess the objective in the plenary\\n\\nAlign to the current English national curriculum. Use UK English.',
        variables: ['[subject]', '[year group]', '[key stage]', '[topic]', '[number]', '[total]'],
        expectedOutput: 'A focused learning objective with three-tier success criteria and assessment ideas.',
        followUp: 'Suggest how I could adapt these objectives for a student with [specific SEN need].',
      },
      {
        title: 'Differentiated Lesson Plan with SEN Adaptations',
        level: 'Intermediate',
        bestFor: 'Teachers in mixed-ability classes with SEN students on their register',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK secondary [subject] teacher with 10 years of experience in inclusive education. I teach a mixed-ability Year [year group] class of [class size] students. The class includes [describe SEN needs, e.g. 2 students with dyslexia, 1 with ADHD, 1 EAL student].\\n\\nCreate a fully differentiated 1-hour lesson on [topic] that includes:\\n\\n1. Learning objective and 3-tier success criteria\\n2. Starter: accessible to all, with a stretch extension\\n3. Main activity: 3 versions (scaffolded / core / challenge)\\n4. SEN adaptations: specific adjustments for the students described above\\n5. EAL support: key vocabulary with simple definitions\\n6. Assessment for Learning: 2 mini-checkpoints during the lesson\\n7. Plenary: inclusive activity that all students can access\\n8. Resources needed\\n\\nUse UK curriculum references. Flag any activities that need TA support.',
        variables: ['[subject]', '[year group]', '[class size]', '[describe SEN needs]', '[topic]'],
        safeguarding: 'SEN adaptations should align with individual students\u2019 EHCP targets or SEN support plans. Always cross-reference with your SENCO.',
        expectedOutput: 'A detailed, differentiated lesson plan with specific SEN and EAL adaptations.',
        followUp: 'Create the scaffolded worksheet for the main activity, including sentence starters and a word bank.',
      },
      {
        title: 'Assessment for Learning Integration',
        level: 'Intermediate',
        bestFor: 'Teachers embedding formative assessment across a lesson',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher and AfL specialist. I am planning a lesson on [topic] for Year [year group].\\n\\nDesign 6 formative assessment checkpoints I can embed across a 1-hour lesson:\\n\\n1. Entry ticket (first 2 minutes)\\n2. Hinge question after teacher input (must have exactly one correct answer that reveals a specific misconception)\\n3. Mini-whiteboard check (with 3 example questions, increasing difficulty)\\n4. Peer assessment task with a structured success-criteria checklist students can use\\n5. Self-assessment reflection prompt (2 sentences max)\\n6. Exit ticket (last 3 minutes \u2014 one question that directly tests the learning objective)\\n\\nFor each checkpoint, explain: what it assesses, what a successful response looks like, and what to do if 30%+ of the class get it wrong.\\n\\nUse UK English and reference the national curriculum where relevant.',
        variables: ['[subject]', '[topic]', '[year group]'],
        expectedOutput: 'Six timed AfL checkpoints with example questions, success indicators and responsive teaching actions.',
        followUp: 'Now create a version of checkpoints 2 and 6 adapted for students with literacy difficulties.',
      },
      {
        title: 'Full Scheme of Work Sequence Planner',
        level: 'Advanced',
        bestFor: 'Subject leads and experienced teachers planning a full unit',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK Head of [subject] with responsibility for curriculum design. I need a [number]-lesson scheme of work for Year [year group] on the topic [topic/unit name].\\n\\nFor each lesson, provide:\\n1. Lesson title\\n2. Learning objective (measurable verb)\\n3. Key content and concepts\\n4. Core activity type (e.g. direct instruction, guided practice, independent task, group work, practical, assessment)\\n5. Differentiation strategy for that lesson\\n6. Homework or flipped learning task\\n\\nAlso include:\\n- A baseline assessment for lesson 1\\n- A formative assessment midpoint\\n- A summative assessment in the final lesson\\n- Cross-curricular links where appropriate\\n- SMSC/British Values opportunities\\n- Key vocabulary progression across the unit\\n\\nAlign to the [exam board, e.g. AQA/Edexcel/OCR] specification where applicable. Use UK English throughout.',
        variables: ['[subject]', '[number]', '[year group]', '[topic/unit name]', '[exam board]'],
        expectedOutput: 'A complete unit overview with lesson-by-lesson breakdown, assessment points and curriculum mapping.',
        followUp: 'Now expand lesson [number] into a full detailed lesson plan with resources and timings.',
      },
      {
        title: 'Cross-Curricular Lesson with Literacy & Numeracy',
        level: 'Advanced',
        bestFor: 'Teachers embedding cross-curricular skills or preparing for Ofsted deep dives',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher preparing for an Ofsted deep dive into your department. Design a lesson on [topic] for Year [year group] that explicitly embeds:\\n\\n1. Literacy: at least one extended writing task or structured talk activity with academic vocabulary targets\\n2. Numeracy: at least one opportunity for students to interpret, use or generate data/numbers relevant to the topic\\n3. SMSC: a moment for students to reflect on moral, social or cultural dimensions of the content\\n4. Reading: one piece of subject-specific text students read and respond to\\n\\nFor each cross-curricular element, explain:\\n- What students do\\n- How you scaffold it for weaker students\\n- How you would explain the rationale to an inspector\\n\\nInclude a 3-minute \"cold call\" questioning sequence you could use if observed, with 5 questions progressing from recall to evaluation. Use UK English.',
        variables: ['[subject]', '[topic]', '[year group]'],
        expectedOutput: 'An Ofsted-ready lesson plan demonstrating cross-curricular integration with inspector-facing rationale.',
        followUp: 'Write the student-facing reading extract and 4 comprehension questions at differentiated levels.',
      },
    ],
  },
  {
    id: 52,
    slug: 'expert-differentiation',
    category: 'Teacher Professional Practice',
    categorySlug: 'teacher-practice',
    title: 'AI-Powered Differentiation Frameworks',
    description: 'Practical prompts for differentiating lessons, resources and assessments for mixed-ability UK classrooms including SEN, EAL and gifted students.',
    useCase: 'Adapting existing lessons and creating differentiated resources without starting from scratch.',
    outcomes: ['Tiered worksheets and activities', 'SEN-specific adaptations', 'Challenge and stretch extensions'],
    promptCount: 6,
    senFocus: ['All SEN'],
    roles: ['Teachers', 'SENCOs'],
    stages: ['KS3', 'GCSE', 'A-Level'],
    featured: true,
    free: true,
    prompts: [
      {
        title: 'Three-Way Worksheet Differentiator',
        level: 'Beginner',
        bestFor: 'Teachers who need to quickly adapt an existing worksheet',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher. I have a worksheet on [topic] for Year [year group]. Here is the original content:\\n\\n[paste worksheet text or describe the tasks]\\n\\nCreate three versions:\\n\\n1. **Scaffolded** (for students working below expected standard): Simplify language, add sentence starters, reduce the number of questions, include a worked example\\n2. **Core** (expected standard): Keep the original level but improve clarity\\n3. **Challenge** (above expected standard): Add open-ended extension questions, require evaluation or comparison, remove scaffolding\\n\\nFor each version, keep the same topic and learning objective. Use UK English.',
        variables: ['[subject]', '[topic]', '[year group]', '[paste worksheet text]'],
        safeguarding: 'Avoid labelling worksheets with ability levels visible to students. Use colour-coding or task names instead.',
        expectedOutput: 'Three complete worksheet versions at different challenge levels, all covering the same learning objective.',
        followUp: 'Now add a fourth version adapted for a student with [specific SEN need, e.g. dyslexia, ADHD].',
      },
      {
        title: 'Sentence Starter & Scaffold Bank',
        level: 'Beginner',
        bestFor: 'Teachers creating accessible writing frames',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher working with Year [year group]. I need a bank of sentence starters and writing scaffolds for a task on [topic/question].\\n\\nProvide:\\n1. 6 sentence starters progressing from simple to analytical (e.g. \"This shows that\u2026\" to \"One could argue that\u2026 however\u2026\")\\n2. A PEEL paragraph frame with blanks to complete\\n3. 5 connectives sorted by function (adding, contrasting, cause/effect, sequencing, concluding)\\n4. A word bank of 10 key subject-specific terms with simple definitions\\n5. An example completed paragraph using the scaffolds\\n\\nMake everything accessible for students with a reading age of [reading age] and dyslexia-friendly (short sentences, no dense blocks of text). Use UK English.',
        variables: ['[subject]', '[year group]', '[topic/question]', '[reading age]'],
        expectedOutput: 'A complete scaffold bank with sentence starters, paragraph frame, connectives and vocabulary.',
        followUp: 'Create a version of this scaffold bank formatted as a desk mat students can keep next to them.',
      },
      {
        title: 'SEN-Specific Task Adaptation',
        level: 'Intermediate',
        bestFor: 'Teachers adapting tasks for specific SEN needs on their class register',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO advising a [subject] teacher. A Year [year group] student has [specific SEN, e.g. autism spectrum condition with PDA profile / dyslexia with a reading age of 9 / ADHD predominantly inattentive type].\\n\\nThe class task is: [describe the task].\\n\\nProvide:\\n1. Three specific adaptations to the task that maintain the same learning objective\\n2. Environmental adjustments (seating, timing, resources)\\n3. Communication adjustments (how to present the task, what language to use/avoid)\\n4. A reduced or restructured version of the task if full access is not possible\\n5. What success looks like for this student specifically\\n6. How to involve a TA effectively without creating dependency\\n\\nBe practical and specific. Avoid generic advice like \"provide extra time\". Reference the student\u2019s likely strengths as well as barriers.',
        variables: ['[subject]', '[year group]', '[specific SEN]', '[describe the task]'],
        safeguarding: 'These adaptations should be reviewed against the student\u2019s EHCP or SEN support plan. AI-generated SEN advice does not replace professional SENCO guidance.',
        expectedOutput: 'Specific, practical task adaptations with environmental and communication adjustments.',
        followUp: 'Now write a brief note I could give to the TA explaining how to support this student during this specific task.',
      },
      {
        title: 'Stretch & Challenge for Gifted Students',
        level: 'Intermediate',
        bestFor: 'Teachers who need to extend high-ability students without just giving them more work',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher with experience in gifted and talented provision. Year [year group] are studying [topic]. I have [number] high-ability students who finish tasks quickly and need genuine stretch, not just more of the same.\\n\\nDesign:\\n1. A depth task: the same topic explored at a higher cognitive level (analysis, evaluation, synthesis)\\n2. A breadth task: connecting this topic to another area of the curriculum or real-world context\\n3. A leadership task: this student helps others understand a concept (structured peer teaching)\\n4. An independent enquiry question they can research beyond the lesson\\n5. A \"what if\" provocation question that challenges assumptions in the topic\\n\\nEach task should be completable within the lesson timeframe. Avoid tasks that just mean \"write more\". Use UK English.',
        variables: ['[subject]', '[year group]', '[topic]', '[number]'],
        expectedOutput: 'Five extension activities offering depth, breadth and independence rather than volume.',
        followUp: 'Create a self-assessment rubric these students can use to evaluate the quality of their extension work.',
      },
      {
        title: 'Full Differentiation Audit for a Lesson',
        level: 'Advanced',
        bestFor: 'Teachers reviewing their lessons for inclusive practice or preparing for lesson observations',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK inclusion specialist conducting a differentiation audit. I will describe a lesson I have planned. Review it for inclusive practice and identify gaps.\\n\\nHere is my lesson plan:\\n[paste full lesson plan]\\n\\nAudit against these criteria:\\n1. **Access**: Can all students access the starter, main and plenary? What barriers exist?\\n2. **Challenge**: Is there genuine stretch for high-ability students, or just more volume?\\n3. **SEN**: Are adaptations specific to named needs, or generic \"extra time\"?\\n4. **EAL**: Is key vocabulary pre-taught? Are instructions clear for students with limited English?\\n5. **Assessment**: Do AfL checkpoints work for all ability levels?\\n6. **Resources**: Are handouts, slides and digital resources accessible (font size, layout, reading level)?\\n7. **Questioning**: Does the questioning sequence include differentiated questions?\\n\\nFor each criterion, give a rating (Strong / Developing / Gap) and one specific action I can take. End with 3 priority improvements.',
        variables: ['[paste full lesson plan]'],
        safeguarding: 'A differentiation audit supports but does not replace formal lesson observation feedback.',
        expectedOutput: 'A structured audit report with ratings and specific, actionable improvements.',
        followUp: 'Now rewrite the weakest section of my lesson plan incorporating your recommendations.',
      },
      {
        title: 'Universal Design for Learning (UDL) Lesson Converter',
        level: 'Advanced',
        bestFor: 'Teachers converting traditional lessons into UDL-aligned inclusive lessons',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK UDL (Universal Design for Learning) specialist. I have a traditionally structured [subject] lesson for Year [year group] on [topic]. Convert it into a UDL-aligned lesson.\\n\\nOriginal lesson: [paste or describe the lesson]\\n\\nRedesign using the three UDL principles:\\n\\n**Multiple means of engagement:**\\n- Offer choice in how students approach the task\\n- Build in relevance to students\u2019 lives\\n- Include self-regulation checkpoints\\n\\n**Multiple means of representation:**\\n- Present information in at least 3 formats (text, visual, audio/verbal)\\n- Pre-teach vocabulary with visual supports\\n- Provide a graphic organiser\\n\\n**Multiple means of action & expression:**\\n- Allow students to demonstrate learning in 2+ ways (written, spoken, drawn, built)\\n- Provide scaffolds that can be removed as competence grows\\n- Include clear rubrics\\n\\nMake the redesigned lesson practical and achievable with standard UK classroom resources. Include timings.',
        variables: ['[subject]', '[year group]', '[topic]', '[paste or describe the lesson]'],
        expectedOutput: 'A fully redesigned lesson using UDL principles with multiple pathways for engagement, representation and expression.',
        followUp: 'Create student-facing choice menus for the main activity section.',
      },
    ],
  },
  {
    id: 53,
    slug: 'senco-documentation-ehcp',
    category: 'SENCO & SEN Management',
    categorySlug: 'senco-management',
    title: 'SENCO Documentation & EHCP Support',
    description: 'Structured prompts for drafting EHCP contributions, SEN support plans, provision maps and annual review documentation.',
    useCase: 'Reducing SENCO admin time while maintaining quality, personalised documentation.',
    outcomes: ['Draft EHCP section contributions', 'SEN support plan templates', 'Annual review preparation notes'],
    promptCount: 6,
    senFocus: ['All SEN'],
    roles: ['SENCOs', 'Teachers'],
    stages: ['All ages'],
    featured: true,
    free: true,
    prompts: [
      {
        title: 'EHCP Section B Contribution Drafter',
        level: 'Beginner',
        bestFor: 'SENCOs drafting education sections for new EHCP applications',
        tools: ALL_TOOLS,
        prompt: 'Act as an experienced UK SENCO writing a contribution for Section B (Special Educational Needs) of an EHCP application.\\n\\nStudent context:\\n- Year group: [year group]\\n- Primary need: [primary SEN, e.g. autism spectrum condition]\\n- Additional needs: [any secondary needs]\\n- Current provision: [brief description of current support]\\n- Key strengths: [2-3 strengths]\\n- Key barriers to learning: [2-3 barriers]\\n\\nDraft a Section B contribution that:\\n1. Describes the child\u2019s SEN clearly and specifically\\n2. Uses evidence-based language (not vague statements like \"struggles with learning\")\\n3. References specific assessments or observations where I\u2019ve noted them\\n4. Separates cognition & learning needs from communication, SEMH and sensory/physical needs\\n5. Is written in objective, professional language appropriate for a legal document\\n6. Is approximately 400-600 words\\n\\nAsk me up to 3 clarifying questions if you need more detail before drafting.',
        variables: ['[year group]', '[primary SEN]', '[any secondary needs]', '[brief description of current support]', '[2-3 strengths]', '[2-3 barriers]'],
        safeguarding: 'EHCP contributions must be reviewed by the SENCO and verified against assessment evidence. AI drafts are starting points, not final documents. Do not include real student names in AI prompts.',
        expectedOutput: 'A professional, evidence-based draft for Section B of an EHCP application.',
        followUp: 'Now draft the Section F (special educational provision) to match these needs.',
      },
      {
        title: 'SEN Support Plan Generator',
        level: 'Beginner',
        bestFor: 'SENCOs and class teachers writing termly SEN support plans',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO. Create a termly SEN Support Plan for the following student:\\n\\n- Year group: [year group]\\n- SEN category: [category, e.g. Cognition & Learning]\\n- Specific need: [specific need]\\n- Current attainment: [brief summary]\\n- What\u2019s working well: [current successful strategies]\\n\\nThe plan should include:\\n1. Three SMART targets for this term (specific, measurable, achievable, relevant, time-bound)\\n2. Strategies and provision for each target (what the teacher, TA, and SENCO will do)\\n3. Success criteria (how we\u2019ll know the target has been met)\\n4. Resources needed\\n5. Review date and method\\n6. Student voice: a prompt I can use to gather the child\u2019s own views\\n7. Parent/carer contribution: a prompt I can use at the next meeting\\n\\nUse professional but accessible language that parents can understand.',
        variables: ['[year group]', '[category]', '[specific need]', '[brief summary]', '[current successful strategies]'],
        safeguarding: 'SEN support plans must reflect the assess-plan-do-review cycle. Targets should be agreed with parents/carers and the student where appropriate.',
        expectedOutput: 'A complete termly SEN support plan with SMART targets, strategies and review criteria.',
        followUp: 'Write a short, parent-friendly summary of this plan I can send home.',
      },
      {
        title: 'Annual Review Preparation Pack',
        level: 'Intermediate',
        bestFor: 'SENCOs preparing for EHCP annual reviews',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO preparing for an EHCP annual review. Help me prepare the documentation.\\n\\nStudent context:\\n- Year group: [year group]\\n- EHCP primary need: [primary need]\\n- Years with EHCP: [number]\\n- Current EHCP outcomes (Section E): [list current outcomes]\\n- This year\u2019s progress: [brief summary of progress]\\n\\nGenerate:\\n1. A progress summary for each EHCP outcome (met / partially met / not met, with evidence statements)\\n2. Recommended updated outcomes for next year (if changes needed)\\n3. Questions to ask in the annual review meeting\\n4. A contribution request template I can send to class teachers (asking them to comment on progress, strategies used, and what\u2019s working)\\n5. A one-page pupil voice activity I can use with the student before the meeting\\n6. Key discussion points for the meeting agenda\\n\\nUse professional, objective language suitable for a statutory review.',
        variables: ['[year group]', '[primary need]', '[number]', '[list current outcomes]', '[brief summary of progress]'],
        safeguarding: 'Annual reviews are statutory processes. AI-generated documentation must be verified against actual evidence and professional observations. Never use real student names in AI prompts.',
        expectedOutput: 'A comprehensive annual review preparation pack with progress summaries, updated outcomes and meeting materials.',
        followUp: 'Draft the covering letter to parents inviting them to the annual review, including their rights.',
      },
      {
        title: 'Provision Map Builder',
        level: 'Intermediate',
        bestFor: 'SENCOs mapping provision across a year group or department',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO creating a provision map. I need to map SEN provision for Year [year group] across [term/half-term].\\n\\nCurrent SEN register for this year group:\\n[List students by SEN category, e.g.:\\n- Cognition & Learning: 5 students (3 dyslexia, 2 MLD)\\n- SEMH: 3 students\\n- Communication & Interaction: 2 students (1 autism, 1 SLCN)\\n- Sensory/Physical: 1 student]\\n\\nCreate a provision map that shows:\\n1. Universal provision (Wave 1): what every student receives\\n2. Targeted provision (Wave 2): small group interventions, with frequency and duration\\n3. Specialist provision (Wave 3): 1:1 or specialist support\\n4. For each intervention, note: who delivers it, how often, group size, expected impact, and cost (TA hours)\\n5. A column for monitoring and review dates\\n\\nFormat as a table. Flag any gaps in provision or areas where we may be under-resourced.',
        variables: ['[year group]', '[term/half-term]', '[List students by SEN category]'],
        safeguarding: 'Provision maps should not include real student names when shared digitally or processed through AI tools.',
        expectedOutput: 'A structured provision map table with Wave 1/2/3 interventions, staffing and cost implications.',
        followUp: 'Calculate the approximate TA hours and cost for this provision map based on [hourly rate].',
      },
      {
        title: 'Tribunal-Ready Evidence Organiser',
        level: 'Advanced',
        bestFor: 'SENCOs preparing evidence for SEN tribunal or LA disagreements',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO with experience of SEND tribunal processes. I need to organise evidence for [situation, e.g. a parent appealing a refused EHCP assessment / a disagreement about provision in Section F].\\n\\nHelp me create:\\n1. An evidence timeline: key events in chronological order (I\u2019ll provide dates and events)\\n2. An evidence checklist: what documentation I should gather (assessments, reports, provision maps, minutes, correspondence)\\n3. A summary statement structure: how to write a clear, factual school statement covering the child\u2019s needs, provision to date, and outcomes\\n4. Questions I should anticipate from the panel\\n5. Red flags: common weaknesses in school evidence that tribunals challenge\\n6. A template for recording professional observations that would stand as evidence\\n\\nBe factual and objective. Do not provide legal advice \u2014 advise me to seek IPSEA or legal support where appropriate.',
        variables: ['[situation]'],
        safeguarding: 'This prompt supports organisation of evidence only. It does not constitute legal advice. SENCOs should contact IPSEA (ipsea.org.uk) or a SEN solicitor for tribunal guidance.',
        expectedOutput: 'An evidence organisation framework with timeline, checklist and statement structure.',
        followUp: 'Write a template for the school\u2019s factual statement, with section headings and guidance notes.',
      },
      {
        title: 'Graduated Response Documentation',
        level: 'Advanced',
        bestFor: 'SENCOs evidencing the graduated response (assess-plan-do-review) across multiple cycles',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO documenting the graduated response for a student where we may need to request an EHCP needs assessment. The LA will want to see evidence of at least 3 cycles of assess-plan-do-review.\\n\\nStudent context:\\n- Year group: [year group]\\n- SEN: [specific needs]\\n- Time on SEN Support: [duration]\\n- Number of review cycles completed: [number]\\n\\nFor each cycle, create a documentation template with:\\n1. **Assess**: What assessments were used? What did they show? (Include standardised scores, teacher observations, student/parent views)\\n2. **Plan**: What targets were set? What provision was put in place? Who was responsible?\\n3. **Do**: How was the plan implemented? Any modifications during the cycle?\\n4. **Review**: What was the outcome? Were targets met? What evidence supports this?\\n\\nAlso generate:\\n- A covering letter to the LA requesting a needs assessment, referencing the evidence\\n- A one-page summary showing the student\u2019s trajectory over all cycles\\n\\nUse formal, evidence-based language throughout.',
        variables: ['[year group]', '[specific needs]', '[duration]', '[number]'],
        safeguarding: 'Graduated response documentation must include real assessment data and professional observations. AI helps with structure and language but cannot generate evidence.',
        expectedOutput: 'A multi-cycle graduated response documentation pack with templates, covering letter and progress summary.',
        followUp: 'Create a parent-friendly version of the progress summary I can share at the next review meeting.',
      },
    ],
  },
  {
    id: 54,
    slug: 'parent-communication-templates',
    category: 'Teacher Professional Practice',
    categorySlug: 'teacher-practice',
    title: 'Professional Parent Communication',
    description: 'Ready-to-adapt templates for parent emails, meeting preparation, difficult conversations and progress updates. Respectful, professional and jargon-free.',
    useCase: 'Writing parent communications that are clear, professional and build trust.',
    outcomes: ['Professional email templates', 'Meeting preparation frameworks', 'Difficult conversation scripts'],
    promptCount: 6,
    senFocus: ['All SEN'],
    roles: ['Teachers', 'SENCOs'],
    stages: ['All ages'],
    featured: false,
    free: true,
    prompts: [
      {
        title: 'Positive Progress Update Email',
        level: 'Beginner',
        bestFor: 'Teachers sending regular updates to parents about their child\u2019s progress',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject/form] teacher writing a professional email to a parent/carer. The email should share positive news about their child\u2019s progress.\\n\\nContext:\\n- Student year group: [year group]\\n- What the student has done well: [describe achievement or improvement]\\n- Subject/area: [subject or pastoral area]\\n\\nWrite a warm, professional email that:\\n1. Opens with something specific and positive (not generic \"doing well\")\\n2. Describes what the student has achieved in concrete terms\\n3. Explains why this matters for their learning\\n4. Suggests one thing the parent could do to support continued progress\\n5. Closes warmly with an invitation to get in touch\\n\\nKeep it under 150 words. Use UK English. Avoid educational jargon.',
        variables: ['[subject/form]', '[year group]', '[describe achievement or improvement]', '[subject or pastoral area]'],
        expectedOutput: 'A short, warm, professional parent email celebrating specific student progress.',
        followUp: 'Write a version of this email for a parent who rarely engages with school communication.',
      },
      {
        title: 'Concern or Behaviour Email',
        level: 'Intermediate',
        bestFor: 'Teachers raising a concern without damaging the home-school relationship',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject/form] teacher writing a professional email to a parent/carer about a concern. The tone must be factual, respectful and solution-focused \u2014 never blaming.\\n\\nContext:\\n- Year group: [year group]\\n- Concern: [describe the concern factually, e.g. \"missed 3 homework deadlines this term\" or \"involved in a disagreement with another student\"]\\n- What school has already done: [any steps taken]\\n- What you\u2019d like from the parent: [e.g. a phone call, a meeting, support at home]\\n\\nWrite an email that:\\n1. Opens with something positive about the student\\n2. States the concern factually without judgement\\n3. Explains what school has done to support\\n4. Asks for partnership (not compliance)\\n5. Offers next steps and a way to discuss further\\n6. Closes respectfully\\n\\nKeep it under 200 words. Avoid jargon. Use UK English.',
        variables: ['[subject/form]', '[year group]', '[describe the concern]', '[any steps taken]', '[what you\u2019d like from the parent]'],
        safeguarding: 'If the concern relates to safeguarding, follow your school\u2019s safeguarding policy. Do not communicate safeguarding concerns via email without DSL guidance.',
        expectedOutput: 'A balanced, professional concern email that maintains the home-school relationship.',
        followUp: 'Write a follow-up email for if the parent doesn\u2019t respond within 5 working days.',
      },
      {
        title: 'SEN Meeting Preparation Framework',
        level: 'Intermediate',
        bestFor: 'Teachers and SENCOs preparing for SEN review meetings with parents',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO preparing for a [type of meeting, e.g. SEN support review / annual review / initial SEN concern meeting] with the parents of a Year [year group] student.\\n\\nStudent context:\\n- SEN need: [describe]\\n- Current provision: [describe]\\n- Recent progress: [brief summary]\\n\\nPrepare:\\n1. An agenda for the meeting (5-6 points, 30 minutes total)\\n2. Opening script: how to start the meeting positively\\n3. Key talking points for each agenda item\\n4. 3 questions to ask the parent to hear their perspective\\n5. 2 questions to ask the student (if attending)\\n6. How to handle the conversation if the parent becomes upset or frustrated\\n7. A closing summary template (agreed actions, who does what, review date)\\n8. A follow-up email template confirming what was discussed\\n\\nUse accessible language. Avoid acronyms unless you define them.',
        variables: ['[type of meeting]', '[year group]', '[describe]', '[describe]', '[brief summary]'],
        safeguarding: 'If a meeting may be contentious, consider having a second professional present. Follow your school\u2019s meeting protocols.',
        expectedOutput: 'A complete meeting preparation pack with agenda, scripts, questions and follow-up template.',
        followUp: 'Write a one-page summary sheet I can give to the parent at the end of the meeting.',
      },
      {
        title: 'Difficult Conversation Planning Script',
        level: 'Advanced',
        bestFor: 'Teachers preparing for a challenging conversation with parents about SEN, behaviour or progress',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK senior leader experienced in managing difficult parent conversations. I need to have a conversation about [describe the situation, e.g. recommending an EHCP referral when parents are resistant / discussing persistent behaviour concerns / explaining an exclusion decision].\\n\\nPrepare a conversation framework:\\n\\n1. **Before the meeting**: Key facts I must have ready. Documents to bring. Who should be present.\\n2. **Opening** (2 mins): How to set a collaborative tone and establish the purpose\\n3. **Listening phase** (5 mins): Open questions to understand the parent\u2019s perspective first\\n4. **School perspective** (5 mins): How to present the situation factually, using evidence not opinion\\n5. **Shared concern** (3 mins): Finding common ground (\u201cWe both want [child] to\u2026\u201d)\\n6. **Next steps** (5 mins): Proposing actions with parent input\\n7. **Contingency scripts**: What to say if the parent becomes angry / tearful / threatens to complain / disagrees entirely\\n8. **Closing** (2 mins): Confirming what was agreed, offering continued support\\n\\nGive me actual suggested phrases I can use, not just descriptions of what to say.',
        variables: ['[describe the situation]'],
        safeguarding: 'If there is a safeguarding dimension to the conversation, seek DSL advice before the meeting. Record the meeting contemporaneously.',
        expectedOutput: 'A timed conversation framework with actual scripts, contingency responses and follow-up actions.',
        followUp: 'Write a post-meeting record template I can complete immediately afterwards.',
      },
      {
        title: 'Whole-School Parent Communication Audit',
        level: 'Advanced',
        bestFor: 'Senior leaders reviewing parent communication quality across the school',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK school improvement consultant. Audit our school\u2019s parent communication practices and suggest improvements.\\n\\nOur current communication channels: [list channels, e.g. email, text, app, newsletter, website, social media, parents\u2019 evenings]\\n\\nFor each channel, assess:\\n1. Accessibility: Can all parents access this? (consider digital poverty, EAL, disability)\\n2. Tone: Is it warm and inviting or bureaucratic and cold?\\n3. Frequency: Too much, too little, or about right?\\n4. Inclusivity: Does it work for separated families, foster carers, grandparent carers?\\n5. Two-way: Can parents respond, ask questions, share concerns?\\n\\nThen provide:\\n- 5 quick wins we could implement this half-term\\n- 3 longer-term improvements for next academic year\\n- A template for a termly parent communication calendar\\n- Suggested wording for our \"how to contact us\" page\\n\\nReference Ofsted\u2019s expectations around parent engagement.',
        variables: ['[list channels]'],
        expectedOutput: 'A full communication audit with quick wins, longer-term improvements and templates.',
        followUp: 'Write a parent-friendly survey (10 questions) we could send to evaluate our communications.',
      },
      {
        title: 'Multilingual & EAL Parent Communication',
        level: 'Beginner',
        bestFor: 'Teachers communicating with parents who have limited English',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK teacher writing a [type of communication, e.g. welcome letter / homework reminder / meeting invitation / progress update] for a parent who speaks [language] as their first language and has limited English.\\n\\nWrite two versions:\\n1. A clear, simple English version using:\\n   - Short sentences (max 10 words each)\\n   - No idioms, metaphors or educational jargon\\n   - Visual cues described (e.g. \"see the picture of the calendar\")\\n   - Key dates and actions in bold\\n\\n2. Key phrases translated into [language] (provide the 5 most important sentences)\\n\\nAlso suggest:\\n- Whether this communication should be a phone call instead\\n- Whether a translator should be arranged\\n- Visual aids I could include\\n\\nBe culturally sensitive. Avoid assumptions about the family.',
        variables: ['[type of communication]', '[language]'],
        safeguarding: 'For safeguarding communications, always use a professional interpreter. Do not rely on family members (including children) to translate sensitive information.',
        expectedOutput: 'A clear, accessible communication in simple English with key translated phrases.',
        followUp: 'Create a visual welcome pack for EAL families joining our school mid-year.',
      },
    ],
  },
  {
    id: 55,
    slug: 'ofsted-preparation',
    category: 'School Leadership',
    categorySlug: 'school-leadership',
    title: 'Ofsted Preparation & Self-Evaluation',
    description: 'Strategic prompts for Ofsted readiness, SEF writing, deep dive preparation and quality of education evidence gathering.',
    useCase: 'Preparing school leaders and subject leads for inspection with confidence.',
    outcomes: ['SEF section drafts', 'Deep dive preparation notes', 'Evidence gathering frameworks'],
    promptCount: 6,
    senFocus: [],
    roles: ['School Leaders'],
    stages: ['All ages'],
    featured: true,
    free: true,
    prompts: [
      {
        title: 'SEF Quality of Education Section Drafter',
        level: 'Beginner',
        bestFor: 'Headteachers and deputies writing or updating the self-evaluation form',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK Ofsted inspection specialist. Help me draft the Quality of Education section of our school self-evaluation form (SEF).\\n\\nSchool context:\\n- Phase: [primary/secondary/all-through]\\n- Ofsted rating: [current rating]\\n- Key strengths in curriculum: [list 2-3]\\n- Areas for development: [list 1-2]\\n- Recent data headlines: [brief summary, e.g. \"Progress 8 score of +0.3\"]\\n\\nDraft the section covering:\\n1. **Intent**: What is our curriculum designed to achieve? How does it meet the needs of our students, including disadvantaged and SEND?\\n2. **Implementation**: How is the curriculum taught? What does good teaching look like here? How do we ensure consistency?\\n3. **Impact**: What do outcomes tell us? How do we know students are learning the intended curriculum?\\n\\nUse evaluative language (not descriptive). Each paragraph should make a claim, provide evidence, and explain impact. Keep it under 800 words.',
        variables: ['[primary/secondary/all-through]', '[current rating]', '[list 2-3]', '[list 1-2]', '[brief summary]'],
        expectedOutput: 'An evaluative SEF section structured around intent, implementation and impact with evidence.',
        followUp: 'Now write the Personal Development section using the same evaluative approach.',
      },
      {
        title: 'Subject Deep Dive Preparation',
        level: 'Intermediate',
        bestFor: 'Subject leads preparing for a curriculum deep dive',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK Ofsted inspector conducting a deep dive into [subject] at a [phase] school. Help me prepare as the subject lead.\\n\\nGenerate a preparation pack:\\n\\n1. **Likely questions the inspector will ask me** (10 questions covering intent, implementation, impact, SEND, reading, assessment)\\n2. **For each question**: A suggested answer framework (what to include, what evidence to reference)\\n3. **Lesson visit preparation**: What inspectors look for in lesson visits and what I should ensure teachers are doing\\n4. **Book look preparation**: What inspectors look for in student work and what I should check\\n5. **Student conversation prep**: Questions inspectors ask students and how to prepare students without coaching\\n6. **Red flags**: Common weaknesses that inspectors identify in [subject] deep dives\\n7. **Evidence to have ready**: A checklist of documents, data and examples I should have to hand\\n\\nBase this on the current Ofsted inspection handbook and [subject]-specific research review.',
        variables: ['[subject]', '[phase]'],
        expectedOutput: 'A comprehensive deep dive preparation pack with questions, answer frameworks and evidence checklists.',
        followUp: 'Create a one-page subject summary card I can have in my pocket during the inspection.',
      },
      {
        title: 'SEND Deep Dive Preparation',
        level: 'Intermediate',
        bestFor: 'SENCOs and senior leaders preparing for SEND-focused inspection activity',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK Ofsted inspector with a focus on SEND. I am the SENCO at a [phase] school with [number] students on the SEN register ([number] EHCP, [number] SEN Support).\\n\\nPrepare me for SEND inspection activity:\\n\\n1. **10 questions an inspector is likely to ask me** (covering identification, provision, outcomes, graduated response, EHCP quality, parent engagement)\\n2. **Answer frameworks** for each question with evidence I should reference\\n3. **Case study preparation**: Help me structure 3 case studies showing the journey of a student with SEN (identification \u2192 assessment \u2192 provision \u2192 outcomes)\\n4. **Lesson visit lens**: What inspectors look for regarding SEND in mainstream lessons\\n5. **Parent voice**: How inspectors gauge parent satisfaction with SEND provision and what to prepare\\n6. **Documentation check**: Exactly what SEND paperwork should be easily accessible\\n7. **Common SEND weaknesses**: What triggers further investigation or a \"requires improvement\" judgement for SEND\\n\\nReference the current SEND Code of Practice (2015) and Ofsted handbook.',
        variables: ['[phase]', '[number]', '[number]', '[number]'],
        safeguarding: 'Case studies prepared for inspection should be anonymised. Real student journeys should be discussed with parents before being shared.',
        expectedOutput: 'A SEND-specific inspection preparation pack with questions, case study structures and documentation checklists.',
        followUp: 'Draft one sample case study using a fictional student, showing what good SEND provision looks like.',
      },
      {
        title: 'Post-Inspection Action Plan Generator',
        level: 'Advanced',
        bestFor: 'School leaders creating action plans after an inspection or monitoring visit',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK school improvement partner. We have just received our Ofsted report. Help me create a strategic action plan.\\n\\nInspection outcome: [rating]\\nKey strengths identified: [list]\\nAreas for improvement identified: [list from the report]\\n\\nCreate an action plan that:\\n1. Turns each area for improvement into 2-3 SMART objectives\\n2. For each objective: specific actions, responsible person, resources needed, timeline, success criteria, monitoring method\\n3. Prioritises: what to do in the first 2 weeks, first half-term, first term, first year\\n4. Identifies quick wins that will show rapid impact\\n5. Includes a governor monitoring schedule\\n6. Includes a staff communication plan (how to share the report and plan positively)\\n7. Includes a parent communication plan\\n\\nMake it realistic for a [size, e.g. two-form entry primary] school with [describe staffing context].',
        variables: ['[rating]', '[list]', '[list from the report]', '[size]', '[describe staffing context]'],
        expectedOutput: 'A prioritised, timed action plan with SMART objectives, responsibilities and monitoring.',
        followUp: 'Write the staff briefing script for sharing this action plan positively at the next staff meeting.',
      },
      {
        title: 'Governor Challenge Questions Bank',
        level: 'Advanced',
        bestFor: 'Chairs of governors and governance professionals preparing for committee meetings',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK governance specialist. Generate a bank of effective challenge questions for governors, organised by Ofsted judgement area.\\n\\n**Quality of Education** (10 questions):\\n- Questions about curriculum intent, implementation and impact\\n- Questions about disadvantaged and SEND outcomes\\n\\n**Behaviour and Attitudes** (8 questions):\\n- Questions about attendance, behaviour culture, bullying\\n\\n**Personal Development** (8 questions):\\n- Questions about SMSC, character, careers, RSE\\n\\n**Leadership and Management** (10 questions):\\n- Questions about safeguarding, staff wellbeing, CPD, finance\\n\\nFor each question:\\n- Explain what a good answer would include\\n- Flag what should concern governors if the answer is vague or missing\\n- Note what evidence to request\\n\\nMake questions probing but respectful. Governors should support and challenge, not interrogate.',
        variables: [],
        expectedOutput: 'A structured question bank organised by Ofsted area with guidance on what good answers look like.',
        followUp: 'Create a one-page summary governors can bring to their next committee meeting.',
      },
      {
        title: 'Rapid Inspection Readiness Audit',
        level: 'Beginner',
        bestFor: 'Headteachers who want a quick sense-check of inspection readiness',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK Ofsted preparation consultant. Run a rapid readiness audit for my school.\\n\\nAsk me 20 yes/no questions covering the most common areas where schools are caught out during inspection:\\n\\n- Safeguarding (SCR, DSL training, policy currency)\\n- Curriculum (documented intent, subject leadership)\\n- SEND (identification, provision, graduated response documentation)\\n- Attendance and behaviour (data, systems, culture)\\n- Governance (minutes, monitoring visits, challenge evidence)\\n- Website compliance (statutory information, policies)\\n- Staff knowledge (safeguarding, curriculum rationale, school priorities)\\n\\nAfter I answer, give me:\\n1. A RAG-rated summary (Red/Amber/Green for each area)\\n2. The 3 most urgent things to fix this week\\n3. A 30-day readiness action plan\\n\\nAsk the questions one area at a time.',
        variables: [],
        expectedOutput: 'An interactive audit followed by a RAG-rated summary and prioritised action plan.',
        followUp: 'Create a staff quiz I can use in the next INSET to check whole-school inspection readiness.',
      },
    ],
  },
  {
    id: 56,
    slug: 'school-ai-policy',
    category: 'School Leadership',
    categorySlug: 'school-leadership',
    title: 'School AI Policy Development',
    description: 'Prompts for developing, implementing and communicating a whole-school AI policy aligned with KCSIE, DfE guidance and GDPR.',
    useCase: 'Creating robust, practical AI policies that protect students while enabling staff to use AI effectively.',
    outcomes: ['Draft AI acceptable use policies', 'Staff and student guidance', 'Risk assessment frameworks'],
    promptCount: 6,
    senFocus: [],
    roles: ['School Leaders', 'Teachers'],
    stages: ['All ages'],
    featured: false,
    free: true,
    prompts: [
      {
        title: 'Whole-School AI Policy Drafter',
        level: 'Beginner',
        bestFor: 'School leaders creating their first AI policy',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK school policy adviser specialising in educational technology. Draft a whole-school AI acceptable use policy for a [phase] school.\\n\\nThe policy should cover:\\n1. Purpose and scope\\n2. Definition of AI tools (with examples relevant to education)\\n3. Approved AI tools for staff use (list common ones and explain the approval process)\\n4. AI tools that are not permitted and why\\n5. Student use of AI: what is allowed, what is not, by key stage\\n6. Data protection: what data can/cannot be entered into AI tools (reference UK GDPR)\\n7. Academic integrity: how AI use in student work should be declared\\n8. Safeguarding: risks of AI (deepfakes, chatbot interactions, data exposure) and mitigations\\n9. Staff training requirements\\n10. Review date and responsible person\\n\\nAlign with KCSIE 2025, DfE AI guidance, and ICO guidelines. Use clear, accessible language. Include a one-page summary version for parents.',
        variables: ['[phase]'],
        expectedOutput: 'A complete draft AI acceptable use policy with parent summary.',
        followUp: 'Create a student-facing version of this policy written in age-appropriate language for [key stage].',
      },
      {
        title: 'AI Risk Assessment for Schools',
        level: 'Intermediate',
        bestFor: 'DSLs and senior leaders assessing AI-related risks',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK school safeguarding consultant. Create an AI-specific risk assessment for a [phase] school.\\n\\nFor each risk, provide: description, likelihood (1-5), impact (1-5), risk rating, existing controls, and additional controls needed.\\n\\nCover these risk areas:\\n1. Students sharing personal data with AI chatbots\\n2. AI-generated misinformation used in student work\\n3. Staff entering student data into non-approved AI tools\\n4. AI-generated deepfake images or content involving students\\n5. Students using AI to bypass academic integrity\\n6. AI tools with inadequate age verification\\n7. Over-reliance on AI reducing critical thinking skills\\n8. AI bias affecting SEN identification or assessment\\n9. Third-party AI tools changing terms of service (data usage)\\n10. Staff using AI for references, reports or safeguarding notes without review\\n\\nFormat as a risk assessment table. Reference KCSIE 2025 and DfE guidance.',
        variables: ['[phase]'],
        safeguarding: 'This risk assessment should be reviewed by the DSL and governing body. It should be updated at least annually or when significant AI developments occur.',
        expectedOutput: 'A comprehensive AI risk assessment table with ratings, controls and recommended actions.',
        followUp: 'Create a termly AI risk review checklist that the DSL can complete in 15 minutes.',
      },
      {
        title: 'Staff AI Training Plan',
        level: 'Intermediate',
        bestFor: 'Senior leaders planning CPD for staff AI literacy',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK CPD coordinator. Design a 12-month staff AI training plan for a [phase] school where most staff are [describe current AI confidence, e.g. beginners / mixed / some early adopters].\\n\\nCreate a phased plan:\\n\\n**Phase 1 (Term 1): Awareness**\\n- 2 x 1-hour INSET sessions: objectives, content, activities\\n- Key message: AI is a tool, not a threat\\n\\n**Phase 2 (Term 2): Practical Skills**\\n- 3 x 30-minute lunchtime workshops: specific tools, prompting skills, classroom applications\\n- Teacher peer-coaching pairs\\n\\n**Phase 3 (Terms 3-4): Confident Use**\\n- Department-specific AI integration tasks\\n- Sharing best practice in staff meetings\\n- Student-facing AI guidance development\\n\\n**Phase 4 (Terms 5-6): Leadership**\\n- AI champions in each department\\n- Policy review with staff input\\n- Impact evaluation\\n\\nFor each session, provide: objectives, suggested content, time needed, resources, and how to evaluate impact.',
        variables: ['[phase]', '[describe current AI confidence]'],
        expectedOutput: 'A complete 12-month phased CPD plan with session outlines and evaluation methods.',
        followUp: 'Write the slide deck outline for the first INSET session.',
      },
      {
        title: 'AI Academic Integrity Framework',
        level: 'Advanced',
        bestFor: 'Senior leaders and heads of department establishing clear AI use expectations',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK assessment integrity specialist. Create a whole-school AI academic integrity framework that is practical, fair and enforceable.\\n\\nThe framework should include:\\n\\n1. **AI Use Spectrum**: Define 5 levels from \"no AI\" to \"AI-assisted\" to \"AI-generated\" with clear examples for each\\n2. **Subject-specific guidance**: For [3 subjects, e.g. English, Science, History], specify which AI use is acceptable for coursework, homework and classwork\\n3. **Declaration system**: A simple form students complete declaring how AI was used in any assessed work\\n4. **Detection approach**: Realistic guidance on what teachers can and cannot detect (avoid false confidence in AI detectors)\\n5. **Consequence framework**: Graduated responses from educational conversation to formal sanction\\n6. **Positive framing**: How to teach students to use AI as a learning tool rather than a shortcut\\n7. **Parent communication**: A letter explaining the policy\\n\\nBe realistic \u2014 students will use AI. The framework should channel that use productively rather than creating an arms race.',
        variables: ['[3 subjects]'],
        expectedOutput: 'A comprehensive AI academic integrity framework with spectrum, subject guidance and consequences.',
        followUp: 'Create an assembly presentation introducing this framework to students in an engaging, non-punitive way.',
      },
      {
        title: 'AI Data Protection Impact Assessment',
        level: 'Advanced',
        bestFor: 'DPOs and senior leaders assessing GDPR compliance of AI tools',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK school data protection officer. Conduct a Data Protection Impact Assessment (DPIA) for the use of [AI tool name] in our [phase] school.\\n\\nAssess:\\n1. **Data processed**: What personal data (student, staff, parent) could be entered into this tool?\\n2. **Lawful basis**: Which lawful basis applies? Is consent needed?\\n3. **Data controller/processor**: Who controls the data? Where is it stored? Is it transferred outside the UK?\\n4. **Retention**: How long does the tool retain data? Can it be deleted?\\n5. **Security**: What security measures does the provider have? Is data encrypted?\\n6. **Rights**: Can data subjects exercise their GDPR rights (access, deletion, portability)?\\n7. **Children\u2019s data**: Does the tool comply with the Children\u2019s Code (ICO Age Appropriate Design Code)?\\n8. **Risk assessment**: What are the risks to data subjects and how are they mitigated?\\n9. **Recommendation**: Approve / Approve with conditions / Do not approve\\n\\nFormat as a formal DPIA document. Reference UK GDPR and the ICO\u2019s guidance for education.',
        variables: ['[AI tool name]', '[phase]'],
        expectedOutput: 'A formal DPIA document with risk assessment and approval recommendation.',
        followUp: 'Create a simplified checklist version that subject leads can complete when requesting a new AI tool.',
      },
      {
        title: 'Parent AI Information Evening Planner',
        level: 'Beginner',
        bestFor: 'Schools planning parent engagement around AI',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK school community engagement specialist. Plan a 90-minute parent information evening about AI in education.\\n\\nDesign the evening:\\n\\n1. **Welcome and context** (10 mins): Script for the head teacher. Key message: \"AI is here, we\u2019re managing it, here\u2019s how.\"\\n2. **What is AI?** (15 mins): A jargon-free explanation with live demos of ChatGPT, Claude or Gemini\\n3. **How school uses AI** (10 mins): Examples of staff and student use\\n4. **Keeping children safe** (15 mins): Age-appropriate AI use, risks, and what school does to mitigate them\\n5. **What parents can do** (15 mins): Practical tips for managing AI at home\\n6. **Q&A** (15 mins): Anticipated questions and suggested answers\\n7. **Resources to take home** (5 mins): One-page handout summary\\n\\nFor each section, provide: talking points, any slides needed, and potential parent concerns to pre-empt.\\n\\nTone: reassuring, honest, not technophobic. Assume parents have varied tech confidence.',
        variables: [],
        expectedOutput: 'A complete evening plan with scripts, talking points and a parent handout.',
        followUp: 'Write the one-page parent handout: \"AI at Home \u2014 A Guide for Families.\"',
      },
    ],
  },
  {
    id: 57,
    slug: 'structured-revision-frameworks',
    category: 'Exam & Test Preparation',
    categorySlug: 'exam-preparation',
    title: 'Structured Revision Frameworks',
    description: 'Evidence-based revision prompts using retrieval practice, spaced repetition and interleaving. Designed for GCSE and A-Level students.',
    useCase: 'Building effective, personalised revision plans that go beyond re-reading notes.',
    outcomes: ['Retrieval practice quizzes', 'Spaced repetition schedules', 'Active recall frameworks'],
    promptCount: 6,
    senFocus: ['ADHD', 'Anxiety'],
    roles: ['Students', 'Teachers', 'Parents'],
    stages: ['GCSE', 'A-Level'],
    featured: false,
    free: true,
    prompts: [
      {
        title: 'Retrieval Practice Quiz Generator',
        level: 'Beginner',
        bestFor: 'Students who want quick self-testing on a topic',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher creating a retrieval practice quiz for a [GCSE/A-Level] student.\\n\\nTopic: [topic]\\nExam board: [exam board]\\n\\nCreate a 15-question quiz:\\n- Questions 1-5: Basic recall (1 mark each)\\n- Questions 6-10: Application (2 marks each)\\n- Questions 11-13: Analysis (3 marks each)\\n- Questions 14-15: Evaluation (4 marks each)\\n\\nFor each question:\\n- Write the question clearly\\n- Provide the mark scheme answer\\n- Note the key term or concept being tested\\n\\nDo not include multiple choice \u2014 use short answer and extended response only, as these produce stronger retrieval effects. Base all content on the [exam board] specification.',
        variables: ['[subject]', '[GCSE/A-Level]', '[topic]', '[exam board]'],
        expectedOutput: 'A 15-question retrieval quiz with mark scheme answers, progressing from recall to evaluation.',
        followUp: 'Create a second quiz on the same topic testing different aspects, so I can use it for spaced practice next week.',
      },
      {
        title: 'Personalised Revision Timetable Builder',
        level: 'Beginner',
        bestFor: 'Students who struggle to plan their revision time',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK revision coach. Create a personalised revision timetable for me.\\n\\nMy details:\\n- Subjects: [list all subjects]\\n- Exam dates: [list exam dates if known, or say \"May/June\"]\\n- Weakest topics: [list 3-4 topics I find hardest]\\n- Available revision hours per day: [number] on school days, [number] on weekends\\n- Commitments I can\u2019t move: [list any, e.g. football on Tuesdays]\\n- How I revise best: [e.g. short bursts / long sessions / mornings / evenings]\\n\\nCreate a [2-week / 4-week / full revision period] timetable that:\\n1. Uses spaced repetition (revisit topics at increasing intervals)\\n2. Prioritises weak topics without neglecting strong ones\\n3. Includes breaks (Pomodoro: 25 min work, 5 min break)\\n4. Interleaves subjects (no more than 2 hours on one subject per day)\\n5. Includes at least 2 practice paper sessions per week\\n6. Has one rest day per week\\n\\nFormat as a day-by-day schedule I can print out.',
        variables: ['[list all subjects]', '[list exam dates]', '[list 3-4 topics]', '[number]', '[number]', '[list any]', '[e.g. short bursts]', '[2-week / 4-week / full revision period]'],
        expectedOutput: 'A day-by-day revision timetable using evidence-based techniques.',
        followUp: 'I fell behind by 2 days. Adjust the timetable to catch up without overwhelming me.',
      },
      {
        title: 'Exam Technique Walkthrough',
        level: 'Intermediate',
        bestFor: 'Students preparing for specific question types',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] examiner for [exam board]. Walk me through exactly how to answer a [mark value]-mark [question type, e.g. \"evaluate\" / \"explain\" / \"compare\" / \"to what extent\"] question.\\n\\nProvide:\\n1. What the command word means and what the examiner expects\\n2. A step-by-step method for structuring my answer\\n3. How to allocate my time (if this appears in a [duration]-minute paper)\\n4. A paragraph-by-paragraph plan with sentence starters\\n5. Common mistakes students make on this question type\\n6. What gets full marks vs. what gets half marks \u2014 with examples\\n7. A model answer for this question: [paste or describe the question]\\n8. An examiner commentary explaining why the model answer would score well\\n\\nBase everything on the [exam board] mark scheme conventions.',
        variables: ['[subject]', '[exam board]', '[mark value]', '[question type]', '[duration]', '[paste or describe the question]'],
        expectedOutput: 'A complete exam technique guide with method, model answer and examiner commentary.',
        followUp: 'Now mark this answer I wrote using the same mark scheme: [paste student answer].',
      },
      {
        title: 'Spaced Repetition Flashcard Generator',
        level: 'Intermediate',
        bestFor: 'Students building long-term memory through active recall',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher and memory science expert. Create a set of spaced repetition flashcards for [topic] at [GCSE/A-Level] level ([exam board]).\\n\\nGenerate 20 flashcards:\\n- Front: A question, prompt or key term\\n- Back: The answer, definition or explanation\\n\\nOrganise them into 3 difficulty tiers:\\n- Tier 1 (cards 1-8): Core knowledge every student must know\\n- Tier 2 (cards 9-15): Deeper understanding and application\\n- Tier 3 (cards 16-20): Stretch \u2014 connections, evaluation, synoptic links\\n\\nAlso provide:\\n- A suggested spaced repetition schedule (when to review each tier over 4 weeks)\\n- 3 \"interleaving\" questions that connect this topic to [related topic]\\n\\nMake the questions specific, not vague. \"What is osmosis?\" is weak. \"Explain why a red blood cell would lyse in distilled water\" is strong.',
        variables: ['[subject]', '[topic]', '[GCSE/A-Level]', '[exam board]', '[related topic]'],
        expectedOutput: '20 tiered flashcards with a spaced repetition schedule and interleaving questions.',
        followUp: 'Test me on 5 random cards from Tier 2. Give me feedback on my answers.',
      },
      {
        title: 'Practice Paper Analysis & Improvement Plan',
        level: 'Advanced',
        bestFor: 'Students learning from past paper attempts',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher and exam coach. I have just completed a practice paper and want to learn from my mistakes.\\n\\nHere are my results:\\n- Paper: [exam board, paper number, year]\\n- My score: [score] out of [total]\\n- Questions I got wrong or partially wrong: [list question numbers and what I wrote, or paste my answers]\\n\\nAnalyse my performance:\\n1. **Diagnosis**: For each wrong/partial answer, identify whether the error was: knowledge gap, misread question, poor exam technique, time management, or careless mistake\\n2. **Pattern spotting**: Are there recurring weaknesses across questions?\\n3. **Priority topics**: Which 3 topics would give me the biggest mark improvement if I revised them?\\n4. **Technique fixes**: Which exam skills need practice (e.g. evaluate questions, data analysis, extended writing)?\\n5. **Action plan**: A specific 1-week plan to address the top 3 issues before my next practice paper\\n6. **Rewrite**: For my worst answer, show me what a full-mark response would look like\\n\\nBe honest but encouraging.',
        variables: ['[subject]', '[exam board, paper number, year]', '[score]', '[total]', '[list question numbers]'],
        expectedOutput: 'A diagnostic analysis of practice paper performance with an actionable improvement plan.',
        followUp: 'Rewrite my answer to question [number] to show me what full marks looks like.',
      },
      {
        title: 'Exam Day Strategy & Anxiety Management',
        level: 'Advanced',
        bestFor: 'Students who need a structured exam day plan to manage stress',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK exam coach and wellbeing specialist. Create a complete exam day strategy for me.\\n\\nMy exam: [subject], [date], [morning/afternoon], [duration]\\nMy main exam anxiety: [describe, e.g. time pressure / going blank / panicking on hard questions]\\n\\nCreate:\\n\\n**The night before:**\\n- What to review (max 30 mins)\\n- What to prepare (bag, equipment, water)\\n- A wind-down routine\\n\\n**Exam morning:**\\n- Wake-up time and routine\\n- What to eat and drink\\n- A 2-minute breathing exercise I can do outside the exam hall\\n\\n**First 5 minutes of the exam:**\\n- Reading time strategy\\n- How to choose which question to start with\\n- What to write on the question paper before I start\\n\\n**During the exam:**\\n- Time allocation per question for a [duration]-minute paper worth [marks] marks\\n- What to do when I get stuck (a specific 60-second protocol)\\n- How to manage the urge to rush at the end\\n\\n**If I panic:**\\n- A grounding technique I can do at my desk\\n- A self-talk script (3 sentences)\\n\\nMake it specific to my exam, not generic.',
        variables: ['[subject]', '[date]', '[morning/afternoon]', '[duration]', '[describe]', '[marks]'],
        safeguarding: 'If exam anxiety is significantly affecting a student\u2019s wellbeing, consider speaking to the school counsellor or applying for access arrangements.',
        expectedOutput: 'A complete exam day plan from the night before through to the final minute.',
        followUp: 'Create a quick-reference card I can look at in the 10 minutes before I go into the exam hall.',
      },
    ],
  },
  {
    id: 58,
    slug: 'expert-exam-feedback',
    category: 'Exam & Test Preparation',
    categorySlug: 'exam-preparation',
    title: 'Expert Exam Feedback & Marking Support',
    description: 'Prompts for teachers to generate specific, mark-scheme-aligned feedback that helps students improve. Saves marking time while increasing feedback quality.',
    useCase: 'Writing targeted feedback on student exam answers, mock papers and assessed work.',
    outcomes: ['Mark-scheme-aligned feedback', 'WWW/EBI comments', 'Model answer comparisons'],
    promptCount: 6,
    senFocus: ['All SEN'],
    roles: ['Teachers'],
    stages: ['GCSE', 'A-Level'],
    featured: false,
    free: true,
    prompts: [
      {
        title: 'Mark Scheme Feedback Generator',
        level: 'Beginner',
        bestFor: 'Teachers giving feedback on a specific exam answer',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] examiner for [exam board]. I will paste a student\u2019s answer to a [mark]-mark question. Mark it and provide feedback.\\n\\nThe question: [paste or describe the question]\\nThe student\u2019s answer: [paste student answer]\\n\\nProvide:\\n1. A mark out of [mark] with justification against the mark scheme\\n2. What was done well (WWW) \u2014 be specific, reference exact phrases or points\\n3. Even better if (EBI) \u2014 specific, actionable improvements (not vague \"add more detail\")\\n4. One sentence the student could add or change that would gain an extra mark\\n5. A level/band descriptor if applicable\\n\\nBase your marking on the [exam board] mark scheme conventions. Be encouraging but honest.',
        variables: ['[subject]', '[exam board]', '[mark]', '[paste or describe the question]', '[paste student answer]'],
        safeguarding: 'AI marking should be verified by the teacher. Do not use AI-generated marks as final grades without professional review.',
        expectedOutput: 'A marked answer with WWW, EBI, specific improvement suggestion and mark scheme justification.',
        followUp: 'Write a model answer for this question so the student can compare.',
      },
      {
        title: 'Batch Feedback Comment Bank',
        level: 'Intermediate',
        bestFor: 'Teachers who need to write feedback efficiently for a full class set',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher. I am marking a set of [GCSE/A-Level] [question type] answers on [topic]. Create a comment bank I can use for efficient, personalised feedback.\\n\\nGenerate 5 comments for each category:\\n\\n**Top band (full marks or near)**\\n- Specific praise with subject terminology\\n\\n**Mid band (partial marks)**\\n- What\u2019s good + one specific improvement\\n\\n**Lower band (few marks)**\\n- Encouraging + clear next step\\n\\n**Common errors**\\n- 5 specific misconceptions students often have on this topic, with corrective feedback for each\\n\\n**SEN-adapted feedback**\\n- 3 versions of mid-band feedback adapted for: dyslexia (shorter, clearer), anxiety (gentler framing), ADHD (action-focused, bullet points)\\n\\nEach comment should be 1-3 sentences max. Make them specific to [topic], not generic.',
        variables: ['[subject]', '[GCSE/A-Level]', '[question type]', '[topic]'],
        expectedOutput: 'A structured comment bank with 25+ feedback comments organised by attainment level.',
        followUp: 'Now add 5 comments specifically for students who left this question blank or barely attempted it.',
      },
      {
        title: 'Comparative Judgement Feedback',
        level: 'Advanced',
        bestFor: 'Teachers using model answers to drive improvement',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] examiner for [exam board]. I will give you a student\u2019s answer and a model answer for the same [mark]-mark question. Use comparative judgement to generate feedback.\\n\\nQuestion: [paste question]\\nModel answer: [paste or describe model answer]\\nStudent answer: [paste student answer]\\n\\nProvide:\\n1. A side-by-side comparison table: what the model answer includes that the student\u2019s doesn\u2019t\\n2. The 3 highest-impact changes that would improve the student\u2019s mark\\n3. A rewritten version of the student\u2019s weakest paragraph, showing how to improve it\\n4. A \"next time\" checklist: 5 things this student should check before submitting a similar answer\\n5. An encouraging closing comment acknowledging what the student did achieve\\n\\nBe specific. Reference the mark scheme.',
        variables: ['[subject]', '[exam board]', '[mark]', '[paste question]', '[paste or describe model answer]', '[paste student answer]'],
        expectedOutput: 'A detailed comparative analysis with specific improvements, rewritten paragraph and checklist.',
        followUp: 'Create a DIRT (Dedicated Improvement and Reflection Time) task this student can complete in 15 minutes.',
      },
      {
        title: 'Whole-Class Feedback Sheet Generator',
        level: 'Intermediate',
        bestFor: 'Teachers giving class-wide feedback without marking every book',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher. I have just reviewed a class set of [assessment type] on [topic] for Year [year group]. Instead of marking every answer individually, I want to create a whole-class feedback sheet.\\n\\nHere are my notes on common patterns:\\n- Strengths most students showed: [describe]\\n- Common mistakes: [describe]\\n- Misconceptions I spotted: [describe]\\n- Best example I saw: [describe briefly]\\n\\nCreate a one-page whole-class feedback sheet that includes:\\n1. \"What went well across the class\" (3 bullet points)\\n2. \"Common mistakes to fix\" (3 examples with corrections)\\n3. A \"fix it\" task: students identify and correct errors in a sample answer you write (deliberately include the common mistakes)\\n4. A stretch challenge for students who scored highly\\n5. A self-assessment box: students RAG-rate their confidence on 3 key skills from this assessment\\n\\nFormat it cleanly so I can print and distribute. Use UK English.',
        variables: ['[subject]', '[assessment type]', '[topic]', '[year group]', '[describe]', '[describe]', '[describe]', '[describe briefly]'],
        expectedOutput: 'A print-ready whole-class feedback sheet with exemplar errors, fix-it task and self-assessment.',
        followUp: 'Create a follow-up 10-minute assessment I can use next lesson to check the feedback has been acted on.',
      },
      {
        title: 'Verbal Feedback Prompts for Live Marking',
        level: 'Beginner',
        bestFor: 'Teachers giving real-time feedback during lesson time',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher. I am circulating during a lesson while Year [year group] work on [task description]. I want a bank of verbal feedback prompts I can use as I look at student work in real time.\\n\\nGenerate:\\n\\n**5 praise prompts** (specific, not generic):\\n- What to say when a student has done something well on this specific task\\n\\n**5 nudge prompts** (redirect without giving the answer):\\n- What to say when a student is going in the wrong direction\\n\\n**5 stretch prompts** (challenge without overwhelming):\\n- What to say when a student has finished or is coasting\\n\\n**3 SEN-aware prompts:**\\n- For a student with anxiety: how to check in without adding pressure\\n- For a student with ADHD: how to refocus without confrontation\\n- For a student with dyslexia: how to address content not spelling\\n\\nMake every prompt task-specific to [task description], not generic.',
        variables: ['[subject]', '[year group]', '[task description]'],
        expectedOutput: 'A bank of 18 task-specific verbal feedback prompts for real-time use.',
        followUp: 'Create a simple feedback stamp or sticker template I can use for non-verbal feedback during the lesson.',
      },
      {
        title: 'DIRT Task Designer',
        level: 'Advanced',
        bestFor: 'Teachers planning Dedicated Improvement and Reflection Time activities',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher designing a 20-minute DIRT (Dedicated Improvement and Reflection Time) session for Year [year group] following a [assessment type] on [topic].\\n\\nThe main feedback themes were:\\n- Most students need to improve: [area 1]\\n- A significant minority struggled with: [area 2]\\n- High-ability students need to develop: [area 3]\\n\\nDesign a DIRT session:\\n1. **Reflection starter** (3 mins): Students read their feedback and RAG-rate 3 skills\\n2. **Fix-it task** (7 mins): A targeted task addressing [area 1] — include a worked example and then a student practice question\\n3. **Stretch task** (5 mins): For students who scored above [threshold] — extend into [area 3]\\n4. **Peer task** (5 mins): Students swap with a partner and check one specific thing in each other\u2019s work\\n5. **Exit reflection**: One sentence: \"Next time I will\u2026\"\\n\\nDifferentiate the fix-it task for 3 levels. Include the actual content, not just descriptions.',
        variables: ['[subject]', '[year group]', '[assessment type]', '[topic]', '[area 1]', '[area 2]', '[area 3]', '[threshold]'],
        expectedOutput: 'A complete, timed DIRT session with differentiated tasks and actual content.',
        followUp: 'Create a homework task that builds on this DIRT session for students who need extra practice on [area 1].',
      },
    ],
  },
  {
    id: 59,
    slug: 'advanced-reading-comprehension',
    category: 'Reading Comprehension & Literacy',
    categorySlug: 'reading-literacy',
    title: 'Advanced Reading Comprehension Strategies',
    description: 'Structured prompts for building reading skills across subjects, including inference, analysis, vocabulary development and reading for meaning with SEN adaptations.',
    useCase: 'Developing reading comprehension across the curriculum, not just in English lessons.',
    outcomes: ['Comprehension activities at multiple levels', 'Vocabulary development tasks', 'SEN-adapted reading materials'],
    promptCount: 6,
    senFocus: ['Dyslexia', 'All SEN'],
    roles: ['Teachers', 'Students'],
    stages: ['KS3', 'GCSE', 'A-Level'],
    featured: false,
    free: true,
    prompts: [
      {
        title: 'Tiered Comprehension Question Generator',
        level: 'Beginner',
        bestFor: 'Teachers creating comprehension activities for any subject text',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher. I will give you a text I want students to read. Create a set of comprehension questions at three levels.\\n\\nText: [paste the text or describe it]\\nYear group: [year group]\\nSubject: [subject]\\n\\nGenerate:\\n\\n**Retrieval (4 questions):** Find specific information directly stated in the text\\n**Inference (4 questions):** Read between the lines \u2014 what is implied but not stated?\\n**Evaluation (3 questions):** Judge, compare or critique the text\\n\\nFor each question:\\n- Write the question\\n- Provide a model answer\\n- Note which paragraph/line the answer relates to\\n\\nAlso create:\\n- A simplified version of questions 1-4 for students with a reading age below [reading age]\\n- A pre-reading vocabulary list: 8 key words from the text with student-friendly definitions',
        variables: ['[subject]', '[paste the text or describe it]', '[year group]', '[reading age]'],
        expectedOutput: 'A set of 11 tiered comprehension questions with model answers, plus SEN adaptations and vocabulary list.',
        followUp: 'Rewrite the original text at a lower reading age while keeping the key information intact.',
      },
      {
        title: 'Subject-Specific Vocabulary Builder',
        level: 'Beginner',
        bestFor: 'Teachers pre-teaching vocabulary before a reading task',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher and literacy specialist. I am about to teach [topic] to Year [year group]. Build a vocabulary development pack for this topic.\\n\\nGenerate:\\n1. **Tier 2 words** (8 words): Academic vocabulary used across subjects (e.g. \"analyse\", \"significant\", \"furthermore\") that students will encounter in this topic\\n2. **Tier 3 words** (8 words): Subject-specific terminology for this topic\\n\\nFor each word provide:\\n- Student-friendly definition (max 12 words)\\n- An example sentence using the word in a [subject] context\\n- A common misconception or confusion (e.g. \"students often confuse this with\u2026\")\\n- A memory hook or association\\n\\nAlso create:\\n- A Frayer Model template for the 3 most important words\\n- A matching activity (word to definition) suitable for a starter\\n- A dyslexia-friendly version with larger font guidance and simpler definitions',
        variables: ['[subject]', '[topic]', '[year group]'],
        expectedOutput: 'A complete vocabulary pack with definitions, examples, activities and SEN adaptations.',
        followUp: 'Create a vocabulary quiz I can use as a plenary to check retention.',
      },
      {
        title: 'Guided Reading Session Plan',
        level: 'Intermediate',
        bestFor: 'Teachers running structured reading sessions in any subject',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK [subject] teacher planning a guided reading session for Year [year group]. The text is: [describe or paste the text].\\n\\nCreate a 30-minute guided reading session:\\n\\n**Before reading (5 mins):**\\n- Activate prior knowledge: 2 questions to ask\\n- Pre-teach 3 key vocabulary words\\n- Set a purpose for reading: \"As you read, look for\u2026\"\\n\\n**During reading (15 mins):**\\n- Reading strategy to model (e.g. annotation, think-aloud, prediction)\\n- 3 pause points with discussion questions\\n- A note-making frame students complete as they read\\n\\n**After reading (10 mins):**\\n- Comprehension check: 3 questions (1 retrieval, 1 inference, 1 evaluation)\\n- A written response task (2-3 sentences)\\n- Extension: a question linking the text to wider knowledge\\n\\nDifferentiate for:\\n- Students with low reading confidence (paired reading, audio support)\\n- Students who are advanced readers (critical analysis extension)',
        variables: ['[subject]', '[year group]', '[describe or paste the text]'],
        expectedOutput: 'A complete guided reading session with before/during/after activities and differentiation.',
        followUp: 'Create the note-making frame students will use during reading, formatted for printing.',
      },
      {
        title: 'Inference and Deduction Skills Builder',
        level: 'Intermediate',
        bestFor: 'Teachers developing higher-order reading skills',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK English and literacy specialist. Create a progressive inference skills lesson for Year [year group] using [subject] content about [topic].\\n\\nDesign 5 activities that build inference skills progressively:\\n\\n1. **Image inference** (accessible entry): Show [describe an image related to the topic]. Students answer: What can you see? What can you infer? What evidence supports your inference?\\n2. **Sentence-level inference**: Provide 4 sentences from a [subject] text. For each, students identify what is stated and what is implied.\\n3. **Paragraph-level inference**: A short paragraph where students must read between the lines. Provide the paragraph and 3 inference questions.\\n4. **Evidence hunting**: Students find 3 pieces of evidence in a text that support a given inference. Provide the text and the inference.\\n5. **Creating inferences**: Students write their own inference-rich paragraph about [topic] that implies something without stating it directly.\\n\\nFor activities 2-4, provide model answers. For activity 1, provide an image description and likely inferences.\\n\\nInclude scaffolds for students with reading difficulties.',
        variables: ['[year group]', '[subject]', '[topic]'],
        expectedOutput: 'A progressive 5-stage inference lesson with texts, questions, model answers and scaffolds.',
        followUp: 'Create a self-assessment checklist students can use: \"Can I make inferences? Confidence check.\"',
      },
      {
        title: 'Dyslexia-Adapted Text Converter',
        level: 'Advanced',
        bestFor: 'Teachers and SENCOs creating accessible versions of subject texts',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK SENCO and literacy specialist. I need to make a [subject] text accessible for a student with dyslexia who has a reading age of [reading age].\\n\\nOriginal text: [paste the text]\\n\\nCreate:\\n1. **Adapted version**: Same core content but with: shorter sentences (max 15 words), simpler vocabulary, more paragraph breaks, key terms in bold\\n2. **Visual support version**: The adapted text with suggested images, diagrams or icons for key concepts\\n3. **Audio script**: A version written specifically to be read aloud clearly (with pause markers and emphasis cues)\\n4. **Key information extract**: The 5 most important facts from the text in bullet point form\\n5. **Comprehension questions**: 4 questions based on the adapted text (not the original)\\n\\nMaintain the academic integrity of the content. The student should learn the same concepts as their peers.\\n\\nAlso note: what Flesch-Kincaid reading level the adapted version targets.',
        variables: ['[subject]', '[reading age]', '[paste the text]'],
        safeguarding: 'Adapted materials should be provided discreetly. Avoid making the student feel singled out.',
        expectedOutput: 'An adapted text, visual support version, audio script and comprehension questions at an accessible reading level.',
        followUp: 'Create a desk reference card with the key vocabulary from this text for the student to keep.',
      },
      {
        title: 'Reading Across the Curriculum Audit',
        level: 'Advanced',
        bestFor: 'Literacy leads and subject leads embedding reading in every subject',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK whole-school literacy coordinator. Conduct a reading across the curriculum audit for the [subject] department.\\n\\nAssess and advise on:\\n1. **Opportunities for reading**: Where in the [subject] curriculum are there natural reading moments? (List by topic/unit)\\n2. **Text types**: What types of text should [subject] students encounter? (e.g. primary sources, textbooks, data reports, news articles, academic papers)\\n3. **Reading strategies**: Which reading strategies are most useful in [subject]? (e.g. skimming for data, close reading for analysis, reading graphical information)\\n4. **Vocabulary progression**: What Tier 2 and Tier 3 vocabulary should be explicitly taught, by year group?\\n5. **Current gaps**: Common reading weaknesses that affect [subject] outcomes (e.g. students who can\u2019t interpret exam questions)\\n6. **Quick wins**: 5 changes the department could make this term to improve reading in [subject]\\n7. **SEN considerations**: How to support weak readers in [subject] without lowering expectations\\n\\nProvide practical, specific recommendations, not generic literacy advice.',
        variables: ['[subject]'],
        expectedOutput: 'A department-level reading audit with opportunities, strategies, vocabulary and quick wins.',
        followUp: 'Create a one-page \"Reading in [subject]\" guide I can give to every teacher in the department.',
      },
    ],
  },
  {
    id: 60,
    slug: 'executive-function-study-skills',
    category: 'Study Skills & Executive Function',
    categorySlug: 'study-skills',
    title: 'Executive Function & Study Skills Builder',
    description: 'Structured prompts for building planning, organisation, time management and self-regulation skills. Designed for students who struggle with executive function.',
    useCase: 'Teaching study skills explicitly rather than assuming students already have them.',
    outcomes: ['Personalised study systems', 'Organisation frameworks', 'Self-regulation strategies'],
    promptCount: 6,
    senFocus: ['ADHD', 'Autism', 'Executive Dysfunction'],
    roles: ['Students', 'Teachers', 'Parents'],
    stages: ['KS3', 'GCSE', 'A-Level'],
    featured: false,
    free: true,
    prompts: [
      {
        title: 'Personal Study System Designer',
        level: 'Beginner',
        bestFor: 'Students who have never been taught how to study',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK study skills coach working with a Year [year group] student who finds it hard to organise their study. Help me design a study system that works for my brain.\\n\\nAbout me:\\n- I find it hardest to: [e.g. start tasks / stay focused / organise notes / remember to do homework]\\n- I study best when: [e.g. it\u2019s quiet / I have music / I\u2019m moving / I use colours]\\n- My biggest distraction is: [e.g. my phone / noise / daydreaming / not knowing where to start]\\n- I have: [e.g. ADHD / no diagnosis but I struggle with focus / autism / anxiety]\\n\\nDesign a personal study system:\\n1. A daily study routine (step by step, with exact times)\\n2. A homework capture method (how to record and track what\u2019s due)\\n3. A \"getting started\" ritual (a specific 2-minute sequence to transition into study mode)\\n4. A focus strategy matched to my distraction pattern\\n5. A reward system I can use to motivate myself\\n6. A \"stuck\" protocol (exactly what to do when I don\u2019t know how to start a task)\\n\\nMake it realistic for a teenager. Don\u2019t assume I have perfect willpower.',
        variables: ['[year group]', '[e.g. start tasks]', '[e.g. it\u2019s quiet]', '[e.g. my phone]', '[e.g. ADHD]'],
        safeguarding: 'Study skills support does not replace clinical support for diagnosed conditions. If executive function difficulties are significantly impacting daily life, consider referral to an educational psychologist.',
        expectedOutput: 'A personalised study system with routines, strategies and a \"stuck\" protocol.',
        followUp: 'I tried the system for a week. [describe what worked and what didn\u2019t]. Help me adjust it.',
      },
      {
        title: 'Homework Planning & Prioritisation Tool',
        level: 'Beginner',
        bestFor: 'Students who struggle to manage multiple homework tasks',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK study skills coach. I have these homework tasks due this week:\\n\\n[List each task with subject, description, and due date]\\n\\nHelp me:\\n1. Sort them by urgency and importance (use an Eisenhower matrix)\\n2. Estimate how long each task will actually take (be realistic, not optimistic)\\n3. Create a day-by-day plan for completing them, accounting for:\\n   - My available time each evening: [number] hours\\n   - Subjects I find hardest (need more energy): [list]\\n   - Any evenings I\u2019m busy: [list]\\n4. Break any large tasks into 15-minute chunks\\n5. Add buffer time for tasks that might take longer than expected\\n6. Tell me which task to start with RIGHT NOW and why\\n\\nI tend to [describe your pattern, e.g. leave everything until the night before / start with easy tasks and avoid hard ones / spend too long on one subject].',
        variables: ['[List tasks]', '[number]', '[list hard subjects]', '[list busy evenings]', '[describe your pattern]'],
        expectedOutput: 'A prioritised, day-by-day homework plan with time estimates and a clear starting point.',
        followUp: 'It\u2019s Wednesday and I\u2019m behind. Replan the rest of the week.',
      },
      {
        title: 'Note-Taking System Finder',
        level: 'Intermediate',
        bestFor: 'Students who need a structured approach to taking and organising notes',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK study skills coach. I need help finding a note-taking system that works for me.\\n\\nAbout my learning:\\n- Subject I\u2019m taking notes for: [subject]\\n- How I currently take notes: [describe, e.g. I write everything down / I don\u2019t take notes / I highlight but never review]\\n- My challenge: [e.g. I write too much / I can\u2019t find anything later / my notes are messy / I don\u2019t know what\u2019s important]\\n- SEN (if any): [e.g. dyslexia, ADHD, none]\\n\\nIntroduce me to 3 different note-taking methods, explain each one, and recommend the best fit for me:\\n1. **Cornell Method**: structured two-column layout\\n2. **Mind Mapping**: visual, non-linear\\n3. **Bullet Journal style**: minimal, symbol-based\\n\\nFor the method you recommend:\\n- Show me a completed example using a real [subject] topic: [topic]\\n- Give me a blank template I can copy\\n- Explain how to review these notes effectively (5-minute review routine)\\n- Explain how to adapt it for [my SEN] if applicable',
        variables: ['[subject]', '[describe]', '[e.g. I write too much]', '[e.g. dyslexia]', '[topic]'],
        expectedOutput: 'An introduction to 3 note-taking methods with a recommendation, completed example and template.',
        followUp: 'I tried it for a week. The problem is [describe]. Help me adjust.',
      },
      {
        title: 'Task Initiation Protocol',
        level: 'Intermediate',
        bestFor: 'Students with ADHD or executive dysfunction who struggle to start tasks',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK educational psychologist specialising in executive function. I have difficulty starting tasks even when I know what to do and want to do them. This is called task initiation difficulty and it\u2019s common with [ADHD / autism / executive dysfunction / anxiety].\\n\\nCreate a personalised task initiation protocol I can use every time I need to start studying:\\n\\n**Pre-launch (2 minutes):**\\n1. A physical movement to signal \"it\u2019s time\" (body cue)\\n2. A specific environment setup checklist (5 items max)\\n3. A decision-eliminator: how to choose what to do without overthinking\\n\\n**Launch sequence (3 minutes):**\\n4. The \"just 5 minutes\" commitment technique\\n5. A first-action prompt: the absolute smallest step I can take\\n6. A focus anchor: what to do with my attention in the first 60 seconds\\n\\n**Sustain (once started):**\\n7. A timer-based work/break pattern matched to my attention span\\n8. What to do when I drift (a specific re-engagement prompt)\\n9. How to handle the urge to switch tasks\\n\\n**Reward:**\\n10. A micro-reward I can give myself after completing the first work block\\n\\nMake it practical and specific. I\u2019m [age] and I\u2019m doing this at [home/school].',
        variables: ['[ADHD / autism / executive dysfunction / anxiety]', '[age]', '[home/school]'],
        safeguarding: 'Persistent task initiation difficulties may indicate an undiagnosed neurodevelopmental condition. If strategies are not helping, consider referral for assessment.',
        expectedOutput: 'A step-by-step task initiation protocol with physical, environmental and cognitive strategies.',
        followUp: 'Create a pocket-sized card version of this protocol I can keep on my desk.',
      },
      {
        title: 'End-of-Day Study Review Routine',
        level: 'Advanced',
        bestFor: 'Students building metacognitive habits',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK study skills and metacognition specialist. Design a 10-minute end-of-day study review routine that helps me build long-term learning habits.\\n\\nThe routine should include:\\n\\n**Step 1: Capture (2 mins)**\\n- Write down 3 things I learned today across all subjects\\n- If I can\u2019t remember 3 things, that tells me something about my engagement today\\n\\n**Step 2: Process (3 mins)**\\n- For the most important thing I learned, explain it in my own words (no notes)\\n- If I can\u2019t explain it, mark it for review tomorrow\\n\\n**Step 3: Connect (2 mins)**\\n- Link today\u2019s learning to something I already knew\\n- Ask: \"Why does this matter?\"\\n\\n**Step 4: Plan (2 mins)**\\n- Check tomorrow\u2019s timetable\\n- Identify one thing I need to prepare\\n- Set one learning goal for tomorrow\\n\\n**Step 5: Rate (1 min)**\\n- Rate my focus today 1-5\\n- Rate my effort today 1-5\\n- One thing I\u2019ll do differently tomorrow\\n\\nCreate a printable journal page I can use every evening. Also explain the neuroscience behind why this routine works (in simple terms).',
        variables: [],
        expectedOutput: 'A 10-minute daily review routine with a printable journal template and neuroscience explanation.',
        followUp: 'Create a weekly review version I can do every Sunday to consolidate the week\u2019s learning.',
      },
      {
        title: 'Parent Guide to Supporting Executive Function at Home',
        level: 'Advanced',
        bestFor: 'Parents of students with executive function difficulties',
        tools: ALL_TOOLS,
        prompt: 'Act as a UK educational psychologist. Write a practical guide for parents of a [age]-year-old with [ADHD / autism / executive function difficulties] who struggles with [describe main challenge, e.g. homework, organisation, time management, emotional regulation].\\n\\nThe guide should include:\\n\\n1. **Understanding the challenge**: A simple, non-clinical explanation of what executive function is and why their child struggles (not laziness, not defiance)\\n2. **Environmental setup**: 5 specific changes to the home study environment\\n3. **Routines**: A sample after-school routine with exact times and transitions\\n4. **Homework support**: How to help without doing the work \u2014 specific scripts for common situations:\\n   - \"I don\u2019t have any homework\" (they do)\\n   - \"I can\u2019t do it\" (they\u2019re overwhelmed, not incapable)\\n   - \"I\u2019ll do it later\" (they won\u2019t, without support)\\n5. **What NOT to do**: 5 common parent responses that make executive function worse\\n6. **When to seek help**: Signs that the child needs professional assessment\\n7. **Communication with school**: A template email to the SENCO expressing concerns\\n\\nBe empathetic. Parents are doing their best.',
        variables: ['[age]', '[ADHD / autism / executive function difficulties]', '[describe main challenge]'],
        safeguarding: 'If a child\u2019s executive function difficulties are significantly impacting their wellbeing or school performance, parents should request assessment through the school SENCO or their GP.',
        expectedOutput: 'A comprehensive, empathetic parent guide with practical strategies, scripts and a SENCO email template.',
        followUp: 'Write a version of this guide that the parent could share with a grandparent or childminder who also supports the child.',
      },
    ],
  },
];

export const PROMPT_PACKS: PromptPack[] = [...LEGACY_PACKS, ...EXPERT_PACKS];
