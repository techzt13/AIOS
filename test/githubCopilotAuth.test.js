const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(payload)
  };
}

async function withCopilotModule(envOverrides, run) {
  const originalEnv = {
    AIOS_CONFIG_DIR: process.env.AIOS_CONFIG_DIR,
    COPILOT_GITHUB_TOKEN: process.env.COPILOT_GITHUB_TOKEN,
    GH_TOKEN: process.env.GH_TOKEN,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_COPILOT_CLIENT_ID: process.env.GITHUB_COPILOT_CLIENT_ID
  };

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aios-copilot-auth-'));
  process.env.AIOS_CONFIG_DIR = tempDir;

  Object.entries(envOverrides || {}).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });

  delete require.cache[require.resolve('../server/auth/githubCopilot')];
  const copilotAuth = require('../server/auth/githubCopilot');

  try {
    await run(copilotAuth);
  } finally {
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
    delete require.cache[require.resolve('../server/auth/githubCopilot')];
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

test('github copilot token env precedence matches OpenClaw order', async () => {
  await withCopilotModule({
    COPILOT_GITHUB_TOKEN: 'copilot-priority-token',
    GH_TOKEN: 'gh-token',
    GITHUB_TOKEN: 'github-token'
  }, async ({ resolveEnvGitHubToken }) => {
    assert.equal(resolveEnvGitHubToken(), 'copilot-priority-token');
  });
});

test('github copilot status is configured from GH_TOKEN without device login', async () => {
  await withCopilotModule({
    COPILOT_GITHUB_TOKEN: undefined,
    GH_TOKEN: 'gh-token',
    GITHUB_TOKEN: undefined,
    GITHUB_COPILOT_CLIENT_ID: undefined
  }, async ({ getStatus }) => {
    const status = await getStatus();
    assert.equal(status.configured, true);
    assert.equal(status.authSource, 'env');
    assert.equal(status.canDeviceLogin, false);
  });
});

test('github copilot chat session works with env token even when client id is missing', async () => {
  await withCopilotModule({
    GH_TOKEN: 'gh-token',
    GITHUB_COPILOT_CLIENT_ID: undefined
  }, async ({ getChatSession }) => {
    const session = await getChatSession({
      baseUrl: 'https://api.githubcopilot.com',
      fetchImpl: async (url) => {
        if (String(url).includes('/copilot_internal/v2/token')) {
          return jsonResponse(200, {
            token: 'copilot-chat-token',
            expires_in: 1800,
            chat_completions_url: 'https://api.githubcopilot.com/chat/completions'
          });
        }

        throw new Error(`Unexpected URL: ${url}`);
      }
    });

    assert.equal(session.accessToken, 'copilot-chat-token');
    assert.equal(session.chatCompletionsUrl, 'https://api.githubcopilot.com/chat/completions');
  });
});

test('github copilot model fallback catalog includes required defaults', async () => {
  await withCopilotModule({
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    COPILOT_GITHUB_TOKEN: undefined
  }, async ({ getCopilotModels }) => {
    const result = await getCopilotModels({
      baseUrl: 'https://api.githubcopilot.com',
      fetchImpl: async () => {
        throw new Error('network unavailable');
      }
    });

    assert.equal(result.source, 'fallback');
    assert.equal(result.models.includes('github-copilot/claude-opus-4.7'), true);
    assert.equal(result.models.includes('github-copilot/gpt-5.5'), true);
  });
});
