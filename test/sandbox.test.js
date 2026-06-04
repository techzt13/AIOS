const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { resolveSandboxPath } = require('../server/sandbox');

test('resolveSandboxPath allows safe relative file path', () => {
  const result = resolveSandboxPath('/tmp/workspace', 'notes/hello.txt');
  assert.equal(result.ok, true);
  assert.equal(result.targetPath, path.resolve('/tmp/workspace', 'notes/hello.txt'));
});

test('resolveSandboxPath rejects traversal outside sandbox', () => {
  const result = resolveSandboxPath('/tmp/workspace', '../etc/passwd');
  assert.equal(result.ok, false);
  assert.match(result.error, /escapes the sandbox root/i);
});

test('resolveSandboxPath rejects absolute paths', () => {
  const result = resolveSandboxPath('/tmp/workspace', '/etc/passwd');
  assert.equal(result.ok, false);
  assert.match(result.error, /absolute paths are not allowed/i);
});
