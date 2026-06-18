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

function buildExecResult({ error, stdout, stderr }) {
  if (error) {
    const exitCode = typeof error.code === 'number' ? error.code : -1;
    return {
      ok: false,
      stdout: String(stdout || ''),
      stderr: String(stderr || ''),
      code: exitCode,
      signal: error.signal || null,
      timedOut: error.killed === true
    };
  }

  return {
    ok: true,
    stdout: String(stdout || ''),
    stderr: String(stderr || ''),
    code: 0,
    signal: null,
    timedOut: false
  };
}

function startExecCommand({ command, cwd, timeoutMs, maxBuffer, processRegistry }) {
  const trackedProcess = processRegistry?.startProcess({
    type: 'exec',
    title: command,
    command,
    cwd,
    metadata: {
      timeoutMs,
      maxOutputBytes: maxBuffer
    }
  });

  let child = null;
  const done = new Promise((resolve) => {
    child = exec(
      command,
      {
        cwd,
        timeout: timeoutMs,
        maxBuffer,
        shell: '/bin/bash'
      },
      (error, stdout, stderr) => {
        const result = buildExecResult({ error, stdout, stderr });
        const currentProcess = trackedProcess ? processRegistry.getProcess(trackedProcess.id) : null;
        const completedProcess = trackedProcess
          ? processRegistry.completeProcess(trackedProcess.id, {
              ...result,
              status: currentProcess?.status === 'cancelled'
                ? 'cancelled'
                : (result.ok ? 'completed' : 'failed')
            })
          : null;

        resolve({
          ...result,
          processId: trackedProcess?.id || null,
          process: completedProcess
        });
      }
    );
  });

  if (trackedProcess) {
    processRegistry.attachRuntime(trackedProcess.id, {
      pid: child?.pid || null,
      cancel: () => child?.kill('SIGTERM') === true
    });
  }

  return {
    process: trackedProcess ? processRegistry.getProcess(trackedProcess.id) : null,
    done
  };
}

function runExecCommand({ command, cwd, timeoutMs, maxBuffer, processRegistry }) {
  return new Promise((resolve) => {
    const { done } = startExecCommand({
      command,
      cwd,
      timeoutMs,
      maxBuffer,
      processRegistry
    });

    done.then(resolve);
  });
}

module.exports = {
  validateExecCommand,
  runExecCommand,
  startExecCommand
};
