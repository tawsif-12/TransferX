import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const notify = useCallback((message, type = 'info', duration = 5000) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => remove(id), duration);
        }
        return id;
    }, [remove]);

    const value = {
        success: (msg, d) => notify(msg, 'success', d),
        error: (msg, d) => notify(msg, 'error', d),
        info: (msg, d) => notify(msg, 'info', d),
        remove,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} onClose={() => remove(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
