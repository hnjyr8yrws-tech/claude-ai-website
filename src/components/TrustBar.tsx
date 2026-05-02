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

const LIME = '#BEFF00';

const TrustBar: FC = () => (
  <div
    className="w-full border-y overflow-hidden"
    style={{
      borderColor: '#ECE7DD',
      background: 'linear-gradient(180deg, #F8F5F0 0%, #ECE7DD 100%)',
    }}
  >
    <div className="flex items-center gap-7 px-6 py-3 overflow-x-auto whitespace-nowrap scrollbar-none">
      {ITEMS.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2 flex-shrink-0">
          {i > 0 && (
            <span
              className="w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: LIME, boxShadow: `0 0 4px ${LIME}` }}
              aria-hidden="true"
            />
          )}
          <span
            className="text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ color: '#1A1A1A' }}
          >
            {item.label}
          </span>
        </span>
      ))}
    </div>
  </div>
);

export default TrustBar;
