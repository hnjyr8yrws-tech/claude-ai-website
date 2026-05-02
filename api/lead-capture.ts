/**
 * api/lead-capture.ts
 *
 * Vercel Edge Function — lead-capture endpoint.
 * Sends two emails per submission:
 *   1. The resource email (offer-specific HTML) to the user.
 *   2. An admin notification to info@getpromptly.co.uk so a human can
 *      follow up if delivery is delayed or the offer key is unknown.
 *
 * Brevo is the transactional email provider (same as api/brevo-subscribe.ts).
 *
 * Required Vercel environment variables:
 *   BREVO_API_KEY  — Brevo transactional key. Server-side only — never prefix with VITE_.
 *   FROM_EMAIL     — optional. Defaults to "GetPromptly <info@getpromptly.co.uk>".
 *   ADMIN_EMAIL    — optional. Defaults to "info@getpromptly.co.uk".
 *
 * DNS setup (one-time, before launch):
 *   1. Verify getpromptly.co.uk in the Brevo dashboard.
 *   2. Add the SPF, DKIM and DMARC records Brevo provides.
 *   3. Test each offer key end-to-end before exposing it on the site.
 *
 * Errors:
 *   - Brevo non-2xx → throws with the Brevo error body in logs and
 *     returns 502 so the front-end shows the fallback "email
 *     info@getpromptly.co.uk" message.
 *   - Unknown offer key → falls back to the free-prompt-pack content
 *     and flags it in the admin notification so we can add it.
 */

export const config = { runtime: 'edge' };

const FROM_EMAIL_DEFAULT  = 'GetPromptly <info@getpromptly.co.uk>';
const ADMIN_EMAIL_DEFAULT = 'info@getpromptly.co.uk';
const BREVO_SEND_URL      = 'https://api.brevo.com/v3/smtp/email';

// ─── Offer content ────────────────────────────────────────────────────────────
//
// Add a new key here whenever you wire a new lead magnet on the site.
// The key must match the `offer` value sent from the front-end.

interface OfferContent { subject: string; html: string }

