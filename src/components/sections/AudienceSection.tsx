/**
 * AudienceSection.tsx — "Who It's For"
 * "AI support for every role in education."
 *
 * Layout  : Cream bg · lime wave lines · 4 floating text-only audience blocks
 * Style   : NO cards · NO borders · NO shadows · Playfair Display headings
 *           Generous whitespace · coral #F05A4A on links only
 */

import { FC } from 'react';
import { motion } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────

const CORAL = '#F05A4A';
const LIME  = '#84CC16';

// ── Wave SVG ───────────────────────────────────────────────────────────────

const WaveLines: FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1200 700"
    fill="none"
    style={{ opacity: 0.11 }}
  >
    {Array.from({ length: 18 }, (_, i) => (
      <path
        key={i}
        d={`M-100 ${50 + i * 38} Q300 ${16 + i * 38} 600 ${50 + i * 38} T1300 ${50 + i * 38}`}
        stroke={LIME}
        strokeWidth="1.3"
      />
    ))}
  </svg>
);

// ── Audience data ──────────────────────────────────────────────────────────

interface Audience {
  emoji: string;
  role: string;
  description: string;
  checks: string[];
  linkLabel: string;
}

const AUDIENCES: Audience[] = [
  {
    emoji: '👩‍🏫',
    role: 'Teachers',
    description:
      'Save hours every week on planning, marking, and differentiation — with tools built for real classroom life.',
    checks: [
      'AI-assisted lesson planning in minutes',
      'Instant feedback and marking support',
      'Differentiate materials for every level',
      'Safe, curriculum-aligned prompts included',
    ],
    linkLabel: 'Explore guidance for Teachers',
  },
  {
    emoji: '👨‍👧',
    role: 'Parents & Carers',
    description:
      'Understand the AI tools your child encounters, how to keep them safe, and how to support learning at home.',
    checks: [
      'Plain-English guides to every major tool',
      'Safety scores for tools your child uses',
      'Age-appropriate home learning ideas',
      'Free resources — no sign-up needed',
    ],
    linkLabel: 'Explore guidance for Parents & Carers',
  },
  {
    emoji: '🏫',
    role: 'School Leaders',
    description:
      'Introduce AI confidently across your school with policy templates, curated tools, and staff CPD resources.',
    checks: [
      'Ready-to-use whole-school AI policy',
      'GDPR-compliant tool shortlists',
      'Staff CPD frameworks and INSET plans',
      'Ofsted EIF-mapped guidance',
    ],
    linkLabel: 'Explore guidance for School Leaders',
  },
  {
    emoji: '♿',
    role: 'SEND Coordinators',
    description:
      'Discover assistive AI technologies and inclusive strategies that support every type of learner in your setting.',
    checks: [
      'Top-rated assistive AI tools reviewed',
      'SEND-specific safety scores',
      'Strategies for dyslexia, autism & more',
      'Free inclusive resources and guides',
    ],
    linkLabel: 'Explore guidance for SEND Coordinators',
  },
];

// ── Checkmark icon ─────────────────────────────────────────────────────────

const Check: FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className="flex-shrink-0 mt-0.5"
  >
    <circle cx="7" cy="7" r="7" fill="#DDEFD2" />
    <path
      d="M4 7l2 2 4-4"
      stroke="#15803D"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Single audience block ──────────────────────────────────────────────────

const AudienceBlock: FC<{ a: Audience; idx: number }> = ({ a, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
    className="flex flex-col gap-5"
  >
    {/* Icon */}
    <span className="text-4xl leading-none" aria-hidden="true">{a.emoji}</span>

    {/* Role title */}
    <h3
      style={{
        fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
        color: '#111827',
        lineHeight: 1.15,
      }}
      className="text-2xl sm:text-3xl font-bold"
    >
      {a.role}
    </h3>

    {/* Description */}
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
      {a.description}
    </p>

    {/* Checkmarks */}
    <ul className="flex flex-col gap-2.5">
      {a.checks.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check />
          <span className="text-sm text-gray-700 leading-snug">{item}</span>
        </li>
      ))}
    </ul>

    {/* Coral link */}
    <motion.a
      href="#"
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex items-center gap-1.5 text-sm font-bold mt-1 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
      style={{ color: CORAL }}
      aria-label={a.linkLabel}
    >
      {a.linkLabel}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M2.5 6.5h8M7 2.5l4 4-4 4" stroke={CORAL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.a>
  </motion.div>
);

// ── Divider line ───────────────────────────────────────────────────────────

const HairlineDivider: FC<{ vertical?: boolean }> = ({ vertical }) =>
  vertical ? (
    <div
      aria-hidden="true"
      className="hidden lg:block w-px self-stretch"
      style={{ background: 'linear-gradient(to bottom, transparent 5%, #D1FAE5 40%, #D1FAE5 60%, transparent 95%)' }}
    />
  ) : (
    <div
      aria-hidden="true"
      className="lg:hidden w-full h-px my-2"
      style={{ background: 'linear-gradient(to right, transparent 5%, #D1FAE5 40%, #D1FAE5 60%, transparent 95%)' }}
    />
  );

// ── Main section ───────────────────────────────────────────────────────────

const AudienceSection: FC<{ onViewTools?: () => void }> = () => (
  <section
    id="audience"
    aria-labelledby="audience-heading"
    className="relative w-full"
    style={{ background: '#F7FAF4', scrollMarginTop: '64px' }}
  >
    {/* Decorative wave layer — clipped independently */}
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <WaveLines />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

      {/* ── Header ── */}
      <motion.div
        className="max-w-2xl mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span
          className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-6"
          style={{ background: '#DDEFD2', color: '#166534' }}
        >
          Who It&apos;s For
        </span>
        <h2
          id="audience-heading"
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            color: '#111827',
            lineHeight: 1.13,
          }}
          className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold"
        >
          AI support for every role
          <br />
          <span style={{ color: '#4D7C0F' }}>in education.</span>
        </h2>
        <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
          Whether you&apos;re in the classroom, leading a school, or supporting
          at home — we&apos;ve got you covered.
        </p>
      </motion.div>

      {/* ── Audience blocks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr] gap-x-0 gap-y-14 lg:gap-y-0">

        {AUDIENCES.map((a, idx) => (
          <>
            <div key={a.role} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <AudienceBlock a={a} idx={idx} />
            </div>

            {/* Vertical hairlines between columns on desktop,
                horizontal hairlines between rows on mobile */}
            {idx < AUDIENCES.length - 1 && (
              <>
                <HairlineDivider vertical key={`vd-${idx}`} />
                <HairlineDivider key={`hd-${idx}`} />
              </>
            )}
          </>
        ))}

      </div>

      {/* ── Footer note ── */}
      <motion.p
        className="mt-20 text-xs text-center"
        style={{ color: '#9CA3AF' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        100% independent · No sponsored content · Free to explore
      </motion.p>

    </div>
  </section>
);

export default AudienceSection;
