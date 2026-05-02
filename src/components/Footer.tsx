import { FC } from 'react';
import { Link } from 'react-router-dom';

const NAV = [
  { label: 'For Schools',        to: '/schools' },
  { label: 'AI Tools',           to: '/tools' },
  { label: 'Training',           to: '/ai-training' },
  { label: 'Equipment',          to: '/ai-equipment' },
  { label: 'Prompts',            to: '/prompts' },
  { label: 'Safety Methodology', to: '/safety-methodology' },
  { label: 'Who We Are',         to: '/who-we-are' },
];

const ROLES = [
  { label: 'Teachers',        to: '/teachers' },
  { label: 'School Leaders',  to: '/school-leaders' },
  { label: 'SENDCOs',         to: '/senco' },
  { label: 'Parents',         to: '/parents' },
  { label: 'Students',        to: '/students' },
  { label: 'Admin Staff',     to: '/admin' },
];

const COMPLIANCE = [
  { label: 'KCSIE 2025', note: 'Aligned' },
  { label: 'GDPR',       note: 'Compliant' },
  { label: 'ICO',        note: 'Registered' },
];

const LEGAL = [
  { label: 'Privacy Policy',       to: '/legal#privacy' },
  { label: 'Cookie Policy',        to: '/legal#cookies' },
  { label: 'Affiliate Disclosure', to: '/legal#affiliate' },
];

const DARK = '#0F1C1A';
const DARK_2 = '#142522';
const DARK_3 = '#1B302C';
const LIME = '#BEFF00';
const CYAN = '#00D1FF';
const TEXT_DIM = 'rgba(255,255,255,0.55)';
const TEXT_FAINT = 'rgba(255,255,255,0.32)';
const BORDER = 'rgba(255,255,255,0.08)';

const linkClass =
  'text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BEFF00] rounded';

const Footer: FC = () => (
  <footer role="contentinfo" className="relative overflow-hidden" style={{ background: DARK, color: TEXT_DIM }}>
    {/* Soft animated bubbles in footer */}
    <div className="gp-bubble-layer" aria-hidden="true">
      <span className="gp-bubble gp-bubble--lime gp-float-a" style={{ width: 360, height: 360, top: '-20%', left: '-10%' }} />
      <span className="gp-bubble gp-bubble--cyan gp-float-b" style={{ width: 320, height: 320, bottom: '-25%', right: '-8%' }} />
    </div>

    {/* Affiliate disclosure banner */}
    <div className="relative border-b px-5 sm:px-8 py-3 z-10" style={{ borderColor: BORDER, background: 'rgba(0,0,0,0.25)' }}>
      <p className="max-w-6xl mx-auto text-[11px] text-center" style={{ color: TEXT_FAINT }}>
        <strong style={{ color: TEXT_DIM }}>Affiliate disclosure:</strong>{' '}
        Some links on GetPromptly are affiliate links. We may earn a small commission at no extra cost to you. All reviews are independent — we never accept payment for positive coverage.
      </p>
    </div>

    <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 z-10">

      {/* Brand */}
      <div className="lg:col-span-2 space-y-5">
        <Link to="/" className="flex items-center gap-2.5 w-fit rounded-lg" aria-label="GetPromptly – go to homepage">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: DARK_2,
              border: `1px solid ${BORDER}`,
              boxShadow: `0 0 0 1px rgba(190,255,0,0.3), 0 8px 16px rgba(0,0,0,0.45)`,
            }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke={LIME} strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display text-xl text-white leading-none">GetPromptly</span>
        </Link>

        <p className="text-sm leading-relaxed max-w-xs" style={{ color: TEXT_DIM }}>
          The UK&apos;s independent resource for safe AI in education. Trusted by teachers,
          parents, school leaders and SEND coordinators across the country.
        </p>

        <p className="text-xs leading-relaxed max-w-xs" style={{ color: TEXT_FAINT }}>
          <strong style={{ color: TEXT_DIM }}>AI transparency:</strong>{' '}
          The Promptly AI chat widget is powered by Anthropic Claude. It is an AI assistant, not a human. Responses may be inaccurate — always verify important information.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {COMPLIANCE.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{
                border: `1px solid ${BORDER}`,
                background: DARK_3,
                color: TEXT_DIM,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: LIME, boxShadow: `0 0 6px ${LIME}` }}
                aria-hidden="true"
              />
              {c.label} {c.note}
            </span>
          ))}
        </div>
      </div>

      <nav aria-label="Footer navigation">
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: LIME }}>
          Explore
        </h3>
        <ul className="space-y-2.5" role="list">
          {NAV.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={linkClass} style={{ color: TEXT_DIM }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Role pages">
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: CYAN }}>
          I&rsquo;m a&hellip;
        </h3>
        <ul className="space-y-2.5" role="list">
          {ROLES.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={linkClass} style={{ color: TEXT_DIM }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Legal and policy links">
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: '#A78BFA' }}>
          Legal
        </h3>
        <ul className="space-y-2.5" role="list">
          {LEGAL.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className={linkClass} style={{ color: TEXT_DIM }}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a href="mailto:hello@getpromptly.co.uk" className={linkClass} style={{ color: TEXT_DIM }}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div className="relative border-t px-5 sm:px-8 py-5 z-10" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs" style={{ color: TEXT_FAINT }}>
          © {new Date().getFullYear()} getpromptly.co.uk · All rights reserved · Built by educators, for educators
        </p>
        <p className="text-xs" style={{ color: TEXT_FAINT }}>
          100% independent · No sponsored content · No paid placements
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
