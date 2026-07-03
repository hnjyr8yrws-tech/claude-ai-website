import { useState, useCallback, useRef } from 'react';
import type { AgentRole, AgentMode, LunaIntent } from '../api/agent';
import { LUNA_WEBHOOK_URL } from '../config';

// SAFETY: the browser does NOT call any model (Anthropic) directly anymore.
// Every Luna message is POSTed to our server-side n8n webhook, which runs the
// model AND the Donna safety gate before returning a gated answer. No API key
// lives in the client. See src/config.ts → LUNA_WEBHOOK_URL.

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Optional structured trust payload from n8n — preferred over text detection. */
  tools?: { slug: string }[];
}

interface UseAgentReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const FALLBACK = "I'm having trouble connecting right now — please try again in a moment.";
const SESSION_KEY = 'gp_luna_session_id';

/**
 * Stable anonymous session id for the chat. Generated once, persisted, and the
 * SAME id is reused for every turn so the server-side gate (Donna) keeps memory.
 * If the server returns a canonical session_id we adopt it (see sendMessage).
 * Not auth, no personal data.
 */
function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (private mode) — fall back to an ephemeral per-load id.
    return crypto.randomUUID();
  }
}

/** Compact one-line context prefix for the first message (so today's model reads it). */
function formatIntent(intent: LunaIntent): string {
  const parts: string[] = [];
  if (intent.yearGroup) parts.push(`Year group: ${intent.yearGroup}`);
  if (intent.concern) parts.push(`Main concern: ${intent.concern}`);
  return parts.length ? `[Context — ${parts.join('; ')}]` : '';
}

export function useAgent(role: AgentRole, mode: AgentMode = 'general', intent?: LunaIntent | null): UseAgentReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const sessionRef = useRef<string>('');
  if (!sessionRef.current) sessionRef.current = getSessionId();

  const sendMessage = useCallback(async (text: string) => {
    // Intent context (from the pre-chat entry): sent to n8n as a structured field
    // every turn, and prepended to the FIRST user message so the current model sees
    // it without a backend change (n8n keeps session memory). The displayed bubble
    // stays clean — the prefix only goes to the wire. Computed before adding the msg.
    const isFirstUserMessage = messagesRef.current.every((m) => m.role !== 'user');
    const intentPrefix = intent ? formatIntent(intent) : '';
    const outgoing = isFirstUserMessage && intentPrefix ? `${intentPrefix}\n\n${text}` : text;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    const pushFallback = () =>
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: FALLBACK }]);

    // Placeholder URL not set yet (awaiting the n8n session) → fail gracefully.
    if (!LUNA_WEBHOOK_URL) {
      console.warn('[Luna] LUNA_WEBHOOK_URL is not configured — set it in src/config.ts');
      pushFallback();
      setLoading(false);
      return;
    }

    try {
      // Same-origin call to our own /api/luna function (it adds the secret header
      // and forwards to n8n). Request shape: { session_id, role, message }.
      const res = await fetch(LUNA_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionRef.current,
          role,
          message: outgoing,
          ...(intent ? { intent } : {}),
        }),
      });

      if (!res.ok) throw new Error(`Luna endpoint responded ${res.status}`);

      // n8n response shape: { response, branch, session_id }.
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

      // CONTINUITY: adopt the session_id the server returns and reuse it on every
      // following turn, so the whole conversation stays on ONE session (memory).
      const returnedSession = typeof data.session_id === 'string' ? data.session_id.trim() : '';
      if (returnedSession) {
        sessionRef.current = returnedSession;
        try { localStorage.setItem(SESSION_KEY, returnedSession); } catch { /* storage blocked */ }
      }

      const reply =
        (typeof data.response === 'string' && data.response) ||
        (typeof data.message  === 'string' && data.message)  || // tolerated fallback
        '';

      if (!reply) {
        pushFallback();
        return;
      }

      // Every branch (pass / safety / quality / ask_role / error) renders its
      // message text as-is and APPENDS to the existing thread. We deliberately no
      // longer tear the chat down to the role picker on ask_role — that broke
      // continuity (composer vanished, conversation reset). The gate's ask_role
      // prompt now shows as a normal message; the user can answer inline or use
      // the "Switch role" button.
      // Structured trust payload (optional): n8n may return tools:[{slug}] so the
      // client can render a fail-closed trust stamp from a reliable source. Absent
      // today → <LunaMessageTrust> falls back to conservative text detection.
      const rawTools = data.tools;
      const tools = Array.isArray(rawTools)
        ? rawTools
            .map((t) =>
              t && typeof t === 'object' && 'slug' in t && typeof (t as { slug: unknown }).slug === 'string'
                ? { slug: (t as { slug: string }).slug }
                : null,
            )
            .filter((t): t is { slug: string } => t !== null)
        : undefined;

      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply, tools },
      ]);
    } catch (err) {
      console.warn('[Luna] webhook call failed:', err);
      pushFallback();
    } finally {
      setLoading(false);
    }
  }, [role, mode, intent]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
