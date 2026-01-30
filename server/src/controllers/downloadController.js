/**
 * POST /api/download/video - Download video as MP4.
 * POST /api/download/audio - Download and convert to MP3.
 * Sends file and then deletes temp file.
 */
import fs from 'fs';
import * as downloadService from '../services/download.service.js';

export async function downloadVideo(req, res, next) {
  let filePath = null;
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    const { path: p, filename } = await downloadService.downloadVideoFile(url.trim(), (percent) => {
      // Optional: could send progress via SSE or store in memory for polling
    });
    filePath = p;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'video/mp4');
    res.on('finish', () => downloadService.deleteTempFile(p));
    res.on('close', () => downloadService.deleteTempFile(p));
    const stream = fs.createReadStream(p);
    stream.on('error', () => downloadService.deleteTempFile(p));
    stream.pipe(res);
  } catch (err) {
    if (filePath) downloadService.deleteTempFile(filePath);
    next(err);
  }
}

export async function downloadAudio(req, res, next) {
  let filePath = null;
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    const { path: p, filename } = await downloadService.downloadAudioFile(url.trim(), () => {});
    filePath = p;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.on('finish', () => downloadService.deleteTempFile(p));
    res.on('close', () => downloadService.deleteTempFile(p));
    const stream = fs.createReadStream(p);
    stream.on('error', () => downloadService.deleteTempFile(p));
    stream.pipe(res);
  } catch (err) {
    if (filePath) downloadService.deleteTempFile(filePath);
    next(err);
  }
}
