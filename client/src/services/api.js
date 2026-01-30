/**
 * API client for parse-url and download endpoints.
 * Uses relative /api in dev (proxied) and same in production if served from same host.
 */

const API_BASE = '/api';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }
  if (!res.ok) throw new Error('Request failed');
  return res;
}

/**
 * Parse URL and get metadata (thumbnail, title, duration, platform).
 * @param {string} url - Reel URL
 * @returns {Promise<{ success: boolean, data: { platform, title, thumbnail, duration } }>}
 */
export async function parseUrl(url) {
  const res = await fetch(`${API_BASE}/parse-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url.trim() }),
  });
  return handleResponse(res);
}

/**
 * Download video as MP4. Returns blob URL for download.
 * @param {string} url - Reel URL
 * @param {(percent: number) => void} onProgress
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function downloadVideo(url, onProgress) {
  const res = await fetch(`${API_BASE}/download/video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url.trim() }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Download failed');
  }
  const filename = res.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/)?.[1] || 'reel.mp4';
  const reader = res.body.getReader();
  const contentLength = res.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total && onProgress) onProgress(Math.round((received / total) * 100));
  }
  if (onProgress) onProgress(100);
  const blob = new Blob(chunks, { type: 'video/mp4' });
  return { blob, filename };
}

/**
 * Download audio as MP3.
 * @param {string} url - Reel URL
 * @param {(percent: number) => void} onProgress
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function downloadAudio(url, onProgress) {
  const res = await fetch(`${API_BASE}/download/audio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url.trim() }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Download failed');
  }
  const filename = res.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/)?.[1] || 'reel.mp3';
  const reader = res.body.getReader();
  const contentLength = res.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total && onProgress) onProgress(Math.round((received / total) * 100));
  }
  if (onProgress) onProgress(100);
  const blob = new Blob(chunks, { type: 'audio/mpeg' });
  return { blob, filename };
}
