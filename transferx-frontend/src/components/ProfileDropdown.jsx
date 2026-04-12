import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { getInitials } from '../utils/formatters';
import './ProfileDropdown.css';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [userRes, ratingsRes] = await Promise.all([
        api.get('/user/me'),
        api.get('/user/ratings')
      ]);
      setUser(userRes.data);
      setRatings(ratingsRes.data);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    if (!isOpen) {
      fetchProfileData();
    }
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const userInitials = authUser ? getInitials(
    authUser.name?.split(' ')[0] || 'U',
    authUser.name?.split(' ')[1] || ''
  ) : '?';

  return (
    <div ref={dropdownRef} className="profile-dropdown">
      <button className="profile-btn" onClick={handleProfileClick} title="Open profile menu">
        <div className="profile-avatar">{userInitials}</div>
        <span>{authUser?.name?.split(' ')[0] || 'Profile'}</span>
      </button>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="dropdown-header">
            <h3>My Profile</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {user && (
                <div className="user-info">
                  <p><strong>Name:</strong> {user.fullName || authUser?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {user.email || authUser?.email}</p>
                </div>
              )}

              <div className="ratings-section">
                <h4>My Ratings ({ratings.length})</h4>
                {ratings.length > 0 ? (
                  <div className="ratings-list">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="rating-item">
                        <div className="player-name">
                          {rating.player.first_name} {rating.player.last_name}
                        </div>
                        <div className="rating-value">
                          ⭐ {rating.rating}/5
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-ratings">No ratings yet</p>
                )}
              </div>

              <div className="dropdown-footer">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
