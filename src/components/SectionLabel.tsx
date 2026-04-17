import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const SectionLabel: FC<Props> = ({ children, className = '' }) => (
  <span
    className={`inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 ${className}`}
    style={{ color: '#00808a' }}
  >
    {children}
  </span>
);

export default SectionLabel;
