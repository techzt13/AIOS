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
const providerSettingsStatus = document.getElementById('providerSettingsStatus');
const authSummary = document.getElementById('authSummary');
const authDetail = document.getElementById('authDetail');
const copilotAuth = document.getElementById('copilotAuth');
const copilotStartButton = document.getElementById('copilotStartButton');
const copilotPollButton = document.getElementById('copilotPollButton');
const copilotCode = document.getElementById('copilotCode');
const copilotLink = document.getElementById('copilotLink');
const runSetupAgainButton = document.getElementById('runSetupAgainButton');
const runtimeBadge = document.getElementById('runtimeBadge');
const runtimeModeValue = document.getElementById('runtimeModeValue');
const runtimeUrlValue = document.getElementById('runtimeUrlValue');
const runtimeWorkspaceValue = document.getElementById('runtimeWorkspaceValue');
const runtimeExecValue = document.getElementById('runtimeExecValue');
const runtimeProcessCountValue = document.getElementById('runtimeProcessCountValue');
const refreshRuntimeButton = document.getElementById('refreshRuntimeButton');
const processList = document.getElementById('processList');

const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const newChatButton = document.getElementById('newChatButton');
const chatModelSelect = document.getElementById('chatModelSelect');

const filesPathInput = document.getElementById('filesPathInput');
const filesUpButton = document.getElementById('filesUpButton');
const filesRefreshButton = document.getElementById('filesRefreshButton');
const filesNewFolderButton = document.getElementById('filesNewFolderButton');
const filesUploadButton = document.getElementById('filesUploadButton');
const filesUploadInput = document.getElementById('filesUploadInput');
const filesBreadcrumbs = document.getElementById('filesBreadcrumbs');
const filesSearchInput = document.getElementById('filesSearchInput');
const filesSortSelect = document.getElementById('filesSortSelect');
const filesEntries = document.getElementById('filesEntries');
const fileEditorPath = document.getElementById('fileEditorPath');
const fileEditorContent = document.getElementById('fileEditorContent');
const fileSaveButton = document.getElementById('fileSaveButton');
const fileReadStatus = document.getElementById('fileReadStatus');

const terminalCommandInput = document.getElementById('terminalCommandInput');
const terminalRunButton = document.getElementById('terminalRunButton');
const terminalOutput = document.getElementById('terminalOutput');
const terminalTitle = document.getElementById('terminalTitle');
const terminalAppGlyph = document.getElementById('terminalAppGlyph');
const terminalStatusText = document.getElementById('terminalStatusText');
const terminalRuntimeBadge = document.getElementById('terminalRuntimeBadge');

const browserToolbar = document.getElementById('browserToolbar');
const browserBackButton = document.getElementById('browserBackButton');
const browserForwardButton = document.getElementById('browserForwardButton');
const browserRefreshButton = document.getElementById('browserRefreshButton');
const browserUrlInput = document.getElementById('browserUrlInput');
const browserWebview = document.getElementById('browserWebview');
let browserWebviewReady = false;
const browserWebviewReadyQueue = [];
const browserFrame = document.getElementById('browserFrame');
const browserOpenExternalButton = document.getElementById('browserOpenExternalButton');
const browserBlockedNotice = document.getElementById('browserBlockedNotice');
const browserNoticeExternalButton = document.getElementById('browserNoticeExternalButton');
const browserExternalPage = document.getElementById('browserExternalPage');
const browserExternalDetail = document.getElementById('browserExternalDetail');
const browserExternalLink = document.getElementById('browserExternalLink');
const browserTryEmbedButton = document.getElementById('browserTryEmbedButton');
const installAppForm = document.getElementById('installAppForm');
const installAppName = document.getElementById('installAppName');
const installAppUrl = document.getElementById('installAppUrl');
const installAppGlyph = document.getElementById('installAppGlyph');
const installFromPwaButton = document.getElementById('installFromPwaButton');
const installAppManifestFile = document.getElementById('installAppManifestFile');
const installAppManifestButton = document.getElementById('installAppManifestButton');
const installAppStatus = document.getElementById('installAppStatus');
const thirdPartyAppsGrid = document.getElementById('thirdPartyAppsGrid');
const linuxPackageFile = document.getElementById('linuxPackageFile');
const linuxPackageUrl = document.getElementById('linuxPackageUrl');
const installLinuxPackageButton = document.getElementById('installLinuxPackageButton');
const downloadLinuxPackageButton = document.getElementById('downloadLinuxPackageButton');
const linuxPackageStatus = document.getElementById('linuxPackageStatus');
const linuxPackagesGrid = document.getElementById('linuxPackagesGrid');

const accentSelect = document.getElementById('accentSelect');
const wallpaperGrid = document.getElementById('wallpaperGrid');
const themeSelect = document.getElementById('themeSelect');
const wallpaperFileInput = document.getElementById('wallpaperFileInput');
const wallpaperUploadButton = document.getElementById('wallpaperUploadButton');
const wallpaperPreview = document.getElementById('wallpaperPreview');
const performanceModeToggle = document.getElementById('performanceModeToggle');
const settingsSystemVolumeToggle = document.getElementById('settingsSystemVolumeToggle');
const settingsNotificationsToggle = document.getElementById('settingsNotificationsToggle');
const settingsDefaultSpaceSelect = document.getElementById('settingsDefaultSpaceSelect');
const settingsStartupApps = document.getElementById('settingsStartupApps');
const settingsSaveStartupButton = document.getElementById('settingsSaveStartupButton');
const settingsOpenMissionControlButton = document.getElementById('settingsOpenMissionControlButton');
const settingsResetLockButton = document.getElementById('settingsResetLockButton');
const settingsSnapToggle = document.getElementById('settingsSnapToggle');
const settingsStatus = document.getElementById('settingsStatus');
const themeToggleButton = document.getElementById('themeToggleButton');
const tipsDetailOverlay = document.getElementById('tipsDetailOverlay');
const tipsDetailClose = document.getElementById('tipsDetailClose');
const tipsDetailGlyph = document.getElementById('tipsDetailGlyph');
const tipsDetailCategory = document.getElementById('tipsDetailCategory');
const tipsDetailTitle = document.getElementById('tipsDetailTitle');
const tipsDetailBody = document.getElementById('tipsDetailBody');
const spotlightButton = document.getElementById('spotlightButton');
const spotlightOverlay = document.getElementById('spotlightOverlay');
const spotlightInput = document.getElementById('spotlightInput');
const spotlightResults = document.getElementById('spotlightResults');
const dataDirValue = document.getElementById('dataDirValue');
const importTypeSelect = document.getElementById('importTypeSelect');
const importFileInput = document.getElementById('importFileInput');
const importButton = document.getElementById('importButton');
const importStatus = document.getElementById('importStatus');
const importList = document.getElementById('importList');
const apiAuditList = document.getElementById('apiAuditList');

const setupWizard = document.getElementById('setupWizard');
const desktopCanvas = document.getElementById('desktopCanvas');
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
const editorTabs = document.getElementById('editorTabs');
const editorTextarea = document.getElementById('editorTextarea');
const editorPreview = document.getElementById('editorPreview');
const editorCode = document.getElementById('editorCode');
const editorStatus = document.getElementById('editorStatus');
const editorNewButton = document.getElementById('editorNewButton');
const editorOpenButton = document.getElementById('editorOpenButton');
const editorSaveButton = document.getElementById('editorSaveButton');
const editorPreviewToggle = document.getElementById('editorPreviewToggle');
const wizardFinishStatus = document.getElementById('wizardFinishStatus');
const openSetupAssistant = document.getElementById('openSetupAssistant');

const activeWindowTitle = document.getElementById('activeWindowTitle');
const providerStatusBadge = document.getElementById('providerStatusBadge');
const clockLabel = document.getElementById('clockLabel');
const dock = document.querySelector('.dock');
const dockItems = Array.from(document.querySelectorAll('.dock-item'));
const dockAppButtons = dockItems.filter((button) => Boolean(button.dataset.openApp));

const WIZARD_STEPS = ['welcome', 'provider', 'connect', 'test', 'finish'];
const WINDOW_IDS = {
  chat: 'windowChat',
  browser: 'windowBrowser',
  notes: 'windowNotes',
  files: 'windowFiles',
  terminal: 'windowTerminal',
  settings: 'windowSettings',
  calculator: 'windowCalculator',
  apps: 'windowApps',
  editor: 'windowEditor',
  instructions: 'windowInstructions',
  calendar: 'windowCalendar',
  monitor: 'windowMonitor',
  trash: 'windowTrash',
  music: 'windowMusic'
};

const WINDOW_LAYOUT = {
  chat: { x: 0.08, y: 0.08 },
  browser: { x: 0.12, y: 0.10 },
  notes: { x: 0.14, y: 0.12 },
  files: { x: 0.16, y: 0.14 },
  terminal: { x: 0.24, y: 0.2 },
  settings: { x: 0.5, y: 0.08, centerX: true },
  calculator: { x: 0.62, y: 0.18 },
  apps: { x: 0.5, y: 0.16, centerX: true },
  editor: { x: 0.18, y: 0.12 },
  calendar: { x: 0.2, y: 0.12 },
  monitor: { x: 0.22, y: 0.14 },
  trash: { x: 0.3, y: 0.18 },
  music: { x: 0.34, y: 0.16 }
};
const MAX_CHAT_HISTORY_MESSAGES = 80;
const MAX_RENDERED_MESSAGES = 140;

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
let shellState = { windows: {}, preferences: {}, browserHistory: [], bookmarks: [], downloads: [], browserTabs: [], editorTabs: [], notifications: [], alarms: [] };
let zCounter = 10;
let focusedApp = null;
let installedApps = [];
let linuxPackages = [];
let pendingTerminalLaunch = null;
let browserLoadTimer = null;
let currentBrowserUrl = '';
let browserHistory = [];
let browserHistoryIndex = -1;
let browserFrameEmbedFriendly = false;
let browserTabState = { tabs: [], activeTabId: null };
let editorTabState = { tabs: [], activeTabId: null };
let customWallpaperUrl = null;

const IFRAME_BLOCKED_HOSTS = [
  'google.com',
  'youtube.com',
  'youtu.be',
  'github.com',
  'instagram.com',
  'facebook.com',
  'x.com',
  'twitter.com'
];

function renderMessageContent(container, content) {
  const text = String(content ?? '');
  const fencePattern = /```([^\n`]*)\n?([\s\S]*?)```/g;
  let cursor = 0;
  let match;
  let foundCode = false;

  while ((match = fencePattern.exec(text)) !== null) {
    foundCode = true;
    const before = text.slice(cursor, match.index);
    if (before) {
      const paragraph = document.createElement('p');
      paragraph.className = 'message-text';
      paragraph.textContent = before;
      container.appendChild(paragraph);
    }

    const language = String(match[1] || '').trim() || 'code';
    const codeText = String(match[2] || '').replace(/\n$/, '');
    const block = document.createElement('div');
    block.className = 'code-block';

    const header = document.createElement('div');
    header.className = 'code-block-header';
    const label = document.createElement('span');
    label.textContent = language;
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'code-copy-button';
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeText);
        copyButton.textContent = 'Copied';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 1200);
      } catch {
        copyButton.textContent = 'Copy failed';
      }
    });

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = codeText;
    pre.appendChild(code);
    header.appendChild(label);
    header.appendChild(copyButton);
    block.appendChild(header);
    block.appendChild(pre);
    container.appendChild(block);
    cursor = match.index + match[0].length;
  }

  const rest = text.slice(cursor);
  if (rest || !foundCode) {
    const paragraph = document.createElement('p');
    paragraph.className = 'message-text';
    paragraph.textContent = rest || text;
    container.appendChild(paragraph);
  }
}

function renderMessage(role, content) {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  renderMessageContent(el, content);
  messagesEl.appendChild(el);
  while (messagesEl.children.length > MAX_RENDERED_MESSAGES) {
    messagesEl.firstElementChild?.remove();
  }
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function trimChatHistory() {
  if (chatHistory.length > MAX_CHAT_HISTORY_MESSAGES) {
    chatHistory = chatHistory.slice(-MAX_CHAT_HISTORY_MESSAGES);
  }
}

function startNewChat({ showWelcome = true } = {}) {
  chatHistory = [];
  currentConversationId = null;
  messagesEl.innerHTML = '';
  if (showWelcome) {
    renderMessage('system', 'New chat started. Your provider login and saved API keys were not changed.');
  }
  messageInput.focus();
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
  const savedModel = shellState.preferences?.modelsByProvider?.[provider.id];
  if (savedModel && provider.models?.includes(savedModel)) return savedModel;
  if (currentModel && provider.models?.includes(currentModel)) return currentModel;
  if (provider.defaultModel && provider.models?.includes(provider.defaultModel)) return provider.defaultModel;
  if (provider.id === 'github-copilot' && provider.models?.includes('github-copilot/gpt-4o')) {
    return 'github-copilot/gpt-4o';
  }
  return provider.models?.[0] || '';
}

function isProviderUsable(provider) {
  return Boolean(provider && (provider.configured || provider.authMethod === 'none'));
}

function chooseDefaultProviderId(currentProviderId = '') {
  const savedProviderId = shellState.preferences?.providerId;
  if (savedProviderId && providers.some((provider) => provider.id === savedProviderId)) {
    return savedProviderId;
  }

  if (currentProviderId && providers.some((provider) => provider.id === currentProviderId)) {
    return currentProviderId;
  }

  const configuredCopilot = providers.find((provider) => provider.id === 'github-copilot' && isProviderUsable(provider));
  if (configuredCopilot) return configuredCopilot.id;

  const configuredProvider = providers.find(isProviderUsable);
  if (configuredProvider) return configuredProvider.id;

  const copilot = providers.find((provider) => provider.id === 'github-copilot');
  if (copilot) return copilot.id;

  return providers[0]?.id || '';
}

function persistProviderChoice(provider = selectedProvider(), model = modelSelect.value) {
  if (!provider) return;
  shellState.preferences.providerId = provider.id;
  shellState.preferences.modelsByProvider = {
    ...(shellState.preferences.modelsByProvider || {}),
    [provider.id]: model || provider.defaultModel || provider.models?.[0] || ''
  };
  persistShellState();
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

function appGlyphFromName(name) {
  return String(name || 'APP')
    .trim()
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 2)
    .toUpperCase() || 'APP';
}

function normalizeBrowserUrl(rawValue) {
  const raw = String(rawValue || '').trim();
  if (!raw) return '';

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (/^localhost(?::\d+)?(\/.*)?$/i.test(raw)) {
    return `http://${raw}`;
  }

  if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(raw)) {
    return `https://${raw}`;
  }

  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(raw)}`;
}

function hostLikelyBlocksEmbedding(urlValue) {
  try {
    const hostname = new URL(urlValue).hostname.replace(/^www\./, '').toLowerCase();
    return IFRAME_BLOCKED_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

function canUseBrowserWebview() {
  return window.aiosNative?.runtime === 'electron-desktop' && Boolean(browserWebview);
}

// Some sites block iframe embedding but publish an embed-friendly variant.
// Rewriting keeps them inside the AIOS browser window.
function embedFriendlyUrl(urlValue) {
  try {
    const parsed = new URL(urlValue);
    const host = parsed.hostname.replace(/^(www|m)\./, '').toLowerCase();
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    if (host === 'youtube.com') {
      const id = parsed.searchParams.get('v');
      if (parsed.pathname === '/watch' && id) {
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const shortId = parsed.pathname.split('/').filter(Boolean)[1];
        if (shortId) return `https://www.youtube-nocookie.com/embed/${shortId}?autoplay=1`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function browserWebviewIsVisible() {
  return canUseBrowserWebview() && browserWebviewReady && !browserWebview.classList.contains('hidden');
}

function whenBrowserWebviewReady(callback) {
  if (browserWebviewReady) {
    callback();
  } else {
    browserWebviewReadyQueue.push(callback);
  }
}

function updateBrowserNavigationControls() {
  if (browserWebviewIsVisible() && typeof browserWebview.canGoBack === 'function') {
    whenBrowserWebviewReady(() => {
      try {
        browserBackButton.disabled = !browserWebview.canGoBack();
        browserForwardButton.disabled = !browserWebview.canGoForward();
      } catch {
        browserBackButton.disabled = true;
        browserForwardButton.disabled = true;
      }
    });
    return;
  }

  const tab = getActiveBrowserTab();
  if (tab) {
    browserBackButton.disabled = tab.historyIndex <= 0;
    browserForwardButton.disabled = tab.historyIndex < 0 || tab.historyIndex >= tab.history.length - 1;
  } else {
    browserBackButton.disabled = browserHistoryIndex <= 0;
    browserForwardButton.disabled = browserHistoryIndex < 0 || browserHistoryIndex >= browserHistory.length - 1;
  }
}

function rememberBrowserHistory(url) {
  const tab = getActiveBrowserTab();
  if (tab) {
    if (tab.history[tab.historyIndex] === url) {
      updateBrowserNavigationControls();
      return;
    }
    tab.history = tab.history.slice(0, tab.historyIndex + 1);
    tab.history.push(url);
    tab.historyIndex = tab.history.length - 1;
  } else {
    if (browserHistory[browserHistoryIndex] === url) {
      updateBrowserNavigationControls();
      return;
    }
    browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    browserHistory.push(url);
    browserHistoryIndex = browserHistory.length - 1;
  }
  updateBrowserNavigationControls();
}

// === PERSISTENT BROWSER HISTORY ===
const browserHistoryButton = document.getElementById('browserHistoryButton');
const browserHistoryPanel = document.getElementById('browserHistoryPanel');
const browserHistoryList = document.getElementById('browserHistoryList');
const browserHistoryClearButton = document.getElementById('browserHistoryClearButton');
const browserHistoryOptions = document.getElementById('browserHistoryOptions');
const browserTabBar = document.getElementById('browserTabBar');
const browserTabs = document.getElementById('browserTabs');
const browserNewTabButton = document.getElementById('browserNewTabButton');
const browserBookmarkButton = document.getElementById('browserBookmarkButton');
const browserBookmarksPanel = document.getElementById('browserBookmarksPanel');
const browserBookmarksList = document.getElementById('browserBookmarksList');
const browserAddBookmarkButton = document.getElementById('browserAddBookmarkButton');
const browserDownloadsButton = document.getElementById('browserDownloadsButton');
const browserDownloadsPanel = document.getElementById('browserDownloadsPanel');
const browserDownloadsList = document.getElementById('browserDownloadsList');
const browserDownloadsClearButton = document.getElementById('browserDownloadsClearButton');
const MAX_PERSISTED_HISTORY = 200;

function recordBrowserVisit(url, title = '') {
  if (!url || url === 'about:blank' || !/^https?:/i.test(url)) return;
  const history = shellState.browserHistory || [];
  const existing = history.find((entry) => entry.url === url);
  const entry = {
    url,
    title: title || existing?.title || '',
    visitedAt: Date.now()
  };
  shellState.browserHistory = [entry, ...history.filter((item) => item.url !== url)].slice(0, MAX_PERSISTED_HISTORY);
  persistShellState();
  renderBrowserHistoryUi();
}

function updateBrowserVisitTitle(url, title) {
  if (!url || !title) return;
  const entry = (shellState.browserHistory || []).find((item) => item.url === url);
  if (entry && entry.title !== title) {
    entry.title = title;
    persistShellState();
    renderBrowserHistoryUi();
  }
}

function historyDisplayLabel(entry) {
  if (entry.title) return entry.title;
  try {
    const parsed = new URL(entry.url);
    return parsed.hostname.replace(/^www\./, '') + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch {
    return entry.url;
  }
}

function renderBrowserHistoryUi() {
  const history = shellState.browserHistory || [];

  if (browserHistoryOptions) {
    browserHistoryOptions.innerHTML = '';
    history.slice(0, 30).forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.url;
      option.label = entry.title || '';
      browserHistoryOptions.appendChild(option);
    });
  }

  if (!browserHistoryList) return;
  browserHistoryList.innerHTML = '';

  if (history.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'status-text';
    empty.textContent = 'No browsing history yet.';
    browserHistoryList.appendChild(empty);
    return;
  }

  history.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'browser-history-item';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'browser-history-open';
    const label = document.createElement('strong');
    label.textContent = historyDisplayLabel(entry);
    const urlText = document.createElement('small');
    urlText.textContent = entry.url;
    openButton.appendChild(label);
    openButton.appendChild(urlText);
    openButton.addEventListener('click', () => {
      hideBrowserPanels();
      openBrowserUrl(entry.url);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'icon-button browser-history-delete';
    deleteButton.title = 'Remove from history';
    deleteButton.textContent = '✕';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      shellState.browserHistory = (shellState.browserHistory || []).filter((item) => item.url !== entry.url);
      persistShellState();
      renderBrowserHistoryUi();
    });

    row.appendChild(openButton);
    row.appendChild(deleteButton);
    browserHistoryList.appendChild(row);
  });
}

function hideBrowserHistoryPanel() {
  hideBrowserPanels();
}

function toggleBrowserHistoryPanel() {
  if (!browserHistoryPanel) return;
  browserHistoryPanel.classList.toggle('hidden');
  if (!browserHistoryPanel.classList.contains('hidden')) {
    renderBrowserHistoryUi();
  }
}

function showBrowserEmbeddedFrame() {
  browserWebview.classList.add('hidden');
  browserExternalPage.classList.add('hidden');
  browserFrame.classList.remove('hidden');
}

function showBrowserWebview() {
  browserExternalPage.classList.add('hidden');
  browserFrame.classList.add('hidden');
  browserWebview.classList.remove('hidden');
}

