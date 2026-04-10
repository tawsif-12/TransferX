import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import { validateEmail, validateRequired } from '../../utils/validators';
import { sanitizeEmail } from '../../utils/sanitize';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  console.log('✅ AdminLogin component mounted');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');

    const validationErrors = {};
    const emailVal = validateEmail(email);
    if (!emailVal.valid) validationErrors.email = emailVal.message;
    
    const pwVal = validateRequired(password, 'Password');
    if (!pwVal.valid) validationErrors.password = pwVal.message;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Sanitize email before sending to API
      const sanitizedEmail = sanitizeEmail(email);
      console.log('🔐 Attempting login with:', sanitizedEmail);

      const res = await axiosClient.post('/auth/admin-login', { email: sanitizedEmail, password });
      console.log('✅ Full login response:', res);
      console.log('✅ Login response data:', res.data);
      console.log('✅ Response data.data:', res.data.data);
      
      if (!res.data.data) {
        throw new Error('Invalid response structure: missing data field');
      }
      
      const { token, role, user } = res.data.data;
      console.log('🎫 Extracted token:', token?.substring(0, 20) + '...');
      console.log('👤 Extracted role:', role);
      console.log('👥 Extracted user:', user);
      
      toast.success('Welcome back, admin!');
      auth.login(token, role, user);
      console.log('📍 Navigating to dashboard...');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error message:', err.message);
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-warning">
          ⚠ Authorized personnel only
        </div>

        <div className="admin-login-body">
          <div className="admin-login-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="admin-login-title">TransferX Admin</h1>
          <p className="admin-login-subtitle">Restricted Access</p>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                placeholder="admin@transferx.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  background: '#0f172a',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  background: '#0f172a',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              className="admin-login-submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #22c55e, #15803d)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '24px'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <Link to="/login" className="admin-login-back" style={{ display: 'inline-block', color: '#94a3b8', fontSize: '14px', textDecoration: 'none', marginTop: '16px' }}>
            ← Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}
