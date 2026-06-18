# AIOS
Zack and Richard have made an operating system called AIOS. Built for AI users and nerds.

AIOS runs as a local **AI-native OS runtime** with a macOS-inspired browser desktop served by the AIOS daemon on port `8080`.

## Quick start

```bash
git clone https://github.com/techzt13/AIOS.git
cd AIOS
npm install
npm start
```

Open: <http://localhost:8080>

By default AIOS binds to `127.0.0.1` so the OS runtime is local-only. Set `AIOS_HOST=0.0.0.0` only if you intentionally want to expose it on your network.

No Docker, XFCE desktop, VNC, or container runtime is part of the supported app path.

## What you get on port 8080

- Desktop wallpaper + top menu bar + dock
- Windowed apps: **AI Chat**, **Files**, **Terminal**, **Settings**, **Setup Assistant**
- Local AIOS runtime status, process history, and workspace identity
- First-run setup flow (provider select/connect/test/finish)
- Provider status and GitHub Copilot integration (browser device login or env token)

## Local data model

AIOS stores local shell data in:

- `AIOS_DATA_DIR` when set, or
- `./workspace/.aios-data` by default

This local data includes:

- web shell window/layout/preferences state
- explicit imported JSON metadata (apps/settings/bookmarks/history/cookie exports)
- safe API-key audit events (provider, timestamp, action, masked fingerprint/last4 only)

Provider secrets remain in the existing config store:

- `AIOS_CONFIG_DIR` (or `~/.config/aios`)
- secrets are never returned raw to the frontend

## Import center privacy rules

Imports are explicit and user-initiated through a file picker.

- AIOS does **not** auto-read browser profile directories
- AIOS does **not** silently scrape cookies
- imported data stays local unless the user explicitly sends data to a provider through normal app usage
- cookies are supported only from user-provided exported files and labeled sensitive

## AI provider selection

Provider catalog is defined in `server/providers.js` and exposed via `GET /api/providers`.

Provider settings APIs:

- `GET /api/settings/providers`
- `POST /api/settings/providers/:providerId`
- `DELETE /api/settings/providers/:providerId`
- `POST /api/settings/providers/:providerId/test`

First-run setup APIs:

- `GET /api/settings/first-run`
- `POST /api/settings/first-run`
- `DELETE /api/settings/first-run`

GitHub Copilot auth APIs:

- `POST /api/auth/github-copilot/start`
- `POST /api/auth/github-copilot/poll`

### GitHub Copilot auth behavior

AIOS supports OpenClaw-style token detection before OAuth device login:

1. `COPILOT_GITHUB_TOKEN`
2. `GH_TOKEN`
3. `GITHUB_TOKEN`

If one of these is set, Copilot is treated as configured and AIOS can exchange it for a Copilot chat token.
AIOS includes the same public GitHub OAuth device-flow client ID pattern used by OpenClaw, so the setup UI can start the normal `https://github.com/login/device` flow without asking you to paste a token. Set `GITHUB_COPILOT_CLIENT_ID` only if you want to use your own GitHub OAuth app.

Device login shows a one-time code in the browser, polls GitHub until authorization completes, then stores the GitHub OAuth token and short-lived Copilot chat token server-side in `AIOS_CONFIG_DIR`/`~/.config/aios`. Raw tokens are never returned to the frontend.

If you prefer environment tokens, set `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, or `GITHUB_TOKEN` before starting AIOS.

## AI OS-control APIs and safety

- `POST /api/chat`
- `POST /api/exec` (guarded by `ENABLE_EXEC_API=true`)
- `GET /api/runtime`
- `GET /api/processes`
- `GET /api/processes/:processId`
- `POST /api/processes/exec` (guarded by `ENABLE_EXEC_API=true`)
- `DELETE /api/processes/:processId`
- `POST /api/fs/list`
- `POST /api/fs/read`
- `POST /api/fs/write`

Sandbox protections reject absolute paths and traversal escapes for FS APIs.
Exec commands are tracked as AIOS processes so the desktop can show command lifecycle, output, status, and cancellation state.

## Web shell local-data APIs

- `GET /api/local-data/info`
- `GET /api/local-data/shell-state`
- `POST /api/local-data/shell-state`
- `GET /api/local-data/imports`
- `POST /api/local-data/imports`
- `GET /api/settings/provider-audit`

## Project structure

```text
.
├── .env.example
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server/
│   ├── appDataStore.js
│   ├── configDir.js
│   ├── exec.js
│   ├── firstRunStore.js
│   ├── index.js
│   ├── providerSettings.js
│   ├── providerSettingsStore.js
│   ├── providers.js
│   └── sandbox.js
├── test/
└── workspace/
```

## Testing

```bash
npm test
```
