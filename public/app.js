const root = document.documentElement;

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
const runSetupAgainButton = document.getElementById('runSetupAgainButton');

const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

const filesPathInput = document.getElementById('filesPathInput');
const filesUpButton = document.getElementById('filesUpButton');
const filesRefreshButton = document.getElementById('filesRefreshButton');
const filesEntries = document.getElementById('filesEntries');
const fileEditorPath = document.getElementById('fileEditorPath');
const fileEditorContent = document.getElementById('fileEditorContent');
const fileSaveButton = document.getElementById('fileSaveButton');
const fileReadStatus = document.getElementById('fileReadStatus');

const terminalCommandInput = document.getElementById('terminalCommandInput');
const terminalRunButton = document.getElementById('terminalRunButton');
const terminalOutput = document.getElementById('terminalOutput');

const accentSelect = document.getElementById('accentSelect');
const wallpaperSelect = document.getElementById('wallpaperSelect');
const dataDirValue = document.getElementById('dataDirValue');
const importTypeSelect = document.getElementById('importTypeSelect');
const importFileInput = document.getElementById('importFileInput');
const importButton = document.getElementById('importButton');
const importStatus = document.getElementById('importStatus');
const importList = document.getElementById('importList');
const apiAuditList = document.getElementById('apiAuditList');

const setupWizard = document.getElementById('setupWizard');
const wizardStepLabel = document.getElementById('wizardStepLabel');
const wizardBackButton = document.getElementById('wizardBackButton');
const wizardNextButton = document.getElementById('wizardNextButton');
const wizardFinishButton = document.getElementById('wizardFinishButton');
const wizardProviderSelect = document.getElementById('wizardProviderSelect');
const wizardModelSelect = document.getElementById('wizardModelSelect');
const wizardProviderGroups = document.getElementById('wizardProviderGroups');
const wizardConnectSummary = document.getElementById('wizardConnectSummary');
const wizardStaticAuthFields = document.getElementById('wizardStaticAuthFields');
const wizardBaseUrl = document.getElementById('wizardBaseUrl');
const wizardApiKeyRow = document.getElementById('wizardApiKeyRow');
const wizardApiKey = document.getElementById('wizardApiKey');
const wizardApiSecretRow = document.getElementById('wizardApiSecretRow');
const wizardApiSecret = document.getElementById('wizardApiSecret');
const wizardSaveConnectionButton = document.getElementById('wizardSaveConnectionButton');
const wizardCopilotAuth = document.getElementById('wizardCopilotAuth');
const wizardCopilotStartButton = document.getElementById('wizardCopilotStartButton');
const wizardCopilotPollButton = document.getElementById('wizardCopilotPollButton');
const wizardCopilotCode = document.getElementById('wizardCopilotCode');
const wizardCopilotLink = document.getElementById('wizardCopilotLink');
const wizardConnectStatus = document.getElementById('wizardConnectStatus');
const wizardTestButton = document.getElementById('wizardTestButton');
const wizardTestStatus = document.getElementById('wizardTestStatus');
const wizardFinishStatus = document.getElementById('wizardFinishStatus');
const openSetupAssistant = document.getElementById('openSetupAssistant');

const activeWindowTitle = document.getElementById('activeWindowTitle');
const providerStatusBadge = document.getElementById('providerStatusBadge');
const clockLabel = document.getElementById('clockLabel');

const WIZARD_STEPS = ['welcome', 'provider', 'connect', 'test', 'finish'];
const WINDOW_IDS = {
  chat: 'windowChat',
  files: 'windowFiles',
  terminal: 'windowTerminal',
  settings: 'windowSettings'
};

let providers = [];
let wizardProviders = [];
let chatHistory = [];
let copilotStatus = {
  configured: false,
  login: null,
  connectedAt: null,
  authSource: 'not-configured',
  canDeviceLogin: false,
  guidance: 'Set COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN, or configure GITHUB_COPILOT_CLIENT_ID to use device login.'
};
let copilotDeviceFlow = null;
let copilotPollTimer = null;
let currentWizardStep = 0;
let wizardTestSucceeded = false;
let shellState = { windows: {}, preferences: {} };
let zCounter = 10;

