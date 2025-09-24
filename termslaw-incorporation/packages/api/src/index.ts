import express, { type Express } from 'express';
import { feesHandler } from './routes/fees';
import { generateHandler } from './routes/generate';
import { previewHandler } from './routes/preview';

export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.get('/api/fees', feesHandler);
  app.post('/api/preview', previewHandler);
  app.post('/api/generate', generateHandler);
  return app;
}

export type { PreviewResult, PreviewPage } from './lib/preview';
export { previewHandler, generateHandler, feesHandler };
