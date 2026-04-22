import { useState, useCallback, useRef } from 'react';
import { buildSystemPrompt, AgentRole, AgentMode } from '../api/agent';

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

export function useAgent(role: AgentRole, mode: AgentMode = 'general'): UseAgentReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

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

    const apiMessages = next.map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 350,
          temperature: 0.7,
          system: buildSystemPrompt(role, mode),
          messages: apiMessages,
        }),
      });

      if (!res.ok) {
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
  }, [role, mode]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearMessages };
}
