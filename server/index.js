require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { getProviders, getProviderById } = require('./providers');
const { resolveSandboxPath } = require('./sandbox');

const app = express();
const PORT = Number(process.env.PORT || 8080);
const SANDBOX_DIR = process.env.SANDBOX_DIR || path.join(process.cwd(), 'workspace');
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120);

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

app.post('/api/fs/write', apiLimiter, async (req, res) => {
  try {
    const { path: requestedPath, content } = req.body || {};
    const resolved = resolveSandboxPath(SANDBOX_DIR, requestedPath);

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

app.use(apiLimiter, (_req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AIOS running on http://localhost:${PORT}`);
});
