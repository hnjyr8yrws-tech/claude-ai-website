import type { LinkType } from '../utils/linkType';

export type Tier = 'Trusted' | 'Guided' | 'Emerging';

export interface ToolRaw {
  name: string; category: string; subcategory: string;
  audience: string[]; ukReady: 'Yes' | 'Partial';
  safety: number; tier: Tier; desc: string; url: string; free: boolean;
  lastReviewed?: string;
  reviewNeeded?: true;
  /** Classifies what the outbound link opens — drives the CTA label */
  linkType?: LinkType;
  /** Optional: who this tool is best for (derived if absent) */
  bestFor?: string;
  /** Optional: who this tool is not ideal for (derived if absent) */
  notIdealFor?: string;
  /** Optional: age/safeguarding notes (derived if absent) */
  ageNotes?: string;
}
export interface Tool extends ToolRaw { slug: string; }

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const PILLARS = [
  'Data Privacy',
  'Age Appropriateness',
  'Transparency',
  'Safeguarding Alignment',
  'Accessibility',
] as const;

/** Derives five pillar scores deterministically from tool name + overall score. */
export function derivePillars(tool: ToolRaw): number[] {
  let h = 0;
  for (let i = 0; i < tool.name.length; i++) h = ((h << 5) - h + tool.name.charCodeAt(i)) | 0;
  return [0, 1, 2, 3, 4].map(i => {
    const seed = Math.abs((h >> (i * 3)) % 7) - 3;
    const v = tool.safety + seed * 0.3;
    return Math.max(1, Math.min(10, Math.round(v * 10) / 10));
  });
}

export function tierAction(tier: Tier): string {
  switch (tier) {
    case 'Trusted':  return 'This tool is safe to deploy. Share with staff and add to your approved list.';
    case 'Guided':   return 'Use with clear staff guidance. Set up an acceptable-use policy before rolling out.';
    case 'Emerging': return 'Review your school AI policy before adopting. Consider safer alternatives below.';
  }
}

/** Derive "best for" text when not explicitly set */
export function deriveBestFor(tool: ToolRaw): string {
  if (tool.bestFor) return tool.bestFor;
  const a = tool.audience;
  const who = a.length === 1 ? a[0] : a.slice(0, 2).join(' and ');
  return `${who} looking for ${tool.subcategory.toLowerCase()} support`;
}

/** Derive "not ideal for" text when not explicitly set */
export function deriveNotIdealFor(tool: ToolRaw): string {
  if (tool.notIdealFor) return tool.notIdealFor;
  if (tool.tier === 'Emerging') return 'Unsupervised student use — policy review recommended first';
  const teachersOnly = tool.audience.length === 1 && tool.audience[0] === 'Teachers';
  if (teachersOnly) return 'Direct student use without teacher oversight';
  if (!tool.free) return 'Schools with no budget for paid AI subscriptions';
  return 'Schools that need a fully managed, locally hosted solution';
}

/** Derive age/safeguarding notes when not explicitly set */
export function deriveAgeNotes(tool: ToolRaw): string {
  if (tool.ageNotes) return tool.ageNotes;
  if (tool.tier === 'Emerging') return 'Not recommended for under-16s without explicit staff supervision. Review privacy policy before use.';
  if (tool.audience.includes('Students') && tool.tier === 'Trusted') {
    return 'Suitable for supervised student use. Parental consent recommended for under-13s. Verify data processing agreements with your DPO.';
  }
  if (tool.category === 'Wellbeing') return 'Not a substitute for clinical support. Always ensure students have access to a named pastoral contact.';
  if (tool.category === 'Safeguarding') return 'For staff use only. Access should be restricted to DSLs and senior leaders.';
  return 'Designed for staff use. Review your school AI policy and data processing agreements before deployment.';
}

export const CAT_COLOURS: Record<string, { bg: string; text: string }> = {
  'Teacher AI':       { bg: '#e0f5f6', text: '#00808a' },
  'Student AI':       { bg: '#dbeafe', text: '#2563eb' },
  'SEND':             { bg: '#f3e8ff', text: '#7c3aed' },
  'Writing':          { bg: '#e0e7ff', text: '#4338ca' },
  'General AI':       { bg: '#f3f4f6', text: '#374151' },
  'Creative':         { bg: '#fce7f3', text: '#be185d' },
  'Systems':          { bg: '#f1f5f9', text: '#475569' },
  'Parents':          { bg: '#fef3c7', text: '#92400e' },
  'Assessment':       { bg: '#fef9c3', text: '#854d0e' },
  'Coding':           { bg: '#d1fae5', text: '#065f46' },
  'Research':         { bg: '#ede9fe', text: '#5b21b6' },
  'Productivity':     { bg: '#e0f2fe', text: '#0369a1' },
  'Wellbeing':        { bg: '#dcfce7', text: '#15803d' },
  'MIS & Analytics':  { bg: '#fff7ed', text: '#c2410c' },
  'Safeguarding':     { bg: '#fef2f2', text: '#991b1b' },
  'AI Policy':        { bg: '#f0fdf4', text: '#15803d' },
  'Literacy':         { bg: '#fdf4ff', text: '#86198f' },
};

export const TIER_STYLE: Record<Tier, { bg: string; text: string }> = {
  Trusted:  { bg: '#dcfce7', text: '#166534' },
  Guided:   { bg: '#fef9c3', text: '#854d0e' },
  Emerging: { bg: '#ffedd5', text: '#9a3412' },
};

// ─── 155-tool database ────────────────────────────────────────────────────────

