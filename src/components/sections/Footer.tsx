/**
 * Footer.tsx — GetPromptly.co.uk
 * Nav links · Affiliate disclosure · GDPR banner · © line
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FooterProps {
  onNav: (id: string) => void;
}

const NAV_COLS: { heading: string; links: { label: string; id: string }[] }[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home',             id: 'hero' },
      { label: 'AI Tools',         id: 'tools' },
      { label: 'AI Assistant',     id: 'assistant' },
      { label: 'Categories',       id: 'categories' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Free Guides',      id: 'guides' },
      { label: 'Trusted Tools',    id: 'trusted' },
      { label: 'Blog',             id: 'blog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',            id: 'about' },
    ],
  },
];

const Footer: FC<FooterProps> = ({ onNav }) => (
  <footer className="bg-ink border-t border-white/10" aria-label="Site footer">

    {/* Main body */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

      {/* Brand column */}
      <div className="lg:col-span-2 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-[#14B8A6] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="5" stroke="white" strokeWidth="1.5" strokeOpacity=".9"/>
              <circle cx="8" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <div>
            <span className="font-black text-white text-sm block leading-tight">GetPromptly</span>
            <span className="text-[10px] text-gray-500">getpromptly.co.uk</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
          The UK's trusted independent resource for safe AI in education. Reviews, prompts, safety scores and
          training for every role across UK schools, colleges and universities.
        </p>

        {/* Mini newsletter */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-300">Stay up to date</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@school.co.uk"
              aria-label="Email for footer newsletter"
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white
                         placeholder-gray-600 focus:outline-none focus:border-brand-blue/60 focus:ring-1
                         focus:ring-brand-blue/30 transition-colors"
            />
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button size="sm" className="rounded-lg flex-shrink-0 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs">
                Subscribe
              </Button>
            </motion.div>
          </div>
          <p className="text-[10px] text-gray-600">GDPR-compliant double opt-in. Unsubscribe any time.</p>
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

    {/* Affiliate & GDPR disclosure */}
    <div className="border-t border-white/5 px-4 sm:px-6 py-5">
      <div className="max-w-7xl mx-auto space-y-2">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          <strong className="text-gray-500">Affiliate Disclosure:</strong>{' '}
          Some links on this website are affiliate links. We may earn a small commission if you click through
          and make a purchase — at no extra cost to you. Affiliate income helps fund our independent editorial work.
          Our safety ratings and tool recommendations are <em>never</em> influenced by commercial relationships.{' '}
          <button className="text-brand-blue hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded">
            Read our full Affiliate Disclosure Policy
          </button>.
        </p>
        <p className="text-[10px] text-gray-700 leading-relaxed">
          <strong className="text-gray-600">GDPR Notice:</strong>{' '}
          GDPR advice on this site is informational only and does not constitute legal advice. Schools should
          consult their Data Protection Officer for guidance specific to their circumstances. We collect email
          addresses with your consent only and never sell personal data.
        </p>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/5 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] text-gray-600">
          © {new Date().getFullYear()}{' '}
          <motion.span
            className="text-brand-blue font-semibold"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            getpromptly.co.uk
          </motion.span>
          {' '}· All rights reserved. Built by educators, for educators.
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
