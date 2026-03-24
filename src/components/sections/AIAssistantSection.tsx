/**
 * AIAssistantSection.tsx — KEY DIFFERENTIATOR
 * Prominent gradient card with input box + example prompts
 * "Guided AI assistance designed for responsible use"
 */

import { FC, useState } from 'react';
import { motion } from 'framer-motion';

const EXAMPLE_PROMPTS = [
  'Create a lesson plan about climate change',
  'Write a parent newsletter about AI in school',
  'Suggest 5 ways AI can save teachers time',
  'Explain AI safety to a parent',
  'Draft an AI usage policy for our school',
];

const AIAssistantSection: FC<{ onGetSupport?: (prompt: string) => void }> = ({ onGetSupport }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (onGetSupport) onGetSupport(prompt);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <section id="assistant" aria-labelledby="assistant-heading" className="py-20 sm:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 50%, #0f766e 100%)' }}>

      {/* Background glow orbs */}
      <motion.div aria-hidden="true" className="absolute pointer-events-none rounded-full"
        style={{ width: 500, height: 500, top: '-15%', right: '-8%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)' }}
        animate={{ y: [0,-25,0], x: [0,15,0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div aria-hidden="true" className="absolute pointer-events-none rounded-full"
        style={{ width: 400, height: 400, bottom: '-10%', left: '-6%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)' }}
        animate={{ y: [0,20,0], x: [0,-15,0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

        {/* Section label */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" aria-hidden="true" />
            AI Assistant — Core Feature
          </span>
          <h2 id="assistant-heading" className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Get AI Support — Instantly
          </h2>
          <p className="mt-3 text-white/60 text-base max-w-lg mx-auto">
            Guided AI assistance designed for responsible use in education
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          }}
        >
          {/* Input */}
          <div className="relative mb-5">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7" cy="7" r="5"/><path d="M12 12l2.5 2.5"/>
              </svg>
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Create a lesson plan about climate change…"
              aria-label="AI prompt input"
              className="w-full pl-10 pr-4 py-4 rounded-xl text-sm sm:text-base font-medium
                         bg-white/10 border border-white/20 text-white placeholder-white/35
                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                         transition-all"
            />
          </div>

          {/* Example prompts */}
          <div className="mb-6">
            <p className="text-white/45 text-xs font-semibold mb-3 uppercase tracking-wide">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example) => (
                <motion.button
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/20
                             hover:bg-white/10 hover:text-white hover:border-white/35 transition-all"
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base
                         bg-white text-[#1d4ed8] hover:bg-gray-50 transition-all
                         shadow-lg shadow-black/20 flex items-center gap-2
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>✦</span>
              Get AI Support
            </motion.button>
            <p className="text-white/45 text-xs leading-relaxed">
              Guided AI assistance designed for responsible use.<br className="hidden sm:block" />
              Safe, thoughtful, and education-focused.
            </p>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            { icon: '🛡️', label: 'Designed for Safe Use' },
            { icon: '🎓', label: 'Education-Focused' },
            { icon: '✅', label: 'Responsible AI' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-white/55 text-xs font-medium">
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AIAssistantSection;