function renderMessage(role, content) {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  el.textContent = content;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setFeedback(node, message = '', type = '') {
  node.textContent = message;
  node.classList.remove('success', 'error');
  if (type) node.classList.add(type);
}

function selectedProvider() {
  return providers.find((provider) => provider.id === providerSelect.value);
}

function selectedWizardProvider() {
  return wizardProviders.find((provider) => provider.id === wizardProviderSelect.value)
    || providers.find((provider) => provider.id === wizardProviderSelect.value)
    || selectedProvider();
}

function selectValidModel(selectEl, models, preferredModel = '') {
  const preferred = String(preferredModel || '').trim();
  const current = String(selectEl.value || '').trim();
  const nextModel = models.includes(preferred)
    ? preferred
    : (models.includes(current) ? current : (models[0] || ''));

  selectEl.innerHTML = '';
  models.forEach((model) => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    selectEl.appendChild(option);
  });

  if (nextModel) {
    selectEl.value = nextModel;
  }
}

function preferredModelForProvider(provider, currentModel = '') {
  if (!provider) return '';
  if (currentModel && provider.models?.includes(currentModel)) return currentModel;
  if (provider.defaultModel && provider.models?.includes(provider.defaultModel)) return provider.defaultModel;
  if (provider.id === 'github-copilot' && provider.models?.includes('github-copilot/gpt-4o')) {
    return 'github-copilot/gpt-4o';
  }
  return provider.models?.[0] || '';
}

function statusLabel(provider) {
  if (provider.authMethod === 'none') return 'No key needed';
  if (provider.authMethod === 'oauth-device') return provider.configured ? 'Connected' : 'Sign-in required';
  if (provider.requiresApiKey === false) return provider.configured ? 'Configured' : 'Optional key';
  return provider.configured ? 'Configured' : 'Needs setup';
}

function providerGlyph(provider) {
  const id = provider?.id || '';
  if (id === 'github-copilot') return 'GH';
  if (id === 'anthropic') return 'A';
  if (id === 'openai') return 'O';
  if (id === 'gemini') return 'G';
  if (id === 'ollama' || id === 'lmstudio') return '⌘';
  return (provider?.name || '?').trim().slice(0, 1).toUpperCase();
}

function formatPathUp(pathValue) {
  if (!pathValue || pathValue === '.') return '.';
  const parts = pathValue.split('/').filter(Boolean);
  if (parts.length <= 1) return '.';
  return parts.slice(0, -1).join('/');
}

function setDockState(app) {
  document.querySelectorAll('.dock-item[data-open-app]').forEach((button) => {
    button.classList.toggle('active', button.dataset.openApp === app);
  });
}

function recordWindowState(app, update = {}) {
  shellState.windows[app] = {
    ...(shellState.windows[app] || {}),
    ...update
  };
  persistShellState();
}

let persistTimer = null;
function persistShellState() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(async () => {
    try {
      await fetch('/api/local-data/shell-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: shellState })
      });
    } catch {
      // Best effort local persistence.
    }
  }, 250);
}

function focusWindow(app) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;
  zCounter += 1;
  windowEl.style.zIndex = String(zCounter);
  document.querySelectorAll('.app-window').forEach((node) => node.classList.remove('focused'));
  windowEl.classList.add('focused');
  activeWindowTitle.textContent = windowEl.dataset.title || 'Desktop';
  setDockState(app);
}

function openWindow(app) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;
  windowEl.classList.remove('hidden');
  focusWindow(app);
  recordWindowState(app, { open: true, minimized: false });
}

function closeWindow(app) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;
  windowEl.classList.add('hidden');
  recordWindowState(app, { open: false, minimized: true });
  activeWindowTitle.textContent = 'Desktop';
}

function applyPreferences() {
  const accent = shellState.preferences.accent || 'blue';
  const wallpaper = shellState.preferences.wallpaper || 'aurora';
  root.dataset.accent = accent;
  root.dataset.wallpaper = wallpaper;
  accentSelect.value = accent;
  wallpaperSelect.value = wallpaper;
}

function initWindowDrag(windowEl) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  if (!titlebar) return;

  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let dragging = false;

  titlebar.addEventListener('mousedown', (event) => {
    if (event.target.closest('[data-window-action]')) return;
    dragging = true;
    focusWindow(windowEl.dataset.app);
    startX = event.clientX;
    startY = event.clientY;
    const rect = windowEl.getBoundingClientRect();
    originX = rect.left;
    originY = rect.top;
    event.preventDefault();
  });

  window.addEventListener('mousemove', (event) => {
    if (!dragging) return;
    const nextX = Math.max(6, originX + (event.clientX - startX));
    const nextY = Math.max(52, originY + (event.clientY - startY));
    windowEl.style.left = `${nextX}px`;
    windowEl.style.top = `${nextY}px`;
    recordWindowState(windowEl.dataset.app, { left: nextX, top: nextY });
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });
}

