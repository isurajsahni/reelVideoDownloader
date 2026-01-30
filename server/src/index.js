/**
 * Server entry: load app, run cleanup interval, listen.
 */
import app from './app.js';
import { config } from './config/index.js';
import { cleanupTempDir } from './services/download.service.js';

const PORT = config.port;

// Periodic cleanup of old temp files
const CLEANUP_INTERVAL_MS = 60 * 1000;
setInterval(() => {
  cleanupTempDir().catch(() => {});
}, CLEANUP_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
