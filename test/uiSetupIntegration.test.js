const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

test('setup wizard markup exists in public index', async () => {
  const indexHtml = await fs.readFile(path.join(repoRoot, 'public', 'index.html'), 'utf8');

  assert.match(indexHtml, /id="setupWizard"/);
  assert.match(indexHtml, /id="wizardStepWelcome"/);
  assert.match(indexHtml, /id="wizardStepProvider"/);
  assert.match(indexHtml, /id="wizardStepConnect"/);
  assert.match(indexHtml, /id="wizardStepTest"/);
  assert.match(indexHtml, /id="wizardStepFinish"/);
  assert.match(indexHtml, /id="runSetupAgainButton"/);
});

test('web shell desktop markup includes menu bar, dock, and app windows', async () => {
  const indexHtml = await fs.readFile(path.join(repoRoot, 'public', 'index.html'), 'utf8');

  assert.match(indexHtml, /class="menu-bar"/);
  assert.match(indexHtml, /class="dock"/);
  assert.match(indexHtml, /id="windowChat"/);
  assert.match(indexHtml, /id="newChatButton"/);
  assert.match(indexHtml, /id="chatModelSelect"/);
  assert.match(indexHtml, /id="windowFiles"/);
  assert.match(indexHtml, /id="windowTerminal"/);
  assert.match(indexHtml, /id="windowSettings"/);
  assert.match(indexHtml, /id="windowApps"/);
  assert.match(indexHtml, /id="installAppForm"/);
  assert.match(indexHtml, /id="thirdPartyAppsGrid"/);
  assert.match(indexHtml, /id="windowBrowser"/);
  assert.match(indexHtml, /id="browserOpenExternalButton"/);
  assert.match(indexHtml, /id="browserBlockedNotice"/);
  assert.match(indexHtml, /id="browserExternalPage"/);
  assert.match(indexHtml, /id="browserWebview"/);
  assert.match(indexHtml, /<webview/);
  assert.match(indexHtml, /id="browserTryEmbedButton"/);
  assert.match(indexHtml, /Open native browser/);
  assert.match(indexHtml, /allow-popups-to-escape-sandbox/);
  assert.match(indexHtml, /id="performanceModeToggle"/);
  assert.match(indexHtml, /id="installFromPwaButton"/);
  assert.match(indexHtml, /id="installAppManifestFile"/);
  assert.match(indexHtml, /id="linuxPackageFile"/);
  assert.match(indexHtml, /id="linuxPackageUrl"/);
  assert.match(indexHtml, /id="linuxPackagesGrid"/);
  assert.match(indexHtml, /\.webmanifest/);
  assert.match(indexHtml, /\.tar\.gz/);
  assert.match(indexHtml, /id="openSetupAssistant"/);
  assert.match(indexHtml, /data-launch-app="chat"/);
  assert.match(indexHtml, /data-launch-app="settings"/);
  assert.match(indexHtml, /data-launch-app="browser"/);
});