async function loadShellState() {
  try {
    const response = await fetch('/api/local-data/shell-state');
    const payload = await response.json();
    if (response.ok && payload.ok) {
      shellState = {
        windows: payload.state.windows || {},
        preferences: payload.state.preferences || {}
      };
    }
  } catch {
    shellState = { windows: {}, preferences: {} };
  }

  applyPreferences();

  Object.entries(WINDOW_IDS).forEach(([app, id]) => {
    const windowEl = document.getElementById(id);
    const state = shellState.windows?.[app] || {};
    if (typeof state.left === 'number') windowEl.style.left = `${state.left}px`;
    if (typeof state.top === 'number') windowEl.style.top = `${state.top}px`;
    if (state.open === false || state.minimized) {
      windowEl.classList.add('hidden');
    }
  });

  if (![...document.querySelectorAll('.app-window')].some((node) => !node.classList.contains('hidden'))) {
    openWindow('chat');
  } else {
    focusWindow('chat');
  }
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
    left.className = 'provider-setup-name';
    left.textContent = provider.name;

    const right = document.createElement('div');
    right.className = 'provider-setup-actions';
    const status = document.createElement('span');
    status.className = 'provider-status';
    status.textContent = statusLabel(provider);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = 'Edit';
    button.addEventListener('click', () => {
      openWindow('settings');
      providerSelect.value = provider.id;
      updateModelOptions();
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
  selectValidModel(modelSelect, models);

  providerBaseUrlInput.value = provider?.effectiveBaseUrl || '';
  providerApiKeyInput.value = '';
  providerApiSecretInput.value = '';
  providerApiKeyInput.placeholder = provider?.hasStoredApiKey ? 'Stored key is configured' : 'sk-...';
  providerApiSecretInput.placeholder = provider?.hasStoredApiSecret ? 'Stored secret is configured' : 'secret';

  renderAuthState(provider);
  providerStatusBadge.textContent = `Provider: ${provider?.name || 'not selected'}`;
}

function updateWizardModelOptions() {
  const provider = selectedWizardProvider();
  selectValidModel(wizardModelSelect, provider?.models || [], preferredModelForProvider(provider, wizardModelSelect.value));
}

function renderWizardProviderGroups() {
  wizardProviderGroups.innerHTML = '';

  wizardProviders.forEach((provider) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'provider-card';
    card.dataset.providerId = provider.id;
    card.setAttribute('aria-pressed', String(provider.id === wizardProviderSelect.value));

    const glyph = document.createElement('span');
    glyph.className = 'provider-card-glyph';
    glyph.textContent = providerGlyph(provider);

    const eyebrow = document.createElement('span');
    eyebrow.className = 'provider-card-eyebrow';
    eyebrow.textContent = provider.id === 'github-copilot' ? 'Recommended' : provider.category;

    const name = document.createElement('strong');
    name.textContent = provider.name;

    const meta = document.createElement('span');
    meta.className = 'provider-card-meta';
    meta.textContent = provider.id === 'github-copilot'
      ? 'Browser device login with github.com/login/device'
      : statusLabel(provider);

    const badge = document.createElement('span');
    badge.className = 'provider-status';
    badge.textContent = statusLabel(provider);

    card.appendChild(glyph);
    card.appendChild(eyebrow);
    card.appendChild(name);
    card.appendChild(meta);
    card.appendChild(badge);
    card.addEventListener('click', () => {
      wizardProviderSelect.value = provider.id;
      updateWizardModelOptions();
      renderWizardProviderGroups();
      renderWizardConnectState();
      wizardTestSucceeded = false;
      setFeedback(wizardTestStatus);
    });
    wizardProviderGroups.appendChild(card);
  });
}

function renderWizardConnectState() {
  const provider = selectedWizardProvider();
  if (!provider) {
    setFeedback(wizardConnectStatus, 'Pick a provider first.', 'error');
    return;
  }

  wizardBaseUrl.value = provider.effectiveBaseUrl || provider.defaultBaseUrl || '';
  wizardApiKey.value = '';
  wizardApiSecret.value = '';
  wizardApiSecretRow.classList.toggle('hidden', !provider.apiSecretEnv);

  const isCopilot = provider.authMethod === 'oauth-device';
  const isStatic = provider.authMethod === 'static-key';

  wizardCopilotAuth.classList.toggle('hidden', !isCopilot);
  wizardStaticAuthFields.classList.toggle('hidden', isCopilot);
  wizardApiKeyRow.classList.toggle('hidden', !isStatic);

  if (provider.authMethod === 'none') {
    wizardConnectSummary.textContent = `${provider.name} can run without an API key. You can keep or update the base URL.`;
  } else if (isCopilot) {
    wizardConnectSummary.textContent = provider.configured
      ? `GitHub Copilot is ready${copilotStatus.login ? ` as @${copilotStatus.login}` : ''}. Tokens stay server-side.`
      : (copilotStatus.canDeviceLogin
          ? 'Use GitHub device login. AIOS will show a code for github.com/login/device and poll until authorization completes.'
          : (copilotStatus.guidance || 'Set COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN, or configure GITHUB_COPILOT_CLIENT_ID to use device login.'));
  } else {
    wizardConnectSummary.textContent = `Enter ${provider.name} connection details. Secrets stay server-side.`;
  }

  wizardCopilotPollButton.disabled = !copilotDeviceFlow;
  wizardCopilotStartButton.disabled = !copilotStatus.canDeviceLogin;
  wizardTestButton.disabled = isCopilot && !provider.configured;
  wizardCopilotCode.classList.toggle('hidden', !copilotDeviceFlow?.userCode);
  wizardCopilotLink.classList.toggle('hidden', !copilotDeviceFlow?.verificationUri);

  if (copilotDeviceFlow?.userCode) {
    wizardCopilotCode.textContent = `Enter code ${copilotDeviceFlow.userCode} at github.com/login/device.`;
  }
  if (copilotDeviceFlow?.verificationUri) {
    wizardCopilotLink.href = copilotDeviceFlow.verificationUriComplete || copilotDeviceFlow.verificationUri;
  }
}

function setWizardStep(index) {
  currentWizardStep = Math.max(0, Math.min(index, WIZARD_STEPS.length - 1));
  const stepKey = WIZARD_STEPS[currentWizardStep];

  WIZARD_STEPS.forEach((name) => {
    const section = document.getElementById(`wizardStep${name[0].toUpperCase()}${name.slice(1)}`);
    section.classList.toggle('hidden', name !== stepKey);
  });

  wizardStepLabel.textContent = `Step ${currentWizardStep + 1} of ${WIZARD_STEPS.length}`;
  document.querySelectorAll('.wizard-stepper [data-step-index]').forEach((node) => {
    const stepIndex = Number(node.dataset.stepIndex);
    node.classList.toggle('active', stepIndex === currentWizardStep);
    node.classList.toggle('complete', stepIndex < currentWizardStep);
  });
  wizardBackButton.disabled = currentWizardStep === 0;
  wizardNextButton.classList.toggle('hidden', currentWizardStep === WIZARD_STEPS.length - 1);
  wizardFinishButton.classList.toggle('hidden', currentWizardStep !== WIZARD_STEPS.length - 1);

  if (stepKey === 'connect') renderWizardConnectState();
}

function openWizard() {
  wizardTestSucceeded = false;
  setFeedback(wizardConnectStatus);
  setFeedback(wizardTestStatus);
  setFeedback(wizardFinishStatus);
  setupWizard.classList.remove('hidden');
  setWizardStep(0);
}

function closeWizard() {
  setupWizard.classList.add('hidden');
}

async function loadWizardProviders(preferredProviderId = '') {
  const currentProvider = String(preferredProviderId || wizardProviderSelect.value || '').trim();
  const currentModel = wizardModelSelect.value;
  const response = await fetch('/api/providers');
  const payload = await response.json();
  if (!response.ok || !Array.isArray(payload.providers)) {
    throw new Error(`Failed to load provider catalog (HTTP ${response.status}).`);
  }

  wizardProviders = payload.providers;
  wizardProviderSelect.innerHTML = '';

  const groups = new Map();
  wizardProviders.forEach((provider) => {
    if (!groups.has(provider.category)) {
      const group = document.createElement('optgroup');
      group.label = provider.category;
      groups.set(provider.category, group);
      wizardProviderSelect.appendChild(group);
    }

    const option = document.createElement('option');
    option.value = provider.id;
    option.textContent = provider.name;
    groups.get(provider.category).appendChild(option);
  });

  if (currentProvider && wizardProviders.some((provider) => provider.id === currentProvider)) {
    wizardProviderSelect.value = currentProvider;
  } else if (providerSelect.value && wizardProviders.some((provider) => provider.id === providerSelect.value)) {
    wizardProviderSelect.value = providerSelect.value;
  } else if (wizardProviders[0]) {
    wizardProviderSelect.value = wizardProviders[0].id;
  }

  const provider = selectedWizardProvider();
  selectValidModel(wizardModelSelect, provider?.models || [], preferredModelForProvider(provider, currentModel));
  renderWizardProviderGroups();
}

async function loadProviders() {
  const currentProvider = providerSelect.value;
  const currentModel = modelSelect.value;
  const response = await fetch('/api/settings/providers');
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to load providers (HTTP ${response.status}).`);
  }

  providers = payload.providers || [];
  copilotStatus = payload.copilot || {
    configured: false,
    login: null,
    connectedAt: null,
    authSource: 'not-configured',
    canDeviceLogin: false
  };

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

  if (currentProvider && providers.some((provider) => provider.id === currentProvider)) {
    providerSelect.value = currentProvider;
  } else if (providers[0]) {
    providerSelect.value = providers[0].id;
  }

  const provider = selectedProvider();
  selectValidModel(modelSelect, provider?.models || [], preferredModelForProvider(provider, currentModel));
  renderAuthState(provider);
  providerStatusBadge.textContent = `Provider: ${provider?.name || 'not selected'}`;
  renderProviderSetupList();
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
    copilotCode.textContent = `Enter code ${copilotDeviceFlow.userCode} at github.com/login/device.`;
  }
  if (copilotDeviceFlow?.verificationUri) {
    copilotLink.href = copilotDeviceFlow.verificationUriComplete || copilotDeviceFlow.verificationUri;
  }

  if (!provider) {
    authSummary.textContent = '';
    authDetail.textContent = '';
    return;
  }

  if (provider.authMethod === 'none') {
    authSummary.textContent = 'No key needed';
    authDetail.textContent = `${provider.name} can run without API credentials.`;
    return;
  }

  if (isCopilot) {
    authSummary.textContent = provider.configured
      ? `Connected${copilotStatus.login ? ` as @${copilotStatus.login}` : ''}`
      : 'GitHub sign-in required';
    authDetail.textContent = provider.configured
      ? (copilotStatus.authSource === 'env'
          ? 'Using GitHub token from environment variables. Secrets are never sent back to the browser.'
          : 'OAuth token and Copilot session are stored outside the repository.')
      : (copilotStatus.canDeviceLogin
          ? 'Click Sign in with GitHub to get a one-time code for github.com/login/device.'
          : (copilotStatus.guidance || 'Set COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN, or configure GITHUB_COPILOT_CLIENT_ID to use device login.'));
    copilotStartButton.textContent = provider.configured ? 'Reconnect GitHub' : 'Sign in with GitHub';
    copilotStartButton.disabled = !copilotStatus.canDeviceLogin;
    return;
  }

  if (provider.requiresApiKey === false) {
    authSummary.textContent = provider.configured ? 'Configured' : 'Optional API key';
    authDetail.textContent = 'Save optional key/base URL in AIOS settings.';
    return;
  }

  authSummary.textContent = provider.configured ? 'API key configured' : 'API key required';
  authDetail.textContent = provider.apiSecretEnv
    ? `Configure ${provider.apiKeyEnv} and ${provider.apiSecretEnv} in AIOS settings.`
    : `Configure ${provider.apiKeyEnv} in AIOS settings.`;
}

async function saveProviderSettings({ provider, baseUrl, apiKey, apiSecret } = {}) {
  const targetProvider = provider || selectedProvider();
  if (!targetProvider || targetProvider.authMethod === 'oauth-device') return;

  const body = {
    baseUrl: typeof baseUrl === 'string' ? baseUrl.trim() : providerBaseUrlInput.value.trim()
  };

  if (targetProvider.authMethod === 'static-key') {
    const resolvedApiKey = typeof apiKey === 'string' ? apiKey.trim() : providerApiKeyInput.value.trim();
    const resolvedApiSecret = typeof apiSecret === 'string' ? apiSecret.trim() : providerApiSecretInput.value.trim();

    if (resolvedApiKey) body.apiKey = resolvedApiKey;
    if (targetProvider.apiSecretEnv && resolvedApiSecret) body.apiSecret = resolvedApiSecret;
  }

  const response = await fetch(`/api/settings/providers/${encodeURIComponent(targetProvider.id)}`, {
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
  await loadWizardProviders();
  await loadApiAudit();
  renderMessage('system', `${targetProvider.name} settings saved.`);
}

async function clearProviderSettings() {
  const provider = selectedProvider();
  if (!provider || provider.authMethod === 'oauth-device') return;

  const response = await fetch(`/api/settings/providers/${encodeURIComponent(provider.id)}`, { method: 'DELETE' });
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to clear provider settings (HTTP ${response.status}).`);
  }

  providerApiKeyInput.value = '';
  providerApiSecretInput.value = '';
  await loadProviders();
  await loadWizardProviders();
  await loadApiAudit();
  renderMessage('system', `${provider.name} stored settings cleared.`);
}

