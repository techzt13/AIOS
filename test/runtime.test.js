const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp } = require('../server/index');
const { ProcessRegistry } = require('../server/processRegistry');

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

test('runtime API describes the local AIOS daemon without secrets', async () => {
  const processRegistry = new ProcessRegistry();
  const app = createApp({
    processRegistry,
    getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null })
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/runtime`);
    const payload = await response.json();

    assert.equal(response.ok, true);
    assert.equal(payload.ok, true);
    assert.equal(payload.runtime.name, 'AIOS');
    assert.equal(payload.runtime.mode, 'local-daemon');
    assert.equal(payload.runtime.localOnly, true);
    assert.equal(typeof payload.runtime.workspaceRoot, 'string');
    assert.equal(JSON.stringify(payload).includes('apiKey'), false);
  });
});

test('process registry tracks lifecycle and exposes safe process summaries', () => {
  const processRegistry = new ProcessRegistry();
  const started = processRegistry.startProcess({
    type: 'exec',
    title: 'printf "ok"',
    command: 'printf "ok"',
    cwd: '/tmp'
  });

  assert.equal(started.status, 'running');
  assert.equal('cancel' in started, false);

  processRegistry.attachRuntime(started.id, {
    pid: 123,
    cancel: () => true
  });
  const completed = processRegistry.completeProcess(started.id, {
    stdout: 'ok',
    stderr: '',
    code: 0
  });

  assert.equal(completed.status, 'completed');
  assert.equal(completed.stdout, 'ok');
  assert.equal(completed.pid, 123);

  const list = processRegistry.listProcesses();
  assert.equal(list.length, 1);
  assert.equal(list[0].status, 'completed');
  assert.equal('stdout' in list[0], false);
});

test('process API lists tracked AIOS processes', async () => {
  const processRegistry = new ProcessRegistry();
  processRegistry.completeProcess(
    processRegistry.startProcess({
      type: 'exec',
      title: 'echo process',
      command: 'echo process',
      cwd: '/tmp'
    }).id,
    { stdout: 'process\n', stderr: '', code: 0 }
  );

  const app = createApp({
    processRegistry,
    getGitHubCopilotStatus: async () => ({ configured: false, login: null, connectedAt: null })
  });

  await withServer(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/processes`);
    const payload = await response.json();

    assert.equal(response.ok, true);
    assert.equal(payload.ok, true);
    assert.equal(payload.processes.length, 1);
    assert.equal(payload.processes[0].title, 'echo process');

    const detailResponse = await fetch(`${baseUrl}/api/processes/${payload.processes[0].id}`);
    const detailPayload = await detailResponse.json();
    assert.equal(detailResponse.ok, true);
    assert.equal(detailPayload.process.stdout, 'process\n');
  });
});
