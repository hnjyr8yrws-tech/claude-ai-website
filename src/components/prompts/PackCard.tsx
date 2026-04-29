import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PromptPack } from '../../data/prompts';
import SENBadge from './SENBadge';
import RoleBadge from './RoleBadge';
import CopyButton from './CopyButton';

interface Props {
  pack: PromptPack;
  showPreview?: boolean;
}

const PackCard = ({ pack }: Props) => {
  const [bookmarkTooltip, setBookmarkTooltip] = useState(false);

  const firstPromptObj = pack.prompts[0];
  const firstPrompt = firstPromptObj ? (typeof firstPromptObj === 'string' ? firstPromptObj : firstPromptObj.prompt) : '';
  const extraSEN = pack.senFocus.length > 2 ? pack.senFocus.length - 2 : 0;
  const visibleSEN = pack.senFocus.slice(0, 2);
  const visibleRoles = pack.roles.slice(0, 2);

  const packNum = String(pack.id).padStart(2, '0');

  return (
    <article
      className="flex flex-col rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: '#e8e6e0' }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: '#00808a' }} />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {/* Pack number + category */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{ background: '#e0f5f6', color: '#00808a' }}
              >
                Pack {packNum}
              </span>
              <span className="text-[11px] uppercase tracking-wide font-medium" style={{ color: '#9ca3af' }}>
                {pack.category}
              </span>
            </div>
            {/* Title */}
            <h3 className="font-display text-base leading-snug mt-1" style={{ color: '#1c1a15' }}>
              {pack.title}
            </h3>
          </div>

          {/* Bookmark */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => {
                setBookmarkTooltip(true);
                setTimeout(() => setBookmarkTooltip(false), 2500);
              }}
              aria-label="Save pack"
              className="p-1.5 rounded-lg hover:bg-[#f7f6f2] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00808a]"
              style={{ color: '#c5c2bb' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 2h10a1 1 0 011 1v11l-6-3-6 3V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </button>
            {bookmarkTooltip && (
              <div
                className="absolute right-0 top-8 z-10 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-lg"
                style={{ background: '#1c1a15', color: '#f7f6f2' }}
              >
                Sign in to save — coming soon
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#6b6760' }}>
          {pack.description}
        </p>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          {/* Free preview */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: '#f0fdf4', color: '#15803d' }}
          >
            Free Preview
          </span>
          {/* Prompt count */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{ background: '#f7f6f2', color: '#6b6760', border: '1px solid #e8e6e0' }}
          >
            {pack.promptCount} prompts
          </span>
        </div>

        {/* SEN badges */}
        {visibleSEN.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            {visibleSEN.map((tag) => (
              <SENBadge key={tag} tag={tag} />
            ))}
            {extraSEN > 0 && (
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>+{extraSEN} more</span>
            )}
          </div>
        )}

        {/* Role badges */}
        {visibleRoles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleRoles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t flex-wrap" style={{ borderColor: '#e8e6e0' }}>
          <Link
            to={`/prompts/pack/${pack.slug}`}
            className="flex-1 text-center text-sm font-semibold px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00808a]"
            style={{ background: '#00808a', color: 'white' }}
          >
            View Pack →
          </Link>
          {firstPrompt && (
            <CopyButton text={firstPrompt} size="sm" />
          )}
        </div>
      </div>
    </article>
  );
};

export default PackCard;