function showBrowserExternalPage(url) {
  browserWebview.classList.add('hidden');
  browserFrame.classList.add('hidden');
  browserExternalPage.classList.remove('hidden');
  browserExternalLink.href = url;
  browserExternalDetail.textContent = 'Opening a native browser session from the AIOS runtime...';
}

function showBrowserBlockedNotice(url, mode = 'blocked') {
  browserBlockedNotice.classList.remove('hidden');
  const detail = browserBlockedNotice.querySelector('span');
  if (detail) {
    if (mode === 'real-tab') {
      detail.textContent = 'AIOS opened this page through the native runtime instead of the iframe sandbox.';
    } else {
      detail.textContent = hostLikelyBlocksEmbedding(url)
        ? 'This site is known to block embedded frames. If it stays blank, open a native browser session as a fallback.'
        : 'If the page stays blank, this site may block embedded frames. Open a native browser session as a fallback.';
    }
  }
}

function hideBrowserBlockedNotice() {
  browserBlockedNotice.classList.add('hidden');
}

async function launchNativeBrowserUrl(url) {
  if (window.aiosNative?.openBrowserUrl) {
    return window.aiosNative.openBrowserUrl(url);
  }

  const response = await fetch('/api/browser/open', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('AIOS native browser API is unavailable. Start AIOS with npm start (desktop mode).');
  }
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to open native browser session.');
  }
  return payload;
}

function describeNativeBrowserResult(result) {
  if (result?.mode === 'electron-browser-window') {
    return 'AIOS opened this page in an Electron BrowserWindow owned by the AIOS desktop runtime. This is a real browser engine, not an iframe.';
  }

  if (result?.mode) {
    return 'AIOS asked the local OS runtime to open this page in your native browser so video, login, popups, and navigation can work normally.';
  }

  return 'AIOS opened this page outside the iframe sandbox so video, login, popups, and navigation can work normally.';
}

function openRealBrowserTab(url) {
  showBrowserExternalPage(url);
  showBrowserBlockedNotice(url, 'real-tab');
  launchNativeBrowserUrl(url)
    .then((result) => {
      browserExternalDetail.textContent = describeNativeBrowserResult(result);
    })
    .catch((error) => {
      browserExternalDetail.textContent = `Native browser launch failed: ${error.message}. Use "Open again" to open it in a regular browser tab.`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
}

function loadBrowserWebview(url) {
  showBrowserWebview();
  hideBrowserBlockedNotice();
  browserExternalLink.href = url;
  whenBrowserWebviewReady(() => {
    if (typeof browserWebview.loadURL === 'function') {
      browserWebview.loadURL(url);
    } else {
      browserWebview.setAttribute('src', url);
    }
    updateBrowserNavigationControls();
  });
}

function openBrowserUrl(rawValue, options = {}) {
  const url = normalizeBrowserUrl(rawValue);
  if (!url) return;
  if (browserLoadTimer) clearTimeout(browserLoadTimer);

  let tab = getActiveBrowserTab();
  if (!tab || options.newTab) {
    tab = createBrowserTab(url);
  }
  browserTabState.activeTabId = tab.id;

  if (options.recordHistory !== false) {
    rememberBrowserHistory(url);
  }
  currentBrowserUrl = url;
  tab.url = url;
  hideBrowserBlockedNotice();
  hideBrowserPanels();
  browserUrlInput.value = url;
  recordBrowserVisit(url);
  updateBookmarkButton();
  renderBrowserTabs();

  if (canUseBrowserWebview()) {
    loadBrowserWebview(url);
    openWindow('browser');
    return;
  }

  // Embedded iframe is the default; a native browser session only opens when
  // the user explicitly asks for one.
  const embedUrl = options.forceEmbed ? null : embedFriendlyUrl(url);
  tab.embedFriendly = Boolean(embedUrl);
  browserFrameEmbedFriendly = tab.embedFriendly;
  showBrowserEmbeddedFrame();
  browserFrame.src = embedUrl || url;
  if (embedUrl || options.forceEmbed) {
    hideBrowserBlockedNotice();
  } else if (hostLikelyBlocksEmbedding(url)) {
    showBrowserBlockedNotice(url);
  } else {
    browserLoadTimer = setTimeout(() => showBrowserBlockedNotice(url), 3500);
  }
  openWindow('browser');
}

function openCurrentBrowserUrlExternally() {
  const url = normalizeBrowserUrl(browserUrlInput.value || browserFrame.src);
  if (!url || url === 'about:blank') return;
  openRealBrowserTab(url);
}

function navigateBrowserHistory(delta) {
  const tab = getActiveBrowserTab();
  if (browserWebviewIsVisible()) {
    whenBrowserWebviewReady(() => {
      try {
        if (delta < 0 && typeof browserWebview.goBack === 'function' && browserWebview.canGoBack()) {
          browserWebview.goBack();
        } else if (delta > 0 && typeof browserWebview.goForward === 'function' && browserWebview.canGoForward()) {
          browserWebview.goForward();
        }
      } catch {
        updateBrowserNavigationControls();
      }
    });
    return;
  }

  const history = tab ? tab.history : browserHistory;
  let index = tab ? tab.historyIndex : browserHistoryIndex;
  const nextIndex = index + delta;
  if (nextIndex < 0 || nextIndex >= history.length) return;
  index = nextIndex;
  if (tab) tab.historyIndex = index;
  else browserHistoryIndex = index;
  updateBrowserNavigationControls();
  openBrowserUrl(history[index], { recordHistory: false });
}

function refreshBrowserUrl() {
  if (browserWebviewIsVisible() && typeof browserWebview.reload === 'function') {
    whenBrowserWebviewReady(() => browserWebview.reload());
    return;
  }

  const url = normalizeBrowserUrl(currentBrowserUrl || browserUrlInput.value || browserFrame.src);
  if (!url || url === 'about:blank') return;
  openBrowserUrl(url, { recordHistory: false });
}

// === BROWSER TABS ===
function getActiveBrowserTab() {
  return browserTabState.tabs.find((tab) => tab.id === browserTabState.activeTabId) || null;
}

function createBrowserTab(url = 'about:blank', { activate = true } = {}) {
  const tab = {
    id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    url,
    title: '',
    history: url === 'about:blank' ? [] : [url],
    historyIndex: url === 'about:blank' ? -1 : 0,
    embedFriendly: false
  };
  browserTabState.tabs.push(tab);
  if (activate) browserTabState.activeTabId = tab.id;
  renderBrowserTabs();
  return tab;
}

function closeBrowserTab(tabId) {
  const index = browserTabState.tabs.findIndex((tab) => tab.id === tabId);
  if (index < 0) return;
  browserTabState.tabs.splice(index, 1);
  if (browserTabState.activeTabId === tabId) {
    const next = browserTabState.tabs[Math.max(0, index - 1)] || browserTabState.tabs[0];
    browserTabState.activeTabId = next?.id || null;
  }
  if (browserTabState.tabs.length === 0) {
    createBrowserTab('about:blank');
  } else {
    renderBrowserTabs();
    activateBrowserTab(browserTabState.activeTabId);
  }
}

function activateBrowserTab(tabId) {
  const tab = browserTabState.tabs.find((t) => t.id === tabId);
  if (!tab) return;
  browserTabState.activeTabId = tab.id;
  renderBrowserTabs();
  currentBrowserUrl = tab.url;
  browserUrlInput.value = tab.url === 'about:blank' ? '' : tab.url;
  if (tab.url === 'about:blank') {
    browserFrame.src = 'about:blank';
    showBrowserEmbeddedFrame();
    return;
  }
  if (canUseBrowserWebview()) {
    loadBrowserWebview(tab.url);
  } else {
    const embedUrl = embedFriendlyUrl(tab.url);
    tab.embedFriendly = Boolean(embedUrl);
    browserFrameEmbedFriendly = tab.embedFriendly;
    showBrowserEmbeddedFrame();
    browserFrame.src = embedUrl || tab.url;
  }
  updateBrowserNavigationControls();
}

function renderBrowserTabs() {
  if (!browserTabs) return;
  browserTabs.innerHTML = '';
  browserTabState.tabs.forEach((tab) => {
    const el = document.createElement('div');
    el.className = 'browser-tab' + (tab.id === browserTabState.activeTabId ? ' active' : '');
    el.title = tab.title || tab.url;
    el.addEventListener('click', () => activateBrowserTab(tab.id));

    const title = document.createElement('span');
    title.className = 'browser-tab-title';
    title.textContent = tab.title || (tab.url === 'about:blank' ? 'New Tab' : tab.url);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'browser-tab-close';
    close.textContent = '✕';
    close.title = 'Close tab';
    close.addEventListener('click', (event) => {
      event.stopPropagation();
      closeBrowserTab(tab.id);
    });

    el.appendChild(title);
    el.appendChild(close);
    browserTabs.appendChild(el);
  });
}

function updateActiveTabFromNavigation(url, title = '') {
  const tab = getActiveBrowserTab();
  if (!tab) return;
  tab.url = url;
  if (title) tab.title = title;
  if (tab.history[tab.historyIndex] === url) {
    renderBrowserTabs();
    return;
  }
  tab.history = tab.history.slice(0, tab.historyIndex + 1);
  tab.history.push(url);
  tab.historyIndex = tab.history.length - 1;
  renderBrowserTabs();
}

// === BOOKMARKS ===
function isCurrentUrlBookmarked() {
  const url = currentBrowserUrl || browserUrlInput.value;
  if (!url || url === 'about:blank') return false;
  return (shellState.bookmarks || []).some((bookmark) => bookmark.url === url);
}

function addBookmark({ url, title = '' } = {}) {
  const targetUrl = url || currentBrowserUrl || browserUrlInput.value;
  if (!targetUrl || targetUrl === 'about:blank') return;
  const historyEntry = (shellState.browserHistory || []).find((entry) => entry.url === targetUrl);
  const bookmark = {
    id: crypto.randomUUID ? crypto.randomUUID() : `bm-${Date.now()}`,
    url: targetUrl,
    title: title || historyEntry?.title || targetUrl,
    createdAt: new Date().toISOString()
  };
  shellState.bookmarks = [bookmark, ...(shellState.bookmarks || []).filter((b) => b.url !== targetUrl)];
  persistShellState();
  renderBrowserBookmarksUi();
  updateBookmarkButton();
}

function removeBookmark(id) {
  shellState.bookmarks = (shellState.bookmarks || []).filter((b) => b.id !== id);
  persistShellState();
  renderBrowserBookmarksUi();
  updateBookmarkButton();
}

function updateBookmarkButton() {
  if (!browserBookmarkButton) return;
  browserBookmarkButton.textContent = isCurrentUrlBookmarked() ? '★' : '☆';
  browserBookmarkButton.title = isCurrentUrlBookmarked() ? 'Bookmarked' : 'Bookmark this page';
}

function renderBrowserBookmarksUi() {
  if (!browserBookmarksList) return;
  browserBookmarksList.innerHTML = '';
  const bookmarks = shellState.bookmarks || [];
  if (bookmarks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'status-text';
    empty.textContent = 'No bookmarks yet.';
    browserBookmarksList.appendChild(empty);
    return;
  }
  bookmarks.forEach((bookmark) => {
    const row = document.createElement('div');
    row.className = 'browser-history-item';
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'browser-history-open';
    const label = document.createElement('strong');
    label.textContent = bookmark.title || bookmark.url;
    const urlText = document.createElement('small');
    urlText.textContent = bookmark.url;
    openButton.appendChild(label);
    openButton.appendChild(urlText);
    openButton.addEventListener('click', () => {
      hideBrowserPanels();
      openBrowserUrl(bookmark.url);
    });
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'icon-button browser-history-delete';
    deleteButton.textContent = '✕';
    deleteButton.title = 'Remove bookmark';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      removeBookmark(bookmark.id);
    });
    row.appendChild(openButton);
    row.appendChild(deleteButton);
    browserBookmarksList.appendChild(row);
  });
}

function toggleBrowserBookmarksPanel() {
  if (!browserBookmarksPanel) return;
  const wasHidden = browserBookmarksPanel.classList.contains('hidden');
  hideBrowserPanels();
  if (wasHidden) {
    browserBookmarksPanel.classList.remove('hidden');
    renderBrowserBookmarksUi();
  }
}

// === DOWNLOADS ===
function recordDownload(item) {
  shellState.downloads = [item, ...(shellState.downloads || [])].slice(0, 100);
  persistShellState();
  renderBrowserDownloadsUi();
}

function renderBrowserDownloadsUi() {
  if (!browserDownloadsList) return;
  browserDownloadsList.innerHTML = '';
  const downloads = shellState.downloads || [];
  if (downloads.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'status-text';
    empty.textContent = 'No downloads yet.';
    browserDownloadsList.appendChild(empty);
    return;
  }
  downloads.forEach((download) => {
    const row = document.createElement('div');
    row.className = 'browser-history-item';
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'browser-history-open';
    const label = document.createElement('strong');
    label.textContent = download.filename || 'Download';
    const urlText = document.createElement('small');
    urlText.textContent = `${download.state || 'completed'} • ${download.url}`;
    openButton.appendChild(label);
    openButton.appendChild(urlText);
    openButton.addEventListener('click', () => {
      if (download.path) openFileInEditor(download.path);
    });
    row.appendChild(openButton);
    browserDownloadsList.appendChild(row);
  });
}

function toggleBrowserDownloadsPanel() {
  if (!browserDownloadsPanel) return;
  const wasHidden = browserDownloadsPanel.classList.contains('hidden');
  hideBrowserPanels();
  if (wasHidden) {
    browserDownloadsPanel.classList.remove('hidden');
    renderBrowserDownloadsUi();
  }
}

function hideBrowserPanels() {
  browserHistoryPanel?.classList.add('hidden');
  browserBookmarksPanel?.classList.add('hidden');
  browserDownloadsPanel?.classList.add('hidden');
}

// === SPOTLIGHT SEARCH ===
async function openSpotlight() {
  if (!spotlightOverlay) return;
  spotlightOverlay.classList.remove('hidden');
  spotlightInput.value = '';
  spotlightInput.focus();
  await renderSpotlightResults('');
}

function closeSpotlight() {
  spotlightOverlay?.classList.add('hidden');
}

function spotlightItems() {
  const apps = [
    { id: 'app-chat', type: 'app', name: 'AI Chat', glyph: 'AI', action: () => openWindow('chat') },
    { id: 'app-browser', type: 'app', name: 'Browser', glyph: 'BR', action: () => openWindow('browser') },
    { id: 'app-notes', type: 'app', name: 'Notes', glyph: 'N', action: () => openWindow('notes') },
    { id: 'app-files', type: 'app', name: 'Files', glyph: 'FS', action: () => { openWindow('files'); refreshFileList().catch(() => {}); } },
    { id: 'app-terminal', type: 'app', name: 'Terminal', glyph: '$', action: () => openWindow('terminal') },
    { id: 'app-calculator', type: 'app', name: 'Calculator', glyph: '=', action: () => openWindow('calculator') },
    { id: 'app-editor', type: 'app', name: 'Text Editor', glyph: 'TE', action: () => openWindow('editor') },
    { id: 'app-settings', type: 'app', name: 'Settings', glyph: 'ST', action: () => openWindow('settings') },
    { id: 'app-apps', type: 'app', name: 'Apps', glyph: 'AP', action: () => openWindow('apps') },
    { id: 'app-instructions', type: 'app', name: 'Tips', glyph: '💡', action: () => openWindow('instructions') },
    { id: 'app-calendar', type: 'app', name: 'Calendar', glyph: '📅', action: () => openWindow('calendar') },
    { id: 'app-monitor', type: 'app', name: 'Activity Monitor', glyph: '📊', action: () => openWindow('monitor') },
    { id: 'app-music', type: 'app', name: 'Music', glyph: '🎵', action: () => openWindow('music') },
    { id: 'app-trash', type: 'app', name: 'Trash', glyph: '🗑', action: () => openWindow('trash') }
  ];
  const bookmarks = (shellState.bookmarks || []).map((bookmark) => ({
    id: `bookmark-${bookmark.id}`,
    type: 'bookmark',
    name: bookmark.title || bookmark.url,
    detail: bookmark.url,
    glyph: '★',
    action: () => openBrowserUrl(bookmark.url)
  }));
  const history = (shellState.browserHistory || []).slice(0, 20).map((entry) => ({
    id: `history-${entry.url}`,
    type: 'history',
    name: entry.title || entry.url,
    detail: entry.url,
    glyph: '🕘',
    action: () => openBrowserUrl(entry.url)
  }));
  return [...apps, ...bookmarks, ...history];
}

