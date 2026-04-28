import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLabel from '../components/SectionLabel';
import SEO from '../components/SEO';
import { track } from '../utils/analytics';

const TEAL = '#00808a';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier         = 'Trusted' | 'Guided' | 'Emerging';
type RoleTab      = 'All' | 'Teachers' | 'Students' | 'SENCO' | 'Parents' | 'Schools' | 'SLT' | 'Admin';
type SafetyFilter = 'All' | 'Trusted' | 'Guided' | 'Emerging';
type SortOption   = 'A-Z' | 'Safety Score';

interface ToolRaw {
  name: string; category: string; subcategory: string;
  audience: string[]; ukReady: 'Yes' | 'Partial';
  safety: number; tier: Tier; desc: string; url: string; free: boolean;
}
interface Tool extends ToolRaw { slug: string; }

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Category colours ─────────────────────────────────────────────────────────

const CAT_COLOURS: Record<string, { bg: string; text: string }> = {
  'Teacher AI':   { bg: '#e0f5f6', text: TEAL },
  'Student AI':   { bg: '#dbeafe', text: '#2563eb' },
  'SEND':         { bg: '#f3e8ff', text: '#7c3aed' },
  'Writing':      { bg: '#e0e7ff', text: '#4338ca' },
  'General AI':   { bg: '#f3f4f6', text: '#374151' },
  'Creative':     { bg: '#fce7f3', text: '#be185d' },
  'Systems':      { bg: '#f1f5f9', text: '#475569' },
  'Parents':      { bg: '#fef3c7', text: '#92400e' },
  'Assessment':   { bg: '#fef9c3', text: '#854d0e' },
  'Coding':       { bg: '#d1fae5', text: '#065f46' },
  'Research':     { bg: '#ede9fe', text: '#5b21b6' },
  'Productivity': { bg: '#e0f2fe', text: '#0369a1' },
  'Wellbeing':    { bg: '#dcfce7', text: '#15803d' },
};

const TIER_STYLE: Record<Tier, { bg: string; text: string }> = {
  Trusted:  { bg: '#dcfce7', text: '#166534' },
  Guided:   { bg: '#fef9c3', text: '#854d0e' },
  Emerging: { bg: '#ffedd5', text: '#9a3412' },
};

// ─── 155-tool database ────────────────────────────────────────────────────────

const TOOLS_RAW: ToolRaw[] = [
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
];

const TOOLS: Tool[] = TOOLS_RAW.map(t => ({ ...t, slug: toSlug(t.name) }));

// ─── Filter constants ─────────────────────────────────────────────────────────

const ROLE_TABS: RoleTab[] = ['All', 'Teachers', 'Students', 'SENCO', 'Parents', 'Schools', 'SLT', 'Admin'];
const CAT_FILTERS = [
  'All', 'Teacher AI', 'Student AI', 'SEND', 'Writing', 'General AI',
  'Creative', 'Systems', 'Parents', 'Assessment', 'Coding',
  'Research', 'Productivity', 'Wellbeing',
] as const;
const SAFETY_FILTERS: SafetyFilter[] = ['All', 'Trusted', 'Guided', 'Emerging'];

// ─── Safety badge (simple for grid performance) ───────────────────────────────

function SafetyBadge({ score, tier }: { score: number; tier: string }) {
  const colour = score >= 9 ? '#16a34a' : score >= 7 ? '#d97706' : score >= 5 ? '#ea580c' : '#dc2626';
  const ts = TIER_STYLE[tier as Tier] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ background: colour }}
        aria-label={`Safety score ${score} out of 10`}
      >
        {score}
      </div>
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.text }}>
        {tier}
      </span>
    </div>
  );
}

// ─── Tool card ────────────────────────────────────────────────────────────────

