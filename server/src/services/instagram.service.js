/**
 * Instagram Reel service.
 * Delegates to base service (yt-dlp) which supports Instagram.
 */
import { detectPlatform } from '../utils/platform.js';
import { fetchMetadata, downloadVideo, isYtDlpAvailable } from './base.service.js';

export const instagramService = {
  /**
   * @param {string} url - Instagram reel URL
   * @returns {Promise<{ title: string, thumbnail: string, duration: number }>}
   */
  async getMetadata(url) {
    if (detectPlatform(url) !== 'instagram') throw new Error('Invalid Instagram URL');
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
    if (detectPlatform(url) !== 'instagram') throw new Error('Invalid Instagram URL');
    return downloadVideo(url, outputPath, onProgress);
  },

  isAvailable: isYtDlpAvailable,
};
