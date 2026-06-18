const { spawn } = require('child_process');

function normalizeBrowserUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    throw new Error('A URL or search query is required.');
  }

  if (/^https?:\/\//i.test(raw)) {
    return assertHttpUrl(raw);
  }

  if (/^localhost(?::\d+)?(\/.*)?$/i.test(raw)) {
    return assertHttpUrl(`http://${raw}`);
  }

  if (/^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(?::\d+)?(\/.*)?$/.test(raw)) {
    return assertHttpUrl(`https://${raw}`);
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) {
    return assertHttpUrl(raw);
  }

  return `https://www.google.com/search?q=${encodeURIComponent(raw)}`;
}

function assertHttpUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('A valid http:// or https:// URL is required.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http:// and https:// URLs are supported.');
  }

  return parsed.toString();
}

function nativeBrowserCommand(url, platform = process.platform) {
  if (platform === 'darwin') {
    return {
      command: 'open',
      args: [url],
      mode: 'macos-default-browser'
    };
  }

  if (platform === 'win32') {
    return {
      command: 'cmd',
      args: ['/c', 'start', '', url],
      options: { windowsHide: true },
      mode: 'windows-default-browser'
    };
  }

  return {
    command: 'xdg-open',
    args: [url],
    mode: 'linux-default-browser'
  };
}

async function openNativeBrowserUrl(value, deps = {}) {
  const url = normalizeBrowserUrl(value);
  const platform = deps.platform || process.platform;
  const spawnImpl = deps.spawn || spawn;
  const launch = nativeBrowserCommand(url, platform);
  const child = spawnImpl(launch.command, launch.args, {
    detached: true,
    stdio: 'ignore',
    ...(launch.options || {})
  });

  await new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback(result);
    };

    const timer = setTimeout(() => finish(resolve), 75);
    if (typeof child.once === 'function') {
      child.once('spawn', () => finish(resolve));
      child.once('error', (error) => finish(reject, error));
    }
  });

  if (typeof child.unref === 'function') {
    child.unref();
  }

  return {
    ok: true,
    url,
    mode: launch.mode,
    pid: child.pid || null
  };
}

module.exports = {
  assertHttpUrl,
  nativeBrowserCommand,
  normalizeBrowserUrl,
  openNativeBrowserUrl
};
