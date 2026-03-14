/**
 * ToolsGrid.tsx — AI Tools Directory
 * shadcn Tabs filter · Card · Badge · Progress safety score · pastel accents
 */

import React, { FC } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  exit:    { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.18 } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

type Audience = 'all' | 'teachers' | 'parents' | 'students';

interface Tool {
  name: string;
  category: string;
  desc: string;
  score: number;
  scoreColor: string;
  progressClass: string;
  pros: string[];
  cons: string[];
  badgeVariants: ('blue' | 'green' | 'purple' | 'orange' | 'amber' | 'muted')[];
  badgeLabels: string[];
  icon: string;
  iconBg: string;
  pastelBg: string;
  accent: string;
  audiences: Audience[];
  featured?: boolean;
  price: string;
}

const TOOLS: Tool[] = [
  {
    name: 'Khanmigo',
    category: 'Personalised Learning',
    desc: 'Socratic AI tutor that guides rather than answers. Adapts to student pace and alerts teachers in real time.',
    score: 9.6, scoreColor: '#22C55E', progressClass: 'bg-green-400',
    pros: ['Free for UK schools', 'Purpose-built for education', 'No ads, no data selling'],
    cons: ['US curriculum focus', 'Account creation required'],
    badgeVariants: ['green', 'blue'], badgeLabels: ['Free', 'Ages 8–18'],
    icon: '📚', iconBg: '#F0FDF4', pastelBg: 'bg-pastel-green/30', accent: '#22C55E',
    audiences: ['teachers', 'students'], featured: true, price: 'Free',
  },
  {
    name: 'ClassDojo AI',
    category: 'Classroom Management',
    desc: 'Behaviour tracking, parent comms, and AI-generated class reports. UK GDPR compliant.',
    score: 9.4, scoreColor: '#3B82F6', progressClass: 'bg-blue-400',
    pros: ['Free tier for teachers', 'Real-time parent updates', 'Strong privacy controls'],
    cons: ['US-hosted data', 'Premium for AI features'],
    badgeVariants: ['blue', 'purple'], badgeLabels: ['Ages 5–18', 'GDPR Note'],
    icon: '📋', iconBg: '#EFF6FF', pastelBg: 'bg-pastel-blue/30', accent: '#3B82F6',
    audiences: ['teachers', 'parents'], price: 'Free / Premium',
  },
  {
    name: 'Century Tech',
    category: 'Adaptive Learning',
    desc: 'AI-powered adaptive learning for UK curriculum. Used in 1,500+ UK schools, KS2–GCSE.',
    score: 9.1, scoreColor: '#8B5CF6', progressClass: 'bg-purple-400',
    pros: ['UK curriculum aligned', 'Evidence-based pedagogy', 'Teacher dashboard'],
    cons: ['Cost per pupil', 'Limited sixth form content'],
    badgeVariants: ['green', 'purple'], badgeLabels: ['UK-Built', 'KS2–GCSE'],
    icon: '🧠', iconBg: '#F5F3FF', pastelBg: 'bg-pastel-purple/30', accent: '#8B5CF6',
    audiences: ['teachers', 'students'], price: 'Paid',
  },
  {
    name: 'Satchel One',
    category: 'Homework & Attendance',
    desc: 'UK-built homework, timetable & attendance with AI-powered insights for form tutors.',
    score: 8.8, scoreColor: '#3B82F6', progressClass: 'bg-blue-400',
    pros: ['UK-hosted, UK company', 'Integrates with SIMS & Arbor', 'SEND-friendly'],
    cons: ['Pricing opaque', 'IT admin for setup'],
    badgeVariants: ['green', 'blue'], badgeLabels: ['UK-Built', 'MIS Integration'],
    icon: '📅', iconBg: '#EFF6FF', pastelBg: 'bg-pastel-blue/30', accent: '#3B82F6',
    audiences: ['teachers', 'parents'], price: 'Paid',
  },
  {
    name: 'Texthelp Read&Write',
    category: 'Accessibility / SEND',
    desc: 'Gold standard for dyslexia support. Text-to-speech, word prediction, UK-headquartered.',
    score: 9.3, scoreColor: '#F97316', progressClass: 'bg-orange-400',
    pros: ['UK-headquartered', 'Gold standard for SEND', 'Works across all subjects'],
    cons: ['Annual licence cost', 'Some features Chrome-only'],
    badgeVariants: ['orange', 'purple'], badgeLabels: ['SEND', 'All Ages'],
    icon: '♿', iconBg: '#FFF7ED', pastelBg: 'bg-pastel-yellow/40', accent: '#F97316',
    audiences: ['teachers', 'students', 'parents'], price: 'Paid',
  },
  {
    name: 'Bark for Schools',
    category: 'Parental Monitoring',
    desc: 'AI content monitoring alerting staff and parents to cyberbullying and inappropriate content.',
    score: 9.0, scoreColor: '#22C55E', progressClass: 'bg-green-400',
    pros: ['Proactive safety alerts', 'Parent & staff dashboards', 'Cross-platform'],
    cons: ['US-based data hosting', 'Requires device management'],
    badgeVariants: ['green', 'blue'], badgeLabels: ['Safety', 'Ages 5–18'],
    icon: '🐕', iconBg: '#F0FDF4', pastelBg: 'bg-pastel-teal/30', accent: '#22C55E',
    audiences: ['parents', 'teachers'], price: 'Paid',
  },
  {
    name: 'Otter.ai',
    category: 'Transcription',
    desc: 'Real-time AI transcription for lessons and meetings. Great for hearing-impaired students.',
    score: 8.6, scoreColor: '#3B82F6', progressClass: 'bg-blue-400',
    pros: ['Free tier available', 'Real-time captions', 'Search transcripts'],
    cons: ['US-hosted data', 'Free tier limited minutes'],
    badgeVariants: ['green', 'purple'], badgeLabels: ['Free Tier', 'Accessibility'],
    icon: '🎙️', iconBg: '#EFF6FF', pastelBg: 'bg-pastel-blue/20', accent: '#3B82F6',
    audiences: ['teachers', 'students'], price: 'Free / Pro',
  },
  {
    name: 'Microsoft Immersive Reader',
    category: 'Accessibility',
    desc: 'Text-to-speech, focus mode, picture dictionary. Free via Office 365 in UK schools.',
    score: 9.2, scoreColor: '#3B82F6', progressClass: 'bg-blue-400',
    pros: ['Completely free via O365', 'Works in Word, Teams, OneNote', 'Excellent dyslexia support'],
    cons: ['Requires Office 365', 'Limited to Microsoft apps'],
    badgeVariants: ['green', 'blue'], badgeLabels: ['Free', 'Built-in O365'],
    icon: '📖', iconBg: '#EFF6FF', pastelBg: 'bg-pastel-blue/20', accent: '#3B82F6',
    audiences: ['teachers', 'students', 'parents'], price: 'Free (O365)',
  },
];

