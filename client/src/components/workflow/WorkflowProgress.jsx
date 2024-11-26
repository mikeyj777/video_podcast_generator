// src/components/workflow/WorkflowProgress.jsx
export const WorkflowProgress = ({ steps, currentStep }) => (
  <div className="workflow-progress">
    {steps.map((step, index) => (
      <div 
        key={step} 
        className={`workflow-step ${currentStep === step ? 'active' : ''}`}
      >
        <div className="step-number">{index + 1}</div>
        <div className="step-label">{step}</div>
      </div>
    ))}
  </div>
);