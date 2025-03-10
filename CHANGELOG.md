# Changelog

All notable changes to this project will be documented in this file.

## 0.3.0 (2025-03-11)

### Feature ✨

- feat: enhance format markdown system prompt to strictly preserve the original content ([#9](https://github.com/transformgovsg/pdf2md/pull/9)) ([6565db5](https://github.com/transformgovsg/pdf2md/commit/6565db5822a513fe71d372b74ed0da55cbd1b7a5))

## 0.2.0 (2025-03-10)

### Feature ✨

- feat: set default value for `OPENAI_CHAT_MODEL` environment variable to `o3-mini` ([#7](https://github.com/transformgovsg/pdf2md/pull/7)) ([3670011](https://github.com/transformgovsg/pdf2md/commit/3670011fe9269b37a7976fd55437d74b25fe7f52))

## 0.1.1 (2025-03-09)

### Bug Fixes 🐞

- fix: remove unnecessary `console.log` ([#4](https://github.com/transformgovsg/pdf2md/pull/4)) ([83f4907](https://github.com/transformgovsg/pdf2md/commit/83f4907ec34f09a78857585ade7db9da006fcc6b))

## 0.1.0 (2025-03-09)

### Initial Release 🚀

This initial release of `@transformgovsg/pdf2md` provides a CLI tool that converts PDF files into Markdown. It leverages Azure Document Intelligence for text extraction and OpenAI for Markdown formatting.

To use the CLI tool, run the following command:

```sh
pnpm dlx @transformgovsg/pdf2md <path-to-file>
```
