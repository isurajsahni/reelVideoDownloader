/**
 * API routes: parse-url, download/video, download/audio.
 */
import { Router } from 'express';
import * as parseController from '../controllers/parseController.js';
import * as downloadController from '../controllers/downloadController.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.use(apiLimiter);

router.post('/parse-url', parseController.parseUrl);
router.post('/download/video', downloadController.downloadVideo);
router.post('/download/audio', downloadController.downloadAudio);

export default router;
