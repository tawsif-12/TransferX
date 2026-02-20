import { useEffect } from 'react';
import './Modal.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  mode = 'form', 
  onConfirm, 
  confirmLabel = 'Save Changes' 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            type="button" 
            className="modal-close" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn--ghost" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className={`btn ${mode === 'delete' ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
          >
            {mode === 'delete' ? 'Delete' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
