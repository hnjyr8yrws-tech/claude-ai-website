/**
 * useBrevo — thin client hook around our own /api/brevo-subscribe route.
 * The Brevo API key never leaves the server; this only calls our endpoint.
 *
 *   const { subscribe, status, error, reset } = useBrevo();
 *   await subscribe({ email, roles: ["Teacher"], source: "website" });
 */

import { useState, useCallback } from "react";

export type BrevoSource = "website" | "agent_widget";
export type BrevoStatus = "idle" | "loading" | "success" | "error";

export interface SubscribeParams {
  email: string;
  roles?: string[];
  source: BrevoSource;
}

export function useBrevo() {
  const [status, setStatus] = useState<BrevoStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async ({ email, roles = [], source }: SubscribeParams): Promise<boolean> => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/brevo-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, roles: roles.join(","), source }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Subscription failed. Please try again.");
      }
      setStatus("success");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { subscribe, status, error, reset };
}
