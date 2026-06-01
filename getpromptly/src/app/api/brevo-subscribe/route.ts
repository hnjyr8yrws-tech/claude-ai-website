/**
 * POST /api/brevo-subscribe
 *
 * Next.js Route Handler — keeps the Brevo API key server-side only.
 * Mirrors the Vite app's api/brevo-subscribe.ts edge function.
 *
 * Called by: src/hooks/useBrevo.ts
 *
 * Environment variable (set in Vercel / .env.local, never exposed to the browser):
 *   BREVO_API_KEY
 */

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

// Brevo list IDs — keep in sync with the actual Brevo lists.
const LIST_IDS: Record<string, number> = {
  website: 2, // Main newsletter list
  agent_widget: 3, // Agent widget leads list
};

interface SubscribeBody {
  email: string;
  roles?: string; // comma-separated role string, e.g. "Teacher,SENCO"
  source?: "website" | "agent_widget";
}

function json(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request): Promise<Response> {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { email, roles = "", source = "website" } = body;

  if (!email || !/.+@.+\..+/.test(email)) {
    return json({ error: "A valid email address is required." }, 400);
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    // In development without the key, return a soft success so the UI flow can
    // be exercised. In production a missing key is a hard error.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[brevo-subscribe] BREVO_API_KEY not set — dev soft success, no contact created");
      return json({ success: true, note: "dev mode — no contact created" }, 200);
    }
    return json({ error: "BREVO_API_KEY is not configured on the server." }, 500);
  }

  const listId = LIST_IDS[source] ?? LIST_IDS.website;

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true, // update the contact if they already exist
        attributes: { ROLE: roles, SOURCE: source },
      }),
    });

    // 201 = created, 204 = already existed and updated
    if (res.status === 201 || res.status === 204) {
      return json({ success: true }, 200);
    }

    const error = (await res.json().catch(() => ({ message: "Unknown Brevo error" }))) as { message?: string };
    return json({ error: error.message ?? "Subscription failed. Please try again." }, res.status);
  } catch {
    return json({ error: "Could not reach the email service. Please try again later." }, 502);
  }
}
