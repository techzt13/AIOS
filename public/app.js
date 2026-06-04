const providerSetupGroups = document.getElementById('providerSetupGroups');
const providerSelect = document.getElementById('providerSelect');
const modelSelect = document.getElementById('modelSelect');
const providerSettingsFields = document.getElementById('providerSettingsFields');
const providerBaseUrlRow = document.getElementById('providerBaseUrlRow');
const providerBaseUrlInput = document.getElementById('providerBaseUrl');
const providerApiKeyRow = document.getElementById('providerApiKeyRow');
const providerApiKeyInput = document.getElementById('providerApiKey');
const providerApiSecretRow = document.getElementById('providerApiSecretRow');
const providerApiSecretInput = document.getElementById('providerApiSecret');
const saveProviderSettingsButton = document.getElementById('saveProviderSettingsButton');
const clearProviderSettingsButton = document.getElementById('clearProviderSettingsButton');
const authSummary = document.getElementById('authSummary');
const authDetail = document.getElementById('authDetail');
const copilotAuth = document.getElementById('copilotAuth');
const copilotStartButton = document.getElementById('copilotStartButton');
const copilotPollButton = document.getElementById('copilotPollButton');
const copilotCode = document.getElementById('copilotCode');
const copilotLink = document.getElementById('copilotLink');
const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const systemCommandInput = document.getElementById('systemCommand');
const runSystemCommandBtn = document.getElementById('runSystemCommand');
const listWorkspaceBtn = document.getElementById('listWorkspace');
const writeTestFileBtn = document.getElementById('writeTestFile');

const STORAGE_KEY = 'aios.settings';

let providers = [];
let chatHistory = [];
let copilotStatus = { configured: false, login: null, connectedAt: null };
let copilotDeviceFlow = null;
let copilotPollTimer = null;

function renderMessage(role, content) {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  el.textContent = content;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function getSavedSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveSettings() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      providerId: providerSelect.value,
      model: modelSelect.value
    })
  );
}

function selectedProvider() {
  return providers.find((provider) => provider.id === providerSelect.value);
}

function statusLabel(provider) {
  if (provider.authMethod === 'none') {
    return 'No key needed';
  }

  if (provider.authMethod === 'oauth-device') {
    return provider.configured ? 'Connected' : 'Sign-in required';
  }

  if (provider.requiresApiKey === false) {
    return provider.configured ? 'Configured' : 'Optional key';
  }

  return provider.configured ? 'Configured' : 'Needs setup';
}

function renderProviderSetupList() {
  providerSetupGroups.innerHTML = '';
  const groups = new Map();

  providers.forEach((provider) => {
    if (!groups.has(provider.category)) {
      const section = document.createElement('section');
      section.className = 'provider-setup-group';
      const title = document.createElement('h3');
      title.textContent = provider.category;
      const items = document.createElement('div');
      items.className = 'provider-setup-items';
      section.appendChild(title);
      section.appendChild(items);
      groups.set(provider.category, items);
      providerSetupGroups.appendChild(section);
    }

    const row = document.createElement('div');
    row.className = 'provider-setup-item';

    const left = document.createElement('div');
    left.textContent = provider.name;

    const right = document.createElement('div');
    const status = document.createElement('span');
    status.className = 'provider-status';
    status.textContent = statusLabel(provider);

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Edit';
    button.className = 'secondary';
    button.addEventListener('click', () => {
      providerSelect.value = provider.id;
      updateModelOptions();
      providerSelect.focus();
    });

    right.appendChild(status);
    right.appendChild(document.createTextNode(' '));
    right.appendChild(button);

    row.appendChild(left);
    row.appendChild(right);
    groups.get(provider.category).appendChild(row);
  });
}

function updateModelOptions() {
  const provider = selectedProvider();
  const models = provider?.models || [];
  const current = modelSelect.value;
  modelSelect.innerHTML = '';

  models.forEach((model) => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });

  if (models.includes(current)) {
    modelSelect.value = current;
  }

  providerBaseUrlInput.value = provider?.effectiveBaseUrl || '';
  providerApiKeyInput.value = '';
  providerApiSecretInput.value = '';
  providerApiKeyInput.placeholder = provider?.hasStoredApiKey ? 'Stored key is configured' : 'sk-...';
  providerApiSecretInput.placeholder = provider?.hasStoredApiSecret ? 'Stored secret is configured' : 'secret';

  renderAuthState(provider);
  saveSettings();
}

