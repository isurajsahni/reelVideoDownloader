/**
 * Snapchat Spotlight service.
 * Delegates to base service (yt-dlp) which supports Snapchat.
 */
import { detectPlatform } from '../utils/platform.js';
import { fetchMetadata, downloadVideo, isYtDlpAvailable } from './base.service.js';

export const snapchatService = {
  /**
   * @param {string} url - Snapchat spotlight URL
   * @returns {Promise<{ title: string, thumbnail: string, duration: number }>}
   */
  async getMetadata(url) {
    if (detectPlatform(url) !== 'snapchat') throw new Error('Invalid Snapchat URL');
    const meta = await fetchMetadata(url);
    return {
      title: meta.title,
      thumbnail: meta.thumbnail,
      duration: meta.duration,
    };
  },

  /**
   * @param {string} url
   * @param {string} outputPath
   * @param {(n: number) => void} onProgress
   */
  async download(url, outputPath, onProgress) {
    if (detectPlatform(url) !== 'snapchat') throw new Error('Invalid Snapchat URL');
    return downloadVideo(url, outputPath, onProgress);
  },

  isAvailable: isYtDlpAvailable,
};