test('wizard frontend uses existing first-run and provider test endpoints', async () => {
  const appJs = await fs.readFile(path.join(repoRoot, 'public', 'app.js'), 'utf8');

  assert.match(appJs, /\/api\/settings\/first-run/);
  assert.match(appJs, /\/api\/providers/);
  assert.match(appJs, /\/api\/settings\/providers\/\$\{encodeURIComponent\(provider\.id\)\}\/test/);
  assert.match(appJs, /\/api\/auth\/github-copilot\/start/);
  assert.match(appJs, /\/api\/auth\/github-copilot\/poll/);
  assert.match(appJs, /\/api\/local-data\/shell-state/);
  assert.match(appJs, /\/api\/local-data\/imports/);
  assert.match(appJs, /\/api\/settings\/provider-audit/);
  assert.match(appJs, /\/api\/apps/);
  assert.match(appJs, /\/api\/apps\/import-web-manifest/);
  assert.match(appJs, /\/api\/linux-apps/);
  assert.match(appJs, /\/api\/linux-apps\/import-url/);
  assert.match(appJs, /\/api\/browser\/open/);
  assert.match(appJs, /function startNewChat/);
  assert.match(appJs, /apps: 'windowApps'/);
  assert.match(appJs, /data-launch-app/);
  assert.doesNotMatch(appJs, /dataset\.openApp === 'apps'[\s\S]{0,120}openWindow\('settings'\)/);
  assert.match(appJs, /Your provider login and saved API keys were not changed/);
  assert.match(appJs, /function renderMessageContent/);
  assert.match(appJs, /code-copy-button/);
  assert.match(appJs, /function persistProviderChoice/);
  assert.match(appJs, /function renderChatModelSelect/);
  assert.match(appJs, /const WINDOW_LAYOUT/);
  assert.match(appJs, /function normalizeWindowPosition/);
  assert.match(appJs, /savedPositionIsStale/);
  assert.match(appJs, /safeWindowBounds/);
  assert.match(appJs, /requestAnimationFrame/);
  assert.match(appJs, /windowEl\.classList\.add\('dragging'\)/);
  assert.match(appJs, /recordWindowState\(windowEl\.dataset\.app, \{ left: lastX, top: lastY \}\)/);
  assert.match(appJs, /MAX_CHAT_HISTORY_MESSAGES = 80/);
  assert.match(appJs, /MAX_RENDERED_MESSAGES = 140/);
  assert.match(appJs, /function trimChatHistory/);
  assert.match(appJs, /function chooseDefaultProviderId/);
  assert.match(appJs, /configuredCopilot/);
  assert.match(appJs, /modelsByProvider/);
  assert.match(appJs, /Setup Assistant reopened because no usable provider is selected/);
  assert.match(appJs, /loadShellState\(\)\s*\.then\(\(\) => Promise\.all/);
  assert.match(appJs, /preferredModelForProvider/);
  assert.match(appJs, /function renderInstalledApps/);
  assert.match(appJs, /function installThirdPartyApp/);
  assert.match(appJs, /function readWebAppManifest/);
  assert.match(appJs, /function installSelectedManifestFile/);
  assert.match(appJs, /function installFromPwaUrl/);
  assert.match(appJs, /function installSelectedLinuxPackage/);
  assert.match(appJs, /function downloadLinuxPackageFromUrl/);
  assert.match(appJs, /hostLikelyBlocksEmbedding/);
  assert.match(appJs, /window\.aiosNative\?\.openBrowserUrl/);
  assert.match(appJs, /function canUseBrowserWebview/);
  assert.match(appJs, /function loadBrowserWebview/);
  assert.match(appJs, /browserWebview\.loadURL/);
  assert.match(appJs, /function launchNativeBrowserUrl/);
  assert.match(appJs, /function openRealBrowserTab/);
  assert.match(appJs, /function navigateBrowserHistory/);
  assert.match(appJs, /browserBackButton\.addEventListener\('click', \(\) => navigateBrowserHistory\(-1\)\)/);
  assert.match(appJs, /forceEmbed: true/);
  assert.match(appJs, /openBrowserUrl\(app\.url\)/);
  assert.match(appJs, /openCurrentBrowserUrlExternally/);
  assert.match(appJs, /performanceMode/);
  assert.match(appJs, /github-copilot\/gpt-4o/);
  assert.match(appJs, /loadWizardProviders\(preferredProviderId = ''\)/);
  assert.match(appJs, /await loadWizardProviders\(wizardProviderId\)/);
});

test('chat model selector follows the persisted default model', async () => {
  const appJs = await fs.readFile(path.join(repoRoot, 'public', 'app.js'), 'utf8');
  const renderStart = appJs.indexOf('function renderChatModelSelect()');
  const renderEnd = appJs.indexOf('function updateProviderStatusBadge()', renderStart);
  const handlersStart = appJs.indexOf('function syncDefaultChatModel()');
  const handlersEnd = appJs.indexOf("copilotStartButton.addEventListener('click'", handlersStart);
  const renderSource = appJs.slice(renderStart, renderEnd);
  const handlerSource = appJs.slice(handlersStart, handlersEnd);

  assert.match(renderSource, /\[preferredSelection, currentSelection\]/);
  assert.match(handlerSource, /persistProviderChoice\(selectedProvider\(\), modelSelect\.value\)/);
  assert.match(handlerSource, /renderChatModelSelect\(\)/);
  assert.match(handlerSource, /providerSelect\.addEventListener\('change'/);
  assert.match(handlerSource, /modelSelect\.addEventListener\('change', syncDefaultChatModel\)/);
  assert.doesNotMatch(appJs, /updateChatStatusPill/);
});

test('menu popovers accept clicks on nested SVG icons', async () => {
  const appJs = await fs.readFile(path.join(repoRoot, 'public', 'app.js'), 'utf8');

  assert.match(appJs, /!volumeButton\.contains\(event\.target\)/);
  assert.match(appJs, /!clockLabel\.contains\(event\.target\)/);
  assert.match(appJs, /!notificationsButton\.contains\(event\.target\)/);
});

test('native desktop runtime exposes Electron browser windows', async () => {
  const packageJson = await fs.readFile(path.join(repoRoot, 'package.json'), 'utf8');
  const desktopMain = await fs.readFile(path.join(repoRoot, 'desktop', 'main.js'), 'utf8');
  const preload = await fs.readFile(path.join(repoRoot, 'desktop', 'preload.js'), 'utf8');

  assert.match(packageJson, /"desktop": "electron desktop\/main\.js"/);
  assert.match(packageJson, /"electron"/);
  assert.match(desktopMain, /new BrowserWindow/);
  assert.match(desktopMain, /webviewTag: true/);
  assert.match(desktopMain, /createBrowserWindow/);
  assert.match(desktopMain, /electron-browser-window/);
  assert.match(desktopMain, /createApp\(\)/);
  assert.match(preload, /contextBridge\.exposeInMainWorld\('aiosNative'/);
  assert.match(preload, /openBrowserUrl/);
});

test('copilot provider catalog includes OpenClaw-style model IDs', async () => {
  const providersJs = await fs.readFile(path.join(repoRoot, 'server', 'providers.js'), 'utf8');

  assert.match(providersJs, /github-copilot\/claude-opus-4\.7/);
  assert.match(providersJs, /github-copilot\/gpt-5\.4/);
  assert.match(providersJs, /defaultModel: 'github-copilot\/gpt-4o'/);
  assert.doesNotMatch(providersJs, /github-copilot\/o3/);
  assert.doesNotMatch(providersJs, /github-copilot\/gpt-5\.3-codex/);
  assert.doesNotMatch(providersJs, /github-copilot\/gpt-5\.5/);
});

test('setup wizard uses provider cards and device-login copy', async () => {
  const indexHtml = await fs.readFile(path.join(repoRoot, 'public', 'index.html'), 'utf8');
  const stylesCss = await fs.readFile(path.join(repoRoot, 'public', 'styles.css'), 'utf8');

  assert.match(indexHtml, /class="wizard-stepper"/);
  assert.match(indexHtml, /class="wizard-hero-panel"/);
  assert.match(indexHtml, /Live model catalog/);
  assert.match(indexHtml, /id="wizardProviderGroups" class="wizard-provider-cards"/);
  assert.match(indexHtml, /github\.com\/login\/device/);
  assert.match(stylesCss, /\.wizard-hero-panel/);
  assert.match(stylesCss, /\.provider-card-glyph/);
  assert.match(stylesCss, /\.provider-card/);
  assert.match(stylesCss, /\.model-picker-card/);
  assert.match(stylesCss, /\.titlebar-button/);
  assert.match(stylesCss, /\.code-block/);
  assert.match(stylesCss, /--liquid-glass-bg/);
  assert.match(stylesCss, /--liquid-glass-shadow/);
  assert.match(stylesCss, /\.desktop-shell::before/);
  assert.match(stylesCss, /\.dock-item::before/);
  assert.match(stylesCss, /\.apps-window/);
  assert.match(stylesCss, /\.app-launch-card/);
  assert.match(stylesCss, /\.chat-model-select/);
  assert.match(stylesCss, /\.messages \.message:first-child\.system/);
  assert.match(stylesCss, /\.app-window::before/);
  assert.match(stylesCss, /#windowSettings/);
  assert.match(stylesCss, /#windowBrowser/);
  assert.match(stylesCss, /\.settings-window/);
  assert.match(stylesCss, /#windowChat\s*\{[\s\S]*left: clamp/);
  assert.match(stylesCss, /#windowApps\s*\{[\s\S]*calc\(\(100vw - min\(820px/);
  assert.match(stylesCss, /Performance profile/);
  assert.match(stylesCss, /\.app-window\.dragging/);
  assert.match(stylesCss, /\.message\.assistant,[\s\S]*backdrop-filter: none/);
  assert.match(stylesCss, /mix-blend-mode: normal/);
  assert.match(stylesCss, /html,\s*body\s*\{[\s\S]*overflow: hidden/);
  assert.match(stylesCss, /\.window-body\s*\{[\s\S]*overflow: hidden/);
  assert.match(stylesCss, /App-shell layout: one fixed desktop/);
  assert.match(stylesCss, /\.settings-window \.control-group,[\s\S]*overflow: visible/);
  assert.match(stylesCss, /\.settings-window\s*\{[\s\S]*display: grid/);
  assert.match(stylesCss, /\.settings-window\s*\{[\s\S]*height: calc\(100% - 44px\)/);
  assert.match(stylesCss, /scrollbar-gutter: stable/);
  assert.match(stylesCss, /prefers-reduced-motion: reduce/);
});
