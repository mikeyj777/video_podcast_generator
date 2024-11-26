import React from 'react';

const EntrySelector = ({ onSelect }) => (
  <div className="entry-selector">
    <h2>Choose Your Starting Point</h2>
    <div className="entry-options">
      <div 
        className="entry-option"
        onClick={() => onSelect('sources')}
      >
        <div className="entry-icon">📄</div>
        <h3>Start with Sources</h3>
        <p>Upload papers, articles, or data that you want to convert into a podcast</p>
        <ul>
          <li>Support for multiple sources</li>
          <li>Automatic transcript generation</li>
          <li>AI-powered conversation creation</li>
        </ul>
      </div>

      <div 
        className="entry-option"
        onClick={() => onSelect('transcript')}
      >
        <div className="entry-icon">🎙️</div>
        <h3>Start with Transcript</h3>
        <p>Already have a conversation script? Upload it directly</p>
        <ul>
          <li>Upload existing transcript</li>
          <li>Paste transcript text</li>
          <li>Skip generation step</li>
        </ul>
      </div>
    </div>
  </div>
);

export default EntrySelector;