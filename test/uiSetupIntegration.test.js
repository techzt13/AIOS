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

test('wizard frontend uses existing first-run and provider test endpoints', async () => {
  const appJs = await fs.readFile(path.join(repoRoot, 'public', 'app.js'), 'utf8');

  assert.match(appJs, /\/api\/settings\/first-run/);
  assert.match(appJs, /\/api\/providers/);
  assert.match(appJs, /\/api\/settings\/providers\/\$\{encodeURIComponent\(provider\.id\)\}\/test/);
  assert.match(appJs, /\/api\/auth\/github-copilot\/start/);
  assert.match(appJs, /\/api\/auth\/github-copilot\/poll/);
});

test('desktop Dockerfile now applies AIOS theme assets and scripts', async () => {
  const dockerfile = await fs.readFile(path.join(repoRoot, 'desktop', 'Dockerfile'), 'utf8');

  assert.match(dockerfile, /WhiteSur-gtk-theme/);
  assert.match(dockerfile, /plank/);
  assert.match(dockerfile, /COPY desktop\/scripts\/apply-theme\.sh/);
  assert.match(dockerfile, /COPY desktop\/assets\/aios-wallpaper\.svg/);
});
