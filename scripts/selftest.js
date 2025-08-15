// Simple self test script (mock call if Ollama unavailable)
import axios from 'axios';
import '../src/server.js';

async function run() {
  // Wait briefly for server to bind
  await new Promise(r => setTimeout(r, 500));
  try {
    const resp = await axios.post('http://localhost:3000/translate', {
      sourceLanguage: 'en',
      destinationLanguage: 'fr',
      content: 'The product {product} has been converted successfully.'
    }, { timeout: 30_000 });
    console.log('Sample translation response:', resp.data);
  } catch (e) {
    console.error('Self test failed:', e.response?.data || e.message);
  } finally {
    process.exit(0);
  }
}
run();
