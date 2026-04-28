import { FC } from 'react';
import { Link } from 'react-router-dom';

const NAV = [
  { label: 'AI Tools',         to: '/tools' },
  { label: 'Equipment',        to: '/ai-equipment' },
  { label: 'Training',         to: '/ai-training' },
  { label: 'Prompts',          to: '/prompts' },
  { label: 'For Schools',      to: '/schools' },
  { label: 'Safety Methodology', to: '/safety-methodology' },
  { label: 'Who We Are',        to: '/who-we-are' },
];

const COMPLIANCE = [
  { label: 'KCSIE 2025', note: 'Aligned' },
  { label: 'GDPR',       note: 'Compliant' },
  { label: 'ICO',        note: 'Registered' },
];

// Legal items — Link components for real pages once they exist.
// Using # as placeholder; swap for real routes when pages are built.
const LEGAL = [
  { label: 'Privacy Policy',       to: '/legal#privacy' },
  { label: 'Cookie Policy',        to: '/legal#cookies' },
  { label: 'Affiliate Disclosure', to: '/legal#affiliate' },
];

const Footer: FC = () => (
  <footer role="contentinfo" style={{ background: '#111210', color: '#a09d98' }}>

    {/* Affiliate disclosure banner — shown on all pages */}
    <div
      className="border-b px-5 sm:px-8 py-3"
      style={{ borderColor: '#1f1d1b', background: '#0d0d0b' }}
    >
      <p className="max-w-6xl mx-auto text-[11px] text-center" style={{ color: '#4b5563' }}>
        <strong style={{ color: '#6b6760' }}>Affiliate disclosure:</strong> Some links on GetPromptly are affiliate links. We may earn a small commission at no extra cost to you. All reviews are independent — we never accept payment for positive coverage.
      </p>
    </div>

    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

      {/* Brand */}
      <div className="lg:col-span-2 space-y-4">
        <Link to="/" className="flex items-center gap-2.5 w-fit rounded" aria-label="GetPromptly – go to homepage">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#00808a' }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display text-lg text-white leading-none">GetPromptly</span>
        </Link>

        <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#6b6760' }}>
          The UK's independent resource for safe AI in education. Trusted by teachers,
          parents, school leaders and SEND coordinators across the country.
        </p>

        {/* AI Transparency Notice */}
        <p className="text-xs leading-relaxed max-w-xs" style={{ color: '#4b5563' }}>
          <strong style={{ color: '#6b6760' }}>AI transparency:</strong> The Promptly AI chat widget is powered by Anthropic Claude. It is an AI assistant, not a human. Responses may be inaccurate — always verify important information.
        </p>

        {/* Compliance badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {COMPLIANCE.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border"
              style={{ borderColor: '#2a2825', color: '#6b6760' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: '#00808a' }}
                aria-hidden="true"
              />
              {c.label} {c.note}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Footer navigation">
        <h3 className="text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#3a3835' }}>
          Explore
        </h3>
        <ul className="space-y-2.5" role="list">
          {NAV.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] rounded"
                style={{ color: '#6b6760' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Legal */}
      <nav aria-label="Legal and policy links">
        <h3 className="text-[11px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#3a3835' }}>
          Legal
        </h3>
        <ul className="space-y-2.5" role="list">
          {LEGAL.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] rounded"
                style={{ color: '#6b6760' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="mailto:hello@getpromptly.co.uk"
              className="text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] rounded"
              style={{ color: '#6b6760' }}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>

    {/* Bottom bar */}
    <div className="border-t px-5 sm:px-8 py-5" style={{ borderColor: '#1f1d1b' }}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs" style={{ color: '#3a3835' }}>
          © {new Date().getFullYear()} getpromptly.co.uk · All rights reserved · Built by educators, for educators
        </p>
        <p className="text-xs" style={{ color: '#3a3835' }}>
          100% independent · No sponsored content · No paid placements
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
