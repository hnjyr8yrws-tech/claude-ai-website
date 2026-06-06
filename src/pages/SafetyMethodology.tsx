import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import { PillarCard } from '../components/trust/PillarCard';

const TEAL = 'var(--color-promptly-lime)';

// ─── The five public pillars ──────────────────────────────────────────────────
// Canonical Brand Bible spine order (never reordered). Each carries its own
// reserved pillar colour; Safeguarding is the brand axis and the heaviest weight.
// Weights are the published Promptly Score v2.2 figures (sum to 100).

interface PillarModel {
  name: string;
  weight: number;
  colour: string;
  desc: string;
  axis?: boolean;
}

const PILLAR_MODEL: PillarModel[] = [
  {
    name: 'Data Privacy',
    weight: 25,
    colour: '#6A8CAF',
    desc: 'UK GDPR posture, data residency, processor agreements, the handling of children’s data (Article 8), and clear retention and deletion policies.',
  },
  {
    name: 'Safeguarding',
    weight: 35,
    colour: '#C8E44A',
    axis: true,
    desc: 'KCSIE 2025 alignment, DSL controls and audit logging, reporting and escalation pathways, content moderation, and monitoring. The heaviest pillar — the axis the whole model turns on.',
  },
  {
    name: 'Age Suitability',
    weight: 15,
    colour: '#8C7A52',
    desc: 'Age-gating and how it is enforced at sign-up, minimum-age policies, and whether content is genuinely suitable for the intended key stage.',
  },
  {
    name: 'Transparency',
    weight: 10,
    colour: '#4A4F5C',
    desc: 'Clear, persistent AI disclosure, accuracy and hallucination warnings, explainability, and how openly the vendor states the tool’s limitations.',
  },
  {
    name: 'Accessibility',
    weight: 15,
    colour: '#D97757',
    desc: 'WCAG 2.1 AA alignment, SEND adaptations, assistive-technology support, and EAL considerations.',
  },
];

const MAX_WEIGHT = Math.max(...PILLAR_MODEL.map(p => p.weight)); // 35

// ─── Verdict bands (Promptly Score v2.2) ──────────────────────────────────────
// Replaces the retired Trusted / Guided / Emerging tiers.

interface Band {
  range: string;
  name: string;
  note: string;
}

const BANDS: Band[] = [
  {
    range: '9.0 – 10',
    name: 'Promptly Recommended',
    note: 'Strong across every pillar, with safeguarding and data privacy both robust. Safe to adopt with normal due diligence.',
  },
  {
    range: '8.0 – 8.9',
    name: 'Strong',
    note: 'A well-built tool with only minor gaps. Adopt with a light policy check.',
  },
  {
    range: '7.0 – 7.9',
    name: 'Worth Considering',
    note: 'Capable, but with caveats worth reading before you roll it out widely.',
  },
  {
    range: '6.0 – 6.9',
    name: 'Proceed Carefully',
    note: 'Usable, but only with clear guardrails and an acceptable-use policy in place first.',
  },
  {
    range: 'Below 6.0',
    name: 'Avoid',
    note: 'A verified safeguarding, privacy or suitability concern — not missing paperwork. We would not deploy it as it stands.',
  },
];

// ─── How a score is produced ──────────────────────────────────────────────────

const STEPS = [
  'A named GetPromptly reviewer (currently CR) assesses the tool against all five pillars — using public documentation, vendor responses, and, where possible, hands-on testing.',
  'Each pillar is scored 0–10 from that evidence. These are the per-pillar marks you see on the Pillar Card.',
  'The pillars are combined as a weighted average — weighted towards Safeguarding and Data Privacy — to give the composite Promptly Score.',
  'A safeguarding-and-privacy floor is applied: the composite is held close to the lower of those two pillars, so a weak safeguarding mark caps the headline score rather than being averaged away.',
  'The composite maps to a verdict band, and the review records how much evidence it rests on as a separate Evidence Confidence rating.',
  'Every score is published with its methodology version, the reviewer, and the date it was verified — and re-checked on any significant product change.',
];

// ─── Review basis ─────────────────────────────────────────────────────────────

