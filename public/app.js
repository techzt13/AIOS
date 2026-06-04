const providerSelect = document.getElementById('providerSelect');
const modelSelect = document.getElementById('modelSelect');
const customFields = document.getElementById('customFields');
const customBaseUrlInput = document.getElementById('customBaseUrl');
const customApiKeyInput = document.getElementById('customApiKey');
const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
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

providerSelect.addEventListener('change', updateModelOptions);
modelSelect.addEventListener('change', saveSettings);

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  const provider = selectedProvider();
  if (!provider) return;

  renderMessage('user', text);
  chatHistory.push({ role: 'user', content: text });
  messageInput.value = '';

  try {
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
    renderMessage('system', `Network error: ${error.message}`);
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

renderMessage('system', 'Welcome to AIOS. Choose a provider and model to begin.');
loadProviders().catch((error) => renderMessage('system', `Failed to load providers: ${error.message}`));
