const GROUPS = {
  major: 'Major cloud LLM providers',
  regional: 'Regional & emerging providers (bundled plugins)',
  local: 'Open-source / local runtimes (offline)',
  aggregators: 'Aggregators'
};

const COPILOT_TOKEN_ENV_VARS = ['COPILOT_GITHUB_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'];

const providerCatalog = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    category: GROUPS.major,
    adapterType: 'anthropic',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    baseUrlEnv: 'ANTHROPIC_BASE_URL',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    requiresApiKey: true,
    models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-haiku']
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    category: GROUPS.major,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.openai.com/v1',
    baseUrlEnv: 'OPENAI_BASE_URL',
    apiKeyEnv: 'OPENAI_API_KEY',
    requiresApiKey: true,
    models: ['gpt-5.5', 'gpt-5.4', 'gpt-4o', 'chatgpt-codex']
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: GROUPS.major,
    adapterType: 'gemini-native',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    baseUrlEnv: 'GEMINI_BASE_URL',
    apiKeyEnv: 'GEMINI_API_KEY',
    requiresApiKey: true,
    models: ['gemini-3-pro', 'gemini-3-flash', 'gemini-2.5-pro', 'gemini-2.5-flash']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    category: GROUPS.major,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    baseUrlEnv: 'DEEPSEEK_BASE_URL',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    requiresApiKey: true,
    models: ['deepseek-v4-flash', 'deepseek-reasoner', 'deepseek-chat']
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    category: GROUPS.major,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.x.ai/v1',
    baseUrlEnv: 'XAI_BASE_URL',
    apiKeyEnv: 'XAI_API_KEY',
    requiresApiKey: true,
    models: ['grok-4.3', 'grok-4']
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    category: GROUPS.major,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    baseUrlEnv: 'MISTRAL_BASE_URL',
    apiKeyEnv: 'MISTRAL_API_KEY',
    requiresApiKey: true,
    models: ['mistral-large-latest', 'open-mixtral-8x7b']
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI (Kimi)',
    category: GROUPS.regional,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    baseUrlEnv: 'MOONSHOT_BASE_URL',
    apiKeyEnv: 'MOONSHOT_API_KEY',
    requiresApiKey: true,
    models: ['kimi-k2.5', 'kimi-k2-thinking', 'kimi-k2-turbo']
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    category: GROUPS.regional,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.minimaxi.chat/v1',
    baseUrlEnv: 'MINIMAX_BASE_URL',
    apiKeyEnv: 'MINIMAX_API_KEY',
    requiresApiKey: true,
    models: ['MiniMax-M3', 'MiniMax-VL-01', 'MiniMax-2.7']
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI (GLM)',
    category: GROUPS.regional,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    baseUrlEnv: 'ZHIPU_BASE_URL',
    apiKeyEnv: 'ZHIPU_API_KEY',
    requiresApiKey: true,
    models: ['glm-4.7-flash', 'glm-4.7', 'glm-4']
  },
  {
    id: 'volcano',
    name: 'Volcano Engine / BytePlus',
    category: GROUPS.regional,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    baseUrlEnv: 'VOLCANO_BASE_URL',
    apiKeyEnv: 'VOLCANO_API_KEY',
    requiresApiKey: true,
    models: ['doubao-seed-1.8', 'ark-code-latest', 'seed-1.8']
  },
  {
    id: 'qwen',
    name: 'Alibaba Cloud (Qwen)',
    category: GROUPS.regional,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    baseUrlEnv: 'QWEN_BASE_URL',
    apiKeyEnv: 'QWEN_API_KEY',
    requiresApiKey: true,
    models: [
      'qwen-portal-coder',
      'qwen-portal-vision',
      // Exact portal model IDs can differ by account and may need adjustment.
      'qwen-plus',
      'qwen-max'
    ]
  },
  {
    id: 'baidu',
    name: 'Baidu Qianfan',
    category: GROUPS.regional,
    adapterType: 'baidu',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://qianfan.baidubce.com/v2',
    baseUrlEnv: 'BAIDU_BASE_URL',
    apiKeyEnv: 'BAIDU_API_KEY',
    apiSecretEnv: 'BAIDU_SECRET_KEY',
    requiresApiKey: true,
    models: ['ernie-4.5', 'ernie-speed']
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi (MiMo)',
    category: GROUPS.regional,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.xiaomi.com/mimo/v1',
    baseUrlEnv: 'XIAOMI_BASE_URL',
    apiKeyEnv: 'XIAOMI_API_KEY',
    requiresApiKey: true,
    models: ['mimo-v2.5-pro', 'mimo-v2-flash']
  },
  {
    id: 'ollama',
    name: 'Ollama (local)',
    category: GROUPS.local,
    adapterType: 'openai',
    authMethod: 'none',
    defaultBaseUrl: 'http://host.docker.internal:11434/v1',
    baseUrlEnv: 'OLLAMA_BASE_URL',
    apiKeyEnv: 'OLLAMA_API_KEY',
    requiresApiKey: false,
    models: ['llama3.3:70b', 'qwen2.5:32b', 'gemma2']
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (local)',
    category: GROUPS.local,
    adapterType: 'openai',
    authMethod: 'none',
    defaultBaseUrl: 'http://host.docker.internal:1234/v1',
    baseUrlEnv: 'LMSTUDIO_BASE_URL',
    apiKeyEnv: 'LMSTUDIO_API_KEY',
    requiresApiKey: false,
    models: ['local-model', 'qwen2.5-7b-instruct']
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: GROUPS.local,
    adapterType: 'github-copilot',
    authMethod: 'oauth-device',
    defaultBaseUrl: 'https://api.githubcopilot.com',
    baseUrlEnv: 'GITHUB_COPILOT_BASE_URL',
    requiresApiKey: false,
    defaultModel: 'github-copilot/gpt-4o',
    models: [
      'github-copilot/gpt-4o',
      'github-copilot/gpt-4.1',
      'github-copilot/gpt-5-mini',
      'github-copilot/gpt-5.4',
      'github-copilot/claude-opus-4.7',
      'github-copilot/claude-sonnet-4.6',
      'github-copilot/gemini-3.5-flash',
      'github-copilot/gemini-2.5-pro'
    ]
  },
  {
    id: 'custom-openai',
    name: 'Custom OpenAI-compatible endpoint',
    category: GROUPS.local,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://api.openai.com/v1',
    baseUrlEnv: 'CUSTOM_OPENAI_BASE_URL',
    apiKeyEnv: 'CUSTOM_OPENAI_API_KEY',
    requiresApiKey: false,
    allowUserApiKey: true,
    allowUserBaseUrl: true,
    models: ['custom-model-1', 'custom-model-2']
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    category: GROUPS.aggregators,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
    baseUrlEnv: 'NVIDIA_NIM_BASE_URL',
    apiKeyEnv: 'NVIDIA_NIM_API_KEY',
    requiresApiKey: true,
    models: ['meta/llama-3.1-70b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1']
  },
  {
    id: 'nous-portal',
    name: 'Nous Portal',
    category: GROUPS.aggregators,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://inference-api.nousresearch.com/v1',
    baseUrlEnv: 'NOUS_PORTAL_BASE_URL',
    apiKeyEnv: 'NOUS_PORTAL_API_KEY',
    requiresApiKey: true,
    models: ['Hermes-3-Llama-3.1-70B', 'DeepHermes-3-Llama-3-8B-Preview']
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: GROUPS.aggregators,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    baseUrlEnv: 'OPENROUTER_BASE_URL',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    requiresApiKey: true,
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'nvidia/nemotron-3']
  },
  {
    id: 'vercel-ai-gateway',
    name: 'Vercel AI Gateway',
    category: GROUPS.aggregators,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://gateway.ai.vercel.app/v1',
    baseUrlEnv: 'VERCEL_AI_GATEWAY_BASE_URL',
    apiKeyEnv: 'VERCEL_AI_GATEWAY_API_KEY',
    requiresApiKey: true,
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Router',
    category: GROUPS.aggregators,
    adapterType: 'openai',
    authMethod: 'static-key',
    defaultBaseUrl: 'https://router.huggingface.co/v1',
    baseUrlEnv: 'HUGGINGFACE_BASE_URL',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    requiresApiKey: true,
    models: ['openai/gpt-oss-120b:cerebras', 'Qwen/Qwen3-Coder-480B-A35B-Instruct:fireworks-ai']
  }
];