async function startCopilotLogin() {
  const response = await fetch('/api/auth/github-copilot/start', { method: 'POST' });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Sign-in failed (HTTP ${response.status}).`);
  }

  copilotDeviceFlow = payload;
  const url = payload.verificationUri || 'https://github.com/login/device';
  const code = payload.userCode ? ` Code: ${payload.userCode}` : '';
  setFeedback(wizardConnectStatus, `Open ${url}.${code}`, 'success');
  renderAuthState();
  renderWizardConnectState();
  scheduleCopilotPoll(payload.interval);
}

async function pollCopilotLogin() {
  if (!copilotDeviceFlow?.deviceCode) return;

  const response = await fetch('/api/auth/github-copilot/poll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceCode: copilotDeviceFlow.deviceCode })
  });
  const payload = await response.json();

  if (response.status === 202 || payload.pending) {
    setFeedback(wizardConnectStatus, payload.message || 'Waiting for GitHub authorization...');
    renderAuthState();
    renderWizardConnectState();
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
    connectedAt: new Date().toISOString(),
    authSource: 'oauth-device',
    canDeviceLogin: true
  };
  copilotDeviceFlow = null;
  const wizardProviderId = wizardProviderSelect.value;
  await loadProviders();
  await loadWizardProviders(wizardProviderId);
  setFeedback(wizardConnectStatus, `Connected${payload.login ? ` as @${payload.login}` : ''}.`, 'success');
  renderWizardConnectState();
}

async function saveWizardConnection() {
  const provider = selectedWizardProvider();
  if (!provider) {
    setFeedback(wizardConnectStatus, 'Pick a provider before saving connection details.', 'error');
    return;
  }

  if (provider.authMethod === 'oauth-device') {
    if (provider.configured) {
      setFeedback(wizardConnectStatus, 'GitHub Copilot is already configured.', 'success');
      return;
    }

    setFeedback(wizardConnectStatus, copilotStatus.guidance || 'Use Sign in with GitHub for Copilot providers.', 'error');
    return;
  }

  await saveProviderSettings({
    provider,
    baseUrl: wizardBaseUrl.value,
    apiKey: wizardApiKey.value,
    apiSecret: wizardApiSecret.value
  });

  wizardApiKey.value = '';
  wizardApiSecret.value = '';
  setFeedback(wizardConnectStatus, `${provider.name} settings saved.`, 'success');
  wizardTestSucceeded = false;
}

async function runWizardConnectionTest() {
  const provider = selectedWizardProvider();
  if (!provider) {
    setFeedback(wizardTestStatus, 'Pick a provider first.', 'error');
    return;
  }

  if (provider.authMethod === 'oauth-device' && !provider.configured) {
    setFeedback(wizardTestStatus, 'Sign in with GitHub before testing Copilot.', 'error');
    return;
  }

  setFeedback(wizardTestStatus, `Testing ${provider.name}...`);
  const response = await fetch(`/api/settings/providers/${encodeURIComponent(provider.id)}/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: wizardModelSelect.value || provider.models?.[0] })
  });
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    wizardTestSucceeded = false;
    setFeedback(wizardTestStatus, payload.error || `Connection test failed (HTTP ${response.status}).`, 'error');
    return;
  }

  wizardTestSucceeded = true;
  setFeedback(wizardTestStatus, `Success: ${payload.message || 'Provider connection is working.'}`, 'success');
  await loadApiAudit();
}

