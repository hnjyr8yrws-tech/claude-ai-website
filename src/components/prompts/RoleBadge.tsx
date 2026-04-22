interface Props {
  role: string;
}

const RoleBadge = ({ role }: Props) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
    style={{ background: '#e0f5f6', color: '#00808a' }}
  >
    {role}
  </span>
);

export default RoleBadge;
