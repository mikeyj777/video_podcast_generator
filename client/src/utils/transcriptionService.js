// src/utils/transcriptService.js
import { CLAUDE_API_URL } from '../config';

export const generateTranscript = async (sessionId, settings, sources) => {
  try {
    // First, construct the prompt based on settings
    const prompt = constructPrompt(settings, sources);
    
    // Call Claude API
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any required API authentication headers
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: calculateMaxTokens(settings.length),
        temperature: 0.7, // Adjust based on needed creativity level
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const generatedContent = await response.json();

    // Store the transcript in the database
    const transcriptResponse = await fetch('/api/transcripts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        content: generatedContent.completion,
        host_count: parseInt(settings.hosts),
        duration: parseInt(settings.length),
        style: settings.style,
        // Add any other relevant settings from the form
      })
    });

    if (!transcriptResponse.ok) {
      throw new Error(`Failed to save transcript: ${transcriptResponse.statusText}`);
    }

    return generatedContent.completion;

  } catch (error) {
    console.error('Transcript generation failed:', error);
    throw error;
  }
};

function constructPrompt(settings, sources) {
  const sourceContent = sources.map(source => source.content).join('\n\n');
  
  return `
Generate a ${settings.style} conversation between ${settings.hosts} hosts discussing the following sources:

${sourceContent}

Additional parameters:
- Target length: ${settings.length} minutes
- Technical level: ${settings.technicalLevel}
- Use analogies: ${settings.useAnalogies}
- Focus areas: ${Array.from(settings.focusAreas).join(', ')}
- Conversation dynamics: ${settings.dynamics}
- Use citations: ${settings.useCitations}

Please generate a natural-sounding conversation that covers the key points while maintaining the specified style and parameters.
`;
}

function calculateMaxTokens(minutes) {
  // Rough estimation: average speaking rate * minutes * token/word ratio
  const wordsPerMinute = 150;
  const tokenToWordRatio = 1.3;
  return Math.floor(minutes * wordsPerMinute * tokenToWordRatio);
}