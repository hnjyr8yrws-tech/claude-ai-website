import { Link } from 'react-router-dom';
import { track, type TrustSurface } from '@/utils/analytics';

export interface LiveScoreLinkProps {
  /** Destination — the tool's live review page (TrustDisplayModel.livePageUrl).
   *  Internal paths ("/tools/…") use the router; absolute URLs open a new tab. */
  url: string;
  label?: string;
  /** Set when rendered on a dark surface (beside/inside the Pillar Card): lime
   *  text per §16. On light surfaces the accessible dark-lime substitute
   *  (--color-ink-accent) is used — lime on light is 1.4:1 and fails §20 AA. */
  onDark?: boolean;
  /** §11: when set, a click fires `live_score_clicked` with these props. */
  analytics?: {
    surface: TrustSurface;
    toolId?: string;
    methodologyVersion?: string;
    integrityState?: string;
    displayState?: string;
  };
  className?: string;
}

/**
 * The Rule 4b live-score link: every displayed score carries a dated stamp AND
 * a link to the live score. Deliberately plain — a text link, never a button.
 */
export function LiveScoreLink({ url, label = 'View live score', onDark = false, analytics, className }: LiveScoreLinkProps) {
  const cls = [
    'font-medium underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const style = { color: onDark ? 'var(--color-promptly-lime)' : 'var(--color-ink-accent)' };
  const external = /^https?:\/\//i.test(url);
  // Fires before navigation proceeds (synchronous) — no preventDefault.
  const onClick = analytics
    ? () => track({ name: 'live_score_clicked', url, ...analytics })
    : undefined;

  return external ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls} style={style} onClick={onClick}>
      {label} →
    </a>
  ) : (
    <Link to={url} className={cls} style={style} onClick={onClick}>
      {label} →
    </Link>
  );
}
