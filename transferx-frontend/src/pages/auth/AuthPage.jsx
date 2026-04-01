import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import FormInput from '../../components/FormInput';
import PasswordInput from '../../components/PasswordInput';
import PasswordStrengthBar from '../../components/PasswordStrengthBar';
import { validateLoginForm, validateSignupForm } from '../../utils/validators';
import { sanitizeEmail, sanitizeName, sanitizePassword, sanitizeInput } from '../../utils/sanitize';
import './AuthPage.css';

export default function AuthPage({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const toast = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupRole, setSignupRole] = useState('PLAYER');
  const [signupErrors, setSignupErrors] = useState({});

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    navigate(tab === 'login' ? '/login' : '/register', { replace: true });
    setLoginErrors({});
    setSignupErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validation = validateLoginForm({ email: loginEmail, password: loginPassword });
    if (!validation.valid) {
      console.log('Validation failed:', validation.errors);
      setLoginErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      // Sanitize input before sending to API
      const sanitizedEmail = sanitizeEmail(loginEmail);

      console.log('Sending login request with:', { email: sanitizedEmail });

      const res = await axiosClient.post('/auth/login', {
        email: sanitizedEmail,
        password: loginPassword // Don't sanitize password, keep original
      });

      console.log('Login response received:', res);

      const responseData = res.data?.data;
      if (!responseData) {
        throw new Error('Invalid response structure from server');
      }

      const { token, role, user } = responseData;
      
      if (!token || !user) {
        throw new Error('Missing token or user data in response');
      }

      const userName = user.name || user.email || 'User';
      const successMsg = `Welcome back, ${userName.split(' ')[0]}!`;
      
      console.log('Setting success state and logging in user:', user);
      
      setSuccess(successMsg);
      toast.success(successMsg);
      auth.login(token, role, user);

      console.log('Auth login complete, redirecting in 1.5 seconds...');

      setTimeout(() => {
        console.log('Navigating to:', role === 'ADMIN' ? '/admin/dashboard' : '/');
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Login error details:', err);
      let errorMessage = 'Login failed';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        if (Array.isArray(err.response.data.error)) {
          errorMessage = err.response.data.error.join(', ');
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.statusText) {
        errorMessage = `${err.response.status}: ${err.response.statusText}`;
      }

      console.error('Displaying error:', errorMessage);
      toast.error(errorMessage);
      console.error('Full error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validation = validateSignupForm({
      fullName: signupName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirm
    });
    
    if (!validation.valid) {
      console.log('Validation failed:', validation.errors);
      setSignupErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      // Sanitize input before sending to API
      const sanitizedName = sanitizeName(signupName);
      const sanitizedEmail = sanitizeEmail(signupEmail);

      console.log('Sending signup request with:', { sanitizedName, sanitizedEmail, role: signupRole });

      const res = await axiosClient.post('/auth/signup', {
        fullName: sanitizedName,
        email: sanitizedEmail,
        password: signupPassword, // Don't sanitize password, keep original
        role: signupRole
      });

      console.log('Signup response received:', res);
      
      const responseData = res.data?.data;
      if (!responseData) {
        throw new Error('Invalid response structure from server');
      }
      
      const { token, role, user } = responseData;
      
      if (!token || !user) {
        throw new Error('Missing token or user data in response');
      }

      const userName = user.name || user.email || 'User';
      const successMsg = `Welcome to TransferX, ${userName.split(' ')[0]}!`;
      
      console.log('Setting success state and logging in user:', user);
      
      setSuccess(successMsg);
      toast.success(successMsg);
      auth.login(token, role, user);

      console.log('Auth login complete, redirecting in 1.5 seconds...');
      
      setTimeout(() => {
        console.log('Navigating to home page');
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Signup error details:', err);
      let errorMessage = 'Registration failed';

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        // Handle validation errors array
        if (Array.isArray(err.response.data.error)) {
          errorMessage = err.response.data.error.join(', ');
        }
      } else if (err.response?.status === 409) {
        errorMessage = 'Email already registered';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.statusText) {
        errorMessage = `${err.response.status}: ${err.response.statusText}`;
      }

      console.error('Displaying error:', errorMessage);
      toast.error(errorMessage);
      console.error('Full error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config
      });
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


          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(sanitizeInput(e.target.value));
                  setLoginErrors({});
                }}
                error={loginErrors.email}
                placeholder="you@transferx.com"
                required
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
                required
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
            </form>
          ) : (
            <form onSubmit={handleSignup} className="auth-form">
              <FormInput
                label="Full Name"
                name="fullName"
                type="text"
                value={signupName}
                onChange={(e) => {
                  // remove any HTML characters as user types
                  setSignupName(sanitizeInput(e.target.value));
                  setSignupErrors({});
                }}
                error={signupErrors.fullName}
                placeholder="Your full name"
                required
              />

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={signupEmail}
                onChange={(e) => {
                  setSignupEmail(sanitizeInput(e.target.value));
                  setSignupErrors({});
                }}
                error={signupErrors.email}
                placeholder="you@transferx.com"
                required
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
                  required
                  minLength={6}
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
                placeholder="Re-enter your password"
                required
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
