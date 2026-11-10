/**
 * Reviews, the public tool pages and the Standing Record (design v0.5, Parts G, H and I).
 *
 * Founder decisions, 10 November 2026: no scores on the public site, and every tool is shown as under review until it
 * has been reviewed under the updated methodology. So a card and a tool page say what a tool is for and that it is
 * under review; they show no score, outcome, finding or date.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import '../styles/library.css';
import { AreaKey, Footer, Header, Page } from '../Chrome';
import { CATEGORIES, HELD_LETTERS, JOIN, LETTERS, MAIL, PUBLIC_TOOLS, REQUEST, WHO, findTool, search, type PublicTool } from '../data';
import { getHistoricRecord } from '../../data/historic';

const UNDER_REVIEW = 'We’re reviewing this tool under our updated method.';

/** A select as wide as its chosen words, so the filter reads as a sentence (the prototype's rule). */
function FitSelect({ id, value, onChange, children }: { id: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLSelectElement>(null);
  const fit = () => {
    const el = ref.current; if (!el) return;
    const sizer = document.createElement('span');
    sizer.className = 'sizer fr'; sizer.setAttribute('aria-hidden', 'true');
    sizer.style.fontSize = getComputedStyle(el).fontSize;
    sizer.textContent = el.options[el.selectedIndex]?.text ?? '';
    el.parentElement!.appendChild(sizer);
    el.style.width = Math.ceil(sizer.getBoundingClientRect().width + 30) + 'px';
    sizer.remove();
  };
  useLayoutEffect(fit);
  useEffect(() => {
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return <select ref={ref} id={id} value={value} onChange={(e) => onChange(e.target.value)}>{children}</select>;
}

// ---------------------------------------------------------------------------------------------------------- Reviews
export function ReviewsPage() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');   // the homepage's "Look a tool up" hands its words over in the address
  const [category, setCategory] = useState('');
  const [who, setWho] = useState('');
  useEffect(() => { setQ(params.get('q') ?? ''); }, [params]);

  const results = useMemo(() => search(q), [q]);
  const shown = useMemo(() => {
    const group = WHO.find(([k]) => k === who)?.[2];
    return PUBLIC_TOOLS.filter((t) => (!category || t.category === category) && (!group || t.audience.some((a) => group.includes(a))));
  }, [category, who]);
  const byLetter = useMemo(() => {
    const m = new Map<string, PublicTool[]>();
    for (const t of shown) m.set(t.letter, [...(m.get(t.letter) ?? []), t]);
    return m;
  }, [shown]);
  const filtered = !!(category || who);

  return (
    <Page family="pv-lib" path="/tools" title="Reviews — Promptly" description="The library, A to Z: find the AI tool you’re considering, by name or by what it’s used for.">
      <Header current="reviews" />
      <main id="main" tabIndex={-1}>
        <section className="page on" id="reviews" aria-labelledby="h-reviews">
          <div className="band dark"><div className="shell">
            <p className="lab rv-eye">Reviews</p>
            <h1 className="fr pg-h" id="h-reviews">The library, A to Z.</h1>
            <div className="two-ways">
              <div className="tw-l">
                <p className="pg-p">Find the tool you’re considering, by name or by what it’s used for.</p>
                <form className="look look-b" role="search" onSubmit={(e) => e.preventDefault()}>
                  <label className="lab" htmlFor="q-index">Look a tool up</label>
                  <div className="look-f"><input id="q-index" type="search" placeholder="Tool name, or what it’s used for" autoComplete="off" spellCheck={false} value={q} onChange={(e) => setQ(e.target.value)} /></div>
                  <p className="look-s" aria-live="polite">{results === null ? '' : results.length === 0 ? 'No match.' : results.length === 1 ? '1 match.' : `${results.length} matches, closest first.`}</p>
                  <ol className="res">
                    {results?.length === 0 && (
                      <li className="r-none">
                        <p>Promptly has no published assessment record for “{q.trim()}”.</p>
                        <p>That is not a judgement about the tool, and it does not mean a review is planned. <a href={'mailto:info@getpromptly.co.uk?subject=' + encodeURIComponent('Please review ' + q.trim())}>Ask us to review it</a>.</p>
                      </li>
                    )}
                    {results?.slice(0, 6).map(({ tool, why }) => (
                      <li key={tool.slug}><Link to={'/tools/' + tool.slug}>
                        <span className="r-n fr">{tool.name}</span><span className="r-t">Review</span><span className="r-i">{tool.category} · {tool.subcategory}</span>
                        {why && <span className="r-w">{why}</span>}
                      </Link></li>
                    ))}
                  </ol>
                </form>
              </div>
              <aside className="la" aria-labelledby="la-h">
                <p className="lab" id="la-h">Or ask Luna</p>
                <p className="fr la-p">She’ll guide you, and she won’t guess.</p>
                {/* the prototype's second example named an invented tool; the live site asks the same question without one */}
                <ul className="la-q" aria-label="Questions readers ask Luna"><li>“Which planning tools keep pupil data in the UK?”</li><li>“Is this reading app safe for my 12-year-old?”</li></ul>
                <div className="la-acts"><Link className="la-btn" to={JOIN}>Become a member</Link></div>
                <p className="la-s">Luna is for members.</p>
              </aside>
            </div>
            <nav className="az" aria-label="Jump to a letter"><ol>
              {LETTERS.map((c) => (
                <li key={c}>{byLetter.has(c) ? <a className="fr" href={'#letter-' + c.toLowerCase()}>{c}</a> : <span className="fr" title={(HELD_LETTERS.has(c) ? 'Nothing shown under ' : 'No reviews under ') + c}>{c}</span>}</li>
              ))}
            </ol></nav>
          </div></div>
          <div className="shell">
            {/* the prototype filters by age and by who uses a tool; the live library records what a tool is for and who uses it, so the first choice is the purpose */}
            <form className="sentence" aria-describedby="flt-n" onSubmit={(e) => e.preventDefault()}>
              <p className="sent fr">Show me reviews for <label className="vh" htmlFor="f-ks">What it’s for</label>
                <FitSelect id="f-ks" value={category} onChange={setCategory}>
                  <option value="">any purpose</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toLowerCase() + c.slice(1)}</option>)}
                </FitSelect> used by <label className="vh" htmlFor="f-who">Who uses it</label>
                <FitSelect id="f-who" value={who} onChange={setWho}>
                  <option value="">anyone</option>
                  {WHO.map(([k, text]) => <option key={k} value={k}>{text}</option>)}
                </FitSelect>.</p>
              <p className="flt-n vh" id="flt-n" aria-live="polite">{filtered ? `${shown.length} ${shown.length === 1 ? 'tool' : 'tools'} shown.` : ''}</p>
            </form>
            <div className="lgs">
              {[...byLetter.keys()].map((c) => (
                <section className="lg" id={'letter-' + c.toLowerCase()} key={c} aria-labelledby={'lg-' + c}>
                  <h2 className="fr lg-c" id={'lg-' + c}>{c}</h2>
                  <ol className="rws">
                    {byLetter.get(c)!.map((t) => (
                      <li className="rw" key={t.slug}>
                        <div className="rw-m">
                          <h3 className="fr rw-n"><Link className="rw-a" to={'/tools/' + t.slug}>{t.name}</Link></h3>
                          <p className="rw-i">{t.category} · {t.subcategory}</p>
                          <p className="rw-l">{t.what}</p>
                        </div>
                        <div className="rw-s rw-p9"><p className="rw-tag9 ur">Under review</p><p className="rw-go" aria-hidden="true">Open</p></div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            <div className="not-here" id="request">
              <h2 className="fr">Not on the shelf?</h2>
              <p>Every good library takes requests. Tell us which AI tool you’re considering and we’ll add it to our reading list.</p>
              <p className="req9"><a className="btn" href={REQUEST}>Ask for a review</a><span>or email <a href={MAIL}>info@getpromptly.co.uk</a></span></p>
              <p className="req-small">We reply within 48 hours. A request doesn’t guarantee a review or change its outcome.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- a tool page
function MembersBand() {
  return (
    <section className="tp-mem" aria-labelledby="tp-mem-h"><div className="shell"><div className="tp-mem-in">
      <div>
        <p className="lab">For members</p>
        <h2 className="fr" id="tp-mem-h">The full review is for members.</h2>
        <p className="tp-mem-p">See who it suits, what to look out for and what to do before you use it, with the evidence behind every finding.</p>
        <p className="tp-acts"><Link className="btn" to={JOIN}>Become a member</Link><Link className="go" to="/sign-in">Sign in</Link></p>
      </div>
      <div>
        <p className="lab" id="tp-a5-h">What we found, in five areas</p>
        <AreaKey className="tp-a5" labelledBy="tp-a5-h" />
        <ul className="tp-more" aria-label="Also for members">
          <li>Who can use it, and at what ages</li>
          <li>What to look out for, and what to do before you use it</li>
          <li>The evidence behind every finding</li>
          <li>Every change to the review, and what to do about it</li>
        </ul>
      </div>
    </div></div></section>
  );
}

export function ToolPage() {
  const { slug } = useParams();
  const tool = findTool(slug);
  const retired = getHistoricRecord(slug);
  const name = tool?.name ?? retired?.name;
  if (!name) return <NotFoundPage />;
  const letter = name.trim().charAt(0).toUpperCase();
  return (
    <Page family="pv-lib" path={'/tools/' + slug} title={`${name} — Promptly`} description={tool ? `${name}: ${tool.what}` : `${name} has been retired. Promptly keeps the record.`}>
      <Header current="reviews" currentValue="true" />
      <main id="main" className="tp">
        <section className="tp-top"><div className="shell">
          <p className="tp-crumb"><Link to="/tools">Reviews</Link> / {HELD_LETTERS.has(letter) ? <Link to={'/tools#letter-' + letter.toLowerCase()}>{letter}</Link> : letter}</p>
          <p className="tp-k"><span className="lab">Review</span></p>
          <h1 className="fr tp-h" id="h-tool">{name}</h1>
          {tool && <p className="tp-ed">{tool.category} · {tool.subcategory}</p>}
          {tool
            ? <p className="tp-status"><span className="tp-chip ur">Under review</span><span className="tp-weekly">{UNDER_REVIEW}</span></p>
            : <p className="tp-status"><span className="tp-chip">Retired</span>{retired?.retiredDate && <span className="tp-weekly">Retired on <time dateTime={retired.retiredDate}>{new Date(retired.retiredDate + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time></span>}</p>}
        </div></section>
        {tool ? (
          <section className="tp-for" aria-labelledby="tp-for-h"><div className="shell">
            <h2 className="lab" id="tp-for-h">What it’s for</h2>
            <p className="fr tp-for-t">{tool.what}</p>
            <p className="tp-small">Being listed isn’t a recommendation. Whether to use a tool is your decision.</p>
          </div></section>
        ) : (
          <section className="tp-for" aria-labelledby="tp-for-h"><div className="shell">
            <h2 className="lab" id="tp-for-h">What it was</h2>
            <p className="fr tp-for-t">{retired!.description}</p>
            <p className="tp-small">This tool is no longer available. Promptly keeps the record and no longer reviews it.</p>
          </div></section>
        )}
        {tool && <MembersBand />}
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- the Standing Record
export function RecordPage() {
  return (
    <Page family="pv-lib" path="/standing-record" title="The Standing Record — Promptly" description="The Standing Record is the full history of every Promptly review: what changed, when and why.">
      <Header current="how" currentValue="true" />
      <main id="main" className="sr2">
        <section className="sr2-top"><div className="shell">
          <p className="lab sr2-k"><Link to="/how-we-review">How we review</Link></p>
          <h1 className="fr pg-h" id="h-record">The Standing Record</h1>
          <p className="pg-p">The Standing Record is the full history of every Promptly review. Each time a review is corrected, re-checked or updated, we log what changed, when and why.</p>
          <p className="lab sr2-kl" id="sr2-kl">What goes on the record</p>
          <ul className="sr2-kinds" aria-labelledby="sr2-kl"><li>Corrections</li><li>Reviews being checked again</li><li>Changed findings</li><li>New reviews</li><li>Re-checks</li><li>New evidence</li></ul>
        </div></section>
        <section className="sr2-join" aria-labelledby="join-h"><div className="shell j-grid">
          <div className="j-copy">
            <p className="lab">For members</p>
            <h2 className="fr j-h" id="join-h">Follow the tools you use.</h2>
            <div className="acts"><Link className="btn" to={JOIN}>Become a member</Link><Link className="go" to="/sign-in">Sign in</Link></div>
          </div>
          <ol className="j-list">
            <li><span className="j-n m">01</span><p><b>See every change to the tools on your shelf.</b> The full record, for the tools you use.</p></li>
            <li><span className="j-n m">02</span><p><b>Know what to do.</b> Clear steps for each change, to tick off in your portal.</p></li>
            <li><span className="j-n m">03</span><p><b>Be ready when someone asks.</b> The history is kept, so you can show what changed and when.</p></li>
          </ol>
        </div></section>
      </main>
      <Footer />
    </Page>
  );
}

// ---------------------------------------------------------------------------------------------------------- not found
export function NotFoundPage() {
  return (
    <Page family="pv-lib" path="/tools" title="Page not found — Promptly" description="This page isn’t in the library.">
      <Header />
      <main id="main" className="tp">
        <section className="tp-top"><div className="shell">
          <p className="tp-k"><span className="lab">Not found</span></p>
          <h1 className="fr tp-h">This page isn’t in the library.</h1>
          <p className="tp-status"><span className="tp-weekly">It may have moved. <Link to="/tools" style={{ color: 'inherit' }}>Look a tool up, A to Z</Link>.</span></p>
        </div></section>
      </main>
      <Footer />
    </Page>
  );
}
