/**
 * Download orchestration: picks platform service, downloads video,
 * optionally converts to MP3 and returns file path or stream.
 */
import path from 'path';
import fs from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { detectPlatform } from '../utils/platform.js';
import { fetchMetadata, downloadVideo, isYtDlpAvailable } from './base.service.js';

// Optional custom ffmpeg path
if (config.ffmpegPath) {
  ffmpeg.setFfmpegPath(config.ffmpegPath);
}

const tempDir = config.temp.dir;

/**
 * Ensure temp dir exists.
 */
async function ensureTempDir() {
  await fs.mkdir(tempDir, { recursive: true });
}

/**
 * Generate a unique filename in temp dir.
 * @param {string} ext - e.g. 'mp4', 'mp3'
 */
function tempPath(ext) {
  return path.join(tempDir, `${uuidv4()}.${ext}`);
}

/** Create error with HTTP status for API responses. */
function apiError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Parse URL and return metadata (thumbnail, title, duration, platform).
 * @param {string} url
 */
export async function parseUrl(url) {
  await ensureTempDir();
  const platform = detectPlatform(url);
  if (!platform) throw apiError('Invalid or unsupported URL', 400);
  const available = await isYtDlpAvailable();
  if (!available) throw apiError('Download service is not available. Please install yt-dlp.', 503);
  const meta = await fetchMetadata(url);
  return {
    platform,
    title: meta.title,
    thumbnail: meta.thumbnail,
    duration: meta.duration,
  };
}

/**
 * Download video as MP4 and return absolute path. Caller must send file and optionally delete later.
 * @param {string} url
 * @param {(percent: number) => void} onProgress
 * @returns {Promise<{ path: string, filename: string }>}
 */
export async function downloadVideoFile(url, onProgress) {
  await ensureTempDir();
  const platform = detectPlatform(url);
  if (!platform) throw new Error('Invalid or unsupported URL');
  const outPath = tempPath('mp4');
  await downloadVideo(url, outPath, onProgress);
  const filename = path.basename(outPath);
  return { path: outPath, filename };
}

/**
 * Convert a local MP4 path to MP3 and return path.
 * @param {string} videoPath
 * @returns {Promise<{ path: string, filename: string }>}
 */
function convertToMp3(videoPath) {
  const mp3Path = videoPath.replace(/\.mp4$/i, '.mp3');
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .toFormat('mp3')
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .on('end', () => resolve({ path: mp3Path, filename: path.basename(mp3Path) }))
      .on('error', reject)
      .save(mp3Path);
  });
}

/**
 * Download video then extract audio to MP3. Returns path to MP3.
 * @param {string} url
 * @param {(percent: number) => void} onProgress - 0-90 for download, 90-100 for convert
 * @returns {Promise<{ path: string, filename: string }>}
 */
export async function downloadAudioFile(url, onProgress) {
  await ensureTempDir();
  const platform = detectPlatform(url);
  if (!platform) throw new Error('Invalid or unsupported URL');
  const videoPath = tempPath('mp4');
  await downloadVideo(url, videoPath, (p) => onProgress(Math.min(90, p)));
  try {
    const result = await convertToMp3(videoPath);
    onProgress(100);
    await fs.unlink(videoPath).catch(() => {});
    return result;
  } catch (e) {
    await fs.unlink(videoPath).catch(() => {});
    throw e;
  }
}

/**
 * Delete a file by path (used after sending response).
 * @param {string} filePath
 */
export async function deleteTempFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (_) {}
}

/**
 * Cleanup old files in temp dir (older than TTL).
 */
export async function cleanupTempDir() {
  try {
    const entries = await fs.readdir(tempDir, { withFileTypes: true });
    const now = Date.now();
    const ttlMs = config.temp.fileTtlSeconds * 1000;
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const full = path.join(tempDir, ent.name);
      const stat = await fs.stat(full).catch(() => null);
      if (stat && now - stat.mtimeMs > ttlMs) await fs.unlink(full).catch(() => {});
    }
  } catch (_) {}
}
