import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import FormInput from '../../components/FormInput';
import PasswordInput from '../../components/PasswordInput';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // Sanitize email before sending to API
      const sanitizedEmail = sanitizeEmail(email);

      const res = await axiosClient.post('/auth/admin-login', { email: sanitizedEmail, password });
      const { token, role, user } = res.data.data;
      toast.success('Welcome back, admin!');
      auth.login(token, role, user);
      navigate('/admin/dashboard');
    } catch (err) {
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
              required
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
              required
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