async function finishWizard() {
  const provider = selectedWizardProvider();
  if (!provider) {
    setFeedback(wizardFinishStatus, 'Pick a provider to finish setup.', 'error');
    return;
  }

  const response = await fetch('/api/settings/first-run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    setFeedback(wizardFinishStatus, payload.error || `Failed to finish setup (HTTP ${response.status}).`, 'error');
    return;
  }

  providerSelect.value = provider.id;
  const selected = selectedProvider();
  selectValidModel(modelSelect, selected?.models || [], preferredModelForProvider(selected, wizardModelSelect.value));
  renderAuthState(selected);

  closeWizard();
  openWindow('chat');
  renderMessage('system', `${provider.name} is ready. Welcome to AIOS.`);
}

async function checkFirstRun() {
  const response = await fetch('/api/settings/first-run');
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to load setup state (HTTP ${response.status}).`);
  }

  if (!payload.completed) {
    openWizard();
  }
}

async function resetFirstRunAndOpenWizard() {
  const response = await fetch('/api/settings/first-run', { method: 'DELETE' });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Failed to reset first-run state (HTTP ${response.status}).`);
  }

  openWizard();
}

async function callExec(command) {
  const response = await fetch('/api/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || payload.stderr || `Command failed (HTTP ${response.status}).`);
  }

  return payload;
}

