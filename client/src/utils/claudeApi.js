import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const CLAUDE_API_URL = process.env.REACT_APP_CLAUDE_API_URL;
const CLAUDE_MODEL = process.env.REACT_APP_CLAUDE_MODEL;

export default class ClaudeApiService {
  constructor() {
    this.apiKey = ANTHROPIC_API_KEY;
    this.apiUrl = CLAUDE_API_URL;
    this.model = CLAUDE_MODEL;
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }

  isConfigured() {
    return Boolean(this.apiKey && this.model  && this.apiUrl);
  }

  async makeApiCall(userPrompt, assistantPrompt="", maxTokens=4096) {
    if (!userPrompt) {
      throw new Error('User prompt is required');
    }
    if (!this.isConfigured()) {
      throw new Error('API is not configured');
    }

    const response = null; 
    try {
      response = await this.anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        messages: [
          { role: "user", content: userPrompt },
          { role: "assistant", content: assistantPrompt },
        ],
      });

    } catch (error) {
      console.error('Error making API call:', error);
      
    }
    return null;
  }
}