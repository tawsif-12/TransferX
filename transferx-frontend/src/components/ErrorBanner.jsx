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

  return (
    <div className={`error-banner ${visible ? 'error-banner--visible' : ''}`}>
      <span className="error-banner__icon">⚠️</span>
      <span className="error-banner__message">{message}</span>
      <button
        type="button"
        className="error-banner__dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss error"
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
