const pty = require('node-pty');
const os = require('os');
const { getLinuxPackage } = require('./appDataStore');
const { extractArchive, findExecutables, commandExists } = require('./linuxRunner');
const path = require('path');

const LINUX_RUNTIME_IMAGE = process.env.LINUX_RUNTIME_IMAGE || 'ubuntu:24.04';

function setupPtySocket(wss, processRegistry) {
  wss.on('connection', (ws, req) => {
    let ptyProcess = null;
    let extractDir = null;

    ws.on('message', async (message) => {
      try {
        const msg = JSON.parse(message);
        
        if (msg.type === 'init') {
          // Initialize terminal
          let command = 'bash';
          let args = [];
          let cwd = os.homedir();
          let env = process.env;
          
          if (msg.packageId) {
            // Interactive Linux Package mode
            const linuxPackage = await getLinuxPackage(msg.packageId);
            if (!linuxPackage) {
               ws.send(JSON.stringify({ type: 'error', data: 'Linux package not found' }));
               return ws.close();
            }
            if (!(await commandExists('docker'))) {
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

            command = 'docker';
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
            cwd: cwd,
            env: env
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
            if (extractDir) {
              const fs = require('fs/promises');
              try { await fs.rm(extractDir, { recursive: true, force: true }); } catch (e) {}
            }
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
      if (extractDir) {
        const fs = require('fs/promises');
        try { await fs.rm(extractDir, { recursive: true, force: true }); } catch (e) {}
      }
    });
  });
}

module.exports = { setupPtySocket };
