# AIOS
Zack and Richard have made an operating system called AI OS. Built for AI users and nerds.

AIOS is a containerized, web-based AI operating-system-style app. It provides a minimalist chat UI, multi-provider model routing, and a guarded file-system sandbox API.

## Quick start (Docker)

1. Copy environment defaults:

```bash
cp .env.example .env
```

2. Add at least one provider API key in `.env` (for example `OPENAI_API_KEY=...`).

3. Build and run:

```bash
docker compose up --build
```

4. Open AIOS:

- http://localhost:8080

The port is configurable through `PORT` in `.env`.

## Configuration

AIOS uses environment variables for secrets and provider endpoints.

- Never hardcode API keys.
- Use `.env` for local development.
- `.env.example` documents all supported variables.

## Supported providers

The provider catalog is centrally defined in `server/providers.js` and surfaced by `GET /api/providers`.

Included providers:

- OpenAI
- Anthropic
- Google Gemini
- DeepSeek
- xAI (Grok)
- OpenRouter
- Mistral
- Moonshot / Kimi
- MiniMax
- Qwen / Alibaba
- Hugging Face
- Ollama (local)
- LM Studio (local)
- NVIDIA NIM
- Nous Portal
- Custom OpenAI-compatible endpoint

> Note: AIOS fully supports OpenAI-compatible chat routing. Providers that require non-compatible request formats are clearly reported with a TODO-style friendly error. For the custom OpenAI-compatible provider, set `CUSTOM_OPENAI_BASE_URL` in `.env` and optionally enter a runtime API key in the UI.

## API overview

- `GET /api/providers` — returns provider metadata and model examples.
- `POST /api/chat` — proxies chat requests through the selected provider.
- `POST /api/fs/write` — writes `{ path, content }` only inside the sandbox directory.

`/api/fs/write` returns Result-style JSON:

- Success: `{ ok: true, message }`
- Failure: `{ ok: false, error }`

Path traversal and escaping the sandbox root are rejected.

## Project structure

```text
.
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── server/
│   ├── index.js
│   ├── providers.js
│   └── sandbox.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── test/
│   └── sandbox.test.js
└── workspace/
```

## Local (non-Docker) run

```bash
npm install
npm start
```

Run tests:

```bash
npm test
```
