/**
 * api/lead-capture.ts
 *
 * Vercel Edge Function — lead capture endpoint.
 * Sends a resource email to the user and an admin notification to info@getpromptly.co.uk.
 *
 * Uses Brevo (same provider as brevo-subscribe.ts) for transactional email.
 * Alternatively, swap the sendEmail() call for Resend, Postmark or SendGrid.
 *
 * Required environment variables in Vercel dashboard:
 *   BREVO_API_KEY          ← Brevo API key (server-side only, no VITE_ prefix)
 *   FROM_EMAIL             ← "GetPromptly <info@getpromptly.co.uk>" (optional, has default)
 *   ADMIN_EMAIL            ← info@getpromptly.co.uk (optional, has default)
 *
 * DNS setup required before email delivery works:
 *   1. Verify getpromptly.co.uk in Brevo
 *   2. Add the SPF, DKIM and DMARC records Brevo provides
 *   3. Test each offer type before launch
 */

export const config = { runtime: 'edge' };

const FROM_EMAIL  = 'GetPromptly <info@getpromptly.co.uk>';
const ADMIN_EMAIL = 'info@getpromptly.co.uk';
const BREVO_SEND_URL = 'https://api.brevo.com/v3/smtp/email';

// ─── Offer content ────────────────────────────────────────────────────────────

interface OfferContent { subject: string; html: string }

const offerContent: Record<string, OfferContent> = {
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
<p>To discuss your school's specific context, use the consultation request on <a href="https://www.getpromptly.co.uk/schools#consultation">getpromptly.co.uk/schools</a>.</p>`,
  },
  'equipment-shortlist': {
    subject: 'Your GetPromptly equipment shortlist',
    html: `<h1>Your equipment shortlist</h1>
<p>Thank you for your interest. Our team will send a tailored equipment shortlist to this address shortly.</p>
<p>In the meantime, browse the full directory at <a href="https://www.getpromptly.co.uk/ai-equipment">getpromptly.co.uk/ai-equipment</a>.</p>
<p>Questions? Reply to this email or contact <a href="mailto:info@getpromptly.co.uk">info@getpromptly.co.uk</a>.</p>`,
  },
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
</ol>`,
  },
  'senco-learning-pathway': {
    subject: 'Your SENCO AI Toolkit pathway — GetPromptly',
    html: `<h1>SENCO AI Toolkit</h1>
<ol>
  <li>Review accessible AI and assistive technology guidance.</li>
  <li>Identify low-risk admin workflows to trial first.</li>
  <li>Create staff strategy sheets without entering identifiable pupil data.</li>
  <li>Use AI to support provision mapping, not replace professional judgement.</li>
</ol>`,
  },
};

// ─── Email send helper (Brevo transactional) ──────────────────────────────────

async function sendEmail(apiKey: string, payload: {
  to: string; replyTo?: string; subject: string; html: string;
}): Promise<boolean> {
  const res = await fetch(BREVO_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      sender:  { email: 'info@getpromptly.co.uk', name: 'GetPromptly' },
      to:      [{ email: payload.to }],
      replyTo: payload.replyTo ? { email: payload.replyTo } : undefined,
      subject: payload.subject,
      htmlContent: payload.html,
    }),
  });
  return res.ok;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const email  = String(body.email  ?? '').trim().toLowerCase();
  const offer  = String(body.offer  ?? 'free-prompt-pack').trim();
  const role   = String(body.role   ?? '').trim();
  const page   = String(body.page   ?? '').trim();

  if (!email || !/.+@.+\..+/.test(email)) {
    return json({ error: 'Valid email required' }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // In dev without the key, log and return a soft success so the UI works
    console.warn('[lead-capture] BREVO_API_KEY not set — skipping email send');
    return json({ ok: true, note: 'dev mode — no email sent' }, 200);
  }

  const content = offerContent[offer] ?? offerContent['free-prompt-pack'];

  try {
    // 1. Send resource email to the user
    await sendEmail(apiKey, {
      to:      email,
      replyTo: ADMIN_EMAIL,
      subject: content.subject,
      html:    content.html,
    });

    // 2. Send admin notification
    await sendEmail(apiKey, {
      to:      ADMIN_EMAIL,
      replyTo: email,
      subject: `New GetPromptly lead: ${offer}`,
      html:    `<p><strong>Email:</strong> ${email}</p><p><strong>Offer:</strong> ${offer}</p><p><strong>Role:</strong> ${role || '—'}</p><p><strong>Page:</strong> ${page || '—'}</p>`,
    });

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[lead-capture] email send failed', err);
    return json({ error: 'Email send failed' }, 500);
  }
}

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
