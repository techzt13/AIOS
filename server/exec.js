const { exec } = require('child_process');

function validateExecCommand(command) {
  if (typeof command !== 'string' || !command.trim()) {
    return { ok: false, error: 'A non-empty command string is required.' };
  }

  if (command.length > 4000) {
    return { ok: false, error: 'Command is too long. Max length is 4000 characters.' };
  }

  return { ok: true, command: command.trim() };
}

function runExecCommand({ command, cwd, timeoutMs, maxBuffer }) {
  return new Promise((resolve) => {
    exec(
      command,
      {
        cwd,
        timeout: timeoutMs,
        maxBuffer,
        shell: '/bin/bash'
      },
      (error, stdout, stderr) => {
        if (error) {
          const exitCode = typeof error.code === 'number' ? error.code : -1;
          return resolve({
            ok: false,
            stdout: String(stdout || ''),
            stderr: String(stderr || ''),
            code: exitCode,
            timedOut: error.killed === true
          });
        }

        return resolve({
          ok: true,
          stdout: String(stdout || ''),
          stderr: String(stderr || ''),
          code: 0,
          timedOut: false
        });
      }
    );
  });
}

module.exports = {
  validateExecCommand,
  runExecCommand
};
