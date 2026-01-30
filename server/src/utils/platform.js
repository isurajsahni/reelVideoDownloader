/**
 * Detect platform from URL (Instagram or Snapchat).
 * @param {string} url - Raw URL string
 * @returns {'instagram' | 'snapchat' | null}
 */
export function detectPlatform(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/instagram\.com\/reel\//i.test(trimmed) || /instagram\.com\/p\//i.test(trimmed)) return 'instagram';
  if (/snapchat\.com\/spotlight\//i.test(trimmed) || /story\.snapchat\.com/i.test(trimmed)) return 'snapchat';
  return null;
}

/**
 * Basic URL validation for our supported platforms.
 * @param {string} url
 * @returns {boolean}
 */
export function isValidReelUrl(url) {
  const platform = detectPlatform(url);
  if (!platform) return false;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
