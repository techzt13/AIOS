const providerCatalog = [
  {
    id: 'openai',
    name: 'OpenAI',
    defaultBaseUrl: 'https://api.openai.com/v1',
    baseUrlEnv: 'OPENAI_BASE_URL',
    apiKeyEnv: 'OPENAI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['gpt-5.5', 'gpt-5.4', 'gpt-4o', 'gpt-4o-mini', 'chatgpt-codex']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    // Anthropic exposes an OpenAI-compatible endpoint at /v1/chat/completions.
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    baseUrlEnv: 'ANTHROPIC_BASE_URL',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: [
      'claude-opus-4-6',
      'claude-sonnet-4-6',
      'claude-3-5-sonnet',
      'claude-3-5-haiku',
      'claude-haiku'
    ]
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    baseUrlEnv: 'GEMINI_BASE_URL',
    apiKeyEnv: 'GEMINI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['gemini-3-pro', 'gemini-3-flash', 'gemini-2.5-pro', 'gemini-2.5-flash']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    baseUrlEnv: 'DEEPSEEK_BASE_URL',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['deepseek-v4-flash', 'deepseek-reasoner', 'deepseek-chat']
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    defaultBaseUrl: 'https://api.x.ai/v1',
    baseUrlEnv: 'XAI_BASE_URL',
    apiKeyEnv: 'XAI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['grok-4.3', 'grok-4']
  },
  {
    id: 'mistral',
    name: 'Mistral',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    baseUrlEnv: 'MISTRAL_BASE_URL',
    apiKeyEnv: 'MISTRAL_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['mistral-large-latest', 'open-mixtral-8x7b']
  },
  {
    id: 'moonshot',
    name: 'Moonshot / Kimi',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    baseUrlEnv: 'MOONSHOT_BASE_URL',
    apiKeyEnv: 'MOONSHOT_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['kimi-k2.5', 'kimi-k2-thinking', 'kimi-k2-turbo']
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    defaultBaseUrl: 'https://api.minimaxi.chat/v1',
    baseUrlEnv: 'MINIMAX_BASE_URL',
    apiKeyEnv: 'MINIMAX_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['MiniMax-M3', 'MiniMax-VL-01', 'MiniMax-2.7']
  },
  {
    id: 'zhipu',
    name: 'Zhipu AI (GLM)',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    baseUrlEnv: 'ZHIPU_BASE_URL',
    apiKeyEnv: 'ZHIPU_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['glm-4.7-flash', 'glm-4.7', 'glm-4']
  },
  {
    id: 'volcano',
    name: 'Volcano Engine / BytePlus (Doubao)',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    baseUrlEnv: 'VOLCANO_BASE_URL',
    apiKeyEnv: 'VOLCANO_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['doubao-seed-1.8', 'ark-code-latest', 'seed-1.8']
  },
  {
    id: 'qwen',
    name: 'Qwen / Alibaba',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    baseUrlEnv: 'QWEN_BASE_URL',
    apiKeyEnv: 'QWEN_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['qwen-portal-coder', 'qwen-portal-vision', 'qwen-plus', 'qwen-max']
  },
  {
    id: 'baidu',
    name: 'Baidu (Qianfan)',
    defaultBaseUrl: 'https://qianfan.baidubce.com/v2',
    baseUrlEnv: 'BAIDU_BASE_URL',
    apiKeyEnv: 'BAIDU_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['ernie-4.5', 'ernie-speed']
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi (MiMo)',
    defaultBaseUrl: 'https://api.xiaomi.com/mimo/v1',
    baseUrlEnv: 'XIAOMI_BASE_URL',
    apiKeyEnv: 'XIAOMI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['mimo-v2.5-pro', 'mimo-v2-flash']
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    defaultBaseUrl: 'https://router.huggingface.co/v1',
    baseUrlEnv: 'HUGGINGFACE_BASE_URL',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['openai/gpt-oss-120b:cerebras', 'Qwen/Qwen3-Coder-480B-A35B-Instruct:fireworks-ai']
  },
  {
    id: 'ollama',
    name: 'Ollama (local)',
    defaultBaseUrl: 'http://host.docker.internal:11434/v1',
    baseUrlEnv: 'OLLAMA_BASE_URL',
    apiKeyEnv: 'OLLAMA_API_KEY',
    requiresApiKey: false,
    openaiCompatible: true,
    models: ['llama3.3:70b', 'qwen2.5:32b', 'gemma2']
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (local)',
    defaultBaseUrl: 'http://host.docker.internal:1234/v1',
    baseUrlEnv: 'LMSTUDIO_BASE_URL',
    apiKeyEnv: 'LMSTUDIO_API_KEY',
    requiresApiKey: false,
    openaiCompatible: true,
    models: ['local-model', 'qwen2.5-7b-instruct']
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    defaultBaseUrl: 'https://api.githubcopilot.com',
    baseUrlEnv: 'GITHUB_COPILOT_BASE_URL',
    apiKeyEnv: 'GITHUB_COPILOT_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['gpt-4o', 'claude-3.5-sonnet']
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
    baseUrlEnv: 'NVIDIA_NIM_BASE_URL',
    apiKeyEnv: 'NVIDIA_NIM_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['meta/llama-3.1-70b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1']
  },
  {
    id: 'nous-portal',
    name: 'Nous Portal',
    defaultBaseUrl: 'https://inference-api.nousresearch.com/v1',
    baseUrlEnv: 'NOUS_PORTAL_BASE_URL',
    apiKeyEnv: 'NOUS_PORTAL_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['Hermes-3-Llama-3.1-70B', 'DeepHermes-3-Llama-3-8B-Preview']
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    baseUrlEnv: 'OPENROUTER_BASE_URL',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'nvidia/nemotron-3']
  },
  {
    id: 'vercel-ai-gateway',
    name: 'Vercel AI Gateway',
    defaultBaseUrl: 'https://gateway.ai.vercel.app/v1',
    baseUrlEnv: 'VERCEL_AI_GATEWAY_BASE_URL',
    apiKeyEnv: 'VERCEL_AI_GATEWAY_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet']
  },
  {
    id: 'custom-openai',
    name: 'Custom OpenAI-compatible endpoint',
    defaultBaseUrl: 'https://api.openai.com/v1',
    baseUrlEnv: 'CUSTOM_OPENAI_BASE_URL',
    apiKeyEnv: 'CUSTOM_OPENAI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['custom-model-1', 'custom-model-2']
  }
];

function getProviders() {
  return providerCatalog.map((provider) => ({
    id: provider.id,
    name: provider.name,
    defaultBaseUrl: process.env[provider.baseUrlEnv] || provider.defaultBaseUrl,
    baseUrlEnv: provider.baseUrlEnv,
    apiKeyEnv: provider.apiKeyEnv,
    requiresApiKey: provider.requiresApiKey,
    openaiCompatible: provider.openaiCompatible,
    models: provider.models
  }));
}

function getProviderById(providerId) {
  return providerCatalog.find((provider) => provider.id === providerId);
}

module.exports = { getProviders, getProviderById };
