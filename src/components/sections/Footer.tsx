/**
 * Footer.tsx — getpromptly.co.uk
 * shadcn Button · dark bg · full affiliate disclosure · breathing mini-orb
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

type SectionId = 'home' | 'tools' | 'about' | 'prompts' | 'blog';

interface FooterProps {
  onNav: (id: SectionId) => void;
}

const NAV_COLS: { heading: string; links: { label: string; id: SectionId }[] }[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home',              id: 'home' },
      { label: 'AI Tools',          id: 'tools' },
      { label: 'AI Prompts',        id: 'prompts' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Blog',              id: 'blog' },
      { label: 'About Us',          id: 'about' },
    ],
  },
];

const Footer: FC<FooterProps> = ({ onNav }) => (
  <footer className="bg-ink border-t border-white/10" aria-label="Site footer">

    {/* Main body */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

      {/* Brand column */}
      <div className="lg:col-span-2 space-y-5">
        <div className="flex items-center gap-3">
          <motion.div
            aria-hidden="true"
            className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple
                       flex items-center justify-center overflow-hidden flex-shrink-0"
            animate={{ boxShadow: [
              '0 0 10px rgba(59,130,246,0.35)',
              '0 0 22px rgba(59,130,246,0.65)',
              '0 0 10px rgba(59,130,246,0.35)',
            ]}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.15) 80%, transparent 90%)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="relative z-10" aria-hidden="true">
              <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5" strokeOpacity=".9"/>
              <circle cx="8" cy="8" r="2" fill="white"/>
            </svg>
          </motion.div>
          <div>
            <span className="font-black text-white text-sm block leading-tight">Promptly</span>
            <span className="text-[10px] text-gray-500">getpromptly.co.uk</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
          The UK's trusted resource for safe EdTech AI. Independent reviews, safety guides,
          and a growing community of educators and parents.
        </p>

        {/* Newsletter */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-300">Stay up to date</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@school.co.uk"
              aria-label="Email address for newsletter"
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10
                         text-xs text-white placeholder-gray-600
                         focus:outline-none focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/30
                         transition-colors"
            />
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button size="sm" className="rounded-lg flex-shrink-0 bg-[#D97706] hover:bg-[#B45309] text-white">
                Subscribe
              </Button>
            </motion.div>
          </div>
          <p className="text-[10px] text-gray-600">GDPR-compliant double opt-in. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Nav columns */}
      {NAV_COLS.map((col) => (
        <div key={col.heading} className="space-y-4">
          <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{col.heading}</h3>
          <ul className="space-y-2.5">
            {col.links.map((link) => (
              <li key={link.id}>
                <motion.button
                  onClick={() => onNav(link.id)}
                  className="text-xs text-gray-400 hover:text-white transition-colors
                             focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded"
                  whileHover={{ x: 3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {link.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Affiliate disclosure */}
    <div className="border-t border-white/5 px-4 sm:px-6 py-5">
      <div className="max-w-6xl mx-auto space-y-2">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          <strong className="text-gray-500">Affiliate Disclosure:</strong>{' '}
          Some links on this website are affiliate links. We may earn a small commission if you click through
          and make a purchase — at no extra cost to you. Affiliate income helps fund our independent editorial work.
          Our safety ratings and tool recommendations are never influenced by commercial relationships.{' '}
          <button className="text-brand-blue hover:underline">Read our full Affiliate Disclosure Policy</button>.
        </p>
        <p className="text-[10px] text-gray-700 leading-relaxed">
          GDPR advice on this site is informational only and does not constitute legal advice. Schools should
          consult their Data Protection Officer for guidance specific to their circumstances.
        </p>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/5 px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] text-gray-600">
          © {new Date().getFullYear()}{' '}
          <motion.span
            className="text-teal-400 font-semibold"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            GetPromptly.co.uk
          </motion.span>
          {' '}· All affiliate links are clearly disclosed · GDPR compliant
        </p>
        <div className="flex items-center gap-4">
          {['Privacy Policy', 'Cookie Policy', 'Affiliate Disclosure', 'Contact'].map((item) => (
            <motion.button
              key={item}
              className="text-[10px] text-gray-600 hover:text-gray-300 transition-colors
                         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded"
              whileHover={{ y: -1 }}
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