async function loadProviders() {
  const response = await fetch('/api/settings/providers');
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to load providers (HTTP ${response.status}).`);
  }

  providers = payload.providers || [];
  copilotStatus = payload.copilot || { configured: false, login: null, connectedAt: null };

  providerSelect.innerHTML = '';
  const groups = new Map();
  providers.forEach((provider) => {
    if (!groups.has(provider.category)) {
      const group = document.createElement('optgroup');
      group.label = provider.category;
      groups.set(provider.category, group);
      providerSelect.appendChild(group);
    }

    const option = document.createElement('option');
    option.value = provider.id;
    option.textContent = provider.name;
    groups.get(provider.category).appendChild(option);
  });

  const saved = getSavedSettings();
  if (saved.providerId && providers.some((provider) => provider.id === saved.providerId)) {
    providerSelect.value = saved.providerId;
  }

  updateModelOptions();

  if (saved.model) {
    modelSelect.value = saved.model;
  }

  renderProviderSetupList();
  renderAuthState(selectedProvider());
}

function stopCopilotPolling() {
  if (copilotPollTimer) {
    clearTimeout(copilotPollTimer);
    copilotPollTimer = null;
  }
}

function scheduleCopilotPoll(intervalSeconds) {
  stopCopilotPolling();
  copilotPollTimer = setTimeout(() => {
    pollCopilotLogin().catch((error) => renderMessage('system', `GitHub Copilot sign-in error: ${error.message}`));
  }, Math.max(1, Number(intervalSeconds) || 5) * 1000);
}

function renderAuthState(provider = selectedProvider()) {
  const isCopilot = provider?.authMethod === 'oauth-device';
  const isStatic = provider?.authMethod === 'static-key';

  copilotAuth.classList.toggle('hidden', !isCopilot);
  providerSettingsFields.classList.toggle('hidden', !provider || isCopilot);
  providerBaseUrlRow.classList.toggle('hidden', !provider || !provider.baseUrlEnv);
  providerApiKeyRow.classList.toggle('hidden', !provider || !isStatic);
  providerApiSecretRow.classList.toggle('hidden', !provider || !isStatic || !provider.apiSecretEnv);

  saveProviderSettingsButton.disabled = !provider || isCopilot;
  clearProviderSettingsButton.disabled = !provider || isCopilot;

  copilotPollButton.disabled = !copilotDeviceFlow;
  copilotCode.classList.toggle('hidden', !copilotDeviceFlow?.userCode);
  copilotLink.classList.toggle('hidden', !copilotDeviceFlow?.verificationUri);

  if (copilotDeviceFlow?.userCode) {
    copilotCode.textContent = `Code: ${copilotDeviceFlow.userCode}`;
  } else {
    copilotCode.textContent = '';
  }

  if (copilotDeviceFlow?.verificationUri) {
    copilotLink.href = copilotDeviceFlow.verificationUriComplete || copilotDeviceFlow.verificationUri;
  } else {
    copilotLink.removeAttribute('href');
  }

  if (!provider) {
    authSummary.textContent = '';
    authDetail.textContent = '';
    return;
  }

  if (provider.authMethod === 'none') {
    authSummary.textContent = 'No key needed';
    authDetail.textContent = `${provider.name} can run without API credentials. You can optionally save a custom base URL.`;
    return;
  }

  if (isCopilot) {
    authSummary.textContent = copilotStatus.configured
      ? `Connected${copilotStatus.login ? ` as @${copilotStatus.login}` : ''}`
      : 'GitHub sign-in required';
    authDetail.textContent = copilotStatus.configured
      ? 'AIOS stores your OAuth token outside the repository, refreshes Copilot chat tokens automatically, and never sends raw tokens to the browser.'
      : 'Sign in with your GitHub OAuth app to use your Copilot subscription.';
    copilotStartButton.textContent = copilotStatus.configured ? 'Reconnect GitHub' : 'Sign in with GitHub';
    return;
  }

  if (provider.requiresApiKey === false) {
    authSummary.textContent = provider.configured ? 'Configured' : 'Optional API key';
    authDetail.textContent = 'Save settings in AIOS. If no key is provided, AIOS can still call this endpoint without authorization headers.';
    return;
  }

  authSummary.textContent = provider.configured ? 'API key configured' : 'API key required';
  authDetail.textContent = provider.apiSecretEnv
    ? `Configure ${provider.apiKeyEnv} and ${provider.apiSecretEnv} in AIOS settings (or use .env fallback).`
    : `Configure ${provider.apiKeyEnv} in AIOS settings (or use .env fallback).`;
}

async function saveProviderSettings() {
  const provider = selectedProvider();
  if (!provider || provider.authMethod === 'oauth-device') {
    return;
  }

  const body = {
    baseUrl: providerBaseUrlInput.value.trim()
  };

  if (provider.authMethod === 'static-key') {
    const apiKey = providerApiKeyInput.value.trim();
    const apiSecret = providerApiSecretInput.value.trim();

    if (apiKey) {
      body.apiKey = apiKey;
    }

    if (provider.apiSecretEnv && apiSecret) {
      body.apiSecret = apiSecret;
    }
  }

  const response = await fetch(`/api/settings/providers/${encodeURIComponent(provider.id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to save provider settings (HTTP ${response.status}).`);
  }

  providerApiKeyInput.value = '';
  providerApiSecretInput.value = '';
  await loadProviders();
  renderMessage('system', `${provider.name} settings saved.`);
}

async function clearProviderSettings() {
  const provider = selectedProvider();
  if (!provider || provider.authMethod === 'oauth-device') {
    return;
  }

  const response = await fetch(`/api/settings/providers/${encodeURIComponent(provider.id)}`, {
    method: 'DELETE'
  });
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to clear provider settings (HTTP ${response.status}).`);
  }

  providerApiKeyInput.value = '';
  providerApiSecretInput.value = '';
  await loadProviders();
  renderMessage('system', `${provider.name} stored settings cleared.`);
}

