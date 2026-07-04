const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const LINUX_RUN_TIMEOUT_MS = Number(process.env.LINUX_RUN_TIMEOUT_MS || 30000);
const LINUX_RUN_MAX_OUTPUT_BYTES = Number(process.env.LINUX_RUN_MAX_OUTPUT_BYTES || 256000);
const LINUX_RUNTIME_IMAGE = process.env.LINUX_RUNTIME_IMAGE || 'ubuntu:24.04';
const RUNTIME_PATH = [
  process.env.PATH,
  '/opt/homebrew/bin',
  '/usr/local/bin',
  '/usr/bin',
  '/bin',
  '/usr/sbin',
  '/sbin'
].filter(Boolean).join(':');

function runCommand({ command, args = [], cwd, timeoutMs = LINUX_RUN_TIMEOUT_MS, maxOutputBytes = LINUX_RUN_MAX_OUTPUT_BYTES }) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, PATH: RUNTIME_PATH },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const append = (current, chunk) => (current + chunk.toString()).slice(-maxOutputBytes);
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);

    child.stdout?.on('data', (chunk) => {
      stdout = append(stdout, chunk);
    });
    child.stderr?.on('data', (chunk) => {
      stderr = append(stderr, chunk);
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      resolve({ ok: false, stdout, stderr: error.message, code: -1, timedOut });
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        stdout,
        stderr,
        code: typeof code === 'number' ? code : -1,
        signal,
        timedOut
      });
    });
  });
}

async function commandExists(command, deps = {}) {
  const run = deps.runCommand || runCommand;
  const result = await run({ command, args: ['--version'], timeoutMs: 5000, maxOutputBytes: 20000 });
  return result.ok;
}

async function runtimeImageExists(dockerCommand, deps = {}) {
  const run = deps.runCommand || runCommand;
  const result = await run({
    command: dockerCommand,
    args: ['images', '--format', '{{.Repository}}:{{.Tag}}', LINUX_RUNTIME_IMAGE],
    timeoutMs: 10000,
    maxOutputBytes: 20000
  });
  return result.ok && result.stdout.trim().includes(LINUX_RUNTIME_IMAGE);
}

async function ensureLinuxRuntimeImage(deps = {}) {
  const dockerCommand = resolveDockerCommand(deps);
  if (!dockerCommand || !(await commandExists(dockerCommand, deps))) {
    return { ok: false, pulled: false, error: 'Docker not available' };
  }
  if (await runtimeImageExists(dockerCommand, deps)) {
    return { ok: true, pulled: false, image: LINUX_RUNTIME_IMAGE };
  }

  const run = deps.runCommand || runCommand;
  const result = await run({
    command: dockerCommand,
    args: ['pull', LINUX_RUNTIME_IMAGE],
    timeoutMs: 300000,
    maxOutputBytes: 256000
  });
  return {
    ok: result.ok,
    pulled: result.ok,
    image: LINUX_RUNTIME_IMAGE,
    error: result.ok ? undefined : (result.stderr || 'docker pull failed')
  };
}

function resolveDockerCommand(deps = {}) {
  if (deps.dockerCommand) return deps.dockerCommand;
  const candidates = [
    process.env.AIOS_DOCKER_PATH,
    '/usr/local/bin/docker',
    '/opt/homebrew/bin/docker',
    'docker'
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (candidate === 'docker') return candidate;
    try {
      require('fs').accessSync(candidate, require('fs').constants.X_OK);
      return candidate;
    } catch {
      // try next
    }
  }
  return 'docker';
}

async function assertSafeArchiveEntries(archivePath, deps = {}) {
  const run = deps.runCommand || runCommand;
  const result = await run({
    command: 'tar',
    args: ['-tf', archivePath],
    timeoutMs: 10000,
    maxOutputBytes: 512000
  });
  if (!result.ok) {
    throw new Error(`Could not inspect Linux package archive: ${result.stderr || result.stdout || 'tar failed'}`);
  }

  const entries = result.stdout.split('\n').map((line) => line.trim()).filter(Boolean);
  if (entries.length === 0) {
    throw new Error('Linux package archive is empty.');
  }

  for (const entry of entries) {
    if (entry.startsWith('/') || entry.includes('../') || entry === '..') {
      throw new Error(`Linux package archive contains unsafe path: ${entry}`);
    }
  }
}

async function extractArchive(archivePath, deps = {}) {
  const run = deps.runCommand || runCommand;
  const tempRoot = deps.tempRoot || os.tmpdir();
  const extractDir = await fs.mkdtemp(path.join(tempRoot, 'aios-linux-run-'));

  await assertSafeArchiveEntries(archivePath, deps);
  const result = await run({
    command: 'tar',
    args: ['-xf', archivePath, '-C', extractDir],
    timeoutMs: 20000,
    maxOutputBytes: 512000
  });
  if (!result.ok) {
    throw new Error(`Could not extract Linux package archive: ${result.stderr || result.stdout || 'tar failed'}`);
  }

  return extractDir;
}