function formatExecResult(result) {
  const parts = [`Exit code: ${result.code}`];
  if (result.stdout) parts.push(`stdout:\n${result.stdout}`);
  if (result.stderr) parts.push(`stderr:\n${result.stderr}`);
  if (result.timedOut) parts.push('Command timed out.');
  return parts.join('\n\n');
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

async function readWorkspaceFile(pathValue) {
  const response = await fetch('/api/fs/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue })
  });

  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Read failed (HTTP ${response.status}).`);
  }

  return payload;
}

async function writeWorkspaceFile(pathValue, content) {
  const response = await fetch('/api/fs/write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue, content })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Write failed (HTTP ${response.status}).`);
  }
  return payload;
}

async function refreshFileList(pathValue = filesPathInput.value || '.') {
  try {
    const result = await listWorkspace(pathValue);
    filesPathInput.value = result.path || '.';
    filesEntries.innerHTML = '';
    result.entries.forEach((entry) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'file-entry';
      button.textContent = `${entry.type === 'directory' ? '📁' : '📄'} ${entry.name}`;
      button.addEventListener('click', async () => {
        const prefix = result.path === '.' ? '' : `${result.path}/`;
        const nextPath = `${prefix}${entry.name}`;
        if (entry.type === 'directory') {
          await refreshFileList(nextPath);
          return;
        }

        try {
          const file = await readWorkspaceFile(nextPath);
          fileEditorPath.textContent = file.path;
          fileEditorContent.value = file.content;
          setFeedback(fileReadStatus, `Opened ${file.path}`);
        } catch (error) {
          setFeedback(fileReadStatus, error.message, 'error');
        }
      });
      item.appendChild(button);
      filesEntries.appendChild(item);
    });
    setFeedback(fileReadStatus, `Listed ${result.path}`);
  } catch (error) {
    setFeedback(fileReadStatus, error.message, 'error');
  }
}

