import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark'); // 'dark' | 'light'

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('transferx_theme');
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (themeValue) => {
        const root = document.documentElement;

        if (themeValue === 'light') {
            // Light theme
            root.style.setProperty('--bg-base', '#f9fafb');
            root.style.setProperty('--bg-surface', '#ffffff');
            root.style.setProperty('--bg-card', '#f3f4f6');
            root.style.setProperty('--bg-elevated', '#e5e7eb');

            root.style.setProperty('--border', 'rgba(34, 197, 94, 0.15)');
            root.style.setProperty('--border-strong', 'rgba(34, 197, 94, 0.35)');

            root.style.setProperty('--text-primary', '#1f2937');
            root.style.setProperty('--text-secondary', '#374151');
            root.style.setProperty('--text-muted', '#9ca3af');
            root.style.setProperty('--text-inverse', '#f9fafb');
            root.style.setProperty('--text-inverse-rgb', '249,250,251');
        } else {
            // Dark theme (default)
            root.style.setProperty('--bg-base', '#0f172a');  // deeper navy
            root.style.setProperty('--bg-surface', '#1a1f36');
            root.style.setProperty('--bg-card', '#111827');
            root.style.setProperty('--bg-elevated', '#1f2937');

            root.style.setProperty('--border', 'rgba(82, 183, 136, 0.2)');
            root.style.setProperty('--border-strong', 'rgba(82, 183, 136, 0.4)');

            root.style.setProperty('--text-primary', '#e5e7eb');
            root.style.setProperty('--text-secondary', '#a5b4fc');
            root.style.setProperty('--text-muted', '#6b7280');
            root.style.setProperty('--text-inverse', '#0f172a');
            root.style.setProperty('--text-inverse-rgb', '15,23,42');
            // card gradients / accent
            root.style.setProperty('--card-gradient-start', '#1a1f36');
            root.style.setProperty('--card-gradient-end', '#111827');
            root.style.setProperty('--card-accent', '#4ade80');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('transferx_theme', newTheme);
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
