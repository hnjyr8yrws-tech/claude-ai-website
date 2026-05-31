interface Props {
  context?: string;
}

const AgentCTA = ({ context }: Props) => {
  const handleClick = () => {
    const trigger = document.getElementById('promptly-widget-trigger');
    if (trigger) trigger.click();
  };

  return (
    <div
      className="rounded-xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ background: 'var(--color-oat)', borderColor: 'var(--color-rule)' }}
    >
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
          Ask Luna to personalise this prompt
        </p>
        {context && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink)' }}>{context}</p>
        )}
      </div>
      <button
        onClick={handleClick}
        className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-promptly-lime)]"
        style={{ background: 'var(--color-ink)', color: 'white' }}
      >
        Ask the AI →
      </button>
    </div>
  );
};

export default AgentCTA;
