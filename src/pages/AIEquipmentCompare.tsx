import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SectionLabel from '../components/SectionLabel';
import LeadMagnet from '../components/LeadMagnet';
import {
  EQUIPMENT,
  type EquipmentProduct,
} from '../data/equipment';
import { reviewBadge } from './AIEquipment';

const TEAL = '#BEFF00';

interface ColDef {
  header: string;
  render: (p: EquipmentProduct) => React.ReactNode;
}

function ComparisonTable({
  id,
  title,
  description,
  products,
  cols,
}: {
  id: string;
  title: string;
  description: string;
  products: EquipmentProduct[];
  cols: ColDef[];
}) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="mb-16 scroll-mt-8">
      <SectionLabel>{title}</SectionLabel>
      <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>
        {title}
      </h2>
      <p className="text-sm mb-6 max-w-2xl" style={{ color: '#4A4A4A' }}>{description}</p>

      <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: '#ECE7DD' }}>
        <table className="w-full text-sm" style={{ minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#F8F5F0' }}>
              <th
                className="px-5 py-3 text-left text-xs font-semibold"
                style={{ color: '#9C9690', minWidth: 200 }}
              >
                Product
              </th>
              {cols.map(c => (
                <th key={c.header} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#9C9690' }}>
                  {c.header}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#9C9690' }}>Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const rb = reviewBadge(p.reviewStatus);
              return (
                <tr
                  key={p.id}
                  style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafaf9' }}
                >
                  <td className="px-5 py-3" style={{ minWidth: 200 }}>
                    <Link
                      to={`/ai-equipment/product/${p.slug}`}
                      className="font-medium hover:underline"
                      style={{ color: 'var(--text)' }}
                    >
                      {p.name}
                    </Link>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{p.brand}</div>
                  </td>
                  {cols.map(c => (
                    <td key={c.header} className="px-4 py-3 text-xs" style={{ color: '#4A4A4A' }}>
                      {c.render(p)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: rb.bg, color: rb.color }}
                    >
                      {rb.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/ai-equipment/product/${p.slug}`}
                      className="text-xs font-semibold whitespace-nowrap transition-opacity hover:opacity-70"
                      style={{ color: TEAL }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
}

export default function AIEquipmentCompare() {
  const tablets = useMemo(() =>
    EQUIPMENT.filter(p =>
      p.subcategory.toLowerCase().includes('tablet') ||
      p.subcategory === 'Tablets'
    ),
    []
  );

  const displays = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Screens & Classroom Hardware'),
    []
  );

  const codingRobots = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Robots & Coding'),
    []
  );

  const aacDevices = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'AAC & Communication'),
    []
  );

  const audioHearing = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Audio & Hearing'),
    []
  );

  const stationeryLiteracy = useMemo(() =>
    EQUIPMENT.filter(p => p.category === 'Stationery & Literacy'),
    []
  );

  const tabletCols: ColDef[] = [
    { header: 'Price Band',    render: p => p.priceBand },
    { header: 'Best For',      render: p => p.bestFor },
    { header: 'Supplier',      render: p => p.supplierName },
    { header: 'Audience',      render: p => p.audience.join(', ') },
    { header: 'SEN Categories', render: p => p.senCategory.length > 0 ? p.senCategory.slice(0, 2).join(', ') : '—' },
  ];

  const displayCols: ColDef[] = [
    { header: 'Price Band',     render: p => p.priceBand },
    { header: 'Best For',       render: p => p.bestFor },
    { header: 'Supplier',       render: p => p.supplierName },
    { header: 'Purchase Model', render: p => p.purchaseModel },
  ];

  const robotCols: ColDef[] = [
    { header: 'Price Band',      render: p => p.priceBand },
    { header: 'Best For',        render: p => p.bestFor },
    { header: 'Audience',        render: p => p.audience.join(', ') },
    { header: 'Education Level', render: p => p.educationLevel.join(', ') },
  ];

  const aacCols: ColDef[] = [
    { header: 'Price Band',     render: p => p.priceBand },
    { header: 'Best For',       render: p => p.bestFor },
    { header: 'SEN Categories', render: p => p.senCategory.join(', ') || '—' },
    { header: 'Supplier',       render: p => p.supplierName },
    { header: 'Purchase Model', render: p => p.purchaseModel },
  ];

  const audioCols: ColDef[] = [
    { header: 'Price Band',     render: p => p.priceBand },
    { header: 'Best For',       render: p => p.bestFor },
    { header: 'SEN Categories', render: p => p.senCategory.join(', ') || '—' },
    { header: 'Audience',       render: p => p.audience.join(', ') },
  ];

  const stationeryCols: ColDef[] = [
    { header: 'Price Band',     render: p => p.priceBand },
    { header: 'Best For',       render: p => p.bestFor },
    { header: 'SEN Categories', render: p => p.senCategory.join(', ') || '—' },
    { header: 'Audience',       render: p => p.audience.join(', ') },
    { header: 'Supplier',       render: p => p.supplierName },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Compare Education Equipment — Tablets, Displays & More | GetPromptly"
        description="Side-by-side comparisons for tablets, interactive displays, reading pens, visualisers, AAC devices and coding robots for UK education."
        keywords="compare education equipment UK, tablet comparison schools, interactive displays compare, AAC devices comparison"
        path="/ai-equipment/compare"
      />

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <Link to="/ai-equipment" className="text-sm mb-4 inline-flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: TEAL }}>
          ← Equipment Hub
        </Link>
        <SectionLabel>Compare</SectionLabel>
        <h1 className="font-display text-5xl sm:text-6xl mb-4" style={{ color: 'var(--text)' }}>
          Compare Education<br />
          <span style={{ color: TEAL }}>Equipment</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-8" style={{ color: '#4A4A4A' }}>
          Side-by-side comparisons for tablets, interactive displays, reading pens, visualisers, AAC devices and coding robots for UK education.
        </p>

        {/* Jump links */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Tablets',               href: '#tablets' },
            { label: 'Interactive Displays',  href: '#displays' },
            { label: 'Coding Robots',         href: '#robots' },
            { label: 'AAC Devices',           href: '#aac' },
            { label: 'Audio & Hearing',       href: '#audio' },
            { label: 'Stationery & Literacy', href: '#stationery' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm px-4 py-1.5 rounded-xl border transition-colors hover:border-[#BEFF00] hover:text-[#BEFF00]"
              style={{ borderColor: '#ECE7DD', color: '#4A4A4A', background: 'white' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* COMPARISON TABLES */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <ComparisonTable
          id="tablets"
          title="Tablets"
          description="Compare iPads, Chromebooks and Windows tablets for classrooms, SEND provision and student use."
          products={tablets}
          cols={tabletCols}
        />

        <ComparisonTable
          id="displays"
          title="Interactive Displays"
          description="Side-by-side look at interactive boards, smart displays and classroom screens."
          products={displays}
          cols={displayCols}
        />

        <ComparisonTable
          id="robots"
          title="Coding Robots"
          description="Compare programmable robots and coding kits for primary and secondary classrooms."
          products={codingRobots}
          cols={robotCols}
        />

        <ComparisonTable
          id="aac"
          title="AAC Devices"
          description="Compare augmentative and alternative communication devices for SEND pupils."
          products={aacDevices}
          cols={aacCols}
        />

        <ComparisonTable
          id="audio"
          title="Audio & Hearing"
          description="Hearing loops, FM systems, classroom speakers and audio support equipment."
          products={audioHearing}
          cols={audioCols}
        />

        <ComparisonTable
          id="stationery"
          title="Stationery & Literacy"
          description="Reading pens, literacy tools and stationery for UK students and SEND provision."
          products={stationeryLiteracy}
          cols={stationeryCols}
        />
      </div>

      {/* ── LEAD MAGNET — comparison shortlist ─────────────────────────────── */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <LeadMagnet
            eyebrow="Free download"
            headline="Email me this equipment set"
            description={
              <>
                Get a printable shortlist of the products on this page — with prices, suppliers, SEND notes and procurement paths — sent straight to your inbox. Use it for budget bids, governor reports or department planning.
              </>
            }
            buttonLabel="Email me the shortlist →"
            analyticsSection="equipment-compare-shortlist"
            successMessage={<>Sending the equipment shortlist to <strong>your inbox</strong> now.</>}
          />
        </div>
      </section>

      {/* CROSS-SELL */}
      <div style={{ background: '#0F1C1A' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <p className="font-display text-xl text-white">Explore more resources</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/ai-equipment" className="text-sm transition-colors hover:text-white" style={{ color: '#4A4A4A' }}>
              All Equipment →
            </Link>
            <Link to="/ai-equipment/send" className="text-sm transition-colors hover:text-white" style={{ color: '#4A4A4A' }}>
              SEND Equipment →
            </Link>
            <Link to="/ai-equipment/schools" className="text-sm transition-colors hover:text-white" style={{ color: '#4A4A4A' }}>
              School Procurement →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
