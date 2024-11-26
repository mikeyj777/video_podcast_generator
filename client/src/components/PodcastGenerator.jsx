import React, { useState } from 'react';
import '../styles/PodcastGenerator.css';

const PodcastGenerator = () => {
  const [formData, setFormData] = useState({
    paperUrl: '',
    numHosts: 2,
    isProcessing: false,
    error: null
  });

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUrl(formData.paperUrl)) {
      setFormData(prev => ({
        ...prev,
        error: 'Please enter a valid URL'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      isProcessing: true,
      error: null
    }));

    try {
      // This would be your actual API endpoint
      const response = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperUrl: formData.paperUrl,
          numHosts: formData.numHosts
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start podcast generation');
      }

      const data = await response.json();
      // Handle successful submission
      
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        error: error.message
      }));
    } finally {
      setFormData(prev => ({
        ...prev,
        isProcessing: false
      }));
    }
  };

  return (
    <div className="generator-container">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="input-field">
            <label htmlFor="paperUrl">Academic Paper URL</label>
            <input
              id="paperUrl"
              type="url"
              className="url-input"
              value={formData.paperUrl}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paperUrl: e.target.value,
                error: null
              }))}
              placeholder="https://arxiv.org/pdf/..."
              disabled={formData.isProcessing}
            />
            {formData.error && (
              <div className="error-message">{formData.error}</div>
            )}
          </div>

          <div className="input-field">
            <label htmlFor="numHosts">Number of Hosts</label>
            <select
              id="numHosts"
              className="host-select"
              value={formData.numHosts}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                numHosts: parseInt(e.target.value)
              }))}
              disabled={formData.isProcessing}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Host' : 'Hosts'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!formData.paperUrl || formData.isProcessing}
        >
          {formData.isProcessing ? 'Processing...' : 'Generate Podcast'}
        </button>
      </form>
    </div>
  );
};

export default PodcastGenerator;