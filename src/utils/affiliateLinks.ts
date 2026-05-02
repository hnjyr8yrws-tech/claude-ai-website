/**
 * affiliateLinks.ts — central affiliate / supplier link resolver.
 *
 * Every outbound product link on the site MUST go through resolveProductAffiliateUrl()
 * (or buildAffiliateUrl() for raw supplier-level links). The product-card components
 * never hard-code URLs themselves — they only read the supplierName/supplierKey/slug
 * fields from the product record.
 *
 * Why centralise:
 *   • One place to register tracking IDs (Amazon Associates tag, Awin publisher ID).
 *   • One place to swap a supplier's destination if their store URL changes.
 *   • One place to add new affiliate networks without touching every page.
 *
 * Tracking strategy:
 *   • Amazon URLs            → ?tag=<amazonUkTag>&ascsubtag=<productSlug>
 *   • Awin-routed merchants  → Awin gateway (cread.php) with publisher ID + clickref
 *   • Other direct merchants → utm_source / utm_medium / utm_campaign / utm_content
 *
 * Placeholders:
 *   IDs prefixed `PLACEHOLDER_` need real partner credentials before we ship live
 *   tracking. The resolver still produces working URLs while these are placeholders
 *   — links go to the right merchant, just without the affiliate query string until
 *   the real ID is added.
 */

// ─── Tracking config ───────────────────────────────────────────────────────────
//
// Replace the `PLACEHOLDER_*` values below with real partner credentials once
// each programme is approved. Until then the resolver suppresses the relevant
// query string so we never send out malformed tracking codes (a bare `&tag=` or
// `&awinaffid=` will register as an invalid click and may breach partner T&Cs).

interface AffiliateConfig {
  amazonUkTag: string | null;       // Amazon Associates UK tracking tag
  awinPublisherId: string | null;   // Awin publisher ID (formerly "AWC" / clickref account)
  awinClickRef: string;             // sub-id sent with every Awin click
  campaign: string;                 // utm_campaign value
  source: string;                   // utm_source value
  medium: string;                   // utm_medium value
}

export const AFFILIATE_CONFIG: AffiliateConfig = {
  // PLACEHOLDER — real Amazon Associates UK tag (e.g. "getpromptly-21") goes here.
  amazonUkTag: 'getpromptly-21',
  // PLACEHOLDER — real Awin publisher ID (e.g. "1234567"). Set to null until approved.
  awinPublisherId: null,
  awinClickRef: 'getpromptly',
  campaign: 'getpromptly_equipment',
  source: 'getpromptly',
  medium: 'affiliate',
};

// ─── Supplier registry ─────────────────────────────────────────────────────────
//
// The single source of truth for *where* a supplier sends users.
//
// Keyed by a lower-case, non-spaced supplier slug. Look-ups are tolerant — the
// `keyForSupplierName()` helper normalises raw `supplierName` strings (which can
// look like "Apple/Amazon" or "Lenovo/School Resellers") down to the right key.
//
// Each entry:
//   direct          — canonical UK store / product URL (always required)
//   amazon          — optional Amazon search/product URL for the same item
//   network         — which affiliate network (drives query-string strategy)
//   awinMerchantId  — required for `network: 'awin'`; PLACEHOLDER_AWIN_MID if unknown

export type AffiliateNetwork = 'amazon' | 'awin' | 'direct';

interface SupplierEntry {
  direct: string;
  amazon?: string;
  network: AffiliateNetwork;
  /** Awin advertiser/merchant ID. Use 'PLACEHOLDER_AWIN_MID' to mark a TBD partner. */
  awinMerchantId?: string;
  /** Optional human label (used by debug logs in dev). */
  label?: string;
}

