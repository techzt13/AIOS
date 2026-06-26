const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { EventEmitter } = require('events');
const { ProcessRegistry } = require('../server/processRegistry');
const {
  assertSafeArchiveEntries,
  findExecutables,
  startLinuxPackage
} = require('../server/linuxRunner');

test('linux runner identifies the most likely executable inside an extracted package', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-linux-executables-'));
  try {
    await fs.mkdir(path.join(tempDir, 'bin'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'micro'), { recursive: true });
    
    // Non-executables
    await fs.writeFile(path.join(tempDir, 'README.md'), 'test');
    await fs.writeFile(path.join(tempDir, 'micro/config.json'), '{}');
    
    // Executables
    await fs.writeFile(path.join(tempDir, 'bin/helper'), '#!/bin/bash', { mode: 0o755 });
    await fs.writeFile(path.join(tempDir, 'micro/micro'), 'ELF', { mode: 0o755 });

    const executables = await findExecutables(tempDir, 'micro');
    assert.equal(executables.length, 2);
    
    // `micro/micro` should be scored highest because it matches the package name
    assert.equal(executables[0].relativePath, 'micro/micro');
    assert.equal(executables[0].score, 100);
    assert.equal(executables[1].relativePath, 'bin/helper');
    assert.equal(executables[1].score, 50);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('linux runner rejects archives with path traversal', async () => {
  const runCommand = async ({ args }) => {
    return {
      ok: true,
      stdout: args.includes('safe.tar.gz') 
        ? 'micro/micro\nmicro/README.md\n'
        : 'micro/micro\n../../etc/passwd\n'
    };
  };

  await assert.doesNotReject(assertSafeArchiveEntries('safe.tar.gz', { runCommand }));
  await assert.rejects(
    assertSafeArchiveEntries('unsafe.tar.gz', { runCommand }),
    /unsafe path/
  );
});

test('linux runner executes package via docker and tracks process lifecycle', async () => {
  const processRegistry = new ProcessRegistry();
  const linuxPackage = {
    id: 'test-package-1',
    name: 'micro',
    filename: 'micro.tar.gz',
    archivePath: '/fake/store/micro.tar.gz'
  };

  let receivedCommand = null;
  const child = new EventEmitter();
  child.pid = 9999;
  child.kill = () => true;

  const deps = {
    runCommand: async ({ command, args }) => {
      if (command === 'docker') return { ok: true };
      if (command === 'tar') {
        if (args.includes('-tf')) {
           return { ok: true, stdout: 'micro\n' };
        }
        if (args.includes('-xf')) {
           const targetDir = args[args.indexOf('-C') + 1];
           await fs.writeFile(path.join(targetDir, 'micro'), 'ELF', { mode: 0o755 });
           return { ok: true };
        }
      }
      return { ok: false };
    },
    spawn: (command, args, options) => {
      receivedCommand = { command, args, options };
      return child;
    },
    tempRoot: os.tmpdir()
  };

  const startPromise = startLinuxPackage({
    linuxPackage,
    args: ['--version'],
    processRegistry,
    deps
  });

  await new Promise(resolve => setTimeout(resolve, 50));

  assert.equal(receivedCommand.command, 'docker');
  assert.equal(receivedCommand.args[0], 'run');
  assert.equal(receivedCommand.args.includes('./micro'), true);
  assert.equal(receivedCommand.args.includes('--version'), true);

  const processes = processRegistry.listProcesses();
  assert.equal(processes.length, 1);
  assert.equal(processes[0].status, 'running');
  assert.equal(processes[0].type, 'linux-app');
  assert.equal(processes[0].metadata.executablePath, 'micro');
  assert.equal(processes[0].pid, 9999);

  child.emit('close', 0, null);
  
  const result = await startPromise;
  assert.equal(result.ok, true);
  assert.equal(result.runtime, 'docker');
  
  const completedProcess = processRegistry.getProcess(processes[0].id);
  assert.equal(completedProcess.status, 'completed');
  assert.equal(completedProcess.code, 0);
});
