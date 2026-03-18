/**
 * TrainingSection.tsx — 4-tab training hub
 * Overview · Learning Paths · Resources · Take Quiz
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ── Data ───────────────────────────────────────────────────────────────────────

const FREE_PATHS = [
  {
    icon: '📧',
    title: '5-Day AI Starter Email Course',
    desc: 'One practical email per day covering: what AI can do, which tools to try, safety basics, your first prompt, and getting sign-off from your school.',
    badge: 'Free forever', badgeColor: '#22C55E',
    cta: 'Start Free Course →', href: '#',
  },
  {
    icon: '🎓',
    title: 'CPD Certificates',
    desc: "Complete any of our free learning paths and download a CPD certificate to add to your professional portfolio — recognised by most UK teaching unions.",
    badge: 'CPD accredited', badgeColor: '#8B5CF6',
    cta: 'View CPD Paths →', href: '#',
  },
  {
    icon: '🏛️',
    title: 'DfE AI in Education Guidance',
    desc: "The government's official AI in education guidance — summarised and mapped to practical actions for school leaders.",
    badge: 'Gov guidance', badgeColor: '#D97706',
    cta: 'Read Summary →', href: '#',
  },
  {
    icon: '🔗',
    title: 'Oak National Academy AI Lessons',
    desc: 'Free, curriculum-mapped lessons from Oak about AI literacy for students — suitable for KS3 and KS4. Ready to use with zero prep.',
    badge: 'Free · No login', badgeColor: '#14B8A6',
    cta: 'View Lessons →', href: '#',
  },
] as const;

const PAID_ITEMS = [
  {
    icon: '🏫', provider: 'Ambition Institute',
    title: 'AI for School Leaders',
    desc: 'Rigorous leadership development programme covering AI strategy, change management, and ethical implementation across multi-academy trusts.',
    price: 'From £295', badge: 'NPQ aligned', badgeColor: '#8B5CF6',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
  {
    icon: '🎓', provider: 'Teach First',
    title: 'AI & Pedagogy for Teachers',
    desc: 'Online programme for early-career and experienced teachers exploring evidence-based AI integration in classroom practice and curriculum design.',
    price: 'From £199', badge: 'CPD points', badgeColor: '#3B82F6',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
  {
    icon: '📰', provider: 'TES Institute',
    title: 'AI Skills for Education Professionals',
    desc: 'Self-paced online course covering AI tools for teaching, admin, and leadership. Flexible learning with CPD certificate on completion.',
    price: 'From £99', badge: 'Self-paced', badgeColor: '#D97706',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
  {
    icon: '🔧', provider: 'LETTA (EdTech)',
    title: 'Hands-On AI for School IT Teams',
    desc: 'Technical training for IT managers covering AI procurement, data governance, Microsoft Copilot deployment, and Google AI Workspace rollout.',
    price: 'From £350', badge: 'IT focused', badgeColor: '#22C55E',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
] as const;

const PROMPT_ROLES = [
  'Teaching & Curriculum', 'SEND / Inclusion', 'Leadership & SLT',
  'Administration', 'Finance', 'HR', 'IT', 'Communications', 'Safeguarding',
  'Parents', 'Students',
] as const;

const OVERVIEW_STATS = [
  { value: '50+', label: 'Free Prompts per Role', color: '#3B82F6' },
  { value: '5',   label: 'Learning Paths',        color: '#8B5CF6' },
  { value: 'CPD', label: 'Accredited Certificates', color: '#22C55E' },
  { value: '4+',  label: 'Premium Courses',        color: '#D97706' },
] as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

const PromptRolePicker: FC = () => {
  const [selected, setSelected] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 space-y-5">
      <h3 className="font-black text-ink text-base">📦 Download Your Free Prompt Pack</h3>
      <p className="text-sm text-gray-600">Select your role to get 50 prompts tailored to your work.</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select your role">
        {PROMPT_ROLES.map((r) => (
          <button
            key={r}
            onClick={() => { setSelected(r); setDownloaded(false); }}
            aria-pressed={selected === r}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue
                        ${selected === r
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue/40 hover:text-brand-blue'
                        }`}
          >
            {r}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selected && !downloaded && (
          <motion.div key="cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Button className="w-full sm:w-auto" onClick={() => setDownloaded(true)}>
              Download 50 {selected} Prompts →
            </Button>
          </motion.div>
        )}
        {downloaded && (
          <motion.p key="thanks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-green">
            ✅ Your {selected} prompt pack is on its way — check your inbox!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Quiz tab ───────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    q: 'What is your role?',
    options: ['Teacher', 'School Leader / SLT', 'SENCO', 'Admin / Finance', 'IT Manager', 'Parent', 'Student'],
  },
  {
    q: 'What is your biggest challenge with AI right now?',
    options: ['I don\'t know where to start', 'Concerns about safety & GDPR', 'Getting leadership buy-in', 'Finding time to learn', 'Evaluating which tools to use'],
  },
  {
    q: 'What would help you most?',
    options: ['A free starter guide', 'A structured learning path', 'Tool recommendations for my role', 'A safety checklist', 'CPD certificate'],
  },
] as const;

const RESULTS: Record<string, { title: string; desc: string; cta: string }> = {
  default: {
    title: 'Your Personalised Starting Point',
    desc: 'Based on your answers, we recommend starting with our free 5-Day AI Starter Email Course — then downloading your role-specific prompt pack.',
    cta: 'Start Free Course →',
  },
};

const QuizTab: FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const choose = (option: string) => {
    const next = [...answers, option];
    setAnswers(next);
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setDone(false); };

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card className="shadow-none border-gray-100">
              <CardContent className="p-8 space-y-6">
                <div className="flex gap-1 mb-2">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-blue' : 'bg-gray-100'}`} />
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                  Question {step + 1} of {QUIZ_QUESTIONS.length}
                </p>
                <h3 className="text-lg font-black text-ink">{QUIZ_QUESTIONS[step].q}</h3>
                <div className="space-y-2">
                  {QUIZ_QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => choose(opt)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-ink
                                 hover:border-brand-blue hover:bg-blue-50 transition-all font-medium"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-none border-gray-100">
              <CardContent className="p-8 space-y-5 text-center">
                <div className="text-4xl">🎯</div>
                <h3 className="text-xl font-black text-ink">{RESULTS.default.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{RESULTS.default.desc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button asChild><a href="#">{RESULTS.default.cta}</a></Button>
                  <Button variant="outline" onClick={reset}>Retake Quiz</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────────

const TrainingSection: FC = () => (
  <section id="training" aria-labelledby="training-heading" className="bg-white py-20 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block bg-teal-50 text-[#0F766E] text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-teal-100">
          Training &amp; Prompts
        </span>
        <h2 id="training-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
          Free AI Training<br />
          <span className="text-[#14B8A6]">&amp; Free Prompts</span>
        </h2>
        <p className="mt-4 text-gray-600 text-sm max-w-lg mx-auto">
          Start free with government-backed resources and role-specific prompt packs, or enrol in premium courses.
        </p>
      </motion.div>

      <div className="container mx-auto">
        <Tabs defaultValue="overview" className="w-full">

          <TabsList className="grid w-full grid-cols-4 mb-10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning Paths</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="quiz">Take Quiz</TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview">
            <motion.div className="space-y-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {OVERVIEW_STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-gray-100 p-6 text-center">
                    <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
              <PromptRolePicker />
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 grid sm:grid-cols-3 gap-6 text-center">
                {[
                  { icon: '🆓', label: 'Free Learning Paths', desc: 'Government-backed, CPD accredited, no credit card needed.' },
                  { icon: '📦', label: 'Role-Specific Prompts', desc: '50 tested prompts for every school role — download in seconds.' },
                  { icon: '🏆', label: 'Premium Courses', desc: 'Affiliate-linked courses from Ambition, Teach First, TES & more.' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="text-3xl">{item.icon}</div>
                    <h3 className="font-black text-sm text-ink">{item.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* ── Learning Paths ── */}
          <TabsContent value="learning">
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {FREE_PATHS.map((item) => (
                <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                  <Card className="h-full shadow-none border-gray-100">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                      <div>
                        <Badge variant="outline" className="text-[10px] mb-2"
                          style={{ color: item.badgeColor, borderColor: `${item.badgeColor}30`, backgroundColor: `${item.badgeColor}10` }}>
                          {item.badge}
                        </Badge>
                        <h3 className="font-black text-sm text-ink leading-snug">{item.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed flex-1">{item.desc}</p>
                      <Button size="sm" variant="outline" asChild
                        className="text-xs font-bold border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
                        <a href={item.href}>{item.cta}</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* ── Resources ── */}
          <TabsContent value="resources">
            <motion.div className="space-y-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PAID_ITEMS.map((item) => (
                  <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                    <Card className="h-full shadow-none border-gray-100">
                      <CardContent className="p-6 flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                          <span className="text-3xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                          <div>
                            <p className="text-[11px] text-gray-400 font-semibold mb-0.5">{item.provider}</p>
                            <h3 className="font-black text-sm text-ink leading-snug">{item.title}</h3>
                            <Badge variant="outline" className="text-[10px] mt-1"
                              style={{ color: item.badgeColor, borderColor: `${item.badgeColor}30`, backgroundColor: `${item.badgeColor}10` }}>
                              {item.badge}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed flex-1">{item.desc}</p>
                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <span className="text-sm font-black text-ink">{item.price}</span>
                          <Button size="sm" asChild className="text-xs font-bold">
                            <a href={item.href} target="_blank" rel="noopener noreferrer sponsored">{item.cta}</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-[11px] text-gray-400">
                Affiliate disclosure: Enrol Now links earn us a small commission at no extra cost to you.
              </p>
            </motion.div>
          </TabsContent>

          {/* ── Quiz ── */}
          <TabsContent value="quiz">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="text-center mb-8">
                <h3 className="text-xl font-black text-ink mb-2">Find Your Starting Point</h3>
                <p className="text-sm text-gray-500">3 quick questions — we'll point you to the right tools and training.</p>
              </div>
              <QuizTab />
            </motion.div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  </section>
);

export default TrainingSection;
