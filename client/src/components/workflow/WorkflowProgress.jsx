// src/components/workflow/WorkflowProgress.jsx
import React from 'react';

const WorkflowProgress = ({ steps, currentStep, completedSteps }) => {
  const getStepNumber = (stepName) => {
    return steps.indexOf(stepName) + 1;
  };

  const getStepStatus = (stepName) => {
    if (completedSteps.has(stepName)) return 'completed';
    if (currentStep === stepName) return 'active';
    return steps.indexOf(stepName) < steps.indexOf(currentStep) ? 'completed' : 'pending';
  };

  const formatStepName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="workflow-progress">
      <div className="progress-track" />
      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={step}
            className={`workflow-step ${getStepStatus(step)}`}
          >
            <div className="step-indicator">
              <div className="step-number">
                {getStepStatus(step) === 'completed' ? '✓' : getStepNumber(step)}
              </div>
            </div>
            <div className="step-content">
              <div className="step-title">{formatStepName(step)}</div>
              {index < steps.length - 1 && (
                <div className="step-connector" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;