async function searchWorkspaceFiles(query) {
  try {
    const response = await fetch('/api/fs/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const payload = await response.json();
    return payload.ok ? payload.results : [];
  } catch {
    return [];
  }
}

async function renderSpotlightResults(query) {
  if (!spotlightResults) return;
  const q = String(query || '').trim().toLowerCase();
  const items = spotlightItems().filter((item) => {
    if (!q) return true;
    return (item.name || '').toLowerCase().includes(q) || (item.detail || '').toLowerCase().includes(q);
  });

  if (q) {
    const files = await searchWorkspaceFiles(q);
    files.forEach((file) => {
      items.push({
        id: `file-${file.path}`,
        type: 'file',
        name: file.path.split('/').pop(),
        detail: file.path,
        glyph: file.type === 'directory' ? '📁' : '📄',
        action: () => {
          if (file.type === 'directory') {
            openWindow('files');
            refreshFileList(file.path).catch(() => {});
          } else {
            openFileInEditor(file.path);
          }
        }
      });
    });
  }

  spotlightResults.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'spotlight-empty';
    empty.textContent = 'No results.';
    spotlightResults.appendChild(empty);
    return;
  }
  items.slice(0, 12).forEach((item, index) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'spotlight-result' + (index === 0 ? ' active' : '');
    row.innerHTML = `<span class="spotlight-result-glyph">${item.glyph}</span><span class="spotlight-result-info"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail || item.type)}</small></span>`;
    row.addEventListener('click', () => {
      closeSpotlight();
      item.action();
    });
    spotlightResults.appendChild(row);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function moveSpotlightSelection(delta) {
  const rows = spotlightResults?.querySelectorAll('.spotlight-result');
  if (!rows || rows.length === 0) return;
  const activeIndex = Array.from(rows).findIndex((row) => row.classList.contains('active'));
  rows.forEach((row) => row.classList.remove('active'));
  const nextIndex = Math.max(0, Math.min(rows.length - 1, activeIndex + delta));
  rows[nextIndex].classList.add('active');
  rows[nextIndex].scrollIntoView({ block: 'nearest' });
}

function activateSpotlightSelection() {
  const active = spotlightResults?.querySelector('.spotlight-result.active');
  if (active) active.click();
}

// === TEXT EDITOR ===
function getActiveEditorTab() {
  return editorTabState.tabs.find((tab) => tab.id === editorTabState.activeTabId) || null;
}

function createEditorTab({ path = '', content = '', title = 'Untitled' } = {}) {
  const tab = {
    id: `ed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    path,
    title: path ? path.split('/').pop() : title,
    content,
    saved: !path || false,
    scrollTop: 0
  };
  editorTabState.tabs.push(tab);
  editorTabState.activeTabId = tab.id;
  renderEditorTabs();
  loadEditorTab(tab.id);
  return tab;
}

function closeEditorTab(tabId) {
  const index = editorTabState.tabs.findIndex((tab) => tab.id === tabId);
  if (index < 0) return;
  editorTabState.tabs.splice(index, 1);
  if (editorTabState.activeTabId === tabId) {
    const next = editorTabState.tabs[Math.max(0, index - 1)] || editorTabState.tabs[0];
    editorTabState.activeTabId = next?.id || null;
  }
  if (editorTabState.tabs.length === 0) {
    createEditorTab();
  } else {
    renderEditorTabs();
    loadEditorTab(editorTabState.activeTabId);
  }
}

function activateEditorTab(tabId) {
  const current = getActiveEditorTab();
  if (current) {
    current.content = editorTextarea.value;
    current.scrollTop = editorTextarea.scrollTop;
  }
  const tab = editorTabState.tabs.find((t) => t.id === tabId);
  if (!tab) return;
  editorTabState.activeTabId = tab.id;
  renderEditorTabs();
  loadEditorTab(tab.id);
}

function loadEditorTab(tabId) {
  const tab = editorTabState.tabs.find((t) => t.id === tabId);
  if (!tab) return;
  editorTextarea.value = tab.content;
  editorTextarea.scrollTop = tab.scrollTop || 0;
  editorStatus.textContent = tab.path ? `${tab.path}${tab.saved ? '' : ' • unsaved'}` : 'New file';
  updateEditorPreview();
}

function renderEditorTabs() {
  if (!editorTabs) return;
  editorTabs.innerHTML = '';
  editorTabState.tabs.forEach((tab) => {
    const el = document.createElement('div');
    el.className = 'editor-tab' + (tab.id === editorTabState.activeTabId ? ' active' : '');
    el.title = tab.path || tab.title;
    el.addEventListener('click', () => activateEditorTab(tab.id));

    const title = document.createElement('span');
    title.className = 'editor-tab-title';
    title.textContent = tab.title + (tab.saved ? '' : ' ●');

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'editor-tab-close';
    close.textContent = '✕';
    close.title = 'Close tab';
    close.addEventListener('click', (event) => {
      event.stopPropagation();
      closeEditorTab(tab.id);
    });

    el.appendChild(title);
    el.appendChild(close);
    editorTabs.appendChild(el);
  });
}

function handleEditorInput() {
  const tab = getActiveEditorTab();
  if (!tab) return;
  tab.content = editorTextarea.value;
  tab.saved = false;
  renderEditorTabs();
  editorStatus.textContent = tab.path ? `${tab.path} • unsaved` : 'Unsaved';
  updateEditorPreview();
}

async function saveActiveEditorTab() {
  const tab = getActiveEditorTab();
  if (!tab) return;
  let targetPath = tab.path;
  if (!targetPath) {
    const suggested = tab.title === 'Untitled' ? 'untitled.txt' : tab.title;
    targetPath = window.prompt('Save as path (relative to workspace):', suggested);
    if (!targetPath) return;
  }
  try {
    await writeWorkspaceFile(targetPath, editorTextarea.value);
    tab.path = targetPath;
    tab.title = targetPath.split('/').pop();
    tab.saved = true;
    tab.content = editorTextarea.value;
    renderEditorTabs();
    editorStatus.textContent = `Saved ${targetPath}`;
  } catch (error) {
    editorStatus.textContent = `Save failed: ${error.message}`;
  }
}

async function openFileInEditor(pathValue) {
  try {
    const file = await readWorkspaceFile(pathValue);
    createEditorTab({ path: file.path, content: file.content, title: file.path.split('/').pop() });
    openWindow('editor');
  } catch (error) {
    if (editorStatus) editorStatus.textContent = `Open failed: ${error.message}`;
  }
}

function updateEditorPreview() {
  if (!editorPreview || !editorCode) return;
  const tab = getActiveEditorTab();
  const isMarkdown = tab?.path?.toLowerCase().endsWith('.md') || editorPreviewToggle?.checked;
  if (isMarkdown && editorPreviewToggle?.checked) {
    editorPreview.classList.remove('hidden');
    editorCode.innerHTML = renderMarkdownPreview(editorTextarea.value);
  } else {
    editorPreview.classList.add('hidden');
  }
}

function renderMarkdownPreview(text) {
  const escaped = escapeHtml(text || '');
  return escaped
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function formatPathUp(pathValue) {
  if (!pathValue || pathValue === '.') return '.';
  const parts = pathValue.split('/').filter(Boolean);
  if (parts.length <= 1) return '.';
  return parts.slice(0, -1).join('/');
}

function setDockState(app) {
  dockAppButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.openApp === app);
  });
}

function clearDockHoverState() {
  if (!dock) return;
  dock.classList.remove('hovering');
  dockItems.forEach((button) => {
    button.classList.remove('hovered', 'near');
  });
}

function applyDockHoverState(hoveredButton) {
  if (!dock) return;
  const hoveredIndex = dockItems.indexOf(hoveredButton);
  if (hoveredIndex < 0) return;
  dock.classList.add('hovering');
  dockItems.forEach((button, index) => {
    button.classList.toggle('hovered', index === hoveredIndex);
    button.classList.toggle('near', Math.abs(index - hoveredIndex) === 1);
  });
}

function recordWindowState(app, update = {}) {
  shellState.windows[app] = {
    ...(shellState.windows[app] || {}),
    ...update
  };
  persistShellState();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safeWindowBounds(windowEl) {
  const canvasRect = desktopCanvas.getBoundingClientRect();
  const rect = windowEl.getBoundingClientRect();
  const width = rect.width || windowEl.offsetWidth || 720;
  const height = rect.height || windowEl.offsetHeight || 420;
  const maxLeft = Math.max(8, window.innerWidth - width - 16 - canvasRect.left);
  const maxTop = Math.max(8, window.innerHeight - height - 116 - canvasRect.top);

  return {
    canvasLeft: canvasRect.left || 0,
    canvasTop: canvasRect.top || 0,
    width,
    height,
    maxLeft,
    maxTop
  };
}

function defaultWindowPosition(app, windowEl) {
  const layout = WINDOW_LAYOUT[app] || { x: 0.12, y: 0.12 };
  const bounds = safeWindowBounds(windowEl);
  const baseLeft = layout.centerX
    ? (window.innerWidth - bounds.width) / 2
    : window.innerWidth * layout.x;
  const baseTop = window.innerHeight * layout.y;

  return {
    left: clamp(Math.round(baseLeft - bounds.canvasLeft), 8, bounds.maxLeft),
    top: clamp(Math.round(baseTop - bounds.canvasTop), 8, bounds.maxTop)
  };
}

function normalizeWindowPosition(app, { useDefault = false, save = false } = {}) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;

  const bounds = safeWindowBounds(windowEl);
  const fallback = defaultWindowPosition(app, windowEl);
  const currentLeft = Number.parseFloat(windowEl.style.left);
  const currentTop = Number.parseFloat(windowEl.style.top);
  const hasSavedPosition = Number.isFinite(currentLeft) && Number.isFinite(currentTop);
  const savedPositionIsStale = hasSavedPosition
    && (currentLeft < 8 || currentTop < 8 || currentLeft > bounds.maxLeft || currentTop > bounds.maxTop);
  const shouldUseDefault = useDefault || !hasSavedPosition || savedPositionIsStale;
  const nextLeft = shouldUseDefault ? fallback.left : currentLeft;
  const nextTop = shouldUseDefault ? fallback.top : currentTop;
  const left = clamp(Math.round(nextLeft), 8, bounds.maxLeft);
  const top = clamp(Math.round(nextTop), 8, bounds.maxTop);

  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
  if (save) recordWindowState(app, { left, top });
}

let persistTimer = null;
function persistShellState() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(async () => {
    try {
      shellState.browserTabs = browserTabState.tabs.map((tab) => ({
        id: tab.id,
        url: tab.url,
        title: tab.title,
        history: tab.history,
        historyIndex: tab.historyIndex,
        embedFriendly: tab.embedFriendly
      }));
      shellState.activeBrowserTab = browserTabState.activeTabId;
      shellState.editorTabs = editorTabState.tabs.map((tab) => ({
        id: tab.id,
        path: tab.path,
        title: tab.title,
        content: tab.content
      }));
      shellState.activeEditorTab = editorTabState.activeTabId;
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
  focusedApp = app;
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
  const state = shellState.windows?.[app] || {};
  const defaultSpace = shellState.preferences.defaultSpace;
  if (defaultSpace && defaultSpace !== 'current' && !state.open) {
    activeSpace = Math.min(SPACE_COUNT, Math.max(1, Number(defaultSpace) || activeSpace));
    shellState.preferences.activeSpace = activeSpace;
    renderSpacesSwitcher?.();
  }
  windowEl.classList.remove('hidden');
  normalizeWindowPosition(app, {
    useDefault: typeof state.left !== 'number' || typeof state.top !== 'number',
    save: true
  });
  focusWindow(app);
  recordWindowState(app, { open: true, minimized: false, space: activeSpace });
  if (app === 'notes' && typeof loadNotesApp === 'function') {
    loadNotesApp();
  }
  if (app === 'terminal' && typeof initTerminal === 'function') {
    const terminalLaunch = pendingTerminalLaunch || {};
    pendingTerminalLaunch = null;
    setTimeout(() => initTerminal(terminalLaunch), 100);
  }
  if (app === 'calendar') {
    renderCalendarApp();
    renderAlarmsList();
  }
  if (app === 'monitor') {
    startActivityMonitor();
  }
  if (app === 'trash') {
    refreshTrash().catch(() => {});
  }
}

function closeWindow(app) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;
  windowEl.classList.add('hidden');
  recordWindowState(app, { open: false, minimized: true });
  activeWindowTitle.textContent = 'Desktop';
  if (app === 'monitor') {
    stopActivityMonitor();
  }
}

function resolveEffectiveTheme() {
  const theme = shellState.preferences.theme || 'dark';
  if (theme === 'auto') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyPreferences() {
  const accent = shellState.preferences.accent || 'blue';
  const wallpaper = shellState.preferences.wallpaper || 'aurora';
  const performanceMode = shellState.preferences.performanceMode === true;
  const theme = resolveEffectiveTheme();
  root.dataset.accent = accent;
  root.dataset.wallpaper = wallpaper === 'custom' && customWallpaperUrl ? 'custom' : wallpaper;
  root.dataset.performance = performanceMode ? 'fast' : 'visual';
  root.dataset.theme = theme;
  accentSelect.value = accent;
  if (wallpaperGrid) {
    wallpaperGrid.querySelectorAll('.wallpaper-thumb').forEach((thumb) => {
      thumb.classList.toggle('active', thumb.dataset.wallpaper === root.dataset.wallpaper);
    });
  }
  if (themeSelect) themeSelect.value = shellState.preferences.theme || 'dark';
  performanceModeToggle.checked = performanceMode;
  if (settingsSystemVolumeToggle) settingsSystemVolumeToggle.checked = shellState.preferences.systemVolumeSync !== false;
  if (settingsNotificationsToggle) settingsNotificationsToggle.checked = shellState.preferences.notificationToasts !== false;
  if (settingsDefaultSpaceSelect) settingsDefaultSpaceSelect.value = shellState.preferences.defaultSpace || 'current';
  if (settingsSnapToggle) settingsSnapToggle.checked = shellState.preferences.edgeSnapping !== false;
  if (settingsStartupApps) {
    const startupApps = Array.isArray(shellState.preferences.startupApps) ? shellState.preferences.startupApps : [];
    Array.from(settingsStartupApps.options).forEach((option) => {
      option.selected = startupApps.includes(option.value);
    });
  }
  if (themeToggleButton) {
    themeToggleButton.innerHTML = menuIconSvg(theme === 'light' ? 'sun' : 'moon');
  }
  applyCustomWallpaper();
}

function applyCustomWallpaper() {
  const filename = shellState.preferences.customWallpaper;
  customWallpaperUrl = filename ? `/api/local-data/wallpapers/${filename}` : null;
  if (wallpaperPreview) {
    wallpaperPreview.innerHTML = '';
    if (customWallpaperUrl) {
      const img = document.createElement('img');
      img.src = customWallpaperUrl;
      img.alt = 'Custom wallpaper preview';
      wallpaperPreview.appendChild(img);
    }
  }
  const shell = document.querySelector('.desktop-shell');
  if (!shell) return;
  if (shellState.preferences.wallpaper === 'custom' && customWallpaperUrl) {
    shell.style.background = 'url(' + CSS.escape(customWallpaperUrl) + ') center/cover no-repeat';
  } else {
    shell.style.background = '';
  }
}

function toggleTheme() {
  const current = shellState.preferences.theme || 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  shellState.preferences.theme = next;
  applyPreferences();
  persistShellState();
}

async function uploadCustomWallpaper(file) {
  if (!file || !file.type.startsWith('image/')) {
    setFeedback(fileReadStatus, 'Choose an image file.', 'error');
    return;
  }
  try {
    const buffer = await file.arrayBuffer();
    const response = await fetch('/api/local-data/wallpaper', {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-aios-filename': file.name
      },
      body: buffer
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || 'Upload failed');
    shellState.preferences.customWallpaper = payload.filename;
    customWallpaperUrl = payload.url;
    shellState.preferences.wallpaper = 'custom';
    applyPreferences();
    persistShellState();
  } catch (error) {
    setFeedback(fileReadStatus, error.message, 'error');
  }
}

function initWindowDrag(windowEl) {
  const titlebar = windowEl.querySelector('.window-titlebar');
  if (!titlebar) return;

  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let lastX = 0;
  let lastY = 0;
  let dragFrame = 0;
  let dragging = false;

  function moveWindow(event) {
    if (!dragging) return;
    const canvasRect = desktopCanvas.getBoundingClientRect();
    const bounds = safeWindowBounds(windowEl);
    const nextX = clamp(originX + (event.clientX - startX) - canvasRect.left, 8, bounds.maxLeft);
    const nextY = clamp(originY + (event.clientY - startY) - canvasRect.top, 8, bounds.maxTop);
    lastX = Math.round(nextX);
    lastY = Math.round(nextY);

    if (!dragFrame) {
      dragFrame = requestAnimationFrame(() => {
        const tx = lastX - initialLeft;
        const ty = lastY - initialTop;
        windowEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        dragFrame = 0;
      });
    }
    event.preventDefault();
  }

  function finishDrag(event) {
    if (!dragging) return;
    dragging = false;
    if (dragFrame) {
      cancelAnimationFrame(dragFrame);
      dragFrame = 0;
    }
    windowEl.style.transform = '';
    windowEl.style.left = `${lastX}px`;
    windowEl.style.top = `${lastY}px`;
    windowEl.classList.remove('dragging');

    if (event.type === 'mouseup' && shellState.preferences.edgeSnapping !== false) {
      windowEl.classList.remove('snapped-left', 'snapped-right', 'maximized');
      if (event.clientX < 20) {
        windowEl.classList.add('snapped-left');
      } else if (event.clientX > window.innerWidth - 20) {
        windowEl.classList.add('snapped-right');
      }
    }

    recordWindowState(windowEl.dataset.app, { left: lastX, top: lastY });
    window.removeEventListener('mousemove', moveWindow);
    window.removeEventListener('mouseup', finishDrag);
    window.removeEventListener('blur', finishDrag);
  }

  titlebar.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.target.closest('button, input, select, textarea, a')) return;

    if (windowEl.classList.contains('maximized') || windowEl.classList.contains('snapped-left') || windowEl.classList.contains('snapped-right')) {
      windowEl.classList.remove('maximized', 'snapped-left', 'snapped-right');
      const rect = windowEl.getBoundingClientRect();
      const canvasRect = desktopCanvas.getBoundingClientRect();
      windowEl.style.left = `${Math.round(event.clientX - canvasRect.left - (rect.width / 2))}px`;
    }

    dragging = true;
    focusWindow(windowEl.dataset.app);
    startX = event.clientX;
    startY = event.clientY;
    const rect = windowEl.getBoundingClientRect();
    const canvasRect = desktopCanvas.getBoundingClientRect();
    originX = rect.left;
    originY = rect.top;
    initialLeft = Math.round(originX - canvasRect.left);
    initialTop = Math.round(originY - canvasRect.top);
    lastX = initialLeft;
    lastY = initialTop;
    windowEl.classList.add('dragging');
    window.addEventListener('mousemove', moveWindow);
    window.addEventListener('mouseup', finishDrag);
    window.addEventListener('blur', finishDrag, { once: true });
    event.preventDefault();
  });

  titlebar.addEventListener('dblclick', (event) => {
    if (event.target.closest('button, input, select, textarea, a')) return;
    toggleWindowFullscreen(windowEl.dataset.app);
  });
}

function setWindowMode(app, mode) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;
  windowEl.classList.remove('snapped-left', 'snapped-right', 'maximized');
  if (mode === 'left') windowEl.classList.add('snapped-left');
  if (mode === 'right') windowEl.classList.add('snapped-right');
  if (mode === 'full') windowEl.classList.add('maximized');
  focusWindow(app);
  recordWindowState(app, { open: true, minimized: false });
}

function toggleWindowFullscreen(app) {
  const windowEl = document.getElementById(WINDOW_IDS[app]);
  if (!windowEl) return;
  const isFullscreen = windowEl.classList.contains('maximized');
  setWindowMode(app, isFullscreen ? 'normal' : 'full');
}

function activeWindowApp() {
  if (focusedApp && WINDOW_IDS[focusedApp]) return focusedApp;
  const focused = document.querySelector('.app-window.focused:not(.hidden)');
  return focused?.dataset.app || null;
}

async function loadShellState() {
  try {
    const response = await fetch('/api/local-data/shell-state');
    const payload = await response.json();
    if (response.ok && payload.ok) {
      shellState = {
        windows: payload.state.windows || {},
        preferences: payload.state.preferences || {},
        browserHistory: Array.isArray(payload.state.browserHistory) ? payload.state.browserHistory : [],
        bookmarks: Array.isArray(payload.state.bookmarks) ? payload.state.bookmarks : [],
        downloads: Array.isArray(payload.state.downloads) ? payload.state.downloads : [],
        browserTabs: Array.isArray(payload.state.browserTabs) ? payload.state.browserTabs : [],
        activeBrowserTab: payload.state.activeBrowserTab || null,
        editorTabs: Array.isArray(payload.state.editorTabs) ? payload.state.editorTabs : [],
        activeEditorTab: payload.state.activeEditorTab || null,
        notifications: Array.isArray(payload.state.notifications) ? payload.state.notifications : [],
        alarms: Array.isArray(payload.state.alarms) ? payload.state.alarms : []
      };
    }
  } catch {
    shellState = { windows: {}, preferences: {}, browserHistory: [], bookmarks: [], downloads: [], browserTabs: [], activeBrowserTab: null, editorTabs: [], activeEditorTab: null, notifications: [], alarms: [] };
  }

  applyPreferences();
  activeSpace = Math.min(SPACE_COUNT, Math.max(1, Number(shellState.preferences.activeSpace) || 1));
  renderBrowserHistoryUi();
  renderBrowserBookmarksUi();
  renderBrowserDownloadsUi();

  // Restore or initialize browser tabs
  const savedBrowserTabs = Array.isArray(shellState.browserTabs) ? shellState.browserTabs : [];
  if (savedBrowserTabs.length > 0) {
    browserTabState.tabs = savedBrowserTabs.map((tab) => ({
      id: tab.id || `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url: tab.url || 'about:blank',
      title: tab.title || '',
      history: Array.isArray(tab.history) ? tab.history : (tab.url ? [tab.url] : []),
      historyIndex: typeof tab.historyIndex === 'number' ? tab.historyIndex : (tab.url ? 0 : -1),
      embedFriendly: Boolean(tab.embedFriendly)
    }));
    browserTabState.activeTabId = shellState.activeBrowserTab || browserTabState.tabs[0]?.id;
  } else {
    createBrowserTab('about:blank', { activate: true });
  }
  renderBrowserTabs();
  if (browserTabState.activeTabId) {
    activateBrowserTab(browserTabState.activeTabId);
  }

  // Restore or initialize editor tabs
  const savedEditorTabs = Array.isArray(shellState.editorTabs) ? shellState.editorTabs : [];
  if (savedEditorTabs.length > 0) {
    editorTabState.tabs = savedEditorTabs.map((tab) => ({
      id: tab.id || `ed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      path: tab.path || '',
      title: tab.title || 'Untitled',
      content: tab.content || '',
      saved: true,
      scrollTop: 0
    }));
    editorTabState.activeTabId = shellState.activeEditorTab || editorTabState.tabs[0]?.id;
  } else {
    createEditorTab();
  }
  renderEditorTabs();
  if (editorTabState.activeTabId) {
    loadEditorTab(editorTabState.activeTabId);
  }

  Object.entries(WINDOW_IDS).forEach(([app, id]) => {
    const windowEl = document.getElementById(id);
    const state = shellState.windows?.[app] || {};
    if (typeof state.left === 'number') windowEl.style.left = `${state.left}px`;
    if (typeof state.top === 'number') windowEl.style.top = `${state.top}px`;
    if (typeof state.width === 'number' && state.width >= 320) windowEl.style.width = `${state.width}px`;
    if (typeof state.height === 'number' && state.height >= 200) windowEl.style.height = `${state.height}px`;
    if (state.open === false || state.minimized) {
      windowEl.classList.add('hidden');
    }
  });

  if (![...document.querySelectorAll('.app-window')].some((node) => !node.classList.contains('hidden'))) {
    openWindow('chat');
  } else {
    Object.entries(WINDOW_IDS).forEach(([app, id]) => {
      if (!document.getElementById(id)?.classList.contains('hidden')) {
        normalizeWindowPosition(app, { save: true });
        // Record windows visible by default so Spaces tracks them.
        const state = shellState.windows?.[app] || {};
        if (state.open === undefined) {
          recordWindowState(app, { open: true, minimized: false, space: activeSpace });
        }
      }
    });
    focusWindow('chat');
  }
  refreshSpaceVisibility();
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
      providerSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    right.appendChild(status);
    right.appendChild(document.createTextNode(' '));
    right.appendChild(button);
    row.appendChild(left);
    row.appendChild(right);
    groups.get(provider.category).appendChild(row);
  });
}

function renderChatModelSelect() {
  const currentSelection = chatModelSelect.value;
  chatModelSelect.innerHTML = '';

  const groups = new Map();
  let hasUsable = false;

  providers.forEach((provider) => {
    if (!isProviderUsable(provider) || !provider.models?.length) return;
    hasUsable = true;

    if (!groups.has(provider.category)) {
      const group = document.createElement('optgroup');
      group.label = provider.category;
      groups.set(provider.category, group);
      chatModelSelect.appendChild(group);
    }

    provider.models.forEach((model) => {
      const option = document.createElement('option');
      option.value = `${provider.id}|${model}`;
      const modelName = model.replace(/^github-copilot\//, '');
      option.textContent = `${provider.name} - ${modelName}`;
      groups.get(provider.category).appendChild(option);
    });
  });

  if (!hasUsable) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No providers configured';
    chatModelSelect.appendChild(option);
    updateProviderStatusBadge();
    return;
  }

  const preferredProvider = providers.find((provider) => provider.id === shellState.preferences?.providerId);
  const preferredModel = preferredModelForProvider(preferredProvider);
  const preferredSelection = preferredProvider && preferredModel
    ? `${preferredProvider.id}|${preferredModel}`
    : '';
  const availableSelections = Array.from(chatModelSelect.options, (option) => option.value);
  chatModelSelect.value = [preferredSelection, currentSelection]
    .find((selection) => selection && availableSelections.includes(selection))
    || availableSelections.find(Boolean)
    || '';
  updateProviderStatusBadge();
}

function updateProviderStatusBadge() {
  if (!providerStatusBadge) return;
  const [providerId, model] = (chatModelSelect.value || '').split('|');
  const provider = providers.find(p => p.id === providerId);
  if (provider) {
    providerStatusBadge.textContent = `Provider: ${provider.name}`;
  } else {
    providerStatusBadge.textContent = 'Provider: none';
  }
}

function updateModelOptions() {
  const provider = selectedProvider();
  const models = provider?.models || [];
  selectValidModel(modelSelect, models, preferredModelForProvider(provider, modelSelect.value));

  providerBaseUrlInput.value = provider?.effectiveBaseUrl || '';
  providerApiKeyInput.value = '';
  providerApiSecretInput.value = '';
  providerApiKeyInput.placeholder = provider?.hasStoredApiKey ? 'Stored key is configured' : 'sk-...';
  providerApiSecretInput.placeholder = provider?.hasStoredApiSecret ? 'Stored secret is configured' : 'secret';

  renderAuthState(provider);
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

  const nextProviderId = chooseDefaultProviderId(currentProvider);
  if (nextProviderId) providerSelect.value = nextProviderId;

  const provider = selectedProvider();
  selectValidModel(modelSelect, provider?.models || [], preferredModelForProvider(provider, currentModel));
  renderAuthState(provider);
  renderProviderSetupList();
  renderChatModelSelect();
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
  if (providerSettingsStatus) {
    setFeedback(providerSettingsStatus, `${targetProvider.name} settings saved.`, 'success');
  }
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
  if (providerSettingsStatus) {
    setFeedback(providerSettingsStatus, `${provider.name} settings cleared.`, 'success');
  }
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
  persistProviderChoice(selected, wizardModelSelect.value);
  renderAuthState(selected);
  await loadProviders();

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

  if (!payload.completed || !isProviderUsable(selectedProvider())) {
    openWizard();
    if (payload.completed) {
      renderMessage('system', 'Setup Assistant reopened because no usable provider is selected. Your saved GitHub login/API keys were not cleared.');
    }
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
  if (result.processId) parts.push(`AIOS process: ${result.processId}`);
  if (result.stdout) parts.push(`stdout:\n${result.stdout}`);
  if (result.stderr) parts.push(`stderr:\n${result.stderr}`);
  if (result.timedOut) parts.push('Command timed out.');
  return parts.join('\n\n');
}

function formatRuntimeMode(runtime) {
  if (!runtime) return 'unavailable';
  return `${runtime.mode}${runtime.localOnly ? ' • local-only' : ''}`;
}

function renderProcessList(processes = []) {
  if (!processList) return;
  processList.innerHTML = '';

  if (processes.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'process-empty';
    empty.textContent = 'No AIOS processes yet.';
    processList.appendChild(empty);
    return;
  }

  processes.slice(0, 8).forEach((process) => {
    const item = document.createElement('li');
    item.className = 'process-item';
    item.dataset.status = process.status;

    const title = document.createElement('strong');
    title.textContent = process.title || process.type || process.id;

    const meta = document.createElement('small');
    const code = typeof process.code === 'number' ? ` • exit ${process.code}` : '';
    meta.textContent = `${process.status}${code} • ${new Date(process.updatedAt || process.createdAt).toLocaleTimeString()}`;

    item.appendChild(title);
    item.appendChild(meta);
    processList.appendChild(item);
  });
}

async function loadProcesses() {
  const response = await fetch('/api/processes');
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to load AIOS processes.');
  }

  renderProcessList(payload.processes || []);
  return payload.processes || [];
}

async function loadRuntimeInfo() {
  try {
    const response = await fetch('/api/runtime');
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || 'Failed to load AIOS runtime.');
    }

    const runtime = payload.runtime;
    runtimeBadge.textContent = runtime.localOnly ? 'AIOS: local' : 'AIOS: network';
    runtimeModeValue.textContent = formatRuntimeMode(runtime);
    runtimeUrlValue.textContent = runtime.displayUrl;
    runtimeWorkspaceValue.textContent = runtime.workspaceRoot;
    runtimeExecValue.textContent = runtime.exec.enabled ? 'enabled' : 'disabled';
    runtimeProcessCountValue.textContent = `${runtime.processes.running} running / ${runtime.processes.total} total`;
    await loadProcesses();
  } catch (error) {
    runtimeBadge.textContent = 'AIOS: offline';
    runtimeModeValue.textContent = 'unavailable';
    runtimeUrlValue.textContent = 'unavailable';
    runtimeWorkspaceValue.textContent = 'unavailable';
    runtimeExecValue.textContent = 'unavailable';
    runtimeProcessCountValue.textContent = 'unavailable';
    renderProcessList([]);
  }
}

function renderInstalledApps() {
  thirdPartyAppsGrid.innerHTML = '';

  if (installedApps.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'status-text app-empty-state';
    empty.textContent = 'No third-party apps installed yet.';
    thirdPartyAppsGrid.appendChild(empty);
    return;
  }

  installedApps.forEach((app) => {
    const card = document.createElement('article');
    card.className = 'app-launch-card third-party-app-card';

    const glyph = document.createElement('span');
    glyph.className = 'app-launch-icon';
    glyph.textContent = app.glyph || appGlyphFromName(app.name);

    const title = document.createElement('strong');
    title.textContent = app.name;

    const url = document.createElement('small');
    url.textContent = app.description || app.url;

    const actions = document.createElement('div');
    actions.className = 'third-party-app-actions';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.textContent = 'Open';
    openButton.addEventListener('click', () => openBrowserUrl(app.url));

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'secondary';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeInstalledApp(app.id).catch((error) => setFeedback(installAppStatus, error.message, 'error'));
    });

    actions.appendChild(openButton);
    actions.appendChild(removeButton);
    card.appendChild(glyph);
    card.appendChild(title);
    card.appendChild(url);
    card.appendChild(actions);
    thirdPartyAppsGrid.appendChild(card);
  });
}

async function loadInstalledApps() {
  const response = await fetch('/api/apps');
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to load installed apps.');
  }

  installedApps = payload.apps || [];
  renderInstalledApps();
  renderAppStore();
}

async function installThirdPartyApp({ name, url, glyph }) {
  return installAppManifest({
    name,
    url,
    glyph
  });
}

function readWebAppManifest(value) {
  const manifest = value && typeof value === 'object' ? value : {};
  const app = manifest.app && typeof manifest.app === 'object' ? manifest.app : manifest;
  return {
    name: app.name,
    short_name: app.short_name,
    url: app.url || app.start_url || app.startUrl,
    glyph: app.glyph || app.iconText || app.short_name,
    description: app.description,
    manifestUrl: app.manifestUrl
  };
}

async function installAppManifest(manifest) {
  const appManifest = readWebAppManifest(manifest);
  const response = await fetch('/api/apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appManifest)
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to install app.');
  }

  installAppName.value = '';
  installAppUrl.value = '';
  installAppGlyph.value = '';
  if (installAppManifestFile) installAppManifestFile.value = '';
  setFeedback(installAppStatus, `${payload.app.name} installed.`, 'success');
  await loadInstalledApps();
}

async function installSelectedManifestFile() {
  const file = installAppManifestFile.files?.[0];
  if (!file) {
    setFeedback(installAppStatus, 'Choose a manifest.webmanifest or manifest.json file first.', 'error');
    return;
  }

  const raw = await file.text();
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch {
    throw new Error('Selected web app manifest file is not valid JSON.');
  }

  await installAppManifest(manifest);
}

async function installFromPwaUrl() {
  const url = installAppUrl.value.trim();
  if (!url) {
    setFeedback(installAppStatus, 'Enter a website or manifest URL first.', 'error');
    return;
  }

  const response = await fetch('/api/apps/import-web-manifest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to import web app manifest.');
  }

  installAppName.value = '';
  installAppUrl.value = '';
  installAppGlyph.value = '';
  setFeedback(installAppStatus, `${payload.app.name} installed from Web App Manifest.`, 'success');
  await loadInstalledApps();
}

async function removeInstalledApp(appId) {
  const response = await fetch(`/api/apps/${encodeURIComponent(appId)}`, { method: 'DELETE' });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to remove app.');
  }

  setFeedback(installAppStatus, 'App removed.', 'success');
  await loadInstalledApps();
}

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function renderLinuxPackages() {
  linuxPackagesGrid.innerHTML = '';

  if (linuxPackages.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'status-text app-empty-state';
    empty.textContent = 'No Linux packages imported yet.';
    linuxPackagesGrid.appendChild(empty);
    return;
  }

  linuxPackages.forEach((linuxPackage) => {
    const card = document.createElement('article');
    card.className = 'app-launch-card third-party-app-card';

    const glyph = document.createElement('span');
    glyph.className = 'app-launch-icon';
    glyph.textContent = 'LX';

    const title = document.createElement('strong');
    title.textContent = linuxPackage.name;

    const detail = document.createElement('small');
    detail.textContent = `${linuxPackage.filename} • ${formatBytes(linuxPackage.sizeBytes)} • ready for Linux runtime`;

    const actions = document.createElement('div');
    actions.className = 'third-party-app-actions';

    const runButton = document.createElement('button');
    runButton.type = 'button';
    runButton.textContent = 'Run';
    runButton.addEventListener('click', () => {
      runLinuxPackage(linuxPackage.id, { name: linuxPackage.name, glyph: 'LX' }).catch((error) => setFeedback(linuxPackageStatus, error.message, 'error'));
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'secondary';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeLinuxPackage(linuxPackage.id).catch((error) => setFeedback(linuxPackageStatus, error.message, 'error'));
    });

    actions.appendChild(runButton);
    actions.appendChild(removeButton);
    card.appendChild(glyph);
    card.appendChild(title);
    card.appendChild(detail);
    card.appendChild(actions);
    linuxPackagesGrid.appendChild(card);
  });
}

async function runLinuxPackage(packageId, packageInfo = {}) {
  setFeedback(linuxPackageStatus, 'Starting Linux package...', 'info');
  pendingTerminalLaunch = { packageId, name: packageInfo.name, glyph: packageInfo.glyph };
  openWindow('terminal');
  setFeedback(
    linuxPackageStatus,
    `${packageInfo.name || 'Linux app'} started in Terminal window.`,
    'success'
  );
  await loadProcesses();
  await loadRuntimeInfo();
}

async function loadLinuxPackages() {
  const response = await fetch('/api/linux-apps');
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to load Linux packages.');
  }

  linuxPackages = payload.packages || [];
  renderLinuxPackages();
  renderAppStore();
}

async function installSelectedLinuxPackage() {
  const file = linuxPackageFile.files?.[0];
  if (!file) {
    setFeedback(linuxPackageStatus, 'Choose a .tar.gz, .tgz, or .tar file first.', 'error');
    return;
  }

  const response = await fetch('/api/linux-apps', {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'x-aios-package-name': file.name.replace(/\.tar\.gz$|\.tgz$|\.tar$/i, ''),
      'x-aios-package-filename': file.name
    },
    body: file
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to import Linux package.');
  }

  linuxPackageFile.value = '';
  setFeedback(linuxPackageStatus, `${payload.package.name} imported. Linux runtime required before it can run.`, 'success');
  await loadLinuxPackages();
}

async function downloadLinuxPackageFromUrl() {
  const url = linuxPackageUrl.value.trim();
  if (!url) {
    setFeedback(linuxPackageStatus, 'Enter a direct .tar.gz, .tgz, or .tar URL first.', 'error');
    return;
  }

  const response = await fetch('/api/linux-apps/import-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to download Linux package.');
  }

  linuxPackageUrl.value = '';
  setFeedback(linuxPackageStatus, `${payload.package.name} downloaded with Linux UA. Linux runtime required before it can run.`, 'success');
  await loadLinuxPackages();
}

async function removeLinuxPackage(packageId) {
  const response = await fetch(`/api/linux-apps/${encodeURIComponent(packageId)}`, { method: 'DELETE' });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Failed to remove Linux package.');
  }

  setFeedback(linuxPackageStatus, 'Linux package removed.', 'success');
  await loadLinuxPackages();
}

// === APP STORE ===
const appStoreGrid = document.getElementById('appStoreGrid');
const appStoreStatus = document.getElementById('appStoreStatus');

const APP_STORE_CATALOG = [
  {
    id: 'store-youtube',
    type: 'web',
    name: 'YouTube',
    glyph: 'YT',
    description: 'Watch videos in the AIOS browser.',
    url: 'https://www.youtube.com'
  },
  {
    id: 'store-github',
    type: 'web',
    name: 'GitHub',
    glyph: 'GH',
    description: 'Browse repos, issues, and pull requests.',
    url: 'https://github.com'
  },
  {
    id: 'store-wikipedia',
    type: 'web',
    name: 'Wikipedia',
    glyph: 'W',
    description: 'The free encyclopedia.',
    url: 'https://www.wikipedia.org'
  },
  {
    id: 'store-maps',
    type: 'web',
    name: 'Google Maps',
    glyph: 'GM',
    description: 'Maps, directions, and places.',
    url: 'https://maps.google.com'
  },
  {
    id: 'store-spotify',
    type: 'web',
    name: 'Spotify',
    glyph: 'SP',
    description: 'Stream music from the web player.',
    url: 'https://open.spotify.com'
  },
  {
    id: 'store-excalidraw',
    type: 'web',
    name: 'Excalidraw',
    glyph: 'EX',
    description: 'Sketch diagrams on a virtual whiteboard.',
    url: 'https://excalidraw.com'
  },
  {
    id: 'store-lazygit',
    type: 'linux',
    name: 'lazygit',
    glyph: 'LG',
    description: 'Terminal UI for git — stage, commit, push.',
    url: 'https://github.com/jesseduffield/lazygit/releases/download/v0.44.1/lazygit_0.44.1_Linux_x86_64.tar.gz'
  },
  {
    id: 'store-bottom',
    type: 'linux',
    name: 'bottom',
    glyph: 'BT',
    description: 'Graphical system/process monitor (like htop).',
    url: 'https://github.com/ClementTsang/bottom/releases/download/0.10.2/bottom_x86_64-unknown-linux-gnu.tar.gz'
  },
  {
    id: 'store-glow',
    type: 'linux',
    name: 'glow',
    glyph: 'GL',
    description: 'Render markdown files beautifully in the terminal.',
    url: 'https://github.com/charmbracelet/glow/releases/download/v2.0.0/glow_2.0.0_Linux_x86_64.tar.gz'
  },
  {
    id: 'store-gdu',
    type: 'linux',
    name: 'gdu',
    glyph: 'DU',
    description: 'Fast disk usage analyzer with console UI.',
    url: 'https://github.com/dundee/gdu/releases/latest/download/gdu_linux_amd64.tgz'
  },
  {
    id: 'store-duf',
    type: 'linux',
    name: 'duf',
    glyph: 'DF',
    description: 'Pretty disk free/usage viewer.',
    url: 'https://github.com/muesli/duf/releases/download/v0.8.1/duf_0.8.1_linux_x86_64.tar.gz'
  },
  {
    id: 'store-lf',
    type: 'linux',
    name: 'lf',
    glyph: 'LF',
    description: 'Terminal file manager with vim-style keys.',
    url: 'https://github.com/gokcehan/lf/releases/download/r32/lf-linux-amd64.tar.gz'
  },
  {
    id: 'store-fzf',
    type: 'linux',
    name: 'fzf',
    glyph: 'FZ',
    description: 'Blazing fast fuzzy finder for the terminal.',
    url: 'https://github.com/junegunn/fzf/releases/download/v0.55.0/fzf-0.55.0-linux_amd64.tar.gz'
  }
];

function isStoreEntryInstalled(entry) {
  if (entry.type === 'web') {
    return installedApps.some((app) => (app.url || '').replace(/\/$/, '') === entry.url.replace(/\/$/, ''));
  }
  return linuxPackages.some((pkg) => pkg.name.toLowerCase() === entry.name.toLowerCase());
}

async function installStoreEntry(entry, button) {
  button.disabled = true;
  button.textContent = 'Installing...';
  try {
    if (entry.type === 'web') {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: entry.name, url: entry.url, glyph: entry.glyph, description: entry.description })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `Failed to install ${entry.name}.`);
      }
      await loadInstalledApps();
    } else {
      setFeedback(appStoreStatus, `Downloading ${entry.name}... this can take a moment.`, 'info');
      const response = await fetch('/api/linux-apps/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: entry.url, name: entry.name })
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `Failed to download ${entry.name}.`);
      }
      await loadLinuxPackages();
    }
    setFeedback(appStoreStatus, `${entry.name} installed.`, 'success');
  } catch (error) {
    setFeedback(appStoreStatus, error.message, 'error');
  } finally {
    renderAppStore();
  }
}

function renderAppStore() {
  if (!appStoreGrid) return;
  appStoreGrid.innerHTML = '';

  APP_STORE_CATALOG.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'app-launch-card third-party-app-card';

    const glyph = document.createElement('span');
    glyph.className = 'app-launch-icon';
    glyph.textContent = entry.glyph;

    const title = document.createElement('strong');
    title.textContent = entry.name;

    const badge = document.createElement('span');
    badge.className = `app-store-badge ${entry.type === 'web' ? 'web' : 'linux'}`;
    badge.textContent = entry.type === 'web' ? 'Web app' : 'Linux terminal';

    const detail = document.createElement('small');
    detail.textContent = entry.description;

    const actions = document.createElement('div');
    actions.className = 'third-party-app-actions';

    const installed = isStoreEntryInstalled(entry);
    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.textContent = installed ? 'Installed' : 'Install';
    installButton.disabled = installed;
    if (!installed) {
      installButton.addEventListener('click', () => installStoreEntry(entry, installButton));
    }

    actions.appendChild(installButton);
    card.appendChild(glyph);
    card.appendChild(title);
    card.appendChild(badge);
    card.appendChild(detail);
    card.appendChild(actions);
    appStoreGrid.appendChild(card);
  });
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

async function createWorkspaceFolder(pathValue) {
  const response = await fetch('/api/fs/mkdir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Create folder failed (HTTP ${response.status}).`);
  }
  return payload;
}

async function renameWorkspaceItem(pathValue, name) {
  const response = await fetch('/api/fs/rename', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue, name })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Rename failed (HTTP ${response.status}).`);
  }
  return payload;
}

async function copyWorkspaceItem(pathValue, target) {
  const response = await fetch('/api/fs/copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue, target })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Copy failed (HTTP ${response.status}).`);
  }
  return payload;
}

