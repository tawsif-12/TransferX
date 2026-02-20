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
        } else {
            // Dark theme (default)
            root.style.setProperty('--bg-base', '#06100d');
            root.style.setProperty('--bg-surface', '#0d1f14');
            root.style.setProperty('--bg-card', '#111f16');
            root.style.setProperty('--bg-elevated', '#162b1e');

            root.style.setProperty('--border', 'rgba(82, 183, 136, 0.15)');
            root.style.setProperty('--border-strong', 'rgba(82, 183, 136, 0.35)');

            root.style.setProperty('--text-primary', '#d1fae5');
            root.style.setProperty('--text-secondary', '#74c69d');
            root.style.setProperty('--text-muted', '#4a6741');
            root.style.setProperty('--text-inverse', '#06100d');
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
