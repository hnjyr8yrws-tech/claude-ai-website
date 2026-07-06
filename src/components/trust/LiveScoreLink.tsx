import { Link } from 'react-router-dom';

export interface LiveScoreLinkProps {
  /** Destination — the tool's live review page (TrustDisplayModel.livePageUrl).
   *  Internal paths ("/tools/…") use the router; absolute URLs open a new tab. */
  url: string;
  label?: string;
  /** Set when rendered on a dark surface (beside/inside the Pillar Card): lime
   *  text per §16. On light surfaces the accessible dark-lime substitute
   *  (--color-ink-accent) is used — lime on light is 1.4:1 and fails §20 AA. */
  onDark?: boolean;
  className?: string;
}

/**
 * The Rule 4b live-score link: every displayed score carries a dated stamp AND
 * a link to the live score. Deliberately plain — a text link, never a button.
 */
export function LiveScoreLink({ url, label = 'View live score', onDark = false, className }: LiveScoreLinkProps) {
  const cls = [
    'font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const style = { color: onDark ? 'var(--color-promptly-lime)' : 'var(--color-ink-accent)' };
  const external = /^https?:\/\//i.test(url);

  return external ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
      {label} →
    </a>
  ) : (
    <Link to={url} className={cls} style={style}>
      {label} →
    </Link>
  );
}
