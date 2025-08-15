import express from 'express';
import dotenv from 'dotenv';
import { translateRouter } from './translate-route.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', model: process.env.OLLAMA_MODEL || 'unset' });
});

app.use('/translate', translateRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Translate API listening on http://localhost:${PORT}`);
});
