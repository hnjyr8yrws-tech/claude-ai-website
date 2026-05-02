interface Props {
  tag: string;
}

const COLOR_MAP: Record<string, { bg: string; color: string }> = {
  Dyslexia: { bg: '#dbeafe', color: '#1d4ed8' },
  ADHD: { bg: '#fef3c7', color: '#92400e' },
  Autism: { bg: '#e0f5f6', color: '#BEFF00' },
  Anxiety: { bg: '#fce7f3', color: '#be185d' },
  Dyscalculia: { bg: '#f3e8ff', color: '#7c3aed' },
  'Executive Dysfunction': { bg: '#fff7ed', color: '#c2410c' },
  'All SEN': { bg: '#f0fdf4', color: '#15803d' },
  'Mixed SEN': { bg: '#f0fdf4', color: '#15803d' },
};

const DEFAULT = { bg: '#f3f4f6', color: '#6b7280' };

const SENBadge = ({ tag }: Props) => {
  const colors = COLOR_MAP[tag] ?? DEFAULT;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: colors.bg, color: colors.color }}
    >
      {tag}
    </span>
  );
};

export default SENBadge;
