/**
 * Client-side download history list with clear button.
 */
export function DownloadHistory({ history, clear: onClear }) {
  if (!history?.length) return null;

  return (
    <section className="mt-8 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Recent downloads
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {history.slice(0, 10).map((item, i) => (
          <li
            key={`${item.url}-${item.at}-${i}`}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <span className="capitalize shrink-0 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">
              {item.platform}
            </span>
            <span className="truncate flex-1">{item.title}</span>
            <span className="text-xs shrink-0">{item.type === 'audio' ? 'MP3' : 'MP4'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
