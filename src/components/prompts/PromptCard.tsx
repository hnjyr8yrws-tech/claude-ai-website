import CopyButton from './CopyButton';

interface Props {
  prompt: string;
  packTitle: string;
  index: number;
}

const PromptCard = ({ prompt, index }: Props) => {
  const handleAskAgent = () => {
    const trigger = document.getElementById('promptly-widget-trigger');
    if (trigger) {
      trigger.click();
    }
  };

  return (
    <div
      className="flex gap-3 p-4 rounded-xl border bg-white"
      style={{ borderColor: '#e8e6e0' }}
    >
      {/* Number badge */}
      <div className="flex-shrink-0 pt-0.5">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
          style={{ background: '#e0f5f6', color: '#00808a' }}
        >
          {index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed mb-2" style={{ color: '#1c1a15' }}>
          {prompt}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton text={prompt} size="sm" />
          <button
            onClick={handleAskAgent}
            className="text-[11px] font-medium transition-colors hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a] rounded"
            style={{ color: '#6b6760' }}
          >
            Ask agent to adapt this →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
