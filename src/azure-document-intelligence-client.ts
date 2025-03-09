import type {
  AnalyzeOperationOutput,
  DocumentIntelligenceClient,
} from '@azure-rest/ai-document-intelligence';
import DocumentIntelligence, {
  getLongRunningPoller,
  isUnexpected,
} from '@azure-rest/ai-document-intelligence';

export default class AzureDocumentIntelligenceClient {
  #client: DocumentIntelligenceClient;

  constructor(options: { apiKey: string; endpoint: string }) {
    this.#client = DocumentIntelligence(options.endpoint, { key: options.apiKey });
  }

  /**
   * Analyzes the given base64 source and returns the content as markdown.
   *
   * @param base64Source - The base64 source to analyze.
   */
  async analyze(base64Source: string) {
    const initialResponse = await this.#client
      .path('/documentModels/{modelId}:analyze', 'prebuilt-layout')
      .post({
        contentType: 'application/json',
        body: { base64Source },
        queryParameters: { outputContentFormat: 'markdown' },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = getLongRunningPoller(this.#client, initialResponse);
    const result = ((await poller.pollUntilDone()).body as AnalyzeOperationOutput).analyzeResult;

    if (!result) {
      throw new Error('Expected analyze result');
    }

    return result.content;
  }
}
