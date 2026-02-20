import './FormInput.css';

export default function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon 
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}</label>}
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${icon ? 'form-input--with-icon' : ''} ${error ? 'form-input--error' : ''}`}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
