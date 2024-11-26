// src/components/workflow/ImageGenerator.jsx
import React, { useState, useEffect } from 'react';

const ImageGenerator = ({ transcript, onComplete }) => {
  const [images, setImages] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  // Simulated analysis of transcript to determine image points
  const analyzeTranscript = () => {
    // In real implementation, this would use AI to identify key points
    const segments = transcript.split(/[.!?]/).filter(Boolean);
    const keyPoints = segments.filter((_, i) => i % 3 === 0); // Every third segment
    return keyPoints.map((text, index) => ({
      id: index,
      text,
      timepoint: index * 30, // Every 30 seconds
      status: 'pending'
    }));
  };

  const startGeneration = async () => {
    setGenerating(true);
    const imagePoints = analyzeTranscript();
    setProgress({ completed: 0, total: imagePoints.length });

    // Initialize images array
    setImages(imagePoints.map(point => ({
      ...point,
      imageUrl: null,
      isLoading: false
    })));

    // Generate images sequentially
    for (let i = 0; i < imagePoints.length; i++) {
      const point = imagePoints[i];
      
      setImages(prev => prev.map(img => 
        img.id === point.id 
          ? { ...img, isLoading: true }
          : img
      ));

      // Simulate image generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setImages(prev => prev.map(img =>
        img.id === point.id
          ? {
              ...img,
              isLoading: false,
              imageUrl: `/api/placeholder/400/300?text=Generated_Image_${img.id}`,
              status: 'completed'
            }
          : img
      ));

      setProgress(prev => ({
        ...prev,
        completed: prev.completed + 1
      }));
    }

    setGenerating(false);
  };

  const handleImageEdit = (id, newImage) => {
    setImages(prev => prev.map(img =>
      img.id === id ? { ...img, imageUrl: newImage } : img
    ));
  };

  const handleDownload = (id) => {
    const image = images.find(img => img.id === id);
    if (image?.imageUrl) {
      // In real implementation, this would trigger actual download
      console.log(`Downloading image ${id}`);
    }
  };

  const handleDownloadAll = () => {
    // In real implementation, this would bundle all images
    console.log('Downloading all images');
  };

  const handleComplete = () => {
    onComplete(images);
  };

  return (
    <div className="image-generator">
      {!generating && images.length === 0 && (
        <div className="start-section">
          <h3>Generate Supporting Visuals</h3>
          <p>We'll analyze your transcript and create relevant images at key points.</p>
          <button 
            className="generate-button"
            onClick={startGeneration}
          >
            Generate Images
          </button>
        </div>
      )}

      {(generating || images.length > 0) && (
        <div className="generation-section">
          {/* Progress indicator */}
          <div className="progress-bar">
            <div className="progress-text">
              Generating images: {progress.completed}/{progress.total}
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(progress.completed / progress.total) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Image grid */}
          <div className="image-grid">
            {images.map(image => (
              <div key={image.id} className="image-item">
                {image.isLoading ? (
                  <div className="image-placeholder">
                    Generating...
                  </div>
                ) : image.imageUrl ? (
                  <div className="image-container">
                    <img src={image.imageUrl} alt={`Generated ${image.id}`} />
                    <div className="image-controls">
                      <button onClick={() => handleImageEdit(image.id)}>
                        Edit
                      </button>
                      <button onClick={() => handleDownload(image.id)}>
                        Download
                      </button>
                    </div>
                    <div className="image-timestamp">
                      Time: {Math.floor(image.timepoint / 60)}:{(image.timepoint % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="action-buttons">
            <button 
              className="download-all-button"
              onClick={handleDownloadAll}
              disabled={progress.completed < progress.total}
            >
              Download All Images
            </button>
            <button
              className="continue-button"
              onClick={handleComplete}
              disabled={progress.completed < progress.total}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;