const providerSelect = document.getElementById('providerSelect');
const modelSelect = document.getElementById('modelSelect');
const customFields = document.getElementById('customFields');
const customBaseUrlInput = document.getElementById('customBaseUrl');
const customApiKeyInput = document.getElementById('customApiKey');
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
      model: modelSelect.value,
    })
  );
}

function selectedProvider() {
  return providers.find((provider) => provider.id === providerSelect.value);
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

  const isCustom = provider?.id === 'custom-openai';
  customFields.classList.toggle('hidden', !isCustom);
  if (isCustom) {
    customBaseUrlInput.value = provider.defaultBaseUrl || '';
  }
  saveSettings();
}

async function loadProviders() {
  const response = await fetch('/api/providers');
  const payload = await response.json();
  providers = payload.providers || [];

  providerSelect.innerHTML = '';
  providers.forEach((provider) => {
    const option = document.createElement('option');
    option.value = provider.id;
    option.textContent = provider.name;
    providerSelect.appendChild(option);
  });

  const saved = getSavedSettings();
  if (saved.providerId && providers.some((provider) => provider.id === saved.providerId)) {
    providerSelect.value = saved.providerId;
  }
  updateModelOptions();

  if (saved.model) {
    modelSelect.value = saved.model;
  }
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
        messages: chatHistory,
        apiKey: customApiKeyInput.value
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
    const rows = result.entries.map((entry) => `${entry.type === 'directory' ? '��' : '📄'} ${entry.name}`);
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
