/**
 * Express app: CORS, JSON body, API routes, error handler.
 */
import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