export const supplierLinks: Record<string, SupplierEntry> = {
  // ── Amazon (catch-all for Amazon-only listings) ──────────────────────────────
  amazon:              { direct: 'https://www.amazon.co.uk', network: 'amazon', label: 'Amazon UK' },

  // ── Tablets / laptops ────────────────────────────────────────────────────────
  apple:               { direct: 'https://www.apple.com/uk-edu/store',                                  amazon: 'https://www.amazon.co.uk/s?k=apple+ipad+education', network: 'direct', label: 'Apple Education UK' },
  lenovo:              { direct: 'https://www.lenovo.com/gb/en/education/',                             network: 'direct', label: 'Lenovo Education UK' },
  microsoft:           { direct: 'https://www.microsoft.com/en-gb/education',                           amazon: 'https://www.amazon.co.uk/s?k=microsoft+surface', network: 'direct', label: 'Microsoft UK' },
  samsung:             { direct: 'https://www.samsung.com/uk/business/education/',                       amazon: 'https://www.amazon.co.uk/s?k=samsung+galaxy+tab', network: 'direct', label: 'Samsung UK' },
  asus:                { direct: 'https://www.asus.com/uk/laptops/for-home/chromebook/',                 network: 'direct', label: 'ASUS UK' },
  remarkable:          { direct: 'https://remarkable.com/store',                                        network: 'direct', label: 'reMarkable' },

  // ── Stationery / literacy / SEND tools ───────────────────────────────────────
  cpen:                { direct: 'https://www.scanningpens.co.uk/',                                     amazon: 'https://www.amazon.co.uk/s?k=C-Pen+Reader+2', network: 'direct', label: 'Scanning Pens (C-Pen)' },
  orcam:               { direct: 'https://www.orcam.com/en-gb/',                                        network: 'direct', label: 'OrCam' },
  crossbow:            { direct: 'https://www.crossboweducation.com',                                   network: 'direct', label: 'Crossbow Education' },

  // ── Specialist UK distributors (Awin-eligible — IDs TBD) ─────────────────────
  tts:                 { direct: 'https://www.tts-group.co.uk/',                                        amazon: 'https://www.amazon.co.uk/s?k=TTS+Bee-Bot', network: 'awin', awinMerchantId: 'PLACEHOLDER_AWIN_MID', label: 'TTS Group' },
  hope:                { direct: 'https://www.hope-education.co.uk',                                    network: 'awin', awinMerchantId: 'PLACEHOLDER_AWIN_MID', label: 'Hope Education' },
  inclusive:           { direct: 'https://www.inclusive.co.uk/',                                        network: 'awin', awinMerchantId: 'PLACEHOLDER_AWIN_MID', label: 'Inclusive Technology' },
  tfh:                 { direct: 'https://www.tfhuk.com',                                               network: 'awin', awinMerchantId: 'PLACEHOLDER_AWIN_MID', label: 'TFH Special Needs Toys' },
  smartbox:            { direct: 'https://www.thinksmartbox.com',                                       network: 'direct', label: 'Smartbox' },
  tobii:               { direct: 'https://www.tobiidynavox.com',                                        network: 'direct', label: 'Tobii Dynavox' },
  cerebra:             { direct: 'https://cerebra.org.uk/get-support/inclusive-technology/',            network: 'direct', label: 'Cerebra (free resources)' },

  // ── Robotics / coding ────────────────────────────────────────────────────────
  lego:                { direct: 'https://education.lego.com/en-gb/',                                   network: 'direct', label: 'LEGO Education' },
  sphero:              { direct: 'https://sphero.com/',                                                 network: 'direct', label: 'Sphero' },
  microbit:            { direct: 'https://microbit.org/buy/',                                           amazon: 'https://www.amazon.co.uk/s?k=bbc+microbit+go+kit', network: 'direct', label: 'micro:bit' },
  wonderworkshop:      { direct: 'https://www.makewonder.com/',                                         amazon: 'https://www.amazon.co.uk/s?k=wonder+workshop+dash', network: 'direct', label: 'Wonder Workshop' },
  ozobot:              { direct: 'https://ozobot.com/',                                                 amazon: 'https://www.amazon.co.uk/s?k=ozobot+evo', network: 'direct', label: 'Ozobot' },
  learningresources:   { direct: 'https://www.learningresources.com/',                                  amazon: 'https://www.amazon.co.uk/s?k=learning+resources', network: 'direct', label: 'Learning Resources' },
  makeblock:           { direct: 'https://www.makeblock.com/',                                          amazon: 'https://www.amazon.co.uk/s?k=makeblock+mbot', network: 'direct', label: 'Makeblock' },
  osmo:                { direct: 'https://www.playosmo.com/en-gb/',                                     amazon: 'https://www.amazon.co.uk/s?k=osmo+genius', network: 'direct', label: 'Osmo' },

  // ── Classroom hardware ───────────────────────────────────────────────────────
  smart:               { direct: 'https://www.smarttech.com/en-gb/education',                           network: 'direct', label: 'SMART Technologies' },
  promethean:          { direct: 'https://www.prometheanworld.com/gb/',                                 network: 'direct', label: 'Promethean' },
  benq:                { direct: 'https://www.benq.eu/en-uk/education.html',                            network: 'direct', label: 'BenQ Education' },
  epson:               { direct: 'https://www.epson.co.uk/en_GB/education',                             network: 'direct', label: 'Epson UK' },
  ipevo:               { direct: 'https://www.ipevo.com/',                                              amazon: 'https://www.amazon.co.uk/s?k=ipevo+v4k', network: 'direct', label: 'IPEVO' },
  elmo:                { direct: 'https://www.elmouk.com',                                              network: 'direct', label: 'ELMO UK' },
  viewsonic:           { direct: 'https://www.viewsonic.com/uk/',                                       network: 'direct', label: 'ViewSonic UK' },
  aver:                { direct: 'https://www.aver.com/uk/',                                            network: 'direct', label: 'AVer UK' },
  huion:               { direct: 'https://www.huion.com/uk/',                                           amazon: 'https://www.amazon.co.uk/s?k=huion+kamvas', network: 'direct', label: 'Huion' },

  // ── Audio / hearing assistance ───────────────────────────────────────────────
  phonak:              { direct: 'https://www.phonak.com/en-gb/',                                       network: 'direct', label: 'Phonak' },
  sarabec:             { direct: 'https://www.sarabec.com',                                             network: 'direct', label: 'Sarabec' },
  williamssound:       { direct: 'https://www.williamssound.com',                                       network: 'direct', label: 'Williams Sound' },

  // ── Furniture / posture / sensory ────────────────────────────────────────────
  gewa:                { direct: 'https://www.gewa.co.uk',                                              network: 'direct', label: 'Gewa UK' },
  safco:               { direct: 'https://www.safcoproducts.com',                                       network: 'direct', label: 'Safco' },
  bambach:             { direct: 'https://www.bambach.co.uk',                                           network: 'direct', label: 'Bambach' },

  // ── Wearables / safety ───────────────────────────────────────────────────────
  angelsense:          { direct: 'https://www.angelsense.com',                                          network: 'direct', label: 'AngelSense' },
  filaband:            { direct: 'https://www.filaband.co.uk',                                          network: 'direct', label: 'FilaBand' },
  buddi:               { direct: 'https://www.buddi.co.uk',                                             network: 'direct', label: 'Buddi' },
};

