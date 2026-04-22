interface Props {
  variant: 'pack' | 'bundle';
}

const MonetisationBanner = ({ variant }: Props) => {
  if (variant === 'pack') {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: '#111210' }}
      >
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-widest uppercase mb-1" style={{ color: '#00808a' }}>
            Full Pack
          </p>
          <h3 className="font-display text-xl text-white mb-1">
            Download Full Pack — PDF
          </h3>
          <p className="text-sm" style={{ color: '#6b6760' }}>
            All prompts in this pack as a beautifully formatted, print-ready PDF.
          </p>
          <p className="text-lg font-bold mt-2" style={{ color: 'white' }}>£4.99</p>
        </div>
        <div>
          <button
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] transition-colors"
            style={{ background: '#00808a', color: 'white' }}
            onClick={() => {
              // Coming soon — no backend yet
            }}
          >
            Coming Soon — Join Waitlist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ background: '#111210' }}
    >
      <div className="flex-1">
        <p className="text-[11px] font-semibold tracking-widest uppercase mb-1" style={{ color: '#00808a' }}>
          School Bundle
        </p>
        <h3 className="font-display text-xl text-white mb-1">
          Get All 50 Packs for Your School
        </h3>
        <p className="text-sm" style={{ color: '#6b6760' }}>
          Every prompt pack plus full AI agent access for your whole staff team.
        </p>
        <p className="text-lg font-bold mt-2" style={{ color: 'white' }}>£49/year</p>
      </div>
      <div>
        <button
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a] transition-colors"
          style={{ background: '#00808a', color: 'white' }}
          onClick={() => {
            // Coming soon — no backend yet
          }}
        >
          Coming Soon — Register Interest
        </button>
      </div>
    </div>
  );
};

export default MonetisationBanner;
