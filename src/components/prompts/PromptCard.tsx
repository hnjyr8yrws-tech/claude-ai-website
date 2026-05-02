import CopyButton from './CopyButton';
import type { StructuredPrompt } from '../../data/prompts';

const LEVEL_STYLES: Record<string, { bg: string; color: string }> = {
  Beginner: { bg: '#e0f5f6', color: '#BEFF00' },
  Intermediate: { bg: '#fef3c7', color: '#92400e' },
  Advanced: { bg: '#fae8ff', color: '#7c3aed' },
};

interface Props {
  prompt: string | StructuredPrompt;
  packTitle: string;
  index: number;
  onCopy?: () => void;
}

const PromptCard = ({ prompt, index, onCopy }: Props) => {
  const isStructured = typeof prompt !== 'string';
  const copyText = isStructured ? prompt.prompt : prompt;

  const handleAskAgent = () => {
    const trigger = document.getElementById('promptly-widget-trigger');
    if (trigger) {
      trigger.click();
    }
  };

  if (!isStructured) {
    return (
      <div
        className="flex gap-3 p-4 rounded-xl border bg-white"
        style={{ borderColor: '#ECE7DD' }}
      >
        <div className="flex-shrink-0 pt-0.5">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
            style={{ background: '#e0f5f6', color: '#BEFF00' }}
          >
            {index + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#1A1A1A' }}>
            {prompt}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={prompt} size="sm" onCopied={onCopy} />
            <button
              onClick={handleAskAgent}
              className="text-[11px] font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BEFF00] rounded"
              style={{ color: '#4A4A4A' }}
            >
              Ask agent to adapt this &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  const levelStyle = LEVEL_STYLES[prompt.level] ?? LEVEL_STYLES.Beginner;

  return (
    <div
      className="rounded-xl border bg-white overflow-hidden"
      style={{ borderColor: '#ECE7DD' }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <span
          className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold mt-0.5"
          style={{ background: '#e0f5f6', color: '#BEFF00' }}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>
              {prompt.title}
            </h3>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: levelStyle.bg, color: levelStyle.color }}
            >
              {prompt.level}
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>
            Best for: {prompt.bestFor}
          </p>
        </div>
      </div>

      {/* Prompt text */}
      <div className="px-4 pb-3">
        <div
          className="rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap"
          style={{ background: '#F8F5F0', color: '#1A1A1A' }}
        >
          {prompt.prompt}
        </div>
      </div>

      {/* Variables */}
      {prompt.variables.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
              Fill in:
            </span>
            {prompt.variables.map((v) => (
              <span
                key={v}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{ background: '#fef3c7', color: '#92400e' }}
              >
                [{v}]
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Safeguarding note */}
      {prompt.safeguarding && (
        <div className="px-4 pb-2">
          <p className="text-[11px] leading-relaxed rounded-lg px-3 py-2" style={{ background: '#fef2f2', color: '#991b1b' }}>
            <strong>Safeguarding:</strong> {prompt.safeguarding}
          </p>
        </div>
      )}

      {/* Expected output */}
      <div className="px-4 pb-2">
        <p className="text-[11px] leading-relaxed" style={{ color: '#4A4A4A' }}>
          <strong style={{ color: '#1A1A1A' }}>Expected output:</strong> {prompt.expectedOutput}
        </p>
      </div>

      {/* Follow-up */}
      {prompt.followUp && (
        <div className="px-4 pb-2">
          <p className="text-[11px] leading-relaxed" style={{ color: '#4A4A4A' }}>
            <strong style={{ color: '#BEFF00' }}>Follow-up:</strong> {prompt.followUp}
          </p>
        </div>
      )}

      {/* Tools + actions */}
      <div className="px-4 pb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-1.5">
          {prompt.tools.map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
              style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
            >
              {tool}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton text={copyText} size="sm" onCopied={onCopy} />
          <button
            onClick={handleAskAgent}
            className="text-[11px] font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BEFF00] rounded"
            style={{ color: '#4A4A4A' }}
          >
            Ask agent to adapt this &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
