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
  assert.match(indexHtml, /id="windowFiles"/);
  assert.match(indexHtml, /id="windowTerminal"/);
  assert.match(indexHtml, /id="windowSettings"/);
  assert.match(indexHtml, /id="openSetupAssistant"/);
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
});