// ── Affiliate tag ──────────────────────────────────────────────────────────────
const AffiliateTag: FC = () => (
  <Badge variant="amber" className="text-[9px] px-2 py-0.5 rounded-full">
    🔗 Affiliate link — no extra cost to you
  </Badge>
);

// ── Tool card ──────────────────────────────────────────────────────────────────
const ToolCard: FC<{ tool: Tool }> = ({ tool }) => (
  <motion.div
    layout
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    whileHover={{ y: -5 }}
  >
    <Card className={`h-full rounded-3xl border-0 p-0 overflow-hidden`} aria-label={tool.name}>
      {/* Pastel top accent strip */}
      <div className={`h-1.5 w-full ${tool.pastelBg} border-b border-gray-100`}
           style={{ backgroundColor: `${tool.accent}22` }} />
      <CardContent className="p-5 flex flex-col gap-4 h-full">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: tool.iconBg }}
              whileHover={{ scale: 1.1, rotate: 6 }}
            >
              {tool.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-ink tracking-tight">{tool.name}</h3>
                {tool.featured && (
                  <Badge variant="amber" className="text-[9px] px-1.5 py-0.5 rounded-full">★ Pick</Badge>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{tool.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-lg font-black" style={{ color: tool.scoreColor }}>★ {tool.score}</span>
            <span className="text-[9px] text-gray-400 font-medium">{tool.price}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed flex-1">{tool.desc}</p>

        {/* shadcn Progress for safety score */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Safety Score</span>
            <span className="text-[11px] font-black" style={{ color: tool.scoreColor }}>{tool.score}/10</span>
          </div>
          <Progress value={tool.score * 10} indicatorClassName={tool.progressClass} />
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-2 gap-2">
          <ul className="space-y-1">
            {tool.pros.map((p) => (
              <li key={p} className="text-[10px] text-gray-600 flex gap-1.5 items-start">
                <span className="text-green-500 font-black flex-shrink-0">+</span>{p}
              </li>
            ))}
          </ul>
          <ul className="space-y-1">
            {tool.cons.map((c) => (
              <li key={c} className="text-[10px] text-gray-500 flex gap-1.5 items-start">
                <span className="text-red-400 font-black flex-shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {tool.badgeLabels.map((label, i) => (
            <Badge key={label} variant={tool.badgeVariants[i]} className="rounded-full">{label}</Badge>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <AffiliateTag />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" size="sm" className="w-full rounded-xl border-2"
              style={{ borderColor: tool.accent, color: tool.accent, backgroundColor: `${tool.accent}0D` } as React.CSSProperties}>
              View Tool →
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ── Filtered grid ──────────────────────────────────────────────────────────────
const ToolGrid: FC<{ audience: Audience }> = ({ audience }) => {
  const filtered = TOOLS.filter((t) => audience === 'all' || t.audiences.includes(audience));
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <AnimatePresence mode="popLayout">
        {filtered.map((tool) => <ToolCard key={tool.name} tool={tool} />)}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const ToolsGrid: FC = () => (
  <section id="tools" aria-labelledby="tools-heading" className="bg-[#FAFAFA] py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* Header */}
      <motion.div className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
      >
        {/* Pastel blue accent block */}
        <div className="inline-block bg-pastel-blue/40 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
          AI Tools Directory
        </div>
        <h2 id="tools-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          The Complete EdTech<br />
          <span className="text-brand-blue">AI Directory</span>
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Safety-rated, GDPR-checked, and UK curriculum-aligned. Every tool independently tested by real educators.
        </p>
      </motion.div>

      {/* shadcn Tabs for audience filter */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-2">
          <TabsList className="bg-white border border-gray-200 shadow-card">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all"><ToolGrid audience="all" /></TabsContent>
        <TabsContent value="teachers"><ToolGrid audience="teachers" /></TabsContent>
        <TabsContent value="parents"><ToolGrid audience="parents" /></TabsContent>
        <TabsContent value="students"><ToolGrid audience="students" /></TabsContent>
      </Tabs>

      {/* CTA */}
      <motion.div className="text-center mt-10"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.3 }}
      >
        <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Button variant="default" size="lg" className="rounded-2xl shadow-card-blue">
            View All 180+ Tools →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default ToolsGrid;
