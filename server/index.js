require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { getProviders, getProviderById } = require('./providers');
const { resolveSandboxPath } = require('./sandbox');
const { validateExecCommand, runExecCommand } = require('./exec');

const app = express();
const PORT = Number(process.env.PORT || 8080);
const WORKSPACE_ROOT = path.resolve(process.env.WORKSPACE_ROOT || process.env.SANDBOX_DIR || path.join(process.cwd(), 'workspace'));
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120);
const ENABLE_EXEC_API = String(process.env.ENABLE_EXEC_API || '').toLowerCase() === 'true';
const EXEC_TIMEOUT_MS = Number(process.env.EXEC_TIMEOUT_MS || 15000);
const EXEC_MAX_OUTPUT_BYTES = Number(process.env.EXEC_MAX_OUTPUT_BYTES || 256000);
const FS_READ_MAX_BYTES = Number(process.env.FS_READ_MAX_BYTES || 1048576);

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Rate limit exceeded. Please retry in a moment.' }
});

app.use(express.json({ limit: '1mb' }));
app.use('/api', apiLimiter);
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'AIOS' });
});

app.get('/api/providers', (_req, res) => {
  res.json({ providers: getProviders() });
});

function normalizeBaseUrl(baseUrl) {
  let normalized = String(baseUrl || '').trim();

  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

async function parseProviderResponse(response) {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { error: { message: rawText } };
  }
}

async function proxyOpenAICompatibleChat({ baseUrl, apiKey, model, messages, providerId }) {
  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: 'Bearer ' + apiKey } : {}),
      ...(providerId === 'openrouter'
        ? {
            'HTTP-Referer': process.env.OPENROUTER_REFERER || 'http://localhost',
            'X-Title': process.env.OPENROUTER_TITLE || 'AIOS'
          }
        : {})
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false
    })
  });

  const data = await parseProviderResponse(response);

  if (!response.ok) {
    const message = data?.error?.message || `Provider request failed with status ${response.status}.`;
    return { ok: false, status: response.status, error: message, raw: data };
  }

  const assistantMessage = data?.choices?.[0]?.message?.content;

  return {
    ok: true,
    data,
    message: assistantMessage || ''
  };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { providerId, model, messages, apiKey: customApiKey } = req.body || {};

    if (!providerId || !model || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, error: 'providerId, model, and messages[] are required.' });
    }

    const provider = getProviderById(providerId);

    if (!provider) {
      return res.status(400).json({ ok: false, error: `Unknown provider: ${providerId}` });
    }

    if (!provider.openaiCompatible) {
      return res.status(400).json({
        ok: false,
        error: `${provider.name} currently needs a bespoke adapter in AIOS. TODO: implement non-OpenAI request shape for this provider.`
      });
    }

    const baseUrl = normalizeBaseUrl(process.env[provider.baseUrlEnv] || provider.defaultBaseUrl);

    const apiKey = provider.id === 'custom-openai'
      ? customApiKey || process.env[provider.apiKeyEnv]
      : process.env[provider.apiKeyEnv];

    if (provider.requiresApiKey && !apiKey) {
      return res.status(400).json({
        ok: false,
        error: `Missing API key for ${provider.name}. Set ${provider.apiKeyEnv} in .env${provider.id === 'custom-openai' ? ' or provide a key in the UI.' : '.'}`
      });
    }

    if (!baseUrl) {
      return res.status(400).json({
        ok: false,
        error: `Missing base URL for ${provider.name}. Set ${provider.baseUrlEnv} in .env.`
      });
    }

    const result = await proxyOpenAICompatibleChat({
      baseUrl,
      apiKey,
      model,
      messages,
      providerId: provider.id
    });

    if (!result.ok) {
      return res.status(result.status || 500).json({
        ok: false,
        error: result.error,
        provider: provider.id,
        details: result.raw
      });
    }

    return res.json({ ok: true, provider: provider.id, model, message: result.message, raw: result.data });
  } catch (error) {
    return res.status(500).json({ ok: false, error: `Chat request failed: ${error.message}` });
  }
});

app.post('/api/exec', apiLimiter, async (req, res) => {
  if (!ENABLE_EXEC_API) {
    return res.status(403).json({
      ok: false,
      error: 'Command execution is disabled. Set ENABLE_EXEC_API=true to enable in trusted environments.'
    });
  }

  const validation = validateExecCommand(req.body?.command);
  if (!validation.ok) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    const result = await runExecCommand({
      command: validation.command,
      cwd: WORKSPACE_ROOT,
      timeoutMs: EXEC_TIMEOUT_MS,
      maxBuffer: EXEC_MAX_OUTPUT_BYTES
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ ok: false, stdout: '', stderr: String(error.message || error), code: -1 });
  }
});

app.post('/api/fs/write', apiLimiter, async (req, res) => {
  try {
    const { path: requestedPath, content } = req.body || {};
    const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);

    if (!resolved.ok) {
      return res.status(400).json({ ok: false, error: resolved.error });
    }

    await fs.mkdir(path.dirname(resolved.targetPath), { recursive: true });
    await fs.writeFile(resolved.targetPath, String(content ?? ''), 'utf8');

    return res.json({
      ok: true,
      message: `Wrote file to sandbox path: ${path.relative(resolved.sandboxRoot, resolved.targetPath)}`
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: `Failed to write file: ${error.message}` });
  }
});

app.post('/api/fs/read', apiLimiter, async (req, res) => {
  try {
    const { path: requestedPath } = req.body || {};
    const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath);

    if (!resolved.ok) {
      return res.status(400).json({ ok: false, error: resolved.error });
    }

    const stat = await fs.stat(resolved.targetPath);
    if (!stat.isFile()) {
      return res.status(400).json({ ok: false, error: 'Path is not a file.' });
    }

    if (stat.size > FS_READ_MAX_BYTES) {
      return res.status(400).json({ ok: false, error: `File too large to read (>${FS_READ_MAX_BYTES} bytes).` });
    }

    const content = await fs.readFile(resolved.targetPath, 'utf8');
    return res.json({ ok: true, path: path.relative(resolved.sandboxRoot, resolved.targetPath), content });
  } catch (error) {
    return res.status(500).json({ ok: false, error: `Failed to read file: ${error.message}` });
  }
});

app.post('/api/fs/list', apiLimiter, async (req, res) => {
  try {
    const requestedPath = typeof req.body?.path === 'string' && req.body.path.trim() ? req.body.path : '.';
    const resolved = resolveSandboxPath(WORKSPACE_ROOT, requestedPath, { allowRoot: true });

    if (!resolved.ok) {
      return res.status(400).json({ ok: false, error: resolved.error });
    }

    const stat = await fs.stat(resolved.targetPath);
    if (!stat.isDirectory()) {
      return res.status(400).json({ ok: false, error: 'Path is not a directory.' });
    }

    const entries = await fs.readdir(resolved.targetPath, { withFileTypes: true });
    const items = entries
      .map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.json({
      ok: true,
      path: path.relative(resolved.sandboxRoot, resolved.targetPath) || '.',
      entries: items
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: `Failed to list directory: ${error.message}` });
  }
});

app.use(apiLimiter, (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AIOS running on http://localhost:${PORT}`);
  console.log(`Workspace root: ${WORKSPACE_ROOT}`);
});
