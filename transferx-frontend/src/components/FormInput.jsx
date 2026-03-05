import './FormInput.css';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  required = false,
  disabled = false,
  autoComplete,
  onBlur,
  onFocus,
  maxLength,
  minLength,
  pattern,
  title
}) {
  const errorId = error ? `${name}-error` : undefined;
  const descriptionId = title ? `${name}-description` : undefined;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-label-required" aria-label="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon" aria-hidden="true">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          title={title}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          aria-describedby={[errorId, descriptionId].filter(Boolean).join(' ') || undefined}
          className={`form-input ${icon ? 'form-input--with-icon' : ''} ${error ? 'form-input--error' : ''}`}
        />
      </div>
      {title && <p id={descriptionId} className="form-description">{title}</p>}
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