async function moveWorkspaceItem(pathValue, target) {
  const response = await fetch('/api/fs/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue, target })
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Move failed (HTTP ${response.status}).`);
  }
  return payload;
}

async function uploadWorkspaceFiles(files, directory = filesPathInput.value || '.') {
  const uploads = Array.from(files || []);
  if (!uploads.length) return [];
  const results = [];
  for (const file of uploads) {
    const response = await fetch(`/api/fs/upload?path=${encodeURIComponent(directory || '.')}`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-aios-filename': file.name
      },
      body: file
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || `Upload failed (HTTP ${response.status}).`);
    }
    results.push(payload);
  }
  return results;
}

function joinWorkspacePath(basePath, name) {
  const base = !basePath || basePath === '.' ? '' : basePath.replace(/\/+$/, '');
  return base ? `${base}/${name}` : name;
}

function renderFilesBreadcrumbs(pathValue) {
  if (!filesBreadcrumbs) return;
  filesBreadcrumbs.innerHTML = '';
  const current = pathValue && pathValue !== '.' ? pathValue : '.';
  const rootButton = document.createElement('button');
  rootButton.type = 'button';
  rootButton.textContent = 'Workspace';
  rootButton.addEventListener('click', () => refreshFileList('.'));
  filesBreadcrumbs.appendChild(rootButton);
  if (current === '.') return;
  let acc = '';
  current.split('/').filter(Boolean).forEach((part) => {
    const separator = document.createElement('span');
    separator.textContent = '/';
    filesBreadcrumbs.appendChild(separator);
    acc = acc ? `${acc}/${part}` : part;
    const targetPath = acc;
    const crumb = document.createElement('button');
    crumb.type = 'button';
    crumb.textContent = part;
    crumb.addEventListener('click', () => refreshFileList(targetPath));
    filesBreadcrumbs.appendChild(crumb);
  });
}

async function refreshFileList(pathValue = filesPathInput.value || '.') {
  try {
    const result = await listWorkspace(pathValue);
    filesPathInput.value = result.path || '.';
    renderFilesBreadcrumbs(result.path || '.');
    filesEntries.innerHTML = '';
    const query = (filesSearchInput?.value || '').trim().toLowerCase();
    const sortMode = filesSortSelect?.value || 'name';
    const entries = [...result.entries]
      .filter((entry) => !query || entry.name.toLowerCase().includes(query))
      .sort((a, b) => {
        if (sortMode === 'type' && a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    entries.forEach((entry) => {
      const prefix = result.path === '.' ? '' : `${result.path}/`;
      const entryPath = `${prefix}${entry.name}`;
      const item = document.createElement('li');
      item.className = 'file-entry-row';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'file-entry';
      button.dataset.filePath = entry.type === 'file' ? entryPath : '';
      button.textContent = `${entry.type === 'directory' ? '📁' : '📄'} ${entry.name}`;
      button.addEventListener('click', async () => {
        if (entry.type === 'directory') {
          await refreshFileList(entryPath);
          return;
        }

        try {
          const file = await readWorkspaceFile(entryPath);
          openFileInEditor(file.path);
          setFeedback(fileReadStatus, `Opened ${file.path} in Text Editor`);
        } catch (error) {
          setFeedback(fileReadStatus, error.message, 'error');
        }
      });
      button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        event.stopPropagation();
        showFileContextMenu(event, entry, entryPath);
      });
      item.appendChild(button);

      const renameButton = document.createElement('button');
      renameButton.type = 'button';
      renameButton.className = 'file-entry-action';
      renameButton.title = 'Rename';
      renameButton.setAttribute('aria-label', `Rename ${entry.name}`);
      renameButton.textContent = '✎';
      renameButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        const name = window.prompt('Rename to:', entry.name);
        if (!name || name === entry.name) return;
        try {
          await renameWorkspaceItem(entryPath, name);
          await refreshFileList(result.path);
          setFeedback(fileReadStatus, `Renamed ${entry.name} to ${name}`);
        } catch (error) {
          setFeedback(fileReadStatus, error.message, 'error');
        }
      });
      item.appendChild(renameButton);

      if (entry.type === 'file') {
        const previewButton = document.createElement('button');
        previewButton.type = 'button';
        previewButton.className = 'file-entry-action';
        previewButton.title = 'Quick Look (Space)';
        previewButton.setAttribute('aria-label', `Quick Look ${entry.name}`);
        previewButton.textContent = '👁';
        previewButton.addEventListener('click', (event) => {
          event.stopPropagation();
          openQuickLook(entryPath);
        });
        item.appendChild(previewButton);
      }

      const trashButton = document.createElement('button');
      trashButton.type = 'button';
      trashButton.className = 'file-entry-action';
      trashButton.title = 'Move to Trash';
      trashButton.setAttribute('aria-label', `Move ${entry.name} to Trash`);
      trashButton.textContent = '🗑';
      trashButton.addEventListener('click', (event) => {
        event.stopPropagation();
        moveFileToTrash(entryPath).catch((error) => setFeedback(fileReadStatus, error.message, 'error'));
      });
      item.appendChild(trashButton);
      filesEntries.appendChild(item);
    });
    setFeedback(fileReadStatus, `Listed ${result.path} (${entries.length} shown)`);
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

function syncDefaultChatModel() {
  persistProviderChoice(selectedProvider(), modelSelect.value);
  renderChatModelSelect();
}

providerSelect.addEventListener('change', () => {
  updateModelOptions();
  syncDefaultChatModel();
});
modelSelect.addEventListener('change', syncDefaultChatModel);

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
refreshRuntimeButton.addEventListener('click', () => {
  loadRuntimeInfo().catch((error) => renderMessage('system', `Runtime refresh failed: ${error.message}`));
});
openSetupAssistant.addEventListener('click', openWizard);
newChatButton.addEventListener('click', () => startNewChat());

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

browserToolbar.addEventListener('submit', (event) => {
  event.preventDefault();
  openBrowserUrl(browserUrlInput.value);
});

browserBackButton.addEventListener('click', () => navigateBrowserHistory(-1));
browserForwardButton.addEventListener('click', () => navigateBrowserHistory(1));
browserRefreshButton.addEventListener('click', refreshBrowserUrl);
browserOpenExternalButton.addEventListener('click', openCurrentBrowserUrlExternally);
browserNoticeExternalButton.addEventListener('click', openCurrentBrowserUrlExternally);
if (browserNewTabButton) {
  browserNewTabButton.addEventListener('click', () => createBrowserTab('about:blank', { activate: true }));
}
if (browserBookmarkButton) {
  browserBookmarkButton.addEventListener('click', () => {
    toggleBrowserBookmarksPanel();
  });
}
if (browserAddBookmarkButton) {
  browserAddBookmarkButton.addEventListener('click', () => addBookmark());
}
if (browserHistoryButton) {
  browserHistoryButton.addEventListener('click', () => {
    const wasHidden = browserHistoryPanel.classList.contains('hidden');
    hideBrowserPanels();
    if (wasHidden) {
      browserHistoryPanel.classList.remove('hidden');
      renderBrowserHistoryUi();
    }
  });
}
if (browserHistoryClearButton) {
  browserHistoryClearButton.addEventListener('click', () => {
    shellState.browserHistory = [];
    persistShellState();
    renderBrowserHistoryUi();
  });
}
if (browserDownloadsButton) {
  browserDownloadsButton.addEventListener('click', toggleBrowserDownloadsPanel);
}
if (browserDownloadsClearButton) {
  browserDownloadsClearButton.addEventListener('click', () => {
    shellState.downloads = [];
    persistShellState();
    renderBrowserDownloadsUi();
  });
}
browserUrlInput.addEventListener('focus', () => browserUrlInput.select());
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    openWindow('browser');
    browserUrlInput.focus();
    browserUrlInput.select();
  }
  if ((event.metaKey || event.ctrlKey) && event.code === 'Space' && !event.shiftKey) {
    event.preventDefault();
    if (spotlightOverlay?.classList.contains('hidden')) {
      openSpotlight();
    } else {
      closeSpotlight();
    }
  }
  if (event.key === 'Escape' && spotlightOverlay && !spotlightOverlay.classList.contains('hidden')) {
    closeSpotlight();
  }
  if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === '3') {
    event.preventDefault();
    takeScreenshot();
  }
  if (event.ctrlKey && event.key === 'ArrowUp' && !event.metaKey) {
    event.preventDefault();
    toggleMissionControl();
  }
  if (event.ctrlKey && event.metaKey && event.key.toLowerCase() === 'q') {
    event.preventDefault();
    lockScreenNow();
  }
  if (event.ctrlKey && event.metaKey && event.key === 'ArrowLeft') {
    const app = activeWindowApp();
    if (app) {
      event.preventDefault();
      setWindowMode(app, 'left');
    }
  }
  if (event.ctrlKey && event.metaKey && event.key === 'ArrowRight') {
    const app = activeWindowApp();
    if (app) {
      event.preventDefault();
      setWindowMode(app, 'right');
    }
  }
  if (event.ctrlKey && event.metaKey && event.key.toLowerCase() === 'f') {
    const app = activeWindowApp();
    if (app) {
      event.preventDefault();
      toggleWindowFullscreen(app);
    }
  }
  if (event.key === ' ' && document.activeElement?.classList?.contains('file-entry') && document.activeElement.dataset.filePath) {
    event.preventDefault();
    openQuickLook(document.activeElement.dataset.filePath);
  }
  if (event.key === 'Escape') {
    if (!quickLookOverlay.classList.contains('hidden')) closeQuickLook();
    if (!missionControlOverlay.classList.contains('hidden')) toggleMissionControl(false);
    hideContextMenu();
  }
});
browserTryEmbedButton.addEventListener('click', () => openBrowserUrl(currentBrowserUrl || browserUrlInput.value, {
  forceEmbed: true,
  recordHistory: false
}));
if (browserWebview) {
  browserWebview.addEventListener('dom-ready', () => {
    browserWebviewReady = true;
    while (browserWebviewReadyQueue.length > 0) {
      const cb = browserWebviewReadyQueue.shift();
      try {
        cb();
      } catch (error) {
        console.error('Error in webview ready callback:', error);
      }
    }
  });
  browserWebview.addEventListener('did-start-loading', () => {
    hideBrowserBlockedNotice();
    updateBrowserNavigationControls();
  });
  browserWebview.addEventListener('did-navigate', (event) => {
    currentBrowserUrl = event.url;
    browserUrlInput.value = event.url;
    updateActiveTabFromNavigation(event.url);
    recordBrowserVisit(event.url);
    updateBookmarkButton();
    updateBrowserNavigationControls();
  });
  browserWebview.addEventListener('did-navigate-in-page', (event) => {
    currentBrowserUrl = event.url;
    browserUrlInput.value = event.url;
    updateActiveTabFromNavigation(event.url);
    recordBrowserVisit(event.url);
    updateBookmarkButton();
    updateBrowserNavigationControls();
  });
  browserWebview.addEventListener('page-title-updated', (event) => {
    const tab = getActiveBrowserTab();
    if (tab) {
      tab.title = event.title || tab.title;
      renderBrowserTabs();
    }
    updateBrowserVisitTitle(currentBrowserUrl, event.title || '');
  });
  browserWebview.addEventListener('did-stop-loading', updateBrowserNavigationControls);
  browserWebview.addEventListener('new-window', (event) => {
    const popupUrl = event.url;
    if (popupUrl) {
      openBrowserUrl(popupUrl);
    }
  });
}
if (window.aiosNative?.onBrowserNavigate) {
  // Popups and target=_blank links from the desktop runtime stay inside the
  // AIOS browser window instead of spawning separate native windows.
  window.aiosNative.onBrowserNavigate((url) => {
    if (url) openBrowserUrl(url);
  });
}

if (window.aiosNative?.onDownloadUpdate) {
  window.aiosNative.onDownloadUpdate((payload) => {
    recordDownload({
      id: payload.id,
      filename: payload.filename,
      url: payload.url,
      state: payload.state,
      path: payload.path,
      received: payload.received,
      total: payload.total,
      done: payload.done,
      at: new Date().toISOString()
    });
  });
}

async function takeScreenshot() {
  if (!window.aiosNative?.takeScreenshot) {
    renderMessage('system', 'Screenshots require the AIOS desktop runtime. Start with npm start.');
    return;
  }
  try {
    const result = await window.aiosNative.takeScreenshot();
    if (!result.ok) throw new Error(result.error);
    recordDownload({
      id: `screenshot-${Date.now()}`,
      filename: result.filename,
      url: 'aios://screenshot',
      state: 'completed',
      path: result.relativePath,
      done: true,
      at: new Date().toISOString()
    });
    openFileInEditor(result.relativePath);
    renderMessage('system', `Screenshot saved to ${result.relativePath}`);
  } catch (error) {
    renderMessage('system', `Screenshot failed: ${error.message}`);
  }
}
browserFrame.addEventListener('load', () => {
  if (browserLoadTimer) {
    clearTimeout(browserLoadTimer);
    browserLoadTimer = null;
  }
  if (!browserExternalPage.classList.contains('hidden')) {
    return;
  }
  if (!browserFrameEmbedFriendly && hostLikelyBlocksEmbedding(currentBrowserUrl)) {
    showBrowserBlockedNotice(currentBrowserUrl);
  }
});
updateBrowserNavigationControls();

chatModelSelect.addEventListener('change', () => {
  const [providerId, model] = (chatModelSelect.value || '').split('|');
  const provider = providers.find(p => p.id === providerId);
  if (provider) persistProviderChoice(provider, model);
  updateProviderStatusBadge();
});

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const [providerId, model] = (chatModelSelect.value || '').split('|');
  const provider = providers.find(p => p.id === providerId);
  
  if (!provider || !model) {
    renderMessage('system', 'No chat provider selected or configured.');
    return;
  }

  renderMessage('user', text);
  messageInput.value = '';

  try {
    chatHistory.push({ role: 'user', content: text });
    trimChatHistory();

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
    trimChatHistory();
    renderMessage('assistant', assistantText);
    saveCurrentConversation({ provider: provider.id, model });
  } catch (error) {
    renderMessage('system', `System error: ${error.message}`);
  }
});

let commandHistory = [];
let historyIndex = -1;

if (terminalCommandInput && terminalRunButton && terminalOutput) {
  terminalCommandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      terminalRunButton.click();
    } else if (event.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalCommandInput.value = commandHistory[historyIndex];
        event.preventDefault();
      }
    } else if (event.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalCommandInput.value = commandHistory[historyIndex];
        event.preventDefault();
      } else {
        historyIndex = commandHistory.length;
        terminalCommandInput.value = '';
        event.preventDefault();
      }
    }
  });

  terminalRunButton.addEventListener('click', async () => {
    const command = terminalCommandInput.value.trim();
    if (!command) return;

    if (commandHistory[commandHistory.length - 1] !== command) {
      commandHistory.push(command);
    }
    historyIndex = commandHistory.length;
    terminalCommandInput.value = '';

    terminalOutput.textContent += `\n$ ${command}\n`;
    try {
      const result = await callExec(command);
      terminalOutput.textContent += `${formatExecResult(result)}\n`;
      loadRuntimeInfo().catch(() => {});
    } catch (error) {
      terminalOutput.textContent += `Error: ${error.message}\n`;
      loadRuntimeInfo().catch(() => {});
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });
}

filesRefreshButton.addEventListener('click', () => refreshFileList(filesPathInput.value || '.'));
filesUpButton.addEventListener('click', () => refreshFileList(formatPathUp(filesPathInput.value)));
filesPathInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') refreshFileList(filesPathInput.value || '.');
});
if (filesSearchInput) {
  filesSearchInput.addEventListener('input', () => refreshFileList(filesPathInput.value || '.'));
}
if (filesSortSelect) {
  filesSortSelect.addEventListener('change', () => refreshFileList(filesPathInput.value || '.'));
}
if (filesNewFolderButton) {
  filesNewFolderButton.addEventListener('click', async () => {
    const name = window.prompt('New folder name:');
    if (!name) return;
    try {
      const target = joinWorkspacePath(filesPathInput.value || '.', name);
      await createWorkspaceFolder(target);
      await refreshFileList(filesPathInput.value || '.');
      setFeedback(fileReadStatus, `Created folder ${name}`, 'success');
    } catch (error) {
      setFeedback(fileReadStatus, error.message, 'error');
    }
  });
}
if (filesUploadButton && filesUploadInput) {
  filesUploadButton.addEventListener('click', () => filesUploadInput.click());
  filesUploadInput.addEventListener('change', async () => {
    try {
      const uploaded = await uploadWorkspaceFiles(filesUploadInput.files, filesPathInput.value || '.');
      filesUploadInput.value = '';
      await refreshFileList(filesPathInput.value || '.');
      setFeedback(fileReadStatus, `Uploaded ${uploaded.length} file${uploaded.length === 1 ? '' : 's'}`, 'success');
    } catch (error) {
      setFeedback(fileReadStatus, error.message, 'error');
    }
  });
}
if (filesEntries) {
  filesEntries.addEventListener('dragover', (event) => {
    if (event.dataTransfer?.types?.includes('Files')) {
      event.preventDefault();
      filesEntries.classList.add('drag-over');
    }
  });
  filesEntries.addEventListener('dragleave', () => filesEntries.classList.remove('drag-over'));
  filesEntries.addEventListener('drop', async (event) => {
    if (!event.dataTransfer?.files?.length) return;
    event.preventDefault();
    filesEntries.classList.remove('drag-over');
    try {
      const uploaded = await uploadWorkspaceFiles(event.dataTransfer.files, filesPathInput.value || '.');
      await refreshFileList(filesPathInput.value || '.');
      setFeedback(fileReadStatus, `Uploaded ${uploaded.length} dropped file${uploaded.length === 1 ? '' : 's'}`, 'success');
    } catch (error) {
      setFeedback(fileReadStatus, error.message, 'error');
    }
  });
}
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

if (wallpaperGrid) {
  wallpaperGrid.addEventListener('click', (event) => {
    const thumb = event.target.closest('.wallpaper-thumb');
    if (!thumb) return;
    if (thumb.dataset.wallpaper === 'custom') {
      wallpaperFileInput?.click();
      return;
    }
    shellState.preferences.wallpaper = thumb.dataset.wallpaper;
    applyPreferences();
    persistShellState();
  });
}

themeSelect.addEventListener('change', () => {
  shellState.preferences.theme = themeSelect.value;
  applyPreferences();
  persistShellState();
});

if (wallpaperUploadButton) {
  wallpaperUploadButton.addEventListener('click', () => wallpaperFileInput?.click());
}
if (wallpaperFileInput) {
  wallpaperFileInput.addEventListener('change', () => {
    const file = wallpaperFileInput.files?.[0];
    if (file) uploadCustomWallpaper(file);
  });
}

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', toggleTheme);
}

const TIPS = {
  screenshots: {
    glyph: '📸',
    category: 'Featured',
    title: 'Take a screenshot',
    body: '<p>Press <kbd>Shift</kbd> + <kbd>⌘</kbd> + <kbd>3</kbd> to capture the whole screen. Screenshots are saved to <code>workspace/Screenshots</code> and appear in the Browser’s Downloads panel.</p><p>This only works when AIOS is running in desktop mode (<code>npm start</code>), not in a regular browser tab.</p>'
  },
  spotlight: {
    glyph: '🔍',
    category: 'Search',
    title: 'Find anything with Spotlight',
    body: '<p>Press <kbd>⌘</kbd> + <kbd>Space</kbd> to open Spotlight. Type to search apps, files, bookmarks, and browser history. Click any result to open it instantly.</p><p>If <kbd>⌘</kbd> + <kbd>Space</kbd> opens macOS Spotlight instead, use the 🔍 button in the menu bar.</p>'
  },
  browser: {
    glyph: '🌐',
    category: 'Browse',
    title: 'Surf with tabs & bookmarks',
    body: '<p>Type a URL or search term in the Browser address bar. Use tabs to keep multiple sites open. Bookmarks and history are saved across sessions.</p><p>Sites that block embedding (like JD Sports) automatically open in an Electron webview when you run <code>npm start</code>.</p>'
  },
  linux: {
    glyph: '🐧',
    category: 'Power user',
    title: 'Run Linux apps',
    body: '<p>Import .tar.gz Linux packages in the Apps window. AIOS stores them and can run them inside a Docker/Colima container.</p><p>Make sure Colima is running on macOS. The first Linux app run may take a moment while AIOS pulls the Ubuntu image.</p>'
  },
  editor: {
    glyph: '📝',
    category: 'Create',
    title: 'Edit with tabs',
    body: '<p>Open the Text Editor to write notes or code. Use tabs for multiple files. Press <kbd>⌘</kbd> + <kbd>S</kbd> to save, and click the preview button to toggle markdown rendering.</p>'
  },
  theme: {
    glyph: '🎨',
    category: 'Personalize',
    title: 'Make AIOS yours',
    body: '<p>Open Settings to switch between dark and light mode, change the accent color, or pick a wallpaper. You can also upload your own custom wallpaper.</p>'
  },
  settingscenter: {
    glyph: '⚙️',
    category: 'Settings',
    title: 'Tune AIOS from one place',
    body: '<p>Settings is now the AIOS control center. Use it for provider/model setup, runtime details, theme, wallpaper, notification toasts, system-volume sync, startup apps, default Spaces, window snapping, Mission Control, and resetting your lock PIN.</p>'
  },
  windows: {
    glyph: '🪟',
    category: 'Desktop',
    title: 'Master window shortcuts',
    body: '<ul><li><kbd>⌘</kbd> + <kbd>1</kbd>–<kbd>9</kbd> focus dock apps by position</li><li>Drag a window titlebar to move it, or drag to screen edges to snap</li><li><kbd>Ctrl</kbd> + <kbd>⌘</kbd> + <kbd>←</kbd>/<kbd>→</kbd> snaps the focused window</li><li><kbd>Ctrl</kbd> + <kbd>⌘</kbd> + <kbd>F</kbd> toggles fullscreen</li><li>Right-click dock apps for Snap Left, Snap Right, Fullscreen, Close, and Move to Space</li></ul>'
  },
  files: {
    glyph: '📁',
    category: 'Organize',
    title: 'Manage files & downloads',
    body: '<p>Use the Files app to browse your workspace. Downloads from the Browser are saved to <code>workspace/Downloads</code>.</p><ul><li>Use breadcrumbs to jump between folders</li><li>Create folders, upload files, or drag files onto the list</li><li>Search/sort the current folder</li><li>Right-click items to rename, copy, move, Quick Look, or move to Trash</li></ul>'
  },
  menubar: {
    glyph: '🎚️',
    category: 'Menu bar',
    title: 'Control your Mac from the menu bar',
    body: '<p>The right side of the menu bar shows live status: network, battery, volume, and notifications.</p><ul><li>Click 🔊 to open the volume slider — it reads and sets your <strong>Mac’s system volume</strong> when AIOS runs locally</li><li>Click 🔔 to open the notification center; toasts appear under the menu bar</li><li>Click the clock for a mini calendar</li></ul>'
  },
  spaces: {
    glyph: '🖥️',
    category: 'Desktop',
    title: 'Work across Spaces',
    body: '<p>AIOS has three virtual desktops. The dots in the menu bar show which Space you are on — click one to switch.</p><ul><li>Press <kbd>Ctrl</kbd> + <kbd>↑</kbd> or click the grid icon for Mission Control</li><li>Right-click a dock app to move its window to another Space</li><li>New windows open on the current Space</li></ul>'
  },
  lock: {
    glyph: '🔒',
    category: 'Privacy',
    title: 'Lock your desktop',
    body: '<p>Click the 🔒 button in the menu bar or press <kbd>Ctrl</kbd> + <kbd>⌘</kbd> + <kbd>Q</kbd> to lock AIOS. The first time, you will be asked to set a PIN (4+ characters).</p><p>The lock survives reloads — AIOS stays locked until the correct PIN is entered.</p>'
  },
  trash: {
    glyph: '🗑️',
    category: 'Organize',
    title: 'Trash & Quick Look',
    body: '<p>In the Files app, click 🗑 next to any file to move it to the Trash — nothing is deleted permanently until you empty it. Open Trash from the dock to restore or delete items.</p><p>Click 👁 (or select a file and press <kbd>Space</kbd>) for a Quick Look preview of images, audio, video, PDF, and text without opening an app.</p>'
  },
  chathistory: {
    glyph: '💬',
    category: 'AI',
    title: 'Browse your chat history',
    body: '<p>Every AI Chat conversation is saved automatically. Click <strong>History</strong> in the chat titlebar to browse past conversations, reload one to continue where you left off, or delete the ones you no longer need.</p>'
  },
  calendar: {
    glyph: '📅',
    category: 'Productivity',
    title: 'Calendar, timer & alarms',
    body: '<p>Open Calendar from the dock for a month view, a live clock, a countdown timer, and alarms. Alarms fire a notification at the time you set — even while you work in other apps.</p><p>Need a quick date check? Click the clock in the menu bar for a mini calendar.</p>'
  },
  monitor: {
    glyph: '📊',
    category: 'Power user',
    title: 'Watch system activity',
    body: '<p>Activity Monitor shows live CPU load, memory pressure, the AIOS server process, tracked exec processes, and running Linux containers — refreshed every few seconds while the window is open.</p>'
  },
  music: {
    glyph: '🎵',
    category: 'Media',
    title: 'Play your music',
    body: '<p>Open Music from the dock and click <strong>Add Songs</strong> to load local audio files. Use the transport controls to play, seek, and skip. The menu bar volume slider controls playback — and your Mac’s system volume too.</p>'
  }
};

function openTip(id) {
  const tip = TIPS[id];
  if (!tip || !tipsDetailOverlay) return;
  tipsDetailGlyph.textContent = tip.glyph;
  tipsDetailCategory.textContent = tip.category;
  tipsDetailTitle.textContent = tip.title;
  tipsDetailBody.innerHTML = tip.body;
  tipsDetailOverlay.classList.remove('hidden');
}

function closeTip() {
  if (tipsDetailOverlay) tipsDetailOverlay.classList.add('hidden');
}

if (tipsDetailOverlay) {
  document.querySelectorAll('.tips-hero, .tips-card').forEach((el) => {
    el.addEventListener('click', () => openTip(el.dataset.tip));
  });
}

if (tipsDetailClose) {
  tipsDetailClose.addEventListener('click', closeTip);
}

if (tipsDetailOverlay) {
  tipsDetailOverlay.addEventListener('click', (event) => {
    if (event.target === tipsDetailOverlay) closeTip();
  });
}

if (spotlightButton) {
  spotlightButton.addEventListener('click', openSpotlight);
}

if (spotlightOverlay) {
  spotlightOverlay.addEventListener('click', (event) => {
    if (event.target === spotlightOverlay) closeSpotlight();
  });
}

if (spotlightInput) {
  spotlightInput.addEventListener('input', () => renderSpotlightResults(spotlightInput.value).catch(() => {}));
  spotlightInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSpotlight();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSpotlightSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSpotlightSelection(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      activateSpotlightSelection();
    }
  });
}

if (editorNewButton) {
  editorNewButton.addEventListener('click', () => createEditorTab());
}
if (editorOpenButton) {
  editorOpenButton.addEventListener('click', async () => {
    const pathValue = window.prompt('Open file path (relative to workspace):');
    if (pathValue) await openFileInEditor(pathValue);
  });
}
if (editorSaveButton) {
  editorSaveButton.addEventListener('click', saveActiveEditorTab);
}
if (editorTextarea) {
  editorTextarea.addEventListener('input', handleEditorInput);
  editorTextarea.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      saveActiveEditorTab();
    }
  });
}
if (editorPreviewToggle) {
  editorPreviewToggle.addEventListener('change', updateEditorPreview);
}

performanceModeToggle.addEventListener('change', () => {
  shellState.preferences.performanceMode = performanceModeToggle.checked;
  applyPreferences();
  persistShellState();
});

if (settingsSystemVolumeToggle) {
  settingsSystemVolumeToggle.addEventListener('change', () => {
    shellState.preferences.systemVolumeSync = settingsSystemVolumeToggle.checked;
    persistShellState();
    if (settingsSystemVolumeToggle.checked) syncSystemVolume();
    if (settingsStatus) setFeedback(settingsStatus, 'Volume preference saved.', 'success');
  });
}

if (settingsNotificationsToggle) {
  settingsNotificationsToggle.addEventListener('change', () => {
    shellState.preferences.notificationToasts = settingsNotificationsToggle.checked;
    persistShellState();
    if (settingsStatus) setFeedback(settingsStatus, 'Notification preference saved.', 'success');
  });
}

if (settingsDefaultSpaceSelect) {
  settingsDefaultSpaceSelect.addEventListener('change', () => {
    shellState.preferences.defaultSpace = settingsDefaultSpaceSelect.value;
    persistShellState();
    if (settingsStatus) setFeedback(settingsStatus, 'Default Space saved.', 'success');
  });
}

if (settingsSnapToggle) {
  settingsSnapToggle.addEventListener('change', () => {
    shellState.preferences.edgeSnapping = settingsSnapToggle.checked;
    persistShellState();
    if (settingsStatus) setFeedback(settingsStatus, 'Window snapping preference saved.', 'success');
  });
}

if (settingsSaveStartupButton && settingsStartupApps) {
  settingsSaveStartupButton.addEventListener('click', () => {
    shellState.preferences.startupApps = Array.from(settingsStartupApps.selectedOptions).map((option) => option.value);
    persistShellState();
    if (settingsStatus) setFeedback(settingsStatus, 'Startup apps saved.', 'success');
  });
}

if (settingsOpenMissionControlButton) {
  settingsOpenMissionControlButton.addEventListener('click', () => toggleMissionControl(true));
}

if (settingsResetLockButton) {
  settingsResetLockButton.addEventListener('click', () => {
    shellState.preferences.lockPinHash = '';
    shellState.preferences.locked = false;
    persistShellState();
    if (settingsStatus) setFeedback(settingsStatus, 'Lock PIN reset. Lock again to set a new PIN.', 'success');
  });
}

dockAppButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openWindow(button.dataset.openApp);
    if (button.dataset.openApp === 'files') {
      refreshFileList().catch((error) => setFeedback(fileReadStatus, error.message, 'error'));
    }
  });
});

dockItems.forEach((button) => {
  button.addEventListener('pointerenter', () => applyDockHoverState(button));
});

if (dock) {
  dock.addEventListener('pointerleave', clearDockHoverState);
}

document.querySelectorAll('[data-launch-app]').forEach((button) => {
  button.addEventListener('click', () => {
    const app = button.dataset.launchApp;
    openWindow(app);
    if (app === 'files') {
      refreshFileList().catch((error) => setFeedback(fileReadStatus, error.message, 'error'));
    }
  });
});

installAppForm.addEventListener('submit', (event) => {
  event.preventDefault();
  installThirdPartyApp({
    name: installAppName.value,
    url: installAppUrl.value,
    glyph: installAppGlyph.value
  }).catch((error) => setFeedback(installAppStatus, error.message, 'error'));
});

installAppManifestButton.addEventListener('click', () => {
  installSelectedManifestFile().catch((error) => setFeedback(installAppStatus, error.message, 'error'));
});

installFromPwaButton.addEventListener('click', () => {
  installFromPwaUrl().catch((error) => setFeedback(installAppStatus, error.message, 'error'));
});

installLinuxPackageButton.addEventListener('click', () => {
  installSelectedLinuxPackage().catch((error) => setFeedback(linuxPackageStatus, error.message, 'error'));
});

downloadLinuxPackageButton.addEventListener('click', () => {
  downloadLinuxPackageFromUrl().catch((error) => setFeedback(linuxPackageStatus, error.message, 'error'));
});

document.querySelectorAll('[data-window-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const app = button.dataset.app;
    const action = button.dataset.windowAction;
    if (action === 'zoom') {
      toggleWindowFullscreen(app);
      return;
    }
    if (action === 'minimize') {
      closeWindow(app);
      return;
    }
    closeWindow(app);
  });
});

document.querySelectorAll('.app-window').forEach((windowEl) => {
  initWindowDrag(windowEl);
  windowEl.addEventListener('mousedown', () => focusWindow(windowEl.dataset.app));
});

// Persist manual window resizing (CSS resize handle) per app.
const windowResizeTimers = new Map();
const windowResizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const windowEl = entry.target;
    const app = windowEl.dataset.app;
    if (!app) return;
    if (windowEl.classList.contains('hidden')
      || windowEl.classList.contains('maximized')
      || windowEl.classList.contains('snapped-left')
      || windowEl.classList.contains('snapped-right')
      || windowEl.classList.contains('dragging')) {
      return;
    }
    if (windowResizeTimers.has(app)) clearTimeout(windowResizeTimers.get(app));
    windowResizeTimers.set(app, setTimeout(() => {
      const rect = windowEl.getBoundingClientRect();
      if (rect.width >= 320 && rect.height >= 200) {
        recordWindowState(app, { width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    }, 400));
  });
});
document.querySelectorAll('.app-window').forEach((windowEl) => windowResizeObserver.observe(windowEl));

function openStartupApps() {
  const startupApps = Array.isArray(shellState.preferences.startupApps) ? shellState.preferences.startupApps : [];
  startupApps
    .filter((app) => WINDOW_IDS[app])
    .forEach((app) => {
      openWindow(app);
      if (app === 'files') refreshFileList().catch(() => {});
    });
}

renderMessage('system', 'Welcome to AIOS web shell. Use dock apps for chat, files, terminal, apps, and setup.');

tickClock();
setInterval(tickClock, 30000);

loadShellState()
  .then(() => Promise.all([
    loadProviders(),
    loadWizardProviders(),
    loadDataDirInfo(),
    loadRuntimeInfo(),
    loadInstalledApps(),
    loadLinuxPackages(),
    loadImports(),
    loadApiAudit()
  ]))
  .then(() => {
    initShellExtras();
    openStartupApps();
    checkFirstRun();
    refreshFileList().catch(() => {});
  })
  .catch((error) => renderMessage('system', `Failed to load AIOS: ${error.message}`));

// --- Notes App Logic ---
const notesList = document.getElementById('notesList');
const notesTitleInput = document.getElementById('notesTitleInput');
const notesTextarea = document.getElementById('notesTextarea');
const notesStatus = document.getElementById('notesStatus');
const notesNewButton = document.getElementById('notesNewButton');
const notesDeleteButton = document.getElementById('notesDeleteButton');
const NOTES_STORAGE_KEY = 'aios.notes.v1';

let notesData = [];
let activeNoteId = null;
let notesSaveTimer = null;
let notesLoaded = false;

function noteDisplayTitle(note) {
  const title = (note.title || '').trim();
  if (title) return title;
  const firstLine = (note.content || '').split('\n').find((line) => line.trim());
  return firstLine ? firstLine.trim().slice(0, 40) : 'Untitled note';
}

function renderNotesList() {
  notesList.innerHTML = '';

  if (notesData.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'notes-empty';
    empty.textContent = 'No notes yet. Click "New Note" to start.';
    notesList.appendChild(empty);
    return;
  }

  notesData.forEach((note) => {
    const item = document.createElement('li');
    item.className = 'notes-list-item' + (note.id === activeNoteId ? ' active' : '');
    item.dataset.noteId = note.id;

    const title = document.createElement('span');
    title.className = 'notes-list-title';
    title.textContent = noteDisplayTitle(note);

    const preview = document.createElement('span');
    preview.className = 'notes-list-preview';
    const body = (note.content || '').replace(/\s+/g, ' ').trim();
    preview.textContent = body ? body.slice(0, 60) : 'No additional text';

    item.appendChild(title);
    item.appendChild(preview);
    item.addEventListener('click', () => selectNote(note.id));
    notesList.appendChild(item);
  });
}

function activeNote() {
  return notesData.find((note) => note.id === activeNoteId) || null;
}

function selectNote(id) {
  activeNoteId = id;
  const note = activeNote();
  if (note) {
    notesTitleInput.value = note.title || '';
    notesTextarea.value = note.content || '';
    notesTitleInput.disabled = false;
    notesTextarea.disabled = false;
    notesDeleteButton.disabled = false;
    notesStatus.textContent = 'Editing • saved';
  } else {
    notesTitleInput.value = '';
    notesTextarea.value = '';
    notesTitleInput.disabled = true;
    notesTextarea.disabled = true;
    notesDeleteButton.disabled = true;
    notesStatus.textContent = 'No note selected';
  }
  renderNotesList();
}

async function persistNotes({ showStatus = false } = {}) {
  const shouldShowStatus = showStatus && Boolean(activeNote());
  try {
    if (shouldShowStatus) {
      notesStatus.textContent = 'Saving...';
    }
    const response = await fetch('/api/local-data/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notesData })
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || 'Failed to save notes.');
    }
    if (shouldShowStatus) {
      notesStatus.textContent = 'Saved ' + new Date().toLocaleTimeString();
    }
  } catch (error) {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesData));
      if (shouldShowStatus) {
        notesStatus.textContent = 'Saved locally ' + new Date().toLocaleTimeString();
      }
      return;
    } catch {
      // Continue to error status below.
    }
    if (shouldShowStatus) {
      notesStatus.textContent = 'Save failed';
    }
  }
}

function scheduleNotesSave() {
  if (notesSaveTimer) clearTimeout(notesSaveTimer);
  notesSaveTimer = setTimeout(() => persistNotes({ showStatus: true }), 800);
}

function handleNoteEdit() {
  const note = activeNote();
  if (!note) return;
  note.title = notesTitleInput.value;
  note.content = notesTextarea.value;
  note.updatedAt = new Date().toISOString();
  notesStatus.textContent = 'Unsaved changes';
  renderNotesList();
  scheduleNotesSave();
}

function createNote() {
  const note = {
    id: (crypto.randomUUID && crypto.randomUUID()) || `note-${Date.now()}`,
    title: '',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notesData.unshift(note);
  selectNote(note.id);
  notesTitleInput.focus();
  persistNotes();
}

function deleteActiveNote() {
  const note = activeNote();
  if (!note) return;
  notesData = notesData.filter((entry) => entry.id !== note.id);
  activeNoteId = notesData[0]?.id || null;
  selectNote(activeNoteId);
  persistNotes();
}

async function loadNotesApp() {
  if (notesLoaded) return;
  notesLoaded = true;
  try {
    const response = await fetch('/api/local-data/notes');
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    if (response.ok && payload?.ok && Array.isArray(payload.notes)) {
      notesData = payload.notes;
      activeNoteId = notesData[0]?.id || null;
      selectNote(activeNoteId);
      return;
    }
  } catch {
    // Fall back to local cache.
  }
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    notesData = Array.isArray(parsed) ? parsed : [];
  } catch {
    notesData = [];
  }
  activeNoteId = notesData[0]?.id || null;
  selectNote(activeNoteId);
}

notesTitleInput.addEventListener('input', handleNoteEdit);
notesTextarea.addEventListener('input', handleNoteEdit);
notesNewButton.addEventListener('click', createNote);
notesDeleteButton.addEventListener('click', deleteActiveNote);

selectNote(null);

// === TERMINAL ===
let term = null;
let fitAddon = null;
let terminalSocket = null;

function initTerminal(options = {}) {
  const container = document.getElementById('terminalContainer');
  if (!container) return;

  const isLinuxApp = Boolean(options.packageId);
  const appName = options.name || (isLinuxApp ? 'Linux App' : 'Terminal');
  const appGlyph = options.glyph || (isLinuxApp ? 'LX' : '$');

  if (terminalTitle) terminalTitle.textContent = appName;
  if (terminalAppGlyph) terminalAppGlyph.textContent = appGlyph;
  if (terminalStatusText) terminalStatusText.textContent = isLinuxApp ? `Running ${appName}` : 'Shell ready';
  if (terminalRuntimeBadge) {
    terminalRuntimeBadge.textContent = isLinuxApp ? 'Linux App' : 'AIOS Runtime';
    terminalRuntimeBadge.classList.toggle('linux-app', isLinuxApp);
  }

  if (!term) {
    term = new Terminal({
      cursorBlink: true,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 14,
      theme: {
        background: '#0a0e14',
        foreground: '#cbe8ff',
        cursor: '#0a84ff',
        selectionBackground: 'rgba(10, 132, 255, 0.35)'
      }
    });
    fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
  }

  term.clear();
  term.write(`\x1b[33mLaunching ${appName}...\x1b[0m\r\n`);

  if (terminalSocket) {
    terminalSocket.close();
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  terminalSocket = new WebSocket(`${protocol}//${window.location.host}`);

  terminalSocket.onopen = () => {
    fitAddon.fit();
    terminalSocket.send(JSON.stringify({ 
      type: 'init', 
      cols: term.cols, 
      rows: term.rows,
      packageId: options.packageId || null
    }));
  };

  terminalSocket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'data') {
      term.write(msg.data);
    } else if (msg.type === 'exit') {
      term.write(`\r\n\x1b[31m[Process exited with code ${msg.code}]\x1b[0m\r\n`);
      if (terminalStatusText) terminalStatusText.textContent = isLinuxApp ? `${appName} finished` : 'Disconnected';
    } else if (msg.type === 'error') {
      term.write(`\r\n\x1b[31m[Error] ${msg.data}\x1b[0m\r\n`);
      if (terminalStatusText) terminalStatusText.textContent = `Error: ${msg.data}`;
    }
  };

  terminalSocket.onclose = () => {
    term.write('\r\n\x1b[31m[Disconnected]\x1b[0m\r\n');
    if (terminalStatusText) terminalStatusText.textContent = isLinuxApp ? `${appName} disconnected` : 'Disconnected';
  };

  term.onData((data) => {
    if (terminalSocket && terminalSocket.readyState === WebSocket.OPEN) {
      terminalSocket.send(JSON.stringify({ type: 'data', data }));
    }
  });

  window.addEventListener('resize', () => {
    if (fitAddon) fitAddon.fit();
    if (terminalSocket && terminalSocket.readyState === WebSocket.OPEN) {
      terminalSocket.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
    }
  });
}

// === CALCULATOR ===
const calcDisplay = document.getElementById('calcDisplay');
const calcState = { current: '0', previous: null, operator: null, justEvaluated: false };

function calcUpdateDisplay() {
  if (!calcDisplay) return;
  let text = calcState.current;
  if (text.length > 12 && !text.includes('e')) {
    const num = Number(text);
    text = Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)
      ? num.toExponential(6)
      : String(Number(num.toPrecision(12)));
  }
  calcDisplay.textContent = text;
}

