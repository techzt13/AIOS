const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('events');

const { createApp } = require('../server/index');
const {
  nativeBrowserCommand,
  normalizeBrowserUrl,
  openNativeBrowserUrl
} = require('../server/browserLauncher');

async function withServer(app, run) {
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, () => resolve(listener));
  });

  try {
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test('browser launcher normalizes URLs and search queries safely', () => {
  assert.equal(normalizeBrowserUrl('youtube.com/watch?v=abc'), 'https://youtube.com/watch?v=abc');
  assert.equal(normalizeBrowserUrl('localhost:8080'), 'http://localhost:8080/');
  assert.equal(normalizeBrowserUrl('https://example.com/path'), 'https://example.com/path');
  assert.equal(normalizeBrowserUrl('ai os browser'), 'https://www.google.com/search?q=ai%20os%20browser');
  assert.throws(() => normalizeBrowserUrl('file:///etc/passwd'), /Only http:\/\/ and https:\/\//);
});

test('browser launcher chooses platform-native commands without shell interpolation', async () => {
  assert.deepEqual(nativeBrowserCommand('https://youtube.com/', 'darwin'), {
    command: 'open',
    args: ['https://youtube.com/'],
    mode: 'macos-default-browser'
  });
  assert.deepEqual(nativeBrowserCommand('https://youtube.com/', 'linux'), {
    command: 'xdg-open',
    args: ['https://youtube.com/'],
    mode: 'linux-default-browser'
  });
  assert.equal(nativeBrowserCommand('https://youtube.com/', 'win32').command, 'cmd');

  let spawned = null;
  const result = await openNativeBrowserUrl('youtube.com', {
    platform: 'darwin',
    spawn: (command, args, options) => {
      spawned = { command, args, options };
      const child = new EventEmitter();
      child.pid = 1234;
      child.unref = () => {};
      process.nextTick(() => child.emit('spawn'));
      return child;
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.url, 'https://youtube.com/');
  assert.equal(result.mode, 'macos-default-browser');
  assert.equal(spawned.command, 'open');
  assert.deepEqual(spawned.args, ['https://youtube.com/']);
  assert.equal(spawned.options.detached, true);
  assert.equal(spawned.options.stdio, 'ignore');
});

test('browser open API delegates to the native browser launcher', async () => {
  let receivedUrl = null;
  const app = createApp({
    openNativeBrowserUrl: async (url) => {
      receivedUrl = url;
      return { ok: true, url: 'https://youtube.com/', mode: 'test-native-browser' };
    }
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/browser/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'youtube.com' })
    });
    const payload = await response.json();

    assert.equal(response.ok, true);
    assert.equal(payload.ok, true);
    assert.equal(payload.mode, 'test-native-browser');
    assert.equal(receivedUrl, 'youtube.com');
  });
});