async function startCopilotLogin() {
  const response = await fetch('/api/auth/github-copilot/start', { method: 'POST' });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Sign-in failed (HTTP ${response.status}).`);
  }

  copilotDeviceFlow = payload;
  renderAuthState();
  renderMessage('system', `GitHub Copilot sign-in: open ${payload.verificationUriComplete || payload.verificationUri} and enter code ${payload.userCode}.`);
  scheduleCopilotPoll(payload.interval);
}

async function pollCopilotLogin() {
  if (!copilotDeviceFlow?.deviceCode) {
    return;
  }

  const response = await fetch('/api/auth/github-copilot/poll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceCode: copilotDeviceFlow.deviceCode })
  });
  const payload = await response.json();

  if (response.status === 202 || payload.pending) {
    renderAuthState();
    scheduleCopilotPoll(payload.interval || copilotDeviceFlow.interval);
    return;
  }

  if (!response.ok || !payload.ok) {
    stopCopilotPolling();
    throw new Error(payload.error || `Sign-in check failed (HTTP ${response.status}).`);
  }

  stopCopilotPolling();
  copilotStatus = {
    configured: true,
    login: payload.login || null,
    connectedAt: new Date().toISOString()
  };
  copilotDeviceFlow = null;
  await loadProviders();
  renderMessage('system', `GitHub Copilot connected${payload.login ? ` as @${payload.login}` : ''}.`);
}

async function callExec(command) {
  const response = await fetch('/api/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    const err = payload.error || payload.stderr || `Command failed (HTTP ${response.status}).`;
    throw new Error(err);
  }

  return payload;
}

async function listWorkspace(path = '.') {
  const response = await fetch('/api/fs/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `List failed (HTTP ${response.status}).`);
  }

  return payload;
}

async function readWorkspaceFile(path) {
  const response = await fetch('/api/fs/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Read failed (HTTP ${response.status}).`);
  }

  return payload;
}

function formatExecResult(result) {
  const parts = [`Exit code: ${result.code}`];
  if (result.stdout) {
    parts.push(`stdout:\n${result.stdout}`);
  }
  if (result.stderr) {
    parts.push(`stderr:\n${result.stderr}`);
  }
  if (result.timedOut) {
    parts.push('Command timed out.');
  }

  return parts.join('\n\n');
}

