# AIOS
Zack and Richard have made an operating system called AIOS. Built for AI users and nerds.

AIOS now runs as a macOS-inspired **web OS shell** served directly by the AIOS app on port `8080`.

## Quick start

### Local (recommended)

```bash
npm install
npm start
```

Open: <http://localhost:8080>

### Docker

```bash
docker compose up --build
```

Open: <http://localhost:8080>

## What you get on port 8080

- Desktop wallpaper + top menu bar + dock
- Windowed apps: **AI Chat**, **Files**, **Terminal**, **Settings**, **Setup Assistant**
- First-run setup flow (provider select/connect/test/finish)
- Provider status and GitHub Copilot integration (env token or optional device login)

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
`GITHUB_COPILOT_CLIENT_ID` is optional and only required for in-app GitHub device login.

When no token or device-login client ID is available, AIOS shows this guidance:

> Set `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, or `GITHUB_TOKEN`, or configure `GITHUB_COPILOT_CLIENT_ID` to use device login.

## AI OS-control APIs and safety

- `POST /api/chat`
- `POST /api/exec` (guarded by `ENABLE_EXEC_API=true`)
- `POST /api/fs/list`
- `POST /api/fs/read`
- `POST /api/fs/write`

Sandbox protections reject absolute paths and traversal escapes for FS APIs.

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
├── Dockerfile
├── docker-compose.yml
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
