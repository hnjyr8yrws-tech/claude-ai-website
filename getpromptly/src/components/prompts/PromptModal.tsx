"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Lock, Copy, Check, X } from "lucide-react";
import type { PromptEntry } from "@/lib/prompts-data";
import type { Tier } from "@/components/dev/DevTierSwitcher";
import { audienceColor } from "@/lib/audience-colors";
import EmailCapture from "@/components/prompts/EmailCapture";
import { useLead } from "@/hooks/useLead";
import { PREMIUM_CHECKOUT_URL } from "@/config";

const INK = "var(--color-ink)";

interface Props {
  prompt: PromptEntry | null;
  tier: Tier;
  onClose: () => void;
}

const LIME = "var(--color-promptly-lime)";
const OAT = "var(--color-oat)";
const FOG = "var(--color-fog)";
const RULE = "var(--color-rule)";
const GROUND = "var(--color-ground-black)";

/** Wrap every [SQUARE BRACKET] token in a lime <mark>. */
function highlightTokens(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <mark key={i} style={{ color: LIME, background: "transparent" }}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
      style={{ fontSize: 11, border: `1px solid ${RULE}`, color: color ?? FOG }}
    >
      {children}
    </span>
  );
}

export default function PromptModal({ prompt, tier, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const { hasLead, captureLead } = useLead();

  // Close on ESC.
  useEffect(() => {
    if (!prompt) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [prompt, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!prompt) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [prompt]);

  if (!prompt) return null;

  // Access model: a captured email (lead) unlocks all FREE prompts; Premium stays
  // paid (Tier 2+). Copying remains a Tier 2+ benefit.
  const isPremium = prompt.access === "Premium";
  const canReadFree = tier >= 1 || hasLead;
  const premiumLocked = isPremium && tier < 2;
  const freeGated = !isPremium && !canReadFree;
  const canCopy = tier >= 2 && !premiumLocked;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={prompt.title}
    >
      <div
        className="max-w-2xl w-full max-h-[85vh] overflow-auto rounded-2xl p-8"
        style={{ background: "var(--color-surface-dark)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono" style={{ fontSize: 12, color: FOG }}>{prompt.id}</p>
            <h2 className="font-serif mt-1" style={{ fontSize: 24, color: OAT }}>{prompt.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex-shrink-0 p-1 rounded hover:opacity-70" style={{ color: FOG }}>
            <X size={20} />
          </button>
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Chip color={audienceColor(prompt.audience)}>
            <span className="w-2 h-2 rounded-full" style={{ background: audienceColor(prompt.audience) }} />
            {prompt.audience}
          </Chip>
          {prompt.keyStage && <Chip>{prompt.keyStage}</Chip>}
          {prompt.subject && <Chip>{prompt.subject}</Chip>}
          {prompt.sendTag && prompt.sendTag !== "None" && (
            <span className="font-mono rounded-full px-2.5 py-0.5" style={{ fontSize: 11, background: "rgb(245 158 11 / 0.2)", color: "rgb(251 191 36)" }}>
              {prompt.sendTag}
            </span>
          )}
          {prompt.complianceTags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          <Chip color={prompt.access === "Premium" ? LIME : FOG}>{prompt.access}</Chip>
        </div>

        {/* Prompt body / gating */}
        <div className="mt-6">
          {premiumLocked ? (
            <div className="text-center">
              <div className="flex justify-center mb-3" style={{ color: LIME }}>
                <Lock size={28} />
              </div>
              <p className="font-sans" style={{ color: OAT }}>
                This is a Premium prompt — £5.99/month unlocks 500+ reviewed prompts.
              </p>
              <div className="mt-4">
                {PREMIUM_CHECKOUT_URL ? (
                  <a
                    href={PREMIUM_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full px-6 py-2.5 font-sans"
                    style={{ fontSize: 14, fontWeight: 600, background: LIME, color: INK }}
                  >
                    Buy Premium →
                  </a>
                ) : (
                  <button
                    disabled
                    title="Checkout link not configured yet — set PREMIUM_CHECKOUT_URL in src/config.ts"
                    className="inline-flex items-center rounded-full px-6 py-2.5 font-sans cursor-not-allowed opacity-60"
                    style={{ fontSize: 14, fontWeight: 600, background: LIME, color: INK }}
                  >
                    Buy Premium →
                  </button>
                )}
              </div>
              <p className="font-sans mt-5" style={{ color: FOG, fontSize: 13 }}>
                Not ready to buy? Leave your email and we&apos;ll keep you posted.
              </p>
              <EmailCapture
                ctaLabel="Email me about Premium"
                roles={[prompt.audience, "Premium interest"]}
                onSuccess={captureLead}
                successText="Thanks — you're on the list."
              />
            </div>
          ) : freeGated ? (
            <div className="text-center">
              <pre
                aria-hidden="true"
                className="font-mono text-sm rounded-xl p-4 overflow-hidden blur-sm select-none text-left whitespace-pre-wrap"
                style={{ color: OAT, background: GROUND }}
              >
                {prompt.prompt.slice(0, 280)}
              </pre>
              <p className="font-sans mt-4" style={{ color: OAT }}>Enter your email to read this prompt — free.</p>
              <p className="font-sans mt-1" style={{ color: FOG, fontSize: 13 }}>
                We&apos;ll add you to our list so we can share new prompts. Unsubscribe anytime.
              </p>
              <EmailCapture
                ctaLabel="Unlock this prompt"
                roles={[prompt.audience]}
                onSuccess={captureLead}
                successText="Unlocking…"
              />
            </div>
          ) : (
            <>
              <pre className="font-mono text-sm rounded-xl p-4 overflow-auto whitespace-pre-wrap" style={{ color: OAT, background: GROUND }}>
                <code>{highlightTokens(prompt.prompt)}</code>
              </pre>
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={copy}
                  disabled={!canCopy}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans transition-opacity disabled:opacity-40"
                  style={{ fontSize: 14, fontWeight: 500, background: LIME, color: "var(--color-ink)" }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy to clipboard"}
                </button>
                <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full px-5 py-2.5 font-sans border" style={{ fontSize: 14, color: OAT, borderColor: RULE }}>
                  Open in ChatGPT
                </a>
                <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full px-5 py-2.5 font-sans border" style={{ fontSize: 14, color: OAT, borderColor: RULE }}>
                  Open in Claude
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
