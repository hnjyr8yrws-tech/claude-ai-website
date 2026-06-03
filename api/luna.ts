/**
 * api/luna.ts
 *
 * Vercel Edge Function — server-side proxy for the Luna chat widget.
 *
 *   Browser → /api/luna (this function) → n8n webhook → (Luna + Donna gate)
 *
 * Why this exists: the n8n webhook is protected by a shared secret. That secret
 * must NEVER reach the browser, so the widget calls this same-origin function,
 * and this function adds the secret header server-side before forwarding.
 *
 * Environment variable (Vercel → Settings → Environment Variables):
 *   LUNA_WEBHOOK_SECRET   ← sent as the `X-Luna-Secret` header. SERVER-ONLY.
 *   It MUST NOT be prefixed VITE_ or NEXT_PUBLIC_ (those are exposed to the
 *   browser). It is read here only via process.env and never returned to the client.
 *
 * Called by: src/hooks/useAgent.ts (POST /api/luna)
 */

export const config = { runtime: 'edge' };

// The protected n8n Luna webhook (public Tailscale Funnel HTTPS endpoint).
const N8N_LUNA_URL = 'https://chloes-mac-mini.taild26d43.ts.net/webhook/luna-chat';

// n8n + the model + the Donna gate can take a few seconds; bound it.
const TIMEOUT_MS = 25_000;

// Friendly response shape the widget already knows how to render.
const FRIENDLY_ERROR = {
  response: "I'm having trouble connecting right now — please try again in a moment.",
  branch: 'error',
};

interface LunaBody {
  session_id?: string;
  role?: string;
  message?: string;
  email?: string;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: LunaBody;
  try {
    body = (await request.json()) as LunaBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Secret is read ONLY here, server-side. Never logged, never returned.
  const secret = process.env.LUNA_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[luna] LUNA_WEBHOOK_SECRET is not configured on the server');
    return json(FRIENDLY_ERROR, 200);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(N8N_LUNA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Luna-Secret': secret,
      },
      body: JSON.stringify({
        session_id: body.session_id,
        role: body.role,
        message: body.message,
        ...(body.email ? { email: body.email } : {}),
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      console.error('[luna] n8n responded', upstream.status);
      return json(FRIENDLY_ERROR, 200);
    }

    // Pass the n8n JSON ({ response, branch, session_id }) straight back.
    const data = await upstream.json().catch(() => null);
    if (!data) return json(FRIENDLY_ERROR, 200);
    return json(data, 200);
  } catch (err) {
    // Includes timeout (AbortError) and network failures.
    console.error('[luna] proxy error:', err instanceof Error ? err.name : err);
    return json(FRIENDLY_ERROR, 200);
  } finally {
    clearTimeout(timer);
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
