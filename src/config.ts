import { type DotenvParseOutput, parse } from 'dotenv';
import { readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

import { isOpenAIChatModel } from './openai-llm.js';

export interface Config {
  /**
   * The endpoint to Azure Document Intelligence.
   */
  AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT: string;
  /**
   * The API key for Azure Document Intelligence API.
   */
  AZURE_DOCUMENT_INTELLIGENCE_API_KEY: string;
  /**
   * The base URL for OpenAI API.
   */
  OPENAI_API_BASE_URL: string;
  /**
   * The API key for OpenAI API.
   */
  OPENAI_API_KEY: string;
  /**
   * The model for OpenAI API.
   */
  OPENAI_CHAT_MODEL: string;
}

/**
 * Loads the configuration from the environment variables.
 */
export function loadConfig(): Config {
  const env = loadEnv();

  const AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT = env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
  if (!AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT) {
    throw new Error("'AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT' environment variable is required.");
  }

  const AZURE_DOCUMENT_INTELLIGENCE_API_KEY = env.AZURE_DOCUMENT_INTELLIGENCE_API_KEY;
  if (!AZURE_DOCUMENT_INTELLIGENCE_API_KEY) {
    throw new Error("'AZURE_DOCUMENT_INTELLIGENCE_API_KEY' environment variable is required.");
  }

  const OPENAI_API_BASE_URL = env.OPENAI_API_BASE_URL;
  if (!OPENAI_API_BASE_URL) {
    throw new Error("'OPENAI_API_BASE_URL' environment variable is required.");
  }

  const OPENAI_API_KEY = env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error("'OPENAI_API_KEY' environment variable is required.");
  }

  const OPENAI_CHAT_MODEL = env.OPENAI_CHAT_MODEL || 'o3-mini';
  if (!isOpenAIChatModel(OPENAI_CHAT_MODEL)) {
    throw new Error(
      `'OPENAI_CHAT_MODEL' environment variable contains invalid or unsupported chat model: ${OPENAI_CHAT_MODEL}`,
    );
  }

  return {
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
    AZURE_DOCUMENT_INTELLIGENCE_API_KEY,

    OPENAI_API_BASE_URL,
    OPENAI_API_KEY,
    OPENAI_CHAT_MODEL,
  };
}

/**
 * Loads the environment variables from the environment file.
 */
function loadEnv() {
  const mode =
    process.env.NODE_ENV === 'production'
      ? 'production'
      : process.env.NODE_ENV === 'test'
        ? 'test'
        : 'development';

  const envs = [
    `.env.${mode}.local`,
    // Do not include `.env.local` for test environment.
    mode !== 'test' && `.env.local`,
    `.env.${mode}`,
    `.env`,
  ].filter(Boolean) as string[];

  const parsedEnv: DotenvParseOutput = {};
  for (const env of envs) {
    const filepath = join(process.cwd(), env);

    try {
      // Ensure that we target file only.
      const stat = statSync(filepath);
      if (!stat.isFile) {
        continue;
      }

      const content = readFileSync(filepath, 'utf-8');
      const result = parse(content);

      for (const key of Object.keys(result)) {
        if (typeof parsedEnv[key] === 'undefined' && typeof process.env[key] === 'undefined') {
          parsedEnv[key] = result[key];
        }
      }
    } catch (err) {
      if (isSystemError(err) && err.code !== 'ENOENT') {
        throw new Error(`Failed to read environment file: ${relative(process.cwd(), filepath)}`);
      }
    }
  }

  return Object.assign(process.env, parsedEnv);
}

/**
 * Interface for Node.js System errors
 *
 * Node.js generates system errors when exceptions occur within its runtime environment.
 * These usually occur when an application violates an operating system constraint.
 * For example, a system error will occur if an application attempts to read a file that does not exist.
 */
export interface SystemError extends Error {
  /**
   * If present, the address to which a network connection failed.
   */
  address?: string;
  /**
   * The string error code.
   * Full list: https://man7.org/linux/man-pages/man3/errno.3.html
   */
  code: string;
  /**
   * If present, the file path destination when reporting a file system error.
   */
  dest?: string;
  /**
   * The system-provided error number.
   */
  errno: number | string;
  /**
   * If present, extra details about the error condition.
   */
  info?: unknown;
  /**
   * If present, the file path when reporting a file system error.
   */
  path?: string;
  /**
   * If present, the network connection port that is not available.
   */
  port?: string;
  /**
   * The name of the system call that triggered the error.
   */
  syscall: string;
}

export function isSystemError(error: unknown): error is SystemError {
  return error instanceof Error && 'code' in error && 'syscall' in error;
}
