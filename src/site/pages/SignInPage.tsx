/**
 * Sign in (design v0.5, Part J): the Meet Luna page, as the one place to sign in or join.
 *
 * LIVE-SITE DEPARTURE, for the founders to confirm: the approved design is a mock (Google, Apple and Continue do
 * nothing). Accounts, sign-in and payment do not exist yet, so the live card does not pretend to sign anyone in. It
 * keeps the page, the two modes and the wording, and its one action is an email to Promptly asking to be told when
 * membership opens. Nothing is collected or stored by the page. Swap the card back when membership is real.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/signin.css';
import { Footer, Header, Page } from '../Chrome';
import { sample, type PublicTool } from '../data';

const ASKS = ['Is there anything for Year 5 maths practice?', 'Which planning tools keep pupil data in the UK?', 'What should we ask a vendor before we sign?',
  'Is this reading app safe for my 12-year-old?', 'My daughter wants to use a chatbot for homework. Where do I start?', 'How does Promptly review a tool?'];
const NOTIFY = 'mailto:info@getpromptly.co.uk?subject=' + encodeURIComponent('Tell me when Promptly membership opens');

interface Row { items: PublicTool[]; label: string; scroll?: boolean }

/** The bookcase: a picture of the library, laid out by BL-03's own rule and re-measured with the width (Part J5). */
export function Bookcase({ deskRef }: { deskRef: React.RefObject<HTMLDivElement> }) {
  const items = sample(34);
  const caseRef = useRef<HTMLDivElement>(null);
  const shelvesRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const spine = (t: PublicTool) => (
    <button type="button" className="lbk tool cd-inert" key={t.slug} tabIndex={-1} aria-hidden="true">
      <span className="lbk-l fr" aria-hidden="true">{t.letter}</span><span className="lbk-tx"><span className="lbk-t fr">{t.name}</span></span>
    </button>
  );
  const pack = () => {
    const shelves = shelvesRef.current, box = caseRef.current, desk = deskRef.current;
    if (!shelves || !box || !desk || !shelves.getBoundingClientRect().width) return;
    const narrow = window.matchMedia('(max-width: 1000px)').matches;
    // the case stands one row (the sign-up switch) shorter than the card, as in the approved render
    const sw = desk.querySelector<HTMLElement>('.cdl-switch');
    const was = sw ? sw.style.display : '';
    if (sw) sw.style.display = 'none';
    const dh = Math.round(desk.getBoundingClientRect().height);
    if (sw) sw.style.display = was;
    // the live card is shorter than the approved mock's (no sign-in buttons yet), so the case never stands shorter than three shelves need
    box.style.height = narrow ? '' : Math.max(dh, 836) + 'px';
    const widths = new Map<string, number>();
    box.querySelectorAll<HTMLElement>('.pv-measure .lbk').forEach((e, i) => widths.set(items[i].slug, e.getBoundingClientRect().width));
    const avail = shelves.getBoundingClientRect().width - 16, gap = 8;
    let out: Row[] = [];
    if (narrow) {
      const per = Math.ceil(items.length / 4) || 1;
      for (let i = 0; i < items.length; i += per) out.push({ items: items.slice(i, i + per), label: '', scroll: true });
    } else {
      let row: PublicTool[] = [], w = 0;
      for (const s of items) {
        let sw2 = (widths.get(s.slug) ?? 53) + (row.length ? gap : 0);
        if (row.length && w + sw2 > avail) { out.push({ items: row, label: '' }); row = []; w = 0; sw2 = widths.get(s.slug) ?? 53; }
        row.push(s); w += sw2;
      }
      if (row.length) out.push({ items: row, label: '' });
      if (out.length > 1) {   // share the spines evenly across the shelves the width needs, when every shelf still fits
        const per2 = Math.ceil(items.length / out.length), even: Row[] = [];
        for (let j = 0; j < items.length; j += per2) even.push({ items: items.slice(j, j + per2), label: '' });
        if (even.every((r) => r.items.reduce((a, s) => a + (widths.get(s.slug) ?? 53) + gap, -gap) <= avail)) out = even;
      }
    }
    out.forEach((r) => { const a = r.items[0]?.letter, b = r.items[r.items.length - 1]?.letter; r.label = !a ? '' : a === b ? a : `${a}–${b}`; });
    while (out.length < 3) out.push({ items: [], label: '' });
    setRows(out);
  };
  useLayoutEffect(pack, []);
  useEffect(() => {
    let timer: number;
    const onResize = () => { window.clearTimeout(timer); timer = window.setTimeout(pack, 120); };
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(() => window.setTimeout(pack, 0));   // the spines are measured in the site's fonts
    return () => { window.removeEventListener('resize', onResize); window.clearTimeout(timer); };
  }, []);
  return (
    <div className="case" id="library" ref={caseRef} aria-labelledby="case-h">
      <h2 className="vh" id="case-h">The library: titles from A to Z</h2>
      <div className="books pv-measure" aria-hidden="true" style={{ position: 'absolute', left: -9999, top: 0, visibility: 'hidden', width: 9000 }}>{items.map(spine)}</div>
      {/* a picture: nothing in it is a link, focusable or announced */}
      <div className="shelves" id="shelves" ref={shelvesRef} {...{ inert: '' }}>
        {rows.map((r, i) => (
          <div className={'shelf' + (r.scroll ? ' scroll' : '')} key={i}>
            {r.label && <p className="shelf-label m">{r.label}</p>}
            <div className="books">{r.items.map(spine)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SignInPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'join'>(params.get('mode') === 'join' ? 'join' : 'signin');
  const desk = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLHeadingElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  useEffect(() => { setMode(params.get('mode') === 'join' ? 'join' : 'signin'); }, [params]);
  const switchTo = (m: 'signin' | 'join') => { setMode(m); label.current?.focus(); };
  const headerSignIn = () => { setMode('signin'); gate.current?.scrollIntoView({ block: 'center' }); label.current?.focus({ preventScroll: true }); };
  return (
    <Page family="pv-luna" path="/sign-in" title="Sign in — Promptly" description="Meet Luna, Promptly’s librarian. Membership is opening soon.">
      <Header onSignIn={headerSignIn} />
      <main id="main" tabIndex={-1}>
        <section className="page lu-page on" id="luna" data-state="out" aria-labelledby="h-luna"><section className="band luna-band" aria-labelledby="h-luna"><div className="shell open">
          <div className="desk" ref={desk}>
            <p className="kicker">Promptly’s librarian</p>
            <h1 className="fr" id="h-luna">Meet Luna</h1>
            <p className="sentence">She is here to answer your next question.</p>
            <div className="line" id="gate" ref={gate} data-mode={mode} style={{ display: 'block' }}>
              <h2 className="lab" id="gate-h" ref={label} tabIndex={-1}>{mode === 'join' ? 'Become a member' : 'Sign in to ask'}</h2>
              <p className="scope" style={{ marginTop: 14, marginBottom: 14 }}>Membership is opening soon. Email us and we’ll tell you when it does.</p>
              <div className="field" style={{ border: 0 }}>
                <a className="btn-lime" href={NOTIFY} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', width: '100%' }}>Tell me when it opens</a>
              </div>
              <p className="cdl-switch">
                {mode === 'join'
                  ? <>Already a member?<button type="button" onClick={() => switchTo('signin')}>Sign in</button></>
                  : <>New to Promptly?<button type="button" onClick={() => switchTo('join')}>Become a member</button></>}
              </p>
              <p className="scope">{mode === 'join' ? 'Members can ask Luna about the tools in the library. ' : 'Sign in to ask Luna. '}<Link to="/legal#privacy">Privacy notice</Link></p>
              <div className="asks"><p className="lab">What readers ask Luna</p><ul className="askl" id="askl">{ASKS.map((a) => <li key={a}>{a}</li>)}</ul></div>
            </div>
          </div>
          <Bookcase deskRef={desk} />
          <p className="cdl-small">Titles from the library, A to Z. Being listed isn’t a recommendation.</p>
        </div></section></section>
      </main>
      <Footer />
    </Page>
  );
}

/**
 * Meet Luna with her bookcase, as a band for another page (About us; CR, 10 November 2026: "where is lunas bookshelf …
 * can this go on the about us page"). The same heading, sentence and bookcase as the Sign in page, with one way in.
 */
export function MeetLunaBand() {
  const desk = useRef<HTMLDivElement>(null);
  return (
    <div className="pv-luna pv-embed">
      <section className="page lu-page on" data-state="out" aria-labelledby="h-meet-luna"><section className="band luna-band" aria-labelledby="h-meet-luna"><div className="shell open">
        <div className="desk" ref={desk}>
          <p className="kicker">Promptly’s librarian</p>
          <h2 className="fr ml-h" id="h-meet-luna">Meet Luna</h2>
          <p className="sentence">She is here to answer your next question.</p>
          <div className="line" style={{ display: 'block' }}>
            <h3 className="lab">Luna is for members</h3>
            <p className="scope" style={{ marginTop: 14, marginBottom: 14 }}>She’ll guide you, and she won’t guess.</p>
            <div className="field" style={{ border: 0 }}>
              <Link className="btn-lime" to="/sign-in?mode=join" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', width: '100%' }}>Become a member</Link>
            </div>
            <div className="asks"><p className="lab">What readers ask Luna</p><ul className="askl">{ASKS.map((a) => <li key={a}>{a}</li>)}</ul></div>
          </div>
        </div>
        <Bookcase deskRef={desk} />
        <p className="cdl-small">Titles from the library, A to Z. Being listed isn’t a recommendation.</p>
      </div></section></section>
    </div>
  );
}
