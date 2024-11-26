// src/components/workflow/WorkflowNavigation.jsx
import React from 'react';

const WorkflowNavigation = ({ 
  steps, 
  currentStep, 
  canNavigateNext,
  onBack, 
  onReset, 
  onNext 
}) => {
  const currentIndex = steps.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  return (
    <div className="workflow-navigation">
      <button 
        onClick={onBack}
        disabled={isFirstStep}
        className="nav-button back"
      >
        Back
      </button>
      
      <button 
        onClick={onReset}
        className="nav-button reset"
      >
        Start Over
      </button>

      <button 
        onClick={onNext}
        disabled={isLastStep || !canNavigateNext}
        className="nav-button next"
      >
        {isLastStep ? 'Finish' : 'Next'}
      </button>
    </div>
  );
};

export default WorkflowNavigation;