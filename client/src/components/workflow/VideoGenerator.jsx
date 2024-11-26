// src/components/workflow/VideoGenerator.jsx
import React, { useState, useRef } from 'react';

const VideoGenerator = ({ transcript, images, audio, onComplete }) => {
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [imageTimings, setImageTimings] = useState(
    images.map((img, index) => ({
      ...img,
      startTime: index * 30, // Default 30 seconds per image
      duration: 30
    }))
  );
  const videoRef = useRef(null);

  const generateVideo = async () => {
    setGenerating(true);
    
    // Simulate video generation with progress updates
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // In real implementation, this would be the actual video URL
    setVideoUrl('dummy-video-url');
    setGenerating(false);
  };

  const handleImageTimingChange = (id, startTime, duration) => {
    setImageTimings(prev => prev.map(timing =>
      timing.id === id
        ? { ...timing, startTime, duration }
        : timing
    ));
  };

  const handlePreview = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleDownload = () => {
    // In real implementation, this would trigger actual download
    console.log('Downloading video');
  };

  const handleComplete = () => {
    onComplete({
      videoUrl,
      imageTimings
    });
  };

  return (
    <div className="video-generator">
      {!generating && !videoUrl && (
        <div className="start-section">
          <h3>Create Video</h3>
          <p>Combine audio and visuals into a complete video.</p>
          <button 
            className="generate-button"
            onClick={generateVideo}
          >
            Generate Video
          </button>
        </div>
      )}

      {generating && (
        <div className="generation-progress">
          <div className="progress-indicator">
            <div className="progress-text">
              Generating video... {progress}%
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

      {videoUrl && !generating && (
        <div className="video-section">
          <div className="video-preview">
            <video ref={videoRef} src={videoUrl} controls />
          </div>

          <div className="video-controls">
            <button 
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Save Changes' : 'Edit Video'}
            </button>
            
            <button 
              className="download-button"
              onClick={handleDownload}
            >
              Download MP4
            </button>
          </div>

          {isEditing && (
            <div className="timing-editor">
              <h4>Image Timings</h4>
              {imageTimings.map(timing => (
                <div key={timing.id} className="timing-control">
                  <img 
                    src={timing.imageUrl} 
                    alt={`Timing ${timing.id}`}
                    className="timing-thumbnail"
                  />
                  <div className="timing-inputs">
                    <div>
                      <label>Start Time (seconds)</label>
                      <input
                        type="number"
                        value={timing.startTime}
                        onChange={(e) => handleImageTimingChange(
                          timing.id,
                          parseInt(e.target.value),
                          timing.duration
                        )}
                      />
                    </div>
                    <div>
                      <label>Duration (seconds)</label>
                      <input
                        type="number"
                        value={timing.duration}
                        onChange={(e) => handleImageTimingChange(
                          timing.id,
                          timing.startTime,
                          parseInt(e.target.value)
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="continue-button"
            onClick={handleComplete}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;