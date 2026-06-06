const test = require('node:test');
const assert = require('node:assert/strict');

const { dispatchChat, getAdapter } = require('../server/adapters');
const anthropicAdapter = require('../server/adapters/anthropic');
const copilotAdapter = require('../server/adapters/github-copilot');
const openaiAdapter = require('../server/adapters/openai');

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(payload)
  };
}

test('openai adapter shapes chat/completions requests', async () => {
  let request;
  const provider = { id: 'openrouter', defaultBaseUrl: 'https://openrouter.ai/api/v1' };
  const result = await openaiAdapter.sendChat({
    provider,
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'hello' }],
    auth: { baseUrl: provider.defaultBaseUrl, apiKey: 'test-key' },
    fetchImpl: async (url, options) => {
      request = { url, options };
      return jsonResponse(200, { choices: [{ message: { content: 'hi there' } }] });
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.message, 'hi there');
  assert.equal(request.url, 'https://openrouter.ai/api/v1/chat/completions');
  assert.equal(request.options.headers.Authorization.startsWith('Bearer '), true);
  assert.equal(request.options.headers.Authorization.endsWith('test-key'), true);
  assert.equal(request.options.headers['HTTP-Referer'], 'http://localhost:8080');
  assert.deepEqual(JSON.parse(request.options.body), {
    model: 'openai/gpt-4o',
    messages: [{ role: 'user', content: 'hello' }],
    stream: false
  });
});

test('anthropic adapter separates system prompts and content blocks', async () => {
  let request;
  const provider = {
    id: 'anthropic',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    anthropicVersion: '2023-06-01'
  };
  const result = await anthropicAdapter.sendChat({
    provider,
    model: 'claude-sonnet-4-6',
    messages: [
      { role: 'system', content: 'You are concise.' },
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi' }
    ],
    auth: { baseUrl: provider.defaultBaseUrl, apiKey: 'anthropic-key' },
    fetchImpl: async (url, options) => {
      request = { url, options };
      return jsonResponse(200, { content: [{ type: 'text', text: 'Final answer' }] });
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.message, 'Final answer');
  assert.equal(request.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(request.options.headers['x-api-key'], 'anthropic-key');
  assert.equal(request.options.headers['anthropic-version'], '2023-06-01');
  assert.deepEqual(JSON.parse(request.options.body), {
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: 'You are concise.',
    messages: [
      { role: 'user', content: [{ type: 'text', text: 'Hello' }] },
      { role: 'assistant', content: [{ type: 'text', text: 'Hi' }] }
    ]
  });
});

test('github copilot adapter uses bearer chat token and chat endpoint', async () => {
  let request;
  const result = await copilotAdapter.sendChat({
    provider: { id: 'github-copilot', defaultBaseUrl: 'https://api.githubcopilot.com' },
    model: 'github-copilot/gpt-4o',
    messages: [{ role: 'user', content: 'ping' }],
    auth: {
      accessToken: 'copilot-chat-token',
      chatCompletionsUrl: 'https://custom.copilot.test/chat/completions'
    },
    fetchImpl: async (url, options) => {
      request = { url, options };
      return jsonResponse(200, { choices: [{ message: { content: 'pong' } }] });
    }
  });

  assert.equal(result.ok, true);
  assert.equal(result.message, 'pong');
  assert.equal(request.url, 'https://custom.copilot.test/chat/completions');
  assert.equal(request.options.headers.Authorization.startsWith('Bearer '), true);
  assert.equal(request.options.headers.Authorization.endsWith('copilot-chat-token'), true);
  assert.deepEqual(JSON.parse(request.options.body), {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'ping' }],
    stream: false
  });
});

test('github copilot adapter reports model 404 as unavailable', async () => {
  const result = await copilotAdapter.sendChat({
    provider: { id: 'github-copilot', defaultBaseUrl: 'https://api.githubcopilot.com' },
    model: 'github-copilot/claude-opus-4.7',
    messages: [{ role: 'user', content: 'ping' }],
    auth: {
      accessToken: 'copilot-chat-token',
      chatCompletionsUrl: 'https://custom.copilot.test/chat/completions'
    },
    fetchImpl: async () => jsonResponse(404, { error: { message: '404 page not found' } })
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 404);
  assert.match(result.error, /unavailable/);
});

test('adapter registry dispatches through the configured adapter type', async () => {
  assert.equal(typeof getAdapter('anthropic').sendChat, 'function');

  const result = await dispatchChat({
    provider: {
      id: 'openai',
      name: 'OpenAI GPT',
      adapterType: 'openai',
      defaultBaseUrl: 'https://api.openai.com/v1'
    },
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'hello' }],
    auth: { baseUrl: 'https://api.openai.com/v1', apiKey: 'dispatch-key' },
    fetchImpl: async () => jsonResponse(200, { choices: [{ message: { content: 'from dispatch' } }] })
  });

  assert.equal(result.ok, true);
  assert.equal(result.message, 'from dispatch');
});