function calcApplyOperator(a, b, operator) {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function calcInput(key) {
  if (/^[0-9]$/.test(key)) {
    if (calcState.justEvaluated) {
      calcState.current = key;
      calcState.justEvaluated = false;
    } else {
      calcState.current = calcState.current === '0' ? key : calcState.current + key;
    }
  } else if (key === '.') {
    if (calcState.justEvaluated) {
      calcState.current = '0.';
      calcState.justEvaluated = false;
    } else if (!calcState.current.includes('.')) {
      calcState.current += '.';
    }
  } else if (key === 'clear') {
    calcState.current = '0';
    calcState.previous = null;
    calcState.operator = null;
    calcState.justEvaluated = false;
  } else if (key === 'negate') {
    calcState.current = calcState.current.startsWith('-')
      ? calcState.current.slice(1)
      : (calcState.current === '0' ? '0' : `-${calcState.current}`);
  } else if (key === 'percent') {
    calcState.current = String(Number(calcState.current) / 100);
  } else if (['+', '-', '*', '/'].includes(key)) {
    if (calcState.operator !== null && calcState.previous !== null && !calcState.justEvaluated) {
      const result = calcApplyOperator(calcState.previous, Number(calcState.current), calcState.operator);
      calcState.current = Number.isFinite(result) ? String(result) : 'Error';
    }
    calcState.previous = Number(calcState.current);
    calcState.operator = key;
    calcState.justEvaluated = true;
  } else if (key === '=') {
    if (calcState.operator !== null && calcState.previous !== null) {
      const result = calcApplyOperator(calcState.previous, Number(calcState.current), calcState.operator);
      calcState.current = Number.isFinite(result) ? String(result) : 'Error';
      calcState.previous = null;
      calcState.operator = null;
      calcState.justEvaluated = true;
    }
  }
  calcUpdateDisplay();
}

document.querySelectorAll('[data-calc]').forEach((button) => {
  button.addEventListener('click', () => calcInput(button.dataset.calc));
});

const calculatorWindowEl = document.getElementById('windowCalculator');
if (calculatorWindowEl) {
  calculatorWindowEl.addEventListener('keydown', (event) => {
    const keyMap = { Enter: '=', '=': '=', Escape: 'clear', Backspace: 'clear', '%': 'percent' };
    const key = /^[0-9.+\-*/]$/.test(event.key) ? event.key : keyMap[event.key];
    if (key) {
      event.preventDefault();
      calcInput(key);
    }
  });
  calculatorWindowEl.tabIndex = -1;
}

// ===================== AIOS Shell Extras =====================
// Menu bar extras, notifications, calendar/clock, activity monitor,
// trash, quick look, spaces, lock screen, context menus, music,
// and AI chat history.

const spacesSwitcher = document.getElementById('spacesSwitcher');
const missionControlButton = document.getElementById('missionControlButton');
const missionControlOverlay = document.getElementById('missionControlOverlay');
const missionControlSpaces = document.getElementById('missionControlSpaces');
const wifiStatus = document.getElementById('wifiStatus');
const batteryStatus = document.getElementById('batteryStatus');
const volumeButton = document.getElementById('volumeButton');
const volumePopover = document.getElementById('volumePopover');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const notificationsButton = document.getElementById('notificationsButton');
const notificationsBadge = document.getElementById('notificationsBadge');
const notificationCenter = document.getElementById('notificationCenter');
const notificationList = document.getElementById('notificationList');
const notificationEmpty = document.getElementById('notificationEmpty');
const notificationsClearButton = document.getElementById('notificationsClearButton');
const toastContainer = document.getElementById('toastContainer');
const lockButton = document.getElementById('lockButton');
const lockScreen = document.getElementById('lockScreen');
const lockClock = document.getElementById('lockClock');
const lockDate = document.getElementById('lockDate');
const lockMessage = document.getElementById('lockMessage');
const lockForm = document.getElementById('lockForm');
const lockPinInput = document.getElementById('lockPinInput');
const lockFeedback = document.getElementById('lockFeedback');
const contextMenu = document.getElementById('contextMenu');
const calendarPopover = document.getElementById('calendarPopover');
const miniCalPrev = document.getElementById('miniCalPrev');
const miniCalNext = document.getElementById('miniCalNext');
const miniCalTitle = document.getElementById('miniCalTitle');
const miniCalGrid = document.getElementById('miniCalGrid');
const miniCalOpenApp = document.getElementById('miniCalOpenApp');
const calPrevButton = document.getElementById('calPrevButton');
const calNextButton = document.getElementById('calNextButton');
const calTodayButton = document.getElementById('calTodayButton');
const calTitle = document.getElementById('calTitle');
const calGrid = document.getElementById('calGrid');
const bigClock = document.getElementById('bigClock');
const bigClockDate = document.getElementById('bigClockDate');
const timerMinutesInput = document.getElementById('timerMinutesInput');
const timerStartButton = document.getElementById('timerStartButton');
const timerStopButton = document.getElementById('timerStopButton');
const timerDisplay = document.getElementById('timerDisplay');
const alarmTimeInput = document.getElementById('alarmTimeInput');
const alarmLabelInput = document.getElementById('alarmLabelInput');
const alarmAddButton = document.getElementById('alarmAddButton');
const alarmsList = document.getElementById('alarmsList');
const monitorUpdatedLabel = document.getElementById('monitorUpdatedLabel');
const monitorCpuBar = document.getElementById('monitorCpuBar');
const monitorCpuText = document.getElementById('monitorCpuText');
const monitorMemBar = document.getElementById('monitorMemBar');
const monitorMemText = document.getElementById('monitorMemText');
const monitorServerText = document.getElementById('monitorServerText');
const monitorProcessList = document.getElementById('monitorProcessList');
const monitorContainerList = document.getElementById('monitorContainerList');
const trashList = document.getElementById('trashList');
const trashStatus = document.getElementById('trashStatus');
const trashEmptyButton = document.getElementById('trashEmptyButton');
const quickLookOverlay = document.getElementById('quickLookOverlay');
const quickLookTitle = document.getElementById('quickLookTitle');
const quickLookBody = document.getElementById('quickLookBody');
const quickLookClose = document.getElementById('quickLookClose');
const musicAddButton = document.getElementById('musicAddButton');
const musicFileInput = document.getElementById('musicFileInput');
const musicArtwork = document.getElementById('musicArtwork');
const musicTrackTitle = document.getElementById('musicTrackTitle');
const musicTrackDetail = document.getElementById('musicTrackDetail');
const musicPrevButton = document.getElementById('musicPrevButton');
const musicPlayButton = document.getElementById('musicPlayButton');
const musicNextButton = document.getElementById('musicNextButton');
const musicSeekSlider = document.getElementById('musicSeekSlider');
const musicTimeLabel = document.getElementById('musicTimeLabel');
const musicPlaylist = document.getElementById('musicPlaylist');
const musicAudio = document.getElementById('musicAudio');
const chatHistoryButton = document.getElementById('chatHistoryButton');
const chatHistoryPanel = document.getElementById('chatHistoryPanel');
const chatHistoryList = document.getElementById('chatHistoryList');
const chatHistoryClearButton = document.getElementById('chatHistoryClearButton');

const SPACE_COUNT = 3;
let activeSpace = 1;
let currentConversationId = null;
let chatConversations = [];
let chatHistorySaveTimer = null;
let monitorTimer = null;
let timerInterval = null;
let timerEndsAt = null;
let alarmFiredKeys = new Set();
let calViewYear = new Date().getFullYear();
let calViewMonth = new Date().getMonth();
let miniCalYear = new Date().getFullYear();
let miniCalMonth = new Date().getMonth();
let globalVolume = 0.8;
let lockClockInterval = null;
let musicState = { tracks: [], currentIndex: -1, playing: false };

// ---------- Notifications ----------

function updateNotificationsBadge() {
  const unread = (shellState.notifications || []).filter((item) => !item.read).length;
  notificationsBadge.textContent = String(unread);
  notificationsBadge.classList.toggle('hidden', unread === 0);
}

function showToast(title, body) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const heading = document.createElement('strong');
  heading.textContent = title;
  const detail = document.createElement('span');
  detail.textContent = body || '';
  toast.appendChild(heading);
  if (body) toast.appendChild(detail);
  toast.addEventListener('click', () => toast.remove());
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 350);
  }, 5000);
}

