const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { resolveSandboxPath } = require('../server/sandbox');

const sandboxRoot = path.join(process.cwd(), 'workspace');

test('resolveSandboxPath allows safe relative file path', () => {
  const result = resolveSandboxPath(sandboxRoot, 'notes/todo.txt');

  assert.equal(result.ok, true);
  assert.equal(result.targetPath.endsWith(path.join('workspace', 'notes', 'todo.txt')), true);
});

test('resolveSandboxPath rejects traversal outside sandbox', () => {
  const result = resolveSandboxPath(sandboxRoot, '../secrets.txt');

  assert.equal(result.ok, false);
  assert.match(result.error, /escapes the sandbox root/i);
});

test('resolveSandboxPath rejects absolute paths', () => {
  const absolutePath = path.resolve('/etc/passwd');
  const result = resolveSandboxPath(sandboxRoot, absolutePath);

  assert.equal(result.ok, false);
  assert.match(result.error, /absolute paths are not allowed/i);
});

test('resolveSandboxPath allows root when explicitly requested', () => {
  const result = resolveSandboxPath(sandboxRoot, '.', { allowRoot: true });

  assert.equal(result.ok, true);
  assert.equal(result.targetPath, path.resolve(sandboxRoot));
});
