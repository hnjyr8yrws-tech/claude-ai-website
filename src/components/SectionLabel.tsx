import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Background tone — "light" (cream) shows ink text, "dark" shows lime text */
  variant?: 'light' | 'dark';
}

const SectionLabel: FC<Props> = ({ children, className = '', variant = 'light' }) => {
  const isDark = variant === 'dark';
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase mb-4 ${className}`}
      style={
        isDark
          ? {
              background: 'rgba(190,255,0,0.12)',
              color: '#BEFF00',
              border: '1px solid rgba(190,255,0,0.25)',
            }
          : {
              background: 'rgba(15,28,26,0.06)',
              color: '#0F1C1A',
              border: '1px solid rgba(15,28,26,0.10)',
            }
      }
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: '#BEFF00',
          boxShadow: '0 0 6px #BEFF00',
        }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
};

export default SectionLabel;
