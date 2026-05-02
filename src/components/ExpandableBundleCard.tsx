import { useState, useMemo, useId, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadMagnet from './LeadMagnet';
import { track } from '../utils/analytics';
import { resolveProductAffiliateUrl, AFFILIATE_LINK_ATTRS } from '../utils/affiliateLinks';
import {
  EQUIPMENT,
  type EquipmentBundle,
  type EquipmentProduct,
} from '../data/equipment';

/**
 * ExpandableBundleCard — collapsed-by-default card representing a Ready-to-Use
 * Equipment Set. On expand it reveals:
 *   • the included items list (resolved from productSlugs → EQUIPMENT[].name)
 *   • who it's best for (targetNeed + audience)
 *   • a clear next step (purchase route)
 *   • an "Email me this equipment set" lead-magnet form
 *
 * Used on both the canonical /equipment page and the /ai-equipment hub so the
 * presentation and analytics are consistent across surfaces.
 *
 * Accessibility:
 *   • Toggle is a real <button> with aria-expanded + aria-controls.
 *   • Panel uses role="region" and is labelled by the toggle button.
 *   • Animations respect prefers-reduced-motion via the global CSS rule in
 *     src/index.css (transitions clamped to 0.01ms) plus Framer Motion's own
 *     reduced-motion handling.
 */

const LIME = '#BEFF00';
const INK = '#0F1C1A';
const INK_SOFT = '#4A4A4A';
const BORDER = '#ECE7DD';
const CREAM = '#F8F5F0';

export interface ExpandableBundleCardProps {
  bundle: EquipmentBundle;
  /** Open by default (e.g. when deep-linking to a bundle). */
  defaultOpen?: boolean;
  /** Optional analytics surface tag — defaults to 'equipment'. */
  surface?: string;
}

const ExpandableBundleCard: FC<ExpandableBundleCardProps> = ({
  bundle,
  defaultOpen = false,
  surface = 'equipment',
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const panelId = `bundle-panel-${bundle.slug}-${reactId}`;
  const buttonId = `bundle-toggle-${bundle.slug}-${reactId}`;

  // Resolve product slugs → full product records for the included-items list.
  const includedItems = useMemo(
    () =>
      bundle.productSlugs
        .map(slug => EQUIPMENT.find(p => p.slug === slug))
        .filter((p): p is EquipmentProduct => Boolean(p)),
    [bundle.productSlugs],
  );

  // Pick a sensible "next step" based on overall price band.
  const nextStep =
    bundle.totalPriceBand.includes('£500+') || bundle.totalPriceBand.includes('£1k')
      ? 'Get a tailored school quote — most items in this set are available via direct purchase or LA framework.'
      : 'Add the kit to a school basket, or buy items individually for a single classroom.';

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col"
      data-bundle-card
      data-bundle-slug={bundle.slug}
      style={{
        borderColor: open ? LIME : BORDER,
        background: 'white',
        boxShadow: open
          ? '0 0 0 1px rgba(190,255,0,0.45), 0 12px 32px rgba(15,28,26,0.10)'
          : '0 1px 0 rgba(255,255,255,0.8) inset, 0 6px 18px rgba(15,28,26,0.05)',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
      }}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen(o => !o);
          if (!open) {
            track({
              name: 'cta_clicked',
              section: `${surface}-set-${bundle.slug}`,
              label: 'expand',
            });
          }
        }}
        className="text-left p-5 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: INK }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: LIME, boxShadow: '0 0 0 3px rgba(190,255,0,0.18)' }}
                aria-hidden="true"
              />
              Equipment set · {bundle.totalPriceBand}
            </p>
            <h3 className="font-display text-lg leading-snug" style={{ color: INK }}>
              {bundle.name}
            </h3>
            <p className="text-xs mt-1" style={{ color: '#9C9690' }}>{bundle.tagline}</p>
          </div>
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base font-bold"
            style={{
              background: open ? LIME : CREAM,
              color: INK,
              border: `1px solid ${open ? LIME : BORDER}`,
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease, background 200ms ease',
            }}
            aria-hidden="true"
          >
            +
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>
          {bundle.desc}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {bundle.senCategory.map(s => (
            <span
              key={s}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(190,255,0,0.18)',
                color: INK,
                border: '1px solid rgba(190,255,0,0.45)',
              }}
            >
              {s}
            </span>
          ))}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: CREAM, color: INK_SOFT, border: `1px solid ${BORDER}` }}
          >
            {bundle.productSlugs.length} items
          </span>
        </div>

        <p className="text-[11px] font-semibold mt-1" style={{ color: open ? INK : '#9C9690' }}>
          {open ? '— Tap to collapse' : 'Tap to see what’s inside →'}
        </p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${BORDER}`, background: CREAM }}
          >
            <div className="p-5 flex flex-col gap-5">
              {/* Included items */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: INK_SOFT }}>
                  What’s included
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {includedItems.map(item => (
                    <li key={item.id} className="flex items-start gap-2 text-sm" style={{ color: INK }}>
                      <span
                        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: LIME }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-xs ml-2" style={{ color: '#9C9690' }}>
                          {item.priceBand} · {item.brand}
                        </span>
                      </div>
                      <a
                        href={resolveProductAffiliateUrl(item)}
                        {...AFFILIATE_LINK_ATTRS}
                        className="text-xs font-semibold flex-shrink-0 underline decoration-dotted underline-offset-2 hover:opacity-80"
                        style={{ color: INK }}
                        onClick={() =>
                          track({
                            name: 'cta_clicked',
                            section: `${surface}-set-${bundle.slug}`,
                            label: 'view-item',
                          })
                        }
                      >
                        View →
                      </a>
                    </li>
                  ))}
                  {includedItems.length === 0 && (
                    <li className="text-xs italic" style={{ color: '#9C9690' }}>
                      Item list coming soon — email yourself the set below and we’ll send the full kit list.
                    </li>
                  )}
                </ul>
              </div>

              {/* Best for / next step */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="rounded-xl border p-3"
                  style={{ background: 'white', borderColor: BORDER }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9C9690' }}>
                    Best for
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: INK }}>
                    {bundle.targetNeed}
                  </p>
                  {bundle.audience.length > 0 && (
                    <p className="text-[11px] mt-1.5" style={{ color: INK_SOFT }}>
                      Audience: {bundle.audience.join(', ')}
                    </p>
                  )}
                </div>
                <div
                  className="rounded-xl border p-3"
                  style={{ background: 'white', borderColor: BORDER }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9C9690' }}>
                    Next step
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: INK }}>
                    {nextStep}
                  </p>
                </div>
              </div>

              {/* Email-capture CTA */}
              <LeadMagnet
                variant="light"
                eyebrow="Free shortlist"
                headline="Email me this equipment set →"
                description={
                  <>
                    Send the full <strong>{bundle.name}</strong> kit list, supplier details and a buy-or-quote
                    note straight to your inbox.
                  </>
                }
                buttonLabel="Email it to me →"
                successMessage={
                  <>
                    The <strong>{bundle.name}</strong> kit list is on its way to your inbox.
                  </>
                }
                analyticsSection={`${surface}-set-${bundle.slug}`}
                analyticsMeta={{ bundle: bundle.slug, items: bundle.productSlugs.length }}
                inputIdSuffix={`${surface}-${bundle.slug}`}
                trustNote="No spam. UK GDPR compliant. One follow-up if it’s useful."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableBundleCard;
