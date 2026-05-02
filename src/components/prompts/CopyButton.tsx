import { useState } from 'react';

interface Props {
  text: string;
  size?: 'sm' | 'md';
  onCopied?: () => void;
}

const CopyButton = ({ text, size = 'md', onCopied }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopied?.();
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopied?.();
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy prompt to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] ${
        isSmall ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${
        copied
          ? 'border-[#BEFF00] bg-[#e0f5f6] text-[#BEFF00]'
          : 'border-[#ECE7DD] bg-white text-[#4A4A4A] hover:border-[#BEFF00] hover:text-[#BEFF00]'
      }`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 4V2.5A.5.5 0 007.5 2h-5a.5.5 0 00-.5.5v5a.5.5 0 00.5.5H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
};

export default CopyButton;
