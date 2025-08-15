import express from 'express';
import { z } from 'zod';
import { translateViaOllama } from './ollama-client.js';
import { expandLanguage } from './lang-utils.js';

export const translateRouter = express.Router();

const bodySchema = z.object({
  sourceLanguage: z.string().min(2).max(5),
  destinationLanguage: z.string().min(2).max(5),
  content: z.string().min(1).max(5000)
}).refine(d => d.sourceLanguage !== d.destinationLanguage, {
  message: 'sourceLanguage and destinationLanguage must differ',
  path: ['destinationLanguage']
});

translateRouter.post('/', async (req, res) => {
  const parse = bodySchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Validation failed', details: parse.error.flatten() });
  }
  const { sourceLanguage, destinationLanguage, content } = parse.data;

  try {
    const translated = await translateViaOllama({ sourceLanguage, destinationLanguage, content });
    const src = expandLanguage(sourceLanguage);
    const dst = expandLanguage(destinationLanguage);
    res.json({
      translated,
      sourceLanguage: src.code,
      sourceLanguageName: src.name,
      destinationLanguage: dst.code,
      destinationLanguageName: dst.name
    });

    console.log(`Translation from ${src.name} (${src.code}) to ${dst.name} (${dst.code}): ${translated}`);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(502).json({ error: 'Cannot reach Ollama service' });
    }
    res.status(500).json({ error: 'Translation failed', detail: err.message });
  }
});
