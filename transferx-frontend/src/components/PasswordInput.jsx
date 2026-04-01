import { useState } from 'react';
import './PasswordInput.css';

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  name,
  required = false,
  disabled = false,
  onBlur,
  onFocus,
  minLength,
  autoComplete,
  ariaLabel,
  helpText
}) {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = error ? `${name}-error` : undefined;
  const helpTextId = helpText ? `${name}-help` : undefined;

  // Build aria-describedby with error and help text
  const describedByIds = [errorId, helpTextId]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="form-label-required" aria-label="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          minLength={minLength}
          autoComplete={autoComplete}
          aria-label={ariaLabel || label}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          aria-describedby={describedByIds}
          className={`form-input form-input--with-toggle ${error ? 'form-input--error' : ''}`}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-controls={name}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            {showPassword ? (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
              </>
            )}
          </svg>
        </button>
      </div>
      {helpText && <p id={helpTextId} className="form-help-text">{helpText}</p>}
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
