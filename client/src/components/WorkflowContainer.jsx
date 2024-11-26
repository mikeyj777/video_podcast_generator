// src/components/WorkflowContainer.jsx
import React, { useState } from 'react';
import EntrySelector from './workflow/EntrySelector';
import WorkflowProgress from './workflow/WorkflowProgress';
import WorkflowNavigation from './workflow/WorkflowNavigation';
import SourcesInput from './workflow/SourcesInput';
import ConversationGenerator from './workflow/ConversationGenerator';
import ImageGenerator from './workflow/ImageGenerator';
import AudioGenerator from './workflow/AudioGenerator';
import VideoGenerator from './workflow/VideoGenerator';
import { createSession, addSourceToSession } from '../utils/databaseService';
import '../styles/global.css';

const WorkflowContainer = () => {
  const [sessionId, setSessionId] = useState(null);
  const [entryPath, setEntryPath] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowState, setWorkflowState] = useState({
    sources: [],
    transcript: null,
    images: [],
    audio: null,
    video: null,
    currentStep: null,
    stepsCompleted: new Set()
  });

  const handleEntryPathSelect = async (path) => {
    if (isProcessing) return; // Prevent multiple clicks during processing
    
    try {
      setIsProcessing(true);
      const session = await createSession(path);
      setSessionId(session.id);
      setEntryPath(path);
      setWorkflowState(prev => ({
        ...prev,
        currentStep: path === 'sources' ? 'sources' : 'transcript'
      }));
    } catch (error) {
      console.error('Failed to create session:', error);
      // Reset the state on error
      setSessionId(null);
      setEntryPath(null);
      // Optionally show error to user
    } finally {
      setIsProcessing(false);
    }
  };

  const getSteps = () => {
    return entryPath === 'sources' 
      ? ['sources', 'transcript', 'images', 'audio', 'video']
      : ['transcript', 'images', 'audio', 'video'];
  };

  const handleStepComplete = (step, data) => {
    setWorkflowState(prev => ({
      ...prev,
      [step]: data,
      stepsCompleted: new Set([...prev.stepsCompleted, step])
    }));
  };

  const handleNavigateBack = () => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(workflowState.currentStep);
    
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      setWorkflowState(prev => ({
        ...prev,
        currentStep: previousStep
      }));
    }
  };

  const handleNavigateNext = () => {
    const steps = getSteps();
    const currentIndex = steps.indexOf(workflowState.currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (workflowState.stepsCompleted.has(workflowState.currentStep)) {
        setWorkflowState(prev => ({
          ...prev,
          currentStep: nextStep
        }));
      }
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to start over? All progress will be lost."
    );
    
    if (confirmed) {
      setSessionId(null);
      setEntryPath(null);
      setIsProcessing(false);
      setWorkflowState({
        sources: [],
        transcript: null,
        images: [],
        audio: null,
        video: null,
        currentStep: null,
        stepsCompleted: new Set()
      });
    }
  };

  const isCurrentStepCompleted = () => {
    return workflowState.stepsCompleted.has(workflowState.currentStep);
  };

  const renderCurrentStep = () => {
    switch (workflowState.currentStep) {
      case 'sources':
        return (
          <SourcesInput
            sessionId = {sessionId}
            onComplete={(data) => handleStepComplete('sources', data)}
          />
        );
      case 'transcript':
        return (
          <ConversationGenerator
            initialSources={workflowState.sources}
            onComplete={(data) => handleStepComplete('transcript', data)}
          />
        );
      case 'images':
        return (
          <ImageGenerator
            transcript={workflowState.transcript}
            onComplete={(data) => handleStepComplete('images', data)}
          />
        );
      case 'audio':
        return (
          <AudioGenerator
            transcript={workflowState.transcript}
            onComplete={(data) => handleStepComplete('audio', data)}
          />
        );
      case 'video':
        return (
          <VideoGenerator
            transcript={workflowState.transcript}
            images={workflowState.images}
            audio={workflowState.audio}
            onComplete={(data) => handleStepComplete('video', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="workflow-container">
      {!entryPath ? (
        <EntrySelector onSelect={handleEntryPathSelect} />
      ) : (
        <div className="workflow-content">
          <WorkflowProgress 
            steps={getSteps()}
            currentStep={workflowState.currentStep}
            completedSteps={workflowState.stepsCompleted}
          />
          
          <div className="workflow-main">
            {renderCurrentStep()}
          </div>

          <WorkflowNavigation
            steps={getSteps()}
            currentStep={workflowState.currentStep}
            canNavigateNext={isCurrentStepCompleted()}
            onBack={handleNavigateBack}
            onReset={handleReset}
            onNext={handleNavigateNext}
          />
        </div>
      )}
    </div>
  );
};

export default WorkflowContainer;