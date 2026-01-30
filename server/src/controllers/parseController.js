/**
 * POST /api/parse-url - Detect platform and return metadata.
 */
import * as downloadService from '../services/download.service.js';

export async function parseUrl(req, res, next) {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    const meta = await downloadService.parseUrl(url.trim());
    res.json({ success: true, data: meta });
  } catch (err) {
    next(err);
  }
}