// ─── Supplier-name → key normaliser ───────────────────────────────────────────
//
// Real product records use free-text supplier names like "Apple/Amazon" or
// "Lenovo/School Resellers". This helper strips qualifiers and maps them to a
// registry key. Falls back to `null` when nothing matches — callers then route
// via the legacy `affiliateLink` URL but still gain tracking parameters.
//
// Order matters: we try direct prefixes (e.g. "TTS" → 'tts') before broader
// hits (e.g. anything containing "amazon" → 'amazon').

const SUPPLIER_NAME_PATTERNS: { test: RegExp; key: string }[] = [
  { test: /^apple\b/i,                  key: 'apple' },
  { test: /^lenovo\b/i,                 key: 'lenovo' },
  { test: /^microsoft\b/i,              key: 'microsoft' },
  { test: /^samsung\b/i,                key: 'samsung' },
  { test: /^asus\b/i,                   key: 'asus' },
  { test: /^remarkable\b/i,             key: 'remarkable' },
  { test: /^c-?pen\b/i,                 key: 'cpen' },
  { test: /^orcam\b/i,                  key: 'orcam' },
  { test: /^crossbow\b/i,               key: 'crossbow' },
  { test: /^tts\b/i,                    key: 'tts' },
  { test: /^hope( education)?\b/i,      key: 'hope' },
  { test: /^inclusive\b/i,              key: 'inclusive' },
  { test: /^smartbox\b/i,               key: 'smartbox' },
  { test: /^tobii\b/i,                  key: 'tobii' },
  { test: /^cerebra\b/i,                key: 'cerebra' },
  { test: /^tfh\b/i,                    key: 'tfh' },
  { test: /^lego\b/i,                   key: 'lego' },
  { test: /^sphero\b/i,                 key: 'sphero' },
  { test: /^micro:?bit\b/i,             key: 'microbit' },
  { test: /^smart\b/i,                  key: 'smart' },
  { test: /^promethean\b/i,             key: 'promethean' },
  { test: /^benq\b/i,                   key: 'benq' },
  { test: /^epson\b/i,                  key: 'epson' },
  { test: /^ipevo\b/i,                  key: 'ipevo' },
  { test: /^elmo\b/i,                   key: 'elmo' },
  { test: /^viewsonic\b/i,              key: 'viewsonic' },
  { test: /^aver\b/i,                   key: 'aver' },
  { test: /^phonak\b/i,                 key: 'phonak' },
  { test: /^sarabec\b/i,                key: 'sarabec' },
  { test: /^williams sound\b/i,         key: 'williamssound' },
  { test: /^gewa\b/i,                   key: 'gewa' },
  { test: /^safco\b/i,                  key: 'safco' },
  { test: /^bambach\b/i,                key: 'bambach' },
  { test: /^angelsense\b/i,             key: 'angelsense' },
  { test: /^filaband\b/i,               key: 'filaband' },
  { test: /^buddi\b/i,                  key: 'buddi' },
  // Catch-all for any "...Amazon" supplier where no other prefix matched.
  { test: /amazon/i,                    key: 'amazon' },
];

