/**
 * AgentCTACard — Large, prominent contextual agent CTA for key pages.
 *
 * Each page passes its own headline, description, and suggested prompts.
 * Clicking the main CTA or a suggested prompt opens the agent widget
 * with the prompt pre-filled via the 'agent-send-starter' custom event.
 */

import { motion } from 'framer-motion';
import { track } from '../utils/analytics';
import { BubbleLayer } from './Bubbles';

const DARK = '#0F1C1A';
const DARK_2 = '#142522';
const LIME = '#BEFF00';
const TEXT_DIM = 'rgba(255,255,255,0.55)';
const TEXT_FAINT = 'rgba(255,255,255,0.32)';

interface AgentCTACardProps {
  /** Section label shown above headline */
  section: string;
  /** Main headline, e.g. "Tell us your role and we'll shortlist 3 safe tools." */
  headline: string;
  /** Supporting description text */
  description?: string;
  /** Up to 4 suggested prompts shown as clickable pills */
  prompts: string[];
  /** Analytics section name */
  analyticsSection: string;
  /** Optional: pre-select a role when opening */
  defaultRole?: string;
}

function openAgent() {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
}

function openAgentWithPrompt(prompt: string) {
  window.dispatchEvent(new CustomEvent('open-agent-chat'));
  // Small delay so the widget opens and listener is ready
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('agent-send-starter', { detail: prompt }));
  }, 100);
}

export default function AgentCTACard({
  section,
  headline,
  description,
  prompts,
  analyticsSection,
}: AgentCTACardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative overflow-hidden rounded-[22px]"
      style={{
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 48px rgba(15,28,26,0.18), 0 0 0 1px rgba(190,255,0,0.10)',
      }}
    >
      {/* Dark header area with bubbles */}
      <div className="relative px-6 py-8 sm:py-10 overflow-hidden" style={{ background: `linear-gradient(180deg, ${DARK_2} 0%, ${DARK} 100%)` }}>
        <BubbleLayer
          bubbles={[
            { variant: 'soft-lime', size: 240, top: '-30%', right: '-10%', anim: 'gp-float-a' },
            { variant: 'soft-cyan', size: 200, bottom: '-30%', left: '-10%', anim: 'gp-float-b' },
          ]}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: DARK_2,
                border: '1px solid rgba(190,255,0,0.30)',
                boxShadow: '0 0 0 1px rgba(190,255,0,0.20), 0 8px 20px rgba(0,0,0,0.40)',
              }}
            >
              {/* Chat bubble icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path
                  d="M14 3C7.38 3 2 7.48 2 13c0 2.88 1.34 5.46 3.5 7.3L4 27l6.94-3A13.4 13.4 0 0014 25c6.62 0 12-4.48 12-11S20.62 3 14 3Z"
                  fill={LIME}
                  opacity="0.95"
                />
                <circle cx="9" cy="13" r="1.5" fill={DARK} />
                <circle cx="14" cy="13" r="1.5" fill={DARK} />
                <circle cx="19" cy="13" r="1.5" fill={DARK} />
              </svg>
            </div>
            {/* Online indicator */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="relative flex-shrink-0">
                <span className="w-2 h-2 rounded-full block" style={{ background: LIME, boxShadow: `0 0 6px ${LIME}` }} />
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: TEXT_DIM }}>Online 24/7</span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: LIME }}>
              {section}
            </p>
            <h2 className="font-display text-xl sm:text-2xl leading-tight mb-2" style={{ color: 'white' }}>
              {headline}
            </h2>
            {description && (
              <p className="text-sm leading-relaxed max-w-lg" style={{ color: TEXT_DIM }}>
                {description}
              </p>
            )}

            {/* Main CTA button */}
            <button
              onClick={() => {
                track({ name: 'agent_opened', section: analyticsSection });
                openAgent();
              }}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
              style={{
                background: `linear-gradient(180deg, #D6FF4A 0%, ${LIME} 100%)`,
                color: DARK,
                border: '1px solid rgba(15,28,26,0.16)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 1C4.13 1 1 3.69 1 7c0 1.66.77 3.16 2 4.23L2 15l4-1.73c.63.15 1.3.23 2 .23 3.87 0 7-2.69 7-6S11.87 1 8 1Z"
                  fill={DARK}
                />
              </svg>
              Ask Promptly AI
            </button>
          </div>
        </div>
      </div>

      {/* Suggested prompts strip */}
      {prompts.length > 0 && (
        <div
          className="relative px-6 py-4"
          style={{
            background: 'rgba(0,0,0,0.30)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: TEXT_FAINT }}>
            Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map(p => (
              <button
                key={p}
                onClick={() => {
                  track({ name: 'agent_opened', section: `${analyticsSection}-starter` });
                  track({ name: 'agent_contextual_prompt_clicked', prompt: p, section: analyticsSection });
                  openAgentWithPrompt(p);
                }}
                className="text-left text-xs leading-relaxed px-3 py-2 rounded-xl border transition-all hover:border-[#BEFF00] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                style={{ borderColor: 'rgba(255,255,255,0.10)', color: TEXT_DIM, background: 'transparent' }}
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
