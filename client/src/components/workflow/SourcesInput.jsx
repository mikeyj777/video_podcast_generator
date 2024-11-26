// src/components/workflow/SourcesInput.jsx
import React, { useState } from 'react';
import { createSession, addSourceToSession } from '../../utils/databaseService';

const SourceInput = ({ id, value, onChange, onRemove, onValidate }) => {
  const [inputType, setInputType] = useState('url');
  const [isDragging, setIsDragging] = useState(false);


  console.log('SourceInput render value:', value === ''); // Debug

  const handleDragEvents = (e, isDraggingState) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDraggingState);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
      onValidate(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="source-input-container">
      <div className="input-type-selector">
        <button 
          className={`type-button ${inputType === 'url' ? 'active' : ''}`}
          onClick={() => setInputType('url')}
        >
          URL
        </button>
        <button 
          className={`type-button ${inputType === 'text' ? 'active' : ''}`}
          onClick={() => setInputType('text')}
        >
          Text
        </button>
      </div>

      <div 
        className={`input-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
      >
        
        
        {inputType === 'url' ? (
          <input
            type="text"
            defaultValue={typeof value === 'string' ? value : ''}
            onChange={(e) => {
              onChange(e.target.value);
              onValidate(e.target.value.trim().length > 0);
            }}
            placeholder="Enter URL to paper, article, or data source..."
            className="url-input"
          />
        ) : (
          <textarea
            type="text"
            defaultValue={typeof value === 'string' ? value : ''}
            onChange={(e) => {
              onChange(e.target.value);
              onValidate(e.target.value.trim().length > 0);
            }}
            placeholder="Paste or drag content here..."
            className="text-input"
          />
        )}
      </div>

      <button 
        className="remove-button" 
        onClick={() => onRemove(id)}
        title="Remove source"
      >
        ×
      </button>
    </div>
  );
};

const SourcesInput = ({ sessionId, onComplete }) => {
  const [sources, setSources] = useState([{ id: 1, content: '', isValid: false }]);

  const addSource = () => {
    setSources([...sources, { id: Date.now(), content: '', isValid: false }]);
  };

  const removeSource = (id) => {
    if (sources.length > 1) {
      setSources(sources.filter(source => source.id !== id));
    }
  };

  const updateSource = (id, content) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, content } : source
    ));
  };

  const validateSource = (id, isValid) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, isValid } : source
    ));
  };

  const handleComplete = async () => {
    const validSources = sources.filter(source => source.isValid);
    if (validSources.length > 0) {
      try {
        // Use sessionId here
        const uploadPromises = validSources.map(source => 
          addSourceToSession(
            sessionId,
            source.content,
            source.content.startsWith('http') ? 'url' : 'text'
          )
        );

        await Promise.all(uploadPromises);
        onComplete(validSources.map(source => source.content));
      } catch (error) {
        console.error('Failed to upload sources:', error);
        // Handle error
      }
    }
  };

  return (
    <div className="sources-input-wrapper">
      <h3 className="sources-title">Add Your Sources</h3>
      
      <div className="sources-list">
        {sources.map(source => (
          <SourceInput
            key={source.id}
            id={source.id}
            value={source.content}
            onChange={(content) => updateSource(source.id, content)}
            onRemove={removeSource}
            onValidate={(isValid) => validateSource(source.id, isValid)}
          />
        ))}
      </div>

      <div className="sources-actions">
        <button 
          className="add-source-button"
          onClick={addSource}
        >
          + Add Another Source
        </button>

        <button 
          className="continue-button"
          onClick={handleComplete}
          disabled={!sources.some(source => source.isValid)}
        >
          Continue with Selected Sources
        </button>
      </div>
    </div>
  );
};

export default SourcesInput;