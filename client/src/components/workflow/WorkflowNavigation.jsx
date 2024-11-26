
// src/components/workflow/WorkflowNavigation.jsx
export const WorkflowNavigation = ({ 
  steps, 
  currentStep, 
  onBack, 
  onReset, 
  onNext 
}) => (
  <div className="workflow-navigation">
    <button 
      onClick={onBack}
      disabled={currentStep === steps[0]}
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
      disabled={currentStep === steps[steps.length - 1]}
      className="nav-button next"
    >
      Next
    </button>
  </div>
);