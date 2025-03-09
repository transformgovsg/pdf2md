import { OpenAI as LLM } from 'openai';

export interface OpenAIChatSystemMessage {
  content: string;
  role: LLM.Chat.ChatCompletionSystemMessageParam['role'];
}

export interface OpenAIChatAssistantMessage {
  content: string;
  role: LLM.Chat.ChatCompletionAssistantMessageParam['role'];
}

export interface OpenAIChatUserMessage {
  content: string;
  role: LLM.Chat.ChatCompletionUserMessageParam['role'];
}

export type OpenAIChatMessage =
  | OpenAIChatSystemMessage
  | OpenAIChatAssistantMessage
  | OpenAIChatUserMessage;

export default class OpenAILLM {
  #llm: LLM;

  constructor(options: { apiKey: string; baseURL: string }) {
    this.#llm = new LLM({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
    });
  }

  /**
   * Invokes chat completion with the LLM with the given messages and model.
   *
   * @param messages - The messages to send to the LLM.
   * @param model - The model to use. Default is `o3-mini`.
   */
  async *chat(messages: OpenAIChatMessage[], model: LLM.ChatModel = 'o3-mini') {
    const stream = await this.#llm.chat.completions.create({
      messages,
      model,
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0].delta.content;
    }
  }
}

export const OPENAI_CHAT_MODELS = [
  'o3-mini',
  'o3-mini-2025-01-31',
  'o1',
  'o1-2024-12-17',
  'o1-preview',
  'o1-preview-2024-09-12',
  'o1-mini',
  'o1-mini-2024-09-12',
  'gpt-4.5-preview',
  'gpt-4.5-preview-2025-02-27',
  'gpt-4o',
  'gpt-4o-2024-11-20',
  'gpt-4o-2024-08-06',
  'gpt-4o-2024-05-13',
  'gpt-4o-audio-preview',
  'gpt-4o-audio-preview-2024-10-01',
  'gpt-4o-audio-preview-2024-12-17',
  'gpt-4o-mini-audio-preview',
  'gpt-4o-mini-audio-preview-2024-12-17',
  'chatgpt-4o-latest',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4-turbo',
  'gpt-4-turbo-2024-04-09',
  'gpt-4-0125-preview',
  'gpt-4-turbo-preview',
  'gpt-4-1106-preview',
  'gpt-4-vision-preview',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-16k-0613',
] as const;

export function isOpenAIChatModel(model: string): model is LLM.ChatModel {
  return OPENAI_CHAT_MODELS.includes(model as LLM.ChatModel);
}
