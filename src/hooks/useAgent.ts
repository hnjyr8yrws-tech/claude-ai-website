import { useState, useCallback, useRef } from 'react';
import { SYSTEM_PROMPTS, AgentRole } from '../api/agent';

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

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

export function useAgent(role: AgentRole): UseAgentReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Keep a ref so sendMessage always reads the latest messages without
  // needing to be recreated on every render.
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const sendMessage = useCallback(async (text: string) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      setError('API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.');
      return;
    }

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    const next = [...messagesRef.current, userMsg];
    setMessages(next);
    setLoading(true);
    setError(null);

    // Build the payload — Anthropic expects [{role, content}] without our internal `id` field.
    const apiMessages = next.map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          // Required when calling the API directly from a browser.
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 300,
          temperature: 0.7,
          system: SYSTEM_PROMPTS[role],
          messages: apiMessages,
        }),
      });

      if (!res.ok) {
        // Try to extract Anthropic's error message; fall back to status code.
        const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
        throw new Error(body?.error?.message ?? `API error ${res.status}`);
      }

      const data = await res.json() as { content?: { text: string }[] };
      const reply = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";

      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [role]); // role change reuses the same function but picks up new system prompt via closure

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
