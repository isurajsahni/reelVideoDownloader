/**
 * Landing page: URL input, parse, preview card, download buttons, history.
 */
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { UrlInput } from '../components/UrlInput';
import { PreviewCard } from '../components/PreviewCard';
import { DownloadButtons } from '../components/DownloadButtons';
import { DownloadHistory } from '../components/DownloadHistory';
import { useDownloadHistory } from '../hooks/useDownloadHistory';
import * as api from '../services/api';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function Landing() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const { history, add: addHistory, clear } = useDownloadHistory();

  const handleParse = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error('Please paste a URL');
      return;
    }
    setLoading(true);
    setMeta(null);
    setCurrentUrl('');
    try {
      const res = await api.parseUrl(trimmed);
      setMeta(res.data);
      setCurrentUrl(trimmed);
      toast.success('Ready to download');
    } catch (err) {
      const msg = err.message || 'Invalid URL or content unavailable';
      toast.error(msg);
      setMeta(null);
      setCurrentUrl('');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleDownloadVideo = useCallback(
    async (onProgress) => {
      if (!currentUrl) return;
      try {
        const { blob, filename } = await api.downloadVideo(currentUrl, onProgress);
        triggerDownload(blob, filename);
        addHistory({ url: currentUrl, title: meta?.title, platform: meta?.platform, type: 'video' });
        toast.success('Video downloaded');
      } catch (err) {
        toast.error(err.message || 'Download failed');
      }
    },
    [currentUrl, meta, addHistory]
  );

  const handleDownloadAudio = useCallback(
    async (onProgress) => {
      if (!currentUrl) return;
      try {
        const { blob, filename } = await api.downloadAudio(currentUrl, onProgress);
        triggerDownload(blob, filename);
        addHistory({ url: currentUrl, title: meta?.title, platform: meta?.platform, type: 'audio' });
        toast.success('Audio downloaded');
      } catch (err) {
        toast.error(err.message || 'Download failed');
      }
    },
    [currentUrl, meta, addHistory]
  );

  const handleCopyLink = useCallback(() => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl).then(
      () => toast.success('Link copied'),
      () => toast.error('Could not copy')
    );
  }, [currentUrl]);

  return (
    <>
      <Helmet>
        <title>Reel Downloader – Instagram & Snapchat Reels to MP4 / MP3</title>
        <meta name="description" content="Download Instagram Reels and Snapchat Spotlights as MP4 video or MP3 audio. Fast, free, mobile-friendly." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Reel Downloader
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Paste a public Instagram Reel or Snapchat Spotlights URL to download as MP4 or MP3.
            </p>
          </header>

          <section className="space-y-6">
            <UrlInput
              value={url}
              onChange={setUrl}
              onSubmit={handleParse}
              loading={loading}
              placeholder="Paste Instagram or Snapchat reel URL..."
            />

            {meta && (
              <>
                <PreviewCard
                  data={meta}
                  onCopyLink={handleCopyLink}
                  shareUrl={currentUrl}
                />
                <DownloadButtons
                  onDownloadVideo={handleDownloadVideo}
                  onDownloadAudio={handleDownloadAudio}
                  disabled={!currentUrl}
                />
              </>
            )}
          </section>

          <DownloadHistory history={history} clear={clear} />
        </main>

        <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          For personal use only. Respect creators&apos; rights and platform terms.
        </footer>
      </div>
    </>
  );
}
