/**
 * SafetyScore.tsx — Donna's 1–10 Safety Scale
 * Explanation of criteria + "Check any tool" email-capture form
 */

import { FC, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CRITERIA = [
  { icon: '📋', label: 'GDPR Compliance',     desc: "Does the tool store UK student data within EEA / adequacy agreements? Are DPAs available?",            score: '0–2 pts' },
  { icon: '🧒', label: 'Age-Appropriateness', desc: 'Is the content model safe for the intended age group? Does it filter harmful content reliably?',         score: '0–2 pts' },
  { icon: '🔒', label: 'Data Storage',        desc: 'Where is data stored? Is it used to train AI models? Can schools delete data on request?',             score: '0–3 pts' },
  { icon: '🎛️', label: 'Teacher Control',     desc: 'Can staff manage student access, set guardrails, and disable features? Is there an admin dashboard?',  score: '0–3 pts' },
] as const;

const SCORE_BANDS = [
  { range: '9–10', label: 'Excellent',   color: '#22C55E', bg: 'bg-green-50',  border: 'border-green-200' },
  { range: '7–8',  label: 'Good',        color: '#F59E0B', bg: 'bg-amber-50',  border: 'border-amber-200' },
  { range: '5–6',  label: 'Caution',     color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-200' },
  { range: '1–4',  label: 'Avoid',       color: '#EF4444', bg: 'bg-red-50',    border: 'border-red-200' },
] as const;

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const SafetyScore: FC = () => {
  const [toolName, setToolName] = useState('');
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !email.trim()) return;
    setSubmitted(true);
    // TODO: POST { toolName, email } to your review request handler
  };

  return (
    <section id="safety" aria-labelledby="safety-heading" className="bg-[#F1F5F9] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-green-50 text-brand-green text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-4 border border-green-100">
            Safety Score
          </span>
          <h2 id="safety-heading" className="text-4xl sm:text-5xl font-black tracking-tight text-ink leading-tight">
            Donna's Safety Score<br />
            <span className="text-brand-green">How We Rate Every Tool</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm max-w-xl mx-auto">
            Every AI tool on Promptly is independently assessed by Donna against four criteria.
            No tool pays for a higher score — ever.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left: criteria + bands */}
          <div className="space-y-8">

            {/* Score bands */}
            <div>
              <h3 className="text-sm font-black text-ink mb-4 uppercase tracking-wide">Score Bands</h3>
              <div className="grid grid-cols-2 gap-3">
                {SCORE_BANDS.map((b) => (
                  <div key={b.range} className={`rounded-xl p-4 border ${b.bg} ${b.border} flex items-center gap-3`}>
                    <div className="text-2xl font-black leading-none" style={{ color: b.color }}>{b.range}</div>
                    <div className="text-sm font-bold text-ink">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Criteria breakdown */}
            <div>
              <h3 className="text-sm font-black text-ink mb-4 uppercase tracking-wide">What We Check</h3>
              <motion.div
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ staggerChildren: 0.07 }}
              >
                {CRITERIA.map((c) => (
                  <motion.div key={c.label} variants={cardVariants}>
                    <Card className="shadow-none border-gray-100">
                      <CardContent className="p-4 flex items-start gap-4">
                        <span className="text-xl flex-shrink-0" aria-hidden="true">{c.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-sm font-black text-ink">{c.label}</h4>
                            <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">
                              {c.score}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{c.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right: Check a tool form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="shadow-card border-gray-100">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  {/* Donna avatar placeholder */}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-black text-brand-blue flex-shrink-0">
                    D
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-ink">Request a Safety Review</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Found a tool not on our list? Donna will review it and publish a score within 7 days.
                    </p>
                  </div>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="tool-name" className="block text-sm font-semibold text-ink mb-2">
                        Tool name / URL
                      </label>
                      <input
                        id="tool-name"
                        type="text"
                        value={toolName}
                        onChange={(e) => setToolName(e.target.value)}
                        placeholder="e.g. MagicSchool or https://magicschool.ai"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-ink
                                   focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/40
                                   placeholder-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="safety-email" className="block text-sm font-semibold text-ink mb-2">
                        Your email (we'll notify you when it's ready)
                      </label>
                      <input
                        id="safety-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@school.co.uk"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-ink
                                   focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue/40
                                   placeholder-gray-400 transition-all"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Request Safety Review →
                    </Button>
                    <p className="text-[11px] text-gray-400 text-center">
                      GDPR compliant · No spam · Unsubscribe any time
                    </p>
                  </form>
                ) : (
                  <div className="text-center space-y-3 py-4">
                    <div className="text-4xl">✅</div>
                    <p className="font-bold text-ink">Request received!</p>
                    <p className="text-sm text-gray-500">
                      Donna will review <strong>{toolName}</strong> and email you at <strong>{email}</strong> within 7 days.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SafetyScore;