const REVIEW_BASIS = [
  {
    label: 'Desk Review',
    desc: 'Assessed from public documentation, terms, privacy policies and vendor responses. The starting point for every tool.',
  },
  {
    label: 'Hands-On Tested',
    desc: 'A reviewer has used the product directly, checking the claims in the documentation against how it actually behaves.',
  },
  {
    label: 'Classroom Trialled',
    desc: 'Used in a real UK school setting before the score was finalised — the highest basis we publish against.',
  },
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
        title="The Promptly Score Methodology – How We Rate AI Tools | GetPromptly"
        description="GetPromptly's independent methodology for reviewing AI tools in UK schools. Five pillars — Data Privacy, Safeguarding, Age Suitability, Transparency and Accessibility — grounded in KCSIE 2025 and UK GDPR. No tool can pay for a score."
        keywords="Promptly Score methodology, AI safety UK schools, KCSIE AI assessment, AI tool review methodology, EdTech safety UK"
        path="/safety-methodology"
      />

      {/* ── HERO ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-12">
        <SectionLabel>How We Score</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          The Promptly Score<br />
          <span style={{ color: 'var(--color-ink-accent)' }}>Methodology.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl" style={{ color: '#6b6760' }}>
          Every AI tool on GetPromptly is assessed against five pillars — grounded in KCSIE 2025, UK GDPR and the DfE&rsquo;s guidance on generative AI in education. One number, with its working fully shown.
        </p>

        {/* Independence statement */}
        <div
          className="mt-8 px-5 py-4 rounded-2xl border text-sm leading-relaxed"
          style={{ borderColor: '#e8e6e0', background: 'white', color: '#6b6760' }}
        >
          <strong style={{ color: 'var(--text)' }}>GetPromptly is independent.</strong> We are not funded by, affiliated with, or in commercial partnership with any AI vendor. No tool can pay for a higher score or a better placement. Scores are reviewed when a product makes a significant policy or feature change.
        </div>

        {/* Methodology mark — JetBrains Mono, methodology/timestamps only */}
        <p className="font-mono mt-4 uppercase" style={{ fontSize: 11, letterSpacing: '0.08em', color: '#6b6760' }}>
          Promptly Score v2.2 · Reviewer of record: CR · Each tool carries its own verified date
        </p>
      </div>

      {/* ── THE FIVE PILLARS ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <SectionLabel>The spine</SectionLabel>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            The five scoring pillars
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6b6760' }}>
            Each pillar is scored 0&ndash;10 by a named reviewer. Their weighted average is the Promptly Score &mdash; weighted towards Safeguarding and Data Privacy, the two pillars that decide whether a tool belongs in a school at all. On each reviewed tool, a pillar also carries a plain-word band &mdash; Strong, Basic, Weak or Critical &mdash; whenever it scores 8.0 or below; pillars above 8.0 are Exemplary and show the score on its own, so the pillars worth a second look are the ones that stand out.
          </p>
        </FadeIn>

        <div className="space-y-4">
          {PILLAR_MODEL.map((pillar, i) => (
            <FadeIn key={pillar.name} delay={i * 0.06}>
              {/* Oat card so a pillar's own colour (incl. lime) sits legally on oat */}
              <div
                className="rounded-2xl border p-6"
                style={{ borderColor: '#e8e6e0', background: 'var(--color-oat)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-display text-xl flex items-center gap-2" style={{ color: 'var(--color-ink)' }}>
                    {pillar.name}
                    {pillar.axis && (
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: 9, letterSpacing: '0.08em', color: '#6b6760' }}
                      >
                        the axis
                      </span>
                    )}
                  </h3>
                  <span
                    className="flex-shrink-0 text-sm font-bold px-3 py-1 rounded-full"
                    style={{ background: 'white', color: 'var(--color-ink)' }}
                  >
                    {pillar.weight}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                  {pillar.desc}
                </p>

                {/* Weight bar — uses the pillar's own reserved colour */}
                <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: pillar.colour }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(pillar.weight / MAX_WEIGHT) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── THE COMPOSITE ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <SectionLabel>The composite</SectionLabel>
          <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            How a Promptly Score is built
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: '#6b6760' }}>
            The <strong style={{ color: 'var(--text)' }}>Promptly Score</strong> is a single number from 0 to 10 that
            summarises how ready an AI tool is for UK education. It is the weighted average of the five pillar scores
            &mdash; never an average of opinion, and never paid for. The pillars tell you where a tool is strong and where
            it falls short; the composite gives you the one-glance verdict.
          </p>
          <ol className="space-y-3 mb-2">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                <span
                  className="font-mono flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: 22, height: 22, fontSize: 11, background: 'var(--color-oat)', color: 'var(--color-ink-accent)' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>

      {/* ── VERDICT BANDS ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            What the bands mean
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
            Where a composite lands sets the verdict. The bands describe readiness for a UK school &mdash; not a grade for the product in the abstract.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e6e0' }}>
            {BANDS.map((band, i) => (
              <div
                key={band.name}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 px-5 py-4"
                style={{
                  background: 'white',
                  borderBottom: i < BANDS.length - 1 ? '1px solid #f0efe9' : 'none',
                }}
              >
                <span
                  className="font-mono flex-shrink-0 tabular-nums"
                  style={{ fontSize: 12, width: 84, color: 'var(--color-ink)' }}
                >
                  {band.range}
                </span>
                <span className="font-display flex-shrink-0" style={{ fontSize: 16, width: 200, color: 'var(--text)' }}>
                  {band.name}
                </span>
                <span className="text-xs leading-relaxed" style={{ color: '#6b6760' }}>
                  {band.note}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── SCORE vs EVIDENCE CONFIDENCE ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <SectionLabel>Two numbers, not one</SectionLabel>
          <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text)' }}>
            The score, and how sure we are of it
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <h3 className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>Promptly Score</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                Reflects what we can <strong style={{ color: 'var(--text)' }}>verify</strong> about a tool against the five pillars. It moves only on evidence of how the product actually behaves.
              </p>
            </div>
            <div className="rounded-2xl border p-5" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <h3 className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>Evidence Confidence</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>
                Reflects how much documentation we had to work with. A missing data-processing agreement lowers our confidence &mdash; it does not, by itself, make a tool unsafe.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mt-4" style={{ color: '#6b6760' }}>
            We place a tool in the <strong style={{ color: 'var(--text)' }}>Avoid</strong> band only on verified grounds: a confirmed safeguarding or privacy concern, terms clearly unsuitable for schools, a product that has been withdrawn, or a tool being promoted for a use it is plainly not fit for. Missing paperwork is a confidence problem, not a safety verdict.
          </p>
        </FadeIn>
      </div>

      {/* ── HOW WE VERIFY (review basis) ── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 mb-16">
        <FadeIn>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
            How far we&rsquo;ve gone
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6b6760' }}>
            Every published score states the basis it rests on, so you know how deep the review went.
          </p>
        </FadeIn>
        <div className="space-y-3">
          {REVIEW_BASIS.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.06}>
              <div className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                <span
                  className="font-mono uppercase flex-shrink-0"
                  style={{ fontSize: 10, letterSpacing: '0.06em', color: 'var(--color-ink-accent)', width: 110, paddingTop: 2 }}
                >
                  {b.label}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{b.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── INDEPENDENT BY DESIGN (replaces the retired tier table) ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
          <FadeIn>
            <p className="font-mono uppercase mb-3" style={{ fontSize: 11, letterSpacing: '0.1em', color: TEAL }}>
              Never for sale
            </p>
            <h2 className="font-display text-2xl sm:text-3xl mb-4" style={{ color: 'white' }}>
              Independent by design
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: '#b8b6ae' }}>
              How a tool is <em>ranked</em> in a directory and how it is <em>scored</em> for trust are kept completely separate. The order tools appear in has no bearing on their Promptly Score, and a higher score can never be bought. The trust verdict is built only from the five pillars above.
            </p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b8b6ae' }}>
              Where a published score isn&rsquo;t yet in place, we show a clear <strong style={{ color: 'white' }}>pending-review</strong> state rather than a fabricated number. We would rather show you nothing than show you a guess.
            </p>
          </FadeIn>

          {/* Visual language — provisional Pillar Card, no fabricated live scores */}
          <FadeIn delay={0.1}>
            <div className="mt-10 flex flex-col items-center">
              <PillarCard
                state="provisional"
                size={220}
                toolName="Awaiting review"
                showName
                showVerdict={false}
                methodologyVersion="2.2"
              />
              <p className="text-xs mt-4 text-center max-w-sm" style={{ color: '#6b6760' }}>
                This is the Pillar Card &mdash; the artefact every score lives inside. Until a tool is reviewed, its ring sits empty and its score reads &ldquo;&mdash;&rdquo;. Live pillar marks appear on each tool&rsquo;s page once verified.
              </p>
            </div>
          </FadeIn>
        </div>
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
                  body:  'The statutory guidance for schools and colleges in England. Our Safeguarding pillar maps to Section 5 (online safety) and the AI considerations in the 2025 edition. We say "KCSIE-aware", never "KCSIE compliant", of a third-party tool.',
                  href:  'https://www.gov.uk/government/publications/keeping-children-safe-in-education--2',
                  cta:   'Read KCSIE 2025 →',
                },
                {
                  title: 'DfE Generative AI in Education Guidance',
                  body:  'The Department for Education’s official guidance on generative AI in schools and colleges, covering acceptable use, data protection, and staff CPD.',
                  href:  'https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education',
                  cta:   'Read DfE AI guidance →',
                },
                {
                  title: 'UK GDPR & Data Protection Act 2018',
                  body:  'Tools are assessed against UK GDPR as enforced by the ICO, with particular attention to Article 8 (children’s data), data residency, and processor agreements.',
                  href:  'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/',
                  cta:   'ICO guidance →',
                },
                {
                  title: 'WCAG 2.1 Level AA',
                  body:  'The Web Content Accessibility Guidelines v2.1, Level AA, are the baseline for our Accessibility pillar — screen-reader compatibility, keyboard navigation, and colour contrast.',
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
                    style={{ color: 'var(--color-ink-accent)' }}
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
            Know a tool we haven&rsquo;t reviewed?
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
            If there&rsquo;s an AI tool being used in UK schools that isn&rsquo;t yet on GetPromptly, let us know and we&rsquo;ll add it to the review queue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:reviews@getpromptly.co.uk"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: '#1A1A0E' }}
            >
              Suggest a tool for review →
            </a>
            <Link
              to="/tools"
              className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: '#374151', color: '#9ca3af' }}
            >
              Browse the directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
