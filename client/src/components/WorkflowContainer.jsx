// src/components/WorkflowContainer.jsx
import React, { useState } from 'react';
import EntrySelector from './workflow/EntrySelector';
import WorkflowProgress from './workflow/WorkflowProgress';
import SourcesInput from './workflow/SourcesInput';
import ConversationGenerator from './workflow/ConversationGenerator';
import WorkflowNavigation from './workflow/WorkflowNavigation';
import '../styles/global.css';

const WorkflowContainer = () => {
  const [entryPath, setEntryPath] = useState(null);
  const [workflowState, setWorkflowState] = useState({
    sources: [],
    transcript: null,
    currentStep: null
  });

  const getSteps = () => {
    return entryPath === 'sources' 
      ? ['sources', 'transcript', 'images', 'audio', 'video']
      : ['transcript', 'images', 'audio', 'video'];
  };

  const handleStepComplete = (step, data) => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(step);
    const nextStep = steps[currentIndex + 1];

    setWorkflowState(prev => ({
      ...prev,
      [step]: data,
      currentStep: nextStep
    }));
  };

  return (
    <div className="workflow-container">
      {!entryPath ? (
        <EntrySelector onSelect={setEntryPath} />
      ) : (
        <div className="workflow-content">
          <WorkflowProgress 
            steps={getSteps()}
            currentStep={workflowState.currentStep}
          />
          
          <div className="workflow-main">
            {entryPath === 'sources' && workflowState.currentStep === 'sources' && (
              <SourcesInput 
                onComplete={(sources) => handleStepComplete('sources', sources)}
              />
            )}

            {workflowState.currentStep === 'transcript' && (
              <ConversationGenerator
                initialSources={workflowState.sources}
                onComplete={(transcript) => handleStepComplete('transcript', transcript)}
              />
            )}
          </div>

          <WorkflowNavigation
            steps={getSteps()}
            currentStep={workflowState.currentStep}
            onBack={() => {/* Handle back */}}
            onReset={() => setEntryPath(null)}
            onNext={() => {/* Handle next */}}
          />
        </div>
      )}
    </div>
  );
};

export default WorkflowContainer;