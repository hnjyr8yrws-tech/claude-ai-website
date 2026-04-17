/**
 * api/brevo-subscribe.ts
 *
 * Vercel Edge Function — keeps the Brevo API key server-side only.
 * Deployed automatically by Vercel from the /api directory.
 *
 * Called by: src/hooks/useBrevo.ts (POST /api/brevo-subscribe)
 *
 * Environment variable required in Vercel dashboard:
 *   BREVO_API_KEY   ← no VITE_ prefix — never sent to the browser
 */

export const config = { runtime: 'edge' };

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

// Brevo list IDs — update these to match your actual Brevo lists.
const LIST_IDS: Record<string, number> = {
  website:      2,   // Main newsletter list
  agent_widget: 3,   // Agent widget leads list
};

interface SubscribeBody {
  email:  string;
  roles?: string;   // comma-separated role string, e.g. "Teacher,SLT"
  source: 'website' | 'agent_widget';
}

export default async function handler(request: Request): Promise<Response> {
  // Only accept POST
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // Parse body
  let body: SubscribeBody;
  try {
    body = await request.json() as SubscribeBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { email, roles = '', source = 'website' } = body;

  // Basic email validation
  if (!email || !/.+@.+\..+/.test(email)) {
    return json({ error: 'A valid email address is required.' }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // Fail loudly in development so the missing key is obvious.
    return json({ error: 'BREVO_API_KEY is not configured on the server.' }, 500);
  }

  const listId = LIST_IDS[source] ?? LIST_IDS.website;

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,       // update the contact if they already exist
        attributes: {
          ROLE:   roles,
          SOURCE: source,
        },
      }),
    });

    // 201 = created, 204 = already existed and updated
    if (res.status === 201 || res.status === 204) {
      return json({ success: true }, 200);
    }

    // Brevo returns structured errors
    const error = await res.json().catch(() => ({ message: 'Unknown Brevo error' })) as { message?: string };
    return json({ error: error.message ?? 'Subscription failed. Please try again.' }, res.status);

  } catch (err) {
    return json({ error: 'Could not reach the email service. Please try again later.' }, 502);
  }
}

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
