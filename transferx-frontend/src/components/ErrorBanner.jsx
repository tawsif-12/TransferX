import { useState, useEffect } from 'react';
import './ErrorBanner.css';

export default function ErrorBanner({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  return (
    <div className={`error-banner ${visible ? 'error-banner--visible' : ''}`}>
      <span className="error-banner__icon">⚠</span>
      <span className="error-banner__message">{message}</span>
      {onDismiss && (
        <button type="button" className="error-banner__dismiss" onClick={handleDismiss}>
          ×
        </button>
      )}
    </div>
  );
}