const offerContent: Record<string, OfferContent> = {
  // ── Generic packs ──────────────────────────────────────────────────────────
  'free-prompt-pack': {
    subject: 'Your free GetPromptly prompt pack',
    html: `<h1>Your free GetPromptly prompt pack</h1>
<p>Here is your starter pack for using AI safely and practically in UK education. Pick one prompt, paste it into Claude, ChatGPT or Gemini, then add your year group, subject and constraints.</p>
<ul>
  <li><strong>Lesson planning:</strong> Create a 45-minute lesson from a learning objective, class profile and likely misconceptions.</li>
  <li><strong>Differentiation:</strong> Rewrite this task for stretch, scaffold, EAL and dyslexia-friendly access.</li>
  <li><strong>Whole-class feedback:</strong> Turn these common marking errors into a feedback slide and next-step task.</li>
  <li><strong>SEND support:</strong> Summarise these teacher observations into neutral provision-review notes.</li>
  <li><strong>Parent communication:</strong> Draft a supportive parent update without over-sharing pupil data.</li>
</ul>
<p>Questions? Reply to this email or contact <a href="mailto:info@getpromptly.co.uk">info@getpromptly.co.uk</a>.</p>`,
  },
  'school-toolkit': {
    subject: 'Your GetPromptly school AI toolkit',
    html: `<h1>Your GetPromptly school AI toolkit</h1>
<p>This toolkit helps leaders plan safe AI adoption across tools, training, equipment and staff guidance.</p>
<ul>
  <li>AI readiness checklist for senior leaders</li>
  <li>Staff training pathway by role and confidence level</li>
  <li>Tool review checklist — KCSIE 2025 and UK GDPR focused</li>
  <li>Policy and acceptable-use prompt starters for consultation</li>
</ul>
<p>To discuss your school&apos;s specific context, use the consultation request on <a href="https://www.getpromptly.co.uk/schools#consultation">getpromptly.co.uk/schools</a>.</p>`,
  },
  'equipment-shortlist': {
    subject: 'Your GetPromptly equipment shortlist',
    html: `<h1>Your equipment shortlist</h1>
<p>Thank you for your interest. Our team will send a tailored equipment shortlist to this address shortly.</p>
<p>In the meantime, browse the full directory at <a href="https://www.getpromptly.co.uk/ai-equipment">getpromptly.co.uk/ai-equipment</a>.</p>
<p>Questions? Reply to this email or contact <a href="mailto:info@getpromptly.co.uk">info@getpromptly.co.uk</a>.</p>`,
  },

  // ── Role-specific prompt packs ─────────────────────────────────────────────
  'teacher-prompt-pack': {
    subject: 'Your teacher prompt pack — GetPromptly',
    html: `<h1>Teacher Prompt Pack</h1>
<p>Here are your starter prompts for lesson planning, differentiation and feedback.</p>
<ol>
  <li>Create a lesson plan from a learning objective, class profile and likely misconceptions.</li>
  <li>Adapt this task for stretch, scaffold, EAL and dyslexia-friendly access.</li>
  <li>Turn common marking errors into a whole-class feedback slide and next-step task.</li>
  <li>Draft a supportive parent update without over-sharing pupil data.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/teachers">getpromptly.co.uk/prompts/teachers</a>.</p>`,
  },
  'leader-prompt-pack': {
    subject: 'Your school leadership prompt pack — GetPromptly',
    html: `<h1>School Leadership Prompt Pack</h1>
<ol>
  <li>Draft a one-page AI acceptable-use policy for staff consultation.</li>
  <li>Create a governor briefing that explains benefits, risks and safeguards.</li>
  <li>Build a phased AI rollout plan with owners, milestones and review points.</li>
  <li>Prepare Ofsted-ready notes on AI implementation, safeguarding and controls.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/school-leaders">getpromptly.co.uk/prompts/school-leaders</a>.</p>`,
  },
  'senco-prompt-pack': {
    subject: 'Your SENCO prompt pack — GetPromptly',
    html: `<h1>SENCO Prompt Pack</h1>
<ol>
  <li>Summarise staff observations into neutral annual-review preparation notes.</li>
  <li>Generate classroom strategies from a learner profile and known barriers.</li>
  <li>Create an access-arrangements evidence checklist from assessment notes.</li>
  <li>Draft EHCP annual review question prompts for families and staff.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/senco">getpromptly.co.uk/prompts/senco</a>.</p>`,
  },
  'admin-prompt-pack': {
    subject: 'Your school admin prompt pack — GetPromptly',
    html: `<h1>School Admin Prompt Pack</h1>
<ol>
  <li>Rewrite a parent email so it is clear, calm and school-appropriate.</li>
  <li>Turn meeting notes into actions, owners and deadlines.</li>
  <li>Draft a concise reminder for attendance, trips or deadline communication.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/admin">getpromptly.co.uk/prompts/admin</a>.</p>`,
  },
  'parent-prompt-pack': {
    subject: 'Your parents prompt pack — GetPromptly',
    html: `<h1>Parents Prompt Pack</h1>
<ol>
  <li>Create a 20-minute revision routine for a reluctant GCSE learner.</li>
  <li>Rewrite a school email so it is firm, polite and evidence-based.</li>
  <li>Explain this homework task in simpler steps without giving the answer.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/parents">getpromptly.co.uk/prompts/parents</a>.</p>`,
  },
  'student-prompt-pack': {
    subject: 'Your student prompt pack — GetPromptly',
    html: `<h1>Student Prompt Pack</h1>
<ol>
  <li>Create a revision plan from my exam date, topics and confidence scores.</li>
  <li>Ask me Socratic questions to improve my essay argument.</li>
  <li>Turn this mark scheme into a checklist I can use before submitting.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/students">getpromptly.co.uk/prompts/students</a>.</p>`,
  },
  'subject-leads-prompt-pack': {
    subject: 'Your subject leads prompt pack — GetPromptly',
    html: `<h1>Subject Leads Prompt Pack</h1>
<ol>
  <li>Build a curriculum map from National Curriculum strands, key concepts and assessment milestones.</li>
  <li>Audit a scheme of work for stretch, scaffold and exam-board alignment.</li>
  <li>Plan departmental CPD across a term using staff confidence data.</li>
  <li>Draft an exam-board AI position for your department in line with JCQ guidance.</li>
</ol>
<p>More prompts at <a href="https://www.getpromptly.co.uk/prompts/subject-leads">getpromptly.co.uk/prompts/subject-leads</a>.</p>`,
  },

  // ── Learning pathways ──────────────────────────────────────────────────────
  'teacher-learning-pathway': {
    subject: 'Your AI for Teachers learning pathway — GetPromptly',
    html: `<h1>AI for Teachers Starter Path</h1>
<ol>
  <li>Read the DfE AI in Education Guidance.</li>
  <li>Complete a practical teacher AI training module (TeacherMatic, Google AI Essentials).</li>
  <li>Practise prompting for lesson planning, scaffolding and feedback.</li>
  <li>Review what pupil information should not be entered into public AI tools.</li>
</ol>
<p>Full training directory at <a href="https://www.getpromptly.co.uk/ai-training">getpromptly.co.uk/ai-training</a>.</p>`,
  },
  'leader-learning-pathway': {
    subject: 'Your School Leadership AI Readiness pathway — GetPromptly',
    html: `<h1>School Leadership AI Readiness</h1>
<ol>
  <li>Review DfE guidance and current school policy.</li>
  <li>Create a staff acceptable-use position.</li>
  <li>Map risks around safeguarding, data protection and assessment integrity.</li>
  <li>Plan staff CPD by role and confidence level.</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/leaders">getpromptly.co.uk/ai-training/leaders</a>.</p>`,
  },
  'senco-learning-pathway': {
    subject: 'Your SENCO AI Toolkit pathway — GetPromptly',
    html: `<h1>SENCO AI Toolkit</h1>
<ol>
  <li>Review accessible AI and assistive technology guidance.</li>
  <li>Identify low-risk admin workflows to trial first.</li>
  <li>Create staff strategy sheets without entering identifiable pupil data.</li>
  <li>Use AI to support provision mapping, not replace professional judgement.</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/send">getpromptly.co.uk/ai-training/send</a>.</p>`,
  },
  'send-learning-pathway': {
    subject: 'Your Accessible AI for SEND pathway — GetPromptly',
    html: `<h1>Accessible AI for SEND</h1>
<ol>
  <li>Start with NASEN&apos;s SEND-specific AI guidance.</li>
  <li>Review the AbilityNet AI &amp; disability factsheet.</li>
  <li>Complete free Texthelp educator CPD on Read&amp;Write.</li>
  <li>Train staff on Microsoft accessibility AI tools (Immersive Reader, Seeing AI).</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/send">getpromptly.co.uk/ai-training/send</a>.</p>`,
  },
  'parent-learning-pathway': {
    subject: 'Your AI for Parents pathway — GetPromptly',
    html: `<h1>AI Safety for Parents</h1>
<ol>
  <li>Read Internet Matters&apos; AI tools guide for parents.</li>
  <li>Use Parent Zone&apos;s family-friendly AI conversation starters.</li>
  <li>Check Childnet&apos;s deepfake and chatbot guidance.</li>
  <li>Bookmark NSPCC Net Aware for the apps your child uses.</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/parents">getpromptly.co.uk/ai-training/parents</a>.</p>`,
  },
  'student-learning-pathway': {
    subject: 'Your AI Literacy for Students pathway — GetPromptly',
    html: `<h1>AI Literacy for Students</h1>
<ol>
  <li>Complete Elements of AI (free, no maths required).</li>
  <li>Try AI for Everyone on Coursera (free audit available).</li>
  <li>Watch BBC Own It&apos;s AI safety videos.</li>
  <li>Explore Code.org&apos;s AI literacy curriculum.</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/students">getpromptly.co.uk/ai-training/students</a>.</p>`,
  },
  'admin-learning-pathway': {
    subject: 'Your AI Productivity for Admin pathway — GetPromptly',
    html: `<h1>AI Productivity for Admin Teams</h1>
<ol>
  <li>Complete the Microsoft 365 AI for Education training.</li>
  <li>Work through Google Workspace AI for Education.</li>
  <li>Read ISBL&apos;s AI guide for school business operations.</li>
  <li>Review DfE Data Protection in Schools and ICO AI guidance.</li>
</ol>
<p>Full directory at <a href="https://www.getpromptly.co.uk/ai-training">getpromptly.co.uk/ai-training</a>.</p>`,
  },
  'subject-leads-learning-pathway': {
    subject: 'Your Subject Leads AI pathway — GetPromptly',
    html: `<h1>AI for Subject Leads</h1>
<ol>
  <li>Read the DfE AI in Education Guidance.</li>
  <li>Review JCQ and Ofqual AI assessment policy for your subject.</li>
  <li>Audit your scheme of work for AI-aware tasks and assessment integrity.</li>
  <li>Plan a department CPD slot using AIfE&apos;s prompting course.</li>
</ol>
<p>Full directory at <a href="https://www.getpromptly.co.uk/ai-training">getpromptly.co.uk/ai-training</a>.</p>`,
  },
  'safeguarding-learning-pathway': {
    subject: 'Your AI Safeguarding pathway — GetPromptly',
    html: `<h1>AI Safeguarding Path</h1>
<ol>
  <li>Read KCSIE 2024 — annual statutory requirement for all staff.</li>
  <li>Review ThinkUKnow&apos;s AI &amp; deepfake resources.</li>
  <li>Use Safer Internet Centre lesson materials.</li>
  <li>Read IWF and JCQ AI policy guidance.</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/leaders">getpromptly.co.uk/ai-training/leaders</a>.</p>`,
  },
  'policy-learning-pathway': {
    subject: 'Your AI Policy &amp; Governance pathway — GetPromptly',
    html: `<h1>AI Policy &amp; Governance</h1>
<ol>
  <li>Read DfE generative AI guidance.</li>
  <li>Review JCQ AI in assessments and Ofqual integrity guidance.</li>
  <li>Read ICO AI &amp; data protection.</li>
  <li>Use ASCL and AIfE strategy frameworks to draft policy.</li>
</ol>
<p>Full pathway at <a href="https://www.getpromptly.co.uk/ai-training/leaders">getpromptly.co.uk/ai-training/leaders</a>.</p>`,
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Email send helper (Brevo transactional) ──────────────────────────────────

interface BrevoPayload {
  fromEmail: string;
  fromName:  string;
  to:        string;
  replyTo?:  string;
  subject:   string;
  html:      string;
}

async function sendEmail(apiKey: string, payload: BrevoPayload): Promise<void> {
  const res = await fetch(BREVO_SEND_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body:    JSON.stringify({
      sender:      { email: payload.fromEmail, name: payload.fromName },
      to:          [{ email: payload.to }],
      replyTo:     payload.replyTo ? { email: payload.replyTo } : undefined,
      subject:     payload.subject,
      htmlContent: payload.html,
    }),
  });

  if (!res.ok) {
    let errBody = '';
    try { errBody = await res.text(); } catch { /* ignore */ }
    const message = `Brevo send failed (${res.status}) for ${payload.to}: ${errBody.slice(0, 500)}`;
    // eslint-disable-next-line no-console
    console.error('[lead-capture]', message);
    throw new Error(message);
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const email  = String(body.email  ?? '').trim().toLowerCase();
  const offer  = String(body.offer  ?? 'free-prompt-pack').trim();
  const role   = String(body.role   ?? '').trim();
  const page   = String(body.page   ?? '').trim();
  const source = String(body.source ?? '').trim();

  if (!email || !/.+@.+\..+/.test(email)) {
    return json({ error: 'Valid email required' }, 400);
  }

  const apiKey     = process.env.BREVO_API_KEY;
  const fromHeader = process.env.FROM_EMAIL  || FROM_EMAIL_DEFAULT;
  const adminEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL_DEFAULT;

  // Parse "Name <email>" header into separate name/email parts for Brevo.
  const fromMatch = fromHeader.match(/^(.*?)\s*<\s*(.+?)\s*>\s*$/);
  const fromName  = fromMatch ? (fromMatch[1] || 'GetPromptly').trim() : 'GetPromptly';
  const fromEmail = fromMatch ? fromMatch[2].trim() : fromHeader.trim();

  if (!apiKey) {
    // In dev without the key, log and return a soft success so the UI works.
    // eslint-disable-next-line no-console
    console.warn('[lead-capture] BREVO_API_KEY not set — skipping email send (dev mode)');
    return json({ ok: true, note: 'dev mode — no email sent' }, 200);
  }

  const knownOffer = offer in offerContent;
  const content    = knownOffer ? offerContent[offer] : offerContent['free-prompt-pack'];

  try {
    // 1. Send the resource email to the user.
    await sendEmail(apiKey, {
      fromEmail,
      fromName,
      to:      email,
      replyTo: adminEmail,
      subject: content.subject,
      html:    content.html,
    });

    // 2. Send the admin notification.
    await sendEmail(apiKey, {
      fromEmail,
      fromName,
      to:      adminEmail,
      replyTo: email,
      subject: `New GetPromptly lead: ${offer}${knownOffer ? '' : ' (UNKNOWN OFFER)'}`,
      html: `
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Offer:</strong> ${escapeHtml(offer)}${knownOffer ? '' : ' &nbsp;<em>⚠️ Not registered in offerContent — fell back to free-prompt-pack.</em>'}</p>
        <p><strong>Role:</strong> ${escapeHtml(role) || '—'}</p>
        <p><strong>Source:</strong> ${escapeHtml(source) || '—'}</p>
        <p><strong>Page:</strong> ${escapeHtml(page) || '—'}</p>
        <hr />
        <p style="color:#9C9690;font-size:12px;">Sent automatically by api/lead-capture.ts</p>
      `,
    });

    return json({ ok: true }, 200);
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'unknown error';
    // eslint-disable-next-line no-console
    console.error('[lead-capture] email send failed', detail);
    return json(
      {
        ok: false,
        error: 'Email send failed. Please email info@getpromptly.co.uk and we will reply by hand.',
      },
      502,
    );
  }
}

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
