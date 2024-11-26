// src/components/workflow/AudioGenerator.jsx
import React, { useState, useRef } from 'react';

const AudioGenerator = ({ transcript, onComplete }) => {
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const generateAudio = async () => {
    setGeneratingAudio(true);
    
    // Simulate audio generation with progress updates
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // In real implementation, this would be the actual audio URL
    setAudioUrl('dummy-audio-url');
    setGeneratingAudio(false);
  };

  const handlePreview = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleDownload = () => {
    // In real implementation, this would trigger actual download
    console.log('Downloading audio');
  };

  const handleComplete = () => {
    onComplete(audioUrl);
  };

  return (
    <div className="audio-generator">
      {!generatingAudio && !audioUrl && (
        <div className="start-section">
          <h3>Generate Audio</h3>
          <p>Convert your transcript into natural-sounding voices.</p>
          <button 
            className="generate-button"
            onClick={generateAudio}
          >
            Generate Audio
          </button>
        </div>
      )}

      {generatingAudio && (
        <div className="generation-progress">
          <div className="progress-indicator">
            <div className="progress-text">
              Generating audio... {progress}%
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {audioUrl && !generatingAudio && (
        <div className="audio-controls">
          <audio ref={audioRef} src={audioUrl} />
          
          <div className="audio-buttons">
            <button 
              className="preview-button"
              onClick={handlePreview}
            >
              Preview Audio
            </button>
            
            <button 
              className="download-button"
              onClick={handleDownload}
            >
              Download MP3
            </button>
          </div>

          <button
            className="continue-button"
            onClick={handleComplete}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioGenerator;