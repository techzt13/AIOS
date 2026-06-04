const providerCatalog = [
  {
    id: 'openai',
    name: 'OpenAI',
    defaultBaseUrl: 'https://api.openai.com/v1',
    baseUrlEnv: 'OPENAI_BASE_URL',
    apiKeyEnv: 'OPENAI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['gpt-4.1', 'gpt-4o', 'gpt-4o-mini']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    baseUrlEnv: 'ANTHROPIC_BASE_URL',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    requiresApiKey: true,
    openaiCompatible: false,
    models: ['claude-sonnet-4-5', 'claude-opus-4-1']
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    baseUrlEnv: 'GEMINI_BASE_URL',
    apiKeyEnv: 'GEMINI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['gemini-2.5-flash', 'gemini-2.5-pro']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    baseUrlEnv: 'DEEPSEEK_BASE_URL',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['deepseek-chat', 'deepseek-reasoner']
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    defaultBaseUrl: 'https://api.x.ai/v1',
    baseUrlEnv: 'XAI_BASE_URL',
    apiKeyEnv: 'XAI_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['grok-3', 'grok-3-mini']
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    baseUrlEnv: 'OPENROUTER_BASE_URL',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet']
  },
  {
    id: 'mistral',
    name: 'Mistral',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    baseUrlEnv: 'MISTRAL_BASE_URL',
    apiKeyEnv: 'MISTRAL_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['mistral-large-latest', 'ministral-8b-latest']
  },
  {
    id: 'moonshot',
    name: 'Moonshot / Kimi',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    baseUrlEnv: 'MOONSHOT_BASE_URL',
    apiKeyEnv: 'MOONSHOT_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['moonshot-v1-8k', 'kimi-k2']
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    defaultBaseUrl: 'https://api.minimaxi.chat/v1',
    baseUrlEnv: 'MINIMAX_BASE_URL',
    apiKeyEnv: 'MINIMAX_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['MiniMax-M1-80k', 'MiniMax-Text-01']
  },
  {
    id: 'qwen',
    name: 'Qwen / Alibaba',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    baseUrlEnv: 'QWEN_BASE_URL',
    apiKeyEnv: 'QWEN_API_KEY',
    requiresApiKey: true,
    openaiCompatible: true,
    models: ['qwen-plus', 'qwen-max']
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
    name: 'Ollama',
    defaultBaseUrl: 'http://host.docker.internal:11434/v1',
    baseUrlEnv: 'OLLAMA_BASE_URL',
    apiKeyEnv: 'OLLAMA_API_KEY',
    requiresApiKey: false,
    openaiCompatible: true,
    models: ['llama3.1', 'qwen2.5-coder']
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    defaultBaseUrl: 'http://host.docker.internal:1234/v1',
    baseUrlEnv: 'LMSTUDIO_BASE_URL',
    apiKeyEnv: 'LMSTUDIO_API_KEY',
    requiresApiKey: false,
    openaiCompatible: true,
    models: ['local-model', 'qwen2.5-7b-instruct']
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