function ToolCard({
  tool, inCompare, onToggleCompare, compareDisabled,
}: {
  tool: Tool; inCompare: boolean; onToggleCompare: () => void; compareDisabled: boolean;
}) {
  const catStyle = CAT_COLOURS[tool.category] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <div
      className="flex flex-col rounded-2xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{
        borderColor: inCompare ? TEAL : '#e8e6e0',
        background: 'white',
        outline: inCompare ? `2px solid ${TEAL}` : undefined,
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Row 1: category + badges */}
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.text }}>
            {tool.category}
          </span>
          {tool.ukReady === 'Yes' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#166534' }}>
              🇬🇧 UK Ready
            </span>
          )}
          {tool.free && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#e0f5f6', color: TEAL }}>
              Free tier
            </span>
          )}
        </div>

        {/* Name + subcategory */}
        <h2 className="font-display text-base leading-tight mb-0.5" style={{ color: 'var(--text)' }}>
          {tool.name}
        </h2>
        <p className="text-[10px] mb-3" style={{ color: '#c5c2bb' }}>{tool.subcategory}</p>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#6b6760' }}>{tool.desc}</p>

        {/* Audience tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tool.audience.map(a => (
            <span key={a} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>
              {a}
            </span>
          ))}
        </div>

        {/* Safety score */}
        <div className="mb-4">
          <SafetyBadge score={tool.safety} tier={tool.tier} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: TEAL, color: 'white' }}
          >
            Try Demo →
          </a>
          <Link
            to={`/tools/${tool.slug}`}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-lg border transition-colors hover:bg-[#f7f6f2]"
            style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
          >
            Learn More
          </Link>
          <button
            onClick={onToggleCompare}
            disabled={compareDisabled && !inCompare}
            className="text-[10px] font-semibold px-2 py-2 rounded-lg border transition-all disabled:opacity-30 flex-shrink-0"
            style={inCompare
              ? { background: TEAL, color: 'white', borderColor: TEAL }
              : { background: 'white', color: '#9ca3af', borderColor: '#e8e6e0' }
            }
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            {inCompare ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compare bar (sticky bottom) ─────────────────────────────────────────────

function CompareBar({ count, onCompare, onClear }: { count: number; onCompare: () => void; onClear: () => void }) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
      style={{ background: '#111210', border: '1px solid #2a2825' }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: i < count ? TEAL : '#3a3835' }}
          />
        ))}
      </div>
      <span className="text-sm font-medium" style={{ color: '#9ca3af' }}>
        {count}/3 selected
      </span>
      <button
        onClick={onCompare}
        disabled={count < 2}
        className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-40 hover:opacity-80"
        style={{ background: TEAL, color: 'white' }}
      >
        Compare Now ▶
      </button>
      <button
        onClick={onClear}
        className="text-xs transition-opacity hover:opacity-60"
        style={{ color: '#6b6760' }}
      >
        Clear
      </button>
    </motion.div>
  );
}

// ─── Compare modal ────────────────────────────────────────────────────────────

