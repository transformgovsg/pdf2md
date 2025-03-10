#! /usr/bin/env node

import { createWriteStream, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import chalk from 'chalk';
import wrap from 'wrap-ansi';

import pkg from '../package.json' with { type: 'json' };
import AzureDocumentIntelligenceClient from './azure-document-intelligence-client.js';
import { loadConfig } from './config.js';
import { arg, format } from './helper.js';
import OpenAILLM from './openai-llm.js';

const USAGE = format(`
  ${pkg.description}
  
  ${chalk.bold('Usage')}: pdf2md [OPTIONS] <path-to-pdf>

  ${chalk.bold('Options')}:
    -v, --version  Show pdf2md version
    -h, --help     Show help
`);

async function main() {
  const args = arg(process.argv.slice(2), {
    '--version': Boolean,
    '-v': '--version',
    '--help': Boolean,
    '-h': '--help',
  });

  if (args['--version']) {
    console.log(`pdf2md version ${pkg.version}`);
    return;
  }

  if (args._.length === 0 || args['--help']) {
    console.log(wrap(USAGE, Math.min(process.stdout.columns, 80)));
    return;
  }

  const filepath = resolve(args._[0]);
  if (!existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    process.exit(1);
  }

  const config = loadConfig();

  const client = new AzureDocumentIntelligenceClient({
    apiKey: config.AZURE_DOCUMENT_INTELLIGENCE_API_KEY,
    endpoint: config.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
  });

  const llm = new OpenAILLM({
    apiKey: config.OPENAI_API_KEY,
    baseURL: config.OPENAI_API_BASE_URL,
  });

  const base64Source = readFileSync(filepath, 'base64');

  console.log('Converting PDF to markdown...');
  const result = await client.analyze(base64Source);

  const outputPath = filepath.replace('.pdf', '.md');
  const fileStream = createWriteStream(outputPath);

  console.log('Formatting markdown...');
  for await (const chunk of llm.chat([
    {
      role: 'system',
      content: format(`
        You are an AI assistant that formats Markdown content to follow proper Markdown syntax and structure. Your task is to:
        - Strictly preserve the original content without rewording or altering the meaning.
        - Fix any Markdown syntax issues, such as incorrect headings, bullets, lists, code blocks, tables, bold/italic formatting, and links.
        - Remove any \`<!-- PageBreak -->\` comments.
        - Replace unusual square bullets (e.g., ☐, □) with proper Markdown list syntax (- or *).
        - Output only the cleaned and formatted Markdown without additional comments or explanations.
      `),
    },
    {
      role: 'user',
      content: result,
    },
  ])) {
    if (!chunk) {
      continue;
    }

    if (!fileStream.write(chunk)) {
      await new Promise<void>((resolve) => fileStream.once('drain', resolve));
    }
  }

  fileStream.end();

  console.log(chalk.green('Successfully converted PDF to Markdown!'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
