/**
 * ToolsGrid.tsx — Explore AI Tools
 * Filterable by 11 professional roles using shadcn Tabs
 * Each card: safety badge · description · affiliate CTA · video thumbnail placeholder
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Tool {
  name: string;
  tagline: string;
  desc: string;
  safety: number;       // 1–10
  price: string;
  affiliateHref: string;
  category: string;
}

const ALL_LABEL = 'All Tools';

// ── Data ───────────────────────────────────────────────────────────────────────

const TABS: { id: string; label: string; tools: Tool[] }[] = [
  {
    id: 'slt', label: 'Leadership & SLT',
    tools: [
      { name: 'ChatGPT Plus',   tagline: 'Strategy & Ofsted Prep',         desc: 'Draft School Improvement Plans, Ofsted self-evaluations, governor reports and trust strategy documents in minutes.',           safety: 7,  price: '£20/mo',  affiliateHref: '#' },
      { name: 'Perplexity AI',  tagline: 'Evidence & Benchmarking',        desc: 'Research Ofsted judgements, DfE guidance and sector benchmarks with cited sources — perfect for SIP evidence.',              safety: 8,  price: 'Free tier',affiliateHref: '#' },
      { name: 'Otter.ai',       tagline: 'Governor & SLT Meeting Notes',   desc: 'Auto-transcribe SLT and governor meetings, generate action logs, and share summaries without manual note-taking.',         safety: 7,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'teaching', label: 'Teaching & Curriculum',
    tools: [
      { name: 'MagicSchool',    tagline: 'Lesson Planning & Differentiation', desc: 'Generate fully differentiated lesson plans, marking rubrics and exit tickets aligned to the National Curriculum.',        safety: 9,  price: 'Free tier',affiliateHref: '#' },
      { name: 'Diffit',         tagline: 'Differentiated Reading Resources',  desc: 'Adapt any text to any reading level in seconds — perfect for mixed-ability and SEND-inclusive classes.',                  safety: 9,  price: 'Free',     affiliateHref: '#' },
      { name: 'Curipod',        tagline: 'Interactive AI-Powered Lessons',    desc: 'Build engaging lessons with AI-generated polls, discussion prompts and instant student response feedback.',                  safety: 8,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'send', label: 'SEND / Inclusion',
    tools: [
      { name: 'Microsoft Immersive Reader', tagline: 'Reading & Accessibility Support', desc: 'Free built-in Microsoft tool with dyslexia fonts, syllable splitting, line focus, and picture dictionary.',   safety: 10, price: 'Free',     affiliateHref: '#' },
      { name: 'Speechify',      tagline: 'Text-to-Speech for All',          desc: 'Converts any document, website or PDF to natural-sounding speech — vital for visual impairment and dyslexia support.',    safety: 8,  price: 'Free tier',affiliateHref: '#' },
      { name: 'MagicSchool',    tagline: 'IEP & EHCP Drafting',             desc: "Generates first drafts of IEPs and EHCP sections from teacher notes — cut admin time for SENCOs by up to 60%.",           safety: 9,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'pastoral', label: 'Safeguarding & Pastoral',
    tools: [
      { name: 'MyConcern',      tagline: 'Safeguarding Case Management',    desc: 'Purpose-built safeguarding platform for UK schools with audit trails, case workflows and KCSIE-aligned logging.',         safety: 10, price: 'Contact',  affiliateHref: '#' },
      { name: 'Kooth',          tagline: 'Student Wellbeing & Mental Health',desc: 'Free NHS-commissioned digital mental health support for young people — safe, moderated, and clinically backed.',        safety: 10, price: 'Free (NHS)',affiliateHref: '#' },
      { name: 'CPOMS',          tagline: 'Concern & Behaviour Recording',   desc: 'Industry-leading concern management system trusted by 25,000+ UK schools. Full GDPR compliance and secure storage.',       safety: 10, price: 'Contact',  affiliateHref: '#' },
    ],
  },
  {
    id: 'admin', label: 'Administration',
    tools: [
      { name: 'ChatGPT',        tagline: 'Letters, Policies & Templates',   desc: 'Draft parent letters, policy documents, meeting agendas and risk assessments in seconds — save hours every week.',          safety: 7,  price: 'Free',     affiliateHref: '#' },
      { name: 'Fireflies.ai',   tagline: 'Meeting Transcription & Notes',   desc: 'Auto-transcribe staff meetings, generate action lists, and sync to your calendar — works with Teams and Zoom.',            safety: 7,  price: 'Free tier',affiliateHref: '#' },
      { name: 'Notion AI',      tagline: 'Policies & Knowledge Base',       desc: "Organise all your school's policies, procedures and staff handbooks in one searchable AI-powered wiki.",                    safety: 7,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'finance', label: 'Finance',
    tools: [
      { name: 'Microsoft Copilot (Excel)', tagline: 'Budget Analysis & Forecasting', desc: 'Turn complex spreadsheets into plain-English summaries, spot anomalies, and draft CFR narratives.',              safety: 8,  price: 'M365 Add-on',affiliateHref: '#' },
      { name: 'Sage Education', tagline: 'School Financial Management',     desc: 'Finance software built for UK schools and MATs — integrates with SIMS and produces DfE-compliant reports automatically.',  safety: 9,  price: 'Contact',  affiliateHref: '#' },
      { name: 'ChatGPT',        tagline: 'Board & Governor Narratives',     desc: 'Write clear, professional budget narratives for governors and trust boards from raw financial data in minutes.',            safety: 7,  price: 'Free',     affiliateHref: '#' },
    ],
  },
  {
    id: 'hr', label: 'HR',
    tools: [
      { name: 'ChatGPT',        tagline: 'Job Descriptions & HR Comms',     desc: 'Generate inclusive, role-specific job descriptions, interview questions, and staff communication templates.',              safety: 7,  price: 'Free',     affiliateHref: '#' },
      { name: 'Canva AI',       tagline: 'Recruitment & Staff Comms',       desc: 'Design professional recruitment adverts, induction packs and staff communications with AI-assisted templates.',            safety: 8,  price: 'Free tier',affiliateHref: '#' },
      { name: 'Workable',       tagline: 'Applicant Tracking & Screening',  desc: 'AI-powered recruitment platform with DBS-check integration, designed for UK education recruitment workflows.',            safety: 8,  price: 'From £149/mo',affiliateHref: '#' },
    ],
  },
  {
    id: 'it', label: 'IT',
    tools: [
      { name: 'Microsoft Copilot', tagline: 'IT Documentation & Support',  desc: 'Generate IT policies, device management SOPs, and user guides for staff and students at speed.',                           safety: 8,  price: 'M365 Add-on',affiliateHref: '#' },
      { name: 'Gemini for Google Workspace', tagline: 'Workspace & Device Admin', desc: 'AI assistance across Docs, Sheets, Gmail — ideal for Google-first school IT departments.',                         safety: 8,  price: 'Google tier',affiliateHref: '#' },
      { name: 'Notion AI',      tagline: 'IT Policy & Knowledge Base',      desc: 'Build a searchable, living IT knowledge base that staff can query in natural language — no ticket needed.',               safety: 7,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'comms', label: 'Communications',
    tools: [
      { name: 'Canva AI',       tagline: 'Newsletters & Social Media',      desc: "Design school newsletters, social media graphics and prospectus pages with AI suggestions — no designer needed.",        safety: 9,  price: 'Free tier',affiliateHref: '#' },
      { name: 'ChatGPT',        tagline: 'Parent Emails & Announcements',   desc: 'Draft clear, professional parent communications, press releases and website copy in your school tone of voice.',           safety: 7,  price: 'Free',     affiliateHref: '#' },
      { name: 'Mailchimp',      tagline: 'Parent Email Campaigns',          desc: 'Send segmented parent newsletters, event announcements and school updates with GDPR-compliant email marketing.',           safety: 8,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'parents', label: 'Parent Tools',
    tools: [
      { name: 'Khan Academy Khanmigo', tagline: 'Homework Tutor for Children', desc: 'Safe, child-appropriate AI tutor aligned to the curriculum — helps with maths, English and science without doing work for them.', safety: 10, price: 'Free', affiliateHref: '#' },
      { name: 'Google Classroom', tagline: 'Visibility into Learning',     desc: 'Free platform that gives parents real-time visibility of their child\'s assignments, feedback, and progress.',              safety: 10, price: 'Free',     affiliateHref: '#' },
      { name: 'Duolingo',       tagline: 'Language Learning at Home',       desc: 'Gamified language learning app — great for EAL families and students wanting to extend language skills outside school.',    safety: 9,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
  {
    id: 'students', label: 'Student Tools',
    tools: [
      { name: 'Khanmigo',       tagline: 'Guided Revision & Tutoring',      desc: 'AI tutor that asks questions and guides thinking rather than giving answers — builds genuine understanding.',               safety: 10, price: 'Free',     affiliateHref: '#' },
      { name: 'Grammarly',      tagline: 'Writing & Academic Style',        desc: 'Improves spelling, grammar, clarity and academic tone — works in browser, Word and Google Docs.',                          safety: 8,  price: 'Free tier',affiliateHref: '#' },
      { name: 'Wolfram Alpha',  tagline: 'STEM Problem Solving',            desc: 'Step-by-step maths and science solutions with full working — invaluable for A-Level, degree and apprenticeship students.',  safety: 9,  price: 'Free tier',affiliateHref: '#' },
    ],
  },
];

// Flat list with category injected — used for filtering
const ALL_TOOLS: Tool[] = TABS.flatMap((t) =>
  t.tools.map((tool) => ({ ...tool, category: t.label }))
);

const CATEGORIES = [ALL_LABEL, ...TABS.map((t) => t.label)];

// ── Safety badge colour ────────────────────────────────────────────────────────

const safetyColor = (n: number) =>
  n >= 9 ? '#22C55E' : n >= 7 ? '#F59E0B' : '#EF4444';

// ── Tool Card ─────────────────────────────────────────────────────────────────

const ToolCard: FC<{ tool: Tool }> = ({ tool }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
    <Card className="h-full flex flex-col">
      <CardContent className="p-5 flex flex-col gap-4 flex-1">

        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-sm text-ink truncate">{tool.name}</h4>
            <p className="text-[11px] text-ink-light mt-0.5">{tool.tagline}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div
              className="text-lg font-black leading-none"
              style={{ color: safetyColor(tool.safety) }}
              aria-label={`Safety score ${tool.safety} out of 10`}
            >
              {tool.safety}<span className="text-xs text-ink-pale font-medium">/10</span>
            </div>
            <div className="text-[10px] text-ink-pale mt-0.5">Safety</div>
          </div>
        </div>

        {/* Video thumbnail placeholder */}
        <div
          className="w-full aspect-video rounded-xl bg-gradient-to-br from-blue-50 to-teal-50
                     border border-blue-100 flex flex-col items-center justify-center gap-2 cursor-pointer
                     hover:from-blue-100 hover:to-teal-100 transition-colors group"
          role="img"
          aria-label={`Chloe's video review of ${tool.name} — coming soon`}
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center
                          group-hover:scale-105 transition-transform">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l6 4-6 4V4z" fill="#3B82F6"/>
            </svg>
          </div>
          <span className="text-[10px] text-ink-light font-medium">Chloe's Review — coming soon</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed flex-1">{tool.desc}</p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold border-gray-200 text-ink-light"
          >
            {tool.price}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="text-xs font-bold border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white transition-all"
          >
            <a href={tool.affiliateHref} target="_blank" rel="noopener noreferrer sponsored">
              View Tool →
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ── Main ───────────────────────────────────────────────────────────────────────

