import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🚫</div>
        <h1 className="unauthorized-title">403</h1>
        <h2 className="unauthorized-subtitle">Access Denied</h2>
        <p className="unauthorized-text">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <button onClick={() => navigate(-1)} className="unauthorized-btn">
          Go Back
        </button>
      </div>
    </div>
  );
}
