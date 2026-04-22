export interface PromptPack {
  id: number;
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  promptCount: number;
  senFocus: string[];
  roles: string[];
  stages: string[];
  prompts: string[];
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
  };
  return map[cat] ?? slugify(cat);
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

export const PROMPT_PACKS: PromptPack[] = RAW.map((r) => {
  const senFocus = parseSEN(r.sen);
  const displayCat = displayCategory(r.cat);
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
    prompts: parsePrompts(r.prompts),
    featured: FEATURED_IDS.has(r.id),
    free: true,
  };
});
