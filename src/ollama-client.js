import 'dotenv/config'; // Load .env early even if this file is imported before server bootstraps
import axios from 'axios';
import { expandLanguage } from './lang-utils.js';

function getOllamaConfig() {
  return {
    host: process.env.OLLAMA_HOST || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'translate'
  };
}

/**
 * Call the Ollama API for translation.
 */
export async function translateViaOllama({ sourceLanguage, destinationLanguage, content }) {
  const src = expandLanguage(sourceLanguage);
  const dst = expandLanguage(destinationLanguage);
  const prompt = `You are a professional translator. Translate the text from ${src.name} (${src.code}) to ${dst.name} (${dst.code}). \n` +
    `Preserve meaning, tone, punctuation, inline code blocks, numbers and URLs. Do not add explanations, labels or quotes. \n` +
    `If the text is already in ${dst.name}, return it unchanged.\n\n` +
    `Source (${src.code}):\n"""${content}"""\n\nTranslated (${dst.code}):`;

  const { host, model } = getOllamaConfig();

  try {
    const response = await axios.post(`${host}/api/generate`, {
      model,
      prompt,
      stream: false
    }, {
      timeout: 60_000
    });

    if (!response.data) {
      throw new Error('Empty response from Ollama');
    }

    // Ollama returns an object with 'response' for non-streaming calls
    let translated = (response.data.response || '').trim();

    translated = cleanTranslationOutput(translated);
    return translated;
  } catch (err) {
    console.error('Ollama translate error:', err.response?.data || err.message);
    throw err;
  }
}

// Remove unnecessary outer quotes / labels sometimes added by the model while
// trying not to destroy legitimate interior punctuation.
function cleanTranslationOutput(text) {
  if (!text) return text;

  // Remove a leading label like: Translated (fr): or Translation: etc.
  text = text.replace(/^\s*(Translated\s*\([^)]*\)|Translated|Translation)\s*:\s*/i, '');

  // Strip Markdown code fences if mistakenly added
  if (/^```/.test(text) && /```$/.test(text)) {
    text = text.replace(/^```[a-zA-Z0-9]*\n?/, '').replace(/```$/, '').trim();
  }

  const pairs = [
    ['"', '"'],
    ['\'', '\''],
    ['“', '”'],
    ['«', '»'],
    ['„', '“'],
    ['`', '`']
  ];

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 3) {
    changed = false;
    iterations++;
    for (const [open, close] of pairs) {
      if (text.startsWith(open) && text.endsWith(close)) {
        const inner = text.slice(open.length, -close.length).trim();
        // Avoid stripping if the inner part now loses balanced quotes (heuristic)
        if (inner.length > 0) {
          text = inner;
          changed = true;
        }
      }
    }
  }

  return text;
}
