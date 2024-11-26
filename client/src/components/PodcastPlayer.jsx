import React, { useEffect, useState } from 'react';

const ImageTransition = ({ currentTime, imageSchedule }) => {
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    // Find the appropriate image for the current timestamp
    const currentScheduleItem = imageSchedule.find((item, index) => {
      const nextItem = imageSchedule[index + 1];
      return currentTime >= item.startTime && 
             (!nextItem || currentTime < nextItem.startTime);
    });

    if (currentScheduleItem && currentScheduleItem.imageUrl !== currentImage) {
      setCurrentImage(currentScheduleItem.imageUrl);
    }
  }, [currentTime, imageSchedule]);

  return (
    <div className="image-container">
      {currentImage && (
        <img 
          src={currentImage}
          alt="Podcast visual aid"
          className="transition-image"
        />
      )}
    </div>
  );
};

// Example usage:
const PodcastPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  
  const imageSchedule = [
    {
      startTime: 0,
      endTime: 30,
      imageUrl: '/images/llm-comparison.jpg',
      description: 'Traditional LLM vs Open-ended Reasoning'
    },
    {
      startTime: 30,
      endTime: 90,
      imageUrl: '/images/chain-of-thought.jpg',
      description: 'Chain of Thought Reasoning Process'
    },
    // ... additional image schedules
  ];

  return (
    <div className="podcast-player">
      <div className="video-container">
        <ImageTransition 
          currentTime={currentTime}
          imageSchedule={imageSchedule}
        />
        {/* Audio/video controls would go here */}
      </div>
    </div>
  );
};

const styles = `
  .image-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    background: #000;
  }

  .transition-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.5s ease-in-out;
  }

  .podcast-player {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .video-container {
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
`;

export default PodcastPlayer;