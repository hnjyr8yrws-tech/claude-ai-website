interface Props {
  tag: string;
}

const COLOR_MAP: Record<string, { bg: string; color: string }> = {
  Dyslexia: { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  ADHD: { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  Autism: { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  Anxiety: { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  Dyscalculia: { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  'Executive Dysfunction': { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  'All SEN': { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
  'Mixed SEN': { bg: 'var(--color-oat)', color: 'var(--color-ink)' },
};

const DEFAULT = { bg: 'var(--color-oat)', color: 'var(--color-ink)' };

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
