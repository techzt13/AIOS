# AIOS
Zack and Richard have made an operating system called AI OS. Built for AI users and nerds.

AIOS is now a browser-accessible Linux-based OS environment: a full Linux desktop streamed to your browser, with the AIOS Apple-style AI control layer available for provider-routed chat, guarded command execution, and sandboxed file operations.

## Quick start (Docker / Codespaces)

1. Copy environment defaults:

```bash
cp .env.example .env
```

2. Add at least one provider API key in `.env` (for example `OPENAI_API_KEY=...`).

3. Build and run everything:

```bash
docker compose up --build
```

4. Open:

- Linux desktop stream: `http://localhost:3000` (configurable via `DESKTOP_PORT`)
- AIOS control layer: `http://localhost:8080` (configurable via `PORT`)

In GitHub Codespaces, `.devcontainer/devcontainer.json` forwards both ports.

## Architecture

AIOS uses companion services in `docker-compose.yml`:

- `desktop`: Linux XFCE desktop stream (webtop/noVNC style browser desktop)
- `aios`: Node.js + Express AI layer (`public/` + `server/`)

Inside the Linux desktop, a launcher (`AIOS Control Layer`) is placed on the desktop and opens `http://aios:8080`.

## Linux apps included out-of-the-box

The desktop image pre-installs and supports real Linux GUI apps including:

- Terminal: `xfce4-terminal`
- File manager: `thunar`
- Text editor: `mousepad`
- Web browser: `firefox`

You can install additional Linux apps in the desktop container with `apt-get`.

## AI provider selection

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

Keep keys in environment variables (`.env`). Never hardcode secrets.

## AI OS-control APIs and security model

- `POST /api/exec` — guarded shell command execution in the workspace root.
  - Disabled by default; enable with `ENABLE_EXEC_API=true` only in trusted dev environments.
  - Uses timeout (`EXEC_TIMEOUT_MS`) and output cap (`EXEC_MAX_OUTPUT_BYTES`).
- `POST /api/fs/write` — sandboxed file write under `WORKSPACE_ROOT`.
- `POST /api/fs/read` — sandboxed file read (with size limit `FS_READ_MAX_BYTES`).
- `POST /api/fs/list` — sandboxed directory listing.

Path traversal and absolute path escapes are rejected for all sandboxed FS routes.

In the UI, you can run:

- system action button (visible command runner)
- slash commands in chat: `/exec ...`, `/list [path]`, `/read <path>`

Use these carefully: this is a power-user/dev tool and should not be exposed to untrusted networks.

## Project structure

```text
.
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── desktop/
│   ├── Dockerfile
│   └── AIOS.desktop
├── server/
│   ├── exec.js
│   ├── index.js
│   ├── providers.js
│   └── sandbox.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── test/
│   ├── exec.test.js
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

## Build footprint notes

Expect the desktop image to be significantly heavier than the original chat-only container (roughly 1–3 GB class depending on cache/base updates). First build may take several minutes in a fresh Codespace.
