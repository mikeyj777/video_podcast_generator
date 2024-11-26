// src/components/workflow/SourcesInput.jsx
import React, { useState } from 'react';

const SourceInput = ({ id, value, onChange, onRemove, onValidate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [inputType, setInputType] = useState('url'); // 'url' or 'text'

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
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
    <div className="source-input">
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

      {inputType === 'url' ? (
        <div className="url-input">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onValidate(e.target.value.trim().length > 0);
            }}
            placeholder="Enter URL to paper, article, or data source..."
          />
        </div>
      ) : (
        <div 
          className={`text-input ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onValidate(e.target.value.trim().length > 0);
            }}
            placeholder="Paste or drag content here..."
          />
        </div>
      )}

      <button className="remove-button" onClick={() => onRemove(id)}>
        Remove
      </button>
    </div>
  );
};

export const SourcesInput = ({ onComplete }) => {
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

  const handleComplete = () => {
    const validSources = sources.filter(source => source.isValid);
    if (validSources.length > 0) {
      onComplete(validSources.map(source => source.content));
    }
  };

  return (
    <div className="sources-input">
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

      <button className="add-source-button" onClick={addSource}>
        Add Another Source
      </button>

      <button 
        className="continue-button"
        onClick={handleComplete}
        disabled={!sources.some(source => source.isValid)}
      >
        Continue with Selected Sources
      </button>
    </div>
  );
};