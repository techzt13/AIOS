# AIOS
Zack and Richard have made an operating system called AIOS. Built for AI users and nerds.

AIOS runs as a local **AI-native OS runtime** with a macOS-inspired desktop. Use desktop mode when you want AIOS to own native app windows instead of being trapped inside a normal browser tab.

## Quick start

```bash
git clone https://github.com/techzt13/AIOS.git
cd AIOS
npm install
npm start
```

`npm start` launches the full AIOS desktop OS (Electron). AIOS starts its own local daemon and opens a native desktop shell. The AIOS Browser renders pages inside the Browser app using a real Chromium `<webview>` engine, so any site — YouTube, shops, logins — loads inside AIOS without being blocked.

Optional localhost web-shell mode (limited browser, runs in your existing browser tab):

```bash
npm run web
```

Then open: <http://localhost:8080>

In web-shell mode the Browser app embeds sites in an iframe; sites that block embedding will show "refused to connect" and need the desktop mode above.

By default AIOS binds to `127.0.0.1` so the OS runtime is local-only. Set `AIOS_HOST=0.0.0.0` only if you intentionally want to expose it on your network.

No Docker, XFCE desktop, VNC, or container runtime is part of the supported app path.

## What you get on port 8080

- Desktop wallpaper + top menu bar + dock
- Windowed apps: **AI Chat**, **Browser**, **Files**, **Terminal**, **Settings**, **Setup Assistant**
- Menu bar extras: live clock with mini calendar, battery, network, volume, notifications bell, Spaces switcher, and lock button
- Notifications center with toast banners and a slide-out history panel
- **Calendar & Clock** app with month view, live clock, countdown timer, and alarms
- **Activity Monitor** showing CPU/memory load, AIOS server stats, tracked processes, and Linux container usage
- **Trash** with soft-delete from Files, restore, and empty
- Quick Look previews (Space key or 👁 button) for images, audio, video, PDF, and text
- Mission Control with three virtual desktop Spaces (Ctrl+Up)
- Lock screen with PIN protection (Ctrl+⌘Q or the 🔒 menu button)
- Right-click context menus on the desktop, files, and dock items
- **Music** player for local audio playback with a playlist
- AI Chat history: past conversations persist locally and can be browsed and reloaded
- Local AIOS runtime status, process history, and workspace identity
- Third-party web app launchers stored locally and opened through the native AIOS Browser path
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
- `GET /api/apps`
- `POST /api/apps`
- `POST /api/apps/import-web-manifest`
- `DELETE /api/apps/:appId`
- `GET /api/linux-apps`
- `POST /api/linux-apps`
- `POST /api/linux-apps/import-url`
- `DELETE /api/linux-apps/:packageId`
- `POST /api/browser/open`

## Third-party app format

AIOS installs third-party apps using the standard **PWA/Web App Manifest** format (`manifest.webmanifest` or `manifest.json`). You can install by entering a website URL and asking AIOS to find `<link rel="manifest">`, or by importing a manifest file directly.

For now, AIOS does not run arbitrary downloaded code or native packages like `.dmg`, `.deb`, or `.tar.gz`; apps are HTTPS/HTTP web apps opened through the AIOS native browser path.

## Browser behavior

In desktop mode (`npm start`), AIOS renders sites inside the Browser window using a Chromium `<webview>` — a real browser engine, not an iframe. Sites cannot refuse to connect, and popups/new tabs are routed back into the AIOS Browser window instead of spawning separate native windows.

In web-shell mode (`npm run web`), AIOS embeds sites in an iframe by default. Sites that block embedding (most shops, YouTube, social sites) will appear blank or say "refused to connect"; AIOS shows a notice with a native-browser fallback. YouTube video links are rewritten to the embeddable player so they still play inside the window.

Example `manifest.webmanifest`:

```json
{
  "name": "Example App",
  "short_name": "EX",
  "start_url": "https://example.com",
  "display": "standalone",
  "description": "Standard Web App Manifest"
}
```

## Linux app packages

AIOS can import `.tar.gz`, `.tgz`, and `.tar` Linux archives into the local app library. These packages are stored locally under the AIOS data directory and marked `stored-for-linux-runtime`. For direct archive URLs, AIOS can download with a Linux desktop user-agent so servers that choose files based on user-agent have a better chance of returning the Linux package.

They do **not** execute yet. Running Linux binaries on macOS requires the planned AIOS Linux runtime/container layer. The embedded browser frame also cannot make every website detect your Mac as Linux; websites see the real browser unless AIOS fetches a direct download URL server-side or later runs a Linux browser/runtime.

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

## License

Copyright (c) 2026 Zack Tudor. All rights reserved. See `LICENSE` for the full proprietary notice.
