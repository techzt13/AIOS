const os = require('os');
const { version } = require('../package.json');

const RUNTIME_STARTED_AT = new Date();

function getRuntimeInfo({
  host,
  port,
  workspaceRoot,
  dataDir,
  configDir,
  execEnabled,
  execTimeoutMs,
  execMaxOutputBytes,
  processRegistry
}) {
  const processes = processRegistry?.listProcesses?.() || [];
  const runningProcesses = processes.filter((process) => process.status === 'running').length;

  return {
    name: 'AIOS',
    version,
    mode: 'local-daemon',
    displayUrl: `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`,
    host,
    port,
    pid: process.pid,
    platform: process.platform,
    arch: process.arch,
    hostname: os.hostname(),
    startedAt: RUNTIME_STARTED_AT.toISOString(),
    uptimeSeconds: Math.floor((Date.now() - RUNTIME_STARTED_AT.getTime()) / 1000),
    workspaceRoot,
    dataDir,
    configDir,
    exec: {
      enabled: Boolean(execEnabled),
      timeoutMs: execTimeoutMs,
      maxOutputBytes: execMaxOutputBytes
    },
    processes: {
      total: processes.length,
      running: runningProcesses
    },
    localOnly: host === '127.0.0.1' || host === 'localhost'
  };
}

module.exports = { getRuntimeInfo };
