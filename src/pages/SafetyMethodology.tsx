import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import SafetyScore, { PILLARS, getTrustTier, getScoreColour, TrustTier } from '../components/SafetyScore';

const TEAL = '#00808a';

// ─── Tier comparison data ─────────────────────────────────────────────────────

interface TierRow {
  dimension: string;
  trusted: string;
  guided: string;
  emerging: string;
}

const TIER_TABLE: TierRow[] = [
  {
    dimension: 'UK GDPR',
    trusted:  'Full UK GDPR compliance, DPA 2018 registered, UK data residency confirmed',
    guided:   'GDPR compliant but data may be processed outside the UK/EEA',
    emerging: 'GDPR status unconfirmed or self-declared only',
  },
  {
    dimension: 'Age gating',
    trusted:  'Verified age enforcement for under-13s, parental consent mechanism in place',
    guided:   'Age declared in ToS but not technically enforced at sign-up',
    emerging: 'No age verification; relies on school to enforce acceptable use',
  },
  {
    dimension: 'AI disclosure',
    trusted:  'Clear, persistent disclosure that outputs are AI-generated on every interaction',
    guided:   'Disclosure present but not prominent or easy to dismiss',
    emerging: 'No disclosure, or AI nature is obscured from end users',
  },
  {
    dimension: 'KCSIE 2025',
    trusted:  'Explicitly references KCSIE; provides DSL admin controls and audit logging',
    guided:   'Compatible with KCSIE implementation but no dedicated controls',
    emerging: 'No KCSIE reference; school must build all safeguards independently',
  },
  {
    dimension: 'Accessibility',
    trusted:  'WCAG 2.1 AA certified, assistive technology tested, SEND case studies available',
    guided:   'Meets most WCAG criteria; no formal SEND testing documented',
    emerging: 'Accessibility not publicly documented or audited',
  },
];

const TIER_STYLES: Record<TrustTier, { bg: string; text: string; border: string }> = {
  Trusted:  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Guided:   { bg: '#fefce8', text: '#92400e', border: '#fef08a' },
  Emerging: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
};

// ─── Demo scores for visual examples ─────────────────────────────────────────

