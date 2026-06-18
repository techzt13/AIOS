const crypto = require('crypto');

function nowIso() {
  return new Date().toISOString();
}

function sanitizeProcess(process) {
  const {
    cancel,
    ...safeProcess
  } = process;
  return safeProcess;
}

class ProcessRegistry {
  constructor({ maxHistory = 200 } = {}) {
    this.maxHistory = maxHistory;
    this.processes = new Map();
  }

  startProcess({ type, title, command = null, cwd = null, metadata = {} }) {
    const timestamp = nowIso();
    const process = {
      id: crypto.randomUUID(),
      type,
      title,
      command,
      cwd,
      metadata,
      pid: null,
      status: 'running',
      stdout: '',
      stderr: '',
      code: null,
      signal: null,
      timedOut: false,
      createdAt: timestamp,
      startedAt: timestamp,
      updatedAt: timestamp,
      endedAt: null,
      cancel: null
    };

    this.processes.set(process.id, process);
    this.trimHistory();
    return sanitizeProcess(process);
  }

  attachRuntime(id, { pid = null, cancel = null } = {}) {
    const process = this.processes.get(id);
    if (!process) {
      return null;
    }

    process.pid = pid;
    process.cancel = typeof cancel === 'function' ? cancel : null;
    process.updatedAt = nowIso();
    return sanitizeProcess(process);
  }

  completeProcess(id, update = {}) {
    const process = this.processes.get(id);
    if (!process) {
      return null;
    }

    const timestamp = nowIso();
    const status = process.status === 'cancelled'
      ? 'cancelled'
      : (update.status || (update.code === 0 ? 'completed' : 'failed'));

    Object.assign(process, {
      stdout: typeof update.stdout === 'string' ? update.stdout : process.stdout,
      stderr: typeof update.stderr === 'string' ? update.stderr : process.stderr,
      code: typeof update.code === 'number' ? update.code : process.code,
      signal: update.signal || process.signal,
      timedOut: Boolean(update.timedOut),
      status,
      updatedAt: timestamp,
      endedAt: process.endedAt || timestamp,
      cancel: null
    });

    return sanitizeProcess(process);
  }

  failProcess(id, error) {
    return this.completeProcess(id, {
      status: 'failed',
      code: -1,
      stderr: String(error?.message || error || 'Process failed.')
    });
  }

  cancelProcess(id) {
    const process = this.processes.get(id);
    if (!process) {
      return { ok: false, error: 'Process not found.' };
    }

    if (process.status !== 'running') {
      return { ok: false, error: `Process is already ${process.status}.`, process: sanitizeProcess(process) };
    }

    if (!process.cancel) {
      return { ok: false, error: 'Process cannot be cancelled.', process: sanitizeProcess(process) };
    }

    const cancelled = process.cancel();
    if (!cancelled) {
      return { ok: false, error: 'Process did not accept cancellation.', process: sanitizeProcess(process) };
    }

    const timestamp = nowIso();
    process.status = 'cancelled';
    process.signal = process.signal || 'SIGTERM';
    process.updatedAt = timestamp;
    process.endedAt = timestamp;
    process.cancel = null;
    return { ok: true, process: sanitizeProcess(process) };
  }

  getProcess(id) {
    const process = this.processes.get(id);
    return process ? sanitizeProcess(process) : null;
  }

  listProcesses() {
    return Array.from(this.processes.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((process) => ({
        id: process.id,
        type: process.type,
        title: process.title,
        command: process.command,
        cwd: process.cwd,
        metadata: process.metadata,
        pid: process.pid,
        status: process.status,
        code: process.code,
        timedOut: process.timedOut,
        createdAt: process.createdAt,
        startedAt: process.startedAt,
        updatedAt: process.updatedAt,
        endedAt: process.endedAt
      }));
  }

  trimHistory() {
    if (this.processes.size <= this.maxHistory) {
      return;
    }

    const removable = Array.from(this.processes.values())
      .filter((process) => process.status !== 'running')
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    while (this.processes.size > this.maxHistory && removable.length > 0) {
      this.processes.delete(removable.shift().id);
    }
  }
}

module.exports = { ProcessRegistry };
