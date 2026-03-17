/**
 * NewsletterSection.tsx — Role-segmented newsletter signup
 */

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ROLES = [
  'Leadership / SLT', 'Teaching & Curriculum', 'SEND / Inclusion',
  'Safeguarding & Pastoral', 'Administration', 'Finance', 'HR', 'IT',
  'Communications', 'Parent', 'Student',
] as const;

const NewsletterSection: FC = () => {
  const [role, setRole]       = useState('');
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { setError('Please select your role.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.'); return;
    }
    setError('');
    setSubmitted(true);
    // TODO: POST { role, email } to your email platform
  };

  return (
    <section id="newsletter" aria-labelledby="newsletter-heading" className="bg-ink py-20 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-white/10 text-white text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full border border-white/20">
            Stay Up to Date
          </span>
          <h2 id="newsletter-heading" className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Safe AI Tools for Schools,<br />
            <span className="text-sky-teal">Delivered to Your Inbox</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            New reviews, safety scores, free prompts and training resources — tailored to your role.
            No spam. Unsubscribe any time.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Role selector */}
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value); setError(''); }}
                aria-label="Your role"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/40
                           transition-all appearance-none"
              >
                <option value="" className="text-gray-900 bg-white">Select your role…</option>
                {ROLES.map((r) => (
                  <option key={r} value={r} className="text-gray-900 bg-white">{r}</option>
                ))}
              </select>

              {/* Email + submit row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="your@school.co.uk"
                  aria-label="Email address"
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white text-sm
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50
                             focus:border-sky-400/40 transition-all"
                />
                <Button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-7 rounded-2xl flex-shrink-0"
                >
                  Subscribe →
                </Button>
              </div>

              {error && (
                <p role="alert" className="text-red-400 text-xs text-left">{error}</p>
              )}

              <p className="text-[11px] text-gray-500">
                GDPR compliant · Double opt-in · Free forever · Unsubscribe any time
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3 py-6"
            >
              <div className="text-5xl">✅</div>
              <p className="text-white font-bold text-lg">You're subscribed!</p>
              <p className="text-gray-400 text-sm">
                Check <strong className="text-white">{email}</strong> — your free{' '}
                <span className="text-sky-teal font-semibold">{role}</span> prompt pack is on its way.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
