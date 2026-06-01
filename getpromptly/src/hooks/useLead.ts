"use client";

// Lead state — remembers (in the browser) that a visitor has given their email.
// Giving an email captures the lead in Brevo AND unlocks all FREE prompts here.
// Premium prompts remain paid regardless (that's gated on tier, not on the lead).
//
// This is intentionally a lightweight client flag, not auth. Replace with a real
// auth/session check when accounts exist.

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "gp_lead_email";
const LEAD_CHANGED = "gp-lead-changed";

function subscribe(callback: () => void): () => void {
  window.addEventListener(LEAD_CHANGED, callback);
  window.addEventListener("storage", callback); // cross-tab
  return () => {
    window.removeEventListener(LEAD_CHANGED, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null; // no lead on the server; hydrates to the real value on the client
}

export function useLead() {
  const leadEmail = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const captureLead = useCallback((email: string) => {
    window.localStorage.setItem(STORAGE_KEY, email);
    window.dispatchEvent(new CustomEvent(LEAD_CHANGED));
  }, []);

  return { leadEmail, hasLead: !!leadEmail, captureLead };
}