export function keyForSupplierName(supplierName: string | undefined | null): string | null {
  if (!supplierName) return null;
  for (const { test, key } of SUPPLIER_NAME_PATTERNS) {
    if (test.test(supplierName)) return key;
  }
  return null;
}

// ─── URL-builder helpers ──────────────────────────────────────────────────────

function withAmazonTag(url: URL, productSlug?: string): URL {
  if (AFFILIATE_CONFIG.amazonUkTag) {
    url.searchParams.set('tag', AFFILIATE_CONFIG.amazonUkTag);
  }
  if (productSlug) {
    url.searchParams.set('ascsubtag', productSlug);
  }
  return url;
}

function withUtm(url: URL, productSlug?: string): URL {
  url.searchParams.set('utm_source',   AFFILIATE_CONFIG.source);
  url.searchParams.set('utm_medium',   AFFILIATE_CONFIG.medium);
  url.searchParams.set('utm_campaign', AFFILIATE_CONFIG.campaign);
  if (productSlug) url.searchParams.set('utm_content', productSlug);
  return url;
}

function buildAwinUrl(
  destination: string,
  merchantId: string | undefined,
  productSlug?: string,
): string {
  // If we don't yet have both the publisher ID and a real merchant ID, route
  // straight to the destination with utm params — never emit a half-built Awin
  // gateway URL.
  const noPublisher = !AFFILIATE_CONFIG.awinPublisherId;
  const noMerchant  = !merchantId || merchantId.startsWith('PLACEHOLDER_');
  if (noPublisher || noMerchant) {
    try {
      const u = new URL(destination);
      withUtm(u, productSlug);
      return u.toString();
    } catch {
      return destination;
    }
  }

  // Real Awin gateway URL.
  const gateway = new URL('https://www.awin1.com/cread.php');
  gateway.searchParams.set('awinmid',  merchantId!);
  gateway.searchParams.set('awinaffid', AFFILIATE_CONFIG.awinPublisherId!);
  gateway.searchParams.set('clickref',  AFFILIATE_CONFIG.awinClickRef);
  if (productSlug) gateway.searchParams.set('clickref2', productSlug);
  gateway.searchParams.set('p', destination);
  return gateway.toString();
}

// ─── Public API ───────────────────────────────────────────────────────────────

interface BuildUrlOptions {
  /** Registry key (e.g. 'apple', 'tts'). If unknown, falls back to `fallback`. */
  supplier: string;
  /** Product slug — appended as ascsubtag/utm_content for attribution. */
  productSlug?: string;
  /** 'amazon' to prefer the Amazon route when the supplier offers both. */
  preferredRoute?: 'direct' | 'amazon';
  /** Used when the supplier key is missing from the registry. */
  fallback?: string;
}

