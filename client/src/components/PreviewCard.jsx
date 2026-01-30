/**
 * Preview card: thumbnail, title, duration, platform badge.
 */
export function PreviewCard({ data, onCopyLink, shareUrl }) {
  if (!data) return null;
  const { title, thumbnail, duration, platform } = data;
  const durationStr = duration
    ? `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`
    : '—';

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-lg">
      <div className="aspect-[9/16] max-h-80 relative bg-slate-200 dark:bg-slate-700">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H6V8l4 3 2-2 4 4 2-2 2 3V18z"/></svg>
          </div>
        )}
        <span className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium bg-black/60 text-white capitalize">
          {platform}
        </span>
        <span className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-medium bg-black/60 text-white">
          {durationStr}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-3">
          {title || 'Reel'}
        </h3>
        {shareUrl && (
          <button
            type="button"
            onClick={onCopyLink}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Copy shareable link
          </button>
        )}
      </div>
    </article>
  );
}
