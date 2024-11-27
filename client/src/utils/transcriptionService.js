// client/src/utils/transcriptService.js
const API_BASE_URL = process.env.REACT_APP_API_URL

export const generateTranscript = async (sessionId, settings) => {
  try {
    const response = await fetch(`{API_BASE_URL}/sessions/${sessionId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        settings: {
          host_count: parseInt(settings.hosts),
          duration: parseInt(settings.length),
          style: settings.style,
          technical_level: settings.technicalLevel,
          use_analogies: settings.useAnalogies,
          focus_areas: Array.from(settings.focusAreas),
          dynamics: settings.dynamics,
          use_citations: settings.useCitations
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content;

  } catch (error) {
    console.error('Transcript generation failed:', error);
    throw error;
  }
};