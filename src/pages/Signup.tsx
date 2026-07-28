/**
 * Signup.tsx — /signup — public sign-up for safety alerts + product updates.
 * Thin page wrapper around the reusable <SignupForm/> (which owns the logic).
 */
import SEO from '../components/SEO';
import SignupForm from '../components/SignupForm';

export default function Signup() {
  return (
    <>
      <SEO
        title="Sign up for AI safety alerts | GetPromptly"
        description="Get notified when an AI tool is withdrawn from review, plus occasional product updates from GetPromptly — independent, KCSIE 2025-aligned reviews for UK education. Double opt-in; unsubscribe anytime."
        keywords="AI safety alerts UK schools, tool withdrawal alerts, GetPromptly newsletter, KCSIE AI updates"
        path="/signup"
      />

      <section className="px-5 sm:px-8 py-14" style={{ background: 'var(--bg)', minHeight: '70vh' }}>
        <div className="max-w-md mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--color-ink-accent)' }}>
            Stay informed
          </p>
          <h1 className="font-display text-4xl mt-2" style={{ color: 'var(--text)' }}>
            AI safety alerts for UK education
          </h1>
          <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
            We review AI tools against KCSIE 2025 across five pillars. Sign up and we&rsquo;ll tell you when a tool is
            withdrawn from review — plus occasional product updates. No spam, unsubscribe anytime.
          </p>

          <div className="mt-6">
            <SignupForm heading="Get safety alerts" />
          </div>
        </div>
      </section>
    </>
  );
}
