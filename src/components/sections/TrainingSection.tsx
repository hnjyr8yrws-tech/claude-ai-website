/**
 * TrainingSection.tsx — Free AI Training & Free Prompts
 * shadcn Tabs: Tab 1 = Free UK Training | Tab 2 = Paid Premium Training
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ── Free Training Data ─────────────────────────────────────────────────────────

const FREE_ITEMS = [
  {
    icon: '📧',
    title: '5-Day AI Starter Email Course',
    desc: 'One practical email per day covering: what AI can do, which tools to try, safety basics, your first prompt, and getting sign-off from your school.',
    badge: 'Free forever', badgeColor: '#22C55E',
    cta: 'Start Free Course →', href: '#',
  },
  {
    icon: '📦',
    title: '50 Role-Specific Prompt Packs',
    desc: 'Download a pack tailored to your role — Teaching, SEND, Finance, HR, Admin, Leadership, IT, Comms, Parents or Students. Tested in UK schools.',
    badge: 'Instant download', badgeColor: '#3B82F6',
    cta: 'Download My Pack →', href: '#',
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
    desc: "The government's official AI in education guidance — we've summarised the key points and mapped them to practical actions for school leaders.",
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

// ── Paid Training Data ─────────────────────────────────────────────────────────

const PAID_ITEMS = [
  {
    icon: '🏫',
    provider: 'Ambition Institute',
    title: 'AI for School Leaders',
    desc: 'Rigorous leadership development programme covering AI strategy, change management, and ethical implementation across multi-academy trusts.',
    price: 'From £295',
    badge: 'NPQ aligned', badgeColor: '#8B5CF6',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
  {
    icon: '🎓',
    provider: 'Teach First',
    title: 'AI & Pedagogy for Teachers',
    desc: 'Online programme for early-career and experienced teachers exploring evidence-based AI integration in classroom practice and curriculum design.',
    price: 'From £199',
    badge: 'CPD points', badgeColor: '#3B82F6',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
  {
    icon: '📰',
    provider: 'TES Institute',
    title: 'AI Skills for Education Professionals',
    desc: 'Self-paced online course covering AI tools for teaching, admin, and leadership. Flexible learning with CPD certificate on completion.',
    price: 'From £99',
    badge: 'Self-paced', badgeColor: '#D97706',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
  {
    icon: '🔧',
    provider: 'LETTA (EdTech)',
    title: 'Hands-On AI for School IT Teams',
    desc: 'Technical training for IT managers covering AI procurement, data governance, Microsoft Copilot deployment, and Google AI Workspace rollout.',
    price: 'From £350',
    badge: 'IT focused', badgeColor: '#22C55E',
    cta: 'Enrol Now (Affiliate) →', href: '#',
  },
] as const;

// ── Prompt Role Selector ───────────────────────────────────────────────────────

const PROMPT_ROLES = [
  'Teaching & Curriculum', 'SEND / Inclusion', 'Leadership & SLT',
  'Administration', 'Finance', 'HR', 'IT', 'Communications', 'Safeguarding',
  'Parents', 'Students',
] as const;

const PromptRolePicker: FC = () => {
  const [selected, setSelected] = useState<string>('');
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
                          ? 'bg-brand-blue text-white border-brand-blue shadow-card-blue'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue/40 hover:text-brand-blue'
                        }`}
          >
            {r}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && !downloaded && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Button
              className="w-full sm:w-auto"
              onClick={() => setDownloaded(true)}
            >
              Download 50 {selected} Prompts →
            </Button>
          </motion.div>
        )}
        {downloaded && (
          <motion.p
            key="thanks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-green"
          >
            ✅ Your {selected} prompt pack is on its way — check your inbox!
          </motion.p>
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
          Start free with government-backed resources and our 50-prompt starter packs, or enrol in premium courses.
        </p>
      </motion.div>

      <Tabs defaultValue="free">
        <div className="flex justify-center mb-10">
          <TabsList className="bg-gray-100/80">
            <TabsTrigger value="free">🆓 Free UK Trusted Training</TabsTrigger>
            <TabsTrigger value="paid">💳 Paid Premium Training</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Free */}
        <TabsContent value="free">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Role-specific prompt picker */}
            <PromptRolePicker />

            {/* Free training cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FREE_ITEMS.map((item) => (
                <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                  <Card className="h-full shadow-none border-gray-100">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                      <div>
                        <Badge
                          variant="outline"
                          className="text-[10px] mb-2"
                          style={{ color: item.badgeColor, borderColor: `${item.badgeColor}30`, backgroundColor: `${item.badgeColor}10` }}
                        >
                          {item.badge}
                        </Badge>
                        <h3 className="font-black text-sm text-ink leading-snug">{item.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed flex-1">{item.desc}</p>
                      <Button size="sm" variant="outline" asChild className="text-xs font-bold border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
                        <a href={item.href}>{item.cta}</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Tab 2: Paid */}
        <TabsContent value="paid">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {PAID_ITEMS.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                <Card className="h-full shadow-none border-gray-100">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
                      <div>
                        <p className="text-[11px] text-ink-light font-semibold mb-0.5">{item.provider}</p>
                        <h3 className="font-black text-sm text-ink leading-snug">{item.title}</h3>
                        <Badge
                          variant="outline"
                          className="text-[10px] mt-1"
                          style={{ color: item.badgeColor, borderColor: `${item.badgeColor}30`, backgroundColor: `${item.badgeColor}10` }}
                        >
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
          </motion.div>
          <p className="text-center text-[11px] text-gray-400 mt-6">
            Affiliate disclosure: Enrol Now links earn us a commission at no extra cost to you.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  </section>
);

export default TrainingSection;
