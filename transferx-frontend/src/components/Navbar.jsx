import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const { role, user: authUser, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">⚽</span>
          <span className="navbar-logo-text">
            Transfer<span className="navbar-logo-highlight">X</span>
          </span>
        </Link>

        {isAuthenticated && role !== 'ADMIN' && (
          <div className="navbar-links">
            <Link
              to="/players"
              className={`navbar-link ${isActive('/players') ? 'navbar-link--active' : ''}`}
            >
              Players
            </Link>
            <Link
              to="/clubs"
              className={`navbar-link ${isActive('/clubs') ? 'navbar-link--active' : ''}`}
            >
              Clubs
            </Link>
            <Link
              to="/transfers"
              className={`navbar-link ${isActive('/transfers') ? 'navbar-link--active' : ''}`}
            >
              Transfers
            </Link>
            <Link
              to="/agents"
              className={`navbar-link ${isActive('/agents') ? 'navbar-link--active' : ''}`}
            >
              Agents
            </Link>
          </div>
        )}

        <div className="navbar-controls">
          <button
            onClick={toggleTheme}
            className="navbar-theme-toggle"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="navbar-user">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="navbar-login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
