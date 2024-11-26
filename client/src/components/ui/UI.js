export const Button = ({ children, disabled, onClick, className = '' }) => (
  <button 
    className={`button button-primary ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export const Select = ({ value, onChange, options }) => (
  <div className="select-wrapper">
    <select 
      className="custom-select"
      value={value}
      onChange={onChange}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
    <span className="select-arrow" />
  </div>
);

export const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div 
      className="progress-bar" 
      style={{ width: `${progress}%` }}
    />
    <div className="progress-text">{progress}% Complete</div>
  </div>
);