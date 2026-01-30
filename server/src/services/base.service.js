/**
 * Base download service using yt-dlp (supports Instagram & Snapchat).
 * Requires yt-dlp installed on the system: https://github.com/yt-dlp/yt-dlp
 * Falls back to a stub that returns a clear error if yt-dlp is not available.
 */
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/index.js';
import { detectPlatform } from '../utils/platform.js';

const ytDlpPath = config.ytDlpPath || 'yt-dlp';

/**
 * Check if yt-dlp is available.
 * @returns {Promise<boolean>}
 */
export async function isYtDlpAvailable() {
  return new Promise((resolve) => {
    const proc = spawn(ytDlpPath, ['--version'], { stdio: 'pipe' });
    proc.on('error', () => resolve(false));
    proc.on('exit', (code) => resolve(code === 0));
    proc.stdout?.on('data', () => {});
    proc.stderr?.on('data', () => {});
  });
}

/**
 * Fetch metadata (title, thumbnail, duration) via yt-dlp --dump-json.
 * @param {string} url - Reel URL
 * @returns {Promise<{ title: string, thumbnail: string, duration: number, platform: string }>}
 */
export async function fetchMetadata(url) {
  const platform = detectPlatform(url);
  if (!platform) throw new Error('Unsupported URL');

  const available = await isYtDlpAvailable();
  if (!available) {
    throw new Error(
      'Server is not configured for this platform. Please ensure yt-dlp is installed (see README).'
    );
  }

  return new Promise((resolve, reject) => {
    const args = [
      '--dump-json',
      '--no-download',
      '--no-warnings',
      url.trim(),
    ];
    const proc = spawn(ytDlpPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', (err) => reject(err));
    proc.on('close', (code) => {
      if (code !== 0) {
        const msg = stderr || stdout || 'Failed to fetch metadata';
        const err = new Error(msg.includes('Private') ? 'Content is private or unavailable' : msg);
        if (msg.includes('Private')) err.statusCode = 403;
        return reject(err);
      }
      try {
        const data = JSON.parse(stdout);
        resolve({
          title: data.title || 'Reel',
          thumbnail: data.thumbnail || data.thumbnails?.[0]?.url || '',
          duration: typeof data.duration === 'number' ? data.duration : 0,
          platform,
        });
      } catch (e) {
        reject(new Error('Invalid response from downloader'));
      }
    });
  });
}

/**
 * Download video to a file and return the local path.
 * @param {string} url - Reel URL
 * @param {string} outputPath - Full path for output file (e.g. .mp4)
 * @param {(percent: number) => void} onProgress - Optional progress callback 0-100
 * @returns {Promise<string>} - Resolved with output path
 */
export async function downloadVideo(url, outputPath, onProgress) {
  const available = await isYtDlpAvailable();
  if (!available) throw new Error('Download service unavailable. Install yt-dlp.');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const args = [
      '-f', 'best[ext=mp4]/best',
      '-o', outputPath,
      '--no-warnings',
      '--newline',
      url.trim(),
    ];
    const proc = spawn(ytDlpPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    proc.stderr.on('data', (d) => {
      const line = d.toString();
      const match = line.match(/\[download\]\s+(\d+\.?\d*)%/);
      if (match && onProgress) onProgress(parseFloat(match[1]));
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error('Video download failed'));
    });
  });
}