function CompareModal({ tools, onClose }: { tools: Tool[]; onClose: () => void }) {
  const rows: { label: string; render: (t: Tool) => React.ReactNode }[] = [
    { label: 'Category',    render: t => t.category },
    { label: 'Subcategory', render: t => t.subcategory },
    { label: 'Safety',      render: t => <SafetyBadge score={t.safety} tier={t.tier} /> },
    { label: 'UK Ready',    render: t => (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={t.ukReady === 'Yes' ? { background: '#dcfce7', color: '#166534' } : { background: '#f3f4f6', color: '#6b7280' }}>
        {t.ukReady}
      </span>
    )},
    { label: 'Free tier',   render: t => t.free ? '✓ Yes' : '— No' },
    { label: 'Audience',    render: t => (
      <div className="flex flex-wrap gap-1">
        {t.audience.map(a => (
          <span key={a} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>{a}</span>
        ))}
      </div>
    )},
    { label: 'Description', render: t => <span className="text-xs leading-relaxed" style={{ color: '#6b6760' }}>{t.desc}</span> },
    { label: 'Try',         render: t => (
      <a href={t.url} target="_blank" rel="noopener noreferrer"
        className="inline-block text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
        style={{ background: TEAL, color: 'white' }}>
        Try Demo →
      </a>
    )},
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(17,18,16,0.75)' }} />
      <motion.div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl"
        style={{ background: 'white', border: '1px solid #e8e6e0' }}
        initial={{ scale: 0.97, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 16 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ background: '#111210', borderBottom: '1px solid #1f1f1c' }}>
          <p className="text-sm font-semibold" style={{ color: 'white' }}>
            Comparing {tools.length} tools
          </p>
          <button onClick={onClose} className="text-lg leading-none transition-opacity hover:opacity-60"
            style={{ color: '#6b6760' }} aria-label="Close">✕</button>
        </div>

        {/* Tool name headers */}
        <div className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, borderColor: '#e8e6e0' }}>
          <div className="px-4 py-3" style={{ background: '#f7f6f2' }} />
          {tools.map(t => (
            <div key={t.slug} className="px-4 py-3 border-l" style={{ background: '#f7f6f2', borderColor: '#e8e6e0' }}>
              <p className="font-display text-sm font-bold" style={{ color: 'var(--text)' }}>{t.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#c5c2bb' }}>{t.category}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map(row => (
          <div key={row.label} className="grid border-b" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, borderColor: '#f3f4f6' }}>
            <div className="px-4 py-3 flex items-start" style={{ background: '#f7f6f2' }}>
              <span className="text-xs font-semibold" style={{ color: '#6b6760' }}>{row.label}</span>
            </div>
            {tools.map(t => (
              <div key={t.slug} className="px-4 py-3 border-l text-xs" style={{ borderColor: '#f3f4f6', color: 'var(--text)' }}>
                {row.render(t)}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TRAINING_CROSS_SELL = [
  { name: 'AI Skills Hub', provider: 'DfE / Ufi VocTech', desc: 'Official DfE-backed CPD-aligned AI modules for every school role.', tag: 'Free · Accredited' },
  { name: 'Elements of AI', provider: 'Reaktor / U Helsinki', desc: 'World-renowned introductory AI course. No maths required. Certificate on completion.', tag: 'Free · Certificate' },
  { name: 'Google AI Essentials', provider: 'Google', desc: "Google's practical AI course — prompt writing, Gemini, and AI safety. Shareable certificate.", tag: 'Free · 8 hrs' },
];

// Pre-compute stats once
const STAT_TOTAL   = TOOLS.length;
const STAT_TRUSTED = TOOLS.filter(t => t.tier === 'Trusted').length;
const STAT_SEND    = TOOLS.filter(t => t.category === 'SEND').length;
const STAT_FREE    = TOOLS.filter(t => t.free).length;

export default function Tools() {
  const [roleTab,      setRoleTab]      = useState<RoleTab>('All');
  const [catFilter,    setCatFilter]    = useState<string>('All');
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>('All');
  const [sortOption,   setSortOption]   = useState<SortOption>('A-Z');
  const [search,       setSearch]       = useState('');
  const [compareList,  setCompareList]  = useState<string[]>([]);
  const [compareOpen,  setCompareOpen]  = useState(false);

  const filtered = useMemo(() => {
    let r = TOOLS;

    if (roleTab !== 'All') {
      if (roleTab === 'Schools') r = r.filter(t => t.audience.includes('Schools'));
      else r = r.filter(t => t.audience.includes(roleTab));
    }
    if (catFilter !== 'All')
      r = r.filter(t => t.category === catFilter);
    if (safetyFilter !== 'All')
      r = r.filter(t => t.tier === safetyFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.subcategory.toLowerCase().includes(q)
      );
    }

    const copy = [...r];
    if (sortOption === 'A-Z')
      copy.sort((a, b) => a.name.localeCompare(b.name));
    else
      copy.sort((a, b) => b.safety - a.safety);
    return copy;
  }, [roleTab, catFilter, safetyFilter, search, sortOption]);

  const compareTools = useMemo(
    () => compareList.map(slug => TOOLS.find(t => t.slug === slug)!).filter(Boolean),
    [compareList]
  );

  function toggleCompare(slug: string) {
    setCompareList(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) :
      prev.length < 3 ? [...prev, slug] : prev
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="155 AI Tools for UK Schools – KCSIE Checked | GetPromptly"
        description="155 AI tools independently reviewed and safety-scored for UK schools. Filter by role — teachers, SEND, students, parents, SLT. Every tool KCSIE 2025 assessed."
        keywords="AI tools UK schools 2026, KCSIE AI tools, safe AI education, SEND AI tools, AI for teachers UK, school software reviews"
        path="/tools"
      />

      {/* ── HERO ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <SectionLabel>AI Tools Directory</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          AI Tools for<br />
          <span style={{ color: TEAL }}>UK Education.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-8" style={{ color: '#6b6760' }}>
          {STAT_TOTAL} tools independently safety-scored against KCSIE 2025. Filtered by your role. No paid placements.
        </p>

        {/* Stat boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-10" style={{ background: '#e8e6e0' }}>
          {[
            { label: 'Total Tools',  value: STAT_TOTAL   },
            { label: 'Trusted Tier', value: STAT_TRUSTED  },
            { label: 'SEND Tools',   value: STAT_SEND     },
            { label: 'Free Tier',    value: STAT_FREE     },
          ].map(s => (
            <div key={s.label} className="px-6 py-5" style={{ background: 'white' }}>
              <p className="font-display text-3xl font-bold mb-0.5" style={{ color: TEAL }}>{s.value}</p>
              <p className="text-xs" style={{ color: '#6b6760' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── AGENT CTA STRIP (amber) ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-2xl mb-8"
          style={{ background: '#fef3c7', border: '1px solid #fde68a' }}
        >
          <p className="text-sm font-medium text-center sm:text-left" style={{ color: '#78350f' }}>
            🤖 <strong>Not sure which tool is right for you?</strong> Ask our 24/7 AI advisor — tell us your role, subject, and age group.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{ background: TEAL, color: 'white' }}
          >
            Ask Promptly AI →
          </button>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm" style={{ color: '#c5c2bb' }}>🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) track({ name: 'search_performed', section: 'tools', query: e.target.value });
              }}
              placeholder="Search 155 tools by name, category or description…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a] transition-colors"
              style={{ borderColor: '#e8e6e0', background: 'white', color: 'var(--text)' }}
            />
          </div>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as SortOption)}
            className="px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-[#00808a]"
            style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760', minWidth: '180px' }}
          >
            <option value="A-Z">Sort: A–Z</option>
            <option value="Safety Score">Sort: Safety Score ↓</option>
          </select>
        </div>

        {/* Role tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ROLE_TABS.map(r => (
            <button
              key={r}
              onClick={() => { setRoleTab(r); track({ name: 'filter_applied', section: 'tools', filter: 'role', value: r }); }}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={roleTab === r
                ? { background: TEAL, color: 'white', borderColor: TEAL }
                : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
              }
            >
              {r}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CAT_FILTERS.map(c => {
            const cs = CAT_COLOURS[c];
            const active = catFilter === c;
            return (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={active
                  ? { background: cs?.text ?? '#111210', color: 'white', borderColor: cs?.text ?? '#111210' }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
                }
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Safety filter + result count row */}
        <div className="flex flex-wrap items-center gap-2">
          {SAFETY_FILTERS.map(s => {
            const style = s === 'Trusted' ? TIER_STYLE.Trusted
                        : s === 'Guided'  ? TIER_STYLE.Guided
                        : s === 'Emerging'? TIER_STYLE.Emerging
                        : { bg: '#f3f4f6', text: '#6b7280' };
            return (
              <button
                key={s}
                onClick={() => { setSafetyFilter(s); track({ name: 'filter_applied', section: 'tools', filter: 'safety', value: s }); }}
                className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                style={safetyFilter === s
                  ? { background: style.bg, color: style.text, borderColor: style.text }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
                }
              >
                {s === 'All' ? 'All tiers' : s}
              </button>
            );
          })}
          <span className="ml-auto text-xs" style={{ color: '#c5c2bb' }}>
            Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> of {STAT_TOTAL} tools
          </span>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                <p className="text-sm" style={{ color: '#6b6760' }}>
                  No tools match your filters. Try adjusting your search or removing a filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(tool => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    inCompare={compareList.includes(tool.slug)}
                    onToggleCompare={() => toggleCompare(tool.slug)}
                    compareDisabled={compareList.length >= 3}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── STICKY SIDEBAR (desktop) ── */}
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 space-y-4 mt-1">

            {/* Agent panel */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e6e0' }}>
              <div className="px-4 py-3 border-b" style={{ background: '#111210', borderColor: '#1f1f1c' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b6760' }}>Promptly AI</p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>Ask about any tool</p>
              </div>
              <div className="p-4" style={{ background: 'white' }}>
                <p className="rounded-xl p-3 mb-3 text-sm leading-relaxed italic" style={{ background: '#f7f6f2', color: '#6b6760' }}>
                  "Which SEND tools work with Google Classroom?"
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Ask Promptly AI →
                </button>
                <p className="text-[10px] text-center mt-2" style={{ color: '#c5c2bb' }}>Powered by Claude · Free</p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#c5c2bb' }}>Directory</p>
              <div className="space-y-2.5">
                {[
                  ['Tools reviewed', STAT_TOTAL.toString()],
                  ['Trusted tier',   STAT_TRUSTED.toString()],
                  ['SEND tools',     STAT_SEND.toString()],
                  ['Free tier',      STAT_FREE.toString()],
                  ['Last updated',   'Apr 2026'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span style={{ color: '#6b6760' }}>{l}</span>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety key */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb' }}>Safety Tiers</p>
                <Link to="/safety-methodology" className="text-[10px] font-semibold hover:opacity-70 transition-opacity" style={{ color: TEAL }}>
                  How? →
                </Link>
              </div>
              {([
                { tier: 'Trusted', range: '8–10', desc: 'Recommended' },
                { tier: 'Guided',  range: '6–7',  desc: 'Use with guidance' },
                { tier: 'Emerging',range: '≤5',   desc: 'Policy needed' },
              ] as const).map(item => {
                const s = TIER_STYLE[item.tier];
                return (
                  <div key={item.tier} className="flex items-center gap-2 text-xs mb-2">
                    <span className="w-10 text-center font-bold px-1 py-0.5 rounded" style={{ background: s.bg, color: s.text }}>
                      {item.range}
                    </span>
                    <span style={{ color: '#6b6760' }}>{item.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Compare shortcut */}
            {compareList.length > 0 && (
              <div className="rounded-2xl border p-4" style={{ borderColor: TEAL, background: '#e0f5f6' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: TEAL }}>
                  {compareList.length}/3 tools selected
                </p>
                <button
                  onClick={() => compareList.length >= 2 && setCompareOpen(true)}
                  disabled={compareList.length < 2}
                  className="w-full py-2 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-40 hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Compare Now →
                </button>
                <button onClick={() => setCompareList([])} className="w-full text-center text-xs mt-2 hover:opacity-60" style={{ color: '#6b6760' }}>
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile agent CTA */}
        <div className="lg:hidden mt-8 rounded-2xl overflow-hidden border" style={{ borderColor: '#e8e6e0' }}>
          <div className="p-5" style={{ background: '#111210' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'white' }}>Not sure which tool to use?</p>
            <p className="text-xs italic mb-4" style={{ color: '#9ca3af' }}>Tell us your role and we'll recommend the right tools.</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ background: TEAL, color: 'white' }}
            >
              Ask Promptly AI →
            </button>
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL STRIP ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>Recommended Training</p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'white' }}>Go further with these tools.</h2>
            </div>
            <Link to="/training" className="hidden sm:block text-sm font-semibold hover:opacity-70 transition-opacity pb-1" style={{ color: TEAL }}>
              All training →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#1f1f1c' }}>
            {TRAINING_CROSS_SELL.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to="/training" className="block p-6 transition-colors hover:bg-[#181815]" style={{ background: '#111210' }}>
                  <span className="inline-block text-[10px] font-semibold px-2 py-1 rounded mb-3" style={{ background: '#0d1f0d', color: TEAL }}>{item.tag}</span>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'white' }}>{item.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#4b5563' }}>{item.provider}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{item.desc}</p>
                  <span className="inline-block mt-4 text-xs font-semibold" style={{ color: TEAL }}>Start learning →</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <Link to="/training" className="sm:hidden block text-center mt-6 text-sm font-semibold" style={{ color: TEAL }}>
            Browse all training →
          </Link>
        </div>
      </div>

      {/* ── COMPARE BAR ── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <CompareBar
            count={compareList.length}
            onCompare={() => setCompareOpen(true)}
            onClear={() => setCompareList([])}
          />
        )}
      </AnimatePresence>

      {/* ── COMPARE MODAL ── */}
      <AnimatePresence>
        {compareOpen && compareTools.length >= 2 && (
          <CompareModal tools={compareTools} onClose={() => setCompareOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
