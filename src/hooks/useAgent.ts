import { useState, useCallback, useRef } from 'react';
import type { AgentRole, AgentMode } from '../api/agent';
import { LUNA_WEBHOOK_URL } from '../config';

// SAFETY: the browser does NOT call any model (Anthropic) directly anymore.
// Every Luna message is POSTed to our server-side n8n webhook, which runs the
// model AND the Donna safety gate before returning a gated answer. No API key
// lives in the client. See src/config.ts → LUNA_WEBHOOK_URL.

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UseAgentReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const FALLBACK = "I'm having trouble connecting right now — please try again in a moment.";

/**
 * Stable anonymous session id for this browser, so the server-side gate (Donna)
 * can thread conversation context per chat. Not auth, no personal data.
 */
function getSessionId(): string {
  const KEY = 'gp_luna_session_id';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (private mode) — fall back to an ephemeral per-load id.
    return crypto.randomUUID();
  }
}

export function useAgent(role: AgentRole, mode: AgentMode = 'general'): UseAgentReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const sessionRef = useRef<string>('');
  if (!sessionRef.current) sessionRef.current = getSessionId();

  const sendMessage = useCallback(async (text: string) => {
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
          message: text,
        }),
      });

      if (!res.ok) throw new Error(`Luna endpoint responded ${res.status}`);

      // n8n response shape: { response, branch, session_id }.
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      const branch = typeof data.branch === 'string' ? data.branch : 'pass';
      const reply =
        (typeof data.response === 'string' && data.response) ||
        (typeof data.message  === 'string' && data.message)  || // tolerated fallback
        '';

      if (!reply) {
        pushFallback();
        return;
      }

      // Branch handling:
      //  - pass            → normal answer (render as-is)
      //  - safety/quality  → gate fallback message (render as-is)
      //  - ask_role        → render the prompt AND surface the role picker
      //  - error           → friendly message from our function (render as-is)
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply },
      ]);

      if (branch === 'ask_role') {
        // The widget listens for this and re-shows the role selector (history kept).
        window.dispatchEvent(new CustomEvent('luna-ask-role'));
      }
    } catch (err) {
      console.warn('[Luna] webhook call failed:', err);
      pushFallback();
    } finally {
      setLoading(false);
    }
  }, [role, mode]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
