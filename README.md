# pdf2md

A CLI tool that converts PDF files into Markdown using Azure Document Intelligence for text extraction and OpenAI for Markdown formatting.

## ✨ Features

- 📜 Converts PDFs into Markdown format
- 🧠 Uses Azure Document Intelligence for text extraction
- 🤖 Enhances Markdown formatting with OpenAI LLM
- 🛠️ Simple CLI usage

## 📋 Prerequisites

Before using pdf2md, ensure you have the following:

- ✅ Node.js installed
- ✅ Azure Document Intelligence API credentials
- ✅ OpenAI API credentials
- ✅ Ensure you have the following environment variables set in your system or in a `.env` file in the current working directory:

```sh
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=<your_azure_endpoint>
AZURE_DOCUMENT_INTELLIGENCE_API_KEY=<your_azure_api_key>
OPENAI_API_BASE_URL=<your_openai_base_url>
OPENAI_API_KEY=<your_openai_api_key>
OPENAI_CHAT_MODEL=<your_openai_chat_model>
```

## ⚡ Quick Start

To convert a PDF file to Markdown without installing locally, run:

```sh
pnpm dlx pdf2md <path-to-pdf>
```

Alternatively, using yarn or npm:

```sh
yarn dlx pdf2md <path-to-pdf>
```

```sh
npx pdf2md <path-to-pdf>
```

Example:

```sh
pnpm dlx pdf2md ./path/to/document.pdf
```

## 📜 License

This project is licensed under the AGPL-3.0-only License.
