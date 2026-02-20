import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import PasswordInput from '../../components/PasswordInput';
import ErrorBanner from '../../components/ErrorBanner';
import { validateEmail, validateRequired } from '../../utils/validators';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const mockAdminLogin = async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 1000));
    if (email === 'admin@transferx.com' && password === 'admin123')
      return { token: 'mock-admin-jwt', role: 'admin', user: { name: 'Admin User', email } };
    throw new Error('Access denied. Invalid admin credentials.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    const validationErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) validationErrors.email = emailErr;
    const pwErr = validateRequired(password, 'Password');
    if (pwErr) validationErrors.password = pwErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // REAL API (uncomment when backend ready):
      // const res = await axiosClient.post('/auth/admin/login', { email, password });
      // const { token, role, user } = res.data;

      const { token, role, user } = await mockAdminLogin({ email, password });
      auth.login(token, role, user);
      navigate('/admin/dashboard');
    } catch (err) {
      setGlobalError(err.message || 'Login failed');
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="admin-login-title">TransferX Admin</h1>
          <p className="admin-login-subtitle">Restricted Access</p>

          {globalError && <ErrorBanner message={globalError} onDismiss={() => setGlobalError('')} />}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              error={errors.email}
              placeholder="admin@transferx.com"
              icon="✉"
            />

            <PasswordInput
              label="Password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({});
              }}
              error={errors.password}
              placeholder="Enter your password"
            />

            <button type="submit" className="admin-login-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="admin-login-spinner"></span> Signing in...
                </>
              ) : (
                'Sign In as Admin'
              )}
            </button>
          </form>

          <Link to="/login" className="admin-login-back">
            ← Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}
