import { useState } from "react";
import { generateTranscript,  } from "../../utils/transcriptionService";

export const ConversationGenerator = ({ initialSources, onComplete }) => {
  const [method, setMethod] = useState('generate');
  const [settings, setSettings] = useState({
    hosts: '2',
    length: '15',
    style: 'casual',
    dynamics: 'collaborative',
    showAdvanced: false,
    technicalLevel: '3',
    useAnalogies: true,
    focusAreas: new Set(['findings', 'applications']),
    pacing: 'balanced',
    useCitations: false
  });

  const [uploadedTranscript, setUploadedTranscript] = useState(null);

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async() => {
    try {
        const transcript = await generateTranscript(sessionId, settings, initialSources);
        onComplete(transcript);
      } catch (error) {
        // Handle error appropriately - maybe show an error message to user
        console.error('Failed to generate transcript:', error);
      }
  };

  const handleUpload = () => {
    if (uploadedTranscript) {
      onComplete(uploadedTranscript);
    }
  };

  return (
    <div className="conversation-generator">
      <div className="method-selector">
        <button 
          className={`method-button ${method === 'generate' ? 'active' : ''}`}
          onClick={() => setMethod('generate')}
        >
          Generate New Transcript
        </button>
        <button 
          className={`method-button ${method === 'upload' ? 'active' : ''}`}
          onClick={() => setMethod('upload')}
        >
          Upload Existing Transcript
        </button>
      </div>

      {method === 'generate' ? (
        <div className="generator-form">
          <div className="basic-settings">
            <div className="setting-group">
              <label>Number of Hosts</label>
              <select 
                value={settings.hosts}
                onChange={(e) => handleSettingsChange('hosts', e.target.value)}
              >
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n} Host{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label>Target Length</label>
              <select 
                value={settings.length}
                onChange={(e) => handleSettingsChange('length', e.target.value)}
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Conversation Style</label>
              <div className="radio-group">
                {[
                  { value: 'academic', label: 'Academic/Technical' },
                  { value: 'casual', label: 'Casual Explanation' },
                  { value: 'interview', label: 'Interview Style' },
                  { value: 'educational', label: 'Educational/Teaching' }
                ].map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="style"
                      value={option.value}
                      checked={settings.style === option.value}
                      onChange={(e) => handleSettingsChange('style', e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button 
            className="toggle-advanced"
            onClick={() => handleSettingsChange('showAdvanced', !settings.showAdvanced)}
          >
            {settings.showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {settings.showAdvanced && (
            <div className="advanced-settings">
              {/* Advanced settings content */}
            </div>
          )}

          <button 
            className="generate-button"
            onClick={handleGenerate}
          >
            Generate Transcript
          </button>
        </div>
      ) : (
        <div className="upload-form">
          <div 
            className="upload-area"
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setUploadedTranscript(e.target.result);
                reader.readAsText(file);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="upload-icon">↑</div>
            <p>Drag and drop your transcript file or click to browse</p>
            <input 
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => setUploadedTranscript(e.target.result);
                  reader.readAsText(file);
                }
              }}
              accept=".txt,.doc,.docx,.pdf"
              style={{ display: 'none' }}
            />
          </div>

          <div className="transcript-preview">
            <textarea
              value={uploadedTranscript || ''}
              onChange={(e) => setUploadedTranscript(e.target.value)}
              placeholder="Or paste your transcript here..."
            />
          </div>

          <button 
            className="upload-button"
            onClick={handleUpload}
            disabled={!uploadedTranscript}
          >
            Continue with Uploaded Transcript
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationGenerator;