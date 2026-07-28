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
 *   SIGNUP_INGEST_URL      ← the n8n ingest webhook to forward to (required in prod)
 *                            (falls back to legacy N8N_SIGNUP_WEBHOOK_URL if present)
 *   SIGNUP_INGEST_SECRET   ← optional shared secret, sent as the X-Signup-Secret header
 *                            (falls back to legacy SIGNUP_WEBHOOK_SECRET)
 */

export const config = { runtime: 'edge' };

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Simple in-memory limiter for THIS route: max RATE_LIMIT requests per
// RATE_WINDOW_MS, per client IP. To change the policy, edit the two constants
// below — nothing else. In-memory means the counter resets on cold starts and is
// per edge instance (not globally shared): acceptable as basic abuse protection.
// For strict, globally-consistent limits, swap `rateStore` for a shared store
// (e.g. Upstash Redis / Vercel KV) behind the same checkRateLimit() signature.
const RATE_LIMIT = 5; // max requests per window, per IP
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_TRACKED_IPS = 10_000; // memory guard — prune expired entries above this

const rateStore = new Map<string, { count: number; resetAt: number }>();

/** Client IP: first entry of x-forwarded-for (Vercel sets it), else x-real-ip. */
function getClientIp(request: Request): string {
  const first = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip') || 'unknown';
}

/** Fixed-window counter. Returns retryAfter (seconds) when the IP is over-limit. */
function checkRateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  // Opportunistic memory guard: prune expired entries once the map grows large.
  if (rateStore.size > MAX_TRACKED_IPS) {
    for (const [key, e] of rateStore) if (e.resetAt <= now) rateStore.delete(key);
  }
  let entry = rateStore.get(ip);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateStore.set(ip, entry);
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT) {
    return { limited: true, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  return { limited: false, retryAfter: 0 };
}

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

  // Rate limit before any work (see the constants at the top of this file):
  // 5 requests per 10 minutes per IP → 429 with a Retry-After header.
  const { limited, retryAfter } = checkRateLimit(getClientIp(request));
  if (limited) {
    return json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': String(retryAfter) });
  }

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

  // Canonical env name is SIGNUP_INGEST_URL; keep the legacy name as a fallback so
  // whichever one ops configured is honoured.
  const webhookUrl = process.env.SIGNUP_INGEST_URL ?? process.env.N8N_SIGNUP_WEBHOOK_URL;
  if (!webhookUrl) {
    // Dev / unconfigured: don't break the UX, but make the gap obvious server-side.
    console.warn('[signup] SIGNUP_INGEST_URL not set — accepted without forwarding (dev mode).');
    return json({ ok: true, note: 'dev mode — not forwarded' }, 200);
  }

  try {
    const secret = process.env.SIGNUP_INGEST_SECRET ?? process.env.SIGNUP_WEBHOOK_SECRET;
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
    // Surface the real reason (DNS/TLS/timeout/unreachable) to the Vercel logs so
    // an upstream reachability problem is diagnosable — the user still gets a
    // generic message. A thrown fetch means the upstream never responded.
    console.error('[signup] forward failed:', err instanceof Error ? err.message : err);
    return json({ error: 'Could not reach the sign-up service. Please try again later.' }, 502);
  }
}

function json(body: object, status: number, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
