const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

test('legacy Docker and XFCE desktop artifacts are not tracked', async () => {
  const legacyPaths = [
    'Dockerfile',
    'docker-compose.yml',
    '.dockerignore',
    'get-docker.sh',
    '.devcontainer/devcontainer.json',
    'desktop/Dockerfile',
    'desktop/README.md'
  ];

  for (const legacyPath of legacyPaths) {
    await assert.rejects(
      fs.access(path.join(repoRoot, legacyPath)),
      /ENOENT/
    );
  }
});

test('local runtime defaults do not point at container-only hosts', async () => {
  const envExample = await fs.readFile(path.join(repoRoot, '.env.example'), 'utf8');
  const providersJs = await fs.readFile(path.join(repoRoot, 'server', 'providers.js'), 'utf8');
  const readme = await fs.readFile(path.join(repoRoot, 'README.md'), 'utf8');

  assert.match(envExample, /WORKSPACE_ROOT=\.\/workspace/);
  assert.doesNotMatch(envExample, /\/app\/workspace/);
  assert.doesNotMatch(providersJs, /host\.docker\.internal/);
  assert.doesNotMatch(readme, /docker compose up/);
});