async function loadDataDirInfo() {
  try {
    const response = await fetch('/api/local-data/info');
    const payload = await response.json();
    if (response.ok && payload.ok) {
      dataDirValue.textContent = payload.dataDir;
    }
  } catch {
    dataDirValue.textContent = 'unavailable';
  }
}

async function loadImports() {
  const response = await fetch('/api/local-data/imports');
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to load imports.');
  }

  importList.innerHTML = '';
  payload.imports.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.type} • ${item.name} • ${item.recordCount} records${item.containsSensitiveData ? ' • sensitive' : ''}`;
    importList.appendChild(li);
  });
}

async function importLocalJson() {
  const file = importFileInput.files?.[0];
  if (!file) {
    importStatus.textContent = 'Choose a JSON file first.';
    return;
  }

  const raw = await file.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error('Selected file is not valid JSON.');
  }

  const response = await fetch('/api/local-data/imports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: importTypeSelect.value,
      name: file.name,
      payload
    })
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Import failed.');
  }

  importStatus.textContent = `${file.name} imported locally.`;
  await loadImports();
}

async function loadApiAudit() {
  const response = await fetch('/api/settings/provider-audit');
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to load provider audit events.');
  }

  apiAuditList.innerHTML = '';
  payload.events.slice(0, 20).forEach((event) => {
    const li = document.createElement('li');
    const mask = event.maskedKey ? `${event.maskedKey.fingerprint} • ****${event.maskedKey.last4}` : 'no key material';
    li.textContent = `${event.timestamp} • ${event.providerId} • ${event.action} • ${mask}`;
    apiAuditList.appendChild(li);
  });
}

function tickClock() {
  clockLabel.textContent = new Date().toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  });
}

providerSelect.addEventListener('change', updateModelOptions);

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
runSetupAgainButton.addEventListener('click', () => {
  resetFirstRunAndOpenWizard().catch((error) => renderMessage('system', `Setup reset failed: ${error.message}`));
});
openSetupAssistant.addEventListener('click', openWizard);

wizardProviderSelect.addEventListener('change', () => {
  updateWizardModelOptions();
  renderWizardConnectState();
  wizardTestSucceeded = false;
  setFeedback(wizardTestStatus);
});
wizardSaveConnectionButton.addEventListener('click', () => {
  saveWizardConnection().catch((error) => setFeedback(wizardConnectStatus, error.message, 'error'));
});
wizardCopilotStartButton.addEventListener('click', () => {
  startCopilotLogin().catch((error) => setFeedback(wizardConnectStatus, error.message, 'error'));
});
wizardCopilotPollButton.addEventListener('click', () => {
  pollCopilotLogin().catch((error) => setFeedback(wizardConnectStatus, error.message, 'error'));
});
wizardTestButton.addEventListener('click', () => {
  runWizardConnectionTest().catch((error) => setFeedback(wizardTestStatus, error.message, 'error'));
});
wizardBackButton.addEventListener('click', () => setWizardStep(currentWizardStep - 1));
wizardNextButton.addEventListener('click', () => {
  if (WIZARD_STEPS[currentWizardStep] === 'provider' && !wizardProviderSelect.value) {
    setFeedback(wizardConnectStatus, 'Choose a provider before continuing.', 'error');
    return;
  }

  if (WIZARD_STEPS[currentWizardStep] === 'connect') {
    const provider = selectedWizardProvider();
    if (provider?.authMethod === 'oauth-device' && !provider.configured) {
      setFeedback(wizardConnectStatus, 'Sign in with GitHub before continuing.', 'error');
      return;
    }
  }

  if (WIZARD_STEPS[currentWizardStep] === 'test' && !wizardTestSucceeded) {
    setFeedback(wizardTestStatus, 'Run a successful connection test before finishing.', 'error');
    return;
  }

  setWizardStep(currentWizardStep + 1);
});
wizardFinishButton.addEventListener('click', () => {
  finishWizard().catch((error) => setFeedback(wizardFinishStatus, error.message, 'error'));
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const provider = selectedProvider();
  if (!provider) return;
  const model = provider.models?.includes(modelSelect.value) ? modelSelect.value : provider.models?.[0];
  if (!model) {
    renderMessage('system', `No model is available for ${provider.name}.`);
    return;
  }
  if (modelSelect.value !== model) {
    modelSelect.value = model;
  }

  renderMessage('user', text);
  messageInput.value = '';

  try {
    chatHistory.push({ role: 'user', content: text });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: provider.id,
        model,
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

terminalRunButton.addEventListener('click', async () => {
  const command = terminalCommandInput.value.trim();
  if (!command) return;

  terminalOutput.textContent += `\n$ ${command}\n`;
  try {
    const result = await callExec(command);
    terminalOutput.textContent += `${formatExecResult(result)}\n`;
  } catch (error) {
    terminalOutput.textContent += `Error: ${error.message}\n`;
  }
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

filesRefreshButton.addEventListener('click', () => refreshFileList(filesPathInput.value || '.'));
filesUpButton.addEventListener('click', () => refreshFileList(formatPathUp(filesPathInput.value)));
fileSaveButton.addEventListener('click', async () => {
  const targetPath = fileEditorPath.textContent;
  if (!targetPath || targetPath === 'No file selected') {
    setFeedback(fileReadStatus, 'Select a file before saving.', 'error');
    return;
  }

  try {
    await writeWorkspaceFile(targetPath, fileEditorContent.value);
    setFeedback(fileReadStatus, `Saved ${targetPath}`, 'success');
  } catch (error) {
    setFeedback(fileReadStatus, error.message, 'error');
  }
});

importButton.addEventListener('click', () => {
  importLocalJson().catch((error) => {
    importStatus.textContent = error.message;
  });
});

accentSelect.addEventListener('change', () => {
  shellState.preferences.accent = accentSelect.value;
  applyPreferences();
  persistShellState();
});

wallpaperSelect.addEventListener('change', () => {
  shellState.preferences.wallpaper = wallpaperSelect.value;
  applyPreferences();
  persistShellState();
});

document.querySelectorAll('.dock-item[data-open-app]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.openApp === 'apps') {
      openWindow('settings');
      return;
    }
    openWindow(button.dataset.openApp);
    if (button.dataset.openApp === 'files') {
      refreshFileList().catch((error) => setFeedback(fileReadStatus, error.message, 'error'));
    }
  });
});

document.querySelectorAll('[data-window-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const app = button.dataset.app;
    const action = button.dataset.windowAction;
    if (action === 'zoom') {
      focusWindow(app);
      return;
    }
    closeWindow(app);
  });
});

document.querySelectorAll('.app-window').forEach((windowEl) => {
  initWindowDrag(windowEl);
  windowEl.addEventListener('mousedown', () => focusWindow(windowEl.dataset.app));
});

renderMessage('system', 'Welcome to AIOS web shell. Use dock apps for chat, files, terminal, and setup.');

tickClock();
setInterval(tickClock, 30000);

Promise.all([
  loadShellState(),
  loadProviders(),
  loadWizardProviders(),
  loadDataDirInfo(),
  loadImports(),
  loadApiAudit()
])
  .then(() => {
    checkFirstRun();
    refreshFileList().catch(() => {});
  })
  .catch((error) => renderMessage('system', `Failed to load AIOS: ${error.message}`));