function scoreExecutable(filePath, packageName) {
  const base = path.basename(filePath).toLowerCase();
  const packageBase = String(packageName || '').toLowerCase().replace(/[^a-z0-9._-]/g, '');
  if (packageBase && (base === packageBase || packageBase.includes(base) || base.includes(packageBase))) return 100;
  if (!base.includes('.') && !['readme', 'license', 'changelog'].includes(base)) return 50;
  return 10;
}

async function findExecutables(rootDir, packageName) {
  const candidates = [];

  async function walk(currentDir, depth = 0) {
    if (depth > 5) return;
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
        continue;
      }
      if (!entry.isFile()) continue;

      const stat = await fs.stat(fullPath);
      if ((stat.mode & 0o111) !== 0) {
        candidates.push({
          hostPath: fullPath,
          relativePath: path.relative(rootDir, fullPath).split(path.sep).join('/'),
          score: scoreExecutable(fullPath, packageName)
        });
      }
    }
  }

  await walk(rootDir);
  return candidates.sort((a, b) => b.score - a.score || a.relativePath.localeCompare(b.relativePath));
}

function sanitizeArgs(args) {
  if (!Array.isArray(args)) return [];
  return args.map((arg) => String(arg)).filter((arg) => arg.length <= 500).slice(0, 50);
}

async function startLinuxPackage({
  linuxPackage,
  executablePath,
  args = ['--version'],
  processRegistry,
  deps = {}
}) {
  if (!linuxPackage?.archivePath) {
    throw new Error('Linux package archive is missing.');
  }

  if (!(await commandExists('docker', deps))) {
    throw new Error('Linux runtime is not available. Install/start Docker Desktop or Colima, then try Run again.');
  }

  const extractDir = await extractArchive(linuxPackage.archivePath, deps);
  const executables = await findExecutables(extractDir, linuxPackage.name);
  const selected = executablePath
    ? executables.find((item) => item.relativePath === executablePath)
    : executables[0];

  if (!selected) {
    throw new Error('No executable file was found inside this Linux package.');
  }

  const commandArgs = [
    'run',
    '--rm',
    '--network', 'none',
    '--platform', 'linux/amd64',
    '-v', `${extractDir}:/app:ro`,
    '-w', '/app',
    LINUX_RUNTIME_IMAGE,
    `./${selected.relativePath}`,
    ...sanitizeArgs(args)
  ];
  const commandLabel = `docker ${commandArgs.join(' ')}`;
  const trackedProcess = processRegistry?.startProcess({
    type: 'linux-app',
    title: linuxPackage.name,
    command: commandLabel,
    cwd: extractDir,
    metadata: {
      packageId: linuxPackage.id,
      filename: linuxPackage.filename,
      executablePath: selected.relativePath,
      runtime: 'docker',
      image: LINUX_RUNTIME_IMAGE
    }
  });

  const spawnImpl = deps.spawn || spawn;
  const child = spawnImpl('docker', commandArgs, {
    cwd: extractDir,
    env: { ...process.env, PATH: RUNTIME_PATH },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let stdout = '';
  let stderr = '';
  let timedOut = false;
  const append = (current, chunk) => (current + chunk.toString()).slice(-LINUX_RUN_MAX_OUTPUT_BYTES);
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill('SIGTERM');
  }, LINUX_RUN_TIMEOUT_MS);

  child.stdout?.on('data', (chunk) => {
    stdout = append(stdout, chunk);
  });
  child.stderr?.on('data', (chunk) => {
    stderr = append(stderr, chunk);
  });

  child.on('error', (error) => {
    clearTimeout(timer);
    processRegistry?.completeProcess(trackedProcess.id, {
      status: 'failed',
      code: -1,
      stdout,
      stderr: error.message,
      timedOut
    });
  });
  child.on('close', async (code, signal) => {
    clearTimeout(timer);
    processRegistry?.completeProcess(trackedProcess.id, {
      status: code === 0 ? 'completed' : 'failed',
      code: typeof code === 'number' ? code : -1,
      signal,
      stdout,
      stderr,
      timedOut
    });
    try { await fs.rm(extractDir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  });

  processRegistry?.attachRuntime(trackedProcess.id, {
    pid: child.pid || null,
    cancel: () => child.kill('SIGTERM') === true
  });

  return {
    ok: true,
    process: processRegistry.getProcess(trackedProcess.id),
    executablePath: selected.relativePath,
    runtime: 'docker'
  };
}

module.exports = {
  assertSafeArchiveEntries,
  commandExists,
  ensureLinuxRuntimeImage,
  extractArchive,
  findExecutables,
  resolveDockerCommand,
  runCommand,
  startLinuxPackage
};
