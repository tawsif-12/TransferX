import { useState, useEffect } from 'react';
import './ErrorBanner.css';

export default function ErrorBanner({ message, onDismiss, autoDismiss = true, dismissTimeout = 5000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    // Auto-dismiss after timeout
    if (autoDismiss && dismissTimeout > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, dismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, dismissTimeout]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  // Keyboard handler for Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  };

  return (
    <div
      className={`error-banner ${visible ? 'error-banner--visible' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onKeyDown={handleKeyDown}
    >
      <span className="error-banner__icon" aria-hidden="true">⚠️</span>
      <span className="error-banner__message">{message}</span>
      <button
        type="button"
        className="error-banner__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss error message"
        title="Dismiss (Esc)"
      >
        ✕
      </button>
    </div>
  );
}
