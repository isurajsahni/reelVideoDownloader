/**
 * Video (MP4) and Audio (MP3) download buttons with progress.
 */
import { useState } from 'react';

export function DownloadButtons({ onDownloadVideo, onDownloadAudio, disabled }) {
  const [videoProgress, setVideoProgress] = useState(null);
  const [audioProgress, setAudioProgress] = useState(null);

  const handleVideo = async () => {
    setVideoProgress(0);
    try {
      await onDownloadVideo((p) => setVideoProgress(p));
    } finally {
      setVideoProgress(null);
    }
  };

  const handleAudio = async () => {
    setAudioProgress(0);
    try {
      await onDownloadAudio((p) => setAudioProgress(p));
    } finally {
      setAudioProgress(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={handleVideo}
        disabled={disabled || videoProgress !== null || audioProgress !== null}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:opacity-90 disabled:opacity-50 transition"
      >
        {videoProgress !== null ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{videoProgress}%</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Video (MP4)
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleAudio}
        disabled={disabled || videoProgress !== null || audioProgress !== null}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {audioProgress !== null ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{audioProgress}%</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 8.663 12 9.109 12 10v4c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            Audio (MP3)
          </>
        )}
      </button>
    </div>
  );
}
