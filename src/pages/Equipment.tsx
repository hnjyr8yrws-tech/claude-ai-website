import { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/SectionLabel';
import SEO from '../components/SEO';

const TEAL = '#00808a';

type Category =
  | 'All'
  | 'Chromebooks'
  | 'iPads'
  | 'Teacher Laptops'
  | 'Desktops'
  | 'Whiteboards'
  | 'Projectors'
  | 'Webcams'
  | 'AI Headsets';

type Budget = 'All' | 'Under £200' | '£200–£400' | '£400–£800' | '£800+';
type Suitability = 'Primary' | 'Secondary' | 'FE' | 'Staff' | 'SEND' | 'SLT';

interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;          // numeric for budget filtering
  priceLabel: string;     // display string
  stars: number;
  suitability: Suitability[];
  verdict: string;
  specs: {
    battery: string;
    screen: string;
    os: string;
    send: string;
    procurement: string;
    warranty: string;
  };
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Acer Chromebook 514',
    category: 'Chromebooks',
    price: 219,
    priceLabel: '£219',
    stars: 4.5,
    suitability: ['Primary', 'Secondary'],
    verdict: 'Rugged, lightweight, and Google Classroom-ready out of the box.',
    specs: { battery: '10 hrs', screen: '14"', os: 'ChromeOS', send: 'Moderate', procurement: 'Crown Commercial', warranty: '1 year' },
  },
  {
    id: 2,
    name: 'HP Chromebook x360 14',
    category: 'Chromebooks',
    price: 289,
    priceLabel: '£289',
    stars: 4.3,
    suitability: ['Secondary', 'FE'],
    verdict: '360° touchscreen ideal for older students and hybrid learning environments.',
    specs: { battery: '12 hrs', screen: '14"', os: 'ChromeOS', send: 'Good', procurement: 'ESFA Framework', warranty: '1 year' },
  },
  {
    id: 3,
    name: 'iPad 10th Gen (Education)',
    category: 'iPads',
    price: 319,
    priceLabel: '£319',
    stars: 4.7,
    suitability: ['Primary', 'SEND'],
    verdict: 'Best-in-class tablet for primary and SEND. Apple School Manager makes deployment simple.',
    specs: { battery: '10 hrs', screen: '10.9"', os: 'iPadOS', send: 'Excellent', procurement: 'Apple School Manager', warranty: '1 year' },
  },
  {
    id: 4,
    name: 'Dell Latitude 5440',
    category: 'Teacher Laptops',
    price: 649,
    priceLabel: '£649',
    stars: 4.4,
    suitability: ['Staff'],
    verdict: 'Education-grade Windows laptop — drop-tested, long-lifespan, excellent keyboard.',
    specs: { battery: '11 hrs', screen: '14"', os: 'Windows 11 Pro', send: 'N/A', procurement: 'Crown Commercial', warranty: '3 years' },
  },
  {
    id: 5,
    name: 'Clevertouch Impact 65"',
    category: 'Whiteboards',
    price: 1499,
    priceLabel: '£1,499',
    stars: 4.8,
    suitability: ['Primary', 'Secondary'],
    verdict: 'The top-rated interactive whiteboard for UK schools. Outstanding touch accuracy.',
    specs: { battery: 'N/A', screen: '65"', os: 'Android + Windows', send: 'Excellent', procurement: 'Direct / Framework', warranty: '5 years' },
  },
  {
    id: 6,
    name: 'BenQ Board Master',
    category: 'Whiteboards',
    price: 1199,
    priceLabel: '£1,199',
    stars: 4.5,
    suitability: ['Secondary', 'FE'],
    verdict: 'Feature-rich board for secondary and FE classrooms. Best Microsoft Teams integration.',
    specs: { battery: 'N/A', screen: '65"', os: 'Android + Windows', send: 'Good', procurement: 'ESFA Framework', warranty: '3 years' },
  },
  {
    id: 7,
    name: 'Logitech BRIO 4K',
    category: 'Webcams',
    price: 149,
    priceLabel: '£149',
    stars: 4.6,
    suitability: ['Staff'],
    verdict: 'The best webcam for hybrid CPD and remote teaching. 4K with excellent low-light performance.',
    specs: { battery: 'USB powered', screen: 'N/A', os: 'Windows / Mac / ChromeOS', send: 'N/A', procurement: 'Direct', warranty: '2 years' },
  },
  {
    id: 8,
    name: 'Jabra Evolve2 55',
    category: 'AI Headsets',
    price: 279,
    priceLabel: '£279',
    stars: 4.4,
    suitability: ['Staff', 'SLT'],
    verdict: 'AI-powered noise cancellation and Microsoft Teams certification. Ideal for SLT and remote staff.',
    specs: { battery: '36 hrs', screen: 'N/A', os: 'Windows / Mac', send: 'N/A', procurement: 'Direct', warranty: '2 years' },
  },
];

