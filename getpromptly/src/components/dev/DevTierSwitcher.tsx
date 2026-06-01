// DEV ONLY — replace useTier() with real auth hook before going live
"use client";

import { useEffect, useState, useCallback } from "react";

// STEP 7 — tiers. 0 Anonymous · 1 Free · 2 Premium · 3 School · 4 Trust.
export type Tier = 0 | 1 | 2 | 3 | 4;

const TIER_LABELS: Record<Tier, string> = {
  0: "Anonymous",
  1: "Free",
  2: "Premium",
  3: "School",
  4: "Trust",
};

const STORAGE_KEY = "dev_tier";
const TIER_CHANGED = "dev-tier-changed";

function readTier(): Tier {
  if (typeof window === "undefined") return 0;
  const raw = Number(window.localStorage.getItem(STORAGE_KEY));
  return ([0, 1, 2, 3, 4] as number[]).includes(raw) ? (raw as Tier) : 0;
}

/** Read the current dev tier; re-renders when the switcher changes it. */
export function useTier(): Tier {
  const [tier, setTier] = useState<Tier>(0);

  useEffect(() => {
    setTier(readTier()); // hydrate after mount (avoids SSR/client mismatch)
    const sync = () => setTier(readTier());
    window.addEventListener(TIER_CHANGED, sync);
    window.addEventListener("storage", sync); // cross-tab
    return () => {
      window.removeEventListener(TIER_CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return tier;
}

export default function DevTierSwitcher() {
  // Never ship to production.
  if (process.env.NODE_ENV !== "development") return null;
  return <DevTierSwitcherInner />;
}

function DevTierSwitcherInner() {
  const [tier, setTier] = useState<Tier>(0);

  useEffect(() => setTier(readTier()), []);

  const cycle = useCallback(() => {
    const next = (((tier + 1) % 5) as Tier);
    setTier(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new CustomEvent(TIER_CHANGED));
  }, [tier]);

  return (
    <button
      onClick={cycle}
      className="fixed bottom-4 right-4 z-50 font-mono rounded-full border px-4 py-2 shadow-lg"
      style={{
        background: "var(--color-ground-black)",
        color: "var(--color-promptly-lime)",
        borderColor: "var(--color-promptly-lime)",
        fontSize: 12,
      }}
      title="Dev tier switcher — cycles access tier"
    >
      Tier {tier} · {TIER_LABELS[tier]}
    </button>
  );
}
