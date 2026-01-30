/**
 * Paste URL input with submit and loading state.
 */
export function UrlInput({ value, onChange, onSubmit, loading, placeholder, disabled }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Paste Instagram or Snapchat reel URL...'}
          disabled={disabled}
          className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          autoComplete="url"
        />
        <button
          type="submit"
          disabled={disabled || loading || !value?.trim()}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition shrink-0"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Fetching…
            </span>
          ) : (
            'Fetch'
          )}
        </button>
      </div>
    </form>
  );
}
