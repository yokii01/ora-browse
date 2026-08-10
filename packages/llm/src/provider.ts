/**
 * @ora/llm - LLM Provider Abstraction Layer
 * 
 * Supports multiple LLM providers including:
 * - OpenAI-compatible APIs
 * - NVIDIA NIM (Nemotron)
 * - Local models via Ollama
 * - OpenRouter
 */

export interface LLMProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  
  generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult>;
  chat(messages: ChatMessage[], options?: GenerationOptions): Promise<ChatResult>;
  embed(text: string): Promise<number[]>;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  stream?: boolean;
}

export interface GenerationResult {
  text: string;
  usage: TokenUsage;
  finishReason: string;
}

export interface ChatResult {
  message: ChatMessage;
  usage: TokenUsage;
  finishReason: string;
  text?: string; // Added for compatibility with GenerationResult
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMConfig {
  provider: 'nvidia' | 'openai' | 'ollama' | 'openrouter';
  baseUrl?: string;
  apiKey: string;
  model: string;
  plannerModel?: string;
  actionModel?: string;
  extractionModel?: string;
  verificationModel?: string;
}

// Type definitions for API responses
interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string | null;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

// NVIDIA NIM Provider Implementation
export class NVIDIANIMProvider implements LLMProvider {
  readonly name = 'nvidia-nim';
  readonly baseUrl: string;
  readonly apiKey: string;
  model: string;

  constructor(config: { baseUrl: string; apiKey: string; model: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.model = config.model;
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult> {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful AI assistant for browser automation.' },
      { role: 'user', content: prompt }
    ];
    
    const result = await this.chat(messages, options);
    return {
      text: result.message.content,
      usage: result.usage,
      finishReason: result.finishReason
    };
  }

  async chat(messages: ChatMessage[], options?: GenerationOptions): Promise<ChatResult> {
    const url = `${this.baseUrl}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP ?? 1.0,
        stop: options?.stopSequences,
        stream: options?.stream ?? false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA NIM API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid API response: missing choices array');
    }

    const choice = data.choices[0];
    const content = choice.message.content ?? '';
    
    return {
      message: {
        role: 'assistant',
        content
      },
      text: content, // Added for GenerationResult compatibility
      usage: {
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        totalTokens: data.usage?.total_tokens ?? 0
      },
      finishReason: choice.finish_reason
    };
  }

  async embed(text: string): Promise<number[]> {
    const url = `${this.baseUrl}/embeddings`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'nvidia/nv-embedqa-e5-v5',
        input: [text],
        input_type: 'query'
      })
    });

    if (!response.ok) {
      throw new Error(`NVIDIA Embedding API Error: ${response.status}`);
    }

    const data = await response.json() as EmbeddingResponse;
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid embedding response: missing data array');
    }
    
    return data.data[0].embedding;
  }
}

// OpenAI-Compatible Provider
export class OpenAICompatibleProvider implements LLMProvider {
  readonly name = 'openai-compatible';
  readonly baseUrl: string;
  readonly apiKey: string;
  model: string;

  constructor(config: { baseUrl: string; apiKey: string; model: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.model = config.model;
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<GenerationResult> {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      { role: 'user', content: prompt }
    ];
    
    const result = await this.chat(messages, options);
    return {
      text: result.message.content,
      usage: result.usage,
      finishReason: result.finishReason
    };
  }

  async chat(messages: ChatMessage[], options?: GenerationOptions): Promise<ChatResult> {
    const url = `${this.baseUrl}/v1/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        top_p: options?.topP ?? 1.0,
        stop: options?.stopSequences,
        stream: options?.stream ?? false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid API response: missing choices array');
    }

    const choice = data.choices[0];
    const content = choice.message.content ?? '';
    
    return {
      message: {
        role: 'assistant',
        content
      },
      text: content, // Added for GenerationResult compatibility
      usage: {
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        totalTokens: data.usage?.total_tokens ?? 0
      },
      finishReason: choice.finish_reason
    };
  }

  async embed(text: string): Promise<number[]> {
    const url = `${this.baseUrl}/v1/embeddings`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: [text]
      })
    });

    if (!response.ok) {
      throw new Error(`Embedding API Error: ${response.status}`);
    }

    const data = await response.json() as EmbeddingResponse;
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid embedding response: missing data array');
    }
    
    return data.data[0].embedding;
  }
}

// Factory function to create providers
export function createLLMProvider(config: LLMConfig): LLMProvider {
  switch (config.provider) {
    case 'nvidia':
      return new NVIDIANIMProvider({
        baseUrl: config.baseUrl || 'https://integrate.api.nvidia.com/v1',
        apiKey: config.apiKey,
        model: config.model
      });
    case 'openai':
    case 'ollama':
    case 'openrouter':
      return new OpenAICompatibleProvider({
        baseUrl: config.baseUrl || getDefaultBaseUrl(config.provider),
        apiKey: config.apiKey,
        model: config.model
      });
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

function getDefaultBaseUrl(provider: string): string {
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com';
    case 'ollama':
      return 'http://localhost:11434';
    case 'openrouter':
      return 'https://openrouter.ai/api';
    default:
      return '';
  }
}

export { NVIDIANIMProvider as NVIDIAProvider };
export { OpenAICompatibleProvider as OpenAIProvider };