function notify(title, body = '', { toast = true } = {}) {
  if (!Array.isArray(shellState.notifications)) shellState.notifications = [];
  shellState.notifications.unshift({
    id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: String(title).slice(0, 200),
    body: String(body).slice(0, 500),
    at: new Date().toISOString(),
    read: false
  });
  shellState.notifications = shellState.notifications.slice(0, 50);
  persistShellState();
  updateNotificationsBadge();
  renderNotificationCenter();
  if (toast && shellState.preferences.notificationToasts !== false) showToast(title, body);
}

function renderNotificationCenter() {
  const items = shellState.notifications || [];
  notificationList.innerHTML = '';
  notificationEmpty.classList.toggle('hidden', items.length > 0);
  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = `notification-item${item.read ? '' : ' unread'}`;
    const title = document.createElement('strong');
    title.textContent = item.title;
    const body = document.createElement('span');
    body.textContent = item.body || '';
    const time = document.createElement('time');
    time.textContent = new Date(item.at).toLocaleString(undefined, {
      hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric'
    });
    li.appendChild(title);
    if (item.body) li.appendChild(body);
    li.appendChild(time);
    notificationList.appendChild(li);
  });
}

function toggleNotificationCenter(force) {
  const show = typeof force === 'boolean' ? force : notificationCenter.classList.contains('hidden');
  notificationCenter.classList.toggle('hidden', !show);
  if (show) {
    renderNotificationCenter();
    let changed = false;
    (shellState.notifications || []).forEach((item) => {
      if (!item.read) {
        item.read = true;
        changed = true;
      }
    });
    if (changed) persistShellState();
    updateNotificationsBadge();
  }
}

