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
  assert.match(indexHtml, /id="chatStatusPill"/);
  assert.match(indexHtml, /id="windowFiles"/);
  assert.match(indexHtml, /id="windowTerminal"/);
  assert.match(indexHtml, /id="windowSettings"/);
  assert.match(indexHtml, /id="windowApps"/);
  assert.match(indexHtml, /id="openSetupAssistant"/);
  assert.match(indexHtml, /data-launch-app="chat"/);
  assert.match(indexHtml, /data-launch-app="settings"/);
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
  assert.match(appJs, /function startNewChat/);
  assert.match(appJs, /apps: 'windowApps'/);
  assert.match(appJs, /data-launch-app/);
  assert.doesNotMatch(appJs, /dataset\.openApp === 'apps'[\s\S]{0,120}openWindow\('settings'\)/);
  assert.match(appJs, /Your provider login and saved API keys were not changed/);
  assert.match(appJs, /function renderMessageContent/);
  assert.match(appJs, /code-copy-button/);
  assert.match(appJs, /function persistProviderChoice/);
  assert.match(appJs, /function updateChatStatusPill/);
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
  assert.match(appJs, /github-copilot\/gpt-4o/);
  assert.match(appJs, /loadWizardProviders\(preferredProviderId = ''\)/);
  assert.match(appJs, /await loadWizardProviders\(wizardProviderId\)/);
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
  assert.match(stylesCss, /\.chat-status-pill/);
  assert.match(stylesCss, /\.messages \.message:first-child\.system/);
  assert.match(stylesCss, /\.app-window::before/);
  assert.match(stylesCss, /#windowSettings/);
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
