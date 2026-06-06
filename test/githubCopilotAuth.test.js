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
    GITHUB_COPILOT_CLIENT_ID: process.env.GITHUB_COPILOT_CLIENT_ID,
    GITHUB_COPILOT_TOKEN_URL: process.env.GITHUB_COPILOT_TOKEN_URL
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

test('github copilot status is configured from GH_TOKEN and keeps device login available', async () => {
  await withCopilotModule({
    COPILOT_GITHUB_TOKEN: undefined,
    GH_TOKEN: 'gh-token',
    GITHUB_TOKEN: undefined,
    GITHUB_COPILOT_CLIENT_ID: undefined
  }, async ({ getStatus }) => {
    const status = await getStatus();
    assert.equal(status.configured, true);
    assert.equal(status.authSource, 'env');
    assert.equal(status.canDeviceLogin, true);
    assert.equal(status.deviceLoginClient, 'bundled');
  });
});

test('github copilot status exposes custom device client availability safely', async () => {
  await withCopilotModule({
    COPILOT_GITHUB_TOKEN: undefined,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    GITHUB_COPILOT_CLIENT_ID: 'custom-client-id'
  }, async ({ getStatus }) => {
    const status = await getStatus();
    assert.equal(status.configured, false);
    assert.equal(status.canDeviceLogin, true);
    assert.equal(status.deviceLoginClient, 'custom');
    assert.equal(status.hasCustomClientId, true);
    assert.equal(JSON.stringify(status).includes('custom-client-id'), false);
  });
});

test('github copilot device flow uses bundled client id when custom id is absent', async () => {
  await withCopilotModule({
    COPILOT_GITHUB_TOKEN: undefined,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    GITHUB_COPILOT_CLIENT_ID: undefined
  }, async ({ startDeviceFlow, resolveDeviceClientId }) => {
    let request;
    const flow = await startDeviceFlow({
      fetchImpl: async (url, options) => {
        request = { url, options };
        return jsonResponse(200, {
          device_code: 'device-code',
          user_code: 'ABCD-1234',
          verification_uri: 'https://github.com/login/device',
          expires_in: 900,
          interval: 5
        });
      }
    });

    assert.equal(resolveDeviceClientId(), 'Iv1.b507a08c87ecfe98');
    assert.equal(request.url, 'https://github.com/login/device/code');
    assert.equal(new URLSearchParams(request.options.body).get('client_id'), 'Iv1.b507a08c87ecfe98');
    assert.equal(new URLSearchParams(request.options.body).get('scope'), 'read:user');
    assert.equal(flow.verificationUri, 'https://github.com/login/device');
    assert.equal(flow.userCode, 'ABCD-1234');
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
        if (String(url) === 'https://api.github.com/copilot_internal/v2/token') {
          return jsonResponse(200, {
            token: 'tid=1;exp=9999999999;proxy-ep=proxy.individual.githubcopilot.com;',
            expires_in: 1800,
            chat_completions_url: 'https://api.individual.githubcopilot.com/chat/completions'
          });
        }

        throw new Error(`Unexpected URL: ${url}`);
      }
    });

    assert.equal(session.accessToken, 'tid=1;exp=9999999999;proxy-ep=proxy.individual.githubcopilot.com;');
    assert.equal(session.apiBaseUrl, 'https://api.individual.githubcopilot.com');
    assert.equal(session.chatCompletionsUrl, 'https://api.individual.githubcopilot.com/chat/completions');
  });
});

test('github copilot model discovery uses token-derived API base URL', async () => {
  await withCopilotModule({
    GH_TOKEN: 'gh-token',
    GITHUB_COPILOT_CLIENT_ID: undefined
  }, async ({ discoverModels }) => {
    const requestedUrls = [];
    const models = await discoverModels({
      baseUrl: 'https://api.githubcopilot.com',
      fetchImpl: async (url) => {
        requestedUrls.push(String(url));
        if (String(url) === 'https://api.github.com/copilot_internal/v2/token') {
          return jsonResponse(200, {
            token: 'tid=1;exp=9999999999;proxy-ep=proxy.individual.githubcopilot.com;',
            expires_in: 1800
          });
        }
        if (String(url) === 'https://api.individual.githubcopilot.com/models') {
          return jsonResponse(200, {
            data: [
              { id: 'gpt-4o', object: 'model', capabilities: { type: 'chat' } },
              { id: 'accounts/router', object: 'model', capabilities: { type: 'chat' } }
            ]
          });
        }

        throw new Error(`Unexpected URL: ${url}`);
      }
    });

    assert.deepEqual(models, ['github-copilot/gpt-4o']);
    assert.deepEqual(requestedUrls, [
      'https://api.github.com/copilot_internal/v2/token',
      'https://api.individual.githubcopilot.com/models'
    ]);
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
