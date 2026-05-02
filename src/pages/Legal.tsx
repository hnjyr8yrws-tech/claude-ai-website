import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const TEAL  = '#BEFF00';
const MUTED = '#4A4A4A';

export default function Legal() {
  const { hash } = useLocation();

  // Scroll to the correct section when navigating via hash
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [hash]);

  return (
    <div style={{ background: '#F8F5F0', color: '#1A1A1A' }}>
      <SEO
        title="Legal — Privacy, Cookies & Affiliate Disclosure | GetPromptly"
        description="Read GetPromptly's privacy policy, cookie policy and affiliate disclosure. We are fully transparent about how we use data and how our site is funded."
        keywords="getpromptly privacy policy, cookie policy, affiliate disclosure"
        path="/legal"
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-20">

        {/* Page header */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: TEAL }}>
            Legal &amp; Policies
          </p>
          <h1 className="font-display text-4xl mb-4" style={{ color: '#1A1A1A' }}>
            Transparency &amp; Legal Information
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            GetPromptly is an independent UK education advisory platform. This page covers our privacy
            practices, cookie usage, and affiliate disclosure. Last updated: April 2026.
          </p>
        </div>

        {/* Privacy Policy */}
        <section id="privacy" className="scroll-mt-24 space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#1A1A1A' }}>Privacy Policy</h2>

          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            GetPromptly (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This policy
            explains what data we collect, why we collect it, and how we use it.
          </p>

          <h3 className="font-semibold text-base">What data we collect</h3>
          <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5" style={{ color: MUTED }}>
            <li><strong>Usage data:</strong> Pages visited, time on site, clicks and searches &mdash; collected anonymously via Google Analytics 4. No personally identifiable information is captured without consent.</li>
            <li><strong>Contact form submissions:</strong> If you use our consultation request form, we collect your name, school name, role and message. This data is used only to respond to your enquiry.</li>
            <li><strong>Cookie data:</strong> See the Cookie Policy section below.</li>
          </ul>

          <h3 className="font-semibold text-base">How we use your data</h3>
          <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5" style={{ color: MUTED }}>
            <li>To improve the site based on how it is used</li>
            <li>To respond to consultation and contact requests</li>
            <li>We do not sell data to third parties</li>
            <li>We do not use data for targeted advertising</li>
          </ul>

          <h3 className="font-semibold text-base">Your rights (UK GDPR)</h3>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            Under UK GDPR you have the right to access, correct or delete your personal data.
            To exercise these rights, contact us at{' '}
            <a href="mailto:hello@getpromptly.co.uk" className="underline" style={{ color: TEAL }}>
              hello@getpromptly.co.uk
            </a>.
          </p>

          <h3 className="font-semibold text-base">Data retention</h3>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            Analytics data is retained for 14 months per Google Analytics default settings.
            Contact form submissions are retained for up to 12 months then securely deleted.
          </p>
        </section>

        <hr style={{ borderColor: '#ECE7DD' }} />

        {/* Cookie Policy */}
        <section id="cookies" className="scroll-mt-24 space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#1A1A1A' }}>Cookie Policy</h2>

          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            GetPromptly uses a small number of cookies. We never use cookies for advertising or
            tracking across other sites.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse" style={{ color: MUTED }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ECE7DD' }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#1A1A1A' }}>Cookie</th>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#1A1A1A' }}>Purpose</th>
                  <th className="text-left py-2 font-semibold" style={{ color: '#1A1A1A' }}>Duration</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr style={{ borderBottom: '1px solid #f0ede8' }}>
                  <td className="py-2 pr-4 font-mono">_ga, _ga_*</td>
                  <td className="py-2 pr-4">Google Analytics — anonymous usage statistics</td>
                  <td className="py-2">13 months</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0ede8' }}>
                  <td className="py-2 pr-4 font-mono">promptly_cookie</td>
                  <td className="py-2 pr-4">Records whether you have accepted our cookie notice</td>
                  <td className="py-2">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            You can withdraw cookie consent at any time by clearing your browser cookies and
            refreshing the page. Our cookie notice will reappear and you may decline analytics cookies.
          </p>
        </section>

        <hr style={{ borderColor: '#ECE7DD' }} />

        {/* Affiliate Disclosure */}
        <section id="affiliate" className="scroll-mt-24 space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl" style={{ color: '#1A1A1A' }}>Affiliate Disclosure</h2>

          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            GetPromptly is an independent advisory platform. Some links on this site are affiliate
            links &mdash; meaning if you click a link and make a purchase, we may receive a small commission
            at no extra cost to you.
          </p>

          <h3 className="font-semibold text-base">Our commitment to independence</h3>
          <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5" style={{ color: MUTED }}>
            <li>We never accept payment for positive reviews or higher rankings</li>
            <li>Affiliate relationships have no influence on our safety scores or editorial ratings</li>
            <li>Products and tools are assessed using our published{' '}
              <a href="/safety-methodology" className="underline" style={{ color: TEAL }}>safety methodology</a>
            </li>
            <li>We disclose affiliate relationships clearly where relevant</li>
          </ul>

          <h3 className="font-semibold text-base">Current affiliate relationships</h3>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            GetPromptly may participate in affiliate programmes including Amazon Associates and
            selected education technology suppliers. Specific affiliate links are identified where
            present. This may be updated as our relationships change.
          </p>

          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            Questions about our commercial relationships?{' '}
            <a href="mailto:hello@getpromptly.co.uk" className="underline" style={{ color: TEAL }}>
              Contact us
            </a>.
          </p>
        </section>

        {/* Contact footer */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: '#111210', color: '#9ca3af' }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: 'white' }}>Questions about these policies?</p>
          <p className="text-sm">
            Email{' '}
            <a href="mailto:hello@getpromptly.co.uk" className="underline" style={{ color: TEAL }}>
              hello@getpromptly.co.uk
            </a>{' '}
            and we will respond within 5 working days.
          </p>
        </div>
      </div>
    </div>
  );
}