const DEMO_SCORES = [
  { score: 9.1, label: 'Khanmigo' },
  { score: 7.8, label: 'ChatGPT Edu' },
  { score: 5.4, label: 'Generic AI' },
];

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SafetyMethodology() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="AI Safety Score Methodology – How We Rate Tools | GetPromptly"
        description="GetPromptly's independent AI safety scoring system for UK schools. Five pillars: Data Privacy, Age Appropriateness, Transparency, Safeguarding Alignment, and Accessibility."
        keywords="AI safety score UK schools, KCSIE AI assessment, AI tool safety rating, school AI review methodology, EdTech safety UK"
        path="/safety-methodology"
      />

      {/* ── HERO ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <SectionLabel>How We Score</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Safety Score<br />
          <span style={{ color: TEAL }}>Methodology.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl" style={{ color: '#6b6760' }}>
          Every AI tool on GetPromptly is independently assessed across five pillars — grounded in KCSIE 2025, UK GDPR, and Ofsted's emerging AI expectations.
        </p>

        {/* Independence statement */}
        <div
          className="mt-8 px-5 py-4 rounded-2xl border text-sm leading-relaxed"
          style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760' }}
        >
          <strong style={{ color: 'var(--text)' }}>GetPromptly is 100% independent.</strong> We are not affiliated with, funded by, or in commercial partnership with any AI vendor. No tool can pay for a higher score. Scores are reviewed every six months and when a product makes a significant policy or feature change.
        </div>
      </div>

      {/* ── SCORE EXAMPLES ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-14">
        <FadeIn>
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
            What the scores look like
          </h2>
          <div
            className="grid grid-cols-3 gap-px"
            style={{ background: '#e8e6e0' }}
          >
            {DEMO_SCORES.map(({ score, label }) => {
              const tier = getTrustTier(score);
              const tierStyle = TIER_STYLES[tier];
              return (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-8 gap-2"
                  style={{ background: 'white' }}
                >
                  <SafetyScore score={score} size="lg" label={label} />
                  <p className="text-xs font-medium text-center" style={{ color: '#6b6760' }}>{label}</p>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: tierStyle.bg, color: tierStyle.text }}
                  >
                    {score >= 9 ? '9–10 range' : score >= 7 ? '7–8 range' : '5–6 range'}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: '#c5c2bb' }}>
            Hover or tap each score to see the pillar breakdown
          </p>
        </FadeIn>
      </div>

      {/* ── FIVE PILLARS ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            The five scoring pillars
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6b6760' }}>
            Each pillar is scored 1–10 by a GetPromptly reviewer. The final score is the weighted average.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {PILLARS.map((pillar, i) => (
            <FadeIn key={pillar.name} delay={i * 0.06}>
              <div
                className="rounded-2xl border p-6"
                style={{ borderColor: '#e8e6e0', background: 'white' }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-display text-xl" style={{ color: 'var(--text)' }}>
                    {pillar.name}
                  </h3>
                  <span
                    className="flex-shrink-0 text-sm font-bold px-3 py-1 rounded-full"
                    style={{ background: '#e0f5f6', color: TEAL }}
                  >
                    {pillar.weight}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                  {pillar.desc}
                </p>

                {/* Weight bar */}
                <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: '#e8e6e0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: TEAL }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pillar.weight * 4}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── TIER COMPARISON TABLE ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            Trusted vs Guided vs Emerging
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
            What each trust tier means in practice across the five dimensions.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border overflow-hidden overflow-x-auto" style={{ borderColor: '#e8e6e0' }}>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr style={{ background: '#f7f6f2', borderBottom: '1px solid #e8e6e0' }}>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb', width: '140px' }}>
                    Dimension
                  </th>
                  {(['Trusted', 'Guided', 'Emerging'] as TrustTier[]).map(tier => {
                    const s = TIER_STYLES[tier];
                    return (
                      <th key={tier} className="px-5 py-3 text-left">
                        <span
                          className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
                        >
                          {tier} {tier === 'Trusted' ? '(8–10)' : tier === 'Guided' ? '(6–7)' : '(≤5)'}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {TIER_TABLE.map((row, i) => (
                  <tr
                    key={row.dimension}
                    style={{ borderBottom: i < TIER_TABLE.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                  >
                    <td className="px-5 py-4 text-xs font-semibold" style={{ color: '#6b6760', verticalAlign: 'top' }}>
                      {row.dimension}
                    </td>
                    <td className="px-5 py-4 text-xs leading-relaxed" style={{ color: '#1c1a15', background: '#f0fdf420', verticalAlign: 'top' }}>
                      {row.trusted}
                    </td>
                    <td className="px-5 py-4 text-xs leading-relaxed" style={{ color: '#6b6760', verticalAlign: 'top' }}>
                      {row.guided}
                    </td>
                    <td className="px-5 py-4 text-xs leading-relaxed" style={{ color: '#9ca3af', verticalAlign: 'top' }}>
                      {row.emerging}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>

      {/* ── REFERENCES ── */}
      <div
        className="border-t border-b"
        style={{ borderColor: '#e8e6e0', background: 'white' }}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
          <FadeIn>
            <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--text)' }}>
              Regulatory framework &amp; references
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Keeping Children Safe in Education (KCSIE) 2025',
                  body:  'The statutory guidance for schools and colleges in England. GetPromptly\'s Safeguarding Alignment pillar maps directly to Section 5 (online safety) and the updated AI annex published in the 2025 edition.',
                  href:  'https://www.gov.uk/government/publications/keeping-children-safe-in-education--2',
                  cta:   'Read KCSIE 2025 →',
                },
                {
                  title: 'DfE Generative AI in Education Guidance',
                  body:  'The Department for Education\'s official guidance on generative AI use in schools and colleges, covering acceptable use, data protection, and staff CPD requirements.',
                  href:  'https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education',
                  cta:   'Read DfE AI guidance →',
                },
                {
                  title: 'UK GDPR & Data Protection Act 2018',
                  body:  'All tools are assessed against UK GDPR requirements as enforced by the ICO, with particular attention to Article 8 (children\'s data), data residency, and processor agreements.',
                  href:  'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/',
                  cta:   'ICO guidance →',
                },
                {
                  title: 'WCAG 2.1 Level AA',
                  body:  "The Web Content Accessibility Guidelines v2.1, Level AA, form the baseline for GetPromptly's Accessibility pillar. Tools are assessed for screen reader compatibility, keyboard navigation, and colour contrast.",
                  href:  'https://www.w3.org/WAI/WCAG21/quickref/',
                  cta:   'WCAG 2.1 reference →',
                },
              ].map(ref => (
                <div
                  key={ref.title}
                  className="p-5 rounded-xl border"
                  style={{ borderColor: '#e8e6e0' }}
                >
                  <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
                    {ref.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#6b6760' }}>
                    {ref.body}
                  </p>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold hover:opacity-70 transition-opacity"
                    style={{ color: TEAL }}
                  >
                    {ref.cta}
                  </a>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
            Suggest a tool
          </p>
          <h2 className="font-display text-2xl sm:text-3xl mb-3" style={{ color: 'white' }}>
            Know a tool we haven't reviewed?
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
            We review new tools every month. If there's an AI tool being used in UK schools that isn't yet on GetPromptly, let us know.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:reviews@getpromptly.co.uk"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: 'white' }}
            >
              Suggest a tool for review →
            </a>
            <Link
              to="/tools"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: '#374151', color: '#9ca3af' }}
            >
              Browse reviewed tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