/**
 * Build an outbound URL for a known supplier.
 *
 * If the supplier key isn't registered, returns the `fallback` URL (or '#' if
 * none) so the link still works during a partial registry rollout.
 */
export function buildAffiliateUrl({
  supplier,
  productSlug,
  preferredRoute = 'direct',
  fallback,
}: BuildUrlOptions): string {
  const entry = supplierLinks[supplier];

  // Unknown supplier: fall back to the legacy URL but still try to apply
  // tracking, so attribution survives even when the registry is incomplete.
  if (!entry) {
    if (!fallback) return '#';
    return applyTrackingToUrl(fallback, productSlug);
  }

  const base = (preferredRoute === 'amazon' && entry.amazon) ? entry.amazon : entry.direct;

  switch (entry.network) {
    case 'amazon': {
      try {
        const u = new URL(base);
        withAmazonTag(u, productSlug);
        return u.toString();
      } catch { return base; }
    }
    case 'awin': {
      return buildAwinUrl(base, entry.awinMerchantId, productSlug);
    }
    case 'direct':
    default: {
      try {
        const u = new URL(base);
        // If a "direct" supplier actually links to Amazon (e.g. Apple → Amazon
        // search variant), apply Amazon tracking instead of UTM.
        if (u.hostname.endsWith('amazon.co.uk') || u.hostname.endsWith('amazon.com')) {
          withAmazonTag(u, productSlug);
        } else {
          withUtm(u, productSlug);
        }
        return u.toString();
      } catch { return base; }
    }
  }
}

/**
 * Layer tracking parameters onto an arbitrary URL — used for fallback paths
 * where the supplier isn't in the registry.
 */
function applyTrackingToUrl(url: string, productSlug?: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('amazon.co.uk') || u.hostname.endsWith('amazon.com')) {
      withAmazonTag(u, productSlug);
    } else {
      withUtm(u, productSlug);
    }
    return u.toString();
  } catch {
    return url;
  }
}

// ─── Product-shaped resolver ──────────────────────────────────────────────────
//
// Most product cards take a full `EquipmentProduct` and just need the resolved
// outbound URL. This wrapper does the right thing for any product shape:
//   1. Use product.supplierKey if explicitly set (most explicit override).
//   2. Otherwise derive the key from product.supplierName via patterns.
//   3. Use product.preferredRoute if set; else default to 'direct'.
//   4. Pass product.affiliateLink as the fallback so unmapped suppliers still
//      go to the right merchant — they just won't get registry-level tracking.

interface ResolvableProduct {
  slug: string;
  supplierName: string;
  supplierKey?: string;
  preferredRoute?: 'direct' | 'amazon';
  affiliateLink: string;
}

export function resolveProductAffiliateUrl(product: ResolvableProduct): string {
  const explicitKey = product.supplierKey;
  const derivedKey  = explicitKey ?? keyForSupplierName(product.supplierName);

  // Auto-prefer Amazon when the supplier name explicitly says so (e.g.
  // "Apple/Amazon", "Microsoft/Amazon") and no override is set.
  const autoPreferAmazon = !product.preferredRoute && /amazon/i.test(product.supplierName);
  const preferredRoute = product.preferredRoute ?? (autoPreferAmazon ? 'amazon' : 'direct');

  if (derivedKey) {
    return buildAffiliateUrl({
      supplier:       derivedKey,
      productSlug:    product.slug,
      preferredRoute,
      fallback:       product.affiliateLink,
    });
  }

  // No registry match — apply tracking to the legacy URL.
  if (typeof console !== 'undefined' && import.meta?.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      `[affiliateLinks] No supplier mapping for "${product.supplierName}" (slug=${product.slug}). ` +
      `Falling back to product.affiliateLink with generic tracking.`,
    );
  }
  return applyTrackingToUrl(product.affiliateLink, product.slug);
}

// ─── Standard outbound link attributes ────────────────────────────────────────
//
// Spread onto every <a> that goes to an affiliate destination, so we never
// forget the right rel/target combo:
//   <a href={resolveProductAffiliateUrl(p)} {...AFFILIATE_LINK_ATTRS}>View →</a>

export const AFFILIATE_LINK_ATTRS = {
  target: '_blank',
  rel:    'sponsored noopener',
} as const;
