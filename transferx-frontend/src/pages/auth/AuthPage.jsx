import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import FormInput from '../../components/FormInput';
import PasswordInput from '../../components/PasswordInput';
import PasswordStrengthBar from '../../components/PasswordStrengthBar';
import ErrorBanner from '../../components/ErrorBanner';
import { validateLoginForm, validateSignupForm } from '../../utils/validators';
import './AuthPage.css';

export default function AuthPage({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupErrors, setSignupErrors] = useState({});

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'login' ? '/login' : '/register', { replace: true });
    setGlobalError('');
    setLoginErrors({});
    setSignupErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGlobalError('');

    const errors = validateLoginForm({ email: loginEmail, password: loginPassword });
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/login', { 
        email: loginEmail, 
        password: loginPassword 
      });
      
      const { token, role, user } = res.data.data;
      setSuccess(`Welcome back, ${user.name.split(' ')[0]}!`);
      auth.login(token, role, user);
      
      setTimeout(() => {
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setGlobalError('');

    const errors = validateSignupForm({ 
      fullName: signupName, 
      email: signupEmail, 
      password: signupPassword, 
      confirm: signupConfirm 
    });
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/signup', { 
        fullName: signupName, 
        email: signupEmail, 
        password: signupPassword 
      });
      
      const { token, role, user } = res.data.data;
      setSuccess(`Welcome to TransferX, ${user.name.split(' ')[0]}!`);
      auth.login(token, role, user);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setGlobalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-success">
            <div className="auth-success-icon">⚽</div>
            <div className="auth-success-message">{success}</div>
            <div className="auth-success-sub">Redirecting to your dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-ball">⚽</div>
            <h1 className="auth-logo-text">
              Transfer<span className="auth-logo-highlight">X</span>
            </h1>
          </div>

          <h2 className="auth-tagline">
            The Global <span className="auth-tagline-highlight">Transfer</span> Intelligence Hub
          </h2>

          <p className="auth-description">
            Track every player movement, contract and transfer across the world's top leagues.
          </p>

          <div className="auth-stats">
            <div className="auth-stat">
              <div className="auth-stat-num">4,200+</div>
              <div className="auth-stat-label">Players</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-num">380+</div>
              <div className="auth-stat-label">Clubs</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-num">€12B+</div>
              <div className="auth-stat-label">Transfer Value</div>
            </div>
          </div>
        </div>

        <div className="auth-decorations">
          <div className="auth-ball auth-ball-1">⚽</div>
          <div className="auth-ball auth-ball-2">⚽</div>
          <div className="auth-ball auth-ball-3">⚽</div>
          <div className="auth-ball auth-ball-4">⚽</div>
          <div className="auth-ball auth-ball-5">⚽</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Create Account
            </button>
          </div>

          {globalError && <ErrorBanner message={globalError} onDismiss={() => setGlobalError('')} />}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setLoginErrors({});
                }}
                error={loginErrors.email}
                placeholder="you@transferx.com"
                icon="✉"
              />

              <PasswordInput
                label="Password"
                name="password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setLoginErrors({});
                }}
                error={loginErrors.password}
                placeholder="Enter your password"
              />

              <div className="auth-forgot">
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="auth-submit-spinner"></span> Signing in...
                  </>
                ) : (
                  'Sign In →'
                )}
              </button>

              <div className="auth-demo">
                <div className="auth-demo-title">🧪 Demo credentials</div>
                <div className="auth-demo-credentials">
                  user@transferx.com / user123
                  <br />
                  admin@transferx.com / admin123
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="auth-form">
              <FormInput
                label="Full Name"
                name="fullName"
                type="text"
                value={signupName}
                onChange={(e) => {
                  setSignupName(e.target.value);
                  setSignupErrors({});
                }}
                error={signupErrors.fullName}
                placeholder="Your full name"
                icon="👤"
              />

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(e.target.value);
                  setSignupErrors({});
                }}
                error={signupErrors.email}
                placeholder="you@transferx.com"
                icon="✉"
              />

              <div>
                <PasswordInput
                  label="Password"
                  name="password"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    setSignupErrors({});
                  }}
                  error={signupErrors.password}
                  placeholder="Min. 6 characters"
                />
                <PasswordStrengthBar password={signupPassword} />
              </div>

              <PasswordInput
                label="Confirm Password"
                name="confirm"
                value={signupConfirm}
                onChange={(e) => {
                  setSignupConfirm(e.target.value);
                  setSignupErrors({});
                }}
                error={signupErrors.confirm}
                placeholder="Repeat your password"
              />

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="auth-submit-spinner"></span> Creating account...
                  </>
                ) : (
                  'Create Account →'
                )}
              </button>

              <div className="auth-demo">
                <div className="auth-demo-title">🧪 Demo credentials</div>
                <div className="auth-demo-credentials">
                  user@transferx.com / user123
                  <br />
                  admin@transferx.com / admin123
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
