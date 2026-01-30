/**
 * Central config from environment variables.
 * All config is read here for a single source of truth.
 */
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((o) => o.trim()),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20', 10),
  },
  temp: {
    dir: process.env.TEMP_DIR || './temp',
    fileTtlSeconds: parseInt(process.env.TEMP_FILE_TTL_SECONDS || '300', 10),
  },
  ffmpegPath: process.env.FFMPEG_PATH || undefined,
  ytDlpPath: process.env.YT_DLP_PATH || undefined,
};
