import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo-icon">🛡</span>
        <h1 className="sidebar-logo-text">
          Transfer<span className="sidebar-logo-highlight">X</span> Admin
        </h1>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">OVERVIEW</div>
          <Link 
            to="/admin/dashboard" 
            className={`sidebar-link ${isActive('/admin/dashboard') ? 'sidebar-link--active' : ''}`}
          >
            Dashboard
          </Link>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">ENTITIES</div>
          <Link 
            to="/admin/players" 
            className={`sidebar-link ${isActive('/admin/players') ? 'sidebar-link--active' : ''}`}
          >
            Players
          </Link>
          <Link 
            to="/admin/clubs" 
            className={`sidebar-link ${isActive('/admin/clubs') ? 'sidebar-link--active' : ''}`}
          >
            Clubs
          </Link>
          <Link 
            to="/admin/leagues" 
            className={`sidebar-link ${isActive('/admin/leagues') ? 'sidebar-link--active' : ''}`}
          >
            Leagues
          </Link>
          <Link 
            to="/admin/agents" 
            className={`sidebar-link ${isActive('/admin/agents') ? 'sidebar-link--active' : ''}`}
          >
            Agents
          </Link>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">OPERATIONS</div>
          <Link 
            to="/admin/transfers" 
            className={`sidebar-link ${isActive('/admin/transfers') ? 'sidebar-link--active' : ''}`}
          >
            Transfers
          </Link>
          <Link 
            to="/admin/contracts" 
            className={`sidebar-link ${isActive('/admin/contracts') ? 'sidebar-link--active' : ''}`}
          >
            Contracts
          </Link>
          <Link 
            to="/admin/transfer-history" 
            className={`sidebar-link ${isActive('/admin/transfer-history') ? 'sidebar-link--active' : ''}`}
          >
            Transfer History
          </Link>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">Administrator</div>
        </div>
        <button onClick={handleLogout} className="sidebar-logout">
          Logout
        </button>
      </div>
    </aside>
  );
}
