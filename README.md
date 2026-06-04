# AIOS
Zack and Richard have made an operating system called AI OS. Built for AI users and nerds.

AIOS is now a browser-accessible Linux-based OS environment: a full Linux desktop streamed to your browser, with the AIOS Apple-style AI control layer available for provider-routed chat, guarded command execution, and sandboxed file operations.

## Quick start (Docker / Codespaces)

1. (Optional) copy runtime defaults:

```bash
cp .env.example .env
```

> `.env` is now optional for provider secrets. AIOS can boot without it, and provider credentials can be configured in the UI.

2. Build and run everything:

```bash
docker compose up --build
```

3. Open:

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

Included providers are grouped in the UI and dispatched through adapter modules in `server/adapters/`:

### 1. Major cloud LLM providers

| Provider | Adapter | Auth | Models |
| --- | --- | --- | --- |
| Anthropic Claude | `anthropic` | `static-key` | Claude 4.6 Opus/Sonnet, Claude 3.5 Sonnet/Haiku, Claude Haiku |
| OpenAI GPT | `openai` | `static-key` | GPT-5.5, GPT-5.4, GPT-4o, ChatGPT Codex |
| Google Gemini | `gemini-native` | `static-key` | Gemini 3 Pro, Gemini 3 Flash, Gemini 2.5 Pro/Flash |
| DeepSeek | `openai` | `static-key` | DeepSeek V4 Flash, DeepSeek Reasoner, DeepSeek Chat |
| xAI (Grok) | `openai` | `static-key` | Grok-4.3, Grok-4 |
| Mistral AI | `openai` | `static-key` | Mistral Large, Mixtral 8x7B |

### 2. Regional & emerging providers

| Provider | Adapter | Auth | Models |
| --- | --- | --- | --- |
| Moonshot AI (Kimi) | `openai` | `static-key` | Kimi K2.5, K2-Thinking, K2-Turbo |
| MiniMax | `openai` | `static-key` | MiniMax-M3, MiniMax-VL-01, MiniMax 2.7 |
| Zhipu AI | `openai` | `static-key` | GLM-4.7-Flash, GLM-4.7, GLM-4 |
| Volcano Engine / BytePlus | `openai` | `static-key` | Doubao Seed 1.8, Ark-Code Latest, Seed 1.8 |
| Alibaba Cloud (Qwen) | `openai` | `static-key` | Qwen Portal Coder/Vision, plus fallback `qwen-plus` and `qwen-max` IDs |
| Baidu Qianfan | `baidu` | `static-key` | ERNIE 4.5, ERNIE Speed |
| Xiaomi MiMo | `openai` | `static-key` | MiMo-v2.5 Pro, MiMo-v2 Flash |

### 3. Open-source / local runtimes

| Provider | Adapter | Auth | Notes |
| --- | --- | --- | --- |
| Ollama | `openai` | `none` | Local weights such as Llama 3.3 70B, Qwen 2.5 32B, Gemma |
| GitHub Copilot | `github-copilot` | `oauth-device` | Uses GitHub OAuth device login and short-lived Copilot chat tokens |
| LM Studio | `openai` | `none` | Preserved local runtime |
| Custom OpenAI-compatible endpoint | `openai` | `static-key` | User-set base URL and optional one-off API key in the UI |

### 4. Aggregators

| Provider | Adapter | Auth | Models |
| --- | --- | --- | --- |
| OpenRouter | `openai` | `static-key` | OpenAI, Anthropic, NVIDIA routed models |
| Vercel AI Gateway | `openai` | `static-key` | `openai/gpt-4o`, `anthropic/claude-3.5-sonnet` |
| NVIDIA NIM | `openai` | `static-key` | Preserved |
| Nous Portal | `openai` | `static-key` | Preserved |
| Hugging Face Router | `openai` | `static-key` | Preserved |

Provider settings are now primarily managed in the AIOS UI and stored outside the git tree.

### Static-key configuration

For static-key providers (OpenAI, Anthropic, Gemini, DeepSeek, MiniMax, OpenRouter, etc.), configure API keys and optional base URLs in the AIOS interface.

AIOS persists provider settings in:

- `AIOS_CONFIG_DIR` (if set), or
- `~/.config/aios` by default

Secrets are never returned raw to the frontend. The UI only receives safe status fields (configured true/false, auth source, and effective base URL).
Because this is local file-based secret storage, secure the host machine/user account appropriately.

`.env` still works as a fallback source for compatibility. Optional fallback examples:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
BAIDU_API_KEY=
BAIDU_SECRET_KEY=
OPENROUTER_API_KEY=
CUSTOM_OPENAI_BASE_URL=https://your-gateway.example/v1
CUSTOM_OPENAI_API_KEY=
```

Chat auth resolution order is:

1. persisted provider settings from the AIOS config store
2. `.env` fallback values
3. provider-specific no-auth / OAuth-device behavior

Anthropic uses its native Messages API, Gemini uses the native Google Generative Language API shape, Baidu exchanges `BAIDU_API_KEY` + `BAIDU_SECRET_KEY` for an access token, and the rest of the compatible providers use `/chat/completions`.

### GitHub Copilot device login

AIOS can sign into GitHub Copilot with a GitHub OAuth app that has device flow enabled:

```bash
GITHUB_COPILOT_CLIENT_ID=your_oauth_app_client_id
GITHUB_COPILOT_BASE_URL=https://api.githubcopilot.com
GITHUB_COPILOT_OAUTH_SCOPE=read:user copilot
AIOS_CONFIG_DIR=/absolute/path/outside/the/repo
```

When GitHub Copilot is selected in the UI, AIOS shows a **Sign in with GitHub** flow instead of an API-key field. The server:

1. Starts GitHub device login with `POST /api/auth/github-copilot/start`
2. Polls `POST /api/auth/github-copilot/poll`
3. Stores the GitHub OAuth token and refreshed Copilot chat token metadata in the same outside-git AIOS config directory
4. Never returns raw tokens to the browser; the frontend only gets connection status

> Warning: this is an opt-in integration that depends on undocumented/private GitHub Copilot token exchange behavior. It is not officially sanctioned by GitHub, may break without notice, and you are responsible for complying with your Copilot plan's terms.

### Custom OpenAI-compatible endpoints

Choose **Custom OpenAI-compatible endpoint** in the provider selector to send chat traffic to a user-set base URL such as DeepInfra, Together AI, LiteLLM, or an internal gateway. You can store an optional API key and base URL in AIOS settings; the adapter still uses the normal OpenAI-compatible `/chat/completions` shape.

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
│   ├── configDir.js
│   ├── exec.js
│   ├── index.js
│   ├── providerSettings.js
│   ├── providerSettingsStore.js
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
