/**
 * affiliateLinks.ts
 *
 * Central affiliate/supplier link resolver.
 * All outbound equipment links should go through buildAffiliateUrl()
 * so partner IDs are managed in one place.
 *
 * Replace the placeholder tag/clickref values with your actual approved
 * partner IDs before launch.
 */

const AFFILIATE_CONFIG = {
  amazonUkTag:  'getpromptly-21',   // Amazon Associates UK tracking tag
  awinClickRef: 'getpromptly',      // Awin click reference
  campaign:     'getpromptly_equipment',
} as const;

interface SupplierEntry {
  direct: string;
  amazon?: string;
}

export const supplierLinks: Record<string, SupplierEntry> = {
  apple:              { direct: 'https://www.apple.com/uk-edu/store',                             amazon: 'https://www.amazon.co.uk/s?k=Apple+iPad+education' },
  amazon:             { direct: 'https://www.amazon.co.uk' },
  cpen:               { direct: 'https://www.scanningpens.co.uk/',                                amazon: 'https://www.amazon.co.uk/s?k=C-Pen+Reader+2' },
  tts:                { direct: 'https://www.tts-group.co.uk/',                                   amazon: 'https://www.amazon.co.uk/s?k=TTS+Bee-Bot' },
  smart:              { direct: 'https://www.smarttech.com/en-gb/education' },
  promethean:         { direct: 'https://www.prometheanworld.com/gb/' },
  benq:               { direct: 'https://www.benq.eu/en-uk/education.html' },
  epson:              { direct: 'https://www.epson.co.uk/en_GB/education' },
  ipevo:              { direct: 'https://www.ipevo.com/' },
  lego:               { direct: 'https://education.lego.com/en-gb/' },
  sphero:             { direct: 'https://sphero.com/' },
  microbit:           { direct: 'https://microbit.org/' },
  remarkable:         { direct: 'https://remarkable.com/' },
  inclusiveTechnology:{ direct: 'https://www.inclusive.co.uk/' },
};

interface BuildUrlOptions {
  supplier: string;
  productSlug?: string;
  preferredRoute?: 'direct' | 'amazon';
}

export function buildAffiliateUrl({
  supplier,
  productSlug,
  preferredRoute = 'direct',
}: BuildUrlOptions): string {
  const entry = supplierLinks[supplier];
  if (!entry) return '#';

  const base = (preferredRoute === 'amazon' && entry.amazon) ? entry.amazon : entry.direct;

  try {
    const url = new URL(base);

    if (url.hostname.includes('amazon.co.uk')) {
      url.searchParams.set('tag', AFFILIATE_CONFIG.amazonUkTag);
      if (productSlug) url.searchParams.set('ascsubtag', productSlug);
      return url.toString();
    }

    // UTM params for non-Amazon suppliers
    url.searchParams.set('utm_source',   'getpromptly');
    url.searchParams.set('utm_medium',   'affiliate');
    url.searchParams.set('utm_campaign', AFFILIATE_CONFIG.campaign);
    if (productSlug) url.searchParams.set('utm_content', productSlug);
    return url.toString();
  } catch {
    return base;
  }
}