notificationsButton.addEventListener('click', () => {
  hideMenuPopovers();
  toggleNotificationCenter();
});
notificationsClearButton.addEventListener('click', () => {
  shellState.notifications = [];
  persistShellState();
  renderNotificationCenter();
  updateNotificationsBadge();
});

// ---------- Menu bar extras ----------

function menuIconSvg(name) {
  const paths = {
    wifi: '<path d="M5 12.6a11 11 0 0 1 14 0M8.5 16.1a6 6 0 0 1 7 0M12 20h.01" />',
    wifiOff: '<path d="M3 3l18 18M8.5 16.1a6 6 0 0 1 4.7-1.1M5 12.6a11 11 0 0 1 3.6-1.8M15.5 11a11 11 0 0 1 3.5 1.6M12 20h.01" />',
    battery: '<rect x="3" y="7" width="17" height="10" rx="2" /><path d="M22 10v4" />',
    charging: '<rect x="3" y="7" width="17" height="10" rx="2" /><path d="M22 10v4M11 9l-2 3h3l-2 3" />',
    volumeMuted: '<path d="M11 5 6 9H3v6h3l5 4V5ZM16 10l5 5M21 10l-5 5" />',
    volumeLow: '<path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 9.5a4 4 0 0 1 0 5" />',
    volumeHigh: '<path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10" />',
    moon: '<path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" />',
    sun: '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
}

function hideMenuPopovers() {
  volumePopover.classList.add('hidden');
  calendarPopover.classList.add('hidden');
}

function updateWifiStatus() {
  const online = navigator.onLine !== false;
  wifiStatus.innerHTML = menuIconSvg(online ? 'wifi' : 'wifiOff');
  wifiStatus.title = online ? 'Network: online' : 'Network: offline';
  wifiStatus.setAttribute('aria-label', wifiStatus.title);
}

window.addEventListener('online', () => {
  updateWifiStatus();
  notify('Network', 'Connection restored.');
});
window.addEventListener('offline', () => {
  updateWifiStatus();
  notify('Network', 'You are offline.');
});

function renderBatteryStatus(battery) {
  const percent = Math.round(battery.level * 100);
  batteryStatus.innerHTML = `${menuIconSvg(battery.charging ? 'charging' : 'battery')}<span>${percent}%</span>`;
  batteryStatus.title = battery.charging ? `Battery: ${percent}% (charging)` : `Battery: ${percent}%`;
  batteryStatus.setAttribute('aria-label', batteryStatus.title);
  batteryStatus.classList.remove('hidden');
}

function initBatteryStatus() {
  if (!navigator.getBattery) return;
  navigator.getBattery().then((battery) => {
    renderBatteryStatus(battery);
    ['levelchange', 'chargingchange'].forEach((eventName) => {
      battery.addEventListener(eventName, () => renderBatteryStatus(battery));
    });
  }).catch(() => {});
}

function volumeGlyph() {
  if (globalVolume === 0) return 'volumeMuted';
  if (globalVolume < 0.5) return 'volumeLow';
  return 'volumeHigh';
}

function applyVolume() {
  musicAudio.volume = globalVolume;
  volumeButton.innerHTML = menuIconSvg(volumeGlyph());
  volumeSlider.value = String(Math.round(globalVolume * 100));
  volumeValue.textContent = `${Math.round(globalVolume * 100)}%`;
}

let systemVolumeSupported = false;
let systemVolumeSetTimer = null;

async function syncSystemVolume() {
  if (shellState.preferences.systemVolumeSync === false) return;
  try {
    const response = await fetch('/api/system/volume');
    const payload = await response.json();
    if (payload.ok && payload.supported) {
      systemVolumeSupported = true;
      globalVolume = Math.min(1, Math.max(0, (payload.muted ? 0 : payload.volume) / 100));
      applyVolume();
    }
  } catch {
    // System volume unavailable; the slider controls app audio only.
  }
}

function pushSystemVolume(volume) {
  if (shellState.preferences.systemVolumeSync === false) return;
  if (!systemVolumeSupported) return;
  if (systemVolumeSetTimer) clearTimeout(systemVolumeSetTimer);
  systemVolumeSetTimer = setTimeout(() => {
    fetch('/api/system/volume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volume: Math.round(volume * 100) })
    }).catch(() => {});
  }, 150);
}

volumeButton.addEventListener('click', () => {
  const wasHidden = volumePopover.classList.contains('hidden');
  hideMenuPopovers();
  notificationCenter.classList.add('hidden');
  if (wasHidden) {
    syncSystemVolume();
    volumePopover.classList.remove('hidden');
  }
});

volumeSlider.addEventListener('input', () => {
  globalVolume = Number(volumeSlider.value) / 100;
  shellState.preferences.volume = globalVolume;
  applyVolume();
  pushSystemVolume(globalVolume);
  persistShellState();
});

// ---------- Mini calendar popover ----------

function buildMonthGrid(container, year, month) {
  container.innerHTML = '';
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i += 1) {
    container.appendChild(document.createElement('span'));
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement('span');
    cell.className = 'cal-day';
    cell.textContent = String(day);
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      cell.classList.add('today');
    }
    container.appendChild(cell);
  }
}

function renderMiniCalendar() {
  miniCalTitle.textContent = new Date(miniCalYear, miniCalMonth, 1).toLocaleString(undefined, {
    month: 'long', year: 'numeric'
  });
  buildMonthGrid(miniCalGrid, miniCalYear, miniCalMonth);
}

clockLabel.addEventListener('click', () => {
  const wasHidden = calendarPopover.classList.contains('hidden');
  hideMenuPopovers();
  notificationCenter.classList.add('hidden');
  if (wasHidden) {
    miniCalYear = new Date().getFullYear();
    miniCalMonth = new Date().getMonth();
    renderMiniCalendar();
    calendarPopover.classList.remove('hidden');
  }
});
miniCalPrev.addEventListener('click', () => {
  miniCalMonth -= 1;
  if (miniCalMonth < 0) { miniCalMonth = 11; miniCalYear -= 1; }
  renderMiniCalendar();
});
miniCalNext.addEventListener('click', () => {
  miniCalMonth += 1;
  if (miniCalMonth > 11) { miniCalMonth = 0; miniCalYear += 1; }
  renderMiniCalendar();
});
miniCalOpenApp.addEventListener('click', () => {
  hideMenuPopovers();
  openWindow('calendar');
});

// ---------- Calendar & Clock app ----------

function renderCalendarApp() {
  calTitle.textContent = new Date(calViewYear, calViewMonth, 1).toLocaleString(undefined, {
    month: 'long', year: 'numeric'
  });
  buildMonthGrid(calGrid, calViewYear, calViewMonth);
}

calPrevButton.addEventListener('click', () => {
  calViewMonth -= 1;
  if (calViewMonth < 0) { calViewMonth = 11; calViewYear -= 1; }
  renderCalendarApp();
});
calNextButton.addEventListener('click', () => {
  calViewMonth += 1;
  if (calViewMonth > 11) { calViewMonth = 0; calViewYear += 1; }
  renderCalendarApp();
});
calTodayButton.addEventListener('click', () => {
  calViewYear = new Date().getFullYear();
  calViewMonth = new Date().getMonth();
  renderCalendarApp();
});

function tickBigClock() {
  const now = new Date();
  bigClock.textContent = now.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  bigClockDate.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// ---------- Timer ----------

function stopTimer({ silent = false } = {}) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerEndsAt = null;
  timerDisplay.classList.add('hidden');
  timerStopButton.classList.add('hidden');
  timerStartButton.classList.remove('hidden');
  if (!silent) notify('Timer', 'Timer stopped.');
}

function tickTimer() {
  const remaining = Math.max(0, Math.round((timerEndsAt - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  if (remaining <= 0) {
    stopTimer({ silent: true });
    notify('Timer finished', 'Your countdown timer is done.');
  }
}

timerStartButton.addEventListener('click', () => {
  const minutes = Math.max(0, Math.min(720, Number(timerMinutesInput.value) || 0));
  if (!minutes) return;
  timerEndsAt = Date.now() + minutes * 60 * 1000;
  timerDisplay.classList.remove('hidden');
  timerStartButton.classList.add('hidden');
  timerStopButton.classList.remove('hidden');
  tickTimer();
  timerInterval = setInterval(tickTimer, 1000);
});
timerStopButton.addEventListener('click', () => stopTimer());

// ---------- Alarms ----------

function renderAlarmsList() {
  const alarms = shellState.alarms || [];
  alarmsList.innerHTML = '';
  alarms.forEach((alarm) => {
    const li = document.createElement('li');
    li.className = 'alarm-item';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = alarm.enabled !== false;
    toggle.setAttribute('aria-label', `Enable alarm ${alarm.time}`);
    toggle.addEventListener('change', () => {
      alarm.enabled = toggle.checked;
      persistShellState();
    });
    const label = document.createElement('span');
    label.textContent = `${alarm.time} ${alarm.label ? `• ${alarm.label}` : ''}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-entry-action';
    remove.textContent = '✕';
    remove.setAttribute('aria-label', `Delete alarm ${alarm.time}`);
    remove.addEventListener('click', () => {
      shellState.alarms = (shellState.alarms || []).filter((entry) => entry.id !== alarm.id);
      persistShellState();
      renderAlarmsList();
    });
    li.appendChild(toggle);
    li.appendChild(label);
    li.appendChild(remove);
    alarmsList.appendChild(li);
  });
}

alarmAddButton.addEventListener('click', () => {
  const time = alarmTimeInput.value;
  if (!time) return;
  if (!Array.isArray(shellState.alarms)) shellState.alarms = [];
  shellState.alarms.push({
    id: `alarm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time,
    label: alarmLabelInput.value.trim().slice(0, 100),
    enabled: true
  });
  alarmLabelInput.value = '';
  persistShellState();
  renderAlarmsList();
  notify('Alarm set', `Alarm scheduled for ${time}.`);
});

function checkAlarms() {
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const minuteKey = `${now.toDateString()}-${current}`;
  (shellState.alarms || []).forEach((alarm) => {
    if (alarm.enabled === false || alarm.time !== current) return;
    const firedKey = `${alarm.id}-${minuteKey}`;
    if (alarmFiredKeys.has(firedKey)) return;
    alarmFiredKeys.add(firedKey);
    notify('⏰ Alarm', alarm.label ? `${alarm.time} — ${alarm.label}` : `It is ${alarm.time}.`);
  });
  if (alarmFiredKeys.size > 200) alarmFiredKeys = new Set();
}

// ---------- Activity Monitor ----------

function formatUptime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

async function refreshActivityMonitor() {
  try {
    const response = await fetch('/api/system/stats');
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || 'Stats unavailable');
    const stats = payload.stats;

    const cpuPercent = Math.min(100, Math.round((stats.loadAvg[0] / Math.max(1, stats.cpuCount)) * 100));
    monitorCpuBar.style.width = `${cpuPercent}%`;
    monitorCpuBar.classList.toggle('hot', cpuPercent > 80);
    monitorCpuText.textContent = `${cpuPercent}% • load ${stats.loadAvg.join(' / ')} • ${stats.cpuCount} cores`;

    const memPercent = Math.round((stats.usedMem / Math.max(1, stats.totalMem)) * 100);
    monitorMemBar.style.width = `${memPercent}%`;
    monitorMemBar.classList.toggle('hot', memPercent > 85);
    monitorMemText.textContent = `${formatBytes(stats.usedMem)} of ${formatBytes(stats.totalMem)} (${memPercent}%)`;

    monitorServerText.textContent = `PID ${stats.serverProcess.pid} • ${formatBytes(stats.serverProcess.rss)} RSS • up ${formatUptime(stats.serverProcess.uptime)}`;

    monitorProcessList.innerHTML = '';
    const processes = stats.processes || [];
    if (processes.length === 0) {
      const li = document.createElement('li');
      li.className = 'status-text';
      li.textContent = 'No tracked AIOS processes.';
      monitorProcessList.appendChild(li);
    }
    processes.slice(0, 20).forEach((proc) => {
      const li = document.createElement('li');
      li.className = 'monitor-row';
      li.textContent = `${proc.status === 'running' ? '🟢' : '⚪️'} ${proc.title || proc.command || proc.id} • ${proc.status}${proc.pid ? ` • PID ${proc.pid}` : ''}`;
      monitorProcessList.appendChild(li);
    });

    monitorContainerList.innerHTML = '';
    const containers = stats.containers || [];
    if (containers.length === 0) {
      const li = document.createElement('li');
      li.className = 'status-text';
      li.textContent = 'No running Linux containers.';
      monitorContainerList.appendChild(li);
    }
    containers.forEach((container) => {
      const li = document.createElement('li');
      li.className = 'monitor-row';
      li.textContent = `🐧 ${container.name} • CPU ${container.cpu} • Mem ${container.mem} • Net ${container.net}`;
      monitorContainerList.appendChild(li);
    });

    monitorUpdatedLabel.textContent = `Updated ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    monitorUpdatedLabel.textContent = `Error: ${error.message}`;
  }
}

function startActivityMonitor() {
  stopActivityMonitor();
  refreshActivityMonitor();
  monitorTimer = setInterval(refreshActivityMonitor, 3000);
}

function stopActivityMonitor() {
  if (monitorTimer) clearInterval(monitorTimer);
  monitorTimer = null;
}

// ---------- Trash ----------

async function moveFileToTrash(pathValue) {
  const response = await fetch('/api/fs/trash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathValue })
  });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || 'Failed to move to trash.');
  notify('Moved to Trash', payload.item?.name || pathValue);
  refreshFileList().catch(() => {});
  if (!document.getElementById('windowTrash').classList.contains('hidden')) {
    refreshTrash().catch(() => {});
  }
  return payload.item;
}

async function refreshTrash() {
  const response = await fetch('/api/trash');
  const payload = await response.json();
  if (!payload.ok) {
    setFeedback(trashStatus, payload.error || 'Failed to load trash.', 'error');
    return;
  }
  trashList.innerHTML = '';
  const items = payload.items || [];
  setFeedback(trashStatus, items.length === 0 ? 'Trash is empty.' : `${items.length} item${items.length === 1 ? '' : 's'} in Trash`);
  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'trash-item';
    const info = document.createElement('div');
    info.className = 'trash-item-info';
    const name = document.createElement('strong');
    name.textContent = `${item.type === 'directory' ? '📁' : '📄'} ${item.name}`;
    const detail = document.createElement('span');
    detail.className = 'status-text';
    detail.textContent = `${item.originalPath} • deleted ${new Date(item.deletedAt).toLocaleString()}${item.size ? ` • ${formatBytes(item.size)}` : ''}`;
    info.appendChild(name);
    info.appendChild(detail);
    const actions = document.createElement('div');
    actions.className = 'trash-item-actions';
    const restore = document.createElement('button');
    restore.type = 'button';
    restore.className = 'titlebar-button';
    restore.textContent = 'Restore';
    restore.addEventListener('click', async () => {
      try {
        const restoreResponse = await fetch('/api/trash/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id })
        });
        const restorePayload = await restoreResponse.json();
        if (!restorePayload.ok) throw new Error(restorePayload.error);
        notify('Restored from Trash', `${item.name} → ${restorePayload.restoredPath}`);
        refreshTrash().catch(() => {});
        refreshFileList().catch(() => {});
      } catch (error) {
        setFeedback(trashStatus, error.message, 'error');
      }
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'titlebar-button';
    remove.textContent = 'Delete';
    remove.addEventListener('click', async () => {
      try {
        const deleteResponse = await fetch(`/api/trash/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
        const deletePayload = await deleteResponse.json();
        if (!deletePayload.ok) throw new Error(deletePayload.error);
        refreshTrash().catch(() => {});
      } catch (error) {
        setFeedback(trashStatus, error.message, 'error');
      }
    });
    actions.appendChild(restore);
    actions.appendChild(remove);
    li.appendChild(info);
    li.appendChild(actions);
    trashList.appendChild(li);
  });
}

trashEmptyButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/trash/empty', { method: 'POST' });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error);
    notify('Trash emptied', `${payload.removed} item${payload.removed === 1 ? '' : 's'} permanently deleted.`);
    refreshTrash().catch(() => {});
  } catch (error) {
    setFeedback(trashStatus, error.message, 'error');
  }
});

