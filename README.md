# Ollama Translate API

A minimal Express.js HTTP service that exposes a `/translate` endpoint using a local [Ollama](https://ollama.com) model.

## Features
- POST `/translate` with JSON body: `{ "sourceLanguage": "en", "destinationLanguage": "fr", "content": "Hello" }`
- Validates input (simple length + different languages)
- Talks to Ollama `generate` endpoint (non-streaming)
- Configurable via environment variables

## Environment Variables
| Name | Default | Description |
|------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `OLLAMA_HOST` | `http://localhost:11434` | Base URL of local Ollama daemon |
| `OLLAMA_MODEL` | `translate` | Model name pulled by Ollama (e.g. a fine-tuned translation model) |

Create a `.env` file (optional):
```
PORT=3000
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=translate
```

## Install
```
npm install
```

## Run
```
npm start
```
Visit: http://localhost:3000/health

## Example Request
```
POST http://localhost:3000/translate
Content-Type: application/json

{
  "sourceLanguage": "en",
  "destinationLanguage": "fr",
  "content": "Hello world"
}
```
Response:
```
{
  "translated": "Bonjour le monde",
  "sourceLanguage": "en",
  "destinationLanguage": "fr"
}
```

## Dev Mode (auto-reload)
```
npm run dev
```

## Simple Self-Test
(Requires server port free.)
```
npm run check
```

## Notes
- Adjust the prompt logic in `src/ollama-client.js` for better quality or to support glossaries, etc.
- Add rate limiting / auth before production.
- For streaming responses, switch `stream: true` and pipe partial tokens.
