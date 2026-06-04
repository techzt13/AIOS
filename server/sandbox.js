const path = require('path');

function resolveSandboxPath(sandboxRoot, requestedPath) {
  if (!requestedPath || typeof requestedPath !== 'string') {
    return { ok: false, error: 'A non-empty file path is required.' };
  }

  if (path.isAbsolute(requestedPath)) {
    return { ok: false, error: 'Absolute paths are not allowed. Use a relative path inside the sandbox.' };
  }

  const resolvedSandboxRoot = path.resolve(sandboxRoot);
  const targetPath = path.resolve(resolvedSandboxRoot, requestedPath);

  if (targetPath === resolvedSandboxRoot) {
    return { ok: false, error: 'Target path must point to a file inside the sandbox.' };
  }

  if (!targetPath.startsWith(`${resolvedSandboxRoot}${path.sep}`)) {
    return { ok: false, error: 'Path escapes the sandbox root and is not allowed.' };
  }

  return { ok: true, targetPath, sandboxRoot: resolvedSandboxRoot };
}

module.exports = { resolveSandboxPath };