// ---------- Quick Look ----------

const QUICKLOOK_IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'];
const QUICKLOOK_AUDIO_EXTS = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
const QUICKLOOK_VIDEO_EXTS = ['mp4', 'webm', 'mov'];

function closeQuickLook() {
  quickLookOverlay.classList.add('hidden');
  quickLookBody.innerHTML = '';
}

async function openQuickLook(pathValue) {
  const ext = (pathValue.split('.').pop() || '').toLowerCase();
  const rawUrl = `/api/fs/raw?path=${encodeURIComponent(pathValue)}`;
  quickLookTitle.textContent = pathValue.split('/').pop() || pathValue;
  quickLookBody.innerHTML = '';
  quickLookOverlay.classList.remove('hidden');

  if (QUICKLOOK_IMAGE_EXTS.includes(ext)) {
    const img = document.createElement('img');
    img.src = rawUrl;
    img.alt = pathValue;
    quickLookBody.appendChild(img);
    return;
  }
  if (QUICKLOOK_AUDIO_EXTS.includes(ext)) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = rawUrl;
    quickLookBody.appendChild(audio);
    return;
  }
  if (QUICKLOOK_VIDEO_EXTS.includes(ext)) {
    const video = document.createElement('video');
    video.controls = true;
    video.src = rawUrl;
    quickLookBody.appendChild(video);
    return;
  }
  if (ext === 'pdf') {
    const frame = document.createElement('iframe');
    frame.src = rawUrl;
    frame.title = pathValue;
    quickLookBody.appendChild(frame);
    return;
  }

  const pre = document.createElement('pre');
  pre.textContent = 'Loading preview...';
  quickLookBody.appendChild(pre);
  try {
    const file = await readWorkspaceFile(pathValue);
    pre.textContent = file.content.slice(0, 100000) || '(empty file)';
  } catch (error) {
    pre.textContent = `Cannot preview this file: ${error.message}`;
  }
}

quickLookClose.addEventListener('click', closeQuickLook);
quickLookOverlay.addEventListener('click', (event) => {
  if (event.target === quickLookOverlay) closeQuickLook();
});

// ---------- Spaces & Mission Control ----------

function refreshSpaceVisibility() {
  Object.entries(WINDOW_IDS).forEach(([app, id]) => {
    const windowEl = document.getElementById(id);
    if (!windowEl) return;
    const state = shellState.windows?.[app] || {};
    const space = Number(state.space) || 1;
    if (space !== activeSpace) {
      windowEl.classList.add('hidden');
      return;
    }
    // Only explicitly opened windows are shown; windows with no saved
    // state keep their default visibility from the HTML.
    if (state.open === true && !state.minimized) {
      windowEl.classList.remove('hidden');
    } else if (state.open === false || state.minimized) {
      windowEl.classList.add('hidden');
    }
  });
}

function renderSpacesSwitcher() {
  spacesSwitcher.innerHTML = '';
  for (let space = 1; space <= SPACE_COUNT; space += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `space-dot${space === activeSpace ? ' active' : ''}`;
    button.textContent = String(space);
    button.title = `Switch to Space ${space}`;
    button.setAttribute('aria-label', `Switch to Space ${space}`);
    button.addEventListener('click', () => switchSpace(space));
    spacesSwitcher.appendChild(button);
  }
}

function switchSpace(space) {
  if (space === activeSpace) return;
  activeSpace = space;
  shellState.preferences.activeSpace = space;
  persistShellState();
  renderSpacesSwitcher();
  refreshSpaceVisibility();
  activeWindowTitle.textContent = `Space ${space}`;
  if (!missionControlOverlay.classList.contains('hidden')) renderMissionControl();
}

function renderMissionControl() {
  missionControlSpaces.innerHTML = '';
  for (let space = 1; space <= SPACE_COUNT; space += 1) {
    const panel = document.createElement('div');
    panel.className = `mission-space${space === activeSpace ? ' active' : ''}`;
    const heading = document.createElement('strong');
    heading.textContent = `Space ${space}`;
    panel.appendChild(heading);
    const chips = document.createElement('div');
    chips.className = 'mission-space-windows';
    Object.entries(WINDOW_IDS).forEach(([app, id]) => {
      const state = shellState.windows?.[app] || {};
      const windowSpace = Number(state.space) || 1;
      const windowEl = document.getElementById(id);
      const isOpen = state.minimized
        ? false
        : (state.open === true || (state.open === undefined && windowEl && !windowEl.classList.contains('hidden')));
      if (windowSpace !== space || !isOpen) return;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'mission-window-chip';
      chip.textContent = document.getElementById(id)?.dataset.title || app;
      chip.addEventListener('click', (event) => {
        event.stopPropagation();
        switchSpace(space);
        toggleMissionControl(false);
        focusWindow(app);
      });
      chips.appendChild(chip);
    });
    if (!chips.children.length) {
      const empty = document.createElement('span');
      empty.className = 'status-text';
      empty.textContent = 'No windows';
      chips.appendChild(empty);
    }
    panel.appendChild(chips);
    panel.addEventListener('click', () => {
      switchSpace(space);
      toggleMissionControl(false);
    });
    missionControlSpaces.appendChild(panel);
  }
}

function toggleMissionControl(force) {
  const show = typeof force === 'boolean' ? force : missionControlOverlay.classList.contains('hidden');
  missionControlOverlay.classList.toggle('hidden', !show);
  if (show) renderMissionControl();
}

missionControlButton.addEventListener('click', () => toggleMissionControl());
missionControlOverlay.addEventListener('click', (event) => {
  if (event.target === missionControlOverlay) toggleMissionControl(false);
});

// ---------- Lock screen ----------

async function hashPin(pin) {
  if (window.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`aios:${pin}`));
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  const text = `aios:${pin}`;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return `fallback-${hash}`;
}

function tickLockClock() {
  const now = new Date();
  lockClock.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  lockDate.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}

function showLockScreen() {
  lockScreen.classList.remove('hidden');
  lockPinInput.value = '';
  setFeedback(lockFeedback);
  lockMessage.textContent = shellState.preferences.lockPinHash
    ? 'Enter your PIN to unlock'
    : 'Set a PIN (4+ digits) to protect this desktop';
  tickLockClock();
  if (lockClockInterval) clearInterval(lockClockInterval);
  lockClockInterval = setInterval(tickLockClock, 1000);
  setTimeout(() => lockPinInput.focus(), 50);
}

function hideLockScreen() {
  lockScreen.classList.add('hidden');
  if (lockClockInterval) clearInterval(lockClockInterval);
  lockClockInterval = null;
}

function lockScreenNow() {
  shellState.preferences.locked = true;
  persistShellState();
  hideMenuPopovers();
  notificationCenter.classList.add('hidden');
  toggleMissionControl(false);
  showLockScreen();
}

lockButton.addEventListener('click', lockScreenNow);

lockForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const pin = lockPinInput.value.trim();
  if (pin.length < 4) {
    setFeedback(lockFeedback, 'PIN must be at least 4 characters.', 'error');
    return;
  }
  const hashed = await hashPin(pin);
  if (!shellState.preferences.lockPinHash) {
    shellState.preferences.lockPinHash = hashed;
    shellState.preferences.locked = false;
    persistShellState();
    hideLockScreen();
    notify('Lock screen', 'PIN set. Use the 🔒 menu button or Ctrl+⌘Q to lock.');
    return;
  }
  if (hashed === shellState.preferences.lockPinHash) {
    shellState.preferences.locked = false;
    persistShellState();
    hideLockScreen();
  } else {
    setFeedback(lockFeedback, 'Incorrect PIN. Try again.', 'error');
    lockPinInput.value = '';
  }
});

// ---------- Context menus ----------

function hideContextMenu() {
  contextMenu.classList.add('hidden');
  contextMenu.innerHTML = '';
}

function showContextMenu(items, x, y) {
  contextMenu.innerHTML = '';
  items.forEach((item) => {
    if (item === 'separator') {
      const separator = document.createElement('li');
      separator.className = 'context-menu-separator';
      contextMenu.appendChild(separator);
      return;
    }
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'menuitem');
    button.textContent = item.label;
    if (item.danger) button.classList.add('danger');
    button.addEventListener('click', () => {
      hideContextMenu();
      item.action();
    });
    li.appendChild(button);
    contextMenu.appendChild(li);
  });
  contextMenu.classList.remove('hidden');
  const rect = contextMenu.getBoundingClientRect();
  const left = Math.min(x, window.innerWidth - rect.width - 8);
  const top = Math.min(y, window.innerHeight - rect.height - 8);
  contextMenu.style.left = `${Math.max(4, left)}px`;
  contextMenu.style.top = `${Math.max(4, top)}px`;
}

document.addEventListener('click', (event) => {
  if (!contextMenu.contains(event.target)) hideContextMenu();
  if (!volumePopover.contains(event.target) && !volumeButton.contains(event.target)) {
    volumePopover.classList.add('hidden');
  }
  if (!calendarPopover.contains(event.target) && !clockLabel.contains(event.target)) {
    calendarPopover.classList.add('hidden');
  }
  if (!notificationCenter.contains(event.target) && !notificationsButton.contains(event.target)) {
    notificationCenter.classList.add('hidden');
  }
});

desktopCanvas.addEventListener('contextmenu', (event) => {
  if (event.target !== desktopCanvas) return;
  event.preventDefault();
  showContextMenu([
    { label: 'New Note', action: () => openWindow('notes') },
    { label: 'Open Terminal', action: () => openWindow('terminal') },
    { label: 'Open Files', action: () => { openWindow('files'); refreshFileList().catch(() => {}); } },
    'separator',
    { label: 'Change Wallpaper…', action: () => openWindow('settings') },
    { label: 'Mission Control', action: () => toggleMissionControl(true) },
    'separator',
    { label: 'Lock Screen', action: lockScreenNow }
  ], event.clientX, event.clientY);
});

function showFileContextMenu(event, entry, entryPath) {
  const items = [];
  if (entry.type === 'directory') {
    items.push({ label: 'Open Folder', action: () => refreshFileList(entryPath).catch(() => {}) });
  } else {
    items.push({ label: 'Open in Editor', action: async () => {
      try {
        const file = await readWorkspaceFile(entryPath);
        openFileInEditor(file.path);
      } catch (error) {
        setFeedback(fileReadStatus, error.message, 'error');
      }
    } });
    items.push({ label: 'Quick Look', action: () => openQuickLook(entryPath) });
  }
  items.push('separator');
  items.push({ label: 'Rename…', action: async () => {
    const name = window.prompt('Rename to:', entry.name);
    if (!name || name === entry.name) return;
    try {
      await renameWorkspaceItem(entryPath, name);
      await refreshFileList(filesPathInput.value || '.');
      setFeedback(fileReadStatus, `Renamed ${entry.name} to ${name}`);
    } catch (error) {
      setFeedback(fileReadStatus, error.message, 'error');
    }
  } });
  items.push({ label: 'Copy to Folder…', action: async () => {
    const target = window.prompt('Copy to folder:', filesPathInput.value || '.');
    if (!target) return;
    try {
      const result = await copyWorkspaceItem(entryPath, target);
      await refreshFileList(filesPathInput.value || '.');
      setFeedback(fileReadStatus, `Copied to ${result.path}`, 'success');
    } catch (error) {
      setFeedback(fileReadStatus, error.message, 'error');
    }
  } });
  items.push({ label: 'Move to Folder…', action: async () => {
    const target = window.prompt('Move to folder:', filesPathInput.value || '.');
    if (!target) return;
    try {
      const result = await moveWorkspaceItem(entryPath, target);
      await refreshFileList(filesPathInput.value || '.');
      setFeedback(fileReadStatus, `Moved to ${result.path}`, 'success');
    } catch (error) {
      setFeedback(fileReadStatus, error.message, 'error');
    }
  } });
  items.push('separator');
  items.push({
    label: 'Move to Trash',
    danger: true,
    action: () => moveFileToTrash(entryPath).catch((error) => setFeedback(fileReadStatus, error.message, 'error'))
  });
  showContextMenu(items, event.clientX, event.clientY);
}

dockAppButtons.forEach((button) => {
  button.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const app = button.dataset.openApp;
    const windowEl = document.getElementById(WINDOW_IDS[app]);
    const isOpen = windowEl && !windowEl.classList.contains('hidden');
    const items = [
      { label: isOpen ? 'Focus Window' : 'Open', action: () => openWindow(app) }
    ];
    if (isOpen) {
      items.push({ label: 'Snap Left', action: () => setWindowMode(app, 'left') });
      items.push({ label: 'Snap Right', action: () => setWindowMode(app, 'right') });
      items.push({ label: 'Fullscreen', action: () => setWindowMode(app, 'full') });
      items.push({ label: 'Close Window', action: () => closeWindow(app) });
    }
    items.push('separator');
    for (let space = 1; space <= SPACE_COUNT; space += 1) {
      items.push({
        label: `Move to Space ${space}`,
        action: () => {
          recordWindowState(app, { space });
          refreshSpaceVisibility();
        }
      });
    }
    showContextMenu(items, event.clientX, event.clientY);
  });
});

// ---------- Music player ----------

function formatTrackTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function renderMusicPlaylist() {
  musicPlaylist.innerHTML = '';
  if (musicState.tracks.length === 0) {
    const li = document.createElement('li');
    li.className = 'status-text';
    li.textContent = 'Playlist is empty. Click "Add Songs" to load local audio files.';
    musicPlaylist.appendChild(li);
    return;
  }
  musicState.tracks.forEach((track, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `music-playlist-item${index === musicState.currentIndex ? ' active' : ''}`;
    button.textContent = `${index === musicState.currentIndex && musicState.playing ? '▶︎ ' : ''}${track.name}`;
    button.addEventListener('click', () => playTrack(index));
    li.appendChild(button);
    musicPlaylist.appendChild(li);
  });
}

function updateMusicNowPlaying() {
  const track = musicState.tracks[musicState.currentIndex];
  musicTrackTitle.textContent = track ? track.name : 'Nothing playing';
  musicTrackDetail.textContent = track
    ? `Track ${musicState.currentIndex + 1} of ${musicState.tracks.length}`
    : 'Add local audio files to get started';
  musicPlayButton.textContent = musicState.playing ? '⏸' : '▶️';
  musicArtwork.classList.toggle('spinning', musicState.playing);
  renderMusicPlaylist();
}

function playTrack(index) {
  const track = musicState.tracks[index];
  if (!track) return;
  musicState.currentIndex = index;
  musicAudio.src = track.url;
  musicAudio.volume = globalVolume;
  musicAudio.play().then(() => {
    musicState.playing = true;
    updateMusicNowPlaying();
  }).catch(() => {
    musicState.playing = false;
    updateMusicNowPlaying();
  });
}

musicAddButton.addEventListener('click', () => musicFileInput.click());
musicFileInput.addEventListener('change', () => {
  const files = Array.from(musicFileInput.files || []);
  files.forEach((file) => {
    musicState.tracks.push({ name: file.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(file) });
  });
  musicFileInput.value = '';
  if (musicState.currentIndex === -1 && musicState.tracks.length > 0) {
    playTrack(0);
  } else {
    renderMusicPlaylist();
  }
});

musicPlayButton.addEventListener('click', () => {
  if (musicState.currentIndex === -1) {
    playTrack(0);
    return;
  }
  if (musicState.playing) {
    musicAudio.pause();
    musicState.playing = false;
  } else {
    musicAudio.play().catch(() => {});
    musicState.playing = true;
  }
  updateMusicNowPlaying();
});
musicPrevButton.addEventListener('click', () => {
  if (musicState.tracks.length === 0) return;
  playTrack((musicState.currentIndex - 1 + musicState.tracks.length) % musicState.tracks.length);
});
musicNextButton.addEventListener('click', () => {
  if (musicState.tracks.length === 0) return;
  playTrack((musicState.currentIndex + 1) % musicState.tracks.length);
});
musicAudio.addEventListener('ended', () => {
  if (musicState.currentIndex < musicState.tracks.length - 1) {
    playTrack(musicState.currentIndex + 1);
  } else {
    musicState.playing = false;
    updateMusicNowPlaying();
  }
});
musicAudio.addEventListener('timeupdate', () => {
  if (Number.isFinite(musicAudio.duration) && musicAudio.duration > 0) {
    musicSeekSlider.value = String(Math.round((musicAudio.currentTime / musicAudio.duration) * 100));
  }
  musicTimeLabel.textContent = `${formatTrackTime(musicAudio.currentTime)} / ${formatTrackTime(musicAudio.duration)}`;
});
musicSeekSlider.addEventListener('input', () => {
  if (Number.isFinite(musicAudio.duration) && musicAudio.duration > 0) {
    musicAudio.currentTime = (Number(musicSeekSlider.value) / 100) * musicAudio.duration;
  }
});

// ---------- AI chat history ----------

function persistChatConversations() {
  if (chatHistorySaveTimer) clearTimeout(chatHistorySaveTimer);
  chatHistorySaveTimer = setTimeout(async () => {
    try {
      await fetch('/api/local-data/chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations: chatConversations })
      });
    } catch {
      // Best effort local persistence.
    }
  }, 300);
}

function conversationTitleFromMessages(messages) {
  const firstUser = messages.find((message) => message.role === 'user');
  const text = (firstUser?.content || 'Conversation').trim().replace(/\s+/g, ' ');
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
}

function saveCurrentConversation({ provider = '', model = '' } = {}) {
  if (chatHistory.length === 0) return;
  const now = new Date().toISOString();
  if (!currentConversationId) {
    currentConversationId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    chatConversations.unshift({
      id: currentConversationId,
      title: conversationTitleFromMessages(chatHistory),
      createdAt: now,
      updatedAt: now,
      provider,
      model,
      messages: chatHistory.slice()
    });
  } else {
    const conversation = chatConversations.find((entry) => entry.id === currentConversationId);
    if (conversation) {
      conversation.messages = chatHistory.slice();
      conversation.updatedAt = now;
      if (provider) conversation.provider = provider;
      if (model) conversation.model = model;
    }
  }
  chatConversations = chatConversations.slice(0, 100);
  persistChatConversations();
  renderChatHistoryList();
}

function loadConversation(conversationId) {
  const conversation = chatConversations.find((entry) => entry.id === conversationId);
  if (!conversation) return;
  currentConversationId = conversation.id;
  chatHistory = conversation.messages.slice();
  messagesEl.innerHTML = '';
  chatHistory.forEach((message) => renderMessage(message.role, message.content));
  renderChatHistoryList();
  chatHistoryPanel.classList.add('hidden');
}

function renderChatHistoryList() {
  chatHistoryList.innerHTML = '';
  if (chatConversations.length === 0) {
    const li = document.createElement('li');
    li.className = 'status-text';
    li.textContent = 'No saved conversations yet.';
    chatHistoryList.appendChild(li);
    return;
  }
  chatConversations.forEach((conversation) => {
    const li = document.createElement('li');
    li.className = `chat-history-item${conversation.id === currentConversationId ? ' active' : ''}`;
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'chat-history-open';
    const title = document.createElement('strong');
    title.textContent = conversation.title || 'Conversation';
    const detail = document.createElement('span');
    detail.className = 'status-text';
    const count = conversation.messages.length;
    detail.textContent = `${new Date(conversation.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • ${count} message${count === 1 ? '' : 's'}`;
    open.appendChild(title);
    open.appendChild(detail);
    open.addEventListener('click', () => loadConversation(conversation.id));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-entry-action';
    remove.textContent = '✕';
    remove.setAttribute('aria-label', `Delete conversation ${conversation.title}`);
    remove.addEventListener('click', (event) => {
      event.stopPropagation();
      chatConversations = chatConversations.filter((entry) => entry.id !== conversation.id);
      if (currentConversationId === conversation.id) currentConversationId = null;
      persistChatConversations();
      renderChatHistoryList();
    });
    li.appendChild(open);
    li.appendChild(remove);
    chatHistoryList.appendChild(li);
  });
}

async function loadChatConversationsFromServer() {
  try {
    const response = await fetch('/api/local-data/chat-history');
    const payload = await response.json();
    if (response.ok && payload.ok) {
      chatConversations = Array.isArray(payload.conversations) ? payload.conversations : [];
    }
  } catch {
    chatConversations = [];
  }
  renderChatHistoryList();
}

chatHistoryButton.addEventListener('click', () => {
  const wasHidden = chatHistoryPanel.classList.contains('hidden');
  chatHistoryPanel.classList.toggle('hidden', !wasHidden);
  if (wasHidden) renderChatHistoryList();
});
chatHistoryClearButton.addEventListener('click', () => {
  chatConversations = [];
  currentConversationId = null;
  persistChatConversations();
  renderChatHistoryList();
});

// ---------- Init ----------

function initShellExtras() {
  activeSpace = Math.min(SPACE_COUNT, Math.max(1, Number(shellState.preferences.activeSpace) || 1));
  renderSpacesSwitcher();
  refreshSpaceVisibility();
  updateNotificationsBadge();
  renderNotificationCenter();
  updateWifiStatus();
  initBatteryStatus();
  globalVolume = typeof shellState.preferences.volume === 'number'
    ? Math.min(1, Math.max(0, shellState.preferences.volume))
    : 0.8;
  applyVolume();
  syncSystemVolume();
  renderAlarmsList();
  if (shellState.preferences.locked) {
    showLockScreen();
  }
  loadChatConversationsFromServer();
  setInterval(checkAlarms, 15000);
  setInterval(() => {
    if (!document.getElementById('windowCalendar').classList.contains('hidden')) tickBigClock();
  }, 1000);
  tickBigClock();
}