const CATEGORIES: Category[] = [
  'All', 'Chromebooks', 'iPads', 'Teacher Laptops', 'Desktops', 'Whiteboards', 'Projectors', 'Webcams', 'AI Headsets',
];

const BUDGETS: Budget[] = ['All', 'Under £200', '£200–£400', '£400–£800', '£800+'];

const TOOLS_CROSS_SELL = [
  { name: 'Microsoft Copilot for Education', category: 'Productivity', desc: 'AI across Microsoft 365 — lesson planning, staff comms, and meeting summaries.', badge: 'Staff Safe' },
  { name: 'Google Gemini for Education',     category: 'General AI',   desc: "Google's AI assistant integrated with Workspace for Education.", badge: 'Google Workspace' },
  { name: 'Khanmigo',                        category: 'AI Tutor',     desc: 'Patient Socratic AI tutor aligned to UK curriculum. Never gives answers.', badge: 'Student Safe' },
];

function budgetMatch(price: number, budget: Budget): boolean {
  if (budget === 'All') return true;
  if (budget === 'Under £200') return price < 200;
  if (budget === '£200–£400') return price >= 200 && price <= 400;
  if (budget === '£400–£800') return price > 400 && price <= 800;
  return price > 800;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{ color: i <= Math.round(n) ? '#f59e0b' : '#e8e6e0', fontSize: '12px' }}
        >
          ★
        </span>
      ))}
      <span className="text-xs font-semibold ml-1 tabular-nums" style={{ color: '#6b6760' }}>
        {n.toFixed(1)}
      </span>
    </span>
  );
}

const COMPARISON_ROWS: { key: keyof Product['specs']; label: string }[] = [
  { key: 'battery',     label: 'Battery life' },
  { key: 'screen',      label: 'Screen size' },
  { key: 'os',          label: 'Operating system' },
  { key: 'send',        label: 'SEND suitability' },
  { key: 'procurement', label: 'Procurement route' },
  { key: 'warranty',    label: 'Warranty' },
];