const ToolsGrid: FC = () => {
  const [activeCategory, setActiveCategory] = useState(ALL_LABEL);

  const filteredTools = activeCategory === ALL_LABEL
    ? ALL_TOOLS
    : ALL_TOOLS.filter((t) => t.category === activeCategory);

  return (
    <section id="tools" aria-labelledby="tools-heading" className="bg-gray-50/60 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-blue-50 text-brand-blue text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-blue-100">
            AI Tools Directory
          </span>
          <h2 id="tools-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            Explore AI Tools<br />
            <span className="text-brand-blue">for Every Role</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm max-w-lg mx-auto">
            Every tool safety-rated 1–10 by Donna. Filter by your role to see only what's relevant to you.
          </p>
        </motion.div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          {/* Underline-style scrollable tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
            <TabsList className="inline-flex h-11 w-max items-center gap-0 rounded-none border-b border-gray-200 bg-transparent p-0">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="whitespace-nowrap rounded-none border-b-2 border-transparent px-4 text-xs sm:text-sm font-semibold text-gray-500
                             data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue data-[state=active]:bg-transparent
                             hover:text-ink transition-colors"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Single filtered grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredTools.map((tool) => (
                <ToolCard key={tool.name + tool.tagline} tool={tool} />
              ))}
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <div className="text-center mt-10">
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl border-2 border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white font-bold transition-all"
          >
            View Full Directory (180+ Tools) →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;
