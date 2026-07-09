/**
 * api/signup.ts
 *
 * Vercel Edge Function — public double-opt-in sign-up intake.
 * Receives the sign-up form POST from the website and securely forwards it to
 * the n8n ingestion webhook (which owns the double-opt-in confirmation email).
 * The n8n URL and shared secret stay server-side and never reach the browser.
 *
 * Called by: src/hooks/useSignup.ts (POST /api/signup)
 *
 * Environment variables (Vercel dashboard — no VITE_ prefix, never client-side):
 *   N8N_SIGNUP_WEBHOOK_URL   ← the n8n webhook to forward to (required in prod)
 *   SIGNUP_WEBHOOK_SECRET    ← optional shared secret, sent as X-Signup-Secret
 */

export const config = { runtime: 'edge' };

interface SignupBody {
  email?: string;
  name?: string;
  role?: string;
  school?: string;
  consent?: boolean;
  source?: string;
  website?: string; // honeypot — must be empty
}

const ALLOWED_ROLES = ['Teacher', 'SLT', 'DSL', 'SENCO', 'Other'];

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Honeypot: a real user never fills this. Silently accept (200) without
  // forwarding, so a bot can't distinguish success from rejection.
  if (body.website && body.website.trim() !== '') {
    return json({ ok: true }, 200);
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!email || !/.+@.+\..+/.test(email)) {
    return json({ error: 'A valid email address is required.' }, 400);
  }

  // Normalise + whitelist the optional fields before forwarding.
  const payload = {
    email,
    name: (body.name ?? '').trim() || undefined,
    role: ALLOWED_ROLES.includes(body.role ?? '') ? body.role : undefined,
    school: (body.school ?? '').trim() || undefined,
    consent: body.consent === true,
    source: body.source || 'website-signup',
    submittedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.N8N_SIGNUP_WEBHOOK_URL;
  if (!webhookUrl) {
    // Dev / unconfigured: don't break the UX, but make the gap obvious server-side.
    console.warn('[signup] N8N_SIGNUP_WEBHOOK_URL not set — accepted without forwarding (dev mode).');
    return json({ ok: true, note: 'dev mode — not forwarded' }, 200);
  }

  try {
    const secret = process.env.SIGNUP_WEBHOOK_SECRET;
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Signup-Secret': secret } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('[signup] n8n responded', res.status);
      return json({ error: 'The sign-up service is temporarily unavailable. Please try again.' }, 502);
    }
    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[signup] forward failed', err);
    return json({ error: 'Could not reach the sign-up service. Please try again later.' }, 502);
  }
}

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