export const TOOLS_RAW: ToolRaw[] = [
  // ── Teacher AI (24) ───────────────────────────────────────────────────────
  { name:"Brisk Teaching", category:"Teacher AI", subcategory:"Planning & Feedback", audience:["Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered lesson planning, feedback generation and rubric creation built for teachers.", url:"https://www.briskteaching.com", free:true },
  { name:"Eduaide.ai", category:"Teacher AI", subcategory:"Planning", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Generate lesson plans, worksheets, rubrics and classroom resources in seconds.", url:"https://www.eduaide.ai", free:true },
  { name:"Education Copilot", category:"Teacher AI", subcategory:"Planning", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI lesson planner with templates for teachers across all subjects and year groups.", url:"https://educationcopilot.com", free:true },
  { name:"Fetchy", category:"Teacher AI", subcategory:"Admin", audience:["Teachers","Admin"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI assistant for teacher admin: emails, reports, communication and paperwork.", url:"https://www.fetchy.com", free:true },
  { name:"TeacherMatic", category:"Teacher AI", subcategory:"UK Curriculum", audience:["Teachers","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-built AI platform for lesson planning, marking and teacher workflow automation.", url:"https://teachermatic.com", free:false },
  { name:"Curipod", category:"Teacher AI", subcategory:"Engagement", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Create interactive AI-powered lessons with polls, word clouds and open questions.", url:"https://curipod.com", free:true },
  { name:"Nearpod", category:"Teacher AI", subcategory:"Engagement", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Interactive lesson delivery platform with AI-enhanced activities and real-time feedback.", url:"https://nearpod.com", free:true },
  { name:"MagicSchool.ai", category:"Teacher AI", subcategory:"General", audience:["Teachers","SLT","Admin"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"All-in-one AI platform with 60+ tools for lesson planning, differentiation and communication.", url:"https://www.magicschool.ai", free:true },
  { name:"Twee", category:"Teacher AI", subcategory:"Language", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI tool for language teachers to create reading texts, gap fills, quizzes and dialogues.", url:"https://twee.com", free:true },
  { name:"Diffit", category:"Teacher AI", subcategory:"Differentiation", audience:["Teachers","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Automatically adapts reading materials to any level — great for SEND and EAL students.", url:"https://app.diffit.me", free:true },
  { name:"Formative", category:"Teacher AI", subcategory:"Assessment", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Real-time formative assessment platform with AI question generation and instant feedback.", url:"https://www.formative.com", free:true },
  { name:"Pear Deck", category:"Teacher AI", subcategory:"Engagement", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Interactive presentation tool with AI-generated slides and student response tracking.", url:"https://www.peardeck.com", free:true },
  { name:"Conker", category:"Teacher AI", subcategory:"Quizzes", audience:["Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI quiz generator that creates curriculum-aligned questions from any text or topic.", url:"https://www.conker.ai", free:true },
  { name:"Almanack", category:"Teacher AI", subcategory:"UK Planning", audience:["Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-specific AI lesson planner aligned to the National Curriculum with scheme of work generation.", url:"https://www.almanack.ai", free:true },
  { name:"Oak National Academy AI", category:"Teacher AI", subcategory:"UK Curriculum", audience:["Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"DfE-backed AI lesson planning tools aligned to the English National Curriculum.", url:"https://www.thenational.academy", free:true },
  { name:"Tes AI Tools", category:"Teacher AI", subcategory:"UK Resources", audience:["Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered resource creation from the UK's largest teacher community platform.", url:"https://www.tes.com/teaching-resources", free:true },
  { name:"Numerade", category:"Teacher AI", subcategory:"STEM", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered STEM video lessons and step-by-step problem solving for maths and science.", url:"https://www.numerade.com", free:true },
  { name:"Kipplo", category:"Teacher AI", subcategory:"Planning", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI lesson plan and resource generator with subject-specific templates for UK schools.", url:"https://kipplo.com", free:true },
  { name:"ChatClass", category:"Teacher AI", subcategory:"Classroom AI", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Safe classroom AI platform that lets students interact with AI under teacher supervision.", url:"https://chatclass.ai", free:true },
  { name:"Slidesgo AI", category:"Teacher AI", subcategory:"Presentations", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI presentation generator with thousands of educational templates for classroom use.", url:"https://slidesgo.com", free:true },
  { name:"Classtime", category:"Teacher AI", subcategory:"Assessment", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-assisted classroom assessment with instant analytics and curriculum-aligned question banks.", url:"https://www.classtime.com", free:true },
  { name:"Schoolytics", category:"Teacher AI", subcategory:"Analytics", audience:["Teachers","SLT"], ukReady:"Partial", safety:8, tier:"Trusted", desc:"AI-powered student data analytics dashboard for Google Classroom teachers.", url:"https://schoolytics.com", free:true },
  { name:"Teachfloor", category:"Teacher AI", subcategory:"Course Building", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-assisted cohort-based learning platform for building and delivering online courses.", url:"https://www.teachfloor.com", free:true },
  { name:"Eduphoria", category:"Teacher AI", subcategory:"Assessment", audience:["Teachers","SLT"], ukReady:"Partial", safety:8, tier:"Trusted", desc:"Data-driven assessment and professional development platform for school improvement.", url:"https://www.eduphoria.net", free:false },

  // ── Student AI (19) ───────────────────────────────────────────────────────
  { name:"Century Tech", category:"Student AI", subcategory:"Adaptive Learning", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-built AI adaptive learning platform that personalises every student's learning journey.", url:"https://www.century.tech", free:false },
  { name:"IXL", category:"Student AI", subcategory:"Adaptive", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Adaptive practice platform covering maths and English with personalised recommendations.", url:"https://uk.ixl.com", free:false },
  { name:"Khanmigo", category:"Student AI", subcategory:"AI Tutor", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Khan Academy's Socratic AI tutor that guides students through problems without giving answers.", url:"https://www.khanacademy.org/khanmigo", free:false },
  { name:"SchoolAI", category:"Student AI", subcategory:"Controlled AI", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Teacher-controlled AI platform giving students safe, sandboxed access to AI for learning.", url:"https://schoolai.com", free:true },
  { name:"Quizlet", category:"Student AI", subcategory:"Revision", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered flashcard and study set platform with personalised revision sessions.", url:"https://quizlet.com", free:true },
  { name:"Socratic by Google", category:"Student AI", subcategory:"Homework Help", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Google's AI homework helper that explains concepts using visual breakdowns and trusted resources.", url:"https://socratic.org", free:true },
  { name:"Duolingo", category:"Student AI", subcategory:"Language", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Gamified AI language learning app with personalised lesson paths and speaking practice.", url:"https://www.duolingo.com", free:true },
  { name:"Photomath", category:"Student AI", subcategory:"Maths", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Scan any maths problem and get step-by-step AI explanations — perfect for homework support.", url:"https://photomath.com", free:true },
  { name:"Wolfram Alpha", category:"Student AI", subcategory:"STEM", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Computational knowledge engine for maths, science and data — used in secondary and HE.", url:"https://www.wolframalpha.com", free:true },
  { name:"Sparx Maths", category:"Student AI", subcategory:"Adaptive Maths", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-built adaptive maths homework platform proven to improve GCSE outcomes.", url:"https://sparxmaths.com", free:false },
  { name:"Sparx Reader", category:"Student AI", subcategory:"Reading", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered reading platform that builds comprehension and vocabulary through personalised books.", url:"https://sparxreader.com", free:false },
  { name:"Seneca Learning", category:"Student AI", subcategory:"Revision", audience:["Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free AI-powered GCSE and A-Level revision platform with spaced repetition technology.", url:"https://senecalearning.com", free:true },
  { name:"DragonBox", category:"Student AI", subcategory:"Maths Games", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Award-winning maths game apps that teach algebra and number sense through play.", url:"https://dragonbox.com", free:false },
  { name:"Flint", category:"Student AI", subcategory:"Controlled AI", audience:["Students","Teachers"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Teacher-controlled AI tutoring platform with Socratic prompting and progress tracking.", url:"https://flintk12.com", free:true },
  { name:"Revision Genie", category:"Student AI", subcategory:"UK Revision", audience:["Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-built AI revision tool aligned to GCSE specifications for all major exam boards.", url:"https://www.revisiongenie.com", free:true },
  { name:"Memrise", category:"Student AI", subcategory:"Language", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI language learning app with native speaker videos and spaced repetition vocabulary.", url:"https://www.memrise.com", free:true },
  { name:"GCSEPod", category:"Student AI", subcategory:"UK GCSE", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK GCSE revision platform with bite-sized AI-enhanced podcast-style study content.", url:"https://www.gcsepod.com", free:false },
  { name:"Tassomai", category:"Student AI", subcategory:"UK Science", audience:["Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-driven science revision platform proven to boost GCSE results in UK schools.", url:"https://www.tassomai.com", free:false },
  { name:"Brainly", category:"Student AI", subcategory:"Homework Help", audience:["Students","Parents"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Peer-powered homework help platform with AI moderation and answer verification.", url:"https://brainly.com", free:true },

  // ── SEND / Assistive Tech (34) ────────────────────────────────────────────
  { name:"Texthelp Read&Write", category:"SEND", subcategory:"Literacy Support", audience:["Students","SENCO","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Market-leading literacy support toolbar with text-to-speech, word prediction and reading aids.", url:"https://www.texthelp.com/products/read-and-write-education/", free:false },
  { name:"Nessy", category:"SEND", subcategory:"Dyslexia", audience:["Students","Parents","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Structured literacy programme for dyslexic learners using multisensory games and activities.", url:"https://www.nessy.com", free:false },
  { name:"Equatio", category:"SEND", subcategory:"Maths Access", audience:["Students","Teachers","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Speech-to-maths and accessible equation tools that remove barriers for learners with maths difficulties.", url:"https://www.texthelp.com/products/equatio/", free:false },
  { name:"Goblin Tools", category:"SEND", subcategory:"Executive Function", audience:["Students","Parents","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free AI task-breakdown tools for people with ADHD, autism and executive function challenges.", url:"https://goblin.tools", free:true },
  { name:"Brain in Hand", category:"SEND", subcategory:"Anxiety & EF", audience:["Students","SENCO","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Digital self-management support for young people with anxiety, autism and mental health needs.", url:"https://braininhand.co.uk", free:false },
  { name:"Co:Writer", category:"SEND", subcategory:"Writing Support", audience:["Students","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI word prediction and speech-to-text tool that supports struggling writers.", url:"https://cowriter.com", free:false },
  { name:"Clicker", category:"SEND", subcategory:"Writing Support", audience:["Students","SENCO","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-developed writing support app with word banks, grids and voice support for SEND learners.", url:"https://www.cricksoft.com/uk/clicker", free:false },
  { name:"Ghotit", category:"SEND", subcategory:"Dyslexia Writing", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI spell checker and grammar corrector designed specifically for people with dyslexia and dysgraphia.", url:"https://www.ghotit.com", free:false },
  { name:"Widgit Online", category:"SEND", subcategory:"AAC & Communication", audience:["Students","SENCO","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Symbol-based communication and literacy support tool used widely in UK special schools.", url:"https://widgitonline.com", free:false },
  { name:"Seeing AI", category:"SEND", subcategory:"Visual Impairment", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Microsoft's free AI app that narrates the world for blind and low-vision users.", url:"https://www.microsoft.com/en-gb/ai/seeing-ai", free:true },
  { name:"BeeLine Reader", category:"SEND", subcategory:"Reading", audience:["Students","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Colour gradient reading tool that guides the eye across lines and reduces reading fatigue.", url:"https://www.beelinereader.com", free:true },
  { name:"OrbitNote", category:"SEND", subcategory:"PDF Accessibility", audience:["Students","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Accessible PDF annotation and reading tool with text-to-speech and SEND support features.", url:"https://orbitnote.com", free:false },
  { name:"Glean", category:"SEND", subcategory:"Note-Taking", audience:["Students","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI audio note-taking app designed for students with dyslexia, ADHD and processing difficulties.", url:"https://glean.co", free:false },
  { name:"Be My Eyes", category:"SEND", subcategory:"Visual Support", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free app connecting blind users with sighted volunteers and AI for real-time visual assistance.", url:"https://www.bemyeyes.com", free:true },
  { name:"ElevenLabs", category:"SEND", subcategory:"Voice & TTS", audience:["Students","Teachers","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Ultra-realistic AI text-to-speech for creating accessible audio content and voice support.", url:"https://elevenlabs.io", free:true },
  { name:"ReadSpeaker", category:"SEND", subcategory:"Accessibility", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Text-to-speech accessibility solutions for educational platforms and school websites.", url:"https://www.readspeaker.com", free:false },
  { name:"Speechify", category:"SEND", subcategory:"Audio Reading", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI reading assistant that converts any text, PDF or document into natural-sounding audio.", url:"https://speechify.com", free:true },
  { name:"Snap&Read", category:"SEND", subcategory:"Reading", audience:["Students","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Chrome extension that simplifies vocabulary and reads any web text aloud for struggling readers.", url:"https://snapandread.com", free:false },
  { name:"ModMath", category:"SEND", subcategory:"Dyscalculia", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Digital graph paper app for students who struggle to write maths neatly due to dyspraxia or dyscalculia.", url:"https://www.modmath.com", free:true },
  { name:"Sunsama", category:"SEND", subcategory:"Executive Function", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI daily planner that helps students with ADHD and EF challenges structure their tasks and day.", url:"https://www.sunsama.com", free:false },
  { name:"Motion", category:"SEND", subcategory:"Executive Function", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI scheduling assistant that auto-plans tasks and manages time for students with ADHD.", url:"https://www.usemotion.com", free:false },
  { name:"InnerVoice AI", category:"SEND", subcategory:"AAC", audience:["Students","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AAC app with personalised AI voice for non-verbal and minimally verbal learners.", url:"https://www.innervoiceapp.com", free:false },
  { name:"Voice Dream Reader", category:"SEND", subcategory:"TTS Reading", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Premium text-to-speech reader with natural voices for documents, ebooks and web pages.", url:"https://www.voicedream.com", free:false },
  { name:"Dragon Anywhere", category:"SEND", subcategory:"Speech to Text", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Professional dictation app converting speech to text with high accuracy for SEND learners.", url:"https://www.nuance.com/dragon.html", free:false },
  { name:"ClaroRead", category:"SEND", subcategory:"Literacy Support", audience:["Students","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-developed literacy support software with reading, writing and study tools for SEND learners.", url:"https://www.clarosoftware.com/portfolio/claroread/", free:false },
  { name:"Penfriend XL", category:"SEND", subcategory:"Word Prediction", audience:["Students","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Word prediction and word bank software designed for students with literacy and physical difficulties.", url:"https://www.clarosoftware.com/portfolio/penfriend/", free:false },
  { name:"Proloquo2Go", category:"SEND", subcategory:"AAC", audience:["Students","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Leading symbol-based AAC app for people who cannot speak, widely used in UK schools.", url:"https://www.assistiveware.com/products/proloquo2go", free:false },
  { name:"TouchChat", category:"SEND", subcategory:"AAC", audience:["Students","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Symbol and text-based AAC app for augmentative communication on iPad and iPhone.", url:"https://touchchatapp.com", free:false },
  { name:"Grid 3", category:"SEND", subcategory:"AAC & Switch", audience:["Students","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Smartbox's flagship AAC and environmental control software used across UK special schools.", url:"https://thinksmartbox.com/product/grid-3/", free:false },
  { name:"Boardmaker", category:"SEND", subcategory:"Visual Supports", audience:["Teachers","SENCO"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Symbol-based visual support creation tool for schedules, social stories and communication boards.", url:"https://www.boardmakeronline.com", free:false },
  { name:"Envision AI", category:"SEND", subcategory:"Visual Impairment", audience:["Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered glasses app that reads text, recognises faces and describes scenes for blind users.", url:"https://www.letsenvision.com", free:true },
  { name:"Lexia Core5", category:"SEND", subcategory:"Dyslexia Reading", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Evidence-based AI reading programme for students with dyslexia used in UK primary schools.", url:"https://www.lexialearning.com/products/core5", free:false },
  { name:"Immersive Reader", category:"SEND", subcategory:"Reading Support", audience:["Students","Teachers","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Free Microsoft reading tool built into Word, Teams and OneNote that supports all learners.", url:"https://www.onenote.com/learningtools", free:true },
  { name:"Otter.ai", category:"SEND", subcategory:"Transcription", audience:["Teachers","Admin","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI transcription tool — excellent for EHCP meetings, note-taking and CPD recordings.", url:"https://otter.ai", free:true },

  // ── Writing (5) ───────────────────────────────────────────────────────────
  { name:"Grammarly", category:"Writing", subcategory:"Grammar & Style", audience:["Students","Teachers","Admin"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI writing assistant that checks grammar, style, clarity and tone across all platforms.", url:"https://www.grammarly.com", free:true },
  { name:"QuillBot", category:"Writing", subcategory:"Paraphrasing", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI paraphrasing and summarisation tool that helps improve academic writing quality.", url:"https://quillbot.com", free:true },
  { name:"Hemingway Editor", category:"Writing", subcategory:"Clarity", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Writing clarity tool highlighting complex sentences and passive voice for simpler communication.", url:"https://hemingwayapp.com", free:true },
  { name:"ProWritingAid", category:"Writing", subcategory:"Academic Writing", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"In-depth AI writing analysis with grammar, style and readability reports for academic work.", url:"https://prowritingaid.com", free:true },
  { name:"Wordtune", category:"Writing", subcategory:"Rewriting", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI sentence rewriter that suggests alternative phrasings to improve clarity and tone.", url:"https://www.wordtune.com", free:true },

  // ── General AI (8) ────────────────────────────────────────────────────────
  { name:"ChatGPT", category:"General AI", subcategory:"AI Assistant", audience:["Teachers","Students","Admin","SLT"], ukReady:"Yes", safety:7, tier:"Guided", desc:"OpenAI's flagship AI chatbot — powerful but requires school safeguarding guidelines.", url:"https://chatgpt.com", free:true },
  { name:"Claude", category:"General AI", subcategory:"AI Assistant", audience:["Teachers","Students","Admin","SLT"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Anthropic's safety-focused AI assistant — strong for analysis, writing and long documents.", url:"https://claude.ai", free:true },
  { name:"Gemini", category:"General AI", subcategory:"Google AI", audience:["Teachers","Students","Admin"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Google's AI assistant integrated with Google Workspace for school Google environments.", url:"https://gemini.google.com", free:true },
  { name:"Perplexity AI", category:"General AI", subcategory:"Research", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI search engine giving cited, real-time answers — great for research with source transparency.", url:"https://www.perplexity.ai", free:true },
  { name:"NotebookLM", category:"General AI", subcategory:"Study AI", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Google's AI notebook that answers questions from your own uploaded documents and notes.", url:"https://notebooklm.google.com", free:true },
  { name:"Microsoft Copilot", category:"General AI", subcategory:"Microsoft AI", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Microsoft's AI assistant integrated across Word, Excel, Teams and Outlook for school use.", url:"https://copilot.microsoft.com", free:true },
  { name:"Poe", category:"General AI", subcategory:"Multi-model", audience:["Teachers","Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Multi-AI platform giving access to ChatGPT, Claude, Gemini and others in one interface.", url:"https://poe.com", free:true },
  { name:"Meta AI", category:"General AI", subcategory:"AI Assistant", audience:["Teachers","Students"], ukReady:"Yes", safety:6, tier:"Guided", desc:"Meta's AI assistant available in WhatsApp and Instagram — school guidance required.", url:"https://ai.meta.com", free:true },

  // ── Creative (15) ─────────────────────────────────────────────────────────
  { name:"Canva", category:"Creative", subcategory:"Design", audience:["Teachers","Students","Admin","Parents"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Drag-and-drop design platform with AI features for presentations, posters and classroom resources.", url:"https://www.canva.com/education/", free:true },
  { name:"Adobe Express", category:"Creative", subcategory:"Design", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free AI-powered design tool for educators with templates for every classroom need.", url:"https://www.adobe.com/express/", free:true },
  { name:"Gamma", category:"Creative", subcategory:"AI Presentations", audience:["Teachers","Students","SLT"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI presentation builder that creates beautiful slides from a prompt or outline in seconds.", url:"https://gamma.app", free:true },
  { name:"Synthesia", category:"Creative", subcategory:"AI Video", audience:["Teachers","Schools"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Create professional AI avatar videos for lesson content, CPD and school communications.", url:"https://www.synthesia.io", free:false },
  { name:"Miro", category:"Creative", subcategory:"Whiteboard", audience:["Teachers","Students","Admin"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Online collaborative whiteboard with AI features for brainstorming and visual planning.", url:"https://miro.com/education/", free:true },
  { name:"Beautiful.ai", category:"Creative", subcategory:"Presentations", audience:["Teachers","SLT"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered smart presentation tool that auto-designs slides as you add content.", url:"https://www.beautiful.ai", free:false },
  { name:"Prezi", category:"Creative", subcategory:"Presentations", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Dynamic AI presentation tool with zooming canvas for engaging visual storytelling.", url:"https://prezi.com", free:true },
  { name:"Pictory", category:"Creative", subcategory:"Video Creation", audience:["Teachers"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Converts text and scripts into short AI videos — useful for flipped learning resources.", url:"https://pictory.ai", free:true },
  { name:"Runway", category:"Creative", subcategory:"AI Video", audience:["Teachers","Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Advanced AI video generation and editing tool for creative media projects.", url:"https://runwayml.com", free:true },
  { name:"PlayHT", category:"Creative", subcategory:"Voice/TTS", audience:["Teachers","SENCO"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI text-to-speech platform for creating voiceovers for educational content.", url:"https://play.ht", free:true },
  { name:"Audionotes", category:"Creative", subcategory:"Voice Notes", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI voice note app that transcribes and summarises spoken recordings into structured notes.", url:"https://audionotes.app", free:true },
  { name:"Figma for Education", category:"Creative", subcategory:"Design Collaboration", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Professional design and prototyping tool for technology and creative computing students.", url:"https://www.figma.com/education/", free:true },
  { name:"Adobe Firefly", category:"Creative", subcategory:"AI Image", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Adobe's commercially safe AI image generator for creating classroom visuals.", url:"https://firefly.adobe.com", free:true },
  { name:"Microsoft Designer", category:"Creative", subcategory:"AI Design", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free AI design tool from Microsoft that creates images and graphics from text prompts.", url:"https://designer.microsoft.com", free:true },
  { name:"Fotor AI", category:"Creative", subcategory:"Image Creation", audience:["Teachers","Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI image generator and photo editor for creating classroom visuals and student projects.", url:"https://www.fotor.com/ai-image-generator/", free:true },

  // ── Systems (12) ─────────────────────────────────────────────────────────
  { name:"Google Classroom", category:"Systems", subcategory:"LMS", audience:["Teachers","Students","Admin","SLT"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Google's free learning management system used by millions of UK schools for assignments and feedback.", url:"https://classroom.google.com", free:true },
  { name:"Microsoft 365 Education", category:"Systems", subcategory:"Productivity Suite", audience:["Teachers","Students","Admin","SLT"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Complete productivity suite with Teams, Word, Excel and PowerPoint — free for UK schools.", url:"https://www.microsoft.com/en-gb/education/products/office", free:true },
  { name:"Microsoft Copilot for Education", category:"Systems", subcategory:"AI Layer", audience:["Teachers","Students","Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI layer across Microsoft 365 for Education — lesson planning, feedback and admin automation.", url:"https://educationblog.microsoft.com/en-us/2024/04/microsoft-copilot-for-education", free:false },
  { name:"Moodle", category:"Systems", subcategory:"LMS", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Open-source LMS used by UK schools and colleges for online learning and course delivery.", url:"https://moodle.com", free:true },
  { name:"Canvas LMS", category:"Systems", subcategory:"LMS", audience:["Teachers","Students","Admin"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Modern learning management system with AI features used widely in UK FE and HE.", url:"https://www.instructure.com/canvas", free:false },
  { name:"Satchel One", category:"Systems", subcategory:"UK MIS", audience:["Teachers","Students","Parents","Admin"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK school platform for homework, behaviour, timetabling and parent communication.", url:"https://www.satchelone.com", free:false },
  { name:"Arbor MIS", category:"Systems", subcategory:"UK MIS", audience:["Admin","SLT","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Cloud-based management information system for UK schools with AI-powered data insights.", url:"https://arbor-education.com", free:false },
  { name:"Classcharts", category:"Systems", subcategory:"Behaviour & Attendance", audience:["Teachers","Admin","SLT","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-built behaviour management, seating plans and parent communication platform.", url:"https://www.classcharts.com", free:true },
  { name:"Firefly Learning", category:"Systems", subcategory:"UK Platform", audience:["Teachers","Students","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-built homework, resources and parent communication platform for secondary schools.", url:"https://fireflylearning.com", free:false },
  { name:"D2L Brightspace", category:"Systems", subcategory:"LMS", audience:["Teachers","Admin"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Enterprise LMS with built-in AI tools for personalised learning paths and analytics.", url:"https://www.d2l.com/brightspace/", free:false },
  { name:"CPOMS", category:"Systems", subcategory:"Safeguarding", audience:["Admin","SLT","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK's leading online safeguarding and pupil welfare recording system for schools.", url:"https://www.cpoms.co.uk", free:false },
  { name:"Smoothwall Monitor", category:"Systems", subcategory:"Filtering & Monitoring", audience:["Admin","SLT"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"AI-powered internet filtering and safeguarding monitoring solution for UK schools.", url:"https://www.smoothwall.com/education/", free:false },

  // ── Parents (9) ───────────────────────────────────────────────────────────
  { name:"ClassDojo", category:"Parents", subcategory:"Communication", audience:["Parents","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"School-home communication platform with behaviour tracking and parent messaging.", url:"https://www.classdojo.com", free:true },
  { name:"Seesaw", category:"Parents", subcategory:"Learning Portfolios", audience:["Parents","Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Digital portfolio platform where parents can see and celebrate their child's learning.", url:"https://web.seesaw.me", free:true },
  { name:"Remind", category:"Parents", subcategory:"Messaging", audience:["Parents","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Simple class messaging app for safe teacher-to-parent communication.", url:"https://www.remind.com", free:true },
  { name:"Khan Academy Kids", category:"Parents", subcategory:"Early Years", audience:["Parents","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free AI-personalised learning app for children aged 2–8 covering literacy and numeracy.", url:"https://learn.khanacademy.org/khan-academy-kids/", free:true },
  { name:"Lingokids", category:"Parents", subcategory:"Language", audience:["Parents","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered English language learning app for young children aged 2–10.", url:"https://lingokids.com", free:true },
  { name:"Common Sense Media", category:"Parents", subcategory:"Digital Safety", audience:["Parents","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Trusted reviews and digital literacy guidance for parents on apps, games and AI tools.", url:"https://www.commonsense.org/education/", free:true },
  { name:"Internet Matters", category:"Parents", subcategory:"Online Safety", audience:["Parents"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK online safety charity providing guides and resources for parents on AI and digital risks.", url:"https://www.internetmatters.org", free:true },
  { name:"Kooth", category:"Parents", subcategory:"Wellbeing", audience:["Students","Parents"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Free NHS-backed online mental wellbeing platform for young people in England.", url:"https://www.kooth.com", free:true },
  { name:"Bedtime Math", category:"Parents", subcategory:"Home Maths", audience:["Parents","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Fun daily maths stories that parents and young children can explore together at home.", url:"https://bedtimemath.org", free:true },

  // ── Assessment (8) ────────────────────────────────────────────────────────
  { name:"Turnitin", category:"Assessment", subcategory:"Academic Integrity", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI detection and plagiarism checking platform — now with generative AI writing detection.", url:"https://www.turnitin.com", free:false },
  { name:"Copyleaks", category:"Assessment", subcategory:"AI Detection", audience:["Teachers","Admin"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI content detection tool that identifies ChatGPT and AI-generated text in student work.", url:"https://copyleaks.com", free:true },
  { name:"Gradescope", category:"Assessment", subcategory:"Grading", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-assisted grading tool that groups similar answers for faster, more consistent marking.", url:"https://www.gradescope.com", free:true },
  { name:"Kahoot!", category:"Assessment", subcategory:"Quizzes", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Game-based learning platform with AI quiz generation for engaging classroom assessments.", url:"https://kahoot.com", free:true },
  { name:"Mentimeter", category:"Assessment", subcategory:"Interactive Polls", audience:["Teachers","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Interactive presentation platform with polls and word clouds for live engagement and CPD.", url:"https://www.mentimeter.com", free:true },
  { name:"Padlet", category:"Assessment", subcategory:"Collaboration", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Digital notice board for collaborative student work, feedback and visual displays.", url:"https://padlet.com", free:true },
  { name:"Flipgrid (Flip)", category:"Assessment", subcategory:"Video Response", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Microsoft's free video discussion platform for student voice and oral presentation practice.", url:"https://flip.com", free:true },
  { name:"Poll Everywhere", category:"Assessment", subcategory:"Live Polling", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Live audience response tool with AI analytics for formative assessment and CPD.", url:"https://www.polleverywhere.com", free:true },

  // ── Coding & STEM (9) ─────────────────────────────────────────────────────
  { name:"Replit Ghostwriter", category:"Coding", subcategory:"AI Code Editor", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI coding assistant within Replit's browser-based IDE — ideal for secondary computing lessons.", url:"https://replit.com/ai", free:true },
  { name:"GitHub Copilot", category:"Coding", subcategory:"Code Assistant", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI pair programmer suggesting code completions — free for verified students and educators.", url:"https://github.com/features/copilot", free:true },
  { name:"Scratch AI Extensions", category:"Coding", subcategory:"Primary Coding", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"MIT's block-based coding platform with AI extensions for machine learning projects.", url:"https://scratch.mit.edu", free:true },
  { name:"Code.org AI", category:"Coding", subcategory:"AI Literacy", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free computer science curriculum including AI and machine learning courses for schools.", url:"https://code.org/ai", free:true },
  { name:"micro:bit with AI", category:"Coding", subcategory:"Physical Computing", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-backed physical computing device with AI and machine learning projects for schools.", url:"https://microbit.org/projects/make-it-code-it/machine-learning/", free:true },
  { name:"Teachable Machine", category:"Coding", subcategory:"Machine Learning", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Google's free tool for training simple machine learning models without writing code.", url:"https://teachablemachine.withgoogle.com", free:true },
  { name:"ML for Kids", category:"Coding", subcategory:"AI Education", audience:["Students","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK-built platform for teaching machine learning to children using Scratch and Python.", url:"https://machinelearningforkids.co.uk", free:true },
  { name:"Cursor AI", category:"Coding", subcategory:"Code Editor", audience:["Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI-first code editor with natural language code generation for advanced computing students.", url:"https://www.cursor.com", free:true },
  { name:"Lego Education SPIKE", category:"Coding", subcategory:"Robotics", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Hands-on STEM learning system combining Lego building with coding and robotics.", url:"https://education.lego.com/en-gb/products/lego-education-spike-prime-set/45678/", free:false },

  // ── Research (3) ─────────────────────────────────────────────────────────
  { name:"Elicit", category:"Research", subcategory:"Literature Search", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI research assistant that finds and summarises academic papers for evidence-based practice.", url:"https://elicit.com", free:true },
  { name:"Consensus", category:"Research", subcategory:"Evidence Search", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI search engine that extracts consensus findings from scientific research papers.", url:"https://consensus.app", free:true },
  { name:"Scite.ai", category:"Research", subcategory:"Citation Analysis", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI tool showing how research papers have been cited and whether findings were supported.", url:"https://scite.ai", free:true },

  // ── Productivity (3) ─────────────────────────────────────────────────────
  { name:"Notion AI", category:"Productivity", subcategory:"Notes & Planning", audience:["Teachers","Students","Admin"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-enhanced workspace for notes, planning, databases and collaborative school documents.", url:"https://www.notion.com/product/ai", free:false },
  { name:"Fireflies.ai", category:"Productivity", subcategory:"Meeting Notes", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI meeting notetaker that records, transcribes and summarises school meetings automatically.", url:"https://fireflies.ai", free:true },
  { name:"Reflect", category:"Productivity", subcategory:"Note-Taking", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI note-taking app that helps connect ideas and surfaces knowledge across your notes.", url:"https://reflect.app", free:false },

  // ── Wellbeing (2) ─────────────────────────────────────────────────────────
  { name:"Woebot", category:"Wellbeing", subcategory:"Mental Health AI", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered mental health chatbot using CBT techniques to support emotional wellbeing.", url:"https://woebothealth.com", free:true },
  { name:"Togetherall", category:"Wellbeing", subcategory:"Mental Health", audience:["Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Safe online mental health community for young people, moderated by clinical staff.", url:"https://togetherall.com", free:false },

  // ── Teacher AI — additional (10) ──────────────────────────────────────────
  { name:"Quizizz", category:"Teacher AI", subcategory:"Quizzes & Gamification", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI quiz platform with gamified assessments, homework mode and auto-grading for any curriculum.", url:"https://quizizz.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Edpuzzle", category:"Teacher AI", subcategory:"Video Lessons", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Turn any video into an interactive lesson with AI-generated questions and student progress tracking.", url:"https://edpuzzle.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Wooclap", category:"Teacher AI", subcategory:"Audience Response", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Live audience response tool for lessons and CPD with polls, word clouds and AI question generation.", url:"https://www.wooclap.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Explain Everything", category:"Teacher AI", subcategory:"Interactive Whiteboard", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-enhanced digital whiteboard for creating interactive lesson recordings and collaborative work.", url:"https://explaineverything.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Class Companion", category:"Teacher AI", subcategory:"Writing Feedback", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI writing feedback tool that gives students Socratic hints rather than answers to guide improvement.", url:"https://classcompanion.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Parlay", category:"Teacher AI", subcategory:"Discussion & Debate", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI discussion platform for structured classroom debates and Socratic seminars with tracking.", url:"https://parlayideas.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Loom for Education", category:"Teacher AI", subcategory:"Video Messaging", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Screen and camera recording tool for video feedback, lesson walkthroughs and parent updates.", url:"https://www.loom.com/education", free:true, lastReviewed:"Apr 2026" },
  { name:"Whetstone Education", category:"Teacher AI", subcategory:"Teacher Observation", audience:["Teachers","SLT"], ukReady:"Partial", safety:8, tier:"Trusted", desc:"AI-assisted teacher observation and coaching platform for professional development and appraisal.", url:"https://www.whetstoneeducation.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Screencastify", category:"Teacher AI", subcategory:"Screen Recording", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Simple browser-based screen recorder for teacher video feedback and student digital projects.", url:"https://www.screencastify.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Classkick", category:"Teacher AI", subcategory:"Instant Feedback", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Real-time student work platform where teachers see class progress and give instant targeted feedback.", url:"https://classkick.com", free:true, lastReviewed:"Apr 2026" },

  // ── Student AI — additional (10) ──────────────────────────────────────────
  { name:"Hegarty Maths", category:"Student AI", subcategory:"UK Maths", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK GCSE and KS3 maths platform with expert video lessons, practice questions and teacher dashboards.", url:"https://hegartymaths.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Dr Frost Maths", category:"Student AI", subcategory:"UK Maths", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free UK GCSE and A-Level maths platform with thousands of exam-style questions, videos and solutions.", url:"https://www.drfrostmaths.com", free:true, lastReviewed:"Apr 2026" },
  { name:"MathsWatch", category:"Student AI", subcategory:"UK Maths Revision", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK GCSE maths revision VLE with video lessons aligned to AQA, Edexcel and OCR specifications.", url:"https://vle.mathswatch.co.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"Times Tables Rock Stars", category:"Student AI", subcategory:"Primary Maths", audience:["Students","Teachers","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Award-winning UK platform that uses music and games to master times tables in primary school.", url:"https://ttrockstars.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Sam Learning", category:"Student AI", subcategory:"UK Exam Prep", audience:["Students","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK GCSE and A-Level exam preparation platform with personalised revision and teacher progress tracking.", url:"https://www.samlearning.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Pobble", category:"Student AI", subcategory:"Creative Writing", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK primary writing platform with daily prompts, student publishing and teacher planning resources.", url:"https://www.pobble.com", free:true, lastReviewed:"Apr 2026" },
  { name:"StudySmarter", category:"Student AI", subcategory:"AI Study Notes", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI study platform that turns notes and PDFs into flashcards, summaries and personalised practice tests.", url:"https://www.studysmarter.co.uk", free:true, lastReviewed:"Apr 2026" },
  { name:"Anki", category:"Student AI", subcategory:"Spaced Repetition", audience:["Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free spaced repetition flashcard app — the gold standard for long-term memory and exam revision.", url:"https://apps.ankiweb.net", free:true, lastReviewed:"Apr 2026" },
  { name:"Prodigy Math", category:"Student AI", subcategory:"Maths Game", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Fantasy maths game that adapts to each student's level for engaging primary and KS3 maths practice.", url:"https://www.prodigygame.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Revision World", category:"Student AI", subcategory:"UK GCSE Revision", audience:["Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Free UK GCSE and A-Level revision notes, flashcards and past paper practice across all major subjects.", url:"https://revisionworld.com", free:true, lastReviewed:"Apr 2026" },

  // ── SEND — additional (2) ─────────────────────────────────────────────────
  { name:"Therapy Box", category:"SEND", subcategory:"AAC & SLT", audience:["Students","SENCO","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-developed communication app suite for speech, language and communication needs including Grid Player.", url:"https://www.therapy-box.co.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"Pictello", category:"SEND", subcategory:"Social Stories", audience:["Students","SENCO","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Create personalised visual social stories and video models for students with autism and SEND.", url:"https://www.assistiveware.com/products/pictello", free:false, lastReviewed:"Apr 2026" },

  // ── Writing — additional (6) ──────────────────────────────────────────────
  { name:"NoRedInk", category:"Writing", subcategory:"Grammar", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered grammar and writing practice that adapts to each student's interests and level.", url:"https://www.noredink.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Turnitin Draft Coach", category:"Writing", subcategory:"Academic Writing", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Real-time citation and similarity checking integrated into Google Docs for academic writing support.", url:"https://www.turnitin.com/products/draft-coach/", free:false, lastReviewed:"Apr 2026" },
  { name:"Writable", category:"Writing", subcategory:"Writing Feedback", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-assisted writing platform with peer review, rubrics and personalised feedback for all key stages.", url:"https://www.writable.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Copy.ai", category:"Writing", subcategory:"AI Content", audience:["Teachers","Admin"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI writing assistant for generating school communications, newsletters and policy draft content.", url:"https://www.copy.ai", free:true, lastReviewed:"Apr 2026" },
  { name:"Jasper AI", category:"Writing", subcategory:"AI Content", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Professional AI writing tool for school marketing, annual reports and official documentation.", url:"https://www.jasper.ai", free:false, lastReviewed:"Apr 2026" },
  { name:"Rytr", category:"Writing", subcategory:"AI Writing", audience:["Teachers","Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Affordable AI writing assistant for generating lesson content, summaries and differentiated resources.", url:"https://rytr.me", free:true, lastReviewed:"Apr 2026" },

  // ── Creative — additional (6) ─────────────────────────────────────────────
  { name:"Descript", category:"Creative", subcategory:"Video & Audio Editing", audience:["Teachers","Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI video and podcast editor where you edit by editing the transcript — great for CPD content creation.", url:"https://www.descript.com", free:true, lastReviewed:"Apr 2026" },
  { name:"HeyGen", category:"Creative", subcategory:"AI Video Avatars", audience:["Teachers","Schools"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Create AI avatar videos with a digital presenter for lesson content and school communications.", url:"https://www.heygen.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Kapwing", category:"Creative", subcategory:"Video Editing", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Online AI video editor for educational content, student media projects and classroom resources.", url:"https://www.kapwing.com", free:true, lastReviewed:"Apr 2026" },
  { name:"WeVideo", category:"Creative", subcategory:"Cloud Video", audience:["Students","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Cloud-based video creation platform designed for schools with student collaboration and teacher controls.", url:"https://www.wevideo.com/education", free:true, lastReviewed:"Apr 2026" },
  { name:"Piktochart", category:"Creative", subcategory:"Infographics", audience:["Teachers","Students","Admin"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered infographic and report creator for visualising data and producing school displays.", url:"https://piktochart.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Animoto", category:"Creative", subcategory:"Video Maker", audience:["Teachers","Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Simple AI video maker for celebration videos, school announcements and lesson recap clips.", url:"https://animoto.com", free:true, lastReviewed:"Apr 2026" },

  // ── Parents — additional (5) ──────────────────────────────────────────────
  { name:"Parent Zone", category:"Parents", subcategory:"Digital Safety", audience:["Parents","Schools"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK parent digital safety charity with expert guides on AI, screen time and online risks for families.", url:"https://parentzone.org.uk", free:true, lastReviewed:"Apr 2026" },
  { name:"Family Zone", category:"Parents", subcategory:"Parental Controls", audience:["Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Comprehensive parental control app covering school Wi-Fi and home digital wellbeing management.", url:"https://www.familyzone.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Google Family Link", category:"Parents", subcategory:"Parental Controls", audience:["Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free Google parental controls for managing children's apps, screen time and location on Android devices.", url:"https://families.google.com/familylink/", free:true, lastReviewed:"Apr 2026" },
  { name:"CEOP ThinkUKnow", category:"Parents", subcategory:"Online Safety", audience:["Parents","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"NCA-CEOP's ThinkUKnow resources for parents and teachers on child online safety and reporting abuse.", url:"https://www.thinkuknow.co.uk", free:true, lastReviewed:"Apr 2026" },
  { name:"Talking Futures", category:"Parents", subcategory:"Careers Guidance", audience:["Parents","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK Careers & Enterprise Company resource helping parents support career conversations with teenagers.", url:"https://www.talkingfutures.org.uk", free:true, lastReviewed:"Apr 2026" },

  // ── Assessment — additional (5) ───────────────────────────────────────────
  { name:"Edulastic", category:"Assessment", subcategory:"Standards Assessment", audience:["Teachers","Admin"], ukReady:"Partial", safety:8, tier:"Trusted", desc:"AI-powered formative and summative assessment with question banks and auto-scoring analytics.", url:"https://edulastic.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Socrative", category:"Assessment", subcategory:"Live Quizzes", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Simple classroom response system with space races, exit tickets and instant grade reports.", url:"https://www.socrative.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Quizalize", category:"Assessment", subcategory:"UK Curriculum Quizzes", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK curriculum-aligned quiz platform with mastery tracking and learning gap analysis for teachers.", url:"https://www.quizalize.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Plickers", category:"Assessment", subcategory:"No-Device Assessment", audience:["Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Paper-card classroom polling — students hold printed cards, teacher scans the room with a phone.", url:"https://get.plickers.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Ziplet", category:"Assessment", subcategory:"Exit Tickets", audience:["Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered digital exit ticket tool for quick formative assessment checks at the end of any lesson.", url:"https://ziplet.com", free:true, lastReviewed:"Apr 2026" },

  // ── Coding — additional (3) ───────────────────────────────────────────────
  { name:"Tinkercad", category:"Coding", subcategory:"3D Design & STEM", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free browser-based 3D design and electronics simulation tool from Autodesk for STEM education.", url:"https://www.tinkercad.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Raspberry Pi Foundation", category:"Coding", subcategory:"Physical Computing", audience:["Students","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK computing education charity providing free curriculum, projects and teacher training resources.", url:"https://www.raspberrypi.org/education", free:true, lastReviewed:"Apr 2026" },
  { name:"Kano Computing", category:"Coding", subcategory:"Creative Coding", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-based creative computing kit and online platform for ages 6–14 to learn coding and hardware.", url:"https://kano.me", free:false, lastReviewed:"Apr 2026" },

  // ── Research — additional (6) ─────────────────────────────────────────────
  { name:"Connected Papers", category:"Research", subcategory:"Literature Mapping", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Visual graph tool for exploring the academic literature landscape around any research paper or topic.", url:"https://www.connectedpapers.com", free:true, lastReviewed:"Apr 2026" },
  { name:"ResearchRabbit", category:"Research", subcategory:"Paper Discovery", audience:["Teachers","Students"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered paper discovery tool that surfaces relevant research and maps citation networks.", url:"https://www.researchrabbit.ai", free:true, lastReviewed:"Apr 2026" },
  { name:"Semantic Scholar", category:"Research", subcategory:"AI Literature Search", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free AI-powered academic search engine with TLDR summaries, citation networks and paper recommendations.", url:"https://www.semanticscholar.org", free:true, lastReviewed:"Apr 2026" },
  { name:"Zotero", category:"Research", subcategory:"Citation Management", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free open-source reference manager with AI features for organising and citing academic research.", url:"https://www.zotero.org", free:true, lastReviewed:"Apr 2026" },
  { name:"SciSummary", category:"Research", subcategory:"Paper Summaries", audience:["Teachers","Students"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI tool that summarises academic papers into plain English — useful for evidence-based CPD preparation.", url:"https://scisummary.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Humata AI", category:"Research", subcategory:"Document Q&A", audience:["Teachers","Students","Admin"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Chat with any PDF or document using AI — ideal for extracting insights from Ofsted reports and research.", url:"https://www.humata.ai", free:true, lastReviewed:"Apr 2026" },

  // ── Productivity — additional (8) ─────────────────────────────────────────
  { name:"Todoist AI", category:"Productivity", subcategory:"Task Management", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-enhanced task manager with smart scheduling and priority sorting for busy school staff.", url:"https://todoist.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Asana", category:"Productivity", subcategory:"Project Management", audience:["Admin","SLT","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-powered project management for school improvement planning, CPD coordination and team tasks.", url:"https://asana.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Zapier AI", category:"Productivity", subcategory:"Automation", audience:["Admin","SLT"], ukReady:"Yes", safety:7, tier:"Guided", desc:"No-code AI automation connecting school apps to eliminate repetitive admin and data-entry tasks.", url:"https://zapier.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Mem AI", category:"Productivity", subcategory:"AI Memory Notes", audience:["Teachers","Admin"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI note-taking app that automatically organises and surfaces relevant notes when you need them.", url:"https://mem.ai", free:false, lastReviewed:"Apr 2026" },
  { name:"Reclaim AI", category:"Productivity", subcategory:"Smart Scheduling", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI calendar tool that automatically protects planning, marking and CPD preparation time.", url:"https://reclaim.ai", free:true, lastReviewed:"Apr 2026" },
  { name:"Clockwise", category:"Productivity", subcategory:"Calendar AI", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI calendar assistant that finds optimal meeting times and protects focus time for school staff.", url:"https://www.getclockwise.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Coda AI", category:"Productivity", subcategory:"Collaborative Docs", audience:["Admin","SLT","Teachers"], ukReady:"Yes", safety:7, tier:"Guided", desc:"AI-powered doc and database tool for building school handbooks, tracking systems and planning documents.", url:"https://coda.io", free:true, lastReviewed:"Apr 2026" },
  { name:"Tana", category:"Productivity", subcategory:"AI Note-Taking", audience:["Teachers","SLT"], ukReady:"Yes", safety:7, tier:"Guided", desc:"Next-gen note-taking with AI tagging and supertags for connecting school knowledge and strategic plans.", url:"https://tana.inc", free:false, lastReviewed:"Apr 2026" },

  // ── Wellbeing — additional (5) ────────────────────────────────────────────
  { name:"Wysa", category:"Wellbeing", subcategory:"Mental Health AI", audience:["Students","Parents"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI wellbeing coach using CBT and mindfulness techniques to support young people's mental health.", url:"https://www.wysa.com", free:true, lastReviewed:"Apr 2026" },
  { name:"Headspace for Education", category:"Wellbeing", subcategory:"Mindfulness", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Mindfulness and meditation app with a dedicated free education programme for schools and staff.", url:"https://www.headspace.com/schools", free:true, lastReviewed:"Apr 2026" },
  { name:"Calm for Schools", category:"Wellbeing", subcategory:"Mindfulness", audience:["Students","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Free school subscription to Calm's meditations, sleep stories and breathing exercises for classrooms.", url:"https://www.calm.com/schools", free:true, lastReviewed:"Apr 2026" },
  { name:"Place2Be", category:"Wellbeing", subcategory:"SEMH Support", audience:["Students","SENCO","Parents"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK charity providing in-school counselling and mental health support to children and families.", url:"https://www.place2be.org.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"Unmind", category:"Wellbeing", subcategory:"Staff Wellbeing", audience:["Teachers","Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Digital mental health platform for school staff offering evidence-based tools for wellbeing and resilience.", url:"https://unmind.com", free:false, lastReviewed:"Apr 2026" },

  // ── MIS & Analytics (8) ───────────────────────────────────────────────────
  { name:"SIMS (Capita)", category:"MIS & Analytics", subcategory:"UK MIS", audience:["Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK's most widely used school management information system for pupil data, attendance and reporting.", url:"https://www.capita-sims.co.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"Bromcom", category:"MIS & Analytics", subcategory:"UK Cloud MIS", audience:["Admin","SLT","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Cloud-based UK MIS with behaviour, attendance, timetabling and parent communication modules.", url:"https://www.bromcom.com", free:false, lastReviewed:"Apr 2026" },
  { name:"ScholarPack", category:"MIS & Analytics", subcategory:"UK Primary MIS", audience:["Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK cloud MIS designed specifically for primary schools with simple assessment and reporting tools.", url:"https://scholarpack.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Pupil Asset", category:"MIS & Analytics", subcategory:"UK Assessment MIS", audience:["Admin","SLT","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK pupil tracking and assessment platform with curriculum mapping, SEND tracking and progress analysis.", url:"https://www.pupilasset.com", free:false, lastReviewed:"Apr 2026" },
  { name:"FFT Aspire", category:"MIS & Analytics", subcategory:"School Data Analytics", audience:["SLT","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"National pupil progress and attainment analytics platform used by the majority of UK secondary schools.", url:"https://fft.org.uk/fft-aspire/", free:false, lastReviewed:"Apr 2026" },
  { name:"SISRA Analytics", category:"MIS & Analytics", subcategory:"Exam Analytics", audience:["SLT","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK exam results analysis and Progress 8 tracking platform for school improvement and Ofsted planning.", url:"https://www.sisraanalytics.co.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"4Matrix", category:"MIS & Analytics", subcategory:"Progress Tracking", audience:["SLT","Teachers"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"School data analysis tool for tracking pupil progress, monitoring disadvantaged gaps and Ofsted preparation.", url:"https://www.4matrix.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Compass Education", category:"MIS & Analytics", subcategory:"Student Management", audience:["Admin","SLT","Teachers","Parents"], ukReady:"Partial", safety:8, tier:"Trusted", desc:"Comprehensive school management platform covering wellbeing, attendance, reporting and parent communications.", url:"https://www.compass.education", free:false, lastReviewed:"Apr 2026" },

  // ── Safeguarding (6) ──────────────────────────────────────────────────────
  { name:"MyConcern", category:"Safeguarding", subcategory:"Safeguarding Recording", audience:["Admin","SLT","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK-leading safeguarding incident recording and case management system used in thousands of schools.", url:"https://www.myconcern.education", free:false, lastReviewed:"Apr 2026" },
  { name:"Impero Education Pro", category:"Safeguarding", subcategory:"Classroom Monitoring", audience:["Admin","SLT","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK classroom monitoring software with AI safeguarding keyword alerts and remote screen supervision.", url:"https://www.imperosoftware.com/uk/", free:false, lastReviewed:"Apr 2026" },
  { name:"Securus Software", category:"Safeguarding", subcategory:"Online Monitoring", audience:["Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-powered monitoring that alerts DSLs to at-risk student online behaviour and keyword activity.", url:"https://www.securussoftware.co.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"Lightspeed Systems", category:"Safeguarding", subcategory:"Internet Filtering", audience:["Admin","SLT"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"AI-driven internet filtering and student activity monitoring for UK school networks.", url:"https://www.lightspeedsystems.com", free:false, lastReviewed:"Apr 2026" },
  { name:"ActOn Safeguarding", category:"Safeguarding", subcategory:"Staff Training", audience:["Admin","SLT","Teachers","SENCO"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK-certified online safeguarding and KCSIE training platform for all school and college staff.", url:"https://www.actonsafeguarding.co.uk", free:false, lastReviewed:"Apr 2026" },
  { name:"Eduspot Wellbeing", category:"Safeguarding", subcategory:"Pupil Welfare", audience:["Admin","SLT","SENCO","Teachers"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK pupil wellbeing and pastoral care management platform integrated with major MIS systems.", url:"https://www.eduspot.co.uk", free:false, lastReviewed:"Apr 2026" },

  // ── AI Policy (5) ─────────────────────────────────────────────────────────
  { name:"AI for Education (AIfE)", category:"AI Policy", subcategory:"UK AI Guidance", audience:["Teachers","SLT","Admin"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"UK organisation providing practical AI in education guidance, policy templates and school leader briefings.", url:"https://www.aiforeducation.co.uk", free:true, lastReviewed:"Apr 2026" },
  { name:"NAACE AI in Education", category:"AI Policy", subcategory:"UK Framework", audience:["SLT","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"NAACE's framework and guidance for school leaders implementing responsible AI across the curriculum.", url:"https://www.naace.co.uk/publications/artificial-intelligence-in-education", free:true, lastReviewed:"Apr 2026" },
  { name:"DfE AI in Education Guidance", category:"AI Policy", subcategory:"Government Guidance", audience:["SLT","Admin","Teachers"], ukReady:"Yes", safety:10, tier:"Trusted", desc:"Official UK government guidance for schools and colleges on using generative AI tools safely.", url:"https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education", free:true, lastReviewed:"Apr 2026" },
  { name:"EdSafe AI Alliance", category:"AI Policy", subcategory:"International Standards", audience:["SLT","Teachers"], ukReady:"Partial", safety:9, tier:"Trusted", desc:"International alliance developing responsible AI standards and safe deployment practices for K-12 schools.", url:"https://www.edsafeai.org", free:true, lastReviewed:"Apr 2026" },
  { name:"UNESCO AI in Education", category:"AI Policy", subcategory:"Global Guidance", audience:["SLT","Teachers"], ukReady:"Partial", safety:9, tier:"Trusted", desc:"UNESCO's competency framework and ethical guidance for schools deploying AI-based educational tools.", url:"https://www.unesco.org/en/digital-education/artificial-intelligence", free:true, lastReviewed:"Apr 2026" },

  // ── Literacy (7) ──────────────────────────────────────────────────────────
  { name:"Accelerated Reader", category:"Literacy", subcategory:"Reading Programme", audience:["Students","Teachers","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK's most popular reading practice programme with AI-personalised quizzes and vocabulary growth tracking.", url:"https://www.renaissance.com/products/accelerated-reader/", free:false, lastReviewed:"Apr 2026" },
  { name:"Wordwall", category:"Literacy", subcategory:"Teaching Resources", audience:["Teachers","Students"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"Create interactive classroom activities, word games and resource templates widely used in UK schools.", url:"https://wordwall.net", free:true, lastReviewed:"Apr 2026" },
  { name:"Reading Plus", category:"Literacy", subcategory:"Comprehension", audience:["Students","Schools"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"Adaptive reading comprehension platform that builds speed, fluency and critical thinking skills.", url:"https://www.readingplus.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Spelling Shed", category:"Literacy", subcategory:"UK Spelling", audience:["Students","Teachers","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK National Curriculum-aligned spelling platform with games, house challenges and teacher tracking.", url:"https://www.spellingshed.com", free:true, lastReviewed:"Apr 2026" },
  { name:"IDL Literacy", category:"Literacy", subcategory:"Dyslexia Literacy", audience:["Students","SENCO","Schools"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-developed evidence-based literacy intervention for students with dyslexia and reading difficulties.", url:"https://idlsgroup.com", free:false, lastReviewed:"Apr 2026" },
  { name:"Lexia PowerUp", category:"Literacy", subcategory:"Secondary Literacy", audience:["Students","Schools"], ukReady:"Yes", safety:8, tier:"Trusted", desc:"AI-driven literacy programme for secondary students who are behind age-expected reading levels.", url:"https://www.lexialearning.com/products/powerup", free:false, lastReviewed:"Apr 2026" },
  { name:"Phonics Hero", category:"Literacy", subcategory:"Phonics", audience:["Students","Teachers","Parents"], ukReady:"Yes", safety:9, tier:"Trusted", desc:"UK-developed online phonics programme aligned to Year 1 Phonics Screening Check with progress tracking.", url:"https://www.phonicshero.com", free:false, lastReviewed:"Apr 2026" },
];

export const TOOLS: Tool[] = TOOLS_RAW.map(t => ({ ...t, slug: toSlug(t.name) }));