async function handleSlashCommand(text) {
  const trimmed = text.trim();

  if (trimmed.startsWith('/exec ')) {
    const command = trimmed.slice('/exec '.length).trim();
    const result = await callExec(command);
    renderMessage('system', formatExecResult(result));
    return true;
  }

  if (trimmed === '/list' || trimmed.startsWith('/list ')) {
    const target = trimmed === '/list' ? '.' : trimmed.slice('/list '.length).trim();
    const result = await listWorkspace(target || '.');
    const rows = result.entries.map((entry) => `${entry.type === 'directory' ? '📁' : '📄'} ${entry.name}`);
    renderMessage('system', `Workspace listing (${result.path}):\n${rows.join('\n') || '(empty)'}`);
    return true;
  }

  if (trimmed.startsWith('/read ')) {
    const filePath = trimmed.slice('/read '.length).trim();
    const result = await readWorkspaceFile(filePath);
    renderMessage('system', `Read ${result.path}:\n${result.content || '(empty file)'}`);
    return true;
  }

  return false;
}

providerSelect.addEventListener('change', updateModelOptions);
modelSelect.addEventListener('change', saveSettings);
copilotStartButton.addEventListener('click', () => {
  startCopilotLogin().catch((error) => renderMessage('system', `GitHub Copilot sign-in error: ${error.message}`));
});
copilotPollButton.addEventListener('click', () => {
  pollCopilotLogin().catch((error) => renderMessage('system', `GitHub Copilot sign-in error: ${error.message}`));
});
saveProviderSettingsButton.addEventListener('click', () => {
  saveProviderSettings().catch((error) => renderMessage('system', `Provider settings error: ${error.message}`));
});
clearProviderSettingsButton.addEventListener('click', () => {
  clearProviderSettings().catch((error) => renderMessage('system', `Provider settings error: ${error.message}`));
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  const provider = selectedProvider();
  if (!provider) return;

  renderMessage('user', text);
  messageInput.value = '';

  try {
    if (await handleSlashCommand(text)) {
      return;
    }

    chatHistory.push({ role: 'user', content: text });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: provider.id,
        model: modelSelect.value,
        messages: chatHistory
      })
    });

    const payload = await response.json();
    if (!payload.ok) {
      renderMessage('system', payload.error || 'Request failed.');
      return;
    }

    const assistantText = payload.message || '[No response text returned]';
    chatHistory.push({ role: 'assistant', content: assistantText });
    renderMessage('assistant', assistantText);
  } catch (error) {
    renderMessage('system', `System error: ${error.message}`);
  }
});

runSystemCommandBtn.addEventListener('click', async () => {
  const command = systemCommandInput.value.trim();
  if (!command) return;

  renderMessage('user', `/exec ${command}`);
  try {
    const result = await callExec(command);
    renderMessage('system', formatExecResult(result));
  } catch (error) {
    renderMessage('system', `Exec error: ${error.message}`);
  }
});

listWorkspaceBtn.addEventListener('click', async () => {
  try {
    const result = await listWorkspace('.');
    const rows = result.entries.map((entry) => `${entry.type === 'directory' ? '📁' : '📄'} ${entry.name}`);
    renderMessage('system', `Workspace listing (${result.path}):\n${rows.join('\n') || '(empty)'}`);
  } catch (error) {
    renderMessage('system', `List error: ${error.message}`);
  }
});

writeTestFileBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/fs/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'test-output/aios-sandbox-test.txt',
        content: `[AIOS] FS Sandbox write test at ${new Date().toISOString()}`
      })
    });

    const payload = await response.json();
    if (payload.ok) {
      renderMessage('system', payload.message);
    } else {
      renderMessage('system', payload.error || 'Sandbox write failed.');
    }
  } catch (error) {
    renderMessage('system', `Sandbox write error: ${error.message}`);
  }
});

renderMessage('system', 'Welcome to AIOS. Use chat, /exec, /list, or /read to control the Linux workspace.');
loadProviders().catch((error) => renderMessage('system', `Failed to load providers: ${error.message}`));