function isConfigured(provider, configuredProviders = {}) {
  if (provider.id in configuredProviders) {
    return Boolean(configuredProviders[provider.id]);
  }

  if (provider.authMethod === 'none') {
    return true;
  }

  if (provider.authMethod === 'oauth-device') {
    return COPILOT_TOKEN_ENV_VARS.some((envKey) => String(process.env[envKey] || '').trim().length > 0);
  }

  const requiredValues = [provider.apiKeyEnv, provider.apiSecretEnv]
    .filter(Boolean)
    .map((envKey) => process.env[envKey]);

  return requiredValues.every((value) => String(value || '').trim().length > 0);
}

function getProviders(options = {}) {
  const configuredProviders = options.configuredProviders || {};

  return providerCatalog.map((provider) => ({
    id: provider.id,
    name: provider.name,
    category: provider.category,
    adapterType: provider.adapterType,
    authMethod: provider.authMethod,
    defaultBaseUrl: process.env[provider.baseUrlEnv] || provider.defaultBaseUrl,
    baseUrlEnv: provider.baseUrlEnv,
    apiKeyEnv: provider.apiKeyEnv,
    apiSecretEnv: provider.apiSecretEnv,
    allowUserApiKey: Boolean(provider.allowUserApiKey),
    allowUserBaseUrl: Boolean(provider.allowUserBaseUrl),
    configured: isConfigured(provider, configuredProviders),
    requiresApiKey: provider.requiresApiKey,
    models: provider.models
  }));
}

function getProviderById(providerId) {
  return providerCatalog.find((provider) => provider.id === providerId);
}

module.exports = { GROUPS, getProviders, getProviderById, providerCatalog };
