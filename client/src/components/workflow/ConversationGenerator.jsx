import { useState } from "react";
import { generateTranscript } from "../../utils/transcriptionService";

const TranscriptEditor = ({ transcript, onSave, onClose }) => {
  const [editedTranscript, setEditedTranscript] = useState(transcript);
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Preview & Edit Transcript</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <textarea
            className="transcript-editor"
            value={editedTranscript}
            onChange={(e) => setEditedTranscript(e.target.value)}
            placeholder="Transcript content..."
          />
        </div>
        <div className="modal-footer">
          <button className="button-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="button-primary"
            onClick={() => {
              onSave(editedTranscript);
              onClose();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConversationGenerator = ({ sessionId, initialSources, onComplete }) => {
  const [method, setMethod] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
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
    setIsGenerating(true);
    setGenerationStatus({ type: 'info', message: 'Generating transcript...' });
    
    try {
      const transcript = await generateTranscript(sessionId, settings, initialSources);
      setCurrentTranscript(transcript);
      setGenerationStatus({ 
        type: 'success', 
        message: 'Transcript generated successfully! Use the Preview & Edit button below to review or make changes before proceeding.'
      });
    } catch (error) {
      setGenerationStatus({ 
        type: 'error', 
        message: 'Failed to generate transcript. Please try again.' 
      });
      console.error('Failed to generate transcript:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = () => {
    if (uploadedTranscript) {
      setCurrentTranscript(uploadedTranscript);
      setGenerationStatus({ 
        type: 'success', 
        message: 'Transcript uploaded successfully! Use the Preview & Edit button below to review or make changes before proceeding.'
      });
    }
  };

  const handleSaveTranscript = (editedTranscript) => {
    setCurrentTranscript(editedTranscript);
    onComplete(editedTranscript);
    setGenerationStatus({
      type: 'success',
      message: 'Changes saved successfully. Click Next to proceed to image generation.'
    });
  };

  return (
    <div className="conversation-generator">
      {generationStatus && (
        <div className={`status-message ${generationStatus.type}`}>
          <p>{generationStatus.message}</p>
        </div>
      )}

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
                <option value="1">1 minute</option>
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
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Transcript'}
          </button>

          {currentTranscript && (
            <button 
              className="preview-button"
              onClick={() => setShowEditor(true)}
            >
              Preview & Edit Transcript
            </button>
          )}
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

          {currentTranscript && (
            <button 
              className="preview-button"
              onClick={() => setShowEditor(true)}
            >
              Preview & Edit Transcript
            </button>
          )}
        </div>
      )}

      {showEditor && (
        <TranscriptEditor
          transcript={currentTranscript}
          onSave={handleSaveTranscript}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default ConversationGenerator;