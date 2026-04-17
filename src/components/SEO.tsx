import { Helmet } from 'react-helmet-async';

const BASE_URL  = 'https://www.getpromptly.co.uk';
const OG_IMAGE  = `${BASE_URL}/og-image.png`; // 1200×630 — add to /public when ready

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  path: string;           // e.g. '' | '/tools' | '/equipment' | '/training'
  jsonLd?: object | object[];
}

export default function SEO({ title, description, keywords, path, jsonLd }: SEOProps) {
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{title}</title>
      <meta name="description"  content={description} />
      <meta name="keywords"     content={keywords} />
      <link rel="canonical"     href={canonical} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:site_name"   content="GetPromptly" />
      <meta property="og:locale"      content="en_GB" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@GetPromptly" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={OG_IMAGE} />

      {/* ── JSON-LD structured data ── */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd], null, 2)}
        </script>
      )}
    </Helmet>
  );
}
