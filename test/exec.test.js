const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { validateExecCommand, runExecCommand } = require('../server/exec');

test('validateExecCommand rejects empty commands', () => {
  const result = validateExecCommand('   ');
  assert.equal(result.ok, false);
  assert.match(result.error, /non-empty command/i);
});

test('runExecCommand executes command in workspace', async () => {
  const result = await runExecCommand({
    command: 'printf "ok"',
    cwd: path.join(process.cwd(), 'workspace'),
    timeoutMs: 5000,
    maxBuffer: 1024
  });

  assert.equal(result.ok, true);
  assert.equal(result.code, 0);
  assert.equal(result.stdout, 'ok');
});
