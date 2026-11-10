/**
 * The public site's shared chrome (design v0.5, Part A): one header and one footer on every page.
 * Markup and class names follow the approved prototype exactly, so its scoped stylesheets apply unchanged.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark';
import { AREAS, MAIL, REQUEST } from './data';

export type Family = 'pv-site' | 'pv-lib' | 'pv-luna';
export type NavKey = 'reviews' | 'how' | 'membership' | 'about';

const NAV: [NavKey, string, string][] = [
  ['reviews', '/tools', 'Reviews'],
  ['how', '/how-we-review', 'How we review'],
  ['membership', '/membership', 'Membership'],
  ['about', '/about', 'About us'],
];

export function Wordmark({ label }: { label?: string }) {
  return (
    <svg className="wm" viewBox={WORDMARK_VIEWBOX} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}>
      <g transform="scale(1,-1)">{WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
    </svg>
  );
}

/** The header: Promptly, the four links and Sign in; below 760 px a Menu button opens the links underneath. */
export function Header({ current, currentValue = 'page', onSignIn }: { current?: NavKey; currentValue?: 'page' | 'true'; onSignIn?: () => void }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <header className={'mast m9 m9-dark' + (open ? ' m9-open' : '')} id="top">
      <div className="m9-in">
        <Link className="m9-wm" to="/" aria-label="Promptly, home"><Wordmark /></Link>
        <nav className="m9-nav" id="m9-nav" aria-label="Main">
          <ul>
            {NAV.map(([k, to, text]) => (
              <li key={k}><Link to={to} data-nav={k} aria-current={k === current ? currentValue : undefined} onClick={() => setOpen(false)}>{text}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="m9-tools">
          <Link className="m9-signin signin-m" to="/sign-in" onClick={onSignIn ? (e) => { e.preventDefault(); onSignIn(); } : undefined}>Sign in</Link>
          <button ref={button} className="m9-menu" type="button" aria-expanded={open} aria-controls="m9-nav" onClick={() => setOpen(!open)}>
            <span className="m9-mt">{open ? 'Close' : 'Menu'}</span><span className="m9-mi" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="f9">
      <div className="f9-in">
        <div className="f9-grid">
          <div className="f9-brand">
            <Link className="f9-wm" to="/" aria-label="Promptly, home"><Wordmark /></Link>
            <p className="f9-ind">Independent: no commission, referral fees, paid placements or sponsored rankings.</p>
          </div>
          <nav className="f9-nav" aria-labelledby="f9-site">
            <p className="f9-lab" id="f9-site">Promptly</p>
            <ul>
              {NAV.map(([k, to, text]) => <li key={k}><Link to={to}>{text}</Link></li>)}
              <li><Link to="/#safe-mode">Safe Mode</Link></li>
            </ul>
          </nav>
          <div className="f9-ct">
            <p className="f9-lab">Contact</p>
            <p><a className="f9-mail" href={MAIL}>info@getpromptly.co.uk</a></p>
            <p className="f9-s">We reply within 48 hours.</p>
            <p><a href={REQUEST}>Ask us to review a tool</a></p>
          </div>
        </div>
        <p className="f9-legal">
          <span>GetPromptly Ltd</span><span>Registered in England and Wales</span><span>Company no. 17137647</span>
          <Link to="/legal">Legal</Link><Link to="/legal#privacy">Privacy notice</Link>
        </p>
      </div>
    </footer>
  );
}

/** After a route change: land on the section the address names, or at the top of the page. */
export function useLanding() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    const el = id ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
}

/** One page: its family's scoped styles, the skip link, and its title and description. */
export function Page({ family, title, description, path, children }: { family: Family; title: string; description: string; path: string; children: ReactNode }) {
  useLanding();
  return (
    <div className={'pv ' + family} {...(family === 'pv-luna' ? { 'data-route': 'luna' } : {})}>
      <SEO title={title} description={description} keywords="AI tools for schools, AI in education, Promptly reviews" path={path} />
      <a className={family === 'pv-site' ? 'skip9' : 'skip'} href="#main">Skip to content</a>
      {children}
    </div>
  );
}

/** The five-area key: five names, each under its area's colour. The colour names the area; it never grades it. */
export function AreaKey({ className, labelledBy, label }: { className?: string; labelledBy?: string; label?: string }) {
  return (
    <ul className={className} aria-labelledby={labelledBy} aria-label={label}>
      {AREAS.map(([name, colour]) => <li key={name} style={{ ['--c' as string]: colour }}>{name}</li>)}
    </ul>
  );
}
