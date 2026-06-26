const pty = require('@homebridge/node-pty-prebuilt-multiarch');
const fsSync = require('fs');
const fs = require('fs/promises');
const os = require('os');
const { getLinuxPackage } = require('./appDataStore');
const { extractArchive, findExecutables, commandExists } = require('./linuxRunner');

const LINUX_RUNTIME_IMAGE = process.env.LINUX_RUNTIME_IMAGE || 'ubuntu:24.04';
const DEFAULT_RUNTIME_PATHS = [
  process.env.PATH,
  '/opt/homebrew/bin',
  '/usr/local/bin',
  '/usr/bin',
  '/bin',
  '/usr/sbin',
  '/sbin'
].filter(Boolean);

function runtimeEnv() {
  return {
    ...process.env,
    PATH: Array.from(new Set(DEFAULT_RUNTIME_PATHS.join(':').split(':').filter(Boolean))).join(':'),
    TERM: 'xterm-256color'
  };
}

function resolveExecutable(command) {
  if (command === 'bash') return '/bin/bash';

  const candidates = [
    process.env.AIOS_DOCKER_PATH,
    '/usr/local/bin/docker',
    '/opt/homebrew/bin/docker'
  ].filter(Boolean);
  return candidates.find((candidate) => fsSync.existsSync(candidate)) || command;
}

async function removeExtractDir(extractDir) {
  if (!extractDir) return;
  try {
    await fs.rm(extractDir, { recursive: true, force: true });
  } catch {
    // Temporary runtime extraction cleanup is best-effort.
  }
}

function setupPtySocket(wss, processRegistry) {
  wss.on('connection', (ws, req) => {
    let ptyProcess = null;
    let extractDir = null;

    ws.on('message', async (message) => {
      try {
        const msg = JSON.parse(message);
        
        if (msg.type === 'init') {
          // Initialize terminal using fallback child_process spawn
          let command = resolveExecutable('bash');
          let args = ['-l'];
          let cwd = os.homedir();
          const env = runtimeEnv();
          
          if (msg.packageId) {
            // Interactive Linux Package mode
            const linuxPackage = await getLinuxPackage(msg.packageId);
            if (!linuxPackage) {
               ws.send(JSON.stringify({ type: 'error', data: 'Linux package not found' }));
               return ws.close();
            }
            const dockerCommand = resolveExecutable('docker');
            if (!(await commandExists(dockerCommand))) {
               ws.send(JSON.stringify({ type: 'error', data: 'Docker not available' }));
               return ws.close();
            }
            extractDir = await extractArchive(linuxPackage.archivePath);
            const executables = await findExecutables(extractDir, linuxPackage.name);
            const selected = msg.executablePath
              ? executables.find(item => item.relativePath === msg.executablePath)
              : executables[0];

            if (!selected) {
               ws.send(JSON.stringify({ type: 'error', data: 'No executable found' }));
               return ws.close();
            }

            command = dockerCommand;
            args = [
              'run', '-it', '--rm',
              '--network', 'none',
              '--platform', 'linux/amd64',
              '-v', `${extractDir}:/app:ro`,
              '-w', '/app',
              LINUX_RUNTIME_IMAGE,
              `./${selected.relativePath}`,
              ...(msg.args || [])
            ];
            cwd = extractDir;
          }

          ptyProcess = pty.spawn(command, args, {
            name: 'xterm-256color',
            cols: msg.cols || 80,
            rows: msg.rows || 24,
            cwd,
            env
          });

          ptyProcess.onData((data) => {
            if (ws.readyState === 1) {
              ws.send(JSON.stringify({ type: 'data', data }));
            }
          });

          ptyProcess.onExit(async ({ exitCode }) => {
            if (ws.readyState === 1) {
              ws.send(JSON.stringify({ type: 'exit', code: exitCode }));
              ws.close();
            }
            await removeExtractDir(extractDir);
          });

          ws.send(JSON.stringify({ type: 'ready' }));
        }

        if (msg.type === 'data' && ptyProcess) {
          ptyProcess.write(msg.data);
        }

        if (msg.type === 'resize' && ptyProcess) {
          ptyProcess.resize(msg.cols, msg.rows);
        }

      } catch (err) {
        console.error('PTY error', err);
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'error', data: err.message }));
        }
      }
    });

    ws.on('close', async () => {
      if (ptyProcess) {
        ptyProcess.kill();
      }
      await removeExtractDir(extractDir);
    });
  });
}

module.exports = { setupPtySocket };
