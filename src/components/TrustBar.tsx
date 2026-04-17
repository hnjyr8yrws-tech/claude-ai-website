import { FC } from 'react';

const ITEMS = [
  { label: 'KCSIE 2025 Aligned' },
  { label: 'GDPR Compliant' },
  { label: 'ICO Registered' },
  { label: '100% Independent' },
  { label: 'UK Education Focused' },
  { label: 'No Paid Placements' },
  { label: 'Built by Educators' },
];

const TrustBar: FC = () => (
  <div
    className="w-full border-y overflow-hidden"
    style={{ borderColor: '#e8e6e0', background: '#f0eeea' }}
  >
    <div className="flex items-center gap-8 px-6 py-3 overflow-x-auto whitespace-nowrap scrollbar-none">
      {ITEMS.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2 flex-shrink-0">
          {i > 0 && (
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#c5c2bb' }} />
          )}
          <span
            className="text-[11px] font-semibold tracking-wide uppercase"
            style={{ color: '#6b6760' }}
          >
            {item.label}
          </span>
        </span>
      ))}
    </div>
  </div>
);

export default TrustBar;