const Equipment: FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeBudget, setActiveBudget]     = useState<Budget>('All');
  const [compareIds, setCompareIds]         = useState<number[]>([]);
  const [compareOpen, setCompareOpen]       = useState(false);
  const [procureOpen, setProcureOpen]       = useState(false);

  const filtered = useMemo(() =>
    PRODUCTS.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      budgetMatch(p.price, activeBudget)
    ),
    [activeCategory, activeBudget]
  );

  const compareProducts = PRODUCTS.filter(p => compareIds.includes(p.id));

  function toggleCompare(id: number) {
    setCompareIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Best School Hardware & Equipment UK 2026 | GetPromptly Reviews"
        description="Independently reviewed Chromebooks, iPads, interactive whiteboards, webcams and AI headsets for UK schools. Rated for durability, SEND suitability and procurement compliance."
        keywords="school Chromebooks UK, iPads for schools, interactive whiteboard UK, school hardware reviews, SEND equipment schools, school procurement 2026, Hostinger EdTech"
        path="/equipment"
      />

      {/* ── PAGE HERO ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <SectionLabel>Equipment Hub</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Equipment for<br />
          <span style={{ color: TEAL }}>UK Schools.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl mb-8" style={{ color: '#6b6760' }}>
          Honest reviews with school procurement in mind. No commission bias — just what works.
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={
                activeCategory === c
                  ? { background: TEAL, color: 'white', borderColor: TEAL }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
              }
            >
              {c}
            </button>
          ))}
        </div>

        {/* Budget filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wide mr-1" style={{ color: '#c5c2bb' }}>Budget:</span>
          {BUDGETS.map(b => (
            <button
              key={b}
              onClick={() => setActiveBudget(b)}
              className="px-3 py-1 rounded-lg text-xs font-semibold border transition-all"
              style={
                activeBudget === b
                  ? { background: '#111210', color: 'white', borderColor: '#111210' }
                  : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
              }
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* ── EQUIPMENT GRID + SIDEBAR ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs" style={{ color: '#c5c2bb' }}>
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} · Reviewed April 2026 · No paid placements
              </p>
              {compareIds.length > 0 && (
                <button
                  onClick={() => setCompareOpen(o => !o)}
                  className="text-xs font-semibold px-3 py-1 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Compare ({compareIds.length}) →
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + '|' + activeBudget}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-px"
                style={{ background: '#e8e6e0' }}
              >
                {filtered.length === 0 ? (
                  <div className="col-span-full p-12 text-center" style={{ background: 'white' }}>
                    <p className="text-sm" style={{ color: '#6b6760' }}>
                      No products match this filter combination. Try adjusting the category or budget.
                    </p>
                  </div>
                ) : (
                  filtered.map((product, i) => {
                    const inCompare = compareIds.includes(product.id);
                    const canAdd    = compareIds.length < 3;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 group"
                        style={{ background: 'white' }}
                      >
                        {/* Image placeholder */}
                        <div
                          className="w-full h-32 rounded-xl mb-4 flex items-center justify-center"
                          style={{ background: '#f7f6f2', border: '1px solid #e8e6e0' }}
                        >
                          <span className="text-3xl opacity-30">
                            {product.category === 'Chromebooks' || product.category === 'Teacher Laptops' ? '💻' :
                             product.category === 'iPads' ? '📱' :
                             product.category === 'Whiteboards' ? '🖥️' :
                             product.category === 'Webcams' ? '📷' :
                             product.category === 'AI Headsets' ? '🎧' : '🔌'}
                          </span>
                        </div>

                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h2 className="font-display text-lg leading-tight" style={{ color: 'var(--text)' }}>
                            {product.name}
                          </h2>
                          <span
                            className="text-sm font-bold flex-shrink-0 tabular-nums"
                            style={{ color: TEAL }}
                          >
                            {product.priceLabel}
                          </span>
                        </div>

                        <Stars n={product.stars} />

                        {/* Category + suitability badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
                            style={{ background: '#e0f5f6', color: TEAL }}
                          >
                            {product.category}
                          </span>
                          {product.suitability.map(s => (
                            <span
                              key={s}
                              className="text-[10px] font-medium px-2 py-0.5 rounded"
                              style={{ background: '#f3f4f6', color: '#6b7280' }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b6760' }}>
                          {product.verdict}
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-semibold cursor-pointer group-hover:opacity-60 transition-opacity"
                            style={{ color: TEAL }}
                          >
                            Read review →
                          </span>
                          <a
                            href="#"
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80"
                            style={{ background: TEAL, color: 'white' }}
                          >
                            Check price →
                          </a>
                          <button
                            onClick={() => toggleCompare(product.id)}
                            disabled={!inCompare && !canAdd}
                            className="ml-auto text-[10px] font-semibold px-2 py-1 rounded border transition-all disabled:opacity-30"
                            style={
                              inCompare
                                ? { background: '#111210', color: 'white', borderColor: '#111210' }
                                : { background: 'white', color: '#6b6760', borderColor: '#e8e6e0' }
                            }
                          >
                            {inCompare ? '✓ Comparing' : '+ Compare'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── STICKY SIDEBAR ── */}
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 space-y-4 mt-9">

            {/* Agent panel */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e6e0' }}>
              <div className="px-4 py-3 border-b" style={{ background: '#111210', borderColor: '#1f1f1c' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b6760' }}>
                  Hardware Agent
                </p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>Get a procurement recommendation</p>
              </div>
              <div className="p-4" style={{ background: 'white' }}>
                <div
                  className="rounded-xl p-3 mb-3 text-sm leading-relaxed italic"
                  style={{ background: '#f7f6f2', color: '#6b6760' }}
                >
                  "What's the best Chromebook for 250 Year 7 pupils with a £300/device budget?"
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: TEAL, color: 'white' }}
                >
                  Ask Promptly AI →
                </button>
                <p className="text-[10px] text-center mt-2" style={{ color: '#c5c2bb' }}>
                  Powered by Claude · Free to use
                </p>
              </div>
            </div>

            {/* Compare prompt */}
            <div className="rounded-2xl border p-4" style={{ borderColor: '#e8e6e0', background: 'white' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#c5c2bb' }}>
                Compare Products
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b6760' }}>
                Select up to 3 products using "+ Compare" to see a side-by-side spec breakdown.
              </p>
              {compareIds.length > 0 ? (
                <button
                  onClick={() => setCompareOpen(o => !o)}
                  className="w-full py-2 rounded-xl text-sm font-semibold border transition-all"
                  style={{ borderColor: TEAL, color: TEAL, background: 'white' }}
                >
                  View comparison ({compareIds.length}/3)
                </button>
              ) : (
                <p className="text-xs" style={{ color: '#c5c2bb' }}>No products selected yet.</p>
              )}
            </div>

            {/* Procurement tip */}
            <div
              className="rounded-2xl p-4"
              style={{ background: '#e0f5f6', border: `1px solid ${TEAL}20` }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: TEAL }}>Procurement tip</p>
              <p className="text-sm leading-relaxed" style={{ color: '#1c1a15' }}>
                Most of these products are available via Crown Commercial Service or ESFA frameworks — no OJEU threshold to worry about under £25k.
              </p>
            </div>
          </div>
        </div>

        {/* ── COMPARISON TABLE ── */}
        <AnimatePresence>
          {compareOpen && compareProducts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-8"
            >
              <div className="rounded-2xl border overflow-x-auto" style={{ borderColor: '#e8e6e0', background: 'white' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e8e6e0' }}>
                  <h2 className="font-display text-xl" style={{ color: 'var(--text)' }}>
                    Side-by-side comparison
                  </h2>
                  <button
                    onClick={() => setCompareOpen(false)}
                    className="text-xs font-semibold transition-opacity hover:opacity-60"
                    style={{ color: '#6b6760' }}
                  >
                    Close ✕
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e8e6e0' }}>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#c5c2bb', width: '160px' }}>
                        Spec
                      </th>
                      {compareProducts.map(p => (
                        <th key={p.id} className="px-6 py-3 text-left" style={{ color: 'var(--text)' }}>
                          <span className="font-display text-base">{p.name}</span>
                          <span className="block text-xs font-normal mt-0.5" style={{ color: TEAL }}>{p.priceLabel}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td className="px-6 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>Price</td>
                      {compareProducts.map(p => (
                        <td key={p.id} className="px-6 py-3 font-semibold" style={{ color: 'var(--text)' }}>{p.priceLabel}</td>
                      ))}
                    </tr>
                    {COMPARISON_ROWS.map(row => (
                      <tr key={row.key} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td className="px-6 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>{row.label}</td>
                        {compareProducts.map(p => (
                          <td key={p.id} className="px-6 py-3" style={{ color: '#6b6760' }}>{p.specs[row.key]}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="px-6 py-3 text-xs font-semibold" style={{ color: '#6b6760' }}>Star rating</td>
                      {compareProducts.map(p => (
                        <td key={p.id} className="px-6 py-3"><Stars n={p.stars} /></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="px-6 py-4 border-t flex gap-3" style={{ borderColor: '#e8e6e0' }}>
                  <button
                    onClick={() => { setCompareIds([]); setCompareOpen(false); }}
                    className="text-xs font-semibold transition-opacity hover:opacity-60"
                    style={{ color: '#6b6760' }}
                  >
                    Clear comparison
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MOBILE AGENT CTA ── */}
        <div className="lg:hidden mt-8 rounded-2xl overflow-hidden border" style={{ borderColor: '#e8e6e0' }}>
          <div className="p-5" style={{ background: '#111210' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'white' }}>
              Not sure what to buy?
            </p>
            <p className="text-xs italic mb-4" style={{ color: '#9ca3af' }}>
              "What's the best Chromebook for 250 Year 7 pupils with a £300/device budget?"
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: 'white' }}
            >
              Ask Promptly AI →
            </button>
          </div>
        </div>
      </div>

      {/* ── PROCUREMENT GUIDE STRIP ── */}
      <div style={{ background: 'white', borderTop: '1px solid #e8e6e0', borderBottom: '1px solid #e8e6e0' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
                Buying Guide
              </p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
                How to buy for your school.
              </h2>
            </div>
            <button
              onClick={() => setProcureOpen(o => !o)}
              className="hidden sm:block text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: TEAL }}
            >
              {procureOpen ? 'Hide guide ▲' : 'Show full guide ▼'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {[
              {
                step: '01',
                title: 'Define your requirements',
                desc: 'Start with the number of devices, target age group, OS preference (ChromeOS / Windows / iPadOS), and any SEND requirements.',
              },
              {
                step: '02',
                title: 'Choose a procurement route',
                desc: 'Use Crown Commercial Service (RM6098) or the ESFA Technology Products framework to stay compliant and get education pricing.',
              },
              {
                step: '03',
                title: 'Request demos & pilot',
                desc: 'Most suppliers will provide a 30-day pilot. Involve your IT lead, a class teacher, and an SENCO before committing.',
              },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <span
                  className="font-display text-3xl flex-shrink-0 leading-none mt-1"
                  style={{ color: '#e8e6e0' }}
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b6760' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {procureOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    { label: 'GDPR & data residency', desc: 'Ensure all student data stays within the UK/EEA. Check supplier DPA before signing any contract.' },
                    { label: 'Device management',    desc: 'Look for MDM compatibility — Google Admin, Apple School Manager, or Microsoft Intune — to manage updates and restrictions centrally.' },
                    { label: 'Accessories budget',   desc: "Factor in cases, keyboards, and chargers — typically 15–20% on top of device cost for a school deployment." },
                    { label: 'Insurance & repair',   desc: 'School Device Insurance via Zurich or Aviva typically covers accidental damage for £15–25/device/year.' },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="p-4 rounded-xl border text-sm"
                      style={{ borderColor: '#e8e6e0', color: '#6b6760' }}
                    >
                      <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{item.label}</p>
                      <p className="leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email gate / checklist CTA */}
          <div
            className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{ background: '#f7f6f2', border: '1px solid #e8e6e0' }}
          >
            <div className="flex-1">
              <p className="font-display text-lg mb-1" style={{ color: 'var(--text)' }}>
                Free procurement checklist
              </p>
              <p className="text-sm" style={{ color: '#6b6760' }}>
                15-point PDF covering GDPR, DPA, MDM, insurance, and ESFA framework compliance.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-agent-chat'))}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: TEAL, color: 'white' }}
            >
              Download free checklist →
            </button>
          </div>
        </div>
      </div>

      {/* ── CROSS-SELL: AI TOOLS ── */}
      <div style={{ background: '#111210' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: TEAL }}>
                Related AI Tools
              </p>
              <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'white' }}>
                Software to go with your hardware.
              </h2>
            </div>
            <Link
              to="/tools"
              className="hidden sm:block text-sm font-semibold hover:opacity-70 transition-opacity pb-1"
              style={{ color: TEAL }}
            >
              All tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#1f1f1c' }}>
            {TOOLS_CROSS_SELL.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to="/tools"
                  className="block p-6 transition-colors hover:bg-[#181815]"
                  style={{ background: '#111210' }}
                >
                  <span
                    className="inline-block text-[10px] font-semibold px-2 py-1 rounded mb-3"
                    style={{ background: '#0d1f1f', color: TEAL }}
                  >
                    {tool.badge}
                  </span>
                  <h3 className="font-display text-lg mb-1" style={{ color: 'white' }}>
                    {tool.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: '#4b5563' }}>
                    {tool.category}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                    {tool.desc}
                  </p>
                  <span className="inline-block mt-4 text-xs font-semibold" style={{ color: TEAL }}>
                    View review →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link
            to="/tools"
            className="sm:hidden block text-center mt-6 text-sm font-semibold"
            style={{ color: TEAL }}
          >
            Browse all AI tools →
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Equipment;
